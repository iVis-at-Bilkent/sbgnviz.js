var cyRenderer = require('../sbgn-extensions/sbgn-cy-renderer');
var libs = require('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

var ns = {};


// -------------- AuxiliaryUnit -------------- //
var AuxiliaryUnit = function (parent) {
  this.parent = parent;
  this.id = null;
  this.bbox = null;
  this.coordType = "relativeToCenter";
  this.anchorSide = null;
};

// draw the auxiliary unit at given position
AuxiliaryUnit.prototype.draw = function(context, centerX, centerY) {
  cytoscape.sbgn.drawRoundRectanglePath(context,
              centerX, centerY,
              this.bbox.w, this.bbox.h,
              Math.min(this.bbox.w / 2, this.bbox.h / 2, this.constructor.shapeRadius));
  context.fill();
  this.drawText(context, centerX, centerY);
  context.stroke();
};

// to be implemented by children
AuxiliaryUnit.prototype.getText = function() {
  throw new Error("Abstract method!");
};

// draw the statesOrInfo's label at given position
AuxiliaryUnit.prototype.drawText = function(context, centerX, centerY, truncate) {
  var fontSize = 9; // parseInt(textProp.height / 1.5);

  // part of : $$.sbgn.drawText(context, textProp);
  // save style before modification
  var oldFont = context.font;
  var oldStyle = context.fillStyle;
  var oldOpacity = context.globalAlpha;

  context.font = fontSize + "px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#0f0f0f";
  context.globalAlpha = this.parent.css('text-opacity') * this.parent.css('opacity'); // ?

  var text = this.getText();

  /*if (truncate == false) {
    text = textProp.label;
  } else {
    text = truncateText(textProp, context.font);
  }*/

  context.fillText(text, centerX, centerY);

  // restore saved style
  context.fillStyle = oldStyle;
  context.font = oldFont;
  context.globalAlpha = oldOpacity;
};

AuxiliaryUnit.prototype.getAbsoluteCoord = function() {
  if(this.coordType == "relativeToCenter") {
    var absX = this.bbox.x * this.parent.outerWidth() / 100 + this.parent._private.position.x;
    var absY = this.bbox.y * this.parent.outerHeight() / 100 + this.parent._private.position.y;
    return {x: absX, y: absY};
  }
  else if(this.coordType == "relativeToSide") {
    if (this.anchorSide == "top" || this.anchorSide == "bottom") {
      var absX = this.parent._private.position.x - this.parent.outerWidth() / 2 + this.bbox.x;
      var absY = this.bbox.y * this.parent.outerHeight() / 100 + this.parent._private.position.y;
    }
    else {
      var absY = this.parent._private.position.y - this.parent.outerHeight() / 2 + this.bbox.y;
      var absX = this.bbox.x * this.parent.outerWidth() / 100 + this.parent._private.position.x;
    }
    return {x: absX, y: absY};
  }
};

AuxiliaryUnit.prototype.setAnchorSide = function(parentBbox) {
  if(this.coordType == "relativeToCenter") {
    var thisX = this.bbox.x;
    var thisY = this.bbox.y;
    if(thisY > 45) {
      this.anchorSide = "bottom";
      this.bbox.y = 50;
    }
    else if (thisY < -45) {
      this.anchorSide = "top";
      this.bbox.y = -50;
    }
    else if (thisY => 0) {
      if (thisX > 45) {
        this.anchorSide = "right";
        this.bbox.x = 50;
      }
      else if (thisX < -45) {
        this.anchorSide = "left";
        this.bbox.x = -50;
      }
      else {
        this.anchorSide = "bottom";
        this.bbox.y = 50;
      }
    }
    else {
      if (thisX > 45) {
        this.anchorSide = "right";
        this.bbox.x = 50;
      }
      else if (thisX < -45) {
        this.anchorSide = "left";
        this.bbox.x = -50;
      }
      else {
        this.anchorSide = "top";
        this.bbox.y = -50;
      }
    }
  }
};

ns.AuxiliaryUnit = AuxiliaryUnit;
// -------------- END AuxiliaryUnit -------------- //

// -------------- StateVariable -------------- //
/**
 * parent has to be a stateful EPN (complex, macromolecule or nucleic acid)
 */
var StateVariable = function (value, stateVariableDefinition, parent) {
  AuxiliaryUnit.call(this, parent);
  this.state = {};
  this.state.value = value;
  this.state.variable = null;
  this.stateVariableDefinition = stateVariableDefinition;
  this.clazz = "state variable";
};
StateVariable.prototype = Object.create(AuxiliaryUnit.prototype);
StateVariable.prototype.constructor = StateVariable;
StateVariable.shapeRadius = 15;

StateVariable.prototype.getText = function() {
  var stateValue = this.state.value || '';
  var stateVariable = this.state.variable ? "@" + this.state.variable : "";

  return stateValue + stateVariable;
};

ns.StateVariable = StateVariable;
// -------------- END StateVariable -------------- //

// -------------- UnitOfInformation -------------- //
/**
 * parent can be an EPN, compartment or subunit
 */
var UnitOfInformation = function (code, value, parent) {
  AuxiliaryUnit.call(this, parent);
  this.code = code;
  this.value = value;
  this.label = null;
  this.clazz = "unit of information";
};
UnitOfInformation.prototype = Object.create(AuxiliaryUnit.prototype);
UnitOfInformation.prototype.constructor = UnitOfInformation;
UnitOfInformation.shapeRadius = 4;

UnitOfInformation.prototype.getText = function() {
  return this.label.text;
};

ns.UnitOfInformation = UnitOfInformation;
// -------------- END UnitOfInformation -------------- //

// -------------- EntityType -------------- //
/**
 * The type of the EPN, for example there can be severals myosin EPN, but only one myosin EntityType
 * This class will hold the information regarding state variable, that are shared between all myosins
 */
var EntityType = function (name, EPN) {
  this.name = name; // normally the same as its EPNs
  this.stateVariableDefinitions = []; // 0 or many shared state definitions
  this.EPNs = []; // there should always be at least 1 element, else no reason to exist
};

EntityType.prototype.createNewDefinitionFor = function (stateVar) {
  var newDefinition = new ns.StateVariableDefinition();
  newDefinition.entityType = this;
  newDefinition.stateVariables.push(stateVar);

  stateVar.stateVariableDefinition = newDefinition;
  stateVar.parent.data('entityType', this);
  this.stateVariableDefinitions.push(newDefinition);
};

EntityType.prototype.assignStateVariable = function (stateVar) {
  // first trivial case, no stateDefinition yet for this entityType, so this is a new one
  if (this.stateVariableDefinitions.length == 0) {
    this.createNewDefinitionFor(stateVar);
  }
  else { // if definitions are already present, we need to match those to the current stateVariable
    for(var i=0; i < this.stateVariableDefinitions.length; i++) {
      var matchStateDef = this.stateVariableDefinitions[i];
      if (matchStateDef.matchStateVariable(stateVar)){
        matchStateDef.stateVariables.push(stateVar);
        stateVar.stateVariableDefinition = matchStateDef;
        stateVar.parent.data('entityType', this);
        return;
      }
    }
    // if nothing was matched among the current stateVarDef of this entityType, create new one
    this.createNewDefinitionFor(stateVar);
  }
};

ns.EntityType = EntityType;
// -------------- END EntityType -------------- //

// -------------- StateVariableDefinition -------------- //
/**
 * The state variable definition is something shared across different EPNs
 * The concerned EPNs are linked through the entitype reference
 */
var StateVariableDefinition = function (name, entityType) {
  this.name = name;
  this.entityType = entityType; // reference to owning entity type
  this.stateVariables = []; // there should always be at least 1 element, else no reason to exist
};

/**
 * returns an array of elements that share this state definition
 */
StateVariableDefinition.prototype.getConcernedEPNs = function() {
  return this.entityType.EPNs;
};

/**
 * Guess if the provided stateVariable belongs to this stateVarDefinition
 * We consider it does, if either the statevar.value or statevar.variable are matching one 
 * if the statevar in the set of the StateVarDef
 * This is because we normally compare only stateVariables from the same entityType
 */
StateVariableDefinition.prototype.matchStateVariable = function(stateVar) {
  for(var i=0; i < this.stateVariables.length; i++) {
    var matchStateVar = this.stateVariables[i];
    // Don't match a stateVar against another one from the same element.
    // If 2 statevar on the same element, then they have to belong to 2 different stateVarDefinitions
    if(matchStateVar.parent === stateVar.parent) {
      continue;
    }
    //console.log("try", [matchStateVar.value, matchStateVar.variable], [stateVar.value, stateVar.variable]);
    // normal sure case. Example:
    // P T134 - undefined T134
    // P undef - P undef
    if (//(matchStateVar.value && stateVar.value && matchStateVar.value == stateVar.value ) ||
        (matchStateVar.variable && stateVar.variable && matchStateVar.variable == stateVar.variable)) {
      return true;
    }
    // more subtle case, with empty stateVar. Look only at value and discard variable
    // example: undef undef - P undef
    else if ((!matchStateVar.variable && !stateVar.variable) && (matchStateVar.value || stateVar.value)) {
      return true;
    }
  }
  return false;
};

ns.StateVariableDefinition = StateVariableDefinition;
// -------------- END StateVariableDefinition -------------- //

// -------------- AuxUnitLayout -------------- //
/**
 * Responsible for laying out the auxiliary units contained on a same edge
 */
var AuxUnitLayout = function (parentNode, location, alignment) {
  this.units = [];
  this.location = location;
  this.alignment = alignment || "left";
  this.parentNode = parentNode;
  this.renderLengthCache = [];
};
AuxUnitLayout.outerMargin = 10;
AuxUnitLayout.unitGap = 5;

AuxUnitLayout.prototype.addAuxUnit = function(unit) {
  this.units.push(unit);
  this.fillLengthCache();
};

/**
 * reorder boxes using their defined positions. From left to right and top to bottom.
 * this ensures that their order in the layout's list corresponds to the reality of the map.
 */
AuxUnitLayout.prototype.reorderFromPositions = function() {
  var self = this;
  this.units.sort(function(a, b) {
    if(self.location == "top" || self.location == "bottom") {
      if (a.bbox.x < b.bbox.x) {
        return -1;
      }
      if (a.bbox.x > b.bbox.x) {
        return 1;
      }
    }
    else {
      if (a.bbox.y < b.bbox.y) {
        return -1;
      }
      if (a.bbox.y > b.bbox.y) {
        return 1;
      }
    }
    return 0;
  });
  console.log("units after reoarder", this.units);
  this.fillLengthCache();
};

/**
 * use a cached list to determine what is the length needed to draw x aux units.
 * can then be compared against the parent node's dimensions, to decide how many
 * aux units to draw.
 */
AuxUnitLayout.prototype.fillLengthCache = function() {
  this.renderLengthCache = [0];
  var previous = AuxUnitLayout.outerMargin;
  for(var i=0; i < this.units.length; i++) {
    var currentLength;
    if(this.location == "bottom" || this.location == "top") {
      currentLength = this.units[i].bbox.w;
    }
    else {
      currentLength = this.units[i].bbox.h;
    }
    this.renderLengthCache.push(previous + currentLength + AuxUnitLayout.outerMargin);
    previous += currentLength + AuxUnitLayout.unitGap;
  }
  console.log("lignethcache", this.renderLengthCache);
};

/**
 * Use the cached precomputed lengths to decide how many units we are capable of drawing,
 * considering the size of the parent node.
 * The number returned says: we are able to draw the N first units of the lists. 
 */
AuxUnitLayout.prototype.getDrawableUnitAmount = function() {
  var availableSpace;
  if (this.location == "top" || this.location == "bottom") {
    availableSpace = this.parentNode.outerWidth();
  }
  else {
    availableSpace = this.parentNode.outerHeight();
  }
  for(var i=0; i < this.renderLengthCache.length; i++) {
    if(this.renderLengthCache[i] > availableSpace) {
      return i - 1;
    }
  }
  return this.units.length;
};

AuxUnitLayout.prototype.draw = function (context, parentX, parentY) {
  // first determine how many units we can draw, given the size of the parent node
  var drawableAmount = this.getDrawableUnitAmount();
  console.log("drawableAmount", drawableAmount);

  var lengthUsed = AuxUnitLayout.outerMargin;
  for(var i=0; i < drawableAmount; i++) {
    // change the coordinate system of the auxiliary unit according to the chosen layout
    var auxUnit = this.units[i];
    if (auxUnit.coordType != "relativeToSide") {
      if (auxUnit.coordType == "relativeToCenter") {
        if(this.location == "top" || this.location == "bottom") {
          //auxUnit.bbox.y = 0;
          auxUnit.bbox.x = lengthUsed + auxUnit.bbox.w / 2;
          lengthUsed += auxUnit.bbox.w + AuxUnitLayout.unitGap;
        }
        else {
          //auxUnit.bbox.x = 0;
          auxUnit.bbox.y = lengthUsed + auxUnit.bbox.h / 2;
          lengthUsed += auxUnit.bbox.h + AuxUnitLayout.unitGap;
        }
      }
      auxUnit.coordType = "relativeToSide"; 
    }
    // make each unit draw itself
    var coords = auxUnit.getAbsoluteCoord();
    auxUnit.draw(context, coords.x, coords.y);
  }
};

ns.AuxUnitLayout = AuxUnitLayout;
// -------------- END AuxUnitLayout -------------- //

module.exports = ns;

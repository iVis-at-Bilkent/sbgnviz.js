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
  this.isDisplayed = false;
};

// draw the auxiliary unit at given position
AuxiliaryUnit.prototype.draw = function(context) {
  var coords = this.getAbsoluteCoord();
  cytoscape.sbgn.drawRoundRectanglePath(context,
              coords.x, coords.y,
              this.bbox.w, this.bbox.h,
              Math.min(this.bbox.w / 2, this.bbox.h / 2, this.constructor.shapeRadius));
  context.fill();
  this.drawText(context, coords.x, coords.y);
  context.stroke();
  this.isDisplayed = true;
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

AuxiliaryUnit.prototype.addToParent = function (parentNode, location, position) {

  // add state var to the parent's statesandinfos
  parentNode.data('statesandinfos').push(this);

  if(!parentNode.data('auxunitlayouts')) { // ensure minimal initialization
    parentNode.data('auxunitlayouts', {});
  }
  if(!location) { // location not provided, need to define it automatically
    location = AuxUnitLayout.selectNextAvailable(parentNode);
  }
  // here we are sure to have a location even if it was not provided as argument
  // get or create the necessary layout
  if(!parentNode.data('auxunitlayouts')[location]) {
    parentNode.data('auxunitlayouts')[location] = new ns.AuxUnitLayout(parentNode, location);
  }
  var layout = parentNode.data('auxunitlayouts')[location];
  this.anchorSide = location;
  switch(location) {
    case "top": this.bbox.y = -50; break;
    case "bottom": this.bbox.y = 50; break;
    case "left": this.bbox.x = -50; break;
    case "right": this.bbox.x = -50; break;
  }
  // add stateVar to layout, precomputing of relative coords will be triggered accordingly
  var insertedPosition = layout.addAuxUnit(this, position);
  return insertedPosition;
}

AuxiliaryUnit.prototype.removeFromParent = function () {
  var parentLayout = this.parent.data('auxunitlayouts')[this.anchorSide];
  parentLayout.removeAuxUnit(this);
  if (parentLayout.isEmpty()){
    delete this.parent.data('auxunitlayouts')[this.anchorSide];
  }
  var statesandinfos = this.parent.data('statesandinfos');
  var index  = statesandinfos.indexOf(this);
  statesandinfos.splice(index, 1);
};

AuxiliaryUnit.prototype.getPositionIndex = function() {
  return this.parent.data('auxunitlayouts')[this.anchorSide].units.indexOf(this);
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

StateVariable.create = function(parentNode, value, variable, bbox, location, position) {
  // create the new state var of info
  var stateVar = new ns.StateVariable();
  stateVar.parent = parentNode;
  stateVar.value = value;
  stateVar.variable = variable;
  stateVar.state = {value: value, variable: variable};
  stateVar.bbox = bbox;

  // link to layout
  position = stateVar.addToParent(parentNode, location, position);

  return {
    index: stateVar.parent.data('statesandinfos').indexOf(stateVar),
    location: stateVar.anchorSide,
    position: position
  }
};

StateVariable.prototype.remove = function () {
  var position = this.getPositionIndex();
  this.removeFromParent();
  //console.log("after remove", this.parent.data('auxunitlayouts'), this.parent.data('statesandinfos'));
  return {
    clazz: "state variable",
    state: {
      value: this.state.value,
      variable: this.state.variable
    },
    bbox: {
      w: this.bbox.w,
      h: this.bbox.h
    },
    location: this.anchorSide,
    position: position
  };
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
  this.label = null; // from legacy code, contains {text: }
  this.clazz = "unit of information";
};
UnitOfInformation.prototype = Object.create(AuxiliaryUnit.prototype);
UnitOfInformation.prototype.constructor = UnitOfInformation;
UnitOfInformation.shapeRadius = 4;

UnitOfInformation.prototype.getText = function() {
  return this.label.text;
};

/**
 * Creates a unit of info and links everything accordingly
 * @param parentNode - the cytoscape element hosting the unit of information
 * @param value - its text
 * @param [location] - the side where it will be placed top, bottom, right, left or undefined (auto placement)
 * @param [position] - its index in the order of elements placed on its same location // TODO
 */
UnitOfInformation.create = function (parentNode, value, bbox, location, position) {
  // create the new unit of info
  var unit = new ns.UnitOfInformation();
  unit.parent = parentNode;
  unit.label = {text: value};
  unit.bbox = bbox;

  //console.log("will insert on", location, position);
  position = unit.addToParent(parentNode, location, position);

  return {
    index: unit.parent.data('statesandinfos').indexOf(unit),
    location: unit.anchorSide,
    position: position
  }
};

UnitOfInformation.prototype.remove = function () {
  var position = this.getPositionIndex();
  this.removeFromParent();
  //console.log("after remove", this.parent.data('auxunitlayouts'), this.parent.data('statesandinfos'));
  return {
    clazz: "unit of information",
    label: {
      text: this.label.text
    },
    bbox: {
      w: this.bbox.w,
      h: this.bbox.h
    },
    location: this.anchorSide,
    position: position
  };
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
alwaysShowAuxUnits = false;
var AuxUnitLayout = function (parentNode, location, alignment) {
  this.units = []; // this array may have empty indexes
  this.location = location;
  this.alignment = alignment || "left";
  this.parentNode = parentNode;
  this.renderLengthCache = [];
  this.maxUnitDisplayed = 4;
  this.lengthUsed = 0;
};
AuxUnitLayout.outerMargin = 10;
AuxUnitLayout.unitGap = 5;

AuxUnitLayout.prototype.update = function(doForceUpdate) {
  this.precomputeCoords(doForceUpdate);
};

AuxUnitLayout.prototype.addAuxUnit = function(unit, position) {
  if(typeof position != "undefined") {
    //console.log("add unit at positiion", position);
    this.units.splice(position, 0, unit);
  }
  else {
    this.units.push(unit);
    position = this.units.length - 1;
  }

  this.fillLengthCache();
  this.update(true);
  if (alwaysShowAuxUnits) {
    // set a minimum size according to both sides on the same orientation
    this.setParentMinLength();
    // need to resize the parent in case the space was too small
    this.resizeParent(this.lengthUsed);
  }
  cy.style().update();
  return position;
};

AuxUnitLayout.prototype.removeAuxUnit = function(unit) {
  var index = this.units.indexOf(unit);
  this.units.splice(index, 1);
  this.fillLengthCache();
  this.update(true);
  if (alwaysShowAuxUnits) {
    // set a minimum size according to both sides on the same orientation
    this.setParentMinLength();
  }
  cy.style().update();
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
  //console.log("units after reoarder", this.units);
  this.fillLengthCache();
  this.update();
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
  //console.log("lignethcache", this.renderLengthCache);
};

/**
 * Use the cached precomputed lengths to decide how many units we are capable of drawing,
 * considering the size of the parent node.
 * The number returned says: we are able to draw the N first units of the lists. 
 */
AuxUnitLayout.prototype.getDrawableUnitAmount = function() {
  // bypass this
  if(alwaysShowAuxUnits) {
    return this.units.length;
  }

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

// TODO find a way to refactor, remove ugliness of top-bottom/left-right.
AuxUnitLayout.prototype.precomputeCoords = function (doForceUpdate) {
  var drawableAmount = this.getDrawableUnitAmount();
  if (drawableAmount > this.maxUnitDisplayed && !alwaysShowAuxUnits) {
    drawableAmount = this.maxUnitDisplayed;
  }
  //console.log("precompute drawableAmount", drawableAmount);

  var lengthUsed = AuxUnitLayout.outerMargin;
  for(var i=0; i < this.units.length; i++) {
    // change the coordinate system of the auxiliary unit according to the chosen layout
    var auxUnit = this.units[i];
    if (auxUnit.coordType != "relativeToSide" || doForceUpdate) {
      if (auxUnit.coordType == "relativeToCenter" || doForceUpdate) {
        if(this.location == "top" || this.location == "bottom") {
          //auxUnit.bbox.y = 0;
          auxUnit.bbox.x = lengthUsed + auxUnit.bbox.w / 2;
        }
        else {
          //auxUnit.bbox.x = 0;
          auxUnit.bbox.y = lengthUsed + auxUnit.bbox.h / 2;
        }
      }
      auxUnit.coordType = "relativeToSide"; 
    }

    if(i < drawableAmount) {
      if(this.location == "top" || this.location == "bottom") {
        //auxUnit.bbox.y = 0;
        lengthUsed += auxUnit.bbox.w + AuxUnitLayout.unitGap;
      }
      else {
        //auxUnit.bbox.x = 0;
        lengthUsed += auxUnit.bbox.h + AuxUnitLayout.unitGap;
      }
      auxUnit.isDisplayed = true;
    }
    else {
      auxUnit.isDisplayed = false;
    }
  }
  // adjust the length, should be composed of outerMargin on the end, not unitGap
  lengthUsed = lengthUsed - AuxUnitLayout.unitGap + AuxUnitLayout.outerMargin;
  // in case we won't draw all the units, we set the rest of the unit's property isDisplayed to false
  /*for(var j=i; j < this.units.length; j++) {
    this.units[j].isDisplayed = false;
  }*/
  this.lengthUsed = lengthUsed;
};

AuxUnitLayout.prototype.draw = function (context) {
  for(var i=0; i < this.units.length; i++) {
    var auxUnit = this.units[i];
    if (auxUnit.isDisplayed) {
      // make each unit draw itself
      auxUnit.draw(context);
    }
  }
};

AuxUnitLayout.prototype.isEmpty = function() {
  return this.units.length == 0;
};

AuxUnitLayout.prototype.unitCount = function() {
  return this.units.length;
};

/**
 * Auto choose the next layout. To add a new aux unit, for example.
 */
AuxUnitLayout.selectNextAvailable = function(node) {
  var top = node.data('auxunitlayouts').top;
  var bottom = node.data('auxunitlayouts').bottom;
  var resultLocation = "top";

  // start by adding on top if free
  if(!top || top.isEmpty()) {
    resultLocation = "top";
  }
  else if(!bottom || bottom.isEmpty()) {
    resultLocation = "bottom";
  }
  else {
    // search for the side with the fewer units on it
    if(top.unitCount() <= bottom.unitCount()) {
      resultLocation = "top";
    }
    else {
      resultLocation = "bottom";
    }
  }
  return resultLocation;
};

AuxUnitLayout.prototype.resizeParent = function (length) {
  if(this.isTorB()) {
    if(this.parentNode.data('bbox').w < length) {
      cy.trigger("noderesize.resizestart", ["centerright", this.parentNode]);
      this.parentNode.data('bbox').w = length;
      cy.trigger("noderesize.resizeend", ["centerright", this.parentNode]);
    }
  }
  else {
    if(this.parentNode.data('bbox').h < length) {
      cy.trigger("noderesize.resizestart", ["bottomcenter", this.parentNode]);
      this.parentNode.data('bbox').h = length;
      cy.trigger("noderesize.resizeend", ["bottomcenter", this.parentNode]);
    }
  }
};

AuxUnitLayout.prototype.isTorB = function () {
  return this.location == "top" || this.location == "bottom";
};

AuxUnitLayout.prototype.isLorR = function () {
  return this.location == "left" || this.location == "right";
};

AuxUnitLayout.prototype.setParentMinLength = function () {
  var parentLayouts = this.parentNode.data('auxunitlayouts');
  switch(this.location) {
    case "top":
      var compareVal = parentLayouts.bottom ? parentLayouts.bottom.lengthUsed : 0;
      break;
    case "bottom":
      var compareVal = parentLayouts.top ? parentLayouts.top.lengthUsed : 0;
      break;
    case "left":
      var compareVal = parentLayouts.right ? parentLayouts.right.lengthUsed : 0;
      break;
    case "right":
      var compareVal = parentLayouts.left ? parentLayouts.left.lengthUsed : 0;
      break;
  }
  if(this.isTorB()) {
    this.parentNode.data('resizeMinWidth', Math.max(this.lengthUsed, compareVal));
  }
  else {
    this.parentNode.data('resizeMinHeight', Math.max(this.lengthUsed, compareVal));
  }
};

ns.AuxUnitLayout = AuxUnitLayout;
// -------------- END AuxUnitLayout -------------- //

module.exports = ns;

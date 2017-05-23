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
  //textProp.font = 
  //textProp.color = 
 
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
  
  //textProp.label = textProp.label || '';
  
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
  //context.stroke();
};

AuxiliaryUnit.prototype.getAbsoluteCoord = function() {
  if(this.coordType == "relativeToCenter") {
    var absX = this.bbox.x * this.parent.outerWidth() / 100 + this.parent._private.position.x;
    var absY = this.bbox.y * this.parent.outerHeight() / 100 + this.parent._private.position.y;
    return {x: absX, y: absY};
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
  this.value = value;
  this.variable = null;
  this.stateVariableDefinition = stateVariableDefinition;
  this.clazz = "state variable";
};
StateVariable.prototype = Object.create(AuxiliaryUnit.prototype);
StateVariable.prototype.constructor = StateVariable;
StateVariable.shapeRadius = 15;

StateVariable.prototype.getText = function() {
  var stateValue = this.value || '';
  var stateVariable = this.variable ? "@" + this.variable : "";

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


module.exports = ns;

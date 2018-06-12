
var libs = require('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;
// var optionUtilities = require('./option-utilities');
// var options = optionUtilities.getOptions();
var truncate = require('./text-utilities').truncate;

var ns = {};

// Keep in mind that for each method 'mainObj' parameter refers to the main object for which the operation will be done.
// It refers to the object that could be refered by 'this' while there was prototyping in these classes.
// For example AuxiliaryUnit.copy(mainObj, existingInstance, newParent, newId) copies the variable passed by 'mainObj'
// parameter and in this case 'mainObj' can be considered as `the object to be copied`

// The old constructors are replaced by 'construct()' methods while removing prototyping from the classes.

// 'AuxiliaryUnit' and 'AuxUnitLayout' objects keep the id of their parent nodes instead of the nodes themselves to avoid circular references.
// To maintain this property related methods to get and set parent nodes should be used instead of directly accessing the parent object.

// Also, there is a parent-child relationship between the AuxiliaryUnit class and StateVariable and UnitOfInformation
// classes. While calling a method of AuxiliaryUnit class that method should be called from
// the actual class of related auxilary unit (Would be StateVariable or UnitOfInformation. This is needed to prevent conflictions when the
// methods of AuxiliaryUnit class is overriden by these classes). That class can be obtained by calling 'getAuxUnitClass(mainObj)'
// method for the auxilary unit object.

var getAuxUnitClass = function(unit) {
  // Unit parameter may pass the unit itself or the type of the unit check it
  var unitType = typeof unit === 'string' ? unit : unit.clazz;
  // Retrieve and return unit class according to the unit type
  var className = unitType === 'state variable' ? 'StateVariable' : 'UnitOfInformation';
  return ns[className];
};

ns.getAuxUnitClass = getAuxUnitClass; // Expose getAuxUnitClass method

var AuxiliaryUnit = {};

// -------------- AuxiliaryUnit -------------- //
// constructs a new auxiliary unit object and returns it
AuxiliaryUnit.construct = function(parent) {
  var obj = {};

  AuxiliaryUnit.setParentRef(obj, parent);

  obj.id = null;
  obj.bbox = null;
  obj.coordType = "relativeToCenter";
  obj.anchorSide = null;
  obj.isDisplayed = false;
  obj.dashed = false;

  return obj;
};

AuxiliaryUnit.getParent = function(mainObj, cy) {
  var parent = mainObj.parent;
  // If parent variable stores the id of parent instead of the actual parent get the actual parent by id
  if (typeof parent === 'string') {
    return cy.getElementById(parent);
  }

  return parent;
};

AuxiliaryUnit.setParentRef = function(mainObj, newParent) {
  if (mainObj && newParent) {
    // Reference to id instead of the node itself to avaoid circular reference
    mainObj.parent = typeof newParent === 'string' ? newParent : newParent.id();
  }
}

AuxiliaryUnit.defaultBackgroundColor = "#ffffff";

/*
 * Return a new AuxiliaryUnit object. A new parent reference and new id can
 * optionnally be passed.
 */
AuxiliaryUnit.copy = function (mainObj, cy, existingInstance, newParent, newId) {
  var newUnit = existingInstance ? existingInstance : AuxiliaryUnit.construct();

  var parentToSet = newParent || getAuxUnitClass(mainObj).getParent(mainObj, cy);
  AuxiliaryUnit.setParentRef(newUnit, parentToSet);

  newUnit.id = newId ? newId : mainObj.id;
  newUnit.bbox = jQuery.extend(true, {}, mainObj.bbox);
  newUnit.coordType = mainObj.coordType;
  newUnit.anchorSide = mainObj.anchorSide;
  newUnit.isDisplayed = mainObj.isDisplayed;
  newUnit.dashed = mainObj.dashed;
  return newUnit;
};

// draw the auxiliary unit at its position
AuxiliaryUnit.draw = function(mainObj, cy, context) {
  var unitClass = getAuxUnitClass(mainObj);
  var coords = unitClass.getAbsoluteCoord(mainObj, cy);
  if (mainObj.dashed === true) {
    context.setLineDash([2,2]);
  }
  else {
    context.setLineDash([]);
  }
  unitClass.drawShape(mainObj, cy, context, coords.x, coords.y);
  if (unitClass.hasText(mainObj, cy)) {
    unitClass.drawText(mainObj, cy, context, coords.x, coords.y);
  }
  mainObj.isDisplayed = true;
};

// to be implemented by children
AuxiliaryUnit.getText = function(mainObj, cy) {
  throw new Error("Abstract method!");
};
AuxiliaryUnit.hasText = function(mainObj, cy) {
  throw new Error("Abstract method!");
};
AuxiliaryUnit.drawShape = function(mainObj, cy, context, x, y) {
  throw new Error("Abstract method!");
};

// draw the statesOrInfo's label at given position
AuxiliaryUnit.drawText = function(mainObj, cy, context, centerX, centerY) {
  // access the sbgnvizParams set for cy
  var options = cy.scratch('_sbgnviz').sbgnvizParams.optionUtilities.getOptions();
  var unitClass = getAuxUnitClass(mainObj);
  var parent = unitClass.getParent(mainObj, cy);
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
  context.globalAlpha = parent.css('text-opacity') * parent.css('opacity'); // ?

  var text;
  if(options.fitLabelsToInfoboxes()){
    // here we memoize the truncated text into _textCache,
    // as it is not something that changes so much
    text = unitClass.getText(mainObj, cy);
    var key = text + context.font + mainObj.bbox.w;
    if(mainObj._textCache && mainObj._textCache[key]) {
      text = mainObj._textCache[key];
    }
    else {
      text = truncate(unitClass.getText(mainObj, cy), context.font, mainObj.bbox.w);
      if(!mainObj._textCache) {
        mainObj._textCache = {};
      }
      mainObj._textCache[key] = text;
    }
  }
  else {
    text = unitClass.getText(mainObj, cy);
  }

  context.fillText(text, centerX, centerY);

  // restore saved style
  context.fillStyle = oldStyle;
  context.font = oldFont;
  context.globalAlpha = oldOpacity;
};

AuxiliaryUnit.getAbsoluteCoord = function(mainObj, cy) {
  var parent = getAuxUnitClass(mainObj).getParent(mainObj, cy);
  var position = parent.position();
  if (mainObj === undefined || parent === undefined || position === undefined) {
    return;
  }
  var borderWidth = parent.data()["border-width"];
  if ( borderWidth === undefined) {
    return;
  }
  if(mainObj.coordType == "relativeToCenter") {
    var absX = mainObj.bbox.x * (parent.outerWidth() - borderWidth) / 100 + position.x;
    var absY = mainObj.bbox.y * (parent.outerHeight() - borderWidth) / 100 + position.y;
    return {x: absX, y: absY};
  }
  else if(mainObj.coordType == "relativeToSide") {
    if (mainObj.anchorSide == "top" || mainObj.anchorSide == "bottom") {
      var absX = position.x - (parent.outerWidth() - borderWidth) / 2 + mainObj.bbox.x;
      var absY = mainObj.bbox.y * (parent.outerHeight() - borderWidth) / 100 + position.y;
    }
    else {
      var absY = position.y - (parent.outerHeight() - borderWidth) / 2 + mainObj.bbox.y;
      var absX = mainObj.bbox.x * (parent.outerWidth() - borderWidth) / 100 + position.x;
    }

  // due to corner of barrel shaped compartment shift absX to right
  if (parent.data("class") == "compartment"){
      absX += parent.outerWidth() * 0.1;
  };
    return {x: absX, y: absY};
  }
};

AuxiliaryUnit.convertToAbsoluteCoord = function(mainObj, relX, relY, cy) {
  var parent = getAuxUnitClass(mainObj).getParent(mainObj, cy);
  if(mainObj.coordType == "relativeToCenter") {
    var absX = relX * (parent.outerWidth() - parent._private.data['border-width']) / 100 + parent._private.position.x;
    var absY = relY  * (parent.outerHeight() - parent._private.data['border-width']) / 100 + parent._private.position.y;
    return {x: absX, y: absY};
  }
  else if(mainObj.coordType == "relativeToSide") {
    if (mainObj.anchorSide == "top" || mainObj.anchorSide == "bottom") {
      var absX = parent._private.position.x - (parent.outerWidth() - parent._private.data['border-width']) / 2 + relX;
      var absY = relY  * (parent.outerHeight() - parent._private.data['border-width']) / 100 + parent._private.position.y;
    }
    else {
      var absY = parent._private.position.y - (parent.outerHeight() - parent._private.data['border-width']) / 2 + relY ;
      var absX = relX * (parent.outerWidth() - parent._private.data['border-width']) / 100 + parent._private.position.x;
    }

  // due to corner of barrel shaped compartment shift absX to right
  if (parent.data("class") == "compartment"){
      absX += parent.outerWidth() * 0.1;
  };
    return {x: absX, y: absY};
  }
};

AuxiliaryUnit.convertToRelativeCoord = function(mainObj, absX, absY, cy){
  var parent = getAuxUnitClass(mainObj).getParent(mainObj, cy);
  // due to corner of barrel shaped compartment shift absX to right

  if(mainObj.coordType == "relativeToCenter") {
    var relX = (absX - parent._private.position.x) * 100 / (parent.outerWidth() - parent._private.data['border-width']);
    var relY = (absY - parent._private.position.y) * 100 / (parent.outerHeight() - parent._private.data['border-width']);
    return {x: relX, y: relY};
  }
  else if(mainObj.coordType == "relativeToSide") {
    if (parent.data("class") == "compartment"){
        absX -= parent.outerWidth() * 0.1;
    };
    if (mainObj.anchorSide == "top" || mainObj.anchorSide == "bottom") {
      var relX = absX - parent._private.position.x + (parent.outerWidth() - parent._private.data['border-width']) / 2;
      var relY = (absY - parent._private.position.y) * 100 / (parent.outerHeight() - parent._private.data['border-width']);
    }
    else {
      var relY = absY - parent._private.position.y + (parent.outerHeight() - parent._private.data['border-width']) / 2;
      var relX = (absX - parent._private.position.x) * 100 / (parent.outerWidth() - parent._private.data['border-width']);
    }

    return {x: relX, y: relY};
  }
};

AuxiliaryUnit.setAnchorSide = function(mainObj, parentBbox) {
  if(mainObj.coordType == "relativeToCenter") {
    var thisX = mainObj.bbox.x;
    var thisY = mainObj.bbox.y;
    if(thisY > 45) {
      mainObj.anchorSide = "bottom";
      mainObj.bbox.y = 50;
    }
    else if (thisY < -45) {
      mainObj.anchorSide = "top";
      mainObj.bbox.y = -50;
    }
    else if (thisY >= 0) {
      if (thisX > 45) {
        mainObj.anchorSide = "right";
        mainObj.bbox.x = 50;
      }
      else if (thisX < -45) {
        mainObj.anchorSide = "left";
        mainObj.bbox.x = -50;
      }
      else {
        mainObj.anchorSide = "bottom";
        mainObj.bbox.y = 50;
      }
    }
    else {
      if (thisX > 45) {
        mainObj.anchorSide = "right";
        mainObj.bbox.x = 50;
      }
      else if (thisX < -45) {
        mainObj.anchorSide = "left";
        mainObj.bbox.x = -50;
      }
      else {
        mainObj.anchorSide = "top";
        mainObj.bbox.y = -50;
      }
    }
  }
};

AuxiliaryUnit.addToParent = function (mainObj, cy, parentNode, location, position, index) {

  // add state var to the parent's statesandinfos
  if(typeof index != "undefined") { // specific index provided (for undo/redo consistency)
    parentNode.data('statesandinfos').splice(index, 0, mainObj);
  }
  else {
    parentNode.data('statesandinfos').push(mainObj);
  }

  if(!parentNode.data('auxunitlayouts')) { // ensure minimal initialization
    parentNode.data('auxunitlayouts', {});
  }
  if(!location) { // location not provided, need to define it automatically
    location = AuxUnitLayout.selectNextAvailable(parentNode, cy);
  }
  // here we are sure to have a location even if it was not provided as argument
  // get or create the necessary layout
  if(!parentNode.data('auxunitlayouts')[location]) {
    parentNode.data('auxunitlayouts')[location] = AuxUnitLayout.construct(parentNode, location);
  }

  var layout = parentNode.data('auxunitlayouts')[location];
  mainObj.anchorSide = location;
  switch(location) {
    case "top": mainObj.bbox.y = -50; break;
    case "bottom": mainObj.bbox.y = 50; break;
    case "left": mainObj.bbox.x = -50; break;
    case "right": mainObj.bbox.x = -50; break;
  }
  // add stateVar to layout, precomputing of relative coords will be triggered accordingly
  var insertedPosition = AuxUnitLayout.addAuxUnit(layout, cy, mainObj, position);
  return insertedPosition;
}

AuxiliaryUnit.removeFromParent = function (mainObj, cy) {
  var parent = getAuxUnitClass(mainObj).getParent(mainObj, cy);
  var parentLayout = parent.data('auxunitlayouts')[mainObj.anchorSide];
  AuxUnitLayout.removeAuxUnit(parentLayout, cy, mainObj);
  if (AuxUnitLayout.isEmpty(parentLayout)){
    delete parent.data('auxunitlayouts')[mainObj.anchorSide];
  }
  var statesandinfos = parent.data('statesandinfos');
  var index  = statesandinfos.indexOf(mainObj);
  statesandinfos.splice(index, 1);
};

AuxiliaryUnit.getPositionIndex = function(mainObj, cy) {
  return getAuxUnitClass(mainObj).getParent(mainObj, cy).data('auxunitlayouts')[mainObj.anchorSide].units.indexOf(mainObj);
};

ns.AuxiliaryUnit = AuxiliaryUnit;
// -------------- END AuxiliaryUnit -------------- //

// -------------- StateVariable -------------- //
/**
 * parent has to be a stateful EPN (complex, macromolecule or nucleic acid)
 */

var StateVariable = {};

// StateVariable extends AuxiliaryUnit by inheriting each static property of it
for (var prop in AuxiliaryUnit) {
  StateVariable[prop] = AuxiliaryUnit[prop];
}

// Construct a state variable object by extending default behaviours of a AuxiliaryUnit object and returns that object
StateVariable.construct = function(value, stateVariableDefinition, parent) {
  var obj = AuxiliaryUnit.construct(parent);
  obj.state = {};
  obj.state.value = value;
  obj.state.variable = null;
  obj.stateVariableDefinition = stateVariableDefinition;
  obj.clazz = "state variable";

  return obj;
};

StateVariable.shapeRadius = 15;

StateVariable.getText = function(mainObj) {
  var stateValue = mainObj.state.value || '';
  var stateVariable = mainObj.state.variable ? "@" + mainObj.state.variable : "";

  return stateValue + stateVariable;
};

StateVariable.hasText = function(mainObj) {
  return (mainObj.state.value && mainObj.state.value != "") || (mainObj.state.variable && mainObj.state.variable != "");
};

StateVariable.drawShape = function(mainObj, cy, context, x, y) {
  cytoscape.sbgn.drawRoundRectanglePath(context,
              x, y,
              mainObj.bbox.w, mainObj.bbox.h,
              Math.min(mainObj.bbox.w / 2, mainObj.bbox.h / 2, StateVariable.shapeRadius));
  var tmp_ctxt = context.fillStyle;
  context.fillStyle = StateVariable.defaultBackgroundColor;
  context.fill();
  context.fillStyle = tmp_ctxt;
  context.stroke();
};

StateVariable.create = function(parentNode, cy, value, variable, bbox, location, position, index) {
  // create the new state var of info
  var stateVar = StateVariable.construct();
  StateVariable.setParentRef(stateVar, parentNode);

  stateVar.value = value;
  stateVar.variable = variable;
  stateVar.state = {value: value, variable: variable};
  stateVar.bbox = bbox;

  // link to layout
  position = StateVariable.addToParent(stateVar, cy, parentNode, location, position, index);
  return {
    index: StateVariable.getParent(stateVar, cy).data('statesandinfos').indexOf(stateVar),
    location: stateVar.anchorSide,
    position: position
  }

};

StateVariable.remove = function (mainObj, cy) {
  var position = StateVariable.getPositionIndex(mainObj, cy);
  var index = StateVariable.getParent(mainObj, cy).data('statesandinfos').indexOf(mainObj);
  StateVariable.removeFromParent(mainObj, cy);
  //console.log("after remove", this.parent.data('auxunitlayouts'), this.parent.data('statesandinfos'));
  return {
    clazz: "state variable",
    state: {
      value: mainObj.state.value,
      variable: mainObj.state.variable
    },
    bbox: {
      w: mainObj.bbox.w,
      h: mainObj.bbox.h
    },
    location: mainObj.anchorSide,
    position: position,
    index: index
  };
};

StateVariable.copy = function(mainObj, cy, newParent, newId) {
  var newStateVar = AuxiliaryUnit.copy(mainObj, cy, StateVariable.construct(), newParent, newId);
  newStateVar.state = jQuery.extend(true, {}, mainObj.state);
  newStateVar.stateVariableDefinition = mainObj.stateVariableDefinition;
  newStateVar.clazz = mainObj.clazz;
  return newStateVar;
};

ns.StateVariable = StateVariable;
// -------------- END StateVariable -------------- //

// -------------- UnitOfInformation -------------- //
/**
 * parent can be an EPN, compartment or subunit
 */

var UnitOfInformation = {};

// UnitOfInformation extends AuxiliaryUnit by inheriting each static property of it
for (var prop in AuxiliaryUnit) {
  UnitOfInformation[prop] = AuxiliaryUnit[prop];
}

// Constructs a UnitOfInformation object by extending properties of an AuxiliaryUnit object and return that object
UnitOfInformation.construct = function(value, parent) {
  var obj = AuxiliaryUnit.construct(parent);
  obj.label = {text: value}; // from legacy code, contains {text: }
  obj.clazz = "unit of information";

  return obj;
};

UnitOfInformation.shapeRadius = 4;

UnitOfInformation.getText = function(mainObj) {
  return mainObj.label.text;
};

UnitOfInformation.hasText = function(mainObj) {
  return mainObj.label.text && mainObj.label.text != "";
};

UnitOfInformation.drawShape = function(mainObj, cy, context, x, y) {
  cytoscape.sbgn.UnitOfInformationShapeFn(context, x, y, mainObj.bbox.w, mainObj.bbox.h,
                  getAuxUnitClass(mainObj).getParent(mainObj, cy).data("class"));
  var tmp_ctxt = context.fillStyle;
  context.fillStyle = UnitOfInformation.defaultBackgroundColor;
  context.fill();
  context.fillStyle = tmp_ctxt;
  context.stroke();
};

/**
 * Creates a unit of info and links everything accordingly
 * @param parentNode - the cytoscape element hosting the unit of information
 * @param value - its text
 * @param [location] - the side where it will be placed top, bottom, right, left or undefined (auto placement)
 * @param [position] - its position in the order of elements placed on the same location
 * @param [index] - its index in the statesandinfos list
 */
UnitOfInformation.create = function (parentNode, cy, value, bbox, location, position, index) {
  // create the new unit of info
  var unit = UnitOfInformation.construct(value, parentNode);
  unit.bbox = bbox;

  //console.log("will insert on", location, position);
  position = UnitOfInformation.addToParent(unit, cy, parentNode, location, position, index);

  return {
    index: UnitOfInformation.getParent(unit, cy).data('statesandinfos').indexOf(unit),
    location: unit.anchorSide,
    position: position
  }
};

UnitOfInformation.remove = function (mainObj, cy) {
  var position = UnitOfInformation.getPositionIndex(mainObj, cy);
  var index = UnitOfInformation.getParent(mainObj, cy).data('statesandinfos').indexOf(mainObj);
  UnitOfInformation.removeFromParent(mainObj, cy);
  //console.log("after remove", this.parent.data('auxunitlayouts'), this.parent.data('statesandinfos'));
  return {
    clazz: "unit of information",
    label: {
      text: mainObj.label.text
    },
    bbox: {
      w: mainObj.bbox.w,
      h: mainObj.bbox.h
    },
    location: mainObj.anchorSide,
    position: position,
    index: index
  };
};

UnitOfInformation.copy = function(mainObj, cy, newParent, newId) {
  var newUnitOfInfo = AuxiliaryUnit.copy(mainObj, cy, UnitOfInformation.construct(), newParent, newId);
  newUnitOfInfo.label = jQuery.extend(true, {}, mainObj.label);
  newUnitOfInfo.clazz = mainObj.clazz;
  return newUnitOfInfo;
};

ns.UnitOfInformation = UnitOfInformation;
// -------------- END UnitOfInformation -------------- //

// -------------- EntityType -------------- //
/**
 * The type of the EPN, for example there can be severals myosin EPN, but only one myosin EntityType
 * This class will hold the information regarding state variable, that are shared between all myosins
 */

var EntityType = {};

// Constructs an EntityType object and returns it
EntityType.construct = function(name, EPN) {
  var obj = {};
  obj.name = name; // normally the same as its EPNs
  obj.stateVariableDefinitions = []; // 0 or many shared state definitions
  obj.EPNs = []; // there should always be at least 1 element, else no reason to exist
  return obj;
};

EntityType.createNewDefinitionFor = function (mainObj, stateVar) {
  var newDefinition = StateVariableDefinition.construct();
  newDefinition.entityType = mainObj;
  newDefinition.stateVariables.push(stateVar);

  stateVar.stateVariableDefinition = newDefinition;
  stateVar.parent.data('entityType', mainObj);
  mainObj.stateVariableDefinitions.push(newDefinition);
};

EntityType.assignStateVariable = function (mainObj, stateVar) {
  // first trivial case, no stateDefinition yet for this entityType, so this is a new one
  if (mainObj.stateVariableDefinitions.length == 0) {
    EntityType.createNewDefinitionFor(mainObj, stateVar);
  }
  else { // if definitions are already present, we need to match those to the current stateVariable
    for(var i=0; i < mainObj.stateVariableDefinitions.length; i++) {
      var matchStateDef = mainObj.stateVariableDefinitions[i];
      if (StateVariableDefinition.matchStateVariable(matchStateDef, stateVar)){
        matchStateDef.stateVariables.push(stateVar);
        stateVar.stateVariableDefinition = matchStateDef;
        stateVar.parent.data('entityType', mainObj);
        return;
      }
    }
    // if nothing was matched among the current stateVarDef of this entityType, create new one
    EntityType.createNewDefinitionFor(mainObj, stateVar);
  }
};

ns.EntityType = EntityType;
// -------------- END EntityType -------------- //

// -------------- StateVariableDefinition -------------- //
/**
 * The state variable definition is something shared across different EPNs
 * The concerned EPNs are linked through the entitype reference
 */

var StateVariableDefinition = {};

// Constructs a new StateVariableDefinition object and returns it
StateVariableDefinition.construct = function(name, entityType) {
  var obj = {};
  obj.name = name;
  obj.entityType = entityType; // reference to owning entity type
  obj.stateVariables = []; // there should always be at least 1 element, else no reason to exist
  return obj;
};

/**
 * returns an array of elements that share this state definition
 */
StateVariableDefinition.getConcernedEPNs = function(mainObj) {
  return mainObj.entityType.EPNs;
};

/**
 * Guess if the provided stateVariable belongs to this stateVarDefinition
 * We consider it does, if either the statevar.value or statevar.variable are matching one
 * if the statevar in the set of the StateVarDef
 * This is because we normally compare only stateVariables from the same entityType
 */
StateVariableDefinition.matchStateVariable = function(mainObj, stateVar) {
  for(var i=0; i < mainObj.stateVariables.length; i++) {
    var matchStateVar = mainObj.stateVariables[i];
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

var AuxUnitLayout = {};

AuxUnitLayout.construct = function(parentNode, location, alignment) {
  var obj = {};
  obj.units = [];
  obj.location = location;
  obj.alignment = alignment || "left"; // this was intended to be used, but it isn't for now
  AuxUnitLayout.setParentNodeRef(obj, parentNode);

  obj.renderLengthCache = [];
  obj.lengthUsed = 0;

  // specific rules for the layout
  if(parentNode.data('class') == "simple chemical") {
    obj.outerMargin = 3;
  }

  return obj;
};

AuxUnitLayout.getParentNode = function(mainObj, cy) {
  var parentNode = mainObj.parentNode;

  // If parentNode is id of parent node rather than being itself get the parent node by that id
  if (typeof parentNode === 'string') {
    return cy.getElementById(parentNode)
  }

  return parentNode;
};

AuxUnitLayout.setParentNodeRef = function(mainObj, parentNode) {
  if (mainObj && parentNode) {
    // Keep id of parent node to avaoid circular references
    mainObj.parentNode = typeof parentNode === 'string' ? parentNode : parentNode.id();
  }
}

/**
 * outerMargin: the left and right space left between the side of the node, and the first (and last) box
 * unitGap: the space between the auxiliary units
 * alwaysShowAuxUnits: bypasses any limit of units displayed, and prevent units from disappearing,
 * forcing a minimum size for the node
 * maxUnitDisplayed: show at most this amount of units, even when there is enough space
 *
 * These options can be defined at the instance level. If it is found in an instance, then it
 * takes precedence. If not found, the following class' values are used.
 */
AuxUnitLayout.outerMargin = 5;
AuxUnitLayout.unitGap = 5;
AuxUnitLayout.currentTopUnitGap = 5;
AuxUnitLayout.currentBottomUnitGap = 5;
AuxUnitLayout.currentLeftUnitGap = 5;
AuxUnitLayout.currentRightUnitGap = 5;
AuxUnitLayout.alwaysShowAuxUnits = true;
AuxUnitLayout.maxUnitDisplayed = -1;
AuxUnitLayout.lastPos = -1;

AuxUnitLayout.update = function(mainObj, cy, doForceUpdate) {
  AuxUnitLayout.precomputeCoords(mainObj, cy, doForceUpdate);
};

AuxUnitLayout.addAuxUnit = function(mainObj, cy, unit, position) {
  if(typeof position != "undefined") {
    //console.log("add unit at positiion", position);
    mainObj.units.splice(position, 0, unit);
  }
  else {
    mainObj.units.push(unit);
    position = mainObj.units.length - 1;
  }

  AuxUnitLayout.updateLengthCache(mainObj, cy);
  AuxUnitLayout.update(mainObj, cy, true);/*
  if (AuxUnitLayout.getAlwaysShowAuxUnits(mainObj)) {
    // set a minimum size according to both sides on the same orientation
    AuxUnitLayout.setParentMinLength(mainObj, cy);
    // need to resize the parent in case the space was too small
    AuxUnitLayout.resizeParent(mainObj, cy, mainObj.lengthUsed);
  }*/
  //cy.style().update(); // <- was it really necessary ?
  var parentNode = AuxUnitLayout.getParentNode(mainObj, cy);
  return position;
};

AuxUnitLayout.removeAuxUnit = function(mainObj, cy, unit) {
  var index = mainObj.units.indexOf(unit);
  mainObj.units.splice(index, 1);
  AuxUnitLayout.updateLengthCache(mainObj, cy);
  AuxUnitLayout.update(mainObj, cy, true);/*
  if (AuxUnitLayout.getAlwaysShowAuxUnits(mainObj)) {
    // set a minimum size according to both sides on the same orientation
    AuxUnitLayout.setParentMinLength(mainObj, cy);
  }*/
  var parentNode = AuxUnitLayout.getParentNode(mainObj, cy);
  cy.style().update();
};

/**
 * reorder boxes using their defined positions. From left to right and top to bottom.
 * this ensures that their order in the layout's list corresponds to the reality of the map.
 */
AuxUnitLayout.reorderFromPositions = function(mainObj, cy) {
  mainObj.units.sort(function(a, b) {
    if(mainObj.location == "top" || mainObj.location == "bottom") {
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
  AuxUnitLayout.updateLengthCache(mainObj, cy);
  AuxUnitLayout.update(mainObj, cy, true);
};

/**
 * use a cached list to determine what is the length needed to draw x aux units.
 * can then be compared against the parent node's dimensions, to decide how many
 * aux units to draw.
 */
AuxUnitLayout.updateLengthCache = function(mainObj, cy) {
  mainObj.renderLengthCache = [0];
  var previous = AuxUnitLayout.getOuterMargin(mainObj);
  for(var i=0; i < mainObj.units.length; i++) {
    var currentLength;
    if(AuxUnitLayout.isTorB(mainObj)) {
      currentLength = mainObj.units[i].bbox.w;
    }
    else {
      currentLength = mainObj.units[i].bbox.h;
    }
    mainObj.renderLengthCache.push(previous + currentLength + AuxUnitLayout.getOuterMargin(mainObj));
    previous += currentLength + AuxUnitLayout.getUnitGap(mainObj);
  }
};

/**
 * Use the cached precomputed lengths to decide how many units we are capable of drawing,
 * considering the size of the parent node.
 * The number returned says: we are able to draw the N first units of the lists.
 * Unused for now.
 */
AuxUnitLayout.getDrawableUnitAmount = function(mainObj) {
  if(AuxUnitLayout.getAlwaysShowAuxUnits(mainObj)) {
    // bypass all this
    return mainObj.units.length;
  }

  // get the length of the side on which we draw
  var availableSpace;
  if (AuxUnitLayout.isTorB(mainObj)) {
    availableSpace = AuxUnitLayout.getParentNode(mainObj, cy).outerWidth();
  }
  else {
    availableSpace = AuxUnitLayout.getParentNode(mainObj, cy).outerHeight();
  }
  // loop over the cached precomputed lengths
  for(var i=0; i < mainObj.renderLengthCache.length; i++) {
    if(mainObj.renderLengthCache[i] > availableSpace) {
      // stop if we overflow
      return i - 1;
    }
  }
  return mainObj.units.length;
};

AuxUnitLayout.setDisplayedUnits = function (mainObj, cy) {
  // get the length of the side on which we draw

  var availableSpace;
  if (AuxUnitLayout.isTorB(mainObj)) {
    availableSpace = AuxUnitLayout.getParentNode(mainObj, cy).outerWidth();
    // due to corner of barrel shaped compartment decrease availableSpace -- no infobox on corners
    if (AuxUnitLayout.getParentNode(mainObj, cy).data("class") == "compartment")
        availableSpace *= 0.8;
  }
  else {
    availableSpace = AuxUnitLayout.getParentNode(mainObj, cy).outerHeight();
  }

  // there is always n+1 elements in the cachedLength for n units
  var alwaysShowAuxUnits = AuxUnitLayout.getAlwaysShowAuxUnits(mainObj);
  var maxUnitDisplayed = AuxUnitLayout.getMaxUnitDisplayed(mainObj);
  for(var i=0; i < mainObj.units.length; i++) {
    if((mainObj.renderLengthCache[i+1] <= availableSpace // do we have enough space?
      && (maxUnitDisplayed == -1 || i < maxUnitDisplayed)) // is there no limit? or are we under that limit?
      || alwaysShowAuxUnits) { // do we always want to show everything regardless?
      mainObj.units[i].isDisplayed = true;
    }
    else {
      mainObj.units[i].isDisplayed = false;
    }
  }
};


AuxUnitLayout.getUsedWidth = function(node, tb){
  var units = tb.units;
  var totalWidth = 0;
  for (var i = 0; i < units.length; i++) {
    totalWidth += units[i].bbox.w;
  }
  return totalWidth;
}

AuxUnitLayout.getUsedHeight = function(node, tb){
  var units = tb.units;
  var totalHeight = 0;
  for (var i = 0; i < units.length; i++) {
    totalHeight += units[i].bbox.h;
  }
  return totalHeight;
}

AuxUnitLayout.getUsedLengthTB = function(node, tb){
  var units = tb.units;
  return AuxUnitLayout.getUsedWidth(node, tb) + (units.length +  1) * AuxUnitLayout.unitGap; //One gap for leftmost outer margin
}

AuxUnitLayout.getUsedLengthLR = function(node, tb){
  var units = tb.units;
  return AuxUnitLayout.getUsedHeight(node, tb) + (units.length +  1) * AuxUnitLayout.unitGap; //One gap for leftmost outer margin
}

AuxUnitLayout.fitUnits = function (node, location) {
  if (node.data('auxunitlayouts') === undefined) {
    return;
  }
  if (location !== undefined) {
    AuxUnitLayout.lastPos = location;
  }
  var top = node.data('auxunitlayouts').top;
  var bottom = node.data('auxunitlayouts').bottom;
  var left = node.data('auxunitlayouts').left;
  var right = node.data('auxunitlayouts').right;
  //Get Parent node and find parent width
  var parentWidth = node.data('bbox').w;
  var parentHeight = node.data('bbox').h;
  var usedLength;
  var totalWidth;
  var estimatedGap;
  var units;
  var addedShift;

  if (top !== undefined) {
    //If new unit adaed done reset unit gap
    if(AuxUnitLayout.lastPos === "top"){
      AuxUnitLayout.currentTopUnitGap = AuxUnitLayout.unitGap;
      AuxUnitLayout.lastPos = -1;
    }
    //Find total top length
    usedLength = AuxUnitLayout.getUsedLengthTB(node, top);
    units = top.units;
    //Compare the side lengths
    if (parentWidth < usedLength) {
      //If there is not enough space
      //Estimate new margin & gap
      totalWidth = AuxUnitLayout.getUsedWidth(node, top);
      estimatedGap = (parentWidth - totalWidth) / (units.length + 1);
      //Else scale by using available space, reducing margins and gaps.
      //Check if new gap is enough to fit

      units[0].bbox.x -= AuxUnitLayout.currentTopUnitGap - estimatedGap;

      for (var i = 1; i < units.length; i++) { //Calculate new margins
        units[i].bbox.x = units[i-1].bbox.x + units[i-1].bbox.w/2 + units[i].bbox.w/2 + estimatedGap;
      }
      AuxUnitLayout.currentTopUnitGap = estimatedGap;


    }
    else if(AuxUnitLayout.currentTopUnitGap < AuxUnitLayout.unitGap){
      for (var i = 0; i < units.length; i++) { //Shift all units
        units[i].bbox.x -= (AuxUnitLayout.currentTopUnitGap - AuxUnitLayout.unitGap) * (i+1);
      }
      AuxUnitLayout.currentTopUnitGap =  AuxUnitLayout.unitGap;
    }
  }

  if (bottom !== undefined) {
    //If new unit adaed done reset unit gap
    if(AuxUnitLayout.lastPos === "bottom"){
      AuxUnitLayout.currentBottomUnitGap = AuxUnitLayout.unitGap;
      AuxUnitLayout.lastPos = -1;
    }
    //Find total currentBottomUnitGap length
    usedLength = AuxUnitLayout.getUsedLengthTB(node, bottom);
    units = bottom.units;
    //Compare the side lengths
    if (parentWidth < usedLength) {
      //If there is not enough space
      //Estimate new margin & gap
      totalWidth = AuxUnitLayout.getUsedWidth(node, bottom);
      estimatedGap = (parentWidth - totalWidth) / (units.length + 1);
      //Else scale by using available space, reducing margins and gaps.
      //Check if new gap is enough to fit

      units[0].bbox.x -= AuxUnitLayout.currentBottomUnitGap - estimatedGap;

      for (var i = 1; i < units.length; i++) { //Shift all units
        units[i].bbox.x = units[i-1].bbox.x + units[i-1].bbox.w/2 + units[i].bbox.w/2 + estimatedGap;
      }
      AuxUnitLayout.currentBottomUnitGap = estimatedGap;


    }
    else if(AuxUnitLayout.currentBottomUnitGap < AuxUnitLayout.unitGap){
      for (var i = 0; i < units.length; i++) { //Shift all units
        units[i].bbox.x -= (AuxUnitLayout.currentBottomUnitGap - AuxUnitLayout.unitGap) * (i+1);
      }
      AuxUnitLayout.currentBottomUnitGap =  AuxUnitLayout.unitGap;
    }
  }

  if (left !== undefined) {
    //Find total left length
    //If new unit adaed done reset unit gap
    if(AuxUnitLayout.lastPos === "left"){
      AuxUnitLayout.currentLeftUnitGap = AuxUnitLayout.unitGap;
      AuxUnitLayout.lastPos = -1;
    }
    usedLength = AuxUnitLayout.getUsedLengthLR(node, left);
    units = left.units;
    //Compare the side lengths
    if (parentHeight < usedLength) {
      //If there is not enough space
      //Estimate new margin & gap
      totalHeight = AuxUnitLayout.getUsedHeight(node, left);
      estimatedGap = (parentHeight - totalHeight) / (units.length + 1);
      //Else scale by using available space, reducing margins and gaps.
      //Check if new gap is enough to fit
      units[0].bbox.y -= AuxUnitLayout.currentLeftUnitGap - estimatedGap;

      for (var i = 1; i < units.length; i++) { //Shift all units
        units[i].bbox.y = units[i-1].bbox.y + units[i-1].bbox.h/2 + units[i].bbox.h/2 + estimatedGap;
      }
      AuxUnitLayout.currentLeftUnitGap = estimatedGap;

    }
    else if(AuxUnitLayout.currentLeftUnitGap < AuxUnitLayout.unitGap){
      for (var i = 0; i < units.length; i++) { //Shift all units
        units[i].bbox.y -= (AuxUnitLayout.currentLeftUnitGap - AuxUnitLayout.unitGap) * (i+1);
      }
      AuxUnitLayout.currentLeftUnitGap =  AuxUnitLayout.unitGap;
    }
  }

  if (right !== undefined) {
    //Find total right length
    usedLength = AuxUnitLayout.getUsedLengthLR(node, right);
    units = right.units;
    //If new unit adaed done reset unit gap
    if(AuxUnitLayout.lastPos === "right"){
      AuxUnitLayout.currentRightUnitGap = AuxUnitLayout.unitGap;
      AuxUnitLayout.lastPos = -1;
    }
    //Compare the side lengths
    if (parentHeight < usedLength) {
      //If there is not enough space
      //Estimate new margin & gap
      totalHeight = AuxUnitLayout.getUsedHeight(node, right);
      estimatedGap = (parentHeight - totalHeight) / (units.length + 1);
      //Else scale by using available space, reducing margins and gaps.
      //Check if new gap is enough to fit
      units[0].bbox.y -= AuxUnitLayout.currentRightUnitGap - estimatedGap;

      for (var i = 1; i < units.length; i++) { //Shift all units
        units[i].bbox.y = units[i-1].bbox.y + units[i-1].bbox.h/2 + units[i].bbox.h/2 + estimatedGap;
      }
      AuxUnitLayout.currentRightUnitGap = estimatedGap;

    }
    else if(AuxUnitLayout.currentRightUnitGap < AuxUnitLayout.unitGap){
      for (var i = 0; i < units.length; i++) { //Shift all units
        units[i].bbox.y -= (AuxUnitLayout.currentRightUnitGap - AuxUnitLayout.unitGap) * (i+1);
      }
      AuxUnitLayout.currentRightUnitGap =  AuxUnitLayout.unitGap;
    }
  }
};


// Calculate total length used in a side
// TODO find a way to refactor, remove ugliness of top-bottom/left-right.
AuxUnitLayout.precomputeCoords = function (mainObj, cy, doForceUpdate) {
  AuxUnitLayout.setDisplayedUnits(mainObj, cy);
  var lengthUsed = AuxUnitLayout.getOuterMargin(mainObj);
  var finalLengthUsed = lengthUsed;
  var unitGap = AuxUnitLayout.getUnitGap(mainObj);
  var parentNode = AuxUnitLayout.getParentNode(mainObj, cy);

  for(var i=0; i < mainObj.units.length; i++) {
    // change the coordinate system of the auxiliary unit according to the chosen layout
    var auxUnit = mainObj.units[i];
    if (auxUnit.coordType != "relativeToSide" || doForceUpdate) {
      if (auxUnit.coordType == "relativeToCenter" || doForceUpdate) {
        if(AuxUnitLayout.isTorB(mainObj)) {
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

    if(AuxUnitLayout.isTorB(mainObj)) {
      //auxUnit.bbox.y = 0;
      lengthUsed += auxUnit.bbox.w + unitGap;
    }
    else {
      //auxUnit.bbox.x = 0;
      lengthUsed += auxUnit.bbox.h + unitGap;
    }

    if(auxUnit.isDisplayed) {
      finalLengthUsed = lengthUsed;
    }
  }
  // adjust the length, should be composed of outerMargin on the end, not unitGap
  finalLengthUsed = finalLengthUsed - unitGap + AuxUnitLayout.getOuterMargin(mainObj);

  mainObj.lengthUsed = finalLengthUsed;
};

AuxUnitLayout.draw = function (mainObj, cy, context) {
  for(var i=0; i < mainObj.units.length; i++) {
    var auxUnit = mainObj.units[i];
    if (auxUnit.isDisplayed) {
      // make each unit draw itself
      getAuxUnitClass(auxUnit).draw(auxUnit, cy, context);
    }
  }
};

AuxUnitLayout.modifyUnits = function(parentNode, unit, oldLocation, cy){
  var location = unit.anchorSide;
  var posX = unit.bbox.x;
  var posY = unit.bbox.y;
  if (!parentNode.data('auxunitlayouts')[oldLocation]) {
    parentNode.data('auxunitlayouts')[oldLocation] = AuxUnitLayout.construct(parentNode, oldLocation);
  }
  var oldAuxUnit = parentNode.data('auxunitlayouts')[oldLocation];
  var deleteUnits = oldAuxUnit.units;

  //Delete from old location
  var deleteIndex;
  for (var i = 0; i < deleteUnits.length; i++) {
    if(deleteUnits[i] === unit) {
      deleteIndex = i;
      break;
    }
  }
  deleteUnits.splice(deleteIndex, 1);
  AuxUnitLayout.updateLengthCache(oldAuxUnit, cy);
  AuxUnitLayout.update(oldAuxUnit, cy, true);
  AuxUnitLayout.fitUnits(parentNode, oldLocation);
  //If new is not constructed contruct interval
  if (!parentNode.data('auxunitlayouts')[location]) {
    parentNode.data('auxunitlayouts')[location] = AuxUnitLayout.construct(parentNode, location);
  }
  var insertAuxUnit = insertUnits = parentNode.data('auxunitlayouts')[location];
  var insertUnits = insertAuxUnit.units;

  var index = 0;
  //Insert into new unit array
  if (location === "top" || location === "bottom") {
    while ( insertUnits[index] !== undefined && posX > insertUnits[index].bbox.x) {
      index++;
    }
  }
  else {
    while ( insertUnits[index] !== undefined && posY > insertUnits[index].bbox.y) {
      index++;
    }
  }
  insertUnits.splice(index, 0, unit);

  AuxUnitLayout.updateLengthCache(insertAuxUnit, cy);
  AuxUnitLayout.update(insertAuxUnit, cy, true);
  AuxUnitLayout.fitUnits(parentNode, location);
};

AuxUnitLayout.isEmpty = function(mainObj) {
  return mainObj.units.length == 0;
};

AuxUnitLayout.unitCount = function(mainObj) {
  return mainObj.units.length;
};

AuxUnitLayout.unitLength = function(mainObj) {
  var units = mainObj.units;
  var rightMostPoint = 0;
  for (var i = 0; i < units.length; i++) {
    var box = units[i].bbox;
    if (box.x + box.w / 2 > rightMostPoint){
      rightMostPoint = box.x + box.w / 2;
    }
  }
  return rightMostPoint;
};

//Get Unit Gaps
AuxUnitLayout.getCurrentTopGap = function(){
  return AuxUnitLayout.currentTopUnitGap;
}

AuxUnitLayout.getCurrentBottomGap = function(){
  return AuxUnitLayout.currentBottomUnitGap;
}

AuxUnitLayout.getCurrentLeftGap = function(){
  return AuxUnitLayout.currentLeftUnitGap;
}

AuxUnitLayout.getCurrentRightGap = function(){
  return AuxUnitLayout.currentRightUnitGap;
}

/**
 * Auto choose the next layout. To add a new aux unit, for example.
 */
AuxUnitLayout.selectNextAvailable = function(node) {
  var top = node.data('auxunitlayouts').top;
  var bottom = node.data('auxunitlayouts').bottom;
  var resultLocation = "top";
  // start by adding on top if free
  if(!top || AuxUnitLayout.isEmpty(top)) {
    resultLocation = "top";
  }
  else if(!bottom || AuxUnitLayout.isEmpty(bottom)) {
    resultLocation = "bottom";
  }
  else {
    // search for the side with the fewer units on it
    if(AuxUnitLayout.unitLength(top) <= AuxUnitLayout.unitLength(bottom)) {
      resultLocation = "top";
    }
    else {
      resultLocation = "bottom";
    }
  }
  AuxUnitLayout.lastPos = resultLocation; //Set last used position
  return resultLocation;
};

AuxUnitLayout.resizeParent = function (mainObj, cy, length) {
  var parentNode = AuxUnitLayout.getParentNode(mainObj, cy);
  if(AuxUnitLayout.isTorB(mainObj)) {
    if(parentNode.data('bbox').w < length) {
      cy.trigger("noderesize.resizestart", ["centerright", parentNode]);
      parentNode.data('bbox').w = length;
      cy.trigger("noderesize.resizeend", ["centerright", parentNode]);
    }
  }
  else {
    if(parentNode.data('bbox').h < length) {
      cy.trigger("noderesize.resizestart", ["bottomcenter", parentNode]);
      parentNode.data('bbox').h = length;
      cy.trigger("noderesize.resizeend", ["bottomcenter", parentNode]);
    }
  }
};

AuxUnitLayout.isTorB = function (mainObj) {
  return mainObj.location == "top" || mainObj.location == "bottom";
};

AuxUnitLayout.isLorR = function (mainObj) {
  return mainObj.location == "left" || mainObj.location == "right";
};

AuxUnitLayout.setParentMinLength = function (mainObj, cy) {
  var parentNode = AuxUnitLayout.getParentNode(mainObj, cy);
  var parentLayouts = parentNode.data('auxunitlayouts');
  switch(mainObj.location) {
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
  if(AuxUnitLayout.isTorB(mainObj)) {
    parentNode.data('resizeMinWidth', Math.max(mainObj.lengthUsed, compareVal));
  }
  else {
    parentNode.data('resizeMinHeight', Math.max(mainObj.lengthUsed, compareVal));
  }
};

AuxUnitLayout.getOuterMargin = function (mainObj) {
  if(typeof mainObj.outerMargin !== "undefined" && mainObj.outerMargin !== null) {
    return mainObj.outerMargin;
  }
  else {
    return AuxUnitLayout.outerMargin;
  }
};

AuxUnitLayout.getUnitGap = function (mainObj) {
  if(typeof mainObj.unitGap !== "undefined" && mainObj.unitGap !== null) {
    return mainObj.unitGap;
  }
  else {
    return AuxUnitLayout.unitGap;
  }
};

AuxUnitLayout.getAlwaysShowAuxUnits = function (mainObj) {
  if(typeof mainObj.alwaysShowAuxUnits !== "undefined" && mainObj.alwaysShowAuxUnits !== null) {
    return mainObj.alwaysShowAuxUnits;
  }
  else {
    return AuxUnitLayout.alwaysShowAuxUnits;
  }
};

AuxUnitLayout.getMaxUnitDisplayed = function (mainObj) {
  if(typeof mainObj.maxUnitDisplayed !== "undefined" && mainObj.maxUnitDisplayed !== null) {
    return mainObj.maxUnitDisplayed;
  }
  else {
    return AuxUnitLayout.maxUnitDisplayed;
  }
};

/*
 *  Duplicate a layout. Doesn't copy the units attribute, reset it instead.
 */
AuxUnitLayout.copy = function(mainObj, cy, newParent) {
  var newLayout = AuxUnitLayout.construct(newParent);
  // Copying the same reference to units would be inconsistent.
  // Duplicating owned units goes beyonnd the scope, because we need to assign
  // ids that are tied to the global cound of units of a node.
  // So duplicating units is something that should be properly done outside of this function.
  // TODO that is a bit dirty, find a nice modular way to arrange that
  newLayout.units = [];
  newLayout.location = mainObj.location;
  newLayout.alignment = mainObj.alignment;
  AuxUnitLayout.setParentNodeRef(newLayout, newParent);
  newLayout.renderLengthCache = mainObj.renderLengthCache;
  newLayout.lengthUsed = mainObj.lengthUsed;
  if(typeof mainObj.outerMargin !== "undefined") {
    newLayout.outerMargin = mainObj.outerMargin;
  }
  if(typeof mainObj.unitGap !== "undefined") {
    newLayout.unitGap = mainObj.unitGap;
  }
  if(typeof mainObj.alwaysShowAuxUnits !== "undefined") {
    newLayout.alwaysShowAuxUnits = mainObj.alwaysShowAuxUnits;
  }
  if(typeof mainObj.maxUnitDisplayed !== "undefined") {
    newLayout.maxUnitDisplayed = mainObj.maxUnitDisplayed;
  }
  return newLayout;
};

ns.AuxUnitLayout = AuxUnitLayout;
// -------------- END AuxUnitLayout -------------- //

module.exports = ns;

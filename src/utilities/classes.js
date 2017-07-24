var cyRenderer = require('../sbgn-extensions/sbgn-cy-renderer');
var libs = require('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;
var optionUtilities = require('./option-utilities');
var options = optionUtilities.getOptions();
var truncate = require('./text-utilities').truncate;

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
AuxiliaryUnit.defaultBackgroundColor = "#ffffff";

/*
 * Return a new AuxiliaryUnit object. A new parent reference and new id can
 * optionnally be passed.
 */
AuxiliaryUnit.prototype.copy = function (existingInstance, newParent, newId) {
  var newUnit = existingInstance ? existingInstance : new AuxiliaryUnit();
  newUnit.parent = newParent ? newParent : this.parent;
  newUnit.id = newId ? newId : this.id;
  newUnit.bbox = jQuery.extend(true, {}, this.bbox);
  newUnit.coordType = this.coordType;
  newUnit.anchorSide = this.anchorSide;
  newUnit.isDisplayed = this.isDisplayed;
  return newUnit;
};

// draw the auxiliary unit at its position
AuxiliaryUnit.prototype.draw = function(context) {
  var coords = this.getAbsoluteCoord();

  this.drawShape(context, coords.x, coords.y);
  if (this.hasText()) {
    this.drawText(context, coords.x, coords.y);
  }
  this.isDisplayed = true;
};

// to be implemented by children
AuxiliaryUnit.prototype.getText = function() {
  throw new Error("Abstract method!");
};
AuxiliaryUnit.prototype.hasText = function() {
  throw new Error("Abstract method!");
};
AuxiliaryUnit.prototype.drawShape = function(context, x, y) {
  throw new Error("Abstract method!");
};

// draw the statesOrInfo's label at given position
AuxiliaryUnit.prototype.drawText = function(context, centerX, centerY) {
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

  var text;
  if(options.fitLabelsToInfoboxes()){
    // here we memoize the truncated text into _textCache,
    // as it is not something that changes so much
    text = this.getText();
    var key = text + context.font + this.bbox.w;
    if(this._textCache && this._textCache[key]) {
      text = this._textCache[key];
    }
    else {
      text = truncate(this.getText(), context.font, this.bbox.w);
      if(!this._textCache) {
        this._textCache = {};
      }
      this._textCache[key] = text;
    }
  }
  else {
    text = this.getText();
  }

  context.beginPath();
  context.fillText(text, centerX, centerY);
  context.closePath();

  // restore saved style
  context.fillStyle = oldStyle;
  context.font = oldFont;
  context.globalAlpha = oldOpacity;
};

AuxiliaryUnit.prototype.getAbsoluteCoord = function() {
  if(this.coordType == "relativeToCenter") {
    var absX = this.bbox.x * (this.parent.outerWidth() - this.parent._private.data['border-width']) / 100 + this.parent._private.position.x;
    var absY = this.bbox.y * (this.parent.outerHeight() - this.parent._private.data['border-width']) / 100 + this.parent._private.position.y;
    return {x: absX, y: absY};
  }
  else if(this.coordType == "relativeToSide") {
    if (this.anchorSide == "top" || this.anchorSide == "bottom") {
      var absX = this.parent._private.position.x - (this.parent.outerWidth() - this.parent._private.data['border-width']) / 2 + this.bbox.x;
      var absY = this.bbox.y * (this.parent.outerHeight() - this.parent._private.data['border-width']) / 100 + this.parent._private.position.y;
    }
    else {
      var absY = this.parent._private.position.y - (this.parent.outerHeight() - this.parent._private.data['border-width']) / 2 + this.bbox.y;
      var absX = this.bbox.x * (this.parent.outerWidth() - this.parent._private.data['border-width']) / 100 + this.parent._private.position.x;
    }

  // due to corner of barrel shaped compartment shift absX to right
  if (this.parent.data("class") == "compartment"){
      absX += this.parent.outerWidth() * 0.1;
  };
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

AuxiliaryUnit.prototype.addToParent = function (parentNode, location, position, index) {

  // add state var to the parent's statesandinfos
  if(typeof index != "undefined") { // specific index provided (for undo/redo consistency)
    parentNode.data('statesandinfos').splice(index, 0, this);
  }
  else {
    parentNode.data('statesandinfos').push(this);
  }

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

StateVariable.prototype.hasText = function() {
  return (this.state.value && this.state.value != "") || (this.state.variable && this.state.variable != "");
};

StateVariable.prototype.drawShape = function(context, x, y) {
  cytoscape.sbgn.drawRoundRectanglePath(context,
              x, y,
              this.bbox.w, this.bbox.h,
              Math.min(this.bbox.w / 2, this.bbox.h / 2, StateVariable.shapeRadius));
  var tmp_ctxt = context.fillStyle;
  context.fillStyle = AuxiliaryUnit.defaultBackgroundColor;
  context.fill();
  context.fillStyle = tmp_ctxt;
  context.stroke();
};

StateVariable.create = function(parentNode, value, variable, bbox, location, position, index) {
  // create the new state var of info
  var stateVar = new ns.StateVariable();
  stateVar.parent = parentNode;
  stateVar.value = value;
  stateVar.variable = variable;
  stateVar.state = {value: value, variable: variable};
  stateVar.bbox = bbox;

  // link to layout
  position = stateVar.addToParent(parentNode, location, position, index);

  return {
    index: stateVar.parent.data('statesandinfos').indexOf(stateVar),
    location: stateVar.anchorSide,
    position: position
  }
};

StateVariable.prototype.remove = function () {
  var position = this.getPositionIndex();
  var index = this.parent.data('statesandinfos').indexOf(this);
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
    position: position,
    index: index
  };
};

StateVariable.prototype.copy = function(newParent, newId) {
  var newStateVar = AuxiliaryUnit.prototype.copy.call(this, new StateVariable(), newParent, newId);
  newStateVar.state = jQuery.extend(true, {}, this.state);
  newStateVar.stateVariableDefinition = this.stateVariableDefinition;
  newStateVar.clazz = this.clazz;
  return newStateVar;
};

ns.StateVariable = StateVariable;
// -------------- END StateVariable -------------- //

// -------------- UnitOfInformation -------------- //
/**
 * parent can be an EPN, compartment or subunit
 * The shape can vary and can be provided to the constructor. By default, it will be rendered with the shape 
 * of PD units of information.
 * To provide a custom shape, 2 functions must be passed:
 *  - shapeFn: the shape function itself, the function that will be called to render the shape
 *             The prototype should be: fn(context, x, y, [some other arguments])
 *  - shapeArgsFn: prototype function(self), it should return an array of arguments that will be passed to shapeFn
 *                 See example as the default below.
 *  To render the shape, we will simply do: shapeFn.apply(null, [context, x, y] + rest of the list provided by shapeArgsFn() )
 */
var UnitOfInformation = function (value, parent, shapeFn, shapeArgsFn) {
  AuxiliaryUnit.call(this, parent);
  this.label = {text: value}; // from legacy code, contains {text: }
  this.clazz = "unit of information";
  if(shapeFn && shapeArgsFn) {
    this.shapeFn = shapeFn;
    this.shapeArgsFn = shapeArgsFn;
  }
  else { // default shape is rectangle
    this.shapeFn = function(c,x,y,w,h){
      cytoscape.baseNodeShapes['rectangle'].draw(c, x, y, w, h)
    };

    this.shapeArgsFn = function (self) {
      return [self.bbox.w, self.bbox.h, 0];
    };
  }
};
UnitOfInformation.prototype = Object.create(AuxiliaryUnit.prototype);
UnitOfInformation.prototype.constructor = UnitOfInformation;
UnitOfInformation.shapeRadius = 4;

UnitOfInformation.prototype.getText = function() {
  return this.label.text;
};

UnitOfInformation.prototype.hasText = function() {
  return this.label.text && this.label.text != "";
};

UnitOfInformation.prototype.drawShape = function(context, x, y) {
  var args = [context, x, y].concat(this.shapeArgsFn(this));
  this.shapeFn.apply(null, args);
  var tmp_ctxt = context.fillStyle;
  context.fillStyle = AuxiliaryUnit.defaultBackgroundColor;
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
UnitOfInformation.create = function (parentNode, value, bbox, location, position, index, shapeFn, shapeArgsFn) {
  // create the new unit of info
  var unit = new ns.UnitOfInformation(value, parentNode, shapeFn, shapeArgsFn);
  unit.bbox = bbox;

  //console.log("will insert on", location, position);
  position = unit.addToParent(parentNode, location, position, index);

  return {
    index: unit.parent.data('statesandinfos').indexOf(unit),
    location: unit.anchorSide,
    position: position
  }
};

UnitOfInformation.prototype.remove = function () {
  var position = this.getPositionIndex();
  var index = this.parent.data('statesandinfos').indexOf(this);
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
    position: position,
    index: index
  };
};

UnitOfInformation.prototype.copy = function(newParent, newId) {
  var newUnitOfInfo = AuxiliaryUnit.prototype.copy.call(this, new UnitOfInformation(), newParent, newId);
  newUnitOfInfo.label = jQuery.extend(true, {}, this.label);
  newUnitOfInfo.clazz = this.clazz;
  newUnitOfInfo.shapeFn = this.shapeFn;
  newUnitOfInfo.shapeArgsFn = this.shapeArgsFn;
  return newUnitOfInfo;
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
  this.alignment = alignment || "left"; // this was intended to be used, but it isn't for now
  this.parentNode = parentNode;
  this.renderLengthCache = [];
  this.lengthUsed = 0;

  // specific rules for the layout
  if(parentNode.data('class') == "simple chemical") {
    this.outerMargin = 3;
  }
};
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
AuxUnitLayout.outerMargin = 10;
AuxUnitLayout.unitGap = 5;
AuxUnitLayout.alwaysShowAuxUnits = false;
AuxUnitLayout.maxUnitDisplayed = -1;

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

  this.updateLengthCache();
  this.update(true);
  if (this.getAlwaysShowAuxUnits()) {
    // set a minimum size according to both sides on the same orientation
    this.setParentMinLength();
    // need to resize the parent in case the space was too small
    this.resizeParent(this.lengthUsed);
  }
  //cy.style().update(); // <- was it really necessary ?
  return position;
};

AuxUnitLayout.prototype.removeAuxUnit = function(unit) {
  var index = this.units.indexOf(unit);
  this.units.splice(index, 1);
  this.updateLengthCache();
  this.update(true);
  if (this.getAlwaysShowAuxUnits()) {
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
  this.updateLengthCache();
  this.update(true);
};

/**
 * use a cached list to determine what is the length needed to draw x aux units.
 * can then be compared against the parent node's dimensions, to decide how many
 * aux units to draw.
 */
AuxUnitLayout.prototype.updateLengthCache = function() {
  this.renderLengthCache = [0];
  var previous = this.getOuterMargin();
  for(var i=0; i < this.units.length; i++) {
    var currentLength;
    if(this.isTorB()) {
      currentLength = this.units[i].bbox.w;
    }
    else {
      currentLength = this.units[i].bbox.h;
    }
    this.renderLengthCache.push(previous + currentLength + this.getOuterMargin());
    previous += currentLength + this.getUnitGap();
  }
};

/**
 * Use the cached precomputed lengths to decide how many units we are capable of drawing,
 * considering the size of the parent node.
 * The number returned says: we are able to draw the N first units of the lists.
 * Unused for now.
 */
AuxUnitLayout.prototype.getDrawableUnitAmount = function() {
  if(this.getAlwaysShowAuxUnits()) {
    // bypass all this
    return this.units.length;
  }

  // get the length of the side on which we draw
  var availableSpace;
  if (this.isTorB()) {
    availableSpace = this.parentNode.outerWidth();
  }
  else {
    availableSpace = this.parentNode.outerHeight();
  }
  // loop over the cached precomputed lengths
  for(var i=0; i < this.renderLengthCache.length; i++) {
    if(this.renderLengthCache[i] > availableSpace) {
      // stop if we overflow
      return i - 1;
    }
  }
  return this.units.length;
};

AuxUnitLayout.prototype.setDisplayedUnits = function () {
  // get the length of the side on which we draw
  var availableSpace;
  if (this.isTorB()) {
    availableSpace = this.parentNode.outerWidth();
    // due to corner of barrel shaped compartment decrease availableSpace -- no infobox on corners
    if (this.parentNode.data("class") == "compartment")
        availableSpace *= 0.8;
  }
  else {
    availableSpace = this.parentNode.outerHeight();
  }

  // there is always n+1 elements in the cachedLength for n units
  var alwaysShowAuxUnits = this.getAlwaysShowAuxUnits();
  var maxUnitDisplayed = this.getMaxUnitDisplayed();
  for(var i=0; i < this.units.length; i++) {
    if((this.renderLengthCache[i+1] <= availableSpace // do we have enough space?
      && (maxUnitDisplayed == -1 || i < maxUnitDisplayed)) // is there no limit? or are we under that limit?
      || alwaysShowAuxUnits) { // do we always want to show everything regardless?
      this.units[i].isDisplayed = true;
    }
    else {
      this.units[i].isDisplayed = false;
    }
  }
};

// TODO find a way to refactor, remove ugliness of top-bottom/left-right.
AuxUnitLayout.prototype.precomputeCoords = function (doForceUpdate) {
  this.setDisplayedUnits();

  var lengthUsed = this.getOuterMargin();
  var finalLengthUsed = lengthUsed;
  var unitGap = this.getUnitGap();
  for(var i=0; i < this.units.length; i++) {
    // change the coordinate system of the auxiliary unit according to the chosen layout
    var auxUnit = this.units[i];
    if (auxUnit.coordType != "relativeToSide" || doForceUpdate) {
      if (auxUnit.coordType == "relativeToCenter" || doForceUpdate) {
        if(this.isTorB()) {
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

    if(this.isTorB()) {
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
  finalLengthUsed = finalLengthUsed - unitGap + this.getOuterMargin();

  this.lengthUsed = finalLengthUsed;
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

AuxUnitLayout.prototype.getOuterMargin = function () {
  if(typeof this.outerMargin !== "undefined" && this.outerMargin !== null) {
    return this.outerMargin;
  }
  else {
    return AuxUnitLayout.outerMargin;
  }
};

AuxUnitLayout.prototype.getUnitGap = function () {
  if(typeof this.unitGap !== "undefined" && this.unitGap !== null) {
    return this.unitGap;
  }
  else {
    return AuxUnitLayout.unitGap;
  }
};

AuxUnitLayout.prototype.getAlwaysShowAuxUnits = function () {
  if(typeof this.alwaysShowAuxUnits !== "undefined" && this.alwaysShowAuxUnits !== null) {
    return this.alwaysShowAuxUnits;
  }
  else {
    return AuxUnitLayout.alwaysShowAuxUnits;
  }
};

AuxUnitLayout.prototype.getMaxUnitDisplayed = function () {
  if(typeof this.maxUnitDisplayed !== "undefined" && this.maxUnitDisplayed !== null) {
    return this.maxUnitDisplayed;
  }
  else {
    return AuxUnitLayout.maxUnitDisplayed;
  }
};

/*
 *  Duplicate a layout. Doesn't copy the units attribute, reset it instead.
 */
AuxUnitLayout.prototype.copy = function(newParent) {
  var newLayout = new AuxUnitLayout(newParent);
  // Copying the same reference to units would be inconsistent.
  // Duplicating owned units goes beyonnd the scope, because we need to assign
  // ids that are tied to the global cound of units of a node.
  // So duplicating units is something that should be properly done outside of this function.
  // TODO that is a bit dirty, find a nice modular way to arrange that
  newLayout.units = [];
  newLayout.location = this.location;
  newLayout.alignment = this.alignment;
  newLayout.parentNode = newParent;
  newLayout.renderLengthCache = this.renderLengthCache;
  newLayout.lengthUsed = this.lengthUsed;
  if(typeof this.outerMargin !== "undefined") {
    newLayout.outerMargin = this.outerMargin;
  }
  if(typeof this.unitGap !== "undefined") {
    newLayout.unitGap = this.unitGap;
  }
  if(typeof this.alwaysShowAuxUnits !== "undefined") {
    newLayout.alwaysShowAuxUnits = this.alwaysShowAuxUnits;
  }
  if(typeof this.maxUnitDisplayed !== "undefined") {
    newLayout.maxUnitDisplayed = this.maxUnitDisplayed;
  }
  return newLayout;
};

ns.AuxUnitLayout = AuxUnitLayout;
// -------------- END AuxUnitLayout -------------- //

module.exports = ns;

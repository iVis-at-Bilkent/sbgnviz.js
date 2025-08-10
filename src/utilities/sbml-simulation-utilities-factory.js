module.exports = function () {
  var parameters = {}; // { id = str: { name = str, value = float, unit = str, constant = bool } },
  var functionDefinitions = {}; // { id = str: { name = str, args = list[str], body: str } }, 
  var initialAssignments = {} // { id = str: { symbol = str, math: str } },     symbol corresponds to the target of IA.
  var rules = {} // { id = str: { type = str, target = str, math: str } },
  var events = {} // { id = str: { useValuesFromTriggerTime: bool, trigger: { initialValue: bool, persistent: bool, math: str }, priority: str, delay: str, assignments: [{ target: str, math: str }] } }
  // Custom unit definitions; base unit kinds are always available separately
  var customUnits = {} // { id = str: { name: str, units: [{ kind: str, exponent: int, scale: int, multiplier: number }] } }

  // Built-in SBML unit kinds (always available)
  var baseUnitKinds = [
    'ampere','avogadro','becquerel','candela','coulomb','dimensionless','farad','gram','gray',
    'henry','hertz','item','joule','kelvin','kilogram','litre','lumen','lux','metre','mole',
    'newton','ohm','pascal','radian','second','siemens','sievert','steradian','tesla','volt',
    'watt','weber'
  ];
  
  var cy;
  var sbmlSimulationUtilities = function (param) {
    cy = param.sbgnCyInstance.getCy();
  };

  sbmlSimulationUtilities.generateUUID = function () {
    // Public Domain/MIT
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  };

  sbmlSimulationUtilities.generateSpecializedID = function(namespace) {
    return namespace + "_" + sbmlSimulationUtilities.generateUUID();
  }

  sbmlSimulationUtilities.addParameter = function (name, value, unit, constant) {
    var id = sbmlSimulationUtilities.generateSpecializedID("param");
    parameters[id] = {
      name: name,
      value: value,
      unit: unit,
      constant: constant
    }
  }

  // Should only be used while importing, not really anything else
  // Consider using sbmlSimulationUtilities.addParameter(name, value, unit, constant)
  sbmlSimulationUtilities.addParameterWithId = function(id, name, value, unit, constant){
    parameters[id] = {
      name: name,
      value: value,
      unit: unit,
      constant: constant
    }
  }

  sbmlSimulationUtilities.removeParameter = function (id) {
    delete parameters[id];
  }

  sbmlSimulationUtilities.getParameters = function () {
    return Object.entries(parameters).map( ([id, {name, value, unit, constant}]) => ({
      id, name, value, unit, constant
    }));
  }

  sbmlSimulationUtilities.setParameter = function (id, field, value) {
    if (!parameters[id]) return;
    parameters[id][field] = value;
  }

  sbmlSimulationUtilities.resetParameters = function () {
    parameters = {};
  }

  sbmlSimulationUtilities.addFunctionDefinition = function (name, args, body) {
    var id = sbmlSimulationUtilities.generateSpecializedID("function");
    functionDefinitions[id] = {
      name: name,
      args: args,
      body: body
    }
  }

  // Should only be used while importing, not really anything else
  // Consider using sbmlSimulationUtilities.addParameter(name, args, body)
  sbmlSimulationUtilities.addFunctionDefinitionWithId = function (id, name, args, body) {
    functionDefinitions[id] = {
      name: name,
      args: args,
      body: body
    }
  }

  sbmlSimulationUtilities.removeFunctionDefinition = function (id) {
    delete functionDefinitions[id];
  }

  sbmlSimulationUtilities.getFunctionDefinitions = function () {
    return Object.entries(functionDefinitions).map( ([id, {name, args, body}]) => ({
      id, name, args, body
    }));
  }

  sbmlSimulationUtilities.setFunctionDefinition = function (id, field, value) {
    if (!functionDefinitions[id]) return;
    functionDefinitions[id][field] = value;
  }

  sbmlSimulationUtilities.resetFunctionDefinitions = function () {
    functionDefinitions = {};
  }

  sbmlSimulationUtilities.addInitialAssignment = function (symbol, math) {
    var id = sbmlSimulationUtilities.generateSpecializedID("initial");
    initialAssignments[id] = {
      symbol: symbol,
      math: math
    }
  }

  // Should only be used while importing, not really anything else
  // Consider using sbmlSimulationUtilities.addInitialAssignment(symbol, math)
  sbmlSimulationUtilities.addInitialAssignmentWithId = function (id, symbol, math) {
    initialAssignments[id] = {
      symbol: symbol,
      math: math
    }
  }

  sbmlSimulationUtilities.removeInitialAssignment = function (id) {
    delete initialAssignments[id];
  }

  sbmlSimulationUtilities.getInitialAssignments = function () {
    return Object.entries(initialAssignments).map( ([id, {symbol, math}]) => ({
      id, symbol, math
    }));
  }

  sbmlSimulationUtilities.setInitialAssignment = function (id, field, value) {
    if (!initialAssignments[id]) return;
    initialAssignments[id][field] = value;
  }

  sbmlSimulationUtilities.resetInitialAssignments = function () {
    initialAssignments = {};
  }

  sbmlSimulationUtilities.addRule = function (type, target, math) {
    var id = sbmlSimulationUtilities.generateSpecializedID("rule");
    rules[id] = {
      type: type,
      target: target,
      math: math
    }
  }

  // Should only be used while importing, not really anything else
  // Consider using sbmlSimulationUtilities.addParameter(symbol, body)
  sbmlSimulationUtilities.addRuleWithId = function (id, type, target, math) {
    rules[id] = {
      type: type,
      target: target,
      math: math
    }
  }

  sbmlSimulationUtilities.removeRule = function (id) {
    delete rules[id];
  }

  sbmlSimulationUtilities.getRules = function () {
    return Object.entries(rules).map( ([id, {type, target, math}]) => ({
      id, type, target, math
    }));
  }

  sbmlSimulationUtilities.setRule = function (id, field, value) {
    if (!rules[id]) return;
    rules[id][field] = value;
  }

  sbmlSimulationUtilities.resetRules = function () {
    rules = {};
  }

  // Events
  sbmlSimulationUtilities.addEvent = function (useValuesFromTriggerTime, triggerInitialValue, triggerPersistent, triggerMath, priority, delay, assignments) {
    var id = sbmlSimulationUtilities.generateSpecializedID("event");
    events[id] = {
      useValuesFromTriggerTime: !!useValuesFromTriggerTime,
      trigger: {
        initialValue: !!triggerInitialValue,
        persistent: !!triggerPersistent,
        math: triggerMath || ""
      },
      priority: priority || "",
      delay: delay || "",
      assignments: Array.isArray(assignments) ? assignments.map(function (a) { return { target: a.target || "", math: a.math || "" }; }) : []
    };
  }

  sbmlSimulationUtilities.addEventWithId = function (id, useValuesFromTriggerTime, triggerInitialValue, triggerPersistent, triggerMath, priority, delay, assignments) {
    events[id] = {
      useValuesFromTriggerTime: !!useValuesFromTriggerTime,
      trigger: {
        initialValue: !!triggerInitialValue,
        persistent: !!triggerPersistent,
        math: triggerMath || ""
      },
      priority: priority || "",
      delay: delay || "",
      assignments: Array.isArray(assignments) ? assignments.map(function (a) { return { target: a.target || "", math: a.math || "" }; }) : []
    };
  }

  sbmlSimulationUtilities.removeEvent = function (id) {
    delete events[id];
  }

  sbmlSimulationUtilities.getEvents = function () {
    return Object.entries(events).map(function (_ref) {
      var id = _ref[0], value = _ref[1];
      return {
        id: id,
        useValuesFromTriggerTime: value.useValuesFromTriggerTime,
        trigger: {
          initialValue: value.trigger.initialValue,
          persistent: value.trigger.persistent,
          math: value.trigger.math
        },
        priority: value.priority,
        delay: value.delay,
        assignments: (value.assignments || []).map(function (a) { return { target: a.target, math: a.math }; })
      };
    });
  }

  sbmlSimulationUtilities.setEvent = function (id, field, value) {
    if (!events[id]) return;
    events[id][field] = value;
  }

  // Set a nested field on the trigger object of an event
  sbmlSimulationUtilities.setEventTrigger = function (id, field, value) {
    if (!events[id]) return;
    events[id].trigger[field] = value;
  }

  // Add an assignment to the event
  sbmlSimulationUtilities.addEventAssignment = function (id, target, math) {
    if (!events[id]) return;
    if (!Array.isArray(events[id].assignments)) events[id].assignments = [];
    events[id].assignments.push({ target: target || "", math: math || "" });
  }

  // Remove an assignment at a given index from the event
  sbmlSimulationUtilities.removeEventAssignment = function (id, index) {
    if (!events[id] || !Array.isArray(events[id].assignments)) return;
    if (index < 0 || index >= events[id].assignments.length) return;
    events[id].assignments.splice(index, 1);
  }

  sbmlSimulationUtilities.resetEvents = function () {
    events = {};
  }

  // Unit Definitions (custom)
  sbmlSimulationUtilities.addUnitDefinition = function (name, units) {
    var id = sbmlSimulationUtilities.generateSpecializedID('unit');
    customUnits[id] = {
      name: name,
      units: Array.isArray(units) ? units.map(function(u){
        return {
          kind: u.kind || '',
          exponent: (typeof u.exponent === 'number') ? u.exponent : 1,
          scale: (typeof u.scale === 'number') ? u.scale : 0,
          multiplier: (typeof u.multiplier === 'number') ? u.multiplier : 1
        };
      }) : []
    };
  }

  sbmlSimulationUtilities.addUnitDefinitionWithId = function (id, name, units) {
    customUnits[id] = {
      name: name,
      units: Array.isArray(units) ? units.map(function(u){
        return {
          kind: u.kind || '',
          exponent: (typeof u.exponent === 'number') ? u.exponent : 1,
          scale: (typeof u.scale === 'number') ? u.scale : 0,
          multiplier: (typeof u.multiplier === 'number') ? u.multiplier : 1
        };
      }) : []
    };
  }

  sbmlSimulationUtilities.removeUnitDefinition = function (id) {
    delete customUnits[id];
  }

  sbmlSimulationUtilities.getUnitDefinitions = function () {
    return Object.entries(customUnits).map(function(_ref){
      var id = _ref[0], value = _ref[1];
      return { id: id, name: value.name, units: value.units.slice() };
    });
  }

  sbmlSimulationUtilities.setUnitDefinition = function (id, field, value) {
    if (!customUnits[id]) return;
    customUnits[id][field] = value;
  }

  sbmlSimulationUtilities.resetUnitDefinitions = function () {
    customUnits = {};
  }

  sbmlSimulationUtilities.getBaseUnitKinds = function () {
    return baseUnitKinds.slice();
  }

  // Add a single unit entry to a unit definition (append only)
  sbmlSimulationUtilities.addUnitToDefinition = function (id, kind, exponent, scale, multiplier) {
    if (!customUnits[id]) return;
    var normalized = {
      kind: kind || '',
      exponent: (typeof exponent === 'number') ? exponent : 1,
      scale: (typeof scale === 'number') ? scale : 0,
      multiplier: (typeof multiplier === 'number') ? multiplier : 1
    };
    customUnits[id].units.push(normalized);
  }

  sbmlSimulationUtilities.removeUnitFromDefinition = function (id, index) {
    if (!customUnits[id] || !Array.isArray(customUnits[id].units)) return;
    if (typeof index !== 'number') return;
    if (index < 0 || index >= customUnits[id].units.length) return;
    customUnits[id].units.splice(index, 1);
  }

  // General utilities not associated with any specific SBML simulation feature.
  sbmlSimulationUtilities.convertNamesToIdsInFormula = function (formula) {

  }

  sbmlSimulationUtilities.convertIdsToNamesInFormula = function (formula) {

  }

  sbmlSimulationUtilities.resetAll = function () {
    sbmlSimulationUtilities.resetParameters();
    sbmlSimulationUtilities.resetFunctionDefinitions();
    sbmlSimulationUtilities.resetInitialAssignments();
    sbmlSimulationUtilities.resetRules();
    sbmlSimulationUtilities.resetEvents();
    sbmlSimulationUtilities.resetUnitDefinitions();
  }

  return sbmlSimulationUtilities;
};
  
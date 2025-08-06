module.exports = function () {
  var parameters = {}; // { id = str: { name = str, value = float, unit = str, constant = bool } },
  var functionDefinitions = {}; // { id = str: { name = str, args = list[str], body: str } }, 
  var initialAssignments = {} // { id = str: { symbol = str, math: str } },     symbol corresponds to the target of IA.
  
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
      id: id,
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
  // Consider using sbmlSimulationUtilities.addParameter(symbol, body)
  sbmlSimulationUtilities.addInitialAssignmentWithId = function (id, symbol, math) {
    initialAssignments[id] = {
      id: id,
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
    initialAssignments[id][field] = value;
  }

  sbmlSimulationUtilities.resetInitialAssignments = function () {
    initialAssignments = {};
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
  }

  return sbmlSimulationUtilities;
};
  
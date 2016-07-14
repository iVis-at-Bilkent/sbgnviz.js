var SBGNActionFunctions = {
  changeStateVariable: function (param) {
    var result = {
    };
    var state = param.state;
    var type = param.type;
    result.state = state;
    result.type = type;
    result.valueOrVariable = state.state[type];
    result.nodes = param.nodes;
    result.width = param.width;
    result.stateAndInfos = param.stateAndInfos;

    var index = param.stateAndInfos.indexOf(state);
    state.state[type] = param.valueOrVariable;

    for (var i = 0; i < param.nodes.length; i++) {
      param.nodes[i]._private.data.sbgnstatesandinfos = param.stateAndInfos;
    }

    cy.forceRender();

    inspectorUtilities.fillInspectorStateAndInfos(param.nodes, param.stateAndInfos, param.width);

    return result;
  },
  changeUnitOfInformation: function (param) {
    var result = {
    };
    var state = param.state;
    result.state = state;
    result.text = state.label.text;
    result.node = param.node;
    result.width = param.width;

    state.label.text = param.text;
    cy.forceRender();

    if (cy.elements(":selected").length == 1 && cy.elements(":selected")[0] == param.node) {
      inspectorUtilities.fillInspectorStateAndInfos(param.node, param.width);
    }

    return result;
  },
  addStateAndInfo: function (param) {
    var obj = param.obj;
    var nodes = param.nodes;
    var stateAndInfos = param.stateAndInfos;

    stateAndInfos.push(obj);
    inspectorUtilities.relocateStateAndInfos(stateAndInfos);

    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
    }

    if (_.isEqual(nodes, cy.nodes(':selected'))) {
      inspectorUtilities.fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
    }
    cy.forceRender();

    var result = {
      nodes: nodes,
      width: param.width,
      stateAndInfos: stateAndInfos,
      obj: obj
    };
    return result;
  },
  removeStateAndInfo: function (param) {
    var obj = param.obj;
    var nodes = param.nodes;
    var stateAndInfos = param.stateAndInfos;

    var index = stateAndInfos.indexOf(obj);
    stateAndInfos.splice(index, 1);

    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
    }

    if (_.isEqual(nodes, cy.nodes(':selected'))) {
      inspectorUtilities.fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
    }
    inspectorUtilities.relocateStateAndInfos(stateAndInfos);
    cy.forceRender();

    var result = {
      nodes: nodes,
      width: param.width,
      stateAndInfos: stateAndInfos,
      obj: obj
    };
    return result;
  },
  changeIsMultimerStatus: function (param) {
    var firstTime = param.firstTime;
    var nodes = param.nodes;
    var makeMultimer = param.makeMultimer;
    var resultMakeMultimer = {};

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var isMultimer = node.data('sbgnclass').endsWith(' multimer');

      resultMakeMultimer[node.id()] = isMultimer;
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var sbgnclass = node.data('sbgnclass');
      var isMultimer = node.data('sbgnclass').endsWith(' multimer');

      if ((firstTime && makeMultimer) || (!firstTime && makeMultimer[node.id()])) {
        if (!isMultimer) {
          node.data('sbgnclass', sbgnclass + ' multimer');
        }
      }
      else {
        if (isMultimer) {
          node.data('sbgnclass', sbgnclass.replace(' multimer', ''));
        }
      }
    }

    if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
      $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
    }

    var result = {
      makeMultimer: resultMakeMultimer,
      nodes: nodes
    };

    return result;
  },
  changeIsCloneMarkerStatus: function (param) {
    var nodes = param.nodes;
    var makeCloneMarker = param.makeCloneMarker;
    var firstTime = param.firstTime;
    var resultMakeCloneMarker = {};

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      resultMakeCloneMarker[node.id()] = node._private.data.sbgnclonemarker;
      var currentMakeCloneMarker = firstTime ? makeCloneMarker : makeCloneMarker[node.id()];
      node._private.data.sbgnclonemarker = currentMakeCloneMarker ? true : undefined;
      if (node.data('sbgnclass') === 'perturbing agent') {
        node.removeClass('changeClonedStatus');
        node.addClass('changeClonedStatus');
      }
    }

    cy.forceRender();
    if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
      $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
    }

    var result = {
      makeCloneMarker: resultMakeCloneMarker,
      nodes: nodes
    };

    return result;
  }
};
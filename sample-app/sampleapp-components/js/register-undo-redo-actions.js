var registerUndoRedoActions = function () {
  // create undo-redo instance
  var ur = cy.undoRedo({
    keyboardShortcuts: {
      ctrl_z: false, // undo
      ctrl_y: false, // redo
      ctrl_shift_z: false // redo
    }
  });

  // register add remove actions
  ur.action("addNode", addRemoveActionFunctions.addNode, addRemoveActionFunctions.removeNodes);
  ur.action("removeEles", addRemoveActionFunctions.removeEles, addRemoveActionFunctions.restoreEles);
  ur.action("addEdge", addRemoveActionFunctions.addEdge, addRemoveActionFunctions.removeEdges);
  ur.action("deleteSelected", addRemoveActionFunctions.deleteSelected, addRemoveActionFunctions.restoreSelected);
  ur.action("createCompoundForSelectedNodes", addRemoveActionFunctions.createCompoundForSelectedNodes, addRemoveActionFunctions.removeCompound);
  ur.action("changeParent", addRemoveActionFunctions.changeParent, addRemoveActionFunctions.changeParent);

  // register general actions
  ur.action("resizeNode", generalActionFunctions.resizeNode, generalActionFunctions.resizeNode);
  ur.action("changeNodeLabel", generalActionFunctions.changeNodeLabel, generalActionFunctions.changeNodeLabel);
  ur.action("changeStyleData", generalActionFunctions.changeStyleData, generalActionFunctions.changeStyleData);
  ur.action("changeStyleCss", generalActionFunctions.changeStyleCss, generalActionFunctions.changeStyleCss);
  ur.action("changeBendPoints", generalActionFunctions.changeBendPoints, generalActionFunctions.changeBendPoints);

  // register SBGN actions
  ur.action("addStateAndInfo", SBGNActionFunctions.addStateAndInfo, SBGNActionFunctions.removeStateAndInfo);
  ur.action("changeStateVariable", SBGNActionFunctions.changeStateVariable, SBGNActionFunctions.changeStateVariable);
  ur.action("changeUnitOfInformation", SBGNActionFunctions.changeUnitOfInformation, SBGNActionFunctions.changeUnitOfInformation);
  ur.action("changeIsMultimerStatus", SBGNActionFunctions.changeIsMultimerStatus, SBGNActionFunctions.changeIsMultimerStatus);
  ur.action("changeIsCloneMarkerStatus", SBGNActionFunctions.changeIsCloneMarkerStatus, SBGNActionFunctions.changeIsCloneMarkerStatus);
  ur.action("removeStateAndInfo", SBGNActionFunctions.removeStateAndInfo, SBGNActionFunctions.addStateAndInfo);
  
  // register easy creation actions
  ur.action("createTemplateReaction", easyCreationActionFunctions.createTemplateReaction, addRemoveActionFunctions.removeEles);
};
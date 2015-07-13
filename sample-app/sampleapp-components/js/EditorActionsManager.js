/**
 *	Design for SBGNViz Editor actions.
 *  Command Design Pattern is used.
 *  A simple undo-redo manager is implemented(EditorActionsManager)
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */

//Actual  methods
function addNode(newNode)
{
  return addRemoveUtilities.addNode(newNode.content, newNode.x, newNode.y, newNode.width, newNode.height);
}

function removeNodes(nodesToBeDeleted)
{
  return addRemoveUtilities.removeNodes(nodesToBeDeleted);
}

function restoreEles(eles)
{
  return addRemoveUtilities.restoreEles(eles);
}

function addEdge(newEdge)
{
  return addRemoveUtilities.addEdge(newEdge.source, newEdge.target);
}

function removeEdges(edgesToBeDeleted)
{
  return addRemoveUtilities.removeEdges(edgesToBeDeleted);
}

function expandNode(node) {
  return expandCollapseUtilities.expandNode(node);
}

function collapseNode(node) {
  return expandCollapseUtilities.collapseNode(node);
}

function undoExpandNode(param) {
  returnToPositionsAndSizes(param.nodesData);
  return expandCollapseUtilities.collapseNode(param.node);
}

function undoCollapseNode(node) {
  return expandCollapseUtilities.simpleExpandNode(node);
}

function performLayoutFunction(nodesData) {
  return returnToPositionsAndSizes(nodesData);
}

function returnToPositionsAndSizes(nodesData) {
  var currentPositionsAndSizes = {};
  cy.nodes().positions(function (i, ele) {
    currentPositionsAndSizes[ele.id()] = {
      width: ele.width(),
      height: ele.height(),
      x: ele.position("x"),
      y: ele.position("y")
    };
    var data = nodesData[ele.id()];
    ele._private.data.width = data.width;
    ele._private.data.height = data.height;
    return {
      x: data.x,
      y: data.y
    };
  });

  cy.fit(10);
  return currentPositionsAndSizes;
}

function moveNodeConditionally(param) {
  if (param.move) {
    moveNode(param.positionDiff, param.node);
  }
  return param;
}

function moveNodeReversely(param) {
  var diff = {
    x: -1 * param.positionDiff.x,
    y: -1 * param.positionDiff.y
  }
  var result = {
    positionDiff: param.positionDiff,
    node: param.node,
    move: true
  };
  moveNode(diff, param.node);
  return result;
}

function moveNode(positionDiff, node) {
  var oldX = node.position("x");
  var oldY = node.position("y");
  node.position({
    x: oldX + positionDiff.x,
    y: oldY + positionDiff.y
  });
  var children = node.children();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    moveNode(positionDiff, child);
  }
}

function deleteSelected(param) {
  if (param.firstTime) {
    return sbgnFiltering.deleteSelected();
  }
  return addRemoveUtilities.removeEles(param.eles);
}

function restoreSelected(eles) {
  var param = {};
  param.eles = restoreEles(eles);
  param.firstTime = false;
  return param;
}

function hideSelected(param) {
  var currentNodes = cy.nodes(":visible");
  if (param.firstTime) {
    sbgnFiltering.hideSelected();
  }
  else {
    sbgnFiltering.showJustGivenNodes(param.nodesToShow);
  }
  return currentNodes;
}

function showSelected(param) {
  var currentNodes = cy.nodes(":visible");
  if (param.firstTime) {
    sbgnFiltering.showSelected();
  }
  else {
    sbgnFiltering.showJustGivenNodes(param.nodesToShow);
  }
  return currentNodes;
}

function showAll() {
  var currentNodes = cy.nodes(":visible");
  sbgnFiltering.showAll();
  return currentNodes;
}

function showJustGivenNodes(nodesToShow) {
  var param = {};
  param.nodesToShow = cy.nodes(":visible");
  param.firstTime = false;
  sbgnFiltering.showJustGivenNodes(nodesToShow);
  return param;
}

function highlightSelected(param) {
  var elementsToHighlight;
  var result = {};
  //If this is the first call of the function then call the original method
  if (param.firstTime) {
    if (sbgnFiltering.isAllElementsAreNotHighlighted()) {
      //mark that there was no highlighted element
      result.allElementsWasNotHighlighted = true;
    }
    var alreadyHighlighted = cy.elements("[highlighted='true']").filter(":visible");
    if(param.highlightNeighboursofSelected){
      elementsToHighlight = sbgnFiltering.highlightNeighborsofSelected();
    }
    else if(param.highlightProcessesOfSelected){
      elementsToHighlight = sbgnFiltering.highlightProcessesOfSelected();
    }
    elementsToHighlight = elementsToHighlight.not(alreadyHighlighted);
  }
  else {
    elementsToHighlight = param.elesToHighlight.not(cy.elements("[highlighted='true']").filter(":visible"));
    elementsToHighlight.data("highlighted", 'true');
    sbgnFiltering.highlightNodes(elementsToHighlight.nodes());
    sbgnFiltering.highlightEdges(elementsToHighlight.edges());

    //If there are some elements to not highlight handle them
    if (param.elesToNotHighlight != null) {
      var elesToNotHighlight = param.elesToNotHighlight;
      elesToNotHighlight.removeData("highlighted");
      sbgnFiltering.notHighlightNodes(elesToNotHighlight.nodes());
      sbgnFiltering.notHighlightEdges(elesToNotHighlight.edges());
      
      //If there are some elements to not highlight then allElementsWasNotHighlighted should be true
      result.allElementsWasNotHighlighted = true;
    }
  }
  result.elesToNotHighlight = elementsToHighlight;
  return result;
}

function notHighlightEles(param) {
  var elesToNotHighlight = param.elesToNotHighlight;
  var allElementsWasNotHighlighted = param.allElementsWasNotHighlighted;

  var result = {};

  if (param.allElementsWasNotHighlighted) {
    sbgnFiltering.removeHighlights();
    result.elesToHighlight = elesToNotHighlight;
    result.elesToNotHighlight = cy.elements(":visible").not(elesToNotHighlight);
  }
  else {
    sbgnFiltering.notHighlightNodes(elesToNotHighlight.nodes());
    sbgnFiltering.notHighlightEdges(elesToNotHighlight.edges());
    elesToNotHighlight.removeData("highlighted");

    result.elesToHighlight = elesToNotHighlight;
  }

  result.firstTime = false;
  return result;
}

function removeHighlights(){
  var result = {};
  if(sbgnFiltering.isAllElementsAreNotHighlighted()){
    result.elesToHighlight = cy.elements(":visible");
  }
  else{
    result.elesToHighlight = cy.elements("[highlighted='true']").filter(":visible");
  }
  
  sbgnFiltering.removeHighlights();
  
  result.elesToNotHighlight = cy.elements(":visible").not(result.elesToHighlight);
  result.firstTime = false;
  return result;
}

/*
 *	Base command class
 * do: reference to the function that performs actual action for this command.
 * undo: reference to the action that is reverse of this action's command.
 * params: additional parameters for this command
 */
var Command = function (_do, undo, params) {
  this._do = _do;
  this.undo = undo;
  this.params = params;
};

var AddNodeCommand = function (newNode)
{
  return new Command(addNode, removeNodes, newNode);
};

var RemoveNodesCommand = function (nodesTobeDeleted)
{
  return new Command(removeNodes, restoreEles, nodesTobeDeleted);
};

var AddEdgeCommand = function (newEdge)
{
  return new Command(addEdge, removeEdges, newEdge);
};

var RemoveEdgesCommand = function (edgesTobeDeleted)
{
  return new Command(removeEdges, restoreEles, edgesTobeDeleted);
};

var ExpandNodeCommand = function (node) {
  return new Command(expandNode, undoExpandNode, node);
};

var CollapseNodeCommand = function (node) {
  return new Command(collapseNode, undoCollapseNode, node);
};

var PerformLayoutCommand = function (nodesData) {
  return new Command(performLayoutFunction, returnToPositionsAndSizes, nodesData);
};

var MoveNodeCommand = function (param) {
  return new Command(moveNodeConditionally, moveNodeReversely, param);
};

var DeleteSelectedCommand = function (param) {
  return new Command(deleteSelected, restoreSelected, param);
};

var HideSelectedCommand = function (param) {
  return new Command(hideSelected, showJustGivenNodes, param);
};

var ShowSelectedCommand = function (param) {
  return new Command(showSelected, showJustGivenNodes, param);
};

var ShowAllCommand = function () {
  return new Command(showAll, showJustGivenNodes);
};

var HighlightNeighborsofSelectedCommand = function (param) {
  param.highlightNeighboursofSelected = true;
  return new Command(highlightSelected, notHighlightEles, param);
};

var HighlightProcessesOfSelectedCommand = function (param) {
  param.highlightProcessesOfSelected = true;
  return new Command(highlightSelected, notHighlightEles, param);
};

var RemoveHighlightsCommand = function () {
  return new Command(removeHighlights, highlightSelected);
};

/**
 *  Description: A simple action manager that acts also as a undo-redo manager regarding Command Design Pattern
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */
function EditorActionsManager()
{
  this.undoStack = [];
  this.redoStack = [];

  /*
   *  Executes given command by calling do method of given command
   *  pushes the action to the undoStack after execution.
   */
  this._do = function (command)
  {
    //_do function returns the parameters for undo function
    command.undoparams = command._do(command.params);
    this.undoStack.push(command);
  };

  /*
   *  Undo last command.
   *  Pushes the reversed action to the redoStack after undo operation.
   */
  this.undo = function ()
  {
    if (this.undoStack.length == 0) {
      return;
    }
    var lastCommand = this.undoStack.pop();
    var result = lastCommand.undo(lastCommand.undoparams);
    //If undo function returns something then do function params should be refreshed
    if (result != null) {
      lastCommand.params = result;
    }
    this.redoStack.push(lastCommand);
  };

  /*
   *  Redo last command that is previously undid.
   *  This method basically calls do method for the last command that is popped of the redoStack.
   */
  this.redo = function ()
  {
    if (this.redoStack.length == 0) {
      return;
    }
    var lastCommand = this.redoStack.pop();
    this._do(lastCommand);
  };

  /*
   * 
   * This method indicates whether the undo stack is empty
   */
  this.isUndoStackEmpty = function () {
    return this.undoStack.length == 0;
  }

  /*
   * 
   * This method indicates whether the redo stack is empty
   */
  this.isRedoStackEmpty = function () {
    return this.redoStack.length == 0;
  }

  /*
   *  Empties undo and redo stacks !
   */
  this.reset = function ()
  {
    this.undoStack = [];
    this.redoStack = [];
  };
}
window.editorActionsManager = new EditorActionsManager();

/*
 *  A sample run that gives insight about the usage of EditorActionsManager and commands
 */
function sampleRun()
{
  var editorActionsManager = new EditorActionsManager();

  // issue commands
  editorActionsManager._do(new AddNodeCommand(newNode));

  // undo redo mechanism
  editorActionsManager.undo();
  editorActionsManager.redo();

}
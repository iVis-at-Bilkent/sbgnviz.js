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

function restoreNodes(eles)
{
  return addRemoveUtilities.restoreNodes(eles);
}

function addEdge(newEdge)
{
  return addRemoveUtilities.addEdge(newEdge.source, newEdge.target);
}

function removeEdges(edgesToBeDeleted)
{
  return addRemoveUtilities.removeEdges(edgesToBeDeleted);
}

function restoreEdges(edges)
{
  return addRemoveUtilities.restoreEdges(edges);
}

function expandNode(node) {
  return expandCollapseUtilities.expandNode(node);
}

function collapseNode(node){
  return expandCollapseUtilities.collapseNode(node);
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
  return new Command(removeNodes, restoreNodes, nodesTobeDeleted);
};

var AddEdgeCommand = function (newEdge)
{
  return new Command(addEdge, removeEdges, newEdge);
};

var RemoveEdgesCommand = function (edgesTobeDeleted)
{
  return new Command(removeEdges, restoreEdges, edgesTobeDeleted);
};

var ExpandNodeCommand = function (node){
  return new Command(expandNode, collapseNode, node);
};

var CollapseNodeCommand = function (node){
  return new Command(collapseNode, expandNode, node);
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
    lastCommand.undo(lastCommand.undoparams);
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
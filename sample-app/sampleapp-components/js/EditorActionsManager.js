 /**
 *	Design for SBGNViz Editor actions.
 *  Command Design Pattern is used.
 *  A simple undo-redo manager is implemented(EditorActionsManager)
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */

//Actual  methods
function addNode(newNode) 
{
	//cy.addNode 
}

function removeNode(nodeToBeDeleted) 
{ 
	//cy.deleteNode
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
}
 
var AddNodeCommand = function (newNode) 
{
    return new Command(addNode, removeNode, newNode);
};

var RemoveNodeCommand = function (nodeTobeDeleted) 
{
    return new Command(removeNode, addNode, nodeTobeDeleted);
};

 /**
 *  Description: A simple action manager that acts also as a undo-redo manager regarding Command Design Pattern
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */
var editorActionsManager = {
    undoStack: [],
    redoStack: [],
 
	 /*
	 *  Executes given command by calling do method of given command
	 *  pushes the action to the undoStack after execution.
	 */
    _do: function (command) 
    {
        command._do(command.params);
     	undoStack.push(command);
    },

	 /*
	 *  Undo last command.
	 *  Pushes the reversed action to the redoStack after undo operation.
	 */
    undo: function () 
    {
    	var lastCommand = undoStack.pop();
    	lastCommand.undo(lastCommand.params);
    	redoStack.push(lastCommand);
    },

	 /*
	 *  Redo last command that is previously undid.
	 *  This method basically calls do method for the last command that is popped of the redoStack.
	 */
    redo: function()
    {
    	var lastCommand = redoStack.pop();
    	this._do(lastCommand)
    },

	 /*
	 *  Empties undo and redo stacks !
	 */
    reset: function()
    {
	    undoStack = [];
	    redoStack =[];
    }
}
 
 
/*
 *  A sample run that gives insight about the usage of EditorActionsManager and commands
 */
function sampleRun() 
{
//    var editorActionsManager = new EditorActionsManager();
 
    // issue commands
    editorActionsManager._do(new AddNodeCommand(newNode));
 
    // undo redo mechanism
    editorActionsManager.undo();
    editorActionsManager.redo();
 
}
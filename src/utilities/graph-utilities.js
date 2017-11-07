/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = require('./option-utilities');
var options = optionUtilities.getOptions();
var libs = require('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var classes = require('./classes')

function graphUtilities() {}

// TODO make these initial values user options instead of hardcoding them here
graphUtilities.portsEnabled = true;
graphUtilities.compoundSizesConsidered = false;

graphUtilities.disablePorts = function() {
  graphUtilities.portsEnabled = false;
  cy.style().update();
};

graphUtilities.enablePorts = function() {
  graphUtilities.portsEnabled = true;
  cy.style().update();
};

graphUtilities.arePortsEnabled = function() {
  return graphUtilities.portsEnabled;
};

graphUtilities.considerCompoundSizes = function() {
  graphUtilities.compoundSizesConsidered = true;
  cy.style().update();
};

graphUtilities.omitCompoundSizes = function() {
  graphUtilities.compoundSizesConsidered = false;
  cy.style().update();
};

graphUtilities.areCompoundSizesConsidered = function() {
  return graphUtilities.compoundSizesConsidered = true;
};

graphUtilities.updateGraph = function(cyGraph) {
  console.log('cy update called');
  $( document ).trigger( "updateGraphStart" );
  // Reset undo/redo stack and buttons when a new graph is loaded
  if (options.undoable) {
    cy.undoRedo().reset();
//    this.resetUndoRedoButtons();
  }

  cy.startBatch();
  // clear data
  cy.remove('*');
  cy.add(cyGraph);

  //add position information to data for preset layout
  var positionMap = {};
  cy.nodes().forEach(function(node) {
    var xPos = node.data('bbox').x;
    var yPos = node.data('bbox').y;
    positionMap[node.data('id')] = {'x': xPos, 'y': yPos};

    // assign correct parents to info boxes
    var statesandinfos = node.data('statesandinfos');
    for (var j=0; j < statesandinfos.length; j++) {
      classes.getAuxUnitClass(statesandinfos[j]).setParentRef(statesandinfos[j], node);
    }
  });


  this.refreshPaddings(); // Recalculates/refreshes the compound paddings
  cy.endBatch();

  var layout = cy.layout({
    name: 'preset',
    positions: positionMap,
    fit: true,
    padding: 50
  });

  // Check this for cytoscape.js backward compatibility
  if (layout && layout.run) {
    layout.run();
  }

  // Update the style
  cy.style().update();
  // Initilize the bend points once the elements are created
  if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
    cy.edgeBendEditing('get').initBendPoints(cy.edges());
  }

  $( document ).trigger( "updateGraphEnd" );
};

graphUtilities.calculatePaddings = function(paddingPercent) {
  //As default use the compound padding value
  if (!paddingPercent) {
    var compoundPadding = options.compoundPadding;
    paddingPercent = typeof compoundPadding === 'function' ? compoundPadding.call() : compoundPadding;
  }

  var nodes = cy.nodes();
  var total = 0;
  var numOfSimples = 0;
  for (var i = 0; i < nodes.length; i++) {
    var theNode = nodes[i];
    if (theNode.children() == null || theNode.children().length == 0) {
      total += Number(theNode.width());
      total += Number(theNode.height());
      numOfSimples++;
    }
  }

  var calc_padding = (paddingPercent / 100) * Math.floor(total / (2 * numOfSimples));
  if (calc_padding < 5) {
    calc_padding = 5;
  }

  return calc_padding;
};

graphUtilities.recalculatePaddings = graphUtilities.refreshPaddings = function() {
  // this.calculatedPaddings is not working here
  // TODO: replace this reference with this.calculatedPaddings once the reason is figured out
  graphUtilities.calculatedPaddings = this.calculatePaddings();
  return graphUtilities.calculatedPaddings;
};

graphUtilities.getCompoundPaddings = function() {
  // Return calculated paddings in case of that data is invalid return 5
  return graphUtilities.calculatedPaddings || 5;
};

module.exports = graphUtilities;

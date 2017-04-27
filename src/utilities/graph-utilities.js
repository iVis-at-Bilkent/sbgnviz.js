/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = require('./option-utilities');
var options = optionUtilities.getOptions();
var libs = require('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var adjustBBoxesForPorts = function(multiply) {
  var nodes = cy.nodes();
  cy.startBatch();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var ports = node.data('ports');
    if (ports.length !== 2) {
      continue;
    }
    // We assume that the ports are symmetric to the node center so using just one of the ports is enough
    var port = node.data('ports')[0];
    var orientation = port.x === 0 ? 'vertical' : 'horizontal';
    // This is the ratio of the area occupied with ports over without ports
    var ratio = orientation === 'vertical' ? Math.abs(port.y) / 50 : Math.abs(port.x) / 50;
    
    var bbox = node.data('bbox');
    
    // If multiply is set multiply bbox by calculated ratio else divide it by that ratio
    if (multiply) {
      bbox.w *= ratio;
      bbox.h *= ratio;
    }
    else {
      bbox.w /= ratio;
      bbox.h /= ratio;
    }
    
    node.data('bbox', bbox); // Set the node bbox
  }
  cy.endBatch();
};

function graphUtilities() {}

graphUtilities.portsEnabled = true;

graphUtilities.disablePorts = function() {
  if (graphUtilities.portsEnabled === false) {
    return;
  }
  graphUtilities.portsEnabled = false;
  adjustBBoxesForPorts(false);
};

graphUtilities.enablePorts = function() {
  if (graphUtilities.portsEnabled === true) {
    return;
  }
  graphUtilities.portsEnabled = true;
  adjustBBoxesForPorts(true);
};

graphUtilities.arePortsEnabled = function() {
  return graphUtilities.portsEnabled;
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
  for (var i = 0; i < cyGraph.nodes.length; i++) {
    var xPos = cyGraph.nodes[i].data.bbox.x;
    var yPos = cyGraph.nodes[i].data.bbox.y;
    positionMap[cyGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
  }

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

module.exports = graphUtilities;
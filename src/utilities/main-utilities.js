/* 
 * These are the main utilities to be directly utilized by the user interactions
 */

var sbgnElementUtilities = require('./sbgn-element-utilities');
var sbgnGraphUtilities = require('./sbgn-graph-utilities');
var jsonToSbgnml = require('./json-to-sbgnml-converter');
var sbgnmlToJson = require('./sbgnml-to-json-converter');
var optionUtilities = require('./option-utilities');

var options = optionUtilities.getOptions();

// Helpers start
function beforePerformLayout() {
  var nodes = cy.nodes();
  var edges = cy.edges();

  nodes.removeData("ports");
  edges.removeData("portsource");
  edges.removeData("porttarget");

  nodes.data("ports", []);
  edges.data("portsource", []);
  edges.data("porttarget", []);

  // TODO do this by using extension API
  cy.$('.edgebendediting-hasbendpoints').removeClass('edgebendediting-hasbendpoints');
  edges.scratch('cyedgebendeditingWeights', []);
  edges.scratch('cyedgebendeditingDistances', []);
};
// Helpers end

function mainUtilities() {}

mainUtilities.expandNodes = function(nodes) {
  var nodesToExpand = nodes.filter("[expanded-collapsed='collapsed']");
  if (nodesToExpand.expandableNodes().length == 0) {
    return;
  }
  if(options.undoable) {
    cy.undoRedo().do("expand", {
      nodes: nodesToExpand,
    });
  }
  else {
    nodes.expand();
  }
};

mainUtilities.collapseNodes = function(nodes) {
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  }
  else {
    nodes.collapse();
  }
};

mainUtilities.collapseComplexes = function() {
  var complexes = cy.nodes("[sbgnclass='complex']");
  if (complexes.collapsibleNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: complexes
    });
  }
  else {
    complexes.collapseRecursively();
  }
};

mainUtilities.expandComplexes = function() {
  var nodes = cy.nodes(":selected").filter("[sbgnclass='complex'][expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.expandRecursively();
  }
};

mainUtilities.collapseAll = function() {
  var nodes = cy.nodes(':visible');
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.collapseRecursively();
  }
};

mainUtilities.expandAll = function() {
  var nodes = cy.nodes(':visible').filter("[expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.expandRecursively();
  }
};

mainUtilities.hideEles = function(eles) {
  if (eles.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", eles);
  }
  else {
    eles.hideEles();
  }
};

mainUtilities.showEles = function(eles) {
  if (eles.length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", eles);
  }
  else {
    eles.showEles();
  }
};

mainUtilities.showAll = function() {
  if (cy.elements().length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", cy.elements());
  }
  else {
    cy.elements().showEles();
  }
};

mainUtilities.deleteElesSimple = function(eles) {
  if (eles.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("deleteElesSimple", {
      eles: eles
    });
  }
  else {
    eles.remove();
  }
};

mainUtilities.deleteElesSmart = function(eles) {
  if (eles.length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("deleteElesSmart", {
      firstTime: true,
      eles: eles
    });
  }
  else {
    sbgnElementUtilities.deleteElesSmart(eles);
  }
};

mainUtilities.highlightNeighbours = function(eles) {
  var elesToHighlight = sbgnElementUtilities.getNeighboursOfEles(eles);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    elesToHighlight.highlight();
  }
};

mainUtilities.searchByLabel = function(label) {
  if (label.length == 0) {
    return;
  }
  
  var nodesToHighlight = cy.nodes(":visible").filter(function (i, ele) {
    if (ele.data("sbgnlabel") && ele.data("sbgnlabel").toLowerCase().indexOf(label) >= 0) {
      return true;
    }
    return false;
  });

  if (nodesToHighlight.length == 0) {
    return;
  }

  nodesToHighlight = sbgnElementUtilities.extendNodeList(nodesToHighlight);
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", nodesToHighlight);
  }
  else {
    nodesToHighlight.highlight();
  }
};

mainUtilities.highlightProcesses = function(eles) {
  var elesToHighlight = sbgnElementUtilities.extendNodeList(eles);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    elesToHighlight.highlight();
  }
};

mainUtilities.removeHighlights = function() {
  if (sbgnElementUtilities.noneIsNotHighlighted()) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("removeHighlights");
  }
  else {
    cy.removeHighlights()
  }
};

mainUtilities.performLayout = function(layoutOptions, notUndoable) {
  // Things to do before performing layout
  beforePerformLayout();
  
  if (!options.undoable || notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
    cy.elements().filter(':visible').layout(layoutOptions);
  }
  else {
    cy.undoRedo().do("layout", {
      options: layoutOptions,
      eles: cy.elements().filter(':visible')
    });
  }
};

mainUtilities.createSbgnml = function() {
  return jsonToSbgnml.createSbgnml();
};

mainUtilities.convertSbgnmlToJson = function(data) {
  return sbgnmlToJson.convert(data);
};

module.exports = mainUtilities;
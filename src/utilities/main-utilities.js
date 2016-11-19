/* 
 * These are the main utilities to be directly utilized by the user interactions
 */

var sbgnElementUtilities = require('./sbgn-element-utilities');
var sbgnGraphUtilities = require('./sbgn-graph-utilities');
var jsonToSbgnml = require('./json-to-sbgnml-converter');
var sbgnmlToJson = require('./sbgnml-to-json-converter');

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
  cy.undoRedo().do("expand", {
    nodes: nodesToExpand,
  });
};

mainUtilities.hideEles = function(eles) {
  if (eles.length === 0) {
    return;
  }
  cy.undoRedo().do("hide", eles);
};

mainUtilities.showEles = function(eles) {
  if (eles.length === cy.elements(':visible').length) {
    return;
  }
  cy.undoRedo().do("show", eles);
};

mainUtilities.collapseNodes = function(nodes) {
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  cy.undoRedo().do("collapse", {
    nodes: nodes
  });
};

mainUtilities.showAll = function() {
  if (cy.elements().length === cy.elements(':visible').length) {
    return;
  }
  cy.undoRedo().do("show", cy.elements());
};

mainUtilities.deleteElesSmart = function(eles) {
  if (eles.length == 0) {
    return;
  }
  cy.undoRedo().do("deleteElesSmart", {
    firstTime: true,
    eles: eles
  });
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
  cy.undoRedo().do("highlight", elesToHighlight);
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
  cy.undoRedo().do("highlight", nodesToHighlight);
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
  cy.undoRedo().do("highlight", elesToHighlight);
};

mainUtilities.removeHighlights = function() {
  if (sbgnElementUtilities.noneIsNotHighlighted()) {
    return;
  }
  cy.undoRedo().do("removeHighlights");
};

mainUtilities.deleteElesSimple = function(eles) {
  if (eles.length == 0) {
    return;
  }
  cy.undoRedo().do("deleteElesSimple", {
    eles: eles
  });
};

mainUtilities.collapseComplexes = function() {
  var complexes = cy.nodes("[sbgnclass='complex']");
  if (complexes.collapsibleNodes().length == 0) {
    return;
  }
  cy.undoRedo().do("collapseRecursively", {
    nodes: complexes
  });
};

mainUtilities.expandComplexes = function() {
  var nodes = cy.nodes(":selected").filter("[sbgnclass='complex'][expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  cy.undoRedo().do("expandRecursively", {
    nodes: nodes
  });
};

mainUtilities.collapseAll = function() {
  var nodes = cy.nodes(':visible');
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  cy.undoRedo().do("collapseRecursively", {
    nodes: nodes
  });
};

mainUtilities.expandAll = function() {
  var nodes = cy.nodes(':visible').filter("[expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  cy.undoRedo().do("expandRecursively", {
    nodes: nodes
  });
};

mainUtilities.performLayout = function(options, notUndoable) {
  // Things to do before performing layout
  beforePerformLayout();
  
  if (notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
    cy.elements().filter(':visible').layout(options);
  }
  else {
    cy.undoRedo().do("layout", {
      options: options,
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
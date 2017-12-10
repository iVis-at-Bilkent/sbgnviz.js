/*
 * These are the main utilities to be directly utilized by the user interactions.
 * Idealy, this file is just required by index.js
 */

var libUtilities = require('./lib-utilities');
var tdToJson = require('./tab-delimeted-to-json-converter');
var libs = libUtilities.getLibs();
var jQuery = $ = libs.jQuery;

module.exports = function () {
  var elementUtilities, jsonToSbgnml, sbgnmlToJson, optionUtilities, graphUtilities;
  var cy, options;

  function mainUtilities (param) {
    elementUtilities = param.elementUtilities;
    jsonToSbgnml = param.jsonToSbgnmlConverter;
    sbgnmlToJson = param.sbgnmlToJsonConverter;
    optionUtilities = param.optionUtilities;
    graphUtilities = param.graphUtilities;
    cy = param.sbgnCyInstance.getCy();

    options = optionUtilities.getOptions();
  }

  // Helpers start
  function beforePerformLayout() {
    var parents = cy.nodes(':parent');
    var edges = cy.edges();

    cy.startBatch();

    // graphUtilities.disablePorts();

    // TODO do this by using extension API
    cy.$('.edgebendediting-hasbendpoints').removeClass('edgebendediting-hasbendpoints');
    edges.scratch('cyedgebendeditingWeights', []);
    edges.scratch('cyedgebendeditingDistances', []);

    parents.removeData('minWidth');
    parents.removeData('minHeight');
    parents.removeData('minWidthBiasLeft');
    parents.removeData('minWidthBiasRight');
    parents.removeData('minHeightBiasTop');
    parents.removeData('minHeightBiasBottom');

    cy.endBatch();
    cy.style().update();
  };
  // Helpers end

  // Expand given nodes. Requires expandCollapse extension and considers undoable option.
  mainUtilities.expandNodes = function(nodes) {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    var nodesToExpand = expandCollapse.expandableNodes(nodes);
    if (nodesToExpand.length == 0) {
      return;
    }
    if(options.undoable) {
      cy.undoRedo().do("expand", {
        nodes: nodesToExpand,
      });
    }
    else {
      expandCollapse.expand(nodes);
    }
  };

  // Collapse given nodes. Requires expandCollapse extension and considers undoable option.
  mainUtilities.collapseNodes = function(nodes) {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    if (expandCollapse.collapsibleNodes(nodes).length == 0) {
      return;
    }

    if(options.undoable) {
      cy.undoRedo().do("collapse", {
        nodes: nodes
      });
    }
    else {
      expandCollapse.collapse(nodes);
    }
  };

  // Collapse all complexes recursively. Requires expandCollapse extension and considers undoable option.
  mainUtilities.collapseComplexes = function() {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    var complexes = cy.nodes("[class^='complex']");
    if (expandCollapse.collapsibleNodes(complexes).length == 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("collapseRecursively", {
        nodes: complexes
      });
    }
    else {
      expandCollapse.collapseRecursively(complexes);
    }
  };

  // Expand all complexes recursively. Requires expandCollapse extension and considers undoable option.
  mainUtilities.expandComplexes = function() {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    var nodes = expandCollapse.expandableNodes(cy.nodes().filter("[class^='complex']"));
    if (nodes.length == 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("expandRecursively", {
        nodes: nodes
      });
    }
    else {
      expandCollapse.expandRecursively(nodes);
    }
  };

  // Collapse all nodes recursively. Requires expandCollapse extension and considers undoable option.
  mainUtilities.collapseAll = function() {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    var nodes = cy.nodes(':visible');
    if (expandCollapse.collapsibleNodes(nodes).length == 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("collapseRecursively", {
        nodes: nodes
      });
    }
    else {
      expandCollapse.collapseRecursively(nodes);
    }
  };

  // Expand all nodes recursively. Requires expandCollapse extension and considers undoable option.
  mainUtilities.expandAll = function() {
    // Get expandCollapse api
    var expandCollapse = cy.expandCollapse('get');

    var nodes = expandCollapse.expandableNodes(cy.nodes(':visible'));
    if (nodes.length == 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("expandRecursively", {
        nodes: nodes
      });
    }
    else {
      expandCollapse.expandRecursively(nodes);
    }
  };

  // Increase border width to show nodes with hidden neighbors
  mainUtilities.thickenBorder = function(eles){
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.data("border-width"));
      ele.data("border-width", defaultBorderWidth + 2);
    });
    eles.data("thickBorder", true);
    return eles;
  }
  // Decrease border width when hidden neighbors of the nodes become visible
  mainUtilities.thinBorder = function(eles){
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.data("border-width"));
      ele.data("border-width", defaultBorderWidth - 2);
    });
    eles.removeData("thickBorder");
    return eles;
  }

  // Extends the given nodes list in a smart way to leave the map intact and hides the resulting list.
  // Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.hideNodesSmart = function(_nodes) {
    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');
    var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes

    var allNodes = cy.nodes(":visible");
    var nodesToShow = elementUtilities.extendRemainingNodes(nodes, allNodes);
    var nodesToHide = allNodes.not(nodesToShow);

    if (nodesToHide.length === 0) {
      return;
    }

    if(options.undoable) {

      var ur = cy.undoRedo();
      ur.action("thickenBorder", mainUtilities.thickenBorder, mainUtilities.thinBorder);
      ur.action("thinBorder", mainUtilities.thinBorder, mainUtilities.thickenBorder);

      // Batching
      var actions = [];
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes().intersection(nodesToHide);
      actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
      actions.push({name: "hide", param: nodesToHide});
      nodesWithHiddenNeighbor = nodesToHide.neighborhood(":visible")
              .nodes().difference(nodesToHide).difference(cy.nodes("[thickBorder]"));
      actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
      cy.undoRedo().do("batch", actions);
    }
    else {
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      mainUtilities.thinBorder(nodesWithHiddenNeighbor);
      viewUtilities.hide(nodesToHide);
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      mainUtilities.thickenBorder(nodesWithHiddenNeighbor);
    }
  };

  // Extends the given nodes list in a smart way to leave the map intact.
  // Then unhides the resulting list and hides others. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.showNodesSmart = function(_nodes) {
    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');
    var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes

    var allNodes = cy.elements();
    var nodesToShow = elementUtilities.extendNodeList(nodes);
    var nodesToHide = allNodes.not(nodesToShow);

    if (nodesToHide.length === 0) {
      return;
    }

    if(options.undoable) {
      var ur = cy.undoRedo();
      ur.action("thickenBorder", mainUtilities.thickenBorder, mainUtilities.thinBorder);
      ur.action("thinBorder", mainUtilities.thinBorder, mainUtilities.thickenBorder);

      // Batching
      var actions = [];
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
      actions.push({name: "hide", param: nodesToHide});
      nodesWithHiddenNeighbor = nodesToHide.neighborhood(":visible")
              .nodes().difference(nodesToHide);
      actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
      cy.undoRedo().do("batch", actions);
    }
    else {
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      mainUtilities.thinBorder(nodesWithHiddenNeighbor);
      viewUtilities.hide(nodesToHide);
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      mainUtilities.thickenBorder(nodesWithHiddenNeighbor);
    }
  };

  // Unhides elements passed as arguments. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.showEles = function(eles) {
      // If this function is being called we can assume that view utilities extension is on use
      var viewUtilities = cy.viewUtilities('get');
      var hiddenEles = eles.filter(':hidden');
      if (hiddenEles.length === 0) {
          return;
      }
      if(options.undoable) {
          var ur = cy.undoRedo();
          ur.action("thickenBorder", mainUtilities.thickenBorder, mainUtilities.thinBorder);
          ur.action("thinBorder", mainUtilities.thinBorder, mainUtilities.thickenBorder);

          // Batching
          var actions = [];
          var nodesToThinBorder = (hiddenEles.neighborhood(":visible").nodes("[thickBorder]"))
                                  .difference(cy.edges(":hidden").difference(hiddenEles.edges().union(hiddenEles.nodes().connectedEdges())).connectedNodes());
          actions.push({name: "thinBorder", param: nodesToThinBorder});
          actions.push({name: "show", param: hiddenEles});
          var nodesToThickenBorder = hiddenEles.nodes().edgesWith(cy.nodes(":hidden").difference(hiddenEles.nodes()))
  	            .connectedNodes().intersection(hiddenEles.nodes());
          actions.push({name: "thickenBorder", param: nodesToThickenBorder});
          cy.undoRedo().do("batch", actions);
      }
      else {
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          mainUtilities.thinBorder(nodesWithHiddenNeighbor);
          viewUtilities.show(eles);
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          mainUtilities.thickenBorder(nodesWithHiddenNeighbor);
      }
  };

  // Unhides all elements. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.showAll = function() {
    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    if (cy.elements().length === cy.elements(':visible').length) {
      return;
    }

    if(options.undoable) {
      var ur = cy.undoRedo();
      ur.action("thickenBorder", mainUtilities.thickenBorder, mainUtilities.thinBorder);
      ur.action("thinBorder", mainUtilities.thinBorder, mainUtilities.thickenBorder);

      // Batching
      var actions = [];
      var nodesWithHiddenNeighbor = cy.nodes("[thickBorder]");
      actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
      actions.push({name: "show", param: cy.elements()});
      cy.undoRedo().do("batch", actions);
    }
    else {
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      mainUtilities.thinBorder(nodesWithHiddenNeighbor);
      viewUtilities.show(cy.elements());
    }
  };

  // Removes the given elements in a simple way. Considers 'undoable' option.
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

  // Extends the given nodes list in a smart way to leave the map intact and removes the resulting list.
  // Considers 'undoable' option.
  mainUtilities.deleteNodesSmart = function(_nodes) {
    var nodes = _nodes.nodes();
    if (nodes.length == 0) {
      return;
    }

    if(options.undoable) {
      cy.undoRedo().do("deleteNodesSmart", {
        firstTime: true,
        eles: nodes
      });
    }
    else {
      elementUtilities.deleteNodesSmart(nodes);
    }
  };

  // Highlights selected elements. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.highlightSelected = function(_eles) {

    var elesToHighlight = _eles;
    if (elesToHighlight.length === 0) {
      return;
    }
    var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
    var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
    if (elesToHighlight.same(highlightedEles)) {
      return;
    }

    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    if (options.undoable) {
      cy.undoRedo().do("highlight", elesToHighlight);
    }
    else {
      viewUtilities.highlight(elesToHighlight);
    }

    cy.elements().unselect();
  };

  // Highlights neighbours of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.highlightNeighbours = function(_nodes) {
    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
    var elesToHighlight = elementUtilities.getNeighboursOfNodes(nodes);
    if (elesToHighlight.length === 0) {
      return;
    }
    var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
    var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
    if (elesToHighlight.same(highlightedEles) && !cy.elements(":unselected").empty()) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("highlight", elesToHighlight);
    }
    else {
      viewUtilities.highlight(elesToHighlight);
    }

    cy.elements().unselect();
  };

  // Finds the elements whose label includes the given label and highlights processes of those elements.
  // Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.searchByLabel = function(label) {
    if (label.length == 0) {
      return;
    }

    var nodesToHighlight = cy.nodes(":visible").filter(function (ele, i) {
      if(typeof ele === "number") {
        ele = i;
      }
      if (ele.data("label") && ele.data("label").toLowerCase().indexOf(label) >= 0) {
        return true;
      }
      return false;
    });

    if (nodesToHighlight.length == 0) {
      return;
    }

    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    nodesToHighlight = elementUtilities.extendNodeList(nodesToHighlight);

    if (options.undoable) {
      cy.undoRedo().do("highlight", nodesToHighlight);
    }
    else {
      viewUtilities.highlight(nodesToHighlight);
    }

    cy.elements().unselect();
  };

  // Highlights processes of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.highlightProcesses = function(_nodes) {
    var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
    var elesToHighlight = elementUtilities.extendNodeList(nodes);
    if (elesToHighlight.length === 0) {
      return;
    }
    var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
    var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
    if (elesToHighlight.same(highlightedEles)) {
      return;
    }

    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    if (options.undoable) {
      cy.undoRedo().do("highlight", elesToHighlight);
    }
    else {
      viewUtilities.highlight(elesToHighlight);
    }

    cy.elements().unselect();
  };

  // Unhighlights any highlighted element. Requires viewUtilities extension and considers 'undoable' option.
  mainUtilities.removeHighlights = function() {
    if (elementUtilities.noneIsNotHighlighted()) {
      return;
    }

    // If this function is being called we can assume that view utilities extension is on use
    var viewUtilities = cy.viewUtilities('get');

    if (options.undoable) {
      cy.undoRedo().do("removeHighlights");
    }
    else {
      viewUtilities.removeHighlights();
    }
    cy.style().update();
  };

  // Performs layout by given layoutOptions. Considers 'undoable' option. However, by setting notUndoable parameter
  // to a truthy value you can force an undable layout operation independant of 'undoable' option.
  mainUtilities.performLayout = function(layoutOptions, notUndoable) {
    // Things to do before performing layout
    beforePerformLayout();

    if (!options.undoable || notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
      var layout = cy.elements().filter(':visible').layout(layoutOptions);

      // Check this for cytoscape.js backward compatibility
      if (layout && layout.run) {
        layout.run();
      }
    }
    else {
      cy.undoRedo().do("layout", {
        options: layoutOptions,
        eles: cy.elements().filter(':visible')
      });
    }
  };

  // Creates an sbgnml file content from the exising graph and returns it.
  mainUtilities.createSbgnml = function() {
    return jsonToSbgnml.createSbgnml();
  };

  // Converts given sbgnml data to a json object in a special format
  // (http://js.cytoscape.org/#notation/elements-json) and returns it.
  mainUtilities.convertSbgnmlToJson = function(data) {
    return sbgnmlToJson.convert(data);
  };

  // Create the qtip contents of the given node and returns it.
  mainUtilities.getQtipContent = function(node) {
    return elementUtilities.getQtipContent(node);
  };

  // Change option
  mainUtilities.setShowComplexName = function(showComplexName) {
    options.showComplexName = showComplexName;
    // make change active by triggering data which will trigger style update
    cy.nodes('[class^="complex"]').forEach(function(ele){
      ele.trigger("data");
    });
  };

  /*
   * Sets the ordering of the given nodes.
   * Ordering options are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
   * If a node does not have any port before the operation and it is supposed to have some after operation the portDistance parameter is
   * used to set the distance between the node center and the ports. The default port distance is 60.
   * Considers undoable option.
   */
  mainUtilities.setPortsOrdering = function (nodes, ordering, portDistance) {
    if ( nodes.length === 0 ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.setPortsOrdering(nodes, ordering, portDistance);
    }
    else {
      var param = {
        nodes: nodes,
        ordering: ordering,
        portDistance: portDistance
      };

      cy.undoRedo().do("setPortsOrdering", param);
    }

    cy.style().update();
  };

  /**
   * Get map properties from SBGNML file
   * Needs to be called after file is loaded - sbgnvizLoadFileEnd event
   * return: map properties as object
   */
mainUtilities.getMapProperties = function() {
  if( sbgnmlToJson.map != undefined)
   return sbgnmlToJson.mapPropertiesToObj();
  else
    {
      elementUtilities.mapType = "AF";
      return tdToJson.mapPropertiesToObj();
    }
 }
   return mainUtilities;
};

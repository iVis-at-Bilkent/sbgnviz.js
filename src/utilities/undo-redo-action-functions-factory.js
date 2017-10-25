/*
 * This file exports the functions to be utilized in undoredo extension actions
 */

module.exports = function () {

  var elementUtilities;
  var cy;

  function undoRedoActionFunctions (param) {
    elementUtilities = param.elementUtilities;
    cy = param.sbgnCyInstance.getCy();
  }

  undoRedoActionFunctions.deleteElesSimple = function (param) {
    return elementUtilities.deleteElesSimple(param.eles);
  };

  undoRedoActionFunctions.restoreEles = function (eles) {
    var param = {};
    param.eles = elementUtilities.restoreEles(eles);
    return param;
  };

  undoRedoActionFunctions.deleteNodesSmart = function (param) {
    if (param.firstTime) {
      return elementUtilities.deleteNodesSmart(param.eles);
    }
    return elementUtilities.deleteElesSimple(param.eles);
  };

  undoRedoActionFunctions.setPortsOrdering = function(param) {
    var nodes = param.nodes;
    var ordering = param.ordering;
    var portDistance = param.portDistance;
    var connectedEdges = nodes.connectedEdges();
    var nodePropMap = {}; // Node prop map for current status of the nodes it is to be attached to the result map. It includes node current port ordering and current ports.
    var edgePropMap = {}; // Edge prop map for current status of the nodes it is to be attached to the result map. It includes edge portsource and porttarget.

    // Fill node/edge prop maps for undo/redo actions

    // Node prop map includes a copy of node ports
    for ( var i = 0; i < nodes.length; i++ ) {
      var node = nodes[i];
      var ports = node.data('ports');
      var currentOrdering = sbgnviz.elementUtilities.getPortsOrdering(node); // Get the current node ports ordering
      var portsCopy = ports.length === 2 ? [ { id: ports[0].id, x: ports[0].x, y: ports[0].y }, { id: ports[1].id, x: ports[1].x, y: ports[1].y } ] : [];
      nodePropMap[node.id()] = { ordering: currentOrdering, ports: portsCopy };
    }

    // Node prop map includes edge portsource and porttarget
    for ( var i = 0; i < connectedEdges.length; i++ ) {
      var edge = connectedEdges[i];
      edgePropMap[edge.id()] = { portsource: edge.data('portsource'), porttarget: edge.data('porttarget') };
    }

    var result = {
      nodes: nodes,
      nodePropMap: nodePropMap,
      edgePropMap: edgePropMap
    };

    // If this is the first time call related method from element utilities else go back to the stored props of nodes/edges
    if ( param.firstTime ) {
      elementUtilities.setPortsOrdering(nodes, ordering, portDistance);
    }
    else {
      cy.startBatch();

      // Go back to stored node ports state
      for ( var i = 0; i < nodes.length; i++ ) {
        var node = nodes[i];
        var portsToReturn = param.nodePropMap[node.id()].ports;
        var orderingsToReturn = param.nodePropMap[node.id()].ordering;
        node.data('ports', portsToReturn);
        node.data('portsordering', orderingsToReturn); // Update the cached ports ordering
      }

      // Go back to stored edge portsource/porttargets state
      for ( var i = 0; i < connectedEdges.length; i++ ) {
        var edge = connectedEdges[i];
        var props = param.edgePropMap[edge.id()];
        edge.data('portsource', props.portsource);
        edge.data('porttarget', props.porttarget);
      }

      cy.endBatch();
    }

    return result;
  };

  return undoRedoActionFunctions;
};

var addRemoveUtilities = {
  addNode: function (content, x, y, width, height) {
    cy.add({
      group: "nodes",
      data: {
        width: width,
        height: height,
        sbgnclass: "source and sink"
      },
      position: {
        x: x,
        y: y
      },
      css: {
        content: content
      }
    });
    cy.layout({
      name: 'preset'
    });
  },
  removeNodes: function (nodes) {
    var removedEles = nodes.connectedEdges().remove();
    removedEles = removedEles.union(removeNodes(nodes.children()));
    removedEles = removedEles.union(nodes.remove());
    return removedEles;
  },
  addEdge: function (source, target) {
    cy.add({
      group: "edges",
      data: {
        source: source,
        target: target
      }
    });
    cy.layout({
      name: 'preset'
    });
  },
  removeEdges: function (edges) {
    return edges.remove();
  },
  restoreNodes: function(nodes){
    nodes.restore();
  },
  restoreEdges: function(edges){
    edges.restore();
  }
};
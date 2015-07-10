var addRemoveUtilities = {
  addNode: function (content, x, y, width, height) {
    var eles = cy.add({
      group: "nodes",
      data: {
        width: width,
        height: height,
        sbgnclass: "source and sink",//this will also be a parameter
        sbgnbbox: {
          h: height,
          w: width,
          x: x,
          y: y
        }
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
    return eles[0];
  },
  removeNodes: function (nodes) {
    var removedEles = nodes.connectedEdges().remove();
    var children = nodes.children();
    if(children != null && children.length > 0){
      removedEles = removedEles.union(this.removeNodes(children));
    }
    var parents = nodes.parents();
    removedEles = removedEles.union(nodes.remove());
    cy.nodes().updateCompoundBounds();
    return removedEles;
  },
  addEdge: function (source, target) {
    var eles = cy.add({
      group: "edges",
      data: {
        source: source,
        target: target,
        sbgnclass: "logic arc"//this will be read as parameter
      }
    });
    cy.layout({
      name: 'preset'
    });
    
    return eles[0];
  },
  removeEdges: function (edges) {
    return edges.remove();
  },
  restoreEles: function(eles){
    eles.restore();
    return eles;
  },
  removeEles: function(eles){
    return eles.remove();
  }
};
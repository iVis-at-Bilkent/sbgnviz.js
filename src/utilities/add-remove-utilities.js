var addRemoveUtilities = {
  addNode: function (content, x, y, width, height) {
    var eles = cy.add({
      group: "nodes",
      data: {
        width: width,
        height: height,
        sbgnclass: "terminal", //this will also be a parameter
        sbgnbbox: {
          h: height,
          w: width,
          x: x,
          y: y
        },
        sbgnstatesandinfos: [],
        ports: []
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
    return eles[eles.length - 1];
  },
  removeNodes: function (nodes) {
    var removedEles = nodes.connectedEdges().remove();
    var children = nodes.children();
    if (children != null && children.length > 0) {
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

    return eles[eles.length - 1];
  },
  removeEdges: function (edges) {
    return edges.remove();
  },
  restoreEles: function (eles) {
    eles.restore();
    return eles;
  },
  removeElesSimply: function (eles) {
    return eles.remove();
  },
  removeEles: function (eles) {
    var edges = eles.edges();
    var nodes = eles.nodes();
    var removedEles = this.removeEdges(edges);
    removedEles = removedEles.union(this.removeNodes(nodes));
    return removedEles;
  },
  changeParent: function (nodes, oldParentId, newParentId) {
    var removedNodes = this.removeNodes(nodes);

    for (var i = 0; i < removedNodes.length; i++) {
      var removedNode = removedNodes[i];
      var parentId = removedNode._private.data.parent;

      //Just alter the parent id of the nodesToMakeCompound
      if (parentId != oldParentId) {
        continue;
      }

      removedNode._private.data.parent = newParentId;
    }

    cy.add(removedNodes);
  }
};
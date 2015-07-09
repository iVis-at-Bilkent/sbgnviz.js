var expandCollapseUtilities = {
  //Some nodes are initilized as collapsed this method handles them
  initCollapsedNodes: function () {
    var orphans = cy.nodes().orphans();
    for (var i = 0; i < orphans.length; i++) {
      var root = orphans[i];
      this.collapseBottomUp(root);
    }
  },
  //collapse the nodes in bottom up order 
  collapseBottomUp: function (root) {
    var children = root.children();
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      if (node.is("[sbgnclass!='complex']") && node.is("[sbgnclass!='compartment']")) {
        continue;
      }
      if (node.css('expanded-collapsed') == 'collapsed') {
        this.collapseBottomUp(node);
      }
    }
    if ((root.is("[sbgnclass='complex']") || root.is("[sbgnclass='compartment']"))
            && root.css('expanded-collapsed') == 'collapsed') {
      this.simpleCollapseNode(root);
    }
  },
  expandNode: function (node) {
    if (node._private.data.collapsedChildren != null) {
      this.simpleExpandNode(node);

      var nodesData = {};
      var nodes = cy.nodes();
      for (var i = 0; i < nodes.length; i++) {
        var thenode = nodes[i];
        nodesData[thenode.id()] = {
          width: thenode.width(),
          height: thenode.height(),
          x: thenode.position("x"),
          y: thenode.position("y")
        };
      }

      $("#perform-incremental-layout").trigger("click");

      var param = {
        node: node,
        nodesData: nodesData
      };

      /*
       * return the param to undo the operation,
       * param.node is needed to collapse the node back,
       * param.nodesData is needed to back the incremental 
       * layout before collapsing the node 
       */
      return param;
    }
  },
  /*
   * This method expands the given node
   * without making incremental layout
   * after expand operation it will be simply
   * used to undo the collapse operation
   */
  simpleExpandNode: function (node) {
    if (node._private.data.collapsedChildren != null) {
      node.css('expanded-collapsed', 'expanded');
      node._private.data.collapsedChildren.restore();
      this.repairEdgesOfCollapsedChildren(node);
      node._private.data.collapsedChildren = null;
      node.css("width", node._private.data.oldWidth);
      node.css("height", node._private.data.oldHeight);

      cy.nodes().updateCompoundBounds();
      //return the node to undo the operation
      return node;
    }
  },
  collapseNode: function (node) {
    node.css('expanded-collapsed', 'collapsed');
    var children = node.children();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this.barrowEdgesOfcollapsedChildren(node, child);
    }
    node._private.data.oldWidth = node.css('width');
    node._private.data.oldHeight = node.css('height');
    this.removeChildren(node, node);
    node.css('width', 75);
    node.css('height', 75);
    //return the node to undo the operation
    return node;
  },
  removeChildren: function (node, root) {
    var children = node.children();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this.removeChildren(child, root);
      var removedChild = child.remove();
      if (root._private.data.collapsedChildren == null) {
        root._private.data.collapsedChildren = removedChild;
      }
      else {
        root._private.data.collapsedChildren = root._private.data.collapsedChildren.union(removedChild);
      }
    }
  },
  barrowEdgesOfcollapsedChildren: function (root, childNode) {
    var children = childNode.children();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this.barrowEdgesOfcollapsedChildren(root, child);
    }

    var edges = childNode.connectedEdges();
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var source = edge.data("source");
      var target = edge.data("target");
      var sourceNode = edge.source();
      var targetNode = edge.target();
      var newEdge = jQuery.extend(true, {}, edge.jsons()[0]);
      var removedEdge = edge.remove();
      //store the data of the original edge
      //to restore when the node is expanded
      if (root._private.data.edgesOfcollapsedChildren == null) {
        root._private.data.edgesOfcollapsedChildren = removedEdge;
      }
      else {
        root._private.data.edgesOfcollapsedChildren =
                root._private.data.edgesOfcollapsedChildren.union(removedEdge);
      }

      //Do not handle the inner edges
      if (!this.isOuterNode(sourceNode, root) && !this.isOuterNode(targetNode, root)) {
        continue;
      }

      //If the change source and/or target of the edge in the 
      //case of they are equal to the id of the collapsed child
      if (source == childNode.id()) {
        source = root.id();
      }
      if (target == childNode.id()) {
        target = root.id();
      }

      //prepare the new edge by changing the older source and/or target
      newEdge.data.portsource = source;
      newEdge.data.porttarget = target;
      newEdge.data.source = source;
      newEdge.data.target = target;
      //remove the older edge and add the new one
      cy.add(newEdge);
    }
  },
  repairEdgesOfCollapsedChildren: function (node) {
    var edgesOfcollapsedChildren = node._private.data.edgesOfcollapsedChildren;
    if (edgesOfcollapsedChildren == null) {
      return;
    }
    for (var i = 0; i < edgesOfcollapsedChildren.length; i++) {
      var oldEdge = cy.getElementById(edgesOfcollapsedChildren[i]._private.data.id);
      if (oldEdge != null)
        oldEdge.remove();
    }
    edgesOfcollapsedChildren.restore();
    node._private.data.edgesOfcollapsedChildren = null;
  },
  /*node is an outer node of root 
   if root is not it's anchestor 
   and it is not the root itself*/
  isOuterNode: function (node, root) {
    var temp = node;
    while (temp != null) {
      if (temp == root) {
        return false;
      }
      temp = temp.parent()[0];
    }
    return true;
  },
  getCollapsedChildrenData: function (collapsedChildren, numOfSimples, total) {
    for (var i = 0; i < collapsedChildren; i++) {
      var collapsedChild = collapsedChildren[i];
      if (collapsedChild._private.data.collapsedChildren == null
              || collapsedChild._private.data.collapsedChildren.length == 0) {
        total += Number(collapsedChild._private.data.sbgnbbox.w);
        total += Number(collapsedChild._private.data.sbgnbbox.h);
        numOfSimples++;
      }
      else {
        var result = this.getCollapsedChildrenData(
                collapsedChild._private.data.collapsedChildren,
                numOfSimples,
                total);
        numOfSimples = result.numOfSimples;
        total = result.total;
      }
    }
    return {
      numOfSimples: numOfSimples,
      total: total
    };
  }
};
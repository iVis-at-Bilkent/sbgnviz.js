var expandCollapseUtilities = {
  //This is a map which keeps the information of collapsed meta edges to handle them correctly
  collapsedMetaEdgesInfo: {},
  //Some nodes are initilized as collapsed this method handles them
  initCollapsedNodes: function () {
    var nodesToCollapse = cy.nodes().filter(function (i, ele) {
      if (ele.css()['expanded-collapsed'] != null && ele.css('expanded-collapsed') == 'collapsed') {
        return true;
      }
    });
    this.simpleCollapseGivenNodes(nodesToCollapse);
  },
  //Check if there is node to expand or collapse in given nodes according to the given mode parameter
  thereIsNodeToExpandOrCollapse: function (nodes, mode) {
    var thereIs = false;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (mode == "collapse") {
        if (node.children().length > 0) {
          thereIs = true;
          break;
        }
      }
      else if (mode == "expand") {
        if (node._private.data.collapsedChildren != null) {
          thereIs = true;
          break;
        }
      }
    }

    return thereIs;
  },
  //this method returns the nodes whose parent is not in given nodes
  getRootsOfGivenNodes: function (nodes) {
    var parentMap = {};
    for (var i = 0; i < nodes.length; i++) {
      parentMap[nodes[i].id()] = nodes[i].data("parent");
    }
    var roots = cy.nodes().filter(function (i, ele) {
      if (parentMap[parentMap[ele.id()]] == null) {
        return true;
      }
    });

    return roots;
  },
  simpleCollapseGivenNodes: function (nodes) {
    nodes.data("collapse", true);
    var roots = this.getRootsOfGivenNodes(nodes);
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      this.collapseBottomUp(root);
    }
    return nodes;
  },
  simpleExpandGivenNodes: function (nodes) {
    nodes.data("expand", true);
    var roots = this.getRootsOfGivenNodes(nodes);
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      this.expandTopDown(root);
    }
    return nodes;
  },
  simpleExpandAllNodes: function () {
    var nodes = cy.nodes();
    var orphans = nodes.orphans();
    var expandStack = [];
    for (var i = 0; i < orphans.length; i++) {
      var root = orphans[i];
      this.expandAllTopDown(root, expandStack);
    }
    return expandStack;
  },
  expandAllNodes: function () {
    var expandedStack = this.simpleExpandAllNodes();

    $("#perform-incremental-layout").trigger("click");

    /*
     * return the nodes to undo the operation
     */
    return expandedStack;
  },
  collapseExpandedStack: function (expandedStack) {
    while (expandedStack.length > 0) {
      var node = expandedStack.pop();
      this.simpleCollapseNode(node);
    }
  },
  expandAllTopDown: function (root, expandStack) {
    if (root._private.data.collapsedChildren != null)
    {
      expandStack.push(root);
      this.simpleExpandNode(root);
    }
    var children = root.children();
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      this.expandAllTopDown(node, expandStack);
    }
  },
  //Expand the given nodes perform incremental layout after expandation
  expandGivenNodes: function (nodes) {
    this.simpleExpandGivenNodes(nodes);

    $("#perform-incremental-layout").trigger("click");

    /*
     * return the nodes to undo the operation
     */
    return nodes;
  },
  //collapse the given nodes then make incremental layout
  collapseGivenNodes: function (nodes) {
    this.simpleCollapseGivenNodes(nodes);

    $("#perform-incremental-layout").trigger("click");

    /*
     * return the nodes to undo the operation
     */
    return nodes;
  },
  //collapse the nodes in bottom up order starting from the root
  collapseBottomUp: function (root) {
    var children = root.children();
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      this.collapseBottomUp(node);
    }
    //If the root is a compound node to be collapsed then collapse it
//    if ((root.children().length > 0 || root._private.data.collapsedChildren != null)
//            && root.css()['expanded-collapsed'] != null
//            && root.css('expanded-collapsed') == 'collapsed') 
    if (root.data("collapse") && root.children().length > 0)
    {
      this.simpleCollapseNode(root);
      root.removeData("collapse");
    }
  },
  //expand the nodes in top down order starting from the root 
  expandTopDown: function (root) {
    if (root.data("expand") && root._private.data.collapsedChildren != null)
    {
      this.simpleExpandNode(root);
      root.removeData("expand");
    }
    var children = root.children();
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      this.expandTopDown(node);
    }
  },
  //Expand the given node perform incremental layout after expandation
  expandNode: function (node) {
    if (node._private.data.collapsedChildren != null) {
      this.simpleExpandNode(node);

      $("#perform-incremental-layout").trigger("click");

      /*
       * return the node to undo the operation
       */
      return node;
    }
  },
  /*
   * 
   * This method expands the given node
   * without making incremental layout
   * after expand operation it will be simply
   * used to undo the collapse operation
   */
  simpleExpandNode: function (node) {
    if (node._private.data.collapsedChildren != null) {
      node.removeData("infoLabel");
      node.css('expanded-collapsed', 'expanded');
      node._private.data.collapsedChildren.restore();
      this.repairEdgesOfCollapsedChildren(node);
      node._private.data.collapsedChildren = null;
      node.removeClass('collapsed');

      cy.nodes().updateCompoundBounds();

      //Don't show children info when the complex node is expanded
      if (node._private.data.sbgnclass == "complex") {
        node.removeStyle('content');
      }

      //return the node to undo the operation
      return node;
    }
  },
  //collapse the given node without making incremental layout
  simpleCollapseNode: function (node) {
    if (node._private.data.collapsedChildren == null) {
      node.children().unselect();
      node.children().connectedEdges().unselect();

      node.css('expanded-collapsed', 'collapsed');

      var children = node.children();

      //The children info of complex nodes should be shown when they are collapsed
      if (node._private.data.sbgnclass == "complex") {
        var new_content;
        //The node is being collapsed store infolabel to use it later
        var infoLabel = getInfoLabel(node);
        node._private.data.infoLabel = infoLabel;

        new_content = node._private.data.sbgnlabel;

        if (new_content == null || new_content == "") {
          new_content = infoLabel;
        }
        node.css('content', new_content);
      }

      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        this.barrowEdgesOfcollapsedChildren(node, child);
      }
      this.removeChildren(node, node);
      node.addClass('collapsed');

      //return the node to undo the operation
      return node;
    }
  },
  //collapse the given node then make incremental layout
  collapseNode: function (node) {
    if (node._private.data.collapsedChildren == null) {
      this.simpleCollapseNode(node);

      $("#perform-incremental-layout").trigger("click");

      /*
       * return the node to undo the operation
       */
      return node;
    }
  },
  /*
   * for all children of the node parameter call this method
   * with the same root parameter,
   * remove the child and add the removed child to the collapsedchildren data
   * of the root to restore them in the case of expandation
   * root._private.data.collapsedChildren keeps the nodes to restore when the
   * root is expanded
   */
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
  /*
   * This method let the root parameter to barrow the edges connected to the
   * child node or any node inside child node if the any one the source and target
   * is an outer node of the root node in other word it create meta edges
   */
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

      if (edge.data("meta") && source != target) {
        var otherEnd = null;
        var oldOwner = null;
        if (source == childNode.id()) {
          otherEnd = target;
          oldOwner = source;
        }
        else if (target == childNode.id()) {
          otherEnd = source;
          oldOwner = target;
        }
        var info = {
          createdWhileBeingCollapsed: root.id(),
          otherEnd: otherEnd,
          oldOwner: oldOwner
        };
        if (this.collapsedMetaEdgesInfo[otherEnd] == null) {
          this.collapsedMetaEdgesInfo[otherEnd] = {};
        }
        if (this.collapsedMetaEdgesInfo[root.id()] == null) {
          this.collapsedMetaEdgesInfo[root.id()] = {};
        }
        this.collapsedMetaEdgesInfo[root.id()][otherEnd] = info;
        this.collapsedMetaEdgesInfo[otherEnd][root.id()] = info;
        this.collapsedMetaEdgesInfo[edge.id()] = info;
      }

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
      var newCyEdge = cy.edges()[cy.edges().length - 1];
      newCyEdge.addClass("meta");
      newCyEdge.data("meta", true);
    }
  },
  /*
   * This method repairs the edges of the collapsed children of the given node
   * when the node is being expanded, the meta edges created while the node is 
   * being collapsed are handled in this method
   */
  repairEdgesOfCollapsedChildren: function (node) {
    var edgesOfcollapsedChildren = node._private.data.edgesOfcollapsedChildren;
    if (edgesOfcollapsedChildren == null) {
      return;
    }
    var collapsedMetaEdgeInfoOfNode = this.collapsedMetaEdgesInfo[node.id()];
    for (var i = 0; i < edgesOfcollapsedChildren.length; i++) {
      if (collapsedMetaEdgeInfoOfNode != null &&
              this.collapsedMetaEdgesInfo[edgesOfcollapsedChildren[i]._private.data.id] != null) {
        var info = this.collapsedMetaEdgesInfo[edgesOfcollapsedChildren[i]._private.data.id];
        if (info.createdWhileBeingCollapsed != node.id()) {
          if( edgesOfcollapsedChildren[i]._private.data.source == info.oldOwner){
            edgesOfcollapsedChildren[i]._private.data.source = info.createdWhileBeingCollapsed;
          }
          else if( edgesOfcollapsedChildren[i]._private.data.target == info.oldOwner){
            edgesOfcollapsedChildren[i]._private.data.target = info.createdWhileBeingCollapsed;
          }
          edgesOfcollapsedChildren[i]._private.data.makeMeta = true;
        }
        delete this.collapsedMetaEdgesInfo[info.createdWhileBeingCollapsed][info.otherEnd];
        delete this.collapsedMetaEdgesInfo[info.otherEnd][info.createdWhileBeingCollapsed];
        delete this.collapsedMetaEdgesInfo[edgesOfcollapsedChildren[i]._private.data.id];
      }
      var oldEdge = cy.getElementById(edgesOfcollapsedChildren[i]._private.data.id);
      if (oldEdge != null && oldEdge.length > 0)
        oldEdge.remove();
    }
    edgesOfcollapsedChildren.restore();
    edgesOfcollapsedChildren.removeData("meta");
    edgesOfcollapsedChildren.removeClass("meta");
    
    var newMetaEdges = edgesOfcollapsedChildren.filter(function (i, ele) {
      if (ele.data("makeMeta")) {
        return true;
      }
    });
    
    newMetaEdges.addClass("meta");
    newMetaEdges.data("meta", true);
    newMetaEdges.removeData("makeMeta");
    
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
  /*
   * This method is to handle the collapsed elements while the 
   * dynamic paddings are being calculated
   */
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
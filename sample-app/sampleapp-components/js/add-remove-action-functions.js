var addRemoveActionFunctions = {
  addNode: function (param) {
    var result;
    if (param.firstTime) {
      var newNode = param.newNode;
      result = addRemoveUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
    }
    else {
      result = addRemoveUtilities.restoreEles(param);
    }
    return result;
  },
  removeNodes: function (nodesToBeDeleted) {
    return addRemoveUtilities.removeNodes(nodesToBeDeleted);
  },
  removeEles: function (elesToBeRemoved) {
    return addRemoveUtilities.removeEles(elesToBeRemoved);
  },
  restoreEles: function (eles) {
    return addRemoveUtilities.restoreEles(eles);
  },
  addEdge: function (param) {
    var result;
    if (param.firstTime) {
      var newEdge = param.newEdge;
      result = addRemoveUtilities.addEdge(newEdge.source, newEdge.target, newEdge.sbgnclass);
    }
    else {
      result = addRemoveUtilities.restoreEles(param);
    }
    return result;
  },
  removeEdges: function (edgesToBeDeleted) {
    return addRemoveUtilities.removeEdges(edgesToBeDeleted);
  },
  restoreSelected: function (eles) {
    var param = {};
    param.eles = addRemoveUtilities.restoreEles(eles);
    param.firstTime = false;
    return param;
  },
  changeParent: function (param) {
    //If there is an inner param firstly call the function with it
    //Inner param is created if the change parent operation requires 
    //another change parent operation in it.
    if (param.innerParam) {
      this.changeParent(param.innerParam);
    }

    var node = param.node;
    var oldParentId = node._private.data.parent;
    var oldParent = node.parent()[0];
    var newParent = param.newParent;
    var nodesData = param.nodesData;
    var result = {
      node: node,
      newParent: oldParent
    };

    result.nodesData = getNodesData();

    //If new parent is not null some checks should be performed
    if (newParent) {
      //check if the node was the anchestor of it's new parent 
      var wasAnchestorOfNewParent = false;
      var temp = newParent.parent()[0];
      while (temp != null) {
        if (temp == node) {
          wasAnchestorOfNewParent = true;
          break;
        }
        temp = temp.parent()[0];
      }
      //if so firstly remove the parent from inside of the node
      if (wasAnchestorOfNewParent) {
        var parentOfNewParent = newParent.parent()[0];
        addRemoveUtilities.changeParent(newParent, newParent._private.data.parent, node._private.data.parent);
        oldParentId = node._private.data.parent;
        //We have an internal change parent operation to redo this operation 
        //we need an inner param to call the function with it at the beginning
        result.innerParam = {
          node: newParent,
          newParent: parentOfNewParent,
          nodesData: {
            firstTime: true
          }
        };
      }
    }

    //Change the parent of the node
    addRemoveUtilities.changeParent(node, oldParentId, newParent ? newParent._private.data.id : undefined);

    if (param.posX && param.posY) {
      var positionDiff = {
        x: param.posX - node.position('x'),
        y: param.posY - node.position('y')
      };

      sbgnElementUtilities.moveNodes(positionDiff, node);
    }

    cy.nodes().updateCompoundBounds();

    generalActionFunctions.returnToPositionsAndSizesConditionally(nodesData);

    return result;
  },
  /*
   * This method assumes that param.nodesToMakeCompound contains at least one node
   * and all of the nodes including in it have the same parent
   */
  createCompoundForSelectedNodes: function (param) {
    var nodesToMakeCompound = param.nodesToMakeCompound;
    var oldParentId = nodesToMakeCompound[0].data("parent");
    var newCompound;

    if (param.firstTime) {
      var eles = cy.add({
        group: "nodes",
        data: {
          sbgnclass: param.compundType,
          parent: oldParentId,
          sbgnbbox: {
          },
          sbgnstatesandinfos: [],
          ports: []
        }
      });

      newCompound = eles[eles.length - 1];
      newCompound._private.data.sbgnbbox.h = newCompound.height();
      newCompound._private.data.sbgnbbox.w = newCompound.width();
    }
    else {
      newCompound = param.removedCompund.restore();
    }

    var newCompoundId = newCompound.id();

    addRemoveUtilities.changeParent(nodesToMakeCompound, oldParentId, newCompoundId);

    return newCompound;
  },
  removeCompound: function (compoundToRemove) {
    var compoundId = compoundToRemove.id();
    var newParentId = compoundToRemove.data("parent");
    var childrenOfCompound = compoundToRemove.children();

    addRemoveUtilities.changeParent(childrenOfCompound, compoundId, newParentId);
    var removedCompund = compoundToRemove.remove();

    var param = {
      nodesToMakeCompound: childrenOfCompound,
      removedCompund: removedCompund
    };

    return param;
  },
  deleteSelected: function (param) {
    if (param.firstTime) {
      return sbgnFiltering.deleteSelected();
    }
    return addRemoveUtilities.removeElesSimply(param.eles);
  },
};
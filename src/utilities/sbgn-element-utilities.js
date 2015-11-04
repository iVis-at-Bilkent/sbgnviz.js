var sbgnElementUtilities = {
   //this method returns the nodes non of whose ancestors is not in given nodes
  getRootsOfGivenNodes: function (nodes) {
    var nodesMap = {};
    for (var i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
    }
    var roots = nodes.filter(function (i, ele) {
      var parent = ele.parent()[0];
      while (parent != null) {
        if (nodesMap[parent.id()]) {
          return false;
        }
        parent = parent.parent()[0];
      }
      return true;
    });

    return roots;
  },
  //This method checks if all of the given nodes have the same parent assuming that the size 
  //of  nodes is not 0
  allHaveTheSameParent: function (nodes) {
    if (nodes.length == 0) {
      return true;
    }
    var parent = nodes[0].data("parent");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.data("parent") != parent) {
        return false;
      }
    }
    return true;
  }
};


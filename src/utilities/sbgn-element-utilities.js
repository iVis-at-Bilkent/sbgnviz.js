var sbgnElementUtilities = {
  //this method returns the nodes whose parent is not in given nodes
  getRootsOfGivenNodes: function (nodes) {
    var parentMap = {};
    var nodesMap = {};
    for (var i = 0; i < nodes.length; i++) {
      parentMap[nodes[i].id()] = nodes[i].data("parent");
      nodesMap[nodes[i].id()] = true;
    }
    var roots = nodes.filter(function (i, ele) {
      if (nodesMap[parentMap[ele.id()]] == null) {
        return true;
      }
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


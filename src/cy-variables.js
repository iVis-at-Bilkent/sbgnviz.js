// We need to define new shapes other than the ones existing in Cytoscape.js.
// Therefore, we needed make some cytoscape variables accesable (though it is a big workaround) and using them in our renderer as well.
// Those variables are initilized in 'cyVariables' object.
var cyVariables = {
  cyNodeShapes: {},
  cyMath: {},
  cyStyfn: {},
  cyRenderer: {},
  cyArrowShapes: {}
};
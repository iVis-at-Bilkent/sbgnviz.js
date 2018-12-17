module.exports = function() {

  var jsonToSbgnml, elementUtilities, cy;

  function jsonToNwt(param) {
    jsonToSbgnml = param.jsonToSbgnmlConverter;
    elementUtilities = param.elementUtilities;
    cy = param.sbgnCyInstance.getCy();
  }

  function setToStr(set) {
    if (set) {
      return Object.keys(set).join(';');
    }

    return null;
  }

  var sifEdgePropHandlerMap = {
    'pcIDs': function(edge) {
      return setToStr( edge.data('pcIDSet') );
    },
    'siteLocations': function(edge) {
      return setToStr( edge.data('siteLocSet') );
    }
  };

  function extendArcsData(arcs, filterFcn, propHandlerMap) {
    if ( !arcs ) {
      return;
    }
    
    arcs.forEach( function( arc ) {
      if ( filterFcn( arc.$.class ) ) {
        var edge = cy.getElementById( arc.$.id );
        Object.keys( propHandlerMap ).forEach( function( propName ) {
          var val = propHandlerMap[ propName ]( edge );
          if ( val ) {
            arc[ propName ] = val;
          }
        } );
      }
    } );
  }

  jsonToNwt.buildJsObj = function(filename, version, renderInfo, mapProperties, nodes, edges) {
    var jsObj = jsonToSbgnml.buildJsObj(filename, version, renderInfo, mapProperties, nodes, edges);

    if ( elementUtilities.mapType != 'PD' || elementUtilities.mapType != 'AF' ) {
      var arcs = jsObj.map[0].arc;
      extendArcsData(arcs, elementUtilities.isSIFEdge, sifEdgePropHandlerMap);
    }

    return jsObj;
  };

  jsonToNwt.createNwt = function(filename, version, renderInfo, mapProperties, nodes, edges) {
    var jsObj = jsonToNwt.buildJsObj(filename, version, renderInfo, mapProperties, nodes, edges);
    return jsonToSbgnml.buildString({sbgn: jsObj});
  };

  return jsonToNwt;
}

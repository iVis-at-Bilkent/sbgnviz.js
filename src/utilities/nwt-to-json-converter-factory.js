module.exports = function() {

  var sbgnmlToJson, elementUtilities;

  function nwtToJson(param) {
    sbgnmlToJson = param.sbgnmlToJsonConverter;
    elementUtilities = param.elementUtilities;
  }

  function strToSet( str, splitBy ) {
    var set = {};
    var list = str ? str.split( splitBy ) : [];

    list.forEach( function( member ) {
      set[ member ] = true;
    } );

    return set;
  }

  function getFirstByTagName(arc, tagName) {
    var els = arc.getElementsByTagName(tagName);
    var val = els.length > 0 ? els[0].innerHTML : null;

    return val;
  }

  var sifEdgePropHandlerMap = {
    'pcIDSet': function(arc) {
      var val = getFirstByTagName( arc, 'pcIDs' );
      return strToSet( val, /;| / );
    },
    'siteLocSet': function(arc) {
      var val = getFirstByTagName( arc, 'siteLocations' );
      return strToSet( val, ';' );
    }
  };

  function extendEdgesData( edgesData, filterFcn, propHandlerMap, xmlObject ) {
    edgesData.forEach( function( obj ) {
      var data = obj.data;
      if ( filterFcn( data.class ) ) {
        var arc = sbgnmlToJson.getArcById( xmlObject, data.id );
        Object.keys(propHandlerMap).forEach( function( propName ) {
          var val = propHandlerMap[ propName ](arc);
          if ( val ) {
            data[ propName ] = val;
          }
        } );
      }
    } );
  }

  nwtToJson.convert = function(xmlObject) {
    var graphData = sbgnmlToJson.convert(xmlObject);
    var mapType = elementUtilities.mapType;

    if (mapType !== 'PD' && mapType !== 'AF') {
      elementUtilities.fileFormat = 'nwt';
      extendEdgesData( graphData.edges, elementUtilities.isSIFEdge, sifEdgePropHandlerMap, xmlObject );
    }

    return graphData;
  };

  nwtToJson.mapPropertiesToObj = function() {
    return sbgnmlToJson.mapPropertiesToObj();
  };

  return nwtToJson;
};

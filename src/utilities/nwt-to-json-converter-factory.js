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

  var sifEdgePropHandlerMap = {
    'pcIDSet': function(arc) {
      // TODO: create a function to eliminate code replication here
      var els = arc.getElementsByTagName('pcIDs');
      var val = els.length > 0 ? els[0].innerHTML : null;
      return strToSet( val, /;| / );
    },
    'siteLocSet': function(arc) {
      var els = arc.getElementsByTagName('siteLocations');
      var val = els.length > 0 ? els[0].innerHTML : null;
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
    // TODO: may need to extend this with sif features
    return sbgnmlToJson.mapPropertiesToObj();
  };

  return nwtToJson;
};

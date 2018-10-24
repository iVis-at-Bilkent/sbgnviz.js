var tdParser = require('./tab-delimeted-parser');

function strToSet( str ) {
  var set = {};
  var list = str ? str.split( ';' ) : [];

  list.forEach( function( member ) {
    set[ member ] = true;
  } );

  return set;
}

function getEmptyGraphData() {
  return { nodes: [], edges: [] };
}

module.exports = function() {

  var elementUtilities;

  function sifToJson(param) {
    elementUtilities = param.elementUtilities;
  }

  sifToJson.initGraphVariables = function() {
    sifToJson.graphData = getEmptyGraphData();
    sifToJson.nameToNode = {};
    sifToJson.keyToEdge = {};
  }

  sifToJson.mergeGraphData = function() {
    return [ ...sifToJson.graphData.nodes, ...sifToJson.graphData.edges ];
  };

  sifToJson.convert = function( graphText ) {
    elementUtilities.fileFormat = 'sif';

    sifToJson.initGraphVariables();

    if ( graphText == undefined ) {
      return sifToJson.graphData;
    }

    var lines = tdParser.getLinesArray( graphText.toString() );

    lines.forEach( function( line ) {
      var tabs = tdParser.getTabsArray( line );

      var srcName = tabs[ 0 ];
      var edgeType = tabs[ 1 ];
      var tgtName = tabs[ 2 ];
      var pcIDSet = strToSet( tabs[ 3 ] );
      var siteLocSet = strToSet( tabs[ 4 ] );

      var srcClass = sifToJson.getNodeClass( edgeType, 'src' );
      var tgtClass = sifToJson.getNodeClass( edgeType, 'tgt' );

      // create nodes if they do not exist yet
      sifToJson.getOrCreateNode( srcName, srcClass );
      sifToJson.getOrCreateNode( tgtName, tgtClass );

      // if line contains a non-existing edge create it
      if( srcName && edgeType && tgtName ) {
        sifToJson.getOrCreateEdge( srcName, edgeType, tgtName, pcIDSet, siteLocSet );
      }
    } );

    return sifToJson.mergeGraphData();
  };

  sifToJson.getNodeByName = function( name ) {
    return sifToJson.nameToNode[ name ];
  };

  sifToJson.getEdgeByProps = function( srcName, type, tgtName ) {
    var key = sifToJson.calculateEdgeKey( srcName, type, tgtName );
    return sifToJson.keyToEdge[ key ];
  };

  sifToJson.mapNodeToName = function( node, name ) {
    sifToJson.nameToNode[ name ] = node;
  };

  sifToJson.mapEdgeToKey = function( edge, key ) {
    sifToJson.keyToEdge[ key ] = edge;
  };

  sifToJson.calculateEdgeKey = function( src, type, tgt ) {
    return [ src, type, tgt ].join( ' ' );
  };

  sifToJson.getOrCreateNode = function( name, className ) {
    var node = sifToJson.getNodeByName( name );
    var defaults = elementUtilities.getDefaultProperties( className );

    if ( node == undefined ) {
      var uid = elementUtilities.generateUUID();
      node = {};
      node.data = {
        id: uid,
        label: name,
        class: className,
        bbox: {
          w: defaults.width,
          h: defaults.height,
          x: 0,
          y: 0
        },
        statesandinfos: []
      };

      sifToJson.mapNodeToName( node, name );
      sifToJson.graphData.nodes.push( node );
    }

    return node;
  };

  sifToJson.getOrCreateEdge = function( srcName, type, tgtName, pcIDSet, siteLocSet ) {
    var edge = sifToJson.getEdgeByProps( srcName, type, tgtName );

    if ( edge == undefined ) {
      var uid = elementUtilities.generateUUID();
      var source = sifToJson.getNodeByName( srcName ).data.id;
      var target = sifToJson.getNodeByName( tgtName ).data.id;
      edge = {};
      edge.data = {
        id: uid,
        pcIDSet,
        siteLocSet,
        source,
        target,
        class: type
      };

      var key = sifToJson.calculateEdgeKey( srcName, type, tgtName );
      sifToJson.mapEdgeToKey( edge, key );
      sifToJson.graphData.edges.push( edge );
    }

    return edge;
  };

  sifToJson.getNodeClass = function( edgeType, role ) {
    var type;

    switch (edgeType) {
      case 'controls-production-of':
      case 'controls-transport-of-chemical':
        type = ( role === 'src' ? 'protein' : 'small chemical' );
        break;
      case 'consumption-controled-by':
      case 'chemical-affects':
        type = ( role === 'src' ? 'small chemical' : 'protein' );
        break;
      case 'reacts-with':
      case 'used-to-produce':
        type = 'small molecule';
        break;
      default:
        type = 'protein';
        break;
    }

    return type;
  };

  return sifToJson;
};

var tdParser = require('./tab-delimeted-parser');

function strToSet( str, splitBy ) {
  var set = {};
  var list = str ? str.split( splitBy ) : [];

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

  sifToJson.defaultNodeType = 'protein';

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

      // line represents a node
      if ( tabs.length === 1 ) {
        var nodeName = tabs[ 0 ];
        // create the node if does not exist yet
        // if the node is just created it will have the default node class
        sifToJson.getOrCreateNode( nodeName );
      }
      // line represents an edge and the connected nodes
      else {
        var srcName = tabs[ 0 ];
        var edgeType = tabs[ 1 ];
        var tgtName = tabs[ 2 ];
        var pcIDSet = strToSet( tabs[ 3 ], /;| / );
        var siteLocSet = strToSet( tabs[ 4 ], ';' );

        var srcClass = sifToJson.getNodeClass( edgeType, 'src' );
        var tgtClass = sifToJson.getNodeClass( edgeType, 'tgt' );

        // create nodes if they do not exist yet
        // if the node already exists the node type and so the default values
        // will be updated
        sifToJson.getOrCreateNode( srcName, srcClass );
        sifToJson.getOrCreateNode( tgtName, tgtClass );

        // create the edge if it does not exist yet
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
    className = className || sifToJson.defaultNodeType;
    var node = sifToJson.getNodeByName( name );

    var defaults = elementUtilities.getDefaultProperties( className );

    var updateWithDefaults = function() {
      elementUtilities.extendNodeDataWithClassDefaults( node.data, className );

      node.data.bbox.w = defaults.width;
      node.data.bbox.h = defaults.height;
    };

    if ( node == undefined ) {
      var uid = elementUtilities.generateUUID();
      node = {};

      node.data = {
        id: uid,
        label: name,
        class: className,
        bbox: {
          x: 0,
          y: 0
        },
        statesandinfos: []
      };

      updateWithDefaults();

      sifToJson.mapNodeToName( node, name );
      sifToJson.graphData.nodes.push( node );
    }
    // if node the old node class is the default one and the given class name is
    // different than it then we can assume that the node is created without included
    // in an edge so we should update the node class and defaults according to the
    // new node class
    else if ( node.class !== className && node.class === sifToJson.defaultNodeType ) {
      node.data.class = className;
      updateWithDefaults();
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

      elementUtilities.extendEdgeDataWithClassDefaults( edge.data, type );

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

  sifToJson.mapPropertiesToObj = function() {
    return {
      mapProperties: {
        dynamicLabelSize: 'large',
        adjustNodeLabelFontSizeAutomatically: true
      }
    };
  };

  return sifToJson;
};

var libsbgnjs = require('libsbgn.js');
var parseString = require('xml2js').parseString;
var libUtilities = require('./lib-utilities');
var classes = require('./classes');

module.exports = function() {
	var elementUtilities;

	function tdToJson(param) {
		optionUtilities = param.optionUtilities;
		options = optionUtilities.getOptions();
		elementUtilities = param.elementUtilities;
	}

	tdToJson.map = undefined;

	tdToJson.edgeTypes= { 
		'positive influence': true, 
		'negative influence': true, 
		'unknown influence': true, 
		'necassary influence': true,
		'logic arcs': true, 
		'equivalance arcs': true 
	};

	tdToJson.nodeTypes= {
		'biological activity': 'BA plain',
		'macromolecule': 'BA macromolecule', 
		'complex': 'BA complex', 
		'simple chemical': 'BA simple chemical', 
		'unspecified entity': 'BA unspecified entity', 
		'nucleic acid feature': 'BA nucleic acid feature',
		'perturbing agent':'BA perturbing agent', 
		'phenotype': 'phenotype', 
		'compartment': 'compartment', 
		'submap': 'submap', 
		'tag': 'tag', 
		'and': 'and', 
		'or': 'or', 
		'not': 'not', 
		'delay': 'delay'
	};

	tdToJson.validateNodeType = function( type){
		var _type = type.replace(/_/g, ' ').toLowerCase();
		return this.nodeTypes.hasOwnProperty(_type);
	};

	tdToJson.validateEdgeType = function( type){
		var _type = type.replace(/_/g, ' ').toLowerCase();
		return this.edgeTypes.hasOwnProperty(_type);
	};

	tdToJson.convertTypeToClass = function( ele, type, isNode){
		var _type = type.replace(/_/g, ' ').toLowerCase();
		ele.data.class = isNode ? this.nodeTypes[_type] : _type;
	};

	tdToJson.mapPropertiesToObj = function(){
		return { mapProperties: this.map.mapProperties};
	};

	/**
	 * Adds states and infobox information to given node
	 * @param node : a node object
	 */
	tdToJson.addInfoBox = function(node){
		var _class = node.data.class;
		if (_class.startsWith("BA") && _class != "BA plain"){
			var unitOfInformation = classes.UnitOfInformation.construct();
			unitOfInformation.parent = node.data.id;
			// file format does not contain bbox information, hence define them below
			unitOfInformation.bbox = {x: 25, y: -50, w: 30, h: 12};
			classes.UnitOfInformation.setAnchorSide(unitOfInformation);
			node.data.statesandinfos = [unitOfInformation];
		} else{
			node.data.statesandinfos = [];
		}
	}

	tdToJson.convert = function( graphText){
		elementUtilities.fileFormat = 'td';
		if( graphText === undefined)
		{
			return { nodes: [], edges: []};
		}
		else {
			var map = {};
			var nodes = []; //Holds nodes
			var edges = []; //Holds edges
			this.map = map;

			//Define the line separator
			// \r\n, \n and \r line separators
			var separator = /\r?\n|\r/;
			var lines = graphText.toString().split( separator);
			var graphDataIndex = 4; //graph data starts at index 4
			var edgesStartIndex = -1; //unkown at the begining

			var formatVersion = lines[0];

			if( formatVersion.length < 10 || formatVersion.substring(0,10) != "SBGNViz AF")
			{
				console.log( "Wrong file format!");
				return false;
			}

			if( formatVersion.length == 10){
				formatVersion = formatVersion + " 1.0"; //default 1.0
			}
			var title = lines[1];
			var description = lines[2];
			//Second element of the format version specifies map language
			var mapLanguage = (formatVersion.toString().split(" "))[1]; 
			elementUtilities.mapType = mapLanguage;
			map.mapProperties = {};
			map.mapProperties.mapDescription = description;
			map.mapProperties.mapName = title;
			//start to parse the graph
			for( var i = graphDataIndex; i < lines.length; i++){

				//blank line indicates that nodes are finished
				//so continue with edges
				if( lines[i].length == 0 || lines[i] === ""){
					edgesStartIndex = i + 2;
					break;
				}

				//Parse the node data
				var data = lines[i].toString().split('\t'); //each data seperated by tab
				var nodeName = data[0];
				var nodeId = data[1];
				var nodeType = data[2];
				var parentID = data[3];
				var posX = ( data.length > 4) ? data[4] : "0"; //if posX not given
				var posY = ( data.length > 5) ? data[5] : "0"; //if posY not given

				//add parsed Node
				var newNode = {
					group: 'nodes',
					data:
					{
						id: nodeId,
						label: nodeName,
						ports: [],
						bbox: {
							x: parseFloat( posX),
							y: parseFloat( posY)
						},
					}
				};

				if( this.validateNodeType( nodeType)){
					this.convertTypeToClass( newNode, nodeType, true);
					this.addInfoBox(newNode);
				} else{
					console.log( "Node type mismatched...");
					return false;
				}

				if( parentID != '-1'){
					newNode.data.parent = parentID;
				}

				var defaultWidth = undefined;
				var defaultHeight = undefined;
				
				if( elementUtilities.defaultProperties !== undefined){
					var defaultProperties = elementUtilities.defaultProperties[newNode.data.class];
					defaultWidth = defaultProperties.width;
					defaultHeight = defaultProperties.height;
				}
				
				var nodeWidth = ( data.length > 6) ? data[6] : defaultWidth; //if width not given
				var nodeHeight = ( data.length > 7)? data[7] : defaultHeight; //if height not given

				nodes.push(newNode);

			}

			//Start parsing edges
			for( var i = edgesStartIndex; i < lines.length ; i++){
				//EOF finish loop
				if( lines[i].length === 0){
					break;
				}
				var data = lines[i].toString().split('\t');
				var edgeID = data[0];
				var edgeSource = data[1];
				var edgeTarget = data[2];
				var edgeType = data[3];

				var newEdge = {
					group: 'edges',
					data:
					{
						id: edgeID,
						source: edgeSource,
						target: edgeTarget
					}
				};

				if( this.validateEdgeType( edgeType))
					this.convertTypeToClass( newEdge, edgeType);
				else{
					console.log( "Edge Type mismatched...");
					return false;
				}
				edges.push( newEdge);
			}
			var jsGraph = {};
			jsGraph.nodes = nodes;
			jsGraph.edges = edges;
			return jsGraph;
		}
	};

	return tdToJson;
};

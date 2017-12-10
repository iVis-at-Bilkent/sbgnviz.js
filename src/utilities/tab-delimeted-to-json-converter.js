var elementUtilities = require('./element-utilities-factory');
var classes = require('./classes');
var tdToJson = {
	map: undefined,
	edgeTypes: [ 'positive influence', 'negative influence', 'unknown influence', 'necassary influence',
			'logic arcs', 'equivalance arcs'],
	nodeTypes: [ 'biological activity', 'macromolecule', 'complex', 'simple chemical', 'unspecified entity', 'nucleic acid feature',
			'perturbing agent', 'phenotype', 'compartment' , 'submap', 'tag' , 'and', 'or', 'not', 'delay'],
validateNodeType: function( type){
	var _type = type.replace('_', ' ').toLowerCase();
	if( this.nodeTypes.indexOf(_type) > -1)
 		return true;
	return false;
},
validateEdgeType: function( type){
	var _type = type.replace('_', ' ').toLowerCase();
	if( this.edgeTypes.indexOf(_type > -1))
		return true;
	return false;
},
convertTypeToClass: function( ele, type){
	ele.data.class =  type.replace('_', ' ').toLowerCase();
},
mapPropertiesToObj: function(){
	if( this.map.mapProperties){
		var obj = {};
		obj.mapProperties = this.map.mapProperties;
		return obj;
	}
}
,
convert: function( graphText){
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
		map.language = "AF";
		elementUtilities.mapType = "AF";
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
			var nodeWidth = ( data.length > 6) ? data[6] : undefined; //if width not given
			var nodeHeight = ( data.length > 7)? data[7] : undefined; //if height not given


			//add parsed Node
			var newNode = {
				group: 'nodes',
				data:
				{
					id: nodeId,
					label: nodeName,
					statesandinfos: [],
					bbox: {
						x: parseFloat( posX),
						y: parseFloat( posY),
						w: nodeWidth,
						h: nodeHeight
					},
				}
			};

			if( this.validateNodeType( nodeType))
				this.convertTypeToClass( newNode, nodeType);
			else{
				console.log( "Node type mismatched...");
				return false;
			}
			if( parentID != '-1'){
				newNode.data.parent = parentID;
			}

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
}
};

module.exports = tdToJson;
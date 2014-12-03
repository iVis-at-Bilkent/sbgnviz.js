function RandomGraphCreator(options)
{
	var _defaultOpts =
	{
		noOfNodes: 50,
		noOfEdges: 10,
		maxDepth: 3,
		noOfSiblings: 5,
		minNodeSize: {
			width: 15,
			height: 15
		},
		maxNodeSize: {
			width: 50,
			height: 50
		},
		percentageOfIGEs: 30,
		probabilityOfBranchPruning: 0.5,
		canvasSize: {
			width: 640,
			height: 480
		},
		// TODO these options for non-compound nodes...
		removeDisconnectedNodes: true,
		minNumberOfChildren: 5,
		maxNumberOfChildren: 10
	};

	// merge options with default options to use defaults for missing values
	var _options = jQuery.extend(true, {}, _defaultOpts, options);

	/**
	 * Intermediate data used for construction
	 */
	var _noOfCreatedNodes = 0;
	var _noOfCreatedEdges = 0;
	var _noOfGraphs = 0;
	var _adjacencyMatrix = {};
	var _graphs = [];
	var _nodes = [];
	var _interGraphEdges = [];
	var _edges = [];
	var _rootModel;

	var _nodeIdMap = {};
	var _targetConnections = {};
	var _sourceConnections = {};

	function run()
	{
		_rootModel = {nodes: [], edges: []};

		_graphs.push(_rootModel);
		_noOfGraphs++;

		if (_options.maxDepth > 0)
		{
			growRoot();
			createEdges();
		}
//		else // TODO no compounds!
//		{
//			if (this.graphType == FlatGraphType.MESH)
//			{
//				this.generateMesh();
//			}
//			else if (this.graphType == FlatGraphType.TREE)
//			{
//				this.generateTree();
//			}
//			else
//			{
//				this.createNonCompoundRandomGraph();
//			}
//		}

		var graph = {
			nodes: _nodes,
			edges: _edges
		};

		return graph;
	}

	function growRoot()
	{
		growBranch(_rootModel, 1);

		// TODO do we really need this?
		//fillTree();
	}

	function growBranch(currentGraph, depth)
	{
		// Here we create a level of inclusion tree

		// Since we don't have a mechanism to convert a simple node to a
		// compound node, we directly create compound nodes. However, while
		// creating compounds, if max number of nodes are reached, they will
		// be empty. Therefore, we detect this condition before creating
		// compounds.
		if (_options.noOfSiblings >= (_options.noOfNodes - _nodes.length))
		{
			return;
		}

		for (var i = 0; i < _options.noOfSiblings; i++)
		{
			if (_options.probabilityOfBranchPruning < nextDouble())
			{
				if (_nodes.length < _options.noOfNodes)
				{
					addNode(currentGraph, true);
				}
				else
				{
					// this condition should not be reached.
					return;
				}
			}
		}

		_.each(currentGraph['nodes'], function (childGraph, idx) {
			// CompoundModel childGraph = (CompoundModel) iterator.next();
			_graphs.push(childGraph);
			_noOfGraphs++;

			if (depth < _options.maxDepth)
			{
				// recursion...
				growBranch(childGraph, depth + 1);
			}
		});
	}

	function nextDouble()
	{
		return Math.random();
	}

	function nextInt(value)
	{
		return Math.floor(Math.random() * value);
	}

	function addNode(parentCompound, isCompound)
	{
		var node = {
			data: {
				sbgnbbox: {},
				random: {}
			}
		};

//		if (isCompound)
//		{
//			node = new CompoundModel();
//		}
//		else
//		{
//			node = new NodeModel();
//		}

		_nodes.push(node);
		_noOfCreatedNodes++;

		var width = nextInt(
			_options.maxNodeSize.width - _options.minNodeSize.width + 1) ;
		var height = nextInt(
			_options.maxNodeSize.height - _options.minNodeSize.height + 1);

		width += _options.minNodeSize.width;
		height += _options.minNodeSize.height;

		node.data.sbgnbbox.w = width;
		node.data.sbgnbbox.h = height;
		node.data.random.label = _noOfCreatedNodes;
		node.data.id = "n" + _noOfCreatedNodes;
		node.data.sbgnclass = "random";

		// Randomly distribute nodes on the canvas by looking at the current
		// size of the canvas window (minus some buffer for the scrollbars)
		node.data.sbgnbbox.x = nextInt(_options.canvasSize.width - _options.maxNodeSize.width - 25);
		node.data.sbgnbbox.y = nextInt(_options.canvasSize.height - _options.maxNodeSize.height - 25);

		if (parentCompound.data &&
		    parentCompound.data.id)
		{
			node.data.parent = parentCompound.data.id;
		}

		// this is to ensure compound node's to have auto size...
		if (parentCompound.data &&
		    parentCompound.data.sbgnbbox)
		{
			parentCompound.data.sbgnbbox.w = "auto";
			parentCompound.data.sbgnbbox.h = "auto";
		}

		// Calculate text size according to digits in the label

//		int nodeCount = this.noOfCreatedNodes;
//		int noOfDigits = 0;
//
//		while (nodeCount > 0)
//		{
//			nodeCount /= 10;
//			noOfDigits++;
//		}
//
//		if (noOfDigits == 1)
//		{
//			noOfDigits++;
//		}
//
//		int textSize = width/noOfDigits;
//
//		node.setTextFont(new Font(null, "Arial", textSize, 0));
//
//		Color color = this.getColorAtDepth(node);
//		node.setBorderColor(color);
//
//		if (!isCompound)
//		{
//			node.setColor(color);
//		}

//		CreateCommand cmd = new CreateCommand(parentCompound, node);
//		cmd.execute();

		if (parentCompound['nodes'] == null)
		{
			parentCompound['nodes'] = [];
		}

		parentCompound['nodes'].push(node);

		_nodeIdMap[node.data.id] = node;

		return node;
	}

	function createEdges()
	{
		var noOfIGEs = Math.floor(_options.noOfEdges * (_options.percentageOfIGEs / 100));

		var createdIGEs = 0;
		var trial = 0;

		while (createdIGEs < noOfIGEs)
		{
			var ige = createRandomIGE();
			trial++;

			if (trial > 1000)
			{
				break;
			}

			if (ige != null)
			{
				_interGraphEdges.push(ige);
				createdIGEs++;
			}
		}

		_noOfCreatedEdges = createdIGEs;

		createRandomEdges();
	}

	function createRandomEdges()
	{
		var graphArray = _graphs;
		var trial = 0;
		var success;

		while (_noOfCreatedEdges < _options.noOfEdges)
		{
			trial++;

			if (trial > _options.noOfEdges)
			{
				break;
			}

			success = false;

			for (var index = 0; index < graphArray.length; index++)
			{
				var graph = graphArray[index];

				if (graph.nodes == null ||
				    graph.nodes.length < 2)
				{
					continue;
				}

				var tmp = false;

				if (_noOfCreatedEdges < _options.noOfEdges)
				{
					tmp = createRandomEdge(graph);
				}

				success = success || tmp;
			}

			if (!success)
			{
				return;
			}
		}
	}

	function createRandomEdge(compound)
	{
		var nodes = compound.nodes;
		//HashSet<Integer> indexPot = new HashSet<Integer>();
		var indexPot = [];

		// create indexPot
		for (var i = 0; i < nodes.length; i++)
		{
			indexPot.push(i);
		}

		while (indexPot.length > 0)
		{
			// randomly choose indexes of source and target nodes
			var firstNodeIndex = nextInt(nodes.length);
			var secondNodeIndex = -1;

			do {
				secondNodeIndex = nextInt(nodes.length);
			} while (firstNodeIndex == secondNodeIndex);

			// remove selected indexes
			indexPot.splice(firstNodeIndex, 1);
			indexPot.splice(secondNodeIndex, 1);

			var firstNode = nodes[firstNodeIndex];
			var secondNode = nodes[secondNodeIndex];

			if (!edgeExists(_nodes.indexOf(firstNode),
			                     _nodes.indexOf(secondNode)))
			{
				createEdge(firstNode, secondNode);
				return true;
			}
		}

		return false;
	}

	// TODO this should be fixed
	function createRandomIGE()
	{
		var success = false;
		var edge = null;
		var trials = 0;

		while (!success)
		{
			trials++;

			if (trials > _noOfGraphs * _noOfGraphs)
			{
				break;
			}

			success = true;

			//var firstNodeID = nextInt(_options.noOfNodes);
			//var secondNodeID = nextInt(_options.noOfNodes);
			var firstNodeID = nextInt(_nodes.length);
			var secondNodeID = nextInt(_nodes.length);

			var firstNode = _nodes[firstNodeID];
			var secondNode = _nodes[secondNodeID];

			if (firstNode.data.parent == null ||
			    secondNode.data.parent == null)
			{
				success = false;
				break;
			}
			// still, one might be an ancestor of the other (not desired)!
			else if (isOneAncestorOfOther(firstNode, secondNode))
			{
				success = false;
				break;
			}

			if (firstNode.data.parent == secondNode.data.parent)
			{
				success = false;
				break;
			}

			var targetConnections = getTargetConnections(firstNode);

			for (var i=0; i < targetConnections.length; i++)
			{
				var edge = targetConnections[i];
				var sourceId = edge.data.source;

				if (sourceId == secondNode.data.id)
				{
					success = false;
					break;
				}
			}

			if (success == false)
			{
				break;
			}

			var sourceConnections = getSourceConnections(firstNode);

			for (var i=0; i < sourceConnections.length; i++)
			{
				var edge = sourceConnections[i];
				var targetId = edge.data.target;

				if (targetId == secondNode.data.id)
				{
					success = false;
					break;
				}
			}

			if (success == false)
			{
				break;
			}

			edge = createEdge(firstNode, secondNode);
		}

		return edge;
	}

	function getTargetConnections(node)
	{
		var connections = [];

		if (node && node.data)
		{
			connections = _targetConnections[node.data.id];
		}

		return connections || [];
	}

	function getSourceConnections(node)
	{
		var connections = [];

		if (node && node.data)
		{
			connections = _sourceConnections[node.data.id];
		}

		return connections || [];
	}

	/**
	 * Creates an edge with given source and target nodes. All checkings are
	 * assumed to be done before call.
	 */
	function createEdge(src, trgt)
	{
		//assert src != null && trgt != null;
		//assert src != trgt;

		var edge = {
			data: {
				source: src.data.id,
				target: trgt.data.id
			}
		};

//		CreateConnectionCommand command = new CreateConnectionCommand();
//		command.setSource(src);
//		command.setTarget(trgt);
//		command.setConnection(edge);
//		command.execute();

		_edges.push(edge);
		_noOfCreatedEdges++;

		var srcIndex = _.indexOf(_nodes, src);
		var trgtIndex = _.indexOf(_nodes, trgt);

		if (_adjacencyMatrix[srcIndex] == null)
		{
			_adjacencyMatrix[srcIndex] = {};
		}

		_adjacencyMatrix[srcIndex][trgtIndex] = 1;

		if (_adjacencyMatrix[trgtIndex] == null)
		{
			_adjacencyMatrix[trgtIndex] = {};
		}

		_adjacencyMatrix[trgtIndex][srcIndex] = 1;
//
//		if (this.maxDepth == 0)
//		{
//			if ( src.hasCommonCluster(src) )
//			{
//				edge.setColor(ColorConstants.lightGray);
//			}
//		}
//		else
//		{
//			if (edge.isIntragraph())
//			{
//				edge.setColor(ColorConstants.lightGray);
//			}
//		}

		// update connections...
		if (_targetConnections[edge.data.target] == null)
		{
			_targetConnections[edge.data.target] = [];
		}

		if (_sourceConnections[edge.data.source] == null)
		{
			_sourceConnections[edge.data.source] = [];
		}

		_targetConnections[edge.data.target].push(edge);
		_sourceConnections[edge.data.source].push(edge);

		return edge;
	}

	/**
	 * Determines whether an edge is created before for the given node indices.
	 */
	function edgeExists(srcIndex, trgIndex)
	{
		var result = false;

		if ((_adjacencyMatrix[srcIndex] && _adjacencyMatrix[srcIndex][trgIndex] == 1) ||
		    (_adjacencyMatrix[trgIndex] && _adjacencyMatrix[trgIndex][srcIndex]) == 1 )
		{
			result = true;
		}

		return result;
	}

	/**
	 * This method checks whether one of the input nodes is an ancestor of the
	 * other one (and vice versa) in the nesting tree. Such pairs of nodes
	 * should not be allowed to be joined by edges.
	 */
	function isOneAncestorOfOther(firstNode, secondNode)
	{
		//assert firstNode != null && secondNode != null;

		if (firstNode == secondNode)
		{
			return true;
		}

		// Is second node an ancestor of the first one?

		var parentNode = _nodeIdMap[firstNode.data.parent];

		do
		{
			if (parentNode == null)
			{
				break;
			}

			if (parentNode.data.id == secondNode.data.id)
			{
				return true;
			}

			parentNode = _nodeIdMap[parentNode.data.parent];
		} while (true);

		// Is first node an ancestor of the second one?

		parentNode = _nodeIdMap[secondNode.data.parent];

		do
		{
			if (parentNode == null)
			{
				break;
			}

			if (parentNode.data.id == firstNode.data.id)
			{
				return true;
			}

			parentNode = _nodeIdMap[parentNode.data.parent];
		} while (true);

		return false;
	}

	this.generateGraph = run;
}


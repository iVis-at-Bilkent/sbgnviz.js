# SBGNViz

SBGNViz is a web based library developed to visualize pathway models represented by process description (PD) and activity flow (AF) languages of [SBGN](http://sbgn.org) or in [simple interaction format (SIF)](https://www.pathwaycommons.org/pc/sif_interaction_rules.do).
It accepts the pathway models represented in [SBGN-ML](https://github.com/sbgn/sbgn/wiki/LibSBGN) format as well as import facilities from various formats from SIF to SBML to CellDesigner.

## Software

SBGNViz is distributed under [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html). 

**A sample application using SBGNViz** can be found [here](http://cs.bilkent.edu.tr/~ivis/SBGNViz_sample_app/). The sample application source codes are available [here](https://github.com/iVis-at-Bilkent/sbgnviz.js-sample-app).

Please cite the following when you use SBGNViz.js:

M. Sari, I. Bahceci, U. Dogrusoz, S.O. Sumer, B.A. Aksoy, O. Babur, E. Demir, "[SBGNViz: a tool for visualization and complexity management of SBGN process description maps](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0128985)", PLoS ONE, 10(6), e0128985, 2015.

## Default Options
```javascript
    var options = {
      // The path of core library images when sbgnviz is required from npm and the index html 
      // file and node_modules are under the same folder then using the default value is fine
      imgPath: 'node_modules/sbgnviz/src/img',
      // Whether to fit labels to nodes
      fitLabelsToNodes: function () {
        return false;
      },
      // Whether to fit labels to a node's info boxes
      fitLabelsToInfoboxes: function () {
        return false;
      },
      // dynamic label size it may be 'small', 'regular', 'large'
      dynamicLabelSize: function () {
        return 'regular';
      },
      // Whether to infer parent node on load 
      inferNestingOnLoad: function () {
        return false;
      },
      // percentage used to calculate compound paddings
      compoundPadding: function () {
        return 10;
      },
      improveFlow: function () {
        return true;
    },
    // Whether to adjust node label font size automatically.
    // If this option return false do not adjust label sizes according to node height uses node.data('font-size')
    // instead of doing it.
    adjustNodeLabelFontSizeAutomatically: function() {
      return true;
    },
    // extra padding for compartment and complexes
    extraCompartmentPadding: 10,
    extraComplexPadding: 10,
    // Wether to display the complex's labels, like compartments.
    // Will also increase the paddings by extraCompoundPadding to make room for the name.
    showComplexName: false,
    // The selector of the component containing the sbgn network
    networkContainerSelector: '#sbgn-network-container',
    // Whether the actions are undoable, requires cytoscape-undo-redo extension
    undoable: true
    };
```

## SBGNViz Specific Data
```javascript
// Nodes specific data.
node.data('id'); // Id of a node. (Specific to cytoscape.js)
node.data('label'); // Label of a node.
node.data('parent'); // Parent id of a node. (Specific to cytoscape.js)
// SBGN specific class of a node. If it ends with 'multimer' it means that this node is a multimer.
node.data('class');
node.data('clonemarker'); // Whether the node is cloned.
node.data('bbox'); // Bounding box of a node includes bbox.x, bbox.y, bbox.w, bbox.h
// Ports list of a node. A node port includes port.id, port.x, port.y where port.x and port.y are
// percentages relative to node position and size.
node.data('ports');
node.data('statesandinfos'); // a list of UnitOfInformation and StateVariable objects
// an object containing 0 to 4 keys (top, bottom, left, right) pointing to AuxUnitLayout objects
node.data('auxunitlayouts');

// Edges specific data.
edge.data('id'); // Id of an edge. (Specific to cytoscape.js)
edge.data('source'); // Id of source node. (Specific to cytoscape.js)
edge.data('target'); // Id of target node. (Specific to cytoscape.js)
edge.data('class'); // SBGN specific class of an edge.
edge.data('cardinality'); // SBGN cardinality of an edge.
// The following is set if the edge is connected to its source node by a specific port of that node.
edge.data('portsource');
// The following is set if the edge is connected to its target node by a specific port of that node.
edge.data('porttarget');
// Bend point positions of an edge. Includes x and y coordinates. This data is to be passed to
// edgeBendEditing extension.
edge.data('bendPointPositions');
```

## API

`sbgnviz.register(options)`
Register with libraries before creating instances

`sbgnviz.validMapProperties`
A lookup object for valid map properties.

`var instance = sbgnviz(options)`
Creates an extension instance with the given options

`instance.getCy()`
Get the Cytoscape.js instance created for this Sbgnviz.js instance.

`instance.expandNodes(nodes)`
Expand given nodes. Requires expandCollapse extension and considers undoable option.

`instance.collapseNodes(nodes)`
Collapse given nodes. Requires expandCollapse extension and considers undoable option.

`instance.expandComplexes()`
Expands the complex nodes in the graph recursively. Requires expandCollapse extension and considers undoable option.

`instance.collapseComplexes()`
Collapses the complex nodes in the graph recursively. Requires expandCollapse extension and considers undoable option.

`instance.collapseAll()`
Collapses all nodes in the graph recursively. Requires expandCollapse extension and considers undoable option.

`instance.collapseMarkedNodes()`
Collapse the nodes whose collapse data field is set

`instance.expandAll()`
Expands all nodes in the graph recursively. Requires expandCollapse extension and considers undoable option.

`instance.hideNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact and hides the resulting list. Requires viewUtilities extension and considers 'undoable' option.

`instance.showNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact. Then unhides the resulting list and hides others. Requires viewUtilities extension and considers 'undoable' option.

`instance.showEles(eles)`
Unhides elements passed as arguments. Requires viewUtilities extension and considers 'undoable' option.

`instance.showAll()`
Unhides all elements. Requires viewUtilities extension and considers 'undoable' option.

`instance.deleteElesSimple(eles)`
Removes the given elements in a simple way. Considers 'undoable' option.

`instance.deleteNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact and removes the resulting list. Considers 'undoable' option.

`instance.highlightSelected(eles)`
Highlights selected elements. Requires viewUtilities extension and considers 'undoable' option.

`instance.highlightNeighbours(nodes)`
Highlights neighbours of the given nodes. Requires viewUtilities extension and considers 'undoable' option.

`instance.highlightProcesses(nodes)`
Highlights processes of the given nodes. Requires viewUtilities extension and considers 'undoable' option.

`instance.searchByLabel(label)`
Finds the elements whose label includes the given label and highlights processes of those elements.
Requires viewUtilities extension and considers 'undoable' option.

`instance.removeHighlights()`
Unhighlights any highlighted element. Requires viewUtilities extension and considers 'undoable' option.

`instance.performLayout(layoutOptions, notUndoable)`
Performs layout by given layoutOptions. Considers 'undoable' option. However, by setting notUndoable parameter
to a truthy value you can force an undable layout operation independant of 'undoable' option.

`instance.createSbgnml()`
Creates an sbgnml file content from the exising graph and returns it.

`instance.convertSbgnmlToJson(data)`
Converts given sbgnml data to a json object in a special format (http://js.cytoscape.org/#notation/elements-json) and returns it.

`instance.doValidation(data)`
Validates given sbgnml data and returns errors if they exist.

`instance.getQtipContent(node)`
Create the qtip contents of the given node and returns it.

`instance.updateGraph(cyGraph)`
Update the graph by given cyGraph parameter which is a json object including data of cytoscape elements
in a special format (http://js.cytoscape.org/#notation/elements-json).

`instance.calculatePaddings(paddingPercent)`
Calculates the paddings for compounds based on dimensions of simple nodes and a specific percentadge.
As this percentadge takes the given paddingPercent or compoundPadding option.

`instance.recalculatePaddings()`
Recalculates/refreshes the compound paddings. Aliases `instance.refreshPaddings()`.

`instance.saveAsPng(filename)`
Exports the current graph to a png file. The name of the file is determined by the filename parameter which is
'network.png' by default.

`instance.saveAsJpg(filename)`
Exports the current graph to a jpg file. The name of the file is determined by the filename parameter which is
'network.jpg' by default.

`instance.saveAsSVG(filename)`
Exports the current graph to a svg file. The name of the file is determined by the filename parameter which is
'network.svg' by default.

`instance.loadFile(file, convertFcn, callback1, callback2, callback3, callback4)`


`instance.loadSample(filename, folderpath)`
Loads a sample file whose name and path of containing folder is given.

`instance.loadSBGNMLFile(file[, callback])`
Loads the given sbgnml file. Optionally apply a callback function upon loading. Callback accepts the file as an xml string as argument.

`instance.loadSBGNMLText(textData)`
Loads a graph from the given text data in sbgnml format.

`instance.saveAsSbgnml(filename[, version])`
Exports the current graph to an sbgnml file with the given filename. A SBGN-ML version can be provided, either 0.2 or 0.3. No version defaults to 0.3.

`instance.saveAsNwt(filename[, version])`
Exports the current graph to an nwt file with the given filename. A version can be provided, either 0.2 or 0.3. No version defaults to 0.3.

`instance.saveAsPlainSif(filename)`
Exports the current graph to a plain SIF file with the given filename.

`instance.loadSIFFile(file, layoutBy, callback)`
Loads the given SIF file. Optional layoutBy parameter would either be a function that runs a layout or layout options data. Also, optionally apply a callback function upon loading.

`instance.loadNwtFile(file[, callback])`
Loads the given nwt file. Optionally apply a callback function upon loading. Callback accepts the file as an xml string as argument.

`instance.loadTDFile(file[, callback])`


`instance.getMapProperties()`
Get map properties from SBGNML file. Needs to be called after file is loaded - sbgnvizLoadFileEnd event. Return: map properties as object

`instance.exportLayoutData(filename, byName)`


`instance.convertSbgnmlTextToJson(sbgnmlText)`


`instance.convertSifTextToJson(sifText)`


`instance.createJsonFromSBGN()`


`instance.createJsonFromSif()`


`instance.considerCompoundSizes()`


`instance.omitCompoundSizes()`


`instance.areCompoundSizesConsidered()`


`instance.getCompoundPaddings()`
Return calculated paddings. In case of that data is invalid returns 5


`instance.createJsonFromSif()`


`instance.createJsonFromSif()`

`instance.enablePorts()`
Enable node ports.

`instance.disablePorts()`
Disable node ports.

`instance.arePortsEnabled()`
Get if node ports are enabled.

`instance.setPortsOrdering(nodes, ordering, portDistance)`
Sets the ordering of the given nodes. Ordering options are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
If a node does not have any port before the operation and it is supposed to have some after operation the portDistance parameter is used to set the distance between the node center and the ports. The default port distance is 70.
Considers undoable option.

`instance.loadLayoutData(layoutText, byName)`
Load layout data from the text. Each line of layout text represent position of a node.
It consists of an identifier, x position and y position seperated by tabs. If 'byName'
parameter is set it means that the first column represents the node label, else it represents
the node id.

`instance.getLayoutText(byName)`
Returns a text that represents the layout data of the graph. Text content and usage of
'byName' parameter is the same as described in ``instance.loadLayoutData()`` section.

`instance.createNwt()`
Creates an nwt file content from the existing graph and returns it.

`instance.convertNwtToJson()`
Converts given nwt data to a json object in a special format (http://js.cytoscape.org/#notation/elements-json) and returns it.

`instance.startSpinner(classname)`
Starts a spinner at the middle of network container element. You can specify a css class that the
spinner will have. The default classname is 'default-class'. Requires 'fontawesome.css'.

`instance.endSpinner(classname)`
Ends any spinner having a css class with the given name. Requires 'fontawesome.css'.

`instance.elementUtilities`
General and sbgn specific utilities for cytoscape elements. These are exposed for the users who builds an extension
library of sbgnviz. Most users will not need to use this. It includes the followings:

* `getDefaultProperties(sbgnclass)` Access the default properties for elements of given sbgnclass. If sbgnclass parameter is not defined it returns the whole map where the default properties are mapped to sbgnclasses. These properties are considered upon element creation. The special fields are the followings.<br>
   'width': The default width<br>
   'height': The default height<br>
   'font-size': The default font size<br>
   'font-family': The default font family<br>
   'font-style': The default font style<br>
   'font-weight': The default font weight<br>
   'background-color': The default background color<br>
   'background-opacity': The default background opacity<br>
   'border-width': The default border width<br>
   'border-color': The default border color
* `setDefaultProperties(sbgnclass, props)` Updates the default properties map of given sbgnclass by the given properties.
* `getTopMostNodes(nodes)` This method returns the nodes non of whose ancestors is not in given nodes.
* `allHaveTheSameParent(nodes)` This method checks if all of the given nodes have the same parent assuming that the size of  nodes is not 0.
* `isValidParent(nodeClass, parentClass, node)` Returns if the elements with the given parent class can be parent of the elements with the given node class.
* `getCommonProperty(elements, propertyName, dataOrCss)`  Get common properties of given elements. Returns null if the given element list is empty or the property is not common for all elements. dataOrCss parameter specify whether to check the property on      data or css. The default value for it is data. If propertyName parameter is given as a function instead of a string representing the property name then use what that function returns.
* `trueForAllElements(elements, fcn)` Returns if the function returns a truthy value for all of the given elements.
* `canHaveSBGNCardinality(ele)` Returns whether the given element or elements with the given class can have sbgncardinality.
* `canHaveSBGNLabel(ele)` Returns whether the given element or elements with the given class can have sbgnlabel.
* `isBiologicalActivity(ele)` Returns whether the given elements class is a subtype of biological activity. Parameter would correspond to the class itself as well.
* `canHaveUnitOfInformation(ele)` Returns whether the given element or elements with the given class have unit of information.
* `canHaveStateVariable(ele)` Returns whether the given element or elements with the given class have state variable.
* `mustBeSquare(ele)` Returns whether the given element or elements with the given class should have the same width and height.
* `someMustNotBeSquare(ele)` Returns whether the given element or elements with the given class must not be in square shape.
* `canBeCloned(ele)` Returns whether the given element or elements with the given class can be cloned.
* `canBeMultimer(ele)` Returns whether the given element or elements with the given class can be multimer.
* `isEPNClass(ele)` Returns whether the given class is an EPN class or the given element is an EPN.
* `isPNClass(ele)` Returns whether the given class is an PN class or the given element is an PN.
* `isLogicalOperator(ele)` Returns whether the given class is a logical operator class or the given element is a logical operator.
* `isSIFNode(node)` Returns whether the given node is a SIF node, it may take class name as a parameter instead of the node.
* `isSIFEdge(edge)` Returns whether the given edge is a SIF edge, it may take class name as a parameter instead of edge.
* `isUndirectedEdge(edge)` Returns whether the given edge is undirected, it may take class name as a parameter instead of edge.
* `isDirectedEdge(edge)` Returns whether the given edge is directed, it may take class name as a parameter instead of edge.
* `convenientToEquivalence(ele)` Returns whether the given class or the class of the given element is an equivalance class.
* `moveNodes(positionDiff, nodes, notCalcTopMostNodes)` This method moves given nodes by the given position difference. ????
* `convertToModelPosition(renderedPosition)` This method calculates the modal position of the given rendered position by considering current the pan and zoom level of the graph.
* `getProcessesOfSelected()` Returns the processes of the selected nodes.
* `getNeighboursOfSelected()` Returns the neighbours of the selected nodes.
* `getNeighboursOfNodes(nodes)` Returns the neighbours of the given nodes.
* `getProcessesOfNodes(nodes)` Extends the given nodes list in a smart way to leave the map intact and returns the resulting list. Aliases `extendNodeList`.
* `noneIsNotHighlighted()` Returns true if there is no element having 'unhighlighted' class.
* `deleteNodesSmart(nodes)` Extends the given nodes list in a smart way to leave the map intact and removes the resulting list.
* `deleteElesSimple(eles)` Removes the given elements in a simple way.
* `restoreEles(eles)` Restores the given elements.
* `getPortsOrdering()` Return ordering of ports of a node. Possible return values are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
* `canHavePorts(ele)` Returns whether the given element or elements with the given class can have ports
* `setPortsOrdering(nodes, ordering, portDistance)` Similar to `instance.setPortsOrdering()` but do not considers undoable option.
* `generateNodeId()` Generates a unique node id. 
* `generateUUID()` Generates a unique node id. 
* `generateEdgeId()` Generates a unique edge id.
* `generateStateVarId()` Generates a unique state variable id.
* `generateUnitOfInfoId()` Generates a unique unit of information id.
* `getStateVarShapeOptions(ele)` Returns the possible state variable shape options for the given node. Class name of node can also be given instead of the node parameter.
* `getUnitOfInfoShapeOptions(ele)` Returns the possible unit of information shape options for the given node. Class name of node can also be given instead of the node parameter.
* `extendNodeDataWithClassDefaults(data, className)` Extend the given data field with the default values for the given class name considering that it is the data field of a node.
* `extendEdgeDataWithClassDefaults(data, className)` Extend the given data field with the default values for the given class name considering that it is the data field of an edge.
* `getDefaultInfoboxStyle(nodeClass, infoboxType)` Returns the state variable or unit of information properties for the given nodeClass according to the infoboxType parameter.
* `lockGraphTopology()` Disables the operations that updates the topology grouping of graph.
* `unlockGraphTopology()` Enables the operations that updates the topology grouping of graph.
* `isGraphTopologyLocked()` Returns if the topology grouping of the graph is locked.
* `getAllCollapsedChildrenRecursively(nodes)` Returns all collapsed descendants of the given nodes.
* `getSbgnClass(ele)`  Returns sbgnclass of the given element. If the parameter is a string return it by assuming that it is the sbgnclass itself. 
* `getPureSbgnClass(ele)` Returns sbgn class omitting the multimer information.
* `canHaveUnitOfInformation(ele)` Returns whether the give element have unit of information.
* `isEmptySetClass(ele)` Returns wether the given element or string is of the special empty set/source and sink class.
* `isModulationArcClass(ele)` Returns whether the class of given element is a modulation arc as defined in PD specs.
* `convertToRenderedPosition(modelPos, pan, zoom)` ?????.
* `extendNodeList(nodesToShow)` ????????.
* `extendRemainingNodes(nodesToFilter, allNodes)` ????.
* `getArrayLineStyle(ele)` ?????.
* `getCyShape(ele)` ????.
* `getCyTargetArrowFill(ele)` ?????.
* `getCyArrowShape(ele)` ????????.
* `getElementContent(ele)` ????.
* `getLabelTextSize(ele)` ?????.
* `getCardinalityDistance(ele)` ????.
* `getInfoLabel(node)` ?????.
* `getQtipContent(node)` ????????.
* `getDynamicLabelSizeCoefficient(dynamicLabelSize)` ????.
* `getDynamicLabelTextSize(ele, dynamicLabelSizeCoefficient)` ?????.
* `getEndPoint(edge, sourceOrTarget)` Get source/target end point of edge in 'x-value% y-value%' format. It returns 'outside-to-node' if there is no source/target port.
* `addPorts(node, ordering, portDistance)` Add ports to the given node, with given ordering and port distance.
* `removePorts(node)` Remove the ports of the given node
* `changePortsOrientationAfterLayout()` ?????.
* `changePortsOrientation(ele)` Calculates the best orientation for an 'ele' with port (process or logical operator) and returns it.
* `calculateOrientationScore(ele, other, orientation, firstOrientation, oppositeOrientation, pos, simple)`
  This function calculates the scores for each orientation
  @param ele - is the node (process, logical operator) whose orientation will be changed. It can be process,omitted process,
  uncertain process, association, dissociation, logical operator
  @param other - is the other node, and based on its position scores are given to orientations
  @param orientation - holds scores for each orientation
  @param firstOrientation - can be L-to-R or T-to-B
  @param oppositeOrientation - opposite of the upper orientation (R-to-L , B-to-T)
  @param pos - can be 'x' or 'y' (based on vertical or horizontal direction of ports)
  @param simple - checks if 'other' node is simple node (with degree 1)
* `postChangePortsOrientation(ele, bestOrientation)` After a process is oriented, for each simple node that is on the wrong side of the port, we try to find another simple node of degree 0 on the opposite side and swap them afterwards. If from the opposide side we cannot find such a node then we try to swap it with an effector node of degree 1
* `addSimpleNodeToArray(ele, other, orientation, array, connectedTo)` Adds simple nodes when they have negative score to inputPort, outputPort or notConnectedPort arrays.
* `checkNegativeOrientationScore(ele, other, orientation)` 
  This function calculates the score of a node based on its position with respect to a process/logical operator
  @param ele - is the node with the ports. It can be process,omitted process,
  uncertain process, association, dissociation, logical operator
  @param other - is the other node, and based on its position score of a node is calculated
  @param orientation - A string which holds current best orientation
* `swapElements(firstEle, secondEle)` Swaps the positions of 2 elements.
* `getComplexPadding(ele)` ??????.
* `getComplexMargin(ele)` Swaps the positions of 2 elements.
* `setCloneMarkerStatus(node, status)` et clone marker status of given nodes to the given status.
* `languageToMapType(lang)` ????????
* `mapTypeToLanguage(mapType)` ???????
* `getAllCollapsedChildrenRecursively(nodes)` Returns all collapsed descendants of the given nodes.
* `getWidthByContent(content, fontFamily, fontSize, options)` Calculates and returns the width barely enough to fit the given content typed with the given fontName and fontSize. 'options' parameter may have extra margin to add both sides, min and max values to return.

`instance.undoRedoActionFunctions`
Functions to be utilized in defining new actions for cytoscape.js-undo-redo extension. These are exposed for the users who builds
an extension library of sbgnviz.

 * `deleteElesSimple(param)` Do/Redo function for 'deleteElesSimple' undo redo command.
 * `deleteNodesSmart(param)` Do/Redo function for 'deleteNodesSmart' undo redo command.
 * `restoreEles(eles)` Undo function for 'deleteElesSimple' and 'deleteNodesSmart' undo redo commands.
 * `setPortsOrdering(param)` Do/Undo/Redo function for 'setPortsOrdering' undo redo command.

### TabDelimetedParser
Accessible through `sbgnviz.tdParser`. Provides the following methods.

`getTabsArray(line)` Converts the give tab delimeted line into array of data and returns it.
`getLinesArray(content)` Converts the content into an array of tab delimeted lines and returns it.

### Classes

The following describes objects used by sbgnviz.js and accessible through `sbgnviz.classes`.



## Events
`$(document).on('sbgnvizLoadSampleStart', function(event, filename, cy) { ... });` Triggered when a sample is being loaded. Aliases `sbgnvizLoadSample`.

`$(document).on('sbgnvizLoadFileStart', function(event, filename, cy) { ... });` Triggered when an external sbgnml file is being loaded. Aliases `sbgnvizLoadFile`.

`$(document).on('sbgnvizLoadSampleEnd', function(event, filename, cy) { ... });` Triggered when a sample is loaded

`$(document).on('sbgnvizLoadFileEnd', function(event, filename, cy) { ... });` Triggered when an external sbgnml file is loaded

`$(document).on('updateGraphStart', function(event, cy) { ... });` Triggered when the graph update is just started

`$(document).on('updateGraphEnd', function(event, cy) { ... });` Triggered when the graph update is ended

## Dependencies

 * cytoscape (iVis-at-Bilkent/cytoscape.js#unstable)
 * jQuery ^2.2.4
 * filesaverjs ~0.2.2
 * tippy.js ^3.4.0
 * libsbgn.js github:sbgn/libsbgn.js#develop
 * pretty-data ^0.40.0
 * xml2js ^0.4.17

## Optional Dependencies
The following extensions are used by this library if they are registered.
 * cytoscape-undo-redo ^1.2.1
 * cytoscape-expand-collapse ^3.0.0
 * cytoscape-edge-bend-editing ^1.4.0
 * cytoscape-view-utilities ^2.0.0


## Usage instructions
Download the library:
 * via npm: `npm install sbgnviz` or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var sbgnviz = require('sbgnviz');
var cytoscape = require('cytoscape-for-sbgnviz');
var jQuery = require('jQuery');
var filesaverjs = require('filesaverjs');

var options = {
};

var libs = {
    cytoscape: cytoscape,
    jQuery: jQuery,
    filesaverjs: filesaverjs
};

sbgnviz( options, libs );
```

In plain JS you do not need to require the libraries you just need to register sbgnviz with the options.

## Publishing instructions

This project is set up to automatically be published to npm.  To publish:

1. Set the version number environment variable: `export VERSION=1.2.3`
2. Publish: `gulp publish`

## Credits

SBGNViz.js has been mainly developed by [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis).

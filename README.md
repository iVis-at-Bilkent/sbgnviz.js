# SBGNViz version 3

SBGNViz is a web application based on [Cytoscape.js](http://cytoscape.github.io/cytoscape.js/) to visualize the pathway models represented by [SBGN](http://www.sbgn.org) Process Description (PD) and Activity Flow (AF) Notation. It accepts the pathway models represented in [SBGN-ML](https://github.com/sbgn/sbgn/wiki/LibSBGN) format.

## Software

SBGNViz is distributed under [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html). 

**A sample application using SBGNViz** can be found [here](http://cs.bilkent.edu.tr/~ivis/SBGNViz_sample_app/). The sample application source codes are available [here](https://github.com/iVis-at-Bilkent/sbgnviz.js-sample-app)

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

`instance.expandAll()`
Expands all nodes in the graph recursively. Requires expandCollapse extension and considers undoable option.

`instance.hideNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact and hides the resulting list. Requires viewUtilities extension and considers 'undoable' option.

`instance.showNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact. Then unhides the resulting list and hides others. Requires viewUtilities extension and considers 'undoable' option.

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

`instance.doSchematronValidation(data)`
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

`instance.loadSample(filename, folderpath)`
Loads a sample file whose name and path of containing folder is given.

`instance.loadSBGNMLFile(file[, callback])`
Loads the given sbgnml file. Optionally apply a callback function upon loading. Callback accepts the file as an xml string as argument.

`instance.loadSBGNMLText(textData)`
Loads a graph from the given text data in sbgnml format.

`instance.saveAsSbgnml(filename[, version])`
Exports the current graph to an sbgnml file with the given filename. A SBGN-ML version can be provided, either 0.2 or 0.3. No version defaults to 0.3.

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

`instance.startSpinner(classname)`
Starts a spinner at the middle of network container element. You can specify a css class that the
spinner will have. The default classname is 'default-class'. Requires 'fontawesome.css'.

`instance.endSpinner(classname)`
Ends any spinner having a css class with the given name. Requires 'fontawesome.css'.

`instance.elementUtilities`
General and sbgn specific utilities for cytoscape elements. These are exposed for the users who builds an extension
library of sbgnviz. Most users will not need to use this. It includes the followings.

 * `getTopMostNodes(nodes)` This method returns the nodes non of whose ancestors is not in given nodes.
 * `allHaveTheSameParent(nodes)` This method checks if all of the given nodes have the same parent assuming that the size of  nodes is not 0.
 * `moveNodes(positionDiff, nodes)` This method moves given nodes by the given position difference.
 * `convertToModelPosition(renderedPosition)` This method calculates the modal position of the given rendered position by considering current the pan and zoom level of the graph.
 * `getProcessesOfSelected()` Returns the processes of the selected nodes.
 * `getNeighboursOfSelected()` Returns the neighbours of the selected nodes.
 * `getNeighboursOfNodes(nodes)` Returns the neighbours of the given nodes.
 * `getProcessesOfNodes(nodes)` Extends the given nodes list in a smart way to leave the map intact and returns the resulting list. Aliases `extendNodeList`.
 * `noneIsNotHighlighted()` Returns true if there is no element having 'unhighlighted' class.
 * `deleteNodesSmart(nodes)` Extends the given nodes list in a smart way to leave the map intact and removes the resulting list.
 * `deleteElesSimple` Removes the given elements in a simple way.
 * `getPortsOrdering` Return ordering of ports of a node. Possible return values are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
 * `canHavePorts` Returns whether the given element or elements with the given class can have ports
 * `setPortsOrdering(nodes, ordering, portDistance)` Similar to `instance.setPortsOrdering()` but do not considers undoable option.


`instance.undoRedoActionFunctions`
Functions to be utilized in defining new actions for cytoscape.js-undo-redo extension. These are exposed for the users who builds
an extension library of sbgnviz.

 * `deleteElesSimple(param)` Do/Redo function for 'deleteElesSimple' undo redo command.
 * `deleteNodesSmart(param)` Do/Redo function for 'deleteNodesSmart' undo redo command.
 * `restoreEles(eles)` Undo function for 'deleteElesSimple' and 'deleteNodesSmart' undo redo commands.
 * `setPortsOrdering(param)` Do/Undo/Redo function for 'setPortsOrdering' undo redo command.

### Classes

The following describes objects used by sbgnviz.js and accessible through `sbgnviz.classes`.

#### AuxiliaryUnit

```javascript
stateorinfobox.id;
stateorinfobox.parent; // points to the cytoscape parent node
stateorinfobox.clazz; // 'unit of information' or 'state variable'
stateorinfobox.bbox; // includes bbox.x, bbox.y, bbox.w, bbox.h
```

#### StateVariable

```javascript
stateVariable.state; // includes state.value and state.variable
```

#### UnitOfInformation

```javascript
unitOfInformation.label; // includes label.text
```

#### AuxUnitLayout

```javascript

// instance variables
auxUnitLayout.units // list of StateVariable or UnitOfInformation
auxUnitLayout.location // top, bottom, left, right
auxUnitLayout.parentNode // link to cytoscape parent node

// instance methods
// add an auxiliary unit to this layout, optionnally inserting it at a given position
auxUnitLayout.addAuxUnit(unit [,position]);
// remove an auxiliary unit from this layout
auxUnitLayout.removeAuxUnit(unit);

// class variables
// those options can be defined for each instance individually. If no value is found for an
// instance, then the class' value is used.
AuxUnitLayout.outerMargin = 10;
AuxUnitLayout.unitGap = 5;
AuxUnitLayout.alwaysShowAuxUnits = false;
AuxUnitLayout.maxUnitDisplayed = 4;

```

#### EntityType

#### StateVariableDefinition


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

## Optional Dependencies
The following extensions are used by this library if they are registered.
 * cytoscape-undo-redo ^1.2.1
 * cytoscape-expand-collapse ^3.0.0
 * cytoscape-edge-bend-editing ^1.4.0
 * cytoscape-view-utilities ^2.0.0


## Usage instructions
Download the library:
 * via npm: `npm install cytoscape-expand-collapse` or
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

Thanks to JetBrains for an [Open Source License](https://www.jetbrains.com/buy/opensource/)

## Team

  * [Ilkin Safarli](https://github.com/kinimesi), [Hasan Balci](https://github.com/hasanbalci), [Leonard Dervishi](https://github.com/leonarddrv), and [Ugur Dogrusoz](https://github.com/ugurdogrusoz) of [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis), [Metin Can Siper](https://github.com/metincansiper) of the Demir Lab at [OHSU](http://www.ohsu.edu/), and [Ludovic Roy](https://github.com/royludo) of [EISBM](http://eisbm.org)
  
#### Alumni

  * Alper Karacelik, Selim Firat Yilmaz, Istemi Bahceci, Mecit Sari, Ayhun Tekat, M.Furkan Sahin

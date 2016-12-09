# SBGNViz version 3

SBGNViz is a web application based on [Cytoscape.js](http://cytoscape.github.io/cytoscape.js/) to visualize pathway models represented by [SBGN Process Description Notation](http://sbgn.github.io/sbgn/specifications). It accepts the pathway models represented in [SBGN-ML](https://github.com/sbgn/sbgn/wiki/LibSBGN) format.

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
      // dynamic label size it may be 'small', 'regular', 'large'
      dynamicLabelSize: function () {
        return 'regular';
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

## API

`sbgnviz.expandNodes(nodes)`
Expands the given nodes. Considers 'undoable' option.

`sbgnviz.collapseNodes(nodes)`
Collapses the given nodes. Considers 'undoable' option.

`sbgnviz.expandComplexes()`
Expands the complex nodes in the graph recursively. Considers 'undoable' option.

`sbgnviz.collapseComplexes()`
Collapses the complex nodes in the graph recursively. Considers 'undoable' option.

`sbgnviz.collapseAll()`
Collapses all nodes in the graph recursively. Considers 'undoable' option.

`sbgnviz.expandAll()`
Expands all nodes in the graph recursively. Considers 'undoable' option.

`sbgnviz.hideNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact and hides the resulting list. Considers 'undoable' option.

`sbgnviz.showNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact. Then unhides the resulting list and hides others. Considers 'undoable' option.

`sbgnviz.showAll()`
Unhides all elements. Considers 'undoable' option.

`sbgnviz.deleteElesSimple(eles)`
Removes the given elements in a simple way. Considers 'undoable' option.

`sbgnviz.deleteNodesSmart(nodes)`
Extends the given nodes list in a smart way to leave the map intact and removes the resulting list. Considers 'undoable' option.

`sbgnviz.highlightNeighbours(nodes)`
Highlights neighbours of the given nodes. Considers 'undoable' option.

`sbgnviz.highlightProcesses(nodes)`
Highlights processes of the given nodes. Considers 'undoable' option.

`sbgnviz.searchByLabel(label)`
Finds the elements whose label includes the given label and highlights processes of those elements.
Considers 'undoable' option.

`sbgnviz.removeHighlights()`
Unhighlights any highlighted element. Considers 'undoable' option.

`sbgnviz.performLayout(layoutOptions, notUndoable)`
Performs layout by given layoutOptions. Considers 'undoable' option. However, by setting notUndoable parameter
to a truthy value you can force an undable layout operation independant of 'undoable' option.

`sbgnviz.createSbgnml()`
Creates an sbgnml file content from the exising graph and returns it.

`sbgnviz.convertSbgnmlToJson(data)`
Converts given sbgnml data to a json object in a special format (http://js.cytoscape.org/#notation/elements-json) and returns it.

`sbgnviz.getQtipContent(node)`
Create the qtip contents of the given node and returns it.

`sbgnviz.updateGraph(cyGraph)`
Update the graph by given cyGraph parameter which is a json object including data of cytoscape elements 
in a special format (http://js.cytoscape.org/#notation/elements-json).

`sbgnviz.calculatePaddings(paddingPercent)`
Calculates the paddings for compounds based on dimensions of simple nodes and a specific percentadge.
As this percentadge takes the given paddingPercent or compoundPadding option.

`sbgnviz.refreshPaddings(recalculatePaddings, nodes)`
If nodes parameter is set refreshes the paddings of given nodes, else refreshes the paddings of whole graph.
If recalculatePaddings parameter is set to a truthy value recalculates the paddings before refreshing, else uses
the last calculated value for the paddings. 

`sbgnviz.saveAsPng(filename)`
Exports the current graph to a png file. The name of the file is determined by the filename parameter which is 
'network.png' by default.

`sbgnviz.saveAsJpg(filename)`
Exports the current graph to a jpg file. The name of the file is determined by the filename parameter which is 
'network.jpg' by default.

`sbgnviz.loadSample(filename, folderpath)`
Loads a sample file whose name and path of containing folder is given.

`sbgnviz.loadSBGNMLFile(file)`
Loads the given sbgnml file.

`sbgnviz.saveAsSbgnml(filename)`
Exports the current graph to an sbgnml file with the given filename.

`sbgnviz.startSpinner(classname)`
Starts a spinner at the middle of network container element. You can specify a css class that the 
spinner will have. The default classname is 'default-class'. Requires 'fontawesome.css'.

`sbgnviz.endSpinner(classname)`
Ends any spinner having a css class with the given name. Requires 'fontawesome.css'.

`sbgnviz.elementUtilities`
General and sbgn specific utilities for cytoscape elements. These are exposed for the users who builds an extension
library of sbgnviz. Most users will not need to use this. For further details please see 'src/utilities/element-utilities.js'

`sbgnviz.undoRedoActionFunctions`
Functions to be utilized in defining new actions for cytoscape.js-undo-redo extension. These are exposed for the users who builds
an extension library of sbgnviz. Most users will not need to use this. For further details please see 'src/utilities/undo-redo-action-functions.js'

## Events
`$(document).on('sbgnvizLoadSample', function(event, filename) { ... });` Triggered when a sample is being loaded

`$(document).on('sbgnvizLoadFile', function(event, filename) { ... });` Triggered when an external sbgnml file is being loaded

`$(document).on('updateGraphStart', function(event) { ... });` Triggered when the graph update is just started

`$(document).on('updateGraphEnd', function(event) { ... });` Triggered when the graph update is ended

## Dependencies

 * cytoscape-for-sbgnviz ^2.7.12
 * jQuery ^2.2.4
 * filesaverjs ~0.2.2

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

  * [Metin Can Siper](https://github.com/metincansiper), [Selim Firat Yilmaz](https://github.com/mrsfy), [Ugur Dogrusoz](https://github.com/ugurdogrusoz), and [Alper Karacelik](https://github.com/alperkaracelik) of [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis)

#### Alumni

  * Istemi Bahceci, Mecit Sari, Ayhun Tekat, M.Furkan Sahin

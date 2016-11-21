var sbgnviz = require('../sbgnviz');
var appUtilities = require('./js/app-utilities');
var appCy = require('./js/app-cy');
var appMenu = require('./js/app-menu');

// Get cy extension instances
var cyPanzoom = require('cytoscape-panzoom');
var cyQtip = require('cytoscape-qtip');
var cyCoseBilkent = require('cytoscape-cose-bilkent');
var cyUndoRedo = require('cytoscape-undo-redo');
var cyClipboard = require('cytoscape-clipboard');
var cyContextMenus = require('cytoscape-context-menus');
var cyExpandCollapse = require('cytoscape-expand-collapse');
var cyEdgeBendEditing = require('cytoscape-edge-bend-editing');
var cyViewUtilities = require('cytoscape-view-utilities');

// Register cy extensions
cyPanzoom( cytoscape, $ );
cyQtip( cytoscape, $ );
cyCoseBilkent( cytoscape );
cyUndoRedo( cytoscape );
cyClipboard( cytoscape );
cyContextMenus( cytoscape, $ );
cyExpandCollapse( cytoscape, $ );
cyEdgeBendEditing( cytoscape, $ );
cyViewUtilities( cytoscape, $ );

// Libraries to pass sbgnviz
//var libs = {};

sbgnviz({
//  libs: libs,
  networkContainerSelector: '#sbgn-network-container',
  imgPath: 'src/img',
  // whether to fit label to nodes
  fitLabelsToNodes: function () {
    return appUtilities.getSbgnProperties().fitLabelsToNodes;
  },
  // dynamic label size it may be 'small', 'regular', 'large'
  dynamicLabelSize: function () {
    return appUtilities.getSbgnProperties().dynamicLabelSize;
  },
  // percentage used to calculate compound paddings
  compoundPadding: function () {
    return appUtilities.getSbgnProperties().compoundPadding;
  },
  undoable: true
});

appCy();
appMenu();
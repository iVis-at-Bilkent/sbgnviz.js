var sbgnviz = require('../sbgnviz');
var commonAppUtilities = require('./js/common-app-utilities');
var sbgnStyleRules = commonAppUtilities.sbgnStyleRules;
var appCy = require('./js/app-cy');
var appMenu = require('./js/app-menu');

var libs = {};

libs['cytoscape-panzoom'] = require('cytoscape-panzoom');
libs['cytoscape-qtip'] = require('cytoscape-qtip');
libs['cytoscape-cose-bilkent'] = require('cytoscape-cose-bilkent');
libs['cytoscape-undo-redo'] = require('cytoscape-undo-redo');
libs['cytoscape-clipboard'] = require('cytoscape-clipboard');
libs['cytoscape-context-menus'] = require('cytoscape-context-menus');
libs['cytoscape-expand-collapse'] = require('cytoscape-expand-collapse');
libs['cytoscape-edge-bend-editing'] = require('cytoscape-edge-bend-editing');
libs['cytoscape-view-utilities'] = require('cytoscape-view-utilities');

sbgnviz({
  libs: libs,
  networkContainerSelector: '#sbgn-network-container',
  imgPath: 'src/img',
  fitLabelsToNodes: function () {
    return sbgnStyleRules['fit-labels-to-nodes'];
  },
  // dynamic label size it may be 'small', 'regular', 'large'
  dynamicLabelSize: function () {
    return sbgnStyleRules['dynamic-label-size'];
  }
});

appCy();
appMenu();
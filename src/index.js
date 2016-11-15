(function(){
  var register = function(options) {
    var libs = options.libs;
    
    if (libs === undefined) {
      libs = {};
    }
    
    // The path of core library images when sbgnviz is required from npm and located 
    // in node_modules using default option is enough
    var imgPath = options.imgPath || 'node_modules/sbgnviz/src/img';
    
    // Get cy extension instances
    var cyPanzoom = libs['cytoscape-panzoom'];
    var cyQtip = libs['cytoscape-qtip']; 
    var cyCoseBilkent = libs['cytoscape-cose-bilkent'];
    var cyUndoRedo = libs['cytoscape-undo-redo'];
    var cyClipboard = libs['cytoscape-clipboard'];
    var cyContextMenus = libs['cytoscape-context-menus'];
    var cyExpandCollapse = libs['cytoscape-expand-collapse'];
    var cyEdgeBendEditing = libs['cytoscape-edge-bend-editing'];
    var cyViewUtilities = libs['cytoscape-view-utilities'];
    
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
    
    var sbgnRenderer = require('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var sbgnCyInstance = require('./sbgn-extensions/sbgn-cy-instance');
    var appCy = require('../sample-app/js/app-cy');
    var appMenu = require('../sample-app/js/app-menu');
    
    sbgnRenderer();
    sbgnCyInstance(options.networkContainerSelector, imgPath);
    appCy();
    appMenu();
    
  };
  
  module.exports = register;
})();
(function(){
  var sbgnviz = window.sbgnviz = function(_options) {
    var optionUtilities = require('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options);
    
    var sbgnRenderer = require('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var sbgnCyInstance = require('./sbgn-extensions/sbgn-cy-instance');
    
    // Utilities to be exposed
    var sbgnElementUtilities = require('./utilities/sbgn-element-utilities');
    var jsonToSbgnmlConverter = require('./utilities/json-to-sbgnml-converter');
    var sbgnmlToJsonConverter = require('./utilities/sbgnml-to-json-converter');
    var dialogUtilities = require('./utilities/dialog-utilities');
    
    var libs = options.libs;
    var imgPath = options.imgPath;
    
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
    
    sbgnRenderer();
    sbgnCyInstance();
    
    // Expose the api
    sbgnviz.sbgnElementUtilities = sbgnElementUtilities;
    sbgnviz.sbgnmlToJsonConverter = sbgnmlToJsonConverter;
    sbgnviz.jsonToSbgnmlConverter = jsonToSbgnmlConverter;
    sbgnviz.dialogUtilities = dialogUtilities;
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();
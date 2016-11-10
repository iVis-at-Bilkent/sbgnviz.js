(function(){
  var register = function(libs) {
    if (libs === undefined) {
      libs = {};
    }
    /*
    // get or require the libraries
    var $ = window.jQuery = window.$ = libs['jQuery'] || require('jQuery');
    // jquery browser here?
    var fancybox = libs['fancybox'] || require('../lib/js/jquery.fancybox-1.3.4')($);
    var jqueryExpander = libs['jquery-expander'] || require('jquery-expander')($);
    var qtip2 = libs['qtip2'] || require('qtip2'); // Check it
    var bootstrap = libs['bootstrap'] || require('bootstrap');
    //    Check it most probably it should be included in html
    var jqueryUIBundle = libs['jquery-ui-bundle'] || require('jquery-ui-bundle')($);
    var _ = window._ = libs['underscore'] || require('underscore');
    window.Backbone = libs['backbone'] || require('backbone');
    var cytoscape = window.cytoscape = libs['cytoscape'] || require('../lib/js/cytoscape');
    //    Check it most probably it should be included in html
    var filesaverjs = libs['filesaverjs'] ? libs['filesaverjs'] : require('filesaverjs');
    Backbone.$ = jQuery;  

    // jquery noty here?
    
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
    cyPanzoom( cytoscape );
    cyQtip( cytoscape, $ );
    cyCoseBilkent( cytoscape );
    cyUndoRedo( cytoscape );
    cyClipboard( cytoscape );
    cyContextMenus( cytoscape, $ );
    cyExpandCollapse( cytoscape, $ );
    cyEdgeBendEditing( cytoscape, $ );
    cyViewUtilities( cytoscape, $ );*/
    
    var sbgnRenderer = require('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var appCy = require('../sample-app/js/app-cy');
    var appMenu = require('../sample-app/js/app-menu');
    
    sbgnRenderer();
    appCy();
    appMenu();
    
  };
  
  module.exports = register;
})();
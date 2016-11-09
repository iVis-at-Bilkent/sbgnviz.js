(function(){
  var register = function(libs) {
    // get or require the libraries
    var $ = window.jQuery = window.$ = libs['jQuery'] ? libs['jQuery'] : require('jQuery');
    // jquery browser here?
    var fancybox = libs['fancybox'] ? libs['fancybox'] : require('lib/js/jquery.fancybox-1.3.4')($);
    var jqueryExpander = libs['jquery-expander'] ? libs['jquery-expander'] : require('jquery-expander')($);
    var qtip2 = libs['qtip2'] ? libs['qtip2'] : require('qtip2'); // Check it
    var bootstrap = libs['bootstrap'] ? libs['bootstrap'] : require('bootstrap');
    //    Check it most probably it should be included in html
    var jqueryUIBundle = libs['jquery-ui-bundle'] ? libs['jquery-ui-bundle'] : require('jquery-ui-bundle')($);
    var _ = window._ = libs['underscore'] ? libs['underscore'] : require('underscore');
    window.Backbone = libs['backbone'] ? libs['backbone'] : require('backbone');
    var cytoscape = window.cytoscape = libs['cytoscape'] ? libs['cytoscape'] : require('cytoscape');
    //    Check it most probably it should be included in html
//    var filesaverjs = libs['filesaverjs'] ? libs['filesaverjs'] : require('filesaverjs');

    // jquery noty here?
    
    Backbone.$ = jQuery;
    
    var appCy = require('sample-app/js/app-cy');
    var appMenu = require('sample-app/js/app-menu');
    
    appCy();
    appMenu();
  };
})();
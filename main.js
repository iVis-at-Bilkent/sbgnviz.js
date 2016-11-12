var sbgnviz = require('./sbgnviz');
var libs = {};

// The code segment below to be removed if it will not be utilized
/*
var $ = libs['jQuery'] = window.jQuery = window.$ = require('jQuery');
//require('jquery.browser');
//require('./lib/js/jquery.fancybox-1.3.4')($);
require('jquery-expander')($);
require('qtip2'); // Check it
require('bootstrap');
//    Check it most probably it should be included in html
//require('jquery-ui-bundle')($);
var _ = window._ = require('underscore');
window.Backbone = require('backbone');
var cytoscape = window.cytoscape = libs['cytoscape'] = require('./lib/js/cytoscape');
//    Check it most probably it should be included in html
require('filesaverjs');

Backbone.$ = jQuery; */

libs['cytoscape-panzoom'] = require('cytoscape-panzoom');
libs['cytoscape-qtip'] = require('cytoscape-qtip');
libs['cytoscape-cose-bilkent'] = require('cytoscape-cose-bilkent');
libs['cytoscape-undo-redo'] = require('cytoscape-undo-redo');
libs['cytoscape-clipboard'] = require('cytoscape-clipboard');
libs['cytoscape-context-menus'] = require('cytoscape-context-menus');
libs['cytoscape-expand-collapse'] = require('cytoscape-expand-collapse');
libs['cytoscape-edge-bend-editing'] = require('cytoscape-edge-bend-editing');
libs['cytoscape-view-utilities'] = require('cytoscape-view-utilities');

sbgnviz(libs);
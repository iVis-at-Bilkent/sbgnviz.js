(function(){
  var sbgnviz = window.sbgnviz = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    // Set the libraries to access them from any file
    var libUtilities = require('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = require('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options);
    
    var sbgnRenderer = require('./sbgn-extensions/sbgn-cy-renderer');
    var sbgnCyInstance = require('./sbgn-extensions/sbgn-cy-instance');
    
    // Utilities whose functions will be exposed seperately
    var uiUtilities = require('./utilities/ui-utilities');
    var fileUtilities = require('./utilities/file-utilities');
    var sbgnGraphUtilities = require('./utilities/sbgn-graph-utilities');
    var mainUtilities = require('./utilities/main-utilities');
    require('./utilities/keyboard-input-utilities'); // require keybord input utilities
    // Utilities to be exposed as is
    var sbgnElementUtilities = require('./utilities/sbgn-element-utilities');
    var undoRedoActionFunctions = require('./utilities/undo-redo-action-functions');
    
    sbgnRenderer();
    sbgnCyInstance();
    
    // Expose the api
    // Expose sbgnElementUtilities and undoRedoActionFunctions as is, most users will not need these
    sbgnviz.sbgnElementUtilities = sbgnElementUtilities;
    sbgnviz.undoRedoActionFunctions = undoRedoActionFunctions;
    
    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      sbgnviz[prop] = mainUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in fileUtilities) {
      sbgnviz[prop] = fileUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in uiUtilities) {
      sbgnviz[prop] = uiUtilities[prop];
    }
    
    // Expose each sbgn graph utility seperately
    for (var prop in sbgnGraphUtilities) {
      sbgnviz[prop] = sbgnGraphUtilities[prop];
    }
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();
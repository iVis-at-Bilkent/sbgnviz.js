(function(){
  var sbgnviz = function(_options) {

    var param = {}; // The parameter to be passed to all utilities instances related to this sbgnviz instance

    var optionUtilities = require('./utilities/option-utilities-factory')();
    var options = optionUtilities.extendOptions(_options);

    var sbgnCyInstance = require('./sbgn-extensions/sbgn-cy-instance-factory')();

    // Utilities whose functions will be exposed seperately
    var uiUtilities = require('./utilities/ui-utilities-factory')();
    var fileUtilities = require('./utilities/file-utilities-factory')();
    var graphUtilities = require('./utilities/graph-utilities-factory')();
    var mainUtilities = require('./utilities/main-utilities-factory')();
    var keyboardInputUtilities = require('./utilities/keyboard-input-utilities-factory')(); // require keybord input utilities

    // Utilities to be exposed as is
    var elementUtilities = require('./utilities/element-utilities-factory')();
    var undoRedoActionFunctions = require('./utilities/undo-redo-action-functions-factory')();

    // Other utilities
    var jsonToSbgnmlConverter = require('./utilities/json-to-sbgnml-converter-factory')();
    var sbgnmlToJsonConverter = require('./utilities/sbgnml-to-json-converter-factory')();
    var tdToJsonConverter = require('./utilities/tab-delimited-to-json-converter-factory')();
    var classes = require('./utilities/classes');

    // Fill param object to use it utilities internally
    param.optionUtilities = optionUtilities;
    param.sbgnCyInstance = sbgnCyInstance;
    param.uiUtilities = uiUtilities;
    param.fileUtilities = fileUtilities;
    param.graphUtilities = graphUtilities;
    param.mainUtilities = mainUtilities;
    param.keyboardInputUtilities = keyboardInputUtilities;
    param.elementUtilities = elementUtilities;
    param.undoRedoActionFunctions = undoRedoActionFunctions;
    param.jsonToSbgnmlConverter = jsonToSbgnmlConverter;
    param.sbgnmlToJsonConverter = sbgnmlToJsonConverter;
    param.tdToJsonConverter = tdToJsonConverter;
    param.classes = classes;

    // call constructors of objects with param
    sbgnCyInstance(param);
    optionUtilities(param);
    uiUtilities(param);
    fileUtilities(param);
    graphUtilities(param);
    mainUtilities(param);
    keyboardInputUtilities(param);
    elementUtilities(param);
    undoRedoActionFunctions(param);
    jsonToSbgnmlConverter(param);
    sbgnmlToJsonConverter(param);
    tdToJsonConverter(param);

    // set scratch pad for sbgnviz and init sbgnvizParams inside it
    sbgnCyInstance.getCy().scratch('_sbgnviz', {});
    sbgnCyInstance.getCy().scratch('_sbgnviz').sbgnvizParams = param;

    // Expose the api
    var api = {};

    // Expose elementUtilities and undoRedoActionFunctions as is, most users will not need these
    api.elementUtilities = elementUtilities;
    api.undoRedoActionFunctions = undoRedoActionFunctions;

    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      api[prop] = mainUtilities[prop];
    }

    // Expose each file utility seperately
    for (var prop in fileUtilities) {
      api[prop] = fileUtilities[prop];
    }

    // Expose each file utility seperately
    for (var prop in uiUtilities) {
      api[prop] = uiUtilities[prop];
    }

    // Expose each sbgn graph utility seperately
    for (var prop in graphUtilities) {
      api[prop] = graphUtilities[prop];
    }

    // Expose get cy function to enable accessing related cy instance
    api.getCy = sbgnCyInstance.getCy;

    // Expose classes
    api.classes = classes;

    return api;
  };

  sbgnviz.register = function (_libs) {

    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;

    // Set the libraries to access them from any file
    var libUtilities = require('./utilities/lib-utilities');
    libUtilities.setLibs(libs);

    var sbgnRenderer = require('./sbgn-extensions/sbgn-cy-renderer');
    sbgnRenderer();
  };

  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();

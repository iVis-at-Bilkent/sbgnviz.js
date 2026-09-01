var chai = require('chai');
var assert = chai.assert;

var experimentalDataOverlayFactory = require('../../src/utilities/experimental-data-overlay');
var undoRedoActionFunctionsFactory = require('../../src/utilities/undo-redo-action-functions-factory');

describe('undoRedoActionFunctions - experimentalDataOverlay', function () {
  var experimentalDataOverlay;
  var undoRedoActionFunctions;

  beforeEach(function () {
    experimentalDataOverlay = experimentalDataOverlayFactory();
    undoRedoActionFunctions = undoRedoActionFunctionsFactory();

    var mockCy = {
      nodes: function () {
        return [];
      }
    };

    var mockSbgnCyInstance = {
      getCy: function () {
        return mockCy;
      }
    };

    experimentalDataOverlay({
      sbgnCyInstance: mockSbgnCyInstance
    });

    // Provide mock showData implementation so it does not throw
    experimentalDataOverlay.showData = function () {};

    undoRedoActionFunctions({
      elementUtilities: {},
      experimentalDataOverlay: experimentalDataOverlay,
      mainUtilities: {},
      sbgnCyInstance: mockSbgnCyInstance
    });
  });

  it('correctly reverts visibility without corrupting visibleFiles map during unhideAllUndo', function () {
    var fileName = 'exp_dataset.txt';
    var parsed = {
      node1: { 'exp_dataset.txt?exp1': '1.5' }
    };
    var visible = { 'exp_dataset.txt?exp1': false };
    var grouped = { 'exp_dataset.txt': ['exp1'] };
    var visiblef = { 'exp_dataset.txt': false };

    // 1. Add file to overlay
    experimentalDataOverlay.addFile(fileName, parsed, visible, grouped, visiblef);

    // 2. Perform unhideAll
    var unhideAllResult = undoRedoActionFunctions.unhideAll();
    assert.isOk(unhideAllResult.visibleFile);
    assert.isOk(unhideAllResult.visibleExp);

    // 3. Perform unhideAllUndo
    undoRedoActionFunctions.unhideAllUndo(unhideAllResult);

    // 4. Assert no corrupted '[object Object]' key in visibleFiles
    var visibleData = experimentalDataOverlay.getVisibleData();
    assert.isNotOk('[object Object]' in visiblef, "visibleFiles should not contain '[object Object]'");
    assert.equal(visibleData['exp_dataset.txt?exp1'], false, "Experiment visibility should revert to false");
  });
});

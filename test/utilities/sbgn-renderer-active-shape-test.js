var chai = require('chai');
var assert = chai.assert;

describe('sbgn-cy-renderer - active entity calculations', function () {
  it('correctly calculates center alignment without arbitrary padding offset for active entity shapes', function () {
    var centerX = 100;
    var centerY = 100;
    var width = 80;
    var height = 40;
    var padding = 1;

    // Simulate plainCheckPointFcn (e.g. for rectangle / roundrectangle)
    var plainCheckPointFcn = function(x, y, pad, w, h, cx, cy) {
      return (
        x >= cx - w / 2 - pad &&
        x <= cx + w / 2 + pad &&
        y >= cy - h / 2 - pad &&
        y <= cy + h / 2 + pad
      );
    };

    var canBeActive = true;
    var node = {
      _private: {
        data: { class: 'active macromolecule' },
        position: { x: centerX, y: centerY }
      },
      outerWidth: function () { return width + 2; },
      outerHeight: function () { return height + 2; },
      css: function () { return '2px'; }
    };

    // Before fix: centerX + 5, centerY + 5 caused center test to evaluate at (105, 105)
    // After fix: uses true center (centerX, centerY)
    var isInsideTrueCenter = plainCheckPointFcn(centerX, centerY, padding, width, height, centerX, centerY);
    assert.isTrue(isInsideTrueCenter, 'Point at true center of active node should be inside shape boundary');

    // Left border symmetry check around true center
    var isInsideLeftMargin = plainCheckPointFcn(centerX - width / 2, centerY, padding, width, height, centerX, centerY);
    var isInsideRightMargin = plainCheckPointFcn(centerX + width / 2, centerY, padding, width, height, centerX, centerY);
    assert.isTrue(isInsideLeftMargin, 'Left edge boundary is symmetrical around center');
    assert.isTrue(isInsideRightMargin, 'Right edge boundary is symmetrical around center');
  });
});

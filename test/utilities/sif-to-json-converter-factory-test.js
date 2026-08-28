var chai = require('chai');
var assert = chai.assert;

var elementUtilitiesFactory = require('../../src/utilities/element-utilities-factory');
var sifToJsonConverterFactory = require('../../src/utilities/sif-to-json-converter-factory');

describe('sifToJsonConverter', function () {
  var sifToJson;
  var elementUtilities;

  beforeEach(function () {
    elementUtilities = elementUtilitiesFactory();
    sifToJson = sifToJsonConverterFactory();
    sifToJson({ elementUtilities: elementUtilities });
  });

  it('handles valid single node', function () {
    var sifText = 'A';
    var elements = sifToJson.convert(sifText);
    var nodes = elements.filter(function (el) { return el.data && !el.data.source; });
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].data.label, 'A');
  });

  it('handles valid edge', function () {
    var sifText = 'A\tcontrols-production-of\tB';
    var elements = sifToJson.convert(sifText);
    var nodes = elements.filter(function (el) { return el.data && !el.data.source; });
    var edges = elements.filter(function (el) { return el.data && el.data.source; });

    assert.equal(nodes.length, 2);
    assert.equal(edges.length, 1);
  });

  it('handles empty line and whitespace-only line gracefully', function () {
    var sifText = 'A\n\n   \n\t\nB';
    var elements = sifToJson.convert(sifText);
    var nodes = elements.filter(function (el) { return el.data && !el.data.source; });
    assert.equal(nodes.length, 2);
  });

  it('ignores malformed 2-token line without crashing or producing edge', function () {
    var sifText = 'A\tcontrols-production-of';
    var elements = sifToJson.convert(sifText);
    var edges = elements.filter(function (el) { return el.data && el.data.source; });
    assert.equal(edges.length, 0);
  });

  it('handles trailing newlines correctly', function () {
    var sifText = 'A\tcontrols-production-of\tB\n';
    var elements = sifToJson.convert(sifText);
    var nodes = elements.filter(function (el) { return el.data && !el.data.source; });
    var edges = elements.filter(function (el) { return el.data && el.data.source; });

    assert.equal(nodes.length, 2);
    assert.equal(edges.length, 1);
  });
});

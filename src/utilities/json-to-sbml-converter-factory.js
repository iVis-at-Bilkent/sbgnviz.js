const libsbml = require('libsbmljs_stable');
const libsbmlInstance = libsbml();
var pkgVersion = require('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = require('../../package.json').name;
var prettyprint = require('pretty-data').pd;
var xml2js = require('xml2js');
var mapPropertiesBuilder = new xml2js.Builder({rootName: "mapProperties"});
var compoundExtensionBuilder = new xml2js.Builder({rootName: "extraInfo"});
var textUtilities = require('./text-utilities');

module.exports = function () {
    var elementUtilities, graphUtilities, experimentalDataOverlay;
    var cy;

    var nodesToSbo = 
    {
        "rna": 278,
        "complex": 253,
        "hypothetical complex": 289,
        "degradation": 291,
        "drug": 298,
        "gene": 243,
        "protein": 252,
        "ion": 327,
        "ion channel": 284,
        "phenotype": 358,
        "receptor": 244,
        "simple molecule": 247, 
        "truncated protein": 248,
        "unknown molecule": 285,
        "and": 173,
        "or": 174,
        "not": 238,
        "unknown logical operator": 398
    }
  
    function jsonToSbml (param) {
        elementUtilities = param.elementUtilities;
        graphUtilities = param.graphUtilities;
        experimentalDataOverlay = param.experimentalDataOverlay;
        cy = param.sbgnCyInstance.getCy();
      }

    jsonToSbml.createSbml = function(filename) {
        console.log("in createSbml")
        var jsObj = jsonToSbml.buildJsObj(filename);
        return jsonToSbml.buildString({sbgn: jsObj});
    }

    jsonToSbml.buildJsObj = function(filename){
        var edges = cy.edges();
        var nodes = cy.nodes();
        var sbmlDoc =  new libsbmlInstance.SBMLDocument(3, 1)
        var model = sbmlDoc.createModel()
        console.log("edges", edges)
        console.log("nodes", nodes)
         
        //Set species
        for (let i = 0; i < nodes.length; i++)
        {
            var newSpecies = new libsbmlInstance.Species(3,1);
            var nodeClass = node._private.data.class;
            if(nodesToSbo[nodeClass])
            {
                newSpecies.setSBOTerm(nodesToSbo[nodeClass])
            }
        }

     }
    jsonToSbml.buildString = function(obj) {}
    jsonToSbml.getRenderExtensionSbgnml = function(renderInfo) {}
    jsonToSbml.getAnnotationExtension = function(cyElement) {}
    jsonToSbml.getGlyphSbgnml = function(node, version, visible = true){}
    jsonToSbml.getOrCreateExtension = function(element) {}
    jsonToSbml.getArcSbgnml = function(edge, version, hidden = false){}
    jsonToSbml.addGlyphBbox = function(node){}
    jsonToSbml.addStateAndInfoBbox = function(node, boxGlyph){}
    jsonToSbml.addStateBoxGlyph = function(node, id, mainGlyph){}
    jsonToSbml.addBindingBoxGlyph = function(node, id, mainGlyph){}
    jsonToSbml.addResidueBoxGlyph = function(node, id, mainGlyph){}
    jsonToSbml.addInfoBoxGlyph = function (node, id, mainGlyph) {}
    jsonToSbml.childOfNone = function(ele, nodes) {}
    return jsonToSbml;
}
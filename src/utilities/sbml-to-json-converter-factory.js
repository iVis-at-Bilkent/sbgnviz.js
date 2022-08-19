const libsbml = require('libsbmljs_stable');
const libsbmlInstance = libsbml();
var parseString = require("xml2js").parseString;
var libUtilities = require("./lib-utilities");
var libs = libUtilities.getLibs();
var jQuery = ($ = libs.jQuery);
var classes = require("./classes");

module.exports = function () {
  var elementUtilities, graphUtilities, handledElements, mainUtilities;
  let resultJson = [];
  let speciesCompartmentMap = new Map;

  function sbmlToJson(param) {
    optionUtilities = param.optionUtilities;
    options = optionUtilities.getOptions();
    elementUtilities = param.elementUtilities;
    graphUtilities = param.graphUtilities;
    mainUtilities = param.mainUtilities;

    handledElements = {};

    elementUtilities.elementTypes.forEach(function (type) {
      handledElements[type] = true;
    });
  }

  var sboToNodeClass = {
    278: "rna",
    253: "complex",
    289: "hypothetical complex",
    291: "degradation",
    298: "drug",
    243: "gene",
    252: "protein",
    327: "ion",
    284: "ion channel",
    358: "phenotype",
    244: "receptor",
    247: "simple molecule", // truncated protein removed for now
    285: "unknown molecule",
    173: "and",
    174: "or",
    238: "not",
    398: "unknown logical operator"
  }

  var sboToEdgeClass = {
    594: "modulation",
    459: "stimulation",
    13: "catalysis",
    537: "inhibition",
    461: "trigger",
    185: "transport",
    536: "unknown inhibition",
    462: "unknown catalysis",
    171: "positive influence",
    407: "negative influence",
    344: "reduced modulation",
    411: "reduced stimulation",
    168: "reduced trigger",
    169: "unknown negative influence",
    172: "unknown positive influence",
    170: "unknown reduced stimulation",
    342: "unknown reduced modulation",
    205: "unknown reduced trigger",
  }
  var sboTwoEdgeOneNodeClass = {
    176: ["consumption","process", "production"], //state transition
    396: ["consumption","uncertain process", "production"], //Unknown transition
    183: ["transcription consumption","process", "transcription production"], //Transcription
    184: ["translation consumption","process", "translation production"], //Translation
    185: ["consumption","process","transport"], //Transport
    395: ["consumption", "omitted process", "production"] //Known transition omitted
  } 

  var sboAssociationDissociation = {
    177: ["consumption", "consumption", "association", "consumption", "process", "production"], //Heterodimer association
    180: ["consumption", "process", "consumption", "dissociation", "production", "production"], //Dissociation
    178: ["consumption", "truncated process", "consumption", "production", "production"], //Truncation,
  }


  sbmlToJson.convert = function (xmlString, urlParams) {
    
    var self = this;
    var cytoscapeJsGraph = {};
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];
    var compartmentChildrenMap = {}; // Map compartments children temporarily
    elementUtilities.fileFormat = 'sbml';
    let model = null;

    var sbgn;
    try {
      //var xmlString = new XMLSerializer().serializeToString(xmlObject);
      //console.log("xmlStringl",xmlString)
      let reader = new libsbmlInstance.SBMLReader();
    
      // get document and model from sbml text
      let doc = reader.readSBMLFromString(xmlString);
      model = doc.getModel();
    }
    catch (err) {
      throw new Error("Could not parse sbgnml. "+ err);
    }
    let result = []; 
    
    let plugin;
    try {
      plugin = model.findPlugin('layout');
    }
    catch(err) {
      plugin = undefined;
    }

    let layoutplugin;
    let layout;    
    
    if(plugin) {
      layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
      layout = layoutplugin.layouts[0];
    }   

    if(layout) {
      let edgeArray = [];
      let compoundMap = new Map();
      let compartmentMap = new Map();
      let compartmentNodeMap = new Map();

      // traverse compartments
      for(let i = 0; i < model.getNumCompartments(); i++){
        let compartment = model.getCompartment(i);
        if(compartment.getId() !== "default") {
          compartmentMap.set(compartment.getId(), compartment.getName());
        }
      }

      // traverse compartment glyphs
      for(let i = 0; i < layout.getNumCompartmentGlyphs(); i++){
        let compartmentGlyph = layout.getCompartmentGlyph(i);
        if(compartmentGlyph.getCompartmentId() !== "default") {
          let bbox = compartmentGlyph.getBoundingBox();
          let data = {id: compartmentGlyph.getCompartmentId(), label: compartmentMap.get(compartmentGlyph.getCompartmentId()),
            width: bbox.width, height: bbox.height};
          let position = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
          compartmentNodeMap.set(compartmentGlyph.getCompartmentId(), {"data": data, "position": position, "group": "nodes", "classes": "compartment"});
          compoundMap.set(compartmentGlyph.getCompartmentId(), [bbox.x, bbox.y, bbox.width, bbox.height, bbox.width*bbox.height]);
        }
      }

      let speciesMap = new Map();
      let speciesNodeMap = new Map();
      let speciesGlyphIdSpeciesIdMap = new Map();

      // traverse species
      for(let i = 0; i < model.getNumSpecies(); i++){
        let species = model.getSpecies(i);
        speciesMap.set(species.getId(), [species.getName(), species.getCompartment(), species.getSBOTerm()]);
      }

      // traverse species glyphs
      for(let i = 0; i < layout.getNumSpeciesGlyphs(); i++){
        let speciesGlyph = layout.specglyphs[i];
        speciesGlyphIdSpeciesIdMap.set(speciesGlyph.getId(), speciesGlyph.getSpeciesId());
        let bbox = speciesGlyph.getBoundingBox();
        let data = {id: speciesGlyph.getId(), label: speciesMap.get(speciesGlyph.getSpeciesId())[0], compref: speciesMap.get(speciesGlyph.getSpeciesId())[1],
          sboTerm: speciesMap.get(speciesGlyph.getSpeciesId())[2], width: bbox.width, height: bbox.height};
        let position = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
        speciesNodeMap.set(speciesGlyph.getId(), {"data": data, "position": position, "group": "nodes", "classes": "species"});
        if(speciesMap.get(speciesGlyph.getSpeciesId())[2] == 253 || speciesMap.get(speciesGlyph.getSpeciesId())[2] == 289) {
          compoundMap.set(speciesGlyph.getId(), [bbox.x, bbox.y, bbox.width, bbox.height, bbox.width*bbox.height]);
        }
      }

      let reactionMap = new Map();
      let reactionNodeMap = new Map();
      let reactionSpeciesModifierMap = new Map();

      // traverse reactions
      for(let i = 0; i < model.getNumReactions(); i++){
        let reaction = model.getReaction(i);
        reactionMap.set(reaction.getId(), [reaction.getName(), reaction.getSBOTerm()]);
        reactionSpeciesModifierMap.set(reaction.getId(), {});
        // fill reactionSpeciesModifierMap
        for(let l = 0; l < reaction.getNumModifiers(); l++){
          let modifier = reaction.getModifier(l);
          reactionSpeciesModifierMap.get(reaction.getId())[modifier.getSpecies()] = modifier.getSBOTerm();
        }            
      }

      // traverse reaction glyphs
      for(let i = 0; i < layout.getNumReactionGlyphs(); i++){
        let reactionGlyph = layout.getReactionGlyph(i);
        let data = {id: reactionGlyph.getReactionId(), label: reactionMap.get(reactionGlyph.getReactionId())[0], sboTerm: reactionMap.get(reactionGlyph.getReactionId())[1],
          width: 15, height: 15};
        let position = {x: reactionGlyph.getCurve().getCurveSegment(0).getStart().x() + 10, y: reactionGlyph.getCurve().getCurveSegment(0).getStart().y() + 10};
        reactionNodeMap.set(reactionGlyph.getReactionId(), {"data": data, "position": position, "group": "nodes", "classes": "reaction"});

        // add edges
        for(let j = 0; j < reactionGlyph.getNumSpeciesReferenceGlyphs(); j++){
          let speciesReferenceGlyph = reactionGlyph.getSpeciesReferenceGlyph(j);
          let role = speciesReferenceGlyph.getRole();
          if(role === 1 || role === 3) {
            let edgeData = {id: reactionGlyph.getReactionId() + "_" + speciesReferenceGlyph.getSpeciesGlyphId(), source: speciesReferenceGlyph.getSpeciesGlyphId(), target: reactionGlyph.getReactionId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "reactantEdge"});
          }
          else if(role === 2 || role === 4) {
            let edgeData = {id: speciesReferenceGlyph.getSpeciesGlyphId() + "_" + reactionGlyph.getReactionId(), source: reactionGlyph.getReactionId(), target: speciesReferenceGlyph.getSpeciesGlyphId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "productEdge"});
          }
          else if(role === 5 || role === 6 || role === 7) {
            let edgeData = {id: speciesReferenceGlyph.getSpeciesGlyphId() + "_" + reactionGlyph.getReactionId(), source: speciesReferenceGlyph.getSpeciesGlyphId(), target: reactionGlyph.getReactionId(), 
              sboTerm: reactionSpeciesModifierMap.get(reactionGlyph.getReactionId())[speciesGlyphIdSpeciesIdMap.get(speciesReferenceGlyph.getSpeciesGlyphId())]};
            edgeArray.push({"data": edgeData, "group": "edges"});
          }
          else {
            let edgeData = {id: reactionGlyph.getReactionId() + "_" + speciesReferenceGlyph.getSpeciesGlyphId(), source: reactionGlyph.getReactionId(), target: speciesReferenceGlyph.getSpeciesGlyphId(), 
              sboTerm: reactionSpeciesModifierMap.get(reactionGlyph.getReactionId())[speciesGlyphIdSpeciesIdMap.get(speciesReferenceGlyph.getSpeciesGlyphId())]};
            edgeArray.push({"data": edgeData, "group": "edges"});          
          }        
        }
      }

      // infer nesting
      let areaMap = new Map();
      compoundMap.forEach(function(value, key){
        areaMap.set(key, value[4]);
      });
      let sortedAreaMap = new Map([...areaMap.entries()].sort((a, b) => a[1] - b[1]));

      function contains(a, b) {
        return !(
          b.x1 <= a.x1 ||
          b.y1 <= a.y1 ||
          b.x2 >= a.x2 ||
          b.y2 >= a.y2
        );
      };

      let mergedMap = new Map([...compartmentNodeMap, ...speciesNodeMap, ...reactionNodeMap]);
      let finalNodeArray = [];
      mergedMap.forEach(function(value, key) {
        let nodeId = key;
        let nodeRect = {x1: value["position"].x - value["data"].width / 2,
          y1: value["position"].y - value["data"].height / 2,
          x2: value["position"].x + value["data"].width / 2,
          y2: value["position"].y + value["data"].height / 2
        };
        let isFound = false;
        sortedAreaMap.forEach(function(value, key) {
          let compoundRect = {x1: compoundMap.get(key)[0],
            y1: compoundMap.get(key)[1],
            x2: compoundMap.get(key)[0] + compoundMap.get(key)[2],
            y2: compoundMap.get(key)[1] + compoundMap.get(key)[3]
          };
          if(contains(compoundRect, nodeRect) && !isFound) {
            mergedMap.get(nodeId)["data"]["parent"] = key;
            isFound = true;
          }
        });
        finalNodeArray.push(value);
      });

      result = finalNodeArray.concat(edgeArray);
      return result;
    }
    else {
      // add compartments, species and reactions
      sbmlToJson.addCompartments(model);
      sbmlToJson.addSpecies(model, cytoscapeJsNodes);
      console.log("resultJson after adding species", resultJson )
      sbmlToJson.addReactions(model, cytoscapeJsEdges,cytoscapeJsNodes );


      let result = resultJson;
      cytoscapeJsGraph.nodes = cytoscapeJsNodes
      cytoscapeJsGraph.edges = cytoscapeJsEdges
      resultJson = [];
      
      speciesCompartmentMap = new Map;
      return cytoscapeJsGraph;
    }
    
  };


// add compartment nodes
sbmlToJson.addCompartments = function (model) {
  
  for(let i = 0; i < model.getNumCompartments(); i++){
    let compartment = model.getCompartment(i);
    if(compartment.getId() !== "default") {
    let compartmentData = {"id": compartment.getId(), "label": compartment.getName()};
      resultJson.push({"data": compartmentData, "group": "nodes", "classes": "compartment"});
    }
  }
};

// add species nodes
sbmlToJson.addSpecies = function(model, cytoscapeJsNodes) {

  for(let i = 0; i < model.getNumSpecies(); i++){
    let species = model.getSpecies(i);
    speciesCompartmentMap.set(species.getId(), species.getCompartment());
    let speciesData = {"id": species.getId(), "label": species.getName(), "parent": species.getCompartment(), "sboTerm": species.getSBOTerm()};
    resultJson.push({"data": speciesData, "group": "nodes", "classes": "species"});
  }

  //Now create different model
  sbmlToJson.addJSNodes(resultJson,cytoscapeJsNodes)
  
};

sbmlToJson.addJSNodes = function(resultJson,cytoscapeJsNodes) {

  for(let i = 0; i < resultJson.length; i++){
    if ( resultJson[i].group == 'nodes' || resultJson[i].classes == 'species' )
    {
      var nodeObj = {};
      var styleObj = {};
      var tempBbox = {};
      tempBbox.x = 0;
      tempBbox.y = 0;
      tempBbox.w = 30;
      tempBbox.h = 30;
      var sboTerm = resultJson[i].data.sboTerm;
      console.log("sboterm", sboTerm)
      if(sboToNodeClass[sboTerm])
      {
        nodeObj.class = sboToNodeClass[sboTerm]
      }
      else 
      {
        nodeObj.class = "simple molecule"
        tempBbox.w = 50
        tempBbox.h = 30
      }
      nodeObj.id = resultJson[i].data.id
      console.log("nodeObj.class", nodeObj.class)

      nodeObj.bbox = tempBbox;   
      nodeObj.label = resultJson[i].data.label;
      nodeObj.statesandinfos = {};
      var cytoscapeJsNode = {data: nodeObj, style: styleObj};
      elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
      console.log("nodeObj",nodeObj)
      cytoscapeJsNodes.push(cytoscapeJsNode)
    }
  }
  
};
sbmlToJson.addReactions = function(model, cytoscapeJsEdges, cytoscapeJsNodes) {
  for(let i = 0; i < model.getNumReactions(); i++){

    let reaction = model.getReaction(i);
    let reactionParentMap = new Map();

    // add reactant->reaction edges
    for(let j = 0; j < reaction.getNumReactants(); j++){
      let reactant = reaction.getReactant(j);
      let reactantEdgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": reaction.getId()};
      resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "reactantEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(reactant.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);
    }
    
    // add reaction->product edges
    for(let k = 0; k < reaction.getNumProducts(); k++){
      let product = reaction.getProduct(k);
      let productEdgeData = {"id": reaction.getId() + '_' + product.getSpecies(), "source": reaction.getId(), "target": product.getSpecies()};
      resultJson.push({"data": productEdgeData, "group": "edges", "classes": "productEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(product.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);      
    }
    
    // add modifier->reaction edges
    for(let l = 0; l < reaction.getNumModifiers(); l++){
      let modifier = reaction.getModifier(l);
      let modifierEdgeData = {"id": modifier.getSpecies() + '_' + reaction.getId(), "source": modifier.getSpecies(), "target": reaction.getId(), "sboTerm": modifier.getSBOTerm()};
      resultJson.push({"data": modifierEdgeData, "group": "edges", "classes": "modifierEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(modifier.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);      
    }

    // add reaction node
    let parent = reaction.getCompartment();
    if(!parent) {
      // find the max occurrence
      var max_count = 0, result = -1;
      reactionParentMap.forEach((value, key) => {
          if (max_count < value) {
              result = key;
              max_count = value;
          }
      });
      parent = result;
    }
    
    let reactionData = {"id": reaction.getId(), "label": reaction.getName(), "parent": parent};
    reactionData.width = 15;
    reactionData.height = 15;
    resultJson.push({"data": reactionData, "group": "nodes", "classes": "reaction"});    
  }  

  console.log("resultJson after addinf reactions", resultJson)
  sbmlToJson.addJSEdges(resultJson, cytoscapeJsNodes, cytoscapeJsEdges)

};

sbmlToJson.addJSEdges= function(resultJson, cytoscapeJsNodes, cytoscapeJsEdges)
{
  var classNameEdge1 = "consumption";
  var classNameEdge2 = "production";
  for(let i = 0; i < resultJson.length; i++){
    if( resultJson[i].group == 'nodes' && resultJson[i].classes == "reaction")
    {
      sbmlToJson.addNodes("process", cytoscapeJsNodes, resultJson[i].data )

    }
    if ( resultJson[i].group == 'edges')
    {
        var edgeObj = {};
        var styleObj = {};
        edgeObj.source = resultJson[i].data.source; //Is this the label or id?
        if (resultJson[i].classes == "reactantEdge")
        {
          edgeObj.class = classNameEdge1;
        }
        else
        {
          edgeObj.class = classNameEdge2;
        }
        edgeObj.id = resultJson[i].data.id
        edgeObj.target = resultJson[i].data.target;
        elementUtilities.extendEdgeDataWithClassDefaults( edgeObj, edgeObj.class );
        var cytoscapeJsEdge1 = {data: edgeObj, style: styleObj};
        cytoscapeJsEdges.push(cytoscapeJsEdge1)
    }
  }
}

//This function is used to add more nodes(process, association, dissociation) when itterating through the reactions. 
sbmlToJson.addNodes = function(node_class, cytoscapeJsNodes, data) { 
    var nodeObj = {};
    var styleObj = {};
    var tempBbox = {};
    tempBbox.x = 0
    tempBbox.y = 0
    tempBbox.w = data.width;
    tempBbox.h = data.height;
    nodeObj.class = node_class
    nodeObj.id = data.id
    nodeObj.bbox = tempBbox; 
    nodeObj.statesandinfos = {};
    var ports = [];
    ports.push({
      id: 1,
      x: 0,
      y: 0
    });
  

    nodeObj.ports = ports;

    var cytoscapeJsNode = {data: nodeObj, style: styleObj};
    elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
    cytoscapeJsNodes.push(cytoscapeJsNode)
    return nodeObj.id;
}
sbmlToJson.mapPropertiesToObj = function() {
  /*
  if (this.map.extension && this.map.extension.has('mapProperties')) { // render extension was found
     var xml = this.map.extension.get('mapProperties');
     var obj;
     parseString(xml, function (err, result) {
        obj = result;
     });
     return obj;
  }else{
      
        return {mapProperties : {compoundPadding : mainUtilities.getCompoundPadding()}};
      }
      */
     return {};
  
};
return sbmlToJson;
};



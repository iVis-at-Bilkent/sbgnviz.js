
var parseString = require("xml2js").parseString;
var libUtilities = require("./lib-utilities");
var libs = libUtilities.getLibs();
var jQuery = ($ = libs.jQuery);
var classes = require("./classes");

module.exports = function () {
  var elementUtilities, graphUtilities, handledElements, mainUtilities, libsbmlInstance;
  let resultJson = [];
  let speciesCompartmentMap = new Map;

  function sbmlToJson(param) {
    optionUtilities = param.optionUtilities;
    options = optionUtilities.getOptions();
    elementUtilities = param.elementUtilities;
    graphUtilities = param.graphUtilities;
    mainUtilities = param.mainUtilities;
    libsbmlInstance = param.libsbmlInstance;

    handledElements = {};

    elementUtilities.elementTypes.forEach(function (type) {
      handledElements[type] = true;
    });
  }

  var sboToNodeClass = {
    278: "rna",
    253: "complex sbml",
    289: "hypothetical complex",
    291: "degradation",
    298: "drug",
    243: "gene",
    252: "protein",
    327: "ion",
    284: "ion channel",
    358: "phenotype sbml",
    244: "receptor",
    247: "simple molecule", 
    248: "truncated protein",
    285: "unknown molecule",
    173: "and",
    174: "or",
    238: "not",
    398: "unknown logical operator"
  }

  var sboToEdgeClass = {
    536: "unknown inhibition",
    462: "unknown catalysis",
    171: "positive influence sbml",
    407: "negative influence",
    344: "reduced modulation",
    411: "reduced stimulation",
    168: "reduced trigger",
    169: "unknown negative influence",
    172: "unknown positive influence",
    170: "unknown reduced stimulation",
    342: "unknown reduced modulation",
    205: "unknown reduced trigger",
    594: "modulation",
    459: "stimulation",
    13: "catalysis",
    537: "inhibition",
    461: "trigger",
    185: "transport"
  }

  //Set of modifiers
  const modifiers = new Set();
  modifiers.add("catalysis");
  modifiers.add("inhibition");
  modifiers.add("modulation");
  modifiers.add("stimulation");
  modifiers.add("trigger");
  modifiers.add("unknown catalysis");
  modifiers.add("unknown inhibition");


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
    elementUtilities.mapType = 'SBML';


      //var xmlString = new XMLSerializer().serializeToString(xmlObject);
      let reader = new libsbmlInstance.SBMLReader();
    
      // get document and model from sbml text
      let doc = reader.readSBMLFromString(xmlString);
      model = doc.getModel();

    //let result = []; 
    
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
          let data = {id: compartmentGlyph.getCompartmentId(), class: "compartment", label: compartmentMap.get(compartmentGlyph.getCompartmentId()),
            width: bbox.width, height: bbox.height, bbox: {x: 0, y: 0, w: bbox.width, h: bbox.height}, statesandinfos: []};
            var ports = [];
            ports.push({
              id: data.id +".1",
              x: -70,
              y: 0
            });
            ports.push({
              id: data.id +".2",
              x: 70,
              y: 0
            });
        

            data.ports = ports;
          elementUtilities.extendNodeDataWithClassDefaults( data, data.class );
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
        let data = {id: speciesGlyph.getId(), class: sboToNodeClass[speciesMap.get(speciesGlyph.getSpeciesId())[2]],label: speciesMap.get(speciesGlyph.getSpeciesId())[0], compref: speciesMap.get(speciesGlyph.getSpeciesId())[1],
          sboTerm: speciesMap.get(speciesGlyph.getSpeciesId())[2], width: bbox.width, height: bbox.height, bbox: {x: 0, y: 0, w: bbox.width, h: bbox.height}, statesandinfos: []};
          var ports = [];
            ports.push({
              id: data.id +".1",
              x: -70,
              y: 0
            });
            ports.push({
              id: data.id +".2",
              x: 70,
              y: 0
            });
        

            data.ports = ports;
        elementUtilities.extendNodeDataWithClassDefaults( data, data.class );
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
          width: 15, height: 15, bbox: {x: 0, y: 0, w: 15, h: 15}, statesandinfos: [] };
          //elementUtilities.extendNodeDataWithClassDefaults( data, data.class );

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
     /*  
      var extraNodes = []
     sbmlToJson.addReactions(model, edgeArray, extraNodes );
      var newNodesMap = new Map();

      //Create map from extraNodes
      for (let k = 0; k <extraNodes.length; k++)
      {
        newNodesMap[extraNodes.data.id] = extraNodes.data;
      }
      */

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

      let mergedMap = new Map([...compartmentNodeMap, ...speciesNodeMap, ... reactionNodeMap]);
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

      sbmlToJson.addCompartments(model, cytoscapeJsNodes);
      sbmlToJson.addSpecies(model, cytoscapeJsNodes);
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
sbmlToJson.addCompartments = function (model,cytoscapeJsNodes) {
  
  for(let i = 0; i < model.getNumCompartments(); i++){
    let compartment = model.getCompartment(i);
    if(compartment.getId() !== "default") {
    let compartmentData = {"id": compartment.getId(), "label": compartment.getName(), "class": "compartment"};
      resultJson.push({"data": compartmentData, "group": "nodes", "classes": "compartment"});
    }
  }
  sbmlToJson.addJSCompartments(resultJson, cytoscapeJsNodes);
};

sbmlToJson.addJSCompartments = function(resultJson, cytoscapeJsNodes)
{
  for(let i = 0; i < resultJson.length; i++){
    if ( resultJson[i].group == 'nodes' && resultJson[i].classes == "compartment" )
    {
      var nodeObj = {};
      var styleObj = {};
      var tempBbox = {};
      nodeObj.class = "compartment"
      tempBbox.x = 0;
      tempBbox.y = 0;
      tempBbox.w = 60;
      tempBbox.h = 60;
      nodeObj.id = resultJson[i].data.id

      nodeObj.bbox = tempBbox;   
      nodeObj.label = resultJson[i].data.label;
      nodeObj.statesandinfos = [];

      var ports = [];
      ports.push({
        id: nodeObj.id +".1",
        x: -70,
        y: 0
      });
      ports.push({
        id: nodeObj.id +".2",
        x: 70,
        y: 0
      });
        

      nodeObj.ports = ports;
      if(resultJson[i].data.parent)
      {
        nodeObj.parent = resultJson[i].data.parent;
      }
      var cytoscapeJsNode = {data: nodeObj, style: styleObj};
      elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
      cytoscapeJsNodes.push(cytoscapeJsNode)
    }
  }
}

// add species nodes
sbmlToJson.addSpecies = function(model, cytoscapeJsNodes) {

  for(let i = 0; i < model.getNumSpecies(); i++){
    let species = model.getSpecies(i);
    speciesCompartmentMap.set(species.getId(), species.getCompartment());
    var sboTerm = species.getSBOTerm();
    let speciesData = {"id": species.getId(), "label": species.getName(), "parent": species.getCompartment(), "sboTerm": species.getSBOTerm()};
    resultJson.push({"data": speciesData, "group": "nodes", "classes": "species"});
  }

  //Now create different model
  sbmlToJson.addJSNodes(resultJson,cytoscapeJsNodes)
  
};

sbmlToJson.addJSNodes = function(resultJson,cytoscapeJsNodes) {

  for(let i = 0; i < resultJson.length; i++){
    if ( resultJson[i].group == 'nodes' && resultJson[i].classes == 'species' )
    {
      var nodeObj = {};
      var styleObj = {};
      var tempBbox = {};
      tempBbox.x = 0;
      tempBbox.y = 0;
      tempBbox.w = 50;
      tempBbox.h = 30;

      var sboTerm = resultJson[i].data.sboTerm;
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
      //Check if node should have same height and same width
      if(sbmlToJson.mustBeSquare(nodeObj.class) && !sbmlToJson.complexOrPhenotype(nodeObj.class))
      {
        tempBbox.w = 20
        tempBbox.h = 20
      }
      else if(sbmlToJson.mustBeSquare(nodeObj.class) && sbmlToJson.complexOrPhenotype(nodeObj.class))
      {
        tempBbox.w = 50
        tempBbox.h = 50
      }

      nodeObj.id = resultJson[i].data.id

      nodeObj.bbox = tempBbox;   
      nodeObj.label = resultJson[i].data.label;
      nodeObj.statesandinfos = [];
      nodeObj.parent = resultJson[i].data.parent;
      var ports = [];
      ports.push({
        id: nodeObj.id +".1",
        x: -70,
        y: 0
      });
      ports.push({
        id: nodeObj.id +".2",
        x: 70,
        y: 0
      });
        

      nodeObj.ports = ports;
      var cytoscapeJsNode = {data: nodeObj, style: styleObj};
      elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
      cytoscapeJsNodes.push(cytoscapeJsNode)
    }
  }
  
};
sbmlToJson.mustBeSquare = function(className)
{
  return (className == "ion" || className == "degradation" || className == "complex sbml" || className == "phenotype sbml")
}
sbmlToJson.complexOrPhenotype = function(className)
{
  return (className == "complex sbml" || className == "phenotype sbml")
}

sbmlToJson.getDataOfNode = function(nodeId)
{
  for( let i = 0; i < resultJson.length; i++)
  {
    var currentObj = resultJson[i]
    if (currentObj.group = "nodes" && currentObj.classes == "species" && currentObj.data.id == nodeId)
    {
      return currentObj.data;
    }
  }
}
//Check if the source and target is in a common compartment
//If so returns that compartment id
sbmlToJson.checkSourceTargetInCompartement = function(sourceId, targetId)
{
  var sourceData = sbmlToJson.getDataOfNode(sourceId);
  var targetData = sbmlToJson.getDataOfNode(targetId);
  if(sourceData.parent == targetData.parent)
  {
    return sourceData.parent;
  }
  else
  {
    return null;
  }
};

//This function checks if a process nodes has both source and target
sbmlToJson.checkIfTargetAndSourceExist = function(processId, resultJson)
{
  var hasSource = false;
  var hasTarget = false;
  for( let i = 0; i < resultJson.length; i++)
  {
    var currentObj = resultJson[i]
   
    if (currentObj.group = "edges" )
    {
    
      if (currentObj.data.source == processId)
      {
        hasTarget = true;
      }
      if (currentObj.data.target == processId)
      {
        hasSource = true;
      }
    }
  }
  if(hasSource && hasTarget)
  {
    return;
  }
  if(!hasSource)
  {
    let degradation = {"id": 'degradation' + processId, "class": "degradation"};
    degradation.width = 15;
    degradation.height = 15;
    resultJson.push({"data": degradation, "group": "nodes", "classes": "degradation"});  
    let reactantEdgeData = {"id": 'degradation_' + processId, "source": 'degradation' + processId, "target": processId, "class": "consumption"};
    resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "forDegradation"});
  }
  if(!hasTarget)
  {
    let degradation = {"id": 'degradation' + processId, "class": "degradation"};
    degradation.width = 15;
    degradation.height = 15;
    resultJson.push({"data": degradation, "group": "nodes", "classes": "degradation"});  
    let reactantEdgeData = {"id": 'degradation_' + processId, "source": processId, "target": 'degradation' + processId, "class": "production"};
    resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "forDegradation"});
  }
}
sbmlToJson.addReactions = function(model, cytoscapeJsEdges, cytoscapeJsNodes) {
  for(let i = 0; i < model.getNumReactions(); i++){

    let reaction = model.getReaction(i);
    let reactionParentMap = new Map();
    var edgeClass1 = null;
    var edgeClass2 = null;
    var nodeClass = null;
    var reducedNotation = false;
    var logicalBoolean = false;

    //Map sbo term if exists
    var sboTermReaction = reaction.getSBOTerm();
    if(sboToEdgeClass[sboTermReaction])
    {
      edgeClass1 = sboToEdgeClass[sboTermReaction]
      reducedNotation = true;
    }
    else if (sboTwoEdgeOneNodeClass[sboTermReaction])
    {
      edgeClass1 = sboTwoEdgeOneNodeClass[sboTermReaction][0];
      nodeClass = sboTwoEdgeOneNodeClass[sboTermReaction][1];
      edgeClass2 = sboTwoEdgeOneNodeClass[sboTermReaction][2];
    } else if (sboTermReaction == 177)
    {
      let association = {"id": 'association_' + reaction.getId(), "class": "association"};
      association.width = 15;
      association.height = 15;
      resultJson.push({"data": association, "group": "nodes", "classes": "reaction"});    
    }
    else if (sboTermReaction == 180)
    {
      let dissociation = {"id": 'dissociation_' + reaction.getId(), "class": "dissociation"};
      dissociation.width = 15;
      dissociation.height = 15;
      resultJson.push({"data": dissociation, "group": "nodes", "classes": "reaction"});    
    }
    else if (sboTermReaction == 178)
    {
      nodeClass = 'truncated process'
    }
    else if(sboTermReaction == 397) //397 stands for reduced notation in CD but does not specify which one. Positive influence is used for default
    {
      edgeClass1 = "positive influence sbml"
      reducedNotation = true;
    } else if(sboTermReaction == 231 ) //231 stand for boolean logic reactions in CD but does not specify which one. And logical gate will be used for default
    {
      logicalBoolean = true;
      nodeClass = 'and'
    }
    else if(sboTermReaction == 173 ) 
    {
      logicalBoolean = true;
      nodeClass = 'and'
    }
    else if(sboTermReaction == 174 ) 
    {
      logicalBoolean = true;
      nodeClass = 'or'
    }
    else if(sboTermReaction == 238 ) 
    {
      logicalBoolean = true;
      nodeClass = 'not'
    }
    else if(sboTermReaction == 398 ) 
    {
      logicalBoolean = true;
      nodeClass = 'unknown logical operator'
    }



    if (reducedNotation)
    {
      let reactant = reaction.getReactant(0);
      let product = reaction.getProduct(0); 
      let edgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": product.getSpecies(), "class": edgeClass1};
      resultJson.push({"data": edgeData, "group": "edges", "classes": "reducedNotation"});
      continue;
    }
    if(logicalBoolean)
    {
      //Get parents
      let parent = reaction.getCompartment();

      //Add boolean logic node
      let boolNode = {"id": nodeClass+"_"+reaction.getId(), "label":"", "parent": parent, "class": nodeClass};
      boolNode.width = 15;
      boolNode.height = 15;
      resultJson.push({"data": boolNode, "group": "nodes", "classes": "boolean"}); 

      for(let j = 0; j < reaction.getNumReactants(); j++){
        let reactant = reaction.getReactant(j);
        let reactantEdgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": nodeClass+"_"+reaction.getId(), "class": "consumption"};
        resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "reactantEdge"});
      }
    
      let product = reaction.getProduct(0);
      let reactantEdgeData = {"id": product.getSpecies() + '_' + reaction.getId(), "source": nodeClass+"_"+reaction.getId(), "target": product.getSpecies(), "class": "reduced trigger"};
      resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "reactantEdge"});
      continue;

    }
  
    // add reactant->reaction edges
    for(let j = 0; j < reaction.getNumReactants(); j++){
      let reactant = reaction.getReactant(j);
      let reactantEdgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": reaction.getId()};
      if (edgeClass1) 
      {
        reactantEdgeData.class = edgeClass1;
      }
      if(sboTermReaction == 177)
      {
        reactantEdgeData.target = 'association_' + reaction.getId()
        
      }      

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
      if (edgeClass1) 
      {
        productEdgeData.class = edgeClass2;
      }
      if(sboTermReaction == 180)
      {
        productEdgeData.source = "dissociation_"+reaction.getId()
      }
      if(sboTermReaction == 231)
      {
        productEdgeData.class = "trigger"
      }
      resultJson.push({"data": productEdgeData, "group": "edges", "classes": "productEdge"});

      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(product.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);      
    }

    let reactionData = {"id": reaction.getId(), "label": reaction.getName(), "parent": parent};
    reactionData.width = 15;
    reactionData.height = 15;
    if(nodeClass)
    {
      reactionData.class = nodeClass
    }
    resultJson.push({"data": reactionData, "group": "nodes", "classes": "reaction"}); 
    ///sbmlToJson.checkIfTargetAndSourceExist(reaction.getId(), resultJson);
    
    // add modifier->reaction edges
    for(let l = 0; l < reaction.getNumModifiers(); l++){
      let modifier = reaction.getModifier(l);
      var sboTerm = modifier.getSBOTerm();
      var metaId = modifier.getMetaId();
      let modifierEdgeData = {"id": modifier.getSpecies() + '_' + reaction.getId(), "source": modifier.getSpecies(), "target": reaction.getId(), "sboTerm": modifier.getSBOTerm()};
      if(sboToEdgeClass[sboTerm])
      {
  
        modifierEdgeData.class = sboToEdgeClass[sboTerm];
      }

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


    //Add extra noded
    if (sboTermReaction == 177)
    {
      var extraNode = {"id": 'association_' + reaction.getId(), "class": "association", "parent": parent};
      extraNode.width = 15;
      extraNode.height = 15;
      resultJson.push({"data": extraNode, "group": "nodes", "classes": "reaction"});    
    }
    else if (sboTermReaction == 180)
    {
      var extraNode = {"id": 'dissociation_' + reaction.getId(), "class": "dissociation", "parent": parent};
      extraNode.width = 15;
      extraNode.height = 15;
      resultJson.push({"data": extraNode, "group": "nodes", "classes": "reaction"});    
    }


    
    //Add extra edges
    if(sboTermReaction == 177)
    {
      var extraEdge = {"id": 'association_' + reaction.getId() + '_' + reaction.getId(), "source": 'association_' + reaction.getId(), "target": reaction.getId(), "class": "consumption"}
      resultJson.push({"data": extraEdge, "group": "edges", "classes": "extra"});
    }
    else if(sboTermReaction == 180)
    {
      var extraEdge = {"id": 'dissociation_' + reaction.getId() + '_' + reaction.getId(), "source":  reaction.getId(), "target": "dissociation_"+reaction.getId(), "class": "consumption"}
      resultJson.push({"data": extraEdge, "group": "edges", "classes": "extra"});

    }
  }  

  sbmlToJson.addJSEdges(resultJson, cytoscapeJsNodes, cytoscapeJsEdges)

};

sbmlToJson.addJSEdges= function(resultJson, cytoscapeJsNodes, cytoscapeJsEdges)
{
  //Default values
  var classNameEdge1 = "consumption"; //Reactant
  var classNameEdge2 = "production"; //Product
  var classNameEdge3 = "catalysis";  //Modifier

  for(let i = 0; i < resultJson.length; i++){
    
    if( resultJson[i].group == 'nodes' && ( resultJson[i].classes == "reaction" || resultJson[i].classes == "degradation" || resultJson[i].classes == "boolean"))
    {
      sbmlToJson.addNodes(cytoscapeJsNodes, resultJson[i].data )

    }
  }
  //Create map-  nodeId: nodeClass
  let nodeIdClass = {}
  for(let i = 0; i < cytoscapeJsNodes.length; i++)
  {
    let currentNodeData = cytoscapeJsNodes[i].data;
    nodeIdClass[currentNodeData.id] = currentNodeData.class;
  }

  for(let i = 0; i < resultJson.length; i++){
    if ( resultJson[i].group == 'edges')
    {
        var edgeObj = {};
        var styleObj = {};
        edgeObj.source = resultJson[i].data.source; //Is this the label or id?
        if(nodeIdClass[edgeObj.source] && sbmlToJson.isProcessNode(nodeIdClass[edgeObj.source]) || sbmlToJson.isLogicalOperator(nodeIdClass[edgeObj.source]) || sbmlToJson.isAssocOrDissoc(nodeIdClass[edgeObj.source]))
        {
          edgeObj.portsource = resultJson[i].data.source+".1"
        }
        if (resultJson[i].classes == "reactantEdge")
        {
          if (resultJson[i].data.class)
          {
            edgeObj.class = resultJson[i].data.class;
          }
          else
          {
            edgeObj.class = classNameEdge1;
          }
        }
        else if(resultJson[i].classes == "modifierEdge")
        {
          if (resultJson[i].data.class)
          {
            edgeObj.class = resultJson[i].data.class;
          }
          else
          {
            edgeObj.class = classNameEdge3;
          }
        }
        else 
        {
          if (resultJson[i].data.class)
          {
            edgeObj.class = resultJson[i].data.class;
          }
          else
          {
            edgeObj.class = classNameEdge2;
          }
        }
    
        edgeObj.id = resultJson[i].data.id
        edgeObj.target = resultJson[i].data.target;
        if(!modifiers.has(edgeObj.class)  && nodeIdClass[edgeObj.target] && (sbmlToJson.isProcessNode(nodeIdClass[edgeObj.target]) || sbmlToJson.isLogicalOperator(nodeIdClass[edgeObj.target]) || sbmlToJson.isAssocOrDissoc(nodeIdClass[edgeObj.target])))
        {
          edgeObj.porttarget = edgeObj.target + ".2"
        }
        elementUtilities.extendEdgeDataWithClassDefaults( edgeObj, edgeObj.class );
        var cytoscapeJsEdge1 = {data: edgeObj, style: styleObj};
        cytoscapeJsEdges.push(cytoscapeJsEdge1)
    }
  }
}
sbmlToJson.isProcessNode = function( nodeClass) { 
  return nodeClass.startsWith("process");
}

sbmlToJson.isLogicalOperator = function( nodeClass) { 
  return nodeClass == "or" || nodeClass == "not" || nodeClass == "and" || nodeClass == "unknown logical operator";
}

sbmlToJson.isAssocOrDissoc = function( nodeClass) { 
  return nodeClass == "association" || nodeClass == "dissociation";
}

//This function is used to add more nodes(process, association, dissociation) when itterating through the reactions. 
sbmlToJson.addNodes = function( cytoscapeJsNodes, data) { 
    var nodeObj = {};
    var styleObj = {};
    var tempBbox = {};
    var className = "process"
    if(data.class)
    {
      className = data.class;
    }
    tempBbox.x = 0
    tempBbox.y = 0
    tempBbox.w = data.width;
    tempBbox.h = data.height;
    nodeObj.class = className;
    nodeObj.id = data.id
    nodeObj.bbox = tempBbox; 
    nodeObj.statesandinfos = [];
    var ports = [];
    ports.push({
      id: nodeObj.id +".1",
      x: -70,
      y: 0
    });
    ports.push({
      id: nodeObj.id +".2",
      x: 70,
      y: 0
    });
  

    nodeObj.ports = ports;
    nodeObj.parent = data.parent;

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



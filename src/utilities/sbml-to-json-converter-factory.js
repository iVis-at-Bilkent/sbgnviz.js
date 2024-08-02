
var parseString = require("xml2js").parseString;
var libUtilities = require("./lib-utilities");
var libs = libUtilities.getLibs();
var jQuery = ($ = libs.jQuery);
var classes = require("./classes");

module.exports = function () {
  var elementUtilities, graphUtilities, handledElements, mainUtilities, libsbmlInstance;
  let resultJson = [];
  let speciesCompartmentMap = new Map;
  let layout;

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
    397: ["consumption", "omitted process", "production"] //Known transition omitted
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


    let reader = new libsbmlInstance.SBMLReader();
    let doc = reader.readSBMLFromString(xmlString);
    model = doc.getModel();

    let plugin;
    try {
      plugin = model.findPlugin('layout');
    }
    catch(err) {
      plugin = undefined;
    }

    let layoutplugin;    
    if(plugin) {
      layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
      layout = layoutplugin.layouts[0];
    }   

     
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
  };


// add compartment nodes
sbmlToJson.addCompartments = function (model,cytoscapeJsNodes) {
  compartmentMap = new Map();
  for(let i = 0; i < model.getNumCompartments(); i++){
    let compartment = model.getCompartment(i);
    compartmentMap.set(compartment.getId(), i);
    if(compartment.getId() !== "default") {
    let compartmentData = {"id": compartment.getId(), "label": compartment.getName(), "class": "compartment"};
      resultJson.push({"data": compartmentData, "group": "nodes", "classes": "compartment"});
    }
  }
  sbmlToJson.addJSCompartments(compartmentMap, resultJson, cytoscapeJsNodes);
};

sbmlToJson.addJSCompartments = function(compartmentMap, resultJson, cytoscapeJsNodes)
{
  for(let i = 0; i < resultJson.length; i++){
    if ( resultJson[i].group == 'nodes' && resultJson[i].classes == "compartment" )
    {
      var nodeObj = {};
      var styleObj = {};
      var tempBbox = {};
      nodeObj.class = "compartment"

      if (layout){
        let compartmentGlyph = layout.getCompartmentGlyph(compartmentMap.get(resultJson[i].data.id));
        let boundingBox = compartmentGlyph.getBoundingBox();
        tempBbox.x = boundingBox.x + boundingBox.width / 2;
        tempBbox.y = boundingBox.y + boundingBox.height / 2;
        tempBbox.w = boundingBox.width;
        tempBbox.h = boundingBox.height;
      }
      else {
      tempBbox.x = 0;
      tempBbox.y = 0;
      tempBbox.w = 60;
      tempBbox.h = 60;
      }
      nodeObj.id = resultJson[i].data.id

      nodeObj.bbox = tempBbox;   
      nodeObj.label = resultJson[i].data.label;
      nodeObj.statesandinfos = [];
      nodeObj.ports = [];
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
    let active = false, hypothetical = false, multimer = false;
    let bindingRegion = [], residueVariable = [], unitOfInfo = [];
    parseString(species.getAnnotationString(), function(err, result){
      if(!result)
        return;
      var stateBooleans = result.annotation["nwt:extension"][0]["nwt:info"][0].$;
      active = stateBooleans["nwt:active"] == "true" ? true : false;
      hypothetical = stateBooleans["nwt:hypothetical"] == "true" ? true : false;
      multimer = stateBooleans["nwt:multimer"] == "true" ? true : false;
      bindingRegion = result.annotation["nwt:extension"][0]["nwt:info"][0]["nwt:bindingregion"] || [];
      residueVariable = result.annotation["nwt:extension"][0]["nwt:info"][0]["nwt:residuevariable"] || [];
      unitOfInfo = result.annotation["nwt:extension"][0]["nwt:info"][0]["nwt:unitinfo"] || [];
    })
    speciesCompartmentMap.set(species.getId(), species.getCompartment());
    var sboTerm = species.getSBOTerm();
    let speciesData = {"id": species.getId(), "label": species.getName(), 
                      "parent": species.getCompartment(), "sboTerm": species.getSBOTerm(),
                      "active": active, "multimer": multimer, "hypothetical": hypothetical,
                      "bindingRegion": bindingRegion, "residueVariable": residueVariable, "unitOfInfo": unitOfInfo};
    resultJson.push({"data": speciesData, "group": "nodes", "classes": "species"});
  }
  let speciesGlyphIdSpeciesIdMap = new Map();
  if (layout) {
    // traverse species
    for(let i = 0; i < layout.getNumSpeciesGlyphs(); i++){
      let specGlyph = layout.specglyphs[i];
      speciesGlyphIdSpeciesIdMap.set(specGlyph.getSpeciesId() , i);
    }
  }
  //Now create different model
  sbmlToJson.addJSNodes(resultJson,cytoscapeJsNodes,speciesGlyphIdSpeciesIdMap);
};

sbmlToJson.addJSNodes = function(resultJson,cytoscapeJsNodes, speciesGlyphIdSpeciesIdMap) {
  for(let i = 0; i < resultJson.length; i++){
    if( resultJson[i].group != 'nodes' || resultJson[i].classes != 'species')
      continue;
    var nodeObj = {};
    var styleObj = {};
    var tempBbox = {};
    if (layout){
      specGlyphId = speciesGlyphIdSpeciesIdMap.get(resultJson[i].data.id);
      let speciesGlyph = layout.specglyphs[specGlyphId];
      let bbox = speciesGlyph.getBoundingBox();
      tempBbox.x = bbox.x + bbox.width / 2;
      tempBbox.y = bbox.y + bbox.height / 2;
      tempBbox.w = bbox.width;
      tempBbox.h = bbox.height;
    } else {
      tempBbox.x = 0;
      tempBbox.y = 0;
      tempBbox.w = 50;
      tempBbox.h = 30;
    }
    var sboTerm = resultJson[i].data.sboTerm;
    if(sboToNodeClass[sboTerm]) {
      nodeObj.class = sboToNodeClass[sboTerm]
    } else {
      nodeObj.class = "simple molecule"
      tempBbox.w = 50
      tempBbox.h = 30
    }
    //Check if node should have same height and same width
    if(sbmlToJson.mustBeSquare(nodeObj.class) && !sbmlToJson.complexOrPhenotype(nodeObj.class)) {
      tempBbox.w = 20
      tempBbox.h = 20
    } else if(sbmlToJson.mustBeSquare(nodeObj.class) && sbmlToJson.complexOrPhenotype(nodeObj.class)) {
      tempBbox.w = 50
      tempBbox.h = 50
    }
    
    nodeObj.id = resultJson[i].data.id

    nodeObj.bbox = tempBbox;   
    nodeObj.label = resultJson[i].data.label;
    nodeObj.statesandinfos = [];
    nodeObj.parent = resultJson[i].data.parent;
    nodeObj.ports = [];

    // State and Info Boxes
    var bindingRegions = resultJson[i].data.bindingRegion;
    for(let region of bindingRegions){
      let infoBox = classes.BindingRegion.construct(undefined, resultJson[i].data.id, undefined);
      infoBox.region.variable =  region._;
      infoBox.style = elementUtilities.getDefaultInfoboxStyle(nodeObj.class, "binding region");
      infoBox.bbox = {'x': parseFloat(region.$['nwt:x']), 'y': parseFloat(region.$['nwt:y']), 
                      'w': parseFloat(region.$['nwt:w']), 'h': parseFloat(region.$['nwt:h'])};
      nodeObj.statesandinfos.push(infoBox);
    }

    var residueVariables = resultJson[i].data.residueVariable;
    for(let residue of residueVariables){
      let infoBox = classes.ResidueVariable.construct(undefined, undefined, resultJson[i].data.id, undefined);
      infoBox.residue.variable =  residue._;
      infoBox.style = elementUtilities.getDefaultInfoboxStyle(nodeObj.class, "residue variable");
      infoBox.bbox = {'x': parseFloat(residue.$['nwt:x']), 'y': parseFloat(residue.$['nwt:y']), 
                      'w': parseFloat(residue.$['nwt:w']), 'h': parseFloat(residue.$['nwt:h'])};
      nodeObj.statesandinfos.push(infoBox);
    }

    var unitsOfInformation = resultJson[i].data.unitOfInfo;
    for(let unit of unitsOfInformation){
      let infoBox = classes.UnitOfInformation.construct(undefined, resultJson[i].data.id, undefined);
      infoBox.label.text = unit._;
      infoBox.style = elementUtilities.getDefaultInfoboxStyle(nodeObj.class, "unit of information");
      infoBox.bbox = {'x': parseFloat(unit.$['nwt:x']), 'y': parseFloat(unit.$['nwt:y']), 
                      'w': parseFloat(unit.$['nwt:w']), 'h': parseFloat(unit.$['nwt:h'])};
      nodeObj.statesandinfos.push(infoBox);
    }

    // Add status info
    if(resultJson[i].data.hypothetical)
      nodeObj.class = "hypothetical " + nodeObj.class;
    if(resultJson[i].data.active)
      nodeObj.class = "active " + nodeObj.class;
    if(resultJson[i].data.multimer)
      nodeObj.class = nodeObj.class + " multimer";

    var cytoscapeJsNode = {data: nodeObj, style: styleObj};
    elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
    cytoscapeJsNodes.push(cytoscapeJsNode);
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
    else if(sboTermReaction == 231 ) //231 stand for boolean logic reactions in CD but does not specify which one. And logical gate will be used for default
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

  let reactionGlyphMap = new Map();
  if(layout){
    for(let i = 0; i < layout.getNumReactionGlyphs(); i++){
      reactionGlyphMap.set(layout.getReactionGlyph(i).getReactionId(), i);
    }
  }

  sbmlToJson.addJSEdges(resultJson, cytoscapeJsNodes, cytoscapeJsEdges,reactionGlyphMap)
};

sbmlToJson.addJSEdges= function(resultJson, cytoscapeJsNodes, cytoscapeJsEdges,reactionGlyphMap)
{
  //Default values
  var classNameEdge1 = "consumption"; //Reactant
  var classNameEdge2 = "production"; //Product
  var classNameEdge3 = "catalysis";  //Modifier

  for(let i = 0; i < resultJson.length; i++){
    
    if( resultJson[i].group == 'nodes' && ( resultJson[i].classes == "reaction" || resultJson[i].classes == "degradation" || resultJson[i].classes == "boolean"))
    {
      if (layout) {
        // get reaction glyph
        let reactionGlyphId = reactionGlyphMap.get(resultJson[i].data.id);
        let reactionGlyph = layout.getReactionGlyph(reactionGlyphId);
        
        //TO-DO: Known issue about the position of the reaction node
        let specRef = reactionGlyph.getSpeciesReferenceGlyph(0);
        let position = {x: specRef.getCurve().getCurveSegment(0).getStart().x() + 10, y: specRef.getCurve().getCurveSegment(0).getStart().y() + 10};
        //create and set bbox values for the reaction node
        let tempBbox = {};
        tempBbox.x = position.x;
        tempBbox.y = position.y;
        tempBbox.w = resultJson[i].data.width;
        tempBbox.h = resultJson[i].data.height;
        resultJson[i].data.bbox = tempBbox;
      }

      sbmlToJson.addNodes(cytoscapeJsNodes, resultJson[i].data );

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
  return nodeClass.endsWith("process");
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
    if (!layout){
    tempBbox.x = 0
    tempBbox.y = 0
    tempBbox.w = data.width;
    tempBbox.h = data.height;
    nodeObj.bbox = tempBbox; 
  }
  else {
    nodeObj.bbox = data.bbox;
  }
    nodeObj.class = className;
    nodeObj.id = data.id
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



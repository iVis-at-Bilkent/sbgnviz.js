const libsbml = require('libsbmljs_stable');
const libsbmlInstance = libsbml();
var pkgVersion = require('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = require('../../package.json').name;
var prettyprint = require('pretty-data').pd;
var xml2js = require('xml2js');
var mapPropertiesBuilder = new xml2js.Builder({rootName: "nwt:mapProperties"});
var compoundExtensionBuilder = new xml2js.Builder({rootName: "nwt:extraInfo"});
var textUtilities = require('./text-utilities');

module.exports = function () {
    var elementUtilities, graphUtilities, experimentalDataOverlay;
    var cy;

    var nodesToSbo = 
    {
        "rna": 278,
        "complex sbml": 253,
        "hypothetical complex": 289,
        "degradation": 291,
        "drug": 298,
        "gene": 243,
        "protein": 252,
        "ion": 327,
        "ion channel": 284,
        "phenotype sbml": 358,
        "receptor": 244,
        "simple molecule": 247, 
        "truncated protein": 248,
        "unknown molecule": 285,
        "and": 173,
        "or": 174,
        "not": 238,
        "unknown logical operator": 398
    }

    var reducedNotationEdge = 
    {
        "positive influence sbml": 171,
        "negative influence": 407,
        "reduced modulation": 344,
        "reduced stimulation": 411,
        "reduced trigger": 168,
        "unknown negative influence": 169,
        "unknown positive influence": 172,
        "unknown reduced stimulation": 170,
        "unknown reduced modulation": 342,
        "unknown reduced trigger": 205,
    }

    var modifierNotationEdge = 
    {
        "modulation": 594,
        "stimulation": 459,
        "catalysis": 13,
        "inhibition": 537,
        "trigger": 461,
        "unknown inhibition": 536,
        "unknown catalysis": 462, 
    }
    var twoOrThreeEdge = 
    {
        "consumption": 1,
        "production" : 1,
        "transport": 1,
        "transcription consumptio": 1,
        "transcription production": 1,
        "translation consumption": 1,
        "translation production": 1,
    }
  
    function jsonToSbml (param) {
        elementUtilities = param.elementUtilities;
        graphUtilities = param.graphUtilities;
        experimentalDataOverlay = param.experimentalDataOverlay;
        cy = param.sbgnCyInstance.getCy();
      }

    jsonToSbml.createSbml = function(filename) {
        var jsObj = jsonToSbml.buildJsObj(filename);
        return jsObj;
    }

    jsonToSbml.buildJsObj = function(filename){
        var edges = cy.edges();
        var nodes = cy.nodes();
        var sbmlDoc =  new libsbmlInstance.SBMLDocument(2, 4)
        var model = sbmlDoc.createModel()
        model.setId('model1')
        let nodesIdName = {}
         
        //Create compartment
        for (let i = 0; i < nodes.length; i++)
        {
            var nodeClass = nodes[i]._private.data.class;
            if( nodeClass == "compartment")
            {
                const comp = model.createCompartment()
                comp.setId(nodes[i]._private.data.id.replace(/-/g, "_"))
                comp.setSize(1)
                comp.setConstant(true)
                if(nodes[i]._private.data.label)
                {
                    comp.setName(nodes[i]._private.data.label)
                }
            }
        }

        //Set species
        for (let i = 0; i < nodes.length; i++)
        {
            var nodeClass = nodes[i]._private.data.class;
            if(jsonToSbml.isSpecies(nodeClass))
            {
                const newSpecies = model.createSpecies();
                if(nodesToSbo[nodeClass])
                {
                    newSpecies.setSBOTerm(nodesToSbo[nodeClass])
                }
                if(nodes[i]._private.parent)
                {
                    let parent = nodes[i]._private.parent[0]._private.data.id.replace(/-/g, "_");
                    newSpecies.setCompartment(parent)
                }
    
                const new_id = nodes[i]._private.data.id
                var newStr = new_id.replace(/-/g, "_"); //Replacsing - with _ because libsml doesn't allow - in id
                newSpecies.setId(newStr);
                if(nodes[i]._private.data.label)
                {
                    newSpecies.setName(nodes[i]._private.data.label)
                }
            }
            nodesIdName[nodes[i]._private.data.id.replace(/-/g, "_")] = nodes[i]._private.data.class;
                   
        }

        //Building source: {target, edgeClass, edgeId} map
        let sourceToTarget = {}
        let targetToSource = {}
        for (let i = 0; i < edges.length; i++)
        {
            var edgeClass = edges[i]._private.data.class;
            var source = edges[i]._private.data.source.replace(/-/g, "_");
            var target = edges[i]._private.data.target.replace(/-/g, "_");
            var edgeId = edges[i]._private.data.id.replace(/-/g, "_");
            if(!sourceToTarget[source])
            {
                sourceToTarget[source] = []
            }
            sourceToTarget[source].push({"target": target, "edgeClass": edgeClass, "edgeId": edgeId})

            if(!targetToSource[target])
            {
                targetToSource[target] = [];
            }
            targetToSource[target].push({"source": source, "edgeClass": edgeClass, "edgeId": edgeId});
        }


        //Build a reducedNotation map: source: target
        let reducedNotation = {};
        let sourceToTargetKeys = Object.keys(sourceToTarget)
        for(let i = 0; i < sourceToTargetKeys.length; i++)
        {
            let currentKey = sourceToTargetKeys[i];
            let curTargetArray = sourceToTarget[currentKey];
            for(let j = 0; j < curTargetArray.length; j++)
            {
                let curTarget = curTargetArray[j]
                if ( reducedNotationEdge[curTarget.edgeClass] && !jsonToSbml.isLogicalOperatorNode(nodesIdName[currentKey]))
                {
                    if(!reducedNotation[currentKey])
                    {
                        reducedNotation[currentKey] = []
                    } 
                    reducedNotation[currentKey].push({"target": curTarget.target, "edgeClass": curTarget.edgeClass});
                }
            }
            
        }

        //Build process map: processId: {source, target, modifier}
        let process = {}
        for(let i = 0; i < sourceToTargetKeys.length; i++)
        {
            let currentKey = sourceToTargetKeys[i];
            let currectClass = nodesIdName[currentKey];
            if(jsonToSbml.isProcessNode(currectClass))
            {
                let targetObjectArray = sourceToTarget[currentKey]
                for(let j = 0; j < targetObjectArray.length; j++)
                {
                    let targetObject = targetObjectArray[j]
                    if(!process[currentKey])
                    {
                        process[currentKey] = {}
                    }
                    process[currentKey].target = targetObject.target;
                    process[currentKey].targetClass = nodesIdName[targetObject.target];
                    process[currentKey].targetEdge = targetObject.edgeClass;
    
                }
            }  
        }

        let targetToSourceKeys = Object.keys(targetToSource)
        for(let i = 0; i < targetToSourceKeys.length; i++)
        {
            let currentKey = targetToSourceKeys[i];
            let currectClass = nodesIdName[currentKey]
            if(jsonToSbml.isProcessNode(currectClass))
            {
                let targetObjectArray = targetToSource[currentKey]
                for(let j = 0; j < targetObjectArray.length; j++)
                {
                    let targetObject = targetObjectArray[j]
                    
                    if(!process[currentKey])
                    {
                        process[currentKey] = {}
                    }
                    if(modifierNotationEdge[targetObject.edgeClass])
                    {
                        if(!process[currentKey].modifiers)
                        {
                            process[currentKey].modifiers = []
                        }
                        process[currentKey].modifiers.push({"modifier": targetObject.source, "modifierEdge": targetObject.edgeClass, "sboTerm": modifierNotationEdge[targetObject.edgeClass] });
                    }
                    else
                    {
                        process[currentKey].source = targetObject.source;
                        process[currentKey].sourceClass = nodesIdName[targetObject.source];
                        process[currentKey].sourceEdge = targetObject.edgeClass;
                    }       
                } 
            }
        }


        //Build truncatedProcess map: processId: {source, target, modifier}
        let truncatedProcess = {}
        for(let i = 0; i < sourceToTargetKeys.length; i++)
        {
            let currentKey = sourceToTargetKeys[i];
            let currectClass = nodesIdName[currentKey];
            if(jsonToSbml.isTruncatedProcessNode(currectClass))
            {
                let targetObjectArray = sourceToTarget[currentKey]
                for(let j = 0; j < targetObjectArray.length; j++)
                {
                    let targetObject = targetObjectArray[j]
                    if(!truncatedProcess[currentKey])
                    {
                        truncatedProcess[currentKey] = {}
                        truncatedProcess[currentKey].targets = []
                    }
                    truncatedProcess[currentKey].targets.push({"target": targetObject.target, "targetClass": nodesIdName[targetObject.target], "targetEdge": targetObject.edgeClass})
    
                }
            }  
        }

        for(let i = 0; i < targetToSourceKeys.length; i++)
        {
            let currentKey = targetToSourceKeys[i];
            let currectClass = nodesIdName[currentKey]    
            if(jsonToSbml.isTruncatedProcessNode(currectClass))
            {
                let targetObjectArray = targetToSource[currentKey]
                for(let j = 0; j < targetObjectArray.length; j++)
                {
                    let targetObject = targetObjectArray[j]
                    
                    if(!truncatedProcess[currentKey])
                    {
                        truncatedProcess[currentKey] = {}
                    }
                    if(modifierNotationEdge[targetObject.edgeClass])
                    {
                        if(!truncatedProcess[currentKey].modifiers)
                        {
                            truncatedProcess[currentKey].modifiers = []
                        }
                        truncatedProcess[currentKey].modifiers.push({"modifier": targetObject.source, "modifierEdge": targetObject.edgeClass, "sboTerm":modifierNotationEdge[targetObject.edgeClass] });
                    }
                    else
                    {
                        truncatedProcess[currentKey].source = targetObject.source;
                        truncatedProcess[currentKey].sourceClass = nodesIdName[targetObject.source];
                        truncatedProcess[currentKey].sourceEdge = targetObject.edgeClass;
                    }       
                } 
            }
        }



        //Check if process nodes are part of association or dissociation 
        let processKeys = Object.keys(process)
        let associations  = {};
        let dissociations = {};
        for(let i = 0; i < processKeys.length; i++)
        {
            let curId = processKeys[i];
            let processObj = process[curId];
            if(processObj.sourceClass == "association")
            {
                associations[curId] = {}
                associations[curId].source = []
                associations[curId].target = []
                let sources = targetToSource[processObj.source];
                for(let i = 0; i < sources.length; i++)
                {
                    associations[curId].source.push(sources[i].source);
                } 
                associations[curId].target.push(processObj.target);
                if(processObj.modifiers)
                {
                    associations[curId].modifiers = processObj.modifiers;
                }
            }
            if(processObj.targetClass == "dissociation")
            {
                dissociations[curId] = {}
                dissociations[curId].source = []
                dissociations[curId].source.push(processObj.source);
                dissociations[curId].target = []
               
                let targets = sourceToTarget[processObj.target];
                for(let i = 0; i < targets.length; i++)
                {
                    dissociations[curId].target.push(targets[i].target);
                }                
                 if(processObj.modifiers)
                {
                    dissociations[curId].modifiers = processObj.modifiers;

                }
            }
        }
        

        //Build logical operator map - logialOpId: {[sources], target}
        let logicalOperators = {}
        for(let i = 0; i < sourceToTargetKeys.length; i++)
        {
            let currentKey = sourceToTargetKeys[i];
            let currectClass = nodesIdName[currentKey];
            if(jsonToSbml.isLogicalOperatorNode(currectClass))
            {
                let targetObjectArray = sourceToTarget[currentKey]
                for(let j = 0; j < targetObjectArray.length; j++) // targetObjectArray.length should be 1
                {
                    let targetObject = targetObjectArray[j]
                    logicalOperators[currentKey] = {}
                    logicalOperators[currentKey].target = {}
                    logicalOperators[currentKey].target = {"target": targetObject.target, "targetClass": nodesIdName[targetObject.target], "targetEdge": targetObject.edgeClass};
    
                }
            }  
        }
        for(let i = 0; i < targetToSourceKeys.length; i++)
        {
            let currentKey = targetToSourceKeys[i];
            let currectClass = nodesIdName[currentKey];
            if(jsonToSbml.isLogicalOperatorNode(currectClass))
            {
                let sourceObjectArray = targetToSource[currentKey]
                for(let j = 0; j < sourceObjectArray.length; j++) // targetObjectArray.length should be 1
                {
                    let sourceObject = sourceObjectArray[j]
                    if(!logicalOperators[currentKey].source)
                    {
                        logicalOperators[currentKey].source = []
                    }
                    logicalOperators[currentKey].source.push({"source": sourceObject.source, "sourceClass": nodesIdName[sourceObject.source]})
                }
            }  
        }
        for (let i = 0; i < processKeys.length; i++)
        {
            let curKey = processKeys[i];
            if(associations[curKey] || dissociations[curKey])
            {
                delete process[curKey];
            }
        }
    //     console.log("reducedNotation", reducedNotation);
    //    console.log("process", process)
    //     console.log("truncatedProcess", truncatedProcess)
    //     console.log("associations",associations)
    //     console.log("dissociations",dissociations)
    //     console.log("logicalOperators",logicalOperators)

        //Build sbml reactions
        //Build reduced notion reactions
        let reducedNotationKeys = Object.keys(reducedNotation)
        for (let i = 0; i < reducedNotationKeys.length; i++)
        {
            let curKey = reducedNotationKeys[i];
            let targets = reducedNotation[curKey];

            for (let j = 0; j < targets.length; j++)
            {
                let curTarget = targets[j]
                const rxn = model.createReaction()
                rxn.setId('reduced'+ curTarget.target)
                rxn.setSBOTerm(reducedNotationEdge[curTarget.edgeClass])
          
                const spr1 = rxn.createReactant()
                spr1.setSpecies(curKey)
          
                const spr2 = rxn.createProduct()
                spr2.setSpecies(curTarget.target)
            }
        }

        //build process reactions
        let newProcessKeys = Object.keys(process)
        for (let i = 0; i < newProcessKeys.length; i++)
        {
            let curKey = newProcessKeys[i];
            let curProcess = process[curKey];
            let curSource = curProcess.source;
            let curSourceEdge = curProcess.sourceEdge;
            let curTarget = curProcess.target;
            let curTargetEdge = curProcess.targetEdge;
            let modifiers = curProcess.modifiers;

            const rxn = model.createReaction();
            rxn.setId('process_'+ curKey);
        
            const spr1 = rxn.createReactant()
            spr1.setSpecies(curSource)
        
            const spr2 = rxn.createProduct()
            spr2.setSpecies(curTarget)
            if(modifiers)
            {
                for (let j = 0; j < modifiers.length; j++)
                {
                    const modifier = rxn.createModifier()
                    modifier.setSpecies(modifiers[j].modifier)
                    modifier.setSBOTerm(modifiers[j].sboTerm)
                }
            }
            //Set sbo term for reaction
            if(curSourceEdge == "consumption" && curTargetEdge == "production" && nodesIdName[curKey] == "process")
            {
                rxn.setSBOTerm(176)
            }
            else if(curSourceEdge == "consumption" && curTargetEdge == "production" && nodesIdName[curKey] == "omitted process")
            {
                rxn.setSBOTerm(395)
            }
            else if(curSourceEdge == "consumption" && curTargetEdge == "production" && nodesIdName[curKey] == "uncertain process")
            {
                rxn.setSBOTerm(396)
            }
            else if(curSourceEdge == "transcription consumption" && curTargetEdge == "transcription production")
            {
                rxn.setSBOTerm(183)
            }
            else if(curSourceEdge == "translation consumption" && curTargetEdge == "translation production")
            {
                rxn.setSBOTerm(184)
            }
            else if(curSourceEdge == "consumption" && curTargetEdge == "transport")
            {
                rxn.setSBOTerm(185)
            }
            
        }
        //Build truncatedProcess reaction
        let truncatedProcessKeys = Object.keys(truncatedProcess)
        for (let i = 0; i < truncatedProcessKeys.length; i++)
        {
            let curKey = truncatedProcessKeys[i];
            let truncatedObj = truncatedProcess[curKey];
            let curSource = truncatedObj.source;
            let targets = truncatedObj.targets;
            let modifiers = truncatedObj.modifiers;
            const rxn = model.createReaction()
            rxn.setId('trunacted_'+ curKey)
            rxn.setSBOTerm(178)
            const spr1 = rxn.createReactant()
            spr1.setSpecies(curSource)
            for (let j = 0; j < targets.length; j++)
            {
                let curTarget = targets[j]
                const spr2 = rxn.createProduct()
                spr2.setSpecies(curTarget.target)
            }
            if(modifiers)
            {
                for (let j = 0; j < modifiers.length; j++)
                {
                    let curModifier = truncatedObj.modifiers[j]
                    const spr3 = rxn.createModifier()
                    spr3.setSpecies(curModifier.modifier)
                }
            }
        }

        //Build association reaction
        let associationsKeys = Object.keys(associations)
        for (let i = 0; i < associationsKeys.length; i++)
        {
            let curKey = associationsKeys[i];
            let assocOb = associations[curKey];
            let sources = assocOb.source;
            let targets = assocOb.target;
            let modifiers = assocOb.modifiers;
            const rxn = model.createReaction()
            rxn.setId('association_'+ curKey)
            rxn.setSBOTerm(177)
            for (let j = 0; j < sources.length; j++)
            {
                let curSource = sources[j]
                const spr1 = rxn.createReactant()
                spr1.setSpecies(curSource)
            }
            for (let j = 0; j < targets.length; j++)
            {
                let curTarget = targets[j]
                const spr2 = rxn.createProduct()
                spr2.setSpecies(curTarget)
            }
            if(modifiers)
            {
                for (let j = 0; j < modifiers.length; j++)
                {
                    let curModifier = modifiers[i]
                    const spr3 = rxn.createModifier()
                    spr3.setSpecies(curModifier.modifier)
                }
            }
        }

        //Build dissociation reaction
        let dissociationsKeys = Object.keys(dissociations)
        for (let i = 0; i < dissociationsKeys.length; i++)
        {
            let curKey = dissociationsKeys[i];
            let dissOb = dissociations[curKey];
            let sources = dissOb.source;
            let targets = dissOb.target;
            let modifiers = dissOb.modifiers;
            const rxn = model.createReaction()
            rxn.setId('dissociation_'+ curKey)
            rxn.setSBOTerm(180)
            for (let j = 0; j < sources.length; j++)
            {
                let curSource = sources[j]
                const spr1 = rxn.createReactant()
                spr1.setSpecies(curSource)
            }
            for (let j = 0; j < targets.length; j++)
            {
                let curTarget = targets[j]
                const spr2 = rxn.createProduct()
                spr2.setSpecies(curTarget)
            }
            if(modifiers)
            {
                for (let j = 0; j < modifiers.length; j++)
                {
                    let curModifier = modifiers[i]
                    const spr3 = rxn.createModifier()
                    spr3.setSpecies(curModifier.modifier)
                }
            }
        }

        //Build logical operator reactions
        let logicalOperatorsKeys = Object.keys(logicalOperators)
        for (let i = 0; i < logicalOperatorsKeys.length; i++)
        {
            let curKey = logicalOperatorsKeys[i];
            let logicObj = logicalOperators[curKey];
            let sources = logicObj.source;
            let target = logicObj.target;
            const rxn = model.createReaction()
            rxn.setId('logical_operator_'+ curKey)
            let logicalClass = nodesIdName[curKey]
            if(nodesToSbo[logicalClass])
            {
                rxn.setSBOTerm(nodesToSbo[logicalClass])
            }
            for (let j = 0; j < sources.length; j++)
            {
                let curSource = sources[j]
                const spr1 = rxn.createReactant()
                spr1.setSpecies(curSource.source)
            }
            const spr2 = rxn.createProduct()
            spr2.setSpecies(target.target)
            spr2.setSBOTerm(168)
        }
        const writer = new libsbmlInstance.SBMLWriter()
        const serializedSBML = writer.writeSBMLToString(sbmlDoc)


        libsbmlInstance.destroy(sbmlDoc)
        libsbmlInstance.destroy(writer)
        return serializedSBML;

     }
    jsonToSbml.buildReactions = function(model) {}
    jsonToSbml.isProcessNode = function(nodeClass) {
        return nodeClass.startsWith("process") && nodeClass != "truncated process"
    }
    jsonToSbml.isTruncatedProcessNode = function(nodeClass) {
        return  nodeClass == "truncated process"
    }
    jsonToSbml.isLogicalOperatorNode = function(nodeClass) {
        return nodeClass == "and" || nodeClass == "not" || nodeClass == "or" || nodeClass == "unknown logical operator"
    }
    jsonToSbml.isSpecies = function(nodeClass) {
        return !jsonToSbml.isLogicalOperatorNode(nodeClass) && !jsonToSbml.isProcessNode(nodeClass) && !jsonToSbml.isTruncatedProcessNode(nodeClass) 
        && nodeClass != "association" &&  nodeClass != "dissociation" &&  nodeClass != "compartment";
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

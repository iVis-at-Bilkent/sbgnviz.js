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
    247: "simple molecule",
    252: "truncated protein",
    285: "unknown molecule"
  }

  sbmlToJson.insertedNodes = {};

  sbmlToJson.map = undefined;
  sbmlToJson.calculatedCompoundPadding = undefined;

  sbmlToJson.getAllCompartments = function (glyphList) {
    var compartments = [];

    for (var i = 0; i < glyphList.length; i++) {
      if (glyphList[i].class_ == "compartment") {
        var compartment = glyphList[i];
        var bbox = compartment.bbox;
        compartments.push({
          x: parseFloat(bbox.x),
          y: parseFloat(bbox.y),
          w: parseFloat(bbox.w),
          h: parseFloat(bbox.h),
          id: compartment.id,
        });
      }
    }
    compartments.sort(function (c1, c2) {
      if (c1.h * c1.w < c2.h * c2.w) {
        return -1;
      }
      if (c1.h * c1.w > c2.h * c2.w) {
        return 1;
      }
      return 0;
    });

    return compartments;
  };

  sbmlToJson.isInBoundingBox = function (bbox1, bbox2) {
    if (
      bbox1.x > bbox2.x &&
      bbox1.y > bbox2.y &&
      bbox1.x + bbox1.w < bbox2.x + bbox2.w &&
      bbox1.y + bbox1.h < bbox2.y + bbox2.h
    ) {
      return true;
    }
    return false;
  };

  sbmlToJson.bboxProp = function (ele) {
    if (ele.bboxCalculated) {
      return ele.bbox;
    }

    ele.bboxCalculated = true;
    var childNodes = ele.glyphMembers;
    //exclude state variables and units of information from child members
    childNodes = childNodes.filter(function (child) {
      return (
        child.class_ != "state variable" &&
        child.class_ != "unit of information" &&
        child.class_ != "binding region" &&
        child.class_ != "residue variable"
      );
    });
    var bbox = {};
    bbox.x = ele.bbox.x;
    bbox.y = ele.bbox.y;
    bbox.w = ele.bbox.w;
    bbox.h = ele.bbox.h;
    //if it is simple node return bbox
    if (childNodes.length <= 0) {
      bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
      bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;

      return bbox;
    } else if (ele.extension && ele.extension.has("extraInfo")) {
      // if newt file then extrainfo on the compound node exists
      var xml = ele.extension.get("extraInfo");
      var extraInfo;
      parseString(xml, function (err, result) {
        extraInfo = result.extraInfo;
      });
      ele.originalW = bbox.w;
      ele.originalH = bbox.h;
      bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
      bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;
      bbox.w = parseFloat(extraInfo.w);
      bbox.h = parseFloat(extraInfo.h);
      ele.minWidth = parseFloat(extraInfo.minW);
      ele.minHeight = parseFloat(extraInfo.minH);
      ele.minWidthBiasLeft = parseFloat(extraInfo.WLBias);
      ele.minWidthBiasRight = parseFloat(extraInfo.WRBias);
      ele.minHeightBiasBottom = parseFloat(extraInfo.HBBias);
      ele.minHeightBiasTop = parseFloat(extraInfo.HTBias);

      return bbox;
    } else {
      /*  var styles;
      if (this.map.extension && this.map.extension.has('renderInformation')) { // render extension was found
        styles = this.map.extension.get('renderInformation').listOfStyles;
        if(styles  !== undefined){
          styles = styles.styles;
        }
      }
 */
      /*  var compoundPadding = parseFloat(mapProperties.compoundPadding);
      var extraCompartmentPadding = parseFloat(mapProperties.extraCompartmentPadding); */

      var padding = this.calculateElementPadding(ele);
      if (ele.class_ == "complex") {
        ele.complexCalculatedPadding = padding;
      }

      var minLeft,
        maxRight,
        minTop,
        maxBottom,
        childrenBboxW,
        childrenBboxH,
        minLeftBorder,
        maxRightBorder,
        minTopBorder,
        maxBottomBorder;
      var fromInfoBox = false;
      // Traverse the other children and update the extreme values
      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];

        var childNodeBbox = this.bboxProp(childNode);

        childNode.bbox = childNodeBbox;
        var borderWidth = elementUtilities.getDefaultProperties(
          childNode.class_
        )["border-width"];
        var childPadding = this.calculateElementPadding(childNode);
        //var childStyle = styles.filter(style =>{ return style.idList == childNode.id});

        /*  if(childStyle.length > 0 && childStyle[0].renderGroup !== undefined){
          borderWidth = childStyle[0].renderGroup.strokeWidth;
        } */

        var left = childNodeBbox.x - childNodeBbox.w / 2 - childPadding;
        var right = childNodeBbox.x + childNodeBbox.w / 2 + childPadding;
        var top = childNodeBbox.y - childNodeBbox.h / 2 - childPadding;
        var bottom = childNodeBbox.y + childNodeBbox.h / 2 + childPadding;
        var stateAndInfos = childNode.glyphMembers.filter(function (child) {
          return (
            child.class_ == "state variable" ||
            child.class_ == "unit of information" ||
            child.class_ == "binding region" ||
            child.class_ == "residue variable"
          );
        });
        if (stateAndInfos.length > 0) {
          for (var k = 0; k < stateAndInfos.length; k++) {
            var stateBbox = stateAndInfos[k].bbox;
            if (minLeft === undefined || stateBbox.x < minLeft) {
              minLeft = stateBbox.x;
              fromInfoBox = true;
              minLeftBorder = 0;
            }

            if (
              maxRight === undefined ||
              stateBbox.x + stateBbox.w > maxRight
            ) {
              maxRight = stateBbox.x + stateBbox.w;
              fromInfoBox = true;
              maxRightBorder = 0;
            }

            if (minTop === undefined || stateBbox.y < minTop) {
              minTop = stateBbox.y;
              fromInfoBox = true;
              minTopBorder = 0;
            }

            if (
              maxBottom === undefined ||
              stateBbox.y + stateBbox.h > maxBottom
            ) {
              maxBottom = stateBbox.y + stateBbox.h;
              fromInfoBox = true;
              maxBottomBorder = 0;
            }
          }
        }

        if (minLeft === undefined || left < minLeft) {
          minLeft = left;
          fromInfoBox = false;
          minLeftBorder = borderWidth;
        }

        if (maxRight === undefined || right > maxRight) {
          maxRight = right;
          fromInfoBox = false;
          maxRightBorder = borderWidth;
        }

        if (minTop === undefined || top < minTop) {
          minTop = top;
          fromInfoBox = false;
          minTopBorder = borderWidth;
        }

        if (maxBottom === undefined || bottom > maxBottom) {
          maxBottom = bottom;
          fromInfoBox = false;
          maxBottomBorder = borderWidth;
        }
      }

      var averageBorderWidthW = (minLeftBorder + maxRightBorder) / 2;
      var averageBorderWidthH = (minTopBorder + maxBottomBorder) / 2;
      // The sizes of children bbox are determined by the difference between the extreme coordinates
      childrenBboxW = maxRight - minLeft + 2; // 2 is from cytoscape internal implementation of infoboxes
      childrenBboxH = maxBottom - minTop + 2;

      // If children bbox width is less than node bbox width + paddings set minWidth, and horizontal biases
      if (
        Number(
          (
            childrenBboxW +
            2 * padding +
            averageBorderWidthW +
            (fromInfoBox ? 2 * borderWidth : 0)
          ).toFixed(2)
        ) < Number(bbox.w.toFixed(2))
      ) {
        //ele.minWidth = bbox.w - 2 padding  calculate badding first
        ele.minWidth = bbox.w - 2 * padding;
        var extraLeft = Number(
          (minLeft - bbox.x - padding - minLeftBorder / 2 - 1).toFixed(2)
        );
        var extraRight = Number(
          (
            bbox.x +
            bbox.w -
            maxRight -
            padding -
            maxRightBorder / 2 -
            1
          ).toFixed(2)
        );

        ele.minWidthBiasLeft = (extraLeft / (extraLeft + extraRight)) * 100;
        ele.minWidthBiasRight = 100 - ele.minWidthBiasLeft;
      }

      // If children bbox height is bigger than node bbox height set minHeight, and vertical biases
      if (
        Number(
          (
            childrenBboxH +
            2 * padding +
            averageBorderWidthH +
            (fromInfoBox ? 2 * borderWidth : 0)
          ).toFixed(2)
        ) < Number(bbox.h.toFixed(2))
      ) {
        ele.minHeight = bbox.h - 2 * padding;
        var extraTop = Number(
          (minTop - bbox.y - padding - minTopBorder / 2 - 1).toFixed(2)
        );
        var extraBottom = Number(
          (
            bbox.y +
            bbox.h -
            maxBottom -
            padding -
            maxBottomBorder / 2 -
            1
          ).toFixed(2)
        );

        ele.minHeightBiasTop = (extraTop / (extraTop + extraBottom)) * 100;
        ele.minHeightBiasBottom = 100 - ele.minHeightBiasTop;
      }

      // set positions as center

      bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
      bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;
      //bbox.x = (minLeft + maxRight) /2;
      // bbox.y = (minTop + maxBottom) / 2;
      bbox.w = bbox.w - 2 * padding - averageBorderWidthW;
      bbox.h = bbox.h - 2 * padding - averageBorderWidthH;
      bbox.w = bbox.w < 0 ? 0 : bbox.w;
      bbox.h = bbox.h < 0 ? 0 : bbox.h;

      return bbox;
    }
  };

  sbmlToJson.stateAndInfoBboxProp = function (ele, parentBbox) {
    // don't copy directly ele.box because it contains other things than x y w h
    var bbox = {};

    if (ele.bbox != null) {
      bbox.x = ele.bbox.x;
      bbox.y = ele.bbox.y;
      bbox.w = ele.bbox.w;
      bbox.h = ele.bbox.h;
    } else {
      bbox.x = 0;
      bbox.y = 0;
      bbox.w = 12;
      bbox.h = 12;
    }

    return bbox;
  };

  sbmlToJson.calculateElementPadding = function (ele) {
    var padding = 0;

    var childNodes = ele.glyphMembers;
    //exclude state variables and units of information from child members
    childNodes = childNodes.filter(function (child) {
      return (
        child.class_ != "state variable" &&
        child.class_ != "unit of information" &&
        child.class_ != "binding region" &&
        child.class_ != "residue variable"
      );
    });
    if (childNodes.length <= 0) return 0;
    var compoundPadding =
      typeof options.compoundPadding === "function"
        ? options.compoundPadding.call()
        : options.compoundPadding;
    // }
    if (ele.class_ == "complex") {
      var complexPadding = 0;
      var extraComplexPadding =
        typeof options.extraComplexPadding === "function"
          ? options.extraComplexPadding.call()
          : options.extraComplexPadding;
      complexPadding = compoundPadding < 5 ? 5 : compoundPadding;

      var stateAndInfos = ele.glyphMembers.filter(function (child) {
        return (
          child.class_ == "state variable" ||
          child.class_ == "unit of information" ||
          child.class_ == "binding region" ||
          child.class_ == "residue variable"
        );
      });

      if (
        ele.label != undefined &&
        ele.label.text != undefined &&
        ele.label.text.length > 0
      ) {
        complexPadding = complexPadding + 0.5 * extraComplexPadding;
        var hasTopBottomInfo = false;
        stateAndInfos.forEach(function (stateAndInfo) {
          if (
            Number(
              (stateAndInfo.bbox.y + stateAndInfo.bbox.h / 2).toFixed(2)
            ) == Number((ele.bbox.y + ele.bbox.h).toFixed(2))
          ) {
            hasTopBottomInfo = true;
          }
        });

        if (hasTopBottomInfo) {
          complexPadding = complexPadding + 0.5 * extraComplexPadding;
        }
      } else if (stateAndInfos.length > 0) {
        complexPadding += 2;
      }

      padding = complexPadding;
    } else {
      var extraCompartmentPadding =
        typeof options.extraCompartmentPadding === "function"
          ? options.extraCompartmentPadding.call()
          : options.extraCompartmentPadding;
      padding = extraCompartmentPadding + compoundPadding;
    }

    return padding;
  };

  sbmlToJson.findChildNodes = function (ele, childTagName) {
    // find child nodes at depth level of 1 relative to the element
    var children = [];
    for (var i = 0; i < ele.childNodes.length; i++) {
      var child = ele.childNodes[i];
      if (child.nodeType === 1 && child.tagName === childTagName) {
        children.push(child);
      }
    }
    return children;
  };

  sbmlToJson.findChildNode = function (ele, childTagName) {
    var nodes = this.findChildNodes(ele, childTagName);
    return nodes.length > 0 ? nodes[0] : undefined;
  };

  sbmlToJson.stateAndInfoProp = function (ele, parent) {
    var self = this;
    var parentBbox = parent.bbox;
    var stateAndInfoArray = [];

    var childGlyphs = ele.glyphMembers; // this.findChildNodes(ele, 'glyph');

    // if a biological activity node has no unit of info, it must be a BA plain
    if (parent.class == "biological activity" && childGlyphs.length == 0) {
      parent.class = "BA plain";
    }

    for (var i = 0; i < childGlyphs.length; i++) {
      var glyph = childGlyphs[i];

      if (
        glyph.class_ !== "unit of information" &&
        glyph.class_ !== "state variable" &&
        glyph.class_ !== "residue variable" &&
        glyph.class_ !== "binding region"
      ) {
        continue;
      }

      var info = {};
      var infobox;
      var infoboxId = glyph.id;

      if (glyph.class_ === "unit of information") {
        infobox = classes.UnitOfInformation.construct(
          undefined,
          undefined,
          infoboxId
        );
        /*
        if (glyph.entity) {
          // change the parent class according to its true class of biological activity
          switch (glyph.entity.name) {
            case "unspecified entity":
              parent.class = "BA unspecified entity";
              break;
            case "simple chemical":
              parent.class = "BA simple chemical";
              break;
            case "macromolecule":
              parent.class = "BA macromolecule";
              break;
            case "nucleic acid feature":
              parent.class = "BA nucleic acid feature";
              break;
            case "perturbation":
              parent.class = "BA perturbing agent";
              break;
            case "complex":
              parent.class = "BA complex";
              break;
          }
        }
        */
        infobox.label = {
          text: (glyph.label && glyph.label.text) || undefined,
        };
      } else if (glyph.class_ === "state variable") {
        infobox = classes.StateVariable.construct(
          undefined,
          undefined,
          undefined,
          infoboxId
        );

        var state = glyph.state;
        infobox.state.value = (state && state.value) || undefined;
        infobox.state.variable = (state && state.variable) || undefined;
      } else if (glyph.class_ === "residue variable") {
        infobox = classes.ResidueVariable.construct(
          undefined,
          undefined,
          infoboxId
        );
        infobox.residue.variable =
          (glyph.label && glyph.label.text) || undefined;
      } else if (glyph.class_ === "binding region") {
        infobox = classes.BindingRegion.construct(
          undefined,
          undefined,
          infoboxId
        );
        infobox.region.variable =
          (glyph.label && glyph.label.text) || undefined;
      }

      //var bboxAndAnchorResult = getAuxUnitClass(infobox).setAnchorSideAndBbox();

      infobox.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
      infobox.style = self.getDefaultStateAndInfoStyle(glyph, parent.class);
      //classes.StateVariable.setAnchorSide(infobox);
      stateAndInfoArray.push(infobox);
    }

    return stateAndInfoArray;
  };

  sbmlToJson.getDefaultStateAndInfoStyle = function (gylph, parentClass) {
    return elementUtilities.getDefaultInfoboxStyle(parentClass, gylph.class_);
  };

  sbmlToJson.addParentInfoToNode = function (
    ele,
    nodeObj,
    parent,
    compartments
  ) {
    var self = this;
    var compartmentRef = ele.compartmentRef;

    var inferNestingOnLoad = options.inferNestingOnLoad;
    inferNestingOnLoad =
      typeof inferNestingOnLoad === "function"
        ? inferNestingOnLoad.call()
        : inferNestingOnLoad;

    if (parent) {
      nodeObj.parent = parent;
    } else if (compartmentRef) {
      nodeObj.parent = compartmentRef;
    } else if (inferNestingOnLoad) {
      nodeObj.parent = "";

      // add compartment according to geometry
      for (var i = 0; i < compartments.length; i++) {
        var bbox = {
          x: parseFloat(ele.bbox.x),
          y: parseFloat(ele.bbox.y),
          w: parseFloat(ele.bbox.w),
          h: parseFloat(ele.bbox.h),
          id: ele.id,
        };
        if (self.isInBoundingBox(bbox, compartments[i])) {
          nodeObj.parent = compartments[i].id;
          break;
        }
      }
    }
  };
  sbmlToJson.addCytoscapeJsNode = function (ele, jsonArray, parent, compartments) {
    var self = this;
    var nodeObj = {};
    var styleObj = {};

    // add id information
    nodeObj.id = ele.id;
    // add node bounding box information
    nodeObj.bbox = self.bboxProp(ele);    

    if (ele.minWidth) {
      nodeObj.minWidth = ele.minWidth;
      nodeObj.minWidthBiasLeft = ele.minWidthBiasLeft;
      nodeObj.minWidthBiasRight = ele.minWidthBiasRight;
    }

    if (ele.minHeight) {
      nodeObj.minHeight = ele.minHeight;
      nodeObj.minHeightBiasTop = ele.minHeightBiasTop;
      nodeObj.minHeightBiasBottom = ele.minHeightBiasBottom;
    }
    if(ele.originalW){
      nodeObj.originalW = ele.originalW;
    }
    if(ele.originalH){
      nodeObj.originalH = ele.originalH;
    }

    if(ele.complexCalculatedPadding){
      nodeObj.complexCalculatedPadding = ele.complexCalculatedPadding;
    }

    // add class information
    if (ele.class_ === "source and sink" || ele.class_ === "emptyset") {
      nodeObj.class = "empty set";
    }
    else {
      nodeObj.class = ele.class_;
    }
    // add label information
    nodeObj.label = (ele.label && ele.label.text) || undefined;
    if(nodeObj.label != undefined){
      nodeObj.label = ""+ nodeObj.label;
    }
    // add state and info box information
    nodeObj.statesandinfos = self.stateAndInfoProp(ele, nodeObj);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);


    // add language info, this will always be the mapType if not hybrid
    var mapType = elementUtilities.mapType;
    if(mapType == 'PD' || mapType == 'AF' || mapType == 'SIF' || mapType == 'SBML'){
      nodeObj.language = elementUtilities.mapType;
    }else if(mapType == 'HybridSbgn'){
      if(nodeObj.class == 'delay' || nodeObj.class.startsWith("BA")){
        nodeObj.language = 'AF';
      }else{
        nodeObj.language = 'PD';
      }
    }else{//maptype == HybridAny
      if(nodeObj.class.startsWith("SIF")){
        nodeObj.language = 'SIF';
      }else if(nodeObj.class == 'delay' || nodeObj.class.startsWith("BA")){
        nodeObj.language = 'AF';
      }else{
        nodeObj.language = 'PD'; //Need to add SBML here
      }
    }
   
    // add default properties of the node type to element data
    // these props would be overriden by style properties of element
    // stored in the file
    elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );

    // add clone information
    if (ele.clone) {
      nodeObj.clonemarker = true;
    } else {
      nodeObj.clonemarker = undefined;
    }

    // add port information
    var ports = [];
    var portElements = ele.ports;

    for (var i = 0; i < portElements.length; i++) {
      var portEl = portElements[i];
      var id = portEl.id;
      var relativeXPos = parseFloat(portEl.x) - nodeObj.bbox.x;
      var relativeYPos = parseFloat(portEl.y) - nodeObj.bbox.y;

      relativeXPos = relativeXPos / parseFloat(nodeObj.bbox.w) * 100;
      relativeYPos = relativeYPos / parseFloat(nodeObj.bbox.h) * 100;
      
      // In case port position is not vertically/horizontally aligned with the node center, decide a direction
      if(Math.abs(relativeXPos) > 0 && Math.abs(relativeYPos) > 0) {
        if(Math.abs(relativeXPos) >= Math.abs(relativeYPos))
          relativeYPos = 0;
        else
          relativeXPos = 0;
      }

      // We assume that ports are not inside the node shape.
      // Therefore, abs. value of their relative x and y coordinates (relative to node center) should be bigger than 50.
      if (Math.abs(relativeXPos) < 50) {
        relativeXPos = 0;
      }

      if (Math.abs(relativeYPos) < 50) {
        relativeYPos = 0;
      }

      if (relativeXPos === 0 && relativeYPos === 0) {
        continue;
      }
      
      // If port length is longer than the node size (for example, some sbgn files generated from Reactome database has very long ports),
      // set the port length to 70 which is default in sbgnviz
      if(Math.abs(relativeXPos) > 150 || Math.abs(relativeYPos) > 150) {
        if(Math.abs(relativeXPos) > 150)
          relativeXPos = relativeXPos / Math.abs(relativeXPos) * 70;
        else
          relativeYPos = relativeYPos / Math.abs(relativeYPos) * 70;
      }      

      ports.push({
        id: id,
        x: relativeXPos,
        y: relativeYPos
      });
    }

    nodeObj.ports = ports;

    var _class = nodeObj.class;
    // If the node can have ports and it has exactly 2 ports then it should be represented by a bigger bbox.
    // This is because we represent it as a polygon and so the whole shape including the ports are rendered in the node bbox.
    if (elementUtilities.canHavePorts(_class)) {
      if (graphUtilities.portsEnabled && ports.length === 2) {
        // We assume that the ports are symmetric to the node center so using just one of the ports is enough
        var port = ports[0];
        var orientation = port.x === 0 ? 'vertical' : 'horizontal';
        // This is the ratio of the area occupied with ports over without ports
        var ratio = orientation === 'vertical' ? Math.abs(port.y) / 50 : Math.abs(port.x) / 50;
        // Multiply the bbox with the calculated ratio
        nodeObj.bbox.w = parseFloat(nodeObj.bbox.w) * ratio;
        nodeObj.bbox.h = parseFloat(nodeObj.bbox.h) * ratio;
      }
    }

    if (ele.extension && ele.extension.has('annotation')) { // annotation extension was found
      var rdfElement = ele.extension.get('annotation').rdfElement;
      nodeObj = self.handleAnnotations(nodeObj, rdfElement);
    }

    if (ele.extension && ele.extension.has("sbgnviz")){
      parseString(ele.extension.get("sbgnviz"), function (err, result) {
        if (result.sbgnviz.hidden){
          styleObj.display = "none";
        }
        if (result.sbgnviz.hasHiddenNeighbour){
          nodeObj.thickBorder = true;
        }
        if (result.sbgnviz.collapsed){
          nodeObj.positionBeforeSaving = {x : Number(result.sbgnviz.positionBeforeSaving[0].$.x),
              y: Number(result.sbgnviz.positionBeforeSaving[0].$.y)};
          nodeObj.collapse = true;
        }
      });
    }

    var cytoscapeJsNode = {data: nodeObj, style: styleObj};
    jsonArray.push(cytoscapeJsNode);
  };

  /**
  * given a future cy object, and the corresponding element's libsbgnjs' extension, populates the annotations field
  */
  sbmlToJson.handleAnnotations = function(cyObject, rdfElement) {
    // local utility function
    function dbFromUrl(url) {
      var regexp = /^http:\/\/identifiers.org\/(.+?)\/.+$/;
      return url.replace(regexp, '$1');
    }

    function fillElementDataAnnotation(cyObject, annotationIndex, status, selectedDB, selectedRelation, annotationValue) {
      if(!cyObject.annotations) {
        cyObject.annotations = {};
      }
      var annotId = cyObject.id+"-annot-"+annotationIndex;

      cyObject.annotations[annotId] = {
        // The following may be hazardous. But setting it as unchecked leave the annotation out if the file is saved.
        // This would lead to the user losing annotations without knowing it.
        status: status, // <-- we trust that what's been loaded is valid.
        selectedDB: selectedDB,
        selectedRelation: selectedRelation,
        annotationValue: annotationValue
      };
      return cyObject;
    }

    // we assume that the id of the rdf:about field is the one of the current node, and that there's only 1 description
    var id = rdfElement.getAllIds()[0];
    var resources = rdfElement.getResourcesOfId(id);
    var customProperties = rdfElement.getCustomPropertiesOfId(id);

    var globalAnnotIndex = 0;
    // handle controlled properties
    for (var fullQualifier in resources) {
      var relation = libsbml.annot.Util.reducePrefix(fullQualifier);
      for(var i=0; i<resources[fullQualifier].length; i++) {
        var value = resources[fullQualifier][i];
        var selectedDB = dbFromUrl(value);
        cyObject = fillElementDataAnnotation(cyObject, globalAnnotIndex, "validated", selectedDB, relation, value);
        globalAnnotIndex++;
      }
    }
    // handle custom properties
    for (var key in customProperties) {
      var value = customProperties[key];
      cyObject = fillElementDataAnnotation(cyObject, globalAnnotIndex, "validated", key, "sio:SIO_000223", value);
      globalAnnotIndex++;
    }

    return cyObject;
  };

  sbmlToJson.traverseNodes = function (ele, jsonArray, parent, compartments) {
    var elId = ele.id; 

    // Workaround: In application we use class 'empty set' but on read write we use 'source and sink'
    // SBGN-ML files can also have 'emptyset' class  
    if (!handledElements[ele.class_] && ele.class_ !== "source and sink" && ele.class_ !== "emptyset") {
      return;
    }
    this.insertedNodes[elId] = true;
    var self = this;
    // add complex nodes here

    var eleClass = ele.class_;

    if (eleClass === 'complex' || eleClass === 'complex multimer' || eleClass === 'submap' || eleClass === 'topology group') {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);

      var childGlyphs = ele.glyphMembers;
      for (var i = 0; i < childGlyphs.length; i++) {
        var glyph = childGlyphs[i];
        var glyphClass = glyph.class_;
        if (glyphClass !== 'state variable' && glyphClass !== 'unit of information'
        && glyphClass !== 'residue variable' && glyphClass !== 'binding region') {
          if (glyph.compartmentRef && glyph.compartmentRef != elId && eleClass == 'submap') {
            self.traverseNodes(glyph, jsonArray, glyph.compartmentRef, compartments);
          }
          else {
            self.traverseNodes(glyph, jsonArray, elId, compartments);
          }
        }
      }
    } else {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);
    }
  };

  sbmlToJson.getPorts = function (xmlObject) {
    return ( xmlObject._cachedPorts = xmlObject._cachedPorts || xmlObject.querySelectorAll('port'));
  };

  sbmlToJson.getGlyphs = function (xmlObject) {
    var glyphs = xmlObject._cachedGlyphs;

    if (!glyphs) {
      glyphs = xmlObject._cachedGlyphs = xmlObject._cachedGlyphs || xmlObject.querySelectorAll('glyph');

      var id2glyph = xmlObject._id2glyph = {};

      for ( var i = 0; i < glyphs.length; i++ ) {
        var g = glyphs[i];
        var id = g.getAttribute('id');

        id2glyph[ id ] = g;
      }
    }

    return glyphs;
  };

  sbmlToJson.getArcs = function (xmlObject) {
    var arcs = xmlObject._cachedArcs;

    if (!arcs) {
      arcs = xmlObject._cachedArcs = xmlObject._cachedArcs || xmlObject.querySelectorAll('arc');

      var id2arc = xmlObject._id2arc = {};

      for ( var i = 0; i < arcs.length; i++ ) {
        var arc = arcs[i];
        var id = arc.getAttribute('id');

        id2arc[ id ] = arc;
      }
    }

    return arcs;
  };

  sbmlToJson.getGlyphById = function (xmlObject, id) {
    this.getGlyphs(xmlObject); // make sure cache is built

    return xmlObject._id2glyph[id];
  };

  sbmlToJson.getArcById = function (xmlObject, id) {
    this.getArcs(xmlObject); // make sure cache is built

    return xmlObject._id2arc[id];
  };

  sbmlToJson.getArcSourceAndTarget = function (arc, xmlObject) {
    // source and target can be inside of a port
    var source = arc.source;
    var target = arc.target;
    var sourceNodeId;
    var targetNodeId;

    var sourceExists = this.getGlyphById(xmlObject, source);
    var targetExists = this.getGlyphById(xmlObject, target);

    if (sourceExists) {
      sourceNodeId = source;
    }

    if (targetExists) {
      targetNodeId = target;
    }


    var i;
    var portEls = this.getPorts(xmlObject);
    var port;
    if (sourceNodeId === undefined) {
      for (i = 0; i < portEls.length; i++ ) {
        port = portEls[i];
        if (port.getAttribute('id') === source) {
          sourceNodeId = port.parentElement.getAttribute('id');
        }
      }
    }

    if (targetNodeId === undefined) {
      for (i = 0; i < portEls.length; i++) {
        port = portEls[i];
        if (port.getAttribute('id') === target) {
          targetNodeId = port.parentElement.getAttribute('id');
        }
      }
    }

    return {'source': sourceNodeId, 'target': targetNodeId};
  };

  sbmlToJson.getArcAnchorPointPositions = function (ele) {
    var anchorPointPositions = [];

    var children = ele.nexts;

    for (var i = 0; i < children.length; i++) {
      var posX = children[i].x;
      var posY = children[i].y;

      anchorPointPositions.push({
        x: posX,
        y: posY
      });
    }

    return anchorPointPositions;
  };

  sbmlToJson.addCytoscapeJsEdge = function (ele, jsonArray, xmlObject) {
    if (!handledElements[ele.class_]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);

    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }

    var edgeObj = {};
    var styleObj = {};
    var anchorPointPositions = [];
    if (sourceAndTarget.source !== sourceAndTarget.target) {
      anchorPointPositions = self.getArcAnchorPointPositions(ele);
    }

    edgeObj.id = ele.id || undefined;
    edgeObj.class = ele.class_;

    // bezier edge is the default edge style
    // change if the file being loaded has curveStyle field
    var curveStyle = "bezier";
    if (ele.extension && ele.extension.has("curveStyle")) {
      parseString(ele.extension.get("curveStyle"), function (err, result) {
        curveStyle = result.curveStyle;
      })
    }
    if (curveStyle == "unbundled-bezier") {
      edgeObj.controlPointPositions = anchorPointPositions;
    }
    else {
      edgeObj.bendPointPositions = anchorPointPositions;
    }

    var isSifMetaEdge;
    if (ele.extension && ele.extension.has("sifMetaEdge")) {
      parseString(ele.extension.get("sifMetaEdge"), function (err, result) {
        isSifMetaEdge = result.sifMetaEdge;
      });
    }
    if (isSifMetaEdge) {
      edgeObj["sif-meta"] = true;
    }

    // add language info, this will always be the mapType if not hybrid
    var PdEdges = ["consumption","production","modulation","stimulation","catalysis","inhibition","necessary stimulation","logic arc","equivalence arc"];
    var AfEdges = ["positive influence","negative influence","unknown influence"];  
    var mapType = elementUtilities.mapType;
    if(mapType == 'PD' || mapType == 'AF' || mapType == 'SIF' || mapType == 'SBML'){
      edgeObj.language = elementUtilities.mapType;
    }else if(mapType == 'HybridSbgn'){
      if(PdEdges.indexOf(edgeObj.class) > -1){
        edgeObj.language = 'PD';
      }else{
        edgeObj.language = 'AF';
      }
    }else{//maptype == HybridAny
      if(PdEdges.indexOf(edgeObj.class) > -1){
        edgeObj.language = 'PD';
      }else if(AfEdges.indexOf(edgeObj.class) > -1){
        edgeObj.language = 'AF';
      }else{
        edgeObj.language = 'SIF'; // Need to add SBML
      }
    }

    elementUtilities.extendEdgeDataWithClassDefaults( edgeObj, edgeObj.class );

    edgeObj.cardinality = 0;
    if (ele.glyphs.length > 0) {
      for (var i = 0; i < ele.glyphs.length; i++) {
        if (ele.glyphs[i].class_ === 'cardinality' || ele.glyphs[i].class_ === 'stoichiometry') {
          var label = ele.glyphs[i].label;
          edgeObj.cardinality = label.text || undefined;
        }
      }
    }

    edgeObj.source = sourceAndTarget.source;
    edgeObj.target = sourceAndTarget.target;

    edgeObj.portsource = ele.source;
    edgeObj.porttarget = ele.target;

    if (ele.extension && ele.extension.has('annotation')) { // annotation extension was found
      var rdfElement = ele.extension.get('annotation').rdfElement;
      edgeObj = self.handleAnnotations(edgeObj, rdfElement);
    }

    if (ele.extension && ele.extension.has("sbgnviz")){
      parseString(ele.extension.get("sbgnviz"), function (err, result) {
        if (result.sbgnviz.hidden){
          styleObj.display = "none";
        }
      });
    }

    var cytoscapeJsEdge = {data: edgeObj, style: styleObj};
    jsonArray.push(cytoscapeJsEdge);
  };

  sbmlToJson.applyStyle = function (renderInformation, nodes, edges) {
    // get all color id references to their value
    if (renderInformation.listOfColorDefinitions) {
      var colorList = renderInformation.listOfColorDefinitions.colorDefinitions;
      var colorIDToValue = {};
      for (var i=0; i < colorList.length; i++) {
        colorIDToValue[colorList[i].id] = colorList[i].value;
      }
    }
    // get all background image id references to their value
    if(renderInformation.listOfBackgroundImages){
      var imageList = renderInformation.listOfBackgroundImages.backgroundImages;
      var imageIDToValue = {};
      for (var i=0; i < imageList.length; i++) {
        imageIDToValue[imageList[i].id] = imageList[i].value;
      }
    }

    // convert style list to elementId-indexed object pointing to style
    // also convert color references to color values
    var styleList = renderInformation.listOfStyles.styles;
    var memberIDToStyle = {};
    for (var i=0; i < styleList.length; i++) {
      var style = styleList[i];
      var renderGroup = style.renderGroup;

      // convert color references
      if (renderGroup.stroke != null && colorIDToValue) {
        renderGroup.stroke = colorIDToValue[renderGroup.stroke];
      }
      if (renderGroup.fill != null && colorIDToValue) {
        renderGroup.fill = colorIDToValue[renderGroup.fill];
      }
      // convert background image references
      if (renderGroup.backgroundImage != null && imageIDToValue) {
        renderGroup.backgroundImage = imageIDToValue[renderGroup.backgroundImage];
      }

      var idList = style.idList.split(' ');
      for (var j=0; j < idList.length; j++) {
        var id = idList[j];
        memberIDToStyle[id] = renderGroup;
      }
    }

    function hexToDecimal (hex) {
      return Math.round(parseInt('0x'+hex) / 255 * 100) / 100;
    }

    function convertHexColor (hex) {
      if (hex.length == 7) { // no opacity provided
        return {opacity: null, color: hex};
      }
      else { // length of 9
        var color = hex.slice(0,7);
        var opacity = hexToDecimal(hex.slice(-2));
        return {opacity: opacity, color: color};
      }
    }

    var nodePropMap = {
      'background-color': 'fill',
      'background-opacity': 'backgroundOpacity',
      'border-color': 'stroke',
      'border-width': 'strokeWidth',
      'font-size': 'fontSize',
      'font-family': 'fontFamily',
      'font-style': 'fontStyle',
      'font-weight': 'fontWeight',
      'color': 'fontColor',
      'text-halign': 'textAnchor',
      'text-valign': 'vtextAnchor',
      'background-image': 'backgroundImage',
      'background-fit': 'backgroundFit',
      'background-position-x': 'backgroundPosX',
      'background-position-y': 'backgroundPosY',
      'background-width': 'backgroundWidth',
      'background-height': 'backgroundHeight',
      'background-image-opacity': 'backgroundImageOpacity',
      
    };

    var edgePropMap = {
      'line-color': 'stroke',
      'width': 'strokeWidth'
    };

    var infoboxPropMap = {
      'background-color': 'fill',
      'border-color': 'stroke',
      'border-width': 'strokeWidth',
      'font-size': 'fontSize',
      'font-weight': 'fontWeight',
      'font-style': 'fontStyle',
      'font-family': 'fontFamily',
      'font-color': 'fontColor'
    };

    var nodePropDetails = {
      'background-color': {
        'converter': convertHexColor,
        'extra-field': 'color'
      },
     /*  'background-opacity': {
        'converter': convertHexColor,
        'extra-field': 'opacity'
      }, */
      'border-color': {
        'converter': convertHexColor,
        'extra-field': 'color'
      }
    };

    var edgePropDetails = {
      'line-color': {
        'converter': convertHexColor,
        'extra-field': 'color'
      }
    };

    var infoboxPropDetails = {
      'font-color': {
        'converter': convertHexColor,
        'extra-field': 'color'
      },
      'border-color': {
        'converter': convertHexColor,
        'extra-field': 'color'
      }
    };

    function getElementId( ele ) {
      return ele.data.id;
    }

    function getInfoboxId( infobox ) {
      return infobox.id;
    }

    function setElementStyleProp( ele, name, value ) {
      ele.data[ name ] = value;
    }

    function setInfoboxStyleProp( infobox, name, value ) {
      infobox.style[ name ] = value;
    }

    // apply the style to list and overwrite the default style
    function overrideStyleProperties( list, propMap, propDetails, getId, setStyleProp ) {
      for (var i=0; i < list.length; i++) {
        var member = list[i];
        var memberStyle = memberIDToStyle[ getId( member ) ];

        if (!memberStyle) {
          return;
        }

        Object.keys( propMap ).forEach( function( propName ) {
          var fieldName = propMap[ propName ];
          var fieldVal = memberStyle[ fieldName ];
          if ( fieldVal !== undefined && fieldVal !== null ) {
            var details = propDetails && propDetails[ propName ];
            if ( details ) {
              if ( details[ 'converter' ] ) {
                fieldVal = details[ 'converter' ]( fieldVal );
              }

              if ( details[ 'extra-field' ] ) {
                fieldVal = fieldVal[ details[ 'extra-field' ] ];
              }
            }

            setStyleProp( member, propName, fieldVal );
          }
        } );

        // if the member is a node
        if ( member.data && member.data.statesandinfos ) {
          overrideStyleProperties( member.data.statesandinfos, infoboxPropMap, infoboxPropDetails, getInfoboxId, setInfoboxStyleProp );
        }
      }
    }

    overrideStyleProperties( nodes, nodePropMap, nodePropDetails, getElementId, setElementStyleProp );
    overrideStyleProperties( edges, edgePropMap, edgePropDetails, getElementId, setElementStyleProp );
  };

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

  sbmlToJson.convert = function (xmlString, urlParams) {
    console.log("converting to json")
    
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
      console.log("model.getNumSpecies()",model.getNumSpecies())
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
    console.log('plugin', plugin)

    let layoutplugin;
    let layout;    
    
    if(plugin) {
      layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
      layout = layoutplugin.layouts[0];
    }   
    console.log('layout', layout) 

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
      console.log("result", result)
      return result;
    }
    else {
      // add compartments, species and reactions
      console.log("in else part")
      sbmlToJson.addCompartments(model);
      sbmlToJson.addSpecies(model, cytoscapeJsNodes);
      sbmlToJson.addReactions(model, cytoscapeJsEdges);

      let result = resultJson;
      cytoscapeJsGraph.nodes = cytoscapeJsNodes
      cytoscapeJsGraph.edges = cytoscapeJsEdges
      resultJson = [];
      
      speciesCompartmentMap = new Map;
      console.log("cytoscapeJsGraph", cytoscapeJsGraph)
      return cytoscapeJsGraph;
    }
    
  };


// add compartment nodes
sbmlToJson.addCompartments = function (model) {
  
  for(let i = 0; i < model.getNumCompartments(); i++){
    let compartment = model.getCompartment(i);
    console.log("compartment", compartment)
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
    console.log("species", species)
    //speciesCompartmentMap.set(species.getId(), species.getCompartment());
    var sboTerm = species.getSBOTerm()

    //Create node obj
    var nodeObj = {};
    var styleObj = {};
    var tempBbox = {};
    tempBbox.x = 0
    tempBbox.y = 0
    tempBbox.w = 30
    tempBbox.h = 30
    if(sbmlToJson[sboTerm])
    {
      nodeObj.class = sbmlToJson[sboTerm]
    }
    else 
    {
      nodeObj.class = "simple molecule"
      tempBbox.w = 50
    tempBbox.h = 30
    }
    nodeObj.id = species.getId();
    
    nodeObj.bbox = tempBbox;   
    nodeObj.label = species.getName();
    nodeObj.statesandinfos = {};
    var cytoscapeJsNode = {data: nodeObj, style: styleObj};
    elementUtilities.extendNodeDataWithClassDefaults( nodeObj, nodeObj.class );
    console.log("cytoscapeJsNode", cytoscapeJsNode)

    //let speciesData = {"id": species.getId(), "label": species.getName(), "parent": species.getCompartment(), "sboTerm": species.getSBOTerm()};
    cytoscapeJsNodes.push(cytoscapeJsNode)
    console.log("cytoscapeJsNodes", cytoscapeJsNodes)
  }  
};

// add reaction nodes and corresponding edges
sbmlToJson.addReactions = function(model, cytoscapeJsEdges) {
  for(let i = 0; i < model.getNumReactions(); i++){

    let reaction = model.getReaction(i);
    let reactionParentMap = new Map();

    // add reactant->reaction edges
    for(let j = 0; j < reaction.getNumReactants(); j++){
      let reactant = reaction.getReactant(j);
      let reactantEdgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": reaction.getId()};
      resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "reactantEdge"});
      console.log("reactant", reactant)
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
      console.log("product", product)
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
      
      console.log("modifier", modifier)
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
};
return sbmlToJson;
};



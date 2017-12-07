var libsbgnjs = require('libsbgn.js');
var parseString = require('xml2js').parseString;
var libUtilities = require('./lib-utilities');
var classes = require('./classes');

module.exports = function () {
  var elementUtilities, graphUtilities;

  function sbgnmlToJson (param) {
    optionUtilities = param.optionUtilities;
    options = optionUtilities.getOptions();
    elementUtilities = param.elementUtilities;
    graphUtilities = param.graphUtilities;
  }

  sbgnmlToJson.insertedNodes = {};

  sbgnmlToJson.map = undefined;

  sbgnmlToJson.getAllCompartments = function (glyphList) {
    var compartments = [];

    for (var i = 0; i < glyphList.length; i++) {
      if (glyphList[i].class_ == 'compartment') {
        var compartment = glyphList[i];
        var bbox = compartment.bbox;
        compartments.push({
          'x': parseFloat(bbox.x),
          'y': parseFloat(bbox.y),
          'w': parseFloat(bbox.w),
          'h': parseFloat(bbox.h),
          'id': compartment.id
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

  sbgnmlToJson.isInBoundingBox = function (bbox1, bbox2) {
    if (bbox1.x > bbox2.x &&
        bbox1.y > bbox2.y &&
        bbox1.x + bbox1.w < bbox2.x + bbox2.w &&
        bbox1.y + bbox1.h < bbox2.y + bbox2.h) {
      return true;
    }
    return false;
  };

  sbgnmlToJson.bboxProp = function (ele) {
    var bbox = {};
    bbox.x = ele.bbox.x;
    bbox.y = ele.bbox.y;
    bbox.w = ele.bbox.w;
    bbox.h = ele.bbox.h;

    var childNodes = ele.glyphMembers;
    var minLeft, maxRight, minTop, maxBottom, childrenBboxW, childrenBboxH;
    var compound;

    // Traverse the other children and update the extreme values
    for (var i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];

      if (childNode.class_ === 'state variable' || childNode.class_ === 'unit of information') {
        continue; // Eleminate state variables and info boxes
      }

      compound = true;

      var childNodeBbox = childNode.bbox;
      var left = childNodeBbox.x;
      var right = childNodeBbox.x + childNodeBbox.w;
      var top = childNodeBbox.y;
      var bottom = childNodeBbox.y + childNodeBbox.h;

      if (minLeft === undefined || left < minLeft) {
        minLeft = left;
      }

      if (maxRight === undefined || right > maxRight) {
        maxRight = right;
      }

      if (minTop === undefined || top < minTop) {
        minTop = top;
      }

      if (maxBottom === undefined || bottom > maxBottom) {
        maxBottom = bottom;
      }
    }

    if (compound) {
      // The sizes of children bbox are determined by the difference between the extreme coordinates
      childrenBboxW = maxRight - minLeft;
      childrenBboxH = maxBottom - minTop;

      // If children bbox width is bigger than node bbox width set minWidth, and horizontal biases
      if (childrenBboxW < bbox.w) {
        ele.minWidth = bbox.w;
        var extraLeft =  minLeft - bbox.x;
        var extraRight = (bbox.x + bbox.w) - maxRight;

        ele.minWidthBiasLeft = extraLeft / (extraLeft + extraRight) * 100;
        ele.minWidthBiasRight = 100 - ele.minWidthBiasLeft;
      }

      // If children bbox height is bigger than node bbox height set minHeight, and vertical biases
      if (childrenBboxH < bbox.h) {
        ele.minHeight = bbox.h;
        var extraTop = minTop - bbox.y;
        var extraBottom = (bbox.y + bbox.h) - maxBottom;

        ele.minHeightBiasTop = extraTop / (extraTop + extraBottom) * 100;
        ele.minHeightBiasBottom = 100 - ele.minHeightBiasTop;
      }
    }

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;

    return bbox;
  };

  sbgnmlToJson.stateAndInfoBboxProp = function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    // don't copy directly ele.box because it contains other things than x y w h
    var bbox = {};
    bbox.x = ele.bbox.x;
    bbox.y = ele.bbox.y;
    bbox.w = ele.bbox.w;
    bbox.h = ele.bbox.h;

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2 - xPos;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2 - yPos;

    bbox.x = bbox.x / parseFloat(parentBbox.w) * 100;
    bbox.y = bbox.y / parseFloat(parentBbox.h) * 100;

    return bbox;
  };

  sbgnmlToJson.findChildNodes = function (ele, childTagName) {
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

  sbgnmlToJson.findChildNode = function (ele, childTagName) {
    var nodes = this.findChildNodes(ele, childTagName);
    return nodes.length > 0 ? nodes[0] : undefined;
  };

  sbgnmlToJson.stateAndInfoProp = function (ele, parent) {
    var self = this;
    var parentBbox = parent.bbox;
    var stateAndInfoArray = [];

    var childGlyphs = ele.glyphMembers; // this.findChildNodes(ele, 'glyph');

    // if a biological activity node has no unit of info, it must be a BA plain
    if(parent.class == "biological activity" && childGlyphs.length == 0) {
      parent.class = "BA plain";
    }

    for (var i = 0; i < childGlyphs.length; i++) {
      var glyph = childGlyphs[i];
      var info = {};

      if (glyph.class_ === 'unit of information') {
        var unitOfInformation = classes.UnitOfInformation.construct();
        if(glyph.entity) {
          // change the parent class according to its true class of biological activity
          switch(glyph.entity.name) {
            case 'unspecified entity':    parent.class = "BA unspecified entity"; break;
            case 'simple chemical':       parent.class = "BA simple chemical"; break;
            case 'macromolecule':         parent.class = "BA macromolecule"; break;
            case 'nucleic acid feature':  parent.class = "BA nucleic acid feature"; break;
            case 'perturbation':          parent.class = "BA perturbing agent"; break;
            case 'complex':               parent.class = "BA complex"; break;
          }
        }

        unitOfInformation.id = glyph.id || undefined;
        unitOfInformation.label = {
          'text': (glyph.label && glyph.label.text) || undefined
        };
        unitOfInformation.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        classes.UnitOfInformation.setAnchorSide(unitOfInformation);
        stateAndInfoArray.push(unitOfInformation);
      } else if (glyph.class_ === 'state variable') {
        var stateVariable = classes.StateVariable.construct();
        stateVariable.id = glyph.id || undefined;
        var state = glyph.state;
        stateVariable.state.value = (state && state.value) || undefined;
        stateVariable.state.variable = (state && state.variable) || undefined;
        stateVariable.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        classes.StateVariable.setAnchorSide(stateVariable);
        stateAndInfoArray.push(stateVariable);
      }
    }

    return stateAndInfoArray;
  };

  sbgnmlToJson.addParentInfoToNode = function (ele, nodeObj, parent, compartments) {
    var self = this;
    var compartmentRef = ele.compartmentRef;
    
    var assignDefaultParent = options.assignDefaultParent;
    assignDefaultParent = typeof assignDefaultParent === 'function' ? assignDefaultParent.call() : assignDefaultParent;

    if (parent) {
      nodeObj.parent = parent;
    } else if (compartmentRef) {
      nodeObj.parent = compartmentRef;
    } else if(assignDefaultParent) {
      nodeObj.parent = '';

      // add compartment according to geometry
      for (var i = 0; i < compartments.length; i++) {
        var bbox = {
          'x': parseFloat(ele.bbox.x),
          'y': parseFloat(ele.bbox.y),
          'w': parseFloat(ele.bbox.w),
          'h': parseFloat(ele.bbox.h),
          'id': ele.id
        };
        if (self.isInBoundingBox(bbox, compartments[i])) {
          nodeObj.parent = compartments[i].id;
          break;
        }
      }
    }
  };

  sbgnmlToJson.addCytoscapeJsNode = function (ele, jsonArray, parent, compartments) {
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

    // add class information
    nodeObj.class = ele.class_;
    // add label information
    nodeObj.label = (ele.label && ele.label.text) || undefined;
    // add state and info box information
    nodeObj.statesandinfos = self.stateAndInfoProp(ele, nodeObj);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);
    // add language info, this will always be the mapType
    nodeObj.language = elementUtilities.mapType;

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
  sbgnmlToJson.handleAnnotations = function(cyObject, rdfElement) {
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
      var relation = libsbgnjs.annot.Util.reducePrefix(fullQualifier);
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

  sbgnmlToJson.traverseNodes = function (ele, jsonArray, parent, compartments) {
    var elId = ele.id;
    if (!elementUtilities.handledElements[ele.class_]) {
      return;
    }
    this.insertedNodes[elId] = true;
    var self = this;
    // add complex nodes here

    var eleClass = ele.class_;

    if (eleClass === 'complex' || eleClass === 'complex multimer' || eleClass === 'submap') {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);

      var childGlyphs = ele.glyphMembers;
      for (var i = 0; i < childGlyphs.length; i++) {
        var glyph = childGlyphs[i];
        var glyphClass = glyph.class_;
        if (glyphClass !== 'state variable' && glyphClass !== 'unit of information') {
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

  sbgnmlToJson.getPorts = function (xmlObject) {
    return ( xmlObject._cachedPorts = xmlObject._cachedPorts || xmlObject.querySelectorAll('port'));
  };

  sbgnmlToJson.getGlyphs = function (xmlObject) {
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

  sbgnmlToJson.getGlyphById = function (xmlObject, id) {
    this.getGlyphs(xmlObject); // make sure cache is built

    return xmlObject._id2glyph[id];
  };

  sbgnmlToJson.getArcSourceAndTarget = function (arc, xmlObject) {
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

  sbgnmlToJson.getArcBendPointPositions = function (ele) {
    var bendPointPositions = [];

    var children = ele.nexts;

    for (var i = 0; i < children.length; i++) {
      var posX = children[i].x;
      var posY = children[i].y;

      bendPointPositions.push({
        x: posX,
        y: posY
      });
    }

    return bendPointPositions;
  };

  sbgnmlToJson.addCytoscapeJsEdge = function (ele, jsonArray, xmlObject) {
    if (!elementUtilities.handledElements[ele.class_]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);

    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }

    var edgeObj = {};
    var styleObj = {};
    var bendPointPositions = self.getArcBendPointPositions(ele);

    edgeObj.id = ele.id || undefined;
    edgeObj.class = ele.class_;
    edgeObj.bendPointPositions = bendPointPositions;
    // add language info, this will always be the mapType
    edgeObj.language = elementUtilities.mapType;

    edgeObj.cardinality = 0;
    if (ele.glyphs.length > 0) {
      for (var i = 0; i < ele.glyphs.length; i++) {
        if (ele.glyphs[i].class_ === 'cardinality') {
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

  sbgnmlToJson.applyStyle = function (renderInformation, nodes, edges) {
    // get all color id references to their value
    var colorList = renderInformation.listOfColorDefinitions.colorDefinitions;
    var colorIDToValue = {};
    for (var i=0; i < colorList.length; i++) {
      colorIDToValue[colorList[i].id] = colorList[i].value;
    }

    // convert style list to elementId-indexed object pointing to style
    // also convert color references to color values
    var styleList = renderInformation.listOfStyles.styles;
    var elementIDToStyle = {};
    for (var i=0; i < styleList.length; i++) {
      var style = styleList[i];
      var renderGroup = style.renderGroup;

      // convert color references
      if (renderGroup.stroke != null) {
        renderGroup.stroke = colorIDToValue[renderGroup.stroke];
      }
      if (renderGroup.fill != null) {
        renderGroup.fill = colorIDToValue[renderGroup.fill];
      }

      var idList = style.idList.split(' ');
      for (var j=0; j < idList.length; j++) {
        var id = idList[j];
        elementIDToStyle[id] = renderGroup;
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

    // apply the style to nodes and overwrite the default style
    for (var i=0; i < nodes.length; i++) {
      var node = nodes[i];
      // special case for color properties, we need to check opacity
      var bgColor = elementIDToStyle[node.data['id']].fill;
      if (bgColor) {
        var res = convertHexColor(bgColor);
        node.data['background-color'] = res.color;
        node.data['background-opacity'] = res.opacity;
      }

      var borderColor = elementIDToStyle[node.data['id']].stroke;
      if (borderColor) {
        var res = convertHexColor(borderColor);
        node.data['border-color'] = res.color;
      }

      var borderWidth = elementIDToStyle[node.data['id']].strokeWidth;
      if (borderWidth) {
        node.data['border-width'] = borderWidth;
      }

      var fontSize = elementIDToStyle[node.data['id']].fontSize;
      if (fontSize) {
        node.data['font-size'] = fontSize;
      }

      var fontFamily = elementIDToStyle[node.data['id']].fontFamily;
      if (fontFamily) {
        node.data['font-family'] = fontFamily;
      }

      var fontStyle = elementIDToStyle[node.data['id']].fontStyle;
      if (fontStyle) {
        node.data['font-style'] = fontStyle;
      }

      var fontWeight = elementIDToStyle[node.data['id']].fontWeight;
      if (fontWeight) {
        node.data['font-weight'] = fontWeight;
      }

      var textAnchor = elementIDToStyle[node.data['id']].textAnchor;
      if (textAnchor) {
        node.data['text-halign'] = textAnchor;
      }

      var vtextAnchor = elementIDToStyle[node.data['id']].vtextAnchor;
      if (vtextAnchor) {
        node.data['text-valign'] = vtextAnchor;
      }
    }

    // do the same for edges
    for (var i=0; i < edges.length; i++) {
      var edge = edges[i];

      var lineColor = elementIDToStyle[edge.data['id']].stroke;
      if (lineColor) {
        var res = convertHexColor(lineColor);
        edge.data['line-color'] = res.color;
      }

      var width = elementIDToStyle[edge.data['id']].strokeWidth;
      if (width) {
        edge.data['width'] = width;
      }
    }
  };

  sbgnmlToJson.mapPropertiesToObj = function() {
    if (this.map.extension && this.map.extension.has('mapProperties')) { // render extension was found
       var xml = this.map.extension.get('mapProperties');
       var obj;
       parseString(xml, function (err, result) {
          obj = result;
       });
       return obj;
    }
  };

  sbgnmlToJson.convert = function (xmlObject) {
    var self = this;
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];
    var compartmentChildrenMap = {}; // Map compartments children temporarily

    var sbgn;
    try {
      var xmlString = new XMLSerializer().serializeToString(xmlObject);
      sbgn = libsbgnjs.Sbgn.fromXML(xmlString);
    }
    catch (err) {
      throw new Error("Could not parse sbgnml. "+ err);
    }

    var map;
    if(sbgn.maps.length < 1) { // empty sbgn
      return {nodes: [], edges: []};
    }
    else {
      map = sbgn.maps[0]; // take first map of the file as the main map
    }

    this.map = map;
    if(map.language == "process description") {
      elementUtilities.mapType = "PD";
    }
    else if(map.language == "activity flow") {
      elementUtilities.mapType = "AF";
    }
    else {
      elementUtilities.mapType = "Unknown";
    }

    var compartments = self.getAllCompartments(map.glyphs);

    var glyphs = map.glyphs;
    var arcs = map.arcs;

    var i;
    for (i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];

      // libsbgn library lists the glyphs of complexes in ele.glyphMembers but it does not store the glyphs of compartments
      // store glyph members of compartments here.
      var compartmentRef = glyph.compartmentRef;

      if (glyph.class_ === 'compartment') {
        if (compartmentChildrenMap[glyph.id] === undefined) {
          compartmentChildrenMap[glyph.id] = [];
        }

        glyph.glyphMembers = compartmentChildrenMap[glyph.id];
      }

      if (compartmentRef) {
        if (compartmentChildrenMap[compartmentRef] === undefined) {
          compartmentChildrenMap[compartmentRef] = [];
        }
        compartmentChildrenMap[compartmentRef].push(glyph);
      }
    }

    for (i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];
      self.traverseNodes(glyph, cytoscapeJsNodes, '', compartments);
    }

    for (i = 0; i < arcs.length; i++) {
      var arc = arcs[i];
      self.addCytoscapeJsEdge(arc, cytoscapeJsEdges, xmlObject);
    }

    if (map.extension && map.extension.has('renderInformation')) { // render extension was found
      self.applyStyle(map.extension.get('renderInformation'), cytoscapeJsNodes, cytoscapeJsEdges);
    }

    var cytoscapeJsGraph = {};
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  };

  return sbgnmlToJson;
};

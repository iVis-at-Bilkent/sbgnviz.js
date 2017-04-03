var elementUtilities = require('./element-utilities');
var renderExtension = require('./sbgnml-render');

var sbgnmlToJson = {
  insertedNodes: {},
  getAllCompartments: function (xmlObject) {
    var compartments = [];

    var compartmentEls = xmlObject.querySelectorAll("glyph[class='compartment']");

    for (var i = 0; i < compartmentEls.length; i++) {
      var compartment = compartmentEls[i];
      var bbox = this.findChildNode(compartment, 'bbox');
      compartments.push({
        'x': parseFloat(bbox.getAttribute('x')),
        'y': parseFloat(bbox.getAttribute('y')),
        'w': parseFloat(bbox.getAttribute('w')),
        'h': parseFloat(bbox.getAttribute('h')),
        'id': compartment.getAttribute('id')
      });
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
  },
  isInBoundingBox: function (bbox1, bbox2) {
    if (bbox1.x > bbox2.x &&
        bbox1.y > bbox2.y &&
        bbox1.x + bbox1.w < bbox2.x + bbox2.w &&
        bbox1.y + bbox1.h < bbox2.y + bbox2.h) {
      return true;
    }
    return false;
  },
  bboxProp: function (ele) {
    var bbox = ele.querySelector('bbox');

    bbox.x = bbox.getAttribute('x');
    bbox.y = bbox.getAttribute('y');
    bbox.w = bbox.getAttribute('w');
    bbox.h = bbox.getAttribute('h');
    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;

    return bbox;
  },
  stateAndInfoBboxProp: function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    var bbox = ele.querySelector('bbox');

    bbox.x = bbox.getAttribute('x');
    bbox.y = bbox.getAttribute('y');
    bbox.w = bbox.getAttribute('w');
    bbox.h = bbox.getAttribute('h');

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2 - xPos;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2 - yPos;

    bbox.x = bbox.x / parseFloat(parentBbox.w) * 100;
    bbox.y = bbox.y / parseFloat(parentBbox.h) * 100;

    return bbox;
  },
  findChildNodes: function (ele, childTagName) {
    // find child nodes at depth level of 1 relative to the element
    var children = [];
    for (var i = 0; i < ele.childNodes.length; i++) {
      var child = ele.childNodes[i];
      if (child.nodeType === 1 && child.tagName === childTagName) {
        children.push(child);
      }
    }
    return children;
  },
  findChildNode: function (ele, childTagName) {
    var nodes = this.findChildNodes(ele, childTagName);
    return nodes.length > 0 ? nodes[0] : undefined;
  },
  stateAndInfoProp: function (ele, parentBbox) {
    var self = this;
    var stateAndInfoArray = [];

    var childGlyphs = this.findChildNodes(ele, 'glyph');

    for (var i = 0; i < childGlyphs.length; i++) {
      var glyph = childGlyphs[i];
      var info = {};

      if (glyph.className === 'unit of information') {
        info.id = glyph.getAttribute('id') || undefined;
        info.clazz = glyph.className || undefined;
        var label = glyph.querySelector('label');
        info.label = {
          'text': (label && label.getAttribute('text')) || undefined
        };
        info.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        stateAndInfoArray.push(info);
      } else if (glyph.className === 'state variable') {
        info.id = glyph.getAttribute('id') || undefined;
        info.clazz = glyph.className || undefined;
        var state = glyph.querySelector('state');
        var value = (state && state.getAttribute('value')) || undefined;
        var variable = (state && state.getAttribute('variable')) || undefined;
        info.state = {
          'value': value,
          'variable': variable
        };
        info.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        stateAndInfoArray.push(info);
      }
    }


    return stateAndInfoArray;
  },
  addParentInfoToNode: function (ele, nodeObj, parent, compartments) {
    var self = this;
    var compartmentRef = ele.getAttribute('compartmentRef');

    if (parent) {
      nodeObj.parent = parent;
      return;
    }

    if (compartmentRef) {
      nodeObj.parent = compartmentRef;
    } else {
      nodeObj.parent = '';

      // add compartment according to geometry
      for (var i = 0; i < compartments.length; i++) {
        var bboxEl = self.findChildNode(ele, 'bbox');
        var bbox = {
          'x': parseFloat(bboxEl.getAttribute('x')),
          'y': parseFloat(bboxEl.getAttribute('y')),
          'w': parseFloat(bboxEl.getAttribute('w')),
          'h': parseFloat(bboxEl.getAttribute('h')),
          'id': ele.getAttribute('id')
        };
        if (self.isInBoundingBox(bbox, compartments[i])) {
          nodeObj.parent = compartments[i].id;
          break;
        }
      }
    }
  },
  addCytoscapeJsNode: function (ele, jsonArray, parent, compartments) {
    var self = this;
    var nodeObj = {};

    // add id information
    nodeObj.id = ele.getAttribute('id');
    // add node bounding box information
    nodeObj.bbox = self.bboxProp(ele);
    // add class information
    nodeObj.class = ele.className;
    // add label information
    var label = self.findChildNode(ele, 'label');
    nodeObj.label = (label && label.getAttribute('text')) || undefined;
    // add state and info box information
    nodeObj.statesandinfos = self.stateAndInfoProp(ele, nodeObj.bbox);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);

    // add clone information
    var cloneMarkers = self.findChildNodes(ele, 'clone');
    if (cloneMarkers.length > 0) {
      nodeObj.clonemarker = true;
    } else {
      nodeObj.clonemarker = undefined;
    }

    // add port information
    var ports = [];
    var portElements = ele.querySelectorAll('port');

    for (var i = 0; i < portElements.length; i++) {
      var portEl = portElements[i];
      var id = portEl.getAttribute('id');
      var relativeXPos = parseFloat(portEl.getAttribute('x')) - nodeObj.bbox.x;
      var relativeYPos = parseFloat(portEl.getAttribute('y')) - nodeObj.bbox.y;

      relativeXPos = relativeXPos / parseFloat(nodeObj.bbox.w) * 100;
      relativeYPos = relativeYPos / parseFloat(nodeObj.bbox.h) * 100;

      ports.push({
        id: id,
        x: relativeXPos,
        y: relativeYPos
      });
    }

    nodeObj.ports = ports;

    var cytoscapeJsNode = {data: nodeObj};
    jsonArray.push(cytoscapeJsNode);
  },
  traverseNodes: function (ele, jsonArray, parent, compartments) {
    var elId = ele.getAttribute('id');
    if (!elementUtilities.handledElements[ele.className]) {
      return;
    }
    this.insertedNodes[elId] = true;
    var self = this;
    // add complex nodes here

    var eleClass = ele.className;

    if (eleClass === 'complex' || eleClass === 'complex multimer' || eleClass === 'submap') {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);

      var childGlyphs = self.findChildNodes(ele, 'glyph');
      for (var i = 0; i < childGlyphs.length; i++) {
        var glyph = childGlyphs[i];
        var glyphClass = glyph.className;
        if (glyphClass !== 'state variable' && glyphClass !== 'unit of information') {
          self.traverseNodes(glyph, jsonArray, elId, compartments);
        }
      }
    } else {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);
    }
  },
  getPorts: function (xmlObject) {
    return ( xmlObject._cachedPorts = xmlObject._cachedPorts || xmlObject.querySelectorAll('port'));
  },
  getGlyphs: function (xmlObject) {
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
  },
  getGlyphById: function (xmlObject, id) {
    this.getGlyphs(xmlObject); // make sure cache is built

    return xmlObject._id2glyph[id];
  },
  getArcSourceAndTarget: function (arc, xmlObject) {
    // source and target can be inside of a port
    var source = arc.getAttribute('source');
    var target = arc.getAttribute('target');
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
  },

  getArcBendPointPositions: function (ele) {
    var bendPointPositions = [];

    var children = this.findChildNodes(ele, 'next');

    for (var i = 0; i < children.length; i++) {
      var posX = children[i].getAttribute('x');
      var posY = children[i].getAttribute('y');

      bendPointPositions.push({
        x: posX,
        y: posY
      });
    }

    return bendPointPositions;
  },
  addCytoscapeJsEdge: function (ele, jsonArray, xmlObject) {
    if (!elementUtilities.handledElements[ele.className]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);

    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }

    var edgeObj = {};
    var bendPointPositions = self.getArcBendPointPositions(ele);

    edgeObj.id = ele.getAttribute('id') || undefined;
    edgeObj.class = ele.className;
    edgeObj.bendPointPositions = bendPointPositions;

    var glyphChildren = self.findChildNodes(ele, 'glyph');
    var glyphDescendents = ele.querySelectorAll('glyph');
    if (glyphDescendents.length <= 0) {
      edgeObj.cardinality = 0;
    } else {
      for (var i = 0; i < glyphChildren.length; i++) {
        if (glyphChildren[i].className === 'cardinality') {
          var label = glyphChildren[i].querySelector('label');
          edgeObj.cardinality = label.getAttribute('text') || undefined;
        }
      }
    }

    edgeObj.source = sourceAndTarget.source;
    edgeObj.target = sourceAndTarget.target;

    edgeObj.portsource = ele.getAttribute('source');
    edgeObj.porttarget = ele.getAttribute('target');

    var cytoscapeJsEdge = {data: edgeObj};
    jsonArray.push(cytoscapeJsEdge);
  },
  applyStyle: function (xmlRenderExt, nodes, edges) {
    // parse the render extension
    var renderInformation = renderExtension.RenderInformation.fromXML(xmlRenderExt);

    // get all color id references to their value
    var colorList = renderInformation.listOfColorDefinitions.colorList;
    var colorIDToValue = {};
    for (var i=0; i < colorList.length; i++) {
      colorIDToValue[colorList[i].id] = colorList[i].value;
    }

    // convert style list to elementId-indexed object pointing to style
    // also convert color references to color values
    var styleList = renderInformation.listOfStyles.styleList;
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

      for (var j=0; j < style.idList.length; j++) {
        var id = style.idList[j];
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
  },
  convert: function (xmlObject) {
    var self = this;
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];

    var compartments = self.getAllCompartments(xmlObject);

    var extension = xmlObject.querySelector('extension'); // may not be here
    var renderInformation;
    if (extension) {
      renderInformation = self.findChildNode(extension, 'renderInformation');
    }
    var glyphs = self.findChildNodes(xmlObject.querySelector('map'), 'glyph');
    var arcs = self.findChildNodes(xmlObject.querySelector('map'), 'arc');

    var i;
    for (i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];
      self.traverseNodes(glyph, cytoscapeJsNodes, '', compartments);
    }

    for (i = 0; i < arcs.length; i++) {
      var arc = arcs[i];
      self.addCytoscapeJsEdge(arc, cytoscapeJsEdges, xmlObject);
    }

    if (renderInformation) { // render extension was found
      self.applyStyle(renderInformation, cytoscapeJsNodes, cytoscapeJsEdges);
    }

    var cytoscapeJsGraph = {};
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  }
};

module.exports = sbgnmlToJson;

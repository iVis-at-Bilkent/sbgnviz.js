(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
  var sbgnviz = window.sbgnviz = function(_options) {
    var optionUtilities = _dereq_('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options);
    
    var sbgnRenderer = _dereq_('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var sbgnCyInstance = _dereq_('./sbgn-extensions/sbgn-cy-instance');
    
    // Utilities whose functions will be exposed seperately
    var uiUtilities = _dereq_('./utilities/ui-utilities');
    var fileUtilities = _dereq_('./utilities/file-utilities');
    var sbgnGraphUtilities = _dereq_('./utilities/sbgn-graph-utilities');
    var mainUtilities = _dereq_('./utilities/main-utilities');
    // Utilities to be exposed as is
    var sbgnElementUtilities = _dereq_('./utilities/sbgn-element-utilities');
    var undoRedoActionFunctions = _dereq_('./utilities/undo-redo-action-functions');
    
    var libs = options.libs;
    
    sbgnRenderer();
    sbgnCyInstance();
    
    // Expose the api
    // Expose sbgnElementUtilities and undoRedoActionFunctions as is, most users will not need these
    sbgnviz.sbgnElementUtilities = sbgnElementUtilities;
    sbgnviz.undoRedoActionFunctions = undoRedoActionFunctions;
    
    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      sbgnviz[prop] = mainUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in fileUtilities) {
      sbgnviz[prop] = fileUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in uiUtilities) {
      sbgnviz[prop] = uiUtilities[prop];
    }
    
    // Expose each sbgn graph utility seperately
    for (var prop in sbgnGraphUtilities) {
      sbgnviz[prop] = sbgnGraphUtilities[prop];
    }
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();
},{"./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer":2,"./sbgn-extensions/sbgn-cy-instance":3,"./utilities/file-utilities":4,"./utilities/main-utilities":6,"./utilities/option-utilities":7,"./utilities/sbgn-element-utilities":8,"./utilities/sbgn-graph-utilities":9,"./utilities/ui-utilities":12,"./utilities/undo-redo-action-functions":13}],2:[function(_dereq_,module,exports){
module.exports = function () {
  var $$ = cytoscape;
  var truncateText = _dereq_('../utilities/text-utilities').truncateText;
  
  var sbgnShapes = $$.sbgnShapes = {
    'source and sink': true,
    'nucleic acid feature': true,
    'complex': true,
    'dissociation': true,
    'macromolecule': true,
    'simple chemical': true,
    'unspecified entity': true,
    'necessary stimulation': true,
    'process': true,
    'uncertain process': true,
    'omitted process': true,
    'association': true
  };

  var totallyOverridenNodeShapes = $$.totallyOverridenNodeShapes = {
    'macromolecule': true,
    'nucleic acid feature': true,
    'simple chemical': true,
    'complex': true,
    'unspecified entity': true,
    'process': true,
    'uncertain process': true,
    'omitted process': true,
    'dissociation': true,
    'association': true
  };

  $$.sbgn = {
  };

  $$.sbgn.cardinalityProperties = function () {
    return {
      boxLength: 13,
      distanceToNode: 25,
    };
  };

  $$.sbgn.drawCardinalityText = function (context, textProp) {
    textProp.color = "#0f0f0f";
    textProp.font = "9px Arial";
    $$.sbgn.drawText(context, textProp, false);
  };

  $$.sbgn.addPortReplacementIfAny = function (node, edgePort) {
    var posX = node.position().x;
    var posY = node.position().y;
    if (typeof node._private.data.ports != 'undefined') {
      for (var i = 0; i < node._private.data.ports.length; i++) {
        var port = node._private.data.ports[i];
        if (port.id == edgePort) {
          posX = posX + port.x * node.width() / 100;
          posY = posY + port.y * node.height() / 100;
          break;
        }
      }
    }
    return {'x': posX, 'y': posY};
  }
  ;

  $$.sbgn.drawPortsToPolygonShape = function (context, node, points) {
    var width = node.width();
    var height = node.height();
    var centerX = node._private.position.x;
    var centerY = node._private.position.y;
    var padding = parseInt(node.css('border-width')) / 2;

    for (var i = 0; i < node._private.data.ports.length; i++) {
      var port = node._private.data.ports[i];
      var portX = port.x * width / 100 + centerX;
      var portY = port.y * height / 100 + centerY;
      var closestPoint = cyVariables.cyMath.polygonIntersectLine(portX, portY,
              points, centerX, centerY, width / 2, height / 2, padding);
      context.beginPath();
      context.moveTo(portX, portY);
      context.lineTo(closestPoint[0], closestPoint[1]);
      context.stroke();
      context.closePath();


      //add a little black circle to ports
      var oldStyle = context.fillStyle;
      context.fillStyle = $$.sbgn.colors.port;
      $$.sbgn.drawEllipse(context, portX, portY, 2, 2);
      context.fillStyle = oldStyle;
      context.stroke();
    }
  };

  $$.sbgn.drawQuadraticLineCardinality = function (context, edge, pts, type) {
    context.moveTo(pts[0], pts[1]);
    context.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]);

    //if cardinality is zero, return here.
    var cardinality = edge._private.data.sbgncardinality;
    if (cardinality == 0 || cardinality == null)
      return;

    var carProp = $$.sbgn.cardinalityProperties();

    var totalLength = qBezierLength(pts);

    var startLength = totalLength - 25;

    var startPortion = startLength / totalLength;

    if (type === "consumption") {
      startPortion = carProp.distanceToSource / totalLength;
    } else {
      startPortion = (totalLength - carProp.distanceToTarget) / totalLength;
    }

    var t = startPortion;
    var x1 = (1 - t) * (1 - t) * pts[0] + 2 * (1 - t) * t * pts[2] + t * t * pts[4];
    var y1 = (1 - t) * (1 - t) * pts[1] + 2 * (1 - t) * t * pts[3] + t * t * pts[5];

    //get a short line to determine tanget line
    t = startPortion + 0.01;
    var x2 = (1 - t) * (1 - t) * pts[0] + 2 * (1 - t) * t * pts[2] + t * t * pts[4];
    var y2 = (1 - t) * (1 - t) * pts[1] + 2 * (1 - t) * t * pts[3] + t * t * pts[5];

    var dispX = x1 - x2;
    var dispY = y1 - y2;

    var angle = Math.asin(dispY / (Math.sqrt(dispX * dispX + dispY * dispY)));

    if (dispX < 0) {
      angle = angle + Math.PI / 2;
    } else {
      angle = -(Math.PI / 2 + angle);
    }


    context.translate(x1, y1);
    context.rotate(-angle);

    context.rect(0, -13 / 2, 13, 13);

    context.rotate(-Math.PI / 2);

    var textProp = {'centerX': 0, 'centerY': 13 / 2,
      'opacity': edge.css('text-opacity') * edge.css('opacity'),
      'width': 13, 'label': cardinality};
    $$.sbgn.drawCardinalityText(context, textProp);

    context.rotate(Math.PI / 2);

    context.rotate(angle);
    context.translate(-x1, -y1);

  };

  $$.sbgn.drawStraightLineCardinality = function (context, edge, pts, type) {
    context.moveTo(pts[0], pts[1]);
    context.lineTo(pts[2], pts[3]);

    //if cardinality is zero, return here.
    var cardinality = edge._private.data.sbgncardinality;
    if (cardinality <= 0 || cardinality == null)
      return;

    var carProp = $$.sbgn.cardinalityProperties();

    var length = (Math.sqrt((pts[2] - pts[0]) * (pts[2] - pts[0]) +
            (pts[3] - pts[1]) * (pts[3] - pts[1])));

    var dispX, dispY, startX, startY;

    //TODO : you may need to change here
    if (type === "consumption") {
      startX = edge._private.rscratch.arrowStartX;
      startY = edge._private.rscratch.arrowStartY;
    } else {
      startX = edge._private.rscratch.arrowEndX;
      startY = edge._private.rscratch.arrowEndY;
    }
    var srcPos = (type === "consumption") ? edge.source().position() : edge.target().position();
    //var srcPos = edge.source().position();
    dispX = startX - srcPos.x;
    dispY = startY - srcPos.y;

    var angle = Math.asin(dispY / (Math.sqrt(dispX * dispX + dispY * dispY)));

    if (dispX < 0) {
      angle = angle + Math.PI / 2;
    } else {
      angle = -(Math.PI / 2 + angle);
    }

    context.translate(startX, startY);
    context.rotate(-angle);

    if (length > carProp.distanceToNode) {
      context.rect(0, -carProp.distanceToNode, carProp.boxLength, carProp.boxLength);

      context.rotate(Math.PI / 2);

      var textProp = {'centerX': -carProp.distanceToNode + carProp.boxLength / 2, 'centerY': -carProp.boxLength / 2,
        'opacity': edge.css('text-opacity') * edge.css('opacity'),
        'width': carProp.boxLength, 'label': cardinality};
      $$.sbgn.drawCardinalityText(context, textProp);

      context.rotate(-Math.PI / 2);
    }

    context.rotate(angle);
    context.translate(-startX, -startY);
  }
  ;

  var unitOfInfoRadius = 4;
  var stateVarRadius = 15;
  $$.sbgn.drawComplexStateAndInfo = function (context, node, stateAndInfos,
          centerX, centerY, width, height) {

    //This is a temporary workaround
    $$.sbgn.drawEllipse(context, centerX, centerY, 0, 0);

    var upWidth = 0, downWidth = 0;
    var boxPadding = 10, betweenBoxPadding = 5;
    var beginPosY = height / 2, beginPosX = width / 2;

    stateAndInfos.sort($$.sbgn.compareStates);

    for (var i = 0; i < stateAndInfos.length; i++) {
      var state = stateAndInfos[i];
      var stateWidth = state.bbox.w;
      var stateHeight = state.bbox.h;
//      var stateLabel = state.state.value;
      var relativeYPos = state.bbox.y;
      var stateCenterX, stateCenterY;

      if (relativeYPos < 0) {
        if (upWidth + stateWidth < width) {
          stateCenterX = centerX - beginPosX + boxPadding + upWidth + stateWidth / 2;
          stateCenterY = centerY - beginPosY;

          var textProp = {'centerX': stateCenterX, 'centerY': stateCenterY,
            'opacity': node.css('text-opacity') * node.css('opacity'),
            'width': stateWidth, 'height': stateHeight};

          if (state.clazz == "state variable") {//draw ellipse
            cyVariables.cyRenderer.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            cyVariables.cyRenderer.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight,
                    Math.min(stateWidth / 2, stateHeight / 2, unitOfInfoRadius));
            context.fill();

            textProp.label = state.label.text;
            $$.sbgn.drawInfoText(context, textProp);
          }
        }
        upWidth = upWidth + width + boxPadding;
      } else if (relativeYPos > 0) {
        if (downWidth + stateWidth < width) {
          stateCenterX = centerX - beginPosX + boxPadding + downWidth + stateWidth / 2;
          stateCenterY = centerY + beginPosY;

          var textProp = {'centerX': stateCenterX, 'centerY': stateCenterY,
            'opacity': node.css('text-opacity') * node.css('opacity'),
            'width': stateWidth, 'height': stateHeight};

          if (state.clazz == "state variable") {//draw ellipse
            cyVariables.cyRenderer.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            cyVariables.cyRenderer.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight,
                    Math.min(stateWidth / 2, stateHeight / 2, unitOfInfoRadius));
            context.fill();

            textProp.label = state.label.text;
            $$.sbgn.drawInfoText(context, textProp);
          }
        }
        downWidth = downWidth + width + boxPadding;
      }
      context.stroke();

      //This is a temporary workaround
      $$.sbgn.drawEllipse(context, centerX, centerY, 0, 0);

      //update new state and info position(relative to node center)
      state.bbox.x = (stateCenterX - centerX) * 100 / node.width();
      state.bbox.y = (stateCenterY - centerY) * 100 / node.height();
    }
  };

  $$.sbgn.drawStateText = function (context, textProp) {
    var stateValue = textProp.state.value || '';
    var stateVariable = textProp.state.variable || '';

    var stateLabel = stateValue + (stateVariable
            ? "@" + stateVariable
            : "");

    var fontSize = parseInt(textProp.height / 1.5);

    textProp.font = fontSize + "px Arial";
    textProp.label = stateLabel;
    textProp.color = "#0f0f0f";
    $$.sbgn.drawText(context, textProp);
  };

  $$.sbgn.drawInfoText = function (context, textProp) {
    var fontSize = parseInt(textProp.height / 1.5);
    textProp.font = fontSize + "px Arial";
    textProp.color = "#0f0f0f";
    $$.sbgn.drawText(context, textProp);
  };

  $$.sbgn.drawText = function (context, textProp, truncate) {
    var oldFont = context.font;
    context.font = textProp.font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    var oldStyle = context.fillStyle;
    context.fillStyle = textProp.color;
    var oldOpacity = context.globalAlpha;
    context.globalAlpha = textProp.opacity;
    var text;
    
    textProp.label = textProp.label || '';
    
    if (truncate == false) {
      text = textProp.label;
    } else {
      text = truncateText(textProp, context.font);
    }
    
    context.fillText(text, textProp.centerX, textProp.centerY);
    context.fillStyle = oldStyle;
    context.font = oldFont;
    context.globalAlpha = oldOpacity;
    //context.stroke();
  };

  cyVariables.cyMath.calculateDistance = function (point1, point2) {
    var distance = Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2);
    return Math.sqrt(distance);
  };

  $$.sbgn.colors = {
    clone: "#a9a9a9",
    association: "#6B6B6B",
    port: "#6B6B6B"
  };


  $$.sbgn.drawStateAndInfos = function (node, context, centerX, centerY) {
    var stateAndInfos = node._private.data.sbgnstatesandinfos;

    for (var i = 0; i < stateAndInfos.length && i < 4; i++) {
      var state = stateAndInfos[i];
      var stateWidth = state.bbox.w;
      var stateHeight = state.bbox.h;
      var stateCenterX = state.bbox.x * node.width() / 100 + centerX;
      var stateCenterY = state.bbox.y * node.height() / 100 + centerY;

      var textProp = {'centerX': stateCenterX, 'centerY': stateCenterY,
        'opacity': node.css('text-opacity') * node.css('opacity'),
        'width': stateWidth, 'height': stateHeight};

      if (state.clazz == "state variable") {//draw ellipse
        //var stateLabel = state.state.value;
        cyVariables.cyRenderer.drawRoundRectanglePath(context, stateCenterX, stateCenterY,
                stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));

        context.fill();
        textProp.state = state.state;
        $$.sbgn.drawStateText(context, textProp);

        context.stroke();

      } else if (state.clazz == "unit of information") {//draw rectangle
        cyVariables.cyRenderer.drawRoundRectanglePath(context,
                stateCenterX, stateCenterY,
                stateWidth, stateHeight,
                Math.min(stateWidth / 2, stateHeight / 2, unitOfInfoRadius));

        context.fill();

        textProp.label = state.label.text || '';
        $$.sbgn.drawInfoText(context, textProp);

        context.stroke();
      }
    }
    //This is a temporary workaround
    $$.sbgn.drawEllipse(context, centerX, centerY, 0, 0);
  };

  $$.sbgn.nucleicAcidCheckPoint = function (x, y, centerX, centerY, node, threshold, points, cornerRadius) {
    var width = node.width();
    var height = node.height();
    var padding = parseInt(node.css('border-width')) / 2;

    //check rectangle at top
    if (cyVariables.cyMath.pointInsidePolygon(x, y, points,
            centerX, centerY - cornerRadius / 2, width, height - cornerRadius / 3, [0, -1],
            padding)) {
      return true;
    }

    //check rectangle at bottom
    if (cyVariables.cyMath.pointInsidePolygon(x, y, points,
            centerX, centerY + height / 2 - cornerRadius / 2, width - 2 * cornerRadius, cornerRadius, [0, -1],
            padding)) {
      return true;
    }

    //check ellipses
    var checkInEllipse = function (x, y, centerX, centerY, width, height, padding) {
      x -= centerX;
      y -= centerY;

      x /= (width / 2 + padding);
      y /= (height / 2 + padding);

      return (Math.pow(x, 2) + Math.pow(y, 2) <= 1);
    }

    // Check bottom right quarter circle
    if (checkInEllipse(x, y,
            centerX + width / 2 - cornerRadius,
            centerY + height / 2 - cornerRadius,
            cornerRadius * 2, cornerRadius * 2, padding)) {

      return true;
    }

    // Check bottom left quarter circle
    if (checkInEllipse(x, y,
            centerX - width / 2 + cornerRadius,
            centerY + height / 2 - cornerRadius,
            cornerRadius * 2, cornerRadius * 2, padding)) {

      return true;
    }

    return false;
  };

  //we need to force opacity to 1 since we might have state and info boxes.
  //having opaque nodes which have state and info boxes gives unpleasent results.
  $$.sbgn.forceOpacityToOne = function (node, context) {
    var parentOpacity = node.effectiveOpacity();
    if (parentOpacity === 0) {
      return;
    }

    context.fillStyle = "rgba("
            + node._private.style["background-color"].value[0] + ","
            + node._private.style["background-color"].value[1] + ","
            + node._private.style["background-color"].value[2] + ","
            + (1 * node.css('opacity') * parentOpacity) + ")";
  };

  $$.sbgn.drawSimpleChemicalPath = function (
          context, x, y, width, height) {

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    //var cornerRadius = $$.math.getRoundRectangleRadius(width, height);
    var cornerRadius = Math.min(halfWidth, halfHeight);
    context.translate(x, y);

    context.beginPath();

    // Start at top middle
    context.moveTo(0, -halfHeight);
    // Arc from middle top to right side
    context.arcTo(halfWidth, -halfHeight, halfWidth, 0, cornerRadius);
    // Arc from right side to bottom
    context.arcTo(halfWidth, halfHeight, 0, halfHeight, cornerRadius);
    // Arc from bottom to left side
    context.arcTo(-halfWidth, halfHeight, -halfWidth, 0, cornerRadius);
    // Arc from left side to topBorder
    context.arcTo(-halfWidth, -halfHeight, 0, -halfHeight, cornerRadius);
    // Join line
    context.lineTo(0, -halfHeight);

    context.closePath();

    context.translate(-x, -y);
  };

  $$.sbgn.drawSimpleChemical = function (
          context, x, y, width, height) {
    $$.sbgn.drawSimpleChemicalPath(context, x, y, width, height);
    context.fill();
  };

  function simpleChemicalLeftClone(context, centerX, centerY,
          width, height, cloneMarker, opacity) {
    if (cloneMarker != null) {
      var oldGlobalAlpha = context.globalAlpha;
      context.globalAlpha = opacity;
      var oldStyle = context.fillStyle;
      context.fillStyle = $$.sbgn.colors.clone;

      context.beginPath();
      context.translate(centerX, centerY);
      context.scale(width / 2, height / 2);

      var markerBeginX = -1 * Math.sin(Math.PI / 3);
      var markerBeginY = Math.cos(Math.PI / 3);
      var markerEndX = 0;
      var markerEndY = markerBeginY;

      context.moveTo(markerBeginX, markerBeginY);
      context.lineTo(markerEndX, markerEndY);
      context.arc(0, 0, 1, 3 * Math.PI / 6, 5 * Math.PI / 6);

      context.scale(2 / width, 2 / height);
      context.translate(-centerX, -centerY);
      context.closePath();

      context.fill();
      context.fillStyle = oldStyle;
      context.globalAlpha = oldGlobalAlpha;
    }
  }
  ;

  function simpleChemicalRightClone(context, centerX, centerY,
          width, height, cloneMarker, opacity) {
    if (cloneMarker != null) {
      var oldGlobalAlpha = context.globalAlpha;
      context.globalAlpha = opacity;
      var oldStyle = context.fillStyle;
      context.fillStyle = $$.sbgn.colors.clone;

      context.beginPath();
      context.translate(centerX, centerY);
      context.scale(width / 2, height / 2);

      var markerBeginX = 0;
      var markerBeginY = Math.cos(Math.PI / 3);
      var markerEndX = 1 * Math.sin(Math.PI / 3);
      var markerEndY = markerBeginY;

      context.moveTo(markerBeginX, markerBeginY);
      context.lineTo(markerEndX, markerEndY);
      context.arc(0, 0, 1, Math.PI / 6, 3 * Math.PI / 6);

      context.scale(2 / width, 2 / height);
      context.translate(-centerX, -centerY);
      context.closePath();

      context.fill();
      context.fillStyle = oldStyle;
      context.globalAlpha = oldGlobalAlpha;
    }
  };

  $$.sbgn.drawEllipsePath = function (context, x, y, width, height) {
    cyVariables.cyNodeShapes['ellipse'].drawPath(context, x, y, width, height);
  };

  $$.sbgn.drawNucAcidFeature = function (context, width, height,
          centerX, centerY, cornerRadius) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    context.translate(centerX, centerY);
    context.beginPath();

    context.moveTo(-halfWidth, -halfHeight);
    context.lineTo(halfWidth, -halfHeight);
    context.lineTo(halfWidth, 0);
    context.arcTo(halfWidth, halfHeight, 0, halfHeight, cornerRadius);
    context.arcTo(-halfWidth, halfHeight, -halfWidth, 0, cornerRadius);
    context.lineTo(-halfWidth, -halfHeight);

    context.closePath();
    context.translate(-centerX, -centerY);
    context.fill();
  };

  $$.sbgn.isMultimer = function (node) {
    var sbgnClass = node._private.data.sbgnclass;
    if (sbgnClass && sbgnClass.indexOf("multimer") != -1)
      return true;
    return false;
  };

  //this function is created to have same corner length when
  //complex's width or height is changed
  $$.sbgn.generateComplexShapePoints = function (cornerLength, width, height) {
    //cp stands for corner proportion
    var cpX = cornerLength / width;
    var cpY = cornerLength / height;

    var complexPoints = [-1 + cpX, -1, -1, -1 + cpY, -1, 1 - cpY, -1 + cpX,
      1, 1 - cpX, 1, 1, 1 - cpY, 1, -1 + cpY, 1 - cpX, -1];

    return complexPoints;
  };

  $$.sbgn.drawPortsToEllipseShape = function (context, node) {
    var width = node.width();
    var height = node.height();
    var centerX = node._private.position.x;
    var centerY = node._private.position.y;
    var padding = parseInt(node.css('border-width')) / 2;

    for (var i = 0; i < node._private.data.ports.length; i++) {
      var port = node._private.data.ports[i];
      var portX = port.x * width / 100 + centerX;
      var portY = port.y * height / 100 + centerY;
      var closestPoint = cyVariables.cyMath.intersectLineEllipse(
              portX, portY, centerX, centerY, width / 2, height / 2);
      context.moveTo(portX, portY);
      context.lineTo(closestPoint[0], closestPoint[1]);
      context.stroke();

      //add a little black circle to ports
      var oldStyle = context.fillStyle;
      context.fillStyle = $$.sbgn.colors.port;
      $$.sbgn.drawEllipse(context, portX, portY, 2, 2);
      context.fillStyle = oldStyle;
      context.stroke();
    }
  };

  cyVariables.cyStyfn.types.nodeShape.enums.push('source and sink');
  cyVariables.cyStyfn.types.nodeShape.enums.push('nucleic acid feature');
  cyVariables.cyStyfn.types.nodeShape.enums.push('complex');
  cyVariables.cyStyfn.types.nodeShape.enums.push('dissociation');
  cyVariables.cyStyfn.types.nodeShape.enums.push('macromolecule');
  cyVariables.cyStyfn.types.nodeShape.enums.push('simple chemical');
  cyVariables.cyStyfn.types.nodeShape.enums.push('unspecified entity');
  cyVariables.cyStyfn.types.nodeShape.enums.push('process');
  cyVariables.cyStyfn.types.nodeShape.enums.push('omitted process');
  cyVariables.cyStyfn.types.nodeShape.enums.push('uncertain process');
  cyVariables.cyStyfn.types.nodeShape.enums.push('association');

  cyVariables.cyStyfn.types.lineStyle.enums.push('consumption');
  cyVariables.cyStyfn.types.lineStyle.enums.push('production');

  cyVariables.cyStyfn.types.arrowShape.enums.push('necessary stimulation');

  $$.sbgn.registerSbgnArrowShapes = function () {
    cyVariables.cyArrowShapes['necessary stimulation'] = jQuery.extend({}, cyVariables.cyArrowShapes['triangle-tee']);
    cyVariables.cyArrowShapes['necessary stimulation'].pointsTee = [
      -0.18, -0.43,
      0.18, -0.43
    ];
  };

  $$.sbgn.registerSbgnNodeShapes = function () {
    cyVariables.cyArrowShapes['necessary stimulation'] = cyVariables.cyArrowShapes['triangle-tee'];

    cyVariables.cyNodeShapes['process'] = {
      points: cyVariables.cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      label: '',
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var padding = parseInt(node.css('border-width')) / 2;

        cyVariables.cyRenderer.drawPolygonPath(context,
                centerX, centerY,
                width, height,
                cyVariables.cyNodeShapes['process'].points);
        context.fill();

        context.stroke();

        $$.sbgn.drawPortsToPolygonShape(context, node, this.points);
      },
      intersectLine: function (node, x, y, portId) {
        var nodeX = node._private.position.x;
        var nodeY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        return cyVariables.cyMath.polygonIntersectLine(
                x, y,
                cyVariables.cyNodeShapes['process'].points,
                nodeX,
                nodeY,
                width / 2, height / 2,
                padding);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        return cyVariables.cyMath.pointInsidePolygon(x, y, cyVariables.cyNodeShapes['process'].points,
                centerX, centerY, width, height, [0, -1], padding);
      }
    };

    cyVariables.cyNodeShapes['omitted process'] = jQuery.extend(true, {}, cyVariables.cyNodeShapes['process']);
    cyVariables.cyNodeShapes['omitted process'].label = '\\\\';

    cyVariables.cyNodeShapes['uncertain process'] = jQuery.extend(true, {}, cyVariables.cyNodeShapes['process']);
    cyVariables.cyNodeShapes['uncertain process'].label = '?';

    cyVariables.cyNodeShapes["unspecified entity"] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var sbgnClass = node._private.data.sbgnclass;
        var label = node._private.data.sbgnlabel;
        var cloneMarker = node._private.data.sbgnclonemarker;

        $$.sbgn.drawEllipse(context, centerX, centerY, width, height);

        context.stroke();

        $$.sbgn.cloneMarker.unspecifiedEntity(context, centerX, centerY,
                width, height, cloneMarker,
                node.css('background-opacity'));

        $$.sbgn.forceOpacityToOne(node, context);
        $$.sbgn.drawStateAndInfos(node, context, centerX, centerY);
      },
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyVariables.cyNodeShapes["ellipse"].intersectLine(centerX, centerY, width,
                height, x, y, padding);

        var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines);
        return $$.sbgn.closestIntersectionPoint([x, y], intersections);

      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        var nodeCheckPoint = cyVariables.cyNodeShapes["ellipse"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        return nodeCheckPoint || stateAndInfoCheckPoint;
      }
    };

    cyVariables.cyNodeShapes["simple chemical"] = {
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var multimerPadding = cyVariables.cyNodeShapes["simple chemical"].multimerPadding;
        var label = node._private.data.sbgnlabel;
        var padding = parseInt(node.css('border-width'));
        var cloneMarker = node._private.data.sbgnclonemarker;

        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          $$.sbgn.drawSimpleChemical(context, centerX + multimerPadding,
                  centerY + multimerPadding, width, height);

          context.stroke();

          $$.sbgn.cloneMarker.simpleChemical(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width - padding, height - padding, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        $$.sbgn.drawSimpleChemical(context,
                centerX, centerY,
                width, height);

        context.stroke();

        $$.sbgn.cloneMarker.simpleChemical(context, centerX, centerY,
                width - padding, height - padding, cloneMarker, false,
                node.css('background-opacity'));

//        var nodeProp = {'label': label, 'centerX': centerX, 'centerY': centerY,
//          'opacity': node._private.style['text-opacity'].value, 'width': node.width(), 'height': node.height()};
//        $$.sbgn.drawDynamicLabelText(context, nodeProp);

        var oldStyle = context.fillStyle;
        $$.sbgn.forceOpacityToOne(node, context);
        $$.sbgn.drawStateAndInfos(node, context, centerX, centerY);
        context.fillStyle = oldStyle;
      },
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width'));
        var multimerPadding = cyVariables.cyNodeShapes["simple chemical"].multimerPadding;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyVariables.cyNodeShapes["ellipse"].intersectLine(
                centerX, centerY, width, height, x, y, padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyVariables.cyNodeShapes["ellipse"].intersectLine(
                  centerX + multimerPadding, centerY + multimerPadding, width,
                  height, x, y, padding);
        }

        var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines, multimerIntersectionLines);

        return $$.sbgn.closestIntersectionPoint([x, y], intersections);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyVariables.cyNodeShapes["simple chemical"].multimerPadding;

        var nodeCheckPoint = cyVariables.cyNodeShapes["roundrectangle"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyVariables.cyNodeShapes["ellipse"].checkPoint(x, y,
                  padding, width, height,
                  centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyVariables.cyNodeShapes["macromolecule"] = {
      points: cyVariables.cyMath.generateUnitNgonPoints(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var label = node._private.data.sbgnlabel;
        var multimerPadding = cyVariables.cyNodeShapes["macromolecule"].multimerPadding;
        var cloneMarker = node._private.data.sbgnclonemarker;
        var padding = parseInt(node.css('border-width'));

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          cyVariables.cyRenderer.drawRoundRectanglePath(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height);

          context.fill();
          context.stroke();

          $$.sbgn.cloneMarker.macromolecule(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        cyVariables.cyRenderer.drawRoundRectanglePath(context,
                centerX, centerY,
                width, height);
        context.fill();

        context.stroke();

        $$.sbgn.cloneMarker.macromolecule(context, centerX, centerY,
                width, height, cloneMarker, false,
                node.css('background-opacity'));

        var oldStyle = context.fillStyle;
        $$.sbgn.forceOpacityToOne(node, context);
        $$.sbgn.drawStateAndInfos(node, context, centerX, centerY);
        context.fillStyle = oldStyle;

//        var nodeProp = {'label': label, 'centerX': centerX, 'centerY': centerY,
//          'opacity': node._private.style['text-opacity'].value, 'width': node.width(), 'height': node.height()};
      },
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyVariables.cyNodeShapes["macromolecule"].multimerPadding;
        var cornerRadius = cyVariables.cyMath.getRoundRectangleRadius(width, height);

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = $$.sbgn.roundRectangleIntersectLine(
                x, y,
                centerX, centerY,
                centerX, centerY,
                width, height,
                cornerRadius, padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = $$.sbgn.roundRectangleIntersectLine(
                  x, y,
                  centerX, centerY,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height,
                  cornerRadius, padding);
        }

        var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines, multimerIntersectionLines);

        return $$.sbgn.closestIntersectionPoint([x, y], intersections);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width() + threshold;
        var height = node.height() + threshold;
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyVariables.cyNodeShapes["macromolecule"].multimerPadding;

        var nodeCheckPoint = cyVariables.cyNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                width, height, centerX, centerY);
        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyVariables.cyNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                  width, height, centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyVariables.cyNodeShapes['association'] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width'));

        cyVariables.cyNodeShapes['ellipse'].draw(context, centerX, centerY, width, height);
        context.fill();
        context.stroke();

        $$.sbgn.drawPortsToEllipseShape(context, node);
      },
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var intersect = cyVariables.cyMath.intersectLineEllipse(
                x, y,
                centerX,
                centerY,
                width / 2 + padding,
                height / 2 + padding);

        return intersect;
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        x -= centerX;
        y -= centerY;

        x /= (width / 2 + padding);
        y /= (height / 2 + padding);

        return (Math.pow(x, 2) + Math.pow(y, 2) <= 1);
      }
    };

    cyVariables.cyNodeShapes["dissociation"] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();

        context.beginPath();
        context.translate(centerX, centerY);
        context.scale(width / 4, height / 4);

        // At origin, radius 1, 0 to 2pi
        context.arc(0, 0, 1, 0, Math.PI * 2 * 0.999, false); // *0.999 b/c chrome rendering bug on full circle

        context.closePath();
        context.scale(4 / width, 4 / height);
        context.translate(-centerX, -centerY);

        $$.sbgn.drawEllipse(context, centerX, centerY, width / 2, height / 2);

        context.stroke();

        $$.sbgn.drawEllipse(context, centerX, centerY, width, height);

        context.stroke();

        context.fill();

        $$.sbgn.drawPortsToEllipseShape(context, node);

      },
      intersectLine: function (node, x, y, portId) {
        var nodeX = node._private.position.x;
        var nodeY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        return cyVariables.cyMath.intersectLineEllipse(
                x, y,
                nodeX,
                nodeY,
                width / 2 + padding,
                height / 2 + padding);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width')) / 2;

        x -= centerX;
        y -= centerY;

        x /= (width / 2 + padding);
        y /= (height / 2 + padding);

        return (Math.pow(x, 2) + Math.pow(y, 2) <= 1);
      }
    };

    cyVariables.cyNodeShapes["complex"] = {
      points: [],
      multimerPadding: 5,
      cornerLength: 12,
      draw: function (context, node) {
        var hasChildren = node.children().length > 0;
        var width = hasChildren ? node.outerWidth() : node.width();
        var height = hasChildren ? node.outerHeight() : node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var stateAndInfos = node._private.data.sbgnstatesandinfos;
        var label = node._private.data.sbgnlabel;
        var cornerLength = cyVariables.cyNodeShapes["complex"].cornerLength;
        var multimerPadding = cyVariables.cyNodeShapes["complex"].multimerPadding;
        var cloneMarker = node._private.data.sbgnclonemarker;

        cyVariables.cyNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          cyVariables.cyRenderer.drawPolygonPath(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cyVariables.cyNodeShapes["complex"].points);
          context.fill();

          context.stroke();

          $$.sbgn.cloneMarker.complex(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cornerLength, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        cyVariables.cyRenderer.drawPolygonPath(context,
                centerX, centerY,
                width, height, cyVariables.cyNodeShapes["complex"].points);
        context.fill();

        context.stroke();

        $$.sbgn.cloneMarker.complex(context, centerX, centerY,
                width, height, cornerLength, cloneMarker, false,
                node.css('background-opacity'));

        var oldStyle = context.fillStyle;
        $$.sbgn.forceOpacityToOne(node, context);
        $$.sbgn.drawComplexStateAndInfo(context, node, stateAndInfos, centerX, centerY, width, height);
        context.fillStyle = oldStyle;
      },
//      intersectLine: cyVariables.cyNodeShapes["roundrectangle"].intersectLine,
//      checkPoint: cyVariables.cyNodeShapes["roundrectangle"].checkPoint
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var hasChildren = node.children().length > 0;
        var width = hasChildren ? node.outerWidth() : node.width();
        var height = hasChildren ? node.outerHeight() : node.height();
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyVariables.cyNodeShapes["complex"].multimerPadding;
        var cornerLength = cyVariables.cyNodeShapes["complex"].cornerLength;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        cyVariables.cyNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyVariables.cyMath.polygonIntersectLine(
                x, y,
                cyVariables.cyNodeShapes["complex"].points,
                centerX,
                centerY,
                width / 2, height / 2,
                padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyVariables.cyMath.polygonIntersectLine(
                  x, y,
                  cyVariables.cyNodeShapes["complex"].points,
                  centerX + multimerPadding,
                  centerY + multimerPadding,
                  width / 2, height / 2,
                  padding);
        }

        var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines, multimerIntersectionLines);

        return $$.sbgn.closestIntersectionPoint([x, y], intersections);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var hasChildren = node.children().length > 0;
        var width = (hasChildren ? node.outerWidth() : node.width()) + threshold;
        var height = (hasChildren ? node.outerHeight() : node.height()) + threshold;
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyVariables.cyNodeShapes["complex"].multimerPadding;
        var cornerLength = cyVariables.cyNodeShapes["complex"].cornerLength;

        cyVariables.cyNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var nodeCheckPoint = cyVariables.cyMath.pointInsidePolygon(x, y, cyVariables.cyNodeShapes["complex"].points,
                centerX, centerY, width, height, [0, -1], padding);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyVariables.cyMath.pointInsidePolygon(x, y,
                  cyVariables.cyNodeShapes["complex"].points,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, [0, -1], padding);

        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyVariables.cyNodeShapes["nucleic acid feature"] = {
      points: cyVariables.cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        ;
        var width = node.width();
        var height = node.height();
        var label = node._private.data.sbgnlabel;
        var cornerRadius = cyVariables.cyMath.getRoundRectangleRadius(width, height);
        var multimerPadding = cyVariables.cyNodeShapes["nucleic acid feature"].multimerPadding;
        var cloneMarker = node._private.data.sbgnclonemarker;

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          $$.sbgn.drawNucAcidFeature(context, width, height,
                  centerX + multimerPadding,
                  centerY + multimerPadding, cornerRadius);

          context.stroke();

          $$.sbgn.cloneMarker.nucleicAcidFeature(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        $$.sbgn.drawNucAcidFeature(context, width, height, centerX,
                centerY, cornerRadius);

        context.stroke();

        $$.sbgn.cloneMarker.nucleicAcidFeature(context, centerX, centerY,
                width, height, cloneMarker, false,
                node.css('background-opacity'));

//        var nodeProp = {'label': label, 'centerX': centerX, 'centerY': centerY,
//          'opacity': node._private.style['text-opacity'].value, 'width': node.width(), 'height': node.height()};

//        $$.sbgn.drawDynamicLabelText(context, nodeProp);
        var oldStyle = context.fillStyle;
        $$.sbgn.forceOpacityToOne(node, context);
        $$.sbgn.drawStateAndInfos(node, context, centerX, centerY);
        context.fillStyle = oldStyle;
      },
      drawPath: function (context, node) {

      },
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var multimerPadding = cyVariables.cyNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyVariables.cyMath.getRoundRectangleRadius(width, height);

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = $$.sbgn.nucleicAcidIntersectionLine(node,
                x, y, centerX, centerY, cornerRadius);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = $$.sbgn.nucleicAcidIntersectionLine(node,
                  x, y, centerX + multimerPadding, centerY + multimerPadding,
                  cornerRadius);
        }

        var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines,
                multimerIntersectionLines);

        return $$.sbgn.closestIntersectionPoint([x, y], intersections);
      },
      checkPoint: function (x, y, node, threshold) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var multimerPadding = cyVariables.cyNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyVariables.cyMath.getRoundRectangleRadius(width, height);

        var nodeCheckPoint = $$.sbgn.nucleicAcidCheckPoint(x, y, centerX, centerY,
                node, threshold, this.points, cornerRadius);
        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = $$.sbgn.nucleicAcidCheckPoint(x, y,
                  centerX + multimerPadding, centerY + multimerPadding,
                  node, threshold, this.points, cornerRadius);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };
    cyVariables.cyNodeShapes["source and sink"] = {
      points: cyVariables.cyMath.generateUnitNgonPoints(4, 0),
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var label = node._private.data.sbgnlabel;
        var pts = cyVariables.cyNodeShapes["source and sink"].points;
        var cloneMarker = node._private.data.sbgnclonemarker;

        $$.sbgn.drawEllipse(context, centerX, centerY,
                width, height);

        context.stroke();

        context.beginPath();
        context.translate(centerX, centerY);
        context.scale(width * Math.sqrt(2) / 2, height * Math.sqrt(2) / 2);

        context.moveTo(pts[2], pts[3]);
        context.lineTo(pts[6], pts[7]);
        context.closePath();

        context.scale(2 / (width * Math.sqrt(2)), 2 / (height * Math.sqrt(2)));
        context.translate(-centerX, -centerY);

        context.stroke();

        $$.sbgn.cloneMarker.sourceAndSink(context, centerX, centerY,
                width, height, cloneMarker,
                node.css('background-opacity'));

      },
      intersectLine: cyVariables.cyNodeShapes["ellipse"].intersectLine,
      checkPoint: cyVariables.cyNodeShapes["ellipse"].checkPoint
    };
  };

  $$.sbgn.drawEllipse = function (context, x, y, width, height) {
    //$$.sbgn.drawEllipsePath(context, x, y, width, height);
    //context.fill();
    cyVariables.cyNodeShapes['ellipse'].draw(context, x, y, width, height);
  };

  $$.sbgn.cloneMarker = {
    unspecifiedEntity: function (context, centerX, centerY,
            width, height, cloneMarker, opacity) {
      if (cloneMarker != null) {
        var oldGlobalAlpha = context.globalAlpha;
        context.globalAlpha = opacity;
        var oldStyle = context.fillStyle;
        context.fillStyle = $$.sbgn.colors.clone;

        context.beginPath();
        context.translate(centerX, centerY);
        context.scale(width / 2, height / 2);

        var markerBeginX = -1 * Math.sin(Math.PI / 3);
        var markerBeginY = Math.cos(Math.PI / 3);
        var markerEndX = 1 * Math.sin(Math.PI / 3);
        var markerEndY = markerBeginY;

        context.moveTo(markerBeginX, markerBeginY);
        context.lineTo(markerEndX, markerEndY);
        context.arc(0, 0, 1, Math.PI / 6, 5 * Math.PI / 6);

        context.scale(2 / width, 2 / height);
        context.translate(-centerX, -centerY);
        context.closePath();

        context.fill();
        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;
      }
    },
    sourceAndSink: function (context, centerX, centerY,
            width, height, cloneMarker, opacity) {
      $$.sbgn.cloneMarker.unspecifiedEntity(context, centerX, centerY,
              width, height, cloneMarker, opacity);
    },
    simpleChemical: function (context, centerX, centerY,
            width, height, cloneMarker, isMultimer, opacity) {
      if (cloneMarker != null) {
        var cornerRadius = Math.min(width / 2, height / 2);

        var firstCircleCenterX = centerX - width / 2 + cornerRadius;
        var firstCircleCenterY = centerY;
        var secondCircleCenterX = centerX + width / 2 - cornerRadius;
        var secondCircleCenterY = centerY;

        simpleChemicalLeftClone(context, firstCircleCenterX, firstCircleCenterY,
                2 * cornerRadius, 2 * cornerRadius, cloneMarker, opacity);

        simpleChemicalRightClone(context, secondCircleCenterX, secondCircleCenterY,
                2 * cornerRadius, 2 * cornerRadius, cloneMarker, opacity);

        var oldStyle = context.fillStyle;
        context.fillStyle = $$.sbgn.colors.clone;
        var oldGlobalAlpha = context.globalAlpha;
        context.globalAlpha = opacity;

        var recPoints = cyVariables.cyMath.generateUnitNgonPointsFitToSquare(4, 0);
        var cloneX = centerX;
        var cloneY = centerY + 3 / 4 * cornerRadius;
        var cloneWidth = width - 2 * cornerRadius;
        var cloneHeight = cornerRadius / 2;

        cyVariables.cyRenderer.drawPolygonPath(context, cloneX, cloneY, cloneWidth, cloneHeight, recPoints);
        context.fill();
        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;
      }
    },
    perturbingAgent: function (context, centerX, centerY,
            width, height, cloneMarker, opacity) {
      if (cloneMarker != null) {
        var cloneWidth = width;
        var cloneHeight = height / 4;
        var cloneX = centerX;
        var cloneY = centerY + height / 2 - height / 8;

        var markerPoints = [-5 / 6, -1, 5 / 6, -1, 1, 1, -1, 1];

        var oldStyle = context.fillStyle;
        context.fillStyle = $$.sbgn.colors.clone;
        var oldGlobalAlpha = context.globalAlpha;
        context.globalAlpha = opacity;

        renderer.drawPolygon(context,
                cloneX, cloneY,
                cloneWidth, cloneHeight, markerPoints);

        context.fill();

        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;
        //context.stroke();
      }
    },
    nucleicAcidFeature: function (context, centerX, centerY,
            width, height, cloneMarker, isMultimer, opacity) {
      if (cloneMarker != null) {
        var cloneWidth = width;
        var cloneHeight = height / 4;
        var cloneX = centerX;
        var cloneY = centerY + 3 * height / 8;

        var oldStyle = context.fillStyle;
        context.fillStyle = $$.sbgn.colors.clone;
        var oldGlobalAlpha = context.globalAlpha;
        context.globalAlpha = opacity;

        var cornerRadius = cyVariables.cyMath.getRoundRectangleRadius(width, height);

        $$.sbgn.drawNucAcidFeature(context, cloneWidth, cloneHeight,
                cloneX, cloneY, cornerRadius, opacity);

        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;
        //context.stroke();
      }
    },
    macromolecule: function (context, centerX, centerY,
            width, height, cloneMarker, isMultimer, opacity) {
      $$.sbgn.cloneMarker.nucleicAcidFeature(context, centerX, centerY,
              width, height, cloneMarker, isMultimer, opacity);
    },
    complex: function (context, centerX, centerY,
            width, height, cornerLength, cloneMarker, isMultimer, opacity) {
      if (cloneMarker != null) {
        var cpX = cornerLength / width;
        var cpY = cornerLength / height;
        var cloneWidth = width;
        var cloneHeight = height * cpY / 2;
        var cloneX = centerX;
        var cloneY = centerY + height / 2 - cloneHeight / 2;

        var markerPoints = [-1, -1, 1, -1, 1 - cpX, 1, -1 + cpX, 1];

        var oldStyle = context.fillStyle;
        context.fillStyle = $$.sbgn.colors.clone;
        var oldGlobalAlpha = context.globalAlpha;
        context.globalAlpha = opacity;

        cyVariables.cyRenderer.drawPolygonPath(context,
                cloneX, cloneY,
                cloneWidth, cloneHeight, markerPoints);
        context.fill();

        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;

//                context.stroke();
      }
    }
  };

  $$.sbgn.intersectLinePorts = function (node, x, y, portId) {
    var ports = node._private.data.ports;
    if (ports.length < 0)
      return [];

    var nodeX = node._private.position.x;
    var nodeY = node._private.position.y;
    var width = node.width();
    var height = node.height();
    var padding = parseInt(node.css('border-width')) / 2;

    for (var i = 0; i < node._private.data.ports.length; i++) {
      var port = node._private.data.ports[i];
      if (portId == port.id) {
        return cyVariables.cyMath.intersectLineEllipse(
                x, y, port.x * width / 100 + nodeX, port.y * height / 100 + nodeY, 1, 1);
      }
    }
    return [];
  };

  $$.sbgn.closestIntersectionPoint = function (point, intersections) {
    if (intersections.length <= 0)
      return [];

    var closestIntersection = [];
    var minDistance = Number.MAX_VALUE;

    for (var i = 0; i < intersections.length; i = i + 2) {
      var checkPoint = [intersections[i], intersections[i + 1]];
      var distance = cyVariables.cyMath.calculateDistance(point, checkPoint);

      if (distance < minDistance) {
        minDistance = distance;
        closestIntersection = checkPoint;
      }
    }

    return closestIntersection;
  };

  $$.sbgn.nucleicAcidIntersectionLine = function (node, x, y, nodeX, nodeY, cornerRadius) {
    var nodeX = node._private.position.x;
    var nodeY = node._private.position.y;
    var width = node.width();
    var height = node.height();
    var padding = parseInt(node.css('border-width')) / 2;

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    var straightLineIntersections;

    // Top segment, left to right
    {
      var topStartX = nodeX - halfWidth - padding;
      var topStartY = nodeY - halfHeight - padding;
      var topEndX = nodeX + halfWidth + padding;
      var topEndY = topStartY;

      straightLineIntersections = cyVariables.cyMath.finiteLinesIntersect(
              x, y, nodeX, nodeY, topStartX, topStartY, topEndX, topEndY, false);

      if (straightLineIntersections.length > 0) {
        return straightLineIntersections;
      }
    }

    // Right segment, top to bottom
    {
      var rightStartX = nodeX + halfWidth + padding;
      var rightStartY = nodeY - halfHeight - padding;
      var rightEndX = rightStartX;
      var rightEndY = nodeY + halfHeight - cornerRadius + padding;

      straightLineIntersections = cyVariables.cyMath.finiteLinesIntersect(
              x, y, nodeX, nodeY, rightStartX, rightStartY, rightEndX, rightEndY, false);

      if (straightLineIntersections.length > 0) {
        return straightLineIntersections;
      }
    }

    // Bottom segment, left to right
    {
      var bottomStartX = nodeX - halfWidth + cornerRadius - padding;
      var bottomStartY = nodeY + halfHeight + padding;
      var bottomEndX = nodeX + halfWidth - cornerRadius + padding;
      var bottomEndY = bottomStartY;

      straightLineIntersections = cyVariables.cyMath.finiteLinesIntersect(
              x, y, nodeX, nodeY, bottomStartX, bottomStartY, bottomEndX, bottomEndY, false);

      if (straightLineIntersections.length > 0) {
        return straightLineIntersections;
      }
    }

    // Left segment, top to bottom
    {
      var leftStartX = nodeX - halfWidth - padding;
      var leftStartY = nodeY - halfHeight - padding;
      var leftEndX = leftStartX;
      var leftEndY = nodeY + halfHeight - cornerRadius + padding;

      straightLineIntersections = cyVariables.cyMath.finiteLinesIntersect(
              x, y, nodeX, nodeY, leftStartX, leftStartY, leftEndX, leftEndY, false);

      if (straightLineIntersections.length > 0) {
        return straightLineIntersections;
      }
    }

    // Check intersections with arc segments, we have only two arcs for
    //nucleic acid features
    var arcIntersections;

    // Bottom Right
    {
      var bottomRightCenterX = nodeX + halfWidth - cornerRadius;
      var bottomRightCenterY = nodeY + halfHeight - cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x, y, nodeX, nodeY,
              bottomRightCenterX, bottomRightCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] >= bottomRightCenterX
              && arcIntersections[1] >= bottomRightCenterY) {
        return [arcIntersections[0], arcIntersections[1]];
      }
    }

    // Bottom Left
    {
      var bottomLeftCenterX = nodeX - halfWidth + cornerRadius;
      var bottomLeftCenterY = nodeY + halfHeight - cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x, y, nodeX, nodeY,
              bottomLeftCenterX, bottomLeftCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] <= bottomLeftCenterX
              && arcIntersections[1] >= bottomLeftCenterY) {
        return [arcIntersections[0], arcIntersections[1]];
      }
    }
    return []; // if nothing
  };

  //this function gives the intersections of any line with a round rectangle 
  $$.sbgn.roundRectangleIntersectLine = function (
          x1, y1, x2, y2, nodeX, nodeY, width, height, cornerRadius, padding) {

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    // Check intersections with straight line segments
    var straightLineIntersections = [];

    // Top segment, left to right
    {
      var topStartX = nodeX - halfWidth + cornerRadius - padding;
      var topStartY = nodeY - halfHeight - padding;
      var topEndX = nodeX + halfWidth - cornerRadius + padding;
      var topEndY = topStartY;

      var intersection = cyVariables.cyMath.finiteLinesIntersect(
              x1, y1, x2, y2, topStartX, topStartY, topEndX, topEndY, false);

      if (intersection.length > 0) {
        straightLineIntersections = straightLineIntersections.concat(intersection);
      }
    }

    // Right segment, top to bottom
    {
      var rightStartX = nodeX + halfWidth + padding;
      var rightStartY = nodeY - halfHeight + cornerRadius - padding;
      var rightEndX = rightStartX;
      var rightEndY = nodeY + halfHeight - cornerRadius + padding;

      var intersection = cyVariables.cyMath.finiteLinesIntersect(
              x1, y1, x2, y2, rightStartX, rightStartY, rightEndX, rightEndY, false);

      if (intersection.length > 0) {
        straightLineIntersections = straightLineIntersections.concat(intersection);
      }
    }

    // Bottom segment, left to right
    {
      var bottomStartX = nodeX - halfWidth + cornerRadius - padding;
      var bottomStartY = nodeY + halfHeight + padding;
      var bottomEndX = nodeX + halfWidth - cornerRadius + padding;
      var bottomEndY = bottomStartY;

      var intersection = cyVariables.cyMath.finiteLinesIntersect(
              x1, y1, x2, y2, bottomStartX, bottomStartY, bottomEndX, bottomEndY, false);

      if (intersection.length > 0) {
        straightLineIntersections = straightLineIntersections.concat(intersection);
      }
    }

    // Left segment, top to bottom
    {
      var leftStartX = nodeX - halfWidth - padding;
      var leftStartY = nodeY - halfHeight + cornerRadius - padding;
      var leftEndX = leftStartX;
      var leftEndY = nodeY + halfHeight - cornerRadius + padding;

      var intersection = cyVariables.cyMath.finiteLinesIntersect(
              x1, y1, x2, y2, leftStartX, leftStartY, leftEndX, leftEndY, false);

      if (intersection.length > 0) {
        straightLineIntersections = straightLineIntersections.concat(intersection);
      }
    }

    // Check intersections with arc segments
    var arcIntersections;

    // Top Left
    {
      var topLeftCenterX = nodeX - halfWidth + cornerRadius;
      var topLeftCenterY = nodeY - halfHeight + cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x1, y1, x2, y2,
              topLeftCenterX, topLeftCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] <= topLeftCenterX
              && arcIntersections[1] <= topLeftCenterY) {
        straightLineIntersections = straightLineIntersections.concat(arcIntersections);
      }
    }

    // Top Right
    {
      var topRightCenterX = nodeX + halfWidth - cornerRadius;
      var topRightCenterY = nodeY - halfHeight + cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x1, y1, x2, y2,
              topRightCenterX, topRightCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] >= topRightCenterX
              && arcIntersections[1] <= topRightCenterY) {
        straightLineIntersections = straightLineIntersections.concat(arcIntersections);
      }
    }

    // Bottom Right
    {
      var bottomRightCenterX = nodeX + halfWidth - cornerRadius;
      var bottomRightCenterY = nodeY + halfHeight - cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x1, y1, x2, y2,
              bottomRightCenterX, bottomRightCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] >= bottomRightCenterX
              && arcIntersections[1] >= bottomRightCenterY) {
        straightLineIntersections = straightLineIntersections.concat(arcIntersections);
      }
    }

    // Bottom Left
    {
      var bottomLeftCenterX = nodeX - halfWidth + cornerRadius;
      var bottomLeftCenterY = nodeY + halfHeight - cornerRadius
      arcIntersections = cyVariables.cyMath.intersectLineCircle(
              x1, y1, x2, y2,
              bottomLeftCenterX, bottomLeftCenterY, cornerRadius + padding);

      // Ensure the intersection is on the desired quarter of the circle
      if (arcIntersections.length > 0
              && arcIntersections[0] <= bottomLeftCenterX
              && arcIntersections[1] >= bottomLeftCenterY) {
        straightLineIntersections = straightLineIntersections.concat(arcIntersections);
      }
    }

    if (straightLineIntersections.length > 0)
      return straightLineIntersections;
    return []; // if nothing
  };

  $$.sbgn.intersectLineEllipse = function (
          x1, y1, x2, y2, centerX, centerY, width, height, padding) {

    var w = width / 2 + padding;
    var h = height / 2 + padding;
    var an = centerX;
    var bn = centerY;

    var d = [x2 - x1, y2 - y1];

    var m = d[1] / d[0];
    var n = -1 * m * x2 + y2;
    var a = h * h + w * w * m * m;
    var b = -2 * an * h * h + 2 * m * n * w * w - 2 * bn * m * w * w;
    var c = an * an * h * h + n * n * w * w - 2 * bn * w * w * n +
            bn * bn * w * w - h * h * w * w;

    var discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    var xMin = Math.min(t1, t2);
    var xMax = Math.max(t1, t2);

    var yMin = m * xMin - m * x2 + y2;
    var yMax = m * xMax - m * x2 + y2;

    return [xMin, yMin, xMax, yMax];
  };

  $$.sbgn.intersectLineStateAndInfoBoxes = function (node, x, y) {
    var centerX = node._private.position.x;
    var centerY = node._private.position.y;
    var padding = parseInt(node.css('border-width')) / 2;

    var stateAndInfos = node._private.data.sbgnstatesandinfos;

    var stateCount = 0, infoCount = 0;

    var intersections = [];

    for (var i = 0; i < stateAndInfos.length; i++) {
      var state = stateAndInfos[i];
      var stateWidth = state.bbox.w;
      var stateHeight = state.bbox.h;
      var stateCenterX = state.bbox.x * node.width() / 100 + centerX;
      var stateCenterY = state.bbox.y * node.height() / 100 + centerY;

      if (state.clazz == "state variable" && stateCount < 2) {//draw ellipse
        var stateIntersectLines = $$.sbgn.intersectLineEllipse(x, y, centerX, centerY,
                stateCenterX, stateCenterY, stateWidth, stateHeight, padding);

        if (stateIntersectLines.length > 0)
          intersections = intersections.concat(stateIntersectLines);

        stateCount++;
      } else if (state.clazz == "unit of information" && infoCount < 2) {//draw rectangle
        var infoIntersectLines = $$.sbgn.roundRectangleIntersectLine(x, y, centerX, centerY,
                stateCenterX, stateCenterY, stateWidth, stateHeight, 5, padding);

        if (infoIntersectLines.length > 0)
          intersections = intersections.concat(infoIntersectLines);

        infoCount++;
      }

    }
    if (intersections.length > 0)
      return intersections;
    return [];
  };

  $$.sbgn.checkPointStateAndInfoBoxes = function (x, y, node, threshold) {
    var centerX = node._private.position.x;
    var centerY = node._private.position.y;
    var padding =parseInt(node.css('border-width')) / 2;
    var stateAndInfos = node._private.data.sbgnstatesandinfos;

    var stateCount = 0, infoCount = 0;
//    threshold = parseFloat(threshold);

    for (var i = 0; i < stateAndInfos.length; i++) {
      var state = stateAndInfos[i];
      var stateWidth = parseFloat(state.bbox.w) + threshold;
      var stateHeight = parseFloat(state.bbox.h) + threshold;
      var stateCenterX = state.bbox.x * node.width() / 100 + centerX;
      var stateCenterY = state.bbox.y * node.height() / 100 + centerY;

      if (state.clazz == "state variable" && stateCount < 2) {//draw ellipse
        var stateCheckPoint = cyVariables.cyNodeShapes["ellipse"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (stateCheckPoint == true)
          return true;

        stateCount++;
      } else if (state.clazz == "unit of information" && infoCount < 2) {//draw rectangle
        var infoCheckPoint = cyVariables.cyNodeShapes["roundrectangle"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (infoCheckPoint == true)
          return true;

        infoCount++;
      }

    }
    return false;
  };

//  $$.sbgn.intersetLineSelection = function (render, node, x, y, portId) {
//    //TODO: do it for all classes in sbgn, create a sbgn class array to check
//    if (tempSbgnShapes[render.getNodeShape(node)]) {
//      return cyVariables.cyNodeShapes[render.getNodeShape(node)].intersectLine(
//          node, x, y, portId);
//    }
//    else {
//      return cyVariables.cyNodeShapes[render.getNodeShape(node)].intersectLine(
//          node._private.position.x,
//          node._private.position.y,
//          node.outerWidth(),
//          node.outerHeight(),
//          x, //halfPointX,
//          y, //halfPointY
//          node._private.style["border-width"].pxValue / 2
//          );
//    }
//  };

  $$.sbgn.isNodeShapeTotallyOverriden = function (render, node) {
    if (totallyOverridenNodeShapes[render.getNodeShape(node)]) {
      return true;
    }

    return false;
  };
};

},{"../utilities/text-utilities":11}],3:[function(_dereq_,module,exports){
var sbgnElementUtilities = _dereq_('../utilities/sbgn-element-utilities');
var sbgnGraphUtilities = _dereq_('../utilities/sbgn-graph-utilities');
var undoRedoActionFunctions = _dereq_('../utilities/undo-redo-action-functions');
var refreshPaddings = sbgnGraphUtilities.refreshPaddings.bind(sbgnGraphUtilities);

var optionUtilities = _dereq_('../utilities/option-utilities');
var options = optionUtilities.getOptions();

module.exports = function () {
  var containerSelector = options.networkContainerSelector;
  var imgPath = options.imgPath;
  
  $(document).ready(function ()
  {
    var sbgnNetworkContainer = $(containerSelector);

    // create and init cytoscape:
    var cy = cytoscape({
      container: sbgnNetworkContainer,
      style: sbgnStyleSheet,
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function () {
        window.cy = this;
        // If undoable register undo/redo actions
        if (options.undoable) {
          registerUndoRedoActions();
        }
        bindCyEvents();
      }
    });
  });
  
  // Note that in ChiSE this function is in a seperate file but in the viewer it has just 2 methods and so it is located in this file
  function registerUndoRedoActions() {
    // create or get the undo-redo instance
    var ur = cy.undoRedo();

    // register general actions
    // register add remove actions
    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
    ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
  }
  
  function bindCyEvents() {
    cy.on('tapend', 'node', function (event) {
      cy.style().update();
    });
    
    cy.on("beforeCollapse", "node", function (event) {
      var node = this;
      //The children info of complex nodes should be shown when they are collapsed
      if (node._private.data.sbgnclass == "complex") {
        //The node is being collapsed store infolabel to use it later
        var infoLabel = sbgnElementUtilities.getInfoLabel(node);
        node._private.data.infoLabel = infoLabel;
      }

      var edges = cy.edges();
      // remove bend points before collapse
      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        if (edge.hasClass('edgebendediting-hasbendpoints')) {
          edge.removeClass('edgebendediting-hasbendpoints');
          delete edge._private.classes['edgebendediting-hasbendpoints'];
        }
      }

      edges.scratch('cyedgebendeditingWeights', []);
      edges.scratch('cyedgebendeditingDistances', []);
    });

    cy.on("afterCollapse", "node", function (event) {
      var node = this;
      refreshPaddings();

      if (node._private.data.sbgnclass == "complex") {
        node.addClass('changeContent');
      }
    });

    cy.on("beforeExpand", "node", function (event) {
      var node = this;
      node.removeData("infoLabel");
    });

    cy.on("afterExpand", "node", function (event) {
      var node = this;
      cy.nodes().updateCompoundBounds();
      //Don't show children info when the complex node is expanded
      if (node._private.data.sbgnclass == "complex") {
        node.removeStyle('content');
      }
      
      refreshPaddings();
    });
  }

  var sbgnStyleSheet = cytoscape.stylesheet()
          .selector("node")
          .css({
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            },
            'font-size': function (ele) {
              return sbgnElementUtilities.getLabelTextSize(ele);
            },
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1.5,
            'border-color': '#555',
            'background-color': '#f6f6f6',
            'background-opacity': 0.5,
            'text-opacity': 1,
            'opacity': 1
          })
          .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
          .css({
            'background-image': imgPath + '/clone_bg.png',
            'background-position-x': '50%',
            'background-position-y': '100%',
            'background-width': '100%',
            'background-height': '25%',
            'background-fit': 'none',
            'background-image-opacity': function (ele) {
              if (!ele.data('sbgnclonemarker')) {
                return 0;
              }
              return ele.css('background-opacity');
            }
          })
          .selector("node[sbgnclass]")
          .css({
            'shape': function (ele) {
              return sbgnElementUtilities.getCyShape(ele);
            }
          })
          .selector("node[sbgnclass='perturbing agent']")
          .css({
            'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
          })
          .selector("node[sbgnclass='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[sbgnclass='association']")
          .css({
            'background-color': '#6B6B6B'
          })
          .selector("node[sbgnclass='complex']")
          .css({
            'background-color': '#F4F3EE',
            'text-valign': 'bottom',
            'text-halign': 'center'
          })
          .selector("node[sbgnclass='compartment']")
          .css({
            'border-width': 3.75,
            'background-opacity': 0,
            'background-color': '#FFFFFF',
            'text-valign': 'bottom',
            'text-halign': 'center'
          })
          .selector("node[sbgnbbox][sbgnclass][sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
          .css({
            'width': 'data(sbgnbbox.w)',
            'height': 'data(sbgnbbox.h)'
          })
          .selector("node[expanded-collapsed='collapsed']")
          .css({
            'width': 36,
            'height': 36
          })
          .selector("node:selected")
          .css({
            'border-color': '#d67614',
            'target-arrow-color': '#000',
            'text-outline-color': '#000'
          })
          .selector("node:active")
          .css({
            'background-opacity': 0.7, 'overlay-color': '#d67614',
            'overlay-padding': '14'
          })
          .selector("edge")
          .css({
            'curve-style': 'bezier',
            'line-color': '#555',
            'target-arrow-fill': 'hollow',
            'source-arrow-fill': 'hollow',
            'width': 1.5,
            'target-arrow-color': '#555',
            'source-arrow-color': '#555',
            'text-border-color': function (ele) {
              if (ele.selected()) {
                return '#d67614';
              }
              return ele.css('line-color');
            },
            'color': function (ele) {
              if (ele.selected()) {
                return '#d67614';
              }
              return ele.css('line-color');
            }
          })
          .selector("edge:selected")
          .css({
            'line-color': '#d67614',
            'source-arrow-color': '#d67614',
            'target-arrow-color': '#d67614'
          })
          .selector("edge:active")
          .css({
            'background-opacity': 0.7, 'overlay-color': '#d67614',
            'overlay-padding': '8'
          })
          .selector("edge[sbgncardinality > 0]")
          .css({
            'text-rotation': 'autorotate',
            'text-background-shape': 'rectangle',
            'text-border-opacity': '1',
            'text-border-width': '1',
            'text-background-color': 'white',
            'text-background-opacity': '1'
          })
          .selector("edge[sbgnclass='consumption'][sbgncardinality > 0]")
          .css({
            'source-label': function (ele) {
              return '' + ele.data('sbgncardinality');
            },
            'source-text-margin-y': '-10',
            'source-text-offset': function (ele) {
              return sbgnElementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[sbgnclass='production'][sbgncardinality > 0]")
          .css({
            'target-label': function (ele) {
              return '' + ele.data('sbgncardinality');
            },
            'target-text-margin-y': '-10',
            'target-text-offset': function (ele) {
              return sbgnElementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[sbgnclass]")
          .css({
            'target-arrow-shape': function (ele) {
              return sbgnElementUtilities.getCyArrowShape(ele);
            },
            'source-arrow-shape': 'none'
          })
          .selector("edge[sbgnclass='inhibition']")
          .css({
            'target-arrow-fill': 'filled'
          })
          .selector("edge[sbgnclass='production']")
          .css({
            'target-arrow-fill': 'filled'
          })
          .selector("core")
          .css({
            'selection-box-color': '#d67614',
            'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
          });
};
},{"../utilities/option-utilities":7,"../utilities/sbgn-element-utilities":8,"../utilities/sbgn-graph-utilities":9,"../utilities/undo-redo-action-functions":13}],4:[function(_dereq_,module,exports){
/*
 * File Utilities: To be used on read/write file operation
 */

var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var uiUtilities = _dereq_('./ui-utilities');
var sbgnGraphUtilities = _dereq_('./sbgn-graph-utilities');
var sbgnvizUpdate = sbgnGraphUtilities.sbgnvizUpdate.bind(sbgnGraphUtilities);

// Helper functions Start
// see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
// Helper functions End

function fileUtilities() {}

fileUtilities.saveAsPng = function(filename) {
  var pngContent = cy.png({scale: 3, full: true});

  // this is to remove the beginning of the pngContent: data:img/png;base64,
  var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
  saveAs(b64toBlob(b64data, "image/png"), filename || "network.png");
};

fileUtilities.saveAsJpg = function(filename) {
  var jpgContent = cy.jpg({scale: 3, full: true});

  // this is to remove the beginning of the pngContent: data:img/png;base64,
  var b64data = jpgContent.substr(jpgContent.indexOf(",") + 1);
  saveAs(b64toBlob(b64data, "image/jpg"), filename || "network.jpg");
};

fileUtilities.loadXMLDoc = function(fullFilePath) {
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  }
  else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", fullFilePath, false);
  xhttp.send();
  return xhttp.responseXML;
};

// Should this be exposed or should this be moved to the helper functions section?
fileUtilities.textToXmlObject = function(text) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = 'false';
    doc.loadXML(text);
  } else {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/xml');
  }
  return doc;
};

fileUtilities.loadSample = function(filename, folderpath) {
  uiUtilities.startSpinner("load-spinner");
  // load xml document use default folder path if it is not specified
  var xmlObject = this.loadXMLDoc((folderpath || 'sample-app/samples/') + filename);
  
  // Users may want to do customized things while a sample is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadSample", [ filename ] ); //setFileContent(filename.replace('xml', 'sbgnml'));
  
  setTimeout(function () {
    sbgnvizUpdate(sbgnmlToJson.convert(xmlObject));
    uiUtilities.endSpinner("load-spinner");
  }, 0);
};

fileUtilities.loadSBGNMLFile = function(file) {
  var self = this;
  uiUtilities.startSpinner("load-file-spinner");
  
  var textType = /text.*/;

  var reader = new FileReader();

  reader.onload = function (e) {
    var text = this.result;

    setTimeout(function () {
      sbgnvizUpdate(sbgnmlToJson.convert(self.textToXmlObject(text)));
      uiUtilities.endSpinner("load-file-spinner");
    }, 0);
  };

  reader.readAsText(file);

  // Users may want to do customized things while an external file is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadFile", [ file.name ] ); //setFileContent(file.name);
};

fileUtilities.saveAsSbgnml = function(filename) {
  var sbgnmlText = jsonToSbgnml.createSbgnml();

  var blob = new Blob([sbgnmlText], {
    type: "text/plain;charset=utf-8;",
  });
  saveAs(blob, filename);
};

module.exports = fileUtilities;
},{"./json-to-sbgnml-converter":5,"./sbgn-graph-utilities":9,"./sbgnml-to-json-converter":10,"./ui-utilities":12}],5:[function(_dereq_,module,exports){
var jsonToSbgnml = {
    createSbgnml : function(){
        var self = this;
        var sbgnmlText = "";

        //add headers
        sbgnmlText = sbgnmlText + "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
        sbgnmlText = sbgnmlText + "<sbgn xmlns='http://sbgn.org/libsbgn/0.2'>\n";
        sbgnmlText = sbgnmlText + "<map language='process description'>\n";

        //adding glyph sbgnml
        cy.nodes(":visible").each(function(){
            if(!this.isChild())
                sbgnmlText = sbgnmlText + self.getGlyphSbgnml(this);
        });

        //adding arc sbgnml
        cy.edges(":visible").each(function(){
            sbgnmlText = sbgnmlText + self.getArcSbgnml(this);
        });

        sbgnmlText = sbgnmlText + "</map>\n";
        sbgnmlText = sbgnmlText + "</sbgn>\n";

        return sbgnmlText;
    },

    getGlyphSbgnml : function(node){
        var self = this;
        var sbgnmlText = "";

        if(node._private.data.sbgnclass === "compartment"){
            sbgnmlText = sbgnmlText +
                "<glyph id='" + node._private.data.id + "' class='compartment' ";

            if(node.parent().isParent()){
                var parent = node.parent();
                sbgnmlText = sbgnmlText + " compartmentRef='" + node._private.data.parent + "'";
            }

            sbgnmlText = sbgnmlText + " >\n";

            sbgnmlText = sbgnmlText + this.addCommonGlyphProperties(node);

            sbgnmlText = sbgnmlText + "</glyph>\n";

            node.children().each(function(){
                sbgnmlText = sbgnmlText + self.getGlyphSbgnml(this);
            });
        }
        else if(node._private.data.sbgnclass === "complex" || node._private.data.sbgnclass === "submap"){
            sbgnmlText = sbgnmlText +
                "<glyph id='" + node._private.data.id + "' class='" + node._private.data.sbgnclass + "' ";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.sbgnclass == "compartment")
                    sbgnmlText = sbgnmlText + " compartmentRef='" + parent._private.data.id + "'";
            }
            sbgnmlText = sbgnmlText + " >\n";

            sbgnmlText = sbgnmlText + self.addCommonGlyphProperties(node);

            node.children().each(function(){
                sbgnmlText = sbgnmlText + self.getGlyphSbgnml(this);
            });

            sbgnmlText = sbgnmlText + "</glyph>\n";
        }
        else{//it is a simple node
            sbgnmlText = sbgnmlText +
                "<glyph id='" + node._private.data.id + "' class='" + node._private.data.sbgnclass + "'";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.sbgnclass == "compartment")
                    sbgnmlText = sbgnmlText + " compartmentRef='" + parent._private.data.id + "'";
            }

            sbgnmlText = sbgnmlText + " >\n";

            sbgnmlText = sbgnmlText + self.addCommonGlyphProperties(node);

            sbgnmlText = sbgnmlText + "</glyph>\n";
        }

        return  sbgnmlText;
    },

    addCommonGlyphProperties : function(node){
        var sbgnmlText = "";

        //add label information
        sbgnmlText = sbgnmlText + this.addLabel(node);
        //add bbox information
        sbgnmlText = sbgnmlText + this.addGlyphBbox(node);
        //add clone information
        sbgnmlText = sbgnmlText + this.addClone(node);
        //add port information
        sbgnmlText = sbgnmlText + this.addPort(node);
        //add state and info box information
        sbgnmlText = sbgnmlText + this.getStateAndInfoSbgnml(node);

        return sbgnmlText;
    },

    addClone : function(node){
        var sbgnmlText = "";
        if(typeof node._private.data.sbgnclonemarker != 'undefined')
            sbgnmlText = sbgnmlText + "<clone/>\n";
        return sbgnmlText;
    },

    getStateAndInfoSbgnml : function(node){
        var sbgnmlText = "";

        for(var i = 0 ; i < node._private.data.sbgnstatesandinfos.length ; i++){
            var boxGlyph = node._private.data.sbgnstatesandinfos[i];
            if(boxGlyph.clazz === "state variable"){
                sbgnmlText = sbgnmlText + this.addStateBoxGlyph(boxGlyph, node);
            }
            else if(boxGlyph.clazz === "unit of information"){
                sbgnmlText = sbgnmlText + this.addInfoBoxGlyph(boxGlyph, node);
            }
        }
        return sbgnmlText;
    },

    getArcSbgnml : function(edge){
        var sbgnmlText = "";

        //Temporary hack to resolve "undefined" arc source and targets
        var arcTarget = edge._private.data.porttarget;
        var arcSource = edge._private.data.portsource;

        if (arcSource == null || arcSource.length === 0)
            arcSource = edge._private.data.source;

        if (arcTarget == null || arcTarget.length === 0)
            arcTarget = edge._private.data.target;

        var arcId = arcSource + "-" + arcTarget;

        sbgnmlText = sbgnmlText + "<arc id='" + arcId +
            "' target='" + arcTarget +
            "' source='" + arcSource + "' class='" +
            edge._private.data.sbgnclass + "'>\n";

        sbgnmlText = sbgnmlText + "<start y='" + edge._private.rscratch.startY + "' x='" +
            edge._private.rscratch.startX + "'/>\n";

        var segpts = cy.edgeBendEditing('get').getSegmentPoints(edge);
        if(segpts){
          for(var i = 0; segpts && i < segpts.length; i = i + 2){
            var bendX = segpts[i];
            var bendY = segpts[i + 1];

            sbgnmlText = sbgnmlText + "<next y='" + bendY + "' x='" + bendX + "'/>\n";
          }
        }

        sbgnmlText = sbgnmlText + "<end y='" + edge._private.rscratch.endY + "' x='" +
            edge._private.rscratch.endX + "'/>\n";

        sbgnmlText = sbgnmlText + "</arc>\n";

        return sbgnmlText;
    },

    addGlyphBbox : function(node){
        var width = node.width();
        var height = node.height();
        var x = node._private.position.x - width/2;
        var y = node._private.position.y - height/2;
        return "<bbox y='" + y + "' x='" + x +
            "' w='" + width + "' h='" + height + "' />\n";
    },

    addStateAndInfoBbox : function(node, boxGlyph){
        boxBbox = boxGlyph.bbox;

        var x = boxBbox.x / 100 * node.width();
        var y = boxBbox.y / 100 * node.height();

        x = node._private.position.x + (x - boxBbox.w/2);
        y = node._private.position.y + (y - boxBbox.h/2);
        return "<bbox y='" + y + "' x='" + x +
            "' w='" + boxBbox.w + "' h='" + boxBbox.h + "' />\n";
    },

    addPort : function(node){
        var sbgnmlText = "";

        var ports = node._private.data.ports;
        for(var i = 0 ; i < ports.length ; i++){
            var x = node._private.position.x + ports[i].x * node.width() / 100;
            var y = node._private.position.y + ports[i].y * node.height() / 100;

            sbgnmlText = sbgnmlText + "<port id='" + ports[i].id +
                "' y='" + y + "' x='" + x + "' />\n";
        }
        return sbgnmlText;
    },

    addLabel : function(node){
        var label = node._private.data.sbgnlabel;

        if(typeof label != 'undefined')
            return "<label text='" + label + "' />\n";
        return "";
    },

    addStateBoxGlyph : function(node, mainGlyph){
        var sbgnmlText = "";

        sbgnmlText = sbgnmlText + "<glyph id='" + node.id + "' class='state variable'>\n";
        sbgnmlText = sbgnmlText + "<state ";

        if(typeof node.state.value != 'undefined')
            sbgnmlText = sbgnmlText + "value='" + node.state.value + "' ";
        if(typeof node.state.variable != 'undefined')
            sbgnmlText = sbgnmlText + "variable='" + node.state.variable + "' ";
        sbgnmlText = sbgnmlText + "/>\n";

        sbgnmlText = sbgnmlText + this.addStateAndInfoBbox(mainGlyph, node);
        sbgnmlText = sbgnmlText + "</glyph>\n";

        return sbgnmlText;
    },

    addInfoBoxGlyph : function(node, mainGlyph){
        var sbgnmlText = "";

        sbgnmlText = sbgnmlText + "<glyph id='" + node.id + "' class='unit of information'>\n";
        sbgnmlText = sbgnmlText + "<label ";

        if(typeof node.label.text != 'undefined')
            sbgnmlText = sbgnmlText + "text='" + node.label.text + "' ";
        sbgnmlText = sbgnmlText + "/>\n";

        sbgnmlText = sbgnmlText + this.addStateAndInfoBbox(mainGlyph, node);
        sbgnmlText = sbgnmlText + "</glyph>\n";

        return sbgnmlText;
    }
};

module.exports = jsonToSbgnml;

},{}],6:[function(_dereq_,module,exports){
/* 
 * These are the main utilities to be directly utilized by the user interactions
 */

var sbgnElementUtilities = _dereq_('./sbgn-element-utilities');
var sbgnGraphUtilities = _dereq_('./sbgn-graph-utilities');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var optionUtilities = _dereq_('./option-utilities');

var options = optionUtilities.getOptions();

// Helpers start
function beforePerformLayout() {
  var nodes = cy.nodes();
  var edges = cy.edges();

  nodes.removeData("ports");
  edges.removeData("portsource");
  edges.removeData("porttarget");

  nodes.data("ports", []);
  edges.data("portsource", []);
  edges.data("porttarget", []);

  // TODO do this by using extension API
  cy.$('.edgebendediting-hasbendpoints').removeClass('edgebendediting-hasbendpoints');
  edges.scratch('cyedgebendeditingWeights', []);
  edges.scratch('cyedgebendeditingDistances', []);
};
// Helpers end

function mainUtilities() {}

mainUtilities.expandNodes = function(nodes) {
  var nodesToExpand = nodes.filter("[expanded-collapsed='collapsed']");
  if (nodesToExpand.expandableNodes().length == 0) {
    return;
  }
  if(options.undoable) {
    cy.undoRedo().do("expand", {
      nodes: nodesToExpand,
    });
  }
  else {
    nodes.expand();
  }
};

mainUtilities.collapseNodes = function(nodes) {
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  }
  else {
    nodes.collapse();
  }
};

mainUtilities.collapseComplexes = function() {
  var complexes = cy.nodes("[sbgnclass='complex']");
  if (complexes.collapsibleNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: complexes
    });
  }
  else {
    complexes.collapseRecursively();
  }
};

mainUtilities.expandComplexes = function() {
  var nodes = cy.nodes(":selected").filter("[sbgnclass='complex'][expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.expandRecursively();
  }
};

mainUtilities.collapseAll = function() {
  var nodes = cy.nodes(':visible');
  if (nodes.collapsibleNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.collapseRecursively();
  }
};

mainUtilities.expandAll = function() {
  var nodes = cy.nodes(':visible').filter("[expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    nodes.expandRecursively();
  }
};

mainUtilities.hideEles = function(eles) {
  if (eles.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", eles);
  }
  else {
    eles.hideEles();
  }
};

mainUtilities.showEles = function(eles) {
  if (eles.length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", eles);
  }
  else {
    eles.showEles();
  }
};

mainUtilities.showAll = function() {
  if (cy.elements().length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", cy.elements());
  }
  else {
    cy.elements().showEles();
  }
};

mainUtilities.deleteElesSimple = function(eles) {
  if (eles.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("deleteElesSimple", {
      eles: eles
    });
  }
  else {
    eles.remove();
  }
};

mainUtilities.deleteElesSmart = function(eles) {
  if (eles.length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("deleteElesSmart", {
      firstTime: true,
      eles: eles
    });
  }
  else {
    sbgnElementUtilities.deleteElesSmart(eles);
  }
};

mainUtilities.highlightNeighbours = function(eles) {
  var elesToHighlight = sbgnElementUtilities.getNeighboursOfEles(eles);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    elesToHighlight.highlight();
  }
};

mainUtilities.searchByLabel = function(label) {
  if (label.length == 0) {
    return;
  }
  
  var nodesToHighlight = cy.nodes(":visible").filter(function (i, ele) {
    if (ele.data("sbgnlabel") && ele.data("sbgnlabel").toLowerCase().indexOf(label) >= 0) {
      return true;
    }
    return false;
  });

  if (nodesToHighlight.length == 0) {
    return;
  }

  nodesToHighlight = sbgnElementUtilities.extendNodeList(nodesToHighlight);
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", nodesToHighlight);
  }
  else {
    nodesToHighlight.highlight();
  }
};

mainUtilities.highlightProcesses = function(eles) {
  var elesToHighlight = sbgnElementUtilities.extendNodeList(eles);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    elesToHighlight.highlight();
  }
};

mainUtilities.removeHighlights = function() {
  if (sbgnElementUtilities.noneIsNotHighlighted()) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("removeHighlights");
  }
  else {
    cy.removeHighlights()
  }
};

mainUtilities.performLayout = function(layoutOptions, notUndoable) {
  // Things to do before performing layout
  beforePerformLayout();
  
  if (!options.undoable || notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
    cy.elements().filter(':visible').layout(layoutOptions);
  }
  else {
    cy.undoRedo().do("layout", {
      options: layoutOptions,
      eles: cy.elements().filter(':visible')
    });
  }
};

mainUtilities.createSbgnml = function() {
  return jsonToSbgnml.createSbgnml();
};

mainUtilities.convertSbgnmlToJson = function(data) {
  return sbgnmlToJson.convert(data);
};

module.exports = mainUtilities;
},{"./json-to-sbgnml-converter":5,"./option-utilities":7,"./sbgn-element-utilities":8,"./sbgn-graph-utilities":9,"./sbgnml-to-json-converter":10}],7:[function(_dereq_,module,exports){
// default options
var defaults = {
  // The path of core library images when sbgnviz is required from npm and located 
  // in node_modules using default option is enough
  imgPath: 'node_modules/sbgnviz/src/img',
  libs: {},
  // Whether to fit labels to nodes
  fitLabelsToNodes: function () {
    return false;
  },
  // dynamic label size it may be 'small', 'regular', 'large'
  dynamicLabelSize: function () {
    return 'regular';
  },
  // percentage used to calculate compound paddings
  compoundPadding: function () {
    return 10;
  },
  // The selector of the component containing the sbgn network
  networkContainerSelector: '#sbgn-network-container',
  // Whether the actions are undoable, requires cytoscape-undo-redo extension
  undoable: true
};

var optionUtilities = function () {
};

//var self = optionUtilities;

// Extend the defaults options with the user options
optionUtilities.extendOptions = function (options) {
  var result = {};

  for (var prop in defaults) {
    result[prop] = defaults[prop];
  }
  
  for (var prop in options) {
    result[prop] = options[prop];
  }

  optionUtilities.options = result;

  return options;
};

optionUtilities.getOptions = function () {
  return optionUtilities.options;
};

module.exports = optionUtilities;
},{}],8:[function(_dereq_,module,exports){
var truncateText = _dereq_('./text-utilities').truncateText;
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var sbgnElementUtilities = {
    //the list of the element classes handled by the tool
    handledElements: {
        'unspecified entity': true,
        'simple chemical': true,
        'macromolecule': true,
        'nucleic acid feature': true,
        'perturbing agent': true,
        'source and sink': true,
        'complex': true,
        'process': true,
        'omitted process': true,
        'uncertain process': true,
        'association': true,
        'dissociation': true,
        'phenotype': true,
        'tag': true,
        'consumption': true,
        'production': true,
        'modulation': true,
        'stimulation': true,
        'catalysis': true,
        'inhibition': true,
        'necessary stimulation': true,
        'logic arc': true,
        'equivalence arc': true,
        'and operator': true,
        'or operator': true,
        'not operator': true,
        'and': true,
        'or': true,
        'not': true,
        'nucleic acid feature multimer': true,
        'macromolecule multimer': true,
        'simple chemical multimer': true,
        'complex multimer': true,
        'compartment': true
    },
    //the following were moved here from what used to be utilities/sbgn-filtering.js
    processTypes : ['process', 'omitted process', 'uncertain process',
        'association', 'dissociation', 'phenotype'],
      
    // Section Start
    // General Element Utilities

    //this method returns the nodes non of whose ancestors is not in given nodes
    getTopMostNodes: function (nodes) {
        var nodesMap = {};
        for (var i = 0; i < nodes.length; i++) {
            nodesMap[nodes[i].id()] = true;
        }
        var roots = nodes.filter(function (i, ele) {
            var parent = ele.parent()[0];
            while(parent != null){
              if(nodesMap[parent.id()]){
                return false;
              }
              parent = parent.parent()[0];
            }
            return true;
        });

        return roots;
    },
    //This method checks if all of the given nodes have the same parent assuming that the size 
    //of  nodes is not 0
    allHaveTheSameParent: function (nodes) {
        if (nodes.length == 0) {
            return true;
        }
        var parent = nodes[0].data("parent");
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.data("parent") != parent) {
                return false;
            }
        }
        return true;
    },
    moveNodes: function(positionDiff, nodes, notCalcTopMostNodes) {
      var topMostNodes = notCalcTopMostNodes ? nodes : this.getTopMostNodes(nodes);
      for (var i = 0; i < topMostNodes.length; i++) {
        var node = topMostNodes[i];
        var oldX = node.position("x");
        var oldY = node.position("y");
        node.position({
          x: oldX + positionDiff.x,
          y: oldY + positionDiff.y
        });
        var children = node.children();
        this.moveNodes(positionDiff, children, true);
      }
    },
    convertToModelPosition: function (renderedPosition) {
      var pan = cy.pan();
      var zoom = cy.zoom();

      var x = (renderedPosition.x - pan.x) / zoom;
      var y = (renderedPosition.y - pan.y) / zoom;

      return {
        x: x,
        y: y
      };
    },
    
    // Section End
    // General Element Utilities

    // Section Start
    // Element Filtering Utilities
    
    getProcessesOfSelected: function(){
        var selectedEles = cy.elements(":selected");
        selectedEles = this.extendNodeList(selectedEles);
        return selectedEles;
    },
    getNeighboursOfSelected: function(){
        var selectedEles = cy.elements(":selected");
        var elesToHighlight = this.getNeighboursOfEles(selectedEles);
        return elesToHighlight;
    },
    getNeighboursOfEles: function(_eles){
        var eles = _eles;
        eles = eles.add(eles.parents("node[sbgnclass='complex']"));
        eles = eles.add(eles.descendants());
        var neighborhoodEles = eles.neighborhood();
        var elesToReturn = eles.add(neighborhoodEles);
        elesToReturn = elesToReturn.add(elesToReturn.descendants());
        return elesToReturn;
    },
    extendNodeList: function(nodesToShow){
        var self = this;
        //add children
        nodesToShow = nodesToShow.add(nodesToShow.nodes().descendants());
        //add parents
        nodesToShow = nodesToShow.add(nodesToShow.parents());
        //add complex children
        nodesToShow = nodesToShow.add(nodesToShow.nodes("node[sbgnclass='complex']").descendants());

        // var processes = nodesToShow.nodes("node[sbgnclass='process']");
        // var nonProcesses = nodesToShow.nodes("node[sbgnclass!='process']");
        // var neighborProcesses = nonProcesses.neighborhood("node[sbgnclass='process']");

        var processes = nodesToShow.filter(function(){
            return $.inArray(this._private.data.sbgnclass, self.processTypes) >= 0;
        });
        var nonProcesses = nodesToShow.filter(function(){
            return $.inArray(this._private.data.sbgnclass, self.processTypes) === -1;
        });
        var neighborProcesses = nonProcesses.neighborhood().filter(function(){
            return $.inArray(this._private.data.sbgnclass, self.processTypes) >= 0;
        });

        nodesToShow = nodesToShow.add(processes.neighborhood());
        nodesToShow = nodesToShow.add(neighborProcesses);
        nodesToShow = nodesToShow.add(neighborProcesses.neighborhood());

        //add parents
        nodesToShow = nodesToShow.add(nodesToShow.nodes().parents());
        //add children
        nodesToShow = nodesToShow.add(nodesToShow.nodes("node[sbgnclass='complex']").descendants());

        return nodesToShow;
    },
    extendRemainingNodes : function(nodesToFilter, allNodes){
        nodesToFilter = this.extendNodeList(nodesToFilter);
        var nodesToShow = allNodes.not(nodesToFilter);
        nodesToShow = this.extendNodeList(nodesToShow);
        return nodesToShow;
    },
    noneIsNotHighlighted: function(){
        var notHighlightedNodes = cy.nodes(":visible").nodes(".unhighlighted");
        var notHighlightedEdges = cy.edges(":visible").edges(".unhighlighted");

        return notHighlightedNodes.length + notHighlightedEdges.length === 0;
    },
    
    // Section End
    // Element Filtering Utilities

    // Section Start
    // Add remove utilities

    
    restoreEles: function (eles) {
        eles.restore();
        return eles;
    },
    deleteElesSimple: function (eles) {
      cy.elements().unselect();
      return eles.remove();
    },
    deleteElesSmart: function (eles) {
      var allNodes = cy.nodes();
      cy.elements().unselect();
      var nodesToKeep = this.extendRemainingNodes(eles, allNodes);
      var nodesNotToKeep = allNodes.not(nodesToKeep);
      return nodesNotToKeep.remove();
    },
    
    // Section End
    // Add remove utilities

    // Section Start
    // Stylesheet helpers
    
    getCyShape: function(ele) {
        var shape = ele.data('sbgnclass');
        if (shape.endsWith(' multimer')) {
            shape = shape.replace(' multimer', '');
        }

        if (shape == 'compartment') {
            return 'roundrectangle';
        }
        if (shape == 'phenotype') {
            return 'hexagon';
        }
        if (shape == 'perturbing agent' || shape == 'tag') {
            return 'polygon';
        }
        if (shape == 'source and sink' || shape == 'nucleic acid feature' || shape == 'dissociation'
            || shape == 'macromolecule' || shape == 'simple chemical' || shape == 'complex'
            || shape == 'unspecified entity' || shape == 'process' || shape == 'omitted process'
            || shape == 'uncertain process' || shape == 'association') {
            return shape;
        }
        return 'ellipse';
    },
    getCyArrowShape: function(ele) {
        var sbgnclass = ele.data('sbgnclass');
        if (sbgnclass == 'necessary stimulation') {
            return 'necessary stimulation';
        }
        if (sbgnclass == 'inhibition') {
            return 'tee';
        }
        if (sbgnclass == 'catalysis') {
            return 'circle';
        }
        if (sbgnclass == 'stimulation' || sbgnclass == 'production') {
            return 'triangle';
        }
        if (sbgnclass == 'modulation') {
            return 'diamond';
        }
        return 'none';
    },
    getElementContent: function(ele) {
        var sbgnclass = ele.data('sbgnclass');

        if (sbgnclass.endsWith(' multimer')) {
            sbgnclass = sbgnclass.replace(' multimer', '');
        }

        var content = "";
        if (sbgnclass == 'macromolecule' || sbgnclass == 'simple chemical'
            || sbgnclass == 'phenotype'
            || sbgnclass == 'unspecified entity' || sbgnclass == 'nucleic acid feature'
            || sbgnclass == 'perturbing agent' || sbgnclass == 'tag') {
            content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
        }
        else if(sbgnclass == 'compartment'){
            content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
        }
        else if(sbgnclass == 'complex'){
            if(ele.children().length == 0){
                if(ele.data('sbgnlabel')){
                    content = ele.data('sbgnlabel');
                }
                else if(ele.data('infoLabel')){
                    content = ele.data('infoLabel');
                }
                else{
                    content = '';
                }
            }
            else{
                content = '';
            }
        }
        else if (sbgnclass == 'and') {
            content = 'AND';
        }
        else if (sbgnclass == 'or') {
            content = 'OR';
        }
        else if (sbgnclass == 'not') {
            content = 'NOT';
        }
        else if (sbgnclass == 'omitted process') {
            content = '\\\\';
        }
        else if (sbgnclass == 'uncertain process') {
            content = '?';
        }
        else if (sbgnclass == 'dissociation') {
            content = 'O';
        }

        var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('sbgnbbox').w;

        var textProp = {
            label: content,
            width: ( sbgnclass==('complex') || sbgnclass==('compartment') )?textWidth * 2:textWidth
        };

        var font = this.getLabelTextSize(ele) + "px Arial";
        return truncateText(textProp, font); //func. in the cytoscape.renderer.canvas.sbgn-renderer.js
    },
    getLabelTextSize: function (ele) {
      var sbgnclass = ele.data('sbgnclass');

      // These types of nodes cannot have label but this is statement is needed as a workaround
      if (sbgnclass === 'association' || sbgnclass === 'dissociation') {
        return 20;
      }

      if (sbgnclass === 'and' || sbgnclass === 'or' || sbgnclass === 'not') {
        return this.getDynamicLabelTextSize(ele, 1);
      }

      if (sbgnclass.endsWith('process')) {
        return this.getDynamicLabelTextSize(ele, 1.5);
      }

      if (sbgnclass === 'complex' || sbgnclass === 'compartment') {
        return 16;
      }

      return this.getDynamicLabelTextSize(ele);
    },
    getDynamicLabelTextSize: function (ele, dynamicLabelSizeCoefficient) {
      var dynamicLabelSize = options.dynamicLabelSize;
      dynamicLabelSize = typeof dynamicLabelSize === 'function' ? dynamicLabelSize.call() : dynamicLabelSize;

      if (dynamicLabelSizeCoefficient === undefined) {
        if (dynamicLabelSize == 'small') {
          dynamicLabelSizeCoefficient = 0.75;
        }
        else if (dynamicLabelSize == 'regular') {
          dynamicLabelSizeCoefficient = 1;
        }
        else if (dynamicLabelSize == 'large') {
          dynamicLabelSizeCoefficient = 1.25;
        }
      }
      
      var h = ele.height();
      var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

      return textHeight;
    },
    getCardinalityDistance: function (ele) {
      var srcPos = ele.source().position();
      var tgtPos = ele.target().position();

      var distance = Math.sqrt(Math.pow((srcPos.x - tgtPos.x), 2) + Math.pow((srcPos.y - tgtPos.y), 2));
      return distance * 0.15;
    },
    getInfoLabel: function(node) {
      /* Info label of a collapsed node cannot be changed if
      * the node is collapsed return the already existing info label of it
      */
      if (node._private.data.collapsedChildren != null) {
        return node._private.data.infoLabel;
      }

      /*
       * If the node is simple then it's infolabel is equal to it's sbgnlabel
       */
      if (node.children() == null || node.children().length == 0) {
        return node._private.data.sbgnlabel;
      }

      var children = node.children();
      var infoLabel = "";
      /*
       * Get the info label of the given node by it's children info recursively
       */
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var childInfo = this.getInfoLabel(child);
        if (childInfo == null || childInfo == "") {
          continue;
        }

        if (infoLabel != "") {
          infoLabel += ":";
        }
        infoLabel += childInfo;
      }

      //return info label
      return infoLabel;
    }
    
    // Section End
    // Stylesheet helpers
};

module.exports = sbgnElementUtilities;

},{"./option-utilities":7,"./text-utilities":11}],9:[function(_dereq_,module,exports){
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
/*
 * Graph utilities for sbgn
 */
function sbgnGraphUtilities() {}

sbgnGraphUtilities.sbgnvizUpdate = function(cyGraph) {
  console.log('cy update called');
  $( document ).trigger( "sbgnvizUpdateStart" );
  // Reset undo/redo stack and buttons when a new graph is loaded
  if (options.undoable) {
    cy.undoRedo().reset();
//    this.resetUndoRedoButtons();
  }

  cy.startBatch();
  // clear data
  cy.remove('*');
  cy.add(cyGraph);

  //add position information to data for preset layout
  var positionMap = {};
  for (var i = 0; i < cyGraph.nodes.length; i++) {
    var xPos = cyGraph.nodes[i].data.sbgnbbox.x;
    var yPos = cyGraph.nodes[i].data.sbgnbbox.y;
    positionMap[cyGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
  }

  cy.layout({
    name: 'preset',
    positions: positionMap
  });

  this.refreshPaddings();
  cy.endBatch();

  // Update the style
  cy.style().update();
  // Initilize the bend points once the elements are created
  cy.edgeBendEditing('get').initBendPoints(cy.edges());
  
  $( document ).trigger( "sbgnvizUpdateEnd" );
};

sbgnGraphUtilities.calculatePaddings = function(paddingPercent) {
  //As default use the compound padding value
  if (!paddingPercent) {
    var compoundPadding = options.compoundPadding;
    paddingPercent = typeof compoundPadding === 'function' ? compoundPadding.call() : compoundPadding;
  }

  var nodes = cy.nodes();
  var total = 0;
  var numOfSimples = 0;
  for (var i = 0; i < nodes.length; i++) {
    var theNode = nodes[i];
    if (theNode.children() == null || theNode.children().length == 0) {
      total += Number(theNode.width());
      total += Number(theNode.height());
      numOfSimples++;
    }
  }

  var calc_padding = (paddingPercent / 100) * Math.floor(total / (2 * numOfSimples));
  if (calc_padding < 5) {
    calc_padding = 5;
  }

  return calc_padding;
};

sbgnGraphUtilities.refreshPaddings = function() {
  var calc_padding = this.calculatePaddings();
  var nodes = cy.nodes();
  var compounds = nodes.filter('$node > node');
  cy.startBatch();
  compounds.css('padding-left', calc_padding);
  compounds.css('padding-right', calc_padding);
  compounds.css('padding-top', calc_padding);
  compounds.css('padding-bottom', calc_padding);
  cy.endBatch();
};

module.exports = sbgnGraphUtilities;
},{"./option-utilities":7}],10:[function(_dereq_,module,exports){
var sbgnElementUtilities = _dereq_('./sbgn-element-utilities');

var sbgnmlToJson = {
  insertedNodes: {},
  getAllCompartments: function (xmlObject) {
    var compartments = [];
    $(xmlObject).find("glyph[class='compartment']").each(function () {
      compartments.push({
        'x': parseFloat($(this).children('bbox').attr('x')),
        'y': parseFloat($(this).children('bbox').attr('y')),
        'w': parseFloat($(this).children('bbox').attr('w')),
        'h': parseFloat($(this).children('bbox').attr('h')),
        'id': $(this).attr('id')
      });
    });

    compartments.sort(function (c1, c2) {
      if (c1.h * c1.w < c2.h * c2.w)
        return -1;
      if (c1.h * c1.w > c2.h * c2.w)
        return 1;
      return 0;
    });

    return compartments;
  },
  isInBoundingBox: function (bbox1, bbox2) {
    if (bbox1.x > bbox2.x &&
        bbox1.y > bbox2.y &&
        bbox1.x + bbox1.w < bbox2.x + bbox2.w &&
        bbox1.y + bbox1.h < bbox2.y + bbox2.h)
      return true;
    return false;
  },
  bboxProp: function (ele) {
    var sbgnbbox = new Object();

    sbgnbbox.x = $(ele).find('bbox').attr('x');
    sbgnbbox.y = $(ele).find('bbox').attr('y');
    sbgnbbox.w = $(ele).find('bbox').attr('w');
    sbgnbbox.h = $(ele).find('bbox').attr('h');

    //set positions as center
    sbgnbbox.x = parseFloat(sbgnbbox.x) + parseFloat(sbgnbbox.w) / 2;
    sbgnbbox.y = parseFloat(sbgnbbox.y) + parseFloat(sbgnbbox.h) / 2;

    return sbgnbbox;
  },
  stateAndInfoBboxProp: function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    var sbgnbbox = new Object();

    sbgnbbox.x = $(ele).find('bbox').attr('x');
    sbgnbbox.y = $(ele).find('bbox').attr('y');
    sbgnbbox.w = $(ele).find('bbox').attr('w');
    sbgnbbox.h = $(ele).find('bbox').attr('h');

    //set positions as center
    sbgnbbox.x = parseFloat(sbgnbbox.x) + parseFloat(sbgnbbox.w) / 2 - xPos;
    sbgnbbox.y = parseFloat(sbgnbbox.y) + parseFloat(sbgnbbox.h) / 2 - yPos;

    sbgnbbox.x = sbgnbbox.x / parseFloat(parentBbox.w) * 100;
    sbgnbbox.y = sbgnbbox.y / parseFloat(parentBbox.h) * 100;

    return sbgnbbox;
  },
  stateAndInfoProp: function (ele, parentBbox) {
    var self = this;
    var stateAndInfoArray = new Array();

    $(ele).children('glyph').each(function () {
      var obj = new Object();
      if ($(this).attr('class') === 'unit of information') {
        obj.id = $(this).attr('id');
        obj.clazz = $(this).attr('class');
        obj.label = {'text': $(this).find('label').attr('text')};
        obj.bbox = self.stateAndInfoBboxProp(this, parentBbox);
        stateAndInfoArray.push(obj);
      }
      else if ($(this).attr('class') === 'state variable') {
        obj.id = $(this).attr('id');
        obj.clazz = $(this).attr('class');
        obj.state = {'value': $(this).find('state').attr('value'),
          'variable': $(this).find('state').attr('variable')};
        obj.bbox = self.stateAndInfoBboxProp(this, parentBbox);
        stateAndInfoArray.push(obj);
      }
    });

    return stateAndInfoArray;
  },
  addParentInfoToNode: function (ele, nodeObj, parent, compartments) {
    var self = this;
    //there is no complex parent
    if (parent == "") {
      //no compartment reference
      if (typeof $(ele).attr('compartmentRef') === 'undefined') {
        nodeObj.parent = "";

        //add compartment according to geometry
        for (var i = 0; i < compartments.length; i++) {
          var bbox = {
            'x': parseFloat($(ele).children('bbox').attr('x')),
            'y': parseFloat($(ele).children('bbox').attr('y')),
            'w': parseFloat($(ele).children('bbox').attr('w')),
            'h': parseFloat($(ele).children('bbox').attr('h')),
            'id': $(ele).attr('id')
          }
          if (self.isInBoundingBox(bbox, compartments[i])) {
            nodeObj.parent = compartments[i].id;
            break;
          }
        }
      }
      //there is compartment reference
      else {
        nodeObj.parent = $(ele).attr('compartmentRef');
      }
    }
    //there is complex parent
    else {
      nodeObj.parent = parent;
    }
  },
  addCytoscapeJsNode: function (ele, jsonArray, parent, compartments) {
    var self = this;
    var nodeObj = new Object();

    //add id information
    nodeObj.id = $(ele).attr('id');
    //add node bounding box information
    nodeObj.sbgnbbox = self.bboxProp(ele);
    //add class information
    nodeObj.sbgnclass = $(ele).attr('class');
    //add label information
    nodeObj.sbgnlabel = $(ele).children('label').attr('text');
    //add state and info box information
    nodeObj.sbgnstatesandinfos = self.stateAndInfoProp(ele, nodeObj.sbgnbbox);
    //adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);

    //add clone information
    if ($(ele).children('clone').length > 0)
      nodeObj.sbgnclonemarker = true;
    else
      nodeObj.sbgnclonemarker = undefined;

    //add port information
    var ports = [];
    $(ele).find('port').each(function () {
      var id = $(this).attr('id');
      var relativeXPos = parseFloat($(this).attr('x')) - nodeObj.sbgnbbox.x;
      var relativeYPos = parseFloat($(this).attr('y')) - nodeObj.sbgnbbox.y;
      
      relativeXPos = relativeXPos / parseFloat(nodeObj.sbgnbbox.w) * 100;
      relativeYPos = relativeYPos / parseFloat(nodeObj.sbgnbbox.h) * 100;
      
      ports.push({
        id: $(this).attr('id'),
        x: relativeXPos,
        y: relativeYPos
      });
    });

    nodeObj.ports = ports;

    var cytoscapeJsNode = {data: nodeObj};
    jsonArray.push(cytoscapeJsNode);
  },
  traverseNodes: function (ele, jsonArray, parent, compartments) {
    if (!sbgnElementUtilities.handledElements[$(ele).attr('class')]) {
      return;
    }
    this.insertedNodes[$(ele).attr('id')] = true;
    var self = this;
    //add complex nodes here
    if ($(ele).attr('class') === 'complex' || $(ele).attr('class') === 'submap') {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);

      $(ele).children('glyph').each(function () {
        if ($(this).attr('class') != 'state variable' &&
            $(this).attr('class') != 'unit of information') {
          self.traverseNodes(this, jsonArray, $(ele).attr('id'), compartments);
        }
      });
    }
    else {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);
    }
  },
  getArcSourceAndTarget: function (arc, xmlObject) {
    //source and target can be inside of a port
    var source = $(arc).attr('source');
    var target = $(arc).attr('target');
    var sourceNodeId, targetNodeId;

    $(xmlObject).find('glyph').each(function () {
      if ($(this).attr('id') == source) {
        sourceNodeId = source;
      }
      if ($(this).attr('id') == target) {
        targetNodeId = target;
      }
    });

    if (typeof sourceNodeId === 'undefined') {
      $(xmlObject).find("port").each(function () {
        if ($(this).attr('id') == source) {
          sourceNodeId = $(this).parent().attr('id');
        }
      });
    }

    if (typeof targetNodeId === 'undefined') {
      $(xmlObject).find("port").each(function () {
        if ($(this).attr('id') == target) {
          targetNodeId = $(this).parent().attr('id');
        }
      });
    }

    return {'source': sourceNodeId, 'target': targetNodeId};
  },
  getArcBendPointPositions: function (ele) {
    var bendPointPositions = [];
    
//    $(ele).children('start, next, end').each(function () {
    $(ele).children('next').each(function () {
      var posX = $(this).attr('x');
      var posY = $(this).attr('y');
      
      var pos = {
        x: posX,
        y: posY
      };
      
      bendPointPositions.push(pos);
    });
    
    return bendPointPositions;
  },
  addCytoscapeJsEdge: function (ele, jsonArray, xmlObject) {
    if (!sbgnElementUtilities.handledElements[$(ele).attr('class')]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);
    
    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }
    
    var edgeObj = new Object();
    var bendPointPositions = self.getArcBendPointPositions(ele);

    edgeObj.id = $(ele).attr('id');
    edgeObj.sbgnclass = $(ele).attr('class');
    edgeObj.bendPointPositions = bendPointPositions;

    if ($(ele).find('glyph').length <= 0) {
      edgeObj.sbgncardinality = 0;
    }
    else {
      $(ele).children('glyph').each(function () {
        if ($(this).attr('class') == 'cardinality') {
          edgeObj.sbgncardinality = $(this).find('label').attr('text');
        }
      });
    }

    edgeObj.source = sourceAndTarget.source;
    edgeObj.target = sourceAndTarget.target;

    edgeObj.portsource = $(ele).attr("source");
    edgeObj.porttarget = $(ele).attr("target");

    var cytoscapeJsEdge = {data: edgeObj};
    jsonArray.push(cytoscapeJsEdge);
  },
  convert: function (xmlObject) {
    var self = this;
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];

    var compartments = self.getAllCompartments(xmlObject);

    $(xmlObject).find("map").children('glyph').each(function () {
      self.traverseNodes(this, cytoscapeJsNodes, "", compartments);
    });

    $(xmlObject).find("map").children('arc').each(function () {
      self.addCytoscapeJsEdge(this, cytoscapeJsEdges, xmlObject);
    });

    var cytoscapeJsGraph = new Object();
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  }
};

module.exports = sbgnmlToJson;
},{"./sbgn-element-utilities":8}],11:[function(_dereq_,module,exports){
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var textUtilities = {
  //TODO: use CSS's "text-overflow:ellipsis" style instead of function below?
  truncateText: function (textProp, font) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;
    
    var fitLabelsToNodes = options.fitLabelsToNodes;
    fitLabelsToNodes = typeof fitLabelsToNodes === 'function' ? fitLabelsToNodes.call() : fitLabelsToNodes;
    
    var text = textProp.label || "";
    //If fit labels to nodes is false do not truncate
    if (fitLabelsToNodes == false) {
      return text;
    }
    var width;
    var len = text.length;
    var ellipsis = "..";
    var textWidth = (textProp.width > 30) ? textProp.width - 10 : textProp.width;
    while ((width = context.measureText(text).width) > textWidth) {
      --len;
      text = text.substring(0, len) + ellipsis;
    }
    return text;
  }
};

module.exports = textUtilities;
},{"./option-utilities":7}],12:[function(_dereq_,module,exports){
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var uiUtilities = {
  openDialog: function (el, options) {
    $(el).dialog(
        $.extend( {}, {
          modal: true,
          open: function () {
            var tapstartFcn, cxttapFcn, zoomFcn, panFcn;
            $('.ui-widget-overlay').bind('click', function () {
              $(el).dialog('close');
            });

            cy.ready(function () {
              cy.on('tapstart', tapstartFcn = function () {
                $(el).data('tapstartFcn', tapstartFcn);
                $(el).dialog('close');
              });

              cy.on('cxttap', cxttapFcn = function () {
                $(el).data('cxttapFcn', cxttapFcn);
                $(el).dialog('close');
              });
              
              cy.on('zoom', zoomFcn = function () {
                $(el).data('zoomFcn', zoomFcn);
                $(el).dialog('close');
              });
              
              cy.on('pan', panFcn = function () {
                $(el).data('panFcn', panFcn);
                $(el).dialog('close');
              });
            });
          },
          close: function () {
            cy.ready(function () {
              if($(el).data('tapstartFcn')) {
                cy.off('tapstart', $(el).data('tapstartFcn'));
              }
              
              if($(el).data('cxttapFcn')) {
                cy.off('cxttap', $(el).data('cxttapFcn'));
              }
              
              if($(el).data('zoomFcn')) {
                cy.off('zoom', $(el).data('zoomFcn'));
              }
              
              if($(el).data('panFcn')) {
                cy.off('pan', $(el).data('panFcn'));
              }
            });
          }
        }, options )
    );
  },
  openFancybox: function($template, options) {
    $.fancybox(
        _.template($template.html(), {}),
        $.extend( {}, {
          'autoDimensions': true,
          'transitionIn': 'none',
          'transitionOut': 'none',
          'onStart': function() {
            var zoomFcn, panFcn;
            cy.ready(function () {
              cy.on('zoom', zoomFcn = function () {
                $template.data('zoomFcn', zoomFcn);
                $.fancybox.close();
              });

              cy.on('pan', panFcn = function () {
                $template.data('panFcn', panFcn);
                $.fancybox.close();
              });
            });
          },
          'onClosed': function() {
            cy.ready(function () {
              if ($template.data('zoomFcn')) {
                cy.off('zoom', $template.data('zoomFcn'));
              }

              if ($template.data('panFcn')) {
                cy.off('pan', $template.data('panFcn'));
              }
            });
          }
        }, options) );
  },
  startSpinner: function (className) {
    if (!className) {
      className = 'default-class';
    }
    
    if ($('.' + className).length === 0) {
      var containerWidth = $(options.networkContainerSelector).width();
      var containerHeight = $(options.networkContainerSelector).height();
      $(options.networkContainerSelector + ':parent').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw ' + className + '"></i>');
    }
  },
  endSpinner: function (className) {
    if (!className) {
      className = 'default-class';
    }
    
    if ($('.' + className).length > 0) {
      $('.' + className).remove();
    }
  }
};

module.exports = uiUtilities;



},{"./option-utilities":7}],13:[function(_dereq_,module,exports){
/*
 * This file exports the functions to be utilized in undoredo extension actions 
 */
var sbgnElementUtilities = _dereq_('./sbgn-element-utilities');

var undoRedoActionFunctions = {
  // Section Start
  // Add/remove action functions
  deleteElesSimple: function (param) {
    return sbgnElementUtilities.deleteElesSimple(param.eles);
  },
  restoreEles: function (eles) {
    var param = {};
    param.eles = sbgnElementUtilities.restoreEles(eles);
    return param;
  },
  deleteElesSmart: function (param) {
    if (param.firstTime) {
      return sbgnElementUtilities.deleteElesSmart(param.eles);
    }
    return sbgnElementUtilities.deleteElesSimple(param.eles);
  },
  // Section End
  // Add/remove action functions
};

module.exports = undoRedoActionFunctions;
},{"./sbgn-element-utilities":8}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL2N5dG9zY2FwZS5yZW5kZXJlci5jYW52YXMuc2Jnbi1yZW5kZXJlci5qcyIsInNyYy9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZS5qcyIsInNyYy91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ24tZWxlbWVudC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ24tZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy91aS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzE5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBzYmdudml6ID0gd2luZG93LnNiZ252aXogPSBmdW5jdGlvbihfb3B0aW9ucykge1xyXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcclxuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpO1xyXG4gICAgXHJcbiAgICB2YXIgc2JnblJlbmRlcmVyID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvY3l0b3NjYXBlLnJlbmRlcmVyLmNhbnZhcy5zYmduLXJlbmRlcmVyJyk7XHJcbiAgICB2YXIgc2JnbkN5SW5zdGFuY2UgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlJyk7XHJcbiAgICBcclxuICAgIC8vIFV0aWxpdGllcyB3aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSBleHBvc2VkIHNlcGVyYXRlbHlcclxuICAgIHZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VpLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIGZpbGVVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHNiZ25HcmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3NiZ24tZ3JhcGgtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XHJcbiAgICAvLyBVdGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBhcyBpc1xyXG4gICAgdmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvc2Jnbi1lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxuICAgIFxyXG4gICAgdmFyIGxpYnMgPSBvcHRpb25zLmxpYnM7XHJcbiAgICBcclxuICAgIHNiZ25SZW5kZXJlcigpO1xyXG4gICAgc2JnbkN5SW5zdGFuY2UoKTtcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcclxuICAgIC8vIEV4cG9zZSBzYmduRWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXMsIG1vc3QgdXNlcnMgd2lsbCBub3QgbmVlZCB0aGVzZVxyXG4gICAgc2JnbnZpei5zYmduRWxlbWVudFV0aWxpdGllcyA9IHNiZ25FbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBmaWxlVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBmaWxlVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiB1aVV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gdWlVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIHNiZ24gZ3JhcGggdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHNiZ25HcmFwaFV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gc2JnbkdyYXBoVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gc2JnbnZpejtcclxuICB9XHJcbn0pKCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyICQkID0gY3l0b3NjYXBlO1xyXG4gIHZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbiAgXHJcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduU2hhcGVzID0ge1xyXG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAncHJvY2Vzcyc6IHRydWUsXHJcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQudG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24gPSB7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jYXJkaW5hbGl0eVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib3hMZW5ndGg6IDEzLFxyXG4gICAgICBkaXN0YW5jZVRvTm9kZTogMjUsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBcIjlweCBBcmlhbFwiO1xyXG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCwgZmFsc2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uYWRkUG9ydFJlcGxhY2VtZW50SWZBbnkgPSBmdW5jdGlvbiAobm9kZSwgZWRnZVBvcnQpIHtcclxuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XHJcbiAgICB2YXIgcG9zWSA9IG5vZGUucG9zaXRpb24oKS55O1xyXG4gICAgaWYgKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgICBpZiAocG9ydC5pZCA9PSBlZGdlUG9ydCkge1xyXG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XHJcbiAgICAgICAgICBwb3NZID0gcG9zWSArIHBvcnQueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xyXG4gIH1cclxuICA7XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XHJcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxyXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuXHJcbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3UXVhZHJhdGljTGluZUNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGNvbnRleHQsIGVkZ2UsIHB0cywgdHlwZSkge1xyXG4gICAgY29udGV4dC5tb3ZlVG8ocHRzWzBdLCBwdHNbMV0pO1xyXG4gICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHB0c1syXSwgcHRzWzNdLCBwdHNbNF0sIHB0c1s1XSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPT0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciB0b3RhbExlbmd0aCA9IHFCZXppZXJMZW5ndGgocHRzKTtcclxuXHJcbiAgICB2YXIgc3RhcnRMZW5ndGggPSB0b3RhbExlbmd0aCAtIDI1O1xyXG5cclxuICAgIHZhciBzdGFydFBvcnRpb24gPSBzdGFydExlbmd0aCAvIHRvdGFsTGVuZ3RoO1xyXG5cclxuICAgIGlmICh0eXBlID09PSBcImNvbnN1bXB0aW9uXCIpIHtcclxuICAgICAgc3RhcnRQb3J0aW9uID0gY2FyUHJvcC5kaXN0YW5jZVRvU291cmNlIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFBvcnRpb24gPSAodG90YWxMZW5ndGggLSBjYXJQcm9wLmRpc3RhbmNlVG9UYXJnZXQpIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQgPSBzdGFydFBvcnRpb247XHJcbiAgICB2YXIgeDEgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1swXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1syXSArIHQgKiB0ICogcHRzWzRdO1xyXG4gICAgdmFyIHkxID0gKDEgLSB0KSAqICgxIC0gdCkgKiBwdHNbMV0gKyAyICogKDEgLSB0KSAqIHQgKiBwdHNbM10gKyB0ICogdCAqIHB0c1s1XTtcclxuXHJcbiAgICAvL2dldCBhIHNob3J0IGxpbmUgdG8gZGV0ZXJtaW5lIHRhbmdldCBsaW5lXHJcbiAgICB0ID0gc3RhcnRQb3J0aW9uICsgMC4wMTtcclxuICAgIHZhciB4MiA9ICgxIC0gdCkgKiAoMSAtIHQpICogcHRzWzBdICsgMiAqICgxIC0gdCkgKiB0ICogcHRzWzJdICsgdCAqIHQgKiBwdHNbNF07XHJcbiAgICB2YXIgeTIgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1sxXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1szXSArIHQgKiB0ICogcHRzWzVdO1xyXG5cclxuICAgIHZhciBkaXNwWCA9IHgxIC0geDI7XHJcbiAgICB2YXIgZGlzcFkgPSB5MSAtIHkyO1xyXG5cclxuICAgIHZhciBhbmdsZSA9IE1hdGguYXNpbihkaXNwWSAvIChNYXRoLnNxcnQoZGlzcFggKiBkaXNwWCArIGRpc3BZICogZGlzcFkpKSk7XHJcblxyXG4gICAgaWYgKGRpc3BYIDwgMCkge1xyXG4gICAgICBhbmdsZSA9IGFuZ2xlICsgTWF0aC5QSSAvIDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbmdsZSA9IC0oTWF0aC5QSSAvIDIgKyBhbmdsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgxLCB5MSk7XHJcbiAgICBjb250ZXh0LnJvdGF0ZSgtYW5nbGUpO1xyXG5cclxuICAgIGNvbnRleHQucmVjdCgwLCAtMTMgLyAyLCAxMywgMTMpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogMCwgJ2NlbnRlclknOiAxMyAvIDIsXHJcbiAgICAgICdvcGFjaXR5JzogZWRnZS5jc3MoJ3RleHQtb3BhY2l0eScpICogZWRnZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgJ3dpZHRoJzogMTMsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKGFuZ2xlKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14MSwgLXkxKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RyYWlnaHRMaW5lQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoY29udGV4dCwgZWRnZSwgcHRzLCB0eXBlKSB7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMF0sIHB0c1sxXSk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhwdHNbMl0sIHB0c1szXSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPD0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciBsZW5ndGggPSAoTWF0aC5zcXJ0KChwdHNbMl0gLSBwdHNbMF0pICogKHB0c1syXSAtIHB0c1swXSkgK1xyXG4gICAgICAgICAgICAocHRzWzNdIC0gcHRzWzFdKSAqIChwdHNbM10gLSBwdHNbMV0pKSk7XHJcblxyXG4gICAgdmFyIGRpc3BYLCBkaXNwWSwgc3RhcnRYLCBzdGFydFk7XHJcblxyXG4gICAgLy9UT0RPIDogeW91IG1heSBuZWVkIHRvIGNoYW5nZSBoZXJlXHJcbiAgICBpZiAodHlwZSA9PT0gXCJjb25zdW1wdGlvblwiKSB7XHJcbiAgICAgIHN0YXJ0WCA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFg7XHJcbiAgICAgIHN0YXJ0WSA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFggPSBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmFycm93RW5kWDtcclxuICAgICAgc3RhcnRZID0gZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5hcnJvd0VuZFk7XHJcbiAgICB9XHJcbiAgICB2YXIgc3JjUG9zID0gKHR5cGUgPT09IFwiY29uc3VtcHRpb25cIikgPyBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCkgOiBlZGdlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcbiAgICAvL3ZhciBzcmNQb3MgPSBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XHJcbiAgICBkaXNwWCA9IHN0YXJ0WCAtIHNyY1Bvcy54O1xyXG4gICAgZGlzcFkgPSBzdGFydFkgLSBzcmNQb3MueTtcclxuXHJcbiAgICB2YXIgYW5nbGUgPSBNYXRoLmFzaW4oZGlzcFkgLyAoTWF0aC5zcXJ0KGRpc3BYICogZGlzcFggKyBkaXNwWSAqIGRpc3BZKSkpO1xyXG5cclxuICAgIGlmIChkaXNwWCA8IDApIHtcclxuICAgICAgYW5nbGUgPSBhbmdsZSArIE1hdGguUEkgLyAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW5nbGUgPSAtKE1hdGguUEkgLyAyICsgYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHN0YXJ0WCwgc3RhcnRZKTtcclxuICAgIGNvbnRleHQucm90YXRlKC1hbmdsZSk7XHJcblxyXG4gICAgaWYgKGxlbmd0aCA+IGNhclByb3AuZGlzdGFuY2VUb05vZGUpIHtcclxuICAgICAgY29udGV4dC5yZWN0KDAsIC1jYXJQcm9wLmRpc3RhbmNlVG9Ob2RlLCBjYXJQcm9wLmJveExlbmd0aCwgY2FyUHJvcC5ib3hMZW5ndGgpO1xyXG5cclxuICAgICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogLWNhclByb3AuZGlzdGFuY2VUb05vZGUgKyBjYXJQcm9wLmJveExlbmd0aCAvIDIsICdjZW50ZXJZJzogLWNhclByb3AuYm94TGVuZ3RoIC8gMixcclxuICAgICAgICAnb3BhY2l0eSc6IGVkZ2UuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIGVkZ2UuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogY2FyUHJvcC5ib3hMZW5ndGgsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICAgJCQuc2Jnbi5kcmF3Q2FyZGluYWxpdHlUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXN0YXJ0WCwgLXN0YXJ0WSk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xyXG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xyXG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XHJcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XHJcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XHJcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcclxuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvd25XaWR0aCA9IGRvd25XaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcclxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICBzdGF0ZS5iYm94LnkgPSAoc3RhdGVDZW50ZXJZIC0gY2VudGVyWSkgKiAxMDAgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcclxuICAgIHZhciBzdGF0ZVZhcmlhYmxlID0gdGV4dFByb3Auc3RhdGUudmFyaWFibGUgfHwgJyc7XHJcblxyXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgPyBcIkBcIiArIHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgOiBcIlwiKTtcclxuXHJcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG5cclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGVMYWJlbDtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIGZvbnRTaXplID0gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wLCB0cnVuY2F0ZSkge1xyXG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XHJcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xyXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRleHRQcm9wLmNvbG9yO1xyXG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XHJcbiAgICB2YXIgdGV4dDtcclxuICAgIFxyXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcclxuICAgIFxyXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XHJcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xyXG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gIH07XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xyXG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3cocG9pbnQxWzBdIC0gcG9pbnQyWzBdLCAyKSArIE1hdGgucG93KHBvaW50MVsxXSAtIHBvaW50MlsxXSwgMik7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNvbG9ycyA9IHtcclxuICAgIGNsb25lOiBcIiNhOWE5YTlcIixcclxuICAgIGFzc29jaWF0aW9uOiBcIiM2QjZCNkJcIixcclxuICAgIHBvcnQ6IFwiIzZCNkI2QlwiXHJcbiAgfTtcclxuXHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgMCk7XHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQubGluZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcztcclxuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxyXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXHJcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxyXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuXHJcbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxyXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xyXG5cclxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xyXG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XHJcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdkaXNzb2NpYXRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5zcGVjaWZpZWQgZW50aXR5Jyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ29taXR0ZWQgcHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3VuY2VydGFpbiBwcm9jZXNzJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcclxuXHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdwcm9kdWN0aW9uJyk7XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMuYXJyb3dTaGFwZS5lbnVtcy5wdXNoKCduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25BcnJvd1NoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ10pO1xyXG4gICAgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xyXG4gICAgICAtMC4xOCwgLTAuNDMsXHJcbiAgICAgIDAuMTgsIC0wLjQzXHJcbiAgICBdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0gY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ107XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKSxcclxuICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlKGNvbnRleHQsIG5vZGUsIHRoaXMucG9pbnRzKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5VmFyaWFibGVzLmN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZGlzc29jaWF0aW9uXCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDQsIGhlaWdodCAvIDQpO1xyXG5cclxuICAgICAgICAvLyBBdCBvcmlnaW4sIHJhZGl1cyAxLCAwIHRvIDJwaVxyXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDAsIE1hdGguUEkgKiAyICogMC45OTksIGZhbHNlKTsgLy8gKjAuOTk5IGIvYyBjaHJvbWUgcmVuZGVyaW5nIGJ1ZyBvbiBmdWxsIGNpcmNsZVxyXG5cclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoNCAvIHdpZHRoLCA0IC8gaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBbXSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBjb3JuZXJMZW5ndGg6IDEyLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBoYXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlckhlaWdodCgpIDogbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbi8vICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uaW50ZXJzZWN0TGluZSxcclxuLy8gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJXaWR0aCgpIDogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJIZWlnaHQoKSA6IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gKGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAoaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeVZhcmlhYmxlcy5jeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcblxyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRyYXdQYXRoOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsXHJcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwdHMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc291cmNlQW5kU2luayhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgLy9jb250ZXh0LmZpbGwoKTtcclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcclxuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBlcnR1cmJpbmdBZ2VudDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDg7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTUgLyA2LCAtMSwgNSAvIDYsIC0xLCAxLCAxLCAtMSwgMV07XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgcmVuZGVyZXIuZHJhd1BvbHlnb24oY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxyXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hY3JvbW9sZWN1bGU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgICAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTEsIC0xLCAxLCAtMSwgMSAtIGNwWCwgMSwgLTEgKyBjcFgsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuXHJcbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgIGlmIChwb3J0cy5sZW5ndGggPCAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcclxuICAgICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcG9ydC54ICogd2lkdGggLyAxMDAgKyBub2RlWCwgcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgbm9kZVksIDEsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcclxuICAgIHZhciBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgIHZhciBjaGVja1BvaW50ID0gW2ludGVyc2VjdGlvbnNbaV0sIGludGVyc2VjdGlvbnNbaSArIDFdXTtcclxuICAgICAgdmFyIGRpc3RhbmNlID0gY3lWYXJpYWJsZXMuY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcclxuXHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW50ZXJzZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIG5vZGVYLCBub2RlWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHMsIHdlIGhhdmUgb25seSB0d28gYXJjcyBmb3JcclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxyXG4gICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggc3RyYWlnaHQgbGluZSBzZWdtZW50c1xyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3AgTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BMZWZ0Q2VudGVyWCwgdG9wTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvcCBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcFJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgdyA9IHdpZHRoIC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGFuID0gY2VudGVyWDtcclxuICAgIHZhciBibiA9IGNlbnRlclk7XHJcblxyXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XHJcblxyXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcclxuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcclxuICAgIHZhciBhID0gaCAqIGggKyB3ICogdyAqIG0gKiBtO1xyXG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcclxuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXHJcbiAgICAgICAgICAgIGJuICogYm4gKiB3ICogdyAtIGggKiBoICogdyAqIHc7XHJcblxyXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xyXG5cclxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG4gICAgdmFyIHQyID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuXHJcbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XHJcbiAgICB2YXIgeE1heCA9IE1hdGgubWF4KHQxLCB0Mik7XHJcblxyXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIHlNYXggPSBtICogeE1heCAtIG0gKiB4MiArIHkyO1xyXG5cclxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuXHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KHN0YXRlSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVDaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludChcclxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGluZm9Db3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4vLyAgJCQuc2Jnbi5pbnRlcnNldExpbmVTZWxlY3Rpb24gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuLy8gICAgLy9UT0RPOiBkbyBpdCBmb3IgYWxsIGNsYXNzZXMgaW4gc2JnbiwgY3JlYXRlIGEgc2JnbiBjbGFzcyBhcnJheSB0byBjaGVja1xyXG4vLyAgICBpZiAodGVtcFNiZ25TaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuLy8gICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldLmludGVyc2VjdExpbmUoXHJcbi8vICAgICAgICAgIG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbi8vICAgIH1cclxuLy8gICAgZWxzZSB7XHJcbi8vICAgICAgcmV0dXJuIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXS5pbnRlcnNlY3RMaW5lKFxyXG4vLyAgICAgICAgICBub2RlLl9wcml2YXRlLnBvc2l0aW9uLngsXHJcbi8vICAgICAgICAgIG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSxcclxuLy8gICAgICAgICAgbm9kZS5vdXRlcldpZHRoKCksXHJcbi8vICAgICAgICAgIG5vZGUub3V0ZXJIZWlnaHQoKSxcclxuLy8gICAgICAgICAgeCwgLy9oYWxmUG9pbnRYLFxyXG4vLyAgICAgICAgICB5LCAvL2hhbGZQb2ludFlcclxuLy8gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJvcmRlci13aWR0aFwiXS5weFZhbHVlIC8gMlxyXG4vLyAgICAgICAgICApO1xyXG4vLyAgICB9XHJcbi8vICB9O1xyXG5cclxuICAkJC5zYmduLmlzTm9kZVNoYXBlVG90YWxseU92ZXJyaWRlbiA9IGZ1bmN0aW9uIChyZW5kZXIsIG5vZGUpIHtcclxuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufTtcclxuIiwidmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3NiZ24tZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBzYmduR3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvc2Jnbi1ncmFwaC11dGlsaXRpZXMnKTtcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xudmFyIHJlZnJlc2hQYWRkaW5ncyA9IHNiZ25HcmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChzYmduR3JhcGhVdGlsaXRpZXMpO1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb250YWluZXJTZWxlY3RvciA9IG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yO1xuICB2YXIgaW1nUGF0aCA9IG9wdGlvbnMuaW1nUGF0aDtcbiAgXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXG4gIHtcbiAgICB2YXIgc2Jnbk5ldHdvcmtDb250YWluZXIgPSAkKGNvbnRhaW5lclNlbGVjdG9yKTtcblxuICAgIC8vIGNyZWF0ZSBhbmQgaW5pdCBjeXRvc2NhcGU6XG4gICAgdmFyIGN5ID0gY3l0b3NjYXBlKHtcbiAgICAgIGNvbnRhaW5lcjogc2Jnbk5ldHdvcmtDb250YWluZXIsXG4gICAgICBzdHlsZTogc2JnblN0eWxlU2hlZXQsXG4gICAgICBzaG93T3ZlcmxheTogZmFsc2UsIG1pblpvb206IDAuMTI1LCBtYXhab29tOiAxNixcbiAgICAgIGJveFNlbGVjdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICBtb3Rpb25CbHVyOiB0cnVlLFxuICAgICAgd2hlZWxTZW5zaXRpdml0eTogMC4xLFxuICAgICAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmN5ID0gdGhpcztcbiAgICAgICAgLy8gSWYgdW5kb2FibGUgcmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgICAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICAgIGJpbmRDeUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgXG4gIC8vIE5vdGUgdGhhdCBpbiBDaGlTRSB0aGlzIGZ1bmN0aW9uIGlzIGluIGEgc2VwZXJhdGUgZmlsZSBidXQgaW4gdGhlIHZpZXdlciBpdCBoYXMganVzdCAyIG1ldGhvZHMgYW5kIHNvIGl0IGlzIGxvY2F0ZWQgaW4gdGhpcyBmaWxlXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCkge1xuICAgIC8vIGNyZWF0ZSBvciBnZXQgdGhlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG5cbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGJpbmRDeUV2ZW50cygpIHtcbiAgICBjeS5vbigndGFwZW5kJywgJ25vZGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfSk7XG4gICAgXG4gICAgY3kub24oXCJiZWZvcmVDb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAvL1RoZSBjaGlsZHJlbiBpbmZvIG9mIGNvbXBsZXggbm9kZXMgc2hvdWxkIGJlIHNob3duIHdoZW4gdGhleSBhcmUgY29sbGFwc2VkXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICAvL1RoZSBub2RlIGlzIGJlaW5nIGNvbGxhcHNlZCBzdG9yZSBpbmZvbGFiZWwgdG8gdXNlIGl0IGxhdGVyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRJbmZvTGFiZWwobm9kZSk7XG4gICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWwgPSBpbmZvTGFiZWw7XG4gICAgICB9XG5cbiAgICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XG4gICAgICAvLyByZW1vdmUgYmVuZCBwb2ludHMgYmVmb3JlIGNvbGxhcHNlXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgICAgIGlmIChlZGdlLmhhc0NsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpKSB7XG4gICAgICAgICAgZWRnZS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcbiAgICAgICAgICBkZWxldGUgZWRnZS5fcHJpdmF0ZS5jbGFzc2VzWydlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cyddO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlckNvbGxhcHNlXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIHJlZnJlc2hQYWRkaW5ncygpO1xuXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICBub2RlLmFkZENsYXNzKCdjaGFuZ2VDb250ZW50Jyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImJlZm9yZUV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICBub2RlLnJlbW92ZURhdGEoXCJpbmZvTGFiZWxcIik7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImFmdGVyRXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcbiAgICAgIC8vRG9uJ3Qgc2hvdyBjaGlsZHJlbiBpbmZvIHdoZW4gdGhlIGNvbXBsZXggbm9kZSBpcyBleHBhbmRlZFxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnY29udGVudCcpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZWZyZXNoUGFkZGluZ3MoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzYmduU3R5bGVTaGVldCA9IGN5dG9zY2FwZS5zdHlsZXNoZWV0KClcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnY29udGVudCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZjZmNmY2JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICAgICAndGV4dC1vcGFjaXR5JzogMSxcbiAgICAgICAgICAgICdvcGFjaXR5JzogMVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVs/c2JnbmNsb25lbWFya2VyXVtzYmduY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBpbWdQYXRoICsgJy9jbG9uZV9iZy5wbmcnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teSc6ICcxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXdpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1maXQnOiAnbm9uZScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdzYmduY2xvbmVtYXJrZXInKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lTaGFwZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J3RhZyddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIDAuMjUsIC0xLCAgIDEsIDAsICAgIDAuMjUsIDEsICAgIC0xLCAxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2Fzc29jaWF0aW9uJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyM2QjZCNkInXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzcz0nY29tcGxleCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjRjRGM0VFJyxcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSdjb21wYXJ0bWVudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy43NSxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25iYm94XVtzYmduY2xhc3NdW3NiZ25jbGFzcyE9J2NvbXBsZXgnXVtzYmduY2xhc3MhPSdjb21wYXJ0bWVudCddW3NiZ25jbGFzcyE9J3N1Ym1hcCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnd2lkdGgnOiAnZGF0YShzYmduYmJveC53KScsXG4gICAgICAgICAgICAnaGVpZ2h0JzogJ2RhdGEoc2JnbmJib3guaCknXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6IDM2LFxuICAgICAgICAgICAgJ2hlaWdodCc6IDM2XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjMDAwJyxcbiAgICAgICAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6YWN0aXZlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnMTQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnY3VydmUtc3R5bGUnOiAnYmV6aWVyJyxcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2hvbGxvdycsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICd3aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC1yb3RhdGlvbic6ICdhdXRvcm90YXRlJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtc2hhcGUnOiAncmVjdGFuZ2xlJyxcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1vcGFjaXR5JzogJzEnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLXdpZHRoJzogJzEnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLW9wYWNpdHknOiAnMSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdjb25zdW1wdGlvbiddW3NiZ25jYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc291cmNlLWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnc2JnbmNhcmRpbmFsaXR5Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW1hcmdpbi15JzogJy0xMCcsXG4gICAgICAgICAgICAnc291cmNlLXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3M9J3Byb2R1Y3Rpb24nXVtzYmduY2FyZGluYWxpdHkgPiAwXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ3NiZ25jYXJkaW5hbGl0eScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldEN5QXJyb3dTaGFwZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctc2hhcGUnOiAnbm9uZSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdpbmhpYml0aW9uJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jbGFzcz0ncHJvZHVjdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgICAgIH0pO1xufTsiLCIvKlxuICogRmlsZSBVdGlsaXRpZXM6IFRvIGJlIHVzZWQgb24gcmVhZC93cml0ZSBmaWxlIG9wZXJhdGlvblxuICovXG5cbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XG52YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3VpLXV0aWxpdGllcycpO1xudmFyIHNiZ25HcmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vc2Jnbi1ncmFwaC11dGlsaXRpZXMnKTtcbnZhciBzYmdudml6VXBkYXRlID0gc2JnbkdyYXBoVXRpbGl0aWVzLnNiZ252aXpVcGRhdGUuYmluZChzYmduR3JhcGhVdGlsaXRpZXMpO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIFN0YXJ0XG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxuZnVuY3Rpb24gYjY0dG9CbG9iKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpIHtcbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcbiAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcblxuICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xuICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xuXG4gIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xuICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcblxuICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xuXG4gICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XG4gIH1cblxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICByZXR1cm4gYmxvYjtcbn1cbi8vIEhlbHBlciBmdW5jdGlvbnMgRW5kXG5cbmZ1bmN0aW9uIGZpbGVVdGlsaXRpZXMoKSB7fVxuXG5maWxlVXRpbGl0aWVzLnNhdmVBc1BuZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBwbmdDb250ZW50ID0gY3kucG5nKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xuXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXG4gIHZhciBiNjRkYXRhID0gcG5nQ29udGVudC5zdWJzdHIocG5nQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvcG5nXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsucG5nXCIpO1xufTtcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNKcGcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIganBnQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcblxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxuICB2YXIgYjY0ZGF0YSA9IGpwZ0NvbnRlbnQuc3Vic3RyKGpwZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL2pwZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLmpwZ1wiKTtcbn07XG5cbmZpbGVVdGlsaXRpZXMubG9hZFhNTERvYyA9IGZ1bmN0aW9uKGZ1bGxGaWxlUGF0aCkge1xuICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XG4gIH1cbiAgeGh0dHAub3BlbihcIkdFVFwiLCBmdWxsRmlsZVBhdGgsIGZhbHNlKTtcbiAgeGh0dHAuc2VuZCgpO1xuICByZXR1cm4geGh0dHAucmVzcG9uc2VYTUw7XG59O1xuXG4vLyBTaG91bGQgdGhpcyBiZSBleHBvc2VkIG9yIHNob3VsZCB0aGlzIGJlIG1vdmVkIHRvIHRoZSBoZWxwZXIgZnVuY3Rpb25zIHNlY3Rpb24/XG5maWxlVXRpbGl0aWVzLnRleHRUb1htbE9iamVjdCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XG4gICAgdmFyIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XG4gICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcbiAgICBkb2MubG9hZFhNTCh0ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L3htbCcpO1xuICB9XG4gIHJldHVybiBkb2M7XG59O1xuXG5maWxlVXRpbGl0aWVzLmxvYWRTYW1wbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgZm9sZGVycGF0aCkge1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XG4gIC8vIGxvYWQgeG1sIGRvY3VtZW50IHVzZSBkZWZhdWx0IGZvbGRlciBwYXRoIGlmIGl0IGlzIG5vdCBzcGVjaWZpZWRcbiAgdmFyIHhtbE9iamVjdCA9IHRoaXMubG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xuICBcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYSBzYW1wbGUgaXMgYmVpbmcgbG9hZGVkXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlXCIsIFsgZmlsZW5hbWUgXSApOyAvL3NldEZpbGVDb250ZW50KGZpbGVuYW1lLnJlcGxhY2UoJ3htbCcsICdzYmdubWwnKSk7XG4gIFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBzYmdudml6VXBkYXRlKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHhtbE9iamVjdCkpO1xuICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XG4gIH0sIDApO1xufTtcblxuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgXG4gIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xuXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gdGhpcy5yZXN1bHQ7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoc2VsZi50ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcbiAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgICB9LCAwKTtcbiAgfTtcblxuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhbiBleHRlcm5hbCBmaWxlIGlzIGJlaW5nIGxvYWRlZFxuICAvLyBUcmlnZ2VyIGFuIGV2ZW50IGZvciB0aGlzIHB1cnBvc2UgYW5kIHNwZWNpZnkgdGhlICdmaWxlbmFtZScgYXMgYW4gZXZlbnQgcGFyYW1ldGVyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVcIiwgWyBmaWxlLm5hbWUgXSApOyAvL3NldEZpbGVDb250ZW50KGZpbGUubmFtZSk7XG59O1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc1NiZ25tbCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xuXG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XG4gICAgdHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTg7XCIsXG4gIH0pO1xuICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXRpbGl0aWVzOyIsInZhciBqc29uVG9TYmdubWwgPSB7XHJcbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c2JnbiB4bWxucz0naHR0cDovL3NiZ24ub3JnL2xpYnNiZ24vMC4yJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG1hcCBsYW5ndWFnZT0ncHJvY2VzcyBkZXNjcmlwdGlvbic+XFxuXCI7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGdseXBoIHNiZ25tbFxyXG4gICAgICAgIGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5pc0NoaWxkKCkpXHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGFyYyBzYmdubWxcclxuICAgICAgICBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEFyY1NiZ25tbCh0aGlzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvbWFwPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L3NiZ24+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRHbHlwaFNiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nY29tcGFydG1lbnQnIFwiO1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEucGFyZW50ICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRHbHlwaFNiZ25tbCh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PT0gXCJjb21wbGV4XCIgfHwgbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PT0gXCJzdWJtYXBcIil7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzICsgXCInIFwiO1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYocGFyZW50Ll9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiA+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRHbHlwaFNiZ25tbCh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXsvL2l0IGlzIGEgc2ltcGxlIG5vZGVcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmlkICsgXCInIGNsYXNzPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgKyBcIidcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5hZGRDb21tb25HbHlwaFByb3BlcnRpZXMobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAgc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL2FkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRMYWJlbChub2RlKTtcclxuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZEdseXBoQmJveChub2RlKTtcclxuICAgICAgICAvL2FkZCBjbG9uZSBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRDbG9uZShub2RlKTtcclxuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFBvcnQobm9kZSk7XHJcbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmdldFN0YXRlQW5kSW5mb1NiZ25tbChub2RlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENsb25lIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGNsb25lLz5cXG5cIjtcclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0U3RhdGVBbmRJbmZvU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3MubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIGJveEdseXBoID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVCb3hHbHlwaChib3hHbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZEluZm9Cb3hHbHlwaChib3hHbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEFyY1NiZ25tbCA6IGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy9UZW1wb3JhcnkgaGFjayB0byByZXNvbHZlIFwidW5kZWZpbmVkXCIgYXJjIHNvdXJjZSBhbmQgdGFyZ2V0c1xyXG4gICAgICAgIHZhciBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldDtcclxuICAgICAgICB2YXIgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNTb3VyY2UgPT0gbnVsbCB8fCBhcmNTb3VyY2UubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xyXG5cclxuICAgICAgICBpZiAoYXJjVGFyZ2V0ID09IG51bGwgfHwgYXJjVGFyZ2V0Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcclxuXHJcbiAgICAgICAgdmFyIGFyY0lkID0gYXJjU291cmNlICsgXCItXCIgKyBhcmNUYXJnZXQ7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8YXJjIGlkPSdcIiArIGFyY0lkICtcclxuICAgICAgICAgICAgXCInIHRhcmdldD0nXCIgKyBhcmNUYXJnZXQgK1xyXG4gICAgICAgICAgICBcIicgc291cmNlPSdcIiArIGFyY1NvdXJjZSArIFwiJyBjbGFzcz0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzICsgXCInPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHN0YXJ0IHk9J1wiICsgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFkgKyBcIicgeD0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCArIFwiJy8+XFxuXCI7XHJcblxyXG4gICAgICAgIHZhciBzZWdwdHMgPSBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmdldFNlZ21lbnRQb2ludHMoZWRnZSk7XHJcbiAgICAgICAgaWYoc2VncHRzKXtcclxuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IHNlZ3B0cyAmJiBpIDwgc2VncHRzLmxlbmd0aDsgaSA9IGkgKyAyKXtcclxuICAgICAgICAgICAgdmFyIGJlbmRYID0gc2VncHRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxuZXh0IHk9J1wiICsgYmVuZFkgKyBcIicgeD0nXCIgKyBiZW5kWCArIFwiJy8+XFxuXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGVuZCB5PSdcIiArIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWSArIFwiJyB4PSdcIiArXHJcbiAgICAgICAgICAgIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWCArIFwiJy8+XFxuXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2FyYz5cXG5cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XHJcbiAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgLSBoZWlnaHQvMjtcclxuICAgICAgICByZXR1cm4gXCI8YmJveCB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICtcclxuICAgICAgICAgICAgXCInIHc9J1wiICsgd2lkdGggKyBcIicgaD0nXCIgKyBoZWlnaHQgKyBcIicgLz5cXG5cIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVBbmRJbmZvQmJveCA6IGZ1bmN0aW9uKG5vZGUsIGJveEdseXBoKXtcclxuICAgICAgICBib3hCYm94ID0gYm94R2x5cGguYmJveDtcclxuXHJcbiAgICAgICAgdmFyIHggPSBib3hCYm94LnggLyAxMDAgKiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIHkgPSBib3hCYm94LnkgLyAxMDAgKiBub2RlLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgKHggLSBib3hCYm94LncvMik7XHJcbiAgICAgICAgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArICh5IC0gYm94QmJveC5oLzIpO1xyXG4gICAgICAgIHJldHVybiBcIjxiYm94IHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggK1xyXG4gICAgICAgICAgICBcIicgdz0nXCIgKyBib3hCYm94LncgKyBcIicgaD0nXCIgKyBib3hCYm94LmggKyBcIicgLz5cXG5cIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkUG9ydCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgcG9ydHMubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArIHBvcnRzW2ldLnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxwb3J0IGlkPSdcIiArIHBvcnRzW2ldLmlkICtcclxuICAgICAgICAgICAgICAgIFwiJyB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICsgXCInIC8+XFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRMYWJlbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBsYWJlbCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIHRleHQ9J1wiICsgbGFiZWwgKyBcIicgLz5cXG5cIjtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVCb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuaWQgKyBcIicgY2xhc3M9J3N0YXRlIHZhcmlhYmxlJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHN0YXRlIFwiO1xyXG5cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YWx1ZSAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInZhbHVlPSdcIiArIG5vZGUuc3RhdGUudmFsdWUgKyBcIicgXCI7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YXJpYWJsZT0nXCIgKyBub2RlLnN0YXRlLnZhcmlhYmxlICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgbWFpbkdseXBoKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5pZCArIFwiJyBjbGFzcz0ndW5pdCBvZiBpbmZvcm1hdGlvbic+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxsYWJlbCBcIjtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUubGFiZWwudGV4dCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInRleHQ9J1wiICsgbm9kZS5sYWJlbC50ZXh0ICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvblRvU2Jnbm1sO1xyXG4iLCIvKiBcbiAqIFRoZXNlIGFyZSB0aGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZGlyZWN0bHkgdXRpbGl6ZWQgYnkgdGhlIHVzZXIgaW50ZXJhY3Rpb25zXG4gKi9cblxudmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9zYmduLWVsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgc2JnbkdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9zYmduLWdyYXBoLXV0aWxpdGllcycpO1xudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcblxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuXG4vLyBIZWxwZXJzIHN0YXJ0XG5mdW5jdGlvbiBiZWZvcmVQZXJmb3JtTGF5b3V0KCkge1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xuXG4gIG5vZGVzLnJlbW92ZURhdGEoXCJwb3J0c1wiKTtcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnRzb3VyY2VcIik7XG4gIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuXG4gIG5vZGVzLmRhdGEoXCJwb3J0c1wiLCBbXSk7XG4gIGVkZ2VzLmRhdGEoXCJwb3J0c291cmNlXCIsIFtdKTtcbiAgZWRnZXMuZGF0YShcInBvcnR0YXJnZXRcIiwgW10pO1xuXG4gIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXG4gIGN5LiQoJy5lZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xufTtcbi8vIEhlbHBlcnMgZW5kXG5cbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7fVxuXG5tYWluVXRpbGl0aWVzLmV4cGFuZE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgdmFyIG5vZGVzVG9FeHBhbmQgPSBub2Rlcy5maWx0ZXIoXCJbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKTtcbiAgaWYgKG5vZGVzVG9FeHBhbmQuZXhwYW5kYWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzVG9FeHBhbmQsXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZXMuZXhwYW5kKCk7XG4gIH1cbn07XG5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIGlmIChub2Rlcy5jb2xsYXBzaWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZXMuY29sbGFwc2UoKTtcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5jb2xsYXBzZUNvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbc2JnbmNsYXNzPSdjb21wbGV4J11cIik7XG4gIGlmIChjb21wbGV4ZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBjb21wbGV4ZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBjb21wbGV4ZXMuY29sbGFwc2VSZWN1cnNpdmVseSgpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcyhcIjpzZWxlY3RlZFwiKS5maWx0ZXIoXCJbc2JnbmNsYXNzPSdjb21wbGV4J11bZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKTtcbiAgaWYgKG5vZGVzLmV4cGFuZGFibGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBub2Rlcy5leHBhbmRSZWN1cnNpdmVseSgpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQWxsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xuICBpZiAobm9kZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIG5vZGVzLmNvbGxhcHNlUmVjdXJzaXZlbHkoKTtcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5leHBhbmRBbGwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoJzp2aXNpYmxlJykuZmlsdGVyKFwiW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XG4gIGlmIChub2Rlcy5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZXMuZXhwYW5kUmVjdXJzaXZlbHkoKTtcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5oaWRlRWxlcyA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgZWxlcyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5oaWRlRWxlcygpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLnNob3dFbGVzID0gZnVuY3Rpb24oZWxlcykge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93XCIsIGVsZXMpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuc2hvd0VsZXMoKTtcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5zaG93QWxsID0gZnVuY3Rpb24oKSB7XG4gIGlmIChjeS5lbGVtZW50cygpLmxlbmd0aCA9PT0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kuZWxlbWVudHMoKS5zaG93RWxlcygpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUgPSBmdW5jdGlvbihlbGVzKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHtcbiAgICAgIGVsZXM6IGVsZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzLnJlbW92ZSgpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLmRlbGV0ZUVsZXNTbWFydCA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHtcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgIGVsZXM6IGVsZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBzYmduRWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU21hcnQoZWxlcyk7XG4gIH1cbn07XG5cbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0TmVpZ2hib3VycyA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldE5laWdoYm91cnNPZkVsZXMoZWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXNUb0hpZ2hsaWdodC5oaWdobGlnaHQoKTtcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5zZWFyY2hCeUxhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcbiAgaWYgKGxhYmVsLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICBpZiAoZWxlLmRhdGEoXCJzYmdubGFiZWxcIikgJiYgZWxlLmRhdGEoXCJzYmdubGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxhYmVsKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBpZiAobm9kZXNUb0hpZ2hsaWdodC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG5vZGVzVG9IaWdobGlnaHQgPSBzYmduRWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICBub2Rlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xuICB9XG59O1xuXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IHNiZ25FbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KGVsZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzVG9IaWdobGlnaHQuaGlnaGxpZ2h0KCk7XG4gIH1cbn07XG5cbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoc2JnbkVsZW1lbnRVdGlsaXRpZXMubm9uZUlzTm90SGlnaGxpZ2h0ZWQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlSGlnaGxpZ2h0c1wiKTtcbiAgfVxuICBlbHNlIHtcbiAgICBjeS5yZW1vdmVIaWdobGlnaHRzKClcbiAgfVxufTtcblxubWFpblV0aWxpdGllcy5wZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0T3B0aW9ucywgbm90VW5kb2FibGUpIHtcbiAgLy8gVGhpbmdzIHRvIGRvIGJlZm9yZSBwZXJmb3JtaW5nIGxheW91dFxuICBiZWZvcmVQZXJmb3JtTGF5b3V0KCk7XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUgfHwgbm90VW5kb2FibGUpIHsgLy8gJ25vdFVuZG9hYmxlJyBmbGFnIGNhbiBiZSB1c2VkIHRvIGhhdmUgY29tcG9zaXRlIGFjdGlvbnMgaW4gdW5kby9yZWRvIHN0YWNrXG4gICAgY3kuZWxlbWVudHMoKS5maWx0ZXIoJzp2aXNpYmxlJykubGF5b3V0KGxheW91dE9wdGlvbnMpO1xuICB9XG4gIGVsc2Uge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJsYXlvdXRcIiwge1xuICAgICAgb3B0aW9uczogbGF5b3V0T3B0aW9ucyxcbiAgICAgIGVsZXM6IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpXG4gICAgfSk7XG4gIH1cbn07XG5cbm1haW5VdGlsaXRpZXMuY3JlYXRlU2Jnbm1sID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XG59O1xuXG5tYWluVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUb0pzb24gPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiBzYmdubWxUb0pzb24uY29udmVydChkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvLyBkZWZhdWx0IG9wdGlvbnNcbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIGxvY2F0ZWQgXG4gIC8vIGluIG5vZGVfbW9kdWxlcyB1c2luZyBkZWZhdWx0IG9wdGlvbiBpcyBlbm91Z2hcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICBsaWJzOiB7fSxcbiAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXG4gIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ3JlZ3VsYXInO1xuICB9LFxuICAvLyBwZXJjZW50YWdlIHVzZWQgdG8gY2FsY3VsYXRlIGNvbXBvdW5kIHBhZGRpbmdzXG4gIGNvbXBvdW5kUGFkZGluZzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAxMDtcbiAgfSxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlXG59O1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xufTtcblxuLy92YXIgc2VsZiA9IG9wdGlvblV0aWxpdGllcztcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xuICB9XG4gIFxuICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICB9XG5cbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7IiwidmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0ge1xyXG4gICAgLy90aGUgbGlzdCBvZiB0aGUgZWxlbWVudCBjbGFzc2VzIGhhbmRsZWQgYnkgdGhlIHRvb2xcclxuICAgIGhhbmRsZWRFbGVtZW50czoge1xyXG4gICAgICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZSxcclxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAgICAgJ3Byb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAgICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncGhlbm90eXBlJzogdHJ1ZSxcclxuICAgICAgICAndGFnJzogdHJ1ZSxcclxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxyXG4gICAgICAgICdwcm9kdWN0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnbW9kdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnY2F0YWx5c2lzJzogdHJ1ZSxcclxuICAgICAgICAnaW5oaWJpdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2xvZ2ljIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2VxdWl2YWxlbmNlIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ29yIG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnbm90IG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnYW5kJzogdHJ1ZSxcclxuICAgICAgICAnb3InOiB0cnVlLFxyXG4gICAgICAgICdub3QnOiB0cnVlLFxyXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGFydG1lbnQnOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcclxuICAgIHByb2Nlc3NUeXBlcyA6IFsncHJvY2VzcycsICdvbWl0dGVkIHByb2Nlc3MnLCAndW5jZXJ0YWluIHByb2Nlc3MnLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncGhlbm90eXBlJ10sXHJcbiAgICAgIFxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vdGhpcyBtZXRob2QgcmV0dXJucyB0aGUgbm9kZXMgbm9uIG9mIHdob3NlIGFuY2VzdG9ycyBpcyBub3QgaW4gZ2l2ZW4gbm9kZXNcclxuICAgIGdldFRvcE1vc3ROb2RlczogZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub2Rlc01hcFtub2Rlc1tpXS5pZCgpXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb290cyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcclxuICAgICAgICAgICAgICBpZihub2Rlc01hcFtwYXJlbnQuaWQoKV0pe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb290cztcclxuICAgIH0sXHJcbiAgICAvL1RoaXMgbWV0aG9kIGNoZWNrcyBpZiBhbGwgb2YgdGhlIGdpdmVuIG5vZGVzIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFzc3VtaW5nIHRoYXQgdGhlIHNpemUgXHJcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxyXG4gICAgYWxsSGF2ZVRoZVNhbWVQYXJlbnQ6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVzWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhKFwicGFyZW50XCIpICE9IHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIG1vdmVOb2RlczogZnVuY3Rpb24ocG9zaXRpb25EaWZmLCBub2Rlcywgbm90Q2FsY1RvcE1vc3ROb2Rlcykge1xyXG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcE1vc3ROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gdG9wTW9zdE5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XHJcbiAgICAgICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKFwieVwiKTtcclxuICAgICAgICBub2RlLnBvc2l0aW9uKHtcclxuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcclxuICAgICAgICAgIHk6IG9sZFkgKyBwb3NpdGlvbkRpZmYueVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLm1vdmVOb2Rlcyhwb3NpdGlvbkRpZmYsIGNoaWxkcmVuLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnZlcnRUb01vZGVsUG9zaXRpb246IGZ1bmN0aW9uIChyZW5kZXJlZFBvc2l0aW9uKSB7XHJcbiAgICAgIHZhciBwYW4gPSBjeS5wYW4oKTtcclxuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XHJcblxyXG4gICAgICB2YXIgeCA9IChyZW5kZXJlZFBvc2l0aW9uLnggLSBwYW4ueCkgLyB6b29tO1xyXG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHlcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXHJcbiAgICBcclxuICAgIGdldFByb2Nlc3Nlc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qoc2VsZWN0ZWRFbGVzKTtcclxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRFbGVzO1xyXG4gICAgfSxcclxuICAgIGdldE5laWdoYm91cnNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxlY3RlZEVsZXMgPSBjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKTtcclxuICAgICAgICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gdGhpcy5nZXROZWlnaGJvdXJzT2ZFbGVzKHNlbGVjdGVkRWxlcyk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb0hpZ2hsaWdodDtcclxuICAgIH0sXHJcbiAgICBnZXROZWlnaGJvdXJzT2ZFbGVzOiBmdW5jdGlvbihfZWxlcyl7XHJcbiAgICAgICAgdmFyIGVsZXMgPSBfZWxlcztcclxuICAgICAgICBlbGVzID0gZWxlcy5hZGQoZWxlcy5wYXJlbnRzKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKSk7XHJcbiAgICAgICAgZWxlcyA9IGVsZXMuYWRkKGVsZXMuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgdmFyIG5laWdoYm9yaG9vZEVsZXMgPSBlbGVzLm5laWdoYm9yaG9vZCgpO1xyXG4gICAgICAgIHZhciBlbGVzVG9SZXR1cm4gPSBlbGVzLmFkZChuZWlnaGJvcmhvb2RFbGVzKTtcclxuICAgICAgICBlbGVzVG9SZXR1cm4gPSBlbGVzVG9SZXR1cm4uYWRkKGVsZXNUb1JldHVybi5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICByZXR1cm4gZWxlc1RvUmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGV4dGVuZE5vZGVMaXN0OiBmdW5jdGlvbihub2Rlc1RvU2hvdyl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICAvL2FkZCBwYXJlbnRzXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cucGFyZW50cygpKTtcclxuICAgICAgICAvL2FkZCBjb21wbGV4IGNoaWxkcmVuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW3NiZ25jbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW3NiZ25jbGFzcz0ncHJvY2VzcyddXCIpO1xyXG4gICAgICAgIC8vIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzIT0ncHJvY2VzcyddXCIpO1xyXG4gICAgICAgIC8vIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoXCJub2RlW3NiZ25jbGFzcz0ncHJvY2VzcyddXCIpO1xyXG5cclxuICAgICAgICB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA9PT0gLTE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIG5laWdoYm9yUHJvY2Vzc2VzID0gbm9uUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpLmZpbHRlcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICBleHRlbmRSZW1haW5pbmdOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzVG9GaWx0ZXIsIGFsbE5vZGVzKXtcclxuICAgICAgICBub2Rlc1RvRmlsdGVyID0gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICB2YXIgbm9kZXNUb1Nob3cgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0ZpbHRlcik7XHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9TaG93KTtcclxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XHJcbiAgICB9LFxyXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLm5vZGVzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RIaWdobGlnaHRlZE5vZGVzLmxlbmd0aCArIG5vdEhpZ2hsaWdodGVkRWRnZXMubGVuZ3RoID09PSAwO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgXHJcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgICBlbGVzLnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZWxlcztcclxuICAgIH0sXHJcbiAgICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUVsZXNTbWFydDogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKGVsZXMsIGFsbE5vZGVzKTtcclxuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcclxuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXHJcbiAgICBcclxuICAgIGdldEN5U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBzaGFwZSA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuICAgICAgICBpZiAoc2hhcGUuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIHNoYXBlID0gc2hhcGUucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNoYXBlID09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdyb3VuZHJlY3RhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAncGhlbm90eXBlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2hleGFnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IHNoYXBlID09ICd0YWcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncG9seWdvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAnc291cmNlIGFuZCBzaW5rJyB8fCBzaGFwZSA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IHNoYXBlID09ICdkaXNzb2NpYXRpb24nXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICdtYWNyb21vbGVjdWxlJyB8fCBzaGFwZSA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBzaGFwZSA9PSAnY29tcGxleCdcclxuICAgICAgICAgICAgfHwgc2hhcGUgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgc2hhcGUgPT0gJ3Byb2Nlc3MnIHx8IHNoYXBlID09ICdvbWl0dGVkIHByb2Nlc3MnXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICd1bmNlcnRhaW4gcHJvY2VzcycgfHwgc2hhcGUgPT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q3lBcnJvd1NoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWxlLmRhdGEoJ3NiZ25jbGFzcycpO1xyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdpbmhpYml0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RlZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdjaXJjbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaWFtb25kJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICdub25lJztcclxuICAgIH0sXHJcbiAgICBnZXRFbGVtZW50Q29udGVudDogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuXHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcclxuICAgICAgICAgICAgc2JnbmNsYXNzID0gc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnXHJcbiAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5JyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IHNiZ25jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpID8gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzYmduY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jyl7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnc2JnbmxhYmVsJykgPyBlbGUuZGF0YSgnc2JnbmxhYmVsJykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNiZ25jbGFzcyA9PSAnY29tcGxleCcpe1xyXG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGUuZGF0YSgnc2JnbmxhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnc2JnbmxhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGVsZS5kYXRhKCdpbmZvTGFiZWwnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdhbmQnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnQU5EJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdvcicpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdPUic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnbm90Jykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ05PVCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ1xcXFxcXFxcJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICc/JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gZWxlLmNzcygnd2lkdGgnKSA/IHBhcnNlRmxvYXQoZWxlLmNzcygnd2lkdGgnKSkgOiBlbGUuZGF0YSgnc2JnbmJib3gnKS53O1xyXG5cclxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBjb250ZW50LFxyXG4gICAgICAgICAgICB3aWR0aDogKCBzYmduY2xhc3M9PSgnY29tcGxleCcpIHx8IHNiZ25jbGFzcz09KCdjb21wYXJ0bWVudCcpICk/dGV4dFdpZHRoICogMjp0ZXh0V2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZm9udCA9IHRoaXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcclxuICAgIH0sXHJcbiAgICBnZXRMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcblxyXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzYmduY2xhc3MgPT09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PT0gJ29yJyB8fCBzYmduY2xhc3MgPT09ICdub3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxLjUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgfSxcclxuICAgIGdldER5bmFtaWNMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlLCBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQpIHtcclxuICAgICAgdmFyIGR5bmFtaWNMYWJlbFNpemUgPSBvcHRpb25zLmR5bmFtaWNMYWJlbFNpemU7XHJcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcclxuXHJcbiAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDAuNzU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDEuMjU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgaCA9IGVsZS5oZWlnaHQoKTtcclxuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dEhlaWdodDtcclxuICAgIH0sXHJcbiAgICBnZXRDYXJkaW5hbGl0eURpc3RhbmNlOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBzcmNQb3MgPSBlbGUuc291cmNlKCkucG9zaXRpb24oKTtcclxuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KChzcmNQb3MueCAtIHRndFBvcy54KSwgMikgKyBNYXRoLnBvdygoc3JjUG9zLnkgLSB0Z3RQb3MueSksIDIpKTtcclxuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcclxuICAgIH0sXHJcbiAgICBnZXRJbmZvTGFiZWw6IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXHJcbiAgICAgICogdGhlIG5vZGUgaXMgY29sbGFwc2VkIHJldHVybiB0aGUgYWxyZWFkeSBleGlzdGluZyBpbmZvIGxhYmVsIG9mIGl0XHJcbiAgICAgICovXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAgKiBJZiB0aGUgbm9kZSBpcyBzaW1wbGUgdGhlbiBpdCdzIGluZm9sYWJlbCBpcyBlcXVhbCB0byBpdCdzIHNiZ25sYWJlbFxyXG4gICAgICAgKi9cclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgIHZhciBpbmZvTGFiZWwgPSBcIlwiO1xyXG4gICAgICAvKlxyXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAqL1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgdmFyIGNoaWxkSW5mbyA9IHRoaXMuZ2V0SW5mb0xhYmVsKGNoaWxkKTtcclxuICAgICAgICBpZiAoY2hpbGRJbmZvID09IG51bGwgfHwgY2hpbGRJbmZvID09IFwiXCIpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICBpbmZvTGFiZWwgKz0gXCI6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcclxuICAgICAgcmV0dXJuIGluZm9MYWJlbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmduRWxlbWVudFV0aWxpdGllcztcclxuIiwidmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuLypcbiAqIEdyYXBoIHV0aWxpdGllcyBmb3Igc2JnblxuICovXG5mdW5jdGlvbiBzYmduR3JhcGhVdGlsaXRpZXMoKSB7fVxuXG5zYmduR3JhcGhVdGlsaXRpZXMuc2JnbnZpelVwZGF0ZSA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcbiAgY29uc29sZS5sb2coJ2N5IHVwZGF0ZSBjYWxsZWQnKTtcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpVcGRhdGVTdGFydFwiICk7XG4gIC8vIFJlc2V0IHVuZG8vcmVkbyBzdGFjayBhbmQgYnV0dG9ucyB3aGVuIGEgbmV3IGdyYXBoIGlzIGxvYWRlZFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkucmVzZXQoKTtcbi8vICAgIHRoaXMucmVzZXRVbmRvUmVkb0J1dHRvbnMoKTtcbiAgfVxuXG4gIGN5LnN0YXJ0QmF0Y2goKTtcbiAgLy8gY2xlYXIgZGF0YVxuICBjeS5yZW1vdmUoJyonKTtcbiAgY3kuYWRkKGN5R3JhcGgpO1xuXG4gIC8vYWRkIHBvc2l0aW9uIGluZm9ybWF0aW9uIHRvIGRhdGEgZm9yIHByZXNldCBsYXlvdXRcbiAgdmFyIHBvc2l0aW9uTWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB4UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLnNiZ25iYm94Lng7XG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuc2JnbmJib3gueTtcbiAgICBwb3NpdGlvbk1hcFtjeUdyYXBoLm5vZGVzW2ldLmRhdGEuaWRdID0geyd4JzogeFBvcywgJ3knOiB5UG9zfTtcbiAgfVxuXG4gIGN5LmxheW91dCh7XG4gICAgbmFtZTogJ3ByZXNldCcsXG4gICAgcG9zaXRpb25zOiBwb3NpdGlvbk1hcFxuICB9KTtcblxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpO1xuICBjeS5lbmRCYXRjaCgpO1xuXG4gIC8vIFVwZGF0ZSB0aGUgc3R5bGVcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgLy8gSW5pdGlsaXplIHRoZSBiZW5kIHBvaW50cyBvbmNlIHRoZSBlbGVtZW50cyBhcmUgY3JlYXRlZFxuICBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmluaXRCZW5kUG9pbnRzKGN5LmVkZ2VzKCkpO1xuICBcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpVcGRhdGVFbmRcIiApO1xufTtcblxuc2JnbkdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZVBhZGRpbmdzID0gZnVuY3Rpb24ocGFkZGluZ1BlcmNlbnQpIHtcbiAgLy9BcyBkZWZhdWx0IHVzZSB0aGUgY29tcG91bmQgcGFkZGluZyB2YWx1ZVxuICBpZiAoIXBhZGRpbmdQZXJjZW50KSB7XG4gICAgdmFyIGNvbXBvdW5kUGFkZGluZyA9IG9wdGlvbnMuY29tcG91bmRQYWRkaW5nO1xuICAgIHBhZGRpbmdQZXJjZW50ID0gdHlwZW9mIGNvbXBvdW5kUGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbXBvdW5kUGFkZGluZy5jYWxsKCkgOiBjb21wb3VuZFBhZGRpbmc7XG4gIH1cblxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgdG90YWwgPSAwO1xuICB2YXIgbnVtT2ZTaW1wbGVzID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0aGVOb2RlID0gbm9kZXNbaV07XG4gICAgaWYgKHRoZU5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IHRoZU5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUud2lkdGgoKSk7XG4gICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS5oZWlnaHQoKSk7XG4gICAgICBudW1PZlNpbXBsZXMrKztcbiAgICB9XG4gIH1cblxuICB2YXIgY2FsY19wYWRkaW5nID0gKHBhZGRpbmdQZXJjZW50IC8gMTAwKSAqIE1hdGguZmxvb3IodG90YWwgLyAoMiAqIG51bU9mU2ltcGxlcykpO1xuICBpZiAoY2FsY19wYWRkaW5nIDwgNSkge1xuICAgIGNhbGNfcGFkZGluZyA9IDU7XG4gIH1cblxuICByZXR1cm4gY2FsY19wYWRkaW5nO1xufTtcblxuc2JnbkdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsY19wYWRkaW5nID0gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgY29tcG91bmRzID0gbm9kZXMuZmlsdGVyKCckbm9kZSA+IG5vZGUnKTtcbiAgY3kuc3RhcnRCYXRjaCgpO1xuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWxlZnQnLCBjYWxjX3BhZGRpbmcpO1xuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLXJpZ2h0JywgY2FsY19wYWRkaW5nKTtcbiAgY29tcG91bmRzLmNzcygncGFkZGluZy10b3AnLCBjYWxjX3BhZGRpbmcpO1xuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNhbGNfcGFkZGluZyk7XG4gIGN5LmVuZEJhdGNoKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNiZ25HcmFwaFV0aWxpdGllczsiLCJ2YXIgc2JnbkVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3NiZ24tZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBzYmdubWxUb0pzb24gPSB7XHJcbiAgaW5zZXJ0ZWROb2Rlczoge30sXHJcbiAgZ2V0QWxsQ29tcGFydG1lbnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICB2YXIgY29tcGFydG1lbnRzID0gW107XHJcbiAgICAkKHhtbE9iamVjdCkuZmluZChcImdseXBoW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb21wYXJ0bWVudHMucHVzaCh7XHJcbiAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KCQodGhpcykuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd4JykpLFxyXG4gICAgICAgICd5JzogcGFyc2VGbG9hdCgkKHRoaXMpLmNoaWxkcmVuKCdiYm94JykuYXR0cigneScpKSxcclxuICAgICAgICAndyc6IHBhcnNlRmxvYXQoJCh0aGlzKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3cnKSksXHJcbiAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KCQodGhpcykuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCdoJykpLFxyXG4gICAgICAgICdpZCc6ICQodGhpcykuYXR0cignaWQnKVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbXBhcnRtZW50cy5zb3J0KGZ1bmN0aW9uIChjMSwgYzIpIHtcclxuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICBpZiAoYzEuaCAqIGMxLncgPiBjMi5oICogYzIudylcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY29tcGFydG1lbnRzO1xyXG4gIH0sXHJcbiAgaXNJbkJvdW5kaW5nQm94OiBmdW5jdGlvbiAoYmJveDEsIGJib3gyKSB7XHJcbiAgICBpZiAoYmJveDEueCA+IGJib3gyLnggJiZcclxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxyXG4gICAgICAgIGJib3gxLnggKyBiYm94MS53IDwgYmJveDIueCArIGJib3gyLncgJiZcclxuICAgICAgICBiYm94MS55ICsgYmJveDEuaCA8IGJib3gyLnkgKyBiYm94Mi5oKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIGJib3hQcm9wOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICB2YXIgc2JnbmJib3ggPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgc2JnbmJib3gueCA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigneCcpO1xyXG4gICAgc2JnbmJib3gueSA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigneScpO1xyXG4gICAgc2JnbmJib3gudyA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigndycpO1xyXG4gICAgc2JnbmJib3guaCA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cignaCcpO1xyXG5cclxuICAgIC8vc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcclxuICAgIHNiZ25iYm94LnggPSBwYXJzZUZsb2F0KHNiZ25iYm94LngpICsgcGFyc2VGbG9hdChzYmduYmJveC53KSAvIDI7XHJcbiAgICBzYmduYmJveC55ID0gcGFyc2VGbG9hdChzYmduYmJveC55KSArIHBhcnNlRmxvYXQoc2JnbmJib3guaCkgLyAyO1xyXG5cclxuICAgIHJldHVybiBzYmduYmJveDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XHJcbiAgICB2YXIgeFBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC54KTtcclxuICAgIHZhciB5UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LnkpO1xyXG5cclxuICAgIHZhciBzYmduYmJveCA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICBzYmduYmJveC54ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd4Jyk7XHJcbiAgICBzYmduYmJveC55ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd5Jyk7XHJcbiAgICBzYmduYmJveC53ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd3Jyk7XHJcbiAgICBzYmduYmJveC5oID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCdoJyk7XHJcblxyXG4gICAgLy9zZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgc2JnbmJib3gueCA9IHBhcnNlRmxvYXQoc2JnbmJib3gueCkgKyBwYXJzZUZsb2F0KHNiZ25iYm94LncpIC8gMiAtIHhQb3M7XHJcbiAgICBzYmduYmJveC55ID0gcGFyc2VGbG9hdChzYmduYmJveC55KSArIHBhcnNlRmxvYXQoc2JnbmJib3guaCkgLyAyIC0geVBvcztcclxuXHJcbiAgICBzYmduYmJveC54ID0gc2JnbmJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcclxuICAgIHNiZ25iYm94LnkgPSBzYmduYmJveC55IC8gcGFyc2VGbG9hdChwYXJlbnRCYm94LmgpICogMTAwO1xyXG5cclxuICAgIHJldHVybiBzYmduYmJveDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb1Byb3A6IGZ1bmN0aW9uIChlbGUsIHBhcmVudEJib3gpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICQoZWxlKS5jaGlsZHJlbignZ2x5cGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG9iaiA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgaWYgKCQodGhpcykuYXR0cignY2xhc3MnKSA9PT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XHJcbiAgICAgICAgb2JqLmlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIG9iai5jbGF6eiA9ICQodGhpcykuYXR0cignY2xhc3MnKTtcclxuICAgICAgICBvYmoubGFiZWwgPSB7J3RleHQnOiAkKHRoaXMpLmZpbmQoJ2xhYmVsJykuYXR0cigndGV4dCcpfTtcclxuICAgICAgICBvYmouYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AodGhpcywgcGFyZW50QmJveCk7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChvYmopO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKCQodGhpcykuYXR0cignY2xhc3MnKSA9PT0gJ3N0YXRlIHZhcmlhYmxlJykge1xyXG4gICAgICAgIG9iai5pZCA9ICQodGhpcykuYXR0cignaWQnKTtcclxuICAgICAgICBvYmouY2xhenogPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAgICAgb2JqLnN0YXRlID0geyd2YWx1ZSc6ICQodGhpcykuZmluZCgnc3RhdGUnKS5hdHRyKCd2YWx1ZScpLFxyXG4gICAgICAgICAgJ3ZhcmlhYmxlJzogJCh0aGlzKS5maW5kKCdzdGF0ZScpLmF0dHIoJ3ZhcmlhYmxlJyl9O1xyXG4gICAgICAgIG9iai5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcCh0aGlzLCBwYXJlbnRCYm94KTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKG9iaik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZUFuZEluZm9BcnJheTtcclxuICB9LFxyXG4gIGFkZFBhcmVudEluZm9Ub05vZGU6IGZ1bmN0aW9uIChlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAvL3RoZXJlIGlzIG5vIGNvbXBsZXggcGFyZW50XHJcbiAgICBpZiAocGFyZW50ID09IFwiXCIpIHtcclxuICAgICAgLy9ubyBjb21wYXJ0bWVudCByZWZlcmVuY2VcclxuICAgICAgaWYgKHR5cGVvZiAkKGVsZSkuYXR0cignY29tcGFydG1lbnRSZWYnKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBub2RlT2JqLnBhcmVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGNvbXBhcnRtZW50IGFjY29yZGluZyB0byBnZW9tZXRyeVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgYmJveCA9IHtcclxuICAgICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KCQoZWxlKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3gnKSksXHJcbiAgICAgICAgICAgICd5JzogcGFyc2VGbG9hdCgkKGVsZSkuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd5JykpLFxyXG4gICAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoJChlbGUpLmNoaWxkcmVuKCdiYm94JykuYXR0cigndycpKSxcclxuICAgICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KCQoZWxlKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ2gnKSksXHJcbiAgICAgICAgICAgICdpZCc6ICQoZWxlKS5hdHRyKCdpZCcpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoc2VsZi5pc0luQm91bmRpbmdCb3goYmJveCwgY29tcGFydG1lbnRzW2ldKSkge1xyXG4gICAgICAgICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50c1tpXS5pZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vdGhlcmUgaXMgY29tcGFydG1lbnQgcmVmZXJlbmNlXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5vZGVPYmoucGFyZW50ID0gJChlbGUpLmF0dHIoJ2NvbXBhcnRtZW50UmVmJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vdGhlcmUgaXMgY29tcGxleCBwYXJlbnRcclxuICAgIGVsc2Uge1xyXG4gICAgICBub2RlT2JqLnBhcmVudCA9IHBhcmVudDtcclxuICAgIH1cclxuICB9LFxyXG4gIGFkZEN5dG9zY2FwZUpzTm9kZTogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIG5vZGVPYmogPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgLy9hZGQgaWQgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouaWQgPSAkKGVsZSkuYXR0cignaWQnKTtcclxuICAgIC8vYWRkIG5vZGUgYm91bmRpbmcgYm94IGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLnNiZ25iYm94ID0gc2VsZi5iYm94UHJvcChlbGUpO1xyXG4gICAgLy9hZGQgY2xhc3MgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbmNsYXNzID0gJChlbGUpLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAvL2FkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zYmdubGFiZWwgPSAkKGVsZSkuY2hpbGRyZW4oJ2xhYmVsJykuYXR0cigndGV4dCcpO1xyXG4gICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLnNiZ25zdGF0ZXNhbmRpbmZvcyA9IHNlbGYuc3RhdGVBbmRJbmZvUHJvcChlbGUsIG5vZGVPYmouc2JnbmJib3gpO1xyXG4gICAgLy9hZGRpbmcgcGFyZW50IGluZm9ybWF0aW9uXHJcbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgIGlmICgkKGVsZSkuY2hpbGRyZW4oJ2Nsb25lJykubGVuZ3RoID4gMClcclxuICAgICAgbm9kZU9iai5zYmduY2xvbmVtYXJrZXIgPSB0cnVlO1xyXG4gICAgZWxzZVxyXG4gICAgICBub2RlT2JqLnNiZ25jbG9uZW1hcmtlciA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXHJcbiAgICB2YXIgcG9ydHMgPSBbXTtcclxuICAgICQoZWxlKS5maW5kKCdwb3J0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcclxuICAgICAgdmFyIHJlbGF0aXZlWFBvcyA9IHBhcnNlRmxvYXQoJCh0aGlzKS5hdHRyKCd4JykpIC0gbm9kZU9iai5zYmduYmJveC54O1xyXG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gcGFyc2VGbG9hdCgkKHRoaXMpLmF0dHIoJ3knKSkgLSBub2RlT2JqLnNiZ25iYm94Lnk7XHJcbiAgICAgIFxyXG4gICAgICByZWxhdGl2ZVhQb3MgPSByZWxhdGl2ZVhQb3MgLyBwYXJzZUZsb2F0KG5vZGVPYmouc2JnbmJib3gudykgKiAxMDA7XHJcbiAgICAgIHJlbGF0aXZlWVBvcyA9IHJlbGF0aXZlWVBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5zYmduYmJveC5oKSAqIDEwMDtcclxuICAgICAgXHJcbiAgICAgIHBvcnRzLnB1c2goe1xyXG4gICAgICAgIGlkOiAkKHRoaXMpLmF0dHIoJ2lkJyksXHJcbiAgICAgICAgeDogcmVsYXRpdmVYUG9zLFxyXG4gICAgICAgIHk6IHJlbGF0aXZlWVBvc1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIG5vZGVPYmoucG9ydHMgPSBwb3J0cztcclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xyXG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNOb2RlKTtcclxuICB9LFxyXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIGlmICghc2JnbkVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzWyQoZWxlKS5hdHRyKCdjbGFzcycpXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXNbJChlbGUpLmF0dHIoJ2lkJyldID0gdHJ1ZTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIC8vYWRkIGNvbXBsZXggbm9kZXMgaGVyZVxyXG4gICAgaWYgKCQoZWxlKS5hdHRyKCdjbGFzcycpID09PSAnY29tcGxleCcgfHwgJChlbGUpLmF0dHIoJ2NsYXNzJykgPT09ICdzdWJtYXAnKSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgICAkKGVsZSkuY2hpbGRyZW4oJ2dseXBoJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignY2xhc3MnKSAhPSAnc3RhdGUgdmFyaWFibGUnICYmXHJcbiAgICAgICAgICAgICQodGhpcykuYXR0cignY2xhc3MnKSAhPSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2Rlcyh0aGlzLCBqc29uQXJyYXksICQoZWxlKS5hdHRyKCdpZCcpLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldEFyY1NvdXJjZUFuZFRhcmdldDogZnVuY3Rpb24gKGFyYywgeG1sT2JqZWN0KSB7XHJcbiAgICAvL3NvdXJjZSBhbmQgdGFyZ2V0IGNhbiBiZSBpbnNpZGUgb2YgYSBwb3J0XHJcbiAgICB2YXIgc291cmNlID0gJChhcmMpLmF0dHIoJ3NvdXJjZScpO1xyXG4gICAgdmFyIHRhcmdldCA9ICQoYXJjKS5hdHRyKCd0YXJnZXQnKTtcclxuICAgIHZhciBzb3VyY2VOb2RlSWQsIHRhcmdldE5vZGVJZDtcclxuXHJcbiAgICAkKHhtbE9iamVjdCkuZmluZCgnZ2x5cGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQodGhpcykuYXR0cignaWQnKSA9PSBzb3VyY2UpIHtcclxuICAgICAgICBzb3VyY2VOb2RlSWQgPSBzb3VyY2U7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCQodGhpcykuYXR0cignaWQnKSA9PSB0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXROb2RlSWQgPSB0YXJnZXQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2Ygc291cmNlTm9kZUlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAkKHhtbE9iamVjdCkuZmluZChcInBvcnRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignaWQnKSA9PSBzb3VyY2UpIHtcclxuICAgICAgICAgIHNvdXJjZU5vZGVJZCA9ICQodGhpcykucGFyZW50KCkuYXR0cignaWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGFyZ2V0Tm9kZUlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAkKHhtbE9iamVjdCkuZmluZChcInBvcnRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignaWQnKSA9PSB0YXJnZXQpIHtcclxuICAgICAgICAgIHRhcmdldE5vZGVJZCA9ICQodGhpcykucGFyZW50KCkuYXR0cignaWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7J3NvdXJjZSc6IHNvdXJjZU5vZGVJZCwgJ3RhcmdldCc6IHRhcmdldE5vZGVJZH07XHJcbiAgfSxcclxuICBnZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnM6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBbXTtcclxuICAgIFxyXG4vLyAgICAkKGVsZSkuY2hpbGRyZW4oJ3N0YXJ0LCBuZXh0LCBlbmQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICQoZWxlKS5jaGlsZHJlbignbmV4dCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcG9zWCA9ICQodGhpcykuYXR0cigneCcpO1xyXG4gICAgICB2YXIgcG9zWSA9ICQodGhpcykuYXR0cigneScpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHBvcyA9IHtcclxuICAgICAgICB4OiBwb3NYLFxyXG4gICAgICAgIHk6IHBvc1lcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIGJlbmRQb2ludFBvc2l0aW9ucy5wdXNoKHBvcyk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGJlbmRQb2ludFBvc2l0aW9ucztcclxuICB9LFxyXG4gIGFkZEN5dG9zY2FwZUpzRWRnZTogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCB4bWxPYmplY3QpIHtcclxuICAgIGlmICghc2JnbkVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzWyQoZWxlKS5hdHRyKCdjbGFzcycpXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldCA9IHNlbGYuZ2V0QXJjU291cmNlQW5kVGFyZ2V0KGVsZSwgeG1sT2JqZWN0KTtcclxuICAgIFxyXG4gICAgaWYgKCF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnNvdXJjZV0gfHwgIXRoaXMuaW5zZXJ0ZWROb2Rlc1tzb3VyY2VBbmRUYXJnZXQudGFyZ2V0XSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBlZGdlT2JqID0gbmV3IE9iamVjdCgpO1xyXG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IHNlbGYuZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zKGVsZSk7XHJcblxyXG4gICAgZWRnZU9iai5pZCA9ICQoZWxlKS5hdHRyKCdpZCcpO1xyXG4gICAgZWRnZU9iai5zYmduY2xhc3MgPSAkKGVsZSkuYXR0cignY2xhc3MnKTtcclxuICAgIGVkZ2VPYmouYmVuZFBvaW50UG9zaXRpb25zID0gYmVuZFBvaW50UG9zaXRpb25zO1xyXG5cclxuICAgIGlmICgkKGVsZSkuZmluZCgnZ2x5cGgnKS5sZW5ndGggPD0gMCkge1xyXG4gICAgICBlZGdlT2JqLnNiZ25jYXJkaW5hbGl0eSA9IDA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgJChlbGUpLmNoaWxkcmVuKCdnbHlwaCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2NsYXNzJykgPT0gJ2NhcmRpbmFsaXR5Jykge1xyXG4gICAgICAgICAgZWRnZU9iai5zYmduY2FyZGluYWxpdHkgPSAkKHRoaXMpLmZpbmQoJ2xhYmVsJykuYXR0cigndGV4dCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRnZU9iai5zb3VyY2UgPSBzb3VyY2VBbmRUYXJnZXQuc291cmNlO1xyXG4gICAgZWRnZU9iai50YXJnZXQgPSBzb3VyY2VBbmRUYXJnZXQudGFyZ2V0O1xyXG5cclxuICAgIGVkZ2VPYmoucG9ydHNvdXJjZSA9ICQoZWxlKS5hdHRyKFwic291cmNlXCIpO1xyXG4gICAgZWRnZU9iai5wb3J0dGFyZ2V0ID0gJChlbGUpLmF0dHIoXCJ0YXJnZXRcIik7XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcclxuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzRWRnZSk7XHJcbiAgfSxcclxuICBjb252ZXJ0OiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlcyA9IFtdO1xyXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZXMgPSBbXTtcclxuXHJcbiAgICB2YXIgY29tcGFydG1lbnRzID0gc2VsZi5nZXRBbGxDb21wYXJ0bWVudHMoeG1sT2JqZWN0KTtcclxuXHJcbiAgICAkKHhtbE9iamVjdCkuZmluZChcIm1hcFwiKS5jaGlsZHJlbignZ2x5cGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKHRoaXMsIGN5dG9zY2FwZUpzTm9kZXMsIFwiXCIsIGNvbXBhcnRtZW50cyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHhtbE9iamVjdCkuZmluZChcIm1hcFwiKS5jaGlsZHJlbignYXJjJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNFZGdlKHRoaXMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNHcmFwaCA9IG5ldyBPYmplY3QoKTtcclxuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5lZGdlcyA9IGN5dG9zY2FwZUpzRWRnZXM7XHJcblxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XHJcblxyXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247IiwidmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcblxyXG52YXIgdGV4dFV0aWxpdGllcyA9IHtcclxuICAvL1RPRE86IHVzZSBDU1MncyBcInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXNcIiBzdHlsZSBpbnN0ZWFkIG9mIGZ1bmN0aW9uIGJlbG93P1xyXG4gIHRydW5jYXRlVGV4dDogZnVuY3Rpb24gKHRleHRQcm9wLCBmb250KSB7XHJcbiAgICB2YXIgY29udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIGNvbnRleHQuZm9udCA9IGZvbnQ7XHJcbiAgICBcclxuICAgIHZhciBmaXRMYWJlbHNUb05vZGVzID0gb3B0aW9ucy5maXRMYWJlbHNUb05vZGVzO1xyXG4gICAgZml0TGFiZWxzVG9Ob2RlcyA9IHR5cGVvZiBmaXRMYWJlbHNUb05vZGVzID09PSAnZnVuY3Rpb24nID8gZml0TGFiZWxzVG9Ob2Rlcy5jYWxsKCkgOiBmaXRMYWJlbHNUb05vZGVzO1xyXG4gICAgXHJcbiAgICB2YXIgdGV4dCA9IHRleHRQcm9wLmxhYmVsIHx8IFwiXCI7XHJcbiAgICAvL0lmIGZpdCBsYWJlbHMgdG8gbm9kZXMgaXMgZmFsc2UgZG8gbm90IHRydW5jYXRlXHJcbiAgICBpZiAoZml0TGFiZWxzVG9Ob2RlcyA9PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuICAgIHZhciB3aWR0aDtcclxuICAgIHZhciBsZW4gPSB0ZXh0Lmxlbmd0aDtcclxuICAgIHZhciBlbGxpcHNpcyA9IFwiLi5cIjtcclxuICAgIHZhciB0ZXh0V2lkdGggPSAodGV4dFByb3Aud2lkdGggPiAzMCkgPyB0ZXh0UHJvcC53aWR0aCAtIDEwIDogdGV4dFByb3Aud2lkdGg7XHJcbiAgICB3aGlsZSAoKHdpZHRoID0gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCkgPiB0ZXh0V2lkdGgpIHtcclxuICAgICAgLS1sZW47XHJcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBsZW4pICsgZWxsaXBzaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRleHRVdGlsaXRpZXM7IiwidmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcblxyXG52YXIgdWlVdGlsaXRpZXMgPSB7XHJcbiAgb3BlbkRpYWxvZzogZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XHJcbiAgICAkKGVsKS5kaWFsb2coXHJcbiAgICAgICAgJC5leHRlbmQoIHt9LCB7XHJcbiAgICAgICAgICBtb2RhbDogdHJ1ZSxcclxuICAgICAgICAgIG9wZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRhcHN0YXJ0RmNuLCBjeHR0YXBGY24sIHpvb21GY24sIHBhbkZjbjtcclxuICAgICAgICAgICAgJCgnLnVpLXdpZGdldC1vdmVybGF5JykuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgJChlbCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGN5LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBjeS5vbigndGFwc3RhcnQnLCB0YXBzdGFydEZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRhdGEoJ3RhcHN0YXJ0RmNuJywgdGFwc3RhcnRGY24pO1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBjeS5vbignY3h0dGFwJywgY3h0dGFwRmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGF0YSgnY3h0dGFwRmNuJywgY3h0dGFwRmNuKTtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBjeS5vbignem9vbScsIHpvb21GY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kYXRhKCd6b29tRmNuJywgem9vbUZjbik7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgY3kub24oJ3BhbicsIHBhbkZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRhdGEoJ3BhbkZjbicsIHBhbkZjbik7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN5LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBpZigkKGVsKS5kYXRhKCd0YXBzdGFydEZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ3RhcHN0YXJ0JywgJChlbCkuZGF0YSgndGFwc3RhcnRGY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKCQoZWwpLmRhdGEoJ2N4dHRhcEZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ2N4dHRhcCcsICQoZWwpLmRhdGEoJ2N4dHRhcEZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgaWYoJChlbCkuZGF0YSgnem9vbUZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ3pvb20nLCAkKGVsKS5kYXRhKCd6b29tRmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBpZigkKGVsKS5kYXRhKCdwYW5GY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCdwYW4nLCAkKGVsKS5kYXRhKCdwYW5GY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25zIClcclxuICAgICk7XHJcbiAgfSxcclxuICBvcGVuRmFuY3lib3g6IGZ1bmN0aW9uKCR0ZW1wbGF0ZSwgb3B0aW9ucykge1xyXG4gICAgJC5mYW5jeWJveChcclxuICAgICAgICBfLnRlbXBsYXRlKCR0ZW1wbGF0ZS5odG1sKCksIHt9KSxcclxuICAgICAgICAkLmV4dGVuZCgge30sIHtcclxuICAgICAgICAgICdhdXRvRGltZW5zaW9ucyc6IHRydWUsXHJcbiAgICAgICAgICAndHJhbnNpdGlvbkluJzogJ25vbmUnLFxyXG4gICAgICAgICAgJ3RyYW5zaXRpb25PdXQnOiAnbm9uZScsXHJcbiAgICAgICAgICAnb25TdGFydCc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgem9vbUZjbiwgcGFuRmNuO1xyXG4gICAgICAgICAgICBjeS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY3kub24oJ3pvb20nLCB6b29tRmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlLmRhdGEoJ3pvb21GY24nLCB6b29tRmNuKTtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgY3kub24oJ3BhbicsIHBhbkZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0ZW1wbGF0ZS5kYXRhKCdwYW5GY24nLCBwYW5GY24pO1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnb25DbG9zZWQnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3kucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGlmICgkdGVtcGxhdGUuZGF0YSgnem9vbUZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ3pvb20nLCAkdGVtcGxhdGUuZGF0YSgnem9vbUZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICgkdGVtcGxhdGUuZGF0YSgncGFuRmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZigncGFuJywgJHRlbXBsYXRlLmRhdGEoJ3BhbkZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdGlvbnMpICk7XHJcbiAgfSxcclxuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcclxuICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3Rvcikud2lkdGgoKTtcclxuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLmhlaWdodCgpO1xyXG4gICAgICAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yICsgJzpwYXJlbnQnKS5wcmVwZW5kKCc8aSBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgei1pbmRleDogOTk5OTk5OTsgbGVmdDogJyArIGNvbnRhaW5lcldpZHRoIC8gMiArICdweDsgdG9wOiAnICsgY29udGFpbmVySGVpZ2h0IC8gMiArICdweDtcIiBjbGFzcz1cImZhIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS0zeCBmYS1mdyAnICsgY2xhc3NOYW1lICsgJ1wiPjwvaT4nKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGVuZFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcclxuICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQoJy4nICsgY2xhc3NOYW1lKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVpVXRpbGl0aWVzO1xyXG5cclxuXHJcbiIsIi8qXHJcbiAqIFRoaXMgZmlsZSBleHBvcnRzIHRoZSBmdW5jdGlvbnMgdG8gYmUgdXRpbGl6ZWQgaW4gdW5kb3JlZG8gZXh0ZW5zaW9uIGFjdGlvbnMgXHJcbiAqL1xyXG52YXIgc2JnbkVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3NiZ24tZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHtcclxuICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgLy8gQWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcbiAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgdmFyIHBhcmFtID0ge307XHJcbiAgICBwYXJhbS5lbGVzID0gc2JnbkVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7XHJcbiAgICByZXR1cm4gcGFyYW07XHJcbiAgfSxcclxuICBkZWxldGVFbGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NtYXJ0KHBhcmFtLmVsZXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XHJcbiAgfSxcclxuICAvLyBTZWN0aW9uIEVuZFxyXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uczsiXX0=

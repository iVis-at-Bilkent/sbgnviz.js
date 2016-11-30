(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
  var sbgnviz = window.sbgnviz = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = _dereq_('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options);
    
    var sbgnRenderer = _dereq_('./sbgn-extensions/sbgn-cy-renderer');
    var sbgnCyInstance = _dereq_('./sbgn-extensions/sbgn-cy-instance');
    
    // Utilities whose functions will be exposed seperately
    var uiUtilities = _dereq_('./utilities/ui-utilities');
    var fileUtilities = _dereq_('./utilities/file-utilities');
    var graphUtilities = _dereq_('./utilities/graph-utilities');
    var mainUtilities = _dereq_('./utilities/main-utilities');
    _dereq_('./utilities/keyboard-input-utilities'); // require keybord input utilities
    // Utilities to be exposed as is
    var elementUtilities = _dereq_('./utilities/element-utilities');
    var undoRedoActionFunctions = _dereq_('./utilities/undo-redo-action-functions');
    
    sbgnRenderer();
    sbgnCyInstance();
    
    // Expose the api
    // Expose elementUtilities and undoRedoActionFunctions as is, most users will not need these
    sbgnviz.elementUtilities = elementUtilities;
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
    for (var prop in graphUtilities) {
      sbgnviz[prop] = graphUtilities[prop];
    }
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();
},{"./sbgn-extensions/sbgn-cy-instance":2,"./sbgn-extensions/sbgn-cy-renderer":3,"./utilities/element-utilities":4,"./utilities/file-utilities":5,"./utilities/graph-utilities":6,"./utilities/keyboard-input-utilities":8,"./utilities/lib-utilities":9,"./utilities/main-utilities":10,"./utilities/option-utilities":11,"./utilities/ui-utilities":14,"./utilities/undo-redo-action-functions":15}],2:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('../utilities/element-utilities');
var graphUtilities = _dereq_('../utilities/graph-utilities');
var undoRedoActionFunctions = _dereq_('../utilities/undo-redo-action-functions');
var refreshPaddings = graphUtilities.refreshPaddings.bind(graphUtilities);

var libs = _dereq_('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

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
        var infoLabel = elementUtilities.getInfoLabel(node);
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
              return elementUtilities.getElementContent(ele);
            },
            'font-size': function (ele) {
              return elementUtilities.getLabelTextSize(ele);
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
              return elementUtilities.getCyShape(ele);
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
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[sbgnclass='production'][sbgncardinality > 0]")
          .css({
            'target-label': function (ele) {
              return '' + ele.data('sbgncardinality');
            },
            'target-text-margin-y': '-10',
            'target-text-offset': function (ele) {
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[sbgnclass]")
          .css({
            'target-arrow-shape': function (ele) {
              return elementUtilities.getCyArrowShape(ele);
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
},{"../utilities/element-utilities":4,"../utilities/graph-utilities":6,"../utilities/lib-utilities":9,"../utilities/option-utilities":11,"../utilities/undo-redo-action-functions":15}],3:[function(_dereq_,module,exports){
/*
 * Render sbgn specific shapes which are not supported by cytoscape.js core
 */

var truncateText = _dereq_('../utilities/text-utilities').truncateText;
var libs = _dereq_('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

var cyMath = cytoscape.math;
var cyBaseNodeShapes = cytoscape.baseNodeShapes;
var cyStyleProperties = cytoscape.styleProperties;
var cyDrawingShapes = cytoscape.drawingShapes;
var cyBaseArrowShapes = cytoscape.baseArrowShapes;

module.exports = function () {
  var $$ = cytoscape;
  
  var sbgnShapes = $$.sbgn.sbgnShapes = {
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

  var totallyOverridenNodeShapes = $$.sbgn.totallyOverridenNodeShapes = {
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
      var closestPoint = cyMath.polygonIntersectLine(portX, portY,
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
            cyDrawingShapes.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            cyDrawingShapes.drawRoundRectanglePath(context,
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
            cyDrawingShapes.drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            cyDrawingShapes.drawRoundRectanglePath(context,
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

  cyMath.calculateDistance = function (point1, point2) {
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
        cyDrawingShapes.drawRoundRectanglePath(context, stateCenterX, stateCenterY,
                stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));

        context.fill();
        textProp.state = state.state;
        $$.sbgn.drawStateText(context, textProp);

        context.stroke();

      } else if (state.clazz == "unit of information") {//draw rectangle
        cyDrawingShapes.drawRoundRectanglePath(context,
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
    if (cyMath.pointInsidePolygon(x, y, points,
            centerX, centerY - cornerRadius / 2, width, height - cornerRadius / 3, [0, -1],
            padding)) {
      return true;
    }

    //check rectangle at bottom
    if (cyMath.pointInsidePolygon(x, y, points,
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
    cyBaseNodeShapes['ellipse'].drawPath(context, x, y, width, height);
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
      var closestPoint = cyMath.intersectLineEllipse(
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

  cyStyleProperties.types.nodeShape.enums.push('source and sink');
  cyStyleProperties.types.nodeShape.enums.push('nucleic acid feature');
  cyStyleProperties.types.nodeShape.enums.push('complex');
  cyStyleProperties.types.nodeShape.enums.push('dissociation');
  cyStyleProperties.types.nodeShape.enums.push('macromolecule');
  cyStyleProperties.types.nodeShape.enums.push('simple chemical');
  cyStyleProperties.types.nodeShape.enums.push('unspecified entity');
  cyStyleProperties.types.nodeShape.enums.push('process');
  cyStyleProperties.types.nodeShape.enums.push('omitted process');
  cyStyleProperties.types.nodeShape.enums.push('uncertain process');
  cyStyleProperties.types.nodeShape.enums.push('association');

  cyStyleProperties.types.lineStyle.enums.push('consumption');
  cyStyleProperties.types.lineStyle.enums.push('production');

  cyStyleProperties.types.arrowShape.enums.push('necessary stimulation');

  $$.sbgn.registerSbgnArrowShapes = function () {
    cyBaseArrowShapes['necessary stimulation'] = jQuery.extend({}, cyBaseArrowShapes['triangle-tee']);
    cyBaseArrowShapes['necessary stimulation'].pointsTee = [
      -0.18, -0.43,
      0.18, -0.43
    ];
  };

  $$.sbgn.registerSbgnNodeShapes = function () {
    cyBaseNodeShapes['process'] = {
      points: cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      label: '',
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var padding = parseInt(node.css('border-width')) / 2;

        cyDrawingShapes.drawPolygonPath(context,
                centerX, centerY,
                width, height,
                cyBaseNodeShapes['process'].points);
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

        return cyMath.polygonIntersectLine(
                x, y,
                cyBaseNodeShapes['process'].points,
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

        return cyMath.pointInsidePolygon(x, y, cyBaseNodeShapes['process'].points,
                centerX, centerY, width, height, [0, -1], padding);
      }
    };

    cyBaseNodeShapes['omitted process'] = jQuery.extend(true, {}, cyBaseNodeShapes['process']);
    cyBaseNodeShapes['omitted process'].label = '\\\\';

    cyBaseNodeShapes['uncertain process'] = jQuery.extend(true, {}, cyBaseNodeShapes['process']);
    cyBaseNodeShapes['uncertain process'].label = '?';

    cyBaseNodeShapes["unspecified entity"] = {
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

        var nodeIntersectLines = cyBaseNodeShapes["ellipse"].intersectLine(centerX, centerY, width,
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

        var nodeCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        return nodeCheckPoint || stateAndInfoCheckPoint;
      }
    };

    cyBaseNodeShapes["simple chemical"] = {
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;
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
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyBaseNodeShapes["ellipse"].intersectLine(
                centerX, centerY, width, height, x, y, padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyBaseNodeShapes["ellipse"].intersectLine(
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
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;

        var nodeCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(x, y,
                  padding, width, height,
                  centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes["macromolecule"] = {
      points: cyMath.generateUnitNgonPoints(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var label = node._private.data.sbgnlabel;
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;
        var cloneMarker = node._private.data.sbgnclonemarker;
        var padding = parseInt(node.css('border-width'));

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          cyDrawingShapes.drawRoundRectanglePath(context,
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

        cyDrawingShapes.drawRoundRectanglePath(context,
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
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;

        var nodeCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                width, height, centerX, centerY);
        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                  width, height, centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes['association'] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width'));

        cyBaseNodeShapes['ellipse'].draw(context, centerX, centerY, width, height);
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

        var intersect = cyMath.intersectLineEllipse(
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

    cyBaseNodeShapes["dissociation"] = {
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

        return cyMath.intersectLineEllipse(
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

    cyBaseNodeShapes["complex"] = {
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
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cloneMarker = node._private.data.sbgnclonemarker;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          cyDrawingShapes.drawPolygonPath(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cyBaseNodeShapes["complex"].points);
          context.fill();

          context.stroke();

          $$.sbgn.cloneMarker.complex(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cornerLength, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        cyDrawingShapes.drawPolygonPath(context,
                centerX, centerY,
                width, height, cyBaseNodeShapes["complex"].points);
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
//      intersectLine: cyBaseNodeShapes["roundrectangle"].intersectLine,
//      checkPoint: cyBaseNodeShapes["roundrectangle"].checkPoint
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var hasChildren = node.children().length > 0;
        var width = hasChildren ? node.outerWidth() : node.width();
        var height = hasChildren ? node.outerHeight() : node.height();
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;

        var portIntersection = $$.sbgn.intersectLinePorts(node, x, y, portId);
        if (portIntersection.length > 0) {
          return portIntersection;
        }

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyMath.polygonIntersectLine(
                x, y,
                cyBaseNodeShapes["complex"].points,
                centerX,
                centerY,
                width / 2, height / 2,
                padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyMath.polygonIntersectLine(
                  x, y,
                  cyBaseNodeShapes["complex"].points,
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
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var nodeCheckPoint = cyMath.pointInsidePolygon(x, y, cyBaseNodeShapes["complex"].points,
                centerX, centerY, width, height, [0, -1], padding);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyMath.pointInsidePolygon(x, y,
                  cyBaseNodeShapes["complex"].points,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, [0, -1], padding);

        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes["nucleic acid feature"] = {
      points: cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        ;
        var width = node.width();
        var height = node.height();
        var label = node._private.data.sbgnlabel;
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
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
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
    cyBaseNodeShapes["source and sink"] = {
      points: cyMath.generateUnitNgonPoints(4, 0),
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var label = node._private.data.sbgnlabel;
        var pts = cyBaseNodeShapes["source and sink"].points;
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
      intersectLine: cyBaseNodeShapes["ellipse"].intersectLine,
      checkPoint: cyBaseNodeShapes["ellipse"].checkPoint
    };
  };

  $$.sbgn.drawEllipse = function (context, x, y, width, height) {
    //$$.sbgn.drawEllipsePath(context, x, y, width, height);
    //context.fill();
    cyBaseNodeShapes['ellipse'].draw(context, x, y, width, height);
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

        var recPoints = cyMath.generateUnitNgonPointsFitToSquare(4, 0);
        var cloneX = centerX;
        var cloneY = centerY + 3 / 4 * cornerRadius;
        var cloneWidth = width - 2 * cornerRadius;
        var cloneHeight = cornerRadius / 2;

        cyDrawingShapes.drawPolygonPath(context, cloneX, cloneY, cloneWidth, cloneHeight, recPoints);
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

        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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

        cyDrawingShapes.drawPolygonPath(context,
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
        return cyMath.intersectLineEllipse(
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
      var distance = cyMath.calculateDistance(point, checkPoint);

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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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
        var stateCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (stateCheckPoint == true)
          return true;

        stateCount++;
      } else if (state.clazz == "unit of information" && infoCount < 2) {//draw rectangle
        var infoCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (infoCheckPoint == true)
          return true;

        infoCount++;
      }

    }
    return false;
  };

  $$.sbgn.isNodeShapeTotallyOverriden = function (render, node) {
    if (totallyOverridenNodeShapes[render.getNodeShape(node)]) {
      return true;
    }

    return false;
  };
};

},{"../utilities/lib-utilities":9,"../utilities/text-utilities":13}],4:[function(_dereq_,module,exports){
/*
 * Common utilities for elements includes both general utilities and sbgn specific utilities 
 */

var truncateText = _dereq_('./text-utilities').truncateText;
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var elementUtilities = {
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
    
    // SBGN specific utilities
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
    // general utilities
    noneIsNotHighlighted: function(){
        var notHighlightedNodes = cy.nodes(":visible").nodes(".unhighlighted");
        var notHighlightedEdges = cy.edges(":visible").edges(".unhighlighted");

        return notHighlightedNodes.length + notHighlightedEdges.length === 0;
    },
    
    // Section End
    // Element Filtering Utilities

    // Section Start
    // Add remove utilities

    // SBGN specific utilities
    deleteElesSmart: function (eles) {
      var allNodes = cy.nodes();
      cy.elements().unselect();
      var nodesToKeep = this.extendRemainingNodes(eles, allNodes);
      var nodesNotToKeep = allNodes.not(nodesToKeep);
      return nodesNotToKeep.remove();
    },
    deleteElesSimple: function (eles) {
      cy.elements().unselect();
      return eles.remove();
    },
    // general utilities
    restoreEles: function (eles) {
        eles.restore();
        return eles;
    },
    
    // Section End
    // Add remove utilities

    // Section Start
    // Stylesheet helpers
    
    // SBGN specific utilities
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
    },
    getQtipContent: function(node) {
      /* Check the sbgnlabel of the node if it is not valid
      * then check the infolabel if it is also not valid do not show qtip
      */
      var label = node.data('sbgnlabel');
      if (label == null || label == "") {
        label = this.getInfoLabel(node);
      }
      if (label == null || label == "") {
        return;
      }
      
      var contentHtml = "<b style='text-align:center;font-size:16px;'>" + label + "</b>";
      var sbgnstatesandinfos = node._private.data.sbgnstatesandinfos;
      for (var i = 0; i < sbgnstatesandinfos.length; i++) {
        var sbgnstateandinfo = sbgnstatesandinfos[i];
        if (sbgnstateandinfo.clazz == "state variable") {
          var value = sbgnstateandinfo.state.value;
          var variable = sbgnstateandinfo.state.variable;
          var stateLabel = (variable == null /*|| typeof stateVariable === undefined */) ? value :
                  value + "@" + variable;
          if (stateLabel == null) {
            stateLabel = "";
          }
          contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
        }
        else if (sbgnstateandinfo.clazz == "unit of information") {
          var stateLabel = sbgnstateandinfo.label.text;
          if (stateLabel == null) {
            stateLabel = "";
          }
          contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
        }
      }
      return contentHtml;
    },
    // general utilities
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
    
    // Section End
    // Stylesheet helpers
};

module.exports = elementUtilities;

},{"./lib-utilities":9,"./option-utilities":11,"./text-utilities":13}],5:[function(_dereq_,module,exports){
/*
 * File Utilities: To be used on read/write file operation
 */

var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var uiUtilities = _dereq_('./ui-utilities');
var graphUtilities = _dereq_('./graph-utilities');
var sbgnvizUpdate = graphUtilities.sbgnvizUpdate.bind(graphUtilities);

var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var saveAs = libs.saveAs;

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
},{"./graph-utilities":6,"./json-to-sbgnml-converter":7,"./lib-utilities":9,"./sbgnml-to-json-converter":12,"./ui-utilities":14}],6:[function(_dereq_,module,exports){
/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

function graphUtilities() {}

graphUtilities.sbgnvizUpdate = function(cyGraph) {
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

graphUtilities.calculatePaddings = function(paddingPercent) {
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

graphUtilities.refreshPaddings = function() {
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

module.exports = graphUtilities;
},{"./lib-utilities":9,"./option-utilities":11}],7:[function(_dereq_,module,exports){
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

},{}],8:[function(_dereq_,module,exports){
/*
 * Listen document for keyboard inputs and exports the utilities that it makes use of
 */
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var keyboardInputUtilities = {
  isNumberKey: function(e) {
    return ( e.keyCode >= 48 && e.keyCode <= 57 ) || ( e.keyCode >= 96 && e.keyCode <= 105 );
  },
  isDotKey: function(e) {
    return e.keyCode === 190;
  },
  isMinusSignKey: function(e) {
    return e.keyCode === 109 || e.keyCode === 189;
  },
  isLeftKey: function(e) {
    return e.keyCode === 37;
  },
  isRightKey: function(e) {
    return e.keyCode === 39;
  },
  isBackspaceKey: function(e) {
    return e.keyCode === 8;
  },
  isEnterKey: function(e) {
    return e.keyCode === 13;
  },
  isIntegerFieldInput: function(value, e) {
    return this.isCtrlOrCommandPressed(e) || this.isMinusSignKey(e) || this.isNumberKey(e) 
            || this.isBackspaceKey(e) || this.isLeftKey(e) || this.isRightKey(e) || this.isEnterKey(e);
  },
  isFloatFieldInput: function(value, e) {
    return this.isIntegerFieldInput(value, e) || this.isDotKey(e);
  },
  isCtrlOrCommandPressed: function(e) {
    return e.ctrlKey || e.metaKey;
  }
};

$(document).ready(function () {
  $(document).on('keydown', '.integer-input', function(e){
    var value = $(this).attr('value');
    return keyboardInputUtilities.isIntegerFieldInput(value, e);
  });
  
  $(document).on('keydown', '.float-input', function(e){
    var value = $(this).attr('value');
    return keyboardInputUtilities.isFloatFieldInput(value, e);
  });
  
  $(document).on('change', '.integer-input,.float-input', function(e){
    var min   = $(this).attr('min');
    var max   = $(this).attr('max');
    var value = parseFloat($(this).val());
    
    if(min != null) {
      min = parseFloat(min);
    }
    
    if(max != null) {
      max = parseFloat(max);
    }
    
    if(min != null && value < min) {
      value = min;
    }
    else if(max != null && value > max) {
      value = max;
    }
    
    if(isNaN(value)) {
      if(min != null) {
        value = min;
      }
      else if(max != null) {
        value = max;
      }
      else {
        value = 0;
      }
    }
    
    $(this).val("" + value);
  });
  
  $(document).keydown(function (e) {
    if (options.undoable) { // Listen undo redo shortcuts if 'undoable'
      if (keyboardInputUtilities.isCtrlOrCommandPressed(e) && e.target.nodeName === 'BODY') {
        if (e.which === 90) { // ctrl + z
          cy.undoRedo().undo();
        }
        else if (e.which === 89) { // ctrl + y
          cy.undoRedo().redo();
        }
      }
    }
  });
});

module.exports = keyboardInputUtilities;
},{"./lib-utilities":9,"./option-utilities":11}],9:[function(_dereq_,module,exports){
/* 
 * Utility file to get and set the libraries to which sbgnviz is dependent from any file.
 */

var libUtilities = function(){
};

libUtilities.setLibs = function(libs) {
  this.libs = libs;
};

libUtilities.getLibs = function() {
  return this.libs;
};

module.exports = libUtilities;


},{}],10:[function(_dereq_,module,exports){
/* 
 * These are the main utilities to be directly utilized by the user interactions.
 * Idealy, this file is just required by index.js
 */

var elementUtilities = _dereq_('./element-utilities');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var optionUtilities = _dereq_('./option-utilities');

var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

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
    elementUtilities.deleteElesSmart(eles);
  }
};

mainUtilities.highlightNeighbours = function(eles) {
  var elesToHighlight = elementUtilities.getNeighboursOfEles(eles);
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

  nodesToHighlight = elementUtilities.extendNodeList(nodesToHighlight);
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", nodesToHighlight);
  }
  else {
    nodesToHighlight.highlight();
  }
};

mainUtilities.highlightProcesses = function(eles) {
  var elesToHighlight = elementUtilities.extendNodeList(eles);
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
  if (elementUtilities.noneIsNotHighlighted()) {
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

mainUtilities.getQtipContent = function(node) {
  return elementUtilities.getQtipContent(node);
};

module.exports = mainUtilities;
},{"./element-utilities":4,"./json-to-sbgnml-converter":7,"./lib-utilities":9,"./option-utilities":11,"./sbgnml-to-json-converter":12}],11:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file 
 */

// default options
var defaults = {
  // The path of core library images when sbgnviz is required from npm and located 
  // in node_modules using default option is enough
  imgPath: 'node_modules/sbgnviz/src/img',
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
},{}],12:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');

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
    var sbgnbbox = {};
    var bbox = ele.querySelector('bbox');

    sbgnbbox.x = bbox.getAttribute('x');
    sbgnbbox.y = bbox.getAttribute('y');
    sbgnbbox.w = bbox.getAttribute('w');
    sbgnbbox.h = bbox.getAttribute('h');
    // set positions as center
    sbgnbbox.x = parseFloat(sbgnbbox.x) + parseFloat(sbgnbbox.w) / 2;
    sbgnbbox.y = parseFloat(sbgnbbox.y) + parseFloat(sbgnbbox.h) / 2;

    return sbgnbbox;
  },
  stateAndInfoBboxProp: function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    var sbgnbbox = {};
    var bbox = ele.querySelector('bbox');

    sbgnbbox.x = bbox.getAttribute('x');
    sbgnbbox.y = bbox.getAttribute('y');
    sbgnbbox.w = bbox.getAttribute('w');
    sbgnbbox.h = bbox.getAttribute('h');

    // set positions as center
    sbgnbbox.x = parseFloat(sbgnbbox.x) + parseFloat(sbgnbbox.w) / 2 - xPos;
    sbgnbbox.y = parseFloat(sbgnbbox.y) + parseFloat(sbgnbbox.h) / 2 - yPos;

    sbgnbbox.x = sbgnbbox.x / parseFloat(parentBbox.w) * 100;
    sbgnbbox.y = sbgnbbox.y / parseFloat(parentBbox.h) * 100;

    return sbgnbbox;
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
    nodeObj.sbgnbbox = self.bboxProp(ele);
    // add class information
    nodeObj.sbgnclass = ele.className;
    // add label information
    var label = self.findChildNode(ele, 'label');
    nodeObj.sbgnlabel = (label && label.getAttribute('text')) || undefined;
    // add state and info box information
    nodeObj.sbgnstatesandinfos = self.stateAndInfoProp(ele, nodeObj.sbgnbbox);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);

    // add clone information
    var cloneMarkers = self.findChildNodes(ele, 'clone');
    if (cloneMarkers.length > 0) {
      nodeObj.sbgnclonemarker = true;
    } else {
      nodeObj.sbgnclonemarker = undefined;
    }

    // add port information
    var ports = [];
    var portElements = ele.querySelectorAll('port');

    for (var i = 0; i < portElements.length; i++) {
      var portEl = portElements[i];
      var id = portEl.getAttribute('id');
      var relativeXPos = parseFloat(portEl.getAttribute('x')) - nodeObj.sbgnbbox.x;
      var relativeYPos = parseFloat(portEl.getAttribute('y')) - nodeObj.sbgnbbox.y;

      relativeXPos = relativeXPos / parseFloat(nodeObj.sbgnbbox.w) * 100;
      relativeYPos = relativeYPos / parseFloat(nodeObj.sbgnbbox.h) * 100;

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

    if (eleClass === 'complex' || eleClass === 'submap') {
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
    edgeObj.sbgnclass = ele.className;
    edgeObj.bendPointPositions = bendPointPositions;

    var glyphChildren = self.findChildNodes(ele, 'glyph');
    var glyphDescendents = ele.querySelectorAll('glyph');
    if (glyphDescendents.length <= 0) {
      edgeObj.sbgncardinality = 0;
    } else {
      for (var i = 0; i < glyphChildren.length; i++) {
        if (glyphChildren[i].className === 'cardinality') {
          var label = glyphChildren[i].querySelector('label');
          edgeObj.sbgncardinality = label.getAttribute('text') || undefined;
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
  convert: function (xmlObject) {
    var self = this;
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];

    var compartments = self.getAllCompartments(xmlObject);

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

    var cytoscapeJsGraph = {};
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  }
};

module.exports = sbgnmlToJson;

},{"./element-utilities":4}],13:[function(_dereq_,module,exports){
/*
 * Text utilities for common usage
 */

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
},{"./option-utilities":11}],14:[function(_dereq_,module,exports){
/*
 * Commonly needed UI Utilities
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var uiUtilities = {
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



},{"./lib-utilities":9,"./option-utilities":11}],15:[function(_dereq_,module,exports){
/*
 * This file exports the functions to be utilized in undoredo extension actions 
 */
var elementUtilities = _dereq_('./element-utilities');

var undoRedoActionFunctions = {
  // Section Start
  // Add/remove action functions
  deleteElesSimple: function (param) {
    return elementUtilities.deleteElesSimple(param.eles);
  },
  restoreEles: function (eles) {
    var param = {};
    param.eles = elementUtilities.restoreEles(eles);
    return param;
  },
  deleteElesSmart: function (param) {
    if (param.firstTime) {
      return elementUtilities.deleteElesSmart(param.eles);
    }
    return elementUtilities.deleteElesSimple(param.eles);
  },
  // Section End
  // Add/remove action functions
};

module.exports = undoRedoActionFunctions;
},{"./element-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMTBEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBzYmdudml6ID0gd2luZG93LnNiZ252aXogPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcclxuICAgIHZhciBsaWJzID0ge307XHJcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XHJcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XHJcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXHJcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xyXG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XHJcbiAgICBcclxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTtcclxuICAgIFxyXG4gICAgdmFyIHNiZ25SZW5kZXJlciA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXInKTtcclxuICAgIHZhciBzYmduQ3lJbnN0YW5jZSA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UnKTtcclxuICAgIFxyXG4gICAgLy8gVXRpbGl0aWVzIHdob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIGV4cG9zZWQgc2VwZXJhdGVseVxyXG4gICAgdmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdWktdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZmlsZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2ZpbGUtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcclxuICAgIHZhciBtYWluVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMnKTtcclxuICAgIHJlcXVpcmUoJy4vdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcycpOyAvLyByZXF1aXJlIGtleWJvcmQgaW5wdXQgdXRpbGl0aWVzXHJcbiAgICAvLyBVdGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBhcyBpc1xyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxuICAgIFxyXG4gICAgc2JnblJlbmRlcmVyKCk7XHJcbiAgICBzYmduQ3lJbnN0YW5jZSgpO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxyXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzLCBtb3N0IHVzZXJzIHdpbGwgbm90IG5lZWQgdGhlc2VcclxuICAgIHNiZ252aXouZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGZpbGVVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IGZpbGVVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHVpVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSB1aVV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggc2JnbiBncmFwaCB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gZ3JhcGhVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IGdyYXBoVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gc2JnbnZpejtcclxuICB9XHJcbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncy5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcclxuXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY29udGFpbmVyU2VsZWN0b3IgPSBvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcjtcclxuICB2YXIgaW1nUGF0aCA9IG9wdGlvbnMuaW1nUGF0aDtcclxuICBcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKVxyXG4gIHtcclxuICAgIHZhciBzYmduTmV0d29ya0NvbnRhaW5lciA9ICQoY29udGFpbmVyU2VsZWN0b3IpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBhbmQgaW5pdCBjeXRvc2NhcGU6XHJcbiAgICB2YXIgY3kgPSBjeXRvc2NhcGUoe1xyXG4gICAgICBjb250YWluZXI6IHNiZ25OZXR3b3JrQ29udGFpbmVyLFxyXG4gICAgICBzdHlsZTogc2JnblN0eWxlU2hlZXQsXHJcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxyXG4gICAgICBib3hTZWxlY3Rpb25FbmFibGVkOiB0cnVlLFxyXG4gICAgICBtb3Rpb25CbHVyOiB0cnVlLFxyXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXHJcbiAgICAgIHJlYWR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmN5ID0gdGhpcztcclxuICAgICAgICAvLyBJZiB1bmRvYWJsZSByZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgICAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBiaW5kQ3lFdmVudHMoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gTm90ZSB0aGF0IGluIENoaVNFIHRoaXMgZnVuY3Rpb24gaXMgaW4gYSBzZXBlcmF0ZSBmaWxlIGJ1dCBpbiB0aGUgdmlld2VyIGl0IGhhcyBqdXN0IDIgbWV0aG9kcyBhbmQgc28gaXQgaXMgbG9jYXRlZCBpbiB0aGlzIGZpbGVcclxuICBmdW5jdGlvbiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpIHtcclxuICAgIC8vIGNyZWF0ZSBvciBnZXQgdGhlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuXHJcbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGJpbmRDeUV2ZW50cygpIHtcclxuICAgIGN5Lm9uKCd0YXBlbmQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGN5Lm9uKFwiYmVmb3JlQ29sbGFwc2VcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIC8vVGhlIGNoaWxkcmVuIGluZm8gb2YgY29tcGxleCBub2RlcyBzaG91bGQgYmUgc2hvd24gd2hlbiB0aGV5IGFyZSBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgICAgICAvL1RoZSBub2RlIGlzIGJlaW5nIGNvbGxhcHNlZCBzdG9yZSBpbmZvbGFiZWwgdG8gdXNlIGl0IGxhdGVyXHJcbiAgICAgICAgdmFyIGluZm9MYWJlbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xyXG4gICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWwgPSBpbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XHJcbiAgICAgIC8vIHJlbW92ZSBiZW5kIHBvaW50cyBiZWZvcmUgY29sbGFwc2VcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XHJcbiAgICAgICAgaWYgKGVkZ2UuaGFzQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykpIHtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgICAgICAgICBkZWxldGUgZWRnZS5fcHJpdmF0ZS5jbGFzc2VzWydlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cyddO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xyXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJDb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgcmVmcmVzaFBhZGRpbmdzKCk7XHJcblxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIG5vZGUuYWRkQ2xhc3MoJ2NoYW5nZUNvbnRlbnQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJiZWZvcmVFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcclxuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnY29udGVudCcpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNiZ25TdHlsZVNoZWV0ID0gY3l0b3NjYXBlLnN0eWxlc2hlZXQoKVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAxLjUsXHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmNmY2ZjYnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgICAgICAgICAndGV4dC1vcGFjaXR5JzogMSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiAxXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVs/c2JnbmNsb25lbWFya2VyXVtzYmduY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogaW1nUGF0aCArICcvY2xvbmVfYmcucG5nJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC13aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdzYmduY2xvbmVtYXJrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSd0YWcnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2Fzc29jaWF0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjNkI2QjZCJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjRjRGM0VFJyxcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2NvbXBhcnRtZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy43NSxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNGRkZGRkYnLFxyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcidcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25iYm94XVtzYmduY2xhc3NdW3NiZ25jbGFzcyE9J2NvbXBsZXgnXVtzYmduY2xhc3MhPSdjb21wYXJ0bWVudCddW3NiZ25jbGFzcyE9J3N1Ym1hcCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3dpZHRoJzogJ2RhdGEoc2JnbmJib3gudyknLFxyXG4gICAgICAgICAgICAnaGVpZ2h0JzogJ2RhdGEoc2JnbmJib3guaCknXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtleHBhbmRlZC1jb2xsYXBzZWQ9J2NvbGxhcHNlZCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAzNlxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxyXG4gICAgICAgICAgICAndGV4dC1vdXRsaW5lLWNvbG9yJzogJyMwMDAnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2N1cnZlLXN0eWxlJzogJ2JlemllcicsXHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1maWxsJzogJ2hvbGxvdycsXHJcbiAgICAgICAgICAgICd3aWR0aCc6IDEuNSxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6YWN0aXZlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnOCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RleHQtcm90YXRpb24nOiAnYXV0b3JvdGF0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtc2hhcGUnOiAncmVjdGFuZ2xlJyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci13aWR0aCc6ICcxJyxcclxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdjb25zdW1wdGlvbiddW3NiZ25jYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NvdXJjZS1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnc2JnbmNhcmRpbmFsaXR5Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxyXG4gICAgICAgICAgICAnc291cmNlLXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdwcm9kdWN0aW9uJ11bc2JnbmNhcmRpbmFsaXR5ID4gMF1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdzYmduY2FyZGluYWxpdHknKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW1hcmdpbi15JzogJy0xMCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3NdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeUFycm93U2hhcGUoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1zaGFwZSc6ICdub25lJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdpbmhpYml0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdwcm9kdWN0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImNvcmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtb3BhY2l0eSc6ICcwLjInLCAnc2VsZWN0aW9uLWJveC1ib3JkZXItY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pO1xyXG59OyIsIi8qXHJcbiAqIFJlbmRlciBzYmduIHNwZWNpZmljIHNoYXBlcyB3aGljaCBhcmUgbm90IHN1cHBvcnRlZCBieSBjeXRvc2NhcGUuanMgY29yZVxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcclxuXHJcbnZhciBjeU1hdGggPSBjeXRvc2NhcGUubWF0aDtcclxudmFyIGN5QmFzZU5vZGVTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZU5vZGVTaGFwZXM7XHJcbnZhciBjeVN0eWxlUHJvcGVydGllcyA9IGN5dG9zY2FwZS5zdHlsZVByb3BlcnRpZXM7XHJcbnZhciBjeURyYXdpbmdTaGFwZXMgPSBjeXRvc2NhcGUuZHJhd2luZ1NoYXBlcztcclxudmFyIGN5QmFzZUFycm93U2hhcGVzID0gY3l0b3NjYXBlLmJhc2VBcnJvd1NoYXBlcztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcclxuICBcclxuICB2YXIgc2JnblNoYXBlcyA9ICQkLnNiZ24uc2JnblNoYXBlcyA9IHtcclxuICAgICdzb3VyY2UgYW5kIHNpbmsnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdjb21wbGV4JzogdHJ1ZSxcclxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgJ3Byb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciB0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlcyA9ICQkLnNiZ24udG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uYWRkUG9ydFJlcGxhY2VtZW50SWZBbnkgPSBmdW5jdGlvbiAobm9kZSwgZWRnZVBvcnQpIHtcclxuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XHJcbiAgICB2YXIgcG9zWSA9IG5vZGUucG9zaXRpb24oKS55O1xyXG4gICAgaWYgKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgICBpZiAocG9ydC5pZCA9PSBlZGdlUG9ydCkge1xyXG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XHJcbiAgICAgICAgICBwb3NZID0gcG9zWSArIHBvcnQueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xyXG4gIH1cclxuICA7XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XHJcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxyXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuXHJcbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xyXG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xyXG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XHJcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XHJcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XHJcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5RHJhd2luZ1NoYXBlcy5kcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICAgIGN5RHJhd2luZ1NoYXBlcy5kcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB1cFdpZHRoID0gdXBXaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZVlQb3MgPiAwKSB7XHJcbiAgICAgICAgaWYgKGRvd25XaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyBkb3duV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgKyBiZWdpblBvc1k7XHJcblxyXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgICAgICBjeURyYXdpbmdTaGFwZXMuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeURyYXdpbmdTaGFwZXMuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG93bldpZHRoID0gZG93bldpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xyXG5cclxuICAgICAgLy91cGRhdGUgbmV3IHN0YXRlIGFuZCBpbmZvIHBvc2l0aW9uKHJlbGF0aXZlIHRvIG5vZGUgY2VudGVyKVxyXG4gICAgICBzdGF0ZS5iYm94LnggPSAoc3RhdGVDZW50ZXJYIC0gY2VudGVyWCkgKiAxMDAgLyBub2RlLndpZHRoKCk7XHJcbiAgICAgIHN0YXRlLmJib3gueSA9IChzdGF0ZUNlbnRlclkgLSBjZW50ZXJZKSAqIDEwMCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHRleHRQcm9wLnN0YXRlLnZhbHVlIHx8ICcnO1xyXG4gICAgdmFyIHN0YXRlVmFyaWFibGUgPSB0ZXh0UHJvcC5zdGF0ZS52YXJpYWJsZSB8fCAnJztcclxuXHJcbiAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlVmFsdWUgKyAoc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA/IFwiQFwiICsgc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA6IFwiXCIpO1xyXG5cclxuICAgIHZhciBmb250U2l6ZSA9IHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XHJcblxyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZUxhYmVsO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0luZm9UZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3AsIHRydW5jYXRlKSB7XHJcbiAgICB2YXIgb2xkRm9udCA9IGNvbnRleHQuZm9udDtcclxuICAgIGNvbnRleHQuZm9udCA9IHRleHRQcm9wLmZvbnQ7XHJcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dFByb3AuY29sb3I7XHJcbiAgICB2YXIgb2xkT3BhY2l0eSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gdGV4dFByb3Aub3BhY2l0eTtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgXHJcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHRleHRQcm9wLmxhYmVsIHx8ICcnO1xyXG4gICAgXHJcbiAgICBpZiAodHJ1bmNhdGUgPT0gZmFsc2UpIHtcclxuICAgICAgdGV4dCA9IHRleHRQcm9wLmxhYmVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCA9IHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgY29udGV4dC5mb250KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0ZXh0UHJvcC5jZW50ZXJYLCB0ZXh0UHJvcC5jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICBjb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZE9wYWNpdHk7XHJcbiAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgfTtcclxuXHJcbiAgY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlID0gZnVuY3Rpb24gKHBvaW50MSwgcG9pbnQyKSB7XHJcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhwb2ludDFbMF0gLSBwb2ludDJbMF0sIDIpICsgTWF0aC5wb3cocG9pbnQxWzFdIC0gcG9pbnQyWzFdLCAyKTtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoZGlzdGFuY2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY29sb3JzID0ge1xyXG4gICAgY2xvbmU6IFwiI2E5YTlhOVwiLFxyXG4gICAgYXNzb2NpYXRpb246IFwiIzZCNkI2QlwiLFxyXG4gICAgcG9ydDogXCIjNkI2QjZCXCJcclxuICB9O1xyXG5cclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKSB7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3M7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aCAmJiBpIDwgNDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XHJcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xyXG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XHJcblxyXG4gICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgLy92YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xyXG4gICAgICAgIGN5RHJhd2luZ1NoYXBlcy5kcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgY3lEcmF3aW5nU2hhcGVzLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhd1BhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUgPSBmdW5jdGlvbiAoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cykge1xyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgY29udGV4dC5tb3ZlVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIDApO1xyXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmxpbmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmlzTXVsdGltZXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3M7XHJcbiAgICBpZiAoc2JnbkNsYXNzICYmIHNiZ25DbGFzcy5pbmRleE9mKFwibXVsdGltZXJcIikgIT0gLTEpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBpcyBjcmVhdGVkIHRvIGhhdmUgc2FtZSBjb3JuZXIgbGVuZ3RoIHdoZW5cclxuICAvL2NvbXBsZXgncyB3aWR0aCBvciBoZWlnaHQgaXMgY2hhbmdlZFxyXG4gICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMgPSBmdW5jdGlvbiAoY29ybmVyTGVuZ3RoLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvL2NwIHN0YW5kcyBmb3IgY29ybmVyIHByb3BvcnRpb25cclxuICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XHJcblxyXG4gICAgdmFyIGNvbXBsZXhQb2ludHMgPSBbLTEgKyBjcFgsIC0xLCAtMSwgLTEgKyBjcFksIC0xLCAxIC0gY3BZLCAtMSArIGNwWCxcclxuICAgICAgMSwgMSAtIGNwWCwgMSwgMSwgMSAtIGNwWSwgMSwgLTEgKyBjcFksIDEgLSBjcFgsIC0xXTtcclxuXHJcbiAgICByZXR1cm4gY29tcGxleFBvaW50cztcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XHJcbiAgICAgIHZhciBwb3J0WCA9IHBvcnQueCAqIHdpZHRoIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHBvcnRZID0gcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgY2VudGVyWTtcclxuICAgICAgdmFyIGNsb3Nlc3RQb2ludCA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICBwb3J0WCwgcG9ydFksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcbiAgICAgIGNvbnRleHQubW92ZVRvKHBvcnRYLCBwb3J0WSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKGNsb3Nlc3RQb2ludFswXSwgY2xvc2VzdFBvaW50WzFdKTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NvdXJjZSBhbmQgc2luaycpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdjb21wbGV4Jyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2Rpc3NvY2lhdGlvbicpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NpbXBsZSBjaGVtaWNhbCcpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCd1bnNwZWNpZmllZCBlbnRpdHknKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdvbWl0dGVkIHByb2Nlc3MnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5jZXJ0YWluIHByb2Nlc3MnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcclxuXHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubGluZVN0eWxlLmVudW1zLnB1c2goJ2NvbnN1bXB0aW9uJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubGluZVN0eWxlLmVudW1zLnB1c2goJ3Byb2R1Y3Rpb24nKTtcclxuXHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMuYXJyb3dTaGFwZS5lbnVtcy5wdXNoKCduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25BcnJvd1NoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5QmFzZUFycm93U2hhcGVzWyduZWNlc3Nhcnkgc3RpbXVsYXRpb24nXSA9IGpRdWVyeS5leHRlbmQoe30sIGN5QmFzZUFycm93U2hhcGVzWyd0cmlhbmdsZS10ZWUnXSk7XHJcbiAgICBjeUJhc2VBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xyXG4gICAgICAtMC4xOCwgLTAuNDMsXHJcbiAgICAgIDAuMTgsIC0wLjQzXHJcbiAgICBdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBsYWJlbDogJycsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIGN5RHJhd2luZ1NoYXBlcy5kcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUoY29udGV4dCwgbm9kZSwgdGhpcy5wb2ludHMpO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHJldHVybiBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydvbWl0dGVkIHByb2Nlc3MnXSA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydvbWl0dGVkIHByb2Nlc3MnXS5sYWJlbCA9ICdcXFxcXFxcXCc7XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1sndW5jZXJ0YWluIHByb2Nlc3MnXSA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWyd1bmNlcnRhaW4gcHJvY2VzcyddLmxhYmVsID0gJz8nO1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJ1bnNwZWNpZmllZCBlbnRpdHlcIl0gPSB7XHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIudW5zcGVjaWZpZWRFbnRpdHkoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0gPSB7XHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbG9uZW1hcmtlcjtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgY3lEcmF3aW5nU2hhcGVzLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubWFjcm9tb2xlY3VsZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeURyYXdpbmdTaGFwZXMuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydhc3NvY2lhdGlvbiddID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcblxyXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcImRpc3NvY2lhdGlvblwiXSA9IHtcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyA0LCBoZWlnaHQgLyA0KTtcclxuXHJcbiAgICAgICAgLy8gQXQgb3JpZ2luLCByYWRpdXMgMSwgMCB0byAycGlcclxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAwLCBNYXRoLlBJICogMiAqIDAuOTk5LCBmYWxzZSk7IC8vICowLjk5OSBiL2MgY2hyb21lIHJlbmRlcmluZyBidWcgb24gZnVsbCBjaXJjbGVcclxuXHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNjYWxlKDQgLyB3aWR0aCwgNCAvIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3UG9ydHNUb0VsbGlwc2VTaGFwZShjb250ZXh0LCBub2RlKTtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgIG5vZGVYLFxyXG4gICAgICAgICAgICAgICAgbm9kZVksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIgKyBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgICB5IC09IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHggLz0gKHdpZHRoIC8gMiArIHBhZGRpbmcpO1xyXG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xyXG4gICAgICBwb2ludHM6IFtdLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVyV2lkdGgoKSA6IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGN5RHJhd2luZ1NoYXBlcy5kcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcclxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3lEcmF3aW5nU2hhcGVzLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8oY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgfSxcclxuLy8gICAgICBpbnRlcnNlY3RMaW5lOiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uaW50ZXJzZWN0TGluZSxcclxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVyV2lkdGgoKSA6IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gKGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAoaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcclxuXHJcbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG5cclxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcclxuICAgICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyxcclxuICAgICAgICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgcHRzID0gY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXS5wb2ludHM7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAqIE1hdGguc3FydCgyKSAvIDIsIGhlaWdodCAqIE1hdGguc3FydCgyKSAvIDIpO1xyXG5cclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMl0sIHB0c1szXSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ocHRzWzZdLCBwdHNbN10pO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvICh3aWR0aCAqIE1hdGguc3FydCgyKSksIDIgLyAoaGVpZ2h0ICogTWF0aC5zcXJ0KDIpKSk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zb3VyY2VBbmRTaW5rKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0VsbGlwc2UgPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgLy8kJC5zYmduLmRyYXdFbGxpcHNlUGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIC8vY29udGV4dC5maWxsKCk7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhdyhjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNsb25lTWFya2VyID0ge1xyXG4gICAgdW5zcGVjaWZpZWRFbnRpdHk6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJCZWdpblggPSAtMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICAgIHZhciBtYXJrZXJFbmRYID0gMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCA1ICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNvdXJjZUFuZFNpbms6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG4gICAgfSxcclxuICAgIHNpbXBsZUNoZW1pY2FsOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4od2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWCA9IGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclggPSBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgZmlyc3RDaXJjbGVDZW50ZXJYLCBmaXJzdENpcmNsZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBzZWNvbmRDaXJjbGVDZW50ZXJYLCBzZWNvbmRDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciByZWNQb2ludHMgPSBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApO1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAvIDQgKiBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gY29ybmVyUmFkaXVzIC8gMjtcclxuXHJcbiAgICAgICAgY3lEcmF3aW5nU2hhcGVzLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LCBjbG9uZVgsIGNsb25lWSwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIHJlY1BvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwZXJ0dXJiaW5nQWdlbnQ6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy01IC8gNiwgLTEsIDUgLyA2LCAtMSwgMSwgMSwgLTEsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHJlbmRlcmVyLmRyYXdQb2x5Z29uKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbnVjbGVpY0FjaWRGZWF0dXJlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzICogaGVpZ2h0IC8gODtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLCBjb3JuZXJSYWRpdXMsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYWNyb21vbGVjdWxlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSk7XHJcbiAgICB9LFxyXG4gICAgY29tcGxleDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAqIGNwWSAvIDI7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY2xvbmVIZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy0xLCAtMSwgMSwgLTEsIDEgLSBjcFgsIDEsIC0xICsgY3BYLCAxXTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICBjeURyYXdpbmdTaGFwZXMuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuXHJcbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgIGlmIChwb3J0cy5sZW5ndGggPCAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcclxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcG9ydC54ICogd2lkdGggLyAxMDAgKyBub2RlWCwgcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgbm9kZVksIDEsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcclxuICAgIHZhciBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgIHZhciBjaGVja1BvaW50ID0gW2ludGVyc2VjdGlvbnNbaV0sIGludGVyc2VjdGlvbnNbaSArIDFdXTtcclxuICAgICAgdmFyIGRpc3RhbmNlID0gY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcclxuXHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW50ZXJzZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIG5vZGVYLCBub2RlWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHMsIHdlIGhhdmUgb25seSB0d28gYXJjcyBmb3JcclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxyXG4gICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggc3RyYWlnaHQgbGluZSBzZWdtZW50c1xyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3AgTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BMZWZ0Q2VudGVyWCwgdG9wTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvcCBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcFJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgdyA9IHdpZHRoIC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGFuID0gY2VudGVyWDtcclxuICAgIHZhciBibiA9IGNlbnRlclk7XHJcblxyXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XHJcblxyXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcclxuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcclxuICAgIHZhciBhID0gaCAqIGggKyB3ICogdyAqIG0gKiBtO1xyXG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcclxuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXHJcbiAgICAgICAgICAgIGJuICogYm4gKiB3ICogdyAtIGggKiBoICogdyAqIHc7XHJcblxyXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xyXG5cclxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG4gICAgdmFyIHQyID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuXHJcbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XHJcbiAgICB2YXIgeE1heCA9IE1hdGgubWF4KHQxLCB0Mik7XHJcblxyXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIHlNYXggPSBtICogeE1heCAtIG0gKiB4MiArIHkyO1xyXG5cclxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuXHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KHN0YXRlSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHN0YXRlQ291bnQrKztcclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIHZhciBpbmZvQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKGluZm9DaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgaW5mb0NvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XHJcbiAgICBpZiAodG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn07XHJcbiIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcclxuICAgIC8vdGhlIGxpc3Qgb2YgdGhlIGVsZW1lbnQgY2xhc3NlcyBoYW5kbGVkIGJ5IHRoZSB0b29sXHJcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcclxuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWUsXHJcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXHJcbiAgICAgICAgJ3RhZyc6IHRydWUsXHJcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ21vZHVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXHJcbiAgICAgICAgJ2luaGliaXRpb24nOiB0cnVlLFxyXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdlcXVpdmFsZW5jZSBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ25vdCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ2FuZCc6IHRydWUsXHJcbiAgICAgICAgJ29yJzogdHJ1ZSxcclxuICAgICAgICAnbm90JzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXHJcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcclxuICAgICAgICAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3BoZW5vdHlwZSddLFxyXG4gICAgICBcclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEdlbmVyYWwgRWxlbWVudCBVdGlsaXRpZXNcclxuXHJcbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXHJcbiAgICBnZXRUb3BNb3N0Tm9kZXM6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdHM7XHJcbiAgICB9LFxyXG4gICAgLy9UaGlzIG1ldGhvZCBjaGVja3MgaWYgYWxsIG9mIHRoZSBnaXZlbiBub2RlcyBoYXZlIHRoZSBzYW1lIHBhcmVudCBhc3N1bWluZyB0aGF0IHRoZSBzaXplIFxyXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcclxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBub2Rlc1swXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YShcInBhcmVudFwiKSAhPSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBtb3ZlTm9kZXM6IGZ1bmN0aW9uKHBvc2l0aW9uRGlmZiwgbm9kZXMsIG5vdENhbGNUb3BNb3N0Tm9kZXMpIHtcclxuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvcE1vc3ROb2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xyXG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XHJcbiAgICAgICAgbm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXHJcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xyXG4gICAgICB2YXIgcGFuID0gY3kucGFuKCk7XHJcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xyXG5cclxuICAgICAgdmFyIHggPSAocmVuZGVyZWRQb3NpdGlvbi54IC0gcGFuLngpIC8gem9vbTtcclxuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gdGhpcy5leHRlbmROb2RlTGlzdChzZWxlY3RlZEVsZXMpO1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0TmVpZ2hib3Vyc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZkVsZXMoc2VsZWN0ZWRFbGVzKTtcclxuICAgICAgICByZXR1cm4gZWxlc1RvSGlnaGxpZ2h0O1xyXG4gICAgfSxcclxuICAgIGdldE5laWdoYm91cnNPZkVsZXM6IGZ1bmN0aW9uKF9lbGVzKXtcclxuICAgICAgICB2YXIgZWxlcyA9IF9lbGVzO1xyXG4gICAgICAgIGVsZXMgPSBlbGVzLmFkZChlbGVzLnBhcmVudHMoXCJub2RlW3NiZ25jbGFzcz0nY29tcGxleCddXCIpKTtcclxuICAgICAgICBlbGVzID0gZWxlcy5hZGQoZWxlcy5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICB2YXIgbmVpZ2hib3Job29kRWxlcyA9IGVsZXMubmVpZ2hib3Job29kKCk7XHJcbiAgICAgICAgdmFyIGVsZXNUb1JldHVybiA9IGVsZXMuYWRkKG5laWdoYm9yaG9vZEVsZXMpO1xyXG4gICAgICAgIGVsZXNUb1JldHVybiA9IGVsZXNUb1JldHVybi5hZGQoZWxlc1RvUmV0dXJuLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHJldHVybiBlbGVzVG9SZXR1cm47XHJcbiAgICB9LFxyXG4gICAgZXh0ZW5kTm9kZUxpc3Q6IGZ1bmN0aW9uKG5vZGVzVG9TaG93KXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5wYXJlbnRzKCkpO1xyXG4gICAgICAgIC8vYWRkIGNvbXBsZXggY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3MhPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5laWdoYm9yUHJvY2Vzc2VzID0gbm9uUHJvY2Vzc2VzLm5laWdoYm9yaG9vZChcIm5vZGVbc2JnbmNsYXNzPSdwcm9jZXNzJ11cIik7XHJcblxyXG4gICAgICAgIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPj0gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcclxuXHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkucGFyZW50cygpKTtcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGV4dGVuZFJlbWFpbmluZ05vZGVzIDogZnVuY3Rpb24obm9kZXNUb0ZpbHRlciwgYWxsTm9kZXMpe1xyXG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb1Nob3cpO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xyXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLm5vZGVzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RIaWdobGlnaHRlZE5vZGVzLmxlbmd0aCArIG5vdEhpZ2hsaWdodGVkRWRnZXMubGVuZ3RoID09PSAwO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcclxuICAgIGRlbGV0ZUVsZXNTbWFydDogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKGVsZXMsIGFsbE5vZGVzKTtcclxuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcclxuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIGVsZXMucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBlbGVzO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXHJcbiAgICBcclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBnZXRDeVNoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgc2hhcGUgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcbiAgICAgICAgaWYgKHNoYXBlLmVuZHNXaXRoKCcgbXVsdGltZXInKSkge1xyXG4gICAgICAgICAgICBzaGFwZSA9IHNoYXBlLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3BoZW5vdHlwZScpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdoZXhhZ29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNoYXBlID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBzaGFwZSA9PSAndGFnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgc2hhcGUgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyB8fCBzaGFwZSA9PSAnZGlzc29jaWF0aW9uJ1xyXG4gICAgICAgICAgICB8fCBzaGFwZSA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2hhcGUgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgc2hhcGUgPT0gJ2NvbXBsZXgnXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IHNoYXBlID09ICdwcm9jZXNzJyB8fCBzaGFwZSA9PSAnb21pdHRlZCBwcm9jZXNzJ1xyXG4gICAgICAgICAgICB8fCBzaGFwZSA9PSAndW5jZXJ0YWluIHByb2Nlc3MnIHx8IHNoYXBlID09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ2VsbGlwc2UnO1xyXG4gICAgfSxcclxuICAgIGdldEN5QXJyb3dTaGFwZTogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ21vZHVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0RWxlbWVudENvbnRlbnQ6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcblxyXG4gICAgICAgIGlmIChzYmduY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIHNiZ25jbGFzcyA9IHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJ1xyXG4gICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBzYmduY2xhc3MgPT0gJ3RhZycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdzYmdubGFiZWwnKSA/IGVsZS5kYXRhKCdzYmdubGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2JnbmNsYXNzID09ICdjb21wYXJ0bWVudCcpe1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpID8gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzYmduY2xhc3MgPT0gJ2NvbXBsZXgnKXtcclxuICAgICAgICAgICAgaWYoZWxlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ3NiZ25sYWJlbCcpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihlbGUuZGF0YSgnaW5mb0xhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnaW5mb0xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnYW5kJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ0FORCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnb3InKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnT1InO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT0gJ25vdCcpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdOT1QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdcXFxcXFxcXCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnPyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gZWxlLmNzcygnd2lkdGgnKSA/IHBhcnNlRmxvYXQoZWxlLmNzcygnd2lkdGgnKSkgOiBlbGUuZGF0YSgnc2JnbmJib3gnKS53O1xyXG5cclxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBjb250ZW50LFxyXG4gICAgICAgICAgICB3aWR0aDogKCBzYmduY2xhc3M9PSgnY29tcGxleCcpIHx8IHNiZ25jbGFzcz09KCdjb21wYXJ0bWVudCcpICk/dGV4dFdpZHRoICogMjp0ZXh0V2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZm9udCA9IHRoaXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcclxuICAgIH0sXHJcbiAgICBnZXRMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcblxyXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzYmduY2xhc3MgPT09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PT0gJ29yJyB8fCBzYmduY2xhc3MgPT09ICdub3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxLjUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgfSxcclxuICAgIGdldENhcmRpbmFsaXR5RGlzdGFuY2U6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xyXG4gICAgICB2YXIgdGd0UG9zID0gZWxlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xyXG4gICAgICByZXR1cm4gZGlzdGFuY2UgKiAwLjE1O1xyXG4gICAgfSxcclxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAvKiBJbmZvIGxhYmVsIG9mIGEgY29sbGFwc2VkIG5vZGUgY2Fubm90IGJlIGNoYW5nZWQgaWZcclxuICAgICAgKiB0aGUgbm9kZSBpcyBjb2xsYXBzZWQgcmV0dXJuIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGluZm8gbGFiZWwgb2YgaXRcclxuICAgICAgKi9cclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jb2xsYXBzZWRDaGlsZHJlbiAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3Mgc2JnbmxhYmVsXHJcbiAgICAgICAqL1xyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgICAgdmFyIGluZm9MYWJlbCA9IFwiXCI7XHJcbiAgICAgIC8qXHJcbiAgICAgICAqIEdldCB0aGUgaW5mbyBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZSBieSBpdCdzIGNoaWxkcmVuIGluZm8gcmVjdXJzaXZlbHlcclxuICAgICAgICovXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICB2YXIgY2hpbGRJbmZvID0gdGhpcy5nZXRJbmZvTGFiZWwoY2hpbGQpO1xyXG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5mb0xhYmVsICE9IFwiXCIpIHtcclxuICAgICAgICAgIGluZm9MYWJlbCArPSBcIjpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5mb0xhYmVsICs9IGNoaWxkSW5mbztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9yZXR1cm4gaW5mbyBsYWJlbFxyXG4gICAgICByZXR1cm4gaW5mb0xhYmVsO1xyXG4gICAgfSxcclxuICAgIGdldFF0aXBDb250ZW50OiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIC8qIENoZWNrIHRoZSBzYmdubGFiZWwgb2YgdGhlIG5vZGUgaWYgaXQgaXMgbm90IHZhbGlkXHJcbiAgICAgICogdGhlbiBjaGVjayB0aGUgaW5mb2xhYmVsIGlmIGl0IGlzIGFsc28gbm90IHZhbGlkIGRvIG5vdCBzaG93IHF0aXBcclxuICAgICAgKi9cclxuICAgICAgdmFyIGxhYmVsID0gbm9kZS5kYXRhKCdzYmdubGFiZWwnKTtcclxuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xyXG4gICAgICAgIGxhYmVsID0gdGhpcy5nZXRJbmZvTGFiZWwobm9kZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIGNvbnRlbnRIdG1sID0gXCI8YiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE2cHg7Jz5cIiArIGxhYmVsICsgXCI8L2I+XCI7XHJcbiAgICAgIHZhciBzYmduc3RhdGVzYW5kaW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNiZ25zdGF0ZXNhbmRpbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBzYmduc3RhdGVhbmRpbmZvID0gc2JnbnN0YXRlc2FuZGluZm9zW2ldO1xyXG4gICAgICAgIGlmIChzYmduc3RhdGVhbmRpbmZvLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcclxuICAgICAgICAgIHZhciB2YXJpYWJsZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFyaWFibGU7XHJcbiAgICAgICAgICB2YXIgc3RhdGVMYWJlbCA9ICh2YXJpYWJsZSA9PSBudWxsIC8qfHwgdHlwZW9mIHN0YXRlVmFyaWFibGUgPT09IHVuZGVmaW5lZCAqLykgPyB2YWx1ZSA6XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcclxuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgc3RhdGVMYWJlbCA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzYmduc3RhdGVhbmRpbmZvLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZW50SHRtbDtcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xyXG4gICAgZ2V0RHluYW1pY0xhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUsIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCkge1xyXG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcclxuICAgICAgZHluYW1pY0xhYmVsU2l6ZSA9IHR5cGVvZiBkeW5hbWljTGFiZWxTaXplID09PSAnZnVuY3Rpb24nID8gZHluYW1pY0xhYmVsU2l6ZS5jYWxsKCkgOiBkeW5hbWljTGFiZWxTaXplO1xyXG5cclxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3NtYWxsJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMC43NTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAncmVndWxhcicpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ2xhcmdlJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMS4yNTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xyXG4gICAgICB2YXIgdGV4dEhlaWdodCA9IHBhcnNlSW50KGggLyAyLjQ1KSAqIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudDtcclxuXHJcbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKlxyXG4gKiBGaWxlIFV0aWxpdGllczogVG8gYmUgdXNlZCBvbiByZWFkL3dyaXRlIGZpbGUgb3BlcmF0aW9uXHJcbiAqL1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xyXG52YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3VpLXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgc2JnbnZpelVwZGF0ZSA9IGdyYXBoVXRpbGl0aWVzLnNiZ252aXpVcGRhdGUuYmluZChncmFwaFV0aWxpdGllcyk7XHJcblxyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIHNhdmVBcyA9IGxpYnMuc2F2ZUFzO1xyXG5cclxuLy8gSGVscGVyIGZ1bmN0aW9ucyBTdGFydFxyXG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxyXG5mdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XHJcbiAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcclxuXHJcbiAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcclxuICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xyXG5cclxuICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcclxuICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcclxuXHJcbiAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XHJcblxyXG4gICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XHJcbiAgfVxyXG5cclxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gIHJldHVybiBibG9iO1xyXG59XHJcbi8vIEhlbHBlciBmdW5jdGlvbnMgRW5kXHJcblxyXG5mdW5jdGlvbiBmaWxlVXRpbGl0aWVzKCkge31cclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzUG5nID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuICB2YXIgcG5nQ29udGVudCA9IGN5LnBuZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcclxuXHJcbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcclxuICB2YXIgYjY0ZGF0YSA9IHBuZ0NvbnRlbnQuc3Vic3RyKHBuZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvcG5nXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsucG5nXCIpO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5zYXZlQXNKcGcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xyXG4gIHZhciBqcGdDb250ZW50ID0gY3kuanBnKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xyXG5cclxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxyXG4gIHZhciBiNjRkYXRhID0ganBnQ29udGVudC5zdWJzdHIoanBnQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xyXG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9qcGdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5qcGdcIik7XHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLmxvYWRYTUxEb2MgPSBmdW5jdGlvbihmdWxsRmlsZVBhdGgpIHtcclxuICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XHJcbiAgICB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHhodHRwID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcclxuICB9XHJcbiAgeGh0dHAub3BlbihcIkdFVFwiLCBmdWxsRmlsZVBhdGgsIGZhbHNlKTtcclxuICB4aHR0cC5zZW5kKCk7XHJcbiAgcmV0dXJuIHhodHRwLnJlc3BvbnNlWE1MO1xyXG59O1xyXG5cclxuLy8gU2hvdWxkIHRoaXMgYmUgZXhwb3NlZCBvciBzaG91bGQgdGhpcyBiZSBtb3ZlZCB0byB0aGUgaGVscGVyIGZ1bmN0aW9ucyBzZWN0aW9uP1xyXG5maWxlVXRpbGl0aWVzLnRleHRUb1htbE9iamVjdCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcclxuICAgIHZhciBkb2MgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpO1xyXG4gICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcclxuICAgIGRvYy5sb2FkWE1MKHRleHQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgJ3RleHQveG1sJyk7XHJcbiAgfVxyXG4gIHJldHVybiBkb2M7XHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLmxvYWRTYW1wbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgZm9sZGVycGF0aCkge1xyXG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcclxuICAvLyBsb2FkIHhtbCBkb2N1bWVudCB1c2UgZGVmYXVsdCBmb2xkZXIgcGF0aCBpZiBpdCBpcyBub3Qgc3BlY2lmaWVkXHJcbiAgdmFyIHhtbE9iamVjdCA9IHRoaXMubG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xyXG4gIFxyXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGEgc2FtcGxlIGlzIGJlaW5nIGxvYWRlZFxyXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVcIiwgWyBmaWxlbmFtZSBdICk7IC8vc2V0RmlsZUNvbnRlbnQoZmlsZW5hbWUucmVwbGFjZSgneG1sJywgJ3NiZ25tbCcpKTtcclxuICBcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XHJcbiAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xyXG4gIH0sIDApO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdWlVdGlsaXRpZXMuc3RhcnRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgXHJcbiAgdmFyIHRleHRUeXBlID0gL3RleHQuKi87XHJcblxyXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciB0ZXh0ID0gdGhpcy5yZXN1bHQ7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoc2VsZi50ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcclxuICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gICAgfSwgMCk7XHJcbiAgfTtcclxuXHJcbiAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblxyXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGFuIGV4dGVybmFsIGZpbGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVcIiwgWyBmaWxlLm5hbWUgXSApOyAvL3NldEZpbGVDb250ZW50KGZpbGUubmFtZSk7XHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc1NiZ25tbCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcbiAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcblxyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XHJcbiAgICB0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtODtcIixcclxuICB9KTtcclxuICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXRpbGl0aWVzOyIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIHNiZ252aXogZ3JhcGhzXHJcbiAqL1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxuZnVuY3Rpb24gZ3JhcGhVdGlsaXRpZXMoKSB7fVxyXG5cclxuZ3JhcGhVdGlsaXRpZXMuc2JnbnZpelVwZGF0ZSA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcclxuICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6VXBkYXRlU3RhcnRcIiApO1xyXG4gIC8vIFJlc2V0IHVuZG8vcmVkbyBzdGFjayBhbmQgYnV0dG9ucyB3aGVuIGEgbmV3IGdyYXBoIGlzIGxvYWRlZFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLnJlc2V0KCk7XHJcbi8vICAgIHRoaXMucmVzZXRVbmRvUmVkb0J1dHRvbnMoKTtcclxuICB9XHJcblxyXG4gIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAvLyBjbGVhciBkYXRhXHJcbiAgY3kucmVtb3ZlKCcqJyk7XHJcbiAgY3kuYWRkKGN5R3JhcGgpO1xyXG5cclxuICAvL2FkZCBwb3NpdGlvbiBpbmZvcm1hdGlvbiB0byBkYXRhIGZvciBwcmVzZXQgbGF5b3V0XHJcbiAgdmFyIHBvc2l0aW9uTWFwID0ge307XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjeUdyYXBoLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgeFBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5zYmduYmJveC54O1xyXG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuc2JnbmJib3gueTtcclxuICAgIHBvc2l0aW9uTWFwW2N5R3JhcGgubm9kZXNbaV0uZGF0YS5pZF0gPSB7J3gnOiB4UG9zLCAneSc6IHlQb3N9O1xyXG4gIH1cclxuXHJcbiAgY3kubGF5b3V0KHtcclxuICAgIG5hbWU6ICdwcmVzZXQnLFxyXG4gICAgcG9zaXRpb25zOiBwb3NpdGlvbk1hcFxyXG4gIH0pO1xyXG5cclxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gIGN5LmVuZEJhdGNoKCk7XHJcblxyXG4gIC8vIFVwZGF0ZSB0aGUgc3R5bGVcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIC8vIEluaXRpbGl6ZSB0aGUgYmVuZCBwb2ludHMgb25jZSB0aGUgZWxlbWVudHMgYXJlIGNyZWF0ZWRcclxuICBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmluaXRCZW5kUG9pbnRzKGN5LmVkZ2VzKCkpO1xyXG4gIFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6VXBkYXRlRW5kXCIgKTtcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZVBhZGRpbmdzID0gZnVuY3Rpb24ocGFkZGluZ1BlcmNlbnQpIHtcclxuICAvL0FzIGRlZmF1bHQgdXNlIHRoZSBjb21wb3VuZCBwYWRkaW5nIHZhbHVlXHJcbiAgaWYgKCFwYWRkaW5nUGVyY2VudCkge1xyXG4gICAgdmFyIGNvbXBvdW5kUGFkZGluZyA9IG9wdGlvbnMuY29tcG91bmRQYWRkaW5nO1xyXG4gICAgcGFkZGluZ1BlcmNlbnQgPSB0eXBlb2YgY29tcG91bmRQYWRkaW5nID09PSAnZnVuY3Rpb24nID8gY29tcG91bmRQYWRkaW5nLmNhbGwoKSA6IGNvbXBvdW5kUGFkZGluZztcclxuICB9XHJcblxyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgdmFyIHRvdGFsID0gMDtcclxuICB2YXIgbnVtT2ZTaW1wbGVzID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgdGhlTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgaWYgKHRoZU5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IHRoZU5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS53aWR0aCgpKTtcclxuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUuaGVpZ2h0KCkpO1xyXG4gICAgICBudW1PZlNpbXBsZXMrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBjYWxjX3BhZGRpbmcgPSAocGFkZGluZ1BlcmNlbnQgLyAxMDApICogTWF0aC5mbG9vcih0b3RhbCAvICgyICogbnVtT2ZTaW1wbGVzKSk7XHJcbiAgaWYgKGNhbGNfcGFkZGluZyA8IDUpIHtcclxuICAgIGNhbGNfcGFkZGluZyA9IDU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2FsY19wYWRkaW5nO1xyXG59O1xyXG5cclxuZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGNhbGNfcGFkZGluZyA9IHRoaXMuY2FsY3VsYXRlUGFkZGluZ3MoKTtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciBjb21wb3VuZHMgPSBub2Rlcy5maWx0ZXIoJyRub2RlID4gbm9kZScpO1xyXG4gIGN5LnN0YXJ0QmF0Y2goKTtcclxuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWxlZnQnLCBjYWxjX3BhZGRpbmcpO1xyXG4gIGNvbXBvdW5kcy5jc3MoJ3BhZGRpbmctcmlnaHQnLCBjYWxjX3BhZGRpbmcpO1xyXG4gIGNvbXBvdW5kcy5jc3MoJ3BhZGRpbmctdG9wJywgY2FsY19wYWRkaW5nKTtcclxuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNhbGNfcGFkZGluZyk7XHJcbiAgY3kuZW5kQmF0Y2goKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ3JhcGhVdGlsaXRpZXM7IiwidmFyIGpzb25Ub1NiZ25tbCA9IHtcclxuICAgIGNyZWF0ZVNiZ25tbCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy9hZGQgaGVhZGVyc1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0neWVzJz8+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzYmduIHhtbG5zPSdodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjInPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8bWFwIGxhbmd1YWdlPSdwcm9jZXNzIGRlc2NyaXB0aW9uJz5cXG5cIjtcclxuXHJcbiAgICAgICAgLy9hZGRpbmcgZ2x5cGggc2Jnbm1sXHJcbiAgICAgICAgY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzQ2hpbGQoKSlcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRHbHlwaFNiZ25tbCh0aGlzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9hZGRpbmcgYXJjIHNiZ25tbFxyXG4gICAgICAgIGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0QXJjU2Jnbm1sKHRoaXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9tYXA+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvc2Jnbj5cXG5cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEdseXBoU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PT0gXCJjb21wYXJ0bWVudFwiKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmlkICsgXCInIGNsYXNzPSdjb21wYXJ0bWVudCcgXCI7XHJcblxyXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5wYXJlbnQgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiA+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09PSBcImNvbXBsZXhcIiB8fCBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09PSBcInN1Ym1hcFwiKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmlkICsgXCInIGNsYXNzPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgKyBcIicgXCI7XHJcblxyXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgICAgICBpZihwYXJlbnQuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT0gXCJjb21wYXJ0bWVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgY29tcGFydG1lbnRSZWY9J1wiICsgcGFyZW50Ll9wcml2YXRlLmRhdGEuaWQgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5hZGRDb21tb25HbHlwaFByb3BlcnRpZXMobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNley8vaXQgaXMgYSBzaW1wbGUgbm9kZVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArXHJcbiAgICAgICAgICAgICAgICBcIjxnbHlwaCBpZD0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuaWQgKyBcIicgY2xhc3M9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyArIFwiJ1wiO1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYocGFyZW50Ll9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDb21tb25HbHlwaFByb3BlcnRpZXMgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGxhYmVsIGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZExhYmVsKG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIGJib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkR2x5cGhCYm94KG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIGNsb25lIGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZENsb25lKG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIHBvcnQgaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkUG9ydChub2RlKTtcclxuICAgICAgICAvL2FkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuZ2V0U3RhdGVBbmRJbmZvU2Jnbm1sKG5vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQ2xvbmUgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXIgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Y2xvbmUvPlxcblwiO1xyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRTdGF0ZUFuZEluZm9TYmdubWwgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcy5sZW5ndGggOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgYm94R2x5cGggPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zW2ldO1xyXG4gICAgICAgICAgICBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJzdGF0ZSB2YXJpYWJsZVwiKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkSW5mb0JveEdseXBoKGJveEdseXBoLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0QXJjU2Jnbm1sIDogZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXHJcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xyXG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgYXJjSWQgPSBhcmNTb3VyY2UgKyBcIi1cIiArIGFyY1RhcmdldDtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxhcmMgaWQ9J1wiICsgYXJjSWQgK1xyXG4gICAgICAgICAgICBcIicgdGFyZ2V0PSdcIiArIGFyY1RhcmdldCArXHJcbiAgICAgICAgICAgIFwiJyBzb3VyY2U9J1wiICsgYXJjU291cmNlICsgXCInIGNsYXNzPSdcIiArXHJcbiAgICAgICAgICAgIGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgKyBcIic+XFxuXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c3RhcnQgeT0nXCIgKyBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WSArIFwiJyB4PSdcIiArXHJcbiAgICAgICAgICAgIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRYICsgXCInLz5cXG5cIjtcclxuXHJcbiAgICAgICAgdmFyIHNlZ3B0cyA9IGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuZ2V0U2VnbWVudFBvaW50cyhlZGdlKTtcclxuICAgICAgICBpZihzZWdwdHMpe1xyXG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xyXG4gICAgICAgICAgICB2YXIgYmVuZFggPSBzZWdwdHNbaV07XHJcbiAgICAgICAgICAgIHZhciBiZW5kWSA9IHNlZ3B0c1tpICsgMV07XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG5leHQgeT0nXCIgKyBiZW5kWSArIFwiJyB4PSdcIiArIGJlbmRYICsgXCInLz5cXG5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8ZW5kIHk9J1wiICsgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRZICsgXCInIHg9J1wiICtcclxuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRYICsgXCInLz5cXG5cIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvYXJjPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkR2x5cGhCYm94IDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54IC0gd2lkdGgvMjtcclxuICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSAtIGhlaWdodC8yO1xyXG4gICAgICAgIHJldHVybiBcIjxiYm94IHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggK1xyXG4gICAgICAgICAgICBcIicgdz0nXCIgKyB3aWR0aCArIFwiJyBoPSdcIiArIGhlaWdodCArIFwiJyAvPlxcblwiO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRTdGF0ZUFuZEluZm9CYm94IDogZnVuY3Rpb24obm9kZSwgYm94R2x5cGgpe1xyXG4gICAgICAgIGJveEJib3ggPSBib3hHbHlwaC5iYm94O1xyXG5cclxuICAgICAgICB2YXIgeCA9IGJveEJib3gueCAvIDEwMCAqIG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgeSA9IGJveEJib3gueSAvIDEwMCAqIG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyAoeCAtIGJveEJib3gudy8yKTtcclxuICAgICAgICB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgKHkgLSBib3hCYm94LmgvMik7XHJcbiAgICAgICAgcmV0dXJuIFwiPGJib3ggeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArXHJcbiAgICAgICAgICAgIFwiJyB3PSdcIiArIGJveEJib3gudyArIFwiJyBoPSdcIiArIGJveEJib3guaCArIFwiJyAvPlxcblwiO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRQb3J0IDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICB2YXIgcG9ydHMgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHM7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBwb3J0cy5sZW5ndGggOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArIHBvcnRzW2ldLnggKiBub2RlLndpZHRoKCkgLyAxMDA7XHJcbiAgICAgICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgcG9ydHNbaV0ueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHBvcnQgaWQ9J1wiICsgcG9ydHNbaV0uaWQgK1xyXG4gICAgICAgICAgICAgICAgXCInIHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggKyBcIicgLz5cXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZExhYmVsIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIGxhYmVsICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gXCI8bGFiZWwgdGV4dD0nXCIgKyBsYWJlbCArIFwiJyAvPlxcblwiO1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRTdGF0ZUJveEdseXBoIDogZnVuY3Rpb24obm9kZSwgbWFpbkdseXBoKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5pZCArIFwiJyBjbGFzcz0nc3RhdGUgdmFyaWFibGUnPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c3RhdGUgXCI7XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhbHVlICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwidmFsdWU9J1wiICsgbm9kZS5zdGF0ZS52YWx1ZSArIFwiJyBcIjtcclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YXJpYWJsZSAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInZhcmlhYmxlPSdcIiArIG5vZGUuc3RhdGUudmFyaWFibGUgKyBcIicgXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIi8+XFxuXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRJbmZvQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBtYWluR2x5cGgpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxnbHlwaCBpZD0nXCIgKyBub2RlLmlkICsgXCInIGNsYXNzPSd1bml0IG9mIGluZm9ybWF0aW9uJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGxhYmVsIFwiO1xyXG5cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwidGV4dD0nXCIgKyBub2RlLmxhYmVsLnRleHQgKyBcIicgXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIi8+XFxuXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uVG9TYmdubWw7XHJcbiIsIi8qXHJcbiAqIExpc3RlbiBkb2N1bWVudCBmb3Iga2V5Ym9hcmQgaW5wdXRzIGFuZCBleHBvcnRzIHRoZSB1dGlsaXRpZXMgdGhhdCBpdCBtYWtlcyB1c2Ugb2ZcclxuICovXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIga2V5Ym9hcmRJbnB1dFV0aWxpdGllcyA9IHtcclxuICBpc051bWJlcktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuICggZS5rZXlDb2RlID49IDQ4ICYmIGUua2V5Q29kZSA8PSA1NyApIHx8ICggZS5rZXlDb2RlID49IDk2ICYmIGUua2V5Q29kZSA8PSAxMDUgKTtcclxuICB9LFxyXG4gIGlzRG90S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxOTA7XHJcbiAgfSxcclxuICBpc01pbnVzU2lnbktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTA5IHx8IGUua2V5Q29kZSA9PT0gMTg5O1xyXG4gIH0sXHJcbiAgaXNMZWZ0S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNztcclxuICB9LFxyXG4gIGlzUmlnaHRLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5O1xyXG4gIH0sXHJcbiAgaXNCYWNrc3BhY2VLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDg7XHJcbiAgfSxcclxuICBpc0VudGVyS2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxMztcclxuICB9LFxyXG4gIGlzSW50ZWdlckZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0N0cmxPckNvbW1hbmRQcmVzc2VkKGUpIHx8IHRoaXMuaXNNaW51c1NpZ25LZXkoZSkgfHwgdGhpcy5pc051bWJlcktleShlKSBcclxuICAgICAgICAgICAgfHwgdGhpcy5pc0JhY2tzcGFjZUtleShlKSB8fCB0aGlzLmlzTGVmdEtleShlKSB8fCB0aGlzLmlzUmlnaHRLZXkoZSkgfHwgdGhpcy5pc0VudGVyS2V5KGUpO1xyXG4gIH0sXHJcbiAgaXNGbG9hdEZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKSB8fCB0aGlzLmlzRG90S2V5KGUpO1xyXG4gIH0sXHJcbiAgaXNDdHJsT3JDb21tYW5kUHJlc3NlZDogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XHJcbiAgfVxyXG59O1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5pbnRlZ2VyLWlucHV0JywgZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XHJcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKTtcclxuICB9KTtcclxuICBcclxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcclxuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcclxuICAgIHJldHVybiBrZXlib2FyZElucHV0VXRpbGl0aWVzLmlzRmxvYXRGaWVsZElucHV0KHZhbHVlLCBlKTtcclxuICB9KTtcclxuICBcclxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5pbnRlZ2VyLWlucHV0LC5mbG9hdC1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIG1pbiAgID0gJCh0aGlzKS5hdHRyKCdtaW4nKTtcclxuICAgIHZhciBtYXggICA9ICQodGhpcykuYXR0cignbWF4Jyk7XHJcbiAgICB2YXIgdmFsdWUgPSBwYXJzZUZsb2F0KCQodGhpcykudmFsKCkpO1xyXG4gICAgXHJcbiAgICBpZihtaW4gIT0gbnVsbCkge1xyXG4gICAgICBtaW4gPSBwYXJzZUZsb2F0KG1pbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKG1heCAhPSBudWxsKSB7XHJcbiAgICAgIG1heCA9IHBhcnNlRmxvYXQobWF4KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYobWluICE9IG51bGwgJiYgdmFsdWUgPCBtaW4pIHtcclxuICAgICAgdmFsdWUgPSBtaW47XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKG1heCAhPSBudWxsICYmIHZhbHVlID4gbWF4KSB7XHJcbiAgICAgIHZhbHVlID0gbWF4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihpc05hTih2YWx1ZSkpIHtcclxuICAgICAgaWYobWluICE9IG51bGwpIHtcclxuICAgICAgICB2YWx1ZSA9IG1pbjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKG1heCAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtYXg7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgICQodGhpcykudmFsKFwiXCIgKyB2YWx1ZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHsgLy8gTGlzdGVuIHVuZG8gcmVkbyBzaG9ydGN1dHMgaWYgJ3VuZG9hYmxlJ1xyXG4gICAgICBpZiAoa2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0N0cmxPckNvbW1hbmRQcmVzc2VkKGUpICYmIGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgICAgICBpZiAoZS53aGljaCA9PT0gOTApIHsgLy8gY3RybCArIHpcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkudW5kbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlLndoaWNoID09PSA4OSkgeyAvLyBjdHJsICsgeVxyXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5yZWRvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZElucHV0VXRpbGl0aWVzOyIsIi8qIFxyXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxyXG4gKi9cclxuXHJcbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XHJcbiAgdGhpcy5saWJzID0gbGlicztcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMubGlicztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzO1xyXG5cclxuIiwiLyogXHJcbiAqIFRoZXNlIGFyZSB0aGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZGlyZWN0bHkgdXRpbGl6ZWQgYnkgdGhlIHVzZXIgaW50ZXJhY3Rpb25zLlxyXG4gKiBJZGVhbHksIHRoaXMgZmlsZSBpcyBqdXN0IHJlcXVpcmVkIGJ5IGluZGV4LmpzXHJcbiAqL1xyXG5cclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xyXG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG5cclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbi8vIEhlbHBlcnMgc3RhcnRcclxuZnVuY3Rpb24gYmVmb3JlUGVyZm9ybUxheW91dCgpIHtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XHJcblxyXG4gIG5vZGVzLnJlbW92ZURhdGEoXCJwb3J0c1wiKTtcclxuICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHNvdXJjZVwiKTtcclxuICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHRhcmdldFwiKTtcclxuXHJcbiAgbm9kZXMuZGF0YShcInBvcnRzXCIsIFtdKTtcclxuICBlZGdlcy5kYXRhKFwicG9ydHNvdXJjZVwiLCBbXSk7XHJcbiAgZWRnZXMuZGF0YShcInBvcnR0YXJnZXRcIiwgW10pO1xyXG5cclxuICAvLyBUT0RPIGRvIHRoaXMgYnkgdXNpbmcgZXh0ZW5zaW9uIEFQSVxyXG4gIGN5LiQoJy5lZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xyXG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcclxuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcclxufTtcclxuLy8gSGVscGVycyBlbmRcclxuXHJcbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7fVxyXG5cclxubWFpblV0aWxpdGllcy5leHBhbmROb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XHJcbiAgdmFyIG5vZGVzVG9FeHBhbmQgPSBub2Rlcy5maWx0ZXIoXCJbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKTtcclxuICBpZiAobm9kZXNUb0V4cGFuZC5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzVG9FeHBhbmQsXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5leHBhbmQoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xyXG4gIGlmIChub2Rlcy5jb2xsYXBzaWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5jb2xsYXBzZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuY29sbGFwc2VDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbc2JnbmNsYXNzPSdjb21wbGV4J11cIik7XHJcbiAgaWYgKGNvbXBsZXhlcy5jb2xsYXBzaWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IGNvbXBsZXhlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY29tcGxleGVzLmNvbGxhcHNlUmVjdXJzaXZlbHkoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmZpbHRlcihcIltzYmduY2xhc3M9J2NvbXBsZXgnXVtleHBhbmRlZC1jb2xsYXBzZWQ9J2NvbGxhcHNlZCddXCIpO1xyXG4gIGlmIChub2Rlcy5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5leHBhbmRSZWN1cnNpdmVseSgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuY29sbGFwc2VBbGwgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcclxuICBpZiAobm9kZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMuY29sbGFwc2VSZWN1cnNpdmVseSgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuZXhwYW5kQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoJzp2aXNpYmxlJykuZmlsdGVyKFwiW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XHJcbiAgaWYgKG5vZGVzLmV4cGFuZGFibGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIG5vZGVzLmV4cGFuZFJlY3Vyc2l2ZWx5KCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5oaWRlRWxlcyA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgZWxlcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcy5oaWRlRWxlcygpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuc2hvd0VsZXMgPSBmdW5jdGlvbihlbGVzKSB7XHJcbiAgaWYgKGVsZXMubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgZWxlcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcy5zaG93RWxlcygpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuc2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChjeS5lbGVtZW50cygpLmxlbmd0aCA9PT0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykubGVuZ3RoKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93XCIsIGN5LmVsZW1lbnRzKCkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LmVsZW1lbnRzKCkuc2hvd0VsZXMoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUgPSBmdW5jdGlvbihlbGVzKSB7XHJcbiAgaWYgKGVsZXMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHtcclxuICAgICAgZWxlczogZWxlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcy5yZW1vdmUoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmRlbGV0ZUVsZXNTbWFydCA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHtcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICBlbGVzOiBlbGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTbWFydChlbGVzKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodE5laWdoYm91cnMgPSBmdW5jdGlvbihlbGVzKSB7XHJcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TmVpZ2hib3Vyc09mRWxlcyhlbGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XHJcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXNUb0hpZ2hsaWdodC5oaWdobGlnaHQoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLnNlYXJjaEJ5TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xyXG4gIGlmIChsYWJlbC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgIGlmIChlbGUuZGF0YShcInNiZ25sYWJlbFwiKSAmJiBlbGUuZGF0YShcInNiZ25sYWJlbFwiKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobGFiZWwpID49IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChub2Rlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBub2Rlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlc1RvSGlnaGxpZ2h0KTtcclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oZWxlcykge1xyXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KGVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcclxuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LnJlbW92ZUhpZ2hsaWdodHMoKVxyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMucGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dE9wdGlvbnMsIG5vdFVuZG9hYmxlKSB7XHJcbiAgLy8gVGhpbmdzIHRvIGRvIGJlZm9yZSBwZXJmb3JtaW5nIGxheW91dFxyXG4gIGJlZm9yZVBlcmZvcm1MYXlvdXQoKTtcclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUgfHwgbm90VW5kb2FibGUpIHsgLy8gJ25vdFVuZG9hYmxlJyBmbGFnIGNhbiBiZSB1c2VkIHRvIGhhdmUgY29tcG9zaXRlIGFjdGlvbnMgaW4gdW5kby9yZWRvIHN0YWNrXHJcbiAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XHJcbiAgICAgIG9wdGlvbnM6IGxheW91dE9wdGlvbnMsXHJcbiAgICAgIGVsZXM6IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVNiZ25tbCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUb0pzb24gPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgbG9jYXRlZCBcclxuICAvLyBpbiBub2RlX21vZHVsZXMgdXNpbmcgZGVmYXVsdCBvcHRpb24gaXMgZW5vdWdoXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZVxyXG59O1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICB9XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHtcclxuICBpbnNlcnRlZE5vZGVzOiB7fSxcclxuICBnZXRBbGxDb21wYXJ0bWVudHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcclxuXHJcbiAgICB2YXIgY29tcGFydG1lbnRFbHMgPSB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbChcImdseXBoW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRFbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNvbXBhcnRtZW50ID0gY29tcGFydG1lbnRFbHNbaV07XHJcbiAgICAgIHZhciBiYm94ID0gdGhpcy5maW5kQ2hpbGROb2RlKGNvbXBhcnRtZW50LCAnYmJveCcpO1xyXG4gICAgICBjb21wYXJ0bWVudHMucHVzaCh7XHJcbiAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCd4JykpLFxyXG4gICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94LmdldEF0dHJpYnV0ZSgneScpKSxcclxuICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKSksXHJcbiAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCdoJykpLFxyXG4gICAgICAgICdpZCc6IGNvbXBhcnRtZW50LmdldEF0dHJpYnV0ZSgnaWQnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJ0bWVudHMuc29ydChmdW5jdGlvbiAoYzEsIGMyKSB7XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA8IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA+IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY29tcGFydG1lbnRzO1xyXG4gIH0sXHJcbiAgaXNJbkJvdW5kaW5nQm94OiBmdW5jdGlvbiAoYmJveDEsIGJib3gyKSB7XHJcbiAgICBpZiAoYmJveDEueCA+IGJib3gyLnggJiZcclxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxyXG4gICAgICAgIGJib3gxLnggKyBiYm94MS53IDwgYmJveDIueCArIGJib3gyLncgJiZcclxuICAgICAgICBiYm94MS55ICsgYmJveDEuaCA8IGJib3gyLnkgKyBiYm94Mi5oKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgYmJveFByb3A6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBzYmduYmJveCA9IHt9O1xyXG4gICAgdmFyIGJib3ggPSBlbGUucXVlcnlTZWxlY3RvcignYmJveCcpO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSBiYm94LmdldEF0dHJpYnV0ZSgneCcpO1xyXG4gICAgc2JnbmJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XHJcbiAgICBzYmduYmJveC53ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKTtcclxuICAgIHNiZ25iYm94LmggPSBiYm94LmdldEF0dHJpYnV0ZSgnaCcpO1xyXG4gICAgLy8gc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcclxuICAgIHNiZ25iYm94LnggPSBwYXJzZUZsb2F0KHNiZ25iYm94LngpICsgcGFyc2VGbG9hdChzYmduYmJveC53KSAvIDI7XHJcbiAgICBzYmduYmJveC55ID0gcGFyc2VGbG9hdChzYmduYmJveC55KSArIHBhcnNlRmxvYXQoc2JnbmJib3guaCkgLyAyO1xyXG5cclxuICAgIHJldHVybiBzYmduYmJveDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XHJcbiAgICB2YXIgeFBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC54KTtcclxuICAgIHZhciB5UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LnkpO1xyXG5cclxuICAgIHZhciBzYmduYmJveCA9IHt9O1xyXG4gICAgdmFyIGJib3ggPSBlbGUucXVlcnlTZWxlY3RvcignYmJveCcpO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSBiYm94LmdldEF0dHJpYnV0ZSgneCcpO1xyXG4gICAgc2JnbmJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XHJcbiAgICBzYmduYmJveC53ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKTtcclxuICAgIHNiZ25iYm94LmggPSBiYm94LmdldEF0dHJpYnV0ZSgnaCcpO1xyXG5cclxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBzYmduYmJveC54ID0gcGFyc2VGbG9hdChzYmduYmJveC54KSArIHBhcnNlRmxvYXQoc2JnbmJib3gudykgLyAyIC0geFBvcztcclxuICAgIHNiZ25iYm94LnkgPSBwYXJzZUZsb2F0KHNiZ25iYm94LnkpICsgcGFyc2VGbG9hdChzYmduYmJveC5oKSAvIDIgLSB5UG9zO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSBzYmduYmJveC54IC8gcGFyc2VGbG9hdChwYXJlbnRCYm94LncpICogMTAwO1xyXG4gICAgc2JnbmJib3gueSA9IHNiZ25iYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XHJcblxyXG4gICAgcmV0dXJuIHNiZ25iYm94O1xyXG4gIH0sXHJcbiAgZmluZENoaWxkTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xyXG4gICAgLy8gZmluZCBjaGlsZCBub2RlcyBhdCBkZXB0aCBsZXZlbCBvZiAxIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNoaWxkID0gZWxlLmNoaWxkTm9kZXNbaV07XHJcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSAmJiBjaGlsZC50YWdOYW1lID09PSBjaGlsZFRhZ05hbWUpIHtcclxuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0sXHJcbiAgZmluZENoaWxkTm9kZTogZnVuY3Rpb24gKGVsZSwgY2hpbGRUYWdOYW1lKSB7XHJcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgY2hpbGRUYWdOYW1lKTtcclxuICAgIHJldHVybiBub2Rlcy5sZW5ndGggPiAwID8gbm9kZXNbMF0gOiB1bmRlZmluZWQ7XHJcbiAgfSxcclxuICBzdGF0ZUFuZEluZm9Qcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvQXJyYXkgPSBbXTtcclxuXHJcbiAgICB2YXIgY2hpbGRHbHlwaHMgPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2dseXBoJyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZEdseXBocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcclxuICAgICAgdmFyIGluZm8gPSB7fTtcclxuXHJcbiAgICAgIGlmIChnbHlwaC5jbGFzc05hbWUgPT09ICd1bml0IG9mIGluZm9ybWF0aW9uJykge1xyXG4gICAgICAgIGluZm8uaWQgPSBnbHlwaC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc05hbWUgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IGdseXBoLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XHJcbiAgICAgICAgaW5mby5sYWJlbCA9IHtcclxuICAgICAgICAgICd0ZXh0JzogKGxhYmVsICYmIGxhYmVsLmdldEF0dHJpYnV0ZSgndGV4dCcpKSB8fCB1bmRlZmluZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZ2x5cGguY2xhc3NOYW1lID09PSAnc3RhdGUgdmFyaWFibGUnKSB7XHJcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzTmFtZSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gZ2x5cGgucXVlcnlTZWxlY3Rvcignc3RhdGUnKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gKHN0YXRlICYmIHN0YXRlLmdldEF0dHJpYnV0ZSgndmFyaWFibGUnKSkgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8uc3RhdGUgPSB7XHJcbiAgICAgICAgICAndmFsdWUnOiB2YWx1ZSxcclxuICAgICAgICAgICd2YXJpYWJsZSc6IHZhcmlhYmxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbmZvLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKGdseXBoLCBwYXJlbnRCYm94KTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBzdGF0ZUFuZEluZm9BcnJheTtcclxuICB9LFxyXG4gIGFkZFBhcmVudEluZm9Ub05vZGU6IGZ1bmN0aW9uIChlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgY29tcGFydG1lbnRSZWYgPSBlbGUuZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xyXG5cclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tcGFydG1lbnRSZWYpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gJyc7XHJcblxyXG4gICAgICAvLyBhZGQgY29tcGFydG1lbnQgYWNjb3JkaW5nIHRvIGdlb21ldHJ5XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJib3hFbCA9IHNlbGYuZmluZENoaWxkTm9kZShlbGUsICdiYm94Jyk7XHJcbiAgICAgICAgdmFyIGJib3ggPSB7XHJcbiAgICAgICAgICAneCc6IHBhcnNlRmxvYXQoYmJveEVsLmdldEF0dHJpYnV0ZSgneCcpKSxcclxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCd5JykpLFxyXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ3cnKSksXHJcbiAgICAgICAgICAnaCc6IHBhcnNlRmxvYXQoYmJveEVsLmdldEF0dHJpYnV0ZSgnaCcpKSxcclxuICAgICAgICAgICdpZCc6IGVsZS5nZXRBdHRyaWJ1dGUoJ2lkJylcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChzZWxmLmlzSW5Cb3VuZGluZ0JveChiYm94LCBjb21wYXJ0bWVudHNbaV0pKSB7XHJcbiAgICAgICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50c1tpXS5pZDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWRkQ3l0b3NjYXBlSnNOb2RlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbm9kZU9iaiA9IHt9O1xyXG5cclxuICAgIC8vIGFkZCBpZCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5pZCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAvLyBhZGQgbm9kZSBib3VuZGluZyBib3ggaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbmJib3ggPSBzZWxmLmJib3hQcm9wKGVsZSk7XHJcbiAgICAvLyBhZGQgY2xhc3MgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbmNsYXNzID0gZWxlLmNsYXNzTmFtZTtcclxuICAgIC8vIGFkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgdmFyIGxhYmVsID0gc2VsZi5maW5kQ2hpbGROb2RlKGVsZSwgJ2xhYmVsJyk7XHJcbiAgICBub2RlT2JqLnNiZ25sYWJlbCA9IChsYWJlbCAmJiBsYWJlbC5nZXRBdHRyaWJ1dGUoJ3RleHQnKSkgfHwgdW5kZWZpbmVkO1xyXG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zYmduc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLnNiZ25iYm94KTtcclxuICAgIC8vIGFkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cclxuICAgIHNlbGYuYWRkUGFyZW50SW5mb1RvTm9kZShlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAvLyBhZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgIHZhciBjbG9uZU1hcmtlcnMgPSBzZWxmLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2Nsb25lJyk7XHJcbiAgICBpZiAoY2xvbmVNYXJrZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbm9kZU9iai5zYmduY2xvbmVtYXJrZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZU9iai5zYmduY2xvbmVtYXJrZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIHBvcnQgaW5mb3JtYXRpb25cclxuICAgIHZhciBwb3J0cyA9IFtdO1xyXG4gICAgdmFyIHBvcnRFbGVtZW50cyA9IGVsZS5xdWVyeVNlbGVjdG9yQWxsKCdwb3J0Jyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3J0RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcnRFbCA9IHBvcnRFbGVtZW50c1tpXTtcclxuICAgICAgdmFyIGlkID0gcG9ydEVsLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgdmFyIHJlbGF0aXZlWFBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLmdldEF0dHJpYnV0ZSgneCcpKSAtIG5vZGVPYmouc2JnbmJib3gueDtcclxuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLmdldEF0dHJpYnV0ZSgneScpKSAtIG5vZGVPYmouc2JnbmJib3gueTtcclxuXHJcbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5zYmduYmJveC53KSAqIDEwMDtcclxuICAgICAgcmVsYXRpdmVZUG9zID0gcmVsYXRpdmVZUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLnNiZ25iYm94LmgpICogMTAwO1xyXG5cclxuICAgICAgcG9ydHMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcclxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGUgPSB7ZGF0YTogbm9kZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc05vZGUpO1xyXG4gIH0sXHJcbiAgdHJhdmVyc2VOb2RlczogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIGVsSWQgPSBlbGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NOYW1lXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy8gYWRkIGNvbXBsZXggbm9kZXMgaGVyZVxyXG5cclxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc05hbWU7XHJcblxyXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdzdWJtYXAnKSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgICB2YXIgY2hpbGRHbHlwaHMgPSBzZWxmLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2dseXBoJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcclxuICAgICAgICB2YXIgZ2x5cGhDbGFzcyA9IGdseXBoLmNsYXNzTmFtZTtcclxuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwganNvbkFycmF5LCBlbElkLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFBvcnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcclxuICB9LFxyXG4gIGdldEdseXBoczogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xyXG5cclxuICAgIGlmICghZ2x5cGhzKSB7XHJcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XHJcblxyXG4gICAgICB2YXIgaWQyZ2x5cGggPSB4bWxPYmplY3QuX2lkMmdseXBoID0ge307XHJcblxyXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIGcgPSBnbHlwaHNbaV07XHJcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblxyXG4gICAgICAgIGlkMmdseXBoWyBpZCBdID0gZztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnbHlwaHM7XHJcbiAgfSxcclxuICBnZXRHbHlwaEJ5SWQ6IGZ1bmN0aW9uICh4bWxPYmplY3QsIGlkKSB7XHJcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcclxuXHJcbiAgICByZXR1cm4geG1sT2JqZWN0Ll9pZDJnbHlwaFtpZF07XHJcbiAgfSxcclxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xyXG4gICAgLy8gc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcclxuICAgIHZhciBzb3VyY2UgPSBhcmMuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcclxuICAgIHZhciB0YXJnZXQgPSBhcmMuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcclxuICAgIHZhciBzb3VyY2VOb2RlSWQ7XHJcbiAgICB2YXIgdGFyZ2V0Tm9kZUlkO1xyXG5cclxuICAgIHZhciBzb3VyY2VFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHNvdXJjZSk7XHJcbiAgICB2YXIgdGFyZ2V0RXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCB0YXJnZXQpO1xyXG5cclxuICAgIGlmIChzb3VyY2VFeGlzdHMpIHtcclxuICAgICAgc291cmNlTm9kZUlkID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRFeGlzdHMpIHtcclxuICAgICAgdGFyZ2V0Tm9kZUlkID0gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgaTtcclxuICAgIHZhciBwb3J0RWxzID0gdGhpcy5nZXRQb3J0cyh4bWxPYmplY3QpO1xyXG4gICAgdmFyIHBvcnQ7XHJcbiAgICBpZiAoc291cmNlTm9kZUlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XHJcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBzb3VyY2UpIHtcclxuICAgICAgICAgIHNvdXJjZU5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldE5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XHJcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgIHRhcmdldE5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsnc291cmNlJzogc291cmNlTm9kZUlkLCAndGFyZ2V0JzogdGFyZ2V0Tm9kZUlkfTtcclxuICB9LFxyXG5cclxuICBnZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnM6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBbXTtcclxuXHJcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ25leHQnKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3NYID0gY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd4Jyk7XHJcbiAgICAgIHZhciBwb3NZID0gY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd5Jyk7XHJcblxyXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgeDogcG9zWCxcclxuICAgICAgICB5OiBwb3NZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XHJcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc05hbWVdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xyXG5cclxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlZGdlT2JqID0ge307XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcclxuXHJcbiAgICBlZGdlT2JqLmlkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XHJcbiAgICBlZGdlT2JqLnNiZ25jbGFzcyA9IGVsZS5jbGFzc05hbWU7XHJcbiAgICBlZGdlT2JqLmJlbmRQb2ludFBvc2l0aW9ucyA9IGJlbmRQb2ludFBvc2l0aW9ucztcclxuXHJcbiAgICB2YXIgZ2x5cGhDaGlsZHJlbiA9IHNlbGYuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcclxuICAgIHZhciBnbHlwaERlc2NlbmRlbnRzID0gZWxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XHJcbiAgICBpZiAoZ2x5cGhEZXNjZW5kZW50cy5sZW5ndGggPD0gMCkge1xyXG4gICAgICBlZGdlT2JqLnNiZ25jYXJkaW5hbGl0eSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdseXBoQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZ2x5cGhDaGlsZHJlbltpXS5jbGFzc05hbWUgPT09ICdjYXJkaW5hbGl0eScpIHtcclxuICAgICAgICAgIHZhciBsYWJlbCA9IGdseXBoQ2hpbGRyZW5baV0ucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcclxuICAgICAgICAgIGVkZ2VPYmouc2JnbmNhcmRpbmFsaXR5ID0gbGFiZWwuZ2V0QXR0cmlidXRlKCd0ZXh0JykgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkZ2VPYmouc291cmNlID0gc291cmNlQW5kVGFyZ2V0LnNvdXJjZTtcclxuICAgIGVkZ2VPYmoudGFyZ2V0ID0gc291cmNlQW5kVGFyZ2V0LnRhcmdldDtcclxuXHJcbiAgICBlZGdlT2JqLnBvcnRzb3VyY2UgPSBlbGUuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcclxuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2UgPSB7ZGF0YTogZWRnZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xyXG4gIH0sXHJcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZXMgPSBbXTtcclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XHJcblxyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IHNlbGYuZ2V0QWxsQ29tcGFydG1lbnRzKHhtbE9iamVjdCk7XHJcblxyXG4gICAgdmFyIGdseXBocyA9IHNlbGYuZmluZENoaWxkTm9kZXMoeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJ21hcCcpLCAnZ2x5cGgnKTtcclxuICAgIHZhciBhcmNzID0gc2VsZi5maW5kQ2hpbGROb2Rlcyh4bWxPYmplY3QucXVlcnlTZWxlY3RvcignbWFwJyksICdhcmMnKTtcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGdseXBoID0gZ2x5cGhzW2ldO1xyXG4gICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGN5dG9zY2FwZUpzTm9kZXMsICcnLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBhcmMgPSBhcmNzW2ldO1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZShhcmMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcclxuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5lZGdlcyA9IGN5dG9zY2FwZUpzRWRnZXM7XHJcblxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XHJcblxyXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XHJcbiIsIi8qXHJcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xyXG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XHJcbiAgdHJ1bmNhdGVUZXh0OiBmdW5jdGlvbiAodGV4dFByb3AsIGZvbnQpIHtcclxuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY29udGV4dC5mb250ID0gZm9udDtcclxuICAgIFxyXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBcclxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcclxuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcclxuICAgIGlmIChmaXRMYWJlbHNUb05vZGVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHdpZHRoO1xyXG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xyXG4gICAgdmFyIHRleHRXaWR0aCA9ICh0ZXh0UHJvcC53aWR0aCA+IDMwKSA/IHRleHRQcm9wLndpZHRoIC0gMTAgOiB0ZXh0UHJvcC53aWR0aDtcclxuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xyXG4gICAgICAtLWxlbjtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGxlbikgKyBlbGxpcHNpcztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGV4dFV0aWxpdGllczsiLCIvKlxyXG4gKiBDb21tb25seSBuZWVkZWQgVUkgVXRpbGl0aWVzXHJcbiAqL1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIHVpVXRpbGl0aWVzID0ge1xyXG4gIHN0YXJ0U3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG4gICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS53aWR0aCgpO1xyXG4gICAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcikuaGVpZ2h0KCk7XHJcbiAgICAgICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IgKyAnOnBhcmVudCcpLnByZXBlbmQoJzxpIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OTk5OyBsZWZ0OiAnICsgY29udGFpbmVyV2lkdGggLyAyICsgJ3B4OyB0b3A6ICcgKyBjb250YWluZXJIZWlnaHQgLyAyICsgJ3B4O1wiIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTN4IGZhLWZ3ICcgKyBjbGFzc05hbWUgKyAnXCI+PC9pPicpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW5kU3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG4gICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCgnLicgKyBjbGFzc05hbWUpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdWlVdGlsaXRpZXM7XHJcblxyXG5cclxuIiwiLypcclxuICogVGhpcyBmaWxlIGV4cG9ydHMgdGhlIGZ1bmN0aW9ucyB0byBiZSB1dGlsaXplZCBpbiB1bmRvcmVkbyBleHRlbnNpb24gYWN0aW9ucyBcclxuICovXHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xyXG4gIC8vIFNlY3Rpb24gU3RhcnRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XHJcbiAgfSxcclxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgIHZhciBwYXJhbSA9IHt9O1xyXG4gICAgcGFyYW0uZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7XHJcbiAgICByZXR1cm4gcGFyYW07XHJcbiAgfSxcclxuICBkZWxldGVFbGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU21hcnQocGFyYW0uZWxlcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgLy8gU2VjdGlvbiBFbmRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19

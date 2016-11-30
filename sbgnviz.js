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
      if (node._private.data.class == "complex") {
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

      if (node._private.data.class == "complex") {
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
      if (node._private.data.class == "complex") {
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
          .selector("node[?clonemarker][class='perturbing agent']")
          .css({
            'background-image': imgPath + '/clone_bg.png',
            'background-position-x': '50%',
            'background-position-y': '100%',
            'background-width': '100%',
            'background-height': '25%',
            'background-fit': 'none',
            'background-image-opacity': function (ele) {
              if (!ele.data('clonemarker')) {
                return 0;
              }
              return ele.css('background-opacity');
            }
          })
          .selector("node[class]")
          .css({
            'shape': function (ele) {
              return elementUtilities.getCyShape(ele);
            }
          })
          .selector("node[class='perturbing agent']")
          .css({
            'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
          })
          .selector("node[class='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[class='association']")
          .css({
            'background-color': '#6B6B6B'
          })
          .selector("node[class='complex']")
          .css({
            'background-color': '#F4F3EE',
            'text-valign': 'bottom',
            'text-halign': 'center'
          })
          .selector("node[class='compartment']")
          .css({
            'border-width': 3.75,
            'background-opacity': 0,
            'background-color': '#FFFFFF',
            'text-valign': 'bottom',
            'text-halign': 'center'
          })
          .selector("node[bbox][class][class!='complex'][class!='compartment'][class!='submap']")
          .css({
            'width': 'data(bbox.w)',
            'height': 'data(bbox.h)'
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
          .selector("edge[cardinality > 0]")
          .css({
            'text-rotation': 'autorotate',
            'text-background-shape': 'rectangle',
            'text-border-opacity': '1',
            'text-border-width': '1',
            'text-background-color': 'white',
            'text-background-opacity': '1'
          })
          .selector("edge[class='consumption'][cardinality > 0]")
          .css({
            'source-label': function (ele) {
              return '' + ele.data('cardinality');
            },
            'source-text-margin-y': '-10',
            'source-text-offset': function (ele) {
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[class='production'][cardinality > 0]")
          .css({
            'target-label': function (ele) {
              return '' + ele.data('cardinality');
            },
            'target-text-margin-y': '-10',
            'target-text-offset': function (ele) {
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[class]")
          .css({
            'target-arrow-shape': function (ele) {
              return elementUtilities.getCyArrowShape(ele);
            },
            'source-arrow-shape': 'none'
          })
          .selector("edge[class='inhibition']")
          .css({
            'target-arrow-fill': 'filled'
          })
          .selector("edge[class='production']")
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
var cyBaseArrowShapes = cytoscape.baseArrowShapes;

module.exports = function () {
  var $$ = cytoscape;
  
  // Taken from cytoscape.js and modified
  var drawRoundRectanglePath = function(
    context, x, y, width, height, radius ){

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var cornerRadius = radius || cyMath.getRoundRectangleRadius( width, height );

    if( context.beginPath ){ context.beginPath(); }

    // Start at top middle
    context.moveTo( x, y - halfHeight );
    // Arc from middle top to right side
    context.arcTo( x + halfWidth, y - halfHeight, x + halfWidth, y, cornerRadius );
    // Arc from right side to bottom
    context.arcTo( x + halfWidth, y + halfHeight, x, y + halfHeight, cornerRadius );
    // Arc from bottom to left side
    context.arcTo( x - halfWidth, y + halfHeight, x - halfWidth, y, cornerRadius );
    // Arc from left side to topBorder
    context.arcTo( x - halfWidth, y - halfHeight, x, y - halfHeight, cornerRadius );
    // Join line
    context.lineTo( x, y - halfHeight );


    context.closePath();
  };
  
  // Taken from cytoscape.js
  var drawPolygonPath = function(
    context, x, y, width, height, points ){

    var halfW = width / 2;
    var halfH = height / 2;

    if( context.beginPath ){ context.beginPath(); }

    context.moveTo( x + halfW * points[0], y + halfH * points[1] );

    for( var i = 1; i < points.length / 2; i++ ){
      context.lineTo( x + halfW * points[ i * 2], y + halfH * points[ i * 2 + 1] );
    }

    context.closePath();
  };
  
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
            drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            drawRoundRectanglePath(context,
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
            drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            drawRoundRectanglePath(context,
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
    var stateAndInfos = node._private.data.statesandinfos;

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
        drawRoundRectanglePath(context, stateCenterX, stateCenterY,
                stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));

        context.fill();
        textProp.state = state.state;
        $$.sbgn.drawStateText(context, textProp);

        context.stroke();

      } else if (state.clazz == "unit of information") {//draw rectangle
        drawRoundRectanglePath(context,
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
    var sbgnClass = node._private.data.class;
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

        drawPolygonPath(context,
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
        var sbgnClass = node._private.data.class;
        var label = node._private.data.label;
        var cloneMarker = node._private.data.clonemarker;

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
        var label = node._private.data.label;
        var padding = parseInt(node.css('border-width'));
        var cloneMarker = node._private.data.clonemarker;

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
        var label = node._private.data.label;
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;
        var padding = parseInt(node.css('border-width'));

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          drawRoundRectanglePath(context,
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

        drawRoundRectanglePath(context,
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
        var stateAndInfos = node._private.data.statesandinfos;
        var label = node._private.data.label;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          drawPolygonPath(context,
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

        drawPolygonPath(context,
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
        var label = node._private.data.label;
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;

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
        var label = node._private.data.label;
        var pts = cyBaseNodeShapes["source and sink"].points;
        var cloneMarker = node._private.data.clonemarker;

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

        drawPolygonPath(context, cloneX, cloneY, cloneWidth, cloneHeight, recPoints);
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

        drawPolygonPath(context,
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

    var stateAndInfos = node._private.data.statesandinfos;

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
    var stateAndInfos = node._private.data.statesandinfos;

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
        eles = eles.add(eles.parents("node[class='complex']"));
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
        nodesToShow = nodesToShow.add(nodesToShow.nodes("node[class='complex']").descendants());

        // var processes = nodesToShow.nodes("node[class='process']");
        // var nonProcesses = nodesToShow.nodes("node[class!='process']");
        // var neighborProcesses = nonProcesses.neighborhood("node[class='process']");

        var processes = nodesToShow.filter(function(){
            return $.inArray(this._private.data.class, self.processTypes) >= 0;
        });
        var nonProcesses = nodesToShow.filter(function(){
            return $.inArray(this._private.data.class, self.processTypes) === -1;
        });
        var neighborProcesses = nonProcesses.neighborhood().filter(function(){
            return $.inArray(this._private.data.class, self.processTypes) >= 0;
        });

        nodesToShow = nodesToShow.add(processes.neighborhood());
        nodesToShow = nodesToShow.add(neighborProcesses);
        nodesToShow = nodesToShow.add(neighborProcesses.neighborhood());

        //add parents
        nodesToShow = nodesToShow.add(nodesToShow.nodes().parents());
        //add children
        nodesToShow = nodesToShow.add(nodesToShow.nodes("node[class='complex']").descendants());

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
        var _class = ele.data('class');
        if (_class.endsWith(' multimer')) {
            _class = _class.replace(' multimer', '');
        }

        if (_class == 'compartment') {
            return 'roundrectangle';
        }
        if (_class == 'phenotype') {
            return 'hexagon';
        }
        if (_class == 'perturbing agent' || _class == 'tag') {
            return 'polygon';
        }
        if (_class == 'source and sink' || _class == 'nucleic acid feature' || _class == 'dissociation'
            || _class == 'macromolecule' || _class == 'simple chemical' || _class == 'complex'
            || _class == 'unspecified entity' || _class == 'process' || _class == 'omitted process'
            || _class == 'uncertain process' || _class == 'association') {
            return _class;
        }
        return 'ellipse';
    },
    getCyArrowShape: function(ele) {
        var _class = ele.data('class');
        if (_class == 'necessary stimulation') {
            return 'necessary stimulation';
        }
        if (_class == 'inhibition') {
            return 'tee';
        }
        if (_class == 'catalysis') {
            return 'circle';
        }
        if (_class == 'stimulation' || _class == 'production') {
            return 'triangle';
        }
        if (_class == 'modulation') {
            return 'diamond';
        }
        return 'none';
    },
    getElementContent: function(ele) {
        var _class = ele.data('class');

        if (_class.endsWith(' multimer')) {
            _class = _class.replace(' multimer', '');
        }

        var content = "";
        if (_class == 'macromolecule' || _class == 'simple chemical'
            || _class == 'phenotype'
            || _class == 'unspecified entity' || _class == 'nucleic acid feature'
            || _class == 'perturbing agent' || _class == 'tag') {
            content = ele.data('label') ? ele.data('label') : "";
        }
        else if(_class == 'compartment'){
            content = ele.data('label') ? ele.data('label') : "";
        }
        else if(_class == 'complex'){
            if(ele.children().length == 0){
                if(ele.data('label')){
                    content = ele.data('label');
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
        else if (_class == 'and') {
            content = 'AND';
        }
        else if (_class == 'or') {
            content = 'OR';
        }
        else if (_class == 'not') {
            content = 'NOT';
        }
        else if (_class == 'omitted process') {
            content = '\\\\';
        }
        else if (_class == 'uncertain process') {
            content = '?';
        }

        var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('bbox').w;

        var textProp = {
            label: content,
            width: ( _class==('complex') || _class==('compartment') )?textWidth * 2:textWidth
        };

        var font = this.getLabelTextSize(ele) + "px Arial";
        return truncateText(textProp, font); //func. in the cytoscape.renderer.canvas.sbgn-renderer.js
    },
    getLabelTextSize: function (ele) {
      var _class = ele.data('class');

      // These types of nodes cannot have label but this is statement is needed as a workaround
      if (_class === 'association' || _class === 'dissociation') {
        return 20;
      }

      if (_class === 'and' || _class === 'or' || _class === 'not') {
        return this.getDynamicLabelTextSize(ele, 1);
      }

      if (_class.endsWith('process')) {
        return this.getDynamicLabelTextSize(ele, 1.5);
      }

      if (_class === 'complex' || _class === 'compartment') {
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
       * If the node is simple then it's infolabel is equal to it's label
       */
      if (node.children() == null || node.children().length == 0) {
        return node._private.data.label;
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
      /* Check the label of the node if it is not valid
      * then check the infolabel if it is also not valid do not show qtip
      */
      var label = node.data('label');
      if (label == null || label == "") {
        label = this.getInfoLabel(node);
      }
      if (label == null || label == "") {
        return;
      }
      
      var contentHtml = "<b style='text-align:center;font-size:16px;'>" + label + "</b>";
      var statesandinfos = node._private.data.statesandinfos;
      for (var i = 0; i < statesandinfos.length; i++) {
        var sbgnstateandinfo = statesandinfos[i];
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
    var xPos = cyGraph.nodes[i].data.bbox.x;
    var yPos = cyGraph.nodes[i].data.bbox.y;
    positionMap[cyGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
  }

  cy.layout({
    name: 'preset',
    positions: positionMap,
    fit: true,
    padding: 50
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

        if(node._private.data.class === "compartment"){
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
        else if(node._private.data.class === "complex" || node._private.data.class === "submap"){
            sbgnmlText = sbgnmlText +
                "<glyph id='" + node._private.data.id + "' class='" + node._private.data.class + "' ";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.class == "compartment")
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
                "<glyph id='" + node._private.data.id + "' class='" + node._private.data.class + "'";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.class == "compartment")
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
        if(typeof node._private.data.clonemarker != 'undefined')
            sbgnmlText = sbgnmlText + "<clone/>\n";
        return sbgnmlText;
    },

    getStateAndInfoSbgnml : function(node){
        var sbgnmlText = "";

        for(var i = 0 ; i < node._private.data.statesandinfos.length ; i++){
            var boxGlyph = node._private.data.statesandinfos[i];
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
            edge._private.data.class + "'>\n";

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
        var label = node._private.data.label;

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
  var complexes = cy.nodes("[class='complex']");
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
  var nodes = cy.nodes(":selected").filter("[class='complex'][expanded-collapsed='collapsed']");
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
    if (ele.data("label") && ele.data("label").toLowerCase().indexOf(label) >= 0) {
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
    var bbox = {};
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

    var bbox = {};
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHNiZ252aXogPSB3aW5kb3cuc2JnbnZpeiA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xyXG4gICAgdmFyIGxpYnMgPSB7fTtcclxuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcclxuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcclxuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XHJcbiAgICBcclxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcclxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XHJcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcclxuICAgIFxyXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcclxuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpO1xyXG4gICAgXHJcbiAgICB2YXIgc2JnblJlbmRlcmVyID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1yZW5kZXJlcicpO1xyXG4gICAgdmFyIHNiZ25DeUluc3RhbmNlID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZScpO1xyXG4gICAgXHJcbiAgICAvLyBVdGlsaXRpZXMgd2hvc2UgZnVuY3Rpb25zIHdpbGwgYmUgZXhwb3NlZCBzZXBlcmF0ZWx5XHJcbiAgICB2YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91aS11dGlsaXRpZXMnKTtcclxuICAgIHZhciBmaWxlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMnKTtcclxuICAgIHZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xyXG4gICAgcmVxdWlyZSgnLi91dGlsaXRpZXMva2V5Ym9hcmQtaW5wdXQtdXRpbGl0aWVzJyk7IC8vIHJlcXVpcmUga2V5Ym9yZCBpbnB1dCB1dGlsaXRpZXNcclxuICAgIC8vIFV0aWxpdGllcyB0byBiZSBleHBvc2VkIGFzIGlzXHJcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG4gICAgXHJcbiAgICBzYmduUmVuZGVyZXIoKTtcclxuICAgIHNiZ25DeUluc3RhbmNlKCk7XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXHJcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXMsIG1vc3QgdXNlcnMgd2lsbCBub3QgbmVlZCB0aGVzZVxyXG4gICAgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcclxuICAgIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gZmlsZVV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gZmlsZVV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gdWlVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IHVpVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBzYmduIGdyYXBoIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBncmFwaFV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gZ3JhcGhVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzYmdudml6O1xyXG4gIH1cclxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG52YXIgcmVmcmVzaFBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzLmJpbmQoZ3JhcGhVdGlsaXRpZXMpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBjb250YWluZXJTZWxlY3RvciA9IG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yO1xyXG4gIHZhciBpbWdQYXRoID0gb3B0aW9ucy5pbWdQYXRoO1xyXG4gIFxyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXHJcbiAge1xyXG4gICAgdmFyIHNiZ25OZXR3b3JrQ29udGFpbmVyID0gJChjb250YWluZXJTZWxlY3Rvcik7XHJcblxyXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcclxuICAgIHZhciBjeSA9IGN5dG9zY2FwZSh7XHJcbiAgICAgIGNvbnRhaW5lcjogc2Jnbk5ldHdvcmtDb250YWluZXIsXHJcbiAgICAgIHN0eWxlOiBzYmduU3R5bGVTaGVldCxcclxuICAgICAgc2hvd092ZXJsYXk6IGZhbHNlLCBtaW5ab29tOiAwLjEyNSwgbWF4Wm9vbTogMTYsXHJcbiAgICAgIGJveFNlbGVjdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIG1vdGlvbkJsdXI6IHRydWUsXHJcbiAgICAgIHdoZWVsU2Vuc2l0aXZpdHk6IDAuMSxcclxuICAgICAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuY3kgPSB0aGlzO1xyXG4gICAgICAgIC8vIElmIHVuZG9hYmxlIHJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgICAgICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICBcclxuICAvLyBOb3RlIHRoYXQgaW4gQ2hpU0UgdGhpcyBmdW5jdGlvbiBpcyBpbiBhIHNlcGVyYXRlIGZpbGUgYnV0IGluIHRoZSB2aWV3ZXIgaXQgaGFzIGp1c3QgMiBtZXRob2RzIGFuZCBzbyBpdCBpcyBsb2NhdGVkIGluIHRoaXMgZmlsZVxyXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCkge1xyXG4gICAgLy8gY3JlYXRlIG9yIGdldCB0aGUgdW5kby1yZWRvIGluc3RhbmNlXHJcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xyXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gYmluZEN5RXZlbnRzKCkge1xyXG4gICAgY3kub24oJ3RhcGVuZCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY3kub24oXCJiZWZvcmVDb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgLy9UaGUgY2hpbGRyZW4gaW5mbyBvZiBjb21wbGV4IG5vZGVzIHNob3VsZCBiZSBzaG93biB3aGVuIHRoZXkgYXJlIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgLy9UaGUgbm9kZSBpcyBiZWluZyBjb2xsYXBzZWQgc3RvcmUgaW5mb2xhYmVsIHRvIHVzZSBpdCBsYXRlclxyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldEluZm9MYWJlbChub2RlKTtcclxuICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsID0gaW5mb0xhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xyXG4gICAgICAvLyByZW1vdmUgYmVuZCBwb2ludHMgYmVmb3JlIGNvbGxhcHNlXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xyXG4gICAgICAgIGlmIChlZGdlLmhhc0NsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpKSB7XHJcbiAgICAgICAgICBlZGdlLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xyXG4gICAgICAgICAgZGVsZXRlIGVkZ2UuX3ByaXZhdGUuY2xhc3Nlc1snZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcclxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImFmdGVyQ29sbGFwc2VcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIHJlZnJlc2hQYWRkaW5ncygpO1xyXG5cclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIG5vZGUuYWRkQ2xhc3MoJ2NoYW5nZUNvbnRlbnQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJiZWZvcmVFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcclxuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgICAgICBub2RlLnJlbW92ZVN0eWxlKCdjb250ZW50Jyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YXIgc2JnblN0eWxlU2hlZXQgPSBjeXRvc2NhcGUuc3R5bGVzaGVldCgpXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2NvbnRlbnQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RWxlbWVudENvbnRlbnQoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuNSxcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2Y2ZjZmNicsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9jbG9uZW1hcmtlcl1bY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogaW1nUGF0aCArICcvY2xvbmVfYmcucG5nJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC13aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdjbG9uZW1hcmtlcicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lTaGFwZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3RhZyddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAwLjI1LCAtMSwgICAxLCAwLCAgICAwLjI1LCAxLCAgICAtMSwgMSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdhc3NvY2lhdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnIzZCNkI2QidcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjRjRGM0VFJyxcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAzLjc1LFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMCxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI0ZGRkZGRicsXHJcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbYmJveF1bY2xhc3NdW2NsYXNzIT0nY29tcGxleCddW2NsYXNzIT0nY29tcGFydG1lbnQnXVtjbGFzcyE9J3N1Ym1hcCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3dpZHRoJzogJ2RhdGEoYmJveC53KScsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAnZGF0YShiYm94LmgpJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd3aWR0aCc6IDM2LFxyXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzZcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjMDAwJyxcclxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6YWN0aXZlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnMTQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2hvbGxvdycsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiAxLjUsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RleHQtcm90YXRpb24nOiAnYXV0b3JvdGF0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtc2hhcGUnOiAncmVjdGFuZ2xlJyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci13aWR0aCc6ICcxJyxcclxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J2NvbnN1bXB0aW9uJ11bY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ2NhcmRpbmFsaXR5Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxyXG4gICAgICAgICAgICAnc291cmNlLXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW1hcmdpbi15JzogJy0xMCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEN5QXJyb3dTaGFwZShlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LXNoYXBlJzogJ25vbmUnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0naW5oaWJpdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdwcm9kdWN0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImNvcmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtb3BhY2l0eSc6ICcwLjInLCAnc2VsZWN0aW9uLWJveC1ib3JkZXItY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pO1xyXG59OyIsIi8qXHJcbiAqIFJlbmRlciBzYmduIHNwZWNpZmljIHNoYXBlcyB3aGljaCBhcmUgbm90IHN1cHBvcnRlZCBieSBjeXRvc2NhcGUuanMgY29yZVxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcclxuXHJcbnZhciBjeU1hdGggPSBjeXRvc2NhcGUubWF0aDtcclxudmFyIGN5QmFzZU5vZGVTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZU5vZGVTaGFwZXM7XHJcbnZhciBjeVN0eWxlUHJvcGVydGllcyA9IGN5dG9zY2FwZS5zdHlsZVByb3BlcnRpZXM7XHJcbnZhciBjeUJhc2VBcnJvd1NoYXBlcyA9IGN5dG9zY2FwZS5iYXNlQXJyb3dTaGFwZXM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgJCQgPSBjeXRvc2NhcGU7XHJcbiAgXHJcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanMgYW5kIG1vZGlmaWVkXHJcbiAgdmFyIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGggPSBmdW5jdGlvbihcclxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHJhZGl1cyApe1xyXG5cclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gcmFkaXVzIHx8IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyggd2lkdGgsIGhlaWdodCApO1xyXG5cclxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XHJcblxyXG4gICAgLy8gU3RhcnQgYXQgdG9wIG1pZGRsZVxyXG4gICAgY29udGV4dC5tb3ZlVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oIHggKyBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4ICsgaGFsZldpZHRoLCB5LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXHJcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCwgeSArIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHggLSBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSAtIGhhbGZIZWlnaHQsIHgsIHkgLSBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEpvaW4gbGluZVxyXG4gICAgY29udGV4dC5saW5lVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XHJcblxyXG5cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgfTtcclxuICBcclxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qc1xyXG4gIHZhciBkcmF3UG9seWdvblBhdGggPSBmdW5jdGlvbihcclxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHBvaW50cyApe1xyXG5cclxuICAgIHZhciBoYWxmVyA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSCA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbyggeCArIGhhbGZXICogcG9pbnRzWzBdLCB5ICsgaGFsZkggKiBwb2ludHNbMV0gKTtcclxuXHJcbiAgICBmb3IoIHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLyAyOyBpKysgKXtcclxuICAgICAgY29udGV4dC5saW5lVG8oIHggKyBoYWxmVyAqIHBvaW50c1sgaSAqIDJdLCB5ICsgaGFsZkggKiBwb2ludHNbIGkgKiAyICsgMV0gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gIH07XHJcbiAgXHJcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduLnNiZ25TaGFwZXMgPSB7XHJcbiAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcclxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXHJcbiAgICAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJzogdHJ1ZSxcclxuICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdhc3NvY2lhdGlvbic6IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgdG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSAkJC5zYmduLnRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0ge1xyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXHJcbiAgICAncHJvY2Vzcyc6IHRydWUsXHJcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICdhc3NvY2lhdGlvbic6IHRydWVcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmFkZFBvcnRSZXBsYWNlbWVudElmQW55ID0gZnVuY3Rpb24gKG5vZGUsIGVkZ2VQb3J0KSB7XHJcbiAgICB2YXIgcG9zWCA9IG5vZGUucG9zaXRpb24oKS54O1xyXG4gICAgdmFyIHBvc1kgPSBub2RlLnBvc2l0aW9uKCkueTtcclxuICAgIGlmICh0eXBlb2Ygbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XHJcbiAgICAgICAgaWYgKHBvcnQuaWQgPT0gZWRnZVBvcnQpIHtcclxuICAgICAgICAgIHBvc1ggPSBwb3NYICsgcG9ydC54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xyXG4gICAgICAgICAgcG9zWSA9IHBvc1kgKyBwb3J0LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyd4JzogcG9zWCwgJ3knOiBwb3NZfTtcclxuICB9XHJcbiAgO1xyXG5cclxuICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHBvaW50cykge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xyXG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKHBvcnRYLCBwb3J0WSxcclxuICAgICAgICAgICAgICBwb2ludHMsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgcGFkZGluZyk7XHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQubW92ZVRvKHBvcnRYLCBwb3J0WSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKGNsb3Nlc3RQb2ludFswXSwgY2xvc2VzdFBvaW50WzFdKTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcblxyXG4gICAgICAvL2FkZCBhIGxpdHRsZSBibGFjayBjaXJjbGUgdG8gcG9ydHNcclxuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMucG9ydDtcclxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBwb3J0WCwgcG9ydFksIDIsIDIpO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciB1bml0T2ZJbmZvUmFkaXVzID0gNDtcclxuICB2YXIgc3RhdGVWYXJSYWRpdXMgPSAxNTtcclxuICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsXHJcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KSB7XHJcblxyXG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XHJcblxyXG4gICAgdmFyIHVwV2lkdGggPSAwLCBkb3duV2lkdGggPSAwO1xyXG4gICAgdmFyIGJveFBhZGRpbmcgPSAxMCwgYmV0d2VlbkJveFBhZGRpbmcgPSA1O1xyXG4gICAgdmFyIGJlZ2luUG9zWSA9IGhlaWdodCAvIDIsIGJlZ2luUG9zWCA9IHdpZHRoIC8gMjtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zLnNvcnQoJCQuc2Jnbi5jb21wYXJlU3RhdGVzKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuLy8gICAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xyXG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gc3RhdGUuYmJveC55O1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclk7XHJcblxyXG4gICAgICBpZiAocmVsYXRpdmVZUG9zIDwgMCkge1xyXG4gICAgICAgIGlmICh1cFdpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIHVwV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgLSBiZWdpblBvc1k7XHJcblxyXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcclxuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG93bldpZHRoID0gZG93bldpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xyXG5cclxuICAgICAgLy91cGRhdGUgbmV3IHN0YXRlIGFuZCBpbmZvIHBvc2l0aW9uKHJlbGF0aXZlIHRvIG5vZGUgY2VudGVyKVxyXG4gICAgICBzdGF0ZS5iYm94LnggPSAoc3RhdGVDZW50ZXJYIC0gY2VudGVyWCkgKiAxMDAgLyBub2RlLndpZHRoKCk7XHJcbiAgICAgIHN0YXRlLmJib3gueSA9IChzdGF0ZUNlbnRlclkgLSBjZW50ZXJZKSAqIDEwMCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHRleHRQcm9wLnN0YXRlLnZhbHVlIHx8ICcnO1xyXG4gICAgdmFyIHN0YXRlVmFyaWFibGUgPSB0ZXh0UHJvcC5zdGF0ZS52YXJpYWJsZSB8fCAnJztcclxuXHJcbiAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlVmFsdWUgKyAoc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA/IFwiQFwiICsgc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA6IFwiXCIpO1xyXG5cclxuICAgIHZhciBmb250U2l6ZSA9IHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XHJcblxyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZUxhYmVsO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0luZm9UZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3AsIHRydW5jYXRlKSB7XHJcbiAgICB2YXIgb2xkRm9udCA9IGNvbnRleHQuZm9udDtcclxuICAgIGNvbnRleHQuZm9udCA9IHRleHRQcm9wLmZvbnQ7XHJcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dFByb3AuY29sb3I7XHJcbiAgICB2YXIgb2xkT3BhY2l0eSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gdGV4dFByb3Aub3BhY2l0eTtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgXHJcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHRleHRQcm9wLmxhYmVsIHx8ICcnO1xyXG4gICAgXHJcbiAgICBpZiAodHJ1bmNhdGUgPT0gZmFsc2UpIHtcclxuICAgICAgdGV4dCA9IHRleHRQcm9wLmxhYmVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCA9IHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgY29udGV4dC5mb250KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0ZXh0UHJvcC5jZW50ZXJYLCB0ZXh0UHJvcC5jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICBjb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZE9wYWNpdHk7XHJcbiAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgfTtcclxuXHJcbiAgY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlID0gZnVuY3Rpb24gKHBvaW50MSwgcG9pbnQyKSB7XHJcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhwb2ludDFbMF0gLSBwb2ludDJbMF0sIDIpICsgTWF0aC5wb3cocG9pbnQxWzFdIC0gcG9pbnQyWzFdLCAyKTtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoZGlzdGFuY2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY29sb3JzID0ge1xyXG4gICAgY2xvbmU6IFwiI2E5YTlhOVwiLFxyXG4gICAgYXNzb2NpYXRpb246IFwiIzZCNkI2QlwiLFxyXG4gICAgcG9ydDogXCIjNkI2QjZCXCJcclxuICB9O1xyXG5cclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKSB7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoICYmIGkgPCA0OyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICAvL3ZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhd1BhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUgPSBmdW5jdGlvbiAoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cykge1xyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgY29udGV4dC5tb3ZlVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIDApO1xyXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmxpbmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmlzTXVsdGltZXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcztcclxuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxyXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXHJcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxyXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuXHJcbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxyXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xyXG5cclxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xyXG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XHJcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc291cmNlIGFuZCBzaW5rJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnZGlzc29jaWF0aW9uJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ21hY3JvbW9sZWN1bGUnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3Vuc3BlY2lmaWVkIGVudGl0eScpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdwcm9jZXNzJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ29taXR0ZWQgcHJvY2VzcycpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCd1bmNlcnRhaW4gcHJvY2VzcycpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdhc3NvY2lhdGlvbicpO1xyXG5cclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgncHJvZHVjdGlvbicpO1xyXG5cclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5hcnJvd1NoYXBlLmVudW1zLnB1c2goJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xyXG5cclxuICAkJC5zYmduLnJlZ2lzdGVyU2JnbkFycm93U2hhcGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY3lCYXNlQXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lCYXNlQXJyb3dTaGFwZXNbJ3RyaWFuZ2xlLXRlZSddKTtcclxuICAgIGN5QmFzZUFycm93U2hhcGVzWyduZWNlc3Nhcnkgc3RpbXVsYXRpb24nXS5wb2ludHNUZWUgPSBbXHJcbiAgICAgIC0wLjE4LCAtMC40MyxcclxuICAgICAgMC4xOCwgLTAuNDNcclxuICAgIF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25Ob2RlU2hhcGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXHJcbiAgICAgIGxhYmVsOiAnJyxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlKGNvbnRleHQsIG5vZGUsIHRoaXMucG9pbnRzKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIG5vZGVYLFxyXG4gICAgICAgICAgICAgICAgbm9kZVksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICByZXR1cm4gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10ubGFiZWwgPSAnXFxcXFxcXFwnO1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1sndW5jZXJ0YWluIHByb2Nlc3MnXS5sYWJlbCA9ICc/JztcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMpO1xyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuXHJcbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxyXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzLCBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhdyhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIgKyBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW50ZXJzZWN0O1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgICB5IC09IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHggLz0gKHdpZHRoIC8gMiArIHBhZGRpbmcpO1xyXG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJkaXNzb2NpYXRpb25cIl0gPSB7XHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCk7XHJcblxyXG4gICAgICAgIC8vIEF0IG9yaWdpbiwgcmFkaXVzIDEsIDAgdG8gMnBpXHJcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgMCwgTWF0aC5QSSAqIDIgKiAwLjk5OSwgZmFsc2UpOyAvLyAqMC45OTkgYi9jIGNocm9tZSByZW5kZXJpbmcgYnVnIG9uIGZ1bGwgY2lyY2xlXHJcblxyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSg0IC8gd2lkdGgsIDQgLyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBub2RlWCxcclxuICAgICAgICAgICAgICAgIG5vZGVZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcclxuICAgICAgICAgICAgICAgIGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB4IC09IGNlbnRlclg7XHJcbiAgICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcclxuICAgICAgICB5IC89IChoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBbXSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBjb3JuZXJMZW5ndGg6IDEyLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBoYXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlckhlaWdodCgpIDogbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcclxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4vLyAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJXaWR0aCgpIDogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJIZWlnaHQoKSA6IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSAoaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVyV2lkdGgoKSA6IG5vZGUud2lkdGgoKSkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IChoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJIZWlnaHQoKSA6IG5vZGUuaGVpZ2h0KCkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG5cclxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcclxuICAgICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyxcclxuICAgICAgICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBwdHMgPSBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdLnBvaW50cztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc291cmNlQW5kU2luayhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZSxcclxuICAgICAgY2hlY2tQb2ludDogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAvL2NvbnRleHQuZmlsbCgpO1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcclxuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XHJcblxyXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LCBjbG9uZVgsIGNsb25lWSwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIHJlY1BvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwZXJ0dXJiaW5nQWdlbnQ6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy01IC8gNiwgLTEsIDUgLyA2LCAtMSwgMSwgMSwgLTEsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHJlbmRlcmVyLmRyYXdQb2x5Z29uKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbnVjbGVpY0FjaWRGZWF0dXJlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzICogaGVpZ2h0IC8gODtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLCBjb3JuZXJSYWRpdXMsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYWNyb21vbGVjdWxlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSk7XHJcbiAgICB9LFxyXG4gICAgY29tcGxleDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAqIGNwWSAvIDI7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY2xvbmVIZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy0xLCAtMSwgMSwgLTEsIDEgLSBjcFgsIDEsIC0xICsgY3BYLCAxXTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxyXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgdmFyIHBvcnRzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzO1xyXG4gICAgaWYgKHBvcnRzLmxlbmd0aCA8IDApXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XHJcbiAgICAgIGlmIChwb3J0SWQgPT0gcG9ydC5pZCkge1xyXG4gICAgICAgIHJldHVybiBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwb3J0LnggKiB3aWR0aCAvIDEwMCArIG5vZGVYLCBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBub2RlWSwgMSwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCwgaW50ZXJzZWN0aW9ucykge1xyXG4gICAgaWYgKGludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDApXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICB2YXIgY2xvc2VzdEludGVyc2VjdGlvbiA9IFtdO1xyXG4gICAgdmFyIG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludGVyc2VjdGlvbnMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgdmFyIGNoZWNrUG9pbnQgPSBbaW50ZXJzZWN0aW9uc1tpXSwgaW50ZXJzZWN0aW9uc1tpICsgMV1dO1xyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UocG9pbnQsIGNoZWNrUG9pbnQpO1xyXG5cclxuICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcclxuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG4gICAgICAgIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBjaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNsb3Nlc3RJbnRlcnNlY3Rpb247XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSwgbm9kZVgsIG5vZGVZLCBjb3JuZXJSYWRpdXMpIHtcclxuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFkgPSB0b3BTdGFydFk7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XHJcbiAgICAgIHZhciByaWdodEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHJpZ2h0U3RhcnRYLCByaWdodFN0YXJ0WSwgcmlnaHRFbmRYLCByaWdodEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgYm90dG9tU3RhcnRYLCBib3R0b21TdGFydFksIGJvdHRvbUVuZFgsIGJvdHRvbUVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xyXG4gICAgICB2YXIgbGVmdEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50cywgd2UgaGF2ZSBvbmx5IHR3byBhcmNzIGZvclxyXG4gICAgLy9udWNsZWljIGFjaWQgZmVhdHVyZXNcclxuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21SaWdodENlbnRlclkpIHtcclxuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIExlZnRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGdpdmVzIHRoZSBpbnRlcnNlY3Rpb25zIG9mIGFueSBsaW5lIHdpdGggYSByb3VuZCByZWN0YW5nbGUgXHJcbiAgJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5Miwgbm9kZVgsIG5vZGVZLCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBzdHJhaWdodCBsaW5lIHNlZ21lbnRzXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFkgPSB0b3BTdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCB0b3BTdGFydFgsIHRvcFN0YXJ0WSwgdG9wRW5kWCwgdG9wRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIHJpZ2h0U3RhcnRYLCByaWdodFN0YXJ0WSwgcmlnaHRFbmRYLCByaWdodEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWSA9IGJvdHRvbVN0YXJ0WTtcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xyXG4gICAgICB2YXIgbGVmdEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgbGVmdFN0YXJ0WCwgbGVmdFN0YXJ0WSwgbGVmdEVuZFgsIGxlZnRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHNcclxuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIFRvcCBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcExlZnRDZW50ZXJYLCB0b3BMZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gdG9wTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcExlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG9wIFJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgdG9wUmlnaHRDZW50ZXJYLCB0b3BSaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IHRvcFJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIFJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIExlZnRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tTGVmdENlbnRlclkpIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxyXG4gICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZUVsbGlwc2UgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xyXG5cclxuICAgIHZhciB3ID0gd2lkdGggLyAyICsgcGFkZGluZztcclxuICAgIHZhciBoID0gaGVpZ2h0IC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgYW4gPSBjZW50ZXJYO1xyXG4gICAgdmFyIGJuID0gY2VudGVyWTtcclxuXHJcbiAgICB2YXIgZCA9IFt4MiAtIHgxLCB5MiAtIHkxXTtcclxuXHJcbiAgICB2YXIgbSA9IGRbMV0gLyBkWzBdO1xyXG4gICAgdmFyIG4gPSAtMSAqIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIGEgPSBoICogaCArIHcgKiB3ICogbSAqIG07XHJcbiAgICB2YXIgYiA9IC0yICogYW4gKiBoICogaCArIDIgKiBtICogbiAqIHcgKiB3IC0gMiAqIGJuICogbSAqIHcgKiB3O1xyXG4gICAgdmFyIGMgPSBhbiAqIGFuICogaCAqIGggKyBuICogbiAqIHcgKiB3IC0gMiAqIGJuICogdyAqIHcgKiBuICtcclxuICAgICAgICAgICAgYm4gKiBibiAqIHcgKiB3IC0gaCAqIGggKiB3ICogdztcclxuXHJcbiAgICB2YXIgZGlzY3JpbWluYW50ID0gYiAqIGIgLSA0ICogYSAqIGM7XHJcblxyXG4gICAgaWYgKGRpc2NyaW1pbmFudCA8IDApIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0MSA9ICgtYiArIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XHJcbiAgICB2YXIgdDIgPSAoLWIgLSBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG5cclxuICAgIHZhciB4TWluID0gTWF0aC5taW4odDEsIHQyKTtcclxuICAgIHZhciB4TWF4ID0gTWF0aC5tYXgodDEsIHQyKTtcclxuXHJcbiAgICB2YXIgeU1pbiA9IG0gKiB4TWluIC0gbSAqIHgyICsgeTI7XHJcbiAgICB2YXIgeU1heCA9IG0gKiB4TWF4IC0gbSAqIHgyICsgeTI7XHJcblxyXG4gICAgcmV0dXJuIFt4TWluLCB5TWluLCB4TWF4LCB5TWF4XTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5KSB7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcblxyXG4gICAgdmFyIGludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChzdGF0ZUludGVyc2VjdExpbmVzKTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIDUsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoaW5mb0ludGVyc2VjdExpbmVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoaW5mb0ludGVyc2VjdExpbmVzKTtcclxuXHJcbiAgICAgICAgaW5mb0NvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxyXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcclxuICAgIHJldHVybiBbXTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyA9IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9cGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHN0YXRlQ291bnQrKztcclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIHZhciBpbmZvQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKGluZm9DaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgaW5mb0NvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XHJcbiAgICBpZiAodG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn07XHJcbiIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcclxuICAgIC8vdGhlIGxpc3Qgb2YgdGhlIGVsZW1lbnQgY2xhc3NlcyBoYW5kbGVkIGJ5IHRoZSB0b29sXHJcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcclxuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWUsXHJcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXHJcbiAgICAgICAgJ3RhZyc6IHRydWUsXHJcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ21vZHVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXHJcbiAgICAgICAgJ2luaGliaXRpb24nOiB0cnVlLFxyXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdlcXVpdmFsZW5jZSBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ25vdCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ2FuZCc6IHRydWUsXHJcbiAgICAgICAgJ29yJzogdHJ1ZSxcclxuICAgICAgICAnbm90JzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXHJcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcclxuICAgICAgICAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3BoZW5vdHlwZSddLFxyXG4gICAgICBcclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEdlbmVyYWwgRWxlbWVudCBVdGlsaXRpZXNcclxuXHJcbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXHJcbiAgICBnZXRUb3BNb3N0Tm9kZXM6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdHM7XHJcbiAgICB9LFxyXG4gICAgLy9UaGlzIG1ldGhvZCBjaGVja3MgaWYgYWxsIG9mIHRoZSBnaXZlbiBub2RlcyBoYXZlIHRoZSBzYW1lIHBhcmVudCBhc3N1bWluZyB0aGF0IHRoZSBzaXplIFxyXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcclxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBub2Rlc1swXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YShcInBhcmVudFwiKSAhPSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBtb3ZlTm9kZXM6IGZ1bmN0aW9uKHBvc2l0aW9uRGlmZiwgbm9kZXMsIG5vdENhbGNUb3BNb3N0Tm9kZXMpIHtcclxuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvcE1vc3ROb2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xyXG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XHJcbiAgICAgICAgbm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXHJcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xyXG4gICAgICB2YXIgcGFuID0gY3kucGFuKCk7XHJcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xyXG5cclxuICAgICAgdmFyIHggPSAocmVuZGVyZWRQb3NpdGlvbi54IC0gcGFuLngpIC8gem9vbTtcclxuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gdGhpcy5leHRlbmROb2RlTGlzdChzZWxlY3RlZEVsZXMpO1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0TmVpZ2hib3Vyc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZkVsZXMoc2VsZWN0ZWRFbGVzKTtcclxuICAgICAgICByZXR1cm4gZWxlc1RvSGlnaGxpZ2h0O1xyXG4gICAgfSxcclxuICAgIGdldE5laWdoYm91cnNPZkVsZXM6IGZ1bmN0aW9uKF9lbGVzKXtcclxuICAgICAgICB2YXIgZWxlcyA9IF9lbGVzO1xyXG4gICAgICAgIGVsZXMgPSBlbGVzLmFkZChlbGVzLnBhcmVudHMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikpO1xyXG4gICAgICAgIGVsZXMgPSBlbGVzLmFkZChlbGVzLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHZhciBuZWlnaGJvcmhvb2RFbGVzID0gZWxlcy5uZWlnaGJvcmhvb2QoKTtcclxuICAgICAgICB2YXIgZWxlc1RvUmV0dXJuID0gZWxlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XHJcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb1JldHVybjtcclxuICAgIH0sXHJcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcyE9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xyXG5cclxuICAgICAgICB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPj0gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPT09IC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKS5maWx0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGV4dGVuZFJlbWFpbmluZ05vZGVzIDogZnVuY3Rpb24obm9kZXNUb0ZpbHRlciwgYWxsTm9kZXMpe1xyXG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb1Nob3cpO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xyXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLm5vZGVzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RIaWdobGlnaHRlZE5vZGVzLmxlbmd0aCArIG5vdEhpZ2hsaWdodGVkRWRnZXMubGVuZ3RoID09PSAwO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcclxuICAgIGRlbGV0ZUVsZXNTbWFydDogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKGVsZXMsIGFsbE5vZGVzKTtcclxuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcclxuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIGVsZXMucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBlbGVzO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXHJcbiAgICBcclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBnZXRDeVNoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcclxuICAgICAgICAgICAgX2NsYXNzID0gX2NsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JvdW5kcmVjdGFuZ2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAncGhlbm90eXBlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2hleGFnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBfY2xhc3MgPT0gJ3RhZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdwb2x5Z29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJyB8fCBfY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyB8fCBfY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbidcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgX2NsYXNzID09ICdjb21wbGV4J1xyXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycgfHwgX2NsYXNzID09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICdlbGxpcHNlJztcclxuICAgIH0sXHJcbiAgICBnZXRDeUFycm93U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICBpZiAoX2NsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnaW5oaWJpdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdjYXRhbHlzaXMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IF9jbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ21vZHVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0RWxlbWVudENvbnRlbnQ6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcclxuICAgICAgICAgICAgX2NsYXNzID0gX2NsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdwaGVub3R5cGUnXHJcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5JyB8fCBfY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XHJcbiAgICAgICAgICAgIGlmKGVsZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIGlmKGVsZS5kYXRhKCdsYWJlbCcpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGVsZS5kYXRhKCdpbmZvTGFiZWwnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdhbmQnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnQU5EJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdvcicpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdPUic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnbm90Jykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ05PVCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ1xcXFxcXFxcJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICc/JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZXh0V2lkdGggPSBlbGUuY3NzKCd3aWR0aCcpID8gcGFyc2VGbG9hdChlbGUuY3NzKCd3aWR0aCcpKSA6IGVsZS5kYXRhKCdiYm94JykudztcclxuXHJcbiAgICAgICAgdmFyIHRleHRQcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcclxuICAgICAgICAgICAgd2lkdGg6ICggX2NsYXNzPT0oJ2NvbXBsZXgnKSB8fCBfY2xhc3M9PSgnY29tcGFydG1lbnQnKSApP3RleHRXaWR0aCAqIDI6dGV4dFdpZHRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGZvbnQgPSB0aGlzLmdldExhYmVsVGV4dFNpemUoZWxlKSArIFwicHggQXJpYWxcIjtcclxuICAgICAgICByZXR1cm4gdHJ1bmNhdGVUZXh0KHRleHRQcm9wLCBmb250KTsgLy9mdW5jLiBpbiB0aGUgY3l0b3NjYXBlLnJlbmRlcmVyLmNhbnZhcy5zYmduLXJlbmRlcmVyLmpzXHJcbiAgICB9LFxyXG4gICAgZ2V0TGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxyXG4gICAgICBpZiAoX2NsYXNzID09PSAnYXNzb2NpYXRpb24nIHx8IF9jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxLjUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2NsYXNzID09PSAnY29tcGxleCcgfHwgX2NsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgfSxcclxuICAgIGdldENhcmRpbmFsaXR5RGlzdGFuY2U6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xyXG4gICAgICB2YXIgdGd0UG9zID0gZWxlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xyXG4gICAgICByZXR1cm4gZGlzdGFuY2UgKiAwLjE1O1xyXG4gICAgfSxcclxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAvKiBJbmZvIGxhYmVsIG9mIGEgY29sbGFwc2VkIG5vZGUgY2Fubm90IGJlIGNoYW5nZWQgaWZcclxuICAgICAgKiB0aGUgbm9kZSBpcyBjb2xsYXBzZWQgcmV0dXJuIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGluZm8gbGFiZWwgb2YgaXRcclxuICAgICAgKi9cclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jb2xsYXBzZWRDaGlsZHJlbiAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcclxuICAgICAgICovXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgIHZhciBpbmZvTGFiZWwgPSBcIlwiO1xyXG4gICAgICAvKlxyXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAqL1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgdmFyIGNoaWxkSW5mbyA9IHRoaXMuZ2V0SW5mb0xhYmVsKGNoaWxkKTtcclxuICAgICAgICBpZiAoY2hpbGRJbmZvID09IG51bGwgfHwgY2hpbGRJbmZvID09IFwiXCIpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICBpbmZvTGFiZWwgKz0gXCI6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcclxuICAgICAgcmV0dXJuIGluZm9MYWJlbDtcclxuICAgIH0sXHJcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAvKiBDaGVjayB0aGUgbGFiZWwgb2YgdGhlIG5vZGUgaWYgaXQgaXMgbm90IHZhbGlkXHJcbiAgICAgICogdGhlbiBjaGVjayB0aGUgaW5mb2xhYmVsIGlmIGl0IGlzIGFsc28gbm90IHZhbGlkIGRvIG5vdCBzaG93IHF0aXBcclxuICAgICAgKi9cclxuICAgICAgdmFyIGxhYmVsID0gbm9kZS5kYXRhKCdsYWJlbCcpO1xyXG4gICAgICBpZiAobGFiZWwgPT0gbnVsbCB8fCBsYWJlbCA9PSBcIlwiKSB7XHJcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGFiZWwgPT0gbnVsbCB8fCBsYWJlbCA9PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcclxuICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlc2FuZGluZm9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgIHZhciB2YWx1ZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFsdWU7XHJcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xyXG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSAodmFyaWFibGUgPT0gbnVsbCAvKnx8IHR5cGVvZiBzdGF0ZVZhcmlhYmxlID09PSB1bmRlZmluZWQgKi8pID8gdmFsdWUgOlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArIFwiQFwiICsgdmFyaWFibGU7XHJcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29udGVudEh0bWw7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIGdldER5bmFtaWNMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlLCBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQpIHtcclxuICAgICAgdmFyIGR5bmFtaWNMYWJlbFNpemUgPSBvcHRpb25zLmR5bmFtaWNMYWJlbFNpemU7XHJcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcclxuXHJcbiAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDAuNzU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDEuMjU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgaCA9IGVsZS5oZWlnaHQoKTtcclxuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dEhlaWdodDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudFV0aWxpdGllcztcclxuIiwiLypcclxuICogRmlsZSBVdGlsaXRpZXM6IFRvIGJlIHVzZWQgb24gcmVhZC93cml0ZSBmaWxlIG9wZXJhdGlvblxyXG4gKi9cclxuXHJcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xyXG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcclxudmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91aS11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxudmFyIHNiZ252aXpVcGRhdGUgPSBncmFwaFV0aWxpdGllcy5zYmdudml6VXBkYXRlLmJpbmQoZ3JhcGhVdGlsaXRpZXMpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBzYXZlQXMgPSBsaWJzLnNhdmVBcztcclxuXHJcbi8vIEhlbHBlciBmdW5jdGlvbnMgU3RhcnRcclxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYyNDU3NjcvY3JlYXRpbmctYS1ibG9iLWZyb20tYS1iYXNlNjQtc3RyaW5nLWluLWphdmFzY3JpcHRcclxuZnVuY3Rpb24gYjY0dG9CbG9iKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpIHtcclxuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICcnO1xyXG4gIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XHJcblxyXG4gIHZhciBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYjY0RGF0YSk7XHJcbiAgdmFyIGJ5dGVBcnJheXMgPSBbXTtcclxuXHJcbiAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoOyBvZmZzZXQgKz0gc2xpY2VTaXplKSB7XHJcbiAgICB2YXIgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XHJcblxyXG4gICAgdmFyIGJ5dGVOdW1iZXJzID0gbmV3IEFycmF5KHNsaWNlLmxlbmd0aCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xyXG5cclxuICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGJsb2IgPSBuZXcgQmxvYihieXRlQXJyYXlzLCB7dHlwZTogY29udGVudFR5cGV9KTtcclxuICByZXR1cm4gYmxvYjtcclxufVxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIEVuZFxyXG5cclxuZnVuY3Rpb24gZmlsZVV0aWxpdGllcygpIHt9XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc1BuZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcbiAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXHJcbiAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XHJcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLnBuZ1wiKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzSnBnID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuICB2YXIganBnQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcclxuXHJcbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcclxuICB2YXIgYjY0ZGF0YSA9IGpwZ0NvbnRlbnQuc3Vic3RyKGpwZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsuanBnXCIpO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5sb2FkWE1MRG9jID0gZnVuY3Rpb24oZnVsbEZpbGVQYXRoKSB7XHJcbiAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xyXG4gICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcbiAgfVxyXG4gIHhodHRwLm9wZW4oXCJHRVRcIiwgZnVsbEZpbGVQYXRoLCBmYWxzZSk7XHJcbiAgeGh0dHAuc2VuZCgpO1xyXG4gIHJldHVybiB4aHR0cC5yZXNwb25zZVhNTDtcclxufTtcclxuXHJcbi8vIFNob3VsZCB0aGlzIGJlIGV4cG9zZWQgb3Igc2hvdWxkIHRoaXMgYmUgbW92ZWQgdG8gdGhlIGhlbHBlciBmdW5jdGlvbnMgc2VjdGlvbj9cclxuZmlsZVV0aWxpdGllcy50ZXh0VG9YbWxPYmplY3QgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XHJcbiAgICB2YXIgZG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxET00nKTtcclxuICAgIGRvYy5hc3luYyA9ICdmYWxzZSc7XHJcbiAgICBkb2MubG9hZFhNTCh0ZXh0KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcclxuICAgIHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L3htbCcpO1xyXG4gIH1cclxuICByZXR1cm4gZG9jO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5sb2FkU2FtcGxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGZvbGRlcnBhdGgpIHtcclxuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XHJcbiAgLy8gbG9hZCB4bWwgZG9jdW1lbnQgdXNlIGRlZmF1bHQgZm9sZGVyIHBhdGggaWYgaXQgaXMgbm90IHNwZWNpZmllZFxyXG4gIHZhciB4bWxPYmplY3QgPSB0aGlzLmxvYWRYTUxEb2MoKGZvbGRlcnBhdGggfHwgJ3NhbXBsZS1hcHAvc2FtcGxlcy8nKSArIGZpbGVuYW1lKTtcclxuICBcclxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhIHNhbXBsZSBpcyBiZWluZyBsb2FkZWRcclxuICAvLyBUcmlnZ2VyIGFuIGV2ZW50IGZvciB0aGlzIHB1cnBvc2UgYW5kIHNwZWNpZnkgdGhlICdmaWxlbmFtZScgYXMgYW4gZXZlbnQgcGFyYW1ldGVyXHJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlXCIsIFsgZmlsZW5hbWUgXSApOyAvL3NldEZpbGVDb250ZW50KGZpbGVuYW1lLnJlcGxhY2UoJ3htbCcsICdzYmdubWwnKSk7XHJcbiAgXHJcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICBzYmdudml6VXBkYXRlKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHhtbE9iamVjdCkpO1xyXG4gICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcclxuICB9LCAwKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTEZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gIFxyXG4gIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xyXG5cclxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBzYmdudml6VXBkYXRlKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHNlbGYudGV4dFRvWG1sT2JqZWN0KHRleHQpKSk7XHJcbiAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcclxuICAgIH0sIDApO1xyXG4gIH07XHJcblxyXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cclxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhbiBleHRlcm5hbCBmaWxlIGlzIGJlaW5nIGxvYWRlZFxyXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy9zZXRGaWxlQ29udGVudChmaWxlLm5hbWUpO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5zYXZlQXNTYmdubWwgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xyXG4gIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xyXG5cclxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xyXG4gICAgdHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTg7XCIsXHJcbiAgfSk7XHJcbiAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmlsZVV0aWxpdGllczsiLCIvKlxyXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBzYmdudml6IGdyYXBoc1xyXG4gKi9cclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbmZ1bmN0aW9uIGdyYXBoVXRpbGl0aWVzKCkge31cclxuXHJcbmdyYXBoVXRpbGl0aWVzLnNiZ252aXpVcGRhdGUgPSBmdW5jdGlvbihjeUdyYXBoKSB7XHJcbiAgY29uc29sZS5sb2coJ2N5IHVwZGF0ZSBjYWxsZWQnKTtcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpelVwZGF0ZVN0YXJ0XCIgKTtcclxuICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5yZXNldCgpO1xyXG4vLyAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XHJcbiAgfVxyXG5cclxuICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgLy8gY2xlYXIgZGF0YVxyXG4gIGN5LnJlbW92ZSgnKicpO1xyXG4gIGN5LmFkZChjeUdyYXBoKTtcclxuXHJcbiAgLy9hZGQgcG9zaXRpb24gaW5mb3JtYXRpb24gdG8gZGF0YSBmb3IgcHJlc2V0IGxheW91dFxyXG4gIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHhQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC54O1xyXG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC55O1xyXG4gICAgcG9zaXRpb25NYXBbY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmlkXSA9IHsneCc6IHhQb3MsICd5JzogeVBvc307XHJcbiAgfVxyXG5cclxuICBjeS5sYXlvdXQoe1xyXG4gICAgbmFtZTogJ3ByZXNldCcsXHJcbiAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwLFxyXG4gICAgZml0OiB0cnVlLFxyXG4gICAgcGFkZGluZzogNTBcclxuICB9KTtcclxuXHJcbiAgdGhpcy5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICBjeS5lbmRCYXRjaCgpO1xyXG5cclxuICAvLyBVcGRhdGUgdGhlIHN0eWxlXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAvLyBJbml0aWxpemUgdGhlIGJlbmQgcG9pbnRzIG9uY2UgdGhlIGVsZW1lbnRzIGFyZSBjcmVhdGVkXHJcbiAgY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5pbml0QmVuZFBvaW50cyhjeS5lZGdlcygpKTtcclxuICBcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpelVwZGF0ZUVuZFwiICk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XHJcbiAgLy9BcyBkZWZhdWx0IHVzZSB0aGUgY29tcG91bmQgcGFkZGluZyB2YWx1ZVxyXG4gIGlmICghcGFkZGluZ1BlcmNlbnQpIHtcclxuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcclxuICAgIHBhZGRpbmdQZXJjZW50ID0gdHlwZW9mIGNvbXBvdW5kUGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbXBvdW5kUGFkZGluZy5jYWxsKCkgOiBjb21wb3VuZFBhZGRpbmc7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciB0b3RhbCA9IDA7XHJcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcclxuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUud2lkdGgoKSk7XHJcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcclxuICAgICAgbnVtT2ZTaW1wbGVzKys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgY2FsY19wYWRkaW5nID0gKHBhZGRpbmdQZXJjZW50IC8gMTAwKSAqIE1hdGguZmxvb3IodG90YWwgLyAoMiAqIG51bU9mU2ltcGxlcykpO1xyXG4gIGlmIChjYWxjX3BhZGRpbmcgPCA1KSB7XHJcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBjYWxjX3BhZGRpbmcgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICB2YXIgY29tcG91bmRzID0gbm9kZXMuZmlsdGVyKCckbm9kZSA+IG5vZGUnKTtcclxuICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgY29tcG91bmRzLmNzcygncGFkZGluZy1sZWZ0JywgY2FsY19wYWRkaW5nKTtcclxuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLXJpZ2h0JywgY2FsY19wYWRkaW5nKTtcclxuICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLXRvcCcsIGNhbGNfcGFkZGluZyk7XHJcbiAgY29tcG91bmRzLmNzcygncGFkZGluZy1ib3R0b20nLCBjYWxjX3BhZGRpbmcpO1xyXG4gIGN5LmVuZEJhdGNoKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBoVXRpbGl0aWVzOyIsInZhciBqc29uVG9TYmdubWwgPSB7XHJcbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c2JnbiB4bWxucz0naHR0cDovL3NiZ24ub3JnL2xpYnNiZ24vMC4yJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG1hcCBsYW5ndWFnZT0ncHJvY2VzcyBkZXNjcmlwdGlvbic+XFxuXCI7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGdseXBoIHNiZ25tbFxyXG4gICAgICAgIGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5pc0NoaWxkKCkpXHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGFyYyBzYmdubWxcclxuICAgICAgICBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEFyY1NiZ25tbCh0aGlzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvbWFwPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L3NiZ24+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRHbHlwaFNiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJjb21wYXJ0bWVudFwiKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmlkICsgXCInIGNsYXNzPSdjb21wYXJ0bWVudCcgXCI7XHJcblxyXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5wYXJlbnQgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiA+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJzdWJtYXBcIil7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgKyBcIicgXCI7XHJcblxyXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgICAgICBpZihwYXJlbnQuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7Ly9pdCBpcyBhIHNpbXBsZSBub2RlXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgKyBcIidcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDb21tb25HbHlwaFByb3BlcnRpZXMgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGxhYmVsIGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZExhYmVsKG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIGJib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkR2x5cGhCYm94KG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIGNsb25lIGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZENsb25lKG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIHBvcnQgaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkUG9ydChub2RlKTtcclxuICAgICAgICAvL2FkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuZ2V0U3RhdGVBbmRJbmZvU2Jnbm1sKG5vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQ2xvbmUgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxjbG9uZS8+XFxuXCI7XHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0YXRlQW5kSW5mb1NiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3MubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIGJveEdseXBoID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zW2ldO1xyXG4gICAgICAgICAgICBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJzdGF0ZSB2YXJpYWJsZVwiKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkSW5mb0JveEdseXBoKGJveEdseXBoLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0QXJjU2Jnbm1sIDogZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXHJcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xyXG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgYXJjSWQgPSBhcmNTb3VyY2UgKyBcIi1cIiArIGFyY1RhcmdldDtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxhcmMgaWQ9J1wiICsgYXJjSWQgK1xyXG4gICAgICAgICAgICBcIicgdGFyZ2V0PSdcIiArIGFyY1RhcmdldCArXHJcbiAgICAgICAgICAgIFwiJyBzb3VyY2U9J1wiICsgYXJjU291cmNlICsgXCInIGNsYXNzPSdcIiArXHJcbiAgICAgICAgICAgIGVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyArIFwiJz5cXG5cIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzdGFydCB5PSdcIiArIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRZICsgXCInIHg9J1wiICtcclxuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFggKyBcIicvPlxcblwiO1xyXG5cclxuICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgIGlmKHNlZ3B0cyl7XHJcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBzZWdwdHMgJiYgaSA8IHNlZ3B0cy5sZW5ndGg7IGkgPSBpICsgMil7XHJcbiAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcclxuICAgICAgICAgICAgdmFyIGJlbmRZID0gc2VncHRzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8bmV4dCB5PSdcIiArIGJlbmRZICsgXCInIHg9J1wiICsgYmVuZFggKyBcIicvPlxcblwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxlbmQgeT0nXCIgKyBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFkgKyBcIicgeD0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFggKyBcIicvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9hcmM+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRHbHlwaEJib3ggOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggLSB3aWR0aC8yO1xyXG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XHJcbiAgICAgICAgcmV0dXJuIFwiPGJib3ggeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArXHJcbiAgICAgICAgICAgIFwiJyB3PSdcIiArIHdpZHRoICsgXCInIGg9J1wiICsgaGVpZ2h0ICsgXCInIC8+XFxuXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQW5kSW5mb0Jib3ggOiBmdW5jdGlvbihub2RlLCBib3hHbHlwaCl7XHJcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XHJcblxyXG4gICAgICAgIHZhciB4ID0gYm94QmJveC54IC8gMTAwICogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArICh4IC0gYm94QmJveC53LzIpO1xyXG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcclxuICAgICAgICByZXR1cm4gXCI8YmJveCB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICtcclxuICAgICAgICAgICAgXCInIHc9J1wiICsgYm94QmJveC53ICsgXCInIGg9J1wiICsgYm94QmJveC5oICsgXCInIC8+XFxuXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFBvcnQgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHBvcnRzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgcG9ydHNbaV0ueCAqIG5vZGUud2lkdGgoKSAvIDEwMDtcclxuICAgICAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyBwb3J0c1tpXS55ICogbm9kZS5oZWlnaHQoKSAvIDEwMDtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8cG9ydCBpZD0nXCIgKyBwb3J0c1tpXS5pZCArXHJcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkTGFiZWwgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBsYWJlbCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIHRleHQ9J1wiICsgbGFiZWwgKyBcIicgLz5cXG5cIjtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVCb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuaWQgKyBcIicgY2xhc3M9J3N0YXRlIHZhcmlhYmxlJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHN0YXRlIFwiO1xyXG5cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YWx1ZSAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInZhbHVlPSdcIiArIG5vZGUuc3RhdGUudmFsdWUgKyBcIicgXCI7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YXJpYWJsZT0nXCIgKyBub2RlLnN0YXRlLnZhcmlhYmxlICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgbWFpbkdseXBoKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5pZCArIFwiJyBjbGFzcz0ndW5pdCBvZiBpbmZvcm1hdGlvbic+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxsYWJlbCBcIjtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUubGFiZWwudGV4dCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInRleHQ9J1wiICsgbm9kZS5sYWJlbC50ZXh0ICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvblRvU2Jnbm1sO1xyXG4iLCIvKlxyXG4gKiBMaXN0ZW4gZG9jdW1lbnQgZm9yIGtleWJvYXJkIGlucHV0cyBhbmQgZXhwb3J0cyB0aGUgdXRpbGl0aWVzIHRoYXQgaXQgbWFrZXMgdXNlIG9mXHJcbiAqL1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMgPSB7XHJcbiAgaXNOdW1iZXJLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiAoIGUua2V5Q29kZSA+PSA0OCAmJiBlLmtleUNvZGUgPD0gNTcgKSB8fCAoIGUua2V5Q29kZSA+PSA5NiAmJiBlLmtleUNvZGUgPD0gMTA1ICk7XHJcbiAgfSxcclxuICBpc0RvdEtleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTkwO1xyXG4gIH0sXHJcbiAgaXNNaW51c1NpZ25LZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEwOSB8fCBlLmtleUNvZGUgPT09IDE4OTtcclxuICB9LFxyXG4gIGlzTGVmdEtleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzc7XHJcbiAgfSxcclxuICBpc1JpZ2h0S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzOTtcclxuICB9LFxyXG4gIGlzQmFja3NwYWNlS2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSA4O1xyXG4gIH0sXHJcbiAgaXNFbnRlcktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTM7XHJcbiAgfSxcclxuICBpc0ludGVnZXJGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNDdHJsT3JDb21tYW5kUHJlc3NlZChlKSB8fCB0aGlzLmlzTWludXNTaWduS2V5KGUpIHx8IHRoaXMuaXNOdW1iZXJLZXkoZSkgXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNCYWNrc3BhY2VLZXkoZSkgfHwgdGhpcy5pc0xlZnRLZXkoZSkgfHwgdGhpcy5pc1JpZ2h0S2V5KGUpIHx8IHRoaXMuaXNFbnRlcktleShlKTtcclxuICB9LFxyXG4gIGlzRmxvYXRGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSkgfHwgdGhpcy5pc0RvdEtleShlKTtcclxuICB9LFxyXG4gIGlzQ3RybE9yQ29tbWFuZFByZXNzZWQ6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xyXG4gIH1cclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuaW50ZWdlci1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xyXG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XHJcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0Zsb2F0RmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuaW50ZWdlci1pbnB1dCwuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcclxuICAgIHZhciBtaW4gICA9ICQodGhpcykuYXR0cignbWluJyk7XHJcbiAgICB2YXIgbWF4ICAgPSAkKHRoaXMpLmF0dHIoJ21heCcpO1xyXG4gICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKTtcclxuICAgIFxyXG4gICAgaWYobWluICE9IG51bGwpIHtcclxuICAgICAgbWluID0gcGFyc2VGbG9hdChtaW4pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICBtYXggPSBwYXJzZUZsb2F0KG1heCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKG1pbiAhPSBudWxsICYmIHZhbHVlIDwgbWluKSB7XHJcbiAgICAgIHZhbHVlID0gbWluO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihtYXggIT0gbnVsbCAmJiB2YWx1ZSA+IG1heCkge1xyXG4gICAgICB2YWx1ZSA9IG1heDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgIGlmKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtaW47XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICAgIHZhbHVlID0gbWF4O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkKHRoaXMpLnZhbChcIlwiICsgdmFsdWUpO1xyXG4gIH0pO1xyXG4gIFxyXG4gICQoZG9jdW1lbnQpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7IC8vIExpc3RlbiB1bmRvIHJlZG8gc2hvcnRjdXRzIGlmICd1bmRvYWJsZSdcclxuICAgICAgaWYgKGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNDdHJsT3JDb21tYW5kUHJlc3NlZChlKSAmJiBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDkwKSB7IC8vIGN0cmwgKyB6XHJcbiAgICAgICAgICBjeS51bmRvUmVkbygpLnVuZG8oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODkpIHsgLy8gY3RybCArIHlcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkucmVkbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRJbnB1dFV0aWxpdGllczsiLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllcztcclxuXHJcbiIsIi8qIFxyXG4gKiBUaGVzZSBhcmUgdGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGRpcmVjdGx5IHV0aWxpemVkIGJ5IHRoZSB1c2VyIGludGVyYWN0aW9ucy5cclxuICogSWRlYWx5LCB0aGlzIGZpbGUgaXMganVzdCByZXF1aXJlZCBieSBpbmRleC5qc1xyXG4gKi9cclxuXHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcclxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG4vLyBIZWxwZXJzIHN0YXJ0XHJcbmZ1bmN0aW9uIGJlZm9yZVBlcmZvcm1MYXlvdXQoKSB7XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xyXG5cclxuICBub2Rlcy5yZW1vdmVEYXRhKFwicG9ydHNcIik7XHJcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnRzb3VyY2VcIik7XHJcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnR0YXJnZXRcIik7XHJcblxyXG4gIG5vZGVzLmRhdGEoXCJwb3J0c1wiLCBbXSk7XHJcbiAgZWRnZXMuZGF0YShcInBvcnRzb3VyY2VcIiwgW10pO1xyXG4gIGVkZ2VzLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIFtdKTtcclxuXHJcbiAgLy8gVE9ETyBkbyB0aGlzIGJ5IHVzaW5nIGV4dGVuc2lvbiBBUElcclxuICBjeS4kKCcuZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcclxuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XHJcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XHJcbn07XHJcbi8vIEhlbHBlcnMgZW5kXHJcblxyXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge31cclxuXHJcbm1haW5VdGlsaXRpZXMuZXhwYW5kTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xyXG4gIHZhciBub2Rlc1RvRXhwYW5kID0gbm9kZXMuZmlsdGVyKFwiW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XHJcbiAgaWYgKG5vZGVzVG9FeHBhbmQuZXhwYW5kYWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1RvRXhwYW5kLFxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMuZXhwYW5kKCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5jb2xsYXBzZU5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcclxuICBpZiAobm9kZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMuY29sbGFwc2UoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQ29tcGxleGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGNvbXBsZXhlcyA9IGN5Lm5vZGVzKFwiW2NsYXNzPSdjb21wbGV4J11cIik7XHJcbiAgaWYgKGNvbXBsZXhlcy5jb2xsYXBzaWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IGNvbXBsZXhlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY29tcGxleGVzLmNvbGxhcHNlUmVjdXJzaXZlbHkoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmZpbHRlcihcIltjbGFzcz0nY29tcGxleCddW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XHJcbiAgaWYgKG5vZGVzLmV4cGFuZGFibGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIG5vZGVzLmV4cGFuZFJlY3Vyc2l2ZWx5KCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5jb2xsYXBzZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xyXG4gIGlmIChub2Rlcy5jb2xsYXBzaWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5jb2xsYXBzZVJlY3Vyc2l2ZWx5KCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5leHBhbmRBbGwgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKS5maWx0ZXIoXCJbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKTtcclxuICBpZiAobm9kZXMuZXhwYW5kYWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMuZXhwYW5kUmVjdXJzaXZlbHkoKTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmhpZGVFbGVzID0gZnVuY3Rpb24oZWxlcykge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlkZVwiLCBlbGVzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLmhpZGVFbGVzKCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5zaG93RWxlcyA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBlbGVzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLnNob3dFbGVzKCk7XHJcbiAgfVxyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5zaG93QWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKGN5LmVsZW1lbnRzKCkubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoKSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kuZWxlbWVudHMoKS5zaG93RWxlcygpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZSA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xyXG4gICAgICBlbGVzOiBlbGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLnJlbW92ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NtYXJ0ID0gZnVuY3Rpb24oZWxlcykge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU21hcnRcIiwge1xyXG4gICAgICBmaXJzdFRpbWU6IHRydWUsXHJcbiAgICAgIGVsZXM6IGVsZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NtYXJ0KGVsZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0TmVpZ2hib3VycyA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZFbGVzKGVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcclxuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuc2VhcmNoQnlMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XHJcbiAgaWYgKGxhYmVsLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBub2Rlc1RvSGlnaGxpZ2h0ID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgaWYgKGVsZS5kYXRhKFwibGFiZWxcIikgJiYgZWxlLmRhdGEoXCJsYWJlbFwiKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobGFiZWwpID49IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChub2Rlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBub2Rlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlc1RvSGlnaGxpZ2h0KTtcclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oZWxlcykge1xyXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KGVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcclxuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xyXG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlc1RvSGlnaGxpZ2h0LmhpZ2hsaWdodCgpO1xyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LnJlbW92ZUhpZ2hsaWdodHMoKVxyXG4gIH1cclxufTtcclxuXHJcbm1haW5VdGlsaXRpZXMucGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dE9wdGlvbnMsIG5vdFVuZG9hYmxlKSB7XHJcbiAgLy8gVGhpbmdzIHRvIGRvIGJlZm9yZSBwZXJmb3JtaW5nIGxheW91dFxyXG4gIGJlZm9yZVBlcmZvcm1MYXlvdXQoKTtcclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUgfHwgbm90VW5kb2FibGUpIHsgLy8gJ25vdFVuZG9hYmxlJyBmbGFnIGNhbiBiZSB1c2VkIHRvIGhhdmUgY29tcG9zaXRlIGFjdGlvbnMgaW4gdW5kby9yZWRvIHN0YWNrXHJcbiAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XHJcbiAgICAgIG9wdGlvbnM6IGxheW91dE9wdGlvbnMsXHJcbiAgICAgIGVsZXM6IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVNiZ25tbCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcbn07XHJcblxyXG5tYWluVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUb0pzb24gPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xyXG59O1xyXG5cclxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgbG9jYXRlZCBcclxuICAvLyBpbiBub2RlX21vZHVsZXMgdXNpbmcgZGVmYXVsdCBvcHRpb24gaXMgZW5vdWdoXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZVxyXG59O1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICB9XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHtcclxuICBpbnNlcnRlZE5vZGVzOiB7fSxcclxuICBnZXRBbGxDb21wYXJ0bWVudHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcclxuXHJcbiAgICB2YXIgY29tcGFydG1lbnRFbHMgPSB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbChcImdseXBoW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRFbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNvbXBhcnRtZW50ID0gY29tcGFydG1lbnRFbHNbaV07XHJcbiAgICAgIHZhciBiYm94ID0gdGhpcy5maW5kQ2hpbGROb2RlKGNvbXBhcnRtZW50LCAnYmJveCcpO1xyXG4gICAgICBjb21wYXJ0bWVudHMucHVzaCh7XHJcbiAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCd4JykpLFxyXG4gICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94LmdldEF0dHJpYnV0ZSgneScpKSxcclxuICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKSksXHJcbiAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCdoJykpLFxyXG4gICAgICAgICdpZCc6IGNvbXBhcnRtZW50LmdldEF0dHJpYnV0ZSgnaWQnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJ0bWVudHMuc29ydChmdW5jdGlvbiAoYzEsIGMyKSB7XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA8IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA+IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY29tcGFydG1lbnRzO1xyXG4gIH0sXHJcbiAgaXNJbkJvdW5kaW5nQm94OiBmdW5jdGlvbiAoYmJveDEsIGJib3gyKSB7XHJcbiAgICBpZiAoYmJveDEueCA+IGJib3gyLnggJiZcclxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxyXG4gICAgICAgIGJib3gxLnggKyBiYm94MS53IDwgYmJveDIueCArIGJib3gyLncgJiZcclxuICAgICAgICBiYm94MS55ICsgYmJveDEuaCA8IGJib3gyLnkgKyBiYm94Mi5oKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgYmJveFByb3A6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBiYm94ID0ge307XHJcbiAgICB2YXIgYmJveCA9IGVsZS5xdWVyeVNlbGVjdG9yKCdiYm94Jyk7XHJcblxyXG4gICAgYmJveC54ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3gnKTtcclxuICAgIGJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XHJcbiAgICBiYm94LncgPSBiYm94LmdldEF0dHJpYnV0ZSgndycpO1xyXG4gICAgYmJveC5oID0gYmJveC5nZXRBdHRyaWJ1dGUoJ2gnKTtcclxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyO1xyXG4gICAgYmJveC55ID0gcGFyc2VGbG9hdChiYm94LnkpICsgcGFyc2VGbG9hdChiYm94LmgpIC8gMjtcclxuXHJcbiAgICByZXR1cm4gYmJveDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XHJcbiAgICB2YXIgeFBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC54KTtcclxuICAgIHZhciB5UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LnkpO1xyXG5cclxuICAgIHZhciBiYm94ID0ge307XHJcbiAgICB2YXIgYmJveCA9IGVsZS5xdWVyeVNlbGVjdG9yKCdiYm94Jyk7XHJcblxyXG4gICAgYmJveC54ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3gnKTtcclxuICAgIGJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XHJcbiAgICBiYm94LncgPSBiYm94LmdldEF0dHJpYnV0ZSgndycpO1xyXG4gICAgYmJveC5oID0gYmJveC5nZXRBdHRyaWJ1dGUoJ2gnKTtcclxuXHJcbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMiAtIHhQb3M7XHJcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyIC0geVBvcztcclxuXHJcbiAgICBiYm94LnggPSBiYm94LnggLyBwYXJzZUZsb2F0KHBhcmVudEJib3gudykgKiAxMDA7XHJcbiAgICBiYm94LnkgPSBiYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XHJcblxyXG4gICAgcmV0dXJuIGJib3g7XHJcbiAgfSxcclxuICBmaW5kQ2hpbGROb2RlczogZnVuY3Rpb24gKGVsZSwgY2hpbGRUYWdOYW1lKSB7XHJcbiAgICAvLyBmaW5kIGNoaWxkIG5vZGVzIGF0IGRlcHRoIGxldmVsIG9mIDEgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnRcclxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2hpbGQgPSBlbGUuY2hpbGROb2Rlc1tpXTtcclxuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxICYmIGNoaWxkLnRhZ05hbWUgPT09IGNoaWxkVGFnTmFtZSkge1xyXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSxcclxuICBmaW5kQ2hpbGROb2RlOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcclxuICAgIHZhciBub2RlcyA9IHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCBjaGlsZFRhZ05hbWUpO1xyXG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aCA+IDAgPyBub2Rlc1swXSA6IHVuZGVmaW5lZDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb1Byb3A6IGZ1bmN0aW9uIChlbGUsIHBhcmVudEJib3gpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IFtdO1xyXG5cclxuICAgIHZhciBjaGlsZEdseXBocyA9IHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkR2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBnbHlwaCA9IGNoaWxkR2x5cGhzW2ldO1xyXG4gICAgICB2YXIgaW5mbyA9IHt9O1xyXG5cclxuICAgICAgaWYgKGdseXBoLmNsYXNzTmFtZSA9PT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XHJcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzTmFtZSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gZ2x5cGgucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcclxuICAgICAgICBpbmZvLmxhYmVsID0ge1xyXG4gICAgICAgICAgJ3RleHQnOiAobGFiZWwgJiYgbGFiZWwuZ2V0QXR0cmlidXRlKCd0ZXh0JykpIHx8IHVuZGVmaW5lZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChpbmZvKTtcclxuICAgICAgfSBlbHNlIGlmIChnbHlwaC5jbGFzc05hbWUgPT09ICdzdGF0ZSB2YXJpYWJsZScpIHtcclxuICAgICAgICBpbmZvLmlkID0gZ2x5cGguZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLmNsYXp6ID0gZ2x5cGguY2xhc3NOYW1lIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc3RhdGUgPSBnbHlwaC5xdWVyeVNlbGVjdG9yKCdzdGF0ZScpO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IChzdGF0ZSAmJiBzdGF0ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgdmFyaWFibGUgPSAoc3RhdGUgJiYgc3RhdGUuZ2V0QXR0cmlidXRlKCd2YXJpYWJsZScpKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaW5mby5zdGF0ZSA9IHtcclxuICAgICAgICAgICd2YWx1ZSc6IHZhbHVlLFxyXG4gICAgICAgICAgJ3ZhcmlhYmxlJzogdmFyaWFibGVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHN0YXRlQW5kSW5mb0FycmF5O1xyXG4gIH0sXHJcbiAgYWRkUGFyZW50SW5mb1RvTm9kZTogZnVuY3Rpb24gKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjb21wYXJ0bWVudFJlZiA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2NvbXBhcnRtZW50UmVmJyk7XHJcblxyXG4gICAgaWYgKHBhcmVudCkge1xyXG4gICAgICBub2RlT2JqLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb21wYXJ0bWVudFJlZikge1xyXG4gICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50UmVmO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSAnJztcclxuXHJcbiAgICAgIC8vIGFkZCBjb21wYXJ0bWVudCBhY2NvcmRpbmcgdG8gZ2VvbWV0cnlcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJ0bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYmJveEVsID0gc2VsZi5maW5kQ2hpbGROb2RlKGVsZSwgJ2Jib3gnKTtcclxuICAgICAgICB2YXIgYmJveCA9IHtcclxuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCd4JykpLFxyXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ3knKSksXHJcbiAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveEVsLmdldEF0dHJpYnV0ZSgndycpKSxcclxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCdoJykpLFxyXG4gICAgICAgICAgJ2lkJzogZWxlLmdldEF0dHJpYnV0ZSgnaWQnKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcclxuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBub2RlT2JqID0ge307XHJcblxyXG4gICAgLy8gYWRkIGlkIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmlkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIC8vIGFkZCBub2RlIGJvdW5kaW5nIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5iYm94ID0gc2VsZi5iYm94UHJvcChlbGUpO1xyXG4gICAgLy8gYWRkIGNsYXNzIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmNsYXNzID0gZWxlLmNsYXNzTmFtZTtcclxuICAgIC8vIGFkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgdmFyIGxhYmVsID0gc2VsZi5maW5kQ2hpbGROb2RlKGVsZSwgJ2xhYmVsJyk7XHJcbiAgICBub2RlT2JqLmxhYmVsID0gKGxhYmVsICYmIGxhYmVsLmdldEF0dHJpYnV0ZSgndGV4dCcpKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAvLyBhZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLnN0YXRlc2FuZGluZm9zID0gc2VsZi5zdGF0ZUFuZEluZm9Qcm9wKGVsZSwgbm9kZU9iai5iYm94KTtcclxuICAgIC8vIGFkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cclxuICAgIHNlbGYuYWRkUGFyZW50SW5mb1RvTm9kZShlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAvLyBhZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgIHZhciBjbG9uZU1hcmtlcnMgPSBzZWxmLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2Nsb25lJyk7XHJcbiAgICBpZiAoY2xvbmVNYXJrZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlT2JqLmNsb25lbWFya2VyID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBwb3J0IGluZm9ybWF0aW9uXHJcbiAgICB2YXIgcG9ydHMgPSBbXTtcclxuICAgIHZhciBwb3J0RWxlbWVudHMgPSBlbGUucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0RWwgPSBwb3J0RWxlbWVudHNbaV07XHJcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC5nZXRBdHRyaWJ1dGUoJ3gnKSkgLSBub2RlT2JqLmJib3gueDtcclxuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLmdldEF0dHJpYnV0ZSgneScpKSAtIG5vZGVPYmouYmJveC55O1xyXG5cclxuICAgICAgcmVsYXRpdmVYUG9zID0gcmVsYXRpdmVYUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiAxMDA7XHJcbiAgICAgIHJlbGF0aXZlWVBvcyA9IHJlbGF0aXZlWVBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogMTAwO1xyXG5cclxuICAgICAgcG9ydHMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcclxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGUgPSB7ZGF0YTogbm9kZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc05vZGUpO1xyXG4gIH0sXHJcbiAgdHJhdmVyc2VOb2RlczogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIGVsSWQgPSBlbGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NOYW1lXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy8gYWRkIGNvbXBsZXggbm9kZXMgaGVyZVxyXG5cclxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc05hbWU7XHJcblxyXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdzdWJtYXAnKSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgICB2YXIgY2hpbGRHbHlwaHMgPSBzZWxmLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2dseXBoJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcclxuICAgICAgICB2YXIgZ2x5cGhDbGFzcyA9IGdseXBoLmNsYXNzTmFtZTtcclxuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwganNvbkFycmF5LCBlbElkLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFBvcnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcclxuICB9LFxyXG4gIGdldEdseXBoczogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xyXG5cclxuICAgIGlmICghZ2x5cGhzKSB7XHJcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XHJcblxyXG4gICAgICB2YXIgaWQyZ2x5cGggPSB4bWxPYmplY3QuX2lkMmdseXBoID0ge307XHJcblxyXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIGcgPSBnbHlwaHNbaV07XHJcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblxyXG4gICAgICAgIGlkMmdseXBoWyBpZCBdID0gZztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnbHlwaHM7XHJcbiAgfSxcclxuICBnZXRHbHlwaEJ5SWQ6IGZ1bmN0aW9uICh4bWxPYmplY3QsIGlkKSB7XHJcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcclxuXHJcbiAgICByZXR1cm4geG1sT2JqZWN0Ll9pZDJnbHlwaFtpZF07XHJcbiAgfSxcclxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xyXG4gICAgLy8gc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcclxuICAgIHZhciBzb3VyY2UgPSBhcmMuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcclxuICAgIHZhciB0YXJnZXQgPSBhcmMuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcclxuICAgIHZhciBzb3VyY2VOb2RlSWQ7XHJcbiAgICB2YXIgdGFyZ2V0Tm9kZUlkO1xyXG5cclxuICAgIHZhciBzb3VyY2VFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHNvdXJjZSk7XHJcbiAgICB2YXIgdGFyZ2V0RXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCB0YXJnZXQpO1xyXG5cclxuICAgIGlmIChzb3VyY2VFeGlzdHMpIHtcclxuICAgICAgc291cmNlTm9kZUlkID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRFeGlzdHMpIHtcclxuICAgICAgdGFyZ2V0Tm9kZUlkID0gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgaTtcclxuICAgIHZhciBwb3J0RWxzID0gdGhpcy5nZXRQb3J0cyh4bWxPYmplY3QpO1xyXG4gICAgdmFyIHBvcnQ7XHJcbiAgICBpZiAoc291cmNlTm9kZUlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XHJcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBzb3VyY2UpIHtcclxuICAgICAgICAgIHNvdXJjZU5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldE5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XHJcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgIHRhcmdldE5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsnc291cmNlJzogc291cmNlTm9kZUlkLCAndGFyZ2V0JzogdGFyZ2V0Tm9kZUlkfTtcclxuICB9LFxyXG5cclxuICBnZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnM6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBbXTtcclxuXHJcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ25leHQnKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3NYID0gY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd4Jyk7XHJcbiAgICAgIHZhciBwb3NZID0gY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd5Jyk7XHJcblxyXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgeDogcG9zWCxcclxuICAgICAgICB5OiBwb3NZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XHJcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc05hbWVdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xyXG5cclxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlZGdlT2JqID0ge307XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcclxuXHJcbiAgICBlZGdlT2JqLmlkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XHJcbiAgICBlZGdlT2JqLmNsYXNzID0gZWxlLmNsYXNzTmFtZTtcclxuICAgIGVkZ2VPYmouYmVuZFBvaW50UG9zaXRpb25zID0gYmVuZFBvaW50UG9zaXRpb25zO1xyXG5cclxuICAgIHZhciBnbHlwaENoaWxkcmVuID0gc2VsZi5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xyXG4gICAgdmFyIGdseXBoRGVzY2VuZGVudHMgPSBlbGUucXVlcnlTZWxlY3RvckFsbCgnZ2x5cGgnKTtcclxuICAgIGlmIChnbHlwaERlc2NlbmRlbnRzLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgIGVkZ2VPYmouY2FyZGluYWxpdHkgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbHlwaENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGdseXBoQ2hpbGRyZW5baV0uY2xhc3NOYW1lID09PSAnY2FyZGluYWxpdHknKSB7XHJcbiAgICAgICAgICB2YXIgbGFiZWwgPSBnbHlwaENoaWxkcmVuW2ldLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XHJcbiAgICAgICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gbGFiZWwuZ2V0QXR0cmlidXRlKCd0ZXh0JykgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkZ2VPYmouc291cmNlID0gc291cmNlQW5kVGFyZ2V0LnNvdXJjZTtcclxuICAgIGVkZ2VPYmoudGFyZ2V0ID0gc291cmNlQW5kVGFyZ2V0LnRhcmdldDtcclxuXHJcbiAgICBlZGdlT2JqLnBvcnRzb3VyY2UgPSBlbGUuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcclxuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2UgPSB7ZGF0YTogZWRnZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xyXG4gIH0sXHJcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZXMgPSBbXTtcclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XHJcblxyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IHNlbGYuZ2V0QWxsQ29tcGFydG1lbnRzKHhtbE9iamVjdCk7XHJcblxyXG4gICAgdmFyIGdseXBocyA9IHNlbGYuZmluZENoaWxkTm9kZXMoeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJ21hcCcpLCAnZ2x5cGgnKTtcclxuICAgIHZhciBhcmNzID0gc2VsZi5maW5kQ2hpbGROb2Rlcyh4bWxPYmplY3QucXVlcnlTZWxlY3RvcignbWFwJyksICdhcmMnKTtcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGdseXBoID0gZ2x5cGhzW2ldO1xyXG4gICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGN5dG9zY2FwZUpzTm9kZXMsICcnLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBhcmMgPSBhcmNzW2ldO1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZShhcmMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcclxuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5lZGdlcyA9IGN5dG9zY2FwZUpzRWRnZXM7XHJcblxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XHJcblxyXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XHJcbiIsIi8qXHJcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xyXG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XHJcbiAgdHJ1bmNhdGVUZXh0OiBmdW5jdGlvbiAodGV4dFByb3AsIGZvbnQpIHtcclxuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY29udGV4dC5mb250ID0gZm9udDtcclxuICAgIFxyXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBcclxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcclxuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcclxuICAgIGlmIChmaXRMYWJlbHNUb05vZGVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHdpZHRoO1xyXG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xyXG4gICAgdmFyIHRleHRXaWR0aCA9ICh0ZXh0UHJvcC53aWR0aCA+IDMwKSA/IHRleHRQcm9wLndpZHRoIC0gMTAgOiB0ZXh0UHJvcC53aWR0aDtcclxuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xyXG4gICAgICAtLWxlbjtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGxlbikgKyBlbGxpcHNpcztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGV4dFV0aWxpdGllczsiLCIvKlxyXG4gKiBDb21tb25seSBuZWVkZWQgVUkgVXRpbGl0aWVzXHJcbiAqL1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIHVpVXRpbGl0aWVzID0ge1xyXG4gIHN0YXJ0U3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG4gICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS53aWR0aCgpO1xyXG4gICAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcikuaGVpZ2h0KCk7XHJcbiAgICAgICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IgKyAnOnBhcmVudCcpLnByZXBlbmQoJzxpIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OTk5OyBsZWZ0OiAnICsgY29udGFpbmVyV2lkdGggLyAyICsgJ3B4OyB0b3A6ICcgKyBjb250YWluZXJIZWlnaHQgLyAyICsgJ3B4O1wiIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTN4IGZhLWZ3ICcgKyBjbGFzc05hbWUgKyAnXCI+PC9pPicpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW5kU3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG4gICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCgnLicgKyBjbGFzc05hbWUpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdWlVdGlsaXRpZXM7XHJcblxyXG5cclxuIiwiLypcclxuICogVGhpcyBmaWxlIGV4cG9ydHMgdGhlIGZ1bmN0aW9ucyB0byBiZSB1dGlsaXplZCBpbiB1bmRvcmVkbyBleHRlbnNpb24gYWN0aW9ucyBcclxuICovXHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xyXG4gIC8vIFNlY3Rpb24gU3RhcnRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XHJcbiAgfSxcclxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgIHZhciBwYXJhbSA9IHt9O1xyXG4gICAgcGFyYW0uZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7XHJcbiAgICByZXR1cm4gcGFyYW07XHJcbiAgfSxcclxuICBkZWxldGVFbGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU21hcnQocGFyYW0uZWxlcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgLy8gU2VjdGlvbiBFbmRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19

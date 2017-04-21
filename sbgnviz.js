(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "name": "sbgnviz",
  "version": "3.1.0",
  "description": "SBGNPD visualization library",
  "main": "src/index.js",
  "licence": "LGPL-3.0",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build-sbgnviz-js": "gulp build",
    "debug-js": "nodemon -e js --watch src -x \"npm run build-sbgnviz-js\""
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/iVis-at-Bilkent/sbgnviz.js.git"
  },
  "bugs": {
    "url": "https://github.com/iVis-at-Bilkent/sbgnviz.js/issues"
  },
  "homepage": "https://github.com/iVis-at-Bilkent/sbgnviz.js/",
  "peer-dependencies": {
    "jquery": "^2.2.4",
    "filesaverjs": "~0.2.2",
    "cytoscape": "iVis-at-Bilkent/cytoscape.js#unstable"
  },
  "devDependencies": {
    "browserify": "^11.2.0",
    "gulp": "^3.9.0",
    "gulp-derequire": "^2.1.0",
    "gulp-jshint": "^1.11.2",
    "gulp-prompt": "^0.1.2",
    "gulp-replace": "^0.5.4",
    "gulp-shell": "^0.5.0",
    "gulp-util": "^3.0.6",
    "jshint-stylish": "^2.0.1",
    "node-notifier": "^4.3.1",
    "run-sequence": "^1.1.4",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0"
  }
}

},{}],2:[function(_dereq_,module,exports){
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
},{"./sbgn-extensions/sbgn-cy-instance":3,"./sbgn-extensions/sbgn-cy-renderer":4,"./utilities/element-utilities":5,"./utilities/file-utilities":6,"./utilities/graph-utilities":7,"./utilities/keyboard-input-utilities":9,"./utilities/lib-utilities":10,"./utilities/main-utilities":11,"./utilities/option-utilities":12,"./utilities/ui-utilities":15,"./utilities/undo-redo-action-functions":16}],3:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('../utilities/element-utilities');
var graphUtilities = _dereq_('../utilities/graph-utilities');
var undoRedoActionFunctions = _dereq_('../utilities/undo-redo-action-functions');
var refreshPaddings = graphUtilities.refreshPaddings.bind(graphUtilities);

var libs = _dereq_('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

var optionUtilities = _dereq_('../utilities/option-utilities');
var options = optionUtilities.getOptions();

var getCompoundPaddings = function() {
  // Return calculated paddings in case of that data is invalid return 5
  return graphUtilities.calculatedPaddings || 5;
};

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
    ur.action("deleteNodesSmart", undoRedoActionFunctions.deleteNodesSmart, undoRedoActionFunctions.restoreEles);
  }
  
  function bindCyEvents() {
    cy.on('tapend', 'node', function (event) {
      cy.style().update();
    });
    
    cy.on("expandcollapse.beforecollapse", "node", function (event) {
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

    cy.on("expandcollapse.beforeexpand", "node", function (event) {
      var node = this;
      node.removeData("infoLabel");
    });

    cy.on("expandcollapse.afterexpand", "node", function (event) {
      var node = this;
      cy.nodes().updateCompoundBounds();
      //Don't show children info when the complex node is expanded
      if (node._private.data.class == "complex") {
        node.removeStyle('content');
      }
    });
  }

  var sbgnStyleSheet = cytoscape.stylesheet()
          .selector("node")
          .css({
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1.25,
            'border-color': '#555',
            'background-color': '#ffffff',
            'background-opacity': 0.5,
            'text-opacity': 1,
            'opacity': 1,
            'padding': 0
          })
          .selector("node:parent")
          .css({
            'padding': getCompoundPaddings
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
            },
            'content': function (ele) {
              return elementUtilities.getElementContent(ele);
            },
            'font-size': function (ele) {
              return elementUtilities.getLabelTextSize(ele);
            },
          })
          .selector("node[class='perturbing agent']")
          .css({
            'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
          })
          .selector("node[class='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[class='complex']")
          .css({
            'text-valign': 'bottom',
            'text-halign': 'center',
          })
          .selector("node[class='compartment']")
          .css({
            'border-width': 3.25,
            'background-opacity': 0,
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y' : -1 * options.extraCompartmentPadding
          })
          .selector("node:parent[class='compartment']")
          .css({
            'padding': function() {
              return getCompoundPaddings() + options.extraCompartmentPadding;
            }
          })
          .selector("node[bbox][class][class!='complex'][class!='compartment'][class!='submap']")
          .css({
            'width': 'data(bbox.w)',
            'height': 'data(bbox.h)'
          })
          .selector("node.cy-expand-collapse-collapsed-node")
          .css({
            'width': 36,
            'height': 36,
            'border-style': 'dashed'
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
            'width': 1.25,
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
            },
            'arrow-scale': 1.5
          })
          .selector("edge.cy-expand-collapse-meta-edge")
          .css({
            'line-color': '#C4C4C4',
            'source-arrow-color': '#C4C4C4',
            'target-arrow-color': '#C4C4C4'
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
            'source-arrow-shape': 'none',
            'source-endpoint': function(ele) {
              return elementUtilities.getEndPoint(ele, 'source');
            },
            'target-endpoint': function(ele) {
              return elementUtilities.getEndPoint(ele, 'target');
            }
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

},{"../utilities/element-utilities":5,"../utilities/graph-utilities":7,"../utilities/lib-utilities":10,"../utilities/option-utilities":12,"../utilities/undo-redo-action-functions":16}],4:[function(_dereq_,module,exports){
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

    var fontSize = 9; // parseInt(textProp.height / 1.5);

    textProp.font = fontSize + "px Arial";
    textProp.label = stateLabel;
    textProp.color = "#0f0f0f";
    $$.sbgn.drawText(context, textProp);
  };

  $$.sbgn.drawInfoText = function (context, textProp) {
    var fontSize = 9; // parseInt(textProp.height / 1.5);
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
        var width = node.outerWidth() - parseFloat(node.css('border-width'));
        var height = node.outerHeight()- parseFloat(node.css('border-width'));
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
        var width = node.outerWidth() - parseFloat(node.css('border-width'));
        var height = node.outerHeight() - parseFloat(node.css('border-width'));
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;

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
        var width = (node.outerWidth() - parseFloat(node.css('border-width'))) + threshold;
        var height = (node.outerHeight() - parseFloat(node.css('border-width'))) + threshold;
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

},{"../utilities/lib-utilities":10,"../utilities/text-utilities":14}],5:[function(_dereq_,module,exports){
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
        var roots = nodes.filter(function (ele, i) {
            if(typeof ele === "number") {
              ele = i;
            }
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
        var elesToHighlight = this.getNeighboursOfNodes(selectedEles);
        return elesToHighlight;
    },
    getNeighboursOfNodes: function(_nodes){
        var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
        nodes = nodes.add(nodes.parents("node[class='complex']"));
        nodes = nodes.add(nodes.descendants());
        var neighborhoodEles = nodes.neighborhood();
        var elesToReturn = nodes.add(neighborhoodEles);
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

        var processes = nodesToShow.filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) >= 0;
        });
        var nonProcesses = nodesToShow.filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) === -1;
        });
        var neighborProcesses = nonProcesses.neighborhood().filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) >= 0;
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
    getProcessesOfNodes: function(nodes) {
      return this.extendNodeList(nodes);
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
    deleteNodesSmart: function (_nodes) {
      var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
      
      var allNodes = cy.nodes();
      cy.elements().unselect();
      var nodesToKeep = this.extendRemainingNodes(nodes, allNodes);
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
            return 'triangle-cross';
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

        var textWidth = ele.width() || ele.data('bbox').w;

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
    /*
    * Get source/target end point of edge in 'x-value% y-value%' format. It returns 'outside-to-node' if there is no source/target port.
    */
    getEndPoint: function(edge, sourceOrTarget) {
      var portId = sourceOrTarget === 'source' ? edge.data('portsource') : edge.data('porttarget');

      if (portId == null) {
        return 'outside-to-node'; // If there is no portsource return the default value which is 'outside-to-node'
      }

      var endNode = sourceOrTarget === 'source' ? edge.source() : edge.target();
      var ports = endNode.data('ports');
      var port;
      for (var i = 0; i < ports.length; i++) {
        if (ports[i].id === portId) {
          port = ports[i];
        }
      }

      if (port === undefined) {
        return 'outside-to-node'; // If port is not found return the default value which is 'outside-to-node'
      }

      return '' + port.x + '% ' + port.y + '%';
    }
    
    // Section End
    // Stylesheet helpers
};

module.exports = elementUtilities;

},{"./lib-utilities":10,"./option-utilities":12,"./text-utilities":14}],6:[function(_dereq_,module,exports){
/*
 * File Utilities: To be used on read/write file operation
 */

var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var uiUtilities = _dereq_('./ui-utilities');
var graphUtilities = _dereq_('./graph-utilities');
var updateGraph = graphUtilities.updateGraph.bind(graphUtilities);

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

function loadXMLDoc(fullFilePath) {
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  }
  else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", fullFilePath, false);
  xhttp.send();
  return xhttp.responseXML;
}

// Should this be exposed or should this be moved to the helper functions section?
function textToXmlObject(text) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = 'false';
    doc.loadXML(text);
  } else {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/xml');
  }
  return doc;
}
// Helper functions End

function fileUtilities() {}
fileUtilities.loadXMLDoc = loadXMLDoc;

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

fileUtilities.loadSample = function(filename, folderpath) {
  uiUtilities.startSpinner("load-spinner");
  
  // Users may want to do customized things while a sample is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadSample", [ filename ] ); // Aliases for sbgnvizLoadSampleStart
  $( document ).trigger( "sbgnvizLoadSampleStart", [ filename ] );
  
  // load xml document use default folder path if it is not specified
  var xmlObject = loadXMLDoc((folderpath || 'sample-app/samples/') + filename);
  
  setTimeout(function () {
    updateGraph(sbgnmlToJson.convert(xmlObject));
    uiUtilities.endSpinner("load-spinner");
    $( document ).trigger( "sbgnvizLoadSampleEnd", [ filename ] ); // Trigger an event signaling that a sample is loaded
  }, 0);
};

/*
  callback is a function remotely defined to add specific behavior that isn't implemented here.
  it is completely optional.
  signature: callback(textXml)
*/
fileUtilities.loadSBGNMLFile = function(file, callback) {
  var self = this;
  uiUtilities.startSpinner("load-file-spinner");
  
  // Users may want to do customized things while an external file is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadFile", [ file.name ] ); // Aliases for sbgnvizLoadFileStart
  $( document ).trigger( "sbgnvizLoadFileStart", [ file.name ] ); 
  
  var textType = /text.*/;

  var reader = new FileReader();

  reader.onload = function (e) {
    var text = this.result;

    setTimeout(function () {
      if (typeof callback !== 'undefined') callback(text);
      updateGraph(sbgnmlToJson.convert(textToXmlObject(text)));
      uiUtilities.endSpinner("load-file-spinner");
      $( document ).trigger( "sbgnvizLoadFileEnd", [ file.name ] ); // Trigger an event signaling that a file is loaded
    }, 0);
  };

  reader.readAsText(file);
};
fileUtilities.loadSBGNMLText = function(textData){
    setTimeout(function () {
        updateGraph(sbgnmlToJson.convert(textToXmlObject(textData)));
        uiUtilities.endSpinner("load-file-spinner");
    }, 0);

};

fileUtilities.saveAsSbgnml = function(filename, renderInfo) {
  var sbgnmlText = jsonToSbgnml.createSbgnml(filename, renderInfo);
  var blob = new Blob([sbgnmlText], {
    type: "text/plain;charset=utf-8;",
  });
  saveAs(blob, filename);
};
fileUtilities.convertSbgnmlTextToJson = function(sbgnmlText){
    return sbgnmlToJson.convert(textToXmlObject(sbgnmlText));
};

fileUtilities.createJson = function(json){
    var sbgnmlText = jsonToSbgnml.createSbgnml();
    return sbgnmlToJson.convert(textToXmlObject(sbgnmlText));

};

module.exports = fileUtilities;

},{"./graph-utilities":7,"./json-to-sbgnml-converter":8,"./lib-utilities":10,"./sbgnml-to-json-converter":13,"./ui-utilities":15}],7:[function(_dereq_,module,exports){
/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

function graphUtilities() {}

graphUtilities.updateGraph = function(cyGraph) {
  console.log('cy update called');
  $( document ).trigger( "updateGraphStart" );
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

  this.refreshPaddings(); // Recalculates/refreshes the compound paddings
  cy.endBatch();
  
  var layout = cy.layout({
    name: 'preset',
    positions: positionMap,
    fit: true,
    padding: 50
  });
  
  // Check this for cytoscape.js backward compatibility
  if (layout && layout.run) {
    layout.run();
  }

  // Update the style
  cy.style().update();
  // Initilize the bend points once the elements are created
  if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
    cy.edgeBendEditing('get').initBendPoints(cy.edges());
  }
  
  $( document ).trigger( "updateGraphEnd" );
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

graphUtilities.recalculatePaddings = graphUtilities.refreshPaddings = function() {
  // this.calculatedPaddings is not working here 
  // TODO: replace this reference with this.calculatedPaddings once the reason is figured out
  graphUtilities.calculatedPaddings = this.calculatePaddings();
  return graphUtilities.calculatedPaddings;
};

module.exports = graphUtilities;
},{"./lib-utilities":10,"./option-utilities":12}],8:[function(_dereq_,module,exports){
var txtUtil = _dereq_('./text-utilities');
var libsbgnjs = _dereq_('libsbgn-js');
var renderExtension = libsbgnjs.renderExtension;
var pkgVersion = _dereq_('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = _dereq_('../../package.json').name;

var jsonToSbgnml = {
    /*
        takes renderInfo as an optional argument. It contains all the information needed to save
        the style and colors to the render extension. See newt/app-utilities getAllStyles()
        Structure: {
            background: the map background color,
            colors: {
              validXmlValue: color_id
              ...
            },
            styles: {
                styleKey1: {
                    idList: list of the nodes ids that have this style
                    properties: {
                        fontSize: ...
                        fill: ...
                        ...
                    }
                }
                styleKey2: ...
                ...
            }
        }
    */
    createSbgnml : function(filename, renderInfo){
        var self = this;
        var sbgnmlText = "";
        var mapID = txtUtil.getXMLValidId(filename);
        var hasExtension = false;
        var hasRenderExtension = false;
        if (typeof renderInfo !== 'undefined') {
            hasExtension = true;
            hasRenderExtension = true;
        }

        //add headers
        xmlHeader = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
        var sbgn = new libsbgnjs.Sbgn({xmlns: 'http://sbgn.org/libsbgn/0.3'});
        var map = new libsbgnjs.Map({language: 'process description', id: mapID});
        if (hasExtension) { // extension is there
            var extension = new libsbgnjs.Extension();
            if (hasRenderExtension) {
                extension.add(self.getRenderExtensionSbgnml(renderInfo));
            }
            map.setExtension(extension);
        }

        // get all glyphs
        var glyphList = [];
        cy.nodes(":visible").each(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            if(!ele.isChild())
                glyphList = glyphList.concat(self.getGlyphSbgnml(ele)); // returns potentially more than 1 glyph
        });
        // add them to the map
        for(var i=0; i<glyphList.length; i++) {
            map.addGlyph(glyphList[i]);
        }

        // get all arcs
        cy.edges(":visible").each(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            map.addArc(self.getArcSbgnml(ele));
        });

        sbgn.setMap(map);
        return xmlHeader + sbgn.toXML();
    },

    // see createSbgnml for info on the structure of renderInfo
    getRenderExtensionSbgnml : function(renderInfo) {
        // initialize the main container
        var renderInformation = new renderExtension.RenderInformation({ id: 'renderInformation', 
                                                                        backgroundColor: renderInfo.background,
                                                                        programName: pkgName,
                                                                        programVersion: pkgVersion });

        // populate list of colors
        var listOfColorDefinitions = new renderExtension.ListOfColorDefinitions();
        for (var color in renderInfo.colors) {
            var colorDefinition = new renderExtension.ColorDefinition({id: renderInfo.colors[color], value: color});
            listOfColorDefinitions.addColorDefinition(colorDefinition);
        }
        renderInformation.setListOfColorDefinitions(listOfColorDefinitions);

        // populates styles
        var listOfStyles = new renderExtension.ListOfStyles();
        for (var key in renderInfo.styles) {
            var style = renderInfo.styles[key];
            var xmlStyle = new renderExtension.Style({id: txtUtil.getXMLValidId(key), idList: style.idList});
            var g = new renderExtension.RenderGroup({
                fontSize: style.properties.fontSize,
                fontFamily: style.properties.fontFamily,
                fontWeight: style.properties.fontWeight,
                fontStyle: style.properties.fontStyle,
                fill: style.properties.fill, // fill color
                stroke: style.properties.stroke, // stroke color
                strokeWidth: style.properties.strokeWidth
            });
            xmlStyle.setRenderGroup(g);
            listOfStyles.addStyle(xmlStyle);
        }
        renderInformation.setListOfStyles(listOfStyles);

        return renderInformation;
    },

    getGlyphSbgnml : function(node){
        var self = this;
        var sbgnmlText = "";
        var nodeClass = node._private.data.class;
        var glyphList = [];

        var glyph = new libsbgnjs.Glyph({id: node._private.data.id, class_: nodeClass});

        // assign compartmentRef
        if(node.parent().isParent()){
            if(nodeClass === "compartment"){
                var parent = node.parent();
                glyph.compartmentRef = node._private.data.parent;
            }
            else {
                var parent = node.parent()[0];
                if(parent._private.data.class == "compartment")
                    glyph.compartmentRef = parent._private.data.id;
            }
        }

        // misc information
        var label = node._private.data.label;
        if(typeof label != 'undefined')
            glyph.setLabel(new libsbgnjs.Label({text: label}));
        //add clone information
        if(typeof node._private.data.clonemarker != 'undefined')
            glyph.setClone(new libsbgnjs.CloneType());
        //add bbox information
        glyph.setBbox(this.addGlyphBbox(node));
        //add port information
        var ports = node._private.data.ports;
        for(var i = 0 ; i < ports.length ; i++){
            var x = node._private.position.x + ports[i].x * node.width() / 100;
            var y = node._private.position.y + ports[i].y * node.height() / 100;

            glyph.addPort(new libsbgnjs.pPort({id: ports[i].id, x: x, y: y}));
            /*sbgnmlText = sbgnmlText + "<port id='" + ports[i].id+
                "' y='" + y + "' x='" + x + "' />\n";*/
        }
        //add state and info box information
        for(var i = 0 ; i < node._private.data.statesandinfos.length ; i++){
            var boxGlyph = node._private.data.statesandinfos[i];
            var statesandinfosId = node._private.data.id+"_"+i;
            if(boxGlyph.clazz === "state variable"){
                glyph.addGlyphMember(this.addStateBoxGlyph(boxGlyph, statesandinfosId, node));
            }
            else if(boxGlyph.clazz === "unit of information"){
                glyph.addGlyphMember(this.addInfoBoxGlyph(boxGlyph, statesandinfosId, node));
            }
        }

        // add glyph members that are not state variables or unit of info: subunits
        if(nodeClass === "complex" || nodeClass === "submap"){
            node.children().each(function(ele, i){
                if(typeof ele === "number") {
                  ele = i;
                }
                var glyphMemberList = self.getGlyphSbgnml(ele);
                for (var i=0; i < glyphMemberList.length; i++) {
                    glyph.addGlyphMember(glyphMemberList[i]);
                }
            });
        }

        // current glyph is done
        glyphList.push(glyph);

        // keep going with all the included glyphs
        if(nodeClass === "compartment"){
            node.children().each(function(ele, i){
                if(typeof ele === "number") {
                  ele = i;
                }
                glyphList = glyphList.concat(self.getGlyphSbgnml(ele));
            });
        }

        return  glyphList;
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

        var arcId = edge._private.data.id;
        var arc = new libsbgnjs.Arc({id: arcId, source: arcSource, target: arcTarget, class_: edge._private.data.class});

        arc.setStart(new libsbgnjs.StartType({x: edge._private.rscratch.startX, y: edge._private.rscratch.startY}));

        // Export bend points if edgeBendEditingExtension is registered
        if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
          var segpts = cy.edgeBendEditing('get').getSegmentPoints(edge);
          if(segpts){
            for(var i = 0; segpts && i < segpts.length; i = i + 2){
              var bendX = segpts[i];
              var bendY = segpts[i + 1];

              arc.addNext(new libsbgnjs.NextType({x: bendX, y: bendY}));
            }
          }
        }

        arc.setEnd(new libsbgnjs.EndType({x: edge._private.rscratch.endX, y: edge._private.rscratch.endY}));

        var cardinality = edge._private.data.cardinality;
        if(typeof cardinality != 'undefined' && cardinality != null) {
            arc.addGlyph(new libsbgnjs.Glyph({
                id: arc.id+'_card',
                class_: 'cardinality',
                label: new libsbgnjs.Label({text: cardinality}),
                bbox: new libsbgnjs.Bbox({x: 0, y: 0, w: 0, h: 0}) // dummy bbox, needed for format compliance
            }));
        }

        return arc;
    },

    addGlyphBbox : function(node){
        var width = node.width();
        var height = node.height();
        var x = node._private.position.x - width/2;
        var y = node._private.position.y - height/2;
        return new libsbgnjs.Bbox({x: x, y: y, w: width, h: height});
    },

    addStateAndInfoBbox : function(node, boxGlyph){
        boxBbox = boxGlyph.bbox;

        var x = boxBbox.x / 100 * node.width();
        var y = boxBbox.y / 100 * node.height();

        x = node._private.position.x + (x - boxBbox.w/2);
        y = node._private.position.y + (y - boxBbox.h/2);

        return new libsbgnjs.Bbox({x: x, y: y, w: boxBbox.w, h: boxBbox.h});
    },

    addStateBoxGlyph : function(node, id, mainGlyph){

        var glyph = new libsbgnjs.Glyph({id: id, class_: 'state variable'});
        var state = new libsbgnjs.StateType();
        if(typeof node.state.value != 'undefined')
            state.value = node.state.value;
        if(typeof node.state.variable != 'undefined')
            state.variable = node.state.variable;
        glyph.setState(state);
        glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

        return glyph;
    },

    addInfoBoxGlyph : function(node, id, mainGlyph){
        var glyph = new libsbgnjs.Glyph({id: id, class_: 'unit of information'});
        var label = new libsbgnjs.Label();
        if(typeof node.label.text != 'undefined')
            label.text = node.label.text;
        glyph.setLabel(label);
        glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

        return glyph;
    }
};

module.exports = jsonToSbgnml;

},{"../../package.json":1,"./text-utilities":14,"libsbgn-js":18}],9:[function(_dereq_,module,exports){
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
  isTabKey: function(e) {
    return e.keyCode === 9;
  },
  isEnterKey: function(e) {
    return e.keyCode === 13;
  },
  isIntegerFieldInput: function(value, e) {
    return this.isCtrlOrCommandPressed(e) || this.isMinusSignKey(e) || this.isNumberKey(e) 
            || this.isBackspaceKey(e) || this.isTabKey(e) || this.isLeftKey(e) || this.isRightKey(e) || this.isEnterKey(e);
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
});

module.exports = keyboardInputUtilities;

},{"./lib-utilities":10,"./option-utilities":12}],10:[function(_dereq_,module,exports){
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


},{}],11:[function(_dereq_,module,exports){
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

// Expand given nodes. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandNodes = function(nodes) {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodesToExpand = expandCollapse.expandableNodes(nodes);
  if (nodesToExpand.length == 0) {
    return;
  }
  if(options.undoable) {
    cy.undoRedo().do("expand", {
      nodes: nodesToExpand,
    });
  }
  else {
    expandCollapse.expand(nodes);
  }
};

// Collapse given nodes. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseNodes = function(nodes) {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  if (expandCollapse.collapsibleNodes(nodes).length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.collapse(nodes);
  }
};

// Collapse all complexes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseComplexes = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var complexes = cy.nodes("[class='complex']");
  if (expandCollapse.collapsibleNodes(complexes).length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: complexes
    });
  }
  else {
    expandCollapse.collapseRecursively(complexes);
  }
};

// Expand all complexes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandComplexes = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = expandCollapse.expandableNodes(cy.nodes().filter("[class='complex']"));
  if (nodes.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.expandRecursively(nodes);
  }
};

// Collapse all nodes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseAll = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = cy.nodes(':visible');
  if (expandCollapse.collapsibleNodes(nodes).length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.collapseRecursively(nodes);
  }
};

// Expand all nodes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandAll = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = expandCollapse.expandableNodes(cy.nodes(':visible'));
  if (nodes.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.expandRecursively(nodes);
  }
};

// Extends the given nodes list in a smart way to leave the map intact and hides the resulting list. 
// Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.hideNodesSmart = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  
  var allNodes = cy.nodes(":visible");
  var nodesToShow = elementUtilities.extendRemainingNodes(nodes, allNodes);
  var nodesToHide = allNodes.not(nodesToShow);

  if (nodesToHide.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", nodesToHide);
  }
  else {
    viewUtilities.hide(nodesToHide);
  }
};

// Extends the given nodes list in a smart way to leave the map intact. 
// Then unhides the resulting list and hides others. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.showNodesSmart = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  
  var allNodes = cy.elements();
  var nodesToShow = elementUtilities.extendNodeList(nodes);
  var nodesToHide = allNodes.not(nodesToShow);
  
  if (nodesToHide.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", nodesToHide);
  }
  else {
    viewUtilities.hide(nodesToHide);
  }
};

// Unhides all elements. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.showAll = function() {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (cy.elements().length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", cy.elements());
  }
  else {
    viewUtilities.show(cy.elements());
  }
};

// Removes the given elements in a simple way. Considers 'undoable' option.
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

// Extends the given nodes list in a smart way to leave the map intact and removes the resulting list. 
// Considers 'undoable' option.
mainUtilities.deleteNodesSmart = function(_nodes) {
  var nodes = _nodes.nodes();
  if (nodes.length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("deleteNodesSmart", {
      firstTime: true,
      eles: nodes
    });
  }
  else {
    elementUtilities.deleteNodesSmart(nodes);
  }
};

// Highlights neighbours of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.highlightNeighbours = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  var elesToHighlight = elementUtilities.getNeighboursOfNodes(nodes);
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
    viewUtilities.highlight(elesToHighlight);
  }
};

// Finds the elements whose label includes the given label and highlights processes of those elements.
// Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.searchByLabel = function(label) {
  if (label.length == 0) {
    return;
  }
  
  var nodesToHighlight = cy.nodes(":visible").filter(function (ele, i) {
    if(typeof ele === "number") {
      ele = i;
    }
    if (ele.data("label") && ele.data("label").toLowerCase().indexOf(label) >= 0) {
      return true;
    }
    return false;
  });

  if (nodesToHighlight.length == 0) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');

  nodesToHighlight = elementUtilities.extendNodeList(nodesToHighlight);
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", nodesToHighlight);
  }
  else {
    viewUtilities.highlight(nodesToHighlight);
  }
};

// Highlights processes of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.highlightProcesses = function(_nodes) {
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  var elesToHighlight = elementUtilities.extendNodeList(nodes);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    viewUtilities.highlight(elesToHighlight);
  }
};

// Unhighlights any highlighted element. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.removeHighlights = function() {
  if (elementUtilities.noneIsNotHighlighted()) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (options.undoable) {
    cy.undoRedo().do("removeHighlights");
  }
  else {
    viewUtilities.removeHighlights();
  }
};

// Performs layout by given layoutOptions. Considers 'undoable' option. However, by setting notUndoable parameter
// to a truthy value you can force an undable layout operation independant of 'undoable' option.
mainUtilities.performLayout = function(layoutOptions, notUndoable) {
  // Things to do before performing layout
  beforePerformLayout();
  
  if (!options.undoable || notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
    var layout = cy.elements().filter(':visible').layout(layoutOptions);
    
    // Check this for cytoscape.js backward compatibility
    if (layout && layout.run) {
      layout.run();
    }
  }
  else {
    cy.undoRedo().do("layout", {
      options: layoutOptions,
      eles: cy.elements().filter(':visible')
    });
  }
};

// Creates an sbgnml file content from the exising graph and returns it.
mainUtilities.createSbgnml = function() {
  return jsonToSbgnml.createSbgnml();
};

// Converts given sbgnml data to a json object in a special format 
// (http://js.cytoscape.org/#notation/elements-json) and returns it.
mainUtilities.convertSbgnmlToJson = function(data) {
  return sbgnmlToJson.convert(data);
};

// Create the qtip contents of the given node and returns it.
mainUtilities.getQtipContent = function(node) {
  return elementUtilities.getQtipContent(node);
};

module.exports = mainUtilities;
},{"./element-utilities":5,"./json-to-sbgnml-converter":8,"./lib-utilities":10,"./option-utilities":12,"./sbgnml-to-json-converter":13}],12:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file 
 */

// default options
var defaults = {
  // The path of core library images when sbgnviz is required from npm and the index html 
  // file and node_modules are under the same folder then using the default value is fine
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
  // extra padding for compartment
  extraCompartmentPadding: 10,
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

},{}],13:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');
var libsbgnjs = _dereq_('libsbgn-js');
var renderExtension = libsbgnjs.renderExtension;

var sbgnmlToJson = {
  insertedNodes: {},
  getAllCompartments: function (glyphList) {
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
    var bbox = ele.bbox;

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;

    return bbox;
  },
  stateAndInfoBboxProp: function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    var bbox = ele.bbox;

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

    var childGlyphs = ele.glyphMembers; // this.findChildNodes(ele, 'glyph');

    for (var i = 0; i < childGlyphs.length; i++) {
      var glyph = childGlyphs[i];
      var info = {};

      if (glyph.class_ === 'unit of information') {
        info.id = glyph.id || undefined;
        info.clazz = glyph.class_ || undefined;
        info.label = {
          'text': (glyph.label && glyph.label.text) || undefined
        };
        info.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        stateAndInfoArray.push(info);
      } else if (glyph.class_ === 'state variable') {
        info.id = glyph.id || undefined;
        info.clazz = glyph.class_ || undefined;
        var state = glyph.state;
        var value = (state && state.value) || undefined;
        var variable = (state && state.variable) || undefined;
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
    var compartmentRef = ele.compartmentRef;

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
        var bboxEl = ele.bbox;
        var bbox = {
          'x': parseFloat(bboxEl.x),
          'y': parseFloat(bboxEl.y),
          'w': parseFloat(bboxEl.w),
          'h': parseFloat(bboxEl.h),
          'id': ele.id
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
    nodeObj.id = ele.id;
    // add node bounding box information
    nodeObj.bbox = self.bboxProp(ele);
    // add class information
    nodeObj.class = ele.class_;
    // add label information
    nodeObj.label = (ele.label && ele.label.text) || undefined;
    // add state and info box information
    nodeObj.statesandinfos = self.stateAndInfoProp(ele, nodeObj.bbox);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);

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
  },

  getArcBendPointPositions: function (ele) {
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
  },
  addCytoscapeJsEdge: function (ele, jsonArray, xmlObject) {
    if (!elementUtilities.handledElements[ele.class_]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);

    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }

    var edgeObj = {};
    var bendPointPositions = self.getArcBendPointPositions(ele);

    edgeObj.id = ele.id || undefined;
    edgeObj.class = ele.class_;
    edgeObj.bendPointPositions = bendPointPositions;

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

    var cytoscapeJsEdge = {data: edgeObj};
    jsonArray.push(cytoscapeJsEdge);
  },
  applyStyle: function (renderInformation, nodes, edges) {
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

    var sbgn = libsbgnjs.Sbgn.fromXML(xmlObject.querySelector('sbgn'));
    var compartments = self.getAllCompartments(sbgn.map.glyphs);

    var glyphs = sbgn.map.glyphs;
    var arcs = sbgn.map.arcs;

    var i;
    for (i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];
      self.traverseNodes(glyph, cytoscapeJsNodes, '', compartments);
    }

    for (i = 0; i < arcs.length; i++) {
      var arc = arcs[i];
      self.addCytoscapeJsEdge(arc, cytoscapeJsEdges, xmlObject);
    }

    if (sbgn.map.extension.has('renderInformation')) { // render extension was found
      self.applyStyle(sbgn.map.extension.get('renderInformation'), cytoscapeJsNodes, cytoscapeJsEdges);
    }

    var cytoscapeJsGraph = {};
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  }
};

module.exports = sbgnmlToJson;

},{"./element-utilities":5,"libsbgn-js":18}],14:[function(_dereq_,module,exports){
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
  },

  // ensure that returned string follows xsd:ID standard
  // should follow r'^[a-zA-Z_][\w.-]*$'
  getXMLValidId: function(originalId) {
    var newId = "";
    var xmlValidRegex = /^[a-zA-Z_][\w.-]*$/;
    if (! xmlValidRegex.test(originalId)) { // doesn't comply
      newId = originalId;
      newId = newId.replace(/[^\w.-]/g, "");
      if (! xmlValidRegex.test(newId)) { // still doesn't comply
        newId = "_" + newId;
        if (! xmlValidRegex.test(newId)) { // normally we should never enter this
          // if for some obscure reason we still don't comply, throw error.
          throw new Error("Can't make identifer comply to xsd:ID requirements: "+newId);
        }
      }
      return newId;
    }
    else {
      return originalId;
    }
  }

};

module.exports = textUtilities;
},{"./option-utilities":12}],15:[function(_dereq_,module,exports){
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



},{"./lib-utilities":10,"./option-utilities":12}],16:[function(_dereq_,module,exports){
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
  deleteNodesSmart: function (param) {
    if (param.firstTime) {
      return elementUtilities.deleteNodesSmart(param.eles);
    }
    return elementUtilities.deleteElesSimple(param.eles);
  },
  // Section End
  // Add/remove action functions
};

module.exports = undoRedoActionFunctions;
},{"./element-utilities":5}],17:[function(_dereq_,module,exports){
var checkParams = _dereq_('./utilities').checkParams;

var ns = {};

ns.xmlns = "http://www.sbml.org/sbml/level3/version1/render/version1";

// ------- COLORDEFINITION -------
ns.ColorDefinition = function(params) {
	var params = checkParams(params, ['id', 'value']);
	this.id 	= params.id;
	this.value 	= params.value;
};

ns.ColorDefinition.prototype.toXML = function () {
	var xmlString = "<colorDefinition";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.value != null) {
		xmlString += " value='"+this.value+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.ColorDefinition.fromXML = function (xml) {
	if (xml.tagName != 'colorDefinition') {
		throw new Error("Bad XML provided, expected tagName colorDefinition, got: " + xml.tagName);
	}
	var colorDefinition = new ns.ColorDefinition();
	colorDefinition.id 		= xml.getAttribute('id');
	colorDefinition.value 	= xml.getAttribute('value');
	return colorDefinition;
};
// ------- END COLORDEFINITION -------

// ------- LISTOFCOLORDEFINITIONS -------
ns.ListOfColorDefinitions = function () {
	this.colorDefinitions = [];
};

ns.ListOfColorDefinitions.prototype.addColorDefinition = function (colorDefinition) {
	this.colorDefinitions.push(colorDefinition);
};

ns.ListOfColorDefinitions.prototype.toXML = function () {
	var xmlString = "<listOfColorDefinitions>\n";
	for(var i=0; i<this.colorDefinitions.length; i++) {
		var colorDefinition = this.colorDefinitions[i];
		xmlString += colorDefinition.toXML();
	}
	xmlString += "</listOfColorDefinitions>\n";
	return xmlString;
};

ns.ListOfColorDefinitions.fromXML = function (xml) {
	if (xml.tagName != 'listOfColorDefinitions') {
		throw new Error("Bad XML provided, expected tagName listOfColorDefinitions, got: " + xml.tagName);
	}
	var listOfColorDefinitions = new ns.ListOfColorDefinitions();

	var colorDefinitions = xml.getElementsByTagName('colorDefinition');
	for (var i=0; i<colorDefinitions.length; i++) {
		var colorDefinitionXML = colorDefinitions[i];
		var colorDefinition = ns.ColorDefinition.fromXML(colorDefinitionXML);
		listOfColorDefinitions.addColorDefinition(colorDefinition);
	}
	return listOfColorDefinitions;
};
// ------- END LISTOFCOLORDEFINITIONS -------

// ------- RENDERGROUP -------
ns.RenderGroup = function (params) {
	// each of those are optional, so test if it is defined is mandatory
	var params = checkParams(params, ['fontSize', 'fontFamily', 'fontWeight', 
		'fontStyle', 'textAnchor', 'vtextAnchor', 'fill', 'id', 'stroke', 'strokeWidth']);
	// specific to renderGroup
	this.fontSize 		= params.fontSize;
	this.fontFamily 	= params.fontFamily;
	this.fontWeight 	= params.fontWeight;
	this.fontStyle 		= params.fontStyle;
	this.textAnchor 	= params.textAnchor; // probably useless
	this.vtextAnchor 	= params.vtextAnchor; // probably useless
	// from GraphicalPrimitive2D
	this.fill 			= params.fill; // fill color
	// from GraphicalPrimitive1D
	this.id 			= params.id;
	this.stroke 		= params.stroke; // stroke color
	this.strokeWidth 	= params.strokeWidth;
};

ns.RenderGroup.prototype.toXML = function () {
	var xmlString = "<g";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.fontSize != null) {
		xmlString += " fontSize='"+this.fontSize+"'";
	}
	if (this.fontFamily != null) {
		xmlString += " fontFamily='"+this.fontFamily+"'";
	}
	if (this.fontWeight != null) {
		xmlString += " fontWeight='"+this.fontWeight+"'";
	}
	if (this.fontStyle != null) {
		xmlString += " fontStyle='"+this.fontStyle+"'";
	}
	if (this.textAnchor != null) {
		xmlString += " textAnchor='"+this.textAnchor+"'";
	}
	if (this.vtextAnchor != null) {
		xmlString += " vtextAnchor='"+this.vtextAnchor+"'";
	}
	if (this.stroke != null) {
		xmlString += " stroke='"+this.stroke+"'";
	}
	if (this.strokeWidth != null) {
		xmlString += " strokeWidth='"+this.strokeWidth+"'";
	}
	if (this.fill != null) {
		xmlString += " fill='"+this.fill+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.RenderGroup.fromXML = function (xml) {
	if (xml.tagName != 'g') {
		throw new Error("Bad XML provided, expected tagName g, got: " + xml.tagName);
	}
	var renderGroup = new ns.RenderGroup({});
	renderGroup.id 			= xml.getAttribute('id');
	renderGroup.fontSize 	= xml.getAttribute('fontSize');
	renderGroup.fontFamily 	= xml.getAttribute('fontFamily');
	renderGroup.fontWeight 	= xml.getAttribute('fontWeight');
	renderGroup.fontStyle 	= xml.getAttribute('fontStyle');
	renderGroup.textAnchor 	= xml.getAttribute('textAnchor');
	renderGroup.vtextAnchor = xml.getAttribute('vtextAnchor');
	renderGroup.stroke 		= xml.getAttribute('stroke');
	renderGroup.strokeWidth = xml.getAttribute('strokeWidth');
	renderGroup.fill 		= xml.getAttribute('fill');
	return renderGroup;
};
// ------- END RENDERGROUP -------

// ------- STYLE -------
// localStyle from specs
ns.Style = function(params) {
	var params = checkParams(params, ['id', 'name', 'idList', 'renderGroup']);
	this.id 			= params.id;
	this.name 			= params.name;
	this.idList 		= params.idList; // TODO add utility functions to manage this (should be array)
	this.renderGroup 	= params.renderGroup;
};

ns.Style.prototype.setRenderGroup = function (renderGroup) {
	this.renderGroup = renderGroup;
};

ns.Style.prototype.toXML = function () {
	var xmlString = "<style";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.idList != null) {
		xmlString += " idList='"+this.idList+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};

ns.Style.fromXML = function (xml) {
	if (xml.tagName != 'style') {
		throw new Error("Bad XML provided, expected tagName style, got: " + xml.tagName);
	}
	var style = new ns.Style();
	style.id 		= xml.getAttribute('id');
	style.name 		= xml.getAttribute('name');
	style.idList 	= xml.getAttribute('idList');

	var renderGroupXML = xml.getElementsByTagName('g')[0];
	if (renderGroupXML != null) {
		style.renderGroup = ns.RenderGroup.fromXML(renderGroupXML);
	}
	return style;
};
// ------- END STYLE -------

// ------- LISTOFSTYLES -------
ns.ListOfStyles = function() {
	this.styles = [];
};

ns.ListOfStyles.prototype.addStyle = function(style) {
	this.styles.push(style);
};

ns.ListOfStyles.prototype.toXML = function () {
	var xmlString = "<listOfStyles>\n";
	for(var i=0; i<this.styles.length; i++) {
		var style = this.styles[i];
		xmlString += style.toXML();
	}
	xmlString += "</listOfStyles>\n";
	return xmlString;
};

ns.ListOfStyles.fromXML = function (xml) {
	if (xml.tagName != 'listOfStyles') {
		throw new Error("Bad XML provided, expected tagName listOfStyles, got: " + xml.tagName);
	}
	var listOfStyles = new ns.ListOfStyles();

	var styles = xml.getElementsByTagName('style');
	for (var i=0; i<styles.length; i++) {
		var styleXML = styles[i];
		var style = ns.Style.fromXML(styleXML);
		listOfStyles.addStyle(style);
	}
	return listOfStyles;
};
// ------- END LISTOFSTYLES -------

// ------- RENDERINFORMATION -------
ns.RenderInformation = function (params) {
	var params = checkParams(params, ['id', 'name', 'programName', 
		'programVersion', 'backgroundColor', 'listOfColorDefinitions', 'listOfStyles']);
	this.id 					= params.id; // required, rest is optional
	this.name 					= params.name;
	this.programName 			= params.programName;
	this.programVersion 		= params.programVersion;
	this.backgroundColor 		= params.backgroundColor;
	this.listOfColorDefinitions = params.listOfColorDefinitions;
	this.listOfStyles 			= params.listOfStyles;
	/*this.listOfColorDefinitions = new renderExtension.ListOfColorDefinitions(renderInfo.colorDef.colorList);
	this.listOfStyles = new renderExtension.ListOfStyles(renderInfo.styleDef);
	*/
};

ns.RenderInformation.prototype.setListOfColorDefinitions = function(listOfColorDefinitions) {
	this.listOfColorDefinitions = listOfColorDefinitions;
};

ns.RenderInformation.prototype.setListOfStyles = function(listOfStyles) {
	this.listOfStyles = listOfStyles;
};

ns.RenderInformation.prototype.toXML = function() {
	// tag and its attributes
	var xmlString = "<renderInformation";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.programName != null) {
		xmlString += " programName='"+this.programName+"'";
	}
	if (this.programVersion != null) {
		xmlString += " programVersion='"+this.programVersion+"'";
	}
	if (this.backgroundColor != null) {
		xmlString += " backgroundColor='"+this.backgroundColor+"'";
	}
	xmlString += " xmlns='"+ns.xmlns+"'>\n";

	// child elements
	if (this.listOfColorDefinitions) {
		xmlString += this.listOfColorDefinitions.toXML();
	}
	if (this.listOfStyles) {
		xmlString += this.listOfStyles.toXML();
	}

	xmlString += "</renderInformation>\n";
	return xmlString;
};

// static constructor method
ns.RenderInformation.fromXML = function (xml) {
	if (xml.tagName != 'renderInformation') {
		throw new Error("Bad XML provided, expected tagName renderInformation, got: " + xml.tagName);
	}
	var renderInformation = new ns.RenderInformation();
	renderInformation.id 				= xml.getAttribute('id');
	renderInformation.name 				= xml.getAttribute('name');
	renderInformation.programName 		= xml.getAttribute('programName');
	renderInformation.programVersion 	= xml.getAttribute('programVersion');
	renderInformation.backgroundColor 	= xml.getAttribute('backgroundColor');

	var listOfColorDefinitionsXML = xml.getElementsByTagName('listOfColorDefinitions')[0];
	var listOfStylesXML = xml.getElementsByTagName('listOfStyles')[0];
	if (listOfColorDefinitionsXML != null) {
		renderInformation.listOfColorDefinitions = ns.ListOfColorDefinitions.fromXML(listOfColorDefinitionsXML);
	}
	if (listOfStylesXML != null) {
		renderInformation.listOfStyles = ns.ListOfStyles.fromXML(listOfStylesXML);
	}

	return renderInformation;
};
// ------- END RENDERINFORMATION -------

module.exports = ns;
},{"./utilities":19}],18:[function(_dereq_,module,exports){
var renderExt = _dereq_('./libsbgn-render-ext');
var checkParams = _dereq_('./utilities').checkParams;

var ns = {};

ns.xmlns = "http://sbgn.org/libsbgn/0.3";

// ------- SBGNBase -------
/*
	Every sbgn element inherit from this. Allows to put notes everywhere.
*/
ns.SBGNBase = function () {

};
// ------- END SBGNBase -------

// ------- SBGN -------
ns.Sbgn = function (params) {
	var params = checkParams(params, ['xmlns', 'map']);
	this.xmlns 	= params.xmlns;
	this.map 	= params.map;
};

ns.Sbgn.prototype = Object.create(ns.SBGNBase.prototype);
ns.Sbgn.prototype.constructor = ns.Sbgn;

ns.Sbgn.prototype.setMap = function (map) {
	this.map = map;
};

ns.Sbgn.prototype.toXML = function () {
	var xmlString = "<sbgn";
	if(this.xmlns != null) {
		xmlString += " xmlns='"+this.xmlns+"'";
	}
	xmlString += ">\n";

	if (this.map != null) {
		xmlString += this.map.toXML();
	}
	xmlString += "</sbgn>\n";
	return xmlString;
};

ns.Sbgn.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'sbgn') {
		throw new Error("Bad XML provided, expected tagName sbgn, got: " + xmlObj.tagName);
	}
	var sbgn = new ns.Sbgn();
	sbgn.xmlns = xmlObj.getAttribute('xmlns');

	// get children
	var mapXML = xmlObj.getElementsByTagName('map')[0];
	if (mapXML != null) {
		var map = ns.Map.fromXML(mapXML);
		sbgn.setMap(map);
	}
	return sbgn;
};
// ------- END SBGN -------

// ------- MAP -------
ns.Map = function (params) {
	var params = checkParams(params, ['id', 'language', 'extension', 'glyphs', 'arcs']);
	this.id 		= params.id;
	this.language 	= params.language;
	this.extension 	= params.extension;
	this.glyphs 	= params.glyphs || [];
	this.arcs 		= params.arcs || [];
};

ns.Map.prototype = Object.create(ns.SBGNBase.prototype);
ns.Map.prototype.constructor = ns.Map;

ns.Map.prototype.setExtension = function (extension) {
	this.extension = extension;
};

ns.Map.prototype.addGlyph = function (glyph) {
	this.glyphs.push(glyph);
};

ns.Map.prototype.addArc = function (arc) {
	this.arcs.push(arc);
};

ns.Map.prototype.toXML = function () {
	var xmlString = "<map";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.language != null) {
		xmlString += " language='"+this.language+"'";
	}
	xmlString += ">\n";

	// children
	if(this.extension != null) {
		xmlString += this.extension.toXML();
	}
	for(var i=0; i < this.glyphs.length; i++) {
		xmlString += this.glyphs[i].toXML();
	}
	for(var i=0; i < this.arcs.length; i++) {
		xmlString += this.arcs[i].toXML();
	}
	xmlString += "</map>\n";

	return xmlString;
};

ns.Map.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'map') {
		throw new Error("Bad XML provided, expected tagName map, got: " + xmlObj.tagName);
	}
	var map = new ns.Map();
	map.id = xmlObj.getAttribute('id');
	map.language = xmlObj.getAttribute('language');

	// children
	var extensionXML = xmlObj.getElementsByTagName('extension')[0];
	if (extensionXML != null) {
		var extension = ns.Extension.fromXML(extensionXML);
		map.setExtension(extension);
	}
	// need to be careful here, as there can be glyph in arcs
	var glyphsXML = xmlObj.querySelectorAll('map > glyph');
	for (var i=0; i < glyphsXML.length; i++) {
		var glyph = ns.Glyph.fromXML(glyphsXML[i]);
		map.addGlyph(glyph);
	}
	var arcsXML = xmlObj.getElementsByTagName('arc');
	for (var i=0; i < arcsXML.length; i++) {
		var arc = ns.Arc.fromXML(arcsXML[i]);
		map.addArc(arc);
	}

	return map;
};
// ------- END MAP -------

// ------- EXTENSIONS -------
ns.Extension = function () {
	// consider first order children, add them with their tagname as property of this object
	// store xmlObject if no supported parsing (unrecognized extensions)
	// else store instance of the extension
	this.list = {};
	this.unsupportedList = {};
};

/*ns.Extension.prototype.add = function (xmlObj) { // add specific extension
	var extName = xmlObj.tagName;
	console.log("extName", extName, xmlObj);
	if (extName == 'renderInformation') {
		var renderInformation = renderExt.RenderInformation.fromXML(xmlObj);
		this.list['renderInformation'] = renderInformation;
	}
	else if (extName == 'annotations') {
		this.list['annotations'] = xmlObj; // to be parsed correctly
	}
	else { // unsupported extension, we still store the data as is
		this.list[extName] = xmlObj;
	}
};*/

ns.Extension.prototype.add = function (extension) {
	if (extension instanceof renderExt.RenderInformation) {
		this.list['renderInformation'] = extension;
	}
	else if (extension.nodeType == Node.ELEMENT_NODE) {
		// case where renderInformation is passed unparsed
		if (extension.tagName == 'renderInformation') {
			var renderInformation = renderExt.RenderInformation.fromXML(extension);
			this.list['renderInformation'] = renderInformation;
		}
		this.unsupportedList[extension.tagName] = extension;
	}
};

ns.Extension.prototype.has = function (extensionName) {
	return this.list.hasOwnProperty(extensionName);
};

ns.Extension.prototype.get = function (extensionName) {
	if (this.has(extensionName)) {
		return this.list[extensionName];
	}
	else {
		return null;
	}
};

ns.Extension.prototype.toXML = function () {
	var xmlString = "<extension>\n";
	for (var extInstance in this.list) {
		if (extInstance == "renderInformation") {
			xmlString += this.get(extInstance).toXML();
		}
		else {
			xmlString += new XMLSerializer().serializeToString(this.get(extInstance));
		}
	}
	xmlString += "</extension>\n";
	return xmlString;
};

ns.Extension.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'extension') {
		throw new Error("Bad XML provided, expected tagName extension, got: " + xmlObj.tagName);
	}
	var extension = new ns.Extension();
	var children = xmlObj.children;
	for (var i=0; i < children.length; i++) {
		var extXmlObj = children[i];
		var extName = extXmlObj.tagName;
		//extension.add(extInstance);
		if (extName == 'renderInformation') {
			var renderInformation = renderExt.RenderInformation.fromXML(extXmlObj);
			extension.add(renderInformation);
		}
		else if (extName == 'annotations') {
			extension.add(extXmlObj); // to be parsed correctly
		}
		else { // unsupported extension, we still store the data as is
			extension.add(extXmlObj);
		}
	}
	return extension;
};
// ------- END EXTENSIONS -------

// ------- GLYPH -------
ns.Glyph = function (params) {
	var params = checkParams(params, ['id', 'class_', 'compartmentRef', 'label', 'bbox', 'glyphMembers', 'ports', 'state', 'clone']);
	this.id 			= params.id;
	this.class_ 		= params.class_;
	this.compartmentRef = params.compartmentRef;

	// children
	this.label 			= params.label;
	this.state 			= params.state;
	this.bbox 			= params.bbox;
	this.clone 			= params.clone;
	this.glyphMembers 	= params.glyphMembers || []; // case of complex, can have arbitrary list of nested glyphs
	this.ports 			= params.ports || [];
};

ns.Glyph.prototype = Object.create(ns.SBGNBase.prototype);
ns.Glyph.prototype.constructor = ns.Glyph;

ns.Glyph.prototype.setLabel = function (label) {
	this.label = label;
};

ns.Glyph.prototype.setState = function (state) {
	this.state = state;
};

ns.Glyph.prototype.setBbox = function (bbox) {
	this.bbox = bbox;
};

ns.Glyph.prototype.setClone = function (clone) {
	this.clone = clone;
};

ns.Glyph.prototype.addGlyphMember = function (glyphMember) {
	this.glyphMembers.push(glyphMember);
};

ns.Glyph.prototype.addPort = function (port) {
	this.ports.push(port);
};

ns.Glyph.prototype.toXML = function () {
	var xmlString = "<glyph";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.class_ != null) {
		xmlString += " class='"+this.class_+"'";
	}
	if(this.compartmentRef != null) {
		xmlString += " compartmentRef='"+this.compartmentRef+"'";
	}
	xmlString += ">\n";

	// children
	if(this.label != null) {
		xmlString += this.label.toXML();
	}
	if(this.state != null) {
		xmlString += this.state.toXML();
	}
	if(this.bbox != null) {
		xmlString += this.bbox.toXML();
	}
	if(this.clone != null) {
		xmlString += this.clone.toXML();
	}
	for(var i=0; i < this.glyphMembers.length; i++) {
		xmlString += this.glyphMembers[i].toXML();
	}
	for(var i=0; i < this.ports.length; i++) {
		xmlString += this.ports[i].toXML();
	}
	xmlString += "</glyph>\n";

	return xmlString;
};

ns.Glyph.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'glyph') {
		throw new Error("Bad XML provided, expected tagName glyph, got: " + xmlObj.tagName);
	}
	var glyph = new ns.Glyph();
	glyph.id 				= xmlObj.getAttribute('id');
	glyph.class_ 			= xmlObj.getAttribute('class');
	glyph.compartmentRef 	= xmlObj.getAttribute('compartmentRef');

	var labelXML = xmlObj.getElementsByTagName('label')[0];
	if (labelXML != null) {
		var label = ns.Label.fromXML(labelXML);
		glyph.setLabel(label);
	}
	var stateXML = xmlObj.getElementsByTagName('state')[0];
	if (stateXML != null) {
		var state = ns.StateType.fromXML(stateXML);
		glyph.setState(state);
	}
	var bboxXML = xmlObj.getElementsByTagName('bbox')[0];
	if (bboxXML != null) {
		var bbox = ns.Bbox.fromXML(bboxXML);
		glyph.setBbox(bbox);
	}
	var cloneXMl = xmlObj.getElementsByTagName('clone')[0];
	if (cloneXMl != null) {
		var clone = ns.CloneType.fromXML(cloneXMl);
		glyph.setClone(clone);
	}
	// need special care because of recursion of nested glyph nodes
	// take only first level glyphs
	var children = xmlObj.children;
	for (var j=0; j < children.length; j++) { // loop through all first level children
		var child = children[j];
		if (child.tagName == "glyph") { // here we only want the glyh children
			var glyphMember = ns.Glyph.fromXML(child); // recursive call on nested glyph
			glyph.addGlyphMember(glyphMember);
		}
	}
	var portsXML = xmlObj.getElementsByTagName('port');
	for (var i=0; i < portsXML.length; i++) {
		var port = ns.Port.fromXML(portsXML[i]);
		glyph.addPort(port);
	}
	return glyph;
};
// ------- END GLYPH -------

// ------- LABEL -------
ns.Label = function (params) {
	var params = checkParams(params, ['text']);
	this.text = params.text;
};

ns.Label.prototype = Object.create(ns.SBGNBase.prototype);
ns.Label.prototype.constructor = ns.Label;

ns.Label.prototype.toXML = function () {
	var xmlString = "<label";
	// attributes
	if(this.text != null) {
		xmlString += " text='"+this.text+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.Label.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'label') {
		throw new Error("Bad XML provided, expected tagName label, got: " + xmlObj.tagName);
	}
	var label = new ns.Label();
	label.text = xmlObj.getAttribute('text');
	return label;
};
// ------- END LABEL -------

// ------- BBOX -------
ns.Bbox = function (params) {
	var params = checkParams(params, ['x', 'y', 'w', 'h']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
	this.w = parseFloat(params.w);
	this.h = parseFloat(params.h);
};

ns.Bbox.prototype = Object.create(ns.SBGNBase.prototype);
ns.Bbox.prototype.constructor = ns.Bbox;

ns.Bbox.prototype.toXML = function () {
	var xmlString = "<bbox";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	if(!isNaN(this.w)) {
		xmlString += " w='"+this.w+"'";
	}
	if(!isNaN(this.h)) {
		xmlString += " h='"+this.h+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.Bbox.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'bbox') {
		throw new Error("Bad XML provided, expected tagName bbox, got: " + xmlObj.tagName);
	}
	var bbox = new ns.Bbox();
	bbox.x = parseFloat(xmlObj.getAttribute('x'));
	bbox.y = parseFloat(xmlObj.getAttribute('y'));
	bbox.w = parseFloat(xmlObj.getAttribute('w'));
	bbox.h = parseFloat(xmlObj.getAttribute('h'));
	return bbox;
};
// ------- END BBOX -------

// ------- STATE -------
ns.StateType = function (params) {
	var params = checkParams(params, ['value', 'variable']);
	this.value = params.value;
	this.variable = params.variable;
};

ns.StateType.prototype.toXML = function () {
	var xmlString = "<state";
	// attributes
	if(this.value != null) {
		xmlString += " value='"+this.value+"'";
	}
	if(this.variable != null) {
		xmlString += " variable='"+this.variable+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.StateType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'state') {
		throw new Error("Bad XML provided, expected tagName state, got: " + xmlObj.tagName);
	}
	var state = new ns.StateType();
	state.value = xmlObj.getAttribute('value');
	state.variable = xmlObj.getAttribute('variable');
	return state;
};
// ------- END STATE -------

// ------- CLONE -------
ns.CloneType = function (params) {
	var params = checkParams(params, ['label']);
	this.label = params.label;
};

ns.CloneType.prototype.toXML = function () {
	var xmlString = "<clone";
	// attributes
	if(this.label != null) {
		xmlString += " label='"+this.label+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.CloneType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'clone') {
		throw new Error("Bad XML provided, expected tagName clone, got: " + xmlObj.tagName);
	}
	var clone = new ns.CloneType();
	clone.label = xmlObj.getAttribute('label');
	return clone;
};
// ------- END CLONE -------

// ------- PORT -------
ns.Port = function (params) {
	var params = checkParams(params, ['id', 'x', 'y']);
	this.id = params.id;
	this.x 	= parseFloat(params.x);
	this.y 	= parseFloat(params.y);
};

ns.Port.prototype = Object.create(ns.SBGNBase.prototype);
ns.Port.prototype.constructor = ns.Port;

ns.Port.prototype.toXML = function () {
	var xmlString = "<port";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.Port.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'port') {
		throw new Error("Bad XML provided, expected tagName port, got: " + xmlObj.tagName);
	}
	var port = new ns.Port();
	port.x 	= parseFloat(xmlObj.getAttribute('x'));
	port.y 	= parseFloat(xmlObj.getAttribute('y'));
	port.id = xmlObj.getAttribute('id');
	return port;
};
// ------- END PORT -------

// ------- ARC -------
ns.Arc = function (params) {
	var params = checkParams(params, ['id', 'class_', 'source', 'target', 'start', 'end', 'nexts', 'glyphs']);
	this.id 	= params.id;
	this.class_ = params.class_;
	this.source = params.source;
	this.target = params.target;

	this.start 	= params.start;
	this.end 	= params.end;
	this.nexts 	= params.nexts || [];
	this.glyphs = params.glyphs || [];
};

ns.Arc.prototype = Object.create(ns.SBGNBase.prototype);
ns.Arc.prototype.constructor = ns.Arc;

ns.Arc.prototype.setStart = function (start) {
	this.start = start;
};

ns.Arc.prototype.setEnd = function (end) {
	this.end = end;
};

ns.Arc.prototype.addNext = function (next) {
	this.nexts.push(next);
};

ns.Arc.prototype.addGlyph = function (glyph) {
	this.glyphs.push(glyph);
};

ns.Arc.prototype.toXML = function () {
	var xmlString = "<arc";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.class_ != null) {
		xmlString += " class='"+this.class_+"'";
	}
	if(this.source != null) {
		xmlString += " source='"+this.source+"'";
	}
	if(this.target != null) {
		xmlString += " target='"+this.target+"'";
	}
	xmlString += ">\n";

	// children
	for(var i=0; i < this.glyphs.length; i++) {
		xmlString += this.glyphs[i].toXML();
	}
	if(this.start != null) {
		xmlString += this.start.toXML();
	}
	for(var i=0; i < this.nexts.length; i++) {
		xmlString += this.nexts[i].toXML();
	}
	if(this.end != null) {
		xmlString += this.end.toXML();
	}

	xmlString += "</arc>\n";
	return xmlString;
};

ns.Arc.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'arc') {
		throw new Error("Bad XML provided, expected tagName arc, got: " + xmlObj.tagName);
	}
	var arc = new ns.Arc();
	arc.id 		= xmlObj.getAttribute('id');
	arc.class_ 	= xmlObj.getAttribute('class');
	arc.source 	= xmlObj.getAttribute('source');
	arc.target 	= xmlObj.getAttribute('target');

	var startXML = xmlObj.getElementsByTagName('start')[0];
	if (startXML != null) {
		var start = ns.StartType.fromXML(startXML);
		arc.setStart(start);
	}
	var nextXML = xmlObj.getElementsByTagName('next');
	for (var i=0; i < nextXML.length; i++) {
		var next = ns.NextType.fromXML(nextXML[i]);
		arc.addNext(next);
	}
	var endXML = xmlObj.getElementsByTagName('end')[0];
	if (endXML != null) {
		var end = ns.EndType.fromXML(endXML);
		arc.setEnd(end);
	}
	var glyphsXML = xmlObj.getElementsByTagName('glyph');
	for (var i=0; i < glyphsXML.length; i++) {
		var glyph = ns.Glyph.fromXML(glyphsXML[i]);
		arc.addGlyph(glyph);
	}

	return arc;
};

// ------- END ARC -------

// ------- STARTTYPE -------
ns.StartType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.StartType.prototype.toXML = function () {
	var xmlString = "<start";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.StartType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'start') {
		throw new Error("Bad XML provided, expected tagName start, got: " + xmlObj.tagName);
	}
	var start = new ns.StartType();
	start.x = parseFloat(xmlObj.getAttribute('x'));
	start.y = parseFloat(xmlObj.getAttribute('y'));
	return start;
};
// ------- END STARTTYPE -------

// ------- ENDTYPE -------
ns.EndType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.EndType.prototype.toXML = function () {
	var xmlString = "<end";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.EndType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'end') {
		throw new Error("Bad XML provided, expected tagName end, got: " + xmlObj.tagName);
	}
	var end = new ns.EndType();
	end.x = parseFloat(xmlObj.getAttribute('x'));
	end.y = parseFloat(xmlObj.getAttribute('y'));
	return end;
};
// ------- END ENDTYPE -------

// ------- NEXTTYPE -------
ns.NextType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.NextType.prototype.toXML = function () {
	var xmlString = "<next";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.NextType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'next') {
		throw new Error("Bad XML provided, expected tagName next, got: " + xmlObj.tagName);
	}
	var next = new ns.NextType();
	next.x = parseFloat(xmlObj.getAttribute('x'));
	next.y = parseFloat(xmlObj.getAttribute('y'));
	return next;
};
// ------- END NEXTTYPE -------

ns.renderExtension = renderExt;
module.exports = ns;
},{"./libsbgn-render-ext":17,"./utilities":19}],19:[function(_dereq_,module,exports){
var ns = {};

/*
	guarantees to return an object with given args being set to null if not present, other args returned as is
*/
ns.checkParams = function (params, names) {
	if (typeof params == "undefined" || params == null) {
		params = {};
	}
	if (typeof params != 'object') {
		throw new Error("Bad params. Object with named parameters must be passed.");
	}
	for(var i=0; i < names.length; i++) {
		var argName = names[i];
		if (typeof params[argName] == 'undefined') {
			params[argName] = null;
		}
	}
	return params;
}

module.exports = ns;
},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiLCIuLi8uLi9saWJzYmduLWpzL2xpYnNiZ24tcmVuZGVyLWV4dC5qcyIsIi4uLy4uL2xpYnNiZ24tanMvbGlic2Jnbi5qcyIsIi4uLy4uL2xpYnNiZ24tanMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6eERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4dEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJuYW1lXCI6IFwic2JnbnZpelwiLFxuICBcInZlcnNpb25cIjogXCIzLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiU0JHTlBEIHZpc3VhbGl6YXRpb24gbGlicmFyeVwiLFxuICBcIm1haW5cIjogXCJzcmMvaW5kZXguanNcIixcbiAgXCJsaWNlbmNlXCI6IFwiTEdQTC0zLjBcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInRlc3RcIjogXCJlY2hvIFxcXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcXFwiICYmIGV4aXQgMVwiLFxuICAgIFwiYnVpbGQtc2JnbnZpei1qc1wiOiBcImd1bHAgYnVpbGRcIixcbiAgICBcImRlYnVnLWpzXCI6IFwibm9kZW1vbiAtZSBqcyAtLXdhdGNoIHNyYyAteCBcXFwibnBtIHJ1biBidWlsZC1zYmdudml6LWpzXFxcIlwiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMuZ2l0XCJcbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzL1wiLFxuICBcInBlZXItZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImpxdWVyeVwiOiBcIl4yLjIuNFwiLFxuICAgIFwiZmlsZXNhdmVyanNcIjogXCJ+MC4yLjJcIixcbiAgICBcImN5dG9zY2FwZVwiOiBcImlWaXMtYXQtQmlsa2VudC9jeXRvc2NhcGUuanMjdW5zdGFibGVcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJicm93c2VyaWZ5XCI6IFwiXjExLjIuMFwiLFxuICAgIFwiZ3VscFwiOiBcIl4zLjkuMFwiLFxuICAgIFwiZ3VscC1kZXJlcXVpcmVcIjogXCJeMi4xLjBcIixcbiAgICBcImd1bHAtanNoaW50XCI6IFwiXjEuMTEuMlwiLFxuICAgIFwiZ3VscC1wcm9tcHRcIjogXCJeMC4xLjJcIixcbiAgICBcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuNFwiLFxuICAgIFwiZ3VscC1zaGVsbFwiOiBcIl4wLjUuMFwiLFxuICAgIFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG4gICAgXCJqc2hpbnQtc3R5bGlzaFwiOiBcIl4yLjAuMVwiLFxuICAgIFwibm9kZS1ub3RpZmllclwiOiBcIl40LjMuMVwiLFxuICAgIFwicnVuLXNlcXVlbmNlXCI6IFwiXjEuMS40XCIsXG4gICAgXCJ2aW55bC1idWZmZXJcIjogXCJeMS4wLjBcIixcbiAgICBcInZpbnlsLXNvdXJjZS1zdHJlYW1cIjogXCJeMS4xLjBcIlxuICB9XG59XG4iLCIoZnVuY3Rpb24oKXtcbiAgdmFyIHNiZ252aXogPSB3aW5kb3cuc2JnbnZpeiA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xuICAgIFxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xuICAgIFxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7XG4gICAgXG4gICAgdmFyIHNiZ25SZW5kZXJlciA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXInKTtcbiAgICB2YXIgc2JnbkN5SW5zdGFuY2UgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlJyk7XG4gICAgXG4gICAgLy8gVXRpbGl0aWVzIHdob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIGV4cG9zZWQgc2VwZXJhdGVseVxuICAgIHZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VpLXV0aWxpdGllcycpO1xuICAgIHZhciBmaWxlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMnKTtcbiAgICB2YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgcmVxdWlyZSgnLi91dGlsaXRpZXMva2V5Ym9hcmQtaW5wdXQtdXRpbGl0aWVzJyk7IC8vIHJlcXVpcmUga2V5Ym9yZCBpbnB1dCB1dGlsaXRpZXNcbiAgICAvLyBVdGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBhcyBpc1xuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xuICAgIFxuICAgIHNiZ25SZW5kZXJlcigpO1xuICAgIHNiZ25DeUluc3RhbmNlKCk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXMsIG1vc3QgdXNlcnMgd2lsbCBub3QgbmVlZCB0aGVzZVxuICAgIHNiZ252aXouZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIGZpbGVVdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBmaWxlVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gdWlVdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSB1aVV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggc2JnbiBncmFwaCB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIGdyYXBoVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gZ3JhcGhVdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICB9O1xuICBcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNiZ252aXo7XG4gIH1cbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncy5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuXG52YXIgZ2V0Q29tcG91bmRQYWRkaW5ncyA9IGZ1bmN0aW9uKCkge1xuICAvLyBSZXR1cm4gY2FsY3VsYXRlZCBwYWRkaW5ncyBpbiBjYXNlIG9mIHRoYXQgZGF0YSBpcyBpbnZhbGlkIHJldHVybiA1XG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgfHwgNTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29udGFpbmVyU2VsZWN0b3IgPSBvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcjtcbiAgdmFyIGltZ1BhdGggPSBvcHRpb25zLmltZ1BhdGg7XG4gIFxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKVxuICB7XG4gICAgdmFyIHNiZ25OZXR3b3JrQ29udGFpbmVyID0gJChjb250YWluZXJTZWxlY3Rvcik7XG5cbiAgICAvLyBjcmVhdGUgYW5kIGluaXQgY3l0b3NjYXBlOlxuICAgIHZhciBjeSA9IGN5dG9zY2FwZSh7XG4gICAgICBjb250YWluZXI6IHNiZ25OZXR3b3JrQ29udGFpbmVyLFxuICAgICAgc3R5bGU6IHNiZ25TdHlsZVNoZWV0LFxuICAgICAgc2hvd092ZXJsYXk6IGZhbHNlLCBtaW5ab29tOiAwLjEyNSwgbWF4Wm9vbTogMTYsXG4gICAgICBib3hTZWxlY3Rpb25FbmFibGVkOiB0cnVlLFxuICAgICAgbW90aW9uQmx1cjogdHJ1ZSxcbiAgICAgIHdoZWVsU2Vuc2l0aXZpdHk6IDAuMSxcbiAgICAgIHJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5jeSA9IHRoaXM7XG4gICAgICAgIC8vIElmIHVuZG9hYmxlIHJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIFxuICAvLyBOb3RlIHRoYXQgaW4gQ2hpU0UgdGhpcyBmdW5jdGlvbiBpcyBpbiBhIHNlcGVyYXRlIGZpbGUgYnV0IGluIHRoZSB2aWV3ZXIgaXQgaGFzIGp1c3QgMiBtZXRob2RzIGFuZCBzbyBpdCBpcyBsb2NhdGVkIGluIHRoaXMgZmlsZVxuICBmdW5jdGlvbiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpIHtcbiAgICAvLyBjcmVhdGUgb3IgZ2V0IHRoZSB1bmRvLXJlZG8gaW5zdGFuY2VcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuXG4gICAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVOb2Rlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGJpbmRDeUV2ZW50cygpIHtcbiAgICBjeS5vbigndGFwZW5kJywgJ25vZGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfSk7XG4gICAgXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5iZWZvcmVjb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAvL1RoZSBjaGlsZHJlbiBpbmZvIG9mIGNvbXBsZXggbm9kZXMgc2hvdWxkIGJlIHNob3duIHdoZW4gdGhleSBhcmUgY29sbGFwc2VkXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XG4gICAgICAgIC8vVGhlIG5vZGUgaXMgYmVpbmcgY29sbGFwc2VkIHN0b3JlIGluZm9sYWJlbCB0byB1c2UgaXQgbGF0ZXJcbiAgICAgICAgdmFyIGluZm9MYWJlbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xuICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsID0gaW5mb0xhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xuICAgICAgLy8gcmVtb3ZlIGJlbmQgcG9pbnRzIGJlZm9yZSBjb2xsYXBzZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgICAgICBpZiAoZWRnZS5oYXNDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKSkge1xuICAgICAgICAgIGVkZ2UucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XG4gICAgICAgICAgZGVsZXRlIGVkZ2UuX3ByaXZhdGUuY2xhc3Nlc1snZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYWZ0ZXJleHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgY3kubm9kZXMoKS51cGRhdGVDb21wb3VuZEJvdW5kcygpO1xuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2NvbnRlbnQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzYmduU3R5bGVTaGVldCA9IGN5dG9zY2FwZS5zdHlsZXNoZWV0KClcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAgICAgJ3RleHQtb3BhY2l0eSc6IDEsXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDEsXG4gICAgICAgICAgICAncGFkZGluZyc6IDBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50XCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAncGFkZGluZyc6IGdldENvbXBvdW5kUGFkZGluZ3NcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbP2Nsb25lbWFya2VyXVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGltZ1BhdGggKyAnL2Nsb25lX2JnLnBuZycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JzogJzUwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1oZWlnaHQnOiAnMjUlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2Nsb25lbWFya2VyJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbnRlbnQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ndGFnJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy4yNSxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLFxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICd0ZXh0LW1hcmdpbi15JyA6IC0xICogb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpwYXJlbnRbY2xhc3M9J2NvbXBhcnRtZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdwYWRkaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRDb21wb3VuZFBhZGRpbmdzKCkgKyBvcHRpb25zLmV4dHJhQ29tcGFydG1lbnRQYWRkaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtiYm94XVtjbGFzc11bY2xhc3MhPSdjb21wbGV4J11bY2xhc3MhPSdjb21wYXJ0bWVudCddW2NsYXNzIT0nc3VibWFwJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKGJib3gudyknLFxuICAgICAgICAgICAgJ2hlaWdodCc6ICdkYXRhKGJib3guaCknXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzYsXG4gICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ2Rhc2hlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxuICAgICAgICAgICAgJ3dpZHRoJzogMS4yNSxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2Fycm93LXNjYWxlJzogMS41XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6YWN0aXZlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnOCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2FyZGluYWxpdHkgPiAwXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RleHQtcm90YXRpb24nOiAnYXV0b3JvdGF0ZScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLXNoYXBlJzogJ3JlY3RhbmdsZScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItb3BhY2l0eSc6ICcxJyxcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci13aWR0aCc6ICcxJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtY29sb3InOiAnd2hpdGUnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1vcGFjaXR5JzogJzEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdjb25zdW1wdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEN5QXJyb3dTaGFwZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctc2hhcGUnOiAnbm9uZScsXG4gICAgICAgICAgICAnc291cmNlLWVuZHBvaW50JzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVuZFBvaW50KGVsZSwgJ3NvdXJjZScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd0YXJnZXQtZW5kcG9pbnQnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RW5kUG9pbnQoZWxlLCAndGFyZ2V0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdpbmhpYml0aW9uJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdwcm9kdWN0aW9uJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJjb3JlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LW9wYWNpdHknOiAnMC4yJywgJ3NlbGVjdGlvbi1ib3gtYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnXG4gICAgICAgICAgfSk7XG59O1xuIiwiLypcbiAqIFJlbmRlciBzYmduIHNwZWNpZmljIHNoYXBlcyB3aGljaCBhcmUgbm90IHN1cHBvcnRlZCBieSBjeXRvc2NhcGUuanMgY29yZVxuICovXG5cbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcblxudmFyIGN5TWF0aCA9IGN5dG9zY2FwZS5tYXRoO1xudmFyIGN5QmFzZU5vZGVTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZU5vZGVTaGFwZXM7XG52YXIgY3lTdHlsZVByb3BlcnRpZXMgPSBjeXRvc2NhcGUuc3R5bGVQcm9wZXJ0aWVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICQkID0gY3l0b3NjYXBlO1xuICBcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanMgYW5kIG1vZGlmaWVkXG4gIHZhciBkcmF3Um91bmRSZWN0YW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzICl7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gcmFkaXVzIHx8IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyggd2lkdGgsIGhlaWdodCApO1xuXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cblxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcbiAgICBjb250ZXh0Lm1vdmVUbyggeCwgeSAtIGhhbGZIZWlnaHQgKTtcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCArIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCwgeSArIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCAtIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxuICAgIGNvbnRleHQuYXJjVG8oIHggLSBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4LCB5IC0gaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gSm9pbiBsaW5lXG4gICAgY29udGV4dC5saW5lVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XG5cblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gIH07XG4gIFxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qc1xuICB2YXIgZHJhd1BvbHlnb25QYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcG9pbnRzICl7XG5cbiAgICB2YXIgaGFsZlcgPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIID0gaGVpZ2h0IC8gMjtcblxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XG5cbiAgICBjb250ZXh0Lm1vdmVUbyggeCArIGhhbGZXICogcG9pbnRzWzBdLCB5ICsgaGFsZkggKiBwb2ludHNbMV0gKTtcblxuICAgIGZvciggdmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aCAvIDI7IGkrKyApe1xuICAgICAgY29udGV4dC5saW5lVG8oIHggKyBoYWxmVyAqIHBvaW50c1sgaSAqIDJdLCB5ICsgaGFsZkggKiBwb2ludHNbIGkgKiAyICsgMV0gKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9O1xuICBcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduLnNiZ25TaGFwZXMgPSB7XG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICdwcm9jZXNzJzogdHJ1ZSxcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICdhc3NvY2lhdGlvbic6IHRydWVcbiAgfTtcblxuICB2YXIgdG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSAkJC5zYmduLnRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3UG9ydHNUb1BvbHlnb25TaGFwZSA9IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlLCBwb2ludHMpIHtcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcbiAgICAgIHZhciBwb3J0WCA9IHBvcnQueCAqIHdpZHRoIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKHBvcnRYLCBwb3J0WSxcbiAgICAgICAgICAgICAgcG9pbnRzLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCAvIDIsIGhlaWdodCAvIDIsIHBhZGRpbmcpO1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKHBvcnRYLCBwb3J0WSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjbG9zZXN0UG9pbnRbMF0sIGNsb3Nlc3RQb2ludFsxXSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuXG4gICAgICAvL2FkZCBhIGxpdHRsZSBibGFjayBjaXJjbGUgdG8gcG9ydHNcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBwb3J0WCwgcG9ydFksIDIsIDIpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB1bml0T2ZJbmZvUmFkaXVzID0gNDtcbiAgdmFyIHN0YXRlVmFyUmFkaXVzID0gMTU7XG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxuICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XG5cbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XG4gICAgdmFyIGJveFBhZGRpbmcgPSAxMCwgYmV0d2VlbkJveFBhZGRpbmcgPSA1O1xuICAgIHZhciBiZWdpblBvc1kgPSBoZWlnaHQgLyAyLCBiZWdpblBvc1ggPSB3aWR0aCAvIDI7XG5cbiAgICBzdGF0ZUFuZEluZm9zLnNvcnQoJCQuc2Jnbi5jb21wYXJlU3RhdGVzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xuLy8gICAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHN0YXRlLmJib3gueTtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcblxuICAgICAgaWYgKHJlbGF0aXZlWVBvcyA8IDApIHtcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIHVwV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcbiAgICAgICAgICBzdGF0ZUNlbnRlclkgPSBjZW50ZXJZIC0gYmVnaW5Qb3NZO1xuXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XG5cbiAgICAgICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdXBXaWR0aCA9IHVwV2lkdGggKyB3aWR0aCArIGJveFBhZGRpbmc7XG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcbiAgICAgICAgaWYgKGRvd25XaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgZG93bldpZHRoICsgc3RhdGVXaWR0aCAvIDI7XG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcblxuICAgICAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xuXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRvd25XaWR0aCA9IGRvd25XaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcbiAgICAgIH1cbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xuXG4gICAgICAvL3VwZGF0ZSBuZXcgc3RhdGUgYW5kIGluZm8gcG9zaXRpb24ocmVsYXRpdmUgdG8gbm9kZSBjZW50ZXIpXG4gICAgICBzdGF0ZS5iYm94LnggPSAoc3RhdGVDZW50ZXJYIC0gY2VudGVyWCkgKiAxMDAgLyBub2RlLndpZHRoKCk7XG4gICAgICBzdGF0ZS5iYm94LnkgPSAoc3RhdGVDZW50ZXJZIC0gY2VudGVyWSkgKiAxMDAgLyBub2RlLmhlaWdodCgpO1xuICAgIH1cbiAgfTtcblxuICAkJC5zYmduLmRyYXdTdGF0ZVRleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3ApIHtcbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHRleHRQcm9wLnN0YXRlLnZhbHVlIHx8ICcnO1xuICAgIHZhciBzdGF0ZVZhcmlhYmxlID0gdGV4dFByb3Auc3RhdGUudmFyaWFibGUgfHwgJyc7XG5cbiAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlVmFsdWUgKyAoc3RhdGVWYXJpYWJsZVxuICAgICAgICAgICAgPyBcIkBcIiArIHN0YXRlVmFyaWFibGVcbiAgICAgICAgICAgIDogXCJcIik7XG5cbiAgICB2YXIgZm9udFNpemUgPSA5OyAvLyBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xuXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xuICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGVMYWJlbDtcbiAgICB0ZXh0UHJvcC5jb2xvciA9IFwiIzBmMGYwZlwiO1xuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd0luZm9UZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XG4gICAgdmFyIGZvbnRTaXplID0gOTsgLy8gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcbiAgICB0ZXh0UHJvcC5mb250ID0gZm9udFNpemUgKyBcInB4IEFyaWFsXCI7XG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wLCB0cnVuY2F0ZSkge1xuICAgIHZhciBvbGRGb250ID0gY29udGV4dC5mb250O1xuICAgIGNvbnRleHQuZm9udCA9IHRleHRQcm9wLmZvbnQ7XG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcbiAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRleHRQcm9wLmNvbG9yO1xuICAgIHZhciBvbGRPcGFjaXR5ID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gdGV4dFByb3Aub3BhY2l0eTtcbiAgICB2YXIgdGV4dDtcbiAgICBcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHRleHRQcm9wLmxhYmVsIHx8ICcnO1xuICAgIFxuICAgIGlmICh0cnVuY2F0ZSA9PSBmYWxzZSkge1xuICAgICAgdGV4dCA9IHRleHRQcm9wLmxhYmVsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdHJ1bmNhdGVUZXh0KHRleHRQcm9wLCBjb250ZXh0LmZvbnQpO1xuICAgIH1cbiAgICBcbiAgICBjb250ZXh0LmZpbGxUZXh0KHRleHQsIHRleHRQcm9wLmNlbnRlclgsIHRleHRQcm9wLmNlbnRlclkpO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgY29udGV4dC5mb250ID0gb2xkRm9udDtcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkT3BhY2l0eTtcbiAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gIH07XG5cbiAgY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlID0gZnVuY3Rpb24gKHBvaW50MSwgcG9pbnQyKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3cocG9pbnQxWzBdIC0gcG9pbnQyWzBdLCAyKSArIE1hdGgucG93KHBvaW50MVsxXSAtIHBvaW50MlsxXSwgMik7XG4gICAgcmV0dXJuIE1hdGguc3FydChkaXN0YW5jZSk7XG4gIH07XG5cbiAgJCQuc2Jnbi5jb2xvcnMgPSB7XG4gICAgY2xvbmU6IFwiI2E5YTlhOVwiLFxuICAgIGFzc29jaWF0aW9uOiBcIiM2QjZCNkJcIixcbiAgICBwb3J0OiBcIiM2QjZCNkJcIlxuICB9O1xuXG5cbiAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKSB7XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoICYmIGkgPCA0OyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xuXG4gICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxuICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXG4gICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XG5cbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICAvL3ZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XG4gICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxuICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgbm9kZSwgdGhyZXNob2xkLCBwb2ludHMsIGNvcm5lclJhZGl1cykge1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXG4gICAgaWYgKGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgcG9pbnRzLFxuICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSAtIGNvcm5lclJhZGl1cyAvIDIsIHdpZHRoLCBoZWlnaHQgLSBjb3JuZXJSYWRpdXMgLyAzLCBbMCwgLTFdLFxuICAgICAgICAgICAgcGFkZGluZykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vY2hlY2sgcmVjdGFuZ2xlIGF0IGJvdHRvbVxuICAgIGlmIChjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIHBvaW50cyxcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXG4gICAgICAgICAgICBwYWRkaW5nKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy9jaGVjayBlbGxpcHNlc1xuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XG4gICAgICB4IC09IGNlbnRlclg7XG4gICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgIHggLz0gKHdpZHRoIC8gMiArIHBhZGRpbmcpO1xuICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgYm90dG9tIHJpZ2h0IHF1YXJ0ZXIgY2lyY2xlXG4gICAgaWYgKGNoZWNrSW5FbGxpcHNlKHgsIHksXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjb3JuZXJSYWRpdXMgKiAyLCBjb3JuZXJSYWRpdXMgKiAyLCBwYWRkaW5nKSkge1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBib3R0b20gbGVmdCBxdWFydGVyIGNpcmNsZVxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vd2UgbmVlZCB0byBmb3JjZSBvcGFjaXR5IHRvIDEgc2luY2Ugd2UgbWlnaHQgaGF2ZSBzdGF0ZSBhbmQgaW5mbyBib3hlcy5cbiAgLy9oYXZpbmcgb3BhcXVlIG5vZGVzIHdoaWNoIGhhdmUgc3RhdGUgYW5kIGluZm8gYm94ZXMgZ2l2ZXMgdW5wbGVhc2VudCByZXN1bHRzLlxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcGFyZW50T3BhY2l0eSA9IG5vZGUuZWZmZWN0aXZlT3BhY2l0eSgpO1xuICAgIGlmIChwYXJlbnRPcGFjaXR5ID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMF0gKyBcIixcIlxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVsxXSArIFwiLFwiXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcbiAgICAgICAgICAgICsgKDEgKiBub2RlLmNzcygnb3BhY2l0eScpICogcGFyZW50T3BhY2l0eSkgKyBcIilcIjtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGggPSBmdW5jdGlvbiAoXG4gICAgICAgICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4oaGFsZldpZHRoLCBoYWxmSGVpZ2h0KTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcblxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXG4gICAgY29udGV4dC5tb3ZlVG8oMCwgLWhhbGZIZWlnaHQpO1xuICAgIC8vIEFyYyBmcm9tIG1pZGRsZSB0b3AgdG8gcmlnaHQgc2lkZVxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBBcmMgZnJvbSBsZWZ0IHNpZGUgdG8gdG9wQm9yZGVyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gSm9pbiBsaW5lXG4gICAgY29udGV4dC5saW5lVG8oMCwgLWhhbGZIZWlnaHQpO1xuXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcblxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckVuZFggPSAwO1xuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XG5cbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xuICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgMyAqIE1hdGguUEkgLyA2LCA1ICogTWF0aC5QSSAvIDYpO1xuXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgIH1cbiAgfVxuICA7XG5cbiAgZnVuY3Rpb24gc2ltcGxlQ2hlbWljYWxSaWdodENsb25lKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuXG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgIHZhciBtYXJrZXJCZWdpblggPSAwO1xuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xuXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xuXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgIH1cbiAgfTtcblxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXdQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlID0gZnVuY3Rpb24gKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKSB7XG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG5cbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgY29udGV4dC5tb3ZlVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgMCk7XG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xuICAgIGNvbnRleHQubGluZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfTtcblxuICAkJC5zYmduLmlzTXVsdGltZXIgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBzYmduQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgaWYgKHNiZ25DbGFzcyAmJiBzYmduQ2xhc3MuaW5kZXhPZihcIm11bHRpbWVyXCIpICE9IC0xKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vdGhpcyBmdW5jdGlvbiBpcyBjcmVhdGVkIHRvIGhhdmUgc2FtZSBjb3JuZXIgbGVuZ3RoIHdoZW5cbiAgLy9jb21wbGV4J3Mgd2lkdGggb3IgaGVpZ2h0IGlzIGNoYW5nZWRcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvL2NwIHN0YW5kcyBmb3IgY29ybmVyIHByb3BvcnRpb25cbiAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcblxuICAgIHZhciBjb21wbGV4UG9pbnRzID0gWy0xICsgY3BYLCAtMSwgLTEsIC0xICsgY3BZLCAtMSwgMSAtIGNwWSwgLTEgKyBjcFgsXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xuXG4gICAgcmV0dXJuIGNvbXBsZXhQb2ludHM7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3UG9ydHNUb0VsbGlwc2VTaGFwZSA9IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xuICAgICAgdmFyIGNsb3Nlc3RQb2ludCA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcbiAgICAgICAgICAgICAgcG9ydFgsIHBvcnRZLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKGNsb3Nlc3RQb2ludFswXSwgY2xvc2VzdFBvaW50WzFdKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG4gIH07XG5cbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NvdXJjZSBhbmQgc2luaycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnbnVjbGVpYyBhY2lkIGZlYXR1cmUnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2Rpc3NvY2lhdGlvbicpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnbWFjcm9tb2xlY3VsZScpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCd1bnNwZWNpZmllZCBlbnRpdHknKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3Byb2Nlc3MnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ29taXR0ZWQgcHJvY2VzcycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5jZXJ0YWluIHByb2Nlc3MnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2Fzc29jaWF0aW9uJyk7XG5cbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubGluZVN0eWxlLmVudW1zLnB1c2goJ2NvbnN1bXB0aW9uJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdwcm9kdWN0aW9uJyk7XG5cbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25Ob2RlU2hhcGVzID0gZnVuY3Rpb24gKCkge1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSA9IHtcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKSxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3UG9ydHNUb1BvbHlnb25TaGFwZShjb250ZXh0LCBub2RlLCB0aGlzLnBvaW50cyk7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICByZXR1cm4gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBub2RlWCxcbiAgICAgICAgICAgICAgICBub2RlWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBzYmduQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMpO1xuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcblxuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0gPSB7XG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsKGNvbnRleHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubWFjcm9tb2xlY3VsZShjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubWFjcm9tb2xlY3VsZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzWydhc3NvY2lhdGlvbiddID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIGludGVyc2VjdCA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIgKyBwYWRkaW5nLFxuICAgICAgICAgICAgICAgIGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gaW50ZXJzZWN0O1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHggLT0gY2VudGVyWDtcbiAgICAgICAgeSAtPSBjZW50ZXJZO1xuXG4gICAgICAgIHggLz0gKHdpZHRoIC8gMiArIHBhZGRpbmcpO1xuICAgICAgICB5IC89IChoZWlnaHQgLyAyICsgcGFkZGluZyk7XG5cbiAgICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wiZGlzc29jaWF0aW9uXCJdID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG5cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyA0LCBoZWlnaHQgLyA0KTtcblxuICAgICAgICAvLyBBdCBvcmlnaW4sIHJhZGl1cyAxLCAwIHRvIDJwaVxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAwLCBNYXRoLlBJICogMiAqIDAuOTk5LCBmYWxzZSk7IC8vICowLjk5OSBiL2MgY2hyb21lIHJlbmRlcmluZyBidWcgb24gZnVsbCBjaXJjbGVcblxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKDQgLyB3aWR0aCwgNCAvIGhlaWdodCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XG5cbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHJldHVybiBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBub2RlWCxcbiAgICAgICAgICAgICAgICBub2RlWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIgKyBwYWRkaW5nLFxuICAgICAgICAgICAgICAgIGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICB4IC09IGNlbnRlclg7XG4gICAgICAgIHkgLT0gY2VudGVyWTtcblxuICAgICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0gPSB7XG4gICAgICBwb2ludHM6IFtdLFxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgY29ybmVyTGVuZ3RoOiAxMixcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgfSxcbi8vICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmludGVyc2VjdExpbmUsXG4vLyAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLm91dGVySGVpZ2h0KCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxuICAgICAgICAgICAgICAgIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IChub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSAobm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpKSArIHRocmVzaG9sZDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIDtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcblxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcbiAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxuICAgICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsXG4gICAgICAgICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBwdHMgPSBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdLnBvaW50cztcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoICogTWF0aC5zcXJ0KDIpIC8gMiwgaGVpZ2h0ICogTWF0aC5zcXJ0KDIpIC8gMik7XG5cbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhwdHNbNl0sIHB0c1s3XSk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gKHdpZHRoICogTWF0aC5zcXJ0KDIpKSwgMiAvIChoZWlnaHQgKiBNYXRoLnNxcnQoMikpKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc291cmNlQW5kU2luayhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxuICAgICAgY2hlY2tQb2ludDogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludFxuICAgIH07XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8kJC5zYmduLmRyYXdFbGxpcHNlUGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAvL2NvbnRleHQuZmlsbCgpO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICB9O1xuXG4gICQkLnNiZ24uY2xvbmVNYXJrZXIgPSB7XG4gICAgdW5zcGVjaWZpZWRFbnRpdHk6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcblxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICAgIHZhciBtYXJrZXJCZWdpblggPSAtMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcbiAgICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcblxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcblxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNvdXJjZUFuZFNpbms6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIudW5zcGVjaWZpZWRFbnRpdHkoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xuICAgIH0sXG4gICAgc2ltcGxlQ2hlbWljYWw6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbih3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xuICAgICAgICB2YXIgZmlyc3RDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclggPSBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzO1xuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XG5cbiAgICAgICAgc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgZmlyc3RDaXJjbGVDZW50ZXJYLCBmaXJzdENpcmNsZUNlbnRlclksXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xuXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBzZWNvbmRDaXJjbGVDZW50ZXJYLCBzZWNvbmRDaXJjbGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgdmFyIHJlY1BvaW50cyA9IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCk7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoIC0gMiAqIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gY29ybmVyUmFkaXVzIC8gMjtcblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCwgY2xvbmVYLCBjbG9uZVksIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCByZWNQb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGVydHVyYmluZ0FnZW50OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gaGVpZ2h0IC8gODtcblxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy01IC8gNiwgLTEsIDUgLyA2LCAtMSwgMSwgMSwgLTEsIDFdO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICByZW5kZXJlci5kcmF3UG9seWdvbihjb250ZXh0LFxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVjbGVpY0FjaWRGZWF0dXJlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzICogaGVpZ2h0IC8gODtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCxcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSwgY29ybmVyUmFkaXVzLCBvcGFjaXR5KTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1hY3JvbW9sZWN1bGU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KTtcbiAgICB9LFxuICAgIGNvbXBsZXg6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xuICAgICAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgKiBjcFkgLyAyO1xuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY2xvbmVIZWlnaHQgLyAyO1xuXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTEsIC0xLCAxLCAtMSwgMSAtIGNwWCwgMSwgLTEgKyBjcFgsIDFdO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcbiAgICAgICAgICAgICAgICBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgbWFya2VyUG9pbnRzKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuXG4vLyAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCwgaW50ZXJzZWN0aW9ucykge1xuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcbiAgICB2YXIgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XG4gICAgICB2YXIgY2hlY2tQb2ludCA9IFtpbnRlcnNlY3Rpb25zW2ldLCBpbnRlcnNlY3Rpb25zW2kgKyAxXV07XG4gICAgICB2YXIgZGlzdGFuY2UgPSBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UocG9pbnQsIGNoZWNrUG9pbnQpO1xuXG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2xvc2VzdEludGVyc2VjdGlvbjtcbiAgfTtcblxuICAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZSA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBub2RlWCwgbm9kZVksIGNvcm5lclJhZGl1cykge1xuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzLCB3ZSBoYXZlIG9ubHkgdHdvIGFyY3MgZm9yXG4gICAgLy9udWNsZWljIGFjaWQgZmVhdHVyZXNcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBMZWZ0XG4gICAge1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xuICB9O1xuXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxuICAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5Miwgbm9kZVgsIG5vZGVZLCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpIHtcblxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIHN0cmFpZ2h0IGxpbmUgc2VnbWVudHNcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cbiAgICB7XG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50c1xuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIExlZnRcbiAgICB7XG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wTGVmdENlbnRlclgsIHRvcExlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gdG9wTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9wIFJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wUmlnaHRDZW50ZXJYLCB0b3BSaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BSaWdodENlbnRlclkpIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gTGVmdFxuICAgIHtcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xuXG4gICAgdmFyIHcgPSB3aWR0aCAvIDIgKyBwYWRkaW5nO1xuICAgIHZhciBoID0gaGVpZ2h0IC8gMiArIHBhZGRpbmc7XG4gICAgdmFyIGFuID0gY2VudGVyWDtcbiAgICB2YXIgYm4gPSBjZW50ZXJZO1xuXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XG5cbiAgICB2YXIgbSA9IGRbMV0gLyBkWzBdO1xuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcbiAgICB2YXIgYSA9IGggKiBoICsgdyAqIHcgKiBtICogbTtcbiAgICB2YXIgYiA9IC0yICogYW4gKiBoICogaCArIDIgKiBtICogbiAqIHcgKiB3IC0gMiAqIGJuICogbSAqIHcgKiB3O1xuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXG4gICAgICAgICAgICBibiAqIGJuICogdyAqIHcgLSBoICogaCAqIHcgKiB3O1xuXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xuXG4gICAgaWYgKGRpc2NyaW1pbmFudCA8IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xuICAgIHZhciB0MiA9ICgtYiAtIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XG5cbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XG4gICAgdmFyIHhNYXggPSBNYXRoLm1heCh0MSwgdDIpO1xuXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xuICAgIHZhciB5TWF4ID0gbSAqIHhNYXggLSBtICogeDIgKyB5MjtcblxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcblxuICAgIHZhciBpbnRlcnNlY3Rpb25zID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xuXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiICYmIHN0YXRlQ291bnQgPCAyKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBwYWRkaW5nKTtcblxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChzdGF0ZUludGVyc2VjdExpbmVzKTtcblxuICAgICAgICBzdGF0ZUNvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIHZhciBpbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XG5cbiAgICAgICAgaWYgKGluZm9JbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xuXG4gICAgICAgIGluZm9Db3VudCsrO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPXBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuXG4gICAgdmFyIHN0YXRlQ291bnQgPSAwLCBpbmZvQ291bnQgPSAwO1xuLy8gICAgdGhyZXNob2xkID0gcGFyc2VGbG9hdCh0aHJlc2hvbGQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBwYXJzZUZsb2F0KHN0YXRlLmJib3guaCkgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XG5cbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHN0YXRlQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcblxuICAgICAgICBpZiAoaW5mb0NoZWNrUG9pbnQgPT0gdHJ1ZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpbmZvQ291bnQrKztcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XG4gICAgaWYgKHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59O1xuIiwiLypcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxuICovXG5cbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcbiAgICAvL3RoZSBsaXN0IG9mIHRoZSBlbGVtZW50IGNsYXNzZXMgaGFuZGxlZCBieSB0aGUgdG9vbFxuICAgIGhhbmRsZWRFbGVtZW50czoge1xuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAgICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlLFxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxuICAgICAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAnYXNzb2NpYXRpb24nOiB0cnVlLFxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXG4gICAgICAgICd0YWcnOiB0cnVlLFxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXG4gICAgICAgICdtb2R1bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXG4gICAgICAgICdpbmhpYml0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxuICAgICAgICAnZXF1aXZhbGVuY2UgYXJjJzogdHJ1ZSxcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdub3Qgb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnYW5kJzogdHJ1ZSxcbiAgICAgICAgJ29yJzogdHJ1ZSxcbiAgICAgICAgJ25vdCc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxuICAgIH0sXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcbiAgICAgICAgJ2Fzc29jaWF0aW9uJywgJ2Rpc3NvY2lhdGlvbicsICdwaGVub3R5cGUnXSxcbiAgICAgIFxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXG4gICAgZ2V0VG9wTW9zdE5vZGVzOiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByb290cztcbiAgICB9LFxuICAgIC8vVGhpcyBtZXRob2QgY2hlY2tzIGlmIGFsbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYXNzdW1pbmcgdGhhdCB0aGUgc2l6ZSBcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gbm9kZXNbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEoXCJwYXJlbnRcIikgIT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgbW92ZU5vZGVzOiBmdW5jdGlvbihwb3NpdGlvbkRpZmYsIG5vZGVzLCBub3RDYWxjVG9wTW9zdE5vZGVzKSB7XG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0b3BNb3N0Tm9kZXNbaV07XG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XG4gICAgICAgIG5vZGUucG9zaXRpb24oe1xuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xuICAgICAgdmFyIHBhbiA9IGN5LnBhbigpO1xuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XG5cbiAgICAgIHZhciB4ID0gKHJlbmRlcmVkUG9zaXRpb24ueCAtIHBhbi54KSAvIHpvb207XG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG4gICAgXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcbiAgICBnZXRQcm9jZXNzZXNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qoc2VsZWN0ZWRFbGVzKTtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkRWxlcztcbiAgICB9LFxuICAgIGdldE5laWdoYm91cnNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZk5vZGVzKHNlbGVjdGVkRWxlcyk7XG4gICAgICAgIHJldHVybiBlbGVzVG9IaWdobGlnaHQ7XG4gICAgfSxcbiAgICBnZXROZWlnaGJvdXJzT2ZOb2RlczogZnVuY3Rpb24oX25vZGVzKXtcbiAgICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICAgIG5vZGVzID0gbm9kZXMuYWRkKG5vZGVzLnBhcmVudHMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikpO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgdmFyIG5laWdoYm9yaG9vZEVsZXMgPSBub2Rlcy5uZWlnaGJvcmhvb2QoKTtcbiAgICAgICAgdmFyIGVsZXNUb1JldHVybiA9IG5vZGVzLmFkZChuZWlnaGJvcmhvb2RFbGVzKTtcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIHJldHVybiBlbGVzVG9SZXR1cm47XG4gICAgfSxcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cucGFyZW50cygpKTtcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3MhPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG5cbiAgICAgICAgdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKGVsZSwgaSl7XG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KGVsZS5fcHJpdmF0ZS5kYXRhLmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPT09IC0xO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5laWdoYm9yUHJvY2Vzc2VzID0gbm9uUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpLmZpbHRlcihmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xuXG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5wYXJlbnRzKCkpO1xuICAgICAgICAvL2FkZCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XG4gICAgfSxcbiAgICBleHRlbmRSZW1haW5pbmdOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzVG9GaWx0ZXIsIGFsbE5vZGVzKXtcbiAgICAgICAgbm9kZXNUb0ZpbHRlciA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0ZpbHRlcik7XG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9TaG93KTtcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xuICAgIH0sXG4gICAgZ2V0UHJvY2Vzc2VzT2ZOb2RlczogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFZGdlcyA9IGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWRnZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcblxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZGVsZXRlTm9kZXNTbWFydDogZnVuY3Rpb24gKF9ub2Rlcykge1xuICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICBcbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gICAgICB2YXIgbm9kZXNOb3RUb0tlZXAgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0tlZXApO1xuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgICAgZWxlcy5yZXN0b3JlKCk7XG4gICAgICAgIHJldHVybiBlbGVzO1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xuICAgIFxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZ2V0Q3lTaGFwZTogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BoZW5vdHlwZScpIHtcbiAgICAgICAgICAgIHJldHVybiAnaGV4YWdvbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZScgfHwgX2NsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBfY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnIHx8IF9jbGFzcyA9PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NsYXNzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XG4gICAgfSxcbiAgICBnZXRDeUFycm93U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAndHJpYW5nbGUtY3Jvc3MnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2luaGliaXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RlZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY2F0YWx5c2lzJykge1xuICAgICAgICAgICAgcmV0dXJuICdjaXJjbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3N0aW11bGF0aW9uJyB8fCBfY2xhc3MgPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdtb2R1bGF0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICdkaWFtb25kJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH0sXG4gICAgZ2V0RWxlbWVudENvbnRlbnQ6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdwaGVub3R5cGUnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihfY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jyl7XG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihfY2xhc3MgPT0gJ2NvbXBsZXgnKXtcbiAgICAgICAgICAgIGlmKGVsZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgICAgICBpZihlbGUuZGF0YSgnbGFiZWwnKSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnbGFiZWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihlbGUuZGF0YSgnaW5mb0xhYmVsJykpe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2luZm9MYWJlbCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdhbmQnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ0FORCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdvcicpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnT1InO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnbm90Jykge1xuICAgICAgICAgICAgY29udGVudCA9ICdOT1QnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJykge1xuICAgICAgICAgICAgY29udGVudCA9ICdcXFxcXFxcXCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnPyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gZWxlLndpZHRoKCkgfHwgZWxlLmRhdGEoJ2Jib3gnKS53O1xuXG4gICAgICAgIHZhciB0ZXh0UHJvcCA9IHtcbiAgICAgICAgICAgIGxhYmVsOiBjb250ZW50LFxuICAgICAgICAgICAgd2lkdGg6ICggX2NsYXNzPT0oJ2NvbXBsZXgnKSB8fCBfY2xhc3M9PSgnY29tcGFydG1lbnQnKSApP3RleHRXaWR0aCAqIDI6dGV4dFdpZHRoXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGZvbnQgPSB0aGlzLmdldExhYmVsVGV4dFNpemUoZWxlKSArIFwicHggQXJpYWxcIjtcbiAgICAgICAgcmV0dXJuIHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgZm9udCk7IC8vZnVuYy4gaW4gdGhlIGN5dG9zY2FwZS5yZW5kZXJlci5jYW52YXMuc2Jnbi1yZW5kZXJlci5qc1xuICAgIH0sXG4gICAgZ2V0TGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxuICAgICAgaWYgKF9jbGFzcyA9PT0gJ2Fzc29jaWF0aW9uJyB8fCBfY2xhc3MgPT09ICdkaXNzb2NpYXRpb24nKSB7XG4gICAgICAgIHJldHVybiAyMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jbGFzcyA9PT0gJ2FuZCcgfHwgX2NsYXNzID09PSAnb3InIHx8IF9jbGFzcyA9PT0gJ25vdCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMS41KTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jbGFzcyA9PT0gJ2NvbXBsZXgnIHx8IF9jbGFzcyA9PT0gJ2NvbXBhcnRtZW50Jykge1xuICAgICAgICByZXR1cm4gMTY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSk7XG4gICAgfSxcbiAgICBnZXRDYXJkaW5hbGl0eURpc3RhbmNlOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICB2YXIgc3JjUG9zID0gZWxlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XG4gICAgICB2YXIgdGd0UG9zID0gZWxlLnRhcmdldCgpLnBvc2l0aW9uKCk7XG5cbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdygoc3JjUG9zLnggLSB0Z3RQb3MueCksIDIpICsgTWF0aC5wb3coKHNyY1Bvcy55IC0gdGd0UG9zLnkpLCAyKSk7XG4gICAgICByZXR1cm4gZGlzdGFuY2UgKiAwLjE1O1xuICAgIH0sXG4gICAgZ2V0SW5mb0xhYmVsOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAvKiBJbmZvIGxhYmVsIG9mIGEgY29sbGFwc2VkIG5vZGUgY2Fubm90IGJlIGNoYW5nZWQgaWZcbiAgICAgICogdGhlIG5vZGUgaXMgY29sbGFwc2VkIHJldHVybiB0aGUgYWxyZWFkeSBleGlzdGluZyBpbmZvIGxhYmVsIG9mIGl0XG4gICAgICAqL1xuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jb2xsYXBzZWRDaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICogSWYgdGhlIG5vZGUgaXMgc2ltcGxlIHRoZW4gaXQncyBpbmZvbGFiZWwgaXMgZXF1YWwgdG8gaXQncyBsYWJlbFxuICAgICAgICovXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcbiAgICAgIHZhciBpbmZvTGFiZWwgPSBcIlwiO1xuICAgICAgLypcbiAgICAgICAqIEdldCB0aGUgaW5mbyBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZSBieSBpdCdzIGNoaWxkcmVuIGluZm8gcmVjdXJzaXZlbHlcbiAgICAgICAqL1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgdmFyIGNoaWxkSW5mbyA9IHRoaXMuZ2V0SW5mb0xhYmVsKGNoaWxkKTtcbiAgICAgICAgaWYgKGNoaWxkSW5mbyA9PSBudWxsIHx8IGNoaWxkSW5mbyA9PSBcIlwiKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5mb0xhYmVsICE9IFwiXCIpIHtcbiAgICAgICAgICBpbmZvTGFiZWwgKz0gXCI6XCI7XG4gICAgICAgIH1cbiAgICAgICAgaW5mb0xhYmVsICs9IGNoaWxkSW5mbztcbiAgICAgIH1cblxuICAgICAgLy9yZXR1cm4gaW5mbyBsYWJlbFxuICAgICAgcmV0dXJuIGluZm9MYWJlbDtcbiAgICB9LFxuICAgIGdldFF0aXBDb250ZW50OiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAvKiBDaGVjayB0aGUgbGFiZWwgb2YgdGhlIG5vZGUgaWYgaXQgaXMgbm90IHZhbGlkXG4gICAgICAqIHRoZW4gY2hlY2sgdGhlIGluZm9sYWJlbCBpZiBpdCBpcyBhbHNvIG5vdCB2YWxpZCBkbyBub3Qgc2hvdyBxdGlwXG4gICAgICAqL1xuICAgICAgdmFyIGxhYmVsID0gbm9kZS5kYXRhKCdsYWJlbCcpO1xuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xuICAgICAgICBsYWJlbCA9IHRoaXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBjb250ZW50SHRtbCA9IFwiPGIgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNnB4Oyc+XCIgKyBsYWJlbCArIFwiPC9iPlwiO1xuICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZXNhbmRpbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2JnbnN0YXRlYW5kaW5mbyA9IHN0YXRlc2FuZGluZm9zW2ldO1xuICAgICAgICBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhbHVlO1xuICAgICAgICAgIHZhciB2YXJpYWJsZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFyaWFibGU7XG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSAodmFyaWFibGUgPT0gbnVsbCAvKnx8IHR5cGVvZiBzdGF0ZVZhcmlhYmxlID09PSB1bmRlZmluZWQgKi8pID8gdmFsdWUgOlxuICAgICAgICAgICAgICAgICAgdmFsdWUgKyBcIkBcIiArIHZhcmlhYmxlO1xuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzYmduc3RhdGVhbmRpbmZvLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzYmduc3RhdGVhbmRpbmZvLmxhYmVsLnRleHQ7XG4gICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgc3RhdGVMYWJlbCA9IFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudEh0bWw7XG4gICAgfSxcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xuICAgIGdldER5bmFtaWNMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlLCBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQpIHtcbiAgICAgIHZhciBkeW5hbWljTGFiZWxTaXplID0gb3B0aW9ucy5keW5hbWljTGFiZWxTaXplO1xuICAgICAgZHluYW1pY0xhYmVsU2l6ZSA9IHR5cGVvZiBkeW5hbWljTGFiZWxTaXplID09PSAnZnVuY3Rpb24nID8gZHluYW1pY0xhYmVsU2l6ZS5jYWxsKCkgOiBkeW5hbWljTGFiZWxTaXplO1xuXG4gICAgICBpZiAoZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3NtYWxsJykge1xuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDAuNzU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAncmVndWxhcicpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ2xhcmdlJykge1xuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIGggPSBlbGUuaGVpZ2h0KCk7XG4gICAgICB2YXIgdGV4dEhlaWdodCA9IHBhcnNlSW50KGggLyAyLjQ1KSAqIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudDtcblxuICAgICAgcmV0dXJuIHRleHRIZWlnaHQ7XG4gICAgfSxcbiAgICAvKlxuICAgICogR2V0IHNvdXJjZS90YXJnZXQgZW5kIHBvaW50IG9mIGVkZ2UgaW4gJ3gtdmFsdWUlIHktdmFsdWUlJyBmb3JtYXQuIEl0IHJldHVybnMgJ291dHNpZGUtdG8tbm9kZScgaWYgdGhlcmUgaXMgbm8gc291cmNlL3RhcmdldCBwb3J0LlxuICAgICovXG4gICAgZ2V0RW5kUG9pbnQ6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZU9yVGFyZ2V0KSB7XG4gICAgICB2YXIgcG9ydElkID0gc291cmNlT3JUYXJnZXQgPT09ICdzb3VyY2UnID8gZWRnZS5kYXRhKCdwb3J0c291cmNlJykgOiBlZGdlLmRhdGEoJ3BvcnR0YXJnZXQnKTtcblxuICAgICAgaWYgKHBvcnRJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnb3V0c2lkZS10by1ub2RlJzsgLy8gSWYgdGhlcmUgaXMgbm8gcG9ydHNvdXJjZSByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUgd2hpY2ggaXMgJ291dHNpZGUtdG8tbm9kZSdcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZE5vZGUgPSBzb3VyY2VPclRhcmdldCA9PT0gJ3NvdXJjZScgPyBlZGdlLnNvdXJjZSgpIDogZWRnZS50YXJnZXQoKTtcbiAgICAgIHZhciBwb3J0cyA9IGVuZE5vZGUuZGF0YSgncG9ydHMnKTtcbiAgICAgIHZhciBwb3J0O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocG9ydHNbaV0uaWQgPT09IHBvcnRJZCkge1xuICAgICAgICAgIHBvcnQgPSBwb3J0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAnb3V0c2lkZS10by1ub2RlJzsgLy8gSWYgcG9ydCBpcyBub3QgZm91bmQgcmV0dXJuIHRoZSBkZWZhdWx0IHZhbHVlIHdoaWNoIGlzICdvdXRzaWRlLXRvLW5vZGUnXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnJyArIHBvcnQueCArICclICcgKyBwb3J0LnkgKyAnJSc7XG4gICAgfVxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4iLCIvKlxuICogRmlsZSBVdGlsaXRpZXM6IFRvIGJlIHVzZWQgb24gcmVhZC93cml0ZSBmaWxlIG9wZXJhdGlvblxuICovXG5cbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XG52YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3VpLXV0aWxpdGllcycpO1xudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcbnZhciB1cGRhdGVHcmFwaCA9IGdyYXBoVXRpbGl0aWVzLnVwZGF0ZUdyYXBoLmJpbmQoZ3JhcGhVdGlsaXRpZXMpO1xuXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG52YXIgc2F2ZUFzID0gbGlicy5zYXZlQXM7XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgU3RhcnRcbi8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MjQ1NzY3L2NyZWF0aW5nLWEtYmxvYi1mcm9tLWEtYmFzZTY0LXN0cmluZy1pbi1qYXZhc2NyaXB0XG5mdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICcnO1xuICBzbGljZVNpemUgPSBzbGljZVNpemUgfHwgNTEyO1xuXG4gIHZhciBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYjY0RGF0YSk7XG4gIHZhciBieXRlQXJyYXlzID0gW107XG5cbiAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoOyBvZmZzZXQgKz0gc2xpY2VTaXplKSB7XG4gICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xuXG4gICAgdmFyIGJ5dGVOdW1iZXJzID0gbmV3IEFycmF5KHNsaWNlLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xuICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XG5cbiAgICBieXRlQXJyYXlzLnB1c2goYnl0ZUFycmF5KTtcbiAgfVxuXG4gIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gIHJldHVybiBibG9iO1xufVxuXG5mdW5jdGlvbiBsb2FkWE1MRG9jKGZ1bGxGaWxlUGF0aCkge1xuICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XG4gIH1cbiAgeGh0dHAub3BlbihcIkdFVFwiLCBmdWxsRmlsZVBhdGgsIGZhbHNlKTtcbiAgeGh0dHAuc2VuZCgpO1xuICByZXR1cm4geGh0dHAucmVzcG9uc2VYTUw7XG59XG5cbi8vIFNob3VsZCB0aGlzIGJlIGV4cG9zZWQgb3Igc2hvdWxkIHRoaXMgYmUgbW92ZWQgdG8gdGhlIGhlbHBlciBmdW5jdGlvbnMgc2VjdGlvbj9cbmZ1bmN0aW9uIHRleHRUb1htbE9iamVjdCh0ZXh0KSB7XG4gIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xuICAgIHZhciBkb2MgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpO1xuICAgIGRvYy5hc3luYyA9ICdmYWxzZSc7XG4gICAgZG9jLmxvYWRYTUwodGV4dCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICB2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC94bWwnKTtcbiAgfVxuICByZXR1cm4gZG9jO1xufVxuLy8gSGVscGVyIGZ1bmN0aW9ucyBFbmRcblxuZnVuY3Rpb24gZmlsZVV0aWxpdGllcygpIHt9XG5maWxlVXRpbGl0aWVzLmxvYWRYTUxEb2MgPSBsb2FkWE1MRG9jO1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc1BuZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBwbmdDb250ZW50ID0gY3kucG5nKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xuXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXG4gIHZhciBiNjRkYXRhID0gcG5nQ29udGVudC5zdWJzdHIocG5nQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvcG5nXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsucG5nXCIpO1xufTtcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNKcGcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIganBnQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcblxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxuICB2YXIgYjY0ZGF0YSA9IGpwZ0NvbnRlbnQuc3Vic3RyKGpwZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL2pwZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLmpwZ1wiKTtcbn07XG5cbmZpbGVVdGlsaXRpZXMubG9hZFNhbXBsZSA9IGZ1bmN0aW9uKGZpbGVuYW1lLCBmb2xkZXJwYXRoKSB7XG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcbiAgXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGEgc2FtcGxlIGlzIGJlaW5nIGxvYWRlZFxuICAvLyBUcmlnZ2VyIGFuIGV2ZW50IGZvciB0aGlzIHB1cnBvc2UgYW5kIHNwZWNpZnkgdGhlICdmaWxlbmFtZScgYXMgYW4gZXZlbnQgcGFyYW1ldGVyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRTYW1wbGVTdGFydFxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVTdGFydFwiLCBbIGZpbGVuYW1lIF0gKTtcbiAgXG4gIC8vIGxvYWQgeG1sIGRvY3VtZW50IHVzZSBkZWZhdWx0IGZvbGRlciBwYXRoIGlmIGl0IGlzIG5vdCBzcGVjaWZpZWRcbiAgdmFyIHhtbE9iamVjdCA9IGxvYWRYTUxEb2MoKGZvbGRlcnBhdGggfHwgJ3NhbXBsZS1hcHAvc2FtcGxlcy8nKSArIGZpbGVuYW1lKTtcbiAgXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHhtbE9iamVjdCkpO1xuICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XG4gICAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlRW5kXCIsIFsgZmlsZW5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgc2FtcGxlIGlzIGxvYWRlZFxuICB9LCAwKTtcbn07XG5cbi8qXG4gIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24gcmVtb3RlbHkgZGVmaW5lZCB0byBhZGQgc3BlY2lmaWMgYmVoYXZpb3IgdGhhdCBpc24ndCBpbXBsZW1lbnRlZCBoZXJlLlxuICBpdCBpcyBjb21wbGV0ZWx5IG9wdGlvbmFsLlxuICBzaWduYXR1cmU6IGNhbGxiYWNrKHRleHRYbWwpXG4qL1xuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdWlVdGlsaXRpZXMuc3RhcnRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XG4gIFxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhbiBleHRlcm5hbCBmaWxlIGlzIGJlaW5nIGxvYWRlZFxuICAvLyBUcmlnZ2VyIGFuIGV2ZW50IGZvciB0aGlzIHB1cnBvc2UgYW5kIHNwZWNpZnkgdGhlICdmaWxlbmFtZScgYXMgYW4gZXZlbnQgcGFyYW1ldGVyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBBbGlhc2VzIGZvciBzYmdudml6TG9hZEZpbGVTdGFydFxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlU3RhcnRcIiwgWyBmaWxlLm5hbWUgXSApOyBcbiAgXG4gIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xuXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gdGhpcy5yZXN1bHQ7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSBjYWxsYmFjayh0ZXh0KTtcbiAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0KSkpO1xuICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICAgICAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZUVuZFwiLCBbIGZpbGUubmFtZSBdICk7IC8vIFRyaWdnZXIgYW4gZXZlbnQgc2lnbmFsaW5nIHRoYXQgYSBmaWxlIGlzIGxvYWRlZFxuICAgIH0sIDApO1xuICB9O1xuXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xufTtcbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTFRleHQgPSBmdW5jdGlvbih0ZXh0RGF0YSl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0RGF0YSkpKTtcbiAgICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICAgIH0sIDApO1xuXG59O1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc1NiZ25tbCA9IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKSB7XG4gIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbChmaWxlbmFtZSwgcmVuZGVySW5mbyk7XG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XG4gICAgdHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTg7XCIsXG4gIH0pO1xuICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xufTtcbmZpbGVVdGlsaXRpZXMuY29udmVydFNiZ25tbFRleHRUb0pzb24gPSBmdW5jdGlvbihzYmdubWxUZXh0KXtcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcbn07XG5cbmZpbGVVdGlsaXRpZXMuY3JlYXRlSnNvbiA9IGZ1bmN0aW9uKGpzb24pe1xuICAgIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xuICAgIHJldHVybiBzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3Qoc2Jnbm1sVGV4dCkpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVVdGlsaXRpZXM7XG4iLCIvKlxuICogQ29tbW9uIHV0aWxpdGllcyBmb3Igc2JnbnZpeiBncmFwaHNcbiAqL1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG5cbmZ1bmN0aW9uIGdyYXBoVXRpbGl0aWVzKCkge31cblxuZ3JhcGhVdGlsaXRpZXMudXBkYXRlR3JhcGggPSBmdW5jdGlvbihjeUdyYXBoKSB7XG4gIGNvbnNvbGUubG9nKCdjeSB1cGRhdGUgY2FsbGVkJyk7XG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaFN0YXJ0XCIgKTtcbiAgLy8gUmVzZXQgdW5kby9yZWRvIHN0YWNrIGFuZCBidXR0b25zIHdoZW4gYSBuZXcgZ3JhcGggaXMgbG9hZGVkXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5yZXNldCgpO1xuLy8gICAgdGhpcy5yZXNldFVuZG9SZWRvQnV0dG9ucygpO1xuICB9XG5cbiAgY3kuc3RhcnRCYXRjaCgpO1xuICAvLyBjbGVhciBkYXRhXG4gIGN5LnJlbW92ZSgnKicpO1xuICBjeS5hZGQoY3lHcmFwaCk7XG5cbiAgLy9hZGQgcG9zaXRpb24gaW5mb3JtYXRpb24gdG8gZGF0YSBmb3IgcHJlc2V0IGxheW91dFxuICB2YXIgcG9zaXRpb25NYXAgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjeUdyYXBoLm5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHhQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC54O1xuICAgIHZhciB5UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmJib3gueTtcbiAgICBwb3NpdGlvbk1hcFtjeUdyYXBoLm5vZGVzW2ldLmRhdGEuaWRdID0geyd4JzogeFBvcywgJ3knOiB5UG9zfTtcbiAgfVxuXG4gIHRoaXMucmVmcmVzaFBhZGRpbmdzKCk7IC8vIFJlY2FsY3VsYXRlcy9yZWZyZXNoZXMgdGhlIGNvbXBvdW5kIHBhZGRpbmdzXG4gIGN5LmVuZEJhdGNoKCk7XG4gIFxuICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KHtcbiAgICBuYW1lOiAncHJlc2V0JyxcbiAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwLFxuICAgIGZpdDogdHJ1ZSxcbiAgICBwYWRkaW5nOiA1MFxuICB9KTtcbiAgXG4gIC8vIENoZWNrIHRoaXMgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgIGxheW91dC5ydW4oKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSB0aGUgc3R5bGVcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgLy8gSW5pdGlsaXplIHRoZSBiZW5kIHBvaW50cyBvbmNlIHRoZSBlbGVtZW50cyBhcmUgY3JlYXRlZFxuICBpZiAoY3kuZWRnZUJlbmRFZGl0aW5nICYmIGN5LmVkZ2VCZW5kRWRpdGluZygnaW5pdGlhbGl6ZWQnKSkge1xuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XG4gIH1cbiAgXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaEVuZFwiICk7XG59O1xuXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XG4gIC8vQXMgZGVmYXVsdCB1c2UgdGhlIGNvbXBvdW5kIHBhZGRpbmcgdmFsdWVcbiAgaWYgKCFwYWRkaW5nUGVyY2VudCkge1xuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcbiAgICBwYWRkaW5nUGVyY2VudCA9IHR5cGVvZiBjb21wb3VuZFBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBjb21wb3VuZFBhZGRpbmcuY2FsbCgpIDogY29tcG91bmRQYWRkaW5nO1xuICB9XG5cbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIHRvdGFsID0gMDtcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGhlTm9kZSA9IG5vZGVzW2ldO1xuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLndpZHRoKCkpO1xuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUuaGVpZ2h0KCkpO1xuICAgICAgbnVtT2ZTaW1wbGVzKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNhbGNfcGFkZGluZyA9IChwYWRkaW5nUGVyY2VudCAvIDEwMCkgKiBNYXRoLmZsb29yKHRvdGFsIC8gKDIgKiBudW1PZlNpbXBsZXMpKTtcbiAgaWYgKGNhbGNfcGFkZGluZyA8IDUpIHtcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xuICB9XG5cbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcbn07XG5cbmdyYXBoVXRpbGl0aWVzLnJlY2FsY3VsYXRlUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLy8gdGhpcy5jYWxjdWxhdGVkUGFkZGluZ3MgaXMgbm90IHdvcmtpbmcgaGVyZSBcbiAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHJlZmVyZW5jZSB3aXRoIHRoaXMuY2FsY3VsYXRlZFBhZGRpbmdzIG9uY2UgdGhlIHJlYXNvbiBpcyBmaWd1cmVkIG91dFxuICBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBoVXRpbGl0aWVzOyIsInZhciB0eHRVdGlsID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpO1xudmFyIGxpYnNiZ25qcyA9IHJlcXVpcmUoJ2xpYnNiZ24tanMnKTtcbnZhciByZW5kZXJFeHRlbnNpb24gPSBsaWJzYmduanMucmVuZGVyRXh0ZW5zaW9uO1xudmFyIHBrZ1ZlcnNpb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uOyAvLyBuZWVkIGluZm8gYWJvdXQgc2JnbnZpeiB0byBwdXQgaW4geG1sXG52YXIgcGtnTmFtZSA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpLm5hbWU7XG5cbnZhciBqc29uVG9TYmdubWwgPSB7XG4gICAgLypcbiAgICAgICAgdGFrZXMgcmVuZGVySW5mbyBhcyBhbiBvcHRpb25hbCBhcmd1bWVudC4gSXQgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gc2F2ZVxuICAgICAgICB0aGUgc3R5bGUgYW5kIGNvbG9ycyB0byB0aGUgcmVuZGVyIGV4dGVuc2lvbi4gU2VlIG5ld3QvYXBwLXV0aWxpdGllcyBnZXRBbGxTdHlsZXMoKVxuICAgICAgICBTdHJ1Y3R1cmU6IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoZSBtYXAgYmFja2dyb3VuZCBjb2xvcixcbiAgICAgICAgICAgIGNvbG9yczoge1xuICAgICAgICAgICAgICB2YWxpZFhtbFZhbHVlOiBjb2xvcl9pZFxuICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgICAgICBzdHlsZUtleTE6IHtcbiAgICAgICAgICAgICAgICAgICAgaWRMaXN0OiBsaXN0IG9mIHRoZSBub2RlcyBpZHMgdGhhdCBoYXZlIHRoaXMgc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHlsZUtleTI6IC4uLlxuICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKi9cbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbyl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuICAgICAgICB2YXIgbWFwSUQgPSB0eHRVdGlsLmdldFhNTFZhbGlkSWQoZmlsZW5hbWUpO1xuICAgICAgICB2YXIgaGFzRXh0ZW5zaW9uID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNSZW5kZXJFeHRlbnNpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJJbmZvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGFzRXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIGhhc1JlbmRlckV4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL2FkZCBoZWFkZXJzXG4gICAgICAgIHhtbEhlYWRlciA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xuICAgICAgICB2YXIgc2JnbiA9IG5ldyBsaWJzYmduanMuU2Jnbih7eG1sbnM6ICdodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjMnfSk7XG4gICAgICAgIHZhciBtYXAgPSBuZXcgbGlic2JnbmpzLk1hcCh7bGFuZ3VhZ2U6ICdwcm9jZXNzIGRlc2NyaXB0aW9uJywgaWQ6IG1hcElEfSk7XG4gICAgICAgIGlmIChoYXNFeHRlbnNpb24pIHsgLy8gZXh0ZW5zaW9uIGlzIHRoZXJlXG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gbmV3IGxpYnNiZ25qcy5FeHRlbnNpb24oKTtcbiAgICAgICAgICAgIGlmIChoYXNSZW5kZXJFeHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICBleHRlbnNpb24uYWRkKHNlbGYuZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sKHJlbmRlckluZm8pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcC5zZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBhbGwgZ2x5cGhzXG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcbiAgICAgICAgY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighZWxlLmlzQ2hpbGQoKSlcbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwoZWxlKSk7IC8vIHJldHVybnMgcG90ZW50aWFsbHkgbW9yZSB0aGFuIDEgZ2x5cGhcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGFkZCB0aGVtIHRvIHRoZSBtYXBcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Z2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXAuYWRkR2x5cGgoZ2x5cGhMaXN0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBhbGwgYXJjc1xuICAgICAgICBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcC5hZGRBcmMoc2VsZi5nZXRBcmNTYmdubWwoZWxlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNiZ24uc2V0TWFwKG1hcCk7XG4gICAgICAgIHJldHVybiB4bWxIZWFkZXIgKyBzYmduLnRvWE1MKCk7XG4gICAgfSxcblxuICAgIC8vIHNlZSBjcmVhdGVTYmdubWwgZm9yIGluZm8gb24gdGhlIHN0cnVjdHVyZSBvZiByZW5kZXJJbmZvXG4gICAgZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sIDogZnVuY3Rpb24ocmVuZGVySW5mbykge1xuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBtYWluIGNvbnRhaW5lclxuICAgICAgICB2YXIgcmVuZGVySW5mb3JtYXRpb24gPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckluZm9ybWF0aW9uKHsgaWQ6ICdyZW5kZXJJbmZvcm1hdGlvbicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiByZW5kZXJJbmZvLmJhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtTmFtZTogcGtnTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW1WZXJzaW9uOiBwa2dWZXJzaW9uIH0pO1xuXG4gICAgICAgIC8vIHBvcHVsYXRlIGxpc3Qgb2YgY29sb3JzXG4gICAgICAgIHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKCk7XG4gICAgICAgIGZvciAodmFyIGNvbG9yIGluIHJlbmRlckluZm8uY29sb3JzKSB7XG4gICAgICAgICAgICB2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5Db2xvckRlZmluaXRpb24oe2lkOiByZW5kZXJJbmZvLmNvbG9yc1tjb2xvcl0sIHZhbHVlOiBjb2xvcn0pO1xuICAgICAgICAgICAgbGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hZGRDb2xvckRlZmluaXRpb24oY29sb3JEZWZpbml0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJJbmZvcm1hdGlvbi5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb25zKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpO1xuXG4gICAgICAgIC8vIHBvcHVsYXRlcyBzdHlsZXNcbiAgICAgICAgdmFyIGxpc3RPZlN0eWxlcyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiByZW5kZXJJbmZvLnN0eWxlcykge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gcmVuZGVySW5mby5zdHlsZXNba2V5XTtcbiAgICAgICAgICAgIHZhciB4bWxTdHlsZSA9IG5ldyByZW5kZXJFeHRlbnNpb24uU3R5bGUoe2lkOiB0eHRVdGlsLmdldFhNTFZhbGlkSWQoa2V5KSwgaWRMaXN0OiBzdHlsZS5pZExpc3R9KTtcbiAgICAgICAgICAgIHZhciBnID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJHcm91cCh7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IHN0eWxlLnByb3BlcnRpZXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogc3R5bGUucHJvcGVydGllcy5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IHN0eWxlLnByb3BlcnRpZXMuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6IHN0eWxlLnByb3BlcnRpZXMuZm9udFN0eWxlLFxuICAgICAgICAgICAgICAgIGZpbGw6IHN0eWxlLnByb3BlcnRpZXMuZmlsbCwgLy8gZmlsbCBjb2xvclxuICAgICAgICAgICAgICAgIHN0cm9rZTogc3R5bGUucHJvcGVydGllcy5zdHJva2UsIC8vIHN0cm9rZSBjb2xvclxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZVdpZHRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhtbFN0eWxlLnNldFJlbmRlckdyb3VwKGcpO1xuICAgICAgICAgICAgbGlzdE9mU3R5bGVzLmFkZFN0eWxlKHhtbFN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJJbmZvcm1hdGlvbi5zZXRMaXN0T2ZTdHlsZXMobGlzdE9mU3R5bGVzKTtcblxuICAgICAgICByZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XG4gICAgfSxcblxuICAgIGdldEdseXBoU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuICAgICAgICB2YXIgbm9kZUNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xuICAgICAgICB2YXIgZ2x5cGhMaXN0ID0gW107XG5cbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCwgY2xhc3NfOiBub2RlQ2xhc3N9KTtcblxuICAgICAgICAvLyBhc3NpZ24gY29tcGFydG1lbnRSZWZcbiAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgIGlmKG5vZGVDbGFzcyA9PT0gXCJjb21wYXJ0bWVudFwiKXtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgICAgICBpZihwYXJlbnQuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIGdseXBoLmNvbXBhcnRtZW50UmVmID0gcGFyZW50Ll9wcml2YXRlLmRhdGEuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtaXNjIGluZm9ybWF0aW9uXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgaWYodHlwZW9mIGxhYmVsICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgZ2x5cGguc2V0TGFiZWwobmV3IGxpYnNiZ25qcy5MYWJlbCh7dGV4dDogbGFiZWx9KSk7XG4gICAgICAgIC8vYWRkIGNsb25lIGluZm9ybWF0aW9uXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXIgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBnbHlwaC5zZXRDbG9uZShuZXcgbGlic2JnbmpzLkNsb25lVHlwZSgpKTtcbiAgICAgICAgLy9hZGQgYmJveCBpbmZvcm1hdGlvblxuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkR2x5cGhCYm94KG5vZGUpKTtcbiAgICAgICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxuICAgICAgICB2YXIgcG9ydHMgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHM7XG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgcG9ydHMubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgIHZhciB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgcG9ydHNbaV0ueCAqIG5vZGUud2lkdGgoKSAvIDEwMDtcbiAgICAgICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgcG9ydHNbaV0ueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XG5cbiAgICAgICAgICAgIGdseXBoLmFkZFBvcnQobmV3IGxpYnNiZ25qcy5wUG9ydCh7aWQ6IHBvcnRzW2ldLmlkLCB4OiB4LCB5OiB5fSkpO1xuICAgICAgICAgICAgLypzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHBvcnQgaWQ9J1wiICsgcG9ydHNbaV0uaWQrXG4gICAgICAgICAgICAgICAgXCInIHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggKyBcIicgLz5cXG5cIjsqL1xuICAgICAgICB9XG4gICAgICAgIC8vYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcy5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgdmFyIGJveEdseXBoID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zW2ldO1xuICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zSWQgPSBub2RlLl9wcml2YXRlLmRhdGEuaWQrXCJfXCIraTtcbiAgICAgICAgICAgIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInN0YXRlIHZhcmlhYmxlXCIpe1xuICAgICAgICAgICAgICAgIGdseXBoLmFkZEdseXBoTWVtYmVyKHRoaXMuYWRkU3RhdGVCb3hHbHlwaChib3hHbHlwaCwgc3RhdGVzYW5kaW5mb3NJZCwgbm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGdseXBoLmFkZEdseXBoTWVtYmVyKHRoaXMuYWRkSW5mb0JveEdseXBoKGJveEdseXBoLCBzdGF0ZXNhbmRpbmZvc0lkLCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgZ2x5cGggbWVtYmVycyB0aGF0IGFyZSBub3Qgc3RhdGUgdmFyaWFibGVzIG9yIHVuaXQgb2YgaW5mbzogc3VidW5pdHNcbiAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBsZXhcIiB8fCBub2RlQ2xhc3MgPT09IFwic3VibWFwXCIpe1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZ2x5cGhNZW1iZXJMaXN0ID0gc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IGdseXBoTWVtYmVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlckxpc3RbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VycmVudCBnbHlwaCBpcyBkb25lXG4gICAgICAgIGdseXBoTGlzdC5wdXNoKGdseXBoKTtcblxuICAgICAgICAvLyBrZWVwIGdvaW5nIHdpdGggYWxsIHRoZSBpbmNsdWRlZCBnbHlwaHNcbiAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwoZWxlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAgZ2x5cGhMaXN0O1xuICAgIH0sXG5cbiAgICBnZXRBcmNTYmdubWwgOiBmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuXG4gICAgICAgIC8vVGVtcG9yYXJ5IGhhY2sgdG8gcmVzb2x2ZSBcInVuZGVmaW5lZFwiIGFyYyBzb3VyY2UgYW5kIHRhcmdldHNcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xuICAgICAgICB2YXIgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2U7XG5cbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xuXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcblxuICAgICAgICB2YXIgYXJjSWQgPSBlZGdlLl9wcml2YXRlLmRhdGEuaWQ7XG4gICAgICAgIHZhciBhcmMgPSBuZXcgbGlic2JnbmpzLkFyYyh7aWQ6IGFyY0lkLCBzb3VyY2U6IGFyY1NvdXJjZSwgdGFyZ2V0OiBhcmNUYXJnZXQsIGNsYXNzXzogZWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzfSk7XG5cbiAgICAgICAgYXJjLnNldFN0YXJ0KG5ldyBsaWJzYmduanMuU3RhcnRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFl9KSk7XG5cbiAgICAgICAgLy8gRXhwb3J0IGJlbmQgcG9pbnRzIGlmIGVkZ2VCZW5kRWRpdGluZ0V4dGVuc2lvbiBpcyByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgdmFyIHNlZ3B0cyA9IGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuZ2V0U2VnbWVudFBvaW50cyhlZGdlKTtcbiAgICAgICAgICBpZihzZWdwdHMpe1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xuICAgICAgICAgICAgICB2YXIgYmVuZFggPSBzZWdwdHNbaV07XG4gICAgICAgICAgICAgIHZhciBiZW5kWSA9IHNlZ3B0c1tpICsgMV07XG5cbiAgICAgICAgICAgICAgYXJjLmFkZE5leHQobmV3IGxpYnNiZ25qcy5OZXh0VHlwZSh7eDogYmVuZFgsIHk6IGJlbmRZfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFyYy5zZXRFbmQobmV3IGxpYnNiZ25qcy5FbmRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFgsIHk6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWX0pKTtcblxuICAgICAgICB2YXIgY2FyZGluYWxpdHkgPSBlZGdlLl9wcml2YXRlLmRhdGEuY2FyZGluYWxpdHk7XG4gICAgICAgIGlmKHR5cGVvZiBjYXJkaW5hbGl0eSAhPSAndW5kZWZpbmVkJyAmJiBjYXJkaW5hbGl0eSAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcmMuYWRkR2x5cGgobmV3IGxpYnNiZ25qcy5HbHlwaCh7XG4gICAgICAgICAgICAgICAgaWQ6IGFyYy5pZCsnX2NhcmQnLFxuICAgICAgICAgICAgICAgIGNsYXNzXzogJ2NhcmRpbmFsaXR5JyxcbiAgICAgICAgICAgICAgICBsYWJlbDogbmV3IGxpYnNiZ25qcy5MYWJlbCh7dGV4dDogY2FyZGluYWxpdHl9KSxcbiAgICAgICAgICAgICAgICBiYm94OiBuZXcgbGlic2JnbmpzLkJib3goe3g6IDAsIHk6IDAsIHc6IDAsIGg6IDB9KSAvLyBkdW1teSBiYm94LCBuZWVkZWQgZm9yIGZvcm1hdCBjb21wbGlhbmNlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJjO1xuICAgIH0sXG5cbiAgICBhZGRHbHlwaEJib3ggOiBmdW5jdGlvbihub2RlKXtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggLSB3aWR0aC8yO1xuICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSAtIGhlaWdodC8yO1xuICAgICAgICByZXR1cm4gbmV3IGxpYnNiZ25qcy5CYm94KHt4OiB4LCB5OiB5LCB3OiB3aWR0aCwgaDogaGVpZ2h0fSk7XG4gICAgfSxcblxuICAgIGFkZFN0YXRlQW5kSW5mb0Jib3ggOiBmdW5jdGlvbihub2RlLCBib3hHbHlwaCl7XG4gICAgICAgIGJveEJib3ggPSBib3hHbHlwaC5iYm94O1xuXG4gICAgICAgIHZhciB4ID0gYm94QmJveC54IC8gMTAwICogbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgeSA9IGJveEJib3gueSAvIDEwMCAqIG5vZGUuaGVpZ2h0KCk7XG5cbiAgICAgICAgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArICh4IC0gYm94QmJveC53LzIpO1xuICAgICAgICB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgKHkgLSBib3hCYm94LmgvMik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBsaWJzYmduanMuQmJveCh7eDogeCwgeTogeSwgdzogYm94QmJveC53LCBoOiBib3hCYm94Lmh9KTtcbiAgICB9LFxuXG4gICAgYWRkU3RhdGVCb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIGlkLCBtYWluR2x5cGgpe1xuXG4gICAgICAgIHZhciBnbHlwaCA9IG5ldyBsaWJzYmduanMuR2x5cGgoe2lkOiBpZCwgY2xhc3NfOiAnc3RhdGUgdmFyaWFibGUnfSk7XG4gICAgICAgIHZhciBzdGF0ZSA9IG5ldyBsaWJzYmduanMuU3RhdGVUeXBlKCk7XG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhbHVlICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBub2RlLnN0YXRlLnZhbHVlO1xuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YXJpYWJsZSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHN0YXRlLnZhcmlhYmxlID0gbm9kZS5zdGF0ZS52YXJpYWJsZTtcbiAgICAgICAgZ2x5cGguc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcblxuICAgICAgICByZXR1cm4gZ2x5cGg7XG4gICAgfSxcblxuICAgIGFkZEluZm9Cb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIGlkLCBtYWluR2x5cGgpe1xuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogaWQsIGNsYXNzXzogJ3VuaXQgb2YgaW5mb3JtYXRpb24nfSk7XG4gICAgICAgIHZhciBsYWJlbCA9IG5ldyBsaWJzYmduanMuTGFiZWwoKTtcbiAgICAgICAgaWYodHlwZW9mIG5vZGUubGFiZWwudGV4dCAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGxhYmVsLnRleHQgPSBub2RlLmxhYmVsLnRleHQ7XG4gICAgICAgIGdseXBoLnNldExhYmVsKGxhYmVsKTtcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKSk7XG5cbiAgICAgICAgcmV0dXJuIGdseXBoO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ganNvblRvU2Jnbm1sO1xuIiwiLypcbiAqIExpc3RlbiBkb2N1bWVudCBmb3Iga2V5Ym9hcmQgaW5wdXRzIGFuZCBleHBvcnRzIHRoZSB1dGlsaXRpZXMgdGhhdCBpdCBtYWtlcyB1c2Ugb2ZcbiAqL1xudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG5cbnZhciBrZXlib2FyZElucHV0VXRpbGl0aWVzID0ge1xuICBpc051bWJlcktleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiAoIGUua2V5Q29kZSA+PSA0OCAmJiBlLmtleUNvZGUgPD0gNTcgKSB8fCAoIGUua2V5Q29kZSA+PSA5NiAmJiBlLmtleUNvZGUgPD0gMTA1ICk7XG4gIH0sXG4gIGlzRG90S2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTkwO1xuICB9LFxuICBpc01pbnVzU2lnbktleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEwOSB8fCBlLmtleUNvZGUgPT09IDE4OTtcbiAgfSxcbiAgaXNMZWZ0S2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzc7XG4gIH0sXG4gIGlzUmlnaHRLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzOTtcbiAgfSxcbiAgaXNCYWNrc3BhY2VLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSA4O1xuICB9LFxuICBpc1RhYktleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDk7XG4gIH0sXG4gIGlzRW50ZXJLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxMztcbiAgfSxcbiAgaXNJbnRlZ2VyRmllbGRJbnB1dDogZnVuY3Rpb24odmFsdWUsIGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0N0cmxPckNvbW1hbmRQcmVzc2VkKGUpIHx8IHRoaXMuaXNNaW51c1NpZ25LZXkoZSkgfHwgdGhpcy5pc051bWJlcktleShlKSBcbiAgICAgICAgICAgIHx8IHRoaXMuaXNCYWNrc3BhY2VLZXkoZSkgfHwgdGhpcy5pc1RhYktleShlKSB8fCB0aGlzLmlzTGVmdEtleShlKSB8fCB0aGlzLmlzUmlnaHRLZXkoZSkgfHwgdGhpcy5pc0VudGVyS2V5KGUpO1xuICB9LFxuICBpc0Zsb2F0RmllbGRJbnB1dDogZnVuY3Rpb24odmFsdWUsIGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKSB8fCB0aGlzLmlzRG90S2V5KGUpO1xuICB9LFxuICBpc0N0cmxPckNvbW1hbmRQcmVzc2VkOiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XG4gIH1cbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnLmludGVnZXItaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSk7XG4gIH0pO1xuICBcbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xuICAgIHJldHVybiBrZXlib2FyZElucHV0VXRpbGl0aWVzLmlzRmxvYXRGaWVsZElucHV0KHZhbHVlLCBlKTtcbiAgfSk7XG4gIFxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5pbnRlZ2VyLWlucHV0LC5mbG9hdC1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciBtaW4gICA9ICQodGhpcykuYXR0cignbWluJyk7XG4gICAgdmFyIG1heCAgID0gJCh0aGlzKS5hdHRyKCdtYXgnKTtcbiAgICB2YXIgdmFsdWUgPSBwYXJzZUZsb2F0KCQodGhpcykudmFsKCkpO1xuICAgIFxuICAgIGlmKG1pbiAhPSBudWxsKSB7XG4gICAgICBtaW4gPSBwYXJzZUZsb2F0KG1pbik7XG4gICAgfVxuICAgIFxuICAgIGlmKG1heCAhPSBudWxsKSB7XG4gICAgICBtYXggPSBwYXJzZUZsb2F0KG1heCk7XG4gICAgfVxuICAgIFxuICAgIGlmKG1pbiAhPSBudWxsICYmIHZhbHVlIDwgbWluKSB7XG4gICAgICB2YWx1ZSA9IG1pbjtcbiAgICB9XG4gICAgZWxzZSBpZihtYXggIT0gbnVsbCAmJiB2YWx1ZSA+IG1heCkge1xuICAgICAgdmFsdWUgPSBtYXg7XG4gICAgfVxuICAgIFxuICAgIGlmKGlzTmFOKHZhbHVlKSkge1xuICAgICAgaWYobWluICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSBtaW47XG4gICAgICB9XG4gICAgICBlbHNlIGlmKG1heCAhPSBudWxsKSB7XG4gICAgICAgIHZhbHVlID0gbWF4O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhbHVlID0gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgJCh0aGlzKS52YWwoXCJcIiArIHZhbHVlKTtcbiAgfSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZElucHV0VXRpbGl0aWVzO1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7XG5cbiIsIi8qIFxuICogVGhlc2UgYXJlIHRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBkaXJlY3RseSB1dGlsaXplZCBieSB0aGUgdXNlciBpbnRlcmFjdGlvbnMuXG4gKiBJZGVhbHksIHRoaXMgZmlsZSBpcyBqdXN0IHJlcXVpcmVkIGJ5IGluZGV4LmpzXG4gKi9cblxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xuXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG5cbi8vIEhlbHBlcnMgc3RhcnRcbmZ1bmN0aW9uIGJlZm9yZVBlcmZvcm1MYXlvdXQoKSB7XG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XG5cbiAgbm9kZXMucmVtb3ZlRGF0YShcInBvcnRzXCIpO1xuICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHNvdXJjZVwiKTtcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnR0YXJnZXRcIik7XG5cbiAgbm9kZXMuZGF0YShcInBvcnRzXCIsIFtdKTtcbiAgZWRnZXMuZGF0YShcInBvcnRzb3VyY2VcIiwgW10pO1xuICBlZGdlcy5kYXRhKFwicG9ydHRhcmdldFwiLCBbXSk7XG5cbiAgLy8gVE9ETyBkbyB0aGlzIGJ5IHVzaW5nIGV4dGVuc2lvbiBBUElcbiAgY3kuJCgnLmVkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XG59O1xuLy8gSGVscGVycyBlbmRcblxuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHt9XG5cbi8vIEV4cGFuZCBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5leHBhbmROb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzVG9FeHBhbmQgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMobm9kZXMpO1xuICBpZiAobm9kZXNUb0V4cGFuZC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFwiLCB7XG4gICAgICBub2Rlczogbm9kZXNUb0V4cGFuZCxcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmQobm9kZXMpO1xuICB9XG59O1xuXG4vLyBDb2xsYXBzZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5jb2xsYXBzZU5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2Uobm9kZXMpO1xuICB9XG59O1xuXG4vLyBDb2xsYXBzZSBhbGwgY29tcGxleGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQ29tcGxleGVzID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIGNvbXBsZXhlcyA9IGN5Lm5vZGVzKFwiW2NsYXNzPSdjb21wbGV4J11cIik7XG4gIGlmIChleHBhbmRDb2xsYXBzZS5jb2xsYXBzaWJsZU5vZGVzKGNvbXBsZXhlcykubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IGNvbXBsZXhlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlUmVjdXJzaXZlbHkoY29tcGxleGVzKTtcbiAgfVxufTtcblxuLy8gRXhwYW5kIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZXhwYW5kQ29tcGxleGVzID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKGN5Lm5vZGVzKCkuZmlsdGVyKFwiW2NsYXNzPSdjb21wbGV4J11cIikpO1xuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmV4cGFuZFJlY3Vyc2l2ZWx5KG5vZGVzKTtcbiAgfVxufTtcblxuLy8gQ29sbGFwc2UgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQWxsID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoJzp2aXNpYmxlJyk7XG4gIGlmIChleHBhbmRDb2xsYXBzZS5jb2xsYXBzaWJsZU5vZGVzKG5vZGVzKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KG5vZGVzKTtcbiAgfVxufTtcblxuLy8gRXhwYW5kIGFsbCBub2RlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5leHBhbmRBbGwgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMoY3kubm9kZXMoJzp2aXNpYmxlJykpO1xuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmV4cGFuZFJlY3Vyc2l2ZWx5KG5vZGVzKTtcbiAgfVxufTtcblxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcbi8vIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmhpZGVOb2Rlc1NtYXJ0ID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICBcbiAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKTtcbiAgdmFyIG5vZGVzVG9TaG93ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xuXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlkZVwiLCBub2Rlc1RvSGlkZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWRlKG5vZGVzVG9IaWRlKTtcbiAgfVxufTtcblxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdC4gXG4vLyBUaGVuIHVuaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0IGFuZCBoaWRlcyBvdGhlcnMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnNob3dOb2Rlc1NtYXJ0ID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICBcbiAgdmFyIGFsbE5vZGVzID0gY3kuZWxlbWVudHMoKTtcbiAgdmFyIG5vZGVzVG9TaG93ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XG4gIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG4gIFxuICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XG4gIH1cbn07XG5cbi8vIFVuaGlkZXMgYWxsIGVsZW1lbnRzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5zaG93QWxsID0gZnVuY3Rpb24oKSB7XG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICBpZiAoY3kuZWxlbWVudHMoKS5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93XCIsIGN5LmVsZW1lbnRzKCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuc2hvdyhjeS5lbGVtZW50cygpKTtcbiAgfVxufTtcblxuLy8gUmVtb3ZlcyB0aGUgZ2l2ZW4gZWxlbWVudHMgaW4gYSBzaW1wbGUgd2F5LiBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUgPSBmdW5jdGlvbihlbGVzKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHtcbiAgICAgIGVsZXM6IGVsZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzLnJlbW92ZSgpO1xuICB9XG59O1xuXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0IGFuZCByZW1vdmVzIHRoZSByZXN1bHRpbmcgbGlzdC4gXG4vLyBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7XG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVOb2Rlc1NtYXJ0XCIsIHtcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgIGVsZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0KG5vZGVzKTtcbiAgfVxufTtcblxuLy8gSGlnaGxpZ2h0cyBuZWlnaGJvdXJzIG9mIHRoZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0TmVpZ2hib3VycyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmdldE5laWdoYm91cnNPZk5vZGVzKG5vZGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQoZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxufTtcblxuLy8gRmluZHMgdGhlIGVsZW1lbnRzIHdob3NlIGxhYmVsIGluY2x1ZGVzIHRoZSBnaXZlbiBsYWJlbCBhbmQgaGlnaGxpZ2h0cyBwcm9jZXNzZXMgb2YgdGhvc2UgZWxlbWVudHMuXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5zZWFyY2hCeUxhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcbiAgaWYgKGxhYmVsLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICBpZiAoZWxlLmRhdGEoXCJsYWJlbFwiKSAmJiBlbGUuZGF0YShcImxhYmVsXCIpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsYWJlbCkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgaWYgKG5vZGVzVG9IaWdobGlnaHQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG5cbiAgbm9kZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0hpZ2hsaWdodCk7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgbm9kZXNUb0hpZ2hsaWdodCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQobm9kZXNUb0hpZ2hsaWdodCk7XG4gIH1cbn07XG5cbi8vIEhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRoZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xuICB9XG59O1xuXG4vLyBVbmhpZ2hsaWdodHMgYW55IGhpZ2hsaWdodGVkIGVsZW1lbnQuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKGVsZW1lbnRVdGlsaXRpZXMubm9uZUlzTm90SGlnaGxpZ2h0ZWQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZUhpZ2hsaWdodHNcIik7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5yZW1vdmVIaWdobGlnaHRzKCk7XG4gIH1cbn07XG5cbi8vIFBlcmZvcm1zIGxheW91dCBieSBnaXZlbiBsYXlvdXRPcHRpb25zLiBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uIEhvd2V2ZXIsIGJ5IHNldHRpbmcgbm90VW5kb2FibGUgcGFyYW1ldGVyXG4vLyB0byBhIHRydXRoeSB2YWx1ZSB5b3UgY2FuIGZvcmNlIGFuIHVuZGFibGUgbGF5b3V0IG9wZXJhdGlvbiBpbmRlcGVuZGFudCBvZiAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dE9wdGlvbnMsIG5vdFVuZG9hYmxlKSB7XG4gIC8vIFRoaW5ncyB0byBkbyBiZWZvcmUgcGVyZm9ybWluZyBsYXlvdXRcbiAgYmVmb3JlUGVyZm9ybUxheW91dCgpO1xuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlIHx8IG5vdFVuZG9hYmxlKSB7IC8vICdub3RVbmRvYWJsZScgZmxhZyBjYW4gYmUgdXNlZCB0byBoYXZlIGNvbXBvc2l0ZSBhY3Rpb25zIGluIHVuZG8vcmVkbyBzdGFja1xuICAgIHZhciBsYXlvdXQgPSBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XG4gICAgXG4gICAgLy8gQ2hlY2sgdGhpcyBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICAgIGxheW91dC5ydW4oKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XG4gICAgICBvcHRpb25zOiBsYXlvdXRPcHRpb25zLFxuICAgICAgZWxlczogY3kuZWxlbWVudHMoKS5maWx0ZXIoJzp2aXNpYmxlJylcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQ3JlYXRlcyBhbiBzYmdubWwgZmlsZSBjb250ZW50IGZyb20gdGhlIGV4aXNpbmcgZ3JhcGggYW5kIHJldHVybnMgaXQuXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVNiZ25tbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xufTtcblxuLy8gQ29udmVydHMgZ2l2ZW4gc2Jnbm1sIGRhdGEgdG8gYSBqc29uIG9iamVjdCBpbiBhIHNwZWNpYWwgZm9ybWF0IFxuLy8gKGh0dHA6Ly9qcy5jeXRvc2NhcGUub3JnLyNub3RhdGlvbi9lbGVtZW50cy1qc29uKSBhbmQgcmV0dXJucyBpdC5cbm1haW5VdGlsaXRpZXMuY29udmVydFNiZ25tbFRvSnNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xufTtcblxuLy8gQ3JlYXRlIHRoZSBxdGlwIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBub2RlIGFuZCByZXR1cm5zIGl0LlxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0UXRpcENvbnRlbnQobm9kZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcbiAqL1xuXG4vLyBkZWZhdWx0IG9wdGlvbnNcbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBleHRyYSBwYWRkaW5nIGZvciBjb21wYXJ0bWVudFxuICBleHRyYUNvbXBhcnRtZW50UGFkZGluZzogMTAsXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZVxufTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbn07XG5cbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgfVxuICBcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgfVxuXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzO1xuIiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgbGlic2JnbmpzID0gcmVxdWlyZSgnbGlic2Jnbi1qcycpO1xudmFyIHJlbmRlckV4dGVuc2lvbiA9IGxpYnNiZ25qcy5yZW5kZXJFeHRlbnNpb247XG5cbnZhciBzYmdubWxUb0pzb24gPSB7XG4gIGluc2VydGVkTm9kZXM6IHt9LFxuICBnZXRBbGxDb21wYXJ0bWVudHM6IGZ1bmN0aW9uIChnbHlwaExpc3QpIHtcbiAgICB2YXIgY29tcGFydG1lbnRzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdseXBoTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGdseXBoTGlzdFtpXS5jbGFzc18gPT0gJ2NvbXBhcnRtZW50Jykge1xuICAgICAgICB2YXIgY29tcGFydG1lbnQgPSBnbHlwaExpc3RbaV07XG4gICAgICAgIHZhciBiYm94ID0gY29tcGFydG1lbnQuYmJveDtcbiAgICAgICAgY29tcGFydG1lbnRzLnB1c2goe1xuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94LngpLFxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94LnkpLFxuICAgICAgICAgICd3JzogcGFyc2VGbG9hdChiYm94LncpLFxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94LmgpLFxuICAgICAgICAgICdpZCc6IGNvbXBhcnRtZW50LmlkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBhcnRtZW50cy5zb3J0KGZ1bmN0aW9uIChjMSwgYzIpIHtcbiAgICAgIGlmIChjMS5oICogYzEudyA8IGMyLmggKiBjMi53KSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChjMS5oICogYzEudyA+IGMyLmggKiBjMi53KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tcGFydG1lbnRzO1xuICB9LFxuICBpc0luQm91bmRpbmdCb3g6IGZ1bmN0aW9uIChiYm94MSwgYmJveDIpIHtcbiAgICBpZiAoYmJveDEueCA+IGJib3gyLnggJiZcbiAgICAgICAgYmJveDEueSA+IGJib3gyLnkgJiZcbiAgICAgICAgYmJveDEueCArIGJib3gxLncgPCBiYm94Mi54ICsgYmJveDIudyAmJlxuICAgICAgICBiYm94MS55ICsgYmJveDEuaCA8IGJib3gyLnkgKyBiYm94Mi5oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBiYm94UHJvcDogZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBiYm94ID0gZWxlLmJib3g7XG5cbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxuICAgIGJib3gueCA9IHBhcnNlRmxvYXQoYmJveC54KSArIHBhcnNlRmxvYXQoYmJveC53KSAvIDI7XG4gICAgYmJveC55ID0gcGFyc2VGbG9hdChiYm94LnkpICsgcGFyc2VGbG9hdChiYm94LmgpIC8gMjtcblxuICAgIHJldHVybiBiYm94O1xuICB9LFxuICBzdGF0ZUFuZEluZm9CYm94UHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xuICAgIHZhciB4UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LngpO1xuICAgIHZhciB5UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LnkpO1xuXG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcblxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMiAtIHhQb3M7XG4gICAgYmJveC55ID0gcGFyc2VGbG9hdChiYm94LnkpICsgcGFyc2VGbG9hdChiYm94LmgpIC8gMiAtIHlQb3M7XG5cbiAgICBiYm94LnggPSBiYm94LnggLyBwYXJzZUZsb2F0KHBhcmVudEJib3gudykgKiAxMDA7XG4gICAgYmJveC55ID0gYmJveC55IC8gcGFyc2VGbG9hdChwYXJlbnRCYm94LmgpICogMTAwO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gIGZpbmRDaGlsZE5vZGVzOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcbiAgICAvLyBmaW5kIGNoaWxkIG5vZGVzIGF0IGRlcHRoIGxldmVsIG9mIDEgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnRcbiAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBlbGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSAmJiBjaGlsZC50YWdOYW1lID09PSBjaGlsZFRhZ05hbWUpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSxcbiAgZmluZENoaWxkTm9kZTogZnVuY3Rpb24gKGVsZSwgY2hpbGRUYWdOYW1lKSB7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsIGNoaWxkVGFnTmFtZSk7XG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aCA+IDAgPyBub2Rlc1swXSA6IHVuZGVmaW5lZDtcbiAgfSxcbiAgc3RhdGVBbmRJbmZvUHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc3RhdGVBbmRJbmZvQXJyYXkgPSBbXTtcblxuICAgIHZhciBjaGlsZEdseXBocyA9IGVsZS5nbHlwaE1lbWJlcnM7IC8vIHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnbHlwaCA9IGNoaWxkR2x5cGhzW2ldO1xuICAgICAgdmFyIGluZm8gPSB7fTtcblxuICAgICAgaWYgKGdseXBoLmNsYXNzXyA9PT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XG4gICAgICAgIGluZm8uaWQgPSBnbHlwaC5pZCB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc18gfHwgdW5kZWZpbmVkO1xuICAgICAgICBpbmZvLmxhYmVsID0ge1xuICAgICAgICAgICd0ZXh0JzogKGdseXBoLmxhYmVsICYmIGdseXBoLmxhYmVsLnRleHQpIHx8IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgICAgICBpbmZvLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKGdseXBoLCBwYXJlbnRCYm94KTtcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChpbmZvKTtcbiAgICAgIH0gZWxzZSBpZiAoZ2x5cGguY2xhc3NfID09PSAnc3RhdGUgdmFyaWFibGUnKSB7XG4gICAgICAgIGluZm8uaWQgPSBnbHlwaC5pZCB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc18gfHwgdW5kZWZpbmVkO1xuICAgICAgICB2YXIgc3RhdGUgPSBnbHlwaC5zdGF0ZTtcbiAgICAgICAgdmFyIHZhbHVlID0gKHN0YXRlICYmIHN0YXRlLnZhbHVlKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHZhciB2YXJpYWJsZSA9IChzdGF0ZSAmJiBzdGF0ZS52YXJpYWJsZSkgfHwgdW5kZWZpbmVkO1xuICAgICAgICBpbmZvLnN0YXRlID0ge1xuICAgICAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgICAgICd2YXJpYWJsZSc6IHZhcmlhYmxlXG4gICAgICAgIH07XG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHN0YXRlQW5kSW5mb0FycmF5O1xuICB9LFxuICBhZGRQYXJlbnRJbmZvVG9Ob2RlOiBmdW5jdGlvbiAoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY29tcGFydG1lbnRSZWYgPSBlbGUuY29tcGFydG1lbnRSZWY7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBub2RlT2JqLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tcGFydG1lbnRSZWYpIHtcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRSZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gJyc7XG5cbiAgICAgIC8vIGFkZCBjb21wYXJ0bWVudCBhY2NvcmRpbmcgdG8gZ2VvbWV0cnlcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBiYm94RWwgPSBlbGUuYmJveDtcbiAgICAgICAgdmFyIGJib3ggPSB7XG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3hFbC54KSxcbiAgICAgICAgICAneSc6IHBhcnNlRmxvYXQoYmJveEVsLnkpLFxuICAgICAgICAgICd3JzogcGFyc2VGbG9hdChiYm94RWwudyksXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3hFbC5oKSxcbiAgICAgICAgICAnaWQnOiBlbGUuaWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcbiAgICAgICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50c1tpXS5pZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYWRkQ3l0b3NjYXBlSnNOb2RlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBub2RlT2JqID0ge307XG5cbiAgICAvLyBhZGQgaWQgaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmlkID0gZWxlLmlkO1xuICAgIC8vIGFkZCBub2RlIGJvdW5kaW5nIGJveCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouYmJveCA9IHNlbGYuYmJveFByb3AoZWxlKTtcbiAgICAvLyBhZGQgY2xhc3MgaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmNsYXNzID0gZWxlLmNsYXNzXztcbiAgICAvLyBhZGQgbGFiZWwgaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmxhYmVsID0gKGVsZS5sYWJlbCAmJiBlbGUubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkO1xuICAgIC8vIGFkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLnN0YXRlc2FuZGluZm9zID0gc2VsZi5zdGF0ZUFuZEluZm9Qcm9wKGVsZSwgbm9kZU9iai5iYm94KTtcbiAgICAvLyBhZGRpbmcgcGFyZW50IGluZm9ybWF0aW9uXG4gICAgc2VsZi5hZGRQYXJlbnRJbmZvVG9Ob2RlKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xuXG4gICAgLy8gYWRkIGNsb25lIGluZm9ybWF0aW9uXG4gICAgaWYgKGVsZS5jbG9uZSkge1xuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gYWRkIHBvcnQgaW5mb3JtYXRpb25cbiAgICB2YXIgcG9ydHMgPSBbXTtcbiAgICB2YXIgcG9ydEVsZW1lbnRzID0gZWxlLnBvcnRzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3J0RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3J0RWwgPSBwb3J0RWxlbWVudHNbaV07XG4gICAgICB2YXIgaWQgPSBwb3J0RWwuaWQ7XG4gICAgICB2YXIgcmVsYXRpdmVYUG9zID0gcGFyc2VGbG9hdChwb3J0RWwueCkgLSBub2RlT2JqLmJib3gueDtcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC55KSAtIG5vZGVPYmouYmJveC55O1xuXG4gICAgICByZWxhdGl2ZVhQb3MgPSByZWxhdGl2ZVhQb3MgLyBwYXJzZUZsb2F0KG5vZGVPYmouYmJveC53KSAqIDEwMDtcbiAgICAgIHJlbGF0aXZlWVBvcyA9IHJlbGF0aXZlWVBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogMTAwO1xuXG4gICAgICBwb3J0cy5wdXNoKHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICB4OiByZWxhdGl2ZVhQb3MsXG4gICAgICAgIHk6IHJlbGF0aXZlWVBvc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xuXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZSA9IHtkYXRhOiBub2RlT2JqfTtcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc05vZGUpO1xuICB9LFxuICB0cmF2ZXJzZU5vZGVzOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XG4gICAgdmFyIGVsSWQgPSBlbGUuaWQ7XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NfXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBhZGQgY29tcGxleCBub2RlcyBoZXJlXG5cbiAgICB2YXIgZWxlQ2xhc3MgPSBlbGUuY2xhc3NfO1xuXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdjb21wbGV4IG11bHRpbWVyJyB8fCBlbGVDbGFzcyA9PT0gJ3N1Ym1hcCcpIHtcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG5cbiAgICAgIHZhciBjaGlsZEdseXBocyA9IGVsZS5nbHlwaE1lbWJlcnM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkR2x5cGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBnbHlwaCA9IGNoaWxkR2x5cGhzW2ldO1xuICAgICAgICB2YXIgZ2x5cGhDbGFzcyA9IGdseXBoLmNsYXNzXztcbiAgICAgICAgaWYgKGdseXBoQ2xhc3MgIT09ICdzdGF0ZSB2YXJpYWJsZScgJiYgZ2x5cGhDbGFzcyAhPT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XG4gICAgICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKGdseXBoLCBqc29uQXJyYXksIGVsSWQsIGNvbXBhcnRtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcbiAgICB9XG4gIH0sXG4gIGdldFBvcnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgcmV0dXJuICggeG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyA9IHhtbE9iamVjdC5fY2FjaGVkUG9ydHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BvcnQnKSk7XG4gIH0sXG4gIGdldEdseXBoczogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xuICAgIHZhciBnbHlwaHMgPSB4bWxPYmplY3QuX2NhY2hlZEdseXBocztcblxuICAgIGlmICghZ2x5cGhzKSB7XG4gICAgICBnbHlwaHMgPSB4bWxPYmplY3QuX2NhY2hlZEdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzIHx8IHhtbE9iamVjdC5xdWVyeVNlbGVjdG9yQWxsKCdnbHlwaCcpO1xuXG4gICAgICB2YXIgaWQyZ2x5cGggPSB4bWxPYmplY3QuX2lkMmdseXBoID0ge307XG5cbiAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGdseXBocy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdmFyIGcgPSBnbHlwaHNbaV07XG4gICAgICAgIHZhciBpZCA9IGcuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG4gICAgICAgIGlkMmdseXBoWyBpZCBdID0gZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ2x5cGhzO1xuICB9LFxuICBnZXRHbHlwaEJ5SWQ6IGZ1bmN0aW9uICh4bWxPYmplY3QsIGlkKSB7XG4gICAgdGhpcy5nZXRHbHlwaHMoeG1sT2JqZWN0KTsgLy8gbWFrZSBzdXJlIGNhY2hlIGlzIGJ1aWx0XG5cbiAgICByZXR1cm4geG1sT2JqZWN0Ll9pZDJnbHlwaFtpZF07XG4gIH0sXG4gIGdldEFyY1NvdXJjZUFuZFRhcmdldDogZnVuY3Rpb24gKGFyYywgeG1sT2JqZWN0KSB7XG4gICAgLy8gc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcbiAgICB2YXIgc291cmNlID0gYXJjLnNvdXJjZTtcbiAgICB2YXIgdGFyZ2V0ID0gYXJjLnRhcmdldDtcbiAgICB2YXIgc291cmNlTm9kZUlkO1xuICAgIHZhciB0YXJnZXROb2RlSWQ7XG5cbiAgICB2YXIgc291cmNlRXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCBzb3VyY2UpO1xuICAgIHZhciB0YXJnZXRFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHRhcmdldCk7XG5cbiAgICBpZiAoc291cmNlRXhpc3RzKSB7XG4gICAgICBzb3VyY2VOb2RlSWQgPSBzb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldEV4aXN0cykge1xuICAgICAgdGFyZ2V0Tm9kZUlkID0gdGFyZ2V0O1xuICAgIH1cblxuXG4gICAgdmFyIGk7XG4gICAgdmFyIHBvcnRFbHMgPSB0aGlzLmdldFBvcnRzKHhtbE9iamVjdCk7XG4gICAgdmFyIHBvcnQ7XG4gICAgaWYgKHNvdXJjZU5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gc291cmNlKSB7XG4gICAgICAgICAgc291cmNlTm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0YXJnZXROb2RlSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0Tm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7J3NvdXJjZSc6IHNvdXJjZU5vZGVJZCwgJ3RhcmdldCc6IHRhcmdldE5vZGVJZH07XG4gIH0sXG5cbiAgZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgdmFyIGNoaWxkcmVuID0gZWxlLm5leHRzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvc1ggPSBjaGlsZHJlbltpXS54O1xuICAgICAgdmFyIHBvc1kgPSBjaGlsZHJlbltpXS55O1xuXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaCh7XG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1lcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XG4gIH0sXG4gIGFkZEN5dG9zY2FwZUpzRWRnZTogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCB4bWxPYmplY3QpIHtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc19dKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzb3VyY2VBbmRUYXJnZXQgPSBzZWxmLmdldEFyY1NvdXJjZUFuZFRhcmdldChlbGUsIHhtbE9iamVjdCk7XG5cbiAgICBpZiAoIXRoaXMuaW5zZXJ0ZWROb2Rlc1tzb3VyY2VBbmRUYXJnZXQuc291cmNlXSB8fCAhdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC50YXJnZXRdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVkZ2VPYmogPSB7fTtcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcblxuICAgIGVkZ2VPYmouaWQgPSBlbGUuaWQgfHwgdW5kZWZpbmVkO1xuICAgIGVkZ2VPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xuICAgIGVkZ2VPYmouYmVuZFBvaW50UG9zaXRpb25zID0gYmVuZFBvaW50UG9zaXRpb25zO1xuXG4gICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IDA7XG4gICAgaWYgKGVsZS5nbHlwaHMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGUuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlbGUuZ2x5cGhzW2ldLmNsYXNzXyA9PT0gJ2NhcmRpbmFsaXR5Jykge1xuICAgICAgICAgIHZhciBsYWJlbCA9IGVsZS5nbHlwaHNbaV0ubGFiZWw7XG4gICAgICAgICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IGxhYmVsLnRleHQgfHwgdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWRnZU9iai5zb3VyY2UgPSBzb3VyY2VBbmRUYXJnZXQuc291cmNlO1xuICAgIGVkZ2VPYmoudGFyZ2V0ID0gc291cmNlQW5kVGFyZ2V0LnRhcmdldDtcblxuICAgIGVkZ2VPYmoucG9ydHNvdXJjZSA9IGVsZS5zb3VyY2U7XG4gICAgZWRnZU9iai5wb3J0dGFyZ2V0ID0gZWxlLnRhcmdldDtcblxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2UgPSB7ZGF0YTogZWRnZU9ian07XG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNFZGdlKTtcbiAgfSxcbiAgYXBwbHlTdHlsZTogZnVuY3Rpb24gKHJlbmRlckluZm9ybWF0aW9uLCBub2RlcywgZWRnZXMpIHtcbiAgICAvLyBnZXQgYWxsIGNvbG9yIGlkIHJlZmVyZW5jZXMgdG8gdGhlaXIgdmFsdWVcbiAgICB2YXIgY29sb3JMaXN0ID0gcmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucy5jb2xvckRlZmluaXRpb25zO1xuICAgIHZhciBjb2xvcklEVG9WYWx1ZSA9IHt9O1xuICAgIGZvciAodmFyIGk9MDsgaSA8IGNvbG9yTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29sb3JJRFRvVmFsdWVbY29sb3JMaXN0W2ldLmlkXSA9IGNvbG9yTGlzdFtpXS52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IHN0eWxlIGxpc3QgdG8gZWxlbWVudElkLWluZGV4ZWQgb2JqZWN0IHBvaW50aW5nIHRvIHN0eWxlXG4gICAgLy8gYWxzbyBjb252ZXJ0IGNvbG9yIHJlZmVyZW5jZXMgdG8gY29sb3IgdmFsdWVzXG4gICAgdmFyIHN0eWxlTGlzdCA9IHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZlN0eWxlcy5zdHlsZXM7XG4gICAgdmFyIGVsZW1lbnRJRFRvU3R5bGUgPSB7fTtcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBzdHlsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlTGlzdFtpXTtcbiAgICAgIHZhciByZW5kZXJHcm91cCA9IHN0eWxlLnJlbmRlckdyb3VwO1xuXG4gICAgICAvLyBjb252ZXJ0IGNvbG9yIHJlZmVyZW5jZXNcbiAgICAgIGlmIChyZW5kZXJHcm91cC5zdHJva2UgIT0gbnVsbCkge1xuICAgICAgICByZW5kZXJHcm91cC5zdHJva2UgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5zdHJva2VdO1xuICAgICAgfVxuICAgICAgaWYgKHJlbmRlckdyb3VwLmZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZW5kZXJHcm91cC5maWxsID0gY29sb3JJRFRvVmFsdWVbcmVuZGVyR3JvdXAuZmlsbF07XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGo9MDsgaiA8IHN0eWxlLmlkTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgaWQgPSBzdHlsZS5pZExpc3Rbal07XG4gICAgICAgIGVsZW1lbnRJRFRvU3R5bGVbaWRdID0gcmVuZGVyR3JvdXA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGV4VG9EZWNpbWFsIChoZXgpIHtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlSW50KCcweCcraGV4KSAvIDI1NSAqIDEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udmVydEhleENvbG9yIChoZXgpIHtcbiAgICAgIGlmIChoZXgubGVuZ3RoID09IDcpIHsgLy8gbm8gb3BhY2l0eSBwcm92aWRlZFxuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG51bGwsIGNvbG9yOiBoZXh9O1xuICAgICAgfVxuICAgICAgZWxzZSB7IC8vIGxlbmd0aCBvZiA5XG4gICAgICAgIHZhciBjb2xvciA9IGhleC5zbGljZSgwLDcpO1xuICAgICAgICB2YXIgb3BhY2l0eSA9IGhleFRvRGVjaW1hbChoZXguc2xpY2UoLTIpKTtcbiAgICAgICAgcmV0dXJuIHtvcGFjaXR5OiBvcGFjaXR5LCBjb2xvcjogY29sb3J9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFwcGx5IHRoZSBzdHlsZSB0byBub2RlcyBhbmQgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IHN0eWxlXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGNvbG9yIHByb3BlcnRpZXMsIHdlIG5lZWQgdG8gY2hlY2sgb3BhY2l0eVxuICAgICAgdmFyIGJnQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZmlsbDtcbiAgICAgIGlmIChiZ0NvbG9yKSB7XG4gICAgICAgIHZhciByZXMgPSBjb252ZXJ0SGV4Q29sb3IoYmdDb2xvcik7XG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1jb2xvciddID0gcmVzLmNvbG9yO1xuICAgICAgICBub2RlLmRhdGFbJ2JhY2tncm91bmQtb3BhY2l0eSddID0gcmVzLm9wYWNpdHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBib3JkZXJDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5zdHJva2U7XG4gICAgICBpZiAoYm9yZGVyQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihib3JkZXJDb2xvcik7XG4gICAgICAgIG5vZGUuZGF0YVsnYm9yZGVyLWNvbG9yJ10gPSByZXMuY29sb3I7XG4gICAgICB9XG5cbiAgICAgIHZhciBib3JkZXJXaWR0aCA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5zdHJva2VXaWR0aDtcbiAgICAgIGlmIChib3JkZXJXaWR0aCkge1xuICAgICAgICBub2RlLmRhdGFbJ2JvcmRlci13aWR0aCddID0gYm9yZGVyV2lkdGg7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250U2l6ZSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250U2l6ZTtcbiAgICAgIGlmIChmb250U2l6ZSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc2l6ZSddID0gZm9udFNpemU7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250RmFtaWx5ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRGYW1pbHk7XG4gICAgICBpZiAoZm9udEZhbWlseSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtZmFtaWx5J10gPSBmb250RmFtaWx5O1xuICAgICAgfVxuXG4gICAgICB2YXIgZm9udFN0eWxlID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRTdHlsZTtcbiAgICAgIGlmIChmb250U3R5bGUpIHtcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXN0eWxlJ10gPSBmb250U3R5bGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250V2VpZ2h0ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRXZWlnaHQ7XG4gICAgICBpZiAoZm9udFdlaWdodCkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtd2VpZ2h0J10gPSBmb250V2VpZ2h0O1xuICAgICAgfVxuXG4gICAgICB2YXIgdGV4dEFuY2hvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS50ZXh0QW5jaG9yO1xuICAgICAgaWYgKHRleHRBbmNob3IpIHtcbiAgICAgICAgbm9kZS5kYXRhWyd0ZXh0LWhhbGlnbiddID0gdGV4dEFuY2hvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIHZ0ZXh0QW5jaG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnZ0ZXh0QW5jaG9yO1xuICAgICAgaWYgKHZ0ZXh0QW5jaG9yKSB7XG4gICAgICAgIG5vZGUuZGF0YVsndGV4dC12YWxpZ24nXSA9IHZ0ZXh0QW5jaG9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRvIHRoZSBzYW1lIGZvciBlZGdlc1xuICAgIGZvciAodmFyIGk9MDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuXG4gICAgICB2YXIgbGluZUNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcbiAgICAgIGlmIChsaW5lQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihsaW5lQ29sb3IpO1xuICAgICAgICBlZGdlLmRhdGFbJ2xpbmUtY29sb3InXSA9IHJlcy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIHdpZHRoID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xuICAgICAgaWYgKHdpZHRoKSB7XG4gICAgICAgIGVkZ2UuZGF0YVsnd2lkdGgnXSA9IHdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlcyA9IFtdO1xuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XG5cbiAgICB2YXIgc2JnbiA9IGxpYnNiZ25qcy5TYmduLmZyb21YTUwoeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJ3NiZ24nKSk7XG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IHNlbGYuZ2V0QWxsQ29tcGFydG1lbnRzKHNiZ24ubWFwLmdseXBocyk7XG5cbiAgICB2YXIgZ2x5cGhzID0gc2Jnbi5tYXAuZ2x5cGhzO1xuICAgIHZhciBhcmNzID0gc2Jnbi5tYXAuYXJjcztcblxuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnbHlwaCA9IGdseXBoc1tpXTtcbiAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwgY3l0b3NjYXBlSnNOb2RlcywgJycsIGNvbXBhcnRtZW50cyk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBhcmMgPSBhcmNzW2ldO1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc0VkZ2UoYXJjLCBjeXRvc2NhcGVKc0VkZ2VzLCB4bWxPYmplY3QpO1xuICAgIH1cblxuICAgIGlmIChzYmduLm1hcC5leHRlbnNpb24uaGFzKCdyZW5kZXJJbmZvcm1hdGlvbicpKSB7IC8vIHJlbmRlciBleHRlbnNpb24gd2FzIGZvdW5kXG4gICAgICBzZWxmLmFwcGx5U3R5bGUoc2Jnbi5tYXAuZXh0ZW5zaW9uLmdldCgncmVuZGVySW5mb3JtYXRpb24nKSwgY3l0b3NjYXBlSnNOb2RlcywgY3l0b3NjYXBlSnNFZGdlcyk7XG4gICAgfVxuXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcbiAgICBjeXRvc2NhcGVKc0dyYXBoLm5vZGVzID0gY3l0b3NjYXBlSnNOb2RlcztcbiAgICBjeXRvc2NhcGVKc0dyYXBoLmVkZ2VzID0gY3l0b3NjYXBlSnNFZGdlcztcblxuICAgIHRoaXMuaW5zZXJ0ZWROb2RlcyA9IHt9O1xuXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2Jnbm1sVG9Kc29uO1xuIiwiLypcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcbiAqL1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG5cbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xuICAvL1RPRE86IHVzZSBDU1MncyBcInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXNcIiBzdHlsZSBpbnN0ZWFkIG9mIGZ1bmN0aW9uIGJlbG93P1xuICB0cnVuY2F0ZVRleHQ6IGZ1bmN0aW9uICh0ZXh0UHJvcCwgZm9udCkge1xuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnRleHQuZm9udCA9IGZvbnQ7XG4gICAgXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XG4gICAgZml0TGFiZWxzVG9Ob2RlcyA9IHR5cGVvZiBmaXRMYWJlbHNUb05vZGVzID09PSAnZnVuY3Rpb24nID8gZml0TGFiZWxzVG9Ob2Rlcy5jYWxsKCkgOiBmaXRMYWJlbHNUb05vZGVzO1xuICAgIFxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcbiAgICAvL0lmIGZpdCBsYWJlbHMgdG8gbm9kZXMgaXMgZmFsc2UgZG8gbm90IHRydW5jYXRlXG4gICAgaWYgKGZpdExhYmVsc1RvTm9kZXMgPT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICB2YXIgd2lkdGg7XG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xuICAgIHZhciBlbGxpcHNpcyA9IFwiLi5cIjtcbiAgICB2YXIgdGV4dFdpZHRoID0gKHRleHRQcm9wLndpZHRoID4gMzApID8gdGV4dFByb3Aud2lkdGggLSAxMCA6IHRleHRQcm9wLndpZHRoO1xuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xuICAgICAgLS1sZW47XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgbGVuKSArIGVsbGlwc2lzO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfSxcblxuICAvLyBlbnN1cmUgdGhhdCByZXR1cm5lZCBzdHJpbmcgZm9sbG93cyB4c2Q6SUQgc3RhbmRhcmRcbiAgLy8gc2hvdWxkIGZvbGxvdyByJ15bYS16QS1aX11bXFx3Li1dKiQnXG4gIGdldFhNTFZhbGlkSWQ6IGZ1bmN0aW9uKG9yaWdpbmFsSWQpIHtcbiAgICB2YXIgbmV3SWQgPSBcIlwiO1xuICAgIHZhciB4bWxWYWxpZFJlZ2V4ID0gL15bYS16QS1aX11bXFx3Li1dKiQvO1xuICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChvcmlnaW5hbElkKSkgeyAvLyBkb2Vzbid0IGNvbXBseVxuICAgICAgbmV3SWQgPSBvcmlnaW5hbElkO1xuICAgICAgbmV3SWQgPSBuZXdJZC5yZXBsYWNlKC9bXlxcdy4tXS9nLCBcIlwiKTtcbiAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gc3RpbGwgZG9lc24ndCBjb21wbHlcbiAgICAgICAgbmV3SWQgPSBcIl9cIiArIG5ld0lkO1xuICAgICAgICBpZiAoISB4bWxWYWxpZFJlZ2V4LnRlc3QobmV3SWQpKSB7IC8vIG5vcm1hbGx5IHdlIHNob3VsZCBuZXZlciBlbnRlciB0aGlzXG4gICAgICAgICAgLy8gaWYgZm9yIHNvbWUgb2JzY3VyZSByZWFzb24gd2Ugc3RpbGwgZG9uJ3QgY29tcGx5LCB0aHJvdyBlcnJvci5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBtYWtlIGlkZW50aWZlciBjb21wbHkgdG8geHNkOklEIHJlcXVpcmVtZW50czogXCIrbmV3SWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3SWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSWQ7XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGV4dFV0aWxpdGllczsiLCIvKlxuICogQ29tbW9ubHkgbmVlZGVkIFVJIFV0aWxpdGllc1xuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIHVpVXRpbGl0aWVzID0ge1xuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xuICAgIH1cbiAgICBcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3Rvcikud2lkdGgoKTtcbiAgICAgIHZhciBjb250YWluZXJIZWlnaHQgPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS5oZWlnaHQoKTtcbiAgICAgICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IgKyAnOnBhcmVudCcpLnByZXBlbmQoJzxpIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OTk5OyBsZWZ0OiAnICsgY29udGFpbmVyV2lkdGggLyAyICsgJ3B4OyB0b3A6ICcgKyBjb250YWluZXJIZWlnaHQgLyAyICsgJ3B4O1wiIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTN4IGZhLWZ3ICcgKyBjbGFzc05hbWUgKyAnXCI+PC9pPicpO1xuICAgIH1cbiAgfSxcbiAgZW5kU3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XG4gICAgfVxuICAgIFxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID4gMCkge1xuICAgICAgJCgnLicgKyBjbGFzc05hbWUpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1aVV0aWxpdGllcztcblxuXG4iLCIvKlxuICogVGhpcyBmaWxlIGV4cG9ydHMgdGhlIGZ1bmN0aW9ucyB0byBiZSB1dGlsaXplZCBpbiB1bmRvcmVkbyBleHRlbnNpb24gYWN0aW9ucyBcbiAqL1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG5cbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHtcbiAgLy8gU2VjdGlvbiBTdGFydFxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcbiAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcbiAgfSxcbiAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgdmFyIHBhcmFtID0ge307XG4gICAgcGFyYW0uZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7XG4gICAgcmV0dXJuIHBhcmFtO1xuICB9LFxuICBkZWxldGVOb2Rlc1NtYXJ0OiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0KHBhcmFtLmVsZXMpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xuICB9LFxuICAvLyBTZWN0aW9uIEVuZFxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7IiwidmFyIGNoZWNrUGFyYW1zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5jaGVja1BhcmFtcztcblxudmFyIG5zID0ge307XG5cbm5zLnhtbG5zID0gXCJodHRwOi8vd3d3LnNibWwub3JnL3NibWwvbGV2ZWwzL3ZlcnNpb24xL3JlbmRlci92ZXJzaW9uMVwiO1xuXG4vLyAtLS0tLS0tIENPTE9SREVGSU5JVElPTiAtLS0tLS0tXG5ucy5Db2xvckRlZmluaXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICd2YWx1ZSddKTtcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLnZhbHVlIFx0PSBwYXJhbXMudmFsdWU7XG59O1xuXG5ucy5Db2xvckRlZmluaXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Y29sb3JEZWZpbml0aW9uXCI7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2YWx1ZT0nXCIrdGhpcy52YWx1ZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkNvbG9yRGVmaW5pdGlvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2NvbG9yRGVmaW5pdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNvbG9yRGVmaW5pdGlvbiwgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IG5zLkNvbG9yRGVmaW5pdGlvbigpO1xuXHRjb2xvckRlZmluaXRpb24uaWQgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0Y29sb3JEZWZpbml0aW9uLnZhbHVlIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXHRyZXR1cm4gY29sb3JEZWZpbml0aW9uO1xufTtcbi8vIC0tLS0tLS0gRU5EIENPTE9SREVGSU5JVElPTiAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTElTVE9GQ09MT1JERUZJTklUSU9OUyAtLS0tLS0tXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmNvbG9yRGVmaW5pdGlvbnMgPSBbXTtcbn07XG5cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLmFkZENvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uIChjb2xvckRlZmluaXRpb24pIHtcblx0dGhpcy5jb2xvckRlZmluaXRpb25zLnB1c2goY29sb3JEZWZpbml0aW9uKTtcbn07XG5cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGlzdE9mQ29sb3JEZWZpbml0aW9ucz5cXG5cIjtcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5jb2xvckRlZmluaXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IHRoaXMuY29sb3JEZWZpbml0aW9uc1tpXTtcblx0XHR4bWxTdHJpbmcgKz0gY29sb3JEZWZpbml0aW9uLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9saXN0T2ZDb2xvckRlZmluaXRpb25zPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBsaXN0T2ZDb2xvckRlZmluaXRpb25zLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IG5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMoKTtcblxuXHR2YXIgY29sb3JEZWZpbml0aW9ucyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY29sb3JEZWZpbml0aW9uJyk7XG5cdGZvciAodmFyIGk9MDsgaTxjb2xvckRlZmluaXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvblhNTCA9IGNvbG9yRGVmaW5pdGlvbnNbaV07XG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5zLkNvbG9yRGVmaW5pdGlvbi5mcm9tWE1MKGNvbG9yRGVmaW5pdGlvblhNTCk7XG5cdFx0bGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hZGRDb2xvckRlZmluaXRpb24oY29sb3JEZWZpbml0aW9uKTtcblx0fVxuXHRyZXR1cm4gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG4vLyAtLS0tLS0tIEVORCBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBSRU5ERVJHUk9VUCAtLS0tLS0tXG5ucy5SZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0Ly8gZWFjaCBvZiB0aG9zZSBhcmUgb3B0aW9uYWwsIHNvIHRlc3QgaWYgaXQgaXMgZGVmaW5lZCBpcyBtYW5kYXRvcnlcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydmb250U2l6ZScsICdmb250RmFtaWx5JywgJ2ZvbnRXZWlnaHQnLCBcblx0XHQnZm9udFN0eWxlJywgJ3RleHRBbmNob3InLCAndnRleHRBbmNob3InLCAnZmlsbCcsICdpZCcsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnXSk7XG5cdC8vIHNwZWNpZmljIHRvIHJlbmRlckdyb3VwXG5cdHRoaXMuZm9udFNpemUgXHRcdD0gcGFyYW1zLmZvbnRTaXplO1xuXHR0aGlzLmZvbnRGYW1pbHkgXHQ9IHBhcmFtcy5mb250RmFtaWx5O1xuXHR0aGlzLmZvbnRXZWlnaHQgXHQ9IHBhcmFtcy5mb250V2VpZ2h0O1xuXHR0aGlzLmZvbnRTdHlsZSBcdFx0PSBwYXJhbXMuZm9udFN0eWxlO1xuXHR0aGlzLnRleHRBbmNob3IgXHQ9IHBhcmFtcy50ZXh0QW5jaG9yOyAvLyBwcm9iYWJseSB1c2VsZXNzXG5cdHRoaXMudnRleHRBbmNob3IgXHQ9IHBhcmFtcy52dGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xuXHQvLyBmcm9tIEdyYXBoaWNhbFByaW1pdGl2ZTJEXG5cdHRoaXMuZmlsbCBcdFx0XHQ9IHBhcmFtcy5maWxsOyAvLyBmaWxsIGNvbG9yXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMURcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5zdHJva2UgXHRcdD0gcGFyYW1zLnN0cm9rZTsgLy8gc3Ryb2tlIGNvbG9yXG5cdHRoaXMuc3Ryb2tlV2lkdGggXHQ9IHBhcmFtcy5zdHJva2VXaWR0aDtcbn07XG5cbm5zLlJlbmRlckdyb3VwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGdcIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250U2l6ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRTaXplPSdcIit0aGlzLmZvbnRTaXplK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRGYW1pbHkgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBmb250RmFtaWx5PSdcIit0aGlzLmZvbnRGYW1pbHkrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZm9udFdlaWdodCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRXZWlnaHQ9J1wiK3RoaXMuZm9udFdlaWdodCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250U3R5bGUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBmb250U3R5bGU9J1wiK3RoaXMuZm9udFN0eWxlK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB0ZXh0QW5jaG9yPSdcIit0aGlzLnRleHRBbmNob3IrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2dGV4dEFuY2hvcj0nXCIrdGhpcy52dGV4dEFuY2hvcitcIidcIjtcblx0fVxuXHRpZiAodGhpcy5zdHJva2UgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzdHJva2U9J1wiK3RoaXMuc3Ryb2tlK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnN0cm9rZVdpZHRoICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgc3Ryb2tlV2lkdGg9J1wiK3RoaXMuc3Ryb2tlV2lkdGgrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZmlsbCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZpbGw9J1wiK3RoaXMuZmlsbCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlJlbmRlckdyb3VwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdGlmICh4bWwudGFnTmFtZSAhPSAnZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGcsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIHJlbmRlckdyb3VwID0gbmV3IG5zLlJlbmRlckdyb3VwKHt9KTtcblx0cmVuZGVyR3JvdXAuaWQgXHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRyZW5kZXJHcm91cC5mb250U2l6ZSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFNpemUnKTtcblx0cmVuZGVyR3JvdXAuZm9udEZhbWlseSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udEZhbWlseScpO1xuXHRyZW5kZXJHcm91cC5mb250V2VpZ2h0IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250V2VpZ2h0Jyk7XG5cdHJlbmRlckdyb3VwLmZvbnRTdHlsZSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFN0eWxlJyk7XG5cdHJlbmRlckdyb3VwLnRleHRBbmNob3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3RleHRBbmNob3InKTtcblx0cmVuZGVyR3JvdXAudnRleHRBbmNob3IgPSB4bWwuZ2V0QXR0cmlidXRlKCd2dGV4dEFuY2hvcicpO1xuXHRyZW5kZXJHcm91cC5zdHJva2UgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnc3Ryb2tlJyk7XG5cdHJlbmRlckdyb3VwLnN0cm9rZVdpZHRoID0geG1sLmdldEF0dHJpYnV0ZSgnc3Ryb2tlV2lkdGgnKTtcblx0cmVuZGVyR3JvdXAuZmlsbCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XG5cdHJldHVybiByZW5kZXJHcm91cDtcbn07XG4vLyAtLS0tLS0tIEVORCBSRU5ERVJHUk9VUCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gU1RZTEUgLS0tLS0tLVxuLy8gbG9jYWxTdHlsZSBmcm9tIHNwZWNzXG5ucy5TdHlsZSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ25hbWUnLCAnaWRMaXN0JywgJ3JlbmRlckdyb3VwJ10pO1xuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLm5hbWUgXHRcdFx0PSBwYXJhbXMubmFtZTtcblx0dGhpcy5pZExpc3QgXHRcdD0gcGFyYW1zLmlkTGlzdDsgLy8gVE9ETyBhZGQgdXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFuYWdlIHRoaXMgKHNob3VsZCBiZSBhcnJheSlcblx0dGhpcy5yZW5kZXJHcm91cCBcdD0gcGFyYW1zLnJlbmRlckdyb3VwO1xufTtcblxubnMuU3R5bGUucHJvdG90eXBlLnNldFJlbmRlckdyb3VwID0gZnVuY3Rpb24gKHJlbmRlckdyb3VwKSB7XG5cdHRoaXMucmVuZGVyR3JvdXAgPSByZW5kZXJHcm91cDtcbn07XG5cbm5zLlN0eWxlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHN0eWxlXCI7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIG5hbWU9J1wiK3RoaXMubmFtZStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5pZExpc3QgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZExpc3Q9J1wiK3RoaXMuaWRMaXN0K1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIj5cXG5cIjtcblxuXHRpZiAodGhpcy5yZW5kZXJHcm91cCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLnJlbmRlckdyb3VwLnRvWE1MKCk7XG5cdH1cblxuXHR4bWxTdHJpbmcgKz0gXCI8L3N0eWxlPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuU3R5bGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdzdHlsZScpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHN0eWxlLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBzdHlsZSA9IG5ldyBucy5TdHlsZSgpO1xuXHRzdHlsZS5pZCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRzdHlsZS5uYW1lIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0c3R5bGUuaWRMaXN0IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZExpc3QnKTtcblxuXHR2YXIgcmVuZGVyR3JvdXBYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2cnKVswXTtcblx0aWYgKHJlbmRlckdyb3VwWE1MICE9IG51bGwpIHtcblx0XHRzdHlsZS5yZW5kZXJHcm91cCA9IG5zLlJlbmRlckdyb3VwLmZyb21YTUwocmVuZGVyR3JvdXBYTUwpO1xuXHR9XG5cdHJldHVybiBzdHlsZTtcbn07XG4vLyAtLS0tLS0tIEVORCBTVFlMRSAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTElTVE9GU1RZTEVTIC0tLS0tLS1cbm5zLkxpc3RPZlN0eWxlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnN0eWxlcyA9IFtdO1xufTtcblxubnMuTGlzdE9mU3R5bGVzLnByb3RvdHlwZS5hZGRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG5cdHRoaXMuc3R5bGVzLnB1c2goc3R5bGUpO1xufTtcblxubnMuTGlzdE9mU3R5bGVzLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGxpc3RPZlN0eWxlcz5cXG5cIjtcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5zdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc3R5bGUgPSB0aGlzLnN0eWxlc1tpXTtcblx0XHR4bWxTdHJpbmcgKz0gc3R5bGUudG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2xpc3RPZlN0eWxlcz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkxpc3RPZlN0eWxlcy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2xpc3RPZlN0eWxlcycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxpc3RPZlN0eWxlcywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgbGlzdE9mU3R5bGVzID0gbmV3IG5zLkxpc3RPZlN0eWxlcygpO1xuXG5cdHZhciBzdHlsZXMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XG5cdGZvciAodmFyIGk9MDsgaTxzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc3R5bGVYTUwgPSBzdHlsZXNbaV07XG5cdFx0dmFyIHN0eWxlID0gbnMuU3R5bGUuZnJvbVhNTChzdHlsZVhNTCk7XG5cdFx0bGlzdE9mU3R5bGVzLmFkZFN0eWxlKHN0eWxlKTtcblx0fVxuXHRyZXR1cm4gbGlzdE9mU3R5bGVzO1xufTtcbi8vIC0tLS0tLS0gRU5EIExJU1RPRlNUWUxFUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gUkVOREVSSU5GT1JNQVRJT04gLS0tLS0tLVxubnMuUmVuZGVySW5mb3JtYXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbmFtZScsICdwcm9ncmFtTmFtZScsIFxuXHRcdCdwcm9ncmFtVmVyc2lvbicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycsICdsaXN0T2ZTdHlsZXMnXSk7XG5cdHRoaXMuaWQgXHRcdFx0XHRcdD0gcGFyYW1zLmlkOyAvLyByZXF1aXJlZCwgcmVzdCBpcyBvcHRpb25hbFxuXHR0aGlzLm5hbWUgXHRcdFx0XHRcdD0gcGFyYW1zLm5hbWU7XG5cdHRoaXMucHJvZ3JhbU5hbWUgXHRcdFx0PSBwYXJhbXMucHJvZ3JhbU5hbWU7XG5cdHRoaXMucHJvZ3JhbVZlcnNpb24gXHRcdD0gcGFyYW1zLnByb2dyYW1WZXJzaW9uO1xuXHR0aGlzLmJhY2tncm91bmRDb2xvciBcdFx0PSBwYXJhbXMuYmFja2dyb3VuZENvbG9yO1xuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBwYXJhbXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucztcblx0dGhpcy5saXN0T2ZTdHlsZXMgXHRcdFx0PSBwYXJhbXMubGlzdE9mU3R5bGVzO1xuXHQvKnRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucyhyZW5kZXJJbmZvLmNvbG9yRGVmLmNvbG9yTGlzdCk7XG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMocmVuZGVySW5mby5zdHlsZURlZik7XG5cdCovXG59O1xuXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGZ1bmN0aW9uKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0dGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG5cbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZTdHlsZXMgPSBmdW5jdGlvbihsaXN0T2ZTdHlsZXMpIHtcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBsaXN0T2ZTdHlsZXM7XG59O1xuXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcblx0Ly8gdGFnIGFuZCBpdHMgYXR0cmlidXRlc1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8cmVuZGVySW5mb3JtYXRpb25cIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbmFtZT0nXCIrdGhpcy5uYW1lK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnByb2dyYW1OYW1lICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgcHJvZ3JhbU5hbWU9J1wiK3RoaXMucHJvZ3JhbU5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMucHJvZ3JhbVZlcnNpb24gIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBwcm9ncmFtVmVyc2lvbj0nXCIrdGhpcy5wcm9ncmFtVmVyc2lvbitcIidcIjtcblx0fVxuXHRpZiAodGhpcy5iYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBiYWNrZ3JvdW5kQ29sb3I9J1wiK3RoaXMuYmFja2dyb3VuZENvbG9yK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiB4bWxucz0nXCIrbnMueG1sbnMrXCInPlxcblwiO1xuXG5cdC8vIGNoaWxkIGVsZW1lbnRzXG5cdGlmICh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zLnRvWE1MKCk7XG5cdH1cblx0aWYgKHRoaXMubGlzdE9mU3R5bGVzKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubGlzdE9mU3R5bGVzLnRvWE1MKCk7XG5cdH1cblxuXHR4bWxTdHJpbmcgKz0gXCI8L3JlbmRlckluZm9ybWF0aW9uPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuLy8gc3RhdGljIGNvbnN0cnVjdG9yIG1ldGhvZFxubnMuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHJlbmRlckluZm9ybWF0aW9uLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyBucy5SZW5kZXJJbmZvcm1hdGlvbigpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5pZCBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0cmVuZGVySW5mb3JtYXRpb24ubmFtZSBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtTmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtVmVyc2lvbiBcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbVZlcnNpb24nKTtcblx0cmVuZGVySW5mb3JtYXRpb24uYmFja2dyb3VuZENvbG9yIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdiYWNrZ3JvdW5kQ29sb3InKTtcblxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpWzBdO1xuXHR2YXIgbGlzdE9mU3R5bGVzWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZTdHlsZXMnKVswXTtcblx0aWYgKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwgIT0gbnVsbCkge1xuXHRcdHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCk7XG5cdH1cblx0aWYgKGxpc3RPZlN0eWxlc1hNTCAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzID0gbnMuTGlzdE9mU3R5bGVzLmZyb21YTUwobGlzdE9mU3R5bGVzWE1MKTtcblx0fVxuXG5cdHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcbn07XG4vLyAtLS0tLS0tIEVORCBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gbnM7IiwidmFyIHJlbmRlckV4dCA9IHJlcXVpcmUoJy4vbGlic2Jnbi1yZW5kZXItZXh0Jyk7XG52YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xuXG52YXIgbnMgPSB7fTtcblxubnMueG1sbnMgPSBcImh0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuM1wiO1xuXG4vLyAtLS0tLS0tIFNCR05CYXNlIC0tLS0tLS1cbi8qXG5cdEV2ZXJ5IHNiZ24gZWxlbWVudCBpbmhlcml0IGZyb20gdGhpcy4gQWxsb3dzIHRvIHB1dCBub3RlcyBldmVyeXdoZXJlLlxuKi9cbm5zLlNCR05CYXNlID0gZnVuY3Rpb24gKCkge1xuXG59O1xuLy8gLS0tLS0tLSBFTkQgU0JHTkJhc2UgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNCR04gLS0tLS0tLVxubnMuU2JnbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4bWxucycsICdtYXAnXSk7XG5cdHRoaXMueG1sbnMgXHQ9IHBhcmFtcy54bWxucztcblx0dGhpcy5tYXAgXHQ9IHBhcmFtcy5tYXA7XG59O1xuXG5ucy5TYmduLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLlNiZ24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuU2JnbjtcblxubnMuU2Jnbi5wcm90b3R5cGUuc2V0TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuXHR0aGlzLm1hcCA9IG1hcDtcbn07XG5cbm5zLlNiZ24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c2JnblwiO1xuXHRpZih0aGlzLnhtbG5zICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeG1sbnM9J1wiK3RoaXMueG1sbnMrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLm1hcCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubWFwLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9zYmduPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuU2Jnbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3NiZ24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzYmduLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBzYmduID0gbmV3IG5zLlNiZ24oKTtcblx0c2Jnbi54bWxucyA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3htbG5zJyk7XG5cblx0Ly8gZ2V0IGNoaWxkcmVuXG5cdHZhciBtYXBYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hcCcpWzBdO1xuXHRpZiAobWFwWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbWFwID0gbnMuTWFwLmZyb21YTUwobWFwWE1MKTtcblx0XHRzYmduLnNldE1hcChtYXApO1xuXHR9XG5cdHJldHVybiBzYmduO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNCR04gLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE1BUCAtLS0tLS0tXG5ucy5NYXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbGFuZ3VhZ2UnLCAnZXh0ZW5zaW9uJywgJ2dseXBocycsICdhcmNzJ10pO1xuXHR0aGlzLmlkIFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5sYW5ndWFnZSBcdD0gcGFyYW1zLmxhbmd1YWdlO1xuXHR0aGlzLmV4dGVuc2lvbiBcdD0gcGFyYW1zLmV4dGVuc2lvbjtcblx0dGhpcy5nbHlwaHMgXHQ9IHBhcmFtcy5nbHlwaHMgfHwgW107XG5cdHRoaXMuYXJjcyBcdFx0PSBwYXJhbXMuYXJjcyB8fCBbXTtcbn07XG5cbm5zLk1hcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5NYXAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuTWFwO1xuXG5ucy5NYXAucHJvdG90eXBlLnNldEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHRlbnNpb24pIHtcblx0dGhpcy5leHRlbnNpb24gPSBleHRlbnNpb247XG59O1xuXG5ucy5NYXAucHJvdG90eXBlLmFkZEdseXBoID0gZnVuY3Rpb24gKGdseXBoKSB7XG5cdHRoaXMuZ2x5cGhzLnB1c2goZ2x5cGgpO1xufTtcblxubnMuTWFwLnByb3RvdHlwZS5hZGRBcmMgPSBmdW5jdGlvbiAoYXJjKSB7XG5cdHRoaXMuYXJjcy5wdXNoKGFyYyk7XG59O1xuXG5ucy5NYXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bWFwXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMubGFuZ3VhZ2UgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBsYW5ndWFnZT0nXCIrdGhpcy5sYW5ndWFnZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cblx0Ly8gY2hpbGRyZW5cblx0aWYodGhpcy5leHRlbnNpb24gIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmV4dGVuc2lvbi50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5nbHlwaHNbaV0udG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuYXJjcy5sZW5ndGg7IGkrKykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmFyY3NbaV0udG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L21hcD5cXG5cIjtcblxuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTWFwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbWFwJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbWFwLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBtYXAgPSBuZXcgbnMuTWFwKCk7XG5cdG1hcC5pZCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdG1hcC5sYW5ndWFnZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2xhbmd1YWdlJyk7XG5cblx0Ly8gY2hpbGRyZW5cblx0dmFyIGV4dGVuc2lvblhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZXh0ZW5zaW9uJylbMF07XG5cdGlmIChleHRlbnNpb25YTUwgIT0gbnVsbCkge1xuXHRcdHZhciBleHRlbnNpb24gPSBucy5FeHRlbnNpb24uZnJvbVhNTChleHRlbnNpb25YTUwpO1xuXHRcdG1hcC5zZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcblx0fVxuXHQvLyBuZWVkIHRvIGJlIGNhcmVmdWwgaGVyZSwgYXMgdGhlcmUgY2FuIGJlIGdseXBoIGluIGFyY3Ncblx0dmFyIGdseXBoc1hNTCA9IHhtbE9iai5xdWVyeVNlbGVjdG9yQWxsKCdtYXAgPiBnbHlwaCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBnbHlwaHNYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZ2x5cGggPSBucy5HbHlwaC5mcm9tWE1MKGdseXBoc1hNTFtpXSk7XG5cdFx0bWFwLmFkZEdseXBoKGdseXBoKTtcblx0fVxuXHR2YXIgYXJjc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYXJjJyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IGFyY3NYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgYXJjID0gbnMuQXJjLmZyb21YTUwoYXJjc1hNTFtpXSk7XG5cdFx0bWFwLmFkZEFyYyhhcmMpO1xuXHR9XG5cblx0cmV0dXJuIG1hcDtcbn07XG4vLyAtLS0tLS0tIEVORCBNQVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVYVEVOU0lPTlMgLS0tLS0tLVxubnMuRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuXHQvLyBjb25zaWRlciBmaXJzdCBvcmRlciBjaGlsZHJlbiwgYWRkIHRoZW0gd2l0aCB0aGVpciB0YWduYW1lIGFzIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0XG5cdC8vIHN0b3JlIHhtbE9iamVjdCBpZiBubyBzdXBwb3J0ZWQgcGFyc2luZyAodW5yZWNvZ25pemVkIGV4dGVuc2lvbnMpXG5cdC8vIGVsc2Ugc3RvcmUgaW5zdGFuY2Ugb2YgdGhlIGV4dGVuc2lvblxuXHR0aGlzLmxpc3QgPSB7fTtcblx0dGhpcy51bnN1cHBvcnRlZExpc3QgPSB7fTtcbn07XG5cbi8qbnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeG1sT2JqKSB7IC8vIGFkZCBzcGVjaWZpYyBleHRlbnNpb25cblx0dmFyIGV4dE5hbWUgPSB4bWxPYmoudGFnTmFtZTtcblx0Y29uc29sZS5sb2coXCJleHROYW1lXCIsIGV4dE5hbWUsIHhtbE9iaik7XG5cdGlmIChleHROYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCh4bWxPYmopO1xuXHRcdHRoaXMubGlzdFsncmVuZGVySW5mb3JtYXRpb24nXSA9IHJlbmRlckluZm9ybWF0aW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdHRoaXMubGlzdFsnYW5ub3RhdGlvbnMnXSA9IHhtbE9iajsgLy8gdG8gYmUgcGFyc2VkIGNvcnJlY3RseVxuXHR9XG5cdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0dGhpcy5saXN0W2V4dE5hbWVdID0geG1sT2JqO1xuXHR9XG59OyovXG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuXHRpZiAoZXh0ZW5zaW9uIGluc3RhbmNlb2YgcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uKSB7XG5cdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gZXh0ZW5zaW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dGVuc2lvbi5ub2RlVHlwZSA9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdC8vIGNhc2Ugd2hlcmUgcmVuZGVySW5mb3JtYXRpb24gaXMgcGFzc2VkIHVucGFyc2VkXG5cdFx0aWYgKGV4dGVuc2lvbi50YWdOYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dGVuc2lvbik7XG5cdFx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSByZW5kZXJJbmZvcm1hdGlvbjtcblx0XHR9XG5cdFx0dGhpcy51bnN1cHBvcnRlZExpc3RbZXh0ZW5zaW9uLnRhZ05hbWVdID0gZXh0ZW5zaW9uO1xuXHR9XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdHJldHVybiB0aGlzLmxpc3QuaGFzT3duUHJvcGVydHkoZXh0ZW5zaW9uTmFtZSk7XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdGlmICh0aGlzLmhhcyhleHRlbnNpb25OYW1lKSkge1xuXHRcdHJldHVybiB0aGlzLmxpc3RbZXh0ZW5zaW9uTmFtZV07XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxleHRlbnNpb24+XFxuXCI7XG5cdGZvciAodmFyIGV4dEluc3RhbmNlIGluIHRoaXMubGlzdCkge1xuXHRcdGlmIChleHRJbnN0YW5jZSA9PSBcInJlbmRlckluZm9ybWF0aW9uXCIpIHtcblx0XHRcdHhtbFN0cmluZyArPSB0aGlzLmdldChleHRJbnN0YW5jZSkudG9YTUwoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR4bWxTdHJpbmcgKz0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmdldChleHRJbnN0YW5jZSkpO1xuXHRcdH1cblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2V4dGVuc2lvbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkV4dGVuc2lvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2V4dGVuc2lvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGV4dGVuc2lvbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IG5zLkV4dGVuc2lvbigpO1xuXHR2YXIgY2hpbGRyZW4gPSB4bWxPYmouY2hpbGRyZW47XG5cdGZvciAodmFyIGk9MDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGV4dFhtbE9iaiA9IGNoaWxkcmVuW2ldO1xuXHRcdHZhciBleHROYW1lID0gZXh0WG1sT2JqLnRhZ05hbWU7XG5cdFx0Ly9leHRlbnNpb24uYWRkKGV4dEluc3RhbmNlKTtcblx0XHRpZiAoZXh0TmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRYbWxPYmopO1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChyZW5kZXJJbmZvcm1hdGlvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopOyAvLyB0byBiZSBwYXJzZWQgY29ycmVjdGx5XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgRVhURU5TSU9OUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gR0xZUEggLS0tLS0tLVxubnMuR2x5cGggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ2NvbXBhcnRtZW50UmVmJywgJ2xhYmVsJywgJ2Jib3gnLCAnZ2x5cGhNZW1iZXJzJywgJ3BvcnRzJywgJ3N0YXRlJywgJ2Nsb25lJ10pO1xuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLmNsYXNzXyBcdFx0PSBwYXJhbXMuY2xhc3NfO1xuXHR0aGlzLmNvbXBhcnRtZW50UmVmID0gcGFyYW1zLmNvbXBhcnRtZW50UmVmO1xuXG5cdC8vIGNoaWxkcmVuXG5cdHRoaXMubGFiZWwgXHRcdFx0PSBwYXJhbXMubGFiZWw7XG5cdHRoaXMuc3RhdGUgXHRcdFx0PSBwYXJhbXMuc3RhdGU7XG5cdHRoaXMuYmJveCBcdFx0XHQ9IHBhcmFtcy5iYm94O1xuXHR0aGlzLmNsb25lIFx0XHRcdD0gcGFyYW1zLmNsb25lO1xuXHR0aGlzLmdseXBoTWVtYmVycyBcdD0gcGFyYW1zLmdseXBoTWVtYmVycyB8fCBbXTsgLy8gY2FzZSBvZiBjb21wbGV4LCBjYW4gaGF2ZSBhcmJpdHJhcnkgbGlzdCBvZiBuZXN0ZWQgZ2x5cGhzXG5cdHRoaXMucG9ydHMgXHRcdFx0PSBwYXJhbXMucG9ydHMgfHwgW107XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5HbHlwaC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5HbHlwaDtcblxubnMuR2x5cGgucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24gKGxhYmVsKSB7XG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuXHR0aGlzLnN0YXRlID0gc3RhdGU7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0QmJveCA9IGZ1bmN0aW9uIChiYm94KSB7XG5cdHRoaXMuYmJveCA9IGJib3g7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0Q2xvbmUgPSBmdW5jdGlvbiAoY2xvbmUpIHtcblx0dGhpcy5jbG9uZSA9IGNsb25lO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLmFkZEdseXBoTWVtYmVyID0gZnVuY3Rpb24gKGdseXBoTWVtYmVyKSB7XG5cdHRoaXMuZ2x5cGhNZW1iZXJzLnB1c2goZ2x5cGhNZW1iZXIpO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLmFkZFBvcnQgPSBmdW5jdGlvbiAocG9ydCkge1xuXHR0aGlzLnBvcnRzLnB1c2gocG9ydCk7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxnbHlwaFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGNsYXNzPSdcIit0aGlzLmNsYXNzXytcIidcIjtcblx0fVxuXHRpZih0aGlzLmNvbXBhcnRtZW50UmVmICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgY29tcGFydG1lbnRSZWY9J1wiK3RoaXMuY29tcGFydG1lbnRSZWYrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdC8vIGNoaWxkcmVuXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmxhYmVsLnRvWE1MKCk7XG5cdH1cblx0aWYodGhpcy5zdGF0ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuc3RhdGUudG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLmJib3ggIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmJib3gudG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLmNsb25lICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5jbG9uZS50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaE1lbWJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5nbHlwaE1lbWJlcnNbaV0udG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMucG9ydHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5wb3J0c1tpXS50b1hNTCgpO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIjwvZ2x5cGg+XFxuXCI7XG5cblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkdseXBoLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZ2x5cGgnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnbHlwaCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZ2x5cGggPSBuZXcgbnMuR2x5cGgoKTtcblx0Z2x5cGguaWQgXHRcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdGdseXBoLmNsYXNzXyBcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cdGdseXBoLmNvbXBhcnRtZW50UmVmIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xuXG5cdHZhciBsYWJlbFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcblx0aWYgKGxhYmVsWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbGFiZWwgPSBucy5MYWJlbC5mcm9tWE1MKGxhYmVsWE1MKTtcblx0XHRnbHlwaC5zZXRMYWJlbChsYWJlbCk7XG5cdH1cblx0dmFyIHN0YXRlWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGF0ZScpWzBdO1xuXHRpZiAoc3RhdGVYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGF0ZSA9IG5zLlN0YXRlVHlwZS5mcm9tWE1MKHN0YXRlWE1MKTtcblx0XHRnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG5cdH1cblx0dmFyIGJib3hYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jib3gnKVswXTtcblx0aWYgKGJib3hYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBiYm94ID0gbnMuQmJveC5mcm9tWE1MKGJib3hYTUwpO1xuXHRcdGdseXBoLnNldEJib3goYmJveCk7XG5cdH1cblx0dmFyIGNsb25lWE1sID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjbG9uZScpWzBdO1xuXHRpZiAoY2xvbmVYTWwgIT0gbnVsbCkge1xuXHRcdHZhciBjbG9uZSA9IG5zLkNsb25lVHlwZS5mcm9tWE1MKGNsb25lWE1sKTtcblx0XHRnbHlwaC5zZXRDbG9uZShjbG9uZSk7XG5cdH1cblx0Ly8gbmVlZCBzcGVjaWFsIGNhcmUgYmVjYXVzZSBvZiByZWN1cnNpb24gb2YgbmVzdGVkIGdseXBoIG5vZGVzXG5cdC8vIHRha2Ugb25seSBmaXJzdCBsZXZlbCBnbHlwaHNcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkcmVuO1xuXHRmb3IgKHZhciBqPTA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykgeyAvLyBsb29wIHRocm91Z2ggYWxsIGZpcnN0IGxldmVsIGNoaWxkcmVuXG5cdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5bal07XG5cdFx0aWYgKGNoaWxkLnRhZ05hbWUgPT0gXCJnbHlwaFwiKSB7IC8vIGhlcmUgd2Ugb25seSB3YW50IHRoZSBnbHloIGNoaWxkcmVuXG5cdFx0XHR2YXIgZ2x5cGhNZW1iZXIgPSBucy5HbHlwaC5mcm9tWE1MKGNoaWxkKTsgLy8gcmVjdXJzaXZlIGNhbGwgb24gbmVzdGVkIGdseXBoXG5cdFx0XHRnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlcik7XG5cdFx0fVxuXHR9XG5cdHZhciBwb3J0c1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgncG9ydCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBwb3J0c1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwb3J0ID0gbnMuUG9ydC5mcm9tWE1MKHBvcnRzWE1MW2ldKTtcblx0XHRnbHlwaC5hZGRQb3J0KHBvcnQpO1xuXHR9XG5cdHJldHVybiBnbHlwaDtcbn07XG4vLyAtLS0tLS0tIEVORCBHTFlQSCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTEFCRUwgLS0tLS0tLVxubnMuTGFiZWwgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndGV4dCddKTtcblx0dGhpcy50ZXh0ID0gcGFyYW1zLnRleHQ7XG59O1xuXG5ucy5MYWJlbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5MYWJlbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5MYWJlbDtcblxubnMuTGFiZWwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGFiZWxcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLnRleHQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB0ZXh0PSdcIit0aGlzLnRleHQrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5MYWJlbC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2xhYmVsJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGFiZWwsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGxhYmVsID0gbmV3IG5zLkxhYmVsKCk7XG5cdGxhYmVsLnRleHQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0ZXh0Jyk7XG5cdHJldHVybiBsYWJlbDtcbn07XG4vLyAtLS0tLS0tIEVORCBMQUJFTCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gQkJPWCAtLS0tLS0tXG5ucy5CYm94ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneScsICd3JywgJ2gnXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcblx0dGhpcy53ID0gcGFyc2VGbG9hdChwYXJhbXMudyk7XG5cdHRoaXMuaCA9IHBhcnNlRmxvYXQocGFyYW1zLmgpO1xufTtcblxubnMuQmJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5CYm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkJib3g7XG5cbm5zLkJib3gucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8YmJveFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMudykpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgdz0nXCIrdGhpcy53K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLmgpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGg9J1wiK3RoaXMuaCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkJib3guZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdiYm94Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYmJveCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgYmJveCA9IG5ldyBucy5CYm94KCk7XG5cdGJib3gueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0YmJveC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRiYm94LncgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3cnKSk7XG5cdGJib3guaCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgnaCcpKTtcblx0cmV0dXJuIGJib3g7XG59O1xuLy8gLS0tLS0tLSBFTkQgQkJPWCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gU1RBVEUgLS0tLS0tLVxubnMuU3RhdGVUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3ZhbHVlJywgJ3ZhcmlhYmxlJ10pO1xuXHR0aGlzLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xuXHR0aGlzLnZhcmlhYmxlID0gcGFyYW1zLnZhcmlhYmxlO1xufTtcblxubnMuU3RhdGVUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHN0YXRlXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy52YWx1ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhbHVlPSdcIit0aGlzLnZhbHVlK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMudmFyaWFibGUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2YXJpYWJsZT0nXCIrdGhpcy52YXJpYWJsZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlN0YXRlVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3N0YXRlJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3RhdGUsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHN0YXRlID0gbmV3IG5zLlN0YXRlVHlwZSgpO1xuXHRzdGF0ZS52YWx1ZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdHN0YXRlLnZhcmlhYmxlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFyaWFibGUnKTtcblx0cmV0dXJuIHN0YXRlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUQVRFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBDTE9ORSAtLS0tLS0tXG5ucy5DbG9uZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnbGFiZWwnXSk7XG5cdHRoaXMubGFiZWwgPSBwYXJhbXMubGFiZWw7XG59O1xuXG5ucy5DbG9uZVR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Y2xvbmVcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLmxhYmVsICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbGFiZWw9J1wiK3RoaXMubGFiZWwrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5DbG9uZVR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdjbG9uZScpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNsb25lLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBjbG9uZSA9IG5ldyBucy5DbG9uZVR5cGUoKTtcblx0Y2xvbmUubGFiZWwgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuXHRyZXR1cm4gY2xvbmU7XG59O1xuLy8gLS0tLS0tLSBFTkQgQ0xPTkUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFBPUlQgLS0tLS0tLVxubnMuUG9ydCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICd4JywgJ3knXSk7XG5cdHRoaXMuaWQgPSBwYXJhbXMuaWQ7XG5cdHRoaXMueCBcdD0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSBcdD0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5Qb3J0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLlBvcnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuUG9ydDtcblxubnMuUG9ydC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxwb3J0XCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5Qb3J0LmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAncG9ydCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHBvcnQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHBvcnQgPSBuZXcgbnMuUG9ydCgpO1xuXHRwb3J0LnggXHQ9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0cG9ydC55IFx0PSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHBvcnQuaWQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRyZXR1cm4gcG9ydDtcbn07XG4vLyAtLS0tLS0tIEVORCBQT1JUIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBBUkMgLS0tLS0tLVxubnMuQXJjID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ2NsYXNzXycsICdzb3VyY2UnLCAndGFyZ2V0JywgJ3N0YXJ0JywgJ2VuZCcsICduZXh0cycsICdnbHlwaHMnXSk7XG5cdHRoaXMuaWQgXHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5jbGFzc18gPSBwYXJhbXMuY2xhc3NfO1xuXHR0aGlzLnNvdXJjZSA9IHBhcmFtcy5zb3VyY2U7XG5cdHRoaXMudGFyZ2V0ID0gcGFyYW1zLnRhcmdldDtcblxuXHR0aGlzLnN0YXJ0IFx0PSBwYXJhbXMuc3RhcnQ7XG5cdHRoaXMuZW5kIFx0PSBwYXJhbXMuZW5kO1xuXHR0aGlzLm5leHRzIFx0PSBwYXJhbXMubmV4dHMgfHwgW107XG5cdHRoaXMuZ2x5cGhzID0gcGFyYW1zLmdseXBocyB8fMKgW107XG59O1xuXG5ucy5BcmMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuQXJjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkFyYztcblxubnMuQXJjLnByb3RvdHlwZS5zZXRTdGFydCA9IGZ1bmN0aW9uIChzdGFydCkge1xuXHR0aGlzLnN0YXJ0ID0gc3RhcnQ7XG59O1xuXG5ucy5BcmMucHJvdG90eXBlLnNldEVuZCA9IGZ1bmN0aW9uIChlbmQpIHtcblx0dGhpcy5lbmQgPSBlbmQ7XG59O1xuXG5ucy5BcmMucHJvdG90eXBlLmFkZE5leHQgPSBmdW5jdGlvbiAobmV4dCkge1xuXHR0aGlzLm5leHRzLnB1c2gobmV4dCk7XG59O1xuXG5ucy5BcmMucHJvdG90eXBlLmFkZEdseXBoID0gZnVuY3Rpb24gKGdseXBoKSB7XG5cdHRoaXMuZ2x5cGhzLnB1c2goZ2x5cGgpO1xufTtcblxubnMuQXJjLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGFyY1wiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGNsYXNzPSdcIit0aGlzLmNsYXNzXytcIidcIjtcblx0fVxuXHRpZih0aGlzLnNvdXJjZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHNvdXJjZT0nXCIrdGhpcy5zb3VyY2UrXCInXCI7XG5cdH1cblx0aWYodGhpcy50YXJnZXQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB0YXJnZXQ9J1wiK3RoaXMudGFyZ2V0K1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIj5cXG5cIjtcblxuXHQvLyBjaGlsZHJlblxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuZ2x5cGhzW2ldLnRvWE1MKCk7XG5cdH1cblx0aWYodGhpcy5zdGFydCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuc3RhcnQudG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMubmV4dHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5uZXh0c1tpXS50b1hNTCgpO1xuXHR9XG5cdGlmKHRoaXMuZW5kICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5lbmQudG9YTUwoKTtcblx0fVxuXG5cdHhtbFN0cmluZyArPSBcIjwvYXJjPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuQXJjLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnYXJjJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYXJjLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBhcmMgPSBuZXcgbnMuQXJjKCk7XG5cdGFyYy5pZCBcdFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRhcmMuY2xhc3NfIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXHRhcmMuc291cmNlIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcblx0YXJjLnRhcmdldCBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XG5cblx0dmFyIHN0YXJ0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGFydCcpWzBdO1xuXHRpZiAoc3RhcnRYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGFydCA9IG5zLlN0YXJ0VHlwZS5mcm9tWE1MKHN0YXJ0WE1MKTtcblx0XHRhcmMuc2V0U3RhcnQoc3RhcnQpO1xuXHR9XG5cdHZhciBuZXh0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0Jyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IG5leHRYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbmV4dCA9IG5zLk5leHRUeXBlLmZyb21YTUwobmV4dFhNTFtpXSk7XG5cdFx0YXJjLmFkZE5leHQobmV4dCk7XG5cdH1cblx0dmFyIGVuZFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW5kJylbMF07XG5cdGlmIChlbmRYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBlbmQgPSBucy5FbmRUeXBlLmZyb21YTUwoZW5kWE1MKTtcblx0XHRhcmMuc2V0RW5kKGVuZCk7XG5cdH1cblx0dmFyIGdseXBoc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZ2x5cGgnKTtcblx0Zm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhzWE1MLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGdseXBoID0gbnMuR2x5cGguZnJvbVhNTChnbHlwaHNYTUxbaV0pO1xuXHRcdGFyYy5hZGRHbHlwaChnbHlwaCk7XG5cdH1cblxuXHRyZXR1cm4gYXJjO1xufTtcblxuLy8gLS0tLS0tLSBFTkQgQVJDIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBTVEFSVFRZUEUgLS0tLS0tLVxubnMuU3RhcnRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xufTtcblxubnMuU3RhcnRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHN0YXJ0XCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeD0nXCIrdGhpcy54K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHk9J1wiK3RoaXMueStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlN0YXJ0VHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3N0YXJ0Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3RhcnQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHN0YXJ0ID0gbmV3IG5zLlN0YXJ0VHlwZSgpO1xuXHRzdGFydC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xuXHRzdGFydC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRyZXR1cm4gc3RhcnQ7XG59O1xuLy8gLS0tLS0tLSBFTkQgU1RBUlRUWVBFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBFTkRUWVBFIC0tLS0tLS1cbm5zLkVuZFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5FbmRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGVuZFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5FbmRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZW5kJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZW5kLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBlbmQgPSBuZXcgbnMuRW5kVHlwZSgpO1xuXHRlbmQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0ZW5kLnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHJldHVybiBlbmQ7XG59O1xuLy8gLS0tLS0tLSBFTkQgRU5EVFlQRSAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTkVYVFRZUEUgLS0tLS0tLVxubnMuTmV4dFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5OZXh0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxuZXh0XCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeD0nXCIrdGhpcy54K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHk9J1wiK3RoaXMueStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLk5leHRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbmV4dCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIG5leHQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIG5leHQgPSBuZXcgbnMuTmV4dFR5cGUoKTtcblx0bmV4dC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xuXHRuZXh0LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHJldHVybiBuZXh0O1xufTtcbi8vIC0tLS0tLS0gRU5EIE5FWFRUWVBFIC0tLS0tLS1cblxubnMucmVuZGVyRXh0ZW5zaW9uID0gcmVuZGVyRXh0O1xubW9kdWxlLmV4cG9ydHMgPSBuczsiLCJ2YXIgbnMgPSB7fTtcblxuLypcblx0Z3VhcmFudGVlcyB0byByZXR1cm4gYW4gb2JqZWN0IHdpdGggZ2l2ZW4gYXJncyBiZWluZyBzZXQgdG8gbnVsbCBpZiBub3QgcHJlc2VudCwgb3RoZXIgYXJncyByZXR1cm5lZCBhcyBpc1xuKi9cbm5zLmNoZWNrUGFyYW1zID0gZnVuY3Rpb24gKHBhcmFtcywgbmFtZXMpIHtcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT0gXCJ1bmRlZmluZWRcIiB8fCBwYXJhbXMgPT0gbnVsbCkge1xuXHRcdHBhcmFtcyA9IHt9O1xuXHR9XG5cdGlmICh0eXBlb2YgcGFyYW1zICE9ICdvYmplY3QnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIHBhcmFtcy4gT2JqZWN0IHdpdGggbmFtZWQgcGFyYW1ldGVycyBtdXN0IGJlIHBhc3NlZC5cIik7XG5cdH1cblx0Zm9yKHZhciBpPTA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBhcmdOYW1lID0gbmFtZXNbaV07XG5cdFx0aWYgKHR5cGVvZiBwYXJhbXNbYXJnTmFtZV0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHBhcmFtc1thcmdOYW1lXSA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBwYXJhbXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbnM7Il19

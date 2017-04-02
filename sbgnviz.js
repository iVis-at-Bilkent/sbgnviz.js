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
},{"./sbgn-extensions/sbgn-cy-instance":3,"./sbgn-extensions/sbgn-cy-renderer":4,"./utilities/element-utilities":5,"./utilities/file-utilities":6,"./utilities/graph-utilities":7,"./utilities/keyboard-input-utilities":9,"./utilities/lib-utilities":10,"./utilities/main-utilities":11,"./utilities/option-utilities":12,"./utilities/ui-utilities":16,"./utilities/undo-redo-action-functions":17}],3:[function(_dereq_,module,exports){
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
            'padding-left': 0,
            'padding-right': 0,
            'padding-top': 0,
            'padding-bottom': 0
          })
          .selector("node:parent")
          .css({
            'padding-left': getCompoundPaddings,
            'padding-right': getCompoundPaddings,
            'padding-top': getCompoundPaddings,
            'padding-bottom': getCompoundPaddings
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
            'text-halign': 'center'
          })
          .selector("node[class='compartment']")
          .css({
            'border-width': 3.25,
            'background-opacity': 0,
            'text-valign': 'bottom',
            'text-halign': 'center'
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
            }
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
},{"../utilities/element-utilities":5,"../utilities/graph-utilities":7,"../utilities/lib-utilities":10,"../utilities/option-utilities":12,"../utilities/undo-redo-action-functions":17}],4:[function(_dereq_,module,exports){
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

},{"../utilities/lib-utilities":10,"../utilities/text-utilities":15}],5:[function(_dereq_,module,exports){
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
    
    // Section End
    // Stylesheet helpers
};

module.exports = elementUtilities;

},{"./lib-utilities":10,"./option-utilities":12,"./text-utilities":15}],6:[function(_dereq_,module,exports){
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

    if (typeof callback !== 'undefined') callback(text);
    setTimeout(function () {
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
  return 0;
  var blob = new Blob([sbgnmlText], {
    type: "text/plain;charset=utf-8;",
  });
  saveAs(blob, filename);
};

module.exports = fileUtilities;

},{"./graph-utilities":7,"./json-to-sbgnml-converter":8,"./lib-utilities":10,"./sbgnml-to-json-converter":14,"./ui-utilities":16}],7:[function(_dereq_,module,exports){
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

  cy.layout({
    name: 'preset',
    positions: positionMap,
    fit: true,
    padding: 50
  });

  this.refreshPaddings(); // Recalculates/refreshes the compound paddings
  cy.endBatch();

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
var renderExtension = _dereq_('./sbgnml-render');

var jsonToSbgnml = {
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
        sbgnmlText = sbgnmlText + "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
        sbgnmlText = sbgnmlText + "<sbgn xmlns='http://sbgn.org/libsbgn/0.3'>\n";
        sbgnmlText = sbgnmlText + "<map language='process description' id='"+mapID+"'>\n";
        if (hasExtension) { // extension is there
            sbgnmlText = sbgnmlText + "<extension>\n";
        }
        if (hasRenderExtension) {
            console.log(renderInfo);
            //var colorDefList = new renderExtension.ListOfColorDefinitions(renderInfo.colorDef.colorList);
            var renderInformation = new renderExtension.RenderInformation('renderInformation', 
                                                                            undefined, renderInfo.colorDef.backgroundColor);
            var listOfColorDefinitions = new renderExtension.ListOfColorDefinitions();
            for (var i=0; i<renderInfo.colorDef.colorList.length; i++) {
                var color = renderInfo.colorDef.colorList[i];
                var colorDefinition = new renderExtension.ColorDefinition(txtUtil.getXMLValidId(color), color);
                listOfColorDefinitions.addColorDefinition(colorDefinition);
            }
            renderInformation.setListOfColorDefinition(listOfColorDefinitions);

            var listOfStyles = new renderExtension.ListOfStyles();
            for (var key in renderInfo.styleDef) {
                var style = renderInfo.styleDef[key];
                console.log(style, key, renderInfo);
                var xmlStyle = new renderExtension.Style(txtUtil.getXMLValidId(key), 
                                                        undefined, style.idList.map(txtUtil.getXMLValidId));
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
            sbgnmlText =  sbgnmlText + renderInformation.toXML();
        }
        if (hasExtension) {
            sbgnmlText = sbgnmlText + "</extension>\n";
        }
        console.log(sbgnmlText);

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
                "<glyph id='" + txtUtil.getXMLValidId(node._private.data.id) + "' class='compartment' ";

            if(node.parent().isParent()){
                var parent = node.parent();
                sbgnmlText = sbgnmlText + " compartmentRef='" + txtUtil.getXMLValidId(node._private.data.parent) + "'";
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
                "<glyph id='" + txtUtil.getXMLValidId(node._private.data.id) + "' class='" + node._private.data.class + "' ";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.class == "compartment")
                    sbgnmlText = sbgnmlText + " compartmentRef='" + txtUtil.getXMLValidId(parent._private.data.id) + "'";
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
                "<glyph id='" + txtUtil.getXMLValidId(node._private.data.id) + "' class='" + node._private.data.class + "'";

            if(node.parent().isParent()){
                var parent = node.parent()[0];
                if(parent._private.data.class == "compartment")
                    sbgnmlText = sbgnmlText + " compartmentRef='" + txtUtil.getXMLValidId(parent._private.data.id) + "'";
            }

            sbgnmlText = sbgnmlText + " >\n";

            sbgnmlText = sbgnmlText + self.addCommonGlyphProperties(node);

            sbgnmlText = sbgnmlText + "</glyph>\n";
        }

        return  sbgnmlText;
    },

    addCommonGlyphProperties : function(node){
        var sbgnmlText = "";

        // order matters here for the validation of an xsd:sequence
        //add label information
        sbgnmlText = sbgnmlText + this.addLabel(node);
        //add clone information
        sbgnmlText = sbgnmlText + this.addClone(node);
        //add bbox information
        sbgnmlText = sbgnmlText + this.addGlyphBbox(node);
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
            var statesandinfosId = txtUtil.getXMLValidId(node._private.data.id)+"_"+i;
            if(boxGlyph.clazz === "state variable"){
                sbgnmlText = sbgnmlText + this.addStateBoxGlyph(boxGlyph, statesandinfosId, node);
            }
            else if(boxGlyph.clazz === "unit of information"){
                sbgnmlText = sbgnmlText + this.addInfoBoxGlyph(boxGlyph, statesandinfosId, node);
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

        sbgnmlText = sbgnmlText + "<arc id='" + txtUtil.getXMLValidId(arcId) +
            "' target='" + txtUtil.getXMLValidId(arcTarget) +
            "' source='" + txtUtil.getXMLValidId(arcSource) + "' class='" +
            edge._private.data.class + "'>\n";

        sbgnmlText = sbgnmlText + "<start y='" + edge._private.rscratch.startY + "' x='" +
            edge._private.rscratch.startX + "'/>\n";

        // Export bend points if edgeBendEditingExtension is registered
        if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
          var segpts = cy.edgeBendEditing('get').getSegmentPoints(edge);
          if(segpts){
            for(var i = 0; segpts && i < segpts.length; i = i + 2){
              var bendX = segpts[i];
              var bendY = segpts[i + 1];

              sbgnmlText = sbgnmlText + "<next y='" + bendY + "' x='" + bendX + "'/>\n";
            }
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

            sbgnmlText = sbgnmlText + "<port id='" + txtUtil.getXMLValidId(ports[i].id)+
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

    addStateBoxGlyph : function(node, id, mainGlyph){
        var sbgnmlText = "";

        sbgnmlText = sbgnmlText + "<glyph id='" + id + "' class='state variable'>\n";
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

    addInfoBoxGlyph : function(node, id, mainGlyph){
        var sbgnmlText = "";

        sbgnmlText = sbgnmlText + "<glyph id='" + id + "' class='unit of information'>\n";
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

},{"./sbgnml-render":13,"./text-utilities":15}],9:[function(_dereq_,module,exports){
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
    cy.elements().filter(':visible').layout(layoutOptions);
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
},{"./element-utilities":5,"./json-to-sbgnml-converter":8,"./lib-utilities":10,"./option-utilities":12,"./sbgnml-to-json-converter":14}],12:[function(_dereq_,module,exports){
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
var txtUtil = _dereq_('./text-utilities');
var pkgVersion = _dereq_('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = _dereq_('../../package.json').name;

var sbgnmlRenderExtension = {};
sbgnmlRenderExtension.xmlns = "http://www.sbml.org/sbml/level3/version1/render/version1";

sbgnmlRenderExtension.ColorDefinition = function(id, value) {
	// both are optional
	this.id = id;
	this.value = value;
};
sbgnmlRenderExtension.ColorDefinition.prototype.toXML = function () {
	var xmlString = "<colorDefinition";
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.value !== 'undefined') {
		xmlString += " value='"+this.value+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

sbgnmlRenderExtension.ListOfColorDefinitions = function () {
	this.colorList = [];
};
sbgnmlRenderExtension.ListOfColorDefinitions.prototype.addColorDefinition = function (colorDefinition) {
	this.colorList.push(colorDefinition);
};
sbgnmlRenderExtension.ListOfColorDefinitions.prototype.toXML = function () {
	var xmlString = "<listOfColorDefinitions>\n";
	for(var i=0; i<this.colorList.length; i++) {
		var color = this.colorList[i];
		xmlString += color.toXML();
	}
	xmlString += "</listOfColorDefinitions>\n";
	return xmlString;
};


sbgnmlRenderExtension.RenderGroup = function (param) {
	// each of those are optional, so test if it is defined is mandatory
	// specific to renderGroup
	this.fontSize = param.fontSize;
	this.fontFamily = param.fontFamily;
	this.fontWeight = param.fontWeight;
	this.fontStyle = param.fontStyle;
	this.textAnchor = param.textAnchor; // probably useless
	this.vtextAnchor = param.vtextAnchor; // probably useless
	// from GraphicalPrimitive2D
	this.fill = param.fill; // fill color
	// from GraphicalPrimitive1D
	this.id = param.id;
	this.stroke = param.stroke; // stroke color
	this.strokeWidth = param.strokeWidth;
};
sbgnmlRenderExtension.RenderGroup.prototype.toXML = function () {
	var xmlString = "<g";
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.fontSize !== 'undefined') {
		xmlString += " fontSize='"+this.fontSize+"'";
	}
	if (typeof this.fontFamily !== 'undefined') {
		xmlString += " fontFamily='"+this.fontFamily+"'";
	}
	if (typeof this.fontWeight !== 'undefined') {
		xmlString += " fontWeight='"+this.fontWeight+"'";
	}
	if (typeof this.fontStyle !== 'undefined') {
		xmlString += " fontStyle='"+this.fontStyle+"'";
	}
	if (typeof this.textAnchor !== 'undefined') {
		xmlString += " textAnchor='"+this.textAnchor+"'";
	}
	if (typeof this.vtextAnchor !== 'undefined') {
		xmlString += " vtextAnchor='"+this.vtextAnchor+"'";
	}
	if (typeof this.stroke !== 'undefined') {
		xmlString += " stroke='"+this.stroke+"'";
	}
	if (typeof this.strokeWidth !== 'undefined') {
		xmlString += " strokeWidth='"+this.strokeWidth+"'";
	}
	if (typeof this.fill !== 'undefined') {
		xmlString += " fill='"+this.fill+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

// localStyle from specs
sbgnmlRenderExtension.Style = function(id, name, idList) {
	// everything is optional	
	this.id = id;
	this.name = name;
	this.idList = idList;
	this.renderGroup = null; // 0 or 1
};
sbgnmlRenderExtension.Style.prototype.setRenderGroup = function (renderGroup) {
	this.renderGroup = renderGroup;
};
sbgnmlRenderExtension.Style.prototype.toXML = function () {
	var xmlString = "<style";
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.name !== 'undefined') {
		xmlString += " name='"+this.name+"'";
	}
	if (typeof this.idList !== 'undefined') {
		xmlString += " idList='"+this.idList.join(' ')+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};

sbgnmlRenderExtension.ListOfStyles = function() {
	this.styleList = [];
};
sbgnmlRenderExtension.ListOfStyles.prototype.addStyle = function(style) {
	this.styleList.push(style);
};
sbgnmlRenderExtension.ListOfStyles.prototype.toXML = function () {
	var xmlString = "<listOfStyles>\n";
	for(var i=0; i<this.styleList.length; i++) {
		var style = this.styleList[i];
		xmlString += style.toXML();
	}
	xmlString += "</listOfStyles>\n";
	return xmlString;
};

sbgnmlRenderExtension.RenderInformation = function (id, name, backgroundColor) {
	this.id = id; // required, rest is optional
	this.name = name;
	this.programName = pkgName;
	this.programVersion = pkgVersion;
	this.backgroundColor = backgroundColor;
	this.listOfColorDefinitions = null;
	this.listOfStyles = null;
	/*this.listOfColorDefinitions = new renderExtension.ListOfColorDefinitions(renderInfo.colorDef.colorList);
	this.listOfStyles = new renderExtension.ListOfStyles(renderInfo.styleDef);
	*/
};
sbgnmlRenderExtension.RenderInformation.prototype.setListOfColorDefinition = function(listOfColorDefinitions) {
	this.listOfColorDefinitions = listOfColorDefinitions;
};
sbgnmlRenderExtension.RenderInformation.prototype.setListOfStyles = function(listOfStyles) {
	this.listOfStyles = listOfStyles;
};
sbgnmlRenderExtension.RenderInformation.prototype.toXML = function() {
	// tag and its attributes
	var xmlString = "<renderInformation id='"+this.id+"'";
	if (typeof this.name !== 'undefined') {
		xmlString += " name='"+this.name+"'";
	}
	if (typeof this.programName !== 'undefined') {
		xmlString += " programName='"+this.programName+"'";
	}
	if (typeof this.programVersion !== 'undefined') {
		xmlString += " programVersion='"+this.programVersion+"'";
	}
	if (typeof this.backgroundColor !== 'undefined') {
		xmlString += " backgroundColor='"+this.backgroundColor+"'";
	}
	xmlString += " xmlns='"+sbgnmlRenderExtension.xmlns+"'>\n";

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

/* probably useless, seems like nobody use this in the extension
sbgnmlRenderExtension.defaultValues = {
	backgroundColor: null,
	fontSize: null,
	fontFamily: null,
	fontWeight: null,
	fontStyle: null,
	textAnchor: null,
	vtextAnchor: null,
	fill: null,
	stroke: null,
	strokeWidth: null
};


sbgnmlRenderExtension.listOfRenderInformation = {
	defaultValues: {},
	renderInformationList: []
}
*/

module.exports = sbgnmlRenderExtension;
},{"../../package.json":1,"./text-utilities":15}],14:[function(_dereq_,module,exports){
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

},{"./element-utilities":5}],15:[function(_dereq_,module,exports){
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
},{"./option-utilities":12}],16:[function(_dereq_,module,exports){
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



},{"./lib-utilities":10,"./option-utilities":12}],17:[function(_dereq_,module,exports){
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
},{"./element-utilities":5}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC1yZW5kZXIuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ24zREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcInNiZ252aXpcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMy4xLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNCR05QRCB2aXN1YWxpemF0aW9uIGxpYnJhcnlcIixcbiAgXCJtYWluXCI6IFwic3JjL2luZGV4LmpzXCIsXG4gIFwibGljZW5jZVwiOiBcIkxHUEwtMy4wXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIixcbiAgICBcImJ1aWxkLXNiZ252aXotanNcIjogXCJndWxwIGJ1aWxkXCIsXG4gICAgXCJkZWJ1Zy1qc1wiOiBcIm5vZGVtb24gLWUganMgLS13YXRjaCBzcmMgLXggXFxcIm5wbSBydW4gYnVpbGQtc2JnbnZpei1qc1xcXCJcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzLmdpdFwiXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9cIixcbiAgXCJwZWVyLWRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJqcXVlcnlcIjogXCJeMi4yLjRcIixcbiAgICBcImZpbGVzYXZlcmpzXCI6IFwifjAuMi4yXCIsXG4gICAgXCJjeXRvc2NhcGVcIjogXCJpVmlzLWF0LUJpbGtlbnQvY3l0b3NjYXBlLmpzI3Vuc3RhYmxlXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYnJvd3NlcmlmeVwiOiBcIl4xMS4yLjBcIixcbiAgICBcImd1bHBcIjogXCJeMy45LjBcIixcbiAgICBcImd1bHAtZGVyZXF1aXJlXCI6IFwiXjIuMS4wXCIsXG4gICAgXCJndWxwLWpzaGludFwiOiBcIl4xLjExLjJcIixcbiAgICBcImd1bHAtcHJvbXB0XCI6IFwiXjAuMS4yXCIsXG4gICAgXCJndWxwLXJlcGxhY2VcIjogXCJeMC41LjRcIixcbiAgICBcImd1bHAtc2hlbGxcIjogXCJeMC41LjBcIixcbiAgICBcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxuICAgIFwianNoaW50LXN0eWxpc2hcIjogXCJeMi4wLjFcIixcbiAgICBcIm5vZGUtbm90aWZpZXJcIjogXCJeNC4zLjFcIixcbiAgICBcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuICAgIFwidmlueWwtYnVmZmVyXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJ2aW55bC1zb3VyY2Utc3RyZWFtXCI6IFwiXjEuMS4wXCJcbiAgfVxufVxuIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBzYmdudml6ID0gd2luZG93LnNiZ252aXogPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcbiAgICB2YXIgbGlicyA9IHt9O1xuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpO1xuICAgIFxuICAgIHZhciBzYmduUmVuZGVyZXIgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyJyk7XG4gICAgdmFyIHNiZ25DeUluc3RhbmNlID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZScpO1xuICAgIFxuICAgIC8vIFV0aWxpdGllcyB3aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSBleHBvc2VkIHNlcGVyYXRlbHlcbiAgICB2YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91aS11dGlsaXRpZXMnKTtcbiAgICB2YXIgZmlsZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2ZpbGUtdXRpbGl0aWVzJyk7XG4gICAgdmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xuICAgIHJlcXVpcmUoJy4vdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcycpOyAvLyByZXF1aXJlIGtleWJvcmQgaW5wdXQgdXRpbGl0aWVzXG4gICAgLy8gVXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgYXMgaXNcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbiAgICBcbiAgICBzYmduUmVuZGVyZXIoKTtcbiAgICBzYmduQ3lJbnN0YW5jZSgpO1xuICAgIFxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzLCBtb3N0IHVzZXJzIHdpbGwgbm90IG5lZWQgdGhlc2VcbiAgICBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBmaWxlVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gZmlsZVV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIHVpVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gdWlVdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIHNiZ24gZ3JhcGggdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBncmFwaFV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IGdyYXBoVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzYmdudml6O1xuICB9XG59KSgpOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbnZhciByZWZyZXNoUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChncmFwaFV0aWxpdGllcyk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIGdldENvbXBvdW5kUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLy8gUmV0dXJuIGNhbGN1bGF0ZWQgcGFkZGluZ3MgaW4gY2FzZSBvZiB0aGF0IGRhdGEgaXMgaW52YWxpZCByZXR1cm4gNVxuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzIHx8IDU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnRhaW5lclNlbGVjdG9yID0gb3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I7XG4gIHZhciBpbWdQYXRoID0gb3B0aW9ucy5pbWdQYXRoO1xuICBcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcbiAge1xuICAgIHZhciBzYmduTmV0d29ya0NvbnRhaW5lciA9ICQoY29udGFpbmVyU2VsZWN0b3IpO1xuXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcbiAgICB2YXIgY3kgPSBjeXRvc2NhcGUoe1xuICAgICAgY29udGFpbmVyOiBzYmduTmV0d29ya0NvbnRhaW5lcixcbiAgICAgIHN0eWxlOiBzYmduU3R5bGVTaGVldCxcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxuICAgICAgYm94U2VsZWN0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1vdGlvbkJsdXI6IHRydWUsXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXG4gICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuY3kgPSB0aGlzO1xuICAgICAgICAvLyBJZiB1bmRvYWJsZSByZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICAgICAgYmluZEN5RXZlbnRzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgLy8gTm90ZSB0aGF0IGluIENoaVNFIHRoaXMgZnVuY3Rpb24gaXMgaW4gYSBzZXBlcmF0ZSBmaWxlIGJ1dCBpbiB0aGUgdmlld2VyIGl0IGhhcyBqdXN0IDIgbWV0aG9kcyBhbmQgc28gaXQgaXMgbG9jYXRlZCBpbiB0aGlzIGZpbGVcbiAgZnVuY3Rpb24gcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKSB7XG4gICAgLy8gY3JlYXRlIG9yIGdldCB0aGUgdW5kby1yZWRvIGluc3RhbmNlXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcblxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZU5vZGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlTm9kZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBiaW5kQ3lFdmVudHMoKSB7XG4gICAgY3kub24oJ3RhcGVuZCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIFxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlY29sbGFwc2VcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgLy9UaGUgY2hpbGRyZW4gaW5mbyBvZiBjb21wbGV4IG5vZGVzIHNob3VsZCBiZSBzaG93biB3aGVuIHRoZXkgYXJlIGNvbGxhcHNlZFxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICAvL1RoZSBub2RlIGlzIGJlaW5nIGNvbGxhcHNlZCBzdG9yZSBpbmZvbGFiZWwgdG8gdXNlIGl0IGxhdGVyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbCA9IGluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcbiAgICAgIC8vIHJlbW92ZSBiZW5kIHBvaW50cyBiZWZvcmUgY29sbGFwc2VcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICAgICAgaWYgKGVkZ2UuaGFzQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykpIHtcbiAgICAgICAgICBlZGdlLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xuICAgICAgICAgIGRlbGV0ZSBlZGdlLl9wcml2YXRlLmNsYXNzZXNbJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJ107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmJlZm9yZWV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICBub2RlLnJlbW92ZURhdGEoXCJpbmZvTGFiZWxcIik7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmFmdGVyZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcbiAgICAgIC8vRG9uJ3Qgc2hvdyBjaGlsZHJlbiBpbmZvIHdoZW4gdGhlIGNvbXBsZXggbm9kZSBpcyBleHBhbmRlZFxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICBub2RlLnJlbW92ZVN0eWxlKCdjb250ZW50Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgc2JnblN0eWxlU2hlZXQgPSBjeXRvc2NhcGUuc3R5bGVzaGVldCgpXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxuICAgICAgICAgICAgJ29wYWNpdHknOiAxLFxuICAgICAgICAgICAgJ3BhZGRpbmctbGVmdCc6IDAsXG4gICAgICAgICAgICAncGFkZGluZy1yaWdodCc6IDAsXG4gICAgICAgICAgICAncGFkZGluZy10b3AnOiAwLFxuICAgICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogMFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpwYXJlbnRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdwYWRkaW5nLWxlZnQnOiBnZXRDb21wb3VuZFBhZGRpbmdzLFxuICAgICAgICAgICAgJ3BhZGRpbmctcmlnaHQnOiBnZXRDb21wb3VuZFBhZGRpbmdzLFxuICAgICAgICAgICAgJ3BhZGRpbmctdG9wJzogZ2V0Q29tcG91bmRQYWRkaW5ncyxcbiAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6IGdldENvbXBvdW5kUGFkZGluZ3NcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbP2Nsb25lbWFya2VyXVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGltZ1BhdGggKyAnL2Nsb25lX2JnLnBuZycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JzogJzUwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1oZWlnaHQnOiAnMjUlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2Nsb25lbWFya2VyJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbnRlbnQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ndGFnJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J2NvbXBhcnRtZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAsXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2Jib3hdW2NsYXNzXVtjbGFzcyE9J2NvbXBsZXgnXVtjbGFzcyE9J2NvbXBhcnRtZW50J11bY2xhc3MhPSdzdWJtYXAnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3dpZHRoJzogJ2RhdGEoYmJveC53KScsXG4gICAgICAgICAgICAnaGVpZ2h0JzogJ2RhdGEoYmJveC5oKSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnd2lkdGgnOiAzNixcbiAgICAgICAgICAgICdoZWlnaHQnOiAzNixcbiAgICAgICAgICAgICdib3JkZXItc3R5bGUnOiAnZGFzaGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpzZWxlY3RlZFwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzAwMCcsXG4gICAgICAgICAgICAndGV4dC1vdXRsaW5lLWNvbG9yJzogJyMwMDAnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOmFjdGl2ZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzE0J1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2N1cnZlLXN0eWxlJzogJ2JlemllcicsXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1maWxsJzogJ2hvbGxvdycsXG4gICAgICAgICAgICAnd2lkdGgnOiAxLjI1LFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2UuY3ktZXhwYW5kLWNvbGxhcHNlLW1ldGEtZWRnZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI0M0QzRDNCcsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNDNEM0QzQnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjQzRDNEM0J1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZTpzZWxlY3RlZFwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZTphY3RpdmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICc4J1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC1yb3RhdGlvbic6ICdhdXRvcm90YXRlJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtc2hhcGUnOiAncmVjdGFuZ2xlJyxcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1vcGFjaXR5JzogJzEnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLXdpZHRoJzogJzEnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLW9wYWNpdHknOiAnMSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J2NvbnN1bXB0aW9uJ11bY2FyZGluYWxpdHkgPiAwXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NvdXJjZS1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ2NhcmRpbmFsaXR5Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW1hcmdpbi15JzogJy0xMCcsXG4gICAgICAgICAgICAnc291cmNlLXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDYXJkaW5hbGl0eURpc3RhbmNlKGVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdwcm9kdWN0aW9uJ11bY2FyZGluYWxpdHkgPiAwXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ2NhcmRpbmFsaXR5Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW1hcmdpbi15JzogJy0xMCcsXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDYXJkaW5hbGl0eURpc3RhbmNlKGVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lBcnJvd1NoYXBlKGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1zaGFwZSc6ICdub25lJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0naW5oaWJpdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgICAgIH0pO1xufTsiLCIvKlxuICogUmVuZGVyIHNiZ24gc3BlY2lmaWMgc2hhcGVzIHdoaWNoIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGN5dG9zY2FwZS5qcyBjb3JlXG4gKi9cblxudmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xuXG52YXIgY3lNYXRoID0gY3l0b3NjYXBlLm1hdGg7XG52YXIgY3lCYXNlTm9kZVNoYXBlcyA9IGN5dG9zY2FwZS5iYXNlTm9kZVNoYXBlcztcbnZhciBjeVN0eWxlUHJvcGVydGllcyA9IGN5dG9zY2FwZS5zdHlsZVByb3BlcnRpZXM7XG52YXIgY3lCYXNlQXJyb3dTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZUFycm93U2hhcGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICQkID0gY3l0b3NjYXBlO1xuICBcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanMgYW5kIG1vZGlmaWVkXG4gIHZhciBkcmF3Um91bmRSZWN0YW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzICl7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gcmFkaXVzIHx8IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyggd2lkdGgsIGhlaWdodCApO1xuXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cblxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcbiAgICBjb250ZXh0Lm1vdmVUbyggeCwgeSAtIGhhbGZIZWlnaHQgKTtcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCArIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCwgeSArIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCAtIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxuICAgIGNvbnRleHQuYXJjVG8oIHggLSBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4LCB5IC0gaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gSm9pbiBsaW5lXG4gICAgY29udGV4dC5saW5lVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XG5cblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gIH07XG4gIFxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qc1xuICB2YXIgZHJhd1BvbHlnb25QYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcG9pbnRzICl7XG5cbiAgICB2YXIgaGFsZlcgPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIID0gaGVpZ2h0IC8gMjtcblxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XG5cbiAgICBjb250ZXh0Lm1vdmVUbyggeCArIGhhbGZXICogcG9pbnRzWzBdLCB5ICsgaGFsZkggKiBwb2ludHNbMV0gKTtcblxuICAgIGZvciggdmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aCAvIDI7IGkrKyApe1xuICAgICAgY29udGV4dC5saW5lVG8oIHggKyBoYWxmVyAqIHBvaW50c1sgaSAqIDJdLCB5ICsgaGFsZkggKiBwb2ludHNbIGkgKiAyICsgMV0gKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9O1xuICBcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduLnNiZ25TaGFwZXMgPSB7XG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxuICAgICdwcm9jZXNzJzogdHJ1ZSxcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICdhc3NvY2lhdGlvbic6IHRydWVcbiAgfTtcblxuICB2YXIgdG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSAkJC5zYmduLnRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXG4gIH07XG5cbiAgJCQuc2Jnbi5hZGRQb3J0UmVwbGFjZW1lbnRJZkFueSA9IGZ1bmN0aW9uIChub2RlLCBlZGdlUG9ydCkge1xuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XG4gICAgdmFyIHBvc1kgPSBub2RlLnBvc2l0aW9uKCkueTtcbiAgICBpZiAodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICAgIGlmIChwb3J0LmlkID09IGVkZ2VQb3J0KSB7XG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XG4gICAgICAgICAgcG9zWSA9IHBvc1kgKyBwb3J0LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xuICB9XG4gIDtcblxuICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHBvaW50cykge1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHBvcnRZID0gcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgY2VudGVyWTtcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxuICAgICAgICAgICAgICBwb2ludHMsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgcGFkZGluZyk7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKGNsb3Nlc3RQb2ludFswXSwgY2xvc2VzdFBvaW50WzFdKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG5cbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xuICB2YXIgc3RhdGVWYXJSYWRpdXMgPSAxNTtcbiAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyA9IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLFxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcblxuICAgIHZhciB1cFdpZHRoID0gMCwgZG93bldpZHRoID0gMDtcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XG4gICAgdmFyIGJlZ2luUG9zWSA9IGhlaWdodCAvIDIsIGJlZ2luUG9zWCA9IHdpZHRoIC8gMjtcblxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gc3RhdGUuYmJveC55O1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZO1xuXG4gICAgICBpZiAocmVsYXRpdmVZUG9zIDwgMCkge1xuICAgICAgICBpZiAodXBXaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgLSBiZWdpblBvc1k7XG5cbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1cFdpZHRoID0gdXBXaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcbiAgICAgIH0gZWxzZSBpZiAocmVsYXRpdmVZUG9zID4gMCkge1xuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyBkb3duV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcbiAgICAgICAgICBzdGF0ZUNlbnRlclkgPSBjZW50ZXJZICsgYmVnaW5Qb3NZO1xuXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XG5cbiAgICAgICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG93bldpZHRoID0gZG93bldpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xuICAgICAgfVxuICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XG5cbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcbiAgICAgIHN0YXRlLmJib3gueCA9IChzdGF0ZUNlbnRlclggLSBjZW50ZXJYKSAqIDEwMCAvIG5vZGUud2lkdGgoKTtcbiAgICAgIHN0YXRlLmJib3gueSA9IChzdGF0ZUNlbnRlclkgLSBjZW50ZXJZKSAqIDEwMCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xuICAgIHZhciBzdGF0ZVZhbHVlID0gdGV4dFByb3Auc3RhdGUudmFsdWUgfHwgJyc7XG4gICAgdmFyIHN0YXRlVmFyaWFibGUgPSB0ZXh0UHJvcC5zdGF0ZS52YXJpYWJsZSB8fCAnJztcblxuICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGVWYWx1ZSArIChzdGF0ZVZhcmlhYmxlXG4gICAgICAgICAgICA/IFwiQFwiICsgc3RhdGVWYXJpYWJsZVxuICAgICAgICAgICAgOiBcIlwiKTtcblxuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XG5cbiAgICB0ZXh0UHJvcC5mb250ID0gZm9udFNpemUgKyBcInB4IEFyaWFsXCI7XG4gICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZUxhYmVsO1xuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3SW5mb1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3ApIHtcbiAgICB2YXIgZm9udFNpemUgPSA5OyAvLyBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcbiAgICB0ZXh0UHJvcC5jb2xvciA9IFwiIzBmMGYwZlwiO1xuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3AsIHRydW5jYXRlKSB7XG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XG4gICAgY29udGV4dC5mb250ID0gdGV4dFByb3AuZm9udDtcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dFByb3AuY29sb3I7XG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0ZXh0UHJvcC5vcGFjaXR5O1xuICAgIHZhciB0ZXh0O1xuICAgIFxuICAgIHRleHRQcm9wLmxhYmVsID0gdGV4dFByb3AubGFiZWwgfHwgJyc7XG4gICAgXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XG4gICAgICB0ZXh0ID0gdGV4dFByb3AubGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICBjb250ZXh0LmZvbnQgPSBvbGRGb250O1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xuICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgfTtcblxuICBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UgPSBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhwb2ludDFbMF0gLSBwb2ludDJbMF0sIDIpICsgTWF0aC5wb3cocG9pbnQxWzFdIC0gcG9pbnQyWzFdLCAyKTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcbiAgfTtcblxuICAkJC5zYmduLmNvbG9ycyA9IHtcbiAgICBjbG9uZTogXCIjYTlhOWE5XCIsXG4gICAgYXNzb2NpYXRpb246IFwiIzZCNkI2QlwiLFxuICAgIHBvcnQ6IFwiIzZCNkI2QlwiXG4gIH07XG5cblxuICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpIHtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XG5cbiAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXG4gICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dCB8fCAnJztcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcbiAgfTtcblxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCB0b3BcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGgsIGhlaWdodCAtIGNvcm5lclJhZGl1cyAvIDMsIFswLCAtMV0sXG4gICAgICAgICAgICBwYWRkaW5nKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXG4gICAgaWYgKGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgcG9pbnRzLFxuICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXMsIGNvcm5lclJhZGl1cywgWzAsIC0xXSxcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL2NoZWNrIGVsbGlwc2VzXG4gICAgdmFyIGNoZWNrSW5FbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcbiAgICAgIHggLT0gY2VudGVyWDtcbiAgICAgIHkgLT0gY2VudGVyWTtcblxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICB5IC89IChoZWlnaHQgLyAyICsgcGFkZGluZyk7XG5cbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcbiAgICAgICAgICAgIGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXG4gICAgaWYgKGNoZWNrSW5FbGxpcHNlKHgsIHksXG4gICAgICAgICAgICBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjb3JuZXJSYWRpdXMgKiAyLCBjb3JuZXJSYWRpdXMgKiAyLCBwYWRkaW5nKSkge1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxuICAvL2hhdmluZyBvcGFxdWUgbm9kZXMgd2hpY2ggaGF2ZSBzdGF0ZSBhbmQgaW5mbyBib3hlcyBnaXZlcyB1bnBsZWFzZW50IHJlc3VsdHMuXG4gICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XG4gICAgaWYgKHBhcmVudE9wYWNpdHkgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYShcIlxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzFdICsgXCIsXCJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMl0gKyBcIixcIlxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICAvL3ZhciBjb3JuZXJSYWRpdXMgPSAkJC5tYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCBoYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCAwLCAtaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBKb2luIGxpbmVcbiAgICBjb250ZXh0LmxpbmVUbygwLCAtaGFsZkhlaWdodCk7XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXgsIC15KTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbCA9IGZ1bmN0aW9uIChcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuXG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgIHZhciBtYXJrZXJCZWdpblggPSAtMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDA7XG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcblxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgfVxuICB9XG4gIDtcblxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IDA7XG4gICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XG5cbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xuICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgTWF0aC5QSSAvIDYsIDMgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhd1BhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUgPSBmdW5jdGlvbiAoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAwKTtcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgY29udGV4dC5saW5lVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xuXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcztcbiAgICBpZiAoc2JnbkNsYXNzICYmIHNiZ25DbGFzcy5pbmRleE9mKFwibXVsdGltZXJcIikgIT0gLTEpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxuICAvL2NvbXBsZXgncyB3aWR0aCBvciBoZWlnaHQgaXMgY2hhbmdlZFxuICAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzID0gZnVuY3Rpb24gKGNvcm5lckxlbmd0aCwgd2lkdGgsIGhlaWdodCkge1xuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxuICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcbiAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xuXG4gICAgdmFyIGNvbXBsZXhQb2ludHMgPSBbLTEgKyBjcFgsIC0xLCAtMSwgLTEgKyBjcFksIC0xLCAxIC0gY3BZLCAtMSArIGNwWCxcbiAgICAgIDEsIDEgLSBjcFgsIDEsIDEsIDEgLSBjcFksIDEsIC0xICsgY3BZLCAxIC0gY3BYLCAtMV07XG5cbiAgICByZXR1cm4gY29tcGxleFBvaW50cztcbiAgfTtcblxuICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcbiAgICAgIHZhciBwb3J0WCA9IHBvcnQueCAqIHdpZHRoIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICBwb3J0WCwgcG9ydFksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwb3J0WCwgcG9ydFkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMucG9ydDtcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc291cmNlIGFuZCBzaW5rJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnY29tcGxleCcpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnZGlzc29jaWF0aW9uJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzaW1wbGUgY2hlbWljYWwnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3Vuc3BlY2lmaWVkIGVudGl0eScpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnb21pdHRlZCBwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCd1bmNlcnRhaW4gcHJvY2VzcycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubGluZVN0eWxlLmVudW1zLnB1c2goJ3Byb2R1Y3Rpb24nKTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5hcnJvd1NoYXBlLmVudW1zLnB1c2goJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduQXJyb3dTaGFwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY3lCYXNlQXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lCYXNlQXJyb3dTaGFwZXNbJ3RyaWFuZ2xlLXRlZSddKTtcbiAgICBjeUJhc2VBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xuICAgICAgLTAuMTgsIC0wLjQzLFxuICAgICAgMC4xOCwgLTAuNDNcbiAgICBdO1xuICB9O1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUoY29udGV4dCwgbm9kZSwgdGhpcy5wb2ludHMpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBub2RlWCxcbiAgICAgICAgICAgICAgICBub2RlWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBzYmduQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuXG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXSA9IHtcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG5cbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzWydhc3NvY2lhdGlvbiddID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0ID0gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJkaXNzb2NpYXRpb25cIl0gPSB7XG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDQsIGhlaWdodCAvIDQpO1xuXG4gICAgICAgIC8vIEF0IG9yaWdpbiwgcmFkaXVzIDEsIDAgdG8gMnBpXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDAsIE1hdGguUEkgKiAyICogMC45OTksIGZhbHNlKTsgLy8gKjAuOTk5IGIvYyBjaHJvbWUgcmVuZGVyaW5nIGJ1ZyBvbiBmdWxsIGNpcmNsZVxuXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUoNCAvIHdpZHRoLCA0IC8gaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3UG9ydHNUb0VsbGlwc2VTaGFwZShjb250ZXh0LCBub2RlKTtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKS0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xuXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxuICAgICAgICAgICAgICAgIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IChub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSAobm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpKSArIHRocmVzaG9sZDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIDtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcblxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxuICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXG4gICAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyxcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcblxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIHB0cyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcblxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMl0sIHB0c1szXSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zb3VyY2VBbmRTaW5rKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUsXG4gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50XG4gICAgfTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdFbGxpcHNlID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vY29udGV4dC5maWxsKCk7XG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcbiAgICB1bnNwZWNpZmllZEVudGl0eTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IC0xICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xuXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCA1ICogTWF0aC5QSSAvIDYpO1xuXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgfVxuICAgIH0sXG4gICAgc291cmNlQW5kU2luazogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG4gICAgfSxcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWCA9IGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWCA9IGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcblxuICAgICAgICBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBmaXJzdENpcmNsZUNlbnRlclgsIGZpcnN0Q2lyY2xlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG5cbiAgICAgICAgc2ltcGxlQ2hlbWljYWxSaWdodENsb25lKGNvbnRleHQsIHNlY29uZENpcmNsZUNlbnRlclgsIHNlY29uZENpcmNsZUNlbnRlclksXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAvIDQgKiBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBjb3JuZXJSYWRpdXMgLyAyO1xuXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LCBjbG9uZVgsIGNsb25lWSwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIHJlY1BvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICB9XG4gICAgfSxcbiAgICBwZXJ0dXJiaW5nQWdlbnQ6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBoZWlnaHQgLyA4O1xuXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTUgLyA2LCAtMSwgNSAvIDYsIC0xLCAxLCAxLCAtMSwgMV07XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHJlbmRlcmVyLmRyYXdQb2x5Z29uKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLCBjb3JuZXJSYWRpdXMsIG9wYWNpdHkpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbWFjcm9tb2xlY3VsZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpO1xuICAgIH0sXG4gICAgY29tcGxleDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XG4gICAgICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAqIGNwWSAvIDI7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XG5cbiAgICAgICAgdmFyIG1hcmtlclBvaW50cyA9IFstMSwgLTEsIDEsIC0xLCAxIC0gY3BYLCAxLCAtMSArIGNwWCwgMV07XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG5cbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcbiAgICBpZiAocG9ydHMubGVuZ3RoIDwgMClcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcbiAgICAgICAgcmV0dXJuIGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcbiAgICAgICAgICAgICAgICB4LCB5LCBwb3J0LnggKiB3aWR0aCAvIDEwMCArIG5vZGVYLCBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBub2RlWSwgMSwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfTtcblxuICAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCwgaW50ZXJzZWN0aW9ucykge1xuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcbiAgICB2YXIgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XG4gICAgICB2YXIgY2hlY2tQb2ludCA9IFtpbnRlcnNlY3Rpb25zW2ldLCBpbnRlcnNlY3Rpb25zW2kgKyAxXV07XG4gICAgICB2YXIgZGlzdGFuY2UgPSBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UocG9pbnQsIGNoZWNrUG9pbnQpO1xuXG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2xvc2VzdEludGVyc2VjdGlvbjtcbiAgfTtcblxuICAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZSA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBub2RlWCwgbm9kZVksIGNvcm5lclJhZGl1cykge1xuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzLCB3ZSBoYXZlIG9ubHkgdHdvIGFyY3MgZm9yXG4gICAgLy9udWNsZWljIGFjaWQgZmVhdHVyZXNcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBMZWZ0XG4gICAge1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xuICB9O1xuXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxuICAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5Miwgbm9kZVgsIG5vZGVZLCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpIHtcblxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIHN0cmFpZ2h0IGxpbmUgc2VnbWVudHNcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cbiAgICB7XG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50c1xuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIExlZnRcbiAgICB7XG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wTGVmdENlbnRlclgsIHRvcExlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gdG9wTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9wIFJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wUmlnaHRDZW50ZXJYLCB0b3BSaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BSaWdodENlbnRlclkpIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gTGVmdFxuICAgIHtcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xuXG4gICAgdmFyIHcgPSB3aWR0aCAvIDIgKyBwYWRkaW5nO1xuICAgIHZhciBoID0gaGVpZ2h0IC8gMiArIHBhZGRpbmc7XG4gICAgdmFyIGFuID0gY2VudGVyWDtcbiAgICB2YXIgYm4gPSBjZW50ZXJZO1xuXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XG5cbiAgICB2YXIgbSA9IGRbMV0gLyBkWzBdO1xuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcbiAgICB2YXIgYSA9IGggKiBoICsgdyAqIHcgKiBtICogbTtcbiAgICB2YXIgYiA9IC0yICogYW4gKiBoICogaCArIDIgKiBtICogbiAqIHcgKiB3IC0gMiAqIGJuICogbSAqIHcgKiB3O1xuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXG4gICAgICAgICAgICBibiAqIGJuICogdyAqIHcgLSBoICogaCAqIHcgKiB3O1xuXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xuXG4gICAgaWYgKGRpc2NyaW1pbmFudCA8IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xuICAgIHZhciB0MiA9ICgtYiAtIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XG5cbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XG4gICAgdmFyIHhNYXggPSBNYXRoLm1heCh0MSwgdDIpO1xuXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xuICAgIHZhciB5TWF4ID0gbSAqIHhNYXggLSBtICogeDIgKyB5MjtcblxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcblxuICAgIHZhciBpbnRlcnNlY3Rpb25zID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xuXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiICYmIHN0YXRlQ291bnQgPCAyKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBwYWRkaW5nKTtcblxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChzdGF0ZUludGVyc2VjdExpbmVzKTtcblxuICAgICAgICBzdGF0ZUNvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIHZhciBpbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XG5cbiAgICAgICAgaWYgKGluZm9JbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xuXG4gICAgICAgIGluZm9Db3VudCsrO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPXBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuXG4gICAgdmFyIHN0YXRlQ291bnQgPSAwLCBpbmZvQ291bnQgPSAwO1xuLy8gICAgdGhyZXNob2xkID0gcGFyc2VGbG9hdCh0aHJlc2hvbGQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBwYXJzZUZsb2F0KHN0YXRlLmJib3guaCkgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XG5cbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHN0YXRlQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcblxuICAgICAgICBpZiAoaW5mb0NoZWNrUG9pbnQgPT0gdHJ1ZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpbmZvQ291bnQrKztcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XG4gICAgaWYgKHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59O1xuIiwiLypcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxuICovXG5cbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcbiAgICAvL3RoZSBsaXN0IG9mIHRoZSBlbGVtZW50IGNsYXNzZXMgaGFuZGxlZCBieSB0aGUgdG9vbFxuICAgIGhhbmRsZWRFbGVtZW50czoge1xuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAgICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlLFxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxuICAgICAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAnYXNzb2NpYXRpb24nOiB0cnVlLFxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXG4gICAgICAgICd0YWcnOiB0cnVlLFxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXG4gICAgICAgICdtb2R1bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXG4gICAgICAgICdpbmhpYml0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxuICAgICAgICAnZXF1aXZhbGVuY2UgYXJjJzogdHJ1ZSxcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdub3Qgb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnYW5kJzogdHJ1ZSxcbiAgICAgICAgJ29yJzogdHJ1ZSxcbiAgICAgICAgJ25vdCc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxuICAgIH0sXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcbiAgICAgICAgJ2Fzc29jaWF0aW9uJywgJ2Rpc3NvY2lhdGlvbicsICdwaGVub3R5cGUnXSxcbiAgICAgIFxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXG4gICAgZ2V0VG9wTW9zdE5vZGVzOiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByb290cztcbiAgICB9LFxuICAgIC8vVGhpcyBtZXRob2QgY2hlY2tzIGlmIGFsbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYXNzdW1pbmcgdGhhdCB0aGUgc2l6ZSBcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gbm9kZXNbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEoXCJwYXJlbnRcIikgIT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgbW92ZU5vZGVzOiBmdW5jdGlvbihwb3NpdGlvbkRpZmYsIG5vZGVzLCBub3RDYWxjVG9wTW9zdE5vZGVzKSB7XG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0b3BNb3N0Tm9kZXNbaV07XG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XG4gICAgICAgIG5vZGUucG9zaXRpb24oe1xuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xuICAgICAgdmFyIHBhbiA9IGN5LnBhbigpO1xuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XG5cbiAgICAgIHZhciB4ID0gKHJlbmRlcmVkUG9zaXRpb24ueCAtIHBhbi54KSAvIHpvb207XG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG4gICAgXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcbiAgICBnZXRQcm9jZXNzZXNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qoc2VsZWN0ZWRFbGVzKTtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkRWxlcztcbiAgICB9LFxuICAgIGdldE5laWdoYm91cnNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZk5vZGVzKHNlbGVjdGVkRWxlcyk7XG4gICAgICAgIHJldHVybiBlbGVzVG9IaWdobGlnaHQ7XG4gICAgfSxcbiAgICBnZXROZWlnaGJvdXJzT2ZOb2RlczogZnVuY3Rpb24oX25vZGVzKXtcbiAgICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICAgIG5vZGVzID0gbm9kZXMuYWRkKG5vZGVzLnBhcmVudHMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikpO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgdmFyIG5laWdoYm9yaG9vZEVsZXMgPSBub2Rlcy5uZWlnaGJvcmhvb2QoKTtcbiAgICAgICAgdmFyIGVsZXNUb1JldHVybiA9IG5vZGVzLmFkZChuZWlnaGJvcmhvb2RFbGVzKTtcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIHJldHVybiBlbGVzVG9SZXR1cm47XG4gICAgfSxcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cucGFyZW50cygpKTtcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3MhPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG5cbiAgICAgICAgdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA9PT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xuXG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5wYXJlbnRzKCkpO1xuICAgICAgICAvL2FkZCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XG4gICAgfSxcbiAgICBleHRlbmRSZW1haW5pbmdOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzVG9GaWx0ZXIsIGFsbE5vZGVzKXtcbiAgICAgICAgbm9kZXNUb0ZpbHRlciA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0ZpbHRlcik7XG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9TaG93KTtcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xuICAgIH0sXG4gICAgZ2V0UHJvY2Vzc2VzT2ZOb2RlczogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFZGdlcyA9IGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWRnZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcblxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZGVsZXRlTm9kZXNTbWFydDogZnVuY3Rpb24gKF9ub2Rlcykge1xuICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICBcbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gICAgICB2YXIgbm9kZXNOb3RUb0tlZXAgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0tlZXApO1xuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgICAgZWxlcy5yZXN0b3JlKCk7XG4gICAgICAgIHJldHVybiBlbGVzO1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xuICAgIFxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZ2V0Q3lTaGFwZTogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BoZW5vdHlwZScpIHtcbiAgICAgICAgICAgIHJldHVybiAnaGV4YWdvbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZScgfHwgX2NsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBfY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnIHx8IF9jbGFzcyA9PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NsYXNzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XG4gICAgfSxcbiAgICBnZXRDeUFycm93U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdpbmhpYml0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzdGltdWxhdGlvbicgfHwgX2NsYXNzID09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICB9LFxuICAgIGdldEVsZW1lbnRDb250ZW50OiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGhlbm90eXBlJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ2xhYmVsJykpe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZWxlLmRhdGEoJ2luZm9MYWJlbCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnYW5kJykge1xuICAgICAgICAgICAgY29udGVudCA9ICdBTkQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb3InKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ09SJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ25vdCcpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTk9UJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnXFxcXFxcXFwnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJz8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS53aWR0aCgpIHx8IGVsZS5kYXRhKCdiYm94JykudztcblxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcbiAgICAgICAgICAgIHdpZHRoOiAoIF9jbGFzcz09KCdjb21wbGV4JykgfHwgX2NsYXNzPT0oJ2NvbXBhcnRtZW50JykgKT90ZXh0V2lkdGggKiAyOnRleHRXaWR0aFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb250ID0gdGhpcy5nZXRMYWJlbFRleHRTaXplKGVsZSkgKyBcInB4IEFyaWFsXCI7XG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcbiAgICB9LFxuICAgIGdldExhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJykge1xuICAgICAgICByZXR1cm4gMjA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUsIDEuNSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdjb21wbGV4JyB8fCBfY2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgcmV0dXJuIDE2O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xuXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcbiAgICB9LFxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXG4gICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxuICAgICAgKi9cbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcbiAgICAgICAqL1xuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaW5mb0xhYmVsID0gXCJcIjtcbiAgICAgIC8qXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XG4gICAgICAgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgIHZhciBjaGlsZEluZm8gPSB0aGlzLmdldEluZm9MYWJlbChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XG4gICAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xuICAgICAgICB9XG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XG4gICAgICB9XG5cbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcbiAgICAgIHJldHVybiBpbmZvTGFiZWw7XG4gICAgfSxcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogQ2hlY2sgdGhlIGxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxuICAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxuICAgICAgKi9cbiAgICAgIHZhciBsYWJlbCA9IG5vZGUuZGF0YSgnbGFiZWwnKTtcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcbiAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcbiAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcblxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XG5cbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudFV0aWxpdGllcztcbiIsIi8qXG4gKiBGaWxlIFV0aWxpdGllczogVG8gYmUgdXNlZCBvbiByZWFkL3dyaXRlIGZpbGUgb3BlcmF0aW9uXG4gKi9cblxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcbnZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdWktdXRpbGl0aWVzJyk7XG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xudmFyIHVwZGF0ZUdyYXBoID0gZ3JhcGhVdGlsaXRpZXMudXBkYXRlR3JhcGguYmluZChncmFwaFV0aWxpdGllcyk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBzYXZlQXMgPSBsaWJzLnNhdmVBcztcblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBTdGFydFxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYyNDU3NjcvY3JlYXRpbmctYS1ibG9iLWZyb20tYS1iYXNlNjQtc3RyaW5nLWluLWphdmFzY3JpcHRcbmZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKSB7XG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XG4gIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XG5cbiAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcbiAgdmFyIGJ5dGVBcnJheXMgPSBbXTtcblxuICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcbiAgICB2YXIgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XG5cbiAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuXG4gICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcblxuICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xuICB9XG5cbiAgdmFyIGJsb2IgPSBuZXcgQmxvYihieXRlQXJyYXlzLCB7dHlwZTogY29udGVudFR5cGV9KTtcbiAgcmV0dXJuIGJsb2I7XG59XG5cbmZ1bmN0aW9uIGxvYWRYTUxEb2MoZnVsbEZpbGVQYXRoKSB7XG4gIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHhodHRwID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcbiAgfVxuICB4aHR0cC5vcGVuKFwiR0VUXCIsIGZ1bGxGaWxlUGF0aCwgZmFsc2UpO1xuICB4aHR0cC5zZW5kKCk7XG4gIHJldHVybiB4aHR0cC5yZXNwb25zZVhNTDtcbn1cblxuLy8gU2hvdWxkIHRoaXMgYmUgZXhwb3NlZCBvciBzaG91bGQgdGhpcyBiZSBtb3ZlZCB0byB0aGUgaGVscGVyIGZ1bmN0aW9ucyBzZWN0aW9uP1xuZnVuY3Rpb24gdGV4dFRvWG1sT2JqZWN0KHRleHQpIHtcbiAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XG4gICAgdmFyIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XG4gICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcbiAgICBkb2MubG9hZFhNTCh0ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L3htbCcpO1xuICB9XG4gIHJldHVybiBkb2M7XG59XG4vLyBIZWxwZXIgZnVuY3Rpb25zIEVuZFxuXG5mdW5jdGlvbiBmaWxlVXRpbGl0aWVzKCkge31cbmZpbGVVdGlsaXRpZXMubG9hZFhNTERvYyA9IGxvYWRYTUxEb2M7XG5cbmZpbGVVdGlsaXRpZXMuc2F2ZUFzUG5nID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XG5cbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcbiAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9wbmdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5wbmdcIik7XG59O1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc0pwZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBqcGdDb250ZW50ID0gY3kuanBnKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xuXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXG4gIHZhciBiNjRkYXRhID0ganBnQ29udGVudC5zdWJzdHIoanBnQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsuanBnXCIpO1xufTtcblxuZmlsZVV0aWxpdGllcy5sb2FkU2FtcGxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGZvbGRlcnBhdGgpIHtcbiAgdWlVdGlsaXRpZXMuc3RhcnRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xuICBcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYSBzYW1wbGUgaXMgYmVpbmcgbG9hZGVkXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlXCIsIFsgZmlsZW5hbWUgXSApOyAvLyBBbGlhc2VzIGZvciBzYmdudml6TG9hZFNhbXBsZVN0YXJ0XG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVN0YXJ0XCIsIFsgZmlsZW5hbWUgXSApO1xuICBcbiAgLy8gbG9hZCB4bWwgZG9jdW1lbnQgdXNlIGRlZmF1bHQgZm9sZGVyIHBhdGggaWYgaXQgaXMgbm90IHNwZWNpZmllZFxuICB2YXIgeG1sT2JqZWN0ID0gbG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xuICBcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XG4gICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcbiAgICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVFbmRcIiwgWyBmaWxlbmFtZSBdICk7IC8vIFRyaWdnZXIgYW4gZXZlbnQgc2lnbmFsaW5nIHRoYXQgYSBzYW1wbGUgaXMgbG9hZGVkXG4gIH0sIDApO1xufTtcblxuLypcbiAgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiByZW1vdGVseSBkZWZpbmVkIHRvIGFkZCBzcGVjaWZpYyBiZWhhdmlvciB0aGF0IGlzbid0IGltcGxlbWVudGVkIGhlcmUuXG4gIGl0IGlzIGNvbXBsZXRlbHkgb3B0aW9uYWwuXG4gIHNpZ25hdHVyZTogY2FsbGJhY2sodGV4dFhtbClcbiovXG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxGaWxlID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGFuIGV4dGVybmFsIGZpbGUgaXMgYmVpbmcgbG9hZGVkXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZVwiLCBbIGZpbGUubmFtZSBdICk7IC8vIEFsaWFzZXMgZm9yIHNiZ252aXpMb2FkRmlsZVN0YXJ0XG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVTdGFydFwiLCBbIGZpbGUubmFtZSBdICk7IFxuICBcbiAgdmFyIHRleHRUeXBlID0gL3RleHQuKi87XG5cbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSB0aGlzLnJlc3VsdDtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSBjYWxsYmFjayh0ZXh0KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0KSkpO1xuICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICAgICAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZUVuZFwiLCBbIGZpbGUubmFtZSBdICk7IC8vIFRyaWdnZXIgYW4gZXZlbnQgc2lnbmFsaW5nIHRoYXQgYSBmaWxlIGlzIGxvYWRlZFxuICAgIH0sIDApO1xuICB9O1xuXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xufTtcbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTFRleHQgPSBmdW5jdGlvbih0ZXh0RGF0YSl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0RGF0YSkpKTtcbiAgICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICAgIH0sIDApO1xuXG59O1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc1NiZ25tbCA9IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKSB7XG4gIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbChmaWxlbmFtZSwgcmVuZGVySW5mbyk7XG4gIHJldHVybiAwO1xuICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xuICAgIHR5cGU6IFwidGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04O1wiLFxuICB9KTtcbiAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsZVV0aWxpdGllcztcbiIsIi8qXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBzYmdudml6IGdyYXBoc1xuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxuZnVuY3Rpb24gZ3JhcGhVdGlsaXRpZXMoKSB7fVxuXG5ncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaCA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcbiAgY29uc29sZS5sb2coJ2N5IHVwZGF0ZSBjYWxsZWQnKTtcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInVwZGF0ZUdyYXBoU3RhcnRcIiApO1xuICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLnJlc2V0KCk7XG4vLyAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XG4gIH1cblxuICBjeS5zdGFydEJhdGNoKCk7XG4gIC8vIGNsZWFyIGRhdGFcbiAgY3kucmVtb3ZlKCcqJyk7XG4gIGN5LmFkZChjeUdyYXBoKTtcblxuICAvL2FkZCBwb3NpdGlvbiBpbmZvcm1hdGlvbiB0byBkYXRhIGZvciBwcmVzZXQgbGF5b3V0XG4gIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGN5R3JhcGgubm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgeFBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5iYm94Lng7XG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC55O1xuICAgIHBvc2l0aW9uTWFwW2N5R3JhcGgubm9kZXNbaV0uZGF0YS5pZF0gPSB7J3gnOiB4UG9zLCAneSc6IHlQb3N9O1xuICB9XG5cbiAgY3kubGF5b3V0KHtcbiAgICBuYW1lOiAncHJlc2V0JyxcbiAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwLFxuICAgIGZpdDogdHJ1ZSxcbiAgICBwYWRkaW5nOiA1MFxuICB9KTtcblxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjeS5lbmRCYXRjaCgpO1xuXG4gIC8vIFVwZGF0ZSB0aGUgc3R5bGVcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgLy8gSW5pdGlsaXplIHRoZSBiZW5kIHBvaW50cyBvbmNlIHRoZSBlbGVtZW50cyBhcmUgY3JlYXRlZFxuICBpZiAoY3kuZWRnZUJlbmRFZGl0aW5nICYmIGN5LmVkZ2VCZW5kRWRpdGluZygnaW5pdGlhbGl6ZWQnKSkge1xuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XG4gIH1cbiAgXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaEVuZFwiICk7XG59O1xuXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XG4gIC8vQXMgZGVmYXVsdCB1c2UgdGhlIGNvbXBvdW5kIHBhZGRpbmcgdmFsdWVcbiAgaWYgKCFwYWRkaW5nUGVyY2VudCkge1xuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcbiAgICBwYWRkaW5nUGVyY2VudCA9IHR5cGVvZiBjb21wb3VuZFBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBjb21wb3VuZFBhZGRpbmcuY2FsbCgpIDogY29tcG91bmRQYWRkaW5nO1xuICB9XG5cbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIHRvdGFsID0gMDtcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGhlTm9kZSA9IG5vZGVzW2ldO1xuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLndpZHRoKCkpO1xuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUuaGVpZ2h0KCkpO1xuICAgICAgbnVtT2ZTaW1wbGVzKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNhbGNfcGFkZGluZyA9IChwYWRkaW5nUGVyY2VudCAvIDEwMCkgKiBNYXRoLmZsb29yKHRvdGFsIC8gKDIgKiBudW1PZlNpbXBsZXMpKTtcbiAgaWYgKGNhbGNfcGFkZGluZyA8IDUpIHtcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xuICB9XG5cbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcbn07XG5cbmdyYXBoVXRpbGl0aWVzLnJlY2FsY3VsYXRlUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLy8gdGhpcy5jYWxjdWxhdGVkUGFkZGluZ3MgaXMgbm90IHdvcmtpbmcgaGVyZSBcbiAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHJlZmVyZW5jZSB3aXRoIHRoaXMuY2FsY3VsYXRlZFBhZGRpbmdzIG9uY2UgdGhlIHJlYXNvbiBpcyBmaWd1cmVkIG91dFxuICBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBoVXRpbGl0aWVzOyIsInZhciB0eHRVdGlsID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpO1xudmFyIHJlbmRlckV4dGVuc2lvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXJlbmRlcicpO1xuXG52YXIganNvblRvU2Jnbm1sID0ge1xuICAgIGNyZWF0ZVNiZ25tbCA6IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBtYXBJRCA9IHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChmaWxlbmFtZSk7XG4gICAgICAgIHZhciBoYXNFeHRlbnNpb24gPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhc1JlbmRlckV4dGVuc2lvbiA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHJlbmRlckluZm8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoYXNFeHRlbnNpb24gPSB0cnVlO1xuICAgICAgICAgICAgaGFzUmVuZGVyRXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSd5ZXMnPz5cXG5cIjtcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzYmduIHhtbG5zPSdodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjMnPlxcblwiO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG1hcCBsYW5ndWFnZT0ncHJvY2VzcyBkZXNjcmlwdGlvbicgaWQ9J1wiK21hcElEK1wiJz5cXG5cIjtcbiAgICAgICAgaWYgKGhhc0V4dGVuc2lvbikgeyAvLyBleHRlbnNpb24gaXMgdGhlcmVcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8ZXh0ZW5zaW9uPlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNSZW5kZXJFeHRlbnNpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlbmRlckluZm8pO1xuICAgICAgICAgICAgLy92YXIgY29sb3JEZWZMaXN0ID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0KTtcbiAgICAgICAgICAgIHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyByZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24oJ3JlbmRlckluZm9ybWF0aW9uJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCByZW5kZXJJbmZvLmNvbG9yRGVmLmJhY2tncm91bmRDb2xvcik7XG4gICAgICAgICAgICB2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gcmVuZGVySW5mby5jb2xvckRlZi5jb2xvckxpc3RbaV07XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyByZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uKHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChjb2xvciksIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFkZENvbG9yRGVmaW5pdGlvbihjb2xvckRlZmluaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVySW5mb3JtYXRpb24uc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9uKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpO1xuXG4gICAgICAgICAgICB2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZW5kZXJJbmZvLnN0eWxlRGVmKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gcmVuZGVySW5mby5zdHlsZURlZltrZXldO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0eWxlLCBrZXksIHJlbmRlckluZm8pO1xuICAgICAgICAgICAgICAgIHZhciB4bWxTdHlsZSA9IG5ldyByZW5kZXJFeHRlbnNpb24uU3R5bGUodHh0VXRpbC5nZXRYTUxWYWxpZElkKGtleSksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIHN0eWxlLmlkTGlzdC5tYXAodHh0VXRpbC5nZXRYTUxWYWxpZElkKSk7XG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHN0eWxlLnByb3BlcnRpZXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IHN0eWxlLnByb3BlcnRpZXMuZm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBmb250U3R5bGU6IHN0eWxlLnByb3BlcnRpZXMuZm9udFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5wcm9wZXJ0aWVzLmZpbGwsIC8vIGZpbGwgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZVdpZHRoXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XG4gICAgICAgICAgICAgICAgbGlzdE9mU3R5bGVzLmFkZFN0eWxlKHhtbFN0eWxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVuZGVySW5mb3JtYXRpb24uc2V0TGlzdE9mU3R5bGVzKGxpc3RPZlN0eWxlcyk7XG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gIHNiZ25tbFRleHQgKyByZW5kZXJJbmZvcm1hdGlvbi50b1hNTCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNFeHRlbnNpb24pIHtcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2V4dGVuc2lvbj5cXG5cIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhzYmdubWxUZXh0KTtcblxuICAgICAgICAvL2FkZGluZyBnbHlwaCBzYmdubWxcbiAgICAgICAgY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0NoaWxkKCkpXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2FkZGluZyBhcmMgc2Jnbm1sXG4gICAgICAgIGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEFyY1NiZ25tbCh0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvbWFwPlxcblwiO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9zYmduPlxcblwiO1xuXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xuICAgIH0sXG5cbiAgICBnZXRHbHlwaFNiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcblxuICAgICAgICBpZihub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgdHh0VXRpbC5nZXRYTUxWYWxpZElkKG5vZGUuX3ByaXZhdGUuZGF0YS5pZCkgKyBcIicgY2xhc3M9J2NvbXBhcnRtZW50JyBcIjtcblxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChub2RlLl9wcml2YXRlLmRhdGEucGFyZW50KSArIFwiJ1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XG5cbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJzdWJtYXBcIil7XG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgdHh0VXRpbC5nZXRYTUxWYWxpZElkKG5vZGUuX3ByaXZhdGUuZGF0YS5pZCkgKyBcIicgY2xhc3M9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzICsgXCInIFwiO1xuXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyB0eHRVdGlsLmdldFhNTFZhbGlkSWQocGFyZW50Ll9wcml2YXRlLmRhdGEuaWQpICsgXCInXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcblxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXsvL2l0IGlzIGEgc2ltcGxlIG5vZGVcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcbiAgICAgICAgICAgICAgICBcIjxnbHlwaCBpZD0nXCIgKyB0eHRVdGlsLmdldFhNTFZhbGlkSWQobm9kZS5fcHJpdmF0ZS5kYXRhLmlkKSArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgKyBcIidcIjtcblxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgICAgICBpZihwYXJlbnQuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgY29tcGFydG1lbnRSZWY9J1wiICsgdHh0VXRpbC5nZXRYTUxWYWxpZElkKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkKSArIFwiJ1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcblxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIHNiZ25tbFRleHQ7XG4gICAgfSxcblxuICAgIGFkZENvbW1vbkdseXBoUHJvcGVydGllcyA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG5cbiAgICAgICAgLy8gb3JkZXIgbWF0dGVycyBoZXJlIGZvciB0aGUgdmFsaWRhdGlvbiBvZiBhbiB4c2Q6c2VxdWVuY2VcbiAgICAgICAgLy9hZGQgbGFiZWwgaW5mb3JtYXRpb25cbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZExhYmVsKG5vZGUpO1xuICAgICAgICAvL2FkZCBjbG9uZSBpbmZvcm1hdGlvblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkQ2xvbmUobm9kZSk7XG4gICAgICAgIC8vYWRkIGJib3ggaW5mb3JtYXRpb25cbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZEdseXBoQmJveChub2RlKTtcbiAgICAgICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkUG9ydChub2RlKTtcbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5nZXRTdGF0ZUFuZEluZm9TYmdubWwobm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XG4gICAgfSxcblxuICAgIGFkZENsb25lIDogZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Y2xvbmUvPlxcblwiO1xuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcbiAgICB9LFxuXG4gICAgZ2V0U3RhdGVBbmRJbmZvU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcblxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcy5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgdmFyIGJveEdseXBoID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zW2ldO1xuICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zSWQgPSB0eHRVdGlsLmdldFhNTFZhbGlkSWQobm9kZS5fcHJpdmF0ZS5kYXRhLmlkKStcIl9cIitpO1xuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFN0YXRlQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpe1xuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xuICAgIH0sXG5cbiAgICBnZXRBcmNTYmdubWwgOiBmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuXG4gICAgICAgIC8vVGVtcG9yYXJ5IGhhY2sgdG8gcmVzb2x2ZSBcInVuZGVmaW5lZFwiIGFyYyBzb3VyY2UgYW5kIHRhcmdldHNcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xuICAgICAgICB2YXIgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2U7XG5cbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xuXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcblxuICAgICAgICB2YXIgYXJjSWQgPSBhcmNTb3VyY2UgKyBcIi1cIiArIGFyY1RhcmdldDtcblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGFyYyBpZD0nXCIgKyB0eHRVdGlsLmdldFhNTFZhbGlkSWQoYXJjSWQpICtcbiAgICAgICAgICAgIFwiJyB0YXJnZXQ9J1wiICsgdHh0VXRpbC5nZXRYTUxWYWxpZElkKGFyY1RhcmdldCkgK1xuICAgICAgICAgICAgXCInIHNvdXJjZT0nXCIgKyB0eHRVdGlsLmdldFhNTFZhbGlkSWQoYXJjU291cmNlKSArIFwiJyBjbGFzcz0nXCIgK1xuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzICsgXCInPlxcblwiO1xuXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c3RhcnQgeT0nXCIgKyBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WSArIFwiJyB4PSdcIiArXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCArIFwiJy8+XFxuXCI7XG5cbiAgICAgICAgLy8gRXhwb3J0IGJlbmQgcG9pbnRzIGlmIGVkZ2VCZW5kRWRpdGluZ0V4dGVuc2lvbiBpcyByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgdmFyIHNlZ3B0cyA9IGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuZ2V0U2VnbWVudFBvaW50cyhlZGdlKTtcbiAgICAgICAgICBpZihzZWdwdHMpe1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xuICAgICAgICAgICAgICB2YXIgYmVuZFggPSBzZWdwdHNbaV07XG4gICAgICAgICAgICAgIHZhciBiZW5kWSA9IHNlZ3B0c1tpICsgMV07XG5cbiAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxuZXh0IHk9J1wiICsgYmVuZFkgKyBcIicgeD0nXCIgKyBiZW5kWCArIFwiJy8+XFxuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxlbmQgeT0nXCIgKyBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFkgKyBcIicgeD0nXCIgK1xuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRYICsgXCInLz5cXG5cIjtcblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9hcmM+XFxuXCI7XG5cbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XG4gICAgfSxcblxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XG4gICAgICAgIHJldHVybiBcIjxiYm94IHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggK1xuICAgICAgICAgICAgXCInIHc9J1wiICsgd2lkdGggKyBcIicgaD0nXCIgKyBoZWlnaHQgKyBcIicgLz5cXG5cIjtcbiAgICB9LFxuXG4gICAgYWRkU3RhdGVBbmRJbmZvQmJveCA6IGZ1bmN0aW9uKG5vZGUsIGJveEdseXBoKXtcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XG5cbiAgICAgICAgdmFyIHggPSBib3hCYm94LnggLyAxMDAgKiBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcblxuICAgICAgICB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgKHggLSBib3hCYm94LncvMik7XG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcbiAgICAgICAgcmV0dXJuIFwiPGJib3ggeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArXG4gICAgICAgICAgICBcIicgdz0nXCIgKyBib3hCYm94LncgKyBcIicgaD0nXCIgKyBib3hCYm94LmggKyBcIicgLz5cXG5cIjtcbiAgICB9LFxuXG4gICAgYWRkUG9ydCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG5cbiAgICAgICAgdmFyIHBvcnRzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzO1xuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHBvcnRzLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArIHBvcnRzW2ldLnggKiBub2RlLndpZHRoKCkgLyAxMDA7XG4gICAgICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArIHBvcnRzW2ldLnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xuXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHBvcnQgaWQ9J1wiICsgdHh0VXRpbC5nZXRYTUxWYWxpZElkKHBvcnRzW2ldLmlkKStcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xuICAgIH0sXG5cbiAgICBhZGRMYWJlbCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG5cbiAgICAgICAgaWYodHlwZW9mIGxhYmVsICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIHRleHQ9J1wiICsgbGFiZWwgKyBcIicgLz5cXG5cIjtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSxcblxuICAgIGFkZFN0YXRlQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Z2x5cGggaWQ9J1wiICsgaWQgKyBcIicgY2xhc3M9J3N0YXRlIHZhcmlhYmxlJz5cXG5cIjtcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzdGF0ZSBcIjtcblxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YWx1ZSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YWx1ZT0nXCIgKyBub2RlLnN0YXRlLnZhbHVlICsgXCInIFwiO1xuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YXJpYWJsZSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YXJpYWJsZT0nXCIgKyBub2RlLnN0YXRlLnZhcmlhYmxlICsgXCInIFwiO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiLz5cXG5cIjtcblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcblxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcbiAgICB9LFxuXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGdseXBoIGlkPSdcIiArIGlkICsgXCInIGNsYXNzPSd1bml0IG9mIGluZm9ybWF0aW9uJz5cXG5cIjtcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxsYWJlbCBcIjtcblxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInRleHQ9J1wiICsgbm9kZS5sYWJlbC50ZXh0ICsgXCInIFwiO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiLz5cXG5cIjtcblxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcblxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25Ub1NiZ25tbDtcbiIsIi8qXG4gKiBMaXN0ZW4gZG9jdW1lbnQgZm9yIGtleWJvYXJkIGlucHV0cyBhbmQgZXhwb3J0cyB0aGUgdXRpbGl0aWVzIHRoYXQgaXQgbWFrZXMgdXNlIG9mXG4gKi9cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIga2V5Ym9hcmRJbnB1dFV0aWxpdGllcyA9IHtcbiAgaXNOdW1iZXJLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gKCBlLmtleUNvZGUgPj0gNDggJiYgZS5rZXlDb2RlIDw9IDU3ICkgfHwgKCBlLmtleUNvZGUgPj0gOTYgJiYgZS5rZXlDb2RlIDw9IDEwNSApO1xuICB9LFxuICBpc0RvdEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDE5MDtcbiAgfSxcbiAgaXNNaW51c1NpZ25LZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxMDkgfHwgZS5rZXlDb2RlID09PSAxODk7XG4gIH0sXG4gIGlzTGVmdEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM3O1xuICB9LFxuICBpc1JpZ2h0S2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzk7XG4gIH0sXG4gIGlzQmFja3NwYWNlS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gODtcbiAgfSxcbiAgaXNUYWJLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSA5O1xuICB9LFxuICBpc0VudGVyS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTM7XG4gIH0sXG4gIGlzSW50ZWdlckZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDdHJsT3JDb21tYW5kUHJlc3NlZChlKSB8fCB0aGlzLmlzTWludXNTaWduS2V5KGUpIHx8IHRoaXMuaXNOdW1iZXJLZXkoZSkgXG4gICAgICAgICAgICB8fCB0aGlzLmlzQmFja3NwYWNlS2V5KGUpIHx8IHRoaXMuaXNUYWJLZXkoZSkgfHwgdGhpcy5pc0xlZnRLZXkoZSkgfHwgdGhpcy5pc1JpZ2h0S2V5KGUpIHx8IHRoaXMuaXNFbnRlcktleShlKTtcbiAgfSxcbiAgaXNGbG9hdEZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSkgfHwgdGhpcy5pc0RvdEtleShlKTtcbiAgfSxcbiAgaXNDdHJsT3JDb21tYW5kUHJlc3NlZDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xuICB9XG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5pbnRlZ2VyLWlucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xuICAgIHJldHVybiBrZXlib2FyZElucHV0VXRpbGl0aWVzLmlzSW50ZWdlckZpZWxkSW5wdXQodmFsdWUsIGUpO1xuICB9KTtcbiAgXG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5mbG9hdC1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0Zsb2F0RmllbGRJbnB1dCh2YWx1ZSwgZSk7XG4gIH0pO1xuICBcbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuaW50ZWdlci1pbnB1dCwuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgbWluICAgPSAkKHRoaXMpLmF0dHIoJ21pbicpO1xuICAgIHZhciBtYXggICA9ICQodGhpcykuYXR0cignbWF4Jyk7XG4gICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKTtcbiAgICBcbiAgICBpZihtaW4gIT0gbnVsbCkge1xuICAgICAgbWluID0gcGFyc2VGbG9hdChtaW4pO1xuICAgIH1cbiAgICBcbiAgICBpZihtYXggIT0gbnVsbCkge1xuICAgICAgbWF4ID0gcGFyc2VGbG9hdChtYXgpO1xuICAgIH1cbiAgICBcbiAgICBpZihtaW4gIT0gbnVsbCAmJiB2YWx1ZSA8IG1pbikge1xuICAgICAgdmFsdWUgPSBtaW47XG4gICAgfVxuICAgIGVsc2UgaWYobWF4ICE9IG51bGwgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgIHZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBcbiAgICBpZihpc05hTih2YWx1ZSkpIHtcbiAgICAgIGlmKG1pbiAhPSBudWxsKSB7XG4gICAgICAgIHZhbHVlID0gbWluO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihtYXggIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IG1heDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgICQodGhpcykudmFsKFwiXCIgKyB2YWx1ZSk7XG4gIH0pO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcztcbiIsIi8qIFxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cbiAqL1xuXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcbn07XG5cbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xuICB0aGlzLmxpYnMgPSBsaWJzO1xufTtcblxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGlicztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzO1xuXG4iLCIvKiBcbiAqIFRoZXNlIGFyZSB0aGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZGlyZWN0bHkgdXRpbGl6ZWQgYnkgdGhlIHVzZXIgaW50ZXJhY3Rpb25zLlxuICogSWRlYWx5LCB0aGlzIGZpbGUgaXMganVzdCByZXF1aXJlZCBieSBpbmRleC5qc1xuICovXG5cbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcblxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG4vLyBIZWxwZXJzIHN0YXJ0XG5mdW5jdGlvbiBiZWZvcmVQZXJmb3JtTGF5b3V0KCkge1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xuXG4gIG5vZGVzLnJlbW92ZURhdGEoXCJwb3J0c1wiKTtcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnRzb3VyY2VcIik7XG4gIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuXG4gIG5vZGVzLmRhdGEoXCJwb3J0c1wiLCBbXSk7XG4gIGVkZ2VzLmRhdGEoXCJwb3J0c291cmNlXCIsIFtdKTtcbiAgZWRnZXMuZGF0YShcInBvcnR0YXJnZXRcIiwgW10pO1xuXG4gIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXG4gIGN5LiQoJy5lZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xufTtcbi8vIEhlbHBlcnMgZW5kXG5cbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7fVxuXG4vLyBFeHBhbmQgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZXhwYW5kTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2Rlc1RvRXhwYW5kID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKG5vZGVzKTtcbiAgaWYgKG5vZGVzVG9FeHBhbmQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzVG9FeHBhbmQsXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kKG5vZGVzKTtcbiAgfVxufTtcblxuLy8gQ29sbGFwc2UgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlXCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlKG5vZGVzKTtcbiAgfVxufTtcblxuLy8gQ29sbGFwc2UgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5jb2xsYXBzZUNvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBjb21wbGV4ZXMgPSBjeS5ub2RlcyhcIltjbGFzcz0nY29tcGxleCddXCIpO1xuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhjb21wbGV4ZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBjb21wbGV4ZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KGNvbXBsZXhlcyk7XG4gIH1cbn07XG5cbi8vIEV4cGFuZCBhbGwgY29tcGxleGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygpLmZpbHRlcihcIltjbGFzcz0nY29tcGxleCddXCIpKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGFsbCBub2RlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5jb2xsYXBzZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2VSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEV4cGFuZCBhbGwgbm9kZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZXhwYW5kQWxsID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKGN5Lm5vZGVzKCc6dmlzaWJsZScpKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIGhpZGVzIHRoZSByZXN1bHRpbmcgbGlzdC4gXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgXG4gIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcbiAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcblxuICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QuIFxuLy8gVGhlbiB1bmhpZGVzIHRoZSByZXN1bHRpbmcgbGlzdCBhbmQgaGlkZXMgb3RoZXJzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5zaG93Tm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgXG4gIHZhciBhbGxOb2RlcyA9IGN5LmVsZW1lbnRzKCk7XG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXMpO1xuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xuICBcbiAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xuICB9XG59O1xuXG4vLyBVbmhpZGVzIGFsbCBlbGVtZW50cy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKGN5LmVsZW1lbnRzKCkubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cygpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLnNob3coY3kuZWxlbWVudHMoKSk7XG4gIH1cbn07XG5cbi8vIFJlbW92ZXMgdGhlIGdpdmVuIGVsZW1lbnRzIGluIGEgc2ltcGxlIHdheS4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlID0gZnVuY3Rpb24oZWxlcykge1xuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB7XG4gICAgICBlbGVzOiBlbGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5yZW1vdmUoKTtcbiAgfVxufTtcblxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgcmVtb3ZlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxuLy8gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0ID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpO1xuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB7XG4gICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICBlbGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydChub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEhpZ2hsaWdodHMgbmVpZ2hib3VycyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodE5laWdoYm91cnMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZOb2Rlcyhub2Rlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbn07XG5cbi8vIEZpbmRzIHRoZSBlbGVtZW50cyB3aG9zZSBsYWJlbCBpbmNsdWRlcyB0aGUgZ2l2ZW4gbGFiZWwgYW5kIGhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRob3NlIGVsZW1lbnRzLlxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2VhcmNoQnlMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG4gIGlmIChsYWJlbC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgdmFyIG5vZGVzVG9IaWdobGlnaHQgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgaWYgKGVsZS5kYXRhKFwibGFiZWxcIikgJiYgZWxlLmRhdGEoXCJsYWJlbFwiKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobGFiZWwpID49IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIGlmIChub2Rlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuXG4gIG5vZGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9IaWdobGlnaHQpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIG5vZGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KG5vZGVzVG9IaWdobGlnaHQpO1xuICB9XG59O1xuXG4vLyBIaWdobGlnaHRzIHByb2Nlc3NlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQoZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxufTtcblxuLy8gVW5oaWdobGlnaHRzIGFueSBoaWdobGlnaHRlZCBlbGVtZW50LiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5yZW1vdmVIaWdobGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cygpO1xuICB9XG59O1xuXG4vLyBQZXJmb3JtcyBsYXlvdXQgYnkgZ2l2ZW4gbGF5b3V0T3B0aW9ucy4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLiBIb3dldmVyLCBieSBzZXR0aW5nIG5vdFVuZG9hYmxlIHBhcmFtZXRlclxuLy8gdG8gYSB0cnV0aHkgdmFsdWUgeW91IGNhbiBmb3JjZSBhbiB1bmRhYmxlIGxheW91dCBvcGVyYXRpb24gaW5kZXBlbmRhbnQgb2YgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRPcHRpb25zLCBub3RVbmRvYWJsZSkge1xuICAvLyBUaGluZ3MgdG8gZG8gYmVmb3JlIHBlcmZvcm1pbmcgbGF5b3V0XG4gIGJlZm9yZVBlcmZvcm1MYXlvdXQoKTtcbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSB8fCBub3RVbmRvYWJsZSkgeyAvLyAnbm90VW5kb2FibGUnIGZsYWcgY2FuIGJlIHVzZWQgdG8gaGF2ZSBjb21wb3NpdGUgYWN0aW9ucyBpbiB1bmRvL3JlZG8gc3RhY2tcbiAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XG4gICAgICBvcHRpb25zOiBsYXlvdXRPcHRpb25zLFxuICAgICAgZWxlczogY3kuZWxlbWVudHMoKS5maWx0ZXIoJzp2aXNpYmxlJylcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQ3JlYXRlcyBhbiBzYmdubWwgZmlsZSBjb250ZW50IGZyb20gdGhlIGV4aXNpbmcgZ3JhcGggYW5kIHJldHVybnMgaXQuXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVNiZ25tbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xufTtcblxuLy8gQ29udmVydHMgZ2l2ZW4gc2Jnbm1sIGRhdGEgdG8gYSBqc29uIG9iamVjdCBpbiBhIHNwZWNpYWwgZm9ybWF0IFxuLy8gKGh0dHA6Ly9qcy5jeXRvc2NhcGUub3JnLyNub3RhdGlvbi9lbGVtZW50cy1qc29uKSBhbmQgcmV0dXJucyBpdC5cbm1haW5VdGlsaXRpZXMuY29udmVydFNiZ25tbFRvSnNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xufTtcblxuLy8gQ3JlYXRlIHRoZSBxdGlwIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBub2RlIGFuZCByZXR1cm5zIGl0LlxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0UXRpcENvbnRlbnQobm9kZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcbiAqL1xuXG4vLyBkZWZhdWx0IG9wdGlvbnNcbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBUaGUgc2VsZWN0b3Igb2YgdGhlIGNvbXBvbmVudCBjb250YWluaW5nIHRoZSBzYmduIG5ldHdvcmtcbiAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cbiAgdW5kb2FibGU6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdHh0VXRpbCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKTtcbnZhciBwa2dWZXJzaW9uID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjsgLy8gbmVlZCBpbmZvIGFib3V0IHNiZ252aXogdG8gcHV0IGluIHhtbFxudmFyIHBrZ05hbWUgPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS5uYW1lO1xuXG52YXIgc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uID0ge307XG5zYmdubWxSZW5kZXJFeHRlbnNpb24ueG1sbnMgPSBcImh0dHA6Ly93d3cuc2JtbC5vcmcvc2JtbC9sZXZlbDMvdmVyc2lvbjEvcmVuZGVyL3ZlcnNpb24xXCI7XG5cbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5Db2xvckRlZmluaXRpb24gPSBmdW5jdGlvbihpZCwgdmFsdWUpIHtcblx0Ly8gYm90aCBhcmUgb3B0aW9uYWxcblx0dGhpcy5pZCA9IGlkO1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkNvbG9yRGVmaW5pdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxjb2xvckRlZmluaXRpb25cIjtcblx0aWYgKHR5cGVvZiB0aGlzLmlkICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMudmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhbHVlPSdcIit0aGlzLnZhbHVlK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY29sb3JMaXN0ID0gW107XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLmFkZENvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uIChjb2xvckRlZmluaXRpb24pIHtcblx0dGhpcy5jb2xvckxpc3QucHVzaChjb2xvckRlZmluaXRpb24pO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM+XFxuXCI7XG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuY29sb3JMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbG9yID0gdGhpcy5jb2xvckxpc3RbaV07XG5cdFx0eG1sU3RyaW5nICs9IGNvbG9yLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9saXN0T2ZDb2xvckRlZmluaXRpb25zPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocGFyYW0pIHtcblx0Ly8gZWFjaCBvZiB0aG9zZSBhcmUgb3B0aW9uYWwsIHNvIHRlc3QgaWYgaXQgaXMgZGVmaW5lZCBpcyBtYW5kYXRvcnlcblx0Ly8gc3BlY2lmaWMgdG8gcmVuZGVyR3JvdXBcblx0dGhpcy5mb250U2l6ZSA9IHBhcmFtLmZvbnRTaXplO1xuXHR0aGlzLmZvbnRGYW1pbHkgPSBwYXJhbS5mb250RmFtaWx5O1xuXHR0aGlzLmZvbnRXZWlnaHQgPSBwYXJhbS5mb250V2VpZ2h0O1xuXHR0aGlzLmZvbnRTdHlsZSA9IHBhcmFtLmZvbnRTdHlsZTtcblx0dGhpcy50ZXh0QW5jaG9yID0gcGFyYW0udGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xuXHR0aGlzLnZ0ZXh0QW5jaG9yID0gcGFyYW0udnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3Ncblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUyRFxuXHR0aGlzLmZpbGwgPSBwYXJhbS5maWxsOyAvLyBmaWxsIGNvbG9yXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMURcblx0dGhpcy5pZCA9IHBhcmFtLmlkO1xuXHR0aGlzLnN0cm9rZSA9IHBhcmFtLnN0cm9rZTsgLy8gc3Ryb2tlIGNvbG9yXG5cdHRoaXMuc3Ryb2tlV2lkdGggPSBwYXJhbS5zdHJva2VXaWR0aDtcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVyR3JvdXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Z1wiO1xuXHRpZiAodHlwZW9mIHRoaXMuaWQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0eXBlb2YgdGhpcy5mb250U2l6ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFNpemU9J1wiK3RoaXMuZm9udFNpemUrXCInXCI7XG5cdH1cblx0aWYgKHR5cGVvZiB0aGlzLmZvbnRGYW1pbHkgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRGYW1pbHk9J1wiK3RoaXMuZm9udEZhbWlseStcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMuZm9udFdlaWdodCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFdlaWdodD0nXCIrdGhpcy5mb250V2VpZ2h0K1wiJ1wiO1xuXHR9XG5cdGlmICh0eXBlb2YgdGhpcy5mb250U3R5bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRTdHlsZT0nXCIrdGhpcy5mb250U3R5bGUrXCInXCI7XG5cdH1cblx0aWYgKHR5cGVvZiB0aGlzLnRleHRBbmNob3IgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHRleHRBbmNob3I9J1wiK3RoaXMudGV4dEFuY2hvcitcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMudnRleHRBbmNob3IgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZ0ZXh0QW5jaG9yPSdcIit0aGlzLnZ0ZXh0QW5jaG9yK1wiJ1wiO1xuXHR9XG5cdGlmICh0eXBlb2YgdGhpcy5zdHJva2UgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHN0cm9rZT0nXCIrdGhpcy5zdHJva2UrXCInXCI7XG5cdH1cblx0aWYgKHR5cGVvZiB0aGlzLnN0cm9rZVdpZHRoICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzdHJva2VXaWR0aD0nXCIrdGhpcy5zdHJva2VXaWR0aCtcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMuZmlsbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZmlsbD0nXCIrdGhpcy5maWxsK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuLy8gbG9jYWxTdHlsZSBmcm9tIHNwZWNzXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uU3R5bGUgPSBmdW5jdGlvbihpZCwgbmFtZSwgaWRMaXN0KSB7XG5cdC8vIGV2ZXJ5dGhpbmcgaXMgb3B0aW9uYWxcdFxuXHR0aGlzLmlkID0gaWQ7XG5cdHRoaXMubmFtZSA9IG5hbWU7XG5cdHRoaXMuaWRMaXN0ID0gaWRMaXN0O1xuXHR0aGlzLnJlbmRlckdyb3VwID0gbnVsbDsgLy8gMCBvciAxXG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlN0eWxlLnByb3RvdHlwZS5zZXRSZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChyZW5kZXJHcm91cCkge1xuXHR0aGlzLnJlbmRlckdyb3VwID0gcmVuZGVyR3JvdXA7XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlN0eWxlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHN0eWxlXCI7XG5cdGlmICh0eXBlb2YgdGhpcy5pZCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYgKHR5cGVvZiB0aGlzLm5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIG5hbWU9J1wiK3RoaXMubmFtZStcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMuaWRMaXN0ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZExpc3Q9J1wiK3RoaXMuaWRMaXN0LmpvaW4oJyAnKStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cblx0aWYgKHRoaXMucmVuZGVyR3JvdXApIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5yZW5kZXJHcm91cC50b1hNTCgpO1xuXHR9XG5cblx0eG1sU3RyaW5nICs9IFwiPC9zdHlsZT5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdHlsZUxpc3QgPSBbXTtcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzLnByb3RvdHlwZS5hZGRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG5cdHRoaXMuc3R5bGVMaXN0LnB1c2goc3R5bGUpO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGlzdE9mU3R5bGVzPlxcblwiO1xuXHRmb3IodmFyIGk9MDsgaTx0aGlzLnN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBzdHlsZSA9IHRoaXMuc3R5bGVMaXN0W2ldO1xuXHRcdHhtbFN0cmluZyArPSBzdHlsZS50b1hNTCgpO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIjwvbGlzdE9mU3R5bGVzPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlJlbmRlckluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGlkLCBuYW1lLCBiYWNrZ3JvdW5kQ29sb3IpIHtcblx0dGhpcy5pZCA9IGlkOyAvLyByZXF1aXJlZCwgcmVzdCBpcyBvcHRpb25hbFxuXHR0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnByb2dyYW1OYW1lID0gcGtnTmFtZTtcblx0dGhpcy5wcm9ncmFtVmVyc2lvbiA9IHBrZ1ZlcnNpb247XG5cdHRoaXMuYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBudWxsO1xuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IG51bGw7XG5cdC8qdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0KTtcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcyhyZW5kZXJJbmZvLnN0eWxlRGVmKTtcblx0Ki9cbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnNldExpc3RPZkNvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0dGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnNldExpc3RPZlN0eWxlcyA9IGZ1bmN0aW9uKGxpc3RPZlN0eWxlcykge1xuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IGxpc3RPZlN0eWxlcztcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XG5cdC8vIHRhZyBhbmQgaXRzIGF0dHJpYnV0ZXNcblx0dmFyIHhtbFN0cmluZyA9IFwiPHJlbmRlckluZm9ybWF0aW9uIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHRpZiAodHlwZW9mIHRoaXMubmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbmFtZT0nXCIrdGhpcy5uYW1lK1wiJ1wiO1xuXHR9XG5cdGlmICh0eXBlb2YgdGhpcy5wcm9ncmFtTmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgcHJvZ3JhbU5hbWU9J1wiK3RoaXMucHJvZ3JhbU5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHR5cGVvZiB0aGlzLnByb2dyYW1WZXJzaW9uICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHhtbFN0cmluZyArPSBcIiBwcm9ncmFtVmVyc2lvbj0nXCIrdGhpcy5wcm9ncmFtVmVyc2lvbitcIidcIjtcblx0fVxuXHRpZiAodHlwZW9mIHRoaXMuYmFja2dyb3VuZENvbG9yICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHhtbFN0cmluZyArPSBcIiBiYWNrZ3JvdW5kQ29sb3I9J1wiK3RoaXMuYmFja2dyb3VuZENvbG9yK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiB4bWxucz0nXCIrc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLnhtbG5zK1wiJz5cXG5cIjtcblxuXHQvLyBjaGlsZCBlbGVtZW50c1xuXHRpZiAodGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucy50b1hNTCgpO1xuXHR9XG5cdGlmICh0aGlzLmxpc3RPZlN0eWxlcykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmxpc3RPZlN0eWxlcy50b1hNTCgpO1xuXHR9XG5cblx0eG1sU3RyaW5nICs9IFwiPC9yZW5kZXJJbmZvcm1hdGlvbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbi8qIHByb2JhYmx5IHVzZWxlc3MsIHNlZW1zIGxpa2Ugbm9ib2R5IHVzZSB0aGlzIGluIHRoZSBleHRlbnNpb25cbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5kZWZhdWx0VmFsdWVzID0ge1xuXHRiYWNrZ3JvdW5kQ29sb3I6IG51bGwsXG5cdGZvbnRTaXplOiBudWxsLFxuXHRmb250RmFtaWx5OiBudWxsLFxuXHRmb250V2VpZ2h0OiBudWxsLFxuXHRmb250U3R5bGU6IG51bGwsXG5cdHRleHRBbmNob3I6IG51bGwsXG5cdHZ0ZXh0QW5jaG9yOiBudWxsLFxuXHRmaWxsOiBudWxsLFxuXHRzdHJva2U6IG51bGwsXG5cdHN0cm9rZVdpZHRoOiBudWxsXG59O1xuXG5cbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5saXN0T2ZSZW5kZXJJbmZvcm1hdGlvbiA9IHtcblx0ZGVmYXVsdFZhbHVlczoge30sXG5cdHJlbmRlckluZm9ybWF0aW9uTGlzdDogW11cbn1cbiovXG5cbm1vZHVsZS5leHBvcnRzID0gc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xuXG52YXIgc2Jnbm1sVG9Kc29uID0ge1xuICBpbnNlcnRlZE5vZGVzOiB7fSxcbiAgZ2V0QWxsQ29tcGFydG1lbnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IFtdO1xuXG4gICAgdmFyIGNvbXBhcnRtZW50RWxzID0geG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoXCJnbHlwaFtjbGFzcz0nY29tcGFydG1lbnQnXVwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjb21wYXJ0bWVudCA9IGNvbXBhcnRtZW50RWxzW2ldO1xuICAgICAgdmFyIGJib3ggPSB0aGlzLmZpbmRDaGlsZE5vZGUoY29tcGFydG1lbnQsICdiYm94Jyk7XG4gICAgICBjb21wYXJ0bWVudHMucHVzaCh7XG4gICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94LmdldEF0dHJpYnV0ZSgneCcpKSxcbiAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCd5JykpLFxuICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKSksXG4gICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94LmdldEF0dHJpYnV0ZSgnaCcpKSxcbiAgICAgICAgJ2lkJzogY29tcGFydG1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wYXJ0bWVudHMuc29ydChmdW5jdGlvbiAoYzEsIGMyKSB7XG4gICAgICBpZiAoYzEuaCAqIGMxLncgPCBjMi5oICogYzIudykge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYzEuaCAqIGMxLncgPiBjMi5oICogYzIudykge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXBhcnRtZW50cztcbiAgfSxcbiAgaXNJbkJvdW5kaW5nQm94OiBmdW5jdGlvbiAoYmJveDEsIGJib3gyKSB7XG4gICAgaWYgKGJib3gxLnggPiBiYm94Mi54ICYmXG4gICAgICAgIGJib3gxLnkgPiBiYm94Mi55ICYmXG4gICAgICAgIGJib3gxLnggKyBiYm94MS53IDwgYmJveDIueCArIGJib3gyLncgJiZcbiAgICAgICAgYmJveDEueSArIGJib3gxLmggPCBiYm94Mi55ICsgYmJveDIuaCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgYmJveFByb3A6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICB2YXIgYmJveCA9IGVsZS5xdWVyeVNlbGVjdG9yKCdiYm94Jyk7XG5cbiAgICBiYm94LnggPSBiYm94LmdldEF0dHJpYnV0ZSgneCcpO1xuICAgIGJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XG4gICAgYmJveC53ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKTtcbiAgICBiYm94LmggPSBiYm94LmdldEF0dHJpYnV0ZSgnaCcpO1xuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMjtcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XG4gICAgdmFyIHlQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueSk7XG5cbiAgICB2YXIgYmJveCA9IGVsZS5xdWVyeVNlbGVjdG9yKCdiYm94Jyk7XG5cbiAgICBiYm94LnggPSBiYm94LmdldEF0dHJpYnV0ZSgneCcpO1xuICAgIGJib3gueSA9IGJib3guZ2V0QXR0cmlidXRlKCd5Jyk7XG4gICAgYmJveC53ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3cnKTtcbiAgICBiYm94LmggPSBiYm94LmdldEF0dHJpYnV0ZSgnaCcpO1xuXG4gICAgLy8gc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyIC0geFBvcztcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyIC0geVBvcztcblxuICAgIGJib3gueCA9IGJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcbiAgICBiYm94LnkgPSBiYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XG5cbiAgICByZXR1cm4gYmJveDtcbiAgfSxcbiAgZmluZENoaWxkTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xuICAgIC8vIGZpbmQgY2hpbGQgbm9kZXMgYXQgZGVwdGggbGV2ZWwgb2YgMSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudFxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IGVsZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxICYmIGNoaWxkLnRhZ05hbWUgPT09IGNoaWxkVGFnTmFtZSkge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9LFxuICBmaW5kQ2hpbGROb2RlOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgY2hpbGRUYWdOYW1lKTtcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCA/IG5vZGVzWzBdIDogdW5kZWZpbmVkO1xuICB9LFxuICBzdGF0ZUFuZEluZm9Qcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IFtdO1xuXG4gICAgdmFyIGNoaWxkR2x5cGhzID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZEdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICB2YXIgaW5mbyA9IHt9O1xuXG4gICAgICBpZiAoZ2x5cGguY2xhc3NOYW1lID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc05hbWUgfHwgdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbGFiZWwgPSBnbHlwaC5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgICBpbmZvLmxhYmVsID0ge1xuICAgICAgICAgICd0ZXh0JzogKGxhYmVsICYmIGxhYmVsLmdldEF0dHJpYnV0ZSgndGV4dCcpKSB8fCB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XG4gICAgICB9IGVsc2UgaWYgKGdseXBoLmNsYXNzTmFtZSA9PT0gJ3N0YXRlIHZhcmlhYmxlJykge1xuICAgICAgICBpbmZvLmlkID0gZ2x5cGguZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzTmFtZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdseXBoLnF1ZXJ5U2VsZWN0b3IoJ3N0YXRlJyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IChzdGF0ZSAmJiBzdGF0ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gKHN0YXRlICYmIHN0YXRlLmdldEF0dHJpYnV0ZSgndmFyaWFibGUnKSkgfHwgdW5kZWZpbmVkO1xuICAgICAgICBpbmZvLnN0YXRlID0ge1xuICAgICAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgICAgICd2YXJpYWJsZSc6IHZhcmlhYmxlXG4gICAgICAgIH07XG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHN0YXRlQW5kSW5mb0FycmF5O1xuICB9LFxuICBhZGRQYXJlbnRJbmZvVG9Ob2RlOiBmdW5jdGlvbiAoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY29tcGFydG1lbnRSZWYgPSBlbGUuZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbXBhcnRtZW50UmVmKSB7XG4gICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50UmVmO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlT2JqLnBhcmVudCA9ICcnO1xuXG4gICAgICAvLyBhZGQgY29tcGFydG1lbnQgYWNjb3JkaW5nIHRvIGdlb21ldHJ5XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcnRtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYmJveEVsID0gc2VsZi5maW5kQ2hpbGROb2RlKGVsZSwgJ2Jib3gnKTtcbiAgICAgICAgdmFyIGJib3ggPSB7XG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ3gnKSksXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ3knKSksXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ3cnKSksXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3hFbC5nZXRBdHRyaWJ1dGUoJ2gnKSksXG4gICAgICAgICAgJ2lkJzogZWxlLmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoc2VsZi5pc0luQm91bmRpbmdCb3goYmJveCwgY29tcGFydG1lbnRzW2ldKSkge1xuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5vZGVPYmogPSB7fTtcblxuICAgIC8vIGFkZCBpZCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouaWQgPSBlbGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIC8vIGFkZCBub2RlIGJvdW5kaW5nIGJveCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouYmJveCA9IHNlbGYuYmJveFByb3AoZWxlKTtcbiAgICAvLyBhZGQgY2xhc3MgaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmNsYXNzID0gZWxlLmNsYXNzTmFtZTtcbiAgICAvLyBhZGQgbGFiZWwgaW5mb3JtYXRpb25cbiAgICB2YXIgbGFiZWwgPSBzZWxmLmZpbmRDaGlsZE5vZGUoZWxlLCAnbGFiZWwnKTtcbiAgICBub2RlT2JqLmxhYmVsID0gKGxhYmVsICYmIGxhYmVsLmdldEF0dHJpYnV0ZSgndGV4dCcpKSB8fCB1bmRlZmluZWQ7XG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLmJib3gpO1xuICAgIC8vIGFkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG5cbiAgICAvLyBhZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICB2YXIgY2xvbmVNYXJrZXJzID0gc2VsZi5maW5kQ2hpbGROb2RlcyhlbGUsICdjbG9uZScpO1xuICAgIGlmIChjbG9uZU1hcmtlcnMubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gYWRkIHBvcnQgaW5mb3JtYXRpb25cbiAgICB2YXIgcG9ydHMgPSBbXTtcbiAgICB2YXIgcG9ydEVsZW1lbnRzID0gZWxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BvcnQnKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9ydEVsID0gcG9ydEVsZW1lbnRzW2ldO1xuICAgICAgdmFyIGlkID0gcG9ydEVsLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC5nZXRBdHRyaWJ1dGUoJ3gnKSkgLSBub2RlT2JqLmJib3gueDtcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC5nZXRBdHRyaWJ1dGUoJ3knKSkgLSBub2RlT2JqLmJib3gueTtcblxuICAgICAgcmVsYXRpdmVYUG9zID0gcmVsYXRpdmVYUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiAxMDA7XG4gICAgICByZWxhdGl2ZVlQb3MgPSByZWxhdGl2ZVlQb3MgLyBwYXJzZUZsb2F0KG5vZGVPYmouYmJveC5oKSAqIDEwMDtcblxuICAgICAgcG9ydHMucHVzaCh7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgeDogcmVsYXRpdmVYUG9zLFxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG5vZGVPYmoucG9ydHMgPSBwb3J0cztcblxuICAgIHZhciBjeXRvc2NhcGVKc05vZGUgPSB7ZGF0YTogbm9kZU9ian07XG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNOb2RlKTtcbiAgfSxcbiAgdHJhdmVyc2VOb2RlczogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xuICAgIHZhciBlbElkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc05hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zZXJ0ZWROb2Rlc1tlbElkXSA9IHRydWU7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIGFkZCBjb21wbGV4IG5vZGVzIGhlcmVcblxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc05hbWU7XG5cbiAgICBpZiAoZWxlQ2xhc3MgPT09ICdjb21wbGV4JyB8fCBlbGVDbGFzcyA9PT0gJ2NvbXBsZXggbXVsdGltZXInIHx8IGVsZUNsYXNzID09PSAnc3VibWFwJykge1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcblxuICAgICAgdmFyIGNoaWxkR2x5cGhzID0gc2VsZi5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZEdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcbiAgICAgICAgdmFyIGdseXBoQ2xhc3MgPSBnbHlwaC5jbGFzc05hbWU7XG4gICAgICAgIGlmIChnbHlwaENsYXNzICE9PSAnc3RhdGUgdmFyaWFibGUnICYmIGdseXBoQ2xhc3MgIT09ICd1bml0IG9mIGluZm9ybWF0aW9uJykge1xuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwganNvbkFycmF5LCBlbElkLCBjb21wYXJ0bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG4gICAgfVxuICB9LFxuICBnZXRQb3J0czogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xuICAgIHJldHVybiAoIHhtbE9iamVjdC5fY2FjaGVkUG9ydHMgPSB4bWxPYmplY3QuX2NhY2hlZFBvcnRzIHx8IHhtbE9iamVjdC5xdWVyeVNlbGVjdG9yQWxsKCdwb3J0JykpO1xuICB9LFxuICBnZXRHbHlwaHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcbiAgICB2YXIgZ2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHM7XG5cbiAgICBpZiAoIWdseXBocykge1xuICAgICAgZ2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgPSB4bWxPYmplY3QuX2NhY2hlZEdseXBocyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgnZ2x5cGgnKTtcblxuICAgICAgdmFyIGlkMmdseXBoID0geG1sT2JqZWN0Ll9pZDJnbHlwaCA9IHt9O1xuXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHZhciBnID0gZ2x5cGhzW2ldO1xuICAgICAgICB2YXIgaWQgPSBnLmdldEF0dHJpYnV0ZSgnaWQnKTtcblxuICAgICAgICBpZDJnbHlwaFsgaWQgXSA9IGc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdseXBocztcbiAgfSxcbiAgZ2V0R2x5cGhCeUlkOiBmdW5jdGlvbiAoeG1sT2JqZWN0LCBpZCkge1xuICAgIHRoaXMuZ2V0R2x5cGhzKHhtbE9iamVjdCk7IC8vIG1ha2Ugc3VyZSBjYWNoZSBpcyBidWlsdFxuXG4gICAgcmV0dXJuIHhtbE9iamVjdC5faWQyZ2x5cGhbaWRdO1xuICB9LFxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xuICAgIC8vIHNvdXJjZSBhbmQgdGFyZ2V0IGNhbiBiZSBpbnNpZGUgb2YgYSBwb3J0XG4gICAgdmFyIHNvdXJjZSA9IGFyYy5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuICAgIHZhciB0YXJnZXQgPSBhcmMuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcbiAgICB2YXIgc291cmNlTm9kZUlkO1xuICAgIHZhciB0YXJnZXROb2RlSWQ7XG5cbiAgICB2YXIgc291cmNlRXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCBzb3VyY2UpO1xuICAgIHZhciB0YXJnZXRFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHRhcmdldCk7XG5cbiAgICBpZiAoc291cmNlRXhpc3RzKSB7XG4gICAgICBzb3VyY2VOb2RlSWQgPSBzb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldEV4aXN0cykge1xuICAgICAgdGFyZ2V0Tm9kZUlkID0gdGFyZ2V0O1xuICAgIH1cblxuXG4gICAgdmFyIGk7XG4gICAgdmFyIHBvcnRFbHMgPSB0aGlzLmdldFBvcnRzKHhtbE9iamVjdCk7XG4gICAgdmFyIHBvcnQ7XG4gICAgaWYgKHNvdXJjZU5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gc291cmNlKSB7XG4gICAgICAgICAgc291cmNlTm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0YXJnZXROb2RlSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcG9ydCA9IHBvcnRFbHNbaV07XG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0Tm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7J3NvdXJjZSc6IHNvdXJjZU5vZGVJZCwgJ3RhcmdldCc6IHRhcmdldE5vZGVJZH07XG4gIH0sXG5cbiAgZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICduZXh0Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9zWCA9IGNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgneCcpO1xuICAgICAgdmFyIHBvc1kgPSBjaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ3knKTtcblxuICAgICAgYmVuZFBvaW50UG9zaXRpb25zLnB1c2goe1xuICAgICAgICB4OiBwb3NYLFxuICAgICAgICB5OiBwb3NZXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmVuZFBvaW50UG9zaXRpb25zO1xuICB9LFxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NOYW1lXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xuXG4gICAgaWYgKCF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnNvdXJjZV0gfHwgIXRoaXMuaW5zZXJ0ZWROb2Rlc1tzb3VyY2VBbmRUYXJnZXQudGFyZ2V0XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBlZGdlT2JqID0ge307XG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IHNlbGYuZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zKGVsZSk7XG5cbiAgICBlZGdlT2JqLmlkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XG4gICAgZWRnZU9iai5jbGFzcyA9IGVsZS5jbGFzc05hbWU7XG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XG5cbiAgICB2YXIgZ2x5cGhDaGlsZHJlbiA9IHNlbGYuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcbiAgICB2YXIgZ2x5cGhEZXNjZW5kZW50cyA9IGVsZS5xdWVyeVNlbGVjdG9yQWxsKCdnbHlwaCcpO1xuICAgIGlmIChnbHlwaERlc2NlbmRlbnRzLmxlbmd0aCA8PSAwKSB7XG4gICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbHlwaENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChnbHlwaENoaWxkcmVuW2ldLmNsYXNzTmFtZSA9PT0gJ2NhcmRpbmFsaXR5Jykge1xuICAgICAgICAgIHZhciBsYWJlbCA9IGdseXBoQ2hpbGRyZW5baV0ucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gbGFiZWwuZ2V0QXR0cmlidXRlKCd0ZXh0JykgfHwgdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWRnZU9iai5zb3VyY2UgPSBzb3VyY2VBbmRUYXJnZXQuc291cmNlO1xuICAgIGVkZ2VPYmoudGFyZ2V0ID0gc291cmNlQW5kVGFyZ2V0LnRhcmdldDtcblxuICAgIGVkZ2VPYmoucG9ydHNvdXJjZSA9IGVsZS5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpO1xuXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xuICB9LFxuICBjb252ZXJ0OiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZXMgPSBbXTtcblxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBzZWxmLmdldEFsbENvbXBhcnRtZW50cyh4bWxPYmplY3QpO1xuXG4gICAgdmFyIGdseXBocyA9IHNlbGYuZmluZENoaWxkTm9kZXMoeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJ21hcCcpLCAnZ2x5cGgnKTtcbiAgICB2YXIgYXJjcyA9IHNlbGYuZmluZENoaWxkTm9kZXMoeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJ21hcCcpLCAnYXJjJyk7XG5cbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZ2x5cGggPSBnbHlwaHNbaV07XG4gICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGN5dG9zY2FwZUpzTm9kZXMsICcnLCBjb21wYXJ0bWVudHMpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYXJjID0gYXJjc1tpXTtcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNFZGdlKGFyYywgY3l0b3NjYXBlSnNFZGdlcywgeG1sT2JqZWN0KTtcbiAgICB9XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNHcmFwaCA9IHt9O1xuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xuICAgIGN5dG9zY2FwZUpzR3JhcGguZWRnZXMgPSBjeXRvc2NhcGVKc0VkZ2VzO1xuXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XG5cbiAgICByZXR1cm4gY3l0b3NjYXBlSnNHcmFwaDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XG4iLCIvKlxuICogVGV4dCB1dGlsaXRpZXMgZm9yIGNvbW1vbiB1c2FnZVxuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIHRleHRVdGlsaXRpZXMgPSB7XG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XG4gIHRydW5jYXRlVGV4dDogZnVuY3Rpb24gKHRleHRQcm9wLCBmb250KSB7XG4gICAgdmFyIGNvbnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29udGV4dC5mb250ID0gZm9udDtcbiAgICBcbiAgICB2YXIgZml0TGFiZWxzVG9Ob2RlcyA9IG9wdGlvbnMuZml0TGFiZWxzVG9Ob2RlcztcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XG4gICAgXG4gICAgdmFyIHRleHQgPSB0ZXh0UHJvcC5sYWJlbCB8fCBcIlwiO1xuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcbiAgICBpZiAoZml0TGFiZWxzVG9Ob2RlcyA9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIHZhciB3aWR0aDtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGg7XG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xuICAgIHZhciB0ZXh0V2lkdGggPSAodGV4dFByb3Aud2lkdGggPiAzMCkgPyB0ZXh0UHJvcC53aWR0aCAtIDEwIDogdGV4dFByb3Aud2lkdGg7XG4gICAgd2hpbGUgKCh3aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGgpID4gdGV4dFdpZHRoKSB7XG4gICAgICAtLWxlbjtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBsZW4pICsgZWxsaXBzaXM7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9LFxuXG4gIC8vIGVuc3VyZSB0aGF0IHJldHVybmVkIHN0cmluZyBmb2xsb3dzIHhzZDpJRCBzdGFuZGFyZFxuICAvLyBzaG91bGQgZm9sbG93IHInXlthLXpBLVpfXVtcXHcuLV0qJCdcbiAgZ2V0WE1MVmFsaWRJZDogZnVuY3Rpb24ob3JpZ2luYWxJZCkge1xuICAgIHZhciBuZXdJZCA9IFwiXCI7XG4gICAgdmFyIHhtbFZhbGlkUmVnZXggPSAvXlthLXpBLVpfXVtcXHcuLV0qJC87XG4gICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG9yaWdpbmFsSWQpKSB7IC8vIGRvZXNuJ3QgY29tcGx5XG4gICAgICBuZXdJZCA9IG9yaWdpbmFsSWQ7XG4gICAgICBuZXdJZCA9IG5ld0lkLnJlcGxhY2UoL1teXFx3Li1dL2csIFwiXCIpO1xuICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBzdGlsbCBkb2Vzbid0IGNvbXBseVxuICAgICAgICBuZXdJZCA9IFwiX1wiICsgbmV3SWQ7XG4gICAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gbm9ybWFsbHkgd2Ugc2hvdWxkIG5ldmVyIGVudGVyIHRoaXNcbiAgICAgICAgICAvLyBpZiBmb3Igc29tZSBvYnNjdXJlIHJlYXNvbiB3ZSBzdGlsbCBkb24ndCBjb21wbHksIHRocm93IGVycm9yLlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgaWRlbnRpZmVyIGNvbXBseSB0byB4c2Q6SUQgcmVxdWlyZW1lbnRzOiBcIituZXdJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdJZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxJZDtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0VXRpbGl0aWVzOyIsIi8qXG4gKiBDb21tb25seSBuZWVkZWQgVUkgVXRpbGl0aWVzXG4gKi9cblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgdWlVdGlsaXRpZXMgPSB7XG4gIHN0YXJ0U3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XG4gICAgfVxuICAgIFxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS53aWR0aCgpO1xuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLmhlaWdodCgpO1xuICAgICAgJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciArICc6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGNsYXNzTmFtZSArICdcIj48L2k+Jyk7XG4gICAgfVxuICB9LFxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcbiAgICB9XG4gICAgXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAkKCcuJyArIGNsYXNzTmFtZSkucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpVXRpbGl0aWVzO1xuXG5cbiIsIi8qXG4gKiBUaGlzIGZpbGUgZXhwb3J0cyB0aGUgZnVuY3Rpb25zIHRvIGJlIHV0aWxpemVkIGluIHVuZG9yZWRvIGV4dGVuc2lvbiBhY3Rpb25zIFxuICovXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xuICAvLyBTZWN0aW9uIFN0YXJ0XG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xuICB9LFxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICB2YXIgcGFyYW0gPSB7fTtcbiAgICBwYXJhbS5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcbiAgICByZXR1cm4gcGFyYW07XG4gIH0sXG4gIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQocGFyYW0uZWxlcyk7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XG4gIH0sXG4gIC8vIFNlY3Rpb24gRW5kXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uczsiXX0=

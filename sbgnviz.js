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
            'padding-top': getCompoundPaddings() + options.extraCompartmentPadding,
            'padding-bottom': getCompoundPaddings() + options.extraCompartmentPadding
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
        console.log("libsbgnjs", libsbgnjs);
        console.log("sbgn", sbgn);
        var map = new libsbgnjs.Map({language: 'process description', id: mapID});
        if (hasExtension) { // extension is there
            var extension = new libsbgnjs.Extension();
            if (hasRenderExtension) {
                extension.add(self.getRenderExtensionSbgnml(renderInfo));
            }
            map.setExtension(extension);
        }

        var glyphList = [];
        cy.nodes(":visible").each(function(){
            if(!this.isChild())
                glyphList = glyphList.concat(self.getGlyphSbgnml(this));
        });
        for(var i=0; i<glyphList.length; i++) {
            map.addGlyph(glyphList[i]);
        }

        cy.edges(":visible").each(function(){
            map.addArc(self.getArcSbgnml(this));
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
        renderInformation.setListOfColorDefinition(listOfColorDefinitions);

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

        if(nodeClass === "complex" || nodeClass === "submap"){
            node.children().each(function(){
                var glyphMemberList = self.getGlyphSbgnml(this);
                for (var i=0; i < glyphMemberList.length; i++) {
                    glyph.addGlyphMember(glyphMemberList[i]);
                }
            });
        }

        glyphList.push(glyph);

        if(nodeClass === "compartment"){
            node.children().each(function(){
                glyphList = glyphList.concat(self.getGlyphSbgnml(this));
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

        var arcId = edge._private.data.id; //arcSource + "-" + arcTarget;
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
              //sbgnmlText = sbgnmlText + "<next y='" + bendY + "' x='" + bendX + "'/>\n";
            }
          }
        }

        arc.setEnd(new libsbgnjs.EndType({x: edge._private.rscratch.endX, y: edge._private.rscratch.endY}));

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

},{"../../package.json":1,"./text-utilities":15,"libsbgn-js":19}],9:[function(_dereq_,module,exports){
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
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.value != null) {
		xmlString += " value='"+this.value+"'";
	}
	xmlString += " />\n";
	return xmlString;
};
sbgnmlRenderExtension.ColorDefinition.fromXML = function (xml) {
	var colorDefinition = new sbgnmlRenderExtension.ColorDefinition();
	colorDefinition.id = xml.getAttribute('id');
	colorDefinition.value = xml.getAttribute('value');
	return colorDefinition;
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
sbgnmlRenderExtension.ListOfColorDefinitions.fromXML = function (xml) {
	var listOfColorDefinitions = new sbgnmlRenderExtension.ListOfColorDefinitions();

	var colorDefinitions = xml.getElementsByTagName('colorDefinition');
	for (var i=0; i<colorDefinitions.length; i++) {
		var colorDefinitionXML = colorDefinitions[i];
		var colorDefinition = sbgnmlRenderExtension.ColorDefinition.fromXML(colorDefinitionXML);
		listOfColorDefinitions.addColorDefinition(colorDefinition);
	}
	return listOfColorDefinitions;
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
sbgnmlRenderExtension.RenderGroup.fromXML = function (xml) {
	var renderGroup = new sbgnmlRenderExtension.RenderGroup({});
	renderGroup.id = xml.getAttribute('id');
	renderGroup.fontSize = xml.getAttribute('fontSize');
	renderGroup.fontFamily = xml.getAttribute('fontFamily');
	renderGroup.fontWeight = xml.getAttribute('fontWeight');
	renderGroup.fontStyle = xml.getAttribute('fontStyle');
	renderGroup.textAnchor = xml.getAttribute('textAnchor');
	renderGroup.vtextAnchor = xml.getAttribute('vtextAnchor');
	renderGroup.stroke = xml.getAttribute('stroke');
	renderGroup.strokeWidth = xml.getAttribute('strokeWidth');
	renderGroup.fill = xml.getAttribute('fill');
	return renderGroup;
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
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.idList != null) {
		xmlString += " idList='"+this.idList.join(' ')+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};
sbgnmlRenderExtension.Style.fromXML = function (xml) {
	var style = new sbgnmlRenderExtension.Style();
	style.id = xml.getAttribute('id');
	style.name = xml.getAttribute('name');
	var idList = xml.getAttribute('idList');
	style.idList = idList != null ? idList.split(' ') : [];

	var renderGroupXML = xml.getElementsByTagName('g')[0];
	if (renderGroupXML != null) {
		style.renderGroup = sbgnmlRenderExtension.RenderGroup.fromXML(renderGroupXML);
	}
	return style;
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
sbgnmlRenderExtension.ListOfStyles.fromXML = function (xml) {
	var listOfStyles = new sbgnmlRenderExtension.ListOfStyles();

	var styles = xml.getElementsByTagName('style');
	for (var i=0; i<styles.length; i++) {
		var styleXML = styles[i];
		var style = sbgnmlRenderExtension.Style.fromXML(styleXML);
		listOfStyles.addStyle(style);
	}
	return listOfStyles;
};

sbgnmlRenderExtension.RenderInformation = function (id, name, backgroundColor, providedProgName, providedProgVersion) {
	this.id = id; // required, rest is optional
	this.name = name;
	this.programName = providedProgName || pkgName;
	this.programVersion = providedProgVersion || pkgVersion;
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
// static constructor method
sbgnmlRenderExtension.RenderInformation.fromXML = function (xml) {
	var renderInformation = new sbgnmlRenderExtension.RenderInformation();
	renderInformation.id = xml.getAttribute('id');
	renderInformation.name = xml.getAttribute('name');
	renderInformation.programName = xml.getAttribute('programName');
	renderInformation.programVersion = xml.getAttribute('programVersion');
	renderInformation.backgroundColor = xml.getAttribute('backgroundColor');

	var listOfColorDefinitionsXML = xml.getElementsByTagName('listOfColorDefinitions')[0];
	var listOfStylesXML = xml.getElementsByTagName('listOfStyles')[0];
	if (listOfColorDefinitionsXML != null) {
		renderInformation.listOfColorDefinitions = sbgnmlRenderExtension.ListOfColorDefinitions.fromXML(listOfColorDefinitionsXML);
	}
	if (listOfStylesXML != null) {
		renderInformation.listOfStyles = sbgnmlRenderExtension.ListOfStyles.fromXML(listOfStylesXML);
	}

	return renderInformation;
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
var renderExtension = _dereq_('./sbgnml-render');

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

},{"./element-utilities":5,"./sbgnml-render":13}],15:[function(_dereq_,module,exports){
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
},{"./element-utilities":5}],18:[function(_dereq_,module,exports){
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
	var colorDefinition = new ns.ColorDefinition();
	colorDefinition.id 		= xml.getAttribute('id');
	colorDefinition.value 	= xml.getAttribute('value');
	return colorDefinition;
};
// ------- END COLORDEFINITION -------

// ------- LISTOFCOLORDEFINITIONS -------
ns.ListOfColorDefinitions = function () {
	this.colorList = [];
};

ns.ListOfColorDefinitions.prototype.addColorDefinition = function (colorDefinition) {
	this.colorList.push(colorDefinition);
};

ns.ListOfColorDefinitions.prototype.toXML = function () {
	var xmlString = "<listOfColorDefinitions>\n";
	for(var i=0; i<this.colorList.length; i++) {
		var color = this.colorList[i];
		xmlString += color.toXML();
	}
	xmlString += "</listOfColorDefinitions>\n";
	return xmlString;
};

ns.ListOfColorDefinitions.fromXML = function (xml) {
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
	this.idList 		= params.idList;
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
		xmlString += " idList='"+this.idList.join(' ')+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};

ns.Style.fromXML = function (xml) {
	var style = new ns.Style();
	style.id 		= xml.getAttribute('id');
	style.name 		= xml.getAttribute('name');
	var idList 		= xml.getAttribute('idList');
	style.idList 	= idList != null ? idList.split(' ') : [];

	var renderGroupXML = xml.getElementsByTagName('g')[0];
	if (renderGroupXML != null) {
		style.renderGroup = ns.RenderGroup.fromXML(renderGroupXML);
	}
	return style;
};
// ------- END STYLE -------

// ------- LISTOFSTYLES -------
ns.ListOfStyles = function() {
	this.styleList = [];
};

ns.ListOfStyles.prototype.addStyle = function(style) {
	this.styleList.push(style);
};

ns.ListOfStyles.prototype.toXML = function () {
	var xmlString = "<listOfStyles>\n";
	for(var i=0; i<this.styleList.length; i++) {
		var style = this.styleList[i];
		xmlString += style.toXML();
	}
	xmlString += "</listOfStyles>\n";
	return xmlString;
};

ns.ListOfStyles.fromXML = function (xml) {
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

ns.RenderInformation.prototype.setListOfColorDefinition = function(listOfColorDefinitions) {
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
},{"./utilities":20}],19:[function(_dereq_,module,exports){
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
	var glyphsXML = xmlObj.getElementsByTagName('glyph');
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
	var params = checkParams(params, ['id', 'class_', 'source', 'target', 'start', 'end', 'nexts']);
	this.id 	= params.id;
	this.class_ = params.class_;
	this.source = params.source;
	this.target = params.target;

	this.start 	= params.start;
	this.end 	= params.end;
	this.nexts 	= params.nexts || [];
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
},{"./libsbgn-render-ext":18,"./utilities":20}],20:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC1yZW5kZXIuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiLCIuLi8uLi9saWJzYmduLWpzL2xpYnNiZ24tcmVuZGVyLWV4dC5qcyIsIi4uLy4uL2xpYnNiZ24tanMvbGlic2Jnbi5qcyIsIi4uLy4uL2xpYnNiZ24tanMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ24zREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJzYmdudml6XCIsXG4gIFwidmVyc2lvblwiOiBcIjMuMS4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTQkdOUEQgdmlzdWFsaXphdGlvbiBsaWJyYXJ5XCIsXG4gIFwibWFpblwiOiBcInNyYy9pbmRleC5qc1wiLFxuICBcImxpY2VuY2VcIjogXCJMR1BMLTMuMFwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwidGVzdFwiOiBcImVjaG8gXFxcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFxcXCIgJiYgZXhpdCAxXCIsXG4gICAgXCJidWlsZC1zYmdudml6LWpzXCI6IFwiZ3VscCBidWlsZFwiLFxuICAgIFwiZGVidWctanNcIjogXCJub2RlbW9uIC1lIGpzIC0td2F0Y2ggc3JjIC14IFxcXCJucG0gcnVuIGJ1aWxkLXNiZ252aXotanNcXFwiXCJcbiAgfSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy5naXRcIlxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzL2lzc3Vlc1wiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMvXCIsXG4gIFwicGVlci1kZXBlbmRlbmNpZXNcIjoge1xuICAgIFwianF1ZXJ5XCI6IFwiXjIuMi40XCIsXG4gICAgXCJmaWxlc2F2ZXJqc1wiOiBcIn4wLjIuMlwiLFxuICAgIFwiY3l0b3NjYXBlXCI6IFwiaVZpcy1hdC1CaWxrZW50L2N5dG9zY2FwZS5qcyN1bnN0YWJsZVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJyb3dzZXJpZnlcIjogXCJeMTEuMi4wXCIsXG4gICAgXCJndWxwXCI6IFwiXjMuOS4wXCIsXG4gICAgXCJndWxwLWRlcmVxdWlyZVwiOiBcIl4yLjEuMFwiLFxuICAgIFwiZ3VscC1qc2hpbnRcIjogXCJeMS4xMS4yXCIsXG4gICAgXCJndWxwLXByb21wdFwiOiBcIl4wLjEuMlwiLFxuICAgIFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS40XCIsXG4gICAgXCJndWxwLXNoZWxsXCI6IFwiXjAuNS4wXCIsXG4gICAgXCJndWxwLXV0aWxcIjogXCJeMy4wLjZcIixcbiAgICBcImpzaGludC1zdHlsaXNoXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJub2RlLW5vdGlmaWVyXCI6IFwiXjQuMy4xXCIsXG4gICAgXCJydW4tc2VxdWVuY2VcIjogXCJeMS4xLjRcIixcbiAgICBcInZpbnlsLWJ1ZmZlclwiOiBcIl4xLjAuMFwiLFxuICAgIFwidmlueWwtc291cmNlLXN0cmVhbVwiOiBcIl4xLjEuMFwiXG4gIH1cbn1cbiIsIihmdW5jdGlvbigpe1xuICB2YXIgc2JnbnZpeiA9IHdpbmRvdy5zYmdudml6ID0gZnVuY3Rpb24oX29wdGlvbnMsIF9saWJzKSB7XG4gICAgdmFyIGxpYnMgPSB7fTtcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XG4gICAgXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XG4gICAgXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTtcbiAgICBcbiAgICB2YXIgc2JnblJlbmRlcmVyID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1yZW5kZXJlcicpO1xuICAgIHZhciBzYmduQ3lJbnN0YW5jZSA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UnKTtcbiAgICBcbiAgICAvLyBVdGlsaXRpZXMgd2hvc2UgZnVuY3Rpb25zIHdpbGwgYmUgZXhwb3NlZCBzZXBlcmF0ZWx5XG4gICAgdmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdWktdXRpbGl0aWVzJyk7XG4gICAgdmFyIGZpbGVVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcycpO1xuICAgIHZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xuICAgIHZhciBtYWluVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMnKTtcbiAgICByZXF1aXJlKCcuL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMnKTsgLy8gcmVxdWlyZSBrZXlib3JkIGlucHV0IHV0aWxpdGllc1xuICAgIC8vIFV0aWxpdGllcyB0byBiZSBleHBvc2VkIGFzIGlzXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgc2JnblJlbmRlcmVyKCk7XG4gICAgc2JnbkN5SW5zdGFuY2UoKTtcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpcywgbW9zdCB1c2VycyB3aWxsIG5vdCBuZWVkIHRoZXNlXG4gICAgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcbiAgICBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gZmlsZVV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IGZpbGVVdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiB1aVV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IHVpVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBzYmduIGdyYXBoIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gZ3JhcGhVdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBncmFwaFV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gIH07XG4gIFxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2JnbnZpejtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG52YXIgcmVmcmVzaFBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzLmJpbmQoZ3JhcGhVdGlsaXRpZXMpO1xuXG52YXIgbGlicyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG5cbnZhciBnZXRDb21wb3VuZFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XG4gIC8vIFJldHVybiBjYWxjdWxhdGVkIHBhZGRpbmdzIGluIGNhc2Ugb2YgdGhhdCBkYXRhIGlzIGludmFsaWQgcmV0dXJuIDVcbiAgcmV0dXJuIGdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZWRQYWRkaW5ncyB8fCA1O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb250YWluZXJTZWxlY3RvciA9IG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yO1xuICB2YXIgaW1nUGF0aCA9IG9wdGlvbnMuaW1nUGF0aDtcbiAgXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXG4gIHtcbiAgICB2YXIgc2Jnbk5ldHdvcmtDb250YWluZXIgPSAkKGNvbnRhaW5lclNlbGVjdG9yKTtcblxuICAgIC8vIGNyZWF0ZSBhbmQgaW5pdCBjeXRvc2NhcGU6XG4gICAgdmFyIGN5ID0gY3l0b3NjYXBlKHtcbiAgICAgIGNvbnRhaW5lcjogc2Jnbk5ldHdvcmtDb250YWluZXIsXG4gICAgICBzdHlsZTogc2JnblN0eWxlU2hlZXQsXG4gICAgICBzaG93T3ZlcmxheTogZmFsc2UsIG1pblpvb206IDAuMTI1LCBtYXhab29tOiAxNixcbiAgICAgIGJveFNlbGVjdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICBtb3Rpb25CbHVyOiB0cnVlLFxuICAgICAgd2hlZWxTZW5zaXRpdml0eTogMC4xLFxuICAgICAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmN5ID0gdGhpcztcbiAgICAgICAgLy8gSWYgdW5kb2FibGUgcmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgICAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICAgIGJpbmRDeUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgXG4gIC8vIE5vdGUgdGhhdCBpbiBDaGlTRSB0aGlzIGZ1bmN0aW9uIGlzIGluIGEgc2VwZXJhdGUgZmlsZSBidXQgaW4gdGhlIHZpZXdlciBpdCBoYXMganVzdCAyIG1ldGhvZHMgYW5kIHNvIGl0IGlzIGxvY2F0ZWQgaW4gdGhpcyBmaWxlXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCkge1xuICAgIC8vIGNyZWF0ZSBvciBnZXQgdGhlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG5cbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVOb2Rlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZU5vZGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gYmluZEN5RXZlbnRzKCkge1xuICAgIGN5Lm9uKCd0YXBlbmQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICB9KTtcbiAgICBcbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmJlZm9yZWNvbGxhcHNlXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIC8vVGhlIGNoaWxkcmVuIGluZm8gb2YgY29tcGxleCBub2RlcyBzaG91bGQgYmUgc2hvd24gd2hlbiB0aGV5IGFyZSBjb2xsYXBzZWRcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcbiAgICAgICAgLy9UaGUgbm9kZSBpcyBiZWluZyBjb2xsYXBzZWQgc3RvcmUgaW5mb2xhYmVsIHRvIHVzZSBpdCBsYXRlclxuICAgICAgICB2YXIgaW5mb0xhYmVsID0gZWxlbWVudFV0aWxpdGllcy5nZXRJbmZvTGFiZWwobm9kZSk7XG4gICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWwgPSBpbmZvTGFiZWw7XG4gICAgICB9XG5cbiAgICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XG4gICAgICAvLyByZW1vdmUgYmVuZCBwb2ludHMgYmVmb3JlIGNvbGxhcHNlXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgICAgIGlmIChlZGdlLmhhc0NsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpKSB7XG4gICAgICAgICAgZWRnZS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcbiAgICAgICAgICBkZWxldGUgZWRnZS5fcHJpdmF0ZS5jbGFzc2VzWydlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cyddO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xuICAgIH0pO1xuXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5iZWZvcmVleHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgbm9kZS5yZW1vdmVEYXRhKFwiaW5mb0xhYmVsXCIpO1xuICAgIH0pO1xuXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5hZnRlcmV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICBjeS5ub2RlcygpLnVwZGF0ZUNvbXBvdW5kQm91bmRzKCk7XG4gICAgICAvL0Rvbid0IHNob3cgY2hpbGRyZW4gaW5mbyB3aGVuIHRoZSBjb21wbGV4IG5vZGUgaXMgZXhwYW5kZWRcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnY29udGVudCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHNiZ25TdHlsZVNoZWV0ID0gY3l0b3NjYXBlLnN0eWxlc2hlZXQoKVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICAgICAndGV4dC1vcGFjaXR5JzogMSxcbiAgICAgICAgICAgICdvcGFjaXR5JzogMSxcbiAgICAgICAgICAgICdwYWRkaW5nLWxlZnQnOiAwLFxuICAgICAgICAgICAgJ3BhZGRpbmctcmlnaHQnOiAwLFxuICAgICAgICAgICAgJ3BhZGRpbmctdG9wJzogMCxcbiAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6IDBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50XCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAncGFkZGluZy1sZWZ0JzogZ2V0Q29tcG91bmRQYWRkaW5ncyxcbiAgICAgICAgICAgICdwYWRkaW5nLXJpZ2h0JzogZ2V0Q29tcG91bmRQYWRkaW5ncyxcbiAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6IGdldENvbXBvdW5kUGFkZGluZ3MsXG4gICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiBnZXRDb21wb3VuZFBhZGRpbmdzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9jbG9uZW1hcmtlcl1bY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBpbWdQYXRoICsgJy9jbG9uZV9iZy5wbmcnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teSc6ICcxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXdpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1maXQnOiAnbm9uZScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdjbG9uZW1hcmtlcicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lTaGFwZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbGVtZW50Q29udGVudChlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdwZXJ0dXJiaW5nIGFnZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgLTAuNSwgMCwgIC0xLCAxLCAgIDEsIDEsICAgMC41LCAwLCAxLCAtMSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3RhZyddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIDAuMjUsIC0xLCAgIDEsIDAsICAgIDAuMjUsIDEsICAgIC0xLCAxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDMuMjUsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMCxcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAndGV4dC1tYXJnaW4teScgOiAtMSAqIG9wdGlvbnMuZXh0cmFDb21wYXJ0bWVudFBhZGRpbmdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50W2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAncGFkZGluZy10b3AnOiBnZXRDb21wb3VuZFBhZGRpbmdzKCkgKyBvcHRpb25zLmV4dHJhQ29tcGFydG1lbnRQYWRkaW5nLFxuICAgICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogZ2V0Q29tcG91bmRQYWRkaW5ncygpICsgb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtiYm94XVtjbGFzc11bY2xhc3MhPSdjb21wbGV4J11bY2xhc3MhPSdjb21wYXJ0bWVudCddW2NsYXNzIT0nc3VibWFwJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKGJib3gudyknLFxuICAgICAgICAgICAgJ2hlaWdodCc6ICdkYXRhKGJib3guaCknXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzYsXG4gICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ2Rhc2hlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxuICAgICAgICAgICAgJ3dpZHRoJzogMS4yNSxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6YWN0aXZlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnOCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2FyZGluYWxpdHkgPiAwXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RleHQtcm90YXRpb24nOiAnYXV0b3JvdGF0ZScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLXNoYXBlJzogJ3JlY3RhbmdsZScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItb3BhY2l0eSc6ICcxJyxcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci13aWR0aCc6ICcxJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtY29sb3InOiAnd2hpdGUnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1vcGFjaXR5JzogJzEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdjb25zdW1wdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEN5QXJyb3dTaGFwZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctc2hhcGUnOiAnbm9uZSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J2luaGliaXRpb24nXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImNvcmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtb3BhY2l0eSc6ICcwLjInLCAnc2VsZWN0aW9uLWJveC1ib3JkZXItY29sb3InOiAnI2Q2NzYxNCdcbiAgICAgICAgICB9KTtcbn07XG4iLCIvKlxuICogUmVuZGVyIHNiZ24gc3BlY2lmaWMgc2hhcGVzIHdoaWNoIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGN5dG9zY2FwZS5qcyBjb3JlXG4gKi9cblxudmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xuXG52YXIgY3lNYXRoID0gY3l0b3NjYXBlLm1hdGg7XG52YXIgY3lCYXNlTm9kZVNoYXBlcyA9IGN5dG9zY2FwZS5iYXNlTm9kZVNoYXBlcztcbnZhciBjeVN0eWxlUHJvcGVydGllcyA9IGN5dG9zY2FwZS5zdHlsZVByb3BlcnRpZXM7XG52YXIgY3lCYXNlQXJyb3dTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZUFycm93U2hhcGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICQkID0gY3l0b3NjYXBlO1xuICBcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanMgYW5kIG1vZGlmaWVkXG4gIHZhciBkcmF3Um91bmRSZWN0YW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzICl7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gcmFkaXVzIHx8IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyggd2lkdGgsIGhlaWdodCApO1xuXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cblxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcbiAgICBjb250ZXh0Lm1vdmVUbyggeCwgeSAtIGhhbGZIZWlnaHQgKTtcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCArIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCwgeSArIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCAtIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxuICAgIGNvbnRleHQuYXJjVG8oIHggLSBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4LCB5IC0gaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzICk7XG4gICAgLy8gSm9pbiBsaW5lXG4gICAgY29udGV4dC5saW5lVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XG5cblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gIH07XG4gIFxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qc1xuICB2YXIgZHJhd1BvbHlnb25QYXRoID0gZnVuY3Rpb24oXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcG9pbnRzICl7XG5cbiAgICB2YXIgaGFsZlcgPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIID0gaGVpZ2h0IC8gMjtcblxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XG5cbiAgICBjb250ZXh0Lm1vdmVUbyggeCArIGhhbGZXICogcG9pbnRzWzBdLCB5ICsgaGFsZkggKiBwb2ludHNbMV0gKTtcblxuICAgIGZvciggdmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aCAvIDI7IGkrKyApe1xuICAgICAgY29udGV4dC5saW5lVG8oIHggKyBoYWxmVyAqIHBvaW50c1sgaSAqIDJdLCB5ICsgaGFsZkggKiBwb2ludHNbIGkgKiAyICsgMV0gKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9O1xuICBcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduLnNiZ25TaGFwZXMgPSB7XG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxuICAgICdwcm9jZXNzJzogdHJ1ZSxcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICdhc3NvY2lhdGlvbic6IHRydWVcbiAgfTtcblxuICB2YXIgdG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSAkJC5zYmduLnRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXG4gIH07XG5cbiAgJCQuc2Jnbi5hZGRQb3J0UmVwbGFjZW1lbnRJZkFueSA9IGZ1bmN0aW9uIChub2RlLCBlZGdlUG9ydCkge1xuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XG4gICAgdmFyIHBvc1kgPSBub2RlLnBvc2l0aW9uKCkueTtcbiAgICBpZiAodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICAgIGlmIChwb3J0LmlkID09IGVkZ2VQb3J0KSB7XG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XG4gICAgICAgICAgcG9zWSA9IHBvc1kgKyBwb3J0LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xuICB9XG4gIDtcblxuICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHBvaW50cykge1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHBvcnRZID0gcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgY2VudGVyWTtcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxuICAgICAgICAgICAgICBwb2ludHMsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgcGFkZGluZyk7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKGNsb3Nlc3RQb2ludFswXSwgY2xvc2VzdFBvaW50WzFdKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG5cbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xuICB2YXIgc3RhdGVWYXJSYWRpdXMgPSAxNTtcbiAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyA9IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLFxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcblxuICAgIHZhciB1cFdpZHRoID0gMCwgZG93bldpZHRoID0gMDtcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XG4gICAgdmFyIGJlZ2luUG9zWSA9IGhlaWdodCAvIDIsIGJlZ2luUG9zWCA9IHdpZHRoIC8gMjtcblxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gc3RhdGUuYmJveC55O1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZO1xuXG4gICAgICBpZiAocmVsYXRpdmVZUG9zIDwgMCkge1xuICAgICAgICBpZiAodXBXaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgLSBiZWdpblBvc1k7XG5cbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1cFdpZHRoID0gdXBXaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcbiAgICAgIH0gZWxzZSBpZiAocmVsYXRpdmVZUG9zID4gMCkge1xuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyBkb3duV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcbiAgICAgICAgICBzdGF0ZUNlbnRlclkgPSBjZW50ZXJZICsgYmVnaW5Qb3NZO1xuXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XG5cbiAgICAgICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG93bldpZHRoID0gZG93bldpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xuICAgICAgfVxuICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XG5cbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcbiAgICAgIHN0YXRlLmJib3gueCA9IChzdGF0ZUNlbnRlclggLSBjZW50ZXJYKSAqIDEwMCAvIG5vZGUud2lkdGgoKTtcbiAgICAgIHN0YXRlLmJib3gueSA9IChzdGF0ZUNlbnRlclkgLSBjZW50ZXJZKSAqIDEwMCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xuICAgIHZhciBzdGF0ZVZhbHVlID0gdGV4dFByb3Auc3RhdGUudmFsdWUgfHwgJyc7XG4gICAgdmFyIHN0YXRlVmFyaWFibGUgPSB0ZXh0UHJvcC5zdGF0ZS52YXJpYWJsZSB8fCAnJztcblxuICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGVWYWx1ZSArIChzdGF0ZVZhcmlhYmxlXG4gICAgICAgICAgICA/IFwiQFwiICsgc3RhdGVWYXJpYWJsZVxuICAgICAgICAgICAgOiBcIlwiKTtcblxuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XG5cbiAgICB0ZXh0UHJvcC5mb250ID0gZm9udFNpemUgKyBcInB4IEFyaWFsXCI7XG4gICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZUxhYmVsO1xuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3SW5mb1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3ApIHtcbiAgICB2YXIgZm9udFNpemUgPSA5OyAvLyBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcbiAgICB0ZXh0UHJvcC5jb2xvciA9IFwiIzBmMGYwZlwiO1xuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3AsIHRydW5jYXRlKSB7XG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XG4gICAgY29udGV4dC5mb250ID0gdGV4dFByb3AuZm9udDtcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dFByb3AuY29sb3I7XG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0ZXh0UHJvcC5vcGFjaXR5O1xuICAgIHZhciB0ZXh0O1xuICAgIFxuICAgIHRleHRQcm9wLmxhYmVsID0gdGV4dFByb3AubGFiZWwgfHwgJyc7XG4gICAgXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XG4gICAgICB0ZXh0ID0gdGV4dFByb3AubGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICBjb250ZXh0LmZvbnQgPSBvbGRGb250O1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xuICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgfTtcblxuICBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UgPSBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhwb2ludDFbMF0gLSBwb2ludDJbMF0sIDIpICsgTWF0aC5wb3cocG9pbnQxWzFdIC0gcG9pbnQyWzFdLCAyKTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcbiAgfTtcblxuICAkJC5zYmduLmNvbG9ycyA9IHtcbiAgICBjbG9uZTogXCIjYTlhOWE5XCIsXG4gICAgYXNzb2NpYXRpb246IFwiIzZCNkI2QlwiLFxuICAgIHBvcnQ6IFwiIzZCNkI2QlwiXG4gIH07XG5cblxuICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpIHtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XG5cbiAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXG4gICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dCB8fCAnJztcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcbiAgfTtcblxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCB0b3BcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGgsIGhlaWdodCAtIGNvcm5lclJhZGl1cyAvIDMsIFswLCAtMV0sXG4gICAgICAgICAgICBwYWRkaW5nKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXG4gICAgaWYgKGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgcG9pbnRzLFxuICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXMsIGNvcm5lclJhZGl1cywgWzAsIC0xXSxcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL2NoZWNrIGVsbGlwc2VzXG4gICAgdmFyIGNoZWNrSW5FbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcbiAgICAgIHggLT0gY2VudGVyWDtcbiAgICAgIHkgLT0gY2VudGVyWTtcblxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICB5IC89IChoZWlnaHQgLyAyICsgcGFkZGluZyk7XG5cbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcbiAgICAgICAgICAgIGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXG4gICAgaWYgKGNoZWNrSW5FbGxpcHNlKHgsIHksXG4gICAgICAgICAgICBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjb3JuZXJSYWRpdXMgKiAyLCBjb3JuZXJSYWRpdXMgKiAyLCBwYWRkaW5nKSkge1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxuICAvL2hhdmluZyBvcGFxdWUgbm9kZXMgd2hpY2ggaGF2ZSBzdGF0ZSBhbmQgaW5mbyBib3hlcyBnaXZlcyB1bnBsZWFzZW50IHJlc3VsdHMuXG4gICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XG4gICAgaWYgKHBhcmVudE9wYWNpdHkgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYShcIlxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzFdICsgXCIsXCJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMl0gKyBcIixcIlxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICAvL3ZhciBjb3JuZXJSYWRpdXMgPSAkJC5tYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCBoYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCAwLCAtaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBKb2luIGxpbmVcbiAgICBjb250ZXh0LmxpbmVUbygwLCAtaGFsZkhlaWdodCk7XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXgsIC15KTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbCA9IGZ1bmN0aW9uIChcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuXG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgIHZhciBtYXJrZXJCZWdpblggPSAtMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDA7XG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcblxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgfVxuICB9XG4gIDtcblxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IDA7XG4gICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XG5cbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xuICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgTWF0aC5QSSAvIDYsIDMgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhd1BhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUgPSBmdW5jdGlvbiAoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAwKTtcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgY29udGV4dC5saW5lVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xuXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcztcbiAgICBpZiAoc2JnbkNsYXNzICYmIHNiZ25DbGFzcy5pbmRleE9mKFwibXVsdGltZXJcIikgIT0gLTEpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxuICAvL2NvbXBsZXgncyB3aWR0aCBvciBoZWlnaHQgaXMgY2hhbmdlZFxuICAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzID0gZnVuY3Rpb24gKGNvcm5lckxlbmd0aCwgd2lkdGgsIGhlaWdodCkge1xuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxuICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcbiAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xuXG4gICAgdmFyIGNvbXBsZXhQb2ludHMgPSBbLTEgKyBjcFgsIC0xLCAtMSwgLTEgKyBjcFksIC0xLCAxIC0gY3BZLCAtMSArIGNwWCxcbiAgICAgIDEsIDEgLSBjcFgsIDEsIDEsIDEgLSBjcFksIDEsIC0xICsgY3BZLCAxIC0gY3BYLCAtMV07XG5cbiAgICByZXR1cm4gY29tcGxleFBvaW50cztcbiAgfTtcblxuICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcbiAgICAgIHZhciBwb3J0WCA9IHBvcnQueCAqIHdpZHRoIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICBwb3J0WCwgcG9ydFksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwb3J0WCwgcG9ydFkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMucG9ydDtcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc291cmNlIGFuZCBzaW5rJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnY29tcGxleCcpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnZGlzc29jaWF0aW9uJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzaW1wbGUgY2hlbWljYWwnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3Vuc3BlY2lmaWVkIGVudGl0eScpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnb21pdHRlZCBwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCd1bmNlcnRhaW4gcHJvY2VzcycpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubGluZVN0eWxlLmVudW1zLnB1c2goJ3Byb2R1Y3Rpb24nKTtcblxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5hcnJvd1NoYXBlLmVudW1zLnB1c2goJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduQXJyb3dTaGFwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY3lCYXNlQXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lCYXNlQXJyb3dTaGFwZXNbJ3RyaWFuZ2xlLXRlZSddKTtcbiAgICBjeUJhc2VBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xuICAgICAgLTAuMTgsIC0wLjQzLFxuICAgICAgMC4xOCwgLTAuNDNcbiAgICBdO1xuICB9O1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUoY29udGV4dCwgbm9kZSwgdGhpcy5wb2ludHMpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBub2RlWCxcbiAgICAgICAgICAgICAgICBub2RlWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10pO1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBzYmduQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuXG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXSA9IHtcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG5cbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzWydhc3NvY2lhdGlvbiddID0ge1xuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0ID0gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJkaXNzb2NpYXRpb25cIl0gPSB7XG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDQsIGhlaWdodCAvIDQpO1xuXG4gICAgICAgIC8vIEF0IG9yaWdpbiwgcmFkaXVzIDEsIDAgdG8gMnBpXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDAsIE1hdGguUEkgKiAyICogMC45OTksIGZhbHNlKTsgLy8gKjAuOTk5IGIvYyBjaHJvbWUgcmVuZGVyaW5nIGJ1ZyBvbiBmdWxsIGNpcmNsZVxuXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUoNCAvIHdpZHRoLCA0IC8gaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3UG9ydHNUb0VsbGlwc2VTaGFwZShjb250ZXh0LCBub2RlKTtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKS0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xuXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxuICAgICAgICAgICAgICAgIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IChub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSAobm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpKSArIHRocmVzaG9sZDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIDtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcblxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxuICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXG4gICAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyxcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcblxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIHB0cyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcblxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMl0sIHB0c1szXSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zb3VyY2VBbmRTaW5rKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUsXG4gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50XG4gICAgfTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdFbGxpcHNlID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vY29udGV4dC5maWxsKCk7XG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcbiAgICB1bnNwZWNpZmllZEVudGl0eTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IC0xICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xuXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCA1ICogTWF0aC5QSSAvIDYpO1xuXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgfVxuICAgIH0sXG4gICAgc291cmNlQW5kU2luazogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG4gICAgfSxcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWCA9IGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWCA9IGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcblxuICAgICAgICBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBmaXJzdENpcmNsZUNlbnRlclgsIGZpcnN0Q2lyY2xlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG5cbiAgICAgICAgc2ltcGxlQ2hlbWljYWxSaWdodENsb25lKGNvbnRleHQsIHNlY29uZENpcmNsZUNlbnRlclgsIHNlY29uZENpcmNsZUNlbnRlclksXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAvIDQgKiBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBjb3JuZXJSYWRpdXMgLyAyO1xuXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LCBjbG9uZVgsIGNsb25lWSwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIHJlY1BvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICB9XG4gICAgfSxcbiAgICBwZXJ0dXJiaW5nQWdlbnQ6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBoZWlnaHQgLyA4O1xuXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTUgLyA2LCAtMSwgNSAvIDYsIC0xLCAxLCAxLCAtMSwgMV07XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHJlbmRlcmVyLmRyYXdQb2x5Z29uKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xuXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcblxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLCBjb3JuZXJSYWRpdXMsIG9wYWNpdHkpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbWFjcm9tb2xlY3VsZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpO1xuICAgIH0sXG4gICAgY29tcGxleDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XG4gICAgICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAqIGNwWSAvIDI7XG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XG5cbiAgICAgICAgdmFyIG1hcmtlclBvaW50cyA9IFstMSwgLTEsIDEsIC0xLCAxIC0gY3BYLCAxLCAtMSArIGNwWCwgMV07XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG5cbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcbiAgICBpZiAocG9ydHMubGVuZ3RoIDwgMClcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcbiAgICAgICAgcmV0dXJuIGN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcbiAgICAgICAgICAgICAgICB4LCB5LCBwb3J0LnggKiB3aWR0aCAvIDEwMCArIG5vZGVYLCBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBub2RlWSwgMSwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfTtcblxuICAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCwgaW50ZXJzZWN0aW9ucykge1xuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcbiAgICB2YXIgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XG4gICAgICB2YXIgY2hlY2tQb2ludCA9IFtpbnRlcnNlY3Rpb25zW2ldLCBpbnRlcnNlY3Rpb25zW2kgKyAxXV07XG4gICAgICB2YXIgZGlzdGFuY2UgPSBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UocG9pbnQsIGNoZWNrUG9pbnQpO1xuXG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2xvc2VzdEludGVyc2VjdGlvbjtcbiAgfTtcblxuICAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZSA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBub2RlWCwgbm9kZVksIGNvcm5lclJhZGl1cykge1xuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xuXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzLCB3ZSBoYXZlIG9ubHkgdHdvIGFyY3MgZm9yXG4gICAgLy9udWNsZWljIGFjaWQgZmVhdHVyZXNcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBMZWZ0XG4gICAge1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xuICB9O1xuXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxuICAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5Miwgbm9kZVgsIG5vZGVZLCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpIHtcblxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIHN0cmFpZ2h0IGxpbmUgc2VnbWVudHNcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cbiAgICB7XG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcblxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50c1xuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xuXG4gICAgLy8gVG9wIExlZnRcbiAgICB7XG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wTGVmdENlbnRlclgsIHRvcExlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gdG9wTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9wIFJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgdG9wUmlnaHRDZW50ZXJYLCB0b3BSaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BSaWdodENlbnRlclkpIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBSaWdodFxuICAgIHtcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gTGVmdFxuICAgIHtcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSA9IGZ1bmN0aW9uIChcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xuXG4gICAgdmFyIHcgPSB3aWR0aCAvIDIgKyBwYWRkaW5nO1xuICAgIHZhciBoID0gaGVpZ2h0IC8gMiArIHBhZGRpbmc7XG4gICAgdmFyIGFuID0gY2VudGVyWDtcbiAgICB2YXIgYm4gPSBjZW50ZXJZO1xuXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XG5cbiAgICB2YXIgbSA9IGRbMV0gLyBkWzBdO1xuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcbiAgICB2YXIgYSA9IGggKiBoICsgdyAqIHcgKiBtICogbTtcbiAgICB2YXIgYiA9IC0yICogYW4gKiBoICogaCArIDIgKiBtICogbiAqIHcgKiB3IC0gMiAqIGJuICogbSAqIHcgKiB3O1xuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXG4gICAgICAgICAgICBibiAqIGJuICogdyAqIHcgLSBoICogaCAqIHcgKiB3O1xuXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xuXG4gICAgaWYgKGRpc2NyaW1pbmFudCA8IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xuICAgIHZhciB0MiA9ICgtYiAtIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XG5cbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XG4gICAgdmFyIHhNYXggPSBNYXRoLm1heCh0MSwgdDIpO1xuXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xuICAgIHZhciB5TWF4ID0gbSAqIHhNYXggLSBtICogeDIgKyB5MjtcblxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XG4gIH07XG5cbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcblxuICAgIHZhciBpbnRlcnNlY3Rpb25zID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xuXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiICYmIHN0YXRlQ291bnQgPCAyKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBwYWRkaW5nKTtcblxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChzdGF0ZUludGVyc2VjdExpbmVzKTtcblxuICAgICAgICBzdGF0ZUNvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIHZhciBpbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XG5cbiAgICAgICAgaWYgKGluZm9JbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xuXG4gICAgICAgIGluZm9Db3VudCsrO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgdmFyIHBhZGRpbmcgPXBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuXG4gICAgdmFyIHN0YXRlQ291bnQgPSAwLCBpbmZvQ291bnQgPSAwO1xuLy8gICAgdGhyZXNob2xkID0gcGFyc2VGbG9hdCh0aHJlc2hvbGQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBwYXJzZUZsb2F0KHN0YXRlLmJib3guaCkgKyB0aHJlc2hvbGQ7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XG5cbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHN0YXRlQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcblxuICAgICAgICBpZiAoaW5mb0NoZWNrUG9pbnQgPT0gdHJ1ZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpbmZvQ291bnQrKztcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XG4gICAgaWYgKHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59O1xuIiwiLypcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxuICovXG5cbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcbiAgICAvL3RoZSBsaXN0IG9mIHRoZSBlbGVtZW50IGNsYXNzZXMgaGFuZGxlZCBieSB0aGUgdG9vbFxuICAgIGhhbmRsZWRFbGVtZW50czoge1xuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAgICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlLFxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxuICAgICAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxuICAgICAgICAnYXNzb2NpYXRpb24nOiB0cnVlLFxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXG4gICAgICAgICd0YWcnOiB0cnVlLFxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXG4gICAgICAgICdtb2R1bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXG4gICAgICAgICdpbmhpYml0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxuICAgICAgICAnZXF1aXZhbGVuY2UgYXJjJzogdHJ1ZSxcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXG4gICAgICAgICdub3Qgb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnYW5kJzogdHJ1ZSxcbiAgICAgICAgJ29yJzogdHJ1ZSxcbiAgICAgICAgJ25vdCc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxuICAgIH0sXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcbiAgICAgICAgJ2Fzc29jaWF0aW9uJywgJ2Rpc3NvY2lhdGlvbicsICdwaGVub3R5cGUnXSxcbiAgICAgIFxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXG4gICAgZ2V0VG9wTW9zdE5vZGVzOiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByb290cztcbiAgICB9LFxuICAgIC8vVGhpcyBtZXRob2QgY2hlY2tzIGlmIGFsbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYXNzdW1pbmcgdGhhdCB0aGUgc2l6ZSBcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gbm9kZXNbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEoXCJwYXJlbnRcIikgIT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgbW92ZU5vZGVzOiBmdW5jdGlvbihwb3NpdGlvbkRpZmYsIG5vZGVzLCBub3RDYWxjVG9wTW9zdE5vZGVzKSB7XG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0b3BNb3N0Tm9kZXNbaV07XG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XG4gICAgICAgIG5vZGUucG9zaXRpb24oe1xuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xuICAgICAgdmFyIHBhbiA9IGN5LnBhbigpO1xuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XG5cbiAgICAgIHZhciB4ID0gKHJlbmRlcmVkUG9zaXRpb24ueCAtIHBhbi54KSAvIHpvb207XG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG4gICAgXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcbiAgICBnZXRQcm9jZXNzZXNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qoc2VsZWN0ZWRFbGVzKTtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkRWxlcztcbiAgICB9LFxuICAgIGdldE5laWdoYm91cnNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZk5vZGVzKHNlbGVjdGVkRWxlcyk7XG4gICAgICAgIHJldHVybiBlbGVzVG9IaWdobGlnaHQ7XG4gICAgfSxcbiAgICBnZXROZWlnaGJvdXJzT2ZOb2RlczogZnVuY3Rpb24oX25vZGVzKXtcbiAgICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICAgIG5vZGVzID0gbm9kZXMuYWRkKG5vZGVzLnBhcmVudHMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikpO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgdmFyIG5laWdoYm9yaG9vZEVsZXMgPSBub2Rlcy5uZWlnaGJvcmhvb2QoKTtcbiAgICAgICAgdmFyIGVsZXNUb1JldHVybiA9IG5vZGVzLmFkZChuZWlnaGJvcmhvb2RFbGVzKTtcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIHJldHVybiBlbGVzVG9SZXR1cm47XG4gICAgfSxcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cucGFyZW50cygpKTtcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3MhPSdwcm9jZXNzJ11cIik7XG4gICAgICAgIC8vIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XG5cbiAgICAgICAgdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA9PT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xuXG4gICAgICAgIC8vYWRkIHBhcmVudHNcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5wYXJlbnRzKCkpO1xuICAgICAgICAvL2FkZCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcblxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XG4gICAgfSxcbiAgICBleHRlbmRSZW1haW5pbmdOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzVG9GaWx0ZXIsIGFsbE5vZGVzKXtcbiAgICAgICAgbm9kZXNUb0ZpbHRlciA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0ZpbHRlcik7XG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcbiAgICAgICAgbm9kZXNUb1Nob3cgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9TaG93KTtcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xuICAgIH0sXG4gICAgZ2V0UHJvY2Vzc2VzT2ZOb2RlczogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFZGdlcyA9IGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWRnZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcblxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZGVsZXRlTm9kZXNTbWFydDogZnVuY3Rpb24gKF9ub2Rlcykge1xuICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gICAgICBcbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gICAgICB2YXIgbm9kZXNOb3RUb0tlZXAgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0tlZXApO1xuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgICAgZWxlcy5yZXN0b3JlKCk7XG4gICAgICAgIHJldHVybiBlbGVzO1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xuICAgIFxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZ2V0Q3lTaGFwZTogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BoZW5vdHlwZScpIHtcbiAgICAgICAgICAgIHJldHVybiAnaGV4YWdvbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZScgfHwgX2NsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBfY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnIHx8IF9jbGFzcyA9PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NsYXNzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XG4gICAgfSxcbiAgICBnZXRDeUFycm93U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdpbmhpYml0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzdGltdWxhdGlvbicgfHwgX2NsYXNzID09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICB9LFxuICAgIGdldEVsZW1lbnRDb250ZW50OiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGhlbm90eXBlJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ2xhYmVsJykpe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZWxlLmRhdGEoJ2luZm9MYWJlbCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnYW5kJykge1xuICAgICAgICAgICAgY29udGVudCA9ICdBTkQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb3InKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ09SJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ25vdCcpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTk9UJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnXFxcXFxcXFwnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJz8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS53aWR0aCgpIHx8IGVsZS5kYXRhKCdiYm94JykudztcblxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcbiAgICAgICAgICAgIHdpZHRoOiAoIF9jbGFzcz09KCdjb21wbGV4JykgfHwgX2NsYXNzPT0oJ2NvbXBhcnRtZW50JykgKT90ZXh0V2lkdGggKiAyOnRleHRXaWR0aFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb250ID0gdGhpcy5nZXRMYWJlbFRleHRTaXplKGVsZSkgKyBcInB4IEFyaWFsXCI7XG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcbiAgICB9LFxuICAgIGdldExhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJykge1xuICAgICAgICByZXR1cm4gMjA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUsIDEuNSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdjb21wbGV4JyB8fCBfY2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgcmV0dXJuIDE2O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xuXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcbiAgICB9LFxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXG4gICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxuICAgICAgKi9cbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcbiAgICAgICAqL1xuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaW5mb0xhYmVsID0gXCJcIjtcbiAgICAgIC8qXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XG4gICAgICAgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgIHZhciBjaGlsZEluZm8gPSB0aGlzLmdldEluZm9MYWJlbChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XG4gICAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xuICAgICAgICB9XG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XG4gICAgICB9XG5cbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcbiAgICAgIHJldHVybiBpbmZvTGFiZWw7XG4gICAgfSxcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogQ2hlY2sgdGhlIGxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxuICAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxuICAgICAgKi9cbiAgICAgIHZhciBsYWJlbCA9IG5vZGUuZGF0YSgnbGFiZWwnKTtcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcbiAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcbiAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcblxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XG5cbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xuICAgIH0sXG4gICAgXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudFV0aWxpdGllcztcbiIsIi8qXG4gKiBGaWxlIFV0aWxpdGllczogVG8gYmUgdXNlZCBvbiByZWFkL3dyaXRlIGZpbGUgb3BlcmF0aW9uXG4gKi9cblxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcbnZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdWktdXRpbGl0aWVzJyk7XG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xudmFyIHVwZGF0ZUdyYXBoID0gZ3JhcGhVdGlsaXRpZXMudXBkYXRlR3JhcGguYmluZChncmFwaFV0aWxpdGllcyk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBzYXZlQXMgPSBsaWJzLnNhdmVBcztcblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBTdGFydFxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYyNDU3NjcvY3JlYXRpbmctYS1ibG9iLWZyb20tYS1iYXNlNjQtc3RyaW5nLWluLWphdmFzY3JpcHRcbmZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKSB7XG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XG4gIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XG5cbiAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcbiAgdmFyIGJ5dGVBcnJheXMgPSBbXTtcblxuICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcbiAgICB2YXIgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XG5cbiAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuXG4gICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcblxuICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xuICB9XG5cbiAgdmFyIGJsb2IgPSBuZXcgQmxvYihieXRlQXJyYXlzLCB7dHlwZTogY29udGVudFR5cGV9KTtcbiAgcmV0dXJuIGJsb2I7XG59XG5cbmZ1bmN0aW9uIGxvYWRYTUxEb2MoZnVsbEZpbGVQYXRoKSB7XG4gIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHhodHRwID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcbiAgfVxuICB4aHR0cC5vcGVuKFwiR0VUXCIsIGZ1bGxGaWxlUGF0aCwgZmFsc2UpO1xuICB4aHR0cC5zZW5kKCk7XG4gIHJldHVybiB4aHR0cC5yZXNwb25zZVhNTDtcbn1cblxuLy8gU2hvdWxkIHRoaXMgYmUgZXhwb3NlZCBvciBzaG91bGQgdGhpcyBiZSBtb3ZlZCB0byB0aGUgaGVscGVyIGZ1bmN0aW9ucyBzZWN0aW9uP1xuZnVuY3Rpb24gdGV4dFRvWG1sT2JqZWN0KHRleHQpIHtcbiAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XG4gICAgdmFyIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XG4gICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcbiAgICBkb2MubG9hZFhNTCh0ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L3htbCcpO1xuICB9XG4gIHJldHVybiBkb2M7XG59XG4vLyBIZWxwZXIgZnVuY3Rpb25zIEVuZFxuXG5mdW5jdGlvbiBmaWxlVXRpbGl0aWVzKCkge31cbmZpbGVVdGlsaXRpZXMubG9hZFhNTERvYyA9IGxvYWRYTUxEb2M7XG5cbmZpbGVVdGlsaXRpZXMuc2F2ZUFzUG5nID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XG5cbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcbiAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9wbmdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5wbmdcIik7XG59O1xuXG5maWxlVXRpbGl0aWVzLnNhdmVBc0pwZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBqcGdDb250ZW50ID0gY3kuanBnKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xuXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXG4gIHZhciBiNjRkYXRhID0ganBnQ29udGVudC5zdWJzdHIoanBnQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsuanBnXCIpO1xufTtcblxuZmlsZVV0aWxpdGllcy5sb2FkU2FtcGxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGZvbGRlcnBhdGgpIHtcbiAgdWlVdGlsaXRpZXMuc3RhcnRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xuICBcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYSBzYW1wbGUgaXMgYmVpbmcgbG9hZGVkXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlXCIsIFsgZmlsZW5hbWUgXSApOyAvLyBBbGlhc2VzIGZvciBzYmdudml6TG9hZFNhbXBsZVN0YXJ0XG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVN0YXJ0XCIsIFsgZmlsZW5hbWUgXSApO1xuICBcbiAgLy8gbG9hZCB4bWwgZG9jdW1lbnQgdXNlIGRlZmF1bHQgZm9sZGVyIHBhdGggaWYgaXQgaXMgbm90IHNwZWNpZmllZFxuICB2YXIgeG1sT2JqZWN0ID0gbG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xuICBcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XG4gICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcbiAgICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVFbmRcIiwgWyBmaWxlbmFtZSBdICk7IC8vIFRyaWdnZXIgYW4gZXZlbnQgc2lnbmFsaW5nIHRoYXQgYSBzYW1wbGUgaXMgbG9hZGVkXG4gIH0sIDApO1xufTtcblxuLypcbiAgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiByZW1vdGVseSBkZWZpbmVkIHRvIGFkZCBzcGVjaWZpYyBiZWhhdmlvciB0aGF0IGlzbid0IGltcGxlbWVudGVkIGhlcmUuXG4gIGl0IGlzIGNvbXBsZXRlbHkgb3B0aW9uYWwuXG4gIHNpZ25hdHVyZTogY2FsbGJhY2sodGV4dFhtbClcbiovXG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxGaWxlID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGFuIGV4dGVybmFsIGZpbGUgaXMgYmVpbmcgbG9hZGVkXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZVwiLCBbIGZpbGUubmFtZSBdICk7IC8vIEFsaWFzZXMgZm9yIHNiZ252aXpMb2FkRmlsZVN0YXJ0XG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVTdGFydFwiLCBbIGZpbGUubmFtZSBdICk7IFxuICBcbiAgdmFyIHRleHRUeXBlID0gL3RleHQuKi87XG5cbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSB0aGlzLnJlc3VsdDtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpIGNhbGxiYWNrKHRleHQpO1xuICAgICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHRleHQpKSk7XG4gICAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XG4gICAgICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlRW5kXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy8gVHJpZ2dlciBhbiBldmVudCBzaWduYWxpbmcgdGhhdCBhIGZpbGUgaXMgbG9hZGVkXG4gICAgfSwgMCk7XG4gIH07XG5cbiAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG59O1xuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MVGV4dCA9IGZ1bmN0aW9uKHRleHREYXRhKXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHRleHREYXRhKSkpO1xuICAgICAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XG4gICAgfSwgMCk7XG5cbn07XG5cbmZpbGVVdGlsaXRpZXMuc2F2ZUFzU2Jnbm1sID0gZnVuY3Rpb24oZmlsZW5hbWUsIHJlbmRlckluZm8pIHtcbiAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKGZpbGVuYW1lLCByZW5kZXJJbmZvKTtcbiAgdmFyIGJsb2IgPSBuZXcgQmxvYihbc2Jnbm1sVGV4dF0sIHtcbiAgICB0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtODtcIixcbiAgfSk7XG4gIHNhdmVBcyhibG9iLCBmaWxlbmFtZSk7XG59O1xuZmlsZVV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVGV4dFRvSnNvbiA9IGZ1bmN0aW9uKHNiZ25tbFRleHQpe1xuICAgIHJldHVybiBzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3Qoc2Jnbm1sVGV4dCkpO1xufTtcblxuZmlsZVV0aWxpdGllcy5jcmVhdGVKc29uID0gZnVuY3Rpb24oanNvbil7XG4gICAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XG4gICAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdChzYmdubWxUZXh0KSk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsZVV0aWxpdGllcztcbiIsIi8qXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBzYmdudml6IGdyYXBoc1xuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxuZnVuY3Rpb24gZ3JhcGhVdGlsaXRpZXMoKSB7fVxuXG5ncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaCA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcbiAgY29uc29sZS5sb2coJ2N5IHVwZGF0ZSBjYWxsZWQnKTtcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInVwZGF0ZUdyYXBoU3RhcnRcIiApO1xuICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLnJlc2V0KCk7XG4vLyAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XG4gIH1cblxuICBjeS5zdGFydEJhdGNoKCk7XG4gIC8vIGNsZWFyIGRhdGFcbiAgY3kucmVtb3ZlKCcqJyk7XG4gIGN5LmFkZChjeUdyYXBoKTtcblxuICAvL2FkZCBwb3NpdGlvbiBpbmZvcm1hdGlvbiB0byBkYXRhIGZvciBwcmVzZXQgbGF5b3V0XG4gIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGN5R3JhcGgubm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgeFBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5iYm94Lng7XG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC55O1xuICAgIHBvc2l0aW9uTWFwW2N5R3JhcGgubm9kZXNbaV0uZGF0YS5pZF0gPSB7J3gnOiB4UG9zLCAneSc6IHlQb3N9O1xuICB9XG5cbiAgY3kubGF5b3V0KHtcbiAgICBuYW1lOiAncHJlc2V0JyxcbiAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwLFxuICAgIGZpdDogdHJ1ZSxcbiAgICBwYWRkaW5nOiA1MFxuICB9KTtcblxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjeS5lbmRCYXRjaCgpO1xuXG4gIC8vIFVwZGF0ZSB0aGUgc3R5bGVcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgLy8gSW5pdGlsaXplIHRoZSBiZW5kIHBvaW50cyBvbmNlIHRoZSBlbGVtZW50cyBhcmUgY3JlYXRlZFxuICBpZiAoY3kuZWRnZUJlbmRFZGl0aW5nICYmIGN5LmVkZ2VCZW5kRWRpdGluZygnaW5pdGlhbGl6ZWQnKSkge1xuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XG4gIH1cbiAgXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaEVuZFwiICk7XG59O1xuXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XG4gIC8vQXMgZGVmYXVsdCB1c2UgdGhlIGNvbXBvdW5kIHBhZGRpbmcgdmFsdWVcbiAgaWYgKCFwYWRkaW5nUGVyY2VudCkge1xuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcbiAgICBwYWRkaW5nUGVyY2VudCA9IHR5cGVvZiBjb21wb3VuZFBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBjb21wb3VuZFBhZGRpbmcuY2FsbCgpIDogY29tcG91bmRQYWRkaW5nO1xuICB9XG5cbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIHRvdGFsID0gMDtcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGhlTm9kZSA9IG5vZGVzW2ldO1xuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLndpZHRoKCkpO1xuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUuaGVpZ2h0KCkpO1xuICAgICAgbnVtT2ZTaW1wbGVzKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNhbGNfcGFkZGluZyA9IChwYWRkaW5nUGVyY2VudCAvIDEwMCkgKiBNYXRoLmZsb29yKHRvdGFsIC8gKDIgKiBudW1PZlNpbXBsZXMpKTtcbiAgaWYgKGNhbGNfcGFkZGluZyA8IDUpIHtcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xuICB9XG5cbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcbn07XG5cbmdyYXBoVXRpbGl0aWVzLnJlY2FsY3VsYXRlUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLy8gdGhpcy5jYWxjdWxhdGVkUGFkZGluZ3MgaXMgbm90IHdvcmtpbmcgaGVyZSBcbiAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHJlZmVyZW5jZSB3aXRoIHRoaXMuY2FsY3VsYXRlZFBhZGRpbmdzIG9uY2UgdGhlIHJlYXNvbiBpcyBmaWd1cmVkIG91dFxuICBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBoVXRpbGl0aWVzOyIsInZhciB0eHRVdGlsID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpO1xudmFyIGxpYnNiZ25qcyA9IHJlcXVpcmUoJ2xpYnNiZ24tanMnKTtcbnZhciByZW5kZXJFeHRlbnNpb24gPSBsaWJzYmduanMucmVuZGVyRXh0ZW5zaW9uO1xudmFyIHBrZ1ZlcnNpb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uOyAvLyBuZWVkIGluZm8gYWJvdXQgc2JnbnZpeiB0byBwdXQgaW4geG1sXG52YXIgcGtnTmFtZSA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpLm5hbWU7XG5cbnZhciBqc29uVG9TYmdubWwgPSB7XG4gICAgLypcbiAgICAgICAgdGFrZXMgcmVuZGVySW5mbyBhcyBhbiBvcHRpb25hbCBhcmd1bWVudC4gSXQgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gc2F2ZVxuICAgICAgICB0aGUgc3R5bGUgYW5kIGNvbG9ycyB0byB0aGUgcmVuZGVyIGV4dGVuc2lvbi4gU2VlIG5ld3QvYXBwLXV0aWxpdGllcyBnZXRBbGxTdHlsZXMoKVxuICAgICAgICBTdHJ1Y3R1cmU6IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoZSBtYXAgYmFja2dyb3VuZCBjb2xvcixcbiAgICAgICAgICAgIGNvbG9yczoge1xuICAgICAgICAgICAgICB2YWxpZFhtbFZhbHVlOiBjb2xvcl9pZFxuICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgICAgICBzdHlsZUtleTE6IHtcbiAgICAgICAgICAgICAgICAgICAgaWRMaXN0OiBsaXN0IG9mIHRoZSBub2RlcyBpZHMgdGhhdCBoYXZlIHRoaXMgc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHlsZUtleTI6IC4uLlxuICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKi9cbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbyl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xuICAgICAgICB2YXIgbWFwSUQgPSB0eHRVdGlsLmdldFhNTFZhbGlkSWQoZmlsZW5hbWUpO1xuICAgICAgICB2YXIgaGFzRXh0ZW5zaW9uID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNSZW5kZXJFeHRlbnNpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJJbmZvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGFzRXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIGhhc1JlbmRlckV4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL2FkZCBoZWFkZXJzXG4gICAgICAgIHhtbEhlYWRlciA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xuICAgICAgICB2YXIgc2JnbiA9IG5ldyBsaWJzYmduanMuU2Jnbih7eG1sbnM6ICdodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjMnfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibGlic2JnbmpzXCIsIGxpYnNiZ25qcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2JnblwiLCBzYmduKTtcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBsaWJzYmduanMuTWFwKHtsYW5ndWFnZTogJ3Byb2Nlc3MgZGVzY3JpcHRpb24nLCBpZDogbWFwSUR9KTtcbiAgICAgICAgaWYgKGhhc0V4dGVuc2lvbikgeyAvLyBleHRlbnNpb24gaXMgdGhlcmVcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBuZXcgbGlic2JnbmpzLkV4dGVuc2lvbigpO1xuICAgICAgICAgICAgaWYgKGhhc1JlbmRlckV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgIGV4dGVuc2lvbi5hZGQoc2VsZi5nZXRSZW5kZXJFeHRlbnNpb25TYmdubWwocmVuZGVySW5mbykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwLnNldEV4dGVuc2lvbihleHRlbnNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdseXBoTGlzdCA9IFtdO1xuICAgICAgICBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzQ2hpbGQoKSlcbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Z2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXAuYWRkR2x5cGgoZ2x5cGhMaXN0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbWFwLmFkZEFyYyhzZWxmLmdldEFyY1NiZ25tbCh0aGlzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNiZ24uc2V0TWFwKG1hcCk7XG4gICAgICAgIHJldHVybiB4bWxIZWFkZXIgKyBzYmduLnRvWE1MKCk7XG4gICAgfSxcblxuICAgIC8vIHNlZSBjcmVhdGVTYmdubWwgZm9yIGluZm8gb24gdGhlIHN0cnVjdHVyZSBvZiByZW5kZXJJbmZvXG4gICAgZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sIDogZnVuY3Rpb24ocmVuZGVySW5mbykge1xuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBtYWluIGNvbnRhaW5lclxuICAgICAgICB2YXIgcmVuZGVySW5mb3JtYXRpb24gPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckluZm9ybWF0aW9uKHsgaWQ6ICdyZW5kZXJJbmZvcm1hdGlvbicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiByZW5kZXJJbmZvLmJhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtTmFtZTogcGtnTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW1WZXJzaW9uOiBwa2dWZXJzaW9uIH0pO1xuXG4gICAgICAgIC8vIHBvcHVsYXRlIGxpc3Qgb2YgY29sb3JzXG4gICAgICAgIHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKCk7XG4gICAgICAgIGZvciAodmFyIGNvbG9yIGluIHJlbmRlckluZm8uY29sb3JzKSB7XG4gICAgICAgICAgICB2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5Db2xvckRlZmluaXRpb24oe2lkOiByZW5kZXJJbmZvLmNvbG9yc1tjb2xvcl0sIHZhbHVlOiBjb2xvcn0pO1xuICAgICAgICAgICAgbGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hZGRDb2xvckRlZmluaXRpb24oY29sb3JEZWZpbml0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJJbmZvcm1hdGlvbi5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb24obGlzdE9mQ29sb3JEZWZpbml0aW9ucyk7XG5cbiAgICAgICAgLy8gcG9wdWxhdGVzIHN0eWxlc1xuICAgICAgICB2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMoKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHJlbmRlckluZm8uc3R5bGVzKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSByZW5kZXJJbmZvLnN0eWxlc1trZXldO1xuICAgICAgICAgICAgdmFyIHhtbFN0eWxlID0gbmV3IHJlbmRlckV4dGVuc2lvbi5TdHlsZSh7aWQ6IHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChrZXkpLCBpZExpc3Q6IHN0eWxlLmlkTGlzdH0pO1xuICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogc3R5bGUucHJvcGVydGllcy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogc3R5bGUucHJvcGVydGllcy5mb250U3R5bGUsXG4gICAgICAgICAgICAgICAgZmlsbDogc3R5bGUucHJvcGVydGllcy5maWxsLCAvLyBmaWxsIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IHN0eWxlLnByb3BlcnRpZXMuc3Ryb2tlV2lkdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XG4gICAgICAgICAgICBsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoeG1sU3R5bGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZlN0eWxlcyhsaXN0T2ZTdHlsZXMpO1xuXG4gICAgICAgIHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcbiAgICB9LFxuXG4gICAgZ2V0R2x5cGhTYmdubWwgOiBmdW5jdGlvbihub2RlKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBub2RlQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcblxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogbm9kZS5fcHJpdmF0ZS5kYXRhLmlkLCBjbGFzc186IG5vZGVDbGFzc30pO1xuXG4gICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgZ2x5cGguY29tcGFydG1lbnRSZWYgPSBub2RlLl9wcml2YXRlLmRhdGEucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KClbMF07XG4gICAgICAgICAgICAgICAgaWYocGFyZW50Ll9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wYXJ0bWVudFwiKVxuICAgICAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICBpZih0eXBlb2YgbGFiZWwgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBnbHlwaC5zZXRMYWJlbChuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBsYWJlbH0pKTtcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGdseXBoLnNldENsb25lKG5ldyBsaWJzYmduanMuQ2xvbmVUeXBlKCkpO1xuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRHbHlwaEJib3gobm9kZSkpO1xuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBwb3J0cy5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xuICAgICAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyBwb3J0c1tpXS55ICogbm9kZS5oZWlnaHQoKSAvIDEwMDtcblxuICAgICAgICAgICAgZ2x5cGguYWRkUG9ydChuZXcgbGlic2JnbmpzLnBQb3J0KHtpZDogcG9ydHNbaV0uaWQsIHg6IHgsIHk6IHl9KSk7XG4gICAgICAgICAgICAvKnNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8cG9ydCBpZD0nXCIgKyBwb3J0c1tpXS5pZCtcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiOyovXG4gICAgICAgIH1cbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICB2YXIgYm94R2x5cGggPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3NbaV07XG4gICAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3NJZCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCtcIl9cIitpO1xuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBzdGF0ZXNhbmRpbmZvc0lkLCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG5vZGVDbGFzcyA9PT0gXCJjb21wbGV4XCIgfHwgbm9kZUNsYXNzID09PSBcInN1Ym1hcFwiKXtcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGdseXBoTWVtYmVyTGlzdCA9IHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhNZW1iZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGdseXBoLmFkZEdseXBoTWVtYmVyKGdseXBoTWVtYmVyTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnbHlwaExpc3QucHVzaChnbHlwaCk7XG5cbiAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIGdseXBoTGlzdDtcbiAgICB9LFxuXG4gICAgZ2V0QXJjU2Jnbm1sIDogZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcblxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXG4gICAgICAgIHZhciBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldDtcbiAgICAgICAgdmFyIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlO1xuXG4gICAgICAgIGlmIChhcmNTb3VyY2UgPT0gbnVsbCB8fCBhcmNTb3VyY2UubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnNvdXJjZTtcblxuICAgICAgICBpZiAoYXJjVGFyZ2V0ID09IG51bGwgfHwgYXJjVGFyZ2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS50YXJnZXQ7XG5cbiAgICAgICAgdmFyIGFyY0lkID0gZWRnZS5fcHJpdmF0ZS5kYXRhLmlkOyAvL2FyY1NvdXJjZSArIFwiLVwiICsgYXJjVGFyZ2V0O1xuICAgICAgICB2YXIgYXJjID0gbmV3IGxpYnNiZ25qcy5BcmMoe2lkOiBhcmNJZCwgc291cmNlOiBhcmNTb3VyY2UsIHRhcmdldDogYXJjVGFyZ2V0LCBjbGFzc186IGVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzc30pO1xuXG4gICAgICAgIGFyYy5zZXRTdGFydChuZXcgbGlic2JnbmpzLlN0YXJ0VHlwZSh7eDogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFgsIHk6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRZfSkpO1xuXG4gICAgICAgIC8vIEV4cG9ydCBiZW5kIHBvaW50cyBpZiBlZGdlQmVuZEVkaXRpbmdFeHRlbnNpb24gaXMgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3kuZWRnZUJlbmRFZGl0aW5nICYmIGN5LmVkZ2VCZW5kRWRpdGluZygnaW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgIHZhciBzZWdwdHMgPSBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmdldFNlZ21lbnRQb2ludHMoZWRnZSk7XG4gICAgICAgICAgaWYoc2VncHRzKXtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IHNlZ3B0cyAmJiBpIDwgc2VncHRzLmxlbmd0aDsgaSA9IGkgKyAyKXtcbiAgICAgICAgICAgICAgdmFyIGJlbmRYID0gc2VncHRzW2ldO1xuICAgICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xuXG4gICAgICAgICAgICAgIGFyYy5hZGROZXh0KG5ldyBsaWJzYmduanMuTmV4dFR5cGUoe3g6IGJlbmRYLCB5OiBiZW5kWX0pKTtcbiAgICAgICAgICAgICAgLy9zYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG5leHQgeT0nXCIgKyBiZW5kWSArIFwiJyB4PSdcIiArIGJlbmRYICsgXCInLz5cXG5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcmMuc2V0RW5kKG5ldyBsaWJzYmduanMuRW5kVHlwZSh7eDogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRYLCB5OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFl9KSk7XG5cbiAgICAgICAgcmV0dXJuIGFyYztcbiAgICB9LFxuXG4gICAgYWRkR2x5cGhCYm94IDogZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54IC0gd2lkdGgvMjtcbiAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgLSBoZWlnaHQvMjtcbiAgICAgICAgcmV0dXJuIG5ldyBsaWJzYmduanMuQmJveCh7eDogeCwgeTogeSwgdzogd2lkdGgsIGg6IGhlaWdodH0pO1xuICAgIH0sXG5cbiAgICBhZGRTdGF0ZUFuZEluZm9CYm94IDogZnVuY3Rpb24obm9kZSwgYm94R2x5cGgpe1xuICAgICAgICBib3hCYm94ID0gYm94R2x5cGguYmJveDtcblxuICAgICAgICB2YXIgeCA9IGJveEJib3gueCAvIDEwMCAqIG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIHkgPSBib3hCYm94LnkgLyAxMDAgKiBub2RlLmhlaWdodCgpO1xuXG4gICAgICAgIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyAoeCAtIGJveEJib3gudy8yKTtcbiAgICAgICAgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArICh5IC0gYm94QmJveC5oLzIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgbGlic2JnbmpzLkJib3goe3g6IHgsIHk6IHksIHc6IGJveEJib3gudywgaDogYm94QmJveC5ofSk7XG4gICAgfSxcblxuICAgIGFkZFN0YXRlQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcblxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogaWQsIGNsYXNzXzogJ3N0YXRlIHZhcmlhYmxlJ30pO1xuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgbGlic2JnbmpzLlN0YXRlVHlwZSgpO1xuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YWx1ZSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gbm9kZS5zdGF0ZS52YWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBzdGF0ZS52YXJpYWJsZSA9IG5vZGUuc3RhdGUudmFyaWFibGU7XG4gICAgICAgIGdseXBoLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKSk7XG5cbiAgICAgICAgcmV0dXJuIGdseXBoO1xuICAgIH0sXG5cbiAgICBhZGRJbmZvQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICd1bml0IG9mIGluZm9ybWF0aW9uJ30pO1xuICAgICAgICB2YXIgbGFiZWwgPSBuZXcgbGlic2JnbmpzLkxhYmVsKCk7XG4gICAgICAgIGlmKHR5cGVvZiBub2RlLmxhYmVsLnRleHQgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBsYWJlbC50ZXh0ID0gbm9kZS5sYWJlbC50ZXh0O1xuICAgICAgICBnbHlwaC5zZXRMYWJlbChsYWJlbCk7XG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSkpO1xuXG4gICAgICAgIHJldHVybiBnbHlwaDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25Ub1NiZ25tbDtcbiIsIi8qXG4gKiBMaXN0ZW4gZG9jdW1lbnQgZm9yIGtleWJvYXJkIGlucHV0cyBhbmQgZXhwb3J0cyB0aGUgdXRpbGl0aWVzIHRoYXQgaXQgbWFrZXMgdXNlIG9mXG4gKi9cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIga2V5Ym9hcmRJbnB1dFV0aWxpdGllcyA9IHtcbiAgaXNOdW1iZXJLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gKCBlLmtleUNvZGUgPj0gNDggJiYgZS5rZXlDb2RlIDw9IDU3ICkgfHwgKCBlLmtleUNvZGUgPj0gOTYgJiYgZS5rZXlDb2RlIDw9IDEwNSApO1xuICB9LFxuICBpc0RvdEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDE5MDtcbiAgfSxcbiAgaXNNaW51c1NpZ25LZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxMDkgfHwgZS5rZXlDb2RlID09PSAxODk7XG4gIH0sXG4gIGlzTGVmdEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM3O1xuICB9LFxuICBpc1JpZ2h0S2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzk7XG4gIH0sXG4gIGlzQmFja3NwYWNlS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gODtcbiAgfSxcbiAgaXNUYWJLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSA5O1xuICB9LFxuICBpc0VudGVyS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTM7XG4gIH0sXG4gIGlzSW50ZWdlckZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDdHJsT3JDb21tYW5kUHJlc3NlZChlKSB8fCB0aGlzLmlzTWludXNTaWduS2V5KGUpIHx8IHRoaXMuaXNOdW1iZXJLZXkoZSkgXG4gICAgICAgICAgICB8fCB0aGlzLmlzQmFja3NwYWNlS2V5KGUpIHx8IHRoaXMuaXNUYWJLZXkoZSkgfHwgdGhpcy5pc0xlZnRLZXkoZSkgfHwgdGhpcy5pc1JpZ2h0S2V5KGUpIHx8IHRoaXMuaXNFbnRlcktleShlKTtcbiAgfSxcbiAgaXNGbG9hdEZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSkgfHwgdGhpcy5pc0RvdEtleShlKTtcbiAgfSxcbiAgaXNDdHJsT3JDb21tYW5kUHJlc3NlZDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xuICB9XG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5pbnRlZ2VyLWlucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xuICAgIHJldHVybiBrZXlib2FyZElucHV0VXRpbGl0aWVzLmlzSW50ZWdlckZpZWxkSW5wdXQodmFsdWUsIGUpO1xuICB9KTtcbiAgXG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5mbG9hdC1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0Zsb2F0RmllbGRJbnB1dCh2YWx1ZSwgZSk7XG4gIH0pO1xuICBcbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuaW50ZWdlci1pbnB1dCwuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgbWluICAgPSAkKHRoaXMpLmF0dHIoJ21pbicpO1xuICAgIHZhciBtYXggICA9ICQodGhpcykuYXR0cignbWF4Jyk7XG4gICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKTtcbiAgICBcbiAgICBpZihtaW4gIT0gbnVsbCkge1xuICAgICAgbWluID0gcGFyc2VGbG9hdChtaW4pO1xuICAgIH1cbiAgICBcbiAgICBpZihtYXggIT0gbnVsbCkge1xuICAgICAgbWF4ID0gcGFyc2VGbG9hdChtYXgpO1xuICAgIH1cbiAgICBcbiAgICBpZihtaW4gIT0gbnVsbCAmJiB2YWx1ZSA8IG1pbikge1xuICAgICAgdmFsdWUgPSBtaW47XG4gICAgfVxuICAgIGVsc2UgaWYobWF4ICE9IG51bGwgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgIHZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBcbiAgICBpZihpc05hTih2YWx1ZSkpIHtcbiAgICAgIGlmKG1pbiAhPSBudWxsKSB7XG4gICAgICAgIHZhbHVlID0gbWluO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihtYXggIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IG1heDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgICQodGhpcykudmFsKFwiXCIgKyB2YWx1ZSk7XG4gIH0pO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcztcbiIsIi8qIFxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cbiAqL1xuXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcbn07XG5cbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xuICB0aGlzLmxpYnMgPSBsaWJzO1xufTtcblxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGlicztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzO1xuXG4iLCIvKiBcbiAqIFRoZXNlIGFyZSB0aGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZGlyZWN0bHkgdXRpbGl6ZWQgYnkgdGhlIHVzZXIgaW50ZXJhY3Rpb25zLlxuICogSWRlYWx5LCB0aGlzIGZpbGUgaXMganVzdCByZXF1aXJlZCBieSBpbmRleC5qc1xuICovXG5cbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcblxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG4vLyBIZWxwZXJzIHN0YXJ0XG5mdW5jdGlvbiBiZWZvcmVQZXJmb3JtTGF5b3V0KCkge1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xuXG4gIG5vZGVzLnJlbW92ZURhdGEoXCJwb3J0c1wiKTtcbiAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnRzb3VyY2VcIik7XG4gIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuXG4gIG5vZGVzLmRhdGEoXCJwb3J0c1wiLCBbXSk7XG4gIGVkZ2VzLmRhdGEoXCJwb3J0c291cmNlXCIsIFtdKTtcbiAgZWRnZXMuZGF0YShcInBvcnR0YXJnZXRcIiwgW10pO1xuXG4gIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXG4gIGN5LiQoJy5lZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xufTtcbi8vIEhlbHBlcnMgZW5kXG5cbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7fVxuXG4vLyBFeHBhbmQgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZXhwYW5kTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2Rlc1RvRXhwYW5kID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKG5vZGVzKTtcbiAgaWYgKG5vZGVzVG9FeHBhbmQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzVG9FeHBhbmQsXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kKG5vZGVzKTtcbiAgfVxufTtcblxuLy8gQ29sbGFwc2UgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlXCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlKG5vZGVzKTtcbiAgfVxufTtcblxuLy8gQ29sbGFwc2UgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5jb2xsYXBzZUNvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBjb21wbGV4ZXMgPSBjeS5ub2RlcyhcIltjbGFzcz0nY29tcGxleCddXCIpO1xuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhjb21wbGV4ZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBjb21wbGV4ZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KGNvbXBsZXhlcyk7XG4gIH1cbn07XG5cbi8vIEV4cGFuZCBhbGwgY29tcGxleGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygpLmZpbHRlcihcIltjbGFzcz0nY29tcGxleCddXCIpKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGFsbCBub2RlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5jb2xsYXBzZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2VSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEV4cGFuZCBhbGwgbm9kZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZXhwYW5kQWxsID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xuICBcbiAgdmFyIG5vZGVzID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKGN5Lm5vZGVzKCc6dmlzaWJsZScpKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIGhpZGVzIHRoZSByZXN1bHRpbmcgbGlzdC4gXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgXG4gIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcbiAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcblxuICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QuIFxuLy8gVGhlbiB1bmhpZGVzIHRoZSByZXN1bHRpbmcgbGlzdCBhbmQgaGlkZXMgb3RoZXJzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5zaG93Tm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgXG4gIHZhciBhbGxOb2RlcyA9IGN5LmVsZW1lbnRzKCk7XG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXMpO1xuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xuICBcbiAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xuICB9XG59O1xuXG4vLyBVbmhpZGVzIGFsbCBlbGVtZW50cy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKGN5LmVsZW1lbnRzKCkubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cygpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLnNob3coY3kuZWxlbWVudHMoKSk7XG4gIH1cbn07XG5cbi8vIFJlbW92ZXMgdGhlIGdpdmVuIGVsZW1lbnRzIGluIGEgc2ltcGxlIHdheS4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlID0gZnVuY3Rpb24oZWxlcykge1xuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB7XG4gICAgICBlbGVzOiBlbGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5yZW1vdmUoKTtcbiAgfVxufTtcblxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgcmVtb3ZlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxuLy8gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0ID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpO1xuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB7XG4gICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICBlbGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydChub2Rlcyk7XG4gIH1cbn07XG5cbi8vIEhpZ2hsaWdodHMgbmVpZ2hib3VycyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodE5laWdoYm91cnMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZOb2Rlcyhub2Rlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbn07XG5cbi8vIEZpbmRzIHRoZSBlbGVtZW50cyB3aG9zZSBsYWJlbCBpbmNsdWRlcyB0aGUgZ2l2ZW4gbGFiZWwgYW5kIGhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRob3NlIGVsZW1lbnRzLlxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2VhcmNoQnlMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG4gIGlmIChsYWJlbC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgdmFyIG5vZGVzVG9IaWdobGlnaHQgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgaWYgKGVsZS5kYXRhKFwibGFiZWxcIikgJiYgZWxlLmRhdGEoXCJsYWJlbFwiKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobGFiZWwpID49IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIGlmIChub2Rlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuXG4gIG5vZGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9IaWdobGlnaHQpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIG5vZGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KG5vZGVzVG9IaWdobGlnaHQpO1xuICB9XG59O1xuXG4vLyBIaWdobGlnaHRzIHByb2Nlc3NlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQoZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxufTtcblxuLy8gVW5oaWdobGlnaHRzIGFueSBoaWdobGlnaHRlZCBlbGVtZW50LiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5yZW1vdmVIaWdobGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cygpO1xuICB9XG59O1xuXG4vLyBQZXJmb3JtcyBsYXlvdXQgYnkgZ2l2ZW4gbGF5b3V0T3B0aW9ucy4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLiBIb3dldmVyLCBieSBzZXR0aW5nIG5vdFVuZG9hYmxlIHBhcmFtZXRlclxuLy8gdG8gYSB0cnV0aHkgdmFsdWUgeW91IGNhbiBmb3JjZSBhbiB1bmRhYmxlIGxheW91dCBvcGVyYXRpb24gaW5kZXBlbmRhbnQgb2YgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRPcHRpb25zLCBub3RVbmRvYWJsZSkge1xuICAvLyBUaGluZ3MgdG8gZG8gYmVmb3JlIHBlcmZvcm1pbmcgbGF5b3V0XG4gIGJlZm9yZVBlcmZvcm1MYXlvdXQoKTtcbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSB8fCBub3RVbmRvYWJsZSkgeyAvLyAnbm90VW5kb2FibGUnIGZsYWcgY2FuIGJlIHVzZWQgdG8gaGF2ZSBjb21wb3NpdGUgYWN0aW9ucyBpbiB1bmRvL3JlZG8gc3RhY2tcbiAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XG4gICAgICBvcHRpb25zOiBsYXlvdXRPcHRpb25zLFxuICAgICAgZWxlczogY3kuZWxlbWVudHMoKS5maWx0ZXIoJzp2aXNpYmxlJylcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQ3JlYXRlcyBhbiBzYmdubWwgZmlsZSBjb250ZW50IGZyb20gdGhlIGV4aXNpbmcgZ3JhcGggYW5kIHJldHVybnMgaXQuXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVNiZ25tbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xufTtcblxuLy8gQ29udmVydHMgZ2l2ZW4gc2Jnbm1sIGRhdGEgdG8gYSBqc29uIG9iamVjdCBpbiBhIHNwZWNpYWwgZm9ybWF0IFxuLy8gKGh0dHA6Ly9qcy5jeXRvc2NhcGUub3JnLyNub3RhdGlvbi9lbGVtZW50cy1qc29uKSBhbmQgcmV0dXJucyBpdC5cbm1haW5VdGlsaXRpZXMuY29udmVydFNiZ25tbFRvSnNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xufTtcblxuLy8gQ3JlYXRlIHRoZSBxdGlwIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBub2RlIGFuZCByZXR1cm5zIGl0LlxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0UXRpcENvbnRlbnQobm9kZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcbiAqL1xuXG4vLyBkZWZhdWx0IG9wdGlvbnNcbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBleHRyYSBwYWRkaW5nIGZvciBjb21wYXJ0bWVudFxuICBleHRyYUNvbXBhcnRtZW50UGFkZGluZzogMTAsXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZVxufTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbn07XG5cbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgfVxuICBcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgfVxuXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzO1xuIiwidmFyIHR4dFV0aWwgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJyk7XG52YXIgcGtnVmVyc2lvbiA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247IC8vIG5lZWQgaW5mbyBhYm91dCBzYmdudml6IHRvIHB1dCBpbiB4bWxcbnZhciBwa2dOYW1lID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykubmFtZTtcblxudmFyIHNiZ25tbFJlbmRlckV4dGVuc2lvbiA9IHt9O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLnhtbG5zID0gXCJodHRwOi8vd3d3LnNibWwub3JnL3NibWwvbGV2ZWwzL3ZlcnNpb24xL3JlbmRlci92ZXJzaW9uMVwiO1xuXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24oaWQsIHZhbHVlKSB7XG5cdC8vIGJvdGggYXJlIG9wdGlvbmFsXG5cdHRoaXMuaWQgPSBpZDtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5Db2xvckRlZmluaXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Y29sb3JEZWZpbml0aW9uXCI7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2YWx1ZT0nXCIrdGhpcy52YWx1ZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkNvbG9yRGVmaW5pdGlvbigpO1xuXHRjb2xvckRlZmluaXRpb24uaWQgPSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRjb2xvckRlZmluaXRpb24udmFsdWUgPSB4bWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXHRyZXR1cm4gY29sb3JEZWZpbml0aW9uO1xufTtcblxuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY29sb3JMaXN0ID0gW107XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLmFkZENvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uIChjb2xvckRlZmluaXRpb24pIHtcblx0dGhpcy5jb2xvckxpc3QucHVzaChjb2xvckRlZmluaXRpb24pO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM+XFxuXCI7XG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuY29sb3JMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbG9yID0gdGhpcy5jb2xvckxpc3RbaV07XG5cdFx0eG1sU3RyaW5nICs9IGNvbG9yLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9saXN0T2ZDb2xvckRlZmluaXRpb25zPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKCk7XG5cblx0dmFyIGNvbG9yRGVmaW5pdGlvbnMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NvbG9yRGVmaW5pdGlvbicpO1xuXHRmb3IgKHZhciBpPTA7IGk8Y29sb3JEZWZpbml0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjb2xvckRlZmluaXRpb25YTUwgPSBjb2xvckRlZmluaXRpb25zW2ldO1xuXHRcdHZhciBjb2xvckRlZmluaXRpb24gPSBzYmdubWxSZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uLmZyb21YTUwoY29sb3JEZWZpbml0aW9uWE1MKTtcblx0XHRsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFkZENvbG9yRGVmaW5pdGlvbihjb2xvckRlZmluaXRpb24pO1xuXHR9XG5cdHJldHVybiBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xufTtcblxuXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocGFyYW0pIHtcblx0Ly8gZWFjaCBvZiB0aG9zZSBhcmUgb3B0aW9uYWwsIHNvIHRlc3QgaWYgaXQgaXMgZGVmaW5lZCBpcyBtYW5kYXRvcnlcblx0Ly8gc3BlY2lmaWMgdG8gcmVuZGVyR3JvdXBcblx0dGhpcy5mb250U2l6ZSA9IHBhcmFtLmZvbnRTaXplO1xuXHR0aGlzLmZvbnRGYW1pbHkgPSBwYXJhbS5mb250RmFtaWx5O1xuXHR0aGlzLmZvbnRXZWlnaHQgPSBwYXJhbS5mb250V2VpZ2h0O1xuXHR0aGlzLmZvbnRTdHlsZSA9IHBhcmFtLmZvbnRTdHlsZTtcblx0dGhpcy50ZXh0QW5jaG9yID0gcGFyYW0udGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xuXHR0aGlzLnZ0ZXh0QW5jaG9yID0gcGFyYW0udnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3Ncblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUyRFxuXHR0aGlzLmZpbGwgPSBwYXJhbS5maWxsOyAvLyBmaWxsIGNvbG9yXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMURcblx0dGhpcy5pZCA9IHBhcmFtLmlkO1xuXHR0aGlzLnN0cm9rZSA9IHBhcmFtLnN0cm9rZTsgLy8gc3Ryb2tlIGNvbG9yXG5cdHRoaXMuc3Ryb2tlV2lkdGggPSBwYXJhbS5zdHJva2VXaWR0aDtcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uUmVuZGVyR3JvdXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Z1wiO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRTaXplICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFNpemU9J1wiK3RoaXMuZm9udFNpemUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZm9udEZhbWlseSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRGYW1pbHk9J1wiK3RoaXMuZm9udEZhbWlseStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250V2VpZ2h0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFdlaWdodD0nXCIrdGhpcy5mb250V2VpZ2h0K1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRTdHlsZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRTdHlsZT0nXCIrdGhpcy5mb250U3R5bGUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudGV4dEFuY2hvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHRleHRBbmNob3I9J1wiK3RoaXMudGV4dEFuY2hvcitcIidcIjtcblx0fVxuXHRpZiAodGhpcy52dGV4dEFuY2hvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZ0ZXh0QW5jaG9yPSdcIit0aGlzLnZ0ZXh0QW5jaG9yK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnN0cm9rZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHN0cm9rZT0nXCIrdGhpcy5zdHJva2UrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuc3Ryb2tlV2lkdGggIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzdHJva2VXaWR0aD0nXCIrdGhpcy5zdHJva2VXaWR0aCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5maWxsICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZmlsbD0nXCIrdGhpcy5maWxsK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJHcm91cC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHR2YXIgcmVuZGVyR3JvdXAgPSBuZXcgc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHt9KTtcblx0cmVuZGVyR3JvdXAuaWQgPSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRyZW5kZXJHcm91cC5mb250U2l6ZSA9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTaXplJyk7XG5cdHJlbmRlckdyb3VwLmZvbnRGYW1pbHkgPSB4bWwuZ2V0QXR0cmlidXRlKCdmb250RmFtaWx5Jyk7XG5cdHJlbmRlckdyb3VwLmZvbnRXZWlnaHQgPSB4bWwuZ2V0QXR0cmlidXRlKCdmb250V2VpZ2h0Jyk7XG5cdHJlbmRlckdyb3VwLmZvbnRTdHlsZSA9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTdHlsZScpO1xuXHRyZW5kZXJHcm91cC50ZXh0QW5jaG9yID0geG1sLmdldEF0dHJpYnV0ZSgndGV4dEFuY2hvcicpO1xuXHRyZW5kZXJHcm91cC52dGV4dEFuY2hvciA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Z0ZXh0QW5jaG9yJyk7XG5cdHJlbmRlckdyb3VwLnN0cm9rZSA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpO1xuXHRyZW5kZXJHcm91cC5zdHJva2VXaWR0aCA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZVdpZHRoJyk7XG5cdHJlbmRlckdyb3VwLmZpbGwgPSB4bWwuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XG5cdHJldHVybiByZW5kZXJHcm91cDtcbn07XG5cbi8vIGxvY2FsU3R5bGUgZnJvbSBzcGVjc1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlN0eWxlID0gZnVuY3Rpb24oaWQsIG5hbWUsIGlkTGlzdCkge1xuXHQvLyBldmVyeXRoaW5nIGlzIG9wdGlvbmFsXHRcblx0dGhpcy5pZCA9IGlkO1xuXHR0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLmlkTGlzdCA9IGlkTGlzdDtcblx0dGhpcy5yZW5kZXJHcm91cCA9IG51bGw7IC8vIDAgb3IgMVxufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5TdHlsZS5wcm90b3R5cGUuc2V0UmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocmVuZGVyR3JvdXApIHtcblx0dGhpcy5yZW5kZXJHcm91cCA9IHJlbmRlckdyb3VwO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5TdHlsZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxzdHlsZVwiO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBuYW1lPSdcIit0aGlzLm5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuaWRMaXN0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWRMaXN0PSdcIit0aGlzLmlkTGlzdC5qb2luKCcgJykrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLnJlbmRlckdyb3VwKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMucmVuZGVyR3JvdXAudG9YTUwoKTtcblx0fVxuXG5cdHhtbFN0cmluZyArPSBcIjwvc3R5bGU+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlN0eWxlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBzdHlsZSA9IG5ldyBzYmdubWxSZW5kZXJFeHRlbnNpb24uU3R5bGUoKTtcblx0c3R5bGUuaWQgPSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRzdHlsZS5uYW1lID0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHR2YXIgaWRMaXN0ID0geG1sLmdldEF0dHJpYnV0ZSgnaWRMaXN0Jyk7XG5cdHN0eWxlLmlkTGlzdCA9IGlkTGlzdCAhPSBudWxsID8gaWRMaXN0LnNwbGl0KCcgJykgOiBbXTtcblxuXHR2YXIgcmVuZGVyR3JvdXBYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2cnKVswXTtcblx0aWYgKHJlbmRlckdyb3VwWE1MICE9IG51bGwpIHtcblx0XHRzdHlsZS5yZW5kZXJHcm91cCA9IHNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJHcm91cC5mcm9tWE1MKHJlbmRlckdyb3VwWE1MKTtcblx0fVxuXHRyZXR1cm4gc3R5bGU7XG59O1xuXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3R5bGVMaXN0ID0gW107XG59O1xuc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcy5wcm90b3R5cGUuYWRkU3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xuXHR0aGlzLnN0eWxlTGlzdC5wdXNoKHN0eWxlKTtcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGxpc3RPZlN0eWxlcz5cXG5cIjtcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5zdHlsZUxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc3R5bGUgPSB0aGlzLnN0eWxlTGlzdFtpXTtcblx0XHR4bWxTdHJpbmcgKz0gc3R5bGUudG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2xpc3RPZlN0eWxlcz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5zYmdubWxSZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcygpO1xuXG5cdHZhciBzdHlsZXMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XG5cdGZvciAodmFyIGk9MDsgaTxzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc3R5bGVYTUwgPSBzdHlsZXNbaV07XG5cdFx0dmFyIHN0eWxlID0gc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlN0eWxlLmZyb21YTUwoc3R5bGVYTUwpO1xuXHRcdGxpc3RPZlN0eWxlcy5hZGRTdHlsZShzdHlsZSk7XG5cdH1cblx0cmV0dXJuIGxpc3RPZlN0eWxlcztcbn07XG5cbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChpZCwgbmFtZSwgYmFja2dyb3VuZENvbG9yLCBwcm92aWRlZFByb2dOYW1lLCBwcm92aWRlZFByb2dWZXJzaW9uKSB7XG5cdHRoaXMuaWQgPSBpZDsgLy8gcmVxdWlyZWQsIHJlc3QgaXMgb3B0aW9uYWxcblx0dGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy5wcm9ncmFtTmFtZSA9IHByb3ZpZGVkUHJvZ05hbWUgfHwgcGtnTmFtZTtcblx0dGhpcy5wcm9ncmFtVmVyc2lvbiA9IHByb3ZpZGVkUHJvZ1ZlcnNpb24gfHwgcGtnVmVyc2lvbjtcblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3I7XG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG51bGw7XG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbnVsbDtcblx0Lyp0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMocmVuZGVySW5mby5jb2xvckRlZi5jb2xvckxpc3QpO1xuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzKHJlbmRlckluZm8uc3R5bGVEZWYpO1xuXHQqL1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24obGlzdE9mQ29sb3JEZWZpbml0aW9ucykge1xuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mU3R5bGVzID0gZnVuY3Rpb24obGlzdE9mU3R5bGVzKSB7XG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbGlzdE9mU3R5bGVzO1xufTtcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcblx0Ly8gdGFnIGFuZCBpdHMgYXR0cmlidXRlc1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8cmVuZGVySW5mb3JtYXRpb24gaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBuYW1lPSdcIit0aGlzLm5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMucHJvZ3JhbU5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBwcm9ncmFtTmFtZT0nXCIrdGhpcy5wcm9ncmFtTmFtZStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5wcm9ncmFtVmVyc2lvbiAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHByb2dyYW1WZXJzaW9uPSdcIit0aGlzLnByb2dyYW1WZXJzaW9uK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmJhY2tncm91bmRDb2xvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGJhY2tncm91bmRDb2xvcj0nXCIrdGhpcy5iYWNrZ3JvdW5kQ29sb3IrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIHhtbG5zPSdcIitzYmdubWxSZW5kZXJFeHRlbnNpb24ueG1sbnMrXCInPlxcblwiO1xuXG5cdC8vIGNoaWxkIGVsZW1lbnRzXG5cdGlmICh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zLnRvWE1MKCk7XG5cdH1cblx0aWYgKHRoaXMubGlzdE9mU3R5bGVzKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubGlzdE9mU3R5bGVzLnRvWE1MKCk7XG5cdH1cblxuXHR4bWxTdHJpbmcgKz0gXCI8L3JlbmRlckluZm9ybWF0aW9uPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcbi8vIHN0YXRpYyBjb25zdHJ1Y3RvciBtZXRob2RcbnNiZ25tbFJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSBuZXcgc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLlJlbmRlckluZm9ybWF0aW9uKCk7XG5cdHJlbmRlckluZm9ybWF0aW9uLmlkID0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0cmVuZGVySW5mb3JtYXRpb24ubmFtZSA9IHhtbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0cmVuZGVySW5mb3JtYXRpb24ucHJvZ3JhbU5hbWUgPSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtVmVyc2lvbiA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Byb2dyYW1WZXJzaW9uJyk7XG5cdHJlbmRlckluZm9ybWF0aW9uLmJhY2tncm91bmRDb2xvciA9IHhtbC5nZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicpO1xuXG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZDb2xvckRlZmluaXRpb25zJylbMF07XG5cdHZhciBsaXN0T2ZTdHlsZXNYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpc3RPZlN0eWxlcycpWzBdO1xuXHRpZiAobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IHNiZ25tbFJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCk7XG5cdH1cblx0aWYgKGxpc3RPZlN0eWxlc1hNTCAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzID0gc2Jnbm1sUmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcy5mcm9tWE1MKGxpc3RPZlN0eWxlc1hNTCk7XG5cdH1cblxuXHRyZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XG59O1xuXG4vKiBwcm9iYWJseSB1c2VsZXNzLCBzZWVtcyBsaWtlIG5vYm9keSB1c2UgdGhpcyBpbiB0aGUgZXh0ZW5zaW9uXG5zYmdubWxSZW5kZXJFeHRlbnNpb24uZGVmYXVsdFZhbHVlcyA9IHtcblx0YmFja2dyb3VuZENvbG9yOiBudWxsLFxuXHRmb250U2l6ZTogbnVsbCxcblx0Zm9udEZhbWlseTogbnVsbCxcblx0Zm9udFdlaWdodDogbnVsbCxcblx0Zm9udFN0eWxlOiBudWxsLFxuXHR0ZXh0QW5jaG9yOiBudWxsLFxuXHR2dGV4dEFuY2hvcjogbnVsbCxcblx0ZmlsbDogbnVsbCxcblx0c3Ryb2tlOiBudWxsLFxuXHRzdHJva2VXaWR0aDogbnVsbFxufTtcblxuXG5zYmdubWxSZW5kZXJFeHRlbnNpb24ubGlzdE9mUmVuZGVySW5mb3JtYXRpb24gPSB7XG5cdGRlZmF1bHRWYWx1ZXM6IHt9LFxuXHRyZW5kZXJJbmZvcm1hdGlvbkxpc3Q6IFtdXG59XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNiZ25tbFJlbmRlckV4dGVuc2lvbjsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciByZW5kZXJFeHRlbnNpb24gPSByZXF1aXJlKCcuL3NiZ25tbC1yZW5kZXInKTtcblxudmFyIHNiZ25tbFRvSnNvbiA9IHtcbiAgaW5zZXJ0ZWROb2Rlczoge30sXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcblxuICAgIHZhciBjb21wYXJ0bWVudEVscyA9IHhtbE9iamVjdC5xdWVyeVNlbGVjdG9yQWxsKFwiZ2x5cGhbY2xhc3M9J2NvbXBhcnRtZW50J11cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcnRtZW50RWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY29tcGFydG1lbnQgPSBjb21wYXJ0bWVudEVsc1tpXTtcbiAgICAgIHZhciBiYm94ID0gdGhpcy5maW5kQ2hpbGROb2RlKGNvbXBhcnRtZW50LCAnYmJveCcpO1xuICAgICAgY29tcGFydG1lbnRzLnB1c2goe1xuICAgICAgICAneCc6IHBhcnNlRmxvYXQoYmJveC5nZXRBdHRyaWJ1dGUoJ3gnKSksXG4gICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94LmdldEF0dHJpYnV0ZSgneScpKSxcbiAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3guZ2V0QXR0cmlidXRlKCd3JykpLFxuICAgICAgICAnaCc6IHBhcnNlRmxvYXQoYmJveC5nZXRBdHRyaWJ1dGUoJ2gnKSksXG4gICAgICAgICdpZCc6IGNvbXBhcnRtZW50LmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcGFydG1lbnRzLnNvcnQoZnVuY3Rpb24gKGMxLCBjMikge1xuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XG4gIH0sXG4gIGlzSW5Cb3VuZGluZ0JveDogZnVuY3Rpb24gKGJib3gxLCBiYm94Mikge1xuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxuICAgICAgICBiYm94MS54ICsgYmJveDEudyA8IGJib3gyLnggKyBiYm94Mi53ICYmXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGJib3hQcm9wOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIGJib3ggPSBlbGUucXVlcnlTZWxlY3RvcignYmJveCcpO1xuXG4gICAgYmJveC54ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3gnKTtcbiAgICBiYm94LnkgPSBiYm94LmdldEF0dHJpYnV0ZSgneScpO1xuICAgIGJib3gudyA9IGJib3guZ2V0QXR0cmlidXRlKCd3Jyk7XG4gICAgYmJveC5oID0gYmJveC5nZXRBdHRyaWJ1dGUoJ2gnKTtcbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxuICAgIGJib3gueCA9IHBhcnNlRmxvYXQoYmJveC54KSArIHBhcnNlRmxvYXQoYmJveC53KSAvIDI7XG4gICAgYmJveC55ID0gcGFyc2VGbG9hdChiYm94LnkpICsgcGFyc2VGbG9hdChiYm94LmgpIC8gMjtcblxuICAgIHJldHVybiBiYm94O1xuICB9LFxuICBzdGF0ZUFuZEluZm9CYm94UHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xuICAgIHZhciB4UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LngpO1xuICAgIHZhciB5UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LnkpO1xuXG4gICAgdmFyIGJib3ggPSBlbGUucXVlcnlTZWxlY3RvcignYmJveCcpO1xuXG4gICAgYmJveC54ID0gYmJveC5nZXRBdHRyaWJ1dGUoJ3gnKTtcbiAgICBiYm94LnkgPSBiYm94LmdldEF0dHJpYnV0ZSgneScpO1xuICAgIGJib3gudyA9IGJib3guZ2V0QXR0cmlidXRlKCd3Jyk7XG4gICAgYmJveC5oID0gYmJveC5nZXRBdHRyaWJ1dGUoJ2gnKTtcblxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMiAtIHhQb3M7XG4gICAgYmJveC55ID0gcGFyc2VGbG9hdChiYm94LnkpICsgcGFyc2VGbG9hdChiYm94LmgpIC8gMiAtIHlQb3M7XG5cbiAgICBiYm94LnggPSBiYm94LnggLyBwYXJzZUZsb2F0KHBhcmVudEJib3gudykgKiAxMDA7XG4gICAgYmJveC55ID0gYmJveC55IC8gcGFyc2VGbG9hdChwYXJlbnRCYm94LmgpICogMTAwO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gIGZpbmRDaGlsZE5vZGVzOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcbiAgICAvLyBmaW5kIGNoaWxkIG5vZGVzIGF0IGRlcHRoIGxldmVsIG9mIDEgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnRcbiAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBlbGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSAmJiBjaGlsZC50YWdOYW1lID09PSBjaGlsZFRhZ05hbWUpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSxcbiAgZmluZENoaWxkTm9kZTogZnVuY3Rpb24gKGVsZSwgY2hpbGRUYWdOYW1lKSB7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsIGNoaWxkVGFnTmFtZSk7XG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aCA+IDAgPyBub2Rlc1swXSA6IHVuZGVmaW5lZDtcbiAgfSxcbiAgc3RhdGVBbmRJbmZvUHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc3RhdGVBbmRJbmZvQXJyYXkgPSBbXTtcblxuICAgIHZhciBjaGlsZEdseXBocyA9IHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnbHlwaCA9IGNoaWxkR2x5cGhzW2ldO1xuICAgICAgdmFyIGluZm8gPSB7fTtcblxuICAgICAgaWYgKGdseXBoLmNsYXNzTmFtZSA9PT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XG4gICAgICAgIGluZm8uaWQgPSBnbHlwaC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICBpbmZvLmNsYXp6ID0gZ2x5cGguY2xhc3NOYW1lIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGxhYmVsID0gZ2x5cGgucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgICAgaW5mby5sYWJlbCA9IHtcbiAgICAgICAgICAndGV4dCc6IChsYWJlbCAmJiBsYWJlbC5nZXRBdHRyaWJ1dGUoJ3RleHQnKSkgfHwgdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xuICAgICAgfSBlbHNlIGlmIChnbHlwaC5jbGFzc05hbWUgPT09ICdzdGF0ZSB2YXJpYWJsZScpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc05hbWUgfHwgdW5kZWZpbmVkO1xuICAgICAgICB2YXIgc3RhdGUgPSBnbHlwaC5xdWVyeVNlbGVjdG9yKCdzdGF0ZScpO1xuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHZhciB2YXJpYWJsZSA9IChzdGF0ZSAmJiBzdGF0ZS5nZXRBdHRyaWJ1dGUoJ3ZhcmlhYmxlJykpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5zdGF0ZSA9IHtcbiAgICAgICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICAgICAndmFyaWFibGUnOiB2YXJpYWJsZVxuICAgICAgICB9O1xuICAgICAgICBpbmZvLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKGdseXBoLCBwYXJlbnRCYm94KTtcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChpbmZvKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiBzdGF0ZUFuZEluZm9BcnJheTtcbiAgfSxcbiAgYWRkUGFyZW50SW5mb1RvTm9kZTogZnVuY3Rpb24gKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbXBhcnRtZW50UmVmID0gZWxlLmdldEF0dHJpYnV0ZSgnY29tcGFydG1lbnRSZWYnKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gcGFyZW50O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb21wYXJ0bWVudFJlZikge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSAnJztcblxuICAgICAgLy8gYWRkIGNvbXBhcnRtZW50IGFjY29yZGluZyB0byBnZW9tZXRyeVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJ0bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGJib3hFbCA9IHNlbGYuZmluZENoaWxkTm9kZShlbGUsICdiYm94Jyk7XG4gICAgICAgIHZhciBiYm94ID0ge1xuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCd4JykpLFxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCd5JykpLFxuICAgICAgICAgICd3JzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCd3JykpLFxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94RWwuZ2V0QXR0cmlidXRlKCdoJykpLFxuICAgICAgICAgICdpZCc6IGVsZS5nZXRBdHRyaWJ1dGUoJ2lkJylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcbiAgICAgICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50c1tpXS5pZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYWRkQ3l0b3NjYXBlSnNOb2RlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBub2RlT2JqID0ge307XG5cbiAgICAvLyBhZGQgaWQgaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmlkID0gZWxlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAvLyBhZGQgbm9kZSBib3VuZGluZyBib3ggaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLmJib3ggPSBzZWxmLmJib3hQcm9wKGVsZSk7XG4gICAgLy8gYWRkIGNsYXNzIGluZm9ybWF0aW9uXG4gICAgbm9kZU9iai5jbGFzcyA9IGVsZS5jbGFzc05hbWU7XG4gICAgLy8gYWRkIGxhYmVsIGluZm9ybWF0aW9uXG4gICAgdmFyIGxhYmVsID0gc2VsZi5maW5kQ2hpbGROb2RlKGVsZSwgJ2xhYmVsJyk7XG4gICAgbm9kZU9iai5sYWJlbCA9IChsYWJlbCAmJiBsYWJlbC5nZXRBdHRyaWJ1dGUoJ3RleHQnKSkgfHwgdW5kZWZpbmVkO1xuICAgIC8vIGFkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cbiAgICBub2RlT2JqLnN0YXRlc2FuZGluZm9zID0gc2VsZi5zdGF0ZUFuZEluZm9Qcm9wKGVsZSwgbm9kZU9iai5iYm94KTtcbiAgICAvLyBhZGRpbmcgcGFyZW50IGluZm9ybWF0aW9uXG4gICAgc2VsZi5hZGRQYXJlbnRJbmZvVG9Ob2RlKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xuXG4gICAgLy8gYWRkIGNsb25lIGluZm9ybWF0aW9uXG4gICAgdmFyIGNsb25lTWFya2VycyA9IHNlbGYuZmluZENoaWxkTm9kZXMoZWxlLCAnY2xvbmUnKTtcbiAgICBpZiAoY2xvbmVNYXJrZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlT2JqLmNsb25lbWFya2VyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGFkZCBwb3J0IGluZm9ybWF0aW9uXG4gICAgdmFyIHBvcnRzID0gW107XG4gICAgdmFyIHBvcnRFbGVtZW50cyA9IGVsZS5xdWVyeVNlbGVjdG9yQWxsKCdwb3J0Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnRFbCA9IHBvcnRFbGVtZW50c1tpXTtcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICB2YXIgcmVsYXRpdmVYUG9zID0gcGFyc2VGbG9hdChwb3J0RWwuZ2V0QXR0cmlidXRlKCd4JykpIC0gbm9kZU9iai5iYm94Lng7XG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gcGFyc2VGbG9hdChwb3J0RWwuZ2V0QXR0cmlidXRlKCd5JykpIC0gbm9kZU9iai5iYm94Lnk7XG5cbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LncpICogMTAwO1xuICAgICAgcmVsYXRpdmVZUG9zID0gcmVsYXRpdmVZUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3guaCkgKiAxMDA7XG5cbiAgICAgIHBvcnRzLnB1c2goe1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcbiAgICAgICAgeTogcmVsYXRpdmVZUG9zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBub2RlT2JqLnBvcnRzID0gcG9ydHM7XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzTm9kZSk7XG4gIH0sXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgZWxJZCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NOYW1lXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBhZGQgY29tcGxleCBub2RlcyBoZXJlXG5cbiAgICB2YXIgZWxlQ2xhc3MgPSBlbGUuY2xhc3NOYW1lO1xuXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdjb21wbGV4IG11bHRpbWVyJyB8fCBlbGVDbGFzcyA9PT0gJ3N1Ym1hcCcpIHtcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG5cbiAgICAgIHZhciBjaGlsZEdseXBocyA9IHNlbGYuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICAgIHZhciBnbHlwaENsYXNzID0gZ2x5cGguY2xhc3NOYW1lO1xuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGpzb25BcnJheSwgZWxJZCwgY29tcGFydG1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzTm9kZShlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgZ2V0UG9ydHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcbiAgfSxcbiAgZ2V0R2x5cGhzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xuXG4gICAgaWYgKCFnbHlwaHMpIHtcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XG5cbiAgICAgIHZhciBpZDJnbHlwaCA9IHhtbE9iamVjdC5faWQyZ2x5cGggPSB7fTtcblxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICB2YXIgZyA9IGdseXBoc1tpXTtcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgaWQyZ2x5cGhbIGlkIF0gPSBnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBnbHlwaHM7XG4gIH0sXG4gIGdldEdseXBoQnlJZDogZnVuY3Rpb24gKHhtbE9iamVjdCwgaWQpIHtcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcblxuICAgIHJldHVybiB4bWxPYmplY3QuX2lkMmdseXBoW2lkXTtcbiAgfSxcbiAgZ2V0QXJjU291cmNlQW5kVGFyZ2V0OiBmdW5jdGlvbiAoYXJjLCB4bWxPYmplY3QpIHtcbiAgICAvLyBzb3VyY2UgYW5kIHRhcmdldCBjYW4gYmUgaW5zaWRlIG9mIGEgcG9ydFxuICAgIHZhciBzb3VyY2UgPSBhcmMuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcbiAgICB2YXIgdGFyZ2V0ID0gYXJjLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XG4gICAgdmFyIHNvdXJjZU5vZGVJZDtcbiAgICB2YXIgdGFyZ2V0Tm9kZUlkO1xuXG4gICAgdmFyIHNvdXJjZUV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgc291cmNlKTtcbiAgICB2YXIgdGFyZ2V0RXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCB0YXJnZXQpO1xuXG4gICAgaWYgKHNvdXJjZUV4aXN0cykge1xuICAgICAgc291cmNlTm9kZUlkID0gc291cmNlO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXRFeGlzdHMpIHtcbiAgICAgIHRhcmdldE5vZGVJZCA9IHRhcmdldDtcbiAgICB9XG5cblxuICAgIHZhciBpO1xuICAgIHZhciBwb3J0RWxzID0gdGhpcy5nZXRQb3J0cyh4bWxPYmplY3QpO1xuICAgIHZhciBwb3J0O1xuICAgIGlmIChzb3VyY2VOb2RlSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xuICAgICAgICBpZiAocG9ydC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHNvdXJjZSkge1xuICAgICAgICAgIHNvdXJjZU5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0Tm9kZUlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xuICAgICAgICBpZiAocG9ydC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHRhcmdldCkge1xuICAgICAgICAgIHRhcmdldE5vZGVJZCA9IHBvcnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geydzb3VyY2UnOiBzb3VyY2VOb2RlSWQsICd0YXJnZXQnOiB0YXJnZXROb2RlSWR9O1xuICB9LFxuXG4gIGdldEFyY0JlbmRQb2ludFBvc2l0aW9uczogZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBbXTtcblxuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCAnbmV4dCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvc1ggPSBjaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ3gnKTtcbiAgICAgIHZhciBwb3NZID0gY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd5Jyk7XG5cbiAgICAgIGJlbmRQb2ludFBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJlbmRQb2ludFBvc2l0aW9ucztcbiAgfSxcbiAgYWRkQ3l0b3NjYXBlSnNFZGdlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHhtbE9iamVjdCkge1xuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbZWxlLmNsYXNzTmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldCA9IHNlbGYuZ2V0QXJjU291cmNlQW5kVGFyZ2V0KGVsZSwgeG1sT2JqZWN0KTtcblxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZWRnZU9iaiA9IHt9O1xuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWxmLmdldEFyY0JlbmRQb2ludFBvc2l0aW9ucyhlbGUpO1xuXG4gICAgZWRnZU9iai5pZCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdW5kZWZpbmVkO1xuICAgIGVkZ2VPYmouY2xhc3MgPSBlbGUuY2xhc3NOYW1lO1xuICAgIGVkZ2VPYmouYmVuZFBvaW50UG9zaXRpb25zID0gYmVuZFBvaW50UG9zaXRpb25zO1xuXG4gICAgdmFyIGdseXBoQ2hpbGRyZW4gPSBzZWxmLmZpbmRDaGlsZE5vZGVzKGVsZSwgJ2dseXBoJyk7XG4gICAgdmFyIGdseXBoRGVzY2VuZGVudHMgPSBlbGUucXVlcnlTZWxlY3RvckFsbCgnZ2x5cGgnKTtcbiAgICBpZiAoZ2x5cGhEZXNjZW5kZW50cy5sZW5ndGggPD0gMCkge1xuICAgICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2x5cGhDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZ2x5cGhDaGlsZHJlbltpXS5jbGFzc05hbWUgPT09ICdjYXJkaW5hbGl0eScpIHtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBnbHlwaENoaWxkcmVuW2ldLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICAgICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IGxhYmVsLmdldEF0dHJpYnV0ZSgndGV4dCcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVkZ2VPYmouc291cmNlID0gc291cmNlQW5kVGFyZ2V0LnNvdXJjZTtcbiAgICBlZGdlT2JqLnRhcmdldCA9IHNvdXJjZUFuZFRhcmdldC50YXJnZXQ7XG5cbiAgICBlZGdlT2JqLnBvcnRzb3VyY2UgPSBlbGUuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcbiAgICBlZGdlT2JqLnBvcnR0YXJnZXQgPSBlbGUuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcblxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2UgPSB7ZGF0YTogZWRnZU9ian07XG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNFZGdlKTtcbiAgfSxcbiAgYXBwbHlTdHlsZTogZnVuY3Rpb24gKHhtbFJlbmRlckV4dCwgbm9kZXMsIGVkZ2VzKSB7XG4gICAgLy8gcGFyc2UgdGhlIHJlbmRlciBleHRlbnNpb25cbiAgICB2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCh4bWxSZW5kZXJFeHQpO1xuXG4gICAgLy8gZ2V0IGFsbCBjb2xvciBpZCByZWZlcmVuY2VzIHRvIHRoZWlyIHZhbHVlXG4gICAgdmFyIGNvbG9yTGlzdCA9IHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuY29sb3JMaXN0O1xuICAgIHZhciBjb2xvcklEVG9WYWx1ZSA9IHt9O1xuICAgIGZvciAodmFyIGk9MDsgaSA8IGNvbG9yTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29sb3JJRFRvVmFsdWVbY29sb3JMaXN0W2ldLmlkXSA9IGNvbG9yTGlzdFtpXS52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IHN0eWxlIGxpc3QgdG8gZWxlbWVudElkLWluZGV4ZWQgb2JqZWN0IHBvaW50aW5nIHRvIHN0eWxlXG4gICAgLy8gYWxzbyBjb252ZXJ0IGNvbG9yIHJlZmVyZW5jZXMgdG8gY29sb3IgdmFsdWVzXG4gICAgdmFyIHN0eWxlTGlzdCA9IHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZlN0eWxlcy5zdHlsZUxpc3Q7XG4gICAgdmFyIGVsZW1lbnRJRFRvU3R5bGUgPSB7fTtcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBzdHlsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlTGlzdFtpXTtcbiAgICAgIHZhciByZW5kZXJHcm91cCA9IHN0eWxlLnJlbmRlckdyb3VwO1xuXG4gICAgICAvLyBjb252ZXJ0IGNvbG9yIHJlZmVyZW5jZXNcbiAgICAgIGlmIChyZW5kZXJHcm91cC5zdHJva2UgIT0gbnVsbCkge1xuICAgICAgICByZW5kZXJHcm91cC5zdHJva2UgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5zdHJva2VdO1xuICAgICAgfVxuICAgICAgaWYgKHJlbmRlckdyb3VwLmZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZW5kZXJHcm91cC5maWxsID0gY29sb3JJRFRvVmFsdWVbcmVuZGVyR3JvdXAuZmlsbF07XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGo9MDsgaiA8IHN0eWxlLmlkTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgaWQgPSBzdHlsZS5pZExpc3Rbal07XG4gICAgICAgIGVsZW1lbnRJRFRvU3R5bGVbaWRdID0gcmVuZGVyR3JvdXA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGV4VG9EZWNpbWFsIChoZXgpIHtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlSW50KCcweCcraGV4KSAvIDI1NSAqIDEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udmVydEhleENvbG9yIChoZXgpIHtcbiAgICAgIGlmIChoZXgubGVuZ3RoID09IDcpIHsgLy8gbm8gb3BhY2l0eSBwcm92aWRlZFxuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG51bGwsIGNvbG9yOiBoZXh9O1xuICAgICAgfVxuICAgICAgZWxzZSB7IC8vIGxlbmd0aCBvZiA5XG4gICAgICAgIHZhciBjb2xvciA9IGhleC5zbGljZSgwLDcpO1xuICAgICAgICB2YXIgb3BhY2l0eSA9IGhleFRvRGVjaW1hbChoZXguc2xpY2UoLTIpKTtcbiAgICAgICAgcmV0dXJuIHtvcGFjaXR5OiBvcGFjaXR5LCBjb2xvcjogY29sb3J9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFwcGx5IHRoZSBzdHlsZSB0byBub2RlcyBhbmQgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IHN0eWxlXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGNvbG9yIHByb3BlcnRpZXMsIHdlIG5lZWQgdG8gY2hlY2sgb3BhY2l0eVxuICAgICAgdmFyIGJnQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZmlsbDtcbiAgICAgIGlmIChiZ0NvbG9yKSB7XG4gICAgICAgIHZhciByZXMgPSBjb252ZXJ0SGV4Q29sb3IoYmdDb2xvcik7XG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1jb2xvciddID0gcmVzLmNvbG9yO1xuICAgICAgICBub2RlLmRhdGFbJ2JhY2tncm91bmQtb3BhY2l0eSddID0gcmVzLm9wYWNpdHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBib3JkZXJDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5zdHJva2U7XG4gICAgICBpZiAoYm9yZGVyQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihib3JkZXJDb2xvcik7XG4gICAgICAgIG5vZGUuZGF0YVsnYm9yZGVyLWNvbG9yJ10gPSByZXMuY29sb3I7XG4gICAgICB9XG5cbiAgICAgIHZhciBib3JkZXJXaWR0aCA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5zdHJva2VXaWR0aDtcbiAgICAgIGlmIChib3JkZXJXaWR0aCkge1xuICAgICAgICBub2RlLmRhdGFbJ2JvcmRlci13aWR0aCddID0gYm9yZGVyV2lkdGg7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250U2l6ZSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250U2l6ZTtcbiAgICAgIGlmIChmb250U2l6ZSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc2l6ZSddID0gZm9udFNpemU7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250RmFtaWx5ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRGYW1pbHk7XG4gICAgICBpZiAoZm9udEZhbWlseSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtZmFtaWx5J10gPSBmb250RmFtaWx5O1xuICAgICAgfVxuXG4gICAgICB2YXIgZm9udFN0eWxlID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRTdHlsZTtcbiAgICAgIGlmIChmb250U3R5bGUpIHtcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXN0eWxlJ10gPSBmb250U3R5bGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250V2VpZ2h0ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRXZWlnaHQ7XG4gICAgICBpZiAoZm9udFdlaWdodCkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtd2VpZ2h0J10gPSBmb250V2VpZ2h0O1xuICAgICAgfVxuXG4gICAgICB2YXIgdGV4dEFuY2hvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS50ZXh0QW5jaG9yO1xuICAgICAgaWYgKHRleHRBbmNob3IpIHtcbiAgICAgICAgbm9kZS5kYXRhWyd0ZXh0LWhhbGlnbiddID0gdGV4dEFuY2hvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIHZ0ZXh0QW5jaG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnZ0ZXh0QW5jaG9yO1xuICAgICAgaWYgKHZ0ZXh0QW5jaG9yKSB7XG4gICAgICAgIG5vZGUuZGF0YVsndGV4dC12YWxpZ24nXSA9IHZ0ZXh0QW5jaG9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRvIHRoZSBzYW1lIGZvciBlZGdlc1xuICAgIGZvciAodmFyIGk9MDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuXG4gICAgICB2YXIgbGluZUNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcbiAgICAgIGlmIChsaW5lQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihsaW5lQ29sb3IpO1xuICAgICAgICBlZGdlLmRhdGFbJ2xpbmUtY29sb3InXSA9IHJlcy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIHdpZHRoID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xuICAgICAgaWYgKHdpZHRoKSB7XG4gICAgICAgIGVkZ2UuZGF0YVsnd2lkdGgnXSA9IHdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlcyA9IFtdO1xuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XG5cbiAgICB2YXIgY29tcGFydG1lbnRzID0gc2VsZi5nZXRBbGxDb21wYXJ0bWVudHMoeG1sT2JqZWN0KTtcblxuICAgIHZhciBleHRlbnNpb24gPSB4bWxPYmplY3QucXVlcnlTZWxlY3RvcignZXh0ZW5zaW9uJyk7IC8vIG1heSBub3QgYmUgaGVyZVxuICAgIHZhciByZW5kZXJJbmZvcm1hdGlvbjtcbiAgICBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICByZW5kZXJJbmZvcm1hdGlvbiA9IHNlbGYuZmluZENoaWxkTm9kZShleHRlbnNpb24sICdyZW5kZXJJbmZvcm1hdGlvbicpO1xuICAgIH1cbiAgICB2YXIgZ2x5cGhzID0gc2VsZi5maW5kQ2hpbGROb2Rlcyh4bWxPYmplY3QucXVlcnlTZWxlY3RvcignbWFwJyksICdnbHlwaCcpO1xuICAgIHZhciBhcmNzID0gc2VsZi5maW5kQ2hpbGROb2Rlcyh4bWxPYmplY3QucXVlcnlTZWxlY3RvcignbWFwJyksICdhcmMnKTtcblxuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnbHlwaCA9IGdseXBoc1tpXTtcbiAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwgY3l0b3NjYXBlSnNOb2RlcywgJycsIGNvbXBhcnRtZW50cyk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBhcmMgPSBhcmNzW2ldO1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc0VkZ2UoYXJjLCBjeXRvc2NhcGVKc0VkZ2VzLCB4bWxPYmplY3QpO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXJJbmZvcm1hdGlvbikgeyAvLyByZW5kZXIgZXh0ZW5zaW9uIHdhcyBmb3VuZFxuICAgICAgc2VsZi5hcHBseVN0eWxlKHJlbmRlckluZm9ybWF0aW9uLCBjeXRvc2NhcGVKc05vZGVzLCBjeXRvc2NhcGVKc0VkZ2VzKTtcbiAgICB9XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNHcmFwaCA9IHt9O1xuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xuICAgIGN5dG9zY2FwZUpzR3JhcGguZWRnZXMgPSBjeXRvc2NhcGVKc0VkZ2VzO1xuXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XG5cbiAgICByZXR1cm4gY3l0b3NjYXBlSnNHcmFwaDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XG4iLCIvKlxuICogVGV4dCB1dGlsaXRpZXMgZm9yIGNvbW1vbiB1c2FnZVxuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIHRleHRVdGlsaXRpZXMgPSB7XG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XG4gIHRydW5jYXRlVGV4dDogZnVuY3Rpb24gKHRleHRQcm9wLCBmb250KSB7XG4gICAgdmFyIGNvbnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29udGV4dC5mb250ID0gZm9udDtcbiAgICBcbiAgICB2YXIgZml0TGFiZWxzVG9Ob2RlcyA9IG9wdGlvbnMuZml0TGFiZWxzVG9Ob2RlcztcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XG4gICAgXG4gICAgdmFyIHRleHQgPSB0ZXh0UHJvcC5sYWJlbCB8fCBcIlwiO1xuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcbiAgICBpZiAoZml0TGFiZWxzVG9Ob2RlcyA9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIHZhciB3aWR0aDtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGg7XG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xuICAgIHZhciB0ZXh0V2lkdGggPSAodGV4dFByb3Aud2lkdGggPiAzMCkgPyB0ZXh0UHJvcC53aWR0aCAtIDEwIDogdGV4dFByb3Aud2lkdGg7XG4gICAgd2hpbGUgKCh3aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGgpID4gdGV4dFdpZHRoKSB7XG4gICAgICAtLWxlbjtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBsZW4pICsgZWxsaXBzaXM7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9LFxuXG4gIC8vIGVuc3VyZSB0aGF0IHJldHVybmVkIHN0cmluZyBmb2xsb3dzIHhzZDpJRCBzdGFuZGFyZFxuICAvLyBzaG91bGQgZm9sbG93IHInXlthLXpBLVpfXVtcXHcuLV0qJCdcbiAgZ2V0WE1MVmFsaWRJZDogZnVuY3Rpb24ob3JpZ2luYWxJZCkge1xuICAgIHZhciBuZXdJZCA9IFwiXCI7XG4gICAgdmFyIHhtbFZhbGlkUmVnZXggPSAvXlthLXpBLVpfXVtcXHcuLV0qJC87XG4gICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG9yaWdpbmFsSWQpKSB7IC8vIGRvZXNuJ3QgY29tcGx5XG4gICAgICBuZXdJZCA9IG9yaWdpbmFsSWQ7XG4gICAgICBuZXdJZCA9IG5ld0lkLnJlcGxhY2UoL1teXFx3Li1dL2csIFwiXCIpO1xuICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBzdGlsbCBkb2Vzbid0IGNvbXBseVxuICAgICAgICBuZXdJZCA9IFwiX1wiICsgbmV3SWQ7XG4gICAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gbm9ybWFsbHkgd2Ugc2hvdWxkIG5ldmVyIGVudGVyIHRoaXNcbiAgICAgICAgICAvLyBpZiBmb3Igc29tZSBvYnNjdXJlIHJlYXNvbiB3ZSBzdGlsbCBkb24ndCBjb21wbHksIHRocm93IGVycm9yLlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgaWRlbnRpZmVyIGNvbXBseSB0byB4c2Q6SUQgcmVxdWlyZW1lbnRzOiBcIituZXdJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdJZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxJZDtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0VXRpbGl0aWVzOyIsIi8qXG4gKiBDb21tb25seSBuZWVkZWQgVUkgVXRpbGl0aWVzXG4gKi9cblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgdWlVdGlsaXRpZXMgPSB7XG4gIHN0YXJ0U3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XG4gICAgfVxuICAgIFxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS53aWR0aCgpO1xuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLmhlaWdodCgpO1xuICAgICAgJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciArICc6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGNsYXNzTmFtZSArICdcIj48L2k+Jyk7XG4gICAgfVxuICB9LFxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcbiAgICB9XG4gICAgXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAkKCcuJyArIGNsYXNzTmFtZSkucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpVXRpbGl0aWVzO1xuXG5cbiIsIi8qXG4gKiBUaGlzIGZpbGUgZXhwb3J0cyB0aGUgZnVuY3Rpb25zIHRvIGJlIHV0aWxpemVkIGluIHVuZG9yZWRvIGV4dGVuc2lvbiBhY3Rpb25zIFxuICovXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xuICAvLyBTZWN0aW9uIFN0YXJ0XG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xuICB9LFxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICB2YXIgcGFyYW0gPSB7fTtcbiAgICBwYXJhbS5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcbiAgICByZXR1cm4gcGFyYW07XG4gIH0sXG4gIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQocGFyYW0uZWxlcyk7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XG4gIH0sXG4gIC8vIFNlY3Rpb24gRW5kXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uczsiLCJ2YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xuXG52YXIgbnMgPSB7fTtcblxubnMueG1sbnMgPSBcImh0dHA6Ly93d3cuc2JtbC5vcmcvc2JtbC9sZXZlbDMvdmVyc2lvbjEvcmVuZGVyL3ZlcnNpb24xXCI7XG5cbi8vIC0tLS0tLS0gQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cbm5zLkNvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ3ZhbHVlJ10pO1xuXHR0aGlzLmlkIFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMudmFsdWUgXHQ9IHBhcmFtcy52YWx1ZTtcbn07XG5cbm5zLkNvbG9yRGVmaW5pdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxjb2xvckRlZmluaXRpb25cIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhbHVlPSdcIit0aGlzLnZhbHVlK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuQ29sb3JEZWZpbml0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgbnMuQ29sb3JEZWZpbml0aW9uKCk7XG5cdGNvbG9yRGVmaW5pdGlvbi5pZCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRjb2xvckRlZmluaXRpb24udmFsdWUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdHJldHVybiBjb2xvckRlZmluaXRpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY29sb3JMaXN0ID0gW107XG59O1xuXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS5hZGRDb2xvckRlZmluaXRpb24gPSBmdW5jdGlvbiAoY29sb3JEZWZpbml0aW9uKSB7XG5cdHRoaXMuY29sb3JMaXN0LnB1c2goY29sb3JEZWZpbml0aW9uKTtcbn07XG5cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGlzdE9mQ29sb3JEZWZpbml0aW9ucz5cXG5cIjtcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5jb2xvckxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY29sb3IgPSB0aGlzLmNvbG9yTGlzdFtpXTtcblx0XHR4bWxTdHJpbmcgKz0gY29sb3IudG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2xpc3RPZkNvbG9yRGVmaW5pdGlvbnM+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IG5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMoKTtcblxuXHR2YXIgY29sb3JEZWZpbml0aW9ucyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY29sb3JEZWZpbml0aW9uJyk7XG5cdGZvciAodmFyIGk9MDsgaTxjb2xvckRlZmluaXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvblhNTCA9IGNvbG9yRGVmaW5pdGlvbnNbaV07XG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5zLkNvbG9yRGVmaW5pdGlvbi5mcm9tWE1MKGNvbG9yRGVmaW5pdGlvblhNTCk7XG5cdFx0bGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hZGRDb2xvckRlZmluaXRpb24oY29sb3JEZWZpbml0aW9uKTtcblx0fVxuXHRyZXR1cm4gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG4vLyAtLS0tLS0tIEVORCBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBSRU5ERVJHUk9VUCAtLS0tLS0tXG5ucy5SZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0Ly8gZWFjaCBvZiB0aG9zZSBhcmUgb3B0aW9uYWwsIHNvIHRlc3QgaWYgaXQgaXMgZGVmaW5lZCBpcyBtYW5kYXRvcnlcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydmb250U2l6ZScsICdmb250RmFtaWx5JywgJ2ZvbnRXZWlnaHQnLCBcblx0XHQnZm9udFN0eWxlJywgJ3RleHRBbmNob3InLCAndnRleHRBbmNob3InLCAnZmlsbCcsICdpZCcsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnXSk7XG5cdC8vIHNwZWNpZmljIHRvIHJlbmRlckdyb3VwXG5cdHRoaXMuZm9udFNpemUgXHRcdD0gcGFyYW1zLmZvbnRTaXplO1xuXHR0aGlzLmZvbnRGYW1pbHkgXHQ9IHBhcmFtcy5mb250RmFtaWx5O1xuXHR0aGlzLmZvbnRXZWlnaHQgXHQ9IHBhcmFtcy5mb250V2VpZ2h0O1xuXHR0aGlzLmZvbnRTdHlsZSBcdFx0PSBwYXJhbXMuZm9udFN0eWxlO1xuXHR0aGlzLnRleHRBbmNob3IgXHQ9IHBhcmFtcy50ZXh0QW5jaG9yOyAvLyBwcm9iYWJseSB1c2VsZXNzXG5cdHRoaXMudnRleHRBbmNob3IgXHQ9IHBhcmFtcy52dGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xuXHQvLyBmcm9tIEdyYXBoaWNhbFByaW1pdGl2ZTJEXG5cdHRoaXMuZmlsbCBcdFx0XHQ9IHBhcmFtcy5maWxsOyAvLyBmaWxsIGNvbG9yXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMURcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5zdHJva2UgXHRcdD0gcGFyYW1zLnN0cm9rZTsgLy8gc3Ryb2tlIGNvbG9yXG5cdHRoaXMuc3Ryb2tlV2lkdGggXHQ9IHBhcmFtcy5zdHJva2VXaWR0aDtcbn07XG5cbm5zLlJlbmRlckdyb3VwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGdcIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250U2l6ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRTaXplPSdcIit0aGlzLmZvbnRTaXplK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRGYW1pbHkgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBmb250RmFtaWx5PSdcIit0aGlzLmZvbnRGYW1pbHkrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZm9udFdlaWdodCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRXZWlnaHQ9J1wiK3RoaXMuZm9udFdlaWdodCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250U3R5bGUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBmb250U3R5bGU9J1wiK3RoaXMuZm9udFN0eWxlK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB0ZXh0QW5jaG9yPSdcIit0aGlzLnRleHRBbmNob3IrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2dGV4dEFuY2hvcj0nXCIrdGhpcy52dGV4dEFuY2hvcitcIidcIjtcblx0fVxuXHRpZiAodGhpcy5zdHJva2UgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzdHJva2U9J1wiK3RoaXMuc3Ryb2tlK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnN0cm9rZVdpZHRoICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgc3Ryb2tlV2lkdGg9J1wiK3RoaXMuc3Ryb2tlV2lkdGgrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZmlsbCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZpbGw9J1wiK3RoaXMuZmlsbCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlJlbmRlckdyb3VwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciByZW5kZXJHcm91cCA9IG5ldyBucy5SZW5kZXJHcm91cCh7fSk7XG5cdHJlbmRlckdyb3VwLmlkIFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0cmVuZGVyR3JvdXAuZm9udFNpemUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTaXplJyk7XG5cdHJlbmRlckdyb3VwLmZvbnRGYW1pbHkgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRGYW1pbHknKTtcblx0cmVuZGVyR3JvdXAuZm9udFdlaWdodCBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFdlaWdodCcpO1xuXHRyZW5kZXJHcm91cC5mb250U3R5bGUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTdHlsZScpO1xuXHRyZW5kZXJHcm91cC50ZXh0QW5jaG9yIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCd0ZXh0QW5jaG9yJyk7XG5cdHJlbmRlckdyb3VwLnZ0ZXh0QW5jaG9yID0geG1sLmdldEF0dHJpYnV0ZSgndnRleHRBbmNob3InKTtcblx0cmVuZGVyR3JvdXAuc3Ryb2tlIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpO1xuXHRyZW5kZXJHcm91cC5zdHJva2VXaWR0aCA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZVdpZHRoJyk7XG5cdHJlbmRlckdyb3VwLmZpbGwgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnZmlsbCcpO1xuXHRyZXR1cm4gcmVuZGVyR3JvdXA7XG59O1xuLy8gLS0tLS0tLSBFTkQgUkVOREVSR1JPVVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNUWUxFIC0tLS0tLS1cbi8vIGxvY2FsU3R5bGUgZnJvbSBzcGVjc1xubnMuU3R5bGUgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ2lkTGlzdCcsICdyZW5kZXJHcm91cCddKTtcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5uYW1lIFx0XHRcdD0gcGFyYW1zLm5hbWU7XG5cdHRoaXMuaWRMaXN0IFx0XHQ9IHBhcmFtcy5pZExpc3Q7XG5cdHRoaXMucmVuZGVyR3JvdXAgXHQ9IHBhcmFtcy5yZW5kZXJHcm91cDtcbn07XG5cbm5zLlN0eWxlLnByb3RvdHlwZS5zZXRSZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChyZW5kZXJHcm91cCkge1xuXHR0aGlzLnJlbmRlckdyb3VwID0gcmVuZGVyR3JvdXA7XG59O1xuXG5ucy5TdHlsZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxzdHlsZVwiO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBuYW1lPSdcIit0aGlzLm5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuaWRMaXN0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWRMaXN0PSdcIit0aGlzLmlkTGlzdC5qb2luKCcgJykrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLnJlbmRlckdyb3VwKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMucmVuZGVyR3JvdXAudG9YTUwoKTtcblx0fVxuXG5cdHhtbFN0cmluZyArPSBcIjwvc3R5bGU+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5TdHlsZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHR2YXIgc3R5bGUgPSBuZXcgbnMuU3R5bGUoKTtcblx0c3R5bGUuaWQgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0c3R5bGUubmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdHZhciBpZExpc3QgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWRMaXN0Jyk7XG5cdHN0eWxlLmlkTGlzdCBcdD0gaWRMaXN0ICE9IG51bGwgPyBpZExpc3Quc3BsaXQoJyAnKSA6IFtdO1xuXG5cdHZhciByZW5kZXJHcm91cFhNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZycpWzBdO1xuXHRpZiAocmVuZGVyR3JvdXBYTUwgIT0gbnVsbCkge1xuXHRcdHN0eWxlLnJlbmRlckdyb3VwID0gbnMuUmVuZGVyR3JvdXAuZnJvbVhNTChyZW5kZXJHcm91cFhNTCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUWUxFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZTVFlMRVMgLS0tLS0tLVxubnMuTGlzdE9mU3R5bGVzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3R5bGVMaXN0ID0gW107XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmFkZFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcblx0dGhpcy5zdHlsZUxpc3QucHVzaChzdHlsZSk7XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGlzdE9mU3R5bGVzPlxcblwiO1xuXHRmb3IodmFyIGk9MDsgaTx0aGlzLnN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBzdHlsZSA9IHRoaXMuc3R5bGVMaXN0W2ldO1xuXHRcdHhtbFN0cmluZyArPSBzdHlsZS50b1hNTCgpO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIjwvbGlzdE9mU3R5bGVzPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTGlzdE9mU3R5bGVzLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgbnMuTGlzdE9mU3R5bGVzKCk7XG5cblx0dmFyIHN0eWxlcyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3R5bGUnKTtcblx0Zm9yICh2YXIgaT0wOyBpPHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBzdHlsZVhNTCA9IHN0eWxlc1tpXTtcblx0XHR2YXIgc3R5bGUgPSBucy5TdHlsZS5mcm9tWE1MKHN0eWxlWE1MKTtcblx0XHRsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoc3R5bGUpO1xuXHR9XG5cdHJldHVybiBsaXN0T2ZTdHlsZXM7XG59O1xuLy8gLS0tLS0tLSBFTkQgTElTVE9GU1RZTEVTIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXG5ucy5SZW5kZXJJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ3Byb2dyYW1OYW1lJywgXG5cdFx0J3Byb2dyYW1WZXJzaW9uJywgJ2JhY2tncm91bmRDb2xvcicsICdsaXN0T2ZDb2xvckRlZmluaXRpb25zJywgJ2xpc3RPZlN0eWxlcyddKTtcblx0dGhpcy5pZCBcdFx0XHRcdFx0PSBwYXJhbXMuaWQ7IC8vIHJlcXVpcmVkLCByZXN0IGlzIG9wdGlvbmFsXG5cdHRoaXMubmFtZSBcdFx0XHRcdFx0PSBwYXJhbXMubmFtZTtcblx0dGhpcy5wcm9ncmFtTmFtZSBcdFx0XHQ9IHBhcmFtcy5wcm9ncmFtTmFtZTtcblx0dGhpcy5wcm9ncmFtVmVyc2lvbiBcdFx0PSBwYXJhbXMucHJvZ3JhbVZlcnNpb247XG5cdHRoaXMuYmFja2dyb3VuZENvbG9yIFx0XHQ9IHBhcmFtcy5iYWNrZ3JvdW5kQ29sb3I7XG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IHBhcmFtcy5saXN0T2ZDb2xvckRlZmluaXRpb25zO1xuXHR0aGlzLmxpc3RPZlN0eWxlcyBcdFx0XHQ9IHBhcmFtcy5saXN0T2ZTdHlsZXM7XG5cdC8qdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0KTtcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcyhyZW5kZXJJbmZvLnN0eWxlRGVmKTtcblx0Ki9cbn07XG5cbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb24gPSBmdW5jdGlvbihsaXN0T2ZDb2xvckRlZmluaXRpb25zKSB7XG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XG59O1xuXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mU3R5bGVzID0gZnVuY3Rpb24obGlzdE9mU3R5bGVzKSB7XG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbGlzdE9mU3R5bGVzO1xufTtcblxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XG5cdC8vIHRhZyBhbmQgaXRzIGF0dHJpYnV0ZXNcblx0dmFyIHhtbFN0cmluZyA9IFwiPHJlbmRlckluZm9ybWF0aW9uXCI7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIG5hbWU9J1wiK3RoaXMubmFtZStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5wcm9ncmFtTmFtZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHByb2dyYW1OYW1lPSdcIit0aGlzLnByb2dyYW1OYW1lK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnByb2dyYW1WZXJzaW9uICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgcHJvZ3JhbVZlcnNpb249J1wiK3RoaXMucHJvZ3JhbVZlcnNpb24rXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuYmFja2dyb3VuZENvbG9yICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgYmFja2dyb3VuZENvbG9yPSdcIit0aGlzLmJhY2tncm91bmRDb2xvcitcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgeG1sbnM9J1wiK25zLnhtbG5zK1wiJz5cXG5cIjtcblxuXHQvLyBjaGlsZCBlbGVtZW50c1xuXHRpZiAodGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucy50b1hNTCgpO1xuXHR9XG5cdGlmICh0aGlzLmxpc3RPZlN0eWxlcykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmxpc3RPZlN0eWxlcy50b1hNTCgpO1xuXHR9XG5cblx0eG1sU3RyaW5nICs9IFwiPC9yZW5kZXJJbmZvcm1hdGlvbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbi8vIHN0YXRpYyBjb25zdHJ1Y3RvciBtZXRob2Rcbm5zLlJlbmRlckluZm9ybWF0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyBucy5SZW5kZXJJbmZvcm1hdGlvbigpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5pZCBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0cmVuZGVySW5mb3JtYXRpb24ubmFtZSBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtTmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtVmVyc2lvbiBcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbVZlcnNpb24nKTtcblx0cmVuZGVySW5mb3JtYXRpb24uYmFja2dyb3VuZENvbG9yIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdiYWNrZ3JvdW5kQ29sb3InKTtcblxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpWzBdO1xuXHR2YXIgbGlzdE9mU3R5bGVzWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZTdHlsZXMnKVswXTtcblx0aWYgKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwgIT0gbnVsbCkge1xuXHRcdHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCk7XG5cdH1cblx0aWYgKGxpc3RPZlN0eWxlc1hNTCAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzID0gbnMuTGlzdE9mU3R5bGVzLmZyb21YTUwobGlzdE9mU3R5bGVzWE1MKTtcblx0fVxuXG5cdHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcbn07XG4vLyAtLS0tLS0tIEVORCBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gbnM7IiwidmFyIHJlbmRlckV4dCA9IHJlcXVpcmUoJy4vbGlic2Jnbi1yZW5kZXItZXh0Jyk7XG52YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xuXG52YXIgbnMgPSB7fTtcblxubnMueG1sbnMgPSBcImh0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuM1wiO1xuXG4vLyAtLS0tLS0tIFNCR05CYXNlIC0tLS0tLS1cbi8qXG5cdEV2ZXJ5IHNiZ24gZWxlbWVudCBpbmhlcml0IGZyb20gdGhpcy4gQWxsb3dzIHRvIHB1dCBub3RlcyBldmVyeXdoZXJlLlxuKi9cbm5zLlNCR05CYXNlID0gZnVuY3Rpb24gKCkge1xuXG59O1xuLy8gLS0tLS0tLSBFTkQgU0JHTkJhc2UgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNCR04gLS0tLS0tLVxubnMuU2JnbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4bWxucycsICdtYXAnXSk7XG5cdHRoaXMueG1sbnMgXHQ9IHBhcmFtcy54bWxucztcblx0dGhpcy5tYXAgXHQ9IHBhcmFtcy5tYXA7XG59O1xuXG5ucy5TYmduLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLlNiZ24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuU2JnbjtcblxubnMuU2Jnbi5wcm90b3R5cGUuc2V0TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuXHR0aGlzLm1hcCA9IG1hcDtcbn07XG5cbm5zLlNiZ24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c2JnblwiO1xuXHRpZih0aGlzLnhtbG5zICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeG1sbnM9J1wiK3RoaXMueG1sbnMrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLm1hcCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubWFwLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9zYmduPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuU2Jnbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3NiZ24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzYmduLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBzYmduID0gbmV3IG5zLlNiZ24oKTtcblx0c2Jnbi54bWxucyA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3htbG5zJyk7XG5cblx0Ly8gZ2V0IGNoaWxkcmVuXG5cdHZhciBtYXBYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hcCcpWzBdO1xuXHRpZiAobWFwWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbWFwID0gbnMuTWFwLmZyb21YTUwobWFwWE1MKTtcblx0XHRzYmduLnNldE1hcChtYXApO1xuXHR9XG5cdHJldHVybiBzYmduO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNCR04gLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE1BUCAtLS0tLS0tXG5ucy5NYXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbGFuZ3VhZ2UnLCAnZXh0ZW5zaW9uJywgJ2dseXBocycsICdhcmNzJ10pO1xuXHR0aGlzLmlkIFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5sYW5ndWFnZSBcdD0gcGFyYW1zLmxhbmd1YWdlO1xuXHR0aGlzLmV4dGVuc2lvbiBcdD0gcGFyYW1zLmV4dGVuc2lvbjtcblx0dGhpcy5nbHlwaHMgXHQ9IHBhcmFtcy5nbHlwaHMgfHwgW107XG5cdHRoaXMuYXJjcyBcdFx0PSBwYXJhbXMuYXJjcyB8fCBbXTtcbn07XG5cbm5zLk1hcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5NYXAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuTWFwO1xuXG5ucy5NYXAucHJvdG90eXBlLnNldEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHRlbnNpb24pIHtcblx0dGhpcy5leHRlbnNpb24gPSBleHRlbnNpb247XG59O1xuXG5ucy5NYXAucHJvdG90eXBlLmFkZEdseXBoID0gZnVuY3Rpb24gKGdseXBoKSB7XG5cdHRoaXMuZ2x5cGhzLnB1c2goZ2x5cGgpO1xufTtcblxubnMuTWFwLnByb3RvdHlwZS5hZGRBcmMgPSBmdW5jdGlvbiAoYXJjKSB7XG5cdHRoaXMuYXJjcy5wdXNoKGFyYyk7XG59O1xuXG5ucy5NYXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bWFwXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMubGFuZ3VhZ2UgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBsYW5ndWFnZT0nXCIrdGhpcy5sYW5ndWFnZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cblx0Ly8gY2hpbGRyZW5cblx0aWYodGhpcy5leHRlbnNpb24gIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmV4dGVuc2lvbi50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5nbHlwaHNbaV0udG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuYXJjcy5sZW5ndGg7IGkrKykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmFyY3NbaV0udG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L21hcD5cXG5cIjtcblxuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTWFwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbWFwJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbWFwLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBtYXAgPSBuZXcgbnMuTWFwKCk7XG5cdG1hcC5pZCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdG1hcC5sYW5ndWFnZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2xhbmd1YWdlJyk7XG5cblx0Ly8gY2hpbGRyZW5cblx0dmFyIGV4dGVuc2lvblhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZXh0ZW5zaW9uJylbMF07XG5cdGlmIChleHRlbnNpb25YTUwgIT0gbnVsbCkge1xuXHRcdHZhciBleHRlbnNpb24gPSBucy5FeHRlbnNpb24uZnJvbVhNTChleHRlbnNpb25YTUwpO1xuXHRcdG1hcC5zZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcblx0fVxuXHR2YXIgZ2x5cGhzWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdnbHlwaCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBnbHlwaHNYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZ2x5cGggPSBucy5HbHlwaC5mcm9tWE1MKGdseXBoc1hNTFtpXSk7XG5cdFx0bWFwLmFkZEdseXBoKGdseXBoKTtcblx0fVxuXHR2YXIgYXJjc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYXJjJyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IGFyY3NYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgYXJjID0gbnMuQXJjLmZyb21YTUwoYXJjc1hNTFtpXSk7XG5cdFx0bWFwLmFkZEFyYyhhcmMpO1xuXHR9XG5cblx0cmV0dXJuIG1hcDtcbn07XG4vLyAtLS0tLS0tIEVORCBNQVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVYVEVOU0lPTlMgLS0tLS0tLVxubnMuRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuXHQvLyBjb25zaWRlciBmaXJzdCBvcmRlciBjaGlsZHJlbiwgYWRkIHRoZW0gd2l0aCB0aGVpciB0YWduYW1lIGFzIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0XG5cdC8vIHN0b3JlIHhtbE9iamVjdCBpZiBubyBzdXBwb3J0ZWQgcGFyc2luZyAodW5yZWNvZ25pemVkIGV4dGVuc2lvbnMpXG5cdC8vIGVsc2Ugc3RvcmUgaW5zdGFuY2Ugb2YgdGhlIGV4dGVuc2lvblxuXHR0aGlzLmxpc3QgPSB7fTtcblx0dGhpcy51bnN1cHBvcnRlZExpc3QgPSB7fTtcbn07XG5cbi8qbnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeG1sT2JqKSB7IC8vIGFkZCBzcGVjaWZpYyBleHRlbnNpb25cblx0dmFyIGV4dE5hbWUgPSB4bWxPYmoudGFnTmFtZTtcblx0Y29uc29sZS5sb2coXCJleHROYW1lXCIsIGV4dE5hbWUsIHhtbE9iaik7XG5cdGlmIChleHROYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCh4bWxPYmopO1xuXHRcdHRoaXMubGlzdFsncmVuZGVySW5mb3JtYXRpb24nXSA9IHJlbmRlckluZm9ybWF0aW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdHRoaXMubGlzdFsnYW5ub3RhdGlvbnMnXSA9IHhtbE9iajsgLy8gdG8gYmUgcGFyc2VkIGNvcnJlY3RseVxuXHR9XG5cdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0dGhpcy5saXN0W2V4dE5hbWVdID0geG1sT2JqO1xuXHR9XG59OyovXG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuXHRpZiAoZXh0ZW5zaW9uIGluc3RhbmNlb2YgcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uKSB7XG5cdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gZXh0ZW5zaW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dGVuc2lvbi5ub2RlVHlwZSA9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdC8vIGNhc2Ugd2hlcmUgcmVuZGVySW5mb3JtYXRpb24gaXMgcGFzc2VkIHVucGFyc2VkXG5cdFx0aWYgKGV4dGVuc2lvbi50YWdOYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dGVuc2lvbik7XG5cdFx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSByZW5kZXJJbmZvcm1hdGlvbjtcblx0XHR9XG5cdFx0dGhpcy51bnN1cHBvcnRlZExpc3RbZXh0ZW5zaW9uLnRhZ05hbWVdID0gZXh0ZW5zaW9uO1xuXHR9XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdHJldHVybiB0aGlzLmxpc3QuaGFzT3duUHJvcGVydHkoZXh0ZW5zaW9uTmFtZSk7XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdGlmICh0aGlzLmhhcyhleHRlbnNpb25OYW1lKSkge1xuXHRcdHJldHVybiB0aGlzLmxpc3RbZXh0ZW5zaW9uTmFtZV07XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxleHRlbnNpb24+XFxuXCI7XG5cdGZvciAodmFyIGV4dEluc3RhbmNlIGluIHRoaXMubGlzdCkge1xuXHRcdGlmIChleHRJbnN0YW5jZSA9PSBcInJlbmRlckluZm9ybWF0aW9uXCIpIHtcblx0XHRcdHhtbFN0cmluZyArPSB0aGlzLmdldChleHRJbnN0YW5jZSkudG9YTUwoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR4bWxTdHJpbmcgKz0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmdldChleHRJbnN0YW5jZSkpO1xuXHRcdH1cblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2V4dGVuc2lvbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkV4dGVuc2lvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2V4dGVuc2lvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGV4dGVuc2lvbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IG5zLkV4dGVuc2lvbigpO1xuXHR2YXIgY2hpbGRyZW4gPSB4bWxPYmouY2hpbGRyZW47XG5cdGZvciAodmFyIGk9MDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGV4dFhtbE9iaiA9IGNoaWxkcmVuW2ldO1xuXHRcdHZhciBleHROYW1lID0gZXh0WG1sT2JqLnRhZ05hbWU7XG5cdFx0Ly9leHRlbnNpb24uYWRkKGV4dEluc3RhbmNlKTtcblx0XHRpZiAoZXh0TmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRYbWxPYmopO1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChyZW5kZXJJbmZvcm1hdGlvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopOyAvLyB0byBiZSBwYXJzZWQgY29ycmVjdGx5XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgRVhURU5TSU9OUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gR0xZUEggLS0tLS0tLVxubnMuR2x5cGggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ2NvbXBhcnRtZW50UmVmJywgJ2xhYmVsJywgJ2Jib3gnLCAnZ2x5cGhNZW1iZXJzJywgJ3BvcnRzJywgJ3N0YXRlJywgJ2Nsb25lJ10pO1xuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLmNsYXNzXyBcdFx0PSBwYXJhbXMuY2xhc3NfO1xuXHR0aGlzLmNvbXBhcnRtZW50UmVmID0gcGFyYW1zLmNvbXBhcnRtZW50UmVmO1xuXG5cdC8vIGNoaWxkcmVuXG5cdHRoaXMubGFiZWwgXHRcdFx0PSBwYXJhbXMubGFiZWw7XG5cdHRoaXMuc3RhdGUgXHRcdFx0PSBwYXJhbXMuc3RhdGU7XG5cdHRoaXMuYmJveCBcdFx0XHQ9IHBhcmFtcy5iYm94O1xuXHR0aGlzLmNsb25lIFx0XHRcdD0gcGFyYW1zLmNsb25lO1xuXHR0aGlzLmdseXBoTWVtYmVycyBcdD0gcGFyYW1zLmdseXBoTWVtYmVycyB8fCBbXTsgLy8gY2FzZSBvZiBjb21wbGV4LCBjYW4gaGF2ZSBhcmJpdHJhcnkgbGlzdCBvZiBuZXN0ZWQgZ2x5cGhzXG5cdHRoaXMucG9ydHMgXHRcdFx0PSBwYXJhbXMucG9ydHMgfHwgW107XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5HbHlwaC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5HbHlwaDtcblxubnMuR2x5cGgucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24gKGxhYmVsKSB7XG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuXHR0aGlzLnN0YXRlID0gc3RhdGU7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0QmJveCA9IGZ1bmN0aW9uIChiYm94KSB7XG5cdHRoaXMuYmJveCA9IGJib3g7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0Q2xvbmUgPSBmdW5jdGlvbiAoY2xvbmUpIHtcblx0dGhpcy5jbG9uZSA9IGNsb25lO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLmFkZEdseXBoTWVtYmVyID0gZnVuY3Rpb24gKGdseXBoTWVtYmVyKSB7XG5cdHRoaXMuZ2x5cGhNZW1iZXJzLnB1c2goZ2x5cGhNZW1iZXIpO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLmFkZFBvcnQgPSBmdW5jdGlvbiAocG9ydCkge1xuXHR0aGlzLnBvcnRzLnB1c2gocG9ydCk7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxnbHlwaFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGNsYXNzPSdcIit0aGlzLmNsYXNzXytcIidcIjtcblx0fVxuXHRpZih0aGlzLmNvbXBhcnRtZW50UmVmICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgY29tcGFydG1lbnRSZWY9J1wiK3RoaXMuY29tcGFydG1lbnRSZWYrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdC8vIGNoaWxkcmVuXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmxhYmVsLnRvWE1MKCk7XG5cdH1cblx0aWYodGhpcy5zdGF0ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuc3RhdGUudG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLmJib3ggIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmJib3gudG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLmNsb25lICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5jbG9uZS50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaE1lbWJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5nbHlwaE1lbWJlcnNbaV0udG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMucG9ydHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5wb3J0c1tpXS50b1hNTCgpO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIjwvZ2x5cGg+XFxuXCI7XG5cblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkdseXBoLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZ2x5cGgnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnbHlwaCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZ2x5cGggPSBuZXcgbnMuR2x5cGgoKTtcblx0Z2x5cGguaWQgXHRcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdGdseXBoLmNsYXNzXyBcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cdGdseXBoLmNvbXBhcnRtZW50UmVmIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xuXG5cdHZhciBsYWJlbFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcblx0aWYgKGxhYmVsWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbGFiZWwgPSBucy5MYWJlbC5mcm9tWE1MKGxhYmVsWE1MKTtcblx0XHRnbHlwaC5zZXRMYWJlbChsYWJlbCk7XG5cdH1cblx0dmFyIHN0YXRlWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGF0ZScpWzBdO1xuXHRpZiAoc3RhdGVYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGF0ZSA9IG5zLlN0YXRlVHlwZS5mcm9tWE1MKHN0YXRlWE1MKTtcblx0XHRnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG5cdH1cblx0dmFyIGJib3hYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jib3gnKVswXTtcblx0aWYgKGJib3hYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBiYm94ID0gbnMuQmJveC5mcm9tWE1MKGJib3hYTUwpO1xuXHRcdGdseXBoLnNldEJib3goYmJveCk7XG5cdH1cblx0dmFyIGNsb25lWE1sID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjbG9uZScpWzBdO1xuXHRpZiAoY2xvbmVYTWwgIT0gbnVsbCkge1xuXHRcdHZhciBjbG9uZSA9IG5zLkNsb25lVHlwZS5mcm9tWE1MKGNsb25lWE1sKTtcblx0XHRnbHlwaC5zZXRDbG9uZShjbG9uZSk7XG5cdH1cblx0Ly8gbmVlZCBzcGVjaWFsIGNhcmUgYmVjYXVzZSBvZiByZWN1cnNpb24gb2YgbmVzdGVkIGdseXBoIG5vZGVzXG5cdC8vIHRha2Ugb25seSBmaXJzdCBsZXZlbCBnbHlwaHNcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkcmVuO1xuXHRmb3IgKHZhciBqPTA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykgeyAvLyBsb29wIHRocm91Z2ggYWxsIGZpcnN0IGxldmVsIGNoaWxkcmVuXG5cdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5bal07XG5cdFx0aWYgKGNoaWxkLnRhZ05hbWUgPT0gXCJnbHlwaFwiKSB7IC8vIGhlcmUgd2Ugb25seSB3YW50IHRoZSBnbHloIGNoaWxkcmVuXG5cdFx0XHR2YXIgZ2x5cGhNZW1iZXIgPSBucy5HbHlwaC5mcm9tWE1MKGNoaWxkKTsgLy8gcmVjdXJzaXZlIGNhbGwgb24gbmVzdGVkIGdseXBoXG5cdFx0XHRnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlcik7XG5cdFx0fVxuXHR9XG5cdHZhciBwb3J0c1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgncG9ydCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBwb3J0c1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwb3J0ID0gbnMuUG9ydC5mcm9tWE1MKHBvcnRzWE1MW2ldKTtcblx0XHRnbHlwaC5hZGRQb3J0KHBvcnQpO1xuXHR9XG5cdHJldHVybiBnbHlwaDtcbn07XG4vLyAtLS0tLS0tIEVORCBHTFlQSCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTEFCRUwgLS0tLS0tLVxubnMuTGFiZWwgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndGV4dCddKTtcblx0dGhpcy50ZXh0ID0gcGFyYW1zLnRleHQ7XG59O1xuXG5ucy5MYWJlbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5MYWJlbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5MYWJlbDtcblxubnMuTGFiZWwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGFiZWxcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLnRleHQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB0ZXh0PSdcIit0aGlzLnRleHQrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5MYWJlbC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2xhYmVsJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGFiZWwsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGxhYmVsID0gbmV3IG5zLkxhYmVsKCk7XG5cdGxhYmVsLnRleHQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0ZXh0Jyk7XG5cdHJldHVybiBsYWJlbDtcbn07XG4vLyAtLS0tLS0tIEVORCBMQUJFTCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gQkJPWCAtLS0tLS0tXG5ucy5CYm94ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneScsICd3JywgJ2gnXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcblx0dGhpcy53ID0gcGFyc2VGbG9hdChwYXJhbXMudyk7XG5cdHRoaXMuaCA9IHBhcnNlRmxvYXQocGFyYW1zLmgpO1xufTtcblxubnMuQmJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5CYm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkJib3g7XG5cbm5zLkJib3gucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8YmJveFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMudykpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgdz0nXCIrdGhpcy53K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLmgpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGg9J1wiK3RoaXMuaCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkJib3guZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdiYm94Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYmJveCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgYmJveCA9IG5ldyBucy5CYm94KCk7XG5cdGJib3gueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0YmJveC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRiYm94LncgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3cnKSk7XG5cdGJib3guaCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgnaCcpKTtcblx0cmV0dXJuIGJib3g7XG59O1xuLy8gLS0tLS0tLSBFTkQgQkJPWCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gU1RBVEUgLS0tLS0tLVxubnMuU3RhdGVUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3ZhbHVlJywgJ3ZhcmlhYmxlJ10pO1xuXHR0aGlzLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xuXHR0aGlzLnZhcmlhYmxlID0gcGFyYW1zLnZhcmlhYmxlO1xufTtcblxubnMuU3RhdGVUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHN0YXRlXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy52YWx1ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhbHVlPSdcIit0aGlzLnZhbHVlK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMudmFyaWFibGUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB2YXJpYWJsZT0nXCIrdGhpcy52YXJpYWJsZStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlN0YXRlVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3N0YXRlJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3RhdGUsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHN0YXRlID0gbmV3IG5zLlN0YXRlVHlwZSgpO1xuXHRzdGF0ZS52YWx1ZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdHN0YXRlLnZhcmlhYmxlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFyaWFibGUnKTtcblx0cmV0dXJuIHN0YXRlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUQVRFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBDTE9ORSAtLS0tLS0tXG5ucy5DbG9uZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnbGFiZWwnXSk7XG5cdHRoaXMubGFiZWwgPSBwYXJhbXMubGFiZWw7XG59O1xuXG5ucy5DbG9uZVR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Y2xvbmVcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLmxhYmVsICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbGFiZWw9J1wiK3RoaXMubGFiZWwrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5DbG9uZVR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdjbG9uZScpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNsb25lLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBjbG9uZSA9IG5ldyBucy5DbG9uZVR5cGUoKTtcblx0Y2xvbmUubGFiZWwgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuXHRyZXR1cm4gY2xvbmU7XG59O1xuLy8gLS0tLS0tLSBFTkQgQ0xPTkUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFBPUlQgLS0tLS0tLVxubnMuUG9ydCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICd4JywgJ3knXSk7XG5cdHRoaXMuaWQgPSBwYXJhbXMuaWQ7XG5cdHRoaXMueCBcdD0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSBcdD0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5Qb3J0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLlBvcnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuUG9ydDtcblxubnMuUG9ydC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxwb3J0XCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5Qb3J0LmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAncG9ydCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHBvcnQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHBvcnQgPSBuZXcgbnMuUG9ydCgpO1xuXHRwb3J0LnggXHQ9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0cG9ydC55IFx0PSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHBvcnQuaWQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRyZXR1cm4gcG9ydDtcbn07XG4vLyAtLS0tLS0tIEVORCBQT1JUIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBBUkMgLS0tLS0tLVxubnMuQXJjID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ2NsYXNzXycsICdzb3VyY2UnLCAndGFyZ2V0JywgJ3N0YXJ0JywgJ2VuZCcsICduZXh0cyddKTtcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLmNsYXNzXyA9IHBhcmFtcy5jbGFzc187XG5cdHRoaXMuc291cmNlID0gcGFyYW1zLnNvdXJjZTtcblx0dGhpcy50YXJnZXQgPSBwYXJhbXMudGFyZ2V0O1xuXG5cdHRoaXMuc3RhcnQgXHQ9IHBhcmFtcy5zdGFydDtcblx0dGhpcy5lbmQgXHQ9IHBhcmFtcy5lbmQ7XG5cdHRoaXMubmV4dHMgXHQ9IHBhcmFtcy5uZXh0cyB8fCBbXTtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5BcmMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQXJjO1xuXG5ucy5BcmMucHJvdG90eXBlLnNldFN0YXJ0ID0gZnVuY3Rpb24gKHN0YXJ0KSB7XG5cdHRoaXMuc3RhcnQgPSBzdGFydDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuc2V0RW5kID0gZnVuY3Rpb24gKGVuZCkge1xuXHR0aGlzLmVuZCA9IGVuZDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuYWRkTmV4dCA9IGZ1bmN0aW9uIChuZXh0KSB7XG5cdHRoaXMubmV4dHMucHVzaChuZXh0KTtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxhcmNcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYodGhpcy5jbGFzc18gIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBjbGFzcz0nXCIrdGhpcy5jbGFzc18rXCInXCI7XG5cdH1cblx0aWYodGhpcy5zb3VyY2UgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzb3VyY2U9J1wiK3RoaXMuc291cmNlK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgdGFyZ2V0PSdcIit0aGlzLnRhcmdldCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cblx0Ly8gY2hpbGRyZW5cblx0aWYodGhpcy5zdGFydCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuc3RhcnQudG9YTUwoKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMubmV4dHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5uZXh0c1tpXS50b1hNTCgpO1xuXHR9XG5cdGlmKHRoaXMuZW5kICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5lbmQudG9YTUwoKTtcblx0fVxuXHRcblx0eG1sU3RyaW5nICs9IFwiPC9hcmM+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5BcmMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdhcmMnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBhcmMsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGFyYyA9IG5ldyBucy5BcmMoKTtcblx0YXJjLmlkIFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdGFyYy5jbGFzc18gXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cdGFyYy5zb3VyY2UgXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuXHRhcmMudGFyZ2V0IFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcblxuXHR2YXIgc3RhcnRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0YXJ0JylbMF07XG5cdGlmIChzdGFydFhNTCAhPSBudWxsKSB7XG5cdFx0dmFyIHN0YXJ0ID0gbnMuU3RhcnRUeXBlLmZyb21YTUwoc3RhcnRYTUwpO1xuXHRcdGFyYy5zZXRTdGFydChzdGFydCk7XG5cdH1cblx0dmFyIG5leHRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKTtcblx0Zm9yICh2YXIgaT0wOyBpIDwgbmV4dFhNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBuZXh0ID0gbnMuTmV4dFR5cGUuZnJvbVhNTChuZXh0WE1MW2ldKTtcblx0XHRhcmMuYWRkTmV4dChuZXh0KTtcblx0fVxuXHR2YXIgZW5kWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdlbmQnKVswXTtcblx0aWYgKGVuZFhNTCAhPSBudWxsKSB7XG5cdFx0dmFyIGVuZCA9IG5zLkVuZFR5cGUuZnJvbVhNTChlbmRYTUwpO1xuXHRcdGFyYy5zZXRFbmQoZW5kKTtcblx0fVxuXG5cdHJldHVybiBhcmM7XG59O1xuXG4vLyAtLS0tLS0tIEVORCBBUkMgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNUQVJUVFlQRSAtLS0tLS0tXG5ucy5TdGFydFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5TdGFydFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c3RhcnRcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB4PSdcIit0aGlzLngrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeT0nXCIrdGhpcy55K1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuU3RhcnRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhcnQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGFydCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgc3RhcnQgPSBuZXcgbnMuU3RhcnRUeXBlKCk7XG5cdHN0YXJ0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdHN0YXJ0LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHJldHVybiBzdGFydDtcbn07XG4vLyAtLS0tLS0tIEVORCBTVEFSVFRZUEUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVORFRZUEUgLS0tLS0tLVxubnMuRW5kVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcbn07XG5cbm5zLkVuZFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8ZW5kXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeD0nXCIrdGhpcy54K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHk9J1wiK3RoaXMueStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkVuZFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdlbmQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBlbmQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGVuZCA9IG5ldyBucy5FbmRUeXBlKCk7XG5cdGVuZC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xuXHRlbmQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcblx0cmV0dXJuIGVuZDtcbn07XG4vLyAtLS0tLS0tIEVORCBFTkRUWVBFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBORVhUVFlQRSAtLS0tLS0tXG5ucy5OZXh0VHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcbn07XG5cbm5zLk5leHRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPG5leHRcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB4PSdcIit0aGlzLngrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeT0nXCIrdGhpcy55K1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTmV4dFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICduZXh0Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbmV4dCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgbmV4dCA9IG5ldyBucy5OZXh0VHlwZSgpO1xuXHRuZXh0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdG5leHQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcblx0cmV0dXJuIG5leHQ7XG59O1xuLy8gLS0tLS0tLSBFTkQgTkVYVFRZUEUgLS0tLS0tLVxuXG5ucy5yZW5kZXJFeHRlbnNpb24gPSByZW5kZXJFeHQ7XG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsInZhciBucyA9IHt9O1xuXG4vKlxuXHRndWFyYW50ZWVzIHRvIHJldHVybiBhbiBvYmplY3Qgd2l0aCBnaXZlbiBhcmdzIGJlaW5nIHNldCB0byBudWxsIGlmIG5vdCBwcmVzZW50LCBvdGhlciBhcmdzIHJldHVybmVkIGFzIGlzXG4qL1xubnMuY2hlY2tQYXJhbXMgPSBmdW5jdGlvbiAocGFyYW1zLCBuYW1lcykge1xuXHRpZiAodHlwZW9mIHBhcmFtcyA9PSBcInVuZGVmaW5lZFwiIHx8IHBhcmFtcyA9PSBudWxsKSB7XG5cdFx0cGFyYW1zID0ge307XG5cdH1cblx0aWYgKHR5cGVvZiBwYXJhbXMgIT0gJ29iamVjdCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW1zLiBPYmplY3Qgd2l0aCBuYW1lZCBwYXJhbWV0ZXJzIG11c3QgYmUgcGFzc2VkLlwiKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGFyZ05hbWUgPSBuYW1lc1tpXTtcblx0XHRpZiAodHlwZW9mIHBhcmFtc1thcmdOYW1lXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cGFyYW1zW2FyZ05hbWVdID0gbnVsbDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHBhcmFtcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuczsiXX0=

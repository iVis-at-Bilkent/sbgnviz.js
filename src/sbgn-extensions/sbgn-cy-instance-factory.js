var classes = require('../utilities/classes');
var libs = require('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

module.exports = function () {

	var elementUtilities, graphUtilities, undoRedoActionFunctions, optionUtilities;
	var refreshPaddings, options, cy;

	var sbgnCyInstance = function (param) {
		elementUtilities = param.elementUtilities;
		graphUtilities = param.graphUtilities;
		undoRedoActionFunctions = param.undoRedoActionFunctions;
		refreshPaddings = graphUtilities.refreshPaddings.bind(graphUtilities);

		optionUtilities = param.optionUtilities;
		options = optionUtilities.getOptions();

		// cy = param.sbgnCyInstance.getCy();

		/*
		 * Returns the coordinates of the point located on the given angle on the circle with the given centeral coordinates and radius.
		 */
		var getPointOnCircle = function(centerX, centerY, radius, angleInDegree) {
			var angleInRadian = angleInDegree * ( Math.PI / 180 ); // Convert degree to radian
			return {
				x: radius * Math.cos(angleInRadian) + centerX,
				y: -1 * radius * Math.sin(angleInRadian) + centerY // We multiply with -1 here because JS y coordinate sign is the oposite of the Mathamatical coordinates system
			};
		};

		/*
		 * Generates a polygon string approximating a circle with given center, radius, start, end angles and number of points to represent the circle
		 */
		var generateCircleString = function(centerX, centerY, radius, angleFrom, angleTo, numOfPoints) {
			var circleStr = "";
			var stepSize = ( angleTo - angleFrom ) / numOfPoints; // We will increment the current angle by step size in each iteration
			var currentAngle = angleFrom; // current angle will be updated in each iteration

			for ( var i = 0; i < numOfPoints; i++ ) {
				var point = getPointOnCircle(centerX, centerY, radius, currentAngle);
				currentAngle += stepSize;
				circleStr += point.x + " " + point.y + " ";
			}

			return circleStr;
		};

		/*
		 *  Generates a string representing processes/logical operators with ports.
		 *  lineHW: Half width of line through the circle to the intersection point
		 *  shapeHW: Half width of the shape discluding the ports (It is radius for the circular shapes)
		 *  type: Type of the shape discluding the ports. Options are 'circle', 'rectangle'
		 *  orientation: Orientation of the ports Options are 'horizontal', 'vertical'
		 */

		var generateShapeWithPortString = function(lineHW, shapeHW, type, orientation) {
			var polygonStr;
		    var numOfPoints = 30; // Number of points that both halves of circle will have
			if (orientation === 'horizontal') {
				var abovePoints, belowPoints;

				if (type === 'circle') {
					abovePoints = generateCircleString(0, 0, shapeHW, 180, 0, numOfPoints);
					belowPoints = generateCircleString(0, 0, shapeHW, 360, 180, numOfPoints);
				}
				else if (type === 'rectangle') {
					abovePoints = '-' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' ';
					belowPoints = shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' ';
				}

				polygonStr = "-1 -" + lineHW + " -" + shapeHW + " -" + lineHW + " ";
				polygonStr += abovePoints;
				polygonStr += shapeHW + " -" + lineHW + " 1 -" + lineHW + " 1 " + lineHW + " " + shapeHW + " " + lineHW + " ";
				polygonStr += belowPoints;
				polygonStr += "-" + shapeHW + " " + lineHW + " -1 " + lineHW;
			}
			else {
				var leftPoints, rightPoints;

				if (type === 'circle') {
					leftPoints = generateCircleString(0, 0, shapeHW, 90, 270, numOfPoints);
					rightPoints = generateCircleString(0, 0, shapeHW, -90, 90, numOfPoints);
				}
				else if (type === 'rectangle') {
					leftPoints = '-' + shapeHW + ' -' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' ';
					rightPoints = shapeHW + ' ' + shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' ';
				}

				polygonStr = "-" + lineHW + " -" + 1 + " -" + lineHW + " -" + shapeHW + " ";
				polygonStr += leftPoints;
				polygonStr += "-" + lineHW + " " + shapeHW + " -" + lineHW + " 1 " + lineHW + " 1 " + lineHW + " " + shapeHW + " ";
				polygonStr += rightPoints;
				polygonStr += lineHW + " -" + shapeHW + " " + lineHW + " -1";
			}

			return polygonStr;
		};

		// Note that in ChiSE this function is in a seperate file but in the viewer it has just 2 methods and so it is located in this file
	  function registerUndoRedoActions() {
	    // create or get the undo-redo instance
	    var ur = cy.undoRedo();

	    // register general actions
	    // register add remove actions
	    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
	    ur.action("deleteNodesSmart", undoRedoActionFunctions.deleteNodesSmart, undoRedoActionFunctions.restoreEles);
	    ur.action("setPortsOrdering", undoRedoActionFunctions.setPortsOrdering, undoRedoActionFunctions.setPortsOrdering);
	  }

	  function bindCyEvents() {
	    cy.on('tapend', 'node', function (event) {
	      cy.style().update();
	    });

	    cy.on("expandcollapse.beforecollapse", "node", function (event) {
	      var node = this;
	      //The children info of complex nodes should be shown when they are collapsed
	      if (node._private.data.class.startsWith("complex")) {
	        //The node is being collapsed store infolabel to use it later
	        var infoLabel = elementUtilities.getInfoLabel(node);
	        node._private.data.infoLabel = infoLabel;
	      }
	    });

	    cy.on("expandcollapse.aftercollapse", "node", function (event) {
	      var node = this;
	      // The width and height of just collapsed nodes should be 36, but they are supposed to be resizable. Therefore, we
	      // set their data('bbox') accordingly. We do not store their existing bbox.w and bbox.h because they have no significance for compounds (for now).
	      cy.startBatch();
	      var bbox = node.data('bbox');
	      bbox.w = 36;
	      bbox.h = 36;
	      node.data('bbox', bbox);
	      cy.endBatch();
	    });

	    cy.on("expandcollapse.beforeexpand", "node", function (event) {
	      var node = this;
	      node.removeData("infoLabel");
	    });

	    cy.on("expandcollapse.afterexpand", "node", function (event) {
	      var node = this;
	      cy.nodes().updateCompoundBounds();
	      //Don't show children info when the complex node is expanded
	      if (node._private.data.class.startsWith("complex")) {
	        node.removeStyle('content');
	      }
	    });

	    cy.on('layoutstop', function (event) {
				/*
				* 'preset' layout is called to give the initial positions of nodes by sbgnviz.
				* Seems like 'grid' layout is called by Cytoscape.js core in loading graphs.
				* If the layout is not one of these (normally it is supposed to be 'cose-bilkent')
				* and ports are enabled call 'elementUtilities.changePortsOrientationAfterLayout()'
				*/
	      if (event.layout.options.name !== 'preset' && event.layout.options.name !== 'grid')
	      {
	        if (graphUtilities.portsEnabled === true)
	        {
	          elementUtilities.changePortsOrientationAfterLayout();
	        }
	      }
	    });

	    $(document).on('updateGraphEnd', function(event, _cy, isLayoutRequired) {

				// if the event is not triggered for this cy instance return directly
				if ( _cy != cy ) {
					return;
				}

	      // list all entitytypes andstore them in the global scratch
	      // only stateful EPN (complex, macromolecule or nucleic acid) are concerned

	      // following is unapplied due to performance decreasing, adding something like 20% time on load
	      /*cy.startBatch();
	      var entityHash = {};
	      cy.nodes("[class='complex'], [class='macromolecule'], [class='nucleic acid feature']").forEach(function(node) {
	        // identify an entity by its label AND class
	        var label = node.data('label');
	        var _class = node.data('class');
	        var id=label+'-'+_class;
	        if(!entityHash.hasOwnProperty(id)) { // create entitytype if doesn't already exist
	          entityHash[id] = new classes.EntityType(id);
	        }
	        var currentEntityType = entityHash[id];
	        currentEntityType.EPNs.push(node); // assigne the current element to its corresponding entitytype

	        // collect all stateVariables of the current element, we need to assign StateVariableDefinitions to them
	        for(var i=0; i < node.data('statesandinfos').length; i++) {
	          var statesandinfos = node.data('statesandinfos')[i];
	          if(statesandinfos instanceof classes.StateVariable) { // stateVariable found
	            var currentStateVariable = statesandinfos;
	            currentEntityType.assignStateVariable(currentStateVariable);
	          }
	        }
	      });
	      cy.endBatch();
	      cy.scratch('_sbgnviz', {SBGNEntityTypes: entityHash});*/

	      // assign statesandinfos to their layout
	      cy.startBatch();
	      cy.nodes().forEach(function(node) {
	        node.data('auxunitlayouts', {});
	        // for each statesandinfos
	        for(var i=0; i < node.data('statesandinfos').length; i++) {
	          var statesandinfos = node.data('statesandinfos')[i];
						var bbox = statesandinfos.bbox;

						if (isLayoutRequired === undefined || !isLayoutRequired) {
							var position = node.position();
							var width = (node.data('class') == "compartment" || node.data('class') == "complex") ? node.data('bbox').w : node.width();
							var height = (node.data('class') == "compartment" || node.data('class') == "complex") ? node.data('bbox').h : node.height();
							var parentX = (node.data('class') == "compartment" || node.data('class') == "complex") ? node.data('bbox').x : position.x;
							var parentY = (node.data('class') == "compartment" || node.data('class') == "complex") ? node.data('bbox').y : position.y;

							classes.AuxiliaryUnit.setAnchorSide(statesandinfos, node);
							bbox.x = (bbox.x - parentX + bbox.w/2) * 100 / width;
							bbox.y = (bbox.y - parentY + bbox.h/2) * 100 / height;
							var location = statesandinfos.anchorSide; // top bottom right left
							var layouts = node.data('auxunitlayouts');
							if(!layouts[location]) { // layout doesn't exist yet for this location
								layouts[location] = classes.AuxUnitLayout.construct(node, location);
							}
		          // populate the layout of this side
		          classes.AuxUnitLayout.addAuxUnit(layouts[location], cy, statesandinfos, undefined, true); //positions are precomputed
						}
						else {
							if(!node.data('auxunitlayouts')) { // ensure minimal initialization
								node.data('auxunitlayouts', {});
							}
							var location = classes.AuxUnitLayout.selectNextAvailable(node, cy);
							if(!node.data('auxunitlayouts')[location]) {
								node.data('auxunitlayouts')[location] = classes.AuxUnitLayout.construct(node, location);
							}
							var layout = node.data('auxunitlayouts')[location];
							statesandinfos.anchorSide = location;
							switch(location) {
								case "top": statesandinfos.bbox.y = -50; break;
								case "bottom": statesandinfos.bbox.y = 50; break;
								case "left": statesandinfos.bbox.x = -50; break;
								case "right": statesandinfos.bbox.x = -50; break;
							}
							classes.AuxUnitLayout.addAuxUnit(layout, cy, statesandinfos);
						}

	        }

					if (isLayoutRequired === true) {
						var locations = classes.AuxUnitLayout.checkFit(node, cy);
						if (locations !== undefined && locations.length > 0) {
							classes.AuxUnitLayout.fitUnits(node, cy, locations);
						}
					}
	      });
	      cy.endBatch();
	    });
	  }

	  var selectionColor = '#d67614';
	  var sbgnStyleSheet = cytoscape.stylesheet()
	          .selector("node")
	          .css({
	            'text-valign': 'center',
	            'text-halign': 'center',
	            'text-opacity': 1,
	            'opacity': 1,
	            'padding': 0
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
			          // If node labels are expected to be adjusted automatically or element cannot have label
			          // or ele.data('font-size') is not defined return elementUtilities.getLabelTextSize()
								// else return ele.data('font-size')
			          var opt = options.adjustNodeLabelFontSizeAutomatically;
			          var adjust = typeof opt === 'function' ? opt() : opt;

			          if (!adjust && ele.data('font-size') != undefined) {
			            return ele.data('font-size');
			          }

			          return elementUtilities.getLabelTextSize(ele);
			        }
			      })
			      .selector("node[class][font-family]")
			      .style({
			        'font-family': function( ele ) {
								return ele.data('font-family');
							}
			      })
			      .selector("node[class][font-style]")
			      .style({
			        'font-style': function( ele ) {
								return ele.data('font-style')
							}
			      })
			      .selector("node[class][font-weight]")
			      .style({
			        'font-weight': function( ele ) {
								return ele.data('font-weight');
							}
			      })
			      .selector("node[class][color]")
			      .style({
			        'color': function( ele ) {
								return ele.data('color');
							}
			      })
			      .selector("node[class][background-color]")
			      .style({
			        'background-color': function( ele ) {
								return ele.data('background-color');
							}
			      })
			      .selector("node[class][background-opacity]")
			      .style({
			        'background-opacity': function( ele ) {
								return ele.data('background-opacity');
							}
			      })
			      .selector("node[class][border-width]")
			      .style({
			        'border-width': function( ele ) {
								return ele.data('border-width');
							}
			      })
			      .selector("node[class][border-color]")
			      .style({
			        'border-color': function( ele ) {
								return ele.data('border-color');
							}
			      })
			      .selector("node[class][text-wrap]")
			      .style({
			        'text-wrap': function( ele ) {
								return ele.data('text-wrap');
							}
			      })
						.selector("edge[class][line-color]")
			      .style({
			        'line-color': function( ele ) {
								return ele.data('line-color');
							},
			        'source-arrow-color': function( ele ) {
								return ele.data('line-color');
							},
			        'target-arrow-color': function( ele ) {
								return ele.data('line-color');
							}
			      })
			      .selector("edge[class][width]")
			      .style({
			        'width': function( ele ) {
								return ele.data('width');
							}
			      })
	          .selector("node[class='association'],[class='dissociation'],[class='and'],[class='or'],[class='not'],[class='process'],[class='omitted process'],[class='uncertain process']")
	          .css({
	            'shape-polygon-points': function(ele) {
	              if (graphUtilities.portsEnabled === true && ele.data('ports').length === 2) {
	                // We assume that the ports of the edge are symetric according to the node center so just checking one port is enough for us
	                var port = ele.data('ports')[0];
	                // If the ports are located above/below of the node then the orientation is 'vertical' else it is 'horizontal'
	                var orientation = port.x === 0 ? 'vertical' : 'horizontal';
	                // The half width of the actual shape discluding the ports
	                var shapeHW = orientation === 'vertical' ? 50 / Math.abs(port.y) : 50 / Math.abs(port.x);
	                // Get the class of the node
	                var _class = ele.data('class');
	                // If class is one of process, omitted process or uncertain process then the type of actual shape is 'rectangle' else it is 'circle'
	                var type = _class.endsWith('process') ? 'rectangle' : 'circle';

	                // Generate a polygon string with above parameters and return it
	                return generateShapeWithPortString(0.01, shapeHW, type, orientation);
	              }

	              // This element is not expected to have a poygonial shape (Because it does not have 2 ports) just return a trivial string here not to have a run time bug
	              return '-1 -1 1 1 1 0';
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
	          .selector("node:parent[class^='complex']") // start with complex
	          .css({
	            'text-valign': 'bottom',
	            'text-halign': 'center',
	            'text-margin-y': elementUtilities.getComplexMargin,
	            'padding': elementUtilities.getComplexPadding,
	            'compound-sizing-wrt-labels' : 'exclude',
	          })
	          .selector("node[class='compartment']")
	          .css({
	            'text-valign': 'bottom',
	            'text-halign': 'center',
	            'text-margin-y' : -1 * options.extraCompartmentPadding,
	            'compound-sizing-wrt-labels' : 'exclude',
	          })
	          .selector("node:parent[class='compartment']")
	          .css({
	            'padding': function() {
	              return graphUtilities.getCompoundPaddings() + options.extraCompartmentPadding;
	            }
	          })
	          .selector("node[class='submap']")
	          .css({
	            'text-valign': 'bottom',
	            'text-halign': 'center',
	            'text-margin-y' : -1 * options.extraCompartmentPadding,
	            'compound-sizing-wrt-labels' : 'exclude',
	          })
	          .selector("node:parent[class='submap']")
	          .css({
	            'padding': function() {
	              return graphUtilities.getCompoundPaddings() + options.extraCompartmentPadding;
	            }
	          })
	          .selector("node:childless[bbox]")
	          .css({
	            'width': 'data(bbox.w)',
	            'height': 'data(bbox.h)'
	          })
	          .selector("node:parent[minHeight]")
	          .css({
	            'min-height': function(ele) {
	              if (graphUtilities.compoundSizesConsidered) {
	                return ele.data('minHeight');
	              }

	              return 0;
	            }
	          })
	          .selector("node:parent[minHeightBiasTop]")
	          .css({
	            'min-height-bias-top': function(ele) {
	              var min = parseFloat(ele.data('minHeightBiasTop'));
	              return (min >= 0 ? min : 100) + '%';
	            }
	          })
	          .selector("node:parent[minHeightBiasBottom]")
	          .css({
	            'min-height-bias-bottom': function(ele) {
	              var min = parseFloat(ele.data('minHeightBiasBottom'));
	              return (min >= 0 ? min : 100) + '%';
	            }
	          })
	          .selector("node:parent[minWidth]")
	          .css({
	            'min-width': function(ele) {
	              if (graphUtilities.compoundSizesConsidered) {
	                return ele.data('minWidth');
	              }

	              return 0;
	            }
	          })
	          .selector("node:parent[minWidthBiasLeft]")
	          .css({
	            'min-width-bias-left': function(ele) {
	              var min = parseFloat(ele.data('minWidthBiasLeft'));
	              return (min >= 0 ? min : 100) + '%';
	            }
	          })
	          .selector("node:parent[minWidthBiasRight]")
	          .css({
	            'min-width-bias-right': function(ele) {
	              var min = parseFloat(ele.data('minWidthBiasRight'));
	              return (min >= 0 ? min : 100) + '%';
	            }
	          })
	          .selector("node.cy-expand-collapse-collapsed-node")
	          .css({
	            'border-style': 'dashed'
	          })
	          .selector("node:selected")
	          .css({
	            'border-color': selectionColor,
	            'target-arrow-color': '#000',
	            'text-outline-color': '#000'
	          })
	          .selector("node:active")
	          .css({
	            'background-opacity': 0.7, 'overlay-color': selectionColor,
	            'overlay-padding': '14'
	          })
	          .selector("edge")
	          .css({
	            'curve-style': 'bezier',
	            'target-arrow-fill': 'hollow',
	            'source-arrow-fill': 'hollow',
	            'text-border-color': function (ele) {
	              if (ele.selected()) {
	                return selectionColor;
	              }
	              return ele.css('line-color');
	            },
	            'color': function (ele) {
	              if (ele.selected()) {
	                return selectionColor;
	              }
	              return ele.css('line-color');
	            },
	            'arrow-scale': 1.25
	          })
	          .selector("edge.cy-expand-collapse-meta-edge")
	          .css({
	            'line-color': '#C4C4C4',
	            'source-arrow-color': '#C4C4C4',
	            'target-arrow-color': '#C4C4C4'
	          })
	          .selector("edge:selected")
	          .css({
	            'line-color': selectionColor,
	            'source-arrow-color': selectionColor,
	            'target-arrow-color': selectionColor
	          })
	          .selector("edge:active")
	          .css({
	            'background-opacity': 0.7, 'overlay-color': selectionColor,
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
	          .selector("edge[class='inhibition'],[class='negative influence']")
	          .css({
	            'target-arrow-fill': 'filled'
	          })
	          .selector("edge[class='production']")
	          .css({
	            'target-arrow-fill': 'filled'
	          })
	          .selector("core")
	          .css({
	            'selection-box-color': selectionColor,
	            'selection-box-opacity': '0.2', 'selection-box-border-color': selectionColor
	          });

    var sbgnNetworkContainer = $(options.networkContainerSelector);

    // create and init cytoscape:
    cytoscape({
      container: sbgnNetworkContainer,
      style: sbgnStyleSheet,
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function () {
				cy = this;
        // If undoable register undo/redo actions
        if (options.undoable) {
          registerUndoRedoActions();
        }
        bindCyEvents();
      }
    });
	};

	sbgnCyInstance.getCy = function () {
		return cy;
	};

	return sbgnCyInstance;
};

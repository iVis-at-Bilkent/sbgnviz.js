(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = function () {
  var commonAppUtilities = _dereq_('./common-app-utilities');
  var undoRedoActionFunctions = _dereq_('./undo-redo-action-functions');
  var sbgnElementUtilities = _dereq_('../../src/utilities/sbgn-element-utilities');
  
  var getExpandCollapseOptions = commonAppUtilities.getExpandCollapseOptions.bind(commonAppUtilities);
  var getInfoLabel = commonAppUtilities.getInfoLabel.bind(commonAppUtilities);
  var nodeQtipFunction = commonAppUtilities.nodeQtipFunction.bind(commonAppUtilities);
  var refreshUndoRedoButtonsStatus = commonAppUtilities.refreshUndoRedoButtonsStatus.bind(commonAppUtilities);
  var refreshPaddings = commonAppUtilities.refreshPaddings.bind(commonAppUtilities);
  var sbgnStyleRules = commonAppUtilities.sbgnStyleRules;

  $(document).ready(function ()
  {
    commonAppUtilities.sbgnNetworkContainer = $('#sbgn-network-container');
    // create and init cytoscape:
    var cy = cytoscape({
      container: commonAppUtilities.sbgnNetworkContainer,
      style: sbgnStyleSheet,
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function () {
        window.cy = this;
        registerUndoRedoActions();
        cytoscapeExtensionsAndContextMenu();
        bindCyEvents();
      }
    });
  });

  var sbgnStyleSheet = cytoscape.stylesheet()
          .selector("node")
          .css({
            'border-width': 1.5,
            'border-color': '#555',
            'background-color': '#f6f6f6',
            'font-size': 11,
            'background-opacity': 0.5,
            'text-opacity': 1,
            'opacity': 1
          })
          .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
          .css({
            'background-image': 'sample-app/sampleapp-images/clone_bg.png',
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
          .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='process'][sbgnclass!='association'][sbgnclass!='dissociation'][sbgnclass!='compartment'][sbgnclass!='source and sink']")
          .css({
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            },
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': function (ele) {
              return sbgnElementUtilities.getLabelTextSize(ele);
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
          .selector("node[sbgnclass='association']")
          .css({
            'background-color': '#6B6B6B'
          })
          .selector("node[sbgnclass='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[sbgnclass='complex']")
          .css({
            'background-color': '#F4F3EE',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            }
          })
          .selector("node[sbgnclass='compartment']")
          .css({
            'border-width': 3.75,
            'background-opacity': 0,
            'background-color': '#FFFFFF',
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            },
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
            'text-outline-color': '#000'})
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
              return ele.data('lineColor') || ele.css('line-color');
            },
            'color': function (ele) {
              if (ele.selected()) {
                return '#d67614';
              }
              return ele.data('lineColor') || ele.css('line-color');
            }
//          'target-arrow-shape': 'data(sbgnclass)'
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
          .selector("core")
          .css({
            'selection-box-color': '#d67614',
            'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
          })
          .selector(".ui-cytoscape-edgehandles-source")
          .css({
            'border-color': '#5CC2ED',
            'border-width': 3
          })
          .selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
          .css({
            'background-color': '#5CC2ED'
          })
          .selector("edge.ui-cytoscape-edgehandles-preview")
          .css({
            'line-color': '#5CC2ED'
          })
          .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
          .css({
            'shape': 'rectangle',
            'width': 15,
            'height': 15
          })
          .selector('edge.meta')
          .css({
            'line-color': '#C4C4C4',
            'source-arrow-color': '#C4C4C4',
            'target-arrow-color': '#C4C4C4'
          })
          .selector("edge.meta:selected")
          .css({
            'line-color': '#d67614',
            'source-arrow-color': '#d67614',
            'target-arrow-color': '#d67614'
          })
          .selector("node.changeBackgroundOpacity[backgroundOpacity]")
          .css({
            'background-opacity': 'data(backgroundOpacity)'
          })
          .selector("node.changeLabelTextSize")
          .css({
            'font-size': function (ele) {
              return sbgnElementUtilities.getLabelTextSize(ele);
            }
          })
          .selector("node.changeContent")
          .css({
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            }
          })
          .selector("node.changeBorderColor")
          .css({
            'border-color': 'data(borderColor)'
          })
          .selector("node.changeBorderColor:selected")
          .css({
            'border-color': '#d67614'
          })
          .selector("edge.changeLineColor")
          .css({
            'line-color': 'data(lineColor)',
            'source-arrow-color': 'data(lineColor)',
            'target-arrow-color': 'data(lineColor)'
          })
          .selector("edge.changeLineColor:selected")
          .css({
            'line-color': '#d67614',
            'source-arrow-color': '#d67614',
            'target-arrow-color': '#d67614'
          })
          .selector('edge.changeLineColor.meta')
          .css({
            'line-color': '#C4C4C4',
            'source-arrow-color': '#C4C4C4',
            'target-arrow-color': '#C4C4C4'
          })
          .selector("edge.changeLineColor.meta:selected")
          .css({
            'line-color': '#d67614',
            'source-arrow-color': '#d67614',
            'target-arrow-color': '#d67614'
          }).selector("node.changeClonedStatus")
          .css({
            'background-image-opacity': function (ele) {
              if (!ele.data('sbgnclonemarker')) {
                return 0;
              }
              return ele.css('background-opacity');
            }
          });
// end of sbgnStyleSheet

// Note that in ChiSE this function is in a seperate file but in the viewer it has just 2 methods and so it is located in this file
  function registerUndoRedoActions() {
    // create undo-redo instance
    var ur = cy.undoRedo({});

    // register general actions
    // register add remove actions
    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
    ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
  }

  function cytoscapeExtensionsAndContextMenu() {
    cy.expandCollapse(getExpandCollapseOptions());

    var contextMenus = cy.contextMenus({
      menuItemClasses: ['customized-context-menus-menu-item']
    });

    cy.edgeBendEditing({
      // this function specifies the positions of bend points
      bendPositionsFunction: function (ele) {
        return ele.data('bendPointPositions');
      },
      // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
      undoable: true,
      // title of remove bend point menu item
      removeBendMenuItemTitle: "Delete Bend Point",
      // whether to initilize bend points on creation of this extension automatically
      initBendPointsAutomatically: false
    });

    contextMenus.appendMenuItems([
      {
        id: 'ctx-menu-sbgn-properties',
        title: 'Properties...',
        coreAsWell: true,
        onClickFunction: function (event) {
          $("#sbgn-properties").trigger("click");
        }
      },
      {
        id: 'ctx-menu-delete',
        title: 'Delete',
        selector: 'node, edge',
        onClickFunction: function (event) {
          cy.undoRedo().do("deleteElesSimple", {
            eles: event.cyTarget
          });
        }
      },
      {
        id: 'ctx-menu-delete-selected',
        title: 'Delete Selected',
        onClickFunction: function () {
          $("#delete-selected-simple").trigger('click');
        },
        coreAsWell: true // Whether core instance have this item on cxttap
      },
      {
        id: 'ctx-menu-hide-selected',
        title: 'Hide Selected',
        onClickFunction: function () {
          $("#hide-selected").trigger('click');
        },
        coreAsWell: true // Whether core instance have this item on cxttap
      },
      {
        id: 'ctx-menu-show-all',
        title: 'Show All',
        onClickFunction: function () {
          $("#show-all").trigger('click');
        },
        coreAsWell: true // Whether core instance have this item on cxttap
      },
      {
        id: 'ctx-menu-expand', // ID of menu item
        title: 'Expand', // Title of menu item
        // Filters the elements to have this menu item on cxttap
        // If the selector is not truthy no elements will have this menu item on cxttap
        selector: 'node[expanded-collapsed="collapsed"]',
        onClickFunction: function (event) { // The function to be executed on click
          cy.undoRedo().do("expand", {
            nodes: event.cyTarget
          });
        }
      },
      {
        id: 'ctx-menu-collapse',
        title: 'Collapse',
        selector: 'node[expanded-collapsed!="collapsed"][sbgnclass="complex"],[expanded-collapsed!="collapsed"][sbgnclass="compartment"]',
        onClickFunction: function (event) {
          cy.undoRedo().do("collapse", {
            nodes: event.cyTarget
          });
        }
      },
      {
        id: 'ctx-menu-perform-layout',
        title: 'Perform Layout',
        onClickFunction: function () {
          $("#perform-layout").trigger('click');
        },
        coreAsWell: true // Whether core instance have this item on cxttap
      },
      {
        id: 'ctx-menu-biogene-properties',
        title: 'BioGene Properties',
        selector: 'node[sbgnclass="macromolecule"],[sbgnclass="nucleic acid feature"],[sbgnclass="unspecified entity"]',
        onClickFunction: function (event) {
          bioGeneQtip(event.cyTarget);
        }
      }
    ]);

    cy.clipboard({
      clipboardSize: 5, // Size of clipboard. 0 means unlimited. If size is exceeded, first added item in clipboard will be removed.
      shortcuts: {
        enabled: true, // Whether keyboard shortcuts are enabled
        undoable: true // and if undoRedo extension exists
      }
    });

    cy.viewUtilities({
      node: {
        highlighted: {
          'border-width': '10px'
        }, // styles for when nodes are highlighted.
        unhighlighted: {// styles for when nodes are unhighlighted.
          'opacity': function (ele) {
            return ele.css('opacity');
          }
        },
        hidden: {
          "display": "none"
        }
      },
      edge: {
        highlighted: {
          'width': '10px'
        }, // styles for when edges are highlighted.
        unhighlighted: {// styles for when edges are unhighlighted.
          'opacity': function (ele) {
            return ele.css('opacity');
          }
        },
        hidden: {
          "display": "none"
        }
      }
    });

    var panProps = ({
      fitPadding: 10,
      fitSelector: ':visible',
      animateOnFit: function () {
        return sbgnStyleRules['animate-on-drawing-changes'];
      },
      animateOnZoom: function () {
        return sbgnStyleRules['animate-on-drawing-changes'];
      }
    });

    commonAppUtilities.sbgnNetworkContainer.cytoscapePanzoom(panProps);
  }

  function bindCyEvents() {
    cy.on("beforeCollapse", "node", function (event) {
      var node = this;
      //The children info of complex nodes should be shown when they are collapsed
      if (node._private.data.sbgnclass == "complex") {
        //The node is being collapsed store infolabel to use it later
        var infoLabel = getInfoLabel(node);
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

    cy.on("afterDo", function (actionName, args) {
      refreshUndoRedoButtonsStatus();
    });

    cy.on("afterUndo", function (actionName, args) {
      refreshUndoRedoButtonsStatus();
    });

    cy.on("afterRedo", function (actionName, args) {
      refreshUndoRedoButtonsStatus();
    });

    cy.on('mouseover', 'node', function (event) {
      var node = this;

      $(".qtip").remove();

      if (event.originalEvent.shiftKey)
        return;

      node.qtipTimeOutFcn = setTimeout(function () {
        nodeQtipFunction(node);
      }, 1000);
    });

    cy.on('mouseout', 'node', function (event) {
      if (this.qtipTimeOutFcn != null) {
        clearTimeout(this.qtipTimeOutFcn);
        this.qtipTimeOutFcn = null;
      }
      this.mouseover = false;           //make preset layout to redraw the nodes
      cy.forceRender();
    });

    cy.on('tapend', 'node', function (event) {
      cy.style().update();
    });

    cy.on('tap', function (event) {
      $('input').blur();
    });

    cy.on('tap', 'node', function (event) {
      var node = this;

      $(".qtip").remove();

      if (event.originalEvent.shiftKey)
        return;

      if (node.qtipTimeOutFcn != null) {
        clearTimeout(node.qtipTimeOutFcn);
        node.qtipTimeOutFcn = null;
      }

      nodeQtipFunction(node);
    });
  }
};


},{"../../src/utilities/sbgn-element-utilities":10,"./common-app-utilities":4,"./undo-redo-action-functions":5}],2:[function(_dereq_,module,exports){
// Handle sbgnviz menu functions which are to be triggered on events
module.exports = function () {
  var BackboneViews = _dereq_('./backbone-views');
  var commonAppUtilities = _dereq_('./common-app-utilities');
  var sbgnmlToJson = _dereq_('../../src/utilities/sbgnml-to-json-converter');
  var jsonToSbgnml = _dereq_('../../src/utilities/json-to-sbgnml-converter');
  var sbgnElementUtilities = _dereq_('../../src/utilities/sbgn-element-utilities');
  var dialogUtilities = _dereq_('../../src/utilities/dialog-utilities');
  
  var setFileContent = commonAppUtilities.setFileContent.bind(commonAppUtilities);
  var startSpinner = commonAppUtilities.startSpinner.bind(commonAppUtilities);
  var endSpinner = commonAppUtilities.endSpinner.bind(commonAppUtilities);
  var beforePerformLayout = commonAppUtilities.beforePerformLayout.bind(commonAppUtilities);
  var sbgnvizUpdate = commonAppUtilities.sbgnvizUpdate.bind(commonAppUtilities);
  var dynamicResize = commonAppUtilities.dynamicResize.bind(commonAppUtilities);
  var sbgnStyleRules = commonAppUtilities.sbgnStyleRules;
  
  var sbgnLayoutProp, sbgnProperties, pathsBetweenQuery;

  $(document).ready(function ()
  {
    console.log('init the sbgnviz template/page');

    sbgnLayoutProp = commonAppUtilities.sbgnLayoutProp = new BackboneViews.SBGNLayout({el: '#sbgn-layout-table'});
    sbgnProperties = commonAppUtilities.sbgnProperties = new BackboneViews.SBGNProperties({el: '#sbgn-properties-table'});
    pathsBetweenQuery = commonAppUtilities.pathsBetweenQuery = new BackboneViews.PathsBetweenQuery({el: '#query-pathsbetween-table'});

    toolbarButtonsAndMenu();

    loadSample('neuronal_muscle_signalling.xml');

    $(window).on('resize', dynamicResize);
    dynamicResize();

  });

  function expandSelected() {
    var nodes = cy.nodes(":selected").filter("[expanded-collapsed='collapsed']");
    if (nodes.expandableNodes().length == 0) {
      return;
    }
    cy.undoRedo().do("expand", {
      nodes: nodes,
    });
  }

  function hideSelected() {
    var selectedEles = cy.$(":selected");
    if (selectedEles.length === 0) {
      return;
    }
    cy.undoRedo().do("hide", selectedEles);
  }

  function showSelected() {
    if (cy.elements(":selected").length === cy.elements(':visible').length) {
      return;
    }
    cy.undoRedo().do("show", cy.elements(":selected"));
  }

  function collapseSelected() {
    var nodes = cy.nodes(":selected");
    if (nodes.collapsibleNodes().length == 0) {
      return;
    }
    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  }

  function toolbarButtonsAndMenu() {

    $("#load-file, #load-file-icon").click(function () {
      $("#file-input").trigger('click');
    });

    $("#file-input").change(function () {
      if ($(this).val() != "") {
        var file = this.files[0];
        loadSBGNMLFile(file);
        $(this).val("");
      }
    });

    $("#node-legend").click(function (e) {
      e.preventDefault();
      dialogUtilities.openFancybox($("#node-legend-template"), {
        'autoDimensions': false,
        'width': 504,
        'height': 325
      });
    });

    $("#edge-legend").click(function (e) {
      e.preventDefault();
      dialogUtilities.openFancybox($("#edge-legend-template"), {
        'autoDimensions': false,
        'width': 325,
        'height': 285
      });
    });

    $("#quick-help").click(function (e) {
      e.preventDefault();
      dialogUtilities.openFancybox($("#quick-help-template"), {
        'autoDimensions': false,
        'width': 420,
        'height': "auto"
      });
    });

    $("#about").click(function (e) {
      e.preventDefault();
      dialogUtilities.openFancybox($("#about-template"), {
        'autoDimensions': false,
        'width': 300,
        'height': 320
      });
    });

    $("#load-sample1").click(function (e) {
      loadSample('neuronal_muscle_signalling.xml');
    });

    $("#load-sample2").click(function (e) {
      loadSample('CaM-CaMK_dependent_signaling_to_the_nucleus.xml');
    });

    $("#load-sample3").click(function (e) {
      loadSample('activated_stat1alpha_induction_of_the_irf1_gene.xml');
    });

    $("#load-sample4").click(function (e) {
      loadSample('glycolysis.xml');
    });

    $("#load-sample5").click(function (e) {
      loadSample('mapk_cascade.xml');
    });

    $("#load-sample6").click(function (e) {
      loadSample('polyq_proteins_interference.xml');
    });

    $("#load-sample7").click(function (e) {
      loadSample('insulin-like_growth_factor_signaling.xml');
    });

    $("#load-sample8").click(function (e) {
      loadSample('atm_mediated_phosphorylation_of_repair_proteins.xml');
    });

    $("#load-sample9").click(function (e) {
      loadSample('vitamins_b6_activation_to_pyridoxal_phosphate.xml');
    });

    $("#hide-selected, #hide-selected-icon").click(hideSelected);

    $("#show-selected, #show-selected-icon").click(showSelected); //TODO: remove weird feature (or fix)?

    $("#show-all").click(function (e) {
      if (cy.elements().length === cy.elements(':visible').length) {
        return;
      }
      cy.undoRedo().do("show", cy.elements());
    });

    $("#delete-selected-smart, #delete-selected-smart-icon").click(function (e) {
      var sel = cy.$(":selected");
      if (sel.length == 0) {
        return;
      }
      cy.undoRedo().do("deleteElesSmart", {
        firstTime: true,
        eles: sel
      });
    });

    $("#neighbors-of-selected, #highlight-neighbors-of-selected-icon").click(function (e) {
      var elesToHighlight = sbgnElementUtilities.getNeighboursOfSelected();
      if (elesToHighlight.length === 0) {
        return;
      }
      var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
      var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
      if (elesToHighlight.same(highlightedEles)) {
        return;
      }
      cy.undoRedo().do("highlight", elesToHighlight);
    });

    $("#search-by-label-icon").click(function (e) {
      var text = $("#search-by-label-text-box").val().toLowerCase();
      if (text.length == 0) {
        return;
      }
      cy.nodes().unselect();

      var nodesToSelect = cy.nodes(":visible").filter(function (i, ele) {
        if (ele.data("sbgnlabel") && ele.data("sbgnlabel").toLowerCase().indexOf(text) >= 0) {
          return true;
        }
        return false;
      });

      if (nodesToSelect.length == 0) {
        return;
      }
      nodesToSelect.select();

      var nodesToHighlight = sbgnElementUtilities.getProcessesOfSelected();
      cy.undoRedo().do("highlight", nodesToHighlight);
    });

    $("#search-by-label-text-box").keydown(function (e) {
      if (e.which === 13) {
        $("#search-by-label-icon").trigger('click');
      }
    });

    $("#highlight-search-menu-item").click(function (e) {
      $("#search-by-label-text-box").focus();
    });

    $("#processes-of-selected").click(function (e) {
      var elesToHighlight = sbgnElementUtilities.getProcessesOfSelected();
      if (elesToHighlight.length === 0) {
        return;
      }
      var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
      var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
      if (elesToHighlight.same(highlightedEles)) {
        return;
      }
      cy.undoRedo().do("highlight", elesToHighlight);
    });

    $("#remove-highlights, #remove-highlights-icon").click(function (e) {
      if (sbgnElementUtilities.noneIsNotHighlighted()) {
        return;
      }
      cy.undoRedo().do("removeHighlights");
    });

    $("#layout-properties").click(function (e) {
      sbgnLayoutProp.render();
    });

    $("#layout-properties-icon").click(function (e) {
      $("#layout-properties").trigger('click');
    });

    $("#delete-selected-simple, #delete-selected-simple-icon").click(function (e) {
      var selectedEles = cy.$(":selected");
      if (selectedEles.length == 0) {
        return;
      }
      cy.undoRedo().do("deleteElesSimple", {
        eles: selectedEles
      });
    });

    $("#sbgn-properties, #properties-icon").click(function (e) {
      sbgnProperties.render();
    });

    $("#query-pathsbetween").click(function (e) {
      pathsBetweenQuery.render();
    });

    $("#collapse-selected,#collapse-selected-icon").click(function (e) {
      collapseSelected();
    });

    $("#expand-selected,#expand-selected-icon").click(function (e) {
      expandSelected();
    });

    $("#collapse-complexes").click(function (e) {
      var complexes = cy.nodes("[sbgnclass='complex']");
      if (complexes.collapsibleNodes().length == 0) {
        return;
      }
      cy.undoRedo().do("collapseRecursively", {
        nodes: complexes
      });
    });
    $("#expand-complexes").click(function (e) {
      var nodes = cy.nodes(":selected").filter("[sbgnclass='complex'][expanded-collapsed='collapsed']");
      if (nodes.expandableNodes().length == 0) {
        return;
      }
      cy.undoRedo().do("expandRecursively", {
        nodes: nodes
      });
    });

    $("#collapse-all").click(function (e) {
      var nodes = cy.nodes(':visible');
      if (nodes.collapsibleNodes().length == 0) {
        return;
      }
      cy.undoRedo().do("collapseRecursively", {
        nodes: nodes
      });
    });

    $("#expand-all").click(function (e) {
      var nodes = cy.nodes(':visible').filter("[expanded-collapsed='collapsed']");
      if (nodes.expandableNodes().length == 0) {
        return;
      }
      cy.undoRedo().do("expandRecursively", {
        nodes: nodes
      });
    });

    $("#perform-layout-icon").click(function (e) {
      $("#perform-layout").trigger('click');
    });

    $("#perform-layout").click(function (e) {
      startSpinner("layout-spinner");
      beforePerformLayout();
      var preferences = {
        animate: sbgnStyleRules['animate-on-drawing-changes'] ? 'end' : false
      };
      if (sbgnLayoutProp.currentLayoutProperties.animate == 'during') {
        delete preferences.animate;
      }
      sbgnLayoutProp.applyLayout(preferences);
    });

    $("#undo-last-action, #undo-icon").click(function (e) {
      cy.undoRedo().undo();
    });

    $("#redo-last-action, #redo-icon").click(function (e) {
      cy.undoRedo().redo();
    });

    $("#save-as-png").click(function (evt) {
      var pngContent = cy.png({scale: 3, full: true});

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

      // this is to remove the beginning of the pngContent: data:img/png;base64,
      var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
      saveAs(b64toBlob(b64data, "image/png"), "network.png");
    });

    $("#save-as-jpg").click(function (evt) {
      var pngContent = cy.jpg({scale: 3, full: true});

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

      // this is to remove the beginning of the pngContent: data:img/png;base64,
      var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
      saveAs(b64toBlob(b64data, "image/jpg"), "network.jpg");
    });

    //TODO: could simply keep/store original input SBGN-ML data and use it here instead of converting from JSON
    $("#save-as-sbgnml").click(function (evt) {
      var sbgnmlText = jsonToSbgnml.createSbgnml();

      var blob = new Blob([sbgnmlText], {
        type: "text/plain;charset=utf-8;",
      });
      var filename = document.getElementById('file-name').innerHTML;
      saveAs(blob, filename);
    });

    $("#save-icon").click(function (evt) {
      $("#save-as-sbgnml").trigger('click');
    });

    commonAppUtilities.sbgnNetworkContainer.on("click", ".biogene-info .expandable", function (evt) {
      var expanderOpts = {slicePoint: 150,
        expandPrefix: ' ',
        expandText: ' (...)',
        userCollapseText: ' (show less)',
        moreClass: 'expander-read-more',
        lessClass: 'expander-read-less',
        detailClass: 'expander-details',
        expandEffect: 'fadeIn',
        collapseEffect: 'fadeOut'
      };
      $(".biogene-info .expandable").expander(expanderOpts);
      expanderOpts.slicePoint = 2;
      expanderOpts.widow = 0;
    });
  }

  function setFileContent(fileName) {
    var span = document.getElementById('file-name');
    while (span.firstChild) {
      span.removeChild(span.firstChild);
    }
    span.appendChild(document.createTextNode(fileName));
  }

  function loadSample(filename) {
    startSpinner("load-spinner");
    var xmlObject = loadXMLDoc('sample-app/samples/' + filename);
    setFileContent(filename.replace('xml', 'sbgnml'));
    setTimeout(function () {
      sbgnvizUpdate(sbgnmlToJson.convert(xmlObject));
      endSpinner("load-spinner");
    }, 0);
  }

  function loadSBGNMLFile(file) {
    startSpinner("load-file-spinner");
    $("#load-file-spinner").ready(function () {
      var textType = /text.*/;

      var reader = new FileReader();

      reader.onload = function (e) {
        var text = this.result;

        setTimeout(function () {
          sbgnvizUpdate(sbgnmlToJson.convert(textToXmlObject(text)));
          endSpinner("load-file-spinner");
        }, 0);
      };

      reader.readAsText(file);
      setFileContent(file.name);
    });
  }
  
  function loadXMLDoc(filename) {
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    }
    else {
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
  }

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

//Handle keyboard events
  $(document).keydown(function (e) {
    if (e.ctrlKey && e.target.nodeName === 'BODY') {
      if (e.which === 90) { // ctrl + z
        cy.undoRedo().undo();
      }
      else if (e.which === 89) { // ctrl + y
        cy.undoRedo().redo();
      }
    }
  });
};
},{"../../src/utilities/dialog-utilities":8,"../../src/utilities/json-to-sbgnml-converter":9,"../../src/utilities/sbgn-element-utilities":10,"../../src/utilities/sbgnml-to-json-converter":11,"./backbone-views":3,"./common-app-utilities":4}],3:[function(_dereq_,module,exports){
var commonAppUtilities = _dereq_('./common-app-utilities');
var sbgnmlToJson = _dereq_('../../src/utilities/sbgnml-to-json-converter');
var dialogUtilities = _dereq_('../../src/utilities/dialog-utilities');

var setFileContent = commonAppUtilities.setFileContent.bind(commonAppUtilities);
var startSpinner = commonAppUtilities.startSpinner.bind(commonAppUtilities);
var endSpinner = commonAppUtilities.endSpinner.bind(commonAppUtilities);
var sbgnvizUpdate = commonAppUtilities.sbgnvizUpdate.bind(commonAppUtilities);
var calculatePaddings = commonAppUtilities.calculatePaddings.bind(commonAppUtilities);
var sbgnStyleRules = commonAppUtilities.sbgnStyleRules;
var defaultSbgnStyleRules = commonAppUtilities.defaultSbgnStyleRules;
var refreshPaddings = commonAppUtilities.refreshPaddings.bind(commonAppUtilities);

/**
 * Backbone view for the BioGene information.
 */
var BioGeneView = Backbone.View.extend({
  /*
   * Copyright 2013 Memorial-Sloan Kettering Cancer Center.
   *
   * This file is part of PCViz.
   *
   * PCViz is free software: you can redistribute it and/or modify
   * it under the terms of the GNU Lesser General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   *
   * PCViz is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU Lesser General Public License for more details.
   *
   * You should have received a copy of the GNU Lesser General Public License
   * along with PCViz. If not, see <http://www.gnu.org/licenses/>.
   */

  render: function () {
    // pass variables in using Underscore.js template
    var variables = {
      geneDescription: this.model.geneDescription,
      geneAliases: this.parseDelimitedInfo(this.model.geneAliases, ":", ",", null),
      geneDesignations: this.parseDelimitedInfo(this.model.geneDesignations, ":", ",", null),
      geneLocation: this.model.geneLocation,
      geneMim: this.model.geneMim,
      geneId: this.model.geneId,
      geneUniprotId: this.extractFirstUniprotId(this.model.geneUniprotMapping),
      geneUniprotLinks: this.generateUniprotLinks(this.model.geneUniprotMapping),
      geneSummary: this.model.geneSummary
    };

    // compile the template using underscore
    var template = _.template($("#biogene-template").html());
    template = template(variables);

    // load the compiled HTML into the Backbone "el"
    this.$el.html(template);

    // format after loading
    this.format(this.model);

    return this;
  },
  format: function ()
  {
    // hide rows with undefined data
    if (this.model.geneDescription == undefined)
      this.$el.find(".biogene-description").hide();

    if (this.model.geneAliases == undefined)
      this.$el.find(".biogene-aliases").hide();

    if (this.model.geneDesignations == undefined)
      this.$el.find(".biogene-designations").hide();

    if (this.model.geneChromosome == undefined)
      this.$el.find(".biogene-chromosome").hide();

    if (this.model.geneLocation == undefined)
      this.$el.find(".biogene-location").hide();

    if (this.model.geneMim == undefined)
      this.$el.find(".biogene-mim").hide();

    if (this.model.geneId == undefined)
      this.$el.find(".biogene-id").hide();

    if (this.model.geneUniprotMapping == undefined)
      this.$el.find(".biogene-uniprot-links").hide();

    if (this.model.geneSummary == undefined)
      this.$el.find(".node-details-summary").hide();

    var expanderOpts = {slicePoint: 150,
      expandPrefix: ' ',
      expandText: ' (...)',
      userCollapseText: ' (show less)',
      moreClass: 'expander-read-more',
      lessClass: 'expander-read-less',
      detailClass: 'expander-details',
      // do not use default effects
      // (see https://github.com/kswedberg/jquery-expander/issues/46)
      expandEffect: 'fadeIn',
      collapseEffect: 'fadeOut'};

    $(".biogene-info .expandable").expander(expanderOpts);

    expanderOpts.slicePoint = 2; // show comma and the space
    expanderOpts.widow = 0; // hide everything else in any case
  },
  generateUniprotLinks: function (mapping) {
    var formatter = function (id) {
      return _.template($("#uniprot-link-template").html(), {id: id});
    };

    if (mapping == undefined || mapping == null)
    {
      return "";
    }

    // remove first id (assuming it is already processed)
    if (mapping.indexOf(':') < 0)
    {
      return "";
    }
    else
    {
      mapping = mapping.substring(mapping.indexOf(':') + 1);
      return ', ' + this.parseDelimitedInfo(mapping, ':', ',', formatter);
    }
  },
  extractFirstUniprotId: function (mapping) {
    if (mapping == undefined || mapping == null)
    {
      return "";
    }

    var parts = mapping.split(":");

    if (parts.length > 0)
    {
      return parts[0];
    }

    return "";
  },
  parseDelimitedInfo: function (info, delimiter, separator, formatter) {
    // do not process undefined or null values
    if (info == undefined || info == null)
    {
      return info;
    }

    var text = "";
    var parts = info.split(delimiter);

    if (parts.length > 0)
    {
      if (formatter)
      {
        text = formatter(parts[0]);
      }
      else
      {
        text = parts[0];
      }
    }

    for (var i = 1; i < parts.length; i++)
    {
      text += separator + " ";

      if (formatter)
      {
        text += formatter(parts[i]);
      }
      else
      {
        text += parts[i];
      }
    }

    return text;
  }
});

/**
 * SBGN Layout view for the Sample Application.
 */
var SBGNLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cose-bilkent',
    nodeRepulsion: 4500,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.25,
    numIter: 2500,
    tile: true,
    animationEasing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    animate: 'end',
    animationDuration: 1000,
    randomize: true,
    tilingPaddingVertical: function () {
      return calculatePaddings(parseInt(sbgnStyleRules['tiling-padding-vertical'], 10));
    },
    tilingPaddingHorizontal: function () {
      return calculatePaddings(parseInt(sbgnStyleRules['tiling-padding-horizontal'], 10));
    },
    gravityRangeCompound: 1.5,
    gravityCompound: 1.0,
    gravityRange: 3.8,
    stop: function () {
      endSpinner('layout-spinner');
    }
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html());
    self.template = self.template(templateProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: function (preferences, undoable) {
    if (preferences === undefined) {
      preferences = {};
    }
    var options = $.extend({}, this.currentLayoutProperties, preferences);
    if (undoable === false) {
      cy.elements().filter(':visible').layout(options);
    }
    else {
      cy.undoRedo().do("layout", {
        options: options,
        eles: cy.elements().filter(':visible')
      });
    }
  },
  render: function () {
    var self = this;

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html());
    self.template = self.template(templateProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#save-layout").on("click", "#save-layout", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      self.currentLayoutProperties.tile = document.getElementById("tile").checked;
      self.currentLayoutProperties.animate = document.getElementById("animate").checked ? 'during' : 'end';
      self.currentLayoutProperties.randomize = !document.getElementById("incremental").checked;
      self.currentLayoutProperties.gravityRangeCompound = Number(document.getElementById("gravity-range-compound").value);
      self.currentLayoutProperties.gravityCompound = Number(document.getElementById("gravity-compound").value);
      self.currentLayoutProperties.gravityRange = Number(document.getElementById("gravity-range").value);

      sbgnStyleRules['tiling-padding-vertical'] = Number(document.getElementById("tiling-padding-vertical").value);
      sbgnStyleRules['tiling-padding-horizontal'] = Number(document.getElementById("tiling-padding-horizontal").value);
    });

    $(document).off("click", "#default-layout").on("click", "#default-layout", function (evt) {
      self.copyProperties();

      sbgnStyleRules['tiling-padding-vertical'] = defaultSbgnStyleRules['tiling-padding-vertical'];
      sbgnStyleRules['tiling-padding-horizontal'] = defaultSbgnStyleRules['tiling-padding-horizontal'];

      var templateProperties = _.clone(self.currentLayoutProperties);
      templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
      templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

      self.template = _.template($("#layout-settings-template").html());
      self.template = self.template(templateProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

/**
 * SBGN Properties view for the Sample Application.
 */
var SBGNProperties = Backbone.View.extend({
  defaultSBGNProperties: {
    compoundPadding: parseInt(sbgnStyleRules['compound-padding'], 10),
    dynamicLabelSize: sbgnStyleRules['dynamic-label-size'],
    fitLabelsToNodes: sbgnStyleRules['fit-labels-to-nodes'],
    rearrangeAfterExpandCollapse: sbgnStyleRules['rearrange-after-expand-collapse'],
    animateOnDrawingChanges: sbgnStyleRules['animate-on-drawing-changes']
  },
  currentSBGNProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#sbgn-properties-template").html());
    self.template = self.template(self.currentSBGNProperties);
  },
  copyProperties: function () {
    this.currentSBGNProperties = _.clone(this.defaultSBGNProperties);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#sbgn-properties-template").html());
    self.template = self.template(self.currentSBGNProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#save-sbgn").on("click", "#save-sbgn", function (evt) {

      var param = {};
      param.firstTime = true;
      param.previousSBGNProperties = _.clone(self.currentSBGNProperties);

      self.currentSBGNProperties.compoundPadding = Number(document.getElementById("compound-padding").value);
      self.currentSBGNProperties.dynamicLabelSize = $('select[name="dynamic-label-size"] option:selected').val();
      self.currentSBGNProperties.fitLabelsToNodes = document.getElementById("fit-labels-to-nodes").checked;
      self.currentSBGNProperties.rearrangeAfterExpandCollapse =
              document.getElementById("rearrange-after-expand-collapse").checked;
      self.currentSBGNProperties.animateOnDrawingChanges =
              document.getElementById("animate-on-drawing-changes").checked;

      //Refresh paddings if needed
      if (sbgnStyleRules['compound-padding'] != self.currentSBGNProperties.compoundPadding) {
        sbgnStyleRules['compound-padding'] = self.currentSBGNProperties.compoundPadding;
        refreshPaddings();
      }
      //Refresh label size if needed
      if (sbgnStyleRules['dynamic-label-size'] != self.currentSBGNProperties.dynamicLabelSize) {
        sbgnStyleRules['dynamic-label-size'] = '' + self.currentSBGNProperties.dynamicLabelSize;
        cy.nodes().removeClass('changeLabelTextSize');
        cy.nodes().addClass('changeLabelTextSize');
      }
      //Refresh truncations if needed
      if (sbgnStyleRules['fit-labels-to-nodes'] != self.currentSBGNProperties.fitLabelsToNodes) {
        sbgnStyleRules['fit-labels-to-nodes'] = self.currentSBGNProperties.fitLabelsToNodes;
        cy.nodes().removeClass('changeContent');
        cy.nodes().addClass('changeContent');
      }

      sbgnStyleRules['rearrange-after-expand-collapse'] =
              self.currentSBGNProperties.rearrangeAfterExpandCollapse;

      sbgnStyleRules['animate-on-drawing-changes'] =
              self.currentSBGNProperties.animateOnDrawingChanges;
    });

    $(document).off("click", "#default-sbgn").on("click", "#default-sbgn", function (evt) {
      self.copyProperties();
      self.template = _.template($("#sbgn-properties-template").html());
      self.template = self.template(self.currentSBGNProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

/**
 * Paths Between Query view for the Sample Application.
 */
var PathsBetweenQuery = Backbone.View.extend({
  defaultQueryParameters: {
    geneSymbols: "",
    lengthLimit: 1
  },
  currentQueryParameters: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#query-pathsbetween-template").html());
    self.template = self.template(self.currentQueryParameters);
  },
  copyProperties: function () {
    this.currentQueryParameters = _.clone(this.defaultQueryParameters);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#query-pathsbetween-template").html());
    self.template = self.template(self.currentQueryParameters);
    $(self.el).html(self.template);

    $("#query-pathsbetween-enable-shortest-k-alteration").change(function (e) {
      if (document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked) {
        $("#query-pathsbetween-shortest-k").prop("disabled", false);
      } else {
        $("#query-pathsbetween-shortest-k").prop("disabled", true);
      }
    });

    dialogUtilities.openDialog(self.el, {width: 'auto'});

    $(document).off("click", "#save-query-pathsbetween").on("click", "#save-query-pathsbetween", function (evt) {

      self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);

      var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=PATHSBETWEEN&limit="
              + self.currentQueryParameters.lengthLimit;
      var sources = "";
      var filename = "";
      var geneSymbolsArray = self.currentQueryParameters.geneSymbols.replace("\n", " ").replace("\t", " ").split(" ");
      for (var i = 0; i < geneSymbolsArray.length; i++) {
        var currentGeneSymbol = geneSymbolsArray[i];
        if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
                || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
          continue;
        }
        sources = sources + "&source=" + currentGeneSymbol;
        if (filename == '') {
          filename = currentGeneSymbol;
        } else {
          filename = filename + '_' + currentGeneSymbol;
        }
      }
      filename = filename + '_PATHSBETWEEN.sbgnml';
      setFileContent(filename);

      startSpinner('paths-between-spinner');

      queryURL = queryURL + sources;
      $.ajax({
        url: queryURL,
        type: 'GET',
        success: function (data) {
          sbgnvizUpdate(sbgnmlToJson.convert(data));
          endSpinner('paths-between-spinner');
        }
      });

      $(self.el).dialog('close');
    });

    $(document).off("click", "#cancel-query-pathsbetween").on("click", "#cancel-query-pathsbetween", function (evt) {
      $(self.el).dialog('close');
    });

    return this;
  }
});

module.exports = {
  BioGeneView: BioGeneView,
  SBGNLayout: SBGNLayout,
  SBGNProperties: SBGNProperties,
  PathsBetweenQuery: PathsBetweenQuery
};
},{"../../src/utilities/dialog-utilities":8,"../../src/utilities/sbgnml-to-json-converter":11,"./common-app-utilities":4}],4:[function(_dereq_,module,exports){
var defaultSbgnStyleRules = {
  'compound-padding': 10,
  'dynamic-label-size': 'regular',
  'fit-labels-to-nodes': false,
  'rearrange-after-expand-collapse': true,
  'tiling-padding-vertical': 20,
  'tiling-padding-horizontal': 20,
  'animate-on-drawing-changes': true
};

var commonAppUtilities = commonAppUtilities || {
  sbgnNetworkContainer: undefined,
  sbgnLayoutProp: undefined,
  sbgnProperties: undefined,
  pathsBetweenQuery: undefined,
  defaultSbgnStyleRules: defaultSbgnStyleRules,
  sbgnStyleRules: _.clone(defaultSbgnStyleRules),
  setFileContent: function (fileName) {
    var span = document.getElementById('file-name');
    while (span.firstChild) {
      span.removeChild(span.firstChild);
    }
    span.appendChild(document.createTextNode(fileName));
  },
  triggerIncrementalLayout: function () {
    this.beforePerformLayout();
    var preferences = {
      randomize: false,
      animate: this.sbgnStyleRules['animate-on-drawing-changes'] ? 'end' : false,
      fit: false
    };
    if (this.sbgnLayoutProp.currentLayoutProperties.animate === 'during') {
      delete preferences.animate;
    }

    this.sbgnLayoutProp.applyLayout(preferences, false); // layout must not be undoable
  },
  beforePerformLayout: function() {
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
  },
  sbgnvizUpdate: function (cyGraph) {
    console.log('cy update called');
    // Reset undo/redo stack and buttons when a new graph is loaded
    cy.undoRedo().reset();
    this.resetUndoRedoButtons();
    cy.startBatch();
    // clear data
    cy.remove('*');
    cy.add(cyGraph);
    cy.nodes().addClass('changeLabelTextSize');
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
    }
    );
    this.refreshPaddings();
    cy.endBatch();
    cy.edgeBendEditing('get').initBendPoints(cy.edges());
  },
  getExpandCollapseOptions: function () {
    var self = this;
    return {
      fisheye: function () {
        return self.sbgnStyleRules['rearrange-after-expand-collapse'];
      },
      animate: function () {
        return self.sbgnStyleRules['animate-on-drawing-changes'];
      },
      layoutBy: function () {
        if (!self.sbgnStyleRules['rearrange-after-expand-collapse']) {
          return;
        }

        self.triggerIncrementalLayout();
      }
    };
  },
  dynamicResize: function () {
    var win = $(window);//$(this); //this = window

    var windowWidth = win.width();
    var windowHeight = win.height();
    var canvasWidth = 1000;
    var canvasHeight = 680;
    if (windowWidth > canvasWidth)
    {
      $("#sbgn-network-container").width(windowWidth * 0.9);
      var w = $("#sbgn-inspector-and-canvas").width();
      $(".nav-menu").width(w);
      $(".navbar").width(w);
      $("#sbgn-toolbar").width(w);
    }

    if (windowHeight > canvasHeight)
    {
      $("#sbgn-network-container").height(windowHeight * 0.85);
      $("#sbgn-inspector").height(windowHeight * 0.85);
    }
  },
  getInfoLabel: function (node) {
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
  nodeQtipFunction: function (node) {
    /*    * Check the sbgnlabel of the node if it is not valid
     * then check the infolabel if it is also not valid do not show qtip
     */
    var label = node._private.data.sbgnlabel;
    if (label == null || label == "")
      label = this.getInfoLabel(node);
    if (label == null || label == "")
      return;
    node.qtip({
      content: function () {
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
      show: {
        ready: true
      },
      position: {
        my: 'top center',
        at: 'bottom center',
        adjust: {
          cyViewport: true
        }
      },
      style: {
        classes: 'qtip-bootstrap',
        tip: {
          width: 16,
          height: 8
        }
      }
    });
  },
  refreshUndoRedoButtonsStatus: function () {
    var ur = cy.undoRedo();
    if (ur.isUndoStackEmpty()) {
      $("#undo-last-action").parent("li").addClass("disabled");
    }
    else {
      $("#undo-last-action").parent("li").removeClass("disabled");
    }

    if (ur.isRedoStackEmpty()) {
      $("#redo-last-action").parent("li").addClass("disabled");
    }
    else {
      $("#redo-last-action").parent("li").removeClass("disabled");
    }
  },
  resetUndoRedoButtons: function () {
    $("#undo-last-action").parent("li").addClass("disabled");
    $("#redo-last-action").parent("li").addClass("disabled");
  },
  calculatePaddings: function (paddingPercent) {
    //As default use the compound padding value
    if (!paddingPercent) {
      paddingPercent = parseInt(this.sbgnStyleRules['compound-padding'], 10);
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
  },
  calculateTilingPaddings: function() {
    return this.calculatePaddings();
  },
  calculateCompoundPaddings: function() {
    return this.calculatePaddings();
  },
  refreshPaddings: function () {
    var calc_padding = this.calculateCompoundPaddings();
    var nodes = cy.nodes();
    nodes.css('padding-left', 0);
    nodes.css('padding-right', 0);
    nodes.css('padding-top', 0);
    nodes.css('padding-bottom', 0);
    var compounds = nodes.filter('$node > node');
    compounds.css('padding-left', calc_padding);
    compounds.css('padding-right', calc_padding);
    compounds.css('padding-top', calc_padding);
    compounds.css('padding-bottom', calc_padding);
  },
  startSpinner: function (id) {

    if ($('.' + id).length === 0) {
      var containerWidth = $('#sbgn-network-container').width();
      var containerHeight = $('#sbgn-network-container').height();
      $('#sbgn-network-container:parent').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw ' + id + '"></i>');
    }
  },
  endSpinner: function (id) {
    if ($('.' + id).length > 0) {
      $('.' + id).remove();
    }
  }
};

module.exports = commonAppUtilities;
},{}],5:[function(_dereq_,module,exports){
var sbgnElementUtilities = _dereq_('../../src/utilities/sbgn-element-utilities');

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
},{"../../src/utilities/sbgn-element-utilities":10}],6:[function(_dereq_,module,exports){
(function(){
  var register = function(libs) {
    if (libs === undefined) {
      libs = {};
    }
    /*
    // get or require the libraries
    var $ = window.jQuery = window.$ = libs['jQuery'] || require('jQuery');
    // jquery browser here?
    var fancybox = libs['fancybox'] || require('../lib/js/jquery.fancybox-1.3.4')($);
    var jqueryExpander = libs['jquery-expander'] || require('jquery-expander')($);
    var qtip2 = libs['qtip2'] || require('qtip2'); // Check it
    var bootstrap = libs['bootstrap'] || require('bootstrap');
    //    Check it most probably it should be included in html
    var jqueryUIBundle = libs['jquery-ui-bundle'] || require('jquery-ui-bundle')($);
    var _ = window._ = libs['underscore'] || require('underscore');
    window.Backbone = libs['backbone'] || require('backbone');
    var cytoscape = window.cytoscape = libs['cytoscape'] || require('../lib/js/cytoscape');
    //    Check it most probably it should be included in html
    var filesaverjs = libs['filesaverjs'] ? libs['filesaverjs'] : require('filesaverjs');
    Backbone.$ = jQuery;  

    // jquery noty here?
    
    // Get cy extension instances
    var cyPanzoom = require('cytoscape-panzoom');
    var cyQtip = require('cytoscape-qtip'); 
    var cyCoseBilkent = require('cytoscape-cose-bilkent');
    var cyUndoRedo = require('cytoscape-undo-redo');
    var cyClipboard = require('cytoscape-clipboard');
    var cyContextMenus = require('cytoscape-context-menus');
    var cyExpandCollapse = require('cytoscape-expand-collapse');
    var cyEdgeBendEditing = require('cytoscape-edge-bend-editing');
    var cyViewUtilities = require('cytoscape-view-utilities');
    
    // Register cy extensions
    cyPanzoom( cytoscape );
    cyQtip( cytoscape, $ );
    cyCoseBilkent( cytoscape );
    cyUndoRedo( cytoscape );
    cyClipboard( cytoscape );
    cyContextMenus( cytoscape, $ );
    cyExpandCollapse( cytoscape, $ );
    cyEdgeBendEditing( cytoscape, $ );
    cyViewUtilities( cytoscape, $ );*/
    
    var sbgnRenderer = _dereq_('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var appCy = _dereq_('../sample-app/js/app-cy');
    var appMenu = _dereq_('../sample-app/js/app-menu');
    
    sbgnRenderer();
    appCy();
    appMenu();
    
  };
  
  module.exports = register;
})();
},{"../sample-app/js/app-cy":1,"../sample-app/js/app-menu":2,"./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer":7}],7:[function(_dereq_,module,exports){
module.exports = function () {
  var $$ = cytoscape;
  var truncateText = _dereq_('../utilities/text-utilities').truncateText;
//  var cyVariables = require('../cy-variables');
  
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

},{"../utilities/text-utilities":12}],8:[function(_dereq_,module,exports){
var dialogUtilities = {
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
  }
};

module.exports = dialogUtilities;



},{}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
var truncateText = _dereq_('./text-utilities').truncateText;
var sbgnStyleRules = _dereq_('../../sample-app/js/common-app-utilities').sbgnStyleRules;

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
        selectedEles = selectedEles.add(selectedEles.parents("node[sbgnclass='complex']"));
        selectedEles = selectedEles.add(selectedEles.descendants());
        var neighborhoodEles = selectedEles.neighborhood();
        var elesToHighlight = selectedEles.add(neighborhoodEles);
        elesToHighlight = elesToHighlight.add(elesToHighlight.descendants());
        return elesToHighlight;
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
    // Common element properties
    
    isEPNClass: function(sbgnclass) {
        return (sbgnclass == 'unspecified entity'
        || sbgnclass == 'simple chemical'
        || sbgnclass == 'macromolecule'
        || sbgnclass == 'nucleic acid feature'
        || sbgnclass == 'complex');
    },
    
    // Section End
    // Common element properties

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
      var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];

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
    }
    
    // Section End
    // Stylesheet helpers
};

module.exports = sbgnElementUtilities;

},{"../../sample-app/js/common-app-utilities":4,"./text-utilities":12}],11:[function(_dereq_,module,exports){
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
},{"./sbgn-element-utilities":10}],12:[function(_dereq_,module,exports){
var commonAppUtilities = _dereq_('../../sample-app/js/common-app-utilities');
var sbgnStyleRules = commonAppUtilities.sbgnStyleRules;

var textUtilities = {
  //TODO: use CSS's "text-overflow:ellipsis" style instead of function below?
  truncateText: function (textProp, font) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;
    var fitLabelsToNodes = sbgnStyleRules['fit-labels-to-nodes'];
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
},{"../../sample-app/js/common-app-utilities":4}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzYW1wbGUtYXBwL2pzL2FwcC1jeS5qcyIsInNhbXBsZS1hcHAvanMvYXBwLW1lbnUuanMiLCJzYW1wbGUtYXBwL2pzL2JhY2tib25lLXZpZXdzLmpzIiwic2FtcGxlLWFwcC9qcy9jb21tb24tYXBwLXV0aWxpdGllcy5qcyIsInNhbXBsZS1hcHAvanMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL2N5dG9zY2FwZS5yZW5kZXJlci5jYW52YXMuc2Jnbi1yZW5kZXJlci5qcyIsInNyYy91dGlsaXRpZXMvZGlhbG9nLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9zYmduLWVsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzljQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBjb21tb25BcHBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2NvbW1vbi1hcHAtdXRpbGl0aWVzJyk7XHJcbiAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG4gIHZhciBzYmduRWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvc2Jnbi1lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gIFxyXG4gIHZhciBnZXRFeHBhbmRDb2xsYXBzZU9wdGlvbnMgPSBjb21tb25BcHBVdGlsaXRpZXMuZ2V0RXhwYW5kQ29sbGFwc2VPcHRpb25zLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcclxuICB2YXIgZ2V0SW5mb0xhYmVsID0gY29tbW9uQXBwVXRpbGl0aWVzLmdldEluZm9MYWJlbC5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIG5vZGVRdGlwRnVuY3Rpb24gPSBjb21tb25BcHBVdGlsaXRpZXMubm9kZVF0aXBGdW5jdGlvbi5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMgPSBjb21tb25BcHBVdGlsaXRpZXMucmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1cy5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHJlZnJlc2hQYWRkaW5ncyA9IGNvbW1vbkFwcFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBzYmduU3R5bGVSdWxlcyA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduU3R5bGVSdWxlcztcclxuXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcclxuICB7XHJcbiAgICBjb21tb25BcHBVdGlsaXRpZXMuc2Jnbk5ldHdvcmtDb250YWluZXIgPSAkKCcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicpO1xyXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcclxuICAgIHZhciBjeSA9IGN5dG9zY2FwZSh7XHJcbiAgICAgIGNvbnRhaW5lcjogY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25OZXR3b3JrQ29udGFpbmVyLFxyXG4gICAgICBzdHlsZTogc2JnblN0eWxlU2hlZXQsXHJcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxyXG4gICAgICBib3hTZWxlY3Rpb25FbmFibGVkOiB0cnVlLFxyXG4gICAgICBtb3Rpb25CbHVyOiB0cnVlLFxyXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXHJcbiAgICAgIHJlYWR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmN5ID0gdGhpcztcclxuICAgICAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpO1xyXG4gICAgICAgIGN5dG9zY2FwZUV4dGVuc2lvbnNBbmRDb250ZXh0TWVudSgpO1xyXG4gICAgICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgdmFyIHNiZ25TdHlsZVNoZWV0ID0gY3l0b3NjYXBlLnN0eWxlc2hlZXQoKVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAxLjUsXHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmNmY2ZjYnLFxyXG4gICAgICAgICAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9zYmduY2xvbmVtYXJrZXJdW3NiZ25jbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnc2FtcGxlLWFwcC9zYW1wbGVhcHAtaW1hZ2VzL2Nsb25lX2JnLnBuZycsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnOiAnNTAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teSc6ICcxMDAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWhlaWdodCc6ICcyNSUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1maXQnOiAnbm9uZScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YSgnc2JnbmNsb25lbWFya2VyJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzc11bc2JnbmNsYXNzIT0nY29tcGxleCddW3NiZ25jbGFzcyE9J3Byb2Nlc3MnXVtzYmduY2xhc3MhPSdhc3NvY2lhdGlvbiddW3NiZ25jbGFzcyE9J2Rpc3NvY2lhdGlvbiddW3NiZ25jbGFzcyE9J2NvbXBhcnRtZW50J11bc2JnbmNsYXNzIT0nc291cmNlIGFuZCBzaW5rJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnY29udGVudCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0RWxlbWVudENvbnRlbnQoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzc11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldEN5U2hhcGUoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSdwZXJ0dXJiaW5nIGFnZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIC0wLjUsIDAsICAtMSwgMSwgICAxLCAxLCAgIDAuNSwgMCwgMSwgLTEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2Fzc29jaWF0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjNkI2QjZCJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSd0YWcnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNGNEYzRUUnLFxyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRFbGVtZW50Q29udGVudChlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2NvbXBhcnRtZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy43NSxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNGRkZGRkYnLFxyXG4gICAgICAgICAgICAnY29udGVudCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0RWxlbWVudENvbnRlbnQoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduYmJveF1bc2JnbmNsYXNzXVtzYmduY2xhc3MhPSdjb21wbGV4J11bc2JnbmNsYXNzIT0nY29tcGFydG1lbnQnXVtzYmduY2xhc3MhPSdzdWJtYXAnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKHNiZ25iYm94LncpJyxcclxuICAgICAgICAgICAgJ2hlaWdodCc6ICdkYXRhKHNiZ25iYm94LmgpJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd3aWR0aCc6IDM2LFxyXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzZcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjMDAwJyxcclxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ30pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOmFjdGl2ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnY3VydmUtc3R5bGUnOiAnYmV6aWVyJyxcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWZpbGwnOiAnaG9sbG93JyxcclxuICAgICAgICAgICAgJ3dpZHRoJzogMS41LFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmVDb2xvcicpIHx8IGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lQ29sb3InKSB8fCBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6ICdkYXRhKHNiZ25jbGFzcyknXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0ZXh0LXJvdGF0aW9uJzogJ2F1dG9yb3RhdGUnLFxyXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLXNoYXBlJzogJ3JlY3RhbmdsZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1vcGFjaXR5JzogJzEnLFxyXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItd2lkdGgnOiAnMScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtY29sb3InOiAnd2hpdGUnLFxyXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLW9wYWNpdHknOiAnMSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jbGFzcz0nY29uc3VtcHRpb24nXVtzYmduY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ3NiZ25jYXJkaW5hbGl0eScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnc291cmNlLXRleHQtbWFyZ2luLXknOiAnLTEwJyxcclxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3M9J3Byb2R1Y3Rpb24nXVtzYmduY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0YXJnZXQtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ3NiZ25jYXJkaW5hbGl0eScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtbWFyZ2luLXknOiAnLTEwJyxcclxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3NdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lBcnJvd1NoYXBlKGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctc2hhcGUnOiAnbm9uZSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jbGFzcz0naW5oaWJpdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jbGFzcz0ncHJvZHVjdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIi51aS1jeXRvc2NhcGUtZWRnZWhhbmRsZXMtc291cmNlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNUNDMkVEJyxcclxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDNcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCIudWktY3l0b3NjYXBlLWVkZ2VoYW5kbGVzLXRhcmdldCwgbm9kZS51aS1jeXRvc2NhcGUtZWRnZWhhbmRsZXMtcHJldmlld1wiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyM1Q0MyRUQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZS51aS1jeXRvc2NhcGUtZWRnZWhhbmRsZXMtcHJldmlld1wiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyM1Q0MyRUQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS51aS1jeXRvc2NhcGUtZWRnZWhhbmRsZXMtcHJldmlldywgbm9kZS5pbnRlcm1lZGlhdGVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUnOiAncmVjdGFuZ2xlJyxcclxuICAgICAgICAgICAgJ3dpZHRoJzogMTUsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAxNVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcignZWRnZS5tZXRhJylcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjQzRDNEM0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2UubWV0YTpzZWxlY3RlZFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS5jaGFuZ2VCYWNrZ3JvdW5kT3BhY2l0eVtiYWNrZ3JvdW5kT3BhY2l0eV1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogJ2RhdGEoYmFja2dyb3VuZE9wYWNpdHkpJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGUuY2hhbmdlTGFiZWxUZXh0U2l6ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGUuY2hhbmdlQ29udGVudFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRFbGVtZW50Q29udGVudChlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS5jaGFuZ2VCb3JkZXJDb2xvclwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnZGF0YShib3JkZXJDb2xvciknXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS5jaGFuZ2VCb3JkZXJDb2xvcjpzZWxlY3RlZFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlLmNoYW5nZUxpbmVDb2xvclwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJ2RhdGEobGluZUNvbG9yKScsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnZGF0YShsaW5lQ29sb3IpJyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICdkYXRhKGxpbmVDb2xvciknXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZS5jaGFuZ2VMaW5lQ29sb3I6c2VsZWN0ZWRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcignZWRnZS5jaGFuZ2VMaW5lQ29sb3IubWV0YScpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI0M0QzRDNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlLmNoYW5nZUxpbmVDb2xvci5tZXRhOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pLnNlbGVjdG9yKFwibm9kZS5jaGFuZ2VDbG9uZWRTdGF0dXNcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ3NiZ25jbG9uZW1hcmtlcicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuLy8gZW5kIG9mIHNiZ25TdHlsZVNoZWV0XHJcblxyXG4vLyBOb3RlIHRoYXQgaW4gQ2hpU0UgdGhpcyBmdW5jdGlvbiBpcyBpbiBhIHNlcGVyYXRlIGZpbGUgYnV0IGluIHRoZSB2aWV3ZXIgaXQgaGFzIGp1c3QgMiBtZXRob2RzIGFuZCBzbyBpdCBpcyBsb2NhdGVkIGluIHRoaXMgZmlsZVxyXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCkge1xyXG4gICAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oe30pO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xyXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGN5dG9zY2FwZUV4dGVuc2lvbnNBbmRDb250ZXh0TWVudSgpIHtcclxuICAgIGN5LmV4cGFuZENvbGxhcHNlKGdldEV4cGFuZENvbGxhcHNlT3B0aW9ucygpKTtcclxuXHJcbiAgICB2YXIgY29udGV4dE1lbnVzID0gY3kuY29udGV4dE1lbnVzKHtcclxuICAgICAgbWVudUl0ZW1DbGFzc2VzOiBbJ2N1c3RvbWl6ZWQtY29udGV4dC1tZW51cy1tZW51LWl0ZW0nXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kuZWRnZUJlbmRFZGl0aW5nKHtcclxuICAgICAgLy8gdGhpcyBmdW5jdGlvbiBzcGVjaWZpZXMgdGhlIHBvc2l0aW9ucyBvZiBiZW5kIHBvaW50c1xyXG4gICAgICBiZW5kUG9zaXRpb25zRnVuY3Rpb246IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JlbmRQb2ludFBvc2l0aW9ucycpO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyB3aGV0aGVyIHRoZSBiZW5kIGVkaXRpbmcgb3BlcmF0aW9ucyBhcmUgdW5kb2FibGUgKHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8uanMpXHJcbiAgICAgIHVuZG9hYmxlOiB0cnVlLFxyXG4gICAgICAvLyB0aXRsZSBvZiByZW1vdmUgYmVuZCBwb2ludCBtZW51IGl0ZW1cclxuICAgICAgcmVtb3ZlQmVuZE1lbnVJdGVtVGl0bGU6IFwiRGVsZXRlIEJlbmQgUG9pbnRcIixcclxuICAgICAgLy8gd2hldGhlciB0byBpbml0aWxpemUgYmVuZCBwb2ludHMgb24gY3JlYXRpb24gb2YgdGhpcyBleHRlbnNpb24gYXV0b21hdGljYWxseVxyXG4gICAgICBpbml0QmVuZFBvaW50c0F1dG9tYXRpY2FsbHk6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250ZXh0TWVudXMuYXBwZW5kTWVudUl0ZW1zKFtcclxuICAgICAge1xyXG4gICAgICAgIGlkOiAnY3R4LW1lbnUtc2Jnbi1wcm9wZXJ0aWVzJyxcclxuICAgICAgICB0aXRsZTogJ1Byb3BlcnRpZXMuLi4nLFxyXG4gICAgICAgIGNvcmVBc1dlbGw6IHRydWUsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICQoXCIjc2Jnbi1wcm9wZXJ0aWVzXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LWRlbGV0ZScsXHJcbiAgICAgICAgdGl0bGU6ICdEZWxldGUnLFxyXG4gICAgICAgIHNlbGVjdG9yOiAnbm9kZSwgZWRnZScsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHtcclxuICAgICAgICAgICAgZWxlczogZXZlbnQuY3lUYXJnZXRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGlkOiAnY3R4LW1lbnUtZGVsZXRlLXNlbGVjdGVkJyxcclxuICAgICAgICB0aXRsZTogJ0RlbGV0ZSBTZWxlY3RlZCcsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKFwiI2RlbGV0ZS1zZWxlY3RlZC1zaW1wbGVcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcmVBc1dlbGw6IHRydWUgLy8gV2hldGhlciBjb3JlIGluc3RhbmNlIGhhdmUgdGhpcyBpdGVtIG9uIGN4dHRhcFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1oaWRlLXNlbGVjdGVkJyxcclxuICAgICAgICB0aXRsZTogJ0hpZGUgU2VsZWN0ZWQnLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJChcIiNoaWRlLXNlbGVjdGVkXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb3JlQXNXZWxsOiB0cnVlIC8vIFdoZXRoZXIgY29yZSBpbnN0YW5jZSBoYXZlIHRoaXMgaXRlbSBvbiBjeHR0YXBcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGlkOiAnY3R4LW1lbnUtc2hvdy1hbGwnLFxyXG4gICAgICAgIHRpdGxlOiAnU2hvdyBBbGwnLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJChcIiNzaG93LWFsbFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29yZUFzV2VsbDogdHJ1ZSAvLyBXaGV0aGVyIGNvcmUgaW5zdGFuY2UgaGF2ZSB0aGlzIGl0ZW0gb24gY3h0dGFwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LWV4cGFuZCcsIC8vIElEIG9mIG1lbnUgaXRlbVxyXG4gICAgICAgIHRpdGxlOiAnRXhwYW5kJywgLy8gVGl0bGUgb2YgbWVudSBpdGVtXHJcbiAgICAgICAgLy8gRmlsdGVycyB0aGUgZWxlbWVudHMgdG8gaGF2ZSB0aGlzIG1lbnUgaXRlbSBvbiBjeHR0YXBcclxuICAgICAgICAvLyBJZiB0aGUgc2VsZWN0b3IgaXMgbm90IHRydXRoeSBubyBlbGVtZW50cyB3aWxsIGhhdmUgdGhpcyBtZW51IGl0ZW0gb24gY3h0dGFwXHJcbiAgICAgICAgc2VsZWN0b3I6ICdub2RlW2V4cGFuZGVkLWNvbGxhcHNlZD1cImNvbGxhcHNlZFwiXScsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHsgLy8gVGhlIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uIGNsaWNrXHJcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcclxuICAgICAgICAgICAgbm9kZXM6IGV2ZW50LmN5VGFyZ2V0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LWNvbGxhcHNlJyxcclxuICAgICAgICB0aXRsZTogJ0NvbGxhcHNlJyxcclxuICAgICAgICBzZWxlY3RvcjogJ25vZGVbZXhwYW5kZWQtY29sbGFwc2VkIT1cImNvbGxhcHNlZFwiXVtzYmduY2xhc3M9XCJjb21wbGV4XCJdLFtleHBhbmRlZC1jb2xsYXBzZWQhPVwiY29sbGFwc2VkXCJdW3NiZ25jbGFzcz1cImNvbXBhcnRtZW50XCJdJyxcclxuICAgICAgICBvbkNsaWNrRnVuY3Rpb246IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlXCIsIHtcclxuICAgICAgICAgICAgbm9kZXM6IGV2ZW50LmN5VGFyZ2V0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LXBlcmZvcm0tbGF5b3V0JyxcclxuICAgICAgICB0aXRsZTogJ1BlcmZvcm0gTGF5b3V0JyxcclxuICAgICAgICBvbkNsaWNrRnVuY3Rpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoXCIjcGVyZm9ybS1sYXlvdXRcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcmVBc1dlbGw6IHRydWUgLy8gV2hldGhlciBjb3JlIGluc3RhbmNlIGhhdmUgdGhpcyBpdGVtIG9uIGN4dHRhcFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1iaW9nZW5lLXByb3BlcnRpZXMnLFxyXG4gICAgICAgIHRpdGxlOiAnQmlvR2VuZSBQcm9wZXJ0aWVzJyxcclxuICAgICAgICBzZWxlY3RvcjogJ25vZGVbc2JnbmNsYXNzPVwibWFjcm9tb2xlY3VsZVwiXSxbc2JnbmNsYXNzPVwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0sW3NiZ25jbGFzcz1cInVuc3BlY2lmaWVkIGVudGl0eVwiXScsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIGJpb0dlbmVRdGlwKGV2ZW50LmN5VGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIF0pO1xyXG5cclxuICAgIGN5LmNsaXBib2FyZCh7XHJcbiAgICAgIGNsaXBib2FyZFNpemU6IDUsIC8vIFNpemUgb2YgY2xpcGJvYXJkLiAwIG1lYW5zIHVubGltaXRlZC4gSWYgc2l6ZSBpcyBleGNlZWRlZCwgZmlyc3QgYWRkZWQgaXRlbSBpbiBjbGlwYm9hcmQgd2lsbCBiZSByZW1vdmVkLlxyXG4gICAgICBzaG9ydGN1dHM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBXaGV0aGVyIGtleWJvYXJkIHNob3J0Y3V0cyBhcmUgZW5hYmxlZFxyXG4gICAgICAgIHVuZG9hYmxlOiB0cnVlIC8vIGFuZCBpZiB1bmRvUmVkbyBleHRlbnNpb24gZXhpc3RzXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGN5LnZpZXdVdGlsaXRpZXMoe1xyXG4gICAgICBub2RlOiB7XHJcbiAgICAgICAgaGlnaGxpZ2h0ZWQ6IHtcclxuICAgICAgICAgICdib3JkZXItd2lkdGgnOiAnMTBweCdcclxuICAgICAgICB9LCAvLyBzdHlsZXMgZm9yIHdoZW4gbm9kZXMgYXJlIGhpZ2hsaWdodGVkLlxyXG4gICAgICAgIHVuaGlnaGxpZ2h0ZWQ6IHsvLyBzdHlsZXMgZm9yIHdoZW4gbm9kZXMgYXJlIHVuaGlnaGxpZ2h0ZWQuXHJcbiAgICAgICAgICAnb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ29wYWNpdHknKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpZGRlbjoge1xyXG4gICAgICAgICAgXCJkaXNwbGF5XCI6IFwibm9uZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlZGdlOiB7XHJcbiAgICAgICAgaGlnaGxpZ2h0ZWQ6IHtcclxuICAgICAgICAgICd3aWR0aCc6ICcxMHB4J1xyXG4gICAgICAgIH0sIC8vIHN0eWxlcyBmb3Igd2hlbiBlZGdlcyBhcmUgaGlnaGxpZ2h0ZWQuXHJcbiAgICAgICAgdW5oaWdobGlnaHRlZDogey8vIHN0eWxlcyBmb3Igd2hlbiBlZGdlcyBhcmUgdW5oaWdobGlnaHRlZC5cclxuICAgICAgICAgICdvcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnb3BhY2l0eScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZGVuOiB7XHJcbiAgICAgICAgICBcImRpc3BsYXlcIjogXCJub25lXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBwYW5Qcm9wcyA9ICh7XHJcbiAgICAgIGZpdFBhZGRpbmc6IDEwLFxyXG4gICAgICBmaXRTZWxlY3RvcjogJzp2aXNpYmxlJyxcclxuICAgICAgYW5pbWF0ZU9uRml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNiZ25TdHlsZVJ1bGVzWydhbmltYXRlLW9uLWRyYXdpbmctY2hhbmdlcyddO1xyXG4gICAgICB9LFxyXG4gICAgICBhbmltYXRlT25ab29tOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNiZ25TdHlsZVJ1bGVzWydhbmltYXRlLW9uLWRyYXdpbmctY2hhbmdlcyddO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb21tb25BcHBVdGlsaXRpZXMuc2Jnbk5ldHdvcmtDb250YWluZXIuY3l0b3NjYXBlUGFuem9vbShwYW5Qcm9wcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBiaW5kQ3lFdmVudHMoKSB7XHJcbiAgICBjeS5vbihcImJlZm9yZUNvbGxhcHNlXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gICAgICAvL1RoZSBjaGlsZHJlbiBpbmZvIG9mIGNvbXBsZXggbm9kZXMgc2hvdWxkIGJlIHNob3duIHdoZW4gdGhleSBhcmUgY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgLy9UaGUgbm9kZSBpcyBiZWluZyBjb2xsYXBzZWQgc3RvcmUgaW5mb2xhYmVsIHRvIHVzZSBpdCBsYXRlclxyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBnZXRJbmZvTGFiZWwobm9kZSk7XHJcbiAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbCA9IGluZm9MYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcclxuICAgICAgLy8gcmVtb3ZlIGJlbmQgcG9pbnRzIGJlZm9yZSBjb2xsYXBzZVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcclxuICAgICAgICBpZiAoZWRnZS5oYXNDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKSkge1xyXG4gICAgICAgICAgZWRnZS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcclxuICAgICAgICAgIGRlbGV0ZSBlZGdlLl9wcml2YXRlLmNsYXNzZXNbJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJ107XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XHJcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlckNvbGxhcHNlXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gICAgICByZWZyZXNoUGFkZGluZ3MoKTtcclxuXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgbm9kZS5hZGRDbGFzcygnY2hhbmdlQ29udGVudCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImJlZm9yZUV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgbm9kZS5yZW1vdmVEYXRhKFwiaW5mb0xhYmVsXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlckV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgY3kubm9kZXMoKS51cGRhdGVDb21wb3VuZEJvdW5kcygpO1xyXG4gICAgICAvL0Rvbid0IHNob3cgY2hpbGRyZW4gaW5mbyB3aGVuIHRoZSBjb21wbGV4IG5vZGUgaXMgZXhwYW5kZWRcclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgICAgICBub2RlLnJlbW92ZVN0eWxlKCdjb250ZW50Jyk7XHJcbiAgICAgIH1cclxuICAgICAgcmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImFmdGVyRG9cIiwgZnVuY3Rpb24gKGFjdGlvbk5hbWUsIGFyZ3MpIHtcclxuICAgICAgcmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGFjdGlvbk5hbWUsIGFyZ3MpIHtcclxuICAgICAgcmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGFjdGlvbk5hbWUsIGFyZ3MpIHtcclxuICAgICAgcmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oJ21vdXNlb3ZlcicsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuXHJcbiAgICAgICQoXCIucXRpcFwiKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIG5vZGUucXRpcFRpbWVPdXRGY24gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlUXRpcEZ1bmN0aW9uKG5vZGUpO1xyXG4gICAgICB9LCAxMDAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKCdtb3VzZW91dCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLnF0aXBUaW1lT3V0RmNuICE9IG51bGwpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5xdGlwVGltZU91dEZjbik7XHJcbiAgICAgICAgdGhpcy5xdGlwVGltZU91dEZjbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5tb3VzZW92ZXIgPSBmYWxzZTsgICAgICAgICAgIC8vbWFrZSBwcmVzZXQgbGF5b3V0IHRvIHJlZHJhdyB0aGUgbm9kZXNcclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKCd0YXBlbmQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oJ3RhcCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAkKCdpbnB1dCcpLmJsdXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKCd0YXAnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcblxyXG4gICAgICAkKFwiLnF0aXBcIikucmVtb3ZlKCk7XHJcblxyXG4gICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudC5zaGlmdEtleSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAobm9kZS5xdGlwVGltZU91dEZjbiAhPSBudWxsKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KG5vZGUucXRpcFRpbWVPdXRGY24pO1xyXG4gICAgICAgIG5vZGUucXRpcFRpbWVPdXRGY24gPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2RlUXRpcEZ1bmN0aW9uKG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuIiwiLy8gSGFuZGxlIHNiZ252aXogbWVudSBmdW5jdGlvbnMgd2hpY2ggYXJlIHRvIGJlIHRyaWdnZXJlZCBvbiBldmVudHNcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIEJhY2tib25lVmlld3MgPSByZXF1aXJlKCcuL2JhY2tib25lLXZpZXdzJyk7XHJcbiAgdmFyIGNvbW1vbkFwcFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vY29tbW9uLWFwcC11dGlsaXRpZXMnKTtcclxuICB2YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcclxuICB2YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcclxuICB2YXIgc2JnbkVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi8uLi9zcmMvdXRpbGl0aWVzL3NiZ24tZWxlbWVudC11dGlsaXRpZXMnKTtcclxuICB2YXIgZGlhbG9nVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9kaWFsb2ctdXRpbGl0aWVzJyk7XHJcbiAgXHJcbiAgdmFyIHNldEZpbGVDb250ZW50ID0gY29tbW9uQXBwVXRpbGl0aWVzLnNldEZpbGVDb250ZW50LmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcclxuICB2YXIgc3RhcnRTcGlubmVyID0gY29tbW9uQXBwVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lci5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIGVuZFNwaW5uZXIgPSBjb21tb25BcHBVdGlsaXRpZXMuZW5kU3Bpbm5lci5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIGJlZm9yZVBlcmZvcm1MYXlvdXQgPSBjb21tb25BcHBVdGlsaXRpZXMuYmVmb3JlUGVyZm9ybUxheW91dC5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHNiZ252aXpVcGRhdGUgPSBjb21tb25BcHBVdGlsaXRpZXMuc2JnbnZpelVwZGF0ZS5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIGR5bmFtaWNSZXNpemUgPSBjb21tb25BcHBVdGlsaXRpZXMuZHluYW1pY1Jlc2l6ZS5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHNiZ25TdHlsZVJ1bGVzID0gY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25TdHlsZVJ1bGVzO1xyXG4gIFxyXG4gIHZhciBzYmduTGF5b3V0UHJvcCwgc2JnblByb3BlcnRpZXMsIHBhdGhzQmV0d2VlblF1ZXJ5O1xyXG5cclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKVxyXG4gIHtcclxuICAgIGNvbnNvbGUubG9nKCdpbml0IHRoZSBzYmdudml6IHRlbXBsYXRlL3BhZ2UnKTtcclxuXHJcbiAgICBzYmduTGF5b3V0UHJvcCA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduTGF5b3V0UHJvcCA9IG5ldyBCYWNrYm9uZVZpZXdzLlNCR05MYXlvdXQoe2VsOiAnI3NiZ24tbGF5b3V0LXRhYmxlJ30pO1xyXG4gICAgc2JnblByb3BlcnRpZXMgPSBjb21tb25BcHBVdGlsaXRpZXMuc2JnblByb3BlcnRpZXMgPSBuZXcgQmFja2JvbmVWaWV3cy5TQkdOUHJvcGVydGllcyh7ZWw6ICcjc2Jnbi1wcm9wZXJ0aWVzLXRhYmxlJ30pO1xyXG4gICAgcGF0aHNCZXR3ZWVuUXVlcnkgPSBjb21tb25BcHBVdGlsaXRpZXMucGF0aHNCZXR3ZWVuUXVlcnkgPSBuZXcgQmFja2JvbmVWaWV3cy5QYXRoc0JldHdlZW5RdWVyeSh7ZWw6ICcjcXVlcnktcGF0aHNiZXR3ZWVuLXRhYmxlJ30pO1xyXG5cclxuICAgIHRvb2xiYXJCdXR0b25zQW5kTWVudSgpO1xyXG5cclxuICAgIGxvYWRTYW1wbGUoJ25ldXJvbmFsX211c2NsZV9zaWduYWxsaW5nLnhtbCcpO1xyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZHluYW1pY1Jlc2l6ZSk7XHJcbiAgICBkeW5hbWljUmVzaXplKCk7XHJcblxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBleHBhbmRTZWxlY3RlZCgpIHtcclxuICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmZpbHRlcihcIltleHBhbmRlZC1jb2xsYXBzZWQ9J2NvbGxhcHNlZCddXCIpO1xyXG4gICAgaWYgKG5vZGVzLmV4cGFuZGFibGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhpZGVTZWxlY3RlZCgpIHtcclxuICAgIHZhciBzZWxlY3RlZEVsZXMgPSBjeS4kKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgc2VsZWN0ZWRFbGVzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dTZWxlY3RlZCgpIHtcclxuICAgIGlmIChjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKS5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZVNlbGVjdGVkKCkge1xyXG4gICAgdmFyIG5vZGVzID0gY3kubm9kZXMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICBpZiAobm9kZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b29sYmFyQnV0dG9uc0FuZE1lbnUoKSB7XHJcblxyXG4gICAgJChcIiNsb2FkLWZpbGUsICNsb2FkLWZpbGUtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoXCIjZmlsZS1pbnB1dFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNmaWxlLWlucHV0XCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9IFwiXCIpIHtcclxuICAgICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZXNbMF07XHJcbiAgICAgICAgbG9hZFNCR05NTEZpbGUoZmlsZSk7XHJcbiAgICAgICAgJCh0aGlzKS52YWwoXCJcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbm9kZS1sZWdlbmRcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkZhbmN5Ym94KCQoXCIjbm9kZS1sZWdlbmQtdGVtcGxhdGVcIiksIHtcclxuICAgICAgICAnYXV0b0RpbWVuc2lvbnMnOiBmYWxzZSxcclxuICAgICAgICAnd2lkdGgnOiA1MDQsXHJcbiAgICAgICAgJ2hlaWdodCc6IDMyNVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZWRnZS1sZWdlbmRcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkZhbmN5Ym94KCQoXCIjZWRnZS1sZWdlbmQtdGVtcGxhdGVcIiksIHtcclxuICAgICAgICAnYXV0b0RpbWVuc2lvbnMnOiBmYWxzZSxcclxuICAgICAgICAnd2lkdGgnOiAzMjUsXHJcbiAgICAgICAgJ2hlaWdodCc6IDI4NVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjcXVpY2staGVscFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGRpYWxvZ1V0aWxpdGllcy5vcGVuRmFuY3lib3goJChcIiNxdWljay1oZWxwLXRlbXBsYXRlXCIpLCB7XHJcbiAgICAgICAgJ2F1dG9EaW1lbnNpb25zJzogZmFsc2UsXHJcbiAgICAgICAgJ3dpZHRoJzogNDIwLFxyXG4gICAgICAgICdoZWlnaHQnOiBcImF1dG9cIlxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjYWJvdXRcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkZhbmN5Ym94KCQoXCIjYWJvdXQtdGVtcGxhdGVcIiksIHtcclxuICAgICAgICAnYXV0b0RpbWVuc2lvbnMnOiBmYWxzZSxcclxuICAgICAgICAnd2lkdGgnOiAzMDAsXHJcbiAgICAgICAgJ2hlaWdodCc6IDMyMFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGUxXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ25ldXJvbmFsX211c2NsZV9zaWduYWxsaW5nLnhtbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNsb2FkLXNhbXBsZTJcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgbG9hZFNhbXBsZSgnQ2FNLUNhTUtfZGVwZW5kZW50X3NpZ25hbGluZ190b190aGVfbnVjbGV1cy54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGUzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ2FjdGl2YXRlZF9zdGF0MWFscGhhX2luZHVjdGlvbl9vZl90aGVfaXJmMV9nZW5lLnhtbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNsb2FkLXNhbXBsZTRcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgbG9hZFNhbXBsZSgnZ2x5Y29seXNpcy54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU1XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ21hcGtfY2FzY2FkZS54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU2XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ3BvbHlxX3Byb3RlaW5zX2ludGVyZmVyZW5jZS54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU3XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ2luc3VsaW4tbGlrZV9ncm93dGhfZmFjdG9yX3NpZ25hbGluZy54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU4XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ2F0bV9tZWRpYXRlZF9waG9zcGhvcnlsYXRpb25fb2ZfcmVwYWlyX3Byb3RlaW5zLnhtbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNsb2FkLXNhbXBsZTlcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgbG9hZFNhbXBsZSgndml0YW1pbnNfYjZfYWN0aXZhdGlvbl90b19weXJpZG94YWxfcGhvc3BoYXRlLnhtbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNoaWRlLXNlbGVjdGVkLCAjaGlkZS1zZWxlY3RlZC1pY29uXCIpLmNsaWNrKGhpZGVTZWxlY3RlZCk7XHJcblxyXG4gICAgJChcIiNzaG93LXNlbGVjdGVkLCAjc2hvdy1zZWxlY3RlZC1pY29uXCIpLmNsaWNrKHNob3dTZWxlY3RlZCk7IC8vVE9ETzogcmVtb3ZlIHdlaXJkIGZlYXR1cmUgKG9yIGZpeCk/XHJcblxyXG4gICAgJChcIiNzaG93LWFsbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoY3kuZWxlbWVudHMoKS5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cygpKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZGVsZXRlLXNlbGVjdGVkLXNtYXJ0LCAjZGVsZXRlLXNlbGVjdGVkLXNtYXJ0LWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHNlbCA9IGN5LiQoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgIGlmIChzZWwubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTbWFydFwiLCB7XHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICAgIGVsZXM6IHNlbFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbmVpZ2hib3JzLW9mLXNlbGVjdGVkLCAjaGlnaGxpZ2h0LW5laWdoYm9ycy1vZi1zZWxlY3RlZC1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSBzYmduRWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZTZWxlY3RlZCgpO1xyXG4gICAgICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XHJcbiAgICAgIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgICAgIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2VhcmNoLWJ5LWxhYmVsLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHRleHQgPSAkKFwiI3NlYXJjaC1ieS1sYWJlbC10ZXh0LWJveFwiKS52YWwoKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICBpZiAodGV4dC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS5ub2RlcygpLnVuc2VsZWN0KCk7XHJcblxyXG4gICAgICB2YXIgbm9kZXNUb1NlbGVjdCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgICBpZiAoZWxlLmRhdGEoXCJzYmdubGFiZWxcIikgJiYgZWxlLmRhdGEoXCJzYmdubGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID49IDApIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKG5vZGVzVG9TZWxlY3QubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgbm9kZXNUb1NlbGVjdC5zZWxlY3QoKTtcclxuXHJcbiAgICAgIHZhciBub2Rlc1RvSGlnaGxpZ2h0ID0gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZCgpO1xyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNzZWFyY2gtYnktbGFiZWwtdGV4dC1ib3hcIikua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoZS53aGljaCA9PT0gMTMpIHtcclxuICAgICAgICAkKFwiI3NlYXJjaC1ieS1sYWJlbC1pY29uXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjaGlnaGxpZ2h0LXNlYXJjaC1tZW51LWl0ZW1cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgJChcIiNzZWFyY2gtYnktbGFiZWwtdGV4dC1ib3hcIikuZm9jdXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjcHJvY2Vzc2VzLW9mLXNlbGVjdGVkXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRQcm9jZXNzZXNPZlNlbGVjdGVkKCk7XHJcbiAgICAgIGlmIChlbGVzVG9IaWdobGlnaHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBub3RIaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cyhcIi5ub3RoaWdobGlnaHRlZFwiKS5maWx0ZXIoXCI6dmlzaWJsZVwiKTtcclxuICAgICAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcclxuICAgICAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNyZW1vdmUtaGlnaGxpZ2h0cywgI3JlbW92ZS1oaWdobGlnaHRzLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgaWYgKHNiZ25FbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZUhpZ2hsaWdodHNcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xheW91dC1wcm9wZXJ0aWVzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHNiZ25MYXlvdXRQcm9wLnJlbmRlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNsYXlvdXQtcHJvcGVydGllcy1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICQoXCIjbGF5b3V0LXByb3BlcnRpZXNcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZGVsZXRlLXNlbGVjdGVkLXNpbXBsZSwgI2RlbGV0ZS1zZWxlY3RlZC1zaW1wbGUtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuJChcIjpzZWxlY3RlZFwiKTtcclxuICAgICAgaWYgKHNlbGVjdGVkRWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB7XHJcbiAgICAgICAgZWxlczogc2VsZWN0ZWRFbGVzXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNzYmduLXByb3BlcnRpZXMsICNwcm9wZXJ0aWVzLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgc2JnblByb3BlcnRpZXMucmVuZGVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3F1ZXJ5LXBhdGhzYmV0d2VlblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBwYXRoc0JldHdlZW5RdWVyeS5yZW5kZXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjY29sbGFwc2Utc2VsZWN0ZWQsI2NvbGxhcHNlLXNlbGVjdGVkLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29sbGFwc2VTZWxlY3RlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNleHBhbmQtc2VsZWN0ZWQsI2V4cGFuZC1zZWxlY3RlZC1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGV4cGFuZFNlbGVjdGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2NvbGxhcHNlLWNvbXBsZXhlc1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbc2JnbmNsYXNzPSdjb21wbGV4J11cIik7XHJcbiAgICAgIGlmIChjb21wbGV4ZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgICBub2RlczogY29tcGxleGVzXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICAkKFwiI2V4cGFuZC1jb21wbGV4ZXNcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoXCI6c2VsZWN0ZWRcIikuZmlsdGVyKFwiW3NiZ25jbGFzcz0nY29tcGxleCddW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XHJcbiAgICAgIGlmIChub2Rlcy5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjY29sbGFwc2UtYWxsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xyXG4gICAgICBpZiAobm9kZXMuY29sbGFwc2libGVOb2RlcygpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2V4cGFuZC1hbGxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoJzp2aXNpYmxlJykuZmlsdGVyKFwiW2V4cGFuZGVkLWNvbGxhcHNlZD0nY29sbGFwc2VkJ11cIik7XHJcbiAgICAgIGlmIChub2Rlcy5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjcGVyZm9ybS1sYXlvdXQtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAkKFwiI3BlcmZvcm0tbGF5b3V0XCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3BlcmZvcm0tbGF5b3V0XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHN0YXJ0U3Bpbm5lcihcImxheW91dC1zcGlubmVyXCIpO1xyXG4gICAgICBiZWZvcmVQZXJmb3JtTGF5b3V0KCk7XHJcbiAgICAgIHZhciBwcmVmZXJlbmNlcyA9IHtcclxuICAgICAgICBhbmltYXRlOiBzYmduU3R5bGVSdWxlc1snYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnXSA/ICdlbmQnIDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgaWYgKHNiZ25MYXlvdXRQcm9wLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmFuaW1hdGUgPT0gJ2R1cmluZycpIHtcclxuICAgICAgICBkZWxldGUgcHJlZmVyZW5jZXMuYW5pbWF0ZTtcclxuICAgICAgfVxyXG4gICAgICBzYmduTGF5b3V0UHJvcC5hcHBseUxheW91dChwcmVmZXJlbmNlcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3VuZG8tbGFzdC1hY3Rpb24sICN1bmRvLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY3kudW5kb1JlZG8oKS51bmRvKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3JlZG8tbGFzdC1hY3Rpb24sICNyZWRvLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY3kudW5kb1JlZG8oKS5yZWRvKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3NhdmUtYXMtcG5nXCIpLmNsaWNrKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gICAgICAvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxyXG4gICAgICBmdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG4gICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XHJcbiAgICAgICAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcclxuXHJcbiAgICAgICAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcclxuICAgICAgICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcclxuICAgICAgICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcclxuXHJcbiAgICAgICAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XHJcblxyXG4gICAgICAgICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gICAgICAgIHJldHVybiBibG9iO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxyXG4gICAgICB2YXIgYjY0ZGF0YSA9IHBuZ0NvbnRlbnQuc3Vic3RyKHBuZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICAgICAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgXCJuZXR3b3JrLnBuZ1wiKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2F2ZS1hcy1qcGdcIikuY2xpY2soZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICB2YXIgcG5nQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcclxuXHJcbiAgICAgIC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MjQ1NzY3L2NyZWF0aW5nLWEtYmxvYi1mcm9tLWEtYmFzZTY0LXN0cmluZy1pbi1qYXZhc2NyaXB0XHJcbiAgICAgIGZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKSB7XHJcbiAgICAgICAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcclxuICAgICAgICBzbGljZVNpemUgPSBzbGljZVNpemUgfHwgNTEyO1xyXG5cclxuICAgICAgICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xyXG4gICAgICAgIHZhciBieXRlQXJyYXlzID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xyXG4gICAgICAgICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xyXG5cclxuICAgICAgICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcclxuXHJcbiAgICAgICAgICBieXRlQXJyYXlzLnB1c2goYnl0ZUFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcbiAgICAgICAgcmV0dXJuIGJsb2I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXHJcbiAgICAgIHZhciBiNjRkYXRhID0gcG5nQ29udGVudC5zdWJzdHIocG5nQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xyXG4gICAgICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBcIm5ldHdvcmsuanBnXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9UT0RPOiBjb3VsZCBzaW1wbHkga2VlcC9zdG9yZSBvcmlnaW5hbCBpbnB1dCBTQkdOLU1MIGRhdGEgYW5kIHVzZSBpdCBoZXJlIGluc3RlYWQgb2YgY29udmVydGluZyBmcm9tIEpTT05cclxuICAgICQoXCIjc2F2ZS1hcy1zYmdubWxcIikuY2xpY2soZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoKTtcclxuXHJcbiAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XHJcbiAgICAgICAgdHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTg7XCIsXHJcbiAgICAgIH0pO1xyXG4gICAgICB2YXIgZmlsZW5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1uYW1lJykuaW5uZXJIVE1MO1xyXG4gICAgICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNzYXZlLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAkKFwiI3NhdmUtYXMtc2Jnbm1sXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb21tb25BcHBVdGlsaXRpZXMuc2Jnbk5ldHdvcmtDb250YWluZXIub24oXCJjbGlja1wiLCBcIi5iaW9nZW5lLWluZm8gLmV4cGFuZGFibGVcIiwgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICB2YXIgZXhwYW5kZXJPcHRzID0ge3NsaWNlUG9pbnQ6IDE1MCxcclxuICAgICAgICBleHBhbmRQcmVmaXg6ICcgJyxcclxuICAgICAgICBleHBhbmRUZXh0OiAnICguLi4pJyxcclxuICAgICAgICB1c2VyQ29sbGFwc2VUZXh0OiAnIChzaG93IGxlc3MpJyxcclxuICAgICAgICBtb3JlQ2xhc3M6ICdleHBhbmRlci1yZWFkLW1vcmUnLFxyXG4gICAgICAgIGxlc3NDbGFzczogJ2V4cGFuZGVyLXJlYWQtbGVzcycsXHJcbiAgICAgICAgZGV0YWlsQ2xhc3M6ICdleHBhbmRlci1kZXRhaWxzJyxcclxuICAgICAgICBleHBhbmRFZmZlY3Q6ICdmYWRlSW4nLFxyXG4gICAgICAgIGNvbGxhcHNlRWZmZWN0OiAnZmFkZU91dCdcclxuICAgICAgfTtcclxuICAgICAgJChcIi5iaW9nZW5lLWluZm8gLmV4cGFuZGFibGVcIikuZXhwYW5kZXIoZXhwYW5kZXJPcHRzKTtcclxuICAgICAgZXhwYW5kZXJPcHRzLnNsaWNlUG9pbnQgPSAyO1xyXG4gICAgICBleHBhbmRlck9wdHMud2lkb3cgPSAwO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRGaWxlQ29udGVudChmaWxlTmFtZSkge1xyXG4gICAgdmFyIHNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1uYW1lJyk7XHJcbiAgICB3aGlsZSAoc3Bhbi5maXJzdENoaWxkKSB7XHJcbiAgICAgIHNwYW4ucmVtb3ZlQ2hpbGQoc3Bhbi5maXJzdENoaWxkKTtcclxuICAgIH1cclxuICAgIHNwYW4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmlsZU5hbWUpKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvYWRTYW1wbGUoZmlsZW5hbWUpIHtcclxuICAgIHN0YXJ0U3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcclxuICAgIHZhciB4bWxPYmplY3QgPSBsb2FkWE1MRG9jKCdzYW1wbGUtYXBwL3NhbXBsZXMvJyArIGZpbGVuYW1lKTtcclxuICAgIHNldEZpbGVDb250ZW50KGZpbGVuYW1lLnJlcGxhY2UoJ3htbCcsICdzYmdubWwnKSk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2JnbnZpelVwZGF0ZShzYmdubWxUb0pzb24uY29udmVydCh4bWxPYmplY3QpKTtcclxuICAgICAgZW5kU3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcclxuICAgIH0sIDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbG9hZFNCR05NTEZpbGUoZmlsZSkge1xyXG4gICAgc3RhcnRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgICAkKFwiI2xvYWQtZmlsZS1zcGlubmVyXCIpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRleHRUeXBlID0gL3RleHQuKi87XHJcblxyXG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gdGhpcy5yZXN1bHQ7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2JnbnZpelVwZGF0ZShzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcclxuICAgICAgICAgIGVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG4gICAgICBzZXRGaWxlQ29udGVudChmaWxlLm5hbWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxvYWRYTUxEb2MoZmlsZW5hbWUpIHtcclxuICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcclxuICAgICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcbiAgICB9XHJcbiAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGZpbGVuYW1lLCBmYWxzZSk7XHJcbiAgICB4aHR0cC5zZW5kKCk7XHJcbiAgICByZXR1cm4geGh0dHAucmVzcG9uc2VYTUw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0ZXh0VG9YbWxPYmplY3QodGV4dCkge1xyXG4gICAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XHJcbiAgICAgIHZhciBkb2MgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpO1xyXG4gICAgICBkb2MuYXN5bmMgPSAnZmFsc2UnO1xyXG4gICAgICBkb2MubG9hZFhNTCh0ZXh0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgIHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L3htbCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRvYztcclxuICB9XHJcblxyXG4vL0hhbmRsZSBrZXlib2FyZCBldmVudHNcclxuICAkKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS5jdHJsS2V5ICYmIGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgICAgaWYgKGUud2hpY2ggPT09IDkwKSB7IC8vIGN0cmwgKyB6XHJcbiAgICAgICAgY3kudW5kb1JlZG8oKS51bmRvKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODkpIHsgLy8gY3RybCArIHlcclxuICAgICAgICBjeS51bmRvUmVkbygpLnJlZG8oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59OyIsInZhciBjb21tb25BcHBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2NvbW1vbi1hcHAtdXRpbGl0aWVzJyk7XHJcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuLi8uLi9zcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xyXG52YXIgZGlhbG9nVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9kaWFsb2ctdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgc2V0RmlsZUNvbnRlbnQgPSBjb21tb25BcHBVdGlsaXRpZXMuc2V0RmlsZUNvbnRlbnQuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG52YXIgc3RhcnRTcGlubmVyID0gY29tbW9uQXBwVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lci5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbnZhciBlbmRTcGlubmVyID0gY29tbW9uQXBwVXRpbGl0aWVzLmVuZFNwaW5uZXIuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG52YXIgc2JnbnZpelVwZGF0ZSA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmdudml6VXBkYXRlLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcclxudmFyIGNhbGN1bGF0ZVBhZGRpbmdzID0gY29tbW9uQXBwVXRpbGl0aWVzLmNhbGN1bGF0ZVBhZGRpbmdzLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcclxudmFyIHNiZ25TdHlsZVJ1bGVzID0gY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25TdHlsZVJ1bGVzO1xyXG52YXIgZGVmYXVsdFNiZ25TdHlsZVJ1bGVzID0gY29tbW9uQXBwVXRpbGl0aWVzLmRlZmF1bHRTYmduU3R5bGVSdWxlcztcclxudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGNvbW1vbkFwcFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG5cclxuLyoqXHJcbiAqIEJhY2tib25lIHZpZXcgZm9yIHRoZSBCaW9HZW5lIGluZm9ybWF0aW9uLlxyXG4gKi9cclxudmFyIEJpb0dlbmVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gIC8qXHJcbiAgICogQ29weXJpZ2h0IDIwMTMgTWVtb3JpYWwtU2xvYW4gS2V0dGVyaW5nIENhbmNlciBDZW50ZXIuXHJcbiAgICpcclxuICAgKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQQ1Zpei5cclxuICAgKlxyXG4gICAqIFBDVml6IGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICAgKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcclxuICAgKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxyXG4gICAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcbiAgICpcclxuICAgKiBQQ1ZpeiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxyXG4gICAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAgICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxyXG4gICAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxyXG4gICAqXHJcbiAgICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXHJcbiAgICogYWxvbmcgd2l0aCBQQ1Zpei4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxyXG4gICAqL1xyXG5cclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHBhc3MgdmFyaWFibGVzIGluIHVzaW5nIFVuZGVyc2NvcmUuanMgdGVtcGxhdGVcclxuICAgIHZhciB2YXJpYWJsZXMgPSB7XHJcbiAgICAgIGdlbmVEZXNjcmlwdGlvbjogdGhpcy5tb2RlbC5nZW5lRGVzY3JpcHRpb24sXHJcbiAgICAgIGdlbmVBbGlhc2VzOiB0aGlzLnBhcnNlRGVsaW1pdGVkSW5mbyh0aGlzLm1vZGVsLmdlbmVBbGlhc2VzLCBcIjpcIiwgXCIsXCIsIG51bGwpLFxyXG4gICAgICBnZW5lRGVzaWduYXRpb25zOiB0aGlzLnBhcnNlRGVsaW1pdGVkSW5mbyh0aGlzLm1vZGVsLmdlbmVEZXNpZ25hdGlvbnMsIFwiOlwiLCBcIixcIiwgbnVsbCksXHJcbiAgICAgIGdlbmVMb2NhdGlvbjogdGhpcy5tb2RlbC5nZW5lTG9jYXRpb24sXHJcbiAgICAgIGdlbmVNaW06IHRoaXMubW9kZWwuZ2VuZU1pbSxcclxuICAgICAgZ2VuZUlkOiB0aGlzLm1vZGVsLmdlbmVJZCxcclxuICAgICAgZ2VuZVVuaXByb3RJZDogdGhpcy5leHRyYWN0Rmlyc3RVbmlwcm90SWQodGhpcy5tb2RlbC5nZW5lVW5pcHJvdE1hcHBpbmcpLFxyXG4gICAgICBnZW5lVW5pcHJvdExpbmtzOiB0aGlzLmdlbmVyYXRlVW5pcHJvdExpbmtzKHRoaXMubW9kZWwuZ2VuZVVuaXByb3RNYXBwaW5nKSxcclxuICAgICAgZ2VuZVN1bW1hcnk6IHRoaXMubW9kZWwuZ2VuZVN1bW1hcnlcclxuICAgIH07XHJcblxyXG4gICAgLy8gY29tcGlsZSB0aGUgdGVtcGxhdGUgdXNpbmcgdW5kZXJzY29yZVxyXG4gICAgdmFyIHRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI2Jpb2dlbmUtdGVtcGxhdGVcIikuaHRtbCgpKTtcclxuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUodmFyaWFibGVzKTtcclxuXHJcbiAgICAvLyBsb2FkIHRoZSBjb21waWxlZCBIVE1MIGludG8gdGhlIEJhY2tib25lIFwiZWxcIlxyXG4gICAgdGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSk7XHJcblxyXG4gICAgLy8gZm9ybWF0IGFmdGVyIGxvYWRpbmdcclxuICAgIHRoaXMuZm9ybWF0KHRoaXMubW9kZWwpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgZm9ybWF0OiBmdW5jdGlvbiAoKVxyXG4gIHtcclxuICAgIC8vIGhpZGUgcm93cyB3aXRoIHVuZGVmaW5lZCBkYXRhXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lRGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtZGVzY3JpcHRpb25cIikuaGlkZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVBbGlhc2VzID09IHVuZGVmaW5lZClcclxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLWFsaWFzZXNcIikuaGlkZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVEZXNpZ25hdGlvbnMgPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtZGVzaWduYXRpb25zXCIpLmhpZGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lQ2hyb21vc29tZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuYmlvZ2VuZS1jaHJvbW9zb21lXCIpLmhpZGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lTG9jYXRpb24gPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtbG9jYXRpb25cIikuaGlkZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVNaW0gPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtbWltXCIpLmhpZGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lSWQgPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtaWRcIikuaGlkZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVVbmlwcm90TWFwcGluZyA9PSB1bmRlZmluZWQpXHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuYmlvZ2VuZS11bmlwcm90LWxpbmtzXCIpLmhpZGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lU3VtbWFyeSA9PSB1bmRlZmluZWQpXHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIubm9kZS1kZXRhaWxzLXN1bW1hcnlcIikuaGlkZSgpO1xyXG5cclxuICAgIHZhciBleHBhbmRlck9wdHMgPSB7c2xpY2VQb2ludDogMTUwLFxyXG4gICAgICBleHBhbmRQcmVmaXg6ICcgJyxcclxuICAgICAgZXhwYW5kVGV4dDogJyAoLi4uKScsXHJcbiAgICAgIHVzZXJDb2xsYXBzZVRleHQ6ICcgKHNob3cgbGVzcyknLFxyXG4gICAgICBtb3JlQ2xhc3M6ICdleHBhbmRlci1yZWFkLW1vcmUnLFxyXG4gICAgICBsZXNzQ2xhc3M6ICdleHBhbmRlci1yZWFkLWxlc3MnLFxyXG4gICAgICBkZXRhaWxDbGFzczogJ2V4cGFuZGVyLWRldGFpbHMnLFxyXG4gICAgICAvLyBkbyBub3QgdXNlIGRlZmF1bHQgZWZmZWN0c1xyXG4gICAgICAvLyAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rc3dlZGJlcmcvanF1ZXJ5LWV4cGFuZGVyL2lzc3Vlcy80NilcclxuICAgICAgZXhwYW5kRWZmZWN0OiAnZmFkZUluJyxcclxuICAgICAgY29sbGFwc2VFZmZlY3Q6ICdmYWRlT3V0J307XHJcblxyXG4gICAgJChcIi5iaW9nZW5lLWluZm8gLmV4cGFuZGFibGVcIikuZXhwYW5kZXIoZXhwYW5kZXJPcHRzKTtcclxuXHJcbiAgICBleHBhbmRlck9wdHMuc2xpY2VQb2ludCA9IDI7IC8vIHNob3cgY29tbWEgYW5kIHRoZSBzcGFjZVxyXG4gICAgZXhwYW5kZXJPcHRzLndpZG93ID0gMDsgLy8gaGlkZSBldmVyeXRoaW5nIGVsc2UgaW4gYW55IGNhc2VcclxuICB9LFxyXG4gIGdlbmVyYXRlVW5pcHJvdExpbmtzOiBmdW5jdGlvbiAobWFwcGluZykge1xyXG4gICAgdmFyIGZvcm1hdHRlciA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICByZXR1cm4gXy50ZW1wbGF0ZSgkKFwiI3VuaXByb3QtbGluay10ZW1wbGF0ZVwiKS5odG1sKCksIHtpZDogaWR9KTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKG1hcHBpbmcgPT0gdW5kZWZpbmVkIHx8IG1hcHBpbmcgPT0gbnVsbClcclxuICAgIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIGZpcnN0IGlkIChhc3N1bWluZyBpdCBpcyBhbHJlYWR5IHByb2Nlc3NlZClcclxuICAgIGlmIChtYXBwaW5nLmluZGV4T2YoJzonKSA8IDApXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICBtYXBwaW5nID0gbWFwcGluZy5zdWJzdHJpbmcobWFwcGluZy5pbmRleE9mKCc6JykgKyAxKTtcclxuICAgICAgcmV0dXJuICcsICcgKyB0aGlzLnBhcnNlRGVsaW1pdGVkSW5mbyhtYXBwaW5nLCAnOicsICcsJywgZm9ybWF0dGVyKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGV4dHJhY3RGaXJzdFVuaXByb3RJZDogZnVuY3Rpb24gKG1hcHBpbmcpIHtcclxuICAgIGlmIChtYXBwaW5nID09IHVuZGVmaW5lZCB8fCBtYXBwaW5nID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXJ0cyA9IG1hcHBpbmcuc3BsaXQoXCI6XCIpO1xyXG5cclxuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gcGFydHNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwiXCI7XHJcbiAgfSxcclxuICBwYXJzZURlbGltaXRlZEluZm86IGZ1bmN0aW9uIChpbmZvLCBkZWxpbWl0ZXIsIHNlcGFyYXRvciwgZm9ybWF0dGVyKSB7XHJcbiAgICAvLyBkbyBub3QgcHJvY2VzcyB1bmRlZmluZWQgb3IgbnVsbCB2YWx1ZXNcclxuICAgIGlmIChpbmZvID09IHVuZGVmaW5lZCB8fCBpbmZvID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ZXh0ID0gXCJcIjtcclxuICAgIHZhciBwYXJ0cyA9IGluZm8uc3BsaXQoZGVsaW1pdGVyKTtcclxuXHJcbiAgICBpZiAocGFydHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgaWYgKGZvcm1hdHRlcilcclxuICAgICAge1xyXG4gICAgICAgIHRleHQgPSBmb3JtYXR0ZXIocGFydHNbMF0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHRleHQgPSBwYXJ0c1swXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIHRleHQgKz0gc2VwYXJhdG9yICsgXCIgXCI7XHJcblxyXG4gICAgICBpZiAoZm9ybWF0dGVyKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dCArPSBmb3JtYXR0ZXIocGFydHNbaV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHRleHQgKz0gcGFydHNbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFNCR04gTGF5b3V0IHZpZXcgZm9yIHRoZSBTYW1wbGUgQXBwbGljYXRpb24uXHJcbiAqL1xyXG52YXIgU0JHTkxheW91dCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICBkZWZhdWx0TGF5b3V0UHJvcGVydGllczoge1xyXG4gICAgbmFtZTogJ2Nvc2UtYmlsa2VudCcsXHJcbiAgICBub2RlUmVwdWxzaW9uOiA0NTAwLFxyXG4gICAgaWRlYWxFZGdlTGVuZ3RoOiA1MCxcclxuICAgIGVkZ2VFbGFzdGljaXR5OiAwLjQ1LFxyXG4gICAgbmVzdGluZ0ZhY3RvcjogMC4xLFxyXG4gICAgZ3Jhdml0eTogMC4yNSxcclxuICAgIG51bUl0ZXI6IDI1MDAsXHJcbiAgICB0aWxlOiB0cnVlLFxyXG4gICAgYW5pbWF0aW9uRWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpJyxcclxuICAgIGFuaW1hdGU6ICdlbmQnLFxyXG4gICAgYW5pbWF0aW9uRHVyYXRpb246IDEwMDAsXHJcbiAgICByYW5kb21pemU6IHRydWUsXHJcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIGNhbGN1bGF0ZVBhZGRpbmdzKHBhcnNlSW50KHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddLCAxMCkpO1xyXG4gICAgfSxcclxuICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBjYWxjdWxhdGVQYWRkaW5ncyhwYXJzZUludChzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddLCAxMCkpO1xyXG4gICAgfSxcclxuICAgIGdyYXZpdHlSYW5nZUNvbXBvdW5kOiAxLjUsXHJcbiAgICBncmF2aXR5Q29tcG91bmQ6IDEuMCxcclxuICAgIGdyYXZpdHlSYW5nZTogMy44LFxyXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBlbmRTcGlubmVyKCdsYXlvdXQtc3Bpbm5lcicpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3VycmVudExheW91dFByb3BlcnRpZXM6IG51bGwsXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciB0ZW1wbGF0ZVByb3BlcnRpZXMgPSBfLmNsb25lKHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMpO1xyXG4gICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddO1xyXG4gICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gc2JnblN0eWxlUnVsZXNbJ3RpbGluZy1wYWRkaW5nLWhvcml6b250YWwnXTtcclxuXHJcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI2xheW91dC1zZXR0aW5ncy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUodGVtcGxhdGVQcm9wZXJ0aWVzKTtcclxuICB9LFxyXG4gIGNvcHlQcm9wZXJ0aWVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzID0gXy5jbG9uZSh0aGlzLmRlZmF1bHRMYXlvdXRQcm9wZXJ0aWVzKTtcclxuICB9LFxyXG4gIGFwcGx5TGF5b3V0OiBmdW5jdGlvbiAocHJlZmVyZW5jZXMsIHVuZG9hYmxlKSB7XHJcbiAgICBpZiAocHJlZmVyZW5jZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwcmVmZXJlbmNlcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5jdXJyZW50TGF5b3V0UHJvcGVydGllcywgcHJlZmVyZW5jZXMpO1xyXG4gICAgaWYgKHVuZG9hYmxlID09PSBmYWxzZSkge1xyXG4gICAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XHJcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcclxuICAgICAgICBlbGVzOiBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciB0ZW1wbGF0ZVByb3BlcnRpZXMgPSBfLmNsb25lKHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMpO1xyXG4gICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddO1xyXG4gICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gc2JnblN0eWxlUnVsZXNbJ3RpbGluZy1wYWRkaW5nLWhvcml6b250YWwnXTtcclxuXHJcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI2xheW91dC1zZXR0aW5ncy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUodGVtcGxhdGVQcm9wZXJ0aWVzKTtcclxuICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcclxuXHJcbiAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkRpYWxvZyhzZWxmLmVsKTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCBcIiNzYXZlLWxheW91dFwiKS5vbihcImNsaWNrXCIsIFwiI3NhdmUtbGF5b3V0XCIsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5ub2RlUmVwdWxzaW9uID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9kZS1yZXB1bHNpb25cIikudmFsdWUpO1xyXG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmlkZWFsRWRnZUxlbmd0aCA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkZWFsLWVkZ2UtbGVuZ3RoXCIpLnZhbHVlKTtcclxuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5lZGdlRWxhc3RpY2l0eSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkZ2UtZWxhc3RpY2l0eVwiKS52YWx1ZSk7XHJcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMubmVzdGluZ0ZhY3RvciA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5lc3RpbmctZmFjdG9yXCIpLnZhbHVlKTtcclxuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5ncmF2aXR5ID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eVwiKS52YWx1ZSk7XHJcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMubnVtSXRlciA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm51bS1pdGVyXCIpLnZhbHVlKTtcclxuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy50aWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aWxlXCIpLmNoZWNrZWQ7XHJcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuYW5pbWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0ZVwiKS5jaGVja2VkID8gJ2R1cmluZycgOiAnZW5kJztcclxuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5yYW5kb21pemUgPSAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmNyZW1lbnRhbFwiKS5jaGVja2VkO1xyXG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmdyYXZpdHlSYW5nZUNvbXBvdW5kID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eS1yYW5nZS1jb21wb3VuZFwiKS52YWx1ZSk7XHJcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuZ3Jhdml0eUNvbXBvdW5kID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eS1jb21wb3VuZFwiKS52YWx1ZSk7XHJcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuZ3Jhdml0eVJhbmdlID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eS1yYW5nZVwiKS52YWx1ZSk7XHJcblxyXG4gICAgICBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctdmVydGljYWwnXSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbGluZy1wYWRkaW5nLXZlcnRpY2FsXCIpLnZhbHVlKTtcclxuICAgICAgc2JnblN0eWxlUnVsZXNbJ3RpbGluZy1wYWRkaW5nLWhvcml6b250YWwnXSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbGluZy1wYWRkaW5nLWhvcml6b250YWxcIikudmFsdWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgXCIjZGVmYXVsdC1sYXlvdXRcIikub24oXCJjbGlja1wiLCBcIiNkZWZhdWx0LWxheW91dFwiLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuY29weVByb3BlcnRpZXMoKTtcclxuXHJcbiAgICAgIHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddID0gZGVmYXVsdFNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddO1xyXG4gICAgICBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddID0gZGVmYXVsdFNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsJ107XHJcblxyXG4gICAgICB2YXIgdGVtcGxhdGVQcm9wZXJ0aWVzID0gXy5jbG9uZShzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzKTtcclxuICAgICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddO1xyXG4gICAgICB0ZW1wbGF0ZVByb3BlcnRpZXMudGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddO1xyXG5cclxuICAgICAgc2VsZi50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJChcIiNsYXlvdXQtc2V0dGluZ3MtdGVtcGxhdGVcIikuaHRtbCgpKTtcclxuICAgICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUodGVtcGxhdGVQcm9wZXJ0aWVzKTtcclxuICAgICAgJChzZWxmLmVsKS5odG1sKHNlbGYudGVtcGxhdGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTQkdOIFByb3BlcnRpZXMgdmlldyBmb3IgdGhlIFNhbXBsZSBBcHBsaWNhdGlvbi5cclxuICovXHJcbnZhciBTQkdOUHJvcGVydGllcyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICBkZWZhdWx0U0JHTlByb3BlcnRpZXM6IHtcclxuICAgIGNvbXBvdW5kUGFkZGluZzogcGFyc2VJbnQoc2JnblN0eWxlUnVsZXNbJ2NvbXBvdW5kLXBhZGRpbmcnXSwgMTApLFxyXG4gICAgZHluYW1pY0xhYmVsU2l6ZTogc2JnblN0eWxlUnVsZXNbJ2R5bmFtaWMtbGFiZWwtc2l6ZSddLFxyXG4gICAgZml0TGFiZWxzVG9Ob2Rlczogc2JnblN0eWxlUnVsZXNbJ2ZpdC1sYWJlbHMtdG8tbm9kZXMnXSxcclxuICAgIHJlYXJyYW5nZUFmdGVyRXhwYW5kQ29sbGFwc2U6IHNiZ25TdHlsZVJ1bGVzWydyZWFycmFuZ2UtYWZ0ZXItZXhwYW5kLWNvbGxhcHNlJ10sXHJcbiAgICBhbmltYXRlT25EcmF3aW5nQ2hhbmdlczogc2JnblN0eWxlUnVsZXNbJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJ11cclxuICB9LFxyXG4gIGN1cnJlbnRTQkdOUHJvcGVydGllczogbnVsbCxcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLmNvcHlQcm9wZXJ0aWVzKCk7XHJcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI3NiZ24tcHJvcGVydGllcy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUoc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMpO1xyXG4gIH0sXHJcbiAgY29weVByb3BlcnRpZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuY3VycmVudFNCR05Qcm9wZXJ0aWVzID0gXy5jbG9uZSh0aGlzLmRlZmF1bHRTQkdOUHJvcGVydGllcyk7XHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoXCIjc2Jnbi1wcm9wZXJ0aWVzLXRlbXBsYXRlXCIpLmh0bWwoKSk7XHJcbiAgICBzZWxmLnRlbXBsYXRlID0gc2VsZi50ZW1wbGF0ZShzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcyk7XHJcbiAgICAkKHNlbGYuZWwpLmh0bWwoc2VsZi50ZW1wbGF0ZSk7XHJcblxyXG4gICAgZGlhbG9nVXRpbGl0aWVzLm9wZW5EaWFsb2coc2VsZi5lbCk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgXCIjc2F2ZS1zYmduXCIpLm9uKFwiY2xpY2tcIiwgXCIjc2F2ZS1zYmduXCIsIGZ1bmN0aW9uIChldnQpIHtcclxuXHJcbiAgICAgIHZhciBwYXJhbSA9IHt9O1xyXG4gICAgICBwYXJhbS5maXJzdFRpbWUgPSB0cnVlO1xyXG4gICAgICBwYXJhbS5wcmV2aW91c1NCR05Qcm9wZXJ0aWVzID0gXy5jbG9uZShzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcyk7XHJcblxyXG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5jb21wb3VuZFBhZGRpbmcgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb3VuZC1wYWRkaW5nXCIpLnZhbHVlKTtcclxuICAgICAgc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuZHluYW1pY0xhYmVsU2l6ZSA9ICQoJ3NlbGVjdFtuYW1lPVwiZHluYW1pYy1sYWJlbC1zaXplXCJdIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xyXG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5maXRMYWJlbHNUb05vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaXQtbGFiZWxzLXRvLW5vZGVzXCIpLmNoZWNrZWQ7XHJcbiAgICAgIHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLnJlYXJyYW5nZUFmdGVyRXhwYW5kQ29sbGFwc2UgPVxyXG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVhcnJhbmdlLWFmdGVyLWV4cGFuZC1jb2xsYXBzZVwiKS5jaGVja2VkO1xyXG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5hbmltYXRlT25EcmF3aW5nQ2hhbmdlcyA9XHJcbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRlLW9uLWRyYXdpbmctY2hhbmdlc1wiKS5jaGVja2VkO1xyXG5cclxuICAgICAgLy9SZWZyZXNoIHBhZGRpbmdzIGlmIG5lZWRlZFxyXG4gICAgICBpZiAoc2JnblN0eWxlUnVsZXNbJ2NvbXBvdW5kLXBhZGRpbmcnXSAhPSBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5jb21wb3VuZFBhZGRpbmcpIHtcclxuICAgICAgICBzYmduU3R5bGVSdWxlc1snY29tcG91bmQtcGFkZGluZyddID0gc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuY29tcG91bmRQYWRkaW5nO1xyXG4gICAgICAgIHJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vUmVmcmVzaCBsYWJlbCBzaXplIGlmIG5lZWRlZFxyXG4gICAgICBpZiAoc2JnblN0eWxlUnVsZXNbJ2R5bmFtaWMtbGFiZWwtc2l6ZSddICE9IHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLmR5bmFtaWNMYWJlbFNpemUpIHtcclxuICAgICAgICBzYmduU3R5bGVSdWxlc1snZHluYW1pYy1sYWJlbC1zaXplJ10gPSAnJyArIHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLmR5bmFtaWNMYWJlbFNpemU7XHJcbiAgICAgICAgY3kubm9kZXMoKS5yZW1vdmVDbGFzcygnY2hhbmdlTGFiZWxUZXh0U2l6ZScpO1xyXG4gICAgICAgIGN5Lm5vZGVzKCkuYWRkQ2xhc3MoJ2NoYW5nZUxhYmVsVGV4dFNpemUnKTtcclxuICAgICAgfVxyXG4gICAgICAvL1JlZnJlc2ggdHJ1bmNhdGlvbnMgaWYgbmVlZGVkXHJcbiAgICAgIGlmIChzYmduU3R5bGVSdWxlc1snZml0LWxhYmVscy10by1ub2RlcyddICE9IHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLmZpdExhYmVsc1RvTm9kZXMpIHtcclxuICAgICAgICBzYmduU3R5bGVSdWxlc1snZml0LWxhYmVscy10by1ub2RlcyddID0gc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuZml0TGFiZWxzVG9Ob2RlcztcclxuICAgICAgICBjeS5ub2RlcygpLnJlbW92ZUNsYXNzKCdjaGFuZ2VDb250ZW50Jyk7XHJcbiAgICAgICAgY3kubm9kZXMoKS5hZGRDbGFzcygnY2hhbmdlQ29udGVudCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzYmduU3R5bGVSdWxlc1sncmVhcnJhbmdlLWFmdGVyLWV4cGFuZC1jb2xsYXBzZSddID1cclxuICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5yZWFycmFuZ2VBZnRlckV4cGFuZENvbGxhcHNlO1xyXG5cclxuICAgICAgc2JnblN0eWxlUnVsZXNbJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJ10gPVxyXG4gICAgICAgICAgICAgIHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLmFuaW1hdGVPbkRyYXdpbmdDaGFuZ2VzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgXCIjZGVmYXVsdC1zYmduXCIpLm9uKFwiY2xpY2tcIiwgXCIjZGVmYXVsdC1zYmduXCIsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xyXG4gICAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI3NiZ24tcHJvcGVydGllcy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgICBzZWxmLnRlbXBsYXRlID0gc2VsZi50ZW1wbGF0ZShzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcyk7XHJcbiAgICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufSk7XHJcblxyXG4vKipcclxuICogUGF0aHMgQmV0d2VlbiBRdWVyeSB2aWV3IGZvciB0aGUgU2FtcGxlIEFwcGxpY2F0aW9uLlxyXG4gKi9cclxudmFyIFBhdGhzQmV0d2VlblF1ZXJ5ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gIGRlZmF1bHRRdWVyeVBhcmFtZXRlcnM6IHtcclxuICAgIGdlbmVTeW1ib2xzOiBcIlwiLFxyXG4gICAgbGVuZ3RoTGltaXQ6IDFcclxuICB9LFxyXG4gIGN1cnJlbnRRdWVyeVBhcmFtZXRlcnM6IG51bGwsXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xyXG4gICAgc2VsZi50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJChcIiNxdWVyeS1wYXRoc2JldHdlZW4tdGVtcGxhdGVcIikuaHRtbCgpKTtcclxuICAgIHNlbGYudGVtcGxhdGUgPSBzZWxmLnRlbXBsYXRlKHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycyk7XHJcbiAgfSxcclxuICBjb3B5UHJvcGVydGllczogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzID0gXy5jbG9uZSh0aGlzLmRlZmF1bHRRdWVyeVBhcmFtZXRlcnMpO1xyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI3F1ZXJ5LXBhdGhzYmV0d2Vlbi10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUoc2VsZi5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzKTtcclxuICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcclxuXHJcbiAgICAkKFwiI3F1ZXJ5LXBhdGhzYmV0d2Vlbi1lbmFibGUtc2hvcnRlc3Qtay1hbHRlcmF0aW9uXCIpLmNoYW5nZShmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWVyeS1wYXRoc2JldHdlZW4tZW5hYmxlLXNob3J0ZXN0LWstYWx0ZXJhdGlvblwiKS5jaGVja2VkKSB7XHJcbiAgICAgICAgJChcIiNxdWVyeS1wYXRoc2JldHdlZW4tc2hvcnRlc3Qta1wiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoXCIjcXVlcnktcGF0aHNiZXR3ZWVuLXNob3J0ZXN0LWtcIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkRpYWxvZyhzZWxmLmVsLCB7d2lkdGg6ICdhdXRvJ30pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9mZihcImNsaWNrXCIsIFwiI3NhdmUtcXVlcnktcGF0aHNiZXR3ZWVuXCIpLm9uKFwiY2xpY2tcIiwgXCIjc2F2ZS1xdWVyeS1wYXRoc2JldHdlZW5cIiwgZnVuY3Rpb24gKGV2dCkge1xyXG5cclxuICAgICAgc2VsZi5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzLmdlbmVTeW1ib2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWVyeS1wYXRoc2JldHdlZW4tZ2VuZS1zeW1ib2xzXCIpLnZhbHVlO1xyXG4gICAgICBzZWxmLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnMubGVuZ3RoTGltaXQgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWVyeS1wYXRoc2JldHdlZW4tbGVuZ3RoLWxpbWl0XCIpLnZhbHVlKTtcclxuXHJcbiAgICAgIHZhciBxdWVyeVVSTCA9IFwiaHR0cDovL3d3dy5wYXRod2F5Y29tbW9ucy5vcmcvcGMyL2dyYXBoP2Zvcm1hdD1TQkdOJmtpbmQ9UEFUSFNCRVRXRUVOJmxpbWl0PVwiXHJcbiAgICAgICAgICAgICAgKyBzZWxmLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnMubGVuZ3RoTGltaXQ7XHJcbiAgICAgIHZhciBzb3VyY2VzID0gXCJcIjtcclxuICAgICAgdmFyIGZpbGVuYW1lID0gXCJcIjtcclxuICAgICAgdmFyIGdlbmVTeW1ib2xzQXJyYXkgPSBzZWxmLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnMuZ2VuZVN5bWJvbHMucmVwbGFjZShcIlxcblwiLCBcIiBcIikucmVwbGFjZShcIlxcdFwiLCBcIiBcIikuc3BsaXQoXCIgXCIpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdlbmVTeW1ib2xzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY3VycmVudEdlbmVTeW1ib2wgPSBnZW5lU3ltYm9sc0FycmF5W2ldO1xyXG4gICAgICAgIGlmIChjdXJyZW50R2VuZVN5bWJvbC5sZW5ndGggPT0gMCB8fCBjdXJyZW50R2VuZVN5bWJvbCA9PSAnICdcclxuICAgICAgICAgICAgICAgIHx8IGN1cnJlbnRHZW5lU3ltYm9sID09ICdcXG4nIHx8IGN1cnJlbnRHZW5lU3ltYm9sID09ICdcXHQnKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc291cmNlcyA9IHNvdXJjZXMgKyBcIiZzb3VyY2U9XCIgKyBjdXJyZW50R2VuZVN5bWJvbDtcclxuICAgICAgICBpZiAoZmlsZW5hbWUgPT0gJycpIHtcclxuICAgICAgICAgIGZpbGVuYW1lID0gY3VycmVudEdlbmVTeW1ib2w7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUgKyAnXycgKyBjdXJyZW50R2VuZVN5bWJvbDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZSArICdfUEFUSFNCRVRXRUVOLnNiZ25tbCc7XHJcbiAgICAgIHNldEZpbGVDb250ZW50KGZpbGVuYW1lKTtcclxuXHJcbiAgICAgIHN0YXJ0U3Bpbm5lcigncGF0aHMtYmV0d2Vlbi1zcGlubmVyJyk7XHJcblxyXG4gICAgICBxdWVyeVVSTCA9IHF1ZXJ5VVJMICsgc291cmNlcztcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHF1ZXJ5VVJMLFxyXG4gICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBzYmdudml6VXBkYXRlKHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpKTtcclxuICAgICAgICAgIGVuZFNwaW5uZXIoJ3BhdGhzLWJldHdlZW4tc3Bpbm5lcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKHNlbGYuZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9mZihcImNsaWNrXCIsIFwiI2NhbmNlbC1xdWVyeS1wYXRoc2JldHdlZW5cIikub24oXCJjbGlja1wiLCBcIiNjYW5jZWwtcXVlcnktcGF0aHNiZXR3ZWVuXCIsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgJChzZWxmLmVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgQmlvR2VuZVZpZXc6IEJpb0dlbmVWaWV3LFxyXG4gIFNCR05MYXlvdXQ6IFNCR05MYXlvdXQsXHJcbiAgU0JHTlByb3BlcnRpZXM6IFNCR05Qcm9wZXJ0aWVzLFxyXG4gIFBhdGhzQmV0d2VlblF1ZXJ5OiBQYXRoc0JldHdlZW5RdWVyeVxyXG59OyIsInZhciBkZWZhdWx0U2JnblN0eWxlUnVsZXMgPSB7XHJcbiAgJ2NvbXBvdW5kLXBhZGRpbmcnOiAxMCxcclxuICAnZHluYW1pYy1sYWJlbC1zaXplJzogJ3JlZ3VsYXInLFxyXG4gICdmaXQtbGFiZWxzLXRvLW5vZGVzJzogZmFsc2UsXHJcbiAgJ3JlYXJyYW5nZS1hZnRlci1leHBhbmQtY29sbGFwc2UnOiB0cnVlLFxyXG4gICd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCc6IDIwLFxyXG4gICd0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsJzogMjAsXHJcbiAgJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJzogdHJ1ZVxyXG59O1xyXG5cclxudmFyIGNvbW1vbkFwcFV0aWxpdGllcyA9IGNvbW1vbkFwcFV0aWxpdGllcyB8fCB7XHJcbiAgc2Jnbk5ldHdvcmtDb250YWluZXI6IHVuZGVmaW5lZCxcclxuICBzYmduTGF5b3V0UHJvcDogdW5kZWZpbmVkLFxyXG4gIHNiZ25Qcm9wZXJ0aWVzOiB1bmRlZmluZWQsXHJcbiAgcGF0aHNCZXR3ZWVuUXVlcnk6IHVuZGVmaW5lZCxcclxuICBkZWZhdWx0U2JnblN0eWxlUnVsZXM6IGRlZmF1bHRTYmduU3R5bGVSdWxlcyxcclxuICBzYmduU3R5bGVSdWxlczogXy5jbG9uZShkZWZhdWx0U2JnblN0eWxlUnVsZXMpLFxyXG4gIHNldEZpbGVDb250ZW50OiBmdW5jdGlvbiAoZmlsZU5hbWUpIHtcclxuICAgIHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbmFtZScpO1xyXG4gICAgd2hpbGUgKHNwYW4uZmlyc3RDaGlsZCkge1xyXG4gICAgICBzcGFuLnJlbW92ZUNoaWxkKHNwYW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBzcGFuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGVOYW1lKSk7XHJcbiAgfSxcclxuICB0cmlnZ2VySW5jcmVtZW50YWxMYXlvdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuYmVmb3JlUGVyZm9ybUxheW91dCgpO1xyXG4gICAgdmFyIHByZWZlcmVuY2VzID0ge1xyXG4gICAgICByYW5kb21pemU6IGZhbHNlLFxyXG4gICAgICBhbmltYXRlOiB0aGlzLnNiZ25TdHlsZVJ1bGVzWydhbmltYXRlLW9uLWRyYXdpbmctY2hhbmdlcyddID8gJ2VuZCcgOiBmYWxzZSxcclxuICAgICAgZml0OiBmYWxzZVxyXG4gICAgfTtcclxuICAgIGlmICh0aGlzLnNiZ25MYXlvdXRQcm9wLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmFuaW1hdGUgPT09ICdkdXJpbmcnKSB7XHJcbiAgICAgIGRlbGV0ZSBwcmVmZXJlbmNlcy5hbmltYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2JnbkxheW91dFByb3AuYXBwbHlMYXlvdXQocHJlZmVyZW5jZXMsIGZhbHNlKTsgLy8gbGF5b3V0IG11c3Qgbm90IGJlIHVuZG9hYmxlXHJcbiAgfSxcclxuICBiZWZvcmVQZXJmb3JtTGF5b3V0OiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xyXG5cclxuICAgIG5vZGVzLnJlbW92ZURhdGEoXCJwb3J0c1wiKTtcclxuICAgIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0c291cmNlXCIpO1xyXG4gICAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnR0YXJnZXRcIik7XHJcblxyXG4gICAgbm9kZXMuZGF0YShcInBvcnRzXCIsIFtdKTtcclxuICAgIGVkZ2VzLmRhdGEoXCJwb3J0c291cmNlXCIsIFtdKTtcclxuICAgIGVkZ2VzLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIFtdKTtcclxuXHJcbiAgICAvLyBUT0RPIGRvIHRoaXMgYnkgdXNpbmcgZXh0ZW5zaW9uIEFQSVxyXG4gICAgY3kuJCgnLmVkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XHJcbiAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcclxuICB9LFxyXG4gIHNiZ252aXpVcGRhdGU6IGZ1bmN0aW9uIChjeUdyYXBoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xyXG4gICAgLy8gUmVzZXQgdW5kby9yZWRvIHN0YWNrIGFuZCBidXR0b25zIHdoZW4gYSBuZXcgZ3JhcGggaXMgbG9hZGVkXHJcbiAgICBjeS51bmRvUmVkbygpLnJlc2V0KCk7XHJcbiAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICAvLyBjbGVhciBkYXRhXHJcbiAgICBjeS5yZW1vdmUoJyonKTtcclxuICAgIGN5LmFkZChjeUdyYXBoKTtcclxuICAgIGN5Lm5vZGVzKCkuYWRkQ2xhc3MoJ2NoYW5nZUxhYmVsVGV4dFNpemUnKTtcclxuICAgIC8vYWRkIHBvc2l0aW9uIGluZm9ybWF0aW9uIHRvIGRhdGEgZm9yIHByZXNldCBsYXlvdXRcclxuICAgIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjeUdyYXBoLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciB4UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLnNiZ25iYm94Lng7XHJcbiAgICAgIHZhciB5UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLnNiZ25iYm94Lnk7XHJcbiAgICAgIHBvc2l0aW9uTWFwW2N5R3JhcGgubm9kZXNbaV0uZGF0YS5pZF0gPSB7J3gnOiB4UG9zLCAneSc6IHlQb3N9O1xyXG4gICAgfVxyXG4gICAgY3kubGF5b3V0KHtcclxuICAgICAgbmFtZTogJ3ByZXNldCcsXHJcbiAgICAgIHBvc2l0aW9uczogcG9zaXRpb25NYXBcclxuICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XHJcbiAgfSxcclxuICBnZXRFeHBhbmRDb2xsYXBzZU9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZpc2hleWU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gc2VsZi5zYmduU3R5bGVSdWxlc1sncmVhcnJhbmdlLWFmdGVyLWV4cGFuZC1jb2xsYXBzZSddO1xyXG4gICAgICB9LFxyXG4gICAgICBhbmltYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuc2JnblN0eWxlUnVsZXNbJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJ107XHJcbiAgICAgIH0sXHJcbiAgICAgIGxheW91dEJ5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFzZWxmLnNiZ25TdHlsZVJ1bGVzWydyZWFycmFuZ2UtYWZ0ZXItZXhwYW5kLWNvbGxhcHNlJ10pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYudHJpZ2dlckluY3JlbWVudGFsTGF5b3V0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSxcclxuICBkeW5hbWljUmVzaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgd2luID0gJCh3aW5kb3cpOy8vJCh0aGlzKTsgLy90aGlzID0gd2luZG93XHJcblxyXG4gICAgdmFyIHdpbmRvd1dpZHRoID0gd2luLndpZHRoKCk7XHJcbiAgICB2YXIgd2luZG93SGVpZ2h0ID0gd2luLmhlaWdodCgpO1xyXG4gICAgdmFyIGNhbnZhc1dpZHRoID0gMTAwMDtcclxuICAgIHZhciBjYW52YXNIZWlnaHQgPSA2ODA7XHJcbiAgICBpZiAod2luZG93V2lkdGggPiBjYW52YXNXaWR0aClcclxuICAgIHtcclxuICAgICAgJChcIiNzYmduLW5ldHdvcmstY29udGFpbmVyXCIpLndpZHRoKHdpbmRvd1dpZHRoICogMC45KTtcclxuICAgICAgdmFyIHcgPSAkKFwiI3NiZ24taW5zcGVjdG9yLWFuZC1jYW52YXNcIikud2lkdGgoKTtcclxuICAgICAgJChcIi5uYXYtbWVudVwiKS53aWR0aCh3KTtcclxuICAgICAgJChcIi5uYXZiYXJcIikud2lkdGgodyk7XHJcbiAgICAgICQoXCIjc2Jnbi10b29sYmFyXCIpLndpZHRoKHcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3dIZWlnaHQgPiBjYW52YXNIZWlnaHQpXHJcbiAgICB7XHJcbiAgICAgICQoXCIjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lclwiKS5oZWlnaHQod2luZG93SGVpZ2h0ICogMC44NSk7XHJcbiAgICAgICQoXCIjc2Jnbi1pbnNwZWN0b3JcIikuaGVpZ2h0KHdpbmRvd0hlaWdodCAqIDAuODUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0SW5mb0xhYmVsOiBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXHJcbiAgICAgKiB0aGUgbm9kZSBpcyBjb2xsYXBzZWQgcmV0dXJuIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGluZm8gbGFiZWwgb2YgaXRcclxuICAgICAqL1xyXG4gICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jb2xsYXBzZWRDaGlsZHJlbiAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiB0aGUgbm9kZSBpcyBzaW1wbGUgdGhlbiBpdCdzIGluZm9sYWJlbCBpcyBlcXVhbCB0byBpdCdzIHNiZ25sYWJlbFxyXG4gICAgICovXHJcbiAgICBpZiAobm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgIHZhciBpbmZvTGFiZWwgPSBcIlwiO1xyXG4gICAgLypcclxuICAgICAqIEdldCB0aGUgaW5mbyBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZSBieSBpdCdzIGNoaWxkcmVuIGluZm8gcmVjdXJzaXZlbHlcclxuICAgICAqL1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgdmFyIGNoaWxkSW5mbyA9IHRoaXMuZ2V0SW5mb0xhYmVsKGNoaWxkKTtcclxuICAgICAgaWYgKGNoaWxkSW5mbyA9PSBudWxsIHx8IGNoaWxkSW5mbyA9PSBcIlwiKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmZvTGFiZWwgIT0gXCJcIikge1xyXG4gICAgICAgIGluZm9MYWJlbCArPSBcIjpcIjtcclxuICAgICAgfVxyXG4gICAgICBpbmZvTGFiZWwgKz0gY2hpbGRJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcclxuICAgIHJldHVybiBpbmZvTGFiZWw7XHJcbiAgfSxcclxuICBub2RlUXRpcEZ1bmN0aW9uOiBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgLyogICAgKiBDaGVjayB0aGUgc2JnbmxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxyXG4gICAgICogdGhlbiBjaGVjayB0aGUgaW5mb2xhYmVsIGlmIGl0IGlzIGFsc28gbm90IHZhbGlkIGRvIG5vdCBzaG93IHF0aXBcclxuICAgICAqL1xyXG4gICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpXHJcbiAgICAgIGxhYmVsID0gdGhpcy5nZXRJbmZvTGFiZWwobm9kZSk7XHJcbiAgICBpZiAobGFiZWwgPT0gbnVsbCB8fCBsYWJlbCA9PSBcIlwiKVxyXG4gICAgICByZXR1cm47XHJcbiAgICBub2RlLnF0aXAoe1xyXG4gICAgICBjb250ZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRIdG1sID0gXCI8YiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE2cHg7Jz5cIiArIGxhYmVsICsgXCI8L2I+XCI7XHJcbiAgICAgICAgdmFyIHNiZ25zdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYmduc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBzYmduc3RhdGVhbmRpbmZvID0gc2JnbnN0YXRlc2FuZGluZm9zW2ldO1xyXG4gICAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFsdWU7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFyaWFibGU7XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSArIFwiQFwiICsgdmFyaWFibGU7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzYmduc3RhdGVhbmRpbmZvLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xyXG4gICAgICB9LFxyXG4gICAgICBzaG93OiB7XHJcbiAgICAgICAgcmVhZHk6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICBteTogJ3RvcCBjZW50ZXInLFxyXG4gICAgICAgIGF0OiAnYm90dG9tIGNlbnRlcicsXHJcbiAgICAgICAgYWRqdXN0OiB7XHJcbiAgICAgICAgICBjeVZpZXdwb3J0OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGNsYXNzZXM6ICdxdGlwLWJvb3RzdHJhcCcsXHJcbiAgICAgICAgdGlwOiB7XHJcbiAgICAgICAgICB3aWR0aDogMTYsXHJcbiAgICAgICAgICBoZWlnaHQ6IDhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgcmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1czogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuICAgIGlmICh1ci5pc1VuZG9TdGFja0VtcHR5KCkpIHtcclxuICAgICAgJChcIiN1bmRvLWxhc3QtYWN0aW9uXCIpLnBhcmVudChcImxpXCIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgJChcIiN1bmRvLWxhc3QtYWN0aW9uXCIpLnBhcmVudChcImxpXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVyLmlzUmVkb1N0YWNrRW1wdHkoKSkge1xyXG4gICAgICAkKFwiI3JlZG8tbGFzdC1hY3Rpb25cIikucGFyZW50KFwibGlcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAkKFwiI3JlZG8tbGFzdC1hY3Rpb25cIikucGFyZW50KFwibGlcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlc2V0VW5kb1JlZG9CdXR0b25zOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKFwiI3VuZG8tbGFzdC1hY3Rpb25cIikucGFyZW50KFwibGlcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICQoXCIjcmVkby1sYXN0LWFjdGlvblwiKS5wYXJlbnQoXCJsaVwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gIH0sXHJcbiAgY2FsY3VsYXRlUGFkZGluZ3M6IGZ1bmN0aW9uIChwYWRkaW5nUGVyY2VudCkge1xyXG4gICAgLy9BcyBkZWZhdWx0IHVzZSB0aGUgY29tcG91bmQgcGFkZGluZyB2YWx1ZVxyXG4gICAgaWYgKCFwYWRkaW5nUGVyY2VudCkge1xyXG4gICAgICBwYWRkaW5nUGVyY2VudCA9IHBhcnNlSW50KHRoaXMuc2JnblN0eWxlUnVsZXNbJ2NvbXBvdW5kLXBhZGRpbmcnXSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciB0aGVOb2RlID0gbm9kZXNbaV07XHJcbiAgICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS53aWR0aCgpKTtcclxuICAgICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS5oZWlnaHQoKSk7XHJcbiAgICAgICAgbnVtT2ZTaW1wbGVzKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FsY19wYWRkaW5nID0gKHBhZGRpbmdQZXJjZW50IC8gMTAwKSAqIE1hdGguZmxvb3IodG90YWwgLyAoMiAqIG51bU9mU2ltcGxlcykpO1xyXG4gICAgaWYgKGNhbGNfcGFkZGluZyA8IDUpIHtcclxuICAgICAgY2FsY19wYWRkaW5nID0gNTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FsY19wYWRkaW5nO1xyXG4gIH0sXHJcbiAgY2FsY3VsYXRlVGlsaW5nUGFkZGluZ3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlUGFkZGluZ3MoKTtcclxuICB9LFxyXG4gIGNhbGN1bGF0ZUNvbXBvdW5kUGFkZGluZ3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlUGFkZGluZ3MoKTtcclxuICB9LFxyXG4gIHJlZnJlc2hQYWRkaW5nczogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNhbGNfcGFkZGluZyA9IHRoaXMuY2FsY3VsYXRlQ29tcG91bmRQYWRkaW5ncygpO1xyXG4gICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgIG5vZGVzLmNzcygncGFkZGluZy1sZWZ0JywgMCk7XHJcbiAgICBub2Rlcy5jc3MoJ3BhZGRpbmctcmlnaHQnLCAwKTtcclxuICAgIG5vZGVzLmNzcygncGFkZGluZy10b3AnLCAwKTtcclxuICAgIG5vZGVzLmNzcygncGFkZGluZy1ib3R0b20nLCAwKTtcclxuICAgIHZhciBjb21wb3VuZHMgPSBub2Rlcy5maWx0ZXIoJyRub2RlID4gbm9kZScpO1xyXG4gICAgY29tcG91bmRzLmNzcygncGFkZGluZy1sZWZ0JywgY2FsY19wYWRkaW5nKTtcclxuICAgIGNvbXBvdW5kcy5jc3MoJ3BhZGRpbmctcmlnaHQnLCBjYWxjX3BhZGRpbmcpO1xyXG4gICAgY29tcG91bmRzLmNzcygncGFkZGluZy10b3AnLCBjYWxjX3BhZGRpbmcpO1xyXG4gICAgY29tcG91bmRzLmNzcygncGFkZGluZy1ib3R0b20nLCBjYWxjX3BhZGRpbmcpO1xyXG4gIH0sXHJcbiAgc3RhcnRTcGlubmVyOiBmdW5jdGlvbiAoaWQpIHtcclxuXHJcbiAgICBpZiAoJCgnLicgKyBpZCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQoJyNzYmduLW5ldHdvcmstY29udGFpbmVyJykud2lkdGgoKTtcclxuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQoJyNzYmduLW5ldHdvcmstY29udGFpbmVyJykuaGVpZ2h0KCk7XHJcbiAgICAgICQoJyNzYmduLW5ldHdvcmstY29udGFpbmVyOnBhcmVudCcpLnByZXBlbmQoJzxpIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OTk5OyBsZWZ0OiAnICsgY29udGFpbmVyV2lkdGggLyAyICsgJ3B4OyB0b3A6ICcgKyBjb250YWluZXJIZWlnaHQgLyAyICsgJ3B4O1wiIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTN4IGZhLWZ3ICcgKyBpZCArICdcIj48L2k+Jyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGlmICgkKCcuJyArIGlkKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQoJy4nICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29tbW9uQXBwVXRpbGl0aWVzOyIsInZhciBzYmduRWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvc2Jnbi1lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xyXG4gIC8vIFNlY3Rpb24gU3RhcnRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7fTtcclxuICAgIHBhcmFtLmVsZXMgPSBzYmduRWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcclxuICAgIHJldHVybiBwYXJhbTtcclxuICB9LFxyXG4gIGRlbGV0ZUVsZXNTbWFydDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU21hcnQocGFyYW0uZWxlcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIC8vIFNlY3Rpb24gRW5kXHJcbiAgLy8gQWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyIsIihmdW5jdGlvbigpe1xyXG4gIHZhciByZWdpc3RlciA9IGZ1bmN0aW9uKGxpYnMpIHtcclxuICAgIGlmIChsaWJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgbGlicyA9IHt9O1xyXG4gICAgfVxyXG4gICAgLypcclxuICAgIC8vIGdldCBvciByZXF1aXJlIHRoZSBsaWJyYXJpZXNcclxuICAgIHZhciAkID0gd2luZG93LmpRdWVyeSA9IHdpbmRvdy4kID0gbGlic1snalF1ZXJ5J10gfHwgcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbiAgICAvLyBqcXVlcnkgYnJvd3NlciBoZXJlP1xyXG4gICAgdmFyIGZhbmN5Ym94ID0gbGlic1snZmFuY3lib3gnXSB8fCByZXF1aXJlKCcuLi9saWIvanMvanF1ZXJ5LmZhbmN5Ym94LTEuMy40JykoJCk7XHJcbiAgICB2YXIganF1ZXJ5RXhwYW5kZXIgPSBsaWJzWydqcXVlcnktZXhwYW5kZXInXSB8fCByZXF1aXJlKCdqcXVlcnktZXhwYW5kZXInKSgkKTtcclxuICAgIHZhciBxdGlwMiA9IGxpYnNbJ3F0aXAyJ10gfHwgcmVxdWlyZSgncXRpcDInKTsgLy8gQ2hlY2sgaXRcclxuICAgIHZhciBib290c3RyYXAgPSBsaWJzWydib290c3RyYXAnXSB8fCByZXF1aXJlKCdib290c3RyYXAnKTtcclxuICAgIC8vICAgIENoZWNrIGl0IG1vc3QgcHJvYmFibHkgaXQgc2hvdWxkIGJlIGluY2x1ZGVkIGluIGh0bWxcclxuICAgIHZhciBqcXVlcnlVSUJ1bmRsZSA9IGxpYnNbJ2pxdWVyeS11aS1idW5kbGUnXSB8fCByZXF1aXJlKCdqcXVlcnktdWktYnVuZGxlJykoJCk7XHJcbiAgICB2YXIgXyA9IHdpbmRvdy5fID0gbGlic1sndW5kZXJzY29yZSddIHx8IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcclxuICAgIHdpbmRvdy5CYWNrYm9uZSA9IGxpYnNbJ2JhY2tib25lJ10gfHwgcmVxdWlyZSgnYmFja2JvbmUnKTtcclxuICAgIHZhciBjeXRvc2NhcGUgPSB3aW5kb3cuY3l0b3NjYXBlID0gbGlic1snY3l0b3NjYXBlJ10gfHwgcmVxdWlyZSgnLi4vbGliL2pzL2N5dG9zY2FwZScpO1xyXG4gICAgLy8gICAgQ2hlY2sgaXQgbW9zdCBwcm9iYWJseSBpdCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gaHRtbFxyXG4gICAgdmFyIGZpbGVzYXZlcmpzID0gbGlic1snZmlsZXNhdmVyanMnXSA/IGxpYnNbJ2ZpbGVzYXZlcmpzJ10gOiByZXF1aXJlKCdmaWxlc2F2ZXJqcycpO1xyXG4gICAgQmFja2JvbmUuJCA9IGpRdWVyeTsgIFxyXG5cclxuICAgIC8vIGpxdWVyeSBub3R5IGhlcmU/XHJcbiAgICBcclxuICAgIC8vIEdldCBjeSBleHRlbnNpb24gaW5zdGFuY2VzXHJcbiAgICB2YXIgY3lQYW56b29tID0gcmVxdWlyZSgnY3l0b3NjYXBlLXBhbnpvb20nKTtcclxuICAgIHZhciBjeVF0aXAgPSByZXF1aXJlKCdjeXRvc2NhcGUtcXRpcCcpOyBcclxuICAgIHZhciBjeUNvc2VCaWxrZW50ID0gcmVxdWlyZSgnY3l0b3NjYXBlLWNvc2UtYmlsa2VudCcpO1xyXG4gICAgdmFyIGN5VW5kb1JlZG8gPSByZXF1aXJlKCdjeXRvc2NhcGUtdW5kby1yZWRvJyk7XHJcbiAgICB2YXIgY3lDbGlwYm9hcmQgPSByZXF1aXJlKCdjeXRvc2NhcGUtY2xpcGJvYXJkJyk7XHJcbiAgICB2YXIgY3lDb250ZXh0TWVudXMgPSByZXF1aXJlKCdjeXRvc2NhcGUtY29udGV4dC1tZW51cycpO1xyXG4gICAgdmFyIGN5RXhwYW5kQ29sbGFwc2UgPSByZXF1aXJlKCdjeXRvc2NhcGUtZXhwYW5kLWNvbGxhcHNlJyk7XHJcbiAgICB2YXIgY3lFZGdlQmVuZEVkaXRpbmcgPSByZXF1aXJlKCdjeXRvc2NhcGUtZWRnZS1iZW5kLWVkaXRpbmcnKTtcclxuICAgIHZhciBjeVZpZXdVdGlsaXRpZXMgPSByZXF1aXJlKCdjeXRvc2NhcGUtdmlldy11dGlsaXRpZXMnKTtcclxuICAgIFxyXG4gICAgLy8gUmVnaXN0ZXIgY3kgZXh0ZW5zaW9uc1xyXG4gICAgY3lQYW56b29tKCBjeXRvc2NhcGUgKTtcclxuICAgIGN5UXRpcCggY3l0b3NjYXBlLCAkICk7XHJcbiAgICBjeUNvc2VCaWxrZW50KCBjeXRvc2NhcGUgKTtcclxuICAgIGN5VW5kb1JlZG8oIGN5dG9zY2FwZSApO1xyXG4gICAgY3lDbGlwYm9hcmQoIGN5dG9zY2FwZSApO1xyXG4gICAgY3lDb250ZXh0TWVudXMoIGN5dG9zY2FwZSwgJCApO1xyXG4gICAgY3lFeHBhbmRDb2xsYXBzZSggY3l0b3NjYXBlLCAkICk7XHJcbiAgICBjeUVkZ2VCZW5kRWRpdGluZyggY3l0b3NjYXBlLCAkICk7XHJcbiAgICBjeVZpZXdVdGlsaXRpZXMoIGN5dG9zY2FwZSwgJCApOyovXHJcbiAgICBcclxuICAgIHZhciBzYmduUmVuZGVyZXIgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9jeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXInKTtcclxuICAgIHZhciBhcHBDeSA9IHJlcXVpcmUoJy4uL3NhbXBsZS1hcHAvanMvYXBwLWN5Jyk7XHJcbiAgICB2YXIgYXBwTWVudSA9IHJlcXVpcmUoJy4uL3NhbXBsZS1hcHAvanMvYXBwLW1lbnUnKTtcclxuICAgIFxyXG4gICAgc2JnblJlbmRlcmVyKCk7XHJcbiAgICBhcHBDeSgpO1xyXG4gICAgYXBwTWVudSgpO1xyXG4gICAgXHJcbiAgfTtcclxuICBcclxuICBtb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xyXG59KSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcclxuICB2YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG4vLyAgdmFyIGN5VmFyaWFibGVzID0gcmVxdWlyZSgnLi4vY3ktdmFyaWFibGVzJyk7XHJcbiAgXHJcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduU2hhcGVzID0ge1xyXG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAncHJvY2Vzcyc6IHRydWUsXHJcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQudG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24gPSB7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jYXJkaW5hbGl0eVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib3hMZW5ndGg6IDEzLFxyXG4gICAgICBkaXN0YW5jZVRvTm9kZTogMjUsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBcIjlweCBBcmlhbFwiO1xyXG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCwgZmFsc2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uYWRkUG9ydFJlcGxhY2VtZW50SWZBbnkgPSBmdW5jdGlvbiAobm9kZSwgZWRnZVBvcnQpIHtcclxuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XHJcbiAgICB2YXIgcG9zWSA9IG5vZGUucG9zaXRpb24oKS55O1xyXG4gICAgaWYgKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgICBpZiAocG9ydC5pZCA9PSBlZGdlUG9ydCkge1xyXG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XHJcbiAgICAgICAgICBwb3NZID0gcG9zWSArIHBvcnQueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xyXG4gIH1cclxuICA7XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XHJcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxyXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuXHJcbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3UXVhZHJhdGljTGluZUNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGNvbnRleHQsIGVkZ2UsIHB0cywgdHlwZSkge1xyXG4gICAgY29udGV4dC5tb3ZlVG8ocHRzWzBdLCBwdHNbMV0pO1xyXG4gICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHB0c1syXSwgcHRzWzNdLCBwdHNbNF0sIHB0c1s1XSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPT0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciB0b3RhbExlbmd0aCA9IHFCZXppZXJMZW5ndGgocHRzKTtcclxuXHJcbiAgICB2YXIgc3RhcnRMZW5ndGggPSB0b3RhbExlbmd0aCAtIDI1O1xyXG5cclxuICAgIHZhciBzdGFydFBvcnRpb24gPSBzdGFydExlbmd0aCAvIHRvdGFsTGVuZ3RoO1xyXG5cclxuICAgIGlmICh0eXBlID09PSBcImNvbnN1bXB0aW9uXCIpIHtcclxuICAgICAgc3RhcnRQb3J0aW9uID0gY2FyUHJvcC5kaXN0YW5jZVRvU291cmNlIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFBvcnRpb24gPSAodG90YWxMZW5ndGggLSBjYXJQcm9wLmRpc3RhbmNlVG9UYXJnZXQpIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQgPSBzdGFydFBvcnRpb247XHJcbiAgICB2YXIgeDEgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1swXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1syXSArIHQgKiB0ICogcHRzWzRdO1xyXG4gICAgdmFyIHkxID0gKDEgLSB0KSAqICgxIC0gdCkgKiBwdHNbMV0gKyAyICogKDEgLSB0KSAqIHQgKiBwdHNbM10gKyB0ICogdCAqIHB0c1s1XTtcclxuXHJcbiAgICAvL2dldCBhIHNob3J0IGxpbmUgdG8gZGV0ZXJtaW5lIHRhbmdldCBsaW5lXHJcbiAgICB0ID0gc3RhcnRQb3J0aW9uICsgMC4wMTtcclxuICAgIHZhciB4MiA9ICgxIC0gdCkgKiAoMSAtIHQpICogcHRzWzBdICsgMiAqICgxIC0gdCkgKiB0ICogcHRzWzJdICsgdCAqIHQgKiBwdHNbNF07XHJcbiAgICB2YXIgeTIgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1sxXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1szXSArIHQgKiB0ICogcHRzWzVdO1xyXG5cclxuICAgIHZhciBkaXNwWCA9IHgxIC0geDI7XHJcbiAgICB2YXIgZGlzcFkgPSB5MSAtIHkyO1xyXG5cclxuICAgIHZhciBhbmdsZSA9IE1hdGguYXNpbihkaXNwWSAvIChNYXRoLnNxcnQoZGlzcFggKiBkaXNwWCArIGRpc3BZICogZGlzcFkpKSk7XHJcblxyXG4gICAgaWYgKGRpc3BYIDwgMCkge1xyXG4gICAgICBhbmdsZSA9IGFuZ2xlICsgTWF0aC5QSSAvIDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbmdsZSA9IC0oTWF0aC5QSSAvIDIgKyBhbmdsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgxLCB5MSk7XHJcbiAgICBjb250ZXh0LnJvdGF0ZSgtYW5nbGUpO1xyXG5cclxuICAgIGNvbnRleHQucmVjdCgwLCAtMTMgLyAyLCAxMywgMTMpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogMCwgJ2NlbnRlclknOiAxMyAvIDIsXHJcbiAgICAgICdvcGFjaXR5JzogZWRnZS5jc3MoJ3RleHQtb3BhY2l0eScpICogZWRnZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgJ3dpZHRoJzogMTMsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKGFuZ2xlKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14MSwgLXkxKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RyYWlnaHRMaW5lQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoY29udGV4dCwgZWRnZSwgcHRzLCB0eXBlKSB7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMF0sIHB0c1sxXSk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhwdHNbMl0sIHB0c1szXSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPD0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciBsZW5ndGggPSAoTWF0aC5zcXJ0KChwdHNbMl0gLSBwdHNbMF0pICogKHB0c1syXSAtIHB0c1swXSkgK1xyXG4gICAgICAgICAgICAocHRzWzNdIC0gcHRzWzFdKSAqIChwdHNbM10gLSBwdHNbMV0pKSk7XHJcblxyXG4gICAgdmFyIGRpc3BYLCBkaXNwWSwgc3RhcnRYLCBzdGFydFk7XHJcblxyXG4gICAgLy9UT0RPIDogeW91IG1heSBuZWVkIHRvIGNoYW5nZSBoZXJlXHJcbiAgICBpZiAodHlwZSA9PT0gXCJjb25zdW1wdGlvblwiKSB7XHJcbiAgICAgIHN0YXJ0WCA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFg7XHJcbiAgICAgIHN0YXJ0WSA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFggPSBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmFycm93RW5kWDtcclxuICAgICAgc3RhcnRZID0gZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5hcnJvd0VuZFk7XHJcbiAgICB9XHJcbiAgICB2YXIgc3JjUG9zID0gKHR5cGUgPT09IFwiY29uc3VtcHRpb25cIikgPyBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCkgOiBlZGdlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcbiAgICAvL3ZhciBzcmNQb3MgPSBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XHJcbiAgICBkaXNwWCA9IHN0YXJ0WCAtIHNyY1Bvcy54O1xyXG4gICAgZGlzcFkgPSBzdGFydFkgLSBzcmNQb3MueTtcclxuXHJcbiAgICB2YXIgYW5nbGUgPSBNYXRoLmFzaW4oZGlzcFkgLyAoTWF0aC5zcXJ0KGRpc3BYICogZGlzcFggKyBkaXNwWSAqIGRpc3BZKSkpO1xyXG5cclxuICAgIGlmIChkaXNwWCA8IDApIHtcclxuICAgICAgYW5nbGUgPSBhbmdsZSArIE1hdGguUEkgLyAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW5nbGUgPSAtKE1hdGguUEkgLyAyICsgYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHN0YXJ0WCwgc3RhcnRZKTtcclxuICAgIGNvbnRleHQucm90YXRlKC1hbmdsZSk7XHJcblxyXG4gICAgaWYgKGxlbmd0aCA+IGNhclByb3AuZGlzdGFuY2VUb05vZGUpIHtcclxuICAgICAgY29udGV4dC5yZWN0KDAsIC1jYXJQcm9wLmRpc3RhbmNlVG9Ob2RlLCBjYXJQcm9wLmJveExlbmd0aCwgY2FyUHJvcC5ib3hMZW5ndGgpO1xyXG5cclxuICAgICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogLWNhclByb3AuZGlzdGFuY2VUb05vZGUgKyBjYXJQcm9wLmJveExlbmd0aCAvIDIsICdjZW50ZXJZJzogLWNhclByb3AuYm94TGVuZ3RoIC8gMixcclxuICAgICAgICAnb3BhY2l0eSc6IGVkZ2UuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIGVkZ2UuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogY2FyUHJvcC5ib3hMZW5ndGgsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICAgJCQuc2Jnbi5kcmF3Q2FyZGluYWxpdHlUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXN0YXJ0WCwgLXN0YXJ0WSk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xyXG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xyXG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XHJcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XHJcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XHJcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcclxuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvd25XaWR0aCA9IGRvd25XaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcclxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICBzdGF0ZS5iYm94LnkgPSAoc3RhdGVDZW50ZXJZIC0gY2VudGVyWSkgKiAxMDAgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcclxuICAgIHZhciBzdGF0ZVZhcmlhYmxlID0gdGV4dFByb3Auc3RhdGUudmFyaWFibGUgfHwgJyc7XHJcblxyXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgPyBcIkBcIiArIHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgOiBcIlwiKTtcclxuXHJcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG5cclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGVMYWJlbDtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIGZvbnRTaXplID0gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wLCB0cnVuY2F0ZSkge1xyXG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XHJcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xyXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRleHRQcm9wLmNvbG9yO1xyXG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XHJcbiAgICB2YXIgdGV4dDtcclxuICAgIFxyXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcclxuICAgIFxyXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XHJcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xyXG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gIH07XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xyXG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3cocG9pbnQxWzBdIC0gcG9pbnQyWzBdLCAyKSArIE1hdGgucG93KHBvaW50MVsxXSAtIHBvaW50MlsxXSwgMik7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNvbG9ycyA9IHtcclxuICAgIGNsb25lOiBcIiNhOWE5YTlcIixcclxuICAgIGFzc29jaWF0aW9uOiBcIiM2QjZCNkJcIixcclxuICAgIHBvcnQ6IFwiIzZCNkI2QlwiXHJcbiAgfTtcclxuXHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgMCk7XHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQubGluZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcztcclxuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxyXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXHJcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxyXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuXHJcbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxyXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xyXG5cclxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xyXG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XHJcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdkaXNzb2NpYXRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5zcGVjaWZpZWQgZW50aXR5Jyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ29taXR0ZWQgcHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3VuY2VydGFpbiBwcm9jZXNzJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcclxuXHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdwcm9kdWN0aW9uJyk7XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMuYXJyb3dTaGFwZS5lbnVtcy5wdXNoKCduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25BcnJvd1NoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ10pO1xyXG4gICAgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xyXG4gICAgICAtMC4xOCwgLTAuNDMsXHJcbiAgICAgIDAuMTgsIC0wLjQzXHJcbiAgICBdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0gY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ107XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKSxcclxuICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlKGNvbnRleHQsIG5vZGUsIHRoaXMucG9pbnRzKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5VmFyaWFibGVzLmN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZGlzc29jaWF0aW9uXCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDQsIGhlaWdodCAvIDQpO1xyXG5cclxuICAgICAgICAvLyBBdCBvcmlnaW4sIHJhZGl1cyAxLCAwIHRvIDJwaVxyXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDAsIE1hdGguUEkgKiAyICogMC45OTksIGZhbHNlKTsgLy8gKjAuOTk5IGIvYyBjaHJvbWUgcmVuZGVyaW5nIGJ1ZyBvbiBmdWxsIGNpcmNsZVxyXG5cclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoNCAvIHdpZHRoLCA0IC8gaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBbXSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBjb3JuZXJMZW5ndGg6IDEyLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBoYXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlckhlaWdodCgpIDogbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbi8vICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uaW50ZXJzZWN0TGluZSxcclxuLy8gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJXaWR0aCgpIDogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJIZWlnaHQoKSA6IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gKGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAoaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeVZhcmlhYmxlcy5jeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcblxyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRyYXdQYXRoOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsXHJcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwdHMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc291cmNlQW5kU2luayhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgLy9jb250ZXh0LmZpbGwoKTtcclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcclxuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBlcnR1cmJpbmdBZ2VudDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDg7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTUgLyA2LCAtMSwgNSAvIDYsIC0xLCAxLCAxLCAtMSwgMV07XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgcmVuZGVyZXIuZHJhd1BvbHlnb24oY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxyXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hY3JvbW9sZWN1bGU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgICAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTEsIC0xLCAxLCAtMSwgMSAtIGNwWCwgMSwgLTEgKyBjcFgsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuXHJcbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgIGlmIChwb3J0cy5sZW5ndGggPCAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcclxuICAgICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcG9ydC54ICogd2lkdGggLyAxMDAgKyBub2RlWCwgcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgbm9kZVksIDEsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcclxuICAgIHZhciBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgIHZhciBjaGVja1BvaW50ID0gW2ludGVyc2VjdGlvbnNbaV0sIGludGVyc2VjdGlvbnNbaSArIDFdXTtcclxuICAgICAgdmFyIGRpc3RhbmNlID0gY3lWYXJpYWJsZXMuY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcclxuXHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW50ZXJzZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIG5vZGVYLCBub2RlWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHMsIHdlIGhhdmUgb25seSB0d28gYXJjcyBmb3JcclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxyXG4gICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggc3RyYWlnaHQgbGluZSBzZWdtZW50c1xyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3AgTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BMZWZ0Q2VudGVyWCwgdG9wTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvcCBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcFJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgdyA9IHdpZHRoIC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGFuID0gY2VudGVyWDtcclxuICAgIHZhciBibiA9IGNlbnRlclk7XHJcblxyXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XHJcblxyXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcclxuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcclxuICAgIHZhciBhID0gaCAqIGggKyB3ICogdyAqIG0gKiBtO1xyXG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcclxuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXHJcbiAgICAgICAgICAgIGJuICogYm4gKiB3ICogdyAtIGggKiBoICogdyAqIHc7XHJcblxyXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xyXG5cclxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG4gICAgdmFyIHQyID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuXHJcbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XHJcbiAgICB2YXIgeE1heCA9IE1hdGgubWF4KHQxLCB0Mik7XHJcblxyXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIHlNYXggPSBtICogeE1heCAtIG0gKiB4MiArIHkyO1xyXG5cclxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuXHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KHN0YXRlSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVDaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludChcclxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGluZm9Db3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4vLyAgJCQuc2Jnbi5pbnRlcnNldExpbmVTZWxlY3Rpb24gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuLy8gICAgLy9UT0RPOiBkbyBpdCBmb3IgYWxsIGNsYXNzZXMgaW4gc2JnbiwgY3JlYXRlIGEgc2JnbiBjbGFzcyBhcnJheSB0byBjaGVja1xyXG4vLyAgICBpZiAodGVtcFNiZ25TaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuLy8gICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldLmludGVyc2VjdExpbmUoXHJcbi8vICAgICAgICAgIG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbi8vICAgIH1cclxuLy8gICAgZWxzZSB7XHJcbi8vICAgICAgcmV0dXJuIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXS5pbnRlcnNlY3RMaW5lKFxyXG4vLyAgICAgICAgICBub2RlLl9wcml2YXRlLnBvc2l0aW9uLngsXHJcbi8vICAgICAgICAgIG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSxcclxuLy8gICAgICAgICAgbm9kZS5vdXRlcldpZHRoKCksXHJcbi8vICAgICAgICAgIG5vZGUub3V0ZXJIZWlnaHQoKSxcclxuLy8gICAgICAgICAgeCwgLy9oYWxmUG9pbnRYLFxyXG4vLyAgICAgICAgICB5LCAvL2hhbGZQb2ludFlcclxuLy8gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJvcmRlci13aWR0aFwiXS5weFZhbHVlIC8gMlxyXG4vLyAgICAgICAgICApO1xyXG4vLyAgICB9XHJcbi8vICB9O1xyXG5cclxuICAkJC5zYmduLmlzTm9kZVNoYXBlVG90YWxseU92ZXJyaWRlbiA9IGZ1bmN0aW9uIChyZW5kZXIsIG5vZGUpIHtcclxuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufTtcclxuIiwidmFyIGRpYWxvZ1V0aWxpdGllcyA9IHtcclxuICBvcGVuRGlhbG9nOiBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcclxuICAgICQoZWwpLmRpYWxvZyhcclxuICAgICAgICAkLmV4dGVuZCgge30sIHtcclxuICAgICAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICAgICAgb3BlbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGFwc3RhcnRGY24sIGN4dHRhcEZjbiwgem9vbUZjbiwgcGFuRmNuO1xyXG4gICAgICAgICAgICAkKCcudWktd2lkZ2V0LW92ZXJsYXknKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAkKGVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY3kucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGN5Lm9uKCd0YXBzdGFydCcsIHRhcHN0YXJ0RmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGF0YSgndGFwc3RhcnRGY24nLCB0YXBzdGFydEZjbik7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGN5Lm9uKCdjeHR0YXAnLCBjeHR0YXBGY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kYXRhKCdjeHR0YXBGY24nLCBjeHR0YXBGY24pO1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGN5Lm9uKCd6b29tJywgem9vbUZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRhdGEoJ3pvb21GY24nLCB6b29tRmNuKTtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBjeS5vbigncGFuJywgcGFuRmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGF0YSgncGFuRmNuJywgcGFuRmNuKTtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3kucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGlmKCQoZWwpLmRhdGEoJ3RhcHN0YXJ0RmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZigndGFwc3RhcnQnLCAkKGVsKS5kYXRhKCd0YXBzdGFydEZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgaWYoJChlbCkuZGF0YSgnY3h0dGFwRmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZignY3h0dGFwJywgJChlbCkuZGF0YSgnY3h0dGFwRmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBpZigkKGVsKS5kYXRhKCd6b29tRmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZignem9vbScsICQoZWwpLmRhdGEoJ3pvb21GY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKCQoZWwpLmRhdGEoJ3BhbkZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ3BhbicsICQoZWwpLmRhdGEoJ3BhbkZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdGlvbnMgKVxyXG4gICAgKTtcclxuICB9LFxyXG4gIG9wZW5GYW5jeWJveDogZnVuY3Rpb24oJHRlbXBsYXRlLCBvcHRpb25zKSB7XHJcbiAgICAkLmZhbmN5Ym94KFxyXG4gICAgICAgIF8udGVtcGxhdGUoJHRlbXBsYXRlLmh0bWwoKSwge30pLFxyXG4gICAgICAgICQuZXh0ZW5kKCB7fSwge1xyXG4gICAgICAgICAgJ2F1dG9EaW1lbnNpb25zJzogdHJ1ZSxcclxuICAgICAgICAgICd0cmFuc2l0aW9uSW4nOiAnbm9uZScsXHJcbiAgICAgICAgICAndHJhbnNpdGlvbk91dCc6ICdub25lJyxcclxuICAgICAgICAgICdvblN0YXJ0JzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB6b29tRmNuLCBwYW5GY247XHJcbiAgICAgICAgICAgIGN5LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBjeS5vbignem9vbScsIHpvb21GY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGVtcGxhdGUuZGF0YSgnem9vbUZjbicsIHpvb21GY24pO1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBjeS5vbigncGFuJywgcGFuRmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlLmRhdGEoJ3BhbkZjbicsIHBhbkZjbik7XHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdvbkNsb3NlZCc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjeS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5kYXRhKCd6b29tRmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZignem9vbScsICR0ZW1wbGF0ZS5kYXRhKCd6b29tRmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5kYXRhKCdwYW5GY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCdwYW4nLCAkdGVtcGxhdGUuZGF0YSgncGFuRmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9ucykgKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRpYWxvZ1V0aWxpdGllcztcclxuXHJcblxyXG4iLCJ2YXIganNvblRvU2Jnbm1sID0ge1xyXG4gICAgY3JlYXRlU2Jnbm1sIDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL2FkZCBoZWFkZXJzXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSd5ZXMnPz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHNiZ24geG1sbnM9J2h0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuMic+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxtYXAgbGFuZ3VhZ2U9J3Byb2Nlc3MgZGVzY3JpcHRpb24nPlxcblwiO1xyXG5cclxuICAgICAgICAvL2FkZGluZyBnbHlwaCBzYmdubWxcclxuICAgICAgICBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoIXRoaXMuaXNDaGlsZCgpKVxyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEdseXBoU2Jnbm1sKHRoaXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2FkZGluZyBhcmMgc2Jnbm1sXHJcbiAgICAgICAgY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRBcmNTYmdubWwodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L21hcD5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9zYmduPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0R2x5cGhTYmdubWwgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZihub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArXHJcbiAgICAgICAgICAgICAgICBcIjxnbHlwaCBpZD0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuaWQgKyBcIicgY2xhc3M9J2NvbXBhcnRtZW50JyBcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgY29tcGFydG1lbnRSZWY9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLnBhcmVudCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRDb21tb25HbHlwaFByb3BlcnRpZXMobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT09IFwic3VibWFwXCIpe1xyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArXHJcbiAgICAgICAgICAgICAgICBcIjxnbHlwaCBpZD0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuaWQgKyBcIicgY2xhc3M9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyArIFwiJyBcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7Ly9pdCBpcyBhIHNpbXBsZSBub2RlXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzICsgXCInXCI7XHJcblxyXG4gICAgICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgICAgICBpZihwYXJlbnQuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT0gXCJjb21wYXJ0bWVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgY29tcGFydG1lbnRSZWY9J1wiICsgcGFyZW50Ll9wcml2YXRlLmRhdGEuaWQgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiA+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvZ2x5cGg+XFxuXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENvbW1vbkdseXBoUHJvcGVydGllcyA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy9hZGQgbGFiZWwgaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkTGFiZWwobm9kZSk7XHJcbiAgICAgICAgLy9hZGQgYmJveCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRHbHlwaEJib3gobm9kZSk7XHJcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkQ2xvbmUobm9kZSk7XHJcbiAgICAgICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRQb3J0KG5vZGUpO1xyXG4gICAgICAgIC8vYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5nZXRTdGF0ZUFuZEluZm9TYmdubWwobm9kZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDbG9uZSA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxjbG9uZS8+XFxuXCI7XHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0YXRlQW5kSW5mb1NiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBib3hHbHlwaCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3NbaV07XHJcbiAgICAgICAgICAgIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInN0YXRlIHZhcmlhYmxlXCIpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFN0YXRlQm94R2x5cGgoYm94R2x5cGgsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoYm94R2x5cGguY2xhenogPT09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBcmNTYmdubWwgOiBmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vVGVtcG9yYXJ5IGhhY2sgdG8gcmVzb2x2ZSBcInVuZGVmaW5lZFwiIGFyYyBzb3VyY2UgYW5kIHRhcmdldHNcclxuICAgICAgICB2YXIgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnR0YXJnZXQ7XHJcbiAgICAgICAgdmFyIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlO1xyXG5cclxuICAgICAgICBpZiAoYXJjU291cmNlID09IG51bGwgfHwgYXJjU291cmNlLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1RhcmdldCA9PSBudWxsIHx8IGFyY1RhcmdldC5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS50YXJnZXQ7XHJcblxyXG4gICAgICAgIHZhciBhcmNJZCA9IGFyY1NvdXJjZSArIFwiLVwiICsgYXJjVGFyZ2V0O1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGFyYyBpZD0nXCIgKyBhcmNJZCArXHJcbiAgICAgICAgICAgIFwiJyB0YXJnZXQ9J1wiICsgYXJjVGFyZ2V0ICtcclxuICAgICAgICAgICAgXCInIHNvdXJjZT0nXCIgKyBhcmNTb3VyY2UgKyBcIicgY2xhc3M9J1wiICtcclxuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyArIFwiJz5cXG5cIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzdGFydCB5PSdcIiArIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRZICsgXCInIHg9J1wiICtcclxuICAgICAgICAgICAgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFggKyBcIicvPlxcblwiO1xyXG5cclxuICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgIGlmKHNlZ3B0cyl7XHJcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBzZWdwdHMgJiYgaSA8IHNlZ3B0cy5sZW5ndGg7IGkgPSBpICsgMil7XHJcbiAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcclxuICAgICAgICAgICAgdmFyIGJlbmRZID0gc2VncHRzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8bmV4dCB5PSdcIiArIGJlbmRZICsgXCInIHg9J1wiICsgYmVuZFggKyBcIicvPlxcblwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxlbmQgeT0nXCIgKyBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFkgKyBcIicgeD0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFggKyBcIicvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9hcmM+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRHbHlwaEJib3ggOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggLSB3aWR0aC8yO1xyXG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XHJcbiAgICAgICAgcmV0dXJuIFwiPGJib3ggeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArXHJcbiAgICAgICAgICAgIFwiJyB3PSdcIiArIHdpZHRoICsgXCInIGg9J1wiICsgaGVpZ2h0ICsgXCInIC8+XFxuXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQW5kSW5mb0Jib3ggOiBmdW5jdGlvbihub2RlLCBib3hHbHlwaCl7XHJcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XHJcblxyXG4gICAgICAgIHZhciB4ID0gYm94QmJveC54IC8gMTAwICogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArICh4IC0gYm94QmJveC53LzIpO1xyXG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcclxuICAgICAgICByZXR1cm4gXCI8YmJveCB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICtcclxuICAgICAgICAgICAgXCInIHc9J1wiICsgYm94QmJveC53ICsgXCInIGg9J1wiICsgYm94QmJveC5oICsgXCInIC8+XFxuXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFBvcnQgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHBvcnRzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgcG9ydHNbaV0ueCAqIG5vZGUud2lkdGgoKSAvIDEwMDtcclxuICAgICAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyBwb3J0c1tpXS55ICogbm9kZS5oZWlnaHQoKSAvIDEwMDtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8cG9ydCBpZD0nXCIgKyBwb3J0c1tpXS5pZCArXHJcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkTGFiZWwgOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG5cclxuICAgICAgICBpZih0eXBlb2YgbGFiZWwgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiBcIjxsYWJlbCB0ZXh0PSdcIiArIGxhYmVsICsgXCInIC8+XFxuXCI7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBtYWluR2x5cGgpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxnbHlwaCBpZD0nXCIgKyBub2RlLmlkICsgXCInIGNsYXNzPSdzdGF0ZSB2YXJpYWJsZSc+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxzdGF0ZSBcIjtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFsdWUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YWx1ZT0nXCIgKyBub2RlLnN0YXRlLnZhbHVlICsgXCInIFwiO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhcmlhYmxlICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwidmFyaWFibGU9J1wiICsgbm9kZS5zdGF0ZS52YXJpYWJsZSArIFwiJyBcIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiLz5cXG5cIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKTtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEluZm9Cb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuaWQgKyBcIicgY2xhc3M9J3VuaXQgb2YgaW5mb3JtYXRpb24nPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8bGFiZWwgXCI7XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLmxhYmVsLnRleHQgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ0ZXh0PSdcIiArIG5vZGUubGFiZWwudGV4dCArIFwiJyBcIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiLz5cXG5cIjtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKTtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25Ub1NiZ25tbDtcclxuIiwidmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBzYmduU3R5bGVSdWxlcyA9IHJlcXVpcmUoJy4uLy4uL3NhbXBsZS1hcHAvanMvY29tbW9uLWFwcC11dGlsaXRpZXMnKS5zYmduU3R5bGVSdWxlcztcclxuXHJcbnZhciBzYmduRWxlbWVudFV0aWxpdGllcyA9IHtcclxuICAgIC8vdGhlIGxpc3Qgb2YgdGhlIGVsZW1lbnQgY2xhc3NlcyBoYW5kbGVkIGJ5IHRoZSB0b29sXHJcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcclxuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWUsXHJcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXHJcbiAgICAgICAgJ3RhZyc6IHRydWUsXHJcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ21vZHVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXHJcbiAgICAgICAgJ2luaGliaXRpb24nOiB0cnVlLFxyXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdlcXVpdmFsZW5jZSBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ25vdCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ2FuZCc6IHRydWUsXHJcbiAgICAgICAgJ29yJzogdHJ1ZSxcclxuICAgICAgICAnbm90JzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXHJcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcclxuICAgICAgICAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3BoZW5vdHlwZSddLFxyXG4gICAgICBcclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEdlbmVyYWwgRWxlbWVudCBVdGlsaXRpZXNcclxuXHJcbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXHJcbiAgICBnZXRUb3BNb3N0Tm9kZXM6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdHM7XHJcbiAgICB9LFxyXG4gICAgLy9UaGlzIG1ldGhvZCBjaGVja3MgaWYgYWxsIG9mIHRoZSBnaXZlbiBub2RlcyBoYXZlIHRoZSBzYW1lIHBhcmVudCBhc3N1bWluZyB0aGF0IHRoZSBzaXplIFxyXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcclxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBub2Rlc1swXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YShcInBhcmVudFwiKSAhPSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBtb3ZlTm9kZXM6IGZ1bmN0aW9uKHBvc2l0aW9uRGlmZiwgbm9kZXMsIG5vdENhbGNUb3BNb3N0Tm9kZXMpIHtcclxuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvcE1vc3ROb2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xyXG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XHJcbiAgICAgICAgbm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXHJcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xyXG4gICAgICB2YXIgcGFuID0gY3kucGFuKCk7XHJcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xyXG5cclxuICAgICAgdmFyIHggPSAocmVuZGVyZWRQb3NpdGlvbi54IC0gcGFuLngpIC8gem9vbTtcclxuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG4gICAgXHJcbiAgICBnZXRQcm9jZXNzZXNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxlY3RlZEVsZXMgPSBjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKTtcclxuICAgICAgICBzZWxlY3RlZEVsZXMgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KHNlbGVjdGVkRWxlcyk7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkRWxlcztcclxuICAgIH0sXHJcbiAgICBnZXROZWlnaGJvdXJzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gc2VsZWN0ZWRFbGVzLmFkZChzZWxlY3RlZEVsZXMucGFyZW50cyhcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIikpO1xyXG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHNlbGVjdGVkRWxlcy5hZGQoc2VsZWN0ZWRFbGVzLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHZhciBuZWlnaGJvcmhvb2RFbGVzID0gc2VsZWN0ZWRFbGVzLm5laWdoYm9yaG9vZCgpO1xyXG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSBzZWxlY3RlZEVsZXMuYWRkKG5laWdoYm9yaG9vZEVsZXMpO1xyXG4gICAgICAgIGVsZXNUb0hpZ2hsaWdodCA9IGVsZXNUb0hpZ2hsaWdodC5hZGQoZWxlc1RvSGlnaGxpZ2h0LmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHJldHVybiBlbGVzVG9IaWdobGlnaHQ7XHJcbiAgICB9LFxyXG4gICAgZXh0ZW5kTm9kZUxpc3Q6IGZ1bmN0aW9uKG5vZGVzVG9TaG93KXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5wYXJlbnRzKCkpO1xyXG4gICAgICAgIC8vYWRkIGNvbXBsZXggY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbc2JnbmNsYXNzPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3MhPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5laWdoYm9yUHJvY2Vzc2VzID0gbm9uUHJvY2Vzc2VzLm5laWdoYm9yaG9vZChcIm5vZGVbc2JnbmNsYXNzPSdwcm9jZXNzJ11cIik7XHJcblxyXG4gICAgICAgIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPj0gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcy5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcclxuXHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkucGFyZW50cygpKTtcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGV4dGVuZFJlbWFpbmluZ05vZGVzIDogZnVuY3Rpb24obm9kZXNUb0ZpbHRlciwgYWxsTm9kZXMpe1xyXG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb1Nob3cpO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICBub25lSXNOb3RIaWdobGlnaHRlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWROb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikubm9kZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcclxuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFZGdlcyA9IGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWRnZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vdEhpZ2hsaWdodGVkTm9kZXMubGVuZ3RoICsgbm90SGlnaGxpZ2h0ZWRFZGdlcy5sZW5ndGggPT09IDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbiAgICBcclxuICAgIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBlbGVzO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIGVsZXMucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlRWxlc1NtYXJ0OiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIHZhciBub2Rlc1RvS2VlcCA9IHRoaXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMoZWxlcywgYWxsTm9kZXMpO1xyXG4gICAgICB2YXIgbm9kZXNOb3RUb0tlZXAgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0tlZXApO1xyXG4gICAgICByZXR1cm4gbm9kZXNOb3RUb0tlZXAucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBDb21tb24gZWxlbWVudCBwcm9wZXJ0aWVzXHJcbiAgICBcclxuICAgIGlzRVBOQ2xhc3M6IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xyXG4gICAgICAgIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXHJcbiAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xyXG4gICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG4gICAgXHJcbiAgICBnZXRDeVNoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgc2hhcGUgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcbiAgICAgICAgaWYgKHNoYXBlLmVuZHNXaXRoKCcgbXVsdGltZXInKSkge1xyXG4gICAgICAgICAgICBzaGFwZSA9IHNoYXBlLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3BoZW5vdHlwZScpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdoZXhhZ29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNoYXBlID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBzaGFwZSA9PSAndGFnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgc2hhcGUgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyB8fCBzaGFwZSA9PSAnZGlzc29jaWF0aW9uJ1xyXG4gICAgICAgICAgICB8fCBzaGFwZSA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2hhcGUgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgc2hhcGUgPT0gJ2NvbXBsZXgnXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IHNoYXBlID09ICdwcm9jZXNzJyB8fCBzaGFwZSA9PSAnb21pdHRlZCBwcm9jZXNzJ1xyXG4gICAgICAgICAgICB8fCBzaGFwZSA9PSAndW5jZXJ0YWluIHByb2Nlc3MnIHx8IHNoYXBlID09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ2VsbGlwc2UnO1xyXG4gICAgfSxcclxuICAgIGdldEN5QXJyb3dTaGFwZTogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ21vZHVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0RWxlbWVudENvbnRlbnQ6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcblxyXG4gICAgICAgIGlmIChzYmduY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIHNiZ25jbGFzcyA9IHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJ1xyXG4gICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBzYmduY2xhc3MgPT0gJ3RhZycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdzYmdubGFiZWwnKSA/IGVsZS5kYXRhKCdzYmdubGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2JnbmNsYXNzID09ICdjb21wYXJ0bWVudCcpe1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpID8gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzYmduY2xhc3MgPT0gJ2NvbXBsZXgnKXtcclxuICAgICAgICAgICAgaWYoZWxlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ3NiZ25sYWJlbCcpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihlbGUuZGF0YSgnaW5mb0xhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnaW5mb0xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnYW5kJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ0FORCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnb3InKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnT1InO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT0gJ25vdCcpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdOT1QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdcXFxcXFxcXCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnPyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ08nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS5jc3MoJ3dpZHRoJykgPyBwYXJzZUZsb2F0KGVsZS5jc3MoJ3dpZHRoJykpIDogZWxlLmRhdGEoJ3NiZ25iYm94JykudztcclxuXHJcbiAgICAgICAgdmFyIHRleHRQcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcclxuICAgICAgICAgICAgd2lkdGg6ICggc2JnbmNsYXNzPT0oJ2NvbXBsZXgnKSB8fCBzYmduY2xhc3M9PSgnY29tcGFydG1lbnQnKSApP3RleHRXaWR0aCAqIDI6dGV4dFdpZHRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGZvbnQgPSB0aGlzLmdldExhYmVsVGV4dFNpemUoZWxlKSArIFwicHggQXJpYWxcIjtcclxuICAgICAgICByZXR1cm4gdHJ1bmNhdGVUZXh0KHRleHRQcm9wLCBmb250KTsgLy9mdW5jLiBpbiB0aGUgY3l0b3NjYXBlLnJlbmRlcmVyLmNhbnZhcy5zYmduLXJlbmRlcmVyLmpzXHJcbiAgICB9LFxyXG4gICAgZ2V0TGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlLmRhdGEoJ3NiZ25jbGFzcycpO1xyXG5cclxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcclxuICAgICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT09ICdkaXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIDIwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnYW5kJyB8fCBzYmduY2xhc3MgPT09ICdvcicgfHwgc2JnbmNsYXNzID09PSAnbm90Jykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMS41KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PT0gJ2NvbXBhcnRtZW50Jykge1xyXG4gICAgICAgIHJldHVybiAxNjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgIH0sXHJcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XHJcbiAgICAgIHZhciBkeW5hbWljTGFiZWxTaXplID0gc2JnblN0eWxlUnVsZXNbJ2R5bmFtaWMtbGFiZWwtc2l6ZSddO1xyXG5cclxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3NtYWxsJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMC43NTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAncmVndWxhcicpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ2xhcmdlJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMS4yNTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xyXG4gICAgICB2YXIgdGV4dEhlaWdodCA9IHBhcnNlSW50KGggLyAyLjQ1KSAqIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudDtcclxuXHJcbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIGdldENhcmRpbmFsaXR5RGlzdGFuY2U6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICB2YXIgc3JjUG9zID0gZWxlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xyXG4gICAgICAgIHJldHVybiBkaXN0YW5jZSAqIDAuMTU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2JnbkVsZW1lbnRVdGlsaXRpZXM7XHJcbiIsInZhciBzYmduRWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vc2Jnbi1lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHtcclxuICBpbnNlcnRlZE5vZGVzOiB7fSxcclxuICBnZXRBbGxDb21wYXJ0bWVudHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcclxuICAgICQoeG1sT2JqZWN0KS5maW5kKFwiZ2x5cGhbY2xhc3M9J2NvbXBhcnRtZW50J11cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbXBhcnRtZW50cy5wdXNoKHtcclxuICAgICAgICAneCc6IHBhcnNlRmxvYXQoJCh0aGlzKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3gnKSksXHJcbiAgICAgICAgJ3knOiBwYXJzZUZsb2F0KCQodGhpcykuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd5JykpLFxyXG4gICAgICAgICd3JzogcGFyc2VGbG9hdCgkKHRoaXMpLmNoaWxkcmVuKCdiYm94JykuYXR0cigndycpKSxcclxuICAgICAgICAnaCc6IHBhcnNlRmxvYXQoJCh0aGlzKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ2gnKSksXHJcbiAgICAgICAgJ2lkJzogJCh0aGlzKS5hdHRyKCdpZCcpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29tcGFydG1lbnRzLnNvcnQoZnVuY3Rpb24gKGMxLCBjMikge1xyXG4gICAgICBpZiAoYzEuaCAqIGMxLncgPCBjMi5oICogYzIudylcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA+IGMyLmggKiBjMi53KVxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XHJcbiAgfSxcclxuICBpc0luQm91bmRpbmdCb3g6IGZ1bmN0aW9uIChiYm94MSwgYmJveDIpIHtcclxuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxyXG4gICAgICAgIGJib3gxLnkgPiBiYm94Mi55ICYmXHJcbiAgICAgICAgYmJveDEueCArIGJib3gxLncgPCBiYm94Mi54ICsgYmJveDIudyAmJlxyXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgYmJveFByb3A6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBzYmduYmJveCA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICBzYmduYmJveC54ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd4Jyk7XHJcbiAgICBzYmduYmJveC55ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd5Jyk7XHJcbiAgICBzYmduYmJveC53ID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCd3Jyk7XHJcbiAgICBzYmduYmJveC5oID0gJChlbGUpLmZpbmQoJ2Jib3gnKS5hdHRyKCdoJyk7XHJcblxyXG4gICAgLy9zZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgc2JnbmJib3gueCA9IHBhcnNlRmxvYXQoc2JnbmJib3gueCkgKyBwYXJzZUZsb2F0KHNiZ25iYm94LncpIC8gMjtcclxuICAgIHNiZ25iYm94LnkgPSBwYXJzZUZsb2F0KHNiZ25iYm94LnkpICsgcGFyc2VGbG9hdChzYmduYmJveC5oKSAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHNiZ25iYm94O1xyXG4gIH0sXHJcbiAgc3RhdGVBbmRJbmZvQmJveFByb3A6IGZ1bmN0aW9uIChlbGUsIHBhcmVudEJib3gpIHtcclxuICAgIHZhciB4UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LngpO1xyXG4gICAgdmFyIHlQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueSk7XHJcblxyXG4gICAgdmFyIHNiZ25iYm94ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3gnKTtcclxuICAgIHNiZ25iYm94LnkgPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3knKTtcclxuICAgIHNiZ25iYm94LncgPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3cnKTtcclxuICAgIHNiZ25iYm94LmggPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ2gnKTtcclxuXHJcbiAgICAvL3NldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBzYmduYmJveC54ID0gcGFyc2VGbG9hdChzYmduYmJveC54KSArIHBhcnNlRmxvYXQoc2JnbmJib3gudykgLyAyIC0geFBvcztcclxuICAgIHNiZ25iYm94LnkgPSBwYXJzZUZsb2F0KHNiZ25iYm94LnkpICsgcGFyc2VGbG9hdChzYmduYmJveC5oKSAvIDIgLSB5UG9zO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSBzYmduYmJveC54IC8gcGFyc2VGbG9hdChwYXJlbnRCYm94LncpICogMTAwO1xyXG4gICAgc2JnbmJib3gueSA9IHNiZ25iYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XHJcblxyXG4gICAgcmV0dXJuIHNiZ25iYm94O1xyXG4gIH0sXHJcbiAgc3RhdGVBbmRJbmZvUHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb0FycmF5ID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgJChlbGUpLmNoaWxkcmVuKCdnbHlwaCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgb2JqID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICBpZiAoJCh0aGlzKS5hdHRyKCdjbGFzcycpID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICBvYmouaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgb2JqLmNsYXp6ID0gJCh0aGlzKS5hdHRyKCdjbGFzcycpO1xyXG4gICAgICAgIG9iai5sYWJlbCA9IHsndGV4dCc6ICQodGhpcykuZmluZCgnbGFiZWwnKS5hdHRyKCd0ZXh0Jyl9O1xyXG4gICAgICAgIG9iai5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcCh0aGlzLCBwYXJlbnRCYm94KTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKG9iaik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoJCh0aGlzKS5hdHRyKCdjbGFzcycpID09PSAnc3RhdGUgdmFyaWFibGUnKSB7XHJcbiAgICAgICAgb2JqLmlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIG9iai5jbGF6eiA9ICQodGhpcykuYXR0cignY2xhc3MnKTtcclxuICAgICAgICBvYmouc3RhdGUgPSB7J3ZhbHVlJzogJCh0aGlzKS5maW5kKCdzdGF0ZScpLmF0dHIoJ3ZhbHVlJyksXHJcbiAgICAgICAgICAndmFyaWFibGUnOiAkKHRoaXMpLmZpbmQoJ3N0YXRlJykuYXR0cigndmFyaWFibGUnKX07XHJcbiAgICAgICAgb2JqLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKHRoaXMsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2gob2JqKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlQW5kSW5mb0FycmF5O1xyXG4gIH0sXHJcbiAgYWRkUGFyZW50SW5mb1RvTm9kZTogZnVuY3Rpb24gKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIC8vdGhlcmUgaXMgbm8gY29tcGxleCBwYXJlbnRcclxuICAgIGlmIChwYXJlbnQgPT0gXCJcIikge1xyXG4gICAgICAvL25vIGNvbXBhcnRtZW50IHJlZmVyZW5jZVxyXG4gICAgICBpZiAodHlwZW9mICQoZWxlKS5hdHRyKCdjb21wYXJ0bWVudFJlZicpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIG5vZGVPYmoucGFyZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy9hZGQgY29tcGFydG1lbnQgYWNjb3JkaW5nIHRvIGdlb21ldHJ5XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJ0bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBiYm94ID0ge1xyXG4gICAgICAgICAgICAneCc6IHBhcnNlRmxvYXQoJChlbGUpLmNoaWxkcmVuKCdiYm94JykuYXR0cigneCcpKSxcclxuICAgICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KCQoZWxlKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3knKSksXHJcbiAgICAgICAgICAgICd3JzogcGFyc2VGbG9hdCgkKGVsZSkuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd3JykpLFxyXG4gICAgICAgICAgICAnaCc6IHBhcnNlRmxvYXQoJChlbGUpLmNoaWxkcmVuKCdiYm94JykuYXR0cignaCcpKSxcclxuICAgICAgICAgICAgJ2lkJzogJChlbGUpLmF0dHIoJ2lkJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzZWxmLmlzSW5Cb3VuZGluZ0JveChiYm94LCBjb21wYXJ0bWVudHNbaV0pKSB7XHJcbiAgICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy90aGVyZSBpcyBjb21wYXJ0bWVudCByZWZlcmVuY2VcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbm9kZU9iai5wYXJlbnQgPSAkKGVsZSkuYXR0cignY29tcGFydG1lbnRSZWYnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy90aGVyZSBpcyBjb21wbGV4IHBhcmVudFxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gcGFyZW50O1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWRkQ3l0b3NjYXBlSnNOb2RlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbm9kZU9iaiA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAvL2FkZCBpZCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5pZCA9ICQoZWxlKS5hdHRyKCdpZCcpO1xyXG4gICAgLy9hZGQgbm9kZSBib3VuZGluZyBib3ggaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbmJib3ggPSBzZWxmLmJib3hQcm9wKGVsZSk7XHJcbiAgICAvL2FkZCBjbGFzcyBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zYmduY2xhc3MgPSAkKGVsZSkuYXR0cignY2xhc3MnKTtcclxuICAgIC8vYWRkIGxhYmVsIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLnNiZ25sYWJlbCA9ICQoZWxlKS5jaGlsZHJlbignbGFiZWwnKS5hdHRyKCd0ZXh0Jyk7XHJcbiAgICAvL2FkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbnN0YXRlc2FuZGluZm9zID0gc2VsZi5zdGF0ZUFuZEluZm9Qcm9wKGVsZSwgbm9kZU9iai5zYmduYmJveCk7XHJcbiAgICAvL2FkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cclxuICAgIHNlbGYuYWRkUGFyZW50SW5mb1RvTm9kZShlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAvL2FkZCBjbG9uZSBpbmZvcm1hdGlvblxyXG4gICAgaWYgKCQoZWxlKS5jaGlsZHJlbignY2xvbmUnKS5sZW5ndGggPiAwKVxyXG4gICAgICBub2RlT2JqLnNiZ25jbG9uZW1hcmtlciA9IHRydWU7XHJcbiAgICBlbHNlXHJcbiAgICAgIG5vZGVPYmouc2JnbmNsb25lbWFya2VyID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIC8vYWRkIHBvcnQgaW5mb3JtYXRpb25cclxuICAgIHZhciBwb3J0cyA9IFtdO1xyXG4gICAgJChlbGUpLmZpbmQoJ3BvcnQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG4gICAgICB2YXIgcmVsYXRpdmVYUG9zID0gcGFyc2VGbG9hdCgkKHRoaXMpLmF0dHIoJ3gnKSkgLSBub2RlT2JqLnNiZ25iYm94Lng7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBwYXJzZUZsb2F0KCQodGhpcykuYXR0cigneScpKSAtIG5vZGVPYmouc2JnbmJib3gueTtcclxuICAgICAgXHJcbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5zYmduYmJveC53KSAqIDEwMDtcclxuICAgICAgcmVsYXRpdmVZUG9zID0gcmVsYXRpdmVZUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLnNiZ25iYm94LmgpICogMTAwO1xyXG4gICAgICBcclxuICAgICAgcG9ydHMucHVzaCh7XHJcbiAgICAgICAgaWQ6ICQodGhpcykuYXR0cignaWQnKSxcclxuICAgICAgICB4OiByZWxhdGl2ZVhQb3MsXHJcbiAgICAgICAgeTogcmVsYXRpdmVZUG9zXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGUgPSB7ZGF0YTogbm9kZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc05vZGUpO1xyXG4gIH0sXHJcbiAgdHJhdmVyc2VOb2RlczogZnVuY3Rpb24gKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgaWYgKCFzYmduRWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbJChlbGUpLmF0dHIoJ2NsYXNzJyldKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaW5zZXJ0ZWROb2Rlc1skKGVsZSkuYXR0cignaWQnKV0gPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy9hZGQgY29tcGxleCBub2RlcyBoZXJlXHJcbiAgICBpZiAoJChlbGUpLmF0dHIoJ2NsYXNzJykgPT09ICdjb21wbGV4JyB8fCAkKGVsZSkuYXR0cignY2xhc3MnKSA9PT0gJ3N1Ym1hcCcpIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAgICQoZWxlKS5jaGlsZHJlbignZ2x5cGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdjbGFzcycpICE9ICdzdGF0ZSB2YXJpYWJsZScgJiZcclxuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjbGFzcycpICE9ICd1bml0IG9mIGluZm9ybWF0aW9uJykge1xyXG4gICAgICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKHRoaXMsIGpzb25BcnJheSwgJChlbGUpLmF0dHIoJ2lkJyksIGNvbXBhcnRtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzTm9kZShlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0QXJjU291cmNlQW5kVGFyZ2V0OiBmdW5jdGlvbiAoYXJjLCB4bWxPYmplY3QpIHtcclxuICAgIC8vc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcclxuICAgIHZhciBzb3VyY2UgPSAkKGFyYykuYXR0cignc291cmNlJyk7XHJcbiAgICB2YXIgdGFyZ2V0ID0gJChhcmMpLmF0dHIoJ3RhcmdldCcpO1xyXG4gICAgdmFyIHNvdXJjZU5vZGVJZCwgdGFyZ2V0Tm9kZUlkO1xyXG5cclxuICAgICQoeG1sT2JqZWN0KS5maW5kKCdnbHlwaCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09IHNvdXJjZSkge1xyXG4gICAgICAgIHNvdXJjZU5vZGVJZCA9IHNvdXJjZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09IHRhcmdldCkge1xyXG4gICAgICAgIHRhcmdldE5vZGVJZCA9IHRhcmdldDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VOb2RlSWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQoeG1sT2JqZWN0KS5maW5kKFwicG9ydFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09IHNvdXJjZSkge1xyXG4gICAgICAgICAgc291cmNlTm9kZUlkID0gJCh0aGlzKS5wYXJlbnQoKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXROb2RlSWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQoeG1sT2JqZWN0KS5maW5kKFwicG9ydFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09IHRhcmdldCkge1xyXG4gICAgICAgICAgdGFyZ2V0Tm9kZUlkID0gJCh0aGlzKS5wYXJlbnQoKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsnc291cmNlJzogc291cmNlTm9kZUlkLCAndGFyZ2V0JzogdGFyZ2V0Tm9kZUlkfTtcclxuICB9LFxyXG4gIGdldEFyY0JlbmRQb2ludFBvc2l0aW9uczogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IFtdO1xyXG4gICAgXHJcbi8vICAgICQoZWxlKS5jaGlsZHJlbignc3RhcnQsIG5leHQsIGVuZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgJChlbGUpLmNoaWxkcmVuKCduZXh0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwb3NYID0gJCh0aGlzKS5hdHRyKCd4Jyk7XHJcbiAgICAgIHZhciBwb3NZID0gJCh0aGlzKS5hdHRyKCd5Jyk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgcG9zID0ge1xyXG4gICAgICAgIHg6IHBvc1gsXHJcbiAgICAgICAgeTogcG9zWVxyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgYmVuZFBvaW50UG9zaXRpb25zLnB1c2gocG9zKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gYmVuZFBvaW50UG9zaXRpb25zO1xyXG4gIH0sXHJcbiAgYWRkQ3l0b3NjYXBlSnNFZGdlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHhtbE9iamVjdCkge1xyXG4gICAgaWYgKCFzYmduRWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbJChlbGUpLmF0dHIoJ2NsYXNzJyldKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xyXG4gICAgXHJcbiAgICBpZiAoIXRoaXMuaW5zZXJ0ZWROb2Rlc1tzb3VyY2VBbmRUYXJnZXQuc291cmNlXSB8fCAhdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC50YXJnZXRdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdmFyIGVkZ2VPYmogPSBuZXcgT2JqZWN0KCk7XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcclxuXHJcbiAgICBlZGdlT2JqLmlkID0gJChlbGUpLmF0dHIoJ2lkJyk7XHJcbiAgICBlZGdlT2JqLnNiZ25jbGFzcyA9ICQoZWxlKS5hdHRyKCdjbGFzcycpO1xyXG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcblxyXG4gICAgaWYgKCQoZWxlKS5maW5kKCdnbHlwaCcpLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgIGVkZ2VPYmouc2JnbmNhcmRpbmFsaXR5ID0gMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAkKGVsZSkuY2hpbGRyZW4oJ2dseXBoJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignY2xhc3MnKSA9PSAnY2FyZGluYWxpdHknKSB7XHJcbiAgICAgICAgICBlZGdlT2JqLnNiZ25jYXJkaW5hbGl0eSA9ICQodGhpcykuZmluZCgnbGFiZWwnKS5hdHRyKCd0ZXh0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlZGdlT2JqLnNvdXJjZSA9IHNvdXJjZUFuZFRhcmdldC5zb3VyY2U7XHJcbiAgICBlZGdlT2JqLnRhcmdldCA9IHNvdXJjZUFuZFRhcmdldC50YXJnZXQ7XHJcblxyXG4gICAgZWRnZU9iai5wb3J0c291cmNlID0gJChlbGUpLmF0dHIoXCJzb3VyY2VcIik7XHJcbiAgICBlZGdlT2JqLnBvcnR0YXJnZXQgPSAkKGVsZSkuYXR0cihcInRhcmdldFwiKTtcclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNFZGdlID0ge2RhdGE6IGVkZ2VPYmp9O1xyXG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNFZGdlKTtcclxuICB9LFxyXG4gIGNvbnZlcnQ6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XHJcbiAgICB2YXIgY3l0b3NjYXBlSnNFZGdlcyA9IFtdO1xyXG5cclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBzZWxmLmdldEFsbENvbXBhcnRtZW50cyh4bWxPYmplY3QpO1xyXG5cclxuICAgICQoeG1sT2JqZWN0KS5maW5kKFwibWFwXCIpLmNoaWxkcmVuKCdnbHlwaCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLnRyYXZlcnNlTm9kZXModGhpcywgY3l0b3NjYXBlSnNOb2RlcywgXCJcIiwgY29tcGFydG1lbnRzKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoeG1sT2JqZWN0KS5maW5kKFwibWFwXCIpLmNoaWxkcmVuKCdhcmMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc0VkZ2UodGhpcywgY3l0b3NjYXBlSnNFZGdlcywgeG1sT2JqZWN0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc0dyYXBoID0gbmV3IE9iamVjdCgpO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5ub2RlcyA9IGN5dG9zY2FwZUpzTm9kZXM7XHJcbiAgICBjeXRvc2NhcGVKc0dyYXBoLmVkZ2VzID0gY3l0b3NjYXBlSnNFZGdlcztcclxuXHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXMgPSB7fTtcclxuXHJcbiAgICByZXR1cm4gY3l0b3NjYXBlSnNHcmFwaDtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNiZ25tbFRvSnNvbjsiLCJ2YXIgY29tbW9uQXBwVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc2FtcGxlLWFwcC9qcy9jb21tb24tYXBwLXV0aWxpdGllcycpO1xyXG52YXIgc2JnblN0eWxlUnVsZXMgPSBjb21tb25BcHBVdGlsaXRpZXMuc2JnblN0eWxlUnVsZXM7XHJcblxyXG52YXIgdGV4dFV0aWxpdGllcyA9IHtcclxuICAvL1RPRE86IHVzZSBDU1MncyBcInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXNcIiBzdHlsZSBpbnN0ZWFkIG9mIGZ1bmN0aW9uIGJlbG93P1xyXG4gIHRydW5jYXRlVGV4dDogZnVuY3Rpb24gKHRleHRQcm9wLCBmb250KSB7XHJcbiAgICB2YXIgY29udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIGNvbnRleHQuZm9udCA9IGZvbnQ7XHJcbiAgICB2YXIgZml0TGFiZWxzVG9Ob2RlcyA9IHNiZ25TdHlsZVJ1bGVzWydmaXQtbGFiZWxzLXRvLW5vZGVzJ107XHJcbiAgICB2YXIgdGV4dCA9IHRleHRQcm9wLmxhYmVsIHx8IFwiXCI7XHJcbiAgICAvL0lmIGZpdCBsYWJlbHMgdG8gbm9kZXMgaXMgZmFsc2UgZG8gbm90IHRydW5jYXRlXHJcbiAgICBpZiAoZml0TGFiZWxzVG9Ob2RlcyA9PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuICAgIHZhciB3aWR0aDtcclxuICAgIHZhciBsZW4gPSB0ZXh0Lmxlbmd0aDtcclxuICAgIHZhciBlbGxpcHNpcyA9IFwiLi5cIjtcclxuICAgIHZhciB0ZXh0V2lkdGggPSAodGV4dFByb3Aud2lkdGggPiAzMCkgPyB0ZXh0UHJvcC53aWR0aCAtIDEwIDogdGV4dFByb3Aud2lkdGg7XHJcbiAgICB3aGlsZSAoKHdpZHRoID0gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCkgPiB0ZXh0V2lkdGgpIHtcclxuICAgICAgLS1sZW47XHJcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBsZW4pICsgZWxsaXBzaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRleHRVdGlsaXRpZXM7Il19

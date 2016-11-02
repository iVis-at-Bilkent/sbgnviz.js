var sbgnNetworkContainer;

$(document).ready(function ()
{
  sbgnNetworkContainer = $('#sbgn-network-container');
  // create and init cytoscape:
  var cy = cytoscape({
    container: sbgnNetworkContainer,
    style: sbgnStyleSheet,
    showOverlay: false, minZoom: 0.125, maxZoom: 16,
    boxSelectionEnabled: true,
    motionBlur: true,
    wheelSensitivity: 0.1,
    ready: function() {
      window.cy = this;
      registerUndoRedoActions();
      cytoscapeExtensionsAndContextMenu();
      bindCyEvents();
    }
  });
});

// sbgnviz stylesheet to use with cytoscape.js
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
      'background-image': 'sampleapp-images/clone_bg.png',
      'background-position-x': '50%',
      'background-position-y': '100%',
      'background-width': '100%',
      'background-height': '25%',
      'background-fit': 'none',
      'background-image-opacity': function (ele) {
        if(!ele.data('sbgnclonemarker')){
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
      'font-size': function (ele) {
        return sbgnElementUtilities.getLabelTextSize(ele);
      },
      'width': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('width');
      },
      'height': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('height');
      },
      'content': function(ele){
        return sbgnElementUtilities.getElementContent(ele);
      }
    })
    .selector("node[sbgnclass='compartment']")
    .css({
      'border-width': 3.75,
      'background-opacity': 0,
      'background-color': '#FFFFFF',
      'content': function(ele){
        return sbgnElementUtilities.getElementContent(ele);
      },
      'width': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('width');
      },
      'height': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('height');
      },
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': function (ele) {
        return sbgnElementUtilities.getLabelTextSize(ele);
      }
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
    .css({
      'width': 'data(sbgnbbox.w)',
      'height': 'data(sbgnbbox.h)'
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
    .selector("edge[sbgnclass='consumption']")
    .css({
      'line-style': 'consumption'
    })
    .selector("edge[sbgnclass='production']")
    .css({
      'target-arrow-fill': 'filled',
      'line-style': 'production'
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
    .selector("node.changeBackgroundOpacity")
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
        if(!ele.data('sbgnclonemarker')){
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
    removeBendMenuItemTitle: "Delete Bend Point"
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
      selector: 'node[expanded-collapsed="expanded"]',
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

  sbgnNetworkContainer.cytoscapePanzoom(panProps);
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

  cy.on("mousedown", "node", function () {
    var self = this;
    if (window.ctrlKeyDown) {
      enableDragAndDropMode();
      window.nodeToDragAndDrop = self;
    }
  });

  cy.on("mouseup", function (event) {
    var self = event.cyTarget;
    if (window.dragAndDropModeEnabled) {
      var nodesData = getNodesData();
      nodesData.firstTime = true;
      var newParent;
      if (self != cy) {
        newParent = self;
      }
      var node = window.nodeToDragAndDrop;

      if (newParent && self.data("sbgnclass") != "complex" && self.data("sbgnclass") != "compartment") {
        return;
      }

      if (newParent && self.data("sbgnclass") == "complex" && !sbgnElementUtilities.isEPNClass(node.data("sbgnclass"))) {
        return;
      }

      disableDragAndDropMode();

      if (node.parent()[0] == newParent || node._private.data.parent == node.id()) {
        return;
      }

      var param = {
        newParent: newParent,
        node: node,
        nodesData: nodesData,
        posX: event.cyPosition.x,
        posY: event.cyPosition.y
      };

      cy.undoRedo().do("changeParent", param);
    }
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

  cy.on('select', 'node', function (event) {
    if (cy.nodes(':selected').filter(':visible').length == 1) {
      window.firstSelectedNode = this;
    }
  });

  cy.on('unselect', 'node', function (event) {
    if (window.firstSelectedNode == this) {
      window.firstSelectedNode = null;
    }
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
    if(preferences === undefined){
      preferences = {};
    }
    var options = $.extend({}, this.currentLayoutProperties, preferences);
    if(undoable === false) {
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
      self.currentLayoutProperties.animate = document.getElementById("animate").checked?'during':'end';
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

    $("#query-pathsbetween-enable-shortest-k-alteration").change(function(e){
      if(document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked){
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", false );
      } else {
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", true );
      }
    });

    dialogUtilities.openDialog(self.el, {width:'auto'});

    $(document).off("click", "#save-query-pathsbetween").on("click", "#save-query-pathsbetween", function (evt) {

      self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);

      var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=PATHSBETWEEN&limit="
          + self.currentQueryParameters.lengthLimit;
      var sources = "";
      var filename = "";
      var geneSymbolsArray = self.currentQueryParameters.geneSymbols.replace("\n"," ").replace("\t"," ").split(" ");
      for(var i = 0; i < geneSymbolsArray.length; i++){
        var currentGeneSymbol = geneSymbolsArray[i];
        if(currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
            || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
          continue;
        }
        sources = sources + "&source=" + currentGeneSymbol;
        if(filename == ''){
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
        success: function(data) {
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


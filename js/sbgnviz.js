//TODO: move "ready" func. here; simplify.
$(document).ready(function ()
{


    dynamicResize();
});

$(window).on('resize', dynamicResize);

//Override String endsWith method for IE
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var NotyView = Backbone.View.extend({
  render: function () {
    noty({layout: "bottomRight", "timeout": 8000, text: "Right click on a gene to see its details!"});
    return this;
  }
});

var SBGNContainer = Backbone.View.extend({
  render: function () {
    (new NotyView({
      template: "#noty-info"//, model: {}
    })).render();

    var container = $(this.el);
    var cytoscapeJsGraph = (this.model.cytoscapeJsGraph);

    var positionMap = {};
    //add position information to data for preset layout
    for (var i = 0; i < cytoscapeJsGraph.nodes.length; i++) {
      var xPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.x;
      var yPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.y;
      positionMap[cytoscapeJsGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
    }

    var cyOptions = {
      elements: cytoscapeJsGraph,
      style: sbgnStyleSheet,
      layout: {
        name: 'preset',
        positions: positionMap
      },
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function ()
      {
        window.cy = this;
        cy.nodes().addClass('changeLabelTextSize');
        
        registerUndoRedoActions();
        
        // register cy extensions
        
        cy.expandCollapse(getExpandCollapseOptions());
        
        var contextMenus = cy.contextMenus({
          menuItemClasses: ['customized-context-menus-menu-item']
        });
        
        cy.edgeBendEditing({
          // this function specifies the positions of bend points
          bendPositionsFunction: function(ele) {
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
              cy.undoRedo().do("removeEles", event.cyTarget);
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
            selector: 'node',
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
              if (modeHandler.mode == "selection-mode") {
                $("#perform-layout").trigger('click');
              }
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
        
        var edges = cy.edges();

        refreshPaddings();
        
        var panProps = ({
          fitPadding: 10,
          fitSelector: ':visible',
          animateOnFit: function(){
            return sbgnStyleRules['animate-on-drawing-changes'];
          },
          animateOnZoom: function(){
            return sbgnStyleRules['animate-on-drawing-changes'];
          }
        });
        
        container.cytoscapePanzoom(panProps);

        // listen events

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
            if(edge.hasClass('edgebendediting-hasbendpoints')) {
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

        cy.on("afterDo", function(actionName, args){
          refreshUndoRedoButtonsStatus();
        });

        cy.on("afterUndo", function(actionName, args){
          refreshUndoRedoButtonsStatus();
        });
        
        cy.on("afterRedo", function(actionName, args){
          refreshUndoRedoButtonsStatus();
        });

        cy.on("mousedown", "node", function () {
          var self = this;
          if (modeHandler.mode == 'selection-mode' && window.ctrlKeyDown) {
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

        window.firstSelectedNode = null;
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
    };
    container.html("");
    container.cy(cyOptions);
    return this;
  }
});

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
    stop: function(){
      if($('.layout-spinner').length > 0){
        $('.layout-spinner').remove();
      }
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
      }
      else {
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", true );
      }
    });

    dialogUtilities.openDialog(self.el, {width:'auto'});

    $(document).off("click", "#save-query-pathsbetween").on("click", "#save-query-pathsbetween", function (evt) {

      self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);

      var pc2URL = "http://www.pathwaycommons.org/pc2/";
      var format = "graph?format=SBGN";
      var kind = "&kind=PATHSBETWEEN";
      var limit = "&limit=" + self.currentQueryParameters.lengthLimit;
      var sources = "";
      var newfilename = "";
      
      var geneSymbolsArray = self.currentQueryParameters.geneSymbols.replace("\n"," ").replace("\t"," ").split(" ");
      for(var i = 0; i < geneSymbolsArray.length; i++){
        var currentGeneSymbol = geneSymbolsArray[i];
        if(currentGeneSymbol.length == 0 || currentGeneSymbol == ' ' || currentGeneSymbol == '\n' || currentGeneSymbol == '\t'){
          continue;
        }
        
        sources = sources + "&source=" + currentGeneSymbol;
        
        if(newfilename == ''){
          newfilename = currentGeneSymbol;
        }
        else{
          newfilename = newfilename + '_' + currentGeneSymbol;
        }
      }
      
      newfilename = newfilename + '_PBTWN.sbgnml';
      
      setFileContent(newfilename);
      
      var containerWidth = cy.width();
      var containerHeight = cy.height();
      $('#sbgn-network-container').html('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
      
      $.ajax(
      {
        url: pc2URL + format + kind + limit + sources,
        type: 'GET',
        success: function(data)
        {
          (new SBGNContainer({
            el: '#sbgn-network-container',
            model: {cytoscapeJsGraph: sbgnmlToJson.convert(data)}
          })).render();
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

var setFileContent = function (fileName) {
  var span = document.getElementById('file-name');
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(document.createTextNode(fileName));
};

var loadSample = function(filename){
  var xmlObject = loadXMLDoc('samples/' + filename);

  setFileContent(filename.replace('xml', 'sbgnml'));

  (new SBGNContainer({
    el: '#sbgn-network-container',
    model: {cytoscapeJsGraph: sbgnmlToJson.convert(xmlObject)}
  })).render();

};

var loadSBGNMLText = function(text){
  (new SBGNContainer({
    el: '#sbgn-network-container',
    model: {cytoscapeJsGraph:
        sbgnmlToJson.convert(textToXmlObject(text))}
  })).render();
};

var loadSBGNMLFile = function(file) {
  var textType = /text.*/;

  var reader = new FileReader();

  reader.onload = function (e) {
    loadSBGNMLText(this.result);
  }
  reader.readAsText(file);
  setFileContent(file.name);
};

var beforePerformLayout = function(){
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

//A function to trigger incremental layout. Its definition is inside document.ready()
var triggerIncrementalLayout;

var getExpandCollapseOptions = function() {
  return {
    fisheye: function(){
      return sbgnStyleRules['rearrange-after-expand-collapse'];
    },
    animate: function(){
      return sbgnStyleRules['animate-on-drawing-changes'];
    }
  };
};

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

$(document).ready(function () {
  loadSample('neuronal_muscle_signalling.xml');

  var sbgnLayoutProp = new SBGNLayout({
    el: '#sbgn-layout-table'
  });

  var sbgnProperties = new SBGNProperties({
    el: '#sbgn-properties-table'
  });

  var pathsBetweenQuery = new PathsBetweenQuery({
    el: '#query-pathsbetween-table'
  });

  triggerIncrementalLayout = function(){
    if(!sbgnStyleRules['rearrange-after-expand-collapse']) {
      return;
    }
    beforePerformLayout();

    var preferences = {
      randomize: false,
      animate: sbgnStyleRules['animate-on-drawing-changes']?'end':false,
      fit: false
    };

    if(sbgnLayoutProp.currentLayoutProperties.animate === 'during'){
      delete preferences.animate;
    }

    sbgnLayoutProp.applyLayout(preferences, false); // layout must not be undoable
  };

  // set layoutBy option of expand collapse extension
  cy.setExpandCollapseOption('layoutBy', triggerIncrementalLayout);

  $("body").on("change", "#file-input", function (e) {
    if ($("#file-input").val() == "") {
      return;
    }

    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];

    loadSBGNMLFile(file);

    $("#file-input").val("");
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

  $("#hide-selected").click(function (e) {
    var selectedEles = cy.$(":selected");

    if(selectedEles.length === 0){
      return;
    }

    cy.undoRedo().do("hide", selectedEles);
  });

  $("#hide-selected-icon").click(function (e) {
    $("#hide-selected").trigger('click');
  });

  $("#show-selected").click(function (e) {
    if(cy.elements(":selected").length === cy.elements(':visible').length) {
      return;
    }

    cy.undoRedo().do("show", cy.elements(":selected"));
  });

  $("#show-selected-icon").click(function (e) {
    $("#show-selected").trigger('click');
  });

  $("#show-all").click(function (e) {
    if(cy.elements().length === cy.elements(':visible').length) {
      return;
    }

    cy.undoRedo().do("show", cy.elements());
  });

  $("#delete-selected-smart").click(function (e) {
    if(cy.$(":selected").length == 0){
      return;
    }

    var param = {
      firstTime: true
    };

    cy.undoRedo().do("deleteSelected", param);
  });

  $("#delete-selected-smart-icon").click(function (e) {
    $("#delete-selected-smart").trigger('click');
  });

  $("#neighbors-of-selected").click(function (e) {
    var elesToHighlight = sbgnElementUtilities.getNeighboursOfSelected();

    if(elesToHighlight.length === 0) {
      return;
    }

    var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
    var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);

    if(elesToHighlight.same(highlightedEles)) {
      return;
    }

    cy.undoRedo().do("highlight", elesToHighlight);
  });

  $("#highlight-neighbors-of-selected-icon").click(function (e) {
    $("#neighbors-of-selected").trigger('click');
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

    if(elesToHighlight.length === 0) {
      return;
    }

    var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
    var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);

    if(elesToHighlight.same(highlightedEles)) {
      return;
    }

    cy.undoRedo().do("highlight", elesToHighlight);
  });

  $("#remove-highlights").click(function (e) {

    if (sbgnElementUtilities.noneIsNotHighlighted()){
      return;
    }

    cy.undoRedo().do("removeHighlights");
  });

  $('#remove-highlights-icon').click(function (e) {
    $('#remove-highlights').trigger("click");
  });

  $("#make-compound-complex").click(function (e) {
    var selected = cy.nodes(":selected").filter(function (i, element) {
      var sbgnclass = element.data("sbgnclass")
      return sbgnElementUtilities.isEPNClass(sbgnclass);
    });
    selected = sbgnElementUtilities.getTopMostNodes(selected);
    if (selected.length == 0 || !sbgnElementUtilities.allHaveTheSameParent(selected)) {
      return;
    }
    var param = {
      compundType: "complex",
      nodesToMakeCompound: selected
    };

    cy.undoRedo().do("createCompoundForSelectedNodes", param);
  });

  $("#make-compound-compartment").click(function (e) {
    var selected = cy.nodes(":selected");
    selected = sbgnElementUtilities.getTopMostNodes(selected);
    if (selected.length == 0 || !sbgnElementUtilities.allHaveTheSameParent(selected)) {
      return;
    }

    var param = {
      compundType: "compartment",
      nodesToMakeCompound: selected
    };

    cy.undoRedo().do("createCompoundForSelectedNodes", param);
  });

  $("#layout-properties").click(function (e) {
    sbgnLayoutProp.render();
  });

  $("#layout-properties-icon").click(function (e) {
    $("#layout-properties").trigger('click');
  });

  $("#delete-selected-simple").click(function (e) {
    var selectedEles = cy.$(":selected");

    if(selectedEles.length == 0){
      return;
    }
    cy.undoRedo().do("removeEles", selectedEles);
  });

  $("#delete-selected-simple-icon").click(function (e) {
    $("#delete-selected-simple").trigger('click');
  });

  $("#sbgn-properties").click(function (e) {
    sbgnProperties.render();
  });

  $("#query-pathsbetween").click(function (e) {
    pathsBetweenQuery.render();
  });

  $("#properties-icon").click(function (e) {
    $("#sbgn-properties").trigger('click');
  });

  $("#collapse-selected").click(function (e) {
    var nodes = cy.nodes(":selected");
    var thereIs = nodes.collapsibleNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  });

  $("#collapse-complexes").click(function (e) {
    var complexes = cy.nodes("[sbgnclass='complex']");
    var thereIs = complexes.collapsibleNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("collapseRecursively", {
      nodes: complexes
    });
  });

  $('#align-horizontal-top').click(function (e) {
    cy.undoRedo().do("align", {
      nodes: cy.nodes(":selected"),
      horizontal: "top"
    });
  });

  $("#align-horizontal-top-icon").click(function (e) {
    $("#align-horizontal-top").trigger('click');
  });

  $('#align-horizontal-middle').click(function (e) {
    cy.undoRedo().do("align", {
      nodes: cy.nodes(":selected"),
      horizontal: "center"
    });
  });

  $("#collapse-selected-icon").click(function (e) {
    if (modeHandler.mode == "selection-mode") {
      $("#collapse-selected").trigger('click');
    }
  });

  $("#expand-selected").click(function (e) {
    var nodes = cy.nodes(":selected").filter("[expanded-collapsed='collapsed']");
    var thereIs = nodes.expandableNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("expand", {
      nodes: nodes,
//      options: getExpandCollapseOptions()
    });
  });

  $("#expand-complexes").click(function (e) {
    var nodes = cy.nodes(":selected").filter("[sbgnclass='complex'][expanded-collapsed='collapsed']");
    var thereIs = nodes.expandableNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("expandRecursively", {
      nodes: nodes,
//      options: getExpandCollapseOptions()
    });
  });

  $("#expand-selected-icon").click(function (e) {
    if (modeHandler.mode == "selection-mode") {
      $("#expand-selected").trigger('click');
    }
  });

  $("#collapse-all").click(function (e) {
    var nodes = cy.nodes(':visible').filter("[expanded-collapsed='expanded']");
    var thereIs = nodes.collapsibleNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("collapseRecursively", {
      nodes: nodes,
//      options: getExpandCollapseOptions()
    });
  });

  $("#expand-all").click(function (e) {
    var nodes = cy.nodes(':visible').filter("[expanded-collapsed='collapsed']");
    var thereIs = nodes.expandableNodes().length > 0;

    if (!thereIs) {
      return;
    }

    cy.undoRedo().do("expandRecursively", {
      nodes: nodes,
//      options: getExpandCollapseOptions()
    });
  });

  $("#perform-layout-icon").click(function (e) {
    if (modeHandler.mode == "selection-mode") {
      $("#perform-layout").trigger('click');
    }
  });

  $("#perform-layout").click(function (e) {
    var nodesData = getNodesData();
    if($('.layout-spinner').length === 0){
      var containerWidth = cy.width();
      var containerHeight = cy.height();
      $('#sbgn-network-container').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw layout-spinner"></i>');
    }

    beforePerformLayout();
    var preferences = {
      animate: sbgnStyleRules['animate-on-drawing-changes']?'end':false
    };

    if(sbgnLayoutProp.currentLayoutProperties.animate == 'during'){
      delete preferences.animate;
    }

    sbgnLayoutProp.applyLayout(preferences);

    nodesData.firstTime = true;
  });

  $("#undo-last-action").click(function (e) {
    cy.undoRedo().undo();
  });

  $("#redo-last-action").click(function (e) {
    cy.undoRedo().redo();
  });

  $("#undo-icon").click(function (e) {
    $("#undo-last-action").trigger('click');
  });

  $("#redo-icon").click(function (e) {
    $("#redo-last-action").trigger('click');
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

    //window.open(pngContent, "_blank");
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

  $("#load-file").click(function (evt) {
    $("#file-input").trigger('click');
  });

  $("#load-file-icon").click(function (evt) {
    $("#load-file").trigger('click');
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

  $("body").on("click", ".biogene-info .expandable", function (evt) {
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
});

function registerUndoRedoActions() {
    // create undo-redo instance
    var ur = cy.undoRedo({
        keyboardShortcuts: {
            ctrl_z: false, // undo
            ctrl_y: false, // redo
            ctrl_shift_z: false // redo
        }
    });

    // register general actions
    // (generalActionFunctions.changeBendPoints is undefined, perhaps removed in refactoring from editor to viewer...)
    // ur.action("changeBendPoints", generalActionFunctions.changeBendPoints, generalActionFunctions.changeBendPoints);
    // register add remove actions
    ur.action("removeEles", sbgnElementUtilities.removeEles, sbgnElementUtilities.restoreEles);
    ur.action("deleteSelected", sbgnElementUtilities.deleteSelected, sbgnElementUtilities.restoreSelected);
};

function dynamicResize() {
    var win = $(this); //this = window

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
}

var getNodesData = function () {
    var nodesData = {};
    var nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        nodesData[node.id()] = {
            width: node.width(),
            height: node.height(),
            x: node.position("x"),
            y: node.position("y")
        };
    }
    return nodesData;
};

/*
 * This function obtains the info label of the given node by
 * it's children info recursively
 */
var getInfoLabel = function (node) {
    /*    * Info label of a collapsed node cannot be changed if
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
        var childInfo = getInfoLabel(child);

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
};

/*
 * This function create qtip for the given node
 */
var nodeQtipFunction = function (node) {
    /*    * Check the sbgnlabel of the node if it is not valid
     * then check the infolabel if it is also not valid do not show qtip
     */
    var label = node._private.data.sbgnlabel;

    if (label == null || label == "")
        label = getInfoLabel(node);

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

};

/*
 * This function refreshes the enabled-disabled status of undo-redo buttons.
 * The status of buttons are determined by whether the undo-redo stacks are empty.
 */
var refreshUndoRedoButtonsStatus = function () {
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
};

function calculatePaddings (paddingPercent) {
    //As default use the compound padding value
    if (!paddingPercent) {
        paddingPercent = parseInt(sbgnStyleRules['compound-padding'], 10);
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

var refreshPaddings = function () {
    var calc_padding = calculatePaddings();

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
};


var SBGNStyleProperties = {
  'compound-padding': 20,
  'dynamic-label-size': 'regular',
  'fit-labels-to-nodes': 'true',
  'expanded-callopsed': 'expanded'
};

var refreshPaddings = function () {
  //If compound padding is not set yet set it by css value
  if (window.compoundPadding == null) {
    window.compoundPadding = parseInt(cy.$("node").css('compound-padding'), 10);
  }
  var nodes = cy.nodes();
  var total = 0;
  var numOfSimples = 0;

  for (var i = 0; i < nodes.length; i++) {
    var theNode = nodes[i];
    if (theNode.children() == null || theNode.children().length == 0) {
      total += Number(theNode._private.data.sbgnbbox.w);
      total += Number(theNode._private.data.sbgnbbox.h);
      numOfSimples++;
    }
  }

  var calc_padding = (compoundPadding / 100) * Math.floor(total / (2 * numOfSimples));

  if (calc_padding < 10) {
    calc_padding = 10;
  }

  var complexesAndCompartments = cy.$("node[sbgnclass='complex'], node[sbgnclass='compartment']");
  complexesAndCompartments.css('padding-left', calc_padding);
  complexesAndCompartments.css('padding-right', calc_padding);
  complexesAndCompartments.css('padding-top', calc_padding);
  complexesAndCompartments.css('padding-bottom', calc_padding);

  //To refresh the nodes on the screen apply the preset layout
  cy.layout({name: 'preset'});
}

//Some nodes are initilized as callopsed this method handles them
var initCallopsedNodes = function () {
  var orphans = cy.nodes().orphans();
  for (var i = 0; i < orphans.length; i++) {
    var root = orphans[i];
    callopseBottomUp(root);
  }
}

//callopse the nodes in bottom up order 
var callopseBottomUp = function (root) {
  var children = root.children();
  for (var i = 0; i < children.length; i++) {
    var node = children[i];
    if (node.is("[sbgnclass!='complex']") && node.is("[sbgnclass!='compartment']")) {
      continue;
    }
    if (node.css('expanded-callopsed') == 'callopsed') {
      callopseBottomUp(node);
    }
  }
  if (( root.is("[sbgnclass='complex']") || root.is("[sbgnclass='compartment']") )
          && root.css('expanded-callopsed') == 'callopsed') {
    callopseNode(root);
  }
}

var expandNode = function (node) {
}

var callopseNode = function (node) {
  var children = node.children();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    barrowEdgesOfCallopsedChildren(node, child);
  }

  var callopsedChildren = children.remove();
  node._private.data.callopsedChildren = callopsedChildren;
  node.css('expanded-callopsed', 'callopsed');
  node.css('width', 100);
  node.css('height', 100);
}

var barrowEdgesOfCallopsedChildren = function (root, childNode) {
  var children = childNode.children();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    barrowEdgesOfCallopsedChildren(root, child);
  }

  var edges = childNode.connectedEdges();
  var _edgesOfCallopsedChildren = [];

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var source = edge.data("source");
    var target = edge.data("target");

    //store the data of the original edge
    //to restore when the node is expanded
    _edgesOfCallopsedChildren.push({
      id: edge.id(),
      source: source,
      target: target
    });
    //Inherit the css
    var css = edge.css();

    //If the change source and/or target of the edge in the 
    //case of they are equal to the id of the callopsed child
    if (source == childNode.id()) {
      source = root.id();
    }
    if (target == childNode.id()) {
      target = root.id();
    }

    edge.remove();

    //create the new edge with the same id and new source
    //and target
    cy.add({
      group: "edges",
      data: {id: edge.id(), source: source, target: target},
      css: css
    });
  }
  root._private.data.edgesOfCallopsedChildren = _edgesOfCallopsedChildren;
}

var repairEdgesOfCallopsedChildren = function (node) {

}

var sbgnStyleSheet = cytoscape.stylesheet()
        .selector("node")
        .css({
          'border-width': 1.5,
          'border-color': '#555',
          'background-color': '#f6f6f6',
          'font-size': 11,
          'shape': 'data(sbgnclass)',
          'background-opacity': '0.5',
          'compound-padding': SBGNStyleProperties['compound-padding'],
          'dynamic-label-size': SBGNStyleProperties['dynamic-label-size'],
          'fit-labels-to-nodes': SBGNStyleProperties['fit-labels-to-nodes']
        })
        .selector("node[sbgnclass='complex']")
        .css({
          'background-color': '#F4F3EE',
          'expanded-callopsed': SBGNStyleProperties['expanded-callopsed']
        })
        .selector("node[sbgnclass='compartment']")
        .css({
          'background-opacity': '0',
          'background-color': '#FFFFFF',
          'content': 'data(sbgnlabel)',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16',
          'expanded-callopsed': SBGNStyleProperties['expanded-callopsed']
        })
        .selector("node[sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
        .css({
          'width': 'data(sbgnbbox.w)',
          'height': 'data(sbgnbbox.h)'
        })
        .selector("node:selected")
        .css({
          'border-color': '#d67614',
          'target-arrow-color': '#000',
          'text-outline-color': '#000'
        })
        .selector("node:active")
        .css({
          'background-opacity': '0.7',
          'overlay-color': '#d67614',
          'overlay-padding': '14'
        })
        .selector("edge")
        .css({
          'line-color': '#555',
          'target-arrow-fill': 'hollow',
          'source-arrow-fill': 'hollow',
          'width': 1.5,
          'target-arrow-color': '#555',
          'source-arrow-color': '#555',
          'target-arrow-shape': 'data(sbgnclass)'
        })
        .selector("edge[sbgnclass='inhibition']")
        .css({
          'target-arrow-fill': 'filled'
        })
        .selector("edge[sbgnclass='consumption']")
        .css({
          'target-arrow-shape': 'none',
          'source-arrow-shape': 'data(sbgnclass)',
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
          'background-opacity': '0.7',
          'overlay-color': '#d67614',
          'overlay-padding': '8'
        })
        .selector("core")
        .css({
          'selection-box-color': '#d67614',
          'selection-box-opacity': '0.2',
          'selection-box-border-color': '#d67614'
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
        }); // end of sbgnStyleSheet

var NotyView = Backbone.View.extend({
  render: function () {
    //this.model["theme"] = " twitter bootstrap";
    this.model["layout"] = "bottomRight";
    this.model["timeout"] = 8000;
    this.model["text"] = "Right click on a gene to see its details!";

    noty(this.model);
    return this;
  }
});

var SBGNContainer = Backbone.View.extend({
  cyStyle: sbgnStyleSheet,
  render: function () {
    (new NotyView({
      template: "#noty-info",
      model: {}
    })).render();

    var container = $(this.el);
    // container.html("");
    // container.append(_.template($("#loading-template").html()));


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
      showOverlay: false,
      minZoom: 0.125,
      maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function ()
      {
        window.cy = this;

        initCallopsedNodes();

        refreshPaddings();

        var panProps = ({
          fitPadding: 10,
        });
        container.cytoscapePanzoom(panProps);

        cy.on('mouseover', 'node', function (event) {
          var node = this;

          $(".qtip").remove();

          if (event.originalEvent.shiftKey)
            return;

          var label = node._private.data.sbgnlabel;

          if (typeof label === 'undefined' || label == "")
            return;

          cy.getElementById(node.id()).qtip({
            content: label,
            show: {
              ready: true,
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

        });

        cy.on('cxttap', 'node', function (event) {
          var node = this;
          $(".qtip").remove();

          var geneClass = node._private.data.sbgnclass;
          if (geneClass != 'macromolecule' && geneClass != 'nucleic acid feature' &&
                  geneClass != 'unspecified entity')
            return;

          var queryScriptURL = "sampleapp-components/php/BioGeneQuery.php";
          var geneName = node._private.data.sbgnlabel;

          // set the query parameters
          var queryParams =
                  {
                    query: geneName,
                    org: "human",
                    format: "json",
                  };

          cy.getElementById(node.id()).qtip({
            content: {
              text: function (event, api) {
                $.ajax({
                  type: "POST",
                  url: queryScriptURL,
                  async: true,
                  data: queryParams,
                })
                        .then(function (content) {
                          queryResult = JSON.parse(content);
                          if (queryResult.count > 0 && queryParams.query != "" && typeof queryParams.query != 'undefined')
                          {
                            var info = (new BioGeneView(
                                    {
                                      el: '#biogene-container',
                                      model: queryResult.geneInfo[0]
                                    })).render();
                            var html = $('#biogene-container').html();
                            api.set('content.text', html);
                          }
                          else {
                            api.set('content.text', "No additional information available &#013; for the selected node!");
                          }
                        }, function (xhr, status, error) {
                          api.set('content.text', "Error retrieving data: " + error);
                        });
                api.set('content.title', node._private.data.sbgnlabel);
                return _.template($("#loading-small-template").html());
              }
            },
            show: {
              ready: true
            },
            position: {
              my: 'top center',
              at: 'bottom center',
              adjust: {
                cyViewport: true
              },
              effect: false
            },
            style: {
              classes: 'qtip-bootstrap',
              tip: {
                width: 16,
                height: 8
              }
            }
          });
        });

        cy.on('tap', 'node', function (event) {
          var node = this;
          
          var cyPosX = event.cyPosition.x;
          var cyPosY = event.cyPosition.y;

          if (cyPosX >= node._private.data.expandCallopseStartX
                  && cyPosX <= node._private.data.expandCallopseEndX
                  && cyPosY >= node._private.data.expandCallopseStartY
                  && cyPosY <= node._private.data.expandCallopseEndY) {
            var expandedOrCallopsed = this.css('expanded-callopsed');
            if (expandedOrCallopsed == 'expanded') {
              this.css('expanded-callopsed', 'callopsed');
              callopseNode(this);
            }
            else {
              this.css('expanded-callopsed', 'expanded');
              expandNode(this);
            }
//            this.children().remove();
            console.log(this.selected());
          }
          
          $(".qtip").remove();

          if (event.originalEvent.shiftKey)
            return;

          var label = node._private.data.sbgnlabel;

          if (typeof label === 'undefined' || label == "")
            return;

          cy.getElementById(node.id()).qtip({
            content: label,
            show: {
              ready: true,
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
    name: 'cose2',
    nodeRepulsion: 4500,
    nodeOverlap: 10,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.4,
    numIter: 2500,
    tile: true,
    animate: true,
    randomize: true
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: function () {
    var options = this.currentLayoutProperties;
    cy.elements().filter(':visible').layout(options);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout").die("click").live("click", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      self.currentLayoutProperties.nodeOverlap = Number(document.getElementById("node-overlap").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      self.currentLayoutProperties.tile = document.getElementById("tile").checked;
      self.currentLayoutProperties.animate = document.getElementById("animate").checked;
      self.currentLayoutProperties.randomize = !document.getElementById("incremental").checked;

      $(self.el).dialog('close');
    });

    $("#default-layout").die("click").live("click", function (evt) {
      self.copyProperties();
      self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var SBGNProperties = Backbone.View.extend({
  defaultSBGNProperties: {
    compoundPadding: parseInt(SBGNStyleProperties['compound-padding'], 10),
    dynamicLabelSize: SBGNStyleProperties['dynamic-label-size'],
    fitLabelsToNodes: SBGNStyleProperties['fit-labels-to-nodes']
  },
  currentSBGNProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
  },
  copyProperties: function () {
    this.currentSBGNProperties = _.clone(this.defaultSBGNProperties);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-sbgn").die("click").live("click", function (evt) {
      self.currentSBGNProperties.compoundPadding = Number(document.getElementById("compound-padding").value);
      self.currentSBGNProperties.dynamicLabelSize = $('select[name="dynamic-label-size"] option:selected').val();
      self.currentSBGNProperties.fitLabelsToNodes = document.getElementById("fit-labels-to-nodes").checked;

      //Refresh paddings if needed
      if (compoundPadding != self.currentSBGNProperties.compoundPadding) {
        compoundPadding = self.currentSBGNProperties.compoundPadding;
        refreshPaddings();
      }
      //Refresh label size if needed
      if (dynamicLabelSize != self.currentSBGNProperties.dynamicLabelSize) {
        dynamicLabelSize = self.currentSBGNProperties.dynamicLabelSize;
        cy.forceRender();
      }
      //Refresh truncations if needed
      if (fitLabelsToNodes != self.currentSBGNProperties.fitLabelsToNodes) {
        fitLabelsToNodes = self.currentSBGNProperties.fitLabelsToNodes;
        cy.forceRender();
      }

      $(self.el).dialog('close');
    });

    $("#default-sbgn").die("click").live("click", function (evt) {
      self.copyProperties();
      self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

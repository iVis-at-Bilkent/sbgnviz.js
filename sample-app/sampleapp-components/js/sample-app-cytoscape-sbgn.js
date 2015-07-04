var SBGNStyleProperties = {
  'compound-padding': 20,
  'dynamic-label-size': 'regular',
  'fit-labels-to-nodes': 'true',
  'expanded-collapsed': 'expanded'
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
      var collapsedChildren = theNode._private.data.collapsedChildren;
      if (collapsedChildren == null || collapsedChildren.length == 0) {
        total += Number(theNode._private.data.sbgnbbox.w);
        total += Number(theNode._private.data.sbgnbbox.h);
        numOfSimples++;
      }
      else {
        var result = getCollapsedChildrenData(collapsedChildren, numOfSimples, total);
        numOfSimples = result.numOfSimples;
        total = result.total;
      }
    }
  }

  var calc_padding = (compoundPadding / 100) * Math.floor(total / (2 * numOfSimples));

  if (calc_padding < 10) {
    calc_padding = 10;
  }

  var complexesAndCompartments = cy.$("node[sbgnclass='complex'], node[sbgnclass='compartment']");
  complexesAndCompartments.css('padding-left', calc_padding + 8);
  complexesAndCompartments.css('padding-right', calc_padding + 8);
  complexesAndCompartments.css('padding-top', calc_padding + 8);
  complexesAndCompartments.css('padding-bottom', calc_padding + 8);

  //To refresh the nodes on the screen apply the preset layout
  cy.layout({name: 'preset'});
}

var getCollapsedChildrenData = function (collapsedChildren, numOfSimples, total) {
  for (var i = 0; i < collapsedChildren; i++) {
    var collapsedChild = collapsedChildren[i];
    if (collapsedChild._private.data.collapsedChildren == null
            || collapsedChild._private.data.collapsedChildren.length == 0) {
      total += Number(collapsedChild._private.data.sbgnbbox.w);
      total += Number(collapsedChild._private.data.sbgnbbox.h);
      numOfSimples++;
    }
    else {
      var result =
              getCollapsedChildrenData(collapsedChild._private.data.collapsedChildren, numOfSimples, total);
      numOfSimples = result.numOfSimples;
      total = result.total;
    }
  }
  return {
    numOfSimples: numOfSimples,
    total: total
  };
}

//Some nodes are initilized as collapsed this method handles them
var initCollapsedNodes = function () {
  var orphans = cy.nodes().orphans();
  for (var i = 0; i < orphans.length; i++) {
    var root = orphans[i];
    collapseBottomUp(root);
  }
}

//collapse the nodes in bottom up order 
var collapseBottomUp = function (root) {
  var children = root.children();
  for (var i = 0; i < children.length; i++) {
    var node = children[i];
    if (node.is("[sbgnclass!='complex']") && node.is("[sbgnclass!='compartment']")) {
      continue;
    }
    if (node.css('expanded-collapsed') == 'collapsed') {
      collapseBottomUp(node);
    }
  }
  if ((root.is("[sbgnclass='complex']") || root.is("[sbgnclass='compartment']"))
          && root.css('expanded-collapsed') == 'collapsed') {
    collapseNode(root);
  }
}

var expandNode = function (node) {
  if (node._private.data.collapsedChildren != null) {
    node.css('expanded-collapsed', 'expanded');
    node._private.data.collapsedChildren.restore();
    repairEdgesOfCollapsedChildren(node);
    node._private.data.collapsedChildren = null;
    node.css("width", node._private.data.oldWidth);
    node.css("height", node._private.data.oldHeight);
    cy.nodes().updateCompoundBounds();

    $( "#perform-incremental-layout").trigger( "click" );
  }
}

var collapseNode = function (node) {
  node.css('expanded-collapsed', 'collapsed');
  var children = node.children();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    barrowEdgesOfcollapsedChildren(node, child);
  }
  node._private.data.oldWidth = node.css('width');
  node._private.data.oldHeight = node.css('height');
  removeChildren(node, node);

  node.css('width', 75);
  node.css('height', 75);
}

var removeChildren = function (node, root) {
  var children = node.children();

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    removeChildren(child, root);
    var removedChild = child.remove();
    if (root._private.data.collapsedChildren == null) {
      root._private.data.collapsedChildren = removedChild;
    }
    else {
      root._private.data.collapsedChildren = root._private.data.collapsedChildren.union(removedChild);
    }
  }
}

var barrowEdgesOfcollapsedChildren = function (root, childNode) {
  var children = childNode.children();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    barrowEdgesOfcollapsedChildren(root, child);
  }

  var edges = childNode.connectedEdges();

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];

    var source = edge.data("source");
    var target = edge.data("target");
    var sourceNode = edge.source();
    var targetNode = edge.target();

    var newEdge = jQuery.extend(true, {}, edge.jsons()[0]);
    var removedEdge = edge.remove();
    //store the data of the original edge
    //to restore when the node is expanded
    if (root._private.data.edgesOfcollapsedChildren == null) {
      root._private.data.edgesOfcollapsedChildren = removedEdge;
    }
    else {
      root._private.data.edgesOfcollapsedChildren =
              root._private.data.edgesOfcollapsedChildren.union(removedEdge);
    }

    //Do not handle the inner edges
    if (!isOuterNode(sourceNode, root) && !isOuterNode(targetNode, root)) {
      continue;
    }

    //If the change source and/or target of the edge in the 
    //case of they are equal to the id of the collapsed child
    if (source == childNode.id()) {
      source = root.id();
    }
    if (target == childNode.id()) {
      target = root.id();
    }

    //prepare the new edge by changing the older source and/or target
    newEdge.data.portsource = source;
    newEdge.data.porttarget = target;
    newEdge.data.source = source;
    newEdge.data.target = target;

    //remove the older edge and add the new one
    cy.add(newEdge);
  }
}

var repairEdgesOfCollapsedChildren = function (node) {
  var edgesOfcollapsedChildren = node._private.data.edgesOfcollapsedChildren;
  if (edgesOfcollapsedChildren == null) {
    return;
  }
  for (var i = 0; i < edgesOfcollapsedChildren.length; i++) {
    var oldEdge = cy.getElementById(edgesOfcollapsedChildren[i]._private.data.id);
    if (oldEdge != null)
      oldEdge.remove();
  }
  edgesOfcollapsedChildren.restore();
  node._private.data.edgesOfcollapsedChildren = null;
}

/*node is an outer node of root 
 if root is not it's anchestor 
 and it is not the root itself*/
var isOuterNode = function (node, root) {
  var temp = node;
  while (temp != null) {
    if (temp == root) {
      return false;
    }
    temp = temp.parent()[0];
  }
  return true;
}

var printNodeInfo = function () {
  console.log("print node info");
  var nodes = cy.nodes();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    console.log(node.data("id") + "\t" + node.data("parent"));
  }
  console.log("print edge info");
  var edges = cy.edges();
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    console.log(edge.data("id") + "\t" + edge.data("source") + "\t" + edge.data("target"));
  }
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
          'expanded-collapsed': SBGNStyleProperties['expanded-collapsed']
        })
        .selector("node[sbgnclass='compartment']")
        .css({
          'background-opacity': '0',
          'background-color': '#FFFFFF',
          'content': 'data(sbgnlabel)',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16',
          'expanded-collapsed': SBGNStyleProperties['expanded-collapsed']
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

        refreshPaddings();
        initCollapsedNodes();

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

          if (cyPosX >= node._private.data.expandcollapseStartX
                  && cyPosX <= node._private.data.expandcollapseEndX
                  && cyPosY >= node._private.data.expandcollapseStartY
                  && cyPosY <= node._private.data.expandcollapseEndY) {
            var expandedOrcollapsed = this.css('expanded-collapsed');
            if (expandedOrcollapsed == 'expanded') {
//              this.css('expanded-collapsed', 'collapsed');
              collapseNode(this);
            }
            else {
//              this.css('expanded-collapsed', 'expanded');
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
  applyIncrementalLayout: function () {
    var options = _.clone(this.currentLayoutProperties);
    options.randomize = false;
    options.animate = false;
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

var sbgnStyleSheet = cytoscape.stylesheet()
        .selector("node")
        .css({
            'border-width' : 1.5,
            'border-color' : '#555',
            'background-color' : '#f6f6f6',
            'font-size' : 11,
            'shape' : 'data(sbgnclass)',
            'background-opacity' : '0.5'
        })
        .selector("node[sbgnclass='complex']")
        .css({
            'background-color' : '#F4F3EE',
            'padding-bottom' : '15',
            'padding-top' : '15',
            'padding-left' : '15',
            'padding-right' : '15'
        })
        .selector("node[sbgnclass='compartment']")
        .css({
            'background-opacity' : '0',
            'background-color' : '#FFFFFF',
            'content' : 'data(sbgnlabel)',
            'text-valign' : 'bottom',
            'text-halign' : 'center',
            'font-size' : '16',
            'padding-bottom' : '10',
            'padding-top' : '10',
            'padding-left' : '10',
            'padding-right' : '10'
        })
        .selector("node[sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
        .css({
            'width' : 'data(sbgnbbox.w)',
            'height' : 'data(sbgnbbox.h)'
        })
        .selector("node:selected")
        .css({
            'border-color' : '#d67614',
            'target-arrow-color' : '#000',
            'text-outline-color' : '#000'
        })
        .selector("node:active")
        .css({
            'background-opacity' : '0.7',
            'overlay-color' : '#d67614',
            'overlay-padding' : '14'
        })
        .selector("edge")
        .css({
            'line-color' : '#555',
            'target-arrow-fill' : 'hollow',
            'source-arrow-fill' : 'hollow',
            'width': 1.5,
            'target-arrow-color': '#555',
            'source-arrow-color': '#555',
            'target-arrow-shape' : 'data(sbgnclass)'
        })
        .selector("edge[sbgnclass='inhibition']")
        .css({
            'target-arrow-fill' : 'filled'
        })
        .selector("edge[sbgnclass='consumption']")
        .css({
            'target-arrow-shape' : 'none',
            'source-arrow-shape' : 'data(sbgnclass)',
            'line-style' : 'consumption'
        })
        .selector("edge[sbgnclass='production']")
        .css({
            'target-arrow-fill' : 'filled',
            'line-style' : 'production'
        })
        .selector("edge:selected")
        .css({
            'line-color' : '#d67614',
            'source-arrow-color': '#d67614',
            'target-arrow-color': '#d67614'
        })
        .selector("edge:active")
        .css({
            'background-opacity' : '0.7',
            'overlay-color' : '#d67614',
            'overlay-padding' : '8'
        })
        .selector("core")
        .css({
            'selection-box-color' : '#d67614',
            'selection-box-opacity' : '0.2',
            'selection-box-border-color' : '#d67614'
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
            'line-color' : '#5CC2ED'
        })
        .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
        .css({
            'shape' : 'rectangle',
            'width' : 15,
            'height' : 15
}); // end of sbgnStyleSheet

var NotyView = Backbone.View.extend({
    render: function() {
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

    render: function(){
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
        for (var i = 0 ; i < cytoscapeJsGraph.nodes.length ; i++){
            var xPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.x;
            var yPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.y;
            positionMap[cytoscapeJsGraph.nodes[i].data.id] = {'x':xPos, 'y':yPos};
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

            ready: function()
            {
                window.cy = this;

                var panProps = ({
                    fitPadding: 10,
                });
                container.cytoscapePanzoom(panProps);

                cy.on('mouseover', 'node', function(evt){
                  
                });

                cy.on('cxttap','node', function(event){
                    var node = this;
                    $(".qtip").remove();

                    var geneClass = node._private.data.sbgnclass;
                    if(geneClass != 'macromolecule' && geneClass != 'nucleic acid feature' &&
                        geneClass != 'unspecified entity')
                        return;

                    var queryScriptURL = "php/BioGeneQuery.php";
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
                            text: function(event, api) {
                                $.ajax({
                                    type: "POST",
                                    url: queryScriptURL,
                                    async: true,
                                    data: queryParams,
                                })
                                .then(function(content) {
                                    queryResult = JSON.parse(content);
                                    if(queryResult.count > 0 && queryParams.query != "" && typeof queryParams.query != 'undefined')
                                    {
                                        var info = (new BioGeneView(
                                        {
                                            el: '#biogene-container',
                                            model: queryResult.geneInfo[0]
                                        })).render();
                                        var html = $('#biogene-container').html();
                                        api.set('content.text', html);
                                    }
                                    else{
                                        api.set('content.text', "No additional information available &#013; for the selected node!");
                                    }
                                }, function(xhr, status, error) {
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

                cy.on('tap','node', function(event){
                    var node = this;
                    $(".qtip").remove();

                    if(event.originalEvent.shiftKey)
                        return;

                    var label = node._private.data.sbgnlabel;

                    if(typeof label === 'undefined' || label == "")
                        return;

                    cy.getElementById(node.id()).qtip({
                        content : label,
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
        animate: false
    },
    currentLayoutProperties: null,

    initialize: function() {
        var self = this;
        self.copyProperties();
        self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
    },

    copyProperties: function(){
        this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
    },

    applyLayout: function(){
        var options = this.currentLayoutProperties;
        cy.layout( options );
    },

    render: function(){
        var self = this;
        self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
        $(self.el).html(self.template);

        $(self.el).dialog();        

        $("#save-layout").die("click").live("click", function(evt){
            self.currentLayoutProperties.nodeRepulsion  = Number(document.getElementById("node-repulsion").value);
            self.currentLayoutProperties.nodeOverlap    = Number(document.getElementById("node-overlap").value);
            self.currentLayoutProperties.idealEdgeLength= Number(document.getElementById("ideal-edge-length").value);
            self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
            self.currentLayoutProperties.nestingFactor  = Number(document.getElementById("nesting-factor").value);
            self.currentLayoutProperties.gravity        = Number(document.getElementById("gravity").value);
            self.currentLayoutProperties.numIter        = Number(document.getElementById("num-iter").value);
            self.currentLayoutProperties.tile           = document.getElementById("tile").checked ;
            self.currentLayoutProperties.animate        = document.getElementById("animate").checked ;
            
            $(self.el).dialog('close');
        });

        $("#default-layout").die("click").live("click", function(evt){
            self.copyProperties();
            self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
            $(self.el).html(self.template);
        });

        return this;
    }
});

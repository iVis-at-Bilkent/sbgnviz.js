var sbgnFiltering = {

	notHighlightNodeProp : {'border-opacity': 0.3, 'text-opacity' : 0.3, 'background-opacity': 0.3},
    notHighlightEdgeProp : {'opacity':0.3, 'text-opacity' : 0.3, 'background-opacity': 0.3},
    highlightNodeProp : {'border-opacity': 1, 'text-opacity' : 1, 'background-opacity': 1},
    highlightEdgeProp : {'opacity':1, 'text-opacity' : 1, 'background-opacity': 1},
    processTypes : ['process', 'omitted process', 'uncertain process', 
        'association', 'dissociation', 'phenotype'],

    deleteSelected: function(){
        var allNodes = cy.nodes();
        var selectedNodes = cy.nodes(":selected");
        var nodesToShow = this.expandRemainingNodes(selectedNodes, allNodes);
        var nodesNotToShow = allNodes.not(nodesToShow);
        var connectedEdges = nodesNotToShow.connectedEdges();
        var removedEles = connectedEdges.remove();
        removedEles = removedEles.union(nodesNotToShow.remove());
        return removedEles;
    },

    hideSelected: function(){
        var allNodes = cy.nodes(":visible");
        var selectedNodes = cy.nodes(":selected");
        var nodesToShow = this.expandRemainingNodes(selectedNodes, allNodes);
        this.applyFilter(allNodes.not(nodesToShow));

        cy.elements(":selected").unselect();
    },

    showSelected: function(){       
        var allNodes = cy.nodes();
        var selectedNodes = cy.nodes(":selected");
        var nodesToShow = this.expandNodes(selectedNodes);
        this.applyFilter(allNodes.not(nodesToShow));

        cy.elements(":selected").unselect();
    },

    showAll: function(){
        this.removeFilter();     
    },

    highlightNeighborsofSelected: function(){
        var selectedEles = cy.elements(":selected");
        selectedEles = selectedEles.add(selectedEles.parents("node[sbgnclass='complex']"));
        selectedEles = selectedEles.add(selectedEles.descendants());
        var neighborhoodEles = selectedEles.neighborhood();
        var nodesToHighlight = selectedEles.add(neighborhoodEles);
        nodesToHighlight = nodesToHighlight.add(nodesToHighlight.descendants());
        nodesToHighlight.data("highlighted", 'true');
        this.highlightGraph(nodesToHighlight.nodes(), nodesToHighlight.edges());
    },

    highlightProcessesOfSelected: function(){
        var selectedEles = cy.elements(":selected");
        selectedEles = this.expandNodes(selectedEles);
        selectedEles.data("highlighted", 'true');
        this.highlightGraph(selectedEles.nodes(), selectedEles.edges());
    },

    removeHighlights: function(){
        this.highlightNodes(cy.nodes(":visible").nodes("[highlighted!='true']"));
        this.highlightEdges(cy.edges(":visible").edges("[highlighted!='true']"));
        cy.nodes(":visible").nodes().removeData("highlighted");
        cy.edges(":visible").edges().removeData("highlighted");
    },

    highlightGraph: function(nodes, edges){
        this.notHighlightNodes(cy.nodes(":visible").nodes("[highlighted!='true']"));
        this.notHighlightEdges(cy.edges(":visible").edges("[highlighted!='true']"));
        this.highlightNodes(cy.nodes(":visible").nodes("[highlighted='true']"));
        this.highlightEdges(cy.edges(":visible").edges("[highlighted='true']"));
        // cy.nodes("[highlighted=true]").not(nodes).css(this.notHighlightNode);
        // cy.edges().not(edges).css(this.notHighlightEdge);
    },
    
    highlightNodes: function(nodes){
        for(var prop in this.highlightNodeProp){
          nodes.css(prop, this.highlightNodeProp[prop]);
        }
    },
    
    notHighlightNodes: function(nodes){
        for(var prop in this.notHighlightNodeProp){
          nodes.css(prop, this.notHighlightNodeProp[prop]);
        }
    },
    
    highlightEdges: function(edges){
        for(var prop in this.highlightEdgeProp){
          edges.css(prop, this.highlightEdgeProp[prop]);
        }
    },
    
    notHighlightEdges: function(edges){
        for(var prop in this.notHighlightEdgeProp){
          edges.css(prop, this.notHighlightEdgeProp[prop]);
        }
    },

    expandNodes: function(nodesToShow){
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

    expandRemainingNodes: function(nodesToFilter, allNodes){
        nodesToFilter = this.expandNodes(nodesToFilter);
        var nodesToShow = allNodes.not(nodesToFilter);
        nodesToShow = this.expandNodes(nodesToShow);
        return nodesToShow;
    },

    applyFilter: function(nodesToFilterOut){
        //nodesToFilterOut = nodesToFilterOut.add(nodesToFilterOut.descendants());
//        nodesToFilterOut.hide();
        nodesToFilterOut.css('visibility', 'hidden');
        //nodesToFilterOut.data(filterType, true);
    },

    removeFilter: function(){
        cy.elements().css('visibility', 'visible');
    },
    
    removeFilterOfGivenNodes: function(nodes){
        nodes.css('visibility', 'visible');
    },
    
    showJustGivenNodes:  function(nodes){
        var visibleNodes = cy.nodes(":visible");
        this.applyFilter(visibleNodes);
        this.removeFilterOfGivenNodes(nodes);
    }
};
/*
 * Common utilities for elements includes both general utilities and sbgn specific utilities 
 */

var truncateText = require('./text-utilities').truncateText;
var optionUtilities = require('./option-utilities');
var options = optionUtilities.getOptions();
var libs = require('./lib-utilities').getLibs();
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

        var processes = nodesToShow.filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) >= 0;
        });
        var nonProcesses = nodesToShow.filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) === -1;
        });
        var neighborProcesses = nonProcesses.neighborhood().filter(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            return $.inArray(ele._private.data.class, self.processTypes) >= 0;
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
        // Get rid of rectangle postfix to have the actual node class
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
        
        // We need to define new node shapes with their class names for these nodes
        if (_class == 'source and sink' || _class == 'nucleic acid feature' || _class == 'macromolecule' 
                || _class == 'simple chemical' || _class == 'complex' || _class == 'unspecified entity' ) {
            return _class;
        }
        
        // These shapes can have ports. If they have ports we represent them by polygons, else they are represented by ellipses or rectangles
        // conditionally.
        if (_class == 'association' || _class == 'dissociation' || _class == 'process' || _class == 'omitted process'
                || _class == 'uncertain process' || _class == 'and' || _class == 'or' || _class == 'not' ) {
          
          if (ele.data('ports').length === 2) {
            return 'polygon'; // The node has ports represent it by polygon
          }
          else if (_class == 'process' || _class == 'omitted process' || _class == 'uncertain process') {
            return 'rectangle'; // If node has no port and has one of these classes it should be in a rectangle shape
          }
          
          return 'ellipse'; // Other nodes with no port should be in an ellipse shape
        }
        
        // The remaining nodes are supposed to be in ellipse shape
        return 'ellipse';
    },
    getCyArrowShape: function(ele) {
        var _class = ele.data('class');
        if (_class == 'necessary stimulation') {
            return 'triangle-cross';
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
        else if (_class == 'dissociation') {
            content = 'o';
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
      if (_class === 'association') {
        return 20;
      }

      if (_class === 'and' || _class === 'or' || _class === 'not') {
        return this.getDynamicLabelTextSize(ele, 1);
      }

      if (_class.endsWith('process')) {
        return this.getDynamicLabelTextSize(ele, 1.5);
      }
      
      if ( _class === 'dissociation' ) {
        return this.getDynamicLabelTextSize(ele, 2);
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
    /*
    * Get source/target end point of edge in 'x-value% y-value%' format. It returns 'outside-to-node' if there is no source/target port.
    */
    getEndPoint: function(edge, sourceOrTarget) {
      var portId = sourceOrTarget === 'source' ? edge.data('portsource') : edge.data('porttarget');

      if (portId == null) {
        return 'outside-to-node'; // If there is no portsource return the default value which is 'outside-to-node'
      }

      var endNode = sourceOrTarget === 'source' ? edge.source() : edge.target();
      var ports = endNode.data('ports');
      var port;
      for (var i = 0; i < ports.length; i++) {
        if (ports[i].id === portId) {
          port = ports[i];
        }
      }

      if (port === undefined) {
        return 'outside-to-node'; // If port is not found return the default value which is 'outside-to-node'
      }
      
      var x, y;
      // Note that for drawing ports we represent the whole shape by a polygon and ports are always 50% away from the node center
      if (port.x != 0) {
        x = Math.sign(port.x) * 50;
        y = 0;
      }
      else {
        x = 0;
        y = Math.sign(port.y) * 50;
      }
      
      return '' + x + '% ' + y + '%';
    }
    
    // Section End
    // Stylesheet helpers
};

module.exports = elementUtilities;

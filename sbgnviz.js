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
    cy.ready(function () {
      registerUndoRedoActions();
      cytoscapeExtensionsAndContextMenu();
      bindCyEvents();
    });
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
    
    // TODO move these functions to sbgn-cy-instance.js once we are ready for it
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
  }
};


},{"../../src/utilities/sbgn-element-utilities":11,"./common-app-utilities":4,"./undo-redo-action-functions":5}],2:[function(_dereq_,module,exports){
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
},{"../../src/utilities/dialog-utilities":9,"../../src/utilities/json-to-sbgnml-converter":10,"../../src/utilities/sbgn-element-utilities":11,"../../src/utilities/sbgnml-to-json-converter":12,"./backbone-views":3,"./common-app-utilities":4}],3:[function(_dereq_,module,exports){
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
        cy.style().update();
      }
      //Refresh truncations if needed
      if (sbgnStyleRules['fit-labels-to-nodes'] != self.currentSBGNProperties.fitLabelsToNodes) {
        sbgnStyleRules['fit-labels-to-nodes'] = self.currentSBGNProperties.fitLabelsToNodes;
        cy.style().update();
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
},{"../../src/utilities/dialog-utilities":9,"../../src/utilities/sbgnml-to-json-converter":12,"./common-app-utilities":4}],4:[function(_dereq_,module,exports){
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
    cy.style().update();
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
},{"../../src/utilities/sbgn-element-utilities":11}],6:[function(_dereq_,module,exports){
(function(){
  var register = function(options) {
    var libs = options.libs;
    
    if (libs === undefined) {
      libs = {};
    }
    
    // The path of core library images when sbgnviz is required from npm and located 
    // in node_modules using default option is enough
    var imgPath = options.imgPath || 'node_modules/sbgnviz/src/img';
    
    // Get cy extension instances
    var cyPanzoom = libs['cytoscape-panzoom'];
    var cyQtip = libs['cytoscape-qtip']; 
    var cyCoseBilkent = libs['cytoscape-cose-bilkent'];
    var cyUndoRedo = libs['cytoscape-undo-redo'];
    var cyClipboard = libs['cytoscape-clipboard'];
    var cyContextMenus = libs['cytoscape-context-menus'];
    var cyExpandCollapse = libs['cytoscape-expand-collapse'];
    var cyEdgeBendEditing = libs['cytoscape-edge-bend-editing'];
    var cyViewUtilities = libs['cytoscape-view-utilities'];
    
    // Register cy extensions
    cyPanzoom( cytoscape, $ );
    cyQtip( cytoscape, $ );
    cyCoseBilkent( cytoscape );
    cyUndoRedo( cytoscape );
    cyClipboard( cytoscape );
    cyContextMenus( cytoscape, $ );
    cyExpandCollapse( cytoscape, $ );
    cyEdgeBendEditing( cytoscape, $ );
    cyViewUtilities( cytoscape, $ );
    
    var sbgnRenderer = _dereq_('./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer');
    var sbgnCyInstance = _dereq_('./sbgn-extensions/sbgn-cy-instance');
    var appCy = _dereq_('../sample-app/js/app-cy');
    var appMenu = _dereq_('../sample-app/js/app-menu');
    
    sbgnRenderer();
    sbgnCyInstance(options.networkContainerSelector, imgPath);
    appCy();
    appMenu();
    
  };
  
  module.exports = register;
})();
},{"../sample-app/js/app-cy":1,"../sample-app/js/app-menu":2,"./sbgn-extensions/cytoscape.renderer.canvas.sbgn-renderer":7,"./sbgn-extensions/sbgn-cy-instance":8}],7:[function(_dereq_,module,exports){
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

},{"../utilities/text-utilities":13}],8:[function(_dereq_,module,exports){
var sbgnElementUtilities = _dereq_('../utilities/sbgn-element-utilities');

module.exports = function (containerSelector, imgPath) {
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
        bindCyEvents();
      }
    });
  });

  var sbgnStyleSheet = cytoscape.stylesheet()
          .selector("node")
          .css({
            'content': function (ele) {
              return sbgnElementUtilities.getElementContent(ele);
            },
            'font-size': function (ele) {
              return sbgnElementUtilities.getLabelTextSize(ele);
            },
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1.5,
            'border-color': '#555',
            'background-color': '#f6f6f6',
            'background-opacity': 0.5,
            'text-opacity': 1,
            'opacity': 1
          })
          .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
          .css({
            'background-image': imgPath + '/clone_bg.png',
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
          .selector("node[sbgnclass='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[sbgnclass='association']")
          .css({
            'background-color': '#6B6B6B'
          })
          .selector("node[sbgnclass='complex']")
          .css({
            'background-color': '#F4F3EE',
            'text-valign': 'bottom',
            'text-halign': 'center'
          })
          .selector("node[sbgnclass='compartment']")
          .css({
            'border-width': 3.75,
            'background-opacity': 0,
            'background-color': '#FFFFFF',
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
            'width': 1.5,
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
          .selector("core")
          .css({
            'selection-box-color': '#d67614',
            'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
          });

  function bindCyEvents() {
    cy.on('tapend', 'node', function (event) {
      cy.style().update();
    });
  }
};
},{"../utilities/sbgn-element-utilities":11}],9:[function(_dereq_,module,exports){
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



},{}],10:[function(_dereq_,module,exports){
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

},{}],11:[function(_dereq_,module,exports){
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

},{"../../sample-app/js/common-app-utilities":4,"./text-utilities":13}],12:[function(_dereq_,module,exports){
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
},{"./sbgn-element-utilities":11}],13:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzYW1wbGUtYXBwL2pzL2FwcC1jeS5qcyIsInNhbXBsZS1hcHAvanMvYXBwLW1lbnUuanMiLCJzYW1wbGUtYXBwL2pzL2JhY2tib25lLXZpZXdzLmpzIiwic2FtcGxlLWFwcC9qcy9jb21tb24tYXBwLXV0aWxpdGllcy5qcyIsInNhbXBsZS1hcHAvanMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL2N5dG9zY2FwZS5yZW5kZXJlci5jYW52YXMuc2Jnbi1yZW5kZXJlci5qcyIsInNyYy9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZS5qcyIsInNyYy91dGlsaXRpZXMvZGlhbG9nLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9zYmduLWVsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGNvbW1vbkFwcFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vY29tbW9uLWFwcC11dGlsaXRpZXMnKTtcclxuICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbiAgdmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9zYmduLWVsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4gIHZhciBnZXRFeHBhbmRDb2xsYXBzZU9wdGlvbnMgPSBjb21tb25BcHBVdGlsaXRpZXMuZ2V0RXhwYW5kQ29sbGFwc2VPcHRpb25zLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcclxuICB2YXIgZ2V0SW5mb0xhYmVsID0gY29tbW9uQXBwVXRpbGl0aWVzLmdldEluZm9MYWJlbC5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIG5vZGVRdGlwRnVuY3Rpb24gPSBjb21tb25BcHBVdGlsaXRpZXMubm9kZVF0aXBGdW5jdGlvbi5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMgPSBjb21tb25BcHBVdGlsaXRpZXMucmVmcmVzaFVuZG9SZWRvQnV0dG9uc1N0YXR1cy5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHJlZnJlc2hQYWRkaW5ncyA9IGNvbW1vbkFwcFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBzYmduU3R5bGVSdWxlcyA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduU3R5bGVSdWxlcztcclxuXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcclxuICB7XHJcbiAgICBjb21tb25BcHBVdGlsaXRpZXMuc2Jnbk5ldHdvcmtDb250YWluZXIgPSAkKCcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicpO1xyXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcclxuICAgIGN5LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKTtcclxuICAgICAgY3l0b3NjYXBlRXh0ZW5zaW9uc0FuZENvbnRleHRNZW51KCk7XHJcbiAgICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbi8vIGVuZCBvZiBzYmduU3R5bGVTaGVldFxyXG5cclxuLy8gTm90ZSB0aGF0IGluIENoaVNFIHRoaXMgZnVuY3Rpb24gaXMgaW4gYSBzZXBlcmF0ZSBmaWxlIGJ1dCBpbiB0aGUgdmlld2VyIGl0IGhhcyBqdXN0IDIgbWV0aG9kcyBhbmQgc28gaXQgaXMgbG9jYXRlZCBpbiB0aGlzIGZpbGVcclxuICBmdW5jdGlvbiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpIHtcclxuICAgIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKHt9KTtcclxuXHJcbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjeXRvc2NhcGVFeHRlbnNpb25zQW5kQ29udGV4dE1lbnUoKSB7XHJcbiAgICBjeS5leHBhbmRDb2xsYXBzZShnZXRFeHBhbmRDb2xsYXBzZU9wdGlvbnMoKSk7XHJcblxyXG4gICAgdmFyIGNvbnRleHRNZW51cyA9IGN5LmNvbnRleHRNZW51cyh7XHJcbiAgICAgIG1lbnVJdGVtQ2xhc3NlczogWydjdXN0b21pemVkLWNvbnRleHQtbWVudXMtbWVudS1pdGVtJ11cclxuICAgIH0pO1xyXG5cclxuICAgIGN5LmVkZ2VCZW5kRWRpdGluZyh7XHJcbiAgICAgIC8vIHRoaXMgZnVuY3Rpb24gc3BlY2lmaWVzIHRoZSBwb3NpdGlvbnMgb2YgYmVuZCBwb2ludHNcclxuICAgICAgYmVuZFBvc2l0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiZW5kUG9pbnRQb3NpdGlvbnMnKTtcclxuICAgICAgfSxcclxuICAgICAgLy8gd2hldGhlciB0aGUgYmVuZCBlZGl0aW5nIG9wZXJhdGlvbnMgYXJlIHVuZG9hYmxlIChyZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvLmpzKVxyXG4gICAgICB1bmRvYWJsZTogdHJ1ZSxcclxuICAgICAgLy8gdGl0bGUgb2YgcmVtb3ZlIGJlbmQgcG9pbnQgbWVudSBpdGVtXHJcbiAgICAgIHJlbW92ZUJlbmRNZW51SXRlbVRpdGxlOiBcIkRlbGV0ZSBCZW5kIFBvaW50XCIsXHJcbiAgICAgIC8vIHdoZXRoZXIgdG8gaW5pdGlsaXplIGJlbmQgcG9pbnRzIG9uIGNyZWF0aW9uIG9mIHRoaXMgZXh0ZW5zaW9uIGF1dG9tYXRpY2FsbHlcclxuICAgICAgaW5pdEJlbmRQb2ludHNBdXRvbWF0aWNhbGx5OiBmYWxzZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGV4dE1lbnVzLmFwcGVuZE1lbnVJdGVtcyhbXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LXNiZ24tcHJvcGVydGllcycsXHJcbiAgICAgICAgdGl0bGU6ICdQcm9wZXJ0aWVzLi4uJyxcclxuICAgICAgICBjb3JlQXNXZWxsOiB0cnVlLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAkKFwiI3NiZ24tcHJvcGVydGllc1wiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1kZWxldGUnLFxyXG4gICAgICAgIHRpdGxlOiAnRGVsZXRlJyxcclxuICAgICAgICBzZWxlY3RvcjogJ25vZGUsIGVkZ2UnLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB7XHJcbiAgICAgICAgICAgIGVsZXM6IGV2ZW50LmN5VGFyZ2V0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LWRlbGV0ZS1zZWxlY3RlZCcsXHJcbiAgICAgICAgdGl0bGU6ICdEZWxldGUgU2VsZWN0ZWQnLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJChcIiNkZWxldGUtc2VsZWN0ZWQtc2ltcGxlXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb3JlQXNXZWxsOiB0cnVlIC8vIFdoZXRoZXIgY29yZSBpbnN0YW5jZSBoYXZlIHRoaXMgaXRlbSBvbiBjeHR0YXBcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGlkOiAnY3R4LW1lbnUtaGlkZS1zZWxlY3RlZCcsXHJcbiAgICAgICAgdGl0bGU6ICdIaWRlIFNlbGVjdGVkJyxcclxuICAgICAgICBvbkNsaWNrRnVuY3Rpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoXCIjaGlkZS1zZWxlY3RlZFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29yZUFzV2VsbDogdHJ1ZSAvLyBXaGV0aGVyIGNvcmUgaW5zdGFuY2UgaGF2ZSB0aGlzIGl0ZW0gb24gY3h0dGFwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ2N0eC1tZW51LXNob3ctYWxsJyxcclxuICAgICAgICB0aXRsZTogJ1Nob3cgQWxsJyxcclxuICAgICAgICBvbkNsaWNrRnVuY3Rpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoXCIjc2hvdy1hbGxcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcmVBc1dlbGw6IHRydWUgLy8gV2hldGhlciBjb3JlIGluc3RhbmNlIGhhdmUgdGhpcyBpdGVtIG9uIGN4dHRhcFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1leHBhbmQnLCAvLyBJRCBvZiBtZW51IGl0ZW1cclxuICAgICAgICB0aXRsZTogJ0V4cGFuZCcsIC8vIFRpdGxlIG9mIG1lbnUgaXRlbVxyXG4gICAgICAgIC8vIEZpbHRlcnMgdGhlIGVsZW1lbnRzIHRvIGhhdmUgdGhpcyBtZW51IGl0ZW0gb24gY3h0dGFwXHJcbiAgICAgICAgLy8gSWYgdGhlIHNlbGVjdG9yIGlzIG5vdCB0cnV0aHkgbm8gZWxlbWVudHMgd2lsbCBoYXZlIHRoaXMgbWVudSBpdGVtIG9uIGN4dHRhcFxyXG4gICAgICAgIHNlbGVjdG9yOiAnbm9kZVtleHBhbmRlZC1jb2xsYXBzZWQ9XCJjb2xsYXBzZWRcIl0nLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7IC8vIFRoZSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbiBjbGlja1xyXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFwiLCB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBldmVudC5jeVRhcmdldFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1jb2xsYXBzZScsXHJcbiAgICAgICAgdGl0bGU6ICdDb2xsYXBzZScsXHJcbiAgICAgICAgc2VsZWN0b3I6ICdub2RlW2V4cGFuZGVkLWNvbGxhcHNlZCE9XCJjb2xsYXBzZWRcIl1bc2JnbmNsYXNzPVwiY29tcGxleFwiXSxbZXhwYW5kZWQtY29sbGFwc2VkIT1cImNvbGxhcHNlZFwiXVtzYmduY2xhc3M9XCJjb21wYXJ0bWVudFwiXScsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBldmVudC5jeVRhcmdldFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdjdHgtbWVudS1wZXJmb3JtLWxheW91dCcsXHJcbiAgICAgICAgdGl0bGU6ICdQZXJmb3JtIExheW91dCcsXHJcbiAgICAgICAgb25DbGlja0Z1bmN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKFwiI3BlcmZvcm0tbGF5b3V0XCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb3JlQXNXZWxsOiB0cnVlIC8vIFdoZXRoZXIgY29yZSBpbnN0YW5jZSBoYXZlIHRoaXMgaXRlbSBvbiBjeHR0YXBcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGlkOiAnY3R4LW1lbnUtYmlvZ2VuZS1wcm9wZXJ0aWVzJyxcclxuICAgICAgICB0aXRsZTogJ0Jpb0dlbmUgUHJvcGVydGllcycsXHJcbiAgICAgICAgc2VsZWN0b3I6ICdub2RlW3NiZ25jbGFzcz1cIm1hY3JvbW9sZWN1bGVcIl0sW3NiZ25jbGFzcz1cIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLFtzYmduY2xhc3M9XCJ1bnNwZWNpZmllZCBlbnRpdHlcIl0nLFxyXG4gICAgICAgIG9uQ2xpY2tGdW5jdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICBiaW9HZW5lUXRpcChldmVudC5jeVRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdKTtcclxuXHJcbiAgICBjeS5jbGlwYm9hcmQoe1xyXG4gICAgICBjbGlwYm9hcmRTaXplOiA1LCAvLyBTaXplIG9mIGNsaXBib2FyZC4gMCBtZWFucyB1bmxpbWl0ZWQuIElmIHNpemUgaXMgZXhjZWVkZWQsIGZpcnN0IGFkZGVkIGl0ZW0gaW4gY2xpcGJvYXJkIHdpbGwgYmUgcmVtb3ZlZC5cclxuICAgICAgc2hvcnRjdXRzOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gV2hldGhlciBrZXlib2FyZCBzaG9ydGN1dHMgYXJlIGVuYWJsZWRcclxuICAgICAgICB1bmRvYWJsZTogdHJ1ZSAvLyBhbmQgaWYgdW5kb1JlZG8gZXh0ZW5zaW9uIGV4aXN0c1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS52aWV3VXRpbGl0aWVzKHtcclxuICAgICAgbm9kZToge1xyXG4gICAgICAgIGhpZ2hsaWdodGVkOiB7XHJcbiAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogJzEwcHgnXHJcbiAgICAgICAgfSwgLy8gc3R5bGVzIGZvciB3aGVuIG5vZGVzIGFyZSBoaWdobGlnaHRlZC5cclxuICAgICAgICB1bmhpZ2hsaWdodGVkOiB7Ly8gc3R5bGVzIGZvciB3aGVuIG5vZGVzIGFyZSB1bmhpZ2hsaWdodGVkLlxyXG4gICAgICAgICAgJ29wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdvcGFjaXR5Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBoaWRkZW46IHtcclxuICAgICAgICAgIFwiZGlzcGxheVwiOiBcIm5vbmVcIlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZWRnZToge1xyXG4gICAgICAgIGhpZ2hsaWdodGVkOiB7XHJcbiAgICAgICAgICAnd2lkdGgnOiAnMTBweCdcclxuICAgICAgICB9LCAvLyBzdHlsZXMgZm9yIHdoZW4gZWRnZXMgYXJlIGhpZ2hsaWdodGVkLlxyXG4gICAgICAgIHVuaGlnaGxpZ2h0ZWQ6IHsvLyBzdHlsZXMgZm9yIHdoZW4gZWRnZXMgYXJlIHVuaGlnaGxpZ2h0ZWQuXHJcbiAgICAgICAgICAnb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ29wYWNpdHknKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpZGRlbjoge1xyXG4gICAgICAgICAgXCJkaXNwbGF5XCI6IFwibm9uZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgcGFuUHJvcHMgPSAoe1xyXG4gICAgICBmaXRQYWRkaW5nOiAxMCxcclxuICAgICAgZml0U2VsZWN0b3I6ICc6dmlzaWJsZScsXHJcbiAgICAgIGFuaW1hdGVPbkZpdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzYmduU3R5bGVSdWxlc1snYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnXTtcclxuICAgICAgfSxcclxuICAgICAgYW5pbWF0ZU9uWm9vbTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzYmduU3R5bGVSdWxlc1snYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnXTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25OZXR3b3JrQ29udGFpbmVyLmN5dG9zY2FwZVBhbnpvb20ocGFuUHJvcHMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYmluZEN5RXZlbnRzKCkge1xyXG4gICAgY3kub24oXCJhZnRlckRvXCIsIGZ1bmN0aW9uIChhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJVbmRvXCIsIGZ1bmN0aW9uIChhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJSZWRvXCIsIGZ1bmN0aW9uIChhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKCdtb3VzZW92ZXInLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcblxyXG4gICAgICAkKFwiLnF0aXBcIikucmVtb3ZlKCk7XHJcblxyXG4gICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudC5zaGlmdEtleSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBub2RlLnF0aXBUaW1lT3V0RmNuID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZVF0aXBGdW5jdGlvbihub2RlKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbignbW91c2VvdXQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBpZiAodGhpcy5xdGlwVGltZU91dEZjbiAhPSBudWxsKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXRpcFRpbWVPdXRGY24pO1xyXG4gICAgICAgIHRoaXMucXRpcFRpbWVPdXRGY24gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubW91c2VvdmVyID0gZmFsc2U7ICAgICAgICAgICAvL21ha2UgcHJlc2V0IGxheW91dCB0byByZWRyYXcgdGhlIG5vZGVzXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbigndGFwJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICQoJ2lucHV0JykuYmx1cigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oJ3RhcCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuXHJcbiAgICAgICQoXCIucXRpcFwiKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChub2RlLnF0aXBUaW1lT3V0RmNuICE9IG51bGwpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQobm9kZS5xdGlwVGltZU91dEZjbik7XHJcbiAgICAgICAgbm9kZS5xdGlwVGltZU91dEZjbiA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5vZGVRdGlwRnVuY3Rpb24obm9kZSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy8gVE9ETyBtb3ZlIHRoZXNlIGZ1bmN0aW9ucyB0byBzYmduLWN5LWluc3RhbmNlLmpzIG9uY2Ugd2UgYXJlIHJlYWR5IGZvciBpdFxyXG4gICAgY3kub24oXCJiZWZvcmVDb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgLy9UaGUgY2hpbGRyZW4gaW5mbyBvZiBjb21wbGV4IG5vZGVzIHNob3VsZCBiZSBzaG93biB3aGVuIHRoZXkgYXJlIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIC8vVGhlIG5vZGUgaXMgYmVpbmcgY29sbGFwc2VkIHN0b3JlIGluZm9sYWJlbCB0byB1c2UgaXQgbGF0ZXJcclxuICAgICAgICB2YXIgaW5mb0xhYmVsID0gZ2V0SW5mb0xhYmVsKG5vZGUpO1xyXG4gICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWwgPSBpbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XHJcbiAgICAgIC8vIHJlbW92ZSBiZW5kIHBvaW50cyBiZWZvcmUgY29sbGFwc2VcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XHJcbiAgICAgICAgaWYgKGVkZ2UuaGFzQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykpIHtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgICAgICAgICBkZWxldGUgZWRnZS5fcHJpdmF0ZS5jbGFzc2VzWydlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cyddO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xyXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJDb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgcmVmcmVzaFBhZGRpbmdzKCk7XHJcblxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIG5vZGUuYWRkQ2xhc3MoJ2NoYW5nZUNvbnRlbnQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJiZWZvcmVFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJFeHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcclxuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnY29udGVudCcpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbiIsIi8vIEhhbmRsZSBzYmdudml6IG1lbnUgZnVuY3Rpb25zIHdoaWNoIGFyZSB0byBiZSB0cmlnZ2VyZWQgb24gZXZlbnRzXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBCYWNrYm9uZVZpZXdzID0gcmVxdWlyZSgnLi9iYWNrYm9uZS12aWV3cycpO1xyXG4gIHZhciBjb21tb25BcHBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2NvbW1vbi1hcHAtdXRpbGl0aWVzJyk7XHJcbiAgdmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbiAgdmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XHJcbiAgdmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9zYmduLWVsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbiAgdmFyIGRpYWxvZ1V0aWxpdGllcyA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvZGlhbG9nLXV0aWxpdGllcycpO1xyXG4gIFxyXG4gIHZhciBzZXRGaWxlQ29udGVudCA9IGNvbW1vbkFwcFV0aWxpdGllcy5zZXRGaWxlQ29udGVudC5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XHJcbiAgdmFyIHN0YXJ0U3Bpbm5lciA9IGNvbW1vbkFwcFV0aWxpdGllcy5zdGFydFNwaW5uZXIuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBlbmRTcGlubmVyID0gY29tbW9uQXBwVXRpbGl0aWVzLmVuZFNwaW5uZXIuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBiZWZvcmVQZXJmb3JtTGF5b3V0ID0gY29tbW9uQXBwVXRpbGl0aWVzLmJlZm9yZVBlcmZvcm1MYXlvdXQuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBzYmdudml6VXBkYXRlID0gY29tbW9uQXBwVXRpbGl0aWVzLnNiZ252aXpVcGRhdGUuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBkeW5hbWljUmVzaXplID0gY29tbW9uQXBwVXRpbGl0aWVzLmR5bmFtaWNSZXNpemUuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xyXG4gIHZhciBzYmduU3R5bGVSdWxlcyA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduU3R5bGVSdWxlcztcclxuICBcclxuICB2YXIgc2JnbkxheW91dFByb3AsIHNiZ25Qcm9wZXJ0aWVzLCBwYXRoc0JldHdlZW5RdWVyeTtcclxuXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcclxuICB7XHJcbiAgICBjb25zb2xlLmxvZygnaW5pdCB0aGUgc2JnbnZpeiB0ZW1wbGF0ZS9wYWdlJyk7XHJcblxyXG4gICAgc2JnbkxheW91dFByb3AgPSBjb21tb25BcHBVdGlsaXRpZXMuc2JnbkxheW91dFByb3AgPSBuZXcgQmFja2JvbmVWaWV3cy5TQkdOTGF5b3V0KHtlbDogJyNzYmduLWxheW91dC10YWJsZSd9KTtcclxuICAgIHNiZ25Qcm9wZXJ0aWVzID0gY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25Qcm9wZXJ0aWVzID0gbmV3IEJhY2tib25lVmlld3MuU0JHTlByb3BlcnRpZXMoe2VsOiAnI3NiZ24tcHJvcGVydGllcy10YWJsZSd9KTtcclxuICAgIHBhdGhzQmV0d2VlblF1ZXJ5ID0gY29tbW9uQXBwVXRpbGl0aWVzLnBhdGhzQmV0d2VlblF1ZXJ5ID0gbmV3IEJhY2tib25lVmlld3MuUGF0aHNCZXR3ZWVuUXVlcnkoe2VsOiAnI3F1ZXJ5LXBhdGhzYmV0d2Vlbi10YWJsZSd9KTtcclxuXHJcbiAgICB0b29sYmFyQnV0dG9uc0FuZE1lbnUoKTtcclxuXHJcbiAgICBsb2FkU2FtcGxlKCduZXVyb25hbF9tdXNjbGVfc2lnbmFsbGluZy54bWwnKTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGR5bmFtaWNSZXNpemUpO1xyXG4gICAgZHluYW1pY1Jlc2l6ZSgpO1xyXG5cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gZXhwYW5kU2VsZWN0ZWQoKSB7XHJcbiAgICB2YXIgbm9kZXMgPSBjeS5ub2RlcyhcIjpzZWxlY3RlZFwiKS5maWx0ZXIoXCJbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKTtcclxuICAgIGlmIChub2Rlcy5leHBhbmRhYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoaWRlU2VsZWN0ZWQoKSB7XHJcbiAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuJChcIjpzZWxlY3RlZFwiKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIHNlbGVjdGVkRWxlcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93U2VsZWN0ZWQoKSB7XHJcbiAgICBpZiAoY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIikubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIikpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VTZWxlY3RlZCgpIHtcclxuICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgaWYgKG5vZGVzLmNvbGxhcHNpYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdG9vbGJhckJ1dHRvbnNBbmRNZW51KCkge1xyXG5cclxuICAgICQoXCIjbG9hZC1maWxlLCAjbG9hZC1maWxlLWljb25cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKFwiI2ZpbGUtaW5wdXRcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZmlsZS1pbnB1dFwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPSBcIlwiKSB7XHJcbiAgICAgICAgdmFyIGZpbGUgPSB0aGlzLmZpbGVzWzBdO1xyXG4gICAgICAgIGxvYWRTQkdOTUxGaWxlKGZpbGUpO1xyXG4gICAgICAgICQodGhpcykudmFsKFwiXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI25vZGUtbGVnZW5kXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZGlhbG9nVXRpbGl0aWVzLm9wZW5GYW5jeWJveCgkKFwiI25vZGUtbGVnZW5kLXRlbXBsYXRlXCIpLCB7XHJcbiAgICAgICAgJ2F1dG9EaW1lbnNpb25zJzogZmFsc2UsXHJcbiAgICAgICAgJ3dpZHRoJzogNTA0LFxyXG4gICAgICAgICdoZWlnaHQnOiAzMjVcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2VkZ2UtbGVnZW5kXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZGlhbG9nVXRpbGl0aWVzLm9wZW5GYW5jeWJveCgkKFwiI2VkZ2UtbGVnZW5kLXRlbXBsYXRlXCIpLCB7XHJcbiAgICAgICAgJ2F1dG9EaW1lbnNpb25zJzogZmFsc2UsXHJcbiAgICAgICAgJ3dpZHRoJzogMzI1LFxyXG4gICAgICAgICdoZWlnaHQnOiAyODVcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3F1aWNrLWhlbHBcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkZhbmN5Ym94KCQoXCIjcXVpY2staGVscC10ZW1wbGF0ZVwiKSwge1xyXG4gICAgICAgICdhdXRvRGltZW5zaW9ucyc6IGZhbHNlLFxyXG4gICAgICAgICd3aWR0aCc6IDQyMCxcclxuICAgICAgICAnaGVpZ2h0JzogXCJhdXRvXCJcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2Fib3V0XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZGlhbG9nVXRpbGl0aWVzLm9wZW5GYW5jeWJveCgkKFwiI2Fib3V0LXRlbXBsYXRlXCIpLCB7XHJcbiAgICAgICAgJ2F1dG9EaW1lbnNpb25zJzogZmFsc2UsXHJcbiAgICAgICAgJ3dpZHRoJzogMzAwLFxyXG4gICAgICAgICdoZWlnaHQnOiAzMjBcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlMVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCduZXVyb25hbF9tdXNjbGVfc2lnbmFsbGluZy54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGUyXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ0NhTS1DYU1LX2RlcGVuZGVudF9zaWduYWxpbmdfdG9fdGhlX251Y2xldXMueG1sJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlM1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCdhY3RpdmF0ZWRfc3RhdDFhbHBoYV9pbmR1Y3Rpb25fb2ZfdGhlX2lyZjFfZ2VuZS54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU0XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ2dseWNvbHlzaXMueG1sJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlNVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCdtYXBrX2Nhc2NhZGUueG1sJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlNlwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCdwb2x5cV9wcm90ZWluc19pbnRlcmZlcmVuY2UueG1sJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlN1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCdpbnN1bGluLWxpa2VfZ3Jvd3RoX2ZhY3Rvcl9zaWduYWxpbmcueG1sJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2xvYWQtc2FtcGxlOFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsb2FkU2FtcGxlKCdhdG1fbWVkaWF0ZWRfcGhvc3Bob3J5bGF0aW9uX29mX3JlcGFpcl9wcm90ZWlucy54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbG9hZC1zYW1wbGU5XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGxvYWRTYW1wbGUoJ3ZpdGFtaW5zX2I2X2FjdGl2YXRpb25fdG9fcHlyaWRveGFsX3Bob3NwaGF0ZS54bWwnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjaGlkZS1zZWxlY3RlZCwgI2hpZGUtc2VsZWN0ZWQtaWNvblwiKS5jbGljayhoaWRlU2VsZWN0ZWQpO1xyXG5cclxuICAgICQoXCIjc2hvdy1zZWxlY3RlZCwgI3Nob3ctc2VsZWN0ZWQtaWNvblwiKS5jbGljayhzaG93U2VsZWN0ZWQpOyAvL1RPRE86IHJlbW92ZSB3ZWlyZCBmZWF0dXJlIChvciBmaXgpP1xyXG5cclxuICAgICQoXCIjc2hvdy1hbGxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgaWYgKGN5LmVsZW1lbnRzKCkubGVuZ3RoID09PSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2RlbGV0ZS1zZWxlY3RlZC1zbWFydCwgI2RlbGV0ZS1zZWxlY3RlZC1zbWFydC1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBzZWwgPSBjeS4kKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICBpZiAoc2VsLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVFbGVzU21hcnRcIiwge1xyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgICBlbGVzOiBzZWxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI25laWdoYm9ycy1vZi1zZWxlY3RlZCwgI2hpZ2hsaWdodC1uZWlnaGJvcnMtb2Ytc2VsZWN0ZWQtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0TmVpZ2hib3Vyc09mU2VsZWN0ZWQoKTtcclxuICAgICAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xyXG4gICAgICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xyXG4gICAgICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3NlYXJjaC1ieS1sYWJlbC1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciB0ZXh0ID0gJChcIiNzZWFyY2gtYnktbGFiZWwtdGV4dC1ib3hcIikudmFsKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgaWYgKHRleHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kubm9kZXMoKS51bnNlbGVjdCgpO1xyXG5cclxuICAgICAgdmFyIG5vZGVzVG9TZWxlY3QgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgICAgaWYgKGVsZS5kYXRhKFwic2JnbmxhYmVsXCIpICYmIGVsZS5kYXRhKFwic2JnbmxhYmVsXCIpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChub2Rlc1RvU2VsZWN0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG5vZGVzVG9TZWxlY3Quc2VsZWN0KCk7XHJcblxyXG4gICAgICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IHNiZ25FbGVtZW50VXRpbGl0aWVzLmdldFByb2Nlc3Nlc09mU2VsZWN0ZWQoKTtcclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2VhcmNoLWJ5LWxhYmVsLXRleHQtYm94XCIpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcclxuICAgICAgaWYgKGUud2hpY2ggPT09IDEzKSB7XHJcbiAgICAgICAgJChcIiNzZWFyY2gtYnktbGFiZWwtaWNvblwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2hpZ2hsaWdodC1zZWFyY2gtbWVudS1pdGVtXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICQoXCIjc2VhcmNoLWJ5LWxhYmVsLXRleHQtYm94XCIpLmZvY3VzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3Byb2Nlc3Nlcy1vZi1zZWxlY3RlZFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZCgpO1xyXG4gICAgICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XHJcbiAgICAgIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgICAgIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjcmVtb3ZlLWhpZ2hsaWdodHMsICNyZW1vdmUtaGlnaGxpZ2h0cy1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGlmIChzYmduRWxlbWVudFV0aWxpdGllcy5ub25lSXNOb3RIaWdobGlnaHRlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNsYXlvdXQtcHJvcGVydGllc1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBzYmduTGF5b3V0UHJvcC5yZW5kZXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbGF5b3V0LXByb3BlcnRpZXMtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAkKFwiI2xheW91dC1wcm9wZXJ0aWVzXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2RlbGV0ZS1zZWxlY3RlZC1zaW1wbGUsICNkZWxldGUtc2VsZWN0ZWQtc2ltcGxlLWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LiQoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgIGlmIChzZWxlY3RlZEVsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xyXG4gICAgICAgIGVsZXM6IHNlbGVjdGVkRWxlc1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2Jnbi1wcm9wZXJ0aWVzLCAjcHJvcGVydGllcy1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHNiZ25Qcm9wZXJ0aWVzLnJlbmRlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNxdWVyeS1wYXRoc2JldHdlZW5cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgcGF0aHNCZXR3ZWVuUXVlcnkucmVuZGVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2NvbGxhcHNlLXNlbGVjdGVkLCNjb2xsYXBzZS1zZWxlY3RlZC1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGNvbGxhcHNlU2VsZWN0ZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZXhwYW5kLXNlbGVjdGVkLCNleHBhbmQtc2VsZWN0ZWQtaWNvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBleHBhbmRTZWxlY3RlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNjb2xsYXBzZS1jb21wbGV4ZXNcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGNvbXBsZXhlcyA9IGN5Lm5vZGVzKFwiW3NiZ25jbGFzcz0nY29tcGxleCddXCIpO1xyXG4gICAgICBpZiAoY29tcGxleGVzLmNvbGxhcHNpYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgICAgbm9kZXM6IGNvbXBsZXhlc1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJChcIiNleHBhbmQtY29tcGxleGVzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmZpbHRlcihcIltzYmduY2xhc3M9J2NvbXBsZXgnXVtleHBhbmRlZC1jb2xsYXBzZWQ9J2NvbGxhcHNlZCddXCIpO1xyXG4gICAgICBpZiAobm9kZXMuZXhwYW5kYWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2NvbGxhcHNlLWFsbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcclxuICAgICAgaWYgKG5vZGVzLmNvbGxhcHNpYmxlTm9kZXMoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNleHBhbmQtYWxsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpLmZpbHRlcihcIltleHBhbmRlZC1jb2xsYXBzZWQ9J2NvbGxhcHNlZCddXCIpO1xyXG4gICAgICBpZiAobm9kZXMuZXhwYW5kYWJsZU5vZGVzKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3BlcmZvcm0tbGF5b3V0LWljb25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgJChcIiNwZXJmb3JtLWxheW91dFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNwZXJmb3JtLWxheW91dFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBzdGFydFNwaW5uZXIoXCJsYXlvdXQtc3Bpbm5lclwiKTtcclxuICAgICAgYmVmb3JlUGVyZm9ybUxheW91dCgpO1xyXG4gICAgICB2YXIgcHJlZmVyZW5jZXMgPSB7XHJcbiAgICAgICAgYW5pbWF0ZTogc2JnblN0eWxlUnVsZXNbJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJ10gPyAnZW5kJyA6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGlmIChzYmduTGF5b3V0UHJvcC5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5hbmltYXRlID09ICdkdXJpbmcnKSB7XHJcbiAgICAgICAgZGVsZXRlIHByZWZlcmVuY2VzLmFuaW1hdGU7XHJcbiAgICAgIH1cclxuICAgICAgc2JnbkxheW91dFByb3AuYXBwbHlMYXlvdXQocHJlZmVyZW5jZXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiN1bmRvLWxhc3QtYWN0aW9uLCAjdW5kby1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkudW5kbygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNyZWRvLWxhc3QtYWN0aW9uLCAjcmVkby1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkucmVkbygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNzYXZlLWFzLXBuZ1wiKS5jbGljayhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHZhciBwbmdDb250ZW50ID0gY3kucG5nKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xyXG5cclxuICAgICAgLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTYyNDU3NjcvY3JlYXRpbmctYS1ibG9iLWZyb20tYS1iYXNlNjQtc3RyaW5nLWluLWphdmFzY3JpcHRcclxuICAgICAgZnVuY3Rpb24gYjY0dG9CbG9iKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpIHtcclxuICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICcnO1xyXG4gICAgICAgIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XHJcblxyXG4gICAgICAgIHZhciBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYjY0RGF0YSk7XHJcbiAgICAgICAgdmFyIGJ5dGVBcnJheXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoOyBvZmZzZXQgKz0gc2xpY2VTaXplKSB7XHJcbiAgICAgICAgICB2YXIgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XHJcblxyXG4gICAgICAgICAgdmFyIGJ5dGVOdW1iZXJzID0gbmV3IEFycmF5KHNsaWNlLmxlbmd0aCk7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xyXG5cclxuICAgICAgICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihieXRlQXJyYXlzLCB7dHlwZTogY29udGVudFR5cGV9KTtcclxuICAgICAgICByZXR1cm4gYmxvYjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcclxuICAgICAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XHJcbiAgICAgIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9wbmdcIiksIFwibmV0d29yay5wbmdcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3NhdmUtYXMtanBnXCIpLmNsaWNrKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5qcGcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gICAgICAvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxyXG4gICAgICBmdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG4gICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XHJcbiAgICAgICAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcclxuXHJcbiAgICAgICAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcclxuICAgICAgICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcclxuICAgICAgICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcclxuXHJcbiAgICAgICAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XHJcblxyXG4gICAgICAgICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gICAgICAgIHJldHVybiBibG9iO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxyXG4gICAgICB2YXIgYjY0ZGF0YSA9IHBuZ0NvbnRlbnQuc3Vic3RyKHBuZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICAgICAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL2pwZ1wiKSwgXCJuZXR3b3JrLmpwZ1wiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vVE9ETzogY291bGQgc2ltcGx5IGtlZXAvc3RvcmUgb3JpZ2luYWwgaW5wdXQgU0JHTi1NTCBkYXRhIGFuZCB1c2UgaXQgaGVyZSBpbnN0ZWFkIG9mIGNvbnZlcnRpbmcgZnJvbSBKU09OXHJcbiAgICAkKFwiI3NhdmUtYXMtc2Jnbm1sXCIpLmNsaWNrKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcblxyXG4gICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xyXG4gICAgICAgIHR5cGU6IFwidGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04O1wiLFxyXG4gICAgICB9KTtcclxuICAgICAgdmFyIGZpbGVuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbmFtZScpLmlubmVySFRNTDtcclxuICAgICAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2F2ZS1pY29uXCIpLmNsaWNrKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgJChcIiNzYXZlLWFzLXNiZ25tbFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29tbW9uQXBwVXRpbGl0aWVzLnNiZ25OZXR3b3JrQ29udGFpbmVyLm9uKFwiY2xpY2tcIiwgXCIuYmlvZ2VuZS1pbmZvIC5leHBhbmRhYmxlXCIsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyIGV4cGFuZGVyT3B0cyA9IHtzbGljZVBvaW50OiAxNTAsXHJcbiAgICAgICAgZXhwYW5kUHJlZml4OiAnICcsXHJcbiAgICAgICAgZXhwYW5kVGV4dDogJyAoLi4uKScsXHJcbiAgICAgICAgdXNlckNvbGxhcHNlVGV4dDogJyAoc2hvdyBsZXNzKScsXHJcbiAgICAgICAgbW9yZUNsYXNzOiAnZXhwYW5kZXItcmVhZC1tb3JlJyxcclxuICAgICAgICBsZXNzQ2xhc3M6ICdleHBhbmRlci1yZWFkLWxlc3MnLFxyXG4gICAgICAgIGRldGFpbENsYXNzOiAnZXhwYW5kZXItZGV0YWlscycsXHJcbiAgICAgICAgZXhwYW5kRWZmZWN0OiAnZmFkZUluJyxcclxuICAgICAgICBjb2xsYXBzZUVmZmVjdDogJ2ZhZGVPdXQnXHJcbiAgICAgIH07XHJcbiAgICAgICQoXCIuYmlvZ2VuZS1pbmZvIC5leHBhbmRhYmxlXCIpLmV4cGFuZGVyKGV4cGFuZGVyT3B0cyk7XHJcbiAgICAgIGV4cGFuZGVyT3B0cy5zbGljZVBvaW50ID0gMjtcclxuICAgICAgZXhwYW5kZXJPcHRzLndpZG93ID0gMDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0RmlsZUNvbnRlbnQoZmlsZU5hbWUpIHtcclxuICAgIHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbmFtZScpO1xyXG4gICAgd2hpbGUgKHNwYW4uZmlyc3RDaGlsZCkge1xyXG4gICAgICBzcGFuLnJlbW92ZUNoaWxkKHNwYW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBzcGFuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGVOYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsb2FkU2FtcGxlKGZpbGVuYW1lKSB7XHJcbiAgICBzdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XHJcbiAgICB2YXIgeG1sT2JqZWN0ID0gbG9hZFhNTERvYygnc2FtcGxlLWFwcC9zYW1wbGVzLycgKyBmaWxlbmFtZSk7XHJcbiAgICBzZXRGaWxlQ29udGVudChmaWxlbmFtZS5yZXBsYWNlKCd4bWwnLCAnc2Jnbm1sJykpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XHJcbiAgICAgIGVuZFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XHJcbiAgICB9LCAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvYWRTQkdOTUxGaWxlKGZpbGUpIHtcclxuICAgIHN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gICAgJChcIiNsb2FkLWZpbGUtc3Bpbm5lclwiKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xyXG5cclxuICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHRleHQpKSk7XHJcbiAgICAgICAgICBlbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuICAgICAgc2V0RmlsZUNvbnRlbnQoZmlsZS5uYW1lKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsb2FkWE1MRG9jKGZpbGVuYW1lKSB7XHJcbiAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XHJcbiAgICAgIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgeGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xyXG4gICAgfVxyXG4gICAgeGh0dHAub3BlbihcIkdFVFwiLCBmaWxlbmFtZSwgZmFsc2UpO1xyXG4gICAgeGh0dHAuc2VuZCgpO1xyXG4gICAgcmV0dXJuIHhodHRwLnJlc3BvbnNlWE1MO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdGV4dFRvWG1sT2JqZWN0KHRleHQpIHtcclxuICAgIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xyXG4gICAgICB2YXIgZG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxET00nKTtcclxuICAgICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcclxuICAgICAgZG9jLmxvYWRYTUwodGV4dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgICB2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC94bWwnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb2M7XHJcbiAgfVxyXG5cclxuLy9IYW5kbGUga2V5Ym9hcmQgZXZlbnRzXHJcbiAgJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUuY3RybEtleSAmJiBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XHJcbiAgICAgIGlmIChlLndoaWNoID09PSA5MCkgeyAvLyBjdHJsICsgelxyXG4gICAgICAgIGN5LnVuZG9SZWRvKCkudW5kbygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGUud2hpY2ggPT09IDg5KSB7IC8vIGN0cmwgKyB5XHJcbiAgICAgICAgY3kudW5kb1JlZG8oKS5yZWRvKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTsiLCJ2YXIgY29tbW9uQXBwVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9jb21tb24tYXBwLXV0aWxpdGllcycpO1xudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy91dGlsaXRpZXMvc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XG52YXIgZGlhbG9nVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9kaWFsb2ctdXRpbGl0aWVzJyk7XG5cbnZhciBzZXRGaWxlQ29udGVudCA9IGNvbW1vbkFwcFV0aWxpdGllcy5zZXRGaWxlQ29udGVudC5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XG52YXIgc3RhcnRTcGlubmVyID0gY29tbW9uQXBwVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lci5iaW5kKGNvbW1vbkFwcFV0aWxpdGllcyk7XG52YXIgZW5kU3Bpbm5lciA9IGNvbW1vbkFwcFV0aWxpdGllcy5lbmRTcGlubmVyLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcbnZhciBzYmdudml6VXBkYXRlID0gY29tbW9uQXBwVXRpbGl0aWVzLnNiZ252aXpVcGRhdGUuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xudmFyIGNhbGN1bGF0ZVBhZGRpbmdzID0gY29tbW9uQXBwVXRpbGl0aWVzLmNhbGN1bGF0ZVBhZGRpbmdzLmJpbmQoY29tbW9uQXBwVXRpbGl0aWVzKTtcbnZhciBzYmduU3R5bGVSdWxlcyA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduU3R5bGVSdWxlcztcbnZhciBkZWZhdWx0U2JnblN0eWxlUnVsZXMgPSBjb21tb25BcHBVdGlsaXRpZXMuZGVmYXVsdFNiZ25TdHlsZVJ1bGVzO1xudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGNvbW1vbkFwcFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChjb21tb25BcHBVdGlsaXRpZXMpO1xuXG4vKipcbiAqIEJhY2tib25lIHZpZXcgZm9yIHRoZSBCaW9HZW5lIGluZm9ybWF0aW9uLlxuICovXG52YXIgQmlvR2VuZVZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIC8qXG4gICAqIENvcHlyaWdodCAyMDEzIE1lbW9yaWFsLVNsb2FuIEtldHRlcmluZyBDYW5jZXIgQ2VudGVyLlxuICAgKlxuICAgKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQQ1Zpei5cbiAgICpcbiAgICogUENWaXogaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAgICpcbiAgICogUENWaXogaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAqIGFsb25nIHdpdGggUENWaXouIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAgICovXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gcGFzcyB2YXJpYWJsZXMgaW4gdXNpbmcgVW5kZXJzY29yZS5qcyB0ZW1wbGF0ZVxuICAgIHZhciB2YXJpYWJsZXMgPSB7XG4gICAgICBnZW5lRGVzY3JpcHRpb246IHRoaXMubW9kZWwuZ2VuZURlc2NyaXB0aW9uLFxuICAgICAgZ2VuZUFsaWFzZXM6IHRoaXMucGFyc2VEZWxpbWl0ZWRJbmZvKHRoaXMubW9kZWwuZ2VuZUFsaWFzZXMsIFwiOlwiLCBcIixcIiwgbnVsbCksXG4gICAgICBnZW5lRGVzaWduYXRpb25zOiB0aGlzLnBhcnNlRGVsaW1pdGVkSW5mbyh0aGlzLm1vZGVsLmdlbmVEZXNpZ25hdGlvbnMsIFwiOlwiLCBcIixcIiwgbnVsbCksXG4gICAgICBnZW5lTG9jYXRpb246IHRoaXMubW9kZWwuZ2VuZUxvY2F0aW9uLFxuICAgICAgZ2VuZU1pbTogdGhpcy5tb2RlbC5nZW5lTWltLFxuICAgICAgZ2VuZUlkOiB0aGlzLm1vZGVsLmdlbmVJZCxcbiAgICAgIGdlbmVVbmlwcm90SWQ6IHRoaXMuZXh0cmFjdEZpcnN0VW5pcHJvdElkKHRoaXMubW9kZWwuZ2VuZVVuaXByb3RNYXBwaW5nKSxcbiAgICAgIGdlbmVVbmlwcm90TGlua3M6IHRoaXMuZ2VuZXJhdGVVbmlwcm90TGlua3ModGhpcy5tb2RlbC5nZW5lVW5pcHJvdE1hcHBpbmcpLFxuICAgICAgZ2VuZVN1bW1hcnk6IHRoaXMubW9kZWwuZ2VuZVN1bW1hcnlcbiAgICB9O1xuXG4gICAgLy8gY29tcGlsZSB0aGUgdGVtcGxhdGUgdXNpbmcgdW5kZXJzY29yZVxuICAgIHZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJChcIiNiaW9nZW5lLXRlbXBsYXRlXCIpLmh0bWwoKSk7XG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSh2YXJpYWJsZXMpO1xuXG4gICAgLy8gbG9hZCB0aGUgY29tcGlsZWQgSFRNTCBpbnRvIHRoZSBCYWNrYm9uZSBcImVsXCJcbiAgICB0aGlzLiRlbC5odG1sKHRlbXBsYXRlKTtcblxuICAgIC8vIGZvcm1hdCBhZnRlciBsb2FkaW5nXG4gICAgdGhpcy5mb3JtYXQodGhpcy5tb2RlbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZm9ybWF0OiBmdW5jdGlvbiAoKVxuICB7XG4gICAgLy8gaGlkZSByb3dzIHdpdGggdW5kZWZpbmVkIGRhdGFcbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lRGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLWRlc2NyaXB0aW9uXCIpLmhpZGUoKTtcblxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVBbGlhc2VzID09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuYmlvZ2VuZS1hbGlhc2VzXCIpLmhpZGUoKTtcblxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVEZXNpZ25hdGlvbnMgPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLWRlc2lnbmF0aW9uc1wiKS5oaWRlKCk7XG5cbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lQ2hyb21vc29tZSA9PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtY2hyb21vc29tZVwiKS5oaWRlKCk7XG5cbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lTG9jYXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLWxvY2F0aW9uXCIpLmhpZGUoKTtcblxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVNaW0gPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLW1pbVwiKS5oaWRlKCk7XG5cbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lSWQgPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5iaW9nZW5lLWlkXCIpLmhpZGUoKTtcblxuICAgIGlmICh0aGlzLm1vZGVsLmdlbmVVbmlwcm90TWFwcGluZyA9PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLmJpb2dlbmUtdW5pcHJvdC1saW5rc1wiKS5oaWRlKCk7XG5cbiAgICBpZiAodGhpcy5tb2RlbC5nZW5lU3VtbWFyeSA9PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLm5vZGUtZGV0YWlscy1zdW1tYXJ5XCIpLmhpZGUoKTtcblxuICAgIHZhciBleHBhbmRlck9wdHMgPSB7c2xpY2VQb2ludDogMTUwLFxuICAgICAgZXhwYW5kUHJlZml4OiAnICcsXG4gICAgICBleHBhbmRUZXh0OiAnICguLi4pJyxcbiAgICAgIHVzZXJDb2xsYXBzZVRleHQ6ICcgKHNob3cgbGVzcyknLFxuICAgICAgbW9yZUNsYXNzOiAnZXhwYW5kZXItcmVhZC1tb3JlJyxcbiAgICAgIGxlc3NDbGFzczogJ2V4cGFuZGVyLXJlYWQtbGVzcycsXG4gICAgICBkZXRhaWxDbGFzczogJ2V4cGFuZGVyLWRldGFpbHMnLFxuICAgICAgLy8gZG8gbm90IHVzZSBkZWZhdWx0IGVmZmVjdHNcbiAgICAgIC8vIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2tzd2VkYmVyZy9qcXVlcnktZXhwYW5kZXIvaXNzdWVzLzQ2KVxuICAgICAgZXhwYW5kRWZmZWN0OiAnZmFkZUluJyxcbiAgICAgIGNvbGxhcHNlRWZmZWN0OiAnZmFkZU91dCd9O1xuXG4gICAgJChcIi5iaW9nZW5lLWluZm8gLmV4cGFuZGFibGVcIikuZXhwYW5kZXIoZXhwYW5kZXJPcHRzKTtcblxuICAgIGV4cGFuZGVyT3B0cy5zbGljZVBvaW50ID0gMjsgLy8gc2hvdyBjb21tYSBhbmQgdGhlIHNwYWNlXG4gICAgZXhwYW5kZXJPcHRzLndpZG93ID0gMDsgLy8gaGlkZSBldmVyeXRoaW5nIGVsc2UgaW4gYW55IGNhc2VcbiAgfSxcbiAgZ2VuZXJhdGVVbmlwcm90TGlua3M6IGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgdmFyIGZvcm1hdHRlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcmV0dXJuIF8udGVtcGxhdGUoJChcIiN1bmlwcm90LWxpbmstdGVtcGxhdGVcIikuaHRtbCgpLCB7aWQ6IGlkfSk7XG4gICAgfTtcblxuICAgIGlmIChtYXBwaW5nID09IHVuZGVmaW5lZCB8fCBtYXBwaW5nID09IG51bGwpXG4gICAge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGZpcnN0IGlkIChhc3N1bWluZyBpdCBpcyBhbHJlYWR5IHByb2Nlc3NlZClcbiAgICBpZiAobWFwcGluZy5pbmRleE9mKCc6JykgPCAwKVxuICAgIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgbWFwcGluZyA9IG1hcHBpbmcuc3Vic3RyaW5nKG1hcHBpbmcuaW5kZXhPZignOicpICsgMSk7XG4gICAgICByZXR1cm4gJywgJyArIHRoaXMucGFyc2VEZWxpbWl0ZWRJbmZvKG1hcHBpbmcsICc6JywgJywnLCBmb3JtYXR0ZXIpO1xuICAgIH1cbiAgfSxcbiAgZXh0cmFjdEZpcnN0VW5pcHJvdElkOiBmdW5jdGlvbiAobWFwcGluZykge1xuICAgIGlmIChtYXBwaW5nID09IHVuZGVmaW5lZCB8fCBtYXBwaW5nID09IG51bGwpXG4gICAge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgdmFyIHBhcnRzID0gbWFwcGluZy5zcGxpdChcIjpcIik7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICByZXR1cm4gcGFydHNbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIHBhcnNlRGVsaW1pdGVkSW5mbzogZnVuY3Rpb24gKGluZm8sIGRlbGltaXRlciwgc2VwYXJhdG9yLCBmb3JtYXR0ZXIpIHtcbiAgICAvLyBkbyBub3QgcHJvY2VzcyB1bmRlZmluZWQgb3IgbnVsbCB2YWx1ZXNcbiAgICBpZiAoaW5mbyA9PSB1bmRlZmluZWQgfHwgaW5mbyA9PSBudWxsKVxuICAgIHtcbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIHZhciB0ZXh0ID0gXCJcIjtcbiAgICB2YXIgcGFydHMgPSBpbmZvLnNwbGl0KGRlbGltaXRlcik7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICBpZiAoZm9ybWF0dGVyKVxuICAgICAge1xuICAgICAgICB0ZXh0ID0gZm9ybWF0dGVyKHBhcnRzWzBdKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgdGV4dCA9IHBhcnRzWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgdGV4dCArPSBzZXBhcmF0b3IgKyBcIiBcIjtcblxuICAgICAgaWYgKGZvcm1hdHRlcilcbiAgICAgIHtcbiAgICAgICAgdGV4dCArPSBmb3JtYXR0ZXIocGFydHNbaV0pO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICB0ZXh0ICs9IHBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0ZXh0O1xuICB9XG59KTtcblxuLyoqXG4gKiBTQkdOIExheW91dCB2aWV3IGZvciB0aGUgU2FtcGxlIEFwcGxpY2F0aW9uLlxuICovXG52YXIgU0JHTkxheW91dCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgZGVmYXVsdExheW91dFByb3BlcnRpZXM6IHtcbiAgICBuYW1lOiAnY29zZS1iaWxrZW50JyxcbiAgICBub2RlUmVwdWxzaW9uOiA0NTAwLFxuICAgIGlkZWFsRWRnZUxlbmd0aDogNTAsXG4gICAgZWRnZUVsYXN0aWNpdHk6IDAuNDUsXG4gICAgbmVzdGluZ0ZhY3RvcjogMC4xLFxuICAgIGdyYXZpdHk6IDAuMjUsXG4gICAgbnVtSXRlcjogMjUwMCxcbiAgICB0aWxlOiB0cnVlLFxuICAgIGFuaW1hdGlvbkVhc2luZzogJ2N1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKScsXG4gICAgYW5pbWF0ZTogJ2VuZCcsXG4gICAgYW5pbWF0aW9uRHVyYXRpb246IDEwMDAsXG4gICAgcmFuZG9taXplOiB0cnVlLFxuICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNhbGN1bGF0ZVBhZGRpbmdzKHBhcnNlSW50KHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddLCAxMCkpO1xuICAgIH0sXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjYWxjdWxhdGVQYWRkaW5ncyhwYXJzZUludChzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddLCAxMCkpO1xuICAgIH0sXG4gICAgZ3Jhdml0eVJhbmdlQ29tcG91bmQ6IDEuNSxcbiAgICBncmF2aXR5Q29tcG91bmQ6IDEuMCxcbiAgICBncmF2aXR5UmFuZ2U6IDMuOCxcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICBlbmRTcGlubmVyKCdsYXlvdXQtc3Bpbm5lcicpO1xuICAgIH1cbiAgfSxcbiAgY3VycmVudExheW91dFByb3BlcnRpZXM6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xuXG4gICAgdmFyIHRlbXBsYXRlUHJvcGVydGllcyA9IF8uY2xvbmUoc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcyk7XG4gICAgdGVtcGxhdGVQcm9wZXJ0aWVzLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy12ZXJ0aWNhbCddO1xuICAgIHRlbXBsYXRlUHJvcGVydGllcy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9IHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsJ107XG5cbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI2xheW91dC1zZXR0aW5ncy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuICAgIHNlbGYudGVtcGxhdGUgPSBzZWxmLnRlbXBsYXRlKHRlbXBsYXRlUHJvcGVydGllcyk7XG4gIH0sXG4gIGNvcHlQcm9wZXJ0aWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jdXJyZW50TGF5b3V0UHJvcGVydGllcyA9IF8uY2xvbmUodGhpcy5kZWZhdWx0TGF5b3V0UHJvcGVydGllcyk7XG4gIH0sXG4gIGFwcGx5TGF5b3V0OiBmdW5jdGlvbiAocHJlZmVyZW5jZXMsIHVuZG9hYmxlKSB7XG4gICAgaWYgKHByZWZlcmVuY2VzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHByZWZlcmVuY2VzID0ge307XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuY3VycmVudExheW91dFByb3BlcnRpZXMsIHByZWZlcmVuY2VzKTtcbiAgICBpZiAodW5kb2FibGUgPT09IGZhbHNlKSB7XG4gICAgICBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQob3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIGVsZXM6IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciB0ZW1wbGF0ZVByb3BlcnRpZXMgPSBfLmNsb25lKHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMpO1xuICAgIHRlbXBsYXRlUHJvcGVydGllcy50aWxpbmdQYWRkaW5nVmVydGljYWwgPSBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctdmVydGljYWwnXTtcbiAgICB0ZW1wbGF0ZVByb3BlcnRpZXMudGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddO1xuXG4gICAgc2VsZi50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJChcIiNsYXlvdXQtc2V0dGluZ3MtdGVtcGxhdGVcIikuaHRtbCgpKTtcbiAgICBzZWxmLnRlbXBsYXRlID0gc2VsZi50ZW1wbGF0ZSh0ZW1wbGF0ZVByb3BlcnRpZXMpO1xuICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcblxuICAgIGRpYWxvZ1V0aWxpdGllcy5vcGVuRGlhbG9nKHNlbGYuZWwpO1xuXG4gICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgXCIjc2F2ZS1sYXlvdXRcIikub24oXCJjbGlja1wiLCBcIiNzYXZlLWxheW91dFwiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLm5vZGVSZXB1bHNpb24gPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub2RlLXJlcHVsc2lvblwiKS52YWx1ZSk7XG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmlkZWFsRWRnZUxlbmd0aCA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkZWFsLWVkZ2UtbGVuZ3RoXCIpLnZhbHVlKTtcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuZWRnZUVsYXN0aWNpdHkgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGdlLWVsYXN0aWNpdHlcIikudmFsdWUpO1xuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5uZXN0aW5nRmFjdG9yID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmVzdGluZy1mYWN0b3JcIikudmFsdWUpO1xuICAgICAgc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcy5ncmF2aXR5ID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eVwiKS52YWx1ZSk7XG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLm51bUl0ZXIgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJudW0taXRlclwiKS52YWx1ZSk7XG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLnRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbGVcIikuY2hlY2tlZDtcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuYW5pbWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0ZVwiKS5jaGVja2VkID8gJ2R1cmluZycgOiAnZW5kJztcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMucmFuZG9taXplID0gIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5jcmVtZW50YWxcIikuY2hlY2tlZDtcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuZ3Jhdml0eVJhbmdlQ29tcG91bmQgPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmF2aXR5LXJhbmdlLWNvbXBvdW5kXCIpLnZhbHVlKTtcbiAgICAgIHNlbGYuY3VycmVudExheW91dFByb3BlcnRpZXMuZ3Jhdml0eUNvbXBvdW5kID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jhdml0eS1jb21wb3VuZFwiKS52YWx1ZSk7XG4gICAgICBzZWxmLmN1cnJlbnRMYXlvdXRQcm9wZXJ0aWVzLmdyYXZpdHlSYW5nZSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXZpdHktcmFuZ2VcIikudmFsdWUpO1xuXG4gICAgICBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctdmVydGljYWwnXSA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbGluZy1wYWRkaW5nLXZlcnRpY2FsXCIpLnZhbHVlKTtcbiAgICAgIHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsJ10gPSBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsXCIpLnZhbHVlKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9mZihcImNsaWNrXCIsIFwiI2RlZmF1bHQtbGF5b3V0XCIpLm9uKFwiY2xpY2tcIiwgXCIjZGVmYXVsdC1sYXlvdXRcIiwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xuXG4gICAgICBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctdmVydGljYWwnXSA9IGRlZmF1bHRTYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctdmVydGljYWwnXTtcbiAgICAgIHNiZ25TdHlsZVJ1bGVzWyd0aWxpbmctcGFkZGluZy1ob3Jpem9udGFsJ10gPSBkZWZhdWx0U2JnblN0eWxlUnVsZXNbJ3RpbGluZy1wYWRkaW5nLWhvcml6b250YWwnXTtcblxuICAgICAgdmFyIHRlbXBsYXRlUHJvcGVydGllcyA9IF8uY2xvbmUoc2VsZi5jdXJyZW50TGF5b3V0UHJvcGVydGllcyk7XG4gICAgICB0ZW1wbGF0ZVByb3BlcnRpZXMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gc2JnblN0eWxlUnVsZXNbJ3RpbGluZy1wYWRkaW5nLXZlcnRpY2FsJ107XG4gICAgICB0ZW1wbGF0ZVByb3BlcnRpZXMudGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSBzYmduU3R5bGVSdWxlc1sndGlsaW5nLXBhZGRpbmctaG9yaXpvbnRhbCddO1xuXG4gICAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI2xheW91dC1zZXR0aW5ncy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuICAgICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUodGVtcGxhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuLyoqXG4gKiBTQkdOIFByb3BlcnRpZXMgdmlldyBmb3IgdGhlIFNhbXBsZSBBcHBsaWNhdGlvbi5cbiAqL1xudmFyIFNCR05Qcm9wZXJ0aWVzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBkZWZhdWx0U0JHTlByb3BlcnRpZXM6IHtcbiAgICBjb21wb3VuZFBhZGRpbmc6IHBhcnNlSW50KHNiZ25TdHlsZVJ1bGVzWydjb21wb3VuZC1wYWRkaW5nJ10sIDEwKSxcbiAgICBkeW5hbWljTGFiZWxTaXplOiBzYmduU3R5bGVSdWxlc1snZHluYW1pYy1sYWJlbC1zaXplJ10sXG4gICAgZml0TGFiZWxzVG9Ob2Rlczogc2JnblN0eWxlUnVsZXNbJ2ZpdC1sYWJlbHMtdG8tbm9kZXMnXSxcbiAgICByZWFycmFuZ2VBZnRlckV4cGFuZENvbGxhcHNlOiBzYmduU3R5bGVSdWxlc1sncmVhcnJhbmdlLWFmdGVyLWV4cGFuZC1jb2xsYXBzZSddLFxuICAgIGFuaW1hdGVPbkRyYXdpbmdDaGFuZ2VzOiBzYmduU3R5bGVSdWxlc1snYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnXVxuICB9LFxuICBjdXJyZW50U0JHTlByb3BlcnRpZXM6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xuICAgIHNlbGYudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoXCIjc2Jnbi1wcm9wZXJ0aWVzLXRlbXBsYXRlXCIpLmh0bWwoKSk7XG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUoc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMpO1xuICB9LFxuICBjb3B5UHJvcGVydGllczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY3VycmVudFNCR05Qcm9wZXJ0aWVzID0gXy5jbG9uZSh0aGlzLmRlZmF1bHRTQkdOUHJvcGVydGllcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI3NiZ24tcHJvcGVydGllcy10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuICAgIHNlbGYudGVtcGxhdGUgPSBzZWxmLnRlbXBsYXRlKHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzKTtcbiAgICAkKHNlbGYuZWwpLmh0bWwoc2VsZi50ZW1wbGF0ZSk7XG5cbiAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkRpYWxvZyhzZWxmLmVsKTtcblxuICAgICQoZG9jdW1lbnQpLm9mZihcImNsaWNrXCIsIFwiI3NhdmUtc2JnblwiKS5vbihcImNsaWNrXCIsIFwiI3NhdmUtc2JnblwiLCBmdW5jdGlvbiAoZXZ0KSB7XG5cbiAgICAgIHZhciBwYXJhbSA9IHt9O1xuICAgICAgcGFyYW0uZmlyc3RUaW1lID0gdHJ1ZTtcbiAgICAgIHBhcmFtLnByZXZpb3VzU0JHTlByb3BlcnRpZXMgPSBfLmNsb25lKHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzKTtcblxuICAgICAgc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuY29tcG91bmRQYWRkaW5nID0gTnVtYmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcG91bmQtcGFkZGluZ1wiKS52YWx1ZSk7XG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5keW5hbWljTGFiZWxTaXplID0gJCgnc2VsZWN0W25hbWU9XCJkeW5hbWljLWxhYmVsLXNpemVcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5maXRMYWJlbHNUb05vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaXQtbGFiZWxzLXRvLW5vZGVzXCIpLmNoZWNrZWQ7XG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5yZWFycmFuZ2VBZnRlckV4cGFuZENvbGxhcHNlID1cbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWFycmFuZ2UtYWZ0ZXItZXhwYW5kLWNvbGxhcHNlXCIpLmNoZWNrZWQ7XG4gICAgICBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5hbmltYXRlT25EcmF3aW5nQ2hhbmdlcyA9XG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXNcIikuY2hlY2tlZDtcblxuICAgICAgLy9SZWZyZXNoIHBhZGRpbmdzIGlmIG5lZWRlZFxuICAgICAgaWYgKHNiZ25TdHlsZVJ1bGVzWydjb21wb3VuZC1wYWRkaW5nJ10gIT0gc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuY29tcG91bmRQYWRkaW5nKSB7XG4gICAgICAgIHNiZ25TdHlsZVJ1bGVzWydjb21wb3VuZC1wYWRkaW5nJ10gPSBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5jb21wb3VuZFBhZGRpbmc7XG4gICAgICAgIHJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgICAgLy9SZWZyZXNoIGxhYmVsIHNpemUgaWYgbmVlZGVkXG4gICAgICBpZiAoc2JnblN0eWxlUnVsZXNbJ2R5bmFtaWMtbGFiZWwtc2l6ZSddICE9IHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLmR5bmFtaWNMYWJlbFNpemUpIHtcbiAgICAgICAgc2JnblN0eWxlUnVsZXNbJ2R5bmFtaWMtbGFiZWwtc2l6ZSddID0gJycgKyBzZWxmLmN1cnJlbnRTQkdOUHJvcGVydGllcy5keW5hbWljTGFiZWxTaXplO1xuICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgICAgLy9SZWZyZXNoIHRydW5jYXRpb25zIGlmIG5lZWRlZFxuICAgICAgaWYgKHNiZ25TdHlsZVJ1bGVzWydmaXQtbGFiZWxzLXRvLW5vZGVzJ10gIT0gc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuZml0TGFiZWxzVG9Ob2Rlcykge1xuICAgICAgICBzYmduU3R5bGVSdWxlc1snZml0LWxhYmVscy10by1ub2RlcyddID0gc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuZml0TGFiZWxzVG9Ob2RlcztcbiAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgc2JnblN0eWxlUnVsZXNbJ3JlYXJyYW5nZS1hZnRlci1leHBhbmQtY29sbGFwc2UnXSA9XG4gICAgICAgICAgICAgIHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzLnJlYXJyYW5nZUFmdGVyRXhwYW5kQ29sbGFwc2U7XG5cbiAgICAgIHNiZ25TdHlsZVJ1bGVzWydhbmltYXRlLW9uLWRyYXdpbmctY2hhbmdlcyddID1cbiAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U0JHTlByb3BlcnRpZXMuYW5pbWF0ZU9uRHJhd2luZ0NoYW5nZXM7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCBcIiNkZWZhdWx0LXNiZ25cIikub24oXCJjbGlja1wiLCBcIiNkZWZhdWx0LXNiZ25cIiwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xuICAgICAgc2VsZi50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJChcIiNzYmduLXByb3BlcnRpZXMtdGVtcGxhdGVcIikuaHRtbCgpKTtcbiAgICAgIHNlbGYudGVtcGxhdGUgPSBzZWxmLnRlbXBsYXRlKHNlbGYuY3VycmVudFNCR05Qcm9wZXJ0aWVzKTtcbiAgICAgICQoc2VsZi5lbCkuaHRtbChzZWxmLnRlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuLyoqXG4gKiBQYXRocyBCZXR3ZWVuIFF1ZXJ5IHZpZXcgZm9yIHRoZSBTYW1wbGUgQXBwbGljYXRpb24uXG4gKi9cbnZhciBQYXRoc0JldHdlZW5RdWVyeSA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgZGVmYXVsdFF1ZXJ5UGFyYW1ldGVyczoge1xuICAgIGdlbmVTeW1ib2xzOiBcIlwiLFxuICAgIGxlbmd0aExpbWl0OiAxXG4gIH0sXG4gIGN1cnJlbnRRdWVyeVBhcmFtZXRlcnM6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5jb3B5UHJvcGVydGllcygpO1xuICAgIHNlbGYudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoXCIjcXVlcnktcGF0aHNiZXR3ZWVuLXRlbXBsYXRlXCIpLmh0bWwoKSk7XG4gICAgc2VsZi50ZW1wbGF0ZSA9IHNlbGYudGVtcGxhdGUoc2VsZi5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzKTtcbiAgfSxcbiAgY29weVByb3BlcnRpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnMgPSBfLmNsb25lKHRoaXMuZGVmYXVsdFF1ZXJ5UGFyYW1ldGVycyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKFwiI3F1ZXJ5LXBhdGhzYmV0d2Vlbi10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuICAgIHNlbGYudGVtcGxhdGUgPSBzZWxmLnRlbXBsYXRlKHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycyk7XG4gICAgJChzZWxmLmVsKS5odG1sKHNlbGYudGVtcGxhdGUpO1xuXG4gICAgJChcIiNxdWVyeS1wYXRoc2JldHdlZW4tZW5hYmxlLXNob3J0ZXN0LWstYWx0ZXJhdGlvblwiKS5jaGFuZ2UoZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1ZXJ5LXBhdGhzYmV0d2Vlbi1lbmFibGUtc2hvcnRlc3Qtay1hbHRlcmF0aW9uXCIpLmNoZWNrZWQpIHtcbiAgICAgICAgJChcIiNxdWVyeS1wYXRoc2JldHdlZW4tc2hvcnRlc3Qta1wiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChcIiNxdWVyeS1wYXRoc2JldHdlZW4tc2hvcnRlc3Qta1wiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkaWFsb2dVdGlsaXRpZXMub3BlbkRpYWxvZyhzZWxmLmVsLCB7d2lkdGg6ICdhdXRvJ30pO1xuXG4gICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgXCIjc2F2ZS1xdWVyeS1wYXRoc2JldHdlZW5cIikub24oXCJjbGlja1wiLCBcIiNzYXZlLXF1ZXJ5LXBhdGhzYmV0d2VlblwiLCBmdW5jdGlvbiAoZXZ0KSB7XG5cbiAgICAgIHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5nZW5lU3ltYm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVlcnktcGF0aHNiZXR3ZWVuLWdlbmUtc3ltYm9sc1wiKS52YWx1ZTtcbiAgICAgIHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5sZW5ndGhMaW1pdCA9IE51bWJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1ZXJ5LXBhdGhzYmV0d2Vlbi1sZW5ndGgtbGltaXRcIikudmFsdWUpO1xuXG4gICAgICB2YXIgcXVlcnlVUkwgPSBcImh0dHA6Ly93d3cucGF0aHdheWNvbW1vbnMub3JnL3BjMi9ncmFwaD9mb3JtYXQ9U0JHTiZraW5kPVBBVEhTQkVUV0VFTiZsaW1pdD1cIlxuICAgICAgICAgICAgICArIHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5sZW5ndGhMaW1pdDtcbiAgICAgIHZhciBzb3VyY2VzID0gXCJcIjtcbiAgICAgIHZhciBmaWxlbmFtZSA9IFwiXCI7XG4gICAgICB2YXIgZ2VuZVN5bWJvbHNBcnJheSA9IHNlbGYuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5nZW5lU3ltYm9scy5yZXBsYWNlKFwiXFxuXCIsIFwiIFwiKS5yZXBsYWNlKFwiXFx0XCIsIFwiIFwiKS5zcGxpdChcIiBcIik7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdlbmVTeW1ib2xzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGN1cnJlbnRHZW5lU3ltYm9sID0gZ2VuZVN5bWJvbHNBcnJheVtpXTtcbiAgICAgICAgaWYgKGN1cnJlbnRHZW5lU3ltYm9sLmxlbmd0aCA9PSAwIHx8IGN1cnJlbnRHZW5lU3ltYm9sID09ICcgJ1xuICAgICAgICAgICAgICAgIHx8IGN1cnJlbnRHZW5lU3ltYm9sID09ICdcXG4nIHx8IGN1cnJlbnRHZW5lU3ltYm9sID09ICdcXHQnKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlcyA9IHNvdXJjZXMgKyBcIiZzb3VyY2U9XCIgKyBjdXJyZW50R2VuZVN5bWJvbDtcbiAgICAgICAgaWYgKGZpbGVuYW1lID09ICcnKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBjdXJyZW50R2VuZVN5bWJvbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lICsgJ18nICsgY3VycmVudEdlbmVTeW1ib2w7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUgKyAnX1BBVEhTQkVUV0VFTi5zYmdubWwnO1xuICAgICAgc2V0RmlsZUNvbnRlbnQoZmlsZW5hbWUpO1xuXG4gICAgICBzdGFydFNwaW5uZXIoJ3BhdGhzLWJldHdlZW4tc3Bpbm5lcicpO1xuXG4gICAgICBxdWVyeVVSTCA9IHF1ZXJ5VVJMICsgc291cmNlcztcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogcXVlcnlVUkwsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHNiZ252aXpVcGRhdGUoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoZGF0YSkpO1xuICAgICAgICAgIGVuZFNwaW5uZXIoJ3BhdGhzLWJldHdlZW4tc3Bpbm5lcicpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJChzZWxmLmVsKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCBcIiNjYW5jZWwtcXVlcnktcGF0aHNiZXR3ZWVuXCIpLm9uKFwiY2xpY2tcIiwgXCIjY2FuY2VsLXF1ZXJ5LXBhdGhzYmV0d2VlblwiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAkKHNlbGYuZWwpLmRpYWxvZygnY2xvc2UnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJpb0dlbmVWaWV3OiBCaW9HZW5lVmlldyxcbiAgU0JHTkxheW91dDogU0JHTkxheW91dCxcbiAgU0JHTlByb3BlcnRpZXM6IFNCR05Qcm9wZXJ0aWVzLFxuICBQYXRoc0JldHdlZW5RdWVyeTogUGF0aHNCZXR3ZWVuUXVlcnlcbn07IiwidmFyIGRlZmF1bHRTYmduU3R5bGVSdWxlcyA9IHtcclxuICAnY29tcG91bmQtcGFkZGluZyc6IDEwLFxyXG4gICdkeW5hbWljLWxhYmVsLXNpemUnOiAncmVndWxhcicsXHJcbiAgJ2ZpdC1sYWJlbHMtdG8tbm9kZXMnOiBmYWxzZSxcclxuICAncmVhcnJhbmdlLWFmdGVyLWV4cGFuZC1jb2xsYXBzZSc6IHRydWUsXHJcbiAgJ3RpbGluZy1wYWRkaW5nLXZlcnRpY2FsJzogMjAsXHJcbiAgJ3RpbGluZy1wYWRkaW5nLWhvcml6b250YWwnOiAyMCxcclxuICAnYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnOiB0cnVlXHJcbn07XHJcblxyXG52YXIgY29tbW9uQXBwVXRpbGl0aWVzID0gY29tbW9uQXBwVXRpbGl0aWVzIHx8IHtcclxuICBzYmduTmV0d29ya0NvbnRhaW5lcjogdW5kZWZpbmVkLFxyXG4gIHNiZ25MYXlvdXRQcm9wOiB1bmRlZmluZWQsXHJcbiAgc2JnblByb3BlcnRpZXM6IHVuZGVmaW5lZCxcclxuICBwYXRoc0JldHdlZW5RdWVyeTogdW5kZWZpbmVkLFxyXG4gIGRlZmF1bHRTYmduU3R5bGVSdWxlczogZGVmYXVsdFNiZ25TdHlsZVJ1bGVzLFxyXG4gIHNiZ25TdHlsZVJ1bGVzOiBfLmNsb25lKGRlZmF1bHRTYmduU3R5bGVSdWxlcyksXHJcbiAgc2V0RmlsZUNvbnRlbnQ6IGZ1bmN0aW9uIChmaWxlTmFtZSkge1xyXG4gICAgdmFyIHNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1uYW1lJyk7XHJcbiAgICB3aGlsZSAoc3Bhbi5maXJzdENoaWxkKSB7XHJcbiAgICAgIHNwYW4ucmVtb3ZlQ2hpbGQoc3Bhbi5maXJzdENoaWxkKTtcclxuICAgIH1cclxuICAgIHNwYW4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmlsZU5hbWUpKTtcclxuICB9LFxyXG4gIHRyaWdnZXJJbmNyZW1lbnRhbExheW91dDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5iZWZvcmVQZXJmb3JtTGF5b3V0KCk7XHJcbiAgICB2YXIgcHJlZmVyZW5jZXMgPSB7XHJcbiAgICAgIHJhbmRvbWl6ZTogZmFsc2UsXHJcbiAgICAgIGFuaW1hdGU6IHRoaXMuc2JnblN0eWxlUnVsZXNbJ2FuaW1hdGUtb24tZHJhd2luZy1jaGFuZ2VzJ10gPyAnZW5kJyA6IGZhbHNlLFxyXG4gICAgICBmaXQ6IGZhbHNlXHJcbiAgICB9O1xyXG4gICAgaWYgKHRoaXMuc2JnbkxheW91dFByb3AuY3VycmVudExheW91dFByb3BlcnRpZXMuYW5pbWF0ZSA9PT0gJ2R1cmluZycpIHtcclxuICAgICAgZGVsZXRlIHByZWZlcmVuY2VzLmFuaW1hdGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zYmduTGF5b3V0UHJvcC5hcHBseUxheW91dChwcmVmZXJlbmNlcywgZmFsc2UpOyAvLyBsYXlvdXQgbXVzdCBub3QgYmUgdW5kb2FibGVcclxuICB9LFxyXG4gIGJlZm9yZVBlcmZvcm1MYXlvdXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XHJcblxyXG4gICAgbm9kZXMucmVtb3ZlRGF0YShcInBvcnRzXCIpO1xyXG4gICAgZWRnZXMucmVtb3ZlRGF0YShcInBvcnRzb3VyY2VcIik7XHJcbiAgICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHRhcmdldFwiKTtcclxuXHJcbiAgICBub2Rlcy5kYXRhKFwicG9ydHNcIiwgW10pO1xyXG4gICAgZWRnZXMuZGF0YShcInBvcnRzb3VyY2VcIiwgW10pO1xyXG4gICAgZWRnZXMuZGF0YShcInBvcnR0YXJnZXRcIiwgW10pO1xyXG5cclxuICAgIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXHJcbiAgICBjeS4kKCcuZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcclxuICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcclxuICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xyXG4gIH0sXHJcbiAgc2JnbnZpelVwZGF0ZTogZnVuY3Rpb24gKGN5R3JhcGgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjeSB1cGRhdGUgY2FsbGVkJyk7XHJcbiAgICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcclxuICAgIGN5LnVuZG9SZWRvKCkucmVzZXQoKTtcclxuICAgIHRoaXMucmVzZXRVbmRvUmVkb0J1dHRvbnMoKTtcclxuICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgIC8vIGNsZWFyIGRhdGFcclxuICAgIGN5LnJlbW92ZSgnKicpO1xyXG4gICAgY3kuYWRkKGN5R3JhcGgpO1xyXG4gICAgXHJcbiAgICAvL2FkZCBwb3NpdGlvbiBpbmZvcm1hdGlvbiB0byBkYXRhIGZvciBwcmVzZXQgbGF5b3V0XHJcbiAgICB2YXIgcG9zaXRpb25NYXAgPSB7fTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgeFBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5zYmduYmJveC54O1xyXG4gICAgICB2YXIgeVBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5zYmduYmJveC55O1xyXG4gICAgICBwb3NpdGlvbk1hcFtjeUdyYXBoLm5vZGVzW2ldLmRhdGEuaWRdID0geyd4JzogeFBvcywgJ3knOiB5UG9zfTtcclxuICAgIH1cclxuICAgIGN5LmxheW91dCh7XHJcbiAgICAgIG5hbWU6ICdwcmVzZXQnLFxyXG4gICAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwXHJcbiAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5pbml0QmVuZFBvaW50cyhjeS5lZGdlcygpKTtcclxuICB9LFxyXG4gIGdldEV4cGFuZENvbGxhcHNlT3B0aW9uczogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmlzaGV5ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnNiZ25TdHlsZVJ1bGVzWydyZWFycmFuZ2UtYWZ0ZXItZXhwYW5kLWNvbGxhcHNlJ107XHJcbiAgICAgIH0sXHJcbiAgICAgIGFuaW1hdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gc2VsZi5zYmduU3R5bGVSdWxlc1snYW5pbWF0ZS1vbi1kcmF3aW5nLWNoYW5nZXMnXTtcclxuICAgICAgfSxcclxuICAgICAgbGF5b3V0Qnk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXNlbGYuc2JnblN0eWxlUnVsZXNbJ3JlYXJyYW5nZS1hZnRlci1leHBhbmQtY29sbGFwc2UnXSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi50cmlnZ2VySW5jcmVtZW50YWxMYXlvdXQoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9LFxyXG4gIGR5bmFtaWNSZXNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3aW4gPSAkKHdpbmRvdyk7Ly8kKHRoaXMpOyAvL3RoaXMgPSB3aW5kb3dcclxuXHJcbiAgICB2YXIgd2luZG93V2lkdGggPSB3aW4ud2lkdGgoKTtcclxuICAgIHZhciB3aW5kb3dIZWlnaHQgPSB3aW4uaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2FudmFzV2lkdGggPSAxMDAwO1xyXG4gICAgdmFyIGNhbnZhc0hlaWdodCA9IDY4MDtcclxuICAgIGlmICh3aW5kb3dXaWR0aCA+IGNhbnZhc1dpZHRoKVxyXG4gICAge1xyXG4gICAgICAkKFwiI3NiZ24tbmV0d29yay1jb250YWluZXJcIikud2lkdGgod2luZG93V2lkdGggKiAwLjkpO1xyXG4gICAgICB2YXIgdyA9ICQoXCIjc2Jnbi1pbnNwZWN0b3ItYW5kLWNhbnZhc1wiKS53aWR0aCgpO1xyXG4gICAgICAkKFwiLm5hdi1tZW51XCIpLndpZHRoKHcpO1xyXG4gICAgICAkKFwiLm5hdmJhclwiKS53aWR0aCh3KTtcclxuICAgICAgJChcIiNzYmduLXRvb2xiYXJcIikud2lkdGgodyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvd0hlaWdodCA+IGNhbnZhc0hlaWdodClcclxuICAgIHtcclxuICAgICAgJChcIiNzYmduLW5ldHdvcmstY29udGFpbmVyXCIpLmhlaWdodCh3aW5kb3dIZWlnaHQgKiAwLjg1KTtcclxuICAgICAgJChcIiNzYmduLWluc3BlY3RvclwiKS5oZWlnaHQod2luZG93SGVpZ2h0ICogMC44NSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRJbmZvTGFiZWw6IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAvKiBJbmZvIGxhYmVsIG9mIGEgY29sbGFwc2VkIG5vZGUgY2Fubm90IGJlIGNoYW5nZWQgaWZcclxuICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxyXG4gICAgICovXHJcbiAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNvbGxhcHNlZENoaWxkcmVuICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3Mgc2JnbmxhYmVsXHJcbiAgICAgKi9cclxuICAgIGlmIChub2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpO1xyXG4gICAgdmFyIGluZm9MYWJlbCA9IFwiXCI7XHJcbiAgICAvKlxyXG4gICAgICogR2V0IHRoZSBpbmZvIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlIGJ5IGl0J3MgY2hpbGRyZW4gaW5mbyByZWN1cnNpdmVseVxyXG4gICAgICovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICB2YXIgY2hpbGRJbmZvID0gdGhpcy5nZXRJbmZvTGFiZWwoY2hpbGQpO1xyXG4gICAgICBpZiAoY2hpbGRJbmZvID09IG51bGwgfHwgY2hpbGRJbmZvID09IFwiXCIpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xyXG4gICAgICB9XHJcbiAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XHJcbiAgICB9XHJcblxyXG4gICAgLy9yZXR1cm4gaW5mbyBsYWJlbFxyXG4gICAgcmV0dXJuIGluZm9MYWJlbDtcclxuICB9LFxyXG4gIG5vZGVRdGlwRnVuY3Rpb246IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAvKiAgICAqIENoZWNrIHRoZSBzYmdubGFiZWwgb2YgdGhlIG5vZGUgaWYgaXQgaXMgbm90IHZhbGlkXHJcbiAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxyXG4gICAgICovXHJcbiAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIilcclxuICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcclxuICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIG5vZGUucXRpcCh7XHJcbiAgICAgIGNvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcclxuICAgICAgICB2YXIgc2JnbnN0YXRlc2FuZGluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNiZ25zdGF0ZXNhbmRpbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzYmduc3RhdGVzYW5kaW5mb3NbaV07XHJcbiAgICAgICAgICBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YXJpYWJsZTtcclxuICAgICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSAodmFyaWFibGUgPT0gbnVsbCAvKnx8IHR5cGVvZiBzdGF0ZVZhcmlhYmxlID09PSB1bmRlZmluZWQgKi8pID8gdmFsdWUgOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcclxuICAgICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGVMYWJlbCA9IHNiZ25zdGF0ZWFuZGluZm8ubGFiZWwudGV4dDtcclxuICAgICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29udGVudEh0bWw7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNob3c6IHtcclxuICAgICAgICByZWFkeTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgIG15OiAndG9wIGNlbnRlcicsXHJcbiAgICAgICAgYXQ6ICdib3R0b20gY2VudGVyJyxcclxuICAgICAgICBhZGp1c3Q6IHtcclxuICAgICAgICAgIGN5Vmlld3BvcnQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgY2xhc3NlczogJ3F0aXAtYm9vdHN0cmFwJyxcclxuICAgICAgICB0aXA6IHtcclxuICAgICAgICAgIHdpZHRoOiAxNixcclxuICAgICAgICAgIGhlaWdodDogOFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICByZWZyZXNoVW5kb1JlZG9CdXR0b25zU3RhdHVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xyXG4gICAgaWYgKHVyLmlzVW5kb1N0YWNrRW1wdHkoKSkge1xyXG4gICAgICAkKFwiI3VuZG8tbGFzdC1hY3Rpb25cIikucGFyZW50KFwibGlcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAkKFwiI3VuZG8tbGFzdC1hY3Rpb25cIikucGFyZW50KFwibGlcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodXIuaXNSZWRvU3RhY2tFbXB0eSgpKSB7XHJcbiAgICAgICQoXCIjcmVkby1sYXN0LWFjdGlvblwiKS5wYXJlbnQoXCJsaVwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICQoXCIjcmVkby1sYXN0LWFjdGlvblwiKS5wYXJlbnQoXCJsaVwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVzZXRVbmRvUmVkb0J1dHRvbnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoXCIjdW5kby1sYXN0LWFjdGlvblwiKS5wYXJlbnQoXCJsaVwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgJChcIiNyZWRvLWxhc3QtYWN0aW9uXCIpLnBhcmVudChcImxpXCIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgfSxcclxuICBjYWxjdWxhdGVQYWRkaW5nczogZnVuY3Rpb24gKHBhZGRpbmdQZXJjZW50KSB7XHJcbiAgICAvL0FzIGRlZmF1bHQgdXNlIHRoZSBjb21wb3VuZCBwYWRkaW5nIHZhbHVlXHJcbiAgICBpZiAoIXBhZGRpbmdQZXJjZW50KSB7XHJcbiAgICAgIHBhZGRpbmdQZXJjZW50ID0gcGFyc2VJbnQodGhpcy5zYmduU3R5bGVSdWxlc1snY29tcG91bmQtcGFkZGluZyddLCAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICB2YXIgbnVtT2ZTaW1wbGVzID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgaWYgKHRoZU5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IHRoZU5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLndpZHRoKCkpO1xyXG4gICAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcclxuICAgICAgICBudW1PZlNpbXBsZXMrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYWxjX3BhZGRpbmcgPSAocGFkZGluZ1BlcmNlbnQgLyAxMDApICogTWF0aC5mbG9vcih0b3RhbCAvICgyICogbnVtT2ZTaW1wbGVzKSk7XHJcbiAgICBpZiAoY2FsY19wYWRkaW5nIDwgNSkge1xyXG4gICAgICBjYWxjX3BhZGRpbmcgPSA1O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYWxjX3BhZGRpbmc7XHJcbiAgfSxcclxuICBjYWxjdWxhdGVUaWxpbmdQYWRkaW5nczogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xyXG4gIH0sXHJcbiAgY2FsY3VsYXRlQ29tcG91bmRQYWRkaW5nczogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xyXG4gIH0sXHJcbiAgcmVmcmVzaFBhZGRpbmdzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2FsY19wYWRkaW5nID0gdGhpcy5jYWxjdWxhdGVDb21wb3VuZFBhZGRpbmdzKCk7XHJcbiAgICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gICAgbm9kZXMuY3NzKCdwYWRkaW5nLWxlZnQnLCAwKTtcclxuICAgIG5vZGVzLmNzcygncGFkZGluZy1yaWdodCcsIDApO1xyXG4gICAgbm9kZXMuY3NzKCdwYWRkaW5nLXRvcCcsIDApO1xyXG4gICAgbm9kZXMuY3NzKCdwYWRkaW5nLWJvdHRvbScsIDApO1xyXG4gICAgdmFyIGNvbXBvdW5kcyA9IG5vZGVzLmZpbHRlcignJG5vZGUgPiBub2RlJyk7XHJcbiAgICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWxlZnQnLCBjYWxjX3BhZGRpbmcpO1xyXG4gICAgY29tcG91bmRzLmNzcygncGFkZGluZy1yaWdodCcsIGNhbGNfcGFkZGluZyk7XHJcbiAgICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLXRvcCcsIGNhbGNfcGFkZGluZyk7XHJcbiAgICBjb21wb3VuZHMuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNhbGNfcGFkZGluZyk7XHJcbiAgfSxcclxuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uIChpZCkge1xyXG5cclxuICAgIGlmICgkKCcuJyArIGlkKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJCgnI3NiZ24tbmV0d29yay1jb250YWluZXInKS53aWR0aCgpO1xyXG4gICAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gJCgnI3NiZ24tbmV0d29yay1jb250YWluZXInKS5oZWlnaHQoKTtcclxuICAgICAgJCgnI3NiZ24tbmV0d29yay1jb250YWluZXI6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGlkICsgJ1wiPjwvaT4nKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGVuZFNwaW5uZXI6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgaWYgKCQoJy4nICsgaWQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCgnLicgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb21tb25BcHBVdGlsaXRpZXM7IiwidmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3V0aWxpdGllcy9zYmduLWVsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB7XHJcbiAgLy8gU2VjdGlvbiBTdGFydFxyXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG4gIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XHJcbiAgfSxcclxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgIHZhciBwYXJhbSA9IHt9O1xyXG4gICAgcGFyYW0uZWxlcyA9IHNiZ25FbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKGVsZXMpO1xyXG4gICAgcmV0dXJuIHBhcmFtO1xyXG4gIH0sXHJcbiAgZGVsZXRlRWxlc1NtYXJ0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgcmV0dXJuIHNiZ25FbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTbWFydChwYXJhbS5lbGVzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgLy8gU2VjdGlvbiBFbmRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJlZ2lzdGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdmFyIGxpYnMgPSBvcHRpb25zLmxpYnM7XHJcbiAgICBcclxuICAgIGlmIChsaWJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgbGlicyA9IHt9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgbG9jYXRlZCBcclxuICAgIC8vIGluIG5vZGVfbW9kdWxlcyB1c2luZyBkZWZhdWx0IG9wdGlvbiBpcyBlbm91Z2hcclxuICAgIHZhciBpbWdQYXRoID0gb3B0aW9ucy5pbWdQYXRoIHx8ICdub2RlX21vZHVsZXMvc2JnbnZpei9zcmMvaW1nJztcclxuICAgIFxyXG4gICAgLy8gR2V0IGN5IGV4dGVuc2lvbiBpbnN0YW5jZXNcclxuICAgIHZhciBjeVBhbnpvb20gPSBsaWJzWydjeXRvc2NhcGUtcGFuem9vbSddO1xyXG4gICAgdmFyIGN5UXRpcCA9IGxpYnNbJ2N5dG9zY2FwZS1xdGlwJ107IFxyXG4gICAgdmFyIGN5Q29zZUJpbGtlbnQgPSBsaWJzWydjeXRvc2NhcGUtY29zZS1iaWxrZW50J107XHJcbiAgICB2YXIgY3lVbmRvUmVkbyA9IGxpYnNbJ2N5dG9zY2FwZS11bmRvLXJlZG8nXTtcclxuICAgIHZhciBjeUNsaXBib2FyZCA9IGxpYnNbJ2N5dG9zY2FwZS1jbGlwYm9hcmQnXTtcclxuICAgIHZhciBjeUNvbnRleHRNZW51cyA9IGxpYnNbJ2N5dG9zY2FwZS1jb250ZXh0LW1lbnVzJ107XHJcbiAgICB2YXIgY3lFeHBhbmRDb2xsYXBzZSA9IGxpYnNbJ2N5dG9zY2FwZS1leHBhbmQtY29sbGFwc2UnXTtcclxuICAgIHZhciBjeUVkZ2VCZW5kRWRpdGluZyA9IGxpYnNbJ2N5dG9zY2FwZS1lZGdlLWJlbmQtZWRpdGluZyddO1xyXG4gICAgdmFyIGN5Vmlld1V0aWxpdGllcyA9IGxpYnNbJ2N5dG9zY2FwZS12aWV3LXV0aWxpdGllcyddO1xyXG4gICAgXHJcbiAgICAvLyBSZWdpc3RlciBjeSBleHRlbnNpb25zXHJcbiAgICBjeVBhbnpvb20oIGN5dG9zY2FwZSwgJCApO1xyXG4gICAgY3lRdGlwKCBjeXRvc2NhcGUsICQgKTtcclxuICAgIGN5Q29zZUJpbGtlbnQoIGN5dG9zY2FwZSApO1xyXG4gICAgY3lVbmRvUmVkbyggY3l0b3NjYXBlICk7XHJcbiAgICBjeUNsaXBib2FyZCggY3l0b3NjYXBlICk7XHJcbiAgICBjeUNvbnRleHRNZW51cyggY3l0b3NjYXBlLCAkICk7XHJcbiAgICBjeUV4cGFuZENvbGxhcHNlKCBjeXRvc2NhcGUsICQgKTtcclxuICAgIGN5RWRnZUJlbmRFZGl0aW5nKCBjeXRvc2NhcGUsICQgKTtcclxuICAgIGN5Vmlld1V0aWxpdGllcyggY3l0b3NjYXBlLCAkICk7XHJcbiAgICBcclxuICAgIHZhciBzYmduUmVuZGVyZXIgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9jeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXInKTtcclxuICAgIHZhciBzYmduQ3lJbnN0YW5jZSA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UnKTtcclxuICAgIHZhciBhcHBDeSA9IHJlcXVpcmUoJy4uL3NhbXBsZS1hcHAvanMvYXBwLWN5Jyk7XHJcbiAgICB2YXIgYXBwTWVudSA9IHJlcXVpcmUoJy4uL3NhbXBsZS1hcHAvanMvYXBwLW1lbnUnKTtcclxuICAgIFxyXG4gICAgc2JnblJlbmRlcmVyKCk7XHJcbiAgICBzYmduQ3lJbnN0YW5jZShvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciwgaW1nUGF0aCk7XHJcbiAgICBhcHBDeSgpO1xyXG4gICAgYXBwTWVudSgpO1xyXG4gICAgXHJcbiAgfTtcclxuICBcclxuICBtb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xyXG59KSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcclxuICB2YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG4vLyAgdmFyIGN5VmFyaWFibGVzID0gcmVxdWlyZSgnLi4vY3ktdmFyaWFibGVzJyk7XHJcbiAgXHJcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduU2hhcGVzID0ge1xyXG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAncHJvY2Vzcyc6IHRydWUsXHJcbiAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQudG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24gPSB7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jYXJkaW5hbGl0eVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib3hMZW5ndGg6IDEzLFxyXG4gICAgICBkaXN0YW5jZVRvTm9kZTogMjUsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBcIjlweCBBcmlhbFwiO1xyXG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCwgZmFsc2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uYWRkUG9ydFJlcGxhY2VtZW50SWZBbnkgPSBmdW5jdGlvbiAobm9kZSwgZWRnZVBvcnQpIHtcclxuICAgIHZhciBwb3NYID0gbm9kZS5wb3NpdGlvbigpLng7XHJcbiAgICB2YXIgcG9zWSA9IG5vZGUucG9zaXRpb24oKS55O1xyXG4gICAgaWYgKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgICBpZiAocG9ydC5pZCA9PSBlZGdlUG9ydCkge1xyXG4gICAgICAgICAgcG9zWCA9IHBvc1ggKyBwb3J0LnggKiBub2RlLndpZHRoKCkgLyAxMDA7XHJcbiAgICAgICAgICBwb3NZID0gcG9zWSArIHBvcnQueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7J3gnOiBwb3NYLCAneSc6IHBvc1l9O1xyXG4gIH1cclxuICA7XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBwb3J0WSA9IHBvcnQueSAqIGhlaWdodCAvIDEwMCArIGNlbnRlclk7XHJcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUocG9ydFgsIHBvcnRZLFxyXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuXHJcbiAgICAgIC8vYWRkIGEgbGl0dGxlIGJsYWNrIGNpcmNsZSB0byBwb3J0c1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIHBvcnRYLCBwb3J0WSwgMiwgMik7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3UXVhZHJhdGljTGluZUNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGNvbnRleHQsIGVkZ2UsIHB0cywgdHlwZSkge1xyXG4gICAgY29udGV4dC5tb3ZlVG8ocHRzWzBdLCBwdHNbMV0pO1xyXG4gICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHB0c1syXSwgcHRzWzNdLCBwdHNbNF0sIHB0c1s1XSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPT0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciB0b3RhbExlbmd0aCA9IHFCZXppZXJMZW5ndGgocHRzKTtcclxuXHJcbiAgICB2YXIgc3RhcnRMZW5ndGggPSB0b3RhbExlbmd0aCAtIDI1O1xyXG5cclxuICAgIHZhciBzdGFydFBvcnRpb24gPSBzdGFydExlbmd0aCAvIHRvdGFsTGVuZ3RoO1xyXG5cclxuICAgIGlmICh0eXBlID09PSBcImNvbnN1bXB0aW9uXCIpIHtcclxuICAgICAgc3RhcnRQb3J0aW9uID0gY2FyUHJvcC5kaXN0YW5jZVRvU291cmNlIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFBvcnRpb24gPSAodG90YWxMZW5ndGggLSBjYXJQcm9wLmRpc3RhbmNlVG9UYXJnZXQpIC8gdG90YWxMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQgPSBzdGFydFBvcnRpb247XHJcbiAgICB2YXIgeDEgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1swXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1syXSArIHQgKiB0ICogcHRzWzRdO1xyXG4gICAgdmFyIHkxID0gKDEgLSB0KSAqICgxIC0gdCkgKiBwdHNbMV0gKyAyICogKDEgLSB0KSAqIHQgKiBwdHNbM10gKyB0ICogdCAqIHB0c1s1XTtcclxuXHJcbiAgICAvL2dldCBhIHNob3J0IGxpbmUgdG8gZGV0ZXJtaW5lIHRhbmdldCBsaW5lXHJcbiAgICB0ID0gc3RhcnRQb3J0aW9uICsgMC4wMTtcclxuICAgIHZhciB4MiA9ICgxIC0gdCkgKiAoMSAtIHQpICogcHRzWzBdICsgMiAqICgxIC0gdCkgKiB0ICogcHRzWzJdICsgdCAqIHQgKiBwdHNbNF07XHJcbiAgICB2YXIgeTIgPSAoMSAtIHQpICogKDEgLSB0KSAqIHB0c1sxXSArIDIgKiAoMSAtIHQpICogdCAqIHB0c1szXSArIHQgKiB0ICogcHRzWzVdO1xyXG5cclxuICAgIHZhciBkaXNwWCA9IHgxIC0geDI7XHJcbiAgICB2YXIgZGlzcFkgPSB5MSAtIHkyO1xyXG5cclxuICAgIHZhciBhbmdsZSA9IE1hdGguYXNpbihkaXNwWSAvIChNYXRoLnNxcnQoZGlzcFggKiBkaXNwWCArIGRpc3BZICogZGlzcFkpKSk7XHJcblxyXG4gICAgaWYgKGRpc3BYIDwgMCkge1xyXG4gICAgICBhbmdsZSA9IGFuZ2xlICsgTWF0aC5QSSAvIDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbmdsZSA9IC0oTWF0aC5QSSAvIDIgKyBhbmdsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgxLCB5MSk7XHJcbiAgICBjb250ZXh0LnJvdGF0ZSgtYW5nbGUpO1xyXG5cclxuICAgIGNvbnRleHQucmVjdCgwLCAtMTMgLyAyLCAxMywgMTMpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogMCwgJ2NlbnRlclknOiAxMyAvIDIsXHJcbiAgICAgICdvcGFjaXR5JzogZWRnZS5jc3MoJ3RleHQtb3BhY2l0eScpICogZWRnZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgJ3dpZHRoJzogMTMsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICQkLnNiZ24uZHJhd0NhcmRpbmFsaXR5VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgIGNvbnRleHQucm90YXRlKGFuZ2xlKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14MSwgLXkxKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RyYWlnaHRMaW5lQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoY29udGV4dCwgZWRnZSwgcHRzLCB0eXBlKSB7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMF0sIHB0c1sxXSk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhwdHNbMl0sIHB0c1szXSk7XHJcblxyXG4gICAgLy9pZiBjYXJkaW5hbGl0eSBpcyB6ZXJvLCByZXR1cm4gaGVyZS5cclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zYmduY2FyZGluYWxpdHk7XHJcbiAgICBpZiAoY2FyZGluYWxpdHkgPD0gMCB8fCBjYXJkaW5hbGl0eSA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdmFyIGNhclByb3AgPSAkJC5zYmduLmNhcmRpbmFsaXR5UHJvcGVydGllcygpO1xyXG5cclxuICAgIHZhciBsZW5ndGggPSAoTWF0aC5zcXJ0KChwdHNbMl0gLSBwdHNbMF0pICogKHB0c1syXSAtIHB0c1swXSkgK1xyXG4gICAgICAgICAgICAocHRzWzNdIC0gcHRzWzFdKSAqIChwdHNbM10gLSBwdHNbMV0pKSk7XHJcblxyXG4gICAgdmFyIGRpc3BYLCBkaXNwWSwgc3RhcnRYLCBzdGFydFk7XHJcblxyXG4gICAgLy9UT0RPIDogeW91IG1heSBuZWVkIHRvIGNoYW5nZSBoZXJlXHJcbiAgICBpZiAodHlwZSA9PT0gXCJjb25zdW1wdGlvblwiKSB7XHJcbiAgICAgIHN0YXJ0WCA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFg7XHJcbiAgICAgIHN0YXJ0WSA9IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guYXJyb3dTdGFydFk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGFydFggPSBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmFycm93RW5kWDtcclxuICAgICAgc3RhcnRZID0gZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5hcnJvd0VuZFk7XHJcbiAgICB9XHJcbiAgICB2YXIgc3JjUG9zID0gKHR5cGUgPT09IFwiY29uc3VtcHRpb25cIikgPyBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCkgOiBlZGdlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcbiAgICAvL3ZhciBzcmNQb3MgPSBlZGdlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XHJcbiAgICBkaXNwWCA9IHN0YXJ0WCAtIHNyY1Bvcy54O1xyXG4gICAgZGlzcFkgPSBzdGFydFkgLSBzcmNQb3MueTtcclxuXHJcbiAgICB2YXIgYW5nbGUgPSBNYXRoLmFzaW4oZGlzcFkgLyAoTWF0aC5zcXJ0KGRpc3BYICogZGlzcFggKyBkaXNwWSAqIGRpc3BZKSkpO1xyXG5cclxuICAgIGlmIChkaXNwWCA8IDApIHtcclxuICAgICAgYW5nbGUgPSBhbmdsZSArIE1hdGguUEkgLyAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW5nbGUgPSAtKE1hdGguUEkgLyAyICsgYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHN0YXJ0WCwgc3RhcnRZKTtcclxuICAgIGNvbnRleHQucm90YXRlKC1hbmdsZSk7XHJcblxyXG4gICAgaWYgKGxlbmd0aCA+IGNhclByb3AuZGlzdGFuY2VUb05vZGUpIHtcclxuICAgICAgY29udGV4dC5yZWN0KDAsIC1jYXJQcm9wLmRpc3RhbmNlVG9Ob2RlLCBjYXJQcm9wLmJveExlbmd0aCwgY2FyUHJvcC5ib3hMZW5ndGgpO1xyXG5cclxuICAgICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogLWNhclByb3AuZGlzdGFuY2VUb05vZGUgKyBjYXJQcm9wLmJveExlbmd0aCAvIDIsICdjZW50ZXJZJzogLWNhclByb3AuYm94TGVuZ3RoIC8gMixcclxuICAgICAgICAnb3BhY2l0eSc6IGVkZ2UuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIGVkZ2UuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogY2FyUHJvcC5ib3hMZW5ndGgsICdsYWJlbCc6IGNhcmRpbmFsaXR5fTtcclxuICAgICAgJCQuc2Jnbi5kcmF3Q2FyZGluYWxpdHlUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgIGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXN0YXJ0WCwgLXN0YXJ0WSk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xyXG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xyXG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XHJcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XHJcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XHJcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcclxuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvd25XaWR0aCA9IGRvd25XaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcclxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICBzdGF0ZS5iYm94LnkgPSAoc3RhdGVDZW50ZXJZIC0gY2VudGVyWSkgKiAxMDAgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcclxuICAgIHZhciBzdGF0ZVZhcmlhYmxlID0gdGV4dFByb3Auc3RhdGUudmFyaWFibGUgfHwgJyc7XHJcblxyXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgPyBcIkBcIiArIHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgOiBcIlwiKTtcclxuXHJcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG5cclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGVMYWJlbDtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIGZvbnRTaXplID0gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wLCB0cnVuY2F0ZSkge1xyXG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XHJcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xyXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRleHRQcm9wLmNvbG9yO1xyXG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XHJcbiAgICB2YXIgdGV4dDtcclxuICAgIFxyXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcclxuICAgIFxyXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XHJcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xyXG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gIH07XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xyXG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3cocG9pbnQxWzBdIC0gcG9pbnQyWzBdLCAyKSArIE1hdGgucG93KHBvaW50MVsxXSAtIHBvaW50MlsxXSwgMik7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNvbG9ycyA9IHtcclxuICAgIGNsb25lOiBcIiNhOWE5YTlcIixcclxuICAgIGFzc29jaWF0aW9uOiBcIiM2QjZCNkJcIixcclxuICAgIHBvcnQ6IFwiIzZCNkI2QlwiXHJcbiAgfTtcclxuXHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgMCk7XHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQubGluZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcztcclxuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxyXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXHJcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxyXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuXHJcbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxyXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xyXG5cclxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0c1tpXTtcclxuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xyXG4gICAgICB2YXIgY2xvc2VzdFBvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuICAgICAgY29udGV4dC5tb3ZlVG8ocG9ydFgsIHBvcnRZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLnBvcnQ7XHJcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdkaXNzb2NpYXRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5zcGVjaWZpZWQgZW50aXR5Jyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgncHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ29taXR0ZWQgcHJvY2VzcycpO1xyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3VuY2VydGFpbiBwcm9jZXNzJyk7XHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnYXNzb2NpYXRpb24nKTtcclxuXHJcbiAgY3lWYXJpYWJsZXMuY3lTdHlmbi50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgnY29uc3VtcHRpb24nKTtcclxuICBjeVZhcmlhYmxlcy5jeVN0eWZuLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdwcm9kdWN0aW9uJyk7XHJcblxyXG4gIGN5VmFyaWFibGVzLmN5U3R5Zm4udHlwZXMuYXJyb3dTaGFwZS5lbnVtcy5wdXNoKCduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25BcnJvd1NoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0galF1ZXJ5LmV4dGVuZCh7fSwgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ10pO1xyXG4gICAgY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1snbmVjZXNzYXJ5IHN0aW11bGF0aW9uJ10ucG9pbnRzVGVlID0gW1xyXG4gICAgICAtMC4xOCwgLTAuNDMsXHJcbiAgICAgIDAuMTgsIC0wLjQzXHJcbiAgICBdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN5VmFyaWFibGVzLmN5QXJyb3dTaGFwZXNbJ25lY2Vzc2FyeSBzdGltdWxhdGlvbiddID0gY3lWYXJpYWJsZXMuY3lBcnJvd1NoYXBlc1sndHJpYW5nbGUtdGVlJ107XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKSxcclxuICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvUG9seWdvblNoYXBlKGNvbnRleHQsIG5vZGUsIHRoaXMucG9pbnRzKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzWydwcm9jZXNzJ10ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1sncHJvY2VzcyddLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snb21pdHRlZCBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddLmxhYmVsID0gJ1xcXFxcXFxcJztcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXSk7XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ3VuY2VydGFpbiBwcm9jZXNzJ10ubGFiZWwgPSAnPyc7XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1widW5zcGVjaWZpZWQgZW50aXR5XCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyk7XHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5VmFyaWFibGVzLmN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUoY29udGV4dCwgbm9kZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRJbnRlcnNlY3Rpb24gPSAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyhub2RlLCB4LCB5LCBwb3J0SWQpO1xyXG4gICAgICAgIGlmIChwb3J0SW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJldHVybiBwb3J0SW50ZXJzZWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lRWxsaXBzZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZGlzc29jaWF0aW9uXCJdID0ge1xyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDQsIGhlaWdodCAvIDQpO1xyXG5cclxuICAgICAgICAvLyBBdCBvcmlnaW4sIHJhZGl1cyAxLCAwIHRvIDJwaVxyXG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDAsIE1hdGguUEkgKiAyICogMC45OTksIGZhbHNlKTsgLy8gKjAuOTk5IGIvYyBjaHJvbWUgcmVuZGVyaW5nIGJ1ZyBvbiBmdWxsIGNpcmNsZVxyXG5cclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoNCAvIHdpZHRoLCA0IC8gaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgbm9kZVgsXHJcbiAgICAgICAgICAgICAgICBub2RlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiArIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBbXSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBjb3JuZXJMZW5ndGg6IDEyLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBoYXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlckhlaWdodCgpIDogbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBjeVZhcmlhYmxlcy5jeVJlbmRlcmVyLmRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbi8vICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uaW50ZXJzZWN0TGluZSxcclxuLy8gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJXaWR0aCgpIDogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBoYXNDaGlsZHJlbiA/IG5vZGUub3V0ZXJIZWlnaHQoKSA6IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgcG9ydEludGVyc2VjdGlvbiA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVBvcnRzKG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbiAgICAgICAgaWYgKHBvcnRJbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBvcnRJbnRlcnNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeVZhcmlhYmxlcy5jeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGhhc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gKGhhc0NoaWxkcmVuID8gbm9kZS5vdXRlcldpZHRoKCkgOiBub2RlLndpZHRoKCkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAoaGFzQ2hpbGRyZW4gPyBub2RlLm91dGVySGVpZ2h0KCkgOiBub2RlLmhlaWdodCgpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5VmFyaWFibGVzLmN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeVZhcmlhYmxlcy5jeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcblxyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRyYXdQYXRoOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBwb3J0SW50ZXJzZWN0aW9uID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lUG9ydHMobm9kZSwgeCwgeSwgcG9ydElkKTtcclxuICAgICAgICBpZiAocG9ydEludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcG9ydEludGVyc2VjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsXHJcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmxhYmVsO1xyXG4gICAgICAgIHZhciBwdHMgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc291cmNlQW5kU2luayhjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4gICAgICBjaGVja1BvaW50OiBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgLy9jb250ZXh0LmZpbGwoKTtcclxuICAgIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcclxuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lWYXJpYWJsZXMuY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBlcnR1cmJpbmdBZ2VudDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDg7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTUgLyA2LCAtMSwgNSAvIDYsIC0xLCAxLCAxLCAtMSwgMV07XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgcmVuZGVyZXIuZHJhd1BvbHlnb24oY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxyXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hY3JvbW9sZWN1bGU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgICAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTEsIC0xLCAxLCAtMSwgMSAtIGNwWCwgMSwgLTEgKyBjcFgsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIGN5VmFyaWFibGVzLmN5UmVuZGVyZXIuZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuXHJcbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVQb3J0cyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgIGlmIChwb3J0cy5sZW5ndGggPCAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xyXG4gICAgICBpZiAocG9ydElkID09IHBvcnQuaWQpIHtcclxuICAgICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcG9ydC54ICogd2lkdGggLyAxMDAgKyBub2RlWCwgcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgbm9kZVksIDEsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcclxuICAgIHZhciBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgIHZhciBjaGVja1BvaW50ID0gW2ludGVyc2VjdGlvbnNbaV0sIGludGVyc2VjdGlvbnNbaSArIDFdXTtcclxuICAgICAgdmFyIGRpc3RhbmNlID0gY3lWYXJpYWJsZXMuY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcclxuXHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW50ZXJzZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIG5vZGVYLCBub2RlWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHMsIHdlIGhhdmUgb25seSB0d28gYXJjcyBmb3JcclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxyXG4gICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggc3RyYWlnaHQgbGluZSBzZWdtZW50c1xyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5VmFyaWFibGVzLmN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lWYXJpYWJsZXMuY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeVZhcmlhYmxlcy5jeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3AgTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeVZhcmlhYmxlcy5jeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BMZWZ0Q2VudGVyWCwgdG9wTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvcCBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcFJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5VmFyaWFibGVzLmN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgdyA9IHdpZHRoIC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGFuID0gY2VudGVyWDtcclxuICAgIHZhciBibiA9IGNlbnRlclk7XHJcblxyXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XHJcblxyXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcclxuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcclxuICAgIHZhciBhID0gaCAqIGggKyB3ICogdyAqIG0gKiBtO1xyXG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcclxuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXHJcbiAgICAgICAgICAgIGJuICogYm4gKiB3ICogdyAtIGggKiBoICogdyAqIHc7XHJcblxyXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xyXG5cclxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG4gICAgdmFyIHQyID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuXHJcbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XHJcbiAgICB2YXIgeE1heCA9IE1hdGgubWF4KHQxLCB0Mik7XHJcblxyXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIHlNYXggPSBtICogeE1heCAtIG0gKiB4MiArIHkyO1xyXG5cclxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc2JnbnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuXHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KHN0YXRlSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeVZhcmlhYmxlcy5jeU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVDaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludChcclxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGluZm9Db3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4vLyAgJCQuc2Jnbi5pbnRlcnNldExpbmVTZWxlY3Rpb24gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuLy8gICAgLy9UT0RPOiBkbyBpdCBmb3IgYWxsIGNsYXNzZXMgaW4gc2JnbiwgY3JlYXRlIGEgc2JnbiBjbGFzcyBhcnJheSB0byBjaGVja1xyXG4vLyAgICBpZiAodGVtcFNiZ25TaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuLy8gICAgICByZXR1cm4gY3lWYXJpYWJsZXMuY3lOb2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldLmludGVyc2VjdExpbmUoXHJcbi8vICAgICAgICAgIG5vZGUsIHgsIHksIHBvcnRJZCk7XHJcbi8vICAgIH1cclxuLy8gICAgZWxzZSB7XHJcbi8vICAgICAgcmV0dXJuIGN5VmFyaWFibGVzLmN5Tm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXS5pbnRlcnNlY3RMaW5lKFxyXG4vLyAgICAgICAgICBub2RlLl9wcml2YXRlLnBvc2l0aW9uLngsXHJcbi8vICAgICAgICAgIG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSxcclxuLy8gICAgICAgICAgbm9kZS5vdXRlcldpZHRoKCksXHJcbi8vICAgICAgICAgIG5vZGUub3V0ZXJIZWlnaHQoKSxcclxuLy8gICAgICAgICAgeCwgLy9oYWxmUG9pbnRYLFxyXG4vLyAgICAgICAgICB5LCAvL2hhbGZQb2ludFlcclxuLy8gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJvcmRlci13aWR0aFwiXS5weFZhbHVlIC8gMlxyXG4vLyAgICAgICAgICApO1xyXG4vLyAgICB9XHJcbi8vICB9O1xyXG5cclxuICAkJC5zYmduLmlzTm9kZVNoYXBlVG90YWxseU92ZXJyaWRlbiA9IGZ1bmN0aW9uIChyZW5kZXIsIG5vZGUpIHtcclxuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufTtcclxuIiwidmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3NiZ24tZWxlbWVudC11dGlsaXRpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyU2VsZWN0b3IsIGltZ1BhdGgpIHtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcbiAge1xuICAgIHZhciBzYmduTmV0d29ya0NvbnRhaW5lciA9ICQoY29udGFpbmVyU2VsZWN0b3IpO1xuXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcbiAgICB2YXIgY3kgPSBjeXRvc2NhcGUoe1xuICAgICAgY29udGFpbmVyOiBzYmduTmV0d29ya0NvbnRhaW5lcixcbiAgICAgIHN0eWxlOiBzYmduU3R5bGVTaGVldCxcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxuICAgICAgYm94U2VsZWN0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1vdGlvbkJsdXI6IHRydWUsXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXG4gICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuY3kgPSB0aGlzO1xuICAgICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIHNiZ25TdHlsZVNoZWV0ID0gY3l0b3NjYXBlLnN0eWxlc2hlZXQoKVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0RWxlbWVudENvbnRlbnQoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS41LFxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmNmY2ZjYnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxuICAgICAgICAgICAgJ29wYWNpdHknOiAxXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9zYmduY2xvbmVtYXJrZXJdW3NiZ25jbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGltZ1BhdGggKyAnL2Nsb25lX2JnLnBuZycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JzogJzUwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1oZWlnaHQnOiAnMjUlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ3NiZ25jbG9uZW1hcmtlcicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3NdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIC0wLjUsIDAsICAtMSwgMSwgICAxLCAxLCAgIDAuNSwgMCwgMSwgLTEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzcz0ndGFnJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW3NiZ25jbGFzcz0nYXNzb2NpYXRpb24nXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnIzZCNkI2QidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmNsYXNzPSdjb21wbGV4J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNGNEYzRUUnLFxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtzYmduY2xhc3M9J2NvbXBhcnRtZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAzLjc1LFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbc2JnbmJib3hdW3NiZ25jbGFzc11bc2JnbmNsYXNzIT0nY29tcGxleCddW3NiZ25jbGFzcyE9J2NvbXBhcnRtZW50J11bc2JnbmNsYXNzIT0nc3VibWFwJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKHNiZ25iYm94LncpJyxcbiAgICAgICAgICAgICdoZWlnaHQnOiAnZGF0YShzYmduYmJveC5oKSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbZXhwYW5kZWQtY29sbGFwc2VkPSdjb2xsYXBzZWQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzZcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxuICAgICAgICAgICAgJ3dpZHRoJzogMS41LFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6YWN0aXZlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnOCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXJvdGF0aW9uJzogJ2F1dG9yb3RhdGUnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1zaGFwZSc6ICdyZWN0YW5nbGUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItd2lkdGgnOiAnMScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3M9J2NvbnN1bXB0aW9uJ11bc2JnbmNhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdzYmduY2FyZGluYWxpdHknKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc291cmNlLXRleHQtbWFyZ2luLXknOiAnLTEwJyxcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzYmduRWxlbWVudFV0aWxpdGllcy5nZXRDYXJkaW5hbGl0eURpc3RhbmNlKGVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW3NiZ25jbGFzcz0ncHJvZHVjdGlvbiddW3NiZ25jYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnc2JnbmNhcmRpbmFsaXR5Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW1hcmdpbi15JzogJy0xMCcsXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3NdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2JnbkVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lBcnJvd1NoYXBlKGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1zaGFwZSc6ICdub25lJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtzYmduY2xhc3M9J2luaGliaXRpb24nXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2Vbc2JnbmNsYXNzPSdwcm9kdWN0aW9uJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJjb3JlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LW9wYWNpdHknOiAnMC4yJywgJ3NlbGVjdGlvbi1ib3gtYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnXG4gICAgICAgICAgfSk7XG5cbiAgZnVuY3Rpb24gYmluZEN5RXZlbnRzKCkge1xuICAgIGN5Lm9uKCd0YXBlbmQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxufTsiLCJ2YXIgZGlhbG9nVXRpbGl0aWVzID0ge1xyXG4gIG9wZW5EaWFsb2c6IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xyXG4gICAgJChlbCkuZGlhbG9nKFxyXG4gICAgICAgICQuZXh0ZW5kKCB7fSwge1xyXG4gICAgICAgICAgbW9kYWw6IHRydWUsXHJcbiAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXBzdGFydEZjbiwgY3h0dGFwRmNuLCB6b29tRmNuLCBwYW5GY247XHJcbiAgICAgICAgICAgICQoJy51aS13aWRnZXQtb3ZlcmxheScpLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICQoZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjeS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY3kub24oJ3RhcHN0YXJ0JywgdGFwc3RhcnRGY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kYXRhKCd0YXBzdGFydEZjbicsIHRhcHN0YXJ0RmNuKTtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRpYWxvZygnY2xvc2UnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgY3kub24oJ2N4dHRhcCcsIGN4dHRhcEZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmRhdGEoJ2N4dHRhcEZjbicsIGN4dHRhcEZjbik7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kaWFsb2coJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgY3kub24oJ3pvb20nLCB6b29tRmNuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGF0YSgnem9vbUZjbicsIHpvb21GY24pO1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGN5Lm9uKCdwYW4nLCBwYW5GY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5kYXRhKCdwYW5GY24nLCBwYW5GY24pO1xyXG4gICAgICAgICAgICAgICAgJChlbCkuZGlhbG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjeS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgaWYoJChlbCkuZGF0YSgndGFwc3RhcnRGY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCd0YXBzdGFydCcsICQoZWwpLmRhdGEoJ3RhcHN0YXJ0RmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBpZigkKGVsKS5kYXRhKCdjeHR0YXBGY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCdjeHR0YXAnLCAkKGVsKS5kYXRhKCdjeHR0YXBGY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKCQoZWwpLmRhdGEoJ3pvb21GY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCd6b29tJywgJChlbCkuZGF0YSgnem9vbUZjbicpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgaWYoJChlbCkuZGF0YSgncGFuRmNuJykpIHtcclxuICAgICAgICAgICAgICAgIGN5Lm9mZigncGFuJywgJChlbCkuZGF0YSgncGFuRmNuJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9ucyApXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgb3BlbkZhbmN5Ym94OiBmdW5jdGlvbigkdGVtcGxhdGUsIG9wdGlvbnMpIHtcclxuICAgICQuZmFuY3lib3goXHJcbiAgICAgICAgXy50ZW1wbGF0ZSgkdGVtcGxhdGUuaHRtbCgpLCB7fSksXHJcbiAgICAgICAgJC5leHRlbmQoIHt9LCB7XHJcbiAgICAgICAgICAnYXV0b0RpbWVuc2lvbnMnOiB0cnVlLFxyXG4gICAgICAgICAgJ3RyYW5zaXRpb25Jbic6ICdub25lJyxcclxuICAgICAgICAgICd0cmFuc2l0aW9uT3V0JzogJ25vbmUnLFxyXG4gICAgICAgICAgJ29uU3RhcnQnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHpvb21GY24sIHBhbkZjbjtcclxuICAgICAgICAgICAgY3kucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGN5Lm9uKCd6b29tJywgem9vbUZjbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0ZW1wbGF0ZS5kYXRhKCd6b29tRmNuJywgem9vbUZjbik7XHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGN5Lm9uKCdwYW4nLCBwYW5GY24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGVtcGxhdGUuZGF0YSgncGFuRmNuJywgcGFuRmNuKTtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ29uQ2xvc2VkJzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN5LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlLmRhdGEoJ3pvb21GY24nKSkge1xyXG4gICAgICAgICAgICAgICAgY3kub2ZmKCd6b29tJywgJHRlbXBsYXRlLmRhdGEoJ3pvb21GY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlLmRhdGEoJ3BhbkZjbicpKSB7XHJcbiAgICAgICAgICAgICAgICBjeS5vZmYoJ3BhbicsICR0ZW1wbGF0ZS5kYXRhKCdwYW5GY24nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25zKSApO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGlhbG9nVXRpbGl0aWVzO1xyXG5cclxuXHJcbiIsInZhciBqc29uVG9TYmdubWwgPSB7XHJcbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8c2JnbiB4bWxucz0naHR0cDovL3NiZ24ub3JnL2xpYnNiZ24vMC4yJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPG1hcCBsYW5ndWFnZT0ncHJvY2VzcyBkZXNjcmlwdGlvbic+XFxuXCI7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGdseXBoIHNiZ25tbFxyXG4gICAgICAgIGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5pc0NoaWxkKCkpXHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuZ2V0R2x5cGhTYmdubWwodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vYWRkaW5nIGFyYyBzYmdubWxcclxuICAgICAgICBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBzZWxmLmdldEFyY1NiZ25tbCh0aGlzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjwvbWFwPlxcblwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L3NiZ24+XFxuXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRHbHlwaFNiZ25tbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmKG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nY29tcGFydG1lbnQnIFwiO1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEucGFyZW50ICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIgPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZENvbW1vbkdseXBoUHJvcGVydGllcyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRHbHlwaFNiZ25tbCh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYobm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PT0gXCJjb21wbGV4XCIgfHwgbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PT0gXCJzdWJtYXBcIil7XHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5pZCArIFwiJyBjbGFzcz0nXCIgKyBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzICsgXCInIFwiO1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYocGFyZW50Ll9wcml2YXRlLmRhdGEuc2JnbmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiIGNvbXBhcnRtZW50UmVmPSdcIiArIHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiA+XFxuXCI7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHNlbGYuYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5nZXRHbHlwaFNiZ25tbCh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXsvL2l0IGlzIGEgc2ltcGxlIG5vZGVcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5fcHJpdmF0ZS5kYXRhLmlkICsgXCInIGNsYXNzPSdcIiArIG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MgKyBcIidcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUucGFyZW50KCkuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLnNiZ25jbGFzcyA9PSBcImNvbXBhcnRtZW50XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIiBjb21wYXJ0bWVudFJlZj0nXCIgKyBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiID5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgc2VsZi5hZGRDb21tb25HbHlwaFByb3BlcnRpZXMobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPC9nbHlwaD5cXG5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAgc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQ29tbW9uR2x5cGhQcm9wZXJ0aWVzIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL2FkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRMYWJlbChub2RlKTtcclxuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZEdseXBoQmJveChub2RlKTtcclxuICAgICAgICAvL2FkZCBjbG9uZSBpbmZvcm1hdGlvblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgdGhpcy5hZGRDbG9uZShub2RlKTtcclxuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZFBvcnQobm9kZSk7XHJcbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmdldFN0YXRlQW5kSW5mb1NiZ25tbChub2RlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZENsb25lIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEuc2JnbmNsb25lbWFya2VyICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGNsb25lLz5cXG5cIjtcclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0U3RhdGVBbmRJbmZvU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmduc3RhdGVzYW5kaW5mb3MubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIGJveEdseXBoID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnNiZ25zdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XHJcbiAgICAgICAgICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVCb3hHbHlwaChib3hHbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpe1xyXG4gICAgICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyB0aGlzLmFkZEluZm9Cb3hHbHlwaChib3hHbHlwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEFyY1NiZ25tbCA6IGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy9UZW1wb3JhcnkgaGFjayB0byByZXNvbHZlIFwidW5kZWZpbmVkXCIgYXJjIHNvdXJjZSBhbmQgdGFyZ2V0c1xyXG4gICAgICAgIHZhciBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldDtcclxuICAgICAgICB2YXIgYXJjU291cmNlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNTb3VyY2UgPT0gbnVsbCB8fCBhcmNTb3VyY2UubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xyXG5cclxuICAgICAgICBpZiAoYXJjVGFyZ2V0ID09IG51bGwgfHwgYXJjVGFyZ2V0Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcclxuXHJcbiAgICAgICAgdmFyIGFyY0lkID0gYXJjU291cmNlICsgXCItXCIgKyBhcmNUYXJnZXQ7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8YXJjIGlkPSdcIiArIGFyY0lkICtcclxuICAgICAgICAgICAgXCInIHRhcmdldD0nXCIgKyBhcmNUYXJnZXQgK1xyXG4gICAgICAgICAgICBcIicgc291cmNlPSdcIiArIGFyY1NvdXJjZSArIFwiJyBjbGFzcz0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzICsgXCInPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHN0YXJ0IHk9J1wiICsgZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFkgKyBcIicgeD0nXCIgK1xyXG4gICAgICAgICAgICBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCArIFwiJy8+XFxuXCI7XHJcblxyXG4gICAgICAgIHZhciBzZWdwdHMgPSBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmdldFNlZ21lbnRQb2ludHMoZWRnZSk7XHJcbiAgICAgICAgaWYoc2VncHRzKXtcclxuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IHNlZ3B0cyAmJiBpIDwgc2VncHRzLmxlbmd0aDsgaSA9IGkgKyAyKXtcclxuICAgICAgICAgICAgdmFyIGJlbmRYID0gc2VncHRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxuZXh0IHk9J1wiICsgYmVuZFkgKyBcIicgeD0nXCIgKyBiZW5kWCArIFwiJy8+XFxuXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGVuZCB5PSdcIiArIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWSArIFwiJyB4PSdcIiArXHJcbiAgICAgICAgICAgIGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWCArIFwiJy8+XFxuXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2FyYz5cXG5cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNiZ25tbFRleHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XHJcbiAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgLSBoZWlnaHQvMjtcclxuICAgICAgICByZXR1cm4gXCI8YmJveCB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICtcclxuICAgICAgICAgICAgXCInIHc9J1wiICsgd2lkdGggKyBcIicgaD0nXCIgKyBoZWlnaHQgKyBcIicgLz5cXG5cIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVBbmRJbmZvQmJveCA6IGZ1bmN0aW9uKG5vZGUsIGJveEdseXBoKXtcclxuICAgICAgICBib3hCYm94ID0gYm94R2x5cGguYmJveDtcclxuXHJcbiAgICAgICAgdmFyIHggPSBib3hCYm94LnggLyAxMDAgKiBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIHkgPSBib3hCYm94LnkgLyAxMDAgKiBub2RlLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgKHggLSBib3hCYm94LncvMik7XHJcbiAgICAgICAgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArICh5IC0gYm94QmJveC5oLzIpO1xyXG4gICAgICAgIHJldHVybiBcIjxiYm94IHk9J1wiICsgeSArIFwiJyB4PSdcIiArIHggK1xyXG4gICAgICAgICAgICBcIicgdz0nXCIgKyBib3hCYm94LncgKyBcIicgaD0nXCIgKyBib3hCYm94LmggKyBcIicgLz5cXG5cIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkUG9ydCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgdmFyIHBvcnRzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgcG9ydHMubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArIHBvcnRzW2ldLnkgKiBub2RlLmhlaWdodCgpIC8gMTAwO1xyXG5cclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxwb3J0IGlkPSdcIiArIHBvcnRzW2ldLmlkICtcclxuICAgICAgICAgICAgICAgIFwiJyB5PSdcIiArIHkgKyBcIicgeD0nXCIgKyB4ICsgXCInIC8+XFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzYmdubWxUZXh0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRMYWJlbCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zYmdubGFiZWw7XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBsYWJlbCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIHRleHQ9J1wiICsgbGFiZWwgKyBcIicgLz5cXG5cIjtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVCb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPGdseXBoIGlkPSdcIiArIG5vZGUuaWQgKyBcIicgY2xhc3M9J3N0YXRlIHZhcmlhYmxlJz5cXG5cIjtcclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHN0YXRlIFwiO1xyXG5cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YWx1ZSAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInZhbHVlPSdcIiArIG5vZGUuc3RhdGUudmFsdWUgKyBcIicgXCI7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCJ2YXJpYWJsZT0nXCIgKyBub2RlLnN0YXRlLnZhcmlhYmxlICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgbWFpbkdseXBoKXtcclxuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8Z2x5cGggaWQ9J1wiICsgbm9kZS5pZCArIFwiJyBjbGFzcz0ndW5pdCBvZiBpbmZvcm1hdGlvbic+XFxuXCI7XHJcbiAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcIjxsYWJlbCBcIjtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUubGFiZWwudGV4dCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc2Jnbm1sVGV4dCA9IHNiZ25tbFRleHQgKyBcInRleHQ9J1wiICsgbm9kZS5sYWJlbC50ZXh0ICsgXCInIFwiO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCIvPlxcblwiO1xyXG5cclxuICAgICAgICBzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpO1xyXG4gICAgICAgIHNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8L2dseXBoPlxcblwiO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Jnbm1sVGV4dDtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvblRvU2Jnbm1sO1xyXG4iLCJ2YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcclxudmFyIHNiZ25TdHlsZVJ1bGVzID0gcmVxdWlyZSgnLi4vLi4vc2FtcGxlLWFwcC9qcy9jb21tb24tYXBwLXV0aWxpdGllcycpLnNiZ25TdHlsZVJ1bGVzO1xyXG5cclxudmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0ge1xyXG4gICAgLy90aGUgbGlzdCBvZiB0aGUgZWxlbWVudCBjbGFzc2VzIGhhbmRsZWQgYnkgdGhlIHRvb2xcclxuICAgIGhhbmRsZWRFbGVtZW50czoge1xyXG4gICAgICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZSxcclxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAgICAgJ3Byb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAgICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncGhlbm90eXBlJzogdHJ1ZSxcclxuICAgICAgICAndGFnJzogdHJ1ZSxcclxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxyXG4gICAgICAgICdwcm9kdWN0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnbW9kdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnY2F0YWx5c2lzJzogdHJ1ZSxcclxuICAgICAgICAnaW5oaWJpdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2xvZ2ljIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2VxdWl2YWxlbmNlIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ29yIG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnbm90IG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnYW5kJzogdHJ1ZSxcclxuICAgICAgICAnb3InOiB0cnVlLFxyXG4gICAgICAgICdub3QnOiB0cnVlLFxyXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGFydG1lbnQnOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcclxuICAgIHByb2Nlc3NUeXBlcyA6IFsncHJvY2VzcycsICdvbWl0dGVkIHByb2Nlc3MnLCAndW5jZXJ0YWluIHByb2Nlc3MnLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncGhlbm90eXBlJ10sXHJcbiAgICAgIFxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vdGhpcyBtZXRob2QgcmV0dXJucyB0aGUgbm9kZXMgbm9uIG9mIHdob3NlIGFuY2VzdG9ycyBpcyBub3QgaW4gZ2l2ZW4gbm9kZXNcclxuICAgIGdldFRvcE1vc3ROb2RlczogZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub2Rlc01hcFtub2Rlc1tpXS5pZCgpXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb290cyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcclxuICAgICAgICAgICAgICBpZihub2Rlc01hcFtwYXJlbnQuaWQoKV0pe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb290cztcclxuICAgIH0sXHJcbiAgICAvL1RoaXMgbWV0aG9kIGNoZWNrcyBpZiBhbGwgb2YgdGhlIGdpdmVuIG5vZGVzIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFzc3VtaW5nIHRoYXQgdGhlIHNpemUgXHJcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxyXG4gICAgYWxsSGF2ZVRoZVNhbWVQYXJlbnQ6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVzWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhKFwicGFyZW50XCIpICE9IHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIG1vdmVOb2RlczogZnVuY3Rpb24ocG9zaXRpb25EaWZmLCBub2Rlcywgbm90Q2FsY1RvcE1vc3ROb2Rlcykge1xyXG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcE1vc3ROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gdG9wTW9zdE5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XHJcbiAgICAgICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKFwieVwiKTtcclxuICAgICAgICBub2RlLnBvc2l0aW9uKHtcclxuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcclxuICAgICAgICAgIHk6IG9sZFkgKyBwb3NpdGlvbkRpZmYueVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLm1vdmVOb2Rlcyhwb3NpdGlvbkRpZmYsIGNoaWxkcmVuLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnZlcnRUb01vZGVsUG9zaXRpb246IGZ1bmN0aW9uIChyZW5kZXJlZFBvc2l0aW9uKSB7XHJcbiAgICAgIHZhciBwYW4gPSBjeS5wYW4oKTtcclxuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XHJcblxyXG4gICAgICB2YXIgeCA9IChyZW5kZXJlZFBvc2l0aW9uLnggLSBwYW4ueCkgLyB6b29tO1xyXG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHlcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXHJcbiAgICBcclxuICAgIGdldFByb2Nlc3Nlc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHNlbGVjdGVkRWxlcyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qoc2VsZWN0ZWRFbGVzKTtcclxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRFbGVzO1xyXG4gICAgfSxcclxuICAgIGdldE5laWdoYm91cnNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxlY3RlZEVsZXMgPSBjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKTtcclxuICAgICAgICBzZWxlY3RlZEVsZXMgPSBzZWxlY3RlZEVsZXMuYWRkKHNlbGVjdGVkRWxlcy5wYXJlbnRzKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKSk7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gc2VsZWN0ZWRFbGVzLmFkZChzZWxlY3RlZEVsZXMuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgdmFyIG5laWdoYm9yaG9vZEVsZXMgPSBzZWxlY3RlZEVsZXMubmVpZ2hib3Job29kKCk7XHJcbiAgICAgICAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IHNlbGVjdGVkRWxlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XHJcbiAgICAgICAgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlc1RvSGlnaGxpZ2h0LmFkZChlbGVzVG9IaWdobGlnaHQuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb0hpZ2hsaWdodDtcclxuICAgIH0sXHJcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgLy8gdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtzYmduY2xhc3M9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW3NiZ25jbGFzcyE9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtzYmduY2xhc3M9J3Byb2Nlc3MnXVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMuX3ByaXZhdGUuZGF0YS5zYmduY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPT09IC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKS5maWx0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLl9wcml2YXRlLmRhdGEuc2JnbmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPj0gMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQocHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcyk7XHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xyXG5cclxuICAgICAgICAvL2FkZCBwYXJlbnRzXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5wYXJlbnRzKCkpO1xyXG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW3NiZ25jbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XHJcbiAgICB9LFxyXG4gICAgZXh0ZW5kUmVtYWluaW5nTm9kZXMgOiBmdW5jdGlvbihub2Rlc1RvRmlsdGVyLCBhbGxOb2Rlcyl7XHJcbiAgICAgICAgbm9kZXNUb0ZpbHRlciA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0ZpbHRlcik7XHJcbiAgICAgICAgdmFyIG5vZGVzVG9TaG93ID0gYWxsTm9kZXMubm90KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlc1RvU2hvdyk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIG5vbmVJc05vdEhpZ2hsaWdodGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZEVkZ2VzID0gY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lZGdlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBFbGVtZW50IEZpbHRlcmluZyBVdGlsaXRpZXNcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIFxyXG4gICAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgICAgZWxlcy5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXM7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICByZXR1cm4gZWxlcy5yZW1vdmUoKTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVFbGVzU21hcnQ6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgdmFyIG5vZGVzVG9LZWVwID0gdGhpcy5leHRlbmRSZW1haW5pbmdOb2RlcyhlbGVzLCBhbGxOb2Rlcyk7XHJcbiAgICAgIHZhciBub2Rlc05vdFRvS2VlcCA9IGFsbE5vZGVzLm5vdChub2Rlc1RvS2VlcCk7XHJcbiAgICAgIHJldHVybiBub2Rlc05vdFRvS2VlcC5yZW1vdmUoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcclxuICAgIFxyXG4gICAgaXNFUE5DbGFzczogZnVuY3Rpb24oc2JnbmNsYXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eSdcclxuICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnXHJcbiAgICAgICAgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBDb21tb24gZWxlbWVudCBwcm9wZXJ0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXHJcbiAgICBcclxuICAgIGdldEN5U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBzaGFwZSA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuICAgICAgICBpZiAoc2hhcGUuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIHNoYXBlID0gc2hhcGUucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNoYXBlID09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdyb3VuZHJlY3RhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAncGhlbm90eXBlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2hleGFnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGUgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IHNoYXBlID09ICd0YWcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncG9seWdvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFwZSA9PSAnc291cmNlIGFuZCBzaW5rJyB8fCBzaGFwZSA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IHNoYXBlID09ICdkaXNzb2NpYXRpb24nXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICdtYWNyb21vbGVjdWxlJyB8fCBzaGFwZSA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBzaGFwZSA9PSAnY29tcGxleCdcclxuICAgICAgICAgICAgfHwgc2hhcGUgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgc2hhcGUgPT0gJ3Byb2Nlc3MnIHx8IHNoYXBlID09ICdvbWl0dGVkIHByb2Nlc3MnXHJcbiAgICAgICAgICAgIHx8IHNoYXBlID09ICd1bmNlcnRhaW4gcHJvY2VzcycgfHwgc2hhcGUgPT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q3lBcnJvd1NoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWxlLmRhdGEoJ3NiZ25jbGFzcycpO1xyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdpbmhpYml0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RlZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdjaXJjbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaWFtb25kJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICdub25lJztcclxuICAgIH0sXHJcbiAgICBnZXRFbGVtZW50Q29udGVudDogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZS5kYXRhKCdzYmduY2xhc3MnKTtcclxuXHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcclxuICAgICAgICAgICAgc2JnbmNsYXNzID0gc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnXHJcbiAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5JyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IHNiZ25jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpID8gZWxlLmRhdGEoJ3NiZ25sYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzYmduY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jyl7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnc2JnbmxhYmVsJykgPyBlbGUuZGF0YSgnc2JnbmxhYmVsJykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNiZ25jbGFzcyA9PSAnY29tcGxleCcpe1xyXG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGUuZGF0YSgnc2JnbmxhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnc2JnbmxhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGVsZS5kYXRhKCdpbmZvTGFiZWwnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdhbmQnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnQU5EJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdvcicpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdPUic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnbm90Jykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ05PVCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ1xcXFxcXFxcJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICc/JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gZWxlLmNzcygnd2lkdGgnKSA/IHBhcnNlRmxvYXQoZWxlLmNzcygnd2lkdGgnKSkgOiBlbGUuZGF0YSgnc2JnbmJib3gnKS53O1xyXG5cclxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBjb250ZW50LFxyXG4gICAgICAgICAgICB3aWR0aDogKCBzYmduY2xhc3M9PSgnY29tcGxleCcpIHx8IHNiZ25jbGFzcz09KCdjb21wYXJ0bWVudCcpICk/dGV4dFdpZHRoICogMjp0ZXh0V2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZm9udCA9IHRoaXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcclxuICAgIH0sXHJcbiAgICBnZXRMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGUuZGF0YSgnc2JnbmNsYXNzJyk7XHJcblxyXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzYmduY2xhc3MgPT09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PT0gJ29yJyB8fCBzYmduY2xhc3MgPT09ICdub3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCAxLjUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2JnbmNsYXNzID09PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgfSxcclxuICAgIGdldER5bmFtaWNMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlLCBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQpIHtcclxuICAgICAgdmFyIGR5bmFtaWNMYWJlbFNpemUgPSBzYmduU3R5bGVSdWxlc1snZHluYW1pYy1sYWJlbC1zaXplJ107XHJcblxyXG4gICAgICBpZiAoZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAnc21hbGwnKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdyZWd1bGFyJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAnbGFyZ2UnKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIGggPSBlbGUuaGVpZ2h0KCk7XHJcbiAgICAgIHZhciB0ZXh0SGVpZ2h0ID0gcGFyc2VJbnQoaCAvIDIuNDUpICogZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50O1xyXG5cclxuICAgICAgcmV0dXJuIHRleHRIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHZhciBzcmNQb3MgPSBlbGUuc291cmNlKCkucG9zaXRpb24oKTtcclxuICAgICAgICB2YXIgdGd0UG9zID0gZWxlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdygoc3JjUG9zLnggLSB0Z3RQb3MueCksIDIpICsgTWF0aC5wb3coKHNyY1Bvcy55IC0gdGd0UG9zLnkpLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmduRWxlbWVudFV0aWxpdGllcztcclxuIiwidmFyIHNiZ25FbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9zYmduLWVsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgc2Jnbm1sVG9Kc29uID0ge1xyXG4gIGluc2VydGVkTm9kZXM6IHt9LFxyXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IFtdO1xyXG4gICAgJCh4bWxPYmplY3QpLmZpbmQoXCJnbHlwaFtjbGFzcz0nY29tcGFydG1lbnQnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29tcGFydG1lbnRzLnB1c2goe1xyXG4gICAgICAgICd4JzogcGFyc2VGbG9hdCgkKHRoaXMpLmNoaWxkcmVuKCdiYm94JykuYXR0cigneCcpKSxcclxuICAgICAgICAneSc6IHBhcnNlRmxvYXQoJCh0aGlzKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3knKSksXHJcbiAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KCQodGhpcykuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd3JykpLFxyXG4gICAgICAgICdoJzogcGFyc2VGbG9hdCgkKHRoaXMpLmNoaWxkcmVuKCdiYm94JykuYXR0cignaCcpKSxcclxuICAgICAgICAnaWQnOiAkKHRoaXMpLmF0dHIoJ2lkJylcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb21wYXJ0bWVudHMuc29ydChmdW5jdGlvbiAoYzEsIGMyKSB7XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA8IGMyLmggKiBjMi53KVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGNvbXBhcnRtZW50cztcclxuICB9LFxyXG4gIGlzSW5Cb3VuZGluZ0JveDogZnVuY3Rpb24gKGJib3gxLCBiYm94Mikge1xyXG4gICAgaWYgKGJib3gxLnggPiBiYm94Mi54ICYmXHJcbiAgICAgICAgYmJveDEueSA+IGJib3gyLnkgJiZcclxuICAgICAgICBiYm94MS54ICsgYmJveDEudyA8IGJib3gyLnggKyBiYm94Mi53ICYmXHJcbiAgICAgICAgYmJveDEueSArIGJib3gxLmggPCBiYm94Mi55ICsgYmJveDIuaClcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBiYm94UHJvcDogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIHNiZ25iYm94ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgIHNiZ25iYm94LnggPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3gnKTtcclxuICAgIHNiZ25iYm94LnkgPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3knKTtcclxuICAgIHNiZ25iYm94LncgPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ3cnKTtcclxuICAgIHNiZ25iYm94LmggPSAkKGVsZSkuZmluZCgnYmJveCcpLmF0dHIoJ2gnKTtcclxuXHJcbiAgICAvL3NldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBzYmduYmJveC54ID0gcGFyc2VGbG9hdChzYmduYmJveC54KSArIHBhcnNlRmxvYXQoc2JnbmJib3gudykgLyAyO1xyXG4gICAgc2JnbmJib3gueSA9IHBhcnNlRmxvYXQoc2JnbmJib3gueSkgKyBwYXJzZUZsb2F0KHNiZ25iYm94LmgpIC8gMjtcclxuXHJcbiAgICByZXR1cm4gc2JnbmJib3g7XHJcbiAgfSxcclxuICBzdGF0ZUFuZEluZm9CYm94UHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XHJcbiAgICB2YXIgeVBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC55KTtcclxuXHJcbiAgICB2YXIgc2JnbmJib3ggPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgc2JnbmJib3gueCA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigneCcpO1xyXG4gICAgc2JnbmJib3gueSA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigneScpO1xyXG4gICAgc2JnbmJib3gudyA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cigndycpO1xyXG4gICAgc2JnbmJib3guaCA9ICQoZWxlKS5maW5kKCdiYm94JykuYXR0cignaCcpO1xyXG5cclxuICAgIC8vc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcclxuICAgIHNiZ25iYm94LnggPSBwYXJzZUZsb2F0KHNiZ25iYm94LngpICsgcGFyc2VGbG9hdChzYmduYmJveC53KSAvIDIgLSB4UG9zO1xyXG4gICAgc2JnbmJib3gueSA9IHBhcnNlRmxvYXQoc2JnbmJib3gueSkgKyBwYXJzZUZsb2F0KHNiZ25iYm94LmgpIC8gMiAtIHlQb3M7XHJcblxyXG4gICAgc2JnbmJib3gueCA9IHNiZ25iYm94LnggLyBwYXJzZUZsb2F0KHBhcmVudEJib3gudykgKiAxMDA7XHJcbiAgICBzYmduYmJveC55ID0gc2JnbmJib3gueSAvIHBhcnNlRmxvYXQocGFyZW50QmJveC5oKSAqIDEwMDtcclxuXHJcbiAgICByZXR1cm4gc2JnbmJib3g7XHJcbiAgfSxcclxuICBzdGF0ZUFuZEluZm9Qcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvQXJyYXkgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICAkKGVsZSkuY2hpbGRyZW4oJ2dseXBoJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBvYmogPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2NsYXNzJykgPT09ICd1bml0IG9mIGluZm9ybWF0aW9uJykge1xyXG4gICAgICAgIG9iai5pZCA9ICQodGhpcykuYXR0cignaWQnKTtcclxuICAgICAgICBvYmouY2xhenogPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAgICAgb2JqLmxhYmVsID0geyd0ZXh0JzogJCh0aGlzKS5maW5kKCdsYWJlbCcpLmF0dHIoJ3RleHQnKX07XHJcbiAgICAgICAgb2JqLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKHRoaXMsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2gob2JqKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICgkKHRoaXMpLmF0dHIoJ2NsYXNzJykgPT09ICdzdGF0ZSB2YXJpYWJsZScpIHtcclxuICAgICAgICBvYmouaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgb2JqLmNsYXp6ID0gJCh0aGlzKS5hdHRyKCdjbGFzcycpO1xyXG4gICAgICAgIG9iai5zdGF0ZSA9IHsndmFsdWUnOiAkKHRoaXMpLmZpbmQoJ3N0YXRlJykuYXR0cigndmFsdWUnKSxcclxuICAgICAgICAgICd2YXJpYWJsZSc6ICQodGhpcykuZmluZCgnc3RhdGUnKS5hdHRyKCd2YXJpYWJsZScpfTtcclxuICAgICAgICBvYmouYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AodGhpcywgcGFyZW50QmJveCk7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChvYmopO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gc3RhdGVBbmRJbmZvQXJyYXk7XHJcbiAgfSxcclxuICBhZGRQYXJlbnRJbmZvVG9Ob2RlOiBmdW5jdGlvbiAoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy90aGVyZSBpcyBubyBjb21wbGV4IHBhcmVudFxyXG4gICAgaWYgKHBhcmVudCA9PSBcIlwiKSB7XHJcbiAgICAgIC8vbm8gY29tcGFydG1lbnQgcmVmZXJlbmNlXHJcbiAgICAgIGlmICh0eXBlb2YgJChlbGUpLmF0dHIoJ2NvbXBhcnRtZW50UmVmJykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgbm9kZU9iai5wYXJlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL2FkZCBjb21wYXJ0bWVudCBhY2NvcmRpbmcgdG8gZ2VvbWV0cnlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcnRtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIGJib3ggPSB7XHJcbiAgICAgICAgICAgICd4JzogcGFyc2VGbG9hdCgkKGVsZSkuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCd4JykpLFxyXG4gICAgICAgICAgICAneSc6IHBhcnNlRmxvYXQoJChlbGUpLmNoaWxkcmVuKCdiYm94JykuYXR0cigneScpKSxcclxuICAgICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KCQoZWxlKS5jaGlsZHJlbignYmJveCcpLmF0dHIoJ3cnKSksXHJcbiAgICAgICAgICAgICdoJzogcGFyc2VGbG9hdCgkKGVsZSkuY2hpbGRyZW4oJ2Jib3gnKS5hdHRyKCdoJykpLFxyXG4gICAgICAgICAgICAnaWQnOiAkKGVsZSkuYXR0cignaWQnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcclxuICAgICAgICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudHNbaV0uaWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL3RoZXJlIGlzIGNvbXBhcnRtZW50IHJlZmVyZW5jZVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBub2RlT2JqLnBhcmVudCA9ICQoZWxlKS5hdHRyKCdjb21wYXJ0bWVudFJlZicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL3RoZXJlIGlzIGNvbXBsZXggcGFyZW50XHJcbiAgICBlbHNlIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICB9XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBub2RlT2JqID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgIC8vYWRkIGlkIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmlkID0gJChlbGUpLmF0dHIoJ2lkJyk7XHJcbiAgICAvL2FkZCBub2RlIGJvdW5kaW5nIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zYmduYmJveCA9IHNlbGYuYmJveFByb3AoZWxlKTtcclxuICAgIC8vYWRkIGNsYXNzIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLnNiZ25jbGFzcyA9ICQoZWxlKS5hdHRyKCdjbGFzcycpO1xyXG4gICAgLy9hZGQgbGFiZWwgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc2JnbmxhYmVsID0gJChlbGUpLmNoaWxkcmVuKCdsYWJlbCcpLmF0dHIoJ3RleHQnKTtcclxuICAgIC8vYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zYmduc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLnNiZ25iYm94KTtcclxuICAgIC8vYWRkaW5nIHBhcmVudCBpbmZvcm1hdGlvblxyXG4gICAgc2VsZi5hZGRQYXJlbnRJbmZvVG9Ob2RlKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xyXG5cclxuICAgIC8vYWRkIGNsb25lIGluZm9ybWF0aW9uXHJcbiAgICBpZiAoJChlbGUpLmNoaWxkcmVuKCdjbG9uZScpLmxlbmd0aCA+IDApXHJcbiAgICAgIG5vZGVPYmouc2JnbmNsb25lbWFya2VyID0gdHJ1ZTtcclxuICAgIGVsc2VcclxuICAgICAgbm9kZU9iai5zYmduY2xvbmVtYXJrZXIgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgdmFyIHBvcnRzID0gW107XHJcbiAgICAkKGVsZSkuZmluZCgncG9ydCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XHJcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KCQodGhpcykuYXR0cigneCcpKSAtIG5vZGVPYmouc2JnbmJib3gueDtcclxuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHBhcnNlRmxvYXQoJCh0aGlzKS5hdHRyKCd5JykpIC0gbm9kZU9iai5zYmduYmJveC55O1xyXG4gICAgICBcclxuICAgICAgcmVsYXRpdmVYUG9zID0gcmVsYXRpdmVYUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLnNiZ25iYm94LncpICogMTAwO1xyXG4gICAgICByZWxhdGl2ZVlQb3MgPSByZWxhdGl2ZVlQb3MgLyBwYXJzZUZsb2F0KG5vZGVPYmouc2JnbmJib3guaCkgKiAxMDA7XHJcbiAgICAgIFxyXG4gICAgICBwb3J0cy5wdXNoKHtcclxuICAgICAgICBpZDogJCh0aGlzKS5hdHRyKCdpZCcpLFxyXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcclxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBub2RlT2JqLnBvcnRzID0gcG9ydHM7XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZSA9IHtkYXRhOiBub2RlT2JqfTtcclxuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzTm9kZSk7XHJcbiAgfSxcclxuICB0cmF2ZXJzZU5vZGVzOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICBpZiAoIXNiZ25FbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1skKGVsZSkuYXR0cignY2xhc3MnKV0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzWyQoZWxlKS5hdHRyKCdpZCcpXSA9IHRydWU7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAvL2FkZCBjb21wbGV4IG5vZGVzIGhlcmVcclxuICAgIGlmICgkKGVsZSkuYXR0cignY2xhc3MnKSA9PT0gJ2NvbXBsZXgnIHx8ICQoZWxlKS5hdHRyKCdjbGFzcycpID09PSAnc3VibWFwJykge1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzTm9kZShlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xyXG5cclxuICAgICAgJChlbGUpLmNoaWxkcmVuKCdnbHlwaCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2NsYXNzJykgIT0gJ3N0YXRlIHZhcmlhYmxlJyAmJlxyXG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NsYXNzJykgIT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XHJcbiAgICAgICAgICBzZWxmLnRyYXZlcnNlTm9kZXModGhpcywganNvbkFycmF5LCAkKGVsZSkuYXR0cignaWQnKSwgY29tcGFydG1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xyXG4gICAgLy9zb3VyY2UgYW5kIHRhcmdldCBjYW4gYmUgaW5zaWRlIG9mIGEgcG9ydFxyXG4gICAgdmFyIHNvdXJjZSA9ICQoYXJjKS5hdHRyKCdzb3VyY2UnKTtcclxuICAgIHZhciB0YXJnZXQgPSAkKGFyYykuYXR0cigndGFyZ2V0Jyk7XHJcbiAgICB2YXIgc291cmNlTm9kZUlkLCB0YXJnZXROb2RlSWQ7XHJcblxyXG4gICAgJCh4bWxPYmplY3QpLmZpbmQoJ2dseXBoJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2lkJykgPT0gc291cmNlKSB7XHJcbiAgICAgICAgc291cmNlTm9kZUlkID0gc291cmNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2lkJykgPT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0Tm9kZUlkID0gdGFyZ2V0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZU5vZGVJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgJCh4bWxPYmplY3QpLmZpbmQoXCJwb3J0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2lkJykgPT0gc291cmNlKSB7XHJcbiAgICAgICAgICBzb3VyY2VOb2RlSWQgPSAkKHRoaXMpLnBhcmVudCgpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRhcmdldE5vZGVJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgJCh4bWxPYmplY3QpLmZpbmQoXCJwb3J0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2lkJykgPT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXROb2RlSWQgPSAkKHRoaXMpLnBhcmVudCgpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geydzb3VyY2UnOiBzb3VyY2VOb2RlSWQsICd0YXJnZXQnOiB0YXJnZXROb2RlSWR9O1xyXG4gIH0sXHJcbiAgZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gW107XHJcbiAgICBcclxuLy8gICAgJChlbGUpLmNoaWxkcmVuKCdzdGFydCwgbmV4dCwgZW5kJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAkKGVsZSkuY2hpbGRyZW4oJ25leHQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHBvc1ggPSAkKHRoaXMpLmF0dHIoJ3gnKTtcclxuICAgICAgdmFyIHBvc1kgPSAkKHRoaXMpLmF0dHIoJ3knKTtcclxuICAgICAgXHJcbiAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgeDogcG9zWCxcclxuICAgICAgICB5OiBwb3NZXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaChwb3MpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XHJcbiAgICBpZiAoIXNiZ25FbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1skKGVsZSkuYXR0cignY2xhc3MnKV0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBzb3VyY2VBbmRUYXJnZXQgPSBzZWxmLmdldEFyY1NvdXJjZUFuZFRhcmdldChlbGUsIHhtbE9iamVjdCk7XHJcbiAgICBcclxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgZWRnZU9iaiA9IG5ldyBPYmplY3QoKTtcclxuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWxmLmdldEFyY0JlbmRQb2ludFBvc2l0aW9ucyhlbGUpO1xyXG5cclxuICAgIGVkZ2VPYmouaWQgPSAkKGVsZSkuYXR0cignaWQnKTtcclxuICAgIGVkZ2VPYmouc2JnbmNsYXNzID0gJChlbGUpLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICBlZGdlT2JqLmJlbmRQb2ludFBvc2l0aW9ucyA9IGJlbmRQb2ludFBvc2l0aW9ucztcclxuXHJcbiAgICBpZiAoJChlbGUpLmZpbmQoJ2dseXBoJykubGVuZ3RoIDw9IDApIHtcclxuICAgICAgZWRnZU9iai5zYmduY2FyZGluYWxpdHkgPSAwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICQoZWxlKS5jaGlsZHJlbignZ2x5cGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdjbGFzcycpID09ICdjYXJkaW5hbGl0eScpIHtcclxuICAgICAgICAgIGVkZ2VPYmouc2JnbmNhcmRpbmFsaXR5ID0gJCh0aGlzKS5maW5kKCdsYWJlbCcpLmF0dHIoJ3RleHQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGVkZ2VPYmouc291cmNlID0gc291cmNlQW5kVGFyZ2V0LnNvdXJjZTtcclxuICAgIGVkZ2VPYmoudGFyZ2V0ID0gc291cmNlQW5kVGFyZ2V0LnRhcmdldDtcclxuXHJcbiAgICBlZGdlT2JqLnBvcnRzb3VyY2UgPSAkKGVsZSkuYXR0cihcInNvdXJjZVwiKTtcclxuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9ICQoZWxlKS5hdHRyKFwidGFyZ2V0XCIpO1xyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2UgPSB7ZGF0YTogZWRnZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xyXG4gIH0sXHJcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZXMgPSBbXTtcclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XHJcblxyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IHNlbGYuZ2V0QWxsQ29tcGFydG1lbnRzKHhtbE9iamVjdCk7XHJcblxyXG4gICAgJCh4bWxPYmplY3QpLmZpbmQoXCJtYXBcIikuY2hpbGRyZW4oJ2dseXBoJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYudHJhdmVyc2VOb2Rlcyh0aGlzLCBjeXRvc2NhcGVKc05vZGVzLCBcIlwiLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh4bWxPYmplY3QpLmZpbmQoXCJtYXBcIikuY2hpbGRyZW4oJ2FyYycpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZSh0aGlzLCBjeXRvc2NhcGVKc0VkZ2VzLCB4bWxPYmplY3QpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSBuZXcgT2JqZWN0KCk7XHJcbiAgICBjeXRvc2NhcGVKc0dyYXBoLm5vZGVzID0gY3l0b3NjYXBlSnNOb2RlcztcclxuICAgIGN5dG9zY2FwZUpzR3JhcGguZWRnZXMgPSBjeXRvc2NhcGVKc0VkZ2VzO1xyXG5cclxuICAgIHRoaXMuaW5zZXJ0ZWROb2RlcyA9IHt9O1xyXG5cclxuICAgIHJldHVybiBjeXRvc2NhcGVKc0dyYXBoO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2Jnbm1sVG9Kc29uOyIsInZhciBjb21tb25BcHBVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi8uLi9zYW1wbGUtYXBwL2pzL2NvbW1vbi1hcHAtdXRpbGl0aWVzJyk7XHJcbnZhciBzYmduU3R5bGVSdWxlcyA9IGNvbW1vbkFwcFV0aWxpdGllcy5zYmduU3R5bGVSdWxlcztcclxuXHJcbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xyXG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XHJcbiAgdHJ1bmNhdGVUZXh0OiBmdW5jdGlvbiAodGV4dFByb3AsIGZvbnQpIHtcclxuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY29udGV4dC5mb250ID0gZm9udDtcclxuICAgIHZhciBmaXRMYWJlbHNUb05vZGVzID0gc2JnblN0eWxlUnVsZXNbJ2ZpdC1sYWJlbHMtdG8tbm9kZXMnXTtcclxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcclxuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcclxuICAgIGlmIChmaXRMYWJlbHNUb05vZGVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHdpZHRoO1xyXG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xyXG4gICAgdmFyIHRleHRXaWR0aCA9ICh0ZXh0UHJvcC53aWR0aCA+IDMwKSA/IHRleHRQcm9wLndpZHRoIC0gMTAgOiB0ZXh0UHJvcC53aWR0aDtcclxuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xyXG4gICAgICAtLWxlbjtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGxlbikgKyBlbGxpcHNpcztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGV4dFV0aWxpdGllczsiXX0=

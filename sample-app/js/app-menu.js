var sbgnLayoutProp;
var sbgnProperties;
var pathsBetweenQuery;

$(document).ready(function ()
{
  console.log('init the sbgnviz template/page');

  sbgnLayoutProp = new SBGNLayout({el: '#sbgn-layout-table'});
  sbgnProperties = new SBGNProperties({el: '#sbgn-properties-table'});
  pathsBetweenQuery = new PathsBetweenQuery({el: '#query-pathsbetween-table'});

  toolbarButtonsAndMenu();

  loadSample('neuronal_muscle_signalling.xml');

  $(window).on('resize', dynamicResize);
  dynamicResize();

});

function expandSelected() {
  var nodes = cy.nodes(":selected").filter("[expanded-collapsed='collapsed']");
  if (nodes.expandableNodes().length==0) {
    return;
  }
  cy.undoRedo().do("expand", {
    nodes: nodes,
  });
}

function hideSelected() {
  var selectedEles = cy.$(":selected");
  if(selectedEles.length === 0){
    return;
  }
  cy.undoRedo().do("hide", selectedEles);
}

function showSelected() {
  if(cy.elements(":selected").length === cy.elements(':visible').length) {
    return;
  }
  cy.undoRedo().do("show", cy.elements(":selected"));
}

function collapseSelected() {
  var nodes = cy.nodes(":selected");
  if (nodes.collapsibleNodes().length==0) {
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

  sbgnNetworkContainer.on("click", ".biogene-info .expandable", function (evt) {
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

var startSpinner = function (id) {

  if ($('.' + id).length === 0) {
    var containerWidth = $('#sbgn-network-container').width();
    var containerHeight = $('#sbgn-network-container').height();
    $('#sbgn-network-container:parent').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw ' + id + '"></i>');
  }
};

var endSpinner = function (id) {
  if ($('.' + id).length > 0) {
    $('.' + id).remove();
  }
};

function setFileContent(fileName) {
  var span = document.getElementById('file-name');
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(document.createTextNode(fileName));
}

function loadSample(filename){
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
  $("#load-file-spinner").ready(function() {
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

function beforePerformLayout(){
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
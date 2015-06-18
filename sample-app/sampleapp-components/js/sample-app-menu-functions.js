var setFileContent = function(fileName){
    var span = document.getElementById('file-name');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode(fileName) );
}

$( document ).ready( function() {
    var xmlObject = loadXMLDoc('samples/activated_stat1alpha_induction_of_the_irf1_gene.xml');
    
    setFileContent("activated_stat1alpha_induction_of_the_irf1_gene.sbgnml");

    (new SBGNContainer({
        el: '#sbgn-network-container',
        model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
    })).render();

    var sbgnLayoutProp = new SBGNLayout({
        el: '#sbgn-layout-table'
    });
    

    $("body").on("change", "#file-input", function(e) {
        if ($("#file-input").val() == "") {
            return;
        }

        var fileInput = document.getElementById('file-input');
        var file = fileInput.files[0];
        var textType = /text.*/;

        var reader = new FileReader();

        reader.onload = function(e) {
            (new SBGNContainer({
                el: '#sbgn-network-container',
                model : {cytoscapeJsGraph : 
                    sbgnmlToJson.convert(textToXmlObject(this.result))}
            })).render();
        }
        reader.readAsText(file);
        setFileContent(file.name);
        $("#file-input").val("");
    });

    $("#node-legend").click(function(e){
        e.preventDefault();
        $.fancybox(
        _.template($("#node-legend-template").html(), {}),
        {
            'autoDimensions' : false,
            'width' : 420,
            'height' : 393,
            'transitionIn' : 'none',
            'transitionOut' : 'none',
        });
    });

    $("#edge-legend").click(function(e){
        e.preventDefault();
        $.fancybox(
        _.template($("#edge-legend-template").html(), {}),
        {
            'autoDimensions' : false,
            'width' : 400,
            'height' : 220,
            'transitionIn' : 'none',
            'transitionOut' : 'none',
        });
    });

	$("#quick-help").click(function(e){
		e.preventDefault();
		$.fancybox(
			_.template($("#quick-help-template").html(), {}),
			{
				'autoDimensions' : false,
				'width' : 420,
				'height' : "auto",
				'transitionIn' : 'none',
				'transitionOut' : 'none'
			});
	});

	$("#how-to-use").click(function(e) {
		var url = "http://www.cs.bilkent.edu.tr/~ivis/sbgnviz-js/SBGNViz.js-1.0.UG.pdf";
		var win = window.open(url, '_blank');
		win.focus();
	});

    $("#about").click(function(e){
        e.preventDefault();
        $.fancybox(
        _.template($("#about-template").html(), {}),
        {
            'autoDimensions' : false,
            'width' : 300,
            'height' : 320,
            'transitionIn' : 'none',
            'transitionOut' : 'none',
        });
    });

    $("#load-sample1").click(function(e){
        var xmlObject = loadXMLDoc('samples/activated_stat1alpha_induction_of_the_irf1_gene.xml');
        
        setFileContent("activated_stat1alpha_induction_of_the_irf1_gene.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#load-sample2").click(function(e){
        var xmlObject = loadXMLDoc('samples/glycolysis.xml');

        setFileContent("glycolysis.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#load-sample3").click(function(e){
        var xmlObject = loadXMLDoc('samples/mapk_cascade.xml');
        
        setFileContent("mapk_cascade.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#load-sample4").click(function(e){
        var xmlObject = loadXMLDoc('samples/polyq_proteins_interference.xml');
        
        setFileContent("polyq_proteins_interference.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#load-sample5").click(function(e){
        var xmlObject = loadXMLDoc('samples/insulin-like_growth_factor_signaling.xml');
        
        setFileContent("insulin-like_growth_factor_signaling.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#load-sample6").click(function(e){
        var xmlObject = loadXMLDoc('samples/atm_mediated_phosphorylation_of_repair_proteins.xml');
        
        setFileContent("atm_mediated_phosphorylation_of_repair_proteins.sbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });
    
    $("#load-sample7").click(function(e){
        var xmlObject = loadXMLDoc('samples/vitamins_b6_activation_to_pyridoxal_phosphate.xml');
        
        setFileContent("vitamins_b6_activation_to_pyridoxal_phosphatesbgnml");

        (new SBGNContainer({
            el: '#sbgn-network-container',
            model : {cytoscapeJsGraph : sbgnmlToJson.convert(xmlObject)}
        })).render();
    });

    $("#hide-selected").click(function(e){
        sbgnFiltering.hideSelected();
    });

    $("#show-selected").click(function(e){
        sbgnFiltering.showSelected();
    });

    $("#show-all").click(function(e){
        sbgnFiltering.showAll();
    });

    $("#delete-selected").click(function(e){
        sbgnFiltering.deleteSelected();
    });

    $("#neighbors-of-selected").click(function(e){
        sbgnFiltering.highlightNeighborsofSelected();
    });

    $("#processes-of-selected").click(function(e){
        sbgnFiltering.highlightProcessesOfSelected();
    });

    $("#remove-highlights").click(function(e){
        sbgnFiltering.removeHighlights();
    });

    $("#layout-properties").click(function(e){
        sbgnLayoutProp.render();
    });
    
    $("#sbgn-properties").click(function(e){
        sbgnProperties.render();
    });

    $("#perform-layout").click(function(e){
	    cy.nodes().removeData("ports");
	    cy.edges().removeData("portsource");
	    cy.edges().removeData("porttarget");

	    cy.nodes().data("ports", []);
	    cy.edges().data("portsource", []);
	    cy.edges().data("porttarget", []);

        sbgnLayoutProp.applyLayout();
    });

    $("#save-as-png").click(function(evt){               
      var pngContent = cy.png({scale : 3, full : true});

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
    
    $("#save-as-jpg").click(function(evt){               
      var pngContent = cy.jpg({scale : 3, full : true});

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

    $("#load-file").click(function(evt){
        $("#file-input").trigger('click');
    });

    $("#save-as-sbgnml").click(function(evt){
        var sbgnmlText = jsonToSbgnml.createSbgnml();

        var blob = new Blob([sbgnmlText], {
            type: "text/plain;charset=utf-8;",
        });
        var filename = document.getElementById('file-name').innerHTML;
        saveAs(blob, filename);
    });

    $("body").on("click", ".biogene-info .expandable", function(evt){
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

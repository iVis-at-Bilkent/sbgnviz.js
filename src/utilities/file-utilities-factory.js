/*
* File Utilities: To be used on read/write file operation
*/

var libUtilities = require('./lib-utilities');
var libs = libUtilities.getLibs();
var jQuery = $ = libs.jQuery;
var saveAs = libs.saveAs;
var textUtilities = require('./text-utilities');

module.exports = function () {
 // Helper functions Start
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

 function loadXMLDoc(fullFilePath) {
   if (window.XMLHttpRequest) {
     xhttp = new XMLHttpRequest();
   }
   else {
     xhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xhttp.overrideMimeType('application/xml');
   xhttp.open("GET", fullFilePath, false);
   xhttp.send();
   return xhttp.responseXML;
 }

 // Should this be exposed or should this be moved to the helper functions section?
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
 // Helper functions End

 var sbgnmlToJson, jsonToSbgnml, uiUtilities, tdToJson, graphUtilities;
 var updateGraph;
 var options, cy;

 function fileUtilities (param) {
   sbgnmlToJson = param.sbgnmlToJsonConverter;
   jsonToSbgnml = param.jsonToSbgnmlConverter;
   uiUtilities = param.uiUtilities;
   tdToJson = param.tdToJsonConverter;
   graphUtilities = param.graphUtilities;
   updateGraph = graphUtilities.updateGraph.bind(graphUtilities);
   options = param.optionUtilities.getOptions();
   cy = param.sbgnCyInstance.getCy();
 }

 fileUtilities.loadXMLDoc = loadXMLDoc;

 fileUtilities.saveAsPng = function(filename) {
   var pngContent = cy.png({scale: 3, full: true});

   // this is to remove the beginning of the pngContent: data:img/png;base64,
   var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
  
   // lower quality when response is empty
   if(!b64data || b64data === ""){
     pngContent = cy.png({maxWidth: 15000, maxHeight: 15000, full: true});
     b64data = pngContent.substr(pngContent.indexOf(",") + 1);
   }

   saveAs(b64toBlob(b64data, "image/png"), filename || "network.png");
 };

 fileUtilities.saveAsJpg = function(filename) {
   var jpgContent = cy.jpg({scale: 3, full: true});

   // this is to remove the beginning of the pngContent: data:img/png;base64,
   var b64data = jpgContent.substr(jpgContent.indexOf(",") + 1);
  
   // lower quality when response is empty
   if(!b64data || b64data === ""){
     jpgContent = cy.jpg({maxWidth: 15000, maxHeight: 15000, full: true});
     b64data = jpgContent.substr(jpgContent.indexOf(",") + 1);
   }

   saveAs(b64toBlob(b64data, "image/jpg"), filename || "network.jpg");
 };

 fileUtilities.saveAsSvg = function(filename) {
   var svgContent = cy.svg({scale: 1, full: true});
   saveAs(new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"}), filename || "network.svg");
 };

 fileUtilities.loadSample = function(filename, folderpath) {
   uiUtilities.startSpinner("load-spinner");

   // Users may want to do customized things while a sample is being loaded
   // Trigger an event for this purpose and specify the 'filename' as an event parameter
   $(document).trigger( "sbgnvizLoadSample", [ filename, cy ] ); // Aliases for sbgnvizLoadSampleStart
   $(document).trigger( "sbgnvizLoadSampleStart", [ filename, cy ] );

   // load xml document use default folder path if it is not specified
   var xmlObject = loadXMLDoc((folderpath || 'sample-app/samples/') + filename);

   setTimeout(function () {
     updateGraph(sbgnmlToJson.convert(xmlObject));
     // collapse nodes
     var nodesToCollapse = cy.nodes("[collapse]");
     if (nodesToCollapse.length > 0 ){
       cy.expandCollapse('get').collapse(nodesToCollapse, {layoutBy: null});

       nodesToCollapse.forEach(function(ele, i, eles){
         ele.position(ele.data("positionBeforeSaving"));
       });
       nodesToCollapse.removeData("positionBeforeSaving");
     }
     uiUtilities.endSpinner("load-spinner");
     $(document).trigger( "sbgnvizLoadSampleEnd", [ filename, cy ] ); // Trigger an event signaling that a sample is loaded
   }, 0);
 };


fileUtilities.loadTDFile = function(file, callback1){
  console.log( "Starting load td file...");

  var self = this;
  uiUtilities.startSpinner("load-file-spinner");

  var textType = /text.*/;

  var reader = new FileReader();

  reader.onload = function(e) {
    //Get the text result of the file.
    var text = this.result;

    setTimeout( function() {
      var graph;
      try{
        graph = tdToJson.convert(text);
        $( document ).trigger( "sbgnvizLoadFile", [ file.name, cy ] ); // Aliases for sbgnvizLoadFileStart

        $( document ).trigger( "sbgnvizLoadFileStart", [ file.name, cy ] ); 
      } catch (err){
        uiUtilities.endSpinner("load-file-spinner");
        console.log( "Error found in parsing");
        console.log(err);
        return;
      }
      if( !graph && typeof callback1 !== 'undefined') 
      {  
        uiUtilities.endSpinner("load-file-spinner");
        callback1();
        return;
      }else if( !graph)
      {
        uiUtilities.endSpinner("load-file-spinner");
        console.log( "Graph is not defined.");
        return;
      }

      updateGraph(graph);
      uiUtilities.endSpinner("load-file-spinner");
      $( document ).trigger( "sbgnvizLoadFileEnd", [ file.name, cy] ); // Trigger an event signaling that a file is loaded
        //console.log( "Load file end done...");
    }, 0);
  };
  reader.readAsText(file);
};
 /*
   callback is a function remotely defined to add specific behavior that isn't implemented here.
   it is completely optional.
   signature: callback(textXml)
 */
 fileUtilities.loadSBGNMLFile = function(file, callback1, callback2) {
   var self = this;
   uiUtilities.startSpinner("load-file-spinner");

   var textType = /text.*/;

   var reader = new FileReader();

   reader.onload = function (e) {
     var text = this.result;
    var matchResult = text.match("<renderInformation[^]*</renderInformation>");
    if(matchResult != null){
    var renderInfoString = matchResult[0];
    var renderInfoStringCopy = (' ' + renderInfoString).slice(1);
      const regex = /\s([\S]+)([\s]*)=/g;
      var result;
      var matches = []; 
      while(result = regex.exec(renderInfoString)) {
        matches.push(result[0]);
      };
      matches.forEach(function(match){
        renderInfoString = renderInfoString.replace(match , textUtilities.FromKebabToCamelCase(match));
      });      
      text = text.replace(renderInfoStringCopy, renderInfoString);
    }

     setTimeout(function () {
       
       if (typeof callback1 !== 'undefined') callback1(text);

       var cyGraph;
       try {
         cyGraph = sbgnmlToJson.convert(textToXmlObject(text));
         // Users may want to do customized things while an external file is being loaded
         // Trigger an event for this purpose and specify the 'filename' as an event parameter
         $(document).trigger( "sbgnvizLoadFile", [ file.name, cy ] ); // Aliases for sbgnvizLoadFileStart
         $(document).trigger( "sbgnvizLoadFileStart", [ file.name, cy ] );
       }
       catch (err) {
         uiUtilities.endSpinner("load-file-spinner");
         console.log(err);
         if (typeof callback2 !== 'undefined') callback2();
         return;
       }

       updateGraph(cyGraph);
       // collapse nodes
       var nodesToCollapse = cy.nodes("[collapse]");
       if (nodesToCollapse.length > 0 ){
         cy.expandCollapse('get').collapse(nodesToCollapse, {layoutBy: null});

         nodesToCollapse.forEach(function(ele, i, eles){
           ele.position(ele.data("positionBeforeSaving"));
         });
         nodesToCollapse.removeData("positionBeforeSaving");
       }
       uiUtilities.endSpinner("load-file-spinner");
       $(document).trigger( "sbgnvizLoadFileEnd", [ file.name, cy ] ); // Trigger an event signaling that a file is loaded
     }, 0);
   };

   reader.readAsText(file);
 };

 fileUtilities.loadSBGNMLText = function(textData, tileInfoBoxes){
     setTimeout(function () {
         updateGraph(sbgnmlToJson.convert(textToXmlObject(textData)), undefined, undefined, tileInfoBoxes);
         uiUtilities.endSpinner("load-file-spinner");
     }, 0);

 };

 // supported versions are either 0.2 or 0.3
 fileUtilities.saveAsSbgnml = function(filename, version, renderInfo, mapProperties) {
   var sbgnmlText = jsonToSbgnml.createSbgnml(filename, version, renderInfo, mapProperties);
   var blob = new Blob([sbgnmlText], {
     type: "text/plain;charset=utf-8;",
   });
   saveAs(blob, filename);
 };

 fileUtilities.convertSbgnmlTextToJson = function(sbgnmlText){
     return sbgnmlToJson.convert(textToXmlObject(sbgnmlText));
 };

 fileUtilities.createJson = function(json){
     var sbgnmlText = jsonToSbgnml.createSbgnml();
     return sbgnmlToJson.convert(textToXmlObject(sbgnmlText));
 };

 return fileUtilities;
};

/*
* File Utilities: To be used on read/write file operation
*/

var libUtilities = require('./lib-utilities');
var libs = libUtilities.getLibs();
var jQuery = $ = libs.jQuery;
var saveAs = libs.saveAs;

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

 var sbgnmlToJson, jsonToSbgnml, uiUtilities, graphUtilities;
 var updateGraph;
 var options, cy;

 function fileUtilities (param) {
   sbgnmlToJson = param.sbgnmlToJsonConverter;
   jsonToSbgnml = param.jsonToSbgnmlConverter;
   uiUtilities = param.uiUtilities;
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
   saveAs(b64toBlob(b64data, "image/png"), filename || "network.png");
 };

 fileUtilities.saveAsJpg = function(filename) {
   var jpgContent = cy.jpg({scale: 3, full: true});

   // this is to remove the beginning of the pngContent: data:img/png;base64,
   var b64data = jpgContent.substr(jpgContent.indexOf(",") + 1);
   saveAs(b64toBlob(b64data, "image/jpg"), filename || "network.jpg");
 };

 fileUtilities.saveAsSvg = function(filename) {
   var svgContent = cy.svg({scale: 1, full: true});
   saveAs(new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"}), filename || "network.svg");
 };

 fileUtilities.loadSample = function(filename, folderpath) {
   uiUtilities.startSpinner("load-spinner");

   var networkContainer = $(options.networkContainerSelector);

   // Users may want to do customized things while a sample is being loaded
   // Trigger an event for this purpose and specify the 'filename' as an event parameter
   networkContainer.trigger( "sbgnvizLoadSample", [ filename ] ); // Aliases for sbgnvizLoadSampleStart
   networkContainer.trigger( "sbgnvizLoadSampleStart", [ filename ] );

   // load xml document use default folder path if it is not specified
   var xmlObject = loadXMLDoc((folderpath || 'sample-app/samples/') + filename);

   setTimeout(function () {
     updateGraph(sbgnmlToJson.convert(xmlObject));
     // collapse nodes
     if (cy.nodes("[collapse]").length > 0 ){
       cy.expandCollapse('get').collapse(cy.nodes("[collapse]", {layoutBy: null}));
     }
     uiUtilities.endSpinner("load-spinner");
     networkContainer.trigger( "sbgnvizLoadSampleEnd", [ filename ] ); // Trigger an event signaling that a sample is loaded
   }, 0);
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

     setTimeout(function () {
       var networkContainer = $(options.networkContainerSelector);

       if (typeof callback1 !== 'undefined') callback1(text);

       var cyGraph;
       try {
         cyGraph = sbgnmlToJson.convert(textToXmlObject(text));
         // Users may want to do customized things while an external file is being loaded
         // Trigger an event for this purpose and specify the 'filename' as an event parameter
         networkContainer.trigger( "sbgnvizLoadFile", [ file.name ] ); // Aliases for sbgnvizLoadFileStart
         networkContainer.trigger( "sbgnvizLoadFileStart", [ file.name ] );
       }
       catch (err) {
         uiUtilities.endSpinner("load-file-spinner");
         console.log(err);
         if (typeof callback2 !== 'undefined') callback2();
         return;
       }

       updateGraph(cyGraph);
       // collapse nodes
       if (cy.nodes("[collapse]").length > 0 ){
         cy.expandCollapse('get').collapse(cy.nodes("[collapse]"), {layoutBy: null});
       }
       uiUtilities.endSpinner("load-file-spinner");
       networkContainer.trigger( "sbgnvizLoadFileEnd", [ file.name ] ); // Trigger an event signaling that a file is loaded
     }, 0);
   };

   reader.readAsText(file);
 };

 fileUtilities.loadSBGNMLText = function(textData){
     setTimeout(function () {
         updateGraph(sbgnmlToJson.convert(textToXmlObject(textData)));
         uiUtilities.endSpinner("load-file-spinner");
     }, 0);

 };

 fileUtilities.saveAsSbgnml = function(filename, renderInfo, mapProperties) {
   var sbgnmlText = jsonToSbgnml.createSbgnml(filename, renderInfo, mapProperties);
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

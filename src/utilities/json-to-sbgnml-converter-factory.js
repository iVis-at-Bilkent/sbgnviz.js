
var libsbgnjs = require('libsbgn.js');
var renderExtension = libsbgnjs.render;
var annot = libsbgnjs.annot;
var pkgVersion = require('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = require('../../package.json').name;
var prettyprint = require('pretty-data').pd;
var xml2js = require('xml2js');
var mapPropertiesBuilder = new xml2js.Builder({rootName: "mapProperties"});
var textUtilities = require('./text-utilities');

module.exports = function () {
  var elementUtilities, graphUtilities;
  var cy;

  /*
      takes renderInfo as an optional argument. It contains all the information needed to save
      the style and colors to the render extension. See newt/app-utilities getAllStyles()
      Structure: {
          background: the map background color,
          colors: {
            validXmlValue: color_id
            ...
          },
          styles: {
              styleKey1: {
                  idList: list of the nodes ids that have this style
                  properties: {
                      fontSize: ...
                      fill: ...
                      ...
                  }
              }
              styleKey2: ...
              ...
          }
      }
  */
  function jsonToSbgnml (param) {
    elementUtilities = param.elementUtilities;
    graphUtilities = param.graphUtilities;
    cy = param.sbgnCyInstance.getCy();
  }

  jsonToSbgnml.createSbgnml = function(filename, renderInfo, mapProperties){
    var self = this;
    var mapID = textUtilities.getXMLValidId(filename);
    var hasExtension = false;
    var hasRenderExtension = false;
    this.allCollapsedNodes = cy.expandCollapse('get').getAllCollapsedChildrenRecursively().filter("node");
    this.allCollapsedEdges = cy.expandCollapse('get').getAllCollapsedChildrenRecursively().filter("edge");

    if (typeof renderInfo !== 'undefined') {
       hasExtension = true;
       hasRenderExtension = true;
    }

    var mapLanguage;
    if(elementUtilities.mapType == "PD") {
       mapLanguage = "process description";
    }
    else if(elementUtilities.mapType == "AF") {
       mapLanguage = "activity flow";
    }
    else {
       // case of a mixed map with bits of AF and PD for example
       mapLanguage = "unknown";
    }

    //add headers
    xmlHeader = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
    var sbgn = new libsbgnjs.Sbgn({xmlns: 'http://sbgn.org/libsbgn/0.3'});
    var map = new libsbgnjs.Map({language: mapLanguage, id: mapID});
    if (hasExtension) { // extension is there
       var extension = new libsbgnjs.Extension();
       if (hasRenderExtension) {
           extension.add(self.getRenderExtensionSbgnml(renderInfo));
       }
       map.setExtension(extension);
       if (mapProperties) {
           var xml = mapPropertiesBuilder.buildObject(mapProperties);
           map.extension.add(xml);
       }

    } else if (mapProperties) {
       map.setExtension(new libsbgnjs.Extension());
       map.extension.add(mapPropertiesBuilder.buildObject(mapProperties));
    }

    // get all glyphs
    var glyphList = [];
    // be careful that :visible is also used during recursive search of nodes
    // in the getGlyphSbgnml function. If not set accordingly, discrepancies will occur.
    cy.nodes().each(function(ele, i){
       if(typeof ele === "number") {
         ele = i;
       }
       if(!ele.isChild())
           glyphList = glyphList.concat(self.getGlyphSbgnml(ele)); // returns potentially more than 1 glyph
    });
    // add them to the map
    for(var i=0; i<glyphList.length; i++) {
       map.addGlyph(glyphList[i]);
    }
    // get all arcs
    var edges = this.allCollapsedEdges.union(cy.edges());
    edges.each(function(ele, i){
       if(typeof ele === "number") {
         ele = i;
       }
       map.addArc(self.getArcSbgnml(ele));
    });

    sbgn.addMap(map);
    return prettyprint.xml(xmlHeader + sbgn.toXML());
  };

  // see createSbgnml for info on the structure of renderInfo
  jsonToSbgnml.getRenderExtensionSbgnml = function(renderInfo) {
      // initialize the main container
      var renderInformation = new renderExtension.RenderInformation({ id: 'renderInformation',
                                                                      backgroundColor: renderInfo.background,
                                                                      programName: pkgName,
                                                                      programVersion: pkgVersion });

      // populate list of colors
      var listOfColorDefinitions = new renderExtension.ListOfColorDefinitions();
      for (var color in renderInfo.colors) {
          var colorDefinition = new renderExtension.ColorDefinition({id: renderInfo.colors[color], value: color});
          listOfColorDefinitions.addColorDefinition(colorDefinition);
      }
      renderInformation.setListOfColorDefinitions(listOfColorDefinitions);

      // populates styles
      var listOfStyles = new renderExtension.ListOfStyles();
      for (var key in renderInfo.styles) {
          var style = renderInfo.styles[key];
          var xmlStyle = new renderExtension.Style({id: textUtilities.getXMLValidId(key), idList: style.idList.join(' ')});
          var g = new renderExtension.RenderGroup({
              fontSize: style.properties.fontSize,
              fontFamily: style.properties.fontFamily,
              fontWeight: style.properties.fontWeight,
              fontStyle: style.properties.fontStyle,
              fill: style.properties.fill, // fill color
              stroke: style.properties.stroke, // stroke color
              strokeWidth: style.properties.strokeWidth
          });
          xmlStyle.setRenderGroup(g);
          listOfStyles.addStyle(xmlStyle);
      }
      renderInformation.setListOfStyles(listOfStyles);

      return renderInformation;
  };

  jsonToSbgnml.getAnnotationExtension = function(cyElement) {
      var annotations = cyElement.data('annotations');
      var annotExt = new annot.Annotation();
      var rdfElement = new annot.RdfElement();
      for (var annotID in annotations) {
          var currentAnnot = annotations[annotID];

          // check validity of annotation
          if(currentAnnot.status != 'validated' || !currentAnnot.selectedDB || !currentAnnot.annotationValue) {
              continue;
          }

          // check if uncontrolled vocabulary
          if(currentAnnot.selectedRelation == "sio:SIO_000223") {
              var obj = {};
              obj[currentAnnot.selectedDB] = currentAnnot.annotationValue;
              rdfElement.addCustomProperty('#'+cyElement.data('id') , obj);
          }
          else {
              var obj = {};
              obj[currentAnnot.selectedRelation] = currentAnnot.annotationValue;
              rdfElement.addResource('#'+cyElement.data('id') , obj);
          }
      }
      annotExt.setRdfElement(rdfElement);
      return annotExt;
  };

  jsonToSbgnml.getGlyphSbgnml = function(node){
    var self = this;
    var nodeClass = node._private.data.class;
    var glyphList = [];

    if( nodeClass.startsWith('BA')) {
       nodeClass = "biological activity";
    }

    var glyph = new libsbgnjs.Glyph({id: node._private.data.id, class_: nodeClass});

    // assign compartmentRef
    if(node.parent() && node.parent().length > 0){
       if(nodeClass === "compartment"){
           var parent = node.parent();
           glyph.compartmentRef = node._private.data.parent;
       }
       else {
           var parent = node.parent()[0];
           if(parent._private.data.class == "compartment")
               glyph.compartmentRef = parent._private.data.id;
       }
    }

    // misc information
    var label = node._private.data.label;
    if(typeof label != 'undefined')
       glyph.setLabel(new libsbgnjs.Label({text: label}));
    //add clone information
    if(typeof node._private.data.clonemarker != 'undefined')
       glyph.setClone(new libsbgnjs.CloneType());
    //add bbox information
    glyph.setBbox(this.addGlyphBbox(node));
    //add port information
    var ports = node._private.data.ports;
    for(var i = 0 ; i < ports.length ; i++){
       var orientation = ports[i].x === 0 ? 'vertical' : 'horizontal';
       // This is the ratio of the area occupied for ports over the whole shape
       var ratio = orientation === 'vertical' ? Math.abs(ports[i].y) / 50 : Math.abs(ports[i].x) / 50;

       // Divide the node sizes by the ratio because that sizes includes ports as well
       var x = node._private.position.x + ports[i].x * ( node.width() / ratio ) / 100;
       var y = node._private.position.y + ports[i].y * ( node.height() / ratio ) / 100;

       glyph.addPort(new libsbgnjs.Port({id: ports[i].id, x: x, y: y}));
    }
    //add state and info box information
    for(var i = 0 ; i < node._private.data.statesandinfos.length ; i++){
       var boxGlyph = node._private.data.statesandinfos[i];
       var statesandinfosId = node._private.data.id+"_"+i;
       if(boxGlyph.clazz === "state variable"){
           glyph.addGlyphMember(this.addStateBoxGlyph(boxGlyph, statesandinfosId, node));
       }
       else if(boxGlyph.clazz === "unit of information"){
           glyph.addGlyphMember(this.addInfoBoxGlyph(boxGlyph, statesandinfosId, node));
       }
    }
    // check for annotations
    if (node.data('annotations') && !$.isEmptyObject(node.data('annotations'))) {
       var extension = self.getOrCreateExtension(glyph);
       var annotExt = self.getAnnotationExtension(node);
       extension.add(annotExt);
    }
    // add glyph members that are not state variables or unit of info: subunits
    if(nodeClass === "complex" || nodeClass === "complex multimer" || nodeClass === "submap"){
       var children = node.children();
       children = children.union(this.allCollapsedNodes);
       if(node.data('collapsedChildren')) {
         var collapsedChildren = node.data('collapsedChildren');
         children = children.union(collapsedChildren);
       }
       children = children.filter("[parent = '"+ node.id() + "']")

       children.each(function(ele, i){
           if(typeof ele === "number") {
             ele = i;
           }
           var glyphMemberList = self.getGlyphSbgnml(ele);
           for (var i=0; i < glyphMemberList.length; i++) {
               glyph.addGlyphMember(glyphMemberList[i]);
           }
       });
    }

    var sbgnvizExtString = "";
    var hasNewtExt = false;

    // add info for collapsed nodes
    if(node.data('collapsedChildren')) {
       sbgnvizExtString += "<collapsed/>";
       hasNewtExt = true;
    }

    // add info for hidden nodes
    if(node.hidden()) {
       sbgnvizExtString += "<hidden/>";
       hasNewtExt = true;
    }

    // add info for nodes which has hidden neighbour
    if(node.data("thickBorder")) {
       sbgnvizExtString += "<hasHiddenNeighbour/>";
       hasNewtExt = true;
    }

    // add string to a new extension for this glyph
    if(hasNewtExt) {
       var extension = self.getOrCreateExtension(glyph);
       extension.add("<sbgnviz>"+sbgnvizExtString+"</sbgnviz>");
    }

    // current glyph is done
    glyphList.push(glyph);

    // keep going with all the included glyphs
    if(nodeClass === "compartment"){
       var children = node.children();
       children = children.union(this.allCollapsedNodes);
       children = children.filter("[parent = '"+ node.id() + "']")
       children.each(function(ele, i){
           if(typeof ele === "number") {
             ele = i;
           }
           glyphList = glyphList.concat(self.getGlyphSbgnml(ele));
       });
    }

    return  glyphList;
  };

  // element: a libsbgn.js glyph or edge object
  jsonToSbgnml.getOrCreateExtension = function(element) {
      var extension;
      if(element.extension) { // an extension is already there for this element
          extension = element.extension;
      }
      else {
          extension = new libsbgnjs.Extension();
          element.setExtension(extension);
      }
      return extension;
  };

  jsonToSbgnml.getArcSbgnml = function(edge){
    var self = this;
    //Temporary hack to resolve "undefined" arc source and targets
    var arcTarget = edge._private.data.porttarget;
    var arcSource = edge._private.data.portsource;

    if (arcSource == null || arcSource.length === 0)
       arcSource = edge._private.data.source;

    if (arcTarget == null || arcTarget.length === 0)
       arcTarget = edge._private.data.target;

    var arcId = edge._private.data.id;
    var arc = new libsbgnjs.Arc({id: arcId, source: arcSource, target: arcTarget, class_: edge._private.data.class});

    arc.setStart(new libsbgnjs.StartType({x: edge._private.rscratch.startX, y: edge._private.rscratch.startY}));

    // Export bend points if edgeBendEditingExtension is registered
    if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
     var segpts = cy.edgeBendEditing('get').getSegmentPoints(edge);
     if(segpts){
       for(var i = 0; segpts && i < segpts.length; i = i + 2){
         var bendX = segpts[i];
         var bendY = segpts[i + 1];

         arc.addNext(new libsbgnjs.NextType({x: bendX, y: bendY}));
       }
     }
    }

    arc.setEnd(new libsbgnjs.EndType({x: edge._private.rscratch.endX, y: edge._private.rscratch.endY}));

    var cardinality = edge._private.data.cardinality;
    if(typeof cardinality != 'undefined' && cardinality != null) {
       arc.addGlyph(new libsbgnjs.Glyph({
           id: arc.id+'_card',
           class_: 'cardinality',
           label: new libsbgnjs.Label({text: cardinality}),
           bbox: new libsbgnjs.Bbox({x: 0, y: 0, w: 0, h: 0}) // dummy bbox, needed for format compliance
       }));
    }
    // check for annotations
    if (edge.data('annotations') && !$.isEmptyObject(edge.data('annotations'))) {
       var extension = self.getOrCreateExtension(arc);
       var annotExt = this.getAnnotationExtension(edge);
       extension.add(annotExt);
    }

    // add info for hidden edges
    if(edge.hidden()) {
       var extension = self.getOrCreateExtension(arc);
       extension.add("<sbgnviz><hidden/></sbgnviz>");
    }

    return arc;
  };

  jsonToSbgnml.addGlyphBbox = function(node){
    var width = node.width();
    var height = node.height();

    var _class = node.data('class');

    // If the node can have ports and it has exactly 2 ports then it is represented by a bigger bbox.
    // This is because we represent it as a polygon and so the whole shape including the ports are rendered in the node bbox.
    if (elementUtilities.canHavePorts(_class)) {
      if (node.data('ports').length === 2) {
       // We assume that the ports are symmetric to the node center so using just one of the ports is enough
       var port = node.data('ports')[0];
       var orientation = port.x === 0 ? 'vertical' : 'horizontal';
       // This is the ratio of the area occupied with ports over without ports
       var ratio = orientation === 'vertical' ? Math.abs(port.y) / 50 : Math.abs(port.x) / 50;
       // Divide the bbox to the calculated ratio to get the bbox of the actual shape discluding the ports
       width /= ratio;
       height /= ratio;
      }
    }

    var x = node._private.position.x - width/2;
    var y = node._private.position.y - height/2;

    return new libsbgnjs.Bbox({x: x, y: y, w: width, h: height});
  };

  jsonToSbgnml.addStateAndInfoBbox = function(node, boxGlyph){
      boxBbox = boxGlyph.bbox;

      var x = boxBbox.x / 100 * node.width();
      var y = boxBbox.y / 100 * node.height();

      x = node._private.position.x + (x - boxBbox.w/2);
      y = node._private.position.y + (y - boxBbox.h/2);

      return new libsbgnjs.Bbox({x: x, y: y, w: boxBbox.w, h: boxBbox.h});
  };

  jsonToSbgnml.addStateBoxGlyph = function(node, id, mainGlyph){

      var glyph = new libsbgnjs.Glyph({id: id, class_: 'state variable'});
      var state = new libsbgnjs.StateType();
      if(typeof node.state.value != 'undefined')
          state.value = node.state.value;
      if(typeof node.state.variable != 'undefined')
          state.variable = node.state.variable;
      glyph.setState(state);
      glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

      return glyph;
  };

  jsonToSbgnml.addInfoBoxGlyph = function (node, id, mainGlyph) {
      var glyph = new libsbgnjs.Glyph({id: id, class_: 'unit of information'});
      var label = new libsbgnjs.Label();
      if(typeof node.label.text != 'undefined')
          label.text = node.label.text;
      glyph.setLabel(label);
      glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

      // assign correct entity tag for AF case
      var entityName = null;
      switch(mainGlyph._private.data.class) {
          case 'BA unspecified entity':   entityName = "unspecified entity"; break;
          case 'BA simple chemical':      entityName = "simple chemical"; break;
          case 'BA macromolecule':        entityName = "macromolecule"; break;
          case 'BA nucleic acid feature': entityName = "nucleic acid feature"; break;
          case 'BA perturbing agent':     entityName = "perturbation"; break;
          case 'BA complex':              entityName = "complex"; break;
      }
      // entity tag aren't always there, only for AF
      // but we still need to keep this information for unknown map type
      if(entityName) {
          glyph.setEntity(new libsbgnjs.EntityType({name: entityName}));
      }

      return glyph;
  };

  return jsonToSbgnml;
};

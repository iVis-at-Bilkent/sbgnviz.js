(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var checkParams = _dereq_('./utilities').checkParams;

var ns = {};

ns.xmlns = "http://www.sbml.org/sbml/level3/version1/render/version1";

// ------- COLORDEFINITION -------
ns.ColorDefinition = function(params) {
	var params = checkParams(params, ['id', 'value']);
	this.id 	= params.id;
	this.value 	= params.value;
};

ns.ColorDefinition.prototype.toXML = function () {
	var xmlString = "<colorDefinition";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.value != null) {
		xmlString += " value='"+this.value+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.ColorDefinition.fromXML = function (xml) {
	if (xml.tagName != 'colorDefinition') {
		throw new Error("Bad XML provided, expected tagName colorDefinition, got: " + xml.tagName);
	}
	var colorDefinition = new ns.ColorDefinition();
	colorDefinition.id 		= xml.getAttribute('id');
	colorDefinition.value 	= xml.getAttribute('value');
	return colorDefinition;
};
// ------- END COLORDEFINITION -------

// ------- LISTOFCOLORDEFINITIONS -------
ns.ListOfColorDefinitions = function () {
	this.colorDefinitions = [];
};

ns.ListOfColorDefinitions.prototype.addColorDefinition = function (colorDefinition) {
	this.colorDefinitions.push(colorDefinition);
};

ns.ListOfColorDefinitions.prototype.toXML = function () {
	var xmlString = "<listOfColorDefinitions>\n";
	for(var i=0; i<this.colorDefinitions.length; i++) {
		var colorDefinition = this.colorDefinitions[i];
		xmlString += colorDefinition.toXML();
	}
	xmlString += "</listOfColorDefinitions>\n";
	return xmlString;
};

ns.ListOfColorDefinitions.fromXML = function (xml) {
	if (xml.tagName != 'listOfColorDefinitions') {
		throw new Error("Bad XML provided, expected tagName listOfColorDefinitions, got: " + xml.tagName);
	}
	var listOfColorDefinitions = new ns.ListOfColorDefinitions();

	var colorDefinitions = xml.getElementsByTagName('colorDefinition');
	for (var i=0; i<colorDefinitions.length; i++) {
		var colorDefinitionXML = colorDefinitions[i];
		var colorDefinition = ns.ColorDefinition.fromXML(colorDefinitionXML);
		listOfColorDefinitions.addColorDefinition(colorDefinition);
	}
	return listOfColorDefinitions;
};
// ------- END LISTOFCOLORDEFINITIONS -------

// ------- RENDERGROUP -------
ns.RenderGroup = function (params) {
	// each of those are optional, so test if it is defined is mandatory
	var params = checkParams(params, ['fontSize', 'fontFamily', 'fontWeight', 
		'fontStyle', 'textAnchor', 'vtextAnchor', 'fill', 'id', 'stroke', 'strokeWidth']);
	// specific to renderGroup
	this.fontSize 		= params.fontSize;
	this.fontFamily 	= params.fontFamily;
	this.fontWeight 	= params.fontWeight;
	this.fontStyle 		= params.fontStyle;
	this.textAnchor 	= params.textAnchor; // probably useless
	this.vtextAnchor 	= params.vtextAnchor; // probably useless
	// from GraphicalPrimitive2D
	this.fill 			= params.fill; // fill color
	// from GraphicalPrimitive1D
	this.id 			= params.id;
	this.stroke 		= params.stroke; // stroke color
	this.strokeWidth 	= params.strokeWidth;
};

ns.RenderGroup.prototype.toXML = function () {
	var xmlString = "<g";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.fontSize != null) {
		xmlString += " fontSize='"+this.fontSize+"'";
	}
	if (this.fontFamily != null) {
		xmlString += " fontFamily='"+this.fontFamily+"'";
	}
	if (this.fontWeight != null) {
		xmlString += " fontWeight='"+this.fontWeight+"'";
	}
	if (this.fontStyle != null) {
		xmlString += " fontStyle='"+this.fontStyle+"'";
	}
	if (this.textAnchor != null) {
		xmlString += " textAnchor='"+this.textAnchor+"'";
	}
	if (this.vtextAnchor != null) {
		xmlString += " vtextAnchor='"+this.vtextAnchor+"'";
	}
	if (this.stroke != null) {
		xmlString += " stroke='"+this.stroke+"'";
	}
	if (this.strokeWidth != null) {
		xmlString += " strokeWidth='"+this.strokeWidth+"'";
	}
	if (this.fill != null) {
		xmlString += " fill='"+this.fill+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.RenderGroup.fromXML = function (xml) {
	if (xml.tagName != 'g') {
		throw new Error("Bad XML provided, expected tagName g, got: " + xml.tagName);
	}
	var renderGroup = new ns.RenderGroup({});
	renderGroup.id 			= xml.getAttribute('id');
	renderGroup.fontSize 	= xml.getAttribute('fontSize');
	renderGroup.fontFamily 	= xml.getAttribute('fontFamily');
	renderGroup.fontWeight 	= xml.getAttribute('fontWeight');
	renderGroup.fontStyle 	= xml.getAttribute('fontStyle');
	renderGroup.textAnchor 	= xml.getAttribute('textAnchor');
	renderGroup.vtextAnchor = xml.getAttribute('vtextAnchor');
	renderGroup.stroke 		= xml.getAttribute('stroke');
	renderGroup.strokeWidth = xml.getAttribute('strokeWidth');
	renderGroup.fill 		= xml.getAttribute('fill');
	return renderGroup;
};
// ------- END RENDERGROUP -------

// ------- STYLE -------
// localStyle from specs
ns.Style = function(params) {
	var params = checkParams(params, ['id', 'name', 'idList', 'renderGroup']);
	this.id 			= params.id;
	this.name 			= params.name;
	this.idList 		= params.idList; // TODO add utility functions to manage this (should be array)
	this.renderGroup 	= params.renderGroup;
};

ns.Style.prototype.setRenderGroup = function (renderGroup) {
	this.renderGroup = renderGroup;
};

ns.Style.prototype.getIdListAsArray = function () {
	return this.idList.split(' ');
}

ns.Style.prototype.setIdListFromArray = function (idArray) {
	this.idList = idArray.join(' ');
}

ns.Style.prototype.toXML = function () {
	var xmlString = "<style";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.idList != null) {
		xmlString += " idList='"+this.idList+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};

ns.Style.fromXML = function (xml) {
	if (xml.tagName != 'style') {
		throw new Error("Bad XML provided, expected tagName style, got: " + xml.tagName);
	}
	var style = new ns.Style();
	style.id 		= xml.getAttribute('id');
	style.name 		= xml.getAttribute('name');
	style.idList 	= xml.getAttribute('idList');

	var renderGroupXML = xml.getElementsByTagName('g')[0];
	if (renderGroupXML != null) {
		style.renderGroup = ns.RenderGroup.fromXML(renderGroupXML);
	}
	return style;
};
// ------- END STYLE -------

// ------- LISTOFSTYLES -------
ns.ListOfStyles = function() {
	this.styles = [];
};

ns.ListOfStyles.prototype.addStyle = function(style) {
	this.styles.push(style);
};

ns.ListOfStyles.prototype.toXML = function () {
	var xmlString = "<listOfStyles>\n";
	for(var i=0; i<this.styles.length; i++) {
		var style = this.styles[i];
		xmlString += style.toXML();
	}
	xmlString += "</listOfStyles>\n";
	return xmlString;
};

ns.ListOfStyles.fromXML = function (xml) {
	if (xml.tagName != 'listOfStyles') {
		throw new Error("Bad XML provided, expected tagName listOfStyles, got: " + xml.tagName);
	}
	var listOfStyles = new ns.ListOfStyles();

	var styles = xml.getElementsByTagName('style');
	for (var i=0; i<styles.length; i++) {
		var styleXML = styles[i];
		var style = ns.Style.fromXML(styleXML);
		listOfStyles.addStyle(style);
	}
	return listOfStyles;
};
// ------- END LISTOFSTYLES -------

// ------- RENDERINFORMATION -------
ns.RenderInformation = function (params) {
	var params = checkParams(params, ['id', 'name', 'programName', 
		'programVersion', 'backgroundColor', 'listOfColorDefinitions', 'listOfStyles']);
	this.id 					= params.id; // required, rest is optional
	this.name 					= params.name;
	this.programName 			= params.programName;
	this.programVersion 		= params.programVersion;
	this.backgroundColor 		= params.backgroundColor;
	this.listOfColorDefinitions = params.listOfColorDefinitions;
	this.listOfStyles 			= params.listOfStyles;
	/*this.listOfColorDefinitions = new renderExtension.ListOfColorDefinitions(renderInfo.colorDef.colorList);
	this.listOfStyles = new renderExtension.ListOfStyles(renderInfo.styleDef);
	*/
};

ns.RenderInformation.prototype.setListOfColorDefinitions = function(listOfColorDefinitions) {
	this.listOfColorDefinitions = listOfColorDefinitions;
};

ns.RenderInformation.prototype.setListOfStyles = function(listOfStyles) {
	this.listOfStyles = listOfStyles;
};

ns.RenderInformation.prototype.toXML = function() {
	// tag and its attributes
	var xmlString = "<renderInformation";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.programName != null) {
		xmlString += " programName='"+this.programName+"'";
	}
	if (this.programVersion != null) {
		xmlString += " programVersion='"+this.programVersion+"'";
	}
	if (this.backgroundColor != null) {
		xmlString += " backgroundColor='"+this.backgroundColor+"'";
	}
	xmlString += " xmlns='"+ns.xmlns+"'>\n";

	// child elements
	if (this.listOfColorDefinitions) {
		xmlString += this.listOfColorDefinitions.toXML();
	}
	if (this.listOfStyles) {
		xmlString += this.listOfStyles.toXML();
	}

	xmlString += "</renderInformation>\n";
	return xmlString;
};

// static constructor method
ns.RenderInformation.fromXML = function (xml) {
	if (xml.tagName != 'renderInformation') {
		throw new Error("Bad XML provided, expected tagName renderInformation, got: " + xml.tagName);
	}
	var renderInformation = new ns.RenderInformation();
	renderInformation.id 				= xml.getAttribute('id');
	renderInformation.name 				= xml.getAttribute('name');
	renderInformation.programName 		= xml.getAttribute('programName');
	renderInformation.programVersion 	= xml.getAttribute('programVersion');
	renderInformation.backgroundColor 	= xml.getAttribute('backgroundColor');

	var listOfColorDefinitionsXML = xml.getElementsByTagName('listOfColorDefinitions')[0];
	var listOfStylesXML = xml.getElementsByTagName('listOfStyles')[0];
	if (listOfColorDefinitionsXML != null) {
		renderInformation.listOfColorDefinitions = ns.ListOfColorDefinitions.fromXML(listOfColorDefinitionsXML);
	}
	if (listOfStylesXML != null) {
		renderInformation.listOfStyles = ns.ListOfStyles.fromXML(listOfStylesXML);
	}

	return renderInformation;
};
// ------- END RENDERINFORMATION -------

module.exports = ns;
},{"./utilities":3}],2:[function(_dereq_,module,exports){
var renderExt = _dereq_('./libsbgn-render');
var checkParams = _dereq_('./utilities').checkParams;

var ns = {};

ns.xmlns = "http://sbgn.org/libsbgn/0.3";

// ------- SBGNBase -------
/*
	Several sbgn elements inherit from this. Allows to put extensions everywhere.
*/
ns.SBGNBase = function (params) {
	var params = checkParams(params, ['extension']);
	this.extension 	= params.extension;
};

ns.SBGNBase.prototype.setExtension = function (extension) {
	this.extension = extension;
};

// write the XML of things that are specific to SBGNBase type
ns.SBGNBase.prototype.baseToXML = function () {
	var xmlString = "";
	// children
	if(this.extension != null) {
		xmlString += this.extension.toXML();
	}

	return xmlString;
};

// parse things specific to SBGNBase type
ns.SBGNBase.prototype.baseFromXML = function (xmlObj) {
	// children
	var extensionXML = xmlObj.getElementsByTagName('extension')[0];
	if (extensionXML != null) {
		var extension = ns.Extension.fromXML(extensionXML);
		this.setExtension(extension);
	}
};

ns.SBGNBase.prototype.hasChildren = function () {
	var allowedChildren = ['extension'].concat(this.allowedChildren);
	for(var i=0; i < allowedChildren.length; i++) {
		var prop = allowedChildren[i];
		if(typeof this[prop] == 'array' && this[prop].length > 0)
			return true;
		if(this[prop])
			return true;
	}
	return false;
}

// for simple elements that have no children, use this function to
// ensure tag is closed correctly when writing XML, if extension
// or other SBGNBase specific things are present.
// simple elements might end with /> or </name> 
ns.SBGNBase.prototype.closeTag = function () {
	var xmlString = "";
	if(this.hasChildren()) {
		xmlString += ">\n";
		xmlString += this.baseToXML();
		xmlString += "</"+this.tagName+">\n";
	}
	else {
		xmlString += " />\n";
	}
	return xmlString;
}
// ------- END SBGNBase -------

// ------- SBGN -------
ns.Sbgn = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['xmlns', 'map']);
	this.xmlns 	= params.xmlns;
	this.map 	= params.map;

	this.allowedChildren = ['map'];
	this.tagName = 'sbgn';
};

ns.Sbgn.prototype = Object.create(ns.SBGNBase.prototype);
ns.Sbgn.prototype.constructor = ns.Sbgn;

ns.Sbgn.prototype.setMap = function (map) {
	this.map = map;
};

ns.Sbgn.prototype.toXML = function () {
	var xmlString = "<sbgn";
	if(this.xmlns != null) {
		xmlString += " xmlns='"+this.xmlns+"'";
	}
	xmlString += ">\n";

	if (this.map != null) {
		xmlString += this.map.toXML();
	}
	xmlString += this.baseToXML(); // call to parent class
	xmlString += "</sbgn>\n";
	return xmlString;
};

ns.Sbgn.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'sbgn') {
		throw new Error("Bad XML provided, expected tagName sbgn, got: " + xmlObj.tagName);
	}
	var sbgn = new ns.Sbgn();
	sbgn.xmlns = xmlObj.getAttribute('xmlns');

	// get children
	var mapXML = xmlObj.getElementsByTagName('map')[0];
	if (mapXML != null) {
		var map = ns.Map.fromXML(mapXML);
		sbgn.setMap(map);
	}
	sbgn.baseFromXML(xmlObj); // call to parent class
	return sbgn;
};
// ------- END SBGN -------

// ------- MAP -------
ns.Map = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['id', 'language', 'glyphs', 'arcs']);
	this.id 		= params.id;
	this.language 	= params.language;
	this.glyphs 	= params.glyphs || [];
	this.arcs 		= params.arcs || [];

	this.allowedChildren = ['glyphs', 'arcs'];
	this.tagName = 'map';
};

ns.Map.prototype = Object.create(ns.SBGNBase.prototype);
ns.Map.prototype.constructor = ns.Map;

ns.Map.prototype.addGlyph = function (glyph) {
	this.glyphs.push(glyph);
};

ns.Map.prototype.addArc = function (arc) {
	this.arcs.push(arc);
};

ns.Map.prototype.toXML = function () {
	var xmlString = "<map";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.language != null) {
		xmlString += " language='"+this.language+"'";
	}
	xmlString += ">\n";

	// children
	xmlString += this.baseToXML();
	for(var i=0; i < this.glyphs.length; i++) {
		xmlString += this.glyphs[i].toXML();
	}
	for(var i=0; i < this.arcs.length; i++) {
		xmlString += this.arcs[i].toXML();
	}
	xmlString += "</map>\n";

	return xmlString;
};

ns.Map.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'map') {
		throw new Error("Bad XML provided, expected tagName map, got: " + xmlObj.tagName);
	}
	var map = new ns.Map();
	map.id = xmlObj.getAttribute('id');
	map.language = xmlObj.getAttribute('language');

	// need to be careful here, as there can be glyph in arcs
	var glyphsXML = xmlObj.querySelectorAll('map > glyph');
	for (var i=0; i < glyphsXML.length; i++) {
		var glyph = ns.Glyph.fromXML(glyphsXML[i]);
		map.addGlyph(glyph);
	}
	var arcsXML = xmlObj.getElementsByTagName('arc');
	for (var i=0; i < arcsXML.length; i++) {
		var arc = ns.Arc.fromXML(arcsXML[i]);
		map.addArc(arc);
	}

	map.baseFromXML(xmlObj);
	return map;
};
// ------- END MAP -------

// ------- EXTENSIONS -------
ns.Extension = function () {
	// consider first order children, add them with their tagname as property of this object
	// store xmlObject if no supported parsing (unrecognized extensions)
	// else store instance of the extension
	this.list = {};
	this.unsupportedList = {};
};

ns.Extension.prototype.add = function (extension) {
	if (extension instanceof renderExt.RenderInformation) {
		this.list['renderInformation'] = extension;
	}
	else if (extension.nodeType == Node.ELEMENT_NODE) {
		// case where renderInformation is passed unparsed
		if (extension.tagName == 'renderInformation') {
			var renderInformation = renderExt.RenderInformation.fromXML(extension);
			this.list['renderInformation'] = renderInformation;
		}
		this.unsupportedList[extension.tagName] = extension;
	}
};

ns.Extension.prototype.has = function (extensionName) {
	return this.list.hasOwnProperty(extensionName);
};

ns.Extension.prototype.get = function (extensionName) {
	if (this.has(extensionName)) {
		return this.list[extensionName];
	}
	else {
		return null;
	}
};

ns.Extension.prototype.toXML = function () {
	var xmlString = "<extension>\n";
	for (var extInstance in this.list) {
		if (extInstance == "renderInformation") {
			xmlString += this.get(extInstance).toXML();
		}
		else {
			xmlString += new XMLSerializer().serializeToString(this.get(extInstance));
		}
	}
	xmlString += "</extension>\n";
	return xmlString;
};

ns.Extension.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'extension') {
		throw new Error("Bad XML provided, expected tagName extension, got: " + xmlObj.tagName);
	}
	var extension = new ns.Extension();
	var children = xmlObj.children;
	for (var i=0; i < children.length; i++) {
		var extXmlObj = children[i];
		var extName = extXmlObj.tagName;
		//extension.add(extInstance);
		if (extName == 'renderInformation') {
			var renderInformation = renderExt.RenderInformation.fromXML(extXmlObj);
			extension.add(renderInformation);
		}
		else if (extName == 'annotations') {
			extension.add(extXmlObj); // to be parsed correctly
		}
		else { // unsupported extension, we still store the data as is
			extension.add(extXmlObj);
		}
	}
	return extension;
};
// ------- END EXTENSIONS -------

// ------- GLYPH -------
ns.Glyph = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['id', 'class_', 'compartmentRef', 'label', 'bbox', 'glyphMembers', 'ports', 'state', 'clone']);
	this.id 			= params.id;
	this.class_ 		= params.class_;
	this.compartmentRef = params.compartmentRef;

	// children
	this.label 			= params.label;
	this.state 			= params.state;
	this.bbox 			= params.bbox;
	this.clone 			= params.clone;
	this.glyphMembers 	= params.glyphMembers || []; // case of complex, can have arbitrary list of nested glyphs
	this.ports 			= params.ports || [];

	this.allowedChildren = ['label', 'state', 'bbox', 'clone', 'glyphMembers', 'ports'];
	this.tagName = 'glyph';
};

ns.Glyph.prototype = Object.create(ns.SBGNBase.prototype);
ns.Glyph.prototype.constructor = ns.Glyph;

ns.Glyph.prototype.setLabel = function (label) {
	this.label = label;
};

ns.Glyph.prototype.setState = function (state) {
	this.state = state;
};

ns.Glyph.prototype.setBbox = function (bbox) {
	this.bbox = bbox;
};

ns.Glyph.prototype.setClone = function (clone) {
	this.clone = clone;
};

ns.Glyph.prototype.addGlyphMember = function (glyphMember) {
	this.glyphMembers.push(glyphMember);
};

ns.Glyph.prototype.addPort = function (port) {
	this.ports.push(port);
};

ns.Glyph.prototype.toXML = function () {
	var xmlString = "<glyph";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.class_ != null) {
		xmlString += " class='"+this.class_+"'";
	}
	if(this.compartmentRef != null) {
		xmlString += " compartmentRef='"+this.compartmentRef+"'";
	}
	xmlString += ">\n";

	// children
	if(this.label != null) {
		xmlString += this.label.toXML();
	}
	if(this.state != null) {
		xmlString += this.state.toXML();
	}
	if(this.bbox != null) {
		xmlString += this.bbox.toXML();
	}
	if(this.clone != null) {
		xmlString += this.clone.toXML();
	}
	for(var i=0; i < this.glyphMembers.length; i++) {
		xmlString += this.glyphMembers[i].toXML();
	}
	for(var i=0; i < this.ports.length; i++) {
		xmlString += this.ports[i].toXML();
	}
	xmlString += this.baseToXML();
	xmlString += "</glyph>\n";

	return xmlString;
};

ns.Glyph.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'glyph') {
		throw new Error("Bad XML provided, expected tagName glyph, got: " + xmlObj.tagName);
	}
	var glyph = new ns.Glyph();
	glyph.id 				= xmlObj.getAttribute('id');
	glyph.class_ 			= xmlObj.getAttribute('class');
	glyph.compartmentRef 	= xmlObj.getAttribute('compartmentRef');

	var labelXML = xmlObj.getElementsByTagName('label')[0];
	if (labelXML != null) {
		var label = ns.Label.fromXML(labelXML);
		glyph.setLabel(label);
	}
	var stateXML = xmlObj.getElementsByTagName('state')[0];
	if (stateXML != null) {
		var state = ns.StateType.fromXML(stateXML);
		glyph.setState(state);
	}
	var bboxXML = xmlObj.getElementsByTagName('bbox')[0];
	if (bboxXML != null) {
		var bbox = ns.Bbox.fromXML(bboxXML);
		glyph.setBbox(bbox);
	}
	var cloneXMl = xmlObj.getElementsByTagName('clone')[0];
	if (cloneXMl != null) {
		var clone = ns.CloneType.fromXML(cloneXMl);
		glyph.setClone(clone);
	}
	// need special care because of recursion of nested glyph nodes
	// take only first level glyphs
	var children = xmlObj.children;
	for (var j=0; j < children.length; j++) { // loop through all first level children
		var child = children[j];
		if (child.tagName == "glyph") { // here we only want the glyh children
			var glyphMember = ns.Glyph.fromXML(child); // recursive call on nested glyph
			glyph.addGlyphMember(glyphMember);
		}
	}
	var portsXML = xmlObj.getElementsByTagName('port');
	for (var i=0; i < portsXML.length; i++) {
		var port = ns.Port.fromXML(portsXML[i]);
		glyph.addPort(port);
	}
	glyph.baseFromXML(xmlObj);
	return glyph;
};
// ------- END GLYPH -------

// ------- LABEL -------
ns.Label = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['text']);
	this.text = params.text;

	this.allowedChildren = [];
	this.tagName = 'label';
};

ns.Label.prototype = Object.create(ns.SBGNBase.prototype);
ns.Label.prototype.constructor = ns.Label;

ns.Label.prototype.toXML = function () {
	var xmlString = "<label";
	// attributes
	if(this.text != null) {
		xmlString += " text='"+this.text+"'";
	}

	xmlString += this.closeTag();

	return xmlString;
};

ns.Label.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'label') {
		throw new Error("Bad XML provided, expected tagName label, got: " + xmlObj.tagName);
	}
	var label = new ns.Label();
	label.text = xmlObj.getAttribute('text');
	label.baseFromXML(xmlObj);
	return label;
};
// ------- END LABEL -------

// ------- BBOX -------
ns.Bbox = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['x', 'y', 'w', 'h']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
	this.w = parseFloat(params.w);
	this.h = parseFloat(params.h);

	this.allowedChildren = [];
	this.tagName = 'bbox';
};

ns.Bbox.prototype = Object.create(ns.SBGNBase.prototype);
ns.Bbox.prototype.constructor = ns.Bbox;

ns.Bbox.prototype.toXML = function () {
	var xmlString = "<bbox";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	if(!isNaN(this.w)) {
		xmlString += " w='"+this.w+"'";
	}
	if(!isNaN(this.h)) {
		xmlString += " h='"+this.h+"'";
	}
	xmlString += this.closeTag();
	return xmlString;
};

ns.Bbox.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'bbox') {
		throw new Error("Bad XML provided, expected tagName bbox, got: " + xmlObj.tagName);
	}
	var bbox = new ns.Bbox();
	bbox.x = parseFloat(xmlObj.getAttribute('x'));
	bbox.y = parseFloat(xmlObj.getAttribute('y'));
	bbox.w = parseFloat(xmlObj.getAttribute('w'));
	bbox.h = parseFloat(xmlObj.getAttribute('h'));
	bbox.baseFromXML(xmlObj);
	return bbox;
};
// ------- END BBOX -------

// ------- STATE -------
ns.StateType = function (params) {
	var params = checkParams(params, ['value', 'variable']);
	this.value = params.value;
	this.variable = params.variable;
};

ns.StateType.prototype.toXML = function () {
	var xmlString = "<state";
	// attributes
	if(this.value != null) {
		xmlString += " value='"+this.value+"'";
	}
	if(this.variable != null) {
		xmlString += " variable='"+this.variable+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.StateType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'state') {
		throw new Error("Bad XML provided, expected tagName state, got: " + xmlObj.tagName);
	}
	var state = new ns.StateType();
	state.value = xmlObj.getAttribute('value');
	state.variable = xmlObj.getAttribute('variable');
	return state;
};
// ------- END STATE -------

// ------- CLONE -------
ns.CloneType = function (params) {
	var params = checkParams(params, ['label']);
	this.label = params.label;
};

ns.CloneType.prototype.toXML = function () {
	var xmlString = "<clone";
	// attributes
	if(this.label != null) {
		xmlString += " label='"+this.label+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.CloneType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'clone') {
		throw new Error("Bad XML provided, expected tagName clone, got: " + xmlObj.tagName);
	}
	var clone = new ns.CloneType();
	clone.label = xmlObj.getAttribute('label');
	return clone;
};
// ------- END CLONE -------

// ------- PORT -------
ns.Port = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['id', 'x', 'y']);
	this.id = params.id;
	this.x 	= parseFloat(params.x);
	this.y 	= parseFloat(params.y);

	this.allowedChildren = [];
	this.tagName = 'port';
};

ns.Port.prototype = Object.create(ns.SBGNBase.prototype);
ns.Port.prototype.constructor = ns.Port;

ns.Port.prototype.toXML = function () {
	var xmlString = "<port";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += this.closeTag();
	return xmlString;
};

ns.Port.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'port') {
		throw new Error("Bad XML provided, expected tagName port, got: " + xmlObj.tagName);
	}
	var port = new ns.Port();
	port.x 	= parseFloat(xmlObj.getAttribute('x'));
	port.y 	= parseFloat(xmlObj.getAttribute('y'));
	port.id = xmlObj.getAttribute('id');
	port.baseFromXML(xmlObj);
	return port;
};
// ------- END PORT -------

// ------- ARC -------
ns.Arc = function (params) {
	ns.SBGNBase.call(this, params);
	var params = checkParams(params, ['id', 'class_', 'source', 'target', 'start', 'end', 'nexts', 'glyphs']);
	this.id 	= params.id;
	this.class_ = params.class_;
	this.source = params.source;
	this.target = params.target;

	this.start 	= params.start;
	this.end 	= params.end;
	this.nexts 	= params.nexts || [];
	this.glyphs = params.glyphs || [];

	this.allowedChildren = ['start', 'nexts', 'end', 'glyphs'];
	this.tagName = 'arc';
};

ns.Arc.prototype = Object.create(ns.SBGNBase.prototype);
ns.Arc.prototype.constructor = ns.Arc;

ns.Arc.prototype.setStart = function (start) {
	this.start = start;
};

ns.Arc.prototype.setEnd = function (end) {
	this.end = end;
};

ns.Arc.prototype.addNext = function (next) {
	this.nexts.push(next);
};

ns.Arc.prototype.addGlyph = function (glyph) {
	this.glyphs.push(glyph);
};

ns.Arc.prototype.toXML = function () {
	var xmlString = "<arc";
	// attributes
	if(this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if(this.class_ != null) {
		xmlString += " class='"+this.class_+"'";
	}
	if(this.source != null) {
		xmlString += " source='"+this.source+"'";
	}
	if(this.target != null) {
		xmlString += " target='"+this.target+"'";
	}
	xmlString += ">\n";

	// children
	for(var i=0; i < this.glyphs.length; i++) {
		xmlString += this.glyphs[i].toXML();
	}
	if(this.start != null) {
		xmlString += this.start.toXML();
	}
	for(var i=0; i < this.nexts.length; i++) {
		xmlString += this.nexts[i].toXML();
	}
	if(this.end != null) {
		xmlString += this.end.toXML();
	}

	xmlString += this.baseToXML();
	xmlString += "</arc>\n";
	return xmlString;
};

ns.Arc.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'arc') {
		throw new Error("Bad XML provided, expected tagName arc, got: " + xmlObj.tagName);
	}
	var arc = new ns.Arc();
	arc.id 		= xmlObj.getAttribute('id');
	arc.class_ 	= xmlObj.getAttribute('class');
	arc.source 	= xmlObj.getAttribute('source');
	arc.target 	= xmlObj.getAttribute('target');

	var startXML = xmlObj.getElementsByTagName('start')[0];
	if (startXML != null) {
		var start = ns.StartType.fromXML(startXML);
		arc.setStart(start);
	}
	var nextXML = xmlObj.getElementsByTagName('next');
	for (var i=0; i < nextXML.length; i++) {
		var next = ns.NextType.fromXML(nextXML[i]);
		arc.addNext(next);
	}
	var endXML = xmlObj.getElementsByTagName('end')[0];
	if (endXML != null) {
		var end = ns.EndType.fromXML(endXML);
		arc.setEnd(end);
	}
	var glyphsXML = xmlObj.getElementsByTagName('glyph');
	for (var i=0; i < glyphsXML.length; i++) {
		var glyph = ns.Glyph.fromXML(glyphsXML[i]);
		arc.addGlyph(glyph);
	}

	arc.baseFromXML(xmlObj);
	return arc;
};

// ------- END ARC -------

// ------- STARTTYPE -------
ns.StartType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.StartType.prototype.toXML = function () {
	var xmlString = "<start";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.StartType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'start') {
		throw new Error("Bad XML provided, expected tagName start, got: " + xmlObj.tagName);
	}
	var start = new ns.StartType();
	start.x = parseFloat(xmlObj.getAttribute('x'));
	start.y = parseFloat(xmlObj.getAttribute('y'));
	return start;
};
// ------- END STARTTYPE -------

// ------- ENDTYPE -------
ns.EndType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.EndType.prototype.toXML = function () {
	var xmlString = "<end";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.EndType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'end') {
		throw new Error("Bad XML provided, expected tagName end, got: " + xmlObj.tagName);
	}
	var end = new ns.EndType();
	end.x = parseFloat(xmlObj.getAttribute('x'));
	end.y = parseFloat(xmlObj.getAttribute('y'));
	return end;
};
// ------- END ENDTYPE -------

// ------- NEXTTYPE -------
ns.NextType = function (params) {
	var params = checkParams(params, ['x', 'y']);
	this.x = parseFloat(params.x);
	this.y = parseFloat(params.y);
};

ns.NextType.prototype.toXML = function () {
	var xmlString = "<next";
	// attributes
	if(!isNaN(this.x)) {
		xmlString += " x='"+this.x+"'";
	}
	if(!isNaN(this.y)) {
		xmlString += " y='"+this.y+"'";
	}
	xmlString += " />\n";
	return xmlString;
};

ns.NextType.fromXML = function (xmlObj) {
	if (xmlObj.tagName != 'next') {
		throw new Error("Bad XML provided, expected tagName next, got: " + xmlObj.tagName);
	}
	var next = new ns.NextType();
	next.x = parseFloat(xmlObj.getAttribute('x'));
	next.y = parseFloat(xmlObj.getAttribute('y'));
	return next;
};
// ------- END NEXTTYPE -------

ns.renderExtension = renderExt;
module.exports = ns;
},{"./libsbgn-render":1,"./utilities":3}],3:[function(_dereq_,module,exports){
var ns = {};

/*
	guarantees to return an object with given args being set to null if not present, other args returned as is
*/
ns.checkParams = function (params, names) {
	if (typeof params == "undefined" || params == null) {
		params = {};
	}
	if (typeof params != 'object') {
		throw new Error("Bad params. Object with named parameters must be passed.");
	}
	for(var i=0; i < names.length; i++) {
		var argName = names[i];
		if (typeof params[argName] == 'undefined') {
			params[argName] = null;
		}
	}
	return params;
}

module.exports = ns;
},{}],4:[function(_dereq_,module,exports){
module.exports={
  "name": "sbgnviz",
  "version": "3.1.0",
  "description": "SBGNPD visualization library",
  "main": "src/index.js",
  "licence": "LGPL-3.0",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build-sbgnviz-js": "gulp build",
    "debug-js": "nodemon -e js --watch src -x \"npm run build-sbgnviz-js\""
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/iVis-at-Bilkent/sbgnviz.js.git"
  },
  "bugs": {
    "url": "https://github.com/iVis-at-Bilkent/sbgnviz.js/issues"
  },
  "homepage": "https://github.com/iVis-at-Bilkent/sbgnviz.js/",
  "peer-dependencies": {
    "jquery": "^2.2.4",
    "filesaverjs": "~0.2.2",
    "cytoscape": "iVis-at-Bilkent/cytoscape.js#unstable"
  },
  "dependencies": {
    "libsbgn.js": "git://github.com/eisbm/libsbgn.js"
  },
  "devDependencies": {
    "browserify": "^11.2.0",
    "gulp": "^3.9.0",
    "gulp-derequire": "^2.1.0",
    "gulp-jshint": "^1.11.2",
    "gulp-prompt": "^0.1.2",
    "gulp-replace": "^0.5.4",
    "gulp-shell": "^0.5.0",
    "gulp-util": "^3.0.6",
    "jshint-stylish": "^2.0.1",
    "node-notifier": "^4.3.1",
    "run-sequence": "^1.1.4",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0"
  }
}

},{}],5:[function(_dereq_,module,exports){
(function(){
  var sbgnviz = window.sbgnviz = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = _dereq_('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options);
    
    var sbgnRenderer = _dereq_('./sbgn-extensions/sbgn-cy-renderer');
    var sbgnCyInstance = _dereq_('./sbgn-extensions/sbgn-cy-instance');
    
    // Utilities whose functions will be exposed seperately
    var uiUtilities = _dereq_('./utilities/ui-utilities');
    var fileUtilities = _dereq_('./utilities/file-utilities');
    var graphUtilities = _dereq_('./utilities/graph-utilities');
    var mainUtilities = _dereq_('./utilities/main-utilities');
    _dereq_('./utilities/keyboard-input-utilities'); // require keybord input utilities
    // Utilities to be exposed as is
    var elementUtilities = _dereq_('./utilities/element-utilities');
    var undoRedoActionFunctions = _dereq_('./utilities/undo-redo-action-functions');
    
    sbgnRenderer();
    sbgnCyInstance();
    
    // Expose the api
    // Expose elementUtilities and undoRedoActionFunctions as is, most users will not need these
    sbgnviz.elementUtilities = elementUtilities;
    sbgnviz.undoRedoActionFunctions = undoRedoActionFunctions;
    
    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      sbgnviz[prop] = mainUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in fileUtilities) {
      sbgnviz[prop] = fileUtilities[prop];
    }
    
    // Expose each file utility seperately
    for (var prop in uiUtilities) {
      sbgnviz[prop] = uiUtilities[prop];
    }
    
    // Expose each sbgn graph utility seperately
    for (var prop in graphUtilities) {
      sbgnviz[prop] = graphUtilities[prop];
    }
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sbgnviz;
  }
})();
},{"./sbgn-extensions/sbgn-cy-instance":6,"./sbgn-extensions/sbgn-cy-renderer":7,"./utilities/element-utilities":8,"./utilities/file-utilities":9,"./utilities/graph-utilities":10,"./utilities/keyboard-input-utilities":12,"./utilities/lib-utilities":13,"./utilities/main-utilities":14,"./utilities/option-utilities":15,"./utilities/ui-utilities":18,"./utilities/undo-redo-action-functions":19}],6:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('../utilities/element-utilities');
var graphUtilities = _dereq_('../utilities/graph-utilities');
var undoRedoActionFunctions = _dereq_('../utilities/undo-redo-action-functions');
var refreshPaddings = graphUtilities.refreshPaddings.bind(graphUtilities);

var libs = _dereq_('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

var optionUtilities = _dereq_('../utilities/option-utilities');
var options = optionUtilities.getOptions();

var getCompoundPaddings = function() {
  // Return calculated paddings in case of that data is invalid return 5
  return graphUtilities.calculatedPaddings || 5;
};

module.exports = function () {
  var containerSelector = options.networkContainerSelector;
  var imgPath = options.imgPath;
  
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
        // If undoable register undo/redo actions
        if (options.undoable) {
          registerUndoRedoActions();
        }
        bindCyEvents();
      }
    });
  });
  
  // Note that in ChiSE this function is in a seperate file but in the viewer it has just 2 methods and so it is located in this file
  function registerUndoRedoActions() {
    // create or get the undo-redo instance
    var ur = cy.undoRedo();

    // register general actions
    // register add remove actions
    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
    ur.action("deleteNodesSmart", undoRedoActionFunctions.deleteNodesSmart, undoRedoActionFunctions.restoreEles);
  }
  
  function bindCyEvents() {
    cy.on('tapend', 'node', function (event) {
      cy.style().update();
    });
    
    cy.on("expandcollapse.beforecollapse", "node", function (event) {
      var node = this;
      //The children info of complex nodes should be shown when they are collapsed
      if (node._private.data.class == "complex") {
        //The node is being collapsed store infolabel to use it later
        var infoLabel = elementUtilities.getInfoLabel(node);
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

    cy.on("expandcollapse.beforeexpand", "node", function (event) {
      var node = this;
      node.removeData("infoLabel");
    });

    cy.on("expandcollapse.afterexpand", "node", function (event) {
      var node = this;
      cy.nodes().updateCompoundBounds();
      //Don't show children info when the complex node is expanded
      if (node._private.data.class == "complex") {
        node.removeStyle('content');
      }
    });
  }

  var sbgnStyleSheet = cytoscape.stylesheet()
          .selector("node")
          .css({
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1.25,
            'border-color': '#555',
            'background-color': '#ffffff',
            'background-opacity': 0.5,
            'text-opacity': 1,
            'opacity': 1,
            'padding': 0
          })
          .selector("node:parent")
          .css({
            'padding': getCompoundPaddings
          })
          .selector("node[?clonemarker][class='perturbing agent']")
          .css({
            'background-image': imgPath + '/clone_bg.png',
            'background-position-x': '50%',
            'background-position-y': '100%',
            'background-width': '100%',
            'background-height': '25%',
            'background-fit': 'none',
            'background-image-opacity': function (ele) {
              if (!ele.data('clonemarker')) {
                return 0;
              }
              return ele.css('background-opacity');
            }
          })
          .selector("node[class]")
          .css({
            'shape': function (ele) {
              return elementUtilities.getCyShape(ele);
            },
            'content': function (ele) {
              return elementUtilities.getElementContent(ele);
            },
            'font-size': function (ele) {
              return elementUtilities.getLabelTextSize(ele);
            },
          })
          .selector("node[class='perturbing agent']")
          .css({
            'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
          })
          .selector("node[class='tag']")
          .css({
            'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
          })
          .selector("node[class='complex']")
          .css({
            'text-valign': 'bottom',
            'text-halign': 'center',
          })
          .selector("node[class='compartment']")
          .css({
            'border-width': 3.25,
            'background-opacity': 0,
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y' : -1 * options.extraCompartmentPadding
          })
          .selector("node:parent[class='compartment']")
          .css({
            'padding': function() {
              return getCompoundPaddings() + options.extraCompartmentPadding;
            }
          })
          .selector("node[bbox][class][class!='complex'][class!='compartment'][class!='submap']")
          .css({
            'width': 'data(bbox.w)',
            'height': 'data(bbox.h)'
          })
          .selector("node.cy-expand-collapse-collapsed-node")
          .css({
            'width': 36,
            'height': 36,
            'border-style': 'dashed'
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
            'width': 1.25,
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
            },
            'arrow-scale': 1.5
          })
          .selector("edge.cy-expand-collapse-meta-edge")
          .css({
            'line-color': '#C4C4C4',
            'source-arrow-color': '#C4C4C4',
            'target-arrow-color': '#C4C4C4'
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
          .selector("edge[cardinality > 0]")
          .css({
            'text-rotation': 'autorotate',
            'text-background-shape': 'rectangle',
            'text-border-opacity': '1',
            'text-border-width': '1',
            'text-background-color': 'white',
            'text-background-opacity': '1'
          })
          .selector("edge[class='consumption'][cardinality > 0]")
          .css({
            'source-label': function (ele) {
              return '' + ele.data('cardinality');
            },
            'source-text-margin-y': '-10',
            'source-text-offset': function (ele) {
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[class='production'][cardinality > 0]")
          .css({
            'target-label': function (ele) {
              return '' + ele.data('cardinality');
            },
            'target-text-margin-y': '-10',
            'target-text-offset': function (ele) {
              return elementUtilities.getCardinalityDistance(ele);
            }
          })
          .selector("edge[class]")
          .css({
            'target-arrow-shape': function (ele) {
              return elementUtilities.getCyArrowShape(ele);
            },
            'source-arrow-shape': 'none',
            'source-endpoint': function(ele) {
              return elementUtilities.getEndPoint(ele, 'source');
            },
            'target-endpoint': function(ele) {
              return elementUtilities.getEndPoint(ele, 'target');
            }
          })
          .selector("edge[class='inhibition']")
          .css({
            'target-arrow-fill': 'filled'
          })
          .selector("edge[class='production']")
          .css({
            'target-arrow-fill': 'filled'
          })
          .selector("core")
          .css({
            'selection-box-color': '#d67614',
            'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
          });
};

},{"../utilities/element-utilities":8,"../utilities/graph-utilities":10,"../utilities/lib-utilities":13,"../utilities/option-utilities":15,"../utilities/undo-redo-action-functions":19}],7:[function(_dereq_,module,exports){
/*
 * Render sbgn specific shapes which are not supported by cytoscape.js core
 */

var truncateText = _dereq_('../utilities/text-utilities').truncateText;
var libs = _dereq_('../utilities/lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var cytoscape = libs.cytoscape;

var cyMath = cytoscape.math;
var cyBaseNodeShapes = cytoscape.baseNodeShapes;
var cyStyleProperties = cytoscape.styleProperties;

module.exports = function () {
  var $$ = cytoscape;
  
  // Taken from cytoscape.js and modified
  var drawRoundRectanglePath = function(
    context, x, y, width, height, radius ){

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var cornerRadius = radius || cyMath.getRoundRectangleRadius( width, height );

    if( context.beginPath ){ context.beginPath(); }

    // Start at top middle
    context.moveTo( x, y - halfHeight );
    // Arc from middle top to right side
    context.arcTo( x + halfWidth, y - halfHeight, x + halfWidth, y, cornerRadius );
    // Arc from right side to bottom
    context.arcTo( x + halfWidth, y + halfHeight, x, y + halfHeight, cornerRadius );
    // Arc from bottom to left side
    context.arcTo( x - halfWidth, y + halfHeight, x - halfWidth, y, cornerRadius );
    // Arc from left side to topBorder
    context.arcTo( x - halfWidth, y - halfHeight, x, y - halfHeight, cornerRadius );
    // Join line
    context.lineTo( x, y - halfHeight );


    context.closePath();
  };
  
  // Taken from cytoscape.js
  var drawPolygonPath = function(
    context, x, y, width, height, points ){

    var halfW = width / 2;
    var halfH = height / 2;

    if( context.beginPath ){ context.beginPath(); }

    context.moveTo( x + halfW * points[0], y + halfH * points[1] );

    for( var i = 1; i < points.length / 2; i++ ){
      context.lineTo( x + halfW * points[ i * 2], y + halfH * points[ i * 2 + 1] );
    }

    context.closePath();
  };
  
  var sbgnShapes = $$.sbgn.sbgnShapes = {
    'source and sink': true,
    'nucleic acid feature': true,
    'complex': true,
    'dissociation': true,
    'macromolecule': true,
    'simple chemical': true,
    'unspecified entity': true,
    'process': true,
    'uncertain process': true,
    'omitted process': true,
    'association': true
  };

  var totallyOverridenNodeShapes = $$.sbgn.totallyOverridenNodeShapes = {
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
      var closestPoint = cyMath.polygonIntersectLine(portX, portY,
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
            drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            drawRoundRectanglePath(context,
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
            drawRoundRectanglePath(context,
                    stateCenterX, stateCenterY,
                    stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));
            context.fill();

            textProp.state = state.state;
            $$.sbgn.drawStateText(context, textProp);
          } else if (state.clazz == "unit of information") {//draw rectangle
            drawRoundRectanglePath(context,
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

    var fontSize = 9; // parseInt(textProp.height / 1.5);

    textProp.font = fontSize + "px Arial";
    textProp.label = stateLabel;
    textProp.color = "#0f0f0f";
    $$.sbgn.drawText(context, textProp);
  };

  $$.sbgn.drawInfoText = function (context, textProp) {
    var fontSize = 9; // parseInt(textProp.height / 1.5);
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

  cyMath.calculateDistance = function (point1, point2) {
    var distance = Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2);
    return Math.sqrt(distance);
  };

  $$.sbgn.colors = {
    clone: "#a9a9a9",
    association: "#6B6B6B",
    port: "#6B6B6B"
  };


  $$.sbgn.drawStateAndInfos = function (node, context, centerX, centerY) {
    var stateAndInfos = node._private.data.statesandinfos;

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
        drawRoundRectanglePath(context, stateCenterX, stateCenterY,
                stateWidth, stateHeight, Math.min(stateWidth / 2, stateHeight / 2, stateVarRadius));

        context.fill();
        textProp.state = state.state;
        $$.sbgn.drawStateText(context, textProp);

        context.stroke();

      } else if (state.clazz == "unit of information") {//draw rectangle
        drawRoundRectanglePath(context,
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
    if (cyMath.pointInsidePolygon(x, y, points,
            centerX, centerY - cornerRadius / 2, width, height - cornerRadius / 3, [0, -1],
            padding)) {
      return true;
    }

    //check rectangle at bottom
    if (cyMath.pointInsidePolygon(x, y, points,
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
    cyBaseNodeShapes['ellipse'].drawPath(context, x, y, width, height);
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
    var sbgnClass = node._private.data.class;
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
      var closestPoint = cyMath.intersectLineEllipse(
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

  cyStyleProperties.types.nodeShape.enums.push('source and sink');
  cyStyleProperties.types.nodeShape.enums.push('nucleic acid feature');
  cyStyleProperties.types.nodeShape.enums.push('complex');
  cyStyleProperties.types.nodeShape.enums.push('dissociation');
  cyStyleProperties.types.nodeShape.enums.push('macromolecule');
  cyStyleProperties.types.nodeShape.enums.push('simple chemical');
  cyStyleProperties.types.nodeShape.enums.push('unspecified entity');
  cyStyleProperties.types.nodeShape.enums.push('process');
  cyStyleProperties.types.nodeShape.enums.push('omitted process');
  cyStyleProperties.types.nodeShape.enums.push('uncertain process');
  cyStyleProperties.types.nodeShape.enums.push('association');

  cyStyleProperties.types.lineStyle.enums.push('consumption');
  cyStyleProperties.types.lineStyle.enums.push('production');

  $$.sbgn.registerSbgnNodeShapes = function () {
    cyBaseNodeShapes['process'] = {
      points: cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      label: '',
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var padding = parseInt(node.css('border-width')) / 2;

        drawPolygonPath(context,
                centerX, centerY,
                width, height,
                cyBaseNodeShapes['process'].points);
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

        return cyMath.polygonIntersectLine(
                x, y,
                cyBaseNodeShapes['process'].points,
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

        return cyMath.pointInsidePolygon(x, y, cyBaseNodeShapes['process'].points,
                centerX, centerY, width, height, [0, -1], padding);
      }
    };

    cyBaseNodeShapes['omitted process'] = jQuery.extend(true, {}, cyBaseNodeShapes['process']);
    cyBaseNodeShapes['omitted process'].label = '\\\\';

    cyBaseNodeShapes['uncertain process'] = jQuery.extend(true, {}, cyBaseNodeShapes['process']);
    cyBaseNodeShapes['uncertain process'].label = '?';

    cyBaseNodeShapes["unspecified entity"] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var sbgnClass = node._private.data.class;
        var label = node._private.data.label;
        var cloneMarker = node._private.data.clonemarker;

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

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyBaseNodeShapes["ellipse"].intersectLine(centerX, centerY, width,
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

        var nodeCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        return nodeCheckPoint || stateAndInfoCheckPoint;
      }
    };

    cyBaseNodeShapes["simple chemical"] = {
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;
        var label = node._private.data.label;
        var padding = parseInt(node.css('border-width'));
        var cloneMarker = node._private.data.clonemarker;

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
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyBaseNodeShapes["ellipse"].intersectLine(
                centerX, centerY, width, height, x, y, padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyBaseNodeShapes["ellipse"].intersectLine(
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
        var multimerPadding = cyBaseNodeShapes["simple chemical"].multimerPadding;

        var nodeCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y,
                padding, width, height,
                centerX, centerY);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(x, y,
                  padding, width, height,
                  centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes["macromolecule"] = {
      points: cyMath.generateUnitNgonPoints(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var width = node.width();
        var height = node.height();
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var label = node._private.data.label;
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;
        var padding = parseInt(node.css('border-width'));

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          drawRoundRectanglePath(context,
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

        drawRoundRectanglePath(context,
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
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
        var multimerPadding = cyBaseNodeShapes["macromolecule"].multimerPadding;

        var nodeCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                width, height, centerX, centerY);
        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(x, y, padding,
                  width, height, centerX + multimerPadding, centerY + multimerPadding);
        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes['association'] = {
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.width();
        var height = node.height();
        var padding = parseInt(node.css('border-width'));

        cyBaseNodeShapes['ellipse'].draw(context, centerX, centerY, width, height);
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

        var intersect = cyMath.intersectLineEllipse(
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

    cyBaseNodeShapes["dissociation"] = {
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

        return cyMath.intersectLineEllipse(
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

    cyBaseNodeShapes["complex"] = {
      points: [],
      multimerPadding: 5,
      cornerLength: 12,
      draw: function (context, node) {
        var width = node.outerWidth() - parseFloat(node.css('border-width'));
        var height = node.outerHeight()- parseFloat(node.css('border-width'));
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var stateAndInfos = node._private.data.statesandinfos;
        var label = node._private.data.label;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        //check whether sbgn class includes multimer substring or not
        if ($$.sbgn.isMultimer(node)) {
          //add multimer shape
          drawPolygonPath(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cyBaseNodeShapes["complex"].points);
          context.fill();

          context.stroke();

          $$.sbgn.cloneMarker.complex(context,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, cornerLength, cloneMarker, true,
                  node.css('background-opacity'));

          //context.stroke();
        }

        drawPolygonPath(context,
                centerX, centerY,
                width, height, cyBaseNodeShapes["complex"].points);
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
//      intersectLine: cyBaseNodeShapes["roundrectangle"].intersectLine,
//      checkPoint: cyBaseNodeShapes["roundrectangle"].checkPoint
      intersectLine: function (node, x, y, portId) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        var width = node.outerWidth() - parseFloat(node.css('border-width'));
        var height = node.outerHeight() - parseFloat(node.css('border-width'));
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
                node, x, y);

        var nodeIntersectLines = cyMath.polygonIntersectLine(
                x, y,
                cyBaseNodeShapes["complex"].points,
                centerX,
                centerY,
                width / 2, height / 2,
                padding);

        //check whether sbgn class includes multimer substring or not
        var multimerIntersectionLines = [];
        if ($$.sbgn.isMultimer(node)) {
          multimerIntersectionLines = cyMath.polygonIntersectLine(
                  x, y,
                  cyBaseNodeShapes["complex"].points,
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
        var width = (node.outerWidth() - parseFloat(node.css('border-width'))) + threshold;
        var height = (node.outerHeight() - parseFloat(node.css('border-width'))) + threshold;
        var padding = parseInt(node.css('border-width')) / 2;
        var multimerPadding = cyBaseNodeShapes["complex"].multimerPadding;
        var cornerLength = cyBaseNodeShapes["complex"].cornerLength;

        cyBaseNodeShapes["complex"].points = $$.sbgn.generateComplexShapePoints(cornerLength,
                width, height);

        var nodeCheckPoint = cyMath.pointInsidePolygon(x, y, cyBaseNodeShapes["complex"].points,
                centerX, centerY, width, height, [0, -1], padding);

        var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node,
                threshold);

        //check whether sbgn class includes multimer substring or not
        var multimerCheckPoint = false;
        if ($$.sbgn.isMultimer(node)) {
          multimerCheckPoint = cyMath.pointInsidePolygon(x, y,
                  cyBaseNodeShapes["complex"].points,
                  centerX + multimerPadding, centerY + multimerPadding,
                  width, height, [0, -1], padding);

        }

        return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
      }
    };

    cyBaseNodeShapes["nucleic acid feature"] = {
      points: cyMath.generateUnitNgonPointsFitToSquare(4, 0),
      multimerPadding: 5,
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;
        ;
        var width = node.width();
        var height = node.height();
        var label = node._private.data.label;
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var cloneMarker = node._private.data.clonemarker;

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
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
        var multimerPadding = cyBaseNodeShapes["nucleic acid feature"].multimerPadding;
        var width = node.width();
        var height = node.height();
        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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
    cyBaseNodeShapes["source and sink"] = {
      points: cyMath.generateUnitNgonPoints(4, 0),
      draw: function (context, node) {
        var centerX = node._private.position.x;
        var centerY = node._private.position.y;

        var width = node.width();
        var height = node.height();
        var label = node._private.data.label;
        var pts = cyBaseNodeShapes["source and sink"].points;
        var cloneMarker = node._private.data.clonemarker;

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
      intersectLine: cyBaseNodeShapes["ellipse"].intersectLine,
      checkPoint: cyBaseNodeShapes["ellipse"].checkPoint
    };
  };

  $$.sbgn.drawEllipse = function (context, x, y, width, height) {
    //$$.sbgn.drawEllipsePath(context, x, y, width, height);
    //context.fill();
    cyBaseNodeShapes['ellipse'].draw(context, x, y, width, height);
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

        var recPoints = cyMath.generateUnitNgonPointsFitToSquare(4, 0);
        var cloneX = centerX;
        var cloneY = centerY + 3 / 4 * cornerRadius;
        var cloneWidth = width - 2 * cornerRadius;
        var cloneHeight = cornerRadius / 2;

        drawPolygonPath(context, cloneX, cloneY, cloneWidth, cloneHeight, recPoints);
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

        var cornerRadius = cyMath.getRoundRectangleRadius(width, height);

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

        drawPolygonPath(context,
                cloneX, cloneY,
                cloneWidth, cloneHeight, markerPoints);
        context.fill();

        context.fillStyle = oldStyle;
        context.globalAlpha = oldGlobalAlpha;

//                context.stroke();
      }
    }
  };

  $$.sbgn.closestIntersectionPoint = function (point, intersections) {
    if (intersections.length <= 0)
      return [];

    var closestIntersection = [];
    var minDistance = Number.MAX_VALUE;

    for (var i = 0; i < intersections.length; i = i + 2) {
      var checkPoint = [intersections[i], intersections[i + 1]];
      var distance = cyMath.calculateDistance(point, checkPoint);

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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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

      straightLineIntersections = cyMath.finiteLinesIntersect(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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

      var intersection = cyMath.finiteLinesIntersect(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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
      arcIntersections = cyMath.intersectLineCircle(
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

    var stateAndInfos = node._private.data.statesandinfos;

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
    var stateAndInfos = node._private.data.statesandinfos;

    var stateCount = 0, infoCount = 0;
//    threshold = parseFloat(threshold);

    for (var i = 0; i < stateAndInfos.length; i++) {
      var state = stateAndInfos[i];
      var stateWidth = parseFloat(state.bbox.w) + threshold;
      var stateHeight = parseFloat(state.bbox.h) + threshold;
      var stateCenterX = state.bbox.x * node.width() / 100 + centerX;
      var stateCenterY = state.bbox.y * node.height() / 100 + centerY;

      if (state.clazz == "state variable" && stateCount < 2) {//draw ellipse
        var stateCheckPoint = cyBaseNodeShapes["ellipse"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (stateCheckPoint == true)
          return true;

        stateCount++;
      } else if (state.clazz == "unit of information" && infoCount < 2) {//draw rectangle
        var infoCheckPoint = cyBaseNodeShapes["roundrectangle"].checkPoint(
                x, y, padding, stateWidth, stateHeight, stateCenterX, stateCenterY);

        if (infoCheckPoint == true)
          return true;

        infoCount++;
      }

    }
    return false;
  };

  $$.sbgn.isNodeShapeTotallyOverriden = function (render, node) {
    if (totallyOverridenNodeShapes[render.getNodeShape(node)]) {
      return true;
    }

    return false;
  };
};

},{"../utilities/lib-utilities":13,"../utilities/text-utilities":17}],8:[function(_dereq_,module,exports){
/*
 * Common utilities for elements includes both general utilities and sbgn specific utilities 
 */

var truncateText = _dereq_('./text-utilities').truncateText;
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
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
        if (_class == 'source and sink' || _class == 'nucleic acid feature' || _class == 'dissociation'
            || _class == 'macromolecule' || _class == 'simple chemical' || _class == 'complex'
            || _class == 'unspecified entity' || _class == 'process' || _class == 'omitted process'
            || _class == 'uncertain process' || _class == 'association') {
            return _class;
        }
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
      if (_class === 'association' || _class === 'dissociation') {
        return 20;
      }

      if (_class === 'and' || _class === 'or' || _class === 'not') {
        return this.getDynamicLabelTextSize(ele, 1);
      }

      if (_class.endsWith('process')) {
        return this.getDynamicLabelTextSize(ele, 1.5);
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

      return '' + port.x + '% ' + port.y + '%';
    }
    
    // Section End
    // Stylesheet helpers
};

module.exports = elementUtilities;

},{"./lib-utilities":13,"./option-utilities":15,"./text-utilities":17}],9:[function(_dereq_,module,exports){
/*
 * File Utilities: To be used on read/write file operation
 */

var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var uiUtilities = _dereq_('./ui-utilities');
var graphUtilities = _dereq_('./graph-utilities');
var updateGraph = graphUtilities.updateGraph.bind(graphUtilities);

var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var saveAs = libs.saveAs;

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

function fileUtilities() {}
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

fileUtilities.loadSample = function(filename, folderpath) {
  uiUtilities.startSpinner("load-spinner");
  
  // Users may want to do customized things while a sample is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadSample", [ filename ] ); // Aliases for sbgnvizLoadSampleStart
  $( document ).trigger( "sbgnvizLoadSampleStart", [ filename ] );
  
  // load xml document use default folder path if it is not specified
  var xmlObject = loadXMLDoc((folderpath || 'sample-app/samples/') + filename);
  
  setTimeout(function () {
    updateGraph(sbgnmlToJson.convert(xmlObject));
    uiUtilities.endSpinner("load-spinner");
    $( document ).trigger( "sbgnvizLoadSampleEnd", [ filename ] ); // Trigger an event signaling that a sample is loaded
  }, 0);
};

/*
  callback is a function remotely defined to add specific behavior that isn't implemented here.
  it is completely optional.
  signature: callback(textXml)
*/
fileUtilities.loadSBGNMLFile = function(file, callback) {
  var self = this;
  uiUtilities.startSpinner("load-file-spinner");
  
  // Users may want to do customized things while an external file is being loaded
  // Trigger an event for this purpose and specify the 'filename' as an event parameter
  $( document ).trigger( "sbgnvizLoadFile", [ file.name ] ); // Aliases for sbgnvizLoadFileStart
  $( document ).trigger( "sbgnvizLoadFileStart", [ file.name ] ); 
  
  var textType = /text.*/;

  var reader = new FileReader();

  reader.onload = function (e) {
    var text = this.result;

    setTimeout(function () {
      if (typeof callback !== 'undefined') callback(text);
      updateGraph(sbgnmlToJson.convert(textToXmlObject(text)));
      uiUtilities.endSpinner("load-file-spinner");
      $( document ).trigger( "sbgnvizLoadFileEnd", [ file.name ] ); // Trigger an event signaling that a file is loaded
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

fileUtilities.saveAsSbgnml = function(filename, renderInfo) {
  var sbgnmlText = jsonToSbgnml.createSbgnml(filename, renderInfo);
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

module.exports = fileUtilities;

},{"./graph-utilities":10,"./json-to-sbgnml-converter":11,"./lib-utilities":13,"./sbgnml-to-json-converter":16,"./ui-utilities":18}],10:[function(_dereq_,module,exports){
/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

function graphUtilities() {}

graphUtilities.updateGraph = function(cyGraph) {
  console.log('cy update called');
  $( document ).trigger( "updateGraphStart" );
  // Reset undo/redo stack and buttons when a new graph is loaded
  if (options.undoable) {
    cy.undoRedo().reset();
//    this.resetUndoRedoButtons();
  }

  cy.startBatch();
  // clear data
  cy.remove('*');
  cy.add(cyGraph);

  //add position information to data for preset layout
  var positionMap = {};
  for (var i = 0; i < cyGraph.nodes.length; i++) {
    var xPos = cyGraph.nodes[i].data.bbox.x;
    var yPos = cyGraph.nodes[i].data.bbox.y;
    positionMap[cyGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
  }

  this.refreshPaddings(); // Recalculates/refreshes the compound paddings
  cy.endBatch();
  
  var layout = cy.layout({
    name: 'preset',
    positions: positionMap,
    fit: true,
    padding: 50
  });
  
  // Check this for cytoscape.js backward compatibility
  if (layout && layout.run) {
    layout.run();
  }

  // Update the style
  cy.style().update();
  // Initilize the bend points once the elements are created
  if (cy.edgeBendEditing && cy.edgeBendEditing('initialized')) {
    cy.edgeBendEditing('get').initBendPoints(cy.edges());
  }
  
  $( document ).trigger( "updateGraphEnd" );
};

graphUtilities.calculatePaddings = function(paddingPercent) {
  //As default use the compound padding value
  if (!paddingPercent) {
    var compoundPadding = options.compoundPadding;
    paddingPercent = typeof compoundPadding === 'function' ? compoundPadding.call() : compoundPadding;
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
};

graphUtilities.recalculatePaddings = graphUtilities.refreshPaddings = function() {
  // this.calculatedPaddings is not working here 
  // TODO: replace this reference with this.calculatedPaddings once the reason is figured out
  graphUtilities.calculatedPaddings = this.calculatePaddings();
  return graphUtilities.calculatedPaddings;
};

module.exports = graphUtilities;
},{"./lib-utilities":13,"./option-utilities":15}],11:[function(_dereq_,module,exports){
var txtUtil = _dereq_('./text-utilities');
var libsbgnjs = _dereq_('libsbgn.js');
var renderExtension = libsbgnjs.renderExtension;
var pkgVersion = _dereq_('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = _dereq_('../../package.json').name;

var jsonToSbgnml = {
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
    createSbgnml : function(filename, renderInfo){
        var self = this;
        var sbgnmlText = "";
        var mapID = txtUtil.getXMLValidId(filename);
        var hasExtension = false;
        var hasRenderExtension = false;
        if (typeof renderInfo !== 'undefined') {
            hasExtension = true;
            hasRenderExtension = true;
        }

        //add headers
        xmlHeader = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
        var sbgn = new libsbgnjs.Sbgn({xmlns: 'http://sbgn.org/libsbgn/0.3'});
        var map = new libsbgnjs.Map({language: 'process description', id: mapID});
        if (hasExtension) { // extension is there
            var extension = new libsbgnjs.Extension();
            if (hasRenderExtension) {
                extension.add(self.getRenderExtensionSbgnml(renderInfo));
            }
            map.setExtension(extension);
        }

        // get all glyphs
        var glyphList = [];
        cy.nodes(":visible").each(function(ele, i){
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
        cy.edges(":visible").each(function(ele, i){
            if(typeof ele === "number") {
              ele = i;
            }
            map.addArc(self.getArcSbgnml(ele));
        });

        sbgn.setMap(map);
        return xmlHeader + sbgn.toXML();
    },

    // see createSbgnml for info on the structure of renderInfo
    getRenderExtensionSbgnml : function(renderInfo) {
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
            var xmlStyle = new renderExtension.Style({id: txtUtil.getXMLValidId(key), idList: style.idList.join(' ')});
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
    },

    getGlyphSbgnml : function(node){
        var self = this;
        var sbgnmlText = "";
        var nodeClass = node._private.data.class;
        var glyphList = [];

        var glyph = new libsbgnjs.Glyph({id: node._private.data.id, class_: nodeClass});

        // assign compartmentRef
        if(node.parent().isParent()){
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
            var x = node._private.position.x + ports[i].x * node.width() / 100;
            var y = node._private.position.y + ports[i].y * node.height() / 100;

            glyph.addPort(new libsbgnjs.pPort({id: ports[i].id, x: x, y: y}));
            /*sbgnmlText = sbgnmlText + "<port id='" + ports[i].id+
                "' y='" + y + "' x='" + x + "' />\n";*/
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

        // add glyph members that are not state variables or unit of info: subunits
        if(nodeClass === "complex" || nodeClass === "submap"){
            node.children().each(function(ele, i){
                if(typeof ele === "number") {
                  ele = i;
                }
                var glyphMemberList = self.getGlyphSbgnml(ele);
                for (var i=0; i < glyphMemberList.length; i++) {
                    glyph.addGlyphMember(glyphMemberList[i]);
                }
            });
        }

        // current glyph is done
        glyphList.push(glyph);

        // keep going with all the included glyphs
        if(nodeClass === "compartment"){
            node.children().each(function(ele, i){
                if(typeof ele === "number") {
                  ele = i;
                }
                glyphList = glyphList.concat(self.getGlyphSbgnml(ele));
            });
        }

        return  glyphList;
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

        return arc;
    },

    addGlyphBbox : function(node){
        var width = node.width();
        var height = node.height();
        var x = node._private.position.x - width/2;
        var y = node._private.position.y - height/2;
        return new libsbgnjs.Bbox({x: x, y: y, w: width, h: height});
    },

    addStateAndInfoBbox : function(node, boxGlyph){
        boxBbox = boxGlyph.bbox;

        var x = boxBbox.x / 100 * node.width();
        var y = boxBbox.y / 100 * node.height();

        x = node._private.position.x + (x - boxBbox.w/2);
        y = node._private.position.y + (y - boxBbox.h/2);

        return new libsbgnjs.Bbox({x: x, y: y, w: boxBbox.w, h: boxBbox.h});
    },

    addStateBoxGlyph : function(node, id, mainGlyph){

        var glyph = new libsbgnjs.Glyph({id: id, class_: 'state variable'});
        var state = new libsbgnjs.StateType();
        if(typeof node.state.value != 'undefined')
            state.value = node.state.value;
        if(typeof node.state.variable != 'undefined')
            state.variable = node.state.variable;
        glyph.setState(state);
        glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

        return glyph;
    },

    addInfoBoxGlyph : function(node, id, mainGlyph){
        var glyph = new libsbgnjs.Glyph({id: id, class_: 'unit of information'});
        var label = new libsbgnjs.Label();
        if(typeof node.label.text != 'undefined')
            label.text = node.label.text;
        glyph.setLabel(label);
        glyph.setBbox(this.addStateAndInfoBbox(mainGlyph, node));

        return glyph;
    }
};

module.exports = jsonToSbgnml;

},{"../../package.json":4,"./text-utilities":17,"libsbgn.js":2}],12:[function(_dereq_,module,exports){
/*
 * Listen document for keyboard inputs and exports the utilities that it makes use of
 */
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var keyboardInputUtilities = {
  isNumberKey: function(e) {
    return ( e.keyCode >= 48 && e.keyCode <= 57 ) || ( e.keyCode >= 96 && e.keyCode <= 105 );
  },
  isDotKey: function(e) {
    return e.keyCode === 190;
  },
  isMinusSignKey: function(e) {
    return e.keyCode === 109 || e.keyCode === 189;
  },
  isLeftKey: function(e) {
    return e.keyCode === 37;
  },
  isRightKey: function(e) {
    return e.keyCode === 39;
  },
  isBackspaceKey: function(e) {
    return e.keyCode === 8;
  },
  isTabKey: function(e) {
    return e.keyCode === 9;
  },
  isEnterKey: function(e) {
    return e.keyCode === 13;
  },
  isIntegerFieldInput: function(value, e) {
    return this.isCtrlOrCommandPressed(e) || this.isMinusSignKey(e) || this.isNumberKey(e) 
            || this.isBackspaceKey(e) || this.isTabKey(e) || this.isLeftKey(e) || this.isRightKey(e) || this.isEnterKey(e);
  },
  isFloatFieldInput: function(value, e) {
    return this.isIntegerFieldInput(value, e) || this.isDotKey(e);
  },
  isCtrlOrCommandPressed: function(e) {
    return e.ctrlKey || e.metaKey;
  }
};

$(document).ready(function () {
  $(document).on('keydown', '.integer-input', function(e){
    var value = $(this).attr('value');
    return keyboardInputUtilities.isIntegerFieldInput(value, e);
  });
  
  $(document).on('keydown', '.float-input', function(e){
    var value = $(this).attr('value');
    return keyboardInputUtilities.isFloatFieldInput(value, e);
  });
  
  $(document).on('change', '.integer-input,.float-input', function(e){
    var min   = $(this).attr('min');
    var max   = $(this).attr('max');
    var value = parseFloat($(this).val());
    
    if(min != null) {
      min = parseFloat(min);
    }
    
    if(max != null) {
      max = parseFloat(max);
    }
    
    if(min != null && value < min) {
      value = min;
    }
    else if(max != null && value > max) {
      value = max;
    }
    
    if(isNaN(value)) {
      if(min != null) {
        value = min;
      }
      else if(max != null) {
        value = max;
      }
      else {
        value = 0;
      }
    }
    
    $(this).val("" + value);
  });
});

module.exports = keyboardInputUtilities;

},{"./lib-utilities":13,"./option-utilities":15}],13:[function(_dereq_,module,exports){
/* 
 * Utility file to get and set the libraries to which sbgnviz is dependent from any file.
 */

var libUtilities = function(){
};

libUtilities.setLibs = function(libs) {
  this.libs = libs;
};

libUtilities.getLibs = function() {
  return this.libs;
};

module.exports = libUtilities;


},{}],14:[function(_dereq_,module,exports){
/* 
 * These are the main utilities to be directly utilized by the user interactions.
 * Idealy, this file is just required by index.js
 */

var elementUtilities = _dereq_('./element-utilities');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var optionUtilities = _dereq_('./option-utilities');

var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

// Helpers start
function beforePerformLayout() {
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
};
// Helpers end

function mainUtilities() {}

// Expand given nodes. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandNodes = function(nodes) {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodesToExpand = expandCollapse.expandableNodes(nodes);
  if (nodesToExpand.length == 0) {
    return;
  }
  if(options.undoable) {
    cy.undoRedo().do("expand", {
      nodes: nodesToExpand,
    });
  }
  else {
    expandCollapse.expand(nodes);
  }
};

// Collapse given nodes. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseNodes = function(nodes) {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  if (expandCollapse.collapsibleNodes(nodes).length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("collapse", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.collapse(nodes);
  }
};

// Collapse all complexes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseComplexes = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var complexes = cy.nodes("[class='complex']");
  if (expandCollapse.collapsibleNodes(complexes).length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: complexes
    });
  }
  else {
    expandCollapse.collapseRecursively(complexes);
  }
};

// Expand all complexes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandComplexes = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = expandCollapse.expandableNodes(cy.nodes().filter("[class='complex']"));
  if (nodes.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.expandRecursively(nodes);
  }
};

// Collapse all nodes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.collapseAll = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = cy.nodes(':visible');
  if (expandCollapse.collapsibleNodes(nodes).length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("collapseRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.collapseRecursively(nodes);
  }
};

// Expand all nodes recursively. Requires expandCollapse extension and considers undoable option.
mainUtilities.expandAll = function() {
  // Get expandCollapse api
  var expandCollapse = cy.expandCollapse('get');
  
  var nodes = expandCollapse.expandableNodes(cy.nodes(':visible'));
  if (nodes.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("expandRecursively", {
      nodes: nodes
    });
  }
  else {
    expandCollapse.expandRecursively(nodes);
  }
};

// Extends the given nodes list in a smart way to leave the map intact and hides the resulting list. 
// Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.hideNodesSmart = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  
  var allNodes = cy.nodes(":visible");
  var nodesToShow = elementUtilities.extendRemainingNodes(nodes, allNodes);
  var nodesToHide = allNodes.not(nodesToShow);

  if (nodesToHide.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", nodesToHide);
  }
  else {
    viewUtilities.hide(nodesToHide);
  }
};

// Extends the given nodes list in a smart way to leave the map intact. 
// Then unhides the resulting list and hides others. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.showNodesSmart = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  
  var allNodes = cy.elements();
  var nodesToShow = elementUtilities.extendNodeList(nodes);
  var nodesToHide = allNodes.not(nodesToShow);
  
  if (nodesToHide.length === 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("hide", nodesToHide);
  }
  else {
    viewUtilities.hide(nodesToHide);
  }
};

// Unhides all elements. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.showAll = function() {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (cy.elements().length === cy.elements(':visible').length) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("show", cy.elements());
  }
  else {
    viewUtilities.show(cy.elements());
  }
};

// Removes the given elements in a simple way. Considers 'undoable' option.
mainUtilities.deleteElesSimple = function(eles) {
  if (eles.length == 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("deleteElesSimple", {
      eles: eles
    });
  }
  else {
    eles.remove();
  }
};

// Extends the given nodes list in a smart way to leave the map intact and removes the resulting list. 
// Considers 'undoable' option.
mainUtilities.deleteNodesSmart = function(_nodes) {
  var nodes = _nodes.nodes();
  if (nodes.length == 0) {
    return;
  }
  
  if(options.undoable) {
    cy.undoRedo().do("deleteNodesSmart", {
      firstTime: true,
      eles: nodes
    });
  }
  else {
    elementUtilities.deleteNodesSmart(nodes);
  }
};

// Highlights neighbours of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.highlightNeighbours = function(_nodes) {
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  var elesToHighlight = elementUtilities.getNeighboursOfNodes(nodes);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    viewUtilities.highlight(elesToHighlight);
  }
};

// Finds the elements whose label includes the given label and highlights processes of those elements.
// Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.searchByLabel = function(label) {
  if (label.length == 0) {
    return;
  }
  
  var nodesToHighlight = cy.nodes(":visible").filter(function (ele, i) {
    if(typeof ele === "number") {
      ele = i;
    }
    if (ele.data("label") && ele.data("label").toLowerCase().indexOf(label) >= 0) {
      return true;
    }
    return false;
  });

  if (nodesToHighlight.length == 0) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');

  nodesToHighlight = elementUtilities.extendNodeList(nodesToHighlight);
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", nodesToHighlight);
  }
  else {
    viewUtilities.highlight(nodesToHighlight);
  }
};

// Highlights processes of the given nodes. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.highlightProcesses = function(_nodes) {
  var nodes = _nodes.nodes(); // Ensure that nodes list just include nodes
  var elesToHighlight = elementUtilities.extendNodeList(nodes);
  if (elesToHighlight.length === 0) {
    return;
  }
  var notHighlightedEles = cy.elements(".nothighlighted").filter(":visible");
  var highlightedEles = cy.elements(':visible').difference(notHighlightedEles);
  if (elesToHighlight.same(highlightedEles)) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (options.undoable) {
    cy.undoRedo().do("highlight", elesToHighlight);
  }
  else {
    viewUtilities.highlight(elesToHighlight);
  }
};

// Unhighlights any highlighted element. Requires viewUtilities extension and considers 'undoable' option.
mainUtilities.removeHighlights = function() {
  if (elementUtilities.noneIsNotHighlighted()) {
    return;
  }
  
  // If this function is being called we can assume that view utilities extension is on use
  var viewUtilities = cy.viewUtilities('get');
  
  if (options.undoable) {
    cy.undoRedo().do("removeHighlights");
  }
  else {
    viewUtilities.removeHighlights();
  }
};

// Performs layout by given layoutOptions. Considers 'undoable' option. However, by setting notUndoable parameter
// to a truthy value you can force an undable layout operation independant of 'undoable' option.
mainUtilities.performLayout = function(layoutOptions, notUndoable) {
  // Things to do before performing layout
  beforePerformLayout();
  
  if (!options.undoable || notUndoable) { // 'notUndoable' flag can be used to have composite actions in undo/redo stack
    var layout = cy.elements().filter(':visible').layout(layoutOptions);
    
    // Check this for cytoscape.js backward compatibility
    if (layout && layout.run) {
      layout.run();
    }
  }
  else {
    cy.undoRedo().do("layout", {
      options: layoutOptions,
      eles: cy.elements().filter(':visible')
    });
  }
};

// Creates an sbgnml file content from the exising graph and returns it.
mainUtilities.createSbgnml = function() {
  return jsonToSbgnml.createSbgnml();
};

// Converts given sbgnml data to a json object in a special format 
// (http://js.cytoscape.org/#notation/elements-json) and returns it.
mainUtilities.convertSbgnmlToJson = function(data) {
  return sbgnmlToJson.convert(data);
};

// Create the qtip contents of the given node and returns it.
mainUtilities.getQtipContent = function(node) {
  return elementUtilities.getQtipContent(node);
};

module.exports = mainUtilities;
},{"./element-utilities":8,"./json-to-sbgnml-converter":11,"./lib-utilities":13,"./option-utilities":15,"./sbgnml-to-json-converter":16}],15:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file 
 */

// default options
var defaults = {
  // The path of core library images when sbgnviz is required from npm and the index html 
  // file and node_modules are under the same folder then using the default value is fine
  imgPath: 'node_modules/sbgnviz/src/img',
  // Whether to fit labels to nodes
  fitLabelsToNodes: function () {
    return false;
  },
  // dynamic label size it may be 'small', 'regular', 'large'
  dynamicLabelSize: function () {
    return 'regular';
  },
  // percentage used to calculate compound paddings
  compoundPadding: function () {
    return 10;
  },
  // extra padding for compartment
  extraCompartmentPadding: 10,
  // The selector of the component containing the sbgn network
  networkContainerSelector: '#sbgn-network-container',
  // Whether the actions are undoable, requires cytoscape-undo-redo extension
  undoable: true
};

var optionUtilities = function () {
};

// Extend the defaults options with the user options
optionUtilities.extendOptions = function (options) {
  var result = {};

  for (var prop in defaults) {
    result[prop] = defaults[prop];
  }
  
  for (var prop in options) {
    result[prop] = options[prop];
  }

  optionUtilities.options = result;

  return options;
};

optionUtilities.getOptions = function () {
  return optionUtilities.options;
};

module.exports = optionUtilities;

},{}],16:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');
var libsbgnjs = _dereq_('libsbgn.js');
var renderExtension = libsbgnjs.renderExtension;

var sbgnmlToJson = {
  insertedNodes: {},
  getAllCompartments: function (glyphList) {
    var compartments = [];

    for (var i = 0; i < glyphList.length; i++) {
      if (glyphList[i].class_ == 'compartment') {
        var compartment = glyphList[i];
        var bbox = compartment.bbox;
        compartments.push({
          'x': parseFloat(bbox.x),
          'y': parseFloat(bbox.y),
          'w': parseFloat(bbox.w),
          'h': parseFloat(bbox.h),
          'id': compartment.id
        });
      }
    }

    compartments.sort(function (c1, c2) {
      if (c1.h * c1.w < c2.h * c2.w) {
        return -1;
      }
      if (c1.h * c1.w > c2.h * c2.w) {
        return 1;
      }
      return 0;
    });

    return compartments;
  },
  isInBoundingBox: function (bbox1, bbox2) {
    if (bbox1.x > bbox2.x &&
        bbox1.y > bbox2.y &&
        bbox1.x + bbox1.w < bbox2.x + bbox2.w &&
        bbox1.y + bbox1.h < bbox2.y + bbox2.h) {
      return true;
    }
    return false;
  },
  bboxProp: function (ele) {
    var bbox = ele.bbox;

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2;

    return bbox;
  },
  stateAndInfoBboxProp: function (ele, parentBbox) {
    var xPos = parseFloat(parentBbox.x);
    var yPos = parseFloat(parentBbox.y);

    var bbox = ele.bbox;

    // set positions as center
    bbox.x = parseFloat(bbox.x) + parseFloat(bbox.w) / 2 - xPos;
    bbox.y = parseFloat(bbox.y) + parseFloat(bbox.h) / 2 - yPos;

    bbox.x = bbox.x / parseFloat(parentBbox.w) * 100;
    bbox.y = bbox.y / parseFloat(parentBbox.h) * 100;

    return bbox;
  },
  findChildNodes: function (ele, childTagName) {
    // find child nodes at depth level of 1 relative to the element
    var children = [];
    for (var i = 0; i < ele.childNodes.length; i++) {
      var child = ele.childNodes[i];
      if (child.nodeType === 1 && child.tagName === childTagName) {
        children.push(child);
      }
    }
    return children;
  },
  findChildNode: function (ele, childTagName) {
    var nodes = this.findChildNodes(ele, childTagName);
    return nodes.length > 0 ? nodes[0] : undefined;
  },
  stateAndInfoProp: function (ele, parentBbox) {
    var self = this;
    var stateAndInfoArray = [];

    var childGlyphs = ele.glyphMembers; // this.findChildNodes(ele, 'glyph');

    for (var i = 0; i < childGlyphs.length; i++) {
      var glyph = childGlyphs[i];
      var info = {};

      if (glyph.class_ === 'unit of information') {
        info.id = glyph.id || undefined;
        info.clazz = glyph.class_ || undefined;
        info.label = {
          'text': (glyph.label && glyph.label.text) || undefined
        };
        info.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        stateAndInfoArray.push(info);
      } else if (glyph.class_ === 'state variable') {
        info.id = glyph.id || undefined;
        info.clazz = glyph.class_ || undefined;
        var state = glyph.state;
        var value = (state && state.value) || undefined;
        var variable = (state && state.variable) || undefined;
        info.state = {
          'value': value,
          'variable': variable
        };
        info.bbox = self.stateAndInfoBboxProp(glyph, parentBbox);
        stateAndInfoArray.push(info);
      }
    }


    return stateAndInfoArray;
  },
  addParentInfoToNode: function (ele, nodeObj, parent, compartments) {
    var self = this;
    var compartmentRef = ele.compartmentRef;

    if (parent) {
      nodeObj.parent = parent;
      return;
    }

    if (compartmentRef) {
      nodeObj.parent = compartmentRef;
    } else {
      nodeObj.parent = '';

      // add compartment according to geometry
      for (var i = 0; i < compartments.length; i++) {
        var bboxEl = ele.bbox;
        var bbox = {
          'x': parseFloat(bboxEl.x),
          'y': parseFloat(bboxEl.y),
          'w': parseFloat(bboxEl.w),
          'h': parseFloat(bboxEl.h),
          'id': ele.id
        };
        if (self.isInBoundingBox(bbox, compartments[i])) {
          nodeObj.parent = compartments[i].id;
          break;
        }
      }
    }
  },
  addCytoscapeJsNode: function (ele, jsonArray, parent, compartments) {
    var self = this;
    var nodeObj = {};

    // add id information
    nodeObj.id = ele.id;
    // add node bounding box information
    nodeObj.bbox = self.bboxProp(ele);
    // add class information
    nodeObj.class = ele.class_;
    // add label information
    nodeObj.label = (ele.label && ele.label.text) || undefined;
    // add state and info box information
    nodeObj.statesandinfos = self.stateAndInfoProp(ele, nodeObj.bbox);
    // adding parent information
    self.addParentInfoToNode(ele, nodeObj, parent, compartments);

    // add clone information
    if (ele.clone) {
      nodeObj.clonemarker = true;
    } else {
      nodeObj.clonemarker = undefined;
    }

    // add port information
    var ports = [];
    var portElements = ele.ports;

    for (var i = 0; i < portElements.length; i++) {
      var portEl = portElements[i];
      var id = portEl.id;
      var relativeXPos = parseFloat(portEl.x) - nodeObj.bbox.x;
      var relativeYPos = parseFloat(portEl.y) - nodeObj.bbox.y;

      relativeXPos = relativeXPos / parseFloat(nodeObj.bbox.w) * 100;
      relativeYPos = relativeYPos / parseFloat(nodeObj.bbox.h) * 100;

      ports.push({
        id: id,
        x: relativeXPos,
        y: relativeYPos
      });
    }

    nodeObj.ports = ports;

    var cytoscapeJsNode = {data: nodeObj};
    jsonArray.push(cytoscapeJsNode);
  },
  traverseNodes: function (ele, jsonArray, parent, compartments) {
    var elId = ele.id;
    if (!elementUtilities.handledElements[ele.class_]) {
      return;
    }
    this.insertedNodes[elId] = true;
    var self = this;
    // add complex nodes here

    var eleClass = ele.class_;

    if (eleClass === 'complex' || eleClass === 'complex multimer' || eleClass === 'submap') {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);

      var childGlyphs = ele.glyphMembers;
      for (var i = 0; i < childGlyphs.length; i++) {
        var glyph = childGlyphs[i];
        var glyphClass = glyph.class_;
        if (glyphClass !== 'state variable' && glyphClass !== 'unit of information') {
          self.traverseNodes(glyph, jsonArray, elId, compartments);
        }
      }
    } else {
      self.addCytoscapeJsNode(ele, jsonArray, parent, compartments);
    }
  },
  getPorts: function (xmlObject) {
    return ( xmlObject._cachedPorts = xmlObject._cachedPorts || xmlObject.querySelectorAll('port'));
  },
  getGlyphs: function (xmlObject) {
    var glyphs = xmlObject._cachedGlyphs;

    if (!glyphs) {
      glyphs = xmlObject._cachedGlyphs = xmlObject._cachedGlyphs || xmlObject.querySelectorAll('glyph');

      var id2glyph = xmlObject._id2glyph = {};

      for ( var i = 0; i < glyphs.length; i++ ) {
        var g = glyphs[i];
        var id = g.getAttribute('id');

        id2glyph[ id ] = g;
      }
    }

    return glyphs;
  },
  getGlyphById: function (xmlObject, id) {
    this.getGlyphs(xmlObject); // make sure cache is built

    return xmlObject._id2glyph[id];
  },
  getArcSourceAndTarget: function (arc, xmlObject) {
    // source and target can be inside of a port
    var source = arc.source;
    var target = arc.target;
    var sourceNodeId;
    var targetNodeId;

    var sourceExists = this.getGlyphById(xmlObject, source);
    var targetExists = this.getGlyphById(xmlObject, target);

    if (sourceExists) {
      sourceNodeId = source;
    }

    if (targetExists) {
      targetNodeId = target;
    }


    var i;
    var portEls = this.getPorts(xmlObject);
    var port;
    if (sourceNodeId === undefined) {
      for (i = 0; i < portEls.length; i++ ) {
        port = portEls[i];
        if (port.getAttribute('id') === source) {
          sourceNodeId = port.parentElement.getAttribute('id');
        }
      }
    }

    if (targetNodeId === undefined) {
      for (i = 0; i < portEls.length; i++) {
        port = portEls[i];
        if (port.getAttribute('id') === target) {
          targetNodeId = port.parentElement.getAttribute('id');
        }
      }
    }

    return {'source': sourceNodeId, 'target': targetNodeId};
  },

  getArcBendPointPositions: function (ele) {
    var bendPointPositions = [];

    var children = ele.nexts;

    for (var i = 0; i < children.length; i++) {
      var posX = children[i].x;
      var posY = children[i].y;

      bendPointPositions.push({
        x: posX,
        y: posY
      });
    }

    return bendPointPositions;
  },
  addCytoscapeJsEdge: function (ele, jsonArray, xmlObject) {
    if (!elementUtilities.handledElements[ele.class_]) {
      return;
    }

    var self = this;
    var sourceAndTarget = self.getArcSourceAndTarget(ele, xmlObject);

    if (!this.insertedNodes[sourceAndTarget.source] || !this.insertedNodes[sourceAndTarget.target]) {
      return;
    }

    var edgeObj = {};
    var bendPointPositions = self.getArcBendPointPositions(ele);

    edgeObj.id = ele.id || undefined;
    edgeObj.class = ele.class_;
    edgeObj.bendPointPositions = bendPointPositions;

    edgeObj.cardinality = 0;
    if (ele.glyphs.length > 0) {
      for (var i = 0; i < ele.glyphs.length; i++) {
        if (ele.glyphs[i].class_ === 'cardinality') {
          var label = ele.glyphs[i].label;
          edgeObj.cardinality = label.text || undefined;
        }
      }
    }

    edgeObj.source = sourceAndTarget.source;
    edgeObj.target = sourceAndTarget.target;

    edgeObj.portsource = ele.source;
    edgeObj.porttarget = ele.target;

    var cytoscapeJsEdge = {data: edgeObj};
    jsonArray.push(cytoscapeJsEdge);
  },
  applyStyle: function (renderInformation, nodes, edges) {
    // get all color id references to their value
    var colorList = renderInformation.listOfColorDefinitions.colorDefinitions;
    var colorIDToValue = {};
    for (var i=0; i < colorList.length; i++) {
      colorIDToValue[colorList[i].id] = colorList[i].value;
    }

    // convert style list to elementId-indexed object pointing to style
    // also convert color references to color values
    var styleList = renderInformation.listOfStyles.styles;
    var elementIDToStyle = {};
    for (var i=0; i < styleList.length; i++) {
      var style = styleList[i];
      var renderGroup = style.renderGroup;

      // convert color references
      if (renderGroup.stroke != null) {
        renderGroup.stroke = colorIDToValue[renderGroup.stroke];
      }
      if (renderGroup.fill != null) {
        renderGroup.fill = colorIDToValue[renderGroup.fill];
      }

      var idList = style.idList.split(' ');
      for (var j=0; j < idList.length; j++) {
        var id = idList[j];
        elementIDToStyle[id] = renderGroup;
      }
    }

    function hexToDecimal (hex) {
      return Math.round(parseInt('0x'+hex) / 255 * 100) / 100;
    }

    function convertHexColor (hex) {
      if (hex.length == 7) { // no opacity provided
        return {opacity: null, color: hex};
      }
      else { // length of 9
        var color = hex.slice(0,7);
        var opacity = hexToDecimal(hex.slice(-2));
        return {opacity: opacity, color: color};
      }
    }

    // apply the style to nodes and overwrite the default style
    for (var i=0; i < nodes.length; i++) {
      var node = nodes[i];
      // special case for color properties, we need to check opacity
      var bgColor = elementIDToStyle[node.data['id']].fill;
      if (bgColor) {
        var res = convertHexColor(bgColor);
        node.data['background-color'] = res.color;
        node.data['background-opacity'] = res.opacity;
      }

      var borderColor = elementIDToStyle[node.data['id']].stroke;
      if (borderColor) {
        var res = convertHexColor(borderColor);
        node.data['border-color'] = res.color;
      }

      var borderWidth = elementIDToStyle[node.data['id']].strokeWidth;
      if (borderWidth) {
        node.data['border-width'] = borderWidth;
      }

      var fontSize = elementIDToStyle[node.data['id']].fontSize;
      if (fontSize) {
        node.data['font-size'] = fontSize;
      }

      var fontFamily = elementIDToStyle[node.data['id']].fontFamily;
      if (fontFamily) {
        node.data['font-family'] = fontFamily;
      }

      var fontStyle = elementIDToStyle[node.data['id']].fontStyle;
      if (fontStyle) {
        node.data['font-style'] = fontStyle;
      }

      var fontWeight = elementIDToStyle[node.data['id']].fontWeight;
      if (fontWeight) {
        node.data['font-weight'] = fontWeight;
      }

      var textAnchor = elementIDToStyle[node.data['id']].textAnchor;
      if (textAnchor) {
        node.data['text-halign'] = textAnchor;
      }

      var vtextAnchor = elementIDToStyle[node.data['id']].vtextAnchor;
      if (vtextAnchor) {
        node.data['text-valign'] = vtextAnchor;
      }
    }

    // do the same for edges
    for (var i=0; i < edges.length; i++) {
      var edge = edges[i];

      var lineColor = elementIDToStyle[edge.data['id']].stroke;
      if (lineColor) {
        var res = convertHexColor(lineColor);
        edge.data['line-color'] = res.color;
      }

      var width = elementIDToStyle[edge.data['id']].strokeWidth;
      if (width) {
        edge.data['width'] = width;
      }
    }
  },
  convert: function (xmlObject) {
    var self = this;
    var cytoscapeJsNodes = [];
    var cytoscapeJsEdges = [];

    var sbgn = libsbgnjs.Sbgn.fromXML(xmlObject.querySelector('sbgn'));
    var compartments = self.getAllCompartments(sbgn.map.glyphs);

    var glyphs = sbgn.map.glyphs;
    var arcs = sbgn.map.arcs;

    var i;
    for (i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];
      self.traverseNodes(glyph, cytoscapeJsNodes, '', compartments);
    }

    for (i = 0; i < arcs.length; i++) {
      var arc = arcs[i];
      self.addCytoscapeJsEdge(arc, cytoscapeJsEdges, xmlObject);
    }

    if (sbgn.map.extension.has('renderInformation')) { // render extension was found
      self.applyStyle(sbgn.map.extension.get('renderInformation'), cytoscapeJsNodes, cytoscapeJsEdges);
    }

    var cytoscapeJsGraph = {};
    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    this.insertedNodes = {};

    return cytoscapeJsGraph;
  }
};

module.exports = sbgnmlToJson;

},{"./element-utilities":8,"libsbgn.js":2}],17:[function(_dereq_,module,exports){
/*
 * Text utilities for common usage
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();

var textUtilities = {
  //TODO: use CSS's "text-overflow:ellipsis" style instead of function below?
  truncateText: function (textProp, font) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;
    
    var fitLabelsToNodes = options.fitLabelsToNodes;
    fitLabelsToNodes = typeof fitLabelsToNodes === 'function' ? fitLabelsToNodes.call() : fitLabelsToNodes;
    
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
  },

  // ensure that returned string follows xsd:ID standard
  // should follow r'^[a-zA-Z_][\w.-]*$'
  getXMLValidId: function(originalId) {
    var newId = "";
    var xmlValidRegex = /^[a-zA-Z_][\w.-]*$/;
    if (! xmlValidRegex.test(originalId)) { // doesn't comply
      newId = originalId;
      newId = newId.replace(/[^\w.-]/g, "");
      if (! xmlValidRegex.test(newId)) { // still doesn't comply
        newId = "_" + newId;
        if (! xmlValidRegex.test(newId)) { // normally we should never enter this
          // if for some obscure reason we still don't comply, throw error.
          throw new Error("Can't make identifer comply to xsd:ID requirements: "+newId);
        }
      }
      return newId;
    }
    else {
      return originalId;
    }
  }

};

module.exports = textUtilities;
},{"./option-utilities":15}],18:[function(_dereq_,module,exports){
/*
 * Commonly needed UI Utilities
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

var uiUtilities = {
  startSpinner: function (className) {
    if (!className) {
      className = 'default-class';
    }
    
    if ($('.' + className).length === 0) {
      var containerWidth = $(options.networkContainerSelector).width();
      var containerHeight = $(options.networkContainerSelector).height();
      $(options.networkContainerSelector + ':parent').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw ' + className + '"></i>');
    }
  },
  endSpinner: function (className) {
    if (!className) {
      className = 'default-class';
    }
    
    if ($('.' + className).length > 0) {
      $('.' + className).remove();
    }
  }
};

module.exports = uiUtilities;



},{"./lib-utilities":13,"./option-utilities":15}],19:[function(_dereq_,module,exports){
/*
 * This file exports the functions to be utilized in undoredo extension actions 
 */
var elementUtilities = _dereq_('./element-utilities');

var undoRedoActionFunctions = {
  // Section Start
  // Add/remove action functions
  deleteElesSimple: function (param) {
    return elementUtilities.deleteElesSimple(param.eles);
  },
  restoreEles: function (eles) {
    var param = {};
    param.eles = elementUtilities.restoreEles(eles);
    return param;
  },
  deleteNodesSmart: function (param) {
    if (param.firstTime) {
      return elementUtilities.deleteNodesSmart(param.eles);
    }
    return elementUtilities.deleteElesSimple(param.eles);
  },
  // Section End
  // Add/remove action functions
};

module.exports = undoRedoActionFunctions;
},{"./element-utilities":8}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy9saWJzYmduLXJlbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9saWJzYmduLmpzL2xpYnNiZ24uanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy91dGlsaXRpZXMuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvaW5kZXguanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UuanMiLCJzcmMvc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXIuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3NiZ25tbC10by1qc29uLWNvbnZlcnRlci5qcyIsInNyYy91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VpLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3p4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xuXG52YXIgbnMgPSB7fTtcblxubnMueG1sbnMgPSBcImh0dHA6Ly93d3cuc2JtbC5vcmcvc2JtbC9sZXZlbDMvdmVyc2lvbjEvcmVuZGVyL3ZlcnNpb24xXCI7XG5cbi8vIC0tLS0tLS0gQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cbm5zLkNvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ3ZhbHVlJ10pO1xuXHR0aGlzLmlkIFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMudmFsdWUgXHQ9IHBhcmFtcy52YWx1ZTtcbn07XG5cbm5zLkNvbG9yRGVmaW5pdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxjb2xvckRlZmluaXRpb25cIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhbHVlPSdcIit0aGlzLnZhbHVlK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuQ29sb3JEZWZpbml0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdGlmICh4bWwudGFnTmFtZSAhPSAnY29sb3JEZWZpbml0aW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgY29sb3JEZWZpbml0aW9uLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgbnMuQ29sb3JEZWZpbml0aW9uKCk7XG5cdGNvbG9yRGVmaW5pdGlvbi5pZCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRjb2xvckRlZmluaXRpb24udmFsdWUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdHJldHVybiBjb2xvckRlZmluaXRpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY29sb3JEZWZpbml0aW9ucyA9IFtdO1xufTtcblxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUuYWRkQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24gKGNvbG9yRGVmaW5pdGlvbikge1xuXHR0aGlzLmNvbG9yRGVmaW5pdGlvbnMucHVzaChjb2xvckRlZmluaXRpb24pO1xufTtcblxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxsaXN0T2ZDb2xvckRlZmluaXRpb25zPlxcblwiO1xuXHRmb3IodmFyIGk9MDsgaTx0aGlzLmNvbG9yRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY29sb3JEZWZpbml0aW9uID0gdGhpcy5jb2xvckRlZmluaXRpb25zW2ldO1xuXHRcdHhtbFN0cmluZyArPSBjb2xvckRlZmluaXRpb24udG9YTUwoKTtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2xpc3RPZkNvbG9yRGVmaW5pdGlvbnM+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdGlmICh4bWwudGFnTmFtZSAhPSAnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgbnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xuXG5cdHZhciBjb2xvckRlZmluaXRpb25zID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjb2xvckRlZmluaXRpb24nKTtcblx0Zm9yICh2YXIgaT0wOyBpPGNvbG9yRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY29sb3JEZWZpbml0aW9uWE1MID0gY29sb3JEZWZpbml0aW9uc1tpXTtcblx0XHR2YXIgY29sb3JEZWZpbml0aW9uID0gbnMuQ29sb3JEZWZpbml0aW9uLmZyb21YTUwoY29sb3JEZWZpbml0aW9uWE1MKTtcblx0XHRsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFkZENvbG9yRGVmaW5pdGlvbihjb2xvckRlZmluaXRpb24pO1xuXHR9XG5cdHJldHVybiBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xufTtcbi8vIC0tLS0tLS0gRU5EIExJU1RPRkNPTE9SREVGSU5JVElPTlMgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFJFTkRFUkdST1VQIC0tLS0tLS1cbm5zLlJlbmRlckdyb3VwID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHQvLyBlYWNoIG9mIHRob3NlIGFyZSBvcHRpb25hbCwgc28gdGVzdCBpZiBpdCBpcyBkZWZpbmVkIGlzIG1hbmRhdG9yeVxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2ZvbnRTaXplJywgJ2ZvbnRGYW1pbHknLCAnZm9udFdlaWdodCcsIFxuXHRcdCdmb250U3R5bGUnLCAndGV4dEFuY2hvcicsICd2dGV4dEFuY2hvcicsICdmaWxsJywgJ2lkJywgJ3N0cm9rZScsICdzdHJva2VXaWR0aCddKTtcblx0Ly8gc3BlY2lmaWMgdG8gcmVuZGVyR3JvdXBcblx0dGhpcy5mb250U2l6ZSBcdFx0PSBwYXJhbXMuZm9udFNpemU7XG5cdHRoaXMuZm9udEZhbWlseSBcdD0gcGFyYW1zLmZvbnRGYW1pbHk7XG5cdHRoaXMuZm9udFdlaWdodCBcdD0gcGFyYW1zLmZvbnRXZWlnaHQ7XG5cdHRoaXMuZm9udFN0eWxlIFx0XHQ9IHBhcmFtcy5mb250U3R5bGU7XG5cdHRoaXMudGV4dEFuY2hvciBcdD0gcGFyYW1zLnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3Ncblx0dGhpcy52dGV4dEFuY2hvciBcdD0gcGFyYW1zLnZ0ZXh0QW5jaG9yOyAvLyBwcm9iYWJseSB1c2VsZXNzXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMkRcblx0dGhpcy5maWxsIFx0XHRcdD0gcGFyYW1zLmZpbGw7IC8vIGZpbGwgY29sb3Jcblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUxRFxuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLnN0cm9rZSBcdFx0PSBwYXJhbXMuc3Ryb2tlOyAvLyBzdHJva2UgY29sb3Jcblx0dGhpcy5zdHJva2VXaWR0aCBcdD0gcGFyYW1zLnN0cm9rZVdpZHRoO1xufTtcblxubnMuUmVuZGVyR3JvdXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8Z1wiO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRTaXplICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFNpemU9J1wiK3RoaXMuZm9udFNpemUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuZm9udEZhbWlseSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRGYW1pbHk9J1wiK3RoaXMuZm9udEZhbWlseStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5mb250V2VpZ2h0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZm9udFdlaWdodD0nXCIrdGhpcy5mb250V2VpZ2h0K1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRTdHlsZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGZvbnRTdHlsZT0nXCIrdGhpcy5mb250U3R5bGUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMudGV4dEFuY2hvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHRleHRBbmNob3I9J1wiK3RoaXMudGV4dEFuY2hvcitcIidcIjtcblx0fVxuXHRpZiAodGhpcy52dGV4dEFuY2hvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZ0ZXh0QW5jaG9yPSdcIit0aGlzLnZ0ZXh0QW5jaG9yK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLnN0cm9rZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHN0cm9rZT0nXCIrdGhpcy5zdHJva2UrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMuc3Ryb2tlV2lkdGggIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBzdHJva2VXaWR0aD0nXCIrdGhpcy5zdHJva2VXaWR0aCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5maWxsICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgZmlsbD0nXCIrdGhpcy5maWxsK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuUmVuZGVyR3JvdXAuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdnJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgcmVuZGVyR3JvdXAgPSBuZXcgbnMuUmVuZGVyR3JvdXAoe30pO1xuXHRyZW5kZXJHcm91cC5pZCBcdFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdHJlbmRlckdyb3VwLmZvbnRTaXplIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250U2l6ZScpO1xuXHRyZW5kZXJHcm91cC5mb250RmFtaWx5IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250RmFtaWx5Jyk7XG5cdHJlbmRlckdyb3VwLmZvbnRXZWlnaHQgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRXZWlnaHQnKTtcblx0cmVuZGVyR3JvdXAuZm9udFN0eWxlIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250U3R5bGUnKTtcblx0cmVuZGVyR3JvdXAudGV4dEFuY2hvciBcdD0geG1sLmdldEF0dHJpYnV0ZSgndGV4dEFuY2hvcicpO1xuXHRyZW5kZXJHcm91cC52dGV4dEFuY2hvciA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Z0ZXh0QW5jaG9yJyk7XG5cdHJlbmRlckdyb3VwLnN0cm9rZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdzdHJva2UnKTtcblx0cmVuZGVyR3JvdXAuc3Ryb2tlV2lkdGggPSB4bWwuZ2V0QXR0cmlidXRlKCdzdHJva2VXaWR0aCcpO1xuXHRyZW5kZXJHcm91cC5maWxsIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKTtcblx0cmV0dXJuIHJlbmRlckdyb3VwO1xufTtcbi8vIC0tLS0tLS0gRU5EIFJFTkRFUkdST1VQIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBTVFlMRSAtLS0tLS0tXG4vLyBsb2NhbFN0eWxlIGZyb20gc3BlY3Ncbm5zLlN0eWxlID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbmFtZScsICdpZExpc3QnLCAncmVuZGVyR3JvdXAnXSk7XG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMubmFtZSBcdFx0XHQ9IHBhcmFtcy5uYW1lO1xuXHR0aGlzLmlkTGlzdCBcdFx0PSBwYXJhbXMuaWRMaXN0OyAvLyBUT0RPIGFkZCB1dGlsaXR5IGZ1bmN0aW9ucyB0byBtYW5hZ2UgdGhpcyAoc2hvdWxkIGJlIGFycmF5KVxuXHR0aGlzLnJlbmRlckdyb3VwIFx0PSBwYXJhbXMucmVuZGVyR3JvdXA7XG59O1xuXG5ucy5TdHlsZS5wcm90b3R5cGUuc2V0UmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocmVuZGVyR3JvdXApIHtcblx0dGhpcy5yZW5kZXJHcm91cCA9IHJlbmRlckdyb3VwO1xufTtcblxubnMuU3R5bGUucHJvdG90eXBlLmdldElkTGlzdEFzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmlkTGlzdC5zcGxpdCgnICcpO1xufVxuXG5ucy5TdHlsZS5wcm90b3R5cGUuc2V0SWRMaXN0RnJvbUFycmF5ID0gZnVuY3Rpb24gKGlkQXJyYXkpIHtcblx0dGhpcy5pZExpc3QgPSBpZEFycmF5LmpvaW4oJyAnKTtcbn1cblxubnMuU3R5bGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c3R5bGVcIjtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbmFtZT0nXCIrdGhpcy5uYW1lK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmlkTGlzdCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkTGlzdD0nXCIrdGhpcy5pZExpc3QrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLnJlbmRlckdyb3VwKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMucmVuZGVyR3JvdXAudG9YTUwoKTtcblx0fVxuXG5cdHhtbFN0cmluZyArPSBcIjwvc3R5bGU+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5TdHlsZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ3N0eWxlJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3R5bGUsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIHN0eWxlID0gbmV3IG5zLlN0eWxlKCk7XG5cdHN0eWxlLmlkIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdHN0eWxlLm5hbWUgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRzdHlsZS5pZExpc3QgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkTGlzdCcpO1xuXG5cdHZhciByZW5kZXJHcm91cFhNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZycpWzBdO1xuXHRpZiAocmVuZGVyR3JvdXBYTUwgIT0gbnVsbCkge1xuXHRcdHN0eWxlLnJlbmRlckdyb3VwID0gbnMuUmVuZGVyR3JvdXAuZnJvbVhNTChyZW5kZXJHcm91cFhNTCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUWUxFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZTVFlMRVMgLS0tLS0tLVxubnMuTGlzdE9mU3R5bGVzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3R5bGVzID0gW107XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmFkZFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcblx0dGhpcy5zdHlsZXMucHVzaChzdHlsZSk7XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bGlzdE9mU3R5bGVzPlxcblwiO1xuXHRmb3IodmFyIGk9MDsgaTx0aGlzLnN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBzdHlsZSA9IHRoaXMuc3R5bGVzW2ldO1xuXHRcdHhtbFN0cmluZyArPSBzdHlsZS50b1hNTCgpO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIjwvbGlzdE9mU3R5bGVzPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTGlzdE9mU3R5bGVzLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG5cdGlmICh4bWwudGFnTmFtZSAhPSAnbGlzdE9mU3R5bGVzJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGlzdE9mU3R5bGVzLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgbnMuTGlzdE9mU3R5bGVzKCk7XG5cblx0dmFyIHN0eWxlcyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3R5bGUnKTtcblx0Zm9yICh2YXIgaT0wOyBpPHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBzdHlsZVhNTCA9IHN0eWxlc1tpXTtcblx0XHR2YXIgc3R5bGUgPSBucy5TdHlsZS5mcm9tWE1MKHN0eWxlWE1MKTtcblx0XHRsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoc3R5bGUpO1xuXHR9XG5cdHJldHVybiBsaXN0T2ZTdHlsZXM7XG59O1xuLy8gLS0tLS0tLSBFTkQgTElTVE9GU1RZTEVTIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXG5ucy5SZW5kZXJJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ3Byb2dyYW1OYW1lJywgXG5cdFx0J3Byb2dyYW1WZXJzaW9uJywgJ2JhY2tncm91bmRDb2xvcicsICdsaXN0T2ZDb2xvckRlZmluaXRpb25zJywgJ2xpc3RPZlN0eWxlcyddKTtcblx0dGhpcy5pZCBcdFx0XHRcdFx0PSBwYXJhbXMuaWQ7IC8vIHJlcXVpcmVkLCByZXN0IGlzIG9wdGlvbmFsXG5cdHRoaXMubmFtZSBcdFx0XHRcdFx0PSBwYXJhbXMubmFtZTtcblx0dGhpcy5wcm9ncmFtTmFtZSBcdFx0XHQ9IHBhcmFtcy5wcm9ncmFtTmFtZTtcblx0dGhpcy5wcm9ncmFtVmVyc2lvbiBcdFx0PSBwYXJhbXMucHJvZ3JhbVZlcnNpb247XG5cdHRoaXMuYmFja2dyb3VuZENvbG9yIFx0XHQ9IHBhcmFtcy5iYWNrZ3JvdW5kQ29sb3I7XG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IHBhcmFtcy5saXN0T2ZDb2xvckRlZmluaXRpb25zO1xuXHR0aGlzLmxpc3RPZlN0eWxlcyBcdFx0XHQ9IHBhcmFtcy5saXN0T2ZTdHlsZXM7XG5cdC8qdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0KTtcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcyhyZW5kZXJJbmZvLnN0eWxlRGVmKTtcblx0Ki9cbn07XG5cbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb25zID0gZnVuY3Rpb24obGlzdE9mQ29sb3JEZWZpbml0aW9ucykge1xuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xufTtcblxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnNldExpc3RPZlN0eWxlcyA9IGZ1bmN0aW9uKGxpc3RPZlN0eWxlcykge1xuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IGxpc3RPZlN0eWxlcztcbn07XG5cbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uKCkge1xuXHQvLyB0YWcgYW5kIGl0cyBhdHRyaWJ1dGVzXG5cdHZhciB4bWxTdHJpbmcgPSBcIjxyZW5kZXJJbmZvcm1hdGlvblwiO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBuYW1lPSdcIit0aGlzLm5hbWUrXCInXCI7XG5cdH1cblx0aWYgKHRoaXMucHJvZ3JhbU5hbWUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBwcm9ncmFtTmFtZT0nXCIrdGhpcy5wcm9ncmFtTmFtZStcIidcIjtcblx0fVxuXHRpZiAodGhpcy5wcm9ncmFtVmVyc2lvbiAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHByb2dyYW1WZXJzaW9uPSdcIit0aGlzLnByb2dyYW1WZXJzaW9uK1wiJ1wiO1xuXHR9XG5cdGlmICh0aGlzLmJhY2tncm91bmRDb2xvciAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGJhY2tncm91bmRDb2xvcj0nXCIrdGhpcy5iYWNrZ3JvdW5kQ29sb3IrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIHhtbG5zPSdcIitucy54bWxucytcIic+XFxuXCI7XG5cblx0Ly8gY2hpbGQgZWxlbWVudHNcblx0aWYgKHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMudG9YTUwoKTtcblx0fVxuXHRpZiAodGhpcy5saXN0T2ZTdHlsZXMpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5saXN0T2ZTdHlsZXMudG9YTUwoKTtcblx0fVxuXG5cdHhtbFN0cmluZyArPSBcIjwvcmVuZGVySW5mb3JtYXRpb24+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG4vLyBzdGF0aWMgY29uc3RydWN0b3IgbWV0aG9kXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ3JlbmRlckluZm9ybWF0aW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgcmVuZGVySW5mb3JtYXRpb24sIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IG5zLlJlbmRlckluZm9ybWF0aW9uKCk7XG5cdHJlbmRlckluZm9ybWF0aW9uLmlkIFx0XHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5uYW1lIFx0XHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdHJlbmRlckluZm9ybWF0aW9uLnByb2dyYW1OYW1lIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Byb2dyYW1OYW1lJyk7XG5cdHJlbmRlckluZm9ybWF0aW9uLnByb2dyYW1WZXJzaW9uIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtVmVyc2lvbicpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5iYWNrZ3JvdW5kQ29sb3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicpO1xuXG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZDb2xvckRlZmluaXRpb25zJylbMF07XG5cdHZhciBsaXN0T2ZTdHlsZXNYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpc3RPZlN0eWxlcycpWzBdO1xuXHRpZiAobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuZnJvbVhNTChsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MKTtcblx0fVxuXHRpZiAobGlzdE9mU3R5bGVzWE1MICE9IG51bGwpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZTdHlsZXMgPSBucy5MaXN0T2ZTdHlsZXMuZnJvbVhNTChsaXN0T2ZTdHlsZXNYTUwpO1xuXHR9XG5cblx0cmV0dXJuIHJlbmRlckluZm9ybWF0aW9uO1xufTtcbi8vIC0tLS0tLS0gRU5EIFJFTkRFUklORk9STUFUSU9OIC0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBuczsiLCJ2YXIgcmVuZGVyRXh0ID0gcmVxdWlyZSgnLi9saWJzYmduLXJlbmRlcicpO1xudmFyIGNoZWNrUGFyYW1zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5jaGVja1BhcmFtcztcblxudmFyIG5zID0ge307XG5cbm5zLnhtbG5zID0gXCJodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjNcIjtcblxuLy8gLS0tLS0tLSBTQkdOQmFzZSAtLS0tLS0tXG4vKlxuXHRTZXZlcmFsIHNiZ24gZWxlbWVudHMgaW5oZXJpdCBmcm9tIHRoaXMuIEFsbG93cyB0byBwdXQgZXh0ZW5zaW9ucyBldmVyeXdoZXJlLlxuKi9cbm5zLlNCR05CYXNlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2V4dGVuc2lvbiddKTtcblx0dGhpcy5leHRlbnNpb24gXHQ9IHBhcmFtcy5leHRlbnNpb247XG59O1xuXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuc2V0RXh0ZW5zaW9uID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuXHR0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjtcbn07XG5cbi8vIHdyaXRlIHRoZSBYTUwgb2YgdGhpbmdzIHRoYXQgYXJlIHNwZWNpZmljIHRvIFNCR05CYXNlIHR5cGVcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5iYXNlVG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIlwiO1xuXHQvLyBjaGlsZHJlblxuXHRpZih0aGlzLmV4dGVuc2lvbiAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuZXh0ZW5zaW9uLnRvWE1MKCk7XG5cdH1cblxuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxuLy8gcGFyc2UgdGhpbmdzIHNwZWNpZmljIHRvIFNCR05CYXNlIHR5cGVcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5iYXNlRnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0Ly8gY2hpbGRyZW5cblx0dmFyIGV4dGVuc2lvblhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZXh0ZW5zaW9uJylbMF07XG5cdGlmIChleHRlbnNpb25YTUwgIT0gbnVsbCkge1xuXHRcdHZhciBleHRlbnNpb24gPSBucy5FeHRlbnNpb24uZnJvbVhNTChleHRlbnNpb25YTUwpO1xuXHRcdHRoaXMuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XG5cdH1cbn07XG5cbm5zLlNCR05CYXNlLnByb3RvdHlwZS5oYXNDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGFsbG93ZWRDaGlsZHJlbiA9IFsnZXh0ZW5zaW9uJ10uY29uY2F0KHRoaXMuYWxsb3dlZENoaWxkcmVuKTtcblx0Zm9yKHZhciBpPTA7IGkgPCBhbGxvd2VkQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgcHJvcCA9IGFsbG93ZWRDaGlsZHJlbltpXTtcblx0XHRpZih0eXBlb2YgdGhpc1twcm9wXSA9PSAnYXJyYXknICYmIHRoaXNbcHJvcF0ubGVuZ3RoID4gMClcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGlmKHRoaXNbcHJvcF0pXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8vIGZvciBzaW1wbGUgZWxlbWVudHMgdGhhdCBoYXZlIG5vIGNoaWxkcmVuLCB1c2UgdGhpcyBmdW5jdGlvbiB0b1xuLy8gZW5zdXJlIHRhZyBpcyBjbG9zZWQgY29ycmVjdGx5IHdoZW4gd3JpdGluZyBYTUwsIGlmIGV4dGVuc2lvblxuLy8gb3Igb3RoZXIgU0JHTkJhc2Ugc3BlY2lmaWMgdGhpbmdzIGFyZSBwcmVzZW50LlxuLy8gc2ltcGxlIGVsZW1lbnRzIG1pZ2h0IGVuZCB3aXRoIC8+IG9yIDwvbmFtZT4gXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuY2xvc2VUYWcgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIlwiO1xuXHRpZih0aGlzLmhhc0NoaWxkcmVuKCkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuYmFzZVRvWE1MKCk7XG5cdFx0eG1sU3RyaW5nICs9IFwiPC9cIit0aGlzLnRhZ05hbWUrXCI+XFxuXCI7XG5cdH1cblx0ZWxzZSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdH1cblx0cmV0dXJuIHhtbFN0cmluZztcbn1cbi8vIC0tLS0tLS0gRU5EIFNCR05CYXNlIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBTQkdOIC0tLS0tLS1cbm5zLlNiZ24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4bWxucycsICdtYXAnXSk7XG5cdHRoaXMueG1sbnMgXHQ9IHBhcmFtcy54bWxucztcblx0dGhpcy5tYXAgXHQ9IHBhcmFtcy5tYXA7XG5cblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbJ21hcCddO1xuXHR0aGlzLnRhZ05hbWUgPSAnc2Jnbic7XG59O1xuXG5ucy5TYmduLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLlNiZ24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuU2JnbjtcblxubnMuU2Jnbi5wcm90b3R5cGUuc2V0TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuXHR0aGlzLm1hcCA9IG1hcDtcbn07XG5cbm5zLlNiZ24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c2JnblwiO1xuXHRpZih0aGlzLnhtbG5zICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeG1sbnM9J1wiK3RoaXMueG1sbnMrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdGlmICh0aGlzLm1hcCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubWFwLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IHRoaXMuYmFzZVRvWE1MKCk7IC8vIGNhbGwgdG8gcGFyZW50IGNsYXNzXG5cdHhtbFN0cmluZyArPSBcIjwvc2Jnbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLlNiZ24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdzYmduJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc2JnbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgc2JnbiA9IG5ldyBucy5TYmduKCk7XG5cdHNiZ24ueG1sbnMgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd4bWxucycpO1xuXG5cdC8vIGdldCBjaGlsZHJlblxuXHR2YXIgbWFwWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtYXAnKVswXTtcblx0aWYgKG1hcFhNTCAhPSBudWxsKSB7XG5cdFx0dmFyIG1hcCA9IG5zLk1hcC5mcm9tWE1MKG1hcFhNTCk7XG5cdFx0c2Jnbi5zZXRNYXAobWFwKTtcblx0fVxuXHRzYmduLmJhc2VGcm9tWE1MKHhtbE9iaik7IC8vIGNhbGwgdG8gcGFyZW50IGNsYXNzXG5cdHJldHVybiBzYmduO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNCR04gLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE1BUCAtLS0tLS0tXG5ucy5NYXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdsYW5ndWFnZScsICdnbHlwaHMnLCAnYXJjcyddKTtcblx0dGhpcy5pZCBcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMubGFuZ3VhZ2UgXHQ9IHBhcmFtcy5sYW5ndWFnZTtcblx0dGhpcy5nbHlwaHMgXHQ9IHBhcmFtcy5nbHlwaHMgfHwgW107XG5cdHRoaXMuYXJjcyBcdFx0PSBwYXJhbXMuYXJjcyB8fCBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnZ2x5cGhzJywgJ2FyY3MnXTtcblx0dGhpcy50YWdOYW1lID0gJ21hcCc7XG59O1xuXG5ucy5NYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuTWFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLk1hcDtcblxubnMuTWFwLnByb3RvdHlwZS5hZGRHbHlwaCA9IGZ1bmN0aW9uIChnbHlwaCkge1xuXHR0aGlzLmdseXBocy5wdXNoKGdseXBoKTtcbn07XG5cbm5zLk1hcC5wcm90b3R5cGUuYWRkQXJjID0gZnVuY3Rpb24gKGFyYykge1xuXHR0aGlzLmFyY3MucHVzaChhcmMpO1xufTtcblxubnMuTWFwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPG1hcFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBpZD0nXCIrdGhpcy5pZCtcIidcIjtcblx0fVxuXHRpZih0aGlzLmxhbmd1YWdlICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgbGFuZ3VhZ2U9J1wiK3RoaXMubGFuZ3VhZ2UrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdC8vIGNoaWxkcmVuXG5cdHhtbFN0cmluZyArPSB0aGlzLmJhc2VUb1hNTCgpO1xuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuZ2x5cGhzW2ldLnRvWE1MKCk7XG5cdH1cblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmFyY3MubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5hcmNzW2ldLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPC9tYXA+XFxuXCI7XG5cblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLk1hcC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ21hcCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIG1hcCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgbWFwID0gbmV3IG5zLk1hcCgpO1xuXHRtYXAuaWQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRtYXAubGFuZ3VhZ2UgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYW5ndWFnZScpO1xuXG5cdC8vIG5lZWQgdG8gYmUgY2FyZWZ1bCBoZXJlLCBhcyB0aGVyZSBjYW4gYmUgZ2x5cGggaW4gYXJjc1xuXHR2YXIgZ2x5cGhzWE1MID0geG1sT2JqLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcCA+IGdseXBoJyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IGdseXBoc1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBnbHlwaCA9IG5zLkdseXBoLmZyb21YTUwoZ2x5cGhzWE1MW2ldKTtcblx0XHRtYXAuYWRkR2x5cGgoZ2x5cGgpO1xuXHR9XG5cdHZhciBhcmNzWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhcmMnKTtcblx0Zm9yICh2YXIgaT0wOyBpIDwgYXJjc1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBhcmMgPSBucy5BcmMuZnJvbVhNTChhcmNzWE1MW2ldKTtcblx0XHRtYXAuYWRkQXJjKGFyYyk7XG5cdH1cblxuXHRtYXAuYmFzZUZyb21YTUwoeG1sT2JqKTtcblx0cmV0dXJuIG1hcDtcbn07XG4vLyAtLS0tLS0tIEVORCBNQVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVYVEVOU0lPTlMgLS0tLS0tLVxubnMuRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuXHQvLyBjb25zaWRlciBmaXJzdCBvcmRlciBjaGlsZHJlbiwgYWRkIHRoZW0gd2l0aCB0aGVpciB0YWduYW1lIGFzIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0XG5cdC8vIHN0b3JlIHhtbE9iamVjdCBpZiBubyBzdXBwb3J0ZWQgcGFyc2luZyAodW5yZWNvZ25pemVkIGV4dGVuc2lvbnMpXG5cdC8vIGVsc2Ugc3RvcmUgaW5zdGFuY2Ugb2YgdGhlIGV4dGVuc2lvblxuXHR0aGlzLmxpc3QgPSB7fTtcblx0dGhpcy51bnN1cHBvcnRlZExpc3QgPSB7fTtcbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuXHRpZiAoZXh0ZW5zaW9uIGluc3RhbmNlb2YgcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uKSB7XG5cdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gZXh0ZW5zaW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dGVuc2lvbi5ub2RlVHlwZSA9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdC8vIGNhc2Ugd2hlcmUgcmVuZGVySW5mb3JtYXRpb24gaXMgcGFzc2VkIHVucGFyc2VkXG5cdFx0aWYgKGV4dGVuc2lvbi50YWdOYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dGVuc2lvbik7XG5cdFx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSByZW5kZXJJbmZvcm1hdGlvbjtcblx0XHR9XG5cdFx0dGhpcy51bnN1cHBvcnRlZExpc3RbZXh0ZW5zaW9uLnRhZ05hbWVdID0gZXh0ZW5zaW9uO1xuXHR9XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdHJldHVybiB0aGlzLmxpc3QuaGFzT3duUHJvcGVydHkoZXh0ZW5zaW9uTmFtZSk7XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XG5cdGlmICh0aGlzLmhhcyhleHRlbnNpb25OYW1lKSkge1xuXHRcdHJldHVybiB0aGlzLmxpc3RbZXh0ZW5zaW9uTmFtZV07XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxleHRlbnNpb24+XFxuXCI7XG5cdGZvciAodmFyIGV4dEluc3RhbmNlIGluIHRoaXMubGlzdCkge1xuXHRcdGlmIChleHRJbnN0YW5jZSA9PSBcInJlbmRlckluZm9ybWF0aW9uXCIpIHtcblx0XHRcdHhtbFN0cmluZyArPSB0aGlzLmdldChleHRJbnN0YW5jZSkudG9YTUwoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR4bWxTdHJpbmcgKz0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmdldChleHRJbnN0YW5jZSkpO1xuXHRcdH1cblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI8L2V4dGVuc2lvbj5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkV4dGVuc2lvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2V4dGVuc2lvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGV4dGVuc2lvbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IG5zLkV4dGVuc2lvbigpO1xuXHR2YXIgY2hpbGRyZW4gPSB4bWxPYmouY2hpbGRyZW47XG5cdGZvciAodmFyIGk9MDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGV4dFhtbE9iaiA9IGNoaWxkcmVuW2ldO1xuXHRcdHZhciBleHROYW1lID0gZXh0WG1sT2JqLnRhZ05hbWU7XG5cdFx0Ly9leHRlbnNpb24uYWRkKGV4dEluc3RhbmNlKTtcblx0XHRpZiAoZXh0TmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRYbWxPYmopO1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChyZW5kZXJJbmZvcm1hdGlvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopOyAvLyB0byBiZSBwYXJzZWQgY29ycmVjdGx5XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgRVhURU5TSU9OUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gR0xZUEggLS0tLS0tLVxubnMuR2x5cGggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdjbGFzc18nLCAnY29tcGFydG1lbnRSZWYnLCAnbGFiZWwnLCAnYmJveCcsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnLCAnc3RhdGUnLCAnY2xvbmUnXSk7XG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMuY2xhc3NfIFx0XHQ9IHBhcmFtcy5jbGFzc187XG5cdHRoaXMuY29tcGFydG1lbnRSZWYgPSBwYXJhbXMuY29tcGFydG1lbnRSZWY7XG5cblx0Ly8gY2hpbGRyZW5cblx0dGhpcy5sYWJlbCBcdFx0XHQ9IHBhcmFtcy5sYWJlbDtcblx0dGhpcy5zdGF0ZSBcdFx0XHQ9IHBhcmFtcy5zdGF0ZTtcblx0dGhpcy5iYm94IFx0XHRcdD0gcGFyYW1zLmJib3g7XG5cdHRoaXMuY2xvbmUgXHRcdFx0PSBwYXJhbXMuY2xvbmU7XG5cdHRoaXMuZ2x5cGhNZW1iZXJzIFx0PSBwYXJhbXMuZ2x5cGhNZW1iZXJzIHx8IFtdOyAvLyBjYXNlIG9mIGNvbXBsZXgsIGNhbiBoYXZlIGFyYml0cmFyeSBsaXN0IG9mIG5lc3RlZCBnbHlwaHNcblx0dGhpcy5wb3J0cyBcdFx0XHQ9IHBhcmFtcy5wb3J0cyB8fCBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnbGFiZWwnLCAnc3RhdGUnLCAnYmJveCcsICdjbG9uZScsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnXTtcblx0dGhpcy50YWdOYW1lID0gJ2dseXBoJztcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLkdseXBoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkdseXBoO1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbiAobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG5cdHRoaXMuc3RhdGUgPSBzdGF0ZTtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRCYm94ID0gZnVuY3Rpb24gKGJib3gpIHtcblx0dGhpcy5iYm94ID0gYmJveDtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRDbG9uZSA9IGZ1bmN0aW9uIChjbG9uZSkge1xuXHR0aGlzLmNsb25lID0gY2xvbmU7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkR2x5cGhNZW1iZXIgPSBmdW5jdGlvbiAoZ2x5cGhNZW1iZXIpIHtcblx0dGhpcy5nbHlwaE1lbWJlcnMucHVzaChnbHlwaE1lbWJlcik7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkUG9ydCA9IGZ1bmN0aW9uIChwb3J0KSB7XG5cdHRoaXMucG9ydHMucHVzaChwb3J0KTtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGdseXBoXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMuY2xhc3NfICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgY2xhc3M9J1wiK3RoaXMuY2xhc3NfK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMuY29tcGFydG1lbnRSZWYgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBjb21wYXJ0bWVudFJlZj0nXCIrdGhpcy5jb21wYXJ0bWVudFJlZitcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XG5cblx0Ly8gY2hpbGRyZW5cblx0aWYodGhpcy5sYWJlbCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMubGFiZWwudG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLnN0YXRlICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5zdGF0ZS50b1hNTCgpO1xuXHR9XG5cdGlmKHRoaXMuYmJveCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuYmJveC50b1hNTCgpO1xuXHR9XG5cdGlmKHRoaXMuY2xvbmUgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmNsb25lLnRvWE1MKCk7XG5cdH1cblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmdseXBoTWVtYmVycy5sZW5ndGg7IGkrKykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmdseXBoTWVtYmVyc1tpXS50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5wb3J0cy5sZW5ndGg7IGkrKykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLnBvcnRzW2ldLnRvWE1MKCk7XG5cdH1cblx0eG1sU3RyaW5nICs9IHRoaXMuYmFzZVRvWE1MKCk7XG5cdHhtbFN0cmluZyArPSBcIjwvZ2x5cGg+XFxuXCI7XG5cblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkdseXBoLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZ2x5cGgnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnbHlwaCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZ2x5cGggPSBuZXcgbnMuR2x5cGgoKTtcblx0Z2x5cGguaWQgXHRcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdGdseXBoLmNsYXNzXyBcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cdGdseXBoLmNvbXBhcnRtZW50UmVmIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xuXG5cdHZhciBsYWJlbFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcblx0aWYgKGxhYmVsWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbGFiZWwgPSBucy5MYWJlbC5mcm9tWE1MKGxhYmVsWE1MKTtcblx0XHRnbHlwaC5zZXRMYWJlbChsYWJlbCk7XG5cdH1cblx0dmFyIHN0YXRlWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGF0ZScpWzBdO1xuXHRpZiAoc3RhdGVYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGF0ZSA9IG5zLlN0YXRlVHlwZS5mcm9tWE1MKHN0YXRlWE1MKTtcblx0XHRnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG5cdH1cblx0dmFyIGJib3hYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jib3gnKVswXTtcblx0aWYgKGJib3hYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBiYm94ID0gbnMuQmJveC5mcm9tWE1MKGJib3hYTUwpO1xuXHRcdGdseXBoLnNldEJib3goYmJveCk7XG5cdH1cblx0dmFyIGNsb25lWE1sID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjbG9uZScpWzBdO1xuXHRpZiAoY2xvbmVYTWwgIT0gbnVsbCkge1xuXHRcdHZhciBjbG9uZSA9IG5zLkNsb25lVHlwZS5mcm9tWE1MKGNsb25lWE1sKTtcblx0XHRnbHlwaC5zZXRDbG9uZShjbG9uZSk7XG5cdH1cblx0Ly8gbmVlZCBzcGVjaWFsIGNhcmUgYmVjYXVzZSBvZiByZWN1cnNpb24gb2YgbmVzdGVkIGdseXBoIG5vZGVzXG5cdC8vIHRha2Ugb25seSBmaXJzdCBsZXZlbCBnbHlwaHNcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkcmVuO1xuXHRmb3IgKHZhciBqPTA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykgeyAvLyBsb29wIHRocm91Z2ggYWxsIGZpcnN0IGxldmVsIGNoaWxkcmVuXG5cdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5bal07XG5cdFx0aWYgKGNoaWxkLnRhZ05hbWUgPT0gXCJnbHlwaFwiKSB7IC8vIGhlcmUgd2Ugb25seSB3YW50IHRoZSBnbHloIGNoaWxkcmVuXG5cdFx0XHR2YXIgZ2x5cGhNZW1iZXIgPSBucy5HbHlwaC5mcm9tWE1MKGNoaWxkKTsgLy8gcmVjdXJzaXZlIGNhbGwgb24gbmVzdGVkIGdseXBoXG5cdFx0XHRnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlcik7XG5cdFx0fVxuXHR9XG5cdHZhciBwb3J0c1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgncG9ydCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBwb3J0c1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwb3J0ID0gbnMuUG9ydC5mcm9tWE1MKHBvcnRzWE1MW2ldKTtcblx0XHRnbHlwaC5hZGRQb3J0KHBvcnQpO1xuXHR9XG5cdGdseXBoLmJhc2VGcm9tWE1MKHhtbE9iaik7XG5cdHJldHVybiBnbHlwaDtcbn07XG4vLyAtLS0tLS0tIEVORCBHTFlQSCAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gTEFCRUwgLS0tLS0tLVxubnMuTGFiZWwgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd0ZXh0J10pO1xuXHR0aGlzLnRleHQgPSBwYXJhbXMudGV4dDtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xuXHR0aGlzLnRhZ05hbWUgPSAnbGFiZWwnO1xufTtcblxubnMuTGFiZWwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuTGFiZWwucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuTGFiZWw7XG5cbm5zLkxhYmVsLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGxhYmVsXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy50ZXh0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgdGV4dD0nXCIrdGhpcy50ZXh0K1wiJ1wiO1xuXHR9XG5cblx0eG1sU3RyaW5nICs9IHRoaXMuY2xvc2VUYWcoKTtcblxuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuTGFiZWwuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdsYWJlbCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxhYmVsLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBsYWJlbCA9IG5ldyBucy5MYWJlbCgpO1xuXHRsYWJlbC50ZXh0ID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndGV4dCcpO1xuXHRsYWJlbC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gbGFiZWw7XG59O1xuLy8gLS0tLS0tLSBFTkQgTEFCRUwgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEJCT1ggLS0tLS0tLVxubnMuQmJveCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneScsICd3JywgJ2gnXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcblx0dGhpcy53ID0gcGFyc2VGbG9hdChwYXJhbXMudyk7XG5cdHRoaXMuaCA9IHBhcnNlRmxvYXQocGFyYW1zLmgpO1xuXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XG5cdHRoaXMudGFnTmFtZSA9ICdiYm94Jztcbn07XG5cbm5zLkJib3gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuQmJveC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5CYm94O1xuXG5ucy5CYm94LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPGJib3hcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB4PSdcIit0aGlzLngrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeT0nXCIrdGhpcy55K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLncpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHc9J1wiK3RoaXMudytcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy5oKSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBoPSdcIit0aGlzLmgrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IHRoaXMuY2xvc2VUYWcoKTtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkJib3guZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdiYm94Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYmJveCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgYmJveCA9IG5ldyBucy5CYm94KCk7XG5cdGJib3gueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0YmJveC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRiYm94LncgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3cnKSk7XG5cdGJib3guaCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgnaCcpKTtcblx0YmJveC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gYmJveDtcbn07XG4vLyAtLS0tLS0tIEVORCBCQk9YIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBTVEFURSAtLS0tLS0tXG5ucy5TdGF0ZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndmFsdWUnLCAndmFyaWFibGUnXSk7XG5cdHRoaXMudmFsdWUgPSBwYXJhbXMudmFsdWU7XG5cdHRoaXMudmFyaWFibGUgPSBwYXJhbXMudmFyaWFibGU7XG59O1xuXG5ucy5TdGF0ZVR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8c3RhdGVcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLnZhbHVlICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgdmFsdWU9J1wiK3RoaXMudmFsdWUrXCInXCI7XG5cdH1cblx0aWYodGhpcy52YXJpYWJsZSAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHZhcmlhYmxlPSdcIit0aGlzLnZhcmlhYmxlK1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuU3RhdGVUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhdGUnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGF0ZSwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgc3RhdGUgPSBuZXcgbnMuU3RhdGVUeXBlKCk7XG5cdHN0YXRlLnZhbHVlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0c3RhdGUudmFyaWFibGUgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd2YXJpYWJsZScpO1xuXHRyZXR1cm4gc3RhdGU7XG59O1xuLy8gLS0tLS0tLSBFTkQgU1RBVEUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIENMT05FIC0tLS0tLS1cbm5zLkNsb25lVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydsYWJlbCddKTtcblx0dGhpcy5sYWJlbCA9IHBhcmFtcy5sYWJlbDtcbn07XG5cbm5zLkNsb25lVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxjbG9uZVwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSBcIiBsYWJlbD0nXCIrdGhpcy5sYWJlbCtcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0cmV0dXJuIHhtbFN0cmluZztcbn07XG5cbm5zLkNsb25lVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2Nsb25lJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgY2xvbmUsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGNsb25lID0gbmV3IG5zLkNsb25lVHlwZSgpO1xuXHRjbG9uZS5sYWJlbCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XG5cdHJldHVybiBjbG9uZTtcbn07XG4vLyAtLS0tLS0tIEVORCBDTE9ORSAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gUE9SVCAtLS0tLS0tXG5ucy5Qb3J0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAneCcsICd5J10pO1xuXHR0aGlzLmlkID0gcGFyYW1zLmlkO1xuXHR0aGlzLnggXHQ9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgXHQ9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xuXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XG5cdHRoaXMudGFnTmFtZSA9ICdwb3J0Jztcbn07XG5cbm5zLlBvcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuUG9ydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5Qb3J0O1xuXG5ucy5Qb3J0LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiPHBvcnRcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgaWQ9J1wiK3RoaXMuaWQrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeD0nXCIrdGhpcy54K1wiJ1wiO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHk9J1wiK3RoaXMueStcIidcIjtcblx0fVxuXHR4bWxTdHJpbmcgKz0gdGhpcy5jbG9zZVRhZygpO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuUG9ydC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3BvcnQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBwb3J0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBwb3J0ID0gbmV3IG5zLlBvcnQoKTtcblx0cG9ydC54IFx0PSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdHBvcnQueSBcdD0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRwb3J0LmlkID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0cG9ydC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gcG9ydDtcbn07XG4vLyAtLS0tLS0tIEVORCBQT1JUIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBBUkMgLS0tLS0tLVxubnMuQXJjID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ3NvdXJjZScsICd0YXJnZXQnLCAnc3RhcnQnLCAnZW5kJywgJ25leHRzJywgJ2dseXBocyddKTtcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLmNsYXNzXyA9IHBhcmFtcy5jbGFzc187XG5cdHRoaXMuc291cmNlID0gcGFyYW1zLnNvdXJjZTtcblx0dGhpcy50YXJnZXQgPSBwYXJhbXMudGFyZ2V0O1xuXG5cdHRoaXMuc3RhcnQgXHQ9IHBhcmFtcy5zdGFydDtcblx0dGhpcy5lbmQgXHQ9IHBhcmFtcy5lbmQ7XG5cdHRoaXMubmV4dHMgXHQ9IHBhcmFtcy5uZXh0cyB8fCBbXTtcblx0dGhpcy5nbHlwaHMgPSBwYXJhbXMuZ2x5cGhzIHx8wqBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnc3RhcnQnLCAnbmV4dHMnLCAnZW5kJywgJ2dseXBocyddO1xuXHR0aGlzLnRhZ05hbWUgPSAnYXJjJztcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5BcmMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQXJjO1xuXG5ucy5BcmMucHJvdG90eXBlLnNldFN0YXJ0ID0gZnVuY3Rpb24gKHN0YXJ0KSB7XG5cdHRoaXMuc3RhcnQgPSBzdGFydDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuc2V0RW5kID0gZnVuY3Rpb24gKGVuZCkge1xuXHR0aGlzLmVuZCA9IGVuZDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuYWRkTmV4dCA9IGZ1bmN0aW9uIChuZXh0KSB7XG5cdHRoaXMubmV4dHMucHVzaChuZXh0KTtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuYWRkR2x5cGggPSBmdW5jdGlvbiAoZ2x5cGgpIHtcblx0dGhpcy5nbHlwaHMucHVzaChnbHlwaCk7XG59O1xuXG5ucy5BcmMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8YXJjXCI7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIGlkPSdcIit0aGlzLmlkK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMuY2xhc3NfICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgY2xhc3M9J1wiK3RoaXMuY2xhc3NfK1wiJ1wiO1xuXHR9XG5cdGlmKHRoaXMuc291cmNlICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgc291cmNlPSdcIit0aGlzLnNvdXJjZStcIidcIjtcblx0fVxuXHRpZih0aGlzLnRhcmdldCAhPSBudWxsKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHRhcmdldD0nXCIrdGhpcy50YXJnZXQrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xuXG5cdC8vIGNoaWxkcmVuXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5nbHlwaHNbaV0udG9YTUwoKTtcblx0fVxuXHRpZih0aGlzLnN0YXJ0ICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5zdGFydC50b1hNTCgpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5uZXh0cy5sZW5ndGg7IGkrKykge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLm5leHRzW2ldLnRvWE1MKCk7XG5cdH1cblx0aWYodGhpcy5lbmQgIT0gbnVsbCkge1xuXHRcdHhtbFN0cmluZyArPSB0aGlzLmVuZC50b1hNTCgpO1xuXHR9XG5cblx0eG1sU3RyaW5nICs9IHRoaXMuYmFzZVRvWE1MKCk7XG5cdHhtbFN0cmluZyArPSBcIjwvYXJjPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuQXJjLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnYXJjJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYXJjLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBhcmMgPSBuZXcgbnMuQXJjKCk7XG5cdGFyYy5pZCBcdFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRhcmMuY2xhc3NfIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXHRhcmMuc291cmNlIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcblx0YXJjLnRhcmdldCBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XG5cblx0dmFyIHN0YXJ0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGFydCcpWzBdO1xuXHRpZiAoc3RhcnRYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGFydCA9IG5zLlN0YXJ0VHlwZS5mcm9tWE1MKHN0YXJ0WE1MKTtcblx0XHRhcmMuc2V0U3RhcnQoc3RhcnQpO1xuXHR9XG5cdHZhciBuZXh0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0Jyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IG5leHRYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbmV4dCA9IG5zLk5leHRUeXBlLmZyb21YTUwobmV4dFhNTFtpXSk7XG5cdFx0YXJjLmFkZE5leHQobmV4dCk7XG5cdH1cblx0dmFyIGVuZFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW5kJylbMF07XG5cdGlmIChlbmRYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBlbmQgPSBucy5FbmRUeXBlLmZyb21YTUwoZW5kWE1MKTtcblx0XHRhcmMuc2V0RW5kKGVuZCk7XG5cdH1cblx0dmFyIGdseXBoc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZ2x5cGgnKTtcblx0Zm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhzWE1MLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGdseXBoID0gbnMuR2x5cGguZnJvbVhNTChnbHlwaHNYTUxbaV0pO1xuXHRcdGFyYy5hZGRHbHlwaChnbHlwaCk7XG5cdH1cblxuXHRhcmMuYmFzZUZyb21YTUwoeG1sT2JqKTtcblx0cmV0dXJuIGFyYztcbn07XG5cbi8vIC0tLS0tLS0gRU5EIEFSQyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gU1RBUlRUWVBFIC0tLS0tLS1cbm5zLlN0YXJ0VHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcbn07XG5cbm5zLlN0YXJ0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxzdGFydFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5TdGFydFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdzdGFydCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHN0YXJ0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBzdGFydCA9IG5ldyBucy5TdGFydFR5cGUoKTtcblx0c3RhcnQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0c3RhcnQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcblx0cmV0dXJuIHN0YXJ0O1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUQVJUVFlQRSAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gRU5EVFlQRSAtLS0tLS0tXG5ucy5FbmRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xufTtcblxubnMuRW5kVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4bWxTdHJpbmcgPSBcIjxlbmRcIjtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB4PSdcIit0aGlzLngrXCInXCI7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgeT0nXCIrdGhpcy55K1wiJ1wiO1xuXHR9XG5cdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xuXHRyZXR1cm4geG1sU3RyaW5nO1xufTtcblxubnMuRW5kVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2VuZCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGVuZCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZW5kID0gbmV3IG5zLkVuZFR5cGUoKTtcblx0ZW5kLnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdGVuZC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRyZXR1cm4gZW5kO1xufTtcbi8vIC0tLS0tLS0gRU5EIEVORFRZUEUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE5FWFRUWVBFIC0tLS0tLS1cbm5zLk5leHRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xufTtcblxubnMuTmV4dFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeG1sU3RyaW5nID0gXCI8bmV4dFwiO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0eG1sU3RyaW5nICs9IFwiIHg9J1wiK3RoaXMueCtcIidcIjtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdHhtbFN0cmluZyArPSBcIiB5PSdcIit0aGlzLnkrXCInXCI7XG5cdH1cblx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5OZXh0VHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ25leHQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBuZXh0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBuZXh0ID0gbmV3IG5zLk5leHRUeXBlKCk7XG5cdG5leHQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0bmV4dC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRyZXR1cm4gbmV4dDtcbn07XG4vLyAtLS0tLS0tIEVORCBORVhUVFlQRSAtLS0tLS0tXG5cbm5zLnJlbmRlckV4dGVuc2lvbiA9IHJlbmRlckV4dDtcbm1vZHVsZS5leHBvcnRzID0gbnM7IiwidmFyIG5zID0ge307XG5cbi8qXG5cdGd1YXJhbnRlZXMgdG8gcmV0dXJuIGFuIG9iamVjdCB3aXRoIGdpdmVuIGFyZ3MgYmVpbmcgc2V0IHRvIG51bGwgaWYgbm90IHByZXNlbnQsIG90aGVyIGFyZ3MgcmV0dXJuZWQgYXMgaXNcbiovXG5ucy5jaGVja1BhcmFtcyA9IGZ1bmN0aW9uIChwYXJhbXMsIG5hbWVzKSB7XG5cdGlmICh0eXBlb2YgcGFyYW1zID09IFwidW5kZWZpbmVkXCIgfHwgcGFyYW1zID09IG51bGwpIHtcblx0XHRwYXJhbXMgPSB7fTtcblx0fVxuXHRpZiAodHlwZW9mIHBhcmFtcyAhPSAnb2JqZWN0Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbXMuIE9iamVjdCB3aXRoIG5hbWVkIHBhcmFtZXRlcnMgbXVzdCBiZSBwYXNzZWQuXCIpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgYXJnTmFtZSA9IG5hbWVzW2ldO1xuXHRcdGlmICh0eXBlb2YgcGFyYW1zW2FyZ05hbWVdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRwYXJhbXNbYXJnTmFtZV0gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcGFyYW1zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJuYW1lXCI6IFwic2JnbnZpelwiLFxuICBcInZlcnNpb25cIjogXCIzLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiU0JHTlBEIHZpc3VhbGl6YXRpb24gbGlicmFyeVwiLFxuICBcIm1haW5cIjogXCJzcmMvaW5kZXguanNcIixcbiAgXCJsaWNlbmNlXCI6IFwiTEdQTC0zLjBcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInRlc3RcIjogXCJlY2hvIFxcXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcXFwiICYmIGV4aXQgMVwiLFxuICAgIFwiYnVpbGQtc2JnbnZpei1qc1wiOiBcImd1bHAgYnVpbGRcIixcbiAgICBcImRlYnVnLWpzXCI6IFwibm9kZW1vbiAtZSBqcyAtLXdhdGNoIHNyYyAteCBcXFwibnBtIHJ1biBidWlsZC1zYmdudml6LWpzXFxcIlwiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMuZ2l0XCJcbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzL1wiLFxuICBcInBlZXItZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImpxdWVyeVwiOiBcIl4yLjIuNFwiLFxuICAgIFwiZmlsZXNhdmVyanNcIjogXCJ+MC4yLjJcIixcbiAgICBcImN5dG9zY2FwZVwiOiBcImlWaXMtYXQtQmlsa2VudC9jeXRvc2NhcGUuanMjdW5zdGFibGVcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaWJzYmduLmpzXCI6IFwiZ2l0Oi8vZ2l0aHViLmNvbS9laXNibS9saWJzYmduLmpzXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYnJvd3NlcmlmeVwiOiBcIl4xMS4yLjBcIixcbiAgICBcImd1bHBcIjogXCJeMy45LjBcIixcbiAgICBcImd1bHAtZGVyZXF1aXJlXCI6IFwiXjIuMS4wXCIsXG4gICAgXCJndWxwLWpzaGludFwiOiBcIl4xLjExLjJcIixcbiAgICBcImd1bHAtcHJvbXB0XCI6IFwiXjAuMS4yXCIsXG4gICAgXCJndWxwLXJlcGxhY2VcIjogXCJeMC41LjRcIixcbiAgICBcImd1bHAtc2hlbGxcIjogXCJeMC41LjBcIixcbiAgICBcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxuICAgIFwianNoaW50LXN0eWxpc2hcIjogXCJeMi4wLjFcIixcbiAgICBcIm5vZGUtbm90aWZpZXJcIjogXCJeNC4zLjFcIixcbiAgICBcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuICAgIFwidmlueWwtYnVmZmVyXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJ2aW55bC1zb3VyY2Utc3RyZWFtXCI6IFwiXjEuMS4wXCJcbiAgfVxufVxuIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBzYmdudml6ID0gd2luZG93LnNiZ252aXogPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcbiAgICB2YXIgbGlicyA9IHt9O1xuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpO1xuICAgIFxuICAgIHZhciBzYmduUmVuZGVyZXIgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyJyk7XG4gICAgdmFyIHNiZ25DeUluc3RhbmNlID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZScpO1xuICAgIFxuICAgIC8vIFV0aWxpdGllcyB3aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSBleHBvc2VkIHNlcGVyYXRlbHlcbiAgICB2YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91aS11dGlsaXRpZXMnKTtcbiAgICB2YXIgZmlsZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2ZpbGUtdXRpbGl0aWVzJyk7XG4gICAgdmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xuICAgIHJlcXVpcmUoJy4vdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcycpOyAvLyByZXF1aXJlIGtleWJvcmQgaW5wdXQgdXRpbGl0aWVzXG4gICAgLy8gVXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgYXMgaXNcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbiAgICBcbiAgICBzYmduUmVuZGVyZXIoKTtcbiAgICBzYmduQ3lJbnN0YW5jZSgpO1xuICAgIFxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzLCBtb3N0IHVzZXJzIHdpbGwgbm90IG5lZWQgdGhlc2VcbiAgICBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBmaWxlVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gZmlsZVV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIHVpVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gdWlVdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIHNiZ24gZ3JhcGggdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBncmFwaFV0aWxpdGllcykge1xuICAgICAgc2JnbnZpeltwcm9wXSA9IGdyYXBoVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzYmdudml6O1xuICB9XG59KSgpOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbnZhciByZWZyZXNoUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChncmFwaFV0aWxpdGllcyk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIGdldENvbXBvdW5kUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLy8gUmV0dXJuIGNhbGN1bGF0ZWQgcGFkZGluZ3MgaW4gY2FzZSBvZiB0aGF0IGRhdGEgaXMgaW52YWxpZCByZXR1cm4gNVxuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzIHx8IDU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnRhaW5lclNlbGVjdG9yID0gb3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I7XG4gIHZhciBpbWdQYXRoID0gb3B0aW9ucy5pbWdQYXRoO1xuICBcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcbiAge1xuICAgIHZhciBzYmduTmV0d29ya0NvbnRhaW5lciA9ICQoY29udGFpbmVyU2VsZWN0b3IpO1xuXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcbiAgICB2YXIgY3kgPSBjeXRvc2NhcGUoe1xuICAgICAgY29udGFpbmVyOiBzYmduTmV0d29ya0NvbnRhaW5lcixcbiAgICAgIHN0eWxlOiBzYmduU3R5bGVTaGVldCxcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxuICAgICAgYm94U2VsZWN0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1vdGlvbkJsdXI6IHRydWUsXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXG4gICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuY3kgPSB0aGlzO1xuICAgICAgICAvLyBJZiB1bmRvYWJsZSByZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICAgICAgYmluZEN5RXZlbnRzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgLy8gTm90ZSB0aGF0IGluIENoaVNFIHRoaXMgZnVuY3Rpb24gaXMgaW4gYSBzZXBlcmF0ZSBmaWxlIGJ1dCBpbiB0aGUgdmlld2VyIGl0IGhhcyBqdXN0IDIgbWV0aG9kcyBhbmQgc28gaXQgaXMgbG9jYXRlZCBpbiB0aGlzIGZpbGVcbiAgZnVuY3Rpb24gcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKSB7XG4gICAgLy8gY3JlYXRlIG9yIGdldCB0aGUgdW5kby1yZWRvIGluc3RhbmNlXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcblxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZU5vZGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlTm9kZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBiaW5kQ3lFdmVudHMoKSB7XG4gICAgY3kub24oJ3RhcGVuZCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIFxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlY29sbGFwc2VcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgLy9UaGUgY2hpbGRyZW4gaW5mbyBvZiBjb21wbGV4IG5vZGVzIHNob3VsZCBiZSBzaG93biB3aGVuIHRoZXkgYXJlIGNvbGxhcHNlZFxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICAvL1RoZSBub2RlIGlzIGJlaW5nIGNvbGxhcHNlZCBzdG9yZSBpbmZvbGFiZWwgdG8gdXNlIGl0IGxhdGVyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbCA9IGluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcbiAgICAgIC8vIHJlbW92ZSBiZW5kIHBvaW50cyBiZWZvcmUgY29sbGFwc2VcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICAgICAgaWYgKGVkZ2UuaGFzQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykpIHtcbiAgICAgICAgICBlZGdlLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xuICAgICAgICAgIGRlbGV0ZSBlZGdlLl9wcml2YXRlLmNsYXNzZXNbJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJ107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmJlZm9yZWV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICBub2RlLnJlbW92ZURhdGEoXCJpbmZvTGFiZWxcIik7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmFmdGVyZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcbiAgICAgIC8vRG9uJ3Qgc2hvdyBjaGlsZHJlbiBpbmZvIHdoZW4gdGhlIGNvbXBsZXggbm9kZSBpcyBleHBhbmRlZFxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xuICAgICAgICBub2RlLnJlbW92ZVN0eWxlKCdjb250ZW50Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgc2JnblN0eWxlU2hlZXQgPSBjeXRvc2NhcGUuc3R5bGVzaGVldCgpXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxuICAgICAgICAgICAgJ29wYWNpdHknOiAxLFxuICAgICAgICAgICAgJ3BhZGRpbmcnOiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnBhcmVudFwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3BhZGRpbmcnOiBnZXRDb21wb3VuZFBhZGRpbmdzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9jbG9uZW1hcmtlcl1bY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBpbWdQYXRoICsgJy9jbG9uZV9iZy5wbmcnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teSc6ICcxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXdpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1maXQnOiAnbm9uZScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdjbG9uZW1hcmtlcicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lTaGFwZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbGVtZW50Q29udGVudChlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdwZXJ0dXJiaW5nIGFnZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgLTAuNSwgMCwgIC0xLCAxLCAgIDEsIDEsICAgMC41LCAwLCAxLCAtMSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3RhZyddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIDAuMjUsIC0xLCAgIDEsIDAsICAgIDAuMjUsIDEsICAgIC0xLCAxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDMuMjUsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMCxcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAndGV4dC1tYXJnaW4teScgOiAtMSAqIG9wdGlvbnMuZXh0cmFDb21wYXJ0bWVudFBhZGRpbmdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50W2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAncGFkZGluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG91bmRQYWRkaW5ncygpICsgb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbYmJveF1bY2xhc3NdW2NsYXNzIT0nY29tcGxleCddW2NsYXNzIT0nY29tcGFydG1lbnQnXVtjbGFzcyE9J3N1Ym1hcCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnd2lkdGgnOiAnZGF0YShiYm94LncpJyxcbiAgICAgICAgICAgICdoZWlnaHQnOiAnZGF0YShiYm94LmgpJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS5jeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6IDM2LFxuICAgICAgICAgICAgJ2hlaWdodCc6IDM2LFxuICAgICAgICAgICAgJ2JvcmRlci1zdHlsZSc6ICdkYXNoZWQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjMDAwJyxcbiAgICAgICAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6YWN0aXZlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnMTQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnY3VydmUtc3R5bGUnOiAnYmV6aWVyJyxcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2hvbGxvdycsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICd3aWR0aCc6IDEuMjUsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnbGluZS1jb2xvcicpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdjb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnbGluZS1jb2xvcicpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdhcnJvdy1zY2FsZSc6IDEuNVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZS5jeS1leHBhbmQtY29sbGFwc2UtbWV0YS1lZGdlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXJvdGF0aW9uJzogJ2F1dG9yb3RhdGUnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1zaGFwZSc6ICdyZWN0YW5nbGUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItd2lkdGgnOiAnMScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0nY29uc3VtcHRpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc291cmNlLWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc291cmNlLXRleHQtbWFyZ2luLXknOiAnLTEwJyxcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtbWFyZ2luLXknOiAnLTEwJyxcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeUFycm93U2hhcGUoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc291cmNlLWFycm93LXNoYXBlJzogJ25vbmUnLFxuICAgICAgICAgICAgJ3NvdXJjZS1lbmRwb2ludCc6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbmRQb2ludChlbGUsICdzb3VyY2UnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGFyZ2V0LWVuZHBvaW50JzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVuZFBvaW50KGVsZSwgJ3RhcmdldCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0naW5oaWJpdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgICAgIH0pO1xufTtcbiIsIi8qXG4gKiBSZW5kZXIgc2JnbiBzcGVjaWZpYyBzaGFwZXMgd2hpY2ggYXJlIG5vdCBzdXBwb3J0ZWQgYnkgY3l0b3NjYXBlLmpzIGNvcmVcbiAqL1xuXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XG5cbnZhciBjeU1hdGggPSBjeXRvc2NhcGUubWF0aDtcbnZhciBjeUJhc2VOb2RlU2hhcGVzID0gY3l0b3NjYXBlLmJhc2VOb2RlU2hhcGVzO1xudmFyIGN5U3R5bGVQcm9wZXJ0aWVzID0gY3l0b3NjYXBlLnN0eWxlUHJvcGVydGllcztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcbiAgXG4gIC8vIFRha2VuIGZyb20gY3l0b3NjYXBlLmpzIGFuZCBtb2RpZmllZFxuICB2YXIgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aCA9IGZ1bmN0aW9uKFxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHJhZGl1cyApe1xuXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IHJhZGl1cyB8fCBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMoIHdpZHRoLCBoZWlnaHQgKTtcblxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XG5cbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXG4gICAgY29udGV4dC5tb3ZlVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSAtIGhhbGZIZWlnaHQsIHggKyBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHgsIHkgKyBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMgKTtcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHggLSBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCwgeSAtIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEpvaW4gbGluZVxuICAgIGNvbnRleHQubGluZVRvKCB4LCB5IC0gaGFsZkhlaWdodCApO1xuXG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9O1xuICBcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanNcbiAgdmFyIGRyYXdQb2x5Z29uUGF0aCA9IGZ1bmN0aW9uKFxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHBvaW50cyApe1xuXG4gICAgdmFyIGhhbGZXID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSCA9IGhlaWdodCAvIDI7XG5cbiAgICBpZiggY29udGV4dC5iZWdpblBhdGggKXsgY29udGV4dC5iZWdpblBhdGgoKTsgfVxuXG4gICAgY29udGV4dC5tb3ZlVG8oIHggKyBoYWxmVyAqIHBvaW50c1swXSwgeSArIGhhbGZIICogcG9pbnRzWzFdICk7XG5cbiAgICBmb3IoIHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLyAyOyBpKysgKXtcbiAgICAgIGNvbnRleHQubGluZVRvKCB4ICsgaGFsZlcgKiBwb2ludHNbIGkgKiAyXSwgeSArIGhhbGZIICogcG9pbnRzWyBpICogMiArIDFdICk7XG4gICAgfVxuXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgfTtcbiAgXG4gIHZhciBzYmduU2hhcGVzID0gJCQuc2Jnbi5zYmduU2hhcGVzID0ge1xuICAgICdzb3VyY2UgYW5kIHNpbmsnOiB0cnVlLFxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXG4gIH07XG5cbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQuc2Jnbi50b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlcyA9IHtcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ3Byb2Nlc3MnOiB0cnVlLFxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xuICAgICAgdmFyIGNsb3Nlc3RQb2ludCA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShwb3J0WCwgcG9ydFksXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwb3J0WCwgcG9ydFkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cblxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMucG9ydDtcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdW5pdE9mSW5mb1JhZGl1cyA9IDQ7XG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xuICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCkge1xuXG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xuXG4gICAgdmFyIHVwV2lkdGggPSAwLCBkb3duV2lkdGggPSAwO1xuICAgIHZhciBib3hQYWRkaW5nID0gMTAsIGJldHdlZW5Cb3hQYWRkaW5nID0gNTtcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xuXG4gICAgc3RhdGVBbmRJbmZvcy5zb3J0KCQkLnNiZ24uY29tcGFyZVN0YXRlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbi8vICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclk7XG5cbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XG4gICAgICAgIGlmICh1cFdpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyB1cFdpZHRoICsgc3RhdGVXaWR0aCAvIDI7XG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcblxuICAgICAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xuXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xuICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZVlQb3MgPiAwKSB7XG4gICAgICAgIGlmIChkb3duV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgKyBiZWdpblBvc1k7XG5cbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkb3duV2lkdGggPSBkb3duV2lkdGggKyB3aWR0aCArIGJveFBhZGRpbmc7XG4gICAgICB9XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcblxuICAgICAgLy91cGRhdGUgbmV3IHN0YXRlIGFuZCBpbmZvIHBvc2l0aW9uKHJlbGF0aXZlIHRvIG5vZGUgY2VudGVyKVxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xuICAgICAgc3RhdGUuYmJveC55ID0gKHN0YXRlQ2VudGVyWSAtIGNlbnRlclkpICogMTAwIC8gbm9kZS5oZWlnaHQoKTtcbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcbiAgICB2YXIgc3RhdGVWYXJpYWJsZSA9IHRleHRQcm9wLnN0YXRlLnZhcmlhYmxlIHx8ICcnO1xuXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcbiAgICAgICAgICAgID8gXCJAXCIgKyBzdGF0ZVZhcmlhYmxlXG4gICAgICAgICAgICA6IFwiXCIpO1xuXG4gICAgdmFyIGZvbnRTaXplID0gOTsgLy8gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcblxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlTGFiZWw7XG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCwgdHJ1bmNhdGUpIHtcbiAgICB2YXIgb2xkRm9udCA9IGNvbnRleHQuZm9udDtcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xuICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSB0ZXh0UHJvcC5jb2xvcjtcbiAgICB2YXIgb2xkT3BhY2l0eSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XG4gICAgdmFyIHRleHQ7XG4gICAgXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcbiAgICBcbiAgICBpZiAodHJ1bmNhdGUgPT0gZmFsc2UpIHtcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgY29udGV4dC5mb250KTtcbiAgICB9XG4gICAgXG4gICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0ZXh0UHJvcC5jZW50ZXJYLCB0ZXh0UHJvcC5jZW50ZXJZKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgIGNvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZE9wYWNpdHk7XG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICB9O1xuXG4gIGN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xuICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucG93KHBvaW50MVswXSAtIHBvaW50MlswXSwgMikgKyBNYXRoLnBvdyhwb2ludDFbMV0gLSBwb2ludDJbMV0sIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZGlzdGFuY2UpO1xuICB9O1xuXG4gICQkLnNiZ24uY29sb3JzID0ge1xuICAgIGNsb25lOiBcIiNhOWE5YTlcIixcbiAgICBhc3NvY2lhdGlvbjogXCIjNkI2QjZCXCIsXG4gICAgcG9ydDogXCIjNkI2QjZCXCJcbiAgfTtcblxuXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aCAmJiBpIDwgNDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcbiAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xuXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgLy92YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0IHx8ICcnO1xuICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xuICB9O1xuXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50ID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIG5vZGUsIHRocmVzaG9sZCwgcG9pbnRzLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgIC8vY2hlY2sgcmVjdGFuZ2xlIGF0IHRvcFxuICAgIGlmIChjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIHBvaW50cyxcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCBib3R0b21cbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyAvIDIsIHdpZHRoIC0gMiAqIGNvcm5lclJhZGl1cywgY29ybmVyUmFkaXVzLCBbMCwgLTFdLFxuICAgICAgICAgICAgcGFkZGluZykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vY2hlY2sgZWxsaXBzZXNcbiAgICB2YXIgY2hlY2tJbkVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xuICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgeSAtPSBjZW50ZXJZO1xuXG4gICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGJvdHRvbSByaWdodCBxdWFydGVyIGNpcmNsZVxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxuICAgICAgICAgICAgY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgYm90dG9tIGxlZnQgcXVhcnRlciBjaXJjbGVcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcbiAgICAgICAgICAgIGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvL3dlIG5lZWQgdG8gZm9yY2Ugb3BhY2l0eSB0byAxIHNpbmNlIHdlIG1pZ2h0IGhhdmUgc3RhdGUgYW5kIGluZm8gYm94ZXMuXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cbiAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZSA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIHBhcmVudE9wYWNpdHkgPSBub2RlLmVmZmVjdGl2ZU9wYWNpdHkoKTtcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKFwiXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzBdICsgXCIsXCJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVsyXSArIFwiLFwiXG4gICAgICAgICAgICArICgxICogbm9kZS5jc3MoJ29wYWNpdHknKSAqIHBhcmVudE9wYWNpdHkpICsgXCIpXCI7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoID0gZnVuY3Rpb24gKFxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuICAgIC8vdmFyIGNvcm5lclJhZGl1cyA9ICQkLm1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKGhhbGZXaWR0aCwgaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XG5cbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgLy8gU3RhcnQgYXQgdG9wIG1pZGRsZVxuICAgIGNvbnRleHQubW92ZVRvKDAsIC1oYWxmSGVpZ2h0KTtcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIGhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBBcmMgZnJvbSByaWdodCBzaWRlIHRvIGJvdHRvbVxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIDAsIC1oYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEpvaW4gbGluZVxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgteCwgLXkpO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsID0gZnVuY3Rpb24gKFxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IC0xICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcbiAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xuXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDMgKiBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcblxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICB9XG4gIH1cbiAgO1xuXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcblxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcblxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgMyAqIE1hdGguUEkgLyA2KTtcblxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGggPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cykge1xuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGNvbnRleHQubW92ZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIDApO1xuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcbiAgICBjb250ZXh0LmxpbmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5pc011bHRpbWVyID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvL3RoaXMgZnVuY3Rpb24gaXMgY3JlYXRlZCB0byBoYXZlIHNhbWUgY29ybmVyIGxlbmd0aCB3aGVuXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXG4gICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMgPSBmdW5jdGlvbiAoY29ybmVyTGVuZ3RoLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy9jcCBzdGFuZHMgZm9yIGNvcm5lciBwcm9wb3J0aW9uXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xuICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XG5cbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxuICAgICAgMSwgMSAtIGNwWCwgMSwgMSwgMSAtIGNwWSwgMSwgLTEgKyBjcFksIDEgLSBjcFgsIC0xXTtcblxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHBvcnRZID0gcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgY2VudGVyWTtcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKHBvcnRYLCBwb3J0WSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjbG9zZXN0UG9pbnRbMF0sIGNsb3Nlc3RQb2ludFsxXSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAvL2FkZCBhIGxpdHRsZSBibGFjayBjaXJjbGUgdG8gcG9ydHNcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBwb3J0WCwgcG9ydFksIDIsIDIpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdjb21wbGV4Jyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdkaXNzb2NpYXRpb24nKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ21hY3JvbW9sZWN1bGUnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NpbXBsZSBjaGVtaWNhbCcpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5zcGVjaWZpZWQgZW50aXR5Jyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdvbWl0dGVkIHByb2Nlc3MnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3VuY2VydGFpbiBwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdhc3NvY2lhdGlvbicpO1xuXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdjb25zdW1wdGlvbicpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgncHJvZHVjdGlvbicpO1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUoY29udGV4dCwgbm9kZSwgdGhpcy5wb2ludHMpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHJldHVybiBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydvbWl0dGVkIHByb2Nlc3MnXS5sYWJlbCA9ICdcXFxcXFxcXCc7XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzWyd1bmNlcnRhaW4gcHJvY2VzcyddID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWyd1bmNlcnRhaW4gcHJvY2VzcyddLmxhYmVsID0gJz8nO1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInVuc3BlY2lmaWVkIGVudGl0eVwiXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKGNlbnRlclgsIGNlbnRlclksIHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzKTtcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG5cbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcbiAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcbiAgICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcblxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxuICAgICAgICAgICAgICAgIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG5cbiAgICAgICAgcmV0dXJuIGludGVyc2VjdDtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICB4IC09IGNlbnRlclg7XG4gICAgICAgIHkgLT0gY2VudGVyWTtcblxuICAgICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcImRpc3NvY2lhdGlvblwiXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCk7XG5cbiAgICAgICAgLy8gQXQgb3JpZ2luLCByYWRpdXMgMSwgMCB0byAycGlcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgMCwgTWF0aC5QSSAqIDIgKiAwLjk5OSwgZmFsc2UpOyAvLyAqMC45OTkgYi9jIGNocm9tZSByZW5kZXJpbmcgYnVnIG9uIGZ1bGwgY2lyY2xlXG5cbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSg0IC8gd2lkdGgsIDQgLyBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xuXG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKS0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xuXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICBwYWRkaW5nKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSAobm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gKG5vZGUub3V0ZXJIZWlnaHQoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksXG4gICAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICA7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XG5cbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICB9LFxuICAgICAgZHJhd1BhdGg6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG5cbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLFxuICAgICAgICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXSA9IHtcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgcHRzID0gY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXS5wb2ludHM7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAqIE1hdGguc3FydCgyKSAvIDIsIGhlaWdodCAqIE1hdGguc3FydCgyKSAvIDIpO1xuXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHB0c1syXSwgcHRzWzNdKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8ocHRzWzZdLCBwdHNbN10pO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvICh3aWR0aCAqIE1hdGguc3FydCgyKSksIDIgLyAoaGVpZ2h0ICogTWF0aC5zcXJ0KDIpKSk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNvdXJjZUFuZFNpbmsoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZSxcbiAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcbiAgICB9O1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd0VsbGlwc2UgPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgIC8vJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy9jb250ZXh0LmZpbGwoKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhdyhjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfTtcblxuICAkJC5zYmduLmNsb25lTWFya2VyID0ge1xuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJFbmRYID0gMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XG5cbiAgICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICB9XG4gICAgfSxcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcbiAgICB9LFxuICAgIHNpbXBsZUNoZW1pY2FsOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4od2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICB2YXIgZmlyc3RDaXJjbGVDZW50ZXJYID0gY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xuXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcblxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHZhciByZWNQb2ludHMgPSBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApO1xuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzIC8gNCAqIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBlcnR1cmJpbmdBZ2VudDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDg7XG5cbiAgICAgICAgdmFyIG1hcmtlclBvaW50cyA9IFstNSAvIDYsIC0xLCA1IC8gNiwgLTEsIDEsIDEsIC0xLCAxXTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgcmVuZGVyZXIuZHJhd1BvbHlnb24oY29udGV4dCxcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcbiAgICAgICAgICAgICAgICBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgbWFya2VyUG9pbnRzKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG51Y2xlaWNBY2lkRmVhdHVyZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAqIGhlaWdodCAvIDg7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtYWNyb21vbGVjdWxlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSk7XG4gICAgfSxcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcbiAgICAgICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNsb25lSGVpZ2h0IC8gMjtcblxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy0xLCAtMSwgMSwgLTEsIDEgLSBjcFgsIDEsIC0xICsgY3BYLCAxXTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcblxuLy8gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMClcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBjbG9zZXN0SW50ZXJzZWN0aW9uID0gW107XG4gICAgdmFyIG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJzZWN0aW9ucy5sZW5ndGg7IGkgPSBpICsgMikge1xuICAgICAgdmFyIGNoZWNrUG9pbnQgPSBbaW50ZXJzZWN0aW9uc1tpXSwgaW50ZXJzZWN0aW9uc1tpICsgMV1dO1xuICAgICAgdmFyIGRpc3RhbmNlID0gY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcblxuICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgY2xvc2VzdEludGVyc2VjdGlvbiA9IGNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb3Nlc3RJbnRlcnNlY3Rpb247XG4gIH07XG5cbiAgJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSwgbm9kZVgsIG5vZGVZLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG5cbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCB0b3BTdGFydFgsIHRvcFN0YXJ0WSwgdG9wRW5kWCwgdG9wRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cbiAgICB7XG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWSA9IGJvdHRvbVN0YXJ0WTtcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgbGVmdFN0YXJ0WCwgbGVmdFN0YXJ0WSwgbGVmdEVuZFgsIGxlZnRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50cywgd2UgaGF2ZSBvbmx5IHR3byBhcmNzIGZvclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXG4gICAgdmFyIGFyY0ludGVyc2VjdGlvbnM7XG5cbiAgICAvLyBCb3R0b20gUmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21SaWdodENlbnRlclkpIHtcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gTGVmdFxuICAgIHtcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcbiAgfTtcblxuICAvL3RoaXMgZnVuY3Rpb24gZ2l2ZXMgdGhlIGludGVyc2VjdGlvbnMgb2YgYW55IGxpbmUgd2l0aCBhIHJvdW5kIHJlY3RhbmdsZSBcbiAgJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBzdHJhaWdodCBsaW5lIHNlZ21lbnRzXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcblxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcblxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIHJpZ2h0U3RhcnRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcbiAgICAgIHZhciByaWdodEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgYm90dG9tU3RhcnRYLCBib3R0b21TdGFydFksIGJvdHRvbUVuZFgsIGJvdHRvbUVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHNcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIFRvcCBMZWZ0XG4gICAge1xuICAgICAgdmFyIHRvcExlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgdG9wTGVmdENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIHRvcExlZnRDZW50ZXJYLCB0b3BMZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wTGVmdENlbnRlclkpIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvcCBSaWdodFxuICAgIHtcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gdG9wUmlnaHRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wUmlnaHRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gUmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIExlZnRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcbiAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZUVsbGlwc2UgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcblxuICAgIHZhciB3ID0gd2lkdGggLyAyICsgcGFkZGluZztcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xuICAgIHZhciBhbiA9IGNlbnRlclg7XG4gICAgdmFyIGJuID0gY2VudGVyWTtcblxuICAgIHZhciBkID0gW3gyIC0geDEsIHkyIC0geTFdO1xuXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcbiAgICB2YXIgbiA9IC0xICogbSAqIHgyICsgeTI7XG4gICAgdmFyIGEgPSBoICogaCArIHcgKiB3ICogbSAqIG07XG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcbiAgICB2YXIgYyA9IGFuICogYW4gKiBoICogaCArIG4gKiBuICogdyAqIHcgLSAyICogYm4gKiB3ICogdyAqIG4gK1xuICAgICAgICAgICAgYm4gKiBibiAqIHcgKiB3IC0gaCAqIGggKiB3ICogdztcblxuICAgIHZhciBkaXNjcmltaW5hbnQgPSBiICogYiAtIDQgKiBhICogYztcblxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHQxID0gKC1iICsgTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcbiAgICB2YXIgdDIgPSAoLWIgLSBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xuXG4gICAgdmFyIHhNaW4gPSBNYXRoLm1pbih0MSwgdDIpO1xuICAgIHZhciB4TWF4ID0gTWF0aC5tYXgodDEsIHQyKTtcblxuICAgIHZhciB5TWluID0gbSAqIHhNaW4gLSBtICogeDIgKyB5MjtcbiAgICB2YXIgeU1heCA9IG0gKiB4TWF4IC0gbSAqIHgyICsgeTI7XG5cbiAgICByZXR1cm4gW3hNaW4sIHlNaW4sIHhNYXgsIHlNYXhdO1xuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHkpIHtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XG5cbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XG5cbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIHZhciBzdGF0ZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgcGFkZGluZyk7XG5cbiAgICAgICAgaWYgKHN0YXRlSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoc3RhdGVJbnRlcnNlY3RMaW5lcyk7XG5cbiAgICAgICAgc3RhdGVDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIDUsIHBhZGRpbmcpO1xuXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoaW5mb0ludGVyc2VjdExpbmVzKTtcblxuICAgICAgICBpbmZvQ291bnQrKztcbiAgICAgIH1cblxuICAgIH1cbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LncpICsgdGhyZXNob2xkO1xuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LmgpICsgdGhyZXNob2xkO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XG5cbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICB2YXIgc3RhdGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludChcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xuXG4gICAgICAgIGlmIChzdGF0ZUNoZWNrUG9pbnQgPT0gdHJ1ZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBzdGF0ZUNvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIHZhciBpbmZvQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KFxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XG5cbiAgICAgICAgaWYgKGluZm9DaGVja1BvaW50ID09IHRydWUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgaW5mb0NvdW50Kys7XG4gICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gICQkLnNiZ24uaXNOb2RlU2hhcGVUb3RhbGx5T3ZlcnJpZGVuID0gZnVuY3Rpb24gKHJlbmRlciwgbm9kZSkge1xuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufTtcbiIsIi8qXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBlbGVtZW50cyBpbmNsdWRlcyBib3RoIGdlbmVyYWwgdXRpbGl0aWVzIGFuZCBzYmduIHNwZWNpZmljIHV0aWxpdGllcyBcbiAqL1xuXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSB7XG4gICAgLy90aGUgbGlzdCBvZiB0aGUgZWxlbWVudCBjbGFzc2VzIGhhbmRsZWQgYnkgdGhlIHRvb2xcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcbiAgICAgICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZSxcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXG4gICAgICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAgICAgJ3Byb2Nlc3MnOiB0cnVlLFxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAgICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAgICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgICAgICdwaGVub3R5cGUnOiB0cnVlLFxuICAgICAgICAndGFnJzogdHJ1ZSxcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3Byb2R1Y3Rpb24nOiB0cnVlLFxuICAgICAgICAnbW9kdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdjYXRhbHlzaXMnOiB0cnVlLFxuICAgICAgICAnaW5oaWJpdGlvbic6IHRydWUsXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxuICAgICAgICAnbG9naWMgYXJjJzogdHJ1ZSxcbiAgICAgICAgJ2VxdWl2YWxlbmNlIGFyYyc6IHRydWUsXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnb3Igb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnbm90IG9wZXJhdG9yJzogdHJ1ZSxcbiAgICAgICAgJ2FuZCc6IHRydWUsXG4gICAgICAgICdvcic6IHRydWUsXG4gICAgICAgICdub3QnOiB0cnVlLFxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxuICAgICAgICAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInOiB0cnVlLFxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdjb21wYXJ0bWVudCc6IHRydWVcbiAgICB9LFxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXG4gICAgcHJvY2Vzc1R5cGVzIDogWydwcm9jZXNzJywgJ29taXR0ZWQgcHJvY2VzcycsICd1bmNlcnRhaW4gcHJvY2VzcycsXG4gICAgICAgICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncGhlbm90eXBlJ10sXG4gICAgICBcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xuXG4gICAgLy90aGlzIG1ldGhvZCByZXR1cm5zIHRoZSBub2RlcyBub24gb2Ygd2hvc2UgYW5jZXN0b3JzIGlzIG5vdCBpbiBnaXZlbiBub2Rlc1xuICAgIGdldFRvcE1vc3ROb2RlczogZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBub2Rlc01hcFtub2Rlc1tpXS5pZCgpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJvb3RzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGUucGFyZW50KClbMF07XG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XG4gICAgICAgICAgICAgIGlmKG5vZGVzTWFwW3BhcmVudC5pZCgpXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm9vdHM7XG4gICAgfSxcbiAgICAvL1RoaXMgbWV0aG9kIGNoZWNrcyBpZiBhbGwgb2YgdGhlIGdpdmVuIG5vZGVzIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFzc3VtaW5nIHRoYXQgdGhlIHNpemUgXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcbiAgICBhbGxIYXZlVGhlU2FtZVBhcmVudDogZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVzWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhKFwicGFyZW50XCIpICE9IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG1vdmVOb2RlczogZnVuY3Rpb24ocG9zaXRpb25EaWZmLCBub2Rlcywgbm90Q2FsY1RvcE1vc3ROb2Rlcykge1xuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9wTW9zdE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gdG9wTW9zdE5vZGVzW2ldO1xuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xuICAgICAgICB2YXIgb2xkWSA9IG5vZGUucG9zaXRpb24oXCJ5XCIpO1xuICAgICAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXG4gICAgICAgICAgeTogb2xkWSArIHBvc2l0aW9uRGlmZi55XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMubW92ZU5vZGVzKHBvc2l0aW9uRGlmZiwgY2hpbGRyZW4sIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29udmVydFRvTW9kZWxQb3NpdGlvbjogZnVuY3Rpb24gKHJlbmRlcmVkUG9zaXRpb24pIHtcbiAgICAgIHZhciBwYW4gPSBjeS5wYW4oKTtcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xuXG4gICAgICB2YXIgeCA9IChyZW5kZXJlZFBvc2l0aW9uLnggLSBwYW4ueCkgLyB6b29tO1xuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfTtcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xuICAgIFxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xuICAgICAgICBzZWxlY3RlZEVsZXMgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KHNlbGVjdGVkRWxlcyk7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XG4gICAgfSxcbiAgICBnZXROZWlnaGJvdXJzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xuICAgICAgICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gdGhpcy5nZXROZWlnaGJvdXJzT2ZOb2RlcyhzZWxlY3RlZEVsZXMpO1xuICAgICAgICByZXR1cm4gZWxlc1RvSGlnaGxpZ2h0O1xuICAgIH0sXG4gICAgZ2V0TmVpZ2hib3Vyc09mTm9kZXM6IGZ1bmN0aW9uKF9ub2Rlcyl7XG4gICAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5wYXJlbnRzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpKTtcbiAgICAgICAgbm9kZXMgPSBub2Rlcy5hZGQobm9kZXMuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIHZhciBuZWlnaGJvcmhvb2RFbGVzID0gbm9kZXMubmVpZ2hib3Job29kKCk7XG4gICAgICAgIHZhciBlbGVzVG9SZXR1cm4gPSBub2Rlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XG4gICAgICAgIGVsZXNUb1JldHVybiA9IGVsZXNUb1JldHVybi5hZGQoZWxlc1RvUmV0dXJuLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICByZXR1cm4gZWxlc1RvUmV0dXJuO1xuICAgIH0sXG4gICAgZXh0ZW5kTm9kZUxpc3Q6IGZ1bmN0aW9uKG5vZGVzVG9TaG93KXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL2FkZCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICAvL2FkZCBwYXJlbnRzXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XG4gICAgICAgIC8vYWRkIGNvbXBsZXggY2hpbGRyZW5cbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XG5cbiAgICAgICAgLy8gdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xuICAgICAgICAvLyB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzIT0ncHJvY2VzcyddXCIpO1xuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xuXG4gICAgICAgIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKS5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcyk7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcblxuICAgICAgICAvL2FkZCBwYXJlbnRzXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkucGFyZW50cygpKTtcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xuICAgIH0sXG4gICAgZXh0ZW5kUmVtYWluaW5nTm9kZXMgOiBmdW5jdGlvbihub2Rlc1RvRmlsdGVyLCBhbGxOb2Rlcyl7XG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xuICAgICAgICB2YXIgbm9kZXNUb1Nob3cgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0ZpbHRlcik7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlc1RvU2hvdyk7XG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcbiAgICB9LFxuICAgIGdldFByb2Nlc3Nlc09mTm9kZXM6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XG4gICAgfSxcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xuICAgIG5vbmVJc05vdEhpZ2hsaWdodGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWROb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikubm9kZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XG5cbiAgICAgICAgcmV0dXJuIG5vdEhpZ2hsaWdodGVkTm9kZXMubGVuZ3RoICsgbm90SGlnaGxpZ2h0ZWRFZGdlcy5sZW5ndGggPT09IDA7XG4gICAgfSxcbiAgICBcbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xuICAgIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChfbm9kZXMpIHtcbiAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICAgICAgXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcygpO1xuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgdmFyIG5vZGVzVG9LZWVwID0gdGhpcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcbiAgICAgIHJldHVybiBub2Rlc05vdFRvS2VlcC5yZW1vdmUoKTtcbiAgICB9LFxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICByZXR1cm4gZWxlcy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXG4gICAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xuICAgICAgICByZXR1cm4gZWxlcztcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcbiAgICBcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xuICAgIGdldEN5U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY29tcGFydG1lbnQnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3JvdW5kcmVjdGFuZ2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdwaGVub3R5cGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hleGFnb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgcmV0dXJuICdwb2x5Z29uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IF9jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgX2NsYXNzID09ICdjb21wbGV4J1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAncHJvY2VzcycgfHwgX2NsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIF9jbGFzcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2VsbGlwc2UnO1xuICAgIH0sXG4gICAgZ2V0Q3lBcnJvd1NoYXBlOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICBpZiAoX2NsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlLWNyb3NzJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdpbmhpYml0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzdGltdWxhdGlvbicgfHwgX2NsYXNzID09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICB9LFxuICAgIGdldEVsZW1lbnRDb250ZW50OiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGhlbm90eXBlJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ2xhYmVsJykpe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZWxlLmRhdGEoJ2luZm9MYWJlbCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnYW5kJykge1xuICAgICAgICAgICAgY29udGVudCA9ICdBTkQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb3InKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ09SJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ25vdCcpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTk9UJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnXFxcXFxcXFwnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJz8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS53aWR0aCgpIHx8IGVsZS5kYXRhKCdiYm94JykudztcblxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcbiAgICAgICAgICAgIHdpZHRoOiAoIF9jbGFzcz09KCdjb21wbGV4JykgfHwgX2NsYXNzPT0oJ2NvbXBhcnRtZW50JykgKT90ZXh0V2lkdGggKiAyOnRleHRXaWR0aFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb250ID0gdGhpcy5nZXRMYWJlbFRleHRTaXplKGVsZSkgKyBcInB4IEFyaWFsXCI7XG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcbiAgICB9LFxuICAgIGdldExhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJykge1xuICAgICAgICByZXR1cm4gMjA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUsIDEuNSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdjb21wbGV4JyB8fCBfY2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgcmV0dXJuIDE2O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xuXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcbiAgICB9LFxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXG4gICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxuICAgICAgKi9cbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcbiAgICAgICAqL1xuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaW5mb0xhYmVsID0gXCJcIjtcbiAgICAgIC8qXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XG4gICAgICAgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgIHZhciBjaGlsZEluZm8gPSB0aGlzLmdldEluZm9MYWJlbChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XG4gICAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xuICAgICAgICB9XG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XG4gICAgICB9XG5cbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcbiAgICAgIHJldHVybiBpbmZvTGFiZWw7XG4gICAgfSxcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogQ2hlY2sgdGhlIGxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxuICAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxuICAgICAgKi9cbiAgICAgIHZhciBsYWJlbCA9IG5vZGUuZGF0YSgnbGFiZWwnKTtcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcbiAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcbiAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcblxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XG5cbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xuICAgIH0sXG4gICAgLypcbiAgICAqIEdldCBzb3VyY2UvdGFyZ2V0IGVuZCBwb2ludCBvZiBlZGdlIGluICd4LXZhbHVlJSB5LXZhbHVlJScgZm9ybWF0LiBJdCByZXR1cm5zICdvdXRzaWRlLXRvLW5vZGUnIGlmIHRoZXJlIGlzIG5vIHNvdXJjZS90YXJnZXQgcG9ydC5cbiAgICAqL1xuICAgIGdldEVuZFBvaW50OiBmdW5jdGlvbihlZGdlLCBzb3VyY2VPclRhcmdldCkge1xuICAgICAgdmFyIHBvcnRJZCA9IHNvdXJjZU9yVGFyZ2V0ID09PSAnc291cmNlJyA/IGVkZ2UuZGF0YSgncG9ydHNvdXJjZScpIDogZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jyk7XG5cbiAgICAgIGlmIChwb3J0SWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ291dHNpZGUtdG8tbm9kZSc7IC8vIElmIHRoZXJlIGlzIG5vIHBvcnRzb3VyY2UgcmV0dXJuIHRoZSBkZWZhdWx0IHZhbHVlIHdoaWNoIGlzICdvdXRzaWRlLXRvLW5vZGUnXG4gICAgICB9XG5cbiAgICAgIHZhciBlbmROb2RlID0gc291cmNlT3JUYXJnZXQgPT09ICdzb3VyY2UnID8gZWRnZS5zb3VyY2UoKSA6IGVkZ2UudGFyZ2V0KCk7XG4gICAgICB2YXIgcG9ydHMgPSBlbmROb2RlLmRhdGEoJ3BvcnRzJyk7XG4gICAgICB2YXIgcG9ydDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBvcnRzW2ldLmlkID09PSBwb3J0SWQpIHtcbiAgICAgICAgICBwb3J0ID0gcG9ydHNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gJ291dHNpZGUtdG8tbm9kZSc7IC8vIElmIHBvcnQgaXMgbm90IGZvdW5kIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZSB3aGljaCBpcyAnb3V0c2lkZS10by1ub2RlJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJycgKyBwb3J0LnggKyAnJSAnICsgcG9ydC55ICsgJyUnO1xuICAgIH1cbiAgICBcbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xuIiwiLypcbiAqIEZpbGUgVXRpbGl0aWVzOiBUbyBiZSB1c2VkIG9uIHJlYWQvd3JpdGUgZmlsZSBvcGVyYXRpb25cbiAqL1xuXG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xudmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91aS11dGlsaXRpZXMnKTtcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZ3JhcGgtdXRpbGl0aWVzJyk7XG52YXIgdXBkYXRlR3JhcGggPSBncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaC5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIHNhdmVBcyA9IGxpYnMuc2F2ZUFzO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIFN0YXJ0XG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxuZnVuY3Rpb24gYjY0dG9CbG9iKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpIHtcbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcbiAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcblxuICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xuICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xuXG4gIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xuICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcblxuICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xuXG4gICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XG4gIH1cblxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICByZXR1cm4gYmxvYjtcbn1cblxuZnVuY3Rpb24gbG9hZFhNTERvYyhmdWxsRmlsZVBhdGgpIHtcbiAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xuICAgIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgeGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICB9XG4gIHhodHRwLm9wZW4oXCJHRVRcIiwgZnVsbEZpbGVQYXRoLCBmYWxzZSk7XG4gIHhodHRwLnNlbmQoKTtcbiAgcmV0dXJuIHhodHRwLnJlc3BvbnNlWE1MO1xufVxuXG4vLyBTaG91bGQgdGhpcyBiZSBleHBvc2VkIG9yIHNob3VsZCB0aGlzIGJlIG1vdmVkIHRvIHRoZSBoZWxwZXIgZnVuY3Rpb25zIHNlY3Rpb24/XG5mdW5jdGlvbiB0ZXh0VG9YbWxPYmplY3QodGV4dCkge1xuICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcbiAgICB2YXIgZG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxET00nKTtcbiAgICBkb2MuYXN5bmMgPSAnZmFsc2UnO1xuICAgIGRvYy5sb2FkWE1MKHRleHQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgJ3RleHQveG1sJyk7XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cbi8vIEhlbHBlciBmdW5jdGlvbnMgRW5kXG5cbmZ1bmN0aW9uIGZpbGVVdGlsaXRpZXMoKSB7fVxuZmlsZVV0aWxpdGllcy5sb2FkWE1MRG9jID0gbG9hZFhNTERvYztcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNQbmcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgcG5nQ29udGVudCA9IGN5LnBuZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcblxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxuICB2YXIgYjY0ZGF0YSA9IHBuZ0NvbnRlbnQuc3Vic3RyKHBuZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLnBuZ1wiKTtcbn07XG5cbmZpbGVVdGlsaXRpZXMuc2F2ZUFzSnBnID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIGpwZ0NvbnRlbnQgPSBjeS5qcGcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XG5cbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcbiAgdmFyIGI2NGRhdGEgPSBqcGdDb250ZW50LnN1YnN0cihqcGdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9qcGdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5qcGdcIik7XG59O1xuXG5maWxlVXRpbGl0aWVzLmxvYWRTYW1wbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgZm9sZGVycGF0aCkge1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XG4gIFxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhIHNhbXBsZSBpcyBiZWluZyBsb2FkZWRcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVcIiwgWyBmaWxlbmFtZSBdICk7IC8vIEFsaWFzZXMgZm9yIHNiZ252aXpMb2FkU2FtcGxlU3RhcnRcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlU3RhcnRcIiwgWyBmaWxlbmFtZSBdICk7XG4gIFxuICAvLyBsb2FkIHhtbCBkb2N1bWVudCB1c2UgZGVmYXVsdCBmb2xkZXIgcGF0aCBpZiBpdCBpcyBub3Qgc3BlY2lmaWVkXG4gIHZhciB4bWxPYmplY3QgPSBsb2FkWE1MRG9jKChmb2xkZXJwYXRoIHx8ICdzYW1wbGUtYXBwL3NhbXBsZXMvJykgKyBmaWxlbmFtZSk7XG4gIFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh4bWxPYmplY3QpKTtcbiAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xuICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZUVuZFwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gVHJpZ2dlciBhbiBldmVudCBzaWduYWxpbmcgdGhhdCBhIHNhbXBsZSBpcyBsb2FkZWRcbiAgfSwgMCk7XG59O1xuXG4vKlxuICBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIHJlbW90ZWx5IGRlZmluZWQgdG8gYWRkIHNwZWNpZmljIGJlaGF2aW9yIHRoYXQgaXNuJ3QgaW1wbGVtZW50ZWQgaGVyZS5cbiAgaXQgaXMgY29tcGxldGVseSBvcHRpb25hbC5cbiAgc2lnbmF0dXJlOiBjYWxsYmFjayh0ZXh0WG1sKVxuKi9cbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTEZpbGUgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICBcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYW4gZXh0ZXJuYWwgZmlsZSBpcyBiZWluZyBsb2FkZWRcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRGaWxlU3RhcnRcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZVN0YXJ0XCIsIFsgZmlsZS5uYW1lIF0gKTsgXG4gIFxuICB2YXIgdGV4dFR5cGUgPSAvdGV4dC4qLztcblxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJykgY2FsbGJhY2sodGV4dCk7XG4gICAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcbiAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVFbmRcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgZmlsZSBpcyBsb2FkZWRcbiAgICB9LCAwKTtcbiAgfTtcblxuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbn07XG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxUZXh0ID0gZnVuY3Rpb24odGV4dERhdGEpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dERhdGEpKSk7XG4gICAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgICB9LCAwKTtcblxufTtcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNTYmdubWwgPSBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbykge1xuICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoZmlsZW5hbWUsIHJlbmRlckluZm8pO1xuICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xuICAgIHR5cGU6IFwidGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04O1wiLFxuICB9KTtcbiAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcbn07XG5maWxlVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUZXh0VG9Kc29uID0gZnVuY3Rpb24oc2Jnbm1sVGV4dCl7XG4gICAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdChzYmdubWxUZXh0KSk7XG59O1xuXG5maWxlVXRpbGl0aWVzLmNyZWF0ZUpzb24gPSBmdW5jdGlvbihqc29uKXtcbiAgICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoKTtcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXRpbGl0aWVzO1xuIiwiLypcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIHNiZ252aXogZ3JhcGhzXG4gKi9cblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG5mdW5jdGlvbiBncmFwaFV0aWxpdGllcygpIHt9XG5cbmdyYXBoVXRpbGl0aWVzLnVwZGF0ZUdyYXBoID0gZnVuY3Rpb24oY3lHcmFwaCkge1xuICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhTdGFydFwiICk7XG4gIC8vIFJlc2V0IHVuZG8vcmVkbyBzdGFjayBhbmQgYnV0dG9ucyB3aGVuIGEgbmV3IGdyYXBoIGlzIGxvYWRlZFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkucmVzZXQoKTtcbi8vICAgIHRoaXMucmVzZXRVbmRvUmVkb0J1dHRvbnMoKTtcbiAgfVxuXG4gIGN5LnN0YXJ0QmF0Y2goKTtcbiAgLy8gY2xlYXIgZGF0YVxuICBjeS5yZW1vdmUoJyonKTtcbiAgY3kuYWRkKGN5R3JhcGgpO1xuXG4gIC8vYWRkIHBvc2l0aW9uIGluZm9ybWF0aW9uIHRvIGRhdGEgZm9yIHByZXNldCBsYXlvdXRcbiAgdmFyIHBvc2l0aW9uTWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB4UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmJib3gueDtcbiAgICB2YXIgeVBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5iYm94Lnk7XG4gICAgcG9zaXRpb25NYXBbY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmlkXSA9IHsneCc6IHhQb3MsICd5JzogeVBvc307XG4gIH1cblxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjeS5lbmRCYXRjaCgpO1xuICBcbiAgdmFyIGxheW91dCA9IGN5LmxheW91dCh7XG4gICAgbmFtZTogJ3ByZXNldCcsXG4gICAgcG9zaXRpb25zOiBwb3NpdGlvbk1hcCxcbiAgICBmaXQ6IHRydWUsXG4gICAgcGFkZGluZzogNTBcbiAgfSk7XG4gIFxuICAvLyBDaGVjayB0aGlzIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICBsYXlvdXQucnVuKCk7XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHN0eWxlXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIC8vIEluaXRpbGl6ZSB0aGUgYmVuZCBwb2ludHMgb25jZSB0aGUgZWxlbWVudHMgYXJlIGNyZWF0ZWRcbiAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcbiAgICBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmluaXRCZW5kUG9pbnRzKGN5LmVkZ2VzKCkpO1xuICB9XG4gIFxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhFbmRcIiApO1xufTtcblxuZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlUGFkZGluZ3MgPSBmdW5jdGlvbihwYWRkaW5nUGVyY2VudCkge1xuICAvL0FzIGRlZmF1bHQgdXNlIHRoZSBjb21wb3VuZCBwYWRkaW5nIHZhbHVlXG4gIGlmICghcGFkZGluZ1BlcmNlbnQpIHtcbiAgICB2YXIgY29tcG91bmRQYWRkaW5nID0gb3B0aW9ucy5jb21wb3VuZFBhZGRpbmc7XG4gICAgcGFkZGluZ1BlcmNlbnQgPSB0eXBlb2YgY29tcG91bmRQYWRkaW5nID09PSAnZnVuY3Rpb24nID8gY29tcG91bmRQYWRkaW5nLmNhbGwoKSA6IGNvbXBvdW5kUGFkZGluZztcbiAgfVxuXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIHZhciB0b3RhbCA9IDA7XG4gIHZhciBudW1PZlNpbXBsZXMgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAodGhlTm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgdGhlTm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS53aWR0aCgpKTtcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcbiAgICAgIG51bU9mU2ltcGxlcysrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjYWxjX3BhZGRpbmcgPSAocGFkZGluZ1BlcmNlbnQgLyAxMDApICogTWF0aC5mbG9vcih0b3RhbCAvICgyICogbnVtT2ZTaW1wbGVzKSk7XG4gIGlmIChjYWxjX3BhZGRpbmcgPCA1KSB7XG4gICAgY2FsY19wYWRkaW5nID0gNTtcbiAgfVxuXG4gIHJldHVybiBjYWxjX3BhZGRpbmc7XG59O1xuXG5ncmFwaFV0aWxpdGllcy5yZWNhbGN1bGF0ZVBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XG4gIC8vIHRoaXMuY2FsY3VsYXRlZFBhZGRpbmdzIGlzIG5vdCB3b3JraW5nIGhlcmUgXG4gIC8vIFRPRE86IHJlcGxhY2UgdGhpcyByZWZlcmVuY2Ugd2l0aCB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBvbmNlIHRoZSByZWFzb24gaXMgZmlndXJlZCBvdXRcbiAgZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzID0gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBncmFwaFV0aWxpdGllczsiLCJ2YXIgdHh0VXRpbCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKTtcbnZhciBsaWJzYmduanMgPSByZXF1aXJlKCdsaWJzYmduLmpzJyk7XG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcbnZhciBwa2dWZXJzaW9uID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjsgLy8gbmVlZCBpbmZvIGFib3V0IHNiZ252aXogdG8gcHV0IGluIHhtbFxudmFyIHBrZ05hbWUgPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS5uYW1lO1xuXG52YXIganNvblRvU2Jnbm1sID0ge1xuICAgIC8qXG4gICAgICAgIHRha2VzIHJlbmRlckluZm8gYXMgYW4gb3B0aW9uYWwgYXJndW1lbnQuIEl0IGNvbnRhaW5zIGFsbCB0aGUgaW5mb3JtYXRpb24gbmVlZGVkIHRvIHNhdmVcbiAgICAgICAgdGhlIHN0eWxlIGFuZCBjb2xvcnMgdG8gdGhlIHJlbmRlciBleHRlbnNpb24uIFNlZSBuZXd0L2FwcC11dGlsaXRpZXMgZ2V0QWxsU3R5bGVzKClcbiAgICAgICAgU3RydWN0dXJlOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGUgbWFwIGJhY2tncm91bmQgY29sb3IsXG4gICAgICAgICAgICBjb2xvcnM6IHtcbiAgICAgICAgICAgICAgdmFsaWRYbWxWYWx1ZTogY29sb3JfaWRcbiAgICAgICAgICAgICAgLi4uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAgICAgc3R5bGVLZXkxOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkTGlzdDogbGlzdCBvZiB0aGUgbm9kZXMgaWRzIHRoYXQgaGF2ZSB0aGlzIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3R5bGVLZXkyOiAuLi5cbiAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICovXG4gICAgY3JlYXRlU2Jnbm1sIDogZnVuY3Rpb24oZmlsZW5hbWUsIHJlbmRlckluZm8pe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcbiAgICAgICAgdmFyIG1hcElEID0gdHh0VXRpbC5nZXRYTUxWYWxpZElkKGZpbGVuYW1lKTtcbiAgICAgICAgdmFyIGhhc0V4dGVuc2lvbiA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFzUmVuZGVyRXh0ZW5zaW9uID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVySW5mbyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGhhc0V4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgICAgICBoYXNSZW5kZXJFeHRlbnNpb24gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hZGQgaGVhZGVyc1xuICAgICAgICB4bWxIZWFkZXIgPSBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSd5ZXMnPz5cXG5cIjtcbiAgICAgICAgdmFyIHNiZ24gPSBuZXcgbGlic2JnbmpzLlNiZ24oe3htbG5zOiAnaHR0cDovL3NiZ24ub3JnL2xpYnNiZ24vMC4zJ30pO1xuICAgICAgICB2YXIgbWFwID0gbmV3IGxpYnNiZ25qcy5NYXAoe2xhbmd1YWdlOiAncHJvY2VzcyBkZXNjcmlwdGlvbicsIGlkOiBtYXBJRH0pO1xuICAgICAgICBpZiAoaGFzRXh0ZW5zaW9uKSB7IC8vIGV4dGVuc2lvbiBpcyB0aGVyZVxuICAgICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IG5ldyBsaWJzYmduanMuRXh0ZW5zaW9uKCk7XG4gICAgICAgICAgICBpZiAoaGFzUmVuZGVyRXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uLmFkZChzZWxmLmdldFJlbmRlckV4dGVuc2lvblNiZ25tbChyZW5kZXJJbmZvKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXAuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYWxsIGdseXBoc1xuICAgICAgICB2YXIgZ2x5cGhMaXN0ID0gW107XG4gICAgICAgIGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIWVsZS5pc0NoaWxkKCkpXG4gICAgICAgICAgICAgICAgZ2x5cGhMaXN0ID0gZ2x5cGhMaXN0LmNvbmNhdChzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSkpOyAvLyByZXR1cm5zIHBvdGVudGlhbGx5IG1vcmUgdGhhbiAxIGdseXBoXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBhZGQgdGhlbSB0byB0aGUgbWFwXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGdseXBoTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWFwLmFkZEdseXBoKGdseXBoTGlzdFtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYWxsIGFyY3NcbiAgICAgICAgY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXAuYWRkQXJjKHNlbGYuZ2V0QXJjU2Jnbm1sKGVsZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzYmduLnNldE1hcChtYXApO1xuICAgICAgICByZXR1cm4geG1sSGVhZGVyICsgc2Jnbi50b1hNTCgpO1xuICAgIH0sXG5cbiAgICAvLyBzZWUgY3JlYXRlU2Jnbm1sIGZvciBpbmZvIG9uIHRoZSBzdHJ1Y3R1cmUgb2YgcmVuZGVySW5mb1xuICAgIGdldFJlbmRlckV4dGVuc2lvblNiZ25tbCA6IGZ1bmN0aW9uKHJlbmRlckluZm8pIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgdmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbih7IGlkOiAncmVuZGVySW5mb3JtYXRpb24nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcmVuZGVySW5mby5iYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbU5hbWU6IHBrZ05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtVmVyc2lvbjogcGtnVmVyc2lvbiB9KTtcblxuICAgICAgICAvLyBwb3B1bGF0ZSBsaXN0IG9mIGNvbG9yc1xuICAgICAgICB2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xuICAgICAgICBmb3IgKHZhciBjb2xvciBpbiByZW5kZXJJbmZvLmNvbG9ycykge1xuICAgICAgICAgICAgdmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyByZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uKHtpZDogcmVuZGVySW5mby5jb2xvcnNbY29sb3JdLCB2YWx1ZTogY29sb3J9KTtcbiAgICAgICAgICAgIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVySW5mb3JtYXRpb24uc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9ucyhsaXN0T2ZDb2xvckRlZmluaXRpb25zKTtcblxuICAgICAgICAvLyBwb3B1bGF0ZXMgc3R5bGVzXG4gICAgICAgIHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcygpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVySW5mby5zdHlsZXMpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHJlbmRlckluZm8uc3R5bGVzW2tleV07XG4gICAgICAgICAgICB2YXIgeG1sU3R5bGUgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlN0eWxlKHtpZDogdHh0VXRpbC5nZXRYTUxWYWxpZElkKGtleSksIGlkTGlzdDogc3R5bGUuaWRMaXN0LmpvaW4oJyAnKX0pO1xuICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogc3R5bGUucHJvcGVydGllcy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogc3R5bGUucHJvcGVydGllcy5mb250U3R5bGUsXG4gICAgICAgICAgICAgICAgZmlsbDogc3R5bGUucHJvcGVydGllcy5maWxsLCAvLyBmaWxsIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IHN0eWxlLnByb3BlcnRpZXMuc3Ryb2tlV2lkdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XG4gICAgICAgICAgICBsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoeG1sU3R5bGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZlN0eWxlcyhsaXN0T2ZTdHlsZXMpO1xuXG4gICAgICAgIHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcbiAgICB9LFxuXG4gICAgZ2V0R2x5cGhTYmdubWwgOiBmdW5jdGlvbihub2RlKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBub2RlQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcblxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogbm9kZS5fcHJpdmF0ZS5kYXRhLmlkLCBjbGFzc186IG5vZGVDbGFzc30pO1xuXG4gICAgICAgIC8vIGFzc2lnbiBjb21wYXJ0bWVudFJlZlxuICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xuICAgICAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIGdseXBoLmNvbXBhcnRtZW50UmVmID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGguY29tcGFydG1lbnRSZWYgPSBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1pc2MgaW5mb3JtYXRpb25cbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICBpZih0eXBlb2YgbGFiZWwgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBnbHlwaC5zZXRMYWJlbChuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBsYWJlbH0pKTtcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGdseXBoLnNldENsb25lKG5ldyBsaWJzYmduanMuQ2xvbmVUeXBlKCkpO1xuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRHbHlwaEJib3gobm9kZSkpO1xuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBwb3J0cy5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xuICAgICAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyBwb3J0c1tpXS55ICogbm9kZS5oZWlnaHQoKSAvIDEwMDtcblxuICAgICAgICAgICAgZ2x5cGguYWRkUG9ydChuZXcgbGlic2JnbmpzLnBQb3J0KHtpZDogcG9ydHNbaV0uaWQsIHg6IHgsIHk6IHl9KSk7XG4gICAgICAgICAgICAvKnNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8cG9ydCBpZD0nXCIgKyBwb3J0c1tpXS5pZCtcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiOyovXG4gICAgICAgIH1cbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICB2YXIgYm94R2x5cGggPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3NbaV07XG4gICAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3NJZCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCtcIl9cIitpO1xuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBzdGF0ZXNhbmRpbmZvc0lkLCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBnbHlwaCBtZW1iZXJzIHRoYXQgYXJlIG5vdCBzdGF0ZSB2YXJpYWJsZXMgb3IgdW5pdCBvZiBpbmZvOiBzdWJ1bml0c1xuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGVDbGFzcyA9PT0gXCJzdWJtYXBcIil7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBnbHlwaE1lbWJlckxpc3QgPSBzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhNZW1iZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGdseXBoLmFkZEdseXBoTWVtYmVyKGdseXBoTWVtYmVyTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjdXJyZW50IGdseXBoIGlzIGRvbmVcbiAgICAgICAgZ2x5cGhMaXN0LnB1c2goZ2x5cGgpO1xuXG4gICAgICAgIC8vIGtlZXAgZ29pbmcgd2l0aCBhbGwgdGhlIGluY2x1ZGVkIGdseXBoc1xuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdseXBoTGlzdCA9IGdseXBoTGlzdC5jb25jYXQoc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICBnbHlwaExpc3Q7XG4gICAgfSxcblxuICAgIGdldEFyY1NiZ25tbCA6IGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG5cbiAgICAgICAgLy9UZW1wb3JhcnkgaGFjayB0byByZXNvbHZlIFwidW5kZWZpbmVkXCIgYXJjIHNvdXJjZSBhbmQgdGFyZ2V0c1xuICAgICAgICB2YXIgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnR0YXJnZXQ7XG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcblxuICAgICAgICBpZiAoYXJjU291cmNlID09IG51bGwgfHwgYXJjU291cmNlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XG5cbiAgICAgICAgaWYgKGFyY1RhcmdldCA9PSBudWxsIHx8IGFyY1RhcmdldC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xuXG4gICAgICAgIHZhciBhcmNJZCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5pZDtcbiAgICAgICAgdmFyIGFyYyA9IG5ldyBsaWJzYmduanMuQXJjKHtpZDogYXJjSWQsIHNvdXJjZTogYXJjU291cmNlLCB0YXJnZXQ6IGFyY1RhcmdldCwgY2xhc3NfOiBlZGdlLl9wcml2YXRlLmRhdGEuY2xhc3N9KTtcblxuICAgICAgICBhcmMuc2V0U3RhcnQobmV3IGxpYnNiZ25qcy5TdGFydFR5cGUoe3g6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRYLCB5OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WX0pKTtcblxuICAgICAgICAvLyBFeHBvcnQgYmVuZCBwb2ludHMgaWYgZWRnZUJlbmRFZGl0aW5nRXh0ZW5zaW9uIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcbiAgICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xuICAgICAgICAgIGlmKHNlZ3B0cyl7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBzZWdwdHMgJiYgaSA8IHNlZ3B0cy5sZW5ndGg7IGkgPSBpICsgMil7XG4gICAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcbiAgICAgICAgICAgICAgdmFyIGJlbmRZID0gc2VncHRzW2kgKyAxXTtcblxuICAgICAgICAgICAgICBhcmMuYWRkTmV4dChuZXcgbGlic2JnbmpzLk5leHRUeXBlKHt4OiBiZW5kWCwgeTogYmVuZFl9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXJjLnNldEVuZChuZXcgbGlic2JnbmpzLkVuZFR5cGUoe3g6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRZfSkpO1xuXG4gICAgICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5jYXJkaW5hbGl0eTtcbiAgICAgICAgaWYodHlwZW9mIGNhcmRpbmFsaXR5ICE9ICd1bmRlZmluZWQnICYmIGNhcmRpbmFsaXR5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFyYy5hZGRHbHlwaChuZXcgbGlic2JnbmpzLkdseXBoKHtcbiAgICAgICAgICAgICAgICBpZDogYXJjLmlkKydfY2FyZCcsXG4gICAgICAgICAgICAgICAgY2xhc3NfOiAnY2FyZGluYWxpdHknLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBjYXJkaW5hbGl0eX0pLFxuICAgICAgICAgICAgICAgIGJib3g6IG5ldyBsaWJzYmduanMuQmJveCh7eDogMCwgeTogMCwgdzogMCwgaDogMH0pIC8vIGR1bW15IGJib3gsIG5lZWRlZCBmb3IgZm9ybWF0IGNvbXBsaWFuY2VcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmM7XG4gICAgfSxcblxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XG4gICAgICAgIHJldHVybiBuZXcgbGlic2JnbmpzLkJib3goe3g6IHgsIHk6IHksIHc6IHdpZHRoLCBoOiBoZWlnaHR9KTtcbiAgICB9LFxuXG4gICAgYWRkU3RhdGVBbmRJbmZvQmJveCA6IGZ1bmN0aW9uKG5vZGUsIGJveEdseXBoKXtcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XG5cbiAgICAgICAgdmFyIHggPSBib3hCYm94LnggLyAxMDAgKiBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcblxuICAgICAgICB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgKHggLSBib3hCYm94LncvMik7XG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcblxuICAgICAgICByZXR1cm4gbmV3IGxpYnNiZ25qcy5CYm94KHt4OiB4LCB5OiB5LCB3OiBib3hCYm94LncsIGg6IGJveEJib3guaH0pO1xuICAgIH0sXG5cbiAgICBhZGRTdGF0ZUJveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XG5cbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICdzdGF0ZSB2YXJpYWJsZSd9KTtcbiAgICAgICAgdmFyIHN0YXRlID0gbmV3IGxpYnNiZ25qcy5TdGF0ZVR5cGUoKTtcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFsdWUgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG5vZGUuc3RhdGUudmFsdWU7XG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhcmlhYmxlICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgc3RhdGUudmFyaWFibGUgPSBub2RlLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICBnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSkpO1xuXG4gICAgICAgIHJldHVybiBnbHlwaDtcbiAgICB9LFxuXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XG4gICAgICAgIHZhciBnbHlwaCA9IG5ldyBsaWJzYmduanMuR2x5cGgoe2lkOiBpZCwgY2xhc3NfOiAndW5pdCBvZiBpbmZvcm1hdGlvbid9KTtcbiAgICAgICAgdmFyIGxhYmVsID0gbmV3IGxpYnNiZ25qcy5MYWJlbCgpO1xuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgbGFiZWwudGV4dCA9IG5vZGUubGFiZWwudGV4dDtcbiAgICAgICAgZ2x5cGguc2V0TGFiZWwobGFiZWwpO1xuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcblxuICAgICAgICByZXR1cm4gZ2x5cGg7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uVG9TYmdubWw7XG4iLCIvKlxuICogTGlzdGVuIGRvY3VtZW50IGZvciBrZXlib2FyZCBpbnB1dHMgYW5kIGV4cG9ydHMgdGhlIHV0aWxpdGllcyB0aGF0IGl0IG1ha2VzIHVzZSBvZlxuICovXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMgPSB7XG4gIGlzTnVtYmVyS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuICggZS5rZXlDb2RlID49IDQ4ICYmIGUua2V5Q29kZSA8PSA1NyApIHx8ICggZS5rZXlDb2RlID49IDk2ICYmIGUua2V5Q29kZSA8PSAxMDUgKTtcbiAgfSxcbiAgaXNEb3RLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxOTA7XG4gIH0sXG4gIGlzTWludXNTaWduS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTA5IHx8IGUua2V5Q29kZSA9PT0gMTg5O1xuICB9LFxuICBpc0xlZnRLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNztcbiAgfSxcbiAgaXNSaWdodEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5O1xuICB9LFxuICBpc0JhY2tzcGFjZUtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDg7XG4gIH0sXG4gIGlzVGFiS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gOTtcbiAgfSxcbiAgaXNFbnRlcktleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEzO1xuICB9LFxuICBpc0ludGVnZXJGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xuICAgIHJldHVybiB0aGlzLmlzQ3RybE9yQ29tbWFuZFByZXNzZWQoZSkgfHwgdGhpcy5pc01pbnVzU2lnbktleShlKSB8fCB0aGlzLmlzTnVtYmVyS2V5KGUpIFxuICAgICAgICAgICAgfHwgdGhpcy5pc0JhY2tzcGFjZUtleShlKSB8fCB0aGlzLmlzVGFiS2V5KGUpIHx8IHRoaXMuaXNMZWZ0S2V5KGUpIHx8IHRoaXMuaXNSaWdodEtleShlKSB8fCB0aGlzLmlzRW50ZXJLZXkoZSk7XG4gIH0sXG4gIGlzRmxvYXRGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xuICAgIHJldHVybiB0aGlzLmlzSW50ZWdlckZpZWxkSW5wdXQodmFsdWUsIGUpIHx8IHRoaXMuaXNEb3RLZXkoZSk7XG4gIH0sXG4gIGlzQ3RybE9yQ29tbWFuZFByZXNzZWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5jdHJsS2V5IHx8IGUubWV0YUtleTtcbiAgfVxufTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuaW50ZWdlci1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKTtcbiAgfSk7XG4gIFxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNGbG9hdEZpZWxkSW5wdXQodmFsdWUsIGUpO1xuICB9KTtcbiAgXG4gICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLmludGVnZXItaW5wdXQsLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgdmFyIG1pbiAgID0gJCh0aGlzKS5hdHRyKCdtaW4nKTtcbiAgICB2YXIgbWF4ICAgPSAkKHRoaXMpLmF0dHIoJ21heCcpO1xuICAgIHZhciB2YWx1ZSA9IHBhcnNlRmxvYXQoJCh0aGlzKS52YWwoKSk7XG4gICAgXG4gICAgaWYobWluICE9IG51bGwpIHtcbiAgICAgIG1pbiA9IHBhcnNlRmxvYXQobWluKTtcbiAgICB9XG4gICAgXG4gICAgaWYobWF4ICE9IG51bGwpIHtcbiAgICAgIG1heCA9IHBhcnNlRmxvYXQobWF4KTtcbiAgICB9XG4gICAgXG4gICAgaWYobWluICE9IG51bGwgJiYgdmFsdWUgPCBtaW4pIHtcbiAgICAgIHZhbHVlID0gbWluO1xuICAgIH1cbiAgICBlbHNlIGlmKG1heCAhPSBudWxsICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICB2YWx1ZSA9IG1heDtcbiAgICB9XG4gICAgXG4gICAgaWYoaXNOYU4odmFsdWUpKSB7XG4gICAgICBpZihtaW4gIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IG1pbjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobWF4ICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSBtYXg7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAkKHRoaXMpLnZhbChcIlwiICsgdmFsdWUpO1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkSW5wdXRVdGlsaXRpZXM7XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllcztcblxuIiwiLyogXG4gKiBUaGVzZSBhcmUgdGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGRpcmVjdGx5IHV0aWxpemVkIGJ5IHRoZSB1c2VyIGludGVyYWN0aW9ucy5cbiAqIElkZWFseSwgdGhpcyBmaWxlIGlzIGp1c3QgcmVxdWlyZWQgYnkgaW5kZXguanNcbiAqL1xuXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG5cbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxuLy8gSGVscGVycyBzdGFydFxuZnVuY3Rpb24gYmVmb3JlUGVyZm9ybUxheW91dCgpIHtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcblxuICBub2Rlcy5yZW1vdmVEYXRhKFwicG9ydHNcIik7XG4gIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0c291cmNlXCIpO1xuICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHRhcmdldFwiKTtcblxuICBub2Rlcy5kYXRhKFwicG9ydHNcIiwgW10pO1xuICBlZGdlcy5kYXRhKFwicG9ydHNvdXJjZVwiLCBbXSk7XG4gIGVkZ2VzLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIFtdKTtcblxuICAvLyBUT0RPIGRvIHRoaXMgYnkgdXNpbmcgZXh0ZW5zaW9uIEFQSVxuICBjeS4kKCcuZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcbn07XG4vLyBIZWxwZXJzIGVuZFxuXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge31cblxuLy8gRXhwYW5kIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXNUb0V4cGFuZCA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2Rlcyhub2Rlcyk7XG4gIGlmIChub2Rlc1RvRXhwYW5kLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1RvRXhwYW5kLFxuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmV4cGFuZChub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIGlmIChleHBhbmRDb2xsYXBzZS5jb2xsYXBzaWJsZU5vZGVzKG5vZGVzKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbY2xhc3M9J2NvbXBsZXgnXVwiKTtcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMoY29tcGxleGVzKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2RlczogY29tcGxleGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2VSZWN1cnNpdmVseShjb21wbGV4ZXMpO1xuICB9XG59O1xuXG4vLyBFeHBhbmQgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5leHBhbmRDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMoY3kubm9kZXMoKS5maWx0ZXIoXCJbY2xhc3M9J2NvbXBsZXgnXVwiKSk7XG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBDb2xsYXBzZSBhbGwgbm9kZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VBbGwgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBFeHBhbmQgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZEFsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygnOnZpc2libGUnKSk7XG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0IGFuZCBoaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuaGlkZU5vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIFxuICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG5cbiAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xuICB9XG59O1xuXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0LiBcbi8vIFRoZW4gdW5oaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QgYW5kIGhpZGVzIG90aGVycy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2hvd05vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIFxuICB2YXIgYWxsTm9kZXMgPSBjeS5lbGVtZW50cygpO1xuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcbiAgXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlkZVwiLCBub2Rlc1RvSGlkZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWRlKG5vZGVzVG9IaWRlKTtcbiAgfVxufTtcblxuLy8gVW5oaWRlcyBhbGwgZWxlbWVudHMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnNob3dBbGwgPSBmdW5jdGlvbigpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIGlmIChjeS5lbGVtZW50cygpLmxlbmd0aCA9PT0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5zaG93KGN5LmVsZW1lbnRzKCkpO1xuICB9XG59O1xuXG4vLyBSZW1vdmVzIHRoZSBnaXZlbiBlbGVtZW50cyBpbiBhIHNpbXBsZSB3YXkuIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZSA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xuICAgICAgZWxlczogZWxlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIHJlbW92ZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcbi8vIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZU5vZGVzU21hcnRcIiwge1xuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgICAgZWxlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQobm9kZXMpO1xuICB9XG59O1xuXG4vLyBIaWdobGlnaHRzIG5laWdoYm91cnMgb2YgdGhlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWdobGlnaHROZWlnaGJvdXJzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TmVpZ2hib3Vyc09mTm9kZXMobm9kZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xuICB9XG59O1xuXG4vLyBGaW5kcyB0aGUgZWxlbWVudHMgd2hvc2UgbGFiZWwgaW5jbHVkZXMgdGhlIGdpdmVuIGxhYmVsIGFuZCBoaWdobGlnaHRzIHByb2Nlc3NlcyBvZiB0aG9zZSBlbGVtZW50cy5cbi8vIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnNlYXJjaEJ5TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuICBpZiAobGFiZWwubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHZhciBub2Rlc1RvSGlnaGxpZ2h0ID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZSA9IGk7XG4gICAgfVxuICAgIGlmIChlbGUuZGF0YShcImxhYmVsXCIpICYmIGVsZS5kYXRhKFwibGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxhYmVsKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBpZiAobm9kZXNUb0hpZ2hsaWdodC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcblxuICBub2Rlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgfVxufTtcblxuLy8gSGlnaGxpZ2h0cyBwcm9jZXNzZXMgb2YgdGhlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbn07XG5cbi8vIFVuaGlnaGxpZ2h0cyBhbnkgaGlnaGxpZ2h0ZWQgZWxlbWVudC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZWxlbWVudFV0aWxpdGllcy5ub25lSXNOb3RIaWdobGlnaHRlZCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlSGlnaGxpZ2h0c1wiKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMoKTtcbiAgfVxufTtcblxuLy8gUGVyZm9ybXMgbGF5b3V0IGJ5IGdpdmVuIGxheW91dE9wdGlvbnMuIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi4gSG93ZXZlciwgYnkgc2V0dGluZyBub3RVbmRvYWJsZSBwYXJhbWV0ZXJcbi8vIHRvIGEgdHJ1dGh5IHZhbHVlIHlvdSBjYW4gZm9yY2UgYW4gdW5kYWJsZSBsYXlvdXQgb3BlcmF0aW9uIGluZGVwZW5kYW50IG9mICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5wZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0T3B0aW9ucywgbm90VW5kb2FibGUpIHtcbiAgLy8gVGhpbmdzIHRvIGRvIGJlZm9yZSBwZXJmb3JtaW5nIGxheW91dFxuICBiZWZvcmVQZXJmb3JtTGF5b3V0KCk7XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUgfHwgbm90VW5kb2FibGUpIHsgLy8gJ25vdFVuZG9hYmxlJyBmbGFnIGNhbiBiZSB1c2VkIHRvIGhhdmUgY29tcG9zaXRlIGFjdGlvbnMgaW4gdW5kby9yZWRvIHN0YWNrXG4gICAgdmFyIGxheW91dCA9IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpLmxheW91dChsYXlvdXRPcHRpb25zKTtcbiAgICBcbiAgICAvLyBDaGVjayB0aGlzIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgbGF5b3V0LnJ1bigpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwibGF5b3V0XCIsIHtcbiAgICAgIG9wdGlvbnM6IGxheW91dE9wdGlvbnMsXG4gICAgICBlbGVzOiBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKVxuICAgIH0pO1xuICB9XG59O1xuXG4vLyBDcmVhdGVzIGFuIHNiZ25tbCBmaWxlIGNvbnRlbnQgZnJvbSB0aGUgZXhpc2luZyBncmFwaCBhbmQgcmV0dXJucyBpdC5cbm1haW5VdGlsaXRpZXMuY3JlYXRlU2Jnbm1sID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XG59O1xuXG4vLyBDb252ZXJ0cyBnaXZlbiBzYmdubWwgZGF0YSB0byBhIGpzb24gb2JqZWN0IGluIGEgc3BlY2lhbCBmb3JtYXQgXG4vLyAoaHR0cDovL2pzLmN5dG9zY2FwZS5vcmcvI25vdGF0aW9uL2VsZW1lbnRzLWpzb24pIGFuZCByZXR1cm5zIGl0LlxubWFpblV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVG9Kc29uID0gZnVuY3Rpb24oZGF0YSkge1xuICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQoZGF0YSk7XG59O1xuXG4vLyBDcmVhdGUgdGhlIHF0aXAgY29udGVudHMgb2YgdGhlIGdpdmVuIG5vZGUgYW5kIHJldHVybnMgaXQuXG5tYWluVXRpbGl0aWVzLmdldFF0aXBDb250ZW50ID0gZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIGV4dHJhIHBhZGRpbmcgZm9yIGNvbXBhcnRtZW50XG4gIGV4dHJhQ29tcGFydG1lbnRQYWRkaW5nOiAxMCxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlXG59O1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xufTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xuICB9XG4gIFxuICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICB9XG5cbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7XG4iLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzYmduanMgPSByZXF1aXJlKCdsaWJzYmduLmpzJyk7XG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcblxudmFyIHNiZ25tbFRvSnNvbiA9IHtcbiAgaW5zZXJ0ZWROb2Rlczoge30sXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKGdseXBoTGlzdCkge1xuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZ2x5cGhMaXN0W2ldLmNsYXNzXyA9PSAnY29tcGFydG1lbnQnKSB7XG4gICAgICAgIHZhciBjb21wYXJ0bWVudCA9IGdseXBoTGlzdFtpXTtcbiAgICAgICAgdmFyIGJib3ggPSBjb21wYXJ0bWVudC5iYm94O1xuICAgICAgICBjb21wYXJ0bWVudHMucHVzaCh7XG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3gueCksXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3gueSksXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3gudyksXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3guaCksXG4gICAgICAgICAgJ2lkJzogY29tcGFydG1lbnQuaWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcGFydG1lbnRzLnNvcnQoZnVuY3Rpb24gKGMxLCBjMikge1xuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XG4gIH0sXG4gIGlzSW5Cb3VuZGluZ0JveDogZnVuY3Rpb24gKGJib3gxLCBiYm94Mikge1xuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxuICAgICAgICBiYm94MS54ICsgYmJveDEudyA8IGJib3gyLnggKyBiYm94Mi53ICYmXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGJib3hQcm9wOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcblxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMjtcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XG4gICAgdmFyIHlQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueSk7XG5cbiAgICB2YXIgYmJveCA9IGVsZS5iYm94O1xuXG4gICAgLy8gc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyIC0geFBvcztcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyIC0geVBvcztcblxuICAgIGJib3gueCA9IGJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcbiAgICBiYm94LnkgPSBiYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XG5cbiAgICByZXR1cm4gYmJveDtcbiAgfSxcbiAgZmluZENoaWxkTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xuICAgIC8vIGZpbmQgY2hpbGQgbm9kZXMgYXQgZGVwdGggbGV2ZWwgb2YgMSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudFxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IGVsZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxICYmIGNoaWxkLnRhZ05hbWUgPT09IGNoaWxkVGFnTmFtZSkge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9LFxuICBmaW5kQ2hpbGROb2RlOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgY2hpbGRUYWdOYW1lKTtcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCA/IG5vZGVzWzBdIDogdW5kZWZpbmVkO1xuICB9LFxuICBzdGF0ZUFuZEluZm9Qcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IFtdO1xuXG4gICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVyczsgLy8gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZEdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICB2YXIgaW5mbyA9IHt9O1xuXG4gICAgICBpZiAoZ2x5cGguY2xhc3NfID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzXyB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8ubGFiZWwgPSB7XG4gICAgICAgICAgJ3RleHQnOiAoZ2x5cGgubGFiZWwgJiYgZ2x5cGgubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xuICAgICAgfSBlbHNlIGlmIChnbHlwaC5jbGFzc18gPT09ICdzdGF0ZSB2YXJpYWJsZScpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzXyB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdseXBoLnN0YXRlO1xuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUudmFsdWUpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gKHN0YXRlICYmIHN0YXRlLnZhcmlhYmxlKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uc3RhdGUgPSB7XG4gICAgICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAgICAgJ3ZhcmlhYmxlJzogdmFyaWFibGVcbiAgICAgICAgfTtcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gc3RhdGVBbmRJbmZvQXJyYXk7XG4gIH0sXG4gIGFkZFBhcmVudEluZm9Ub05vZGU6IGZ1bmN0aW9uIChlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjb21wYXJ0bWVudFJlZiA9IGVsZS5jb21wYXJ0bWVudFJlZjtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gcGFyZW50O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb21wYXJ0bWVudFJlZikge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSAnJztcblxuICAgICAgLy8gYWRkIGNvbXBhcnRtZW50IGFjY29yZGluZyB0byBnZW9tZXRyeVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJ0bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGJib3hFbCA9IGVsZS5iYm94O1xuICAgICAgICB2YXIgYmJveCA9IHtcbiAgICAgICAgICAneCc6IHBhcnNlRmxvYXQoYmJveEVsLngpLFxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwueSksXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3hFbC53KSxcbiAgICAgICAgICAnaCc6IHBhcnNlRmxvYXQoYmJveEVsLmgpLFxuICAgICAgICAgICdpZCc6IGVsZS5pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc2VsZi5pc0luQm91bmRpbmdCb3goYmJveCwgY29tcGFydG1lbnRzW2ldKSkge1xuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5vZGVPYmogPSB7fTtcblxuICAgIC8vIGFkZCBpZCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouaWQgPSBlbGUuaWQ7XG4gICAgLy8gYWRkIG5vZGUgYm91bmRpbmcgYm94IGluZm9ybWF0aW9uXG4gICAgbm9kZU9iai5iYm94ID0gc2VsZi5iYm94UHJvcChlbGUpO1xuICAgIC8vIGFkZCBjbGFzcyBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xuICAgIC8vIGFkZCBsYWJlbCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmoubGFiZWwgPSAoZWxlLmxhYmVsICYmIGVsZS5sYWJlbC50ZXh0KSB8fCB1bmRlZmluZWQ7XG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLmJib3gpO1xuICAgIC8vIGFkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG5cbiAgICAvLyBhZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICBpZiAoZWxlLmNsb25lKSB7XG4gICAgICBub2RlT2JqLmNsb25lbWFya2VyID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBhZGQgcG9ydCBpbmZvcm1hdGlvblxuICAgIHZhciBwb3J0cyA9IFtdO1xuICAgIHZhciBwb3J0RWxlbWVudHMgPSBlbGUucG9ydHM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnRFbCA9IHBvcnRFbGVtZW50c1tpXTtcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5pZDtcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC54KSAtIG5vZGVPYmouYmJveC54O1xuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLnkpIC0gbm9kZU9iai5iYm94Lnk7XG5cbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LncpICogMTAwO1xuICAgICAgcmVsYXRpdmVZUG9zID0gcmVsYXRpdmVZUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3guaCkgKiAxMDA7XG5cbiAgICAgIHBvcnRzLnB1c2goe1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcbiAgICAgICAgeTogcmVsYXRpdmVZUG9zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBub2RlT2JqLnBvcnRzID0gcG9ydHM7XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzTm9kZSk7XG4gIH0sXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgZWxJZCA9IGVsZS5pZDtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc19dKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zZXJ0ZWROb2Rlc1tlbElkXSA9IHRydWU7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIGFkZCBjb21wbGV4IG5vZGVzIGhlcmVcblxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc187XG5cbiAgICBpZiAoZWxlQ2xhc3MgPT09ICdjb21wbGV4JyB8fCBlbGVDbGFzcyA9PT0gJ2NvbXBsZXggbXVsdGltZXInIHx8IGVsZUNsYXNzID09PSAnc3VibWFwJykge1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcblxuICAgICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVycztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICAgIHZhciBnbHlwaENsYXNzID0gZ2x5cGguY2xhc3NfO1xuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGpzb25BcnJheSwgZWxJZCwgY29tcGFydG1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzTm9kZShlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgZ2V0UG9ydHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcbiAgfSxcbiAgZ2V0R2x5cGhzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xuXG4gICAgaWYgKCFnbHlwaHMpIHtcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XG5cbiAgICAgIHZhciBpZDJnbHlwaCA9IHhtbE9iamVjdC5faWQyZ2x5cGggPSB7fTtcblxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICB2YXIgZyA9IGdseXBoc1tpXTtcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgaWQyZ2x5cGhbIGlkIF0gPSBnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBnbHlwaHM7XG4gIH0sXG4gIGdldEdseXBoQnlJZDogZnVuY3Rpb24gKHhtbE9iamVjdCwgaWQpIHtcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcblxuICAgIHJldHVybiB4bWxPYmplY3QuX2lkMmdseXBoW2lkXTtcbiAgfSxcbiAgZ2V0QXJjU291cmNlQW5kVGFyZ2V0OiBmdW5jdGlvbiAoYXJjLCB4bWxPYmplY3QpIHtcbiAgICAvLyBzb3VyY2UgYW5kIHRhcmdldCBjYW4gYmUgaW5zaWRlIG9mIGEgcG9ydFxuICAgIHZhciBzb3VyY2UgPSBhcmMuc291cmNlO1xuICAgIHZhciB0YXJnZXQgPSBhcmMudGFyZ2V0O1xuICAgIHZhciBzb3VyY2VOb2RlSWQ7XG4gICAgdmFyIHRhcmdldE5vZGVJZDtcblxuICAgIHZhciBzb3VyY2VFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHNvdXJjZSk7XG4gICAgdmFyIHRhcmdldEV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgdGFyZ2V0KTtcblxuICAgIGlmIChzb3VyY2VFeGlzdHMpIHtcbiAgICAgIHNvdXJjZU5vZGVJZCA9IHNvdXJjZTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0RXhpc3RzKSB7XG4gICAgICB0YXJnZXROb2RlSWQgPSB0YXJnZXQ7XG4gICAgfVxuXG5cbiAgICB2YXIgaTtcbiAgICB2YXIgcG9ydEVscyA9IHRoaXMuZ2V0UG9ydHMoeG1sT2JqZWN0KTtcbiAgICB2YXIgcG9ydDtcbiAgICBpZiAoc291cmNlTm9kZUlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBzb3VyY2UpIHtcbiAgICAgICAgICBzb3VyY2VOb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldE5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXROb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsnc291cmNlJzogc291cmNlTm9kZUlkLCAndGFyZ2V0JzogdGFyZ2V0Tm9kZUlkfTtcbiAgfSxcblxuICBnZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnM6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gW107XG5cbiAgICB2YXIgY2hpbGRyZW4gPSBlbGUubmV4dHM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9zWCA9IGNoaWxkcmVuW2ldLng7XG4gICAgICB2YXIgcG9zWSA9IGNoaWxkcmVuW2ldLnk7XG5cbiAgICAgIGJlbmRQb2ludFBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJlbmRQb2ludFBvc2l0aW9ucztcbiAgfSxcbiAgYWRkQ3l0b3NjYXBlSnNFZGdlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHhtbE9iamVjdCkge1xuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbZWxlLmNsYXNzX10pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldCA9IHNlbGYuZ2V0QXJjU291cmNlQW5kVGFyZ2V0KGVsZSwgeG1sT2JqZWN0KTtcblxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZWRnZU9iaiA9IHt9O1xuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWxmLmdldEFyY0JlbmRQb2ludFBvc2l0aW9ucyhlbGUpO1xuXG4gICAgZWRnZU9iai5pZCA9IGVsZS5pZCB8fCB1bmRlZmluZWQ7XG4gICAgZWRnZU9iai5jbGFzcyA9IGVsZS5jbGFzc187XG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XG5cbiAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gMDtcbiAgICBpZiAoZWxlLmdseXBocy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5nbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVsZS5nbHlwaHNbaV0uY2xhc3NfID09PSAnY2FyZGluYWxpdHknKSB7XG4gICAgICAgICAgdmFyIGxhYmVsID0gZWxlLmdseXBoc1tpXS5sYWJlbDtcbiAgICAgICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gbGFiZWwudGV4dCB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBlZGdlT2JqLnNvdXJjZSA9IHNvdXJjZUFuZFRhcmdldC5zb3VyY2U7XG4gICAgZWRnZU9iai50YXJnZXQgPSBzb3VyY2VBbmRUYXJnZXQudGFyZ2V0O1xuXG4gICAgZWRnZU9iai5wb3J0c291cmNlID0gZWxlLnNvdXJjZTtcbiAgICBlZGdlT2JqLnBvcnR0YXJnZXQgPSBlbGUudGFyZ2V0O1xuXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xuICB9LFxuICBhcHBseVN0eWxlOiBmdW5jdGlvbiAocmVuZGVySW5mb3JtYXRpb24sIG5vZGVzLCBlZGdlcykge1xuICAgIC8vIGdldCBhbGwgY29sb3IgaWQgcmVmZXJlbmNlcyB0byB0aGVpciB2YWx1ZVxuICAgIHZhciBjb2xvckxpc3QgPSByZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZDb2xvckRlZmluaXRpb25zLmNvbG9yRGVmaW5pdGlvbnM7XG4gICAgdmFyIGNvbG9ySURUb1ZhbHVlID0ge307XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgY29sb3JMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb2xvcklEVG9WYWx1ZVtjb2xvckxpc3RbaV0uaWRdID0gY29sb3JMaXN0W2ldLnZhbHVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgc3R5bGUgbGlzdCB0byBlbGVtZW50SWQtaW5kZXhlZCBvYmplY3QgcG9pbnRpbmcgdG8gc3R5bGVcbiAgICAvLyBhbHNvIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlcyB0byBjb2xvciB2YWx1ZXNcbiAgICB2YXIgc3R5bGVMaXN0ID0gcmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzLnN0eWxlcztcbiAgICB2YXIgZWxlbWVudElEVG9TdHlsZSA9IHt9O1xuICAgIGZvciAodmFyIGk9MDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN0eWxlID0gc3R5bGVMaXN0W2ldO1xuICAgICAgdmFyIHJlbmRlckdyb3VwID0gc3R5bGUucmVuZGVyR3JvdXA7XG5cbiAgICAgIC8vIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlc1xuICAgICAgaWYgKHJlbmRlckdyb3VwLnN0cm9rZSAhPSBudWxsKSB7XG4gICAgICAgIHJlbmRlckdyb3VwLnN0cm9rZSA9IGNvbG9ySURUb1ZhbHVlW3JlbmRlckdyb3VwLnN0cm9rZV07XG4gICAgICB9XG4gICAgICBpZiAocmVuZGVyR3JvdXAuZmlsbCAhPSBudWxsKSB7XG4gICAgICAgIHJlbmRlckdyb3VwLmZpbGwgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5maWxsXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkTGlzdCA9IHN0eWxlLmlkTGlzdC5zcGxpdCgnICcpO1xuICAgICAgZm9yICh2YXIgaj0wOyBqIDwgaWRMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBpZCA9IGlkTGlzdFtqXTtcbiAgICAgICAgZWxlbWVudElEVG9TdHlsZVtpZF0gPSByZW5kZXJHcm91cDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoZXhUb0RlY2ltYWwgKGhleCkge1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VJbnQoJzB4JytoZXgpIC8gMjU1ICogMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0SGV4Q29sb3IgKGhleCkge1xuICAgICAgaWYgKGhleC5sZW5ndGggPT0gNykgeyAvLyBubyBvcGFjaXR5IHByb3ZpZGVkXG4gICAgICAgIHJldHVybiB7b3BhY2l0eTogbnVsbCwgY29sb3I6IGhleH07XG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8gbGVuZ3RoIG9mIDlcbiAgICAgICAgdmFyIGNvbG9yID0gaGV4LnNsaWNlKDAsNyk7XG4gICAgICAgIHZhciBvcGFjaXR5ID0gaGV4VG9EZWNpbWFsKGhleC5zbGljZSgtMikpO1xuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG9wYWNpdHksIGNvbG9yOiBjb2xvcn07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgdGhlIHN0eWxlIHRvIG5vZGVzIGFuZCBvdmVyd3JpdGUgdGhlIGRlZmF1bHQgc3R5bGVcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgY29sb3IgcHJvcGVydGllcywgd2UgbmVlZCB0byBjaGVjayBvcGFjaXR5XG4gICAgICB2YXIgYmdDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5maWxsO1xuICAgICAgaWYgKGJnQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihiZ0NvbG9yKTtcbiAgICAgICAgbm9kZS5kYXRhWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSByZXMuY29sb3I7XG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1vcGFjaXR5J10gPSByZXMub3BhY2l0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGJvcmRlckNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcbiAgICAgIGlmIChib3JkZXJDb2xvcikge1xuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGJvcmRlckNvbG9yKTtcbiAgICAgICAgbm9kZS5kYXRhWydib3JkZXItY29sb3InXSA9IHJlcy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIGJvcmRlcldpZHRoID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xuICAgICAgaWYgKGJvcmRlcldpZHRoKSB7XG4gICAgICAgIG5vZGUuZGF0YVsnYm9yZGVyLXdpZHRoJ10gPSBib3JkZXJXaWR0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRTaXplID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRTaXplO1xuICAgICAgaWYgKGZvbnRTaXplKSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1zaXplJ10gPSBmb250U2l6ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRGYW1pbHkgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udEZhbWlseTtcbiAgICAgIGlmIChmb250RmFtaWx5KSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1mYW1pbHknXSA9IGZvbnRGYW1pbHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250U3R5bGUgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFN0eWxlO1xuICAgICAgaWYgKGZvbnRTdHlsZSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc3R5bGUnXSA9IGZvbnRTdHlsZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRXZWlnaHQgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFdlaWdodDtcbiAgICAgIGlmIChmb250V2VpZ2h0KSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC13ZWlnaHQnXSA9IGZvbnRXZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0QW5jaG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnRleHRBbmNob3I7XG4gICAgICBpZiAodGV4dEFuY2hvcikge1xuICAgICAgICBub2RlLmRhdGFbJ3RleHQtaGFsaWduJ10gPSB0ZXh0QW5jaG9yO1xuICAgICAgfVxuXG4gICAgICB2YXIgdnRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udnRleHRBbmNob3I7XG4gICAgICBpZiAodnRleHRBbmNob3IpIHtcbiAgICAgICAgbm9kZS5kYXRhWyd0ZXh0LXZhbGlnbiddID0gdnRleHRBbmNob3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZG8gdGhlIHNhbWUgZm9yIGVkZ2VzXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG5cbiAgICAgIHZhciBsaW5lQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW2VkZ2UuZGF0YVsnaWQnXV0uc3Ryb2tlO1xuICAgICAgaWYgKGxpbmVDb2xvcikge1xuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGxpbmVDb2xvcik7XG4gICAgICAgIGVkZ2UuZGF0YVsnbGluZS1jb2xvciddID0gcmVzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICB2YXIgd2lkdGggPSBlbGVtZW50SURUb1N0eWxlW2VkZ2UuZGF0YVsnaWQnXV0uc3Ryb2tlV2lkdGg7XG4gICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgZWRnZS5kYXRhWyd3aWR0aCddID0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjb252ZXJ0OiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZXMgPSBbXTtcblxuICAgIHZhciBzYmduID0gbGlic2JnbmpzLlNiZ24uZnJvbVhNTCh4bWxPYmplY3QucXVlcnlTZWxlY3Rvcignc2JnbicpKTtcbiAgICB2YXIgY29tcGFydG1lbnRzID0gc2VsZi5nZXRBbGxDb21wYXJ0bWVudHMoc2Jnbi5tYXAuZ2x5cGhzKTtcblxuICAgIHZhciBnbHlwaHMgPSBzYmduLm1hcC5nbHlwaHM7XG4gICAgdmFyIGFyY3MgPSBzYmduLm1hcC5hcmNzO1xuXG4gICAgdmFyIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdseXBoID0gZ2x5cGhzW2ldO1xuICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKGdseXBoLCBjeXRvc2NhcGVKc05vZGVzLCAnJywgY29tcGFydG1lbnRzKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJjcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGFyYyA9IGFyY3NbaV07XG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZShhcmMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XG4gICAgfVxuXG4gICAgaWYgKHNiZ24ubWFwLmV4dGVuc2lvbi5oYXMoJ3JlbmRlckluZm9ybWF0aW9uJykpIHsgLy8gcmVuZGVyIGV4dGVuc2lvbiB3YXMgZm91bmRcbiAgICAgIHNlbGYuYXBwbHlTdHlsZShzYmduLm1hcC5leHRlbnNpb24uZ2V0KCdyZW5kZXJJbmZvcm1hdGlvbicpLCBjeXRvc2NhcGVKc05vZGVzLCBjeXRvc2NhcGVKc0VkZ2VzKTtcbiAgICB9XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNHcmFwaCA9IHt9O1xuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xuICAgIGN5dG9zY2FwZUpzR3JhcGguZWRnZXMgPSBjeXRvc2NhcGVKc0VkZ2VzO1xuXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XG5cbiAgICByZXR1cm4gY3l0b3NjYXBlSnNHcmFwaDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XG4iLCIvKlxuICogVGV4dCB1dGlsaXRpZXMgZm9yIGNvbW1vbiB1c2FnZVxuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcblxudmFyIHRleHRVdGlsaXRpZXMgPSB7XG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XG4gIHRydW5jYXRlVGV4dDogZnVuY3Rpb24gKHRleHRQcm9wLCBmb250KSB7XG4gICAgdmFyIGNvbnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29udGV4dC5mb250ID0gZm9udDtcbiAgICBcbiAgICB2YXIgZml0TGFiZWxzVG9Ob2RlcyA9IG9wdGlvbnMuZml0TGFiZWxzVG9Ob2RlcztcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XG4gICAgXG4gICAgdmFyIHRleHQgPSB0ZXh0UHJvcC5sYWJlbCB8fCBcIlwiO1xuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcbiAgICBpZiAoZml0TGFiZWxzVG9Ob2RlcyA9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIHZhciB3aWR0aDtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGg7XG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xuICAgIHZhciB0ZXh0V2lkdGggPSAodGV4dFByb3Aud2lkdGggPiAzMCkgPyB0ZXh0UHJvcC53aWR0aCAtIDEwIDogdGV4dFByb3Aud2lkdGg7XG4gICAgd2hpbGUgKCh3aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGgpID4gdGV4dFdpZHRoKSB7XG4gICAgICAtLWxlbjtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBsZW4pICsgZWxsaXBzaXM7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9LFxuXG4gIC8vIGVuc3VyZSB0aGF0IHJldHVybmVkIHN0cmluZyBmb2xsb3dzIHhzZDpJRCBzdGFuZGFyZFxuICAvLyBzaG91bGQgZm9sbG93IHInXlthLXpBLVpfXVtcXHcuLV0qJCdcbiAgZ2V0WE1MVmFsaWRJZDogZnVuY3Rpb24ob3JpZ2luYWxJZCkge1xuICAgIHZhciBuZXdJZCA9IFwiXCI7XG4gICAgdmFyIHhtbFZhbGlkUmVnZXggPSAvXlthLXpBLVpfXVtcXHcuLV0qJC87XG4gICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG9yaWdpbmFsSWQpKSB7IC8vIGRvZXNuJ3QgY29tcGx5XG4gICAgICBuZXdJZCA9IG9yaWdpbmFsSWQ7XG4gICAgICBuZXdJZCA9IG5ld0lkLnJlcGxhY2UoL1teXFx3Li1dL2csIFwiXCIpO1xuICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBzdGlsbCBkb2Vzbid0IGNvbXBseVxuICAgICAgICBuZXdJZCA9IFwiX1wiICsgbmV3SWQ7XG4gICAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gbm9ybWFsbHkgd2Ugc2hvdWxkIG5ldmVyIGVudGVyIHRoaXNcbiAgICAgICAgICAvLyBpZiBmb3Igc29tZSBvYnNjdXJlIHJlYXNvbiB3ZSBzdGlsbCBkb24ndCBjb21wbHksIHRocm93IGVycm9yLlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgaWRlbnRpZmVyIGNvbXBseSB0byB4c2Q6SUQgcmVxdWlyZW1lbnRzOiBcIituZXdJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdJZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxJZDtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0VXRpbGl0aWVzOyIsIi8qXG4gKiBDb21tb25seSBuZWVkZWQgVUkgVXRpbGl0aWVzXG4gKi9cblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgdWlVdGlsaXRpZXMgPSB7XG4gIHN0YXJ0U3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XG4gICAgfVxuICAgIFxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS53aWR0aCgpO1xuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLmhlaWdodCgpO1xuICAgICAgJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciArICc6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGNsYXNzTmFtZSArICdcIj48L2k+Jyk7XG4gICAgfVxuICB9LFxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcbiAgICB9XG4gICAgXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAkKCcuJyArIGNsYXNzTmFtZSkucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpVXRpbGl0aWVzO1xuXG5cbiIsIi8qXG4gKiBUaGlzIGZpbGUgZXhwb3J0cyB0aGUgZnVuY3Rpb25zIHRvIGJlIHV0aWxpemVkIGluIHVuZG9yZWRvIGV4dGVuc2lvbiBhY3Rpb25zIFxuICovXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0ge1xuICAvLyBTZWN0aW9uIFN0YXJ0XG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xuICB9LFxuICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcbiAgICB2YXIgcGFyYW0gPSB7fTtcbiAgICBwYXJhbS5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcbiAgICByZXR1cm4gcGFyYW07XG4gIH0sXG4gIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQocGFyYW0uZWxlcyk7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUVsZXNTaW1wbGUocGFyYW0uZWxlcyk7XG4gIH0sXG4gIC8vIFNlY3Rpb24gRW5kXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uczsiXX0=

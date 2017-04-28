(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var checkParams = _dereq_('./utilities').checkParams;
var xmldom = _dereq_('xmldom');

var ns = {};

ns.xmlns = "http://www.sbml.org/sbml/level3/version1/render/version1";

// ------- COLORDEFINITION -------
ns.ColorDefinition = function(params) {
	var params = checkParams(params, ['id', 'value']);
	this.id 	= params.id;
	this.value 	= params.value;
};

ns.ColorDefinition.prototype.buildXmlObj = function () {
	var colorDefinition = new xmldom.DOMImplementation().createDocument().createElement('colorDefinition');
	if (this.id != null) {
		colorDefinition.setAttribute('id', this.id);
	}
	if (this.value != null) {
		colorDefinition.setAttribute('value', this.value);
	}
	return colorDefinition;
};

ns.ColorDefinition.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.ListOfColorDefinitions.prototype.buildXmlObj = function () {
	var listOfColorDefinitions = new xmldom.DOMImplementation().createDocument().createElement('listOfColorDefinitions');
	for(var i=0; i<this.colorDefinitions.length; i++) {
		listOfColorDefinitions.appendChild(this.colorDefinitions[i].buildXmlObj());
	}
	return listOfColorDefinitions;
};

ns.ListOfColorDefinitions.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.RenderGroup.prototype.buildXmlObj = function () {
	var renderGroup = new xmldom.DOMImplementation().createDocument().createElement('g');
	if (this.id != null) {
		renderGroup.setAttribute('id', this.id);
	}
	if (this.fontSize != null) {
		renderGroup.setAttribute('fontSize', this.fontSize);
	}
	if (this.fontFamily != null) {
		renderGroup.setAttribute('fontFamily', this.fontFamily);
	}
	if (this.fontWeight != null) {
		renderGroup.setAttribute('fontWeight', this.fontWeight);
	}
	if (this.fontStyle != null) {
		renderGroup.setAttribute('fontStyle', this.fontStyle);
	}
	if (this.textAnchor != null) {
		renderGroup.setAttribute('textAnchor', this.textAnchor);
	}
	if (this.vtextAnchor != null) {
		renderGroup.setAttribute('vtextAnchor', this.vtextAnchor);
	}
	if (this.stroke != null) {
		renderGroup.setAttribute('stroke', this.stroke);
	}
	if (this.strokeWidth != null) {
		renderGroup.setAttribute('strokeWidth', this.strokeWidth);
	}
	if (this.fill != null) {
		renderGroup.setAttribute('fill', this.fill);
	}
	return renderGroup;
};

ns.RenderGroup.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Style.prototype.buildXmlObj = function () {
	var style = new xmldom.DOMImplementation().createDocument().createElement('style');
	if (this.id != null) {
		style.setAttribute('id', this.id);
	}
	if (this.name != null) {
		style.setAttribute('name', this.name);
	}
	if (this.idList != null) {
		style.setAttribute('idList', this.idList);
	}

	if (this.renderGroup) {
		style.appendChild(this.renderGroup.buildXmlObj());
	}
	return style;
};

ns.Style.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.ListOfStyles.prototype.buildXmlObj = function () {
	var listOfStyles = new xmldom.DOMImplementation().createDocument().createElement('listOfStyles');
	for(var i=0; i<this.styles.length; i++) {
		listOfStyles.appendChild(this.styles[i].buildXmlObj());
	}
	return listOfStyles;
};

ns.ListOfStyles.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.RenderInformation.prototype.buildXmlObj = function () {
	var renderInformation = new xmldom.DOMImplementation().createDocument().createElement('renderInformation');
	renderInformation.setAttribute('xmlns', ns.xmlns);
	if (this.id != null) {
		renderInformation.setAttribute('id', this.id);
	}
	if (this.name != null) {
		renderInformation.setAttribute('name', this.name);
	}
	if (this.programName != null) {
		renderInformation.setAttribute('programName', this.programName);
	}
	if (this.programVersion != null) {
		renderInformation.setAttribute('programVersion', this.programVersion);
	}
	if (this.backgroundColor != null) {
		renderInformation.setAttribute('backgroundColor', this.backgroundColor);
	}

	if (this.listOfColorDefinitions) {
		renderInformation.appendChild(this.listOfColorDefinitions.buildXmlObj());
	}
	if (this.listOfStyles) {
		renderInformation.appendChild(this.listOfStyles.buildXmlObj());
	}
	return renderInformation;
};

ns.RenderInformation.prototype.toXML = function() {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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
},{"./utilities":3,"xmldom":5}],2:[function(_dereq_,module,exports){
var renderExt = _dereq_('./libsbgn-render');
//var annotExt = require('./libsbgn-annotations');
var checkParams = _dereq_('./utilities').checkParams;
var xmldom = _dereq_('xmldom');

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

ns.SBGNBase.prototype.baseToXmlObj = function (xmlObj) {
	if(this.extension != null) {
		xmlObj.appendChild(this.extension.buildXmlObj());
	}
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

ns.Sbgn.prototype.buildXmlObj = function () {
	var sbgn = new xmldom.DOMImplementation().createDocument().createElement('sbgn');
	// attributes
	if(this.xmlns != null) {
		sbgn.setAttribute('xmlns', this.xmlns);
	}
	if(this.language != null) {
		sbgn.setAttribute('language', this.language);
	}
	// children
	this.baseToXmlObj(sbgn);
	if (this.map != null) {
		sbgn.appendChild(this.map.buildXmlObj());
	}
	return sbgn;
};

ns.Sbgn.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Map.prototype.buildXmlObj = function () {
	var map = new xmldom.DOMImplementation().createDocument().createElement('map');
	// attributes
	if(this.id != null) {
		map.setAttribute('id', this.id);
	}
	if(this.language != null) {
		map.setAttribute('language', this.language);
	}
	// children
	this.baseToXmlObj(map);
	for(var i=0; i < this.glyphs.length; i++) {
		map.appendChild(this.glyphs[i].buildXmlObj());
	}
	for(var i=0; i < this.arcs.length; i++) {
		map.appendChild(this.arcs[i].buildXmlObj());
	}
	return map;
};

ns.Map.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Extension.prototype.buildXmlObj = function () {
	var extension = new xmldom.DOMImplementation().createDocument().createElement('extension');
	for (var extInstance in this.list) {
		if (extInstance == "renderInformation") {
			extension.appendChild(this.get(extInstance).buildXmlObj());
		}
		else {
			extension.appendChild(this.get(extInstance));
		}
	}
	return extension;
};

ns.Extension.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Glyph.prototype.buildXmlObj = function () {
	var glyph = new xmldom.DOMImplementation().createDocument().createElement('glyph');
	// attributes
	if(this.id != null) {
		glyph.setAttribute('id', this.id);
	}
	if(this.class_ != null) {
		glyph.setAttribute('class', this.class_);
	}
	if(this.compartmentRef != null) {
		glyph.setAttribute('compartmentRef', this.compartmentRef);
	}
	// children
	if(this.label != null) {
		glyph.appendChild(this.label.buildXmlObj());
	}
	if(this.state != null) {
		glyph.appendChild(this.state.buildXmlObj());
	}
	if(this.bbox != null) {
		glyph.appendChild(this.bbox.buildXmlObj());
	}
	if(this.clone != null) {
		glyph.appendChild(this.clone.buildXmlObj());
	}
	for(var i=0; i < this.glyphMembers.length; i++) {
		glyph.appendChild(this.glyphMembers[i].buildXmlObj());
	}
	for(var i=0; i < this.ports.length; i++) {
		glyph.appendChild(this.ports[i].buildXmlObj());
	}
	this.baseToXmlObj(glyph);
	return glyph;
};

ns.Glyph.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Label.prototype.buildXmlObj = function () {
	var label = new xmldom.DOMImplementation().createDocument().createElement('label');
	if(this.text != null) {
		label.setAttribute('text', this.text);
	}
	this.baseToXmlObj(label);
	return label;
};

ns.Label.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Bbox.prototype.buildXmlObj = function () {
	var bbox = new xmldom.DOMImplementation().createDocument().createElement('bbox');
	if(!isNaN(this.x)) {
		bbox.setAttribute('x', this.x);
	}
	if(!isNaN(this.y)) {
		bbox.setAttribute('y', this.y);
	}
	if(!isNaN(this.w)) {
		bbox.setAttribute('w', this.w);
	}
	if(!isNaN(this.h)) {
		bbox.setAttribute('h', this.h);
	}
	this.baseToXmlObj(bbox);
	return bbox;
}

ns.Bbox.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.StateType.prototype.buildXmlObj = function () {
	var state = new xmldom.DOMImplementation().createDocument().createElement('state');
	if(this.value != null) {
		state.setAttribute('value', this.value);
	}
	if(this.variable != null) {
		state.setAttribute('variable', this.variable);
	}
	return state;
};

ns.StateType.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.CloneType.prototype.buildXmlObj = function () {
	var clone = new xmldom.DOMImplementation().createDocument().createElement('clone');
	if(this.label != null) {
		clone.setAttribute('label', this.label);
	}
	return clone;
};

ns.CloneType.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Port.prototype.buildXmlObj = function () {
	var port = new xmldom.DOMImplementation().createDocument().createElement('port');
	if(this.id != null) {
		port.setAttribute('id', this.id);
	}
	if(!isNaN(this.x)) {
		port.setAttribute('x', this.x);
	}
	if(!isNaN(this.y)) {
		port.setAttribute('y', this.y);
	}
	this.baseToXmlObj(port);
	return port;
};

ns.Port.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.Arc.prototype.buildXmlObj = function () {
	var arc = new xmldom.DOMImplementation().createDocument().createElement('arc');
	// attributes
	if(this.id != null) {
		arc.setAttribute('id', this.id);
	}
	if(this.class_ != null) {
		arc.setAttribute('class', this.class_);
	}
	if(this.source != null) {
		arc.setAttribute('source', this.source);
	}
	if(this.target != null) {
		arc.setAttribute('target', this.target);
	}
	// children
	for(var i=0; i < this.glyphs.length; i++) {
		arc.appendChild(this.glyphs[i].buildXmlObj());
	}
	if(this.start != null) {
		arc.appendChild(this.start.buildXmlObj());
	}
	for(var i=0; i < this.nexts.length; i++) {
		arc.appendChild(this.nexts[i].buildXmlObj());
	}
	if(this.end != null) {
		arc.appendChild(this.end.buildXmlObj());
	}
	this.baseToXmlObj(arc);
	return arc;
};

ns.Arc.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.StartType.prototype.buildXmlObj = function () {
	var start = new xmldom.DOMImplementation().createDocument().createElement('start');
	if(!isNaN(this.x)) {
		start.setAttribute('x', this.x);
	}
	if(!isNaN(this.y)) {
		start.setAttribute('y', this.y);
	}
	return start;
};

ns.StartType.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.EndType.prototype.buildXmlObj = function () {
	var end = new xmldom.DOMImplementation().createDocument().createElement('end');
	if(!isNaN(this.x)) {
		end.setAttribute('x', this.x);
	}
	if(!isNaN(this.y)) {
		end.setAttribute('y', this.y);
	}
	return end;
};

ns.EndType.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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

ns.NextType.prototype.buildXmlObj = function () {
	var next = new xmldom.DOMImplementation().createDocument().createElement('next');
	if(!isNaN(this.x)) {
		next.setAttribute('x', this.x);
	}
	if(!isNaN(this.y)) {
		next.setAttribute('y', this.y);
	}
	return next;
};

ns.NextType.prototype.toXML = function () {
	return new xmldom.XMLSerializer().serializeToString(this.buildXmlObj());
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
//ns.annotationsExtension = annotExt;
module.exports = ns;
},{"./libsbgn-render":1,"./utilities":3,"xmldom":5}],3:[function(_dereq_,module,exports){
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
/**
* pretty-data - nodejs plugin to pretty-print or minify data in XML, JSON and CSS formats.
*  
* Version - 0.40.0
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/pretty-data/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*	pd.xml(data ) - pretty print XML;
*	pd.json(data) - pretty print JSON;
*	pd.css(data ) - pretty print CSS;
*	pd.sql(data)  - pretty print SQL;
*
*	pd.xmlmin(data [, preserveComments] ) - minify XML; 
*	pd.jsonmin(data)                      - minify JSON; 
*	pd.cssmin(data [, preserveComments] ) - minify CSS; 
*	pd.sqlmin(data)                       - minify SQL; 
*
* PARAMETERS:
*
*	@data  			- String; XML, JSON, CSS or SQL text to beautify;
* 	@preserveComments	- Bool (optional, used in minxml and mincss only); 
*				  Set this flag to true to prevent removing comments from @text; 
*	@Return 		- String;
*	
* USAGE:
*	
*	var pd  = require('pretty-data').pd;
*
*	var xml_pp   = pd.xml(xml_text);
*	var xml_min  = pd.xmlmin(xml_text [,true]);
*	var json_pp  = pd.json(json_text);
*	var json_min = pd.jsonmin(json_text);
*	var css_pp   = pd.css(css_text);
*	var css_min  = pd.cssmin(css_text [, true]);
*	var sql_pp   = pd.sql(sql_text);
*	var sql_min  = pd.sqlmin(sql_text);
*
* TEST:
*	comp-name:pretty-data$ node ./test/test_xml
*	comp-name:pretty-data$ node ./test/test_json
*	comp-name:pretty-data$ node ./test/test_css
*	comp-name:pretty-data$ node ./test/test_sql
*/


function pp() {
	this.shift = ['\n']; // array of shifts
	this.step = '  ', // 2 spaces
		maxdeep = 100, // nesting level
		ix = 0;

	// initialize array with shifts //
	for(ix=0;ix<maxdeep;ix++){
		this.shift.push(this.shift[ix]+this.step); 
	}

};	
	
// ----------------------- XML section ----------------------------------------------------

pp.prototype.xml = function(text) {

	var ar = text.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/xmlns\:/g,"~::~xmlns:")
				 .replace(/xmlns\=/g,"~::~xmlns=")
				 .split('~::~'),
		len = ar.length,
		inComment = false,
		deep = 0,
		str = '',
		ix = 0;

		for(ix=0;ix<len;ix++) {
			// start comment or <![CDATA[...]]> or <!DOCTYPE //
			if(ar[ix].search(/<!/) > -1) { 
				str += this.shift[deep]+ar[ix];
				inComment = true; 
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
					inComment = false; 
				}
			} else 
			// end comment  or <![CDATA[...]]> //
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
				str += ar[ix];
				inComment = false; 
			} else 
			// <elm></elm> //
			if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
				str += ar[ix];
				if(!inComment) deep--;
			} else
			 // <elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += this.shift[deep++]+ar[ix] : str += ar[ix];
			} else 
			 // <elm>...</elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += this.shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// </elm> //
			if(ar[ix].search(/<\//) > -1) { 
				str = !inComment ? str += this.shift[--deep]+ar[ix] : str += ar[ix];
			} else 
			// <elm/> //
			if(ar[ix].search(/\/>/) > -1 ) { 
				str = !inComment ? str += this.shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// <? xml ... ?> //
			if(ar[ix].search(/<\?/) > -1) { 
				str += this.shift[deep]+ar[ix];
			} else 
			// xmlns //
			if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) { 
				str += this.shift[deep]+ar[ix];
			} 
			
			else {
				str += ar[ix];
			}
		}
		
	return  (str[0] == '\n') ? str.slice(1) : str;
}

// ----------------------- JSON section ----------------------------------------------------

pp.prototype.json = function(text) {

	if ( typeof text === "string" ) {
		return JSON.stringify(JSON.parse(text), null, this.step);
	}
	if ( typeof text === "object" ) {
		return JSON.stringify(text, null, this.step);
	}
	return null;
}

// ----------------------- CSS section ----------------------------------------------------

pp.prototype.css = function(text) {

	var ar = text.replace(/\s{1,}/g,' ')
				.replace(/\{/g,"{~::~")
				.replace(/\}/g,"~::~}~::~")
				.replace(/\;/g,";~::~")
				.replace(/\/\*/g,"~::~/*")
				.replace(/\*\//g,"*/~::~")
				.replace(/~::~\s{0,}~::~/g,"~::~")
				.split('~::~'),
		len = ar.length,
		deep = 0,
		str = '',
		ix = 0;
		
		for(ix=0;ix<len;ix++) {

			if( /\{/.exec(ar[ix]))  { 
				str += this.shift[deep++]+ar[ix];
			} else 
			if( /\}/.exec(ar[ix]))  { 
				str += this.shift[--deep]+ar[ix];
			} else
			if( /\*\\/.exec(ar[ix]))  { 
				str += this.shift[deep]+ar[ix];
			}
			else {
				str += this.shift[deep]+ar[ix];
			}
		}
		return str.replace(/^\n{1,}/,'');
}

// ----------------------- SQL section ----------------------------------------------------

function isSubquery(str, parenthesisLevel) {
  return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
}

function split_sql(str, tab) {

    return str.replace(/\s{1,}/g," ")

        .replace(/ AND /ig,"~::~"+tab+tab+"AND ")
        .replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
        .replace(/ CASE /ig,"~::~"+tab+"CASE ")
        .replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
        .replace(/ END /ig,"~::~"+tab+"END ")
        .replace(/ FROM /ig,"~::~FROM ")
        .replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
        .replace(/ HAVING /ig,"~::~HAVING ")
        //.replace(/ IN /ig,"~::~"+tab+"IN ")
        .replace(/ IN /ig," IN ")
        .replace(/ JOIN /ig,"~::~JOIN ")
        .replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
        .replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
        .replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
        .replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
        .replace(/ ON /ig,"~::~"+tab+"ON ")
        .replace(/ OR /ig,"~::~"+tab+tab+"OR ")
        .replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
        .replace(/ OVER /ig,"~::~"+tab+"OVER ")
        .replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
        .replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
        .replace(/ THEN /ig," THEN~::~"+tab+"")
        .replace(/ UNION /ig,"~::~UNION~::~")
        .replace(/ USING /ig,"~::~USING ")
        .replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
        .replace(/ WHERE /ig,"~::~WHERE ")
        .replace(/ WITH /ig,"~::~WITH ")
        //.replace(/\,\s{0,}\(/ig,",~::~( ")
        //.replace(/\,/ig,",~::~"+tab+tab+"")
        .replace(/ ALL /ig," ALL ")
        .replace(/ AS /ig," AS ")
        .replace(/ ASC /ig," ASC ") 
        .replace(/ DESC /ig," DESC ") 
        .replace(/ DISTINCT /ig," DISTINCT ")
        .replace(/ EXISTS /ig," EXISTS ")
        .replace(/ NOT /ig," NOT ")
        .replace(/ NULL /ig," NULL ")
        .replace(/ LIKE /ig," LIKE ")
        .replace(/\s{0,}SELECT /ig,"SELECT ")
        .replace(/~::~{1,}/g,"~::~")
        .split('~::~');
}

pp.prototype.sql = function(text) {

    var ar_by_quote = text.replace(/\s{1,}/g," ")
                        .replace(/\'/ig,"~::~\'")
                        .split('~::~'),
        len = ar_by_quote.length,
        ar = [],
        deep = 0,
        tab = this.step,//+this.step,
        inComment = true,
        inQuote = false,
        parenthesisLevel = 0,
        str = '',
        ix = 0;

    for(ix=0;ix<len;ix++) {

        if(ix%2) {
            ar = ar.concat(ar_by_quote[ix]);
        } else {
            ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
        }
    }

    len = ar.length;
    for(ix=0;ix<len;ix++) {

        parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);

        if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
            ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
        } 

        if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
            deep++;
            str += this.shift[deep]+ar[ix];
        } else 
        if( /\'/.exec(ar[ix]) )  { 
            if(parenthesisLevel<1 && deep) {
                deep--;
            }
            str += ar[ix];
        }
        else  { 
            str += this.shift[deep]+ar[ix];
            if(parenthesisLevel<1 && deep) {
                deep--;
            }
        } 
    }

    str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
    return str;
}

// ----------------------- min section ----------------------------------------------------

pp.prototype.xmlmin = function(text, preserveComments) {

	var str = preserveComments ? text
				   : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"");
	return  str.replace(/>\s{0,}</g,"><"); 
}

pp.prototype.jsonmin = function(text) {
								  
    return  text.replace(/\s{0,}\{\s{0,}/g,"{")
                .replace(/\s{0,}\[$/g,"[")
                .replace(/\[\s{0,}/g,"[")
                .replace(/:\s{0,}\[/g,':[')
                .replace(/\s{0,}\}\s{0,}/g,"}")
                .replace(/\s{0,}\]\s{0,}/g,"]")
                .replace(/\"\s{0,}\,/g,'",')
                .replace(/\,\s{0,}\"/g,',"')
                .replace(/\"\s{0,}:/g,'":')
                .replace(/:\s{0,}\"/g,':"')
                .replace(/:\s{0,}\[/g,':[')
                .replace(/\,\s{0,}\[/g,',[')
                .replace(/\,\s{2,}/g,', ')
                .replace(/\]\s{0,},\s{0,}\[/g,'],[');   
}

pp.prototype.cssmin = function(text, preserveComments) {
	
	var str = preserveComments ? text
				   : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;
	return str.replace(/\s{1,}/g,' ')
			  .replace(/\{\s{1,}/g,"{")
			  .replace(/\}\s{1,}/g,"}")
			  .replace(/\;\s{1,}/g,";")
			  .replace(/\/\*\s{1,}/g,"/*")
			  .replace(/\*\/\s{1,}/g,"*/");
}	

pp.prototype.sqlmin = function(text) {
    return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
}

// --------------------------------------------------------------------------------------------

exports.pd= new pp;	











},{}],5:[function(_dereq_,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = _dereq_('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = _dereq_('./dom').DOMImplementation;
	exports.XMLSerializer = _dereq_('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
//}

},{"./dom":6,"./sax":7}],6:[function(_dereq_,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}

},{}],7:[function(_dereq_,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;


},{}],8:[function(_dereq_,module,exports){
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
  "peerDependencies": {
    "jquery": "^2.2.4",
    "filesaverjs": "~0.2.2",
    "cytoscape": "iVis-at-Bilkent/cytoscape.js#unstable"
  },
  "dependencies": {
    "libsbgn.js": "git://github.com/eisbm/libsbgn.js",
    "pretty-data": "^0.40.0"
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

},{}],9:[function(_dereq_,module,exports){
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
},{"./sbgn-extensions/sbgn-cy-instance":10,"./sbgn-extensions/sbgn-cy-renderer":11,"./utilities/element-utilities":12,"./utilities/file-utilities":13,"./utilities/graph-utilities":14,"./utilities/keyboard-input-utilities":16,"./utilities/lib-utilities":17,"./utilities/main-utilities":18,"./utilities/option-utilities":19,"./utilities/ui-utilities":22,"./utilities/undo-redo-action-functions":23}],10:[function(_dereq_,module,exports){
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

/*
 * Returns the coordinates of the point located on the given angle on the circle with the given centeral coordinates and radius.
 */
var getPointOnCircle = function(centerX, centerY, radius, angleInDegree) {
	var angleInRadian = angleInDegree * ( Math.PI / 180 ); // Convert degree to radian
	return {
		x: radius * Math.cos(angleInRadian) + centerX,
		y: -1 * radius * Math.sin(angleInRadian) + centerY // We multiply with -1 here because JS y coordinate sign is the oposite of the Mathamatical coordinates system
	};
};

/*
 * Generates a polygon string approximating a circle with given center, radius, start, end angles and number of points to represent the circle
 */
var generateCircleString = function(centerX, centerY, radius, angleFrom, angleTo, numOfPoints) {
	var circleStr = "";
	var stepSize = ( angleTo - angleFrom ) / numOfPoints; // We will increment the current angle by step size in each iteration
	var currentAngle = angleFrom; // current angle will be updated in each iteration
	
	for ( var i = 0; i < numOfPoints; i++ ) {
		var point = getPointOnCircle(centerX, centerY, radius, currentAngle);
		currentAngle += stepSize;
		circleStr += point.x + " " + point.y + " ";
	}
	
	return circleStr;
};

/*
 *  Generates a string representing processes/logical operators with ports.
 *  lineHW: Half width of line through the circle to the intersection point
 *  shapeHW: Half width of the shape discluding the ports (It is radius for the circular shapes)
 *  type: Type of the shape discluding the ports. Options are 'circle', 'rectangle'
 *  orientation: Orientation of the ports Options are 'horizontal', 'vertical'
 */

var generateShapeWithPortString = function(lineHW, shapeHW, type, orientation) {
	var polygonStr;
    var numOfPoints = 30; // Number of points that both halves of circle will have
	if (orientation === 'horizontal') {
		var abovePoints, belowPoints;
	
		if (type === 'circle') {
			abovePoints = generateCircleString(0, 0, shapeHW, 180, 0, numOfPoints);
			belowPoints = generateCircleString(0, 0, shapeHW, 360, 180, numOfPoints);
		}
		else if (type === 'rectangle') {
			abovePoints = '-' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' ';
			belowPoints = shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' ';
		}
		
		polygonStr = "-1 -" + lineHW + " -" + shapeHW + " -" + lineHW + " ";	
		polygonStr += abovePoints;
		polygonStr += shapeHW + " -" + lineHW + " 1 -" + lineHW + " 1 " + lineHW + " " + shapeHW + " " + lineHW + " ";
		polygonStr += belowPoints;
		polygonStr += "-" + shapeHW + " " + lineHW + " -1 " + lineHW;
	}
	else {
		var leftPoints, rightPoints;
		
		if (type === 'circle') {
			leftPoints = generateCircleString(0, 0, shapeHW, 90, 270, numOfPoints);
			rightPoints = generateCircleString(0, 0, shapeHW, -90, 90, numOfPoints);
		}
		else if (type === 'rectangle') {
			leftPoints = '-' + shapeHW + ' -' + shapeHW + ' -' + shapeHW + ' ' + shapeHW + ' ';
			rightPoints = shapeHW + ' ' + shapeHW + ' ' + shapeHW + ' -' + shapeHW + ' '; 
		}
		
		polygonStr = "-" + lineHW + " -" + 1 + " -" + lineHW + " -" + shapeHW + " ";
		polygonStr += leftPoints;
		polygonStr += "-" + lineHW + " " + shapeHW + " -" + lineHW + " 1 " + lineHW + " 1 " + lineHW + " " + shapeHW + " ";
		polygonStr += rightPoints;
		polygonStr += lineHW + " -" + shapeHW + " " + lineHW + " -1";
	}
	
	return polygonStr;
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
          .selector("node[?clonemarker][class='perturbing agent'],node[?clonemarker][class='unspecified entity']")
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
          .selector("node[class='association'],[class='dissociation'],[class='and'],[class='or'],[class='not'],[class='process'],[class='omitted process'],[class='uncertain process']")
          .css({
            'shape-polygon-points': function(ele) {
              if (graphUtilities.portsEnabled === true && ele.data('ports').length === 2) {
                // We assume that the ports of the edge are symetric according to the node center so just checking one port is enough for us
                var port = ele.data('ports')[0]; 
                // If the ports are located above/below of the node then the orientation is 'vertical' else it is 'horizontal'
                var orientation = port.x === 0 ? 'vertical' : 'horizontal';
                // The half width of the actual shape discluding the ports
                var shapeHW = orientation === 'vertical' ? 50 / Math.abs(port.y) : 50 / Math.abs(port.x);
                // Get the class of the node
                var _class = ele.data('class');
                // If class is one of process, omitted process or uncertain process then the type of actual shape is 'rectangle' else it is 'circle'
                var type = _class.endsWith('process') ? 'rectangle' : 'circle';
                
                // Generate a polygon string with above parameters and return it
                return generateShapeWithPortString(0.01, shapeHW, type, orientation);
              }
              
              // This element is not expected to have a poygonial shape (Because it does not have 2 ports) just return a trivial string here not to have a run time bug
              return '-1 -1 1 1 1 0';
            }
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
            'arrow-scale': 1.25
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

},{"../utilities/element-utilities":12,"../utilities/graph-utilities":14,"../utilities/lib-utilities":17,"../utilities/option-utilities":19,"../utilities/undo-redo-action-functions":23}],11:[function(_dereq_,module,exports){
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
    'macromolecule': true,
    'simple chemical': true
  };

  var totallyOverridenNodeShapes = $$.sbgn.totallyOverridenNodeShapes = {
    'macromolecule': true,
    'nucleic acid feature': true,
    'simple chemical': true,
    'complex': true
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
    clone: "#a9a9a9"
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

  cyStyleProperties.types.nodeShape.enums.push('source and sink');
  cyStyleProperties.types.nodeShape.enums.push('nucleic acid feature');
  cyStyleProperties.types.nodeShape.enums.push('complex');
  cyStyleProperties.types.nodeShape.enums.push('macromolecule');
  cyStyleProperties.types.nodeShape.enums.push('simple chemical');

  $$.sbgn.registerSbgnNodeShapes = function () {

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

},{"../utilities/lib-utilities":17,"../utilities/text-utilities":21}],12:[function(_dereq_,module,exports){
/*
 * Common utilities for elements includes both general utilities and sbgn specific utilities 
 */

var truncateText = _dereq_('./text-utilities').truncateText;
var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;
var graphUtilities = _dereq_('./graph-utilities');

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
                || _class == 'simple chemical' || _class == 'complex' ) {
            return _class;
        }
        
        // These shapes can have ports. If they have ports we represent them by polygons, else they are represented by ellipses or rectangles
        // conditionally.
        if (_class == 'association' || _class == 'dissociation' || _class == 'process' || _class == 'omitted process'
                || _class == 'uncertain process' || _class == 'and' || _class == 'or' || _class == 'not' ) {
          
          if (graphUtilities.portsEnabled === true && ele.data('ports').length === 2) {
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

      if (_class.endsWith('process') ||  _class === 'dissociation' || _class === 'and' || _class === 'or' || _class === 'not') {
        var coeff = 1; // The dynamic label size coefficient for these pseudo labels, it is 1 for logical operators
        
        // Coeff is supposed to be 2 for dissociation and 1.5 for other processes
        if (_class === 'dissociation') {
          coeff = 2;
        }
        else if (_class.endsWith('process')) {
          coeff = 1.5;
        }
        
        var ports = ele.data('ports');
        
        if (graphUtilities.portsEnabled === true && ports.length === 2) {
          // We assume that the ports are symmetric to the node center so using just one of the ports is enough
          var port = ports[0];
          var orientation = port.x === 0 ? 'vertical' : 'horizontal';
          // This is the ratio of the area occupied with ports over without ports
          var ratio = orientation === 'vertical' ? Math.abs(port.y) / 50 : Math.abs(port.x) / 50;
          coeff /= ratio; // Divide the coeff by ratio to fit into the bbox of the actual shape (discluding ports)
        }
        
        return this.getDynamicLabelTextSize(ele, coeff);
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

},{"./graph-utilities":14,"./lib-utilities":17,"./option-utilities":19,"./text-utilities":21}],13:[function(_dereq_,module,exports){
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

},{"./graph-utilities":14,"./json-to-sbgnml-converter":15,"./lib-utilities":17,"./sbgnml-to-json-converter":20,"./ui-utilities":22}],14:[function(_dereq_,module,exports){
/*
 * Common utilities for sbgnviz graphs
 */

var optionUtilities = _dereq_('./option-utilities');
var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

function graphUtilities() {}

graphUtilities.portsEnabled = true;

graphUtilities.disablePorts = function() {
  graphUtilities.portsEnabled = false;
  cy.style().update();
};

graphUtilities.enablePorts = function() {
  graphUtilities.portsEnabled = true;
  cy.style().update();
};

graphUtilities.arePortsEnabled = function() {
  return graphUtilities.portsEnabled;
};

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
},{"./lib-utilities":17,"./option-utilities":19}],15:[function(_dereq_,module,exports){
var txtUtil = _dereq_('./text-utilities');
var libsbgnjs = _dereq_('libsbgn.js');
var renderExtension = libsbgnjs.renderExtension;
var pkgVersion = _dereq_('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = _dereq_('../../package.json').name;
var prettyprint = _dereq_('pretty-data').pd;
var graphUtilities = _dereq_('./graph-utilities');

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
        return prettyprint.xml(xmlHeader + sbgn.toXML());
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
            var orientation = ports[i].x === 0 ? 'vertical' : 'horizontal';
            // This is the ratio of the area occupied for ports over the whole shape
            var ratio = orientation === 'vertical' ? Math.abs(ports[i].y) / 50 : Math.abs(ports[i].x) / 50;
            
            // Divide the node sizes by the ratio because that sizes includes ports as well
            var x = node._private.position.x + ports[i].x * ( node.width() / ratio ) / 100;
            var y = node._private.position.y + ports[i].y * ( node.height() / ratio ) / 100;

            glyph.addPort(new libsbgnjs.Port({id: ports[i].id, x: x, y: y}));
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
        
        var _class = node.data('class');
        
        // If the node can have ports and it has exactly 2 ports then it is represented by a bigger bbox.
        // This is because we represent it as a polygon and so the whole shape including the ports are rendered in the node bbox.
        if (_class === 'association' || _class === 'dissociation' || _class === 'and' || _class === 'or' || _class === 'not' || _class.endsWith('process')) {
          if (graphUtilities.portsEnabled === true && node.data('ports').length === 2) {
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

},{"../../package.json":8,"./graph-utilities":14,"./text-utilities":21,"libsbgn.js":2,"pretty-data":4}],16:[function(_dereq_,module,exports){
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

},{"./lib-utilities":17,"./option-utilities":19}],17:[function(_dereq_,module,exports){
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


},{}],18:[function(_dereq_,module,exports){
/* 
 * These are the main utilities to be directly utilized by the user interactions.
 * Idealy, this file is just required by index.js
 */

var elementUtilities = _dereq_('./element-utilities');
var jsonToSbgnml = _dereq_('./json-to-sbgnml-converter');
var sbgnmlToJson = _dereq_('./sbgnml-to-json-converter');
var optionUtilities = _dereq_('./option-utilities');
var graphUtilities = _dereq_('./graph-utilities');

var options = optionUtilities.getOptions();
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

// Helpers start
function beforePerformLayout() {
  var nodes = cy.nodes();
  var edges = cy.edges();

  graphUtilities.disablePorts();

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
},{"./element-utilities":12,"./graph-utilities":14,"./json-to-sbgnml-converter":15,"./lib-utilities":17,"./option-utilities":19,"./sbgnml-to-json-converter":20}],19:[function(_dereq_,module,exports){
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

},{}],20:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');
var graphUtilities = _dereq_('./graph-utilities');
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
    
    var _class = nodeObj.class;
    // If the node can have ports and it has exactly 2 ports then it should be represented by a bigger bbox.
    // This is because we represent it as a polygon and so the whole shape including the ports are rendered in the node bbox.
    if (_class === 'association' || _class === 'dissociation' || _class === 'and' || _class === 'or' || _class === 'not' || _class.endsWith('process')) {
      if (graphUtilities.portsEnabled && ports.length === 2) {
        // We assume that the ports are symmetric to the node center so using just one of the ports is enough
        var port = ports[0];
        var orientation = port.x === 0 ? 'vertical' : 'horizontal';
        // This is the ratio of the area occupied with ports over without ports
        var ratio = orientation === 'vertical' ? Math.abs(port.y) / 50 : Math.abs(port.x) / 50;
        // Multiply the bbox with the calculated ratio
        nodeObj.bbox.w = parseFloat(nodeObj.bbox.w) * ratio;
        nodeObj.bbox.h = parseFloat(nodeObj.bbox.h) * ratio;
      }
    }

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

    if (sbgn.map.extension && sbgn.map.extension.has('renderInformation')) { // render extension was found
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

},{"./element-utilities":12,"./graph-utilities":14,"libsbgn.js":2}],21:[function(_dereq_,module,exports){
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
},{"./option-utilities":19}],22:[function(_dereq_,module,exports){
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



},{"./lib-utilities":17,"./option-utilities":19}],23:[function(_dereq_,module,exports){
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
},{"./element-utilities":12}]},{},[9])(9)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy9saWJzYmduLXJlbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9saWJzYmduLmpzL2xpYnNiZ24uanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvcHJldHR5LWRhdGEvcHJldHR5LWRhdGEuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS1wYXJzZXIuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy94bWxkb20vc2F4LmpzIiwicGFja2FnZS5qc29uIiwic3JjL2luZGV4LmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlLmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyLmpzIiwic3JjL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy91aS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNzZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjaGVja1BhcmFtcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJykuY2hlY2tQYXJhbXM7XHJcbnZhciB4bWxkb20gPSByZXF1aXJlKCd4bWxkb20nKTtcclxuXHJcbnZhciBucyA9IHt9O1xyXG5cclxubnMueG1sbnMgPSBcImh0dHA6Ly93d3cuc2JtbC5vcmcvc2JtbC9sZXZlbDMvdmVyc2lvbjEvcmVuZGVyL3ZlcnNpb24xXCI7XHJcblxyXG4vLyAtLS0tLS0tIENPTE9SREVGSU5JVElPTiAtLS0tLS0tXHJcbm5zLkNvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAndmFsdWUnXSk7XHJcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMudmFsdWUgXHQ9IHBhcmFtcy52YWx1ZTtcclxufTtcclxuXHJcbm5zLkNvbG9yRGVmaW5pdGlvbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2NvbG9yRGVmaW5pdGlvbicpO1xyXG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdGNvbG9yRGVmaW5pdGlvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLnZhbHVlICE9IG51bGwpIHtcclxuXHRcdGNvbG9yRGVmaW5pdGlvbi5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XHJcblx0fVxyXG5cdHJldHVybiBjb2xvckRlZmluaXRpb247XHJcbn07XHJcblxyXG5ucy5Db2xvckRlZmluaXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuQ29sb3JEZWZpbml0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdjb2xvckRlZmluaXRpb24nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNvbG9yRGVmaW5pdGlvbiwgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyBucy5Db2xvckRlZmluaXRpb24oKTtcclxuXHRjb2xvckRlZmluaXRpb24uaWQgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRjb2xvckRlZmluaXRpb24udmFsdWUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XHJcblx0cmV0dXJuIGNvbG9yRGVmaW5pdGlvbjtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gTElTVE9GQ09MT1JERUZJTklUSU9OUyAtLS0tLS0tXHJcbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy5jb2xvckRlZmluaXRpb25zID0gW107XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS5hZGRDb2xvckRlZmluaXRpb24gPSBmdW5jdGlvbiAoY29sb3JEZWZpbml0aW9uKSB7XHJcblx0dGhpcy5jb2xvckRlZmluaXRpb25zLnB1c2goY29sb3JEZWZpbml0aW9uKTtcclxufTtcclxuXHJcbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpO1xyXG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuY29sb3JEZWZpbml0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLmNvbG9yRGVmaW5pdGlvbnNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xyXG59O1xyXG5cclxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdsaXN0T2ZDb2xvckRlZmluaXRpb25zJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBsaXN0T2ZDb2xvckRlZmluaXRpb25zLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyBucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zKCk7XHJcblxyXG5cdHZhciBjb2xvckRlZmluaXRpb25zID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjb2xvckRlZmluaXRpb24nKTtcclxuXHRmb3IgKHZhciBpPTA7IGk8Y29sb3JEZWZpbml0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvblhNTCA9IGNvbG9yRGVmaW5pdGlvbnNbaV07XHJcblx0XHR2YXIgY29sb3JEZWZpbml0aW9uID0gbnMuQ29sb3JEZWZpbml0aW9uLmZyb21YTUwoY29sb3JEZWZpbml0aW9uWE1MKTtcclxuXHRcdGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XHJcblx0fVxyXG5cdHJldHVybiBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gUkVOREVSR1JPVVAgLS0tLS0tLVxyXG5ucy5SZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHQvLyBlYWNoIG9mIHRob3NlIGFyZSBvcHRpb25hbCwgc28gdGVzdCBpZiBpdCBpcyBkZWZpbmVkIGlzIG1hbmRhdG9yeVxyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnZm9udFNpemUnLCAnZm9udEZhbWlseScsICdmb250V2VpZ2h0JywgXHJcblx0XHQnZm9udFN0eWxlJywgJ3RleHRBbmNob3InLCAndnRleHRBbmNob3InLCAnZmlsbCcsICdpZCcsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnXSk7XHJcblx0Ly8gc3BlY2lmaWMgdG8gcmVuZGVyR3JvdXBcclxuXHR0aGlzLmZvbnRTaXplIFx0XHQ9IHBhcmFtcy5mb250U2l6ZTtcclxuXHR0aGlzLmZvbnRGYW1pbHkgXHQ9IHBhcmFtcy5mb250RmFtaWx5O1xyXG5cdHRoaXMuZm9udFdlaWdodCBcdD0gcGFyYW1zLmZvbnRXZWlnaHQ7XHJcblx0dGhpcy5mb250U3R5bGUgXHRcdD0gcGFyYW1zLmZvbnRTdHlsZTtcclxuXHR0aGlzLnRleHRBbmNob3IgXHQ9IHBhcmFtcy50ZXh0QW5jaG9yOyAvLyBwcm9iYWJseSB1c2VsZXNzXHJcblx0dGhpcy52dGV4dEFuY2hvciBcdD0gcGFyYW1zLnZ0ZXh0QW5jaG9yOyAvLyBwcm9iYWJseSB1c2VsZXNzXHJcblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUyRFxyXG5cdHRoaXMuZmlsbCBcdFx0XHQ9IHBhcmFtcy5maWxsOyAvLyBmaWxsIGNvbG9yXHJcblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUxRFxyXG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy5zdHJva2UgXHRcdD0gcGFyYW1zLnN0cm9rZTsgLy8gc3Ryb2tlIGNvbG9yXHJcblx0dGhpcy5zdHJva2VXaWR0aCBcdD0gcGFyYW1zLnN0cm9rZVdpZHRoO1xyXG59O1xyXG5cclxubnMuUmVuZGVyR3JvdXAucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciByZW5kZXJHcm91cCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2cnKTtcclxuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmZvbnRTaXplICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udFNpemUnLCB0aGlzLmZvbnRTaXplKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuZm9udEZhbWlseSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2ZvbnRGYW1pbHknLCB0aGlzLmZvbnRGYW1pbHkpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5mb250V2VpZ2h0ICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udFdlaWdodCcsIHRoaXMuZm9udFdlaWdodCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmZvbnRTdHlsZSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2ZvbnRTdHlsZScsIHRoaXMuZm9udFN0eWxlKTtcclxuXHR9XHJcblx0aWYgKHRoaXMudGV4dEFuY2hvciAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ3RleHRBbmNob3InLCB0aGlzLnRleHRBbmNob3IpO1xyXG5cdH1cclxuXHRpZiAodGhpcy52dGV4dEFuY2hvciAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ3Z0ZXh0QW5jaG9yJywgdGhpcy52dGV4dEFuY2hvcik7XHJcblx0fVxyXG5cdGlmICh0aGlzLnN0cm9rZSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuc3Ryb2tlKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuc3Ryb2tlV2lkdGggIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdzdHJva2VXaWR0aCcsIHRoaXMuc3Ryb2tlV2lkdGgpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5maWxsICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuZmlsbCk7XHJcblx0fVxyXG5cdHJldHVybiByZW5kZXJHcm91cDtcclxufTtcclxuXHJcbm5zLlJlbmRlckdyb3VwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlJlbmRlckdyb3VwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdnJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgcmVuZGVyR3JvdXAgPSBuZXcgbnMuUmVuZGVyR3JvdXAoe30pO1xyXG5cdHJlbmRlckdyb3VwLmlkIFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRyZW5kZXJHcm91cC5mb250U2l6ZSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFNpemUnKTtcclxuXHRyZW5kZXJHcm91cC5mb250RmFtaWx5IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250RmFtaWx5Jyk7XHJcblx0cmVuZGVyR3JvdXAuZm9udFdlaWdodCBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFdlaWdodCcpO1xyXG5cdHJlbmRlckdyb3VwLmZvbnRTdHlsZSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udFN0eWxlJyk7XHJcblx0cmVuZGVyR3JvdXAudGV4dEFuY2hvciBcdD0geG1sLmdldEF0dHJpYnV0ZSgndGV4dEFuY2hvcicpO1xyXG5cdHJlbmRlckdyb3VwLnZ0ZXh0QW5jaG9yID0geG1sLmdldEF0dHJpYnV0ZSgndnRleHRBbmNob3InKTtcclxuXHRyZW5kZXJHcm91cC5zdHJva2UgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnc3Ryb2tlJyk7XHJcblx0cmVuZGVyR3JvdXAuc3Ryb2tlV2lkdGggPSB4bWwuZ2V0QXR0cmlidXRlKCdzdHJva2VXaWR0aCcpO1xyXG5cdHJlbmRlckdyb3VwLmZpbGwgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnZmlsbCcpO1xyXG5cdHJldHVybiByZW5kZXJHcm91cDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgUkVOREVSR1JPVVAgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBTVFlMRSAtLS0tLS0tXHJcbi8vIGxvY2FsU3R5bGUgZnJvbSBzcGVjc1xyXG5ucy5TdHlsZSA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbmFtZScsICdpZExpc3QnLCAncmVuZGVyR3JvdXAnXSk7XHJcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLm5hbWUgXHRcdFx0PSBwYXJhbXMubmFtZTtcclxuXHR0aGlzLmlkTGlzdCBcdFx0PSBwYXJhbXMuaWRMaXN0OyAvLyBUT0RPIGFkZCB1dGlsaXR5IGZ1bmN0aW9ucyB0byBtYW5hZ2UgdGhpcyAoc2hvdWxkIGJlIGFycmF5KVxyXG5cdHRoaXMucmVuZGVyR3JvdXAgXHQ9IHBhcmFtcy5yZW5kZXJHcm91cDtcclxufTtcclxuXHJcbm5zLlN0eWxlLnByb3RvdHlwZS5zZXRSZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChyZW5kZXJHcm91cCkge1xyXG5cdHRoaXMucmVuZGVyR3JvdXAgPSByZW5kZXJHcm91cDtcclxufTtcclxuXHJcbm5zLlN0eWxlLnByb3RvdHlwZS5nZXRJZExpc3RBc0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB0aGlzLmlkTGlzdC5zcGxpdCgnICcpO1xyXG59XHJcblxyXG5ucy5TdHlsZS5wcm90b3R5cGUuc2V0SWRMaXN0RnJvbUFycmF5ID0gZnVuY3Rpb24gKGlkQXJyYXkpIHtcclxuXHR0aGlzLmlkTGlzdCA9IGlkQXJyYXkuam9pbignICcpO1xyXG59XHJcblxyXG5ucy5TdHlsZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHN0eWxlID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xyXG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuaWRMaXN0ICE9IG51bGwpIHtcclxuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnaWRMaXN0JywgdGhpcy5pZExpc3QpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRoaXMucmVuZGVyR3JvdXApIHtcclxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyR3JvdXAuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZTtcclxufTtcclxuXHJcbm5zLlN0eWxlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlN0eWxlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdzdHlsZScpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3R5bGUsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBzdHlsZSA9IG5ldyBucy5TdHlsZSgpO1xyXG5cdHN0eWxlLmlkIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0c3R5bGUubmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJyk7XHJcblx0c3R5bGUuaWRMaXN0IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZExpc3QnKTtcclxuXHJcblx0dmFyIHJlbmRlckdyb3VwWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdnJylbMF07XHJcblx0aWYgKHJlbmRlckdyb3VwWE1MICE9IG51bGwpIHtcclxuXHRcdHN0eWxlLnJlbmRlckdyb3VwID0gbnMuUmVuZGVyR3JvdXAuZnJvbVhNTChyZW5kZXJHcm91cFhNTCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZTtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgU1RZTEUgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBMSVNUT0ZTVFlMRVMgLS0tLS0tLVxyXG5ucy5MaXN0T2ZTdHlsZXMgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLnN0eWxlcyA9IFtdO1xyXG59O1xyXG5cclxubnMuTGlzdE9mU3R5bGVzLnByb3RvdHlwZS5hZGRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XHJcblx0dGhpcy5zdHlsZXMucHVzaChzdHlsZSk7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdsaXN0T2ZTdHlsZXMnKTtcclxuXHRmb3IodmFyIGk9MDsgaTx0aGlzLnN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGlzdE9mU3R5bGVzLmFwcGVuZENoaWxkKHRoaXMuc3R5bGVzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gbGlzdE9mU3R5bGVzO1xyXG59O1xyXG5cclxubnMuTGlzdE9mU3R5bGVzLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkxpc3RPZlN0eWxlcy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAnbGlzdE9mU3R5bGVzJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBsaXN0T2ZTdHlsZXMsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgbnMuTGlzdE9mU3R5bGVzKCk7XHJcblxyXG5cdHZhciBzdHlsZXMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpPHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHN0eWxlWE1MID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIHN0eWxlID0gbnMuU3R5bGUuZnJvbVhNTChzdHlsZVhNTCk7XHJcblx0XHRsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoc3R5bGUpO1xyXG5cdH1cclxuXHRyZXR1cm4gbGlzdE9mU3R5bGVzO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBMSVNUT0ZTVFlMRVMgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbmFtZScsICdwcm9ncmFtTmFtZScsIFxyXG5cdFx0J3Byb2dyYW1WZXJzaW9uJywgJ2JhY2tncm91bmRDb2xvcicsICdsaXN0T2ZDb2xvckRlZmluaXRpb25zJywgJ2xpc3RPZlN0eWxlcyddKTtcclxuXHR0aGlzLmlkIFx0XHRcdFx0XHQ9IHBhcmFtcy5pZDsgLy8gcmVxdWlyZWQsIHJlc3QgaXMgb3B0aW9uYWxcclxuXHR0aGlzLm5hbWUgXHRcdFx0XHRcdD0gcGFyYW1zLm5hbWU7XHJcblx0dGhpcy5wcm9ncmFtTmFtZSBcdFx0XHQ9IHBhcmFtcy5wcm9ncmFtTmFtZTtcclxuXHR0aGlzLnByb2dyYW1WZXJzaW9uIFx0XHQ9IHBhcmFtcy5wcm9ncmFtVmVyc2lvbjtcclxuXHR0aGlzLmJhY2tncm91bmRDb2xvciBcdFx0PSBwYXJhbXMuYmFja2dyb3VuZENvbG9yO1xyXG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IHBhcmFtcy5saXN0T2ZDb2xvckRlZmluaXRpb25zO1xyXG5cdHRoaXMubGlzdE9mU3R5bGVzIFx0XHRcdD0gcGFyYW1zLmxpc3RPZlN0eWxlcztcclxuXHQvKnRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucyhyZW5kZXJJbmZvLmNvbG9yRGVmLmNvbG9yTGlzdCk7XHJcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcyhyZW5kZXJJbmZvLnN0eWxlRGVmKTtcclxuXHQqL1xyXG59O1xyXG5cclxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnNldExpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbihsaXN0T2ZDb2xvckRlZmluaXRpb25zKSB7XHJcblx0dGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcclxufTtcclxuXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZTdHlsZXMgPSBmdW5jdGlvbihsaXN0T2ZTdHlsZXMpIHtcclxuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IGxpc3RPZlN0eWxlcztcclxufTtcclxuXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdyZW5kZXJJbmZvcm1hdGlvbicpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBucy54bWxucyk7XHJcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgnbmFtZScsIHRoaXMubmFtZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLnByb2dyYW1OYW1lICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgncHJvZ3JhbU5hbWUnLCB0aGlzLnByb2dyYW1OYW1lKTtcclxuXHR9XHJcblx0aWYgKHRoaXMucHJvZ3JhbVZlcnNpb24gIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCdwcm9ncmFtVmVyc2lvbicsIHRoaXMucHJvZ3JhbVZlcnNpb24pO1xyXG5cdH1cclxuXHRpZiAodGhpcy5iYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCdiYWNrZ3JvdW5kQ29sb3InLCB0aGlzLmJhY2tncm91bmRDb2xvcik7XHJcblx0fVxyXG5cclxuXHRpZiAodGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmxpc3RPZlN0eWxlcykge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uYXBwZW5kQ2hpbGQodGhpcy5saXN0T2ZTdHlsZXMuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcclxufTtcclxuXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxuLy8gc3RhdGljIGNvbnN0cnVjdG9yIG1ldGhvZFxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAncmVuZGVySW5mb3JtYXRpb24nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHJlbmRlckluZm9ybWF0aW9uLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSBuZXcgbnMuUmVuZGVySW5mb3JtYXRpb24oKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5pZCBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5uYW1lIFx0XHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJyk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24ucHJvZ3JhbU5hbWUgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbU5hbWUnKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtVmVyc2lvbiBcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbVZlcnNpb24nKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5iYWNrZ3JvdW5kQ29sb3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicpO1xyXG5cclxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpWzBdO1xyXG5cdHZhciBsaXN0T2ZTdHlsZXNYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpc3RPZlN0eWxlcycpWzBdO1xyXG5cdGlmIChsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLmZyb21YTUwobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCk7XHJcblx0fVxyXG5cdGlmIChsaXN0T2ZTdHlsZXNYTUwgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzID0gbnMuTGlzdE9mU3R5bGVzLmZyb21YTUwobGlzdE9mU3R5bGVzWE1MKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgUkVOREVSSU5GT1JNQVRJT04gLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuczsiLCJ2YXIgcmVuZGVyRXh0ID0gcmVxdWlyZSgnLi9saWJzYmduLXJlbmRlcicpO1xyXG4vL3ZhciBhbm5vdEV4dCA9IHJlcXVpcmUoJy4vbGlic2Jnbi1hbm5vdGF0aW9ucycpO1xyXG52YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xyXG52YXIgeG1sZG9tID0gcmVxdWlyZSgneG1sZG9tJyk7XHJcblxyXG52YXIgbnMgPSB7fTtcclxuXHJcbm5zLnhtbG5zID0gXCJodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjNcIjtcclxuXHJcbi8vIC0tLS0tLS0gU0JHTkJhc2UgLS0tLS0tLVxyXG4vKlxyXG5cdFNldmVyYWwgc2JnbiBlbGVtZW50cyBpbmhlcml0IGZyb20gdGhpcy4gQWxsb3dzIHRvIHB1dCBleHRlbnNpb25zIGV2ZXJ5d2hlcmUuXHJcbiovXHJcbm5zLlNCR05CYXNlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnZXh0ZW5zaW9uJ10pO1xyXG5cdHRoaXMuZXh0ZW5zaW9uIFx0PSBwYXJhbXMuZXh0ZW5zaW9uO1xyXG59O1xyXG5cclxubnMuU0JHTkJhc2UucHJvdG90eXBlLnNldEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHRlbnNpb24pIHtcclxuXHR0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjtcclxufTtcclxuXHJcbi8vIHdyaXRlIHRoZSBYTUwgb2YgdGhpbmdzIHRoYXQgYXJlIHNwZWNpZmljIHRvIFNCR05CYXNlIHR5cGVcclxubnMuU0JHTkJhc2UucHJvdG90eXBlLmJhc2VUb1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgeG1sU3RyaW5nID0gXCJcIjtcclxuXHQvLyBjaGlsZHJlblxyXG5cdGlmKHRoaXMuZXh0ZW5zaW9uICE9IG51bGwpIHtcclxuXHRcdHhtbFN0cmluZyArPSB0aGlzLmV4dGVuc2lvbi50b1hNTCgpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHhtbFN0cmluZztcclxufTtcclxuXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5iYXNlVG9YbWxPYmogPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYodGhpcy5leHRlbnNpb24gIT0gbnVsbCkge1xyXG5cdFx0eG1sT2JqLmFwcGVuZENoaWxkKHRoaXMuZXh0ZW5zaW9uLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxufTtcclxuXHJcbi8vIHBhcnNlIHRoaW5ncyBzcGVjaWZpYyB0byBTQkdOQmFzZSB0eXBlXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5iYXNlRnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHQvLyBjaGlsZHJlblxyXG5cdHZhciBleHRlbnNpb25YTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2V4dGVuc2lvbicpWzBdO1xyXG5cdGlmIChleHRlbnNpb25YTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIGV4dGVuc2lvbiA9IG5zLkV4dGVuc2lvbi5mcm9tWE1MKGV4dGVuc2lvblhNTCk7XHJcblx0XHR0aGlzLnNldEV4dGVuc2lvbihleHRlbnNpb24pO1xyXG5cdH1cclxufTtcclxuXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5oYXNDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgYWxsb3dlZENoaWxkcmVuID0gWydleHRlbnNpb24nXS5jb25jYXQodGhpcy5hbGxvd2VkQ2hpbGRyZW4pO1xyXG5cdGZvcih2YXIgaT0wOyBpIDwgYWxsb3dlZENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcHJvcCA9IGFsbG93ZWRDaGlsZHJlbltpXTtcclxuXHRcdGlmKHR5cGVvZiB0aGlzW3Byb3BdID09ICdhcnJheScgJiYgdGhpc1twcm9wXS5sZW5ndGggPiAwKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdGlmKHRoaXNbcHJvcF0pXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIGZvciBzaW1wbGUgZWxlbWVudHMgdGhhdCBoYXZlIG5vIGNoaWxkcmVuLCB1c2UgdGhpcyBmdW5jdGlvbiB0b1xyXG4vLyBlbnN1cmUgdGFnIGlzIGNsb3NlZCBjb3JyZWN0bHkgd2hlbiB3cml0aW5nIFhNTCwgaWYgZXh0ZW5zaW9uXHJcbi8vIG9yIG90aGVyIFNCR05CYXNlIHNwZWNpZmljIHRoaW5ncyBhcmUgcHJlc2VudC5cclxuLy8gc2ltcGxlIGVsZW1lbnRzIG1pZ2h0IGVuZCB3aXRoIC8+IG9yIDwvbmFtZT4gXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5jbG9zZVRhZyA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgeG1sU3RyaW5nID0gXCJcIjtcclxuXHRpZih0aGlzLmhhc0NoaWxkcmVuKCkpIHtcclxuXHRcdHhtbFN0cmluZyArPSBcIj5cXG5cIjtcclxuXHRcdHhtbFN0cmluZyArPSB0aGlzLmJhc2VUb1hNTCgpO1xyXG5cdFx0eG1sU3RyaW5nICs9IFwiPC9cIit0aGlzLnRhZ05hbWUrXCI+XFxuXCI7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0eG1sU3RyaW5nICs9IFwiIC8+XFxuXCI7XHJcblx0fVxyXG5cdHJldHVybiB4bWxTdHJpbmc7XHJcbn1cclxuLy8gLS0tLS0tLSBFTkQgU0JHTkJhc2UgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBTQkdOIC0tLS0tLS1cclxubnMuU2JnbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4bWxucycsICdtYXAnXSk7XHJcblx0dGhpcy54bWxucyBcdD0gcGFyYW1zLnhtbG5zO1xyXG5cdHRoaXMubWFwIFx0PSBwYXJhbXMubWFwO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnbWFwJ107XHJcblx0dGhpcy50YWdOYW1lID0gJ3NiZ24nO1xyXG59O1xyXG5cclxubnMuU2Jnbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLlNiZ24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuU2JnbjtcclxuXHJcbm5zLlNiZ24ucHJvdG90eXBlLnNldE1hcCA9IGZ1bmN0aW9uIChtYXApIHtcclxuXHR0aGlzLm1hcCA9IG1hcDtcclxufTtcclxuXHJcbm5zLlNiZ24ucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzYmduID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc2JnbicpO1xyXG5cdC8vIGF0dHJpYnV0ZXNcclxuXHRpZih0aGlzLnhtbG5zICE9IG51bGwpIHtcclxuXHRcdHNiZ24uc2V0QXR0cmlidXRlKCd4bWxucycsIHRoaXMueG1sbnMpO1xyXG5cdH1cclxuXHRpZih0aGlzLmxhbmd1YWdlICE9IG51bGwpIHtcclxuXHRcdHNiZ24uc2V0QXR0cmlidXRlKCdsYW5ndWFnZScsIHRoaXMubGFuZ3VhZ2UpO1xyXG5cdH1cclxuXHQvLyBjaGlsZHJlblxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKHNiZ24pO1xyXG5cdGlmICh0aGlzLm1hcCAhPSBudWxsKSB7XHJcblx0XHRzYmduLmFwcGVuZENoaWxkKHRoaXMubWFwLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gc2JnbjtcclxufTtcclxuXHJcbm5zLlNiZ24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuU2Jnbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc2JnbicpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc2JnbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHNiZ24gPSBuZXcgbnMuU2JnbigpO1xyXG5cdHNiZ24ueG1sbnMgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd4bWxucycpO1xyXG5cclxuXHQvLyBnZXQgY2hpbGRyZW5cclxuXHR2YXIgbWFwWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtYXAnKVswXTtcclxuXHRpZiAobWFwWE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBtYXAgPSBucy5NYXAuZnJvbVhNTChtYXBYTUwpO1xyXG5cdFx0c2Jnbi5zZXRNYXAobWFwKTtcclxuXHR9XHJcblx0c2Jnbi5iYXNlRnJvbVhNTCh4bWxPYmopOyAvLyBjYWxsIHRvIHBhcmVudCBjbGFzc1xyXG5cdHJldHVybiBzYmduO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBTQkdOIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gTUFQIC0tLS0tLS1cclxubnMuTWFwID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ2xhbmd1YWdlJywgJ2dseXBocycsICdhcmNzJ10pO1xyXG5cdHRoaXMuaWQgXHRcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMubGFuZ3VhZ2UgXHQ9IHBhcmFtcy5sYW5ndWFnZTtcclxuXHR0aGlzLmdseXBocyBcdD0gcGFyYW1zLmdseXBocyB8fCBbXTtcclxuXHR0aGlzLmFyY3MgXHRcdD0gcGFyYW1zLmFyY3MgfHwgW107XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gWydnbHlwaHMnLCAnYXJjcyddO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdtYXAnO1xyXG59O1xyXG5cclxubnMuTWFwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuTWFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLk1hcDtcclxuXHJcbm5zLk1hcC5wcm90b3R5cGUuYWRkR2x5cGggPSBmdW5jdGlvbiAoZ2x5cGgpIHtcclxuXHR0aGlzLmdseXBocy5wdXNoKGdseXBoKTtcclxufTtcclxuXHJcbm5zLk1hcC5wcm90b3R5cGUuYWRkQXJjID0gZnVuY3Rpb24gKGFyYykge1xyXG5cdHRoaXMuYXJjcy5wdXNoKGFyYyk7XHJcbn07XHJcblxyXG5ucy5NYXAucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBtYXAgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdtYXAnKTtcclxuXHQvLyBhdHRyaWJ1dGVzXHJcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRtYXAuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZih0aGlzLmxhbmd1YWdlICE9IG51bGwpIHtcclxuXHRcdG1hcC5zZXRBdHRyaWJ1dGUoJ2xhbmd1YWdlJywgdGhpcy5sYW5ndWFnZSk7XHJcblx0fVxyXG5cdC8vIGNoaWxkcmVuXHJcblx0dGhpcy5iYXNlVG9YbWxPYmoobWFwKTtcclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRtYXAuYXBwZW5kQ2hpbGQodGhpcy5nbHlwaHNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5hcmNzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRtYXAuYXBwZW5kQ2hpbGQodGhpcy5hcmNzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gbWFwO1xyXG59O1xyXG5cclxubnMuTWFwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLk1hcC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbWFwJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBtYXAsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBtYXAgPSBuZXcgbnMuTWFwKCk7XHJcblx0bWFwLmlkID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRtYXAubGFuZ3VhZ2UgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYW5ndWFnZScpO1xyXG5cclxuXHQvLyBuZWVkIHRvIGJlIGNhcmVmdWwgaGVyZSwgYXMgdGhlcmUgY2FuIGJlIGdseXBoIGluIGFyY3NcclxuXHR2YXIgZ2x5cGhzWE1MID0geG1sT2JqLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcCA+IGdseXBoJyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhzWE1MLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgZ2x5cGggPSBucy5HbHlwaC5mcm9tWE1MKGdseXBoc1hNTFtpXSk7XHJcblx0XHRtYXAuYWRkR2x5cGgoZ2x5cGgpO1xyXG5cdH1cclxuXHR2YXIgYXJjc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYXJjJyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgYXJjc1hNTC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGFyYyA9IG5zLkFyYy5mcm9tWE1MKGFyY3NYTUxbaV0pO1xyXG5cdFx0bWFwLmFkZEFyYyhhcmMpO1xyXG5cdH1cclxuXHJcblx0bWFwLmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIG1hcDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgTUFQIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gRVhURU5TSU9OUyAtLS0tLS0tXHJcbm5zLkV4dGVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBjb25zaWRlciBmaXJzdCBvcmRlciBjaGlsZHJlbiwgYWRkIHRoZW0gd2l0aCB0aGVpciB0YWduYW1lIGFzIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0XHJcblx0Ly8gc3RvcmUgeG1sT2JqZWN0IGlmIG5vIHN1cHBvcnRlZCBwYXJzaW5nICh1bnJlY29nbml6ZWQgZXh0ZW5zaW9ucylcclxuXHQvLyBlbHNlIHN0b3JlIGluc3RhbmNlIG9mIHRoZSBleHRlbnNpb25cclxuXHR0aGlzLmxpc3QgPSB7fTtcclxuXHR0aGlzLnVuc3VwcG9ydGVkTGlzdCA9IHt9O1xyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uKSB7XHJcblx0aWYgKGV4dGVuc2lvbiBpbnN0YW5jZW9mIHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbikge1xyXG5cdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gZXh0ZW5zaW9uO1xyXG5cdH1cclxuXHRlbHNlIGlmIChleHRlbnNpb24ubm9kZVR5cGUgPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdC8vIGNhc2Ugd2hlcmUgcmVuZGVySW5mb3JtYXRpb24gaXMgcGFzc2VkIHVucGFyc2VkXHJcblx0XHRpZiAoZXh0ZW5zaW9uLnRhZ05hbWUgPT0gJ3JlbmRlckluZm9ybWF0aW9uJykge1xyXG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRlbnNpb24pO1xyXG5cdFx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSByZW5kZXJJbmZvcm1hdGlvbjtcclxuXHRcdH1cclxuXHRcdHRoaXMudW5zdXBwb3J0ZWRMaXN0W2V4dGVuc2lvbi50YWdOYW1lXSA9IGV4dGVuc2lvbjtcclxuXHR9XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XHJcblx0cmV0dXJuIHRoaXMubGlzdC5oYXNPd25Qcm9wZXJ0eShleHRlbnNpb25OYW1lKTtcclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGV4dGVuc2lvbk5hbWUpIHtcclxuXHRpZiAodGhpcy5oYXMoZXh0ZW5zaW9uTmFtZSkpIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3RbZXh0ZW5zaW9uTmFtZV07XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZXh0ZW5zaW9uJyk7XHJcblx0Zm9yICh2YXIgZXh0SW5zdGFuY2UgaW4gdGhpcy5saXN0KSB7XHJcblx0XHRpZiAoZXh0SW5zdGFuY2UgPT0gXCJyZW5kZXJJbmZvcm1hdGlvblwiKSB7XHJcblx0XHRcdGV4dGVuc2lvbi5hcHBlbmRDaGlsZCh0aGlzLmdldChleHRJbnN0YW5jZSkuYnVpbGRYbWxPYmooKSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0ZXh0ZW5zaW9uLmFwcGVuZENoaWxkKHRoaXMuZ2V0KGV4dEluc3RhbmNlKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBleHRlbnNpb247XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdleHRlbnNpb24nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGV4dGVuc2lvbiwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGV4dGVuc2lvbiA9IG5ldyBucy5FeHRlbnNpb24oKTtcclxuXHR2YXIgY2hpbGRyZW4gPSB4bWxPYmouY2hpbGRyZW47XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBleHRYbWxPYmogPSBjaGlsZHJlbltpXTtcclxuXHRcdHZhciBleHROYW1lID0gZXh0WG1sT2JqLnRhZ05hbWU7XHJcblx0XHQvL2V4dGVuc2lvbi5hZGQoZXh0SW5zdGFuY2UpO1xyXG5cdFx0aWYgKGV4dE5hbWUgPT0gJ3JlbmRlckluZm9ybWF0aW9uJykge1xyXG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRYbWxPYmopO1xyXG5cdFx0XHRleHRlbnNpb24uYWRkKHJlbmRlckluZm9ybWF0aW9uKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xyXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7IC8vIHRvIGJlIHBhcnNlZCBjb3JyZWN0bHlcclxuXHRcdH1cclxuXHRcdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXHJcblx0XHRcdGV4dGVuc2lvbi5hZGQoZXh0WG1sT2JqKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGV4dGVuc2lvbjtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgRVhURU5TSU9OUyAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIEdMWVBIIC0tLS0tLS1cclxubnMuR2x5cGggPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ2NvbXBhcnRtZW50UmVmJywgJ2xhYmVsJywgJ2Jib3gnLCAnZ2x5cGhNZW1iZXJzJywgJ3BvcnRzJywgJ3N0YXRlJywgJ2Nsb25lJ10pO1xyXG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy5jbGFzc18gXHRcdD0gcGFyYW1zLmNsYXNzXztcclxuXHR0aGlzLmNvbXBhcnRtZW50UmVmID0gcGFyYW1zLmNvbXBhcnRtZW50UmVmO1xyXG5cclxuXHQvLyBjaGlsZHJlblxyXG5cdHRoaXMubGFiZWwgXHRcdFx0PSBwYXJhbXMubGFiZWw7XHJcblx0dGhpcy5zdGF0ZSBcdFx0XHQ9IHBhcmFtcy5zdGF0ZTtcclxuXHR0aGlzLmJib3ggXHRcdFx0PSBwYXJhbXMuYmJveDtcclxuXHR0aGlzLmNsb25lIFx0XHRcdD0gcGFyYW1zLmNsb25lO1xyXG5cdHRoaXMuZ2x5cGhNZW1iZXJzIFx0PSBwYXJhbXMuZ2x5cGhNZW1iZXJzIHx8IFtdOyAvLyBjYXNlIG9mIGNvbXBsZXgsIGNhbiBoYXZlIGFyYml0cmFyeSBsaXN0IG9mIG5lc3RlZCBnbHlwaHNcclxuXHR0aGlzLnBvcnRzIFx0XHRcdD0gcGFyYW1zLnBvcnRzIHx8IFtdO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnbGFiZWwnLCAnc3RhdGUnLCAnYmJveCcsICdjbG9uZScsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnZ2x5cGgnO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5HbHlwaC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5HbHlwaDtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG5cdHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5zZXRCYm94ID0gZnVuY3Rpb24gKGJib3gpIHtcclxuXHR0aGlzLmJib3ggPSBiYm94O1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLnNldENsb25lID0gZnVuY3Rpb24gKGNsb25lKSB7XHJcblx0dGhpcy5jbG9uZSA9IGNsb25lO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLmFkZEdseXBoTWVtYmVyID0gZnVuY3Rpb24gKGdseXBoTWVtYmVyKSB7XHJcblx0dGhpcy5nbHlwaE1lbWJlcnMucHVzaChnbHlwaE1lbWJlcik7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkUG9ydCA9IGZ1bmN0aW9uIChwb3J0KSB7XHJcblx0dGhpcy5wb3J0cy5wdXNoKHBvcnQpO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBnbHlwaCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2dseXBoJyk7XHJcblx0Ly8gYXR0cmlidXRlc1xyXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy5jbGFzc18pO1xyXG5cdH1cclxuXHRpZih0aGlzLmNvbXBhcnRtZW50UmVmICE9IG51bGwpIHtcclxuXHRcdGdseXBoLnNldEF0dHJpYnV0ZSgnY29tcGFydG1lbnRSZWYnLCB0aGlzLmNvbXBhcnRtZW50UmVmKTtcclxuXHR9XHJcblx0Ly8gY2hpbGRyZW5cclxuXHRpZih0aGlzLmxhYmVsICE9IG51bGwpIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMubGFiZWwuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmKHRoaXMuc3RhdGUgIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5zdGF0ZS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYodGhpcy5iYm94ICE9IG51bGwpIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMuYmJveC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYodGhpcy5jbG9uZSAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmNsb25lLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhNZW1iZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmdseXBoTWVtYmVyc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLnBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLnBvcnRzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHR0aGlzLmJhc2VUb1htbE9iaihnbHlwaCk7XHJcblx0cmV0dXJuIGdseXBoO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuR2x5cGguZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2dseXBoJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnbHlwaCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGdseXBoID0gbmV3IG5zLkdseXBoKCk7XHJcblx0Z2x5cGguaWQgXHRcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0Z2x5cGguY2xhc3NfIFx0XHRcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcclxuXHRnbHlwaC5jb21wYXJ0bWVudFJlZiBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY29tcGFydG1lbnRSZWYnKTtcclxuXHJcblx0dmFyIGxhYmVsWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsYWJlbCcpWzBdO1xyXG5cdGlmIChsYWJlbFhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgbGFiZWwgPSBucy5MYWJlbC5mcm9tWE1MKGxhYmVsWE1MKTtcclxuXHRcdGdseXBoLnNldExhYmVsKGxhYmVsKTtcclxuXHR9XHJcblx0dmFyIHN0YXRlWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGF0ZScpWzBdO1xyXG5cdGlmIChzdGF0ZVhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgc3RhdGUgPSBucy5TdGF0ZVR5cGUuZnJvbVhNTChzdGF0ZVhNTCk7XHJcblx0XHRnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XHJcblx0fVxyXG5cdHZhciBiYm94WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYm94JylbMF07XHJcblx0aWYgKGJib3hYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIGJib3ggPSBucy5CYm94LmZyb21YTUwoYmJveFhNTCk7XHJcblx0XHRnbHlwaC5zZXRCYm94KGJib3gpO1xyXG5cdH1cclxuXHR2YXIgY2xvbmVYTWwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Nsb25lJylbMF07XHJcblx0aWYgKGNsb25lWE1sICE9IG51bGwpIHtcclxuXHRcdHZhciBjbG9uZSA9IG5zLkNsb25lVHlwZS5mcm9tWE1MKGNsb25lWE1sKTtcclxuXHRcdGdseXBoLnNldENsb25lKGNsb25lKTtcclxuXHR9XHJcblx0Ly8gbmVlZCBzcGVjaWFsIGNhcmUgYmVjYXVzZSBvZiByZWN1cnNpb24gb2YgbmVzdGVkIGdseXBoIG5vZGVzXHJcblx0Ly8gdGFrZSBvbmx5IGZpcnN0IGxldmVsIGdseXBoc1xyXG5cdHZhciBjaGlsZHJlbiA9IHhtbE9iai5jaGlsZHJlbjtcclxuXHRmb3IgKHZhciBqPTA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykgeyAvLyBsb29wIHRocm91Z2ggYWxsIGZpcnN0IGxldmVsIGNoaWxkcmVuXHJcblx0XHR2YXIgY2hpbGQgPSBjaGlsZHJlbltqXTtcclxuXHRcdGlmIChjaGlsZC50YWdOYW1lID09IFwiZ2x5cGhcIikgeyAvLyBoZXJlIHdlIG9ubHkgd2FudCB0aGUgZ2x5aCBjaGlsZHJlblxyXG5cdFx0XHR2YXIgZ2x5cGhNZW1iZXIgPSBucy5HbHlwaC5mcm9tWE1MKGNoaWxkKTsgLy8gcmVjdXJzaXZlIGNhbGwgb24gbmVzdGVkIGdseXBoXHJcblx0XHRcdGdseXBoLmFkZEdseXBoTWVtYmVyKGdseXBoTWVtYmVyKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIHBvcnRzWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwb3J0Jyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgcG9ydHNYTUwubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBwb3J0ID0gbnMuUG9ydC5mcm9tWE1MKHBvcnRzWE1MW2ldKTtcclxuXHRcdGdseXBoLmFkZFBvcnQocG9ydCk7XHJcblx0fVxyXG5cdGdseXBoLmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIGdseXBoO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBHTFlQSCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIExBQkVMIC0tLS0tLS1cclxubnMuTGFiZWwgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndGV4dCddKTtcclxuXHR0aGlzLnRleHQgPSBwYXJhbXMudGV4dDtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnbGFiZWwnO1xyXG59O1xyXG5cclxubnMuTGFiZWwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5MYWJlbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5MYWJlbDtcclxuXHJcbm5zLkxhYmVsLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbGFiZWwgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG5cdGlmKHRoaXMudGV4dCAhPSBudWxsKSB7XHJcblx0XHRsYWJlbC5zZXRBdHRyaWJ1dGUoJ3RleHQnLCB0aGlzLnRleHQpO1xyXG5cdH1cclxuXHR0aGlzLmJhc2VUb1htbE9iaihsYWJlbCk7XHJcblx0cmV0dXJuIGxhYmVsO1xyXG59O1xyXG5cclxubnMuTGFiZWwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuTGFiZWwuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2xhYmVsJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBsYWJlbCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGxhYmVsID0gbmV3IG5zLkxhYmVsKCk7XHJcblx0bGFiZWwudGV4dCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3RleHQnKTtcclxuXHRsYWJlbC5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBsYWJlbDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgTEFCRUwgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBCQk9YIC0tLS0tLS1cclxubnMuQmJveCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knLCAndycsICdoJ10pO1xyXG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xyXG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xyXG5cdHRoaXMudyA9IHBhcnNlRmxvYXQocGFyYW1zLncpO1xyXG5cdHRoaXMuaCA9IHBhcnNlRmxvYXQocGFyYW1zLmgpO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdiYm94JztcclxufTtcclxuXHJcbm5zLkJib3gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5CYm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkJib3g7XHJcblxyXG5ucy5CYm94LnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgYmJveCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2Jib3gnKTtcclxuXHRpZighaXNOYU4odGhpcy54KSkge1xyXG5cdFx0YmJveC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy55KSkge1xyXG5cdFx0YmJveC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy53KSkge1xyXG5cdFx0YmJveC5zZXRBdHRyaWJ1dGUoJ3cnLCB0aGlzLncpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy5oKSkge1xyXG5cdFx0YmJveC5zZXRBdHRyaWJ1dGUoJ2gnLCB0aGlzLmgpO1xyXG5cdH1cclxuXHR0aGlzLmJhc2VUb1htbE9iaihiYm94KTtcclxuXHRyZXR1cm4gYmJveDtcclxufVxyXG5cclxubnMuQmJveC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5CYm94LmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdiYm94Jykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBiYm94LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgYmJveCA9IG5ldyBucy5CYm94KCk7XHJcblx0YmJveC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xyXG5cdGJib3gueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcclxuXHRiYm94LncgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3cnKSk7XHJcblx0YmJveC5oID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCdoJykpO1xyXG5cdGJib3guYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gYmJveDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgQkJPWCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFNUQVRFIC0tLS0tLS1cclxubnMuU3RhdGVUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndmFsdWUnLCAndmFyaWFibGUnXSk7XHJcblx0dGhpcy52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuXHR0aGlzLnZhcmlhYmxlID0gcGFyYW1zLnZhcmlhYmxlO1xyXG59O1xyXG5cclxubnMuU3RhdGVUeXBlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc3RhdGUgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzdGF0ZScpO1xyXG5cdGlmKHRoaXMudmFsdWUgIT0gbnVsbCkge1xyXG5cdFx0c3RhdGUuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudmFsdWUpO1xyXG5cdH1cclxuXHRpZih0aGlzLnZhcmlhYmxlICE9IG51bGwpIHtcclxuXHRcdHN0YXRlLnNldEF0dHJpYnV0ZSgndmFyaWFibGUnLCB0aGlzLnZhcmlhYmxlKTtcclxuXHR9XHJcblx0cmV0dXJuIHN0YXRlO1xyXG59O1xyXG5cclxubnMuU3RhdGVUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlN0YXRlVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhdGUnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHN0YXRlLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgc3RhdGUgPSBuZXcgbnMuU3RhdGVUeXBlKCk7XHJcblx0c3RhdGUudmFsdWUgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xyXG5cdHN0YXRlLnZhcmlhYmxlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFyaWFibGUnKTtcclxuXHRyZXR1cm4gc3RhdGU7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFNUQVRFIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gQ0xPTkUgLS0tLS0tLVxyXG5ucy5DbG9uZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydsYWJlbCddKTtcclxuXHR0aGlzLmxhYmVsID0gcGFyYW1zLmxhYmVsO1xyXG59O1xyXG5cclxubnMuQ2xvbmVUeXBlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgY2xvbmUgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdjbG9uZScpO1xyXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xyXG5cdFx0Y2xvbmUuc2V0QXR0cmlidXRlKCdsYWJlbCcsIHRoaXMubGFiZWwpO1xyXG5cdH1cclxuXHRyZXR1cm4gY2xvbmU7XHJcbn07XHJcblxyXG5ucy5DbG9uZVR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuQ2xvbmVUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdjbG9uZScpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgY2xvbmUsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBjbG9uZSA9IG5ldyBucy5DbG9uZVR5cGUoKTtcclxuXHRjbG9uZS5sYWJlbCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XHJcblx0cmV0dXJuIGNsb25lO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBDTE9ORSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFBPUlQgLS0tLS0tLVxyXG5ucy5Qb3J0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ3gnLCAneSddKTtcclxuXHR0aGlzLmlkID0gcGFyYW1zLmlkO1xyXG5cdHRoaXMueCBcdD0gcGFyc2VGbG9hdChwYXJhbXMueCk7XHJcblx0dGhpcy55IFx0PSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAncG9ydCc7XHJcbn07XHJcblxyXG5ucy5Qb3J0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuUG9ydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5Qb3J0O1xyXG5cclxubnMuUG9ydC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHBvcnQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdwb3J0Jyk7XHJcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRwb3J0LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcclxuXHRcdHBvcnQuc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcclxuXHRcdHBvcnQuc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcclxuXHR9XHJcblx0dGhpcy5iYXNlVG9YbWxPYmoocG9ydCk7XHJcblx0cmV0dXJuIHBvcnQ7XHJcbn07XHJcblxyXG5ucy5Qb3J0LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlBvcnQuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3BvcnQnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHBvcnQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBwb3J0ID0gbmV3IG5zLlBvcnQoKTtcclxuXHRwb3J0LnggXHQ9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcclxuXHRwb3J0LnkgXHQ9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcclxuXHRwb3J0LmlkID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRwb3J0LmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIHBvcnQ7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFBPUlQgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBBUkMgLS0tLS0tLVxyXG5ucy5BcmMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ3NvdXJjZScsICd0YXJnZXQnLCAnc3RhcnQnLCAnZW5kJywgJ25leHRzJywgJ2dseXBocyddKTtcclxuXHR0aGlzLmlkIFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy5jbGFzc18gPSBwYXJhbXMuY2xhc3NfO1xyXG5cdHRoaXMuc291cmNlID0gcGFyYW1zLnNvdXJjZTtcclxuXHR0aGlzLnRhcmdldCA9IHBhcmFtcy50YXJnZXQ7XHJcblxyXG5cdHRoaXMuc3RhcnQgXHQ9IHBhcmFtcy5zdGFydDtcclxuXHR0aGlzLmVuZCBcdD0gcGFyYW1zLmVuZDtcclxuXHR0aGlzLm5leHRzIFx0PSBwYXJhbXMubmV4dHMgfHwgW107XHJcblx0dGhpcy5nbHlwaHMgPSBwYXJhbXMuZ2x5cGhzIHx8wqBbXTtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbJ3N0YXJ0JywgJ25leHRzJywgJ2VuZCcsICdnbHlwaHMnXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnYXJjJztcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLkFyYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5BcmM7XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLnNldFN0YXJ0ID0gZnVuY3Rpb24gKHN0YXJ0KSB7XHJcblx0dGhpcy5zdGFydCA9IHN0YXJ0O1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS5zZXRFbmQgPSBmdW5jdGlvbiAoZW5kKSB7XHJcblx0dGhpcy5lbmQgPSBlbmQ7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLmFkZE5leHQgPSBmdW5jdGlvbiAobmV4dCkge1xyXG5cdHRoaXMubmV4dHMucHVzaChuZXh0KTtcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUuYWRkR2x5cGggPSBmdW5jdGlvbiAoZ2x5cGgpIHtcclxuXHR0aGlzLmdseXBocy5wdXNoKGdseXBoKTtcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGFyYyA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2FyYycpO1xyXG5cdC8vIGF0dHJpYnV0ZXNcclxuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdGFyYy5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmKHRoaXMuY2xhc3NfICE9IG51bGwpIHtcclxuXHRcdGFyYy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy5jbGFzc18pO1xyXG5cdH1cclxuXHRpZih0aGlzLnNvdXJjZSAhPSBudWxsKSB7XHJcblx0XHRhcmMuc2V0QXR0cmlidXRlKCdzb3VyY2UnLCB0aGlzLnNvdXJjZSk7XHJcblx0fVxyXG5cdGlmKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcclxuXHRcdGFyYy5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsIHRoaXMudGFyZ2V0KTtcclxuXHR9XHJcblx0Ly8gY2hpbGRyZW5cclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRhcmMuYXBwZW5kQ2hpbGQodGhpcy5nbHlwaHNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmKHRoaXMuc3RhcnQgIT0gbnVsbCkge1xyXG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMuc3RhcnQuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5uZXh0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMubmV4dHNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmKHRoaXMuZW5kICE9IG51bGwpIHtcclxuXHRcdGFyYy5hcHBlbmRDaGlsZCh0aGlzLmVuZC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0dGhpcy5iYXNlVG9YbWxPYmooYXJjKTtcclxuXHRyZXR1cm4gYXJjO1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkFyYy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnYXJjJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBhcmMsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBhcmMgPSBuZXcgbnMuQXJjKCk7XHJcblx0YXJjLmlkIFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0YXJjLmNsYXNzXyBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcclxuXHRhcmMuc291cmNlIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcclxuXHRhcmMudGFyZ2V0IFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcclxuXHJcblx0dmFyIHN0YXJ0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGFydCcpWzBdO1xyXG5cdGlmIChzdGFydFhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgc3RhcnQgPSBucy5TdGFydFR5cGUuZnJvbVhNTChzdGFydFhNTCk7XHJcblx0XHRhcmMuc2V0U3RhcnQoc3RhcnQpO1xyXG5cdH1cclxuXHR2YXIgbmV4dFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IG5leHRYTUwubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBuZXh0ID0gbnMuTmV4dFR5cGUuZnJvbVhNTChuZXh0WE1MW2ldKTtcclxuXHRcdGFyYy5hZGROZXh0KG5leHQpO1xyXG5cdH1cclxuXHR2YXIgZW5kWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdlbmQnKVswXTtcclxuXHRpZiAoZW5kWE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBlbmQgPSBucy5FbmRUeXBlLmZyb21YTUwoZW5kWE1MKTtcclxuXHRcdGFyYy5zZXRFbmQoZW5kKTtcclxuXHR9XHJcblx0dmFyIGdseXBoc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZ2x5cGgnKTtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBnbHlwaHNYTUwubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBnbHlwaCA9IG5zLkdseXBoLmZyb21YTUwoZ2x5cGhzWE1MW2ldKTtcclxuXHRcdGFyYy5hZGRHbHlwaChnbHlwaCk7XHJcblx0fVxyXG5cclxuXHRhcmMuYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gYXJjO1xyXG59O1xyXG5cclxuLy8gLS0tLS0tLSBFTkQgQVJDIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gU1RBUlRUWVBFIC0tLS0tLS1cclxubnMuU3RhcnRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xyXG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xyXG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xyXG59O1xyXG5cclxubnMuU3RhcnRUeXBlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc3RhcnQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzdGFydCcpO1xyXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XHJcblx0XHRzdGFydC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy55KSkge1xyXG5cdFx0c3RhcnQuc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0YXJ0O1xyXG59O1xyXG5cclxubnMuU3RhcnRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlN0YXJ0VHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhcnQnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHN0YXJ0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgc3RhcnQgPSBuZXcgbnMuU3RhcnRUeXBlKCk7XHJcblx0c3RhcnQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcclxuXHRzdGFydC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xyXG5cdHJldHVybiBzdGFydDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgU1RBUlRUWVBFIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gRU5EVFlQRSAtLS0tLS0tXHJcbm5zLkVuZFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XHJcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XHJcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XHJcbn07XHJcblxyXG5ucy5FbmRUeXBlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZW5kID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZW5kJyk7XHJcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcclxuXHRcdGVuZC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy55KSkge1xyXG5cdFx0ZW5kLnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XHJcblx0fVxyXG5cdHJldHVybiBlbmQ7XHJcbn07XHJcblxyXG5ucy5FbmRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkVuZFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2VuZCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZW5kLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgZW5kID0gbmV3IG5zLkVuZFR5cGUoKTtcclxuXHRlbmQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcclxuXHRlbmQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcclxuXHRyZXR1cm4gZW5kO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBFTkRUWVBFIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gTkVYVFRZUEUgLS0tLS0tLVxyXG5ucy5OZXh0VHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcclxuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcclxuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcclxufTtcclxuXHJcbm5zLk5leHRUeXBlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbmV4dCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ25leHQnKTtcclxuXHRpZighaXNOYU4odGhpcy54KSkge1xyXG5cdFx0bmV4dC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy55KSkge1xyXG5cdFx0bmV4dC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV4dDtcclxufTtcclxuXHJcbm5zLk5leHRUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLk5leHRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICduZXh0Jykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBuZXh0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgbmV4dCA9IG5ldyBucy5OZXh0VHlwZSgpO1xyXG5cdG5leHQueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcclxuXHRuZXh0LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XHJcblx0cmV0dXJuIG5leHQ7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIE5FWFRUWVBFIC0tLS0tLS1cclxuXHJcbm5zLnJlbmRlckV4dGVuc2lvbiA9IHJlbmRlckV4dDtcclxuLy9ucy5hbm5vdGF0aW9uc0V4dGVuc2lvbiA9IGFubm90RXh0O1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsInZhciBucyA9IHt9O1xyXG5cclxuLypcclxuXHRndWFyYW50ZWVzIHRvIHJldHVybiBhbiBvYmplY3Qgd2l0aCBnaXZlbiBhcmdzIGJlaW5nIHNldCB0byBudWxsIGlmIG5vdCBwcmVzZW50LCBvdGhlciBhcmdzIHJldHVybmVkIGFzIGlzXHJcbiovXHJcbm5zLmNoZWNrUGFyYW1zID0gZnVuY3Rpb24gKHBhcmFtcywgbmFtZXMpIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PSBcInVuZGVmaW5lZFwiIHx8IHBhcmFtcyA9PSBudWxsKSB7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgIT0gJ29iamVjdCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbXMuIE9iamVjdCB3aXRoIG5hbWVkIHBhcmFtZXRlcnMgbXVzdCBiZSBwYXNzZWQuXCIpO1xyXG5cdH1cclxuXHRmb3IodmFyIGk9MDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgYXJnTmFtZSA9IG5hbWVzW2ldO1xyXG5cdFx0aWYgKHR5cGVvZiBwYXJhbXNbYXJnTmFtZV0gPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cGFyYW1zW2FyZ05hbWVdID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHBhcmFtcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuczsiLCIvKipcbiogcHJldHR5LWRhdGEgLSBub2RlanMgcGx1Z2luIHRvIHByZXR0eS1wcmludCBvciBtaW5pZnkgZGF0YSBpbiBYTUwsIEpTT04gYW5kIENTUyBmb3JtYXRzLlxuKiAgXG4qIFZlcnNpb24gLSAwLjQwLjBcbiogQ29weXJpZ2h0IChjKSAyMDEyIFZhZGltIEtpcnl1a2hpblxuKiB2a2lyeXVraGluIEAgZ21haWwuY29tXG4qIGh0dHA6Ly93d3cuZXNsaW5zdHJ1Y3Rvci5uZXQvcHJldHR5LWRhdGEvXG4qIFxuKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlczpcbiogICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuKiAgIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwuaHRtbFxuKlxuKlx0cGQueG1sKGRhdGEgKSAtIHByZXR0eSBwcmludCBYTUw7XG4qXHRwZC5qc29uKGRhdGEpIC0gcHJldHR5IHByaW50IEpTT047XG4qXHRwZC5jc3MoZGF0YSApIC0gcHJldHR5IHByaW50IENTUztcbipcdHBkLnNxbChkYXRhKSAgLSBwcmV0dHkgcHJpbnQgU1FMO1xuKlxuKlx0cGQueG1sbWluKGRhdGEgWywgcHJlc2VydmVDb21tZW50c10gKSAtIG1pbmlmeSBYTUw7IFxuKlx0cGQuanNvbm1pbihkYXRhKSAgICAgICAgICAgICAgICAgICAgICAtIG1pbmlmeSBKU09OOyBcbipcdHBkLmNzc21pbihkYXRhIFssIHByZXNlcnZlQ29tbWVudHNdICkgLSBtaW5pZnkgQ1NTOyBcbipcdHBkLnNxbG1pbihkYXRhKSAgICAgICAgICAgICAgICAgICAgICAgLSBtaW5pZnkgU1FMOyBcbipcbiogUEFSQU1FVEVSUzpcbipcbipcdEBkYXRhICBcdFx0XHQtIFN0cmluZzsgWE1MLCBKU09OLCBDU1Mgb3IgU1FMIHRleHQgdG8gYmVhdXRpZnk7XG4qIFx0QHByZXNlcnZlQ29tbWVudHNcdC0gQm9vbCAob3B0aW9uYWwsIHVzZWQgaW4gbWlueG1sIGFuZCBtaW5jc3Mgb25seSk7IFxuKlx0XHRcdFx0ICBTZXQgdGhpcyBmbGFnIHRvIHRydWUgdG8gcHJldmVudCByZW1vdmluZyBjb21tZW50cyBmcm9tIEB0ZXh0OyBcbipcdEBSZXR1cm4gXHRcdC0gU3RyaW5nO1xuKlx0XG4qIFVTQUdFOlxuKlx0XG4qXHR2YXIgcGQgID0gcmVxdWlyZSgncHJldHR5LWRhdGEnKS5wZDtcbipcbipcdHZhciB4bWxfcHAgICA9IHBkLnhtbCh4bWxfdGV4dCk7XG4qXHR2YXIgeG1sX21pbiAgPSBwZC54bWxtaW4oeG1sX3RleHQgWyx0cnVlXSk7XG4qXHR2YXIganNvbl9wcCAgPSBwZC5qc29uKGpzb25fdGV4dCk7XG4qXHR2YXIganNvbl9taW4gPSBwZC5qc29ubWluKGpzb25fdGV4dCk7XG4qXHR2YXIgY3NzX3BwICAgPSBwZC5jc3MoY3NzX3RleHQpO1xuKlx0dmFyIGNzc19taW4gID0gcGQuY3NzbWluKGNzc190ZXh0IFssIHRydWVdKTtcbipcdHZhciBzcWxfcHAgICA9IHBkLnNxbChzcWxfdGV4dCk7XG4qXHR2YXIgc3FsX21pbiAgPSBwZC5zcWxtaW4oc3FsX3RleHQpO1xuKlxuKiBURVNUOlxuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X3htbFxuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X2pzb25cbipcdGNvbXAtbmFtZTpwcmV0dHktZGF0YSQgbm9kZSAuL3Rlc3QvdGVzdF9jc3NcbipcdGNvbXAtbmFtZTpwcmV0dHktZGF0YSQgbm9kZSAuL3Rlc3QvdGVzdF9zcWxcbiovXG5cblxuZnVuY3Rpb24gcHAoKSB7XG5cdHRoaXMuc2hpZnQgPSBbJ1xcbiddOyAvLyBhcnJheSBvZiBzaGlmdHNcblx0dGhpcy5zdGVwID0gJyAgJywgLy8gMiBzcGFjZXNcblx0XHRtYXhkZWVwID0gMTAwLCAvLyBuZXN0aW5nIGxldmVsXG5cdFx0aXggPSAwO1xuXG5cdC8vIGluaXRpYWxpemUgYXJyYXkgd2l0aCBzaGlmdHMgLy9cblx0Zm9yKGl4PTA7aXg8bWF4ZGVlcDtpeCsrKXtcblx0XHR0aGlzLnNoaWZ0LnB1c2godGhpcy5zaGlmdFtpeF0rdGhpcy5zdGVwKTsgXG5cdH1cblxufTtcdFxuXHRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFhNTCBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucHAucHJvdG90eXBlLnhtbCA9IGZ1bmN0aW9uKHRleHQpIHtcblxuXHR2YXIgYXIgPSB0ZXh0LnJlcGxhY2UoLz5cXHN7MCx9PC9nLFwiPjxcIilcblx0XHRcdFx0IC5yZXBsYWNlKC88L2csXCJ+Ojp+PFwiKVxuXHRcdFx0XHQgLnJlcGxhY2UoL3htbG5zXFw6L2csXCJ+Ojp+eG1sbnM6XCIpXG5cdFx0XHRcdCAucmVwbGFjZSgveG1sbnNcXD0vZyxcIn46On54bWxucz1cIilcblx0XHRcdFx0IC5zcGxpdCgnfjo6ficpLFxuXHRcdGxlbiA9IGFyLmxlbmd0aCxcblx0XHRpbkNvbW1lbnQgPSBmYWxzZSxcblx0XHRkZWVwID0gMCxcblx0XHRzdHIgPSAnJyxcblx0XHRpeCA9IDA7XG5cblx0XHRmb3IoaXg9MDtpeDxsZW47aXgrKykge1xuXHRcdFx0Ly8gc3RhcnQgY29tbWVudCBvciA8IVtDREFUQVsuLi5dXT4gb3IgPCFET0NUWVBFIC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88IS8pID4gLTEpIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcblx0XHRcdFx0aW5Db21tZW50ID0gdHJ1ZTsgXG5cdFx0XHRcdC8vIGVuZCBjb21tZW50ICBvciA8IVtDREFUQVsuLi5dXT4gLy9cblx0XHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvLS0+LykgPiAtMSB8fCBhcltpeF0uc2VhcmNoKC9cXF0+LykgPiAtMSB8fCBhcltpeF0uc2VhcmNoKC8hRE9DVFlQRS8pID4gLTEgKSB7IFxuXHRcdFx0XHRcdGluQ29tbWVudCA9IGZhbHNlOyBcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gZW5kIGNvbW1lbnQgIG9yIDwhW0NEQVRBWy4uLl1dPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvLS0+LykgPiAtMSB8fCBhcltpeF0uc2VhcmNoKC9cXF0+LykgPiAtMSkgeyBcblx0XHRcdFx0c3RyICs9IGFyW2l4XTtcblx0XHRcdFx0aW5Db21tZW50ID0gZmFsc2U7IFxuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gPGVsbT48L2VsbT4gLy9cblx0XHRcdGlmKCAvXjxcXHcvLmV4ZWMoYXJbaXgtMV0pICYmIC9ePFxcL1xcdy8uZXhlYyhhcltpeF0pICYmXG5cdFx0XHRcdC9ePFtcXHc6XFwtXFwuXFwsXSsvLmV4ZWMoYXJbaXgtMV0pID09IC9ePFxcL1tcXHc6XFwtXFwuXFwsXSsvLmV4ZWMoYXJbaXhdKVswXS5yZXBsYWNlKCcvJywnJykpIHsgXG5cdFx0XHRcdHN0ciArPSBhcltpeF07XG5cdFx0XHRcdGlmKCFpbkNvbW1lbnQpIGRlZXAtLTtcblx0XHRcdH0gZWxzZVxuXHRcdFx0IC8vIDxlbG0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88XFx3LykgPiAtMSAmJiBhcltpeF0uc2VhcmNoKC88XFwvLykgPT0gLTEgJiYgYXJbaXhdLnNlYXJjaCgvXFwvPi8pID09IC0xICkge1xuXHRcdFx0XHRzdHIgPSAhaW5Db21tZW50ID8gc3RyICs9IHRoaXMuc2hpZnRbZGVlcCsrXSthcltpeF0gOiBzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0IC8vIDxlbG0+Li4uPC9lbG0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88XFx3LykgPiAtMSAmJiBhcltpeF0uc2VhcmNoKC88XFwvLykgPiAtMSkge1xuXHRcdFx0XHRzdHIgPSAhaW5Db21tZW50ID8gc3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDwvZWxtPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvPFxcLy8pID4gLTEpIHsgXG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFstLWRlZXBdK2FyW2l4XSA6IHN0ciArPSBhcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyA8ZWxtLz4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goL1xcLz4vKSA+IC0xICkgeyBcblx0XHRcdFx0c3RyID0gIWluQ29tbWVudCA/IHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XSA6IHN0ciArPSBhcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyA8PyB4bWwgLi4uID8+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88XFw/LykgPiAtMSkgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8geG1sbnMgLy9cblx0XHRcdGlmKCBhcltpeF0uc2VhcmNoKC94bWxuc1xcOi8pID4gLTEgIHx8IGFyW2l4XS5zZWFyY2goL3htbG5zXFw9LykgPiAtMSkgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0fSBcblx0XHRcdFxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHN0ciArPSBhcltpeF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRyZXR1cm4gIChzdHJbMF0gPT0gJ1xcbicpID8gc3RyLnNsaWNlKDEpIDogc3RyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBKU09OIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUuanNvbiA9IGZ1bmN0aW9uKHRleHQpIHtcblxuXHRpZiAoIHR5cGVvZiB0ZXh0ID09PSBcInN0cmluZ1wiICkge1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKHRleHQpLCBudWxsLCB0aGlzLnN0ZXApO1xuXHR9XG5cdGlmICggdHlwZW9mIHRleHQgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRleHQsIG51bGwsIHRoaXMuc3RlcCk7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIENTUyBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucHAucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHRleHQpIHtcblxuXHR2YXIgYXIgPSB0ZXh0LnJlcGxhY2UoL1xcc3sxLH0vZywnICcpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXHsvZyxcInt+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXH0vZyxcIn46On59fjo6flwiKVxuXHRcdFx0XHQucmVwbGFjZSgvXFw7L2csXCI7fjo6flwiKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwvXFwqL2csXCJ+Ojp+LypcIilcblx0XHRcdFx0LnJlcGxhY2UoL1xcKlxcLy9nLFwiKi9+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9+Ojp+XFxzezAsfX46On4vZyxcIn46On5cIilcblx0XHRcdFx0LnNwbGl0KCd+Ojp+JyksXG5cdFx0bGVuID0gYXIubGVuZ3RoLFxuXHRcdGRlZXAgPSAwLFxuXHRcdHN0ciA9ICcnLFxuXHRcdGl4ID0gMDtcblx0XHRcblx0XHRmb3IoaXg9MDtpeDxsZW47aXgrKykge1xuXG5cdFx0XHRpZiggL1xcey8uZXhlYyhhcltpeF0pKSAgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcCsrXSthcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHRpZiggL1xcfS8uZXhlYyhhcltpeF0pKSAgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbLS1kZWVwXSthcltpeF07XG5cdFx0XHR9IGVsc2Vcblx0XHRcdGlmKCAvXFwqXFxcXC8uZXhlYyhhcltpeF0pKSAgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxuezEsfS8sJycpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTUUwgc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGlzU3VicXVlcnkoc3RyLCBwYXJlbnRoZXNpc0xldmVsKSB7XG4gIHJldHVybiAgcGFyZW50aGVzaXNMZXZlbCAtIChzdHIucmVwbGFjZSgvXFwoL2csJycpLmxlbmd0aCAtIHN0ci5yZXBsYWNlKC9cXCkvZywnJykubGVuZ3RoIClcbn1cblxuZnVuY3Rpb24gc3BsaXRfc3FsKHN0ciwgdGFiKSB7XG5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcc3sxLH0vZyxcIiBcIilcblxuICAgICAgICAucmVwbGFjZSgvIEFORCAvaWcsXCJ+Ojp+XCIrdGFiK3RhYitcIkFORCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBCRVRXRUVOIC9pZyxcIn46On5cIit0YWIrXCJCRVRXRUVOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIENBU0UgL2lnLFwifjo6flwiK3RhYitcIkNBU0UgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gRUxTRSAvaWcsXCJ+Ojp+XCIrdGFiK1wiRUxTRSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBFTkQgL2lnLFwifjo6flwiK3RhYitcIkVORCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBGUk9NIC9pZyxcIn46On5GUk9NIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEdST1VQXFxzezEsfUJZL2lnLFwifjo6fkdST1VQIEJZIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEhBVklORyAvaWcsXCJ+Ojp+SEFWSU5HIFwiKVxuICAgICAgICAvLy5yZXBsYWNlKC8gSU4gL2lnLFwifjo6flwiK3RhYitcIklOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIElOIC9pZyxcIiBJTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBKT0lOIC9pZyxcIn46On5KT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIENST1NTfjo6fnsxLH1KT0lOIC9pZyxcIn46On5DUk9TUyBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIElOTkVSfjo6fnsxLH1KT0lOIC9pZyxcIn46On5JTk5FUiBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIExFRlR+Ojp+ezEsfUpPSU4gL2lnLFwifjo6fkxFRlQgSk9JTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBSSUdIVH46On57MSx9Sk9JTiAvaWcsXCJ+Ojp+UklHSFQgSk9JTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBPTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiT04gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gT1IgL2lnLFwifjo6flwiK3RhYit0YWIrXCJPUiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBPUkRFUlxcc3sxLH1CWS9pZyxcIn46On5PUkRFUiBCWSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBPVkVSIC9pZyxcIn46On5cIit0YWIrXCJPVkVSIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFwoXFxzezAsfVNFTEVDVCAvaWcsXCJ+Ojp+KFNFTEVDVCBcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcKVxcc3swLH1TRUxFQ1QgL2lnLFwiKX46On5TRUxFQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gVEhFTiAvaWcsXCIgVEhFTn46On5cIit0YWIrXCJcIilcbiAgICAgICAgLnJlcGxhY2UoLyBVTklPTiAvaWcsXCJ+Ojp+VU5JT05+Ojp+XCIpXG4gICAgICAgIC5yZXBsYWNlKC8gVVNJTkcgL2lnLFwifjo6flVTSU5HIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFdIRU4gL2lnLFwifjo6flwiK3RhYitcIldIRU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gV0hFUkUgL2lnLFwifjo6fldIRVJFIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFdJVEggL2lnLFwifjo6fldJVEggXCIpXG4gICAgICAgIC8vLnJlcGxhY2UoL1xcLFxcc3swLH1cXCgvaWcsXCIsfjo6figgXCIpXG4gICAgICAgIC8vLnJlcGxhY2UoL1xcLC9pZyxcIix+Ojp+XCIrdGFiK3RhYitcIlwiKVxuICAgICAgICAucmVwbGFjZSgvIEFMTCAvaWcsXCIgQUxMIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEFTIC9pZyxcIiBBUyBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBBU0MgL2lnLFwiIEFTQyBcIikgXG4gICAgICAgIC5yZXBsYWNlKC8gREVTQyAvaWcsXCIgREVTQyBcIikgXG4gICAgICAgIC5yZXBsYWNlKC8gRElTVElOQ1QgL2lnLFwiIERJU1RJTkNUIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEVYSVNUUyAvaWcsXCIgRVhJU1RTIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE5PVCAvaWcsXCIgTk9UIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE5VTEwgL2lnLFwiIE5VTEwgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTElLRSAvaWcsXCIgTElLRSBcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcc3swLH1TRUxFQ1QgL2lnLFwiU0VMRUNUIFwiKVxuICAgICAgICAucmVwbGFjZSgvfjo6fnsxLH0vZyxcIn46On5cIilcbiAgICAgICAgLnNwbGl0KCd+Ojp+Jyk7XG59XG5cbnBwLnByb3RvdHlwZS5zcWwgPSBmdW5jdGlvbih0ZXh0KSB7XG5cbiAgICB2YXIgYXJfYnlfcXVvdGUgPSB0ZXh0LnJlcGxhY2UoL1xcc3sxLH0vZyxcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCcvaWcsXCJ+Ojp+XFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJ346On4nKSxcbiAgICAgICAgbGVuID0gYXJfYnlfcXVvdGUubGVuZ3RoLFxuICAgICAgICBhciA9IFtdLFxuICAgICAgICBkZWVwID0gMCxcbiAgICAgICAgdGFiID0gdGhpcy5zdGVwLC8vK3RoaXMuc3RlcCxcbiAgICAgICAgaW5Db21tZW50ID0gdHJ1ZSxcbiAgICAgICAgaW5RdW90ZSA9IGZhbHNlLFxuICAgICAgICBwYXJlbnRoZXNpc0xldmVsID0gMCxcbiAgICAgICAgc3RyID0gJycsXG4gICAgICAgIGl4ID0gMDtcblxuICAgIGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cbiAgICAgICAgaWYoaXglMikge1xuICAgICAgICAgICAgYXIgPSBhci5jb25jYXQoYXJfYnlfcXVvdGVbaXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyID0gYXIuY29uY2F0KHNwbGl0X3NxbChhcl9ieV9xdW90ZVtpeF0sIHRhYikgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlbiA9IGFyLmxlbmd0aDtcbiAgICBmb3IoaXg9MDtpeDxsZW47aXgrKykge1xuXG4gICAgICAgIHBhcmVudGhlc2lzTGV2ZWwgPSBpc1N1YnF1ZXJ5KGFyW2l4XSwgcGFyZW50aGVzaXNMZXZlbCk7XG5cbiAgICAgICAgaWYoIC9cXHN7MCx9XFxzezAsfVNFTEVDVFxcc3swLH0vLmV4ZWMoYXJbaXhdKSkgIHsgXG4gICAgICAgICAgICBhcltpeF0gPSBhcltpeF0ucmVwbGFjZSgvXFwsL2csXCIsXFxuXCIrdGFiK3RhYitcIlwiKVxuICAgICAgICB9IFxuXG4gICAgICAgIGlmKCAvXFxzezAsfVxcKFxcc3swLH1TRUxFQ1RcXHN7MCx9Ly5leGVjKGFyW2l4XSkpICB7IFxuICAgICAgICAgICAgZGVlcCsrO1xuICAgICAgICAgICAgc3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuICAgICAgICB9IGVsc2UgXG4gICAgICAgIGlmKCAvXFwnLy5leGVjKGFyW2l4XSkgKSAgeyBcbiAgICAgICAgICAgIGlmKHBhcmVudGhlc2lzTGV2ZWw8MSAmJiBkZWVwKSB7XG4gICAgICAgICAgICAgICAgZGVlcC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyICs9IGFyW2l4XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlICB7IFxuICAgICAgICAgICAgc3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuICAgICAgICAgICAgaWYocGFyZW50aGVzaXNMZXZlbDwxICYmIGRlZXApIHtcbiAgICAgICAgICAgICAgICBkZWVwLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgfVxuXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoL15cXG57MSx9LywnJykucmVwbGFjZSgvXFxuezEsfS9nLFwiXFxuXCIpO1xuICAgIHJldHVybiBzdHI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1pbiBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucHAucHJvdG90eXBlLnhtbG1pbiA9IGZ1bmN0aW9uKHRleHQsIHByZXNlcnZlQ29tbWVudHMpIHtcblxuXHR2YXIgc3RyID0gcHJlc2VydmVDb21tZW50cyA/IHRleHRcblx0XHRcdFx0ICAgOiB0ZXh0LnJlcGxhY2UoL1xcPCFbIFxcclxcblxcdF0qKC0tKFteXFwtXXxbXFxyXFxuXXwtW15cXC1dKSotLVsgXFxyXFxuXFx0XSopXFw+L2csXCJcIik7XG5cdHJldHVybiAgc3RyLnJlcGxhY2UoLz5cXHN7MCx9PC9nLFwiPjxcIik7IFxufVxuXG5wcC5wcm90b3R5cGUuanNvbm1pbiA9IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdFx0XHRcdFx0XHQgIFxuICAgIHJldHVybiAgdGV4dC5yZXBsYWNlKC9cXHN7MCx9XFx7XFxzezAsfS9nLFwie1wiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9XFxbJC9nLFwiW1wiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFtcXHN7MCx9L2csXCJbXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzpcXHN7MCx9XFxbL2csJzpbJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzezAsfVxcfVxcc3swLH0vZyxcIn1cIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzezAsfVxcXVxcc3swLH0vZyxcIl1cIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcIlxcc3swLH1cXCwvZywnXCIsJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwsXFxzezAsfVxcXCIvZywnLFwiJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcIlxcc3swLH06L2csJ1wiOicpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzpcXHN7MCx9XFxcIi9nLCc6XCInKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC86XFxzezAsfVxcWy9nLCc6WycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLFxcc3swLH1cXFsvZywnLFsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCxcXHN7Mix9L2csJywgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxdXFxzezAsfSxcXHN7MCx9XFxbL2csJ10sWycpOyAgIFxufVxuXG5wcC5wcm90b3R5cGUuY3NzbWluID0gZnVuY3Rpb24odGV4dCwgcHJlc2VydmVDb21tZW50cykge1xuXHRcblx0dmFyIHN0ciA9IHByZXNlcnZlQ29tbWVudHMgPyB0ZXh0XG5cdFx0XHRcdCAgIDogdGV4dC5yZXBsYWNlKC9cXC9cXCooW14qXXxbXFxyXFxuXXwoXFwqKyhbXiovXXxbXFxyXFxuXSkpKSpcXCorXFwvL2csXCJcIikgO1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL1xcc3sxLH0vZywnICcpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXHtcXHN7MSx9L2csXCJ7XCIpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXH1cXHN7MSx9L2csXCJ9XCIpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXDtcXHN7MSx9L2csXCI7XCIpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXC9cXCpcXHN7MSx9L2csXCIvKlwiKVxuXHRcdFx0ICAucmVwbGFjZSgvXFwqXFwvXFxzezEsfS9nLFwiKi9cIik7XG59XHRcblxucHAucHJvdG90eXBlLnNxbG1pbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHN7MSx9L2csXCIgXCIpLnJlcGxhY2UoL1xcc3sxLH1cXCgvLFwiKFwiKS5yZXBsYWNlKC9cXHN7MSx9XFwpLyxcIilcIik7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMucGQ9IG5ldyBwcDtcdFxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJmdW5jdGlvbiBET01QYXJzZXIob3B0aW9ucyl7XHJcblx0dGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fHtsb2NhdG9yOnt9fTtcclxuXHRcclxufVxyXG5ET01QYXJzZXIucHJvdG90eXBlLnBhcnNlRnJvbVN0cmluZyA9IGZ1bmN0aW9uKHNvdXJjZSxtaW1lVHlwZSl7XHJcblx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblx0dmFyIHNheCA9ICBuZXcgWE1MUmVhZGVyKCk7XHJcblx0dmFyIGRvbUJ1aWxkZXIgPSBvcHRpb25zLmRvbUJ1aWxkZXIgfHwgbmV3IERPTUhhbmRsZXIoKTsvL2NvbnRlbnRIYW5kbGVyIGFuZCBMZXhpY2FsSGFuZGxlclxyXG5cdHZhciBlcnJvckhhbmRsZXIgPSBvcHRpb25zLmVycm9ySGFuZGxlcjtcclxuXHR2YXIgbG9jYXRvciA9IG9wdGlvbnMubG9jYXRvcjtcclxuXHR2YXIgZGVmYXVsdE5TTWFwID0gb3B0aW9ucy54bWxuc3x8e307XHJcblx0dmFyIGVudGl0eU1hcCA9IHsnbHQnOic8JywnZ3QnOic+JywnYW1wJzonJicsJ3F1b3QnOidcIicsJ2Fwb3MnOlwiJ1wifVxyXG5cdGlmKGxvY2F0b3Ipe1xyXG5cdFx0ZG9tQnVpbGRlci5zZXREb2N1bWVudExvY2F0b3IobG9jYXRvcilcclxuXHR9XHJcblx0XHJcblx0c2F4LmVycm9ySGFuZGxlciA9IGJ1aWxkRXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcixkb21CdWlsZGVyLGxvY2F0b3IpO1xyXG5cdHNheC5kb21CdWlsZGVyID0gb3B0aW9ucy5kb21CdWlsZGVyIHx8IGRvbUJ1aWxkZXI7XHJcblx0aWYoL1xcL3g/aHRtbD8kLy50ZXN0KG1pbWVUeXBlKSl7XHJcblx0XHRlbnRpdHlNYXAubmJzcCA9ICdcXHhhMCc7XHJcblx0XHRlbnRpdHlNYXAuY29weSA9ICdcXHhhOSc7XHJcblx0XHRkZWZhdWx0TlNNYXBbJyddPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XHJcblx0fVxyXG5cdGRlZmF1bHROU01hcC54bWwgPSBkZWZhdWx0TlNNYXAueG1sIHx8ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xyXG5cdGlmKHNvdXJjZSl7XHJcblx0XHRzYXgucGFyc2Uoc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXApO1xyXG5cdH1lbHNle1xyXG5cdFx0c2F4LmVycm9ySGFuZGxlci5lcnJvcihcImludmFsaWQgZG9jIHNvdXJjZVwiKTtcclxuXHR9XHJcblx0cmV0dXJuIGRvbUJ1aWxkZXIuZG9jO1xyXG59XHJcbmZ1bmN0aW9uIGJ1aWxkRXJyb3JIYW5kbGVyKGVycm9ySW1wbCxkb21CdWlsZGVyLGxvY2F0b3Ipe1xyXG5cdGlmKCFlcnJvckltcGwpe1xyXG5cdFx0aWYoZG9tQnVpbGRlciBpbnN0YW5jZW9mIERPTUhhbmRsZXIpe1xyXG5cdFx0XHRyZXR1cm4gZG9tQnVpbGRlcjtcclxuXHRcdH1cclxuXHRcdGVycm9ySW1wbCA9IGRvbUJ1aWxkZXIgO1xyXG5cdH1cclxuXHR2YXIgZXJyb3JIYW5kbGVyID0ge31cclxuXHR2YXIgaXNDYWxsYmFjayA9IGVycm9ySW1wbCBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xyXG5cdGxvY2F0b3IgPSBsb2NhdG9yfHx7fVxyXG5cdGZ1bmN0aW9uIGJ1aWxkKGtleSl7XHJcblx0XHR2YXIgZm4gPSBlcnJvckltcGxba2V5XTtcclxuXHRcdGlmKCFmbiAmJiBpc0NhbGxiYWNrKXtcclxuXHRcdFx0Zm4gPSBlcnJvckltcGwubGVuZ3RoID09IDI/ZnVuY3Rpb24obXNnKXtlcnJvckltcGwoa2V5LG1zZyl9OmVycm9ySW1wbDtcclxuXHRcdH1cclxuXHRcdGVycm9ySGFuZGxlcltrZXldID0gZm4gJiYgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0Zm4oJ1t4bWxkb20gJytrZXkrJ11cXHQnK21zZytfbG9jYXRvcihsb2NhdG9yKSk7XHJcblx0XHR9fHxmdW5jdGlvbigpe307XHJcblx0fVxyXG5cdGJ1aWxkKCd3YXJuaW5nJyk7XHJcblx0YnVpbGQoJ2Vycm9yJyk7XHJcblx0YnVpbGQoJ2ZhdGFsRXJyb3InKTtcclxuXHRyZXR1cm4gZXJyb3JIYW5kbGVyO1xyXG59XHJcblxyXG4vL2NvbnNvbGUubG9nKCcjXFxuXFxuXFxuXFxuXFxuXFxuXFxuIyMjIycpXHJcbi8qKlxyXG4gKiArQ29udGVudEhhbmRsZXIrRXJyb3JIYW5kbGVyXHJcbiAqICtMZXhpY2FsSGFuZGxlcitFbnRpdHlSZXNvbHZlcjJcclxuICogLURlY2xIYW5kbGVyLURUREhhbmRsZXIgXHJcbiAqIFxyXG4gKiBEZWZhdWx0SGFuZGxlcjpFbnRpdHlSZXNvbHZlciwgRFRESGFuZGxlciwgQ29udGVudEhhbmRsZXIsIEVycm9ySGFuZGxlclxyXG4gKiBEZWZhdWx0SGFuZGxlcjI6RGVmYXVsdEhhbmRsZXIsTGV4aWNhbEhhbmRsZXIsIERlY2xIYW5kbGVyLCBFbnRpdHlSZXNvbHZlcjJcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvaGVscGVycy9EZWZhdWx0SGFuZGxlci5odG1sXHJcbiAqL1xyXG5mdW5jdGlvbiBET01IYW5kbGVyKCkge1xyXG4gICAgdGhpcy5jZGF0YSA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIHBvc2l0aW9uKGxvY2F0b3Isbm9kZSl7XHJcblx0bm9kZS5saW5lTnVtYmVyID0gbG9jYXRvci5saW5lTnVtYmVyO1xyXG5cdG5vZGUuY29sdW1uTnVtYmVyID0gbG9jYXRvci5jb2x1bW5OdW1iZXI7XHJcbn1cclxuLyoqXHJcbiAqIEBzZWUgb3JnLnhtbC5zYXguQ29udGVudEhhbmRsZXIjc3RhcnREb2N1bWVudFxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9Db250ZW50SGFuZGxlci5odG1sXHJcbiAqLyBcclxuRE9NSGFuZGxlci5wcm90b3R5cGUgPSB7XHJcblx0c3RhcnREb2N1bWVudCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgXHR0aGlzLmRvYyA9IG5ldyBET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgXHRpZiAodGhpcy5sb2NhdG9yKSB7XHJcbiAgICAgICAgXHR0aGlzLmRvYy5kb2N1bWVudFVSSSA9IHRoaXMubG9jYXRvci5zeXN0ZW1JZDtcclxuICAgIFx0fVxyXG5cdH0sXHJcblx0c3RhcnRFbGVtZW50OmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lLCBxTmFtZSwgYXR0cnMpIHtcclxuXHRcdHZhciBkb2MgPSB0aGlzLmRvYztcclxuXHQgICAgdmFyIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHFOYW1lfHxsb2NhbE5hbWUpO1xyXG5cdCAgICB2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGVsKTtcclxuXHQgICAgdGhpcy5jdXJyZW50RWxlbWVudCA9IGVsO1xyXG5cdCAgICBcclxuXHRcdHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsZWwpXHJcblx0ICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0ICAgICAgICB2YXIgbmFtZXNwYWNlVVJJID0gYXR0cnMuZ2V0VVJJKGkpO1xyXG5cdCAgICAgICAgdmFyIHZhbHVlID0gYXR0cnMuZ2V0VmFsdWUoaSk7XHJcblx0ICAgICAgICB2YXIgcU5hbWUgPSBhdHRycy5nZXRRTmFtZShpKTtcclxuXHRcdFx0dmFyIGF0dHIgPSBkb2MuY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxTmFtZSk7XHJcblx0XHRcdHRoaXMubG9jYXRvciAmJnBvc2l0aW9uKGF0dHJzLmdldExvY2F0b3IoaSksYXR0cik7XHJcblx0XHRcdGF0dHIudmFsdWUgPSBhdHRyLm5vZGVWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpXHJcblx0ICAgIH1cclxuXHR9LFxyXG5cdGVuZEVsZW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUsIHFOYW1lKSB7XHJcblx0XHR2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudEVsZW1lbnRcclxuXHRcdHZhciB0YWdOYW1lID0gY3VycmVudC50YWdOYW1lO1xyXG5cdFx0dGhpcy5jdXJyZW50RWxlbWVudCA9IGN1cnJlbnQucGFyZW50Tm9kZTtcclxuXHR9LFxyXG5cdHN0YXJ0UHJlZml4TWFwcGluZzpmdW5jdGlvbihwcmVmaXgsIHVyaSkge1xyXG5cdH0sXHJcblx0ZW5kUHJlZml4TWFwcGluZzpmdW5jdGlvbihwcmVmaXgpIHtcclxuXHR9LFxyXG5cdHByb2Nlc3NpbmdJbnN0cnVjdGlvbjpmdW5jdGlvbih0YXJnZXQsIGRhdGEpIHtcclxuXHQgICAgdmFyIGlucyA9IHRoaXMuZG9jLmNyZWF0ZVByb2Nlc3NpbmdJbnN0cnVjdGlvbih0YXJnZXQsIGRhdGEpO1xyXG5cdCAgICB0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGlucylcclxuXHQgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBpbnMpO1xyXG5cdH0sXHJcblx0aWdub3JhYmxlV2hpdGVzcGFjZTpmdW5jdGlvbihjaCwgc3RhcnQsIGxlbmd0aCkge1xyXG5cdH0sXHJcblx0Y2hhcmFjdGVyczpmdW5jdGlvbihjaGFycywgc3RhcnQsIGxlbmd0aCkge1xyXG5cdFx0Y2hhcnMgPSBfdG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpXHJcblx0XHQvL2NvbnNvbGUubG9nKGNoYXJzKVxyXG5cdFx0aWYoY2hhcnMpe1xyXG5cdFx0XHRpZiAodGhpcy5jZGF0YSkge1xyXG5cdFx0XHRcdHZhciBjaGFyTm9kZSA9IHRoaXMuZG9jLmNyZWF0ZUNEQVRBU2VjdGlvbihjaGFycyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGNoYXJOb2RlID0gdGhpcy5kb2MuY3JlYXRlVGV4dE5vZGUoY2hhcnMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRoaXMuY3VycmVudEVsZW1lbnQpe1xyXG5cdFx0XHRcdHRoaXMuY3VycmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hhck5vZGUpO1xyXG5cdFx0XHR9ZWxzZSBpZigvXlxccyokLy50ZXN0KGNoYXJzKSl7XHJcblx0XHRcdFx0dGhpcy5kb2MuYXBwZW5kQ2hpbGQoY2hhck5vZGUpO1xyXG5cdFx0XHRcdC8vcHJvY2VzcyB4bWxcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGNoYXJOb2RlKVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0c2tpcHBlZEVudGl0eTpmdW5jdGlvbihuYW1lKSB7XHJcblx0fSxcclxuXHRlbmREb2N1bWVudDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZG9jLm5vcm1hbGl6ZSgpO1xyXG5cdH0sXHJcblx0c2V0RG9jdW1lbnRMb2NhdG9yOmZ1bmN0aW9uIChsb2NhdG9yKSB7XHJcblx0ICAgIGlmKHRoaXMubG9jYXRvciA9IGxvY2F0b3Ipey8vICYmICEoJ2xpbmVOdW1iZXInIGluIGxvY2F0b3IpKXtcclxuXHQgICAgXHRsb2NhdG9yLmxpbmVOdW1iZXIgPSAwO1xyXG5cdCAgICB9XHJcblx0fSxcclxuXHQvL0xleGljYWxIYW5kbGVyXHJcblx0Y29tbWVudDpmdW5jdGlvbihjaGFycywgc3RhcnQsIGxlbmd0aCkge1xyXG5cdFx0Y2hhcnMgPSBfdG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpXHJcblx0ICAgIHZhciBjb21tID0gdGhpcy5kb2MuY3JlYXRlQ29tbWVudChjaGFycyk7XHJcblx0ICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsY29tbSlcclxuXHQgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBjb21tKTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0Q0RBVEE6ZnVuY3Rpb24oKSB7XHJcblx0ICAgIC8vdXNlZCBpbiBjaGFyYWN0ZXJzKCkgbWV0aG9kc1xyXG5cdCAgICB0aGlzLmNkYXRhID0gdHJ1ZTtcclxuXHR9LFxyXG5cdGVuZENEQVRBOmZ1bmN0aW9uKCkge1xyXG5cdCAgICB0aGlzLmNkYXRhID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRzdGFydERURDpmdW5jdGlvbihuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpIHtcclxuXHRcdHZhciBpbXBsID0gdGhpcy5kb2MuaW1wbGVtZW50YXRpb247XHJcblx0ICAgIGlmIChpbXBsICYmIGltcGwuY3JlYXRlRG9jdW1lbnRUeXBlKSB7XHJcblx0ICAgICAgICB2YXIgZHQgPSBpbXBsLmNyZWF0ZURvY3VtZW50VHlwZShuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpO1xyXG5cdCAgICAgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixkdClcclxuXHQgICAgICAgIGFwcGVuZEVsZW1lbnQodGhpcywgZHQpO1xyXG5cdCAgICB9XHJcblx0fSxcclxuXHQvKipcclxuXHQgKiBAc2VlIG9yZy54bWwuc2F4LkVycm9ySGFuZGxlclxyXG5cdCAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L0Vycm9ySGFuZGxlci5odG1sXHJcblx0ICovXHJcblx0d2FybmluZzpmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0Y29uc29sZS53YXJuKCdbeG1sZG9tIHdhcm5pbmddXFx0JytlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHR9LFxyXG5cdGVycm9yOmZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdbeG1sZG9tIGVycm9yXVxcdCcrZXJyb3IsX2xvY2F0b3IodGhpcy5sb2NhdG9yKSk7XHJcblx0fSxcclxuXHRmYXRhbEVycm9yOmZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdbeG1sZG9tIGZhdGFsRXJyb3JdXFx0JytlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHQgICAgdGhyb3cgZXJyb3I7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIF9sb2NhdG9yKGwpe1xyXG5cdGlmKGwpe1xyXG5cdFx0cmV0dXJuICdcXG5AJysobC5zeXN0ZW1JZCB8fCcnKSsnI1tsaW5lOicrbC5saW5lTnVtYmVyKycsY29sOicrbC5jb2x1bW5OdW1iZXIrJ10nXHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIF90b1N0cmluZyhjaGFycyxzdGFydCxsZW5ndGgpe1xyXG5cdGlmKHR5cGVvZiBjaGFycyA9PSAnc3RyaW5nJyl7XHJcblx0XHRyZXR1cm4gY2hhcnMuc3Vic3RyKHN0YXJ0LGxlbmd0aClcclxuXHR9ZWxzZXsvL2phdmEgc2F4IGNvbm5lY3Qgd2lkdGggeG1sZG9tIG9uIHJoaW5vKHdoYXQgYWJvdXQ6IFwiPyAmJiAhKGNoYXJzIGluc3RhbmNlb2YgU3RyaW5nKVwiKVxyXG5cdFx0aWYoY2hhcnMubGVuZ3RoID49IHN0YXJ0K2xlbmd0aCB8fCBzdGFydCl7XHJcblx0XHRcdHJldHVybiBuZXcgamF2YS5sYW5nLlN0cmluZyhjaGFycyxzdGFydCxsZW5ndGgpKycnO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYXJzO1xyXG5cdH1cclxufVxyXG5cclxuLypcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0xleGljYWxIYW5kbGVyLmh0bWxcclxuICogdXNlZCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkxleGljYWxIYW5kbGVyOlxyXG4gKiAgI2NvbW1lbnQoY2hhcnMsIHN0YXJ0LCBsZW5ndGgpXHJcbiAqICAjc3RhcnRDREFUQSgpXHJcbiAqICAjZW5kQ0RBVEEoKVxyXG4gKiAgI3N0YXJ0RFREKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZClcclxuICpcclxuICpcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkxleGljYWxIYW5kbGVyOlxyXG4gKiAgI2VuZERURCgpXHJcbiAqICAjc3RhcnRFbnRpdHkobmFtZSlcclxuICogICNlbmRFbnRpdHkobmFtZSlcclxuICpcclxuICpcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0RlY2xIYW5kbGVyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkRlY2xIYW5kbGVyXHJcbiAqIFx0I2F0dHJpYnV0ZURlY2woZU5hbWUsIGFOYW1lLCB0eXBlLCBtb2RlLCB2YWx1ZSlcclxuICogICNlbGVtZW50RGVjbChuYW1lLCBtb2RlbClcclxuICogICNleHRlcm5hbEVudGl0eURlY2wobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKiAgI2ludGVybmFsRW50aXR5RGVjbChuYW1lLCB2YWx1ZSlcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0VudGl0eVJlc29sdmVyMi5odG1sXHJcbiAqIElHTk9SRUQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LkVudGl0eVJlc29sdmVyMlxyXG4gKiAgI3Jlc29sdmVFbnRpdHkoU3RyaW5nIG5hbWUsU3RyaW5nIHB1YmxpY0lkLFN0cmluZyBiYXNlVVJJLFN0cmluZyBzeXN0ZW1JZClcclxuICogICNyZXNvbHZlRW50aXR5KHB1YmxpY0lkLCBzeXN0ZW1JZClcclxuICogICNnZXRFeHRlcm5hbFN1YnNldChuYW1lLCBiYXNlVVJJKVxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9EVERIYW5kbGVyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguRFRESGFuZGxlclxyXG4gKiAgI25vdGF0aW9uRGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpIHt9O1xyXG4gKiAgI3VucGFyc2VkRW50aXR5RGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQsIG5vdGF0aW9uTmFtZSkge307XHJcbiAqL1xyXG5cImVuZERURCxzdGFydEVudGl0eSxlbmRFbnRpdHksYXR0cmlidXRlRGVjbCxlbGVtZW50RGVjbCxleHRlcm5hbEVudGl0eURlY2wsaW50ZXJuYWxFbnRpdHlEZWNsLHJlc29sdmVFbnRpdHksZ2V0RXh0ZXJuYWxTdWJzZXQsbm90YXRpb25EZWNsLHVucGFyc2VkRW50aXR5RGVjbFwiLnJlcGxhY2UoL1xcdysvZyxmdW5jdGlvbihrZXkpe1xyXG5cdERPTUhhbmRsZXIucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbigpe3JldHVybiBudWxsfVxyXG59KVxyXG5cclxuLyogUHJpdmF0ZSBzdGF0aWMgaGVscGVycyB0cmVhdGVkIGJlbG93IGFzIHByaXZhdGUgaW5zdGFuY2UgbWV0aG9kcywgc28gZG9uJ3QgbmVlZCB0byBhZGQgdGhlc2UgdG8gdGhlIHB1YmxpYyBBUEk7IHdlIG1pZ2h0IHVzZSBhIFJlbGF0b3IgdG8gYWxzbyBnZXQgcmlkIG9mIG5vbi1zdGFuZGFyZCBwdWJsaWMgcHJvcGVydGllcyAqL1xyXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50IChoYW5kZXIsbm9kZSkge1xyXG4gICAgaWYgKCFoYW5kZXIuY3VycmVudEVsZW1lbnQpIHtcclxuICAgICAgICBoYW5kZXIuZG9jLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBoYW5kZXIuY3VycmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcbn0vL2FwcGVuZENoaWxkIGFuZCBzZXRBdHRyaWJ1dGVOUyBhcmUgcHJlZm9ybWFuY2Uga2V5XHJcblxyXG4vL2lmKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpe1xyXG5cdHZhciBYTUxSZWFkZXIgPSByZXF1aXJlKCcuL3NheCcpLlhNTFJlYWRlcjtcclxuXHR2YXIgRE9NSW1wbGVtZW50YXRpb24gPSBleHBvcnRzLkRPTUltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9kb20nKS5ET01JbXBsZW1lbnRhdGlvbjtcclxuXHRleHBvcnRzLlhNTFNlcmlhbGl6ZXIgPSByZXF1aXJlKCcuL2RvbScpLlhNTFNlcmlhbGl6ZXIgO1xyXG5cdGV4cG9ydHMuRE9NUGFyc2VyID0gRE9NUGFyc2VyO1xyXG4vL31cclxuIiwiLypcbiAqIERPTSBMZXZlbCAyXG4gKiBPYmplY3QgRE9NRXhjZXB0aW9uXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1ET00tTGV2ZWwtMS9lY21hLXNjcmlwdC1sYW5ndWFnZS1iaW5kaW5nLmh0bWxcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMC9SRUMtRE9NLUxldmVsLTItQ29yZS0yMDAwMTExMy9lY21hLXNjcmlwdC1iaW5kaW5nLmh0bWxcbiAqL1xuXG5mdW5jdGlvbiBjb3B5KHNyYyxkZXN0KXtcblx0Zm9yKHZhciBwIGluIHNyYyl7XG5cdFx0ZGVzdFtwXSA9IHNyY1twXTtcblx0fVxufVxuLyoqXG5eXFx3K1xcLnByb3RvdHlwZVxcLihbX1xcd10rKVxccyo9XFxzKigoPzouKlxce1xccyo/W1xcclxcbl1bXFxzXFxTXSo/Xn0pfFxcUy4qPyg/PVs7XFxyXFxuXSkpOz9cbl5cXHcrXFwucHJvdG90eXBlXFwuKFtfXFx3XSspXFxzKj1cXHMqKFxcUy4qPyg/PVs7XFxyXFxuXSkpOz9cbiAqL1xuZnVuY3Rpb24gX2V4dGVuZHMoQ2xhc3MsU3VwZXIpe1xuXHR2YXIgcHQgPSBDbGFzcy5wcm90b3R5cGU7XG5cdGlmKE9iamVjdC5jcmVhdGUpe1xuXHRcdHZhciBwcHQgPSBPYmplY3QuY3JlYXRlKFN1cGVyLnByb3RvdHlwZSlcblx0XHRwdC5fX3Byb3RvX18gPSBwcHQ7XG5cdH1cblx0aWYoIShwdCBpbnN0YW5jZW9mIFN1cGVyKSl7XG5cdFx0ZnVuY3Rpb24gdCgpe307XG5cdFx0dC5wcm90b3R5cGUgPSBTdXBlci5wcm90b3R5cGU7XG5cdFx0dCA9IG5ldyB0KCk7XG5cdFx0Y29weShwdCx0KTtcblx0XHRDbGFzcy5wcm90b3R5cGUgPSBwdCA9IHQ7XG5cdH1cblx0aWYocHQuY29uc3RydWN0b3IgIT0gQ2xhc3Mpe1xuXHRcdGlmKHR5cGVvZiBDbGFzcyAhPSAnZnVuY3Rpb24nKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJ1bmtub3cgQ2xhc3M6XCIrQ2xhc3MpXG5cdFx0fVxuXHRcdHB0LmNvbnN0cnVjdG9yID0gQ2xhc3Ncblx0fVxufVxudmFyIGh0bWxucyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyA7XG4vLyBOb2RlIFR5cGVzXG52YXIgTm9kZVR5cGUgPSB7fVxudmFyIEVMRU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkVMRU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IDE7XG52YXIgQVRUUklCVVRFX05PREUgICAgICAgICAgICAgID0gTm9kZVR5cGUuQVRUUklCVVRFX05PREUgICAgICAgICAgICAgID0gMjtcbnZhciBURVhUX05PREUgICAgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5URVhUX05PREUgICAgICAgICAgICAgICAgICAgPSAzO1xudmFyIENEQVRBX1NFQ1RJT05fTk9ERSAgICAgICAgICA9IE5vZGVUeXBlLkNEQVRBX1NFQ1RJT05fTk9ERSAgICAgICAgICA9IDQ7XG52YXIgRU5USVRZX1JFRkVSRU5DRV9OT0RFICAgICAgID0gTm9kZVR5cGUuRU5USVRZX1JFRkVSRU5DRV9OT0RFICAgICAgID0gNTtcbnZhciBFTlRJVFlfTk9ERSAgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5FTlRJVFlfTk9ERSAgICAgICAgICAgICAgICAgPSA2O1xudmFyIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERSA9IE5vZGVUeXBlLlBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERSA9IDc7XG52YXIgQ09NTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuQ09NTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gODtcbnZhciBET0NVTUVOVF9OT0RFICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5ET0NVTUVOVF9OT0RFICAgICAgICAgICAgICAgPSA5O1xudmFyIERPQ1VNRU5UX1RZUEVfTk9ERSAgICAgICAgICA9IE5vZGVUeXBlLkRPQ1VNRU5UX1RZUEVfTk9ERSAgICAgICAgICA9IDEwO1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgICAgICA9IE5vZGVUeXBlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUgICAgICA9IDExO1xudmFyIE5PVEFUSU9OX05PREUgICAgICAgICAgICAgICA9IE5vZGVUeXBlLk5PVEFUSU9OX05PREUgICAgICAgICAgICAgICA9IDEyO1xuXG4vLyBFeGNlcHRpb25Db2RlXG52YXIgRXhjZXB0aW9uQ29kZSA9IHt9XG52YXIgRXhjZXB0aW9uTWVzc2FnZSA9IHt9O1xudmFyIElOREVYX1NJWkVfRVJSICAgICAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuSU5ERVhfU0laRV9FUlIgICAgICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzFdPVwiSW5kZXggc2l6ZSBlcnJvclwiKSwxKTtcbnZhciBET01TVFJJTkdfU0laRV9FUlIgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLkRPTVNUUklOR19TSVpFX0VSUiAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVsyXT1cIkRPTVN0cmluZyBzaXplIGVycm9yXCIpLDIpO1xudmFyIEhJRVJBUkNIWV9SRVFVRVNUX0VSUiAgICAgICA9IEV4Y2VwdGlvbkNvZGUuSElFUkFSQ0hZX1JFUVVFU1RfRVJSICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzNdPVwiSGllcmFyY2h5IHJlcXVlc3QgZXJyb3JcIiksMyk7XG52YXIgV1JPTkdfRE9DVU1FTlRfRVJSICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5XUk9OR19ET0NVTUVOVF9FUlIgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbNF09XCJXcm9uZyBkb2N1bWVudFwiKSw0KTtcbnZhciBJTlZBTElEX0NIQVJBQ1RFUl9FUlIgICAgICAgPSBFeGNlcHRpb25Db2RlLklOVkFMSURfQ0hBUkFDVEVSX0VSUiAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs1XT1cIkludmFsaWQgY2hhcmFjdGVyXCIpLDUpO1xudmFyIE5PX0RBVEFfQUxMT1dFRF9FUlIgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuTk9fREFUQV9BTExPV0VEX0VSUiAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzZdPVwiTm8gZGF0YSBhbGxvd2VkXCIpLDYpO1xudmFyIE5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUiA9IEV4Y2VwdGlvbkNvZGUuTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSID0gKChFeGNlcHRpb25NZXNzYWdlWzddPVwiTm8gbW9kaWZpY2F0aW9uIGFsbG93ZWRcIiksNyk7XG52YXIgTk9UX0ZPVU5EX0VSUiAgICAgICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5OT1RfRk9VTkRfRVJSICAgICAgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbOF09XCJOb3QgZm91bmRcIiksOCk7XG52YXIgTk9UX1NVUFBPUlRFRF9FUlIgICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5OT1RfU1VQUE9SVEVEX0VSUiAgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbOV09XCJOb3Qgc3VwcG9ydGVkXCIpLDkpO1xudmFyIElOVVNFX0FUVFJJQlVURV9FUlIgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuSU5VU0VfQVRUUklCVVRFX0VSUiAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzEwXT1cIkF0dHJpYnV0ZSBpbiB1c2VcIiksMTApO1xuLy9sZXZlbDJcbnZhciBJTlZBTElEX1NUQVRFX0VSUiAgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9TVEFURV9FUlIgICAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTFdPVwiSW52YWxpZCBzdGF0ZVwiKSwxMSk7XG52YXIgU1lOVEFYX0VSUiAgICAgICAgICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLlNZTlRBWF9FUlIgICAgICAgICAgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzEyXT1cIlN5bnRheCBlcnJvclwiKSwxMik7XG52YXIgSU5WQUxJRF9NT0RJRklDQVRJT05fRVJSIFx0PSBFeGNlcHRpb25Db2RlLklOVkFMSURfTU9ESUZJQ0FUSU9OX0VSUiBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzEzXT1cIkludmFsaWQgbW9kaWZpY2F0aW9uXCIpLDEzKTtcbnZhciBOQU1FU1BBQ0VfRVJSICAgICAgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuTkFNRVNQQUNFX0VSUiAgICAgICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxNF09XCJJbnZhbGlkIG5hbWVzcGFjZVwiKSwxNCk7XG52YXIgSU5WQUxJRF9BQ0NFU1NfRVJSICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLklOVkFMSURfQUNDRVNTX0VSUiAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTVdPVwiSW52YWxpZCBhY2Nlc3NcIiksMTUpO1xuXG5cbmZ1bmN0aW9uIERPTUV4Y2VwdGlvbihjb2RlLCBtZXNzYWdlKSB7XG5cdGlmKG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvcil7XG5cdFx0dmFyIGVycm9yID0gbWVzc2FnZTtcblx0fWVsc2V7XG5cdFx0ZXJyb3IgPSB0aGlzO1xuXHRcdEVycm9yLmNhbGwodGhpcywgRXhjZXB0aW9uTWVzc2FnZVtjb2RlXSk7XG5cdFx0dGhpcy5tZXNzYWdlID0gRXhjZXB0aW9uTWVzc2FnZVtjb2RlXTtcblx0XHRpZihFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRE9NRXhjZXB0aW9uKTtcblx0fVxuXHRlcnJvci5jb2RlID0gY29kZTtcblx0aWYobWVzc2FnZSkgdGhpcy5tZXNzYWdlID0gdGhpcy5tZXNzYWdlICsgXCI6IFwiICsgbWVzc2FnZTtcblx0cmV0dXJuIGVycm9yO1xufTtcbkRPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5jb3B5KEV4Y2VwdGlvbkNvZGUsRE9NRXhjZXB0aW9uKVxuLyoqXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDAvUkVDLURPTS1MZXZlbC0yLUNvcmUtMjAwMDExMTMvY29yZS5odG1sI0lELTUzNjI5NzE3N1xuICogVGhlIE5vZGVMaXN0IGludGVyZmFjZSBwcm92aWRlcyB0aGUgYWJzdHJhY3Rpb24gb2YgYW4gb3JkZXJlZCBjb2xsZWN0aW9uIG9mIG5vZGVzLCB3aXRob3V0IGRlZmluaW5nIG9yIGNvbnN0cmFpbmluZyBob3cgdGhpcyBjb2xsZWN0aW9uIGlzIGltcGxlbWVudGVkLiBOb2RlTGlzdCBvYmplY3RzIGluIHRoZSBET00gYXJlIGxpdmUuXG4gKiBUaGUgaXRlbXMgaW4gdGhlIE5vZGVMaXN0IGFyZSBhY2Nlc3NpYmxlIHZpYSBhbiBpbnRlZ3JhbCBpbmRleCwgc3RhcnRpbmcgZnJvbSAwLlxuICovXG5mdW5jdGlvbiBOb2RlTGlzdCgpIHtcbn07XG5Ob2RlTGlzdC5wcm90b3R5cGUgPSB7XG5cdC8qKlxuXHQgKiBUaGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0LiBUaGUgcmFuZ2Ugb2YgdmFsaWQgY2hpbGQgbm9kZSBpbmRpY2VzIGlzIDAgdG8gbGVuZ3RoLTEgaW5jbHVzaXZlLlxuXHQgKiBAc3RhbmRhcmQgbGV2ZWwxXG5cdCAqL1xuXHRsZW5ndGg6MCwgXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbmRleHRoIGl0ZW0gaW4gdGhlIGNvbGxlY3Rpb24uIElmIGluZGV4IGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0LCB0aGlzIHJldHVybnMgbnVsbC5cblx0ICogQHN0YW5kYXJkIGxldmVsMVxuXHQgKiBAcGFyYW0gaW5kZXggIHVuc2lnbmVkIGxvbmcgXG5cdCAqICAgSW5kZXggaW50byB0aGUgY29sbGVjdGlvbi5cblx0ICogQHJldHVybiBOb2RlXG5cdCAqIFx0VGhlIG5vZGUgYXQgdGhlIGluZGV4dGggcG9zaXRpb24gaW4gdGhlIE5vZGVMaXN0LCBvciBudWxsIGlmIHRoYXQgaXMgbm90IGEgdmFsaWQgaW5kZXguIFxuXHQgKi9cblx0aXRlbTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRyZXR1cm4gdGhpc1tpbmRleF0gfHwgbnVsbDtcblx0fSxcblx0dG9TdHJpbmc6ZnVuY3Rpb24oaXNIVE1MLG5vZGVGaWx0ZXIpe1xuXHRcdGZvcih2YXIgYnVmID0gW10sIGkgPSAwO2k8dGhpcy5sZW5ndGg7aSsrKXtcblx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKHRoaXNbaV0sYnVmLGlzSFRNTCxub2RlRmlsdGVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGJ1Zi5qb2luKCcnKTtcblx0fVxufTtcbmZ1bmN0aW9uIExpdmVOb2RlTGlzdChub2RlLHJlZnJlc2gpe1xuXHR0aGlzLl9ub2RlID0gbm9kZTtcblx0dGhpcy5fcmVmcmVzaCA9IHJlZnJlc2hcblx0X3VwZGF0ZUxpdmVMaXN0KHRoaXMpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZUxpdmVMaXN0KGxpc3Qpe1xuXHR2YXIgaW5jID0gbGlzdC5fbm9kZS5faW5jIHx8IGxpc3QuX25vZGUub3duZXJEb2N1bWVudC5faW5jO1xuXHRpZihsaXN0Ll9pbmMgIT0gaW5jKXtcblx0XHR2YXIgbHMgPSBsaXN0Ll9yZWZyZXNoKGxpc3QuX25vZGUpO1xuXHRcdC8vY29uc29sZS5sb2cobHMubGVuZ3RoKVxuXHRcdF9fc2V0X18obGlzdCwnbGVuZ3RoJyxscy5sZW5ndGgpO1xuXHRcdGNvcHkobHMsbGlzdCk7XG5cdFx0bGlzdC5faW5jID0gaW5jO1xuXHR9XG59XG5MaXZlTm9kZUxpc3QucHJvdG90eXBlLml0ZW0gPSBmdW5jdGlvbihpKXtcblx0X3VwZGF0ZUxpdmVMaXN0KHRoaXMpO1xuXHRyZXR1cm4gdGhpc1tpXTtcbn1cblxuX2V4dGVuZHMoTGl2ZU5vZGVMaXN0LE5vZGVMaXN0KTtcbi8qKlxuICogXG4gKiBPYmplY3RzIGltcGxlbWVudGluZyB0aGUgTmFtZWROb2RlTWFwIGludGVyZmFjZSBhcmUgdXNlZCB0byByZXByZXNlbnQgY29sbGVjdGlvbnMgb2Ygbm9kZXMgdGhhdCBjYW4gYmUgYWNjZXNzZWQgYnkgbmFtZS4gTm90ZSB0aGF0IE5hbWVkTm9kZU1hcCBkb2VzIG5vdCBpbmhlcml0IGZyb20gTm9kZUxpc3Q7IE5hbWVkTm9kZU1hcHMgYXJlIG5vdCBtYWludGFpbmVkIGluIGFueSBwYXJ0aWN1bGFyIG9yZGVyLiBPYmplY3RzIGNvbnRhaW5lZCBpbiBhbiBvYmplY3QgaW1wbGVtZW50aW5nIE5hbWVkTm9kZU1hcCBtYXkgYWxzbyBiZSBhY2Nlc3NlZCBieSBhbiBvcmRpbmFsIGluZGV4LCBidXQgdGhpcyBpcyBzaW1wbHkgdG8gYWxsb3cgY29udmVuaWVudCBlbnVtZXJhdGlvbiBvZiB0aGUgY29udGVudHMgb2YgYSBOYW1lZE5vZGVNYXAsIGFuZCBkb2VzIG5vdCBpbXBseSB0aGF0IHRoZSBET00gc3BlY2lmaWVzIGFuIG9yZGVyIHRvIHRoZXNlIE5vZGVzLlxuICogTmFtZWROb2RlTWFwIG9iamVjdHMgaW4gdGhlIERPTSBhcmUgbGl2ZS5cbiAqIHVzZWQgZm9yIGF0dHJpYnV0ZXMgb3IgRG9jdW1lbnRUeXBlIGVudGl0aWVzIFxuICovXG5mdW5jdGlvbiBOYW1lZE5vZGVNYXAoKSB7XG59O1xuXG5mdW5jdGlvbiBfZmluZE5vZGVJbmRleChsaXN0LG5vZGUpe1xuXHR2YXIgaSA9IGxpc3QubGVuZ3RoO1xuXHR3aGlsZShpLS0pe1xuXHRcdGlmKGxpc3RbaV0gPT09IG5vZGUpe3JldHVybiBpfVxuXHR9XG59XG5cbmZ1bmN0aW9uIF9hZGROYW1lZE5vZGUoZWwsbGlzdCxuZXdBdHRyLG9sZEF0dHIpe1xuXHRpZihvbGRBdHRyKXtcblx0XHRsaXN0W19maW5kTm9kZUluZGV4KGxpc3Qsb2xkQXR0cildID0gbmV3QXR0cjtcblx0fWVsc2V7XG5cdFx0bGlzdFtsaXN0Lmxlbmd0aCsrXSA9IG5ld0F0dHI7XG5cdH1cblx0aWYoZWwpe1xuXHRcdG5ld0F0dHIub3duZXJFbGVtZW50ID0gZWw7XG5cdFx0dmFyIGRvYyA9IGVsLm93bmVyRG9jdW1lbnQ7XG5cdFx0aWYoZG9jKXtcblx0XHRcdG9sZEF0dHIgJiYgX29uUmVtb3ZlQXR0cmlidXRlKGRvYyxlbCxvbGRBdHRyKTtcblx0XHRcdF9vbkFkZEF0dHJpYnV0ZShkb2MsZWwsbmV3QXR0cik7XG5cdFx0fVxuXHR9XG59XG5mdW5jdGlvbiBfcmVtb3ZlTmFtZWROb2RlKGVsLGxpc3QsYXR0cil7XG5cdC8vY29uc29sZS5sb2coJ3JlbW92ZSBhdHRyOicrYXR0cilcblx0dmFyIGkgPSBfZmluZE5vZGVJbmRleChsaXN0LGF0dHIpO1xuXHRpZihpPj0wKXtcblx0XHR2YXIgbGFzdEluZGV4ID0gbGlzdC5sZW5ndGgtMVxuXHRcdHdoaWxlKGk8bGFzdEluZGV4KXtcblx0XHRcdGxpc3RbaV0gPSBsaXN0WysraV1cblx0XHR9XG5cdFx0bGlzdC5sZW5ndGggPSBsYXN0SW5kZXg7XG5cdFx0aWYoZWwpe1xuXHRcdFx0dmFyIGRvYyA9IGVsLm93bmVyRG9jdW1lbnQ7XG5cdFx0XHRpZihkb2Mpe1xuXHRcdFx0XHRfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLGVsLGF0dHIpO1xuXHRcdFx0XHRhdHRyLm93bmVyRWxlbWVudCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ZWxzZXtcblx0XHR0aHJvdyBET01FeGNlcHRpb24oTk9UX0ZPVU5EX0VSUixuZXcgRXJyb3IoZWwudGFnTmFtZSsnQCcrYXR0cikpXG5cdH1cbn1cbk5hbWVkTm9kZU1hcC5wcm90b3R5cGUgPSB7XG5cdGxlbmd0aDowLFxuXHRpdGVtOk5vZGVMaXN0LnByb3RvdHlwZS5pdGVtLFxuXHRnZXROYW1lZEl0ZW06IGZ1bmN0aW9uKGtleSkge1xuLy9cdFx0aWYoa2V5LmluZGV4T2YoJzonKT4wIHx8IGtleSA9PSAneG1sbnMnKXtcbi8vXHRcdFx0cmV0dXJuIG51bGw7XG4vL1x0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZygpXG5cdFx0dmFyIGkgPSB0aGlzLmxlbmd0aDtcblx0XHR3aGlsZShpLS0pe1xuXHRcdFx0dmFyIGF0dHIgPSB0aGlzW2ldO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRyLm5vZGVOYW1lLGtleSlcblx0XHRcdGlmKGF0dHIubm9kZU5hbWUgPT0ga2V5KXtcblx0XHRcdFx0cmV0dXJuIGF0dHI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRzZXROYW1lZEl0ZW06IGZ1bmN0aW9uKGF0dHIpIHtcblx0XHR2YXIgZWwgPSBhdHRyLm93bmVyRWxlbWVudDtcblx0XHRpZihlbCAmJiBlbCE9dGhpcy5fb3duZXJFbGVtZW50KXtcblx0XHRcdHRocm93IG5ldyBET01FeGNlcHRpb24oSU5VU0VfQVRUUklCVVRFX0VSUik7XG5cdFx0fVxuXHRcdHZhciBvbGRBdHRyID0gdGhpcy5nZXROYW1lZEl0ZW0oYXR0ci5ub2RlTmFtZSk7XG5cdFx0X2FkZE5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyLG9sZEF0dHIpO1xuXHRcdHJldHVybiBvbGRBdHRyO1xuXHR9LFxuXHQvKiByZXR1cm5zIE5vZGUgKi9cblx0c2V0TmFtZWRJdGVtTlM6IGZ1bmN0aW9uKGF0dHIpIHsvLyByYWlzZXM6IFdST05HX0RPQ1VNRU5UX0VSUixOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIsSU5VU0VfQVRUUklCVVRFX0VSUlxuXHRcdHZhciBlbCA9IGF0dHIub3duZXJFbGVtZW50LCBvbGRBdHRyO1xuXHRcdGlmKGVsICYmIGVsIT10aGlzLl9vd25lckVsZW1lbnQpe1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4Y2VwdGlvbihJTlVTRV9BVFRSSUJVVEVfRVJSKTtcblx0XHR9XG5cdFx0b2xkQXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtTlMoYXR0ci5uYW1lc3BhY2VVUkksYXR0ci5sb2NhbE5hbWUpO1xuXHRcdF9hZGROYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cixvbGRBdHRyKTtcblx0XHRyZXR1cm4gb2xkQXR0cjtcblx0fSxcblxuXHQvKiByZXR1cm5zIE5vZGUgKi9cblx0cmVtb3ZlTmFtZWRJdGVtOiBmdW5jdGlvbihrZXkpIHtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtKGtleSk7XG5cdFx0X3JlbW92ZU5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyKTtcblx0XHRyZXR1cm4gYXR0cjtcblx0XHRcblx0XHRcblx0fSwvLyByYWlzZXM6IE5PVF9GT1VORF9FUlIsTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSXG5cdFxuXHQvL2ZvciBsZXZlbDJcblx0cmVtb3ZlTmFtZWRJdGVtTlM6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLGxvY2FsTmFtZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbU5TKG5hbWVzcGFjZVVSSSxsb2NhbE5hbWUpO1xuXHRcdF9yZW1vdmVOYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cik7XG5cdFx0cmV0dXJuIGF0dHI7XG5cdH0sXG5cdGdldE5hbWVkSXRlbU5TOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuXHRcdHZhciBpID0gdGhpcy5sZW5ndGg7XG5cdFx0d2hpbGUoaS0tKXtcblx0XHRcdHZhciBub2RlID0gdGhpc1tpXTtcblx0XHRcdGlmKG5vZGUubG9jYWxOYW1lID09IGxvY2FsTmFtZSAmJiBub2RlLm5hbWVzcGFjZVVSSSA9PSBuYW1lc3BhY2VVUkkpe1xuXHRcdFx0XHRyZXR1cm4gbm9kZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLURPTS1MZXZlbC0xL2xldmVsLW9uZS1jb3JlLmh0bWwjSUQtMTAyMTYxNDkwXG4gKi9cbmZ1bmN0aW9uIERPTUltcGxlbWVudGF0aW9uKC8qIE9iamVjdCAqLyBmZWF0dXJlcykge1xuXHR0aGlzLl9mZWF0dXJlcyA9IHt9O1xuXHRpZiAoZmVhdHVyZXMpIHtcblx0XHRmb3IgKHZhciBmZWF0dXJlIGluIGZlYXR1cmVzKSB7XG5cdFx0XHQgdGhpcy5fZmVhdHVyZXMgPSBmZWF0dXJlc1tmZWF0dXJlXTtcblx0XHR9XG5cdH1cbn07XG5cbkRPTUltcGxlbWVudGF0aW9uLnByb3RvdHlwZSA9IHtcblx0aGFzRmVhdHVyZTogZnVuY3Rpb24oLyogc3RyaW5nICovIGZlYXR1cmUsIC8qIHN0cmluZyAqLyB2ZXJzaW9uKSB7XG5cdFx0dmFyIHZlcnNpb25zID0gdGhpcy5fZmVhdHVyZXNbZmVhdHVyZS50b0xvd2VyQ2FzZSgpXTtcblx0XHRpZiAodmVyc2lvbnMgJiYgKCF2ZXJzaW9uIHx8IHZlcnNpb24gaW4gdmVyc2lvbnMpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlRG9jdW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCAgcXVhbGlmaWVkTmFtZSwgZG9jdHlwZSl7Ly8gcmFpc2VzOklOVkFMSURfQ0hBUkFDVEVSX0VSUixOQU1FU1BBQ0VfRVJSLFdST05HX0RPQ1VNRU5UX0VSUlxuXHRcdHZhciBkb2MgPSBuZXcgRG9jdW1lbnQoKTtcblx0XHRkb2MuaW1wbGVtZW50YXRpb24gPSB0aGlzO1xuXHRcdGRvYy5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0ZG9jLmRvY3R5cGUgPSBkb2N0eXBlO1xuXHRcdGlmKGRvY3R5cGUpe1xuXHRcdFx0ZG9jLmFwcGVuZENoaWxkKGRvY3R5cGUpO1xuXHRcdH1cblx0XHRpZihxdWFsaWZpZWROYW1lKXtcblx0XHRcdHZhciByb290ID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSk7XG5cdFx0XHRkb2MuYXBwZW5kQ2hpbGQocm9vdCk7XG5cdFx0fVxuXHRcdHJldHVybiBkb2M7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZURvY3VtZW50VHlwZTpmdW5jdGlvbihxdWFsaWZpZWROYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpey8vIHJhaXNlczpJTlZBTElEX0NIQVJBQ1RFUl9FUlIsTkFNRVNQQUNFX0VSUlxuXHRcdHZhciBub2RlID0gbmV3IERvY3VtZW50VHlwZSgpO1xuXHRcdG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5wdWJsaWNJZCA9IHB1YmxpY0lkO1xuXHRcdG5vZGUuc3lzdGVtSWQgPSBzeXN0ZW1JZDtcblx0XHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRcdC8vcmVhZG9ubHkgYXR0cmlidXRlIERPTVN0cmluZyAgICAgICAgaW50ZXJuYWxTdWJzZXQ7XG5cdFx0XG5cdFx0Ly9UT0RPOi4uXG5cdFx0Ly8gIHJlYWRvbmx5IGF0dHJpYnV0ZSBOYW1lZE5vZGVNYXAgICAgIGVudGl0aWVzO1xuXHRcdC8vICByZWFkb25seSBhdHRyaWJ1dGUgTmFtZWROb2RlTWFwICAgICBub3RhdGlvbnM7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDAvUkVDLURPTS1MZXZlbC0yLUNvcmUtMjAwMDExMTMvY29yZS5odG1sI0lELTE5NTA2NDEyNDdcbiAqL1xuXG5mdW5jdGlvbiBOb2RlKCkge1xufTtcblxuTm9kZS5wcm90b3R5cGUgPSB7XG5cdGZpcnN0Q2hpbGQgOiBudWxsLFxuXHRsYXN0Q2hpbGQgOiBudWxsLFxuXHRwcmV2aW91c1NpYmxpbmcgOiBudWxsLFxuXHRuZXh0U2libGluZyA6IG51bGwsXG5cdGF0dHJpYnV0ZXMgOiBudWxsLFxuXHRwYXJlbnROb2RlIDogbnVsbCxcblx0Y2hpbGROb2RlcyA6IG51bGwsXG5cdG93bmVyRG9jdW1lbnQgOiBudWxsLFxuXHRub2RlVmFsdWUgOiBudWxsLFxuXHRuYW1lc3BhY2VVUkkgOiBudWxsLFxuXHRwcmVmaXggOiBudWxsLFxuXHRsb2NhbE5hbWUgOiBudWxsLFxuXHQvLyBNb2RpZmllZCBpbiBET00gTGV2ZWwgMjpcblx0aW5zZXJ0QmVmb3JlOmZ1bmN0aW9uKG5ld0NoaWxkLCByZWZDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0cmV0dXJuIF9pbnNlcnRCZWZvcmUodGhpcyxuZXdDaGlsZCxyZWZDaGlsZCk7XG5cdH0sXG5cdHJlcGxhY2VDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCwgb2xkQ2hpbGQpey8vcmFpc2VzIFxuXHRcdHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG9sZENoaWxkKTtcblx0XHRpZihvbGRDaGlsZCl7XG5cdFx0XHR0aGlzLnJlbW92ZUNoaWxkKG9sZENoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUNoaWxkOmZ1bmN0aW9uKG9sZENoaWxkKXtcblx0XHRyZXR1cm4gX3JlbW92ZUNoaWxkKHRoaXMsb2xkQ2hpbGQpO1xuXHR9LFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0cmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG51bGwpO1xuXHR9LFxuXHRoYXNDaGlsZE5vZGVzOmZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuZmlyc3RDaGlsZCAhPSBudWxsO1xuXHR9LFxuXHRjbG9uZU5vZGU6ZnVuY3Rpb24oZGVlcCl7XG5cdFx0cmV0dXJuIGNsb25lTm9kZSh0aGlzLm93bmVyRG9jdW1lbnR8fHRoaXMsdGhpcyxkZWVwKTtcblx0fSxcblx0Ly8gTW9kaWZpZWQgaW4gRE9NIExldmVsIDI6XG5cdG5vcm1hbGl6ZTpmdW5jdGlvbigpe1xuXHRcdHZhciBjaGlsZCA9IHRoaXMuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0aWYobmV4dCAmJiBuZXh0Lm5vZGVUeXBlID09IFRFWFRfTk9ERSAmJiBjaGlsZC5ub2RlVHlwZSA9PSBURVhUX05PREUpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNoaWxkKG5leHQpO1xuXHRcdFx0XHRjaGlsZC5hcHBlbmREYXRhKG5leHQuZGF0YSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Y2hpbGQubm9ybWFsaXplKCk7XG5cdFx0XHRcdGNoaWxkID0gbmV4dDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG4gIFx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0aXNTdXBwb3J0ZWQ6ZnVuY3Rpb24oZmVhdHVyZSwgdmVyc2lvbil7XG5cdFx0cmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKGZlYXR1cmUsdmVyc2lvbik7XG5cdH0sXG4gICAgLy8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcbiAgICBoYXNBdHRyaWJ1dGVzOmZ1bmN0aW9uKCl7XG4gICAgXHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aD4wO1xuICAgIH0sXG4gICAgbG9va3VwUHJlZml4OmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSl7XG4gICAgXHR2YXIgZWwgPSB0aGlzO1xuICAgIFx0d2hpbGUoZWwpe1xuICAgIFx0XHR2YXIgbWFwID0gZWwuX25zTWFwO1xuICAgIFx0XHQvL2NvbnNvbGUuZGlyKG1hcClcbiAgICBcdFx0aWYobWFwKXtcbiAgICBcdFx0XHRmb3IodmFyIG4gaW4gbWFwKXtcbiAgICBcdFx0XHRcdGlmKG1hcFtuXSA9PSBuYW1lc3BhY2VVUkkpe1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gbjtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cbiAgICBcdFx0ZWwgPSBlbC5ub2RlVHlwZSA9PSBBVFRSSUJVVEVfTk9ERT9lbC5vd25lckRvY3VtZW50IDogZWwucGFyZW50Tm9kZTtcbiAgICBcdH1cbiAgICBcdHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLy8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMzpcbiAgICBsb29rdXBOYW1lc3BhY2VVUkk6ZnVuY3Rpb24ocHJlZml4KXtcbiAgICBcdHZhciBlbCA9IHRoaXM7XG4gICAgXHR3aGlsZShlbCl7XG4gICAgXHRcdHZhciBtYXAgPSBlbC5fbnNNYXA7XG4gICAgXHRcdC8vY29uc29sZS5kaXIobWFwKVxuICAgIFx0XHRpZihtYXApe1xuICAgIFx0XHRcdGlmKHByZWZpeCBpbiBtYXApe1xuICAgIFx0XHRcdFx0cmV0dXJuIG1hcFtwcmVmaXhdIDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cbiAgICBcdFx0ZWwgPSBlbC5ub2RlVHlwZSA9PSBBVFRSSUJVVEVfTk9ERT9lbC5vd25lckRvY3VtZW50IDogZWwucGFyZW50Tm9kZTtcbiAgICBcdH1cbiAgICBcdHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLy8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMzpcbiAgICBpc0RlZmF1bHROYW1lc3BhY2U6ZnVuY3Rpb24obmFtZXNwYWNlVVJJKXtcbiAgICBcdHZhciBwcmVmaXggPSB0aGlzLmxvb2t1cFByZWZpeChuYW1lc3BhY2VVUkkpO1xuICAgIFx0cmV0dXJuIHByZWZpeCA9PSBudWxsO1xuICAgIH1cbn07XG5cblxuZnVuY3Rpb24gX3htbEVuY29kZXIoYyl7XG5cdHJldHVybiBjID09ICc8JyAmJiAnJmx0OycgfHxcbiAgICAgICAgIGMgPT0gJz4nICYmICcmZ3Q7JyB8fFxuICAgICAgICAgYyA9PSAnJicgJiYgJyZhbXA7JyB8fFxuICAgICAgICAgYyA9PSAnXCInICYmICcmcXVvdDsnIHx8XG4gICAgICAgICAnJiMnK2MuY2hhckNvZGVBdCgpKyc7J1xufVxuXG5cbmNvcHkoTm9kZVR5cGUsTm9kZSk7XG5jb3B5KE5vZGVUeXBlLE5vZGUucHJvdG90eXBlKTtcblxuLyoqXG4gKiBAcGFyYW0gY2FsbGJhY2sgcmV0dXJuIHRydWUgZm9yIGNvbnRpbnVlLGZhbHNlIGZvciBicmVha1xuICogQHJldHVybiBib29sZWFuIHRydWU6IGJyZWFrIHZpc2l0O1xuICovXG5mdW5jdGlvbiBfdmlzaXROb2RlKG5vZGUsY2FsbGJhY2spe1xuXHRpZihjYWxsYmFjayhub2RlKSl7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0aWYobm9kZSA9IG5vZGUuZmlyc3RDaGlsZCl7XG5cdFx0ZG97XG5cdFx0XHRpZihfdmlzaXROb2RlKG5vZGUsY2FsbGJhY2spKXtyZXR1cm4gdHJ1ZX1cbiAgICAgICAgfXdoaWxlKG5vZGU9bm9kZS5uZXh0U2libGluZylcbiAgICB9XG59XG5cblxuXG5mdW5jdGlvbiBEb2N1bWVudCgpe1xufVxuZnVuY3Rpb24gX29uQWRkQXR0cmlidXRlKGRvYyxlbCxuZXdBdHRyKXtcblx0ZG9jICYmIGRvYy5faW5jKys7XG5cdHZhciBucyA9IG5ld0F0dHIubmFtZXNwYWNlVVJJIDtcblx0aWYobnMgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyl7XG5cdFx0Ly91cGRhdGUgbmFtZXNwYWNlXG5cdFx0ZWwuX25zTWFwW25ld0F0dHIucHJlZml4P25ld0F0dHIubG9jYWxOYW1lOicnXSA9IG5ld0F0dHIudmFsdWVcblx0fVxufVxuZnVuY3Rpb24gX29uUmVtb3ZlQXR0cmlidXRlKGRvYyxlbCxuZXdBdHRyLHJlbW92ZSl7XG5cdGRvYyAmJiBkb2MuX2luYysrO1xuXHR2YXIgbnMgPSBuZXdBdHRyLm5hbWVzcGFjZVVSSSA7XG5cdGlmKG5zID09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycpe1xuXHRcdC8vdXBkYXRlIG5hbWVzcGFjZVxuXHRcdGRlbGV0ZSBlbC5fbnNNYXBbbmV3QXR0ci5wcmVmaXg/bmV3QXR0ci5sb2NhbE5hbWU6JyddXG5cdH1cbn1cbmZ1bmN0aW9uIF9vblVwZGF0ZUNoaWxkKGRvYyxlbCxuZXdDaGlsZCl7XG5cdGlmKGRvYyAmJiBkb2MuX2luYyl7XG5cdFx0ZG9jLl9pbmMrKztcblx0XHQvL3VwZGF0ZSBjaGlsZE5vZGVzXG5cdFx0dmFyIGNzID0gZWwuY2hpbGROb2Rlcztcblx0XHRpZihuZXdDaGlsZCl7XG5cdFx0XHRjc1tjcy5sZW5ndGgrK10gPSBuZXdDaGlsZDtcblx0XHR9ZWxzZXtcblx0XHRcdC8vY29uc29sZS5sb2coMSlcblx0XHRcdHZhciBjaGlsZCA9IGVsLmZpcnN0Q2hpbGQ7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRcdGNzW2krK10gPSBjaGlsZDtcblx0XHRcdFx0Y2hpbGQgPWNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0fVxuXHRcdFx0Y3MubGVuZ3RoID0gaTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBhdHRyaWJ1dGVzO1xuICogY2hpbGRyZW47XG4gKiBcbiAqIHdyaXRlYWJsZSBwcm9wZXJ0aWVzOlxuICogbm9kZVZhbHVlLEF0dHI6dmFsdWUsQ2hhcmFjdGVyRGF0YTpkYXRhXG4gKiBwcmVmaXhcbiAqL1xuZnVuY3Rpb24gX3JlbW92ZUNoaWxkKHBhcmVudE5vZGUsY2hpbGQpe1xuXHR2YXIgcHJldmlvdXMgPSBjaGlsZC5wcmV2aW91c1NpYmxpbmc7XG5cdHZhciBuZXh0ID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdGlmKHByZXZpb3VzKXtcblx0XHRwcmV2aW91cy5uZXh0U2libGluZyA9IG5leHQ7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUuZmlyc3RDaGlsZCA9IG5leHRcblx0fVxuXHRpZihuZXh0KXtcblx0XHRuZXh0LnByZXZpb3VzU2libGluZyA9IHByZXZpb3VzO1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmxhc3RDaGlsZCA9IHByZXZpb3VzO1xuXHR9XG5cdF9vblVwZGF0ZUNoaWxkKHBhcmVudE5vZGUub3duZXJEb2N1bWVudCxwYXJlbnROb2RlKTtcblx0cmV0dXJuIGNoaWxkO1xufVxuLyoqXG4gKiBwcmVmb3JtYW5jZSBrZXkocmVmQ2hpbGQgPT0gbnVsbClcbiAqL1xuZnVuY3Rpb24gX2luc2VydEJlZm9yZShwYXJlbnROb2RlLG5ld0NoaWxkLG5leHRDaGlsZCl7XG5cdHZhciBjcCA9IG5ld0NoaWxkLnBhcmVudE5vZGU7XG5cdGlmKGNwKXtcblx0XHRjcC5yZW1vdmVDaGlsZChuZXdDaGlsZCk7Ly9yZW1vdmUgYW5kIHVwZGF0ZVxuXHR9XG5cdGlmKG5ld0NoaWxkLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKXtcblx0XHR2YXIgbmV3Rmlyc3QgPSBuZXdDaGlsZC5maXJzdENoaWxkO1xuXHRcdGlmIChuZXdGaXJzdCA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdHZhciBuZXdMYXN0ID0gbmV3Q2hpbGQubGFzdENoaWxkO1xuXHR9ZWxzZXtcblx0XHRuZXdGaXJzdCA9IG5ld0xhc3QgPSBuZXdDaGlsZDtcblx0fVxuXHR2YXIgcHJlID0gbmV4dENoaWxkID8gbmV4dENoaWxkLnByZXZpb3VzU2libGluZyA6IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXG5cdG5ld0ZpcnN0LnByZXZpb3VzU2libGluZyA9IHByZTtcblx0bmV3TGFzdC5uZXh0U2libGluZyA9IG5leHRDaGlsZDtcblx0XG5cdFxuXHRpZihwcmUpe1xuXHRcdHByZS5uZXh0U2libGluZyA9IG5ld0ZpcnN0O1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXdGaXJzdDtcblx0fVxuXHRpZihuZXh0Q2hpbGQgPT0gbnVsbCl7XG5cdFx0cGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBuZXdMYXN0O1xuXHR9ZWxzZXtcblx0XHRuZXh0Q2hpbGQucHJldmlvdXNTaWJsaW5nID0gbmV3TGFzdDtcblx0fVxuXHRkb3tcblx0XHRuZXdGaXJzdC5wYXJlbnROb2RlID0gcGFyZW50Tm9kZTtcblx0fXdoaWxlKG5ld0ZpcnN0ICE9PSBuZXdMYXN0ICYmIChuZXdGaXJzdD0gbmV3Rmlyc3QubmV4dFNpYmxpbmcpKVxuXHRfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnR8fHBhcmVudE5vZGUscGFyZW50Tm9kZSk7XG5cdC8vY29uc29sZS5sb2cocGFyZW50Tm9kZS5sYXN0Q2hpbGQubmV4dFNpYmxpbmcgPT0gbnVsbClcblx0aWYgKG5ld0NoaWxkLm5vZGVUeXBlID09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcblx0XHRuZXdDaGlsZC5maXJzdENoaWxkID0gbmV3Q2hpbGQubGFzdENoaWxkID0gbnVsbDtcblx0fVxuXHRyZXR1cm4gbmV3Q2hpbGQ7XG59XG5mdW5jdGlvbiBfYXBwZW5kU2luZ2xlQ2hpbGQocGFyZW50Tm9kZSxuZXdDaGlsZCl7XG5cdHZhciBjcCA9IG5ld0NoaWxkLnBhcmVudE5vZGU7XG5cdGlmKGNwKXtcblx0XHR2YXIgcHJlID0gcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cdFx0Y3AucmVtb3ZlQ2hpbGQobmV3Q2hpbGQpOy8vcmVtb3ZlIGFuZCB1cGRhdGVcblx0XHR2YXIgcHJlID0gcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cdH1cblx0dmFyIHByZSA9IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXHRuZXdDaGlsZC5wYXJlbnROb2RlID0gcGFyZW50Tm9kZTtcblx0bmV3Q2hpbGQucHJldmlvdXNTaWJsaW5nID0gcHJlO1xuXHRuZXdDaGlsZC5uZXh0U2libGluZyA9IG51bGw7XG5cdGlmKHByZSl7XG5cdFx0cHJlLm5leHRTaWJsaW5nID0gbmV3Q2hpbGQ7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUuZmlyc3RDaGlsZCA9IG5ld0NoaWxkO1xuXHR9XG5cdHBhcmVudE5vZGUubGFzdENoaWxkID0gbmV3Q2hpbGQ7XG5cdF9vblVwZGF0ZUNoaWxkKHBhcmVudE5vZGUub3duZXJEb2N1bWVudCxwYXJlbnROb2RlLG5ld0NoaWxkKTtcblx0cmV0dXJuIG5ld0NoaWxkO1xuXHQvL2NvbnNvbGUubG9nKFwiX19hYVwiLHBhcmVudE5vZGUubGFzdENoaWxkLm5leHRTaWJsaW5nID09IG51bGwpXG59XG5Eb2N1bWVudC5wcm90b3R5cGUgPSB7XG5cdC8vaW1wbGVtZW50YXRpb24gOiBudWxsLFxuXHRub2RlTmFtZSA6ICAnI2RvY3VtZW50Jyxcblx0bm9kZVR5cGUgOiAgRE9DVU1FTlRfTk9ERSxcblx0ZG9jdHlwZSA6ICBudWxsLFxuXHRkb2N1bWVudEVsZW1lbnQgOiAgbnVsbCxcblx0X2luYyA6IDEsXG5cdFxuXHRpbnNlcnRCZWZvcmUgOiAgZnVuY3Rpb24obmV3Q2hpbGQsIHJlZkNoaWxkKXsvL3JhaXNlcyBcblx0XHRpZihuZXdDaGlsZC5ub2RlVHlwZSA9PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKXtcblx0XHRcdHZhciBjaGlsZCA9IG5ld0NoaWxkLmZpcnN0Q2hpbGQ7XG5cdFx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRcdHZhciBuZXh0ID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHRcdHRoaXMuaW5zZXJ0QmVmb3JlKGNoaWxkLHJlZkNoaWxkKTtcblx0XHRcdFx0Y2hpbGQgPSBuZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ld0NoaWxkO1xuXHRcdH1cblx0XHRpZih0aGlzLmRvY3VtZW50RWxlbWVudCA9PSBudWxsICYmIG5ld0NoaWxkLm5vZGVUeXBlID09IEVMRU1FTlRfTk9ERSl7XG5cdFx0XHR0aGlzLmRvY3VtZW50RWxlbWVudCA9IG5ld0NoaWxkO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gX2luc2VydEJlZm9yZSh0aGlzLG5ld0NoaWxkLHJlZkNoaWxkKSwobmV3Q2hpbGQub3duZXJEb2N1bWVudCA9IHRoaXMpLG5ld0NoaWxkO1xuXHR9LFxuXHRyZW1vdmVDaGlsZCA6ICBmdW5jdGlvbihvbGRDaGlsZCl7XG5cdFx0aWYodGhpcy5kb2N1bWVudEVsZW1lbnQgPT0gb2xkQ2hpbGQpe1xuXHRcdFx0dGhpcy5kb2N1bWVudEVsZW1lbnQgPSBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gX3JlbW92ZUNoaWxkKHRoaXMsb2xkQ2hpbGQpO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRpbXBvcnROb2RlIDogZnVuY3Rpb24oaW1wb3J0ZWROb2RlLGRlZXApe1xuXHRcdHJldHVybiBpbXBvcnROb2RlKHRoaXMsaW1wb3J0ZWROb2RlLGRlZXApO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRnZXRFbGVtZW50QnlJZCA6XHRmdW5jdGlvbihpZCl7XG5cdFx0dmFyIHJ0diA9IG51bGw7XG5cdFx0X3Zpc2l0Tm9kZSh0aGlzLmRvY3VtZW50RWxlbWVudCxmdW5jdGlvbihub2RlKXtcblx0XHRcdGlmKG5vZGUubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFKXtcblx0XHRcdFx0aWYobm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT0gaWQpe1xuXHRcdFx0XHRcdHJ0diA9IG5vZGU7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdHJldHVybiBydHY7XG5cdH0sXG5cdFxuXHQvL2RvY3VtZW50IGZhY3RvcnkgbWV0aG9kOlxuXHRjcmVhdGVFbGVtZW50IDpcdGZ1bmN0aW9uKHRhZ05hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEVsZW1lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSB0YWdOYW1lO1xuXHRcdG5vZGUudGFnTmFtZSA9IHRhZ05hbWU7XG5cdFx0bm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHRhdHRycy5fb3duZXJFbGVtZW50ID0gbm9kZTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlRG9jdW1lbnRGcmFnbWVudCA6XHRmdW5jdGlvbigpe1xuXHRcdHZhciBub2RlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVUZXh0Tm9kZSA6XHRmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBUZXh0KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQ29tbWVudCA6XHRmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBDb21tZW50KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQ0RBVEFTZWN0aW9uIDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IENEQVRBU2VjdGlvbigpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5hcHBlbmREYXRhKGRhdGEpXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZVByb2Nlc3NpbmdJbnN0cnVjdGlvbiA6XHRmdW5jdGlvbih0YXJnZXQsZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgUHJvY2Vzc2luZ0luc3RydWN0aW9uKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLnRhZ05hbWUgPSBub2RlLnRhcmdldCA9IHRhcmdldDtcblx0XHRub2RlLm5vZGVWYWx1ZT0gbm9kZS5kYXRhID0gZGF0YTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQXR0cmlidXRlIDpcdGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEF0dHIoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnRcdD0gdGhpcztcblx0XHRub2RlLm5hbWUgPSBuYW1lO1xuXHRcdG5vZGUubm9kZU5hbWVcdD0gbmFtZTtcblx0XHRub2RlLmxvY2FsTmFtZSA9IG5hbWU7XG5cdFx0bm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVFbnRpdHlSZWZlcmVuY2UgOlx0ZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRW50aXR5UmVmZXJlbmNlKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50XHQ9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZVx0PSBuYW1lO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVFbGVtZW50TlMgOlx0ZnVuY3Rpb24obmFtZXNwYWNlVVJJLHF1YWxpZmllZE5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEVsZW1lbnQoKTtcblx0XHR2YXIgcGwgPSBxdWFsaWZpZWROYW1lLnNwbGl0KCc6Jyk7XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHRub2RlLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUudGFnTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XG5cdFx0aWYocGwubGVuZ3RoID09IDIpe1xuXHRcdFx0bm9kZS5wcmVmaXggPSBwbFswXTtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcGxbMV07XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2VsLnByZWZpeCA9IG51bGw7XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0fVxuXHRcdGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVBdHRyaWJ1dGVOUyA6XHRmdW5jdGlvbihuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuXHRcdHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XG5cdFx0bm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuXHRcdGlmKHBsLmxlbmd0aCA9PSAyKXtcblx0XHRcdG5vZGUucHJlZml4ID0gcGxbMF07XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHBsWzFdO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly9lbC5wcmVmaXggPSBudWxsO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcbl9leHRlbmRzKERvY3VtZW50LE5vZGUpO1xuXG5cbmZ1bmN0aW9uIEVsZW1lbnQoKSB7XG5cdHRoaXMuX25zTWFwID0ge307XG59O1xuRWxlbWVudC5wcm90b3R5cGUgPSB7XG5cdG5vZGVUeXBlIDogRUxFTUVOVF9OT0RFLFxuXHRoYXNBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpIT1udWxsO1xuXHR9LFxuXHRnZXRBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKTtcblx0XHRyZXR1cm4gYXR0ciAmJiBhdHRyLnZhbHVlIHx8ICcnO1xuXHR9LFxuXHRnZXRBdHRyaWJ1dGVOb2RlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0obmFtZSk7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gXCJcIiArIHZhbHVlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlTm9kZShhdHRyKVxuXHR9LFxuXHRyZW1vdmVBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKVxuXHRcdGF0dHIgJiYgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuXHR9LFxuXHRcblx0Ly9mb3VyIHJlYWwgb3BlYXJ0aW9uIG1ldGhvZFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdFx0cmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG51bGwpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIF9hcHBlbmRTaW5nbGVDaGlsZCh0aGlzLG5ld0NoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5vZGUgOiBmdW5jdGlvbihuZXdBdHRyKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShuZXdBdHRyKTtcblx0fSxcblx0c2V0QXR0cmlidXRlTm9kZU5TIDogZnVuY3Rpb24obmV3QXR0cil7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW1OUyhuZXdBdHRyKTtcblx0fSxcblx0cmVtb3ZlQXR0cmlidXRlTm9kZSA6IGZ1bmN0aW9uKG9sZEF0dHIpe1xuXHRcdC8vY29uc29sZS5sb2codGhpcyA9PSBvbGRBdHRyLm93bmVyRWxlbWVudClcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnJlbW92ZU5hbWVkSXRlbShvbGRBdHRyLm5vZGVOYW1lKTtcblx0fSxcblx0Ly9nZXQgcmVhbCBhdHRyaWJ1dGUgbmFtZSxhbmQgcmVtb3ZlIGl0IGJ5IHJlbW92ZUF0dHJpYnV0ZU5vZGVcblx0cmVtb3ZlQXR0cmlidXRlTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSl7XG5cdFx0dmFyIG9sZCA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKTtcblx0XHRvbGQgJiYgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOb2RlKG9sZCk7XG5cdH0sXG5cdFxuXHRoYXNBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpIT1udWxsO1xuXHR9LFxuXHRnZXRBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKTtcblx0XHRyZXR1cm4gYXR0ciAmJiBhdHRyLnZhbHVlIHx8ICcnO1xuXHR9LFxuXHRzZXRBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSwgdmFsdWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZU5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XG5cdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gXCJcIiArIHZhbHVlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlTm9kZShhdHRyKVxuXHR9LFxuXHRnZXRBdHRyaWJ1dGVOb2RlTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSl7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW1OUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSk7XG5cdH0sXG5cdFxuXHRnZXRFbGVtZW50c0J5VGFnTmFtZSA6IGZ1bmN0aW9uKHRhZ05hbWUpe1xuXHRcdHJldHVybiBuZXcgTGl2ZU5vZGVMaXN0KHRoaXMsZnVuY3Rpb24oYmFzZSl7XG5cdFx0XHR2YXIgbHMgPSBbXTtcblx0XHRcdF92aXNpdE5vZGUoYmFzZSxmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0aWYobm9kZSAhPT0gYmFzZSAmJiBub2RlLm5vZGVUeXBlID09IEVMRU1FTlRfTk9ERSAmJiAodGFnTmFtZSA9PT0gJyonIHx8IG5vZGUudGFnTmFtZSA9PSB0YWdOYW1lKSl7XG5cdFx0XHRcdFx0bHMucHVzaChub2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbHM7XG5cdFx0fSk7XG5cdH0sXG5cdGdldEVsZW1lbnRzQnlUYWdOYW1lTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSl7XG5cdFx0cmV0dXJuIG5ldyBMaXZlTm9kZUxpc3QodGhpcyxmdW5jdGlvbihiYXNlKXtcblx0XHRcdHZhciBscyA9IFtdO1xuXHRcdFx0X3Zpc2l0Tm9kZShiYXNlLGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0XHRpZihub2RlICE9PSBiYXNlICYmIG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSAmJiAobmFtZXNwYWNlVVJJID09PSAnKicgfHwgbm9kZS5uYW1lc3BhY2VVUkkgPT09IG5hbWVzcGFjZVVSSSkgJiYgKGxvY2FsTmFtZSA9PT0gJyonIHx8IG5vZGUubG9jYWxOYW1lID09IGxvY2FsTmFtZSkpe1xuXHRcdFx0XHRcdGxzLnB1c2gobm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxzO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cbn07XG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBFbGVtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZTtcbkRvY3VtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TID0gRWxlbWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUztcblxuXG5fZXh0ZW5kcyhFbGVtZW50LE5vZGUpO1xuZnVuY3Rpb24gQXR0cigpIHtcbn07XG5BdHRyLnByb3RvdHlwZS5ub2RlVHlwZSA9IEFUVFJJQlVURV9OT0RFO1xuX2V4dGVuZHMoQXR0cixOb2RlKTtcblxuXG5mdW5jdGlvbiBDaGFyYWN0ZXJEYXRhKCkge1xufTtcbkNoYXJhY3RlckRhdGEucHJvdG90eXBlID0ge1xuXHRkYXRhIDogJycsXG5cdHN1YnN0cmluZ0RhdGEgOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50KSB7XG5cdFx0cmV0dXJuIHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0LCBvZmZzZXQrY291bnQpO1xuXHR9LFxuXHRhcHBlbmREYXRhOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0dGV4dCA9IHRoaXMuZGF0YSt0ZXh0O1xuXHRcdHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHR9LFxuXHRpbnNlcnREYXRhOiBmdW5jdGlvbihvZmZzZXQsdGV4dCkge1xuXHRcdHRoaXMucmVwbGFjZURhdGEob2Zmc2V0LDAsdGV4dCk7XG5cdFxuXHR9LFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0dGhyb3cgbmV3IEVycm9yKEV4Y2VwdGlvbk1lc3NhZ2VbSElFUkFSQ0hZX1JFUVVFU1RfRVJSXSlcblx0fSxcblx0ZGVsZXRlRGF0YTogZnVuY3Rpb24ob2Zmc2V0LCBjb3VudCkge1xuXHRcdHRoaXMucmVwbGFjZURhdGEob2Zmc2V0LGNvdW50LFwiXCIpO1xuXHR9LFxuXHRyZXBsYWNlRGF0YTogZnVuY3Rpb24ob2Zmc2V0LCBjb3VudCwgdGV4dCkge1xuXHRcdHZhciBzdGFydCA9IHRoaXMuZGF0YS5zdWJzdHJpbmcoMCxvZmZzZXQpO1xuXHRcdHZhciBlbmQgPSB0aGlzLmRhdGEuc3Vic3RyaW5nKG9mZnNldCtjb3VudCk7XG5cdFx0dGV4dCA9IHN0YXJ0ICsgdGV4dCArIGVuZDtcblx0XHR0aGlzLm5vZGVWYWx1ZSA9IHRoaXMuZGF0YSA9IHRleHQ7XG5cdFx0dGhpcy5sZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblx0fVxufVxuX2V4dGVuZHMoQ2hhcmFjdGVyRGF0YSxOb2RlKTtcbmZ1bmN0aW9uIFRleHQoKSB7XG59O1xuVGV4dC5wcm90b3R5cGUgPSB7XG5cdG5vZGVOYW1lIDogXCIjdGV4dFwiLFxuXHRub2RlVHlwZSA6IFRFWFRfTk9ERSxcblx0c3BsaXRUZXh0IDogZnVuY3Rpb24ob2Zmc2V0KSB7XG5cdFx0dmFyIHRleHQgPSB0aGlzLmRhdGE7XG5cdFx0dmFyIG5ld1RleHQgPSB0ZXh0LnN1YnN0cmluZyhvZmZzZXQpO1xuXHRcdHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBvZmZzZXQpO1xuXHRcdHRoaXMuZGF0YSA9IHRoaXMubm9kZVZhbHVlID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHRcdHZhciBuZXdOb2RlID0gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5ld1RleHQpO1xuXHRcdGlmKHRoaXMucGFyZW50Tm9kZSl7XG5cdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHRoaXMubmV4dFNpYmxpbmcpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3Tm9kZTtcblx0fVxufVxuX2V4dGVuZHMoVGV4dCxDaGFyYWN0ZXJEYXRhKTtcbmZ1bmN0aW9uIENvbW1lbnQoKSB7XG59O1xuQ29tbWVudC5wcm90b3R5cGUgPSB7XG5cdG5vZGVOYW1lIDogXCIjY29tbWVudFwiLFxuXHRub2RlVHlwZSA6IENPTU1FTlRfTk9ERVxufVxuX2V4dGVuZHMoQ29tbWVudCxDaGFyYWN0ZXJEYXRhKTtcblxuZnVuY3Rpb24gQ0RBVEFTZWN0aW9uKCkge1xufTtcbkNEQVRBU2VjdGlvbi5wcm90b3R5cGUgPSB7XG5cdG5vZGVOYW1lIDogXCIjY2RhdGEtc2VjdGlvblwiLFxuXHRub2RlVHlwZSA6IENEQVRBX1NFQ1RJT05fTk9ERVxufVxuX2V4dGVuZHMoQ0RBVEFTZWN0aW9uLENoYXJhY3RlckRhdGEpO1xuXG5cbmZ1bmN0aW9uIERvY3VtZW50VHlwZSgpIHtcbn07XG5Eb2N1bWVudFR5cGUucHJvdG90eXBlLm5vZGVUeXBlID0gRE9DVU1FTlRfVFlQRV9OT0RFO1xuX2V4dGVuZHMoRG9jdW1lbnRUeXBlLE5vZGUpO1xuXG5mdW5jdGlvbiBOb3RhdGlvbigpIHtcbn07XG5Ob3RhdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBOT1RBVElPTl9OT0RFO1xuX2V4dGVuZHMoTm90YXRpb24sTm9kZSk7XG5cbmZ1bmN0aW9uIEVudGl0eSgpIHtcbn07XG5FbnRpdHkucHJvdG90eXBlLm5vZGVUeXBlID0gRU5USVRZX05PREU7XG5fZXh0ZW5kcyhFbnRpdHksTm9kZSk7XG5cbmZ1bmN0aW9uIEVudGl0eVJlZmVyZW5jZSgpIHtcbn07XG5FbnRpdHlSZWZlcmVuY2UucHJvdG90eXBlLm5vZGVUeXBlID0gRU5USVRZX1JFRkVSRU5DRV9OT0RFO1xuX2V4dGVuZHMoRW50aXR5UmVmZXJlbmNlLE5vZGUpO1xuXG5mdW5jdGlvbiBEb2N1bWVudEZyYWdtZW50KCkge1xufTtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVOYW1lID1cdFwiI2RvY3VtZW50LWZyYWdtZW50XCI7XG5Eb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5ub2RlVHlwZSA9XHRET0NVTUVOVF9GUkFHTUVOVF9OT0RFO1xuX2V4dGVuZHMoRG9jdW1lbnRGcmFnbWVudCxOb2RlKTtcblxuXG5mdW5jdGlvbiBQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24oKSB7XG59XG5Qcm9jZXNzaW5nSW5zdHJ1Y3Rpb24ucHJvdG90eXBlLm5vZGVUeXBlID0gUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFO1xuX2V4dGVuZHMoUHJvY2Vzc2luZ0luc3RydWN0aW9uLE5vZGUpO1xuZnVuY3Rpb24gWE1MU2VyaWFsaXplcigpe31cblhNTFNlcmlhbGl6ZXIucHJvdG90eXBlLnNlcmlhbGl6ZVRvU3RyaW5nID0gZnVuY3Rpb24obm9kZSxpc0h0bWwsbm9kZUZpbHRlcil7XG5cdHJldHVybiBub2RlU2VyaWFsaXplVG9TdHJpbmcuY2FsbChub2RlLGlzSHRtbCxub2RlRmlsdGVyKTtcbn1cbk5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gbm9kZVNlcmlhbGl6ZVRvU3RyaW5nO1xuZnVuY3Rpb24gbm9kZVNlcmlhbGl6ZVRvU3RyaW5nKGlzSHRtbCxub2RlRmlsdGVyKXtcblx0dmFyIGJ1ZiA9IFtdO1xuXHR2YXIgcmVmTm9kZSA9IHRoaXMubm9kZVR5cGUgPT0gOT90aGlzLmRvY3VtZW50RWxlbWVudDp0aGlzO1xuXHR2YXIgcHJlZml4ID0gcmVmTm9kZS5wcmVmaXg7XG5cdHZhciB1cmkgPSByZWZOb2RlLm5hbWVzcGFjZVVSSTtcblx0XG5cdGlmKHVyaSAmJiBwcmVmaXggPT0gbnVsbCl7XG5cdFx0Ly9jb25zb2xlLmxvZyhwcmVmaXgpXG5cdFx0dmFyIHByZWZpeCA9IHJlZk5vZGUubG9va3VwUHJlZml4KHVyaSk7XG5cdFx0aWYocHJlZml4ID09IG51bGwpe1xuXHRcdFx0Ly9pc0hUTUwgPSB0cnVlO1xuXHRcdFx0dmFyIHZpc2libGVOYW1lc3BhY2VzPVtcblx0XHRcdHtuYW1lc3BhY2U6dXJpLHByZWZpeDpudWxsfVxuXHRcdFx0Ly97bmFtZXNwYWNlOnVyaSxwcmVmaXg6Jyd9XG5cdFx0XHRdXG5cdFx0fVxuXHR9XG5cdHNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMsYnVmLGlzSHRtbCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0Ly9jb25zb2xlLmxvZygnIyMjJyx0aGlzLm5vZGVUeXBlLHVyaSxwcmVmaXgsYnVmLmpvaW4oJycpKVxuXHRyZXR1cm4gYnVmLmpvaW4oJycpO1xufVxuZnVuY3Rpb24gbmVlZE5hbWVzcGFjZURlZmluZShub2RlLGlzSFRNTCwgdmlzaWJsZU5hbWVzcGFjZXMpIHtcblx0dmFyIHByZWZpeCA9IG5vZGUucHJlZml4fHwnJztcblx0dmFyIHVyaSA9IG5vZGUubmFtZXNwYWNlVVJJO1xuXHRpZiAoIXByZWZpeCAmJiAhdXJpKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKHByZWZpeCA9PT0gXCJ4bWxcIiAmJiB1cmkgPT09IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIgXG5cdFx0fHwgdXJpID09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRcblx0dmFyIGkgPSB2aXNpYmxlTmFtZXNwYWNlcy5sZW5ndGggXG5cdC8vY29uc29sZS5sb2coJ0BAQEAnLG5vZGUudGFnTmFtZSxwcmVmaXgsdXJpLHZpc2libGVOYW1lc3BhY2VzKVxuXHR3aGlsZSAoaS0tKSB7XG5cdFx0dmFyIG5zID0gdmlzaWJsZU5hbWVzcGFjZXNbaV07XG5cdFx0Ly8gZ2V0IG5hbWVzcGFjZSBwcmVmaXhcblx0XHQvL2NvbnNvbGUubG9nKG5vZGUubm9kZVR5cGUsbm9kZS50YWdOYW1lLG5zLnByZWZpeCxwcmVmaXgpXG5cdFx0aWYgKG5zLnByZWZpeCA9PSBwcmVmaXgpe1xuXHRcdFx0cmV0dXJuIG5zLm5hbWVzcGFjZSAhPSB1cmk7XG5cdFx0fVxuXHR9XG5cdC8vY29uc29sZS5sb2coaXNIVE1MLHVyaSxwcmVmaXg9PScnKVxuXHQvL2lmKGlzSFRNTCAmJiBwcmVmaXggPT1udWxsICYmIHVyaSA9PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpe1xuXHQvL1x0cmV0dXJuIGZhbHNlO1xuXHQvL31cblx0Ly9ub2RlLmZsYWcgPSAnMTExMTEnXG5cdC8vY29uc29sZS5lcnJvcigzLHRydWUsbm9kZS5mbGFnLG5vZGUucHJlZml4LG5vZGUubmFtZXNwYWNlVVJJKVxuXHRyZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZVRvU3RyaW5nKG5vZGUsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKXtcblx0aWYobm9kZUZpbHRlcil7XG5cdFx0bm9kZSA9IG5vZGVGaWx0ZXIobm9kZSk7XG5cdFx0aWYobm9kZSl7XG5cdFx0XHRpZih0eXBlb2Ygbm9kZSA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdGJ1Zi5wdXNoKG5vZGUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vYnVmLnNvcnQuYXBwbHkoYXR0cnMsIGF0dHJpYnV0ZVNvcnRlcik7XG5cdH1cblx0c3dpdGNoKG5vZGUubm9kZVR5cGUpe1xuXHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRpZiAoIXZpc2libGVOYW1lc3BhY2VzKSB2aXNpYmxlTmFtZXNwYWNlcyA9IFtdO1xuXHRcdHZhciBzdGFydFZpc2libGVOYW1lc3BhY2VzID0gdmlzaWJsZU5hbWVzcGFjZXMubGVuZ3RoO1xuXHRcdHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcblx0XHR2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR2YXIgbm9kZU5hbWUgPSBub2RlLnRhZ05hbWU7XG5cdFx0XG5cdFx0aXNIVE1MID0gIChodG1sbnMgPT09IG5vZGUubmFtZXNwYWNlVVJJKSB8fGlzSFRNTCBcblx0XHRidWYucHVzaCgnPCcsbm9kZU5hbWUpO1xuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHQvLyBhZGQgbmFtZXNwYWNlcyBmb3IgYXR0cmlidXRlc1xuXHRcdFx0dmFyIGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXHRcdFx0aWYgKGF0dHIucHJlZml4ID09ICd4bWxucycpIHtcblx0XHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogYXR0ci5sb2NhbE5hbWUsIG5hbWVzcGFjZTogYXR0ci52YWx1ZSB9KTtcblx0XHRcdH1lbHNlIGlmKGF0dHIubm9kZU5hbWUgPT0gJ3htbG5zJyl7XG5cdFx0XHRcdHZpc2libGVOYW1lc3BhY2VzLnB1c2goeyBwcmVmaXg6ICcnLCBuYW1lc3BhY2U6IGF0dHIudmFsdWUgfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHR2YXIgYXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRpZiAobmVlZE5hbWVzcGFjZURlZmluZShhdHRyLGlzSFRNTCwgdmlzaWJsZU5hbWVzcGFjZXMpKSB7XG5cdFx0XHRcdHZhciBwcmVmaXggPSBhdHRyLnByZWZpeHx8Jyc7XG5cdFx0XHRcdHZhciB1cmkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblx0XHRcdFx0dmFyIG5zID0gcHJlZml4ID8gJyB4bWxuczonICsgcHJlZml4IDogXCIgeG1sbnNcIjtcblx0XHRcdFx0YnVmLnB1c2gobnMsICc9XCInICwgdXJpICwgJ1wiJyk7XG5cdFx0XHRcdHZpc2libGVOYW1lc3BhY2VzLnB1c2goeyBwcmVmaXg6IHByZWZpeCwgbmFtZXNwYWNlOnVyaSB9KTtcblx0XHRcdH1cblx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGF0dHIsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHR9XG5cdFx0Ly8gYWRkIG5hbWVzcGFjZSBmb3IgY3VycmVudCBub2RlXHRcdFxuXHRcdGlmIChuZWVkTmFtZXNwYWNlRGVmaW5lKG5vZGUsaXNIVE1MLCB2aXNpYmxlTmFtZXNwYWNlcykpIHtcblx0XHRcdHZhciBwcmVmaXggPSBub2RlLnByZWZpeHx8Jyc7XG5cdFx0XHR2YXIgdXJpID0gbm9kZS5uYW1lc3BhY2VVUkk7XG5cdFx0XHR2YXIgbnMgPSBwcmVmaXggPyAnIHhtbG5zOicgKyBwcmVmaXggOiBcIiB4bWxuc1wiO1xuXHRcdFx0YnVmLnB1c2gobnMsICc9XCInICwgdXJpICwgJ1wiJyk7XG5cdFx0XHR2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHsgcHJlZml4OiBwcmVmaXgsIG5hbWVzcGFjZTp1cmkgfSk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmKGNoaWxkIHx8IGlzSFRNTCAmJiAhL14oPzptZXRhfGxpbmt8aW1nfGJyfGhyfGlucHV0KSQvaS50ZXN0KG5vZGVOYW1lKSl7XG5cdFx0XHRidWYucHVzaCgnPicpO1xuXHRcdFx0Ly9pZiBpcyBjZGF0YSBjaGlsZCBub2RlXG5cdFx0XHRpZihpc0hUTUwgJiYgL15zY3JpcHQkL2kudGVzdChub2RlTmFtZSkpe1xuXHRcdFx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRcdFx0aWYoY2hpbGQuZGF0YSl7XG5cdFx0XHRcdFx0XHRidWYucHVzaChjaGlsZC5kYXRhKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0XHRzZXJpYWxpemVUb1N0cmluZyhjaGlsZCxidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHRcdFx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJ1Zi5wdXNoKCc8Lycsbm9kZU5hbWUsJz4nKTtcblx0XHR9ZWxzZXtcblx0XHRcdGJ1Zi5wdXNoKCcvPicpO1xuXHRcdH1cblx0XHQvLyByZW1vdmUgYWRkZWQgdmlzaWJsZSBuYW1lc3BhY2VzXG5cdFx0Ly92aXNpYmxlTmFtZXNwYWNlcy5sZW5ndGggPSBzdGFydFZpc2libGVOYW1lc3BhY2VzO1xuXHRcdHJldHVybjtcblx0Y2FzZSBET0NVTUVOVF9OT0RFOlxuXHRjYXNlIERPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0XHRyZXR1cm47XG5cdGNhc2UgQVRUUklCVVRFX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCcgJyxub2RlLm5hbWUsJz1cIicsbm9kZS52YWx1ZS5yZXBsYWNlKC9bPCZcIl0vZyxfeG1sRW5jb2RlciksJ1wiJyk7XG5cdGNhc2UgVEVYVF9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaChub2RlLmRhdGEucmVwbGFjZSgvWzwmXS9nLF94bWxFbmNvZGVyKSk7XG5cdGNhc2UgQ0RBVEFfU0VDVElPTl9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggJzwhW0NEQVRBWycsbm9kZS5kYXRhLCddXT4nKTtcblx0Y2FzZSBDT01NRU5UX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCBcIjwhLS1cIixub2RlLmRhdGEsXCItLT5cIik7XG5cdGNhc2UgRE9DVU1FTlRfVFlQRV9OT0RFOlxuXHRcdHZhciBwdWJpZCA9IG5vZGUucHVibGljSWQ7XG5cdFx0dmFyIHN5c2lkID0gbm9kZS5zeXN0ZW1JZDtcblx0XHRidWYucHVzaCgnPCFET0NUWVBFICcsbm9kZS5uYW1lKTtcblx0XHRpZihwdWJpZCl7XG5cdFx0XHRidWYucHVzaCgnIFBVQkxJQyBcIicscHViaWQpO1xuXHRcdFx0aWYgKHN5c2lkICYmIHN5c2lkIT0nLicpIHtcblx0XHRcdFx0YnVmLnB1c2goICdcIiBcIicsc3lzaWQpO1xuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goJ1wiPicpO1xuXHRcdH1lbHNlIGlmKHN5c2lkICYmIHN5c2lkIT0nLicpe1xuXHRcdFx0YnVmLnB1c2goJyBTWVNURU0gXCInLHN5c2lkLCdcIj4nKTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBzdWIgPSBub2RlLmludGVybmFsU3Vic2V0O1xuXHRcdFx0aWYoc3ViKXtcblx0XHRcdFx0YnVmLnB1c2goXCIgW1wiLHN1YixcIl1cIik7XG5cdFx0XHR9XG5cdFx0XHRidWYucHVzaChcIj5cIik7XG5cdFx0fVxuXHRcdHJldHVybjtcblx0Y2FzZSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCBcIjw/XCIsbm9kZS50YXJnZXQsXCIgXCIsbm9kZS5kYXRhLFwiPz5cIik7XG5cdGNhc2UgRU5USVRZX1JFRkVSRU5DRV9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggJyYnLG5vZGUubm9kZU5hbWUsJzsnKTtcblx0Ly9jYXNlIEVOVElUWV9OT0RFOlxuXHQvL2Nhc2UgTk9UQVRJT05fTk9ERTpcblx0ZGVmYXVsdDpcblx0XHRidWYucHVzaCgnPz8nLG5vZGUubm9kZU5hbWUpO1xuXHR9XG59XG5mdW5jdGlvbiBpbXBvcnROb2RlKGRvYyxub2RlLGRlZXApe1xuXHR2YXIgbm9kZTI7XG5cdHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuXHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRub2RlMiA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKTtcblx0XHRub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuXHRcdC8vdmFyIGF0dHJzID0gbm9kZTIuYXR0cmlidXRlcztcblx0XHQvL3ZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG5cdFx0Ly9mb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0Ly9ub2RlMi5zZXRBdHRyaWJ1dGVOb2RlTlMoaW1wb3J0Tm9kZShkb2MsYXR0cnMuaXRlbShpKSxkZWVwKSk7XG5cdFx0Ly99XG5cdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHRicmVhaztcblx0Y2FzZSBBVFRSSUJVVEVfTk9ERTpcblx0XHRkZWVwID0gdHJ1ZTtcblx0XHRicmVhaztcblx0Ly9jYXNlIEVOVElUWV9SRUZFUkVOQ0VfTk9ERTpcblx0Ly9jYXNlIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTpcblx0Ly8vL2Nhc2UgVEVYVF9OT0RFOlxuXHQvL2Nhc2UgQ0RBVEFfU0VDVElPTl9OT0RFOlxuXHQvL2Nhc2UgQ09NTUVOVF9OT0RFOlxuXHQvL1x0ZGVlcCA9IGZhbHNlO1xuXHQvL1x0YnJlYWs7XG5cdC8vY2FzZSBET0NVTUVOVF9OT0RFOlxuXHQvL2Nhc2UgRE9DVU1FTlRfVFlQRV9OT0RFOlxuXHQvL2Nhbm5vdCBiZSBpbXBvcnRlZC5cblx0Ly9jYXNlIEVOVElUWV9OT0RFOlxuXHQvL2Nhc2UgTk9UQVRJT05fTk9ERe+8mlxuXHQvL2NhbiBub3QgaGl0IGluIGxldmVsM1xuXHQvL2RlZmF1bHQ6dGhyb3cgZTtcblx0fVxuXHRpZighbm9kZTIpe1xuXHRcdG5vZGUyID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpOy8vZmFsc2Vcblx0fVxuXHRub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuXHRub2RlMi5wYXJlbnROb2RlID0gbnVsbDtcblx0aWYoZGVlcCl7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdG5vZGUyLmFwcGVuZENoaWxkKGltcG9ydE5vZGUoZG9jLGNoaWxkLGRlZXApKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2RlMjtcbn1cbi8vXG4vL3ZhciBfcmVsYXRpb25NYXAgPSB7Zmlyc3RDaGlsZDoxLGxhc3RDaGlsZDoxLHByZXZpb3VzU2libGluZzoxLG5leHRTaWJsaW5nOjEsXG4vL1x0XHRcdFx0XHRhdHRyaWJ1dGVzOjEsY2hpbGROb2RlczoxLHBhcmVudE5vZGU6MSxkb2N1bWVudEVsZW1lbnQ6MSxkb2N0eXBlLH07XG5mdW5jdGlvbiBjbG9uZU5vZGUoZG9jLG5vZGUsZGVlcCl7XG5cdHZhciBub2RlMiA9IG5ldyBub2RlLmNvbnN0cnVjdG9yKCk7XG5cdGZvcih2YXIgbiBpbiBub2RlKXtcblx0XHR2YXIgdiA9IG5vZGVbbl07XG5cdFx0aWYodHlwZW9mIHYgIT0gJ29iamVjdCcgKXtcblx0XHRcdGlmKHYgIT0gbm9kZTJbbl0pe1xuXHRcdFx0XHRub2RlMltuXSA9IHY7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmKG5vZGUuY2hpbGROb2Rlcyl7XG5cdFx0bm9kZTIuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHR9XG5cdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdHN3aXRjaCAobm9kZTIubm9kZVR5cGUpIHtcblx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcztcblx0XHR2YXIgYXR0cnMyXHQ9IG5vZGUyLmF0dHJpYnV0ZXMgPSBuZXcgTmFtZWROb2RlTWFwKCk7XG5cdFx0dmFyIGxlbiA9IGF0dHJzLmxlbmd0aFxuXHRcdGF0dHJzMi5fb3duZXJFbGVtZW50ID0gbm9kZTI7XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdG5vZGUyLnNldEF0dHJpYnV0ZU5vZGUoY2xvbmVOb2RlKGRvYyxhdHRycy5pdGVtKGkpLHRydWUpKTtcblx0XHR9XG5cdFx0YnJlYWs7O1xuXHRjYXNlIEFUVFJJQlVURV9OT0RFOlxuXHRcdGRlZXAgPSB0cnVlO1xuXHR9XG5cdGlmKGRlZXApe1xuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRub2RlMi5hcHBlbmRDaGlsZChjbG9uZU5vZGUoZG9jLGNoaWxkLGRlZXApKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2RlMjtcbn1cblxuZnVuY3Rpb24gX19zZXRfXyhvYmplY3Qsa2V5LHZhbHVlKXtcblx0b2JqZWN0W2tleV0gPSB2YWx1ZVxufVxuLy9kbyBkeW5hbWljXG50cnl7XG5cdGlmKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSl7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KExpdmVOb2RlTGlzdC5wcm90b3R5cGUsJ2xlbmd0aCcse1xuXHRcdFx0Z2V0OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuJCRsZW5ndGg7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCd0ZXh0Q29udGVudCcse1xuXHRcdFx0Z2V0OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiBnZXRUZXh0Q29udGVudCh0aGlzKTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdHN3aXRjaCh0aGlzLm5vZGVUeXBlKXtcblx0XHRcdFx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0XHRcdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHRcdFx0XHR3aGlsZSh0aGlzLmZpcnN0Q2hpbGQpe1xuXHRcdFx0XHRcdFx0dGhpcy5yZW1vdmVDaGlsZCh0aGlzLmZpcnN0Q2hpbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihkYXRhIHx8IFN0cmluZyhkYXRhKSl7XG5cdFx0XHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vVE9ETzpcblx0XHRcdFx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSBkYXRhO1xuXHRcdFx0XHRcdHRoaXMubm9kZVZhbHVlID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0XG5cdFx0ZnVuY3Rpb24gZ2V0VGV4dENvbnRlbnQobm9kZSl7XG5cdFx0XHRzd2l0Y2gobm9kZS5ub2RlVHlwZSl7XG5cdFx0XHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRcdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHRcdFx0dmFyIGJ1ZiA9IFtdO1xuXHRcdFx0XHRub2RlID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdFx0XHR3aGlsZShub2RlKXtcblx0XHRcdFx0XHRpZihub2RlLm5vZGVUeXBlIT09NyAmJiBub2RlLm5vZGVUeXBlICE9PTgpe1xuXHRcdFx0XHRcdFx0YnVmLnB1c2goZ2V0VGV4dENvbnRlbnQobm9kZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRub2RlID0gbm9kZS5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYnVmLmpvaW4oJycpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIG5vZGUubm9kZVZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfX3NldF9fID0gZnVuY3Rpb24ob2JqZWN0LGtleSx2YWx1ZSl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZhbHVlKVxuXHRcdFx0b2JqZWN0WyckJCcra2V5XSA9IHZhbHVlXG5cdFx0fVxuXHR9XG59Y2F0Y2goZSl7Ly9pZThcbn1cblxuLy9pZih0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nKXtcblx0ZXhwb3J0cy5ET01JbXBsZW1lbnRhdGlvbiA9IERPTUltcGxlbWVudGF0aW9uO1xuXHRleHBvcnRzLlhNTFNlcmlhbGl6ZXIgPSBYTUxTZXJpYWxpemVyO1xuLy99XG4iLCIvL1s0XSAgIFx0TmFtZVN0YXJ0Q2hhclx0ICAgOjo9ICAgXHRcIjpcIiB8IFtBLVpdIHwgXCJfXCIgfCBbYS16XSB8IFsjeEMwLSN4RDZdIHwgWyN4RDgtI3hGNl0gfCBbI3hGOC0jeDJGRl0gfCBbI3gzNzAtI3gzN0RdIHwgWyN4MzdGLSN4MUZGRl0gfCBbI3gyMDBDLSN4MjAwRF0gfCBbI3gyMDcwLSN4MjE4Rl0gfCBbI3gyQzAwLSN4MkZFRl0gfCBbI3gzMDAxLSN4RDdGRl0gfCBbI3hGOTAwLSN4RkRDRl0gfCBbI3hGREYwLSN4RkZGRF0gfCBbI3gxMDAwMC0jeEVGRkZGXVxyXG4vL1s0YV0gICBcdE5hbWVDaGFyXHQgICA6Oj0gICBcdE5hbWVTdGFydENoYXIgfCBcIi1cIiB8IFwiLlwiIHwgWzAtOV0gfCAjeEI3IHwgWyN4MDMwMC0jeDAzNkZdIHwgWyN4MjAzRi0jeDIwNDBdXHJcbi8vWzVdICAgXHROYW1lXHQgICA6Oj0gICBcdE5hbWVTdGFydENoYXIgKE5hbWVDaGFyKSpcclxudmFyIG5hbWVTdGFydENoYXIgPSAvW0EtWl9hLXpcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXS8vL1xcdTEwMDAwLVxcdUVGRkZGXHJcbnZhciBuYW1lQ2hhciA9IG5ldyBSZWdFeHAoXCJbXFxcXC1cXFxcLjAtOVwiK25hbWVTdGFydENoYXIuc291cmNlLnNsaWNlKDEsLTEpK1wiXFxcXHUwMEI3XFxcXHUwMzAwLVxcXFx1MDM2RlxcXFx1MjAzRi1cXFxcdTIwNDBdXCIpO1xyXG52YXIgdGFnTmFtZVBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeJytuYW1lU3RhcnRDaGFyLnNvdXJjZStuYW1lQ2hhci5zb3VyY2UrJyooPzpcXDonK25hbWVTdGFydENoYXIuc291cmNlK25hbWVDaGFyLnNvdXJjZSsnKik/JCcpO1xyXG4vL3ZhciB0YWdOYW1lUGF0dGVybiA9IC9eW2EtekEtWl9dW1xcd1xcLVxcLl0qKD86XFw6W2EtekEtWl9dW1xcd1xcLVxcLl0qKT8kL1xyXG4vL3ZhciBoYW5kbGVycyA9ICdyZXNvbHZlRW50aXR5LGdldEV4dGVybmFsU3Vic2V0LGNoYXJhY3RlcnMsZW5kRG9jdW1lbnQsZW5kRWxlbWVudCxlbmRQcmVmaXhNYXBwaW5nLGlnbm9yYWJsZVdoaXRlc3BhY2UscHJvY2Vzc2luZ0luc3RydWN0aW9uLHNldERvY3VtZW50TG9jYXRvcixza2lwcGVkRW50aXR5LHN0YXJ0RG9jdW1lbnQsc3RhcnRFbGVtZW50LHN0YXJ0UHJlZml4TWFwcGluZyxub3RhdGlvbkRlY2wsdW5wYXJzZWRFbnRpdHlEZWNsLGVycm9yLGZhdGFsRXJyb3Isd2FybmluZyxhdHRyaWJ1dGVEZWNsLGVsZW1lbnREZWNsLGV4dGVybmFsRW50aXR5RGVjbCxpbnRlcm5hbEVudGl0eURlY2wsY29tbWVudCxlbmRDREFUQSxlbmREVEQsZW5kRW50aXR5LHN0YXJ0Q0RBVEEsc3RhcnREVEQsc3RhcnRFbnRpdHknLnNwbGl0KCcsJylcclxuXHJcbi8vU19UQUcsXHRTX0FUVFIsXHRTX0VRLFx0U19BVFRSX05PUVVPVF9WQUxVRVxyXG4vL1NfQVRUUl9TUEFDRSxcdFNfQVRUUl9FTkQsXHRTX1RBR19TUEFDRSwgU19UQUdfQ0xPU0VcclxudmFyIFNfVEFHID0gMDsvL3RhZyBuYW1lIG9mZmVycmluZ1xyXG52YXIgU19BVFRSID0gMTsvL2F0dHIgbmFtZSBvZmZlcnJpbmcgXHJcbnZhciBTX0FUVFJfU1BBQ0U9MjsvL2F0dHIgbmFtZSBlbmQgYW5kIHNwYWNlIG9mZmVyXHJcbnZhciBTX0VRID0gMzsvLz1zcGFjZT9cclxudmFyIFNfQVRUUl9OT1FVT1RfVkFMVUUgPSA0Oy8vYXR0ciB2YWx1ZShubyBxdW90IHZhbHVlIG9ubHkpXHJcbnZhciBTX0FUVFJfRU5EID0gNTsvL2F0dHIgdmFsdWUgZW5kIGFuZCBubyBzcGFjZShxdW90IGVuZClcclxudmFyIFNfVEFHX1NQQUNFID0gNjsvLyhhdHRyIHZhbHVlIGVuZCB8fCB0YWcgZW5kICkgJiYgKHNwYWNlIG9mZmVyKVxyXG52YXIgU19UQUdfQ0xPU0UgPSA3Oy8vY2xvc2VkIGVsPGVsIC8+XHJcblxyXG5mdW5jdGlvbiBYTUxSZWFkZXIoKXtcclxuXHRcclxufVxyXG5cclxuWE1MUmVhZGVyLnByb3RvdHlwZSA9IHtcclxuXHRwYXJzZTpmdW5jdGlvbihzb3VyY2UsZGVmYXVsdE5TTWFwLGVudGl0eU1hcCl7XHJcblx0XHR2YXIgZG9tQnVpbGRlciA9IHRoaXMuZG9tQnVpbGRlcjtcclxuXHRcdGRvbUJ1aWxkZXIuc3RhcnREb2N1bWVudCgpO1xyXG5cdFx0X2NvcHkoZGVmYXVsdE5TTWFwICxkZWZhdWx0TlNNYXAgPSB7fSlcclxuXHRcdHBhcnNlKHNvdXJjZSxkZWZhdWx0TlNNYXAsZW50aXR5TWFwLFxyXG5cdFx0XHRcdGRvbUJ1aWxkZXIsdGhpcy5lcnJvckhhbmRsZXIpO1xyXG5cdFx0ZG9tQnVpbGRlci5lbmREb2N1bWVudCgpO1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBwYXJzZShzb3VyY2UsZGVmYXVsdE5TTWFwQ29weSxlbnRpdHlNYXAsZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpe1xyXG5cdGZ1bmN0aW9uIGZpeGVkRnJvbUNoYXJDb2RlKGNvZGUpIHtcclxuXHRcdC8vIFN0cmluZy5wcm90b3R5cGUuZnJvbUNoYXJDb2RlIGRvZXMgbm90IHN1cHBvcnRzXHJcblx0XHQvLyA+IDIgYnl0ZXMgdW5pY29kZSBjaGFycyBkaXJlY3RseVxyXG5cdFx0aWYgKGNvZGUgPiAweGZmZmYpIHtcclxuXHRcdFx0Y29kZSAtPSAweDEwMDAwO1xyXG5cdFx0XHR2YXIgc3Vycm9nYXRlMSA9IDB4ZDgwMCArIChjb2RlID4+IDEwKVxyXG5cdFx0XHRcdCwgc3Vycm9nYXRlMiA9IDB4ZGMwMCArIChjb2RlICYgMHgzZmYpO1xyXG5cclxuXHRcdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3Vycm9nYXRlMSwgc3Vycm9nYXRlMik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gZW50aXR5UmVwbGFjZXIoYSl7XHJcblx0XHR2YXIgayA9IGEuc2xpY2UoMSwtMSk7XHJcblx0XHRpZihrIGluIGVudGl0eU1hcCl7XHJcblx0XHRcdHJldHVybiBlbnRpdHlNYXBba107IFxyXG5cdFx0fWVsc2UgaWYoay5jaGFyQXQoMCkgPT09ICcjJyl7XHJcblx0XHRcdHJldHVybiBmaXhlZEZyb21DaGFyQ29kZShwYXJzZUludChrLnN1YnN0cigxKS5yZXBsYWNlKCd4JywnMHgnKSkpXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKCdlbnRpdHkgbm90IGZvdW5kOicrYSk7XHJcblx0XHRcdHJldHVybiBhO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBhcHBlbmRUZXh0KGVuZCl7Ly9oYXMgc29tZSBidWdzXHJcblx0XHRpZihlbmQ+c3RhcnQpe1xyXG5cdFx0XHR2YXIgeHQgPSBzb3VyY2Uuc3Vic3RyaW5nKHN0YXJ0LGVuZCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdGxvY2F0b3ImJnBvc2l0aW9uKHN0YXJ0KTtcclxuXHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHh0LDAsZW5kLXN0YXJ0KTtcclxuXHRcdFx0c3RhcnQgPSBlbmRcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gcG9zaXRpb24ocCxtKXtcclxuXHRcdHdoaWxlKHA+PWxpbmVFbmQgJiYgKG0gPSBsaW5lUGF0dGVybi5leGVjKHNvdXJjZSkpKXtcclxuXHRcdFx0bGluZVN0YXJ0ID0gbS5pbmRleDtcclxuXHRcdFx0bGluZUVuZCA9IGxpbmVTdGFydCArIG1bMF0ubGVuZ3RoO1xyXG5cdFx0XHRsb2NhdG9yLmxpbmVOdW1iZXIrKztcclxuXHRcdFx0Ly9jb25zb2xlLmxvZygnbGluZSsrOicsbG9jYXRvcixzdGFydFBvcyxlbmRQb3MpXHJcblx0XHR9XHJcblx0XHRsb2NhdG9yLmNvbHVtbk51bWJlciA9IHAtbGluZVN0YXJ0KzE7XHJcblx0fVxyXG5cdHZhciBsaW5lU3RhcnQgPSAwO1xyXG5cdHZhciBsaW5lRW5kID0gMDtcclxuXHR2YXIgbGluZVBhdHRlcm4gPSAvLiooPzpcXHJcXG4/fFxcbil8LiokL2dcclxuXHR2YXIgbG9jYXRvciA9IGRvbUJ1aWxkZXIubG9jYXRvcjtcclxuXHRcclxuXHR2YXIgcGFyc2VTdGFjayA9IFt7Y3VycmVudE5TTWFwOmRlZmF1bHROU01hcENvcHl9XVxyXG5cdHZhciBjbG9zZU1hcCA9IHt9O1xyXG5cdHZhciBzdGFydCA9IDA7XHJcblx0d2hpbGUodHJ1ZSl7XHJcblx0XHR0cnl7XHJcblx0XHRcdHZhciB0YWdTdGFydCA9IHNvdXJjZS5pbmRleE9mKCc8JyxzdGFydCk7XHJcblx0XHRcdGlmKHRhZ1N0YXJ0PDApe1xyXG5cdFx0XHRcdGlmKCFzb3VyY2Uuc3Vic3RyKHN0YXJ0KS5tYXRjaCgvXlxccyokLykpe1xyXG5cdFx0XHRcdFx0dmFyIGRvYyA9IGRvbUJ1aWxkZXIuZG9jO1xyXG5cdCAgICBcdFx0XHR2YXIgdGV4dCA9IGRvYy5jcmVhdGVUZXh0Tm9kZShzb3VyY2Uuc3Vic3RyKHN0YXJ0KSk7XHJcblx0ICAgIFx0XHRcdGRvYy5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuXHQgICAgXHRcdFx0ZG9tQnVpbGRlci5jdXJyZW50RWxlbWVudCA9IHRleHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0YWdTdGFydD5zdGFydCl7XHJcblx0XHRcdFx0YXBwZW5kVGV4dCh0YWdTdGFydCk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3dpdGNoKHNvdXJjZS5jaGFyQXQodGFnU3RhcnQrMSkpe1xyXG5cdFx0XHRjYXNlICcvJzpcclxuXHRcdFx0XHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJz4nLHRhZ1N0YXJ0KzMpO1xyXG5cdFx0XHRcdHZhciB0YWdOYW1lID0gc291cmNlLnN1YnN0cmluZyh0YWdTdGFydCsyLGVuZCk7XHJcblx0XHRcdFx0dmFyIGNvbmZpZyA9IHBhcnNlU3RhY2sucG9wKCk7XHJcblx0XHRcdFx0aWYoZW5kPDApe1xyXG5cdFx0XHRcdFx0XHJcblx0ICAgICAgICBcdFx0dGFnTmFtZSA9IHNvdXJjZS5zdWJzdHJpbmcodGFnU3RhcnQrMikucmVwbGFjZSgvW1xcczxdLiovLCcnKTtcclxuXHQgICAgICAgIFx0XHQvL2NvbnNvbGUuZXJyb3IoJyNAQEBAQEAnK3RhZ05hbWUpXHJcblx0ICAgICAgICBcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKFwiZW5kIHRhZyBuYW1lOiBcIit0YWdOYW1lKycgaXMgbm90IGNvbXBsZXRlOicrY29uZmlnLnRhZ05hbWUpO1xyXG5cdCAgICAgICAgXHRcdGVuZCA9IHRhZ1N0YXJ0KzErdGFnTmFtZS5sZW5ndGg7XHJcblx0ICAgICAgICBcdH1lbHNlIGlmKHRhZ05hbWUubWF0Y2goL1xcczwvKSl7XHJcblx0ICAgICAgICBcdFx0dGFnTmFtZSA9IHRhZ05hbWUucmVwbGFjZSgvW1xcczxdLiovLCcnKTtcclxuXHQgICAgICAgIFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoXCJlbmQgdGFnIG5hbWU6IFwiK3RhZ05hbWUrJyBtYXliZSBub3QgY29tcGxldGUnKTtcclxuXHQgICAgICAgIFx0XHRlbmQgPSB0YWdTdGFydCsxK3RhZ05hbWUubGVuZ3RoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IocGFyc2VTdGFjay5sZW5ndGgscGFyc2VTdGFjaylcclxuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoY29uZmlnKTtcclxuXHRcdFx0XHR2YXIgbG9jYWxOU01hcCA9IGNvbmZpZy5sb2NhbE5TTWFwO1xyXG5cdFx0XHRcdHZhciBlbmRNYXRjaCA9IGNvbmZpZy50YWdOYW1lID09IHRhZ05hbWU7XHJcblx0XHRcdFx0dmFyIGVuZElnbm9yZUNhc2VNYWNoID0gZW5kTWF0Y2ggfHwgY29uZmlnLnRhZ05hbWUmJmNvbmZpZy50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpXHJcblx0XHQgICAgICAgIGlmKGVuZElnbm9yZUNhc2VNYWNoKXtcclxuXHRcdCAgICAgICAgXHRkb21CdWlsZGVyLmVuZEVsZW1lbnQoY29uZmlnLnVyaSxjb25maWcubG9jYWxOYW1lLHRhZ05hbWUpO1xyXG5cdFx0XHRcdFx0aWYobG9jYWxOU01hcCl7XHJcblx0XHRcdFx0XHRcdGZvcih2YXIgcHJlZml4IGluIGxvY2FsTlNNYXApe1xyXG5cdFx0XHRcdFx0XHRcdGRvbUJ1aWxkZXIuZW5kUHJlZml4TWFwcGluZyhwcmVmaXgpIDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoIWVuZE1hdGNoKXtcclxuXHRcdCAgICAgICAgICAgIFx0ZXJyb3JIYW5kbGVyLmZhdGFsRXJyb3IoXCJlbmQgdGFnIG5hbWU6IFwiK3RhZ05hbWUrJyBpcyBub3QgbWF0Y2ggdGhlIGN1cnJlbnQgc3RhcnQgdGFnTmFtZTonK2NvbmZpZy50YWdOYW1lICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHQgICAgICAgIH1lbHNle1xyXG5cdFx0ICAgICAgICBcdHBhcnNlU3RhY2sucHVzaChjb25maWcpXHJcblx0XHQgICAgICAgIH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRlbmQrKztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHQvLyBlbmQgZWxtZW50XHJcblx0XHRcdGNhc2UgJz8nOi8vIDw/Li4uPz5cclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbih0YWdTdGFydCk7XHJcblx0XHRcdFx0ZW5kID0gcGFyc2VJbnN0cnVjdGlvbihzb3VyY2UsdGFnU3RhcnQsZG9tQnVpbGRlcik7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJyEnOi8vIDwhZG9jdHlwZSw8IVtDREFUQSw8IS0tXHJcblx0XHRcdFx0bG9jYXRvciYmcG9zaXRpb24odGFnU3RhcnQpO1xyXG5cdFx0XHRcdGVuZCA9IHBhcnNlRENDKHNvdXJjZSx0YWdTdGFydCxkb21CdWlsZGVyLGVycm9ySGFuZGxlcik7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0bG9jYXRvciYmcG9zaXRpb24odGFnU3RhcnQpO1xyXG5cdFx0XHRcdHZhciBlbCA9IG5ldyBFbGVtZW50QXR0cmlidXRlcygpO1xyXG5cdFx0XHRcdHZhciBjdXJyZW50TlNNYXAgPSBwYXJzZVN0YWNrW3BhcnNlU3RhY2subGVuZ3RoLTFdLmN1cnJlbnROU01hcDtcclxuXHRcdFx0XHQvL2VsU3RhcnRFbmRcclxuXHRcdFx0XHR2YXIgZW5kID0gcGFyc2VFbGVtZW50U3RhcnRQYXJ0KHNvdXJjZSx0YWdTdGFydCxlbCxjdXJyZW50TlNNYXAsZW50aXR5UmVwbGFjZXIsZXJyb3JIYW5kbGVyKTtcclxuXHRcdFx0XHR2YXIgbGVuID0gZWwubGVuZ3RoO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKCFlbC5jbG9zZWQgJiYgZml4U2VsZkNsb3NlZChzb3VyY2UsZW5kLGVsLnRhZ05hbWUsY2xvc2VNYXApKXtcclxuXHRcdFx0XHRcdGVsLmNsb3NlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpZighZW50aXR5TWFwLm5ic3Ape1xyXG5cdFx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygndW5jbG9zZWQgeG1sIGF0dHJpYnV0ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsb2NhdG9yICYmIGxlbil7XHJcblx0XHRcdFx0XHR2YXIgbG9jYXRvcjIgPSBjb3B5TG9jYXRvcihsb2NhdG9yLHt9KTtcclxuXHRcdFx0XHRcdC8vdHJ5ey8vYXR0cmlidXRlIHBvc2l0aW9uIGZpeGVkXHJcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwO2k8bGVuO2krKyl7XHJcblx0XHRcdFx0XHRcdHZhciBhID0gZWxbaV07XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uKGEub2Zmc2V0KTtcclxuXHRcdFx0XHRcdFx0YS5sb2NhdG9yID0gY29weUxvY2F0b3IobG9jYXRvcix7fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL31jYXRjaChlKXtjb25zb2xlLmVycm9yKCdAQEBAQCcrZSl9XHJcblx0XHRcdFx0XHRkb21CdWlsZGVyLmxvY2F0b3IgPSBsb2NhdG9yMlxyXG5cdFx0XHRcdFx0aWYoYXBwZW5kRWxlbWVudChlbCxkb21CdWlsZGVyLGN1cnJlbnROU01hcCkpe1xyXG5cdFx0XHRcdFx0XHRwYXJzZVN0YWNrLnB1c2goZWwpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkb21CdWlsZGVyLmxvY2F0b3IgPSBsb2NhdG9yO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0aWYoYXBwZW5kRWxlbWVudChlbCxkb21CdWlsZGVyLGN1cnJlbnROU01hcCkpe1xyXG5cdFx0XHRcdFx0XHRwYXJzZVN0YWNrLnB1c2goZWwpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKGVsLnVyaSA9PT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnICYmICFlbC5jbG9zZWQpe1xyXG5cdFx0XHRcdFx0ZW5kID0gcGFyc2VIdG1sU3BlY2lhbENvbnRlbnQoc291cmNlLGVuZCxlbC50YWdOYW1lLGVudGl0eVJlcGxhY2VyLGRvbUJ1aWxkZXIpXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRlbmQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1jYXRjaChlKXtcclxuXHRcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKCdlbGVtZW50IHBhcnNlIGVycm9yOiAnK2UpXHJcblx0XHRcdC8vZXJyb3JIYW5kbGVyLmVycm9yKCdlbGVtZW50IHBhcnNlIGVycm9yOiAnK2UpO1xyXG5cdFx0XHRlbmQgPSAtMTtcclxuXHRcdFx0Ly90aHJvdyBlO1xyXG5cdFx0fVxyXG5cdFx0aWYoZW5kPnN0YXJ0KXtcclxuXHRcdFx0c3RhcnQgPSBlbmQ7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9UT0RPOiDov5nph4zmnInlj6/og71zYXjlm57pgIDvvIzmnInkvY3nva7plJnor6/po47pmalcclxuXHRcdFx0YXBwZW5kVGV4dChNYXRoLm1heCh0YWdTdGFydCxzdGFydCkrMSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIGNvcHlMb2NhdG9yKGYsdCl7XHJcblx0dC5saW5lTnVtYmVyID0gZi5saW5lTnVtYmVyO1xyXG5cdHQuY29sdW1uTnVtYmVyID0gZi5jb2x1bW5OdW1iZXI7XHJcblx0cmV0dXJuIHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAc2VlICNhcHBlbmRFbGVtZW50KHNvdXJjZSxlbFN0YXJ0RW5kLGVsLHNlbGZDbG9zZWQsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcixwYXJzZVN0YWNrKTtcclxuICogQHJldHVybiBlbmQgb2YgdGhlIGVsZW1lbnRTdGFydFBhcnQoZW5kIG9mIGVsZW1lbnRFbmRQYXJ0IGZvciBzZWxmQ2xvc2VkIGVsKVxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VFbGVtZW50U3RhcnRQYXJ0KHNvdXJjZSxzdGFydCxlbCxjdXJyZW50TlNNYXAsZW50aXR5UmVwbGFjZXIsZXJyb3JIYW5kbGVyKXtcclxuXHR2YXIgYXR0ck5hbWU7XHJcblx0dmFyIHZhbHVlO1xyXG5cdHZhciBwID0gKytzdGFydDtcclxuXHR2YXIgcyA9IFNfVEFHOy8vc3RhdHVzXHJcblx0d2hpbGUodHJ1ZSl7XHJcblx0XHR2YXIgYyA9IHNvdXJjZS5jaGFyQXQocCk7XHJcblx0XHRzd2l0Y2goYyl7XHJcblx0XHRjYXNlICc9JzpcclxuXHRcdFx0aWYocyA9PT0gU19BVFRSKXsvL2F0dHJOYW1lXHJcblx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCk7XHJcblx0XHRcdFx0cyA9IFNfRVE7XHJcblx0XHRcdH1lbHNlIGlmKHMgPT09IFNfQVRUUl9TUEFDRSl7XHJcblx0XHRcdFx0cyA9IFNfRVE7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vZmF0YWxFcnJvcjogZXF1YWwgbXVzdCBhZnRlciBhdHRyTmFtZSBvciBzcGFjZSBhZnRlciBhdHRyTmFtZVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIGVxdWFsIG11c3QgYWZ0ZXIgYXR0ck5hbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ1xcJyc6XHJcblx0XHRjYXNlICdcIic6XHJcblx0XHRcdGlmKHMgPT09IFNfRVEgfHwgcyA9PT0gU19BVFRSIC8vfHwgcyA9PSBTX0FUVFJfU1BBQ0VcclxuXHRcdFx0XHQpey8vZXF1YWxcclxuXHRcdFx0XHRpZihzID09PSBTX0FUVFIpe1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSB2YWx1ZSBtdXN0IGFmdGVyIFwiPVwiJylcclxuXHRcdFx0XHRcdGF0dHJOYW1lID0gc291cmNlLnNsaWNlKHN0YXJ0LHApXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHN0YXJ0ID0gcCsxO1xyXG5cdFx0XHRcdHAgPSBzb3VyY2UuaW5kZXhPZihjLHN0YXJ0KVxyXG5cdFx0XHRcdGlmKHA+MCl7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydC0xKTtcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfRU5EO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0Ly9mYXRhbEVycm9yOiBubyBlbmQgcXVvdCBtYXRjaFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgbm8gZW5kIFxcJycrYysnXFwnIG1hdGNoJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZSBpZihzID09IFNfQVRUUl9OT1FVT1RfVkFMVUUpe1xyXG5cdFx0XHRcdHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coYXR0ck5hbWUsdmFsdWUsc3RhcnQscClcclxuXHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUsc3RhcnQpO1xyXG5cdFx0XHRcdC8vY29uc29sZS5kaXIoZWwpXHJcblx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrYXR0ck5hbWUrJ1wiIG1pc3NlZCBzdGFydCBxdW90KCcrYysnKSEhJyk7XHJcblx0XHRcdFx0c3RhcnQgPSBwKzE7XHJcblx0XHRcdFx0cyA9IFNfQVRUUl9FTkRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly9mYXRhbEVycm9yOiBubyBlcXVhbCBiZWZvcmVcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtdXN0IGFmdGVyIFwiPVwiJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICcvJzpcclxuXHRcdFx0c3dpdGNoKHMpe1xyXG5cdFx0XHRjYXNlIFNfVEFHOlxyXG5cdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTtcclxuXHRcdFx0Y2FzZSBTX0FUVFJfRU5EOlxyXG5cdFx0XHRjYXNlIFNfVEFHX1NQQUNFOlxyXG5cdFx0XHRjYXNlIFNfVEFHX0NMT1NFOlxyXG5cdFx0XHRcdHMgPVNfVEFHX0NMT1NFO1xyXG5cdFx0XHRcdGVsLmNsb3NlZCA9IHRydWU7XHJcblx0XHRcdGNhc2UgU19BVFRSX05PUVVPVF9WQUxVRTpcclxuXHRcdFx0Y2FzZSBTX0FUVFI6XHJcblx0XHRcdGNhc2UgU19BVFRSX1NQQUNFOlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHQvL2Nhc2UgU19FUTpcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhdHRyaWJ1dGUgaW52YWxpZCBjbG9zZSBjaGFyKCcvJylcIilcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJyc6Ly9lbmQgZG9jdW1lbnRcclxuXHRcdFx0Ly90aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0JylcclxuXHRcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKCd1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcpO1xyXG5cdFx0XHRpZihzID09IFNfVEFHKXtcclxuXHRcdFx0XHRlbC5zZXRUYWdOYW1lKHNvdXJjZS5zbGljZShzdGFydCxwKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHA7XHJcblx0XHRjYXNlICc+JzpcclxuXHRcdFx0c3dpdGNoKHMpe1xyXG5cdFx0XHRjYXNlIFNfVEFHOlxyXG5cdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTtcclxuXHRcdFx0Y2FzZSBTX0FUVFJfRU5EOlxyXG5cdFx0XHRjYXNlIFNfVEFHX1NQQUNFOlxyXG5cdFx0XHRjYXNlIFNfVEFHX0NMT1NFOlxyXG5cdFx0XHRcdGJyZWFrOy8vbm9ybWFsXHJcblx0XHRcdGNhc2UgU19BVFRSX05PUVVPVF9WQUxVRTovL0NvbXBhdGlibGUgc3RhdGVcclxuXHRcdFx0Y2FzZSBTX0FUVFI6XHJcblx0XHRcdFx0dmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCk7XHJcblx0XHRcdFx0aWYodmFsdWUuc2xpY2UoLTEpID09PSAnLycpe1xyXG5cdFx0XHRcdFx0ZWwuY2xvc2VkICA9IHRydWU7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsLTEpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRjYXNlIFNfQVRUUl9TUEFDRTpcclxuXHRcdFx0XHRpZihzID09PSBTX0FUVFJfU1BBQ0Upe1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBhdHRyTmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYocyA9PSBTX0FUVFJfTk9RVU9UX1ZBTFVFKXtcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK3ZhbHVlKydcIiBtaXNzZWQgcXVvdChcIikhIScpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpLHN0YXJ0KVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0aWYoY3VycmVudE5TTWFwWycnXSAhPT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnIHx8ICF2YWx1ZS5tYXRjaCgvXig/OmRpc2FibGVkfGNoZWNrZWR8c2VsZWN0ZWQpJC9pKSl7XHJcblx0XHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK3ZhbHVlKydcIiBtaXNzZWQgdmFsdWUhISBcIicrdmFsdWUrJ1wiIGluc3RlYWQhIScpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbC5hZGQodmFsdWUsdmFsdWUsc3RhcnQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFNfRVE6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgbWlzc2VkISEnKTtcclxuXHRcdFx0fVxyXG4vL1x0XHRcdGNvbnNvbGUubG9nKHRhZ05hbWUsdGFnTmFtZVBhdHRlcm4sdGFnTmFtZVBhdHRlcm4udGVzdCh0YWdOYW1lKSlcclxuXHRcdFx0cmV0dXJuIHA7XHJcblx0XHQvKnhtbCBzcGFjZSAnXFx4MjAnIHwgI3g5IHwgI3hEIHwgI3hBOyAqL1xyXG5cdFx0Y2FzZSAnXFx1MDA4MCc6XHJcblx0XHRcdGMgPSAnICc7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHRpZihjPD0gJyAnKXsvL3NwYWNlXHJcblx0XHRcdFx0c3dpdGNoKHMpe1xyXG5cdFx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0XHRlbC5zZXRUYWdOYW1lKHNvdXJjZS5zbGljZShzdGFydCxwKSk7Ly90YWdOYW1lXHJcblx0XHRcdFx0XHRzID0gU19UQUdfU1BBQ0U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0XHRcdGF0dHJOYW1lID0gc291cmNlLnNsaWNlKHN0YXJ0LHApXHJcblx0XHRcdFx0XHRzID0gU19BVFRSX1NQQUNFO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOlxyXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUsc3RhcnQpXHJcblx0XHRcdFx0Y2FzZSBTX0FUVFJfRU5EOlxyXG5cdFx0XHRcdFx0cyA9IFNfVEFHX1NQQUNFO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Ly9jYXNlIFNfVEFHX1NQQUNFOlxyXG5cdFx0XHRcdC8vY2FzZSBTX0VROlxyXG5cdFx0XHRcdC8vY2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0Ly9cdHZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0XHQvL2lnbm9yZSB3YXJuaW5nXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXsvL25vdCBzcGFjZVxyXG4vL1NfVEFHLFx0U19BVFRSLFx0U19FUSxcdFNfQVRUUl9OT1FVT1RfVkFMVUVcclxuLy9TX0FUVFJfU1BBQ0UsXHRTX0FUVFJfRU5ELFx0U19UQUdfU1BBQ0UsIFNfVEFHX0NMT1NFXHJcblx0XHRcdFx0c3dpdGNoKHMpe1xyXG5cdFx0XHRcdC8vY2FzZSBTX1RBRzp2b2lkKCk7YnJlYWs7XHJcblx0XHRcdFx0Ly9jYXNlIFNfQVRUUjp2b2lkKCk7YnJlYWs7XHJcblx0XHRcdFx0Ly9jYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSX1NQQUNFOlxyXG5cdFx0XHRcdFx0dmFyIHRhZ05hbWUgPSAgZWwudGFnTmFtZTtcclxuXHRcdFx0XHRcdGlmKGN1cnJlbnROU01hcFsnJ10gIT09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyB8fCAhYXR0ck5hbWUubWF0Y2goL14oPzpkaXNhYmxlZHxjaGVja2VkfHNlbGVjdGVkKSQvaSkpe1xyXG5cdFx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJythdHRyTmFtZSsnXCIgbWlzc2VkIHZhbHVlISEgXCInK2F0dHJOYW1lKydcIiBpbnN0ZWFkMiEhJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSxhdHRyTmFtZSxzdGFydCk7XHJcblx0XHRcdFx0XHRzdGFydCA9IHA7XHJcblx0XHRcdFx0XHRzID0gU19BVFRSO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0FUVFJfRU5EOlxyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBzcGFjZSBpcyByZXF1aXJlZFwiJythdHRyTmFtZSsnXCIhIScpXHJcblx0XHRcdFx0Y2FzZSBTX1RBR19TUEFDRTpcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFI7XHJcblx0XHRcdFx0XHRzdGFydCA9IHA7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfRVE6XHJcblx0XHRcdFx0XHRzID0gU19BVFRSX05PUVVPVF9WQUxVRTtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlbGVtZW50cyBjbG9zZWQgY2hhcmFjdGVyICcvJyBhbmQgJz4nIG11c3QgYmUgY29ubmVjdGVkIHRvXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fS8vZW5kIG91dGVyIHN3aXRjaFxyXG5cdFx0Ly9jb25zb2xlLmxvZygncCsrJyxwKVxyXG5cdFx0cCsrO1xyXG5cdH1cclxufVxyXG4vKipcclxuICogQHJldHVybiB0cnVlIGlmIGhhcyBuZXcgbmFtZXNwYWNlIGRlZmluZVxyXG4gKi9cclxuZnVuY3Rpb24gYXBwZW5kRWxlbWVudChlbCxkb21CdWlsZGVyLGN1cnJlbnROU01hcCl7XHJcblx0dmFyIHRhZ05hbWUgPSBlbC50YWdOYW1lO1xyXG5cdHZhciBsb2NhbE5TTWFwID0gbnVsbDtcclxuXHQvL3ZhciBjdXJyZW50TlNNYXAgPSBwYXJzZVN0YWNrW3BhcnNlU3RhY2subGVuZ3RoLTFdLmN1cnJlbnROU01hcDtcclxuXHR2YXIgaSA9IGVsLmxlbmd0aDtcclxuXHR3aGlsZShpLS0pe1xyXG5cdFx0dmFyIGEgPSBlbFtpXTtcclxuXHRcdHZhciBxTmFtZSA9IGEucU5hbWU7XHJcblx0XHR2YXIgdmFsdWUgPSBhLnZhbHVlO1xyXG5cdFx0dmFyIG5zcCA9IHFOYW1lLmluZGV4T2YoJzonKTtcclxuXHRcdGlmKG5zcD4wKXtcclxuXHRcdFx0dmFyIHByZWZpeCA9IGEucHJlZml4ID0gcU5hbWUuc2xpY2UoMCxuc3ApO1xyXG5cdFx0XHR2YXIgbG9jYWxOYW1lID0gcU5hbWUuc2xpY2UobnNwKzEpO1xyXG5cdFx0XHR2YXIgbnNQcmVmaXggPSBwcmVmaXggPT09ICd4bWxucycgJiYgbG9jYWxOYW1lXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bG9jYWxOYW1lID0gcU5hbWU7XHJcblx0XHRcdHByZWZpeCA9IG51bGxcclxuXHRcdFx0bnNQcmVmaXggPSBxTmFtZSA9PT0gJ3htbG5zJyAmJiAnJ1xyXG5cdFx0fVxyXG5cdFx0Ly9jYW4gbm90IHNldCBwcmVmaXgsYmVjYXVzZSBwcmVmaXggIT09ICcnXHJcblx0XHRhLmxvY2FsTmFtZSA9IGxvY2FsTmFtZSA7XHJcblx0XHQvL3ByZWZpeCA9PSBudWxsIGZvciBubyBucyBwcmVmaXggYXR0cmlidXRlIFxyXG5cdFx0aWYobnNQcmVmaXggIT09IGZhbHNlKXsvL2hhY2shIVxyXG5cdFx0XHRpZihsb2NhbE5TTWFwID09IG51bGwpe1xyXG5cdFx0XHRcdGxvY2FsTlNNYXAgPSB7fVxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3VycmVudE5TTWFwLDApXHJcblx0XHRcdFx0X2NvcHkoY3VycmVudE5TTWFwLGN1cnJlbnROU01hcD17fSlcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGN1cnJlbnROU01hcCwxKVxyXG5cdFx0XHR9XHJcblx0XHRcdGN1cnJlbnROU01hcFtuc1ByZWZpeF0gPSBsb2NhbE5TTWFwW25zUHJlZml4XSA9IHZhbHVlO1xyXG5cdFx0XHRhLnVyaSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLydcclxuXHRcdFx0ZG9tQnVpbGRlci5zdGFydFByZWZpeE1hcHBpbmcobnNQcmVmaXgsIHZhbHVlKSBcclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIGkgPSBlbC5sZW5ndGg7XHJcblx0d2hpbGUoaS0tKXtcclxuXHRcdGEgPSBlbFtpXTtcclxuXHRcdHZhciBwcmVmaXggPSBhLnByZWZpeDtcclxuXHRcdGlmKHByZWZpeCl7Ly9ubyBwcmVmaXggYXR0cmlidXRlIGhhcyBubyBuYW1lc3BhY2VcclxuXHRcdFx0aWYocHJlZml4ID09PSAneG1sJyl7XHJcblx0XHRcdFx0YS51cmkgPSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcclxuXHRcdFx0fWlmKHByZWZpeCAhPT0gJ3htbG5zJyl7XHJcblx0XHRcdFx0YS51cmkgPSBjdXJyZW50TlNNYXBbcHJlZml4IHx8ICcnXVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8ve2NvbnNvbGUubG9nKCcjIyMnK2EucU5hbWUsZG9tQnVpbGRlci5sb2NhdG9yLnN5c3RlbUlkKycnLGN1cnJlbnROU01hcCxhLnVyaSl9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIG5zcCA9IHRhZ05hbWUuaW5kZXhPZignOicpO1xyXG5cdGlmKG5zcD4wKXtcclxuXHRcdHByZWZpeCA9IGVsLnByZWZpeCA9IHRhZ05hbWUuc2xpY2UoMCxuc3ApO1xyXG5cdFx0bG9jYWxOYW1lID0gZWwubG9jYWxOYW1lID0gdGFnTmFtZS5zbGljZShuc3ArMSk7XHJcblx0fWVsc2V7XHJcblx0XHRwcmVmaXggPSBudWxsOy8vaW1wb3J0YW50ISFcclxuXHRcdGxvY2FsTmFtZSA9IGVsLmxvY2FsTmFtZSA9IHRhZ05hbWU7XHJcblx0fVxyXG5cdC8vbm8gcHJlZml4IGVsZW1lbnQgaGFzIGRlZmF1bHQgbmFtZXNwYWNlXHJcblx0dmFyIG5zID0gZWwudXJpID0gY3VycmVudE5TTWFwW3ByZWZpeCB8fCAnJ107XHJcblx0ZG9tQnVpbGRlci5zdGFydEVsZW1lbnQobnMsbG9jYWxOYW1lLHRhZ05hbWUsZWwpO1xyXG5cdC8vZW5kUHJlZml4TWFwcGluZyBhbmQgc3RhcnRQcmVmaXhNYXBwaW5nIGhhdmUgbm90IGFueSBoZWxwIGZvciBkb20gYnVpbGRlclxyXG5cdC8vbG9jYWxOU01hcCA9IG51bGxcclxuXHRpZihlbC5jbG9zZWQpe1xyXG5cdFx0ZG9tQnVpbGRlci5lbmRFbGVtZW50KG5zLGxvY2FsTmFtZSx0YWdOYW1lKTtcclxuXHRcdGlmKGxvY2FsTlNNYXApe1xyXG5cdFx0XHRmb3IocHJlZml4IGluIGxvY2FsTlNNYXApe1xyXG5cdFx0XHRcdGRvbUJ1aWxkZXIuZW5kUHJlZml4TWFwcGluZyhwcmVmaXgpIFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fWVsc2V7XHJcblx0XHRlbC5jdXJyZW50TlNNYXAgPSBjdXJyZW50TlNNYXA7XHJcblx0XHRlbC5sb2NhbE5TTWFwID0gbG9jYWxOU01hcDtcclxuXHRcdC8vcGFyc2VTdGFjay5wdXNoKGVsKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsZWxTdGFydEVuZCx0YWdOYW1lLGVudGl0eVJlcGxhY2VyLGRvbUJ1aWxkZXIpe1xyXG5cdGlmKC9eKD86c2NyaXB0fHRleHRhcmVhKSQvaS50ZXN0KHRhZ05hbWUpKXtcclxuXHRcdHZhciBlbEVuZFN0YXJ0ID0gIHNvdXJjZS5pbmRleE9mKCc8LycrdGFnTmFtZSsnPicsZWxTdGFydEVuZCk7XHJcblx0XHR2YXIgdGV4dCA9IHNvdXJjZS5zdWJzdHJpbmcoZWxTdGFydEVuZCsxLGVsRW5kU3RhcnQpO1xyXG5cdFx0aWYoL1smPF0vLnRlc3QodGV4dCkpe1xyXG5cdFx0XHRpZigvXnNjcmlwdCQvaS50ZXN0KHRhZ05hbWUpKXtcclxuXHRcdFx0XHQvL2lmKCEvXFxdXFxdPi8udGVzdCh0ZXh0KSl7XHJcblx0XHRcdFx0XHQvL2xleEhhbmRsZXIuc3RhcnRDREFUQSgpO1xyXG5cdFx0XHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHRleHQsMCx0ZXh0Lmxlbmd0aCk7XHJcblx0XHRcdFx0XHQvL2xleEhhbmRsZXIuZW5kQ0RBVEEoKTtcclxuXHRcdFx0XHRcdHJldHVybiBlbEVuZFN0YXJ0O1xyXG5cdFx0XHRcdC8vfVxyXG5cdFx0XHR9Ly99ZWxzZXsvL3RleHQgYXJlYVxyXG5cdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh0ZXh0LDAsdGV4dC5sZW5ndGgpO1xyXG5cdFx0XHRcdHJldHVybiBlbEVuZFN0YXJ0O1xyXG5cdFx0XHQvL31cclxuXHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBlbFN0YXJ0RW5kKzE7XHJcbn1cclxuZnVuY3Rpb24gZml4U2VsZkNsb3NlZChzb3VyY2UsZWxTdGFydEVuZCx0YWdOYW1lLGNsb3NlTWFwKXtcclxuXHQvL2lmKHRhZ05hbWUgaW4gY2xvc2VNYXApe1xyXG5cdHZhciBwb3MgPSBjbG9zZU1hcFt0YWdOYW1lXTtcclxuXHRpZihwb3MgPT0gbnVsbCl7XHJcblx0XHQvL2NvbnNvbGUubG9nKHRhZ05hbWUpXHJcblx0XHRwb3MgPSAgc291cmNlLmxhc3RJbmRleE9mKCc8LycrdGFnTmFtZSsnPicpXHJcblx0XHRpZihwb3M8ZWxTdGFydEVuZCl7Ly/lv5jorrDpl63lkIhcclxuXHRcdFx0cG9zID0gc291cmNlLmxhc3RJbmRleE9mKCc8LycrdGFnTmFtZSlcclxuXHRcdH1cclxuXHRcdGNsb3NlTWFwW3RhZ05hbWVdID1wb3NcclxuXHR9XHJcblx0cmV0dXJuIHBvczxlbFN0YXJ0RW5kO1xyXG5cdC8vfSBcclxufVxyXG5mdW5jdGlvbiBfY29weShzb3VyY2UsdGFyZ2V0KXtcclxuXHRmb3IodmFyIG4gaW4gc291cmNlKXt0YXJnZXRbbl0gPSBzb3VyY2Vbbl19XHJcbn1cclxuZnVuY3Rpb24gcGFyc2VEQ0Moc291cmNlLHN0YXJ0LGRvbUJ1aWxkZXIsZXJyb3JIYW5kbGVyKXsvL3N1cmUgc3RhcnQgd2l0aCAnPCEnXHJcblx0dmFyIG5leHQ9IHNvdXJjZS5jaGFyQXQoc3RhcnQrMilcclxuXHRzd2l0Y2gobmV4dCl7XHJcblx0Y2FzZSAnLSc6XHJcblx0XHRpZihzb3VyY2UuY2hhckF0KHN0YXJ0ICsgMykgPT09ICctJyl7XHJcblx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignLS0+JyxzdGFydCs0KTtcclxuXHRcdFx0Ly9hcHBlbmQgY29tbWVudCBzb3VyY2Uuc3Vic3RyaW5nKDQsZW5kKS8vPCEtLVxyXG5cdFx0XHRpZihlbmQ+c3RhcnQpe1xyXG5cdFx0XHRcdGRvbUJ1aWxkZXIuY29tbWVudChzb3VyY2Usc3RhcnQrNCxlbmQtc3RhcnQtNCk7XHJcblx0XHRcdFx0cmV0dXJuIGVuZCszO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoXCJVbmNsb3NlZCBjb21tZW50XCIpO1xyXG5cdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdC8vZXJyb3JcclxuXHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0fVxyXG5cdGRlZmF1bHQ6XHJcblx0XHRpZihzb3VyY2Uuc3Vic3RyKHN0YXJ0KzMsNikgPT0gJ0NEQVRBWycpe1xyXG5cdFx0XHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJ11dPicsc3RhcnQrOSk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnRDREFUQSgpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnMoc291cmNlLHN0YXJ0KzksZW5kLXN0YXJ0LTkpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmVuZENEQVRBKCkgXHJcblx0XHRcdHJldHVybiBlbmQrMztcclxuXHRcdH1cclxuXHRcdC8vPCFET0NUWVBFXHJcblx0XHQvL3N0YXJ0RFREKGphdmEubGFuZy5TdHJpbmcgbmFtZSwgamF2YS5sYW5nLlN0cmluZyBwdWJsaWNJZCwgamF2YS5sYW5nLlN0cmluZyBzeXN0ZW1JZCkgXHJcblx0XHR2YXIgbWF0Y2hzID0gc3BsaXQoc291cmNlLHN0YXJ0KTtcclxuXHRcdHZhciBsZW4gPSBtYXRjaHMubGVuZ3RoO1xyXG5cdFx0aWYobGVuPjEgJiYgLyFkb2N0eXBlL2kudGVzdChtYXRjaHNbMF1bMF0pKXtcclxuXHRcdFx0dmFyIG5hbWUgPSBtYXRjaHNbMV1bMF07XHJcblx0XHRcdHZhciBwdWJpZCA9IGxlbj4zICYmIC9ecHVibGljJC9pLnRlc3QobWF0Y2hzWzJdWzBdKSAmJiBtYXRjaHNbM11bMF1cclxuXHRcdFx0dmFyIHN5c2lkID0gbGVuPjQgJiYgbWF0Y2hzWzRdWzBdO1xyXG5cdFx0XHR2YXIgbGFzdE1hdGNoID0gbWF0Y2hzW2xlbi0xXVxyXG5cdFx0XHRkb21CdWlsZGVyLnN0YXJ0RFREKG5hbWUscHViaWQgJiYgcHViaWQucmVwbGFjZSgvXihbJ1wiXSkoLio/KVxcMSQvLCckMicpLFxyXG5cdFx0XHRcdFx0c3lzaWQgJiYgc3lzaWQucmVwbGFjZSgvXihbJ1wiXSkoLio/KVxcMSQvLCckMicpKTtcclxuXHRcdFx0ZG9tQnVpbGRlci5lbmREVEQoKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBsYXN0TWF0Y2guaW5kZXgrbGFzdE1hdGNoWzBdLmxlbmd0aFxyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gLTE7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcGFyc2VJbnN0cnVjdGlvbihzb3VyY2Usc3RhcnQsZG9tQnVpbGRlcil7XHJcblx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCc/Picsc3RhcnQpO1xyXG5cdGlmKGVuZCl7XHJcblx0XHR2YXIgbWF0Y2ggPSBzb3VyY2Uuc3Vic3RyaW5nKHN0YXJ0LGVuZCkubWF0Y2goL148XFw/KFxcUyopXFxzKihbXFxzXFxTXSo/KVxccyokLyk7XHJcblx0XHRpZihtYXRjaCl7XHJcblx0XHRcdHZhciBsZW4gPSBtYXRjaFswXS5sZW5ndGg7XHJcblx0XHRcdGRvbUJ1aWxkZXIucHJvY2Vzc2luZ0luc3RydWN0aW9uKG1hdGNoWzFdLCBtYXRjaFsyXSkgO1xyXG5cdFx0XHRyZXR1cm4gZW5kKzI7XHJcblx0XHR9ZWxzZXsvL2Vycm9yXHJcblx0XHRcdHJldHVybiAtMTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIC0xO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIHNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gRWxlbWVudEF0dHJpYnV0ZXMoc291cmNlKXtcclxuXHRcclxufVxyXG5FbGVtZW50QXR0cmlidXRlcy5wcm90b3R5cGUgPSB7XHJcblx0c2V0VGFnTmFtZTpmdW5jdGlvbih0YWdOYW1lKXtcclxuXHRcdGlmKCF0YWdOYW1lUGF0dGVybi50ZXN0KHRhZ05hbWUpKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHRhZ05hbWU6Jyt0YWdOYW1lKVxyXG5cdFx0fVxyXG5cdFx0dGhpcy50YWdOYW1lID0gdGFnTmFtZVxyXG5cdH0sXHJcblx0YWRkOmZ1bmN0aW9uKHFOYW1lLHZhbHVlLG9mZnNldCl7XHJcblx0XHRpZighdGFnTmFtZVBhdHRlcm4udGVzdChxTmFtZSkpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXR0cmlidXRlOicrcU5hbWUpXHJcblx0XHR9XHJcblx0XHR0aGlzW3RoaXMubGVuZ3RoKytdID0ge3FOYW1lOnFOYW1lLHZhbHVlOnZhbHVlLG9mZnNldDpvZmZzZXR9XHJcblx0fSxcclxuXHRsZW5ndGg6MCxcclxuXHRnZXRMb2NhbE5hbWU6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0ubG9jYWxOYW1lfSxcclxuXHRnZXRMb2NhdG9yOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLmxvY2F0b3J9LFxyXG5cdGdldFFOYW1lOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLnFOYW1lfSxcclxuXHRnZXRVUkk6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0udXJpfSxcclxuXHRnZXRWYWx1ZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS52YWx1ZX1cclxuLy9cdCxnZXRJbmRleDpmdW5jdGlvbih1cmksIGxvY2FsTmFtZSkpe1xyXG4vL1x0XHRpZihsb2NhbE5hbWUpe1xyXG4vL1x0XHRcdFxyXG4vL1x0XHR9ZWxzZXtcclxuLy9cdFx0XHR2YXIgcU5hbWUgPSB1cmlcclxuLy9cdFx0fVxyXG4vL1x0fSxcclxuLy9cdGdldFZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5nZXRJbmRleC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSxcclxuLy9cdGdldFR5cGU6ZnVuY3Rpb24odXJpLGxvY2FsTmFtZSl7fVxyXG4vL1x0Z2V0VHlwZTpmdW5jdGlvbihpKXt9LFxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBfc2V0X3Byb3RvXyh0aGl6LHBhcmVudCl7XHJcblx0dGhpei5fX3Byb3RvX18gPSBwYXJlbnQ7XHJcblx0cmV0dXJuIHRoaXo7XHJcbn1cclxuaWYoIShfc2V0X3Byb3RvXyh7fSxfc2V0X3Byb3RvXy5wcm90b3R5cGUpIGluc3RhbmNlb2YgX3NldF9wcm90b18pKXtcclxuXHRfc2V0X3Byb3RvXyA9IGZ1bmN0aW9uKHRoaXoscGFyZW50KXtcclxuXHRcdGZ1bmN0aW9uIHAoKXt9O1xyXG5cdFx0cC5wcm90b3R5cGUgPSBwYXJlbnQ7XHJcblx0XHRwID0gbmV3IHAoKTtcclxuXHRcdGZvcihwYXJlbnQgaW4gdGhpeil7XHJcblx0XHRcdHBbcGFyZW50XSA9IHRoaXpbcGFyZW50XTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BsaXQoc291cmNlLHN0YXJ0KXtcclxuXHR2YXIgbWF0Y2g7XHJcblx0dmFyIGJ1ZiA9IFtdO1xyXG5cdHZhciByZWcgPSAvJ1teJ10rJ3xcIlteXCJdK1wifFteXFxzPD5cXC89XSs9P3woXFwvP1xccyo+fDwpL2c7XHJcblx0cmVnLmxhc3RJbmRleCA9IHN0YXJ0O1xyXG5cdHJlZy5leGVjKHNvdXJjZSk7Ly9za2lwIDxcclxuXHR3aGlsZShtYXRjaCA9IHJlZy5leGVjKHNvdXJjZSkpe1xyXG5cdFx0YnVmLnB1c2gobWF0Y2gpO1xyXG5cdFx0aWYobWF0Y2hbMV0pcmV0dXJuIGJ1ZjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydHMuWE1MUmVhZGVyID0gWE1MUmVhZGVyO1xyXG5cclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwibmFtZVwiOiBcInNiZ252aXpcIixcclxuICBcInZlcnNpb25cIjogXCIzLjEuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTQkdOUEQgdmlzdWFsaXphdGlvbiBsaWJyYXJ5XCIsXHJcbiAgXCJtYWluXCI6IFwic3JjL2luZGV4LmpzXCIsXHJcbiAgXCJsaWNlbmNlXCI6IFwiTEdQTC0zLjBcIixcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIixcclxuICAgIFwiYnVpbGQtc2JnbnZpei1qc1wiOiBcImd1bHAgYnVpbGRcIixcclxuICAgIFwiZGVidWctanNcIjogXCJub2RlbW9uIC1lIGpzIC0td2F0Y2ggc3JjIC14IFxcXCJucG0gcnVuIGJ1aWxkLXNiZ252aXotanNcXFwiXCJcclxuICB9LFxyXG4gIFwicmVwb3NpdG9yeVwiOiB7XHJcbiAgICBcInR5cGVcIjogXCJnaXRcIixcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzLmdpdFwiXHJcbiAgfSxcclxuICBcImJ1Z3NcIjoge1xyXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMvXCIsXHJcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwianF1ZXJ5XCI6IFwiXjIuMi40XCIsXHJcbiAgICBcImZpbGVzYXZlcmpzXCI6IFwifjAuMi4yXCIsXHJcbiAgICBcImN5dG9zY2FwZVwiOiBcImlWaXMtYXQtQmlsa2VudC9jeXRvc2NhcGUuanMjdW5zdGFibGVcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJsaWJzYmduLmpzXCI6IFwiZ2l0Oi8vZ2l0aHViLmNvbS9laXNibS9saWJzYmduLmpzXCIsXHJcbiAgICBcInByZXR0eS1kYXRhXCI6IFwiXjAuNDAuMFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcImJyb3dzZXJpZnlcIjogXCJeMTEuMi4wXCIsXHJcbiAgICBcImd1bHBcIjogXCJeMy45LjBcIixcclxuICAgIFwiZ3VscC1kZXJlcXVpcmVcIjogXCJeMi4xLjBcIixcclxuICAgIFwiZ3VscC1qc2hpbnRcIjogXCJeMS4xMS4yXCIsXHJcbiAgICBcImd1bHAtcHJvbXB0XCI6IFwiXjAuMS4yXCIsXHJcbiAgICBcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuNFwiLFxyXG4gICAgXCJndWxwLXNoZWxsXCI6IFwiXjAuNS4wXCIsXHJcbiAgICBcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxyXG4gICAgXCJqc2hpbnQtc3R5bGlzaFwiOiBcIl4yLjAuMVwiLFxyXG4gICAgXCJub2RlLW5vdGlmaWVyXCI6IFwiXjQuMy4xXCIsXHJcbiAgICBcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxyXG4gICAgXCJ2aW55bC1idWZmZXJcIjogXCJeMS4wLjBcIixcclxuICAgIFwidmlueWwtc291cmNlLXN0cmVhbVwiOiBcIl4xLjEuMFwiXHJcbiAgfVxyXG59XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBzYmdudml6ID0gd2luZG93LnNiZ252aXogPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcclxuICAgIHZhciBsaWJzID0ge307XHJcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XHJcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XHJcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXHJcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xyXG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XHJcbiAgICBcclxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTtcclxuICAgIFxyXG4gICAgdmFyIHNiZ25SZW5kZXJlciA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXInKTtcclxuICAgIHZhciBzYmduQ3lJbnN0YW5jZSA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktaW5zdGFuY2UnKTtcclxuICAgIFxyXG4gICAgLy8gVXRpbGl0aWVzIHdob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIGV4cG9zZWQgc2VwZXJhdGVseVxyXG4gICAgdmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdWktdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZmlsZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2ZpbGUtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcclxuICAgIHZhciBtYWluVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMnKTtcclxuICAgIHJlcXVpcmUoJy4vdXRpbGl0aWVzL2tleWJvYXJkLWlucHV0LXV0aWxpdGllcycpOyAvLyByZXF1aXJlIGtleWJvcmQgaW5wdXQgdXRpbGl0aWVzXHJcbiAgICAvLyBVdGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBhcyBpc1xyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxuICAgIFxyXG4gICAgc2JnblJlbmRlcmVyKCk7XHJcbiAgICBzYmduQ3lJbnN0YW5jZSgpO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxyXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzLCBtb3N0IHVzZXJzIHdpbGwgbm90IG5lZWQgdGhlc2VcclxuICAgIHNiZ252aXouZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGZpbGVVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IGZpbGVVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIGZpbGUgdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHVpVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSB1aVV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggc2JnbiBncmFwaCB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gZ3JhcGhVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IGdyYXBoVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gc2JnbnZpejtcclxuICB9XHJcbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncy5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcclxuXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcblxyXG52YXIgZ2V0Q29tcG91bmRQYWRkaW5ncyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIFJldHVybiBjYWxjdWxhdGVkIHBhZGRpbmdzIGluIGNhc2Ugb2YgdGhhdCBkYXRhIGlzIGludmFsaWQgcmV0dXJuIDVcclxuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzIHx8IDU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnQgbG9jYXRlZCBvbiB0aGUgZ2l2ZW4gYW5nbGUgb24gdGhlIGNpcmNsZSB3aXRoIHRoZSBnaXZlbiBjZW50ZXJhbCBjb29yZGluYXRlcyBhbmQgcmFkaXVzLlxyXG4gKi9cclxudmFyIGdldFBvaW50T25DaXJjbGUgPSBmdW5jdGlvbihjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlSW5EZWdyZWUpIHtcclxuXHR2YXIgYW5nbGVJblJhZGlhbiA9IGFuZ2xlSW5EZWdyZWUgKiAoIE1hdGguUEkgLyAxODAgKTsgLy8gQ29udmVydCBkZWdyZWUgdG8gcmFkaWFuXHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW4pICsgY2VudGVyWCxcclxuXHRcdHk6IC0xICogcmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbikgKyBjZW50ZXJZIC8vIFdlIG11bHRpcGx5IHdpdGggLTEgaGVyZSBiZWNhdXNlIEpTIHkgY29vcmRpbmF0ZSBzaWduIGlzIHRoZSBvcG9zaXRlIG9mIHRoZSBNYXRoYW1hdGljYWwgY29vcmRpbmF0ZXMgc3lzdGVtXHJcblx0fTtcclxufTtcclxuXHJcbi8qXHJcbiAqIEdlbmVyYXRlcyBhIHBvbHlnb24gc3RyaW5nIGFwcHJveGltYXRpbmcgYSBjaXJjbGUgd2l0aCBnaXZlbiBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCBhbmdsZXMgYW5kIG51bWJlciBvZiBwb2ludHMgdG8gcmVwcmVzZW50IHRoZSBjaXJjbGVcclxuICovXHJcbnZhciBnZW5lcmF0ZUNpcmNsZVN0cmluZyA9IGZ1bmN0aW9uKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVGcm9tLCBhbmdsZVRvLCBudW1PZlBvaW50cykge1xyXG5cdHZhciBjaXJjbGVTdHIgPSBcIlwiO1xyXG5cdHZhciBzdGVwU2l6ZSA9ICggYW5nbGVUbyAtIGFuZ2xlRnJvbSApIC8gbnVtT2ZQb2ludHM7IC8vIFdlIHdpbGwgaW5jcmVtZW50IHRoZSBjdXJyZW50IGFuZ2xlIGJ5IHN0ZXAgc2l6ZSBpbiBlYWNoIGl0ZXJhdGlvblxyXG5cdHZhciBjdXJyZW50QW5nbGUgPSBhbmdsZUZyb207IC8vIGN1cnJlbnQgYW5nbGUgd2lsbCBiZSB1cGRhdGVkIGluIGVhY2ggaXRlcmF0aW9uXHJcblx0XHJcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgbnVtT2ZQb2ludHM7IGkrKyApIHtcclxuXHRcdHZhciBwb2ludCA9IGdldFBvaW50T25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBjdXJyZW50QW5nbGUpO1xyXG5cdFx0Y3VycmVudEFuZ2xlICs9IHN0ZXBTaXplO1xyXG5cdFx0Y2lyY2xlU3RyICs9IHBvaW50LnggKyBcIiBcIiArIHBvaW50LnkgKyBcIiBcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIGNpcmNsZVN0cjtcclxufTtcclxuXHJcbi8qXHJcbiAqICBHZW5lcmF0ZXMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHByb2Nlc3Nlcy9sb2dpY2FsIG9wZXJhdG9ycyB3aXRoIHBvcnRzLlxyXG4gKiAgbGluZUhXOiBIYWxmIHdpZHRoIG9mIGxpbmUgdGhyb3VnaCB0aGUgY2lyY2xlIHRvIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnRcclxuICogIHNoYXBlSFc6IEhhbGYgd2lkdGggb2YgdGhlIHNoYXBlIGRpc2NsdWRpbmcgdGhlIHBvcnRzIChJdCBpcyByYWRpdXMgZm9yIHRoZSBjaXJjdWxhciBzaGFwZXMpXHJcbiAqICB0eXBlOiBUeXBlIG9mIHRoZSBzaGFwZSBkaXNjbHVkaW5nIHRoZSBwb3J0cy4gT3B0aW9ucyBhcmUgJ2NpcmNsZScsICdyZWN0YW5nbGUnXHJcbiAqICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24gb2YgdGhlIHBvcnRzIE9wdGlvbnMgYXJlICdob3Jpem9udGFsJywgJ3ZlcnRpY2FsJ1xyXG4gKi9cclxuXHJcbnZhciBnZW5lcmF0ZVNoYXBlV2l0aFBvcnRTdHJpbmcgPSBmdW5jdGlvbihsaW5lSFcsIHNoYXBlSFcsIHR5cGUsIG9yaWVudGF0aW9uKSB7XHJcblx0dmFyIHBvbHlnb25TdHI7XHJcbiAgICB2YXIgbnVtT2ZQb2ludHMgPSAzMDsgLy8gTnVtYmVyIG9mIHBvaW50cyB0aGF0IGJvdGggaGFsdmVzIG9mIGNpcmNsZSB3aWxsIGhhdmVcclxuXHRpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xyXG5cdFx0dmFyIGFib3ZlUG9pbnRzLCBiZWxvd1BvaW50cztcclxuXHRcclxuXHRcdGlmICh0eXBlID09PSAnY2lyY2xlJykge1xyXG5cdFx0XHRhYm92ZVBvaW50cyA9IGdlbmVyYXRlQ2lyY2xlU3RyaW5nKDAsIDAsIHNoYXBlSFcsIDE4MCwgMCwgbnVtT2ZQb2ludHMpO1xyXG5cdFx0XHRiZWxvd1BvaW50cyA9IGdlbmVyYXRlQ2lyY2xlU3RyaW5nKDAsIDAsIHNoYXBlSFcsIDM2MCwgMTgwLCBudW1PZlBvaW50cyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlID09PSAncmVjdGFuZ2xlJykge1xyXG5cdFx0XHRhYm92ZVBvaW50cyA9ICctJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgJztcclxuXHRcdFx0YmVsb3dQb2ludHMgPSBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgJztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cG9seWdvblN0ciA9IFwiLTEgLVwiICsgbGluZUhXICsgXCIgLVwiICsgc2hhcGVIVyArIFwiIC1cIiArIGxpbmVIVyArIFwiIFwiO1x0XHJcblx0XHRwb2x5Z29uU3RyICs9IGFib3ZlUG9pbnRzO1xyXG5cdFx0cG9seWdvblN0ciArPSBzaGFwZUhXICsgXCIgLVwiICsgbGluZUhXICsgXCIgMSAtXCIgKyBsaW5lSFcgKyBcIiAxIFwiICsgbGluZUhXICsgXCIgXCIgKyBzaGFwZUhXICsgXCIgXCIgKyBsaW5lSFcgKyBcIiBcIjtcclxuXHRcdHBvbHlnb25TdHIgKz0gYmVsb3dQb2ludHM7XHJcblx0XHRwb2x5Z29uU3RyICs9IFwiLVwiICsgc2hhcGVIVyArIFwiIFwiICsgbGluZUhXICsgXCIgLTEgXCIgKyBsaW5lSFc7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dmFyIGxlZnRQb2ludHMsIHJpZ2h0UG9pbnRzO1xyXG5cdFx0XHJcblx0XHRpZiAodHlwZSA9PT0gJ2NpcmNsZScpIHtcclxuXHRcdFx0bGVmdFBvaW50cyA9IGdlbmVyYXRlQ2lyY2xlU3RyaW5nKDAsIDAsIHNoYXBlSFcsIDkwLCAyNzAsIG51bU9mUG9pbnRzKTtcclxuXHRcdFx0cmlnaHRQb2ludHMgPSBnZW5lcmF0ZUNpcmNsZVN0cmluZygwLCAwLCBzaGFwZUhXLCAtOTAsIDkwLCBudW1PZlBvaW50cyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlID09PSAncmVjdGFuZ2xlJykge1xyXG5cdFx0XHRsZWZ0UG9pbnRzID0gJy0nICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAnO1xyXG5cdFx0XHRyaWdodFBvaW50cyA9IHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAnOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cG9seWdvblN0ciA9IFwiLVwiICsgbGluZUhXICsgXCIgLVwiICsgMSArIFwiIC1cIiArIGxpbmVIVyArIFwiIC1cIiArIHNoYXBlSFcgKyBcIiBcIjtcclxuXHRcdHBvbHlnb25TdHIgKz0gbGVmdFBvaW50cztcclxuXHRcdHBvbHlnb25TdHIgKz0gXCItXCIgKyBsaW5lSFcgKyBcIiBcIiArIHNoYXBlSFcgKyBcIiAtXCIgKyBsaW5lSFcgKyBcIiAxIFwiICsgbGluZUhXICsgXCIgMSBcIiArIGxpbmVIVyArIFwiIFwiICsgc2hhcGVIVyArIFwiIFwiO1xyXG5cdFx0cG9seWdvblN0ciArPSByaWdodFBvaW50cztcclxuXHRcdHBvbHlnb25TdHIgKz0gbGluZUhXICsgXCIgLVwiICsgc2hhcGVIVyArIFwiIFwiICsgbGluZUhXICsgXCIgLTFcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHBvbHlnb25TdHI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY29udGFpbmVyU2VsZWN0b3IgPSBvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcjtcclxuICB2YXIgaW1nUGF0aCA9IG9wdGlvbnMuaW1nUGF0aDtcclxuICBcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKVxyXG4gIHtcclxuICAgIHZhciBzYmduTmV0d29ya0NvbnRhaW5lciA9ICQoY29udGFpbmVyU2VsZWN0b3IpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBhbmQgaW5pdCBjeXRvc2NhcGU6XHJcbiAgICB2YXIgY3kgPSBjeXRvc2NhcGUoe1xyXG4gICAgICBjb250YWluZXI6IHNiZ25OZXR3b3JrQ29udGFpbmVyLFxyXG4gICAgICBzdHlsZTogc2JnblN0eWxlU2hlZXQsXHJcbiAgICAgIHNob3dPdmVybGF5OiBmYWxzZSwgbWluWm9vbTogMC4xMjUsIG1heFpvb206IDE2LFxyXG4gICAgICBib3hTZWxlY3Rpb25FbmFibGVkOiB0cnVlLFxyXG4gICAgICBtb3Rpb25CbHVyOiB0cnVlLFxyXG4gICAgICB3aGVlbFNlbnNpdGl2aXR5OiAwLjEsXHJcbiAgICAgIHJlYWR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmN5ID0gdGhpcztcclxuICAgICAgICAvLyBJZiB1bmRvYWJsZSByZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgICAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBiaW5kQ3lFdmVudHMoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gTm90ZSB0aGF0IGluIENoaVNFIHRoaXMgZnVuY3Rpb24gaXMgaW4gYSBzZXBlcmF0ZSBmaWxlIGJ1dCBpbiB0aGUgdmlld2VyIGl0IGhhcyBqdXN0IDIgbWV0aG9kcyBhbmQgc28gaXQgaXMgbG9jYXRlZCBpbiB0aGlzIGZpbGVcclxuICBmdW5jdGlvbiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpIHtcclxuICAgIC8vIGNyZWF0ZSBvciBnZXQgdGhlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuXHJcbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVOb2Rlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZU5vZGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gYmluZEN5RXZlbnRzKCkge1xyXG4gICAgY3kub24oJ3RhcGVuZCcsICdub2RlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5iZWZvcmVjb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgLy9UaGUgY2hpbGRyZW4gaW5mbyBvZiBjb21wbGV4IG5vZGVzIHNob3VsZCBiZSBzaG93biB3aGVuIHRoZXkgYXJlIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgLy9UaGUgbm9kZSBpcyBiZWluZyBjb2xsYXBzZWQgc3RvcmUgaW5mb2xhYmVsIHRvIHVzZSBpdCBsYXRlclxyXG4gICAgICAgIHZhciBpbmZvTGFiZWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldEluZm9MYWJlbChub2RlKTtcclxuICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsID0gaW5mb0xhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xyXG4gICAgICAvLyByZW1vdmUgYmVuZCBwb2ludHMgYmVmb3JlIGNvbGxhcHNlXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xyXG4gICAgICAgIGlmIChlZGdlLmhhc0NsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpKSB7XHJcbiAgICAgICAgICBlZGdlLnJlbW92ZUNsYXNzKCdlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cycpO1xyXG4gICAgICAgICAgZGVsZXRlIGVkZ2UuX3ByaXZhdGUuY2xhc3Nlc1snZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0cycsIFtdKTtcclxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmJlZm9yZWV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgbm9kZS5yZW1vdmVEYXRhKFwiaW5mb0xhYmVsXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5hZnRlcmV4cGFuZFwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgY3kubm9kZXMoKS51cGRhdGVDb21wb3VuZEJvdW5kcygpO1xyXG4gICAgICAvL0Rvbid0IHNob3cgY2hpbGRyZW4gaW5mbyB3aGVuIHRoZSBjb21wbGV4IG5vZGUgaXMgZXhwYW5kZWRcclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2NvbnRlbnQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YXIgc2JnblN0eWxlU2hlZXQgPSBjeXRvc2NhcGUuc3R5bGVzaGVldCgpXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAgICAgICAgICd0ZXh0LW9wYWNpdHknOiAxLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDEsXHJcbiAgICAgICAgICAgICdwYWRkaW5nJzogMFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50XCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3BhZGRpbmcnOiBnZXRDb21wb3VuZFBhZGRpbmdzXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVs/Y2xvbmVtYXJrZXJdW2NsYXNzPSdwZXJ0dXJiaW5nIGFnZW50J10sbm9kZVs/Y2xvbmVtYXJrZXJdW2NsYXNzPSd1bnNwZWNpZmllZCBlbnRpdHknXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogaW1nUGF0aCArICcvY2xvbmVfYmcucG5nJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCc6ICc1MCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC13aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaGVpZ2h0JzogJzI1JScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdjbG9uZW1hcmtlcicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lTaGFwZShlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29udGVudCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbGVtZW50Q29udGVudChlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdhc3NvY2lhdGlvbiddLFtjbGFzcz0nZGlzc29jaWF0aW9uJ10sW2NsYXNzPSdhbmQnXSxbY2xhc3M9J29yJ10sW2NsYXNzPSdub3QnXSxbY2xhc3M9J3Byb2Nlc3MnXSxbY2xhc3M9J29taXR0ZWQgcHJvY2VzcyddLFtjbGFzcz0ndW5jZXJ0YWluIHByb2Nlc3MnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPT09IHRydWUgJiYgZWxlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBhc3N1bWUgdGhhdCB0aGUgcG9ydHMgb2YgdGhlIGVkZ2UgYXJlIHN5bWV0cmljIGFjY29yZGluZyB0byB0aGUgbm9kZSBjZW50ZXIgc28ganVzdCBjaGVja2luZyBvbmUgcG9ydCBpcyBlbm91Z2ggZm9yIHVzXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9ydCA9IGVsZS5kYXRhKCdwb3J0cycpWzBdOyBcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwb3J0cyBhcmUgbG9jYXRlZCBhYm92ZS9iZWxvdyBvZiB0aGUgbm9kZSB0aGVuIHRoZSBvcmllbnRhdGlvbiBpcyAndmVydGljYWwnIGVsc2UgaXQgaXMgJ2hvcml6b250YWwnXHJcbiAgICAgICAgICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBwb3J0LnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGhhbGYgd2lkdGggb2YgdGhlIGFjdHVhbCBzaGFwZSBkaXNjbHVkaW5nIHRoZSBwb3J0c1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoYXBlSFcgPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IDUwIC8gTWF0aC5hYnMocG9ydC55KSA6IDUwIC8gTWF0aC5hYnMocG9ydC54KTtcclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgY2xhc3Mgb2YgdGhlIG5vZGVcclxuICAgICAgICAgICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICAgICAgICAgIC8vIElmIGNsYXNzIGlzIG9uZSBvZiBwcm9jZXNzLCBvbWl0dGVkIHByb2Nlc3Mgb3IgdW5jZXJ0YWluIHByb2Nlc3MgdGhlbiB0aGUgdHlwZSBvZiBhY3R1YWwgc2hhcGUgaXMgJ3JlY3RhbmdsZScgZWxzZSBpdCBpcyAnY2lyY2xlJ1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSA/ICdyZWN0YW5nbGUnIDogJ2NpcmNsZSc7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgcG9seWdvbiBzdHJpbmcgd2l0aCBhYm92ZSBwYXJhbWV0ZXJzIGFuZCByZXR1cm4gaXRcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVNoYXBlV2l0aFBvcnRTdHJpbmcoMC4wMSwgc2hhcGVIVywgdHlwZSwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyBUaGlzIGVsZW1lbnQgaXMgbm90IGV4cGVjdGVkIHRvIGhhdmUgYSBwb3lnb25pYWwgc2hhcGUgKEJlY2F1c2UgaXQgZG9lcyBub3QgaGF2ZSAyIHBvcnRzKSBqdXN0IHJldHVybiBhIHRyaXZpYWwgc3RyaW5nIGhlcmUgbm90IHRvIGhhdmUgYSBydW4gdGltZSBidWdcclxuICAgICAgICAgICAgICByZXR1cm4gJy0xIC0xIDEgMSAxIDAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3RhZyddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAwLjI1LCAtMSwgICAxLCAwLCAgICAwLjI1LCAxLCAgICAtMSwgMSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMCxcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAndGV4dC1tYXJnaW4teScgOiAtMSAqIG9wdGlvbnMuZXh0cmFDb21wYXJ0bWVudFBhZGRpbmdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnBhcmVudFtjbGFzcz0nY29tcGFydG1lbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdwYWRkaW5nJzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvdW5kUGFkZGluZ3MoKSArIG9wdGlvbnMuZXh0cmFDb21wYXJ0bWVudFBhZGRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2Jib3hdW2NsYXNzXVtjbGFzcyE9J2NvbXBsZXgnXVtjbGFzcyE9J2NvbXBhcnRtZW50J11bY2xhc3MhPSdzdWJtYXAnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKGJib3gudyknLFxyXG4gICAgICAgICAgICAnaGVpZ2h0JzogJ2RhdGEoYmJveC5oKSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd3aWR0aCc6IDM2LFxyXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzYsXHJcbiAgICAgICAgICAgICdib3JkZXItc3R5bGUnOiAnZGFzaGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxyXG4gICAgICAgICAgICAndGV4dC1vdXRsaW5lLWNvbG9yJzogJyMwMDAnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2N1cnZlLXN0eWxlJzogJ2JlemllcicsXHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1maWxsJzogJ2hvbGxvdycsXHJcbiAgICAgICAgICAgICd3aWR0aCc6IDEuMjUsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnI2Q2NzYxNCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdhcnJvdy1zY2FsZSc6IDEuMjVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjQzRDNEM0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2U6YWN0aXZlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnOCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NhcmRpbmFsaXR5ID4gMF1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGV4dC1yb3RhdGlvbic6ICdhdXRvcm90YXRlJyxcclxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1zaGFwZSc6ICdyZWN0YW5nbGUnLFxyXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItb3BhY2l0eSc6ICcxJyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLXdpZHRoJzogJzEnLFxyXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyxcclxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1vcGFjaXR5JzogJzEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0nY29uc3VtcHRpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NvdXJjZS1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW1hcmdpbi15JzogJy0xMCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtbWFyZ2luLXknOiAnLTEwJyxcclxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDYXJkaW5hbGl0eURpc3RhbmNlKGVsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctc2hhcGUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q3lBcnJvd1NoYXBlKGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctc2hhcGUnOiAnbm9uZScsXHJcbiAgICAgICAgICAgICdzb3VyY2UtZW5kcG9pbnQnOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbmRQb2ludChlbGUsICdzb3VyY2UnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RhcmdldC1lbmRwb2ludCc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVuZFBvaW50KGVsZSwgJ3RhcmdldCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0naW5oaWJpdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdwcm9kdWN0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImNvcmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtb3BhY2l0eSc6ICcwLjInLCAnc2VsZWN0aW9uLWJveC1ib3JkZXItY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pO1xyXG59O1xyXG4iLCIvKlxyXG4gKiBSZW5kZXIgc2JnbiBzcGVjaWZpYyBzaGFwZXMgd2hpY2ggYXJlIG5vdCBzdXBwb3J0ZWQgYnkgY3l0b3NjYXBlLmpzIGNvcmVcclxuICovXHJcblxyXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XHJcblxyXG52YXIgY3lNYXRoID0gY3l0b3NjYXBlLm1hdGg7XHJcbnZhciBjeUJhc2VOb2RlU2hhcGVzID0gY3l0b3NjYXBlLmJhc2VOb2RlU2hhcGVzO1xyXG52YXIgY3lTdHlsZVByb3BlcnRpZXMgPSBjeXRvc2NhcGUuc3R5bGVQcm9wZXJ0aWVzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyICQkID0gY3l0b3NjYXBlO1xyXG4gIFxyXG4gIC8vIFRha2VuIGZyb20gY3l0b3NjYXBlLmpzIGFuZCBtb2RpZmllZFxyXG4gIHZhciBkcmF3Um91bmRSZWN0YW5nbGVQYXRoID0gZnVuY3Rpb24oXHJcbiAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCByYWRpdXMgKXtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IHJhZGl1cyB8fCBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMoIHdpZHRoLCBoZWlnaHQgKTtcclxuXHJcbiAgICBpZiggY29udGV4dC5iZWdpblBhdGggKXsgY29udGV4dC5iZWdpblBhdGgoKTsgfVxyXG5cclxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcclxuICAgIGNvbnRleHQubW92ZVRvKCB4LCB5IC0gaGFsZkhlaWdodCApO1xyXG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXHJcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCArIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XHJcbiAgICAvLyBBcmMgZnJvbSByaWdodCBzaWRlIHRvIGJvdHRvbVxyXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHgsIHkgKyBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oIHggLSBoYWxmV2lkdGgsIHkgKyBoYWxmSGVpZ2h0LCB4IC0gaGFsZldpZHRoLCB5LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcclxuICAgIGNvbnRleHQuYXJjVG8oIHggLSBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4LCB5IC0gaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzICk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKCB4LCB5IC0gaGFsZkhlaWdodCApO1xyXG5cclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanNcclxuICB2YXIgZHJhd1BvbHlnb25QYXRoID0gZnVuY3Rpb24oXHJcbiAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwb2ludHMgKXtcclxuXHJcbiAgICB2YXIgaGFsZlcgPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkggPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XHJcblxyXG4gICAgY29udGV4dC5tb3ZlVG8oIHggKyBoYWxmVyAqIHBvaW50c1swXSwgeSArIGhhbGZIICogcG9pbnRzWzFdICk7XHJcblxyXG4gICAgZm9yKCB2YXIgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoIC8gMjsgaSsrICl7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKCB4ICsgaGFsZlcgKiBwb2ludHNbIGkgKiAyXSwgeSArIGhhbGZIICogcG9pbnRzWyBpICogMiArIDFdICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICB9O1xyXG4gIFxyXG4gIHZhciBzYmduU2hhcGVzID0gJCQuc2Jnbi5zYmduU2hhcGVzID0ge1xyXG4gICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgdG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSAkJC5zYmduLnRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0ge1xyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIHVuaXRPZkluZm9SYWRpdXMgPSA0O1xyXG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xyXG4gICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8gPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcyxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICB2YXIgdXBXaWR0aCA9IDAsIGRvd25XaWR0aCA9IDA7XHJcbiAgICB2YXIgYm94UGFkZGluZyA9IDEwLCBiZXR3ZWVuQm94UGFkZGluZyA9IDU7XHJcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3Muc29ydCgkJC5zYmduLmNvbXBhcmVTdGF0ZXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4vLyAgICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XHJcbiAgICAgICAgaWYgKHVwV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgdXBXaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdXBXaWR0aCA9IHVwV2lkdGggKyB3aWR0aCArIGJveFBhZGRpbmc7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVsYXRpdmVZUG9zID4gMCkge1xyXG4gICAgICAgIGlmIChkb3duV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWCA9IGNlbnRlclggLSBiZWdpblBvc1ggKyBib3hQYWRkaW5nICsgZG93bldpZHRoICsgc3RhdGVXaWR0aCAvIDI7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclkgPSBjZW50ZXJZICsgYmVnaW5Qb3NZO1xyXG5cclxuICAgICAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkb3duV2lkdGggPSBkb3duV2lkdGggKyB3aWR0aCArIGJveFBhZGRpbmc7XHJcbiAgICAgIH1cclxuICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXHJcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XHJcblxyXG4gICAgICAvL3VwZGF0ZSBuZXcgc3RhdGUgYW5kIGluZm8gcG9zaXRpb24ocmVsYXRpdmUgdG8gbm9kZSBjZW50ZXIpXHJcbiAgICAgIHN0YXRlLmJib3gueCA9IChzdGF0ZUNlbnRlclggLSBjZW50ZXJYKSAqIDEwMCAvIG5vZGUud2lkdGgoKTtcclxuICAgICAgc3RhdGUuYmJveC55ID0gKHN0YXRlQ2VudGVyWSAtIGNlbnRlclkpICogMTAwIC8gbm9kZS5oZWlnaHQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdTdGF0ZVRleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3ApIHtcclxuICAgIHZhciBzdGF0ZVZhbHVlID0gdGV4dFByb3Auc3RhdGUudmFsdWUgfHwgJyc7XHJcbiAgICB2YXIgc3RhdGVWYXJpYWJsZSA9IHRleHRQcm9wLnN0YXRlLnZhcmlhYmxlIHx8ICcnO1xyXG5cclxuICAgIHZhciBzdGF0ZUxhYmVsID0gc3RhdGVWYWx1ZSArIChzdGF0ZVZhcmlhYmxlXHJcbiAgICAgICAgICAgID8gXCJAXCIgKyBzdGF0ZVZhcmlhYmxlXHJcbiAgICAgICAgICAgIDogXCJcIik7XHJcblxyXG4gICAgdmFyIGZvbnRTaXplID0gOTsgLy8gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcclxuXHJcbiAgICB0ZXh0UHJvcC5mb250ID0gZm9udFNpemUgKyBcInB4IEFyaWFsXCI7XHJcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlTGFiZWw7XHJcbiAgICB0ZXh0UHJvcC5jb2xvciA9IFwiIzBmMGYwZlwiO1xyXG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3SW5mb1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3ApIHtcclxuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XHJcbiAgICB0ZXh0UHJvcC5mb250ID0gZm9udFNpemUgKyBcInB4IEFyaWFsXCI7XHJcbiAgICB0ZXh0UHJvcC5jb2xvciA9IFwiIzBmMGYwZlwiO1xyXG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCwgdHJ1bmNhdGUpIHtcclxuICAgIHZhciBvbGRGb250ID0gY29udGV4dC5mb250O1xyXG4gICAgY29udGV4dC5mb250ID0gdGV4dFByb3AuZm9udDtcclxuICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSB0ZXh0UHJvcC5jb2xvcjtcclxuICAgIHZhciBvbGRPcGFjaXR5ID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0ZXh0UHJvcC5vcGFjaXR5O1xyXG4gICAgdmFyIHRleHQ7XHJcbiAgICBcclxuICAgIHRleHRQcm9wLmxhYmVsID0gdGV4dFByb3AubGFiZWwgfHwgJyc7XHJcbiAgICBcclxuICAgIGlmICh0cnVuY2F0ZSA9PSBmYWxzZSkge1xyXG4gICAgICB0ZXh0ID0gdGV4dFByb3AubGFiZWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZXh0ID0gdHJ1bmNhdGVUZXh0KHRleHRQcm9wLCBjb250ZXh0LmZvbnQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb250ZXh0LmZpbGxUZXh0KHRleHQsIHRleHRQcm9wLmNlbnRlclgsIHRleHRQcm9wLmNlbnRlclkpO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgIGNvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkT3BhY2l0eTtcclxuICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICB9O1xyXG5cclxuICBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UgPSBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIpIHtcclxuICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucG93KHBvaW50MVswXSAtIHBvaW50MlswXSwgMikgKyBNYXRoLnBvdyhwb2ludDFbMV0gLSBwb2ludDJbMV0sIDIpO1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChkaXN0YW5jZSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jb2xvcnMgPSB7XHJcbiAgICBjbG9uZTogXCIjYTlhOWE5XCJcclxuICB9O1xyXG5cclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKSB7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoICYmIGkgPCA0OyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICAvL3ZhciBzdGF0ZUxhYmVsID0gc3RhdGUuc3RhdGUudmFsdWU7XHJcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQgfHwgJyc7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBub2RlLCB0aHJlc2hvbGQsIHBvaW50cywgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgdG9wXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayByZWN0YW5nbGUgYXQgYm90dG9tXHJcbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXHJcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGggLSAyICogY29ybmVyUmFkaXVzLCBjb3JuZXJSYWRpdXMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgZWxsaXBzZXNcclxuICAgIHZhciBjaGVja0luRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcbiAgICAgIHggLT0gY2VudGVyWDtcclxuICAgICAgeSAtPSBjZW50ZXJZO1xyXG5cclxuICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XHJcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gcmlnaHQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSBsZWZ0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy93ZSBuZWVkIHRvIGZvcmNlIG9wYWNpdHkgdG8gMSBzaW5jZSB3ZSBtaWdodCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzLlxyXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cclxuICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQpIHtcclxuICAgIHZhciBwYXJlbnRPcGFjaXR5ID0gbm9kZS5lZmZlY3RpdmVPcGFjaXR5KCk7XHJcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVswXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzJdICsgXCIsXCJcclxuICAgICAgICAgICAgKyAoMSAqIG5vZGUuY3NzKCdvcGFjaXR5JykgKiBwYXJlbnRPcGFjaXR5KSArIFwiKVwiO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG4gICAgLy92YXIgY29ybmVyUmFkaXVzID0gJCQubWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmV2lkdGgsIGhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbygwLCAtaGFsZkhlaWdodCk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgMCwgLWhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBKb2luIGxpbmVcclxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCAzICogTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIG9wYWNpdHkpIHtcclxuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAxICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIE1hdGguUEkgLyA2LCAzICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlUGF0aCA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhd1BhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUgPSBmdW5jdGlvbiAoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cykge1xyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgY29udGV4dC5tb3ZlVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIDApO1xyXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XHJcbiAgICBjb250ZXh0LmxpbmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmlzTXVsdGltZXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHNiZ25DbGFzcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcztcclxuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGlzIGNyZWF0ZWQgdG8gaGF2ZSBzYW1lIGNvcm5lciBsZW5ndGggd2hlblxyXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXHJcbiAgJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyA9IGZ1bmN0aW9uIChjb3JuZXJMZW5ndGgsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vY3Agc3RhbmRzIGZvciBjb3JuZXIgcHJvcG9ydGlvblxyXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuXHJcbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxyXG4gICAgICAxLCAxIC0gY3BYLCAxLCAxLCAxIC0gY3BZLCAxLCAtMSArIGNwWSwgMSAtIGNwWCwgLTFdO1xyXG5cclxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xyXG4gIH07XHJcblxyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnbnVjbGVpYyBhY2lkIGZlYXR1cmUnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnY29tcGxleCcpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdtYWNyb21vbGVjdWxlJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NpbXBsZSBjaGVtaWNhbCcpO1xyXG5cclxuICAkJC5zYmduLnJlZ2lzdGVyU2Jnbk5vZGVTaGFwZXMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXSA9IHtcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubWFjcm9tb2xlY3VsZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubWFjcm9tb2xlY3VsZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xyXG4gICAgICBwb2ludHM6IFtdLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKS0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMpO1xyXG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLmNvbXBsZXgoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbi8vICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmludGVyc2VjdExpbmUsXHJcbi8vICAgICAgY2hlY2tQb2ludDogY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnRcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLm91dGVySGVpZ2h0KCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCAvIDIsIGhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSAobm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAobm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcclxuXHJcbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxyXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcclxuXHJcbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgfSxcclxuICAgICAgZHJhd1BhdGg6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsXHJcbiAgICAgICAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXSA9IHtcclxuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgcHRzID0gY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXS5wb2ludHM7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoICogTWF0aC5zcXJ0KDIpIC8gMiwgaGVpZ2h0ICogTWF0aC5zcXJ0KDIpIC8gMik7XHJcblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHB0c1syXSwgcHRzWzNdKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhwdHNbNl0sIHB0c1s3XSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gKHdpZHRoICogTWF0aC5zcXJ0KDIpKSwgMiAvIChoZWlnaHQgKiBNYXRoLnNxcnQoMikpKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZSxcclxuICAgICAgY2hlY2tQb2ludDogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdFbGxpcHNlID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAvL2NvbnRleHQuZmlsbCgpO1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXcoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9uZU1hcmtlciA9IHtcclxuICAgIHNpbXBsZUNoZW1pY2FsOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4od2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWCA9IGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclggPSBjZW50ZXJYICsgd2lkdGggLyAyIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcclxuXHJcbiAgICAgICAgc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgZmlyc3RDaXJjbGVDZW50ZXJYLCBmaXJzdENpcmNsZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBzZWNvbmRDaXJjbGVDZW50ZXJYLCBzZWNvbmRDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciByZWNQb2ludHMgPSBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApO1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAvIDQgKiBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gY29ybmVyUmFkaXVzIC8gMjtcclxuXHJcbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG51Y2xlaWNBY2lkRmVhdHVyZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgLyA0O1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAqIGhlaWdodCAvIDg7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSwgY29ybmVyUmFkaXVzLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbWFjcm9tb2xlY3VsZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpO1xyXG4gICAgfSxcclxuICAgIGNvbXBsZXg6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xyXG4gICAgICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XHJcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBoZWlnaHQgKiBjcFkgLyAyO1xyXG4gICAgICAgIHZhciBjbG9uZVggPSBjZW50ZXJYO1xyXG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNsb25lSGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgICAgdmFyIG1hcmtlclBvaW50cyA9IFstMSwgLTEsIDEsIC0xLCAxIC0gY3BYLCAxLCAtMSArIGNwWCwgMV07XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcclxuICAgICAgICAgICAgICAgIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCBtYXJrZXJQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuXHJcbi8vICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCwgaW50ZXJzZWN0aW9ucykge1xyXG4gICAgaWYgKGludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDApXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICB2YXIgY2xvc2VzdEludGVyc2VjdGlvbiA9IFtdO1xyXG4gICAgdmFyIG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludGVyc2VjdGlvbnMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgdmFyIGNoZWNrUG9pbnQgPSBbaW50ZXJzZWN0aW9uc1tpXSwgaW50ZXJzZWN0aW9uc1tpICsgMV1dO1xyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBjeU1hdGguY2FsY3VsYXRlRGlzdGFuY2UocG9pbnQsIGNoZWNrUG9pbnQpO1xyXG5cclxuICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcclxuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG4gICAgICAgIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBjaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNsb3Nlc3RJbnRlcnNlY3Rpb247XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSwgbm9kZVgsIG5vZGVZLCBjb3JuZXJSYWRpdXMpIHtcclxuICAgIHZhciBub2RlWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFkgPSB0b3BTdGFydFk7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XHJcbiAgICAgIHZhciByaWdodEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHJpZ2h0U3RhcnRYLCByaWdodFN0YXJ0WSwgcmlnaHRFbmRYLCByaWdodEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgYm90dG9tU3RhcnRYLCBib3R0b21TdGFydFksIGJvdHRvbUVuZFgsIGJvdHRvbUVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xyXG4gICAgICB2YXIgbGVmdEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50cywgd2UgaGF2ZSBvbmx5IHR3byBhcmNzIGZvclxyXG4gICAgLy9udWNsZWljIGFjaWQgZmVhdHVyZXNcclxuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21SaWdodENlbnRlclkpIHtcclxuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIExlZnRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXHJcbiAgfTtcclxuXHJcbiAgLy90aGlzIGZ1bmN0aW9uIGdpdmVzIHRoZSBpbnRlcnNlY3Rpb25zIG9mIGFueSBsaW5lIHdpdGggYSByb3VuZCByZWN0YW5nbGUgXHJcbiAgJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5Miwgbm9kZVgsIG5vZGVZLCB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBzdHJhaWdodCBsaW5lIHNlZ21lbnRzXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFkgPSB0b3BTdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCB0b3BTdGFydFgsIHRvcFN0YXJ0WSwgdG9wRW5kWCwgdG9wRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIHJpZ2h0U3RhcnRYLCByaWdodFN0YXJ0WSwgcmlnaHRFbmRYLCByaWdodEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWSA9IGJvdHRvbVN0YXJ0WTtcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdEVuZFggPSBsZWZ0U3RhcnRYO1xyXG4gICAgICB2YXIgbGVmdEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgbGVmdFN0YXJ0WCwgbGVmdFN0YXJ0WSwgbGVmdEVuZFgsIGxlZnRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHNcclxuICAgIHZhciBhcmNJbnRlcnNlY3Rpb25zO1xyXG5cclxuICAgIC8vIFRvcCBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcExlZnRDZW50ZXJYLCB0b3BMZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gdG9wTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcExlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG9wIFJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgdG9wUmlnaHRDZW50ZXJYLCB0b3BSaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IHRvcFJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIFJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIExlZnRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tTGVmdENlbnRlclkpIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxyXG4gICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZUVsbGlwc2UgPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xyXG5cclxuICAgIHZhciB3ID0gd2lkdGggLyAyICsgcGFkZGluZztcclxuICAgIHZhciBoID0gaGVpZ2h0IC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgYW4gPSBjZW50ZXJYO1xyXG4gICAgdmFyIGJuID0gY2VudGVyWTtcclxuXHJcbiAgICB2YXIgZCA9IFt4MiAtIHgxLCB5MiAtIHkxXTtcclxuXHJcbiAgICB2YXIgbSA9IGRbMV0gLyBkWzBdO1xyXG4gICAgdmFyIG4gPSAtMSAqIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIGEgPSBoICogaCArIHcgKiB3ICogbSAqIG07XHJcbiAgICB2YXIgYiA9IC0yICogYW4gKiBoICogaCArIDIgKiBtICogbiAqIHcgKiB3IC0gMiAqIGJuICogbSAqIHcgKiB3O1xyXG4gICAgdmFyIGMgPSBhbiAqIGFuICogaCAqIGggKyBuICogbiAqIHcgKiB3IC0gMiAqIGJuICogdyAqIHcgKiBuICtcclxuICAgICAgICAgICAgYm4gKiBibiAqIHcgKiB3IC0gaCAqIGggKiB3ICogdztcclxuXHJcbiAgICB2YXIgZGlzY3JpbWluYW50ID0gYiAqIGIgLSA0ICogYSAqIGM7XHJcblxyXG4gICAgaWYgKGRpc2NyaW1pbmFudCA8IDApIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0MSA9ICgtYiArIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XHJcbiAgICB2YXIgdDIgPSAoLWIgLSBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG5cclxuICAgIHZhciB4TWluID0gTWF0aC5taW4odDEsIHQyKTtcclxuICAgIHZhciB4TWF4ID0gTWF0aC5tYXgodDEsIHQyKTtcclxuXHJcbiAgICB2YXIgeU1pbiA9IG0gKiB4TWluIC0gbSAqIHgyICsgeTI7XHJcbiAgICB2YXIgeU1heCA9IG0gKiB4TWF4IC0gbSAqIHgyICsgeTI7XHJcblxyXG4gICAgcmV0dXJuIFt4TWluLCB5TWluLCB4TWF4LCB5TWF4XTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyA9IGZ1bmN0aW9uIChub2RlLCB4LCB5KSB7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcblxyXG4gICAgdmFyIGludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChzdGF0ZUludGVyc2VjdExpbmVzKTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIDUsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoaW5mb0ludGVyc2VjdExpbmVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoaW5mb0ludGVyc2VjdExpbmVzKTtcclxuXHJcbiAgICAgICAgaW5mb0NvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxyXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcclxuICAgIHJldHVybiBbXTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyA9IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9cGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuXHJcbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XHJcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBwYXJzZUZsb2F0KHN0YXRlLmJib3gudykgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC5oKSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIHZhciBzdGF0ZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHN0YXRlQ291bnQrKztcclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIHZhciBpbmZvQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KFxyXG4gICAgICAgICAgICAgICAgeCwgeSwgcGFkZGluZywgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZKTtcclxuXHJcbiAgICAgICAgaWYgKGluZm9DaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgaW5mb0NvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pc05vZGVTaGFwZVRvdGFsbHlPdmVycmlkZW4gPSBmdW5jdGlvbiAocmVuZGVyLCBub2RlKSB7XHJcbiAgICBpZiAodG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXNbcmVuZGVyLmdldE5vZGVTaGFwZShub2RlKV0pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn07XHJcbiIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIGVsZW1lbnRzIGluY2x1ZGVzIGJvdGggZ2VuZXJhbCB1dGlsaXRpZXMgYW5kIHNiZ24gc3BlY2lmaWMgdXRpbGl0aWVzIFxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZ3JhcGgtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHtcclxuICAgIC8vdGhlIGxpc3Qgb2YgdGhlIGVsZW1lbnQgY2xhc3NlcyBoYW5kbGVkIGJ5IHRoZSB0b29sXHJcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcclxuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWUsXHJcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgICAgICdwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAndW5jZXJ0YWluIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3BoZW5vdHlwZSc6IHRydWUsXHJcbiAgICAgICAgJ3RhZyc6IHRydWUsXHJcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncHJvZHVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ21vZHVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2NhdGFseXNpcyc6IHRydWUsXHJcbiAgICAgICAgJ2luaGliaXRpb24nOiB0cnVlLFxyXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdsb2dpYyBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdlcXVpdmFsZW5jZSBhcmMnOiB0cnVlLFxyXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdvciBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ25vdCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ2FuZCc6IHRydWUsXHJcbiAgICAgICAgJ29yJzogdHJ1ZSxcclxuICAgICAgICAnbm90JzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBhcnRtZW50JzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXHJcbiAgICBwcm9jZXNzVHlwZXMgOiBbJ3Byb2Nlc3MnLCAnb21pdHRlZCBwcm9jZXNzJywgJ3VuY2VydGFpbiBwcm9jZXNzJyxcclxuICAgICAgICAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3BoZW5vdHlwZSddLFxyXG4gICAgICBcclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEdlbmVyYWwgRWxlbWVudCBVdGlsaXRpZXNcclxuXHJcbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXHJcbiAgICBnZXRUb3BNb3N0Tm9kZXM6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdHM7XHJcbiAgICB9LFxyXG4gICAgLy9UaGlzIG1ldGhvZCBjaGVja3MgaWYgYWxsIG9mIHRoZSBnaXZlbiBub2RlcyBoYXZlIHRoZSBzYW1lIHBhcmVudCBhc3N1bWluZyB0aGF0IHRoZSBzaXplIFxyXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcclxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBub2Rlc1swXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YShcInBhcmVudFwiKSAhPSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBtb3ZlTm9kZXM6IGZ1bmN0aW9uKHBvc2l0aW9uRGlmZiwgbm9kZXMsIG5vdENhbGNUb3BNb3N0Tm9kZXMpIHtcclxuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvcE1vc3ROb2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xyXG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XHJcbiAgICAgICAgbm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXHJcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xyXG4gICAgICB2YXIgcGFuID0gY3kucGFuKCk7XHJcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xyXG5cclxuICAgICAgdmFyIHggPSAocmVuZGVyZWRQb3NpdGlvbi54IC0gcGFuLngpIC8gem9vbTtcclxuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gdGhpcy5leHRlbmROb2RlTGlzdChzZWxlY3RlZEVsZXMpO1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0TmVpZ2hib3Vyc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZk5vZGVzKHNlbGVjdGVkRWxlcyk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb0hpZ2hsaWdodDtcclxuICAgIH0sXHJcbiAgICBnZXROZWlnaGJvdXJzT2ZOb2RlczogZnVuY3Rpb24oX25vZGVzKXtcclxuICAgICAgICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5wYXJlbnRzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpKTtcclxuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICB2YXIgbmVpZ2hib3Job29kRWxlcyA9IG5vZGVzLm5laWdoYm9yaG9vZCgpO1xyXG4gICAgICAgIHZhciBlbGVzVG9SZXR1cm4gPSBub2Rlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XHJcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb1JldHVybjtcclxuICAgIH0sXHJcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcyE9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xyXG5cclxuICAgICAgICB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGV4dGVuZFJlbWFpbmluZ05vZGVzIDogZnVuY3Rpb24obm9kZXNUb0ZpbHRlciwgYWxsTm9kZXMpe1xyXG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb1Nob3cpO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICBnZXRQcm9jZXNzZXNPZk5vZGVzOiBmdW5jdGlvbihub2Rlcykge1xyXG4gICAgICByZXR1cm4gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIG5vbmVJc05vdEhpZ2hsaWdodGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZEVkZ2VzID0gY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lZGdlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBFbGVtZW50IEZpbHRlcmluZyBVdGlsaXRpZXNcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBkZWxldGVOb2Rlc1NtYXJ0OiBmdW5jdGlvbiAoX25vZGVzKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gICAgICBcclxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XHJcbiAgICAgIHZhciBub2Rlc05vdFRvS2VlcCA9IGFsbE5vZGVzLm5vdChub2Rlc1RvS2VlcCk7XHJcbiAgICAgIHJldHVybiBub2Rlc05vdFRvS2VlcC5yZW1vdmUoKTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXHJcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgICBlbGVzLnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZWxlcztcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0Q3lTaGFwZTogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIC8vIEdldCByaWQgb2YgcmVjdGFuZ2xlIHBvc3RmaXggdG8gaGF2ZSB0aGUgYWN0dWFsIG5vZGUgY2xhc3NcclxuICAgICAgICBpZiAoX2NsYXNzLmVuZHNXaXRoKCcgbXVsdGltZXInKSkge1xyXG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdwaGVub3R5cGUnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnaGV4YWdvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZmluZSBuZXcgbm9kZSBzaGFwZXMgd2l0aCB0aGVpciBjbGFzcyBuYW1lcyBmb3IgdGhlc2Ugbm9kZXNcclxuICAgICAgICBpZiAoX2NsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IF9jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgXHJcbiAgICAgICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgX2NsYXNzID09ICdjb21wbGV4JyApIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2Ugc2hhcGVzIGNhbiBoYXZlIHBvcnRzLiBJZiB0aGV5IGhhdmUgcG9ydHMgd2UgcmVwcmVzZW50IHRoZW0gYnkgcG9seWdvbnMsIGVsc2UgdGhleSBhcmUgcmVwcmVzZW50ZWQgYnkgZWxsaXBzZXMgb3IgcmVjdGFuZ2xlc1xyXG4gICAgICAgIC8vIGNvbmRpdGlvbmFsbHkuXHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IF9jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyB8fCBfY2xhc3MgPT0gJ3Byb2Nlc3MnIHx8IF9jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJ1xyXG4gICAgICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycgfHwgX2NsYXNzID09ICdhbmQnIHx8IF9jbGFzcyA9PSAnb3InIHx8IF9jbGFzcyA9PSAnbm90JyApIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9PT0gdHJ1ZSAmJiBlbGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdwb2x5Z29uJzsgLy8gVGhlIG5vZGUgaGFzIHBvcnRzIHJlcHJlc2VudCBpdCBieSBwb2x5Z29uXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ3Byb2Nlc3MnIHx8IF9jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JlY3RhbmdsZSc7IC8vIElmIG5vZGUgaGFzIG5vIHBvcnQgYW5kIGhhcyBvbmUgb2YgdGhlc2UgY2xhc3NlcyBpdCBzaG91bGQgYmUgaW4gYSByZWN0YW5nbGUgc2hhcGVcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuICdlbGxpcHNlJzsgLy8gT3RoZXIgbm9kZXMgd2l0aCBubyBwb3J0IHNob3VsZCBiZSBpbiBhbiBlbGxpcHNlIHNoYXBlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFRoZSByZW1haW5pbmcgbm9kZXMgYXJlIHN1cHBvc2VkIHRvIGJlIGluIGVsbGlwc2Ugc2hhcGVcclxuICAgICAgICByZXR1cm4gJ2VsbGlwc2UnO1xyXG4gICAgfSxcclxuICAgIGdldEN5QXJyb3dTaGFwZTogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZS1jcm9zcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2luaGliaXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndGVlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY2F0YWx5c2lzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NpcmNsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3N0aW11bGF0aW9uJyB8fCBfY2xhc3MgPT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndHJpYW5nbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdtb2R1bGF0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2RpYW1vbmQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgfSxcclxuICAgIGdldEVsZW1lbnRDb250ZW50OiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgX2NsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGhlbm90eXBlJ1xyXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eScgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdwZXJ0dXJiaW5nIGFnZW50JyB8fCBfY2xhc3MgPT0gJ3RhZycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKF9jbGFzcyA9PSAnY29tcGFydG1lbnQnKXtcclxuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKF9jbGFzcyA9PSAnY29tcGxleCcpe1xyXG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGUuZGF0YSgnbGFiZWwnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihlbGUuZGF0YSgnaW5mb0xhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnaW5mb0xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnYW5kJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ0FORCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb3InKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnT1InO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ25vdCcpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdOT1QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdcXFxcXFxcXCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnPyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnZGlzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ28nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS53aWR0aCgpIHx8IGVsZS5kYXRhKCdiYm94JykudztcclxuXHJcbiAgICAgICAgdmFyIHRleHRQcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcclxuICAgICAgICAgICAgd2lkdGg6ICggX2NsYXNzPT0oJ2NvbXBsZXgnKSB8fCBfY2xhc3M9PSgnY29tcGFydG1lbnQnKSApP3RleHRXaWR0aCAqIDI6dGV4dFdpZHRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGZvbnQgPSB0aGlzLmdldExhYmVsVGV4dFNpemUoZWxlKSArIFwicHggQXJpYWxcIjtcclxuICAgICAgICByZXR1cm4gdHJ1bmNhdGVUZXh0KHRleHRQcm9wLCBmb250KTsgLy9mdW5jLiBpbiB0aGUgY3l0b3NjYXBlLnJlbmRlcmVyLmNhbnZhcy5zYmduLXJlbmRlcmVyLmpzXHJcbiAgICB9LFxyXG4gICAgZ2V0TGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gICAgICAvLyBUaGVzZSB0eXBlcyBvZiBub2RlcyBjYW5ub3QgaGF2ZSBsYWJlbCBidXQgdGhpcyBpcyBzdGF0ZW1lbnQgaXMgbmVlZGVkIGFzIGEgd29ya2Fyb3VuZFxyXG4gICAgICBpZiAoX2NsYXNzID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIDIwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2NsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJykgfHwgIF9jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnYW5kJyB8fCBfY2xhc3MgPT09ICdvcicgfHwgX2NsYXNzID09PSAnbm90Jykge1xyXG4gICAgICAgIHZhciBjb2VmZiA9IDE7IC8vIFRoZSBkeW5hbWljIGxhYmVsIHNpemUgY29lZmZpY2llbnQgZm9yIHRoZXNlIHBzZXVkbyBsYWJlbHMsIGl0IGlzIDEgZm9yIGxvZ2ljYWwgb3BlcmF0b3JzXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ29lZmYgaXMgc3VwcG9zZWQgdG8gYmUgMiBmb3IgZGlzc29jaWF0aW9uIGFuZCAxLjUgZm9yIG90aGVyIHByb2Nlc3Nlc1xyXG4gICAgICAgIGlmIChfY2xhc3MgPT09ICdkaXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICBjb2VmZiA9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgICBjb2VmZiA9IDEuNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHBvcnRzID0gZWxlLmRhdGEoJ3BvcnRzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9PT0gdHJ1ZSAmJiBwb3J0cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBwb3J0cyBhcmUgc3ltbWV0cmljIHRvIHRoZSBub2RlIGNlbnRlciBzbyB1c2luZyBqdXN0IG9uZSBvZiB0aGUgcG9ydHMgaXMgZW5vdWdoXHJcbiAgICAgICAgICB2YXIgcG9ydCA9IHBvcnRzWzBdO1xyXG4gICAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gcG9ydC54ID09PSAwID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIHdpdGggcG9ydHMgb3ZlciB3aXRob3V0IHBvcnRzXHJcbiAgICAgICAgICB2YXIgcmF0aW8gPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IE1hdGguYWJzKHBvcnQueSkgLyA1MCA6IE1hdGguYWJzKHBvcnQueCkgLyA1MDtcclxuICAgICAgICAgIGNvZWZmIC89IHJhdGlvOyAvLyBEaXZpZGUgdGhlIGNvZWZmIGJ5IHJhdGlvIHRvIGZpdCBpbnRvIHRoZSBiYm94IG9mIHRoZSBhY3R1YWwgc2hhcGUgKGRpc2NsdWRpbmcgcG9ydHMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgY29lZmYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2NsYXNzID09PSAnY29tcGxleCcgfHwgX2NsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgfSxcclxuICAgIGdldENhcmRpbmFsaXR5RGlzdGFuY2U6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xyXG4gICAgICB2YXIgdGd0UG9zID0gZWxlLnRhcmdldCgpLnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xyXG4gICAgICByZXR1cm4gZGlzdGFuY2UgKiAwLjE1O1xyXG4gICAgfSxcclxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAvKiBJbmZvIGxhYmVsIG9mIGEgY29sbGFwc2VkIG5vZGUgY2Fubm90IGJlIGNoYW5nZWQgaWZcclxuICAgICAgKiB0aGUgbm9kZSBpcyBjb2xsYXBzZWQgcmV0dXJuIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGluZm8gbGFiZWwgb2YgaXRcclxuICAgICAgKi9cclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jb2xsYXBzZWRDaGlsZHJlbiAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcclxuICAgICAgICovXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCBub2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgIHZhciBpbmZvTGFiZWwgPSBcIlwiO1xyXG4gICAgICAvKlxyXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAqL1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgdmFyIGNoaWxkSW5mbyA9IHRoaXMuZ2V0SW5mb0xhYmVsKGNoaWxkKTtcclxuICAgICAgICBpZiAoY2hpbGRJbmZvID09IG51bGwgfHwgY2hpbGRJbmZvID09IFwiXCIpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICBpbmZvTGFiZWwgKz0gXCI6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcclxuICAgICAgcmV0dXJuIGluZm9MYWJlbDtcclxuICAgIH0sXHJcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAvKiBDaGVjayB0aGUgbGFiZWwgb2YgdGhlIG5vZGUgaWYgaXQgaXMgbm90IHZhbGlkXHJcbiAgICAgICogdGhlbiBjaGVjayB0aGUgaW5mb2xhYmVsIGlmIGl0IGlzIGFsc28gbm90IHZhbGlkIGRvIG5vdCBzaG93IHF0aXBcclxuICAgICAgKi9cclxuICAgICAgdmFyIGxhYmVsID0gbm9kZS5kYXRhKCdsYWJlbCcpO1xyXG4gICAgICBpZiAobGFiZWwgPT0gbnVsbCB8fCBsYWJlbCA9PSBcIlwiKSB7XHJcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGFiZWwgPT0gbnVsbCB8fCBsYWJlbCA9PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcclxuICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlc2FuZGluZm9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgIHZhciB2YWx1ZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFsdWU7XHJcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xyXG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSAodmFyaWFibGUgPT0gbnVsbCAvKnx8IHR5cGVvZiBzdGF0ZVZhcmlhYmxlID09PSB1bmRlZmluZWQgKi8pID8gdmFsdWUgOlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArIFwiQFwiICsgdmFyaWFibGU7XHJcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29udGVudEh0bWw7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIGdldER5bmFtaWNMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlLCBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQpIHtcclxuICAgICAgdmFyIGR5bmFtaWNMYWJlbFNpemUgPSBvcHRpb25zLmR5bmFtaWNMYWJlbFNpemU7XHJcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcclxuXHJcbiAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDAuNzU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDEuMjU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgaCA9IGVsZS5oZWlnaHQoKTtcclxuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dEhlaWdodDtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgKiBHZXQgc291cmNlL3RhcmdldCBlbmQgcG9pbnQgb2YgZWRnZSBpbiAneC12YWx1ZSUgeS12YWx1ZSUnIGZvcm1hdC4gSXQgcmV0dXJucyAnb3V0c2lkZS10by1ub2RlJyBpZiB0aGVyZSBpcyBubyBzb3VyY2UvdGFyZ2V0IHBvcnQuXHJcbiAgICAqL1xyXG4gICAgZ2V0RW5kUG9pbnQ6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZU9yVGFyZ2V0KSB7XHJcbiAgICAgIHZhciBwb3J0SWQgPSBzb3VyY2VPclRhcmdldCA9PT0gJ3NvdXJjZScgPyBlZGdlLmRhdGEoJ3BvcnRzb3VyY2UnKSA6IGVkZ2UuZGF0YSgncG9ydHRhcmdldCcpO1xyXG5cclxuICAgICAgaWYgKHBvcnRJZCA9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuICdvdXRzaWRlLXRvLW5vZGUnOyAvLyBJZiB0aGVyZSBpcyBubyBwb3J0c291cmNlIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZSB3aGljaCBpcyAnb3V0c2lkZS10by1ub2RlJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZW5kTm9kZSA9IHNvdXJjZU9yVGFyZ2V0ID09PSAnc291cmNlJyA/IGVkZ2Uuc291cmNlKCkgOiBlZGdlLnRhcmdldCgpO1xyXG4gICAgICB2YXIgcG9ydHMgPSBlbmROb2RlLmRhdGEoJ3BvcnRzJyk7XHJcbiAgICAgIHZhciBwb3J0O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBvcnRzW2ldLmlkID09PSBwb3J0SWQpIHtcclxuICAgICAgICAgIHBvcnQgPSBwb3J0c1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwb3J0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gJ291dHNpZGUtdG8tbm9kZSc7IC8vIElmIHBvcnQgaXMgbm90IGZvdW5kIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZSB3aGljaCBpcyAnb3V0c2lkZS10by1ub2RlJ1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgeCwgeTtcclxuICAgICAgLy8gTm90ZSB0aGF0IGZvciBkcmF3aW5nIHBvcnRzIHdlIHJlcHJlc2VudCB0aGUgd2hvbGUgc2hhcGUgYnkgYSBwb2x5Z29uIGFuZCBwb3J0cyBhcmUgYWx3YXlzIDUwJSBhd2F5IGZyb20gdGhlIG5vZGUgY2VudGVyXHJcbiAgICAgIGlmIChwb3J0LnggIT0gMCkge1xyXG4gICAgICAgIHggPSBNYXRoLnNpZ24ocG9ydC54KSAqIDUwO1xyXG4gICAgICAgIHkgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHggPSAwO1xyXG4gICAgICAgIHkgPSBNYXRoLnNpZ24ocG9ydC55KSAqIDUwO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gJycgKyB4ICsgJyUgJyArIHkgKyAnJSc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudFV0aWxpdGllcztcclxuIiwiLypcclxuICogRmlsZSBVdGlsaXRpZXM6IFRvIGJlIHVzZWQgb24gcmVhZC93cml0ZSBmaWxlIG9wZXJhdGlvblxyXG4gKi9cclxuXHJcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xyXG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcclxudmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91aS11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxudmFyIHVwZGF0ZUdyYXBoID0gZ3JhcGhVdGlsaXRpZXMudXBkYXRlR3JhcGguYmluZChncmFwaFV0aWxpdGllcyk7XHJcblxyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIHNhdmVBcyA9IGxpYnMuc2F2ZUFzO1xyXG5cclxuLy8gSGVscGVyIGZ1bmN0aW9ucyBTdGFydFxyXG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxyXG5mdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG4gIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJyc7XHJcbiAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcclxuXHJcbiAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcclxuICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xyXG5cclxuICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcclxuICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcclxuXHJcbiAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XHJcblxyXG4gICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XHJcbiAgfVxyXG5cclxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gIHJldHVybiBibG9iO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkWE1MRG9jKGZ1bGxGaWxlUGF0aCkge1xyXG4gIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcclxuICAgIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgeGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xyXG4gIH1cclxuICB4aHR0cC5vcGVuKFwiR0VUXCIsIGZ1bGxGaWxlUGF0aCwgZmFsc2UpO1xyXG4gIHhodHRwLnNlbmQoKTtcclxuICByZXR1cm4geGh0dHAucmVzcG9uc2VYTUw7XHJcbn1cclxuXHJcbi8vIFNob3VsZCB0aGlzIGJlIGV4cG9zZWQgb3Igc2hvdWxkIHRoaXMgYmUgbW92ZWQgdG8gdGhlIGhlbHBlciBmdW5jdGlvbnMgc2VjdGlvbj9cclxuZnVuY3Rpb24gdGV4dFRvWG1sT2JqZWN0KHRleHQpIHtcclxuICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcclxuICAgIHZhciBkb2MgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpO1xyXG4gICAgZG9jLmFzeW5jID0gJ2ZhbHNlJztcclxuICAgIGRvYy5sb2FkWE1MKHRleHQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgJ3RleHQveG1sJyk7XHJcbiAgfVxyXG4gIHJldHVybiBkb2M7XHJcbn1cclxuLy8gSGVscGVyIGZ1bmN0aW9ucyBFbmRcclxuXHJcbmZ1bmN0aW9uIGZpbGVVdGlsaXRpZXMoKSB7fVxyXG5maWxlVXRpbGl0aWVzLmxvYWRYTUxEb2MgPSBsb2FkWE1MRG9jO1xyXG5cclxuZmlsZVV0aWxpdGllcy5zYXZlQXNQbmcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xyXG4gIHZhciBwbmdDb250ZW50ID0gY3kucG5nKHtzY2FsZTogMywgZnVsbDogdHJ1ZX0pO1xyXG5cclxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxyXG4gIHZhciBiNjRkYXRhID0gcG5nQ29udGVudC5zdWJzdHIocG5nQ29udGVudC5pbmRleE9mKFwiLFwiKSArIDEpO1xyXG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9wbmdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5wbmdcIik7XHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc0pwZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcbiAgdmFyIGpwZ0NvbnRlbnQgPSBjeS5qcGcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXHJcbiAgdmFyIGI2NGRhdGEgPSBqcGdDb250ZW50LnN1YnN0cihqcGdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XHJcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL2pwZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLmpwZ1wiKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMubG9hZFNhbXBsZSA9IGZ1bmN0aW9uKGZpbGVuYW1lLCBmb2xkZXJwYXRoKSB7XHJcbiAgdWlVdGlsaXRpZXMuc3RhcnRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xyXG4gIFxyXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGEgc2FtcGxlIGlzIGJlaW5nIGxvYWRlZFxyXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVcIiwgWyBmaWxlbmFtZSBdICk7IC8vIEFsaWFzZXMgZm9yIHNiZ252aXpMb2FkU2FtcGxlU3RhcnRcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVTdGFydFwiLCBbIGZpbGVuYW1lIF0gKTtcclxuICBcclxuICAvLyBsb2FkIHhtbCBkb2N1bWVudCB1c2UgZGVmYXVsdCBmb2xkZXIgcGF0aCBpZiBpdCBpcyBub3Qgc3BlY2lmaWVkXHJcbiAgdmFyIHhtbE9iamVjdCA9IGxvYWRYTUxEb2MoKGZvbGRlcnBhdGggfHwgJ3NhbXBsZS1hcHAvc2FtcGxlcy8nKSArIGZpbGVuYW1lKTtcclxuICBcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHhtbE9iamVjdCkpO1xyXG4gICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtc3Bpbm5lclwiKTtcclxuICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZUVuZFwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gVHJpZ2dlciBhbiBldmVudCBzaWduYWxpbmcgdGhhdCBhIHNhbXBsZSBpcyBsb2FkZWRcclxuICB9LCAwKTtcclxufTtcclxuXHJcbi8qXHJcbiAgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiByZW1vdGVseSBkZWZpbmVkIHRvIGFkZCBzcGVjaWZpYyBiZWhhdmlvciB0aGF0IGlzbid0IGltcGxlbWVudGVkIGhlcmUuXHJcbiAgaXQgaXMgY29tcGxldGVseSBvcHRpb25hbC5cclxuICBzaWduYXR1cmU6IGNhbGxiYWNrKHRleHRYbWwpXHJcbiovXHJcbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTEZpbGUgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcclxuICBcclxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhbiBleHRlcm5hbCBmaWxlIGlzIGJlaW5nIGxvYWRlZFxyXG4gIC8vIFRyaWdnZXIgYW4gZXZlbnQgZm9yIHRoaXMgcHVycG9zZSBhbmQgc3BlY2lmeSB0aGUgJ2ZpbGVuYW1lJyBhcyBhbiBldmVudCBwYXJhbWV0ZXJcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRGaWxlU3RhcnRcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlU3RhcnRcIiwgWyBmaWxlLm5hbWUgXSApOyBcclxuICBcclxuICB2YXIgdGV4dFR5cGUgPSAvdGV4dC4qLztcclxuXHJcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIHRleHQgPSB0aGlzLnJlc3VsdDtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpIGNhbGxiYWNrKHRleHQpO1xyXG4gICAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcclxuICAgICAgdWlVdGlsaXRpZXMuZW5kU3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gICAgICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlRW5kXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy8gVHJpZ2dlciBhbiBldmVudCBzaWduYWxpbmcgdGhhdCBhIGZpbGUgaXMgbG9hZGVkXHJcbiAgICB9LCAwKTtcclxuICB9O1xyXG5cclxuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxufTtcclxuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MVGV4dCA9IGZ1bmN0aW9uKHRleHREYXRhKXtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0RGF0YSkpKTtcclxuICAgICAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgICB9LCAwKTtcclxuXHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc1NiZ25tbCA9IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKSB7XHJcbiAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKGZpbGVuYW1lLCByZW5kZXJJbmZvKTtcclxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xyXG4gICAgdHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTg7XCIsXHJcbiAgfSk7XHJcbiAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcclxufTtcclxuZmlsZVV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVGV4dFRvSnNvbiA9IGZ1bmN0aW9uKHNiZ25tbFRleHQpe1xyXG4gICAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdChzYmdubWxUZXh0KSk7XHJcbn07XHJcblxyXG5maWxlVXRpbGl0aWVzLmNyZWF0ZUpzb24gPSBmdW5jdGlvbihqc29uKXtcclxuICAgIHZhciBzYmdubWxUZXh0ID0ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xyXG4gICAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdChzYmdubWxUZXh0KSk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXRpbGl0aWVzO1xyXG4iLCIvKlxyXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBzYmdudml6IGdyYXBoc1xyXG4gKi9cclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbmZ1bmN0aW9uIGdyYXBoVXRpbGl0aWVzKCkge31cclxuXHJcbmdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9IHRydWU7XHJcblxyXG5ncmFwaFV0aWxpdGllcy5kaXNhYmxlUG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICBncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPSBmYWxzZTtcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuZ3JhcGhVdGlsaXRpZXMuZW5hYmxlUG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICBncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPSB0cnVlO1xyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5hcmVQb3J0c0VuYWJsZWQgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkO1xyXG59O1xyXG5cclxuZ3JhcGhVdGlsaXRpZXMudXBkYXRlR3JhcGggPSBmdW5jdGlvbihjeUdyYXBoKSB7XHJcbiAgY29uc29sZS5sb2coJ2N5IHVwZGF0ZSBjYWxsZWQnKTtcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhTdGFydFwiICk7XHJcbiAgLy8gUmVzZXQgdW5kby9yZWRvIHN0YWNrIGFuZCBidXR0b25zIHdoZW4gYSBuZXcgZ3JhcGggaXMgbG9hZGVkXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkucmVzZXQoKTtcclxuLy8gICAgdGhpcy5yZXNldFVuZG9SZWRvQnV0dG9ucygpO1xyXG4gIH1cclxuXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gIC8vIGNsZWFyIGRhdGFcclxuICBjeS5yZW1vdmUoJyonKTtcclxuICBjeS5hZGQoY3lHcmFwaCk7XHJcblxyXG4gIC8vYWRkIHBvc2l0aW9uIGluZm9ybWF0aW9uIHRvIGRhdGEgZm9yIHByZXNldCBsYXlvdXRcclxuICB2YXIgcG9zaXRpb25NYXAgPSB7fTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGN5R3JhcGgubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciB4UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmJib3gueDtcclxuICAgIHZhciB5UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmJib3gueTtcclxuICAgIHBvc2l0aW9uTWFwW2N5R3JhcGgubm9kZXNbaV0uZGF0YS5pZF0gPSB7J3gnOiB4UG9zLCAneSc6IHlQb3N9O1xyXG4gIH1cclxuXHJcbiAgdGhpcy5yZWZyZXNoUGFkZGluZ3MoKTsgLy8gUmVjYWxjdWxhdGVzL3JlZnJlc2hlcyB0aGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjeS5lbmRCYXRjaCgpO1xyXG4gIFxyXG4gIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQoe1xyXG4gICAgbmFtZTogJ3ByZXNldCcsXHJcbiAgICBwb3NpdGlvbnM6IHBvc2l0aW9uTWFwLFxyXG4gICAgZml0OiB0cnVlLFxyXG4gICAgcGFkZGluZzogNTBcclxuICB9KTtcclxuICBcclxuICAvLyBDaGVjayB0aGlzIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xyXG4gICAgbGF5b3V0LnJ1bigpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIHRoZSBzdHlsZVxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgLy8gSW5pdGlsaXplIHRoZSBiZW5kIHBvaW50cyBvbmNlIHRoZSBlbGVtZW50cyBhcmUgY3JlYXRlZFxyXG4gIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XHJcbiAgICBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmluaXRCZW5kUG9pbnRzKGN5LmVkZ2VzKCkpO1xyXG4gIH1cclxuICBcclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhFbmRcIiApO1xyXG59O1xyXG5cclxuZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlUGFkZGluZ3MgPSBmdW5jdGlvbihwYWRkaW5nUGVyY2VudCkge1xyXG4gIC8vQXMgZGVmYXVsdCB1c2UgdGhlIGNvbXBvdW5kIHBhZGRpbmcgdmFsdWVcclxuICBpZiAoIXBhZGRpbmdQZXJjZW50KSB7XHJcbiAgICB2YXIgY29tcG91bmRQYWRkaW5nID0gb3B0aW9ucy5jb21wb3VuZFBhZGRpbmc7XHJcbiAgICBwYWRkaW5nUGVyY2VudCA9IHR5cGVvZiBjb21wb3VuZFBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBjb21wb3VuZFBhZGRpbmcuY2FsbCgpIDogY29tcG91bmRQYWRkaW5nO1xyXG4gIH1cclxuXHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICB2YXIgdG90YWwgPSAwO1xyXG4gIHZhciBudW1PZlNpbXBsZXMgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciB0aGVOb2RlID0gbm9kZXNbaV07XHJcbiAgICBpZiAodGhlTm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgdGhlTm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLndpZHRoKCkpO1xyXG4gICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS5oZWlnaHQoKSk7XHJcbiAgICAgIG51bU9mU2ltcGxlcysrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGNhbGNfcGFkZGluZyA9IChwYWRkaW5nUGVyY2VudCAvIDEwMCkgKiBNYXRoLmZsb29yKHRvdGFsIC8gKDIgKiBudW1PZlNpbXBsZXMpKTtcclxuICBpZiAoY2FsY19wYWRkaW5nIDwgNSkge1xyXG4gICAgY2FsY19wYWRkaW5nID0gNTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjYWxjX3BhZGRpbmc7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5yZWNhbGN1bGF0ZVBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gdGhpcy5jYWxjdWxhdGVkUGFkZGluZ3MgaXMgbm90IHdvcmtpbmcgaGVyZSBcclxuICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgcmVmZXJlbmNlIHdpdGggdGhpcy5jYWxjdWxhdGVkUGFkZGluZ3Mgb25jZSB0aGUgcmVhc29uIGlzIGZpZ3VyZWQgb3V0XHJcbiAgZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzID0gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xyXG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3M7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBoVXRpbGl0aWVzOyIsInZhciB0eHRVdGlsID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpO1xyXG52YXIgbGlic2JnbmpzID0gcmVxdWlyZSgnbGlic2Jnbi5qcycpO1xyXG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcclxudmFyIHBrZ1ZlcnNpb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uOyAvLyBuZWVkIGluZm8gYWJvdXQgc2JnbnZpeiB0byBwdXQgaW4geG1sXHJcbnZhciBwa2dOYW1lID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykubmFtZTtcclxudmFyIHByZXR0eXByaW50ID0gcmVxdWlyZSgncHJldHR5LWRhdGEnKS5wZDtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBqc29uVG9TYmdubWwgPSB7XHJcbiAgICAvKlxyXG4gICAgICAgIHRha2VzIHJlbmRlckluZm8gYXMgYW4gb3B0aW9uYWwgYXJndW1lbnQuIEl0IGNvbnRhaW5zIGFsbCB0aGUgaW5mb3JtYXRpb24gbmVlZGVkIHRvIHNhdmVcclxuICAgICAgICB0aGUgc3R5bGUgYW5kIGNvbG9ycyB0byB0aGUgcmVuZGVyIGV4dGVuc2lvbi4gU2VlIG5ld3QvYXBwLXV0aWxpdGllcyBnZXRBbGxTdHlsZXMoKVxyXG4gICAgICAgIFN0cnVjdHVyZToge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGUgbWFwIGJhY2tncm91bmQgY29sb3IsXHJcbiAgICAgICAgICAgIGNvbG9yczoge1xyXG4gICAgICAgICAgICAgIHZhbGlkWG1sVmFsdWU6IGNvbG9yX2lkXHJcbiAgICAgICAgICAgICAgLi4uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgc3R5bGVLZXkxOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWRMaXN0OiBsaXN0IG9mIHRoZSBub2RlcyBpZHMgdGhhdCBoYXZlIHRoaXMgc3R5bGVcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0eWxlS2V5MjogLi4uXHJcbiAgICAgICAgICAgICAgICAuLi5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICovXHJcbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbyl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgbWFwSUQgPSB0eHRVdGlsLmdldFhNTFZhbGlkSWQoZmlsZW5hbWUpO1xyXG4gICAgICAgIHZhciBoYXNFeHRlbnNpb24gPSBmYWxzZTtcclxuICAgICAgICB2YXIgaGFzUmVuZGVyRXh0ZW5zaW9uID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJJbmZvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBoYXNFeHRlbnNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBoYXNSZW5kZXJFeHRlbnNpb24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgaGVhZGVyc1xyXG4gICAgICAgIHhtbEhlYWRlciA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xyXG4gICAgICAgIHZhciBzYmduID0gbmV3IGxpYnNiZ25qcy5TYmduKHt4bWxuczogJ2h0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuMyd9KTtcclxuICAgICAgICB2YXIgbWFwID0gbmV3IGxpYnNiZ25qcy5NYXAoe2xhbmd1YWdlOiAncHJvY2VzcyBkZXNjcmlwdGlvbicsIGlkOiBtYXBJRH0pO1xyXG4gICAgICAgIGlmIChoYXNFeHRlbnNpb24pIHsgLy8gZXh0ZW5zaW9uIGlzIHRoZXJlXHJcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBuZXcgbGlic2JnbmpzLkV4dGVuc2lvbigpO1xyXG4gICAgICAgICAgICBpZiAoaGFzUmVuZGVyRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24uYWRkKHNlbGYuZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sKHJlbmRlckluZm8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXAuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZXQgYWxsIGdseXBoc1xyXG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcclxuICAgICAgICBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWVsZS5pc0NoaWxkKCkpXHJcbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwoZWxlKSk7IC8vIHJldHVybnMgcG90ZW50aWFsbHkgbW9yZSB0aGFuIDEgZ2x5cGhcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBhZGQgdGhlbSB0byB0aGUgbWFwXHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Z2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1hcC5hZGRHbHlwaChnbHlwaExpc3RbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IGFsbCBhcmNzXHJcbiAgICAgICAgY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcC5hZGRBcmMoc2VsZi5nZXRBcmNTYmdubWwoZWxlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNiZ24uc2V0TWFwKG1hcCk7XHJcbiAgICAgICAgcmV0dXJuIHByZXR0eXByaW50LnhtbCh4bWxIZWFkZXIgKyBzYmduLnRvWE1MKCkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBzZWUgY3JlYXRlU2Jnbm1sIGZvciBpbmZvIG9uIHRoZSBzdHJ1Y3R1cmUgb2YgcmVuZGVySW5mb1xyXG4gICAgZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sIDogZnVuY3Rpb24ocmVuZGVySW5mbykge1xyXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICAgICAgdmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbih7IGlkOiAncmVuZGVySW5mb3JtYXRpb24nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiByZW5kZXJJbmZvLmJhY2tncm91bmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW1OYW1lOiBwa2dOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtVmVyc2lvbjogcGtnVmVyc2lvbiB9KTtcclxuXHJcbiAgICAgICAgLy8gcG9wdWxhdGUgbGlzdCBvZiBjb2xvcnNcclxuICAgICAgICB2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGNvbG9yIGluIHJlbmRlckluZm8uY29sb3JzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkNvbG9yRGVmaW5pdGlvbih7aWQ6IHJlbmRlckluZm8uY29sb3JzW2NvbG9yXSwgdmFsdWU6IGNvbG9yfSk7XHJcbiAgICAgICAgICAgIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZkNvbG9yRGVmaW5pdGlvbnMobGlzdE9mQ29sb3JEZWZpbml0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIHBvcHVsYXRlcyBzdHlsZXNcclxuICAgICAgICB2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMoKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVySW5mby5zdHlsZXMpIHtcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gcmVuZGVySW5mby5zdHlsZXNba2V5XTtcclxuICAgICAgICAgICAgdmFyIHhtbFN0eWxlID0gbmV3IHJlbmRlckV4dGVuc2lvbi5TdHlsZSh7aWQ6IHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChrZXkpLCBpZExpc3Q6IHN0eWxlLmlkTGlzdC5qb2luKCcgJyl9KTtcclxuICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogc3R5bGUucHJvcGVydGllcy5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxyXG4gICAgICAgICAgICAgICAgZm9udFN0eWxlOiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRTdHlsZSxcclxuICAgICAgICAgICAgICAgIGZpbGw6IHN0eWxlLnByb3BlcnRpZXMuZmlsbCwgLy8gZmlsbCBjb2xvclxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXHJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogc3R5bGUucHJvcGVydGllcy5zdHJva2VXaWR0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XHJcbiAgICAgICAgICAgIGxpc3RPZlN0eWxlcy5hZGRTdHlsZSh4bWxTdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZlN0eWxlcyhsaXN0T2ZTdHlsZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEdseXBoU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgbm9kZUNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xyXG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCwgY2xhc3NfOiBub2RlQ2xhc3N9KTtcclxuXHJcbiAgICAgICAgLy8gYXNzaWduIGNvbXBhcnRtZW50UmVmXHJcbiAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtaXNjIGluZm9ybWF0aW9uXHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIGlmKHR5cGVvZiBsYWJlbCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgZ2x5cGguc2V0TGFiZWwobmV3IGxpYnNiZ25qcy5MYWJlbCh7dGV4dDogbGFiZWx9KSk7XHJcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBnbHlwaC5zZXRDbG9uZShuZXcgbGlic2JnbmpzLkNsb25lVHlwZSgpKTtcclxuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZEdseXBoQmJveChub2RlKSk7XHJcbiAgICAgICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHBvcnRzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnRzW2ldLnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSByYXRpbyBvZiB0aGUgYXJlYSBvY2N1cGllZCBmb3IgcG9ydHMgb3ZlciB0aGUgd2hvbGUgc2hhcGVcclxuICAgICAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0c1tpXS55KSAvIDUwIDogTWF0aC5hYnMocG9ydHNbaV0ueCkgLyA1MDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIERpdmlkZSB0aGUgbm9kZSBzaXplcyBieSB0aGUgcmF0aW8gYmVjYXVzZSB0aGF0IHNpemVzIGluY2x1ZGVzIHBvcnRzIGFzIHdlbGxcclxuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogKCBub2RlLndpZHRoKCkgLyByYXRpbyApIC8gMTAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArIHBvcnRzW2ldLnkgKiAoIG5vZGUuaGVpZ2h0KCkgLyByYXRpbyApIC8gMTAwO1xyXG5cclxuICAgICAgICAgICAgZ2x5cGguYWRkUG9ydChuZXcgbGlic2JnbmpzLlBvcnQoe2lkOiBwb3J0c1tpXS5pZCwgeDogeCwgeTogeX0pKTtcclxuICAgICAgICAgICAgLypzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHBvcnQgaWQ9J1wiICsgcG9ydHNbaV0uaWQrXHJcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiOyovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBib3hHbHlwaCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zSWQgPSBub2RlLl9wcml2YXRlLmRhdGEuaWQrXCJfXCIraTtcclxuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcih0aGlzLmFkZFN0YXRlQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcih0aGlzLmFkZEluZm9Cb3hHbHlwaChib3hHbHlwaCwgc3RhdGVzYW5kaW5mb3NJZCwgbm9kZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgZ2x5cGggbWVtYmVycyB0aGF0IGFyZSBub3Qgc3RhdGUgdmFyaWFibGVzIG9yIHVuaXQgb2YgaW5mbzogc3VidW5pdHNcclxuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGVDbGFzcyA9PT0gXCJzdWJtYXBcIil7XHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2x5cGhNZW1iZXJMaXN0ID0gc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhNZW1iZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIoZ2x5cGhNZW1iZXJMaXN0W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjdXJyZW50IGdseXBoIGlzIGRvbmVcclxuICAgICAgICBnbHlwaExpc3QucHVzaChnbHlwaCk7XHJcblxyXG4gICAgICAgIC8vIGtlZXAgZ29pbmcgd2l0aCBhbGwgdGhlIGluY2x1ZGVkIGdseXBoc1xyXG4gICAgICAgIGlmKG5vZGVDbGFzcyA9PT0gXCJjb21wYXJ0bWVudFwiKXtcclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdseXBoTGlzdCA9IGdseXBoTGlzdC5jb25jYXQoc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIGdseXBoTGlzdDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0QXJjU2Jnbm1sIDogZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXHJcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xyXG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgYXJjSWQgPSBlZGdlLl9wcml2YXRlLmRhdGEuaWQ7XHJcbiAgICAgICAgdmFyIGFyYyA9IG5ldyBsaWJzYmduanMuQXJjKHtpZDogYXJjSWQsIHNvdXJjZTogYXJjU291cmNlLCB0YXJnZXQ6IGFyY1RhcmdldCwgY2xhc3NfOiBlZGdlLl9wcml2YXRlLmRhdGEuY2xhc3N9KTtcclxuXHJcbiAgICAgICAgYXJjLnNldFN0YXJ0KG5ldyBsaWJzYmduanMuU3RhcnRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFl9KSk7XHJcblxyXG4gICAgICAgIC8vIEV4cG9ydCBiZW5kIHBvaW50cyBpZiBlZGdlQmVuZEVkaXRpbmdFeHRlbnNpb24gaXMgcmVnaXN0ZXJlZFxyXG4gICAgICAgIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgICAgaWYoc2VncHRzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xyXG4gICAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcclxuICAgICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICBhcmMuYWRkTmV4dChuZXcgbGlic2JnbmpzLk5leHRUeXBlKHt4OiBiZW5kWCwgeTogYmVuZFl9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFyYy5zZXRFbmQobmV3IGxpYnNiZ25qcy5FbmRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFgsIHk6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWX0pKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRpbmFsaXR5ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLmNhcmRpbmFsaXR5O1xyXG4gICAgICAgIGlmKHR5cGVvZiBjYXJkaW5hbGl0eSAhPSAndW5kZWZpbmVkJyAmJiBjYXJkaW5hbGl0eSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFyYy5hZGRHbHlwaChuZXcgbGlic2JnbmpzLkdseXBoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBhcmMuaWQrJ19jYXJkJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzXzogJ2NhcmRpbmFsaXR5JyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBjYXJkaW5hbGl0eX0pLFxyXG4gICAgICAgICAgICAgICAgYmJveDogbmV3IGxpYnNiZ25qcy5CYm94KHt4OiAwLCB5OiAwLCB3OiAwLCBoOiAwfSkgLy8gZHVtbXkgYmJveCwgbmVlZGVkIGZvciBmb3JtYXQgY29tcGxpYW5jZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJjO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRHbHlwaEJib3ggOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJZiB0aGUgbm9kZSBjYW4gaGF2ZSBwb3J0cyBhbmQgaXQgaGFzIGV4YWN0bHkgMiBwb3J0cyB0aGVuIGl0IGlzIHJlcHJlc2VudGVkIGJ5IGEgYmlnZ2VyIGJib3guXHJcbiAgICAgICAgLy8gVGhpcyBpcyBiZWNhdXNlIHdlIHJlcHJlc2VudCBpdCBhcyBhIHBvbHlnb24gYW5kIHNvIHRoZSB3aG9sZSBzaGFwZSBpbmNsdWRpbmcgdGhlIHBvcnRzIGFyZSByZW5kZXJlZCBpbiB0aGUgbm9kZSBiYm94LlxyXG4gICAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJyB8fCBfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnIHx8IF9jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpKSB7XHJcbiAgICAgICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID09PSB0cnVlICYmIG5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgLy8gV2UgYXNzdW1lIHRoYXQgdGhlIHBvcnRzIGFyZSBzeW1tZXRyaWMgdG8gdGhlIG5vZGUgY2VudGVyIHNvIHVzaW5nIGp1c3Qgb25lIG9mIHRoZSBwb3J0cyBpcyBlbm91Z2hcclxuICAgICAgICAgICAgdmFyIHBvcnQgPSBub2RlLmRhdGEoJ3BvcnRzJylbMF07XHJcbiAgICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnQueCA9PT0gMCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIHdpdGggcG9ydHMgb3ZlciB3aXRob3V0IHBvcnRzXHJcbiAgICAgICAgICAgIHZhciByYXRpbyA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gTWF0aC5hYnMocG9ydC55KSAvIDUwIDogTWF0aC5hYnMocG9ydC54KSAvIDUwO1xyXG4gICAgICAgICAgICAvLyBEaXZpZGUgdGhlIGJib3ggdG8gdGhlIGNhbGN1bGF0ZWQgcmF0aW8gdG8gZ2V0IHRoZSBiYm94IG9mIHRoZSBhY3R1YWwgc2hhcGUgZGlzY2x1ZGluZyB0aGUgcG9ydHNcclxuICAgICAgICAgICAgd2lkdGggLz0gcmF0aW87XHJcbiAgICAgICAgICAgIGhlaWdodCAvPSByYXRpbztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggLSB3aWR0aC8yO1xyXG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBsaWJzYmduanMuQmJveCh7eDogeCwgeTogeSwgdzogd2lkdGgsIGg6IGhlaWdodH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRTdGF0ZUFuZEluZm9CYm94IDogZnVuY3Rpb24obm9kZSwgYm94R2x5cGgpe1xyXG4gICAgICAgIGJveEJib3ggPSBib3hHbHlwaC5iYm94O1xyXG5cclxuICAgICAgICB2YXIgeCA9IGJveEJib3gueCAvIDEwMCAqIG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgeSA9IGJveEJib3gueSAvIDEwMCAqIG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyAoeCAtIGJveEJib3gudy8yKTtcclxuICAgICAgICB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgKHkgLSBib3hCYm94LmgvMik7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgbGlic2JnbmpzLkJib3goe3g6IHgsIHk6IHksIHc6IGJveEJib3gudywgaDogYm94QmJveC5ofSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcclxuXHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICdzdGF0ZSB2YXJpYWJsZSd9KTtcclxuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgbGlic2JnbmpzLlN0YXRlVHlwZSgpO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhbHVlICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG5vZGUuc3RhdGUudmFsdWU7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHN0YXRlLnZhcmlhYmxlID0gbm9kZS5zdGF0ZS52YXJpYWJsZTtcclxuICAgICAgICBnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnbHlwaDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICd1bml0IG9mIGluZm9ybWF0aW9uJ30pO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5ldyBsaWJzYmduanMuTGFiZWwoKTtcclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBsYWJlbC50ZXh0ID0gbm9kZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgIGdseXBoLnNldExhYmVsKGxhYmVsKTtcclxuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdseXBoO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uVG9TYmdubWw7XHJcbiIsIi8qXHJcbiAqIExpc3RlbiBkb2N1bWVudCBmb3Iga2V5Ym9hcmQgaW5wdXRzIGFuZCBleHBvcnRzIHRoZSB1dGlsaXRpZXMgdGhhdCBpdCBtYWtlcyB1c2Ugb2ZcclxuICovXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIga2V5Ym9hcmRJbnB1dFV0aWxpdGllcyA9IHtcclxuICBpc051bWJlcktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuICggZS5rZXlDb2RlID49IDQ4ICYmIGUua2V5Q29kZSA8PSA1NyApIHx8ICggZS5rZXlDb2RlID49IDk2ICYmIGUua2V5Q29kZSA8PSAxMDUgKTtcclxuICB9LFxyXG4gIGlzRG90S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxOTA7XHJcbiAgfSxcclxuICBpc01pbnVzU2lnbktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTA5IHx8IGUua2V5Q29kZSA9PT0gMTg5O1xyXG4gIH0sXHJcbiAgaXNMZWZ0S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNztcclxuICB9LFxyXG4gIGlzUmlnaHRLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5O1xyXG4gIH0sXHJcbiAgaXNCYWNrc3BhY2VLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDg7XHJcbiAgfSxcclxuICBpc1RhYktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gOTtcclxuICB9LFxyXG4gIGlzRW50ZXJLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEzO1xyXG4gIH0sXHJcbiAgaXNJbnRlZ2VyRmllbGRJbnB1dDogZnVuY3Rpb24odmFsdWUsIGUpIHtcclxuICAgIHJldHVybiB0aGlzLmlzQ3RybE9yQ29tbWFuZFByZXNzZWQoZSkgfHwgdGhpcy5pc01pbnVzU2lnbktleShlKSB8fCB0aGlzLmlzTnVtYmVyS2V5KGUpIFxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzQmFja3NwYWNlS2V5KGUpIHx8IHRoaXMuaXNUYWJLZXkoZSkgfHwgdGhpcy5pc0xlZnRLZXkoZSkgfHwgdGhpcy5pc1JpZ2h0S2V5KGUpIHx8IHRoaXMuaXNFbnRlcktleShlKTtcclxuICB9LFxyXG4gIGlzRmxvYXRGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSkgfHwgdGhpcy5pc0RvdEtleShlKTtcclxuICB9LFxyXG4gIGlzQ3RybE9yQ29tbWFuZFByZXNzZWQ6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xyXG4gIH1cclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuaW50ZWdlci1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xyXG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XHJcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0Zsb2F0RmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuaW50ZWdlci1pbnB1dCwuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcclxuICAgIHZhciBtaW4gICA9ICQodGhpcykuYXR0cignbWluJyk7XHJcbiAgICB2YXIgbWF4ICAgPSAkKHRoaXMpLmF0dHIoJ21heCcpO1xyXG4gICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKTtcclxuICAgIFxyXG4gICAgaWYobWluICE9IG51bGwpIHtcclxuICAgICAgbWluID0gcGFyc2VGbG9hdChtaW4pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICBtYXggPSBwYXJzZUZsb2F0KG1heCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKG1pbiAhPSBudWxsICYmIHZhbHVlIDwgbWluKSB7XHJcbiAgICAgIHZhbHVlID0gbWluO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihtYXggIT0gbnVsbCAmJiB2YWx1ZSA+IG1heCkge1xyXG4gICAgICB2YWx1ZSA9IG1heDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgIGlmKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtaW47XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICAgIHZhbHVlID0gbWF4O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkKHRoaXMpLnZhbChcIlwiICsgdmFsdWUpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcztcclxuIiwiLyogXHJcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXHJcbiAqL1xyXG5cclxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcclxuICB0aGlzLmxpYnMgPSBsaWJzO1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5saWJzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7XHJcblxyXG4iLCIvKiBcclxuICogVGhlc2UgYXJlIHRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBkaXJlY3RseSB1dGlsaXplZCBieSB0aGUgdXNlciBpbnRlcmFjdGlvbnMuXHJcbiAqIElkZWFseSwgdGhpcyBmaWxlIGlzIGp1c3QgcmVxdWlyZWQgYnkgaW5kZXguanNcclxuICovXHJcblxyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XHJcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZ3JhcGgtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxuLy8gSGVscGVycyBzdGFydFxyXG5mdW5jdGlvbiBiZWZvcmVQZXJmb3JtTGF5b3V0KCkge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcclxuXHJcbiAgZ3JhcGhVdGlsaXRpZXMuZGlzYWJsZVBvcnRzKCk7XHJcblxyXG4gIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXHJcbiAgY3kuJCgnLmVkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xyXG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xyXG59O1xyXG4vLyBIZWxwZXJzIGVuZFxyXG5cclxuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHt9XHJcblxyXG4vLyBFeHBhbmQgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5leHBhbmROb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXNUb0V4cGFuZCA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2Rlcyhub2Rlcyk7XHJcbiAgaWYgKG5vZGVzVG9FeHBhbmQubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1RvRXhwYW5kLFxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kKG5vZGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDb2xsYXBzZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xyXG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcclxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XHJcbiAgXHJcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2Uobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbGxhcHNlIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5jb2xsYXBzZUNvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcclxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XHJcbiAgXHJcbiAgdmFyIGNvbXBsZXhlcyA9IGN5Lm5vZGVzKFwiW2NsYXNzPSdjb21wbGV4J11cIik7XHJcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMoY29tcGxleGVzKS5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2RlczogY29tcGxleGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KGNvbXBsZXhlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXhwYW5kIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5leHBhbmRDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXHJcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygpLmZpbHRlcihcIltjbGFzcz0nY29tcGxleCddXCIpKTtcclxuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbGxhcHNlIGFsbCBub2RlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcclxuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KG5vZGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBFeHBhbmQgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuZXhwYW5kQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMoY3kubm9kZXMoJzp2aXNpYmxlJykpO1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcclxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5oaWRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICBcclxuICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcclxuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xyXG5cclxuICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QuIFxyXG4vLyBUaGVuIHVuaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0IGFuZCBoaWRlcyBvdGhlcnMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuc2hvd05vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXHJcbiAgXHJcbiAgdmFyIGFsbE5vZGVzID0gY3kuZWxlbWVudHMoKTtcclxuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcclxuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xyXG4gIFxyXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVW5oaWRlcyBhbGwgZWxlbWVudHMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuc2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICBcclxuICBpZiAoY3kuZWxlbWVudHMoKS5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cygpKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLnNob3coY3kuZWxlbWVudHMoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gUmVtb3ZlcyB0aGUgZ2l2ZW4gZWxlbWVudHMgaW4gYSBzaW1wbGUgd2F5LiBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZSA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xyXG4gICAgICBlbGVzOiBlbGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLnJlbW92ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIHJlbW92ZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcclxuLy8gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTtcclxuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZU5vZGVzU21hcnRcIiwge1xyXG4gICAgICBmaXJzdFRpbWU6IHRydWUsXHJcbiAgICAgIGVsZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEhpZ2hsaWdodHMgbmVpZ2hib3VycyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0TmVpZ2hib3VycyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZOb2Rlcyhub2Rlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEZpbmRzIHRoZSBlbGVtZW50cyB3aG9zZSBsYWJlbCBpbmNsdWRlcyB0aGUgZ2l2ZW4gbGFiZWwgYW5kIGhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRob3NlIGVsZW1lbnRzLlxyXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLnNlYXJjaEJ5TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xyXG4gIGlmIChsYWJlbC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcclxuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgZWxlID0gaTtcclxuICAgIH1cclxuICAgIGlmIChlbGUuZGF0YShcImxhYmVsXCIpICYmIGVsZS5kYXRhKFwibGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxhYmVsKSA+PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICBpZiAobm9kZXNUb0hpZ2hsaWdodC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcblxyXG4gIG5vZGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRoZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQoZWxlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBVbmhpZ2hsaWdodHMgYW55IGhpZ2hsaWdodGVkIGVsZW1lbnQuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlSGlnaGxpZ2h0c1wiKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMoKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBQZXJmb3JtcyBsYXlvdXQgYnkgZ2l2ZW4gbGF5b3V0T3B0aW9ucy4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLiBIb3dldmVyLCBieSBzZXR0aW5nIG5vdFVuZG9hYmxlIHBhcmFtZXRlclxyXG4vLyB0byBhIHRydXRoeSB2YWx1ZSB5b3UgY2FuIGZvcmNlIGFuIHVuZGFibGUgbGF5b3V0IG9wZXJhdGlvbiBpbmRlcGVuZGFudCBvZiAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5wZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0T3B0aW9ucywgbm90VW5kb2FibGUpIHtcclxuICAvLyBUaGluZ3MgdG8gZG8gYmVmb3JlIHBlcmZvcm1pbmcgbGF5b3V0XHJcbiAgYmVmb3JlUGVyZm9ybUxheW91dCgpO1xyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSB8fCBub3RVbmRvYWJsZSkgeyAvLyAnbm90VW5kb2FibGUnIGZsYWcgY2FuIGJlIHVzZWQgdG8gaGF2ZSBjb21wb3NpdGUgYWN0aW9ucyBpbiB1bmRvL3JlZG8gc3RhY2tcclxuICAgIHZhciBsYXlvdXQgPSBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XHJcbiAgICBcclxuICAgIC8vIENoZWNrIHRoaXMgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcclxuICAgICAgbGF5b3V0LnJ1bigpO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJsYXlvdXRcIiwge1xyXG4gICAgICBvcHRpb25zOiBsYXlvdXRPcHRpb25zLFxyXG4gICAgICBlbGVzOiBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ3JlYXRlcyBhbiBzYmdubWwgZmlsZSBjb250ZW50IGZyb20gdGhlIGV4aXNpbmcgZ3JhcGggYW5kIHJldHVybnMgaXQuXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlU2Jnbm1sID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoKTtcclxufTtcclxuXHJcbi8vIENvbnZlcnRzIGdpdmVuIHNiZ25tbCBkYXRhIHRvIGEganNvbiBvYmplY3QgaW4gYSBzcGVjaWFsIGZvcm1hdCBcclxuLy8gKGh0dHA6Ly9qcy5jeXRvc2NhcGUub3JnLyNub3RhdGlvbi9lbGVtZW50cy1qc29uKSBhbmQgcmV0dXJucyBpdC5cclxubWFpblV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVG9Kc29uID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gIHJldHVybiBzYmdubWxUb0pzb24uY29udmVydChkYXRhKTtcclxufTtcclxuXHJcbi8vIENyZWF0ZSB0aGUgcXRpcCBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbm9kZSBhbmQgcmV0dXJucyBpdC5cclxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXHJcbiAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIGV4dHJhIHBhZGRpbmcgZm9yIGNvbXBhcnRtZW50XHJcbiAgZXh0cmFDb21wYXJ0bWVudFBhZGRpbmc6IDEwLFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZVxyXG59O1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICB9XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzO1xyXG4iLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxudmFyIGxpYnNiZ25qcyA9IHJlcXVpcmUoJ2xpYnNiZ24uanMnKTtcclxudmFyIHJlbmRlckV4dGVuc2lvbiA9IGxpYnNiZ25qcy5yZW5kZXJFeHRlbnNpb247XHJcblxyXG52YXIgc2Jnbm1sVG9Kc29uID0ge1xyXG4gIGluc2VydGVkTm9kZXM6IHt9LFxyXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKGdseXBoTGlzdCkge1xyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChnbHlwaExpc3RbaV0uY2xhc3NfID09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICB2YXIgY29tcGFydG1lbnQgPSBnbHlwaExpc3RbaV07XHJcbiAgICAgICAgdmFyIGJib3ggPSBjb21wYXJ0bWVudC5iYm94O1xyXG4gICAgICAgIGNvbXBhcnRtZW50cy5wdXNoKHtcclxuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94LngpLFxyXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3gueSksXHJcbiAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveC53KSxcclxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94LmgpLFxyXG4gICAgICAgICAgJ2lkJzogY29tcGFydG1lbnQuaWRcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcnRtZW50cy5zb3J0KGZ1bmN0aW9uIChjMSwgYzIpIHtcclxuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XHJcbiAgfSxcclxuICBpc0luQm91bmRpbmdCb3g6IGZ1bmN0aW9uIChiYm94MSwgYmJveDIpIHtcclxuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxyXG4gICAgICAgIGJib3gxLnkgPiBiYm94Mi55ICYmXHJcbiAgICAgICAgYmJveDEueCArIGJib3gxLncgPCBiYm94Mi54ICsgYmJveDIudyAmJlxyXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBiYm94UHJvcDogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcclxuXHJcbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMjtcclxuICAgIGJib3gueSA9IHBhcnNlRmxvYXQoYmJveC55KSArIHBhcnNlRmxvYXQoYmJveC5oKSAvIDI7XHJcblxyXG4gICAgcmV0dXJuIGJib3g7XHJcbiAgfSxcclxuICBzdGF0ZUFuZEluZm9CYm94UHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XHJcbiAgICB2YXIgeVBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC55KTtcclxuXHJcbiAgICB2YXIgYmJveCA9IGVsZS5iYm94O1xyXG5cclxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyIC0geFBvcztcclxuICAgIGJib3gueSA9IHBhcnNlRmxvYXQoYmJveC55KSArIHBhcnNlRmxvYXQoYmJveC5oKSAvIDIgLSB5UG9zO1xyXG5cclxuICAgIGJib3gueCA9IGJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcclxuICAgIGJib3gueSA9IGJib3gueSAvIHBhcnNlRmxvYXQocGFyZW50QmJveC5oKSAqIDEwMDtcclxuXHJcbiAgICByZXR1cm4gYmJveDtcclxuICB9LFxyXG4gIGZpbmRDaGlsZE5vZGVzOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcclxuICAgIC8vIGZpbmQgY2hpbGQgbm9kZXMgYXQgZGVwdGggbGV2ZWwgb2YgMSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudFxyXG4gICAgdmFyIGNoaWxkcmVuID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjaGlsZCA9IGVsZS5jaGlsZE5vZGVzW2ldO1xyXG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEgJiYgY2hpbGQudGFnTmFtZSA9PT0gY2hpbGRUYWdOYW1lKSB7XHJcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9LFxyXG4gIGZpbmRDaGlsZE5vZGU6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xyXG4gICAgdmFyIG5vZGVzID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsIGNoaWxkVGFnTmFtZSk7XHJcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCA/IG5vZGVzWzBdIDogdW5kZWZpbmVkO1xyXG4gIH0sXHJcbiAgc3RhdGVBbmRJbmZvUHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb0FycmF5ID0gW107XHJcblxyXG4gICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVyczsgLy8gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XHJcbiAgICAgIHZhciBpbmZvID0ge307XHJcblxyXG4gICAgICBpZiAoZ2x5cGguY2xhc3NfID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICBpbmZvLmlkID0gZ2x5cGguaWQgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc18gfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8ubGFiZWwgPSB7XHJcbiAgICAgICAgICAndGV4dCc6IChnbHlwaC5sYWJlbCAmJiBnbHlwaC5sYWJlbC50ZXh0KSB8fCB1bmRlZmluZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZ2x5cGguY2xhc3NfID09PSAnc3RhdGUgdmFyaWFibGUnKSB7XHJcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLmNsYXp6ID0gZ2x5cGguY2xhc3NfIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc3RhdGUgPSBnbHlwaC5zdGF0ZTtcclxuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUudmFsdWUpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgdmFyaWFibGUgPSAoc3RhdGUgJiYgc3RhdGUudmFyaWFibGUpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLnN0YXRlID0ge1xyXG4gICAgICAgICAgJ3ZhbHVlJzogdmFsdWUsXHJcbiAgICAgICAgICAndmFyaWFibGUnOiB2YXJpYWJsZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChpbmZvKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXR1cm4gc3RhdGVBbmRJbmZvQXJyYXk7XHJcbiAgfSxcclxuICBhZGRQYXJlbnRJbmZvVG9Ob2RlOiBmdW5jdGlvbiAoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNvbXBhcnRtZW50UmVmID0gZWxlLmNvbXBhcnRtZW50UmVmO1xyXG5cclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tcGFydG1lbnRSZWYpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gJyc7XHJcblxyXG4gICAgICAvLyBhZGQgY29tcGFydG1lbnQgYWNjb3JkaW5nIHRvIGdlb21ldHJ5XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJib3hFbCA9IGVsZS5iYm94O1xyXG4gICAgICAgIHZhciBiYm94ID0ge1xyXG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3hFbC54KSxcclxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwueSksXHJcbiAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveEVsLncpLFxyXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3hFbC5oKSxcclxuICAgICAgICAgICdpZCc6IGVsZS5pZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcclxuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBub2RlT2JqID0ge307XHJcblxyXG4gICAgLy8gYWRkIGlkIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmlkID0gZWxlLmlkO1xyXG4gICAgLy8gYWRkIG5vZGUgYm91bmRpbmcgYm94IGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmJib3ggPSBzZWxmLmJib3hQcm9wKGVsZSk7XHJcbiAgICAvLyBhZGQgY2xhc3MgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xyXG4gICAgLy8gYWRkIGxhYmVsIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmxhYmVsID0gKGVsZS5sYWJlbCAmJiBlbGUubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkO1xyXG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zdGF0ZXNhbmRpbmZvcyA9IHNlbGYuc3RhdGVBbmRJbmZvUHJvcChlbGUsIG5vZGVPYmouYmJveCk7XHJcbiAgICAvLyBhZGRpbmcgcGFyZW50IGluZm9ybWF0aW9uXHJcbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgLy8gYWRkIGNsb25lIGluZm9ybWF0aW9uXHJcbiAgICBpZiAoZWxlLmNsb25lKSB7XHJcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgdmFyIHBvcnRzID0gW107XHJcbiAgICB2YXIgcG9ydEVsZW1lbnRzID0gZWxlLnBvcnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0RWwgPSBwb3J0RWxlbWVudHNbaV07XHJcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5pZDtcclxuICAgICAgdmFyIHJlbGF0aXZlWFBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLngpIC0gbm9kZU9iai5iYm94Lng7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC55KSAtIG5vZGVPYmouYmJveC55O1xyXG5cclxuICAgICAgcmVsYXRpdmVYUG9zID0gcmVsYXRpdmVYUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiAxMDA7XHJcbiAgICAgIHJlbGF0aXZlWVBvcyA9IHJlbGF0aXZlWVBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogMTAwO1xyXG5cclxuICAgICAgcG9ydHMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcclxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xyXG4gICAgXHJcbiAgICB2YXIgX2NsYXNzID0gbm9kZU9iai5jbGFzcztcclxuICAgIC8vIElmIHRoZSBub2RlIGNhbiBoYXZlIHBvcnRzIGFuZCBpdCBoYXMgZXhhY3RseSAyIHBvcnRzIHRoZW4gaXQgc2hvdWxkIGJlIHJlcHJlc2VudGVkIGJ5IGEgYmlnZ2VyIGJib3guXHJcbiAgICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2UgcmVwcmVzZW50IGl0IGFzIGEgcG9seWdvbiBhbmQgc28gdGhlIHdob2xlIHNoYXBlIGluY2x1ZGluZyB0aGUgcG9ydHMgYXJlIHJlbmRlcmVkIGluIHRoZSBub2RlIGJib3guXHJcbiAgICBpZiAoX2NsYXNzID09PSAnYXNzb2NpYXRpb24nIHx8IF9jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnYW5kJyB8fCBfY2xhc3MgPT09ICdvcicgfHwgX2NsYXNzID09PSAnbm90JyB8fCBfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xyXG4gICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkICYmIHBvcnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBwb3J0cyBhcmUgc3ltbWV0cmljIHRvIHRoZSBub2RlIGNlbnRlciBzbyB1c2luZyBqdXN0IG9uZSBvZiB0aGUgcG9ydHMgaXMgZW5vdWdoXHJcbiAgICAgICAgdmFyIHBvcnQgPSBwb3J0c1swXTtcclxuICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBwb3J0LnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIHdpdGggcG9ydHMgb3ZlciB3aXRob3V0IHBvcnRzXHJcbiAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0LnkpIC8gNTAgOiBNYXRoLmFicyhwb3J0LngpIC8gNTA7XHJcbiAgICAgICAgLy8gTXVsdGlwbHkgdGhlIGJib3ggd2l0aCB0aGUgY2FsY3VsYXRlZCByYXRpb1xyXG4gICAgICAgIG5vZGVPYmouYmJveC53ID0gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiByYXRpbztcclxuICAgICAgICBub2RlT2JqLmJib3guaCA9IHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogcmF0aW87XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xyXG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNOb2RlKTtcclxuICB9LFxyXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBlbElkID0gZWxlLmlkO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NfXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy8gYWRkIGNvbXBsZXggbm9kZXMgaGVyZVxyXG5cclxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc187XHJcblxyXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdjb21wbGV4IG11bHRpbWVyJyB8fCBlbGVDbGFzcyA9PT0gJ3N1Ym1hcCcpIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAgIHZhciBjaGlsZEdseXBocyA9IGVsZS5nbHlwaE1lbWJlcnM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcclxuICAgICAgICB2YXIgZ2x5cGhDbGFzcyA9IGdseXBoLmNsYXNzXztcclxuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwganNvbkFycmF5LCBlbElkLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFBvcnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcclxuICB9LFxyXG4gIGdldEdseXBoczogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xyXG5cclxuICAgIGlmICghZ2x5cGhzKSB7XHJcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XHJcblxyXG4gICAgICB2YXIgaWQyZ2x5cGggPSB4bWxPYmplY3QuX2lkMmdseXBoID0ge307XHJcblxyXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIGcgPSBnbHlwaHNbaV07XHJcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblxyXG4gICAgICAgIGlkMmdseXBoWyBpZCBdID0gZztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnbHlwaHM7XHJcbiAgfSxcclxuICBnZXRHbHlwaEJ5SWQ6IGZ1bmN0aW9uICh4bWxPYmplY3QsIGlkKSB7XHJcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcclxuXHJcbiAgICByZXR1cm4geG1sT2JqZWN0Ll9pZDJnbHlwaFtpZF07XHJcbiAgfSxcclxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xyXG4gICAgLy8gc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcclxuICAgIHZhciBzb3VyY2UgPSBhcmMuc291cmNlO1xyXG4gICAgdmFyIHRhcmdldCA9IGFyYy50YXJnZXQ7XHJcbiAgICB2YXIgc291cmNlTm9kZUlkO1xyXG4gICAgdmFyIHRhcmdldE5vZGVJZDtcclxuXHJcbiAgICB2YXIgc291cmNlRXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCBzb3VyY2UpO1xyXG4gICAgdmFyIHRhcmdldEV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgdGFyZ2V0KTtcclxuXHJcbiAgICBpZiAoc291cmNlRXhpc3RzKSB7XHJcbiAgICAgIHNvdXJjZU5vZGVJZCA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0RXhpc3RzKSB7XHJcbiAgICAgIHRhcmdldE5vZGVJZCA9IHRhcmdldDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgcG9ydEVscyA9IHRoaXMuZ2V0UG9ydHMoeG1sT2JqZWN0KTtcclxuICAgIHZhciBwb3J0O1xyXG4gICAgaWYgKHNvdXJjZU5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xyXG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gc291cmNlKSB7XHJcbiAgICAgICAgICBzb3VyY2VOb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXROb2RlSWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xyXG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXROb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7J3NvdXJjZSc6IHNvdXJjZU5vZGVJZCwgJ3RhcmdldCc6IHRhcmdldE5vZGVJZH07XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gW107XHJcblxyXG4gICAgdmFyIGNoaWxkcmVuID0gZWxlLm5leHRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvc1ggPSBjaGlsZHJlbltpXS54O1xyXG4gICAgICB2YXIgcG9zWSA9IGNoaWxkcmVuW2ldLnk7XHJcblxyXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgeDogcG9zWCxcclxuICAgICAgICB5OiBwb3NZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XHJcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc19dKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xyXG5cclxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlZGdlT2JqID0ge307XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcclxuXHJcbiAgICBlZGdlT2JqLmlkID0gZWxlLmlkIHx8IHVuZGVmaW5lZDtcclxuICAgIGVkZ2VPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xyXG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcblxyXG4gICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IDA7XHJcbiAgICBpZiAoZWxlLmdseXBocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmdseXBocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbGUuZ2x5cGhzW2ldLmNsYXNzXyA9PT0gJ2NhcmRpbmFsaXR5Jykge1xyXG4gICAgICAgICAgdmFyIGxhYmVsID0gZWxlLmdseXBoc1tpXS5sYWJlbDtcclxuICAgICAgICAgIGVkZ2VPYmouY2FyZGluYWxpdHkgPSBsYWJlbC50ZXh0IHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlZGdlT2JqLnNvdXJjZSA9IHNvdXJjZUFuZFRhcmdldC5zb3VyY2U7XHJcbiAgICBlZGdlT2JqLnRhcmdldCA9IHNvdXJjZUFuZFRhcmdldC50YXJnZXQ7XHJcblxyXG4gICAgZWRnZU9iai5wb3J0c291cmNlID0gZWxlLnNvdXJjZTtcclxuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9IGVsZS50YXJnZXQ7XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcclxuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzRWRnZSk7XHJcbiAgfSxcclxuICBhcHBseVN0eWxlOiBmdW5jdGlvbiAocmVuZGVySW5mb3JtYXRpb24sIG5vZGVzLCBlZGdlcykge1xyXG4gICAgLy8gZ2V0IGFsbCBjb2xvciBpZCByZWZlcmVuY2VzIHRvIHRoZWlyIHZhbHVlXHJcbiAgICB2YXIgY29sb3JMaXN0ID0gcmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucy5jb2xvckRlZmluaXRpb25zO1xyXG4gICAgdmFyIGNvbG9ySURUb1ZhbHVlID0ge307XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBjb2xvckxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29sb3JJRFRvVmFsdWVbY29sb3JMaXN0W2ldLmlkXSA9IGNvbG9yTGlzdFtpXS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb252ZXJ0IHN0eWxlIGxpc3QgdG8gZWxlbWVudElkLWluZGV4ZWQgb2JqZWN0IHBvaW50aW5nIHRvIHN0eWxlXHJcbiAgICAvLyBhbHNvIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlcyB0byBjb2xvciB2YWx1ZXNcclxuICAgIHZhciBzdHlsZUxpc3QgPSByZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZTdHlsZXMuc3R5bGVzO1xyXG4gICAgdmFyIGVsZW1lbnRJRFRvU3R5bGUgPSB7fTtcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3R5bGUgPSBzdHlsZUxpc3RbaV07XHJcbiAgICAgIHZhciByZW5kZXJHcm91cCA9IHN0eWxlLnJlbmRlckdyb3VwO1xyXG5cclxuICAgICAgLy8gY29udmVydCBjb2xvciByZWZlcmVuY2VzXHJcbiAgICAgIGlmIChyZW5kZXJHcm91cC5zdHJva2UgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlbmRlckdyb3VwLnN0cm9rZSA9IGNvbG9ySURUb1ZhbHVlW3JlbmRlckdyb3VwLnN0cm9rZV07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJlbmRlckdyb3VwLmZpbGwgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlbmRlckdyb3VwLmZpbGwgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5maWxsXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGlkTGlzdCA9IHN0eWxlLmlkTGlzdC5zcGxpdCgnICcpO1xyXG4gICAgICBmb3IgKHZhciBqPTA7IGogPCBpZExpc3QubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB2YXIgaWQgPSBpZExpc3Rbal07XHJcbiAgICAgICAgZWxlbWVudElEVG9TdHlsZVtpZF0gPSByZW5kZXJHcm91cDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhleFRvRGVjaW1hbCAoaGV4KSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlSW50KCcweCcraGV4KSAvIDI1NSAqIDEwMCkgLyAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udmVydEhleENvbG9yIChoZXgpIHtcclxuICAgICAgaWYgKGhleC5sZW5ndGggPT0gNykgeyAvLyBubyBvcGFjaXR5IHByb3ZpZGVkXHJcbiAgICAgICAgcmV0dXJuIHtvcGFjaXR5OiBudWxsLCBjb2xvcjogaGV4fTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgLy8gbGVuZ3RoIG9mIDlcclxuICAgICAgICB2YXIgY29sb3IgPSBoZXguc2xpY2UoMCw3KTtcclxuICAgICAgICB2YXIgb3BhY2l0eSA9IGhleFRvRGVjaW1hbChoZXguc2xpY2UoLTIpKTtcclxuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG9wYWNpdHksIGNvbG9yOiBjb2xvcn07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhcHBseSB0aGUgc3R5bGUgdG8gbm9kZXMgYW5kIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdCBzdHlsZVxyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBjb2xvciBwcm9wZXJ0aWVzLCB3ZSBuZWVkIHRvIGNoZWNrIG9wYWNpdHlcclxuICAgICAgdmFyIGJnQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZmlsbDtcclxuICAgICAgaWYgKGJnQ29sb3IpIHtcclxuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGJnQ29sb3IpO1xyXG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1jb2xvciddID0gcmVzLmNvbG9yO1xyXG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1vcGFjaXR5J10gPSByZXMub3BhY2l0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGJvcmRlckNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcclxuICAgICAgaWYgKGJvcmRlckNvbG9yKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihib3JkZXJDb2xvcik7XHJcbiAgICAgICAgbm9kZS5kYXRhWydib3JkZXItY29sb3InXSA9IHJlcy5jb2xvcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGJvcmRlcldpZHRoID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xyXG4gICAgICBpZiAoYm9yZGVyV2lkdGgpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ2JvcmRlci13aWR0aCddID0gYm9yZGVyV2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250U2l6ZSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250U2l6ZTtcclxuICAgICAgaWYgKGZvbnRTaXplKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXNpemUnXSA9IGZvbnRTaXplO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZm9udEZhbWlseSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250RmFtaWx5O1xyXG4gICAgICBpZiAoZm9udEZhbWlseSkge1xyXG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1mYW1pbHknXSA9IGZvbnRGYW1pbHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250U3R5bGUgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFN0eWxlO1xyXG4gICAgICBpZiAoZm9udFN0eWxlKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXN0eWxlJ10gPSBmb250U3R5bGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250V2VpZ2h0ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRXZWlnaHQ7XHJcbiAgICAgIGlmIChmb250V2VpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXdlaWdodCddID0gZm9udFdlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udGV4dEFuY2hvcjtcclxuICAgICAgaWYgKHRleHRBbmNob3IpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ3RleHQtaGFsaWduJ10gPSB0ZXh0QW5jaG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdnRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udnRleHRBbmNob3I7XHJcbiAgICAgIGlmICh2dGV4dEFuY2hvcikge1xyXG4gICAgICAgIG5vZGUuZGF0YVsndGV4dC12YWxpZ24nXSA9IHZ0ZXh0QW5jaG9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG8gdGhlIHNhbWUgZm9yIGVkZ2VzXHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xyXG5cclxuICAgICAgdmFyIGxpbmVDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbZWRnZS5kYXRhWydpZCddXS5zdHJva2U7XHJcbiAgICAgIGlmIChsaW5lQ29sb3IpIHtcclxuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGxpbmVDb2xvcik7XHJcbiAgICAgICAgZWRnZS5kYXRhWydsaW5lLWNvbG9yJ10gPSByZXMuY29sb3I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRJRFRvU3R5bGVbZWRnZS5kYXRhWydpZCddXS5zdHJva2VXaWR0aDtcclxuICAgICAgaWYgKHdpZHRoKSB7XHJcbiAgICAgICAgZWRnZS5kYXRhWyd3aWR0aCddID0gd2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGNvbnZlcnQ6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XHJcbiAgICB2YXIgY3l0b3NjYXBlSnNFZGdlcyA9IFtdO1xyXG5cclxuICAgIHZhciBzYmduID0gbGlic2JnbmpzLlNiZ24uZnJvbVhNTCh4bWxPYmplY3QucXVlcnlTZWxlY3Rvcignc2JnbicpKTtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBzZWxmLmdldEFsbENvbXBhcnRtZW50cyhzYmduLm1hcC5nbHlwaHMpO1xyXG5cclxuICAgIHZhciBnbHlwaHMgPSBzYmduLm1hcC5nbHlwaHM7XHJcbiAgICB2YXIgYXJjcyA9IHNiZ24ubWFwLmFyY3M7XHJcblxyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBnbHlwaCA9IGdseXBoc1tpXTtcclxuICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKGdseXBoLCBjeXRvc2NhcGVKc05vZGVzLCAnJywgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJjcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYXJjID0gYXJjc1tpXTtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc0VkZ2UoYXJjLCBjeXRvc2NhcGVKc0VkZ2VzLCB4bWxPYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzYmduLm1hcC5leHRlbnNpb24gJiYgc2Jnbi5tYXAuZXh0ZW5zaW9uLmhhcygncmVuZGVySW5mb3JtYXRpb24nKSkgeyAvLyByZW5kZXIgZXh0ZW5zaW9uIHdhcyBmb3VuZFxyXG4gICAgICBzZWxmLmFwcGx5U3R5bGUoc2Jnbi5tYXAuZXh0ZW5zaW9uLmdldCgncmVuZGVySW5mb3JtYXRpb24nKSwgY3l0b3NjYXBlSnNOb2RlcywgY3l0b3NjYXBlSnNFZGdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcclxuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5lZGdlcyA9IGN5dG9zY2FwZUpzRWRnZXM7XHJcblxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XHJcblxyXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XHJcbiIsIi8qXHJcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xyXG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XHJcbiAgdHJ1bmNhdGVUZXh0OiBmdW5jdGlvbiAodGV4dFByb3AsIGZvbnQpIHtcclxuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY29udGV4dC5mb250ID0gZm9udDtcclxuICAgIFxyXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBcclxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcclxuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcclxuICAgIGlmIChmaXRMYWJlbHNUb05vZGVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHdpZHRoO1xyXG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xyXG4gICAgdmFyIHRleHRXaWR0aCA9ICh0ZXh0UHJvcC53aWR0aCA+IDMwKSA/IHRleHRQcm9wLndpZHRoIC0gMTAgOiB0ZXh0UHJvcC53aWR0aDtcclxuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xyXG4gICAgICAtLWxlbjtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGxlbikgKyBlbGxpcHNpcztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH0sXHJcblxyXG4gIC8vIGVuc3VyZSB0aGF0IHJldHVybmVkIHN0cmluZyBmb2xsb3dzIHhzZDpJRCBzdGFuZGFyZFxyXG4gIC8vIHNob3VsZCBmb2xsb3cgcideW2EtekEtWl9dW1xcdy4tXSokJ1xyXG4gIGdldFhNTFZhbGlkSWQ6IGZ1bmN0aW9uKG9yaWdpbmFsSWQpIHtcclxuICAgIHZhciBuZXdJZCA9IFwiXCI7XHJcbiAgICB2YXIgeG1sVmFsaWRSZWdleCA9IC9eW2EtekEtWl9dW1xcdy4tXSokLztcclxuICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChvcmlnaW5hbElkKSkgeyAvLyBkb2Vzbid0IGNvbXBseVxyXG4gICAgICBuZXdJZCA9IG9yaWdpbmFsSWQ7XHJcbiAgICAgIG5ld0lkID0gbmV3SWQucmVwbGFjZSgvW15cXHcuLV0vZywgXCJcIik7XHJcbiAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gc3RpbGwgZG9lc24ndCBjb21wbHlcclxuICAgICAgICBuZXdJZCA9IFwiX1wiICsgbmV3SWQ7XHJcbiAgICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBub3JtYWxseSB3ZSBzaG91bGQgbmV2ZXIgZW50ZXIgdGhpc1xyXG4gICAgICAgICAgLy8gaWYgZm9yIHNvbWUgb2JzY3VyZSByZWFzb24gd2Ugc3RpbGwgZG9uJ3QgY29tcGx5LCB0aHJvdyBlcnJvci5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgaWRlbnRpZmVyIGNvbXBseSB0byB4c2Q6SUQgcmVxdWlyZW1lbnRzOiBcIituZXdJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdJZDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gb3JpZ2luYWxJZDtcclxuICAgIH1cclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0VXRpbGl0aWVzOyIsIi8qXHJcbiAqIENvbW1vbmx5IG5lZWRlZCBVSSBVdGlsaXRpZXNcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgdWlVdGlsaXRpZXMgPSB7XHJcbiAgc3RhcnRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLndpZHRoKCk7XHJcbiAgICAgIHZhciBjb250YWluZXJIZWlnaHQgPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS5oZWlnaHQoKTtcclxuICAgICAgJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciArICc6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGNsYXNzTmFtZSArICdcIj48L2k+Jyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKCcuJyArIGNsYXNzTmFtZSkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1aVV0aWxpdGllcztcclxuXHJcblxyXG4iLCIvKlxyXG4gKiBUaGlzIGZpbGUgZXhwb3J0cyB0aGUgZnVuY3Rpb25zIHRvIGJlIHV0aWxpemVkIGluIHVuZG9yZWRvIGV4dGVuc2lvbiBhY3Rpb25zIFxyXG4gKi9cclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB7XHJcbiAgLy8gU2VjdGlvbiBTdGFydFxyXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG4gIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgdmFyIHBhcmFtID0ge307XHJcbiAgICBwYXJhbS5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcclxuICAgIHJldHVybiBwYXJhbTtcclxuICB9LFxyXG4gIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0KHBhcmFtLmVsZXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIC8vIFNlY3Rpb24gRW5kXHJcbiAgLy8gQWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==

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
            'padding': 0,
            'text-wrap': 'wrap'
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
          .selector("node:childless[bbox]")
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
    
    // Returns whether the given element or elements with the given class can have ports.
    canHavePorts : function(ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
      return ($.inArray(sbgnclass, this.processTypes) >= 0 ||  sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
    },
      
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
        if ( this.canHavePorts(_class) ) {
          
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

      if (this.canHavePorts(_class)) {
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
    },
    /*
     * Return ordering of ports of a node.
     * Possible return values are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'
     */
    getPortsOrdering: function(node) {
      var ports = node.data('ports');
      if (ports.length !== 2) {
        return 'none'; // Nodes are supposed to have 2 nodes or none
      }
      
      /*
       * Retursn if the given portId is porttarget of any of the given edges.
       * These edges are expected to be the edges connected to the node associated with that port.
       */
      var isPortTargetOfAnyEdge = function(edges, portId) {
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data('porttarget') === portId) {
            return true;
          }
        }
        
        return false;
      };
      
      // If the ports are located above/below of the node then the orientation is 'vertical' else it is 'horizontal'.
      var orientation = ports[0].x === 0 ? 'vertical' : 'horizontal';
      // We need the connected edges of the node to find out if a port is an input port or an output port
      var connectedEdges = node.connectedEdges();
      
      if (orientation === 'horizontal') {
        var leftPortId = ports[0].x < 0 ? ports[0].id : ports[1].id; // Left port is the port whose x value is negative
        // If left port is port target for any of connected edges then the ordering is 'L-to-R' else it is 'R-to-L'
        if (isPortTargetOfAnyEdge(connectedEdges, leftPortId)) {
          return 'L-to-R';
        }
        return 'R-to-L';
      }
      else {
        var topPortId = ports[0].y < 0 ? ports[0].id : ports[1].id; // Top port is the port whose y value is negative
        // If top  port is port target for any of connected edges then the ordering is 'T-to-B' else it is 'B-to-T'
        if (isPortTargetOfAnyEdge(connectedEdges, topPortId)) {
          return 'T-to-B';
        }
        return 'B-to-T';
      }
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
var elementUtilities = _dereq_('./element-utilities');
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
        if (elementUtilities.canHavePorts(_class)) {
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

},{"../../package.json":8,"./element-utilities":12,"./graph-utilities":14,"./text-utilities":21,"libsbgn.js":2,"pretty-data":4}],16:[function(_dereq_,module,exports){
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
    if (elementUtilities.canHavePorts(_class)) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy9saWJzYmduLXJlbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9saWJzYmduLmpzL2xpYnNiZ24uanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvcHJldHR5LWRhdGEvcHJldHR5LWRhdGEuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS1wYXJzZXIuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy94bWxkb20vc2F4LmpzIiwicGFja2FnZS5qc29uIiwic3JjL2luZGV4LmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlLmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyLmpzIiwic3JjL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy91aS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2hlY2tQYXJhbXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpLmNoZWNrUGFyYW1zO1xyXG52YXIgeG1sZG9tID0gcmVxdWlyZSgneG1sZG9tJyk7XHJcblxyXG52YXIgbnMgPSB7fTtcclxuXHJcbm5zLnhtbG5zID0gXCJodHRwOi8vd3d3LnNibWwub3JnL3NibWwvbGV2ZWwzL3ZlcnNpb24xL3JlbmRlci92ZXJzaW9uMVwiO1xyXG5cclxuLy8gLS0tLS0tLSBDT0xPUkRFRklOSVRJT04gLS0tLS0tLVxyXG5ucy5Db2xvckRlZmluaXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ3ZhbHVlJ10pO1xyXG5cdHRoaXMuaWQgXHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLnZhbHVlIFx0PSBwYXJhbXMudmFsdWU7XHJcbn07XHJcblxyXG5ucy5Db2xvckRlZmluaXRpb24ucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdjb2xvckRlZmluaXRpb24nKTtcclxuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRjb2xvckRlZmluaXRpb24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XHJcblx0XHRjb2xvckRlZmluaXRpb24uc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudmFsdWUpO1xyXG5cdH1cclxuXHRyZXR1cm4gY29sb3JEZWZpbml0aW9uO1xyXG59O1xyXG5cclxubnMuQ29sb3JEZWZpbml0aW9uLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkNvbG9yRGVmaW5pdGlvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAnY29sb3JEZWZpbml0aW9uJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBjb2xvckRlZmluaXRpb24sIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgbnMuQ29sb3JEZWZpbml0aW9uKCk7XHJcblx0Y29sb3JEZWZpbml0aW9uLmlkIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0Y29sb3JEZWZpbml0aW9uLnZhbHVlIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xyXG5cdHJldHVybiBjb2xvckRlZmluaXRpb247XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIENPTE9SREVGSU5JVElPTiAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIExJU1RPRkNPTE9SREVGSU5JVElPTlMgLS0tLS0tLVxyXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMuY29sb3JEZWZpbml0aW9ucyA9IFtdO1xyXG59O1xyXG5cclxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUuYWRkQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24gKGNvbG9yRGVmaW5pdGlvbikge1xyXG5cdHRoaXMuY29sb3JEZWZpbml0aW9ucy5wdXNoKGNvbG9yRGVmaW5pdGlvbik7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnKTtcclxuXHRmb3IodmFyIGk9MDsgaTx0aGlzLmNvbG9yRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb2xvckRlZmluaXRpb25zW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcclxufTtcclxuXHJcbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGlzdE9mQ29sb3JEZWZpbml0aW9ucywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgbnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xyXG5cclxuXHR2YXIgY29sb3JEZWZpbml0aW9ucyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY29sb3JEZWZpbml0aW9uJyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpPGNvbG9yRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBjb2xvckRlZmluaXRpb25YTUwgPSBjb2xvckRlZmluaXRpb25zW2ldO1xyXG5cdFx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5zLkNvbG9yRGVmaW5pdGlvbi5mcm9tWE1MKGNvbG9yRGVmaW5pdGlvblhNTCk7XHJcblx0XHRsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFkZENvbG9yRGVmaW5pdGlvbihjb2xvckRlZmluaXRpb24pO1xyXG5cdH1cclxuXHRyZXR1cm4gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgTElTVE9GQ09MT1JERUZJTklUSU9OUyAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFJFTkRFUkdST1VQIC0tLS0tLS1cclxubnMuUmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0Ly8gZWFjaCBvZiB0aG9zZSBhcmUgb3B0aW9uYWwsIHNvIHRlc3QgaWYgaXQgaXMgZGVmaW5lZCBpcyBtYW5kYXRvcnlcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2ZvbnRTaXplJywgJ2ZvbnRGYW1pbHknLCAnZm9udFdlaWdodCcsIFxyXG5cdFx0J2ZvbnRTdHlsZScsICd0ZXh0QW5jaG9yJywgJ3Z0ZXh0QW5jaG9yJywgJ2ZpbGwnLCAnaWQnLCAnc3Ryb2tlJywgJ3N0cm9rZVdpZHRoJ10pO1xyXG5cdC8vIHNwZWNpZmljIHRvIHJlbmRlckdyb3VwXHJcblx0dGhpcy5mb250U2l6ZSBcdFx0PSBwYXJhbXMuZm9udFNpemU7XHJcblx0dGhpcy5mb250RmFtaWx5IFx0PSBwYXJhbXMuZm9udEZhbWlseTtcclxuXHR0aGlzLmZvbnRXZWlnaHQgXHQ9IHBhcmFtcy5mb250V2VpZ2h0O1xyXG5cdHRoaXMuZm9udFN0eWxlIFx0XHQ9IHBhcmFtcy5mb250U3R5bGU7XHJcblx0dGhpcy50ZXh0QW5jaG9yIFx0PSBwYXJhbXMudGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xyXG5cdHRoaXMudnRleHRBbmNob3IgXHQ9IHBhcmFtcy52dGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xyXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMkRcclxuXHR0aGlzLmZpbGwgXHRcdFx0PSBwYXJhbXMuZmlsbDsgLy8gZmlsbCBjb2xvclxyXG5cdC8vIGZyb20gR3JhcGhpY2FsUHJpbWl0aXZlMURcclxuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMuc3Ryb2tlIFx0XHQ9IHBhcmFtcy5zdHJva2U7IC8vIHN0cm9rZSBjb2xvclxyXG5cdHRoaXMuc3Ryb2tlV2lkdGggXHQ9IHBhcmFtcy5zdHJva2VXaWR0aDtcclxufTtcclxuXHJcbm5zLlJlbmRlckdyb3VwLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgcmVuZGVyR3JvdXAgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdnJyk7XHJcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5mb250U2l6ZSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2ZvbnRTaXplJywgdGhpcy5mb250U2l6ZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmZvbnRGYW1pbHkgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250RmFtaWx5JywgdGhpcy5mb250RmFtaWx5KTtcclxuXHR9XHJcblx0aWYgKHRoaXMuZm9udFdlaWdodCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2ZvbnRXZWlnaHQnLCB0aGlzLmZvbnRXZWlnaHQpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5mb250U3R5bGUgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250U3R5bGUnLCB0aGlzLmZvbnRTdHlsZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLnRleHRBbmNob3IgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCd0ZXh0QW5jaG9yJywgdGhpcy50ZXh0QW5jaG9yKTtcclxuXHR9XHJcblx0aWYgKHRoaXMudnRleHRBbmNob3IgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCd2dGV4dEFuY2hvcicsIHRoaXMudnRleHRBbmNob3IpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5zdHJva2UgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLnN0cm9rZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLnN0cm9rZVdpZHRoICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnc3Ryb2tlV2lkdGgnLCB0aGlzLnN0cm9rZVdpZHRoKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuZmlsbCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLmZpbGwpO1xyXG5cdH1cclxuXHRyZXR1cm4gcmVuZGVyR3JvdXA7XHJcbn07XHJcblxyXG5ucy5SZW5kZXJHcm91cC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5SZW5kZXJHcm91cC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAnZycpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHJlbmRlckdyb3VwID0gbmV3IG5zLlJlbmRlckdyb3VwKHt9KTtcclxuXHRyZW5kZXJHcm91cC5pZCBcdFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0cmVuZGVyR3JvdXAuZm9udFNpemUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTaXplJyk7XHJcblx0cmVuZGVyR3JvdXAuZm9udEZhbWlseSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udEZhbWlseScpO1xyXG5cdHJlbmRlckdyb3VwLmZvbnRXZWlnaHQgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRXZWlnaHQnKTtcclxuXHRyZW5kZXJHcm91cC5mb250U3R5bGUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTdHlsZScpO1xyXG5cdHJlbmRlckdyb3VwLnRleHRBbmNob3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3RleHRBbmNob3InKTtcclxuXHRyZW5kZXJHcm91cC52dGV4dEFuY2hvciA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Z0ZXh0QW5jaG9yJyk7XHJcblx0cmVuZGVyR3JvdXAuc3Ryb2tlIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpO1xyXG5cdHJlbmRlckdyb3VwLnN0cm9rZVdpZHRoID0geG1sLmdldEF0dHJpYnV0ZSgnc3Ryb2tlV2lkdGgnKTtcclxuXHRyZW5kZXJHcm91cC5maWxsIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKTtcclxuXHRyZXR1cm4gcmVuZGVyR3JvdXA7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFJFTkRFUkdST1VQIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gU1RZTEUgLS0tLS0tLVxyXG4vLyBsb2NhbFN0eWxlIGZyb20gc3BlY3NcclxubnMuU3R5bGUgPSBmdW5jdGlvbihwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ25hbWUnLCAnaWRMaXN0JywgJ3JlbmRlckdyb3VwJ10pO1xyXG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy5uYW1lIFx0XHRcdD0gcGFyYW1zLm5hbWU7XHJcblx0dGhpcy5pZExpc3QgXHRcdD0gcGFyYW1zLmlkTGlzdDsgLy8gVE9ETyBhZGQgdXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFuYWdlIHRoaXMgKHNob3VsZCBiZSBhcnJheSlcclxuXHR0aGlzLnJlbmRlckdyb3VwIFx0PSBwYXJhbXMucmVuZGVyR3JvdXA7XHJcbn07XHJcblxyXG5ucy5TdHlsZS5wcm90b3R5cGUuc2V0UmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocmVuZGVyR3JvdXApIHtcclxuXHR0aGlzLnJlbmRlckdyb3VwID0gcmVuZGVyR3JvdXA7XHJcbn07XHJcblxyXG5ucy5TdHlsZS5wcm90b3R5cGUuZ2V0SWRMaXN0QXNBcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gdGhpcy5pZExpc3Quc3BsaXQoJyAnKTtcclxufVxyXG5cclxubnMuU3R5bGUucHJvdG90eXBlLnNldElkTGlzdEZyb21BcnJheSA9IGZ1bmN0aW9uIChpZEFycmF5KSB7XHJcblx0dGhpcy5pZExpc3QgPSBpZEFycmF5LmpvaW4oJyAnKTtcclxufVxyXG5cclxubnMuU3R5bGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzdHlsZSA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcclxuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnbmFtZScsIHRoaXMubmFtZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmlkTGlzdCAhPSBudWxsKSB7XHJcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2lkTGlzdCcsIHRoaXMuaWRMaXN0KTtcclxuXHR9XHJcblxyXG5cdGlmICh0aGlzLnJlbmRlckdyb3VwKSB7XHJcblx0XHRzdHlsZS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlckdyb3VwLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGU7XHJcbn07XHJcblxyXG5ucy5TdHlsZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5TdHlsZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xyXG5cdGlmICh4bWwudGFnTmFtZSAhPSAnc3R5bGUnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHN0eWxlLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgc3R5bGUgPSBuZXcgbnMuU3R5bGUoKTtcclxuXHRzdHlsZS5pZCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdHN0eWxlLm5hbWUgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xyXG5cdHN0eWxlLmlkTGlzdCBcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWRMaXN0Jyk7XHJcblxyXG5cdHZhciByZW5kZXJHcm91cFhNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZycpWzBdO1xyXG5cdGlmIChyZW5kZXJHcm91cFhNTCAhPSBudWxsKSB7XHJcblx0XHRzdHlsZS5yZW5kZXJHcm91cCA9IG5zLlJlbmRlckdyb3VwLmZyb21YTUwocmVuZGVyR3JvdXBYTUwpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGU7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFNUWUxFIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gTElTVE9GU1RZTEVTIC0tLS0tLS1cclxubnMuTGlzdE9mU3R5bGVzID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5zdHlsZXMgPSBbXTtcclxufTtcclxuXHJcbm5zLkxpc3RPZlN0eWxlcy5wcm90b3R5cGUuYWRkU3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xyXG5cdHRoaXMuc3R5bGVzLnB1c2goc3R5bGUpO1xyXG59O1xyXG5cclxubnMuTGlzdE9mU3R5bGVzLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGlzdE9mU3R5bGVzJyk7XHJcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5zdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGxpc3RPZlN0eWxlcy5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIGxpc3RPZlN0eWxlcztcclxufTtcclxuXHJcbm5zLkxpc3RPZlN0eWxlcy5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZTdHlsZXMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2xpc3RPZlN0eWxlcycpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGlzdE9mU3R5bGVzLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgbGlzdE9mU3R5bGVzID0gbmV3IG5zLkxpc3RPZlN0eWxlcygpO1xyXG5cclxuXHR2YXIgc3R5bGVzID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdHlsZScpO1xyXG5cdGZvciAodmFyIGk9MDsgaTxzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBzdHlsZVhNTCA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBzdHlsZSA9IG5zLlN0eWxlLmZyb21YTUwoc3R5bGVYTUwpO1xyXG5cdFx0bGlzdE9mU3R5bGVzLmFkZFN0eWxlKHN0eWxlKTtcclxuXHR9XHJcblx0cmV0dXJuIGxpc3RPZlN0eWxlcztcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgTElTVE9GU1RZTEVTIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gUkVOREVSSU5GT1JNQVRJT04gLS0tLS0tLVxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ25hbWUnLCAncHJvZ3JhbU5hbWUnLCBcclxuXHRcdCdwcm9ncmFtVmVyc2lvbicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycsICdsaXN0T2ZTdHlsZXMnXSk7XHJcblx0dGhpcy5pZCBcdFx0XHRcdFx0PSBwYXJhbXMuaWQ7IC8vIHJlcXVpcmVkLCByZXN0IGlzIG9wdGlvbmFsXHJcblx0dGhpcy5uYW1lIFx0XHRcdFx0XHQ9IHBhcmFtcy5uYW1lO1xyXG5cdHRoaXMucHJvZ3JhbU5hbWUgXHRcdFx0PSBwYXJhbXMucHJvZ3JhbU5hbWU7XHJcblx0dGhpcy5wcm9ncmFtVmVyc2lvbiBcdFx0PSBwYXJhbXMucHJvZ3JhbVZlcnNpb247XHJcblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgXHRcdD0gcGFyYW1zLmJhY2tncm91bmRDb2xvcjtcclxuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBwYXJhbXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucztcclxuXHR0aGlzLmxpc3RPZlN0eWxlcyBcdFx0XHQ9IHBhcmFtcy5saXN0T2ZTdHlsZXM7XHJcblx0Lyp0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMocmVuZGVySW5mby5jb2xvckRlZi5jb2xvckxpc3QpO1xyXG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMocmVuZGVySW5mby5zdHlsZURlZik7XHJcblx0Ki9cclxufTtcclxuXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb25zID0gZnVuY3Rpb24obGlzdE9mQ29sb3JEZWZpbml0aW9ucykge1xyXG5cdHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XHJcbn07XHJcblxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mU3R5bGVzID0gZnVuY3Rpb24obGlzdE9mU3R5bGVzKSB7XHJcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBsaXN0T2ZTdHlsZXM7XHJcbn07XHJcblxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgncmVuZGVySW5mb3JtYXRpb24nKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgbnMueG1sbnMpO1xyXG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ25hbWUnLCB0aGlzLm5hbWUpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5wcm9ncmFtTmFtZSAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ3Byb2dyYW1OYW1lJywgdGhpcy5wcm9ncmFtTmFtZSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLnByb2dyYW1WZXJzaW9uICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgncHJvZ3JhbVZlcnNpb24nLCB0aGlzLnByb2dyYW1WZXJzaW9uKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuYmFja2dyb3VuZENvbG9yICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgnYmFja2dyb3VuZENvbG9yJywgdGhpcy5iYWNrZ3JvdW5kQ29sb3IpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucykge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uYXBwZW5kQ2hpbGQodGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5saXN0T2ZTdHlsZXMpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLmFwcGVuZENoaWxkKHRoaXMubGlzdE9mU3R5bGVzLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XHJcbn07XHJcblxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbi8vIHN0YXRpYyBjb25zdHJ1Y3RvciBtZXRob2RcclxubnMuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ3JlbmRlckluZm9ybWF0aW9uJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSByZW5kZXJJbmZvcm1hdGlvbiwgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IG5zLlJlbmRlckluZm9ybWF0aW9uKCk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24uaWQgXHRcdFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24ubmFtZSBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLnByb2dyYW1OYW1lIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Byb2dyYW1OYW1lJyk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24ucHJvZ3JhbVZlcnNpb24gXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Byb2dyYW1WZXJzaW9uJyk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24uYmFja2dyb3VuZENvbG9yIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdiYWNrZ3JvdW5kQ29sb3InKTtcclxuXHJcblx0dmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnKVswXTtcclxuXHR2YXIgbGlzdE9mU3R5bGVzWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZTdHlsZXMnKVswXTtcclxuXHRpZiAobGlzdE9mQ29sb3JEZWZpbml0aW9uc1hNTCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5mcm9tWE1MKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwpO1xyXG5cdH1cclxuXHRpZiAobGlzdE9mU3R5bGVzWE1MICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZlN0eWxlcyA9IG5zLkxpc3RPZlN0eWxlcy5mcm9tWE1MKGxpc3RPZlN0eWxlc1hNTCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFJFTkRFUklORk9STUFUSU9OIC0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbnM7IiwidmFyIHJlbmRlckV4dCA9IHJlcXVpcmUoJy4vbGlic2Jnbi1yZW5kZXInKTtcclxuLy92YXIgYW5ub3RFeHQgPSByZXF1aXJlKCcuL2xpYnNiZ24tYW5ub3RhdGlvbnMnKTtcclxudmFyIGNoZWNrUGFyYW1zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5jaGVja1BhcmFtcztcclxudmFyIHhtbGRvbSA9IHJlcXVpcmUoJ3htbGRvbScpO1xyXG5cclxudmFyIG5zID0ge307XHJcblxyXG5ucy54bWxucyA9IFwiaHR0cDovL3NiZ24ub3JnL2xpYnNiZ24vMC4zXCI7XHJcblxyXG4vLyAtLS0tLS0tIFNCR05CYXNlIC0tLS0tLS1cclxuLypcclxuXHRTZXZlcmFsIHNiZ24gZWxlbWVudHMgaW5oZXJpdCBmcm9tIHRoaXMuIEFsbG93cyB0byBwdXQgZXh0ZW5zaW9ucyBldmVyeXdoZXJlLlxyXG4qL1xyXG5ucy5TQkdOQmFzZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2V4dGVuc2lvbiddKTtcclxuXHR0aGlzLmV4dGVuc2lvbiBcdD0gcGFyYW1zLmV4dGVuc2lvbjtcclxufTtcclxuXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5zZXRFeHRlbnNpb24gPSBmdW5jdGlvbiAoZXh0ZW5zaW9uKSB7XHJcblx0dGhpcy5leHRlbnNpb24gPSBleHRlbnNpb247XHJcbn07XHJcblxyXG4vLyB3cml0ZSB0aGUgWE1MIG9mIHRoaW5ncyB0aGF0IGFyZSBzcGVjaWZpYyB0byBTQkdOQmFzZSB0eXBlXHJcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5iYXNlVG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHhtbFN0cmluZyA9IFwiXCI7XHJcblx0Ly8gY2hpbGRyZW5cclxuXHRpZih0aGlzLmV4dGVuc2lvbiAhPSBudWxsKSB7XHJcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5leHRlbnNpb24udG9YTUwoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB4bWxTdHJpbmc7XHJcbn07XHJcblxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuYmFzZVRvWG1sT2JqID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmKHRoaXMuZXh0ZW5zaW9uICE9IG51bGwpIHtcclxuXHRcdHhtbE9iai5hcHBlbmRDaGlsZCh0aGlzLmV4dGVuc2lvbi5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcbn07XHJcblxyXG4vLyBwYXJzZSB0aGluZ3Mgc3BlY2lmaWMgdG8gU0JHTkJhc2UgdHlwZVxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuYmFzZUZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0Ly8gY2hpbGRyZW5cclxuXHR2YXIgZXh0ZW5zaW9uWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdleHRlbnNpb24nKVswXTtcclxuXHRpZiAoZXh0ZW5zaW9uWE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBleHRlbnNpb24gPSBucy5FeHRlbnNpb24uZnJvbVhNTChleHRlbnNpb25YTUwpO1xyXG5cdFx0dGhpcy5zZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcclxuXHR9XHJcbn07XHJcblxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGFsbG93ZWRDaGlsZHJlbiA9IFsnZXh0ZW5zaW9uJ10uY29uY2F0KHRoaXMuYWxsb3dlZENoaWxkcmVuKTtcclxuXHRmb3IodmFyIGk9MDsgaSA8IGFsbG93ZWRDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHByb3AgPSBhbGxvd2VkQ2hpbGRyZW5baV07XHJcblx0XHRpZih0eXBlb2YgdGhpc1twcm9wXSA9PSAnYXJyYXknICYmIHRoaXNbcHJvcF0ubGVuZ3RoID4gMClcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRpZih0aGlzW3Byb3BdKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vLyBmb3Igc2ltcGxlIGVsZW1lbnRzIHRoYXQgaGF2ZSBubyBjaGlsZHJlbiwgdXNlIHRoaXMgZnVuY3Rpb24gdG9cclxuLy8gZW5zdXJlIHRhZyBpcyBjbG9zZWQgY29ycmVjdGx5IHdoZW4gd3JpdGluZyBYTUwsIGlmIGV4dGVuc2lvblxyXG4vLyBvciBvdGhlciBTQkdOQmFzZSBzcGVjaWZpYyB0aGluZ3MgYXJlIHByZXNlbnQuXHJcbi8vIHNpbXBsZSBlbGVtZW50cyBtaWdodCBlbmQgd2l0aCAvPiBvciA8L25hbWU+IFxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuY2xvc2VUYWcgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHhtbFN0cmluZyA9IFwiXCI7XHJcblx0aWYodGhpcy5oYXNDaGlsZHJlbigpKSB7XHJcblx0XHR4bWxTdHJpbmcgKz0gXCI+XFxuXCI7XHJcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5iYXNlVG9YTUwoKTtcclxuXHRcdHhtbFN0cmluZyArPSBcIjwvXCIrdGhpcy50YWdOYW1lK1wiPlxcblwiO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHhtbFN0cmluZyArPSBcIiAvPlxcblwiO1xyXG5cdH1cclxuXHRyZXR1cm4geG1sU3RyaW5nO1xyXG59XHJcbi8vIC0tLS0tLS0gRU5EIFNCR05CYXNlIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gU0JHTiAtLS0tLS0tXHJcbm5zLlNiZ24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneG1sbnMnLCAnbWFwJ10pO1xyXG5cdHRoaXMueG1sbnMgXHQ9IHBhcmFtcy54bWxucztcclxuXHR0aGlzLm1hcCBcdD0gcGFyYW1zLm1hcDtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbJ21hcCddO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdzYmduJztcclxufTtcclxuXHJcbm5zLlNiZ24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5TYmduLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLlNiZ247XHJcblxyXG5ucy5TYmduLnByb3RvdHlwZS5zZXRNYXAgPSBmdW5jdGlvbiAobWFwKSB7XHJcblx0dGhpcy5tYXAgPSBtYXA7XHJcbn07XHJcblxyXG5ucy5TYmduLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc2JnbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3NiZ24nKTtcclxuXHQvLyBhdHRyaWJ1dGVzXHJcblx0aWYodGhpcy54bWxucyAhPSBudWxsKSB7XHJcblx0XHRzYmduLnNldEF0dHJpYnV0ZSgneG1sbnMnLCB0aGlzLnhtbG5zKTtcclxuXHR9XHJcblx0aWYodGhpcy5sYW5ndWFnZSAhPSBudWxsKSB7XHJcblx0XHRzYmduLnNldEF0dHJpYnV0ZSgnbGFuZ3VhZ2UnLCB0aGlzLmxhbmd1YWdlKTtcclxuXHR9XHJcblx0Ly8gY2hpbGRyZW5cclxuXHR0aGlzLmJhc2VUb1htbE9iaihzYmduKTtcclxuXHRpZiAodGhpcy5tYXAgIT0gbnVsbCkge1xyXG5cdFx0c2Jnbi5hcHBlbmRDaGlsZCh0aGlzLm1hcC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIHNiZ247XHJcbn07XHJcblxyXG5ucy5TYmduLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLlNiZ24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3NiZ24nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHNiZ24sIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBzYmduID0gbmV3IG5zLlNiZ24oKTtcclxuXHRzYmduLnhtbG5zID0geG1sT2JqLmdldEF0dHJpYnV0ZSgneG1sbnMnKTtcclxuXHJcblx0Ly8gZ2V0IGNoaWxkcmVuXHJcblx0dmFyIG1hcFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWFwJylbMF07XHJcblx0aWYgKG1hcFhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgbWFwID0gbnMuTWFwLmZyb21YTUwobWFwWE1MKTtcclxuXHRcdHNiZ24uc2V0TWFwKG1hcCk7XHJcblx0fVxyXG5cdHNiZ24uYmFzZUZyb21YTUwoeG1sT2JqKTsgLy8gY2FsbCB0byBwYXJlbnQgY2xhc3NcclxuXHRyZXR1cm4gc2JnbjtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgU0JHTiAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIE1BUCAtLS0tLS0tXHJcbm5zLk1hcCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdsYW5ndWFnZScsICdnbHlwaHMnLCAnYXJjcyddKTtcclxuXHR0aGlzLmlkIFx0XHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLmxhbmd1YWdlIFx0PSBwYXJhbXMubGFuZ3VhZ2U7XHJcblx0dGhpcy5nbHlwaHMgXHQ9IHBhcmFtcy5nbHlwaHMgfHwgW107XHJcblx0dGhpcy5hcmNzIFx0XHQ9IHBhcmFtcy5hcmNzIHx8IFtdO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnZ2x5cGhzJywgJ2FyY3MnXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnbWFwJztcclxufTtcclxuXHJcbm5zLk1hcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLk1hcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5NYXA7XHJcblxyXG5ucy5NYXAucHJvdG90eXBlLmFkZEdseXBoID0gZnVuY3Rpb24gKGdseXBoKSB7XHJcblx0dGhpcy5nbHlwaHMucHVzaChnbHlwaCk7XHJcbn07XHJcblxyXG5ucy5NYXAucHJvdG90eXBlLmFkZEFyYyA9IGZ1bmN0aW9uIChhcmMpIHtcclxuXHR0aGlzLmFyY3MucHVzaChhcmMpO1xyXG59O1xyXG5cclxubnMuTWFwLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbWFwID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbWFwJyk7XHJcblx0Ly8gYXR0cmlidXRlc1xyXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0bWFwLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYodGhpcy5sYW5ndWFnZSAhPSBudWxsKSB7XHJcblx0XHRtYXAuc2V0QXR0cmlidXRlKCdsYW5ndWFnZScsIHRoaXMubGFuZ3VhZ2UpO1xyXG5cdH1cclxuXHQvLyBjaGlsZHJlblxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKG1hcCk7XHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmdseXBocy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bWFwLmFwcGVuZENoaWxkKHRoaXMuZ2x5cGhzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuYXJjcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bWFwLmFwcGVuZENoaWxkKHRoaXMuYXJjc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIG1hcDtcclxufTtcclxuXHJcbm5zLk1hcC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5NYXAuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ21hcCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbWFwLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgbWFwID0gbmV3IG5zLk1hcCgpO1xyXG5cdG1hcC5pZCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0bWFwLmxhbmd1YWdlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnbGFuZ3VhZ2UnKTtcclxuXHJcblx0Ly8gbmVlZCB0byBiZSBjYXJlZnVsIGhlcmUsIGFzIHRoZXJlIGNhbiBiZSBnbHlwaCBpbiBhcmNzXHJcblx0dmFyIGdseXBoc1hNTCA9IHhtbE9iai5xdWVyeVNlbGVjdG9yQWxsKCdtYXAgPiBnbHlwaCcpO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IGdseXBoc1hNTC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGdseXBoID0gbnMuR2x5cGguZnJvbVhNTChnbHlwaHNYTUxbaV0pO1xyXG5cdFx0bWFwLmFkZEdseXBoKGdseXBoKTtcclxuXHR9XHJcblx0dmFyIGFyY3NYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2FyYycpO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IGFyY3NYTUwubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBhcmMgPSBucy5BcmMuZnJvbVhNTChhcmNzWE1MW2ldKTtcclxuXHRcdG1hcC5hZGRBcmMoYXJjKTtcclxuXHR9XHJcblxyXG5cdG1hcC5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBtYXA7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIE1BUCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIEVYVEVOU0lPTlMgLS0tLS0tLVxyXG5ucy5FeHRlbnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gY29uc2lkZXIgZmlyc3Qgb3JkZXIgY2hpbGRyZW4sIGFkZCB0aGVtIHdpdGggdGhlaXIgdGFnbmFtZSBhcyBwcm9wZXJ0eSBvZiB0aGlzIG9iamVjdFxyXG5cdC8vIHN0b3JlIHhtbE9iamVjdCBpZiBubyBzdXBwb3J0ZWQgcGFyc2luZyAodW5yZWNvZ25pemVkIGV4dGVuc2lvbnMpXHJcblx0Ly8gZWxzZSBzdG9yZSBpbnN0YW5jZSBvZiB0aGUgZXh0ZW5zaW9uXHJcblx0dGhpcy5saXN0ID0ge307XHJcblx0dGhpcy51bnN1cHBvcnRlZExpc3QgPSB7fTtcclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xyXG5cdGlmIChleHRlbnNpb24gaW5zdGFuY2VvZiByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24pIHtcclxuXHRcdHRoaXMubGlzdFsncmVuZGVySW5mb3JtYXRpb24nXSA9IGV4dGVuc2lvbjtcclxuXHR9XHJcblx0ZWxzZSBpZiAoZXh0ZW5zaW9uLm5vZGVUeXBlID09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XHJcblx0XHQvLyBjYXNlIHdoZXJlIHJlbmRlckluZm9ybWF0aW9uIGlzIHBhc3NlZCB1bnBhcnNlZFxyXG5cdFx0aWYgKGV4dGVuc2lvbi50YWdOYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcclxuXHRcdFx0dmFyIHJlbmRlckluZm9ybWF0aW9uID0gcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uLmZyb21YTUwoZXh0ZW5zaW9uKTtcclxuXHRcdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gcmVuZGVySW5mb3JtYXRpb247XHJcblx0XHR9XHJcblx0XHR0aGlzLnVuc3VwcG9ydGVkTGlzdFtleHRlbnNpb24udGFnTmFtZV0gPSBleHRlbnNpb247XHJcblx0fVxyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uTmFtZSkge1xyXG5cdHJldHVybiB0aGlzLmxpc3QuaGFzT3duUHJvcGVydHkoZXh0ZW5zaW9uTmFtZSk7XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XHJcblx0aWYgKHRoaXMuaGFzKGV4dGVuc2lvbk5hbWUpKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0W2V4dGVuc2lvbk5hbWVdO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGV4dGVuc2lvbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2V4dGVuc2lvbicpO1xyXG5cdGZvciAodmFyIGV4dEluc3RhbmNlIGluIHRoaXMubGlzdCkge1xyXG5cdFx0aWYgKGV4dEluc3RhbmNlID09IFwicmVuZGVySW5mb3JtYXRpb25cIikge1xyXG5cdFx0XHRleHRlbnNpb24uYXBwZW5kQ2hpbGQodGhpcy5nZXQoZXh0SW5zdGFuY2UpLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGV4dGVuc2lvbi5hcHBlbmRDaGlsZCh0aGlzLmdldChleHRJbnN0YW5jZSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZXh0ZW5zaW9uJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBleHRlbnNpb24sIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBleHRlbnNpb24gPSBuZXcgbnMuRXh0ZW5zaW9uKCk7XHJcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkcmVuO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgZXh0WG1sT2JqID0gY2hpbGRyZW5baV07XHJcblx0XHR2YXIgZXh0TmFtZSA9IGV4dFhtbE9iai50YWdOYW1lO1xyXG5cdFx0Ly9leHRlbnNpb24uYWRkKGV4dEluc3RhbmNlKTtcclxuXHRcdGlmIChleHROYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcclxuXHRcdFx0dmFyIHJlbmRlckluZm9ybWF0aW9uID0gcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uLmZyb21YTUwoZXh0WG1sT2JqKTtcclxuXHRcdFx0ZXh0ZW5zaW9uLmFkZChyZW5kZXJJbmZvcm1hdGlvbik7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChleHROYW1lID09ICdhbm5vdGF0aW9ucycpIHtcclxuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopOyAvLyB0byBiZSBwYXJzZWQgY29ycmVjdGx5XHJcblx0XHR9XHJcblx0XHRlbHNlIHsgLy8gdW5zdXBwb3J0ZWQgZXh0ZW5zaW9uLCB3ZSBzdGlsbCBzdG9yZSB0aGUgZGF0YSBhcyBpc1xyXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBleHRlbnNpb247XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIEVYVEVOU0lPTlMgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBHTFlQSCAtLS0tLS0tXHJcbm5zLkdseXBoID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ2NsYXNzXycsICdjb21wYXJ0bWVudFJlZicsICdsYWJlbCcsICdiYm94JywgJ2dseXBoTWVtYmVycycsICdwb3J0cycsICdzdGF0ZScsICdjbG9uZSddKTtcclxuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMuY2xhc3NfIFx0XHQ9IHBhcmFtcy5jbGFzc187XHJcblx0dGhpcy5jb21wYXJ0bWVudFJlZiA9IHBhcmFtcy5jb21wYXJ0bWVudFJlZjtcclxuXHJcblx0Ly8gY2hpbGRyZW5cclxuXHR0aGlzLmxhYmVsIFx0XHRcdD0gcGFyYW1zLmxhYmVsO1xyXG5cdHRoaXMuc3RhdGUgXHRcdFx0PSBwYXJhbXMuc3RhdGU7XHJcblx0dGhpcy5iYm94IFx0XHRcdD0gcGFyYW1zLmJib3g7XHJcblx0dGhpcy5jbG9uZSBcdFx0XHQ9IHBhcmFtcy5jbG9uZTtcclxuXHR0aGlzLmdseXBoTWVtYmVycyBcdD0gcGFyYW1zLmdseXBoTWVtYmVycyB8fCBbXTsgLy8gY2FzZSBvZiBjb21wbGV4LCBjYW4gaGF2ZSBhcmJpdHJhcnkgbGlzdCBvZiBuZXN0ZWQgZ2x5cGhzXHJcblx0dGhpcy5wb3J0cyBcdFx0XHQ9IHBhcmFtcy5wb3J0cyB8fCBbXTtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbJ2xhYmVsJywgJ3N0YXRlJywgJ2Jib3gnLCAnY2xvbmUnLCAnZ2x5cGhNZW1iZXJzJywgJ3BvcnRzJ107XHJcblx0dGhpcy50YWdOYW1lID0gJ2dseXBoJztcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuR2x5cGgucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuR2x5cGg7XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuXHR0aGlzLmxhYmVsID0gbGFiZWw7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuXHR0aGlzLnN0YXRlID0gc3RhdGU7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0QmJveCA9IGZ1bmN0aW9uIChiYm94KSB7XHJcblx0dGhpcy5iYm94ID0gYmJveDtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5zZXRDbG9uZSA9IGZ1bmN0aW9uIChjbG9uZSkge1xyXG5cdHRoaXMuY2xvbmUgPSBjbG9uZTtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5hZGRHbHlwaE1lbWJlciA9IGZ1bmN0aW9uIChnbHlwaE1lbWJlcikge1xyXG5cdHRoaXMuZ2x5cGhNZW1iZXJzLnB1c2goZ2x5cGhNZW1iZXIpO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLmFkZFBvcnQgPSBmdW5jdGlvbiAocG9ydCkge1xyXG5cdHRoaXMucG9ydHMucHVzaChwb3J0KTtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZ2x5cGggPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdnbHlwaCcpO1xyXG5cdC8vIGF0dHJpYnV0ZXNcclxuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdGdseXBoLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYodGhpcy5jbGFzc18gIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuY2xhc3NfKTtcclxuXHR9XHJcblx0aWYodGhpcy5jb21wYXJ0bWVudFJlZiAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5zZXRBdHRyaWJ1dGUoJ2NvbXBhcnRtZW50UmVmJywgdGhpcy5jb21wYXJ0bWVudFJlZik7XHJcblx0fVxyXG5cdC8vIGNoaWxkcmVuXHJcblx0aWYodGhpcy5sYWJlbCAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZih0aGlzLnN0YXRlICE9IG51bGwpIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMuc3RhdGUuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmKHRoaXMuYmJveCAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmJib3guYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGlmKHRoaXMuY2xvbmUgIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5jbG9uZS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmdseXBoTWVtYmVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5nbHlwaE1lbWJlcnNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5wb3J0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5wb3J0c1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0dGhpcy5iYXNlVG9YbWxPYmooZ2x5cGgpO1xyXG5cdHJldHVybiBnbHlwaDtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkdseXBoLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdnbHlwaCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZ2x5cGgsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBnbHlwaCA9IG5ldyBucy5HbHlwaCgpO1xyXG5cdGdseXBoLmlkIFx0XHRcdFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdGdseXBoLmNsYXNzXyBcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcblx0Z2x5cGguY29tcGFydG1lbnRSZWYgXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NvbXBhcnRtZW50UmVmJyk7XHJcblxyXG5cdHZhciBsYWJlbFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcclxuXHRpZiAobGFiZWxYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIGxhYmVsID0gbnMuTGFiZWwuZnJvbVhNTChsYWJlbFhNTCk7XHJcblx0XHRnbHlwaC5zZXRMYWJlbChsYWJlbCk7XHJcblx0fVxyXG5cdHZhciBzdGF0ZVhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3RhdGUnKVswXTtcclxuXHRpZiAoc3RhdGVYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIHN0YXRlID0gbnMuU3RhdGVUeXBlLmZyb21YTUwoc3RhdGVYTUwpO1xyXG5cdFx0Z2x5cGguc2V0U3RhdGUoc3RhdGUpO1xyXG5cdH1cclxuXHR2YXIgYmJveFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmJveCcpWzBdO1xyXG5cdGlmIChiYm94WE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBiYm94ID0gbnMuQmJveC5mcm9tWE1MKGJib3hYTUwpO1xyXG5cdFx0Z2x5cGguc2V0QmJveChiYm94KTtcclxuXHR9XHJcblx0dmFyIGNsb25lWE1sID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjbG9uZScpWzBdO1xyXG5cdGlmIChjbG9uZVhNbCAhPSBudWxsKSB7XHJcblx0XHR2YXIgY2xvbmUgPSBucy5DbG9uZVR5cGUuZnJvbVhNTChjbG9uZVhNbCk7XHJcblx0XHRnbHlwaC5zZXRDbG9uZShjbG9uZSk7XHJcblx0fVxyXG5cdC8vIG5lZWQgc3BlY2lhbCBjYXJlIGJlY2F1c2Ugb2YgcmVjdXJzaW9uIG9mIG5lc3RlZCBnbHlwaCBub2Rlc1xyXG5cdC8vIHRha2Ugb25seSBmaXJzdCBsZXZlbCBnbHlwaHNcclxuXHR2YXIgY2hpbGRyZW4gPSB4bWxPYmouY2hpbGRyZW47XHJcblx0Zm9yICh2YXIgaj0wOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHsgLy8gbG9vcCB0aHJvdWdoIGFsbCBmaXJzdCBsZXZlbCBjaGlsZHJlblxyXG5cdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5bal07XHJcblx0XHRpZiAoY2hpbGQudGFnTmFtZSA9PSBcImdseXBoXCIpIHsgLy8gaGVyZSB3ZSBvbmx5IHdhbnQgdGhlIGdseWggY2hpbGRyZW5cclxuXHRcdFx0dmFyIGdseXBoTWVtYmVyID0gbnMuR2x5cGguZnJvbVhNTChjaGlsZCk7IC8vIHJlY3Vyc2l2ZSBjYWxsIG9uIG5lc3RlZCBnbHlwaFxyXG5cdFx0XHRnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlcik7XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBwb3J0c1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgncG9ydCcpO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IHBvcnRzWE1MLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcG9ydCA9IG5zLlBvcnQuZnJvbVhNTChwb3J0c1hNTFtpXSk7XHJcblx0XHRnbHlwaC5hZGRQb3J0KHBvcnQpO1xyXG5cdH1cclxuXHRnbHlwaC5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBnbHlwaDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgR0xZUEggLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBMQUJFTCAtLS0tLS0tXHJcbm5zLkxhYmVsID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3RleHQnXSk7XHJcblx0dGhpcy50ZXh0ID0gcGFyYW1zLnRleHQ7XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XHJcblx0dGhpcy50YWdOYW1lID0gJ2xhYmVsJztcclxufTtcclxuXHJcbm5zLkxhYmVsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuTGFiZWwucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuTGFiZWw7XHJcblxyXG5ucy5MYWJlbC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGxhYmVsID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuXHRpZih0aGlzLnRleHQgIT0gbnVsbCkge1xyXG5cdFx0bGFiZWwuc2V0QXR0cmlidXRlKCd0ZXh0JywgdGhpcy50ZXh0KTtcclxuXHR9XHJcblx0dGhpcy5iYXNlVG9YbWxPYmoobGFiZWwpO1xyXG5cdHJldHVybiBsYWJlbDtcclxufTtcclxuXHJcbm5zLkxhYmVsLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkxhYmVsLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdsYWJlbCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGFiZWwsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBsYWJlbCA9IG5ldyBucy5MYWJlbCgpO1xyXG5cdGxhYmVsLnRleHQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0ZXh0Jyk7XHJcblx0bGFiZWwuYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gbGFiZWw7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIExBQkVMIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gQkJPWCAtLS0tLS0tXHJcbm5zLkJib3ggPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5JywgJ3cnLCAnaCddKTtcclxuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcclxuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcclxuXHR0aGlzLncgPSBwYXJzZUZsb2F0KHBhcmFtcy53KTtcclxuXHR0aGlzLmggPSBwYXJzZUZsb2F0KHBhcmFtcy5oKTtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnYmJveCc7XHJcbn07XHJcblxyXG5ucy5CYm94LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuQmJveC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5CYm94O1xyXG5cclxubnMuQmJveC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGJib3ggPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdiYm94Jyk7XHJcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcclxuXHRcdGJib3guc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcclxuXHRcdGJib3guc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMudykpIHtcclxuXHRcdGJib3guc2V0QXR0cmlidXRlKCd3JywgdGhpcy53KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMuaCkpIHtcclxuXHRcdGJib3guc2V0QXR0cmlidXRlKCdoJywgdGhpcy5oKTtcclxuXHR9XHJcblx0dGhpcy5iYXNlVG9YbWxPYmooYmJveCk7XHJcblx0cmV0dXJuIGJib3g7XHJcbn1cclxuXHJcbm5zLkJib3gucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuQmJveC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnYmJveCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYmJveCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGJib3ggPSBuZXcgbnMuQmJveCgpO1xyXG5cdGJib3gueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcclxuXHRiYm94LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XHJcblx0YmJveC53ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd3JykpO1xyXG5cdGJib3guaCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgnaCcpKTtcclxuXHRiYm94LmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIGJib3g7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIEJCT1ggLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBTVEFURSAtLS0tLS0tXHJcbm5zLlN0YXRlVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3ZhbHVlJywgJ3ZhcmlhYmxlJ10pO1xyXG5cdHRoaXMudmFsdWUgPSBwYXJhbXMudmFsdWU7XHJcblx0dGhpcy52YXJpYWJsZSA9IHBhcmFtcy52YXJpYWJsZTtcclxufTtcclxuXHJcbm5zLlN0YXRlVHlwZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHN0YXRlID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3RhdGUnKTtcclxuXHRpZih0aGlzLnZhbHVlICE9IG51bGwpIHtcclxuXHRcdHN0YXRlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcclxuXHR9XHJcblx0aWYodGhpcy52YXJpYWJsZSAhPSBudWxsKSB7XHJcblx0XHRzdGF0ZS5zZXRBdHRyaWJ1dGUoJ3ZhcmlhYmxlJywgdGhpcy52YXJpYWJsZSk7XHJcblx0fVxyXG5cdHJldHVybiBzdGF0ZTtcclxufTtcclxuXHJcbm5zLlN0YXRlVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5TdGF0ZVR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3N0YXRlJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGF0ZSwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHN0YXRlID0gbmV3IG5zLlN0YXRlVHlwZSgpO1xyXG5cdHN0YXRlLnZhbHVlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuXHRzdGF0ZS52YXJpYWJsZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3ZhcmlhYmxlJyk7XHJcblx0cmV0dXJuIHN0YXRlO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBTVEFURSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIENMT05FIC0tLS0tLS1cclxubnMuQ2xvbmVUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnbGFiZWwnXSk7XHJcblx0dGhpcy5sYWJlbCA9IHBhcmFtcy5sYWJlbDtcclxufTtcclxuXHJcbm5zLkNsb25lVHlwZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGNsb25lID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnY2xvbmUnKTtcclxuXHRpZih0aGlzLmxhYmVsICE9IG51bGwpIHtcclxuXHRcdGNsb25lLnNldEF0dHJpYnV0ZSgnbGFiZWwnLCB0aGlzLmxhYmVsKTtcclxuXHR9XHJcblx0cmV0dXJuIGNsb25lO1xyXG59O1xyXG5cclxubnMuQ2xvbmVUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkNsb25lVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnY2xvbmUnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNsb25lLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgY2xvbmUgPSBuZXcgbnMuQ2xvbmVUeXBlKCk7XHJcblx0Y2xvbmUubGFiZWwgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xyXG5cdHJldHVybiBjbG9uZTtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgQ0xPTkUgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBQT1JUIC0tLS0tLS1cclxubnMuUG9ydCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICd4JywgJ3knXSk7XHJcblx0dGhpcy5pZCA9IHBhcmFtcy5pZDtcclxuXHR0aGlzLnggXHQ9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xyXG5cdHRoaXMueSBcdD0gcGFyc2VGbG9hdChwYXJhbXMueSk7XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XHJcblx0dGhpcy50YWdOYW1lID0gJ3BvcnQnO1xyXG59O1xyXG5cclxubnMuUG9ydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLlBvcnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuUG9ydDtcclxuXHJcbm5zLlBvcnQucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBwb3J0ID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgncG9ydCcpO1xyXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0cG9ydC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XHJcblx0XHRwb3J0LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XHJcblx0XHRwb3J0LnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XHJcblx0fVxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKHBvcnQpO1xyXG5cdHJldHVybiBwb3J0O1xyXG59O1xyXG5cclxubnMuUG9ydC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5Qb3J0LmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdwb3J0Jykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBwb3J0LCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgcG9ydCA9IG5ldyBucy5Qb3J0KCk7XHJcblx0cG9ydC54IFx0PSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XHJcblx0cG9ydC55IFx0PSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XHJcblx0cG9ydC5pZCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0cG9ydC5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBwb3J0O1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBQT1JUIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gQVJDIC0tLS0tLS1cclxubnMuQXJjID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2lkJywgJ2NsYXNzXycsICdzb3VyY2UnLCAndGFyZ2V0JywgJ3N0YXJ0JywgJ2VuZCcsICduZXh0cycsICdnbHlwaHMnXSk7XHJcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMuY2xhc3NfID0gcGFyYW1zLmNsYXNzXztcclxuXHR0aGlzLnNvdXJjZSA9IHBhcmFtcy5zb3VyY2U7XHJcblx0dGhpcy50YXJnZXQgPSBwYXJhbXMudGFyZ2V0O1xyXG5cclxuXHR0aGlzLnN0YXJ0IFx0PSBwYXJhbXMuc3RhcnQ7XHJcblx0dGhpcy5lbmQgXHQ9IHBhcmFtcy5lbmQ7XHJcblx0dGhpcy5uZXh0cyBcdD0gcGFyYW1zLm5leHRzIHx8IFtdO1xyXG5cdHRoaXMuZ2x5cGhzID0gcGFyYW1zLmdseXBocyB8fMKgW107XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gWydzdGFydCcsICduZXh0cycsICdlbmQnLCAnZ2x5cGhzJ107XHJcblx0dGhpcy50YWdOYW1lID0gJ2FyYyc7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5BcmMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQXJjO1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS5zZXRTdGFydCA9IGZ1bmN0aW9uIChzdGFydCkge1xyXG5cdHRoaXMuc3RhcnQgPSBzdGFydDtcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUuc2V0RW5kID0gZnVuY3Rpb24gKGVuZCkge1xyXG5cdHRoaXMuZW5kID0gZW5kO1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS5hZGROZXh0ID0gZnVuY3Rpb24gKG5leHQpIHtcclxuXHR0aGlzLm5leHRzLnB1c2gobmV4dCk7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLmFkZEdseXBoID0gZnVuY3Rpb24gKGdseXBoKSB7XHJcblx0dGhpcy5nbHlwaHMucHVzaChnbHlwaCk7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBhcmMgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdhcmMnKTtcclxuXHQvLyBhdHRyaWJ1dGVzXHJcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRhcmMuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XHJcblx0XHRhcmMuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuY2xhc3NfKTtcclxuXHR9XHJcblx0aWYodGhpcy5zb3VyY2UgIT0gbnVsbCkge1xyXG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgnc291cmNlJywgdGhpcy5zb3VyY2UpO1xyXG5cdH1cclxuXHRpZih0aGlzLnRhcmdldCAhPSBudWxsKSB7XHJcblx0XHRhcmMuc2V0QXR0cmlidXRlKCd0YXJnZXQnLCB0aGlzLnRhcmdldCk7XHJcblx0fVxyXG5cdC8vIGNoaWxkcmVuXHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmdseXBocy5sZW5ndGg7IGkrKykge1xyXG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMuZ2x5cGhzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZih0aGlzLnN0YXJ0ICE9IG51bGwpIHtcclxuXHRcdGFyYy5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0LmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMubmV4dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGFyYy5hcHBlbmRDaGlsZCh0aGlzLm5leHRzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZih0aGlzLmVuZCAhPSBudWxsKSB7XHJcblx0XHRhcmMuYXBwZW5kQ2hpbGQodGhpcy5lbmQuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKGFyYyk7XHJcblx0cmV0dXJuIGFyYztcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5BcmMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2FyYycpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYXJjLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgYXJjID0gbmV3IG5zLkFyYygpO1xyXG5cdGFyYy5pZCBcdFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdGFyYy5jbGFzc18gXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcblx0YXJjLnNvdXJjZSBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnc291cmNlJyk7XHJcblx0YXJjLnRhcmdldCBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XHJcblxyXG5cdHZhciBzdGFydFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3RhcnQnKVswXTtcclxuXHRpZiAoc3RhcnRYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIHN0YXJ0ID0gbnMuU3RhcnRUeXBlLmZyb21YTUwoc3RhcnRYTUwpO1xyXG5cdFx0YXJjLnNldFN0YXJ0KHN0YXJ0KTtcclxuXHR9XHJcblx0dmFyIG5leHRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKTtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBuZXh0WE1MLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgbmV4dCA9IG5zLk5leHRUeXBlLmZyb21YTUwobmV4dFhNTFtpXSk7XHJcblx0XHRhcmMuYWRkTmV4dChuZXh0KTtcclxuXHR9XHJcblx0dmFyIGVuZFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW5kJylbMF07XHJcblx0aWYgKGVuZFhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgZW5kID0gbnMuRW5kVHlwZS5mcm9tWE1MKGVuZFhNTCk7XHJcblx0XHRhcmMuc2V0RW5kKGVuZCk7XHJcblx0fVxyXG5cdHZhciBnbHlwaHNYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2dseXBoJyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhzWE1MLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgZ2x5cGggPSBucy5HbHlwaC5mcm9tWE1MKGdseXBoc1hNTFtpXSk7XHJcblx0XHRhcmMuYWRkR2x5cGgoZ2x5cGgpO1xyXG5cdH1cclxuXHJcblx0YXJjLmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIGFyYztcclxufTtcclxuXHJcbi8vIC0tLS0tLS0gRU5EIEFSQyAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFNUQVJUVFlQRSAtLS0tLS0tXHJcbm5zLlN0YXJ0VHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcclxuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcclxuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcclxufTtcclxuXHJcbm5zLlN0YXJ0VHlwZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHN0YXJ0ID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3RhcnQnKTtcclxuXHRpZighaXNOYU4odGhpcy54KSkge1xyXG5cdFx0c3RhcnQuc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcclxuXHRcdHN0YXJ0LnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XHJcblx0fVxyXG5cdHJldHVybiBzdGFydDtcclxufTtcclxuXHJcbm5zLlN0YXJ0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5TdGFydFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ3N0YXJ0Jykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGFydCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHN0YXJ0ID0gbmV3IG5zLlN0YXJ0VHlwZSgpO1xyXG5cdHN0YXJ0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XHJcblx0c3RhcnQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcclxuXHRyZXR1cm4gc3RhcnQ7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFNUQVJUVFlQRSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIEVORFRZUEUgLS0tLS0tLVxyXG5ucy5FbmRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xyXG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xyXG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xyXG59O1xyXG5cclxubnMuRW5kVHlwZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGVuZCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2VuZCcpO1xyXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XHJcblx0XHRlbmQuc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcclxuXHRcdGVuZC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xyXG5cdH1cclxuXHRyZXR1cm4gZW5kO1xyXG59O1xyXG5cclxubnMuRW5kVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5FbmRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdlbmQnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGVuZCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGVuZCA9IG5ldyBucy5FbmRUeXBlKCk7XHJcblx0ZW5kLnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XHJcblx0ZW5kLnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XHJcblx0cmV0dXJuIGVuZDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgRU5EVFlQRSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIE5FWFRUWVBFIC0tLS0tLS1cclxubnMuTmV4dFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XHJcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XHJcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XHJcbn07XHJcblxyXG5ucy5OZXh0VHlwZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIG5leHQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCduZXh0Jyk7XHJcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcclxuXHRcdG5leHQuc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcclxuXHR9XHJcblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcclxuXHRcdG5leHQuc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcclxuXHR9XHJcblx0cmV0dXJuIG5leHQ7XHJcbn07XHJcblxyXG5ucy5OZXh0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5OZXh0VHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbmV4dCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbmV4dCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIG5leHQgPSBuZXcgbnMuTmV4dFR5cGUoKTtcclxuXHRuZXh0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XHJcblx0bmV4dC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xyXG5cdHJldHVybiBuZXh0O1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBORVhUVFlQRSAtLS0tLS0tXHJcblxyXG5ucy5yZW5kZXJFeHRlbnNpb24gPSByZW5kZXJFeHQ7XHJcbi8vbnMuYW5ub3RhdGlvbnNFeHRlbnNpb24gPSBhbm5vdEV4dDtcclxubW9kdWxlLmV4cG9ydHMgPSBuczsiLCJ2YXIgbnMgPSB7fTtcclxuXHJcbi8qXHJcblx0Z3VhcmFudGVlcyB0byByZXR1cm4gYW4gb2JqZWN0IHdpdGggZ2l2ZW4gYXJncyBiZWluZyBzZXQgdG8gbnVsbCBpZiBub3QgcHJlc2VudCwgb3RoZXIgYXJncyByZXR1cm5lZCBhcyBpc1xyXG4qL1xyXG5ucy5jaGVja1BhcmFtcyA9IGZ1bmN0aW9uIChwYXJhbXMsIG5hbWVzKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT0gXCJ1bmRlZmluZWRcIiB8fCBwYXJhbXMgPT0gbnVsbCkge1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGlmICh0eXBlb2YgcGFyYW1zICE9ICdvYmplY3QnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW1zLiBPYmplY3Qgd2l0aCBuYW1lZCBwYXJhbWV0ZXJzIG11c3QgYmUgcGFzc2VkLlwiKTtcclxuXHR9XHJcblx0Zm9yKHZhciBpPTA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGFyZ05hbWUgPSBuYW1lc1tpXTtcclxuXHRcdGlmICh0eXBlb2YgcGFyYW1zW2FyZ05hbWVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHBhcmFtc1thcmdOYW1lXSA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBwYXJhbXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbnM7IiwiLyoqXG4qIHByZXR0eS1kYXRhIC0gbm9kZWpzIHBsdWdpbiB0byBwcmV0dHktcHJpbnQgb3IgbWluaWZ5IGRhdGEgaW4gWE1MLCBKU09OIGFuZCBDU1MgZm9ybWF0cy5cbiogIFxuKiBWZXJzaW9uIC0gMC40MC4wXG4qIENvcHlyaWdodCAoYykgMjAxMiBWYWRpbSBLaXJ5dWtoaW5cbiogdmtpcnl1a2hpbiBAIGdtYWlsLmNvbVxuKiBodHRwOi8vd3d3LmVzbGluc3RydWN0b3IubmV0L3ByZXR0eS1kYXRhL1xuKiBcbiogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXM6XG4qICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiogICBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLmh0bWxcbipcbipcdHBkLnhtbChkYXRhICkgLSBwcmV0dHkgcHJpbnQgWE1MO1xuKlx0cGQuanNvbihkYXRhKSAtIHByZXR0eSBwcmludCBKU09OO1xuKlx0cGQuY3NzKGRhdGEgKSAtIHByZXR0eSBwcmludCBDU1M7XG4qXHRwZC5zcWwoZGF0YSkgIC0gcHJldHR5IHByaW50IFNRTDtcbipcbipcdHBkLnhtbG1pbihkYXRhIFssIHByZXNlcnZlQ29tbWVudHNdICkgLSBtaW5pZnkgWE1MOyBcbipcdHBkLmpzb25taW4oZGF0YSkgICAgICAgICAgICAgICAgICAgICAgLSBtaW5pZnkgSlNPTjsgXG4qXHRwZC5jc3NtaW4oZGF0YSBbLCBwcmVzZXJ2ZUNvbW1lbnRzXSApIC0gbWluaWZ5IENTUzsgXG4qXHRwZC5zcWxtaW4oZGF0YSkgICAgICAgICAgICAgICAgICAgICAgIC0gbWluaWZ5IFNRTDsgXG4qXG4qIFBBUkFNRVRFUlM6XG4qXG4qXHRAZGF0YSAgXHRcdFx0LSBTdHJpbmc7IFhNTCwgSlNPTiwgQ1NTIG9yIFNRTCB0ZXh0IHRvIGJlYXV0aWZ5O1xuKiBcdEBwcmVzZXJ2ZUNvbW1lbnRzXHQtIEJvb2wgKG9wdGlvbmFsLCB1c2VkIGluIG1pbnhtbCBhbmQgbWluY3NzIG9ubHkpOyBcbipcdFx0XHRcdCAgU2V0IHRoaXMgZmxhZyB0byB0cnVlIHRvIHByZXZlbnQgcmVtb3ZpbmcgY29tbWVudHMgZnJvbSBAdGV4dDsgXG4qXHRAUmV0dXJuIFx0XHQtIFN0cmluZztcbipcdFxuKiBVU0FHRTpcbipcdFxuKlx0dmFyIHBkICA9IHJlcXVpcmUoJ3ByZXR0eS1kYXRhJykucGQ7XG4qXG4qXHR2YXIgeG1sX3BwICAgPSBwZC54bWwoeG1sX3RleHQpO1xuKlx0dmFyIHhtbF9taW4gID0gcGQueG1sbWluKHhtbF90ZXh0IFssdHJ1ZV0pO1xuKlx0dmFyIGpzb25fcHAgID0gcGQuanNvbihqc29uX3RleHQpO1xuKlx0dmFyIGpzb25fbWluID0gcGQuanNvbm1pbihqc29uX3RleHQpO1xuKlx0dmFyIGNzc19wcCAgID0gcGQuY3NzKGNzc190ZXh0KTtcbipcdHZhciBjc3NfbWluICA9IHBkLmNzc21pbihjc3NfdGV4dCBbLCB0cnVlXSk7XG4qXHR2YXIgc3FsX3BwICAgPSBwZC5zcWwoc3FsX3RleHQpO1xuKlx0dmFyIHNxbF9taW4gID0gcGQuc3FsbWluKHNxbF90ZXh0KTtcbipcbiogVEVTVDpcbipcdGNvbXAtbmFtZTpwcmV0dHktZGF0YSQgbm9kZSAuL3Rlc3QvdGVzdF94bWxcbipcdGNvbXAtbmFtZTpwcmV0dHktZGF0YSQgbm9kZSAuL3Rlc3QvdGVzdF9qc29uXG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3RfY3NzXG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3Rfc3FsXG4qL1xuXG5cbmZ1bmN0aW9uIHBwKCkge1xuXHR0aGlzLnNoaWZ0ID0gWydcXG4nXTsgLy8gYXJyYXkgb2Ygc2hpZnRzXG5cdHRoaXMuc3RlcCA9ICcgICcsIC8vIDIgc3BhY2VzXG5cdFx0bWF4ZGVlcCA9IDEwMCwgLy8gbmVzdGluZyBsZXZlbFxuXHRcdGl4ID0gMDtcblxuXHQvLyBpbml0aWFsaXplIGFycmF5IHdpdGggc2hpZnRzIC8vXG5cdGZvcihpeD0wO2l4PG1heGRlZXA7aXgrKyl7XG5cdFx0dGhpcy5zaGlmdC5wdXNoKHRoaXMuc2hpZnRbaXhdK3RoaXMuc3RlcCk7IFxuXHR9XG5cbn07XHRcblx0XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBYTUwgc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBwLnByb3RvdHlwZS54bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG5cblx0dmFyIGFyID0gdGV4dC5yZXBsYWNlKC8+XFxzezAsfTwvZyxcIj48XCIpXG5cdFx0XHRcdCAucmVwbGFjZSgvPC9nLFwifjo6fjxcIilcblx0XHRcdFx0IC5yZXBsYWNlKC94bWxuc1xcOi9nLFwifjo6fnhtbG5zOlwiKVxuXHRcdFx0XHQgLnJlcGxhY2UoL3htbG5zXFw9L2csXCJ+Ojp+eG1sbnM9XCIpXG5cdFx0XHRcdCAuc3BsaXQoJ346On4nKSxcblx0XHRsZW4gPSBhci5sZW5ndGgsXG5cdFx0aW5Db21tZW50ID0gZmFsc2UsXG5cdFx0ZGVlcCA9IDAsXG5cdFx0c3RyID0gJycsXG5cdFx0aXggPSAwO1xuXG5cdFx0Zm9yKGl4PTA7aXg8bGVuO2l4KyspIHtcblx0XHRcdC8vIHN0YXJ0IGNvbW1lbnQgb3IgPCFbQ0RBVEFbLi4uXV0+IG9yIDwhRE9DVFlQRSAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvPCEvKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHRcdGluQ29tbWVudCA9IHRydWU7IFxuXHRcdFx0XHQvLyBlbmQgY29tbWVudCAgb3IgPCFbQ0RBVEFbLi4uXV0+IC8vXG5cdFx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLy0tPi8pID4gLTEgfHwgYXJbaXhdLnNlYXJjaCgvXFxdPi8pID4gLTEgfHwgYXJbaXhdLnNlYXJjaCgvIURPQ1RZUEUvKSA+IC0xICkgeyBcblx0XHRcdFx0XHRpbkNvbW1lbnQgPSBmYWxzZTsgXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIGVuZCBjb21tZW50ICBvciA8IVtDREFUQVsuLi5dXT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLy0tPi8pID4gLTEgfHwgYXJbaXhdLnNlYXJjaCgvXFxdPi8pID4gLTEpIHsgXG5cdFx0XHRcdHN0ciArPSBhcltpeF07XG5cdFx0XHRcdGluQ29tbWVudCA9IGZhbHNlOyBcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDxlbG0+PC9lbG0+IC8vXG5cdFx0XHRpZiggL148XFx3Ly5leGVjKGFyW2l4LTFdKSAmJiAvXjxcXC9cXHcvLmV4ZWMoYXJbaXhdKSAmJlxuXHRcdFx0XHQvXjxbXFx3OlxcLVxcLlxcLF0rLy5leGVjKGFyW2l4LTFdKSA9PSAvXjxcXC9bXFx3OlxcLVxcLlxcLF0rLy5leGVjKGFyW2l4XSlbMF0ucmVwbGFjZSgnLycsJycpKSB7IFxuXHRcdFx0XHRzdHIgKz0gYXJbaXhdO1xuXHRcdFx0XHRpZighaW5Db21tZW50KSBkZWVwLS07XG5cdFx0XHR9IGVsc2Vcblx0XHRcdCAvLyA8ZWxtPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvPFxcdy8pID4gLTEgJiYgYXJbaXhdLnNlYXJjaCgvPFxcLy8pID09IC0xICYmIGFyW2l4XS5zZWFyY2goL1xcLz4vKSA9PSAtMSApIHtcblx0XHRcdFx0c3RyID0gIWluQ29tbWVudCA/IHN0ciArPSB0aGlzLnNoaWZ0W2RlZXArK10rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdCAvLyA8ZWxtPi4uLjwvZWxtPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvPFxcdy8pID4gLTEgJiYgYXJbaXhdLnNlYXJjaCgvPFxcLy8pID4gLTEpIHtcblx0XHRcdFx0c3RyID0gIWluQ29tbWVudCA/IHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XSA6IHN0ciArPSBhcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyA8L2VsbT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXC8vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgPSAhaW5Db21tZW50ID8gc3RyICs9IHRoaXMuc2hpZnRbLS1kZWVwXSthcltpeF0gOiBzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gPGVsbS8+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC9cXC8+LykgPiAtMSApIHsgXG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF0gOiBzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gPD8geG1sIC4uLiA/PiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvPFxcPy8pID4gLTEpIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIHhtbG5zIC8vXG5cdFx0XHRpZiggYXJbaXhdLnNlYXJjaCgveG1sbnNcXDovKSA+IC0xICB8fCBhcltpeF0uc2VhcmNoKC94bWxuc1xcPS8pID4gLTEpIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcblx0XHRcdH0gXG5cdFx0XHRcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0cmV0dXJuICAoc3RyWzBdID09ICdcXG4nKSA/IHN0ci5zbGljZSgxKSA6IHN0cjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gSlNPTiBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucHAucHJvdG90eXBlLmpzb24gPSBmdW5jdGlvbih0ZXh0KSB7XG5cblx0aWYgKCB0eXBlb2YgdGV4dCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh0ZXh0KSwgbnVsbCwgdGhpcy5zdGVwKTtcblx0fVxuXHRpZiAoIHR5cGVvZiB0ZXh0ID09PSBcIm9iamVjdFwiICkge1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0ZXh0LCBudWxsLCB0aGlzLnN0ZXApO1xuXHR9XG5cdHJldHVybiBudWxsO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDU1Mgc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBwLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbih0ZXh0KSB7XG5cblx0dmFyIGFyID0gdGV4dC5yZXBsYWNlKC9cXHN7MSx9L2csJyAnKVxuXHRcdFx0XHQucmVwbGFjZSgvXFx7L2csXCJ7fjo6flwiKVxuXHRcdFx0XHQucmVwbGFjZSgvXFx9L2csXCJ+Ojp+fX46On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL1xcOy9nLFwiO346On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL1xcL1xcKi9nLFwifjo6fi8qXCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCpcXC8vZyxcIiovfjo6flwiKVxuXHRcdFx0XHQucmVwbGFjZSgvfjo6flxcc3swLH1+Ojp+L2csXCJ+Ojp+XCIpXG5cdFx0XHRcdC5zcGxpdCgnfjo6ficpLFxuXHRcdGxlbiA9IGFyLmxlbmd0aCxcblx0XHRkZWVwID0gMCxcblx0XHRzdHIgPSAnJyxcblx0XHRpeCA9IDA7XG5cdFx0XG5cdFx0Zm9yKGl4PTA7aXg8bGVuO2l4KyspIHtcblxuXHRcdFx0aWYoIC9cXHsvLmV4ZWMoYXJbaXhdKSkgIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXArK10rYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0aWYoIC9cXH0vLmV4ZWMoYXJbaXhdKSkgIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0Wy0tZGVlcF0rYXJbaXhdO1xuXHRcdFx0fSBlbHNlXG5cdFx0XHRpZiggL1xcKlxcXFwvLmV4ZWMoYXJbaXhdKSkgIHsgXG5cdFx0XHRcdHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvXlxcbnsxLH0vLCcnKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1FMIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpc1N1YnF1ZXJ5KHN0ciwgcGFyZW50aGVzaXNMZXZlbCkge1xuICByZXR1cm4gIHBhcmVudGhlc2lzTGV2ZWwgLSAoc3RyLnJlcGxhY2UoL1xcKC9nLCcnKS5sZW5ndGggLSBzdHIucmVwbGFjZSgvXFwpL2csJycpLmxlbmd0aCApXG59XG5cbmZ1bmN0aW9uIHNwbGl0X3NxbChzdHIsIHRhYikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHN7MSx9L2csXCIgXCIpXG5cbiAgICAgICAgLnJlcGxhY2UoLyBBTkQgL2lnLFwifjo6flwiK3RhYit0YWIrXCJBTkQgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQkVUV0VFTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiQkVUV0VFTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBDQVNFIC9pZyxcIn46On5cIit0YWIrXCJDQVNFIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEVMU0UgL2lnLFwifjo6flwiK3RhYitcIkVMU0UgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gRU5EIC9pZyxcIn46On5cIit0YWIrXCJFTkQgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gRlJPTSAvaWcsXCJ+Ojp+RlJPTSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBHUk9VUFxcc3sxLH1CWS9pZyxcIn46On5HUk9VUCBCWSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBIQVZJTkcgL2lnLFwifjo6fkhBVklORyBcIilcbiAgICAgICAgLy8ucmVwbGFjZSgvIElOIC9pZyxcIn46On5cIit0YWIrXCJJTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBJTiAvaWcsXCIgSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSk9JTiAvaWcsXCJ+Ojp+Sk9JTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBDUk9TU346On57MSx9Sk9JTiAvaWcsXCJ+Ojp+Q1JPU1MgSk9JTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBJTk5FUn46On57MSx9Sk9JTiAvaWcsXCJ+Ojp+SU5ORVIgSk9JTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBMRUZUfjo6fnsxLH1KT0lOIC9pZyxcIn46On5MRUZUIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gUklHSFR+Ojp+ezEsfUpPSU4gL2lnLFwifjo6flJJR0hUIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gT04gL2lnLFwifjo6flwiK3RhYitcIk9OIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9SIC9pZyxcIn46On5cIit0YWIrdGFiK1wiT1IgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gT1JERVJcXHN7MSx9QlkvaWcsXCJ+Ojp+T1JERVIgQlkgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gT1ZFUiAvaWcsXCJ+Ojp+XCIrdGFiK1wiT1ZFUiBcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcKFxcc3swLH1TRUxFQ1QgL2lnLFwifjo6fihTRUxFQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXClcXHN7MCx9U0VMRUNUIC9pZyxcIil+Ojp+U0VMRUNUIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFRIRU4gL2lnLFwiIFRIRU5+Ojp+XCIrdGFiK1wiXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gVU5JT04gL2lnLFwifjo6flVOSU9Ofjo6flwiKVxuICAgICAgICAucmVwbGFjZSgvIFVTSU5HIC9pZyxcIn46On5VU0lORyBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBXSEVOIC9pZyxcIn46On5cIit0YWIrXCJXSEVOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFdIRVJFIC9pZyxcIn46On5XSEVSRSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBXSVRIIC9pZyxcIn46On5XSVRIIFwiKVxuICAgICAgICAvLy5yZXBsYWNlKC9cXCxcXHN7MCx9XFwoL2lnLFwiLH46On4oIFwiKVxuICAgICAgICAvLy5yZXBsYWNlKC9cXCwvaWcsXCIsfjo6flwiK3RhYit0YWIrXCJcIilcbiAgICAgICAgLnJlcGxhY2UoLyBBTEwgL2lnLFwiIEFMTCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBBUyAvaWcsXCIgQVMgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQVNDIC9pZyxcIiBBU0MgXCIpIFxuICAgICAgICAucmVwbGFjZSgvIERFU0MgL2lnLFwiIERFU0MgXCIpIFxuICAgICAgICAucmVwbGFjZSgvIERJU1RJTkNUIC9pZyxcIiBESVNUSU5DVCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBFWElTVFMgL2lnLFwiIEVYSVNUUyBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBOT1QgL2lnLFwiIE5PVCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBOVUxMIC9pZyxcIiBOVUxMIFwiKVxuICAgICAgICAucmVwbGFjZSgvIExJS0UgL2lnLFwiIExJS0UgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9U0VMRUNUIC9pZyxcIlNFTEVDVCBcIilcbiAgICAgICAgLnJlcGxhY2UoL346On57MSx9L2csXCJ+Ojp+XCIpXG4gICAgICAgIC5zcGxpdCgnfjo6ficpO1xufVxuXG5wcC5wcm90b3R5cGUuc3FsID0gZnVuY3Rpb24odGV4dCkge1xuXG4gICAgdmFyIGFyX2J5X3F1b3RlID0gdGV4dC5yZXBsYWNlKC9cXHN7MSx9L2csXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwnL2lnLFwifjo6flxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KCd+Ojp+JyksXG4gICAgICAgIGxlbiA9IGFyX2J5X3F1b3RlLmxlbmd0aCxcbiAgICAgICAgYXIgPSBbXSxcbiAgICAgICAgZGVlcCA9IDAsXG4gICAgICAgIHRhYiA9IHRoaXMuc3RlcCwvLyt0aGlzLnN0ZXAsXG4gICAgICAgIGluQ29tbWVudCA9IHRydWUsXG4gICAgICAgIGluUXVvdGUgPSBmYWxzZSxcbiAgICAgICAgcGFyZW50aGVzaXNMZXZlbCA9IDAsXG4gICAgICAgIHN0ciA9ICcnLFxuICAgICAgICBpeCA9IDA7XG5cbiAgICBmb3IoaXg9MDtpeDxsZW47aXgrKykge1xuXG4gICAgICAgIGlmKGl4JTIpIHtcbiAgICAgICAgICAgIGFyID0gYXIuY29uY2F0KGFyX2J5X3F1b3RlW2l4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhciA9IGFyLmNvbmNhdChzcGxpdF9zcWwoYXJfYnlfcXVvdGVbaXhdLCB0YWIpICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZW4gPSBhci5sZW5ndGg7XG4gICAgZm9yKGl4PTA7aXg8bGVuO2l4KyspIHtcblxuICAgICAgICBwYXJlbnRoZXNpc0xldmVsID0gaXNTdWJxdWVyeShhcltpeF0sIHBhcmVudGhlc2lzTGV2ZWwpO1xuXG4gICAgICAgIGlmKCAvXFxzezAsfVxcc3swLH1TRUxFQ1RcXHN7MCx9Ly5leGVjKGFyW2l4XSkpICB7IFxuICAgICAgICAgICAgYXJbaXhdID0gYXJbaXhdLnJlcGxhY2UoL1xcLC9nLFwiLFxcblwiK3RhYit0YWIrXCJcIilcbiAgICAgICAgfSBcblxuICAgICAgICBpZiggL1xcc3swLH1cXChcXHN7MCx9U0VMRUNUXFxzezAsfS8uZXhlYyhhcltpeF0pKSAgeyBcbiAgICAgICAgICAgIGRlZXArKztcbiAgICAgICAgICAgIHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcbiAgICAgICAgfSBlbHNlIFxuICAgICAgICBpZiggL1xcJy8uZXhlYyhhcltpeF0pICkgIHsgXG4gICAgICAgICAgICBpZihwYXJlbnRoZXNpc0xldmVsPDEgJiYgZGVlcCkge1xuICAgICAgICAgICAgICAgIGRlZXAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ciArPSBhcltpeF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSAgeyBcbiAgICAgICAgICAgIHN0ciArPSB0aGlzLnNoaWZ0W2RlZXBdK2FyW2l4XTtcbiAgICAgICAgICAgIGlmKHBhcmVudGhlc2lzTGV2ZWw8MSAmJiBkZWVwKSB7XG4gICAgICAgICAgICAgICAgZGVlcC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgIH1cblxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxuezEsfS8sJycpLnJlcGxhY2UoL1xcbnsxLH0vZyxcIlxcblwiKTtcbiAgICByZXR1cm4gc3RyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtaW4gc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBwLnByb3RvdHlwZS54bWxtaW4gPSBmdW5jdGlvbih0ZXh0LCBwcmVzZXJ2ZUNvbW1lbnRzKSB7XG5cblx0dmFyIHN0ciA9IHByZXNlcnZlQ29tbWVudHMgPyB0ZXh0XG5cdFx0XHRcdCAgIDogdGV4dC5yZXBsYWNlKC9cXDwhWyBcXHJcXG5cXHRdKigtLShbXlxcLV18W1xcclxcbl18LVteXFwtXSkqLS1bIFxcclxcblxcdF0qKVxcPi9nLFwiXCIpO1xuXHRyZXR1cm4gIHN0ci5yZXBsYWNlKC8+XFxzezAsfTwvZyxcIj48XCIpOyBcbn1cblxucHAucHJvdG90eXBlLmpzb25taW4gPSBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0ICBcbiAgICByZXR1cm4gIHRleHQucmVwbGFjZSgvXFxzezAsfVxce1xcc3swLH0vZyxcIntcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzezAsfVxcWyQvZyxcIltcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxbXFxzezAsfS9nLFwiW1wiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC86XFxzezAsfVxcWy9nLCc6WycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcc3swLH1cXH1cXHN7MCx9L2csXCJ9XCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcc3swLH1cXF1cXHN7MCx9L2csXCJdXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXCJcXHN7MCx9XFwsL2csJ1wiLCcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLFxcc3swLH1cXFwiL2csJyxcIicpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXCJcXHN7MCx9Oi9nLCdcIjonKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC86XFxzezAsfVxcXCIvZywnOlwiJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxcc3swLH1cXFsvZywnOlsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCxcXHN7MCx9XFxbL2csJyxbJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwsXFxzezIsfS9nLCcsICcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXVxcc3swLH0sXFxzezAsfVxcWy9nLCddLFsnKTsgICBcbn1cblxucHAucHJvdG90eXBlLmNzc21pbiA9IGZ1bmN0aW9uKHRleHQsIHByZXNlcnZlQ29tbWVudHMpIHtcblx0XG5cdHZhciBzdHIgPSBwcmVzZXJ2ZUNvbW1lbnRzID8gdGV4dFxuXHRcdFx0XHQgICA6IHRleHQucmVwbGFjZSgvXFwvXFwqKFteKl18W1xcclxcbl18KFxcKisoW14qL118W1xcclxcbl0pKSkqXFwqK1xcLy9nLFwiXCIpIDtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9cXHN7MSx9L2csJyAnKVxuXHRcdFx0ICAucmVwbGFjZSgvXFx7XFxzezEsfS9nLFwie1wiKVxuXHRcdFx0ICAucmVwbGFjZSgvXFx9XFxzezEsfS9nLFwifVwiKVxuXHRcdFx0ICAucmVwbGFjZSgvXFw7XFxzezEsfS9nLFwiO1wiKVxuXHRcdFx0ICAucmVwbGFjZSgvXFwvXFwqXFxzezEsfS9nLFwiLypcIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcKlxcL1xcc3sxLH0vZyxcIiovXCIpO1xufVx0XG5cbnBwLnByb3RvdHlwZS5zcWxtaW4gPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxzezEsfS9nLFwiIFwiKS5yZXBsYWNlKC9cXHN7MSx9XFwoLyxcIihcIikucmVwbGFjZSgvXFxzezEsfVxcKS8sXCIpXCIpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnBkPSBuZXcgcHA7XHRcblxuXG5cblxuXG5cblxuXG5cblxuIiwiZnVuY3Rpb24gRE9NUGFyc2VyKG9wdGlvbnMpe1xyXG5cdHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHx7bG9jYXRvcjp7fX07XHJcblx0XHJcbn1cclxuRE9NUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZyb21TdHJpbmcgPSBmdW5jdGlvbihzb3VyY2UsbWltZVR5cGUpe1xyXG5cdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cdHZhciBzYXggPSAgbmV3IFhNTFJlYWRlcigpO1xyXG5cdHZhciBkb21CdWlsZGVyID0gb3B0aW9ucy5kb21CdWlsZGVyIHx8IG5ldyBET01IYW5kbGVyKCk7Ly9jb250ZW50SGFuZGxlciBhbmQgTGV4aWNhbEhhbmRsZXJcclxuXHR2YXIgZXJyb3JIYW5kbGVyID0gb3B0aW9ucy5lcnJvckhhbmRsZXI7XHJcblx0dmFyIGxvY2F0b3IgPSBvcHRpb25zLmxvY2F0b3I7XHJcblx0dmFyIGRlZmF1bHROU01hcCA9IG9wdGlvbnMueG1sbnN8fHt9O1xyXG5cdHZhciBlbnRpdHlNYXAgPSB7J2x0JzonPCcsJ2d0JzonPicsJ2FtcCc6JyYnLCdxdW90JzonXCInLCdhcG9zJzpcIidcIn1cclxuXHRpZihsb2NhdG9yKXtcclxuXHRcdGRvbUJ1aWxkZXIuc2V0RG9jdW1lbnRMb2NhdG9yKGxvY2F0b3IpXHJcblx0fVxyXG5cdFxyXG5cdHNheC5lcnJvckhhbmRsZXIgPSBidWlsZEVycm9ySGFuZGxlcihlcnJvckhhbmRsZXIsZG9tQnVpbGRlcixsb2NhdG9yKTtcclxuXHRzYXguZG9tQnVpbGRlciA9IG9wdGlvbnMuZG9tQnVpbGRlciB8fCBkb21CdWlsZGVyO1xyXG5cdGlmKC9cXC94P2h0bWw/JC8udGVzdChtaW1lVHlwZSkpe1xyXG5cdFx0ZW50aXR5TWFwLm5ic3AgPSAnXFx4YTAnO1xyXG5cdFx0ZW50aXR5TWFwLmNvcHkgPSAnXFx4YTknO1xyXG5cdFx0ZGVmYXVsdE5TTWFwWycnXT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xyXG5cdH1cclxuXHRkZWZhdWx0TlNNYXAueG1sID0gZGVmYXVsdE5TTWFwLnhtbCB8fCAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcclxuXHRpZihzb3VyY2Upe1xyXG5cdFx0c2F4LnBhcnNlKHNvdXJjZSxkZWZhdWx0TlNNYXAsZW50aXR5TWFwKTtcclxuXHR9ZWxzZXtcclxuXHRcdHNheC5lcnJvckhhbmRsZXIuZXJyb3IoXCJpbnZhbGlkIGRvYyBzb3VyY2VcIik7XHJcblx0fVxyXG5cdHJldHVybiBkb21CdWlsZGVyLmRvYztcclxufVxyXG5mdW5jdGlvbiBidWlsZEVycm9ySGFuZGxlcihlcnJvckltcGwsZG9tQnVpbGRlcixsb2NhdG9yKXtcclxuXHRpZighZXJyb3JJbXBsKXtcclxuXHRcdGlmKGRvbUJ1aWxkZXIgaW5zdGFuY2VvZiBET01IYW5kbGVyKXtcclxuXHRcdFx0cmV0dXJuIGRvbUJ1aWxkZXI7XHJcblx0XHR9XHJcblx0XHRlcnJvckltcGwgPSBkb21CdWlsZGVyIDtcclxuXHR9XHJcblx0dmFyIGVycm9ySGFuZGxlciA9IHt9XHJcblx0dmFyIGlzQ2FsbGJhY2sgPSBlcnJvckltcGwgaW5zdGFuY2VvZiBGdW5jdGlvbjtcclxuXHRsb2NhdG9yID0gbG9jYXRvcnx8e31cclxuXHRmdW5jdGlvbiBidWlsZChrZXkpe1xyXG5cdFx0dmFyIGZuID0gZXJyb3JJbXBsW2tleV07XHJcblx0XHRpZighZm4gJiYgaXNDYWxsYmFjayl7XHJcblx0XHRcdGZuID0gZXJyb3JJbXBsLmxlbmd0aCA9PSAyP2Z1bmN0aW9uKG1zZyl7ZXJyb3JJbXBsKGtleSxtc2cpfTplcnJvckltcGw7XHJcblx0XHR9XHJcblx0XHRlcnJvckhhbmRsZXJba2V5XSA9IGZuICYmIGZ1bmN0aW9uKG1zZyl7XHJcblx0XHRcdGZuKCdbeG1sZG9tICcra2V5KyddXFx0Jyttc2crX2xvY2F0b3IobG9jYXRvcikpO1xyXG5cdFx0fXx8ZnVuY3Rpb24oKXt9O1xyXG5cdH1cclxuXHRidWlsZCgnd2FybmluZycpO1xyXG5cdGJ1aWxkKCdlcnJvcicpO1xyXG5cdGJ1aWxkKCdmYXRhbEVycm9yJyk7XHJcblx0cmV0dXJuIGVycm9ySGFuZGxlcjtcclxufVxyXG5cclxuLy9jb25zb2xlLmxvZygnI1xcblxcblxcblxcblxcblxcblxcbiMjIyMnKVxyXG4vKipcclxuICogK0NvbnRlbnRIYW5kbGVyK0Vycm9ySGFuZGxlclxyXG4gKiArTGV4aWNhbEhhbmRsZXIrRW50aXR5UmVzb2x2ZXIyXHJcbiAqIC1EZWNsSGFuZGxlci1EVERIYW5kbGVyIFxyXG4gKiBcclxuICogRGVmYXVsdEhhbmRsZXI6RW50aXR5UmVzb2x2ZXIsIERUREhhbmRsZXIsIENvbnRlbnRIYW5kbGVyLCBFcnJvckhhbmRsZXJcclxuICogRGVmYXVsdEhhbmRsZXIyOkRlZmF1bHRIYW5kbGVyLExleGljYWxIYW5kbGVyLCBEZWNsSGFuZGxlciwgRW50aXR5UmVzb2x2ZXIyXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L2hlbHBlcnMvRGVmYXVsdEhhbmRsZXIuaHRtbFxyXG4gKi9cclxuZnVuY3Rpb24gRE9NSGFuZGxlcigpIHtcclxuICAgIHRoaXMuY2RhdGEgPSBmYWxzZTtcclxufVxyXG5mdW5jdGlvbiBwb3NpdGlvbihsb2NhdG9yLG5vZGUpe1xyXG5cdG5vZGUubGluZU51bWJlciA9IGxvY2F0b3IubGluZU51bWJlcjtcclxuXHRub2RlLmNvbHVtbk51bWJlciA9IGxvY2F0b3IuY29sdW1uTnVtYmVyO1xyXG59XHJcbi8qKlxyXG4gKiBAc2VlIG9yZy54bWwuc2F4LkNvbnRlbnRIYW5kbGVyI3N0YXJ0RG9jdW1lbnRcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvQ29udGVudEhhbmRsZXIuaHRtbFxyXG4gKi8gXHJcbkRPTUhhbmRsZXIucHJvdG90eXBlID0ge1xyXG5cdHN0YXJ0RG9jdW1lbnQgOiBmdW5jdGlvbigpIHtcclxuICAgIFx0dGhpcy5kb2MgPSBuZXcgRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudChudWxsLCBudWxsLCBudWxsKTtcclxuICAgIFx0aWYgKHRoaXMubG9jYXRvcikge1xyXG4gICAgICAgIFx0dGhpcy5kb2MuZG9jdW1lbnRVUkkgPSB0aGlzLmxvY2F0b3Iuc3lzdGVtSWQ7XHJcbiAgICBcdH1cclxuXHR9LFxyXG5cdHN0YXJ0RWxlbWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSwgcU5hbWUsIGF0dHJzKSB7XHJcblx0XHR2YXIgZG9jID0gdGhpcy5kb2M7XHJcblx0ICAgIHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxTmFtZXx8bG9jYWxOYW1lKTtcclxuXHQgICAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuXHQgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBlbCk7XHJcblx0ICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSBlbDtcclxuXHQgICAgXHJcblx0XHR0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGVsKVxyXG5cdCAgICBmb3IgKHZhciBpID0gMCA7IGkgPCBsZW47IGkrKykge1xyXG5cdCAgICAgICAgdmFyIG5hbWVzcGFjZVVSSSA9IGF0dHJzLmdldFVSSShpKTtcclxuXHQgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJzLmdldFZhbHVlKGkpO1xyXG5cdCAgICAgICAgdmFyIHFOYW1lID0gYXR0cnMuZ2V0UU5hbWUoaSk7XHJcblx0XHRcdHZhciBhdHRyID0gZG9jLmNyZWF0ZUF0dHJpYnV0ZU5TKG5hbWVzcGFjZVVSSSwgcU5hbWUpO1xyXG5cdFx0XHR0aGlzLmxvY2F0b3IgJiZwb3NpdGlvbihhdHRycy5nZXRMb2NhdG9yKGkpLGF0dHIpO1xyXG5cdFx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0ZWwuc2V0QXR0cmlidXRlTm9kZShhdHRyKVxyXG5cdCAgICB9XHJcblx0fSxcclxuXHRlbmRFbGVtZW50OmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lLCBxTmFtZSkge1xyXG5cdFx0dmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRFbGVtZW50XHJcblx0XHR2YXIgdGFnTmFtZSA9IGN1cnJlbnQudGFnTmFtZTtcclxuXHRcdHRoaXMuY3VycmVudEVsZW1lbnQgPSBjdXJyZW50LnBhcmVudE5vZGU7XHJcblx0fSxcclxuXHRzdGFydFByZWZpeE1hcHBpbmc6ZnVuY3Rpb24ocHJlZml4LCB1cmkpIHtcclxuXHR9LFxyXG5cdGVuZFByZWZpeE1hcHBpbmc6ZnVuY3Rpb24ocHJlZml4KSB7XHJcblx0fSxcclxuXHRwcm9jZXNzaW5nSW5zdHJ1Y3Rpb246ZnVuY3Rpb24odGFyZ2V0LCBkYXRhKSB7XHJcblx0ICAgIHZhciBpbnMgPSB0aGlzLmRvYy5jcmVhdGVQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24odGFyZ2V0LCBkYXRhKTtcclxuXHQgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixpbnMpXHJcblx0ICAgIGFwcGVuZEVsZW1lbnQodGhpcywgaW5zKTtcclxuXHR9LFxyXG5cdGlnbm9yYWJsZVdoaXRlc3BhY2U6ZnVuY3Rpb24oY2gsIHN0YXJ0LCBsZW5ndGgpIHtcclxuXHR9LFxyXG5cdGNoYXJhY3RlcnM6ZnVuY3Rpb24oY2hhcnMsIHN0YXJ0LCBsZW5ndGgpIHtcclxuXHRcdGNoYXJzID0gX3RvU3RyaW5nLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxyXG5cdFx0Ly9jb25zb2xlLmxvZyhjaGFycylcclxuXHRcdGlmKGNoYXJzKXtcclxuXHRcdFx0aWYgKHRoaXMuY2RhdGEpIHtcclxuXHRcdFx0XHR2YXIgY2hhck5vZGUgPSB0aGlzLmRvYy5jcmVhdGVDREFUQVNlY3Rpb24oY2hhcnMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBjaGFyTm9kZSA9IHRoaXMuZG9jLmNyZWF0ZVRleHROb2RlKGNoYXJzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0aGlzLmN1cnJlbnRFbGVtZW50KXtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGNoYXJOb2RlKTtcclxuXHRcdFx0fWVsc2UgaWYoL15cXHMqJC8udGVzdChjaGFycykpe1xyXG5cdFx0XHRcdHRoaXMuZG9jLmFwcGVuZENoaWxkKGNoYXJOb2RlKTtcclxuXHRcdFx0XHQvL3Byb2Nlc3MgeG1sXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixjaGFyTm9kZSlcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNraXBwZWRFbnRpdHk6ZnVuY3Rpb24obmFtZSkge1xyXG5cdH0sXHJcblx0ZW5kRG9jdW1lbnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRvYy5ub3JtYWxpemUoKTtcclxuXHR9LFxyXG5cdHNldERvY3VtZW50TG9jYXRvcjpmdW5jdGlvbiAobG9jYXRvcikge1xyXG5cdCAgICBpZih0aGlzLmxvY2F0b3IgPSBsb2NhdG9yKXsvLyAmJiAhKCdsaW5lTnVtYmVyJyBpbiBsb2NhdG9yKSl7XHJcblx0ICAgIFx0bG9jYXRvci5saW5lTnVtYmVyID0gMDtcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0Ly9MZXhpY2FsSGFuZGxlclxyXG5cdGNvbW1lbnQ6ZnVuY3Rpb24oY2hhcnMsIHN0YXJ0LCBsZW5ndGgpIHtcclxuXHRcdGNoYXJzID0gX3RvU3RyaW5nLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxyXG5cdCAgICB2YXIgY29tbSA9IHRoaXMuZG9jLmNyZWF0ZUNvbW1lbnQoY2hhcnMpO1xyXG5cdCAgICB0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGNvbW0pXHJcblx0ICAgIGFwcGVuZEVsZW1lbnQodGhpcywgY29tbSk7XHJcblx0fSxcclxuXHRcclxuXHRzdGFydENEQVRBOmZ1bmN0aW9uKCkge1xyXG5cdCAgICAvL3VzZWQgaW4gY2hhcmFjdGVycygpIG1ldGhvZHNcclxuXHQgICAgdGhpcy5jZGF0YSA9IHRydWU7XHJcblx0fSxcclxuXHRlbmRDREFUQTpmdW5jdGlvbigpIHtcclxuXHQgICAgdGhpcy5jZGF0YSA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnREVEQ6ZnVuY3Rpb24obmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKSB7XHJcblx0XHR2YXIgaW1wbCA9IHRoaXMuZG9jLmltcGxlbWVudGF0aW9uO1xyXG5cdCAgICBpZiAoaW1wbCAmJiBpbXBsLmNyZWF0ZURvY3VtZW50VHlwZSkge1xyXG5cdCAgICAgICAgdmFyIGR0ID0gaW1wbC5jcmVhdGVEb2N1bWVudFR5cGUobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKTtcclxuXHQgICAgICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsZHQpXHJcblx0ICAgICAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGR0KTtcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0LyoqXHJcblx0ICogQHNlZSBvcmcueG1sLnNheC5FcnJvckhhbmRsZXJcclxuXHQgKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9FcnJvckhhbmRsZXIuaHRtbFxyXG5cdCAqL1xyXG5cdHdhcm5pbmc6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUud2FybignW3htbGRvbSB3YXJuaW5nXVxcdCcrZXJyb3IsX2xvY2F0b3IodGhpcy5sb2NhdG9yKSk7XHJcblx0fSxcclxuXHRlcnJvcjpmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcignW3htbGRvbSBlcnJvcl1cXHQnK2Vycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdH0sXHJcblx0ZmF0YWxFcnJvcjpmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcignW3htbGRvbSBmYXRhbEVycm9yXVxcdCcrZXJyb3IsX2xvY2F0b3IodGhpcy5sb2NhdG9yKSk7XHJcblx0ICAgIHRocm93IGVycm9yO1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBfbG9jYXRvcihsKXtcclxuXHRpZihsKXtcclxuXHRcdHJldHVybiAnXFxuQCcrKGwuc3lzdGVtSWQgfHwnJykrJyNbbGluZTonK2wubGluZU51bWJlcisnLGNvbDonK2wuY29sdW1uTnVtYmVyKyddJ1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBfdG9TdHJpbmcoY2hhcnMsc3RhcnQsbGVuZ3RoKXtcclxuXHRpZih0eXBlb2YgY2hhcnMgPT0gJ3N0cmluZycpe1xyXG5cdFx0cmV0dXJuIGNoYXJzLnN1YnN0cihzdGFydCxsZW5ndGgpXHJcblx0fWVsc2V7Ly9qYXZhIHNheCBjb25uZWN0IHdpZHRoIHhtbGRvbSBvbiByaGlubyh3aGF0IGFib3V0OiBcIj8gJiYgIShjaGFycyBpbnN0YW5jZW9mIFN0cmluZylcIilcclxuXHRcdGlmKGNoYXJzLmxlbmd0aCA+PSBzdGFydCtsZW5ndGggfHwgc3RhcnQpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IGphdmEubGFuZy5TdHJpbmcoY2hhcnMsc3RhcnQsbGVuZ3RoKSsnJztcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFycztcclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L2V4dC9MZXhpY2FsSGFuZGxlci5odG1sXHJcbiAqIHVzZWQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LmV4dC5MZXhpY2FsSGFuZGxlcjpcclxuICogICNjb21tZW50KGNoYXJzLCBzdGFydCwgbGVuZ3RoKVxyXG4gKiAgI3N0YXJ0Q0RBVEEoKVxyXG4gKiAgI2VuZENEQVRBKClcclxuICogICNzdGFydERURChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpXHJcbiAqXHJcbiAqXHJcbiAqIElHTk9SRUQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LmV4dC5MZXhpY2FsSGFuZGxlcjpcclxuICogICNlbmREVEQoKVxyXG4gKiAgI3N0YXJ0RW50aXR5KG5hbWUpXHJcbiAqICAjZW5kRW50aXR5KG5hbWUpXHJcbiAqXHJcbiAqXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L2V4dC9EZWNsSGFuZGxlci5odG1sXHJcbiAqIElHTk9SRUQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LmV4dC5EZWNsSGFuZGxlclxyXG4gKiBcdCNhdHRyaWJ1dGVEZWNsKGVOYW1lLCBhTmFtZSwgdHlwZSwgbW9kZSwgdmFsdWUpXHJcbiAqICAjZWxlbWVudERlY2wobmFtZSwgbW9kZWwpXHJcbiAqICAjZXh0ZXJuYWxFbnRpdHlEZWNsKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZClcclxuICogICNpbnRlcm5hbEVudGl0eURlY2wobmFtZSwgdmFsdWUpXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L2V4dC9FbnRpdHlSZXNvbHZlcjIuaHRtbFxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5FbnRpdHlSZXNvbHZlcjJcclxuICogICNyZXNvbHZlRW50aXR5KFN0cmluZyBuYW1lLFN0cmluZyBwdWJsaWNJZCxTdHJpbmcgYmFzZVVSSSxTdHJpbmcgc3lzdGVtSWQpXHJcbiAqICAjcmVzb2x2ZUVudGl0eShwdWJsaWNJZCwgc3lzdGVtSWQpXHJcbiAqICAjZ2V0RXh0ZXJuYWxTdWJzZXQobmFtZSwgYmFzZVVSSSlcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvRFRESGFuZGxlci5odG1sXHJcbiAqIElHTk9SRUQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LkRUREhhbmRsZXJcclxuICogICNub3RhdGlvbkRlY2wobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKSB7fTtcclxuICogICN1bnBhcnNlZEVudGl0eURlY2wobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkLCBub3RhdGlvbk5hbWUpIHt9O1xyXG4gKi9cclxuXCJlbmREVEQsc3RhcnRFbnRpdHksZW5kRW50aXR5LGF0dHJpYnV0ZURlY2wsZWxlbWVudERlY2wsZXh0ZXJuYWxFbnRpdHlEZWNsLGludGVybmFsRW50aXR5RGVjbCxyZXNvbHZlRW50aXR5LGdldEV4dGVybmFsU3Vic2V0LG5vdGF0aW9uRGVjbCx1bnBhcnNlZEVudGl0eURlY2xcIi5yZXBsYWNlKC9cXHcrL2csZnVuY3Rpb24oa2V5KXtcclxuXHRET01IYW5kbGVyLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH1cclxufSlcclxuXHJcbi8qIFByaXZhdGUgc3RhdGljIGhlbHBlcnMgdHJlYXRlZCBiZWxvdyBhcyBwcml2YXRlIGluc3RhbmNlIG1ldGhvZHMsIHNvIGRvbid0IG5lZWQgdG8gYWRkIHRoZXNlIHRvIHRoZSBwdWJsaWMgQVBJOyB3ZSBtaWdodCB1c2UgYSBSZWxhdG9yIHRvIGFsc28gZ2V0IHJpZCBvZiBub24tc3RhbmRhcmQgcHVibGljIHByb3BlcnRpZXMgKi9cclxuZnVuY3Rpb24gYXBwZW5kRWxlbWVudCAoaGFuZGVyLG5vZGUpIHtcclxuICAgIGlmICghaGFuZGVyLmN1cnJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgaGFuZGVyLmRvYy5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFuZGVyLmN1cnJlbnRFbGVtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfVxyXG59Ly9hcHBlbmRDaGlsZCBhbmQgc2V0QXR0cmlidXRlTlMgYXJlIHByZWZvcm1hbmNlIGtleVxyXG5cclxuLy9pZih0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nKXtcclxuXHR2YXIgWE1MUmVhZGVyID0gcmVxdWlyZSgnLi9zYXgnKS5YTUxSZWFkZXI7XHJcblx0dmFyIERPTUltcGxlbWVudGF0aW9uID0gZXhwb3J0cy5ET01JbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vZG9tJykuRE9NSW1wbGVtZW50YXRpb247XHJcblx0ZXhwb3J0cy5YTUxTZXJpYWxpemVyID0gcmVxdWlyZSgnLi9kb20nKS5YTUxTZXJpYWxpemVyIDtcclxuXHRleHBvcnRzLkRPTVBhcnNlciA9IERPTVBhcnNlcjtcclxuLy99XHJcbiIsIi8qXG4gKiBET00gTGV2ZWwgMlxuICogT2JqZWN0IERPTUV4Y2VwdGlvblxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtRE9NLUxldmVsLTEvZWNtYS1zY3JpcHQtbGFuZ3VhZ2UtYmluZGluZy5odG1sXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDAvUkVDLURPTS1MZXZlbC0yLUNvcmUtMjAwMDExMTMvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG4gKi9cblxuZnVuY3Rpb24gY29weShzcmMsZGVzdCl7XG5cdGZvcih2YXIgcCBpbiBzcmMpe1xuXHRcdGRlc3RbcF0gPSBzcmNbcF07XG5cdH1cbn1cbi8qKlxuXlxcdytcXC5wcm90b3R5cGVcXC4oW19cXHddKylcXHMqPVxccyooKD86LipcXHtcXHMqP1tcXHJcXG5dW1xcc1xcU10qP159KXxcXFMuKj8oPz1bO1xcclxcbl0pKTs/XG5eXFx3K1xcLnByb3RvdHlwZVxcLihbX1xcd10rKVxccyo9XFxzKihcXFMuKj8oPz1bO1xcclxcbl0pKTs/XG4gKi9cbmZ1bmN0aW9uIF9leHRlbmRzKENsYXNzLFN1cGVyKXtcblx0dmFyIHB0ID0gQ2xhc3MucHJvdG90eXBlO1xuXHRpZihPYmplY3QuY3JlYXRlKXtcblx0XHR2YXIgcHB0ID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpXG5cdFx0cHQuX19wcm90b19fID0gcHB0O1xuXHR9XG5cdGlmKCEocHQgaW5zdGFuY2VvZiBTdXBlcikpe1xuXHRcdGZ1bmN0aW9uIHQoKXt9O1xuXHRcdHQucHJvdG90eXBlID0gU3VwZXIucHJvdG90eXBlO1xuXHRcdHQgPSBuZXcgdCgpO1xuXHRcdGNvcHkocHQsdCk7XG5cdFx0Q2xhc3MucHJvdG90eXBlID0gcHQgPSB0O1xuXHR9XG5cdGlmKHB0LmNvbnN0cnVjdG9yICE9IENsYXNzKXtcblx0XHRpZih0eXBlb2YgQ2xhc3MgIT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwidW5rbm93IENsYXNzOlwiK0NsYXNzKVxuXHRcdH1cblx0XHRwdC5jb25zdHJ1Y3RvciA9IENsYXNzXG5cdH1cbn1cbnZhciBodG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgO1xuLy8gTm9kZSBUeXBlc1xudmFyIE5vZGVUeXBlID0ge31cbnZhciBFTEVNRU5UX05PREUgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5FTEVNRU5UX05PREUgICAgICAgICAgICAgICAgPSAxO1xudmFyIEFUVFJJQlVURV9OT0RFICAgICAgICAgICAgICA9IE5vZGVUeXBlLkFUVFJJQlVURV9OT0RFICAgICAgICAgICAgICA9IDI7XG52YXIgVEVYVF9OT0RFICAgICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuVEVYVF9OT0RFICAgICAgICAgICAgICAgICAgID0gMztcbnZhciBDREFUQV9TRUNUSU9OX05PREUgICAgICAgICAgPSBOb2RlVHlwZS5DREFUQV9TRUNUSU9OX05PREUgICAgICAgICAgPSA0O1xudmFyIEVOVElUWV9SRUZFUkVOQ0VfTk9ERSAgICAgICA9IE5vZGVUeXBlLkVOVElUWV9SRUZFUkVOQ0VfTk9ERSAgICAgICA9IDU7XG52YXIgRU5USVRZX05PREUgICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRU5USVRZX05PREUgICAgICAgICAgICAgICAgID0gNjtcbnZhciBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSBOb2RlVHlwZS5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSA3O1xudmFyIENPTU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkNPTU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IDg7XG52YXIgRE9DVU1FTlRfTk9ERSAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfTk9ERSAgICAgICAgICAgICAgID0gOTtcbnZhciBET0NVTUVOVF9UWVBFX05PREUgICAgICAgICAgPSBOb2RlVHlwZS5ET0NVTUVOVF9UWVBFX05PREUgICAgICAgICAgPSAxMDtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFICAgICAgPSBOb2RlVHlwZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFICAgICAgPSAxMTtcbnZhciBOT1RBVElPTl9OT0RFICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5OT1RBVElPTl9OT0RFICAgICAgICAgICAgICAgPSAxMjtcblxuLy8gRXhjZXB0aW9uQ29kZVxudmFyIEV4Y2VwdGlvbkNvZGUgPSB7fVxudmFyIEV4Y2VwdGlvbk1lc3NhZ2UgPSB7fTtcbnZhciBJTkRFWF9TSVpFX0VSUiAgICAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLklOREVYX1NJWkVfRVJSICAgICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVsxXT1cIkluZGV4IHNpemUgZXJyb3JcIiksMSk7XG52YXIgRE9NU1RSSU5HX1NJWkVfRVJSICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5ET01TVFJJTkdfU0laRV9FUlIgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMl09XCJET01TdHJpbmcgc2l6ZSBlcnJvclwiKSwyKTtcbnZhciBISUVSQVJDSFlfUkVRVUVTVF9FUlIgICAgICAgPSBFeGNlcHRpb25Db2RlLkhJRVJBUkNIWV9SRVFVRVNUX0VSUiAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVszXT1cIkhpZXJhcmNoeSByZXF1ZXN0IGVycm9yXCIpLDMpO1xudmFyIFdST05HX0RPQ1VNRU5UX0VSUiAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuV1JPTkdfRE9DVU1FTlRfRVJSICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzRdPVwiV3JvbmcgZG9jdW1lbnRcIiksNCk7XG52YXIgSU5WQUxJRF9DSEFSQUNURVJfRVJSICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX0NIQVJBQ1RFUl9FUlIgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbNV09XCJJbnZhbGlkIGNoYXJhY3RlclwiKSw1KTtcbnZhciBOT19EQVRBX0FMTE9XRURfRVJSICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PX0RBVEFfQUxMT1dFRF9FUlIgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs2XT1cIk5vIGRhdGEgYWxsb3dlZFwiKSw2KTtcbnZhciBOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIgPSBFeGNlcHRpb25Db2RlLk5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUiA9ICgoRXhjZXB0aW9uTWVzc2FnZVs3XT1cIk5vIG1vZGlmaWNhdGlvbiBhbGxvd2VkXCIpLDcpO1xudmFyIE5PVF9GT1VORF9FUlIgICAgICAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuTk9UX0ZPVU5EX0VSUiAgICAgICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzhdPVwiTm90IGZvdW5kXCIpLDgpO1xudmFyIE5PVF9TVVBQT1JURURfRVJSICAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuTk9UX1NVUFBPUlRFRF9FUlIgICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzldPVwiTm90IHN1cHBvcnRlZFwiKSw5KTtcbnZhciBJTlVTRV9BVFRSSUJVVEVfRVJSICAgICAgICAgPSBFeGNlcHRpb25Db2RlLklOVVNFX0FUVFJJQlVURV9FUlIgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMF09XCJBdHRyaWJ1dGUgaW4gdXNlXCIpLDEwKTtcbi8vbGV2ZWwyXG52YXIgSU5WQUxJRF9TVEFURV9FUlIgICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLklOVkFMSURfU1RBVEVfRVJSICAgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzExXT1cIkludmFsaWQgc3RhdGVcIiksMTEpO1xudmFyIFNZTlRBWF9FUlIgICAgICAgICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5TWU5UQVhfRVJSICAgICAgICAgICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMl09XCJTeW50YXggZXJyb3JcIiksMTIpO1xudmFyIElOVkFMSURfTU9ESUZJQ0FUSU9OX0VSUiBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX01PRElGSUNBVElPTl9FUlIgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxM109XCJJbnZhbGlkIG1vZGlmaWNhdGlvblwiKSwxMyk7XG52YXIgTkFNRVNQQUNFX0VSUiAgICAgICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLk5BTUVTUEFDRV9FUlIgICAgICAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTRdPVwiSW52YWxpZCBuYW1lc3BhY2VcIiksMTQpO1xudmFyIElOVkFMSURfQUNDRVNTX0VSUiAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX0FDQ0VTU19FUlIgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzE1XT1cIkludmFsaWQgYWNjZXNzXCIpLDE1KTtcblxuXG5mdW5jdGlvbiBET01FeGNlcHRpb24oY29kZSwgbWVzc2FnZSkge1xuXHRpZihtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3Ipe1xuXHRcdHZhciBlcnJvciA9IG1lc3NhZ2U7XG5cdH1lbHNle1xuXHRcdGVycm9yID0gdGhpcztcblx0XHRFcnJvci5jYWxsKHRoaXMsIEV4Y2VwdGlvbk1lc3NhZ2VbY29kZV0pO1xuXHRcdHRoaXMubWVzc2FnZSA9IEV4Y2VwdGlvbk1lc3NhZ2VbY29kZV07XG5cdFx0aWYoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIERPTUV4Y2VwdGlvbik7XG5cdH1cblx0ZXJyb3IuY29kZSA9IGNvZGU7XG5cdGlmKG1lc3NhZ2UpIHRoaXMubWVzc2FnZSA9IHRoaXMubWVzc2FnZSArIFwiOiBcIiArIG1lc3NhZ2U7XG5cdHJldHVybiBlcnJvcjtcbn07XG5ET01FeGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuY29weShFeGNlcHRpb25Db2RlLERPTUV4Y2VwdGlvbilcbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAwL1JFQy1ET00tTGV2ZWwtMi1Db3JlLTIwMDAxMTEzL2NvcmUuaHRtbCNJRC01MzYyOTcxNzdcbiAqIFRoZSBOb2RlTGlzdCBpbnRlcmZhY2UgcHJvdmlkZXMgdGhlIGFic3RyYWN0aW9uIG9mIGFuIG9yZGVyZWQgY29sbGVjdGlvbiBvZiBub2Rlcywgd2l0aG91dCBkZWZpbmluZyBvciBjb25zdHJhaW5pbmcgaG93IHRoaXMgY29sbGVjdGlvbiBpcyBpbXBsZW1lbnRlZC4gTm9kZUxpc3Qgb2JqZWN0cyBpbiB0aGUgRE9NIGFyZSBsaXZlLlxuICogVGhlIGl0ZW1zIGluIHRoZSBOb2RlTGlzdCBhcmUgYWNjZXNzaWJsZSB2aWEgYW4gaW50ZWdyYWwgaW5kZXgsIHN0YXJ0aW5nIGZyb20gMC5cbiAqL1xuZnVuY3Rpb24gTm9kZUxpc3QoKSB7XG59O1xuTm9kZUxpc3QucHJvdG90eXBlID0ge1xuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdC4gVGhlIHJhbmdlIG9mIHZhbGlkIGNoaWxkIG5vZGUgaW5kaWNlcyBpcyAwIHRvIGxlbmd0aC0xIGluY2x1c2l2ZS5cblx0ICogQHN0YW5kYXJkIGxldmVsMVxuXHQgKi9cblx0bGVuZ3RoOjAsIFxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgaW5kZXh0aCBpdGVtIGluIHRoZSBjb2xsZWN0aW9uLiBJZiBpbmRleCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdCwgdGhpcyByZXR1cm5zIG51bGwuXG5cdCAqIEBzdGFuZGFyZCBsZXZlbDFcblx0ICogQHBhcmFtIGluZGV4ICB1bnNpZ25lZCBsb25nIFxuXHQgKiAgIEluZGV4IGludG8gdGhlIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm4gTm9kZVxuXHQgKiBcdFRoZSBub2RlIGF0IHRoZSBpbmRleHRoIHBvc2l0aW9uIGluIHRoZSBOb2RlTGlzdCwgb3IgbnVsbCBpZiB0aGF0IGlzIG5vdCBhIHZhbGlkIGluZGV4LiBcblx0ICovXG5cdGl0ZW06IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0cmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGw7XG5cdH0sXG5cdHRvU3RyaW5nOmZ1bmN0aW9uKGlzSFRNTCxub2RlRmlsdGVyKXtcblx0XHRmb3IodmFyIGJ1ZiA9IFtdLCBpID0gMDtpPHRoaXMubGVuZ3RoO2krKyl7XG5cdFx0XHRzZXJpYWxpemVUb1N0cmluZyh0aGlzW2ldLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcik7XG5cdFx0fVxuXHRcdHJldHVybiBidWYuam9pbignJyk7XG5cdH1cbn07XG5mdW5jdGlvbiBMaXZlTm9kZUxpc3Qobm9kZSxyZWZyZXNoKXtcblx0dGhpcy5fbm9kZSA9IG5vZGU7XG5cdHRoaXMuX3JlZnJlc2ggPSByZWZyZXNoXG5cdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVMaXZlTGlzdChsaXN0KXtcblx0dmFyIGluYyA9IGxpc3QuX25vZGUuX2luYyB8fCBsaXN0Ll9ub2RlLm93bmVyRG9jdW1lbnQuX2luYztcblx0aWYobGlzdC5faW5jICE9IGluYyl7XG5cdFx0dmFyIGxzID0gbGlzdC5fcmVmcmVzaChsaXN0Ll9ub2RlKTtcblx0XHQvL2NvbnNvbGUubG9nKGxzLmxlbmd0aClcblx0XHRfX3NldF9fKGxpc3QsJ2xlbmd0aCcsbHMubGVuZ3RoKTtcblx0XHRjb3B5KGxzLGxpc3QpO1xuXHRcdGxpc3QuX2luYyA9IGluYztcblx0fVxufVxuTGl2ZU5vZGVMaXN0LnByb3RvdHlwZS5pdGVtID0gZnVuY3Rpb24oaSl7XG5cdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcblx0cmV0dXJuIHRoaXNbaV07XG59XG5cbl9leHRlbmRzKExpdmVOb2RlTGlzdCxOb2RlTGlzdCk7XG4vKipcbiAqIFxuICogT2JqZWN0cyBpbXBsZW1lbnRpbmcgdGhlIE5hbWVkTm9kZU1hcCBpbnRlcmZhY2UgYXJlIHVzZWQgdG8gcmVwcmVzZW50IGNvbGxlY3Rpb25zIG9mIG5vZGVzIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIGJ5IG5hbWUuIE5vdGUgdGhhdCBOYW1lZE5vZGVNYXAgZG9lcyBub3QgaW5oZXJpdCBmcm9tIE5vZGVMaXN0OyBOYW1lZE5vZGVNYXBzIGFyZSBub3QgbWFpbnRhaW5lZCBpbiBhbnkgcGFydGljdWxhciBvcmRlci4gT2JqZWN0cyBjb250YWluZWQgaW4gYW4gb2JqZWN0IGltcGxlbWVudGluZyBOYW1lZE5vZGVNYXAgbWF5IGFsc28gYmUgYWNjZXNzZWQgYnkgYW4gb3JkaW5hbCBpbmRleCwgYnV0IHRoaXMgaXMgc2ltcGx5IHRvIGFsbG93IGNvbnZlbmllbnQgZW51bWVyYXRpb24gb2YgdGhlIGNvbnRlbnRzIG9mIGEgTmFtZWROb2RlTWFwLCBhbmQgZG9lcyBub3QgaW1wbHkgdGhhdCB0aGUgRE9NIHNwZWNpZmllcyBhbiBvcmRlciB0byB0aGVzZSBOb2Rlcy5cbiAqIE5hbWVkTm9kZU1hcCBvYmplY3RzIGluIHRoZSBET00gYXJlIGxpdmUuXG4gKiB1c2VkIGZvciBhdHRyaWJ1dGVzIG9yIERvY3VtZW50VHlwZSBlbnRpdGllcyBcbiAqL1xuZnVuY3Rpb24gTmFtZWROb2RlTWFwKCkge1xufTtcblxuZnVuY3Rpb24gX2ZpbmROb2RlSW5kZXgobGlzdCxub2RlKXtcblx0dmFyIGkgPSBsaXN0Lmxlbmd0aDtcblx0d2hpbGUoaS0tKXtcblx0XHRpZihsaXN0W2ldID09PSBub2RlKXtyZXR1cm4gaX1cblx0fVxufVxuXG5mdW5jdGlvbiBfYWRkTmFtZWROb2RlKGVsLGxpc3QsbmV3QXR0cixvbGRBdHRyKXtcblx0aWYob2xkQXR0cil7XG5cdFx0bGlzdFtfZmluZE5vZGVJbmRleChsaXN0LG9sZEF0dHIpXSA9IG5ld0F0dHI7XG5cdH1lbHNle1xuXHRcdGxpc3RbbGlzdC5sZW5ndGgrK10gPSBuZXdBdHRyO1xuXHR9XG5cdGlmKGVsKXtcblx0XHRuZXdBdHRyLm93bmVyRWxlbWVudCA9IGVsO1xuXHRcdHZhciBkb2MgPSBlbC5vd25lckRvY3VtZW50O1xuXHRcdGlmKGRvYyl7XG5cdFx0XHRvbGRBdHRyICYmIF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsb2xkQXR0cik7XG5cdFx0XHRfb25BZGRBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIpO1xuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gX3JlbW92ZU5hbWVkTm9kZShlbCxsaXN0LGF0dHIpe1xuXHQvL2NvbnNvbGUubG9nKCdyZW1vdmUgYXR0cjonK2F0dHIpXG5cdHZhciBpID0gX2ZpbmROb2RlSW5kZXgobGlzdCxhdHRyKTtcblx0aWYoaT49MCl7XG5cdFx0dmFyIGxhc3RJbmRleCA9IGxpc3QubGVuZ3RoLTFcblx0XHR3aGlsZShpPGxhc3RJbmRleCl7XG5cdFx0XHRsaXN0W2ldID0gbGlzdFsrK2ldXG5cdFx0fVxuXHRcdGxpc3QubGVuZ3RoID0gbGFzdEluZGV4O1xuXHRcdGlmKGVsKXtcblx0XHRcdHZhciBkb2MgPSBlbC5vd25lckRvY3VtZW50O1xuXHRcdFx0aWYoZG9jKXtcblx0XHRcdFx0X29uUmVtb3ZlQXR0cmlidXRlKGRvYyxlbCxhdHRyKTtcblx0XHRcdFx0YXR0ci5vd25lckVsZW1lbnQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fWVsc2V7XG5cdFx0dGhyb3cgRE9NRXhjZXB0aW9uKE5PVF9GT1VORF9FUlIsbmV3IEVycm9yKGVsLnRhZ05hbWUrJ0AnK2F0dHIpKVxuXHR9XG59XG5OYW1lZE5vZGVNYXAucHJvdG90eXBlID0ge1xuXHRsZW5ndGg6MCxcblx0aXRlbTpOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSxcblx0Z2V0TmFtZWRJdGVtOiBmdW5jdGlvbihrZXkpIHtcbi8vXHRcdGlmKGtleS5pbmRleE9mKCc6Jyk+MCB8fCBrZXkgPT0gJ3htbG5zJyl7XG4vL1x0XHRcdHJldHVybiBudWxsO1xuLy9cdFx0fVxuXHRcdC8vY29uc29sZS5sb2coKVxuXHRcdHZhciBpID0gdGhpcy5sZW5ndGg7XG5cdFx0d2hpbGUoaS0tKXtcblx0XHRcdHZhciBhdHRyID0gdGhpc1tpXTtcblx0XHRcdC8vY29uc29sZS5sb2coYXR0ci5ub2RlTmFtZSxrZXkpXG5cdFx0XHRpZihhdHRyLm5vZGVOYW1lID09IGtleSl7XG5cdFx0XHRcdHJldHVybiBhdHRyO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0c2V0TmFtZWRJdGVtOiBmdW5jdGlvbihhdHRyKSB7XG5cdFx0dmFyIGVsID0gYXR0ci5vd25lckVsZW1lbnQ7XG5cdFx0aWYoZWwgJiYgZWwhPXRoaXMuX293bmVyRWxlbWVudCl7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKElOVVNFX0FUVFJJQlVURV9FUlIpO1xuXHRcdH1cblx0XHR2YXIgb2xkQXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtKGF0dHIubm9kZU5hbWUpO1xuXHRcdF9hZGROYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cixvbGRBdHRyKTtcblx0XHRyZXR1cm4gb2xkQXR0cjtcblx0fSxcblx0LyogcmV0dXJucyBOb2RlICovXG5cdHNldE5hbWVkSXRlbU5TOiBmdW5jdGlvbihhdHRyKSB7Ly8gcmFpc2VzOiBXUk9OR19ET0NVTUVOVF9FUlIsTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSLElOVVNFX0FUVFJJQlVURV9FUlJcblx0XHR2YXIgZWwgPSBhdHRyLm93bmVyRWxlbWVudCwgb2xkQXR0cjtcblx0XHRpZihlbCAmJiBlbCE9dGhpcy5fb3duZXJFbGVtZW50KXtcblx0XHRcdHRocm93IG5ldyBET01FeGNlcHRpb24oSU5VU0VfQVRUUklCVVRFX0VSUik7XG5cdFx0fVxuXHRcdG9sZEF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbU5TKGF0dHIubmFtZXNwYWNlVVJJLGF0dHIubG9jYWxOYW1lKTtcblx0XHRfYWRkTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIsb2xkQXR0cik7XG5cdFx0cmV0dXJuIG9sZEF0dHI7XG5cdH0sXG5cblx0LyogcmV0dXJucyBOb2RlICovXG5cdHJlbW92ZU5hbWVkSXRlbTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbShrZXkpO1xuXHRcdF9yZW1vdmVOYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cik7XG5cdFx0cmV0dXJuIGF0dHI7XG5cdFx0XG5cdFx0XG5cdH0sLy8gcmFpc2VzOiBOT1RfRk9VTkRfRVJSLE5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUlxuXHRcblx0Ly9mb3IgbGV2ZWwyXG5cdHJlbW92ZU5hbWVkSXRlbU5TOmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSxsb2NhbE5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXROYW1lZEl0ZW1OUyhuYW1lc3BhY2VVUkksbG9jYWxOYW1lKTtcblx0XHRfcmVtb3ZlTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIpO1xuXHRcdHJldHVybiBhdHRyO1xuXHR9LFxuXHRnZXROYW1lZEl0ZW1OUzogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpIHtcblx0XHR2YXIgaSA9IHRoaXMubGVuZ3RoO1xuXHRcdHdoaWxlKGktLSl7XG5cdFx0XHR2YXIgbm9kZSA9IHRoaXNbaV07XG5cdFx0XHRpZihub2RlLmxvY2FsTmFtZSA9PSBsb2NhbE5hbWUgJiYgbm9kZS5uYW1lc3BhY2VVUkkgPT0gbmFtZXNwYWNlVVJJKXtcblx0XHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xuLyoqXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1ET00tTGV2ZWwtMS9sZXZlbC1vbmUtY29yZS5odG1sI0lELTEwMjE2MTQ5MFxuICovXG5mdW5jdGlvbiBET01JbXBsZW1lbnRhdGlvbigvKiBPYmplY3QgKi8gZmVhdHVyZXMpIHtcblx0dGhpcy5fZmVhdHVyZXMgPSB7fTtcblx0aWYgKGZlYXR1cmVzKSB7XG5cdFx0Zm9yICh2YXIgZmVhdHVyZSBpbiBmZWF0dXJlcykge1xuXHRcdFx0IHRoaXMuX2ZlYXR1cmVzID0gZmVhdHVyZXNbZmVhdHVyZV07XG5cdFx0fVxuXHR9XG59O1xuXG5ET01JbXBsZW1lbnRhdGlvbi5wcm90b3R5cGUgPSB7XG5cdGhhc0ZlYXR1cmU6IGZ1bmN0aW9uKC8qIHN0cmluZyAqLyBmZWF0dXJlLCAvKiBzdHJpbmcgKi8gdmVyc2lvbikge1xuXHRcdHZhciB2ZXJzaW9ucyA9IHRoaXMuX2ZlYXR1cmVzW2ZlYXR1cmUudG9Mb3dlckNhc2UoKV07XG5cdFx0aWYgKHZlcnNpb25zICYmICghdmVyc2lvbiB8fCB2ZXJzaW9uIGluIHZlcnNpb25zKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZURvY3VtZW50OmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgIHF1YWxpZmllZE5hbWUsIGRvY3R5cGUpey8vIHJhaXNlczpJTlZBTElEX0NIQVJBQ1RFUl9FUlIsTkFNRVNQQUNFX0VSUixXUk9OR19ET0NVTUVOVF9FUlJcblx0XHR2YXIgZG9jID0gbmV3IERvY3VtZW50KCk7XG5cdFx0ZG9jLmltcGxlbWVudGF0aW9uID0gdGhpcztcblx0XHRkb2MuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdGRvYy5kb2N0eXBlID0gZG9jdHlwZTtcblx0XHRpZihkb2N0eXBlKXtcblx0XHRcdGRvYy5hcHBlbmRDaGlsZChkb2N0eXBlKTtcblx0XHR9XG5cdFx0aWYocXVhbGlmaWVkTmFtZSl7XG5cdFx0XHR2YXIgcm9vdCA9IGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLHF1YWxpZmllZE5hbWUpO1xuXHRcdFx0ZG9jLmFwcGVuZENoaWxkKHJvb3QpO1xuXHRcdH1cblx0XHRyZXR1cm4gZG9jO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVEb2N1bWVudFR5cGU6ZnVuY3Rpb24ocXVhbGlmaWVkTmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKXsvLyByYWlzZXM6SU5WQUxJRF9DSEFSQUNURVJfRVJSLE5BTUVTUEFDRV9FUlJcblx0XHR2YXIgbm9kZSA9IG5ldyBEb2N1bWVudFR5cGUoKTtcblx0XHRub2RlLm5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUucHVibGljSWQgPSBwdWJsaWNJZDtcblx0XHRub2RlLnN5c3RlbUlkID0gc3lzdGVtSWQ7XG5cdFx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0XHQvL3JlYWRvbmx5IGF0dHJpYnV0ZSBET01TdHJpbmcgICAgICAgIGludGVybmFsU3Vic2V0O1xuXHRcdFxuXHRcdC8vVE9ETzouLlxuXHRcdC8vICByZWFkb25seSBhdHRyaWJ1dGUgTmFtZWROb2RlTWFwICAgICBlbnRpdGllcztcblx0XHQvLyAgcmVhZG9ubHkgYXR0cmlidXRlIE5hbWVkTm9kZU1hcCAgICAgbm90YXRpb25zO1xuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG5cbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAwL1JFQy1ET00tTGV2ZWwtMi1Db3JlLTIwMDAxMTEzL2NvcmUuaHRtbCNJRC0xOTUwNjQxMjQ3XG4gKi9cblxuZnVuY3Rpb24gTm9kZSgpIHtcbn07XG5cbk5vZGUucHJvdG90eXBlID0ge1xuXHRmaXJzdENoaWxkIDogbnVsbCxcblx0bGFzdENoaWxkIDogbnVsbCxcblx0cHJldmlvdXNTaWJsaW5nIDogbnVsbCxcblx0bmV4dFNpYmxpbmcgOiBudWxsLFxuXHRhdHRyaWJ1dGVzIDogbnVsbCxcblx0cGFyZW50Tm9kZSA6IG51bGwsXG5cdGNoaWxkTm9kZXMgOiBudWxsLFxuXHRvd25lckRvY3VtZW50IDogbnVsbCxcblx0bm9kZVZhbHVlIDogbnVsbCxcblx0bmFtZXNwYWNlVVJJIDogbnVsbCxcblx0cHJlZml4IDogbnVsbCxcblx0bG9jYWxOYW1lIDogbnVsbCxcblx0Ly8gTW9kaWZpZWQgaW4gRE9NIExldmVsIDI6XG5cdGluc2VydEJlZm9yZTpmdW5jdGlvbihuZXdDaGlsZCwgcmVmQ2hpbGQpey8vcmFpc2VzIFxuXHRcdHJldHVybiBfaW5zZXJ0QmVmb3JlKHRoaXMsbmV3Q2hpbGQscmVmQ2hpbGQpO1xuXHR9LFxuXHRyZXBsYWNlQ2hpbGQ6ZnVuY3Rpb24obmV3Q2hpbGQsIG9sZENoaWxkKXsvL3JhaXNlcyBcblx0XHR0aGlzLmluc2VydEJlZm9yZShuZXdDaGlsZCxvbGRDaGlsZCk7XG5cdFx0aWYob2xkQ2hpbGQpe1xuXHRcdFx0dGhpcy5yZW1vdmVDaGlsZChvbGRDaGlsZCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVDaGlsZDpmdW5jdGlvbihvbGRDaGlsZCl7XG5cdFx0cmV0dXJuIF9yZW1vdmVDaGlsZCh0aGlzLG9sZENoaWxkKTtcblx0fSxcblx0YXBwZW5kQ2hpbGQ6ZnVuY3Rpb24obmV3Q2hpbGQpe1xuXHRcdHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuZXdDaGlsZCxudWxsKTtcblx0fSxcblx0aGFzQ2hpbGROb2RlczpmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmZpcnN0Q2hpbGQgIT0gbnVsbDtcblx0fSxcblx0Y2xvbmVOb2RlOmZ1bmN0aW9uKGRlZXApe1xuXHRcdHJldHVybiBjbG9uZU5vZGUodGhpcy5vd25lckRvY3VtZW50fHx0aGlzLHRoaXMsZGVlcCk7XG5cdH0sXG5cdC8vIE1vZGlmaWVkIGluIERPTSBMZXZlbCAyOlxuXHRub3JtYWxpemU6ZnVuY3Rpb24oKXtcblx0XHR2YXIgY2hpbGQgPSB0aGlzLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0dmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdGlmKG5leHQgJiYgbmV4dC5ub2RlVHlwZSA9PSBURVhUX05PREUgJiYgY2hpbGQubm9kZVR5cGUgPT0gVEVYVF9OT0RFKXtcblx0XHRcdFx0dGhpcy5yZW1vdmVDaGlsZChuZXh0KTtcblx0XHRcdFx0Y2hpbGQuYXBwZW5kRGF0YShuZXh0LmRhdGEpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGNoaWxkLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRjaGlsZCA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuICBcdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGlzU3VwcG9ydGVkOmZ1bmN0aW9uKGZlYXR1cmUsIHZlcnNpb24pe1xuXHRcdHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZShmZWF0dXJlLHZlcnNpb24pO1xuXHR9LFxuICAgIC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG4gICAgaGFzQXR0cmlidXRlczpmdW5jdGlvbigpe1xuICAgIFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5sZW5ndGg+MDtcbiAgICB9LFxuICAgIGxvb2t1cFByZWZpeDpmdW5jdGlvbihuYW1lc3BhY2VVUkkpe1xuICAgIFx0dmFyIGVsID0gdGhpcztcbiAgICBcdHdoaWxlKGVsKXtcbiAgICBcdFx0dmFyIG1hcCA9IGVsLl9uc01hcDtcbiAgICBcdFx0Ly9jb25zb2xlLmRpcihtYXApXG4gICAgXHRcdGlmKG1hcCl7XG4gICAgXHRcdFx0Zm9yKHZhciBuIGluIG1hcCl7XG4gICAgXHRcdFx0XHRpZihtYXBbbl0gPT0gbmFtZXNwYWNlVVJJKXtcbiAgICBcdFx0XHRcdFx0cmV0dXJuIG47XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fVxuICAgIFx0XHR9XG4gICAgXHRcdGVsID0gZWwubm9kZVR5cGUgPT0gQVRUUklCVVRFX05PREU/ZWwub3duZXJEb2N1bWVudCA6IGVsLnBhcmVudE5vZGU7XG4gICAgXHR9XG4gICAgXHRyZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDM6XG4gICAgbG9va3VwTmFtZXNwYWNlVVJJOmZ1bmN0aW9uKHByZWZpeCl7XG4gICAgXHR2YXIgZWwgPSB0aGlzO1xuICAgIFx0d2hpbGUoZWwpe1xuICAgIFx0XHR2YXIgbWFwID0gZWwuX25zTWFwO1xuICAgIFx0XHQvL2NvbnNvbGUuZGlyKG1hcClcbiAgICBcdFx0aWYobWFwKXtcbiAgICBcdFx0XHRpZihwcmVmaXggaW4gbWFwKXtcbiAgICBcdFx0XHRcdHJldHVybiBtYXBbcHJlZml4XSA7XG4gICAgXHRcdFx0fVxuICAgIFx0XHR9XG4gICAgXHRcdGVsID0gZWwubm9kZVR5cGUgPT0gQVRUUklCVVRFX05PREU/ZWwub3duZXJEb2N1bWVudCA6IGVsLnBhcmVudE5vZGU7XG4gICAgXHR9XG4gICAgXHRyZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDM6XG4gICAgaXNEZWZhdWx0TmFtZXNwYWNlOmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSl7XG4gICAgXHR2YXIgcHJlZml4ID0gdGhpcy5sb29rdXBQcmVmaXgobmFtZXNwYWNlVVJJKTtcbiAgICBcdHJldHVybiBwcmVmaXggPT0gbnVsbDtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIF94bWxFbmNvZGVyKGMpe1xuXHRyZXR1cm4gYyA9PSAnPCcgJiYgJyZsdDsnIHx8XG4gICAgICAgICBjID09ICc+JyAmJiAnJmd0OycgfHxcbiAgICAgICAgIGMgPT0gJyYnICYmICcmYW1wOycgfHxcbiAgICAgICAgIGMgPT0gJ1wiJyAmJiAnJnF1b3Q7JyB8fFxuICAgICAgICAgJyYjJytjLmNoYXJDb2RlQXQoKSsnOydcbn1cblxuXG5jb3B5KE5vZGVUeXBlLE5vZGUpO1xuY29weShOb2RlVHlwZSxOb2RlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQHBhcmFtIGNhbGxiYWNrIHJldHVybiB0cnVlIGZvciBjb250aW51ZSxmYWxzZSBmb3IgYnJlYWtcbiAqIEByZXR1cm4gYm9vbGVhbiB0cnVlOiBicmVhayB2aXNpdDtcbiAqL1xuZnVuY3Rpb24gX3Zpc2l0Tm9kZShub2RlLGNhbGxiYWNrKXtcblx0aWYoY2FsbGJhY2sobm9kZSkpe1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGlmKG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQpe1xuXHRcdGRve1xuXHRcdFx0aWYoX3Zpc2l0Tm9kZShub2RlLGNhbGxiYWNrKSl7cmV0dXJuIHRydWV9XG4gICAgICAgIH13aGlsZShub2RlPW5vZGUubmV4dFNpYmxpbmcpXG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gRG9jdW1lbnQoKXtcbn1cbmZ1bmN0aW9uIF9vbkFkZEF0dHJpYnV0ZShkb2MsZWwsbmV3QXR0cil7XG5cdGRvYyAmJiBkb2MuX2luYysrO1xuXHR2YXIgbnMgPSBuZXdBdHRyLm5hbWVzcGFjZVVSSSA7XG5cdGlmKG5zID09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycpe1xuXHRcdC8vdXBkYXRlIG5hbWVzcGFjZVxuXHRcdGVsLl9uc01hcFtuZXdBdHRyLnByZWZpeD9uZXdBdHRyLmxvY2FsTmFtZTonJ10gPSBuZXdBdHRyLnZhbHVlXG5cdH1cbn1cbmZ1bmN0aW9uIF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsbmV3QXR0cixyZW1vdmUpe1xuXHRkb2MgJiYgZG9jLl9pbmMrKztcblx0dmFyIG5zID0gbmV3QXR0ci5uYW1lc3BhY2VVUkkgO1xuXHRpZihucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKXtcblx0XHQvL3VwZGF0ZSBuYW1lc3BhY2Vcblx0XHRkZWxldGUgZWwuX25zTWFwW25ld0F0dHIucHJlZml4P25ld0F0dHIubG9jYWxOYW1lOicnXVxuXHR9XG59XG5mdW5jdGlvbiBfb25VcGRhdGVDaGlsZChkb2MsZWwsbmV3Q2hpbGQpe1xuXHRpZihkb2MgJiYgZG9jLl9pbmMpe1xuXHRcdGRvYy5faW5jKys7XG5cdFx0Ly91cGRhdGUgY2hpbGROb2Rlc1xuXHRcdHZhciBjcyA9IGVsLmNoaWxkTm9kZXM7XG5cdFx0aWYobmV3Q2hpbGQpe1xuXHRcdFx0Y3NbY3MubGVuZ3RoKytdID0gbmV3Q2hpbGQ7XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2NvbnNvbGUubG9nKDEpXG5cdFx0XHR2YXIgY2hpbGQgPSBlbC5maXJzdENoaWxkO1xuXHRcdFx0dmFyIGkgPSAwO1xuXHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRjc1tpKytdID0gY2hpbGQ7XG5cdFx0XHRcdGNoaWxkID1jaGlsZC5uZXh0U2libGluZztcblx0XHRcdH1cblx0XHRcdGNzLmxlbmd0aCA9IGk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogYXR0cmlidXRlcztcbiAqIGNoaWxkcmVuO1xuICogXG4gKiB3cml0ZWFibGUgcHJvcGVydGllczpcbiAqIG5vZGVWYWx1ZSxBdHRyOnZhbHVlLENoYXJhY3RlckRhdGE6ZGF0YVxuICogcHJlZml4XG4gKi9cbmZ1bmN0aW9uIF9yZW1vdmVDaGlsZChwYXJlbnROb2RlLGNoaWxkKXtcblx0dmFyIHByZXZpb3VzID0gY2hpbGQucHJldmlvdXNTaWJsaW5nO1xuXHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRpZihwcmV2aW91cyl7XG5cdFx0cHJldmlvdXMubmV4dFNpYmxpbmcgPSBuZXh0O1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXh0XG5cdH1cblx0aWYobmV4dCl7XG5cdFx0bmV4dC5wcmV2aW91c1NpYmxpbmcgPSBwcmV2aW91cztcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBwcmV2aW91cztcblx0fVxuXHRfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQscGFyZW50Tm9kZSk7XG5cdHJldHVybiBjaGlsZDtcbn1cbi8qKlxuICogcHJlZm9ybWFuY2Uga2V5KHJlZkNoaWxkID09IG51bGwpXG4gKi9cbmZ1bmN0aW9uIF9pbnNlcnRCZWZvcmUocGFyZW50Tm9kZSxuZXdDaGlsZCxuZXh0Q2hpbGQpe1xuXHR2YXIgY3AgPSBuZXdDaGlsZC5wYXJlbnROb2RlO1xuXHRpZihjcCl7XG5cdFx0Y3AucmVtb3ZlQ2hpbGQobmV3Q2hpbGQpOy8vcmVtb3ZlIGFuZCB1cGRhdGVcblx0fVxuXHRpZihuZXdDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0dmFyIG5ld0ZpcnN0ID0gbmV3Q2hpbGQuZmlyc3RDaGlsZDtcblx0XHRpZiAobmV3Rmlyc3QgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG5ld0NoaWxkO1xuXHRcdH1cblx0XHR2YXIgbmV3TGFzdCA9IG5ld0NoaWxkLmxhc3RDaGlsZDtcblx0fWVsc2V7XG5cdFx0bmV3Rmlyc3QgPSBuZXdMYXN0ID0gbmV3Q2hpbGQ7XG5cdH1cblx0dmFyIHByZSA9IG5leHRDaGlsZCA/IG5leHRDaGlsZC5wcmV2aW91c1NpYmxpbmcgOiBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblxuXHRuZXdGaXJzdC5wcmV2aW91c1NpYmxpbmcgPSBwcmU7XG5cdG5ld0xhc3QubmV4dFNpYmxpbmcgPSBuZXh0Q2hpbGQ7XG5cdFxuXHRcblx0aWYocHJlKXtcblx0XHRwcmUubmV4dFNpYmxpbmcgPSBuZXdGaXJzdDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV3Rmlyc3Q7XG5cdH1cblx0aWYobmV4dENoaWxkID09IG51bGwpe1xuXHRcdHBhcmVudE5vZGUubGFzdENoaWxkID0gbmV3TGFzdDtcblx0fWVsc2V7XG5cdFx0bmV4dENoaWxkLnByZXZpb3VzU2libGluZyA9IG5ld0xhc3Q7XG5cdH1cblx0ZG97XG5cdFx0bmV3Rmlyc3QucGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG5cdH13aGlsZShuZXdGaXJzdCAhPT0gbmV3TGFzdCAmJiAobmV3Rmlyc3Q9IG5ld0ZpcnN0Lm5leHRTaWJsaW5nKSlcblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50fHxwYXJlbnROb2RlLHBhcmVudE5vZGUpO1xuXHQvL2NvbnNvbGUubG9nKHBhcmVudE5vZGUubGFzdENoaWxkLm5leHRTaWJsaW5nID09IG51bGwpXG5cdGlmIChuZXdDaGlsZC5ub2RlVHlwZSA9PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG5cdFx0bmV3Q2hpbGQuZmlyc3RDaGlsZCA9IG5ld0NoaWxkLmxhc3RDaGlsZCA9IG51bGw7XG5cdH1cblx0cmV0dXJuIG5ld0NoaWxkO1xufVxuZnVuY3Rpb24gX2FwcGVuZFNpbmdsZUNoaWxkKHBhcmVudE5vZGUsbmV3Q2hpbGQpe1xuXHR2YXIgY3AgPSBuZXdDaGlsZC5wYXJlbnROb2RlO1xuXHRpZihjcCl7XG5cdFx0dmFyIHByZSA9IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXHRcdGNwLnJlbW92ZUNoaWxkKG5ld0NoaWxkKTsvL3JlbW92ZSBhbmQgdXBkYXRlXG5cdFx0dmFyIHByZSA9IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXHR9XG5cdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0bmV3Q2hpbGQucGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG5cdG5ld0NoaWxkLnByZXZpb3VzU2libGluZyA9IHByZTtcblx0bmV3Q2hpbGQubmV4dFNpYmxpbmcgPSBudWxsO1xuXHRpZihwcmUpe1xuXHRcdHByZS5uZXh0U2libGluZyA9IG5ld0NoaWxkO1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZDtcblx0fVxuXHRwYXJlbnROb2RlLmxhc3RDaGlsZCA9IG5ld0NoaWxkO1xuXHRfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQscGFyZW50Tm9kZSxuZXdDaGlsZCk7XG5cdHJldHVybiBuZXdDaGlsZDtcblx0Ly9jb25zb2xlLmxvZyhcIl9fYWFcIixwYXJlbnROb2RlLmxhc3RDaGlsZC5uZXh0U2libGluZyA9PSBudWxsKVxufVxuRG9jdW1lbnQucHJvdG90eXBlID0ge1xuXHQvL2ltcGxlbWVudGF0aW9uIDogbnVsbCxcblx0bm9kZU5hbWUgOiAgJyNkb2N1bWVudCcsXG5cdG5vZGVUeXBlIDogIERPQ1VNRU5UX05PREUsXG5cdGRvY3R5cGUgOiAgbnVsbCxcblx0ZG9jdW1lbnRFbGVtZW50IDogIG51bGwsXG5cdF9pbmMgOiAxLFxuXHRcblx0aW5zZXJ0QmVmb3JlIDogIGZ1bmN0aW9uKG5ld0NoaWxkLCByZWZDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0XHR2YXIgY2hpbGQgPSBuZXdDaGlsZC5maXJzdENoaWxkO1xuXHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR0aGlzLmluc2VydEJlZm9yZShjaGlsZCxyZWZDaGlsZCk7XG5cdFx0XHRcdGNoaWxkID0gbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXdDaGlsZDtcblx0XHR9XG5cdFx0aWYodGhpcy5kb2N1bWVudEVsZW1lbnQgPT0gbnVsbCAmJiBuZXdDaGlsZC5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUpe1xuXHRcdFx0dGhpcy5kb2N1bWVudEVsZW1lbnQgPSBuZXdDaGlsZDtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIF9pbnNlcnRCZWZvcmUodGhpcyxuZXdDaGlsZCxyZWZDaGlsZCksKG5ld0NoaWxkLm93bmVyRG9jdW1lbnQgPSB0aGlzKSxuZXdDaGlsZDtcblx0fSxcblx0cmVtb3ZlQ2hpbGQgOiAgZnVuY3Rpb24ob2xkQ2hpbGQpe1xuXHRcdGlmKHRoaXMuZG9jdW1lbnRFbGVtZW50ID09IG9sZENoaWxkKXtcblx0XHRcdHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIF9yZW1vdmVDaGlsZCh0aGlzLG9sZENoaWxkKTtcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0aW1wb3J0Tm9kZSA6IGZ1bmN0aW9uKGltcG9ydGVkTm9kZSxkZWVwKXtcblx0XHRyZXR1cm4gaW1wb3J0Tm9kZSh0aGlzLGltcG9ydGVkTm9kZSxkZWVwKTtcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Z2V0RWxlbWVudEJ5SWQgOlx0ZnVuY3Rpb24oaWQpe1xuXHRcdHZhciBydHYgPSBudWxsO1xuXHRcdF92aXNpdE5vZGUodGhpcy5kb2N1bWVudEVsZW1lbnQsZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZihub2RlLm5vZGVUeXBlID09IEVMRU1FTlRfTk9ERSl7XG5cdFx0XHRcdGlmKG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpID09IGlkKXtcblx0XHRcdFx0XHRydHYgPSBub2RlO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRyZXR1cm4gcnR2O1xuXHR9LFxuXHRcblx0Ly9kb2N1bWVudCBmYWN0b3J5IG1ldGhvZDpcblx0Y3JlYXRlRWxlbWVudCA6XHRmdW5jdGlvbih0YWdOYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBFbGVtZW50KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLm5vZGVOYW1lID0gdGFnTmFtZTtcblx0XHRub2RlLnRhZ05hbWUgPSB0YWdOYW1lO1xuXHRcdG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdHZhciBhdHRyc1x0PSBub2RlLmF0dHJpYnV0ZXMgPSBuZXcgTmFtZWROb2RlTWFwKCk7XG5cdFx0YXR0cnMuX293bmVyRWxlbWVudCA9IG5vZGU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZURvY3VtZW50RnJhZ21lbnQgOlx0ZnVuY3Rpb24oKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlVGV4dE5vZGUgOlx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgVGV4dCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5hcHBlbmREYXRhKGRhdGEpXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZUNvbW1lbnQgOlx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQ29tbWVudCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5hcHBlbmREYXRhKGRhdGEpXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZUNEQVRBU2VjdGlvbiA6XHRmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBDREFUQVNlY3Rpb24oKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuYXBwZW5kRGF0YShkYXRhKVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24gOlx0ZnVuY3Rpb24odGFyZ2V0LGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS50YWdOYW1lID0gbm9kZS50YXJnZXQgPSB0YXJnZXQ7XG5cdFx0bm9kZS5ub2RlVmFsdWU9IG5vZGUuZGF0YSA9IGRhdGE7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZUF0dHJpYnV0ZSA6XHRmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBBdHRyKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50XHQ9IHRoaXM7XG5cdFx0bm9kZS5uYW1lID0gbmFtZTtcblx0XHRub2RlLm5vZGVOYW1lXHQ9IG5hbWU7XG5cdFx0bm9kZS5sb2NhbE5hbWUgPSBuYW1lO1xuXHRcdG5vZGUuc3BlY2lmaWVkID0gdHJ1ZTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlRW50aXR5UmVmZXJlbmNlIDpcdGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEVudGl0eVJlZmVyZW5jZSgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudFx0PSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWVcdD0gbmFtZTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlRWxlbWVudE5TIDpcdGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSxxdWFsaWZpZWROYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBFbGVtZW50KCk7XG5cdFx0dmFyIHBsID0gcXVhbGlmaWVkTmFtZS5zcGxpdCgnOicpO1xuXHRcdHZhciBhdHRyc1x0PSBub2RlLmF0dHJpYnV0ZXMgPSBuZXcgTmFtZWROb2RlTWFwKCk7XG5cdFx0bm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLm5vZGVOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLnRhZ05hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUubmFtZXNwYWNlVVJJID0gbmFtZXNwYWNlVVJJO1xuXHRcdGlmKHBsLmxlbmd0aCA9PSAyKXtcblx0XHRcdG5vZGUucHJlZml4ID0gcGxbMF07XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHBsWzFdO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly9lbC5wcmVmaXggPSBudWxsO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdH1cblx0XHRhdHRycy5fb3duZXJFbGVtZW50ID0gbm9kZTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlQXR0cmlidXRlTlMgOlx0ZnVuY3Rpb24obmFtZXNwYWNlVVJJLHF1YWxpZmllZE5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEF0dHIoKTtcblx0XHR2YXIgcGwgPSBxdWFsaWZpZWROYW1lLnNwbGl0KCc6Jyk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLm5vZGVOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUubmFtZXNwYWNlVVJJID0gbmFtZXNwYWNlVVJJO1xuXHRcdG5vZGUuc3BlY2lmaWVkID0gdHJ1ZTtcblx0XHRpZihwbC5sZW5ndGggPT0gMil7XG5cdFx0XHRub2RlLnByZWZpeCA9IHBsWzBdO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBwbFsxXTtcblx0XHR9ZWxzZXtcblx0XHRcdC8vZWwucHJlZml4ID0gbnVsbDtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cbn07XG5fZXh0ZW5kcyhEb2N1bWVudCxOb2RlKTtcblxuXG5mdW5jdGlvbiBFbGVtZW50KCkge1xuXHR0aGlzLl9uc01hcCA9IHt9O1xufTtcbkVsZW1lbnQucHJvdG90eXBlID0ge1xuXHRub2RlVHlwZSA6IEVMRU1FTlRfTk9ERSxcblx0aGFzQXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKSE9bnVsbDtcblx0fSxcblx0Z2V0QXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGUobmFtZSk7XG5cdFx0cmV0dXJuIGF0dHIgJiYgYXR0ci52YWx1ZSB8fCAnJztcblx0fSxcblx0Z2V0QXR0cmlidXRlTm9kZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKG5hbWUpO1xuXHR9LFxuXHRzZXRBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5hbWUpO1xuXHRcdGF0dHIudmFsdWUgPSBhdHRyLm5vZGVWYWx1ZSA9IFwiXCIgKyB2YWx1ZTtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcblx0fSxcblx0cmVtb3ZlQXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGUobmFtZSlcblx0XHRhdHRyICYmIHRoaXMucmVtb3ZlQXR0cmlidXRlTm9kZShhdHRyKTtcblx0fSxcblx0XG5cdC8vZm91ciByZWFsIG9wZWFydGlvbiBtZXRob2Rcblx0YXBwZW5kQ2hpbGQ6ZnVuY3Rpb24obmV3Q2hpbGQpe1xuXHRcdGlmKG5ld0NoaWxkLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKXtcblx0XHRcdHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuZXdDaGlsZCxudWxsKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiBfYXBwZW5kU2luZ2xlQ2hpbGQodGhpcyxuZXdDaGlsZCk7XG5cdFx0fVxuXHR9LFxuXHRzZXRBdHRyaWJ1dGVOb2RlIDogZnVuY3Rpb24obmV3QXR0cil7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0obmV3QXR0cik7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5vZGVOUyA6IGZ1bmN0aW9uKG5ld0F0dHIpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtTlMobmV3QXR0cik7XG5cdH0sXG5cdHJlbW92ZUF0dHJpYnV0ZU5vZGUgOiBmdW5jdGlvbihvbGRBdHRyKXtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMgPT0gb2xkQXR0ci5vd25lckVsZW1lbnQpXG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0ob2xkQXR0ci5ub2RlTmFtZSk7XG5cdH0sXG5cdC8vZ2V0IHJlYWwgYXR0cmlidXRlIG5hbWUsYW5kIHJlbW92ZSBpdCBieSByZW1vdmVBdHRyaWJ1dGVOb2RlXG5cdHJlbW92ZUF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHZhciBvbGQgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSk7XG5cdFx0b2xkICYmIHRoaXMucmVtb3ZlQXR0cmlidXRlTm9kZShvbGQpO1xuXHR9LFxuXHRcblx0aGFzQXR0cmlidXRlTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlTm9kZU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKSE9bnVsbDtcblx0fSxcblx0Z2V0QXR0cmlidXRlTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSk7XG5cdFx0cmV0dXJuIGF0dHIgJiYgYXR0ci52YWx1ZSB8fCAnJztcblx0fSxcblx0c2V0QXR0cmlidXRlTlMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUsIHZhbHVlKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUpO1xuXHRcdGF0dHIudmFsdWUgPSBhdHRyLm5vZGVWYWx1ZSA9IFwiXCIgKyB2YWx1ZTtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcblx0fSxcblx0Z2V0QXR0cmlidXRlTm9kZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHR9LFxuXHRcblx0Z2V0RWxlbWVudHNCeVRhZ05hbWUgOiBmdW5jdGlvbih0YWdOYW1lKXtcblx0XHRyZXR1cm4gbmV3IExpdmVOb2RlTGlzdCh0aGlzLGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0dmFyIGxzID0gW107XG5cdFx0XHRfdmlzaXROb2RlKGJhc2UsZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRcdGlmKG5vZGUgIT09IGJhc2UgJiYgbm9kZS5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUgJiYgKHRhZ05hbWUgPT09ICcqJyB8fCBub2RlLnRhZ05hbWUgPT0gdGFnTmFtZSkpe1xuXHRcdFx0XHRcdGxzLnB1c2gobm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxzO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRFbGVtZW50c0J5VGFnTmFtZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiBuZXcgTGl2ZU5vZGVMaXN0KHRoaXMsZnVuY3Rpb24oYmFzZSl7XG5cdFx0XHR2YXIgbHMgPSBbXTtcblx0XHRcdF92aXNpdE5vZGUoYmFzZSxmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0aWYobm9kZSAhPT0gYmFzZSAmJiBub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgJiYgKG5hbWVzcGFjZVVSSSA9PT0gJyonIHx8IG5vZGUubmFtZXNwYWNlVVJJID09PSBuYW1lc3BhY2VVUkkpICYmIChsb2NhbE5hbWUgPT09ICcqJyB8fCBub2RlLmxvY2FsTmFtZSA9PSBsb2NhbE5hbWUpKXtcblx0XHRcdFx0XHRscy5wdXNoKG5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBscztcblx0XHRcdFxuXHRcdH0pO1xuXHR9XG59O1xuRG9jdW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gRWxlbWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWU7XG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUyA9IEVsZW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lTlM7XG5cblxuX2V4dGVuZHMoRWxlbWVudCxOb2RlKTtcbmZ1bmN0aW9uIEF0dHIoKSB7XG59O1xuQXR0ci5wcm90b3R5cGUubm9kZVR5cGUgPSBBVFRSSUJVVEVfTk9ERTtcbl9leHRlbmRzKEF0dHIsTm9kZSk7XG5cblxuZnVuY3Rpb24gQ2hhcmFjdGVyRGF0YSgpIHtcbn07XG5DaGFyYWN0ZXJEYXRhLnByb3RvdHlwZSA9IHtcblx0ZGF0YSA6ICcnLFxuXHRzdWJzdHJpbmdEYXRhIDogZnVuY3Rpb24ob2Zmc2V0LCBjb3VudCkge1xuXHRcdHJldHVybiB0aGlzLmRhdGEuc3Vic3RyaW5nKG9mZnNldCwgb2Zmc2V0K2NvdW50KTtcblx0fSxcblx0YXBwZW5kRGF0YTogZnVuY3Rpb24odGV4dCkge1xuXHRcdHRleHQgPSB0aGlzLmRhdGErdGV4dDtcblx0XHR0aGlzLm5vZGVWYWx1ZSA9IHRoaXMuZGF0YSA9IHRleHQ7XG5cdFx0dGhpcy5sZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblx0fSxcblx0aW5zZXJ0RGF0YTogZnVuY3Rpb24ob2Zmc2V0LHRleHQpIHtcblx0XHR0aGlzLnJlcGxhY2VEYXRhKG9mZnNldCwwLHRleHQpO1xuXHRcblx0fSxcblx0YXBwZW5kQ2hpbGQ6ZnVuY3Rpb24obmV3Q2hpbGQpe1xuXHRcdHRocm93IG5ldyBFcnJvcihFeGNlcHRpb25NZXNzYWdlW0hJRVJBUkNIWV9SRVFVRVNUX0VSUl0pXG5cdH0sXG5cdGRlbGV0ZURhdGE6IGZ1bmN0aW9uKG9mZnNldCwgY291bnQpIHtcblx0XHR0aGlzLnJlcGxhY2VEYXRhKG9mZnNldCxjb3VudCxcIlwiKTtcblx0fSxcblx0cmVwbGFjZURhdGE6IGZ1bmN0aW9uKG9mZnNldCwgY291bnQsIHRleHQpIHtcblx0XHR2YXIgc3RhcnQgPSB0aGlzLmRhdGEuc3Vic3RyaW5nKDAsb2Zmc2V0KTtcblx0XHR2YXIgZW5kID0gdGhpcy5kYXRhLnN1YnN0cmluZyhvZmZzZXQrY291bnQpO1xuXHRcdHRleHQgPSBzdGFydCArIHRleHQgKyBlbmQ7XG5cdFx0dGhpcy5ub2RlVmFsdWUgPSB0aGlzLmRhdGEgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdH1cbn1cbl9leHRlbmRzKENoYXJhY3RlckRhdGEsTm9kZSk7XG5mdW5jdGlvbiBUZXh0KCkge1xufTtcblRleHQucHJvdG90eXBlID0ge1xuXHRub2RlTmFtZSA6IFwiI3RleHRcIixcblx0bm9kZVR5cGUgOiBURVhUX05PREUsXG5cdHNwbGl0VGV4dCA6IGZ1bmN0aW9uKG9mZnNldCkge1xuXHRcdHZhciB0ZXh0ID0gdGhpcy5kYXRhO1xuXHRcdHZhciBuZXdUZXh0ID0gdGV4dC5zdWJzdHJpbmcob2Zmc2V0KTtcblx0XHR0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgb2Zmc2V0KTtcblx0XHR0aGlzLmRhdGEgPSB0aGlzLm5vZGVWYWx1ZSA9IHRleHQ7XG5cdFx0dGhpcy5sZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblx0XHR2YXIgbmV3Tm9kZSA9IHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuZXdUZXh0KTtcblx0XHRpZih0aGlzLnBhcmVudE5vZGUpe1xuXHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCB0aGlzLm5leHRTaWJsaW5nKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld05vZGU7XG5cdH1cbn1cbl9leHRlbmRzKFRleHQsQ2hhcmFjdGVyRGF0YSk7XG5mdW5jdGlvbiBDb21tZW50KCkge1xufTtcbkNvbW1lbnQucHJvdG90eXBlID0ge1xuXHRub2RlTmFtZSA6IFwiI2NvbW1lbnRcIixcblx0bm9kZVR5cGUgOiBDT01NRU5UX05PREVcbn1cbl9leHRlbmRzKENvbW1lbnQsQ2hhcmFjdGVyRGF0YSk7XG5cbmZ1bmN0aW9uIENEQVRBU2VjdGlvbigpIHtcbn07XG5DREFUQVNlY3Rpb24ucHJvdG90eXBlID0ge1xuXHRub2RlTmFtZSA6IFwiI2NkYXRhLXNlY3Rpb25cIixcblx0bm9kZVR5cGUgOiBDREFUQV9TRUNUSU9OX05PREVcbn1cbl9leHRlbmRzKENEQVRBU2VjdGlvbixDaGFyYWN0ZXJEYXRhKTtcblxuXG5mdW5jdGlvbiBEb2N1bWVudFR5cGUoKSB7XG59O1xuRG9jdW1lbnRUeXBlLnByb3RvdHlwZS5ub2RlVHlwZSA9IERPQ1VNRU5UX1RZUEVfTk9ERTtcbl9leHRlbmRzKERvY3VtZW50VHlwZSxOb2RlKTtcblxuZnVuY3Rpb24gTm90YXRpb24oKSB7XG59O1xuTm90YXRpb24ucHJvdG90eXBlLm5vZGVUeXBlID0gTk9UQVRJT05fTk9ERTtcbl9leHRlbmRzKE5vdGF0aW9uLE5vZGUpO1xuXG5mdW5jdGlvbiBFbnRpdHkoKSB7XG59O1xuRW50aXR5LnByb3RvdHlwZS5ub2RlVHlwZSA9IEVOVElUWV9OT0RFO1xuX2V4dGVuZHMoRW50aXR5LE5vZGUpO1xuXG5mdW5jdGlvbiBFbnRpdHlSZWZlcmVuY2UoKSB7XG59O1xuRW50aXR5UmVmZXJlbmNlLnByb3RvdHlwZS5ub2RlVHlwZSA9IEVOVElUWV9SRUZFUkVOQ0VfTk9ERTtcbl9leHRlbmRzKEVudGl0eVJlZmVyZW5jZSxOb2RlKTtcblxuZnVuY3Rpb24gRG9jdW1lbnRGcmFnbWVudCgpIHtcbn07XG5Eb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5ub2RlTmFtZSA9XHRcIiNkb2N1bWVudC1mcmFnbWVudFwiO1xuRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUubm9kZVR5cGUgPVx0RE9DVU1FTlRfRlJBR01FTlRfTk9ERTtcbl9leHRlbmRzKERvY3VtZW50RnJhZ21lbnQsTm9kZSk7XG5cblxuZnVuY3Rpb24gUHJvY2Vzc2luZ0luc3RydWN0aW9uKCkge1xufVxuUHJvY2Vzc2luZ0luc3RydWN0aW9uLnByb3RvdHlwZS5ub2RlVHlwZSA9IFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTtcbl9leHRlbmRzKFByb2Nlc3NpbmdJbnN0cnVjdGlvbixOb2RlKTtcbmZ1bmN0aW9uIFhNTFNlcmlhbGl6ZXIoKXt9XG5YTUxTZXJpYWxpemVyLnByb3RvdHlwZS5zZXJpYWxpemVUb1N0cmluZyA9IGZ1bmN0aW9uKG5vZGUsaXNIdG1sLG5vZGVGaWx0ZXIpe1xuXHRyZXR1cm4gbm9kZVNlcmlhbGl6ZVRvU3RyaW5nLmNhbGwobm9kZSxpc0h0bWwsbm9kZUZpbHRlcik7XG59XG5Ob2RlLnByb3RvdHlwZS50b1N0cmluZyA9IG5vZGVTZXJpYWxpemVUb1N0cmluZztcbmZ1bmN0aW9uIG5vZGVTZXJpYWxpemVUb1N0cmluZyhpc0h0bWwsbm9kZUZpbHRlcil7XG5cdHZhciBidWYgPSBbXTtcblx0dmFyIHJlZk5vZGUgPSB0aGlzLm5vZGVUeXBlID09IDk/dGhpcy5kb2N1bWVudEVsZW1lbnQ6dGhpcztcblx0dmFyIHByZWZpeCA9IHJlZk5vZGUucHJlZml4O1xuXHR2YXIgdXJpID0gcmVmTm9kZS5uYW1lc3BhY2VVUkk7XG5cdFxuXHRpZih1cmkgJiYgcHJlZml4ID09IG51bGwpe1xuXHRcdC8vY29uc29sZS5sb2cocHJlZml4KVxuXHRcdHZhciBwcmVmaXggPSByZWZOb2RlLmxvb2t1cFByZWZpeCh1cmkpO1xuXHRcdGlmKHByZWZpeCA9PSBudWxsKXtcblx0XHRcdC8vaXNIVE1MID0gdHJ1ZTtcblx0XHRcdHZhciB2aXNpYmxlTmFtZXNwYWNlcz1bXG5cdFx0XHR7bmFtZXNwYWNlOnVyaSxwcmVmaXg6bnVsbH1cblx0XHRcdC8ve25hbWVzcGFjZTp1cmkscHJlZml4OicnfVxuXHRcdFx0XVxuXHRcdH1cblx0fVxuXHRzZXJpYWxpemVUb1N0cmluZyh0aGlzLGJ1Zixpc0h0bWwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdC8vY29uc29sZS5sb2coJyMjIycsdGhpcy5ub2RlVHlwZSx1cmkscHJlZml4LGJ1Zi5qb2luKCcnKSlcblx0cmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn1cbmZ1bmN0aW9uIG5lZWROYW1lc3BhY2VEZWZpbmUobm9kZSxpc0hUTUwsIHZpc2libGVOYW1lc3BhY2VzKSB7XG5cdHZhciBwcmVmaXggPSBub2RlLnByZWZpeHx8Jyc7XG5cdHZhciB1cmkgPSBub2RlLm5hbWVzcGFjZVVSSTtcblx0aWYgKCFwcmVmaXggJiYgIXVyaSl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlmIChwcmVmaXggPT09IFwieG1sXCIgJiYgdXJpID09PSBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiIFxuXHRcdHx8IHVyaSA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0XG5cdHZhciBpID0gdmlzaWJsZU5hbWVzcGFjZXMubGVuZ3RoIFxuXHQvL2NvbnNvbGUubG9nKCdAQEBAJyxub2RlLnRhZ05hbWUscHJlZml4LHVyaSx2aXNpYmxlTmFtZXNwYWNlcylcblx0d2hpbGUgKGktLSkge1xuXHRcdHZhciBucyA9IHZpc2libGVOYW1lc3BhY2VzW2ldO1xuXHRcdC8vIGdldCBuYW1lc3BhY2UgcHJlZml4XG5cdFx0Ly9jb25zb2xlLmxvZyhub2RlLm5vZGVUeXBlLG5vZGUudGFnTmFtZSxucy5wcmVmaXgscHJlZml4KVxuXHRcdGlmIChucy5wcmVmaXggPT0gcHJlZml4KXtcblx0XHRcdHJldHVybiBucy5uYW1lc3BhY2UgIT0gdXJpO1xuXHRcdH1cblx0fVxuXHQvL2NvbnNvbGUubG9nKGlzSFRNTCx1cmkscHJlZml4PT0nJylcblx0Ly9pZihpc0hUTUwgJiYgcHJlZml4ID09bnVsbCAmJiB1cmkgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKXtcblx0Ly9cdHJldHVybiBmYWxzZTtcblx0Ly99XG5cdC8vbm9kZS5mbGFnID0gJzExMTExJ1xuXHQvL2NvbnNvbGUuZXJyb3IoMyx0cnVlLG5vZGUuZmxhZyxub2RlLnByZWZpeCxub2RlLm5hbWVzcGFjZVVSSSlcblx0cmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBzZXJpYWxpemVUb1N0cmluZyhub2RlLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyl7XG5cdGlmKG5vZGVGaWx0ZXIpe1xuXHRcdG5vZGUgPSBub2RlRmlsdGVyKG5vZGUpO1xuXHRcdGlmKG5vZGUpe1xuXHRcdFx0aWYodHlwZW9mIG5vZGUgPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRidWYucHVzaChub2RlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvL2J1Zi5zb3J0LmFwcGx5KGF0dHJzLCBhdHRyaWJ1dGVTb3J0ZXIpO1xuXHR9XG5cdHN3aXRjaChub2RlLm5vZGVUeXBlKXtcblx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0aWYgKCF2aXNpYmxlTmFtZXNwYWNlcykgdmlzaWJsZU5hbWVzcGFjZXMgPSBbXTtcblx0XHR2YXIgc3RhcnRWaXNpYmxlTmFtZXNwYWNlcyA9IHZpc2libGVOYW1lc3BhY2VzLmxlbmd0aDtcblx0XHR2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cdFx0dmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0dmFyIG5vZGVOYW1lID0gbm9kZS50YWdOYW1lO1xuXHRcdFxuXHRcdGlzSFRNTCA9ICAoaHRtbG5zID09PSBub2RlLm5hbWVzcGFjZVVSSSkgfHxpc0hUTUwgXG5cdFx0YnVmLnB1c2goJzwnLG5vZGVOYW1lKTtcblx0XHRcblx0XHRcblx0XHRcblx0XHRmb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0Ly8gYWRkIG5hbWVzcGFjZXMgZm9yIGF0dHJpYnV0ZXNcblx0XHRcdHZhciBhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdGlmIChhdHRyLnByZWZpeCA9PSAneG1sbnMnKSB7XG5cdFx0XHRcdHZpc2libGVOYW1lc3BhY2VzLnB1c2goeyBwcmVmaXg6IGF0dHIubG9jYWxOYW1lLCBuYW1lc3BhY2U6IGF0dHIudmFsdWUgfSk7XG5cdFx0XHR9ZWxzZSBpZihhdHRyLm5vZGVOYW1lID09ICd4bWxucycpe1xuXHRcdFx0XHR2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHsgcHJlZml4OiAnJywgbmFtZXNwYWNlOiBhdHRyLnZhbHVlIH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0dmFyIGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXHRcdFx0aWYgKG5lZWROYW1lc3BhY2VEZWZpbmUoYXR0cixpc0hUTUwsIHZpc2libGVOYW1lc3BhY2VzKSkge1xuXHRcdFx0XHR2YXIgcHJlZml4ID0gYXR0ci5wcmVmaXh8fCcnO1xuXHRcdFx0XHR2YXIgdXJpID0gYXR0ci5uYW1lc3BhY2VVUkk7XG5cdFx0XHRcdHZhciBucyA9IHByZWZpeCA/ICcgeG1sbnM6JyArIHByZWZpeCA6IFwiIHhtbG5zXCI7XG5cdFx0XHRcdGJ1Zi5wdXNoKG5zLCAnPVwiJyAsIHVyaSAsICdcIicpO1xuXHRcdFx0XHR2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHsgcHJlZml4OiBwcmVmaXgsIG5hbWVzcGFjZTp1cmkgfSk7XG5cdFx0XHR9XG5cdFx0XHRzZXJpYWxpemVUb1N0cmluZyhhdHRyLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdFx0fVxuXHRcdC8vIGFkZCBuYW1lc3BhY2UgZm9yIGN1cnJlbnQgbm9kZVx0XHRcblx0XHRpZiAobmVlZE5hbWVzcGFjZURlZmluZShub2RlLGlzSFRNTCwgdmlzaWJsZU5hbWVzcGFjZXMpKSB7XG5cdFx0XHR2YXIgcHJlZml4ID0gbm9kZS5wcmVmaXh8fCcnO1xuXHRcdFx0dmFyIHVyaSA9IG5vZGUubmFtZXNwYWNlVVJJO1xuXHRcdFx0dmFyIG5zID0gcHJlZml4ID8gJyB4bWxuczonICsgcHJlZml4IDogXCIgeG1sbnNcIjtcblx0XHRcdGJ1Zi5wdXNoKG5zLCAnPVwiJyAsIHVyaSAsICdcIicpO1xuXHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogcHJlZml4LCBuYW1lc3BhY2U6dXJpIH0pO1xuXHRcdH1cblx0XHRcblx0XHRpZihjaGlsZCB8fCBpc0hUTUwgJiYgIS9eKD86bWV0YXxsaW5rfGltZ3xicnxocnxpbnB1dCkkL2kudGVzdChub2RlTmFtZSkpe1xuXHRcdFx0YnVmLnB1c2goJz4nKTtcblx0XHRcdC8vaWYgaXMgY2RhdGEgY2hpbGQgbm9kZVxuXHRcdFx0aWYoaXNIVE1MICYmIC9ec2NyaXB0JC9pLnRlc3Qobm9kZU5hbWUpKXtcblx0XHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRcdGlmKGNoaWxkLmRhdGEpe1xuXHRcdFx0XHRcdFx0YnVmLnB1c2goY2hpbGQuZGF0YSk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRzZXJpYWxpemVUb1N0cmluZyhjaGlsZCxidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoY2hpbGQsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHRcdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRidWYucHVzaCgnPC8nLG5vZGVOYW1lLCc+Jyk7XG5cdFx0fWVsc2V7XG5cdFx0XHRidWYucHVzaCgnLz4nKTtcblx0XHR9XG5cdFx0Ly8gcmVtb3ZlIGFkZGVkIHZpc2libGUgbmFtZXNwYWNlc1xuXHRcdC8vdmlzaWJsZU5hbWVzcGFjZXMubGVuZ3RoID0gc3RhcnRWaXNpYmxlTmFtZXNwYWNlcztcblx0XHRyZXR1cm47XG5cdGNhc2UgRE9DVU1FTlRfTk9ERTpcblx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRzZXJpYWxpemVUb1N0cmluZyhjaGlsZCxidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdFx0cmV0dXJuO1xuXHRjYXNlIEFUVFJJQlVURV9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCgnICcsbm9kZS5uYW1lLCc9XCInLG5vZGUudmFsdWUucmVwbGFjZSgvWzwmXCJdL2csX3htbEVuY29kZXIpLCdcIicpO1xuXHRjYXNlIFRFWFRfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2gobm9kZS5kYXRhLnJlcGxhY2UoL1s8Jl0vZyxfeG1sRW5jb2RlcikpO1xuXHRjYXNlIENEQVRBX1NFQ1RJT05fTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goICc8IVtDREFUQVsnLG5vZGUuZGF0YSwnXV0+Jyk7XG5cdGNhc2UgQ09NTUVOVF9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggXCI8IS0tXCIsbm9kZS5kYXRhLFwiLS0+XCIpO1xuXHRjYXNlIERPQ1VNRU5UX1RZUEVfTk9ERTpcblx0XHR2YXIgcHViaWQgPSBub2RlLnB1YmxpY0lkO1xuXHRcdHZhciBzeXNpZCA9IG5vZGUuc3lzdGVtSWQ7XG5cdFx0YnVmLnB1c2goJzwhRE9DVFlQRSAnLG5vZGUubmFtZSk7XG5cdFx0aWYocHViaWQpe1xuXHRcdFx0YnVmLnB1c2goJyBQVUJMSUMgXCInLHB1YmlkKTtcblx0XHRcdGlmIChzeXNpZCAmJiBzeXNpZCE9Jy4nKSB7XG5cdFx0XHRcdGJ1Zi5wdXNoKCAnXCIgXCInLHN5c2lkKTtcblx0XHRcdH1cblx0XHRcdGJ1Zi5wdXNoKCdcIj4nKTtcblx0XHR9ZWxzZSBpZihzeXNpZCAmJiBzeXNpZCE9Jy4nKXtcblx0XHRcdGJ1Zi5wdXNoKCcgU1lTVEVNIFwiJyxzeXNpZCwnXCI+Jyk7XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgc3ViID0gbm9kZS5pbnRlcm5hbFN1YnNldDtcblx0XHRcdGlmKHN1Yil7XG5cdFx0XHRcdGJ1Zi5wdXNoKFwiIFtcIixzdWIsXCJdXCIpO1xuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goXCI+XCIpO1xuXHRcdH1cblx0XHRyZXR1cm47XG5cdGNhc2UgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggXCI8P1wiLG5vZGUudGFyZ2V0LFwiIFwiLG5vZGUuZGF0YSxcIj8+XCIpO1xuXHRjYXNlIEVOVElUWV9SRUZFUkVOQ0VfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goICcmJyxub2RlLm5vZGVOYW1lLCc7Jyk7XG5cdC8vY2FzZSBFTlRJVFlfTk9ERTpcblx0Ly9jYXNlIE5PVEFUSU9OX05PREU6XG5cdGRlZmF1bHQ6XG5cdFx0YnVmLnB1c2goJz8/Jyxub2RlLm5vZGVOYW1lKTtcblx0fVxufVxuZnVuY3Rpb24gaW1wb3J0Tm9kZShkb2Msbm9kZSxkZWVwKXtcblx0dmFyIG5vZGUyO1xuXHRzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcblx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0bm9kZTIgPSBub2RlLmNsb25lTm9kZShmYWxzZSk7XG5cdFx0bm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblx0XHQvL3ZhciBhdHRycyA9IG5vZGUyLmF0dHJpYnV0ZXM7XG5cdFx0Ly92YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xuXHRcdC8vZm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdC8vbm9kZTIuc2V0QXR0cmlidXRlTm9kZU5TKGltcG9ydE5vZGUoZG9jLGF0dHJzLml0ZW0oaSksZGVlcCkpO1xuXHRcdC8vfVxuXHRjYXNlIERPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG5cdFx0YnJlYWs7XG5cdGNhc2UgQVRUUklCVVRFX05PREU6XG5cdFx0ZGVlcCA9IHRydWU7XG5cdFx0YnJlYWs7XG5cdC8vY2FzZSBFTlRJVFlfUkVGRVJFTkNFX05PREU6XG5cdC8vY2FzZSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU6XG5cdC8vLy9jYXNlIFRFWFRfTk9ERTpcblx0Ly9jYXNlIENEQVRBX1NFQ1RJT05fTk9ERTpcblx0Ly9jYXNlIENPTU1FTlRfTk9ERTpcblx0Ly9cdGRlZXAgPSBmYWxzZTtcblx0Ly9cdGJyZWFrO1xuXHQvL2Nhc2UgRE9DVU1FTlRfTk9ERTpcblx0Ly9jYXNlIERPQ1VNRU5UX1RZUEVfTk9ERTpcblx0Ly9jYW5ub3QgYmUgaW1wb3J0ZWQuXG5cdC8vY2FzZSBFTlRJVFlfTk9ERTpcblx0Ly9jYXNlIE5PVEFUSU9OX05PREXvvJpcblx0Ly9jYW4gbm90IGhpdCBpbiBsZXZlbDNcblx0Ly9kZWZhdWx0OnRocm93IGU7XG5cdH1cblx0aWYoIW5vZGUyKXtcblx0XHRub2RlMiA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKTsvL2ZhbHNlXG5cdH1cblx0bm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblx0bm9kZTIucGFyZW50Tm9kZSA9IG51bGw7XG5cdGlmKGRlZXApe1xuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRub2RlMi5hcHBlbmRDaGlsZChpbXBvcnROb2RlKGRvYyxjaGlsZCxkZWVwKSk7XG5cdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZTI7XG59XG4vL1xuLy92YXIgX3JlbGF0aW9uTWFwID0ge2ZpcnN0Q2hpbGQ6MSxsYXN0Q2hpbGQ6MSxwcmV2aW91c1NpYmxpbmc6MSxuZXh0U2libGluZzoxLFxuLy9cdFx0XHRcdFx0YXR0cmlidXRlczoxLGNoaWxkTm9kZXM6MSxwYXJlbnROb2RlOjEsZG9jdW1lbnRFbGVtZW50OjEsZG9jdHlwZSx9O1xuZnVuY3Rpb24gY2xvbmVOb2RlKGRvYyxub2RlLGRlZXApe1xuXHR2YXIgbm9kZTIgPSBuZXcgbm9kZS5jb25zdHJ1Y3RvcigpO1xuXHRmb3IodmFyIG4gaW4gbm9kZSl7XG5cdFx0dmFyIHYgPSBub2RlW25dO1xuXHRcdGlmKHR5cGVvZiB2ICE9ICdvYmplY3QnICl7XG5cdFx0XHRpZih2ICE9IG5vZGUyW25dKXtcblx0XHRcdFx0bm9kZTJbbl0gPSB2O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZihub2RlLmNoaWxkTm9kZXMpe1xuXHRcdG5vZGUyLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0fVxuXHRub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuXHRzd2l0Y2ggKG5vZGUyLm5vZGVUeXBlKSB7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdHZhciBhdHRyc1x0PSBub2RlLmF0dHJpYnV0ZXM7XG5cdFx0dmFyIGF0dHJzMlx0PSBub2RlMi5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuXHRcdHZhciBsZW4gPSBhdHRycy5sZW5ndGhcblx0XHRhdHRyczIuX293bmVyRWxlbWVudCA9IG5vZGUyO1xuXHRcdGZvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHRub2RlMi5zZXRBdHRyaWJ1dGVOb2RlKGNsb25lTm9kZShkb2MsYXR0cnMuaXRlbShpKSx0cnVlKSk7XG5cdFx0fVxuXHRcdGJyZWFrOztcblx0Y2FzZSBBVFRSSUJVVEVfTk9ERTpcblx0XHRkZWVwID0gdHJ1ZTtcblx0fVxuXHRpZihkZWVwKXtcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0bm9kZTIuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlKGRvYyxjaGlsZCxkZWVwKSk7XG5cdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZTI7XG59XG5cbmZ1bmN0aW9uIF9fc2V0X18ob2JqZWN0LGtleSx2YWx1ZSl7XG5cdG9iamVjdFtrZXldID0gdmFsdWVcbn1cbi8vZG8gZHluYW1pY1xudHJ5e1xuXHRpZihPYmplY3QuZGVmaW5lUHJvcGVydHkpe1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXZlTm9kZUxpc3QucHJvdG90eXBlLCdsZW5ndGgnLHtcblx0XHRcdGdldDpmdW5jdGlvbigpe1xuXHRcdFx0XHRfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG5cdFx0XHRcdHJldHVybiB0aGlzLiQkbGVuZ3RoO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwndGV4dENvbnRlbnQnLHtcblx0XHRcdGdldDpmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gZ2V0VGV4dENvbnRlbnQodGhpcyk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OmZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRzd2l0Y2godGhpcy5ub2RlVHlwZSl7XG5cdFx0XHRcdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdFx0XHRjYXNlIERPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG5cdFx0XHRcdFx0d2hpbGUodGhpcy5maXJzdENoaWxkKXtcblx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5maXJzdENoaWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoZGF0YSB8fCBTdHJpbmcoZGF0YSkpe1xuXHRcdFx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvL1RPRE86XG5cdFx0XHRcdFx0dGhpcy5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gZGF0YTtcblx0XHRcdFx0XHR0aGlzLm5vZGVWYWx1ZSA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdFxuXHRcdGZ1bmN0aW9uIGdldFRleHRDb250ZW50KG5vZGUpe1xuXHRcdFx0c3dpdGNoKG5vZGUubm9kZVR5cGUpe1xuXHRcdFx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0XHRjYXNlIERPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG5cdFx0XHRcdHZhciBidWYgPSBbXTtcblx0XHRcdFx0bm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHRcdFx0d2hpbGUobm9kZSl7XG5cdFx0XHRcdFx0aWYobm9kZS5ub2RlVHlwZSE9PTcgJiYgbm9kZS5ub2RlVHlwZSAhPT04KXtcblx0XHRcdFx0XHRcdGJ1Zi5wdXNoKGdldFRleHRDb250ZW50KG5vZGUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGJ1Zi5qb2luKCcnKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBub2RlLm5vZGVWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X19zZXRfXyA9IGZ1bmN0aW9uKG9iamVjdCxrZXksdmFsdWUpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyh2YWx1ZSlcblx0XHRcdG9iamVjdFsnJCQnK2tleV0gPSB2YWx1ZVxuXHRcdH1cblx0fVxufWNhdGNoKGUpey8vaWU4XG59XG5cbi8vaWYodHlwZW9mIHJlcXVpcmUgPT0gJ2Z1bmN0aW9uJyl7XG5cdGV4cG9ydHMuRE9NSW1wbGVtZW50YXRpb24gPSBET01JbXBsZW1lbnRhdGlvbjtcblx0ZXhwb3J0cy5YTUxTZXJpYWxpemVyID0gWE1MU2VyaWFsaXplcjtcbi8vfVxuIiwiLy9bNF0gICBcdE5hbWVTdGFydENoYXJcdCAgIDo6PSAgIFx0XCI6XCIgfCBbQS1aXSB8IFwiX1wiIHwgW2Etel0gfCBbI3hDMC0jeEQ2XSB8IFsjeEQ4LSN4RjZdIHwgWyN4RjgtI3gyRkZdIHwgWyN4MzcwLSN4MzdEXSB8IFsjeDM3Ri0jeDFGRkZdIHwgWyN4MjAwQy0jeDIwMERdIHwgWyN4MjA3MC0jeDIxOEZdIHwgWyN4MkMwMC0jeDJGRUZdIHwgWyN4MzAwMS0jeEQ3RkZdIHwgWyN4RjkwMC0jeEZEQ0ZdIHwgWyN4RkRGMC0jeEZGRkRdIHwgWyN4MTAwMDAtI3hFRkZGRl1cclxuLy9bNGFdICAgXHROYW1lQ2hhclx0ICAgOjo9ICAgXHROYW1lU3RhcnRDaGFyIHwgXCItXCIgfCBcIi5cIiB8IFswLTldIHwgI3hCNyB8IFsjeDAzMDAtI3gwMzZGXSB8IFsjeDIwM0YtI3gyMDQwXVxyXG4vL1s1XSAgIFx0TmFtZVx0ICAgOjo9ICAgXHROYW1lU3RhcnRDaGFyIChOYW1lQ2hhcikqXHJcbnZhciBuYW1lU3RhcnRDaGFyID0gL1tBLVpfYS16XFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRF0vLy9cXHUxMDAwMC1cXHVFRkZGRlxyXG52YXIgbmFtZUNoYXIgPSBuZXcgUmVnRXhwKFwiW1xcXFwtXFxcXC4wLTlcIituYW1lU3RhcnRDaGFyLnNvdXJjZS5zbGljZSgxLC0xKStcIlxcXFx1MDBCN1xcXFx1MDMwMC1cXFxcdTAzNkZcXFxcdTIwM0YtXFxcXHUyMDQwXVwiKTtcclxudmFyIHRhZ05hbWVQYXR0ZXJuID0gbmV3IFJlZ0V4cCgnXicrbmFtZVN0YXJ0Q2hhci5zb3VyY2UrbmFtZUNoYXIuc291cmNlKycqKD86XFw6JytuYW1lU3RhcnRDaGFyLnNvdXJjZStuYW1lQ2hhci5zb3VyY2UrJyopPyQnKTtcclxuLy92YXIgdGFnTmFtZVBhdHRlcm4gPSAvXlthLXpBLVpfXVtcXHdcXC1cXC5dKig/OlxcOlthLXpBLVpfXVtcXHdcXC1cXC5dKik/JC9cclxuLy92YXIgaGFuZGxlcnMgPSAncmVzb2x2ZUVudGl0eSxnZXRFeHRlcm5hbFN1YnNldCxjaGFyYWN0ZXJzLGVuZERvY3VtZW50LGVuZEVsZW1lbnQsZW5kUHJlZml4TWFwcGluZyxpZ25vcmFibGVXaGl0ZXNwYWNlLHByb2Nlc3NpbmdJbnN0cnVjdGlvbixzZXREb2N1bWVudExvY2F0b3Isc2tpcHBlZEVudGl0eSxzdGFydERvY3VtZW50LHN0YXJ0RWxlbWVudCxzdGFydFByZWZpeE1hcHBpbmcsbm90YXRpb25EZWNsLHVucGFyc2VkRW50aXR5RGVjbCxlcnJvcixmYXRhbEVycm9yLHdhcm5pbmcsYXR0cmlidXRlRGVjbCxlbGVtZW50RGVjbCxleHRlcm5hbEVudGl0eURlY2wsaW50ZXJuYWxFbnRpdHlEZWNsLGNvbW1lbnQsZW5kQ0RBVEEsZW5kRFRELGVuZEVudGl0eSxzdGFydENEQVRBLHN0YXJ0RFRELHN0YXJ0RW50aXR5Jy5zcGxpdCgnLCcpXHJcblxyXG4vL1NfVEFHLFx0U19BVFRSLFx0U19FUSxcdFNfQVRUUl9OT1FVT1RfVkFMVUVcclxuLy9TX0FUVFJfU1BBQ0UsXHRTX0FUVFJfRU5ELFx0U19UQUdfU1BBQ0UsIFNfVEFHX0NMT1NFXHJcbnZhciBTX1RBRyA9IDA7Ly90YWcgbmFtZSBvZmZlcnJpbmdcclxudmFyIFNfQVRUUiA9IDE7Ly9hdHRyIG5hbWUgb2ZmZXJyaW5nIFxyXG52YXIgU19BVFRSX1NQQUNFPTI7Ly9hdHRyIG5hbWUgZW5kIGFuZCBzcGFjZSBvZmZlclxyXG52YXIgU19FUSA9IDM7Ly89c3BhY2U/XHJcbnZhciBTX0FUVFJfTk9RVU9UX1ZBTFVFID0gNDsvL2F0dHIgdmFsdWUobm8gcXVvdCB2YWx1ZSBvbmx5KVxyXG52YXIgU19BVFRSX0VORCA9IDU7Ly9hdHRyIHZhbHVlIGVuZCBhbmQgbm8gc3BhY2UocXVvdCBlbmQpXHJcbnZhciBTX1RBR19TUEFDRSA9IDY7Ly8oYXR0ciB2YWx1ZSBlbmQgfHwgdGFnIGVuZCApICYmIChzcGFjZSBvZmZlcilcclxudmFyIFNfVEFHX0NMT1NFID0gNzsvL2Nsb3NlZCBlbDxlbCAvPlxyXG5cclxuZnVuY3Rpb24gWE1MUmVhZGVyKCl7XHJcblx0XHJcbn1cclxuXHJcblhNTFJlYWRlci5wcm90b3R5cGUgPSB7XHJcblx0cGFyc2U6ZnVuY3Rpb24oc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXApe1xyXG5cdFx0dmFyIGRvbUJ1aWxkZXIgPSB0aGlzLmRvbUJ1aWxkZXI7XHJcblx0XHRkb21CdWlsZGVyLnN0YXJ0RG9jdW1lbnQoKTtcclxuXHRcdF9jb3B5KGRlZmF1bHROU01hcCAsZGVmYXVsdE5TTWFwID0ge30pXHJcblx0XHRwYXJzZShzb3VyY2UsZGVmYXVsdE5TTWFwLGVudGl0eU1hcCxcclxuXHRcdFx0XHRkb21CdWlsZGVyLHRoaXMuZXJyb3JIYW5kbGVyKTtcclxuXHRcdGRvbUJ1aWxkZXIuZW5kRG9jdW1lbnQoKTtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gcGFyc2Uoc291cmNlLGRlZmF1bHROU01hcENvcHksZW50aXR5TWFwLGRvbUJ1aWxkZXIsZXJyb3JIYW5kbGVyKXtcclxuXHRmdW5jdGlvbiBmaXhlZEZyb21DaGFyQ29kZShjb2RlKSB7XHJcblx0XHQvLyBTdHJpbmcucHJvdG90eXBlLmZyb21DaGFyQ29kZSBkb2VzIG5vdCBzdXBwb3J0c1xyXG5cdFx0Ly8gPiAyIGJ5dGVzIHVuaWNvZGUgY2hhcnMgZGlyZWN0bHlcclxuXHRcdGlmIChjb2RlID4gMHhmZmZmKSB7XHJcblx0XHRcdGNvZGUgLT0gMHgxMDAwMDtcclxuXHRcdFx0dmFyIHN1cnJvZ2F0ZTEgPSAweGQ4MDAgKyAoY29kZSA+PiAxMClcclxuXHRcdFx0XHQsIHN1cnJvZ2F0ZTIgPSAweGRjMDAgKyAoY29kZSAmIDB4M2ZmKTtcclxuXHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHN1cnJvZ2F0ZTEsIHN1cnJvZ2F0ZTIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGVudGl0eVJlcGxhY2VyKGEpe1xyXG5cdFx0dmFyIGsgPSBhLnNsaWNlKDEsLTEpO1xyXG5cdFx0aWYoayBpbiBlbnRpdHlNYXApe1xyXG5cdFx0XHRyZXR1cm4gZW50aXR5TWFwW2tdOyBcclxuXHRcdH1lbHNlIGlmKGsuY2hhckF0KDApID09PSAnIycpe1xyXG5cdFx0XHRyZXR1cm4gZml4ZWRGcm9tQ2hhckNvZGUocGFyc2VJbnQoay5zdWJzdHIoMSkucmVwbGFjZSgneCcsJzB4JykpKVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGVycm9ySGFuZGxlci5lcnJvcignZW50aXR5IG5vdCBmb3VuZDonK2EpO1xyXG5cdFx0XHRyZXR1cm4gYTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gYXBwZW5kVGV4dChlbmQpey8vaGFzIHNvbWUgYnVnc1xyXG5cdFx0aWYoZW5kPnN0YXJ0KXtcclxuXHRcdFx0dmFyIHh0ID0gc291cmNlLnN1YnN0cmluZyhzdGFydCxlbmQpLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRsb2NhdG9yJiZwb3NpdGlvbihzdGFydCk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh4dCwwLGVuZC1zdGFydCk7XHJcblx0XHRcdHN0YXJ0ID0gZW5kXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHBvc2l0aW9uKHAsbSl7XHJcblx0XHR3aGlsZShwPj1saW5lRW5kICYmIChtID0gbGluZVBhdHRlcm4uZXhlYyhzb3VyY2UpKSl7XHJcblx0XHRcdGxpbmVTdGFydCA9IG0uaW5kZXg7XHJcblx0XHRcdGxpbmVFbmQgPSBsaW5lU3RhcnQgKyBtWzBdLmxlbmd0aDtcclxuXHRcdFx0bG9jYXRvci5saW5lTnVtYmVyKys7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2xpbmUrKzonLGxvY2F0b3Isc3RhcnRQb3MsZW5kUG9zKVxyXG5cdFx0fVxyXG5cdFx0bG9jYXRvci5jb2x1bW5OdW1iZXIgPSBwLWxpbmVTdGFydCsxO1xyXG5cdH1cclxuXHR2YXIgbGluZVN0YXJ0ID0gMDtcclxuXHR2YXIgbGluZUVuZCA9IDA7XHJcblx0dmFyIGxpbmVQYXR0ZXJuID0gLy4qKD86XFxyXFxuP3xcXG4pfC4qJC9nXHJcblx0dmFyIGxvY2F0b3IgPSBkb21CdWlsZGVyLmxvY2F0b3I7XHJcblx0XHJcblx0dmFyIHBhcnNlU3RhY2sgPSBbe2N1cnJlbnROU01hcDpkZWZhdWx0TlNNYXBDb3B5fV1cclxuXHR2YXIgY2xvc2VNYXAgPSB7fTtcclxuXHR2YXIgc3RhcnQgPSAwO1xyXG5cdHdoaWxlKHRydWUpe1xyXG5cdFx0dHJ5e1xyXG5cdFx0XHR2YXIgdGFnU3RhcnQgPSBzb3VyY2UuaW5kZXhPZignPCcsc3RhcnQpO1xyXG5cdFx0XHRpZih0YWdTdGFydDwwKXtcclxuXHRcdFx0XHRpZighc291cmNlLnN1YnN0cihzdGFydCkubWF0Y2goL15cXHMqJC8pKXtcclxuXHRcdFx0XHRcdHZhciBkb2MgPSBkb21CdWlsZGVyLmRvYztcclxuXHQgICAgXHRcdFx0dmFyIHRleHQgPSBkb2MuY3JlYXRlVGV4dE5vZGUoc291cmNlLnN1YnN0cihzdGFydCkpO1xyXG5cdCAgICBcdFx0XHRkb2MuYXBwZW5kQ2hpbGQodGV4dCk7XHJcblx0ICAgIFx0XHRcdGRvbUJ1aWxkZXIuY3VycmVudEVsZW1lbnQgPSB0ZXh0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodGFnU3RhcnQ+c3RhcnQpe1xyXG5cdFx0XHRcdGFwcGVuZFRleHQodGFnU3RhcnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN3aXRjaChzb3VyY2UuY2hhckF0KHRhZ1N0YXJ0KzEpKXtcclxuXHRcdFx0Y2FzZSAnLyc6XHJcblx0XHRcdFx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCc+Jyx0YWdTdGFydCszKTtcclxuXHRcdFx0XHR2YXIgdGFnTmFtZSA9IHNvdXJjZS5zdWJzdHJpbmcodGFnU3RhcnQrMixlbmQpO1xyXG5cdFx0XHRcdHZhciBjb25maWcgPSBwYXJzZVN0YWNrLnBvcCgpO1xyXG5cdFx0XHRcdGlmKGVuZDwwKXtcclxuXHRcdFx0XHRcdFxyXG5cdCAgICAgICAgXHRcdHRhZ05hbWUgPSBzb3VyY2Uuc3Vic3RyaW5nKHRhZ1N0YXJ0KzIpLnJlcGxhY2UoL1tcXHM8XS4qLywnJyk7XHJcblx0ICAgICAgICBcdFx0Ly9jb25zb2xlLmVycm9yKCcjQEBAQEBAJyt0YWdOYW1lKVxyXG5cdCAgICAgICAgXHRcdGVycm9ySGFuZGxlci5lcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIGlzIG5vdCBjb21wbGV0ZTonK2NvbmZpZy50YWdOYW1lKTtcclxuXHQgICAgICAgIFx0XHRlbmQgPSB0YWdTdGFydCsxK3RhZ05hbWUubGVuZ3RoO1xyXG5cdCAgICAgICAgXHR9ZWxzZSBpZih0YWdOYW1lLm1hdGNoKC9cXHM8Lykpe1xyXG5cdCAgICAgICAgXHRcdHRhZ05hbWUgPSB0YWdOYW1lLnJlcGxhY2UoL1tcXHM8XS4qLywnJyk7XHJcblx0ICAgICAgICBcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKFwiZW5kIHRhZyBuYW1lOiBcIit0YWdOYW1lKycgbWF5YmUgbm90IGNvbXBsZXRlJyk7XHJcblx0ICAgICAgICBcdFx0ZW5kID0gdGFnU3RhcnQrMSt0YWdOYW1lLmxlbmd0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKHBhcnNlU3RhY2subGVuZ3RoLHBhcnNlU3RhY2spXHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGNvbmZpZyk7XHJcblx0XHRcdFx0dmFyIGxvY2FsTlNNYXAgPSBjb25maWcubG9jYWxOU01hcDtcclxuXHRcdFx0XHR2YXIgZW5kTWF0Y2ggPSBjb25maWcudGFnTmFtZSA9PSB0YWdOYW1lO1xyXG5cdFx0XHRcdHZhciBlbmRJZ25vcmVDYXNlTWFjaCA9IGVuZE1hdGNoIHx8IGNvbmZpZy50YWdOYW1lJiZjb25maWcudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IHRhZ05hbWUudG9Mb3dlckNhc2UoKVxyXG5cdFx0ICAgICAgICBpZihlbmRJZ25vcmVDYXNlTWFjaCl7XHJcblx0XHQgICAgICAgIFx0ZG9tQnVpbGRlci5lbmRFbGVtZW50KGNvbmZpZy51cmksY29uZmlnLmxvY2FsTmFtZSx0YWdOYW1lKTtcclxuXHRcdFx0XHRcdGlmKGxvY2FsTlNNYXApe1xyXG5cdFx0XHRcdFx0XHRmb3IodmFyIHByZWZpeCBpbiBsb2NhbE5TTWFwKXtcclxuXHRcdFx0XHRcdFx0XHRkb21CdWlsZGVyLmVuZFByZWZpeE1hcHBpbmcocHJlZml4KSA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKCFlbmRNYXRjaCl7XHJcblx0XHQgICAgICAgICAgICBcdGVycm9ySGFuZGxlci5mYXRhbEVycm9yKFwiZW5kIHRhZyBuYW1lOiBcIit0YWdOYW1lKycgaXMgbm90IG1hdGNoIHRoZSBjdXJyZW50IHN0YXJ0IHRhZ05hbWU6Jytjb25maWcudGFnTmFtZSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0ICAgICAgICB9ZWxzZXtcclxuXHRcdCAgICAgICAgXHRwYXJzZVN0YWNrLnB1c2goY29uZmlnKVxyXG5cdFx0ICAgICAgICB9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0ZW5kKys7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Ly8gZW5kIGVsbWVudFxyXG5cdFx0XHRjYXNlICc/JzovLyA8Py4uLj8+XHJcblx0XHRcdFx0bG9jYXRvciYmcG9zaXRpb24odGFnU3RhcnQpO1xyXG5cdFx0XHRcdGVuZCA9IHBhcnNlSW5zdHJ1Y3Rpb24oc291cmNlLHRhZ1N0YXJ0LGRvbUJ1aWxkZXIpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICchJzovLyA8IWRvY3R5cGUsPCFbQ0RBVEEsPCEtLVxyXG5cdFx0XHRcdGxvY2F0b3ImJnBvc2l0aW9uKHRhZ1N0YXJ0KTtcclxuXHRcdFx0XHRlbmQgPSBwYXJzZURDQyhzb3VyY2UsdGFnU3RhcnQsZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGxvY2F0b3ImJnBvc2l0aW9uKHRhZ1N0YXJ0KTtcclxuXHRcdFx0XHR2YXIgZWwgPSBuZXcgRWxlbWVudEF0dHJpYnV0ZXMoKTtcclxuXHRcdFx0XHR2YXIgY3VycmVudE5TTWFwID0gcGFyc2VTdGFja1twYXJzZVN0YWNrLmxlbmd0aC0xXS5jdXJyZW50TlNNYXA7XHJcblx0XHRcdFx0Ly9lbFN0YXJ0RW5kXHJcblx0XHRcdFx0dmFyIGVuZCA9IHBhcnNlRWxlbWVudFN0YXJ0UGFydChzb3VyY2UsdGFnU3RhcnQsZWwsY3VycmVudE5TTWFwLGVudGl0eVJlcGxhY2VyLGVycm9ySGFuZGxlcik7XHJcblx0XHRcdFx0dmFyIGxlbiA9IGVsLmxlbmd0aDtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZighZWwuY2xvc2VkICYmIGZpeFNlbGZDbG9zZWQoc291cmNlLGVuZCxlbC50YWdOYW1lLGNsb3NlTWFwKSl7XHJcblx0XHRcdFx0XHRlbC5jbG9zZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0aWYoIWVudGl0eU1hcC5uYnNwKXtcclxuXHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ3VuY2xvc2VkIHhtbCBhdHRyaWJ1dGUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG9jYXRvciAmJiBsZW4pe1xyXG5cdFx0XHRcdFx0dmFyIGxvY2F0b3IyID0gY29weUxvY2F0b3IobG9jYXRvcix7fSk7XHJcblx0XHRcdFx0XHQvL3RyeXsvL2F0dHJpYnV0ZSBwb3NpdGlvbiBmaXhlZFxyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgYSA9IGVsW2ldO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbihhLm9mZnNldCk7XHJcblx0XHRcdFx0XHRcdGEubG9jYXRvciA9IGNvcHlMb2NhdG9yKGxvY2F0b3Ise30pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly99Y2F0Y2goZSl7Y29uc29sZS5lcnJvcignQEBAQEAnK2UpfVxyXG5cdFx0XHRcdFx0ZG9tQnVpbGRlci5sb2NhdG9yID0gbG9jYXRvcjJcclxuXHRcdFx0XHRcdGlmKGFwcGVuZEVsZW1lbnQoZWwsZG9tQnVpbGRlcixjdXJyZW50TlNNYXApKXtcclxuXHRcdFx0XHRcdFx0cGFyc2VTdGFjay5wdXNoKGVsKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZG9tQnVpbGRlci5sb2NhdG9yID0gbG9jYXRvcjtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKGFwcGVuZEVsZW1lbnQoZWwsZG9tQnVpbGRlcixjdXJyZW50TlNNYXApKXtcclxuXHRcdFx0XHRcdFx0cGFyc2VTdGFjay5wdXNoKGVsKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihlbC51cmkgPT09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyAmJiAhZWwuY2xvc2VkKXtcclxuXHRcdFx0XHRcdGVuZCA9IHBhcnNlSHRtbFNwZWNpYWxDb250ZW50KHNvdXJjZSxlbmQsZWwudGFnTmFtZSxlbnRpdHlSZXBsYWNlcixkb21CdWlsZGVyKVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZW5kKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9Y2F0Y2goZSl7XHJcblx0XHRcdGVycm9ySGFuZGxlci5lcnJvcignZWxlbWVudCBwYXJzZSBlcnJvcjogJytlKVxyXG5cdFx0XHQvL2Vycm9ySGFuZGxlci5lcnJvcignZWxlbWVudCBwYXJzZSBlcnJvcjogJytlKTtcclxuXHRcdFx0ZW5kID0gLTE7XHJcblx0XHRcdC8vdGhyb3cgZTtcclxuXHRcdH1cclxuXHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdC8vVE9ETzog6L+Z6YeM5pyJ5Y+v6IO9c2F45Zue6YCA77yM5pyJ5L2N572u6ZSZ6K+v6aOO6ZmpXHJcblx0XHRcdGFwcGVuZFRleHQoTWF0aC5tYXgodGFnU3RhcnQsc3RhcnQpKzEpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBjb3B5TG9jYXRvcihmLHQpe1xyXG5cdHQubGluZU51bWJlciA9IGYubGluZU51bWJlcjtcclxuXHR0LmNvbHVtbk51bWJlciA9IGYuY29sdW1uTnVtYmVyO1xyXG5cdHJldHVybiB0O1xyXG59XHJcblxyXG4vKipcclxuICogQHNlZSAjYXBwZW5kRWxlbWVudChzb3VyY2UsZWxTdGFydEVuZCxlbCxzZWxmQ2xvc2VkLGVudGl0eVJlcGxhY2VyLGRvbUJ1aWxkZXIscGFyc2VTdGFjayk7XHJcbiAqIEByZXR1cm4gZW5kIG9mIHRoZSBlbGVtZW50U3RhcnRQYXJ0KGVuZCBvZiBlbGVtZW50RW5kUGFydCBmb3Igc2VsZkNsb3NlZCBlbClcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlRWxlbWVudFN0YXJ0UGFydChzb3VyY2Usc3RhcnQsZWwsY3VycmVudE5TTWFwLGVudGl0eVJlcGxhY2VyLGVycm9ySGFuZGxlcil7XHJcblx0dmFyIGF0dHJOYW1lO1xyXG5cdHZhciB2YWx1ZTtcclxuXHR2YXIgcCA9ICsrc3RhcnQ7XHJcblx0dmFyIHMgPSBTX1RBRzsvL3N0YXR1c1xyXG5cdHdoaWxlKHRydWUpe1xyXG5cdFx0dmFyIGMgPSBzb3VyY2UuY2hhckF0KHApO1xyXG5cdFx0c3dpdGNoKGMpe1xyXG5cdFx0Y2FzZSAnPSc6XHJcblx0XHRcdGlmKHMgPT09IFNfQVRUUil7Ly9hdHRyTmFtZVxyXG5cdFx0XHRcdGF0dHJOYW1lID0gc291cmNlLnNsaWNlKHN0YXJ0LHApO1xyXG5cdFx0XHRcdHMgPSBTX0VRO1xyXG5cdFx0XHR9ZWxzZSBpZihzID09PSBTX0FUVFJfU1BBQ0Upe1xyXG5cdFx0XHRcdHMgPSBTX0VRO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvL2ZhdGFsRXJyb3I6IGVxdWFsIG11c3QgYWZ0ZXIgYXR0ck5hbWUgb3Igc3BhY2UgYWZ0ZXIgYXR0ck5hbWVcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSBlcXVhbCBtdXN0IGFmdGVyIGF0dHJOYW1lJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdcXCcnOlxyXG5cdFx0Y2FzZSAnXCInOlxyXG5cdFx0XHRpZihzID09PSBTX0VRIHx8IHMgPT09IFNfQVRUUiAvL3x8IHMgPT0gU19BVFRSX1NQQUNFXHJcblx0XHRcdFx0KXsvL2VxdWFsXHJcblx0XHRcdFx0aWYocyA9PT0gU19BVFRSKXtcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgdmFsdWUgbXVzdCBhZnRlciBcIj1cIicpXHJcblx0XHRcdFx0XHRhdHRyTmFtZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzdGFydCA9IHArMTtcclxuXHRcdFx0XHRwID0gc291cmNlLmluZGV4T2YoYyxzdGFydClcclxuXHRcdFx0XHRpZihwPjApe1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUsc3RhcnQtMSk7XHJcblx0XHRcdFx0XHRzID0gU19BVFRSX0VORDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vZmF0YWxFcnJvcjogbm8gZW5kIHF1b3QgbWF0Y2hcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG5vIGVuZCBcXCcnK2MrJ1xcJyBtYXRjaCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYocyA9PSBTX0FUVFJfTk9RVU9UX1ZBTFVFKXtcclxuXHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJOYW1lLHZhbHVlLHN0YXJ0LHApXHJcblx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLHN0YXJ0KTtcclxuXHRcdFx0XHQvL2NvbnNvbGUuZGlyKGVsKVxyXG5cdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK2F0dHJOYW1lKydcIiBtaXNzZWQgc3RhcnQgcXVvdCgnK2MrJykhIScpO1xyXG5cdFx0XHRcdHN0YXJ0ID0gcCsxO1xyXG5cdFx0XHRcdHMgPSBTX0FUVFJfRU5EXHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vZmF0YWxFcnJvcjogbm8gZXF1YWwgYmVmb3JlXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgbXVzdCBhZnRlciBcIj1cIicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnLyc6XHJcblx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0Y2FzZSBTX1RBRzpcclxuXHRcdFx0XHRlbC5zZXRUYWdOYW1lKHNvdXJjZS5zbGljZShzdGFydCxwKSk7XHJcblx0XHRcdGNhc2UgU19BVFRSX0VORDpcclxuXHRcdFx0Y2FzZSBTX1RBR19TUEFDRTpcclxuXHRcdFx0Y2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRzID1TX1RBR19DTE9TRTtcclxuXHRcdFx0XHRlbC5jbG9zZWQgPSB0cnVlO1xyXG5cdFx0XHRjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XHJcblx0XHRcdGNhc2UgU19BVFRSOlxyXG5cdFx0XHRjYXNlIFNfQVRUUl9TUEFDRTpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Ly9jYXNlIFNfRVE6XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXR0cmlidXRlIGludmFsaWQgY2xvc2UgY2hhcignLycpXCIpXHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICcnOi8vZW5kIGRvY3VtZW50XHJcblx0XHRcdC8vdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcpXHJcblx0XHRcdGVycm9ySGFuZGxlci5lcnJvcigndW5leHBlY3RlZCBlbmQgb2YgaW5wdXQnKTtcclxuXHRcdFx0aWYocyA9PSBTX1RBRyl7XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBwO1xyXG5cdFx0Y2FzZSAnPic6XHJcblx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0Y2FzZSBTX1RBRzpcclxuXHRcdFx0XHRlbC5zZXRUYWdOYW1lKHNvdXJjZS5zbGljZShzdGFydCxwKSk7XHJcblx0XHRcdGNhc2UgU19BVFRSX0VORDpcclxuXHRcdFx0Y2FzZSBTX1RBR19TUEFDRTpcclxuXHRcdFx0Y2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRicmVhazsvL25vcm1hbFxyXG5cdFx0XHRjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6Ly9Db21wYXRpYmxlIHN0YXRlXHJcblx0XHRcdGNhc2UgU19BVFRSOlxyXG5cdFx0XHRcdHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApO1xyXG5cdFx0XHRcdGlmKHZhbHVlLnNsaWNlKC0xKSA9PT0gJy8nKXtcclxuXHRcdFx0XHRcdGVsLmNsb3NlZCAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLC0xKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0Y2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0aWYocyA9PT0gU19BVFRSX1NQQUNFKXtcclxuXHRcdFx0XHRcdHZhbHVlID0gYXR0ck5hbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHMgPT0gU19BVFRSX05PUVVPVF9WQUxVRSl7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyt2YWx1ZSsnXCIgbWlzc2VkIHF1b3QoXCIpISEnKTtcclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKSxzdGFydClcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKGN1cnJlbnROU01hcFsnJ10gIT09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyB8fCAhdmFsdWUubWF0Y2goL14oPzpkaXNhYmxlZHxjaGVja2VkfHNlbGVjdGVkKSQvaSkpe1xyXG5cdFx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyt2YWx1ZSsnXCIgbWlzc2VkIHZhbHVlISEgXCInK3ZhbHVlKydcIiBpbnN0ZWFkISEnKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWwuYWRkKHZhbHVlLHZhbHVlLHN0YXJ0KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBTX0VROlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG1pc3NlZCEhJyk7XHJcblx0XHRcdH1cclxuLy9cdFx0XHRjb25zb2xlLmxvZyh0YWdOYW1lLHRhZ05hbWVQYXR0ZXJuLHRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpXHJcblx0XHRcdHJldHVybiBwO1xyXG5cdFx0Lyp4bWwgc3BhY2UgJ1xceDIwJyB8ICN4OSB8ICN4RCB8ICN4QTsgKi9cclxuXHRcdGNhc2UgJ1xcdTAwODAnOlxyXG5cdFx0XHRjID0gJyAnO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0aWYoYzw9ICcgJyl7Ly9zcGFjZVxyXG5cdFx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0XHRjYXNlIFNfVEFHOlxyXG5cdFx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpOy8vdGFnTmFtZVxyXG5cdFx0XHRcdFx0cyA9IFNfVEFHX1NQQUNFO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0FUVFI6XHJcblx0XHRcdFx0XHRhdHRyTmFtZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKVxyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUl9TUEFDRTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSX05PUVVPVF9WQUxVRTpcclxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK3ZhbHVlKydcIiBtaXNzZWQgcXVvdChcIikhIScpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLHN0YXJ0KVxyXG5cdFx0XHRcdGNhc2UgU19BVFRSX0VORDpcclxuXHRcdFx0XHRcdHMgPSBTX1RBR19TUEFDRTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX1RBR19TUEFDRTpcclxuXHRcdFx0XHQvL2Nhc2UgU19FUTpcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSX1NQQUNFOlxyXG5cdFx0XHRcdC8vXHR2b2lkKCk7YnJlYWs7XHJcblx0XHRcdFx0Ly9jYXNlIFNfVEFHX0NMT1NFOlxyXG5cdFx0XHRcdFx0Ly9pZ25vcmUgd2FybmluZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7Ly9ub3Qgc3BhY2VcclxuLy9TX1RBRyxcdFNfQVRUUixcdFNfRVEsXHRTX0FUVFJfTk9RVU9UX1ZBTFVFXHJcbi8vU19BVFRSX1NQQUNFLFx0U19BVFRSX0VORCxcdFNfVEFHX1NQQUNFLCBTX1RBR19DTE9TRVxyXG5cdFx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0XHQvL2Nhc2UgU19UQUc6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX0FUVFI6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOnZvaWQoKTticmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9TUEFDRTpcclxuXHRcdFx0XHRcdHZhciB0YWdOYW1lID0gIGVsLnRhZ05hbWU7XHJcblx0XHRcdFx0XHRpZihjdXJyZW50TlNNYXBbJyddICE9PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgfHwgIWF0dHJOYW1lLm1hdGNoKC9eKD86ZGlzYWJsZWR8Y2hlY2tlZHxzZWxlY3RlZCkkL2kpKXtcclxuXHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrYXR0ck5hbWUrJ1wiIG1pc3NlZCB2YWx1ZSEhIFwiJythdHRyTmFtZSsnXCIgaW5zdGVhZDIhIScpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsYXR0ck5hbWUsc3RhcnQpO1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBwO1xyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSX0VORDpcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgc3BhY2UgaXMgcmVxdWlyZWRcIicrYXR0ck5hbWUrJ1wiISEnKVxyXG5cdFx0XHRcdGNhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdFx0XHRzID0gU19BVFRSO1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBwO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0VROlxyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUl9OT1FVT1RfVkFMVUU7XHJcblx0XHRcdFx0XHRzdGFydCA9IHA7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfVEFHX0NMT1NFOlxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWxlbWVudHMgY2xvc2VkIGNoYXJhY3RlciAnLycgYW5kICc+JyBtdXN0IGJlIGNvbm5lY3RlZCB0b1wiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0vL2VuZCBvdXRlciBzd2l0Y2hcclxuXHRcdC8vY29uc29sZS5sb2coJ3ArKycscClcclxuXHRcdHArKztcclxuXHR9XHJcbn1cclxuLyoqXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBoYXMgbmV3IG5hbWVzcGFjZSBkZWZpbmVcclxuICovXHJcbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQoZWwsZG9tQnVpbGRlcixjdXJyZW50TlNNYXApe1xyXG5cdHZhciB0YWdOYW1lID0gZWwudGFnTmFtZTtcclxuXHR2YXIgbG9jYWxOU01hcCA9IG51bGw7XHJcblx0Ly92YXIgY3VycmVudE5TTWFwID0gcGFyc2VTdGFja1twYXJzZVN0YWNrLmxlbmd0aC0xXS5jdXJyZW50TlNNYXA7XHJcblx0dmFyIGkgPSBlbC5sZW5ndGg7XHJcblx0d2hpbGUoaS0tKXtcclxuXHRcdHZhciBhID0gZWxbaV07XHJcblx0XHR2YXIgcU5hbWUgPSBhLnFOYW1lO1xyXG5cdFx0dmFyIHZhbHVlID0gYS52YWx1ZTtcclxuXHRcdHZhciBuc3AgPSBxTmFtZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRpZihuc3A+MCl7XHJcblx0XHRcdHZhciBwcmVmaXggPSBhLnByZWZpeCA9IHFOYW1lLnNsaWNlKDAsbnNwKTtcclxuXHRcdFx0dmFyIGxvY2FsTmFtZSA9IHFOYW1lLnNsaWNlKG5zcCsxKTtcclxuXHRcdFx0dmFyIG5zUHJlZml4ID0gcHJlZml4ID09PSAneG1sbnMnICYmIGxvY2FsTmFtZVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxvY2FsTmFtZSA9IHFOYW1lO1xyXG5cdFx0XHRwcmVmaXggPSBudWxsXHJcblx0XHRcdG5zUHJlZml4ID0gcU5hbWUgPT09ICd4bWxucycgJiYgJydcclxuXHRcdH1cclxuXHRcdC8vY2FuIG5vdCBzZXQgcHJlZml4LGJlY2F1c2UgcHJlZml4ICE9PSAnJ1xyXG5cdFx0YS5sb2NhbE5hbWUgPSBsb2NhbE5hbWUgO1xyXG5cdFx0Ly9wcmVmaXggPT0gbnVsbCBmb3Igbm8gbnMgcHJlZml4IGF0dHJpYnV0ZSBcclxuXHRcdGlmKG5zUHJlZml4ICE9PSBmYWxzZSl7Ly9oYWNrISFcclxuXHRcdFx0aWYobG9jYWxOU01hcCA9PSBudWxsKXtcclxuXHRcdFx0XHRsb2NhbE5TTWFwID0ge31cclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGN1cnJlbnROU01hcCwwKVxyXG5cdFx0XHRcdF9jb3B5KGN1cnJlbnROU01hcCxjdXJyZW50TlNNYXA9e30pXHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjdXJyZW50TlNNYXAsMSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjdXJyZW50TlNNYXBbbnNQcmVmaXhdID0gbG9jYWxOU01hcFtuc1ByZWZpeF0gPSB2YWx1ZTtcclxuXHRcdFx0YS51cmkgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnRQcmVmaXhNYXBwaW5nKG5zUHJlZml4LCB2YWx1ZSkgXHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBpID0gZWwubGVuZ3RoO1xyXG5cdHdoaWxlKGktLSl7XHJcblx0XHRhID0gZWxbaV07XHJcblx0XHR2YXIgcHJlZml4ID0gYS5wcmVmaXg7XHJcblx0XHRpZihwcmVmaXgpey8vbm8gcHJlZml4IGF0dHJpYnV0ZSBoYXMgbm8gbmFtZXNwYWNlXHJcblx0XHRcdGlmKHByZWZpeCA9PT0gJ3htbCcpe1xyXG5cdFx0XHRcdGEudXJpID0gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcblx0XHRcdH1pZihwcmVmaXggIT09ICd4bWxucycpe1xyXG5cdFx0XHRcdGEudXJpID0gY3VycmVudE5TTWFwW3ByZWZpeCB8fCAnJ11cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3tjb25zb2xlLmxvZygnIyMjJythLnFOYW1lLGRvbUJ1aWxkZXIubG9jYXRvci5zeXN0ZW1JZCsnJyxjdXJyZW50TlNNYXAsYS51cmkpfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBuc3AgPSB0YWdOYW1lLmluZGV4T2YoJzonKTtcclxuXHRpZihuc3A+MCl7XHJcblx0XHRwcmVmaXggPSBlbC5wcmVmaXggPSB0YWdOYW1lLnNsaWNlKDAsbnNwKTtcclxuXHRcdGxvY2FsTmFtZSA9IGVsLmxvY2FsTmFtZSA9IHRhZ05hbWUuc2xpY2UobnNwKzEpO1xyXG5cdH1lbHNle1xyXG5cdFx0cHJlZml4ID0gbnVsbDsvL2ltcG9ydGFudCEhXHJcblx0XHRsb2NhbE5hbWUgPSBlbC5sb2NhbE5hbWUgPSB0YWdOYW1lO1xyXG5cdH1cclxuXHQvL25vIHByZWZpeCBlbGVtZW50IGhhcyBkZWZhdWx0IG5hbWVzcGFjZVxyXG5cdHZhciBucyA9IGVsLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddO1xyXG5cdGRvbUJ1aWxkZXIuc3RhcnRFbGVtZW50KG5zLGxvY2FsTmFtZSx0YWdOYW1lLGVsKTtcclxuXHQvL2VuZFByZWZpeE1hcHBpbmcgYW5kIHN0YXJ0UHJlZml4TWFwcGluZyBoYXZlIG5vdCBhbnkgaGVscCBmb3IgZG9tIGJ1aWxkZXJcclxuXHQvL2xvY2FsTlNNYXAgPSBudWxsXHJcblx0aWYoZWwuY2xvc2VkKXtcclxuXHRcdGRvbUJ1aWxkZXIuZW5kRWxlbWVudChucyxsb2NhbE5hbWUsdGFnTmFtZSk7XHJcblx0XHRpZihsb2NhbE5TTWFwKXtcclxuXHRcdFx0Zm9yKHByZWZpeCBpbiBsb2NhbE5TTWFwKXtcclxuXHRcdFx0XHRkb21CdWlsZGVyLmVuZFByZWZpeE1hcHBpbmcocHJlZml4KSBcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1lbHNle1xyXG5cdFx0ZWwuY3VycmVudE5TTWFwID0gY3VycmVudE5TTWFwO1xyXG5cdFx0ZWwubG9jYWxOU01hcCA9IGxvY2FsTlNNYXA7XHJcblx0XHQvL3BhcnNlU3RhY2sucHVzaChlbCk7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gcGFyc2VIdG1sU3BlY2lhbENvbnRlbnQoc291cmNlLGVsU3RhcnRFbmQsdGFnTmFtZSxlbnRpdHlSZXBsYWNlcixkb21CdWlsZGVyKXtcclxuXHRpZigvXig/OnNjcmlwdHx0ZXh0YXJlYSkkL2kudGVzdCh0YWdOYW1lKSl7XHJcblx0XHR2YXIgZWxFbmRTdGFydCA9ICBzb3VyY2UuaW5kZXhPZignPC8nK3RhZ05hbWUrJz4nLGVsU3RhcnRFbmQpO1xyXG5cdFx0dmFyIHRleHQgPSBzb3VyY2Uuc3Vic3RyaW5nKGVsU3RhcnRFbmQrMSxlbEVuZFN0YXJ0KTtcclxuXHRcdGlmKC9bJjxdLy50ZXN0KHRleHQpKXtcclxuXHRcdFx0aWYoL15zY3JpcHQkL2kudGVzdCh0YWdOYW1lKSl7XHJcblx0XHRcdFx0Ly9pZighL1xcXVxcXT4vLnRlc3QodGV4dCkpe1xyXG5cdFx0XHRcdFx0Ly9sZXhIYW5kbGVyLnN0YXJ0Q0RBVEEoKTtcclxuXHRcdFx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh0ZXh0LDAsdGV4dC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0Ly9sZXhIYW5kbGVyLmVuZENEQVRBKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZWxFbmRTdGFydDtcclxuXHRcdFx0XHQvL31cclxuXHRcdFx0fS8vfWVsc2V7Ly90ZXh0IGFyZWFcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnModGV4dCwwLHRleHQubGVuZ3RoKTtcclxuXHRcdFx0XHRyZXR1cm4gZWxFbmRTdGFydDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZWxTdGFydEVuZCsxO1xyXG59XHJcbmZ1bmN0aW9uIGZpeFNlbGZDbG9zZWQoc291cmNlLGVsU3RhcnRFbmQsdGFnTmFtZSxjbG9zZU1hcCl7XHJcblx0Ly9pZih0YWdOYW1lIGluIGNsb3NlTWFwKXtcclxuXHR2YXIgcG9zID0gY2xvc2VNYXBbdGFnTmFtZV07XHJcblx0aWYocG9zID09IG51bGwpe1xyXG5cdFx0Ly9jb25zb2xlLmxvZyh0YWdOYW1lKVxyXG5cdFx0cG9zID0gIHNvdXJjZS5sYXN0SW5kZXhPZignPC8nK3RhZ05hbWUrJz4nKVxyXG5cdFx0aWYocG9zPGVsU3RhcnRFbmQpey8v5b+Y6K6w6Zet5ZCIXHJcblx0XHRcdHBvcyA9IHNvdXJjZS5sYXN0SW5kZXhPZignPC8nK3RhZ05hbWUpXHJcblx0XHR9XHJcblx0XHRjbG9zZU1hcFt0YWdOYW1lXSA9cG9zXHJcblx0fVxyXG5cdHJldHVybiBwb3M8ZWxTdGFydEVuZDtcclxuXHQvL30gXHJcbn1cclxuZnVuY3Rpb24gX2NvcHkoc291cmNlLHRhcmdldCl7XHJcblx0Zm9yKHZhciBuIGluIHNvdXJjZSl7dGFyZ2V0W25dID0gc291cmNlW25dfVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlRENDKHNvdXJjZSxzdGFydCxkb21CdWlsZGVyLGVycm9ySGFuZGxlcil7Ly9zdXJlIHN0YXJ0IHdpdGggJzwhJ1xyXG5cdHZhciBuZXh0PSBzb3VyY2UuY2hhckF0KHN0YXJ0KzIpXHJcblx0c3dpdGNoKG5leHQpe1xyXG5cdGNhc2UgJy0nOlxyXG5cdFx0aWYoc291cmNlLmNoYXJBdChzdGFydCArIDMpID09PSAnLScpe1xyXG5cdFx0XHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJy0tPicsc3RhcnQrNCk7XHJcblx0XHRcdC8vYXBwZW5kIGNvbW1lbnQgc291cmNlLnN1YnN0cmluZyg0LGVuZCkvLzwhLS1cclxuXHRcdFx0aWYoZW5kPnN0YXJ0KXtcclxuXHRcdFx0XHRkb21CdWlsZGVyLmNvbW1lbnQoc291cmNlLHN0YXJ0KzQsZW5kLXN0YXJ0LTQpO1xyXG5cdFx0XHRcdHJldHVybiBlbmQrMztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZXJyb3JIYW5kbGVyLmVycm9yKFwiVW5jbG9zZWQgY29tbWVudFwiKTtcclxuXHRcdFx0XHRyZXR1cm4gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHQvL2Vycm9yXHJcblx0XHRcdHJldHVybiAtMTtcclxuXHRcdH1cclxuXHRkZWZhdWx0OlxyXG5cdFx0aWYoc291cmNlLnN1YnN0cihzdGFydCszLDYpID09ICdDREFUQVsnKXtcclxuXHRcdFx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCddXT4nLHN0YXJ0KzkpO1xyXG5cdFx0XHRkb21CdWlsZGVyLnN0YXJ0Q0RBVEEoKTtcclxuXHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHNvdXJjZSxzdGFydCs5LGVuZC1zdGFydC05KTtcclxuXHRcdFx0ZG9tQnVpbGRlci5lbmRDREFUQSgpIFxyXG5cdFx0XHRyZXR1cm4gZW5kKzM7XHJcblx0XHR9XHJcblx0XHQvLzwhRE9DVFlQRVxyXG5cdFx0Ly9zdGFydERURChqYXZhLmxhbmcuU3RyaW5nIG5hbWUsIGphdmEubGFuZy5TdHJpbmcgcHVibGljSWQsIGphdmEubGFuZy5TdHJpbmcgc3lzdGVtSWQpIFxyXG5cdFx0dmFyIG1hdGNocyA9IHNwbGl0KHNvdXJjZSxzdGFydCk7XHJcblx0XHR2YXIgbGVuID0gbWF0Y2hzLmxlbmd0aDtcclxuXHRcdGlmKGxlbj4xICYmIC8hZG9jdHlwZS9pLnRlc3QobWF0Y2hzWzBdWzBdKSl7XHJcblx0XHRcdHZhciBuYW1lID0gbWF0Y2hzWzFdWzBdO1xyXG5cdFx0XHR2YXIgcHViaWQgPSBsZW4+MyAmJiAvXnB1YmxpYyQvaS50ZXN0KG1hdGNoc1syXVswXSkgJiYgbWF0Y2hzWzNdWzBdXHJcblx0XHRcdHZhciBzeXNpZCA9IGxlbj40ICYmIG1hdGNoc1s0XVswXTtcclxuXHRcdFx0dmFyIGxhc3RNYXRjaCA9IG1hdGNoc1tsZW4tMV1cclxuXHRcdFx0ZG9tQnVpbGRlci5zdGFydERURChuYW1lLHB1YmlkICYmIHB1YmlkLnJlcGxhY2UoL14oWydcIl0pKC4qPylcXDEkLywnJDInKSxcclxuXHRcdFx0XHRcdHN5c2lkICYmIHN5c2lkLnJlcGxhY2UoL14oWydcIl0pKC4qPylcXDEkLywnJDInKSk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuZW5kRFREKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gbGFzdE1hdGNoLmluZGV4K2xhc3RNYXRjaFswXS5sZW5ndGhcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIC0xO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSW5zdHJ1Y3Rpb24oc291cmNlLHN0YXJ0LGRvbUJ1aWxkZXIpe1xyXG5cdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignPz4nLHN0YXJ0KTtcclxuXHRpZihlbmQpe1xyXG5cdFx0dmFyIG1hdGNoID0gc291cmNlLnN1YnN0cmluZyhzdGFydCxlbmQpLm1hdGNoKC9ePFxcPyhcXFMqKVxccyooW1xcc1xcU10qPylcXHMqJC8pO1xyXG5cdFx0aWYobWF0Y2gpe1xyXG5cdFx0XHR2YXIgbGVuID0gbWF0Y2hbMF0ubGVuZ3RoO1xyXG5cdFx0XHRkb21CdWlsZGVyLnByb2Nlc3NpbmdJbnN0cnVjdGlvbihtYXRjaFsxXSwgbWF0Y2hbMl0pIDtcclxuXHRcdFx0cmV0dXJuIGVuZCsyO1xyXG5cdFx0fWVsc2V7Ly9lcnJvclxyXG5cdFx0XHRyZXR1cm4gLTE7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAtMTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBzb3VyY2VcclxuICovXHJcbmZ1bmN0aW9uIEVsZW1lbnRBdHRyaWJ1dGVzKHNvdXJjZSl7XHJcblx0XHJcbn1cclxuRWxlbWVudEF0dHJpYnV0ZXMucHJvdG90eXBlID0ge1xyXG5cdHNldFRhZ05hbWU6ZnVuY3Rpb24odGFnTmFtZSl7XHJcblx0XHRpZighdGFnTmFtZVBhdHRlcm4udGVzdCh0YWdOYW1lKSl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0YWdOYW1lOicrdGFnTmFtZSlcclxuXHRcdH1cclxuXHRcdHRoaXMudGFnTmFtZSA9IHRhZ05hbWVcclxuXHR9LFxyXG5cdGFkZDpmdW5jdGlvbihxTmFtZSx2YWx1ZSxvZmZzZXQpe1xyXG5cdFx0aWYoIXRhZ05hbWVQYXR0ZXJuLnRlc3QocU5hbWUpKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGF0dHJpYnV0ZTonK3FOYW1lKVxyXG5cdFx0fVxyXG5cdFx0dGhpc1t0aGlzLmxlbmd0aCsrXSA9IHtxTmFtZTpxTmFtZSx2YWx1ZTp2YWx1ZSxvZmZzZXQ6b2Zmc2V0fVxyXG5cdH0sXHJcblx0bGVuZ3RoOjAsXHJcblx0Z2V0TG9jYWxOYW1lOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLmxvY2FsTmFtZX0sXHJcblx0Z2V0TG9jYXRvcjpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5sb2NhdG9yfSxcclxuXHRnZXRRTmFtZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5xTmFtZX0sXHJcblx0Z2V0VVJJOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLnVyaX0sXHJcblx0Z2V0VmFsdWU6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0udmFsdWV9XHJcbi8vXHQsZ2V0SW5kZXg6ZnVuY3Rpb24odXJpLCBsb2NhbE5hbWUpKXtcclxuLy9cdFx0aWYobG9jYWxOYW1lKXtcclxuLy9cdFx0XHRcclxuLy9cdFx0fWVsc2V7XHJcbi8vXHRcdFx0dmFyIHFOYW1lID0gdXJpXHJcbi8vXHRcdH1cclxuLy9cdH0sXHJcbi8vXHRnZXRWYWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuZ2V0SW5kZXguYXBwbHkodGhpcyxhcmd1bWVudHMpKX0sXHJcbi8vXHRnZXRUeXBlOmZ1bmN0aW9uKHVyaSxsb2NhbE5hbWUpe31cclxuLy9cdGdldFR5cGU6ZnVuY3Rpb24oaSl7fSxcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gX3NldF9wcm90b18odGhpeixwYXJlbnQpe1xyXG5cdHRoaXouX19wcm90b19fID0gcGFyZW50O1xyXG5cdHJldHVybiB0aGl6O1xyXG59XHJcbmlmKCEoX3NldF9wcm90b18oe30sX3NldF9wcm90b18ucHJvdG90eXBlKSBpbnN0YW5jZW9mIF9zZXRfcHJvdG9fKSl7XHJcblx0X3NldF9wcm90b18gPSBmdW5jdGlvbih0aGl6LHBhcmVudCl7XHJcblx0XHRmdW5jdGlvbiBwKCl7fTtcclxuXHRcdHAucHJvdG90eXBlID0gcGFyZW50O1xyXG5cdFx0cCA9IG5ldyBwKCk7XHJcblx0XHRmb3IocGFyZW50IGluIHRoaXope1xyXG5cdFx0XHRwW3BhcmVudF0gPSB0aGl6W3BhcmVudF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcDtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0KHNvdXJjZSxzdGFydCl7XHJcblx0dmFyIG1hdGNoO1xyXG5cdHZhciBidWYgPSBbXTtcclxuXHR2YXIgcmVnID0gLydbXiddKyd8XCJbXlwiXStcInxbXlxcczw+XFwvPV0rPT98KFxcLz9cXHMqPnw8KS9nO1xyXG5cdHJlZy5sYXN0SW5kZXggPSBzdGFydDtcclxuXHRyZWcuZXhlYyhzb3VyY2UpOy8vc2tpcCA8XHJcblx0d2hpbGUobWF0Y2ggPSByZWcuZXhlYyhzb3VyY2UpKXtcclxuXHRcdGJ1Zi5wdXNoKG1hdGNoKTtcclxuXHRcdGlmKG1hdGNoWzFdKXJldHVybiBidWY7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnRzLlhNTFJlYWRlciA9IFhNTFJlYWRlcjtcclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIm5hbWVcIjogXCJzYmdudml6XCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMy4xLjBcIixcclxuICBcImRlc2NyaXB0aW9uXCI6IFwiU0JHTlBEIHZpc3VhbGl6YXRpb24gbGlicmFyeVwiLFxyXG4gIFwibWFpblwiOiBcInNyYy9pbmRleC5qc1wiLFxyXG4gIFwibGljZW5jZVwiOiBcIkxHUEwtMy4wXCIsXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwidGVzdFwiOiBcImVjaG8gXFxcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFxcXCIgJiYgZXhpdCAxXCIsXHJcbiAgICBcImJ1aWxkLXNiZ252aXotanNcIjogXCJndWxwIGJ1aWxkXCIsXHJcbiAgICBcImRlYnVnLWpzXCI6IFwibm9kZW1vbiAtZSBqcyAtLXdhdGNoIHNyYyAteCBcXFwibnBtIHJ1biBidWlsZC1zYmdudml6LWpzXFxcIlwiXHJcbiAgfSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXHJcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy5naXRcIlxyXG4gIH0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzL2lzc3Vlc1wiXHJcbiAgfSxcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzL1wiLFxyXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcImpxdWVyeVwiOiBcIl4yLjIuNFwiLFxyXG4gICAgXCJmaWxlc2F2ZXJqc1wiOiBcIn4wLjIuMlwiLFxyXG4gICAgXCJjeXRvc2NhcGVcIjogXCJpVmlzLWF0LUJpbGtlbnQvY3l0b3NjYXBlLmpzI3Vuc3RhYmxlXCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwibGlic2Jnbi5qc1wiOiBcImdpdDovL2dpdGh1Yi5jb20vZWlzYm0vbGlic2Jnbi5qc1wiLFxyXG4gICAgXCJwcmV0dHktZGF0YVwiOiBcIl4wLjQwLjBcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJicm93c2VyaWZ5XCI6IFwiXjExLjIuMFwiLFxyXG4gICAgXCJndWxwXCI6IFwiXjMuOS4wXCIsXHJcbiAgICBcImd1bHAtZGVyZXF1aXJlXCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcImd1bHAtanNoaW50XCI6IFwiXjEuMTEuMlwiLFxyXG4gICAgXCJndWxwLXByb21wdFwiOiBcIl4wLjEuMlwiLFxyXG4gICAgXCJndWxwLXJlcGxhY2VcIjogXCJeMC41LjRcIixcclxuICAgIFwiZ3VscC1zaGVsbFwiOiBcIl4wLjUuMFwiLFxyXG4gICAgXCJndWxwLXV0aWxcIjogXCJeMy4wLjZcIixcclxuICAgIFwianNoaW50LXN0eWxpc2hcIjogXCJeMi4wLjFcIixcclxuICAgIFwibm9kZS1ub3RpZmllclwiOiBcIl40LjMuMVwiLFxyXG4gICAgXCJydW4tc2VxdWVuY2VcIjogXCJeMS4xLjRcIixcclxuICAgIFwidmlueWwtYnVmZmVyXCI6IFwiXjEuMC4wXCIsXHJcbiAgICBcInZpbnlsLXNvdXJjZS1zdHJlYW1cIjogXCJeMS4xLjBcIlxyXG4gIH1cclxufVxyXG4iLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgc2JnbnZpeiA9IHdpbmRvdy5zYmdudml6ID0gZnVuY3Rpb24oX29wdGlvbnMsIF9saWJzKSB7XHJcbiAgICB2YXIgbGlicyA9IHt9O1xyXG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xyXG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xyXG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcclxuICAgIFxyXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxyXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcclxuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xyXG4gICAgXHJcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7XHJcbiAgICBcclxuICAgIHZhciBzYmduUmVuZGVyZXIgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyJyk7XHJcbiAgICB2YXIgc2JnbkN5SW5zdGFuY2UgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlJyk7XHJcbiAgICBcclxuICAgIC8vIFV0aWxpdGllcyB3aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSBleHBvc2VkIHNlcGVyYXRlbHlcclxuICAgIHZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VpLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIGZpbGVVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9maWxlLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XHJcbiAgICByZXF1aXJlKCcuL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMnKTsgLy8gcmVxdWlyZSBrZXlib3JkIGlucHV0IHV0aWxpdGllc1xyXG4gICAgLy8gVXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgYXMgaXNcclxuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcclxuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbiAgICBcclxuICAgIHNiZ25SZW5kZXJlcigpO1xyXG4gICAgc2JnbkN5SW5zdGFuY2UoKTtcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcclxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpcywgbW9zdCB1c2VycyB3aWxsIG5vdCBuZWVkIHRoZXNlXHJcbiAgICBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBmaWxlVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBmaWxlVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiB1aVV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gdWlVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIHNiZ24gZ3JhcGggdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGdyYXBoVXRpbGl0aWVzKSB7XHJcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBncmFwaFV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNiZ252aXo7XHJcbiAgfVxyXG59KSgpOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbnZhciByZWZyZXNoUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MuYmluZChncmFwaFV0aWxpdGllcyk7XHJcblxyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIGdldENvbXBvdW5kUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcclxuICAvLyBSZXR1cm4gY2FsY3VsYXRlZCBwYWRkaW5ncyBpbiBjYXNlIG9mIHRoYXQgZGF0YSBpcyBpbnZhbGlkIHJldHVybiA1XHJcbiAgcmV0dXJuIGdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZWRQYWRkaW5ncyB8fCA1O1xyXG59O1xyXG5cclxuLypcclxuICogUmV0dXJucyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50IGxvY2F0ZWQgb24gdGhlIGdpdmVuIGFuZ2xlIG9uIHRoZSBjaXJjbGUgd2l0aCB0aGUgZ2l2ZW4gY2VudGVyYWwgY29vcmRpbmF0ZXMgYW5kIHJhZGl1cy5cclxuICovXHJcbnZhciBnZXRQb2ludE9uQ2lyY2xlID0gZnVuY3Rpb24oY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBhbmdsZUluRGVncmVlKSB7XHJcblx0dmFyIGFuZ2xlSW5SYWRpYW4gPSBhbmdsZUluRGVncmVlICogKCBNYXRoLlBJIC8gMTgwICk7IC8vIENvbnZlcnQgZGVncmVlIHRvIHJhZGlhblxyXG5cdHJldHVybiB7XHJcblx0XHR4OiByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFuKSArIGNlbnRlclgsXHJcblx0XHR5OiAtMSAqIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlSW5SYWRpYW4pICsgY2VudGVyWSAvLyBXZSBtdWx0aXBseSB3aXRoIC0xIGhlcmUgYmVjYXVzZSBKUyB5IGNvb3JkaW5hdGUgc2lnbiBpcyB0aGUgb3Bvc2l0ZSBvZiB0aGUgTWF0aGFtYXRpY2FsIGNvb3JkaW5hdGVzIHN5c3RlbVxyXG5cdH07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBHZW5lcmF0ZXMgYSBwb2x5Z29uIHN0cmluZyBhcHByb3hpbWF0aW5nIGEgY2lyY2xlIHdpdGggZ2l2ZW4gY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQgYW5nbGVzIGFuZCBudW1iZXIgb2YgcG9pbnRzIHRvIHJlcHJlc2VudCB0aGUgY2lyY2xlXHJcbiAqL1xyXG52YXIgZ2VuZXJhdGVDaXJjbGVTdHJpbmcgPSBmdW5jdGlvbihjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlRnJvbSwgYW5nbGVUbywgbnVtT2ZQb2ludHMpIHtcclxuXHR2YXIgY2lyY2xlU3RyID0gXCJcIjtcclxuXHR2YXIgc3RlcFNpemUgPSAoIGFuZ2xlVG8gLSBhbmdsZUZyb20gKSAvIG51bU9mUG9pbnRzOyAvLyBXZSB3aWxsIGluY3JlbWVudCB0aGUgY3VycmVudCBhbmdsZSBieSBzdGVwIHNpemUgaW4gZWFjaCBpdGVyYXRpb25cclxuXHR2YXIgY3VycmVudEFuZ2xlID0gYW5nbGVGcm9tOyAvLyBjdXJyZW50IGFuZ2xlIHdpbGwgYmUgdXBkYXRlZCBpbiBlYWNoIGl0ZXJhdGlvblxyXG5cdFxyXG5cdGZvciAoIHZhciBpID0gMDsgaSA8IG51bU9mUG9pbnRzOyBpKysgKSB7XHJcblx0XHR2YXIgcG9pbnQgPSBnZXRQb2ludE9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgY3VycmVudEFuZ2xlKTtcclxuXHRcdGN1cnJlbnRBbmdsZSArPSBzdGVwU2l6ZTtcclxuXHRcdGNpcmNsZVN0ciArPSBwb2ludC54ICsgXCIgXCIgKyBwb2ludC55ICsgXCIgXCI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBjaXJjbGVTdHI7XHJcbn07XHJcblxyXG4vKlxyXG4gKiAgR2VuZXJhdGVzIGEgc3RyaW5nIHJlcHJlc2VudGluZyBwcm9jZXNzZXMvbG9naWNhbCBvcGVyYXRvcnMgd2l0aCBwb3J0cy5cclxuICogIGxpbmVIVzogSGFsZiB3aWR0aCBvZiBsaW5lIHRocm91Z2ggdGhlIGNpcmNsZSB0byB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAqICBzaGFwZUhXOiBIYWxmIHdpZHRoIG9mIHRoZSBzaGFwZSBkaXNjbHVkaW5nIHRoZSBwb3J0cyAoSXQgaXMgcmFkaXVzIGZvciB0aGUgY2lyY3VsYXIgc2hhcGVzKVxyXG4gKiAgdHlwZTogVHlwZSBvZiB0aGUgc2hhcGUgZGlzY2x1ZGluZyB0aGUgcG9ydHMuIE9wdGlvbnMgYXJlICdjaXJjbGUnLCAncmVjdGFuZ2xlJ1xyXG4gKiAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uIG9mIHRoZSBwb3J0cyBPcHRpb25zIGFyZSAnaG9yaXpvbnRhbCcsICd2ZXJ0aWNhbCdcclxuICovXHJcblxyXG52YXIgZ2VuZXJhdGVTaGFwZVdpdGhQb3J0U3RyaW5nID0gZnVuY3Rpb24obGluZUhXLCBzaGFwZUhXLCB0eXBlLCBvcmllbnRhdGlvbikge1xyXG5cdHZhciBwb2x5Z29uU3RyO1xyXG4gICAgdmFyIG51bU9mUG9pbnRzID0gMzA7IC8vIE51bWJlciBvZiBwb2ludHMgdGhhdCBib3RoIGhhbHZlcyBvZiBjaXJjbGUgd2lsbCBoYXZlXHJcblx0aWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuXHRcdHZhciBhYm92ZVBvaW50cywgYmVsb3dQb2ludHM7XHJcblx0XHJcblx0XHRpZiAodHlwZSA9PT0gJ2NpcmNsZScpIHtcclxuXHRcdFx0YWJvdmVQb2ludHMgPSBnZW5lcmF0ZUNpcmNsZVN0cmluZygwLCAwLCBzaGFwZUhXLCAxODAsIDAsIG51bU9mUG9pbnRzKTtcclxuXHRcdFx0YmVsb3dQb2ludHMgPSBnZW5lcmF0ZUNpcmNsZVN0cmluZygwLCAwLCBzaGFwZUhXLCAzNjAsIDE4MCwgbnVtT2ZQb2ludHMpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ3JlY3RhbmdsZScpIHtcclxuXHRcdFx0YWJvdmVQb2ludHMgPSAnLScgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnICc7XHJcblx0XHRcdGJlbG93UG9pbnRzID0gc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnICc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHBvbHlnb25TdHIgPSBcIi0xIC1cIiArIGxpbmVIVyArIFwiIC1cIiArIHNoYXBlSFcgKyBcIiAtXCIgKyBsaW5lSFcgKyBcIiBcIjtcdFxyXG5cdFx0cG9seWdvblN0ciArPSBhYm92ZVBvaW50cztcclxuXHRcdHBvbHlnb25TdHIgKz0gc2hhcGVIVyArIFwiIC1cIiArIGxpbmVIVyArIFwiIDEgLVwiICsgbGluZUhXICsgXCIgMSBcIiArIGxpbmVIVyArIFwiIFwiICsgc2hhcGVIVyArIFwiIFwiICsgbGluZUhXICsgXCIgXCI7XHJcblx0XHRwb2x5Z29uU3RyICs9IGJlbG93UG9pbnRzO1xyXG5cdFx0cG9seWdvblN0ciArPSBcIi1cIiArIHNoYXBlSFcgKyBcIiBcIiArIGxpbmVIVyArIFwiIC0xIFwiICsgbGluZUhXO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHZhciBsZWZ0UG9pbnRzLCByaWdodFBvaW50cztcclxuXHRcdFxyXG5cdFx0aWYgKHR5cGUgPT09ICdjaXJjbGUnKSB7XHJcblx0XHRcdGxlZnRQb2ludHMgPSBnZW5lcmF0ZUNpcmNsZVN0cmluZygwLCAwLCBzaGFwZUhXLCA5MCwgMjcwLCBudW1PZlBvaW50cyk7XHJcblx0XHRcdHJpZ2h0UG9pbnRzID0gZ2VuZXJhdGVDaXJjbGVTdHJpbmcoMCwgMCwgc2hhcGVIVywgLTkwLCA5MCwgbnVtT2ZQb2ludHMpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ3JlY3RhbmdsZScpIHtcclxuXHRcdFx0bGVmdFBvaW50cyA9ICctJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgJztcclxuXHRcdFx0cmlnaHRQb2ludHMgPSBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgJzsgXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHBvbHlnb25TdHIgPSBcIi1cIiArIGxpbmVIVyArIFwiIC1cIiArIDEgKyBcIiAtXCIgKyBsaW5lSFcgKyBcIiAtXCIgKyBzaGFwZUhXICsgXCIgXCI7XHJcblx0XHRwb2x5Z29uU3RyICs9IGxlZnRQb2ludHM7XHJcblx0XHRwb2x5Z29uU3RyICs9IFwiLVwiICsgbGluZUhXICsgXCIgXCIgKyBzaGFwZUhXICsgXCIgLVwiICsgbGluZUhXICsgXCIgMSBcIiArIGxpbmVIVyArIFwiIDEgXCIgKyBsaW5lSFcgKyBcIiBcIiArIHNoYXBlSFcgKyBcIiBcIjtcclxuXHRcdHBvbHlnb25TdHIgKz0gcmlnaHRQb2ludHM7XHJcblx0XHRwb2x5Z29uU3RyICs9IGxpbmVIVyArIFwiIC1cIiArIHNoYXBlSFcgKyBcIiBcIiArIGxpbmVIVyArIFwiIC0xXCI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBwb2x5Z29uU3RyO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGNvbnRhaW5lclNlbGVjdG9yID0gb3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I7XHJcbiAgdmFyIGltZ1BhdGggPSBvcHRpb25zLmltZ1BhdGg7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKClcclxuICB7XHJcbiAgICB2YXIgc2Jnbk5ldHdvcmtDb250YWluZXIgPSAkKGNvbnRhaW5lclNlbGVjdG9yKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgYW5kIGluaXQgY3l0b3NjYXBlOlxyXG4gICAgdmFyIGN5ID0gY3l0b3NjYXBlKHtcclxuICAgICAgY29udGFpbmVyOiBzYmduTmV0d29ya0NvbnRhaW5lcixcclxuICAgICAgc3R5bGU6IHNiZ25TdHlsZVNoZWV0LFxyXG4gICAgICBzaG93T3ZlcmxheTogZmFsc2UsIG1pblpvb206IDAuMTI1LCBtYXhab29tOiAxNixcclxuICAgICAgYm94U2VsZWN0aW9uRW5hYmxlZDogdHJ1ZSxcclxuICAgICAgbW90aW9uQmx1cjogdHJ1ZSxcclxuICAgICAgd2hlZWxTZW5zaXRpdml0eTogMC4xLFxyXG4gICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5jeSA9IHRoaXM7XHJcbiAgICAgICAgLy8gSWYgdW5kb2FibGUgcmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcclxuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICAgICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYmluZEN5RXZlbnRzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIE5vdGUgdGhhdCBpbiBDaGlTRSB0aGlzIGZ1bmN0aW9uIGlzIGluIGEgc2VwZXJhdGUgZmlsZSBidXQgaW4gdGhlIHZpZXdlciBpdCBoYXMganVzdCAyIG1ldGhvZHMgYW5kIHNvIGl0IGlzIGxvY2F0ZWQgaW4gdGhpcyBmaWxlXHJcbiAgZnVuY3Rpb24gcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKSB7XHJcbiAgICAvLyBjcmVhdGUgb3IgZ2V0IHRoZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXHJcbiAgICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVOb2Rlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGJpbmRDeUV2ZW50cygpIHtcclxuICAgIGN5Lm9uKCd0YXBlbmQnLCAnbm9kZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlY29sbGFwc2VcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIC8vVGhlIGNoaWxkcmVuIGluZm8gb2YgY29tcGxleCBub2RlcyBzaG91bGQgYmUgc2hvd24gd2hlbiB0aGV5IGFyZSBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgICAgIC8vVGhlIG5vZGUgaXMgYmVpbmcgY29sbGFwc2VkIHN0b3JlIGluZm9sYWJlbCB0byB1c2UgaXQgbGF0ZXJcclxuICAgICAgICB2YXIgaW5mb0xhYmVsID0gZWxlbWVudFV0aWxpdGllcy5nZXRJbmZvTGFiZWwobm9kZSk7XHJcbiAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbCA9IGluZm9MYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcclxuICAgICAgLy8gcmVtb3ZlIGJlbmQgcG9pbnRzIGJlZm9yZSBjb2xsYXBzZVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcclxuICAgICAgICBpZiAoZWRnZS5oYXNDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKSkge1xyXG4gICAgICAgICAgZWRnZS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcclxuICAgICAgICAgIGRlbGV0ZSBlZGdlLl9wcml2YXRlLmNsYXNzZXNbJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJ107XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XHJcbiAgICAgIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5iZWZvcmVleHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYWZ0ZXJleHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcbiAgICAgIGN5Lm5vZGVzKCkudXBkYXRlQ29tcG91bmRCb3VuZHMoKTtcclxuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgICAgICBub2RlLnJlbW92ZVN0eWxlKCdjb250ZW50Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNiZ25TdHlsZVNoZWV0ID0gY3l0b3NjYXBlLnN0eWxlc2hlZXQoKVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgICAgICAgICAndGV4dC1vcGFjaXR5JzogMSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiAxLFxyXG4gICAgICAgICAgICAncGFkZGluZyc6IDAsXHJcbiAgICAgICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnBhcmVudFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdwYWRkaW5nJzogZ2V0Q29tcG91bmRQYWRkaW5nc1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbP2Nsb25lbWFya2VyXVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddLG5vZGVbP2Nsb25lbWFya2VyXVtjbGFzcz0ndW5zcGVjaWZpZWQgZW50aXR5J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGltZ1BhdGggKyAnL2Nsb25lX2JnLnBuZycsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnOiAnNTAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teSc6ICcxMDAlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWhlaWdodCc6ICcyNSUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1maXQnOiAnbm9uZScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YSgnY2xvbmVtYXJrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEN5U2hhcGUoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbnRlbnQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RWxlbWVudENvbnRlbnQoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nYXNzb2NpYXRpb24nXSxbY2xhc3M9J2Rpc3NvY2lhdGlvbiddLFtjbGFzcz0nYW5kJ10sW2NsYXNzPSdvciddLFtjbGFzcz0nbm90J10sW2NsYXNzPSdwcm9jZXNzJ10sW2NsYXNzPSdvbWl0dGVkIHByb2Nlc3MnXSxbY2xhc3M9J3VuY2VydGFpbiBwcm9jZXNzJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICAgICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID09PSB0cnVlICYmIGVsZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgYXNzdW1lIHRoYXQgdGhlIHBvcnRzIG9mIHRoZSBlZGdlIGFyZSBzeW1ldHJpYyBhY2NvcmRpbmcgdG8gdGhlIG5vZGUgY2VudGVyIHNvIGp1c3QgY2hlY2tpbmcgb25lIHBvcnQgaXMgZW5vdWdoIGZvciB1c1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcnQgPSBlbGUuZGF0YSgncG9ydHMnKVswXTsgXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcG9ydHMgYXJlIGxvY2F0ZWQgYWJvdmUvYmVsb3cgb2YgdGhlIG5vZGUgdGhlbiB0aGUgb3JpZW50YXRpb24gaXMgJ3ZlcnRpY2FsJyBlbHNlIGl0IGlzICdob3Jpem9udGFsJ1xyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gcG9ydC54ID09PSAwID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBoYWxmIHdpZHRoIG9mIHRoZSBhY3R1YWwgc2hhcGUgZGlzY2x1ZGluZyB0aGUgcG9ydHNcclxuICAgICAgICAgICAgICAgIHZhciBzaGFwZUhXID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyA1MCAvIE1hdGguYWJzKHBvcnQueSkgOiA1MCAvIE1hdGguYWJzKHBvcnQueCk7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGNsYXNzIG9mIHRoZSBub2RlXHJcbiAgICAgICAgICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBjbGFzcyBpcyBvbmUgb2YgcHJvY2Vzcywgb21pdHRlZCBwcm9jZXNzIG9yIHVuY2VydGFpbiBwcm9jZXNzIHRoZW4gdGhlIHR5cGUgb2YgYWN0dWFsIHNoYXBlIGlzICdyZWN0YW5nbGUnIGVsc2UgaXQgaXMgJ2NpcmNsZSdcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gX2NsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJykgPyAncmVjdGFuZ2xlJyA6ICdjaXJjbGUnO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIHBvbHlnb24gc3RyaW5nIHdpdGggYWJvdmUgcGFyYW1ldGVycyBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVTaGFwZVdpdGhQb3J0U3RyaW5nKDAuMDEsIHNoYXBlSFcsIHR5cGUsIG9yaWVudGF0aW9uKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgLy8gVGhpcyBlbGVtZW50IGlzIG5vdCBleHBlY3RlZCB0byBoYXZlIGEgcG95Z29uaWFsIHNoYXBlIChCZWNhdXNlIGl0IGRvZXMgbm90IGhhdmUgMiBwb3J0cykganVzdCByZXR1cm4gYSB0cml2aWFsIHN0cmluZyBoZXJlIG5vdCB0byBoYXZlIGEgcnVuIHRpbWUgYnVnXHJcbiAgICAgICAgICAgICAgcmV0dXJuICctMSAtMSAxIDEgMSAwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgLTAuNSwgMCwgIC0xLCAxLCAgIDEsIDEsICAgMC41LCAwLCAxLCAtMSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSd0YWcnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J2NvbXBhcnRtZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy4yNSxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAsXHJcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgJ3RleHQtbWFyZ2luLXknIDogLTEgKiBvcHRpb25zLmV4dHJhQ29tcGFydG1lbnRQYWRkaW5nXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpwYXJlbnRbY2xhc3M9J2NvbXBhcnRtZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAncGFkZGluZyc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBnZXRDb21wb3VuZFBhZGRpbmdzKCkgKyBvcHRpb25zLmV4dHJhQ29tcGFydG1lbnRQYWRkaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpjaGlsZGxlc3NbYmJveF1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnd2lkdGgnOiAnZGF0YShiYm94LncpJyxcclxuICAgICAgICAgICAgJ2hlaWdodCc6ICdkYXRhKGJib3guaCknXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZS5jeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnd2lkdGgnOiAzNixcclxuICAgICAgICAgICAgJ2hlaWdodCc6IDM2LFxyXG4gICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ2Rhc2hlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjMDAwJyxcclxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6YWN0aXZlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdvdmVybGF5LXBhZGRpbmcnOiAnMTQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxyXG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2hvbGxvdycsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiAxLjI1LFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnbGluZS1jb2xvcicpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnbGluZS1jb2xvcicpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnYXJyb3ctc2NhbGUnOiAxLjI1XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZS5jeS1leHBhbmQtY29sbGFwc2UtbWV0YS1lZGdlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI0M0QzRDNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RleHQtcm90YXRpb24nOiAnYXV0b3JvdGF0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtc2hhcGUnOiAncmVjdGFuZ2xlJyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci13aWR0aCc6ICcxJyxcclxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J2NvbnN1bXB0aW9uJ11bY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzb3VyY2UtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ2NhcmRpbmFsaXR5Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxyXG4gICAgICAgICAgICAnc291cmNlLXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1sYWJlbCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3RhcmdldC10ZXh0LW1hcmdpbi15JzogJy0xMCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZShlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEN5QXJyb3dTaGFwZShlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LXNoYXBlJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAnc291cmNlLWVuZHBvaW50JzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RW5kUG9pbnQoZWxlLCAnc291cmNlJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd0YXJnZXQtZW5kcG9pbnQnOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbmRQb2ludChlbGUsICd0YXJnZXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J2luaGliaXRpb24nXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1maWxsJzogJ2ZpbGxlZCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJjb3JlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LW9wYWNpdHknOiAnMC4yJywgJ3NlbGVjdGlvbi1ib3gtYm9yZGVyLWNvbG9yJzogJyNkNjc2MTQnXHJcbiAgICAgICAgICB9KTtcclxufTtcclxuIiwiLypcclxuICogUmVuZGVyIHNiZ24gc3BlY2lmaWMgc2hhcGVzIHdoaWNoIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGN5dG9zY2FwZS5qcyBjb3JlXHJcbiAqL1xyXG5cclxudmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xyXG5cclxudmFyIGN5TWF0aCA9IGN5dG9zY2FwZS5tYXRoO1xyXG52YXIgY3lCYXNlTm9kZVNoYXBlcyA9IGN5dG9zY2FwZS5iYXNlTm9kZVNoYXBlcztcclxudmFyIGN5U3R5bGVQcm9wZXJ0aWVzID0gY3l0b3NjYXBlLnN0eWxlUHJvcGVydGllcztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcclxuICBcclxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qcyBhbmQgbW9kaWZpZWRcclxuICB2YXIgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aCA9IGZ1bmN0aW9uKFxyXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzICl7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuICAgIHZhciBjb3JuZXJSYWRpdXMgPSByYWRpdXMgfHwgY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKCB3aWR0aCwgaGVpZ2h0ICk7XHJcblxyXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cclxuXHJcbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXHJcbiAgICBjb250ZXh0Lm1vdmVUbyggeCwgeSAtIGhhbGZIZWlnaHQgKTtcclxuICAgIC8vIEFyYyBmcm9tIG1pZGRsZSB0b3AgdG8gcmlnaHQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSAtIGhhbGZIZWlnaHQsIHggKyBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gQXJjIGZyb20gcmlnaHQgc2lkZSB0byBib3R0b21cclxuICAgIGNvbnRleHQuYXJjVG8oIHggKyBoYWxmV2lkdGgsIHkgKyBoYWxmSGVpZ2h0LCB4LCB5ICsgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzICk7XHJcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXHJcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCAtIGhhbGZXaWR0aCwgeSwgY29ybmVyUmFkaXVzICk7XHJcbiAgICAvLyBBcmMgZnJvbSBsZWZ0IHNpZGUgdG8gdG9wQm9yZGVyXHJcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCwgeSAtIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gSm9pbiBsaW5lXHJcbiAgICBjb250ZXh0LmxpbmVUbyggeCwgeSAtIGhhbGZIZWlnaHQgKTtcclxuXHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIFRha2VuIGZyb20gY3l0b3NjYXBlLmpzXHJcbiAgdmFyIGRyYXdQb2x5Z29uUGF0aCA9IGZ1bmN0aW9uKFxyXG4gICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgcG9pbnRzICl7XHJcblxyXG4gICAgdmFyIGhhbGZXID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICBpZiggY29udGV4dC5iZWdpblBhdGggKXsgY29udGV4dC5iZWdpblBhdGgoKTsgfVxyXG5cclxuICAgIGNvbnRleHQubW92ZVRvKCB4ICsgaGFsZlcgKiBwb2ludHNbMF0sIHkgKyBoYWxmSCAqIHBvaW50c1sxXSApO1xyXG5cclxuICAgIGZvciggdmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aCAvIDI7IGkrKyApe1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyggeCArIGhhbGZXICogcG9pbnRzWyBpICogMl0sIHkgKyBoYWxmSCAqIHBvaW50c1sgaSAqIDIgKyAxXSApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgfTtcclxuICBcclxuICB2YXIgc2JnblNoYXBlcyA9ICQkLnNiZ24uc2JnblNoYXBlcyA9IHtcclxuICAgICdzb3VyY2UgYW5kIHNpbmsnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdjb21wbGV4JzogdHJ1ZSxcclxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQuc2Jnbi50b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlcyA9IHtcclxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICdjb21wbGV4JzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciB1bml0T2ZJbmZvUmFkaXVzID0gNDtcclxuICB2YXIgc3RhdGVWYXJSYWRpdXMgPSAxNTtcclxuICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsXHJcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KSB7XHJcblxyXG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XHJcblxyXG4gICAgdmFyIHVwV2lkdGggPSAwLCBkb3duV2lkdGggPSAwO1xyXG4gICAgdmFyIGJveFBhZGRpbmcgPSAxMCwgYmV0d2VlbkJveFBhZGRpbmcgPSA1O1xyXG4gICAgdmFyIGJlZ2luUG9zWSA9IGhlaWdodCAvIDIsIGJlZ2luUG9zWCA9IHdpZHRoIC8gMjtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zLnNvcnQoJCQuc2Jnbi5jb21wYXJlU3RhdGVzKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcclxuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XHJcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcclxuLy8gICAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xyXG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gc3RhdGUuYmJveC55O1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclk7XHJcblxyXG4gICAgICBpZiAocmVsYXRpdmVZUG9zIDwgMCkge1xyXG4gICAgICAgIGlmICh1cFdpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIHVwV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgLSBiZWdpblBvc1k7XHJcblxyXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlWVBvcyA+IDApIHtcclxuICAgICAgICBpZiAoZG93bldpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSArIGJlZ2luUG9zWTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgICAgICd3aWR0aCc6IHN0YXRlV2lkdGgsICdoZWlnaHQnOiBzdGF0ZUhlaWdodH07XHJcblxyXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG93bldpZHRoID0gZG93bldpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxyXG4gICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xyXG5cclxuICAgICAgLy91cGRhdGUgbmV3IHN0YXRlIGFuZCBpbmZvIHBvc2l0aW9uKHJlbGF0aXZlIHRvIG5vZGUgY2VudGVyKVxyXG4gICAgICBzdGF0ZS5iYm94LnggPSAoc3RhdGVDZW50ZXJYIC0gY2VudGVyWCkgKiAxMDAgLyBub2RlLndpZHRoKCk7XHJcbiAgICAgIHN0YXRlLmJib3gueSA9IChzdGF0ZUNlbnRlclkgLSBjZW50ZXJZKSAqIDEwMCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHRleHRQcm9wLnN0YXRlLnZhbHVlIHx8ICcnO1xyXG4gICAgdmFyIHN0YXRlVmFyaWFibGUgPSB0ZXh0UHJvcC5zdGF0ZS52YXJpYWJsZSB8fCAnJztcclxuXHJcbiAgICB2YXIgc3RhdGVMYWJlbCA9IHN0YXRlVmFsdWUgKyAoc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA/IFwiQFwiICsgc3RhdGVWYXJpYWJsZVxyXG4gICAgICAgICAgICA6IFwiXCIpO1xyXG5cclxuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XHJcblxyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZUxhYmVsO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0luZm9UZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XHJcbiAgICB2YXIgZm9udFNpemUgPSA5OyAvLyBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcclxuICAgICQkLnNiZ24uZHJhd1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1RleHQgPSBmdW5jdGlvbiAoY29udGV4dCwgdGV4dFByb3AsIHRydW5jYXRlKSB7XHJcbiAgICB2YXIgb2xkRm9udCA9IGNvbnRleHQuZm9udDtcclxuICAgIGNvbnRleHQuZm9udCA9IHRleHRQcm9wLmZvbnQ7XHJcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dFByb3AuY29sb3I7XHJcbiAgICB2YXIgb2xkT3BhY2l0eSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gdGV4dFByb3Aub3BhY2l0eTtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgXHJcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHRleHRQcm9wLmxhYmVsIHx8ICcnO1xyXG4gICAgXHJcbiAgICBpZiAodHJ1bmNhdGUgPT0gZmFsc2UpIHtcclxuICAgICAgdGV4dCA9IHRleHRQcm9wLmxhYmVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCA9IHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgY29udGV4dC5mb250KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0ZXh0UHJvcC5jZW50ZXJYLCB0ZXh0UHJvcC5jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICBjb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZE9wYWNpdHk7XHJcbiAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgfTtcclxuXHJcbiAgY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlID0gZnVuY3Rpb24gKHBvaW50MSwgcG9pbnQyKSB7XHJcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhwb2ludDFbMF0gLSBwb2ludDJbMF0sIDIpICsgTWF0aC5wb3cocG9pbnQxWzFdIC0gcG9pbnQyWzFdLCAyKTtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoZGlzdGFuY2UpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY29sb3JzID0ge1xyXG4gICAgY2xvbmU6IFwiI2E5YTlhOVwiXHJcbiAgfTtcclxuXHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aCAmJiBpIDwgNDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XHJcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xyXG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XHJcblxyXG4gICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgLy92YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xyXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0IHx8ICcnO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd0luZm9UZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgMCwgMCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgbm9kZSwgdGhyZXNob2xkLCBwb2ludHMsIGNvcm5lclJhZGl1cykge1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIC8vY2hlY2sgcmVjdGFuZ2xlIGF0IHRvcFxyXG4gICAgaWYgKGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgcG9pbnRzLFxyXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZIC0gY29ybmVyUmFkaXVzIC8gMiwgd2lkdGgsIGhlaWdodCAtIGNvcm5lclJhZGl1cyAvIDMsIFswLCAtMV0sXHJcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2hlY2sgcmVjdGFuZ2xlIGF0IGJvdHRvbVxyXG4gICAgaWYgKGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgcG9pbnRzLFxyXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyAvIDIsIHdpZHRoIC0gMiAqIGNvcm5lclJhZGl1cywgY29ybmVyUmFkaXVzLCBbMCwgLTFdLFxyXG4gICAgICAgICAgICBwYWRkaW5nKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NoZWNrIGVsbGlwc2VzXHJcbiAgICB2YXIgY2hlY2tJbkVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xyXG4gICAgICB4IC09IGNlbnRlclg7XHJcbiAgICAgIHkgLT0gY2VudGVyWTtcclxuXHJcbiAgICAgIHggLz0gKHdpZHRoIC8gMiArIHBhZGRpbmcpO1xyXG4gICAgICB5IC89IChoZWlnaHQgLyAyICsgcGFkZGluZyk7XHJcblxyXG4gICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgYm90dG9tIHJpZ2h0IHF1YXJ0ZXIgY2lyY2xlXHJcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcclxuICAgICAgICAgICAgY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBib3R0b20gbGVmdCBxdWFydGVyIGNpcmNsZVxyXG4gICAgaWYgKGNoZWNrSW5FbGxpcHNlKHgsIHksXHJcbiAgICAgICAgICAgIGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjb3JuZXJSYWRpdXMgKiAyLCBjb3JuZXJSYWRpdXMgKiAyLCBwYWRkaW5nKSkge1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIC8vd2UgbmVlZCB0byBmb3JjZSBvcGFjaXR5IHRvIDEgc2luY2Ugd2UgbWlnaHQgaGF2ZSBzdGF0ZSBhbmQgaW5mbyBib3hlcy5cclxuICAvL2hhdmluZyBvcGFxdWUgbm9kZXMgd2hpY2ggaGF2ZSBzdGF0ZSBhbmQgaW5mbyBib3hlcyBnaXZlcyB1bnBsZWFzZW50IHJlc3VsdHMuXHJcbiAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZSA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcGFyZW50T3BhY2l0eSA9IG5vZGUuZWZmZWN0aXZlT3BhY2l0eSgpO1xyXG4gICAgaWYgKHBhcmVudE9wYWNpdHkgPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMF0gKyBcIixcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzFdICsgXCIsXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVsyXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgKDEgKiBub2RlLmNzcygnb3BhY2l0eScpICogcGFyZW50T3BhY2l0eSkgKyBcIilcIjtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGggPSBmdW5jdGlvbiAoXHJcbiAgICAgICAgICBjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuICAgIC8vdmFyIGNvcm5lclJhZGl1cyA9ICQkLm1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4oaGFsZldpZHRoLCBoYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG5cclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgLy8gU3RhcnQgYXQgdG9wIG1pZGRsZVxyXG4gICAgY29udGV4dC5tb3ZlVG8oMCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIGhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIDAsIC1oYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgLy8gSm9pbiBsaW5lXHJcbiAgICBjb250ZXh0LmxpbmVUbygwLCAtaGFsZkhlaWdodCk7XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgteCwgLXkpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XHJcbiAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IC0xICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDA7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xyXG5cclxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgMyAqIE1hdGguUEkgLyA2LCA1ICogTWF0aC5QSSAvIDYpO1xyXG5cclxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgIH1cclxuICB9XHJcbiAgO1xyXG5cclxuICBmdW5jdGlvbiBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XHJcbiAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcblxyXG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IDA7XHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XHJcblxyXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKG1hcmtlckVuZFgsIG1hcmtlckVuZFkpO1xyXG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgMyAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGggPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snZWxsaXBzZSddLmRyYXdQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlID0gZnVuY3Rpb24gKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpIHtcclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgIGNvbnRleHQubW92ZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgY29udGV4dC5saW5lVG8oaGFsZldpZHRoLCAwKTtcclxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgY29udGV4dC5hcmNUbygtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAtaGFsZldpZHRoLCAwLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgY29udGV4dC5saW5lVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQpO1xyXG5cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pc011bHRpbWVyID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHZhciBzYmduQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XHJcbiAgICBpZiAoc2JnbkNsYXNzICYmIHNiZ25DbGFzcy5pbmRleE9mKFwibXVsdGltZXJcIikgIT0gLTEpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBpcyBjcmVhdGVkIHRvIGhhdmUgc2FtZSBjb3JuZXIgbGVuZ3RoIHdoZW5cclxuICAvL2NvbXBsZXgncyB3aWR0aCBvciBoZWlnaHQgaXMgY2hhbmdlZFxyXG4gICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMgPSBmdW5jdGlvbiAoY29ybmVyTGVuZ3RoLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvL2NwIHN0YW5kcyBmb3IgY29ybmVyIHByb3BvcnRpb25cclxuICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XHJcblxyXG4gICAgdmFyIGNvbXBsZXhQb2ludHMgPSBbLTEgKyBjcFgsIC0xLCAtMSwgLTEgKyBjcFksIC0xLCAxIC0gY3BZLCAtMSArIGNwWCxcclxuICAgICAgMSwgMSAtIGNwWCwgMSwgMSwgMSAtIGNwWSwgMSwgLTEgKyBjcFksIDEgLSBjcFgsIC0xXTtcclxuXHJcbiAgICByZXR1cm4gY29tcGxleFBvaW50cztcclxuICB9O1xyXG5cclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc291cmNlIGFuZCBzaW5rJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ2NvbXBsZXgnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnbWFjcm9tb2xlY3VsZScpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzaW1wbGUgY2hlbWljYWwnKTtcclxuXHJcbiAgJCQuc2Jnbi5yZWdpc3RlclNiZ25Ob2RlU2hhcGVzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0gPSB7XHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsKGNvbnRleHQsIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxyXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcclxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQsIHgsIHksIHBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzaW1wbGUgY2hlbWljYWxcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZywgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXSA9IHtcclxuICAgICAgcG9pbnRzOiBbXSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBjb3JuZXJMZW5ndGg6IDEyLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLm91dGVySGVpZ2h0KCktIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcclxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4vLyAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50XHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXHJcbiAgICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gKG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpKSArIHRocmVzaG9sZDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gKG5vZGUub3V0ZXJIZWlnaHQoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSwgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKSxcclxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIDtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNsb25lTWFya2VyID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcclxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcblxyXG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRyYXdQYXRoOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG5cclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcclxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcclxuICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZShub2RlLFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLFxyXG4gICAgICAgICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0gPSB7XHJcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgdmFyIHB0cyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJzb3VyY2UgYW5kIHNpbmtcIl0ucG9pbnRzO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAqIE1hdGguc3FydCgyKSAvIDIsIGhlaWdodCAqIE1hdGguc3FydCgyKSAvIDIpO1xyXG5cclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhwdHNbMl0sIHB0c1szXSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ocHRzWzZdLCBwdHNbN10pO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvICh3aWR0aCAqIE1hdGguc3FydCgyKSksIDIgLyAoaGVpZ2h0ICogTWF0aC5zcXJ0KDIpKSk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUsXHJcbiAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgLy9jb250ZXh0LmZpbGwoKTtcclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2xvbmVNYXJrZXIgPSB7XHJcbiAgICBzaW1wbGVDaGVtaWNhbDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XHJcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclggPSBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBmaXJzdENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XHJcblxyXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgMiAqIGNvcm5lclJhZGl1cywgMiAqIGNvcm5lclJhZGl1cywgY2xvbmVNYXJrZXIsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgcmVjUG9pbnRzID0gY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHNGaXRUb1NxdWFyZSg0LCAwKTtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgLyA0ICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGggLSAyICogY29ybmVyUmFkaXVzO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XHJcblxyXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LCBjbG9uZVgsIGNsb25lWSwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIHJlY1BvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBudWNsZWljQWNpZEZlYXR1cmU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIDMgKiBoZWlnaHQgLyA4O1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hY3JvbW9sZWN1bGU6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KTtcclxuICAgIH0sXHJcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcclxuICAgICAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjbG9uZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcclxuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcclxuICAgICAgICB2YXIgY2xvbmVZID0gY2VudGVyWSArIGhlaWdodCAvIDIgLSBjbG9uZUhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIHZhciBtYXJrZXJQb2ludHMgPSBbLTEsIC0xLCAxLCAtMSwgMSAtIGNwWCwgMSwgLTEgKyBjcFgsIDFdO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksXHJcbiAgICAgICAgICAgICAgICBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgbWFya2VyUG9pbnRzKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcblxyXG4vLyAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwKVxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgdmFyIGNsb3Nlc3RJbnRlcnNlY3Rpb24gPSBbXTtcclxuICAgIHZhciBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgIHZhciBjaGVja1BvaW50ID0gW2ludGVyc2VjdGlvbnNbaV0sIGludGVyc2VjdGlvbnNbaSArIDFdXTtcclxuICAgICAgdmFyIGRpc3RhbmNlID0gY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcclxuXHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBjbG9zZXN0SW50ZXJzZWN0aW9uID0gY2hlY2tQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW50ZXJzZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lID0gZnVuY3Rpb24gKG5vZGUsIHgsIHksIG5vZGVYLCBub2RlWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WCA9IG5vZGVYICsgaGFsZldpZHRoICsgcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xyXG4gICAgICB2YXIgcmlnaHRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksIGJvdHRvbVN0YXJ0WCwgYm90dG9tU3RhcnRZLCBib3R0b21FbmRYLCBib3R0b21FbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHMsIHdlIGhhdmUgb25seSB0d28gYXJjcyBmb3JcclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tUmlnaHRDZW50ZXJZKSB7XHJcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xyXG4gIH07XHJcblxyXG4gIC8vdGhpcyBmdW5jdGlvbiBnaXZlcyB0aGUgaW50ZXJzZWN0aW9ucyBvZiBhbnkgbGluZSB3aXRoIGEgcm91bmQgcmVjdGFuZ2xlIFxyXG4gICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggc3RyYWlnaHQgbGluZSBzZWdtZW50c1xyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBUb3Agc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wU3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0IC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRZID0gdG9wU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgdG9wU3RhcnRYLCB0b3BTdGFydFksIHRvcEVuZFgsIHRvcEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCByaWdodFN0YXJ0WCwgcmlnaHRTdGFydFksIHJpZ2h0RW5kWCwgcmlnaHRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFkgPSBib3R0b21TdGFydFk7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIGxlZnRTdGFydFggPSBub2RlWCAtIGhhbGZXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcclxuICAgICAgdmFyIGxlZnRFbmRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGxlZnRTdGFydFgsIGxlZnRTdGFydFksIGxlZnRFbmRYLCBsZWZ0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzXHJcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcclxuXHJcbiAgICAvLyBUb3AgTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BMZWZ0Q2VudGVyWCwgdG9wTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BMZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvcCBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSB0b3BSaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdIDw9IHRvcFJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBSaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvdHRvbSBMZWZ0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXNcclxuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxyXG4gICAgICAgICAgICAgIGJvdHRvbUxlZnRDZW50ZXJYLCBib3R0b21MZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbUxlZnRDZW50ZXJZKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuXHJcbiAgICB2YXIgdyA9IHdpZHRoIC8gMiArIHBhZGRpbmc7XHJcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGFuID0gY2VudGVyWDtcclxuICAgIHZhciBibiA9IGNlbnRlclk7XHJcblxyXG4gICAgdmFyIGQgPSBbeDIgLSB4MSwgeTIgLSB5MV07XHJcblxyXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcclxuICAgIHZhciBuID0gLTEgKiBtICogeDIgKyB5MjtcclxuICAgIHZhciBhID0gaCAqIGggKyB3ICogdyAqIG0gKiBtO1xyXG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcclxuICAgIHZhciBjID0gYW4gKiBhbiAqIGggKiBoICsgbiAqIG4gKiB3ICogdyAtIDIgKiBibiAqIHcgKiB3ICogbiArXHJcbiAgICAgICAgICAgIGJuICogYm4gKiB3ICogdyAtIGggKiBoICogdyAqIHc7XHJcblxyXG4gICAgdmFyIGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xyXG5cclxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdDEgPSAoLWIgKyBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xyXG4gICAgdmFyIHQyID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuXHJcbiAgICB2YXIgeE1pbiA9IE1hdGgubWluKHQxLCB0Mik7XHJcbiAgICB2YXIgeE1heCA9IE1hdGgubWF4KHQxLCB0Mik7XHJcblxyXG4gICAgdmFyIHlNaW4gPSBtICogeE1pbiAtIG0gKiB4MiArIHkyO1xyXG4gICAgdmFyIHlNYXggPSBtICogeE1heCAtIG0gKiB4MiArIHkyO1xyXG5cclxuICAgIHJldHVybiBbeE1pbiwgeU1pbiwgeE1heCwgeU1heF07XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcblxyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XHJcblxyXG4gICAgdmFyIHN0YXRlQ291bnQgPSAwLCBpbmZvQ291bnQgPSAwO1xyXG5cclxuICAgIHZhciBpbnRlcnNlY3Rpb25zID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XHJcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xyXG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XHJcblxyXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiICYmIHN0YXRlQ291bnQgPCAyKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICB2YXIgc3RhdGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZUVsbGlwc2UoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZUludGVyc2VjdExpbmVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoc3RhdGVJbnRlcnNlY3RMaW5lcyk7XHJcblxyXG4gICAgICAgIHN0YXRlQ291bnQrKztcclxuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgIHZhciBpbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCA1LCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgaWYgKGluZm9JbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KGluZm9JbnRlcnNlY3RMaW5lcyk7XHJcblxyXG4gICAgICAgIGluZm9Db3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgaWYgKGludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcclxuICAgICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHBhZGRpbmcgPXBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XHJcblxyXG4gICAgdmFyIHN0YXRlQ291bnQgPSAwLCBpbmZvQ291bnQgPSAwO1xyXG4vLyAgICB0aHJlc2hvbGQgPSBwYXJzZUZsb2F0KHRocmVzaG9sZCk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XHJcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LncpICsgdGhyZXNob2xkO1xyXG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBwYXJzZUZsb2F0KHN0YXRlLmJib3guaCkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgIHZhciBzdGF0ZUNlbnRlclggPSBzdGF0ZS5iYm94LnggKiBub2RlLndpZHRoKCkgLyAxMDAgKyBjZW50ZXJYO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XHJcblxyXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiICYmIHN0YXRlQ291bnQgPCAyKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICB2YXIgc3RhdGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludChcclxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZUNoZWNrUG9pbnQgPT0gdHJ1ZSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0NoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludChcclxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvQ2hlY2tQb2ludCA9PSB0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGluZm9Db3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaXNOb2RlU2hhcGVUb3RhbGx5T3ZlcnJpZGVuID0gZnVuY3Rpb24gKHJlbmRlciwgbm9kZSkge1xyXG4gICAgaWYgKHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzW3JlbmRlci5nZXROb2RlU2hhcGUobm9kZSldKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG59O1xyXG4iLCIvKlxyXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBlbGVtZW50cyBpbmNsdWRlcyBib3RoIGdlbmVyYWwgdXRpbGl0aWVzIGFuZCBzYmduIHNwZWNpZmljIHV0aWxpdGllcyBcclxuICovXHJcblxyXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG5cclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSB7XHJcbiAgICAvL3RoZSBsaXN0IG9mIHRoZSBlbGVtZW50IGNsYXNzZXMgaGFuZGxlZCBieSB0aGUgdG9vbFxyXG4gICAgaGFuZGxlZEVsZW1lbnRzOiB7XHJcbiAgICAgICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXHJcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAgICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlLFxyXG4gICAgICAgICdzb3VyY2UgYW5kIHNpbmsnOiB0cnVlLFxyXG4gICAgICAgICdjb21wbGV4JzogdHJ1ZSxcclxuICAgICAgICAncHJvY2Vzcyc6IHRydWUsXHJcbiAgICAgICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAgICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcclxuICAgICAgICAnYXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdwaGVub3R5cGUnOiB0cnVlLFxyXG4gICAgICAgICd0YWcnOiB0cnVlLFxyXG4gICAgICAgICdjb25zdW1wdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3Byb2R1Y3Rpb24nOiB0cnVlLFxyXG4gICAgICAgICdtb2R1bGF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnc3RpbXVsYXRpb24nOiB0cnVlLFxyXG4gICAgICAgICdjYXRhbHlzaXMnOiB0cnVlLFxyXG4gICAgICAgICdpbmhpYml0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnbG9naWMgYXJjJzogdHJ1ZSxcclxuICAgICAgICAnZXF1aXZhbGVuY2UgYXJjJzogdHJ1ZSxcclxuICAgICAgICAnYW5kIG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnb3Igb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdub3Qgb3BlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICdhbmQnOiB0cnVlLFxyXG4gICAgICAgICdvcic6IHRydWUsXHJcbiAgICAgICAgJ25vdCc6IHRydWUsXHJcbiAgICAgICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ2NvbXBsZXggbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdjb21wYXJ0bWVudCc6IHRydWVcclxuICAgIH0sXHJcbiAgICAvL3RoZSBmb2xsb3dpbmcgd2VyZSBtb3ZlZCBoZXJlIGZyb20gd2hhdCB1c2VkIHRvIGJlIHV0aWxpdGllcy9zYmduLWZpbHRlcmluZy5qc1xyXG4gICAgcHJvY2Vzc1R5cGVzIDogWydwcm9jZXNzJywgJ29taXR0ZWQgcHJvY2VzcycsICd1bmNlcnRhaW4gcHJvY2VzcycsXHJcbiAgICAgICAgJ2Fzc29jaWF0aW9uJywgJ2Rpc3NvY2lhdGlvbicsICdwaGVub3R5cGUnXSxcclxuICAgIFxyXG4gICAgLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IG9yIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIGNsYXNzIGNhbiBoYXZlIHBvcnRzLlxyXG4gICAgY2FuSGF2ZVBvcnRzIDogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICByZXR1cm4gKCQuaW5BcnJheShzYmduY2xhc3MsIHRoaXMucHJvY2Vzc1R5cGVzKSA+PSAwIHx8ICBzYmduY2xhc3MgPT0gJ2FuZCcgfHwgc2JnbmNsYXNzID09ICdvcicgfHwgc2JnbmNsYXNzID09ICdub3QnKTtcclxuICAgIH0sXHJcbiAgICAgIFxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vdGhpcyBtZXRob2QgcmV0dXJucyB0aGUgbm9kZXMgbm9uIG9mIHdob3NlIGFuY2VzdG9ycyBpcyBub3QgaW4gZ2l2ZW4gbm9kZXNcclxuICAgIGdldFRvcE1vc3ROb2RlczogZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgICAgICAgdmFyIG5vZGVzTWFwID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub2Rlc01hcFtub2Rlc1tpXS5pZCgpXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb290cyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGUucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcclxuICAgICAgICAgICAgICBpZihub2Rlc01hcFtwYXJlbnQuaWQoKV0pe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KClbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb290cztcclxuICAgIH0sXHJcbiAgICAvL1RoaXMgbWV0aG9kIGNoZWNrcyBpZiBhbGwgb2YgdGhlIGdpdmVuIG5vZGVzIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFzc3VtaW5nIHRoYXQgdGhlIHNpemUgXHJcbiAgICAvL29mICBub2RlcyBpcyBub3QgMFxyXG4gICAgYWxsSGF2ZVRoZVNhbWVQYXJlbnQ6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVzWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhKFwicGFyZW50XCIpICE9IHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIG1vdmVOb2RlczogZnVuY3Rpb24ocG9zaXRpb25EaWZmLCBub2Rlcywgbm90Q2FsY1RvcE1vc3ROb2Rlcykge1xyXG4gICAgICB2YXIgdG9wTW9zdE5vZGVzID0gbm90Q2FsY1RvcE1vc3ROb2RlcyA/IG5vZGVzIDogdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcE1vc3ROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gdG9wTW9zdE5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbihcInhcIik7XHJcbiAgICAgICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKFwieVwiKTtcclxuICAgICAgICBub2RlLnBvc2l0aW9uKHtcclxuICAgICAgICAgIHg6IG9sZFggKyBwb3NpdGlvbkRpZmYueCxcclxuICAgICAgICAgIHk6IG9sZFkgKyBwb3NpdGlvbkRpZmYueVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLm1vdmVOb2Rlcyhwb3NpdGlvbkRpZmYsIGNoaWxkcmVuLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnZlcnRUb01vZGVsUG9zaXRpb246IGZ1bmN0aW9uIChyZW5kZXJlZFBvc2l0aW9uKSB7XHJcbiAgICAgIHZhciBwYW4gPSBjeS5wYW4oKTtcclxuICAgICAgdmFyIHpvb20gPSBjeS56b29tKCk7XHJcblxyXG4gICAgICB2YXIgeCA9IChyZW5kZXJlZFBvc2l0aW9uLnggLSBwYW4ueCkgLyB6b29tO1xyXG4gICAgICB2YXIgeSA9IChyZW5kZXJlZFBvc2l0aW9uLnkgLSBwYW4ueSkgLyB6b29tO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHlcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBHZW5lcmFsIEVsZW1lbnQgVXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gRWxlbWVudCBGaWx0ZXJpbmcgVXRpbGl0aWVzXHJcbiAgICBcclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBnZXRQcm9jZXNzZXNPZlNlbGVjdGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxlY3RlZEVsZXMgPSBjeS5lbGVtZW50cyhcIjpzZWxlY3RlZFwiKTtcclxuICAgICAgICBzZWxlY3RlZEVsZXMgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KHNlbGVjdGVkRWxlcyk7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkRWxlcztcclxuICAgIH0sXHJcbiAgICBnZXROZWlnaGJvdXJzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IHRoaXMuZ2V0TmVpZ2hib3Vyc09mTm9kZXMoc2VsZWN0ZWRFbGVzKTtcclxuICAgICAgICByZXR1cm4gZWxlc1RvSGlnaGxpZ2h0O1xyXG4gICAgfSxcclxuICAgIGdldE5laWdoYm91cnNPZk5vZGVzOiBmdW5jdGlvbihfbm9kZXMpe1xyXG4gICAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gICAgICAgIG5vZGVzID0gbm9kZXMuYWRkKG5vZGVzLnBhcmVudHMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikpO1xyXG4gICAgICAgIG5vZGVzID0gbm9kZXMuYWRkKG5vZGVzLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHZhciBuZWlnaGJvcmhvb2RFbGVzID0gbm9kZXMubmVpZ2hib3Job29kKCk7XHJcbiAgICAgICAgdmFyIGVsZXNUb1JldHVybiA9IG5vZGVzLmFkZChuZWlnaGJvcmhvb2RFbGVzKTtcclxuICAgICAgICBlbGVzVG9SZXR1cm4gPSBlbGVzVG9SZXR1cm4uYWRkKGVsZXNUb1JldHVybi5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICByZXR1cm4gZWxlc1RvUmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGV4dGVuZE5vZGVMaXN0OiBmdW5jdGlvbihub2Rlc1RvU2hvdyl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIC8vYWRkIGNoaWxkcmVuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoKS5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICAvL2FkZCBwYXJlbnRzXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cucGFyZW50cygpKTtcclxuICAgICAgICAvL2FkZCBjb21wbGV4IGNoaWxkcmVuXHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzIT0ncHJvY2VzcyddXCIpO1xyXG4gICAgICAgIC8vIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XHJcblxyXG4gICAgICAgIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbihlbGUsIGkpe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJC5pbkFycmF5KGVsZS5fcHJpdmF0ZS5kYXRhLmNsYXNzLCBzZWxmLnByb2Nlc3NUeXBlcykgPT09IC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKS5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID49IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKHByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobmVpZ2hib3JQcm9jZXNzZXMpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcclxuXHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkucGFyZW50cygpKTtcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZXNUb1Nob3c7XHJcbiAgICB9LFxyXG4gICAgZXh0ZW5kUmVtYWluaW5nTm9kZXMgOiBmdW5jdGlvbihub2Rlc1RvRmlsdGVyLCBhbGxOb2Rlcyl7XHJcbiAgICAgICAgbm9kZXNUb0ZpbHRlciA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0ZpbHRlcik7XHJcbiAgICAgICAgdmFyIG5vZGVzVG9TaG93ID0gYWxsTm9kZXMubm90KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlc1RvU2hvdyk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGdldFByb2Nlc3Nlc09mTm9kZXM6IGZ1bmN0aW9uKG5vZGVzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xyXG4gICAgbm9uZUlzTm90SGlnaGxpZ2h0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLm5vZGVzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RIaWdobGlnaHRlZE5vZGVzLmxlbmd0aCArIG5vdEhpZ2hsaWdodGVkRWRnZXMubGVuZ3RoID09PSAwO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU0JHTiBzcGVjaWZpYyB1dGlsaXRpZXNcclxuICAgIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChfbm9kZXMpIHtcclxuICAgICAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXHJcbiAgICAgIFxyXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIHZhciBub2Rlc1RvS2VlcCA9IHRoaXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcclxuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcclxuICAgICAgcmV0dXJuIG5vZGVzTm90VG9LZWVwLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIGVsZXMucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBlbGVzO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gU3R5bGVzaGVldCBoZWxwZXJzXHJcbiAgICBcclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBnZXRDeVNoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgLy8gR2V0IHJpZCBvZiByZWN0YW5nbGUgcG9zdGZpeCB0byBoYXZlIHRoZSBhY3R1YWwgbm9kZSBjbGFzc1xyXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XHJcbiAgICAgICAgICAgIF9jbGFzcyA9IF9jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdyb3VuZHJlY3RhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BoZW5vdHlwZScpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdoZXhhZ29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncG9seWdvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVmaW5lIG5ldyBub2RlIHNoYXBlcyB3aXRoIHRoZWlyIGNsYXNzIG5hbWVzIGZvciB0aGVzZSBub2Rlc1xyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaycgfHwgX2NsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZScgfHwgX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyBcclxuICAgICAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJyB8fCBfY2xhc3MgPT0gJ2NvbXBsZXgnICkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2NsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGVzZSBzaGFwZXMgY2FuIGhhdmUgcG9ydHMuIElmIHRoZXkgaGF2ZSBwb3J0cyB3ZSByZXByZXNlbnQgdGhlbSBieSBwb2x5Z29ucywgZWxzZSB0aGV5IGFyZSByZXByZXNlbnRlZCBieSBlbGxpcHNlcyBvciByZWN0YW5nbGVzXHJcbiAgICAgICAgLy8gY29uZGl0aW9uYWxseS5cclxuICAgICAgICBpZiAoIHRoaXMuY2FuSGF2ZVBvcnRzKF9jbGFzcykgKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPT09IHRydWUgJiYgZWxlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncG9seWdvbic7IC8vIFRoZSBub2RlIGhhcyBwb3J0cyByZXByZXNlbnQgaXQgYnkgcG9seWdvblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycgfHwgX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdyZWN0YW5nbGUnOyAvLyBJZiBub2RlIGhhcyBubyBwb3J0IGFuZCBoYXMgb25lIG9mIHRoZXNlIGNsYXNzZXMgaXQgc2hvdWxkIGJlIGluIGEgcmVjdGFuZ2xlIHNoYXBlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiAnZWxsaXBzZSc7IC8vIE90aGVyIG5vZGVzIHdpdGggbm8gcG9ydCBzaG91bGQgYmUgaW4gYW4gZWxsaXBzZSBzaGFwZVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGUgcmVtYWluaW5nIG5vZGVzIGFyZSBzdXBwb3NlZCB0byBiZSBpbiBlbGxpcHNlIHNoYXBlXHJcbiAgICAgICAgcmV0dXJuICdlbGxpcHNlJztcclxuICAgIH0sXHJcbiAgICBnZXRDeUFycm93U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICBpZiAoX2NsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndHJpYW5nbGUtY3Jvc3MnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdpbmhpYml0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RlZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdjaXJjbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdzdGltdWxhdGlvbicgfHwgX2NsYXNzID09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaWFtb25kJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICdub25lJztcclxuICAgIH0sXHJcbiAgICBnZXRFbGVtZW50Q29udGVudDogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICAgICAgICBpZiAoX2NsYXNzLmVuZHNXaXRoKCcgbXVsdGltZXInKSkge1xyXG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IF9jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xyXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BoZW5vdHlwZSdcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGVydHVyYmluZyBhZ2VudCcgfHwgX2NsYXNzID09ICd0YWcnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnbGFiZWwnKSA/IGVsZS5kYXRhKCdsYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihfY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jyl7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnbGFiZWwnKSA/IGVsZS5kYXRhKCdsYWJlbCcpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihfY2xhc3MgPT0gJ2NvbXBsZXgnKXtcclxuICAgICAgICAgICAgaWYoZWxlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ2xhYmVsJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbGUuZGF0YSgnbGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZWxlLmRhdGEoJ2luZm9MYWJlbCcpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2luZm9MYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ2FuZCcpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdBTkQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29yJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ09SJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdub3QnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTk9UJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnXFxcXFxcXFwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJz8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdvJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZXh0V2lkdGggPSBlbGUud2lkdGgoKSB8fCBlbGUuZGF0YSgnYmJveCcpLnc7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0UHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWw6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgIHdpZHRoOiAoIF9jbGFzcz09KCdjb21wbGV4JykgfHwgX2NsYXNzPT0oJ2NvbXBhcnRtZW50JykgKT90ZXh0V2lkdGggKiAyOnRleHRXaWR0aFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBmb250ID0gdGhpcy5nZXRMYWJlbFRleHRTaXplKGVsZSkgKyBcInB4IEFyaWFsXCI7XHJcbiAgICAgICAgcmV0dXJuIHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgZm9udCk7IC8vZnVuYy4gaW4gdGhlIGN5dG9zY2FwZS5yZW5kZXJlci5jYW52YXMuc2Jnbi1yZW5kZXJlci5qc1xyXG4gICAgfSxcclxuICAgIGdldExhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcclxuICAgICAgaWYgKF9jbGFzcyA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgIHJldHVybiAyMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuY2FuSGF2ZVBvcnRzKF9jbGFzcykpIHtcclxuICAgICAgICB2YXIgY29lZmYgPSAxOyAvLyBUaGUgZHluYW1pYyBsYWJlbCBzaXplIGNvZWZmaWNpZW50IGZvciB0aGVzZSBwc2V1ZG8gbGFiZWxzLCBpdCBpcyAxIGZvciBsb2dpY2FsIG9wZXJhdG9yc1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENvZWZmIGlzIHN1cHBvc2VkIHRvIGJlIDIgZm9yIGRpc3NvY2lhdGlvbiBhbmQgMS41IGZvciBvdGhlciBwcm9jZXNzZXNcclxuICAgICAgICBpZiAoX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgY29lZmYgPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xyXG4gICAgICAgICAgY29lZmYgPSAxLjU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwb3J0cyA9IGVsZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPT09IHRydWUgJiYgcG9ydHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAvLyBXZSBhc3N1bWUgdGhhdCB0aGUgcG9ydHMgYXJlIHN5bW1ldHJpYyB0byB0aGUgbm9kZSBjZW50ZXIgc28gdXNpbmcganVzdCBvbmUgb2YgdGhlIHBvcnRzIGlzIGVub3VnaFxyXG4gICAgICAgICAgdmFyIHBvcnQgPSBwb3J0c1swXTtcclxuICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnQueCA9PT0gMCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSByYXRpbyBvZiB0aGUgYXJlYSBvY2N1cGllZCB3aXRoIHBvcnRzIG92ZXIgd2l0aG91dCBwb3J0c1xyXG4gICAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0LnkpIC8gNTAgOiBNYXRoLmFicyhwb3J0LngpIC8gNTA7XHJcbiAgICAgICAgICBjb2VmZiAvPSByYXRpbzsgLy8gRGl2aWRlIHRoZSBjb2VmZiBieSByYXRpbyB0byBmaXQgaW50byB0aGUgYmJveCBvZiB0aGUgYWN0dWFsIHNoYXBlIChkaXNjbHVkaW5nIHBvcnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUsIGNvZWZmKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9jbGFzcyA9PT0gJ2NvbXBsZXgnIHx8IF9jbGFzcyA9PT0gJ2NvbXBhcnRtZW50Jykge1xyXG4gICAgICAgIHJldHVybiAxNjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgIH0sXHJcbiAgICBnZXRDYXJkaW5hbGl0eURpc3RhbmNlOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBzcmNQb3MgPSBlbGUuc291cmNlKCkucG9zaXRpb24oKTtcclxuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KChzcmNQb3MueCAtIHRndFBvcy54KSwgMikgKyBNYXRoLnBvdygoc3JjUG9zLnkgLSB0Z3RQb3MueSksIDIpKTtcclxuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcclxuICAgIH0sXHJcbiAgICBnZXRJbmZvTGFiZWw6IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXHJcbiAgICAgICogdGhlIG5vZGUgaXMgY29sbGFwc2VkIHJldHVybiB0aGUgYWxyZWFkeSBleGlzdGluZyBpbmZvIGxhYmVsIG9mIGl0XHJcbiAgICAgICovXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAgKiBJZiB0aGUgbm9kZSBpcyBzaW1wbGUgdGhlbiBpdCdzIGluZm9sYWJlbCBpcyBlcXVhbCB0byBpdCdzIGxhYmVsXHJcbiAgICAgICAqL1xyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgbm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpO1xyXG4gICAgICB2YXIgaW5mb0xhYmVsID0gXCJcIjtcclxuICAgICAgLypcclxuICAgICAgICogR2V0IHRoZSBpbmZvIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlIGJ5IGl0J3MgY2hpbGRyZW4gaW5mbyByZWN1cnNpdmVseVxyXG4gICAgICAgKi9cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIHZhciBjaGlsZEluZm8gPSB0aGlzLmdldEluZm9MYWJlbChjaGlsZCk7XHJcbiAgICAgICAgaWYgKGNoaWxkSW5mbyA9PSBudWxsIHx8IGNoaWxkSW5mbyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmZvTGFiZWwgIT0gXCJcIikge1xyXG4gICAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbmZvTGFiZWwgKz0gY2hpbGRJbmZvO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL3JldHVybiBpbmZvIGxhYmVsXHJcbiAgICAgIHJldHVybiBpbmZvTGFiZWw7XHJcbiAgICB9LFxyXG4gICAgZ2V0UXRpcENvbnRlbnQ6IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgLyogQ2hlY2sgdGhlIGxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxyXG4gICAgICAqIHRoZW4gY2hlY2sgdGhlIGluZm9sYWJlbCBpZiBpdCBpcyBhbHNvIG5vdCB2YWxpZCBkbyBub3Qgc2hvdyBxdGlwXHJcbiAgICAgICovXHJcbiAgICAgIHZhciBsYWJlbCA9IG5vZGUuZGF0YSgnbGFiZWwnKTtcclxuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xyXG4gICAgICAgIGxhYmVsID0gdGhpcy5nZXRJbmZvTGFiZWwobm9kZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxhYmVsID09IG51bGwgfHwgbGFiZWwgPT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIGNvbnRlbnRIdG1sID0gXCI8YiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE2cHg7Jz5cIiArIGxhYmVsICsgXCI8L2I+XCI7XHJcbiAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZXNhbmRpbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBzYmduc3RhdGVhbmRpbmZvID0gc3RhdGVzYW5kaW5mb3NbaV07XHJcbiAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICB2YXIgdmFsdWUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhbHVlO1xyXG4gICAgICAgICAgdmFyIHZhcmlhYmxlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YXJpYWJsZTtcclxuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcclxuICAgICAgICAgICAgICAgICAgdmFsdWUgKyBcIkBcIiArIHZhcmlhYmxlO1xyXG4gICAgICAgICAgaWYgKHN0YXRlTGFiZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnRIdG1sICs9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7Jz5cIiArIHN0YXRlTGFiZWwgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduc3RhdGVhbmRpbmZvLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XHJcbiAgICAgICAgICB2YXIgc3RhdGVMYWJlbCA9IHNiZ25zdGF0ZWFuZGluZm8ubGFiZWwudGV4dDtcclxuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgc3RhdGVMYWJlbCA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xyXG4gICAgfSxcclxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXHJcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XHJcbiAgICAgIHZhciBkeW5hbWljTGFiZWxTaXplID0gb3B0aW9ucy5keW5hbWljTGFiZWxTaXplO1xyXG4gICAgICBkeW5hbWljTGFiZWxTaXplID0gdHlwZW9mIGR5bmFtaWNMYWJlbFNpemUgPT09ICdmdW5jdGlvbicgPyBkeW5hbWljTGFiZWxTaXplLmNhbGwoKSA6IGR5bmFtaWNMYWJlbFNpemU7XHJcblxyXG4gICAgICBpZiAoZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAnc21hbGwnKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdyZWd1bGFyJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAnbGFyZ2UnKSB7XHJcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIGggPSBlbGUuaGVpZ2h0KCk7XHJcbiAgICAgIHZhciB0ZXh0SGVpZ2h0ID0gcGFyc2VJbnQoaCAvIDIuNDUpICogZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50O1xyXG5cclxuICAgICAgcmV0dXJuIHRleHRIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICogR2V0IHNvdXJjZS90YXJnZXQgZW5kIHBvaW50IG9mIGVkZ2UgaW4gJ3gtdmFsdWUlIHktdmFsdWUlJyBmb3JtYXQuIEl0IHJldHVybnMgJ291dHNpZGUtdG8tbm9kZScgaWYgdGhlcmUgaXMgbm8gc291cmNlL3RhcmdldCBwb3J0LlxyXG4gICAgKi9cclxuICAgIGdldEVuZFBvaW50OiBmdW5jdGlvbihlZGdlLCBzb3VyY2VPclRhcmdldCkge1xyXG4gICAgICB2YXIgcG9ydElkID0gc291cmNlT3JUYXJnZXQgPT09ICdzb3VyY2UnID8gZWRnZS5kYXRhKCdwb3J0c291cmNlJykgOiBlZGdlLmRhdGEoJ3BvcnR0YXJnZXQnKTtcclxuXHJcbiAgICAgIGlmIChwb3J0SWQgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiAnb3V0c2lkZS10by1ub2RlJzsgLy8gSWYgdGhlcmUgaXMgbm8gcG9ydHNvdXJjZSByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUgd2hpY2ggaXMgJ291dHNpZGUtdG8tbm9kZSdcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVuZE5vZGUgPSBzb3VyY2VPclRhcmdldCA9PT0gJ3NvdXJjZScgPyBlZGdlLnNvdXJjZSgpIDogZWRnZS50YXJnZXQoKTtcclxuICAgICAgdmFyIHBvcnRzID0gZW5kTm9kZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgICB2YXIgcG9ydDtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChwb3J0c1tpXS5pZCA9PT0gcG9ydElkKSB7XHJcbiAgICAgICAgICBwb3J0ID0gcG9ydHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9ydCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuICdvdXRzaWRlLXRvLW5vZGUnOyAvLyBJZiBwb3J0IGlzIG5vdCBmb3VuZCByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUgd2hpY2ggaXMgJ291dHNpZGUtdG8tbm9kZSdcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIHgsIHk7XHJcbiAgICAgIC8vIE5vdGUgdGhhdCBmb3IgZHJhd2luZyBwb3J0cyB3ZSByZXByZXNlbnQgdGhlIHdob2xlIHNoYXBlIGJ5IGEgcG9seWdvbiBhbmQgcG9ydHMgYXJlIGFsd2F5cyA1MCUgYXdheSBmcm9tIHRoZSBub2RlIGNlbnRlclxyXG4gICAgICBpZiAocG9ydC54ICE9IDApIHtcclxuICAgICAgICB4ID0gTWF0aC5zaWduKHBvcnQueCkgKiA1MDtcclxuICAgICAgICB5ID0gMDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB4ID0gMDtcclxuICAgICAgICB5ID0gTWF0aC5zaWduKHBvcnQueSkgKiA1MDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuICcnICsgeCArICclICcgKyB5ICsgJyUnO1xyXG4gICAgfSxcclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gb3JkZXJpbmcgb2YgcG9ydHMgb2YgYSBub2RlLlxyXG4gICAgICogUG9zc2libGUgcmV0dXJuIHZhbHVlcyBhcmUgJ0wtdG8tUicsICdSLXRvLUwnLCAnVC10by1CJywgJ0ItdG8tVCcsICdub25lJ1xyXG4gICAgICovXHJcbiAgICBnZXRQb3J0c09yZGVyaW5nOiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIHZhciBwb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTtcclxuICAgICAgaWYgKHBvcnRzLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgIHJldHVybiAnbm9uZSc7IC8vIE5vZGVzIGFyZSBzdXBwb3NlZCB0byBoYXZlIDIgbm9kZXMgb3Igbm9uZVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvKlxyXG4gICAgICAgKiBSZXR1cnNuIGlmIHRoZSBnaXZlbiBwb3J0SWQgaXMgcG9ydHRhcmdldCBvZiBhbnkgb2YgdGhlIGdpdmVuIGVkZ2VzLlxyXG4gICAgICAgKiBUaGVzZSBlZGdlcyBhcmUgZXhwZWN0ZWQgdG8gYmUgdGhlIGVkZ2VzIGNvbm5lY3RlZCB0byB0aGUgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhhdCBwb3J0LlxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIGlzUG9ydFRhcmdldE9mQW55RWRnZSA9IGZ1bmN0aW9uKGVkZ2VzLCBwb3J0SWQpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoZWRnZXNbaV0uZGF0YSgncG9ydHRhcmdldCcpID09PSBwb3J0SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIC8vIElmIHRoZSBwb3J0cyBhcmUgbG9jYXRlZCBhYm92ZS9iZWxvdyBvZiB0aGUgbm9kZSB0aGVuIHRoZSBvcmllbnRhdGlvbiBpcyAndmVydGljYWwnIGVsc2UgaXQgaXMgJ2hvcml6b250YWwnLlxyXG4gICAgICB2YXIgb3JpZW50YXRpb24gPSBwb3J0c1swXS54ID09PSAwID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgLy8gV2UgbmVlZCB0aGUgY29ubmVjdGVkIGVkZ2VzIG9mIHRoZSBub2RlIHRvIGZpbmQgb3V0IGlmIGEgcG9ydCBpcyBhbiBpbnB1dCBwb3J0IG9yIGFuIG91dHB1dCBwb3J0XHJcbiAgICAgIHZhciBjb25uZWN0ZWRFZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgdmFyIGxlZnRQb3J0SWQgPSBwb3J0c1swXS54IDwgMCA/IHBvcnRzWzBdLmlkIDogcG9ydHNbMV0uaWQ7IC8vIExlZnQgcG9ydCBpcyB0aGUgcG9ydCB3aG9zZSB4IHZhbHVlIGlzIG5lZ2F0aXZlXHJcbiAgICAgICAgLy8gSWYgbGVmdCBwb3J0IGlzIHBvcnQgdGFyZ2V0IGZvciBhbnkgb2YgY29ubmVjdGVkIGVkZ2VzIHRoZW4gdGhlIG9yZGVyaW5nIGlzICdMLXRvLVInIGVsc2UgaXQgaXMgJ1ItdG8tTCdcclxuICAgICAgICBpZiAoaXNQb3J0VGFyZ2V0T2ZBbnlFZGdlKGNvbm5lY3RlZEVkZ2VzLCBsZWZ0UG9ydElkKSkge1xyXG4gICAgICAgICAgcmV0dXJuICdMLXRvLVInO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ1ItdG8tTCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHRvcFBvcnRJZCA9IHBvcnRzWzBdLnkgPCAwID8gcG9ydHNbMF0uaWQgOiBwb3J0c1sxXS5pZDsgLy8gVG9wIHBvcnQgaXMgdGhlIHBvcnQgd2hvc2UgeSB2YWx1ZSBpcyBuZWdhdGl2ZVxyXG4gICAgICAgIC8vIElmIHRvcCAgcG9ydCBpcyBwb3J0IHRhcmdldCBmb3IgYW55IG9mIGNvbm5lY3RlZCBlZGdlcyB0aGVuIHRoZSBvcmRlcmluZyBpcyAnVC10by1CJyBlbHNlIGl0IGlzICdCLXRvLVQnXHJcbiAgICAgICAgaWYgKGlzUG9ydFRhcmdldE9mQW55RWRnZShjb25uZWN0ZWRFZGdlcywgdG9wUG9ydElkKSkge1xyXG4gICAgICAgICAgcmV0dXJuICdULXRvLUInO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ0ItdG8tVCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKlxyXG4gKiBGaWxlIFV0aWxpdGllczogVG8gYmUgdXNlZCBvbiByZWFkL3dyaXRlIGZpbGUgb3BlcmF0aW9uXHJcbiAqL1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xyXG52YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3VpLXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgdXBkYXRlR3JhcGggPSBncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaC5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcclxuXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgc2F2ZUFzID0gbGlicy5zYXZlQXM7XHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIFN0YXJ0XHJcbi8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MjQ1NzY3L2NyZWF0aW5nLWEtYmxvYi1mcm9tLWEtYmFzZTY0LXN0cmluZy1pbi1qYXZhc2NyaXB0XHJcbmZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKSB7XHJcbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcclxuICBzbGljZVNpemUgPSBzbGljZVNpemUgfHwgNTEyO1xyXG5cclxuICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xyXG4gIHZhciBieXRlQXJyYXlzID0gW107XHJcblxyXG4gIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xyXG4gICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xyXG5cclxuICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcclxuXHJcbiAgICBieXRlQXJyYXlzLnB1c2goYnl0ZUFycmF5KTtcclxuICB9XHJcblxyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcbiAgcmV0dXJuIGJsb2I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRYTUxEb2MoZnVsbEZpbGVQYXRoKSB7XHJcbiAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xyXG4gICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcbiAgfVxyXG4gIHhodHRwLm9wZW4oXCJHRVRcIiwgZnVsbEZpbGVQYXRoLCBmYWxzZSk7XHJcbiAgeGh0dHAuc2VuZCgpO1xyXG4gIHJldHVybiB4aHR0cC5yZXNwb25zZVhNTDtcclxufVxyXG5cclxuLy8gU2hvdWxkIHRoaXMgYmUgZXhwb3NlZCBvciBzaG91bGQgdGhpcyBiZSBtb3ZlZCB0byB0aGUgaGVscGVyIGZ1bmN0aW9ucyBzZWN0aW9uP1xyXG5mdW5jdGlvbiB0ZXh0VG9YbWxPYmplY3QodGV4dCkge1xyXG4gIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xyXG4gICAgdmFyIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XHJcbiAgICBkb2MuYXN5bmMgPSAnZmFsc2UnO1xyXG4gICAgZG9jLmxvYWRYTUwodGV4dCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICB2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC94bWwnKTtcclxuICB9XHJcbiAgcmV0dXJuIGRvYztcclxufVxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIEVuZFxyXG5cclxuZnVuY3Rpb24gZmlsZVV0aWxpdGllcygpIHt9XHJcbmZpbGVVdGlsaXRpZXMubG9hZFhNTERvYyA9IGxvYWRYTUxEb2M7XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc1BuZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcbiAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXHJcbiAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XHJcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLnBuZ1wiKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzSnBnID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuICB2YXIganBnQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcclxuXHJcbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcclxuICB2YXIgYjY0ZGF0YSA9IGpwZ0NvbnRlbnQuc3Vic3RyKGpwZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsuanBnXCIpO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5sb2FkU2FtcGxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGZvbGRlcnBhdGgpIHtcclxuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XHJcbiAgXHJcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYSBzYW1wbGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRTYW1wbGVTdGFydFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVN0YXJ0XCIsIFsgZmlsZW5hbWUgXSApO1xyXG4gIFxyXG4gIC8vIGxvYWQgeG1sIGRvY3VtZW50IHVzZSBkZWZhdWx0IGZvbGRlciBwYXRoIGlmIGl0IGlzIG5vdCBzcGVjaWZpZWRcclxuICB2YXIgeG1sT2JqZWN0ID0gbG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xyXG4gIFxyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XHJcbiAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xyXG4gICAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlRW5kXCIsIFsgZmlsZW5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgc2FtcGxlIGlzIGxvYWRlZFxyXG4gIH0sIDApO1xyXG59O1xyXG5cclxuLypcclxuICBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIHJlbW90ZWx5IGRlZmluZWQgdG8gYWRkIHNwZWNpZmljIGJlaGF2aW9yIHRoYXQgaXNuJ3QgaW1wbGVtZW50ZWQgaGVyZS5cclxuICBpdCBpcyBjb21wbGV0ZWx5IG9wdGlvbmFsLlxyXG4gIHNpZ25hdHVyZTogY2FsbGJhY2sodGV4dFhtbClcclxuKi9cclxuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gIFxyXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGFuIGV4dGVybmFsIGZpbGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBBbGlhc2VzIGZvciBzYmdudml6TG9hZEZpbGVTdGFydFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVTdGFydFwiLCBbIGZpbGUubmFtZSBdICk7IFxyXG4gIFxyXG4gIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xyXG5cclxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJykgY2FsbGJhY2sodGV4dCk7XHJcbiAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0KSkpO1xyXG4gICAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVFbmRcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgZmlsZSBpcyBsb2FkZWRcclxuICAgIH0sIDApO1xyXG4gIH07XHJcblxyXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG59O1xyXG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxUZXh0ID0gZnVuY3Rpb24odGV4dERhdGEpe1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHRleHREYXRhKSkpO1xyXG4gICAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcclxuICAgIH0sIDApO1xyXG5cclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzU2Jnbm1sID0gZnVuY3Rpb24oZmlsZW5hbWUsIHJlbmRlckluZm8pIHtcclxuICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoZmlsZW5hbWUsIHJlbmRlckluZm8pO1xyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XHJcbiAgICB0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtODtcIixcclxuICB9KTtcclxuICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xyXG59O1xyXG5maWxlVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUZXh0VG9Kc29uID0gZnVuY3Rpb24oc2Jnbm1sVGV4dCl7XHJcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuY3JlYXRlSnNvbiA9IGZ1bmN0aW9uKGpzb24pe1xyXG4gICAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVVdGlsaXRpZXM7XHJcbiIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIHNiZ252aXogZ3JhcGhzXHJcbiAqL1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxuZnVuY3Rpb24gZ3JhcGhVdGlsaXRpZXMoKSB7fVxyXG5cclxuZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID0gdHJ1ZTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLmRpc2FibGVQb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9IGZhbHNlO1xyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5lbmFibGVQb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9IHRydWU7XHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLmFyZVBvcnRzRW5hYmxlZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQ7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaCA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcclxuICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaFN0YXJ0XCIgKTtcclxuICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5yZXNldCgpO1xyXG4vLyAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XHJcbiAgfVxyXG5cclxuICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgLy8gY2xlYXIgZGF0YVxyXG4gIGN5LnJlbW92ZSgnKicpO1xyXG4gIGN5LmFkZChjeUdyYXBoKTtcclxuXHJcbiAgLy9hZGQgcG9zaXRpb24gaW5mb3JtYXRpb24gdG8gZGF0YSBmb3IgcHJlc2V0IGxheW91dFxyXG4gIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHhQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC54O1xyXG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC55O1xyXG4gICAgcG9zaXRpb25NYXBbY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmlkXSA9IHsneCc6IHhQb3MsICd5JzogeVBvc307XHJcbiAgfVxyXG5cclxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xyXG4gIGN5LmVuZEJhdGNoKCk7XHJcbiAgXHJcbiAgdmFyIGxheW91dCA9IGN5LmxheW91dCh7XHJcbiAgICBuYW1lOiAncHJlc2V0JyxcclxuICAgIHBvc2l0aW9uczogcG9zaXRpb25NYXAsXHJcbiAgICBmaXQ6IHRydWUsXHJcbiAgICBwYWRkaW5nOiA1MFxyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIENoZWNrIHRoaXMgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XHJcbiAgICBsYXlvdXQucnVuKCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgdGhlIHN0eWxlXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAvLyBJbml0aWxpemUgdGhlIGJlbmQgcG9pbnRzIG9uY2UgdGhlIGVsZW1lbnRzIGFyZSBjcmVhdGVkXHJcbiAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcclxuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XHJcbiAgfVxyXG4gIFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaEVuZFwiICk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XHJcbiAgLy9BcyBkZWZhdWx0IHVzZSB0aGUgY29tcG91bmQgcGFkZGluZyB2YWx1ZVxyXG4gIGlmICghcGFkZGluZ1BlcmNlbnQpIHtcclxuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcclxuICAgIHBhZGRpbmdQZXJjZW50ID0gdHlwZW9mIGNvbXBvdW5kUGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbXBvdW5kUGFkZGluZy5jYWxsKCkgOiBjb21wb3VuZFBhZGRpbmc7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciB0b3RhbCA9IDA7XHJcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcclxuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUud2lkdGgoKSk7XHJcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcclxuICAgICAgbnVtT2ZTaW1wbGVzKys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgY2FsY19wYWRkaW5nID0gKHBhZGRpbmdQZXJjZW50IC8gMTAwKSAqIE1hdGguZmxvb3IodG90YWwgLyAoMiAqIG51bU9mU2ltcGxlcykpO1xyXG4gIGlmIChjYWxjX3BhZGRpbmcgPCA1KSB7XHJcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLnJlY2FsY3VsYXRlUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcclxuICAvLyB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBpcyBub3Qgd29ya2luZyBoZXJlIFxyXG4gIC8vIFRPRE86IHJlcGxhY2UgdGhpcyByZWZlcmVuY2Ugd2l0aCB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBvbmNlIHRoZSByZWFzb24gaXMgZmlndXJlZCBvdXRcclxuICBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XHJcbiAgcmV0dXJuIGdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZWRQYWRkaW5ncztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ3JhcGhVdGlsaXRpZXM7IiwidmFyIHR4dFV0aWwgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJyk7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgbGlic2JnbmpzID0gcmVxdWlyZSgnbGlic2Jnbi5qcycpO1xyXG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcclxudmFyIHBrZ1ZlcnNpb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uOyAvLyBuZWVkIGluZm8gYWJvdXQgc2JnbnZpeiB0byBwdXQgaW4geG1sXHJcbnZhciBwa2dOYW1lID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykubmFtZTtcclxudmFyIHByZXR0eXByaW50ID0gcmVxdWlyZSgncHJldHR5LWRhdGEnKS5wZDtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBqc29uVG9TYmdubWwgPSB7XHJcbiAgICAvKlxyXG4gICAgICAgIHRha2VzIHJlbmRlckluZm8gYXMgYW4gb3B0aW9uYWwgYXJndW1lbnQuIEl0IGNvbnRhaW5zIGFsbCB0aGUgaW5mb3JtYXRpb24gbmVlZGVkIHRvIHNhdmVcclxuICAgICAgICB0aGUgc3R5bGUgYW5kIGNvbG9ycyB0byB0aGUgcmVuZGVyIGV4dGVuc2lvbi4gU2VlIG5ld3QvYXBwLXV0aWxpdGllcyBnZXRBbGxTdHlsZXMoKVxyXG4gICAgICAgIFN0cnVjdHVyZToge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGUgbWFwIGJhY2tncm91bmQgY29sb3IsXHJcbiAgICAgICAgICAgIGNvbG9yczoge1xyXG4gICAgICAgICAgICAgIHZhbGlkWG1sVmFsdWU6IGNvbG9yX2lkXHJcbiAgICAgICAgICAgICAgLi4uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgc3R5bGVLZXkxOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWRMaXN0OiBsaXN0IG9mIHRoZSBub2RlcyBpZHMgdGhhdCBoYXZlIHRoaXMgc3R5bGVcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0eWxlS2V5MjogLi4uXHJcbiAgICAgICAgICAgICAgICAuLi5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICovXHJcbiAgICBjcmVhdGVTYmdubWwgOiBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbyl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgbWFwSUQgPSB0eHRVdGlsLmdldFhNTFZhbGlkSWQoZmlsZW5hbWUpO1xyXG4gICAgICAgIHZhciBoYXNFeHRlbnNpb24gPSBmYWxzZTtcclxuICAgICAgICB2YXIgaGFzUmVuZGVyRXh0ZW5zaW9uID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJJbmZvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBoYXNFeHRlbnNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBoYXNSZW5kZXJFeHRlbnNpb24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgaGVhZGVyc1xyXG4gICAgICAgIHhtbEhlYWRlciA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J3llcyc/PlxcblwiO1xyXG4gICAgICAgIHZhciBzYmduID0gbmV3IGxpYnNiZ25qcy5TYmduKHt4bWxuczogJ2h0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuMyd9KTtcclxuICAgICAgICB2YXIgbWFwID0gbmV3IGxpYnNiZ25qcy5NYXAoe2xhbmd1YWdlOiAncHJvY2VzcyBkZXNjcmlwdGlvbicsIGlkOiBtYXBJRH0pO1xyXG4gICAgICAgIGlmIChoYXNFeHRlbnNpb24pIHsgLy8gZXh0ZW5zaW9uIGlzIHRoZXJlXHJcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBuZXcgbGlic2JnbmpzLkV4dGVuc2lvbigpO1xyXG4gICAgICAgICAgICBpZiAoaGFzUmVuZGVyRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24uYWRkKHNlbGYuZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sKHJlbmRlckluZm8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXAuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZXQgYWxsIGdseXBoc1xyXG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcclxuICAgICAgICBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWVsZS5pc0NoaWxkKCkpXHJcbiAgICAgICAgICAgICAgICBnbHlwaExpc3QgPSBnbHlwaExpc3QuY29uY2F0KHNlbGYuZ2V0R2x5cGhTYmdubWwoZWxlKSk7IC8vIHJldHVybnMgcG90ZW50aWFsbHkgbW9yZSB0aGFuIDEgZ2x5cGhcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBhZGQgdGhlbSB0byB0aGUgbWFwXHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Z2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1hcC5hZGRHbHlwaChnbHlwaExpc3RbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IGFsbCBhcmNzXHJcbiAgICAgICAgY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcC5hZGRBcmMoc2VsZi5nZXRBcmNTYmdubWwoZWxlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNiZ24uc2V0TWFwKG1hcCk7XHJcbiAgICAgICAgcmV0dXJuIHByZXR0eXByaW50LnhtbCh4bWxIZWFkZXIgKyBzYmduLnRvWE1MKCkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBzZWUgY3JlYXRlU2Jnbm1sIGZvciBpbmZvIG9uIHRoZSBzdHJ1Y3R1cmUgb2YgcmVuZGVySW5mb1xyXG4gICAgZ2V0UmVuZGVyRXh0ZW5zaW9uU2Jnbm1sIDogZnVuY3Rpb24ocmVuZGVySW5mbykge1xyXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICAgICAgdmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbih7IGlkOiAncmVuZGVySW5mb3JtYXRpb24nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiByZW5kZXJJbmZvLmJhY2tncm91bmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW1OYW1lOiBwa2dOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtVmVyc2lvbjogcGtnVmVyc2lvbiB9KTtcclxuXHJcbiAgICAgICAgLy8gcG9wdWxhdGUgbGlzdCBvZiBjb2xvcnNcclxuICAgICAgICB2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGNvbG9yIGluIHJlbmRlckluZm8uY29sb3JzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvckRlZmluaXRpb24gPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkNvbG9yRGVmaW5pdGlvbih7aWQ6IHJlbmRlckluZm8uY29sb3JzW2NvbG9yXSwgdmFsdWU6IGNvbG9yfSk7XHJcbiAgICAgICAgICAgIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZkNvbG9yRGVmaW5pdGlvbnMobGlzdE9mQ29sb3JEZWZpbml0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIHBvcHVsYXRlcyBzdHlsZXNcclxuICAgICAgICB2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMoKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVySW5mby5zdHlsZXMpIHtcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gcmVuZGVySW5mby5zdHlsZXNba2V5XTtcclxuICAgICAgICAgICAgdmFyIHhtbFN0eWxlID0gbmV3IHJlbmRlckV4dGVuc2lvbi5TdHlsZSh7aWQ6IHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChrZXkpLCBpZExpc3Q6IHN0eWxlLmlkTGlzdC5qb2luKCcgJyl9KTtcclxuICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogc3R5bGUucHJvcGVydGllcy5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxyXG4gICAgICAgICAgICAgICAgZm9udFN0eWxlOiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRTdHlsZSxcclxuICAgICAgICAgICAgICAgIGZpbGw6IHN0eWxlLnByb3BlcnRpZXMuZmlsbCwgLy8gZmlsbCBjb2xvclxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXHJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogc3R5bGUucHJvcGVydGllcy5zdHJva2VXaWR0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XHJcbiAgICAgICAgICAgIGxpc3RPZlN0eWxlcy5hZGRTdHlsZSh4bWxTdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZlN0eWxlcyhsaXN0T2ZTdHlsZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEdseXBoU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzYmdubWxUZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgbm9kZUNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xyXG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCwgY2xhc3NfOiBub2RlQ2xhc3N9KTtcclxuXHJcbiAgICAgICAgLy8gYXNzaWduIGNvbXBhcnRtZW50UmVmXHJcbiAgICAgICAgaWYobm9kZS5wYXJlbnQoKS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaC5jb21wYXJ0bWVudFJlZiA9IHBhcmVudC5fcHJpdmF0ZS5kYXRhLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtaXNjIGluZm9ybWF0aW9uXHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIGlmKHR5cGVvZiBsYWJlbCAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgZ2x5cGguc2V0TGFiZWwobmV3IGxpYnNiZ25qcy5MYWJlbCh7dGV4dDogbGFiZWx9KSk7XHJcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBnbHlwaC5zZXRDbG9uZShuZXcgbGlic2JnbmpzLkNsb25lVHlwZSgpKTtcclxuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXHJcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZEdseXBoQmJveChub2RlKSk7XHJcbiAgICAgICAgLy9hZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHBvcnRzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnRzW2ldLnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSByYXRpbyBvZiB0aGUgYXJlYSBvY2N1cGllZCBmb3IgcG9ydHMgb3ZlciB0aGUgd2hvbGUgc2hhcGVcclxuICAgICAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0c1tpXS55KSAvIDUwIDogTWF0aC5hYnMocG9ydHNbaV0ueCkgLyA1MDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIERpdmlkZSB0aGUgbm9kZSBzaXplcyBieSB0aGUgcmF0aW8gYmVjYXVzZSB0aGF0IHNpemVzIGluY2x1ZGVzIHBvcnRzIGFzIHdlbGxcclxuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogKCBub2RlLndpZHRoKCkgLyByYXRpbyApIC8gMTAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueSArIHBvcnRzW2ldLnkgKiAoIG5vZGUuaGVpZ2h0KCkgLyByYXRpbyApIC8gMTAwO1xyXG5cclxuICAgICAgICAgICAgZ2x5cGguYWRkUG9ydChuZXcgbGlic2JnbmpzLlBvcnQoe2lkOiBwb3J0c1tpXS5pZCwgeDogeCwgeTogeX0pKTtcclxuICAgICAgICAgICAgLypzYmdubWxUZXh0ID0gc2Jnbm1sVGV4dCArIFwiPHBvcnQgaWQ9J1wiICsgcG9ydHNbaV0uaWQrXHJcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiOyovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciBib3hHbHlwaCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvc1tpXTtcclxuICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zSWQgPSBub2RlLl9wcml2YXRlLmRhdGEuaWQrXCJfXCIraTtcclxuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcih0aGlzLmFkZFN0YXRlQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XHJcbiAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcih0aGlzLmFkZEluZm9Cb3hHbHlwaChib3hHbHlwaCwgc3RhdGVzYW5kaW5mb3NJZCwgbm9kZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgZ2x5cGggbWVtYmVycyB0aGF0IGFyZSBub3Qgc3RhdGUgdmFyaWFibGVzIG9yIHVuaXQgb2YgaW5mbzogc3VidW5pdHNcclxuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGVDbGFzcyA9PT0gXCJzdWJtYXBcIil7XHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2x5cGhNZW1iZXJMaXN0ID0gc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhNZW1iZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIoZ2x5cGhNZW1iZXJMaXN0W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjdXJyZW50IGdseXBoIGlzIGRvbmVcclxuICAgICAgICBnbHlwaExpc3QucHVzaChnbHlwaCk7XHJcblxyXG4gICAgICAgIC8vIGtlZXAgZ29pbmcgd2l0aCBhbGwgdGhlIGluY2x1ZGVkIGdseXBoc1xyXG4gICAgICAgIGlmKG5vZGVDbGFzcyA9PT0gXCJjb21wYXJ0bWVudFwiKXtcclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdseXBoTGlzdCA9IGdseXBoTGlzdC5jb25jYXQoc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIGdseXBoTGlzdDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0QXJjU2Jnbm1sIDogZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgdmFyIHNiZ25tbFRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXHJcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xyXG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgYXJjSWQgPSBlZGdlLl9wcml2YXRlLmRhdGEuaWQ7XHJcbiAgICAgICAgdmFyIGFyYyA9IG5ldyBsaWJzYmduanMuQXJjKHtpZDogYXJjSWQsIHNvdXJjZTogYXJjU291cmNlLCB0YXJnZXQ6IGFyY1RhcmdldCwgY2xhc3NfOiBlZGdlLl9wcml2YXRlLmRhdGEuY2xhc3N9KTtcclxuXHJcbiAgICAgICAgYXJjLnNldFN0YXJ0KG5ldyBsaWJzYmduanMuU3RhcnRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFl9KSk7XHJcblxyXG4gICAgICAgIC8vIEV4cG9ydCBiZW5kIHBvaW50cyBpZiBlZGdlQmVuZEVkaXRpbmdFeHRlbnNpb24gaXMgcmVnaXN0ZXJlZFxyXG4gICAgICAgIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgICAgaWYoc2VncHRzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xyXG4gICAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcclxuICAgICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICBhcmMuYWRkTmV4dChuZXcgbGlic2JnbmpzLk5leHRUeXBlKHt4OiBiZW5kWCwgeTogYmVuZFl9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFyYy5zZXRFbmQobmV3IGxpYnNiZ25qcy5FbmRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFgsIHk6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWX0pKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRpbmFsaXR5ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLmNhcmRpbmFsaXR5O1xyXG4gICAgICAgIGlmKHR5cGVvZiBjYXJkaW5hbGl0eSAhPSAndW5kZWZpbmVkJyAmJiBjYXJkaW5hbGl0eSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFyYy5hZGRHbHlwaChuZXcgbGlic2JnbmpzLkdseXBoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBhcmMuaWQrJ19jYXJkJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzXzogJ2NhcmRpbmFsaXR5JyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBjYXJkaW5hbGl0eX0pLFxyXG4gICAgICAgICAgICAgICAgYmJveDogbmV3IGxpYnNiZ25qcy5CYm94KHt4OiAwLCB5OiAwLCB3OiAwLCBoOiAwfSkgLy8gZHVtbXkgYmJveCwgbmVlZGVkIGZvciBmb3JtYXQgY29tcGxpYW5jZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJjO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRHbHlwaEJib3ggOiBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJZiB0aGUgbm9kZSBjYW4gaGF2ZSBwb3J0cyBhbmQgaXQgaGFzIGV4YWN0bHkgMiBwb3J0cyB0aGVuIGl0IGlzIHJlcHJlc2VudGVkIGJ5IGEgYmlnZ2VyIGJib3guXHJcbiAgICAgICAgLy8gVGhpcyBpcyBiZWNhdXNlIHdlIHJlcHJlc2VudCBpdCBhcyBhIHBvbHlnb24gYW5kIHNvIHRoZSB3aG9sZSBzaGFwZSBpbmNsdWRpbmcgdGhlIHBvcnRzIGFyZSByZW5kZXJlZCBpbiB0aGUgbm9kZSBiYm94LlxyXG4gICAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVQb3J0cyhfY2xhc3MpKSB7XHJcbiAgICAgICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID09PSB0cnVlICYmIG5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgLy8gV2UgYXNzdW1lIHRoYXQgdGhlIHBvcnRzIGFyZSBzeW1tZXRyaWMgdG8gdGhlIG5vZGUgY2VudGVyIHNvIHVzaW5nIGp1c3Qgb25lIG9mIHRoZSBwb3J0cyBpcyBlbm91Z2hcclxuICAgICAgICAgICAgdmFyIHBvcnQgPSBub2RlLmRhdGEoJ3BvcnRzJylbMF07XHJcbiAgICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnQueCA9PT0gMCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIHdpdGggcG9ydHMgb3ZlciB3aXRob3V0IHBvcnRzXHJcbiAgICAgICAgICAgIHZhciByYXRpbyA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gTWF0aC5hYnMocG9ydC55KSAvIDUwIDogTWF0aC5hYnMocG9ydC54KSAvIDUwO1xyXG4gICAgICAgICAgICAvLyBEaXZpZGUgdGhlIGJib3ggdG8gdGhlIGNhbGN1bGF0ZWQgcmF0aW8gdG8gZ2V0IHRoZSBiYm94IG9mIHRoZSBhY3R1YWwgc2hhcGUgZGlzY2x1ZGluZyB0aGUgcG9ydHNcclxuICAgICAgICAgICAgd2lkdGggLz0gcmF0aW87XHJcbiAgICAgICAgICAgIGhlaWdodCAvPSByYXRpbztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggLSB3aWR0aC8yO1xyXG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBsaWJzYmduanMuQmJveCh7eDogeCwgeTogeSwgdzogd2lkdGgsIGg6IGhlaWdodH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRTdGF0ZUFuZEluZm9CYm94IDogZnVuY3Rpb24obm9kZSwgYm94R2x5cGgpe1xyXG4gICAgICAgIGJveEJib3ggPSBib3hHbHlwaC5iYm94O1xyXG5cclxuICAgICAgICB2YXIgeCA9IGJveEJib3gueCAvIDEwMCAqIG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgeSA9IGJveEJib3gueSAvIDEwMCAqIG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyAoeCAtIGJveEJib3gudy8yKTtcclxuICAgICAgICB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgKHkgLSBib3hCYm94LmgvMik7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgbGlic2JnbmpzLkJib3goe3g6IHgsIHk6IHksIHc6IGJveEJib3gudywgaDogYm94QmJveC5ofSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcclxuXHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICdzdGF0ZSB2YXJpYWJsZSd9KTtcclxuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgbGlic2JnbmpzLlN0YXRlVHlwZSgpO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhbHVlICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG5vZGUuc3RhdGUudmFsdWU7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFyaWFibGUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHN0YXRlLnZhcmlhYmxlID0gbm9kZS5zdGF0ZS52YXJpYWJsZTtcclxuICAgICAgICBnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgZ2x5cGguc2V0QmJveCh0aGlzLmFkZFN0YXRlQW5kSW5mb0Jib3gobWFpbkdseXBoLCBub2RlKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnbHlwaDtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XHJcbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICd1bml0IG9mIGluZm9ybWF0aW9uJ30pO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5ldyBsaWJzYmduanMuTGFiZWwoKTtcclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBsYWJlbC50ZXh0ID0gbm9kZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgIGdseXBoLnNldExhYmVsKGxhYmVsKTtcclxuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdseXBoO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uVG9TYmdubWw7XHJcbiIsIi8qXHJcbiAqIExpc3RlbiBkb2N1bWVudCBmb3Iga2V5Ym9hcmQgaW5wdXRzIGFuZCBleHBvcnRzIHRoZSB1dGlsaXRpZXMgdGhhdCBpdCBtYWtlcyB1c2Ugb2ZcclxuICovXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIga2V5Ym9hcmRJbnB1dFV0aWxpdGllcyA9IHtcclxuICBpc051bWJlcktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuICggZS5rZXlDb2RlID49IDQ4ICYmIGUua2V5Q29kZSA8PSA1NyApIHx8ICggZS5rZXlDb2RlID49IDk2ICYmIGUua2V5Q29kZSA8PSAxMDUgKTtcclxuICB9LFxyXG4gIGlzRG90S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxOTA7XHJcbiAgfSxcclxuICBpc01pbnVzU2lnbktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTA5IHx8IGUua2V5Q29kZSA9PT0gMTg5O1xyXG4gIH0sXHJcbiAgaXNMZWZ0S2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNztcclxuICB9LFxyXG4gIGlzUmlnaHRLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5O1xyXG4gIH0sXHJcbiAgaXNCYWNrc3BhY2VLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDg7XHJcbiAgfSxcclxuICBpc1RhYktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gOTtcclxuICB9LFxyXG4gIGlzRW50ZXJLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEzO1xyXG4gIH0sXHJcbiAgaXNJbnRlZ2VyRmllbGRJbnB1dDogZnVuY3Rpb24odmFsdWUsIGUpIHtcclxuICAgIHJldHVybiB0aGlzLmlzQ3RybE9yQ29tbWFuZFByZXNzZWQoZSkgfHwgdGhpcy5pc01pbnVzU2lnbktleShlKSB8fCB0aGlzLmlzTnVtYmVyS2V5KGUpIFxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzQmFja3NwYWNlS2V5KGUpIHx8IHRoaXMuaXNUYWJLZXkoZSkgfHwgdGhpcy5pc0xlZnRLZXkoZSkgfHwgdGhpcy5pc1JpZ2h0S2V5KGUpIHx8IHRoaXMuaXNFbnRlcktleShlKTtcclxuICB9LFxyXG4gIGlzRmxvYXRGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSkgfHwgdGhpcy5pc0RvdEtleShlKTtcclxuICB9LFxyXG4gIGlzQ3RybE9yQ29tbWFuZFByZXNzZWQ6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xyXG4gIH1cclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuaW50ZWdlci1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHZhbHVlID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xyXG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNJbnRlZ2VyRmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XHJcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0Zsb2F0RmllbGRJbnB1dCh2YWx1ZSwgZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuaW50ZWdlci1pbnB1dCwuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcclxuICAgIHZhciBtaW4gICA9ICQodGhpcykuYXR0cignbWluJyk7XHJcbiAgICB2YXIgbWF4ICAgPSAkKHRoaXMpLmF0dHIoJ21heCcpO1xyXG4gICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKTtcclxuICAgIFxyXG4gICAgaWYobWluICE9IG51bGwpIHtcclxuICAgICAgbWluID0gcGFyc2VGbG9hdChtaW4pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICBtYXggPSBwYXJzZUZsb2F0KG1heCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKG1pbiAhPSBudWxsICYmIHZhbHVlIDwgbWluKSB7XHJcbiAgICAgIHZhbHVlID0gbWluO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihtYXggIT0gbnVsbCAmJiB2YWx1ZSA+IG1heCkge1xyXG4gICAgICB2YWx1ZSA9IG1heDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgIGlmKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtaW47XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihtYXggIT0gbnVsbCkge1xyXG4gICAgICAgIHZhbHVlID0gbWF4O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkKHRoaXMpLnZhbChcIlwiICsgdmFsdWUpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcztcclxuIiwiLyogXHJcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXHJcbiAqL1xyXG5cclxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcclxuICB0aGlzLmxpYnMgPSBsaWJzO1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5saWJzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7XHJcblxyXG4iLCIvKiBcclxuICogVGhlc2UgYXJlIHRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBkaXJlY3RseSB1dGlsaXplZCBieSB0aGUgdXNlciBpbnRlcmFjdGlvbnMuXHJcbiAqIElkZWFseSwgdGhpcyBmaWxlIGlzIGp1c3QgcmVxdWlyZWQgYnkgaW5kZXguanNcclxuICovXHJcblxyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGpzb25Ub1NiZ25tbCA9IHJlcXVpcmUoJy4vanNvbi10by1zYmdubWwtY29udmVydGVyJyk7XHJcbnZhciBzYmdubWxUb0pzb24gPSByZXF1aXJlKCcuL3NiZ25tbC10by1qc29uLWNvbnZlcnRlcicpO1xyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZ3JhcGgtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxuLy8gSGVscGVycyBzdGFydFxyXG5mdW5jdGlvbiBiZWZvcmVQZXJmb3JtTGF5b3V0KCkge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcclxuXHJcbiAgZ3JhcGhVdGlsaXRpZXMuZGlzYWJsZVBvcnRzKCk7XHJcblxyXG4gIC8vIFRPRE8gZG8gdGhpcyBieSB1c2luZyBleHRlbnNpb24gQVBJXHJcbiAgY3kuJCgnLmVkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xyXG4gIGVkZ2VzLnNjcmF0Y2goJ2N5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzJywgW10pO1xyXG59O1xyXG4vLyBIZWxwZXJzIGVuZFxyXG5cclxuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHt9XHJcblxyXG4vLyBFeHBhbmQgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5leHBhbmROb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXNUb0V4cGFuZCA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2Rlcyhub2Rlcyk7XHJcbiAgaWYgKG5vZGVzVG9FeHBhbmQubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1RvRXhwYW5kLFxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kKG5vZGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDb2xsYXBzZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xyXG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcclxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XHJcbiAgXHJcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2Uobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbGxhcHNlIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5jb2xsYXBzZUNvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcclxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XHJcbiAgXHJcbiAgdmFyIGNvbXBsZXhlcyA9IGN5Lm5vZGVzKFwiW2NsYXNzPSdjb21wbGV4J11cIik7XHJcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMoY29tcGxleGVzKS5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2RlczogY29tcGxleGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KGNvbXBsZXhlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXhwYW5kIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5leHBhbmRDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXHJcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygpLmZpbHRlcihcIltjbGFzcz0nY29tcGxleCddXCIpKTtcclxuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJleHBhbmRSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbGxhcHNlIGFsbCBub2RlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcclxuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZVJlY3Vyc2l2ZWx5KG5vZGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBFeHBhbmQgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuZXhwYW5kQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMoY3kubm9kZXMoJzp2aXNpYmxlJykpO1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcclxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5oaWRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICBcclxuICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcclxuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xyXG5cclxuICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QuIFxyXG4vLyBUaGVuIHVuaGlkZXMgdGhlIHJlc3VsdGluZyBsaXN0IGFuZCBoaWRlcyBvdGhlcnMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuc2hvd05vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXHJcbiAgXHJcbiAgdmFyIGFsbE5vZGVzID0gY3kuZWxlbWVudHMoKTtcclxuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcclxuICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xyXG4gIFxyXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVW5oaWRlcyBhbGwgZWxlbWVudHMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuc2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICBcclxuICBpZiAoY3kuZWxlbWVudHMoKS5sZW5ndGggPT09IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd1wiLCBjeS5lbGVtZW50cygpKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLnNob3coY3kuZWxlbWVudHMoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gUmVtb3ZlcyB0aGUgZ2l2ZW4gZWxlbWVudHMgaW4gYSBzaW1wbGUgd2F5LiBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZSA9IGZ1bmN0aW9uKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xyXG4gICAgICBlbGVzOiBlbGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLnJlbW92ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIHJlbW92ZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcclxuLy8gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTtcclxuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZU5vZGVzU21hcnRcIiwge1xyXG4gICAgICBmaXJzdFRpbWU6IHRydWUsXHJcbiAgICAgIGVsZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEhpZ2hsaWdodHMgbmVpZ2hib3VycyBvZiB0aGUgZ2l2ZW4gbm9kZXMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0TmVpZ2hib3VycyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICBcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5nZXROZWlnaGJvdXJzT2ZOb2Rlcyhub2Rlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEZpbmRzIHRoZSBlbGVtZW50cyB3aG9zZSBsYWJlbCBpbmNsdWRlcyB0aGUgZ2l2ZW4gbGFiZWwgYW5kIGhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRob3NlIGVsZW1lbnRzLlxyXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLnNlYXJjaEJ5TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xyXG4gIGlmIChsYWJlbC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICB2YXIgbm9kZXNUb0hpZ2hsaWdodCA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcclxuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgZWxlID0gaTtcclxuICAgIH1cclxuICAgIGlmIChlbGUuZGF0YShcImxhYmVsXCIpICYmIGVsZS5kYXRhKFwibGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxhYmVsKSA+PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICBpZiAobm9kZXNUb0hpZ2hsaWdodC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcblxyXG4gIG5vZGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KG5vZGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEhpZ2hsaWdodHMgcHJvY2Vzc2VzIG9mIHRoZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xyXG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XHJcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5zYW1lKGhpZ2hsaWdodGVkRWxlcykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlnaGxpZ2h0XCIsIGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQoZWxlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBVbmhpZ2hsaWdodHMgYW55IGhpZ2hsaWdodGVkIGVsZW1lbnQuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLm5vbmVJc05vdEhpZ2hsaWdodGVkKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlSGlnaGxpZ2h0c1wiKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMoKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBQZXJmb3JtcyBsYXlvdXQgYnkgZ2l2ZW4gbGF5b3V0T3B0aW9ucy4gQ29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLiBIb3dldmVyLCBieSBzZXR0aW5nIG5vdFVuZG9hYmxlIHBhcmFtZXRlclxyXG4vLyB0byBhIHRydXRoeSB2YWx1ZSB5b3UgY2FuIGZvcmNlIGFuIHVuZGFibGUgbGF5b3V0IG9wZXJhdGlvbiBpbmRlcGVuZGFudCBvZiAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5wZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0T3B0aW9ucywgbm90VW5kb2FibGUpIHtcclxuICAvLyBUaGluZ3MgdG8gZG8gYmVmb3JlIHBlcmZvcm1pbmcgbGF5b3V0XHJcbiAgYmVmb3JlUGVyZm9ybUxheW91dCgpO1xyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSB8fCBub3RVbmRvYWJsZSkgeyAvLyAnbm90VW5kb2FibGUnIGZsYWcgY2FuIGJlIHVzZWQgdG8gaGF2ZSBjb21wb3NpdGUgYWN0aW9ucyBpbiB1bmRvL3JlZG8gc3RhY2tcclxuICAgIHZhciBsYXlvdXQgPSBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKS5sYXlvdXQobGF5b3V0T3B0aW9ucyk7XHJcbiAgICBcclxuICAgIC8vIENoZWNrIHRoaXMgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcclxuICAgICAgbGF5b3V0LnJ1bigpO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJsYXlvdXRcIiwge1xyXG4gICAgICBvcHRpb25zOiBsYXlvdXRPcHRpb25zLFxyXG4gICAgICBlbGVzOiBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ3JlYXRlcyBhbiBzYmdubWwgZmlsZSBjb250ZW50IGZyb20gdGhlIGV4aXNpbmcgZ3JhcGggYW5kIHJldHVybnMgaXQuXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlU2Jnbm1sID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoKTtcclxufTtcclxuXHJcbi8vIENvbnZlcnRzIGdpdmVuIHNiZ25tbCBkYXRhIHRvIGEganNvbiBvYmplY3QgaW4gYSBzcGVjaWFsIGZvcm1hdCBcclxuLy8gKGh0dHA6Ly9qcy5jeXRvc2NhcGUub3JnLyNub3RhdGlvbi9lbGVtZW50cy1qc29uKSBhbmQgcmV0dXJucyBpdC5cclxubWFpblV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVG9Kc29uID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gIHJldHVybiBzYmdubWxUb0pzb24uY29udmVydChkYXRhKTtcclxufTtcclxuXHJcbi8vIENyZWF0ZSB0aGUgcXRpcCBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbm9kZSBhbmQgcmV0dXJucyBpdC5cclxubWFpblV0aWxpdGllcy5nZXRRdGlwQ29udGVudCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXHJcbiAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIGV4dHJhIHBhZGRpbmcgZm9yIGNvbXBhcnRtZW50XHJcbiAgZXh0cmFDb21wYXJ0bWVudFBhZGRpbmc6IDEwLFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZVxyXG59O1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICB9XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzO1xyXG4iLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxudmFyIGxpYnNiZ25qcyA9IHJlcXVpcmUoJ2xpYnNiZ24uanMnKTtcclxudmFyIHJlbmRlckV4dGVuc2lvbiA9IGxpYnNiZ25qcy5yZW5kZXJFeHRlbnNpb247XHJcblxyXG52YXIgc2Jnbm1sVG9Kc29uID0ge1xyXG4gIGluc2VydGVkTm9kZXM6IHt9LFxyXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKGdseXBoTGlzdCkge1xyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChnbHlwaExpc3RbaV0uY2xhc3NfID09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICB2YXIgY29tcGFydG1lbnQgPSBnbHlwaExpc3RbaV07XHJcbiAgICAgICAgdmFyIGJib3ggPSBjb21wYXJ0bWVudC5iYm94O1xyXG4gICAgICAgIGNvbXBhcnRtZW50cy5wdXNoKHtcclxuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94LngpLFxyXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3gueSksXHJcbiAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveC53KSxcclxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94LmgpLFxyXG4gICAgICAgICAgJ2lkJzogY29tcGFydG1lbnQuaWRcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcnRtZW50cy5zb3J0KGZ1bmN0aW9uIChjMSwgYzIpIHtcclxuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XHJcbiAgfSxcclxuICBpc0luQm91bmRpbmdCb3g6IGZ1bmN0aW9uIChiYm94MSwgYmJveDIpIHtcclxuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxyXG4gICAgICAgIGJib3gxLnkgPiBiYm94Mi55ICYmXHJcbiAgICAgICAgYmJveDEueCArIGJib3gxLncgPCBiYm94Mi54ICsgYmJveDIudyAmJlxyXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBiYm94UHJvcDogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcclxuXHJcbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMjtcclxuICAgIGJib3gueSA9IHBhcnNlRmxvYXQoYmJveC55KSArIHBhcnNlRmxvYXQoYmJveC5oKSAvIDI7XHJcblxyXG4gICAgcmV0dXJuIGJib3g7XHJcbiAgfSxcclxuICBzdGF0ZUFuZEluZm9CYm94UHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XHJcbiAgICB2YXIgeVBvcyA9IHBhcnNlRmxvYXQocGFyZW50QmJveC55KTtcclxuXHJcbiAgICB2YXIgYmJveCA9IGVsZS5iYm94O1xyXG5cclxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXHJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyIC0geFBvcztcclxuICAgIGJib3gueSA9IHBhcnNlRmxvYXQoYmJveC55KSArIHBhcnNlRmxvYXQoYmJveC5oKSAvIDIgLSB5UG9zO1xyXG5cclxuICAgIGJib3gueCA9IGJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcclxuICAgIGJib3gueSA9IGJib3gueSAvIHBhcnNlRmxvYXQocGFyZW50QmJveC5oKSAqIDEwMDtcclxuXHJcbiAgICByZXR1cm4gYmJveDtcclxuICB9LFxyXG4gIGZpbmRDaGlsZE5vZGVzOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcclxuICAgIC8vIGZpbmQgY2hpbGQgbm9kZXMgYXQgZGVwdGggbGV2ZWwgb2YgMSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudFxyXG4gICAgdmFyIGNoaWxkcmVuID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjaGlsZCA9IGVsZS5jaGlsZE5vZGVzW2ldO1xyXG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEgJiYgY2hpbGQudGFnTmFtZSA9PT0gY2hpbGRUYWdOYW1lKSB7XHJcbiAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9LFxyXG4gIGZpbmRDaGlsZE5vZGU6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xyXG4gICAgdmFyIG5vZGVzID0gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsIGNoaWxkVGFnTmFtZSk7XHJcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCA/IG5vZGVzWzBdIDogdW5kZWZpbmVkO1xyXG4gIH0sXHJcbiAgc3RhdGVBbmRJbmZvUHJvcDogZnVuY3Rpb24gKGVsZSwgcGFyZW50QmJveCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb0FycmF5ID0gW107XHJcblxyXG4gICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVyczsgLy8gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XHJcbiAgICAgIHZhciBpbmZvID0ge307XHJcblxyXG4gICAgICBpZiAoZ2x5cGguY2xhc3NfID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICBpbmZvLmlkID0gZ2x5cGguaWQgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8uY2xhenogPSBnbHlwaC5jbGFzc18gfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGluZm8ubGFiZWwgPSB7XHJcbiAgICAgICAgICAndGV4dCc6IChnbHlwaC5sYWJlbCAmJiBnbHlwaC5sYWJlbC50ZXh0KSB8fCB1bmRlZmluZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZ2x5cGguY2xhc3NfID09PSAnc3RhdGUgdmFyaWFibGUnKSB7XHJcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLmNsYXp6ID0gZ2x5cGguY2xhc3NfIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc3RhdGUgPSBnbHlwaC5zdGF0ZTtcclxuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUudmFsdWUpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgdmFyaWFibGUgPSAoc3RhdGUgJiYgc3RhdGUudmFyaWFibGUpIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLnN0YXRlID0ge1xyXG4gICAgICAgICAgJ3ZhbHVlJzogdmFsdWUsXHJcbiAgICAgICAgICAndmFyaWFibGUnOiB2YXJpYWJsZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvQXJyYXkucHVzaChpbmZvKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXR1cm4gc3RhdGVBbmRJbmZvQXJyYXk7XHJcbiAgfSxcclxuICBhZGRQYXJlbnRJbmZvVG9Ob2RlOiBmdW5jdGlvbiAoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNvbXBhcnRtZW50UmVmID0gZWxlLmNvbXBhcnRtZW50UmVmO1xyXG5cclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tcGFydG1lbnRSZWYpIHtcclxuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gJyc7XHJcblxyXG4gICAgICAvLyBhZGQgY29tcGFydG1lbnQgYWNjb3JkaW5nIHRvIGdlb21ldHJ5XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFydG1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJib3hFbCA9IGVsZS5iYm94O1xyXG4gICAgICAgIHZhciBiYm94ID0ge1xyXG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3hFbC54KSxcclxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwueSksXHJcbiAgICAgICAgICAndyc6IHBhcnNlRmxvYXQoYmJveEVsLncpLFxyXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3hFbC5oKSxcclxuICAgICAgICAgICdpZCc6IGVsZS5pZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHNlbGYuaXNJbkJvdW5kaW5nQm94KGJib3gsIGNvbXBhcnRtZW50c1tpXSkpIHtcclxuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBub2RlT2JqID0ge307XHJcblxyXG4gICAgLy8gYWRkIGlkIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmlkID0gZWxlLmlkO1xyXG4gICAgLy8gYWRkIG5vZGUgYm91bmRpbmcgYm94IGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmJib3ggPSBzZWxmLmJib3hQcm9wKGVsZSk7XHJcbiAgICAvLyBhZGQgY2xhc3MgaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xyXG4gICAgLy8gYWRkIGxhYmVsIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmxhYmVsID0gKGVsZS5sYWJlbCAmJiBlbGUubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkO1xyXG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5zdGF0ZXNhbmRpbmZvcyA9IHNlbGYuc3RhdGVBbmRJbmZvUHJvcChlbGUsIG5vZGVPYmouYmJveCk7XHJcbiAgICAvLyBhZGRpbmcgcGFyZW50IGluZm9ybWF0aW9uXHJcbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgLy8gYWRkIGNsb25lIGluZm9ybWF0aW9uXHJcbiAgICBpZiAoZWxlLmNsb25lKSB7XHJcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgcG9ydCBpbmZvcm1hdGlvblxyXG4gICAgdmFyIHBvcnRzID0gW107XHJcbiAgICB2YXIgcG9ydEVsZW1lbnRzID0gZWxlLnBvcnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3J0RWwgPSBwb3J0RWxlbWVudHNbaV07XHJcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5pZDtcclxuICAgICAgdmFyIHJlbGF0aXZlWFBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLngpIC0gbm9kZU9iai5iYm94Lng7XHJcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC55KSAtIG5vZGVPYmouYmJveC55O1xyXG5cclxuICAgICAgcmVsYXRpdmVYUG9zID0gcmVsYXRpdmVYUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiAxMDA7XHJcbiAgICAgIHJlbGF0aXZlWVBvcyA9IHJlbGF0aXZlWVBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogMTAwO1xyXG5cclxuICAgICAgcG9ydHMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcclxuICAgICAgICB5OiByZWxhdGl2ZVlQb3NcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZU9iai5wb3J0cyA9IHBvcnRzO1xyXG4gICAgXHJcbiAgICB2YXIgX2NsYXNzID0gbm9kZU9iai5jbGFzcztcclxuICAgIC8vIElmIHRoZSBub2RlIGNhbiBoYXZlIHBvcnRzIGFuZCBpdCBoYXMgZXhhY3RseSAyIHBvcnRzIHRoZW4gaXQgc2hvdWxkIGJlIHJlcHJlc2VudGVkIGJ5IGEgYmlnZ2VyIGJib3guXHJcbiAgICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2UgcmVwcmVzZW50IGl0IGFzIGEgcG9seWdvbiBhbmQgc28gdGhlIHdob2xlIHNoYXBlIGluY2x1ZGluZyB0aGUgcG9ydHMgYXJlIHJlbmRlcmVkIGluIHRoZSBub2RlIGJib3guXHJcbiAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlUG9ydHMoX2NsYXNzKSkge1xyXG4gICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkICYmIHBvcnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBwb3J0cyBhcmUgc3ltbWV0cmljIHRvIHRoZSBub2RlIGNlbnRlciBzbyB1c2luZyBqdXN0IG9uZSBvZiB0aGUgcG9ydHMgaXMgZW5vdWdoXHJcbiAgICAgICAgdmFyIHBvcnQgPSBwb3J0c1swXTtcclxuICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBwb3J0LnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIHdpdGggcG9ydHMgb3ZlciB3aXRob3V0IHBvcnRzXHJcbiAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0LnkpIC8gNTAgOiBNYXRoLmFicyhwb3J0LngpIC8gNTA7XHJcbiAgICAgICAgLy8gTXVsdGlwbHkgdGhlIGJib3ggd2l0aCB0aGUgY2FsY3VsYXRlZCByYXRpb1xyXG4gICAgICAgIG5vZGVPYmouYmJveC53ID0gcGFyc2VGbG9hdChub2RlT2JqLmJib3gudykgKiByYXRpbztcclxuICAgICAgICBub2RlT2JqLmJib3guaCA9IHBhcnNlRmxvYXQobm9kZU9iai5iYm94LmgpICogcmF0aW87XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xyXG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNOb2RlKTtcclxuICB9LFxyXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBlbElkID0gZWxlLmlkO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NfXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXNbZWxJZF0gPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy8gYWRkIGNvbXBsZXggbm9kZXMgaGVyZVxyXG5cclxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc187XHJcblxyXG4gICAgaWYgKGVsZUNsYXNzID09PSAnY29tcGxleCcgfHwgZWxlQ2xhc3MgPT09ICdjb21wbGV4IG11bHRpbWVyJyB8fCBlbGVDbGFzcyA9PT0gJ3N1Ym1hcCcpIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuXHJcbiAgICAgIHZhciBjaGlsZEdseXBocyA9IGVsZS5nbHlwaE1lbWJlcnM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZ2x5cGggPSBjaGlsZEdseXBoc1tpXTtcclxuICAgICAgICB2YXIgZ2x5cGhDbGFzcyA9IGdseXBoLmNsYXNzXztcclxuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcclxuICAgICAgICAgIHNlbGYudHJhdmVyc2VOb2RlcyhnbHlwaCwganNvbkFycmF5LCBlbElkLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFBvcnRzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XHJcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcclxuICB9LFxyXG4gIGdldEdseXBoczogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xyXG5cclxuICAgIGlmICghZ2x5cGhzKSB7XHJcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XHJcblxyXG4gICAgICB2YXIgaWQyZ2x5cGggPSB4bWxPYmplY3QuX2lkMmdseXBoID0ge307XHJcblxyXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgdmFyIGcgPSBnbHlwaHNbaV07XHJcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblxyXG4gICAgICAgIGlkMmdseXBoWyBpZCBdID0gZztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnbHlwaHM7XHJcbiAgfSxcclxuICBnZXRHbHlwaEJ5SWQ6IGZ1bmN0aW9uICh4bWxPYmplY3QsIGlkKSB7XHJcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcclxuXHJcbiAgICByZXR1cm4geG1sT2JqZWN0Ll9pZDJnbHlwaFtpZF07XHJcbiAgfSxcclxuICBnZXRBcmNTb3VyY2VBbmRUYXJnZXQ6IGZ1bmN0aW9uIChhcmMsIHhtbE9iamVjdCkge1xyXG4gICAgLy8gc291cmNlIGFuZCB0YXJnZXQgY2FuIGJlIGluc2lkZSBvZiBhIHBvcnRcclxuICAgIHZhciBzb3VyY2UgPSBhcmMuc291cmNlO1xyXG4gICAgdmFyIHRhcmdldCA9IGFyYy50YXJnZXQ7XHJcbiAgICB2YXIgc291cmNlTm9kZUlkO1xyXG4gICAgdmFyIHRhcmdldE5vZGVJZDtcclxuXHJcbiAgICB2YXIgc291cmNlRXhpc3RzID0gdGhpcy5nZXRHbHlwaEJ5SWQoeG1sT2JqZWN0LCBzb3VyY2UpO1xyXG4gICAgdmFyIHRhcmdldEV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgdGFyZ2V0KTtcclxuXHJcbiAgICBpZiAoc291cmNlRXhpc3RzKSB7XHJcbiAgICAgIHNvdXJjZU5vZGVJZCA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0RXhpc3RzKSB7XHJcbiAgICAgIHRhcmdldE5vZGVJZCA9IHRhcmdldDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgcG9ydEVscyA9IHRoaXMuZ2V0UG9ydHMoeG1sT2JqZWN0KTtcclxuICAgIHZhciBwb3J0O1xyXG4gICAgaWYgKHNvdXJjZU5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xyXG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gc291cmNlKSB7XHJcbiAgICAgICAgICBzb3VyY2VOb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXROb2RlSWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHBvcnQgPSBwb3J0RWxzW2ldO1xyXG4gICAgICAgIGlmIChwb3J0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXROb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7J3NvdXJjZSc6IHNvdXJjZU5vZGVJZCwgJ3RhcmdldCc6IHRhcmdldE5vZGVJZH07XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gW107XHJcblxyXG4gICAgdmFyIGNoaWxkcmVuID0gZWxlLm5leHRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvc1ggPSBjaGlsZHJlbltpXS54O1xyXG4gICAgICB2YXIgcG9zWSA9IGNoaWxkcmVuW2ldLnk7XHJcblxyXG4gICAgICBiZW5kUG9pbnRQb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgeDogcG9zWCxcclxuICAgICAgICB5OiBwb3NZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcbiAgfSxcclxuICBhZGRDeXRvc2NhcGVKc0VkZ2U6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgeG1sT2JqZWN0KSB7XHJcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc19dKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgc291cmNlQW5kVGFyZ2V0ID0gc2VsZi5nZXRBcmNTb3VyY2VBbmRUYXJnZXQoZWxlLCB4bWxPYmplY3QpO1xyXG5cclxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlZGdlT2JqID0ge307XHJcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gc2VsZi5nZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnMoZWxlKTtcclxuXHJcbiAgICBlZGdlT2JqLmlkID0gZWxlLmlkIHx8IHVuZGVmaW5lZDtcclxuICAgIGVkZ2VPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xyXG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XHJcblxyXG4gICAgZWRnZU9iai5jYXJkaW5hbGl0eSA9IDA7XHJcbiAgICBpZiAoZWxlLmdseXBocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmdseXBocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbGUuZ2x5cGhzW2ldLmNsYXNzXyA9PT0gJ2NhcmRpbmFsaXR5Jykge1xyXG4gICAgICAgICAgdmFyIGxhYmVsID0gZWxlLmdseXBoc1tpXS5sYWJlbDtcclxuICAgICAgICAgIGVkZ2VPYmouY2FyZGluYWxpdHkgPSBsYWJlbC50ZXh0IHx8IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlZGdlT2JqLnNvdXJjZSA9IHNvdXJjZUFuZFRhcmdldC5zb3VyY2U7XHJcbiAgICBlZGdlT2JqLnRhcmdldCA9IHNvdXJjZUFuZFRhcmdldC50YXJnZXQ7XHJcblxyXG4gICAgZWRnZU9iai5wb3J0c291cmNlID0gZWxlLnNvdXJjZTtcclxuICAgIGVkZ2VPYmoucG9ydHRhcmdldCA9IGVsZS50YXJnZXQ7XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcclxuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzRWRnZSk7XHJcbiAgfSxcclxuICBhcHBseVN0eWxlOiBmdW5jdGlvbiAocmVuZGVySW5mb3JtYXRpb24sIG5vZGVzLCBlZGdlcykge1xyXG4gICAgLy8gZ2V0IGFsbCBjb2xvciBpZCByZWZlcmVuY2VzIHRvIHRoZWlyIHZhbHVlXHJcbiAgICB2YXIgY29sb3JMaXN0ID0gcmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucy5jb2xvckRlZmluaXRpb25zO1xyXG4gICAgdmFyIGNvbG9ySURUb1ZhbHVlID0ge307XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBjb2xvckxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29sb3JJRFRvVmFsdWVbY29sb3JMaXN0W2ldLmlkXSA9IGNvbG9yTGlzdFtpXS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb252ZXJ0IHN0eWxlIGxpc3QgdG8gZWxlbWVudElkLWluZGV4ZWQgb2JqZWN0IHBvaW50aW5nIHRvIHN0eWxlXHJcbiAgICAvLyBhbHNvIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlcyB0byBjb2xvciB2YWx1ZXNcclxuICAgIHZhciBzdHlsZUxpc3QgPSByZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZTdHlsZXMuc3R5bGVzO1xyXG4gICAgdmFyIGVsZW1lbnRJRFRvU3R5bGUgPSB7fTtcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3R5bGUgPSBzdHlsZUxpc3RbaV07XHJcbiAgICAgIHZhciByZW5kZXJHcm91cCA9IHN0eWxlLnJlbmRlckdyb3VwO1xyXG5cclxuICAgICAgLy8gY29udmVydCBjb2xvciByZWZlcmVuY2VzXHJcbiAgICAgIGlmIChyZW5kZXJHcm91cC5zdHJva2UgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlbmRlckdyb3VwLnN0cm9rZSA9IGNvbG9ySURUb1ZhbHVlW3JlbmRlckdyb3VwLnN0cm9rZV07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJlbmRlckdyb3VwLmZpbGwgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlbmRlckdyb3VwLmZpbGwgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5maWxsXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGlkTGlzdCA9IHN0eWxlLmlkTGlzdC5zcGxpdCgnICcpO1xyXG4gICAgICBmb3IgKHZhciBqPTA7IGogPCBpZExpc3QubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB2YXIgaWQgPSBpZExpc3Rbal07XHJcbiAgICAgICAgZWxlbWVudElEVG9TdHlsZVtpZF0gPSByZW5kZXJHcm91cDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhleFRvRGVjaW1hbCAoaGV4KSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlSW50KCcweCcraGV4KSAvIDI1NSAqIDEwMCkgLyAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udmVydEhleENvbG9yIChoZXgpIHtcclxuICAgICAgaWYgKGhleC5sZW5ndGggPT0gNykgeyAvLyBubyBvcGFjaXR5IHByb3ZpZGVkXHJcbiAgICAgICAgcmV0dXJuIHtvcGFjaXR5OiBudWxsLCBjb2xvcjogaGV4fTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgLy8gbGVuZ3RoIG9mIDlcclxuICAgICAgICB2YXIgY29sb3IgPSBoZXguc2xpY2UoMCw3KTtcclxuICAgICAgICB2YXIgb3BhY2l0eSA9IGhleFRvRGVjaW1hbChoZXguc2xpY2UoLTIpKTtcclxuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG9wYWNpdHksIGNvbG9yOiBjb2xvcn07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhcHBseSB0aGUgc3R5bGUgdG8gbm9kZXMgYW5kIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdCBzdHlsZVxyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBjb2xvciBwcm9wZXJ0aWVzLCB3ZSBuZWVkIHRvIGNoZWNrIG9wYWNpdHlcclxuICAgICAgdmFyIGJnQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZmlsbDtcclxuICAgICAgaWYgKGJnQ29sb3IpIHtcclxuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGJnQ29sb3IpO1xyXG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1jb2xvciddID0gcmVzLmNvbG9yO1xyXG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1vcGFjaXR5J10gPSByZXMub3BhY2l0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGJvcmRlckNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcclxuICAgICAgaWYgKGJvcmRlckNvbG9yKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihib3JkZXJDb2xvcik7XHJcbiAgICAgICAgbm9kZS5kYXRhWydib3JkZXItY29sb3InXSA9IHJlcy5jb2xvcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGJvcmRlcldpZHRoID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xyXG4gICAgICBpZiAoYm9yZGVyV2lkdGgpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ2JvcmRlci13aWR0aCddID0gYm9yZGVyV2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250U2l6ZSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250U2l6ZTtcclxuICAgICAgaWYgKGZvbnRTaXplKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXNpemUnXSA9IGZvbnRTaXplO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZm9udEZhbWlseSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250RmFtaWx5O1xyXG4gICAgICBpZiAoZm9udEZhbWlseSkge1xyXG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1mYW1pbHknXSA9IGZvbnRGYW1pbHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250U3R5bGUgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFN0eWxlO1xyXG4gICAgICBpZiAoZm9udFN0eWxlKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXN0eWxlJ10gPSBmb250U3R5bGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250V2VpZ2h0ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRXZWlnaHQ7XHJcbiAgICAgIGlmIChmb250V2VpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LXdlaWdodCddID0gZm9udFdlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udGV4dEFuY2hvcjtcclxuICAgICAgaWYgKHRleHRBbmNob3IpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ3RleHQtaGFsaWduJ10gPSB0ZXh0QW5jaG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdnRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udnRleHRBbmNob3I7XHJcbiAgICAgIGlmICh2dGV4dEFuY2hvcikge1xyXG4gICAgICAgIG5vZGUuZGF0YVsndGV4dC12YWxpZ24nXSA9IHZ0ZXh0QW5jaG9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG8gdGhlIHNhbWUgZm9yIGVkZ2VzXHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xyXG5cclxuICAgICAgdmFyIGxpbmVDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbZWRnZS5kYXRhWydpZCddXS5zdHJva2U7XHJcbiAgICAgIGlmIChsaW5lQ29sb3IpIHtcclxuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGxpbmVDb2xvcik7XHJcbiAgICAgICAgZWRnZS5kYXRhWydsaW5lLWNvbG9yJ10gPSByZXMuY29sb3I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRJRFRvU3R5bGVbZWRnZS5kYXRhWydpZCddXS5zdHJva2VXaWR0aDtcclxuICAgICAgaWYgKHdpZHRoKSB7XHJcbiAgICAgICAgZWRnZS5kYXRhWyd3aWR0aCddID0gd2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGNvbnZlcnQ6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XHJcbiAgICB2YXIgY3l0b3NjYXBlSnNFZGdlcyA9IFtdO1xyXG5cclxuICAgIHZhciBzYmduID0gbGlic2JnbmpzLlNiZ24uZnJvbVhNTCh4bWxPYmplY3QucXVlcnlTZWxlY3Rvcignc2JnbicpKTtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBzZWxmLmdldEFsbENvbXBhcnRtZW50cyhzYmduLm1hcC5nbHlwaHMpO1xyXG5cclxuICAgIHZhciBnbHlwaHMgPSBzYmduLm1hcC5nbHlwaHM7XHJcbiAgICB2YXIgYXJjcyA9IHNiZ24ubWFwLmFyY3M7XHJcblxyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBnbHlwaCA9IGdseXBoc1tpXTtcclxuICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKGdseXBoLCBjeXRvc2NhcGVKc05vZGVzLCAnJywgY29tcGFydG1lbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJjcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYXJjID0gYXJjc1tpXTtcclxuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc0VkZ2UoYXJjLCBjeXRvc2NhcGVKc0VkZ2VzLCB4bWxPYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzYmduLm1hcC5leHRlbnNpb24gJiYgc2Jnbi5tYXAuZXh0ZW5zaW9uLmhhcygncmVuZGVySW5mb3JtYXRpb24nKSkgeyAvLyByZW5kZXIgZXh0ZW5zaW9uIHdhcyBmb3VuZFxyXG4gICAgICBzZWxmLmFwcGx5U3R5bGUoc2Jnbi5tYXAuZXh0ZW5zaW9uLmdldCgncmVuZGVySW5mb3JtYXRpb24nKSwgY3l0b3NjYXBlSnNOb2RlcywgY3l0b3NjYXBlSnNFZGdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcclxuICAgIGN5dG9zY2FwZUpzR3JhcGgubm9kZXMgPSBjeXRvc2NhcGVKc05vZGVzO1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5lZGdlcyA9IGN5dG9zY2FwZUpzRWRnZXM7XHJcblxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzID0ge307XHJcblxyXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYmdubWxUb0pzb247XHJcbiIsIi8qXHJcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xyXG4gIC8vVE9ETzogdXNlIENTUydzIFwidGV4dC1vdmVyZmxvdzplbGxpcHNpc1wiIHN0eWxlIGluc3RlYWQgb2YgZnVuY3Rpb24gYmVsb3c/XHJcbiAgdHJ1bmNhdGVUZXh0OiBmdW5jdGlvbiAodGV4dFByb3AsIGZvbnQpIHtcclxuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY29udGV4dC5mb250ID0gZm9udDtcclxuICAgIFxyXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBmaXRMYWJlbHNUb05vZGVzID0gdHlwZW9mIGZpdExhYmVsc1RvTm9kZXMgPT09ICdmdW5jdGlvbicgPyBmaXRMYWJlbHNUb05vZGVzLmNhbGwoKSA6IGZpdExhYmVsc1RvTm9kZXM7XHJcbiAgICBcclxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcclxuICAgIC8vSWYgZml0IGxhYmVscyB0byBub2RlcyBpcyBmYWxzZSBkbyBub3QgdHJ1bmNhdGVcclxuICAgIGlmIChmaXRMYWJlbHNUb05vZGVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHdpZHRoO1xyXG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgdmFyIGVsbGlwc2lzID0gXCIuLlwiO1xyXG4gICAgdmFyIHRleHRXaWR0aCA9ICh0ZXh0UHJvcC53aWR0aCA+IDMwKSA/IHRleHRQcm9wLndpZHRoIC0gMTAgOiB0ZXh0UHJvcC53aWR0aDtcclxuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xyXG4gICAgICAtLWxlbjtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGxlbikgKyBlbGxpcHNpcztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH0sXHJcblxyXG4gIC8vIGVuc3VyZSB0aGF0IHJldHVybmVkIHN0cmluZyBmb2xsb3dzIHhzZDpJRCBzdGFuZGFyZFxyXG4gIC8vIHNob3VsZCBmb2xsb3cgcideW2EtekEtWl9dW1xcdy4tXSokJ1xyXG4gIGdldFhNTFZhbGlkSWQ6IGZ1bmN0aW9uKG9yaWdpbmFsSWQpIHtcclxuICAgIHZhciBuZXdJZCA9IFwiXCI7XHJcbiAgICB2YXIgeG1sVmFsaWRSZWdleCA9IC9eW2EtekEtWl9dW1xcdy4tXSokLztcclxuICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChvcmlnaW5hbElkKSkgeyAvLyBkb2Vzbid0IGNvbXBseVxyXG4gICAgICBuZXdJZCA9IG9yaWdpbmFsSWQ7XHJcbiAgICAgIG5ld0lkID0gbmV3SWQucmVwbGFjZSgvW15cXHcuLV0vZywgXCJcIik7XHJcbiAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gc3RpbGwgZG9lc24ndCBjb21wbHlcclxuICAgICAgICBuZXdJZCA9IFwiX1wiICsgbmV3SWQ7XHJcbiAgICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBub3JtYWxseSB3ZSBzaG91bGQgbmV2ZXIgZW50ZXIgdGhpc1xyXG4gICAgICAgICAgLy8gaWYgZm9yIHNvbWUgb2JzY3VyZSByZWFzb24gd2Ugc3RpbGwgZG9uJ3QgY29tcGx5LCB0aHJvdyBlcnJvci5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgaWRlbnRpZmVyIGNvbXBseSB0byB4c2Q6SUQgcmVxdWlyZW1lbnRzOiBcIituZXdJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdJZDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gb3JpZ2luYWxJZDtcclxuICAgIH1cclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0VXRpbGl0aWVzOyIsIi8qXHJcbiAqIENvbW1vbmx5IG5lZWRlZCBVSSBVdGlsaXRpZXNcclxuICovXHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgdWlVdGlsaXRpZXMgPSB7XHJcbiAgc3RhcnRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLndpZHRoKCk7XHJcbiAgICAgIHZhciBjb250YWluZXJIZWlnaHQgPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS5oZWlnaHQoKTtcclxuICAgICAgJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvciArICc6cGFyZW50JykucHJlcGVuZCgnPGkgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDk5OTk5OTk7IGxlZnQ6ICcgKyBjb250YWluZXJXaWR0aCAvIDIgKyAncHg7IHRvcDogJyArIGNvbnRhaW5lckhlaWdodCAvIDIgKyAncHg7XCIgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtM3ggZmEtZncgJyArIGNsYXNzTmFtZSArICdcIj48L2k+Jyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbmRTcGlubmVyOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKCcuJyArIGNsYXNzTmFtZSkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1aVV0aWxpdGllcztcclxuXHJcblxyXG4iLCIvKlxyXG4gKiBUaGlzIGZpbGUgZXhwb3J0cyB0aGUgZnVuY3Rpb25zIHRvIGJlIHV0aWxpemVkIGluIHVuZG9yZWRvIGV4dGVuc2lvbiBhY3Rpb25zIFxyXG4gKi9cclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB7XHJcbiAgLy8gU2VjdGlvbiBTdGFydFxyXG4gIC8vIEFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG4gIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIHJlc3RvcmVFbGVzOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgdmFyIHBhcmFtID0ge307XHJcbiAgICBwYXJhbS5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhlbGVzKTtcclxuICAgIHJldHVybiBwYXJhbTtcclxuICB9LFxyXG4gIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0KHBhcmFtLmVsZXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcclxuICB9LFxyXG4gIC8vIFNlY3Rpb24gRW5kXHJcbiAgLy8gQWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==

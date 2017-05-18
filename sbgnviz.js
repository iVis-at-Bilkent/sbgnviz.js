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

      if (portId == null || !graphUtilities.portsEnabled) {
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
      // Return the cached portsordering if exists
      if (node.data('portsordering')) {
        return node.data('portsordering');
      }
      
      var ports = node.data('ports');
      if (ports.length !== 2) {
        node.data('portsordering', 'none'); // Cache the ports ordering
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
      
      var portsordering;
      if (orientation === 'horizontal') {
        var leftPortId = ports[0].x < 0 ? ports[0].id : ports[1].id; // Left port is the port whose x value is negative
        // If left port is port target for any of connected edges then the ordering is 'L-to-R' else it is 'R-to-L'
        if (isPortTargetOfAnyEdge(connectedEdges, leftPortId)) {
          portsordering = 'L-to-R';
        }
        else {
          portsordering = 'R-to-L';
        }
      }
      else {
        var topPortId = ports[0].y < 0 ? ports[0].id : ports[1].id; // Top port is the port whose y value is negative
        // If top  port is port target for any of connected edges then the ordering is 'T-to-B' else it is 'B-to-T'
        if (isPortTargetOfAnyEdge(connectedEdges, topPortId)) {
          portsordering = 'T-to-B';
        }
        else {
          portsordering = 'B-to-T';
        }
      }
      
      // Cache the portsordering and return it.
      node.data('portsordering', portsordering);
      return portsordering;
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
var renderExtension = libsbgnjs.render;
var annot = libsbgnjs.annot;
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

    getAnnotationExtension: function(cyElement) {
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
    },

    getGlyphSbgnml : function(node){
        var self = this;
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
            var extension;
            if(glyph.extension) { // an extension is already there for thise glyph
                extension = glyph.extension;
            }
            else {
                extension = new libsbgnjs.Extension();
                glyph.setExtension(extension);
            }
            var annotExt = self.getAnnotationExtension(node);
            extension.add(annotExt);
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
            var extension;
            if(arc.extension) { // an extension is already there for thise arc
                extension = arc.extension;
            }
            else {
                extension = new libsbgnjs.Extension();
                arc.setExtension(extension);
            }
            var annotExt = this.getAnnotationExtension(edge);
            extension.add(annotExt);
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

    if (ele.extension && ele.extension.has('annotation')) { // annotation extension was found
      var rdfElement = ele.extension.get('annotation').rdfElement;
      nodeObj = self.handleAnnotations(nodeObj, rdfElement);
    }

    var cytoscapeJsNode = {data: nodeObj};
    jsonArray.push(cytoscapeJsNode);
  },
  /**
   * given a future cy object, and the corresponding element's libsbgnjs' extension, populates the annotations field
   */
  handleAnnotations: function(cyObject, rdfElement) {
    // local utility function
    function dbFromUrl(url) {
      var regexp = /^http:\/\/identifiers.org\/(.+?)\/.+$/;
      return url.replace(regexp, '$1');
    }

    function fillElementDataAnnotation(cyObject, annotationIndex, status, selectedDB, selectedRelation, annotationValue) {
      if(!cyObject.annotations) {
        cyObject.annotations = {};
      }
      var annotId = cyObject.id+"-annot-"+annotationIndex;

      cyObject.annotations[annotId] = {
        // The following may be hazardous. But setting it as unchecked leave the annotation out if the file is saved.
        // This would lead to the user losing annotations without knowing it.
        status: status, // <-- we trust that what's been loaded is valid.
        selectedDB: selectedDB,
        selectedRelation: selectedRelation,
        annotationValue: annotationValue
      };
      return cyObject;
    }

    // we assume that the id of the rdf:about field is the one of the current node, and that there's only 1 description
    var id = rdfElement.getAllIds()[0];
    var resources = rdfElement.getResourcesOfId(id);
    var customProperties = rdfElement.getCustomPropertiesOfId(id);

    var globalAnnotIndex = 0;
    // handle controlled properties
    for (var fullQualifier in resources) {
      var relation = libsbgnjs.annot.Util.reducePrefix(fullQualifier);
      for(var i=0; i<resources[fullQualifier].length; i++) {
        var value = resources[fullQualifier][i];
        var selectedDB = dbFromUrl(value);
        cyObject = fillElementDataAnnotation(cyObject, globalAnnotIndex, "validated", selectedDB, relation, value);
        globalAnnotIndex++;
      }
    }
    // handle custom properties
    for (var key in customProperties) {
      var value = customProperties[key];
      cyObject = fillElementDataAnnotation(cyObject, globalAnnotIndex, "validated", key, "sio:SIO_000223", value);
      globalAnnotIndex++;
    }

    return cyObject;
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

    if (ele.extension && ele.extension.has('annotation')) { // annotation extension was found
      var rdfElement = ele.extension.get('annotation').rdfElement;
      edgeObj = self.handleAnnotations(edgeObj, rdfElement);
    }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy9saWJzYmduLXJlbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9saWJzYmduLmpzL2xpYnNiZ24uanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvcHJldHR5LWRhdGEvcHJldHR5LWRhdGEuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS1wYXJzZXIuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy94bWxkb20vc2F4LmpzIiwicGFja2FnZS5qc29uIiwic3JjL2luZGV4LmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlLmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyLmpzIiwic3JjL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy91aS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ptQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNua0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNoZWNrUGFyYW1zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5jaGVja1BhcmFtcztcclxudmFyIHhtbGRvbSA9IHJlcXVpcmUoJ3htbGRvbScpO1xyXG5cclxudmFyIG5zID0ge307XHJcblxyXG5ucy54bWxucyA9IFwiaHR0cDovL3d3dy5zYm1sLm9yZy9zYm1sL2xldmVsMy92ZXJzaW9uMS9yZW5kZXIvdmVyc2lvbjFcIjtcclxuXHJcbi8vIC0tLS0tLS0gQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cclxubnMuQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24ocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICd2YWx1ZSddKTtcclxuXHR0aGlzLmlkIFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy52YWx1ZSBcdD0gcGFyYW1zLnZhbHVlO1xyXG59O1xyXG5cclxubnMuQ29sb3JEZWZpbml0aW9uLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnY29sb3JEZWZpbml0aW9uJyk7XHJcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0Y29sb3JEZWZpbml0aW9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xyXG5cdFx0Y29sb3JEZWZpbml0aW9uLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcclxuXHR9XHJcblx0cmV0dXJuIGNvbG9yRGVmaW5pdGlvbjtcclxufTtcclxuXHJcbm5zLkNvbG9yRGVmaW5pdGlvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5Db2xvckRlZmluaXRpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2NvbG9yRGVmaW5pdGlvbicpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgY29sb3JEZWZpbml0aW9uLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IG5zLkNvbG9yRGVmaW5pdGlvbigpO1xyXG5cdGNvbG9yRGVmaW5pdGlvbi5pZCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdGNvbG9yRGVmaW5pdGlvbi52YWx1ZSBcdD0geG1sLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuXHRyZXR1cm4gY29sb3JEZWZpbml0aW9uO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBDT0xPUkRFRklOSVRJT04gLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cclxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLmNvbG9yRGVmaW5pdGlvbnMgPSBbXTtcclxufTtcclxuXHJcbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLmFkZENvbG9yRGVmaW5pdGlvbiA9IGZ1bmN0aW9uIChjb2xvckRlZmluaXRpb24pIHtcclxuXHR0aGlzLmNvbG9yRGVmaW5pdGlvbnMucHVzaChjb2xvckRlZmluaXRpb24pO1xyXG59O1xyXG5cclxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdsaXN0T2ZDb2xvckRlZmluaXRpb25zJyk7XHJcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5jb2xvckRlZmluaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFwcGVuZENoaWxkKHRoaXMuY29sb3JEZWZpbml0aW9uc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IG5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMoKTtcclxuXHJcblx0dmFyIGNvbG9yRGVmaW5pdGlvbnMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NvbG9yRGVmaW5pdGlvbicpO1xyXG5cdGZvciAodmFyIGk9MDsgaTxjb2xvckRlZmluaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgY29sb3JEZWZpbml0aW9uWE1MID0gY29sb3JEZWZpbml0aW9uc1tpXTtcclxuXHRcdHZhciBjb2xvckRlZmluaXRpb24gPSBucy5Db2xvckRlZmluaXRpb24uZnJvbVhNTChjb2xvckRlZmluaXRpb25YTUwpO1xyXG5cdFx0bGlzdE9mQ29sb3JEZWZpbml0aW9ucy5hZGRDb2xvckRlZmluaXRpb24oY29sb3JEZWZpbml0aW9uKTtcclxuXHR9XHJcblx0cmV0dXJuIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIExJU1RPRkNPTE9SREVGSU5JVElPTlMgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBSRU5ERVJHUk9VUCAtLS0tLS0tXHJcbm5zLlJlbmRlckdyb3VwID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdC8vIGVhY2ggb2YgdGhvc2UgYXJlIG9wdGlvbmFsLCBzbyB0ZXN0IGlmIGl0IGlzIGRlZmluZWQgaXMgbWFuZGF0b3J5XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydmb250U2l6ZScsICdmb250RmFtaWx5JywgJ2ZvbnRXZWlnaHQnLCBcclxuXHRcdCdmb250U3R5bGUnLCAndGV4dEFuY2hvcicsICd2dGV4dEFuY2hvcicsICdmaWxsJywgJ2lkJywgJ3N0cm9rZScsICdzdHJva2VXaWR0aCddKTtcclxuXHQvLyBzcGVjaWZpYyB0byByZW5kZXJHcm91cFxyXG5cdHRoaXMuZm9udFNpemUgXHRcdD0gcGFyYW1zLmZvbnRTaXplO1xyXG5cdHRoaXMuZm9udEZhbWlseSBcdD0gcGFyYW1zLmZvbnRGYW1pbHk7XHJcblx0dGhpcy5mb250V2VpZ2h0IFx0PSBwYXJhbXMuZm9udFdlaWdodDtcclxuXHR0aGlzLmZvbnRTdHlsZSBcdFx0PSBwYXJhbXMuZm9udFN0eWxlO1xyXG5cdHRoaXMudGV4dEFuY2hvciBcdD0gcGFyYW1zLnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3NcclxuXHR0aGlzLnZ0ZXh0QW5jaG9yIFx0PSBwYXJhbXMudnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3NcclxuXHQvLyBmcm9tIEdyYXBoaWNhbFByaW1pdGl2ZTJEXHJcblx0dGhpcy5maWxsIFx0XHRcdD0gcGFyYW1zLmZpbGw7IC8vIGZpbGwgY29sb3JcclxuXHQvLyBmcm9tIEdyYXBoaWNhbFByaW1pdGl2ZTFEXHJcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLnN0cm9rZSBcdFx0PSBwYXJhbXMuc3Ryb2tlOyAvLyBzdHJva2UgY29sb3JcclxuXHR0aGlzLnN0cm9rZVdpZHRoIFx0PSBwYXJhbXMuc3Ryb2tlV2lkdGg7XHJcbn07XHJcblxyXG5ucy5SZW5kZXJHcm91cC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHJlbmRlckdyb3VwID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZycpO1xyXG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuZm9udFNpemUgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250U2l6ZScsIHRoaXMuZm9udFNpemUpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5mb250RmFtaWx5ICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udEZhbWlseScsIHRoaXMuZm9udEZhbWlseSk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmZvbnRXZWlnaHQgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250V2VpZ2h0JywgdGhpcy5mb250V2VpZ2h0KTtcclxuXHR9XHJcblx0aWYgKHRoaXMuZm9udFN0eWxlICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udFN0eWxlJywgdGhpcy5mb250U3R5bGUpO1xyXG5cdH1cclxuXHRpZiAodGhpcy50ZXh0QW5jaG9yICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgndGV4dEFuY2hvcicsIHRoaXMudGV4dEFuY2hvcik7XHJcblx0fVxyXG5cdGlmICh0aGlzLnZ0ZXh0QW5jaG9yICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgndnRleHRBbmNob3InLCB0aGlzLnZ0ZXh0QW5jaG9yKTtcclxuXHR9XHJcblx0aWYgKHRoaXMuc3Ryb2tlICE9IG51bGwpIHtcclxuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy5zdHJva2UpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5zdHJva2VXaWR0aCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZVdpZHRoJywgdGhpcy5zdHJva2VXaWR0aCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLmZpbGwgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy5maWxsKTtcclxuXHR9XHJcblx0cmV0dXJuIHJlbmRlckdyb3VwO1xyXG59O1xyXG5cclxubnMuUmVuZGVyR3JvdXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuUmVuZGVyR3JvdXAuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2cnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGcsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciByZW5kZXJHcm91cCA9IG5ldyBucy5SZW5kZXJHcm91cCh7fSk7XHJcblx0cmVuZGVyR3JvdXAuaWQgXHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdHJlbmRlckdyb3VwLmZvbnRTaXplIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250U2l6ZScpO1xyXG5cdHJlbmRlckdyb3VwLmZvbnRGYW1pbHkgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRGYW1pbHknKTtcclxuXHRyZW5kZXJHcm91cC5mb250V2VpZ2h0IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250V2VpZ2h0Jyk7XHJcblx0cmVuZGVyR3JvdXAuZm9udFN0eWxlIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmb250U3R5bGUnKTtcclxuXHRyZW5kZXJHcm91cC50ZXh0QW5jaG9yIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCd0ZXh0QW5jaG9yJyk7XHJcblx0cmVuZGVyR3JvdXAudnRleHRBbmNob3IgPSB4bWwuZ2V0QXR0cmlidXRlKCd2dGV4dEFuY2hvcicpO1xyXG5cdHJlbmRlckdyb3VwLnN0cm9rZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdzdHJva2UnKTtcclxuXHRyZW5kZXJHcm91cC5zdHJva2VXaWR0aCA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZVdpZHRoJyk7XHJcblx0cmVuZGVyR3JvdXAuZmlsbCBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XHJcblx0cmV0dXJuIHJlbmRlckdyb3VwO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBSRU5ERVJHUk9VUCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFNUWUxFIC0tLS0tLS1cclxuLy8gbG9jYWxTdHlsZSBmcm9tIHNwZWNzXHJcbm5zLlN0eWxlID0gZnVuY3Rpb24ocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ2lkTGlzdCcsICdyZW5kZXJHcm91cCddKTtcclxuXHR0aGlzLmlkIFx0XHRcdD0gcGFyYW1zLmlkO1xyXG5cdHRoaXMubmFtZSBcdFx0XHQ9IHBhcmFtcy5uYW1lO1xyXG5cdHRoaXMuaWRMaXN0IFx0XHQ9IHBhcmFtcy5pZExpc3Q7IC8vIFRPRE8gYWRkIHV0aWxpdHkgZnVuY3Rpb25zIHRvIG1hbmFnZSB0aGlzIChzaG91bGQgYmUgYXJyYXkpXHJcblx0dGhpcy5yZW5kZXJHcm91cCBcdD0gcGFyYW1zLnJlbmRlckdyb3VwO1xyXG59O1xyXG5cclxubnMuU3R5bGUucHJvdG90eXBlLnNldFJlbmRlckdyb3VwID0gZnVuY3Rpb24gKHJlbmRlckdyb3VwKSB7XHJcblx0dGhpcy5yZW5kZXJHcm91cCA9IHJlbmRlckdyb3VwO1xyXG59O1xyXG5cclxubnMuU3R5bGUucHJvdG90eXBlLmdldElkTGlzdEFzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHRoaXMuaWRMaXN0LnNwbGl0KCcgJyk7XHJcbn1cclxuXHJcbm5zLlN0eWxlLnByb3RvdHlwZS5zZXRJZExpc3RGcm9tQXJyYXkgPSBmdW5jdGlvbiAoaWRBcnJheSkge1xyXG5cdHRoaXMuaWRMaXN0ID0gaWRBcnJheS5qb2luKCcgJyk7XHJcbn1cclxuXHJcbm5zLlN0eWxlLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc3R5bGUgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XHJcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCB0aGlzLm5hbWUpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5pZExpc3QgIT0gbnVsbCkge1xyXG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdpZExpc3QnLCB0aGlzLmlkTGlzdCk7XHJcblx0fVxyXG5cclxuXHRpZiAodGhpcy5yZW5kZXJHcm91cCkge1xyXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJHcm91cC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlO1xyXG59O1xyXG5cclxubnMuU3R5bGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuU3R5bGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ3N0eWxlJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdHlsZSwgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHN0eWxlID0gbmV3IG5zLlN0eWxlKCk7XHJcblx0c3R5bGUuaWQgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRzdHlsZS5uYW1lIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcclxuXHRzdHlsZS5pZExpc3QgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkTGlzdCcpO1xyXG5cclxuXHR2YXIgcmVuZGVyR3JvdXBYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2cnKVswXTtcclxuXHRpZiAocmVuZGVyR3JvdXBYTUwgIT0gbnVsbCkge1xyXG5cdFx0c3R5bGUucmVuZGVyR3JvdXAgPSBucy5SZW5kZXJHcm91cC5mcm9tWE1MKHJlbmRlckdyb3VwWE1MKTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBTVFlMRSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIExJU1RPRlNUWUxFUyAtLS0tLS0tXHJcbm5zLkxpc3RPZlN0eWxlcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuc3R5bGVzID0gW107XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmFkZFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcclxuXHR0aGlzLnN0eWxlcy5wdXNoKHN0eWxlKTtcclxufTtcclxuXHJcbm5zLkxpc3RPZlN0eWxlcy5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGxpc3RPZlN0eWxlcyA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2xpc3RPZlN0eWxlcycpO1xyXG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsaXN0T2ZTdHlsZXMuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZXNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiBsaXN0T2ZTdHlsZXM7XHJcbn07XHJcblxyXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuTGlzdE9mU3R5bGVzLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdsaXN0T2ZTdHlsZXMnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxpc3RPZlN0eWxlcywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGxpc3RPZlN0eWxlcyA9IG5ldyBucy5MaXN0T2ZTdHlsZXMoKTtcclxuXHJcblx0dmFyIHN0eWxlcyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3R5bGUnKTtcclxuXHRmb3IgKHZhciBpPTA7IGk8c3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgc3R5bGVYTUwgPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgc3R5bGUgPSBucy5TdHlsZS5mcm9tWE1MKHN0eWxlWE1MKTtcclxuXHRcdGxpc3RPZlN0eWxlcy5hZGRTdHlsZShzdHlsZSk7XHJcblx0fVxyXG5cdHJldHVybiBsaXN0T2ZTdHlsZXM7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIExJU1RPRlNUWUxFUyAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFJFTkRFUklORk9STUFUSU9OIC0tLS0tLS1cclxubnMuUmVuZGVySW5mb3JtYXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ3Byb2dyYW1OYW1lJywgXHJcblx0XHQncHJvZ3JhbVZlcnNpb24nLCAnYmFja2dyb3VuZENvbG9yJywgJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnLCAnbGlzdE9mU3R5bGVzJ10pO1xyXG5cdHRoaXMuaWQgXHRcdFx0XHRcdD0gcGFyYW1zLmlkOyAvLyByZXF1aXJlZCwgcmVzdCBpcyBvcHRpb25hbFxyXG5cdHRoaXMubmFtZSBcdFx0XHRcdFx0PSBwYXJhbXMubmFtZTtcclxuXHR0aGlzLnByb2dyYW1OYW1lIFx0XHRcdD0gcGFyYW1zLnByb2dyYW1OYW1lO1xyXG5cdHRoaXMucHJvZ3JhbVZlcnNpb24gXHRcdD0gcGFyYW1zLnByb2dyYW1WZXJzaW9uO1xyXG5cdHRoaXMuYmFja2dyb3VuZENvbG9yIFx0XHQ9IHBhcmFtcy5iYWNrZ3JvdW5kQ29sb3I7XHJcblx0dGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gcGFyYW1zLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XHJcblx0dGhpcy5saXN0T2ZTdHlsZXMgXHRcdFx0PSBwYXJhbXMubGlzdE9mU3R5bGVzO1xyXG5cdC8qdGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZDb2xvckRlZmluaXRpb25zKHJlbmRlckluZm8uY29sb3JEZWYuY29sb3JMaXN0KTtcclxuXHR0aGlzLmxpc3RPZlN0eWxlcyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzKHJlbmRlckluZm8uc3R5bGVEZWYpO1xyXG5cdCovXHJcbn07XHJcblxyXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGZ1bmN0aW9uKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcclxuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBsaXN0T2ZDb2xvckRlZmluaXRpb25zO1xyXG59O1xyXG5cclxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnNldExpc3RPZlN0eWxlcyA9IGZ1bmN0aW9uKGxpc3RPZlN0eWxlcykge1xyXG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbGlzdE9mU3R5bGVzO1xyXG59O1xyXG5cclxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3JlbmRlckluZm9ybWF0aW9uJyk7XHJcblx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCd4bWxucycsIG5zLnhtbG5zKTtcclxuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcclxuXHR9XHJcblx0aWYgKHRoaXMucHJvZ3JhbU5hbWUgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScsIHRoaXMucHJvZ3JhbU5hbWUpO1xyXG5cdH1cclxuXHRpZiAodGhpcy5wcm9ncmFtVmVyc2lvbiAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ3Byb2dyYW1WZXJzaW9uJywgdGhpcy5wcm9ncmFtVmVyc2lvbik7XHJcblx0fVxyXG5cdGlmICh0aGlzLmJhY2tncm91bmRDb2xvciAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicsIHRoaXMuYmFja2dyb3VuZENvbG9yKTtcclxuXHR9XHJcblxyXG5cdGlmICh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcclxuXHRcdHJlbmRlckluZm9ybWF0aW9uLmFwcGVuZENoaWxkKHRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucy5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYgKHRoaXMubGlzdE9mU3R5bGVzKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmxpc3RPZlN0eWxlcy5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0cmV0dXJuIHJlbmRlckluZm9ybWF0aW9uO1xyXG59O1xyXG5cclxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG4vLyBzdGF0aWMgY29uc3RydWN0b3IgbWV0aG9kXHJcbm5zLlJlbmRlckluZm9ybWF0aW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0aWYgKHhtbC50YWdOYW1lICE9ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgcmVuZGVySW5mb3JtYXRpb24sIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyBucy5SZW5kZXJJbmZvcm1hdGlvbigpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLmlkIFx0XHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLm5hbWUgXHRcdFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcclxuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtTmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLnByb2dyYW1WZXJzaW9uIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdwcm9ncmFtVmVyc2lvbicpO1xyXG5cdHJlbmRlckluZm9ybWF0aW9uLmJhY2tncm91bmRDb2xvciBcdD0geG1sLmdldEF0dHJpYnV0ZSgnYmFja2dyb3VuZENvbG9yJyk7XHJcblxyXG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MID0geG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaXN0T2ZDb2xvckRlZmluaXRpb25zJylbMF07XHJcblx0dmFyIGxpc3RPZlN0eWxlc1hNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGlzdE9mU3R5bGVzJylbMF07XHJcblx0aWYgKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwgIT0gbnVsbCkge1xyXG5cdFx0cmVuZGVySW5mb3JtYXRpb24ubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuZnJvbVhNTChsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MKTtcclxuXHR9XHJcblx0aWYgKGxpc3RPZlN0eWxlc1hNTCAhPSBudWxsKSB7XHJcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZTdHlsZXMgPSBucy5MaXN0T2ZTdHlsZXMuZnJvbVhNTChsaXN0T2ZTdHlsZXNYTUwpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlbmRlckluZm9ybWF0aW9uO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBSRU5ERVJJTkZPUk1BVElPTiAtLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsInZhciByZW5kZXJFeHQgPSByZXF1aXJlKCcuL2xpYnNiZ24tcmVuZGVyJyk7XHJcbi8vdmFyIGFubm90RXh0ID0gcmVxdWlyZSgnLi9saWJzYmduLWFubm90YXRpb25zJyk7XHJcbnZhciBjaGVja1BhcmFtcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJykuY2hlY2tQYXJhbXM7XHJcbnZhciB4bWxkb20gPSByZXF1aXJlKCd4bWxkb20nKTtcclxuXHJcbnZhciBucyA9IHt9O1xyXG5cclxubnMueG1sbnMgPSBcImh0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuM1wiO1xyXG5cclxuLy8gLS0tLS0tLSBTQkdOQmFzZSAtLS0tLS0tXHJcbi8qXHJcblx0U2V2ZXJhbCBzYmduIGVsZW1lbnRzIGluaGVyaXQgZnJvbSB0aGlzLiBBbGxvd3MgdG8gcHV0IGV4dGVuc2lvbnMgZXZlcnl3aGVyZS5cclxuKi9cclxubnMuU0JHTkJhc2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydleHRlbnNpb24nXSk7XHJcblx0dGhpcy5leHRlbnNpb24gXHQ9IHBhcmFtcy5leHRlbnNpb247XHJcbn07XHJcblxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuc2V0RXh0ZW5zaW9uID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xyXG5cdHRoaXMuZXh0ZW5zaW9uID0gZXh0ZW5zaW9uO1xyXG59O1xyXG5cclxuLy8gd3JpdGUgdGhlIFhNTCBvZiB0aGluZ3MgdGhhdCBhcmUgc3BlY2lmaWMgdG8gU0JHTkJhc2UgdHlwZVxyXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuYmFzZVRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB4bWxTdHJpbmcgPSBcIlwiO1xyXG5cdC8vIGNoaWxkcmVuXHJcblx0aWYodGhpcy5leHRlbnNpb24gIT0gbnVsbCkge1xyXG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuZXh0ZW5zaW9uLnRvWE1MKCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4geG1sU3RyaW5nO1xyXG59O1xyXG5cclxubnMuU0JHTkJhc2UucHJvdG90eXBlLmJhc2VUb1htbE9iaiA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZih0aGlzLmV4dGVuc2lvbiAhPSBudWxsKSB7XHJcblx0XHR4bWxPYmouYXBwZW5kQ2hpbGQodGhpcy5leHRlbnNpb24uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG59O1xyXG5cclxuLy8gcGFyc2UgdGhpbmdzIHNwZWNpZmljIHRvIFNCR05CYXNlIHR5cGVcclxubnMuU0JHTkJhc2UucHJvdG90eXBlLmJhc2VGcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdC8vIGNoaWxkcmVuXHJcblx0dmFyIGV4dGVuc2lvblhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZXh0ZW5zaW9uJylbMF07XHJcblx0aWYgKGV4dGVuc2lvblhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgZXh0ZW5zaW9uID0gbnMuRXh0ZW5zaW9uLmZyb21YTUwoZXh0ZW5zaW9uWE1MKTtcclxuXHRcdHRoaXMuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XHJcblx0fVxyXG59O1xyXG5cclxubnMuU0JHTkJhc2UucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBhbGxvd2VkQ2hpbGRyZW4gPSBbJ2V4dGVuc2lvbiddLmNvbmNhdCh0aGlzLmFsbG93ZWRDaGlsZHJlbik7XHJcblx0Zm9yKHZhciBpPTA7IGkgPCBhbGxvd2VkQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBwcm9wID0gYWxsb3dlZENoaWxkcmVuW2ldO1xyXG5cdFx0aWYodHlwZW9mIHRoaXNbcHJvcF0gPT0gJ2FycmF5JyAmJiB0aGlzW3Byb3BdLmxlbmd0aCA+IDApXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0aWYodGhpc1twcm9wXSlcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gZm9yIHNpbXBsZSBlbGVtZW50cyB0aGF0IGhhdmUgbm8gY2hpbGRyZW4sIHVzZSB0aGlzIGZ1bmN0aW9uIHRvXHJcbi8vIGVuc3VyZSB0YWcgaXMgY2xvc2VkIGNvcnJlY3RseSB3aGVuIHdyaXRpbmcgWE1MLCBpZiBleHRlbnNpb25cclxuLy8gb3Igb3RoZXIgU0JHTkJhc2Ugc3BlY2lmaWMgdGhpbmdzIGFyZSBwcmVzZW50LlxyXG4vLyBzaW1wbGUgZWxlbWVudHMgbWlnaHQgZW5kIHdpdGggLz4gb3IgPC9uYW1lPiBcclxubnMuU0JHTkJhc2UucHJvdG90eXBlLmNsb3NlVGFnID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB4bWxTdHJpbmcgPSBcIlwiO1xyXG5cdGlmKHRoaXMuaGFzQ2hpbGRyZW4oKSkge1xyXG5cdFx0eG1sU3RyaW5nICs9IFwiPlxcblwiO1xyXG5cdFx0eG1sU3RyaW5nICs9IHRoaXMuYmFzZVRvWE1MKCk7XHJcblx0XHR4bWxTdHJpbmcgKz0gXCI8L1wiK3RoaXMudGFnTmFtZStcIj5cXG5cIjtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcclxuXHR9XHJcblx0cmV0dXJuIHhtbFN0cmluZztcclxufVxyXG4vLyAtLS0tLS0tIEVORCBTQkdOQmFzZSAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIFNCR04gLS0tLS0tLVxyXG5ucy5TYmduID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3htbG5zJywgJ21hcCddKTtcclxuXHR0aGlzLnhtbG5zIFx0PSBwYXJhbXMueG1sbnM7XHJcblx0dGhpcy5tYXAgXHQ9IHBhcmFtcy5tYXA7XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gWydtYXAnXTtcclxuXHR0aGlzLnRhZ05hbWUgPSAnc2Jnbic7XHJcbn07XHJcblxyXG5ucy5TYmduLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuU2Jnbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5TYmduO1xyXG5cclxubnMuU2Jnbi5wcm90b3R5cGUuc2V0TWFwID0gZnVuY3Rpb24gKG1hcCkge1xyXG5cdHRoaXMubWFwID0gbWFwO1xyXG59O1xyXG5cclxubnMuU2Jnbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHNiZ24gPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzYmduJyk7XHJcblx0Ly8gYXR0cmlidXRlc1xyXG5cdGlmKHRoaXMueG1sbnMgIT0gbnVsbCkge1xyXG5cdFx0c2Jnbi5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgdGhpcy54bWxucyk7XHJcblx0fVxyXG5cdGlmKHRoaXMubGFuZ3VhZ2UgIT0gbnVsbCkge1xyXG5cdFx0c2Jnbi5zZXRBdHRyaWJ1dGUoJ2xhbmd1YWdlJywgdGhpcy5sYW5ndWFnZSk7XHJcblx0fVxyXG5cdC8vIGNoaWxkcmVuXHJcblx0dGhpcy5iYXNlVG9YbWxPYmooc2Jnbik7XHJcblx0aWYgKHRoaXMubWFwICE9IG51bGwpIHtcclxuXHRcdHNiZ24uYXBwZW5kQ2hpbGQodGhpcy5tYXAuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiBzYmduO1xyXG59O1xyXG5cclxubnMuU2Jnbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5TYmduLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdzYmduJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzYmduLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgc2JnbiA9IG5ldyBucy5TYmduKCk7XHJcblx0c2Jnbi54bWxucyA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3htbG5zJyk7XHJcblxyXG5cdC8vIGdldCBjaGlsZHJlblxyXG5cdHZhciBtYXBYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hcCcpWzBdO1xyXG5cdGlmIChtYXBYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIG1hcCA9IG5zLk1hcC5mcm9tWE1MKG1hcFhNTCk7XHJcblx0XHRzYmduLnNldE1hcChtYXApO1xyXG5cdH1cclxuXHRzYmduLmJhc2VGcm9tWE1MKHhtbE9iaik7IC8vIGNhbGwgdG8gcGFyZW50IGNsYXNzXHJcblx0cmV0dXJuIHNiZ247XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIFNCR04gLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBNQVAgLS0tLS0tLVxyXG5ucy5NYXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbGFuZ3VhZ2UnLCAnZ2x5cGhzJywgJ2FyY3MnXSk7XHJcblx0dGhpcy5pZCBcdFx0PSBwYXJhbXMuaWQ7XHJcblx0dGhpcy5sYW5ndWFnZSBcdD0gcGFyYW1zLmxhbmd1YWdlO1xyXG5cdHRoaXMuZ2x5cGhzIFx0PSBwYXJhbXMuZ2x5cGhzIHx8IFtdO1xyXG5cdHRoaXMuYXJjcyBcdFx0PSBwYXJhbXMuYXJjcyB8fCBbXTtcclxuXHJcblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbJ2dseXBocycsICdhcmNzJ107XHJcblx0dGhpcy50YWdOYW1lID0gJ21hcCc7XHJcbn07XHJcblxyXG5ucy5NYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5NYXAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuTWFwO1xyXG5cclxubnMuTWFwLnByb3RvdHlwZS5hZGRHbHlwaCA9IGZ1bmN0aW9uIChnbHlwaCkge1xyXG5cdHRoaXMuZ2x5cGhzLnB1c2goZ2x5cGgpO1xyXG59O1xyXG5cclxubnMuTWFwLnByb3RvdHlwZS5hZGRBcmMgPSBmdW5jdGlvbiAoYXJjKSB7XHJcblx0dGhpcy5hcmNzLnB1c2goYXJjKTtcclxufTtcclxuXHJcbm5zLk1hcC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIG1hcCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ21hcCcpO1xyXG5cdC8vIGF0dHJpYnV0ZXNcclxuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdG1hcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmKHRoaXMubGFuZ3VhZ2UgIT0gbnVsbCkge1xyXG5cdFx0bWFwLnNldEF0dHJpYnV0ZSgnbGFuZ3VhZ2UnLCB0aGlzLmxhbmd1YWdlKTtcclxuXHR9XHJcblx0Ly8gY2hpbGRyZW5cclxuXHR0aGlzLmJhc2VUb1htbE9iaihtYXApO1xyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdG1hcC5hcHBlbmRDaGlsZCh0aGlzLmdseXBoc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLmFyY3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdG1hcC5hcHBlbmRDaGlsZCh0aGlzLmFyY3NbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHJldHVybiBtYXA7XHJcbn07XHJcblxyXG5ucy5NYXAucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuTWFwLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdtYXAnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIG1hcCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIG1hcCA9IG5ldyBucy5NYXAoKTtcclxuXHRtYXAuaWQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdG1hcC5sYW5ndWFnZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2xhbmd1YWdlJyk7XHJcblxyXG5cdC8vIG5lZWQgdG8gYmUgY2FyZWZ1bCBoZXJlLCBhcyB0aGVyZSBjYW4gYmUgZ2x5cGggaW4gYXJjc1xyXG5cdHZhciBnbHlwaHNYTUwgPSB4bWxPYmoucXVlcnlTZWxlY3RvckFsbCgnbWFwID4gZ2x5cGgnKTtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBnbHlwaHNYTUwubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBnbHlwaCA9IG5zLkdseXBoLmZyb21YTUwoZ2x5cGhzWE1MW2ldKTtcclxuXHRcdG1hcC5hZGRHbHlwaChnbHlwaCk7XHJcblx0fVxyXG5cdHZhciBhcmNzWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhcmMnKTtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBhcmNzWE1MLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgYXJjID0gbnMuQXJjLmZyb21YTUwoYXJjc1hNTFtpXSk7XHJcblx0XHRtYXAuYWRkQXJjKGFyYyk7XHJcblx0fVxyXG5cclxuXHRtYXAuYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gbWFwO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBNQVAgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBFWFRFTlNJT05TIC0tLS0tLS1cclxubnMuRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIGNvbnNpZGVyIGZpcnN0IG9yZGVyIGNoaWxkcmVuLCBhZGQgdGhlbSB3aXRoIHRoZWlyIHRhZ25hbWUgYXMgcHJvcGVydHkgb2YgdGhpcyBvYmplY3RcclxuXHQvLyBzdG9yZSB4bWxPYmplY3QgaWYgbm8gc3VwcG9ydGVkIHBhcnNpbmcgKHVucmVjb2duaXplZCBleHRlbnNpb25zKVxyXG5cdC8vIGVsc2Ugc3RvcmUgaW5zdGFuY2Ugb2YgdGhlIGV4dGVuc2lvblxyXG5cdHRoaXMubGlzdCA9IHt9O1xyXG5cdHRoaXMudW5zdXBwb3J0ZWRMaXN0ID0ge307XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChleHRlbnNpb24pIHtcclxuXHRpZiAoZXh0ZW5zaW9uIGluc3RhbmNlb2YgcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uKSB7XHJcblx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSBleHRlbnNpb247XHJcblx0fVxyXG5cdGVsc2UgaWYgKGV4dGVuc2lvbi5ub2RlVHlwZSA9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0Ly8gY2FzZSB3aGVyZSByZW5kZXJJbmZvcm1hdGlvbiBpcyBwYXNzZWQgdW5wYXJzZWRcclxuXHRcdGlmIChleHRlbnNpb24udGFnTmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XHJcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dGVuc2lvbik7XHJcblx0XHRcdHRoaXMubGlzdFsncmVuZGVySW5mb3JtYXRpb24nXSA9IHJlbmRlckluZm9ybWF0aW9uO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51bnN1cHBvcnRlZExpc3RbZXh0ZW5zaW9uLnRhZ05hbWVdID0gZXh0ZW5zaW9uO1xyXG5cdH1cclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGV4dGVuc2lvbk5hbWUpIHtcclxuXHRyZXR1cm4gdGhpcy5saXN0Lmhhc093blByb3BlcnR5KGV4dGVuc2lvbk5hbWUpO1xyXG59O1xyXG5cclxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uTmFtZSkge1xyXG5cdGlmICh0aGlzLmhhcyhleHRlbnNpb25OYW1lKSkge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdFtleHRlbnNpb25OYW1lXTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBleHRlbnNpb24gPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdleHRlbnNpb24nKTtcclxuXHRmb3IgKHZhciBleHRJbnN0YW5jZSBpbiB0aGlzLmxpc3QpIHtcclxuXHRcdGlmIChleHRJbnN0YW5jZSA9PSBcInJlbmRlckluZm9ybWF0aW9uXCIpIHtcclxuXHRcdFx0ZXh0ZW5zaW9uLmFwcGVuZENoaWxkKHRoaXMuZ2V0KGV4dEluc3RhbmNlKS5idWlsZFhtbE9iaigpKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRleHRlbnNpb24uYXBwZW5kQ2hpbGQodGhpcy5nZXQoZXh0SW5zdGFuY2UpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGV4dGVuc2lvbjtcclxufTtcclxuXHJcbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5FeHRlbnNpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2V4dGVuc2lvbicpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZXh0ZW5zaW9uLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IG5zLkV4dGVuc2lvbigpO1xyXG5cdHZhciBjaGlsZHJlbiA9IHhtbE9iai5jaGlsZHJlbjtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGV4dFhtbE9iaiA9IGNoaWxkcmVuW2ldO1xyXG5cdFx0dmFyIGV4dE5hbWUgPSBleHRYbWxPYmoudGFnTmFtZTtcclxuXHRcdC8vZXh0ZW5zaW9uLmFkZChleHRJbnN0YW5jZSk7XHJcblx0XHRpZiAoZXh0TmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XHJcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dFhtbE9iaik7XHJcblx0XHRcdGV4dGVuc2lvbi5hZGQocmVuZGVySW5mb3JtYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZXh0TmFtZSA9PSAnYW5ub3RhdGlvbnMnKSB7XHJcblx0XHRcdGV4dGVuc2lvbi5hZGQoZXh0WG1sT2JqKTsgLy8gdG8gYmUgcGFyc2VkIGNvcnJlY3RseVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7IC8vIHVuc3VwcG9ydGVkIGV4dGVuc2lvbiwgd2Ugc3RpbGwgc3RvcmUgdGhlIGRhdGEgYXMgaXNcclxuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBFWFRFTlNJT05TIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gR0xZUEggLS0tLS0tLVxyXG5ucy5HbHlwaCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdjbGFzc18nLCAnY29tcGFydG1lbnRSZWYnLCAnbGFiZWwnLCAnYmJveCcsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnLCAnc3RhdGUnLCAnY2xvbmUnXSk7XHJcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLmNsYXNzXyBcdFx0PSBwYXJhbXMuY2xhc3NfO1xyXG5cdHRoaXMuY29tcGFydG1lbnRSZWYgPSBwYXJhbXMuY29tcGFydG1lbnRSZWY7XHJcblxyXG5cdC8vIGNoaWxkcmVuXHJcblx0dGhpcy5sYWJlbCBcdFx0XHQ9IHBhcmFtcy5sYWJlbDtcclxuXHR0aGlzLnN0YXRlIFx0XHRcdD0gcGFyYW1zLnN0YXRlO1xyXG5cdHRoaXMuYmJveCBcdFx0XHQ9IHBhcmFtcy5iYm94O1xyXG5cdHRoaXMuY2xvbmUgXHRcdFx0PSBwYXJhbXMuY2xvbmU7XHJcblx0dGhpcy5nbHlwaE1lbWJlcnMgXHQ9IHBhcmFtcy5nbHlwaE1lbWJlcnMgfHwgW107IC8vIGNhc2Ugb2YgY29tcGxleCwgY2FuIGhhdmUgYXJiaXRyYXJ5IGxpc3Qgb2YgbmVzdGVkIGdseXBoc1xyXG5cdHRoaXMucG9ydHMgXHRcdFx0PSBwYXJhbXMucG9ydHMgfHwgW107XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gWydsYWJlbCcsICdzdGF0ZScsICdiYm94JywgJ2Nsb25lJywgJ2dseXBoTWVtYmVycycsICdwb3J0cyddO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdnbHlwaCc7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLkdseXBoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkdseXBoO1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcblx0dGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG59O1xyXG5cclxubnMuR2x5cGgucHJvdG90eXBlLnNldEJib3ggPSBmdW5jdGlvbiAoYmJveCkge1xyXG5cdHRoaXMuYmJveCA9IGJib3g7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0Q2xvbmUgPSBmdW5jdGlvbiAoY2xvbmUpIHtcclxuXHR0aGlzLmNsb25lID0gY2xvbmU7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkR2x5cGhNZW1iZXIgPSBmdW5jdGlvbiAoZ2x5cGhNZW1iZXIpIHtcclxuXHR0aGlzLmdseXBoTWVtYmVycy5wdXNoKGdseXBoTWVtYmVyKTtcclxufTtcclxuXHJcbm5zLkdseXBoLnByb3RvdHlwZS5hZGRQb3J0ID0gZnVuY3Rpb24gKHBvcnQpIHtcclxuXHR0aGlzLnBvcnRzLnB1c2gocG9ydCk7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGdseXBoID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZ2x5cGgnKTtcclxuXHQvLyBhdHRyaWJ1dGVzXHJcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcblx0fVxyXG5cdGlmKHRoaXMuY2xhc3NfICE9IG51bGwpIHtcclxuXHRcdGdseXBoLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLmNsYXNzXyk7XHJcblx0fVxyXG5cdGlmKHRoaXMuY29tcGFydG1lbnRSZWYgIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguc2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicsIHRoaXMuY29tcGFydG1lbnRSZWYpO1xyXG5cdH1cclxuXHQvLyBjaGlsZHJlblxyXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5sYWJlbC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYodGhpcy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLnN0YXRlLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZih0aGlzLmJib3ggIT0gbnVsbCkge1xyXG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5iYm94LmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRpZih0aGlzLmNsb25lICE9IG51bGwpIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMuY2xvbmUuYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaE1lbWJlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMuZ2x5cGhNZW1iZXJzW2ldLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMucG9ydHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMucG9ydHNbaV0uYnVpbGRYbWxPYmooKSk7XHJcblx0fVxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKGdseXBoKTtcclxuXHRyZXR1cm4gZ2x5cGg7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5HbHlwaC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZ2x5cGgnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGdseXBoLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgZ2x5cGggPSBuZXcgbnMuR2x5cGgoKTtcclxuXHRnbHlwaC5pZCBcdFx0XHRcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRnbHlwaC5jbGFzc18gXHRcdFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG5cdGdseXBoLmNvbXBhcnRtZW50UmVmIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicpO1xyXG5cclxuXHR2YXIgbGFiZWxYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xhYmVsJylbMF07XHJcblx0aWYgKGxhYmVsWE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBsYWJlbCA9IG5zLkxhYmVsLmZyb21YTUwobGFiZWxYTUwpO1xyXG5cdFx0Z2x5cGguc2V0TGFiZWwobGFiZWwpO1xyXG5cdH1cclxuXHR2YXIgc3RhdGVYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0YXRlJylbMF07XHJcblx0aWYgKHN0YXRlWE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBzdGF0ZSA9IG5zLlN0YXRlVHlwZS5mcm9tWE1MKHN0YXRlWE1MKTtcclxuXHRcdGdseXBoLnNldFN0YXRlKHN0YXRlKTtcclxuXHR9XHJcblx0dmFyIGJib3hYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jib3gnKVswXTtcclxuXHRpZiAoYmJveFhNTCAhPSBudWxsKSB7XHJcblx0XHR2YXIgYmJveCA9IG5zLkJib3guZnJvbVhNTChiYm94WE1MKTtcclxuXHRcdGdseXBoLnNldEJib3goYmJveCk7XHJcblx0fVxyXG5cdHZhciBjbG9uZVhNbCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2xvbmUnKVswXTtcclxuXHRpZiAoY2xvbmVYTWwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIGNsb25lID0gbnMuQ2xvbmVUeXBlLmZyb21YTUwoY2xvbmVYTWwpO1xyXG5cdFx0Z2x5cGguc2V0Q2xvbmUoY2xvbmUpO1xyXG5cdH1cclxuXHQvLyBuZWVkIHNwZWNpYWwgY2FyZSBiZWNhdXNlIG9mIHJlY3Vyc2lvbiBvZiBuZXN0ZWQgZ2x5cGggbm9kZXNcclxuXHQvLyB0YWtlIG9ubHkgZmlyc3QgbGV2ZWwgZ2x5cGhzXHJcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkcmVuO1xyXG5cdGZvciAodmFyIGo9MDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7IC8vIGxvb3AgdGhyb3VnaCBhbGwgZmlyc3QgbGV2ZWwgY2hpbGRyZW5cclxuXHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2pdO1xyXG5cdFx0aWYgKGNoaWxkLnRhZ05hbWUgPT0gXCJnbHlwaFwiKSB7IC8vIGhlcmUgd2Ugb25seSB3YW50IHRoZSBnbHloIGNoaWxkcmVuXHJcblx0XHRcdHZhciBnbHlwaE1lbWJlciA9IG5zLkdseXBoLmZyb21YTUwoY2hpbGQpOyAvLyByZWN1cnNpdmUgY2FsbCBvbiBuZXN0ZWQgZ2x5cGhcclxuXHRcdFx0Z2x5cGguYWRkR2x5cGhNZW1iZXIoZ2x5cGhNZW1iZXIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgcG9ydHNYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BvcnQnKTtcclxuXHRmb3IgKHZhciBpPTA7IGkgPCBwb3J0c1hNTC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHBvcnQgPSBucy5Qb3J0LmZyb21YTUwocG9ydHNYTUxbaV0pO1xyXG5cdFx0Z2x5cGguYWRkUG9ydChwb3J0KTtcclxuXHR9XHJcblx0Z2x5cGguYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gZ2x5cGg7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIEdMWVBIIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gTEFCRUwgLS0tLS0tLVxyXG5ucy5MYWJlbCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd0ZXh0J10pO1xyXG5cdHRoaXMudGV4dCA9IHBhcmFtcy50ZXh0O1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdsYWJlbCc7XHJcbn07XHJcblxyXG5ucy5MYWJlbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLkxhYmVsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkxhYmVsO1xyXG5cclxubnMuTGFiZWwucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBsYWJlbCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcblx0aWYodGhpcy50ZXh0ICE9IG51bGwpIHtcclxuXHRcdGxhYmVsLnNldEF0dHJpYnV0ZSgndGV4dCcsIHRoaXMudGV4dCk7XHJcblx0fVxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKGxhYmVsKTtcclxuXHRyZXR1cm4gbGFiZWw7XHJcbn07XHJcblxyXG5ucy5MYWJlbC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5MYWJlbC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnbGFiZWwnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxhYmVsLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xyXG5cdH1cclxuXHR2YXIgbGFiZWwgPSBuZXcgbnMuTGFiZWwoKTtcclxuXHRsYWJlbC50ZXh0ID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndGV4dCcpO1xyXG5cdGxhYmVsLmJhc2VGcm9tWE1MKHhtbE9iaik7XHJcblx0cmV0dXJuIGxhYmVsO1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBMQUJFTCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIEJCT1ggLS0tLS0tLVxyXG5ucy5CYm94ID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneScsICd3JywgJ2gnXSk7XHJcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XHJcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XHJcblx0dGhpcy53ID0gcGFyc2VGbG9hdChwYXJhbXMudyk7XHJcblx0dGhpcy5oID0gcGFyc2VGbG9hdChwYXJhbXMuaCk7XHJcblxyXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XHJcblx0dGhpcy50YWdOYW1lID0gJ2Jib3gnO1xyXG59O1xyXG5cclxubnMuQmJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XHJcbm5zLkJib3gucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQmJveDtcclxuXHJcbm5zLkJib3gucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBiYm94ID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnYmJveCcpO1xyXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XHJcblx0XHRiYm94LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XHJcblx0XHRiYm94LnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLncpKSB7XHJcblx0XHRiYm94LnNldEF0dHJpYnV0ZSgndycsIHRoaXMudyk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLmgpKSB7XHJcblx0XHRiYm94LnNldEF0dHJpYnV0ZSgnaCcsIHRoaXMuaCk7XHJcblx0fVxyXG5cdHRoaXMuYmFzZVRvWG1sT2JqKGJib3gpO1xyXG5cdHJldHVybiBiYm94O1xyXG59XHJcblxyXG5ucy5CYm94LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcclxufTtcclxuXHJcbm5zLkJib3guZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2Jib3gnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGJib3gsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBiYm94ID0gbmV3IG5zLkJib3goKTtcclxuXHRiYm94LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XHJcblx0YmJveC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xyXG5cdGJib3gudyA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgndycpKTtcclxuXHRiYm94LmggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2gnKSk7XHJcblx0YmJveC5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBiYm94O1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBCQk9YIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gU1RBVEUgLS0tLS0tLVxyXG5ucy5TdGF0ZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd2YWx1ZScsICd2YXJpYWJsZSddKTtcclxuXHR0aGlzLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xyXG5cdHRoaXMudmFyaWFibGUgPSBwYXJhbXMudmFyaWFibGU7XHJcbn07XHJcblxyXG5ucy5TdGF0ZVR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzdGF0ZSA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3N0YXRlJyk7XHJcblx0aWYodGhpcy52YWx1ZSAhPSBudWxsKSB7XHJcblx0XHRzdGF0ZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XHJcblx0fVxyXG5cdGlmKHRoaXMudmFyaWFibGUgIT0gbnVsbCkge1xyXG5cdFx0c3RhdGUuc2V0QXR0cmlidXRlKCd2YXJpYWJsZScsIHRoaXMudmFyaWFibGUpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3RhdGU7XHJcbn07XHJcblxyXG5ucy5TdGF0ZVR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuU3RhdGVUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdzdGF0ZScpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3RhdGUsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBzdGF0ZSA9IG5ldyBucy5TdGF0ZVR5cGUoKTtcclxuXHRzdGF0ZS52YWx1ZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XHJcblx0c3RhdGUudmFyaWFibGUgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd2YXJpYWJsZScpO1xyXG5cdHJldHVybiBzdGF0ZTtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgU1RBVEUgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBDTE9ORSAtLS0tLS0tXHJcbm5zLkNsb25lVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ2xhYmVsJ10pO1xyXG5cdHRoaXMubGFiZWwgPSBwYXJhbXMubGFiZWw7XHJcbn07XHJcblxyXG5ucy5DbG9uZVR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBjbG9uZSA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2Nsb25lJyk7XHJcblx0aWYodGhpcy5sYWJlbCAhPSBudWxsKSB7XHJcblx0XHRjbG9uZS5zZXRBdHRyaWJ1dGUoJ2xhYmVsJywgdGhpcy5sYWJlbCk7XHJcblx0fVxyXG5cdHJldHVybiBjbG9uZTtcclxufTtcclxuXHJcbm5zLkNsb25lVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XHJcbn07XHJcblxyXG5ucy5DbG9uZVR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2Nsb25lJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBjbG9uZSwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGNsb25lID0gbmV3IG5zLkNsb25lVHlwZSgpO1xyXG5cdGNsb25lLmxhYmVsID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnbGFiZWwnKTtcclxuXHRyZXR1cm4gY2xvbmU7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIENMT05FIC0tLS0tLS1cclxuXHJcbi8vIC0tLS0tLS0gUE9SVCAtLS0tLS0tXHJcbm5zLlBvcnQgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAneCcsICd5J10pO1xyXG5cdHRoaXMuaWQgPSBwYXJhbXMuaWQ7XHJcblx0dGhpcy54IFx0PSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcclxuXHR0aGlzLnkgXHQ9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdwb3J0JztcclxufTtcclxuXHJcbm5zLlBvcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xyXG5ucy5Qb3J0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLlBvcnQ7XHJcblxyXG5ucy5Qb3J0LnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgcG9ydCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3BvcnQnKTtcclxuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcclxuXHRcdHBvcnQuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy54KSkge1xyXG5cdFx0cG9ydC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xyXG5cdH1cclxuXHRpZighaXNOYU4odGhpcy55KSkge1xyXG5cdFx0cG9ydC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xyXG5cdH1cclxuXHR0aGlzLmJhc2VUb1htbE9iaihwb3J0KTtcclxuXHRyZXR1cm4gcG9ydDtcclxufTtcclxuXHJcbm5zLlBvcnQucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuUG9ydC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAncG9ydCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgcG9ydCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIHBvcnQgPSBuZXcgbnMuUG9ydCgpO1xyXG5cdHBvcnQueCBcdD0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xyXG5cdHBvcnQueSBcdD0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xyXG5cdHBvcnQuaWQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdHBvcnQuYmFzZUZyb21YTUwoeG1sT2JqKTtcclxuXHRyZXR1cm4gcG9ydDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgUE9SVCAtLS0tLS0tXHJcblxyXG4vLyAtLS0tLS0tIEFSQyAtLS0tLS0tXHJcbm5zLkFyYyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdjbGFzc18nLCAnc291cmNlJywgJ3RhcmdldCcsICdzdGFydCcsICdlbmQnLCAnbmV4dHMnLCAnZ2x5cGhzJ10pO1xyXG5cdHRoaXMuaWQgXHQ9IHBhcmFtcy5pZDtcclxuXHR0aGlzLmNsYXNzXyA9IHBhcmFtcy5jbGFzc187XHJcblx0dGhpcy5zb3VyY2UgPSBwYXJhbXMuc291cmNlO1xyXG5cdHRoaXMudGFyZ2V0ID0gcGFyYW1zLnRhcmdldDtcclxuXHJcblx0dGhpcy5zdGFydCBcdD0gcGFyYW1zLnN0YXJ0O1xyXG5cdHRoaXMuZW5kIFx0PSBwYXJhbXMuZW5kO1xyXG5cdHRoaXMubmV4dHMgXHQ9IHBhcmFtcy5uZXh0cyB8fCBbXTtcclxuXHR0aGlzLmdseXBocyA9IHBhcmFtcy5nbHlwaHMgfHzCoFtdO1xyXG5cclxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnc3RhcnQnLCAnbmV4dHMnLCAnZW5kJywgJ2dseXBocyddO1xyXG5cdHRoaXMudGFnTmFtZSA9ICdhcmMnO1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcclxubnMuQXJjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkFyYztcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUuc2V0U3RhcnQgPSBmdW5jdGlvbiAoc3RhcnQpIHtcclxuXHR0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLnNldEVuZCA9IGZ1bmN0aW9uIChlbmQpIHtcclxuXHR0aGlzLmVuZCA9IGVuZDtcclxufTtcclxuXHJcbm5zLkFyYy5wcm90b3R5cGUuYWRkTmV4dCA9IGZ1bmN0aW9uIChuZXh0KSB7XHJcblx0dGhpcy5uZXh0cy5wdXNoKG5leHQpO1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS5hZGRHbHlwaCA9IGZ1bmN0aW9uIChnbHlwaCkge1xyXG5cdHRoaXMuZ2x5cGhzLnB1c2goZ2x5cGgpO1xyXG59O1xyXG5cclxubnMuQXJjLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgYXJjID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnYXJjJyk7XHJcblx0Ly8gYXR0cmlidXRlc1xyXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xyXG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuXHR9XHJcblx0aWYodGhpcy5jbGFzc18gIT0gbnVsbCkge1xyXG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLmNsYXNzXyk7XHJcblx0fVxyXG5cdGlmKHRoaXMuc291cmNlICE9IG51bGwpIHtcclxuXHRcdGFyYy5zZXRBdHRyaWJ1dGUoJ3NvdXJjZScsIHRoaXMuc291cmNlKTtcclxuXHR9XHJcblx0aWYodGhpcy50YXJnZXQgIT0gbnVsbCkge1xyXG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgdGhpcy50YXJnZXQpO1xyXG5cdH1cclxuXHQvLyBjaGlsZHJlblxyXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGFyYy5hcHBlbmRDaGlsZCh0aGlzLmdseXBoc1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYodGhpcy5zdGFydCAhPSBudWxsKSB7XHJcblx0XHRhcmMuYXBwZW5kQ2hpbGQodGhpcy5zdGFydC5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLm5leHRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRhcmMuYXBwZW5kQ2hpbGQodGhpcy5uZXh0c1tpXS5idWlsZFhtbE9iaigpKTtcclxuXHR9XHJcblx0aWYodGhpcy5lbmQgIT0gbnVsbCkge1xyXG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMuZW5kLmJ1aWxkWG1sT2JqKCkpO1xyXG5cdH1cclxuXHR0aGlzLmJhc2VUb1htbE9iaihhcmMpO1xyXG5cdHJldHVybiBhcmM7XHJcbn07XHJcblxyXG5ucy5BcmMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuQXJjLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdhcmMnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGFyYywgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcclxuXHR9XHJcblx0dmFyIGFyYyA9IG5ldyBucy5BcmMoKTtcclxuXHRhcmMuaWQgXHRcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRhcmMuY2xhc3NfIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG5cdGFyYy5zb3VyY2UgXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xyXG5cdGFyYy50YXJnZXQgXHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpO1xyXG5cclxuXHR2YXIgc3RhcnRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0YXJ0JylbMF07XHJcblx0aWYgKHN0YXJ0WE1MICE9IG51bGwpIHtcclxuXHRcdHZhciBzdGFydCA9IG5zLlN0YXJ0VHlwZS5mcm9tWE1MKHN0YXJ0WE1MKTtcclxuXHRcdGFyYy5zZXRTdGFydChzdGFydCk7XHJcblx0fVxyXG5cdHZhciBuZXh0WE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0Jyk7XHJcblx0Zm9yICh2YXIgaT0wOyBpIDwgbmV4dFhNTC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIG5leHQgPSBucy5OZXh0VHlwZS5mcm9tWE1MKG5leHRYTUxbaV0pO1xyXG5cdFx0YXJjLmFkZE5leHQobmV4dCk7XHJcblx0fVxyXG5cdHZhciBlbmRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2VuZCcpWzBdO1xyXG5cdGlmIChlbmRYTUwgIT0gbnVsbCkge1xyXG5cdFx0dmFyIGVuZCA9IG5zLkVuZFR5cGUuZnJvbVhNTChlbmRYTUwpO1xyXG5cdFx0YXJjLnNldEVuZChlbmQpO1xyXG5cdH1cclxuXHR2YXIgZ2x5cGhzWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdnbHlwaCcpO1xyXG5cdGZvciAodmFyIGk9MDsgaSA8IGdseXBoc1hNTC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGdseXBoID0gbnMuR2x5cGguZnJvbVhNTChnbHlwaHNYTUxbaV0pO1xyXG5cdFx0YXJjLmFkZEdseXBoKGdseXBoKTtcclxuXHR9XHJcblxyXG5cdGFyYy5iYXNlRnJvbVhNTCh4bWxPYmopO1xyXG5cdHJldHVybiBhcmM7XHJcbn07XHJcblxyXG4vLyAtLS0tLS0tIEVORCBBUkMgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBTVEFSVFRZUEUgLS0tLS0tLVxyXG5ucy5TdGFydFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XHJcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XHJcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XHJcbn07XHJcblxyXG5ucy5TdGFydFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzdGFydCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3N0YXJ0Jyk7XHJcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcclxuXHRcdHN0YXJ0LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XHJcblx0XHRzdGFydC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3RhcnQ7XHJcbn07XHJcblxyXG5ucy5TdGFydFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuU3RhcnRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XHJcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdzdGFydCcpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3RhcnQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBzdGFydCA9IG5ldyBucy5TdGFydFR5cGUoKTtcclxuXHRzdGFydC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xyXG5cdHN0YXJ0LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XHJcblx0cmV0dXJuIHN0YXJ0O1xyXG59O1xyXG4vLyAtLS0tLS0tIEVORCBTVEFSVFRZUEUgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBFTkRUWVBFIC0tLS0tLS1cclxubnMuRW5kVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcclxuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcclxuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcclxufTtcclxuXHJcbm5zLkVuZFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBlbmQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdlbmQnKTtcclxuXHRpZighaXNOYU4odGhpcy54KSkge1xyXG5cdFx0ZW5kLnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XHJcblx0XHRlbmQuc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcclxuXHR9XHJcblx0cmV0dXJuIGVuZDtcclxufTtcclxuXHJcbm5zLkVuZFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuRW5kVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xyXG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZW5kJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBlbmQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBlbmQgPSBuZXcgbnMuRW5kVHlwZSgpO1xyXG5cdGVuZC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xyXG5cdGVuZC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xyXG5cdHJldHVybiBlbmQ7XHJcbn07XHJcbi8vIC0tLS0tLS0gRU5EIEVORFRZUEUgLS0tLS0tLVxyXG5cclxuLy8gLS0tLS0tLSBORVhUVFlQRSAtLS0tLS0tXHJcbm5zLk5leHRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xyXG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xyXG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xyXG59O1xyXG5cclxubnMuTmV4dFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBuZXh0ID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbmV4dCcpO1xyXG5cdGlmKCFpc05hTih0aGlzLngpKSB7XHJcblx0XHRuZXh0LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XHJcblx0fVxyXG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XHJcblx0XHRuZXh0LnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XHJcblx0fVxyXG5cdHJldHVybiBuZXh0O1xyXG59O1xyXG5cclxubnMuTmV4dFR5cGUucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xyXG59O1xyXG5cclxubnMuTmV4dFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcclxuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ25leHQnKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIG5leHQsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XHJcblx0fVxyXG5cdHZhciBuZXh0ID0gbmV3IG5zLk5leHRUeXBlKCk7XHJcblx0bmV4dC54ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xyXG5cdG5leHQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcclxuXHRyZXR1cm4gbmV4dDtcclxufTtcclxuLy8gLS0tLS0tLSBFTkQgTkVYVFRZUEUgLS0tLS0tLVxyXG5cclxubnMucmVuZGVyRXh0ZW5zaW9uID0gcmVuZGVyRXh0O1xyXG4vL25zLmFubm90YXRpb25zRXh0ZW5zaW9uID0gYW5ub3RFeHQ7XHJcbm1vZHVsZS5leHBvcnRzID0gbnM7IiwidmFyIG5zID0ge307XHJcblxyXG4vKlxyXG5cdGd1YXJhbnRlZXMgdG8gcmV0dXJuIGFuIG9iamVjdCB3aXRoIGdpdmVuIGFyZ3MgYmVpbmcgc2V0IHRvIG51bGwgaWYgbm90IHByZXNlbnQsIG90aGVyIGFyZ3MgcmV0dXJuZWQgYXMgaXNcclxuKi9cclxubnMuY2hlY2tQYXJhbXMgPSBmdW5jdGlvbiAocGFyYW1zLCBuYW1lcykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09IFwidW5kZWZpbmVkXCIgfHwgcGFyYW1zID09IG51bGwpIHtcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIHBhcmFtcyAhPSAnb2JqZWN0Jykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIHBhcmFtcy4gT2JqZWN0IHdpdGggbmFtZWQgcGFyYW1ldGVycyBtdXN0IGJlIHBhc3NlZC5cIik7XHJcblx0fVxyXG5cdGZvcih2YXIgaT0wOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBhcmdOYW1lID0gbmFtZXNbaV07XHJcblx0XHRpZiAodHlwZW9mIHBhcmFtc1thcmdOYW1lXSA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRwYXJhbXNbYXJnTmFtZV0gPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gcGFyYW1zO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsIi8qKlxuKiBwcmV0dHktZGF0YSAtIG5vZGVqcyBwbHVnaW4gdG8gcHJldHR5LXByaW50IG9yIG1pbmlmeSBkYXRhIGluIFhNTCwgSlNPTiBhbmQgQ1NTIGZvcm1hdHMuXG4qICBcbiogVmVyc2lvbiAtIDAuNDAuMFxuKiBDb3B5cmlnaHQgKGMpIDIwMTIgVmFkaW0gS2lyeXVraGluXG4qIHZraXJ5dWtoaW4gQCBnbWFpbC5jb21cbiogaHR0cDovL3d3dy5lc2xpbnN0cnVjdG9yLm5ldC9wcmV0dHktZGF0YS9cbiogXG4qIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzOlxuKiAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qICAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC5odG1sXG4qXG4qXHRwZC54bWwoZGF0YSApIC0gcHJldHR5IHByaW50IFhNTDtcbipcdHBkLmpzb24oZGF0YSkgLSBwcmV0dHkgcHJpbnQgSlNPTjtcbipcdHBkLmNzcyhkYXRhICkgLSBwcmV0dHkgcHJpbnQgQ1NTO1xuKlx0cGQuc3FsKGRhdGEpICAtIHByZXR0eSBwcmludCBTUUw7XG4qXG4qXHRwZC54bWxtaW4oZGF0YSBbLCBwcmVzZXJ2ZUNvbW1lbnRzXSApIC0gbWluaWZ5IFhNTDsgXG4qXHRwZC5qc29ubWluKGRhdGEpICAgICAgICAgICAgICAgICAgICAgIC0gbWluaWZ5IEpTT047IFxuKlx0cGQuY3NzbWluKGRhdGEgWywgcHJlc2VydmVDb21tZW50c10gKSAtIG1pbmlmeSBDU1M7IFxuKlx0cGQuc3FsbWluKGRhdGEpICAgICAgICAgICAgICAgICAgICAgICAtIG1pbmlmeSBTUUw7IFxuKlxuKiBQQVJBTUVURVJTOlxuKlxuKlx0QGRhdGEgIFx0XHRcdC0gU3RyaW5nOyBYTUwsIEpTT04sIENTUyBvciBTUUwgdGV4dCB0byBiZWF1dGlmeTtcbiogXHRAcHJlc2VydmVDb21tZW50c1x0LSBCb29sIChvcHRpb25hbCwgdXNlZCBpbiBtaW54bWwgYW5kIG1pbmNzcyBvbmx5KTsgXG4qXHRcdFx0XHQgIFNldCB0aGlzIGZsYWcgdG8gdHJ1ZSB0byBwcmV2ZW50IHJlbW92aW5nIGNvbW1lbnRzIGZyb20gQHRleHQ7IFxuKlx0QFJldHVybiBcdFx0LSBTdHJpbmc7XG4qXHRcbiogVVNBR0U6XG4qXHRcbipcdHZhciBwZCAgPSByZXF1aXJlKCdwcmV0dHktZGF0YScpLnBkO1xuKlxuKlx0dmFyIHhtbF9wcCAgID0gcGQueG1sKHhtbF90ZXh0KTtcbipcdHZhciB4bWxfbWluICA9IHBkLnhtbG1pbih4bWxfdGV4dCBbLHRydWVdKTtcbipcdHZhciBqc29uX3BwICA9IHBkLmpzb24oanNvbl90ZXh0KTtcbipcdHZhciBqc29uX21pbiA9IHBkLmpzb25taW4oanNvbl90ZXh0KTtcbipcdHZhciBjc3NfcHAgICA9IHBkLmNzcyhjc3NfdGV4dCk7XG4qXHR2YXIgY3NzX21pbiAgPSBwZC5jc3NtaW4oY3NzX3RleHQgWywgdHJ1ZV0pO1xuKlx0dmFyIHNxbF9wcCAgID0gcGQuc3FsKHNxbF90ZXh0KTtcbipcdHZhciBzcWxfbWluICA9IHBkLnNxbG1pbihzcWxfdGV4dCk7XG4qXG4qIFRFU1Q6XG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3RfeG1sXG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3RfanNvblxuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X2Nzc1xuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X3NxbFxuKi9cblxuXG5mdW5jdGlvbiBwcCgpIHtcblx0dGhpcy5zaGlmdCA9IFsnXFxuJ107IC8vIGFycmF5IG9mIHNoaWZ0c1xuXHR0aGlzLnN0ZXAgPSAnICAnLCAvLyAyIHNwYWNlc1xuXHRcdG1heGRlZXAgPSAxMDAsIC8vIG5lc3RpbmcgbGV2ZWxcblx0XHRpeCA9IDA7XG5cblx0Ly8gaW5pdGlhbGl6ZSBhcnJheSB3aXRoIHNoaWZ0cyAvL1xuXHRmb3IoaXg9MDtpeDxtYXhkZWVwO2l4Kyspe1xuXHRcdHRoaXMuc2hpZnQucHVzaCh0aGlzLnNoaWZ0W2l4XSt0aGlzLnN0ZXApOyBcblx0fVxuXG59O1x0XG5cdFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gWE1MIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUueG1sID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdHZhciBhciA9IHRleHQucmVwbGFjZSgvPlxcc3swLH08L2csXCI+PFwiKVxuXHRcdFx0XHQgLnJlcGxhY2UoLzwvZyxcIn46On48XCIpXG5cdFx0XHRcdCAucmVwbGFjZSgveG1sbnNcXDovZyxcIn46On54bWxuczpcIilcblx0XHRcdFx0IC5yZXBsYWNlKC94bWxuc1xcPS9nLFwifjo6fnhtbG5zPVwiKVxuXHRcdFx0XHQgLnNwbGl0KCd+Ojp+JyksXG5cdFx0bGVuID0gYXIubGVuZ3RoLFxuXHRcdGluQ29tbWVudCA9IGZhbHNlLFxuXHRcdGRlZXAgPSAwLFxuXHRcdHN0ciA9ICcnLFxuXHRcdGl4ID0gMDtcblxuXHRcdGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cdFx0XHQvLyBzdGFydCBjb21tZW50IG9yIDwhW0NEQVRBWy4uLl1dPiBvciA8IURPQ1RZUEUgLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzwhLykgPiAtMSkgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0XHRpbkNvbW1lbnQgPSB0cnVlOyBcblx0XHRcdFx0Ly8gZW5kIGNvbW1lbnQgIG9yIDwhW0NEQVRBWy4uLl1dPiAvL1xuXHRcdFx0XHRpZihhcltpeF0uc2VhcmNoKC8tLT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goL1xcXT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goLyFET0NUWVBFLykgPiAtMSApIHsgXG5cdFx0XHRcdFx0aW5Db21tZW50ID0gZmFsc2U7IFxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyBlbmQgY29tbWVudCAgb3IgPCFbQ0RBVEFbLi4uXV0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC8tLT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goL1xcXT4vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gYXJbaXhdO1xuXHRcdFx0XHRpbkNvbW1lbnQgPSBmYWxzZTsgXG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyA8ZWxtPjwvZWxtPiAvL1xuXHRcdFx0aWYoIC9ePFxcdy8uZXhlYyhhcltpeC0xXSkgJiYgL148XFwvXFx3Ly5leGVjKGFyW2l4XSkgJiZcblx0XHRcdFx0L148W1xcdzpcXC1cXC5cXCxdKy8uZXhlYyhhcltpeC0xXSkgPT0gL148XFwvW1xcdzpcXC1cXC5cXCxdKy8uZXhlYyhhcltpeF0pWzBdLnJlcGxhY2UoJy8nLCcnKSkgeyBcblx0XHRcdFx0c3RyICs9IGFyW2l4XTtcblx0XHRcdFx0aWYoIWluQ29tbWVudCkgZGVlcC0tO1xuXHRcdFx0fSBlbHNlXG5cdFx0XHQgLy8gPGVsbT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXHcvKSA+IC0xICYmIGFyW2l4XS5zZWFyY2goLzxcXC8vKSA9PSAtMSAmJiBhcltpeF0uc2VhcmNoKC9cXC8+LykgPT0gLTEgKSB7XG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwKytdK2FyW2l4XSA6IHN0ciArPSBhcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQgLy8gPGVsbT4uLi48L2VsbT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXHcvKSA+IC0xICYmIGFyW2l4XS5zZWFyY2goLzxcXC8vKSA+IC0xKSB7XG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF0gOiBzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gPC9lbG0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88XFwvLykgPiAtMSkgeyBcblx0XHRcdFx0c3RyID0gIWluQ29tbWVudCA/IHN0ciArPSB0aGlzLnNoaWZ0Wy0tZGVlcF0rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDxlbG0vPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvXFwvPi8pID4gLTEgKSB7IFxuXHRcdFx0XHRzdHIgPSAhaW5Db21tZW50ID8gc3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDw/IHhtbCAuLi4gPz4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXD8vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyB4bWxucyAvL1xuXHRcdFx0aWYoIGFyW2l4XS5zZWFyY2goL3htbG5zXFw6LykgPiAtMSAgfHwgYXJbaXhdLnNlYXJjaCgveG1sbnNcXD0vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9IFxuXHRcdFx0XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c3RyICs9IGFyW2l4XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdHJldHVybiAgKHN0clswXSA9PSAnXFxuJykgPyBzdHIuc2xpY2UoMSkgOiBzdHI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEpTT04gc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBwLnByb3RvdHlwZS5qc29uID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdGlmICggdHlwZW9mIHRleHQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodGV4dCksIG51bGwsIHRoaXMuc3RlcCk7XG5cdH1cblx0aWYgKCB0eXBlb2YgdGV4dCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGV4dCwgbnVsbCwgdGhpcy5zdGVwKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ1NTIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdHZhciBhciA9IHRleHQucmVwbGFjZSgvXFxzezEsfS9nLCcgJylcblx0XHRcdFx0LnJlcGxhY2UoL1xcey9nLFwie346On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL1xcfS9nLFwifjo6fn1+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXDsvZyxcIjt+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXC9cXCovZyxcIn46On4vKlwiKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwqXFwvL2csXCIqL346On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL346On5cXHN7MCx9fjo6fi9nLFwifjo6flwiKVxuXHRcdFx0XHQuc3BsaXQoJ346On4nKSxcblx0XHRsZW4gPSBhci5sZW5ndGgsXG5cdFx0ZGVlcCA9IDAsXG5cdFx0c3RyID0gJycsXG5cdFx0aXggPSAwO1xuXHRcdFxuXHRcdGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cblx0XHRcdGlmKCAvXFx7Ly5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwKytdK2FyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdGlmKCAvXFx9Ly5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFstLWRlZXBdK2FyW2l4XTtcblx0XHRcdH0gZWxzZVxuXHRcdFx0aWYoIC9cXCpcXFxcLy5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL15cXG57MSx9LywnJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNRTCBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaXNTdWJxdWVyeShzdHIsIHBhcmVudGhlc2lzTGV2ZWwpIHtcbiAgcmV0dXJuICBwYXJlbnRoZXNpc0xldmVsIC0gKHN0ci5yZXBsYWNlKC9cXCgvZywnJykubGVuZ3RoIC0gc3RyLnJlcGxhY2UoL1xcKS9nLCcnKS5sZW5ndGggKVxufVxuXG5mdW5jdGlvbiBzcGxpdF9zcWwoc3RyLCB0YWIpIHtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzezEsfS9nLFwiIFwiKVxuXG4gICAgICAgIC5yZXBsYWNlKC8gQU5EIC9pZyxcIn46On5cIit0YWIrdGFiK1wiQU5EIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEJFVFdFRU4gL2lnLFwifjo6flwiK3RhYitcIkJFVFdFRU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQ0FTRSAvaWcsXCJ+Ojp+XCIrdGFiK1wiQ0FTRSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBFTFNFIC9pZyxcIn46On5cIit0YWIrXCJFTFNFIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEVORCAvaWcsXCJ+Ojp+XCIrdGFiK1wiRU5EIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEZST00gL2lnLFwifjo6fkZST00gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gR1JPVVBcXHN7MSx9QlkvaWcsXCJ+Ojp+R1JPVVAgQlkgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSEFWSU5HIC9pZyxcIn46On5IQVZJTkcgXCIpXG4gICAgICAgIC8vLnJlcGxhY2UoLyBJTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSU4gL2lnLFwiIElOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEpPSU4gL2lnLFwifjo6fkpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQ1JPU1N+Ojp+ezEsfUpPSU4gL2lnLFwifjo6fkNST1NTIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSU5ORVJ+Ojp+ezEsfUpPSU4gL2lnLFwifjo6fklOTkVSIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTEVGVH46On57MSx9Sk9JTiAvaWcsXCJ+Ojp+TEVGVCBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFJJR0hUfjo6fnsxLH1KT0lOIC9pZyxcIn46On5SSUdIVCBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9OIC9pZyxcIn46On5cIit0YWIrXCJPTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBPUiAvaWcsXCJ+Ojp+XCIrdGFiK3RhYitcIk9SIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9SREVSXFxzezEsfUJZL2lnLFwifjo6fk9SREVSIEJZIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9WRVIgL2lnLFwifjo6flwiK3RhYitcIk9WRVIgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXChcXHN7MCx9U0VMRUNUIC9pZyxcIn46On4oU0VMRUNUIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFwpXFxzezAsfVNFTEVDVCAvaWcsXCIpfjo6flNFTEVDVCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBUSEVOIC9pZyxcIiBUSEVOfjo6flwiK3RhYitcIlwiKVxuICAgICAgICAucmVwbGFjZSgvIFVOSU9OIC9pZyxcIn46On5VTklPTn46On5cIilcbiAgICAgICAgLnJlcGxhY2UoLyBVU0lORyAvaWcsXCJ+Ojp+VVNJTkcgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gV0hFTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiV0hFTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBXSEVSRSAvaWcsXCJ+Ojp+V0hFUkUgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gV0lUSCAvaWcsXCJ+Ojp+V0lUSCBcIilcbiAgICAgICAgLy8ucmVwbGFjZSgvXFwsXFxzezAsfVxcKC9pZyxcIix+Ojp+KCBcIilcbiAgICAgICAgLy8ucmVwbGFjZSgvXFwsL2lnLFwiLH46On5cIit0YWIrdGFiK1wiXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQUxMIC9pZyxcIiBBTEwgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQVMgL2lnLFwiIEFTIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEFTQyAvaWcsXCIgQVNDIFwiKSBcbiAgICAgICAgLnJlcGxhY2UoLyBERVNDIC9pZyxcIiBERVNDIFwiKSBcbiAgICAgICAgLnJlcGxhY2UoLyBESVNUSU5DVCAvaWcsXCIgRElTVElOQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gRVhJU1RTIC9pZyxcIiBFWElTVFMgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTk9UIC9pZyxcIiBOT1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTlVMTCAvaWcsXCIgTlVMTCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBMSUtFIC9pZyxcIiBMSUtFIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFxzezAsfVNFTEVDVCAvaWcsXCJTRUxFQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9+Ojp+ezEsfS9nLFwifjo6flwiKVxuICAgICAgICAuc3BsaXQoJ346On4nKTtcbn1cblxucHAucHJvdG90eXBlLnNxbCA9IGZ1bmN0aW9uKHRleHQpIHtcblxuICAgIHZhciBhcl9ieV9xdW90ZSA9IHRleHQucmVwbGFjZSgvXFxzezEsfS9nLFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcJy9pZyxcIn46On5cXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnfjo6ficpLFxuICAgICAgICBsZW4gPSBhcl9ieV9xdW90ZS5sZW5ndGgsXG4gICAgICAgIGFyID0gW10sXG4gICAgICAgIGRlZXAgPSAwLFxuICAgICAgICB0YWIgPSB0aGlzLnN0ZXAsLy8rdGhpcy5zdGVwLFxuICAgICAgICBpbkNvbW1lbnQgPSB0cnVlLFxuICAgICAgICBpblF1b3RlID0gZmFsc2UsXG4gICAgICAgIHBhcmVudGhlc2lzTGV2ZWwgPSAwLFxuICAgICAgICBzdHIgPSAnJyxcbiAgICAgICAgaXggPSAwO1xuXG4gICAgZm9yKGl4PTA7aXg8bGVuO2l4KyspIHtcblxuICAgICAgICBpZihpeCUyKSB7XG4gICAgICAgICAgICBhciA9IGFyLmNvbmNhdChhcl9ieV9xdW90ZVtpeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXIgPSBhci5jb25jYXQoc3BsaXRfc3FsKGFyX2J5X3F1b3RlW2l4XSwgdGFiKSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gYXIubGVuZ3RoO1xuICAgIGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cbiAgICAgICAgcGFyZW50aGVzaXNMZXZlbCA9IGlzU3VicXVlcnkoYXJbaXhdLCBwYXJlbnRoZXNpc0xldmVsKTtcblxuICAgICAgICBpZiggL1xcc3swLH1cXHN7MCx9U0VMRUNUXFxzezAsfS8uZXhlYyhhcltpeF0pKSAgeyBcbiAgICAgICAgICAgIGFyW2l4XSA9IGFyW2l4XS5yZXBsYWNlKC9cXCwvZyxcIixcXG5cIit0YWIrdGFiK1wiXCIpXG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYoIC9cXHN7MCx9XFwoXFxzezAsfVNFTEVDVFxcc3swLH0vLmV4ZWMoYXJbaXhdKSkgIHsgXG4gICAgICAgICAgICBkZWVwKys7XG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG4gICAgICAgIH0gZWxzZSBcbiAgICAgICAgaWYoIC9cXCcvLmV4ZWMoYXJbaXhdKSApICB7IFxuICAgICAgICAgICAgaWYocGFyZW50aGVzaXNMZXZlbDwxICYmIGRlZXApIHtcbiAgICAgICAgICAgICAgICBkZWVwLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHIgKz0gYXJbaXhdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgIHsgXG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG4gICAgICAgICAgICBpZihwYXJlbnRoZXNpc0xldmVsPDEgJiYgZGVlcCkge1xuICAgICAgICAgICAgICAgIGRlZXAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcbnsxLH0vLCcnKS5yZXBsYWNlKC9cXG57MSx9L2csXCJcXG5cIik7XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWluIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUueG1sbWluID0gZnVuY3Rpb24odGV4dCwgcHJlc2VydmVDb21tZW50cykge1xuXG5cdHZhciBzdHIgPSBwcmVzZXJ2ZUNvbW1lbnRzID8gdGV4dFxuXHRcdFx0XHQgICA6IHRleHQucmVwbGFjZSgvXFw8IVsgXFxyXFxuXFx0XSooLS0oW15cXC1dfFtcXHJcXG5dfC1bXlxcLV0pKi0tWyBcXHJcXG5cXHRdKilcXD4vZyxcIlwiKTtcblx0cmV0dXJuICBzdHIucmVwbGFjZSgvPlxcc3swLH08L2csXCI+PFwiKTsgXG59XG5cbnBwLnByb3RvdHlwZS5qc29ubWluID0gZnVuY3Rpb24odGV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdCAgXG4gICAgcmV0dXJuICB0ZXh0LnJlcGxhY2UoL1xcc3swLH1cXHtcXHN7MCx9L2csXCJ7XCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcc3swLH1cXFskL2csXCJbXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcW1xcc3swLH0vZyxcIltcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxcc3swLH1cXFsvZywnOlsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9XFx9XFxzezAsfS9nLFwifVwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9XFxdXFxzezAsfS9nLFwiXVwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFwiXFxzezAsfVxcLC9nLCdcIiwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCxcXHN7MCx9XFxcIi9nLCcsXCInKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFwiXFxzezAsfTovZywnXCI6JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxcc3swLH1cXFwiL2csJzpcIicpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzpcXHN7MCx9XFxbL2csJzpbJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwsXFxzezAsfVxcWy9nLCcsWycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLFxcc3syLH0vZywnLCAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXF1cXHN7MCx9LFxcc3swLH1cXFsvZywnXSxbJyk7ICAgXG59XG5cbnBwLnByb3RvdHlwZS5jc3NtaW4gPSBmdW5jdGlvbih0ZXh0LCBwcmVzZXJ2ZUNvbW1lbnRzKSB7XG5cdFxuXHR2YXIgc3RyID0gcHJlc2VydmVDb21tZW50cyA/IHRleHRcblx0XHRcdFx0ICAgOiB0ZXh0LnJlcGxhY2UoL1xcL1xcKihbXipdfFtcXHJcXG5dfChcXCorKFteKi9dfFtcXHJcXG5dKSkpKlxcKitcXC8vZyxcIlwiKSA7XG5cdHJldHVybiBzdHIucmVwbGFjZSgvXFxzezEsfS9nLCcgJylcblx0XHRcdCAgLnJlcGxhY2UoL1xce1xcc3sxLH0vZyxcIntcIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcfVxcc3sxLH0vZyxcIn1cIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcO1xcc3sxLH0vZyxcIjtcIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcL1xcKlxcc3sxLH0vZyxcIi8qXCIpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXCpcXC9cXHN7MSx9L2csXCIqL1wiKTtcbn1cdFxuXG5wcC5wcm90b3R5cGUuc3FsbWluID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcc3sxLH0vZyxcIiBcIikucmVwbGFjZSgvXFxzezEsfVxcKC8sXCIoXCIpLnJlcGxhY2UoL1xcc3sxLH1cXCkvLFwiKVwiKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5wZD0gbmV3IHBwO1x0XG5cblxuXG5cblxuXG5cblxuXG5cbiIsImZ1bmN0aW9uIERPTVBhcnNlcihvcHRpb25zKXtcclxuXHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8e2xvY2F0b3I6e319O1xyXG5cdFxyXG59XHJcbkRPTVBhcnNlci5wcm90b3R5cGUucGFyc2VGcm9tU3RyaW5nID0gZnVuY3Rpb24oc291cmNlLG1pbWVUeXBlKXtcclxuXHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHR2YXIgc2F4ID0gIG5ldyBYTUxSZWFkZXIoKTtcclxuXHR2YXIgZG9tQnVpbGRlciA9IG9wdGlvbnMuZG9tQnVpbGRlciB8fCBuZXcgRE9NSGFuZGxlcigpOy8vY29udGVudEhhbmRsZXIgYW5kIExleGljYWxIYW5kbGVyXHJcblx0dmFyIGVycm9ySGFuZGxlciA9IG9wdGlvbnMuZXJyb3JIYW5kbGVyO1xyXG5cdHZhciBsb2NhdG9yID0gb3B0aW9ucy5sb2NhdG9yO1xyXG5cdHZhciBkZWZhdWx0TlNNYXAgPSBvcHRpb25zLnhtbG5zfHx7fTtcclxuXHR2YXIgZW50aXR5TWFwID0geydsdCc6JzwnLCdndCc6Jz4nLCdhbXAnOicmJywncXVvdCc6J1wiJywnYXBvcyc6XCInXCJ9XHJcblx0aWYobG9jYXRvcil7XHJcblx0XHRkb21CdWlsZGVyLnNldERvY3VtZW50TG9jYXRvcihsb2NhdG9yKVxyXG5cdH1cclxuXHRcclxuXHRzYXguZXJyb3JIYW5kbGVyID0gYnVpbGRFcnJvckhhbmRsZXIoZXJyb3JIYW5kbGVyLGRvbUJ1aWxkZXIsbG9jYXRvcik7XHJcblx0c2F4LmRvbUJ1aWxkZXIgPSBvcHRpb25zLmRvbUJ1aWxkZXIgfHwgZG9tQnVpbGRlcjtcclxuXHRpZigvXFwveD9odG1sPyQvLnRlc3QobWltZVR5cGUpKXtcclxuXHRcdGVudGl0eU1hcC5uYnNwID0gJ1xceGEwJztcclxuXHRcdGVudGl0eU1hcC5jb3B5ID0gJ1xceGE5JztcclxuXHRcdGRlZmF1bHROU01hcFsnJ109ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcclxuXHR9XHJcblx0ZGVmYXVsdE5TTWFwLnhtbCA9IGRlZmF1bHROU01hcC54bWwgfHwgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcblx0aWYoc291cmNlKXtcclxuXHRcdHNheC5wYXJzZShzb3VyY2UsZGVmYXVsdE5TTWFwLGVudGl0eU1hcCk7XHJcblx0fWVsc2V7XHJcblx0XHRzYXguZXJyb3JIYW5kbGVyLmVycm9yKFwiaW52YWxpZCBkb2Mgc291cmNlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gZG9tQnVpbGRlci5kb2M7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGRFcnJvckhhbmRsZXIoZXJyb3JJbXBsLGRvbUJ1aWxkZXIsbG9jYXRvcil7XHJcblx0aWYoIWVycm9ySW1wbCl7XHJcblx0XHRpZihkb21CdWlsZGVyIGluc3RhbmNlb2YgRE9NSGFuZGxlcil7XHJcblx0XHRcdHJldHVybiBkb21CdWlsZGVyO1xyXG5cdFx0fVxyXG5cdFx0ZXJyb3JJbXBsID0gZG9tQnVpbGRlciA7XHJcblx0fVxyXG5cdHZhciBlcnJvckhhbmRsZXIgPSB7fVxyXG5cdHZhciBpc0NhbGxiYWNrID0gZXJyb3JJbXBsIGluc3RhbmNlb2YgRnVuY3Rpb247XHJcblx0bG9jYXRvciA9IGxvY2F0b3J8fHt9XHJcblx0ZnVuY3Rpb24gYnVpbGQoa2V5KXtcclxuXHRcdHZhciBmbiA9IGVycm9ySW1wbFtrZXldO1xyXG5cdFx0aWYoIWZuICYmIGlzQ2FsbGJhY2spe1xyXG5cdFx0XHRmbiA9IGVycm9ySW1wbC5sZW5ndGggPT0gMj9mdW5jdGlvbihtc2cpe2Vycm9ySW1wbChrZXksbXNnKX06ZXJyb3JJbXBsO1xyXG5cdFx0fVxyXG5cdFx0ZXJyb3JIYW5kbGVyW2tleV0gPSBmbiAmJiBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRmbignW3htbGRvbSAnK2tleSsnXVxcdCcrbXNnK19sb2NhdG9yKGxvY2F0b3IpKTtcclxuXHRcdH18fGZ1bmN0aW9uKCl7fTtcclxuXHR9XHJcblx0YnVpbGQoJ3dhcm5pbmcnKTtcclxuXHRidWlsZCgnZXJyb3InKTtcclxuXHRidWlsZCgnZmF0YWxFcnJvcicpO1xyXG5cdHJldHVybiBlcnJvckhhbmRsZXI7XHJcbn1cclxuXHJcbi8vY29uc29sZS5sb2coJyNcXG5cXG5cXG5cXG5cXG5cXG5cXG4jIyMjJylcclxuLyoqXHJcbiAqICtDb250ZW50SGFuZGxlcitFcnJvckhhbmRsZXJcclxuICogK0xleGljYWxIYW5kbGVyK0VudGl0eVJlc29sdmVyMlxyXG4gKiAtRGVjbEhhbmRsZXItRFRESGFuZGxlciBcclxuICogXHJcbiAqIERlZmF1bHRIYW5kbGVyOkVudGl0eVJlc29sdmVyLCBEVERIYW5kbGVyLCBDb250ZW50SGFuZGxlciwgRXJyb3JIYW5kbGVyXHJcbiAqIERlZmF1bHRIYW5kbGVyMjpEZWZhdWx0SGFuZGxlcixMZXhpY2FsSGFuZGxlciwgRGVjbEhhbmRsZXIsIEVudGl0eVJlc29sdmVyMlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9oZWxwZXJzL0RlZmF1bHRIYW5kbGVyLmh0bWxcclxuICovXHJcbmZ1bmN0aW9uIERPTUhhbmRsZXIoKSB7XHJcbiAgICB0aGlzLmNkYXRhID0gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gcG9zaXRpb24obG9jYXRvcixub2RlKXtcclxuXHRub2RlLmxpbmVOdW1iZXIgPSBsb2NhdG9yLmxpbmVOdW1iZXI7XHJcblx0bm9kZS5jb2x1bW5OdW1iZXIgPSBsb2NhdG9yLmNvbHVtbk51bWJlcjtcclxufVxyXG4vKipcclxuICogQHNlZSBvcmcueG1sLnNheC5Db250ZW50SGFuZGxlciNzdGFydERvY3VtZW50XHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L0NvbnRlbnRIYW5kbGVyLmh0bWxcclxuICovIFxyXG5ET01IYW5kbGVyLnByb3RvdHlwZSA9IHtcclxuXHRzdGFydERvY3VtZW50IDogZnVuY3Rpb24oKSB7XHJcbiAgICBcdHRoaXMuZG9jID0gbmV3IERPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICBcdGlmICh0aGlzLmxvY2F0b3IpIHtcclxuICAgICAgICBcdHRoaXMuZG9jLmRvY3VtZW50VVJJID0gdGhpcy5sb2NhdG9yLnN5c3RlbUlkO1xyXG4gICAgXHR9XHJcblx0fSxcclxuXHRzdGFydEVsZW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUsIHFOYW1lLCBhdHRycykge1xyXG5cdFx0dmFyIGRvYyA9IHRoaXMuZG9jO1xyXG5cdCAgICB2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcU5hbWV8fGxvY2FsTmFtZSk7XHJcblx0ICAgIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XHJcblx0ICAgIGFwcGVuZEVsZW1lbnQodGhpcywgZWwpO1xyXG5cdCAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gZWw7XHJcblx0ICAgIFxyXG5cdFx0dGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixlbClcclxuXHQgICAgZm9yICh2YXIgaSA9IDAgOyBpIDwgbGVuOyBpKyspIHtcclxuXHQgICAgICAgIHZhciBuYW1lc3BhY2VVUkkgPSBhdHRycy5nZXRVUkkoaSk7XHJcblx0ICAgICAgICB2YXIgdmFsdWUgPSBhdHRycy5nZXRWYWx1ZShpKTtcclxuXHQgICAgICAgIHZhciBxTmFtZSA9IGF0dHJzLmdldFFOYW1lKGkpO1xyXG5cdFx0XHR2YXIgYXR0ciA9IGRvYy5jcmVhdGVBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHFOYW1lKTtcclxuXHRcdFx0dGhpcy5sb2NhdG9yICYmcG9zaXRpb24oYXR0cnMuZ2V0TG9jYXRvcihpKSxhdHRyKTtcclxuXHRcdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGVsLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0ZW5kRWxlbWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSwgcU5hbWUpIHtcclxuXHRcdHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50RWxlbWVudFxyXG5cdFx0dmFyIHRhZ05hbWUgPSBjdXJyZW50LnRhZ05hbWU7XHJcblx0XHR0aGlzLmN1cnJlbnRFbGVtZW50ID0gY3VycmVudC5wYXJlbnROb2RlO1xyXG5cdH0sXHJcblx0c3RhcnRQcmVmaXhNYXBwaW5nOmZ1bmN0aW9uKHByZWZpeCwgdXJpKSB7XHJcblx0fSxcclxuXHRlbmRQcmVmaXhNYXBwaW5nOmZ1bmN0aW9uKHByZWZpeCkge1xyXG5cdH0sXHJcblx0cHJvY2Vzc2luZ0luc3RydWN0aW9uOmZ1bmN0aW9uKHRhcmdldCwgZGF0YSkge1xyXG5cdCAgICB2YXIgaW5zID0gdGhpcy5kb2MuY3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uKHRhcmdldCwgZGF0YSk7XHJcblx0ICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsaW5zKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGlucyk7XHJcblx0fSxcclxuXHRpZ25vcmFibGVXaGl0ZXNwYWNlOmZ1bmN0aW9uKGNoLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0fSxcclxuXHRjaGFyYWN0ZXJzOmZ1bmN0aW9uKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0XHRjaGFycyA9IF90b1N0cmluZy5hcHBseSh0aGlzLGFyZ3VtZW50cylcclxuXHRcdC8vY29uc29sZS5sb2coY2hhcnMpXHJcblx0XHRpZihjaGFycyl7XHJcblx0XHRcdGlmICh0aGlzLmNkYXRhKSB7XHJcblx0XHRcdFx0dmFyIGNoYXJOb2RlID0gdGhpcy5kb2MuY3JlYXRlQ0RBVEFTZWN0aW9uKGNoYXJzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgY2hhck5vZGUgPSB0aGlzLmRvYy5jcmVhdGVUZXh0Tm9kZShjaGFycyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodGhpcy5jdXJyZW50RWxlbWVudCl7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdH1lbHNlIGlmKC9eXFxzKiQvLnRlc3QoY2hhcnMpKXtcclxuXHRcdFx0XHR0aGlzLmRvYy5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdFx0Ly9wcm9jZXNzIHhtbFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsY2hhck5vZGUpXHJcblx0XHR9XHJcblx0fSxcclxuXHRza2lwcGVkRW50aXR5OmZ1bmN0aW9uKG5hbWUpIHtcclxuXHR9LFxyXG5cdGVuZERvY3VtZW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kb2Mubm9ybWFsaXplKCk7XHJcblx0fSxcclxuXHRzZXREb2N1bWVudExvY2F0b3I6ZnVuY3Rpb24gKGxvY2F0b3IpIHtcclxuXHQgICAgaWYodGhpcy5sb2NhdG9yID0gbG9jYXRvcil7Ly8gJiYgISgnbGluZU51bWJlcicgaW4gbG9jYXRvcikpe1xyXG5cdCAgICBcdGxvY2F0b3IubGluZU51bWJlciA9IDA7XHJcblx0ICAgIH1cclxuXHR9LFxyXG5cdC8vTGV4aWNhbEhhbmRsZXJcclxuXHRjb21tZW50OmZ1bmN0aW9uKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0XHRjaGFycyA9IF90b1N0cmluZy5hcHBseSh0aGlzLGFyZ3VtZW50cylcclxuXHQgICAgdmFyIGNvbW0gPSB0aGlzLmRvYy5jcmVhdGVDb21tZW50KGNoYXJzKTtcclxuXHQgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixjb21tKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGNvbW0pO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRDREFUQTpmdW5jdGlvbigpIHtcclxuXHQgICAgLy91c2VkIGluIGNoYXJhY3RlcnMoKSBtZXRob2RzXHJcblx0ICAgIHRoaXMuY2RhdGEgPSB0cnVlO1xyXG5cdH0sXHJcblx0ZW5kQ0RBVEE6ZnVuY3Rpb24oKSB7XHJcblx0ICAgIHRoaXMuY2RhdGEgPSBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0RFREOmZ1bmN0aW9uKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge1xyXG5cdFx0dmFyIGltcGwgPSB0aGlzLmRvYy5pbXBsZW1lbnRhdGlvbjtcclxuXHQgICAgaWYgKGltcGwgJiYgaW1wbC5jcmVhdGVEb2N1bWVudFR5cGUpIHtcclxuXHQgICAgICAgIHZhciBkdCA9IGltcGwuY3JlYXRlRG9jdW1lbnRUeXBlKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCk7XHJcblx0ICAgICAgICB0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGR0KVxyXG5cdCAgICAgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBkdCk7XHJcblx0ICAgIH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCAqIEBzZWUgb3JnLnhtbC5zYXguRXJyb3JIYW5kbGVyXHJcblx0ICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvRXJyb3JIYW5kbGVyLmh0bWxcclxuXHQgKi9cclxuXHR3YXJuaW5nOmZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1t4bWxkb20gd2FybmluZ11cXHQnK2Vycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdH0sXHJcblx0ZXJyb3I6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ1t4bWxkb20gZXJyb3JdXFx0JytlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHR9LFxyXG5cdGZhdGFsRXJyb3I6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ1t4bWxkb20gZmF0YWxFcnJvcl1cXHQnK2Vycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdCAgICB0aHJvdyBlcnJvcjtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gX2xvY2F0b3IobCl7XHJcblx0aWYobCl7XHJcblx0XHRyZXR1cm4gJ1xcbkAnKyhsLnN5c3RlbUlkIHx8JycpKycjW2xpbmU6JytsLmxpbmVOdW1iZXIrJyxjb2w6JytsLmNvbHVtbk51bWJlcisnXSdcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gX3RvU3RyaW5nKGNoYXJzLHN0YXJ0LGxlbmd0aCl7XHJcblx0aWYodHlwZW9mIGNoYXJzID09ICdzdHJpbmcnKXtcclxuXHRcdHJldHVybiBjaGFycy5zdWJzdHIoc3RhcnQsbGVuZ3RoKVxyXG5cdH1lbHNley8vamF2YSBzYXggY29ubmVjdCB3aWR0aCB4bWxkb20gb24gcmhpbm8od2hhdCBhYm91dDogXCI/ICYmICEoY2hhcnMgaW5zdGFuY2VvZiBTdHJpbmcpXCIpXHJcblx0XHRpZihjaGFycy5sZW5ndGggPj0gc3RhcnQrbGVuZ3RoIHx8IHN0YXJ0KXtcclxuXHRcdFx0cmV0dXJuIG5ldyBqYXZhLmxhbmcuU3RyaW5nKGNoYXJzLHN0YXJ0LGxlbmd0aCkrJyc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhcnM7XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvTGV4aWNhbEhhbmRsZXIuaHRtbFxyXG4gKiB1c2VkIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuTGV4aWNhbEhhbmRsZXI6XHJcbiAqICAjY29tbWVudChjaGFycywgc3RhcnQsIGxlbmd0aClcclxuICogICNzdGFydENEQVRBKClcclxuICogICNlbmRDREFUQSgpXHJcbiAqICAjc3RhcnREVEQobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKlxyXG4gKlxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuTGV4aWNhbEhhbmRsZXI6XHJcbiAqICAjZW5kRFREKClcclxuICogICNzdGFydEVudGl0eShuYW1lKVxyXG4gKiAgI2VuZEVudGl0eShuYW1lKVxyXG4gKlxyXG4gKlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvRGVjbEhhbmRsZXIuaHRtbFxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuRGVjbEhhbmRsZXJcclxuICogXHQjYXR0cmlidXRlRGVjbChlTmFtZSwgYU5hbWUsIHR5cGUsIG1vZGUsIHZhbHVlKVxyXG4gKiAgI2VsZW1lbnREZWNsKG5hbWUsIG1vZGVsKVxyXG4gKiAgI2V4dGVybmFsRW50aXR5RGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpXHJcbiAqICAjaW50ZXJuYWxFbnRpdHlEZWNsKG5hbWUsIHZhbHVlKVxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvRW50aXR5UmVzb2x2ZXIyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguRW50aXR5UmVzb2x2ZXIyXHJcbiAqICAjcmVzb2x2ZUVudGl0eShTdHJpbmcgbmFtZSxTdHJpbmcgcHVibGljSWQsU3RyaW5nIGJhc2VVUkksU3RyaW5nIHN5c3RlbUlkKVxyXG4gKiAgI3Jlc29sdmVFbnRpdHkocHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKiAgI2dldEV4dGVybmFsU3Vic2V0KG5hbWUsIGJhc2VVUkkpXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L0RUREhhbmRsZXIuaHRtbFxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5EVERIYW5kbGVyXHJcbiAqICAjbm90YXRpb25EZWNsKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge307XHJcbiAqICAjdW5wYXJzZWRFbnRpdHlEZWNsKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCwgbm90YXRpb25OYW1lKSB7fTtcclxuICovXHJcblwiZW5kRFRELHN0YXJ0RW50aXR5LGVuZEVudGl0eSxhdHRyaWJ1dGVEZWNsLGVsZW1lbnREZWNsLGV4dGVybmFsRW50aXR5RGVjbCxpbnRlcm5hbEVudGl0eURlY2wscmVzb2x2ZUVudGl0eSxnZXRFeHRlcm5hbFN1YnNldCxub3RhdGlvbkRlY2wsdW5wYXJzZWRFbnRpdHlEZWNsXCIucmVwbGFjZSgvXFx3Ky9nLGZ1bmN0aW9uKGtleSl7XHJcblx0RE9NSGFuZGxlci5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9XHJcbn0pXHJcblxyXG4vKiBQcml2YXRlIHN0YXRpYyBoZWxwZXJzIHRyZWF0ZWQgYmVsb3cgYXMgcHJpdmF0ZSBpbnN0YW5jZSBtZXRob2RzLCBzbyBkb24ndCBuZWVkIHRvIGFkZCB0aGVzZSB0byB0aGUgcHVibGljIEFQSTsgd2UgbWlnaHQgdXNlIGEgUmVsYXRvciB0byBhbHNvIGdldCByaWQgb2Ygbm9uLXN0YW5kYXJkIHB1YmxpYyBwcm9wZXJ0aWVzICovXHJcbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQgKGhhbmRlcixub2RlKSB7XHJcbiAgICBpZiAoIWhhbmRlci5jdXJyZW50RWxlbWVudCkge1xyXG4gICAgICAgIGhhbmRlci5kb2MuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmRlci5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxufS8vYXBwZW5kQ2hpbGQgYW5kIHNldEF0dHJpYnV0ZU5TIGFyZSBwcmVmb3JtYW5jZSBrZXlcclxuXHJcbi8vaWYodHlwZW9mIHJlcXVpcmUgPT0gJ2Z1bmN0aW9uJyl7XHJcblx0dmFyIFhNTFJlYWRlciA9IHJlcXVpcmUoJy4vc2F4JykuWE1MUmVhZGVyO1xyXG5cdHZhciBET01JbXBsZW1lbnRhdGlvbiA9IGV4cG9ydHMuRE9NSW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2RvbScpLkRPTUltcGxlbWVudGF0aW9uO1xyXG5cdGV4cG9ydHMuWE1MU2VyaWFsaXplciA9IHJlcXVpcmUoJy4vZG9tJykuWE1MU2VyaWFsaXplciA7XHJcblx0ZXhwb3J0cy5ET01QYXJzZXIgPSBET01QYXJzZXI7XHJcbi8vfVxyXG4iLCIvKlxuICogRE9NIExldmVsIDJcbiAqIE9iamVjdCBET01FeGNlcHRpb25cbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLURPTS1MZXZlbC0xL2VjbWEtc2NyaXB0LWxhbmd1YWdlLWJpbmRpbmcuaHRtbFxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAwL1JFQy1ET00tTGV2ZWwtMi1Db3JlLTIwMDAxMTEzL2VjbWEtc2NyaXB0LWJpbmRpbmcuaHRtbFxuICovXG5cbmZ1bmN0aW9uIGNvcHkoc3JjLGRlc3Qpe1xuXHRmb3IodmFyIHAgaW4gc3JjKXtcblx0XHRkZXN0W3BdID0gc3JjW3BdO1xuXHR9XG59XG4vKipcbl5cXHcrXFwucHJvdG90eXBlXFwuKFtfXFx3XSspXFxzKj1cXHMqKCg/Oi4qXFx7XFxzKj9bXFxyXFxuXVtcXHNcXFNdKj9efSl8XFxTLio/KD89WztcXHJcXG5dKSk7P1xuXlxcdytcXC5wcm90b3R5cGVcXC4oW19cXHddKylcXHMqPVxccyooXFxTLio/KD89WztcXHJcXG5dKSk7P1xuICovXG5mdW5jdGlvbiBfZXh0ZW5kcyhDbGFzcyxTdXBlcil7XG5cdHZhciBwdCA9IENsYXNzLnByb3RvdHlwZTtcblx0aWYoT2JqZWN0LmNyZWF0ZSl7XG5cdFx0dmFyIHBwdCA9IE9iamVjdC5jcmVhdGUoU3VwZXIucHJvdG90eXBlKVxuXHRcdHB0Ll9fcHJvdG9fXyA9IHBwdDtcblx0fVxuXHRpZighKHB0IGluc3RhbmNlb2YgU3VwZXIpKXtcblx0XHRmdW5jdGlvbiB0KCl7fTtcblx0XHR0LnByb3RvdHlwZSA9IFN1cGVyLnByb3RvdHlwZTtcblx0XHR0ID0gbmV3IHQoKTtcblx0XHRjb3B5KHB0LHQpO1xuXHRcdENsYXNzLnByb3RvdHlwZSA9IHB0ID0gdDtcblx0fVxuXHRpZihwdC5jb25zdHJ1Y3RvciAhPSBDbGFzcyl7XG5cdFx0aWYodHlwZW9mIENsYXNzICE9ICdmdW5jdGlvbicpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihcInVua25vdyBDbGFzczpcIitDbGFzcylcblx0XHR9XG5cdFx0cHQuY29uc3RydWN0b3IgPSBDbGFzc1xuXHR9XG59XG52YXIgaHRtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnIDtcbi8vIE5vZGUgVHlwZXNcbnZhciBOb2RlVHlwZSA9IHt9XG52YXIgRUxFTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRUxFTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gMTtcbnZhciBBVFRSSUJVVEVfTk9ERSAgICAgICAgICAgICAgPSBOb2RlVHlwZS5BVFRSSUJVVEVfTk9ERSAgICAgICAgICAgICAgPSAyO1xudmFyIFRFWFRfTk9ERSAgICAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLlRFWFRfTk9ERSAgICAgICAgICAgICAgICAgICA9IDM7XG52YXIgQ0RBVEFfU0VDVElPTl9OT0RFICAgICAgICAgID0gTm9kZVR5cGUuQ0RBVEFfU0VDVElPTl9OT0RFICAgICAgICAgID0gNDtcbnZhciBFTlRJVFlfUkVGRVJFTkNFX05PREUgICAgICAgPSBOb2RlVHlwZS5FTlRJVFlfUkVGRVJFTkNFX05PREUgICAgICAgPSA1O1xudmFyIEVOVElUWV9OT0RFICAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkVOVElUWV9OT0RFICAgICAgICAgICAgICAgICA9IDY7XG52YXIgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFID0gTm9kZVR5cGUuUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFID0gNztcbnZhciBDT01NRU5UX05PREUgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5DT01NRU5UX05PREUgICAgICAgICAgICAgICAgPSA4O1xudmFyIERPQ1VNRU5UX05PREUgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkRPQ1VNRU5UX05PREUgICAgICAgICAgICAgICA9IDk7XG52YXIgRE9DVU1FTlRfVFlQRV9OT0RFICAgICAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfVFlQRV9OT0RFICAgICAgICAgID0gMTA7XG52YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSAgICAgID0gMTE7XG52YXIgTk9UQVRJT05fTk9ERSAgICAgICAgICAgICAgID0gTm9kZVR5cGUuTk9UQVRJT05fTk9ERSAgICAgICAgICAgICAgID0gMTI7XG5cbi8vIEV4Y2VwdGlvbkNvZGVcbnZhciBFeGNlcHRpb25Db2RlID0ge31cbnZhciBFeGNlcHRpb25NZXNzYWdlID0ge307XG52YXIgSU5ERVhfU0laRV9FUlIgICAgICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTkRFWF9TSVpFX0VSUiAgICAgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMV09XCJJbmRleCBzaXplIGVycm9yXCIpLDEpO1xudmFyIERPTVNUUklOR19TSVpFX0VSUiAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuRE9NU1RSSU5HX1NJWkVfRVJSICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzJdPVwiRE9NU3RyaW5nIHNpemUgZXJyb3JcIiksMik7XG52YXIgSElFUkFSQ0hZX1JFUVVFU1RfRVJSICAgICAgID0gRXhjZXB0aW9uQ29kZS5ISUVSQVJDSFlfUkVRVUVTVF9FUlIgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbM109XCJIaWVyYXJjaHkgcmVxdWVzdCBlcnJvclwiKSwzKTtcbnZhciBXUk9OR19ET0NVTUVOVF9FUlIgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLldST05HX0RPQ1VNRU5UX0VSUiAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs0XT1cIldyb25nIGRvY3VtZW50XCIpLDQpO1xudmFyIElOVkFMSURfQ0hBUkFDVEVSX0VSUiAgICAgICA9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9DSEFSQUNURVJfRVJSICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzVdPVwiSW52YWxpZCBjaGFyYWN0ZXJcIiksNSk7XG52YXIgTk9fREFUQV9BTExPV0VEX0VSUiAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5OT19EQVRBX0FMTE9XRURfRVJSICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbNl09XCJObyBkYXRhIGFsbG93ZWRcIiksNik7XG52YXIgTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSID0gRXhjZXB0aW9uQ29kZS5OT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbN109XCJObyBtb2RpZmljYXRpb24gYWxsb3dlZFwiKSw3KTtcbnZhciBOT1RfRk9VTkRfRVJSICAgICAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PVF9GT1VORF9FUlIgICAgICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs4XT1cIk5vdCBmb3VuZFwiKSw4KTtcbnZhciBOT1RfU1VQUE9SVEVEX0VSUiAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PVF9TVVBQT1JURURfRVJSICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs5XT1cIk5vdCBzdXBwb3J0ZWRcIiksOSk7XG52YXIgSU5VU0VfQVRUUklCVVRFX0VSUiAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTlVTRV9BVFRSSUJVVEVfRVJSICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTBdPVwiQXR0cmlidXRlIGluIHVzZVwiKSwxMCk7XG4vL2xldmVsMlxudmFyIElOVkFMSURfU1RBVEVfRVJSICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX1NUQVRFX0VSUiAgICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMV09XCJJbnZhbGlkIHN0YXRlXCIpLDExKTtcbnZhciBTWU5UQVhfRVJSICAgICAgICAgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuU1lOVEFYX0VSUiAgICAgICAgICAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTJdPVwiU3ludGF4IGVycm9yXCIpLDEyKTtcbnZhciBJTlZBTElEX01PRElGSUNBVElPTl9FUlIgXHQ9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9NT0RJRklDQVRJT05fRVJSIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTNdPVwiSW52YWxpZCBtb2RpZmljYXRpb25cIiksMTMpO1xudmFyIE5BTUVTUEFDRV9FUlIgICAgICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5OQU1FU1BBQ0VfRVJSICAgICAgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzE0XT1cIkludmFsaWQgbmFtZXNwYWNlXCIpLDE0KTtcbnZhciBJTlZBTElEX0FDQ0VTU19FUlIgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9BQ0NFU1NfRVJSICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxNV09XCJJbnZhbGlkIGFjY2Vzc1wiKSwxNSk7XG5cblxuZnVuY3Rpb24gRE9NRXhjZXB0aW9uKGNvZGUsIG1lc3NhZ2UpIHtcblx0aWYobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKXtcblx0XHR2YXIgZXJyb3IgPSBtZXNzYWdlO1xuXHR9ZWxzZXtcblx0XHRlcnJvciA9IHRoaXM7XG5cdFx0RXJyb3IuY2FsbCh0aGlzLCBFeGNlcHRpb25NZXNzYWdlW2NvZGVdKTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBFeGNlcHRpb25NZXNzYWdlW2NvZGVdO1xuXHRcdGlmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBET01FeGNlcHRpb24pO1xuXHR9XG5cdGVycm9yLmNvZGUgPSBjb2RlO1xuXHRpZihtZXNzYWdlKSB0aGlzLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2UgKyBcIjogXCIgKyBtZXNzYWdlO1xuXHRyZXR1cm4gZXJyb3I7XG59O1xuRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcbmNvcHkoRXhjZXB0aW9uQ29kZSxET01FeGNlcHRpb24pXG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMC9SRUMtRE9NLUxldmVsLTItQ29yZS0yMDAwMTExMy9jb3JlLmh0bWwjSUQtNTM2Mjk3MTc3XG4gKiBUaGUgTm9kZUxpc3QgaW50ZXJmYWNlIHByb3ZpZGVzIHRoZSBhYnN0cmFjdGlvbiBvZiBhbiBvcmRlcmVkIGNvbGxlY3Rpb24gb2Ygbm9kZXMsIHdpdGhvdXQgZGVmaW5pbmcgb3IgY29uc3RyYWluaW5nIGhvdyB0aGlzIGNvbGxlY3Rpb24gaXMgaW1wbGVtZW50ZWQuIE5vZGVMaXN0IG9iamVjdHMgaW4gdGhlIERPTSBhcmUgbGl2ZS5cbiAqIFRoZSBpdGVtcyBpbiB0aGUgTm9kZUxpc3QgYXJlIGFjY2Vzc2libGUgdmlhIGFuIGludGVncmFsIGluZGV4LCBzdGFydGluZyBmcm9tIDAuXG4gKi9cbmZ1bmN0aW9uIE5vZGVMaXN0KCkge1xufTtcbk5vZGVMaXN0LnByb3RvdHlwZSA9IHtcblx0LyoqXG5cdCAqIFRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QuIFRoZSByYW5nZSBvZiB2YWxpZCBjaGlsZCBub2RlIGluZGljZXMgaXMgMCB0byBsZW5ndGgtMSBpbmNsdXNpdmUuXG5cdCAqIEBzdGFuZGFyZCBsZXZlbDFcblx0ICovXG5cdGxlbmd0aDowLCBcblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGluZGV4dGggaXRlbSBpbiB0aGUgY29sbGVjdGlvbi4gSWYgaW5kZXggaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QsIHRoaXMgcmV0dXJucyBudWxsLlxuXHQgKiBAc3RhbmRhcmQgbGV2ZWwxXG5cdCAqIEBwYXJhbSBpbmRleCAgdW5zaWduZWQgbG9uZyBcblx0ICogICBJbmRleCBpbnRvIHRoZSBjb2xsZWN0aW9uLlxuXHQgKiBAcmV0dXJuIE5vZGVcblx0ICogXHRUaGUgbm9kZSBhdCB0aGUgaW5kZXh0aCBwb3NpdGlvbiBpbiB0aGUgTm9kZUxpc3QsIG9yIG51bGwgaWYgdGhhdCBpcyBub3QgYSB2YWxpZCBpbmRleC4gXG5cdCAqL1xuXHRpdGVtOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdHJldHVybiB0aGlzW2luZGV4XSB8fCBudWxsO1xuXHR9LFxuXHR0b1N0cmluZzpmdW5jdGlvbihpc0hUTUwsbm9kZUZpbHRlcil7XG5cdFx0Zm9yKHZhciBidWYgPSBbXSwgaSA9IDA7aTx0aGlzLmxlbmd0aDtpKyspe1xuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcodGhpc1tpXSxidWYsaXNIVE1MLG5vZGVGaWx0ZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gYnVmLmpvaW4oJycpO1xuXHR9XG59O1xuZnVuY3Rpb24gTGl2ZU5vZGVMaXN0KG5vZGUscmVmcmVzaCl7XG5cdHRoaXMuX25vZGUgPSBub2RlO1xuXHR0aGlzLl9yZWZyZXNoID0gcmVmcmVzaFxuXHRfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG59XG5mdW5jdGlvbiBfdXBkYXRlTGl2ZUxpc3QobGlzdCl7XG5cdHZhciBpbmMgPSBsaXN0Ll9ub2RlLl9pbmMgfHwgbGlzdC5fbm9kZS5vd25lckRvY3VtZW50Ll9pbmM7XG5cdGlmKGxpc3QuX2luYyAhPSBpbmMpe1xuXHRcdHZhciBscyA9IGxpc3QuX3JlZnJlc2gobGlzdC5fbm9kZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhscy5sZW5ndGgpXG5cdFx0X19zZXRfXyhsaXN0LCdsZW5ndGgnLGxzLmxlbmd0aCk7XG5cdFx0Y29weShscyxsaXN0KTtcblx0XHRsaXN0Ll9pbmMgPSBpbmM7XG5cdH1cbn1cbkxpdmVOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uKGkpe1xuXHRfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG5cdHJldHVybiB0aGlzW2ldO1xufVxuXG5fZXh0ZW5kcyhMaXZlTm9kZUxpc3QsTm9kZUxpc3QpO1xuLyoqXG4gKiBcbiAqIE9iamVjdHMgaW1wbGVtZW50aW5nIHRoZSBOYW1lZE5vZGVNYXAgaW50ZXJmYWNlIGFyZSB1c2VkIHRvIHJlcHJlc2VudCBjb2xsZWN0aW9ucyBvZiBub2RlcyB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBieSBuYW1lLiBOb3RlIHRoYXQgTmFtZWROb2RlTWFwIGRvZXMgbm90IGluaGVyaXQgZnJvbSBOb2RlTGlzdDsgTmFtZWROb2RlTWFwcyBhcmUgbm90IG1haW50YWluZWQgaW4gYW55IHBhcnRpY3VsYXIgb3JkZXIuIE9iamVjdHMgY29udGFpbmVkIGluIGFuIG9iamVjdCBpbXBsZW1lbnRpbmcgTmFtZWROb2RlTWFwIG1heSBhbHNvIGJlIGFjY2Vzc2VkIGJ5IGFuIG9yZGluYWwgaW5kZXgsIGJ1dCB0aGlzIGlzIHNpbXBseSB0byBhbGxvdyBjb252ZW5pZW50IGVudW1lcmF0aW9uIG9mIHRoZSBjb250ZW50cyBvZiBhIE5hbWVkTm9kZU1hcCwgYW5kIGRvZXMgbm90IGltcGx5IHRoYXQgdGhlIERPTSBzcGVjaWZpZXMgYW4gb3JkZXIgdG8gdGhlc2UgTm9kZXMuXG4gKiBOYW1lZE5vZGVNYXAgb2JqZWN0cyBpbiB0aGUgRE9NIGFyZSBsaXZlLlxuICogdXNlZCBmb3IgYXR0cmlidXRlcyBvciBEb2N1bWVudFR5cGUgZW50aXRpZXMgXG4gKi9cbmZ1bmN0aW9uIE5hbWVkTm9kZU1hcCgpIHtcbn07XG5cbmZ1bmN0aW9uIF9maW5kTm9kZUluZGV4KGxpc3Qsbm9kZSl7XG5cdHZhciBpID0gbGlzdC5sZW5ndGg7XG5cdHdoaWxlKGktLSl7XG5cdFx0aWYobGlzdFtpXSA9PT0gbm9kZSl7cmV0dXJuIGl9XG5cdH1cbn1cblxuZnVuY3Rpb24gX2FkZE5hbWVkTm9kZShlbCxsaXN0LG5ld0F0dHIsb2xkQXR0cil7XG5cdGlmKG9sZEF0dHIpe1xuXHRcdGxpc3RbX2ZpbmROb2RlSW5kZXgobGlzdCxvbGRBdHRyKV0gPSBuZXdBdHRyO1xuXHR9ZWxzZXtcblx0XHRsaXN0W2xpc3QubGVuZ3RoKytdID0gbmV3QXR0cjtcblx0fVxuXHRpZihlbCl7XG5cdFx0bmV3QXR0ci5vd25lckVsZW1lbnQgPSBlbDtcblx0XHR2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblx0XHRpZihkb2Mpe1xuXHRcdFx0b2xkQXR0ciAmJiBfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLGVsLG9sZEF0dHIpO1xuXHRcdFx0X29uQWRkQXR0cmlidXRlKGRvYyxlbCxuZXdBdHRyKTtcblx0XHR9XG5cdH1cbn1cbmZ1bmN0aW9uIF9yZW1vdmVOYW1lZE5vZGUoZWwsbGlzdCxhdHRyKXtcblx0Ly9jb25zb2xlLmxvZygncmVtb3ZlIGF0dHI6JythdHRyKVxuXHR2YXIgaSA9IF9maW5kTm9kZUluZGV4KGxpc3QsYXR0cik7XG5cdGlmKGk+PTApe1xuXHRcdHZhciBsYXN0SW5kZXggPSBsaXN0Lmxlbmd0aC0xXG5cdFx0d2hpbGUoaTxsYXN0SW5kZXgpe1xuXHRcdFx0bGlzdFtpXSA9IGxpc3RbKytpXVxuXHRcdH1cblx0XHRsaXN0Lmxlbmd0aCA9IGxhc3RJbmRleDtcblx0XHRpZihlbCl7XG5cdFx0XHR2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblx0XHRcdGlmKGRvYyl7XG5cdFx0XHRcdF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsYXR0cik7XG5cdFx0XHRcdGF0dHIub3duZXJFbGVtZW50ID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH1lbHNle1xuXHRcdHRocm93IERPTUV4Y2VwdGlvbihOT1RfRk9VTkRfRVJSLG5ldyBFcnJvcihlbC50YWdOYW1lKydAJythdHRyKSlcblx0fVxufVxuTmFtZWROb2RlTWFwLnByb3RvdHlwZSA9IHtcblx0bGVuZ3RoOjAsXG5cdGl0ZW06Tm9kZUxpc3QucHJvdG90eXBlLml0ZW0sXG5cdGdldE5hbWVkSXRlbTogZnVuY3Rpb24oa2V5KSB7XG4vL1x0XHRpZihrZXkuaW5kZXhPZignOicpPjAgfHwga2V5ID09ICd4bWxucycpe1xuLy9cdFx0XHRyZXR1cm4gbnVsbDtcbi8vXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKClcblx0XHR2YXIgaSA9IHRoaXMubGVuZ3RoO1xuXHRcdHdoaWxlKGktLSl7XG5cdFx0XHR2YXIgYXR0ciA9IHRoaXNbaV07XG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHIubm9kZU5hbWUsa2V5KVxuXHRcdFx0aWYoYXR0ci5ub2RlTmFtZSA9PSBrZXkpe1xuXHRcdFx0XHRyZXR1cm4gYXR0cjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHNldE5hbWVkSXRlbTogZnVuY3Rpb24oYXR0cikge1xuXHRcdHZhciBlbCA9IGF0dHIub3duZXJFbGVtZW50O1xuXHRcdGlmKGVsICYmIGVsIT10aGlzLl9vd25lckVsZW1lbnQpe1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4Y2VwdGlvbihJTlVTRV9BVFRSSUJVVEVfRVJSKTtcblx0XHR9XG5cdFx0dmFyIG9sZEF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbShhdHRyLm5vZGVOYW1lKTtcblx0XHRfYWRkTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIsb2xkQXR0cik7XG5cdFx0cmV0dXJuIG9sZEF0dHI7XG5cdH0sXG5cdC8qIHJldHVybnMgTm9kZSAqL1xuXHRzZXROYW1lZEl0ZW1OUzogZnVuY3Rpb24oYXR0cikgey8vIHJhaXNlczogV1JPTkdfRE9DVU1FTlRfRVJSLE5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUixJTlVTRV9BVFRSSUJVVEVfRVJSXG5cdFx0dmFyIGVsID0gYXR0ci5vd25lckVsZW1lbnQsIG9sZEF0dHI7XG5cdFx0aWYoZWwgJiYgZWwhPXRoaXMuX293bmVyRWxlbWVudCl7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKElOVVNFX0FUVFJJQlVURV9FUlIpO1xuXHRcdH1cblx0XHRvbGRBdHRyID0gdGhpcy5nZXROYW1lZEl0ZW1OUyhhdHRyLm5hbWVzcGFjZVVSSSxhdHRyLmxvY2FsTmFtZSk7XG5cdFx0X2FkZE5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyLG9sZEF0dHIpO1xuXHRcdHJldHVybiBvbGRBdHRyO1xuXHR9LFxuXG5cdC8qIHJldHVybnMgTm9kZSAqL1xuXHRyZW1vdmVOYW1lZEl0ZW06IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXROYW1lZEl0ZW0oa2V5KTtcblx0XHRfcmVtb3ZlTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIpO1xuXHRcdHJldHVybiBhdHRyO1xuXHRcdFxuXHRcdFxuXHR9LC8vIHJhaXNlczogTk9UX0ZPVU5EX0VSUixOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlJcblx0XG5cdC8vZm9yIGxldmVsMlxuXHRyZW1vdmVOYW1lZEl0ZW1OUzpmdW5jdGlvbihuYW1lc3BhY2VVUkksbG9jYWxOYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtTlMobmFtZXNwYWNlVVJJLGxvY2FsTmFtZSk7XG5cdFx0X3JlbW92ZU5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyKTtcblx0XHRyZXR1cm4gYXR0cjtcblx0fSxcblx0Z2V0TmFtZWRJdGVtTlM6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKSB7XG5cdFx0dmFyIGkgPSB0aGlzLmxlbmd0aDtcblx0XHR3aGlsZShpLS0pe1xuXHRcdFx0dmFyIG5vZGUgPSB0aGlzW2ldO1xuXHRcdFx0aWYobm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lICYmIG5vZGUubmFtZXNwYWNlVVJJID09IG5hbWVzcGFjZVVSSSl7XG5cdFx0XHRcdHJldHVybiBub2RlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtRE9NLUxldmVsLTEvbGV2ZWwtb25lLWNvcmUuaHRtbCNJRC0xMDIxNjE0OTBcbiAqL1xuZnVuY3Rpb24gRE9NSW1wbGVtZW50YXRpb24oLyogT2JqZWN0ICovIGZlYXR1cmVzKSB7XG5cdHRoaXMuX2ZlYXR1cmVzID0ge307XG5cdGlmIChmZWF0dXJlcykge1xuXHRcdGZvciAodmFyIGZlYXR1cmUgaW4gZmVhdHVyZXMpIHtcblx0XHRcdCB0aGlzLl9mZWF0dXJlcyA9IGZlYXR1cmVzW2ZlYXR1cmVdO1xuXHRcdH1cblx0fVxufTtcblxuRE9NSW1wbGVtZW50YXRpb24ucHJvdG90eXBlID0ge1xuXHRoYXNGZWF0dXJlOiBmdW5jdGlvbigvKiBzdHJpbmcgKi8gZmVhdHVyZSwgLyogc3RyaW5nICovIHZlcnNpb24pIHtcblx0XHR2YXIgdmVyc2lvbnMgPSB0aGlzLl9mZWF0dXJlc1tmZWF0dXJlLnRvTG93ZXJDYXNlKCldO1xuXHRcdGlmICh2ZXJzaW9ucyAmJiAoIXZlcnNpb24gfHwgdmVyc2lvbiBpbiB2ZXJzaW9ucykpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVEb2N1bWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksICBxdWFsaWZpZWROYW1lLCBkb2N0eXBlKXsvLyByYWlzZXM6SU5WQUxJRF9DSEFSQUNURVJfRVJSLE5BTUVTUEFDRV9FUlIsV1JPTkdfRE9DVU1FTlRfRVJSXG5cdFx0dmFyIGRvYyA9IG5ldyBEb2N1bWVudCgpO1xuXHRcdGRvYy5pbXBsZW1lbnRhdGlvbiA9IHRoaXM7XG5cdFx0ZG9jLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRkb2MuZG9jdHlwZSA9IGRvY3R5cGU7XG5cdFx0aWYoZG9jdHlwZSl7XG5cdFx0XHRkb2MuYXBwZW5kQ2hpbGQoZG9jdHlwZSk7XG5cdFx0fVxuXHRcdGlmKHF1YWxpZmllZE5hbWUpe1xuXHRcdFx0dmFyIHJvb3QgPSBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSxxdWFsaWZpZWROYW1lKTtcblx0XHRcdGRvYy5hcHBlbmRDaGlsZChyb290KTtcblx0XHR9XG5cdFx0cmV0dXJuIGRvYztcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlRG9jdW1lbnRUeXBlOmZ1bmN0aW9uKHF1YWxpZmllZE5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCl7Ly8gcmFpc2VzOklOVkFMSURfQ0hBUkFDVEVSX0VSUixOQU1FU1BBQ0VfRVJSXG5cdFx0dmFyIG5vZGUgPSBuZXcgRG9jdW1lbnRUeXBlKCk7XG5cdFx0bm9kZS5uYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5vZGVOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLnB1YmxpY0lkID0gcHVibGljSWQ7XG5cdFx0bm9kZS5zeXN0ZW1JZCA9IHN5c3RlbUlkO1xuXHRcdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdFx0Ly9yZWFkb25seSBhdHRyaWJ1dGUgRE9NU3RyaW5nICAgICAgICBpbnRlcm5hbFN1YnNldDtcblx0XHRcblx0XHQvL1RPRE86Li5cblx0XHQvLyAgcmVhZG9ubHkgYXR0cmlidXRlIE5hbWVkTm9kZU1hcCAgICAgZW50aXRpZXM7XG5cdFx0Ly8gIHJlYWRvbmx5IGF0dHJpYnV0ZSBOYW1lZE5vZGVNYXAgICAgIG5vdGF0aW9ucztcblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxuXG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMC9SRUMtRE9NLUxldmVsLTItQ29yZS0yMDAwMTExMy9jb3JlLmh0bWwjSUQtMTk1MDY0MTI0N1xuICovXG5cbmZ1bmN0aW9uIE5vZGUoKSB7XG59O1xuXG5Ob2RlLnByb3RvdHlwZSA9IHtcblx0Zmlyc3RDaGlsZCA6IG51bGwsXG5cdGxhc3RDaGlsZCA6IG51bGwsXG5cdHByZXZpb3VzU2libGluZyA6IG51bGwsXG5cdG5leHRTaWJsaW5nIDogbnVsbCxcblx0YXR0cmlidXRlcyA6IG51bGwsXG5cdHBhcmVudE5vZGUgOiBudWxsLFxuXHRjaGlsZE5vZGVzIDogbnVsbCxcblx0b3duZXJEb2N1bWVudCA6IG51bGwsXG5cdG5vZGVWYWx1ZSA6IG51bGwsXG5cdG5hbWVzcGFjZVVSSSA6IG51bGwsXG5cdHByZWZpeCA6IG51bGwsXG5cdGxvY2FsTmFtZSA6IG51bGwsXG5cdC8vIE1vZGlmaWVkIGluIERPTSBMZXZlbCAyOlxuXHRpbnNlcnRCZWZvcmU6ZnVuY3Rpb24obmV3Q2hpbGQsIHJlZkNoaWxkKXsvL3JhaXNlcyBcblx0XHRyZXR1cm4gX2luc2VydEJlZm9yZSh0aGlzLG5ld0NoaWxkLHJlZkNoaWxkKTtcblx0fSxcblx0cmVwbGFjZUNoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkLCBvbGRDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0dGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsb2xkQ2hpbGQpO1xuXHRcdGlmKG9sZENoaWxkKXtcblx0XHRcdHRoaXMucmVtb3ZlQ2hpbGQob2xkQ2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlQ2hpbGQ6ZnVuY3Rpb24ob2xkQ2hpbGQpe1xuXHRcdHJldHVybiBfcmVtb3ZlQ2hpbGQodGhpcyxvbGRDaGlsZCk7XG5cdH0sXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHRyZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsbnVsbCk7XG5cdH0sXG5cdGhhc0NoaWxkTm9kZXM6ZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5maXJzdENoaWxkICE9IG51bGw7XG5cdH0sXG5cdGNsb25lTm9kZTpmdW5jdGlvbihkZWVwKXtcblx0XHRyZXR1cm4gY2xvbmVOb2RlKHRoaXMub3duZXJEb2N1bWVudHx8dGhpcyx0aGlzLGRlZXApO1xuXHR9LFxuXHQvLyBNb2RpZmllZCBpbiBET00gTGV2ZWwgMjpcblx0bm9ybWFsaXplOmZ1bmN0aW9uKCl7XG5cdFx0dmFyIGNoaWxkID0gdGhpcy5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdHZhciBuZXh0ID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHRpZihuZXh0ICYmIG5leHQubm9kZVR5cGUgPT0gVEVYVF9OT0RFICYmIGNoaWxkLm5vZGVUeXBlID09IFRFWFRfTk9ERSl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ2hpbGQobmV4dCk7XG5cdFx0XHRcdGNoaWxkLmFwcGVuZERhdGEobmV4dC5kYXRhKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRjaGlsZC5ub3JtYWxpemUoKTtcblx0XHRcdFx0Y2hpbGQgPSBuZXh0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcbiAgXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRpc1N1cHBvcnRlZDpmdW5jdGlvbihmZWF0dXJlLCB2ZXJzaW9uKXtcblx0XHRyZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoZmVhdHVyZSx2ZXJzaW9uKTtcblx0fSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuICAgIGhhc0F0dHJpYnV0ZXM6ZnVuY3Rpb24oKXtcbiAgICBcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoPjA7XG4gICAgfSxcbiAgICBsb29rdXBQcmVmaXg6ZnVuY3Rpb24obmFtZXNwYWNlVVJJKXtcbiAgICBcdHZhciBlbCA9IHRoaXM7XG4gICAgXHR3aGlsZShlbCl7XG4gICAgXHRcdHZhciBtYXAgPSBlbC5fbnNNYXA7XG4gICAgXHRcdC8vY29uc29sZS5kaXIobWFwKVxuICAgIFx0XHRpZihtYXApe1xuICAgIFx0XHRcdGZvcih2YXIgbiBpbiBtYXApe1xuICAgIFx0XHRcdFx0aWYobWFwW25dID09IG5hbWVzcGFjZVVSSSl7XG4gICAgXHRcdFx0XHRcdHJldHVybiBuO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XHRlbCA9IGVsLm5vZGVUeXBlID09IEFUVFJJQlVURV9OT0RFP2VsLm93bmVyRG9jdW1lbnQgOiBlbC5wYXJlbnROb2RlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAzOlxuICAgIGxvb2t1cE5hbWVzcGFjZVVSSTpmdW5jdGlvbihwcmVmaXgpe1xuICAgIFx0dmFyIGVsID0gdGhpcztcbiAgICBcdHdoaWxlKGVsKXtcbiAgICBcdFx0dmFyIG1hcCA9IGVsLl9uc01hcDtcbiAgICBcdFx0Ly9jb25zb2xlLmRpcihtYXApXG4gICAgXHRcdGlmKG1hcCl7XG4gICAgXHRcdFx0aWYocHJlZml4IGluIG1hcCl7XG4gICAgXHRcdFx0XHRyZXR1cm4gbWFwW3ByZWZpeF0gO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XHRlbCA9IGVsLm5vZGVUeXBlID09IEFUVFJJQlVURV9OT0RFP2VsLm93bmVyRG9jdW1lbnQgOiBlbC5wYXJlbnROb2RlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAzOlxuICAgIGlzRGVmYXVsdE5hbWVzcGFjZTpmdW5jdGlvbihuYW1lc3BhY2VVUkkpe1xuICAgIFx0dmFyIHByZWZpeCA9IHRoaXMubG9va3VwUHJlZml4KG5hbWVzcGFjZVVSSSk7XG4gICAgXHRyZXR1cm4gcHJlZml4ID09IG51bGw7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBfeG1sRW5jb2RlcihjKXtcblx0cmV0dXJuIGMgPT0gJzwnICYmICcmbHQ7JyB8fFxuICAgICAgICAgYyA9PSAnPicgJiYgJyZndDsnIHx8XG4gICAgICAgICBjID09ICcmJyAmJiAnJmFtcDsnIHx8XG4gICAgICAgICBjID09ICdcIicgJiYgJyZxdW90OycgfHxcbiAgICAgICAgICcmIycrYy5jaGFyQ29kZUF0KCkrJzsnXG59XG5cblxuY29weShOb2RlVHlwZSxOb2RlKTtcbmNvcHkoTm9kZVR5cGUsTm9kZS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEBwYXJhbSBjYWxsYmFjayByZXR1cm4gdHJ1ZSBmb3IgY29udGludWUsZmFsc2UgZm9yIGJyZWFrXG4gKiBAcmV0dXJuIGJvb2xlYW4gdHJ1ZTogYnJlYWsgdmlzaXQ7XG4gKi9cbmZ1bmN0aW9uIF92aXNpdE5vZGUobm9kZSxjYWxsYmFjayl7XG5cdGlmKGNhbGxiYWNrKG5vZGUpKXtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZihub2RlID0gbm9kZS5maXJzdENoaWxkKXtcblx0XHRkb3tcblx0XHRcdGlmKF92aXNpdE5vZGUobm9kZSxjYWxsYmFjaykpe3JldHVybiB0cnVlfVxuICAgICAgICB9d2hpbGUobm9kZT1ub2RlLm5leHRTaWJsaW5nKVxuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIERvY3VtZW50KCl7XG59XG5mdW5jdGlvbiBfb25BZGRBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIpe1xuXHRkb2MgJiYgZG9jLl9pbmMrKztcblx0dmFyIG5zID0gbmV3QXR0ci5uYW1lc3BhY2VVUkkgO1xuXHRpZihucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKXtcblx0XHQvL3VwZGF0ZSBuYW1lc3BhY2Vcblx0XHRlbC5fbnNNYXBbbmV3QXR0ci5wcmVmaXg/bmV3QXR0ci5sb2NhbE5hbWU6JyddID0gbmV3QXR0ci52YWx1ZVxuXHR9XG59XG5mdW5jdGlvbiBfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIscmVtb3ZlKXtcblx0ZG9jICYmIGRvYy5faW5jKys7XG5cdHZhciBucyA9IG5ld0F0dHIubmFtZXNwYWNlVVJJIDtcblx0aWYobnMgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyl7XG5cdFx0Ly91cGRhdGUgbmFtZXNwYWNlXG5cdFx0ZGVsZXRlIGVsLl9uc01hcFtuZXdBdHRyLnByZWZpeD9uZXdBdHRyLmxvY2FsTmFtZTonJ11cblx0fVxufVxuZnVuY3Rpb24gX29uVXBkYXRlQ2hpbGQoZG9jLGVsLG5ld0NoaWxkKXtcblx0aWYoZG9jICYmIGRvYy5faW5jKXtcblx0XHRkb2MuX2luYysrO1xuXHRcdC8vdXBkYXRlIGNoaWxkTm9kZXNcblx0XHR2YXIgY3MgPSBlbC5jaGlsZE5vZGVzO1xuXHRcdGlmKG5ld0NoaWxkKXtcblx0XHRcdGNzW2NzLmxlbmd0aCsrXSA9IG5ld0NoaWxkO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly9jb25zb2xlLmxvZygxKVxuXHRcdFx0dmFyIGNoaWxkID0gZWwuZmlyc3RDaGlsZDtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0Y3NbaSsrXSA9IGNoaWxkO1xuXHRcdFx0XHRjaGlsZCA9Y2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRjcy5sZW5ndGggPSBpO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIGF0dHJpYnV0ZXM7XG4gKiBjaGlsZHJlbjtcbiAqIFxuICogd3JpdGVhYmxlIHByb3BlcnRpZXM6XG4gKiBub2RlVmFsdWUsQXR0cjp2YWx1ZSxDaGFyYWN0ZXJEYXRhOmRhdGFcbiAqIHByZWZpeFxuICovXG5mdW5jdGlvbiBfcmVtb3ZlQ2hpbGQocGFyZW50Tm9kZSxjaGlsZCl7XG5cdHZhciBwcmV2aW91cyA9IGNoaWxkLnByZXZpb3VzU2libGluZztcblx0dmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblx0aWYocHJldmlvdXMpe1xuXHRcdHByZXZpb3VzLm5leHRTaWJsaW5nID0gbmV4dDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV4dFxuXHR9XG5cdGlmKG5leHQpe1xuXHRcdG5leHQucHJldmlvdXNTaWJsaW5nID0gcHJldmlvdXM7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUubGFzdENoaWxkID0gcHJldmlvdXM7XG5cdH1cblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50LHBhcmVudE5vZGUpO1xuXHRyZXR1cm4gY2hpbGQ7XG59XG4vKipcbiAqIHByZWZvcm1hbmNlIGtleShyZWZDaGlsZCA9PSBudWxsKVxuICovXG5mdW5jdGlvbiBfaW5zZXJ0QmVmb3JlKHBhcmVudE5vZGUsbmV3Q2hpbGQsbmV4dENoaWxkKXtcblx0dmFyIGNwID0gbmV3Q2hpbGQucGFyZW50Tm9kZTtcblx0aWYoY3Ape1xuXHRcdGNwLnJlbW92ZUNoaWxkKG5ld0NoaWxkKTsvL3JlbW92ZSBhbmQgdXBkYXRlXG5cdH1cblx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdHZhciBuZXdGaXJzdCA9IG5ld0NoaWxkLmZpcnN0Q2hpbGQ7XG5cdFx0aWYgKG5ld0ZpcnN0ID09IG51bGwpIHtcblx0XHRcdHJldHVybiBuZXdDaGlsZDtcblx0XHR9XG5cdFx0dmFyIG5ld0xhc3QgPSBuZXdDaGlsZC5sYXN0Q2hpbGQ7XG5cdH1lbHNle1xuXHRcdG5ld0ZpcnN0ID0gbmV3TGFzdCA9IG5ld0NoaWxkO1xuXHR9XG5cdHZhciBwcmUgPSBuZXh0Q2hpbGQgPyBuZXh0Q2hpbGQucHJldmlvdXNTaWJsaW5nIDogcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cblx0bmV3Rmlyc3QucHJldmlvdXNTaWJsaW5nID0gcHJlO1xuXHRuZXdMYXN0Lm5leHRTaWJsaW5nID0gbmV4dENoaWxkO1xuXHRcblx0XG5cdGlmKHByZSl7XG5cdFx0cHJlLm5leHRTaWJsaW5nID0gbmV3Rmlyc3Q7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUuZmlyc3RDaGlsZCA9IG5ld0ZpcnN0O1xuXHR9XG5cdGlmKG5leHRDaGlsZCA9PSBudWxsKXtcblx0XHRwYXJlbnROb2RlLmxhc3RDaGlsZCA9IG5ld0xhc3Q7XG5cdH1lbHNle1xuXHRcdG5leHRDaGlsZC5wcmV2aW91c1NpYmxpbmcgPSBuZXdMYXN0O1xuXHR9XG5cdGRve1xuXHRcdG5ld0ZpcnN0LnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuXHR9d2hpbGUobmV3Rmlyc3QgIT09IG5ld0xhc3QgJiYgKG5ld0ZpcnN0PSBuZXdGaXJzdC5uZXh0U2libGluZykpXG5cdF9vblVwZGF0ZUNoaWxkKHBhcmVudE5vZGUub3duZXJEb2N1bWVudHx8cGFyZW50Tm9kZSxwYXJlbnROb2RlKTtcblx0Ly9jb25zb2xlLmxvZyhwYXJlbnROb2RlLmxhc3RDaGlsZC5uZXh0U2libGluZyA9PSBudWxsKVxuXHRpZiAobmV3Q2hpbGQubm9kZVR5cGUgPT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuXHRcdG5ld0NoaWxkLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZC5sYXN0Q2hpbGQgPSBudWxsO1xuXHR9XG5cdHJldHVybiBuZXdDaGlsZDtcbn1cbmZ1bmN0aW9uIF9hcHBlbmRTaW5nbGVDaGlsZChwYXJlbnROb2RlLG5ld0NoaWxkKXtcblx0dmFyIGNwID0gbmV3Q2hpbGQucGFyZW50Tm9kZTtcblx0aWYoY3Ape1xuXHRcdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0XHRjcC5yZW1vdmVDaGlsZChuZXdDaGlsZCk7Ly9yZW1vdmUgYW5kIHVwZGF0ZVxuXHRcdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0fVxuXHR2YXIgcHJlID0gcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cdG5ld0NoaWxkLnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuXHRuZXdDaGlsZC5wcmV2aW91c1NpYmxpbmcgPSBwcmU7XG5cdG5ld0NoaWxkLm5leHRTaWJsaW5nID0gbnVsbDtcblx0aWYocHJlKXtcblx0XHRwcmUubmV4dFNpYmxpbmcgPSBuZXdDaGlsZDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV3Q2hpbGQ7XG5cdH1cblx0cGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBuZXdDaGlsZDtcblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50LHBhcmVudE5vZGUsbmV3Q2hpbGQpO1xuXHRyZXR1cm4gbmV3Q2hpbGQ7XG5cdC8vY29uc29sZS5sb2coXCJfX2FhXCIscGFyZW50Tm9kZS5sYXN0Q2hpbGQubmV4dFNpYmxpbmcgPT0gbnVsbClcbn1cbkRvY3VtZW50LnByb3RvdHlwZSA9IHtcblx0Ly9pbXBsZW1lbnRhdGlvbiA6IG51bGwsXG5cdG5vZGVOYW1lIDogICcjZG9jdW1lbnQnLFxuXHRub2RlVHlwZSA6ICBET0NVTUVOVF9OT0RFLFxuXHRkb2N0eXBlIDogIG51bGwsXG5cdGRvY3VtZW50RWxlbWVudCA6ICBudWxsLFxuXHRfaW5jIDogMSxcblx0XG5cdGluc2VydEJlZm9yZSA6ICBmdW5jdGlvbihuZXdDaGlsZCwgcmVmQ2hpbGQpey8vcmFpc2VzIFxuXHRcdGlmKG5ld0NoaWxkLm5vZGVUeXBlID09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdFx0dmFyIGNoaWxkID0gbmV3Q2hpbGQuZmlyc3RDaGlsZDtcblx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0dmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0dGhpcy5pbnNlcnRCZWZvcmUoY2hpbGQscmVmQ2hpbGQpO1xuXHRcdFx0XHRjaGlsZCA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdGlmKHRoaXMuZG9jdW1lbnRFbGVtZW50ID09IG51bGwgJiYgbmV3Q2hpbGQubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFKXtcblx0XHRcdHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBfaW5zZXJ0QmVmb3JlKHRoaXMsbmV3Q2hpbGQscmVmQ2hpbGQpLChuZXdDaGlsZC5vd25lckRvY3VtZW50ID0gdGhpcyksbmV3Q2hpbGQ7XG5cdH0sXG5cdHJlbW92ZUNoaWxkIDogIGZ1bmN0aW9uKG9sZENoaWxkKXtcblx0XHRpZih0aGlzLmRvY3VtZW50RWxlbWVudCA9PSBvbGRDaGlsZCl7XG5cdFx0XHR0aGlzLmRvY3VtZW50RWxlbWVudCA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiBfcmVtb3ZlQ2hpbGQodGhpcyxvbGRDaGlsZCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGltcG9ydE5vZGUgOiBmdW5jdGlvbihpbXBvcnRlZE5vZGUsZGVlcCl7XG5cdFx0cmV0dXJuIGltcG9ydE5vZGUodGhpcyxpbXBvcnRlZE5vZGUsZGVlcCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGdldEVsZW1lbnRCeUlkIDpcdGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgcnR2ID0gbnVsbDtcblx0XHRfdmlzaXROb2RlKHRoaXMuZG9jdW1lbnRFbGVtZW50LGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0aWYobm9kZS5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUpe1xuXHRcdFx0XHRpZihub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PSBpZCl7XG5cdFx0XHRcdFx0cnR2ID0gbm9kZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0cmV0dXJuIHJ0djtcblx0fSxcblx0XG5cdC8vZG9jdW1lbnQgZmFjdG9yeSBtZXRob2Q6XG5cdGNyZWF0ZUVsZW1lbnQgOlx0ZnVuY3Rpb24odGFnTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRWxlbWVudCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHRhZ05hbWU7XG5cdFx0bm9kZS50YWdOYW1lID0gdGFnTmFtZTtcblx0XHRub2RlLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuXHRcdGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVEb2N1bWVudEZyYWdtZW50IDpcdGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZVRleHROb2RlIDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IFRleHQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuYXBwZW5kRGF0YShkYXRhKVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVDb21tZW50IDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IENvbW1lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuYXBwZW5kRGF0YShkYXRhKVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVDREFUQVNlY3Rpb24gOlx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQ0RBVEFTZWN0aW9uKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uIDpcdGZ1bmN0aW9uKHRhcmdldCxkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24oKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUudGFnTmFtZSA9IG5vZGUudGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdG5vZGUubm9kZVZhbHVlPSBub2RlLmRhdGEgPSBkYXRhO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVBdHRyaWJ1dGUgOlx0ZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudFx0PSB0aGlzO1xuXHRcdG5vZGUubmFtZSA9IG5hbWU7XG5cdFx0bm9kZS5ub2RlTmFtZVx0PSBuYW1lO1xuXHRcdG5vZGUubG9jYWxOYW1lID0gbmFtZTtcblx0XHRub2RlLnNwZWNpZmllZCA9IHRydWU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZUVudGl0eVJlZmVyZW5jZSA6XHRmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBFbnRpdHlSZWZlcmVuY2UoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnRcdD0gdGhpcztcblx0XHRub2RlLm5vZGVOYW1lXHQ9IG5hbWU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZUVsZW1lbnROUyA6XHRmdW5jdGlvbihuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRWxlbWVudCgpO1xuXHRcdHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuXHRcdG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS50YWdOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZVVSSTtcblx0XHRpZihwbC5sZW5ndGggPT0gMil7XG5cdFx0XHRub2RlLnByZWZpeCA9IHBsWzBdO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBwbFsxXTtcblx0XHR9ZWxzZXtcblx0XHRcdC8vZWwucHJlZml4ID0gbnVsbDtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHR9XG5cdFx0YXR0cnMuX293bmVyRWxlbWVudCA9IG5vZGU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZUF0dHJpYnV0ZU5TIDpcdGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSxxdWFsaWZpZWROYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBBdHRyKCk7XG5cdFx0dmFyIHBsID0gcXVhbGlmaWVkTmFtZS5zcGxpdCgnOicpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZVVSSTtcblx0XHRub2RlLnNwZWNpZmllZCA9IHRydWU7XG5cdFx0aWYocGwubGVuZ3RoID09IDIpe1xuXHRcdFx0bm9kZS5wcmVmaXggPSBwbFswXTtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcGxbMV07XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2VsLnByZWZpeCA9IG51bGw7XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuX2V4dGVuZHMoRG9jdW1lbnQsTm9kZSk7XG5cblxuZnVuY3Rpb24gRWxlbWVudCgpIHtcblx0dGhpcy5fbnNNYXAgPSB7fTtcbn07XG5FbGVtZW50LnByb3RvdHlwZSA9IHtcblx0bm9kZVR5cGUgOiBFTEVNRU5UX05PREUsXG5cdGhhc0F0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZU5vZGUobmFtZSkhPW51bGw7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpO1xuXHRcdHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5vZGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShuYW1lKTtcblx0fSxcblx0c2V0QXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSwgdmFsdWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSBcIlwiICsgdmFsdWU7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpXG5cdH0sXG5cdHJlbW92ZUF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpXG5cdFx0YXR0ciAmJiB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5vZGUoYXR0cik7XG5cdH0sXG5cdFxuXHQvL2ZvdXIgcmVhbCBvcGVhcnRpb24gbWV0aG9kXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHRpZihuZXdDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsbnVsbCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gX2FwcGVuZFNpbmdsZUNoaWxkKHRoaXMsbmV3Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0c2V0QXR0cmlidXRlTm9kZSA6IGZ1bmN0aW9uKG5ld0F0dHIpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKG5ld0F0dHIpO1xuXHR9LFxuXHRzZXRBdHRyaWJ1dGVOb2RlTlMgOiBmdW5jdGlvbihuZXdBdHRyKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbU5TKG5ld0F0dHIpO1xuXHR9LFxuXHRyZW1vdmVBdHRyaWJ1dGVOb2RlIDogZnVuY3Rpb24ob2xkQXR0cil7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzID09IG9sZEF0dHIub3duZXJFbGVtZW50KVxuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKG9sZEF0dHIubm9kZU5hbWUpO1xuXHR9LFxuXHQvL2dldCByZWFsIGF0dHJpYnV0ZSBuYW1lLGFuZCByZW1vdmUgaXQgYnkgcmVtb3ZlQXR0cmlidXRlTm9kZVxuXHRyZW1vdmVBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHR2YXIgb2xkID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdG9sZCAmJiB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5vZGUob2xkKTtcblx0fSxcblx0XG5cdGhhc0F0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkhPW51bGw7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lLCB2YWx1ZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcblx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSBcIlwiICsgdmFsdWU7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpXG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5vZGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKTtcblx0fSxcblx0XG5cdGdldEVsZW1lbnRzQnlUYWdOYW1lIDogZnVuY3Rpb24odGFnTmFtZSl7XG5cdFx0cmV0dXJuIG5ldyBMaXZlTm9kZUxpc3QodGhpcyxmdW5jdGlvbihiYXNlKXtcblx0XHRcdHZhciBscyA9IFtdO1xuXHRcdFx0X3Zpc2l0Tm9kZShiYXNlLGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0XHRpZihub2RlICE9PSBiYXNlICYmIG5vZGUubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFICYmICh0YWdOYW1lID09PSAnKicgfHwgbm9kZS50YWdOYW1lID09IHRhZ05hbWUpKXtcblx0XHRcdFx0XHRscy5wdXNoKG5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBscztcblx0XHR9KTtcblx0fSxcblx0Z2V0RWxlbWVudHNCeVRhZ05hbWVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHRyZXR1cm4gbmV3IExpdmVOb2RlTGlzdCh0aGlzLGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0dmFyIGxzID0gW107XG5cdFx0XHRfdmlzaXROb2RlKGJhc2UsZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRcdGlmKG5vZGUgIT09IGJhc2UgJiYgbm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFICYmIChuYW1lc3BhY2VVUkkgPT09ICcqJyB8fCBub2RlLm5hbWVzcGFjZVVSSSA9PT0gbmFtZXNwYWNlVVJJKSAmJiAobG9jYWxOYW1lID09PSAnKicgfHwgbm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lKSl7XG5cdFx0XHRcdFx0bHMucHVzaChub2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbHM7XG5cdFx0XHRcblx0XHR9KTtcblx0fVxufTtcbkRvY3VtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IEVsZW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lO1xuRG9jdW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lTlMgPSBFbGVtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TO1xuXG5cbl9leHRlbmRzKEVsZW1lbnQsTm9kZSk7XG5mdW5jdGlvbiBBdHRyKCkge1xufTtcbkF0dHIucHJvdG90eXBlLm5vZGVUeXBlID0gQVRUUklCVVRFX05PREU7XG5fZXh0ZW5kcyhBdHRyLE5vZGUpO1xuXG5cbmZ1bmN0aW9uIENoYXJhY3RlckRhdGEoKSB7XG59O1xuQ2hhcmFjdGVyRGF0YS5wcm90b3R5cGUgPSB7XG5cdGRhdGEgOiAnJyxcblx0c3Vic3RyaW5nRGF0YSA6IGZ1bmN0aW9uKG9mZnNldCwgY291bnQpIHtcblx0XHRyZXR1cm4gdGhpcy5kYXRhLnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCtjb3VudCk7XG5cdH0sXG5cdGFwcGVuZERhdGE6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHR0ZXh0ID0gdGhpcy5kYXRhK3RleHQ7XG5cdFx0dGhpcy5ub2RlVmFsdWUgPSB0aGlzLmRhdGEgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdH0sXG5cdGluc2VydERhdGE6IGZ1bmN0aW9uKG9mZnNldCx0ZXh0KSB7XG5cdFx0dGhpcy5yZXBsYWNlRGF0YShvZmZzZXQsMCx0ZXh0KTtcblx0XG5cdH0sXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoRXhjZXB0aW9uTWVzc2FnZVtISUVSQVJDSFlfUkVRVUVTVF9FUlJdKVxuXHR9LFxuXHRkZWxldGVEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50KSB7XG5cdFx0dGhpcy5yZXBsYWNlRGF0YShvZmZzZXQsY291bnQsXCJcIik7XG5cdH0sXG5cdHJlcGxhY2VEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50LCB0ZXh0KSB7XG5cdFx0dmFyIHN0YXJ0ID0gdGhpcy5kYXRhLnN1YnN0cmluZygwLG9mZnNldCk7XG5cdFx0dmFyIGVuZCA9IHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0K2NvdW50KTtcblx0XHR0ZXh0ID0gc3RhcnQgKyB0ZXh0ICsgZW5kO1xuXHRcdHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHR9XG59XG5fZXh0ZW5kcyhDaGFyYWN0ZXJEYXRhLE5vZGUpO1xuZnVuY3Rpb24gVGV4dCgpIHtcbn07XG5UZXh0LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiN0ZXh0XCIsXG5cdG5vZGVUeXBlIDogVEVYVF9OT0RFLFxuXHRzcGxpdFRleHQgOiBmdW5jdGlvbihvZmZzZXQpIHtcblx0XHR2YXIgdGV4dCA9IHRoaXMuZGF0YTtcblx0XHR2YXIgbmV3VGV4dCA9IHRleHQuc3Vic3RyaW5nKG9mZnNldCk7XG5cdFx0dGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIG9mZnNldCk7XG5cdFx0dGhpcy5kYXRhID0gdGhpcy5ub2RlVmFsdWUgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0dmFyIG5ld05vZGUgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3VGV4dCk7XG5cdFx0aWYodGhpcy5wYXJlbnROb2RlKXtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgdGhpcy5uZXh0U2libGluZyk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdOb2RlO1xuXHR9XG59XG5fZXh0ZW5kcyhUZXh0LENoYXJhY3RlckRhdGEpO1xuZnVuY3Rpb24gQ29tbWVudCgpIHtcbn07XG5Db21tZW50LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjb21tZW50XCIsXG5cdG5vZGVUeXBlIDogQ09NTUVOVF9OT0RFXG59XG5fZXh0ZW5kcyhDb21tZW50LENoYXJhY3RlckRhdGEpO1xuXG5mdW5jdGlvbiBDREFUQVNlY3Rpb24oKSB7XG59O1xuQ0RBVEFTZWN0aW9uLnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjZGF0YS1zZWN0aW9uXCIsXG5cdG5vZGVUeXBlIDogQ0RBVEFfU0VDVElPTl9OT0RFXG59XG5fZXh0ZW5kcyhDREFUQVNlY3Rpb24sQ2hhcmFjdGVyRGF0YSk7XG5cblxuZnVuY3Rpb24gRG9jdW1lbnRUeXBlKCkge1xufTtcbkRvY3VtZW50VHlwZS5wcm90b3R5cGUubm9kZVR5cGUgPSBET0NVTUVOVF9UWVBFX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudFR5cGUsTm9kZSk7XG5cbmZ1bmN0aW9uIE5vdGF0aW9uKCkge1xufTtcbk5vdGF0aW9uLnByb3RvdHlwZS5ub2RlVHlwZSA9IE5PVEFUSU9OX05PREU7XG5fZXh0ZW5kcyhOb3RhdGlvbixOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5KCkge1xufTtcbkVudGl0eS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfTk9ERTtcbl9leHRlbmRzKEVudGl0eSxOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5UmVmZXJlbmNlKCkge1xufTtcbkVudGl0eVJlZmVyZW5jZS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfUkVGRVJFTkNFX05PREU7XG5fZXh0ZW5kcyhFbnRpdHlSZWZlcmVuY2UsTm9kZSk7XG5cbmZ1bmN0aW9uIERvY3VtZW50RnJhZ21lbnQoKSB7XG59O1xuRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUubm9kZU5hbWUgPVx0XCIjZG9jdW1lbnQtZnJhZ21lbnRcIjtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVUeXBlID1cdERPQ1VNRU5UX0ZSQUdNRU5UX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudEZyYWdtZW50LE5vZGUpO1xuXG5cbmZ1bmN0aW9uIFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpIHtcbn1cblByb2Nlc3NpbmdJbnN0cnVjdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU7XG5fZXh0ZW5kcyhQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sTm9kZSk7XG5mdW5jdGlvbiBYTUxTZXJpYWxpemVyKCl7fVxuWE1MU2VyaWFsaXplci5wcm90b3R5cGUuc2VyaWFsaXplVG9TdHJpbmcgPSBmdW5jdGlvbihub2RlLGlzSHRtbCxub2RlRmlsdGVyKXtcblx0cmV0dXJuIG5vZGVTZXJpYWxpemVUb1N0cmluZy5jYWxsKG5vZGUsaXNIdG1sLG5vZGVGaWx0ZXIpO1xufVxuTm9kZS5wcm90b3R5cGUudG9TdHJpbmcgPSBub2RlU2VyaWFsaXplVG9TdHJpbmc7XG5mdW5jdGlvbiBub2RlU2VyaWFsaXplVG9TdHJpbmcoaXNIdG1sLG5vZGVGaWx0ZXIpe1xuXHR2YXIgYnVmID0gW107XG5cdHZhciByZWZOb2RlID0gdGhpcy5ub2RlVHlwZSA9PSA5P3RoaXMuZG9jdW1lbnRFbGVtZW50OnRoaXM7XG5cdHZhciBwcmVmaXggPSByZWZOb2RlLnByZWZpeDtcblx0dmFyIHVyaSA9IHJlZk5vZGUubmFtZXNwYWNlVVJJO1xuXHRcblx0aWYodXJpICYmIHByZWZpeCA9PSBudWxsKXtcblx0XHQvL2NvbnNvbGUubG9nKHByZWZpeClcblx0XHR2YXIgcHJlZml4ID0gcmVmTm9kZS5sb29rdXBQcmVmaXgodXJpKTtcblx0XHRpZihwcmVmaXggPT0gbnVsbCl7XG5cdFx0XHQvL2lzSFRNTCA9IHRydWU7XG5cdFx0XHR2YXIgdmlzaWJsZU5hbWVzcGFjZXM9W1xuXHRcdFx0e25hbWVzcGFjZTp1cmkscHJlZml4Om51bGx9XG5cdFx0XHQvL3tuYW1lc3BhY2U6dXJpLHByZWZpeDonJ31cblx0XHRcdF1cblx0XHR9XG5cdH1cblx0c2VyaWFsaXplVG9TdHJpbmcodGhpcyxidWYsaXNIdG1sLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHQvL2NvbnNvbGUubG9nKCcjIyMnLHRoaXMubm9kZVR5cGUsdXJpLHByZWZpeCxidWYuam9pbignJykpXG5cdHJldHVybiBidWYuam9pbignJyk7XG59XG5mdW5jdGlvbiBuZWVkTmFtZXNwYWNlRGVmaW5lKG5vZGUsaXNIVE1MLCB2aXNpYmxlTmFtZXNwYWNlcykge1xuXHR2YXIgcHJlZml4ID0gbm9kZS5wcmVmaXh8fCcnO1xuXHR2YXIgdXJpID0gbm9kZS5uYW1lc3BhY2VVUkk7XG5cdGlmICghcHJlZml4ICYmICF1cmkpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAocHJlZml4ID09PSBcInhtbFwiICYmIHVyaSA9PT0gXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIiBcblx0XHR8fCB1cmkgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdFxuXHR2YXIgaSA9IHZpc2libGVOYW1lc3BhY2VzLmxlbmd0aCBcblx0Ly9jb25zb2xlLmxvZygnQEBAQCcsbm9kZS50YWdOYW1lLHByZWZpeCx1cmksdmlzaWJsZU5hbWVzcGFjZXMpXG5cdHdoaWxlIChpLS0pIHtcblx0XHR2YXIgbnMgPSB2aXNpYmxlTmFtZXNwYWNlc1tpXTtcblx0XHQvLyBnZXQgbmFtZXNwYWNlIHByZWZpeFxuXHRcdC8vY29uc29sZS5sb2cobm9kZS5ub2RlVHlwZSxub2RlLnRhZ05hbWUsbnMucHJlZml4LHByZWZpeClcblx0XHRpZiAobnMucHJlZml4ID09IHByZWZpeCl7XG5cdFx0XHRyZXR1cm4gbnMubmFtZXNwYWNlICE9IHVyaTtcblx0XHR9XG5cdH1cblx0Ly9jb25zb2xlLmxvZyhpc0hUTUwsdXJpLHByZWZpeD09JycpXG5cdC8vaWYoaXNIVE1MICYmIHByZWZpeCA9PW51bGwgJiYgdXJpID09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyl7XG5cdC8vXHRyZXR1cm4gZmFsc2U7XG5cdC8vfVxuXHQvL25vZGUuZmxhZyA9ICcxMTExMSdcblx0Ly9jb25zb2xlLmVycm9yKDMsdHJ1ZSxub2RlLmZsYWcsbm9kZS5wcmVmaXgsbm9kZS5uYW1lc3BhY2VVUkkpXG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplVG9TdHJpbmcobm9kZSxidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpe1xuXHRpZihub2RlRmlsdGVyKXtcblx0XHRub2RlID0gbm9kZUZpbHRlcihub2RlKTtcblx0XHRpZihub2RlKXtcblx0XHRcdGlmKHR5cGVvZiBub2RlID09ICdzdHJpbmcnKXtcblx0XHRcdFx0YnVmLnB1c2gobm9kZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly9idWYuc29ydC5hcHBseShhdHRycywgYXR0cmlidXRlU29ydGVyKTtcblx0fVxuXHRzd2l0Y2gobm9kZS5ub2RlVHlwZSl7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdGlmICghdmlzaWJsZU5hbWVzcGFjZXMpIHZpc2libGVOYW1lc3BhY2VzID0gW107XG5cdFx0dmFyIHN0YXJ0VmlzaWJsZU5hbWVzcGFjZXMgPSB2aXNpYmxlTmFtZXNwYWNlcy5sZW5ndGg7XG5cdFx0dmFyIGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXHRcdHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHZhciBub2RlTmFtZSA9IG5vZGUudGFnTmFtZTtcblx0XHRcblx0XHRpc0hUTUwgPSAgKGh0bWxucyA9PT0gbm9kZS5uYW1lc3BhY2VVUkkpIHx8aXNIVE1MIFxuXHRcdGJ1Zi5wdXNoKCc8Jyxub2RlTmFtZSk7XG5cdFx0XG5cdFx0XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdC8vIGFkZCBuYW1lc3BhY2VzIGZvciBhdHRyaWJ1dGVzXG5cdFx0XHR2YXIgYXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRpZiAoYXR0ci5wcmVmaXggPT0gJ3htbG5zJykge1xuXHRcdFx0XHR2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHsgcHJlZml4OiBhdHRyLmxvY2FsTmFtZSwgbmFtZXNwYWNlOiBhdHRyLnZhbHVlIH0pO1xuXHRcdFx0fWVsc2UgaWYoYXR0ci5ub2RlTmFtZSA9PSAneG1sbnMnKXtcblx0XHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogJycsIG5hbWVzcGFjZTogYXR0ci52YWx1ZSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdHZhciBhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdGlmIChuZWVkTmFtZXNwYWNlRGVmaW5lKGF0dHIsaXNIVE1MLCB2aXNpYmxlTmFtZXNwYWNlcykpIHtcblx0XHRcdFx0dmFyIHByZWZpeCA9IGF0dHIucHJlZml4fHwnJztcblx0XHRcdFx0dmFyIHVyaSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXHRcdFx0XHR2YXIgbnMgPSBwcmVmaXggPyAnIHhtbG5zOicgKyBwcmVmaXggOiBcIiB4bWxuc1wiO1xuXHRcdFx0XHRidWYucHVzaChucywgJz1cIicgLCB1cmkgLCAnXCInKTtcblx0XHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogcHJlZml4LCBuYW1lc3BhY2U6dXJpIH0pO1xuXHRcdFx0fVxuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoYXR0cixidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHRcdH1cblx0XHQvLyBhZGQgbmFtZXNwYWNlIGZvciBjdXJyZW50IG5vZGVcdFx0XG5cdFx0aWYgKG5lZWROYW1lc3BhY2VEZWZpbmUobm9kZSxpc0hUTUwsIHZpc2libGVOYW1lc3BhY2VzKSkge1xuXHRcdFx0dmFyIHByZWZpeCA9IG5vZGUucHJlZml4fHwnJztcblx0XHRcdHZhciB1cmkgPSBub2RlLm5hbWVzcGFjZVVSSTtcblx0XHRcdHZhciBucyA9IHByZWZpeCA/ICcgeG1sbnM6JyArIHByZWZpeCA6IFwiIHhtbG5zXCI7XG5cdFx0XHRidWYucHVzaChucywgJz1cIicgLCB1cmkgLCAnXCInKTtcblx0XHRcdHZpc2libGVOYW1lc3BhY2VzLnB1c2goeyBwcmVmaXg6IHByZWZpeCwgbmFtZXNwYWNlOnVyaSB9KTtcblx0XHR9XG5cdFx0XG5cdFx0aWYoY2hpbGQgfHwgaXNIVE1MICYmICEvXig/Om1ldGF8bGlua3xpbWd8YnJ8aHJ8aW5wdXQpJC9pLnRlc3Qobm9kZU5hbWUpKXtcblx0XHRcdGJ1Zi5wdXNoKCc+Jyk7XG5cdFx0XHQvL2lmIGlzIGNkYXRhIGNoaWxkIG5vZGVcblx0XHRcdGlmKGlzSFRNTCAmJiAvXnNjcmlwdCQvaS50ZXN0KG5vZGVOYW1lKSl7XG5cdFx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0XHRpZihjaGlsZC5kYXRhKXtcblx0XHRcdFx0XHRcdGJ1Zi5wdXNoKGNoaWxkLmRhdGEpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoY2hpbGQsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2Vcblx0XHRcdHtcblx0XHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goJzwvJyxub2RlTmFtZSwnPicpO1xuXHRcdH1lbHNle1xuXHRcdFx0YnVmLnB1c2goJy8+Jyk7XG5cdFx0fVxuXHRcdC8vIHJlbW92ZSBhZGRlZCB2aXNpYmxlIG5hbWVzcGFjZXNcblx0XHQvL3Zpc2libGVOYW1lc3BhY2VzLmxlbmd0aCA9IHN0YXJ0VmlzaWJsZU5hbWVzcGFjZXM7XG5cdFx0cmV0dXJuO1xuXHRjYXNlIERPQ1VNRU5UX05PREU6XG5cdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoY2hpbGQsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHRcdHJldHVybjtcblx0Y2FzZSBBVFRSSUJVVEVfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goJyAnLG5vZGUubmFtZSwnPVwiJyxub2RlLnZhbHVlLnJlcGxhY2UoL1s8JlwiXS9nLF94bWxFbmNvZGVyKSwnXCInKTtcblx0Y2FzZSBURVhUX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKG5vZGUuZGF0YS5yZXBsYWNlKC9bPCZdL2csX3htbEVuY29kZXIpKTtcblx0Y2FzZSBDREFUQV9TRUNUSU9OX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCAnPCFbQ0RBVEFbJyxub2RlLmRhdGEsJ11dPicpO1xuXHRjYXNlIENPTU1FTlRfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goIFwiPCEtLVwiLG5vZGUuZGF0YSxcIi0tPlwiKTtcblx0Y2FzZSBET0NVTUVOVF9UWVBFX05PREU6XG5cdFx0dmFyIHB1YmlkID0gbm9kZS5wdWJsaWNJZDtcblx0XHR2YXIgc3lzaWQgPSBub2RlLnN5c3RlbUlkO1xuXHRcdGJ1Zi5wdXNoKCc8IURPQ1RZUEUgJyxub2RlLm5hbWUpO1xuXHRcdGlmKHB1YmlkKXtcblx0XHRcdGJ1Zi5wdXNoKCcgUFVCTElDIFwiJyxwdWJpZCk7XG5cdFx0XHRpZiAoc3lzaWQgJiYgc3lzaWQhPScuJykge1xuXHRcdFx0XHRidWYucHVzaCggJ1wiIFwiJyxzeXNpZCk7XG5cdFx0XHR9XG5cdFx0XHRidWYucHVzaCgnXCI+Jyk7XG5cdFx0fWVsc2UgaWYoc3lzaWQgJiYgc3lzaWQhPScuJyl7XG5cdFx0XHRidWYucHVzaCgnIFNZU1RFTSBcIicsc3lzaWQsJ1wiPicpO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHN1YiA9IG5vZGUuaW50ZXJuYWxTdWJzZXQ7XG5cdFx0XHRpZihzdWIpe1xuXHRcdFx0XHRidWYucHVzaChcIiBbXCIsc3ViLFwiXVwiKTtcblx0XHRcdH1cblx0XHRcdGJ1Zi5wdXNoKFwiPlwiKTtcblx0XHR9XG5cdFx0cmV0dXJuO1xuXHRjYXNlIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goIFwiPD9cIixub2RlLnRhcmdldCxcIiBcIixub2RlLmRhdGEsXCI/PlwiKTtcblx0Y2FzZSBFTlRJVFlfUkVGRVJFTkNFX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCAnJicsbm9kZS5ub2RlTmFtZSwnOycpO1xuXHQvL2Nhc2UgRU5USVRZX05PREU6XG5cdC8vY2FzZSBOT1RBVElPTl9OT0RFOlxuXHRkZWZhdWx0OlxuXHRcdGJ1Zi5wdXNoKCc/Pycsbm9kZS5ub2RlTmFtZSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGltcG9ydE5vZGUoZG9jLG5vZGUsZGVlcCl7XG5cdHZhciBub2RlMjtcblx0c3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdG5vZGUyID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpO1xuXHRcdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdFx0Ly92YXIgYXR0cnMgPSBub2RlMi5hdHRyaWJ1dGVzO1xuXHRcdC8vdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcblx0XHQvL2Zvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHQvL25vZGUyLnNldEF0dHJpYnV0ZU5vZGVOUyhpbXBvcnROb2RlKGRvYyxhdHRycy5pdGVtKGkpLGRlZXApKTtcblx0XHQvL31cblx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdGJyZWFrO1xuXHRjYXNlIEFUVFJJQlVURV9OT0RFOlxuXHRcdGRlZXAgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXHQvL2Nhc2UgRU5USVRZX1JFRkVSRU5DRV9OT0RFOlxuXHQvL2Nhc2UgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFOlxuXHQvLy8vY2FzZSBURVhUX05PREU6XG5cdC8vY2FzZSBDREFUQV9TRUNUSU9OX05PREU6XG5cdC8vY2FzZSBDT01NRU5UX05PREU6XG5cdC8vXHRkZWVwID0gZmFsc2U7XG5cdC8vXHRicmVhaztcblx0Ly9jYXNlIERPQ1VNRU5UX05PREU6XG5cdC8vY2FzZSBET0NVTUVOVF9UWVBFX05PREU6XG5cdC8vY2Fubm90IGJlIGltcG9ydGVkLlxuXHQvL2Nhc2UgRU5USVRZX05PREU6XG5cdC8vY2FzZSBOT1RBVElPTl9OT0RF77yaXG5cdC8vY2FuIG5vdCBoaXQgaW4gbGV2ZWwzXG5cdC8vZGVmYXVsdDp0aHJvdyBlO1xuXHR9XG5cdGlmKCFub2RlMil7XG5cdFx0bm9kZTIgPSBub2RlLmNsb25lTm9kZShmYWxzZSk7Ly9mYWxzZVxuXHR9XG5cdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdG5vZGUyLnBhcmVudE5vZGUgPSBudWxsO1xuXHRpZihkZWVwKXtcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0bm9kZTIuYXBwZW5kQ2hpbGQoaW1wb3J0Tm9kZShkb2MsY2hpbGQsZGVlcCkpO1xuXHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGUyO1xufVxuLy9cbi8vdmFyIF9yZWxhdGlvbk1hcCA9IHtmaXJzdENoaWxkOjEsbGFzdENoaWxkOjEscHJldmlvdXNTaWJsaW5nOjEsbmV4dFNpYmxpbmc6MSxcbi8vXHRcdFx0XHRcdGF0dHJpYnV0ZXM6MSxjaGlsZE5vZGVzOjEscGFyZW50Tm9kZToxLGRvY3VtZW50RWxlbWVudDoxLGRvY3R5cGUsfTtcbmZ1bmN0aW9uIGNsb25lTm9kZShkb2Msbm9kZSxkZWVwKXtcblx0dmFyIG5vZGUyID0gbmV3IG5vZGUuY29uc3RydWN0b3IoKTtcblx0Zm9yKHZhciBuIGluIG5vZGUpe1xuXHRcdHZhciB2ID0gbm9kZVtuXTtcblx0XHRpZih0eXBlb2YgdiAhPSAnb2JqZWN0JyApe1xuXHRcdFx0aWYodiAhPSBub2RlMltuXSl7XG5cdFx0XHRcdG5vZGUyW25dID0gdjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYobm9kZS5jaGlsZE5vZGVzKXtcblx0XHRub2RlMi5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdH1cblx0bm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblx0c3dpdGNoIChub2RlMi5ub2RlVHlwZSkge1xuXHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzO1xuXHRcdHZhciBhdHRyczJcdD0gbm9kZTIuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHR2YXIgbGVuID0gYXR0cnMubGVuZ3RoXG5cdFx0YXR0cnMyLl9vd25lckVsZW1lbnQgPSBub2RlMjtcblx0XHRmb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0bm9kZTIuc2V0QXR0cmlidXRlTm9kZShjbG9uZU5vZGUoZG9jLGF0dHJzLml0ZW0oaSksdHJ1ZSkpO1xuXHRcdH1cblx0XHRicmVhazs7XG5cdGNhc2UgQVRUUklCVVRFX05PREU6XG5cdFx0ZGVlcCA9IHRydWU7XG5cdH1cblx0aWYoZGVlcCl7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdG5vZGUyLmFwcGVuZENoaWxkKGNsb25lTm9kZShkb2MsY2hpbGQsZGVlcCkpO1xuXHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGUyO1xufVxuXG5mdW5jdGlvbiBfX3NldF9fKG9iamVjdCxrZXksdmFsdWUpe1xuXHRvYmplY3Rba2V5XSA9IHZhbHVlXG59XG4vL2RvIGR5bmFtaWNcbnRyeXtcblx0aWYoT2JqZWN0LmRlZmluZVByb3BlcnR5KXtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoTGl2ZU5vZGVMaXN0LnByb3RvdHlwZSwnbGVuZ3RoJyx7XG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0X3VwZGF0ZUxpdmVMaXN0KHRoaXMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kJGxlbmd0aDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsJ3RleHRDb250ZW50Jyx7XG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIGdldFRleHRDb250ZW50KHRoaXMpO1xuXHRcdFx0fSxcblx0XHRcdHNldDpmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0c3dpdGNoKHRoaXMubm9kZVR5cGUpe1xuXHRcdFx0XHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRcdFx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdFx0XHRcdHdoaWxlKHRoaXMuZmlyc3RDaGlsZCl7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGRhdGEgfHwgU3RyaW5nKGRhdGEpKXtcblx0XHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9UT0RPOlxuXHRcdFx0XHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IGRhdGE7XG5cdFx0XHRcdFx0dGhpcy5ub2RlVmFsdWUgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRcblx0XHRmdW5jdGlvbiBnZXRUZXh0Q29udGVudChub2RlKXtcblx0XHRcdHN3aXRjaChub2RlLm5vZGVUeXBlKXtcblx0XHRcdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdFx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdFx0XHR2YXIgYnVmID0gW107XG5cdFx0XHRcdG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0XHRcdHdoaWxlKG5vZGUpe1xuXHRcdFx0XHRcdGlmKG5vZGUubm9kZVR5cGUhPT03ICYmIG5vZGUubm9kZVR5cGUgIT09OCl7XG5cdFx0XHRcdFx0XHRidWYucHVzaChnZXRUZXh0Q29udGVudChub2RlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBidWYuam9pbignJyk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9fc2V0X18gPSBmdW5jdGlvbihvYmplY3Qsa2V5LHZhbHVlKXtcblx0XHRcdC8vY29uc29sZS5sb2codmFsdWUpXG5cdFx0XHRvYmplY3RbJyQkJytrZXldID0gdmFsdWVcblx0XHR9XG5cdH1cbn1jYXRjaChlKXsvL2llOFxufVxuXG4vL2lmKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpe1xuXHRleHBvcnRzLkRPTUltcGxlbWVudGF0aW9uID0gRE9NSW1wbGVtZW50YXRpb247XG5cdGV4cG9ydHMuWE1MU2VyaWFsaXplciA9IFhNTFNlcmlhbGl6ZXI7XG4vL31cbiIsIi8vWzRdICAgXHROYW1lU3RhcnRDaGFyXHQgICA6Oj0gICBcdFwiOlwiIHwgW0EtWl0gfCBcIl9cIiB8IFthLXpdIHwgWyN4QzAtI3hENl0gfCBbI3hEOC0jeEY2XSB8IFsjeEY4LSN4MkZGXSB8IFsjeDM3MC0jeDM3RF0gfCBbI3gzN0YtI3gxRkZGXSB8IFsjeDIwMEMtI3gyMDBEXSB8IFsjeDIwNzAtI3gyMThGXSB8IFsjeDJDMDAtI3gyRkVGXSB8IFsjeDMwMDEtI3hEN0ZGXSB8IFsjeEY5MDAtI3hGRENGXSB8IFsjeEZERjAtI3hGRkZEXSB8IFsjeDEwMDAwLSN4RUZGRkZdXHJcbi8vWzRhXSAgIFx0TmFtZUNoYXJcdCAgIDo6PSAgIFx0TmFtZVN0YXJ0Q2hhciB8IFwiLVwiIHwgXCIuXCIgfCBbMC05XSB8ICN4QjcgfCBbI3gwMzAwLSN4MDM2Rl0gfCBbI3gyMDNGLSN4MjA0MF1cclxuLy9bNV0gICBcdE5hbWVcdCAgIDo6PSAgIFx0TmFtZVN0YXJ0Q2hhciAoTmFtZUNoYXIpKlxyXG52YXIgbmFtZVN0YXJ0Q2hhciA9IC9bQS1aX2EtelxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdLy8vXFx1MTAwMDAtXFx1RUZGRkZcclxudmFyIG5hbWVDaGFyID0gbmV3IFJlZ0V4cChcIltcXFxcLVxcXFwuMC05XCIrbmFtZVN0YXJ0Q2hhci5zb3VyY2Uuc2xpY2UoMSwtMSkrXCJcXFxcdTAwQjdcXFxcdTAzMDAtXFxcXHUwMzZGXFxcXHUyMDNGLVxcXFx1MjA0MF1cIik7XHJcbnZhciB0YWdOYW1lUGF0dGVybiA9IG5ldyBSZWdFeHAoJ14nK25hbWVTdGFydENoYXIuc291cmNlK25hbWVDaGFyLnNvdXJjZSsnKig/OlxcOicrbmFtZVN0YXJ0Q2hhci5zb3VyY2UrbmFtZUNoYXIuc291cmNlKycqKT8kJyk7XHJcbi8vdmFyIHRhZ05hbWVQYXR0ZXJuID0gL15bYS16QS1aX11bXFx3XFwtXFwuXSooPzpcXDpbYS16QS1aX11bXFx3XFwtXFwuXSopPyQvXHJcbi8vdmFyIGhhbmRsZXJzID0gJ3Jlc29sdmVFbnRpdHksZ2V0RXh0ZXJuYWxTdWJzZXQsY2hhcmFjdGVycyxlbmREb2N1bWVudCxlbmRFbGVtZW50LGVuZFByZWZpeE1hcHBpbmcsaWdub3JhYmxlV2hpdGVzcGFjZSxwcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sc2V0RG9jdW1lbnRMb2NhdG9yLHNraXBwZWRFbnRpdHksc3RhcnREb2N1bWVudCxzdGFydEVsZW1lbnQsc3RhcnRQcmVmaXhNYXBwaW5nLG5vdGF0aW9uRGVjbCx1bnBhcnNlZEVudGl0eURlY2wsZXJyb3IsZmF0YWxFcnJvcix3YXJuaW5nLGF0dHJpYnV0ZURlY2wsZWxlbWVudERlY2wsZXh0ZXJuYWxFbnRpdHlEZWNsLGludGVybmFsRW50aXR5RGVjbCxjb21tZW50LGVuZENEQVRBLGVuZERURCxlbmRFbnRpdHksc3RhcnRDREFUQSxzdGFydERURCxzdGFydEVudGl0eScuc3BsaXQoJywnKVxyXG5cclxuLy9TX1RBRyxcdFNfQVRUUixcdFNfRVEsXHRTX0FUVFJfTk9RVU9UX1ZBTFVFXHJcbi8vU19BVFRSX1NQQUNFLFx0U19BVFRSX0VORCxcdFNfVEFHX1NQQUNFLCBTX1RBR19DTE9TRVxyXG52YXIgU19UQUcgPSAwOy8vdGFnIG5hbWUgb2ZmZXJyaW5nXHJcbnZhciBTX0FUVFIgPSAxOy8vYXR0ciBuYW1lIG9mZmVycmluZyBcclxudmFyIFNfQVRUUl9TUEFDRT0yOy8vYXR0ciBuYW1lIGVuZCBhbmQgc3BhY2Ugb2ZmZXJcclxudmFyIFNfRVEgPSAzOy8vPXNwYWNlP1xyXG52YXIgU19BVFRSX05PUVVPVF9WQUxVRSA9IDQ7Ly9hdHRyIHZhbHVlKG5vIHF1b3QgdmFsdWUgb25seSlcclxudmFyIFNfQVRUUl9FTkQgPSA1Oy8vYXR0ciB2YWx1ZSBlbmQgYW5kIG5vIHNwYWNlKHF1b3QgZW5kKVxyXG52YXIgU19UQUdfU1BBQ0UgPSA2Oy8vKGF0dHIgdmFsdWUgZW5kIHx8IHRhZyBlbmQgKSAmJiAoc3BhY2Ugb2ZmZXIpXHJcbnZhciBTX1RBR19DTE9TRSA9IDc7Ly9jbG9zZWQgZWw8ZWwgLz5cclxuXHJcbmZ1bmN0aW9uIFhNTFJlYWRlcigpe1xyXG5cdFxyXG59XHJcblxyXG5YTUxSZWFkZXIucHJvdG90eXBlID0ge1xyXG5cdHBhcnNlOmZ1bmN0aW9uKHNvdXJjZSxkZWZhdWx0TlNNYXAsZW50aXR5TWFwKXtcclxuXHRcdHZhciBkb21CdWlsZGVyID0gdGhpcy5kb21CdWlsZGVyO1xyXG5cdFx0ZG9tQnVpbGRlci5zdGFydERvY3VtZW50KCk7XHJcblx0XHRfY29weShkZWZhdWx0TlNNYXAgLGRlZmF1bHROU01hcCA9IHt9KVxyXG5cdFx0cGFyc2Uoc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXAsXHJcblx0XHRcdFx0ZG9tQnVpbGRlcix0aGlzLmVycm9ySGFuZGxlcik7XHJcblx0XHRkb21CdWlsZGVyLmVuZERvY3VtZW50KCk7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHNvdXJjZSxkZWZhdWx0TlNNYXBDb3B5LGVudGl0eU1hcCxkb21CdWlsZGVyLGVycm9ySGFuZGxlcil7XHJcblx0ZnVuY3Rpb24gZml4ZWRGcm9tQ2hhckNvZGUoY29kZSkge1xyXG5cdFx0Ly8gU3RyaW5nLnByb3RvdHlwZS5mcm9tQ2hhckNvZGUgZG9lcyBub3Qgc3VwcG9ydHNcclxuXHRcdC8vID4gMiBieXRlcyB1bmljb2RlIGNoYXJzIGRpcmVjdGx5XHJcblx0XHRpZiAoY29kZSA+IDB4ZmZmZikge1xyXG5cdFx0XHRjb2RlIC09IDB4MTAwMDA7XHJcblx0XHRcdHZhciBzdXJyb2dhdGUxID0gMHhkODAwICsgKGNvZGUgPj4gMTApXHJcblx0XHRcdFx0LCBzdXJyb2dhdGUyID0gMHhkYzAwICsgKGNvZGUgJiAweDNmZik7XHJcblxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdXJyb2dhdGUxLCBzdXJyb2dhdGUyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBlbnRpdHlSZXBsYWNlcihhKXtcclxuXHRcdHZhciBrID0gYS5zbGljZSgxLC0xKTtcclxuXHRcdGlmKGsgaW4gZW50aXR5TWFwKXtcclxuXHRcdFx0cmV0dXJuIGVudGl0eU1hcFtrXTsgXHJcblx0XHR9ZWxzZSBpZihrLmNoYXJBdCgwKSA9PT0gJyMnKXtcclxuXHRcdFx0cmV0dXJuIGZpeGVkRnJvbUNoYXJDb2RlKHBhcnNlSW50KGsuc3Vic3RyKDEpLnJlcGxhY2UoJ3gnLCcweCcpKSlcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ2VudGl0eSBub3QgZm91bmQ6JythKTtcclxuXHRcdFx0cmV0dXJuIGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFwcGVuZFRleHQoZW5kKXsvL2hhcyBzb21lIGJ1Z3NcclxuXHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdHZhciB4dCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0bG9jYXRvciYmcG9zaXRpb24oc3RhcnQpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnMoeHQsMCxlbmQtc3RhcnQpO1xyXG5cdFx0XHRzdGFydCA9IGVuZFxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBwb3NpdGlvbihwLG0pe1xyXG5cdFx0d2hpbGUocD49bGluZUVuZCAmJiAobSA9IGxpbmVQYXR0ZXJuLmV4ZWMoc291cmNlKSkpe1xyXG5cdFx0XHRsaW5lU3RhcnQgPSBtLmluZGV4O1xyXG5cdFx0XHRsaW5lRW5kID0gbGluZVN0YXJ0ICsgbVswXS5sZW5ndGg7XHJcblx0XHRcdGxvY2F0b3IubGluZU51bWJlcisrO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdsaW5lKys6Jyxsb2NhdG9yLHN0YXJ0UG9zLGVuZFBvcylcclxuXHRcdH1cclxuXHRcdGxvY2F0b3IuY29sdW1uTnVtYmVyID0gcC1saW5lU3RhcnQrMTtcclxuXHR9XHJcblx0dmFyIGxpbmVTdGFydCA9IDA7XHJcblx0dmFyIGxpbmVFbmQgPSAwO1xyXG5cdHZhciBsaW5lUGF0dGVybiA9IC8uKig/Olxcclxcbj98XFxuKXwuKiQvZ1xyXG5cdHZhciBsb2NhdG9yID0gZG9tQnVpbGRlci5sb2NhdG9yO1xyXG5cdFxyXG5cdHZhciBwYXJzZVN0YWNrID0gW3tjdXJyZW50TlNNYXA6ZGVmYXVsdE5TTWFwQ29weX1dXHJcblx0dmFyIGNsb3NlTWFwID0ge307XHJcblx0dmFyIHN0YXJ0ID0gMDtcclxuXHR3aGlsZSh0cnVlKXtcclxuXHRcdHRyeXtcclxuXHRcdFx0dmFyIHRhZ1N0YXJ0ID0gc291cmNlLmluZGV4T2YoJzwnLHN0YXJ0KTtcclxuXHRcdFx0aWYodGFnU3RhcnQ8MCl7XHJcblx0XHRcdFx0aWYoIXNvdXJjZS5zdWJzdHIoc3RhcnQpLm1hdGNoKC9eXFxzKiQvKSl7XHJcblx0XHRcdFx0XHR2YXIgZG9jID0gZG9tQnVpbGRlci5kb2M7XHJcblx0ICAgIFx0XHRcdHZhciB0ZXh0ID0gZG9jLmNyZWF0ZVRleHROb2RlKHNvdXJjZS5zdWJzdHIoc3RhcnQpKTtcclxuXHQgICAgXHRcdFx0ZG9jLmFwcGVuZENoaWxkKHRleHQpO1xyXG5cdCAgICBcdFx0XHRkb21CdWlsZGVyLmN1cnJlbnRFbGVtZW50ID0gdGV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRhZ1N0YXJ0PnN0YXJ0KXtcclxuXHRcdFx0XHRhcHBlbmRUZXh0KHRhZ1N0YXJ0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzd2l0Y2goc291cmNlLmNoYXJBdCh0YWdTdGFydCsxKSl7XHJcblx0XHRcdGNhc2UgJy8nOlxyXG5cdFx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignPicsdGFnU3RhcnQrMyk7XHJcblx0XHRcdFx0dmFyIHRhZ05hbWUgPSBzb3VyY2Uuc3Vic3RyaW5nKHRhZ1N0YXJ0KzIsZW5kKTtcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gcGFyc2VTdGFjay5wb3AoKTtcclxuXHRcdFx0XHRpZihlbmQ8MCl7XHJcblx0XHRcdFx0XHRcclxuXHQgICAgICAgIFx0XHR0YWdOYW1lID0gc291cmNlLnN1YnN0cmluZyh0YWdTdGFydCsyKS5yZXBsYWNlKC9bXFxzPF0uKi8sJycpO1xyXG5cdCAgICAgICAgXHRcdC8vY29uc29sZS5lcnJvcignI0BAQEBAQCcrdGFnTmFtZSlcclxuXHQgICAgICAgIFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoXCJlbmQgdGFnIG5hbWU6IFwiK3RhZ05hbWUrJyBpcyBub3QgY29tcGxldGU6Jytjb25maWcudGFnTmFtZSk7XHJcblx0ICAgICAgICBcdFx0ZW5kID0gdGFnU3RhcnQrMSt0YWdOYW1lLmxlbmd0aDtcclxuXHQgICAgICAgIFx0fWVsc2UgaWYodGFnTmFtZS5tYXRjaCgvXFxzPC8pKXtcclxuXHQgICAgICAgIFx0XHR0YWdOYW1lID0gdGFnTmFtZS5yZXBsYWNlKC9bXFxzPF0uKi8sJycpO1xyXG5cdCAgICAgICAgXHRcdGVycm9ySGFuZGxlci5lcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIG1heWJlIG5vdCBjb21wbGV0ZScpO1xyXG5cdCAgICAgICAgXHRcdGVuZCA9IHRhZ1N0YXJ0KzErdGFnTmFtZS5sZW5ndGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihwYXJzZVN0YWNrLmxlbmd0aCxwYXJzZVN0YWNrKVxyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihjb25maWcpO1xyXG5cdFx0XHRcdHZhciBsb2NhbE5TTWFwID0gY29uZmlnLmxvY2FsTlNNYXA7XHJcblx0XHRcdFx0dmFyIGVuZE1hdGNoID0gY29uZmlnLnRhZ05hbWUgPT0gdGFnTmFtZTtcclxuXHRcdFx0XHR2YXIgZW5kSWdub3JlQ2FzZU1hY2ggPSBlbmRNYXRjaCB8fCBjb25maWcudGFnTmFtZSYmY29uZmlnLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSB0YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuXHRcdCAgICAgICAgaWYoZW5kSWdub3JlQ2FzZU1hY2gpe1xyXG5cdFx0ICAgICAgICBcdGRvbUJ1aWxkZXIuZW5kRWxlbWVudChjb25maWcudXJpLGNvbmZpZy5sb2NhbE5hbWUsdGFnTmFtZSk7XHJcblx0XHRcdFx0XHRpZihsb2NhbE5TTWFwKXtcclxuXHRcdFx0XHRcdFx0Zm9yKHZhciBwcmVmaXggaW4gbG9jYWxOU01hcCl7XHJcblx0XHRcdFx0XHRcdFx0ZG9tQnVpbGRlci5lbmRQcmVmaXhNYXBwaW5nKHByZWZpeCkgO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZighZW5kTWF0Y2gpe1xyXG5cdFx0ICAgICAgICAgICAgXHRlcnJvckhhbmRsZXIuZmF0YWxFcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIGlzIG5vdCBtYXRjaCB0aGUgY3VycmVudCBzdGFydCB0YWdOYW1lOicrY29uZmlnLnRhZ05hbWUgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdCAgICAgICAgfWVsc2V7XHJcblx0XHQgICAgICAgIFx0cGFyc2VTdGFjay5wdXNoKGNvbmZpZylcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGVuZCsrO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdC8vIGVuZCBlbG1lbnRcclxuXHRcdFx0Y2FzZSAnPyc6Ly8gPD8uLi4/PlxyXG5cdFx0XHRcdGxvY2F0b3ImJnBvc2l0aW9uKHRhZ1N0YXJ0KTtcclxuXHRcdFx0XHRlbmQgPSBwYXJzZUluc3RydWN0aW9uKHNvdXJjZSx0YWdTdGFydCxkb21CdWlsZGVyKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnISc6Ly8gPCFkb2N0eXBlLDwhW0NEQVRBLDwhLS1cclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbih0YWdTdGFydCk7XHJcblx0XHRcdFx0ZW5kID0gcGFyc2VEQ0Moc291cmNlLHRhZ1N0YXJ0LGRvbUJ1aWxkZXIsZXJyb3JIYW5kbGVyKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbih0YWdTdGFydCk7XHJcblx0XHRcdFx0dmFyIGVsID0gbmV3IEVsZW1lbnRBdHRyaWJ1dGVzKCk7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnROU01hcCA9IHBhcnNlU3RhY2tbcGFyc2VTdGFjay5sZW5ndGgtMV0uY3VycmVudE5TTWFwO1xyXG5cdFx0XHRcdC8vZWxTdGFydEVuZFxyXG5cdFx0XHRcdHZhciBlbmQgPSBwYXJzZUVsZW1lbnRTdGFydFBhcnQoc291cmNlLHRhZ1N0YXJ0LGVsLGN1cnJlbnROU01hcCxlbnRpdHlSZXBsYWNlcixlcnJvckhhbmRsZXIpO1xyXG5cdFx0XHRcdHZhciBsZW4gPSBlbC5sZW5ndGg7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIWVsLmNsb3NlZCAmJiBmaXhTZWxmQ2xvc2VkKHNvdXJjZSxlbmQsZWwudGFnTmFtZSxjbG9zZU1hcCkpe1xyXG5cdFx0XHRcdFx0ZWwuY2xvc2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGlmKCFlbnRpdHlNYXAubmJzcCl7XHJcblx0XHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCd1bmNsb3NlZCB4bWwgYXR0cmlidXRlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvY2F0b3IgJiYgbGVuKXtcclxuXHRcdFx0XHRcdHZhciBsb2NhdG9yMiA9IGNvcHlMb2NhdG9yKGxvY2F0b3Ise30pO1xyXG5cdFx0XHRcdFx0Ly90cnl7Ly9hdHRyaWJ1dGUgcG9zaXRpb24gZml4ZWRcclxuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7aTxsZW47aSsrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGEgPSBlbFtpXTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb24oYS5vZmZzZXQpO1xyXG5cdFx0XHRcdFx0XHRhLmxvY2F0b3IgPSBjb3B5TG9jYXRvcihsb2NhdG9yLHt9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoJ0BAQEBAJytlKX1cclxuXHRcdFx0XHRcdGRvbUJ1aWxkZXIubG9jYXRvciA9IGxvY2F0b3IyXHJcblx0XHRcdFx0XHRpZihhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKSl7XHJcblx0XHRcdFx0XHRcdHBhcnNlU3RhY2sucHVzaChlbClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRvbUJ1aWxkZXIubG9jYXRvciA9IGxvY2F0b3I7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZihhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKSl7XHJcblx0XHRcdFx0XHRcdHBhcnNlU3RhY2sucHVzaChlbClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoZWwudXJpID09PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgJiYgIWVsLmNsb3NlZCl7XHJcblx0XHRcdFx0XHRlbmQgPSBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsZW5kLGVsLnRhZ05hbWUsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcilcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGVuZCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fWNhdGNoKGUpe1xyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ2VsZW1lbnQgcGFyc2UgZXJyb3I6ICcrZSlcclxuXHRcdFx0Ly9lcnJvckhhbmRsZXIuZXJyb3IoJ2VsZW1lbnQgcGFyc2UgZXJyb3I6ICcrZSk7XHJcblx0XHRcdGVuZCA9IC0xO1xyXG5cdFx0XHQvL3Rocm93IGU7XHJcblx0XHR9XHJcblx0XHRpZihlbmQ+c3RhcnQpe1xyXG5cdFx0XHRzdGFydCA9IGVuZDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQvL1RPRE86IOi/memHjOacieWPr+iDvXNheOWbnumAgO+8jOacieS9jee9rumUmeivr+mjjumZqVxyXG5cdFx0XHRhcHBlbmRUZXh0KE1hdGgubWF4KHRhZ1N0YXJ0LHN0YXJ0KSsxKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gY29weUxvY2F0b3IoZix0KXtcclxuXHR0LmxpbmVOdW1iZXIgPSBmLmxpbmVOdW1iZXI7XHJcblx0dC5jb2x1bW5OdW1iZXIgPSBmLmNvbHVtbk51bWJlcjtcclxuXHRyZXR1cm4gdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBzZWUgI2FwcGVuZEVsZW1lbnQoc291cmNlLGVsU3RhcnRFbmQsZWwsc2VsZkNsb3NlZCxlbnRpdHlSZXBsYWNlcixkb21CdWlsZGVyLHBhcnNlU3RhY2spO1xyXG4gKiBAcmV0dXJuIGVuZCBvZiB0aGUgZWxlbWVudFN0YXJ0UGFydChlbmQgb2YgZWxlbWVudEVuZFBhcnQgZm9yIHNlbGZDbG9zZWQgZWwpXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZUVsZW1lbnRTdGFydFBhcnQoc291cmNlLHN0YXJ0LGVsLGN1cnJlbnROU01hcCxlbnRpdHlSZXBsYWNlcixlcnJvckhhbmRsZXIpe1xyXG5cdHZhciBhdHRyTmFtZTtcclxuXHR2YXIgdmFsdWU7XHJcblx0dmFyIHAgPSArK3N0YXJ0O1xyXG5cdHZhciBzID0gU19UQUc7Ly9zdGF0dXNcclxuXHR3aGlsZSh0cnVlKXtcclxuXHRcdHZhciBjID0gc291cmNlLmNoYXJBdChwKTtcclxuXHRcdHN3aXRjaChjKXtcclxuXHRcdGNhc2UgJz0nOlxyXG5cdFx0XHRpZihzID09PSBTX0FUVFIpey8vYXR0ck5hbWVcclxuXHRcdFx0XHRhdHRyTmFtZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKTtcclxuXHRcdFx0XHRzID0gU19FUTtcclxuXHRcdFx0fWVsc2UgaWYocyA9PT0gU19BVFRSX1NQQUNFKXtcclxuXHRcdFx0XHRzID0gU19FUTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly9mYXRhbEVycm9yOiBlcXVhbCBtdXN0IGFmdGVyIGF0dHJOYW1lIG9yIHNwYWNlIGFmdGVyIGF0dHJOYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgZXF1YWwgbXVzdCBhZnRlciBhdHRyTmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnXFwnJzpcclxuXHRcdGNhc2UgJ1wiJzpcclxuXHRcdFx0aWYocyA9PT0gU19FUSB8fCBzID09PSBTX0FUVFIgLy98fCBzID09IFNfQVRUUl9TUEFDRVxyXG5cdFx0XHRcdCl7Ly9lcXVhbFxyXG5cdFx0XHRcdGlmKHMgPT09IFNfQVRUUil7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIHZhbHVlIG11c3QgYWZ0ZXIgXCI9XCInKVxyXG5cdFx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RhcnQgPSBwKzE7XHJcblx0XHRcdFx0cCA9IHNvdXJjZS5pbmRleE9mKGMsc3RhcnQpXHJcblx0XHRcdFx0aWYocD4wKXtcclxuXHRcdFx0XHRcdHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLHN0YXJ0LTEpO1xyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUl9FTkQ7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvL2ZhdGFsRXJyb3I6IG5vIGVuZCBxdW90IG1hdGNoXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBubyBlbmQgXFwnJytjKydcXCcgbWF0Y2gnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmKHMgPT0gU19BVFRSX05PUVVPVF9WQUxVRSl7XHJcblx0XHRcdFx0dmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRyTmFtZSx2YWx1ZSxzdGFydCxwKVxyXG5cdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydCk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmRpcihlbClcclxuXHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJythdHRyTmFtZSsnXCIgbWlzc2VkIHN0YXJ0IHF1b3QoJytjKycpISEnKTtcclxuXHRcdFx0XHRzdGFydCA9IHArMTtcclxuXHRcdFx0XHRzID0gU19BVFRSX0VORFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvL2ZhdGFsRXJyb3I6IG5vIGVxdWFsIGJlZm9yZVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG11c3QgYWZ0ZXIgXCI9XCInKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJy8nOlxyXG5cdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdGNhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdGNhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0cyA9U19UQUdfQ0xPU0U7XHJcblx0XHRcdFx0ZWwuY2xvc2VkID0gdHJ1ZTtcclxuXHRcdFx0Y2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOlxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0Y2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vY2FzZSBTX0VROlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImF0dHJpYnV0ZSBpbnZhbGlkIGNsb3NlIGNoYXIoJy8nKVwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnJzovL2VuZCBkb2N1bWVudFxyXG5cdFx0XHQvL3Rocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBlbmQgb2YgaW5wdXQnKVxyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0Jyk7XHJcblx0XHRcdGlmKHMgPT0gU19UQUcpe1xyXG5cdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcDtcclxuXHRcdGNhc2UgJz4nOlxyXG5cdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdGNhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdGNhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0YnJlYWs7Ly9ub3JtYWxcclxuXHRcdFx0Y2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOi8vQ29tcGF0aWJsZSBzdGF0ZVxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKTtcclxuXHRcdFx0XHRpZih2YWx1ZS5zbGljZSgtMSkgPT09ICcvJyl7XHJcblx0XHRcdFx0XHRlbC5jbG9zZWQgID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMCwtMSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdGNhc2UgU19BVFRSX1NQQUNFOlxyXG5cdFx0XHRcdGlmKHMgPT09IFNfQVRUUl9TUEFDRSl7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IGF0dHJOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihzID09IFNfQVRUUl9OT1FVT1RfVkFMVUUpe1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlciksc3RhcnQpXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZihjdXJyZW50TlNNYXBbJyddICE9PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgfHwgIXZhbHVlLm1hdGNoKC9eKD86ZGlzYWJsZWR8Y2hlY2tlZHxzZWxlY3RlZCkkL2kpKXtcclxuXHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCB2YWx1ZSEhIFwiJyt2YWx1ZSsnXCIgaW5zdGVhZCEhJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsLmFkZCh2YWx1ZSx2YWx1ZSxzdGFydClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgU19FUTpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtaXNzZWQhIScpO1xyXG5cdFx0XHR9XHJcbi8vXHRcdFx0Y29uc29sZS5sb2codGFnTmFtZSx0YWdOYW1lUGF0dGVybix0YWdOYW1lUGF0dGVybi50ZXN0KHRhZ05hbWUpKVxyXG5cdFx0XHRyZXR1cm4gcDtcclxuXHRcdC8qeG1sIHNwYWNlICdcXHgyMCcgfCAjeDkgfCAjeEQgfCAjeEE7ICovXHJcblx0XHRjYXNlICdcXHUwMDgwJzpcclxuXHRcdFx0YyA9ICcgJztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdGlmKGM8PSAnICcpey8vc3BhY2VcclxuXHRcdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdFx0Y2FzZSBTX1RBRzpcclxuXHRcdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTsvL3RhZ05hbWVcclxuXHRcdFx0XHRcdHMgPSBTX1RBR19TUEFDRTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSOlxyXG5cdFx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscClcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfU1BBQ0U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XHJcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyt2YWx1ZSsnXCIgbWlzc2VkIHF1b3QoXCIpISEnKTtcclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydClcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdFx0XHRzID0gU19UQUdfU1BBQ0U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdFx0Ly9jYXNlIFNfRVE6XHJcblx0XHRcdFx0Ly9jYXNlIFNfQVRUUl9TUEFDRTpcclxuXHRcdFx0XHQvL1x0dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRcdC8vaWdub3JlIHdhcm5pbmdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNley8vbm90IHNwYWNlXHJcbi8vU19UQUcsXHRTX0FUVFIsXHRTX0VRLFx0U19BVFRSX05PUVVPVF9WQUxVRVxyXG4vL1NfQVRUUl9TUEFDRSxcdFNfQVRUUl9FTkQsXHRTX1RBR19TUEFDRSwgU19UQUdfQ0xPU0VcclxuXHRcdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdFx0Ly9jYXNlIFNfVEFHOnZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSOnZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSX05PUVVPVF9WQUxVRTp2b2lkKCk7YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0XHR2YXIgdGFnTmFtZSA9ICBlbC50YWdOYW1lO1xyXG5cdFx0XHRcdFx0aWYoY3VycmVudE5TTWFwWycnXSAhPT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnIHx8ICFhdHRyTmFtZS5tYXRjaCgvXig/OmRpc2FibGVkfGNoZWNrZWR8c2VsZWN0ZWQpJC9pKSl7XHJcblx0XHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK2F0dHJOYW1lKydcIiBtaXNzZWQgdmFsdWUhISBcIicrYXR0ck5hbWUrJ1wiIGluc3RlYWQyISEnKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLGF0dHJOYW1lLHN0YXJ0KTtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIHNwYWNlIGlzIHJlcXVpcmVkXCInK2F0dHJOYW1lKydcIiEhJylcclxuXHRcdFx0XHRjYXNlIFNfVEFHX1NQQUNFOlxyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUjtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19FUTpcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfTk9RVU9UX1ZBTFVFO1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBwO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVsZW1lbnRzIGNsb3NlZCBjaGFyYWN0ZXIgJy8nIGFuZCAnPicgbXVzdCBiZSBjb25uZWN0ZWQgdG9cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9Ly9lbmQgb3V0ZXIgc3dpdGNoXHJcblx0XHQvL2NvbnNvbGUubG9nKCdwKysnLHApXHJcblx0XHRwKys7XHJcblx0fVxyXG59XHJcbi8qKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaGFzIG5ldyBuYW1lc3BhY2UgZGVmaW5lXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKXtcclxuXHR2YXIgdGFnTmFtZSA9IGVsLnRhZ05hbWU7XHJcblx0dmFyIGxvY2FsTlNNYXAgPSBudWxsO1xyXG5cdC8vdmFyIGN1cnJlbnROU01hcCA9IHBhcnNlU3RhY2tbcGFyc2VTdGFjay5sZW5ndGgtMV0uY3VycmVudE5TTWFwO1xyXG5cdHZhciBpID0gZWwubGVuZ3RoO1xyXG5cdHdoaWxlKGktLSl7XHJcblx0XHR2YXIgYSA9IGVsW2ldO1xyXG5cdFx0dmFyIHFOYW1lID0gYS5xTmFtZTtcclxuXHRcdHZhciB2YWx1ZSA9IGEudmFsdWU7XHJcblx0XHR2YXIgbnNwID0gcU5hbWUuaW5kZXhPZignOicpO1xyXG5cdFx0aWYobnNwPjApe1xyXG5cdFx0XHR2YXIgcHJlZml4ID0gYS5wcmVmaXggPSBxTmFtZS5zbGljZSgwLG5zcCk7XHJcblx0XHRcdHZhciBsb2NhbE5hbWUgPSBxTmFtZS5zbGljZShuc3ArMSk7XHJcblx0XHRcdHZhciBuc1ByZWZpeCA9IHByZWZpeCA9PT0gJ3htbG5zJyAmJiBsb2NhbE5hbWVcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsb2NhbE5hbWUgPSBxTmFtZTtcclxuXHRcdFx0cHJlZml4ID0gbnVsbFxyXG5cdFx0XHRuc1ByZWZpeCA9IHFOYW1lID09PSAneG1sbnMnICYmICcnXHJcblx0XHR9XHJcblx0XHQvL2NhbiBub3Qgc2V0IHByZWZpeCxiZWNhdXNlIHByZWZpeCAhPT0gJydcclxuXHRcdGEubG9jYWxOYW1lID0gbG9jYWxOYW1lIDtcclxuXHRcdC8vcHJlZml4ID09IG51bGwgZm9yIG5vIG5zIHByZWZpeCBhdHRyaWJ1dGUgXHJcblx0XHRpZihuc1ByZWZpeCAhPT0gZmFsc2Upey8vaGFjayEhXHJcblx0XHRcdGlmKGxvY2FsTlNNYXAgPT0gbnVsbCl7XHJcblx0XHRcdFx0bG9jYWxOU01hcCA9IHt9XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjdXJyZW50TlNNYXAsMClcclxuXHRcdFx0XHRfY29weShjdXJyZW50TlNNYXAsY3VycmVudE5TTWFwPXt9KVxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3VycmVudE5TTWFwLDEpXHJcblx0XHRcdH1cclxuXHRcdFx0Y3VycmVudE5TTWFwW25zUHJlZml4XSA9IGxvY2FsTlNNYXBbbnNQcmVmaXhdID0gdmFsdWU7XHJcblx0XHRcdGEudXJpID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJ1xyXG5cdFx0XHRkb21CdWlsZGVyLnN0YXJ0UHJlZml4TWFwcGluZyhuc1ByZWZpeCwgdmFsdWUpIFxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgaSA9IGVsLmxlbmd0aDtcclxuXHR3aGlsZShpLS0pe1xyXG5cdFx0YSA9IGVsW2ldO1xyXG5cdFx0dmFyIHByZWZpeCA9IGEucHJlZml4O1xyXG5cdFx0aWYocHJlZml4KXsvL25vIHByZWZpeCBhdHRyaWJ1dGUgaGFzIG5vIG5hbWVzcGFjZVxyXG5cdFx0XHRpZihwcmVmaXggPT09ICd4bWwnKXtcclxuXHRcdFx0XHRhLnVyaSA9ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xyXG5cdFx0XHR9aWYocHJlZml4ICE9PSAneG1sbnMnKXtcclxuXHRcdFx0XHRhLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly97Y29uc29sZS5sb2coJyMjIycrYS5xTmFtZSxkb21CdWlsZGVyLmxvY2F0b3Iuc3lzdGVtSWQrJycsY3VycmVudE5TTWFwLGEudXJpKX1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgbnNwID0gdGFnTmFtZS5pbmRleE9mKCc6Jyk7XHJcblx0aWYobnNwPjApe1xyXG5cdFx0cHJlZml4ID0gZWwucHJlZml4ID0gdGFnTmFtZS5zbGljZSgwLG5zcCk7XHJcblx0XHRsb2NhbE5hbWUgPSBlbC5sb2NhbE5hbWUgPSB0YWdOYW1lLnNsaWNlKG5zcCsxKTtcclxuXHR9ZWxzZXtcclxuXHRcdHByZWZpeCA9IG51bGw7Ly9pbXBvcnRhbnQhIVxyXG5cdFx0bG9jYWxOYW1lID0gZWwubG9jYWxOYW1lID0gdGFnTmFtZTtcclxuXHR9XHJcblx0Ly9ubyBwcmVmaXggZWxlbWVudCBoYXMgZGVmYXVsdCBuYW1lc3BhY2VcclxuXHR2YXIgbnMgPSBlbC51cmkgPSBjdXJyZW50TlNNYXBbcHJlZml4IHx8ICcnXTtcclxuXHRkb21CdWlsZGVyLnN0YXJ0RWxlbWVudChucyxsb2NhbE5hbWUsdGFnTmFtZSxlbCk7XHJcblx0Ly9lbmRQcmVmaXhNYXBwaW5nIGFuZCBzdGFydFByZWZpeE1hcHBpbmcgaGF2ZSBub3QgYW55IGhlbHAgZm9yIGRvbSBidWlsZGVyXHJcblx0Ly9sb2NhbE5TTWFwID0gbnVsbFxyXG5cdGlmKGVsLmNsb3NlZCl7XHJcblx0XHRkb21CdWlsZGVyLmVuZEVsZW1lbnQobnMsbG9jYWxOYW1lLHRhZ05hbWUpO1xyXG5cdFx0aWYobG9jYWxOU01hcCl7XHJcblx0XHRcdGZvcihwcmVmaXggaW4gbG9jYWxOU01hcCl7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5lbmRQcmVmaXhNYXBwaW5nKHByZWZpeCkgXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9ZWxzZXtcclxuXHRcdGVsLmN1cnJlbnROU01hcCA9IGN1cnJlbnROU01hcDtcclxuXHRcdGVsLmxvY2FsTlNNYXAgPSBsb2NhbE5TTWFwO1xyXG5cdFx0Ly9wYXJzZVN0YWNrLnB1c2goZWwpO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlSHRtbFNwZWNpYWxDb250ZW50KHNvdXJjZSxlbFN0YXJ0RW5kLHRhZ05hbWUsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcil7XHJcblx0aWYoL14oPzpzY3JpcHR8dGV4dGFyZWEpJC9pLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0dmFyIGVsRW5kU3RhcnQgPSAgc291cmNlLmluZGV4T2YoJzwvJyt0YWdOYW1lKyc+JyxlbFN0YXJ0RW5kKTtcclxuXHRcdHZhciB0ZXh0ID0gc291cmNlLnN1YnN0cmluZyhlbFN0YXJ0RW5kKzEsZWxFbmRTdGFydCk7XHJcblx0XHRpZigvWyY8XS8udGVzdCh0ZXh0KSl7XHJcblx0XHRcdGlmKC9ec2NyaXB0JC9pLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0XHRcdC8vaWYoIS9cXF1cXF0+Ly50ZXN0KHRleHQpKXtcclxuXHRcdFx0XHRcdC8vbGV4SGFuZGxlci5zdGFydENEQVRBKCk7XHJcblx0XHRcdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnModGV4dCwwLHRleHQubGVuZ3RoKTtcclxuXHRcdFx0XHRcdC8vbGV4SGFuZGxlci5lbmRDREFUQSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsRW5kU3RhcnQ7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdH0vL31lbHNley8vdGV4dCBhcmVhXHJcblx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHRleHQsMCx0ZXh0Lmxlbmd0aCk7XHJcblx0XHRcdFx0cmV0dXJuIGVsRW5kU3RhcnQ7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGVsU3RhcnRFbmQrMTtcclxufVxyXG5mdW5jdGlvbiBmaXhTZWxmQ2xvc2VkKHNvdXJjZSxlbFN0YXJ0RW5kLHRhZ05hbWUsY2xvc2VNYXApe1xyXG5cdC8vaWYodGFnTmFtZSBpbiBjbG9zZU1hcCl7XHJcblx0dmFyIHBvcyA9IGNsb3NlTWFwW3RhZ05hbWVdO1xyXG5cdGlmKHBvcyA9PSBudWxsKXtcclxuXHRcdC8vY29uc29sZS5sb2codGFnTmFtZSlcclxuXHRcdHBvcyA9ICBzb3VyY2UubGFzdEluZGV4T2YoJzwvJyt0YWdOYW1lKyc+JylcclxuXHRcdGlmKHBvczxlbFN0YXJ0RW5kKXsvL+W/mOiusOmXreWQiFxyXG5cdFx0XHRwb3MgPSBzb3VyY2UubGFzdEluZGV4T2YoJzwvJyt0YWdOYW1lKVxyXG5cdFx0fVxyXG5cdFx0Y2xvc2VNYXBbdGFnTmFtZV0gPXBvc1xyXG5cdH1cclxuXHRyZXR1cm4gcG9zPGVsU3RhcnRFbmQ7XHJcblx0Ly99IFxyXG59XHJcbmZ1bmN0aW9uIF9jb3B5KHNvdXJjZSx0YXJnZXQpe1xyXG5cdGZvcih2YXIgbiBpbiBzb3VyY2Upe3RhcmdldFtuXSA9IHNvdXJjZVtuXX1cclxufVxyXG5mdW5jdGlvbiBwYXJzZURDQyhzb3VyY2Usc3RhcnQsZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpey8vc3VyZSBzdGFydCB3aXRoICc8ISdcclxuXHR2YXIgbmV4dD0gc291cmNlLmNoYXJBdChzdGFydCsyKVxyXG5cdHN3aXRjaChuZXh0KXtcclxuXHRjYXNlICctJzpcclxuXHRcdGlmKHNvdXJjZS5jaGFyQXQoc3RhcnQgKyAzKSA9PT0gJy0nKXtcclxuXHRcdFx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCctLT4nLHN0YXJ0KzQpO1xyXG5cdFx0XHQvL2FwcGVuZCBjb21tZW50IHNvdXJjZS5zdWJzdHJpbmcoNCxlbmQpLy88IS0tXHJcblx0XHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5jb21tZW50KHNvdXJjZSxzdGFydCs0LGVuZC1zdGFydC00KTtcclxuXHRcdFx0XHRyZXR1cm4gZW5kKzM7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGVycm9ySGFuZGxlci5lcnJvcihcIlVuY2xvc2VkIGNvbW1lbnRcIik7XHJcblx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9lcnJvclxyXG5cdFx0XHRyZXR1cm4gLTE7XHJcblx0XHR9XHJcblx0ZGVmYXVsdDpcclxuXHRcdGlmKHNvdXJjZS5zdWJzdHIoc3RhcnQrMyw2KSA9PSAnQ0RBVEFbJyl7XHJcblx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignXV0+JyxzdGFydCs5KTtcclxuXHRcdFx0ZG9tQnVpbGRlci5zdGFydENEQVRBKCk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyhzb3VyY2Usc3RhcnQrOSxlbmQtc3RhcnQtOSk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuZW5kQ0RBVEEoKSBcclxuXHRcdFx0cmV0dXJuIGVuZCszO1xyXG5cdFx0fVxyXG5cdFx0Ly88IURPQ1RZUEVcclxuXHRcdC8vc3RhcnREVEQoamF2YS5sYW5nLlN0cmluZyBuYW1lLCBqYXZhLmxhbmcuU3RyaW5nIHB1YmxpY0lkLCBqYXZhLmxhbmcuU3RyaW5nIHN5c3RlbUlkKSBcclxuXHRcdHZhciBtYXRjaHMgPSBzcGxpdChzb3VyY2Usc3RhcnQpO1xyXG5cdFx0dmFyIGxlbiA9IG1hdGNocy5sZW5ndGg7XHJcblx0XHRpZihsZW4+MSAmJiAvIWRvY3R5cGUvaS50ZXN0KG1hdGNoc1swXVswXSkpe1xyXG5cdFx0XHR2YXIgbmFtZSA9IG1hdGNoc1sxXVswXTtcclxuXHRcdFx0dmFyIHB1YmlkID0gbGVuPjMgJiYgL15wdWJsaWMkL2kudGVzdChtYXRjaHNbMl1bMF0pICYmIG1hdGNoc1szXVswXVxyXG5cdFx0XHR2YXIgc3lzaWQgPSBsZW4+NCAmJiBtYXRjaHNbNF1bMF07XHJcblx0XHRcdHZhciBsYXN0TWF0Y2ggPSBtYXRjaHNbbGVuLTFdXHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnREVEQobmFtZSxwdWJpZCAmJiBwdWJpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJyksXHJcblx0XHRcdFx0XHRzeXNpZCAmJiBzeXNpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJykpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmVuZERURCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGxhc3RNYXRjaC5pbmRleCtsYXN0TWF0Y2hbMF0ubGVuZ3RoXHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAtMTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUluc3RydWN0aW9uKHNvdXJjZSxzdGFydCxkb21CdWlsZGVyKXtcclxuXHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJz8+JyxzdGFydCk7XHJcblx0aWYoZW5kKXtcclxuXHRcdHZhciBtYXRjaCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5tYXRjaCgvXjxcXD8oXFxTKilcXHMqKFtcXHNcXFNdKj8pXFxzKiQvKTtcclxuXHRcdGlmKG1hdGNoKXtcclxuXHRcdFx0dmFyIGxlbiA9IG1hdGNoWzBdLmxlbmd0aDtcclxuXHRcdFx0ZG9tQnVpbGRlci5wcm9jZXNzaW5nSW5zdHJ1Y3Rpb24obWF0Y2hbMV0sIG1hdGNoWzJdKSA7XHJcblx0XHRcdHJldHVybiBlbmQrMjtcclxuXHRcdH1lbHNley8vZXJyb3JcclxuXHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gLTE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gc291cmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBFbGVtZW50QXR0cmlidXRlcyhzb3VyY2Upe1xyXG5cdFxyXG59XHJcbkVsZW1lbnRBdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcclxuXHRzZXRUYWdOYW1lOmZ1bmN0aW9uKHRhZ05hbWUpe1xyXG5cdFx0aWYoIXRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdGFnTmFtZTonK3RhZ05hbWUpXHJcblx0XHR9XHJcblx0XHR0aGlzLnRhZ05hbWUgPSB0YWdOYW1lXHJcblx0fSxcclxuXHRhZGQ6ZnVuY3Rpb24ocU5hbWUsdmFsdWUsb2Zmc2V0KXtcclxuXHRcdGlmKCF0YWdOYW1lUGF0dGVybi50ZXN0KHFOYW1lKSl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhdHRyaWJ1dGU6JytxTmFtZSlcclxuXHRcdH1cclxuXHRcdHRoaXNbdGhpcy5sZW5ndGgrK10gPSB7cU5hbWU6cU5hbWUsdmFsdWU6dmFsdWUsb2Zmc2V0Om9mZnNldH1cclxuXHR9LFxyXG5cdGxlbmd0aDowLFxyXG5cdGdldExvY2FsTmFtZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5sb2NhbE5hbWV9LFxyXG5cdGdldExvY2F0b3I6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0ubG9jYXRvcn0sXHJcblx0Z2V0UU5hbWU6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0ucU5hbWV9LFxyXG5cdGdldFVSSTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS51cml9LFxyXG5cdGdldFZhbHVlOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLnZhbHVlfVxyXG4vL1x0LGdldEluZGV4OmZ1bmN0aW9uKHVyaSwgbG9jYWxOYW1lKSl7XHJcbi8vXHRcdGlmKGxvY2FsTmFtZSl7XHJcbi8vXHRcdFx0XHJcbi8vXHRcdH1lbHNle1xyXG4vL1x0XHRcdHZhciBxTmFtZSA9IHVyaVxyXG4vL1x0XHR9XHJcbi8vXHR9LFxyXG4vL1x0Z2V0VmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLmdldEluZGV4LmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9LFxyXG4vL1x0Z2V0VHlwZTpmdW5jdGlvbih1cmksbG9jYWxOYW1lKXt9XHJcbi8vXHRnZXRUeXBlOmZ1bmN0aW9uKGkpe30sXHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIF9zZXRfcHJvdG9fKHRoaXoscGFyZW50KXtcclxuXHR0aGl6Ll9fcHJvdG9fXyA9IHBhcmVudDtcclxuXHRyZXR1cm4gdGhpejtcclxufVxyXG5pZighKF9zZXRfcHJvdG9fKHt9LF9zZXRfcHJvdG9fLnByb3RvdHlwZSkgaW5zdGFuY2VvZiBfc2V0X3Byb3RvXykpe1xyXG5cdF9zZXRfcHJvdG9fID0gZnVuY3Rpb24odGhpeixwYXJlbnQpe1xyXG5cdFx0ZnVuY3Rpb24gcCgpe307XHJcblx0XHRwLnByb3RvdHlwZSA9IHBhcmVudDtcclxuXHRcdHAgPSBuZXcgcCgpO1xyXG5cdFx0Zm9yKHBhcmVudCBpbiB0aGl6KXtcclxuXHRcdFx0cFtwYXJlbnRdID0gdGhpeltwYXJlbnRdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdChzb3VyY2Usc3RhcnQpe1xyXG5cdHZhciBtYXRjaDtcclxuXHR2YXIgYnVmID0gW107XHJcblx0dmFyIHJlZyA9IC8nW14nXSsnfFwiW15cIl0rXCJ8W15cXHM8PlxcLz1dKz0/fChcXC8/XFxzKj58PCkvZztcclxuXHRyZWcubGFzdEluZGV4ID0gc3RhcnQ7XHJcblx0cmVnLmV4ZWMoc291cmNlKTsvL3NraXAgPFxyXG5cdHdoaWxlKG1hdGNoID0gcmVnLmV4ZWMoc291cmNlKSl7XHJcblx0XHRidWYucHVzaChtYXRjaCk7XHJcblx0XHRpZihtYXRjaFsxXSlyZXR1cm4gYnVmO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0cy5YTUxSZWFkZXIgPSBYTUxSZWFkZXI7XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJuYW1lXCI6IFwic2JnbnZpelwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjMuMS4wXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNCR05QRCB2aXN1YWxpemF0aW9uIGxpYnJhcnlcIixcclxuICBcIm1haW5cIjogXCJzcmMvaW5kZXguanNcIixcclxuICBcImxpY2VuY2VcIjogXCJMR1BMLTMuMFwiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInRlc3RcIjogXCJlY2hvIFxcXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcXFwiICYmIGV4aXQgMVwiLFxyXG4gICAgXCJidWlsZC1zYmdudml6LWpzXCI6IFwiZ3VscCBidWlsZFwiLFxyXG4gICAgXCJkZWJ1Zy1qc1wiOiBcIm5vZGVtb24gLWUganMgLS13YXRjaCBzcmMgLXggXFxcIm5wbSBydW4gYnVpbGQtc2JnbnZpei1qc1xcXCJcIlxyXG4gIH0sXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMuZ2l0XCJcclxuICB9LFxyXG4gIFwiYnVnc1wiOiB7XHJcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9pc3N1ZXNcIlxyXG4gIH0sXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9cIixcclxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJqcXVlcnlcIjogXCJeMi4yLjRcIixcclxuICAgIFwiZmlsZXNhdmVyanNcIjogXCJ+MC4yLjJcIixcclxuICAgIFwiY3l0b3NjYXBlXCI6IFwiaVZpcy1hdC1CaWxrZW50L2N5dG9zY2FwZS5qcyN1bnN0YWJsZVwiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcImxpYnNiZ24uanNcIjogXCJnaXQ6Ly9naXRodWIuY29tL2Vpc2JtL2xpYnNiZ24uanNcIixcclxuICAgIFwicHJldHR5LWRhdGFcIjogXCJeMC40MC4wXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiYnJvd3NlcmlmeVwiOiBcIl4xMS4yLjBcIixcclxuICAgIFwiZ3VscFwiOiBcIl4zLjkuMFwiLFxyXG4gICAgXCJndWxwLWRlcmVxdWlyZVwiOiBcIl4yLjEuMFwiLFxyXG4gICAgXCJndWxwLWpzaGludFwiOiBcIl4xLjExLjJcIixcclxuICAgIFwiZ3VscC1wcm9tcHRcIjogXCJeMC4xLjJcIixcclxuICAgIFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS40XCIsXHJcbiAgICBcImd1bHAtc2hlbGxcIjogXCJeMC41LjBcIixcclxuICAgIFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXHJcbiAgICBcImpzaGludC1zdHlsaXNoXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcIm5vZGUtbm90aWZpZXJcIjogXCJeNC4zLjFcIixcclxuICAgIFwicnVuLXNlcXVlbmNlXCI6IFwiXjEuMS40XCIsXHJcbiAgICBcInZpbnlsLWJ1ZmZlclwiOiBcIl4xLjAuMFwiLFxyXG4gICAgXCJ2aW55bC1zb3VyY2Utc3RyZWFtXCI6IFwiXjEuMS4wXCJcclxuICB9XHJcbn1cclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHNiZ252aXogPSB3aW5kb3cuc2JnbnZpeiA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xyXG4gICAgdmFyIGxpYnMgPSB7fTtcclxuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcclxuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcclxuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XHJcbiAgICBcclxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcclxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XHJcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcclxuICAgIFxyXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcclxuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpO1xyXG4gICAgXHJcbiAgICB2YXIgc2JnblJlbmRlcmVyID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1yZW5kZXJlcicpO1xyXG4gICAgdmFyIHNiZ25DeUluc3RhbmNlID0gcmVxdWlyZSgnLi9zYmduLWV4dGVuc2lvbnMvc2Jnbi1jeS1pbnN0YW5jZScpO1xyXG4gICAgXHJcbiAgICAvLyBVdGlsaXRpZXMgd2hvc2UgZnVuY3Rpb25zIHdpbGwgYmUgZXhwb3NlZCBzZXBlcmF0ZWx5XHJcbiAgICB2YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91aS11dGlsaXRpZXMnKTtcclxuICAgIHZhciBmaWxlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMnKTtcclxuICAgIHZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xyXG4gICAgcmVxdWlyZSgnLi91dGlsaXRpZXMva2V5Ym9hcmQtaW5wdXQtdXRpbGl0aWVzJyk7IC8vIHJlcXVpcmUga2V5Ym9yZCBpbnB1dCB1dGlsaXRpZXNcclxuICAgIC8vIFV0aWxpdGllcyB0byBiZSBleHBvc2VkIGFzIGlzXHJcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG4gICAgXHJcbiAgICBzYmduUmVuZGVyZXIoKTtcclxuICAgIHNiZ25DeUluc3RhbmNlKCk7XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXHJcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXMsIG1vc3QgdXNlcnMgd2lsbCBub3QgbmVlZCB0aGVzZVxyXG4gICAgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcclxuICAgIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gZmlsZVV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gZmlsZVV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gdWlVdGlsaXRpZXMpIHtcclxuICAgICAgc2JnbnZpeltwcm9wXSA9IHVpVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBzYmduIGdyYXBoIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBncmFwaFV0aWxpdGllcykge1xyXG4gICAgICBzYmdudml6W3Byb3BdID0gZ3JhcGhVdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzYmdudml6O1xyXG4gIH1cclxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZ3JhcGgtdXRpbGl0aWVzJyk7XHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG52YXIgcmVmcmVzaFBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzLmJpbmQoZ3JhcGhVdGlsaXRpZXMpO1xyXG5cclxudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIGN5dG9zY2FwZSA9IGxpYnMuY3l0b3NjYXBlO1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuXHJcbnZhciBnZXRDb21wb3VuZFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gUmV0dXJuIGNhbGN1bGF0ZWQgcGFkZGluZ3MgaW4gY2FzZSBvZiB0aGF0IGRhdGEgaXMgaW52YWxpZCByZXR1cm4gNVxyXG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgfHwgNTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFJldHVybnMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBwb2ludCBsb2NhdGVkIG9uIHRoZSBnaXZlbiBhbmdsZSBvbiB0aGUgY2lyY2xlIHdpdGggdGhlIGdpdmVuIGNlbnRlcmFsIGNvb3JkaW5hdGVzIGFuZCByYWRpdXMuXHJcbiAqL1xyXG52YXIgZ2V0UG9pbnRPbkNpcmNsZSA9IGZ1bmN0aW9uKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVJbkRlZ3JlZSkge1xyXG5cdHZhciBhbmdsZUluUmFkaWFuID0gYW5nbGVJbkRlZ3JlZSAqICggTWF0aC5QSSAvIDE4MCApOyAvLyBDb252ZXJ0IGRlZ3JlZSB0byByYWRpYW5cclxuXHRyZXR1cm4ge1xyXG5cdFx0eDogcmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbikgKyBjZW50ZXJYLFxyXG5cdFx0eTogLTEgKiByYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFuKSArIGNlbnRlclkgLy8gV2UgbXVsdGlwbHkgd2l0aCAtMSBoZXJlIGJlY2F1c2UgSlMgeSBjb29yZGluYXRlIHNpZ24gaXMgdGhlIG9wb3NpdGUgb2YgdGhlIE1hdGhhbWF0aWNhbCBjb29yZGluYXRlcyBzeXN0ZW1cclxuXHR9O1xyXG59O1xyXG5cclxuLypcclxuICogR2VuZXJhdGVzIGEgcG9seWdvbiBzdHJpbmcgYXBwcm94aW1hdGluZyBhIGNpcmNsZSB3aXRoIGdpdmVuIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kIGFuZ2xlcyBhbmQgbnVtYmVyIG9mIHBvaW50cyB0byByZXByZXNlbnQgdGhlIGNpcmNsZVxyXG4gKi9cclxudmFyIGdlbmVyYXRlQ2lyY2xlU3RyaW5nID0gZnVuY3Rpb24oY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBhbmdsZUZyb20sIGFuZ2xlVG8sIG51bU9mUG9pbnRzKSB7XHJcblx0dmFyIGNpcmNsZVN0ciA9IFwiXCI7XHJcblx0dmFyIHN0ZXBTaXplID0gKCBhbmdsZVRvIC0gYW5nbGVGcm9tICkgLyBudW1PZlBvaW50czsgLy8gV2Ugd2lsbCBpbmNyZW1lbnQgdGhlIGN1cnJlbnQgYW5nbGUgYnkgc3RlcCBzaXplIGluIGVhY2ggaXRlcmF0aW9uXHJcblx0dmFyIGN1cnJlbnRBbmdsZSA9IGFuZ2xlRnJvbTsgLy8gY3VycmVudCBhbmdsZSB3aWxsIGJlIHVwZGF0ZWQgaW4gZWFjaCBpdGVyYXRpb25cclxuXHRcclxuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBudW1PZlBvaW50czsgaSsrICkge1xyXG5cdFx0dmFyIHBvaW50ID0gZ2V0UG9pbnRPbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGN1cnJlbnRBbmdsZSk7XHJcblx0XHRjdXJyZW50QW5nbGUgKz0gc3RlcFNpemU7XHJcblx0XHRjaXJjbGVTdHIgKz0gcG9pbnQueCArIFwiIFwiICsgcG9pbnQueSArIFwiIFwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gY2lyY2xlU3RyO1xyXG59O1xyXG5cclxuLypcclxuICogIEdlbmVyYXRlcyBhIHN0cmluZyByZXByZXNlbnRpbmcgcHJvY2Vzc2VzL2xvZ2ljYWwgb3BlcmF0b3JzIHdpdGggcG9ydHMuXHJcbiAqICBsaW5lSFc6IEhhbGYgd2lkdGggb2YgbGluZSB0aHJvdWdoIHRoZSBjaXJjbGUgdG8gdGhlIGludGVyc2VjdGlvbiBwb2ludFxyXG4gKiAgc2hhcGVIVzogSGFsZiB3aWR0aCBvZiB0aGUgc2hhcGUgZGlzY2x1ZGluZyB0aGUgcG9ydHMgKEl0IGlzIHJhZGl1cyBmb3IgdGhlIGNpcmN1bGFyIHNoYXBlcylcclxuICogIHR5cGU6IFR5cGUgb2YgdGhlIHNoYXBlIGRpc2NsdWRpbmcgdGhlIHBvcnRzLiBPcHRpb25zIGFyZSAnY2lyY2xlJywgJ3JlY3RhbmdsZSdcclxuICogIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbiBvZiB0aGUgcG9ydHMgT3B0aW9ucyBhcmUgJ2hvcml6b250YWwnLCAndmVydGljYWwnXHJcbiAqL1xyXG5cclxudmFyIGdlbmVyYXRlU2hhcGVXaXRoUG9ydFN0cmluZyA9IGZ1bmN0aW9uKGxpbmVIVywgc2hhcGVIVywgdHlwZSwgb3JpZW50YXRpb24pIHtcclxuXHR2YXIgcG9seWdvblN0cjtcclxuICAgIHZhciBudW1PZlBvaW50cyA9IDMwOyAvLyBOdW1iZXIgb2YgcG9pbnRzIHRoYXQgYm90aCBoYWx2ZXMgb2YgY2lyY2xlIHdpbGwgaGF2ZVxyXG5cdGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcblx0XHR2YXIgYWJvdmVQb2ludHMsIGJlbG93UG9pbnRzO1xyXG5cdFxyXG5cdFx0aWYgKHR5cGUgPT09ICdjaXJjbGUnKSB7XHJcblx0XHRcdGFib3ZlUG9pbnRzID0gZ2VuZXJhdGVDaXJjbGVTdHJpbmcoMCwgMCwgc2hhcGVIVywgMTgwLCAwLCBudW1PZlBvaW50cyk7XHJcblx0XHRcdGJlbG93UG9pbnRzID0gZ2VuZXJhdGVDaXJjbGVTdHJpbmcoMCwgMCwgc2hhcGVIVywgMzYwLCAxODAsIG51bU9mUG9pbnRzKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdyZWN0YW5nbGUnKSB7XHJcblx0XHRcdGFib3ZlUG9pbnRzID0gJy0nICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAnICsgc2hhcGVIVyArICcgLScgKyBzaGFwZUhXICsgJyAnO1xyXG5cdFx0XHRiZWxvd1BvaW50cyA9IHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAnO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRwb2x5Z29uU3RyID0gXCItMSAtXCIgKyBsaW5lSFcgKyBcIiAtXCIgKyBzaGFwZUhXICsgXCIgLVwiICsgbGluZUhXICsgXCIgXCI7XHRcclxuXHRcdHBvbHlnb25TdHIgKz0gYWJvdmVQb2ludHM7XHJcblx0XHRwb2x5Z29uU3RyICs9IHNoYXBlSFcgKyBcIiAtXCIgKyBsaW5lSFcgKyBcIiAxIC1cIiArIGxpbmVIVyArIFwiIDEgXCIgKyBsaW5lSFcgKyBcIiBcIiArIHNoYXBlSFcgKyBcIiBcIiArIGxpbmVIVyArIFwiIFwiO1xyXG5cdFx0cG9seWdvblN0ciArPSBiZWxvd1BvaW50cztcclxuXHRcdHBvbHlnb25TdHIgKz0gXCItXCIgKyBzaGFwZUhXICsgXCIgXCIgKyBsaW5lSFcgKyBcIiAtMSBcIiArIGxpbmVIVztcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR2YXIgbGVmdFBvaW50cywgcmlnaHRQb2ludHM7XHJcblx0XHRcclxuXHRcdGlmICh0eXBlID09PSAnY2lyY2xlJykge1xyXG5cdFx0XHRsZWZ0UG9pbnRzID0gZ2VuZXJhdGVDaXJjbGVTdHJpbmcoMCwgMCwgc2hhcGVIVywgOTAsIDI3MCwgbnVtT2ZQb2ludHMpO1xyXG5cdFx0XHRyaWdodFBvaW50cyA9IGdlbmVyYXRlQ2lyY2xlU3RyaW5nKDAsIDAsIHNoYXBlSFcsIC05MCwgOTAsIG51bU9mUG9pbnRzKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdyZWN0YW5nbGUnKSB7XHJcblx0XHRcdGxlZnRQb2ludHMgPSAnLScgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnIC0nICsgc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnICc7XHJcblx0XHRcdHJpZ2h0UG9pbnRzID0gc2hhcGVIVyArICcgJyArIHNoYXBlSFcgKyAnICcgKyBzaGFwZUhXICsgJyAtJyArIHNoYXBlSFcgKyAnICc7IFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRwb2x5Z29uU3RyID0gXCItXCIgKyBsaW5lSFcgKyBcIiAtXCIgKyAxICsgXCIgLVwiICsgbGluZUhXICsgXCIgLVwiICsgc2hhcGVIVyArIFwiIFwiO1xyXG5cdFx0cG9seWdvblN0ciArPSBsZWZ0UG9pbnRzO1xyXG5cdFx0cG9seWdvblN0ciArPSBcIi1cIiArIGxpbmVIVyArIFwiIFwiICsgc2hhcGVIVyArIFwiIC1cIiArIGxpbmVIVyArIFwiIDEgXCIgKyBsaW5lSFcgKyBcIiAxIFwiICsgbGluZUhXICsgXCIgXCIgKyBzaGFwZUhXICsgXCIgXCI7XHJcblx0XHRwb2x5Z29uU3RyICs9IHJpZ2h0UG9pbnRzO1xyXG5cdFx0cG9seWdvblN0ciArPSBsaW5lSFcgKyBcIiAtXCIgKyBzaGFwZUhXICsgXCIgXCIgKyBsaW5lSFcgKyBcIiAtMVwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcG9seWdvblN0cjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBjb250YWluZXJTZWxlY3RvciA9IG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yO1xyXG4gIHZhciBpbWdQYXRoID0gb3B0aW9ucy5pbWdQYXRoO1xyXG4gIFxyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXHJcbiAge1xyXG4gICAgdmFyIHNiZ25OZXR3b3JrQ29udGFpbmVyID0gJChjb250YWluZXJTZWxlY3Rvcik7XHJcblxyXG4gICAgLy8gY3JlYXRlIGFuZCBpbml0IGN5dG9zY2FwZTpcclxuICAgIHZhciBjeSA9IGN5dG9zY2FwZSh7XHJcbiAgICAgIGNvbnRhaW5lcjogc2Jnbk5ldHdvcmtDb250YWluZXIsXHJcbiAgICAgIHN0eWxlOiBzYmduU3R5bGVTaGVldCxcclxuICAgICAgc2hvd092ZXJsYXk6IGZhbHNlLCBtaW5ab29tOiAwLjEyNSwgbWF4Wm9vbTogMTYsXHJcbiAgICAgIGJveFNlbGVjdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIG1vdGlvbkJsdXI6IHRydWUsXHJcbiAgICAgIHdoZWVsU2Vuc2l0aXZpdHk6IDAuMSxcclxuICAgICAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuY3kgPSB0aGlzO1xyXG4gICAgICAgIC8vIElmIHVuZG9hYmxlIHJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgICAgICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICBcclxuICAvLyBOb3RlIHRoYXQgaW4gQ2hpU0UgdGhpcyBmdW5jdGlvbiBpcyBpbiBhIHNlcGVyYXRlIGZpbGUgYnV0IGluIHRoZSB2aWV3ZXIgaXQgaGFzIGp1c3QgMiBtZXRob2RzIGFuZCBzbyBpdCBpcyBsb2NhdGVkIGluIHRoaXMgZmlsZVxyXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKCkge1xyXG4gICAgLy8gY3JlYXRlIG9yIGdldCB0aGUgdW5kby1yZWRvIGluc3RhbmNlXHJcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xyXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZU5vZGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlTm9kZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBiaW5kQ3lFdmVudHMoKSB7XHJcbiAgICBjeS5vbigndGFwZW5kJywgJ25vZGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmJlZm9yZWNvbGxhcHNlXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gICAgICAvL1RoZSBjaGlsZHJlbiBpbmZvIG9mIGNvbXBsZXggbm9kZXMgc2hvdWxkIGJlIHNob3duIHdoZW4gdGhleSBhcmUgY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgICAgICAvL1RoZSBub2RlIGlzIGJlaW5nIGNvbGxhcHNlZCBzdG9yZSBpbmZvbGFiZWwgdG8gdXNlIGl0IGxhdGVyXHJcbiAgICAgICAgdmFyIGluZm9MYWJlbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xyXG4gICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5pbmZvTGFiZWwgPSBpbmZvTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBlZGdlcyA9IGN5LmVkZ2VzKCk7XHJcbiAgICAgIC8vIHJlbW92ZSBiZW5kIHBvaW50cyBiZWZvcmUgY29sbGFwc2VcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XHJcbiAgICAgICAgaWYgKGVkZ2UuaGFzQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJykpIHtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XHJcbiAgICAgICAgICBkZWxldGUgZWRnZS5fcHJpdmF0ZS5jbGFzc2VzWydlZGdlYmVuZGVkaXRpbmctaGFzYmVuZHBvaW50cyddO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xyXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gICAgICBub2RlLnJlbW92ZURhdGEoXCJpbmZvTGFiZWxcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImV4cGFuZGNvbGxhcHNlLmFmdGVyZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gICAgICBjeS5ub2RlcygpLnVwZGF0ZUNvbXBvdW5kQm91bmRzKCk7XHJcbiAgICAgIC8vRG9uJ3Qgc2hvdyBjaGlsZHJlbiBpbmZvIHdoZW4gdGhlIGNvbXBsZXggbm9kZSBpcyBleHBhbmRlZFxyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnY29udGVudCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhciBzYmduU3R5bGVTaGVldCA9IGN5dG9zY2FwZS5zdHlsZXNoZWV0KClcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICAgICAgICAgJ3RleHQtb3BhY2l0eSc6IDEsXHJcbiAgICAgICAgICAgICdvcGFjaXR5JzogMSxcclxuICAgICAgICAgICAgJ3BhZGRpbmcnOiAwLFxyXG4gICAgICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpwYXJlbnRcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAncGFkZGluZyc6IGdldENvbXBvdW5kUGFkZGluZ3NcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlWz9jbG9uZW1hcmtlcl1bY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXSxub2RlWz9jbG9uZW1hcmtlcl1bY2xhc3M9J3Vuc3BlY2lmaWVkIGVudGl0eSddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBpbWdQYXRoICsgJy9jbG9uZV9iZy5wbmcnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JzogJzUwJScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknOiAnMTAwJScsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLXdpZHRoJzogJzEwMCUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1oZWlnaHQnOiAnMjUlJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtZml0JzogJ25vbmUnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2Nsb25lbWFya2VyJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjb250ZW50JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J2Fzc29jaWF0aW9uJ10sW2NsYXNzPSdkaXNzb2NpYXRpb24nXSxbY2xhc3M9J2FuZCddLFtjbGFzcz0nb3InXSxbY2xhc3M9J25vdCddLFtjbGFzcz0ncHJvY2VzcyddLFtjbGFzcz0nb21pdHRlZCBwcm9jZXNzJ10sW2NsYXNzPSd1bmNlcnRhaW4gcHJvY2VzcyddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9PT0gdHJ1ZSAmJiBlbGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBwb3J0cyBvZiB0aGUgZWRnZSBhcmUgc3ltZXRyaWMgYWNjb3JkaW5nIHRvIHRoZSBub2RlIGNlbnRlciBzbyBqdXN0IGNoZWNraW5nIG9uZSBwb3J0IGlzIGVub3VnaCBmb3IgdXNcclxuICAgICAgICAgICAgICAgIHZhciBwb3J0ID0gZWxlLmRhdGEoJ3BvcnRzJylbMF07IFxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBvcnRzIGFyZSBsb2NhdGVkIGFib3ZlL2JlbG93IG9mIHRoZSBub2RlIHRoZW4gdGhlIG9yaWVudGF0aW9uIGlzICd2ZXJ0aWNhbCcgZWxzZSBpdCBpcyAnaG9yaXpvbnRhbCdcclxuICAgICAgICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnQueCA9PT0gMCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgaGFsZiB3aWR0aCBvZiB0aGUgYWN0dWFsIHNoYXBlIGRpc2NsdWRpbmcgdGhlIHBvcnRzXHJcbiAgICAgICAgICAgICAgICB2YXIgc2hhcGVIVyA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gNTAgLyBNYXRoLmFicyhwb3J0LnkpIDogNTAgLyBNYXRoLmFicyhwb3J0LngpO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBjbGFzcyBvZiB0aGUgbm9kZVxyXG4gICAgICAgICAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgY2xhc3MgaXMgb25lIG9mIHByb2Nlc3MsIG9taXR0ZWQgcHJvY2VzcyBvciB1bmNlcnRhaW4gcHJvY2VzcyB0aGVuIHRoZSB0eXBlIG9mIGFjdHVhbCBzaGFwZSBpcyAncmVjdGFuZ2xlJyBlbHNlIGl0IGlzICdjaXJjbGUnXHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IF9jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpID8gJ3JlY3RhbmdsZScgOiAnY2lyY2xlJztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSBwb2x5Z29uIHN0cmluZyB3aXRoIGFib3ZlIHBhcmFtZXRlcnMgYW5kIHJldHVybiBpdFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlU2hhcGVXaXRoUG9ydFN0cmluZygwLjAxLCBzaGFwZUhXLCB0eXBlLCBvcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIFRoaXMgZWxlbWVudCBpcyBub3QgZXhwZWN0ZWQgdG8gaGF2ZSBhIHBveWdvbmlhbCBzaGFwZSAoQmVjYXVzZSBpdCBkb2VzIG5vdCBoYXZlIDIgcG9ydHMpIGp1c3QgcmV0dXJuIGEgdHJpdmlhbCBzdHJpbmcgaGVyZSBub3QgdG8gaGF2ZSBhIHJ1biB0aW1lIGJ1Z1xyXG4gICAgICAgICAgICAgIHJldHVybiAnLTEgLTEgMSAxIDEgMCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdwZXJ0dXJiaW5nIGFnZW50J11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIC0wLjUsIDAsICAtMSwgMSwgICAxLCAxLCAgIDAuNSwgMCwgMSwgLTEnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ndGFnJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc2hhcGUtcG9seWdvbi1wb2ludHMnOiAnLTEsIC0xLCAgIDAuMjUsIC0xLCAgIDEsIDAsICAgIDAuMjUsIDEsICAgIC0xLCAxJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDMuMjUsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLFxyXG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICd0ZXh0LW1hcmdpbi15JyA6IC0xICogb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50W2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3BhZGRpbmcnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG91bmRQYWRkaW5ncygpICsgb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6Y2hpbGRsZXNzW2Jib3hdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3dpZHRoJzogJ2RhdGEoYmJveC53KScsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAnZGF0YShiYm94LmgpJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAzNixcclxuICAgICAgICAgICAgJ2JvcmRlci1zdHlsZSc6ICdkYXNoZWQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpzZWxlY3RlZFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzAwMCcsXHJcbiAgICAgICAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlOmFjdGl2ZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzE0J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnY3VydmUtc3R5bGUnOiAnYmV6aWVyJyxcclxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWZpbGwnOiAnaG9sbG93JyxcclxuICAgICAgICAgICAgJ3dpZHRoJzogMS4yNSxcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjNTU1JyxcclxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcjZDY3NjE0JztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZS5jc3MoJ2xpbmUtY29sb3InKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Fycm93LXNjYWxlJzogMS4yNVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2UuY3ktZXhwYW5kLWNvbGxhcHNlLW1ldGEtZWRnZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNDNEM0QzQnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZTpzZWxlY3RlZFwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZTphY3RpdmVcIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC43LCAnb3ZlcmxheS1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICc4J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0ZXh0LXJvdGF0aW9uJzogJ2F1dG9yb3RhdGUnLFxyXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLXNoYXBlJzogJ3JlY3RhbmdsZScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJvcmRlci1vcGFjaXR5JzogJzEnLFxyXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItd2lkdGgnOiAnMScsXHJcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtY29sb3InOiAnd2hpdGUnLFxyXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLW9wYWNpdHknOiAnMSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdjb25zdW1wdGlvbiddW2NhcmRpbmFsaXR5ID4gMF1cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnc291cmNlLWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnJyArIGVsZS5kYXRhKCdjYXJkaW5hbGl0eScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnc291cmNlLXRleHQtbWFyZ2luLXknOiAnLTEwJyxcclxuICAgICAgICAgICAgJ3NvdXJjZS10ZXh0LW9mZnNldCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDYXJkaW5hbGl0eURpc3RhbmNlKGVsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdwcm9kdWN0aW9uJ11bY2FyZGluYWxpdHkgPiAwXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0YXJnZXQtbGFiZWwnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICcnICsgZWxlLmRhdGEoJ2NhcmRpbmFsaXR5Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1tYXJnaW4teSc6ICctMTAnLFxyXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtb2Zmc2V0JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdXCIpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ3RhcmdldC1hcnJvdy1zaGFwZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeUFycm93U2hhcGUoZWxlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3NvdXJjZS1hcnJvdy1zaGFwZSc6ICdub25lJyxcclxuICAgICAgICAgICAgJ3NvdXJjZS1lbmRwb2ludCc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVuZFBvaW50KGVsZSwgJ3NvdXJjZScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAndGFyZ2V0LWVuZHBvaW50JzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RW5kUG9pbnQoZWxlLCAndGFyZ2V0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzPSdpbmhpYml0aW9uJ11cIilcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctZmlsbCc6ICdmaWxsZWQnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdzZWxlY3Rpb24tYm94LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xyXG4gICAgICAgICAgfSk7XHJcbn07XHJcbiIsIi8qXHJcbiAqIFJlbmRlciBzYmduIHNwZWNpZmljIHNoYXBlcyB3aGljaCBhcmUgbm90IHN1cHBvcnRlZCBieSBjeXRvc2NhcGUuanMgY29yZVxyXG4gKi9cclxuXHJcbnZhciB0cnVuY2F0ZVRleHQgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBjeXRvc2NhcGUgPSBsaWJzLmN5dG9zY2FwZTtcclxuXHJcbnZhciBjeU1hdGggPSBjeXRvc2NhcGUubWF0aDtcclxudmFyIGN5QmFzZU5vZGVTaGFwZXMgPSBjeXRvc2NhcGUuYmFzZU5vZGVTaGFwZXM7XHJcbnZhciBjeVN0eWxlUHJvcGVydGllcyA9IGN5dG9zY2FwZS5zdHlsZVByb3BlcnRpZXM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgJCQgPSBjeXRvc2NhcGU7XHJcbiAgXHJcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanMgYW5kIG1vZGlmaWVkXHJcbiAgdmFyIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGggPSBmdW5jdGlvbihcclxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHJhZGl1cyApe1xyXG5cclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcbiAgICB2YXIgY29ybmVyUmFkaXVzID0gcmFkaXVzIHx8IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyggd2lkdGgsIGhlaWdodCApO1xyXG5cclxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XHJcblxyXG4gICAgLy8gU3RhcnQgYXQgdG9wIG1pZGRsZVxyXG4gICAgY29udGV4dC5tb3ZlVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XHJcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcclxuICAgIGNvbnRleHQuYXJjVG8oIHggKyBoYWxmV2lkdGgsIHkgLSBoYWxmSGVpZ2h0LCB4ICsgaGFsZldpZHRoLCB5LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXHJcbiAgICBjb250ZXh0LmFyY1RvKCB4ICsgaGFsZldpZHRoLCB5ICsgaGFsZkhlaWdodCwgeCwgeSArIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gQXJjIGZyb20gYm90dG9tIHRvIGxlZnQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHggLSBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xyXG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxyXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSAtIGhhbGZIZWlnaHQsIHgsIHkgLSBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMgKTtcclxuICAgIC8vIEpvaW4gbGluZVxyXG4gICAgY29udGV4dC5saW5lVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XHJcblxyXG5cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgfTtcclxuICBcclxuICAvLyBUYWtlbiBmcm9tIGN5dG9zY2FwZS5qc1xyXG4gIHZhciBkcmF3UG9seWdvblBhdGggPSBmdW5jdGlvbihcclxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHBvaW50cyApe1xyXG5cclxuICAgIHZhciBoYWxmVyA9IHdpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmSCA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgaWYoIGNvbnRleHQuYmVnaW5QYXRoICl7IGNvbnRleHQuYmVnaW5QYXRoKCk7IH1cclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbyggeCArIGhhbGZXICogcG9pbnRzWzBdLCB5ICsgaGFsZkggKiBwb2ludHNbMV0gKTtcclxuXHJcbiAgICBmb3IoIHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLyAyOyBpKysgKXtcclxuICAgICAgY29udGV4dC5saW5lVG8oIHggKyBoYWxmVyAqIHBvaW50c1sgaSAqIDJdLCB5ICsgaGFsZkggKiBwb2ludHNbIGkgKiAyICsgMV0gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gIH07XHJcbiAgXHJcbiAgdmFyIHNiZ25TaGFwZXMgPSAkJC5zYmduLnNiZ25TaGFwZXMgPSB7XHJcbiAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcclxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciB0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlcyA9ICQkLnNiZ24udG90YWxseU92ZXJyaWRlbk5vZGVTaGFwZXMgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgdW5pdE9mSW5mb1JhZGl1cyA9IDQ7XHJcbiAgdmFyIHN0YXRlVmFyUmFkaXVzID0gMTU7XHJcbiAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyA9IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLFxyXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCkge1xyXG5cclxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXHJcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xyXG5cclxuICAgIHZhciB1cFdpZHRoID0gMCwgZG93bldpZHRoID0gMDtcclxuICAgIHZhciBib3hQYWRkaW5nID0gMTAsIGJldHdlZW5Cb3hQYWRkaW5nID0gNTtcclxuICAgIHZhciBiZWdpblBvc1kgPSBoZWlnaHQgLyAyLCBiZWdpblBvc1ggPSB3aWR0aCAvIDI7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvcy5zb3J0KCQkLnNiZ24uY29tcGFyZVN0YXRlcyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XHJcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gc3RhdGUuYmJveC53O1xyXG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XHJcbi8vICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHN0YXRlLmJib3gueTtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHJlbGF0aXZlWVBvcyA8IDApIHtcclxuICAgICAgICBpZiAodXBXaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyB1cFdpZHRoICsgc3RhdGVXaWR0aCAvIDI7XHJcbiAgICAgICAgICBzdGF0ZUNlbnRlclkgPSBjZW50ZXJZIC0gYmVnaW5Qb3NZO1xyXG5cclxuICAgICAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5jc3MoJ3RleHQtb3BhY2l0eScpICogbm9kZS5jc3MoJ29wYWNpdHknKSxcclxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcclxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgdW5pdE9mSW5mb1JhZGl1cykpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dDtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB1cFdpZHRoID0gdXBXaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZVlQb3MgPiAwKSB7XHJcbiAgICAgICAgaWYgKGRvd25XaWR0aCArIHN0YXRlV2lkdGggPCB3aWR0aCkge1xyXG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyBkb3duV2lkdGggKyBzdGF0ZVdpZHRoIC8gMjtcclxuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgKyBiZWdpblBvc1k7XHJcblxyXG4gICAgICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xyXG5cclxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcclxuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xyXG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvd25XaWR0aCA9IGRvd25XaWR0aCArIHdpZHRoICsgYm94UGFkZGluZztcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcclxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcclxuXHJcbiAgICAgIC8vdXBkYXRlIG5ldyBzdGF0ZSBhbmQgaW5mbyBwb3NpdGlvbihyZWxhdGl2ZSB0byBub2RlIGNlbnRlcilcclxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICBzdGF0ZS5iYm94LnkgPSAoc3RhdGVDZW50ZXJZIC0gY2VudGVyWSkgKiAxMDAgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd1N0YXRlVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcclxuICAgIHZhciBzdGF0ZVZhcmlhYmxlID0gdGV4dFByb3Auc3RhdGUudmFyaWFibGUgfHwgJyc7XHJcblxyXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgPyBcIkBcIiArIHN0YXRlVmFyaWFibGVcclxuICAgICAgICAgICAgOiBcIlwiKTtcclxuXHJcbiAgICB2YXIgZm9udFNpemUgPSA5OyAvLyBwYXJzZUludCh0ZXh0UHJvcC5oZWlnaHQgLyAxLjUpO1xyXG5cclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGVMYWJlbDtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xyXG4gICAgdmFyIGZvbnRTaXplID0gOTsgLy8gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcclxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcclxuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XHJcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wLCB0cnVuY2F0ZSkge1xyXG4gICAgdmFyIG9sZEZvbnQgPSBjb250ZXh0LmZvbnQ7XHJcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xyXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRleHRQcm9wLmNvbG9yO1xyXG4gICAgdmFyIG9sZE9wYWNpdHkgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XHJcbiAgICB2YXIgdGV4dDtcclxuICAgIFxyXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcclxuICAgIFxyXG4gICAgaWYgKHRydW5jYXRlID09IGZhbHNlKSB7XHJcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRleHQgPSB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGNvbnRleHQuZm9udCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnRleHQuZmlsbFRleHQodGV4dCwgdGV4dFByb3AuY2VudGVyWCwgdGV4dFByb3AuY2VudGVyWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRPcGFjaXR5O1xyXG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gIH07XHJcblxyXG4gIGN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xyXG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3cocG9pbnQxWzBdIC0gcG9pbnQyWzBdLCAyKSArIE1hdGgucG93KHBvaW50MVsxXSAtIHBvaW50MlsxXSwgMik7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RhbmNlKTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNvbG9ycyA9IHtcclxuICAgIGNsb25lOiBcIiNhOWE5YTlcIlxyXG4gIH07XHJcblxyXG5cclxuICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpIHtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGggJiYgaSA8IDQ7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcclxuICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXHJcbiAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxyXG4gICAgICAgIC8vdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIHRleHRQcm9wLnN0YXRlID0gc3RhdGUuc3RhdGU7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcclxuICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIHRleHRQcm9wLmxhYmVsID0gc3RhdGUubGFiZWwudGV4dCB8fCAnJztcclxuICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kXHJcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50ID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIG5vZGUsIHRocmVzaG9sZCwgcG9pbnRzLCBjb3JuZXJSYWRpdXMpIHtcclxuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuXHJcbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCB0b3BcclxuICAgIGlmIChjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIHBvaW50cyxcclxuICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSAtIGNvcm5lclJhZGl1cyAvIDIsIHdpZHRoLCBoZWlnaHQgLSBjb3JuZXJSYWRpdXMgLyAzLCBbMCwgLTFdLFxyXG4gICAgICAgICAgICBwYWRkaW5nKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCBib3R0b21cclxuICAgIGlmIChjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIHBvaW50cyxcclxuICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSArIGhlaWdodCAvIDIgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXMsIGNvcm5lclJhZGl1cywgWzAsIC0xXSxcclxuICAgICAgICAgICAgcGFkZGluZykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jaGVjayBlbGxpcHNlc1xyXG4gICAgdmFyIGNoZWNrSW5FbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcclxuICAgICAgeCAtPSBjZW50ZXJYO1xyXG4gICAgICB5IC09IGNlbnRlclk7XHJcblxyXG4gICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcclxuICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGJvdHRvbSByaWdodCBxdWFydGVyIGNpcmNsZVxyXG4gICAgaWYgKGNoZWNrSW5FbGxpcHNlKHgsIHksXHJcbiAgICAgICAgICAgIGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjb3JuZXJSYWRpdXMgKiAyLCBjb3JuZXJSYWRpdXMgKiAyLCBwYWRkaW5nKSkge1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgYm90dG9tIGxlZnQgcXVhcnRlciBjaXJjbGVcclxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxyXG4gICAgICAgICAgICBjZW50ZXJYIC0gd2lkdGggLyAyICsgY29ybmVyUmFkaXVzLFxyXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcclxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICAvL3dlIG5lZWQgdG8gZm9yY2Ugb3BhY2l0eSB0byAxIHNpbmNlIHdlIG1pZ2h0IGhhdmUgc3RhdGUgYW5kIGluZm8gYm94ZXMuXHJcbiAgLy9oYXZpbmcgb3BhcXVlIG5vZGVzIHdoaWNoIGhhdmUgc3RhdGUgYW5kIGluZm8gYm94ZXMgZ2l2ZXMgdW5wbGVhc2VudCByZXN1bHRzLlxyXG4gICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCkge1xyXG4gICAgdmFyIHBhcmVudE9wYWNpdHkgPSBub2RlLmVmZmVjdGl2ZU9wYWNpdHkoKTtcclxuICAgIGlmIChwYXJlbnRPcGFjaXR5ID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYShcIlxyXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzBdICsgXCIsXCJcclxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVsxXSArIFwiLFwiXHJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMl0gKyBcIixcIlxyXG4gICAgICAgICAgICArICgxICogbm9kZS5jc3MoJ29wYWNpdHknKSAqIHBhcmVudE9wYWNpdHkpICsgXCIpXCI7XHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoID0gZnVuY3Rpb24gKFxyXG4gICAgICAgICAgY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcbiAgICAvL3ZhciBjb3JuZXJSYWRpdXMgPSAkJC5tYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKGhhbGZXaWR0aCwgaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcclxuXHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgIC8vIFN0YXJ0IGF0IHRvcCBtaWRkbGVcclxuICAgIGNvbnRleHQubW92ZVRvKDAsIC1oYWxmSGVpZ2h0KTtcclxuICAgIC8vIEFyYyBmcm9tIG1pZGRsZSB0b3AgdG8gcmlnaHQgc2lkZVxyXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCBoYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBBcmMgZnJvbSByaWdodCBzaWRlIHRvIGJvdHRvbVxyXG4gICAgY29udGV4dC5hcmNUbyhoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIDAsIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXHJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAvLyBBcmMgZnJvbSBsZWZ0IHNpZGUgdG8gdG9wQm9yZGVyXHJcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCAwLCAtaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIC8vIEpvaW4gbGluZVxyXG4gICAgY29udGV4dC5saW5lVG8oMCwgLWhhbGZIZWlnaHQpO1xyXG5cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLXgsIC15KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbCA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsUGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG5cclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblggPSAtMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgdmFyIG1hcmtlckVuZFggPSAwO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcclxuXHJcbiAgICAgIGNvbnRleHQubW92ZVRvKG1hcmtlckJlZ2luWCwgbWFya2VyQmVnaW5ZKTtcclxuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XHJcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDMgKiBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcclxuXHJcbiAgICAgIGNvbnRleHQuc2NhbGUoMiAvIHdpZHRoLCAyIC8gaGVpZ2h0KTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgZnVuY3Rpb24gc2ltcGxlQ2hlbWljYWxSaWdodENsb25lKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xyXG4gICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XHJcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICQkLnNiZ24uY29sb3JzLmNsb25lO1xyXG5cclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgIHZhciBtYXJrZXJCZWdpblggPSAwO1xyXG4gICAgICB2YXIgbWFya2VyQmVnaW5ZID0gTWF0aC5jb3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XHJcbiAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xyXG5cclxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcclxuICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgTWF0aC5QSSAvIDYsIDMgKiBNYXRoLlBJIC8gNik7XHJcblxyXG4gICAgICBjb250ZXh0LnNjYWxlKDIgLyB3aWR0aCwgMiAvIGhlaWdodCk7XHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0VsbGlwc2VQYXRoID0gZnVuY3Rpb24gKGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKSB7XHJcbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xyXG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICBjb250ZXh0Lm1vdmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuICAgIGNvbnRleHQubGluZVRvKGhhbGZXaWR0aCwgMCk7XHJcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCwgaGFsZkhlaWdodCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcclxuICAgIGNvbnRleHQubGluZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaXNNdWx0aW1lciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xyXG4gICAgaWYgKHNiZ25DbGFzcyAmJiBzYmduQ2xhc3MuaW5kZXhPZihcIm11bHRpbWVyXCIpICE9IC0xKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICAvL3RoaXMgZnVuY3Rpb24gaXMgY3JlYXRlZCB0byBoYXZlIHNhbWUgY29ybmVyIGxlbmd0aCB3aGVuXHJcbiAgLy9jb21wbGV4J3Mgd2lkdGggb3IgaGVpZ2h0IGlzIGNoYW5nZWRcclxuICAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzID0gZnVuY3Rpb24gKGNvcm5lckxlbmd0aCwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgLy9jcCBzdGFuZHMgZm9yIGNvcm5lciBwcm9wb3J0aW9uXHJcbiAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XHJcbiAgICB2YXIgY3BZID0gY29ybmVyTGVuZ3RoIC8gaGVpZ2h0O1xyXG5cclxuICAgIHZhciBjb21wbGV4UG9pbnRzID0gWy0xICsgY3BYLCAtMSwgLTEsIC0xICsgY3BZLCAtMSwgMSAtIGNwWSwgLTEgKyBjcFgsXHJcbiAgICAgIDEsIDEgLSBjcFgsIDEsIDEsIDEgLSBjcFksIDEsIC0xICsgY3BZLCAxIC0gY3BYLCAtMV07XHJcblxyXG4gICAgcmV0dXJuIGNvbXBsZXhQb2ludHM7XHJcbiAgfTtcclxuXHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NvdXJjZSBhbmQgc2luaycpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdudWNsZWljIGFjaWQgZmVhdHVyZScpO1xyXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdjb21wbGV4Jyk7XHJcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ21hY3JvbW9sZWN1bGUnKTtcclxuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgnc2ltcGxlIGNoZW1pY2FsJyk7XHJcblxyXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuc2ltcGxlQ2hlbWljYWwoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nLCBoZWlnaHQgLSBwYWRkaW5nLCBjbG9uZU1hcmtlciwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcclxuXHJcbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNpbXBsZUNoZW1pY2FsKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAtIHBhZGRpbmcsIGhlaWdodCAtIHBhZGRpbmcsIGNsb25lTWFya2VyLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4vLyAgICAgICAgdmFyIG5vZGVQcm9wID0geydsYWJlbCc6IGxhYmVsLCAnY2VudGVyWCc6IGNlbnRlclgsICdjZW50ZXJZJzogY2VudGVyWSxcclxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XHJcbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcclxuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZUFuZEluZm9zKG5vZGUsIGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0LCB4LCB5LCBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBtdWx0aW1lclBhZGRpbmc6IDUsXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5tYWNyb21vbGVjdWxlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuXHJcbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxyXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcclxuICAgICAgfSxcclxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibWFjcm9tb2xlY3VsZVwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ucm91bmRSZWN0YW5nbGVJbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNvcm5lclJhZGl1cywgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzLCBwYWRkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcywgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcclxuXHJcbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xyXG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoeCwgeSwgcGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0gPSB7XHJcbiAgICAgIHBvaW50czogW10sXHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgY29ybmVyTGVuZ3RoOiAxMixcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxyXG4gICAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjb3JuZXJMZW5ndGgsIGNsb25lTWFya2VyLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIuY29tcGxleChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcclxuICAgICAgICAkJC5zYmduLmZvcmNlT3BhY2l0eVRvT25lKG5vZGUsIGNvbnRleHQpO1xyXG4gICAgICAgICQkLnNiZ24uZHJhd0NvbXBsZXhTdGF0ZUFuZEluZm8oY29udGV4dCwgbm9kZSwgc3RhdGVBbmRJbmZvcywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcclxuICAgICAgfSxcclxuLy8gICAgICBpbnRlcnNlY3RMaW5lOiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uaW50ZXJzZWN0TGluZSxcclxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XHJcbiAgICAgICAgdmFyIGNvcm5lckxlbmd0aCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLmNvcm5lckxlbmd0aDtcclxuXHJcbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcclxuICAgICAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxyXG4gICAgICAgICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciB3aWR0aCA9IChub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IChub2RlLm91dGVySGVpZ2h0KCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkpICsgdGhyZXNob2xkO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XHJcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcclxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIFswLCAtMV0sIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5TWF0aC5wb2ludEluc2lkZVBvbHlnb24oeCwgeSxcclxuICAgICAgICAgICAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBbMCwgLTFdLCBwYWRkaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXHJcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIC8vYWRkIG11bHRpbWVyIHNoYXBlXHJcbiAgICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XHJcblxyXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VudGVyWCxcclxuICAgICAgICAgICAgICAgIGNlbnRlclksIGNvcm5lclJhZGl1cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xyXG5cclxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXHJcbi8vICAgICAgICAgICdvcGFjaXR5Jzogbm9kZS5fcHJpdmF0ZS5zdHlsZVsndGV4dC1vcGFjaXR5J10udmFsdWUsICd3aWR0aCc6IG5vZGUud2lkdGgoKSwgJ2hlaWdodCc6IG5vZGUuaGVpZ2h0KCl9O1xyXG5cclxuLy8gICAgICAgICQkLnNiZ24uZHJhd0R5bmFtaWNMYWJlbFRleHQoY29udGV4dCwgbm9kZVByb3ApO1xyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XHJcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICB9LFxyXG4gICAgICBkcmF3UGF0aDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcclxuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcclxuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXHJcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLCBjb3JuZXJSYWRpdXMpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcclxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XHJcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcclxuICAgICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb25zID0gc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMuY29uY2F0KG5vZGVJbnRlcnNlY3RMaW5lcyxcclxuICAgICAgICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wibnVjbGVpYyBhY2lkIGZlYXR1cmVcIl0ubXVsdGltZXJQYWRkaW5nO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgbm9kZSwgdGhyZXNob2xkLCB0aGlzLnBvaW50cywgY29ybmVyUmFkaXVzKTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XHJcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcclxuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9ICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50KHgsIHksXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdID0ge1xyXG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzKDQsIDApLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xyXG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICAgIHZhciBwdHMgPSBjeUJhc2VOb2RlU2hhcGVzW1wic291cmNlIGFuZCBzaW5rXCJdLnBvaW50cztcclxuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XHJcblxyXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggKiBNYXRoLnNxcnQoMikgLyAyLCBoZWlnaHQgKiBNYXRoLnNxcnQoMikgLyAyKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ocHRzWzJdLCBwdHNbM10pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHB0c1s2XSwgcHRzWzddKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNjYWxlKDIgLyAod2lkdGggKiBNYXRoLnNxcnQoMikpLCAyIC8gKGhlaWdodCAqIE1hdGguc3FydCgyKSkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBpbnRlcnNlY3RMaW5lOiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lLFxyXG4gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uZHJhd0VsbGlwc2UgPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgLy8kJC5zYmduLmRyYXdFbGxpcHNlUGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIC8vY29udGV4dC5maWxsKCk7XHJcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhdyhjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmNsb25lTWFya2VyID0ge1xyXG4gICAgc2ltcGxlQ2hlbWljYWw6IGZ1bmN0aW9uIChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxyXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xyXG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBNYXRoLm1pbih3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICB2YXIgZmlyc3RDaXJjbGVDZW50ZXJYID0gY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgZmlyc3RDaXJjbGVDZW50ZXJZID0gY2VudGVyWTtcclxuICAgICAgICB2YXIgc2Vjb25kQ2lyY2xlQ2VudGVyWCA9IGNlbnRlclggKyB3aWR0aCAvIDIgLSBjb3JuZXJSYWRpdXM7XHJcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xyXG5cclxuICAgICAgICBzaW1wbGVDaGVtaWNhbExlZnRDbG9uZShjb250ZXh0LCBmaXJzdENpcmNsZUNlbnRlclgsIGZpcnN0Q2lyY2xlQ2VudGVyWSxcclxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgc2ltcGxlQ2hlbWljYWxSaWdodENsb25lKGNvbnRleHQsIHNlY29uZENpcmNsZUNlbnRlclgsIHNlY29uZENpcmNsZUNlbnRlclksXHJcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XHJcblxyXG4gICAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XHJcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgdmFyIHJlY1BvaW50cyA9IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCk7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzIC8gNCAqIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoIC0gMiAqIGNvcm5lclJhZGl1cztcclxuICAgICAgICB2YXIgY2xvbmVIZWlnaHQgPSBjb3JuZXJSYWRpdXMgLyAyO1xyXG5cclxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCwgY2xvbmVYLCBjbG9uZVksIGNsb25lV2lkdGgsIGNsb25lSGVpZ2h0LCByZWNQb2ludHMpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbnVjbGVpY0FjaWRGZWF0dXJlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAvIDQ7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzICogaGVpZ2h0IC8gODtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gY3lNYXRoLmdldFJvdW5kUmVjdGFuZ2xlUmFkaXVzKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZShjb250ZXh0LCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLCBjb3JuZXJSYWRpdXMsIG9wYWNpdHkpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYWNyb21vbGVjdWxlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5udWNsZWljQWNpZEZlYXR1cmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSk7XHJcbiAgICB9LFxyXG4gICAgY29tcGxleDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcclxuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgY3BYID0gY29ybmVyTGVuZ3RoIC8gd2lkdGg7XHJcbiAgICAgICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcclxuICAgICAgICB2YXIgY2xvbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGhlaWdodCAqIGNwWSAvIDI7XHJcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XHJcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY2xvbmVIZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy0xLCAtMSwgMSwgLTEsIDEgLSBjcFgsIDEsIC0xICsgY3BYLCAxXTtcclxuXHJcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcclxuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xyXG5cclxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGNsb25lWCwgY2xvbmVZLFxyXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50ID0gZnVuY3Rpb24gKHBvaW50LCBpbnRlcnNlY3Rpb25zKSB7XHJcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMClcclxuICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgIHZhciBjbG9zZXN0SW50ZXJzZWN0aW9uID0gW107XHJcbiAgICB2YXIgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJzZWN0aW9ucy5sZW5ndGg7IGkgPSBpICsgMikge1xyXG4gICAgICB2YXIgY2hlY2tQb2ludCA9IFtpbnRlcnNlY3Rpb25zW2ldLCBpbnRlcnNlY3Rpb25zW2kgKyAxXV07XHJcbiAgICAgIHZhciBkaXN0YW5jZSA9IGN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZShwb2ludCwgY2hlY2tQb2ludCk7XHJcblxyXG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xyXG4gICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgY2xvc2VzdEludGVyc2VjdGlvbiA9IGNoZWNrUG9pbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xvc2VzdEludGVyc2VjdGlvbjtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLm51Y2xlaWNBY2lkSW50ZXJzZWN0aW9uTGluZSA9IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBub2RlWCwgbm9kZVksIGNvcm5lclJhZGl1cykge1xyXG4gICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xyXG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xyXG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcblxyXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCB0b3BTdGFydFgsIHRvcFN0YXJ0WSwgdG9wRW5kWCwgdG9wRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlnaHQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxyXG4gICAge1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcclxuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tRW5kWSA9IGJvdHRvbVN0YXJ0WTtcclxuXHJcbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0RW5kWCA9IGxlZnRTdGFydFg7XHJcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgbGVmdFN0YXJ0WCwgbGVmdFN0YXJ0WSwgbGVmdEVuZFgsIGxlZnRFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpbnRlcnNlY3Rpb25zIHdpdGggYXJjIHNlZ21lbnRzLCB3ZSBoYXZlIG9ubHkgdHdvIGFyY3MgZm9yXHJcbiAgICAvL251Y2xlaWMgYWNpZCBmZWF0dXJlc1xyXG4gICAgdmFyIGFyY0ludGVyc2VjdGlvbnM7XHJcblxyXG4gICAgLy8gQm90dG9tIFJpZ2h0XHJcbiAgICB7XHJcbiAgICAgIHZhciBib3R0b21SaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLFxyXG4gICAgICAgICAgICAgIGJvdHRvbVJpZ2h0Q2VudGVyWCwgYm90dG9tUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xyXG4gICAgICAgIHJldHVybiBbYXJjSW50ZXJzZWN0aW9uc1swXSwgYXJjSW50ZXJzZWN0aW9uc1sxXV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4LCB5LCBub2RlWCwgbm9kZVksXHJcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSBib3R0b21MZWZ0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPj0gYm90dG9tTGVmdENlbnRlclkpIHtcclxuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcclxuICB9O1xyXG5cclxuICAvL3RoaXMgZnVuY3Rpb24gZ2l2ZXMgdGhlIGludGVyc2VjdGlvbnMgb2YgYW55IGxpbmUgd2l0aCBhIHJvdW5kIHJlY3RhbmdsZSBcclxuICAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZSA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBub2RlWCwgbm9kZVksIHdpZHRoLCBoZWlnaHQsIGNvcm5lclJhZGl1cywgcGFkZGluZykge1xyXG5cclxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIHN0cmFpZ2h0IGxpbmUgc2VnbWVudHNcclxuICAgIHZhciBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gW107XHJcblxyXG4gICAgLy8gVG9wIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcclxuICAgICAgdmFyIHRvcFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciB0b3BFbmRYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcclxuXHJcbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cclxuICAgIHtcclxuICAgICAgdmFyIHJpZ2h0U3RhcnRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgcmlnaHRFbmRYID0gcmlnaHRTdGFydFg7XHJcbiAgICAgIHZhciByaWdodEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gc2VnbWVudCwgbGVmdCB0byByaWdodFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgYm90dG9tU3RhcnRZID0gbm9kZVkgKyBoYWxmSGVpZ2h0ICsgcGFkZGluZztcclxuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xyXG5cclxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgYm90dG9tU3RhcnRYLCBib3R0b21TdGFydFksIGJvdHRvbUVuZFgsIGJvdHRvbUVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGVmdCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXHJcbiAgICB7XHJcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xyXG4gICAgICB2YXIgbGVmdFN0YXJ0WSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1cyAtIHBhZGRpbmc7XHJcbiAgICAgIHZhciBsZWZ0RW5kWCA9IGxlZnRTdGFydFg7XHJcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XHJcblxyXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxyXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50c1xyXG4gICAgdmFyIGFyY0ludGVyc2VjdGlvbnM7XHJcblxyXG4gICAgLy8gVG9wIExlZnRcclxuICAgIHtcclxuICAgICAgdmFyIHRvcExlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XHJcbiAgICAgIHZhciB0b3BMZWZ0Q2VudGVyWSA9IG5vZGVZIC0gaGFsZkhlaWdodCArIGNvcm5lclJhZGl1c1xyXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXHJcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXHJcbiAgICAgICAgICAgICAgdG9wTGVmdENlbnRlclgsIHRvcExlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA8PSB0b3BMZWZ0Q2VudGVyWFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wTGVmdENlbnRlclkpIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBUb3AgUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIHRvcFJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgdG9wUmlnaHRDZW50ZXJZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICB0b3BSaWdodENlbnRlclgsIHRvcFJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gdG9wUmlnaHRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA8PSB0b3BSaWdodENlbnRlclkpIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gUmlnaHRcclxuICAgIHtcclxuICAgICAgdmFyIGJvdHRvbVJpZ2h0Q2VudGVyWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzO1xyXG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gYm90dG9tUmlnaHRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21SaWdodENlbnRlclkpIHtcclxuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3R0b20gTGVmdFxyXG4gICAge1xyXG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcclxuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXHJcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcclxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcclxuICAgICAgICAgICAgICBib3R0b21MZWZ0Q2VudGVyWCwgYm90dG9tTGVmdENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IGJvdHRvbUxlZnRDZW50ZXJYXHJcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xyXG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdOyAvLyBpZiBub3RoaW5nXHJcbiAgfTtcclxuXHJcbiAgJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSA9IGZ1bmN0aW9uIChcclxuICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nKSB7XHJcblxyXG4gICAgdmFyIHcgPSB3aWR0aCAvIDIgKyBwYWRkaW5nO1xyXG4gICAgdmFyIGggPSBoZWlnaHQgLyAyICsgcGFkZGluZztcclxuICAgIHZhciBhbiA9IGNlbnRlclg7XHJcbiAgICB2YXIgYm4gPSBjZW50ZXJZO1xyXG5cclxuICAgIHZhciBkID0gW3gyIC0geDEsIHkyIC0geTFdO1xyXG5cclxuICAgIHZhciBtID0gZFsxXSAvIGRbMF07XHJcbiAgICB2YXIgbiA9IC0xICogbSAqIHgyICsgeTI7XHJcbiAgICB2YXIgYSA9IGggKiBoICsgdyAqIHcgKiBtICogbTtcclxuICAgIHZhciBiID0gLTIgKiBhbiAqIGggKiBoICsgMiAqIG0gKiBuICogdyAqIHcgLSAyICogYm4gKiBtICogdyAqIHc7XHJcbiAgICB2YXIgYyA9IGFuICogYW4gKiBoICogaCArIG4gKiBuICogdyAqIHcgLSAyICogYm4gKiB3ICogdyAqIG4gK1xyXG4gICAgICAgICAgICBibiAqIGJuICogdyAqIHcgLSBoICogaCAqIHcgKiB3O1xyXG5cclxuICAgIHZhciBkaXNjcmltaW5hbnQgPSBiICogYiAtIDQgKiBhICogYztcclxuXHJcbiAgICBpZiAoZGlzY3JpbWluYW50IDwgMCkge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQxID0gKC1iICsgTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcclxuICAgIHZhciB0MiA9ICgtYiAtIE1hdGguc3FydChkaXNjcmltaW5hbnQpKSAvICgyICogYSk7XHJcblxyXG4gICAgdmFyIHhNaW4gPSBNYXRoLm1pbih0MSwgdDIpO1xyXG4gICAgdmFyIHhNYXggPSBNYXRoLm1heCh0MSwgdDIpO1xyXG5cclxuICAgIHZhciB5TWluID0gbSAqIHhNaW4gLSBtICogeDIgKyB5MjtcclxuICAgIHZhciB5TWF4ID0gbSAqIHhNYXggLSBtICogeDIgKyB5MjtcclxuXHJcbiAgICByZXR1cm4gW3hNaW4sIHlNaW4sIHhNYXgsIHlNYXhdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHkpIHtcclxuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xyXG4gICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XHJcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xyXG5cclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuXHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gc3RhdGUuYmJveC5oO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVFbGxpcHNlKHgsIHksIGNlbnRlclgsIGNlbnRlclksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVJbnRlcnNlY3RMaW5lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnMuY29uY2F0KHN0YXRlSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBzdGF0ZUNvdW50Kys7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIgJiYgaW5mb0NvdW50IDwgMikgey8vZHJhdyByZWN0YW5nbGVcclxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcclxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgNSwgcGFkZGluZyk7XHJcblxyXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChpbmZvSW50ZXJzZWN0TGluZXMpO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApXHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH07XHJcblxyXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xyXG4gICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XHJcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcclxuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xyXG5cclxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcclxuLy8gICAgdGhyZXNob2xkID0gcGFyc2VGbG9hdCh0aHJlc2hvbGQpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xyXG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHBhcnNlRmxvYXQoc3RhdGUuYmJveC53KSArIHRocmVzaG9sZDtcclxuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LmgpICsgdGhyZXNob2xkO1xyXG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcclxuICAgICAgdmFyIHN0YXRlQ2VudGVyWSA9IHN0YXRlLmJib3gueSAqIG5vZGUuaGVpZ2h0KCkgLyAxMDAgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXHJcbiAgICAgICAgdmFyIHN0YXRlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGVDaGVja1BvaW50ID09IHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgc3RhdGVDb3VudCsrO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXHJcbiAgICAgICAgdmFyIGluZm9DaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcInJvdW5kcmVjdGFuZ2xlXCJdLmNoZWNrUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xyXG5cclxuICAgICAgICBpZiAoaW5mb0NoZWNrUG9pbnQgPT0gdHJ1ZSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBpbmZvQ291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICAkJC5zYmduLmlzTm9kZVNoYXBlVG90YWxseU92ZXJyaWRlbiA9IGZ1bmN0aW9uIChyZW5kZXIsIG5vZGUpIHtcclxuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufTtcclxuIiwiLypcclxuICogQ29tbW9uIHV0aWxpdGllcyBmb3IgZWxlbWVudHMgaW5jbHVkZXMgYm90aCBnZW5lcmFsIHV0aWxpdGllcyBhbmQgc2JnbiBzcGVjaWZpYyB1dGlsaXRpZXMgXHJcbiAqL1xyXG5cclxudmFyIHRydW5jYXRlVGV4dCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKS50cnVuY2F0ZVRleHQ7XHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0ge1xyXG4gICAgLy90aGUgbGlzdCBvZiB0aGUgZWxlbWVudCBjbGFzc2VzIGhhbmRsZWQgYnkgdGhlIHRvb2xcclxuICAgIGhhbmRsZWRFbGVtZW50czoge1xyXG4gICAgICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZSxcclxuICAgICAgICAnc291cmNlIGFuZCBzaW5rJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAgICAgJ3Byb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICdvbWl0dGVkIHByb2Nlc3MnOiB0cnVlLFxyXG4gICAgICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXHJcbiAgICAgICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnZGlzc29jaWF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAncGhlbm90eXBlJzogdHJ1ZSxcclxuICAgICAgICAndGFnJzogdHJ1ZSxcclxuICAgICAgICAnY29uc3VtcHRpb24nOiB0cnVlLFxyXG4gICAgICAgICdwcm9kdWN0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnbW9kdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ3N0aW11bGF0aW9uJzogdHJ1ZSxcclxuICAgICAgICAnY2F0YWx5c2lzJzogdHJ1ZSxcclxuICAgICAgICAnaW5oaWJpdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ25lY2Vzc2FyeSBzdGltdWxhdGlvbic6IHRydWUsXHJcbiAgICAgICAgJ2xvZ2ljIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2VxdWl2YWxlbmNlIGFyYyc6IHRydWUsXHJcbiAgICAgICAgJ2FuZCBvcGVyYXRvcic6IHRydWUsXHJcbiAgICAgICAgJ29yIG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnbm90IG9wZXJhdG9yJzogdHJ1ZSxcclxuICAgICAgICAnYW5kJzogdHJ1ZSxcclxuICAgICAgICAnb3InOiB0cnVlLFxyXG4gICAgICAgICdub3QnOiB0cnVlLFxyXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcic6IHRydWUsXHJcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInOiB0cnVlLFxyXG4gICAgICAgICdjb21wbGV4IG11bHRpbWVyJzogdHJ1ZSxcclxuICAgICAgICAnY29tcGFydG1lbnQnOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLy90aGUgZm9sbG93aW5nIHdlcmUgbW92ZWQgaGVyZSBmcm9tIHdoYXQgdXNlZCB0byBiZSB1dGlsaXRpZXMvc2Jnbi1maWx0ZXJpbmcuanNcclxuICAgIHByb2Nlc3NUeXBlcyA6IFsncHJvY2VzcycsICdvbWl0dGVkIHByb2Nlc3MnLCAndW5jZXJ0YWluIHByb2Nlc3MnLFxyXG4gICAgICAgICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncGhlbm90eXBlJ10sXHJcbiAgICBcclxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBjbGFzcyBjYW4gaGF2ZSBwb3J0cy5cclxuICAgIGNhbkhhdmVQb3J0cyA6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgcmV0dXJuICgkLmluQXJyYXkoc2JnbmNsYXNzLCB0aGlzLnByb2Nlc3NUeXBlcykgPj0gMCB8fCAgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90Jyk7XHJcbiAgICB9LFxyXG4gICAgICBcclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEdlbmVyYWwgRWxlbWVudCBVdGlsaXRpZXNcclxuXHJcbiAgICAvL3RoaXMgbWV0aG9kIHJldHVybnMgdGhlIG5vZGVzIG5vbiBvZiB3aG9zZSBhbmNlc3RvcnMgaXMgbm90IGluIGdpdmVuIG5vZGVzXHJcbiAgICBnZXRUb3BNb3N0Tm9kZXM6IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdHM7XHJcbiAgICB9LFxyXG4gICAgLy9UaGlzIG1ldGhvZCBjaGVja3MgaWYgYWxsIG9mIHRoZSBnaXZlbiBub2RlcyBoYXZlIHRoZSBzYW1lIHBhcmVudCBhc3N1bWluZyB0aGF0IHRoZSBzaXplIFxyXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcclxuICAgIGFsbEhhdmVUaGVTYW1lUGFyZW50OiBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBub2Rlc1swXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YShcInBhcmVudFwiKSAhPSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBtb3ZlTm9kZXM6IGZ1bmN0aW9uKHBvc2l0aW9uRGlmZiwgbm9kZXMsIG5vdENhbGNUb3BNb3N0Tm9kZXMpIHtcclxuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BNb3N0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvcE1vc3ROb2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xyXG4gICAgICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbihcInlcIik7XHJcbiAgICAgICAgbm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXHJcbiAgICAgICAgICB5OiBvbGRZICsgcG9zaXRpb25EaWZmLnlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlTm9kZXMocG9zaXRpb25EaWZmLCBjaGlsZHJlbiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb252ZXJ0VG9Nb2RlbFBvc2l0aW9uOiBmdW5jdGlvbiAocmVuZGVyZWRQb3NpdGlvbikge1xyXG4gICAgICB2YXIgcGFuID0gY3kucGFuKCk7XHJcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xyXG5cclxuICAgICAgdmFyIHggPSAocmVuZGVyZWRQb3NpdGlvbi54IC0gcGFuLngpIC8gem9vbTtcclxuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCI6c2VsZWN0ZWRcIik7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVzID0gdGhpcy5leHRlbmROb2RlTGlzdChzZWxlY3RlZEVsZXMpO1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0TmVpZ2hib3Vyc09mU2VsZWN0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xyXG4gICAgICAgIHZhciBlbGVzVG9IaWdobGlnaHQgPSB0aGlzLmdldE5laWdoYm91cnNPZk5vZGVzKHNlbGVjdGVkRWxlcyk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb0hpZ2hsaWdodDtcclxuICAgIH0sXHJcbiAgICBnZXROZWlnaGJvdXJzT2ZOb2RlczogZnVuY3Rpb24oX25vZGVzKXtcclxuICAgICAgICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5wYXJlbnRzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpKTtcclxuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICB2YXIgbmVpZ2hib3Job29kRWxlcyA9IG5vZGVzLm5laWdoYm9yaG9vZCgpO1xyXG4gICAgICAgIHZhciBlbGVzVG9SZXR1cm4gPSBub2Rlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XHJcbiAgICAgICAgZWxlc1RvUmV0dXJuID0gZWxlc1RvUmV0dXJuLmFkZChlbGVzVG9SZXR1cm4uZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZXNUb1JldHVybjtcclxuICAgIH0sXHJcbiAgICBleHRlbmROb2RlTGlzdDogZnVuY3Rpb24obm9kZXNUb1Nob3cpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvL2FkZCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgcGFyZW50c1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY29tcGxleCBjaGlsZHJlblxyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpLmRlc2NlbmRhbnRzKCkpO1xyXG5cclxuICAgICAgICAvLyB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdwcm9jZXNzJ11cIik7XHJcbiAgICAgICAgLy8gdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcyE9J3Byb2Nlc3MnXVwiKTtcclxuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xyXG5cclxuICAgICAgICB2YXIgcHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cuZmlsdGVyKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBub25Qcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKCkuZmlsdGVyKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xyXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHBhcmVudHNcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLnBhcmVudHMoKSk7XHJcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cclxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcyhcIm5vZGVbY2xhc3M9J2NvbXBsZXgnXVwiKS5kZXNjZW5kYW50cygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xyXG4gICAgfSxcclxuICAgIGV4dGVuZFJlbWFpbmluZ05vZGVzIDogZnVuY3Rpb24obm9kZXNUb0ZpbHRlciwgYWxsTm9kZXMpe1xyXG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xyXG4gICAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGFsbE5vZGVzLm5vdChub2Rlc1RvRmlsdGVyKTtcclxuICAgICAgICBub2Rlc1RvU2hvdyA9IHRoaXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb1Nob3cpO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcclxuICAgIH0sXHJcbiAgICBnZXRQcm9jZXNzZXNPZk5vZGVzOiBmdW5jdGlvbihub2Rlcykge1xyXG4gICAgICByZXR1cm4gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcclxuICAgIG5vbmVJc05vdEhpZ2hsaWdodGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgIHZhciBub3RIaWdobGlnaHRlZEVkZ2VzID0gY3kuZWRnZXMoXCI6dmlzaWJsZVwiKS5lZGdlcyhcIi51bmhpZ2hsaWdodGVkXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm90SGlnaGxpZ2h0ZWROb2Rlcy5sZW5ndGggKyBub3RIaWdobGlnaHRlZEVkZ2VzLmxlbmd0aCA9PT0gMDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBFbGVtZW50IEZpbHRlcmluZyBVdGlsaXRpZXNcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXHJcbiAgICBkZWxldGVOb2Rlc1NtYXJ0OiBmdW5jdGlvbiAoX25vZGVzKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gICAgICBcclxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgICB2YXIgbm9kZXNUb0tlZXAgPSB0aGlzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XHJcbiAgICAgIHZhciBub2Rlc05vdFRvS2VlcCA9IGFsbE5vZGVzLm5vdChub2Rlc1RvS2VlcCk7XHJcbiAgICAgIHJldHVybiBub2Rlc05vdFRvS2VlcC5yZW1vdmUoKTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVFbGVzU2ltcGxlOiBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIHJldHVybiBlbGVzLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXHJcbiAgICByZXN0b3JlRWxlczogZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgICBlbGVzLnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZWxlcztcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG4gICAgXHJcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xyXG4gICAgZ2V0Q3lTaGFwZTogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIC8vIEdldCByaWQgb2YgcmVjdGFuZ2xlIHBvc3RmaXggdG8gaGF2ZSB0aGUgYWN0dWFsIG5vZGUgY2xhc3NcclxuICAgICAgICBpZiAoX2NsYXNzLmVuZHNXaXRoKCcgbXVsdGltZXInKSkge1xyXG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncm91bmRyZWN0YW5nbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdwaGVub3R5cGUnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnaGV4YWdvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZmluZSBuZXcgbm9kZSBzaGFwZXMgd2l0aCB0aGVpciBjbGFzcyBuYW1lcyBmb3IgdGhlc2Ugbm9kZXNcclxuICAgICAgICBpZiAoX2NsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IF9jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgXHJcbiAgICAgICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgX2NsYXNzID09ICdjb21wbGV4JyApIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2Ugc2hhcGVzIGNhbiBoYXZlIHBvcnRzLiBJZiB0aGV5IGhhdmUgcG9ydHMgd2UgcmVwcmVzZW50IHRoZW0gYnkgcG9seWdvbnMsIGVsc2UgdGhleSBhcmUgcmVwcmVzZW50ZWQgYnkgZWxsaXBzZXMgb3IgcmVjdGFuZ2xlc1xyXG4gICAgICAgIC8vIGNvbmRpdGlvbmFsbHkuXHJcbiAgICAgICAgaWYgKCB0aGlzLmNhbkhhdmVQb3J0cyhfY2xhc3MpICkge1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID09PSB0cnVlICYmIGVsZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvbHlnb24nOyAvLyBUaGUgbm9kZSBoYXMgcG9ydHMgcmVwcmVzZW50IGl0IGJ5IHBvbHlnb25cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAncHJvY2VzcycgfHwgX2NsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnIHx8IF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncmVjdGFuZ2xlJzsgLy8gSWYgbm9kZSBoYXMgbm8gcG9ydCBhbmQgaGFzIG9uZSBvZiB0aGVzZSBjbGFzc2VzIGl0IHNob3VsZCBiZSBpbiBhIHJlY3RhbmdsZSBzaGFwZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gJ2VsbGlwc2UnOyAvLyBPdGhlciBub2RlcyB3aXRoIG5vIHBvcnQgc2hvdWxkIGJlIGluIGFuIGVsbGlwc2Ugc2hhcGVcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBub2RlcyBhcmUgc3VwcG9zZWQgdG8gYmUgaW4gZWxsaXBzZSBzaGFwZVxyXG4gICAgICAgIHJldHVybiAnZWxsaXBzZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q3lBcnJvd1NoYXBlOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlLWNyb3NzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnaW5oaWJpdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2NsYXNzID09ICdjYXRhbHlzaXMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IF9jbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ21vZHVsYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgZ2V0RWxlbWVudENvbnRlbnQ6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgICAgICAgaWYgKF9jbGFzcy5lbmRzV2l0aCgnIG11bHRpbWVyJykpIHtcclxuICAgICAgICAgICAgX2NsYXNzID0gX2NsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdwaGVub3R5cGUnXHJcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5JyB8fCBfY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJykgPyBlbGUuZGF0YSgnbGFiZWwnKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XHJcbiAgICAgICAgICAgIGlmKGVsZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIGlmKGVsZS5kYXRhKCdsYWJlbCcpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGVsZS5kYXRhKCdpbmZvTGFiZWwnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdhbmQnKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnQU5EJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdvcicpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICdPUic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnbm90Jykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ05PVCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gJ1xcXFxcXFxcJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcycpIHtcclxuICAgICAgICAgICAgY29udGVudCA9ICc/JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzID09ICdkaXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnbyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gZWxlLndpZHRoKCkgfHwgZWxlLmRhdGEoJ2Jib3gnKS53O1xyXG5cclxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBjb250ZW50LFxyXG4gICAgICAgICAgICB3aWR0aDogKCBfY2xhc3M9PSgnY29tcGxleCcpIHx8IF9jbGFzcz09KCdjb21wYXJ0bWVudCcpICk/dGV4dFdpZHRoICogMjp0ZXh0V2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZm9udCA9IHRoaXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcclxuICAgIH0sXHJcbiAgICBnZXRMYWJlbFRleHRTaXplOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgICAgIC8vIFRoZXNlIHR5cGVzIG9mIG5vZGVzIGNhbm5vdCBoYXZlIGxhYmVsIGJ1dCB0aGlzIGlzIHN0YXRlbWVudCBpcyBuZWVkZWQgYXMgYSB3b3JrYXJvdW5kXHJcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmNhbkhhdmVQb3J0cyhfY2xhc3MpKSB7XHJcbiAgICAgICAgdmFyIGNvZWZmID0gMTsgLy8gVGhlIGR5bmFtaWMgbGFiZWwgc2l6ZSBjb2VmZmljaWVudCBmb3IgdGhlc2UgcHNldWRvIGxhYmVscywgaXQgaXMgMSBmb3IgbG9naWNhbCBvcGVyYXRvcnNcclxuICAgICAgICBcclxuICAgICAgICAvLyBDb2VmZiBpcyBzdXBwb3NlZCB0byBiZSAyIGZvciBkaXNzb2NpYXRpb24gYW5kIDEuNSBmb3Igb3RoZXIgcHJvY2Vzc2VzXHJcbiAgICAgICAgaWYgKF9jbGFzcyA9PT0gJ2Rpc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgIGNvZWZmID0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX2NsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJykpIHtcclxuICAgICAgICAgIGNvZWZmID0gMS41O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcG9ydHMgPSBlbGUuZGF0YSgncG9ydHMnKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID09PSB0cnVlICYmIHBvcnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgLy8gV2UgYXNzdW1lIHRoYXQgdGhlIHBvcnRzIGFyZSBzeW1tZXRyaWMgdG8gdGhlIG5vZGUgY2VudGVyIHNvIHVzaW5nIGp1c3Qgb25lIG9mIHRoZSBwb3J0cyBpcyBlbm91Z2hcclxuICAgICAgICAgIHZhciBwb3J0ID0gcG9ydHNbMF07XHJcbiAgICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBwb3J0LnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgICAgLy8gVGhpcyBpcyB0aGUgcmF0aW8gb2YgdGhlIGFyZWEgb2NjdXBpZWQgd2l0aCBwb3J0cyBvdmVyIHdpdGhvdXQgcG9ydHNcclxuICAgICAgICAgIHZhciByYXRpbyA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gTWF0aC5hYnMocG9ydC55KSAvIDUwIDogTWF0aC5hYnMocG9ydC54KSAvIDUwO1xyXG4gICAgICAgICAgY29lZmYgLz0gcmF0aW87IC8vIERpdmlkZSB0aGUgY29lZmYgYnkgcmF0aW8gdG8gZml0IGludG8gdGhlIGJib3ggb2YgdGhlIGFjdHVhbCBzaGFwZSAoZGlzY2x1ZGluZyBwb3J0cylcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RHluYW1pY0xhYmVsVGV4dFNpemUoZWxlLCBjb2VmZik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfY2xhc3MgPT09ICdjb21wbGV4JyB8fCBfY2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHtcclxuICAgICAgICByZXR1cm4gMTY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgc3JjUG9zID0gZWxlLnNvdXJjZSgpLnBvc2l0aW9uKCk7XHJcbiAgICAgIHZhciB0Z3RQb3MgPSBlbGUudGFyZ2V0KCkucG9zaXRpb24oKTtcclxuXHJcbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdygoc3JjUG9zLnggLSB0Z3RQb3MueCksIDIpICsgTWF0aC5wb3coKHNyY1Bvcy55IC0gdGd0UG9zLnkpLCAyKSk7XHJcbiAgICAgIHJldHVybiBkaXN0YW5jZSAqIDAuMTU7XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5mb0xhYmVsOiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIC8qIEluZm8gbGFiZWwgb2YgYSBjb2xsYXBzZWQgbm9kZSBjYW5ub3QgYmUgY2hhbmdlZCBpZlxyXG4gICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxyXG4gICAgICAqL1xyXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNvbGxhcHNlZENoaWxkcmVuICE9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLypcclxuICAgICAgICogSWYgdGhlIG5vZGUgaXMgc2ltcGxlIHRoZW4gaXQncyBpbmZvbGFiZWwgaXMgZXF1YWwgdG8gaXQncyBsYWJlbFxyXG4gICAgICAgKi9cclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybiBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKTtcclxuICAgICAgdmFyIGluZm9MYWJlbCA9IFwiXCI7XHJcbiAgICAgIC8qXHJcbiAgICAgICAqIEdldCB0aGUgaW5mbyBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZSBieSBpdCdzIGNoaWxkcmVuIGluZm8gcmVjdXJzaXZlbHlcclxuICAgICAgICovXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICB2YXIgY2hpbGRJbmZvID0gdGhpcy5nZXRJbmZvTGFiZWwoY2hpbGQpO1xyXG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5mb0xhYmVsICE9IFwiXCIpIHtcclxuICAgICAgICAgIGluZm9MYWJlbCArPSBcIjpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5mb0xhYmVsICs9IGNoaWxkSW5mbztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9yZXR1cm4gaW5mbyBsYWJlbFxyXG4gICAgICByZXR1cm4gaW5mb0xhYmVsO1xyXG4gICAgfSxcclxuICAgIGdldFF0aXBDb250ZW50OiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIC8qIENoZWNrIHRoZSBsYWJlbCBvZiB0aGUgbm9kZSBpZiBpdCBpcyBub3QgdmFsaWRcclxuICAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxyXG4gICAgICAqL1xyXG4gICAgICB2YXIgbGFiZWwgPSBub2RlLmRhdGEoJ2xhYmVsJyk7XHJcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcclxuICAgICAgICBsYWJlbCA9IHRoaXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHZhciBjb250ZW50SHRtbCA9IFwiPGIgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNnB4Oyc+XCIgKyBsYWJlbCArIFwiPC9iPlwiO1xyXG4gICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgc2JnbnN0YXRlYW5kaW5mbyA9IHN0YXRlc2FuZGluZm9zW2ldO1xyXG4gICAgICAgIGlmIChzYmduc3RhdGVhbmRpbmZvLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcclxuICAgICAgICAgIHZhciB2YXJpYWJsZSA9IHNiZ25zdGF0ZWFuZGluZm8uc3RhdGUudmFyaWFibGU7XHJcbiAgICAgICAgICB2YXIgc3RhdGVMYWJlbCA9ICh2YXJpYWJsZSA9PSBudWxsIC8qfHwgdHlwZW9mIHN0YXRlVmFyaWFibGUgPT09IHVuZGVmaW5lZCAqLykgPyB2YWx1ZSA6XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcclxuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgc3RhdGVMYWJlbCA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzYmduc3RhdGVhbmRpbmZvLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZW50SHRtbDtcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xyXG4gICAgZ2V0RHluYW1pY0xhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUsIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCkge1xyXG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcclxuICAgICAgZHluYW1pY0xhYmVsU2l6ZSA9IHR5cGVvZiBkeW5hbWljTGFiZWxTaXplID09PSAnZnVuY3Rpb24nID8gZHluYW1pY0xhYmVsU2l6ZS5jYWxsKCkgOiBkeW5hbWljTGFiZWxTaXplO1xyXG5cclxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3NtYWxsJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMC43NTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZHluYW1pY0xhYmVsU2l6ZSA9PSAncmVndWxhcicpIHtcclxuICAgICAgICAgIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ2xhcmdlJykge1xyXG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMS4yNTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xyXG4gICAgICB2YXIgdGV4dEhlaWdodCA9IHBhcnNlSW50KGggLyAyLjQ1KSAqIGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudDtcclxuXHJcbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIC8qXHJcbiAgICAqIEdldCBzb3VyY2UvdGFyZ2V0IGVuZCBwb2ludCBvZiBlZGdlIGluICd4LXZhbHVlJSB5LXZhbHVlJScgZm9ybWF0LiBJdCByZXR1cm5zICdvdXRzaWRlLXRvLW5vZGUnIGlmIHRoZXJlIGlzIG5vIHNvdXJjZS90YXJnZXQgcG9ydC5cclxuICAgICovXHJcbiAgICBnZXRFbmRQb2ludDogZnVuY3Rpb24oZWRnZSwgc291cmNlT3JUYXJnZXQpIHtcclxuICAgICAgdmFyIHBvcnRJZCA9IHNvdXJjZU9yVGFyZ2V0ID09PSAnc291cmNlJyA/IGVkZ2UuZGF0YSgncG9ydHNvdXJjZScpIDogZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jyk7XHJcblxyXG4gICAgICBpZiAocG9ydElkID09IG51bGwgfHwgIWdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCkge1xyXG4gICAgICAgIHJldHVybiAnb3V0c2lkZS10by1ub2RlJzsgLy8gSWYgdGhlcmUgaXMgbm8gcG9ydHNvdXJjZSByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUgd2hpY2ggaXMgJ291dHNpZGUtdG8tbm9kZSdcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVuZE5vZGUgPSBzb3VyY2VPclRhcmdldCA9PT0gJ3NvdXJjZScgPyBlZGdlLnNvdXJjZSgpIDogZWRnZS50YXJnZXQoKTtcclxuICAgICAgdmFyIHBvcnRzID0gZW5kTm9kZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgICB2YXIgcG9ydDtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChwb3J0c1tpXS5pZCA9PT0gcG9ydElkKSB7XHJcbiAgICAgICAgICBwb3J0ID0gcG9ydHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9ydCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuICdvdXRzaWRlLXRvLW5vZGUnOyAvLyBJZiBwb3J0IGlzIG5vdCBmb3VuZCByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUgd2hpY2ggaXMgJ291dHNpZGUtdG8tbm9kZSdcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIHgsIHk7XHJcbiAgICAgIC8vIE5vdGUgdGhhdCBmb3IgZHJhd2luZyBwb3J0cyB3ZSByZXByZXNlbnQgdGhlIHdob2xlIHNoYXBlIGJ5IGEgcG9seWdvbiBhbmQgcG9ydHMgYXJlIGFsd2F5cyA1MCUgYXdheSBmcm9tIHRoZSBub2RlIGNlbnRlclxyXG4gICAgICBpZiAocG9ydC54ICE9IDApIHtcclxuICAgICAgICB4ID0gTWF0aC5zaWduKHBvcnQueCkgKiA1MDtcclxuICAgICAgICB5ID0gMDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB4ID0gMDtcclxuICAgICAgICB5ID0gTWF0aC5zaWduKHBvcnQueSkgKiA1MDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuICcnICsgeCArICclICcgKyB5ICsgJyUnO1xyXG4gICAgfSxcclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gb3JkZXJpbmcgb2YgcG9ydHMgb2YgYSBub2RlLlxyXG4gICAgICogUG9zc2libGUgcmV0dXJuIHZhbHVlcyBhcmUgJ0wtdG8tUicsICdSLXRvLUwnLCAnVC10by1CJywgJ0ItdG8tVCcsICdub25lJ1xyXG4gICAgICovXHJcbiAgICBnZXRQb3J0c09yZGVyaW5nOiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIC8vIFJldHVybiB0aGUgY2FjaGVkIHBvcnRzb3JkZXJpbmcgaWYgZXhpc3RzXHJcbiAgICAgIGlmIChub2RlLmRhdGEoJ3BvcnRzb3JkZXJpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiBub2RlLmRhdGEoJ3BvcnRzb3JkZXJpbmcnKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIHBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgICBpZiAocG9ydHMubGVuZ3RoICE9PSAyKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdwb3J0c29yZGVyaW5nJywgJ25vbmUnKTsgLy8gQ2FjaGUgdGhlIHBvcnRzIG9yZGVyaW5nXHJcbiAgICAgICAgcmV0dXJuICdub25lJzsgLy8gTm9kZXMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgMiBub2RlcyBvciBub25lXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIFJldHVyc24gaWYgdGhlIGdpdmVuIHBvcnRJZCBpcyBwb3J0dGFyZ2V0IG9mIGFueSBvZiB0aGUgZ2l2ZW4gZWRnZXMuXHJcbiAgICAgICAqIFRoZXNlIGVkZ2VzIGFyZSBleHBlY3RlZCB0byBiZSB0aGUgZWRnZXMgY29ubmVjdGVkIHRvIHRoZSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGF0IHBvcnQuXHJcbiAgICAgICAqL1xyXG4gICAgICB2YXIgaXNQb3J0VGFyZ2V0T2ZBbnlFZGdlID0gZnVuY3Rpb24oZWRnZXMsIHBvcnRJZCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChlZGdlc1tpXS5kYXRhKCdwb3J0dGFyZ2V0JykgPT09IHBvcnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgLy8gSWYgdGhlIHBvcnRzIGFyZSBsb2NhdGVkIGFib3ZlL2JlbG93IG9mIHRoZSBub2RlIHRoZW4gdGhlIG9yaWVudGF0aW9uIGlzICd2ZXJ0aWNhbCcgZWxzZSBpdCBpcyAnaG9yaXpvbnRhbCcuXHJcbiAgICAgIHZhciBvcmllbnRhdGlvbiA9IHBvcnRzWzBdLnggPT09IDAgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAvLyBXZSBuZWVkIHRoZSBjb25uZWN0ZWQgZWRnZXMgb2YgdGhlIG5vZGUgdG8gZmluZCBvdXQgaWYgYSBwb3J0IGlzIGFuIGlucHV0IHBvcnQgb3IgYW4gb3V0cHV0IHBvcnRcclxuICAgICAgdmFyIGNvbm5lY3RlZEVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHBvcnRzb3JkZXJpbmc7XHJcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgdmFyIGxlZnRQb3J0SWQgPSBwb3J0c1swXS54IDwgMCA/IHBvcnRzWzBdLmlkIDogcG9ydHNbMV0uaWQ7IC8vIExlZnQgcG9ydCBpcyB0aGUgcG9ydCB3aG9zZSB4IHZhbHVlIGlzIG5lZ2F0aXZlXHJcbiAgICAgICAgLy8gSWYgbGVmdCBwb3J0IGlzIHBvcnQgdGFyZ2V0IGZvciBhbnkgb2YgY29ubmVjdGVkIGVkZ2VzIHRoZW4gdGhlIG9yZGVyaW5nIGlzICdMLXRvLVInIGVsc2UgaXQgaXMgJ1ItdG8tTCdcclxuICAgICAgICBpZiAoaXNQb3J0VGFyZ2V0T2ZBbnlFZGdlKGNvbm5lY3RlZEVkZ2VzLCBsZWZ0UG9ydElkKSkge1xyXG4gICAgICAgICAgcG9ydHNvcmRlcmluZyA9ICdMLXRvLVInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHBvcnRzb3JkZXJpbmcgPSAnUi10by1MJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHRvcFBvcnRJZCA9IHBvcnRzWzBdLnkgPCAwID8gcG9ydHNbMF0uaWQgOiBwb3J0c1sxXS5pZDsgLy8gVG9wIHBvcnQgaXMgdGhlIHBvcnQgd2hvc2UgeSB2YWx1ZSBpcyBuZWdhdGl2ZVxyXG4gICAgICAgIC8vIElmIHRvcCAgcG9ydCBpcyBwb3J0IHRhcmdldCBmb3IgYW55IG9mIGNvbm5lY3RlZCBlZGdlcyB0aGVuIHRoZSBvcmRlcmluZyBpcyAnVC10by1CJyBlbHNlIGl0IGlzICdCLXRvLVQnXHJcbiAgICAgICAgaWYgKGlzUG9ydFRhcmdldE9mQW55RWRnZShjb25uZWN0ZWRFZGdlcywgdG9wUG9ydElkKSkge1xyXG4gICAgICAgICAgcG9ydHNvcmRlcmluZyA9ICdULXRvLUInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHBvcnRzb3JkZXJpbmcgPSAnQi10by1UJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIENhY2hlIHRoZSBwb3J0c29yZGVyaW5nIGFuZCByZXR1cm4gaXQuXHJcbiAgICAgIG5vZGUuZGF0YSgncG9ydHNvcmRlcmluZycsIHBvcnRzb3JkZXJpbmcpO1xyXG4gICAgICByZXR1cm4gcG9ydHNvcmRlcmluZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKlxyXG4gKiBGaWxlIFV0aWxpdGllczogVG8gYmUgdXNlZCBvbiByZWFkL3dyaXRlIGZpbGUgb3BlcmF0aW9uXHJcbiAqL1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xyXG52YXIgdWlVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3VpLXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgdXBkYXRlR3JhcGggPSBncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaC5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcclxuXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgc2F2ZUFzID0gbGlicy5zYXZlQXM7XHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIFN0YXJ0XHJcbi8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2MjQ1NzY3L2NyZWF0aW5nLWEtYmxvYi1mcm9tLWEtYmFzZTY0LXN0cmluZy1pbi1qYXZhc2NyaXB0XHJcbmZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKSB7XHJcbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcclxuICBzbGljZVNpemUgPSBzbGljZVNpemUgfHwgNTEyO1xyXG5cclxuICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xyXG4gIHZhciBieXRlQXJyYXlzID0gW107XHJcblxyXG4gIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xyXG4gICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xyXG5cclxuICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcclxuXHJcbiAgICBieXRlQXJyYXlzLnB1c2goYnl0ZUFycmF5KTtcclxuICB9XHJcblxyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcbiAgcmV0dXJuIGJsb2I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRYTUxEb2MoZnVsbEZpbGVQYXRoKSB7XHJcbiAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xyXG4gICAgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4aHR0cCA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcbiAgfVxyXG4gIHhodHRwLm9wZW4oXCJHRVRcIiwgZnVsbEZpbGVQYXRoLCBmYWxzZSk7XHJcbiAgeGh0dHAuc2VuZCgpO1xyXG4gIHJldHVybiB4aHR0cC5yZXNwb25zZVhNTDtcclxufVxyXG5cclxuLy8gU2hvdWxkIHRoaXMgYmUgZXhwb3NlZCBvciBzaG91bGQgdGhpcyBiZSBtb3ZlZCB0byB0aGUgaGVscGVyIGZ1bmN0aW9ucyBzZWN0aW9uP1xyXG5mdW5jdGlvbiB0ZXh0VG9YbWxPYmplY3QodGV4dCkge1xyXG4gIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xyXG4gICAgdmFyIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XHJcbiAgICBkb2MuYXN5bmMgPSAnZmFsc2UnO1xyXG4gICAgZG9jLmxvYWRYTUwodGV4dCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICB2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC94bWwnKTtcclxuICB9XHJcbiAgcmV0dXJuIGRvYztcclxufVxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIEVuZFxyXG5cclxuZnVuY3Rpb24gZmlsZVV0aWxpdGllcygpIHt9XHJcbmZpbGVVdGlsaXRpZXMubG9hZFhNTERvYyA9IGxvYWRYTUxEb2M7XHJcblxyXG5maWxlVXRpbGl0aWVzLnNhdmVBc1BuZyA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcbiAgdmFyIHBuZ0NvbnRlbnQgPSBjeS5wbmcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XHJcblxyXG4gIC8vIHRoaXMgaXMgdG8gcmVtb3ZlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBuZ0NvbnRlbnQ6IGRhdGE6aW1nL3BuZztiYXNlNjQsXHJcbiAgdmFyIGI2NGRhdGEgPSBwbmdDb250ZW50LnN1YnN0cihwbmdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XHJcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLnBuZ1wiKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzSnBnID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuICB2YXIganBnQ29udGVudCA9IGN5LmpwZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcclxuXHJcbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcclxuICB2YXIgYjY0ZGF0YSA9IGpwZ0NvbnRlbnQuc3Vic3RyKGpwZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcclxuICBzYXZlQXMoYjY0dG9CbG9iKGI2NGRhdGEsIFwiaW1hZ2UvanBnXCIpLCBmaWxlbmFtZSB8fCBcIm5ldHdvcmsuanBnXCIpO1xyXG59O1xyXG5cclxuZmlsZVV0aWxpdGllcy5sb2FkU2FtcGxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGZvbGRlcnBhdGgpIHtcclxuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XHJcbiAgXHJcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYSBzYW1wbGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRTYW1wbGVTdGFydFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZVN0YXJ0XCIsIFsgZmlsZW5hbWUgXSApO1xyXG4gIFxyXG4gIC8vIGxvYWQgeG1sIGRvY3VtZW50IHVzZSBkZWZhdWx0IGZvbGRlciBwYXRoIGlmIGl0IGlzIG5vdCBzcGVjaWZpZWRcclxuICB2YXIgeG1sT2JqZWN0ID0gbG9hZFhNTERvYygoZm9sZGVycGF0aCB8fCAnc2FtcGxlLWFwcC9zYW1wbGVzLycpICsgZmlsZW5hbWUpO1xyXG4gIFxyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQoeG1sT2JqZWN0KSk7XHJcbiAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xyXG4gICAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlRW5kXCIsIFsgZmlsZW5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgc2FtcGxlIGlzIGxvYWRlZFxyXG4gIH0sIDApO1xyXG59O1xyXG5cclxuLypcclxuICBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIHJlbW90ZWx5IGRlZmluZWQgdG8gYWRkIHNwZWNpZmljIGJlaGF2aW9yIHRoYXQgaXNuJ3QgaW1wbGVtZW50ZWQgaGVyZS5cclxuICBpdCBpcyBjb21wbGV0ZWx5IG9wdGlvbmFsLlxyXG4gIHNpZ25hdHVyZTogY2FsbGJhY2sodGV4dFhtbClcclxuKi9cclxuZmlsZVV0aWxpdGllcy5sb2FkU0JHTk1MRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xyXG4gIFxyXG4gIC8vIFVzZXJzIG1heSB3YW50IHRvIGRvIGN1c3RvbWl6ZWQgdGhpbmdzIHdoaWxlIGFuIGV4dGVybmFsIGZpbGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBBbGlhc2VzIGZvciBzYmdudml6TG9hZEZpbGVTdGFydFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVTdGFydFwiLCBbIGZpbGUubmFtZSBdICk7IFxyXG4gIFxyXG4gIHZhciB0ZXh0VHlwZSA9IC90ZXh0LiovO1xyXG5cclxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJykgY2FsbGJhY2sodGV4dCk7XHJcbiAgICAgIHVwZGF0ZUdyYXBoKHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdCh0ZXh0KSkpO1xyXG4gICAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1maWxlLXNwaW5uZXJcIik7XHJcbiAgICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVFbmRcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgZmlsZSBpcyBsb2FkZWRcclxuICAgIH0sIDApO1xyXG4gIH07XHJcblxyXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG59O1xyXG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxUZXh0ID0gZnVuY3Rpb24odGV4dERhdGEpe1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdXBkYXRlR3JhcGgoc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHRleHREYXRhKSkpO1xyXG4gICAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcclxuICAgIH0sIDApO1xyXG5cclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuc2F2ZUFzU2Jnbm1sID0gZnVuY3Rpb24oZmlsZW5hbWUsIHJlbmRlckluZm8pIHtcclxuICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoZmlsZW5hbWUsIHJlbmRlckluZm8pO1xyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3NiZ25tbFRleHRdLCB7XHJcbiAgICB0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtODtcIixcclxuICB9KTtcclxuICBzYXZlQXMoYmxvYiwgZmlsZW5hbWUpO1xyXG59O1xyXG5maWxlVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUZXh0VG9Kc29uID0gZnVuY3Rpb24oc2Jnbm1sVGV4dCl7XHJcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcclxufTtcclxuXHJcbmZpbGVVdGlsaXRpZXMuY3JlYXRlSnNvbiA9IGZ1bmN0aW9uKGpzb24pe1xyXG4gICAgdmFyIHNiZ25tbFRleHQgPSBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XHJcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVVdGlsaXRpZXM7XHJcbiIsIi8qXHJcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIHNiZ252aXogZ3JhcGhzXHJcbiAqL1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxuZnVuY3Rpb24gZ3JhcGhVdGlsaXRpZXMoKSB7fVxyXG5cclxuZ3JhcGhVdGlsaXRpZXMucG9ydHNFbmFibGVkID0gdHJ1ZTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLmRpc2FibGVQb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9IGZhbHNlO1xyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5lbmFibGVQb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCA9IHRydWU7XHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLmFyZVBvcnRzRW5hYmxlZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQ7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaCA9IGZ1bmN0aW9uKGN5R3JhcGgpIHtcclxuICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaFN0YXJ0XCIgKTtcclxuICAvLyBSZXNldCB1bmRvL3JlZG8gc3RhY2sgYW5kIGJ1dHRvbnMgd2hlbiBhIG5ldyBncmFwaCBpcyBsb2FkZWRcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5yZXNldCgpO1xyXG4vLyAgICB0aGlzLnJlc2V0VW5kb1JlZG9CdXR0b25zKCk7XHJcbiAgfVxyXG5cclxuICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgLy8gY2xlYXIgZGF0YVxyXG4gIGN5LnJlbW92ZSgnKicpO1xyXG4gIGN5LmFkZChjeUdyYXBoKTtcclxuXHJcbiAgLy9hZGQgcG9zaXRpb24gaW5mb3JtYXRpb24gdG8gZGF0YSBmb3IgcHJlc2V0IGxheW91dFxyXG4gIHZhciBwb3NpdGlvbk1hcCA9IHt9O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHhQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC54O1xyXG4gICAgdmFyIHlQb3MgPSBjeUdyYXBoLm5vZGVzW2ldLmRhdGEuYmJveC55O1xyXG4gICAgcG9zaXRpb25NYXBbY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmlkXSA9IHsneCc6IHhQb3MsICd5JzogeVBvc307XHJcbiAgfVxyXG5cclxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xyXG4gIGN5LmVuZEJhdGNoKCk7XHJcbiAgXHJcbiAgdmFyIGxheW91dCA9IGN5LmxheW91dCh7XHJcbiAgICBuYW1lOiAncHJlc2V0JyxcclxuICAgIHBvc2l0aW9uczogcG9zaXRpb25NYXAsXHJcbiAgICBmaXQ6IHRydWUsXHJcbiAgICBwYWRkaW5nOiA1MFxyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIENoZWNrIHRoaXMgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XHJcbiAgICBsYXlvdXQucnVuKCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgdGhlIHN0eWxlXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAvLyBJbml0aWxpemUgdGhlIGJlbmQgcG9pbnRzIG9uY2UgdGhlIGVsZW1lbnRzIGFyZSBjcmVhdGVkXHJcbiAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcclxuICAgIGN5LmVkZ2VCZW5kRWRpdGluZygnZ2V0JykuaW5pdEJlbmRQb2ludHMoY3kuZWRnZXMoKSk7XHJcbiAgfVxyXG4gIFxyXG4gICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJ1cGRhdGVHcmFwaEVuZFwiICk7XHJcbn07XHJcblxyXG5ncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVQYWRkaW5ncyA9IGZ1bmN0aW9uKHBhZGRpbmdQZXJjZW50KSB7XHJcbiAgLy9BcyBkZWZhdWx0IHVzZSB0aGUgY29tcG91bmQgcGFkZGluZyB2YWx1ZVxyXG4gIGlmICghcGFkZGluZ1BlcmNlbnQpIHtcclxuICAgIHZhciBjb21wb3VuZFBhZGRpbmcgPSBvcHRpb25zLmNvbXBvdW5kUGFkZGluZztcclxuICAgIHBhZGRpbmdQZXJjZW50ID0gdHlwZW9mIGNvbXBvdW5kUGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbXBvdW5kUGFkZGluZy5jYWxsKCkgOiBjb21wb3VuZFBhZGRpbmc7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciB0b3RhbCA9IDA7XHJcbiAgdmFyIG51bU9mU2ltcGxlcyA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcclxuICAgIGlmICh0aGVOb2RlLmNoaWxkcmVuKCkgPT0gbnVsbCB8fCB0aGVOb2RlLmNoaWxkcmVuKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgdG90YWwgKz0gTnVtYmVyKHRoZU5vZGUud2lkdGgoKSk7XHJcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcclxuICAgICAgbnVtT2ZTaW1wbGVzKys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgY2FsY19wYWRkaW5nID0gKHBhZGRpbmdQZXJjZW50IC8gMTAwKSAqIE1hdGguZmxvb3IodG90YWwgLyAoMiAqIG51bU9mU2ltcGxlcykpO1xyXG4gIGlmIChjYWxjX3BhZGRpbmcgPCA1KSB7XHJcbiAgICBjYWxjX3BhZGRpbmcgPSA1O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNhbGNfcGFkZGluZztcclxufTtcclxuXHJcbmdyYXBoVXRpbGl0aWVzLnJlY2FsY3VsYXRlUGFkZGluZ3MgPSBncmFwaFV0aWxpdGllcy5yZWZyZXNoUGFkZGluZ3MgPSBmdW5jdGlvbigpIHtcclxuICAvLyB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBpcyBub3Qgd29ya2luZyBoZXJlIFxyXG4gIC8vIFRPRE86IHJlcGxhY2UgdGhpcyByZWZlcmVuY2Ugd2l0aCB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBvbmNlIHRoZSByZWFzb24gaXMgZmlndXJlZCBvdXRcclxuICBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmdzKCk7XHJcbiAgcmV0dXJuIGdyYXBoVXRpbGl0aWVzLmNhbGN1bGF0ZWRQYWRkaW5ncztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ3JhcGhVdGlsaXRpZXM7IiwidmFyIHR4dFV0aWwgPSByZXF1aXJlKCcuL3RleHQtdXRpbGl0aWVzJyk7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgbGlic2JnbmpzID0gcmVxdWlyZSgnbGlic2Jnbi5qcycpO1xyXG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlcjtcclxudmFyIGFubm90ID0gbGlic2JnbmpzLmFubm90O1xyXG52YXIgcGtnVmVyc2lvbiA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247IC8vIG5lZWQgaW5mbyBhYm91dCBzYmdudml6IHRvIHB1dCBpbiB4bWxcclxudmFyIHBrZ05hbWUgPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS5uYW1lO1xyXG52YXIgcHJldHR5cHJpbnQgPSByZXF1aXJlKCdwcmV0dHktZGF0YScpLnBkO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG5cclxudmFyIGpzb25Ub1NiZ25tbCA9IHtcclxuICAgIC8qXHJcbiAgICAgICAgdGFrZXMgcmVuZGVySW5mbyBhcyBhbiBvcHRpb25hbCBhcmd1bWVudC4gSXQgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gc2F2ZVxyXG4gICAgICAgIHRoZSBzdHlsZSBhbmQgY29sb3JzIHRvIHRoZSByZW5kZXIgZXh0ZW5zaW9uLiBTZWUgbmV3dC9hcHAtdXRpbGl0aWVzIGdldEFsbFN0eWxlcygpXHJcbiAgICAgICAgU3RydWN0dXJlOiB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoZSBtYXAgYmFja2dyb3VuZCBjb2xvcixcclxuICAgICAgICAgICAgY29sb3JzOiB7XHJcbiAgICAgICAgICAgICAgdmFsaWRYbWxWYWx1ZTogY29sb3JfaWRcclxuICAgICAgICAgICAgICAuLi5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3R5bGVzOiB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZUtleTE6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZExpc3Q6IGxpc3Qgb2YgdGhlIG5vZGVzIGlkcyB0aGF0IGhhdmUgdGhpcyBzdHlsZVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IC4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3R5bGVLZXkyOiAuLi5cclxuICAgICAgICAgICAgICAgIC4uLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKi9cclxuICAgIGNyZWF0ZVNiZ25tbCA6IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcElEID0gdHh0VXRpbC5nZXRYTUxWYWxpZElkKGZpbGVuYW1lKTtcclxuICAgICAgICB2YXIgaGFzRXh0ZW5zaW9uID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIGhhc1JlbmRlckV4dGVuc2lvbiA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVySW5mbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgaGFzRXh0ZW5zaW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgaGFzUmVuZGVyRXh0ZW5zaW9uID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcclxuICAgICAgICB4bWxIZWFkZXIgPSBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSd5ZXMnPz5cXG5cIjtcclxuICAgICAgICB2YXIgc2JnbiA9IG5ldyBsaWJzYmduanMuU2Jnbih7eG1sbnM6ICdodHRwOi8vc2Jnbi5vcmcvbGlic2Jnbi8wLjMnfSk7XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBsaWJzYmduanMuTWFwKHtsYW5ndWFnZTogJ3Byb2Nlc3MgZGVzY3JpcHRpb24nLCBpZDogbWFwSUR9KTtcclxuICAgICAgICBpZiAoaGFzRXh0ZW5zaW9uKSB7IC8vIGV4dGVuc2lvbiBpcyB0aGVyZVxyXG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gbmV3IGxpYnNiZ25qcy5FeHRlbnNpb24oKTtcclxuICAgICAgICAgICAgaWYgKGhhc1JlbmRlckV4dGVuc2lvbikge1xyXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uLmFkZChzZWxmLmdldFJlbmRlckV4dGVuc2lvblNiZ25tbChyZW5kZXJJbmZvKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFwLnNldEV4dGVuc2lvbihleHRlbnNpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IGFsbCBnbHlwaHNcclxuICAgICAgICB2YXIgZ2x5cGhMaXN0ID0gW107XHJcbiAgICAgICAgY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCFlbGUuaXNDaGlsZCgpKVxyXG4gICAgICAgICAgICAgICAgZ2x5cGhMaXN0ID0gZ2x5cGhMaXN0LmNvbmNhdChzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSkpOyAvLyByZXR1cm5zIHBvdGVudGlhbGx5IG1vcmUgdGhhbiAxIGdseXBoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gYWRkIHRoZW0gdG8gdGhlIG1hcFxyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGdseXBoTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBtYXAuYWRkR2x5cGgoZ2x5cGhMaXN0W2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCBhbGwgYXJjc1xyXG4gICAgICAgIGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXAuYWRkQXJjKHNlbGYuZ2V0QXJjU2Jnbm1sKGVsZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzYmduLnNldE1hcChtYXApO1xyXG4gICAgICAgIHJldHVybiBwcmV0dHlwcmludC54bWwoeG1sSGVhZGVyICsgc2Jnbi50b1hNTCgpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gc2VlIGNyZWF0ZVNiZ25tbCBmb3IgaW5mbyBvbiB0aGUgc3RydWN0dXJlIG9mIHJlbmRlckluZm9cclxuICAgIGdldFJlbmRlckV4dGVuc2lvblNiZ25tbCA6IGZ1bmN0aW9uKHJlbmRlckluZm8pIHtcclxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBtYWluIGNvbnRhaW5lclxyXG4gICAgICAgIHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyByZW5kZXJFeHRlbnNpb24uUmVuZGVySW5mb3JtYXRpb24oeyBpZDogJ3JlbmRlckluZm9ybWF0aW9uJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcmVuZGVySW5mby5iYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtTmFtZTogcGtnTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbVZlcnNpb246IHBrZ1ZlcnNpb24gfSk7XHJcblxyXG4gICAgICAgIC8vIHBvcHVsYXRlIGxpc3Qgb2YgY29sb3JzXHJcbiAgICAgICAgdmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBjb2xvciBpbiByZW5kZXJJbmZvLmNvbG9ycykge1xyXG4gICAgICAgICAgICB2YXIgY29sb3JEZWZpbml0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5Db2xvckRlZmluaXRpb24oe2lkOiByZW5kZXJJbmZvLmNvbG9yc1tjb2xvcl0sIHZhbHVlOiBjb2xvcn0pO1xyXG4gICAgICAgICAgICBsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFkZENvbG9yRGVmaW5pdGlvbihjb2xvckRlZmluaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZW5kZXJJbmZvcm1hdGlvbi5zZXRMaXN0T2ZDb2xvckRlZmluaXRpb25zKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBwb3B1bGF0ZXMgc3R5bGVzXHJcbiAgICAgICAgdmFyIGxpc3RPZlN0eWxlcyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mU3R5bGVzKCk7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHJlbmRlckluZm8uc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHJlbmRlckluZm8uc3R5bGVzW2tleV07XHJcbiAgICAgICAgICAgIHZhciB4bWxTdHlsZSA9IG5ldyByZW5kZXJFeHRlbnNpb24uU3R5bGUoe2lkOiB0eHRVdGlsLmdldFhNTFZhbGlkSWQoa2V5KSwgaWRMaXN0OiBzdHlsZS5pZExpc3Quam9pbignICcpfSk7XHJcbiAgICAgICAgICAgIHZhciBnID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJHcm91cCh7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogc3R5bGUucHJvcGVydGllcy5mb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IHN0eWxlLnByb3BlcnRpZXMuZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IHN0eWxlLnByb3BlcnRpZXMuZm9udFdlaWdodCxcclxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogc3R5bGUucHJvcGVydGllcy5mb250U3R5bGUsXHJcbiAgICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5wcm9wZXJ0aWVzLmZpbGwsIC8vIGZpbGwgY29sb3JcclxuICAgICAgICAgICAgICAgIHN0cm9rZTogc3R5bGUucHJvcGVydGllcy5zdHJva2UsIC8vIHN0cm9rZSBjb2xvclxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IHN0eWxlLnByb3BlcnRpZXMuc3Ryb2tlV2lkdGhcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHhtbFN0eWxlLnNldFJlbmRlckdyb3VwKGcpO1xyXG4gICAgICAgICAgICBsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoeG1sU3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZW5kZXJJbmZvcm1hdGlvbi5zZXRMaXN0T2ZTdHlsZXMobGlzdE9mU3R5bGVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlckluZm9ybWF0aW9uO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBbm5vdGF0aW9uRXh0ZW5zaW9uOiBmdW5jdGlvbihjeUVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBjeUVsZW1lbnQuZGF0YSgnYW5ub3RhdGlvbnMnKTtcclxuICAgICAgICB2YXIgYW5ub3RFeHQgPSBuZXcgYW5ub3QuQW5ub3RhdGlvbigpO1xyXG4gICAgICAgIHZhciByZGZFbGVtZW50ID0gbmV3IGFubm90LlJkZkVsZW1lbnQoKTtcclxuICAgICAgICBmb3IgKHZhciBhbm5vdElEIGluIGFubm90YXRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50QW5ub3QgPSBhbm5vdGF0aW9uc1thbm5vdElEXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIHZhbGlkaXR5IG9mIGFubm90YXRpb25cclxuICAgICAgICAgICAgaWYoY3VycmVudEFubm90LnN0YXR1cyAhPSAndmFsaWRhdGVkJyB8fCAhY3VycmVudEFubm90LnNlbGVjdGVkREIgfHwgIWN1cnJlbnRBbm5vdC5hbm5vdGF0aW9uVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB1bmNvbnRyb2xsZWQgdm9jYWJ1bGFyeVxyXG4gICAgICAgICAgICBpZihjdXJyZW50QW5ub3Quc2VsZWN0ZWRSZWxhdGlvbiA9PSBcInNpbzpTSU9fMDAwMjIzXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgIG9ialtjdXJyZW50QW5ub3Quc2VsZWN0ZWREQl0gPSBjdXJyZW50QW5ub3QuYW5ub3RhdGlvblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmRmRWxlbWVudC5hZGRDdXN0b21Qcm9wZXJ0eSgnIycrY3lFbGVtZW50LmRhdGEoJ2lkJykgLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgb2JqW2N1cnJlbnRBbm5vdC5zZWxlY3RlZFJlbGF0aW9uXSA9IGN1cnJlbnRBbm5vdC5hbm5vdGF0aW9uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZGZFbGVtZW50LmFkZFJlc291cmNlKCcjJytjeUVsZW1lbnQuZGF0YSgnaWQnKSAsIG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYW5ub3RFeHQuc2V0UmRmRWxlbWVudChyZGZFbGVtZW50KTtcclxuICAgICAgICByZXR1cm4gYW5ub3RFeHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEdseXBoU2Jnbm1sIDogZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBub2RlQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XHJcbiAgICAgICAgdmFyIGdseXBoTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogbm9kZS5fcHJpdmF0ZS5kYXRhLmlkLCBjbGFzc186IG5vZGVDbGFzc30pO1xyXG5cclxuICAgICAgICAvLyBhc3NpZ24gY29tcGFydG1lbnRSZWZcclxuICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIGdseXBoLmNvbXBhcnRtZW50UmVmID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYocGFyZW50Ll9wcml2YXRlLmRhdGEuY2xhc3MgPT0gXCJjb21wYXJ0bWVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGdseXBoLmNvbXBhcnRtZW50UmVmID0gcGFyZW50Ll9wcml2YXRlLmRhdGEuaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG1pc2MgaW5mb3JtYXRpb25cclxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgICAgICAgaWYodHlwZW9mIGxhYmVsICE9ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBnbHlwaC5zZXRMYWJlbChuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBsYWJlbH0pKTtcclxuICAgICAgICAvL2FkZCBjbG9uZSBpbmZvcm1hdGlvblxyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXIgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIGdseXBoLnNldENsb25lKG5ldyBsaWJzYmduanMuQ2xvbmVUeXBlKCkpO1xyXG4gICAgICAgIC8vYWRkIGJib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkR2x5cGhCYm94KG5vZGUpKTtcclxuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXHJcbiAgICAgICAgdmFyIHBvcnRzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgcG9ydHMubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gcG9ydHNbaV0ueCA9PT0gMCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHJhdGlvIG9mIHRoZSBhcmVhIG9jY3VwaWVkIGZvciBwb3J0cyBvdmVyIHRoZSB3aG9sZSBzaGFwZVxyXG4gICAgICAgICAgICB2YXIgcmF0aW8gPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IE1hdGguYWJzKHBvcnRzW2ldLnkpIC8gNTAgOiBNYXRoLmFicyhwb3J0c1tpXS54KSAvIDUwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gRGl2aWRlIHRoZSBub2RlIHNpemVzIGJ5IHRoZSByYXRpbyBiZWNhdXNlIHRoYXQgc2l6ZXMgaW5jbHVkZXMgcG9ydHMgYXMgd2VsbFxyXG4gICAgICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArIHBvcnRzW2ldLnggKiAoIG5vZGUud2lkdGgoKSAvIHJhdGlvICkgLyAxMDA7XHJcbiAgICAgICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55ICsgcG9ydHNbaV0ueSAqICggbm9kZS5oZWlnaHQoKSAvIHJhdGlvICkgLyAxMDA7XHJcblxyXG4gICAgICAgICAgICBnbHlwaC5hZGRQb3J0KG5ldyBsaWJzYmduanMuUG9ydCh7aWQ6IHBvcnRzW2ldLmlkLCB4OiB4LCB5OiB5fSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2FkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcy5sZW5ndGggOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgYm94R2x5cGggPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3NbaV07XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvc0lkID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmlkK1wiX1wiK2k7XHJcbiAgICAgICAgICAgIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInN0YXRlIHZhcmlhYmxlXCIpe1xyXG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBzdGF0ZXNhbmRpbmZvc0lkLCBub2RlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihib3hHbHlwaC5jbGF6eiA9PT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpe1xyXG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBmb3IgYW5ub3RhdGlvbnNcclxuICAgICAgICBpZiAobm9kZS5kYXRhKCdhbm5vdGF0aW9ucycpICYmICEkLmlzRW1wdHlPYmplY3Qobm9kZS5kYXRhKCdhbm5vdGF0aW9ucycpKSkge1xyXG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uO1xyXG4gICAgICAgICAgICBpZihnbHlwaC5leHRlbnNpb24pIHsgLy8gYW4gZXh0ZW5zaW9uIGlzIGFscmVhZHkgdGhlcmUgZm9yIHRoaXNlIGdseXBoXHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBnbHlwaC5leHRlbnNpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBuZXcgbGlic2JnbmpzLkV4dGVuc2lvbigpO1xyXG4gICAgICAgICAgICAgICAgZ2x5cGguc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFubm90RXh0ID0gc2VsZi5nZXRBbm5vdGF0aW9uRXh0ZW5zaW9uKG5vZGUpO1xyXG4gICAgICAgICAgICBleHRlbnNpb24uYWRkKGFubm90RXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCBnbHlwaCBtZW1iZXJzIHRoYXQgYXJlIG5vdCBzdGF0ZSB2YXJpYWJsZXMgb3IgdW5pdCBvZiBpbmZvOiBzdWJ1bml0c1xyXG4gICAgICAgIGlmKG5vZGVDbGFzcyA9PT0gXCJjb21wbGV4XCIgfHwgbm9kZUNsYXNzID09PSBcInN1Ym1hcFwiKXtcclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBnbHlwaE1lbWJlckxpc3QgPSBzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBnbHlwaE1lbWJlckxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaC5hZGRHbHlwaE1lbWJlcihnbHlwaE1lbWJlckxpc3RbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGN1cnJlbnQgZ2x5cGggaXMgZG9uZVxyXG4gICAgICAgIGdseXBoTGlzdC5wdXNoKGdseXBoKTtcclxuXHJcbiAgICAgICAgLy8ga2VlcCBnb2luZyB3aXRoIGFsbCB0aGUgaW5jbHVkZWQgZ2x5cGhzXHJcbiAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2x5cGhMaXN0ID0gZ2x5cGhMaXN0LmNvbmNhdChzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAgZ2x5cGhMaXN0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBcmNTYmdubWwgOiBmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICAvL1RlbXBvcmFyeSBoYWNrIHRvIHJlc29sdmUgXCJ1bmRlZmluZWRcIiBhcmMgc291cmNlIGFuZCB0YXJnZXRzXHJcbiAgICAgICAgdmFyIGFyY1RhcmdldCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0O1xyXG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcclxuXHJcbiAgICAgICAgaWYgKGFyY1NvdXJjZSA9PSBudWxsIHx8IGFyY1NvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcblxyXG4gICAgICAgIGlmIChhcmNUYXJnZXQgPT0gbnVsbCB8fCBhcmNUYXJnZXQubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgYXJjSWQgPSBlZGdlLl9wcml2YXRlLmRhdGEuaWQ7XHJcbiAgICAgICAgdmFyIGFyYyA9IG5ldyBsaWJzYmduanMuQXJjKHtpZDogYXJjSWQsIHNvdXJjZTogYXJjU291cmNlLCB0YXJnZXQ6IGFyY1RhcmdldCwgY2xhc3NfOiBlZGdlLl9wcml2YXRlLmRhdGEuY2xhc3N9KTtcclxuXHJcbiAgICAgICAgYXJjLnNldFN0YXJ0KG5ldyBsaWJzYmduanMuU3RhcnRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5zdGFydFl9KSk7XHJcblxyXG4gICAgICAgIC8vIEV4cG9ydCBiZW5kIHBvaW50cyBpZiBlZGdlQmVuZEVkaXRpbmdFeHRlbnNpb24gaXMgcmVnaXN0ZXJlZFxyXG4gICAgICAgIGlmIChjeS5lZGdlQmVuZEVkaXRpbmcgJiYgY3kuZWRnZUJlbmRFZGl0aW5nKCdpbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgICAgaWYoc2VncHRzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgc2VncHRzICYmIGkgPCBzZWdwdHMubGVuZ3RoOyBpID0gaSArIDIpe1xyXG4gICAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcclxuICAgICAgICAgICAgICB2YXIgYmVuZFkgPSBzZWdwdHNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICBhcmMuYWRkTmV4dChuZXcgbGlic2JnbmpzLk5leHRUeXBlKHt4OiBiZW5kWCwgeTogYmVuZFl9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFyYy5zZXRFbmQobmV3IGxpYnNiZ25qcy5FbmRUeXBlKHt4OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLmVuZFgsIHk6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWX0pKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRpbmFsaXR5ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLmNhcmRpbmFsaXR5O1xyXG4gICAgICAgIGlmKHR5cGVvZiBjYXJkaW5hbGl0eSAhPSAndW5kZWZpbmVkJyAmJiBjYXJkaW5hbGl0eSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFyYy5hZGRHbHlwaChuZXcgbGlic2JnbmpzLkdseXBoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBhcmMuaWQrJ19jYXJkJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzXzogJ2NhcmRpbmFsaXR5JyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBjYXJkaW5hbGl0eX0pLFxyXG4gICAgICAgICAgICAgICAgYmJveDogbmV3IGxpYnNiZ25qcy5CYm94KHt4OiAwLCB5OiAwLCB3OiAwLCBoOiAwfSkgLy8gZHVtbXkgYmJveCwgbmVlZGVkIGZvciBmb3JtYXQgY29tcGxpYW5jZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNoZWNrIGZvciBhbm5vdGF0aW9uc1xyXG4gICAgICAgIGlmIChlZGdlLmRhdGEoJ2Fubm90YXRpb25zJykgJiYgISQuaXNFbXB0eU9iamVjdChlZGdlLmRhdGEoJ2Fubm90YXRpb25zJykpKSB7XHJcbiAgICAgICAgICAgIHZhciBleHRlbnNpb247XHJcbiAgICAgICAgICAgIGlmKGFyYy5leHRlbnNpb24pIHsgLy8gYW4gZXh0ZW5zaW9uIGlzIGFscmVhZHkgdGhlcmUgZm9yIHRoaXNlIGFyY1xyXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJjLmV4dGVuc2lvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IG5ldyBsaWJzYmduanMuRXh0ZW5zaW9uKCk7XHJcbiAgICAgICAgICAgICAgICBhcmMuc2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFubm90RXh0ID0gdGhpcy5nZXRBbm5vdGF0aW9uRXh0ZW5zaW9uKGVkZ2UpO1xyXG4gICAgICAgICAgICBleHRlbnNpb24uYWRkKGFubm90RXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcmM7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgX2NsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIElmIHRoZSBub2RlIGNhbiBoYXZlIHBvcnRzIGFuZCBpdCBoYXMgZXhhY3RseSAyIHBvcnRzIHRoZW4gaXQgaXMgcmVwcmVzZW50ZWQgYnkgYSBiaWdnZXIgYmJveC5cclxuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2UgcmVwcmVzZW50IGl0IGFzIGEgcG9seWdvbiBhbmQgc28gdGhlIHdob2xlIHNoYXBlIGluY2x1ZGluZyB0aGUgcG9ydHMgYXJlIHJlbmRlcmVkIGluIHRoZSBub2RlIGJib3guXHJcbiAgICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVBvcnRzKF9jbGFzcykpIHtcclxuICAgICAgICAgIGlmIChncmFwaFV0aWxpdGllcy5wb3J0c0VuYWJsZWQgPT09IHRydWUgJiYgbm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAvLyBXZSBhc3N1bWUgdGhhdCB0aGUgcG9ydHMgYXJlIHN5bW1ldHJpYyB0byB0aGUgbm9kZSBjZW50ZXIgc28gdXNpbmcganVzdCBvbmUgb2YgdGhlIHBvcnRzIGlzIGVub3VnaFxyXG4gICAgICAgICAgICB2YXIgcG9ydCA9IG5vZGUuZGF0YSgncG9ydHMnKVswXTtcclxuICAgICAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gcG9ydC54ID09PSAwID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgcmF0aW8gb2YgdGhlIGFyZWEgb2NjdXBpZWQgd2l0aCBwb3J0cyBvdmVyIHdpdGhvdXQgcG9ydHNcclxuICAgICAgICAgICAgdmFyIHJhdGlvID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBNYXRoLmFicyhwb3J0LnkpIC8gNTAgOiBNYXRoLmFicyhwb3J0LngpIC8gNTA7XHJcbiAgICAgICAgICAgIC8vIERpdmlkZSB0aGUgYmJveCB0byB0aGUgY2FsY3VsYXRlZCByYXRpbyB0byBnZXQgdGhlIGJib3ggb2YgdGhlIGFjdHVhbCBzaGFwZSBkaXNjbHVkaW5nIHRoZSBwb3J0c1xyXG4gICAgICAgICAgICB3aWR0aCAvPSByYXRpbztcclxuICAgICAgICAgICAgaGVpZ2h0IC89IHJhdGlvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XHJcbiAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgLSBoZWlnaHQvMjtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IGxpYnNiZ25qcy5CYm94KHt4OiB4LCB5OiB5LCB3OiB3aWR0aCwgaDogaGVpZ2h0fSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlQW5kSW5mb0Jib3ggOiBmdW5jdGlvbihub2RlLCBib3hHbHlwaCl7XHJcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XHJcblxyXG4gICAgICAgIHZhciB4ID0gYm94QmJveC54IC8gMTAwICogbm9kZS53aWR0aCgpO1xyXG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCArICh4IC0gYm94QmJveC53LzIpO1xyXG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBsaWJzYmduanMuQmJveCh7eDogeCwgeTogeSwgdzogYm94QmJveC53LCBoOiBib3hCYm94Lmh9KTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU3RhdGVCb3hHbHlwaCA6IGZ1bmN0aW9uKG5vZGUsIGlkLCBtYWluR2x5cGgpe1xyXG5cclxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogaWQsIGNsYXNzXzogJ3N0YXRlIHZhcmlhYmxlJ30pO1xyXG4gICAgICAgIHZhciBzdGF0ZSA9IG5ldyBsaWJzYmduanMuU3RhdGVUeXBlKCk7XHJcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFsdWUgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gbm9kZS5zdGF0ZS52YWx1ZTtcclxuICAgICAgICBpZih0eXBlb2Ygbm9kZS5zdGF0ZS52YXJpYWJsZSAhPSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgc3RhdGUudmFyaWFibGUgPSBub2RlLnN0YXRlLnZhcmlhYmxlO1xyXG4gICAgICAgIGdseXBoLnNldFN0YXRlKHN0YXRlKTtcclxuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdseXBoO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRJbmZvQm94R2x5cGggOiBmdW5jdGlvbihub2RlLCBpZCwgbWFpbkdseXBoKXtcclxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogaWQsIGNsYXNzXzogJ3VuaXQgb2YgaW5mb3JtYXRpb24nfSk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gbmV3IGxpYnNiZ25qcy5MYWJlbCgpO1xyXG4gICAgICAgIGlmKHR5cGVvZiBub2RlLmxhYmVsLnRleHQgIT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIGxhYmVsLnRleHQgPSBub2RlLmxhYmVsLnRleHQ7XHJcbiAgICAgICAgZ2x5cGguc2V0TGFiZWwobGFiZWwpO1xyXG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ2x5cGg7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25Ub1NiZ25tbDtcclxuIiwiLypcclxuICogTGlzdGVuIGRvY3VtZW50IGZvciBrZXlib2FyZCBpbnB1dHMgYW5kIGV4cG9ydHMgdGhlIHV0aWxpdGllcyB0aGF0IGl0IG1ha2VzIHVzZSBvZlxyXG4gKi9cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xyXG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcblxyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbnZhciBrZXlib2FyZElucHV0VXRpbGl0aWVzID0ge1xyXG4gIGlzTnVtYmVyS2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gKCBlLmtleUNvZGUgPj0gNDggJiYgZS5rZXlDb2RlIDw9IDU3ICkgfHwgKCBlLmtleUNvZGUgPj0gOTYgJiYgZS5rZXlDb2RlIDw9IDEwNSApO1xyXG4gIH0sXHJcbiAgaXNEb3RLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDE5MDtcclxuICB9LFxyXG4gIGlzTWludXNTaWduS2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxMDkgfHwgZS5rZXlDb2RlID09PSAxODk7XHJcbiAgfSxcclxuICBpc0xlZnRLZXk6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM3O1xyXG4gIH0sXHJcbiAgaXNSaWdodEtleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzk7XHJcbiAgfSxcclxuICBpc0JhY2tzcGFjZUtleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gODtcclxuICB9LFxyXG4gIGlzVGFiS2V5OiBmdW5jdGlvbihlKSB7XHJcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSA5O1xyXG4gIH0sXHJcbiAgaXNFbnRlcktleTogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTM7XHJcbiAgfSxcclxuICBpc0ludGVnZXJGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNDdHJsT3JDb21tYW5kUHJlc3NlZChlKSB8fCB0aGlzLmlzTWludXNTaWduS2V5KGUpIHx8IHRoaXMuaXNOdW1iZXJLZXkoZSkgXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNCYWNrc3BhY2VLZXkoZSkgfHwgdGhpcy5pc1RhYktleShlKSB8fCB0aGlzLmlzTGVmdEtleShlKSB8fCB0aGlzLmlzUmlnaHRLZXkoZSkgfHwgdGhpcy5pc0VudGVyS2V5KGUpO1xyXG4gIH0sXHJcbiAgaXNGbG9hdEZpZWxkSW5wdXQ6IGZ1bmN0aW9uKHZhbHVlLCBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKSB8fCB0aGlzLmlzRG90S2V5KGUpO1xyXG4gIH0sXHJcbiAgaXNDdHJsT3JDb21tYW5kUHJlc3NlZDogZnVuY3Rpb24oZSkge1xyXG4gICAgcmV0dXJuIGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XHJcbiAgfVxyXG59O1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgJy5pbnRlZ2VyLWlucHV0JywgZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XHJcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKTtcclxuICB9KTtcclxuICBcclxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcclxuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcclxuICAgIHJldHVybiBrZXlib2FyZElucHV0VXRpbGl0aWVzLmlzRmxvYXRGaWVsZElucHV0KHZhbHVlLCBlKTtcclxuICB9KTtcclxuICBcclxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5pbnRlZ2VyLWlucHV0LC5mbG9hdC1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIG1pbiAgID0gJCh0aGlzKS5hdHRyKCdtaW4nKTtcclxuICAgIHZhciBtYXggICA9ICQodGhpcykuYXR0cignbWF4Jyk7XHJcbiAgICB2YXIgdmFsdWUgPSBwYXJzZUZsb2F0KCQodGhpcykudmFsKCkpO1xyXG4gICAgXHJcbiAgICBpZihtaW4gIT0gbnVsbCkge1xyXG4gICAgICBtaW4gPSBwYXJzZUZsb2F0KG1pbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKG1heCAhPSBudWxsKSB7XHJcbiAgICAgIG1heCA9IHBhcnNlRmxvYXQobWF4KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYobWluICE9IG51bGwgJiYgdmFsdWUgPCBtaW4pIHtcclxuICAgICAgdmFsdWUgPSBtaW47XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKG1heCAhPSBudWxsICYmIHZhbHVlID4gbWF4KSB7XHJcbiAgICAgIHZhbHVlID0gbWF4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihpc05hTih2YWx1ZSkpIHtcclxuICAgICAgaWYobWluICE9IG51bGwpIHtcclxuICAgICAgICB2YWx1ZSA9IG1pbjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKG1heCAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtYXg7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgICQodGhpcykudmFsKFwiXCIgKyB2YWx1ZSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZElucHV0VXRpbGl0aWVzO1xyXG4iLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllcztcclxuXHJcbiIsIi8qIFxyXG4gKiBUaGVzZSBhcmUgdGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGRpcmVjdGx5IHV0aWxpemVkIGJ5IHRoZSB1c2VyIGludGVyYWN0aW9ucy5cclxuICogSWRlYWx5LCB0aGlzIGZpbGUgaXMganVzdCByZXF1aXJlZCBieSBpbmRleC5qc1xyXG4gKi9cclxuXHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIganNvblRvU2Jnbm1sID0gcmVxdWlyZSgnLi9qc29uLXRvLXNiZ25tbC1jb252ZXJ0ZXInKTtcclxudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIGdyYXBoVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9ncmFwaC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG4vLyBIZWxwZXJzIHN0YXJ0XHJcbmZ1bmN0aW9uIGJlZm9yZVBlcmZvcm1MYXlvdXQoKSB7XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xyXG5cclxuICBncmFwaFV0aWxpdGllcy5kaXNhYmxlUG9ydHMoKTtcclxuXHJcbiAgLy8gVE9ETyBkbyB0aGlzIGJ5IHVzaW5nIGV4dGVuc2lvbiBBUElcclxuICBjeS4kKCcuZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcclxuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XHJcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXMnLCBbXSk7XHJcbn07XHJcbi8vIEhlbHBlcnMgZW5kXHJcblxyXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge31cclxuXHJcbi8vIEV4cGFuZCBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmV4cGFuZE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcclxuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXHJcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2Rlc1RvRXhwYW5kID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKG5vZGVzKTtcclxuICBpZiAobm9kZXNUb0V4cGFuZC5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzVG9FeHBhbmQsXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmQobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbGxhcHNlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuY29sbGFwc2VOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhub2RlcykubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZShub2Rlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ29sbGFwc2UgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlQ29tcGxleGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxyXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcclxuICBcclxuICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbY2xhc3M9J2NvbXBsZXgnXVwiKTtcclxuICBpZiAoZXhwYW5kQ29sbGFwc2UuY29sbGFwc2libGVOb2Rlcyhjb21wbGV4ZXMpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XHJcbiAgICAgIG5vZGVzOiBjb21wbGV4ZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlUmVjdXJzaXZlbHkoY29tcGxleGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBFeHBhbmQgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmV4cGFuZENvbXBsZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEdldCBleHBhbmRDb2xsYXBzZSBhcGlcclxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XHJcbiAgXHJcbiAgdmFyIG5vZGVzID0gZXhwYW5kQ29sbGFwc2UuZXhwYW5kYWJsZU5vZGVzKGN5Lm5vZGVzKCkuZmlsdGVyKFwiW2NsYXNzPSdjb21wbGV4J11cIikpO1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImV4cGFuZFJlY3Vyc2l2ZWx5XCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBleHBhbmRDb2xsYXBzZS5leHBhbmRSZWN1cnNpdmVseShub2Rlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ29sbGFwc2UgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuY29sbGFwc2VBbGwgPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXHJcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCc6dmlzaWJsZScpO1xyXG4gIGlmIChleHBhbmRDb2xsYXBzZS5jb2xsYXBzaWJsZU5vZGVzKG5vZGVzKS5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNvbGxhcHNlUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlUmVjdXJzaXZlbHkobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEV4cGFuZCBhbGwgbm9kZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5leHBhbmRBbGwgPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXHJcbiAgdmFyIGV4cGFuZENvbGxhcHNlID0gY3kuZXhwYW5kQ29sbGFwc2UoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygnOnZpc2libGUnKSk7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGV4cGFuZENvbGxhcHNlLmV4cGFuZFJlY3Vyc2l2ZWx5KG5vZGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0IGFuZCBoaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxyXG4vLyBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmhpZGVOb2Rlc1NtYXJ0ID0gZnVuY3Rpb24oX25vZGVzKSB7XHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gIFxyXG4gIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XHJcbiAgdmFyIG5vZGVzVG9TaG93ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xyXG4gIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XHJcblxyXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZGVcIiwgbm9kZXNUb0hpZGUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlkZShub2Rlc1RvSGlkZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdC4gXHJcbi8vIFRoZW4gdW5oaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QgYW5kIGhpZGVzIG90aGVycy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5zaG93Tm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuICBcclxuICB2YXIgYWxsTm9kZXMgPSBjeS5lbGVtZW50cygpO1xyXG4gIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXMpO1xyXG4gIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XHJcbiAgXHJcbiAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlkZVwiLCBub2Rlc1RvSGlkZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmlld1V0aWxpdGllcy5oaWRlKG5vZGVzVG9IaWRlKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBVbmhpZGVzIGFsbCBlbGVtZW50cy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5zaG93QWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIGlmIChjeS5lbGVtZW50cygpLmxlbmd0aCA9PT0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykubGVuZ3RoKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93XCIsIGN5LmVsZW1lbnRzKCkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuc2hvdyhjeS5lbGVtZW50cygpKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBSZW1vdmVzIHRoZSBnaXZlbiBlbGVtZW50cyBpbiBhIHNpbXBsZSB3YXkuIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlID0gZnVuY3Rpb24oZWxlcykge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB7XHJcbiAgICAgIGVsZXM6IGVsZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXMucmVtb3ZlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRXh0ZW5kcyB0aGUgZ2l2ZW4gbm9kZXMgbGlzdCBpbiBhIHNtYXJ0IHdheSB0byBsZWF2ZSB0aGUgbWFwIGludGFjdCBhbmQgcmVtb3ZlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxyXG4vLyBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpO1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB7XHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgZWxlczogbm9kZXNcclxuICAgIH0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydChub2Rlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gSGlnaGxpZ2h0cyBuZWlnaGJvdXJzIG9mIHRoZSBnaXZlbiBub2Rlcy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5oaWdobGlnaHROZWlnaGJvdXJzID0gZnVuY3Rpb24oX25vZGVzKSB7XHJcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcclxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xyXG4gIFxyXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmdldE5laWdoYm91cnNPZk5vZGVzKG5vZGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XHJcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGVsZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRmluZHMgdGhlIGVsZW1lbnRzIHdob3NlIGxhYmVsIGluY2x1ZGVzIHRoZSBnaXZlbiBsYWJlbCBhbmQgaGlnaGxpZ2h0cyBwcm9jZXNzZXMgb2YgdGhvc2UgZWxlbWVudHMuXHJcbi8vIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuc2VhcmNoQnlMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XHJcbiAgaWYgKGxhYmVsLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBub2Rlc1RvSGlnaGxpZ2h0ID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xyXG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICBlbGUgPSBpO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsZS5kYXRhKFwibGFiZWxcIikgJiYgZWxlLmRhdGEoXCJsYWJlbFwiKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobGFiZWwpID49IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChub2Rlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXHJcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcclxuXHJcbiAgbm9kZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kTm9kZUxpc3Qobm9kZXNUb0hpZ2hsaWdodCk7XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgbm9kZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmlld1V0aWxpdGllcy5oaWdobGlnaHQobm9kZXNUb0hpZ2hsaWdodCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gSGlnaGxpZ2h0cyBwcm9jZXNzZXMgb2YgdGhlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xyXG4gIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xyXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XHJcbiAgdmFyIGhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKCc6dmlzaWJsZScpLmRpZmZlcmVuY2Uobm90SGlnaGxpZ2h0ZWRFbGVzKTtcclxuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFVuaGlnaGxpZ2h0cyBhbnkgaGlnaGxpZ2h0ZWQgZWxlbWVudC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5yZW1vdmVIaWdobGlnaHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKGVsZW1lbnRVdGlsaXRpZXMubm9uZUlzTm90SGlnaGxpZ2h0ZWQoKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxyXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVIaWdobGlnaHRzXCIpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZpZXdVdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cygpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFBlcmZvcm1zIGxheW91dCBieSBnaXZlbiBsYXlvdXRPcHRpb25zLiBDb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uIEhvd2V2ZXIsIGJ5IHNldHRpbmcgbm90VW5kb2FibGUgcGFyYW1ldGVyXHJcbi8vIHRvIGEgdHJ1dGh5IHZhbHVlIHlvdSBjYW4gZm9yY2UgYW4gdW5kYWJsZSBsYXlvdXQgb3BlcmF0aW9uIGluZGVwZW5kYW50IG9mICd1bmRvYWJsZScgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLnBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRPcHRpb25zLCBub3RVbmRvYWJsZSkge1xyXG4gIC8vIFRoaW5ncyB0byBkbyBiZWZvcmUgcGVyZm9ybWluZyBsYXlvdXRcclxuICBiZWZvcmVQZXJmb3JtTGF5b3V0KCk7XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlIHx8IG5vdFVuZG9hYmxlKSB7IC8vICdub3RVbmRvYWJsZScgZmxhZyBjYW4gYmUgdXNlZCB0byBoYXZlIGNvbXBvc2l0ZSBhY3Rpb25zIGluIHVuZG8vcmVkbyBzdGFja1xyXG4gICAgdmFyIGxheW91dCA9IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpLmxheW91dChsYXlvdXRPcHRpb25zKTtcclxuICAgIFxyXG4gICAgLy8gQ2hlY2sgdGhpcyBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xyXG4gICAgICBsYXlvdXQucnVuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImxheW91dFwiLCB7XHJcbiAgICAgIG9wdGlvbnM6IGxheW91dE9wdGlvbnMsXHJcbiAgICAgIGVsZXM6IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGVzIGFuIHNiZ25tbCBmaWxlIGNvbnRlbnQgZnJvbSB0aGUgZXhpc2luZyBncmFwaCBhbmQgcmV0dXJucyBpdC5cclxubWFpblV0aWxpdGllcy5jcmVhdGVTYmdubWwgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4ganNvblRvU2Jnbm1sLmNyZWF0ZVNiZ25tbCgpO1xyXG59O1xyXG5cclxuLy8gQ29udmVydHMgZ2l2ZW4gc2Jnbm1sIGRhdGEgdG8gYSBqc29uIG9iamVjdCBpbiBhIHNwZWNpYWwgZm9ybWF0IFxyXG4vLyAoaHR0cDovL2pzLmN5dG9zY2FwZS5vcmcvI25vdGF0aW9uL2VsZW1lbnRzLWpzb24pIGFuZCByZXR1cm5zIGl0LlxyXG5tYWluVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUb0pzb24gPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KGRhdGEpO1xyXG59O1xyXG5cclxuLy8gQ3JlYXRlIHRoZSBxdGlwIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBub2RlIGFuZCByZXR1cm5zIGl0LlxyXG5tYWluVXRpbGl0aWVzLmdldFF0aXBDb250ZW50ID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldFF0aXBDb250ZW50KG5vZGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluVXRpbGl0aWVzOyIsIi8qXHJcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcclxuICovXHJcblxyXG4vLyBkZWZhdWx0IG9wdGlvbnNcclxudmFyIGRlZmF1bHRzID0ge1xyXG4gIC8vIFRoZSBwYXRoIG9mIGNvcmUgbGlicmFyeSBpbWFnZXMgd2hlbiBzYmdudml6IGlzIHJlcXVpcmVkIGZyb20gbnBtIGFuZCB0aGUgaW5kZXggaHRtbCBcclxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcclxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXHJcbiAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXHJcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcclxuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJ3JlZ3VsYXInO1xyXG4gIH0sXHJcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xyXG4gIGNvbXBvdW5kUGFkZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIDEwO1xyXG4gIH0sXHJcbiAgLy8gZXh0cmEgcGFkZGluZyBmb3IgY29tcGFydG1lbnRcclxuICBleHRyYUNvbXBhcnRtZW50UGFkZGluZzogMTAsXHJcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXHJcbiAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxyXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxyXG4gIHVuZG9hYmxlOiB0cnVlXHJcbn07XHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xyXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcclxuICB9XHJcbiAgXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7XHJcbiIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2dyYXBoLXV0aWxpdGllcycpO1xyXG52YXIgbGlic2JnbmpzID0gcmVxdWlyZSgnbGlic2Jnbi5qcycpO1xyXG5cclxudmFyIHNiZ25tbFRvSnNvbiA9IHtcclxuICBpbnNlcnRlZE5vZGVzOiB7fSxcclxuICBnZXRBbGxDb21wYXJ0bWVudHM6IGZ1bmN0aW9uIChnbHlwaExpc3QpIHtcclxuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdseXBoTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZ2x5cGhMaXN0W2ldLmNsYXNzXyA9PSAnY29tcGFydG1lbnQnKSB7XHJcbiAgICAgICAgdmFyIGNvbXBhcnRtZW50ID0gZ2x5cGhMaXN0W2ldO1xyXG4gICAgICAgIHZhciBiYm94ID0gY29tcGFydG1lbnQuYmJveDtcclxuICAgICAgICBjb21wYXJ0bWVudHMucHVzaCh7XHJcbiAgICAgICAgICAneCc6IHBhcnNlRmxvYXQoYmJveC54KSxcclxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94LnkpLFxyXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3gudyksXHJcbiAgICAgICAgICAnaCc6IHBhcnNlRmxvYXQoYmJveC5oKSxcclxuICAgICAgICAgICdpZCc6IGNvbXBhcnRtZW50LmlkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJ0bWVudHMuc29ydChmdW5jdGlvbiAoYzEsIGMyKSB7XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA8IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjMS5oICogYzEudyA+IGMyLmggKiBjMi53KSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY29tcGFydG1lbnRzO1xyXG4gIH0sXHJcbiAgaXNJbkJvdW5kaW5nQm94OiBmdW5jdGlvbiAoYmJveDEsIGJib3gyKSB7XHJcbiAgICBpZiAoYmJveDEueCA+IGJib3gyLnggJiZcclxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxyXG4gICAgICAgIGJib3gxLnggKyBiYm94MS53IDwgYmJveDIueCArIGJib3gyLncgJiZcclxuICAgICAgICBiYm94MS55ICsgYmJveDEuaCA8IGJib3gyLnkgKyBiYm94Mi5oKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgYmJveFByb3A6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBiYm94ID0gZWxlLmJib3g7XHJcblxyXG4gICAgLy8gc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcclxuICAgIGJib3gueCA9IHBhcnNlRmxvYXQoYmJveC54KSArIHBhcnNlRmxvYXQoYmJveC53KSAvIDI7XHJcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyO1xyXG5cclxuICAgIHJldHVybiBiYm94O1xyXG4gIH0sXHJcbiAgc3RhdGVBbmRJbmZvQmJveFByb3A6IGZ1bmN0aW9uIChlbGUsIHBhcmVudEJib3gpIHtcclxuICAgIHZhciB4UG9zID0gcGFyc2VGbG9hdChwYXJlbnRCYm94LngpO1xyXG4gICAgdmFyIHlQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueSk7XHJcblxyXG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcclxuXHJcbiAgICAvLyBzZXQgcG9zaXRpb25zIGFzIGNlbnRlclxyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMiAtIHhQb3M7XHJcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyIC0geVBvcztcclxuXHJcbiAgICBiYm94LnggPSBiYm94LnggLyBwYXJzZUZsb2F0KHBhcmVudEJib3gudykgKiAxMDA7XHJcbiAgICBiYm94LnkgPSBiYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XHJcblxyXG4gICAgcmV0dXJuIGJib3g7XHJcbiAgfSxcclxuICBmaW5kQ2hpbGROb2RlczogZnVuY3Rpb24gKGVsZSwgY2hpbGRUYWdOYW1lKSB7XHJcbiAgICAvLyBmaW5kIGNoaWxkIG5vZGVzIGF0IGRlcHRoIGxldmVsIG9mIDEgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnRcclxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2hpbGQgPSBlbGUuY2hpbGROb2Rlc1tpXTtcclxuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxICYmIGNoaWxkLnRhZ05hbWUgPT09IGNoaWxkVGFnTmFtZSkge1xyXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSxcclxuICBmaW5kQ2hpbGROb2RlOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcclxuICAgIHZhciBub2RlcyA9IHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCBjaGlsZFRhZ05hbWUpO1xyXG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aCA+IDAgPyBub2Rlc1swXSA6IHVuZGVmaW5lZDtcclxuICB9LFxyXG4gIHN0YXRlQW5kSW5mb1Byb3A6IGZ1bmN0aW9uIChlbGUsIHBhcmVudEJib3gpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IFtdO1xyXG5cclxuICAgIHZhciBjaGlsZEdseXBocyA9IGVsZS5nbHlwaE1lbWJlcnM7IC8vIHRoaXMuZmluZENoaWxkTm9kZXMoZWxlLCAnZ2x5cGgnKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkR2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBnbHlwaCA9IGNoaWxkR2x5cGhzW2ldO1xyXG4gICAgICB2YXIgaW5mbyA9IHt9O1xyXG5cclxuICAgICAgaWYgKGdseXBoLmNsYXNzXyA9PT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XHJcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLmNsYXp6ID0gZ2x5cGguY2xhc3NfIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBpbmZvLmxhYmVsID0ge1xyXG4gICAgICAgICAgJ3RleHQnOiAoZ2x5cGgubGFiZWwgJiYgZ2x5cGgubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbmZvLmJib3ggPSBzZWxmLnN0YXRlQW5kSW5mb0Jib3hQcm9wKGdseXBoLCBwYXJlbnRCYm94KTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xyXG4gICAgICB9IGVsc2UgaWYgKGdseXBoLmNsYXNzXyA9PT0gJ3N0YXRlIHZhcmlhYmxlJykge1xyXG4gICAgICAgIGluZm8uaWQgPSBnbHlwaC5pZCB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzXyB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gZ2x5cGguc3RhdGU7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gKHN0YXRlICYmIHN0YXRlLnZhbHVlKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gKHN0YXRlICYmIHN0YXRlLnZhcmlhYmxlKSB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaW5mby5zdGF0ZSA9IHtcclxuICAgICAgICAgICd2YWx1ZSc6IHZhbHVlLFxyXG4gICAgICAgICAgJ3ZhcmlhYmxlJzogdmFyaWFibGVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHN0YXRlQW5kSW5mb0FycmF5O1xyXG4gIH0sXHJcbiAgYWRkUGFyZW50SW5mb1RvTm9kZTogZnVuY3Rpb24gKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjb21wYXJ0bWVudFJlZiA9IGVsZS5jb21wYXJ0bWVudFJlZjtcclxuXHJcbiAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbXBhcnRtZW50UmVmKSB7XHJcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRSZWY7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlT2JqLnBhcmVudCA9ICcnO1xyXG5cclxuICAgICAgLy8gYWRkIGNvbXBhcnRtZW50IGFjY29yZGluZyB0byBnZW9tZXRyeVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcnRtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBiYm94RWwgPSBlbGUuYmJveDtcclxuICAgICAgICB2YXIgYmJveCA9IHtcclxuICAgICAgICAgICd4JzogcGFyc2VGbG9hdChiYm94RWwueCksXHJcbiAgICAgICAgICAneSc6IHBhcnNlRmxvYXQoYmJveEVsLnkpLFxyXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3hFbC53KSxcclxuICAgICAgICAgICdoJzogcGFyc2VGbG9hdChiYm94RWwuaCksXHJcbiAgICAgICAgICAnaWQnOiBlbGUuaWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChzZWxmLmlzSW5Cb3VuZGluZ0JveChiYm94LCBjb21wYXJ0bWVudHNbaV0pKSB7XHJcbiAgICAgICAgICBub2RlT2JqLnBhcmVudCA9IGNvbXBhcnRtZW50c1tpXS5pZDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWRkQ3l0b3NjYXBlSnNOb2RlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbm9kZU9iaiA9IHt9O1xyXG5cclxuICAgIC8vIGFkZCBpZCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5pZCA9IGVsZS5pZDtcclxuICAgIC8vIGFkZCBub2RlIGJvdW5kaW5nIGJveCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5iYm94ID0gc2VsZi5iYm94UHJvcChlbGUpO1xyXG4gICAgLy8gYWRkIGNsYXNzIGluZm9ybWF0aW9uXHJcbiAgICBub2RlT2JqLmNsYXNzID0gZWxlLmNsYXNzXztcclxuICAgIC8vIGFkZCBsYWJlbCBpbmZvcm1hdGlvblxyXG4gICAgbm9kZU9iai5sYWJlbCA9IChlbGUubGFiZWwgJiYgZWxlLmxhYmVsLnRleHQpIHx8IHVuZGVmaW5lZDtcclxuICAgIC8vIGFkZCBzdGF0ZSBhbmQgaW5mbyBib3ggaW5mb3JtYXRpb25cclxuICAgIG5vZGVPYmouc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLmJib3gpO1xyXG4gICAgLy8gYWRkaW5nIHBhcmVudCBpbmZvcm1hdGlvblxyXG4gICAgc2VsZi5hZGRQYXJlbnRJbmZvVG9Ob2RlKGVsZSwgbm9kZU9iaiwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xyXG5cclxuICAgIC8vIGFkZCBjbG9uZSBpbmZvcm1hdGlvblxyXG4gICAgaWYgKGVsZS5jbG9uZSkge1xyXG4gICAgICBub2RlT2JqLmNsb25lbWFya2VyID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVPYmouY2xvbmVtYXJrZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIHBvcnQgaW5mb3JtYXRpb25cclxuICAgIHZhciBwb3J0cyA9IFtdO1xyXG4gICAgdmFyIHBvcnRFbGVtZW50cyA9IGVsZS5wb3J0cztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9ydEVsID0gcG9ydEVsZW1lbnRzW2ldO1xyXG4gICAgICB2YXIgaWQgPSBwb3J0RWwuaWQ7XHJcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC54KSAtIG5vZGVPYmouYmJveC54O1xyXG4gICAgICB2YXIgcmVsYXRpdmVZUG9zID0gcGFyc2VGbG9hdChwb3J0RWwueSkgLSBub2RlT2JqLmJib3gueTtcclxuXHJcbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LncpICogMTAwO1xyXG4gICAgICByZWxhdGl2ZVlQb3MgPSByZWxhdGl2ZVlQb3MgLyBwYXJzZUZsb2F0KG5vZGVPYmouYmJveC5oKSAqIDEwMDtcclxuXHJcbiAgICAgIHBvcnRzLnB1c2goe1xyXG4gICAgICAgIGlkOiBpZCxcclxuICAgICAgICB4OiByZWxhdGl2ZVhQb3MsXHJcbiAgICAgICAgeTogcmVsYXRpdmVZUG9zXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGVPYmoucG9ydHMgPSBwb3J0cztcclxuICAgIFxyXG4gICAgdmFyIF9jbGFzcyA9IG5vZGVPYmouY2xhc3M7XHJcbiAgICAvLyBJZiB0aGUgbm9kZSBjYW4gaGF2ZSBwb3J0cyBhbmQgaXQgaGFzIGV4YWN0bHkgMiBwb3J0cyB0aGVuIGl0IHNob3VsZCBiZSByZXByZXNlbnRlZCBieSBhIGJpZ2dlciBiYm94LlxyXG4gICAgLy8gVGhpcyBpcyBiZWNhdXNlIHdlIHJlcHJlc2VudCBpdCBhcyBhIHBvbHlnb24gYW5kIHNvIHRoZSB3aG9sZSBzaGFwZSBpbmNsdWRpbmcgdGhlIHBvcnRzIGFyZSByZW5kZXJlZCBpbiB0aGUgbm9kZSBiYm94LlxyXG4gICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVBvcnRzKF9jbGFzcykpIHtcclxuICAgICAgaWYgKGdyYXBoVXRpbGl0aWVzLnBvcnRzRW5hYmxlZCAmJiBwb3J0cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAvLyBXZSBhc3N1bWUgdGhhdCB0aGUgcG9ydHMgYXJlIHN5bW1ldHJpYyB0byB0aGUgbm9kZSBjZW50ZXIgc28gdXNpbmcganVzdCBvbmUgb2YgdGhlIHBvcnRzIGlzIGVub3VnaFxyXG4gICAgICAgIHZhciBwb3J0ID0gcG9ydHNbMF07XHJcbiAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gcG9ydC54ID09PSAwID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgICAvLyBUaGlzIGlzIHRoZSByYXRpbyBvZiB0aGUgYXJlYSBvY2N1cGllZCB3aXRoIHBvcnRzIG92ZXIgd2l0aG91dCBwb3J0c1xyXG4gICAgICAgIHZhciByYXRpbyA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gTWF0aC5hYnMocG9ydC55KSAvIDUwIDogTWF0aC5hYnMocG9ydC54KSAvIDUwO1xyXG4gICAgICAgIC8vIE11bHRpcGx5IHRoZSBiYm94IHdpdGggdGhlIGNhbGN1bGF0ZWQgcmF0aW9cclxuICAgICAgICBub2RlT2JqLmJib3gudyA9IHBhcnNlRmxvYXQobm9kZU9iai5iYm94LncpICogcmF0aW87XHJcbiAgICAgICAgbm9kZU9iai5iYm94LmggPSBwYXJzZUZsb2F0KG5vZGVPYmouYmJveC5oKSAqIHJhdGlvO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVsZS5leHRlbnNpb24gJiYgZWxlLmV4dGVuc2lvbi5oYXMoJ2Fubm90YXRpb24nKSkgeyAvLyBhbm5vdGF0aW9uIGV4dGVuc2lvbiB3YXMgZm91bmRcclxuICAgICAgdmFyIHJkZkVsZW1lbnQgPSBlbGUuZXh0ZW5zaW9uLmdldCgnYW5ub3RhdGlvbicpLnJkZkVsZW1lbnQ7XHJcbiAgICAgIG5vZGVPYmogPSBzZWxmLmhhbmRsZUFubm90YXRpb25zKG5vZGVPYmosIHJkZkVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjeXRvc2NhcGVKc05vZGUgPSB7ZGF0YTogbm9kZU9ian07XHJcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc05vZGUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogZ2l2ZW4gYSBmdXR1cmUgY3kgb2JqZWN0LCBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudCdzIGxpYnNiZ25qcycgZXh0ZW5zaW9uLCBwb3B1bGF0ZXMgdGhlIGFubm90YXRpb25zIGZpZWxkXHJcbiAgICovXHJcbiAgaGFuZGxlQW5ub3RhdGlvbnM6IGZ1bmN0aW9uKGN5T2JqZWN0LCByZGZFbGVtZW50KSB7XHJcbiAgICAvLyBsb2NhbCB1dGlsaXR5IGZ1bmN0aW9uXHJcbiAgICBmdW5jdGlvbiBkYkZyb21VcmwodXJsKSB7XHJcbiAgICAgIHZhciByZWdleHAgPSAvXmh0dHA6XFwvXFwvaWRlbnRpZmllcnMub3JnXFwvKC4rPylcXC8uKyQvO1xyXG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UocmVnZXhwLCAnJDEnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaWxsRWxlbWVudERhdGFBbm5vdGF0aW9uKGN5T2JqZWN0LCBhbm5vdGF0aW9uSW5kZXgsIHN0YXR1cywgc2VsZWN0ZWREQiwgc2VsZWN0ZWRSZWxhdGlvbiwgYW5ub3RhdGlvblZhbHVlKSB7XHJcbiAgICAgIGlmKCFjeU9iamVjdC5hbm5vdGF0aW9ucykge1xyXG4gICAgICAgIGN5T2JqZWN0LmFubm90YXRpb25zID0ge307XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGFubm90SWQgPSBjeU9iamVjdC5pZCtcIi1hbm5vdC1cIithbm5vdGF0aW9uSW5kZXg7XHJcblxyXG4gICAgICBjeU9iamVjdC5hbm5vdGF0aW9uc1thbm5vdElkXSA9IHtcclxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIG1heSBiZSBoYXphcmRvdXMuIEJ1dCBzZXR0aW5nIGl0IGFzIHVuY2hlY2tlZCBsZWF2ZSB0aGUgYW5ub3RhdGlvbiBvdXQgaWYgdGhlIGZpbGUgaXMgc2F2ZWQuXHJcbiAgICAgICAgLy8gVGhpcyB3b3VsZCBsZWFkIHRvIHRoZSB1c2VyIGxvc2luZyBhbm5vdGF0aW9ucyB3aXRob3V0IGtub3dpbmcgaXQuXHJcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsIC8vIDwtLSB3ZSB0cnVzdCB0aGF0IHdoYXQncyBiZWVuIGxvYWRlZCBpcyB2YWxpZC5cclxuICAgICAgICBzZWxlY3RlZERCOiBzZWxlY3RlZERCLFxyXG4gICAgICAgIHNlbGVjdGVkUmVsYXRpb246IHNlbGVjdGVkUmVsYXRpb24sXHJcbiAgICAgICAgYW5ub3RhdGlvblZhbHVlOiBhbm5vdGF0aW9uVmFsdWVcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIGN5T2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHdlIGFzc3VtZSB0aGF0IHRoZSBpZCBvZiB0aGUgcmRmOmFib3V0IGZpZWxkIGlzIHRoZSBvbmUgb2YgdGhlIGN1cnJlbnQgbm9kZSwgYW5kIHRoYXQgdGhlcmUncyBvbmx5IDEgZGVzY3JpcHRpb25cclxuICAgIHZhciBpZCA9IHJkZkVsZW1lbnQuZ2V0QWxsSWRzKClbMF07XHJcbiAgICB2YXIgcmVzb3VyY2VzID0gcmRmRWxlbWVudC5nZXRSZXNvdXJjZXNPZklkKGlkKTtcclxuICAgIHZhciBjdXN0b21Qcm9wZXJ0aWVzID0gcmRmRWxlbWVudC5nZXRDdXN0b21Qcm9wZXJ0aWVzT2ZJZChpZCk7XHJcblxyXG4gICAgdmFyIGdsb2JhbEFubm90SW5kZXggPSAwO1xyXG4gICAgLy8gaGFuZGxlIGNvbnRyb2xsZWQgcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIgZnVsbFF1YWxpZmllciBpbiByZXNvdXJjZXMpIHtcclxuICAgICAgdmFyIHJlbGF0aW9uID0gbGlic2JnbmpzLmFubm90LlV0aWwucmVkdWNlUHJlZml4KGZ1bGxRdWFsaWZpZXIpO1xyXG4gICAgICBmb3IodmFyIGk9MDsgaTxyZXNvdXJjZXNbZnVsbFF1YWxpZmllcl0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSByZXNvdXJjZXNbZnVsbFF1YWxpZmllcl1baV07XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkREIgPSBkYkZyb21VcmwodmFsdWUpO1xyXG4gICAgICAgIGN5T2JqZWN0ID0gZmlsbEVsZW1lbnREYXRhQW5ub3RhdGlvbihjeU9iamVjdCwgZ2xvYmFsQW5ub3RJbmRleCwgXCJ2YWxpZGF0ZWRcIiwgc2VsZWN0ZWREQiwgcmVsYXRpb24sIHZhbHVlKTtcclxuICAgICAgICBnbG9iYWxBbm5vdEluZGV4Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGhhbmRsZSBjdXN0b20gcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIga2V5IGluIGN1c3RvbVByb3BlcnRpZXMpIHtcclxuICAgICAgdmFyIHZhbHVlID0gY3VzdG9tUHJvcGVydGllc1trZXldO1xyXG4gICAgICBjeU9iamVjdCA9IGZpbGxFbGVtZW50RGF0YUFubm90YXRpb24oY3lPYmplY3QsIGdsb2JhbEFubm90SW5kZXgsIFwidmFsaWRhdGVkXCIsIGtleSwgXCJzaW86U0lPXzAwMDIyM1wiLCB2YWx1ZSk7XHJcbiAgICAgIGdsb2JhbEFubm90SW5kZXgrKztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3lPYmplY3Q7XHJcbiAgfSxcclxuICB0cmF2ZXJzZU5vZGVzOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XHJcbiAgICB2YXIgZWxJZCA9IGVsZS5pZDtcclxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbZWxlLmNsYXNzX10pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnNlcnRlZE5vZGVzW2VsSWRdID0gdHJ1ZTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIC8vIGFkZCBjb21wbGV4IG5vZGVzIGhlcmVcclxuXHJcbiAgICB2YXIgZWxlQ2xhc3MgPSBlbGUuY2xhc3NfO1xyXG5cclxuICAgIGlmIChlbGVDbGFzcyA9PT0gJ2NvbXBsZXgnIHx8IGVsZUNsYXNzID09PSAnY29tcGxleCBtdWx0aW1lcicgfHwgZWxlQ2xhc3MgPT09ICdzdWJtYXAnKSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcblxyXG4gICAgICB2YXIgY2hpbGRHbHlwaHMgPSBlbGUuZ2x5cGhNZW1iZXJzO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkR2x5cGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XHJcbiAgICAgICAgdmFyIGdseXBoQ2xhc3MgPSBnbHlwaC5jbGFzc187XHJcbiAgICAgICAgaWYgKGdseXBoQ2xhc3MgIT09ICdzdGF0ZSB2YXJpYWJsZScgJiYgZ2x5cGhDbGFzcyAhPT0gJ3VuaXQgb2YgaW5mb3JtYXRpb24nKSB7XHJcbiAgICAgICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGpzb25BcnJheSwgZWxJZCwgY29tcGFydG1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGYuYWRkQ3l0b3NjYXBlSnNOb2RlKGVsZSwganNvbkFycmF5LCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRQb3J0czogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgcmV0dXJuICggeG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyA9IHhtbE9iamVjdC5fY2FjaGVkUG9ydHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BvcnQnKSk7XHJcbiAgfSxcclxuICBnZXRHbHlwaHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcclxuICAgIHZhciBnbHlwaHMgPSB4bWxPYmplY3QuX2NhY2hlZEdseXBocztcclxuXHJcbiAgICBpZiAoIWdseXBocykge1xyXG4gICAgICBnbHlwaHMgPSB4bWxPYmplY3QuX2NhY2hlZEdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzIHx8IHhtbE9iamVjdC5xdWVyeVNlbGVjdG9yQWxsKCdnbHlwaCcpO1xyXG5cclxuICAgICAgdmFyIGlkMmdseXBoID0geG1sT2JqZWN0Ll9pZDJnbHlwaCA9IHt9O1xyXG5cclxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHZhciBnID0gZ2x5cGhzW2ldO1xyXG4gICAgICAgIHZhciBpZCA9IGcuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cclxuICAgICAgICBpZDJnbHlwaFsgaWQgXSA9IGc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ2x5cGhzO1xyXG4gIH0sXHJcbiAgZ2V0R2x5cGhCeUlkOiBmdW5jdGlvbiAoeG1sT2JqZWN0LCBpZCkge1xyXG4gICAgdGhpcy5nZXRHbHlwaHMoeG1sT2JqZWN0KTsgLy8gbWFrZSBzdXJlIGNhY2hlIGlzIGJ1aWx0XHJcblxyXG4gICAgcmV0dXJuIHhtbE9iamVjdC5faWQyZ2x5cGhbaWRdO1xyXG4gIH0sXHJcbiAgZ2V0QXJjU291cmNlQW5kVGFyZ2V0OiBmdW5jdGlvbiAoYXJjLCB4bWxPYmplY3QpIHtcclxuICAgIC8vIHNvdXJjZSBhbmQgdGFyZ2V0IGNhbiBiZSBpbnNpZGUgb2YgYSBwb3J0XHJcbiAgICB2YXIgc291cmNlID0gYXJjLnNvdXJjZTtcclxuICAgIHZhciB0YXJnZXQgPSBhcmMudGFyZ2V0O1xyXG4gICAgdmFyIHNvdXJjZU5vZGVJZDtcclxuICAgIHZhciB0YXJnZXROb2RlSWQ7XHJcblxyXG4gICAgdmFyIHNvdXJjZUV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgc291cmNlKTtcclxuICAgIHZhciB0YXJnZXRFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHRhcmdldCk7XHJcblxyXG4gICAgaWYgKHNvdXJjZUV4aXN0cykge1xyXG4gICAgICBzb3VyY2VOb2RlSWQgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEV4aXN0cykge1xyXG4gICAgICB0YXJnZXROb2RlSWQgPSB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciBpO1xyXG4gICAgdmFyIHBvcnRFbHMgPSB0aGlzLmdldFBvcnRzKHhtbE9iamVjdCk7XHJcbiAgICB2YXIgcG9ydDtcclxuICAgIGlmIChzb3VyY2VOb2RlSWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcclxuICAgICAgICBpZiAocG9ydC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHNvdXJjZSkge1xyXG4gICAgICAgICAgc291cmNlTm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0Tm9kZUlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHBvcnRFbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcclxuICAgICAgICBpZiAocG9ydC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgdGFyZ2V0Tm9kZUlkID0gcG9ydC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geydzb3VyY2UnOiBzb3VyY2VOb2RlSWQsICd0YXJnZXQnOiB0YXJnZXROb2RlSWR9O1xyXG4gIH0sXHJcblxyXG4gIGdldEFyY0JlbmRQb2ludFBvc2l0aW9uczogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IFtdO1xyXG5cclxuICAgIHZhciBjaGlsZHJlbiA9IGVsZS5uZXh0cztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3NYID0gY2hpbGRyZW5baV0ueDtcclxuICAgICAgdmFyIHBvc1kgPSBjaGlsZHJlbltpXS55O1xyXG5cclxuICAgICAgYmVuZFBvaW50UG9zaXRpb25zLnB1c2goe1xyXG4gICAgICAgIHg6IHBvc1gsXHJcbiAgICAgICAgeTogcG9zWVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmVuZFBvaW50UG9zaXRpb25zO1xyXG4gIH0sXHJcbiAgYWRkQ3l0b3NjYXBlSnNFZGdlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHhtbE9iamVjdCkge1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmhhbmRsZWRFbGVtZW50c1tlbGUuY2xhc3NfXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldCA9IHNlbGYuZ2V0QXJjU291cmNlQW5kVGFyZ2V0KGVsZSwgeG1sT2JqZWN0KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaW5zZXJ0ZWROb2Rlc1tzb3VyY2VBbmRUYXJnZXQuc291cmNlXSB8fCAhdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC50YXJnZXRdKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZWRnZU9iaiA9IHt9O1xyXG4gICAgdmFyIGJlbmRQb2ludFBvc2l0aW9ucyA9IHNlbGYuZ2V0QXJjQmVuZFBvaW50UG9zaXRpb25zKGVsZSk7XHJcblxyXG4gICAgZWRnZU9iai5pZCA9IGVsZS5pZCB8fCB1bmRlZmluZWQ7XHJcbiAgICBlZGdlT2JqLmNsYXNzID0gZWxlLmNsYXNzXztcclxuICAgIGVkZ2VPYmouYmVuZFBvaW50UG9zaXRpb25zID0gYmVuZFBvaW50UG9zaXRpb25zO1xyXG5cclxuICAgIGVkZ2VPYmouY2FyZGluYWxpdHkgPSAwO1xyXG4gICAgaWYgKGVsZS5nbHlwaHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5nbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZWxlLmdseXBoc1tpXS5jbGFzc18gPT09ICdjYXJkaW5hbGl0eScpIHtcclxuICAgICAgICAgIHZhciBsYWJlbCA9IGVsZS5nbHlwaHNbaV0ubGFiZWw7XHJcbiAgICAgICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gbGFiZWwudGV4dCB8fCB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWRnZU9iai5zb3VyY2UgPSBzb3VyY2VBbmRUYXJnZXQuc291cmNlO1xyXG4gICAgZWRnZU9iai50YXJnZXQgPSBzb3VyY2VBbmRUYXJnZXQudGFyZ2V0O1xyXG5cclxuICAgIGVkZ2VPYmoucG9ydHNvdXJjZSA9IGVsZS5zb3VyY2U7XHJcbiAgICBlZGdlT2JqLnBvcnR0YXJnZXQgPSBlbGUudGFyZ2V0O1xyXG5cclxuICAgIGlmIChlbGUuZXh0ZW5zaW9uICYmIGVsZS5leHRlbnNpb24uaGFzKCdhbm5vdGF0aW9uJykpIHsgLy8gYW5ub3RhdGlvbiBleHRlbnNpb24gd2FzIGZvdW5kXHJcbiAgICAgIHZhciByZGZFbGVtZW50ID0gZWxlLmV4dGVuc2lvbi5nZXQoJ2Fubm90YXRpb24nKS5yZGZFbGVtZW50O1xyXG4gICAgICBlZGdlT2JqID0gc2VsZi5oYW5kbGVBbm5vdGF0aW9ucyhlZGdlT2JqLCByZGZFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNFZGdlID0ge2RhdGE6IGVkZ2VPYmp9O1xyXG4gICAganNvbkFycmF5LnB1c2goY3l0b3NjYXBlSnNFZGdlKTtcclxuICB9LFxyXG4gIGFwcGx5U3R5bGU6IGZ1bmN0aW9uIChyZW5kZXJJbmZvcm1hdGlvbiwgbm9kZXMsIGVkZ2VzKSB7XHJcbiAgICAvLyBnZXQgYWxsIGNvbG9yIGlkIHJlZmVyZW5jZXMgdG8gdGhlaXIgdmFsdWVcclxuICAgIHZhciBjb2xvckxpc3QgPSByZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZDb2xvckRlZmluaXRpb25zLmNvbG9yRGVmaW5pdGlvbnM7XHJcbiAgICB2YXIgY29sb3JJRFRvVmFsdWUgPSB7fTtcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IGNvbG9yTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb2xvcklEVG9WYWx1ZVtjb2xvckxpc3RbaV0uaWRdID0gY29sb3JMaXN0W2ldLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnZlcnQgc3R5bGUgbGlzdCB0byBlbGVtZW50SWQtaW5kZXhlZCBvYmplY3QgcG9pbnRpbmcgdG8gc3R5bGVcclxuICAgIC8vIGFsc28gY29udmVydCBjb2xvciByZWZlcmVuY2VzIHRvIGNvbG9yIHZhbHVlc1xyXG4gICAgdmFyIHN0eWxlTGlzdCA9IHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZlN0eWxlcy5zdHlsZXM7XHJcbiAgICB2YXIgZWxlbWVudElEVG9TdHlsZSA9IHt9O1xyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgc3R5bGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlTGlzdFtpXTtcclxuICAgICAgdmFyIHJlbmRlckdyb3VwID0gc3R5bGUucmVuZGVyR3JvdXA7XHJcblxyXG4gICAgICAvLyBjb252ZXJ0IGNvbG9yIHJlZmVyZW5jZXNcclxuICAgICAgaWYgKHJlbmRlckdyb3VwLnN0cm9rZSAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVuZGVyR3JvdXAuc3Ryb2tlID0gY29sb3JJRFRvVmFsdWVbcmVuZGVyR3JvdXAuc3Ryb2tlXTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocmVuZGVyR3JvdXAuZmlsbCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVuZGVyR3JvdXAuZmlsbCA9IGNvbG9ySURUb1ZhbHVlW3JlbmRlckdyb3VwLmZpbGxdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaWRMaXN0ID0gc3R5bGUuaWRMaXN0LnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGo9MDsgaiA8IGlkTGlzdC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHZhciBpZCA9IGlkTGlzdFtqXTtcclxuICAgICAgICBlbGVtZW50SURUb1N0eWxlW2lkXSA9IHJlbmRlckdyb3VwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGV4VG9EZWNpbWFsIChoZXgpIHtcclxuICAgICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VJbnQoJzB4JytoZXgpIC8gMjU1ICogMTAwKSAvIDEwMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0SGV4Q29sb3IgKGhleCkge1xyXG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PSA3KSB7IC8vIG5vIG9wYWNpdHkgcHJvdmlkZWRcclxuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG51bGwsIGNvbG9yOiBoZXh9O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyAvLyBsZW5ndGggb2YgOVxyXG4gICAgICAgIHZhciBjb2xvciA9IGhleC5zbGljZSgwLDcpO1xyXG4gICAgICAgIHZhciBvcGFjaXR5ID0gaGV4VG9EZWNpbWFsKGhleC5zbGljZSgtMikpO1xyXG4gICAgICAgIHJldHVybiB7b3BhY2l0eTogb3BhY2l0eSwgY29sb3I6IGNvbG9yfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFwcGx5IHRoZSBzdHlsZSB0byBub2RlcyBhbmQgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IHN0eWxlXHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGNvbG9yIHByb3BlcnRpZXMsIHdlIG5lZWQgdG8gY2hlY2sgb3BhY2l0eVxyXG4gICAgICB2YXIgYmdDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5maWxsO1xyXG4gICAgICBpZiAoYmdDb2xvcikge1xyXG4gICAgICAgIHZhciByZXMgPSBjb252ZXJ0SGV4Q29sb3IoYmdDb2xvcik7XHJcbiAgICAgICAgbm9kZS5kYXRhWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSByZXMuY29sb3I7XHJcbiAgICAgICAgbm9kZS5kYXRhWydiYWNrZ3JvdW5kLW9wYWNpdHknXSA9IHJlcy5vcGFjaXR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgYm9yZGVyQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uc3Ryb2tlO1xyXG4gICAgICBpZiAoYm9yZGVyQ29sb3IpIHtcclxuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGJvcmRlckNvbG9yKTtcclxuICAgICAgICBub2RlLmRhdGFbJ2JvcmRlci1jb2xvciddID0gcmVzLmNvbG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgYm9yZGVyV2lkdGggPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uc3Ryb2tlV2lkdGg7XHJcbiAgICAgIGlmIChib3JkZXJXaWR0aCkge1xyXG4gICAgICAgIG5vZGUuZGF0YVsnYm9yZGVyLXdpZHRoJ10gPSBib3JkZXJXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGZvbnRTaXplID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRTaXplO1xyXG4gICAgICBpZiAoZm9udFNpemUpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc2l6ZSddID0gZm9udFNpemU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb250RmFtaWx5ID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRGYW1pbHk7XHJcbiAgICAgIGlmIChmb250RmFtaWx5KSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWydmb250LWZhbWlseSddID0gZm9udEZhbWlseTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGZvbnRTdHlsZSA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5mb250U3R5bGU7XHJcbiAgICAgIGlmIChmb250U3R5bGUpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc3R5bGUnXSA9IGZvbnRTdHlsZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGZvbnRXZWlnaHQgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFdlaWdodDtcclxuICAgICAgaWYgKGZvbnRXZWlnaHQpIHtcclxuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtd2VpZ2h0J10gPSBmb250V2VpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdGV4dEFuY2hvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS50ZXh0QW5jaG9yO1xyXG4gICAgICBpZiAodGV4dEFuY2hvcikge1xyXG4gICAgICAgIG5vZGUuZGF0YVsndGV4dC1oYWxpZ24nXSA9IHRleHRBbmNob3I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB2dGV4dEFuY2hvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS52dGV4dEFuY2hvcjtcclxuICAgICAgaWYgKHZ0ZXh0QW5jaG9yKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhWyd0ZXh0LXZhbGlnbiddID0gdnRleHRBbmNob3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkbyB0aGUgc2FtZSBmb3IgZWRnZXNcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XHJcblxyXG4gICAgICB2YXIgbGluZUNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcclxuICAgICAgaWYgKGxpbmVDb2xvcikge1xyXG4gICAgICAgIHZhciByZXMgPSBjb252ZXJ0SGV4Q29sb3IobGluZUNvbG9yKTtcclxuICAgICAgICBlZGdlLmRhdGFbJ2xpbmUtY29sb3InXSA9IHJlcy5jb2xvcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHdpZHRoID0gZWxlbWVudElEVG9TdHlsZVtlZGdlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xyXG4gICAgICBpZiAod2lkdGgpIHtcclxuICAgICAgICBlZGdlLmRhdGFbJ3dpZHRoJ10gPSB3aWR0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY29udmVydDogZnVuY3Rpb24gKHhtbE9iamVjdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGN5dG9zY2FwZUpzTm9kZXMgPSBbXTtcclxuICAgIHZhciBjeXRvc2NhcGVKc0VkZ2VzID0gW107XHJcblxyXG4gICAgdmFyIHNiZ24gPSBsaWJzYmduanMuU2Jnbi5mcm9tWE1MKHhtbE9iamVjdC5xdWVyeVNlbGVjdG9yKCdzYmduJykpO1xyXG4gICAgdmFyIGNvbXBhcnRtZW50cyA9IHNlbGYuZ2V0QWxsQ29tcGFydG1lbnRzKHNiZ24ubWFwLmdseXBocyk7XHJcblxyXG4gICAgdmFyIGdseXBocyA9IHNiZ24ubWFwLmdseXBocztcclxuICAgIHZhciBhcmNzID0gc2Jnbi5tYXAuYXJjcztcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGdseXBoID0gZ2x5cGhzW2ldO1xyXG4gICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGN5dG9zY2FwZUpzTm9kZXMsICcnLCBjb21wYXJ0bWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBhcmMgPSBhcmNzW2ldO1xyXG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZShhcmMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNiZ24ubWFwLmV4dGVuc2lvbiAmJiBzYmduLm1hcC5leHRlbnNpb24uaGFzKCdyZW5kZXJJbmZvcm1hdGlvbicpKSB7IC8vIHJlbmRlciBleHRlbnNpb24gd2FzIGZvdW5kXHJcbiAgICAgIHNlbGYuYXBwbHlTdHlsZShzYmduLm1hcC5leHRlbnNpb24uZ2V0KCdyZW5kZXJJbmZvcm1hdGlvbicpLCBjeXRvc2NhcGVKc05vZGVzLCBjeXRvc2NhcGVKc0VkZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3l0b3NjYXBlSnNHcmFwaCA9IHt9O1xyXG4gICAgY3l0b3NjYXBlSnNHcmFwaC5ub2RlcyA9IGN5dG9zY2FwZUpzTm9kZXM7XHJcbiAgICBjeXRvc2NhcGVKc0dyYXBoLmVkZ2VzID0gY3l0b3NjYXBlSnNFZGdlcztcclxuXHJcbiAgICB0aGlzLmluc2VydGVkTm9kZXMgPSB7fTtcclxuXHJcbiAgICByZXR1cm4gY3l0b3NjYXBlSnNHcmFwaDtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNiZ25tbFRvSnNvbjtcclxuIiwiLypcclxuICogVGV4dCB1dGlsaXRpZXMgZm9yIGNvbW1vbiB1c2FnZVxyXG4gKi9cclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG5cclxudmFyIHRleHRVdGlsaXRpZXMgPSB7XHJcbiAgLy9UT0RPOiB1c2UgQ1NTJ3MgXCJ0ZXh0LW92ZXJmbG93OmVsbGlwc2lzXCIgc3R5bGUgaW5zdGVhZCBvZiBmdW5jdGlvbiBiZWxvdz9cclxuICB0cnVuY2F0ZVRleHQ6IGZ1bmN0aW9uICh0ZXh0UHJvcCwgZm9udCkge1xyXG4gICAgdmFyIGNvbnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBjb250ZXh0LmZvbnQgPSBmb250O1xyXG4gICAgXHJcbiAgICB2YXIgZml0TGFiZWxzVG9Ob2RlcyA9IG9wdGlvbnMuZml0TGFiZWxzVG9Ob2RlcztcclxuICAgIGZpdExhYmVsc1RvTm9kZXMgPSB0eXBlb2YgZml0TGFiZWxzVG9Ob2RlcyA9PT0gJ2Z1bmN0aW9uJyA/IGZpdExhYmVsc1RvTm9kZXMuY2FsbCgpIDogZml0TGFiZWxzVG9Ob2RlcztcclxuICAgIFxyXG4gICAgdmFyIHRleHQgPSB0ZXh0UHJvcC5sYWJlbCB8fCBcIlwiO1xyXG4gICAgLy9JZiBmaXQgbGFiZWxzIHRvIG5vZGVzIGlzIGZhbHNlIGRvIG5vdCB0cnVuY2F0ZVxyXG4gICAgaWYgKGZpdExhYmVsc1RvTm9kZXMgPT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgd2lkdGg7XHJcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGg7XHJcbiAgICB2YXIgZWxsaXBzaXMgPSBcIi4uXCI7XHJcbiAgICB2YXIgdGV4dFdpZHRoID0gKHRleHRQcm9wLndpZHRoID4gMzApID8gdGV4dFByb3Aud2lkdGggLSAxMCA6IHRleHRQcm9wLndpZHRoO1xyXG4gICAgd2hpbGUgKCh3aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGgpID4gdGV4dFdpZHRoKSB7XHJcbiAgICAgIC0tbGVuO1xyXG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgbGVuKSArIGVsbGlwc2lzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfSxcclxuXHJcbiAgLy8gZW5zdXJlIHRoYXQgcmV0dXJuZWQgc3RyaW5nIGZvbGxvd3MgeHNkOklEIHN0YW5kYXJkXHJcbiAgLy8gc2hvdWxkIGZvbGxvdyByJ15bYS16QS1aX11bXFx3Li1dKiQnXHJcbiAgZ2V0WE1MVmFsaWRJZDogZnVuY3Rpb24ob3JpZ2luYWxJZCkge1xyXG4gICAgdmFyIG5ld0lkID0gXCJcIjtcclxuICAgIHZhciB4bWxWYWxpZFJlZ2V4ID0gL15bYS16QS1aX11bXFx3Li1dKiQvO1xyXG4gICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG9yaWdpbmFsSWQpKSB7IC8vIGRvZXNuJ3QgY29tcGx5XHJcbiAgICAgIG5ld0lkID0gb3JpZ2luYWxJZDtcclxuICAgICAgbmV3SWQgPSBuZXdJZC5yZXBsYWNlKC9bXlxcdy4tXS9nLCBcIlwiKTtcclxuICAgICAgaWYgKCEgeG1sVmFsaWRSZWdleC50ZXN0KG5ld0lkKSkgeyAvLyBzdGlsbCBkb2Vzbid0IGNvbXBseVxyXG4gICAgICAgIG5ld0lkID0gXCJfXCIgKyBuZXdJZDtcclxuICAgICAgICBpZiAoISB4bWxWYWxpZFJlZ2V4LnRlc3QobmV3SWQpKSB7IC8vIG5vcm1hbGx5IHdlIHNob3VsZCBuZXZlciBlbnRlciB0aGlzXHJcbiAgICAgICAgICAvLyBpZiBmb3Igc29tZSBvYnNjdXJlIHJlYXNvbiB3ZSBzdGlsbCBkb24ndCBjb21wbHksIHRocm93IGVycm9yLlxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgbWFrZSBpZGVudGlmZXIgY29tcGx5IHRvIHhzZDpJRCByZXF1aXJlbWVudHM6IFwiK25ld0lkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0lkO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHJldHVybiBvcmlnaW5hbElkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRleHRVdGlsaXRpZXM7IiwiLypcclxuICogQ29tbW9ubHkgbmVlZGVkIFVJIFV0aWxpdGllc1xyXG4gKi9cclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcclxudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbnZhciB1aVV0aWxpdGllcyA9IHtcclxuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcclxuICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3Rvcikud2lkdGgoKTtcclxuICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IpLmhlaWdodCgpO1xyXG4gICAgICAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yICsgJzpwYXJlbnQnKS5wcmVwZW5kKCc8aSBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgei1pbmRleDogOTk5OTk5OTsgbGVmdDogJyArIGNvbnRhaW5lcldpZHRoIC8gMiArICdweDsgdG9wOiAnICsgY29udGFpbmVySGVpZ2h0IC8gMiArICdweDtcIiBjbGFzcz1cImZhIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS0zeCBmYS1mdyAnICsgY2xhc3NOYW1lICsgJ1wiPjwvaT4nKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGVuZFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcclxuICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgIGNsYXNzTmFtZSA9ICdkZWZhdWx0LWNsYXNzJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKCQoJy4nICsgY2xhc3NOYW1lKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQoJy4nICsgY2xhc3NOYW1lKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVpVXRpbGl0aWVzO1xyXG5cclxuXHJcbiIsIi8qXHJcbiAqIFRoaXMgZmlsZSBleHBvcnRzIHRoZSBmdW5jdGlvbnMgdG8gYmUgdXRpbGl6ZWQgaW4gdW5kb3JlZG8gZXh0ZW5zaW9uIGFjdGlvbnMgXHJcbiAqL1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHtcclxuICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgLy8gQWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcbiAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7fTtcclxuICAgIHBhcmFtLmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKGVsZXMpO1xyXG4gICAgcmV0dXJuIHBhcmFtO1xyXG4gIH0sXHJcbiAgZGVsZXRlTm9kZXNTbWFydDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQocGFyYW0uZWxlcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xyXG4gIH0sXHJcbiAgLy8gU2VjdGlvbiBFbmRcclxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19

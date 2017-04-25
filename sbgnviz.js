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
	colorDefinition.id 		= xml.getAttribute('id') || null;
	colorDefinition.value 	= xml.getAttribute('value') || null;
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
	renderGroup.id 			= xml.getAttribute('id') || null;
	renderGroup.fontSize 	= xml.getAttribute('fontSize') || null;
	renderGroup.fontFamily 	= xml.getAttribute('fontFamily') || null;
	renderGroup.fontWeight 	= xml.getAttribute('fontWeight') || null;
	renderGroup.fontStyle 	= xml.getAttribute('fontStyle') || null;
	renderGroup.textAnchor 	= xml.getAttribute('textAnchor') || null;
	renderGroup.vtextAnchor = xml.getAttribute('vtextAnchor') || null;
	renderGroup.stroke 		= xml.getAttribute('stroke') || null;
	renderGroup.strokeWidth = xml.getAttribute('strokeWidth') || null;
	renderGroup.fill 		= xml.getAttribute('fill') || null;
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
	style.id 		= xml.getAttribute('id') || null;
	style.name 		= xml.getAttribute('name') || null;
	style.idList 	= xml.getAttribute('idList') || null;

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
	renderInformation.id 				= xml.getAttribute('id') || null;
	renderInformation.name 				= xml.getAttribute('name') || null;
	renderInformation.programName 		= xml.getAttribute('programName') || null;
	renderInformation.programVersion 	= xml.getAttribute('programVersion') || null;
	renderInformation.backgroundColor 	= xml.getAttribute('backgroundColor') || null;

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
var getFirstLevelGlyphs = _dereq_('./utilities').getFirstLevelGlyphs;
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
	sbgn.xmlns = xmlObj.getAttribute('xmlns') || null;

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
	map.id = xmlObj.getAttribute('id') || null;
	map.language = xmlObj.getAttribute('language') || null;

	// need to be careful here, as there can be glyph in arcs
	//var glyphsXML = xmlObj.querySelectorAll('map > glyph');
	var glyphsXML = getFirstLevelGlyphs(xmlObj);
	for (var i=0; i < glyphsXML.length; i++) {
		var glyph = ns.Glyph.fromXML(glyphsXML[i]);
		map.addGlyph(glyph);
	}
	var arcsXML = xmlObj.getElementsByTagName('arc') || null;
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
};

ns.Extension.prototype.add = function (extension) {
	if (extension instanceof renderExt.RenderInformation) {
		this.list['renderInformation'] = extension;
	}
	else if (extension.nodeType == '1') { // Node.ELEMENT_NODE == 1
		// case where renderInformation is passed unparsed
		if (extension.tagName == 'renderInformation') {
			var renderInformation = renderExt.RenderInformation.fromXML(extension);
			this.list['renderInformation'] = renderInformation;
		}
		else {
			this.list[extension.tagName] = extension;
		}
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
			// weird hack needed here
			// xmldom doesn't serialize extension correctly if the extension has more than one unsupported extension
			// we need to serialize and unserialize it when appending it here
			var serializeExt = new xmldom.XMLSerializer().serializeToString(this.get(extInstance));
			var unserializeExt = new xmldom.DOMParser().parseFromString(serializeExt); // fresh new dom element
			extension.appendChild(unserializeExt);
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
	var children = xmlObj.childNodes;
	for (var i=0; i < children.length; i++) {
		if(!children[i].tagName) { // if tagname is here, real element found
			continue;
		}
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
	glyph.id 				= xmlObj.getAttribute('id') || null;
	glyph.class_ 			= xmlObj.getAttribute('class') || null;
	glyph.compartmentRef 	= xmlObj.getAttribute('compartmentRef') || null;

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
	var children = xmlObj.childNodes;
	for (var j=0; j < children.length; j++) { // loop through all first level children
		var child = children[j];
		if (child.tagName && child.tagName == "glyph") { // here we only want the glyh children
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
	label.text = xmlObj.getAttribute('text') || null;
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
	state.value = xmlObj.getAttribute('value') || null;
	state.variable = xmlObj.getAttribute('variable') || null;
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
	clone.label = xmlObj.getAttribute('label') || null;
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
	port.id = xmlObj.getAttribute('id') || null;
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
	arc.id 		= xmlObj.getAttribute('id') || null;
	arc.class_ 	= xmlObj.getAttribute('class') || null;
	arc.source 	= xmlObj.getAttribute('source') || null;
	arc.target 	= xmlObj.getAttribute('target') || null;

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

ns.getFirstLevelGlyphs = function (xmlObj) {
	var result = [];
	for(var i=0; i<xmlObj.childNodes.length; i++) {
		var child = xmlObj.childNodes[i];
		if (child.tagName && child.tagName == "glyph") {
			result.push(child);
		}
	}
	return result;
};

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

},{"../utilities/lib-utilities":17,"../utilities/text-utilities":21}],12:[function(_dereq_,module,exports){
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

},{"./lib-utilities":17,"./option-utilities":19,"./text-utilities":21}],13:[function(_dereq_,module,exports){
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

},{"../../package.json":8,"./text-utilities":21,"libsbgn.js":2,"pretty-data":4}],16:[function(_dereq_,module,exports){
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
},{"./element-utilities":12,"./json-to-sbgnml-converter":15,"./lib-utilities":17,"./option-utilities":19,"./sbgnml-to-json-converter":20}],19:[function(_dereq_,module,exports){
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

},{"./element-utilities":12,"libsbgn.js":2}],21:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy9saWJzYmduLXJlbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9saWJzYmduLmpzL2xpYnNiZ24uanMiLCJub2RlX21vZHVsZXMvbGlic2Jnbi5qcy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvcHJldHR5LWRhdGEvcHJldHR5LWRhdGEuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS1wYXJzZXIuanMiLCJub2RlX21vZHVsZXMveG1sZG9tL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy94bWxkb20vc2F4LmpzIiwicGFja2FnZS5qc29uIiwic3JjL2luZGV4LmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlLmpzIiwic3JjL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LXJlbmRlcmVyLmpzIiwic3JjL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2dyYXBoLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvanNvbi10by1zYmdubWwtY29udmVydGVyLmpzIiwic3JjL3V0aWxpdGllcy9rZXlib2FyZC1pbnB1dC11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXIuanMiLCJzcmMvdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy91aS11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1dENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3puQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3p4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjaGVja1BhcmFtcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJykuY2hlY2tQYXJhbXM7XG52YXIgeG1sZG9tID0gcmVxdWlyZSgneG1sZG9tJyk7XG5cbnZhciBucyA9IHt9O1xuXG5ucy54bWxucyA9IFwiaHR0cDovL3d3dy5zYm1sLm9yZy9zYm1sL2xldmVsMy92ZXJzaW9uMS9yZW5kZXIvdmVyc2lvbjFcIjtcblxuLy8gLS0tLS0tLSBDT0xPUkRFRklOSVRJT04gLS0tLS0tLVxubnMuQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAndmFsdWUnXSk7XG5cdHRoaXMuaWQgXHQ9IHBhcmFtcy5pZDtcblx0dGhpcy52YWx1ZSBcdD0gcGFyYW1zLnZhbHVlO1xufTtcblxubnMuQ29sb3JEZWZpbml0aW9uLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2NvbG9yRGVmaW5pdGlvbicpO1xuXHRpZiAodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0Y29sb3JEZWZpbml0aW9uLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcblx0fVxuXHRpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG5cdFx0Y29sb3JEZWZpbml0aW9uLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcblx0fVxuXHRyZXR1cm4gY29sb3JEZWZpbml0aW9uO1xufTtcblxubnMuQ29sb3JEZWZpbml0aW9uLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5Db2xvckRlZmluaXRpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdjb2xvckRlZmluaXRpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBjb2xvckRlZmluaXRpb24sIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyBucy5Db2xvckRlZmluaXRpb24oKTtcblx0Y29sb3JEZWZpbml0aW9uLmlkIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0Y29sb3JEZWZpbml0aW9uLnZhbHVlIFx0PSB4bWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpIHx8IG51bGw7XG5cdHJldHVybiBjb2xvckRlZmluaXRpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgQ09MT1JERUZJTklUSU9OIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZDT0xPUkRFRklOSVRJT05TIC0tLS0tLS1cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY29sb3JEZWZpbml0aW9ucyA9IFtdO1xufTtcblxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUuYWRkQ29sb3JEZWZpbml0aW9uID0gZnVuY3Rpb24gKGNvbG9yRGVmaW5pdGlvbikge1xuXHR0aGlzLmNvbG9yRGVmaW5pdGlvbnMucHVzaChjb2xvckRlZmluaXRpb24pO1xufTtcblxubnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBsaXN0T2ZDb2xvckRlZmluaXRpb25zID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycpO1xuXHRmb3IodmFyIGk9MDsgaTx0aGlzLmNvbG9yRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRsaXN0T2ZDb2xvckRlZmluaXRpb25zLmFwcGVuZENoaWxkKHRoaXMuY29sb3JEZWZpbml0aW9uc1tpXS5idWlsZFhtbE9iaigpKTtcblx0fVxuXHRyZXR1cm4gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG5cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcbn07XG5cbm5zLkxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdsaXN0T2ZDb2xvckRlZmluaXRpb25zJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGlzdE9mQ29sb3JEZWZpbml0aW9ucywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyBucy5MaXN0T2ZDb2xvckRlZmluaXRpb25zKCk7XG5cblx0dmFyIGNvbG9yRGVmaW5pdGlvbnMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NvbG9yRGVmaW5pdGlvbicpO1xuXHRmb3IgKHZhciBpPTA7IGk8Y29sb3JEZWZpbml0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjb2xvckRlZmluaXRpb25YTUwgPSBjb2xvckRlZmluaXRpb25zW2ldO1xuXHRcdHZhciBjb2xvckRlZmluaXRpb24gPSBucy5Db2xvckRlZmluaXRpb24uZnJvbVhNTChjb2xvckRlZmluaXRpb25YTUwpO1xuXHRcdGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XG5cdH1cblx0cmV0dXJuIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnM7XG59O1xuLy8gLS0tLS0tLSBFTkQgTElTVE9GQ09MT1JERUZJTklUSU9OUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gUkVOREVSR1JPVVAgLS0tLS0tLVxubnMuUmVuZGVyR3JvdXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdC8vIGVhY2ggb2YgdGhvc2UgYXJlIG9wdGlvbmFsLCBzbyB0ZXN0IGlmIGl0IGlzIGRlZmluZWQgaXMgbWFuZGF0b3J5XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnZm9udFNpemUnLCAnZm9udEZhbWlseScsICdmb250V2VpZ2h0JywgXG5cdFx0J2ZvbnRTdHlsZScsICd0ZXh0QW5jaG9yJywgJ3Z0ZXh0QW5jaG9yJywgJ2ZpbGwnLCAnaWQnLCAnc3Ryb2tlJywgJ3N0cm9rZVdpZHRoJ10pO1xuXHQvLyBzcGVjaWZpYyB0byByZW5kZXJHcm91cFxuXHR0aGlzLmZvbnRTaXplIFx0XHQ9IHBhcmFtcy5mb250U2l6ZTtcblx0dGhpcy5mb250RmFtaWx5IFx0PSBwYXJhbXMuZm9udEZhbWlseTtcblx0dGhpcy5mb250V2VpZ2h0IFx0PSBwYXJhbXMuZm9udFdlaWdodDtcblx0dGhpcy5mb250U3R5bGUgXHRcdD0gcGFyYW1zLmZvbnRTdHlsZTtcblx0dGhpcy50ZXh0QW5jaG9yIFx0PSBwYXJhbXMudGV4dEFuY2hvcjsgLy8gcHJvYmFibHkgdXNlbGVzc1xuXHR0aGlzLnZ0ZXh0QW5jaG9yIFx0PSBwYXJhbXMudnRleHRBbmNob3I7IC8vIHByb2JhYmx5IHVzZWxlc3Ncblx0Ly8gZnJvbSBHcmFwaGljYWxQcmltaXRpdmUyRFxuXHR0aGlzLmZpbGwgXHRcdFx0PSBwYXJhbXMuZmlsbDsgLy8gZmlsbCBjb2xvclxuXHQvLyBmcm9tIEdyYXBoaWNhbFByaW1pdGl2ZTFEXG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMuc3Ryb2tlIFx0XHQ9IHBhcmFtcy5zdHJva2U7IC8vIHN0cm9rZSBjb2xvclxuXHR0aGlzLnN0cm9rZVdpZHRoIFx0PSBwYXJhbXMuc3Ryb2tlV2lkdGg7XG59O1xuXG5ucy5SZW5kZXJHcm91cC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciByZW5kZXJHcm91cCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2cnKTtcblx0aWYgKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcblx0fVxuXHRpZiAodGhpcy5mb250U2l6ZSAhPSBudWxsKSB7XG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250U2l6ZScsIHRoaXMuZm9udFNpemUpO1xuXHR9XG5cdGlmICh0aGlzLmZvbnRGYW1pbHkgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udEZhbWlseScsIHRoaXMuZm9udEZhbWlseSk7XG5cdH1cblx0aWYgKHRoaXMuZm9udFdlaWdodCAhPSBudWxsKSB7XG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmb250V2VpZ2h0JywgdGhpcy5mb250V2VpZ2h0KTtcblx0fVxuXHRpZiAodGhpcy5mb250U3R5bGUgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnZm9udFN0eWxlJywgdGhpcy5mb250U3R5bGUpO1xuXHR9XG5cdGlmICh0aGlzLnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgndGV4dEFuY2hvcicsIHRoaXMudGV4dEFuY2hvcik7XG5cdH1cblx0aWYgKHRoaXMudnRleHRBbmNob3IgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgndnRleHRBbmNob3InLCB0aGlzLnZ0ZXh0QW5jaG9yKTtcblx0fVxuXHRpZiAodGhpcy5zdHJva2UgIT0gbnVsbCkge1xuXHRcdHJlbmRlckdyb3VwLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy5zdHJva2UpO1xuXHR9XG5cdGlmICh0aGlzLnN0cm9rZVdpZHRoICE9IG51bGwpIHtcblx0XHRyZW5kZXJHcm91cC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZVdpZHRoJywgdGhpcy5zdHJva2VXaWR0aCk7XG5cdH1cblx0aWYgKHRoaXMuZmlsbCAhPSBudWxsKSB7XG5cdFx0cmVuZGVyR3JvdXAuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy5maWxsKTtcblx0fVxuXHRyZXR1cm4gcmVuZGVyR3JvdXA7XG59O1xuXG5ucy5SZW5kZXJHcm91cC5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuUmVuZGVyR3JvdXAuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdnJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgcmVuZGVyR3JvdXAgPSBuZXcgbnMuUmVuZGVyR3JvdXAoe30pO1xuXHRyZW5kZXJHcm91cC5pZCBcdFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0cmVuZGVyR3JvdXAuZm9udFNpemUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTaXplJykgfHwgbnVsbDtcblx0cmVuZGVyR3JvdXAuZm9udEZhbWlseSBcdD0geG1sLmdldEF0dHJpYnV0ZSgnZm9udEZhbWlseScpIHx8IG51bGw7XG5cdHJlbmRlckdyb3VwLmZvbnRXZWlnaHQgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRXZWlnaHQnKSB8fCBudWxsO1xuXHRyZW5kZXJHcm91cC5mb250U3R5bGUgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZvbnRTdHlsZScpIHx8IG51bGw7XG5cdHJlbmRlckdyb3VwLnRleHRBbmNob3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3RleHRBbmNob3InKSB8fCBudWxsO1xuXHRyZW5kZXJHcm91cC52dGV4dEFuY2hvciA9IHhtbC5nZXRBdHRyaWJ1dGUoJ3Z0ZXh0QW5jaG9yJykgfHwgbnVsbDtcblx0cmVuZGVyR3JvdXAuc3Ryb2tlIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpIHx8IG51bGw7XG5cdHJlbmRlckdyb3VwLnN0cm9rZVdpZHRoID0geG1sLmdldEF0dHJpYnV0ZSgnc3Ryb2tlV2lkdGgnKSB8fCBudWxsO1xuXHRyZW5kZXJHcm91cC5maWxsIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKSB8fCBudWxsO1xuXHRyZXR1cm4gcmVuZGVyR3JvdXA7XG59O1xuLy8gLS0tLS0tLSBFTkQgUkVOREVSR1JPVVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNUWUxFIC0tLS0tLS1cbi8vIGxvY2FsU3R5bGUgZnJvbSBzcGVjc1xubnMuU3R5bGUgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICduYW1lJywgJ2lkTGlzdCcsICdyZW5kZXJHcm91cCddKTtcblx0dGhpcy5pZCBcdFx0XHQ9IHBhcmFtcy5pZDtcblx0dGhpcy5uYW1lIFx0XHRcdD0gcGFyYW1zLm5hbWU7XG5cdHRoaXMuaWRMaXN0IFx0XHQ9IHBhcmFtcy5pZExpc3Q7IC8vIFRPRE8gYWRkIHV0aWxpdHkgZnVuY3Rpb25zIHRvIG1hbmFnZSB0aGlzIChzaG91bGQgYmUgYXJyYXkpXG5cdHRoaXMucmVuZGVyR3JvdXAgXHQ9IHBhcmFtcy5yZW5kZXJHcm91cDtcbn07XG5cbm5zLlN0eWxlLnByb3RvdHlwZS5zZXRSZW5kZXJHcm91cCA9IGZ1bmN0aW9uIChyZW5kZXJHcm91cCkge1xuXHR0aGlzLnJlbmRlckdyb3VwID0gcmVuZGVyR3JvdXA7XG59O1xuXG5ucy5TdHlsZS5wcm90b3R5cGUuZ2V0SWRMaXN0QXNBcnJheSA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuaWRMaXN0LnNwbGl0KCcgJyk7XG59XG5cbm5zLlN0eWxlLnByb3RvdHlwZS5zZXRJZExpc3RGcm9tQXJyYXkgPSBmdW5jdGlvbiAoaWRBcnJheSkge1xuXHR0aGlzLmlkTGlzdCA9IGlkQXJyYXkuam9pbignICcpO1xufVxuXG5ucy5TdHlsZS5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzdHlsZSA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG5cdH1cblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcblx0fVxuXHRpZiAodGhpcy5pZExpc3QgIT0gbnVsbCkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnaWRMaXN0JywgdGhpcy5pZExpc3QpO1xuXHR9XG5cblx0aWYgKHRoaXMucmVuZGVyR3JvdXApIHtcblx0XHRzdHlsZS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlckdyb3VwLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG5cdHJldHVybiBzdHlsZTtcbn07XG5cbm5zLlN0eWxlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5TdHlsZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ3N0eWxlJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgc3R5bGUsIGdvdDogXCIgKyB4bWwudGFnTmFtZSk7XG5cdH1cblx0dmFyIHN0eWxlID0gbmV3IG5zLlN0eWxlKCk7XG5cdHN0eWxlLmlkIFx0XHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0c3R5bGUubmFtZSBcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgbnVsbDtcblx0c3R5bGUuaWRMaXN0IFx0PSB4bWwuZ2V0QXR0cmlidXRlKCdpZExpc3QnKSB8fCBudWxsO1xuXG5cdHZhciByZW5kZXJHcm91cFhNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZycpWzBdO1xuXHRpZiAocmVuZGVyR3JvdXBYTUwgIT0gbnVsbCkge1xuXHRcdHN0eWxlLnJlbmRlckdyb3VwID0gbnMuUmVuZGVyR3JvdXAuZnJvbVhNTChyZW5kZXJHcm91cFhNTCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUWUxFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBMSVNUT0ZTVFlMRVMgLS0tLS0tLVxubnMuTGlzdE9mU3R5bGVzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3R5bGVzID0gW107XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmFkZFN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcblx0dGhpcy5zdHlsZXMucHVzaChzdHlsZSk7XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbGlzdE9mU3R5bGVzID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGlzdE9mU3R5bGVzJyk7XG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGlzdE9mU3R5bGVzLmFwcGVuZENoaWxkKHRoaXMuc3R5bGVzW2ldLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG5cdHJldHVybiBsaXN0T2ZTdHlsZXM7XG59O1xuXG5ucy5MaXN0T2ZTdHlsZXMucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcbn07XG5cbm5zLkxpc3RPZlN0eWxlcy5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuXHRpZiAoeG1sLnRhZ05hbWUgIT0gJ2xpc3RPZlN0eWxlcycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGxpc3RPZlN0eWxlcywgZ290OiBcIiArIHhtbC50YWdOYW1lKTtcblx0fVxuXHR2YXIgbGlzdE9mU3R5bGVzID0gbmV3IG5zLkxpc3RPZlN0eWxlcygpO1xuXG5cdHZhciBzdHlsZXMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XG5cdGZvciAodmFyIGk9MDsgaTxzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc3R5bGVYTUwgPSBzdHlsZXNbaV07XG5cdFx0dmFyIHN0eWxlID0gbnMuU3R5bGUuZnJvbVhNTChzdHlsZVhNTCk7XG5cdFx0bGlzdE9mU3R5bGVzLmFkZFN0eWxlKHN0eWxlKTtcblx0fVxuXHRyZXR1cm4gbGlzdE9mU3R5bGVzO1xufTtcbi8vIC0tLS0tLS0gRU5EIExJU1RPRlNUWUxFUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gUkVOREVSSU5GT1JNQVRJT04gLS0tLS0tLVxubnMuUmVuZGVySW5mb3JtYXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnbmFtZScsICdwcm9ncmFtTmFtZScsIFxuXHRcdCdwcm9ncmFtVmVyc2lvbicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbGlzdE9mQ29sb3JEZWZpbml0aW9ucycsICdsaXN0T2ZTdHlsZXMnXSk7XG5cdHRoaXMuaWQgXHRcdFx0XHRcdD0gcGFyYW1zLmlkOyAvLyByZXF1aXJlZCwgcmVzdCBpcyBvcHRpb25hbFxuXHR0aGlzLm5hbWUgXHRcdFx0XHRcdD0gcGFyYW1zLm5hbWU7XG5cdHRoaXMucHJvZ3JhbU5hbWUgXHRcdFx0PSBwYXJhbXMucHJvZ3JhbU5hbWU7XG5cdHRoaXMucHJvZ3JhbVZlcnNpb24gXHRcdD0gcGFyYW1zLnByb2dyYW1WZXJzaW9uO1xuXHR0aGlzLmJhY2tncm91bmRDb2xvciBcdFx0PSBwYXJhbXMuYmFja2dyb3VuZENvbG9yO1xuXHR0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMgPSBwYXJhbXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucztcblx0dGhpcy5saXN0T2ZTdHlsZXMgXHRcdFx0PSBwYXJhbXMubGlzdE9mU3R5bGVzO1xuXHQvKnRoaXMubGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucyhyZW5kZXJJbmZvLmNvbG9yRGVmLmNvbG9yTGlzdCk7XG5cdHRoaXMubGlzdE9mU3R5bGVzID0gbmV3IHJlbmRlckV4dGVuc2lvbi5MaXN0T2ZTdHlsZXMocmVuZGVySW5mby5zdHlsZURlZik7XG5cdCovXG59O1xuXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IGZ1bmN0aW9uKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0dGhpcy5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbGlzdE9mQ29sb3JEZWZpbml0aW9ucztcbn07XG5cbm5zLlJlbmRlckluZm9ybWF0aW9uLnByb3RvdHlwZS5zZXRMaXN0T2ZTdHlsZXMgPSBmdW5jdGlvbihsaXN0T2ZTdHlsZXMpIHtcblx0dGhpcy5saXN0T2ZTdHlsZXMgPSBsaXN0T2ZTdHlsZXM7XG59O1xuXG5ucy5SZW5kZXJJbmZvcm1hdGlvbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3JlbmRlckluZm9ybWF0aW9uJyk7XG5cdHJlbmRlckluZm9ybWF0aW9uLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBucy54bWxucyk7XG5cdGlmICh0aGlzLmlkICE9IG51bGwpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG5cdH1cblx0aWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcblx0fVxuXHRpZiAodGhpcy5wcm9ncmFtTmFtZSAhPSBudWxsKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24uc2V0QXR0cmlidXRlKCdwcm9ncmFtTmFtZScsIHRoaXMucHJvZ3JhbU5hbWUpO1xuXHR9XG5cdGlmICh0aGlzLnByb2dyYW1WZXJzaW9uICE9IG51bGwpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ3Byb2dyYW1WZXJzaW9uJywgdGhpcy5wcm9ncmFtVmVyc2lvbik7XG5cdH1cblx0aWYgKHRoaXMuYmFja2dyb3VuZENvbG9yICE9IG51bGwpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5zZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicsIHRoaXMuYmFja2dyb3VuZENvbG9yKTtcblx0fVxuXG5cdGlmICh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0aWYgKHRoaXMubGlzdE9mU3R5bGVzKSB7XG5cdFx0cmVuZGVySW5mb3JtYXRpb24uYXBwZW5kQ2hpbGQodGhpcy5saXN0T2ZTdHlsZXMuYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0cmV0dXJuIHJlbmRlckluZm9ybWF0aW9uO1xufTtcblxubnMuUmVuZGVySW5mb3JtYXRpb24ucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxuLy8gc3RhdGljIGNvbnN0cnVjdG9yIG1ldGhvZFxubnMuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcblx0aWYgKHhtbC50YWdOYW1lICE9ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHJlbmRlckluZm9ybWF0aW9uLCBnb3Q6IFwiICsgeG1sLnRhZ05hbWUpO1xuXHR9XG5cdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IG5ldyBucy5SZW5kZXJJbmZvcm1hdGlvbigpO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5pZCBcdFx0XHRcdD0geG1sLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBudWxsO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5uYW1lIFx0XHRcdFx0PSB4bWwuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgbnVsbDtcblx0cmVuZGVySW5mb3JtYXRpb24ucHJvZ3JhbU5hbWUgXHRcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbU5hbWUnKSB8fCBudWxsO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5wcm9ncmFtVmVyc2lvbiBcdD0geG1sLmdldEF0dHJpYnV0ZSgncHJvZ3JhbVZlcnNpb24nKSB8fCBudWxsO1xuXHRyZW5kZXJJbmZvcm1hdGlvbi5iYWNrZ3JvdW5kQ29sb3IgXHQ9IHhtbC5nZXRBdHRyaWJ1dGUoJ2JhY2tncm91bmRDb2xvcicpIHx8IG51bGw7XG5cblx0dmFyIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpc3RPZkNvbG9yRGVmaW5pdGlvbnMnKVswXTtcblx0dmFyIGxpc3RPZlN0eWxlc1hNTCA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGlzdE9mU3R5bGVzJylbMF07XG5cdGlmIChsaXN0T2ZDb2xvckRlZmluaXRpb25zWE1MICE9IG51bGwpIHtcblx0XHRyZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZDb2xvckRlZmluaXRpb25zID0gbnMuTGlzdE9mQ29sb3JEZWZpbml0aW9ucy5mcm9tWE1MKGxpc3RPZkNvbG9yRGVmaW5pdGlvbnNYTUwpO1xuXHR9XG5cdGlmIChsaXN0T2ZTdHlsZXNYTUwgIT0gbnVsbCkge1xuXHRcdHJlbmRlckluZm9ybWF0aW9uLmxpc3RPZlN0eWxlcyA9IG5zLkxpc3RPZlN0eWxlcy5mcm9tWE1MKGxpc3RPZlN0eWxlc1hNTCk7XG5cdH1cblxuXHRyZXR1cm4gcmVuZGVySW5mb3JtYXRpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgUkVOREVSSU5GT1JNQVRJT04gLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsInZhciByZW5kZXJFeHQgPSByZXF1aXJlKCcuL2xpYnNiZ24tcmVuZGVyJyk7XG4vL3ZhciBhbm5vdEV4dCA9IHJlcXVpcmUoJy4vbGlic2Jnbi1hbm5vdGF0aW9ucycpO1xudmFyIGNoZWNrUGFyYW1zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5jaGVja1BhcmFtcztcbnZhciBnZXRGaXJzdExldmVsR2x5cGhzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKS5nZXRGaXJzdExldmVsR2x5cGhzO1xudmFyIHhtbGRvbSA9IHJlcXVpcmUoJ3htbGRvbScpO1xuXG52YXIgbnMgPSB7fTtcblxubnMueG1sbnMgPSBcImh0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuM1wiO1xuXG4vLyAtLS0tLS0tIFNCR05CYXNlIC0tLS0tLS1cbi8qXG5cdFNldmVyYWwgc2JnbiBlbGVtZW50cyBpbmhlcml0IGZyb20gdGhpcy4gQWxsb3dzIHRvIHB1dCBleHRlbnNpb25zIGV2ZXJ5d2hlcmUuXG4qL1xubnMuU0JHTkJhc2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnZXh0ZW5zaW9uJ10pO1xuXHR0aGlzLmV4dGVuc2lvbiBcdD0gcGFyYW1zLmV4dGVuc2lvbjtcbn07XG5cbm5zLlNCR05CYXNlLnByb3RvdHlwZS5zZXRFeHRlbnNpb24gPSBmdW5jdGlvbiAoZXh0ZW5zaW9uKSB7XG5cdHRoaXMuZXh0ZW5zaW9uID0gZXh0ZW5zaW9uO1xufTtcblxuLy8gd3JpdGUgdGhlIFhNTCBvZiB0aGluZ3MgdGhhdCBhcmUgc3BlY2lmaWMgdG8gU0JHTkJhc2UgdHlwZVxubnMuU0JHTkJhc2UucHJvdG90eXBlLmJhc2VUb1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiXCI7XG5cdC8vIGNoaWxkcmVuXG5cdGlmKHRoaXMuZXh0ZW5zaW9uICE9IG51bGwpIHtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5leHRlbnNpb24udG9YTUwoKTtcblx0fVxuXG5cdHJldHVybiB4bWxTdHJpbmc7XG59O1xuXG5ucy5TQkdOQmFzZS5wcm90b3R5cGUuYmFzZVRvWG1sT2JqID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZih0aGlzLmV4dGVuc2lvbiAhPSBudWxsKSB7XG5cdFx0eG1sT2JqLmFwcGVuZENoaWxkKHRoaXMuZXh0ZW5zaW9uLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG59O1xuXG4vLyBwYXJzZSB0aGluZ3Mgc3BlY2lmaWMgdG8gU0JHTkJhc2UgdHlwZVxubnMuU0JHTkJhc2UucHJvdG90eXBlLmJhc2VGcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHQvLyBjaGlsZHJlblxuXHR2YXIgZXh0ZW5zaW9uWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdleHRlbnNpb24nKVswXTtcblx0aWYgKGV4dGVuc2lvblhNTCAhPSBudWxsKSB7XG5cdFx0dmFyIGV4dGVuc2lvbiA9IG5zLkV4dGVuc2lvbi5mcm9tWE1MKGV4dGVuc2lvblhNTCk7XG5cdFx0dGhpcy5zZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcblx0fVxufTtcblxubnMuU0JHTkJhc2UucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYWxsb3dlZENoaWxkcmVuID0gWydleHRlbnNpb24nXS5jb25jYXQodGhpcy5hbGxvd2VkQ2hpbGRyZW4pO1xuXHRmb3IodmFyIGk9MDsgaSA8IGFsbG93ZWRDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBwcm9wID0gYWxsb3dlZENoaWxkcmVuW2ldO1xuXHRcdGlmKHR5cGVvZiB0aGlzW3Byb3BdID09ICdhcnJheScgJiYgdGhpc1twcm9wXS5sZW5ndGggPiAwKVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0aWYodGhpc1twcm9wXSlcblx0XHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLy8gZm9yIHNpbXBsZSBlbGVtZW50cyB0aGF0IGhhdmUgbm8gY2hpbGRyZW4sIHVzZSB0aGlzIGZ1bmN0aW9uIHRvXG4vLyBlbnN1cmUgdGFnIGlzIGNsb3NlZCBjb3JyZWN0bHkgd2hlbiB3cml0aW5nIFhNTCwgaWYgZXh0ZW5zaW9uXG4vLyBvciBvdGhlciBTQkdOQmFzZSBzcGVjaWZpYyB0aGluZ3MgYXJlIHByZXNlbnQuXG4vLyBzaW1wbGUgZWxlbWVudHMgbWlnaHQgZW5kIHdpdGggLz4gb3IgPC9uYW1lPiBcbm5zLlNCR05CYXNlLnByb3RvdHlwZS5jbG9zZVRhZyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHhtbFN0cmluZyA9IFwiXCI7XG5cdGlmKHRoaXMuaGFzQ2hpbGRyZW4oKSkge1xuXHRcdHhtbFN0cmluZyArPSBcIj5cXG5cIjtcblx0XHR4bWxTdHJpbmcgKz0gdGhpcy5iYXNlVG9YTUwoKTtcblx0XHR4bWxTdHJpbmcgKz0gXCI8L1wiK3RoaXMudGFnTmFtZStcIj5cXG5cIjtcblx0fVxuXHRlbHNlIHtcblx0XHR4bWxTdHJpbmcgKz0gXCIgLz5cXG5cIjtcblx0fVxuXHRyZXR1cm4geG1sU3RyaW5nO1xufVxuLy8gLS0tLS0tLSBFTkQgU0JHTkJhc2UgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNCR04gLS0tLS0tLVxubnMuU2JnbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0bnMuU0JHTkJhc2UuY2FsbCh0aGlzLCBwYXJhbXMpO1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3htbG5zJywgJ21hcCddKTtcblx0dGhpcy54bWxucyBcdD0gcGFyYW1zLnhtbG5zO1xuXHR0aGlzLm1hcCBcdD0gcGFyYW1zLm1hcDtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnbWFwJ107XG5cdHRoaXMudGFnTmFtZSA9ICdzYmduJztcbn07XG5cbm5zLlNiZ24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuU2Jnbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5TYmduO1xuXG5ucy5TYmduLnByb3RvdHlwZS5zZXRNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG5cdHRoaXMubWFwID0gbWFwO1xufTtcblxubnMuU2Jnbi5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzYmduID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc2JnbicpO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMueG1sbnMgIT0gbnVsbCkge1xuXHRcdHNiZ24uc2V0QXR0cmlidXRlKCd4bWxucycsIHRoaXMueG1sbnMpO1xuXHR9XG5cdGlmKHRoaXMubGFuZ3VhZ2UgIT0gbnVsbCkge1xuXHRcdHNiZ24uc2V0QXR0cmlidXRlKCdsYW5ndWFnZScsIHRoaXMubGFuZ3VhZ2UpO1xuXHR9XG5cdC8vIGNoaWxkcmVuXG5cdHRoaXMuYmFzZVRvWG1sT2JqKHNiZ24pO1xuXHRpZiAodGhpcy5tYXAgIT0gbnVsbCkge1xuXHRcdHNiZ24uYXBwZW5kQ2hpbGQodGhpcy5tYXAuYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0cmV0dXJuIHNiZ247XG59O1xuXG5ucy5TYmduLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5TYmduLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc2JnbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIHNiZ24sIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIHNiZ24gPSBuZXcgbnMuU2JnbigpO1xuXHRzYmduLnhtbG5zID0geG1sT2JqLmdldEF0dHJpYnV0ZSgneG1sbnMnKSB8fCBudWxsO1xuXG5cdC8vIGdldCBjaGlsZHJlblxuXHR2YXIgbWFwWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtYXAnKVswXTtcblx0aWYgKG1hcFhNTCAhPSBudWxsKSB7XG5cdFx0dmFyIG1hcCA9IG5zLk1hcC5mcm9tWE1MKG1hcFhNTCk7XG5cdFx0c2Jnbi5zZXRNYXAobWFwKTtcblx0fVxuXHRzYmduLmJhc2VGcm9tWE1MKHhtbE9iaik7IC8vIGNhbGwgdG8gcGFyZW50IGNsYXNzXG5cdHJldHVybiBzYmduO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNCR04gLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE1BUCAtLS0tLS0tXG5ucy5NYXAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdsYW5ndWFnZScsICdnbHlwaHMnLCAnYXJjcyddKTtcblx0dGhpcy5pZCBcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMubGFuZ3VhZ2UgXHQ9IHBhcmFtcy5sYW5ndWFnZTtcblx0dGhpcy5nbHlwaHMgXHQ9IHBhcmFtcy5nbHlwaHMgfHwgW107XG5cdHRoaXMuYXJjcyBcdFx0PSBwYXJhbXMuYXJjcyB8fCBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnZ2x5cGhzJywgJ2FyY3MnXTtcblx0dGhpcy50YWdOYW1lID0gJ21hcCc7XG59O1xuXG5ucy5NYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuTWFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLk1hcDtcblxubnMuTWFwLnByb3RvdHlwZS5hZGRHbHlwaCA9IGZ1bmN0aW9uIChnbHlwaCkge1xuXHR0aGlzLmdseXBocy5wdXNoKGdseXBoKTtcbn07XG5cbm5zLk1hcC5wcm90b3R5cGUuYWRkQXJjID0gZnVuY3Rpb24gKGFyYykge1xuXHR0aGlzLmFyY3MucHVzaChhcmMpO1xufTtcblxubnMuTWFwLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIG1hcCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ21hcCcpO1xuXHQvLyBhdHRyaWJ1dGVzXG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdG1hcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG5cdH1cblx0aWYodGhpcy5sYW5ndWFnZSAhPSBudWxsKSB7XG5cdFx0bWFwLnNldEF0dHJpYnV0ZSgnbGFuZ3VhZ2UnLCB0aGlzLmxhbmd1YWdlKTtcblx0fVxuXHQvLyBjaGlsZHJlblxuXHR0aGlzLmJhc2VUb1htbE9iaihtYXApO1xuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMuZ2x5cGhzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bWFwLmFwcGVuZENoaWxkKHRoaXMuZ2x5cGhzW2ldLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5hcmNzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bWFwLmFwcGVuZENoaWxkKHRoaXMuYXJjc1tpXS5idWlsZFhtbE9iaigpKTtcblx0fVxuXHRyZXR1cm4gbWFwO1xufTtcblxubnMuTWFwLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5NYXAuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdtYXAnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBtYXAsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIG1hcCA9IG5ldyBucy5NYXAoKTtcblx0bWFwLmlkID0geG1sT2JqLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBudWxsO1xuXHRtYXAubGFuZ3VhZ2UgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYW5ndWFnZScpIHx8IG51bGw7XG5cblx0Ly8gbmVlZCB0byBiZSBjYXJlZnVsIGhlcmUsIGFzIHRoZXJlIGNhbiBiZSBnbHlwaCBpbiBhcmNzXG5cdC8vdmFyIGdseXBoc1hNTCA9IHhtbE9iai5xdWVyeVNlbGVjdG9yQWxsKCdtYXAgPiBnbHlwaCcpO1xuXHR2YXIgZ2x5cGhzWE1MID0gZ2V0Rmlyc3RMZXZlbEdseXBocyh4bWxPYmopO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBnbHlwaHNYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZ2x5cGggPSBucy5HbHlwaC5mcm9tWE1MKGdseXBoc1hNTFtpXSk7XG5cdFx0bWFwLmFkZEdseXBoKGdseXBoKTtcblx0fVxuXHR2YXIgYXJjc1hNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYXJjJykgfHwgbnVsbDtcblx0Zm9yICh2YXIgaT0wOyBpIDwgYXJjc1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBhcmMgPSBucy5BcmMuZnJvbVhNTChhcmNzWE1MW2ldKTtcblx0XHRtYXAuYWRkQXJjKGFyYyk7XG5cdH1cblxuXHRtYXAuYmFzZUZyb21YTUwoeG1sT2JqKTtcblx0cmV0dXJuIG1hcDtcbn07XG4vLyAtLS0tLS0tIEVORCBNQVAgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVYVEVOU0lPTlMgLS0tLS0tLVxubnMuRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuXHQvLyBjb25zaWRlciBmaXJzdCBvcmRlciBjaGlsZHJlbiwgYWRkIHRoZW0gd2l0aCB0aGVpciB0YWduYW1lIGFzIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0XG5cdC8vIHN0b3JlIHhtbE9iamVjdCBpZiBubyBzdXBwb3J0ZWQgcGFyc2luZyAodW5yZWNvZ25pemVkIGV4dGVuc2lvbnMpXG5cdC8vIGVsc2Ugc3RvcmUgaW5zdGFuY2Ugb2YgdGhlIGV4dGVuc2lvblxuXHR0aGlzLmxpc3QgPSB7fTtcbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuXHRpZiAoZXh0ZW5zaW9uIGluc3RhbmNlb2YgcmVuZGVyRXh0LlJlbmRlckluZm9ybWF0aW9uKSB7XG5cdFx0dGhpcy5saXN0WydyZW5kZXJJbmZvcm1hdGlvbiddID0gZXh0ZW5zaW9uO1xuXHR9XG5cdGVsc2UgaWYgKGV4dGVuc2lvbi5ub2RlVHlwZSA9PSAnMScpIHsgLy8gTm9kZS5FTEVNRU5UX05PREUgPT0gMVxuXHRcdC8vIGNhc2Ugd2hlcmUgcmVuZGVySW5mb3JtYXRpb24gaXMgcGFzc2VkIHVucGFyc2VkXG5cdFx0aWYgKGV4dGVuc2lvbi50YWdOYW1lID09ICdyZW5kZXJJbmZvcm1hdGlvbicpIHtcblx0XHRcdHZhciByZW5kZXJJbmZvcm1hdGlvbiA9IHJlbmRlckV4dC5SZW5kZXJJbmZvcm1hdGlvbi5mcm9tWE1MKGV4dGVuc2lvbik7XG5cdFx0XHR0aGlzLmxpc3RbJ3JlbmRlckluZm9ybWF0aW9uJ10gPSByZW5kZXJJbmZvcm1hdGlvbjtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmxpc3RbZXh0ZW5zaW9uLnRhZ05hbWVdID0gZXh0ZW5zaW9uO1xuXHRcdH1cblx0fVxufTtcblxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uTmFtZSkge1xuXHRyZXR1cm4gdGhpcy5saXN0Lmhhc093blByb3BlcnR5KGV4dGVuc2lvbk5hbWUpO1xufTtcblxubnMuRXh0ZW5zaW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uTmFtZSkge1xuXHRpZiAodGhpcy5oYXMoZXh0ZW5zaW9uTmFtZSkpIHtcblx0XHRyZXR1cm4gdGhpcy5saXN0W2V4dGVuc2lvbk5hbWVdO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xuXG5ucy5FeHRlbnNpb24ucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgZXh0ZW5zaW9uID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZXh0ZW5zaW9uJyk7XG5cdGZvciAodmFyIGV4dEluc3RhbmNlIGluIHRoaXMubGlzdCkge1xuXHRcdGlmIChleHRJbnN0YW5jZSA9PSBcInJlbmRlckluZm9ybWF0aW9uXCIpIHtcblx0XHRcdGV4dGVuc2lvbi5hcHBlbmRDaGlsZCh0aGlzLmdldChleHRJbnN0YW5jZSkuYnVpbGRYbWxPYmooKSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gd2VpcmQgaGFjayBuZWVkZWQgaGVyZVxuXHRcdFx0Ly8geG1sZG9tIGRvZXNuJ3Qgc2VyaWFsaXplIGV4dGVuc2lvbiBjb3JyZWN0bHkgaWYgdGhlIGV4dGVuc2lvbiBoYXMgbW9yZSB0aGFuIG9uZSB1bnN1cHBvcnRlZCBleHRlbnNpb25cblx0XHRcdC8vIHdlIG5lZWQgdG8gc2VyaWFsaXplIGFuZCB1bnNlcmlhbGl6ZSBpdCB3aGVuIGFwcGVuZGluZyBpdCBoZXJlXG5cdFx0XHR2YXIgc2VyaWFsaXplRXh0ID0gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5nZXQoZXh0SW5zdGFuY2UpKTtcblx0XHRcdHZhciB1bnNlcmlhbGl6ZUV4dCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHNlcmlhbGl6ZUV4dCk7IC8vIGZyZXNoIG5ldyBkb20gZWxlbWVudFxuXHRcdFx0ZXh0ZW5zaW9uLmFwcGVuZENoaWxkKHVuc2VyaWFsaXplRXh0KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGV4dGVuc2lvbjtcbn07XG5cbm5zLkV4dGVuc2lvbi5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuRXh0ZW5zaW9uLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZXh0ZW5zaW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgZXh0ZW5zaW9uLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBleHRlbnNpb24gPSBuZXcgbnMuRXh0ZW5zaW9uKCk7XG5cdHZhciBjaGlsZHJlbiA9IHhtbE9iai5jaGlsZE5vZGVzO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmKCFjaGlsZHJlbltpXS50YWdOYW1lKSB7IC8vIGlmIHRhZ25hbWUgaXMgaGVyZSwgcmVhbCBlbGVtZW50IGZvdW5kXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0dmFyIGV4dFhtbE9iaiA9IGNoaWxkcmVuW2ldO1xuXHRcdHZhciBleHROYW1lID0gZXh0WG1sT2JqLnRhZ05hbWU7XG5cdFx0Ly9leHRlbnNpb24uYWRkKGV4dEluc3RhbmNlKTtcblx0XHRpZiAoZXh0TmFtZSA9PSAncmVuZGVySW5mb3JtYXRpb24nKSB7XG5cdFx0XHR2YXIgcmVuZGVySW5mb3JtYXRpb24gPSByZW5kZXJFeHQuUmVuZGVySW5mb3JtYXRpb24uZnJvbVhNTChleHRYbWxPYmopO1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChyZW5kZXJJbmZvcm1hdGlvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGV4dE5hbWUgPT0gJ2Fubm90YXRpb25zJykge1xuXHRcdFx0ZXh0ZW5zaW9uLmFkZChleHRYbWxPYmopOyAvLyB0byBiZSBwYXJzZWQgY29ycmVjdGx5XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyB1bnN1cHBvcnRlZCBleHRlbnNpb24sIHdlIHN0aWxsIHN0b3JlIHRoZSBkYXRhIGFzIGlzXG5cdFx0XHRleHRlbnNpb24uYWRkKGV4dFhtbE9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59O1xuLy8gLS0tLS0tLSBFTkQgRVhURU5TSU9OUyAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gR0xZUEggLS0tLS0tLVxubnMuR2x5cGggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWydpZCcsICdjbGFzc18nLCAnY29tcGFydG1lbnRSZWYnLCAnbGFiZWwnLCAnYmJveCcsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnLCAnc3RhdGUnLCAnY2xvbmUnXSk7XG5cdHRoaXMuaWQgXHRcdFx0PSBwYXJhbXMuaWQ7XG5cdHRoaXMuY2xhc3NfIFx0XHQ9IHBhcmFtcy5jbGFzc187XG5cdHRoaXMuY29tcGFydG1lbnRSZWYgPSBwYXJhbXMuY29tcGFydG1lbnRSZWY7XG5cblx0Ly8gY2hpbGRyZW5cblx0dGhpcy5sYWJlbCBcdFx0XHQ9IHBhcmFtcy5sYWJlbDtcblx0dGhpcy5zdGF0ZSBcdFx0XHQ9IHBhcmFtcy5zdGF0ZTtcblx0dGhpcy5iYm94IFx0XHRcdD0gcGFyYW1zLmJib3g7XG5cdHRoaXMuY2xvbmUgXHRcdFx0PSBwYXJhbXMuY2xvbmU7XG5cdHRoaXMuZ2x5cGhNZW1iZXJzIFx0PSBwYXJhbXMuZ2x5cGhNZW1iZXJzIHx8IFtdOyAvLyBjYXNlIG9mIGNvbXBsZXgsIGNhbiBoYXZlIGFyYml0cmFyeSBsaXN0IG9mIG5lc3RlZCBnbHlwaHNcblx0dGhpcy5wb3J0cyBcdFx0XHQ9IHBhcmFtcy5wb3J0cyB8fCBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnbGFiZWwnLCAnc3RhdGUnLCAnYmJveCcsICdjbG9uZScsICdnbHlwaE1lbWJlcnMnLCAncG9ydHMnXTtcblx0dGhpcy50YWdOYW1lID0gJ2dseXBoJztcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLkdseXBoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkdseXBoO1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbiAobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG5cdHRoaXMuc3RhdGUgPSBzdGF0ZTtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRCYm94ID0gZnVuY3Rpb24gKGJib3gpIHtcblx0dGhpcy5iYm94ID0gYmJveDtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5zZXRDbG9uZSA9IGZ1bmN0aW9uIChjbG9uZSkge1xuXHR0aGlzLmNsb25lID0gY2xvbmU7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkR2x5cGhNZW1iZXIgPSBmdW5jdGlvbiAoZ2x5cGhNZW1iZXIpIHtcblx0dGhpcy5nbHlwaE1lbWJlcnMucHVzaChnbHlwaE1lbWJlcik7XG59O1xuXG5ucy5HbHlwaC5wcm90b3R5cGUuYWRkUG9ydCA9IGZ1bmN0aW9uIChwb3J0KSB7XG5cdHRoaXMucG9ydHMucHVzaChwb3J0KTtcbn07XG5cbm5zLkdseXBoLnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGdseXBoID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZ2x5cGgnKTtcblx0Ly8gYXR0cmlidXRlc1xuXHRpZih0aGlzLmlkICE9IG51bGwpIHtcblx0XHRnbHlwaC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG5cdH1cblx0aWYodGhpcy5jbGFzc18gIT0gbnVsbCkge1xuXHRcdGdseXBoLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLmNsYXNzXyk7XG5cdH1cblx0aWYodGhpcy5jb21wYXJ0bWVudFJlZiAhPSBudWxsKSB7XG5cdFx0Z2x5cGguc2V0QXR0cmlidXRlKCdjb21wYXJ0bWVudFJlZicsIHRoaXMuY29tcGFydG1lbnRSZWYpO1xuXHR9XG5cdC8vIGNoaWxkcmVuXG5cdGlmKHRoaXMubGFiZWwgIT0gbnVsbCkge1xuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMubGFiZWwuYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0aWYodGhpcy5zdGF0ZSAhPSBudWxsKSB7XG5cdFx0Z2x5cGguYXBwZW5kQ2hpbGQodGhpcy5zdGF0ZS5idWlsZFhtbE9iaigpKTtcblx0fVxuXHRpZih0aGlzLmJib3ggIT0gbnVsbCkge1xuXHRcdGdseXBoLmFwcGVuZENoaWxkKHRoaXMuYmJveC5idWlsZFhtbE9iaigpKTtcblx0fVxuXHRpZih0aGlzLmNsb25lICE9IG51bGwpIHtcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmNsb25lLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaE1lbWJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLmdseXBoTWVtYmVyc1tpXS5idWlsZFhtbE9iaigpKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IHRoaXMucG9ydHMubGVuZ3RoOyBpKyspIHtcblx0XHRnbHlwaC5hcHBlbmRDaGlsZCh0aGlzLnBvcnRzW2ldLmJ1aWxkWG1sT2JqKCkpO1xuXHR9XG5cdHRoaXMuYmFzZVRvWG1sT2JqKGdseXBoKTtcblx0cmV0dXJuIGdseXBoO1xufTtcblxubnMuR2x5cGgucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcbn07XG5cbm5zLkdseXBoLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnZ2x5cGgnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBnbHlwaCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZ2x5cGggPSBuZXcgbnMuR2x5cGgoKTtcblx0Z2x5cGguaWQgXHRcdFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0Z2x5cGguY2xhc3NfIFx0XHRcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCBudWxsO1xuXHRnbHlwaC5jb21wYXJ0bWVudFJlZiBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY29tcGFydG1lbnRSZWYnKSB8fCBudWxsO1xuXG5cdHZhciBsYWJlbFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcblx0aWYgKGxhYmVsWE1MICE9IG51bGwpIHtcblx0XHR2YXIgbGFiZWwgPSBucy5MYWJlbC5mcm9tWE1MKGxhYmVsWE1MKTtcblx0XHRnbHlwaC5zZXRMYWJlbChsYWJlbCk7XG5cdH1cblx0dmFyIHN0YXRlWE1MID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdGF0ZScpWzBdO1xuXHRpZiAoc3RhdGVYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBzdGF0ZSA9IG5zLlN0YXRlVHlwZS5mcm9tWE1MKHN0YXRlWE1MKTtcblx0XHRnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG5cdH1cblx0dmFyIGJib3hYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jib3gnKVswXTtcblx0aWYgKGJib3hYTUwgIT0gbnVsbCkge1xuXHRcdHZhciBiYm94ID0gbnMuQmJveC5mcm9tWE1MKGJib3hYTUwpO1xuXHRcdGdseXBoLnNldEJib3goYmJveCk7XG5cdH1cblx0dmFyIGNsb25lWE1sID0geG1sT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjbG9uZScpWzBdO1xuXHRpZiAoY2xvbmVYTWwgIT0gbnVsbCkge1xuXHRcdHZhciBjbG9uZSA9IG5zLkNsb25lVHlwZS5mcm9tWE1MKGNsb25lWE1sKTtcblx0XHRnbHlwaC5zZXRDbG9uZShjbG9uZSk7XG5cdH1cblx0Ly8gbmVlZCBzcGVjaWFsIGNhcmUgYmVjYXVzZSBvZiByZWN1cnNpb24gb2YgbmVzdGVkIGdseXBoIG5vZGVzXG5cdC8vIHRha2Ugb25seSBmaXJzdCBsZXZlbCBnbHlwaHNcblx0dmFyIGNoaWxkcmVuID0geG1sT2JqLmNoaWxkTm9kZXM7XG5cdGZvciAodmFyIGo9MDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7IC8vIGxvb3AgdGhyb3VnaCBhbGwgZmlyc3QgbGV2ZWwgY2hpbGRyZW5cblx0XHR2YXIgY2hpbGQgPSBjaGlsZHJlbltqXTtcblx0XHRpZiAoY2hpbGQudGFnTmFtZSAmJiBjaGlsZC50YWdOYW1lID09IFwiZ2x5cGhcIikgeyAvLyBoZXJlIHdlIG9ubHkgd2FudCB0aGUgZ2x5aCBjaGlsZHJlblxuXHRcdFx0dmFyIGdseXBoTWVtYmVyID0gbnMuR2x5cGguZnJvbVhNTChjaGlsZCk7IC8vIHJlY3Vyc2l2ZSBjYWxsIG9uIG5lc3RlZCBnbHlwaFxuXHRcdFx0Z2x5cGguYWRkR2x5cGhNZW1iZXIoZ2x5cGhNZW1iZXIpO1xuXHRcdH1cblx0fVxuXHR2YXIgcG9ydHNYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BvcnQnKTtcblx0Zm9yICh2YXIgaT0wOyBpIDwgcG9ydHNYTUwubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgcG9ydCA9IG5zLlBvcnQuZnJvbVhNTChwb3J0c1hNTFtpXSk7XG5cdFx0Z2x5cGguYWRkUG9ydChwb3J0KTtcblx0fVxuXHRnbHlwaC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gZ2x5cGg7XG59O1xuLy8gLS0tLS0tLSBFTkQgR0xZUEggLS0tLS0tLVxuXG4vLyAtLS0tLS0tIExBQkVMIC0tLS0tLS1cbm5zLkxhYmVsID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndGV4dCddKTtcblx0dGhpcy50ZXh0ID0gcGFyYW1zLnRleHQ7XG5cblx0dGhpcy5hbGxvd2VkQ2hpbGRyZW4gPSBbXTtcblx0dGhpcy50YWdOYW1lID0gJ2xhYmVsJztcbn07XG5cbm5zLkxhYmVsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLkxhYmVsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5zLkxhYmVsO1xuXG5ucy5MYWJlbC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBsYWJlbCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cdGlmKHRoaXMudGV4dCAhPSBudWxsKSB7XG5cdFx0bGFiZWwuc2V0QXR0cmlidXRlKCd0ZXh0JywgdGhpcy50ZXh0KTtcblx0fVxuXHR0aGlzLmJhc2VUb1htbE9iaihsYWJlbCk7XG5cdHJldHVybiBsYWJlbDtcbn07XG5cbm5zLkxhYmVsLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5MYWJlbC5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2xhYmVsJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbGFiZWwsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGxhYmVsID0gbmV3IG5zLkxhYmVsKCk7XG5cdGxhYmVsLnRleHQgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0ZXh0JykgfHwgbnVsbDtcblx0bGFiZWwuYmFzZUZyb21YTUwoeG1sT2JqKTtcblx0cmV0dXJuIGxhYmVsO1xufTtcbi8vIC0tLS0tLS0gRU5EIExBQkVMIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBCQk9YIC0tLS0tLS1cbm5zLkJib3ggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdG5zLlNCR05CYXNlLmNhbGwodGhpcywgcGFyYW1zKTtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knLCAndycsICdoJ10pO1xuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG5cdHRoaXMudyA9IHBhcnNlRmxvYXQocGFyYW1zLncpO1xuXHR0aGlzLmggPSBwYXJzZUZsb2F0KHBhcmFtcy5oKTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xuXHR0aGlzLnRhZ05hbWUgPSAnYmJveCc7XG59O1xuXG5ucy5CYm94LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnMuU0JHTkJhc2UucHJvdG90eXBlKTtcbm5zLkJib3gucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQmJveDtcblxubnMuQmJveC5wcm90b3R5cGUuYnVpbGRYbWxPYmogPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBiYm94ID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnYmJveCcpO1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdGJib3guc2V0QXR0cmlidXRlKCd4JywgdGhpcy54KTtcblx0fVxuXHRpZighaXNOYU4odGhpcy55KSkge1xuXHRcdGJib3guc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcblx0fVxuXHRpZighaXNOYU4odGhpcy53KSkge1xuXHRcdGJib3guc2V0QXR0cmlidXRlKCd3JywgdGhpcy53KTtcblx0fVxuXHRpZighaXNOYU4odGhpcy5oKSkge1xuXHRcdGJib3guc2V0QXR0cmlidXRlKCdoJywgdGhpcy5oKTtcblx0fVxuXHR0aGlzLmJhc2VUb1htbE9iaihiYm94KTtcblx0cmV0dXJuIGJib3g7XG59XG5cbm5zLkJib3gucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcbn07XG5cbm5zLkJib3guZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdiYm94Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgYmJveCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgYmJveCA9IG5ldyBucy5CYm94KCk7XG5cdGJib3gueCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneCcpKTtcblx0YmJveC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRiYm94LncgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3cnKSk7XG5cdGJib3guaCA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgnaCcpKTtcblx0YmJveC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gYmJveDtcbn07XG4vLyAtLS0tLS0tIEVORCBCQk9YIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBTVEFURSAtLS0tLS0tXG5ucy5TdGF0ZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsndmFsdWUnLCAndmFyaWFibGUnXSk7XG5cdHRoaXMudmFsdWUgPSBwYXJhbXMudmFsdWU7XG5cdHRoaXMudmFyaWFibGUgPSBwYXJhbXMudmFyaWFibGU7XG59O1xuXG5ucy5TdGF0ZVR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc3RhdGUgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzdGF0ZScpO1xuXHRpZih0aGlzLnZhbHVlICE9IG51bGwpIHtcblx0XHRzdGF0ZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XG5cdH1cblx0aWYodGhpcy52YXJpYWJsZSAhPSBudWxsKSB7XG5cdFx0c3RhdGUuc2V0QXR0cmlidXRlKCd2YXJpYWJsZScsIHRoaXMudmFyaWFibGUpO1xuXHR9XG5cdHJldHVybiBzdGF0ZTtcbn07XG5cbm5zLlN0YXRlVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuU3RhdGVUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhdGUnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGF0ZSwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgc3RhdGUgPSBuZXcgbnMuU3RhdGVUeXBlKCk7XG5cdHN0YXRlLnZhbHVlID0geG1sT2JqLmdldEF0dHJpYnV0ZSgndmFsdWUnKSB8fCBudWxsO1xuXHRzdGF0ZS52YXJpYWJsZSA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3ZhcmlhYmxlJykgfHwgbnVsbDtcblx0cmV0dXJuIHN0YXRlO1xufTtcbi8vIC0tLS0tLS0gRU5EIFNUQVRFIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBDTE9ORSAtLS0tLS0tXG5ucy5DbG9uZVR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnbGFiZWwnXSk7XG5cdHRoaXMubGFiZWwgPSBwYXJhbXMubGFiZWw7XG59O1xuXG5ucy5DbG9uZVR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgY2xvbmUgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdjbG9uZScpO1xuXHRpZih0aGlzLmxhYmVsICE9IG51bGwpIHtcblx0XHRjbG9uZS5zZXRBdHRyaWJ1dGUoJ2xhYmVsJywgdGhpcy5sYWJlbCk7XG5cdH1cblx0cmV0dXJuIGNsb25lO1xufTtcblxubnMuQ2xvbmVUeXBlLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5DbG9uZVR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdjbG9uZScpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGNsb25lLCBnb3Q6IFwiICsgeG1sT2JqLnRhZ05hbWUpO1xuXHR9XG5cdHZhciBjbG9uZSA9IG5ldyBucy5DbG9uZVR5cGUoKTtcblx0Y2xvbmUubGFiZWwgPSB4bWxPYmouZ2V0QXR0cmlidXRlKCdsYWJlbCcpIHx8IG51bGw7XG5cdHJldHVybiBjbG9uZTtcbn07XG4vLyAtLS0tLS0tIEVORCBDTE9ORSAtLS0tLS0tXG5cbi8vIC0tLS0tLS0gUE9SVCAtLS0tLS0tXG5ucy5Qb3J0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAneCcsICd5J10pO1xuXHR0aGlzLmlkID0gcGFyYW1zLmlkO1xuXHR0aGlzLnggXHQ9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgXHQ9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xuXG5cdHRoaXMuYWxsb3dlZENoaWxkcmVuID0gW107XG5cdHRoaXMudGFnTmFtZSA9ICdwb3J0Jztcbn07XG5cbm5zLlBvcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShucy5TQkdOQmFzZS5wcm90b3R5cGUpO1xubnMuUG9ydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBucy5Qb3J0O1xuXG5ucy5Qb3J0LnByb3RvdHlwZS5idWlsZFhtbE9iaiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHBvcnQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdwb3J0Jyk7XG5cdGlmKHRoaXMuaWQgIT0gbnVsbCkge1xuXHRcdHBvcnQuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0cG9ydC5zZXRBdHRyaWJ1dGUoJ3gnLCB0aGlzLngpO1xuXHR9XG5cdGlmKCFpc05hTih0aGlzLnkpKSB7XG5cdFx0cG9ydC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xuXHR9XG5cdHRoaXMuYmFzZVRvWG1sT2JqKHBvcnQpO1xuXHRyZXR1cm4gcG9ydDtcbn07XG5cbm5zLlBvcnQucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IHhtbGRvbS5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcodGhpcy5idWlsZFhtbE9iaigpKTtcbn07XG5cbm5zLlBvcnQuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdwb3J0Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgcG9ydCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgcG9ydCA9IG5ldyBucy5Qb3J0KCk7XG5cdHBvcnQueCBcdD0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd4JykpO1xuXHRwb3J0LnkgXHQ9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcblx0cG9ydC5pZCA9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0cG9ydC5iYXNlRnJvbVhNTCh4bWxPYmopO1xuXHRyZXR1cm4gcG9ydDtcbn07XG4vLyAtLS0tLS0tIEVORCBQT1JUIC0tLS0tLS1cblxuLy8gLS0tLS0tLSBBUkMgLS0tLS0tLVxubnMuQXJjID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRucy5TQkdOQmFzZS5jYWxsKHRoaXMsIHBhcmFtcyk7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsnaWQnLCAnY2xhc3NfJywgJ3NvdXJjZScsICd0YXJnZXQnLCAnc3RhcnQnLCAnZW5kJywgJ25leHRzJywgJ2dseXBocyddKTtcblx0dGhpcy5pZCBcdD0gcGFyYW1zLmlkO1xuXHR0aGlzLmNsYXNzXyA9IHBhcmFtcy5jbGFzc187XG5cdHRoaXMuc291cmNlID0gcGFyYW1zLnNvdXJjZTtcblx0dGhpcy50YXJnZXQgPSBwYXJhbXMudGFyZ2V0O1xuXG5cdHRoaXMuc3RhcnQgXHQ9IHBhcmFtcy5zdGFydDtcblx0dGhpcy5lbmQgXHQ9IHBhcmFtcy5lbmQ7XG5cdHRoaXMubmV4dHMgXHQ9IHBhcmFtcy5uZXh0cyB8fCBbXTtcblx0dGhpcy5nbHlwaHMgPSBwYXJhbXMuZ2x5cGhzIHx8wqBbXTtcblxuXHR0aGlzLmFsbG93ZWRDaGlsZHJlbiA9IFsnc3RhcnQnLCAnbmV4dHMnLCAnZW5kJywgJ2dseXBocyddO1xuXHR0aGlzLnRhZ05hbWUgPSAnYXJjJztcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG5zLlNCR05CYXNlLnByb3RvdHlwZSk7XG5ucy5BcmMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnMuQXJjO1xuXG5ucy5BcmMucHJvdG90eXBlLnNldFN0YXJ0ID0gZnVuY3Rpb24gKHN0YXJ0KSB7XG5cdHRoaXMuc3RhcnQgPSBzdGFydDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuc2V0RW5kID0gZnVuY3Rpb24gKGVuZCkge1xuXHR0aGlzLmVuZCA9IGVuZDtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuYWRkTmV4dCA9IGZ1bmN0aW9uIChuZXh0KSB7XG5cdHRoaXMubmV4dHMucHVzaChuZXh0KTtcbn07XG5cbm5zLkFyYy5wcm90b3R5cGUuYWRkR2x5cGggPSBmdW5jdGlvbiAoZ2x5cGgpIHtcblx0dGhpcy5nbHlwaHMucHVzaChnbHlwaCk7XG59O1xuXG5ucy5BcmMucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXJjID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnYXJjJyk7XG5cdC8vIGF0dHJpYnV0ZXNcblx0aWYodGhpcy5pZCAhPSBudWxsKSB7XG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcblx0fVxuXHRpZih0aGlzLmNsYXNzXyAhPSBudWxsKSB7XG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLmNsYXNzXyk7XG5cdH1cblx0aWYodGhpcy5zb3VyY2UgIT0gbnVsbCkge1xuXHRcdGFyYy5zZXRBdHRyaWJ1dGUoJ3NvdXJjZScsIHRoaXMuc291cmNlKTtcblx0fVxuXHRpZih0aGlzLnRhcmdldCAhPSBudWxsKSB7XG5cdFx0YXJjLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgdGhpcy50YXJnZXQpO1xuXHR9XG5cdC8vIGNoaWxkcmVuXG5cdGZvcih2YXIgaT0wOyBpIDwgdGhpcy5nbHlwaHMubGVuZ3RoOyBpKyspIHtcblx0XHRhcmMuYXBwZW5kQ2hpbGQodGhpcy5nbHlwaHNbaV0uYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0aWYodGhpcy5zdGFydCAhPSBudWxsKSB7XG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMuc3RhcnQuYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0Zm9yKHZhciBpPTA7IGkgPCB0aGlzLm5leHRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXJjLmFwcGVuZENoaWxkKHRoaXMubmV4dHNbaV0uYnVpbGRYbWxPYmooKSk7XG5cdH1cblx0aWYodGhpcy5lbmQgIT0gbnVsbCkge1xuXHRcdGFyYy5hcHBlbmRDaGlsZCh0aGlzLmVuZC5idWlsZFhtbE9iaigpKTtcblx0fVxuXHR0aGlzLmJhc2VUb1htbE9iaihhcmMpO1xuXHRyZXR1cm4gYXJjO1xufTtcblxubnMuQXJjLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIG5ldyB4bWxkb20uWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMuYnVpbGRYbWxPYmooKSk7XG59O1xuXG5ucy5BcmMuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICdhcmMnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBhcmMsIGdvdDogXCIgKyB4bWxPYmoudGFnTmFtZSk7XG5cdH1cblx0dmFyIGFyYyA9IG5ldyBucy5BcmMoKTtcblx0YXJjLmlkIFx0XHQ9IHhtbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgbnVsbDtcblx0YXJjLmNsYXNzXyBcdD0geG1sT2JqLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCBudWxsO1xuXHRhcmMuc291cmNlIFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCdzb3VyY2UnKSB8fCBudWxsO1xuXHRhcmMudGFyZ2V0IFx0PSB4bWxPYmouZ2V0QXR0cmlidXRlKCd0YXJnZXQnKSB8fCBudWxsO1xuXG5cdHZhciBzdGFydFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3RhcnQnKVswXTtcblx0aWYgKHN0YXJ0WE1MICE9IG51bGwpIHtcblx0XHR2YXIgc3RhcnQgPSBucy5TdGFydFR5cGUuZnJvbVhNTChzdGFydFhNTCk7XG5cdFx0YXJjLnNldFN0YXJ0KHN0YXJ0KTtcblx0fVxuXHR2YXIgbmV4dFhNTCA9IHhtbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpO1xuXHRmb3IgKHZhciBpPTA7IGkgPCBuZXh0WE1MLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIG5leHQgPSBucy5OZXh0VHlwZS5mcm9tWE1MKG5leHRYTUxbaV0pO1xuXHRcdGFyYy5hZGROZXh0KG5leHQpO1xuXHR9XG5cdHZhciBlbmRYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2VuZCcpWzBdO1xuXHRpZiAoZW5kWE1MICE9IG51bGwpIHtcblx0XHR2YXIgZW5kID0gbnMuRW5kVHlwZS5mcm9tWE1MKGVuZFhNTCk7XG5cdFx0YXJjLnNldEVuZChlbmQpO1xuXHR9XG5cdHZhciBnbHlwaHNYTUwgPSB4bWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2dseXBoJyk7XG5cdGZvciAodmFyIGk9MDsgaSA8IGdseXBoc1hNTC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBnbHlwaCA9IG5zLkdseXBoLmZyb21YTUwoZ2x5cGhzWE1MW2ldKTtcblx0XHRhcmMuYWRkR2x5cGgoZ2x5cGgpO1xuXHR9XG5cblx0YXJjLmJhc2VGcm9tWE1MKHhtbE9iaik7XG5cdHJldHVybiBhcmM7XG59O1xuXG4vLyAtLS0tLS0tIEVORCBBUkMgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIFNUQVJUVFlQRSAtLS0tLS0tXG5ucy5TdGFydFR5cGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHZhciBwYXJhbXMgPSBjaGVja1BhcmFtcyhwYXJhbXMsIFsneCcsICd5J10pO1xuXHR0aGlzLnggPSBwYXJzZUZsb2F0KHBhcmFtcy54KTtcblx0dGhpcy55ID0gcGFyc2VGbG9hdChwYXJhbXMueSk7XG59O1xuXG5ucy5TdGFydFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc3RhcnQgPSBuZXcgeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzdGFydCcpO1xuXHRpZighaXNOYU4odGhpcy54KSkge1xuXHRcdHN0YXJ0LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHRzdGFydC5zZXRBdHRyaWJ1dGUoJ3knLCB0aGlzLnkpO1xuXHR9XG5cdHJldHVybiBzdGFydDtcbn07XG5cbm5zLlN0YXJ0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuU3RhcnRUeXBlLmZyb21YTUwgPSBmdW5jdGlvbiAoeG1sT2JqKSB7XG5cdGlmICh4bWxPYmoudGFnTmFtZSAhPSAnc3RhcnQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmFkIFhNTCBwcm92aWRlZCwgZXhwZWN0ZWQgdGFnTmFtZSBzdGFydCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgc3RhcnQgPSBuZXcgbnMuU3RhcnRUeXBlKCk7XG5cdHN0YXJ0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdHN0YXJ0LnkgPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3knKSk7XG5cdHJldHVybiBzdGFydDtcbn07XG4vLyAtLS0tLS0tIEVORCBTVEFSVFRZUEUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIEVORFRZUEUgLS0tLS0tLVxubnMuRW5kVHlwZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0dmFyIHBhcmFtcyA9IGNoZWNrUGFyYW1zKHBhcmFtcywgWyd4JywgJ3knXSk7XG5cdHRoaXMueCA9IHBhcnNlRmxvYXQocGFyYW1zLngpO1xuXHR0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcmFtcy55KTtcbn07XG5cbm5zLkVuZFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgZW5kID0gbmV3IHhtbGRvbS5ET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZW5kJyk7XG5cdGlmKCFpc05hTih0aGlzLngpKSB7XG5cdFx0ZW5kLnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHRlbmQuc2V0QXR0cmlidXRlKCd5JywgdGhpcy55KTtcblx0fVxuXHRyZXR1cm4gZW5kO1xufTtcblxubnMuRW5kVHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuRW5kVHlwZS5mcm9tWE1MID0gZnVuY3Rpb24gKHhtbE9iaikge1xuXHRpZiAoeG1sT2JqLnRhZ05hbWUgIT0gJ2VuZCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgWE1MIHByb3ZpZGVkLCBleHBlY3RlZCB0YWdOYW1lIGVuZCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgZW5kID0gbmV3IG5zLkVuZFR5cGUoKTtcblx0ZW5kLnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdGVuZC55ID0gcGFyc2VGbG9hdCh4bWxPYmouZ2V0QXR0cmlidXRlKCd5JykpO1xuXHRyZXR1cm4gZW5kO1xufTtcbi8vIC0tLS0tLS0gRU5EIEVORFRZUEUgLS0tLS0tLVxuXG4vLyAtLS0tLS0tIE5FWFRUWVBFIC0tLS0tLS1cbm5zLk5leHRUeXBlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHR2YXIgcGFyYW1zID0gY2hlY2tQYXJhbXMocGFyYW1zLCBbJ3gnLCAneSddKTtcblx0dGhpcy54ID0gcGFyc2VGbG9hdChwYXJhbXMueCk7XG5cdHRoaXMueSA9IHBhcnNlRmxvYXQocGFyYW1zLnkpO1xufTtcblxubnMuTmV4dFR5cGUucHJvdG90eXBlLmJ1aWxkWG1sT2JqID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbmV4dCA9IG5ldyB4bWxkb20uRE9NSW1wbGVtZW50YXRpb24oKS5jcmVhdGVEb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ25leHQnKTtcblx0aWYoIWlzTmFOKHRoaXMueCkpIHtcblx0XHRuZXh0LnNldEF0dHJpYnV0ZSgneCcsIHRoaXMueCk7XG5cdH1cblx0aWYoIWlzTmFOKHRoaXMueSkpIHtcblx0XHRuZXh0LnNldEF0dHJpYnV0ZSgneScsIHRoaXMueSk7XG5cdH1cblx0cmV0dXJuIG5leHQ7XG59O1xuXG5ucy5OZXh0VHlwZS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgeG1sZG9tLlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyh0aGlzLmJ1aWxkWG1sT2JqKCkpO1xufTtcblxubnMuTmV4dFR5cGUuZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0aWYgKHhtbE9iai50YWdOYW1lICE9ICduZXh0Jykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhZCBYTUwgcHJvdmlkZWQsIGV4cGVjdGVkIHRhZ05hbWUgbmV4dCwgZ290OiBcIiArIHhtbE9iai50YWdOYW1lKTtcblx0fVxuXHR2YXIgbmV4dCA9IG5ldyBucy5OZXh0VHlwZSgpO1xuXHRuZXh0LnggPSBwYXJzZUZsb2F0KHhtbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSk7XG5cdG5leHQueSA9IHBhcnNlRmxvYXQoeG1sT2JqLmdldEF0dHJpYnV0ZSgneScpKTtcblx0cmV0dXJuIG5leHQ7XG59O1xuLy8gLS0tLS0tLSBFTkQgTkVYVFRZUEUgLS0tLS0tLVxuXG5ucy5yZW5kZXJFeHRlbnNpb24gPSByZW5kZXJFeHQ7XG4vL25zLmFubm90YXRpb25zRXh0ZW5zaW9uID0gYW5ub3RFeHQ7XG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsInZhciBucyA9IHt9O1xuXG4vKlxuXHRndWFyYW50ZWVzIHRvIHJldHVybiBhbiBvYmplY3Qgd2l0aCBnaXZlbiBhcmdzIGJlaW5nIHNldCB0byBudWxsIGlmIG5vdCBwcmVzZW50LCBvdGhlciBhcmdzIHJldHVybmVkIGFzIGlzXG4qL1xubnMuY2hlY2tQYXJhbXMgPSBmdW5jdGlvbiAocGFyYW1zLCBuYW1lcykge1xuXHRpZiAodHlwZW9mIHBhcmFtcyA9PSBcInVuZGVmaW5lZFwiIHx8IHBhcmFtcyA9PSBudWxsKSB7XG5cdFx0cGFyYW1zID0ge307XG5cdH1cblx0aWYgKHR5cGVvZiBwYXJhbXMgIT0gJ29iamVjdCcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW1zLiBPYmplY3Qgd2l0aCBuYW1lZCBwYXJhbWV0ZXJzIG11c3QgYmUgcGFzc2VkLlwiKTtcblx0fVxuXHRmb3IodmFyIGk9MDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGFyZ05hbWUgPSBuYW1lc1tpXTtcblx0XHRpZiAodHlwZW9mIHBhcmFtc1thcmdOYW1lXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cGFyYW1zW2FyZ05hbWVdID0gbnVsbDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHBhcmFtcztcbn1cblxubnMuZ2V0Rmlyc3RMZXZlbEdseXBocyA9IGZ1bmN0aW9uICh4bWxPYmopIHtcblx0dmFyIHJlc3VsdCA9IFtdO1xuXHRmb3IodmFyIGk9MDsgaTx4bWxPYmouY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjaGlsZCA9IHhtbE9iai5jaGlsZE5vZGVzW2ldO1xuXHRcdGlmIChjaGlsZC50YWdOYW1lICYmIGNoaWxkLnRhZ05hbWUgPT0gXCJnbHlwaFwiKSB7XG5cdFx0XHRyZXN1bHQucHVzaChjaGlsZCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5zOyIsIi8qKlxuKiBwcmV0dHktZGF0YSAtIG5vZGVqcyBwbHVnaW4gdG8gcHJldHR5LXByaW50IG9yIG1pbmlmeSBkYXRhIGluIFhNTCwgSlNPTiBhbmQgQ1NTIGZvcm1hdHMuXG4qICBcbiogVmVyc2lvbiAtIDAuNDAuMFxuKiBDb3B5cmlnaHQgKGMpIDIwMTIgVmFkaW0gS2lyeXVraGluXG4qIHZraXJ5dWtoaW4gQCBnbWFpbC5jb21cbiogaHR0cDovL3d3dy5lc2xpbnN0cnVjdG9yLm5ldC9wcmV0dHktZGF0YS9cbiogXG4qIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzOlxuKiAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qICAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC5odG1sXG4qXG4qXHRwZC54bWwoZGF0YSApIC0gcHJldHR5IHByaW50IFhNTDtcbipcdHBkLmpzb24oZGF0YSkgLSBwcmV0dHkgcHJpbnQgSlNPTjtcbipcdHBkLmNzcyhkYXRhICkgLSBwcmV0dHkgcHJpbnQgQ1NTO1xuKlx0cGQuc3FsKGRhdGEpICAtIHByZXR0eSBwcmludCBTUUw7XG4qXG4qXHRwZC54bWxtaW4oZGF0YSBbLCBwcmVzZXJ2ZUNvbW1lbnRzXSApIC0gbWluaWZ5IFhNTDsgXG4qXHRwZC5qc29ubWluKGRhdGEpICAgICAgICAgICAgICAgICAgICAgIC0gbWluaWZ5IEpTT047IFxuKlx0cGQuY3NzbWluKGRhdGEgWywgcHJlc2VydmVDb21tZW50c10gKSAtIG1pbmlmeSBDU1M7IFxuKlx0cGQuc3FsbWluKGRhdGEpICAgICAgICAgICAgICAgICAgICAgICAtIG1pbmlmeSBTUUw7IFxuKlxuKiBQQVJBTUVURVJTOlxuKlxuKlx0QGRhdGEgIFx0XHRcdC0gU3RyaW5nOyBYTUwsIEpTT04sIENTUyBvciBTUUwgdGV4dCB0byBiZWF1dGlmeTtcbiogXHRAcHJlc2VydmVDb21tZW50c1x0LSBCb29sIChvcHRpb25hbCwgdXNlZCBpbiBtaW54bWwgYW5kIG1pbmNzcyBvbmx5KTsgXG4qXHRcdFx0XHQgIFNldCB0aGlzIGZsYWcgdG8gdHJ1ZSB0byBwcmV2ZW50IHJlbW92aW5nIGNvbW1lbnRzIGZyb20gQHRleHQ7IFxuKlx0QFJldHVybiBcdFx0LSBTdHJpbmc7XG4qXHRcbiogVVNBR0U6XG4qXHRcbipcdHZhciBwZCAgPSByZXF1aXJlKCdwcmV0dHktZGF0YScpLnBkO1xuKlxuKlx0dmFyIHhtbF9wcCAgID0gcGQueG1sKHhtbF90ZXh0KTtcbipcdHZhciB4bWxfbWluICA9IHBkLnhtbG1pbih4bWxfdGV4dCBbLHRydWVdKTtcbipcdHZhciBqc29uX3BwICA9IHBkLmpzb24oanNvbl90ZXh0KTtcbipcdHZhciBqc29uX21pbiA9IHBkLmpzb25taW4oanNvbl90ZXh0KTtcbipcdHZhciBjc3NfcHAgICA9IHBkLmNzcyhjc3NfdGV4dCk7XG4qXHR2YXIgY3NzX21pbiAgPSBwZC5jc3NtaW4oY3NzX3RleHQgWywgdHJ1ZV0pO1xuKlx0dmFyIHNxbF9wcCAgID0gcGQuc3FsKHNxbF90ZXh0KTtcbipcdHZhciBzcWxfbWluICA9IHBkLnNxbG1pbihzcWxfdGV4dCk7XG4qXG4qIFRFU1Q6XG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3RfeG1sXG4qXHRjb21wLW5hbWU6cHJldHR5LWRhdGEkIG5vZGUgLi90ZXN0L3Rlc3RfanNvblxuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X2Nzc1xuKlx0Y29tcC1uYW1lOnByZXR0eS1kYXRhJCBub2RlIC4vdGVzdC90ZXN0X3NxbFxuKi9cblxuXG5mdW5jdGlvbiBwcCgpIHtcblx0dGhpcy5zaGlmdCA9IFsnXFxuJ107IC8vIGFycmF5IG9mIHNoaWZ0c1xuXHR0aGlzLnN0ZXAgPSAnICAnLCAvLyAyIHNwYWNlc1xuXHRcdG1heGRlZXAgPSAxMDAsIC8vIG5lc3RpbmcgbGV2ZWxcblx0XHRpeCA9IDA7XG5cblx0Ly8gaW5pdGlhbGl6ZSBhcnJheSB3aXRoIHNoaWZ0cyAvL1xuXHRmb3IoaXg9MDtpeDxtYXhkZWVwO2l4Kyspe1xuXHRcdHRoaXMuc2hpZnQucHVzaCh0aGlzLnNoaWZ0W2l4XSt0aGlzLnN0ZXApOyBcblx0fVxuXG59O1x0XG5cdFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gWE1MIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUueG1sID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdHZhciBhciA9IHRleHQucmVwbGFjZSgvPlxcc3swLH08L2csXCI+PFwiKVxuXHRcdFx0XHQgLnJlcGxhY2UoLzwvZyxcIn46On48XCIpXG5cdFx0XHRcdCAucmVwbGFjZSgveG1sbnNcXDovZyxcIn46On54bWxuczpcIilcblx0XHRcdFx0IC5yZXBsYWNlKC94bWxuc1xcPS9nLFwifjo6fnhtbG5zPVwiKVxuXHRcdFx0XHQgLnNwbGl0KCd+Ojp+JyksXG5cdFx0bGVuID0gYXIubGVuZ3RoLFxuXHRcdGluQ29tbWVudCA9IGZhbHNlLFxuXHRcdGRlZXAgPSAwLFxuXHRcdHN0ciA9ICcnLFxuXHRcdGl4ID0gMDtcblxuXHRcdGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cdFx0XHQvLyBzdGFydCBjb21tZW50IG9yIDwhW0NEQVRBWy4uLl1dPiBvciA8IURPQ1RZUEUgLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzwhLykgPiAtMSkgeyBcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0XHRpbkNvbW1lbnQgPSB0cnVlOyBcblx0XHRcdFx0Ly8gZW5kIGNvbW1lbnQgIG9yIDwhW0NEQVRBWy4uLl1dPiAvL1xuXHRcdFx0XHRpZihhcltpeF0uc2VhcmNoKC8tLT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goL1xcXT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goLyFET0NUWVBFLykgPiAtMSApIHsgXG5cdFx0XHRcdFx0aW5Db21tZW50ID0gZmFsc2U7IFxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyBlbmQgY29tbWVudCAgb3IgPCFbQ0RBVEFbLi4uXV0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC8tLT4vKSA+IC0xIHx8IGFyW2l4XS5zZWFyY2goL1xcXT4vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gYXJbaXhdO1xuXHRcdFx0XHRpbkNvbW1lbnQgPSBmYWxzZTsgXG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyA8ZWxtPjwvZWxtPiAvL1xuXHRcdFx0aWYoIC9ePFxcdy8uZXhlYyhhcltpeC0xXSkgJiYgL148XFwvXFx3Ly5leGVjKGFyW2l4XSkgJiZcblx0XHRcdFx0L148W1xcdzpcXC1cXC5cXCxdKy8uZXhlYyhhcltpeC0xXSkgPT0gL148XFwvW1xcdzpcXC1cXC5cXCxdKy8uZXhlYyhhcltpeF0pWzBdLnJlcGxhY2UoJy8nLCcnKSkgeyBcblx0XHRcdFx0c3RyICs9IGFyW2l4XTtcblx0XHRcdFx0aWYoIWluQ29tbWVudCkgZGVlcC0tO1xuXHRcdFx0fSBlbHNlXG5cdFx0XHQgLy8gPGVsbT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXHcvKSA+IC0xICYmIGFyW2l4XS5zZWFyY2goLzxcXC8vKSA9PSAtMSAmJiBhcltpeF0uc2VhcmNoKC9cXC8+LykgPT0gLTEgKSB7XG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwKytdK2FyW2l4XSA6IHN0ciArPSBhcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQgLy8gPGVsbT4uLi48L2VsbT4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXHcvKSA+IC0xICYmIGFyW2l4XS5zZWFyY2goLzxcXC8vKSA+IC0xKSB7XG5cdFx0XHRcdHN0ciA9ICFpbkNvbW1lbnQgPyBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF0gOiBzdHIgKz0gYXJbaXhdO1xuXHRcdFx0fSBlbHNlIFxuXHRcdFx0Ly8gPC9lbG0+IC8vXG5cdFx0XHRpZihhcltpeF0uc2VhcmNoKC88XFwvLykgPiAtMSkgeyBcblx0XHRcdFx0c3RyID0gIWluQ29tbWVudCA/IHN0ciArPSB0aGlzLnNoaWZ0Wy0tZGVlcF0rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDxlbG0vPiAvL1xuXHRcdFx0aWYoYXJbaXhdLnNlYXJjaCgvXFwvPi8pID4gLTEgKSB7IFxuXHRcdFx0XHRzdHIgPSAhaW5Db21tZW50ID8gc3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdIDogc3RyICs9IGFyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdC8vIDw/IHhtbCAuLi4gPz4gLy9cblx0XHRcdGlmKGFyW2l4XS5zZWFyY2goLzxcXD8vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9IGVsc2UgXG5cdFx0XHQvLyB4bWxucyAvL1xuXHRcdFx0aWYoIGFyW2l4XS5zZWFyY2goL3htbG5zXFw6LykgPiAtMSAgfHwgYXJbaXhdLnNlYXJjaCgveG1sbnNcXD0vKSA+IC0xKSB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9IFxuXHRcdFx0XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c3RyICs9IGFyW2l4XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdHJldHVybiAgKHN0clswXSA9PSAnXFxuJykgPyBzdHIuc2xpY2UoMSkgOiBzdHI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEpTT04gc2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBwLnByb3RvdHlwZS5qc29uID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdGlmICggdHlwZW9mIHRleHQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodGV4dCksIG51bGwsIHRoaXMuc3RlcCk7XG5cdH1cblx0aWYgKCB0eXBlb2YgdGV4dCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGV4dCwgbnVsbCwgdGhpcy5zdGVwKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ1NTIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24odGV4dCkge1xuXG5cdHZhciBhciA9IHRleHQucmVwbGFjZSgvXFxzezEsfS9nLCcgJylcblx0XHRcdFx0LnJlcGxhY2UoL1xcey9nLFwie346On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL1xcfS9nLFwifjo6fn1+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXDsvZyxcIjt+Ojp+XCIpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXC9cXCovZyxcIn46On4vKlwiKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwqXFwvL2csXCIqL346On5cIilcblx0XHRcdFx0LnJlcGxhY2UoL346On5cXHN7MCx9fjo6fi9nLFwifjo6flwiKVxuXHRcdFx0XHQuc3BsaXQoJ346On4nKSxcblx0XHRsZW4gPSBhci5sZW5ndGgsXG5cdFx0ZGVlcCA9IDAsXG5cdFx0c3RyID0gJycsXG5cdFx0aXggPSAwO1xuXHRcdFxuXHRcdGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cblx0XHRcdGlmKCAvXFx7Ly5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwKytdK2FyW2l4XTtcblx0XHRcdH0gZWxzZSBcblx0XHRcdGlmKCAvXFx9Ly5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFstLWRlZXBdK2FyW2l4XTtcblx0XHRcdH0gZWxzZVxuXHRcdFx0aWYoIC9cXCpcXFxcLy5leGVjKGFyW2l4XSkpICB7IFxuXHRcdFx0XHRzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c3RyICs9IHRoaXMuc2hpZnRbZGVlcF0rYXJbaXhdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL15cXG57MSx9LywnJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNRTCBzZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaXNTdWJxdWVyeShzdHIsIHBhcmVudGhlc2lzTGV2ZWwpIHtcbiAgcmV0dXJuICBwYXJlbnRoZXNpc0xldmVsIC0gKHN0ci5yZXBsYWNlKC9cXCgvZywnJykubGVuZ3RoIC0gc3RyLnJlcGxhY2UoL1xcKS9nLCcnKS5sZW5ndGggKVxufVxuXG5mdW5jdGlvbiBzcGxpdF9zcWwoc3RyLCB0YWIpIHtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzezEsfS9nLFwiIFwiKVxuXG4gICAgICAgIC5yZXBsYWNlKC8gQU5EIC9pZyxcIn46On5cIit0YWIrdGFiK1wiQU5EIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEJFVFdFRU4gL2lnLFwifjo6flwiK3RhYitcIkJFVFdFRU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQ0FTRSAvaWcsXCJ+Ojp+XCIrdGFiK1wiQ0FTRSBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBFTFNFIC9pZyxcIn46On5cIit0YWIrXCJFTFNFIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEVORCAvaWcsXCJ+Ojp+XCIrdGFiK1wiRU5EIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEZST00gL2lnLFwifjo6fkZST00gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gR1JPVVBcXHN7MSx9QlkvaWcsXCJ+Ojp+R1JPVVAgQlkgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSEFWSU5HIC9pZyxcIn46On5IQVZJTkcgXCIpXG4gICAgICAgIC8vLnJlcGxhY2UoLyBJTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSU4gL2lnLFwiIElOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEpPSU4gL2lnLFwifjo6fkpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQ1JPU1N+Ojp+ezEsfUpPSU4gL2lnLFwifjo6fkNST1NTIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gSU5ORVJ+Ojp+ezEsfUpPSU4gL2lnLFwifjo6fklOTkVSIEpPSU4gXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTEVGVH46On57MSx9Sk9JTiAvaWcsXCJ+Ojp+TEVGVCBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIFJJR0hUfjo6fnsxLH1KT0lOIC9pZyxcIn46On5SSUdIVCBKT0lOIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9OIC9pZyxcIn46On5cIit0YWIrXCJPTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBPUiAvaWcsXCJ+Ojp+XCIrdGFiK3RhYitcIk9SIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9SREVSXFxzezEsfUJZL2lnLFwifjo6fk9SREVSIEJZIFwiKVxuICAgICAgICAucmVwbGFjZSgvIE9WRVIgL2lnLFwifjo6flwiK3RhYitcIk9WRVIgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXChcXHN7MCx9U0VMRUNUIC9pZyxcIn46On4oU0VMRUNUIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFwpXFxzezAsfVNFTEVDVCAvaWcsXCIpfjo6flNFTEVDVCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBUSEVOIC9pZyxcIiBUSEVOfjo6flwiK3RhYitcIlwiKVxuICAgICAgICAucmVwbGFjZSgvIFVOSU9OIC9pZyxcIn46On5VTklPTn46On5cIilcbiAgICAgICAgLnJlcGxhY2UoLyBVU0lORyAvaWcsXCJ+Ojp+VVNJTkcgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gV0hFTiAvaWcsXCJ+Ojp+XCIrdGFiK1wiV0hFTiBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBXSEVSRSAvaWcsXCJ+Ojp+V0hFUkUgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gV0lUSCAvaWcsXCJ+Ojp+V0lUSCBcIilcbiAgICAgICAgLy8ucmVwbGFjZSgvXFwsXFxzezAsfVxcKC9pZyxcIix+Ojp+KCBcIilcbiAgICAgICAgLy8ucmVwbGFjZSgvXFwsL2lnLFwiLH46On5cIit0YWIrdGFiK1wiXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQUxMIC9pZyxcIiBBTEwgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gQVMgL2lnLFwiIEFTIFwiKVxuICAgICAgICAucmVwbGFjZSgvIEFTQyAvaWcsXCIgQVNDIFwiKSBcbiAgICAgICAgLnJlcGxhY2UoLyBERVNDIC9pZyxcIiBERVNDIFwiKSBcbiAgICAgICAgLnJlcGxhY2UoLyBESVNUSU5DVCAvaWcsXCIgRElTVElOQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gRVhJU1RTIC9pZyxcIiBFWElTVFMgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTk9UIC9pZyxcIiBOT1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC8gTlVMTCAvaWcsXCIgTlVMTCBcIilcbiAgICAgICAgLnJlcGxhY2UoLyBMSUtFIC9pZyxcIiBMSUtFIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFxzezAsfVNFTEVDVCAvaWcsXCJTRUxFQ1QgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9+Ojp+ezEsfS9nLFwifjo6flwiKVxuICAgICAgICAuc3BsaXQoJ346On4nKTtcbn1cblxucHAucHJvdG90eXBlLnNxbCA9IGZ1bmN0aW9uKHRleHQpIHtcblxuICAgIHZhciBhcl9ieV9xdW90ZSA9IHRleHQucmVwbGFjZSgvXFxzezEsfS9nLFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcJy9pZyxcIn46On5cXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnfjo6ficpLFxuICAgICAgICBsZW4gPSBhcl9ieV9xdW90ZS5sZW5ndGgsXG4gICAgICAgIGFyID0gW10sXG4gICAgICAgIGRlZXAgPSAwLFxuICAgICAgICB0YWIgPSB0aGlzLnN0ZXAsLy8rdGhpcy5zdGVwLFxuICAgICAgICBpbkNvbW1lbnQgPSB0cnVlLFxuICAgICAgICBpblF1b3RlID0gZmFsc2UsXG4gICAgICAgIHBhcmVudGhlc2lzTGV2ZWwgPSAwLFxuICAgICAgICBzdHIgPSAnJyxcbiAgICAgICAgaXggPSAwO1xuXG4gICAgZm9yKGl4PTA7aXg8bGVuO2l4KyspIHtcblxuICAgICAgICBpZihpeCUyKSB7XG4gICAgICAgICAgICBhciA9IGFyLmNvbmNhdChhcl9ieV9xdW90ZVtpeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXIgPSBhci5jb25jYXQoc3BsaXRfc3FsKGFyX2J5X3F1b3RlW2l4XSwgdGFiKSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gYXIubGVuZ3RoO1xuICAgIGZvcihpeD0wO2l4PGxlbjtpeCsrKSB7XG5cbiAgICAgICAgcGFyZW50aGVzaXNMZXZlbCA9IGlzU3VicXVlcnkoYXJbaXhdLCBwYXJlbnRoZXNpc0xldmVsKTtcblxuICAgICAgICBpZiggL1xcc3swLH1cXHN7MCx9U0VMRUNUXFxzezAsfS8uZXhlYyhhcltpeF0pKSAgeyBcbiAgICAgICAgICAgIGFyW2l4XSA9IGFyW2l4XS5yZXBsYWNlKC9cXCwvZyxcIixcXG5cIit0YWIrdGFiK1wiXCIpXG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYoIC9cXHN7MCx9XFwoXFxzezAsfVNFTEVDVFxcc3swLH0vLmV4ZWMoYXJbaXhdKSkgIHsgXG4gICAgICAgICAgICBkZWVwKys7XG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG4gICAgICAgIH0gZWxzZSBcbiAgICAgICAgaWYoIC9cXCcvLmV4ZWMoYXJbaXhdKSApICB7IFxuICAgICAgICAgICAgaWYocGFyZW50aGVzaXNMZXZlbDwxICYmIGRlZXApIHtcbiAgICAgICAgICAgICAgICBkZWVwLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHIgKz0gYXJbaXhdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgIHsgXG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5zaGlmdFtkZWVwXSthcltpeF07XG4gICAgICAgICAgICBpZihwYXJlbnRoZXNpc0xldmVsPDEgJiYgZGVlcCkge1xuICAgICAgICAgICAgICAgIGRlZXAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcbnsxLH0vLCcnKS5yZXBsYWNlKC9cXG57MSx9L2csXCJcXG5cIik7XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWluIHNlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wcC5wcm90b3R5cGUueG1sbWluID0gZnVuY3Rpb24odGV4dCwgcHJlc2VydmVDb21tZW50cykge1xuXG5cdHZhciBzdHIgPSBwcmVzZXJ2ZUNvbW1lbnRzID8gdGV4dFxuXHRcdFx0XHQgICA6IHRleHQucmVwbGFjZSgvXFw8IVsgXFxyXFxuXFx0XSooLS0oW15cXC1dfFtcXHJcXG5dfC1bXlxcLV0pKi0tWyBcXHJcXG5cXHRdKilcXD4vZyxcIlwiKTtcblx0cmV0dXJuICBzdHIucmVwbGFjZSgvPlxcc3swLH08L2csXCI+PFwiKTsgXG59XG5cbnBwLnByb3RvdHlwZS5qc29ubWluID0gZnVuY3Rpb24odGV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdCAgXG4gICAgcmV0dXJuICB0ZXh0LnJlcGxhY2UoL1xcc3swLH1cXHtcXHN7MCx9L2csXCJ7XCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcc3swLH1cXFskL2csXCJbXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcW1xcc3swLH0vZyxcIltcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxcc3swLH1cXFsvZywnOlsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9XFx9XFxzezAsfS9nLFwifVwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7MCx9XFxdXFxzezAsfS9nLFwiXVwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFwiXFxzezAsfVxcLC9nLCdcIiwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCxcXHN7MCx9XFxcIi9nLCcsXCInKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFwiXFxzezAsfTovZywnXCI6JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxcc3swLH1cXFwiL2csJzpcIicpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzpcXHN7MCx9XFxbL2csJzpbJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwsXFxzezAsfVxcWy9nLCcsWycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLFxcc3syLH0vZywnLCAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXF1cXHN7MCx9LFxcc3swLH1cXFsvZywnXSxbJyk7ICAgXG59XG5cbnBwLnByb3RvdHlwZS5jc3NtaW4gPSBmdW5jdGlvbih0ZXh0LCBwcmVzZXJ2ZUNvbW1lbnRzKSB7XG5cdFxuXHR2YXIgc3RyID0gcHJlc2VydmVDb21tZW50cyA/IHRleHRcblx0XHRcdFx0ICAgOiB0ZXh0LnJlcGxhY2UoL1xcL1xcKihbXipdfFtcXHJcXG5dfChcXCorKFteKi9dfFtcXHJcXG5dKSkpKlxcKitcXC8vZyxcIlwiKSA7XG5cdHJldHVybiBzdHIucmVwbGFjZSgvXFxzezEsfS9nLCcgJylcblx0XHRcdCAgLnJlcGxhY2UoL1xce1xcc3sxLH0vZyxcIntcIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcfVxcc3sxLH0vZyxcIn1cIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcO1xcc3sxLH0vZyxcIjtcIilcblx0XHRcdCAgLnJlcGxhY2UoL1xcL1xcKlxcc3sxLH0vZyxcIi8qXCIpXG5cdFx0XHQgIC5yZXBsYWNlKC9cXCpcXC9cXHN7MSx9L2csXCIqL1wiKTtcbn1cdFxuXG5wcC5wcm90b3R5cGUuc3FsbWluID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcc3sxLH0vZyxcIiBcIikucmVwbGFjZSgvXFxzezEsfVxcKC8sXCIoXCIpLnJlcGxhY2UoL1xcc3sxLH1cXCkvLFwiKVwiKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5wZD0gbmV3IHBwO1x0XG5cblxuXG5cblxuXG5cblxuXG5cbiIsImZ1bmN0aW9uIERPTVBhcnNlcihvcHRpb25zKXtcclxuXHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8e2xvY2F0b3I6e319O1xyXG5cdFxyXG59XHJcbkRPTVBhcnNlci5wcm90b3R5cGUucGFyc2VGcm9tU3RyaW5nID0gZnVuY3Rpb24oc291cmNlLG1pbWVUeXBlKXtcclxuXHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHR2YXIgc2F4ID0gIG5ldyBYTUxSZWFkZXIoKTtcclxuXHR2YXIgZG9tQnVpbGRlciA9IG9wdGlvbnMuZG9tQnVpbGRlciB8fCBuZXcgRE9NSGFuZGxlcigpOy8vY29udGVudEhhbmRsZXIgYW5kIExleGljYWxIYW5kbGVyXHJcblx0dmFyIGVycm9ySGFuZGxlciA9IG9wdGlvbnMuZXJyb3JIYW5kbGVyO1xyXG5cdHZhciBsb2NhdG9yID0gb3B0aW9ucy5sb2NhdG9yO1xyXG5cdHZhciBkZWZhdWx0TlNNYXAgPSBvcHRpb25zLnhtbG5zfHx7fTtcclxuXHR2YXIgZW50aXR5TWFwID0geydsdCc6JzwnLCdndCc6Jz4nLCdhbXAnOicmJywncXVvdCc6J1wiJywnYXBvcyc6XCInXCJ9XHJcblx0aWYobG9jYXRvcil7XHJcblx0XHRkb21CdWlsZGVyLnNldERvY3VtZW50TG9jYXRvcihsb2NhdG9yKVxyXG5cdH1cclxuXHRcclxuXHRzYXguZXJyb3JIYW5kbGVyID0gYnVpbGRFcnJvckhhbmRsZXIoZXJyb3JIYW5kbGVyLGRvbUJ1aWxkZXIsbG9jYXRvcik7XHJcblx0c2F4LmRvbUJ1aWxkZXIgPSBvcHRpb25zLmRvbUJ1aWxkZXIgfHwgZG9tQnVpbGRlcjtcclxuXHRpZigvXFwveD9odG1sPyQvLnRlc3QobWltZVR5cGUpKXtcclxuXHRcdGVudGl0eU1hcC5uYnNwID0gJ1xceGEwJztcclxuXHRcdGVudGl0eU1hcC5jb3B5ID0gJ1xceGE5JztcclxuXHRcdGRlZmF1bHROU01hcFsnJ109ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcclxuXHR9XHJcblx0ZGVmYXVsdE5TTWFwLnhtbCA9IGRlZmF1bHROU01hcC54bWwgfHwgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcblx0aWYoc291cmNlKXtcclxuXHRcdHNheC5wYXJzZShzb3VyY2UsZGVmYXVsdE5TTWFwLGVudGl0eU1hcCk7XHJcblx0fWVsc2V7XHJcblx0XHRzYXguZXJyb3JIYW5kbGVyLmVycm9yKFwiaW52YWxpZCBkb2Mgc291cmNlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gZG9tQnVpbGRlci5kb2M7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGRFcnJvckhhbmRsZXIoZXJyb3JJbXBsLGRvbUJ1aWxkZXIsbG9jYXRvcil7XHJcblx0aWYoIWVycm9ySW1wbCl7XHJcblx0XHRpZihkb21CdWlsZGVyIGluc3RhbmNlb2YgRE9NSGFuZGxlcil7XHJcblx0XHRcdHJldHVybiBkb21CdWlsZGVyO1xyXG5cdFx0fVxyXG5cdFx0ZXJyb3JJbXBsID0gZG9tQnVpbGRlciA7XHJcblx0fVxyXG5cdHZhciBlcnJvckhhbmRsZXIgPSB7fVxyXG5cdHZhciBpc0NhbGxiYWNrID0gZXJyb3JJbXBsIGluc3RhbmNlb2YgRnVuY3Rpb247XHJcblx0bG9jYXRvciA9IGxvY2F0b3J8fHt9XHJcblx0ZnVuY3Rpb24gYnVpbGQoa2V5KXtcclxuXHRcdHZhciBmbiA9IGVycm9ySW1wbFtrZXldO1xyXG5cdFx0aWYoIWZuICYmIGlzQ2FsbGJhY2spe1xyXG5cdFx0XHRmbiA9IGVycm9ySW1wbC5sZW5ndGggPT0gMj9mdW5jdGlvbihtc2cpe2Vycm9ySW1wbChrZXksbXNnKX06ZXJyb3JJbXBsO1xyXG5cdFx0fVxyXG5cdFx0ZXJyb3JIYW5kbGVyW2tleV0gPSBmbiAmJiBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRmbignW3htbGRvbSAnK2tleSsnXVxcdCcrbXNnK19sb2NhdG9yKGxvY2F0b3IpKTtcclxuXHRcdH18fGZ1bmN0aW9uKCl7fTtcclxuXHR9XHJcblx0YnVpbGQoJ3dhcm5pbmcnKTtcclxuXHRidWlsZCgnZXJyb3InKTtcclxuXHRidWlsZCgnZmF0YWxFcnJvcicpO1xyXG5cdHJldHVybiBlcnJvckhhbmRsZXI7XHJcbn1cclxuXHJcbi8vY29uc29sZS5sb2coJyNcXG5cXG5cXG5cXG5cXG5cXG5cXG4jIyMjJylcclxuLyoqXHJcbiAqICtDb250ZW50SGFuZGxlcitFcnJvckhhbmRsZXJcclxuICogK0xleGljYWxIYW5kbGVyK0VudGl0eVJlc29sdmVyMlxyXG4gKiAtRGVjbEhhbmRsZXItRFRESGFuZGxlciBcclxuICogXHJcbiAqIERlZmF1bHRIYW5kbGVyOkVudGl0eVJlc29sdmVyLCBEVERIYW5kbGVyLCBDb250ZW50SGFuZGxlciwgRXJyb3JIYW5kbGVyXHJcbiAqIERlZmF1bHRIYW5kbGVyMjpEZWZhdWx0SGFuZGxlcixMZXhpY2FsSGFuZGxlciwgRGVjbEhhbmRsZXIsIEVudGl0eVJlc29sdmVyMlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9oZWxwZXJzL0RlZmF1bHRIYW5kbGVyLmh0bWxcclxuICovXHJcbmZ1bmN0aW9uIERPTUhhbmRsZXIoKSB7XHJcbiAgICB0aGlzLmNkYXRhID0gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gcG9zaXRpb24obG9jYXRvcixub2RlKXtcclxuXHRub2RlLmxpbmVOdW1iZXIgPSBsb2NhdG9yLmxpbmVOdW1iZXI7XHJcblx0bm9kZS5jb2x1bW5OdW1iZXIgPSBsb2NhdG9yLmNvbHVtbk51bWJlcjtcclxufVxyXG4vKipcclxuICogQHNlZSBvcmcueG1sLnNheC5Db250ZW50SGFuZGxlciNzdGFydERvY3VtZW50XHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L0NvbnRlbnRIYW5kbGVyLmh0bWxcclxuICovIFxyXG5ET01IYW5kbGVyLnByb3RvdHlwZSA9IHtcclxuXHRzdGFydERvY3VtZW50IDogZnVuY3Rpb24oKSB7XHJcbiAgICBcdHRoaXMuZG9jID0gbmV3IERPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICBcdGlmICh0aGlzLmxvY2F0b3IpIHtcclxuICAgICAgICBcdHRoaXMuZG9jLmRvY3VtZW50VVJJID0gdGhpcy5sb2NhdG9yLnN5c3RlbUlkO1xyXG4gICAgXHR9XHJcblx0fSxcclxuXHRzdGFydEVsZW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUsIHFOYW1lLCBhdHRycykge1xyXG5cdFx0dmFyIGRvYyA9IHRoaXMuZG9jO1xyXG5cdCAgICB2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcU5hbWV8fGxvY2FsTmFtZSk7XHJcblx0ICAgIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XHJcblx0ICAgIGFwcGVuZEVsZW1lbnQodGhpcywgZWwpO1xyXG5cdCAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gZWw7XHJcblx0ICAgIFxyXG5cdFx0dGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixlbClcclxuXHQgICAgZm9yICh2YXIgaSA9IDAgOyBpIDwgbGVuOyBpKyspIHtcclxuXHQgICAgICAgIHZhciBuYW1lc3BhY2VVUkkgPSBhdHRycy5nZXRVUkkoaSk7XHJcblx0ICAgICAgICB2YXIgdmFsdWUgPSBhdHRycy5nZXRWYWx1ZShpKTtcclxuXHQgICAgICAgIHZhciBxTmFtZSA9IGF0dHJzLmdldFFOYW1lKGkpO1xyXG5cdFx0XHR2YXIgYXR0ciA9IGRvYy5jcmVhdGVBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHFOYW1lKTtcclxuXHRcdFx0dGhpcy5sb2NhdG9yICYmcG9zaXRpb24oYXR0cnMuZ2V0TG9jYXRvcihpKSxhdHRyKTtcclxuXHRcdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGVsLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0ZW5kRWxlbWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSwgcU5hbWUpIHtcclxuXHRcdHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50RWxlbWVudFxyXG5cdFx0dmFyIHRhZ05hbWUgPSBjdXJyZW50LnRhZ05hbWU7XHJcblx0XHR0aGlzLmN1cnJlbnRFbGVtZW50ID0gY3VycmVudC5wYXJlbnROb2RlO1xyXG5cdH0sXHJcblx0c3RhcnRQcmVmaXhNYXBwaW5nOmZ1bmN0aW9uKHByZWZpeCwgdXJpKSB7XHJcblx0fSxcclxuXHRlbmRQcmVmaXhNYXBwaW5nOmZ1bmN0aW9uKHByZWZpeCkge1xyXG5cdH0sXHJcblx0cHJvY2Vzc2luZ0luc3RydWN0aW9uOmZ1bmN0aW9uKHRhcmdldCwgZGF0YSkge1xyXG5cdCAgICB2YXIgaW5zID0gdGhpcy5kb2MuY3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uKHRhcmdldCwgZGF0YSk7XHJcblx0ICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsaW5zKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGlucyk7XHJcblx0fSxcclxuXHRpZ25vcmFibGVXaGl0ZXNwYWNlOmZ1bmN0aW9uKGNoLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0fSxcclxuXHRjaGFyYWN0ZXJzOmZ1bmN0aW9uKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0XHRjaGFycyA9IF90b1N0cmluZy5hcHBseSh0aGlzLGFyZ3VtZW50cylcclxuXHRcdC8vY29uc29sZS5sb2coY2hhcnMpXHJcblx0XHRpZihjaGFycyl7XHJcblx0XHRcdGlmICh0aGlzLmNkYXRhKSB7XHJcblx0XHRcdFx0dmFyIGNoYXJOb2RlID0gdGhpcy5kb2MuY3JlYXRlQ0RBVEFTZWN0aW9uKGNoYXJzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgY2hhck5vZGUgPSB0aGlzLmRvYy5jcmVhdGVUZXh0Tm9kZShjaGFycyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodGhpcy5jdXJyZW50RWxlbWVudCl7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdH1lbHNlIGlmKC9eXFxzKiQvLnRlc3QoY2hhcnMpKXtcclxuXHRcdFx0XHR0aGlzLmRvYy5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdFx0Ly9wcm9jZXNzIHhtbFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsY2hhck5vZGUpXHJcblx0XHR9XHJcblx0fSxcclxuXHRza2lwcGVkRW50aXR5OmZ1bmN0aW9uKG5hbWUpIHtcclxuXHR9LFxyXG5cdGVuZERvY3VtZW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kb2Mubm9ybWFsaXplKCk7XHJcblx0fSxcclxuXHRzZXREb2N1bWVudExvY2F0b3I6ZnVuY3Rpb24gKGxvY2F0b3IpIHtcclxuXHQgICAgaWYodGhpcy5sb2NhdG9yID0gbG9jYXRvcil7Ly8gJiYgISgnbGluZU51bWJlcicgaW4gbG9jYXRvcikpe1xyXG5cdCAgICBcdGxvY2F0b3IubGluZU51bWJlciA9IDA7XHJcblx0ICAgIH1cclxuXHR9LFxyXG5cdC8vTGV4aWNhbEhhbmRsZXJcclxuXHRjb21tZW50OmZ1bmN0aW9uKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0XHRjaGFycyA9IF90b1N0cmluZy5hcHBseSh0aGlzLGFyZ3VtZW50cylcclxuXHQgICAgdmFyIGNvbW0gPSB0aGlzLmRvYy5jcmVhdGVDb21tZW50KGNoYXJzKTtcclxuXHQgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixjb21tKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGNvbW0pO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRDREFUQTpmdW5jdGlvbigpIHtcclxuXHQgICAgLy91c2VkIGluIGNoYXJhY3RlcnMoKSBtZXRob2RzXHJcblx0ICAgIHRoaXMuY2RhdGEgPSB0cnVlO1xyXG5cdH0sXHJcblx0ZW5kQ0RBVEE6ZnVuY3Rpb24oKSB7XHJcblx0ICAgIHRoaXMuY2RhdGEgPSBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0RFREOmZ1bmN0aW9uKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge1xyXG5cdFx0dmFyIGltcGwgPSB0aGlzLmRvYy5pbXBsZW1lbnRhdGlvbjtcclxuXHQgICAgaWYgKGltcGwgJiYgaW1wbC5jcmVhdGVEb2N1bWVudFR5cGUpIHtcclxuXHQgICAgICAgIHZhciBkdCA9IGltcGwuY3JlYXRlRG9jdW1lbnRUeXBlKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCk7XHJcblx0ICAgICAgICB0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGR0KVxyXG5cdCAgICAgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBkdCk7XHJcblx0ICAgIH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCAqIEBzZWUgb3JnLnhtbC5zYXguRXJyb3JIYW5kbGVyXHJcblx0ICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvRXJyb3JIYW5kbGVyLmh0bWxcclxuXHQgKi9cclxuXHR3YXJuaW5nOmZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1t4bWxkb20gd2FybmluZ11cXHQnK2Vycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdH0sXHJcblx0ZXJyb3I6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ1t4bWxkb20gZXJyb3JdXFx0JytlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHR9LFxyXG5cdGZhdGFsRXJyb3I6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ1t4bWxkb20gZmF0YWxFcnJvcl1cXHQnK2Vycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdCAgICB0aHJvdyBlcnJvcjtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gX2xvY2F0b3IobCl7XHJcblx0aWYobCl7XHJcblx0XHRyZXR1cm4gJ1xcbkAnKyhsLnN5c3RlbUlkIHx8JycpKycjW2xpbmU6JytsLmxpbmVOdW1iZXIrJyxjb2w6JytsLmNvbHVtbk51bWJlcisnXSdcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gX3RvU3RyaW5nKGNoYXJzLHN0YXJ0LGxlbmd0aCl7XHJcblx0aWYodHlwZW9mIGNoYXJzID09ICdzdHJpbmcnKXtcclxuXHRcdHJldHVybiBjaGFycy5zdWJzdHIoc3RhcnQsbGVuZ3RoKVxyXG5cdH1lbHNley8vamF2YSBzYXggY29ubmVjdCB3aWR0aCB4bWxkb20gb24gcmhpbm8od2hhdCBhYm91dDogXCI/ICYmICEoY2hhcnMgaW5zdGFuY2VvZiBTdHJpbmcpXCIpXHJcblx0XHRpZihjaGFycy5sZW5ndGggPj0gc3RhcnQrbGVuZ3RoIHx8IHN0YXJ0KXtcclxuXHRcdFx0cmV0dXJuIG5ldyBqYXZhLmxhbmcuU3RyaW5nKGNoYXJzLHN0YXJ0LGxlbmd0aCkrJyc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhcnM7XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvTGV4aWNhbEhhbmRsZXIuaHRtbFxyXG4gKiB1c2VkIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuTGV4aWNhbEhhbmRsZXI6XHJcbiAqICAjY29tbWVudChjaGFycywgc3RhcnQsIGxlbmd0aClcclxuICogICNzdGFydENEQVRBKClcclxuICogICNlbmRDREFUQSgpXHJcbiAqICAjc3RhcnREVEQobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKlxyXG4gKlxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuTGV4aWNhbEhhbmRsZXI6XHJcbiAqICAjZW5kRFREKClcclxuICogICNzdGFydEVudGl0eShuYW1lKVxyXG4gKiAgI2VuZEVudGl0eShuYW1lKVxyXG4gKlxyXG4gKlxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvRGVjbEhhbmRsZXIuaHRtbFxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5leHQuRGVjbEhhbmRsZXJcclxuICogXHQjYXR0cmlidXRlRGVjbChlTmFtZSwgYU5hbWUsIHR5cGUsIG1vZGUsIHZhbHVlKVxyXG4gKiAgI2VsZW1lbnREZWNsKG5hbWUsIG1vZGVsKVxyXG4gKiAgI2V4dGVybmFsRW50aXR5RGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpXHJcbiAqICAjaW50ZXJuYWxFbnRpdHlEZWNsKG5hbWUsIHZhbHVlKVxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9leHQvRW50aXR5UmVzb2x2ZXIyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguRW50aXR5UmVzb2x2ZXIyXHJcbiAqICAjcmVzb2x2ZUVudGl0eShTdHJpbmcgbmFtZSxTdHJpbmcgcHVibGljSWQsU3RyaW5nIGJhc2VVUkksU3RyaW5nIHN5c3RlbUlkKVxyXG4gKiAgI3Jlc29sdmVFbnRpdHkocHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKiAgI2dldEV4dGVybmFsU3Vic2V0KG5hbWUsIGJhc2VVUkkpXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L0RUREhhbmRsZXIuaHRtbFxyXG4gKiBJR05PUkVEIG1ldGhvZCBvZiBvcmcueG1sLnNheC5EVERIYW5kbGVyXHJcbiAqICAjbm90YXRpb25EZWNsKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge307XHJcbiAqICAjdW5wYXJzZWRFbnRpdHlEZWNsKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCwgbm90YXRpb25OYW1lKSB7fTtcclxuICovXHJcblwiZW5kRFRELHN0YXJ0RW50aXR5LGVuZEVudGl0eSxhdHRyaWJ1dGVEZWNsLGVsZW1lbnREZWNsLGV4dGVybmFsRW50aXR5RGVjbCxpbnRlcm5hbEVudGl0eURlY2wscmVzb2x2ZUVudGl0eSxnZXRFeHRlcm5hbFN1YnNldCxub3RhdGlvbkRlY2wsdW5wYXJzZWRFbnRpdHlEZWNsXCIucmVwbGFjZSgvXFx3Ky9nLGZ1bmN0aW9uKGtleSl7XHJcblx0RE9NSGFuZGxlci5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9XHJcbn0pXHJcblxyXG4vKiBQcml2YXRlIHN0YXRpYyBoZWxwZXJzIHRyZWF0ZWQgYmVsb3cgYXMgcHJpdmF0ZSBpbnN0YW5jZSBtZXRob2RzLCBzbyBkb24ndCBuZWVkIHRvIGFkZCB0aGVzZSB0byB0aGUgcHVibGljIEFQSTsgd2UgbWlnaHQgdXNlIGEgUmVsYXRvciB0byBhbHNvIGdldCByaWQgb2Ygbm9uLXN0YW5kYXJkIHB1YmxpYyBwcm9wZXJ0aWVzICovXHJcbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQgKGhhbmRlcixub2RlKSB7XHJcbiAgICBpZiAoIWhhbmRlci5jdXJyZW50RWxlbWVudCkge1xyXG4gICAgICAgIGhhbmRlci5kb2MuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmRlci5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxufS8vYXBwZW5kQ2hpbGQgYW5kIHNldEF0dHJpYnV0ZU5TIGFyZSBwcmVmb3JtYW5jZSBrZXlcclxuXHJcbi8vaWYodHlwZW9mIHJlcXVpcmUgPT0gJ2Z1bmN0aW9uJyl7XHJcblx0dmFyIFhNTFJlYWRlciA9IHJlcXVpcmUoJy4vc2F4JykuWE1MUmVhZGVyO1xyXG5cdHZhciBET01JbXBsZW1lbnRhdGlvbiA9IGV4cG9ydHMuRE9NSW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2RvbScpLkRPTUltcGxlbWVudGF0aW9uO1xyXG5cdGV4cG9ydHMuWE1MU2VyaWFsaXplciA9IHJlcXVpcmUoJy4vZG9tJykuWE1MU2VyaWFsaXplciA7XHJcblx0ZXhwb3J0cy5ET01QYXJzZXIgPSBET01QYXJzZXI7XHJcbi8vfVxyXG4iLCIvKlxuICogRE9NIExldmVsIDJcbiAqIE9iamVjdCBET01FeGNlcHRpb25cbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLURPTS1MZXZlbC0xL2VjbWEtc2NyaXB0LWxhbmd1YWdlLWJpbmRpbmcuaHRtbFxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAwL1JFQy1ET00tTGV2ZWwtMi1Db3JlLTIwMDAxMTEzL2VjbWEtc2NyaXB0LWJpbmRpbmcuaHRtbFxuICovXG5cbmZ1bmN0aW9uIGNvcHkoc3JjLGRlc3Qpe1xuXHRmb3IodmFyIHAgaW4gc3JjKXtcblx0XHRkZXN0W3BdID0gc3JjW3BdO1xuXHR9XG59XG4vKipcbl5cXHcrXFwucHJvdG90eXBlXFwuKFtfXFx3XSspXFxzKj1cXHMqKCg/Oi4qXFx7XFxzKj9bXFxyXFxuXVtcXHNcXFNdKj9efSl8XFxTLio/KD89WztcXHJcXG5dKSk7P1xuXlxcdytcXC5wcm90b3R5cGVcXC4oW19cXHddKylcXHMqPVxccyooXFxTLio/KD89WztcXHJcXG5dKSk7P1xuICovXG5mdW5jdGlvbiBfZXh0ZW5kcyhDbGFzcyxTdXBlcil7XG5cdHZhciBwdCA9IENsYXNzLnByb3RvdHlwZTtcblx0aWYoT2JqZWN0LmNyZWF0ZSl7XG5cdFx0dmFyIHBwdCA9IE9iamVjdC5jcmVhdGUoU3VwZXIucHJvdG90eXBlKVxuXHRcdHB0Ll9fcHJvdG9fXyA9IHBwdDtcblx0fVxuXHRpZighKHB0IGluc3RhbmNlb2YgU3VwZXIpKXtcblx0XHRmdW5jdGlvbiB0KCl7fTtcblx0XHR0LnByb3RvdHlwZSA9IFN1cGVyLnByb3RvdHlwZTtcblx0XHR0ID0gbmV3IHQoKTtcblx0XHRjb3B5KHB0LHQpO1xuXHRcdENsYXNzLnByb3RvdHlwZSA9IHB0ID0gdDtcblx0fVxuXHRpZihwdC5jb25zdHJ1Y3RvciAhPSBDbGFzcyl7XG5cdFx0aWYodHlwZW9mIENsYXNzICE9ICdmdW5jdGlvbicpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihcInVua25vdyBDbGFzczpcIitDbGFzcylcblx0XHR9XG5cdFx0cHQuY29uc3RydWN0b3IgPSBDbGFzc1xuXHR9XG59XG52YXIgaHRtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnIDtcbi8vIE5vZGUgVHlwZXNcbnZhciBOb2RlVHlwZSA9IHt9XG52YXIgRUxFTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRUxFTUVOVF9OT0RFICAgICAgICAgICAgICAgID0gMTtcbnZhciBBVFRSSUJVVEVfTk9ERSAgICAgICAgICAgICAgPSBOb2RlVHlwZS5BVFRSSUJVVEVfTk9ERSAgICAgICAgICAgICAgPSAyO1xudmFyIFRFWFRfTk9ERSAgICAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLlRFWFRfTk9ERSAgICAgICAgICAgICAgICAgICA9IDM7XG52YXIgQ0RBVEFfU0VDVElPTl9OT0RFICAgICAgICAgID0gTm9kZVR5cGUuQ0RBVEFfU0VDVElPTl9OT0RFICAgICAgICAgID0gNDtcbnZhciBFTlRJVFlfUkVGRVJFTkNFX05PREUgICAgICAgPSBOb2RlVHlwZS5FTlRJVFlfUkVGRVJFTkNFX05PREUgICAgICAgPSA1O1xudmFyIEVOVElUWV9OT0RFICAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkVOVElUWV9OT0RFICAgICAgICAgICAgICAgICA9IDY7XG52YXIgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFID0gTm9kZVR5cGUuUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFID0gNztcbnZhciBDT01NRU5UX05PREUgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5DT01NRU5UX05PREUgICAgICAgICAgICAgICAgPSA4O1xudmFyIERPQ1VNRU5UX05PREUgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkRPQ1VNRU5UX05PREUgICAgICAgICAgICAgICA9IDk7XG52YXIgRE9DVU1FTlRfVFlQRV9OT0RFICAgICAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfVFlQRV9OT0RFICAgICAgICAgID0gMTA7XG52YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSAgICAgID0gMTE7XG52YXIgTk9UQVRJT05fTk9ERSAgICAgICAgICAgICAgID0gTm9kZVR5cGUuTk9UQVRJT05fTk9ERSAgICAgICAgICAgICAgID0gMTI7XG5cbi8vIEV4Y2VwdGlvbkNvZGVcbnZhciBFeGNlcHRpb25Db2RlID0ge31cbnZhciBFeGNlcHRpb25NZXNzYWdlID0ge307XG52YXIgSU5ERVhfU0laRV9FUlIgICAgICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTkRFWF9TSVpFX0VSUiAgICAgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMV09XCJJbmRleCBzaXplIGVycm9yXCIpLDEpO1xudmFyIERPTVNUUklOR19TSVpFX0VSUiAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuRE9NU1RSSU5HX1NJWkVfRVJSICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzJdPVwiRE9NU3RyaW5nIHNpemUgZXJyb3JcIiksMik7XG52YXIgSElFUkFSQ0hZX1JFUVVFU1RfRVJSICAgICAgID0gRXhjZXB0aW9uQ29kZS5ISUVSQVJDSFlfUkVRVUVTVF9FUlIgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbM109XCJIaWVyYXJjaHkgcmVxdWVzdCBlcnJvclwiKSwzKTtcbnZhciBXUk9OR19ET0NVTUVOVF9FUlIgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLldST05HX0RPQ1VNRU5UX0VSUiAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs0XT1cIldyb25nIGRvY3VtZW50XCIpLDQpO1xudmFyIElOVkFMSURfQ0hBUkFDVEVSX0VSUiAgICAgICA9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9DSEFSQUNURVJfRVJSICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzVdPVwiSW52YWxpZCBjaGFyYWN0ZXJcIiksNSk7XG52YXIgTk9fREFUQV9BTExPV0VEX0VSUiAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5OT19EQVRBX0FMTE9XRURfRVJSICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbNl09XCJObyBkYXRhIGFsbG93ZWRcIiksNik7XG52YXIgTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSID0gRXhjZXB0aW9uQ29kZS5OT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbN109XCJObyBtb2RpZmljYXRpb24gYWxsb3dlZFwiKSw3KTtcbnZhciBOT1RfRk9VTkRfRVJSICAgICAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PVF9GT1VORF9FUlIgICAgICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs4XT1cIk5vdCBmb3VuZFwiKSw4KTtcbnZhciBOT1RfU1VQUE9SVEVEX0VSUiAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PVF9TVVBQT1JURURfRVJSICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs5XT1cIk5vdCBzdXBwb3J0ZWRcIiksOSk7XG52YXIgSU5VU0VfQVRUUklCVVRFX0VSUiAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTlVTRV9BVFRSSUJVVEVfRVJSICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTBdPVwiQXR0cmlidXRlIGluIHVzZVwiKSwxMCk7XG4vL2xldmVsMlxudmFyIElOVkFMSURfU1RBVEVfRVJSICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX1NUQVRFX0VSUiAgICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMV09XCJJbnZhbGlkIHN0YXRlXCIpLDExKTtcbnZhciBTWU5UQVhfRVJSICAgICAgICAgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuU1lOVEFYX0VSUiAgICAgICAgICAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTJdPVwiU3ludGF4IGVycm9yXCIpLDEyKTtcbnZhciBJTlZBTElEX01PRElGSUNBVElPTl9FUlIgXHQ9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9NT0RJRklDQVRJT05fRVJSIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTNdPVwiSW52YWxpZCBtb2RpZmljYXRpb25cIiksMTMpO1xudmFyIE5BTUVTUEFDRV9FUlIgICAgICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5OQU1FU1BBQ0VfRVJSICAgICAgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzE0XT1cIkludmFsaWQgbmFtZXNwYWNlXCIpLDE0KTtcbnZhciBJTlZBTElEX0FDQ0VTU19FUlIgICAgICAgXHQ9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9BQ0NFU1NfRVJSICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxNV09XCJJbnZhbGlkIGFjY2Vzc1wiKSwxNSk7XG5cblxuZnVuY3Rpb24gRE9NRXhjZXB0aW9uKGNvZGUsIG1lc3NhZ2UpIHtcblx0aWYobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKXtcblx0XHR2YXIgZXJyb3IgPSBtZXNzYWdlO1xuXHR9ZWxzZXtcblx0XHRlcnJvciA9IHRoaXM7XG5cdFx0RXJyb3IuY2FsbCh0aGlzLCBFeGNlcHRpb25NZXNzYWdlW2NvZGVdKTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBFeGNlcHRpb25NZXNzYWdlW2NvZGVdO1xuXHRcdGlmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBET01FeGNlcHRpb24pO1xuXHR9XG5cdGVycm9yLmNvZGUgPSBjb2RlO1xuXHRpZihtZXNzYWdlKSB0aGlzLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2UgKyBcIjogXCIgKyBtZXNzYWdlO1xuXHRyZXR1cm4gZXJyb3I7XG59O1xuRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcbmNvcHkoRXhjZXB0aW9uQ29kZSxET01FeGNlcHRpb24pXG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMC9SRUMtRE9NLUxldmVsLTItQ29yZS0yMDAwMTExMy9jb3JlLmh0bWwjSUQtNTM2Mjk3MTc3XG4gKiBUaGUgTm9kZUxpc3QgaW50ZXJmYWNlIHByb3ZpZGVzIHRoZSBhYnN0cmFjdGlvbiBvZiBhbiBvcmRlcmVkIGNvbGxlY3Rpb24gb2Ygbm9kZXMsIHdpdGhvdXQgZGVmaW5pbmcgb3IgY29uc3RyYWluaW5nIGhvdyB0aGlzIGNvbGxlY3Rpb24gaXMgaW1wbGVtZW50ZWQuIE5vZGVMaXN0IG9iamVjdHMgaW4gdGhlIERPTSBhcmUgbGl2ZS5cbiAqIFRoZSBpdGVtcyBpbiB0aGUgTm9kZUxpc3QgYXJlIGFjY2Vzc2libGUgdmlhIGFuIGludGVncmFsIGluZGV4LCBzdGFydGluZyBmcm9tIDAuXG4gKi9cbmZ1bmN0aW9uIE5vZGVMaXN0KCkge1xufTtcbk5vZGVMaXN0LnByb3RvdHlwZSA9IHtcblx0LyoqXG5cdCAqIFRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QuIFRoZSByYW5nZSBvZiB2YWxpZCBjaGlsZCBub2RlIGluZGljZXMgaXMgMCB0byBsZW5ndGgtMSBpbmNsdXNpdmUuXG5cdCAqIEBzdGFuZGFyZCBsZXZlbDFcblx0ICovXG5cdGxlbmd0aDowLCBcblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGluZGV4dGggaXRlbSBpbiB0aGUgY29sbGVjdGlvbi4gSWYgaW5kZXggaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QsIHRoaXMgcmV0dXJucyBudWxsLlxuXHQgKiBAc3RhbmRhcmQgbGV2ZWwxXG5cdCAqIEBwYXJhbSBpbmRleCAgdW5zaWduZWQgbG9uZyBcblx0ICogICBJbmRleCBpbnRvIHRoZSBjb2xsZWN0aW9uLlxuXHQgKiBAcmV0dXJuIE5vZGVcblx0ICogXHRUaGUgbm9kZSBhdCB0aGUgaW5kZXh0aCBwb3NpdGlvbiBpbiB0aGUgTm9kZUxpc3QsIG9yIG51bGwgaWYgdGhhdCBpcyBub3QgYSB2YWxpZCBpbmRleC4gXG5cdCAqL1xuXHRpdGVtOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdHJldHVybiB0aGlzW2luZGV4XSB8fCBudWxsO1xuXHR9LFxuXHR0b1N0cmluZzpmdW5jdGlvbihpc0hUTUwsbm9kZUZpbHRlcil7XG5cdFx0Zm9yKHZhciBidWYgPSBbXSwgaSA9IDA7aTx0aGlzLmxlbmd0aDtpKyspe1xuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcodGhpc1tpXSxidWYsaXNIVE1MLG5vZGVGaWx0ZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gYnVmLmpvaW4oJycpO1xuXHR9XG59O1xuZnVuY3Rpb24gTGl2ZU5vZGVMaXN0KG5vZGUscmVmcmVzaCl7XG5cdHRoaXMuX25vZGUgPSBub2RlO1xuXHR0aGlzLl9yZWZyZXNoID0gcmVmcmVzaFxuXHRfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG59XG5mdW5jdGlvbiBfdXBkYXRlTGl2ZUxpc3QobGlzdCl7XG5cdHZhciBpbmMgPSBsaXN0Ll9ub2RlLl9pbmMgfHwgbGlzdC5fbm9kZS5vd25lckRvY3VtZW50Ll9pbmM7XG5cdGlmKGxpc3QuX2luYyAhPSBpbmMpe1xuXHRcdHZhciBscyA9IGxpc3QuX3JlZnJlc2gobGlzdC5fbm9kZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhscy5sZW5ndGgpXG5cdFx0X19zZXRfXyhsaXN0LCdsZW5ndGgnLGxzLmxlbmd0aCk7XG5cdFx0Y29weShscyxsaXN0KTtcblx0XHRsaXN0Ll9pbmMgPSBpbmM7XG5cdH1cbn1cbkxpdmVOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uKGkpe1xuXHRfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG5cdHJldHVybiB0aGlzW2ldO1xufVxuXG5fZXh0ZW5kcyhMaXZlTm9kZUxpc3QsTm9kZUxpc3QpO1xuLyoqXG4gKiBcbiAqIE9iamVjdHMgaW1wbGVtZW50aW5nIHRoZSBOYW1lZE5vZGVNYXAgaW50ZXJmYWNlIGFyZSB1c2VkIHRvIHJlcHJlc2VudCBjb2xsZWN0aW9ucyBvZiBub2RlcyB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBieSBuYW1lLiBOb3RlIHRoYXQgTmFtZWROb2RlTWFwIGRvZXMgbm90IGluaGVyaXQgZnJvbSBOb2RlTGlzdDsgTmFtZWROb2RlTWFwcyBhcmUgbm90IG1haW50YWluZWQgaW4gYW55IHBhcnRpY3VsYXIgb3JkZXIuIE9iamVjdHMgY29udGFpbmVkIGluIGFuIG9iamVjdCBpbXBsZW1lbnRpbmcgTmFtZWROb2RlTWFwIG1heSBhbHNvIGJlIGFjY2Vzc2VkIGJ5IGFuIG9yZGluYWwgaW5kZXgsIGJ1dCB0aGlzIGlzIHNpbXBseSB0byBhbGxvdyBjb252ZW5pZW50IGVudW1lcmF0aW9uIG9mIHRoZSBjb250ZW50cyBvZiBhIE5hbWVkTm9kZU1hcCwgYW5kIGRvZXMgbm90IGltcGx5IHRoYXQgdGhlIERPTSBzcGVjaWZpZXMgYW4gb3JkZXIgdG8gdGhlc2UgTm9kZXMuXG4gKiBOYW1lZE5vZGVNYXAgb2JqZWN0cyBpbiB0aGUgRE9NIGFyZSBsaXZlLlxuICogdXNlZCBmb3IgYXR0cmlidXRlcyBvciBEb2N1bWVudFR5cGUgZW50aXRpZXMgXG4gKi9cbmZ1bmN0aW9uIE5hbWVkTm9kZU1hcCgpIHtcbn07XG5cbmZ1bmN0aW9uIF9maW5kTm9kZUluZGV4KGxpc3Qsbm9kZSl7XG5cdHZhciBpID0gbGlzdC5sZW5ndGg7XG5cdHdoaWxlKGktLSl7XG5cdFx0aWYobGlzdFtpXSA9PT0gbm9kZSl7cmV0dXJuIGl9XG5cdH1cbn1cblxuZnVuY3Rpb24gX2FkZE5hbWVkTm9kZShlbCxsaXN0LG5ld0F0dHIsb2xkQXR0cil7XG5cdGlmKG9sZEF0dHIpe1xuXHRcdGxpc3RbX2ZpbmROb2RlSW5kZXgobGlzdCxvbGRBdHRyKV0gPSBuZXdBdHRyO1xuXHR9ZWxzZXtcblx0XHRsaXN0W2xpc3QubGVuZ3RoKytdID0gbmV3QXR0cjtcblx0fVxuXHRpZihlbCl7XG5cdFx0bmV3QXR0ci5vd25lckVsZW1lbnQgPSBlbDtcblx0XHR2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblx0XHRpZihkb2Mpe1xuXHRcdFx0b2xkQXR0ciAmJiBfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLGVsLG9sZEF0dHIpO1xuXHRcdFx0X29uQWRkQXR0cmlidXRlKGRvYyxlbCxuZXdBdHRyKTtcblx0XHR9XG5cdH1cbn1cbmZ1bmN0aW9uIF9yZW1vdmVOYW1lZE5vZGUoZWwsbGlzdCxhdHRyKXtcblx0Ly9jb25zb2xlLmxvZygncmVtb3ZlIGF0dHI6JythdHRyKVxuXHR2YXIgaSA9IF9maW5kTm9kZUluZGV4KGxpc3QsYXR0cik7XG5cdGlmKGk+PTApe1xuXHRcdHZhciBsYXN0SW5kZXggPSBsaXN0Lmxlbmd0aC0xXG5cdFx0d2hpbGUoaTxsYXN0SW5kZXgpe1xuXHRcdFx0bGlzdFtpXSA9IGxpc3RbKytpXVxuXHRcdH1cblx0XHRsaXN0Lmxlbmd0aCA9IGxhc3RJbmRleDtcblx0XHRpZihlbCl7XG5cdFx0XHR2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblx0XHRcdGlmKGRvYyl7XG5cdFx0XHRcdF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsYXR0cik7XG5cdFx0XHRcdGF0dHIub3duZXJFbGVtZW50ID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH1lbHNle1xuXHRcdHRocm93IERPTUV4Y2VwdGlvbihOT1RfRk9VTkRfRVJSLG5ldyBFcnJvcihlbC50YWdOYW1lKydAJythdHRyKSlcblx0fVxufVxuTmFtZWROb2RlTWFwLnByb3RvdHlwZSA9IHtcblx0bGVuZ3RoOjAsXG5cdGl0ZW06Tm9kZUxpc3QucHJvdG90eXBlLml0ZW0sXG5cdGdldE5hbWVkSXRlbTogZnVuY3Rpb24oa2V5KSB7XG4vL1x0XHRpZihrZXkuaW5kZXhPZignOicpPjAgfHwga2V5ID09ICd4bWxucycpe1xuLy9cdFx0XHRyZXR1cm4gbnVsbDtcbi8vXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKClcblx0XHR2YXIgaSA9IHRoaXMubGVuZ3RoO1xuXHRcdHdoaWxlKGktLSl7XG5cdFx0XHR2YXIgYXR0ciA9IHRoaXNbaV07XG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHIubm9kZU5hbWUsa2V5KVxuXHRcdFx0aWYoYXR0ci5ub2RlTmFtZSA9PSBrZXkpe1xuXHRcdFx0XHRyZXR1cm4gYXR0cjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHNldE5hbWVkSXRlbTogZnVuY3Rpb24oYXR0cikge1xuXHRcdHZhciBlbCA9IGF0dHIub3duZXJFbGVtZW50O1xuXHRcdGlmKGVsICYmIGVsIT10aGlzLl9vd25lckVsZW1lbnQpe1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4Y2VwdGlvbihJTlVTRV9BVFRSSUJVVEVfRVJSKTtcblx0XHR9XG5cdFx0dmFyIG9sZEF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbShhdHRyLm5vZGVOYW1lKTtcblx0XHRfYWRkTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIsb2xkQXR0cik7XG5cdFx0cmV0dXJuIG9sZEF0dHI7XG5cdH0sXG5cdC8qIHJldHVybnMgTm9kZSAqL1xuXHRzZXROYW1lZEl0ZW1OUzogZnVuY3Rpb24oYXR0cikgey8vIHJhaXNlczogV1JPTkdfRE9DVU1FTlRfRVJSLE5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUixJTlVTRV9BVFRSSUJVVEVfRVJSXG5cdFx0dmFyIGVsID0gYXR0ci5vd25lckVsZW1lbnQsIG9sZEF0dHI7XG5cdFx0aWYoZWwgJiYgZWwhPXRoaXMuX293bmVyRWxlbWVudCl7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKElOVVNFX0FUVFJJQlVURV9FUlIpO1xuXHRcdH1cblx0XHRvbGRBdHRyID0gdGhpcy5nZXROYW1lZEl0ZW1OUyhhdHRyLm5hbWVzcGFjZVVSSSxhdHRyLmxvY2FsTmFtZSk7XG5cdFx0X2FkZE5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyLG9sZEF0dHIpO1xuXHRcdHJldHVybiBvbGRBdHRyO1xuXHR9LFxuXG5cdC8qIHJldHVybnMgTm9kZSAqL1xuXHRyZW1vdmVOYW1lZEl0ZW06IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXROYW1lZEl0ZW0oa2V5KTtcblx0XHRfcmVtb3ZlTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCx0aGlzLGF0dHIpO1xuXHRcdHJldHVybiBhdHRyO1xuXHRcdFxuXHRcdFxuXHR9LC8vIHJhaXNlczogTk9UX0ZPVU5EX0VSUixOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlJcblx0XG5cdC8vZm9yIGxldmVsMlxuXHRyZW1vdmVOYW1lZEl0ZW1OUzpmdW5jdGlvbihuYW1lc3BhY2VVUkksbG9jYWxOYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtTlMobmFtZXNwYWNlVVJJLGxvY2FsTmFtZSk7XG5cdFx0X3JlbW92ZU5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyKTtcblx0XHRyZXR1cm4gYXR0cjtcblx0fSxcblx0Z2V0TmFtZWRJdGVtTlM6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKSB7XG5cdFx0dmFyIGkgPSB0aGlzLmxlbmd0aDtcblx0XHR3aGlsZShpLS0pe1xuXHRcdFx0dmFyIG5vZGUgPSB0aGlzW2ldO1xuXHRcdFx0aWYobm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lICYmIG5vZGUubmFtZXNwYWNlVVJJID09IG5hbWVzcGFjZVVSSSl7XG5cdFx0XHRcdHJldHVybiBub2RlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtRE9NLUxldmVsLTEvbGV2ZWwtb25lLWNvcmUuaHRtbCNJRC0xMDIxNjE0OTBcbiAqL1xuZnVuY3Rpb24gRE9NSW1wbGVtZW50YXRpb24oLyogT2JqZWN0ICovIGZlYXR1cmVzKSB7XG5cdHRoaXMuX2ZlYXR1cmVzID0ge307XG5cdGlmIChmZWF0dXJlcykge1xuXHRcdGZvciAodmFyIGZlYXR1cmUgaW4gZmVhdHVyZXMpIHtcblx0XHRcdCB0aGlzLl9mZWF0dXJlcyA9IGZlYXR1cmVzW2ZlYXR1cmVdO1xuXHRcdH1cblx0fVxufTtcblxuRE9NSW1wbGVtZW50YXRpb24ucHJvdG90eXBlID0ge1xuXHRoYXNGZWF0dXJlOiBmdW5jdGlvbigvKiBzdHJpbmcgKi8gZmVhdHVyZSwgLyogc3RyaW5nICovIHZlcnNpb24pIHtcblx0XHR2YXIgdmVyc2lvbnMgPSB0aGlzLl9mZWF0dXJlc1tmZWF0dXJlLnRvTG93ZXJDYXNlKCldO1xuXHRcdGlmICh2ZXJzaW9ucyAmJiAoIXZlcnNpb24gfHwgdmVyc2lvbiBpbiB2ZXJzaW9ucykpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVEb2N1bWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksICBxdWFsaWZpZWROYW1lLCBkb2N0eXBlKXsvLyByYWlzZXM6SU5WQUxJRF9DSEFSQUNURVJfRVJSLE5BTUVTUEFDRV9FUlIsV1JPTkdfRE9DVU1FTlRfRVJSXG5cdFx0dmFyIGRvYyA9IG5ldyBEb2N1bWVudCgpO1xuXHRcdGRvYy5pbXBsZW1lbnRhdGlvbiA9IHRoaXM7XG5cdFx0ZG9jLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRkb2MuZG9jdHlwZSA9IGRvY3R5cGU7XG5cdFx0aWYoZG9jdHlwZSl7XG5cdFx0XHRkb2MuYXBwZW5kQ2hpbGQoZG9jdHlwZSk7XG5cdFx0fVxuXHRcdGlmKHF1YWxpZmllZE5hbWUpe1xuXHRcdFx0dmFyIHJvb3QgPSBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSxxdWFsaWZpZWROYW1lKTtcblx0XHRcdGRvYy5hcHBlbmRDaGlsZChyb290KTtcblx0XHR9XG5cdFx0cmV0dXJuIGRvYztcblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlRG9jdW1lbnRUeXBlOmZ1bmN0aW9uKHF1YWxpZmllZE5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCl7Ly8gcmFpc2VzOklOVkFMSURfQ0hBUkFDVEVSX0VSUixOQU1FU1BBQ0VfRVJSXG5cdFx0dmFyIG5vZGUgPSBuZXcgRG9jdW1lbnRUeXBlKCk7XG5cdFx0bm9kZS5uYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5vZGVOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLnB1YmxpY0lkID0gcHVibGljSWQ7XG5cdFx0bm9kZS5zeXN0ZW1JZCA9IHN5c3RlbUlkO1xuXHRcdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdFx0Ly9yZWFkb25seSBhdHRyaWJ1dGUgRE9NU3RyaW5nICAgICAgICBpbnRlcm5hbFN1YnNldDtcblx0XHRcblx0XHQvL1RPRE86Li5cblx0XHQvLyAgcmVhZG9ubHkgYXR0cmlidXRlIE5hbWVkTm9kZU1hcCAgICAgZW50aXRpZXM7XG5cdFx0Ly8gIHJlYWRvbmx5IGF0dHJpYnV0ZSBOYW1lZE5vZGVNYXAgICAgIG5vdGF0aW9ucztcblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxuXG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMC9SRUMtRE9NLUxldmVsLTItQ29yZS0yMDAwMTExMy9jb3JlLmh0bWwjSUQtMTk1MDY0MTI0N1xuICovXG5cbmZ1bmN0aW9uIE5vZGUoKSB7XG59O1xuXG5Ob2RlLnByb3RvdHlwZSA9IHtcblx0Zmlyc3RDaGlsZCA6IG51bGwsXG5cdGxhc3RDaGlsZCA6IG51bGwsXG5cdHByZXZpb3VzU2libGluZyA6IG51bGwsXG5cdG5leHRTaWJsaW5nIDogbnVsbCxcblx0YXR0cmlidXRlcyA6IG51bGwsXG5cdHBhcmVudE5vZGUgOiBudWxsLFxuXHRjaGlsZE5vZGVzIDogbnVsbCxcblx0b3duZXJEb2N1bWVudCA6IG51bGwsXG5cdG5vZGVWYWx1ZSA6IG51bGwsXG5cdG5hbWVzcGFjZVVSSSA6IG51bGwsXG5cdHByZWZpeCA6IG51bGwsXG5cdGxvY2FsTmFtZSA6IG51bGwsXG5cdC8vIE1vZGlmaWVkIGluIERPTSBMZXZlbCAyOlxuXHRpbnNlcnRCZWZvcmU6ZnVuY3Rpb24obmV3Q2hpbGQsIHJlZkNoaWxkKXsvL3JhaXNlcyBcblx0XHRyZXR1cm4gX2luc2VydEJlZm9yZSh0aGlzLG5ld0NoaWxkLHJlZkNoaWxkKTtcblx0fSxcblx0cmVwbGFjZUNoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkLCBvbGRDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0dGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsb2xkQ2hpbGQpO1xuXHRcdGlmKG9sZENoaWxkKXtcblx0XHRcdHRoaXMucmVtb3ZlQ2hpbGQob2xkQ2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlQ2hpbGQ6ZnVuY3Rpb24ob2xkQ2hpbGQpe1xuXHRcdHJldHVybiBfcmVtb3ZlQ2hpbGQodGhpcyxvbGRDaGlsZCk7XG5cdH0sXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHRyZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsbnVsbCk7XG5cdH0sXG5cdGhhc0NoaWxkTm9kZXM6ZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5maXJzdENoaWxkICE9IG51bGw7XG5cdH0sXG5cdGNsb25lTm9kZTpmdW5jdGlvbihkZWVwKXtcblx0XHRyZXR1cm4gY2xvbmVOb2RlKHRoaXMub3duZXJEb2N1bWVudHx8dGhpcyx0aGlzLGRlZXApO1xuXHR9LFxuXHQvLyBNb2RpZmllZCBpbiBET00gTGV2ZWwgMjpcblx0bm9ybWFsaXplOmZ1bmN0aW9uKCl7XG5cdFx0dmFyIGNoaWxkID0gdGhpcy5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdHZhciBuZXh0ID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHRpZihuZXh0ICYmIG5leHQubm9kZVR5cGUgPT0gVEVYVF9OT0RFICYmIGNoaWxkLm5vZGVUeXBlID09IFRFWFRfTk9ERSl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ2hpbGQobmV4dCk7XG5cdFx0XHRcdGNoaWxkLmFwcGVuZERhdGEobmV4dC5kYXRhKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRjaGlsZC5ub3JtYWxpemUoKTtcblx0XHRcdFx0Y2hpbGQgPSBuZXh0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcbiAgXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRpc1N1cHBvcnRlZDpmdW5jdGlvbihmZWF0dXJlLCB2ZXJzaW9uKXtcblx0XHRyZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoZmVhdHVyZSx2ZXJzaW9uKTtcblx0fSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuICAgIGhhc0F0dHJpYnV0ZXM6ZnVuY3Rpb24oKXtcbiAgICBcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoPjA7XG4gICAgfSxcbiAgICBsb29rdXBQcmVmaXg6ZnVuY3Rpb24obmFtZXNwYWNlVVJJKXtcbiAgICBcdHZhciBlbCA9IHRoaXM7XG4gICAgXHR3aGlsZShlbCl7XG4gICAgXHRcdHZhciBtYXAgPSBlbC5fbnNNYXA7XG4gICAgXHRcdC8vY29uc29sZS5kaXIobWFwKVxuICAgIFx0XHRpZihtYXApe1xuICAgIFx0XHRcdGZvcih2YXIgbiBpbiBtYXApe1xuICAgIFx0XHRcdFx0aWYobWFwW25dID09IG5hbWVzcGFjZVVSSSl7XG4gICAgXHRcdFx0XHRcdHJldHVybiBuO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XHRlbCA9IGVsLm5vZGVUeXBlID09IEFUVFJJQlVURV9OT0RFP2VsLm93bmVyRG9jdW1lbnQgOiBlbC5wYXJlbnROb2RlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAzOlxuICAgIGxvb2t1cE5hbWVzcGFjZVVSSTpmdW5jdGlvbihwcmVmaXgpe1xuICAgIFx0dmFyIGVsID0gdGhpcztcbiAgICBcdHdoaWxlKGVsKXtcbiAgICBcdFx0dmFyIG1hcCA9IGVsLl9uc01hcDtcbiAgICBcdFx0Ly9jb25zb2xlLmRpcihtYXApXG4gICAgXHRcdGlmKG1hcCl7XG4gICAgXHRcdFx0aWYocHJlZml4IGluIG1hcCl7XG4gICAgXHRcdFx0XHRyZXR1cm4gbWFwW3ByZWZpeF0gO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XHRlbCA9IGVsLm5vZGVUeXBlID09IEFUVFJJQlVURV9OT0RFP2VsLm93bmVyRG9jdW1lbnQgOiBlbC5wYXJlbnROb2RlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAzOlxuICAgIGlzRGVmYXVsdE5hbWVzcGFjZTpmdW5jdGlvbihuYW1lc3BhY2VVUkkpe1xuICAgIFx0dmFyIHByZWZpeCA9IHRoaXMubG9va3VwUHJlZml4KG5hbWVzcGFjZVVSSSk7XG4gICAgXHRyZXR1cm4gcHJlZml4ID09IG51bGw7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBfeG1sRW5jb2RlcihjKXtcblx0cmV0dXJuIGMgPT0gJzwnICYmICcmbHQ7JyB8fFxuICAgICAgICAgYyA9PSAnPicgJiYgJyZndDsnIHx8XG4gICAgICAgICBjID09ICcmJyAmJiAnJmFtcDsnIHx8XG4gICAgICAgICBjID09ICdcIicgJiYgJyZxdW90OycgfHxcbiAgICAgICAgICcmIycrYy5jaGFyQ29kZUF0KCkrJzsnXG59XG5cblxuY29weShOb2RlVHlwZSxOb2RlKTtcbmNvcHkoTm9kZVR5cGUsTm9kZS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEBwYXJhbSBjYWxsYmFjayByZXR1cm4gdHJ1ZSBmb3IgY29udGludWUsZmFsc2UgZm9yIGJyZWFrXG4gKiBAcmV0dXJuIGJvb2xlYW4gdHJ1ZTogYnJlYWsgdmlzaXQ7XG4gKi9cbmZ1bmN0aW9uIF92aXNpdE5vZGUobm9kZSxjYWxsYmFjayl7XG5cdGlmKGNhbGxiYWNrKG5vZGUpKXtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZihub2RlID0gbm9kZS5maXJzdENoaWxkKXtcblx0XHRkb3tcblx0XHRcdGlmKF92aXNpdE5vZGUobm9kZSxjYWxsYmFjaykpe3JldHVybiB0cnVlfVxuICAgICAgICB9d2hpbGUobm9kZT1ub2RlLm5leHRTaWJsaW5nKVxuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIERvY3VtZW50KCl7XG59XG5mdW5jdGlvbiBfb25BZGRBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIpe1xuXHRkb2MgJiYgZG9jLl9pbmMrKztcblx0dmFyIG5zID0gbmV3QXR0ci5uYW1lc3BhY2VVUkkgO1xuXHRpZihucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKXtcblx0XHQvL3VwZGF0ZSBuYW1lc3BhY2Vcblx0XHRlbC5fbnNNYXBbbmV3QXR0ci5wcmVmaXg/bmV3QXR0ci5sb2NhbE5hbWU6JyddID0gbmV3QXR0ci52YWx1ZVxuXHR9XG59XG5mdW5jdGlvbiBfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIscmVtb3ZlKXtcblx0ZG9jICYmIGRvYy5faW5jKys7XG5cdHZhciBucyA9IG5ld0F0dHIubmFtZXNwYWNlVVJJIDtcblx0aWYobnMgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyl7XG5cdFx0Ly91cGRhdGUgbmFtZXNwYWNlXG5cdFx0ZGVsZXRlIGVsLl9uc01hcFtuZXdBdHRyLnByZWZpeD9uZXdBdHRyLmxvY2FsTmFtZTonJ11cblx0fVxufVxuZnVuY3Rpb24gX29uVXBkYXRlQ2hpbGQoZG9jLGVsLG5ld0NoaWxkKXtcblx0aWYoZG9jICYmIGRvYy5faW5jKXtcblx0XHRkb2MuX2luYysrO1xuXHRcdC8vdXBkYXRlIGNoaWxkTm9kZXNcblx0XHR2YXIgY3MgPSBlbC5jaGlsZE5vZGVzO1xuXHRcdGlmKG5ld0NoaWxkKXtcblx0XHRcdGNzW2NzLmxlbmd0aCsrXSA9IG5ld0NoaWxkO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly9jb25zb2xlLmxvZygxKVxuXHRcdFx0dmFyIGNoaWxkID0gZWwuZmlyc3RDaGlsZDtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0Y3NbaSsrXSA9IGNoaWxkO1xuXHRcdFx0XHRjaGlsZCA9Y2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRjcy5sZW5ndGggPSBpO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIGF0dHJpYnV0ZXM7XG4gKiBjaGlsZHJlbjtcbiAqIFxuICogd3JpdGVhYmxlIHByb3BlcnRpZXM6XG4gKiBub2RlVmFsdWUsQXR0cjp2YWx1ZSxDaGFyYWN0ZXJEYXRhOmRhdGFcbiAqIHByZWZpeFxuICovXG5mdW5jdGlvbiBfcmVtb3ZlQ2hpbGQocGFyZW50Tm9kZSxjaGlsZCl7XG5cdHZhciBwcmV2aW91cyA9IGNoaWxkLnByZXZpb3VzU2libGluZztcblx0dmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblx0aWYocHJldmlvdXMpe1xuXHRcdHByZXZpb3VzLm5leHRTaWJsaW5nID0gbmV4dDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV4dFxuXHR9XG5cdGlmKG5leHQpe1xuXHRcdG5leHQucHJldmlvdXNTaWJsaW5nID0gcHJldmlvdXM7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUubGFzdENoaWxkID0gcHJldmlvdXM7XG5cdH1cblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50LHBhcmVudE5vZGUpO1xuXHRyZXR1cm4gY2hpbGQ7XG59XG4vKipcbiAqIHByZWZvcm1hbmNlIGtleShyZWZDaGlsZCA9PSBudWxsKVxuICovXG5mdW5jdGlvbiBfaW5zZXJ0QmVmb3JlKHBhcmVudE5vZGUsbmV3Q2hpbGQsbmV4dENoaWxkKXtcblx0dmFyIGNwID0gbmV3Q2hpbGQucGFyZW50Tm9kZTtcblx0aWYoY3Ape1xuXHRcdGNwLnJlbW92ZUNoaWxkKG5ld0NoaWxkKTsvL3JlbW92ZSBhbmQgdXBkYXRlXG5cdH1cblx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdHZhciBuZXdGaXJzdCA9IG5ld0NoaWxkLmZpcnN0Q2hpbGQ7XG5cdFx0aWYgKG5ld0ZpcnN0ID09IG51bGwpIHtcblx0XHRcdHJldHVybiBuZXdDaGlsZDtcblx0XHR9XG5cdFx0dmFyIG5ld0xhc3QgPSBuZXdDaGlsZC5sYXN0Q2hpbGQ7XG5cdH1lbHNle1xuXHRcdG5ld0ZpcnN0ID0gbmV3TGFzdCA9IG5ld0NoaWxkO1xuXHR9XG5cdHZhciBwcmUgPSBuZXh0Q2hpbGQgPyBuZXh0Q2hpbGQucHJldmlvdXNTaWJsaW5nIDogcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cblx0bmV3Rmlyc3QucHJldmlvdXNTaWJsaW5nID0gcHJlO1xuXHRuZXdMYXN0Lm5leHRTaWJsaW5nID0gbmV4dENoaWxkO1xuXHRcblx0XG5cdGlmKHByZSl7XG5cdFx0cHJlLm5leHRTaWJsaW5nID0gbmV3Rmlyc3Q7XG5cdH1lbHNle1xuXHRcdHBhcmVudE5vZGUuZmlyc3RDaGlsZCA9IG5ld0ZpcnN0O1xuXHR9XG5cdGlmKG5leHRDaGlsZCA9PSBudWxsKXtcblx0XHRwYXJlbnROb2RlLmxhc3RDaGlsZCA9IG5ld0xhc3Q7XG5cdH1lbHNle1xuXHRcdG5leHRDaGlsZC5wcmV2aW91c1NpYmxpbmcgPSBuZXdMYXN0O1xuXHR9XG5cdGRve1xuXHRcdG5ld0ZpcnN0LnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuXHR9d2hpbGUobmV3Rmlyc3QgIT09IG5ld0xhc3QgJiYgKG5ld0ZpcnN0PSBuZXdGaXJzdC5uZXh0U2libGluZykpXG5cdF9vblVwZGF0ZUNoaWxkKHBhcmVudE5vZGUub3duZXJEb2N1bWVudHx8cGFyZW50Tm9kZSxwYXJlbnROb2RlKTtcblx0Ly9jb25zb2xlLmxvZyhwYXJlbnROb2RlLmxhc3RDaGlsZC5uZXh0U2libGluZyA9PSBudWxsKVxuXHRpZiAobmV3Q2hpbGQubm9kZVR5cGUgPT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuXHRcdG5ld0NoaWxkLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZC5sYXN0Q2hpbGQgPSBudWxsO1xuXHR9XG5cdHJldHVybiBuZXdDaGlsZDtcbn1cbmZ1bmN0aW9uIF9hcHBlbmRTaW5nbGVDaGlsZChwYXJlbnROb2RlLG5ld0NoaWxkKXtcblx0dmFyIGNwID0gbmV3Q2hpbGQucGFyZW50Tm9kZTtcblx0aWYoY3Ape1xuXHRcdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0XHRjcC5yZW1vdmVDaGlsZChuZXdDaGlsZCk7Ly9yZW1vdmUgYW5kIHVwZGF0ZVxuXHRcdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0fVxuXHR2YXIgcHJlID0gcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG5cdG5ld0NoaWxkLnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuXHRuZXdDaGlsZC5wcmV2aW91c1NpYmxpbmcgPSBwcmU7XG5cdG5ld0NoaWxkLm5leHRTaWJsaW5nID0gbnVsbDtcblx0aWYocHJlKXtcblx0XHRwcmUubmV4dFNpYmxpbmcgPSBuZXdDaGlsZDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV3Q2hpbGQ7XG5cdH1cblx0cGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBuZXdDaGlsZDtcblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50LHBhcmVudE5vZGUsbmV3Q2hpbGQpO1xuXHRyZXR1cm4gbmV3Q2hpbGQ7XG5cdC8vY29uc29sZS5sb2coXCJfX2FhXCIscGFyZW50Tm9kZS5sYXN0Q2hpbGQubmV4dFNpYmxpbmcgPT0gbnVsbClcbn1cbkRvY3VtZW50LnByb3RvdHlwZSA9IHtcblx0Ly9pbXBsZW1lbnRhdGlvbiA6IG51bGwsXG5cdG5vZGVOYW1lIDogICcjZG9jdW1lbnQnLFxuXHRub2RlVHlwZSA6ICBET0NVTUVOVF9OT0RFLFxuXHRkb2N0eXBlIDogIG51bGwsXG5cdGRvY3VtZW50RWxlbWVudCA6ICBudWxsLFxuXHRfaW5jIDogMSxcblx0XG5cdGluc2VydEJlZm9yZSA6ICBmdW5jdGlvbihuZXdDaGlsZCwgcmVmQ2hpbGQpey8vcmFpc2VzIFxuXHRcdGlmKG5ld0NoaWxkLm5vZGVUeXBlID09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdFx0dmFyIGNoaWxkID0gbmV3Q2hpbGQuZmlyc3RDaGlsZDtcblx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0dmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0dGhpcy5pbnNlcnRCZWZvcmUoY2hpbGQscmVmQ2hpbGQpO1xuXHRcdFx0XHRjaGlsZCA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdGlmKHRoaXMuZG9jdW1lbnRFbGVtZW50ID09IG51bGwgJiYgbmV3Q2hpbGQubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFKXtcblx0XHRcdHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBfaW5zZXJ0QmVmb3JlKHRoaXMsbmV3Q2hpbGQscmVmQ2hpbGQpLChuZXdDaGlsZC5vd25lckRvY3VtZW50ID0gdGhpcyksbmV3Q2hpbGQ7XG5cdH0sXG5cdHJlbW92ZUNoaWxkIDogIGZ1bmN0aW9uKG9sZENoaWxkKXtcblx0XHRpZih0aGlzLmRvY3VtZW50RWxlbWVudCA9PSBvbGRDaGlsZCl7XG5cdFx0XHR0aGlzLmRvY3VtZW50RWxlbWVudCA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiBfcmVtb3ZlQ2hpbGQodGhpcyxvbGRDaGlsZCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGltcG9ydE5vZGUgOiBmdW5jdGlvbihpbXBvcnRlZE5vZGUsZGVlcCl7XG5cdFx0cmV0dXJuIGltcG9ydE5vZGUodGhpcyxpbXBvcnRlZE5vZGUsZGVlcCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGdldEVsZW1lbnRCeUlkIDpcdGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgcnR2ID0gbnVsbDtcblx0XHRfdmlzaXROb2RlKHRoaXMuZG9jdW1lbnRFbGVtZW50LGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0aWYobm9kZS5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUpe1xuXHRcdFx0XHRpZihub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PSBpZCl7XG5cdFx0XHRcdFx0cnR2ID0gbm9kZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0cmV0dXJuIHJ0djtcblx0fSxcblx0XG5cdC8vZG9jdW1lbnQgZmFjdG9yeSBtZXRob2Q6XG5cdGNyZWF0ZUVsZW1lbnQgOlx0ZnVuY3Rpb24odGFnTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRWxlbWVudCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHRhZ05hbWU7XG5cdFx0bm9kZS50YWdOYW1lID0gdGFnTmFtZTtcblx0XHRub2RlLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuXHRcdGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVEb2N1bWVudEZyYWdtZW50IDpcdGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZVRleHROb2RlIDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IFRleHQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuYXBwZW5kRGF0YShkYXRhKVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVDb21tZW50IDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IENvbW1lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuYXBwZW5kRGF0YShkYXRhKVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVDREFUQVNlY3Rpb24gOlx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQ0RBVEFTZWN0aW9uKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uIDpcdGZ1bmN0aW9uKHRhcmdldCxkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24oKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUudGFnTmFtZSA9IG5vZGUudGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdG5vZGUubm9kZVZhbHVlPSBub2RlLmRhdGEgPSBkYXRhO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVBdHRyaWJ1dGUgOlx0ZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudFx0PSB0aGlzO1xuXHRcdG5vZGUubmFtZSA9IG5hbWU7XG5cdFx0bm9kZS5ub2RlTmFtZVx0PSBuYW1lO1xuXHRcdG5vZGUubG9jYWxOYW1lID0gbmFtZTtcblx0XHRub2RlLnNwZWNpZmllZCA9IHRydWU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZUVudGl0eVJlZmVyZW5jZSA6XHRmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBFbnRpdHlSZWZlcmVuY2UoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnRcdD0gdGhpcztcblx0XHRub2RlLm5vZGVOYW1lXHQ9IG5hbWU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZUVsZW1lbnROUyA6XHRmdW5jdGlvbihuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRWxlbWVudCgpO1xuXHRcdHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuXHRcdG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS50YWdOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZVVSSTtcblx0XHRpZihwbC5sZW5ndGggPT0gMil7XG5cdFx0XHRub2RlLnByZWZpeCA9IHBsWzBdO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBwbFsxXTtcblx0XHR9ZWxzZXtcblx0XHRcdC8vZWwucHJlZml4ID0gbnVsbDtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHR9XG5cdFx0YXR0cnMuX293bmVyRWxlbWVudCA9IG5vZGU7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZUF0dHJpYnV0ZU5TIDpcdGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSxxdWFsaWZpZWROYW1lKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBBdHRyKCk7XG5cdFx0dmFyIHBsID0gcXVhbGlmaWVkTmFtZS5zcGxpdCgnOicpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lID0gcXVhbGlmaWVkTmFtZTtcblx0XHRub2RlLm5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZVVSSTtcblx0XHRub2RlLnNwZWNpZmllZCA9IHRydWU7XG5cdFx0aWYocGwubGVuZ3RoID09IDIpe1xuXHRcdFx0bm9kZS5wcmVmaXggPSBwbFswXTtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcGxbMV07XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2VsLnByZWZpeCA9IG51bGw7XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuX2V4dGVuZHMoRG9jdW1lbnQsTm9kZSk7XG5cblxuZnVuY3Rpb24gRWxlbWVudCgpIHtcblx0dGhpcy5fbnNNYXAgPSB7fTtcbn07XG5FbGVtZW50LnByb3RvdHlwZSA9IHtcblx0bm9kZVR5cGUgOiBFTEVNRU5UX05PREUsXG5cdGhhc0F0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZU5vZGUobmFtZSkhPW51bGw7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpO1xuXHRcdHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5vZGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShuYW1lKTtcblx0fSxcblx0c2V0QXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSwgdmFsdWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSBcIlwiICsgdmFsdWU7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpXG5cdH0sXG5cdHJlbW92ZUF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpXG5cdFx0YXR0ciAmJiB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5vZGUoYXR0cik7XG5cdH0sXG5cdFxuXHQvL2ZvdXIgcmVhbCBvcGVhcnRpb24gbWV0aG9kXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHRpZihuZXdDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsbnVsbCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gX2FwcGVuZFNpbmdsZUNoaWxkKHRoaXMsbmV3Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0c2V0QXR0cmlidXRlTm9kZSA6IGZ1bmN0aW9uKG5ld0F0dHIpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKG5ld0F0dHIpO1xuXHR9LFxuXHRzZXRBdHRyaWJ1dGVOb2RlTlMgOiBmdW5jdGlvbihuZXdBdHRyKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbU5TKG5ld0F0dHIpO1xuXHR9LFxuXHRyZW1vdmVBdHRyaWJ1dGVOb2RlIDogZnVuY3Rpb24ob2xkQXR0cil7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzID09IG9sZEF0dHIub3duZXJFbGVtZW50KVxuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKG9sZEF0dHIubm9kZU5hbWUpO1xuXHR9LFxuXHQvL2dldCByZWFsIGF0dHJpYnV0ZSBuYW1lLGFuZCByZW1vdmUgaXQgYnkgcmVtb3ZlQXR0cmlidXRlTm9kZVxuXHRyZW1vdmVBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHR2YXIgb2xkID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdG9sZCAmJiB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5vZGUob2xkKTtcblx0fSxcblx0XG5cdGhhc0F0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkhPW51bGw7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lLCB2YWx1ZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcblx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSBcIlwiICsgdmFsdWU7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpXG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5vZGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKTtcblx0fSxcblx0XG5cdGdldEVsZW1lbnRzQnlUYWdOYW1lIDogZnVuY3Rpb24odGFnTmFtZSl7XG5cdFx0cmV0dXJuIG5ldyBMaXZlTm9kZUxpc3QodGhpcyxmdW5jdGlvbihiYXNlKXtcblx0XHRcdHZhciBscyA9IFtdO1xuXHRcdFx0X3Zpc2l0Tm9kZShiYXNlLGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0XHRpZihub2RlICE9PSBiYXNlICYmIG5vZGUubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFICYmICh0YWdOYW1lID09PSAnKicgfHwgbm9kZS50YWdOYW1lID09IHRhZ05hbWUpKXtcblx0XHRcdFx0XHRscy5wdXNoKG5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBscztcblx0XHR9KTtcblx0fSxcblx0Z2V0RWxlbWVudHNCeVRhZ05hbWVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHRyZXR1cm4gbmV3IExpdmVOb2RlTGlzdCh0aGlzLGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0dmFyIGxzID0gW107XG5cdFx0XHRfdmlzaXROb2RlKGJhc2UsZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRcdGlmKG5vZGUgIT09IGJhc2UgJiYgbm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFICYmIChuYW1lc3BhY2VVUkkgPT09ICcqJyB8fCBub2RlLm5hbWVzcGFjZVVSSSA9PT0gbmFtZXNwYWNlVVJJKSAmJiAobG9jYWxOYW1lID09PSAnKicgfHwgbm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lKSl7XG5cdFx0XHRcdFx0bHMucHVzaChub2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbHM7XG5cdFx0XHRcblx0XHR9KTtcblx0fVxufTtcbkRvY3VtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IEVsZW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lO1xuRG9jdW1lbnQucHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lTlMgPSBFbGVtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TO1xuXG5cbl9leHRlbmRzKEVsZW1lbnQsTm9kZSk7XG5mdW5jdGlvbiBBdHRyKCkge1xufTtcbkF0dHIucHJvdG90eXBlLm5vZGVUeXBlID0gQVRUUklCVVRFX05PREU7XG5fZXh0ZW5kcyhBdHRyLE5vZGUpO1xuXG5cbmZ1bmN0aW9uIENoYXJhY3RlckRhdGEoKSB7XG59O1xuQ2hhcmFjdGVyRGF0YS5wcm90b3R5cGUgPSB7XG5cdGRhdGEgOiAnJyxcblx0c3Vic3RyaW5nRGF0YSA6IGZ1bmN0aW9uKG9mZnNldCwgY291bnQpIHtcblx0XHRyZXR1cm4gdGhpcy5kYXRhLnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCtjb3VudCk7XG5cdH0sXG5cdGFwcGVuZERhdGE6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHR0ZXh0ID0gdGhpcy5kYXRhK3RleHQ7XG5cdFx0dGhpcy5ub2RlVmFsdWUgPSB0aGlzLmRhdGEgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdH0sXG5cdGluc2VydERhdGE6IGZ1bmN0aW9uKG9mZnNldCx0ZXh0KSB7XG5cdFx0dGhpcy5yZXBsYWNlRGF0YShvZmZzZXQsMCx0ZXh0KTtcblx0XG5cdH0sXG5cdGFwcGVuZENoaWxkOmZ1bmN0aW9uKG5ld0NoaWxkKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoRXhjZXB0aW9uTWVzc2FnZVtISUVSQVJDSFlfUkVRVUVTVF9FUlJdKVxuXHR9LFxuXHRkZWxldGVEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50KSB7XG5cdFx0dGhpcy5yZXBsYWNlRGF0YShvZmZzZXQsY291bnQsXCJcIik7XG5cdH0sXG5cdHJlcGxhY2VEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50LCB0ZXh0KSB7XG5cdFx0dmFyIHN0YXJ0ID0gdGhpcy5kYXRhLnN1YnN0cmluZygwLG9mZnNldCk7XG5cdFx0dmFyIGVuZCA9IHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0K2NvdW50KTtcblx0XHR0ZXh0ID0gc3RhcnQgKyB0ZXh0ICsgZW5kO1xuXHRcdHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHR9XG59XG5fZXh0ZW5kcyhDaGFyYWN0ZXJEYXRhLE5vZGUpO1xuZnVuY3Rpb24gVGV4dCgpIHtcbn07XG5UZXh0LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiN0ZXh0XCIsXG5cdG5vZGVUeXBlIDogVEVYVF9OT0RFLFxuXHRzcGxpdFRleHQgOiBmdW5jdGlvbihvZmZzZXQpIHtcblx0XHR2YXIgdGV4dCA9IHRoaXMuZGF0YTtcblx0XHR2YXIgbmV3VGV4dCA9IHRleHQuc3Vic3RyaW5nKG9mZnNldCk7XG5cdFx0dGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIG9mZnNldCk7XG5cdFx0dGhpcy5kYXRhID0gdGhpcy5ub2RlVmFsdWUgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0dmFyIG5ld05vZGUgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3VGV4dCk7XG5cdFx0aWYodGhpcy5wYXJlbnROb2RlKXtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgdGhpcy5uZXh0U2libGluZyk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdOb2RlO1xuXHR9XG59XG5fZXh0ZW5kcyhUZXh0LENoYXJhY3RlckRhdGEpO1xuZnVuY3Rpb24gQ29tbWVudCgpIHtcbn07XG5Db21tZW50LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjb21tZW50XCIsXG5cdG5vZGVUeXBlIDogQ09NTUVOVF9OT0RFXG59XG5fZXh0ZW5kcyhDb21tZW50LENoYXJhY3RlckRhdGEpO1xuXG5mdW5jdGlvbiBDREFUQVNlY3Rpb24oKSB7XG59O1xuQ0RBVEFTZWN0aW9uLnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjZGF0YS1zZWN0aW9uXCIsXG5cdG5vZGVUeXBlIDogQ0RBVEFfU0VDVElPTl9OT0RFXG59XG5fZXh0ZW5kcyhDREFUQVNlY3Rpb24sQ2hhcmFjdGVyRGF0YSk7XG5cblxuZnVuY3Rpb24gRG9jdW1lbnRUeXBlKCkge1xufTtcbkRvY3VtZW50VHlwZS5wcm90b3R5cGUubm9kZVR5cGUgPSBET0NVTUVOVF9UWVBFX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudFR5cGUsTm9kZSk7XG5cbmZ1bmN0aW9uIE5vdGF0aW9uKCkge1xufTtcbk5vdGF0aW9uLnByb3RvdHlwZS5ub2RlVHlwZSA9IE5PVEFUSU9OX05PREU7XG5fZXh0ZW5kcyhOb3RhdGlvbixOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5KCkge1xufTtcbkVudGl0eS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfTk9ERTtcbl9leHRlbmRzKEVudGl0eSxOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5UmVmZXJlbmNlKCkge1xufTtcbkVudGl0eVJlZmVyZW5jZS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfUkVGRVJFTkNFX05PREU7XG5fZXh0ZW5kcyhFbnRpdHlSZWZlcmVuY2UsTm9kZSk7XG5cbmZ1bmN0aW9uIERvY3VtZW50RnJhZ21lbnQoKSB7XG59O1xuRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUubm9kZU5hbWUgPVx0XCIjZG9jdW1lbnQtZnJhZ21lbnRcIjtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVUeXBlID1cdERPQ1VNRU5UX0ZSQUdNRU5UX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudEZyYWdtZW50LE5vZGUpO1xuXG5cbmZ1bmN0aW9uIFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpIHtcbn1cblByb2Nlc3NpbmdJbnN0cnVjdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU7XG5fZXh0ZW5kcyhQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sTm9kZSk7XG5mdW5jdGlvbiBYTUxTZXJpYWxpemVyKCl7fVxuWE1MU2VyaWFsaXplci5wcm90b3R5cGUuc2VyaWFsaXplVG9TdHJpbmcgPSBmdW5jdGlvbihub2RlLGlzSHRtbCxub2RlRmlsdGVyKXtcblx0cmV0dXJuIG5vZGVTZXJpYWxpemVUb1N0cmluZy5jYWxsKG5vZGUsaXNIdG1sLG5vZGVGaWx0ZXIpO1xufVxuTm9kZS5wcm90b3R5cGUudG9TdHJpbmcgPSBub2RlU2VyaWFsaXplVG9TdHJpbmc7XG5mdW5jdGlvbiBub2RlU2VyaWFsaXplVG9TdHJpbmcoaXNIdG1sLG5vZGVGaWx0ZXIpe1xuXHR2YXIgYnVmID0gW107XG5cdHZhciByZWZOb2RlID0gdGhpcy5ub2RlVHlwZSA9PSA5P3RoaXMuZG9jdW1lbnRFbGVtZW50OnRoaXM7XG5cdHZhciBwcmVmaXggPSByZWZOb2RlLnByZWZpeDtcblx0dmFyIHVyaSA9IHJlZk5vZGUubmFtZXNwYWNlVVJJO1xuXHRcblx0aWYodXJpICYmIHByZWZpeCA9PSBudWxsKXtcblx0XHQvL2NvbnNvbGUubG9nKHByZWZpeClcblx0XHR2YXIgcHJlZml4ID0gcmVmTm9kZS5sb29rdXBQcmVmaXgodXJpKTtcblx0XHRpZihwcmVmaXggPT0gbnVsbCl7XG5cdFx0XHQvL2lzSFRNTCA9IHRydWU7XG5cdFx0XHR2YXIgdmlzaWJsZU5hbWVzcGFjZXM9W1xuXHRcdFx0e25hbWVzcGFjZTp1cmkscHJlZml4Om51bGx9XG5cdFx0XHQvL3tuYW1lc3BhY2U6dXJpLHByZWZpeDonJ31cblx0XHRcdF1cblx0XHR9XG5cdH1cblx0c2VyaWFsaXplVG9TdHJpbmcodGhpcyxidWYsaXNIdG1sLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHQvL2NvbnNvbGUubG9nKCcjIyMnLHRoaXMubm9kZVR5cGUsdXJpLHByZWZpeCxidWYuam9pbignJykpXG5cdHJldHVybiBidWYuam9pbignJyk7XG59XG5mdW5jdGlvbiBuZWVkTmFtZXNwYWNlRGVmaW5lKG5vZGUsaXNIVE1MLCB2aXNpYmxlTmFtZXNwYWNlcykge1xuXHR2YXIgcHJlZml4ID0gbm9kZS5wcmVmaXh8fCcnO1xuXHR2YXIgdXJpID0gbm9kZS5uYW1lc3BhY2VVUkk7XG5cdGlmICghcHJlZml4ICYmICF1cmkpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAocHJlZml4ID09PSBcInhtbFwiICYmIHVyaSA9PT0gXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIiBcblx0XHR8fCB1cmkgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdFxuXHR2YXIgaSA9IHZpc2libGVOYW1lc3BhY2VzLmxlbmd0aCBcblx0Ly9jb25zb2xlLmxvZygnQEBAQCcsbm9kZS50YWdOYW1lLHByZWZpeCx1cmksdmlzaWJsZU5hbWVzcGFjZXMpXG5cdHdoaWxlIChpLS0pIHtcblx0XHR2YXIgbnMgPSB2aXNpYmxlTmFtZXNwYWNlc1tpXTtcblx0XHQvLyBnZXQgbmFtZXNwYWNlIHByZWZpeFxuXHRcdC8vY29uc29sZS5sb2cobm9kZS5ub2RlVHlwZSxub2RlLnRhZ05hbWUsbnMucHJlZml4LHByZWZpeClcblx0XHRpZiAobnMucHJlZml4ID09IHByZWZpeCl7XG5cdFx0XHRyZXR1cm4gbnMubmFtZXNwYWNlICE9IHVyaTtcblx0XHR9XG5cdH1cblx0Ly9jb25zb2xlLmxvZyhpc0hUTUwsdXJpLHByZWZpeD09JycpXG5cdC8vaWYoaXNIVE1MICYmIHByZWZpeCA9PW51bGwgJiYgdXJpID09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyl7XG5cdC8vXHRyZXR1cm4gZmFsc2U7XG5cdC8vfVxuXHQvL25vZGUuZmxhZyA9ICcxMTExMSdcblx0Ly9jb25zb2xlLmVycm9yKDMsdHJ1ZSxub2RlLmZsYWcsbm9kZS5wcmVmaXgsbm9kZS5uYW1lc3BhY2VVUkkpXG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplVG9TdHJpbmcobm9kZSxidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpe1xuXHRpZihub2RlRmlsdGVyKXtcblx0XHRub2RlID0gbm9kZUZpbHRlcihub2RlKTtcblx0XHRpZihub2RlKXtcblx0XHRcdGlmKHR5cGVvZiBub2RlID09ICdzdHJpbmcnKXtcblx0XHRcdFx0YnVmLnB1c2gobm9kZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly9idWYuc29ydC5hcHBseShhdHRycywgYXR0cmlidXRlU29ydGVyKTtcblx0fVxuXHRzd2l0Y2gobm9kZS5ub2RlVHlwZSl7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdGlmICghdmlzaWJsZU5hbWVzcGFjZXMpIHZpc2libGVOYW1lc3BhY2VzID0gW107XG5cdFx0dmFyIHN0YXJ0VmlzaWJsZU5hbWVzcGFjZXMgPSB2aXNpYmxlTmFtZXNwYWNlcy5sZW5ndGg7XG5cdFx0dmFyIGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXHRcdHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHZhciBub2RlTmFtZSA9IG5vZGUudGFnTmFtZTtcblx0XHRcblx0XHRpc0hUTUwgPSAgKGh0bWxucyA9PT0gbm9kZS5uYW1lc3BhY2VVUkkpIHx8aXNIVE1MIFxuXHRcdGJ1Zi5wdXNoKCc8Jyxub2RlTmFtZSk7XG5cdFx0XG5cdFx0XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdC8vIGFkZCBuYW1lc3BhY2VzIGZvciBhdHRyaWJ1dGVzXG5cdFx0XHR2YXIgYXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRpZiAoYXR0ci5wcmVmaXggPT0gJ3htbG5zJykge1xuXHRcdFx0XHR2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHsgcHJlZml4OiBhdHRyLmxvY2FsTmFtZSwgbmFtZXNwYWNlOiBhdHRyLnZhbHVlIH0pO1xuXHRcdFx0fWVsc2UgaWYoYXR0ci5ub2RlTmFtZSA9PSAneG1sbnMnKXtcblx0XHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogJycsIG5hbWVzcGFjZTogYXR0ci52YWx1ZSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdHZhciBhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdGlmIChuZWVkTmFtZXNwYWNlRGVmaW5lKGF0dHIsaXNIVE1MLCB2aXNpYmxlTmFtZXNwYWNlcykpIHtcblx0XHRcdFx0dmFyIHByZWZpeCA9IGF0dHIucHJlZml4fHwnJztcblx0XHRcdFx0dmFyIHVyaSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXHRcdFx0XHR2YXIgbnMgPSBwcmVmaXggPyAnIHhtbG5zOicgKyBwcmVmaXggOiBcIiB4bWxuc1wiO1xuXHRcdFx0XHRidWYucHVzaChucywgJz1cIicgLCB1cmkgLCAnXCInKTtcblx0XHRcdFx0dmlzaWJsZU5hbWVzcGFjZXMucHVzaCh7IHByZWZpeDogcHJlZml4LCBuYW1lc3BhY2U6dXJpIH0pO1xuXHRcdFx0fVxuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoYXR0cixidWYsaXNIVE1MLG5vZGVGaWx0ZXIsdmlzaWJsZU5hbWVzcGFjZXMpO1xuXHRcdH1cblx0XHQvLyBhZGQgbmFtZXNwYWNlIGZvciBjdXJyZW50IG5vZGVcdFx0XG5cdFx0aWYgKG5lZWROYW1lc3BhY2VEZWZpbmUobm9kZSxpc0hUTUwsIHZpc2libGVOYW1lc3BhY2VzKSkge1xuXHRcdFx0dmFyIHByZWZpeCA9IG5vZGUucHJlZml4fHwnJztcblx0XHRcdHZhciB1cmkgPSBub2RlLm5hbWVzcGFjZVVSSTtcblx0XHRcdHZhciBucyA9IHByZWZpeCA/ICcgeG1sbnM6JyArIHByZWZpeCA6IFwiIHhtbG5zXCI7XG5cdFx0XHRidWYucHVzaChucywgJz1cIicgLCB1cmkgLCAnXCInKTtcblx0XHRcdHZpc2libGVOYW1lc3BhY2VzLnB1c2goeyBwcmVmaXg6IHByZWZpeCwgbmFtZXNwYWNlOnVyaSB9KTtcblx0XHR9XG5cdFx0XG5cdFx0aWYoY2hpbGQgfHwgaXNIVE1MICYmICEvXig/Om1ldGF8bGlua3xpbWd8YnJ8aHJ8aW5wdXQpJC9pLnRlc3Qobm9kZU5hbWUpKXtcblx0XHRcdGJ1Zi5wdXNoKCc+Jyk7XG5cdFx0XHQvL2lmIGlzIGNkYXRhIGNoaWxkIG5vZGVcblx0XHRcdGlmKGlzSFRNTCAmJiAvXnNjcmlwdCQvaS50ZXN0KG5vZGVOYW1lKSl7XG5cdFx0XHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdFx0XHRpZihjaGlsZC5kYXRhKXtcblx0XHRcdFx0XHRcdGJ1Zi5wdXNoKGNoaWxkLmRhdGEpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoY2hpbGQsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2Vcblx0XHRcdHtcblx0XHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zixpc0hUTUwsbm9kZUZpbHRlcix2aXNpYmxlTmFtZXNwYWNlcyk7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goJzwvJyxub2RlTmFtZSwnPicpO1xuXHRcdH1lbHNle1xuXHRcdFx0YnVmLnB1c2goJy8+Jyk7XG5cdFx0fVxuXHRcdC8vIHJlbW92ZSBhZGRlZCB2aXNpYmxlIG5hbWVzcGFjZXNcblx0XHQvL3Zpc2libGVOYW1lc3BhY2VzLmxlbmd0aCA9IHN0YXJ0VmlzaWJsZU5hbWVzcGFjZXM7XG5cdFx0cmV0dXJuO1xuXHRjYXNlIERPQ1VNRU5UX05PREU6XG5cdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0c2VyaWFsaXplVG9TdHJpbmcoY2hpbGQsYnVmLGlzSFRNTCxub2RlRmlsdGVyLHZpc2libGVOYW1lc3BhY2VzKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHRcdHJldHVybjtcblx0Y2FzZSBBVFRSSUJVVEVfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goJyAnLG5vZGUubmFtZSwnPVwiJyxub2RlLnZhbHVlLnJlcGxhY2UoL1s8JlwiXS9nLF94bWxFbmNvZGVyKSwnXCInKTtcblx0Y2FzZSBURVhUX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKG5vZGUuZGF0YS5yZXBsYWNlKC9bPCZdL2csX3htbEVuY29kZXIpKTtcblx0Y2FzZSBDREFUQV9TRUNUSU9OX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCAnPCFbQ0RBVEFbJyxub2RlLmRhdGEsJ11dPicpO1xuXHRjYXNlIENPTU1FTlRfTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goIFwiPCEtLVwiLG5vZGUuZGF0YSxcIi0tPlwiKTtcblx0Y2FzZSBET0NVTUVOVF9UWVBFX05PREU6XG5cdFx0dmFyIHB1YmlkID0gbm9kZS5wdWJsaWNJZDtcblx0XHR2YXIgc3lzaWQgPSBub2RlLnN5c3RlbUlkO1xuXHRcdGJ1Zi5wdXNoKCc8IURPQ1RZUEUgJyxub2RlLm5hbWUpO1xuXHRcdGlmKHB1YmlkKXtcblx0XHRcdGJ1Zi5wdXNoKCcgUFVCTElDIFwiJyxwdWJpZCk7XG5cdFx0XHRpZiAoc3lzaWQgJiYgc3lzaWQhPScuJykge1xuXHRcdFx0XHRidWYucHVzaCggJ1wiIFwiJyxzeXNpZCk7XG5cdFx0XHR9XG5cdFx0XHRidWYucHVzaCgnXCI+Jyk7XG5cdFx0fWVsc2UgaWYoc3lzaWQgJiYgc3lzaWQhPScuJyl7XG5cdFx0XHRidWYucHVzaCgnIFNZU1RFTSBcIicsc3lzaWQsJ1wiPicpO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHN1YiA9IG5vZGUuaW50ZXJuYWxTdWJzZXQ7XG5cdFx0XHRpZihzdWIpe1xuXHRcdFx0XHRidWYucHVzaChcIiBbXCIsc3ViLFwiXVwiKTtcblx0XHRcdH1cblx0XHRcdGJ1Zi5wdXNoKFwiPlwiKTtcblx0XHR9XG5cdFx0cmV0dXJuO1xuXHRjYXNlIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTpcblx0XHRyZXR1cm4gYnVmLnB1c2goIFwiPD9cIixub2RlLnRhcmdldCxcIiBcIixub2RlLmRhdGEsXCI/PlwiKTtcblx0Y2FzZSBFTlRJVFlfUkVGRVJFTkNFX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCAnJicsbm9kZS5ub2RlTmFtZSwnOycpO1xuXHQvL2Nhc2UgRU5USVRZX05PREU6XG5cdC8vY2FzZSBOT1RBVElPTl9OT0RFOlxuXHRkZWZhdWx0OlxuXHRcdGJ1Zi5wdXNoKCc/Pycsbm9kZS5ub2RlTmFtZSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGltcG9ydE5vZGUoZG9jLG5vZGUsZGVlcCl7XG5cdHZhciBub2RlMjtcblx0c3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdG5vZGUyID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpO1xuXHRcdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdFx0Ly92YXIgYXR0cnMgPSBub2RlMi5hdHRyaWJ1dGVzO1xuXHRcdC8vdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcblx0XHQvL2Zvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHQvL25vZGUyLnNldEF0dHJpYnV0ZU5vZGVOUyhpbXBvcnROb2RlKGRvYyxhdHRycy5pdGVtKGkpLGRlZXApKTtcblx0XHQvL31cblx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdGJyZWFrO1xuXHRjYXNlIEFUVFJJQlVURV9OT0RFOlxuXHRcdGRlZXAgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXHQvL2Nhc2UgRU5USVRZX1JFRkVSRU5DRV9OT0RFOlxuXHQvL2Nhc2UgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFOlxuXHQvLy8vY2FzZSBURVhUX05PREU6XG5cdC8vY2FzZSBDREFUQV9TRUNUSU9OX05PREU6XG5cdC8vY2FzZSBDT01NRU5UX05PREU6XG5cdC8vXHRkZWVwID0gZmFsc2U7XG5cdC8vXHRicmVhaztcblx0Ly9jYXNlIERPQ1VNRU5UX05PREU6XG5cdC8vY2FzZSBET0NVTUVOVF9UWVBFX05PREU6XG5cdC8vY2Fubm90IGJlIGltcG9ydGVkLlxuXHQvL2Nhc2UgRU5USVRZX05PREU6XG5cdC8vY2FzZSBOT1RBVElPTl9OT0RF77yaXG5cdC8vY2FuIG5vdCBoaXQgaW4gbGV2ZWwzXG5cdC8vZGVmYXVsdDp0aHJvdyBlO1xuXHR9XG5cdGlmKCFub2RlMil7XG5cdFx0bm9kZTIgPSBub2RlLmNsb25lTm9kZShmYWxzZSk7Ly9mYWxzZVxuXHR9XG5cdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdG5vZGUyLnBhcmVudE5vZGUgPSBudWxsO1xuXHRpZihkZWVwKXtcblx0XHR2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0bm9kZTIuYXBwZW5kQ2hpbGQoaW1wb3J0Tm9kZShkb2MsY2hpbGQsZGVlcCkpO1xuXHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGUyO1xufVxuLy9cbi8vdmFyIF9yZWxhdGlvbk1hcCA9IHtmaXJzdENoaWxkOjEsbGFzdENoaWxkOjEscHJldmlvdXNTaWJsaW5nOjEsbmV4dFNpYmxpbmc6MSxcbi8vXHRcdFx0XHRcdGF0dHJpYnV0ZXM6MSxjaGlsZE5vZGVzOjEscGFyZW50Tm9kZToxLGRvY3VtZW50RWxlbWVudDoxLGRvY3R5cGUsfTtcbmZ1bmN0aW9uIGNsb25lTm9kZShkb2Msbm9kZSxkZWVwKXtcblx0dmFyIG5vZGUyID0gbmV3IG5vZGUuY29uc3RydWN0b3IoKTtcblx0Zm9yKHZhciBuIGluIG5vZGUpe1xuXHRcdHZhciB2ID0gbm9kZVtuXTtcblx0XHRpZih0eXBlb2YgdiAhPSAnb2JqZWN0JyApe1xuXHRcdFx0aWYodiAhPSBub2RlMltuXSl7XG5cdFx0XHRcdG5vZGUyW25dID0gdjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYobm9kZS5jaGlsZE5vZGVzKXtcblx0XHRub2RlMi5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdH1cblx0bm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblx0c3dpdGNoIChub2RlMi5ub2RlVHlwZSkge1xuXHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHR2YXIgYXR0cnNcdD0gbm9kZS5hdHRyaWJ1dGVzO1xuXHRcdHZhciBhdHRyczJcdD0gbm9kZTIuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHR2YXIgbGVuID0gYXR0cnMubGVuZ3RoXG5cdFx0YXR0cnMyLl9vd25lckVsZW1lbnQgPSBub2RlMjtcblx0XHRmb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0bm9kZTIuc2V0QXR0cmlidXRlTm9kZShjbG9uZU5vZGUoZG9jLGF0dHJzLml0ZW0oaSksdHJ1ZSkpO1xuXHRcdH1cblx0XHRicmVhazs7XG5cdGNhc2UgQVRUUklCVVRFX05PREU6XG5cdFx0ZGVlcCA9IHRydWU7XG5cdH1cblx0aWYoZGVlcCl7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdG5vZGUyLmFwcGVuZENoaWxkKGNsb25lTm9kZShkb2MsY2hpbGQsZGVlcCkpO1xuXHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGUyO1xufVxuXG5mdW5jdGlvbiBfX3NldF9fKG9iamVjdCxrZXksdmFsdWUpe1xuXHRvYmplY3Rba2V5XSA9IHZhbHVlXG59XG4vL2RvIGR5bmFtaWNcbnRyeXtcblx0aWYoT2JqZWN0LmRlZmluZVByb3BlcnR5KXtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoTGl2ZU5vZGVMaXN0LnByb3RvdHlwZSwnbGVuZ3RoJyx7XG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0X3VwZGF0ZUxpdmVMaXN0KHRoaXMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kJGxlbmd0aDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsJ3RleHRDb250ZW50Jyx7XG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIGdldFRleHRDb250ZW50KHRoaXMpO1xuXHRcdFx0fSxcblx0XHRcdHNldDpmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0c3dpdGNoKHRoaXMubm9kZVR5cGUpe1xuXHRcdFx0XHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRcdFx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdFx0XHRcdHdoaWxlKHRoaXMuZmlyc3RDaGlsZCl7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGRhdGEgfHwgU3RyaW5nKGRhdGEpKXtcblx0XHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9UT0RPOlxuXHRcdFx0XHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IGRhdGE7XG5cdFx0XHRcdFx0dGhpcy5ub2RlVmFsdWUgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRcblx0XHRmdW5jdGlvbiBnZXRUZXh0Q29udGVudChub2RlKXtcblx0XHRcdHN3aXRjaChub2RlLm5vZGVUeXBlKXtcblx0XHRcdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdFx0Y2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuXHRcdFx0XHR2YXIgYnVmID0gW107XG5cdFx0XHRcdG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0XHRcdHdoaWxlKG5vZGUpe1xuXHRcdFx0XHRcdGlmKG5vZGUubm9kZVR5cGUhPT03ICYmIG5vZGUubm9kZVR5cGUgIT09OCl7XG5cdFx0XHRcdFx0XHRidWYucHVzaChnZXRUZXh0Q29udGVudChub2RlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBidWYuam9pbignJyk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9fc2V0X18gPSBmdW5jdGlvbihvYmplY3Qsa2V5LHZhbHVlKXtcblx0XHRcdC8vY29uc29sZS5sb2codmFsdWUpXG5cdFx0XHRvYmplY3RbJyQkJytrZXldID0gdmFsdWVcblx0XHR9XG5cdH1cbn1jYXRjaChlKXsvL2llOFxufVxuXG4vL2lmKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpe1xuXHRleHBvcnRzLkRPTUltcGxlbWVudGF0aW9uID0gRE9NSW1wbGVtZW50YXRpb247XG5cdGV4cG9ydHMuWE1MU2VyaWFsaXplciA9IFhNTFNlcmlhbGl6ZXI7XG4vL31cbiIsIi8vWzRdICAgXHROYW1lU3RhcnRDaGFyXHQgICA6Oj0gICBcdFwiOlwiIHwgW0EtWl0gfCBcIl9cIiB8IFthLXpdIHwgWyN4QzAtI3hENl0gfCBbI3hEOC0jeEY2XSB8IFsjeEY4LSN4MkZGXSB8IFsjeDM3MC0jeDM3RF0gfCBbI3gzN0YtI3gxRkZGXSB8IFsjeDIwMEMtI3gyMDBEXSB8IFsjeDIwNzAtI3gyMThGXSB8IFsjeDJDMDAtI3gyRkVGXSB8IFsjeDMwMDEtI3hEN0ZGXSB8IFsjeEY5MDAtI3hGRENGXSB8IFsjeEZERjAtI3hGRkZEXSB8IFsjeDEwMDAwLSN4RUZGRkZdXHJcbi8vWzRhXSAgIFx0TmFtZUNoYXJcdCAgIDo6PSAgIFx0TmFtZVN0YXJ0Q2hhciB8IFwiLVwiIHwgXCIuXCIgfCBbMC05XSB8ICN4QjcgfCBbI3gwMzAwLSN4MDM2Rl0gfCBbI3gyMDNGLSN4MjA0MF1cclxuLy9bNV0gICBcdE5hbWVcdCAgIDo6PSAgIFx0TmFtZVN0YXJ0Q2hhciAoTmFtZUNoYXIpKlxyXG52YXIgbmFtZVN0YXJ0Q2hhciA9IC9bQS1aX2EtelxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdLy8vXFx1MTAwMDAtXFx1RUZGRkZcclxudmFyIG5hbWVDaGFyID0gbmV3IFJlZ0V4cChcIltcXFxcLVxcXFwuMC05XCIrbmFtZVN0YXJ0Q2hhci5zb3VyY2Uuc2xpY2UoMSwtMSkrXCJcXFxcdTAwQjdcXFxcdTAzMDAtXFxcXHUwMzZGXFxcXHUyMDNGLVxcXFx1MjA0MF1cIik7XHJcbnZhciB0YWdOYW1lUGF0dGVybiA9IG5ldyBSZWdFeHAoJ14nK25hbWVTdGFydENoYXIuc291cmNlK25hbWVDaGFyLnNvdXJjZSsnKig/OlxcOicrbmFtZVN0YXJ0Q2hhci5zb3VyY2UrbmFtZUNoYXIuc291cmNlKycqKT8kJyk7XHJcbi8vdmFyIHRhZ05hbWVQYXR0ZXJuID0gL15bYS16QS1aX11bXFx3XFwtXFwuXSooPzpcXDpbYS16QS1aX11bXFx3XFwtXFwuXSopPyQvXHJcbi8vdmFyIGhhbmRsZXJzID0gJ3Jlc29sdmVFbnRpdHksZ2V0RXh0ZXJuYWxTdWJzZXQsY2hhcmFjdGVycyxlbmREb2N1bWVudCxlbmRFbGVtZW50LGVuZFByZWZpeE1hcHBpbmcsaWdub3JhYmxlV2hpdGVzcGFjZSxwcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sc2V0RG9jdW1lbnRMb2NhdG9yLHNraXBwZWRFbnRpdHksc3RhcnREb2N1bWVudCxzdGFydEVsZW1lbnQsc3RhcnRQcmVmaXhNYXBwaW5nLG5vdGF0aW9uRGVjbCx1bnBhcnNlZEVudGl0eURlY2wsZXJyb3IsZmF0YWxFcnJvcix3YXJuaW5nLGF0dHJpYnV0ZURlY2wsZWxlbWVudERlY2wsZXh0ZXJuYWxFbnRpdHlEZWNsLGludGVybmFsRW50aXR5RGVjbCxjb21tZW50LGVuZENEQVRBLGVuZERURCxlbmRFbnRpdHksc3RhcnRDREFUQSxzdGFydERURCxzdGFydEVudGl0eScuc3BsaXQoJywnKVxyXG5cclxuLy9TX1RBRyxcdFNfQVRUUixcdFNfRVEsXHRTX0FUVFJfTk9RVU9UX1ZBTFVFXHJcbi8vU19BVFRSX1NQQUNFLFx0U19BVFRSX0VORCxcdFNfVEFHX1NQQUNFLCBTX1RBR19DTE9TRVxyXG52YXIgU19UQUcgPSAwOy8vdGFnIG5hbWUgb2ZmZXJyaW5nXHJcbnZhciBTX0FUVFIgPSAxOy8vYXR0ciBuYW1lIG9mZmVycmluZyBcclxudmFyIFNfQVRUUl9TUEFDRT0yOy8vYXR0ciBuYW1lIGVuZCBhbmQgc3BhY2Ugb2ZmZXJcclxudmFyIFNfRVEgPSAzOy8vPXNwYWNlP1xyXG52YXIgU19BVFRSX05PUVVPVF9WQUxVRSA9IDQ7Ly9hdHRyIHZhbHVlKG5vIHF1b3QgdmFsdWUgb25seSlcclxudmFyIFNfQVRUUl9FTkQgPSA1Oy8vYXR0ciB2YWx1ZSBlbmQgYW5kIG5vIHNwYWNlKHF1b3QgZW5kKVxyXG52YXIgU19UQUdfU1BBQ0UgPSA2Oy8vKGF0dHIgdmFsdWUgZW5kIHx8IHRhZyBlbmQgKSAmJiAoc3BhY2Ugb2ZmZXIpXHJcbnZhciBTX1RBR19DTE9TRSA9IDc7Ly9jbG9zZWQgZWw8ZWwgLz5cclxuXHJcbmZ1bmN0aW9uIFhNTFJlYWRlcigpe1xyXG5cdFxyXG59XHJcblxyXG5YTUxSZWFkZXIucHJvdG90eXBlID0ge1xyXG5cdHBhcnNlOmZ1bmN0aW9uKHNvdXJjZSxkZWZhdWx0TlNNYXAsZW50aXR5TWFwKXtcclxuXHRcdHZhciBkb21CdWlsZGVyID0gdGhpcy5kb21CdWlsZGVyO1xyXG5cdFx0ZG9tQnVpbGRlci5zdGFydERvY3VtZW50KCk7XHJcblx0XHRfY29weShkZWZhdWx0TlNNYXAgLGRlZmF1bHROU01hcCA9IHt9KVxyXG5cdFx0cGFyc2Uoc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXAsXHJcblx0XHRcdFx0ZG9tQnVpbGRlcix0aGlzLmVycm9ySGFuZGxlcik7XHJcblx0XHRkb21CdWlsZGVyLmVuZERvY3VtZW50KCk7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHNvdXJjZSxkZWZhdWx0TlNNYXBDb3B5LGVudGl0eU1hcCxkb21CdWlsZGVyLGVycm9ySGFuZGxlcil7XHJcblx0ZnVuY3Rpb24gZml4ZWRGcm9tQ2hhckNvZGUoY29kZSkge1xyXG5cdFx0Ly8gU3RyaW5nLnByb3RvdHlwZS5mcm9tQ2hhckNvZGUgZG9lcyBub3Qgc3VwcG9ydHNcclxuXHRcdC8vID4gMiBieXRlcyB1bmljb2RlIGNoYXJzIGRpcmVjdGx5XHJcblx0XHRpZiAoY29kZSA+IDB4ZmZmZikge1xyXG5cdFx0XHRjb2RlIC09IDB4MTAwMDA7XHJcblx0XHRcdHZhciBzdXJyb2dhdGUxID0gMHhkODAwICsgKGNvZGUgPj4gMTApXHJcblx0XHRcdFx0LCBzdXJyb2dhdGUyID0gMHhkYzAwICsgKGNvZGUgJiAweDNmZik7XHJcblxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdXJyb2dhdGUxLCBzdXJyb2dhdGUyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBlbnRpdHlSZXBsYWNlcihhKXtcclxuXHRcdHZhciBrID0gYS5zbGljZSgxLC0xKTtcclxuXHRcdGlmKGsgaW4gZW50aXR5TWFwKXtcclxuXHRcdFx0cmV0dXJuIGVudGl0eU1hcFtrXTsgXHJcblx0XHR9ZWxzZSBpZihrLmNoYXJBdCgwKSA9PT0gJyMnKXtcclxuXHRcdFx0cmV0dXJuIGZpeGVkRnJvbUNoYXJDb2RlKHBhcnNlSW50KGsuc3Vic3RyKDEpLnJlcGxhY2UoJ3gnLCcweCcpKSlcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ2VudGl0eSBub3QgZm91bmQ6JythKTtcclxuXHRcdFx0cmV0dXJuIGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFwcGVuZFRleHQoZW5kKXsvL2hhcyBzb21lIGJ1Z3NcclxuXHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdHZhciB4dCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0bG9jYXRvciYmcG9zaXRpb24oc3RhcnQpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnMoeHQsMCxlbmQtc3RhcnQpO1xyXG5cdFx0XHRzdGFydCA9IGVuZFxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBwb3NpdGlvbihwLG0pe1xyXG5cdFx0d2hpbGUocD49bGluZUVuZCAmJiAobSA9IGxpbmVQYXR0ZXJuLmV4ZWMoc291cmNlKSkpe1xyXG5cdFx0XHRsaW5lU3RhcnQgPSBtLmluZGV4O1xyXG5cdFx0XHRsaW5lRW5kID0gbGluZVN0YXJ0ICsgbVswXS5sZW5ndGg7XHJcblx0XHRcdGxvY2F0b3IubGluZU51bWJlcisrO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdsaW5lKys6Jyxsb2NhdG9yLHN0YXJ0UG9zLGVuZFBvcylcclxuXHRcdH1cclxuXHRcdGxvY2F0b3IuY29sdW1uTnVtYmVyID0gcC1saW5lU3RhcnQrMTtcclxuXHR9XHJcblx0dmFyIGxpbmVTdGFydCA9IDA7XHJcblx0dmFyIGxpbmVFbmQgPSAwO1xyXG5cdHZhciBsaW5lUGF0dGVybiA9IC8uKig/Olxcclxcbj98XFxuKXwuKiQvZ1xyXG5cdHZhciBsb2NhdG9yID0gZG9tQnVpbGRlci5sb2NhdG9yO1xyXG5cdFxyXG5cdHZhciBwYXJzZVN0YWNrID0gW3tjdXJyZW50TlNNYXA6ZGVmYXVsdE5TTWFwQ29weX1dXHJcblx0dmFyIGNsb3NlTWFwID0ge307XHJcblx0dmFyIHN0YXJ0ID0gMDtcclxuXHR3aGlsZSh0cnVlKXtcclxuXHRcdHRyeXtcclxuXHRcdFx0dmFyIHRhZ1N0YXJ0ID0gc291cmNlLmluZGV4T2YoJzwnLHN0YXJ0KTtcclxuXHRcdFx0aWYodGFnU3RhcnQ8MCl7XHJcblx0XHRcdFx0aWYoIXNvdXJjZS5zdWJzdHIoc3RhcnQpLm1hdGNoKC9eXFxzKiQvKSl7XHJcblx0XHRcdFx0XHR2YXIgZG9jID0gZG9tQnVpbGRlci5kb2M7XHJcblx0ICAgIFx0XHRcdHZhciB0ZXh0ID0gZG9jLmNyZWF0ZVRleHROb2RlKHNvdXJjZS5zdWJzdHIoc3RhcnQpKTtcclxuXHQgICAgXHRcdFx0ZG9jLmFwcGVuZENoaWxkKHRleHQpO1xyXG5cdCAgICBcdFx0XHRkb21CdWlsZGVyLmN1cnJlbnRFbGVtZW50ID0gdGV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRhZ1N0YXJ0PnN0YXJ0KXtcclxuXHRcdFx0XHRhcHBlbmRUZXh0KHRhZ1N0YXJ0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzd2l0Y2goc291cmNlLmNoYXJBdCh0YWdTdGFydCsxKSl7XHJcblx0XHRcdGNhc2UgJy8nOlxyXG5cdFx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignPicsdGFnU3RhcnQrMyk7XHJcblx0XHRcdFx0dmFyIHRhZ05hbWUgPSBzb3VyY2Uuc3Vic3RyaW5nKHRhZ1N0YXJ0KzIsZW5kKTtcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gcGFyc2VTdGFjay5wb3AoKTtcclxuXHRcdFx0XHRpZihlbmQ8MCl7XHJcblx0XHRcdFx0XHRcclxuXHQgICAgICAgIFx0XHR0YWdOYW1lID0gc291cmNlLnN1YnN0cmluZyh0YWdTdGFydCsyKS5yZXBsYWNlKC9bXFxzPF0uKi8sJycpO1xyXG5cdCAgICAgICAgXHRcdC8vY29uc29sZS5lcnJvcignI0BAQEBAQCcrdGFnTmFtZSlcclxuXHQgICAgICAgIFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoXCJlbmQgdGFnIG5hbWU6IFwiK3RhZ05hbWUrJyBpcyBub3QgY29tcGxldGU6Jytjb25maWcudGFnTmFtZSk7XHJcblx0ICAgICAgICBcdFx0ZW5kID0gdGFnU3RhcnQrMSt0YWdOYW1lLmxlbmd0aDtcclxuXHQgICAgICAgIFx0fWVsc2UgaWYodGFnTmFtZS5tYXRjaCgvXFxzPC8pKXtcclxuXHQgICAgICAgIFx0XHR0YWdOYW1lID0gdGFnTmFtZS5yZXBsYWNlKC9bXFxzPF0uKi8sJycpO1xyXG5cdCAgICAgICAgXHRcdGVycm9ySGFuZGxlci5lcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIG1heWJlIG5vdCBjb21wbGV0ZScpO1xyXG5cdCAgICAgICAgXHRcdGVuZCA9IHRhZ1N0YXJ0KzErdGFnTmFtZS5sZW5ndGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihwYXJzZVN0YWNrLmxlbmd0aCxwYXJzZVN0YWNrKVxyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihjb25maWcpO1xyXG5cdFx0XHRcdHZhciBsb2NhbE5TTWFwID0gY29uZmlnLmxvY2FsTlNNYXA7XHJcblx0XHRcdFx0dmFyIGVuZE1hdGNoID0gY29uZmlnLnRhZ05hbWUgPT0gdGFnTmFtZTtcclxuXHRcdFx0XHR2YXIgZW5kSWdub3JlQ2FzZU1hY2ggPSBlbmRNYXRjaCB8fCBjb25maWcudGFnTmFtZSYmY29uZmlnLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSB0YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuXHRcdCAgICAgICAgaWYoZW5kSWdub3JlQ2FzZU1hY2gpe1xyXG5cdFx0ICAgICAgICBcdGRvbUJ1aWxkZXIuZW5kRWxlbWVudChjb25maWcudXJpLGNvbmZpZy5sb2NhbE5hbWUsdGFnTmFtZSk7XHJcblx0XHRcdFx0XHRpZihsb2NhbE5TTWFwKXtcclxuXHRcdFx0XHRcdFx0Zm9yKHZhciBwcmVmaXggaW4gbG9jYWxOU01hcCl7XHJcblx0XHRcdFx0XHRcdFx0ZG9tQnVpbGRlci5lbmRQcmVmaXhNYXBwaW5nKHByZWZpeCkgO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZighZW5kTWF0Y2gpe1xyXG5cdFx0ICAgICAgICAgICAgXHRlcnJvckhhbmRsZXIuZmF0YWxFcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIGlzIG5vdCBtYXRjaCB0aGUgY3VycmVudCBzdGFydCB0YWdOYW1lOicrY29uZmlnLnRhZ05hbWUgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdCAgICAgICAgfWVsc2V7XHJcblx0XHQgICAgICAgIFx0cGFyc2VTdGFjay5wdXNoKGNvbmZpZylcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGVuZCsrO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdC8vIGVuZCBlbG1lbnRcclxuXHRcdFx0Y2FzZSAnPyc6Ly8gPD8uLi4/PlxyXG5cdFx0XHRcdGxvY2F0b3ImJnBvc2l0aW9uKHRhZ1N0YXJ0KTtcclxuXHRcdFx0XHRlbmQgPSBwYXJzZUluc3RydWN0aW9uKHNvdXJjZSx0YWdTdGFydCxkb21CdWlsZGVyKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnISc6Ly8gPCFkb2N0eXBlLDwhW0NEQVRBLDwhLS1cclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbih0YWdTdGFydCk7XHJcblx0XHRcdFx0ZW5kID0gcGFyc2VEQ0Moc291cmNlLHRhZ1N0YXJ0LGRvbUJ1aWxkZXIsZXJyb3JIYW5kbGVyKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbih0YWdTdGFydCk7XHJcblx0XHRcdFx0dmFyIGVsID0gbmV3IEVsZW1lbnRBdHRyaWJ1dGVzKCk7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnROU01hcCA9IHBhcnNlU3RhY2tbcGFyc2VTdGFjay5sZW5ndGgtMV0uY3VycmVudE5TTWFwO1xyXG5cdFx0XHRcdC8vZWxTdGFydEVuZFxyXG5cdFx0XHRcdHZhciBlbmQgPSBwYXJzZUVsZW1lbnRTdGFydFBhcnQoc291cmNlLHRhZ1N0YXJ0LGVsLGN1cnJlbnROU01hcCxlbnRpdHlSZXBsYWNlcixlcnJvckhhbmRsZXIpO1xyXG5cdFx0XHRcdHZhciBsZW4gPSBlbC5sZW5ndGg7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIWVsLmNsb3NlZCAmJiBmaXhTZWxmQ2xvc2VkKHNvdXJjZSxlbmQsZWwudGFnTmFtZSxjbG9zZU1hcCkpe1xyXG5cdFx0XHRcdFx0ZWwuY2xvc2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGlmKCFlbnRpdHlNYXAubmJzcCl7XHJcblx0XHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCd1bmNsb3NlZCB4bWwgYXR0cmlidXRlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvY2F0b3IgJiYgbGVuKXtcclxuXHRcdFx0XHRcdHZhciBsb2NhdG9yMiA9IGNvcHlMb2NhdG9yKGxvY2F0b3Ise30pO1xyXG5cdFx0XHRcdFx0Ly90cnl7Ly9hdHRyaWJ1dGUgcG9zaXRpb24gZml4ZWRcclxuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7aTxsZW47aSsrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGEgPSBlbFtpXTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb24oYS5vZmZzZXQpO1xyXG5cdFx0XHRcdFx0XHRhLmxvY2F0b3IgPSBjb3B5TG9jYXRvcihsb2NhdG9yLHt9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoJ0BAQEBAJytlKX1cclxuXHRcdFx0XHRcdGRvbUJ1aWxkZXIubG9jYXRvciA9IGxvY2F0b3IyXHJcblx0XHRcdFx0XHRpZihhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKSl7XHJcblx0XHRcdFx0XHRcdHBhcnNlU3RhY2sucHVzaChlbClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRvbUJ1aWxkZXIubG9jYXRvciA9IGxvY2F0b3I7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZihhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKSl7XHJcblx0XHRcdFx0XHRcdHBhcnNlU3RhY2sucHVzaChlbClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoZWwudXJpID09PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgJiYgIWVsLmNsb3NlZCl7XHJcblx0XHRcdFx0XHRlbmQgPSBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsZW5kLGVsLnRhZ05hbWUsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcilcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGVuZCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fWNhdGNoKGUpe1xyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ2VsZW1lbnQgcGFyc2UgZXJyb3I6ICcrZSlcclxuXHRcdFx0Ly9lcnJvckhhbmRsZXIuZXJyb3IoJ2VsZW1lbnQgcGFyc2UgZXJyb3I6ICcrZSk7XHJcblx0XHRcdGVuZCA9IC0xO1xyXG5cdFx0XHQvL3Rocm93IGU7XHJcblx0XHR9XHJcblx0XHRpZihlbmQ+c3RhcnQpe1xyXG5cdFx0XHRzdGFydCA9IGVuZDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQvL1RPRE86IOi/memHjOacieWPr+iDvXNheOWbnumAgO+8jOacieS9jee9rumUmeivr+mjjumZqVxyXG5cdFx0XHRhcHBlbmRUZXh0KE1hdGgubWF4KHRhZ1N0YXJ0LHN0YXJ0KSsxKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gY29weUxvY2F0b3IoZix0KXtcclxuXHR0LmxpbmVOdW1iZXIgPSBmLmxpbmVOdW1iZXI7XHJcblx0dC5jb2x1bW5OdW1iZXIgPSBmLmNvbHVtbk51bWJlcjtcclxuXHRyZXR1cm4gdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBzZWUgI2FwcGVuZEVsZW1lbnQoc291cmNlLGVsU3RhcnRFbmQsZWwsc2VsZkNsb3NlZCxlbnRpdHlSZXBsYWNlcixkb21CdWlsZGVyLHBhcnNlU3RhY2spO1xyXG4gKiBAcmV0dXJuIGVuZCBvZiB0aGUgZWxlbWVudFN0YXJ0UGFydChlbmQgb2YgZWxlbWVudEVuZFBhcnQgZm9yIHNlbGZDbG9zZWQgZWwpXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZUVsZW1lbnRTdGFydFBhcnQoc291cmNlLHN0YXJ0LGVsLGN1cnJlbnROU01hcCxlbnRpdHlSZXBsYWNlcixlcnJvckhhbmRsZXIpe1xyXG5cdHZhciBhdHRyTmFtZTtcclxuXHR2YXIgdmFsdWU7XHJcblx0dmFyIHAgPSArK3N0YXJ0O1xyXG5cdHZhciBzID0gU19UQUc7Ly9zdGF0dXNcclxuXHR3aGlsZSh0cnVlKXtcclxuXHRcdHZhciBjID0gc291cmNlLmNoYXJBdChwKTtcclxuXHRcdHN3aXRjaChjKXtcclxuXHRcdGNhc2UgJz0nOlxyXG5cdFx0XHRpZihzID09PSBTX0FUVFIpey8vYXR0ck5hbWVcclxuXHRcdFx0XHRhdHRyTmFtZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKTtcclxuXHRcdFx0XHRzID0gU19FUTtcclxuXHRcdFx0fWVsc2UgaWYocyA9PT0gU19BVFRSX1NQQUNFKXtcclxuXHRcdFx0XHRzID0gU19FUTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly9mYXRhbEVycm9yOiBlcXVhbCBtdXN0IGFmdGVyIGF0dHJOYW1lIG9yIHNwYWNlIGFmdGVyIGF0dHJOYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgZXF1YWwgbXVzdCBhZnRlciBhdHRyTmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnXFwnJzpcclxuXHRcdGNhc2UgJ1wiJzpcclxuXHRcdFx0aWYocyA9PT0gU19FUSB8fCBzID09PSBTX0FUVFIgLy98fCBzID09IFNfQVRUUl9TUEFDRVxyXG5cdFx0XHRcdCl7Ly9lcXVhbFxyXG5cdFx0XHRcdGlmKHMgPT09IFNfQVRUUil7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIHZhbHVlIG11c3QgYWZ0ZXIgXCI9XCInKVxyXG5cdFx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RhcnQgPSBwKzE7XHJcblx0XHRcdFx0cCA9IHNvdXJjZS5pbmRleE9mKGMsc3RhcnQpXHJcblx0XHRcdFx0aWYocD4wKXtcclxuXHRcdFx0XHRcdHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLHN0YXJ0LTEpO1xyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUl9FTkQ7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvL2ZhdGFsRXJyb3I6IG5vIGVuZCBxdW90IG1hdGNoXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBubyBlbmQgXFwnJytjKydcXCcgbWF0Y2gnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmKHMgPT0gU19BVFRSX05PUVVPVF9WQUxVRSl7XHJcblx0XHRcdFx0dmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRyTmFtZSx2YWx1ZSxzdGFydCxwKVxyXG5cdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydCk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmRpcihlbClcclxuXHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJythdHRyTmFtZSsnXCIgbWlzc2VkIHN0YXJ0IHF1b3QoJytjKycpISEnKTtcclxuXHRcdFx0XHRzdGFydCA9IHArMTtcclxuXHRcdFx0XHRzID0gU19BVFRSX0VORFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvL2ZhdGFsRXJyb3I6IG5vIGVxdWFsIGJlZm9yZVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG11c3QgYWZ0ZXIgXCI9XCInKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJy8nOlxyXG5cdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdGNhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdGNhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0cyA9U19UQUdfQ0xPU0U7XHJcblx0XHRcdFx0ZWwuY2xvc2VkID0gdHJ1ZTtcclxuXHRcdFx0Y2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOlxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0Y2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdC8vY2FzZSBTX0VROlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImF0dHJpYnV0ZSBpbnZhbGlkIGNsb3NlIGNoYXIoJy8nKVwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnJzovL2VuZCBkb2N1bWVudFxyXG5cdFx0XHQvL3Rocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBlbmQgb2YgaW5wdXQnKVxyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0Jyk7XHJcblx0XHRcdGlmKHMgPT0gU19UQUcpe1xyXG5cdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcDtcclxuXHRcdGNhc2UgJz4nOlxyXG5cdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdGNhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdGNhc2UgU19UQUdfQ0xPU0U6XHJcblx0XHRcdFx0YnJlYWs7Ly9ub3JtYWxcclxuXHRcdFx0Y2FzZSBTX0FUVFJfTk9RVU9UX1ZBTFVFOi8vQ29tcGF0aWJsZSBzdGF0ZVxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKTtcclxuXHRcdFx0XHRpZih2YWx1ZS5zbGljZSgtMSkgPT09ICcvJyl7XHJcblx0XHRcdFx0XHRlbC5jbG9zZWQgID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMCwtMSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdGNhc2UgU19BVFRSX1NQQUNFOlxyXG5cdFx0XHRcdGlmKHMgPT09IFNfQVRUUl9TUEFDRSl7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IGF0dHJOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihzID09IFNfQVRUUl9OT1FVT1RfVkFMVUUpe1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlciksc3RhcnQpXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZihjdXJyZW50TlNNYXBbJyddICE9PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgfHwgIXZhbHVlLm1hdGNoKC9eKD86ZGlzYWJsZWR8Y2hlY2tlZHxzZWxlY3RlZCkkL2kpKXtcclxuXHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCB2YWx1ZSEhIFwiJyt2YWx1ZSsnXCIgaW5zdGVhZCEhJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsLmFkZCh2YWx1ZSx2YWx1ZSxzdGFydClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgU19FUTpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtaXNzZWQhIScpO1xyXG5cdFx0XHR9XHJcbi8vXHRcdFx0Y29uc29sZS5sb2codGFnTmFtZSx0YWdOYW1lUGF0dGVybix0YWdOYW1lUGF0dGVybi50ZXN0KHRhZ05hbWUpKVxyXG5cdFx0XHRyZXR1cm4gcDtcclxuXHRcdC8qeG1sIHNwYWNlICdcXHgyMCcgfCAjeDkgfCAjeEQgfCAjeEE7ICovXHJcblx0XHRjYXNlICdcXHUwMDgwJzpcclxuXHRcdFx0YyA9ICcgJztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdGlmKGM8PSAnICcpey8vc3BhY2VcclxuXHRcdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdFx0Y2FzZSBTX1RBRzpcclxuXHRcdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTsvL3RhZ05hbWVcclxuXHRcdFx0XHRcdHMgPSBTX1RBR19TUEFDRTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSOlxyXG5cdFx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscClcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfU1BBQ0U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XHJcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCkucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyt2YWx1ZSsnXCIgbWlzc2VkIHF1b3QoXCIpISEnKTtcclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydClcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdFx0XHRzID0gU19UQUdfU1BBQ0U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19UQUdfU1BBQ0U6XHJcblx0XHRcdFx0Ly9jYXNlIFNfRVE6XHJcblx0XHRcdFx0Ly9jYXNlIFNfQVRUUl9TUEFDRTpcclxuXHRcdFx0XHQvL1x0dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRcdC8vaWdub3JlIHdhcm5pbmdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNley8vbm90IHNwYWNlXHJcbi8vU19UQUcsXHRTX0FUVFIsXHRTX0VRLFx0U19BVFRSX05PUVVPVF9WQUxVRVxyXG4vL1NfQVRUUl9TUEFDRSxcdFNfQVRUUl9FTkQsXHRTX1RBR19TUEFDRSwgU19UQUdfQ0xPU0VcclxuXHRcdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdFx0Ly9jYXNlIFNfVEFHOnZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSOnZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSX05PUVVPVF9WQUxVRTp2b2lkKCk7YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX0FUVFJfU1BBQ0U6XHJcblx0XHRcdFx0XHR2YXIgdGFnTmFtZSA9ICBlbC50YWdOYW1lO1xyXG5cdFx0XHRcdFx0aWYoY3VycmVudE5TTWFwWycnXSAhPT0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnIHx8ICFhdHRyTmFtZS5tYXRjaCgvXig/OmRpc2FibGVkfGNoZWNrZWR8c2VsZWN0ZWQpJC9pKSl7XHJcblx0XHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK2F0dHJOYW1lKydcIiBtaXNzZWQgdmFsdWUhISBcIicrYXR0ck5hbWUrJ1wiIGluc3RlYWQyISEnKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLGF0dHJOYW1lLHN0YXJ0KTtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQVRUUl9FTkQ6XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIHNwYWNlIGlzIHJlcXVpcmVkXCInK2F0dHJOYW1lKydcIiEhJylcclxuXHRcdFx0XHRjYXNlIFNfVEFHX1NQQUNFOlxyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUjtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19FUTpcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfTk9RVU9UX1ZBTFVFO1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBwO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTX1RBR19DTE9TRTpcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVsZW1lbnRzIGNsb3NlZCBjaGFyYWN0ZXIgJy8nIGFuZCAnPicgbXVzdCBiZSBjb25uZWN0ZWQgdG9cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9Ly9lbmQgb3V0ZXIgc3dpdGNoXHJcblx0XHQvL2NvbnNvbGUubG9nKCdwKysnLHApXHJcblx0XHRwKys7XHJcblx0fVxyXG59XHJcbi8qKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaGFzIG5ldyBuYW1lc3BhY2UgZGVmaW5lXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIsY3VycmVudE5TTWFwKXtcclxuXHR2YXIgdGFnTmFtZSA9IGVsLnRhZ05hbWU7XHJcblx0dmFyIGxvY2FsTlNNYXAgPSBudWxsO1xyXG5cdC8vdmFyIGN1cnJlbnROU01hcCA9IHBhcnNlU3RhY2tbcGFyc2VTdGFjay5sZW5ndGgtMV0uY3VycmVudE5TTWFwO1xyXG5cdHZhciBpID0gZWwubGVuZ3RoO1xyXG5cdHdoaWxlKGktLSl7XHJcblx0XHR2YXIgYSA9IGVsW2ldO1xyXG5cdFx0dmFyIHFOYW1lID0gYS5xTmFtZTtcclxuXHRcdHZhciB2YWx1ZSA9IGEudmFsdWU7XHJcblx0XHR2YXIgbnNwID0gcU5hbWUuaW5kZXhPZignOicpO1xyXG5cdFx0aWYobnNwPjApe1xyXG5cdFx0XHR2YXIgcHJlZml4ID0gYS5wcmVmaXggPSBxTmFtZS5zbGljZSgwLG5zcCk7XHJcblx0XHRcdHZhciBsb2NhbE5hbWUgPSBxTmFtZS5zbGljZShuc3ArMSk7XHJcblx0XHRcdHZhciBuc1ByZWZpeCA9IHByZWZpeCA9PT0gJ3htbG5zJyAmJiBsb2NhbE5hbWVcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsb2NhbE5hbWUgPSBxTmFtZTtcclxuXHRcdFx0cHJlZml4ID0gbnVsbFxyXG5cdFx0XHRuc1ByZWZpeCA9IHFOYW1lID09PSAneG1sbnMnICYmICcnXHJcblx0XHR9XHJcblx0XHQvL2NhbiBub3Qgc2V0IHByZWZpeCxiZWNhdXNlIHByZWZpeCAhPT0gJydcclxuXHRcdGEubG9jYWxOYW1lID0gbG9jYWxOYW1lIDtcclxuXHRcdC8vcHJlZml4ID09IG51bGwgZm9yIG5vIG5zIHByZWZpeCBhdHRyaWJ1dGUgXHJcblx0XHRpZihuc1ByZWZpeCAhPT0gZmFsc2Upey8vaGFjayEhXHJcblx0XHRcdGlmKGxvY2FsTlNNYXAgPT0gbnVsbCl7XHJcblx0XHRcdFx0bG9jYWxOU01hcCA9IHt9XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjdXJyZW50TlNNYXAsMClcclxuXHRcdFx0XHRfY29weShjdXJyZW50TlNNYXAsY3VycmVudE5TTWFwPXt9KVxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3VycmVudE5TTWFwLDEpXHJcblx0XHRcdH1cclxuXHRcdFx0Y3VycmVudE5TTWFwW25zUHJlZml4XSA9IGxvY2FsTlNNYXBbbnNQcmVmaXhdID0gdmFsdWU7XHJcblx0XHRcdGEudXJpID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJ1xyXG5cdFx0XHRkb21CdWlsZGVyLnN0YXJ0UHJlZml4TWFwcGluZyhuc1ByZWZpeCwgdmFsdWUpIFxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgaSA9IGVsLmxlbmd0aDtcclxuXHR3aGlsZShpLS0pe1xyXG5cdFx0YSA9IGVsW2ldO1xyXG5cdFx0dmFyIHByZWZpeCA9IGEucHJlZml4O1xyXG5cdFx0aWYocHJlZml4KXsvL25vIHByZWZpeCBhdHRyaWJ1dGUgaGFzIG5vIG5hbWVzcGFjZVxyXG5cdFx0XHRpZihwcmVmaXggPT09ICd4bWwnKXtcclxuXHRcdFx0XHRhLnVyaSA9ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xyXG5cdFx0XHR9aWYocHJlZml4ICE9PSAneG1sbnMnKXtcclxuXHRcdFx0XHRhLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly97Y29uc29sZS5sb2coJyMjIycrYS5xTmFtZSxkb21CdWlsZGVyLmxvY2F0b3Iuc3lzdGVtSWQrJycsY3VycmVudE5TTWFwLGEudXJpKX1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgbnNwID0gdGFnTmFtZS5pbmRleE9mKCc6Jyk7XHJcblx0aWYobnNwPjApe1xyXG5cdFx0cHJlZml4ID0gZWwucHJlZml4ID0gdGFnTmFtZS5zbGljZSgwLG5zcCk7XHJcblx0XHRsb2NhbE5hbWUgPSBlbC5sb2NhbE5hbWUgPSB0YWdOYW1lLnNsaWNlKG5zcCsxKTtcclxuXHR9ZWxzZXtcclxuXHRcdHByZWZpeCA9IG51bGw7Ly9pbXBvcnRhbnQhIVxyXG5cdFx0bG9jYWxOYW1lID0gZWwubG9jYWxOYW1lID0gdGFnTmFtZTtcclxuXHR9XHJcblx0Ly9ubyBwcmVmaXggZWxlbWVudCBoYXMgZGVmYXVsdCBuYW1lc3BhY2VcclxuXHR2YXIgbnMgPSBlbC51cmkgPSBjdXJyZW50TlNNYXBbcHJlZml4IHx8ICcnXTtcclxuXHRkb21CdWlsZGVyLnN0YXJ0RWxlbWVudChucyxsb2NhbE5hbWUsdGFnTmFtZSxlbCk7XHJcblx0Ly9lbmRQcmVmaXhNYXBwaW5nIGFuZCBzdGFydFByZWZpeE1hcHBpbmcgaGF2ZSBub3QgYW55IGhlbHAgZm9yIGRvbSBidWlsZGVyXHJcblx0Ly9sb2NhbE5TTWFwID0gbnVsbFxyXG5cdGlmKGVsLmNsb3NlZCl7XHJcblx0XHRkb21CdWlsZGVyLmVuZEVsZW1lbnQobnMsbG9jYWxOYW1lLHRhZ05hbWUpO1xyXG5cdFx0aWYobG9jYWxOU01hcCl7XHJcblx0XHRcdGZvcihwcmVmaXggaW4gbG9jYWxOU01hcCl7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5lbmRQcmVmaXhNYXBwaW5nKHByZWZpeCkgXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9ZWxzZXtcclxuXHRcdGVsLmN1cnJlbnROU01hcCA9IGN1cnJlbnROU01hcDtcclxuXHRcdGVsLmxvY2FsTlNNYXAgPSBsb2NhbE5TTWFwO1xyXG5cdFx0Ly9wYXJzZVN0YWNrLnB1c2goZWwpO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlSHRtbFNwZWNpYWxDb250ZW50KHNvdXJjZSxlbFN0YXJ0RW5kLHRhZ05hbWUsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcil7XHJcblx0aWYoL14oPzpzY3JpcHR8dGV4dGFyZWEpJC9pLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0dmFyIGVsRW5kU3RhcnQgPSAgc291cmNlLmluZGV4T2YoJzwvJyt0YWdOYW1lKyc+JyxlbFN0YXJ0RW5kKTtcclxuXHRcdHZhciB0ZXh0ID0gc291cmNlLnN1YnN0cmluZyhlbFN0YXJ0RW5kKzEsZWxFbmRTdGFydCk7XHJcblx0XHRpZigvWyY8XS8udGVzdCh0ZXh0KSl7XHJcblx0XHRcdGlmKC9ec2NyaXB0JC9pLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0XHRcdC8vaWYoIS9cXF1cXF0+Ly50ZXN0KHRleHQpKXtcclxuXHRcdFx0XHRcdC8vbGV4SGFuZGxlci5zdGFydENEQVRBKCk7XHJcblx0XHRcdFx0XHRkb21CdWlsZGVyLmNoYXJhY3RlcnModGV4dCwwLHRleHQubGVuZ3RoKTtcclxuXHRcdFx0XHRcdC8vbGV4SGFuZGxlci5lbmRDREFUQSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsRW5kU3RhcnQ7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdH0vL31lbHNley8vdGV4dCBhcmVhXHJcblx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlcik7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHRleHQsMCx0ZXh0Lmxlbmd0aCk7XHJcblx0XHRcdFx0cmV0dXJuIGVsRW5kU3RhcnQ7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGVsU3RhcnRFbmQrMTtcclxufVxyXG5mdW5jdGlvbiBmaXhTZWxmQ2xvc2VkKHNvdXJjZSxlbFN0YXJ0RW5kLHRhZ05hbWUsY2xvc2VNYXApe1xyXG5cdC8vaWYodGFnTmFtZSBpbiBjbG9zZU1hcCl7XHJcblx0dmFyIHBvcyA9IGNsb3NlTWFwW3RhZ05hbWVdO1xyXG5cdGlmKHBvcyA9PSBudWxsKXtcclxuXHRcdC8vY29uc29sZS5sb2codGFnTmFtZSlcclxuXHRcdHBvcyA9ICBzb3VyY2UubGFzdEluZGV4T2YoJzwvJyt0YWdOYW1lKyc+JylcclxuXHRcdGlmKHBvczxlbFN0YXJ0RW5kKXsvL+W/mOiusOmXreWQiFxyXG5cdFx0XHRwb3MgPSBzb3VyY2UubGFzdEluZGV4T2YoJzwvJyt0YWdOYW1lKVxyXG5cdFx0fVxyXG5cdFx0Y2xvc2VNYXBbdGFnTmFtZV0gPXBvc1xyXG5cdH1cclxuXHRyZXR1cm4gcG9zPGVsU3RhcnRFbmQ7XHJcblx0Ly99IFxyXG59XHJcbmZ1bmN0aW9uIF9jb3B5KHNvdXJjZSx0YXJnZXQpe1xyXG5cdGZvcih2YXIgbiBpbiBzb3VyY2Upe3RhcmdldFtuXSA9IHNvdXJjZVtuXX1cclxufVxyXG5mdW5jdGlvbiBwYXJzZURDQyhzb3VyY2Usc3RhcnQsZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpey8vc3VyZSBzdGFydCB3aXRoICc8ISdcclxuXHR2YXIgbmV4dD0gc291cmNlLmNoYXJBdChzdGFydCsyKVxyXG5cdHN3aXRjaChuZXh0KXtcclxuXHRjYXNlICctJzpcclxuXHRcdGlmKHNvdXJjZS5jaGFyQXQoc3RhcnQgKyAzKSA9PT0gJy0nKXtcclxuXHRcdFx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCctLT4nLHN0YXJ0KzQpO1xyXG5cdFx0XHQvL2FwcGVuZCBjb21tZW50IHNvdXJjZS5zdWJzdHJpbmcoNCxlbmQpLy88IS0tXHJcblx0XHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5jb21tZW50KHNvdXJjZSxzdGFydCs0LGVuZC1zdGFydC00KTtcclxuXHRcdFx0XHRyZXR1cm4gZW5kKzM7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGVycm9ySGFuZGxlci5lcnJvcihcIlVuY2xvc2VkIGNvbW1lbnRcIik7XHJcblx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9lcnJvclxyXG5cdFx0XHRyZXR1cm4gLTE7XHJcblx0XHR9XHJcblx0ZGVmYXVsdDpcclxuXHRcdGlmKHNvdXJjZS5zdWJzdHIoc3RhcnQrMyw2KSA9PSAnQ0RBVEFbJyl7XHJcblx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignXV0+JyxzdGFydCs5KTtcclxuXHRcdFx0ZG9tQnVpbGRlci5zdGFydENEQVRBKCk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyhzb3VyY2Usc3RhcnQrOSxlbmQtc3RhcnQtOSk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuZW5kQ0RBVEEoKSBcclxuXHRcdFx0cmV0dXJuIGVuZCszO1xyXG5cdFx0fVxyXG5cdFx0Ly88IURPQ1RZUEVcclxuXHRcdC8vc3RhcnREVEQoamF2YS5sYW5nLlN0cmluZyBuYW1lLCBqYXZhLmxhbmcuU3RyaW5nIHB1YmxpY0lkLCBqYXZhLmxhbmcuU3RyaW5nIHN5c3RlbUlkKSBcclxuXHRcdHZhciBtYXRjaHMgPSBzcGxpdChzb3VyY2Usc3RhcnQpO1xyXG5cdFx0dmFyIGxlbiA9IG1hdGNocy5sZW5ndGg7XHJcblx0XHRpZihsZW4+MSAmJiAvIWRvY3R5cGUvaS50ZXN0KG1hdGNoc1swXVswXSkpe1xyXG5cdFx0XHR2YXIgbmFtZSA9IG1hdGNoc1sxXVswXTtcclxuXHRcdFx0dmFyIHB1YmlkID0gbGVuPjMgJiYgL15wdWJsaWMkL2kudGVzdChtYXRjaHNbMl1bMF0pICYmIG1hdGNoc1szXVswXVxyXG5cdFx0XHR2YXIgc3lzaWQgPSBsZW4+NCAmJiBtYXRjaHNbNF1bMF07XHJcblx0XHRcdHZhciBsYXN0TWF0Y2ggPSBtYXRjaHNbbGVuLTFdXHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnREVEQobmFtZSxwdWJpZCAmJiBwdWJpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJyksXHJcblx0XHRcdFx0XHRzeXNpZCAmJiBzeXNpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJykpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmVuZERURCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGxhc3RNYXRjaC5pbmRleCtsYXN0TWF0Y2hbMF0ubGVuZ3RoXHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAtMTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUluc3RydWN0aW9uKHNvdXJjZSxzdGFydCxkb21CdWlsZGVyKXtcclxuXHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJz8+JyxzdGFydCk7XHJcblx0aWYoZW5kKXtcclxuXHRcdHZhciBtYXRjaCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5tYXRjaCgvXjxcXD8oXFxTKilcXHMqKFtcXHNcXFNdKj8pXFxzKiQvKTtcclxuXHRcdGlmKG1hdGNoKXtcclxuXHRcdFx0dmFyIGxlbiA9IG1hdGNoWzBdLmxlbmd0aDtcclxuXHRcdFx0ZG9tQnVpbGRlci5wcm9jZXNzaW5nSW5zdHJ1Y3Rpb24obWF0Y2hbMV0sIG1hdGNoWzJdKSA7XHJcblx0XHRcdHJldHVybiBlbmQrMjtcclxuXHRcdH1lbHNley8vZXJyb3JcclxuXHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gLTE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gc291cmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBFbGVtZW50QXR0cmlidXRlcyhzb3VyY2Upe1xyXG5cdFxyXG59XHJcbkVsZW1lbnRBdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcclxuXHRzZXRUYWdOYW1lOmZ1bmN0aW9uKHRhZ05hbWUpe1xyXG5cdFx0aWYoIXRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdGFnTmFtZTonK3RhZ05hbWUpXHJcblx0XHR9XHJcblx0XHR0aGlzLnRhZ05hbWUgPSB0YWdOYW1lXHJcblx0fSxcclxuXHRhZGQ6ZnVuY3Rpb24ocU5hbWUsdmFsdWUsb2Zmc2V0KXtcclxuXHRcdGlmKCF0YWdOYW1lUGF0dGVybi50ZXN0KHFOYW1lKSl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhdHRyaWJ1dGU6JytxTmFtZSlcclxuXHRcdH1cclxuXHRcdHRoaXNbdGhpcy5sZW5ndGgrK10gPSB7cU5hbWU6cU5hbWUsdmFsdWU6dmFsdWUsb2Zmc2V0Om9mZnNldH1cclxuXHR9LFxyXG5cdGxlbmd0aDowLFxyXG5cdGdldExvY2FsTmFtZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5sb2NhbE5hbWV9LFxyXG5cdGdldExvY2F0b3I6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0ubG9jYXRvcn0sXHJcblx0Z2V0UU5hbWU6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0ucU5hbWV9LFxyXG5cdGdldFVSSTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS51cml9LFxyXG5cdGdldFZhbHVlOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLnZhbHVlfVxyXG4vL1x0LGdldEluZGV4OmZ1bmN0aW9uKHVyaSwgbG9jYWxOYW1lKSl7XHJcbi8vXHRcdGlmKGxvY2FsTmFtZSl7XHJcbi8vXHRcdFx0XHJcbi8vXHRcdH1lbHNle1xyXG4vL1x0XHRcdHZhciBxTmFtZSA9IHVyaVxyXG4vL1x0XHR9XHJcbi8vXHR9LFxyXG4vL1x0Z2V0VmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLmdldEluZGV4LmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9LFxyXG4vL1x0Z2V0VHlwZTpmdW5jdGlvbih1cmksbG9jYWxOYW1lKXt9XHJcbi8vXHRnZXRUeXBlOmZ1bmN0aW9uKGkpe30sXHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIF9zZXRfcHJvdG9fKHRoaXoscGFyZW50KXtcclxuXHR0aGl6Ll9fcHJvdG9fXyA9IHBhcmVudDtcclxuXHRyZXR1cm4gdGhpejtcclxufVxyXG5pZighKF9zZXRfcHJvdG9fKHt9LF9zZXRfcHJvdG9fLnByb3RvdHlwZSkgaW5zdGFuY2VvZiBfc2V0X3Byb3RvXykpe1xyXG5cdF9zZXRfcHJvdG9fID0gZnVuY3Rpb24odGhpeixwYXJlbnQpe1xyXG5cdFx0ZnVuY3Rpb24gcCgpe307XHJcblx0XHRwLnByb3RvdHlwZSA9IHBhcmVudDtcclxuXHRcdHAgPSBuZXcgcCgpO1xyXG5cdFx0Zm9yKHBhcmVudCBpbiB0aGl6KXtcclxuXHRcdFx0cFtwYXJlbnRdID0gdGhpeltwYXJlbnRdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdChzb3VyY2Usc3RhcnQpe1xyXG5cdHZhciBtYXRjaDtcclxuXHR2YXIgYnVmID0gW107XHJcblx0dmFyIHJlZyA9IC8nW14nXSsnfFwiW15cIl0rXCJ8W15cXHM8PlxcLz1dKz0/fChcXC8/XFxzKj58PCkvZztcclxuXHRyZWcubGFzdEluZGV4ID0gc3RhcnQ7XHJcblx0cmVnLmV4ZWMoc291cmNlKTsvL3NraXAgPFxyXG5cdHdoaWxlKG1hdGNoID0gcmVnLmV4ZWMoc291cmNlKSl7XHJcblx0XHRidWYucHVzaChtYXRjaCk7XHJcblx0XHRpZihtYXRjaFsxXSlyZXR1cm4gYnVmO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0cy5YTUxSZWFkZXIgPSBYTUxSZWFkZXI7XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcInNiZ252aXpcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMy4xLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNCR05QRCB2aXN1YWxpemF0aW9uIGxpYnJhcnlcIixcbiAgXCJtYWluXCI6IFwic3JjL2luZGV4LmpzXCIsXG4gIFwibGljZW5jZVwiOiBcIkxHUEwtMy4wXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIixcbiAgICBcImJ1aWxkLXNiZ252aXotanNcIjogXCJndWxwIGJ1aWxkXCIsXG4gICAgXCJkZWJ1Zy1qc1wiOiBcIm5vZGVtb24gLWUganMgLS13YXRjaCBzcmMgLXggXFxcIm5wbSBydW4gYnVpbGQtc2JnbnZpei1qc1xcXCJcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9zYmdudml6LmpzLmdpdFwiXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L3NiZ252aXouanMvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvc2JnbnZpei5qcy9cIixcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImpxdWVyeVwiOiBcIl4yLjIuNFwiLFxuICAgIFwiZmlsZXNhdmVyanNcIjogXCJ+MC4yLjJcIixcbiAgICBcImN5dG9zY2FwZVwiOiBcImlWaXMtYXQtQmlsa2VudC9jeXRvc2NhcGUuanMjdW5zdGFibGVcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaWJzYmduLmpzXCI6IFwiZ2l0Oi8vZ2l0aHViLmNvbS9laXNibS9saWJzYmduLmpzXCIsXG4gICAgXCJwcmV0dHktZGF0YVwiOiBcIl4wLjQwLjBcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJicm93c2VyaWZ5XCI6IFwiXjExLjIuMFwiLFxuICAgIFwiZ3VscFwiOiBcIl4zLjkuMFwiLFxuICAgIFwiZ3VscC1kZXJlcXVpcmVcIjogXCJeMi4xLjBcIixcbiAgICBcImd1bHAtanNoaW50XCI6IFwiXjEuMTEuMlwiLFxuICAgIFwiZ3VscC1wcm9tcHRcIjogXCJeMC4xLjJcIixcbiAgICBcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuNFwiLFxuICAgIFwiZ3VscC1zaGVsbFwiOiBcIl4wLjUuMFwiLFxuICAgIFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG4gICAgXCJqc2hpbnQtc3R5bGlzaFwiOiBcIl4yLjAuMVwiLFxuICAgIFwibm9kZS1ub3RpZmllclwiOiBcIl40LjMuMVwiLFxuICAgIFwicnVuLXNlcXVlbmNlXCI6IFwiXjEuMS40XCIsXG4gICAgXCJ2aW55bC1idWZmZXJcIjogXCJeMS4wLjBcIixcbiAgICBcInZpbnlsLXNvdXJjZS1zdHJlYW1cIjogXCJeMS4xLjBcIlxuICB9XG59XG4iLCIoZnVuY3Rpb24oKXtcbiAgdmFyIHNiZ252aXogPSB3aW5kb3cuc2JnbnZpeiA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xuICAgIFxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xuICAgIFxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7XG4gICAgXG4gICAgdmFyIHNiZ25SZW5kZXJlciA9IHJlcXVpcmUoJy4vc2Jnbi1leHRlbnNpb25zL3NiZ24tY3ktcmVuZGVyZXInKTtcbiAgICB2YXIgc2JnbkN5SW5zdGFuY2UgPSByZXF1aXJlKCcuL3NiZ24tZXh0ZW5zaW9ucy9zYmduLWN5LWluc3RhbmNlJyk7XG4gICAgXG4gICAgLy8gVXRpbGl0aWVzIHdob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIGV4cG9zZWQgc2VwZXJhdGVseVxuICAgIHZhciB1aVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VpLXV0aWxpdGllcycpO1xuICAgIHZhciBmaWxlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZmlsZS11dGlsaXRpZXMnKTtcbiAgICB2YXIgZ3JhcGhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgcmVxdWlyZSgnLi91dGlsaXRpZXMva2V5Ym9hcmQtaW5wdXQtdXRpbGl0aWVzJyk7IC8vIHJlcXVpcmUga2V5Ym9yZCBpbnB1dCB1dGlsaXRpZXNcbiAgICAvLyBVdGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBhcyBpc1xuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xuICAgIFxuICAgIHNiZ25SZW5kZXJlcigpO1xuICAgIHNiZ25DeUluc3RhbmNlKCk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXMsIG1vc3QgdXNlcnMgd2lsbCBub3QgbmVlZCB0aGVzZVxuICAgIHNiZ252aXouZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggZmlsZSB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIGZpbGVVdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSBmaWxlVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHBvc2UgZWFjaCBmaWxlIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gdWlVdGlsaXRpZXMpIHtcbiAgICAgIHNiZ252aXpbcHJvcF0gPSB1aVV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggc2JnbiBncmFwaCB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIGdyYXBoVXRpbGl0aWVzKSB7XG4gICAgICBzYmdudml6W3Byb3BdID0gZ3JhcGhVdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICB9O1xuICBcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNiZ252aXo7XG4gIH1cbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy9ncmFwaC11dGlsaXRpZXMnKTtcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xudmFyIHJlZnJlc2hQYWRkaW5ncyA9IGdyYXBoVXRpbGl0aWVzLnJlZnJlc2hQYWRkaW5ncy5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuXG52YXIgZ2V0Q29tcG91bmRQYWRkaW5ncyA9IGZ1bmN0aW9uKCkge1xuICAvLyBSZXR1cm4gY2FsY3VsYXRlZCBwYWRkaW5ncyBpbiBjYXNlIG9mIHRoYXQgZGF0YSBpcyBpbnZhbGlkIHJldHVybiA1XG4gIHJldHVybiBncmFwaFV0aWxpdGllcy5jYWxjdWxhdGVkUGFkZGluZ3MgfHwgNTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29udGFpbmVyU2VsZWN0b3IgPSBvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3RvcjtcbiAgdmFyIGltZ1BhdGggPSBvcHRpb25zLmltZ1BhdGg7XG4gIFxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKVxuICB7XG4gICAgdmFyIHNiZ25OZXR3b3JrQ29udGFpbmVyID0gJChjb250YWluZXJTZWxlY3Rvcik7XG5cbiAgICAvLyBjcmVhdGUgYW5kIGluaXQgY3l0b3NjYXBlOlxuICAgIHZhciBjeSA9IGN5dG9zY2FwZSh7XG4gICAgICBjb250YWluZXI6IHNiZ25OZXR3b3JrQ29udGFpbmVyLFxuICAgICAgc3R5bGU6IHNiZ25TdHlsZVNoZWV0LFxuICAgICAgc2hvd092ZXJsYXk6IGZhbHNlLCBtaW5ab29tOiAwLjEyNSwgbWF4Wm9vbTogMTYsXG4gICAgICBib3hTZWxlY3Rpb25FbmFibGVkOiB0cnVlLFxuICAgICAgbW90aW9uQmx1cjogdHJ1ZSxcbiAgICAgIHdoZWVsU2Vuc2l0aXZpdHk6IDAuMSxcbiAgICAgIHJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5jeSA9IHRoaXM7XG4gICAgICAgIC8vIElmIHVuZG9hYmxlIHJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIFxuICAvLyBOb3RlIHRoYXQgaW4gQ2hpU0UgdGhpcyBmdW5jdGlvbiBpcyBpbiBhIHNlcGVyYXRlIGZpbGUgYnV0IGluIHRoZSB2aWV3ZXIgaXQgaGFzIGp1c3QgMiBtZXRob2RzIGFuZCBzbyBpdCBpcyBsb2NhdGVkIGluIHRoaXMgZmlsZVxuICBmdW5jdGlvbiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucygpIHtcbiAgICAvLyBjcmVhdGUgb3IgZ2V0IHRoZSB1bmRvLXJlZG8gaW5zdGFuY2VcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuXG4gICAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlTm9kZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVOb2Rlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGJpbmRDeUV2ZW50cygpIHtcbiAgICBjeS5vbigndGFwZW5kJywgJ25vZGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfSk7XG4gICAgXG4gICAgY3kub24oXCJleHBhbmRjb2xsYXBzZS5iZWZvcmVjb2xsYXBzZVwiLCBcIm5vZGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAvL1RoZSBjaGlsZHJlbiBpbmZvIG9mIGNvbXBsZXggbm9kZXMgc2hvdWxkIGJlIHNob3duIHdoZW4gdGhleSBhcmUgY29sbGFwc2VkXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XG4gICAgICAgIC8vVGhlIG5vZGUgaXMgYmVpbmcgY29sbGFwc2VkIHN0b3JlIGluZm9sYWJlbCB0byB1c2UgaXQgbGF0ZXJcbiAgICAgICAgdmFyIGluZm9MYWJlbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0SW5mb0xhYmVsKG5vZGUpO1xuICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEuaW5mb0xhYmVsID0gaW5mb0xhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWRnZXMgPSBjeS5lZGdlcygpO1xuICAgICAgLy8gcmVtb3ZlIGJlbmQgcG9pbnRzIGJlZm9yZSBjb2xsYXBzZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgICAgICBpZiAoZWRnZS5oYXNDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKSkge1xuICAgICAgICAgIGVkZ2UucmVtb3ZlQ2xhc3MoJ2VkZ2ViZW5kZWRpdGluZy1oYXNiZW5kcG9pbnRzJyk7XG4gICAgICAgICAgZGVsZXRlIGVkZ2UuX3ByaXZhdGUuY2xhc3Nlc1snZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHMnLCBbXSk7XG4gICAgICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYmVmb3JlZXhwYW5kXCIsIFwibm9kZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgIG5vZGUucmVtb3ZlRGF0YShcImluZm9MYWJlbFwiKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiZXhwYW5kY29sbGFwc2UuYWZ0ZXJleHBhbmRcIiwgXCJub2RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgY3kubm9kZXMoKS51cGRhdGVDb21wb3VuZEJvdW5kcygpO1xuICAgICAgLy9Eb24ndCBzaG93IGNoaWxkcmVuIGluZm8gd2hlbiB0aGUgY29tcGxleCBub2RlIGlzIGV4cGFuZGVkXG4gICAgICBpZiAobm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGxleFwiKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2NvbnRlbnQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzYmduU3R5bGVTaGVldCA9IGN5dG9zY2FwZS5zdHlsZXNoZWV0KClcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGV4dC12YWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICd0ZXh0LWhhbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAgICAgJ3RleHQtb3BhY2l0eSc6IDEsXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDEsXG4gICAgICAgICAgICAncGFkZGluZyc6IDBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6cGFyZW50XCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAncGFkZGluZyc6IGdldENvbXBvdW5kUGFkZGluZ3NcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbP2Nsb25lbWFya2VyXVtjbGFzcz0ncGVydHVyYmluZyBhZ2VudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGltZ1BhdGggKyAnL2Nsb25lX2JnLnBuZycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JzogJzUwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi15JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1oZWlnaHQnOiAnMjUlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWZpdCc6ICdub25lJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2Nsb25lbWFya2VyJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZWxlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeVNoYXBlKGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbnRlbnQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVsZW1lbnRDb250ZW50KGVsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3M9J3BlcnR1cmJpbmcgYWdlbnQnXVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NoYXBlLXBvbHlnb24tcG9pbnRzJzogJy0xLCAtMSwgICAtMC41LCAwLCAgLTEsIDEsICAgMSwgMSwgICAwLjUsIDAsIDEsIC0xJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzcz0ndGFnJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdzaGFwZS1wb2x5Z29uLXBvaW50cyc6ICctMSwgLTEsICAgMC4yNSwgLTEsICAgMSwgMCwgICAgMC4yNSwgMSwgICAgLTEsIDEnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXZhbGlnbic6ICdib3R0b20nLFxuICAgICAgICAgICAgJ3RleHQtaGFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wYXJ0bWVudCddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogMy4yNSxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLFxuICAgICAgICAgICAgJ3RleHQtdmFsaWduJzogJ2JvdHRvbScsXG4gICAgICAgICAgICAndGV4dC1oYWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgICAgICd0ZXh0LW1hcmdpbi15JyA6IC0xICogb3B0aW9ucy5leHRyYUNvbXBhcnRtZW50UGFkZGluZ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTpwYXJlbnRbY2xhc3M9J2NvbXBhcnRtZW50J11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdwYWRkaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRDb21wb3VuZFBhZGRpbmdzKCkgKyBvcHRpb25zLmV4dHJhQ29tcGFydG1lbnRQYWRkaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZVtiYm94XVtjbGFzc11bY2xhc3MhPSdjb21wbGV4J11bY2xhc3MhPSdjb21wYXJ0bWVudCddW2NsYXNzIT0nc3VibWFwJ11cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd3aWR0aCc6ICdkYXRhKGJib3gudyknLFxuICAgICAgICAgICAgJ2hlaWdodCc6ICdkYXRhKGJib3guaCknXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3dpZHRoJzogMzYsXG4gICAgICAgICAgICAnaGVpZ2h0JzogMzYsXG4gICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ2Rhc2hlZCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyMwMDAnLFxuICAgICAgICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwibm9kZTphY3RpdmVcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjcsICdvdmVybGF5LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgICAgICAgJ292ZXJsYXktcGFkZGluZyc6ICcxNCdcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VcIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxuICAgICAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnaG9sbG93JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctZmlsbCc6ICdob2xsb3cnLFxuICAgICAgICAgICAgJ3dpZHRoJzogMS4yNSxcbiAgICAgICAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnIzU1NScsXG4gICAgICAgICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyNkNjc2MTQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbGUuY3NzKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2Fycm93LXNjYWxlJzogMS4yNVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZS5jeS1leHBhbmQtY29sbGFwc2UtbWV0YS1lZGdlXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlOmFjdGl2ZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNywgJ292ZXJsYXktY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnb3ZlcmxheS1wYWRkaW5nJzogJzgnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2VsZWN0b3IoXCJlZGdlW2NhcmRpbmFsaXR5ID4gMF1cIilcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICd0ZXh0LXJvdGF0aW9uJzogJ2F1dG9yb3RhdGUnLFxuICAgICAgICAgICAgJ3RleHQtYmFja2dyb3VuZC1zaGFwZSc6ICdyZWN0YW5nbGUnLFxuICAgICAgICAgICAgJ3RleHQtYm9yZGVyLW9wYWNpdHknOiAnMScsXG4gICAgICAgICAgICAndGV4dC1ib3JkZXItd2lkdGgnOiAnMScsXG4gICAgICAgICAgICAndGV4dC1iYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyxcbiAgICAgICAgICAgICd0ZXh0LWJhY2tncm91bmQtb3BhY2l0eSc6ICcxJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0nY29uc3VtcHRpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnc291cmNlLWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc291cmNlLXRleHQtbWFyZ2luLXknOiAnLTEwJyxcbiAgICAgICAgICAgICdzb3VyY2UtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3M9J3Byb2R1Y3Rpb24nXVtjYXJkaW5hbGl0eSA+IDBdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWxhYmVsJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gJycgKyBlbGUuZGF0YSgnY2FyZGluYWxpdHknKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGFyZ2V0LXRleHQtbWFyZ2luLXknOiAnLTEwJyxcbiAgICAgICAgICAgICd0YXJnZXQtdGV4dC1vZmZzZXQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldENhcmRpbmFsaXR5RGlzdGFuY2UoZWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRDeUFycm93U2hhcGUoZWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc291cmNlLWFycm93LXNoYXBlJzogJ25vbmUnLFxuICAgICAgICAgICAgJ3NvdXJjZS1lbmRwb2ludCc6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRFbmRQb2ludChlbGUsICdzb3VyY2UnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGFyZ2V0LWVuZHBvaW50JzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldEVuZFBvaW50KGVsZSwgJ3RhcmdldCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0naW5oaWJpdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzcz0ncHJvZHVjdGlvbiddXCIpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndGFyZ2V0LWFycm93LWZpbGwnOiAnZmlsbGVkJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNlbGVjdG9yKFwiY29yZVwiKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ3NlbGVjdGlvbi1ib3gtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICAgICAnc2VsZWN0aW9uLWJveC1vcGFjaXR5JzogJzAuMicsICdzZWxlY3Rpb24tYm94LWJvcmRlci1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgICAgIH0pO1xufTtcbiIsIi8qXG4gKiBSZW5kZXIgc2JnbiBzcGVjaWZpYyBzaGFwZXMgd2hpY2ggYXJlIG5vdCBzdXBwb3J0ZWQgYnkgY3l0b3NjYXBlLmpzIGNvcmVcbiAqL1xuXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzL3RleHQtdXRpbGl0aWVzJykudHJ1bmNhdGVUZXh0O1xudmFyIGxpYnMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG52YXIgY3l0b3NjYXBlID0gbGlicy5jeXRvc2NhcGU7XG5cbnZhciBjeU1hdGggPSBjeXRvc2NhcGUubWF0aDtcbnZhciBjeUJhc2VOb2RlU2hhcGVzID0gY3l0b3NjYXBlLmJhc2VOb2RlU2hhcGVzO1xudmFyIGN5U3R5bGVQcm9wZXJ0aWVzID0gY3l0b3NjYXBlLnN0eWxlUHJvcGVydGllcztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciAkJCA9IGN5dG9zY2FwZTtcbiAgXG4gIC8vIFRha2VuIGZyb20gY3l0b3NjYXBlLmpzIGFuZCBtb2RpZmllZFxuICB2YXIgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aCA9IGZ1bmN0aW9uKFxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHJhZGl1cyApe1xuXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IHJhZGl1cyB8fCBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMoIHdpZHRoLCBoZWlnaHQgKTtcblxuICAgIGlmKCBjb250ZXh0LmJlZ2luUGF0aCApeyBjb250ZXh0LmJlZ2luUGF0aCgpOyB9XG5cbiAgICAvLyBTdGFydCBhdCB0b3AgbWlkZGxlXG4gICAgY29udGV4dC5tb3ZlVG8oIHgsIHkgLSBoYWxmSGVpZ2h0ICk7XG4gICAgLy8gQXJjIGZyb20gbWlkZGxlIHRvcCB0byByaWdodCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSAtIGhhbGZIZWlnaHQsIHggKyBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIHJpZ2h0IHNpZGUgdG8gYm90dG9tXG4gICAgY29udGV4dC5hcmNUbyggeCArIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHgsIHkgKyBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMgKTtcbiAgICAvLyBBcmMgZnJvbSBib3R0b20gdG8gbGVmdCBzaWRlXG4gICAgY29udGV4dC5hcmNUbyggeCAtIGhhbGZXaWR0aCwgeSArIGhhbGZIZWlnaHQsIHggLSBoYWxmV2lkdGgsIHksIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEFyYyBmcm9tIGxlZnQgc2lkZSB0byB0b3BCb3JkZXJcbiAgICBjb250ZXh0LmFyY1RvKCB4IC0gaGFsZldpZHRoLCB5IC0gaGFsZkhlaWdodCwgeCwgeSAtIGhhbGZIZWlnaHQsIGNvcm5lclJhZGl1cyApO1xuICAgIC8vIEpvaW4gbGluZVxuICAgIGNvbnRleHQubGluZVRvKCB4LCB5IC0gaGFsZkhlaWdodCApO1xuXG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9O1xuICBcbiAgLy8gVGFrZW4gZnJvbSBjeXRvc2NhcGUuanNcbiAgdmFyIGRyYXdQb2x5Z29uUGF0aCA9IGZ1bmN0aW9uKFxuICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHBvaW50cyApe1xuXG4gICAgdmFyIGhhbGZXID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSCA9IGhlaWdodCAvIDI7XG5cbiAgICBpZiggY29udGV4dC5iZWdpblBhdGggKXsgY29udGV4dC5iZWdpblBhdGgoKTsgfVxuXG4gICAgY29udGV4dC5tb3ZlVG8oIHggKyBoYWxmVyAqIHBvaW50c1swXSwgeSArIGhhbGZIICogcG9pbnRzWzFdICk7XG5cbiAgICBmb3IoIHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLyAyOyBpKysgKXtcbiAgICAgIGNvbnRleHQubGluZVRvKCB4ICsgaGFsZlcgKiBwb2ludHNbIGkgKiAyXSwgeSArIGhhbGZIICogcG9pbnRzWyBpICogMiArIDFdICk7XG4gICAgfVxuXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgfTtcbiAgXG4gIHZhciBzYmduU2hhcGVzID0gJCQuc2Jnbi5zYmduU2hhcGVzID0ge1xuICAgICdzb3VyY2UgYW5kIHNpbmsnOiB0cnVlLFxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxuICAgICdkaXNzb2NpYXRpb24nOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAncHJvY2Vzcyc6IHRydWUsXG4gICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAnYXNzb2NpYXRpb24nOiB0cnVlXG4gIH07XG5cbiAgdmFyIHRvdGFsbHlPdmVycmlkZW5Ob2RlU2hhcGVzID0gJCQuc2Jnbi50b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlcyA9IHtcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ3Byb2Nlc3MnOiB0cnVlLFxuICAgICd1bmNlcnRhaW4gcHJvY2Vzcyc6IHRydWUsXG4gICAgJ29taXR0ZWQgcHJvY2Vzcyc6IHRydWUsXG4gICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZVxuICB9O1xuXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSwgcG9pbnRzKSB7XG4gICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnQgPSBub2RlLl9wcml2YXRlLmRhdGEucG9ydHNbaV07XG4gICAgICB2YXIgcG9ydFggPSBwb3J0LnggKiB3aWR0aCAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgcG9ydFkgPSBwb3J0LnkgKiBoZWlnaHQgLyAxMDAgKyBjZW50ZXJZO1xuICAgICAgdmFyIGNsb3Nlc3RQb2ludCA9IGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShwb3J0WCwgcG9ydFksXG4gICAgICAgICAgICAgIHBvaW50cywgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyLCBwYWRkaW5nKTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwb3J0WCwgcG9ydFkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2xvc2VzdFBvaW50WzBdLCBjbG9zZXN0UG9pbnRbMV0pO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cblxuICAgICAgLy9hZGQgYSBsaXR0bGUgYmxhY2sgY2lyY2xlIHRvIHBvcnRzXG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMucG9ydDtcbiAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgcG9ydFgsIHBvcnRZLCAyLCAyKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdW5pdE9mSW5mb1JhZGl1cyA9IDQ7XG4gIHZhciBzdGF0ZVZhclJhZGl1cyA9IDE1O1xuICAkJC5zYmduLmRyYXdDb21wbGV4U3RhdGVBbmRJbmZvID0gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUsIHN0YXRlQW5kSW5mb3MsXG4gICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCkge1xuXG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xuXG4gICAgdmFyIHVwV2lkdGggPSAwLCBkb3duV2lkdGggPSAwO1xuICAgIHZhciBib3hQYWRkaW5nID0gMTAsIGJldHdlZW5Cb3hQYWRkaW5nID0gNTtcbiAgICB2YXIgYmVnaW5Qb3NZID0gaGVpZ2h0IC8gMiwgYmVnaW5Qb3NYID0gd2lkdGggLyAyO1xuXG4gICAgc3RhdGVBbmRJbmZvcy5zb3J0KCQkLnNiZ24uY29tcGFyZVN0YXRlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlQW5kSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlQW5kSW5mb3NbaV07XG4gICAgICB2YXIgc3RhdGVXaWR0aCA9IHN0YXRlLmJib3gudztcbiAgICAgIHZhciBzdGF0ZUhlaWdodCA9IHN0YXRlLmJib3guaDtcbi8vICAgICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZS5zdGF0ZS52YWx1ZTtcbiAgICAgIHZhciByZWxhdGl2ZVlQb3MgPSBzdGF0ZS5iYm94Lnk7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclk7XG5cbiAgICAgIGlmIChyZWxhdGl2ZVlQb3MgPCAwKSB7XG4gICAgICAgIGlmICh1cFdpZHRoICsgc3RhdGVXaWR0aCA8IHdpZHRoKSB7XG4gICAgICAgICAgc3RhdGVDZW50ZXJYID0gY2VudGVyWCAtIGJlZ2luUG9zWCArIGJveFBhZGRpbmcgKyB1cFdpZHRoICsgc3RhdGVXaWR0aCAvIDI7XG4gICAgICAgICAgc3RhdGVDZW50ZXJZID0gY2VudGVyWSAtIGJlZ2luUG9zWTtcblxuICAgICAgICAgIHZhciB0ZXh0UHJvcCA9IHsnY2VudGVyWCc6IHN0YXRlQ2VudGVyWCwgJ2NlbnRlclknOiBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuY3NzKCd0ZXh0LW9wYWNpdHknKSAqIG5vZGUuY3NzKCdvcGFjaXR5JyksXG4gICAgICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xuXG4gICAgICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgTWF0aC5taW4oc3RhdGVXaWR0aCAvIDIsIHN0YXRlSGVpZ2h0IC8gMiwgc3RhdGVWYXJSYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHVuaXRPZkluZm9SYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgICAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlLmxhYmVsLnRleHQ7XG4gICAgICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHVwV2lkdGggPSB1cFdpZHRoICsgd2lkdGggKyBib3hQYWRkaW5nO1xuICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZVlQb3MgPiAwKSB7XG4gICAgICAgIGlmIChkb3duV2lkdGggKyBzdGF0ZVdpZHRoIDwgd2lkdGgpIHtcbiAgICAgICAgICBzdGF0ZUNlbnRlclggPSBjZW50ZXJYIC0gYmVnaW5Qb3NYICsgYm94UGFkZGluZyArIGRvd25XaWR0aCArIHN0YXRlV2lkdGggLyAyO1xuICAgICAgICAgIHN0YXRlQ2VudGVyWSA9IGNlbnRlclkgKyBiZWdpblBvc1k7XG5cbiAgICAgICAgICB2YXIgdGV4dFByb3AgPSB7J2NlbnRlclgnOiBzdGF0ZUNlbnRlclgsICdjZW50ZXJZJzogc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAgICAgJ3dpZHRoJzogc3RhdGVXaWR0aCwgJ2hlaWdodCc6IHN0YXRlSGVpZ2h0fTtcblxuICAgICAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICAgICAgZHJhd1JvdW5kUmVjdGFuZ2xlUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIE1hdGgubWluKHN0YXRlV2lkdGggLyAyLCBzdGF0ZUhlaWdodCAvIDIsIHN0YXRlVmFyUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3Auc3RhdGUgPSBzdGF0ZS5zdGF0ZTtcbiAgICAgICAgICAgICQkLnNiZ24uZHJhd1N0YXRlVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikgey8vZHJhdyByZWN0YW5nbGVcbiAgICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0O1xuICAgICAgICAgICAgJCQuc2Jnbi5kcmF3SW5mb1RleHQoY29udGV4dCwgdGV4dFByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkb3duV2lkdGggPSBkb3duV2lkdGggKyB3aWR0aCArIGJveFBhZGRpbmc7XG4gICAgICB9XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fyb3VuZFxuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLCAwLCAwKTtcblxuICAgICAgLy91cGRhdGUgbmV3IHN0YXRlIGFuZCBpbmZvIHBvc2l0aW9uKHJlbGF0aXZlIHRvIG5vZGUgY2VudGVyKVxuICAgICAgc3RhdGUuYmJveC54ID0gKHN0YXRlQ2VudGVyWCAtIGNlbnRlclgpICogMTAwIC8gbm9kZS53aWR0aCgpO1xuICAgICAgc3RhdGUuYmJveC55ID0gKHN0YXRlQ2VudGVyWSAtIGNlbnRlclkpICogMTAwIC8gbm9kZS5oZWlnaHQoKTtcbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3U3RhdGVUZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIHRleHRQcm9wKSB7XG4gICAgdmFyIHN0YXRlVmFsdWUgPSB0ZXh0UHJvcC5zdGF0ZS52YWx1ZSB8fCAnJztcbiAgICB2YXIgc3RhdGVWYXJpYWJsZSA9IHRleHRQcm9wLnN0YXRlLnZhcmlhYmxlIHx8ICcnO1xuXG4gICAgdmFyIHN0YXRlTGFiZWwgPSBzdGF0ZVZhbHVlICsgKHN0YXRlVmFyaWFibGVcbiAgICAgICAgICAgID8gXCJAXCIgKyBzdGF0ZVZhcmlhYmxlXG4gICAgICAgICAgICA6IFwiXCIpO1xuXG4gICAgdmFyIGZvbnRTaXplID0gOTsgLy8gcGFyc2VJbnQodGV4dFByb3AuaGVpZ2h0IC8gMS41KTtcblxuICAgIHRleHRQcm9wLmZvbnQgPSBmb250U2l6ZSArIFwicHggQXJpYWxcIjtcbiAgICB0ZXh0UHJvcC5sYWJlbCA9IHN0YXRlTGFiZWw7XG4gICAgdGV4dFByb3AuY29sb3IgPSBcIiMwZjBmMGZcIjtcbiAgICAkJC5zYmduLmRyYXdUZXh0KGNvbnRleHQsIHRleHRQcm9wKTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdJbmZvVGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCkge1xuICAgIHZhciBmb250U2l6ZSA9IDk7IC8vIHBhcnNlSW50KHRleHRQcm9wLmhlaWdodCAvIDEuNSk7XG4gICAgdGV4dFByb3AuZm9udCA9IGZvbnRTaXplICsgXCJweCBBcmlhbFwiO1xuICAgIHRleHRQcm9wLmNvbG9yID0gXCIjMGYwZjBmXCI7XG4gICAgJCQuc2Jnbi5kcmF3VGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3VGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCB0ZXh0UHJvcCwgdHJ1bmNhdGUpIHtcbiAgICB2YXIgb2xkRm9udCA9IGNvbnRleHQuZm9udDtcbiAgICBjb250ZXh0LmZvbnQgPSB0ZXh0UHJvcC5mb250O1xuICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSB0ZXh0UHJvcC5jb2xvcjtcbiAgICB2YXIgb2xkT3BhY2l0eSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRleHRQcm9wLm9wYWNpdHk7XG4gICAgdmFyIHRleHQ7XG4gICAgXG4gICAgdGV4dFByb3AubGFiZWwgPSB0ZXh0UHJvcC5sYWJlbCB8fCAnJztcbiAgICBcbiAgICBpZiAodHJ1bmNhdGUgPT0gZmFsc2UpIHtcbiAgICAgIHRleHQgPSB0ZXh0UHJvcC5sYWJlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRydW5jYXRlVGV4dCh0ZXh0UHJvcCwgY29udGV4dC5mb250KTtcbiAgICB9XG4gICAgXG4gICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0ZXh0UHJvcC5jZW50ZXJYLCB0ZXh0UHJvcC5jZW50ZXJZKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgIGNvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZE9wYWNpdHk7XG4gICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICB9O1xuXG4gIGN5TWF0aC5jYWxjdWxhdGVEaXN0YW5jZSA9IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50Mikge1xuICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucG93KHBvaW50MVswXSAtIHBvaW50MlswXSwgMikgKyBNYXRoLnBvdyhwb2ludDFbMV0gLSBwb2ludDJbMV0sIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZGlzdGFuY2UpO1xuICB9O1xuXG4gICQkLnNiZ24uY29sb3JzID0ge1xuICAgIGNsb25lOiBcIiNhOWE5YTlcIixcbiAgICBhc3NvY2lhdGlvbjogXCIjNkI2QjZCXCIsXG4gICAgcG9ydDogXCIjNkI2QjZCXCJcbiAgfTtcblxuXG4gICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSkge1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aCAmJiBpIDwgNDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgdmFyIHRleHRQcm9wID0geydjZW50ZXJYJzogc3RhdGVDZW50ZXJYLCAnY2VudGVyWSc6IHN0YXRlQ2VudGVyWSxcbiAgICAgICAgJ29wYWNpdHknOiBub2RlLmNzcygndGV4dC1vcGFjaXR5JykgKiBub2RlLmNzcygnb3BhY2l0eScpLFxuICAgICAgICAnd2lkdGgnOiBzdGF0ZVdpZHRoLCAnaGVpZ2h0Jzogc3RhdGVIZWlnaHR9O1xuXG4gICAgICBpZiAoc3RhdGUuY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7Ly9kcmF3IGVsbGlwc2VcbiAgICAgICAgLy92YXIgc3RhdGVMYWJlbCA9IHN0YXRlLnN0YXRlLnZhbHVlO1xuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCBzdGF0ZVZhclJhZGl1cykpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB0ZXh0UHJvcC5zdGF0ZSA9IHN0YXRlLnN0YXRlO1xuICAgICAgICAkJC5zYmduLmRyYXdTdGF0ZVRleHQoY29udGV4dCwgdGV4dFByb3ApO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZVdpZHRoIC8gMiwgc3RhdGVIZWlnaHQgLyAyLCB1bml0T2ZJbmZvUmFkaXVzKSk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGV4dFByb3AubGFiZWwgPSBzdGF0ZS5sYWJlbC50ZXh0IHx8ICcnO1xuICAgICAgICAkJC5zYmduLmRyYXdJbmZvVGV4dChjb250ZXh0LCB0ZXh0UHJvcCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9UaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIDAsIDApO1xuICB9O1xuXG4gICQkLnNiZ24ubnVjbGVpY0FjaWRDaGVja1BvaW50ID0gZnVuY3Rpb24gKHgsIHksIGNlbnRlclgsIGNlbnRlclksIG5vZGUsIHRocmVzaG9sZCwgcG9pbnRzLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgIC8vY2hlY2sgcmVjdGFuZ2xlIGF0IHRvcFxuICAgIGlmIChjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIHBvaW50cyxcbiAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkgLSBjb3JuZXJSYWRpdXMgLyAyLCB3aWR0aCwgaGVpZ2h0IC0gY29ybmVyUmFkaXVzIC8gMywgWzAsIC0xXSxcbiAgICAgICAgICAgIHBhZGRpbmcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL2NoZWNrIHJlY3RhbmdsZSBhdCBib3R0b21cbiAgICBpZiAoY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBwb2ludHMsXG4gICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyAvIDIsIHdpZHRoIC0gMiAqIGNvcm5lclJhZGl1cywgY29ybmVyUmFkaXVzLCBbMCwgLTFdLFxuICAgICAgICAgICAgcGFkZGluZykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vY2hlY2sgZWxsaXBzZXNcbiAgICB2YXIgY2hlY2tJbkVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZykge1xuICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgeSAtPSBjZW50ZXJZO1xuXG4gICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgcmV0dXJuIChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpIDw9IDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGJvdHRvbSByaWdodCBxdWFydGVyIGNpcmNsZVxuICAgIGlmIChjaGVja0luRWxsaXBzZSh4LCB5LFxuICAgICAgICAgICAgY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNlbnRlclkgKyBoZWlnaHQgLyAyIC0gY29ybmVyUmFkaXVzLFxuICAgICAgICAgICAgY29ybmVyUmFkaXVzICogMiwgY29ybmVyUmFkaXVzICogMiwgcGFkZGluZykpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgYm90dG9tIGxlZnQgcXVhcnRlciBjaXJjbGVcbiAgICBpZiAoY2hlY2tJbkVsbGlwc2UoeCwgeSxcbiAgICAgICAgICAgIGNlbnRlclggLSB3aWR0aCAvIDIgKyBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgICBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNvcm5lclJhZGl1cyxcbiAgICAgICAgICAgIGNvcm5lclJhZGl1cyAqIDIsIGNvcm5lclJhZGl1cyAqIDIsIHBhZGRpbmcpKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvL3dlIG5lZWQgdG8gZm9yY2Ugb3BhY2l0eSB0byAxIHNpbmNlIHdlIG1pZ2h0IGhhdmUgc3RhdGUgYW5kIGluZm8gYm94ZXMuXG4gIC8vaGF2aW5nIG9wYXF1ZSBub2RlcyB3aGljaCBoYXZlIHN0YXRlIGFuZCBpbmZvIGJveGVzIGdpdmVzIHVucGxlYXNlbnQgcmVzdWx0cy5cbiAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZSA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIHBhcmVudE9wYWNpdHkgPSBub2RlLmVmZmVjdGl2ZU9wYWNpdHkoKTtcbiAgICBpZiAocGFyZW50T3BhY2l0eSA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKFwiXG4gICAgICAgICAgICArIG5vZGUuX3ByaXZhdGUuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdLnZhbHVlWzBdICsgXCIsXCJcbiAgICAgICAgICAgICsgbm9kZS5fcHJpdmF0ZS5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0udmFsdWVbMV0gKyBcIixcIlxuICAgICAgICAgICAgKyBub2RlLl9wcml2YXRlLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXS52YWx1ZVsyXSArIFwiLFwiXG4gICAgICAgICAgICArICgxICogbm9kZS5jc3MoJ29wYWNpdHknKSAqIHBhcmVudE9wYWNpdHkpICsgXCIpXCI7XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWxQYXRoID0gZnVuY3Rpb24gKFxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuICAgIC8vdmFyIGNvcm5lclJhZGl1cyA9ICQkLm1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG4gICAgdmFyIGNvcm5lclJhZGl1cyA9IE1hdGgubWluKGhhbGZXaWR0aCwgaGFsZkhlaWdodCk7XG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XG5cbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgLy8gU3RhcnQgYXQgdG9wIG1pZGRsZVxuICAgIGNvbnRleHQubW92ZVRvKDAsIC1oYWxmSGVpZ2h0KTtcbiAgICAvLyBBcmMgZnJvbSBtaWRkbGUgdG9wIHRvIHJpZ2h0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKGhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIGhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcbiAgICAvLyBBcmMgZnJvbSByaWdodCBzaWRlIHRvIGJvdHRvbVxuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEFyYyBmcm9tIGJvdHRvbSB0byBsZWZ0IHNpZGVcbiAgICBjb250ZXh0LmFyY1RvKC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIC1oYWxmV2lkdGgsIDAsIGNvcm5lclJhZGl1cyk7XG4gICAgLy8gQXJjIGZyb20gbGVmdCBzaWRlIHRvIHRvcEJvcmRlclxuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIDAsIC1oYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIC8vIEpvaW4gbGluZVxuICAgIGNvbnRleHQubGluZVRvKDAsIC1oYWxmSGVpZ2h0KTtcblxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgteCwgLXkpO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1NpbXBsZUNoZW1pY2FsID0gZnVuY3Rpb24gKFxuICAgICAgICAgIGNvbnRleHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbFBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2ltcGxlQ2hlbWljYWxMZWZ0Q2xvbmUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG4gICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgdmFyIG1hcmtlckJlZ2luWCA9IC0xICogTWF0aC5zaW4oTWF0aC5QSSAvIDMpO1xuICAgICAgdmFyIG1hcmtlckJlZ2luWSA9IE1hdGguY29zKE1hdGguUEkgLyAzKTtcbiAgICAgIHZhciBtYXJrZXJFbmRYID0gMDtcbiAgICAgIHZhciBtYXJrZXJFbmRZID0gbWFya2VyQmVnaW5ZO1xuXG4gICAgICBjb250ZXh0Lm1vdmVUbyhtYXJrZXJCZWdpblgsIG1hcmtlckJlZ2luWSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcbiAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDEsIDMgKiBNYXRoLlBJIC8gNiwgNSAqIE1hdGguUEkgLyA2KTtcblxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICB9XG4gIH1cbiAgO1xuXG4gIGZ1bmN0aW9uIHNpbXBsZUNoZW1pY2FsUmlnaHRDbG9uZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcblxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuXG4gICAgICB2YXIgbWFya2VyQmVnaW5YID0gMDtcbiAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWCA9IDEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICB2YXIgbWFya2VyRW5kWSA9IG1hcmtlckJlZ2luWTtcblxuICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgY29udGV4dC5saW5lVG8obWFya2VyRW5kWCwgbWFya2VyRW5kWSk7XG4gICAgICBjb250ZXh0LmFyYygwLCAwLCAxLCBNYXRoLlBJIC8gNiwgMyAqIE1hdGguUEkgLyA2KTtcblxuICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUoLWNlbnRlclgsIC1jZW50ZXJZKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGggPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3UGF0aChjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfTtcblxuICAkJC5zYmduLmRyYXdOdWNBY2lkRmVhdHVyZSA9IGZ1bmN0aW9uIChjb250ZXh0LCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIGNvcm5lclJhZGl1cykge1xuICAgIHZhciBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgdmFyIGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGNvbnRleHQubW92ZVRvKC1oYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0KTtcbiAgICBjb250ZXh0LmxpbmVUbyhoYWxmV2lkdGgsIDApO1xuICAgIGNvbnRleHQuYXJjVG8oaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwLCBoYWxmSGVpZ2h0LCBjb3JuZXJSYWRpdXMpO1xuICAgIGNvbnRleHQuYXJjVG8oLWhhbGZXaWR0aCwgaGFsZkhlaWdodCwgLWhhbGZXaWR0aCwgMCwgY29ybmVyUmFkaXVzKTtcbiAgICBjb250ZXh0LmxpbmVUbygtaGFsZldpZHRoLCAtaGFsZkhlaWdodCk7XG5cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgJCQuc2Jnbi5pc011bHRpbWVyID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xuICAgIGlmIChzYmduQ2xhc3MgJiYgc2JnbkNsYXNzLmluZGV4T2YoXCJtdWx0aW1lclwiKSAhPSAtMSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvL3RoaXMgZnVuY3Rpb24gaXMgY3JlYXRlZCB0byBoYXZlIHNhbWUgY29ybmVyIGxlbmd0aCB3aGVuXG4gIC8vY29tcGxleCdzIHdpZHRoIG9yIGhlaWdodCBpcyBjaGFuZ2VkXG4gICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMgPSBmdW5jdGlvbiAoY29ybmVyTGVuZ3RoLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy9jcCBzdGFuZHMgZm9yIGNvcm5lciBwcm9wb3J0aW9uXG4gICAgdmFyIGNwWCA9IGNvcm5lckxlbmd0aCAvIHdpZHRoO1xuICAgIHZhciBjcFkgPSBjb3JuZXJMZW5ndGggLyBoZWlnaHQ7XG5cbiAgICB2YXIgY29tcGxleFBvaW50cyA9IFstMSArIGNwWCwgLTEsIC0xLCAtMSArIGNwWSwgLTEsIDEgLSBjcFksIC0xICsgY3BYLFxuICAgICAgMSwgMSAtIGNwWCwgMSwgMSwgMSAtIGNwWSwgMSwgLTEgKyBjcFksIDEgLSBjcFgsIC0xXTtcblxuICAgIHJldHVybiBjb21wbGV4UG9pbnRzO1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd1BvcnRzVG9FbGxpcHNlU2hhcGUgPSBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLl9wcml2YXRlLmRhdGEucG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3J0ID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBvcnRzW2ldO1xuICAgICAgdmFyIHBvcnRYID0gcG9ydC54ICogd2lkdGggLyAxMDAgKyBjZW50ZXJYO1xuICAgICAgdmFyIHBvcnRZID0gcG9ydC55ICogaGVpZ2h0IC8gMTAwICsgY2VudGVyWTtcbiAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXG4gICAgICAgICAgICAgIHBvcnRYLCBwb3J0WSwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKHBvcnRYLCBwb3J0WSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjbG9zZXN0UG9pbnRbMF0sIGNsb3Nlc3RQb2ludFsxXSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAvL2FkZCBhIGxpdHRsZSBibGFjayBjaXJjbGUgdG8gcG9ydHNcbiAgICAgIHZhciBvbGRTdHlsZSA9IGNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5wb3J0O1xuICAgICAgJCQuc2Jnbi5kcmF3RWxsaXBzZShjb250ZXh0LCBwb3J0WCwgcG9ydFksIDIsIDIpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdzb3VyY2UgYW5kIHNpbmsnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ251Y2xlaWMgYWNpZCBmZWF0dXJlJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdjb21wbGV4Jyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdkaXNzb2NpYXRpb24nKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ21hY3JvbW9sZWN1bGUnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3NpbXBsZSBjaGVtaWNhbCcpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5ub2RlU2hhcGUuZW51bXMucHVzaCgndW5zcGVjaWZpZWQgZW50aXR5Jyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdvbWl0dGVkIHByb2Nlc3MnKTtcbiAgY3lTdHlsZVByb3BlcnRpZXMudHlwZXMubm9kZVNoYXBlLmVudW1zLnB1c2goJ3VuY2VydGFpbiBwcm9jZXNzJyk7XG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLm5vZGVTaGFwZS5lbnVtcy5wdXNoKCdhc3NvY2lhdGlvbicpO1xuXG4gIGN5U3R5bGVQcm9wZXJ0aWVzLnR5cGVzLmxpbmVTdHlsZS5lbnVtcy5wdXNoKCdjb25zdW1wdGlvbicpO1xuICBjeVN0eWxlUHJvcGVydGllcy50eXBlcy5saW5lU3R5bGUuZW51bXMucHVzaCgncHJvZHVjdGlvbicpO1xuXG4gICQkLnNiZ24ucmVnaXN0ZXJTYmduTm9kZVNoYXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydwcm9jZXNzJ10gPSB7XG4gICAgICBwb2ludHM6IGN5TWF0aC5nZW5lcmF0ZVVuaXROZ29uUG9pbnRzRml0VG9TcXVhcmUoNCwgMCksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd1BvcnRzVG9Qb2x5Z29uU2hhcGUoY29udGV4dCwgbm9kZSwgdGhpcy5wb2ludHMpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIG5vZGVYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgbm9kZVkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgcmV0dXJuIGN5TWF0aC5wb2x5Z29uSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICB4LCB5LFxuICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHJldHVybiBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksIGN5QmFzZU5vZGVTaGFwZXNbJ3Byb2Nlc3MnXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbJ29taXR0ZWQgcHJvY2VzcyddID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydvbWl0dGVkIHByb2Nlc3MnXS5sYWJlbCA9ICdcXFxcXFxcXCc7XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzWyd1bmNlcnRhaW4gcHJvY2VzcyddID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgY3lCYXNlTm9kZVNoYXBlc1sncHJvY2VzcyddKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWyd1bmNlcnRhaW4gcHJvY2VzcyddLmxhYmVsID0gJz8nO1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInVuc3BlY2lmaWVkIGVudGl0eVwiXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgc2JnbkNsYXNzID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmNsYXNzO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci51bnNwZWNpZmllZEVudGl0eShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5pbnRlcnNlY3RMaW5lKGNlbnRlclgsIGNlbnRlclksIHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzKTtcbiAgICAgICAgcmV0dXJuICQkLnNiZ24uY2xvc2VzdEludGVyc2VjdGlvblBvaW50KFt4LCB5XSwgaW50ZXJzZWN0aW9ucyk7XG5cbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBub2RlQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnQoeCwgeSxcbiAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclkpO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdID0ge1xuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSk7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgLy9hZGQgbXVsdGltZXIgc2hhcGVcbiAgICAgICAgICAkJC5zYmduLmRyYXdTaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIHRydWUsXG4gICAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICAgICAgLy9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3U2ltcGxlQ2hlbWljYWwoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5zaW1wbGVDaGVtaWNhbChjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC0gcGFkZGluZywgaGVpZ2h0IC0gcGFkZGluZywgY2xvbmVNYXJrZXIsIGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XG4vLyAgICAgICAgJCQuc2Jnbi5kcmF3RHluYW1pY0xhYmVsVGV4dChjb250ZXh0LCBub2RlUHJvcCk7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcInNpbXBsZSBjaGVtaWNhbFwiXS5tdWx0aW1lclBhZGRpbmc7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IFtdO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJJbnRlcnNlY3Rpb25MaW5lcyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLCB3aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodCwgeCwgeSwgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuXG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wic2ltcGxlIGNoZW1pY2FsXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LFxuICAgICAgICAgICAgICAgIHBhZGRpbmcsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wiZWxsaXBzZVwiXS5jaGVja1BvaW50KHgsIHksXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nLCB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUNoZWNrUG9pbnQgfHwgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCB8fCBtdWx0aW1lckNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50cyg0LCAwKSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm1hY3JvbW9sZWN1bGVcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY2xvbmVNYXJrZXIgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXI7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdSb3VuZFJlY3RhbmdsZVBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Um91bmRSZWN0YW5nbGVQYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm1hY3JvbW9sZWN1bGUoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3U3RhdGVBbmRJbmZvcyhub2RlLCBjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcblxuLy8gICAgICAgIHZhciBub2RlUHJvcCA9IHsnbGFiZWwnOiBsYWJlbCwgJ2NlbnRlclgnOiBjZW50ZXJYLCAnY2VudGVyWSc6IGNlbnRlclksXG4vLyAgICAgICAgICAnb3BhY2l0eSc6IG5vZGUuX3ByaXZhdGUuc3R5bGVbJ3RleHQtb3BhY2l0eSddLnZhbHVlLCAnd2lkdGgnOiBub2RlLndpZHRoKCksICdoZWlnaHQnOiBub2RlLmhlaWdodCgpfTtcbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvSW50ZXJzZWN0TGluZXMgPSAkJC5zYmduLmludGVyc2VjdExpbmVTdGF0ZUFuZEluZm9Cb3hlcyhcbiAgICAgICAgICAgICAgICBub2RlLCB4LCB5KTtcblxuICAgICAgICB2YXIgbm9kZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMgPSAkJC5zYmduLnJvdW5kUmVjdGFuZ2xlSW50ZXJzZWN0TGluZShcbiAgICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMsIHBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLCBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzKTtcblxuICAgICAgICByZXR1cm4gJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQoW3gsIHldLCBpbnRlcnNlY3Rpb25zKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKSArIHRocmVzaG9sZDtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJtYWNyb21vbGVjdWxlXCJdLm11bHRpbWVyUGFkZGluZztcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludCh4LCB5LCBwYWRkaW5nLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvQ2hlY2tQb2ludCA9ICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzKHgsIHksIG5vZGUsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckNoZWNrUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCQkLnNiZ24uaXNNdWx0aW1lcihub2RlKSkge1xuICAgICAgICAgIG11bHRpbWVyQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KHgsIHksIHBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1snYXNzb2NpYXRpb24nXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbJ2VsbGlwc2UnXS5kcmF3KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xuICAgICAgfSxcbiAgICAgIGludGVyc2VjdExpbmU6IGZ1bmN0aW9uIChub2RlLCB4LCB5LCBwb3J0SWQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSBjeU1hdGguaW50ZXJzZWN0TGluZUVsbGlwc2UoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLFxuICAgICAgICAgICAgICAgIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG5cbiAgICAgICAgcmV0dXJuIGludGVyc2VjdDtcbiAgICAgIH0sXG4gICAgICBjaGVja1BvaW50OiBmdW5jdGlvbiAoeCwgeSwgbm9kZSwgdGhyZXNob2xkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICB4IC09IGNlbnRlclg7XG4gICAgICAgIHkgLT0gY2VudGVyWTtcblxuICAgICAgICB4IC89ICh3aWR0aCAvIDIgKyBwYWRkaW5nKTtcbiAgICAgICAgeSAvPSAoaGVpZ2h0IC8gMiArIHBhZGRpbmcpO1xuXG4gICAgICAgIHJldHVybiAoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSA8PSAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcImRpc3NvY2lhdGlvblwiXSA9IHtcbiAgICAgIGRyYXc6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcblxuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LnNjYWxlKHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCk7XG5cbiAgICAgICAgLy8gQXQgb3JpZ2luLCByYWRpdXMgMSwgMCB0byAycGlcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgMCwgTWF0aC5QSSAqIDIgKiAwLjk5OSwgZmFsc2UpOyAvLyAqMC45OTkgYi9jIGNocm9tZSByZW5kZXJpbmcgYnVnIG9uIGZ1bGwgY2lyY2xlXG5cbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSg0IC8gd2lkdGgsIDQgLyBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uZHJhd0VsbGlwc2UoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICAkJC5zYmduLmRyYXdQb3J0c1RvRWxsaXBzZVNoYXBlKGNvbnRleHQsIG5vZGUpO1xuXG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBub2RlWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBwYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcblxuICAgICAgICByZXR1cm4gY3lNYXRoLmludGVyc2VjdExpbmVFbGxpcHNlKFxuICAgICAgICAgICAgICAgIHgsIHksXG4gICAgICAgICAgICAgICAgbm9kZVgsXG4gICAgICAgICAgICAgICAgbm9kZVksXG4gICAgICAgICAgICAgICAgd2lkdGggLyAyICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgICBoZWlnaHQgLyAyICsgcGFkZGluZyk7XG4gICAgICB9LFxuICAgICAgY2hlY2tQb2ludDogZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG5cbiAgICAgICAgeCAtPSBjZW50ZXJYO1xuICAgICAgICB5IC09IGNlbnRlclk7XG5cbiAgICAgICAgeCAvPSAod2lkdGggLyAyICsgcGFkZGluZyk7XG4gICAgICAgIHkgLz0gKGhlaWdodCAvIDIgKyBwYWRkaW5nKTtcblxuICAgICAgICByZXR1cm4gKE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgPD0gMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdID0ge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICAgIG11bHRpbWVyUGFkZGluZzogNSxcbiAgICAgIGNvcm5lckxlbmd0aDogMTIsXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLm91dGVyV2lkdGgoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUub3V0ZXJIZWlnaHQoKS0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zO1xuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMgPSAkJC5zYmduLmdlbmVyYXRlQ29tcGxleFNoYXBlUG9pbnRzKGNvcm5lckxlbmd0aCxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgIGRyYXdQb2x5Z29uUGF0aChjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbiAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3UG9seWdvblBhdGgoY29udGV4dCxcbiAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgJCQuc2Jnbi5jbG9uZU1hcmtlci5jb21wbGV4KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY29ybmVyTGVuZ3RoLCBjbG9uZU1hcmtlciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgJCQuc2Jnbi5mb3JjZU9wYWNpdHlUb09uZShub2RlLCBjb250ZXh0KTtcbiAgICAgICAgJCQuc2Jnbi5kcmF3Q29tcGxleFN0YXRlQW5kSW5mbyhjb250ZXh0LCBub2RlLCBzdGF0ZUFuZEluZm9zLCBjZW50ZXJYLCBjZW50ZXJZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgIH0sXG4vLyAgICAgIGludGVyc2VjdExpbmU6IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5pbnRlcnNlY3RMaW5lLFxuLy8gICAgICBjaGVja1BvaW50OiBjeUJhc2VOb2RlU2hhcGVzW1wicm91bmRyZWN0YW5nbGVcIl0uY2hlY2tQb2ludFxuICAgICAgaW50ZXJzZWN0TGluZTogZnVuY3Rpb24gKG5vZGUsIHgsIHksIHBvcnRJZCkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUub3V0ZXJXaWR0aCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5vdXRlckhlaWdodCgpIC0gcGFyc2VGbG9hdChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpO1xuICAgICAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ubXVsdGltZXJQYWRkaW5nO1xuICAgICAgICB2YXIgY29ybmVyTGVuZ3RoID0gY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0uY29ybmVyTGVuZ3RoO1xuXG4gICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyA9ICQkLnNiZ24uZ2VuZXJhdGVDb21wbGV4U2hhcGVQb2ludHMoY29ybmVyTGVuZ3RoLFxuICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzKFxuICAgICAgICAgICAgICAgIG5vZGUsIHgsIHkpO1xuXG4gICAgICAgIHZhciBub2RlSW50ZXJzZWN0TGluZXMgPSBjeU1hdGgucG9seWdvbkludGVyc2VjdExpbmUoXG4gICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCxcbiAgICAgICAgICAgICAgICBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICBwYWRkaW5nKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gY3lNYXRoLnBvbHlnb25JbnRlcnNlY3RMaW5lKFxuICAgICAgICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgICAgICAgIGN5QmFzZU5vZGVTaGFwZXNbXCJjb21wbGV4XCJdLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGggLyAyLCBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzLmNvbmNhdChub2RlSW50ZXJzZWN0TGluZXMsIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgd2lkdGggPSAobm9kZS5vdXRlcldpZHRoKCkgLSBwYXJzZUZsb2F0KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkpICsgdGhyZXNob2xkO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gKG5vZGUub3V0ZXJIZWlnaHQoKSAtIHBhcnNlRmxvYXQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSkgKyB0aHJlc2hvbGQ7XG4gICAgICAgIHZhciBwYWRkaW5nID0gcGFyc2VJbnQobm9kZS5jc3MoJ2JvcmRlci13aWR0aCcpKSAvIDI7XG4gICAgICAgIHZhciBtdWx0aW1lclBhZGRpbmcgPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjb3JuZXJMZW5ndGggPSBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5jb3JuZXJMZW5ndGg7XG5cbiAgICAgICAgY3lCYXNlTm9kZVNoYXBlc1tcImNvbXBsZXhcIl0ucG9pbnRzID0gJCQuc2Jnbi5nZW5lcmF0ZUNvbXBsZXhTaGFwZVBvaW50cyhjb3JuZXJMZW5ndGgsXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIG5vZGVDaGVja1BvaW50ID0gY3lNYXRoLnBvaW50SW5zaWRlUG9seWdvbih4LCB5LCBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgPSAkJC5zYmduLmNoZWNrUG9pbnRTdGF0ZUFuZEluZm9Cb3hlcyh4LCB5LCBub2RlLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCk7XG5cbiAgICAgICAgLy9jaGVjayB3aGV0aGVyIHNiZ24gY2xhc3MgaW5jbHVkZXMgbXVsdGltZXIgc3Vic3RyaW5nIG9yIG5vdFxuICAgICAgICB2YXIgbXVsdGltZXJDaGVja1BvaW50ID0gZmFsc2U7XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckNoZWNrUG9pbnQgPSBjeU1hdGgucG9pbnRJbnNpZGVQb2x5Z29uKHgsIHksXG4gICAgICAgICAgICAgICAgICBjeUJhc2VOb2RlU2hhcGVzW1wiY29tcGxleFwiXS5wb2ludHMsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLCBjZW50ZXJZICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgWzAsIC0xXSwgcGFkZGluZyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQ2hlY2tQb2ludCB8fCBzdGF0ZUFuZEluZm9DaGVja1BvaW50IHx8IG11bHRpbWVyQ2hlY2tQb2ludDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdID0ge1xuICAgICAgcG9pbnRzOiBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApLFxuICAgICAgbXVsdGltZXJQYWRkaW5nOiA1LFxuICAgICAgZHJhdzogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICA7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICAvL2FkZCBtdWx0aW1lciBzaGFwZVxuICAgICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjZW50ZXJYICsgbXVsdGltZXJQYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZywgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2VudGVyWCArIG11bHRpbWVyUGFkZGluZywgY2VudGVyWSArIG11bHRpbWVyUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgbm9kZS5jc3MoJ2JhY2tncm91bmQtb3BhY2l0eScpKTtcblxuICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQkLnNiZ24uZHJhd051Y0FjaWRGZWF0dXJlKGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsIGNlbnRlclgsXG4gICAgICAgICAgICAgICAgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICQkLnNiZ24uY2xvbmVNYXJrZXIubnVjbGVpY0FjaWRGZWF0dXJlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCwgY2xvbmVNYXJrZXIsIGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vZGUuY3NzKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSk7XG5cbi8vICAgICAgICB2YXIgbm9kZVByb3AgPSB7J2xhYmVsJzogbGFiZWwsICdjZW50ZXJYJzogY2VudGVyWCwgJ2NlbnRlclknOiBjZW50ZXJZLFxuLy8gICAgICAgICAgJ29wYWNpdHknOiBub2RlLl9wcml2YXRlLnN0eWxlWyd0ZXh0LW9wYWNpdHknXS52YWx1ZSwgJ3dpZHRoJzogbm9kZS53aWR0aCgpLCAnaGVpZ2h0Jzogbm9kZS5oZWlnaHQoKX07XG5cbi8vICAgICAgICAkJC5zYmduLmRyYXdEeW5hbWljTGFiZWxUZXh0KGNvbnRleHQsIG5vZGVQcm9wKTtcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgICQkLnNiZ24uZm9yY2VPcGFjaXR5VG9PbmUobm9kZSwgY29udGV4dCk7XG4gICAgICAgICQkLnNiZ24uZHJhd1N0YXRlQW5kSW5mb3Mobm9kZSwgY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICB9LFxuICAgICAgZHJhd1BhdGg6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG5cbiAgICAgIH0sXG4gICAgICBpbnRlcnNlY3RMaW5lOiBmdW5jdGlvbiAobm9kZSwgeCwgeSwgcG9ydElkKSB7XG4gICAgICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgICAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICAgICAgdmFyIG11bHRpbWVyUGFkZGluZyA9IGN5QmFzZU5vZGVTaGFwZXNbXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiXS5tdWx0aW1lclBhZGRpbmc7XG4gICAgICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lU3RhdGVBbmRJbmZvQm94ZXMoXG4gICAgICAgICAgICAgICAgbm9kZSwgeCwgeSk7XG5cbiAgICAgICAgdmFyIG5vZGVJbnRlcnNlY3RMaW5lcyA9ICQkLnNiZ24ubnVjbGVpY0FjaWRJbnRlcnNlY3Rpb25MaW5lKG5vZGUsXG4gICAgICAgICAgICAgICAgeCwgeSwgY2VudGVyWCwgY2VudGVyWSwgY29ybmVyUmFkaXVzKTtcblxuICAgICAgICAvL2NoZWNrIHdoZXRoZXIgc2JnbiBjbGFzcyBpbmNsdWRlcyBtdWx0aW1lciBzdWJzdHJpbmcgb3Igbm90XG4gICAgICAgIHZhciBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gW107XG4gICAgICAgIGlmICgkJC5zYmduLmlzTXVsdGltZXIobm9kZSkpIHtcbiAgICAgICAgICBtdWx0aW1lckludGVyc2VjdGlvbkxpbmVzID0gJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUobm9kZSxcbiAgICAgICAgICAgICAgICAgIHgsIHksIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludGVyc2VjdGlvbnMgPSBzdGF0ZUFuZEluZm9JbnRlcnNlY3RMaW5lcy5jb25jYXQobm9kZUludGVyc2VjdExpbmVzLFxuICAgICAgICAgICAgICAgIG11bHRpbWVySW50ZXJzZWN0aW9uTGluZXMpO1xuXG4gICAgICAgIHJldHVybiAkJC5zYmduLmNsb3Nlc3RJbnRlcnNlY3Rpb25Qb2ludChbeCwgeV0sIGludGVyc2VjdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUG9pbnQ6IGZ1bmN0aW9uICh4LCB5LCBub2RlLCB0aHJlc2hvbGQpIHtcbiAgICAgICAgdmFyIGNlbnRlclggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgICAgICB2YXIgbXVsdGltZXJQYWRkaW5nID0gY3lCYXNlTm9kZVNoYXBlc1tcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCJdLm11bHRpbWVyUGFkZGluZztcbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvcm5lclJhZGl1cyA9IGN5TWF0aC5nZXRSb3VuZFJlY3RhbmdsZVJhZGl1cyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICB2YXIgbm9kZUNoZWNrUG9pbnQgPSAkJC5zYmduLm51Y2xlaWNBY2lkQ2hlY2tQb2ludCh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIG5vZGUsIHRocmVzaG9sZCwgdGhpcy5wb2ludHMsIGNvcm5lclJhZGl1cyk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9DaGVja1BvaW50ID0gJCQuc2Jnbi5jaGVja1BvaW50U3RhdGVBbmRJbmZvQm94ZXMoeCwgeSwgbm9kZSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQpO1xuXG4gICAgICAgIC8vY2hlY2sgd2hldGhlciBzYmduIGNsYXNzIGluY2x1ZGVzIG11bHRpbWVyIHN1YnN0cmluZyBvciBub3RcbiAgICAgICAgdmFyIG11bHRpbWVyQ2hlY2tQb2ludCA9IGZhbHNlO1xuICAgICAgICBpZiAoJCQuc2Jnbi5pc011bHRpbWVyKG5vZGUpKSB7XG4gICAgICAgICAgbXVsdGltZXJDaGVja1BvaW50ID0gJCQuc2Jnbi5udWNsZWljQWNpZENoZWNrUG9pbnQoeCwgeSxcbiAgICAgICAgICAgICAgICAgIGNlbnRlclggKyBtdWx0aW1lclBhZGRpbmcsIGNlbnRlclkgKyBtdWx0aW1lclBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICBub2RlLCB0aHJlc2hvbGQsIHRoaXMucG9pbnRzLCBjb3JuZXJSYWRpdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVDaGVja1BvaW50IHx8IHN0YXRlQW5kSW5mb0NoZWNrUG9pbnQgfHwgbXVsdGltZXJDaGVja1BvaW50O1xuICAgICAgfVxuICAgIH07XG4gICAgY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXSA9IHtcbiAgICAgIHBvaW50czogY3lNYXRoLmdlbmVyYXRlVW5pdE5nb25Qb2ludHMoNCwgMCksXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICAgICAgdmFyIGNlbnRlclkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gbm9kZS53aWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICB2YXIgcHRzID0gY3lCYXNlTm9kZVNoYXBlc1tcInNvdXJjZSBhbmQgc2lua1wiXS5wb2ludHM7XG4gICAgICAgIHZhciBjbG9uZU1hcmtlciA9IG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlcjtcblxuICAgICAgICAkJC5zYmduLmRyYXdFbGxpcHNlKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgICAgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgY29udGV4dC5zY2FsZSh3aWR0aCAqIE1hdGguc3FydCgyKSAvIDIsIGhlaWdodCAqIE1hdGguc3FydCgyKSAvIDIpO1xuXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHB0c1syXSwgcHRzWzNdKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8ocHRzWzZdLCBwdHNbN10pO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQuc2NhbGUoMiAvICh3aWR0aCAqIE1hdGguc3FydCgyKSksIDIgLyAoaGVpZ2h0ICogTWF0aC5zcXJ0KDIpKSk7XG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAkJC5zYmduLmNsb25lTWFya2VyLnNvdXJjZUFuZFNpbmsoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlcixcbiAgICAgICAgICAgICAgICBub2RlLmNzcygnYmFja2dyb3VuZC1vcGFjaXR5JykpO1xuXG4gICAgICB9LFxuICAgICAgaW50ZXJzZWN0TGluZTogY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uaW50ZXJzZWN0TGluZSxcbiAgICAgIGNoZWNrUG9pbnQ6IGN5QmFzZU5vZGVTaGFwZXNbXCJlbGxpcHNlXCJdLmNoZWNrUG9pbnRcbiAgICB9O1xuICB9O1xuXG4gICQkLnNiZ24uZHJhd0VsbGlwc2UgPSBmdW5jdGlvbiAoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgIC8vJCQuc2Jnbi5kcmF3RWxsaXBzZVBhdGgoY29udGV4dCwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy9jb250ZXh0LmZpbGwoKTtcbiAgICBjeUJhc2VOb2RlU2hhcGVzWydlbGxpcHNlJ10uZHJhdyhjb250ZXh0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfTtcblxuICAkJC5zYmduLmNsb25lTWFya2VyID0ge1xuICAgIHVuc3BlY2lmaWVkRW50aXR5OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgb2xkR2xvYmFsQWxwaGEgPSBjb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb3BhY2l0eTtcbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG5cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICB2YXIgbWFya2VyQmVnaW5YID0gLTEgKiBNYXRoLnNpbihNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJCZWdpblkgPSBNYXRoLmNvcyhNYXRoLlBJIC8gMyk7XG4gICAgICAgIHZhciBtYXJrZXJFbmRYID0gMSAqIE1hdGguc2luKE1hdGguUEkgLyAzKTtcbiAgICAgICAgdmFyIG1hcmtlckVuZFkgPSBtYXJrZXJCZWdpblk7XG5cbiAgICAgICAgY29udGV4dC5tb3ZlVG8obWFya2VyQmVnaW5YLCBtYXJrZXJCZWdpblkpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhtYXJrZXJFbmRYLCBtYXJrZXJFbmRZKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMSwgTWF0aC5QSSAvIDYsIDUgKiBNYXRoLlBJIC8gNik7XG5cbiAgICAgICAgY29udGV4dC5zY2FsZSgyIC8gd2lkdGgsIDIgLyBoZWlnaHQpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICB9XG4gICAgfSxcbiAgICBzb3VyY2VBbmRTaW5rOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KSB7XG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLnVuc3BlY2lmaWVkRW50aXR5KGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcbiAgICB9LFxuICAgIHNpbXBsZUNoZW1pY2FsOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICBpZiAoY2xvbmVNYXJrZXIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY29ybmVyUmFkaXVzID0gTWF0aC5taW4od2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblxuICAgICAgICB2YXIgZmlyc3RDaXJjbGVDZW50ZXJYID0gY2VudGVyWCAtIHdpZHRoIC8gMiArIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIGZpcnN0Q2lyY2xlQ2VudGVyWSA9IGNlbnRlclk7XG4gICAgICAgIHZhciBzZWNvbmRDaXJjbGVDZW50ZXJYID0gY2VudGVyWCArIHdpZHRoIC8gMiAtIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIHNlY29uZENpcmNsZUNlbnRlclkgPSBjZW50ZXJZO1xuXG4gICAgICAgIHNpbXBsZUNoZW1pY2FsTGVmdENsb25lKGNvbnRleHQsIGZpcnN0Q2lyY2xlQ2VudGVyWCwgZmlyc3RDaXJjbGVDZW50ZXJZLFxuICAgICAgICAgICAgICAgIDIgKiBjb3JuZXJSYWRpdXMsIDIgKiBjb3JuZXJSYWRpdXMsIGNsb25lTWFya2VyLCBvcGFjaXR5KTtcblxuICAgICAgICBzaW1wbGVDaGVtaWNhbFJpZ2h0Q2xvbmUoY29udGV4dCwgc2Vjb25kQ2lyY2xlQ2VudGVyWCwgc2Vjb25kQ2lyY2xlQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAyICogY29ybmVyUmFkaXVzLCAyICogY29ybmVyUmFkaXVzLCBjbG9uZU1hcmtlciwgb3BhY2l0eSk7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHZhciByZWNQb2ludHMgPSBjeU1hdGguZ2VuZXJhdGVVbml0TmdvblBvaW50c0ZpdFRvU3F1YXJlKDQsIDApO1xuICAgICAgICB2YXIgY2xvbmVYID0gY2VudGVyWDtcbiAgICAgICAgdmFyIGNsb25lWSA9IGNlbnRlclkgKyAzIC8gNCAqIGNvcm5lclJhZGl1cztcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aCAtIDIgKiBjb3JuZXJSYWRpdXM7XG4gICAgICAgIHZhciBjbG9uZUhlaWdodCA9IGNvcm5lclJhZGl1cyAvIDI7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsIGNsb25lWCwgY2xvbmVZLCBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgcmVjUG9pbnRzKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBlcnR1cmJpbmdBZ2VudDogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDg7XG5cbiAgICAgICAgdmFyIG1hcmtlclBvaW50cyA9IFstNSAvIDYsIC0xLCA1IC8gNiwgLTEsIDEsIDEsIC0xLCAxXTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgcmVuZGVyZXIuZHJhd1BvbHlnb24oY29udGV4dCxcbiAgICAgICAgICAgICAgICBjbG9uZVgsIGNsb25lWSxcbiAgICAgICAgICAgICAgICBjbG9uZVdpZHRoLCBjbG9uZUhlaWdodCwgbWFya2VyUG9pbnRzKTtcblxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9sZFN0eWxlO1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gb2xkR2xvYmFsQWxwaGE7XG4gICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG51Y2xlaWNBY2lkRmVhdHVyZTogZnVuY3Rpb24gKGNvbnRleHQsIGNlbnRlclgsIGNlbnRlclksXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSkge1xuICAgICAgaWYgKGNsb25lTWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0IC8gNDtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgMyAqIGhlaWdodCAvIDg7XG5cbiAgICAgICAgdmFyIG9sZFN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJCQuc2Jnbi5jb2xvcnMuY2xvbmU7XG4gICAgICAgIHZhciBvbGRHbG9iYWxBbHBoYSA9IGNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvcGFjaXR5O1xuXG4gICAgICAgIHZhciBjb3JuZXJSYWRpdXMgPSBjeU1hdGguZ2V0Um91bmRSZWN0YW5nbGVSYWRpdXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgJCQuc2Jnbi5kcmF3TnVjQWNpZEZlYXR1cmUoY29udGV4dCwgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksIGNvcm5lclJhZGl1cywgb3BhY2l0eSk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvbGRTdHlsZTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9sZEdsb2JhbEFscGhhO1xuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtYWNyb21vbGVjdWxlOiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNsb25lTWFya2VyLCBpc011bHRpbWVyLCBvcGFjaXR5KSB7XG4gICAgICAkJC5zYmduLmNsb25lTWFya2VyLm51Y2xlaWNBY2lkRmVhdHVyZShjb250ZXh0LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LCBjbG9uZU1hcmtlciwgaXNNdWx0aW1lciwgb3BhY2l0eSk7XG4gICAgfSxcbiAgICBjb21wbGV4OiBmdW5jdGlvbiAoY29udGV4dCwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsIGNvcm5lckxlbmd0aCwgY2xvbmVNYXJrZXIsIGlzTXVsdGltZXIsIG9wYWNpdHkpIHtcbiAgICAgIGlmIChjbG9uZU1hcmtlciAhPSBudWxsKSB7XG4gICAgICAgIHZhciBjcFggPSBjb3JuZXJMZW5ndGggLyB3aWR0aDtcbiAgICAgICAgdmFyIGNwWSA9IGNvcm5lckxlbmd0aCAvIGhlaWdodDtcbiAgICAgICAgdmFyIGNsb25lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNsb25lSGVpZ2h0ID0gaGVpZ2h0ICogY3BZIC8gMjtcbiAgICAgICAgdmFyIGNsb25lWCA9IGNlbnRlclg7XG4gICAgICAgIHZhciBjbG9uZVkgPSBjZW50ZXJZICsgaGVpZ2h0IC8gMiAtIGNsb25lSGVpZ2h0IC8gMjtcblxuICAgICAgICB2YXIgbWFya2VyUG9pbnRzID0gWy0xLCAtMSwgMSwgLTEsIDEgLSBjcFgsIDEsIC0xICsgY3BYLCAxXTtcblxuICAgICAgICB2YXIgb2xkU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAkJC5zYmduLmNvbG9ycy5jbG9uZTtcbiAgICAgICAgdmFyIG9sZEdsb2JhbEFscGhhID0gY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cbiAgICAgICAgZHJhd1BvbHlnb25QYXRoKGNvbnRleHQsXG4gICAgICAgICAgICAgICAgY2xvbmVYLCBjbG9uZVksXG4gICAgICAgICAgICAgICAgY2xvbmVXaWR0aCwgY2xvbmVIZWlnaHQsIG1hcmtlclBvaW50cyk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkU3R5bGU7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvbGRHbG9iYWxBbHBoYTtcblxuLy8gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJCQuc2Jnbi5jbG9zZXN0SW50ZXJzZWN0aW9uUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQsIGludGVyc2VjdGlvbnMpIHtcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMClcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBjbG9zZXN0SW50ZXJzZWN0aW9uID0gW107XG4gICAgdmFyIG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJzZWN0aW9ucy5sZW5ndGg7IGkgPSBpICsgMikge1xuICAgICAgdmFyIGNoZWNrUG9pbnQgPSBbaW50ZXJzZWN0aW9uc1tpXSwgaW50ZXJzZWN0aW9uc1tpICsgMV1dO1xuICAgICAgdmFyIGRpc3RhbmNlID0gY3lNYXRoLmNhbGN1bGF0ZURpc3RhbmNlKHBvaW50LCBjaGVja1BvaW50KTtcblxuICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgY2xvc2VzdEludGVyc2VjdGlvbiA9IGNoZWNrUG9pbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb3Nlc3RJbnRlcnNlY3Rpb247XG4gIH07XG5cbiAgJCQuc2Jnbi5udWNsZWljQWNpZEludGVyc2VjdGlvbkxpbmUgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSwgbm9kZVgsIG5vZGVZLCBjb3JuZXJSYWRpdXMpIHtcbiAgICB2YXIgbm9kZVggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLng7XG4gICAgdmFyIG5vZGVZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciB3aWR0aCA9IG5vZGUud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gbm9kZS5oZWlnaHQoKTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcbiAgICB2YXIgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG5cbiAgICB2YXIgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoIC0gcGFkZGluZztcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCB0b3BTdGFydFgsIHRvcFN0YXJ0WSwgdG9wRW5kWCwgdG9wRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJpZ2h0IHNlZ21lbnQsIHRvcCB0byBib3R0b21cbiAgICB7XG4gICAgICB2YXIgcmlnaHRTdGFydFggPSBub2RlWCArIGhhbGZXaWR0aCArIHBhZGRpbmc7XG4gICAgICB2YXIgcmlnaHRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0RW5kWCA9IHJpZ2h0U3RhcnRYO1xuICAgICAgdmFyIHJpZ2h0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJvdHRvbSBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciBib3R0b21TdGFydFkgPSBub2RlWSArIGhhbGZIZWlnaHQgKyBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbUVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWSA9IGJvdHRvbVN0YXJ0WTtcblxuICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeCwgeSwgbm9kZVgsIG5vZGVZLCBib3R0b21TdGFydFgsIGJvdHRvbVN0YXJ0WSwgYm90dG9tRW5kWCwgYm90dG9tRW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSwgbGVmdFN0YXJ0WCwgbGVmdFN0YXJ0WSwgbGVmdEVuZFgsIGxlZnRFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaW50ZXJzZWN0aW9ucyB3aXRoIGFyYyBzZWdtZW50cywgd2UgaGF2ZSBvbmx5IHR3byBhcmNzIGZvclxuICAgIC8vbnVjbGVpYyBhY2lkIGZlYXR1cmVzXG4gICAgdmFyIGFyY0ludGVyc2VjdGlvbnM7XG5cbiAgICAvLyBCb3R0b20gUmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcbiAgICAgICAgICAgICAgYm90dG9tUmlnaHRDZW50ZXJYLCBib3R0b21SaWdodENlbnRlclksIGNvcm5lclJhZGl1cyArIHBhZGRpbmcpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIGludGVyc2VjdGlvbiBpcyBvbiB0aGUgZGVzaXJlZCBxdWFydGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgIGlmIChhcmNJbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1swXSA+PSBib3R0b21SaWdodENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21SaWdodENlbnRlclkpIHtcbiAgICAgICAgcmV0dXJuIFthcmNJbnRlcnNlY3Rpb25zWzBdLCBhcmNJbnRlcnNlY3Rpb25zWzFdXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gTGVmdFxuICAgIHtcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzO1xuICAgICAgdmFyIGJvdHRvbUxlZnRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgsIHksIG5vZGVYLCBub2RlWSxcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xuICAgICAgICByZXR1cm4gW2FyY0ludGVyc2VjdGlvbnNbMF0sIGFyY0ludGVyc2VjdGlvbnNbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107IC8vIGlmIG5vdGhpbmdcbiAgfTtcblxuICAvL3RoaXMgZnVuY3Rpb24gZ2l2ZXMgdGhlIGludGVyc2VjdGlvbnMgb2YgYW55IGxpbmUgd2l0aCBhIHJvdW5kIHJlY3RhbmdsZSBcbiAgJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIG5vZGVYLCBub2RlWSwgd2lkdGgsIGhlaWdodCwgY29ybmVyUmFkaXVzLCBwYWRkaW5nKSB7XG5cbiAgICB2YXIgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIHZhciBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcblxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBzdHJhaWdodCBsaW5lIHNlZ21lbnRzXG4gICAgdmFyIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBbXTtcblxuICAgIC8vIFRvcCBzZWdtZW50LCBsZWZ0IHRvIHJpZ2h0XG4gICAge1xuICAgICAgdmFyIHRvcFN0YXJ0WCA9IG5vZGVYIC0gaGFsZldpZHRoICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciB0b3BTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgLSBwYWRkaW5nO1xuICAgICAgdmFyIHRvcEVuZFggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG4gICAgICB2YXIgdG9wRW5kWSA9IHRvcFN0YXJ0WTtcblxuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGN5TWF0aC5maW5pdGVMaW5lc0ludGVyc2VjdChcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIHRvcFN0YXJ0WCwgdG9wU3RhcnRZLCB0b3BFbmRYLCB0b3BFbmRZLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoaW50ZXJzZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSaWdodCBzZWdtZW50LCB0b3AgdG8gYm90dG9tXG4gICAge1xuICAgICAgdmFyIHJpZ2h0U3RhcnRYID0gbm9kZVggKyBoYWxmV2lkdGggKyBwYWRkaW5nO1xuICAgICAgdmFyIHJpZ2h0U3RhcnRZID0gbm9kZVkgLSBoYWxmSGVpZ2h0ICsgY29ybmVyUmFkaXVzIC0gcGFkZGluZztcbiAgICAgIHZhciByaWdodEVuZFggPSByaWdodFN0YXJ0WDtcbiAgICAgIHZhciByaWdodEVuZFkgPSBub2RlWSArIGhhbGZIZWlnaHQgLSBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgcmlnaHRTdGFydFgsIHJpZ2h0U3RhcnRZLCByaWdodEVuZFgsIHJpZ2h0RW5kWSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGludGVyc2VjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIHNlZ21lbnQsIGxlZnQgdG8gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tU3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGJvdHRvbVN0YXJ0WSA9IG5vZGVZICsgaGFsZkhlaWdodCArIHBhZGRpbmc7XG4gICAgICB2YXIgYm90dG9tRW5kWCA9IG5vZGVYICsgaGFsZldpZHRoIC0gY29ybmVyUmFkaXVzICsgcGFkZGluZztcbiAgICAgIHZhciBib3R0b21FbmRZID0gYm90dG9tU3RhcnRZO1xuXG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY3lNYXRoLmZpbml0ZUxpbmVzSW50ZXJzZWN0KFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MiwgYm90dG9tU3RhcnRYLCBib3R0b21TdGFydFksIGJvdHRvbUVuZFgsIGJvdHRvbUVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExlZnQgc2VnbWVudCwgdG9wIHRvIGJvdHRvbVxuICAgIHtcbiAgICAgIHZhciBsZWZ0U3RhcnRYID0gbm9kZVggLSBoYWxmV2lkdGggLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRTdGFydFkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXMgLSBwYWRkaW5nO1xuICAgICAgdmFyIGxlZnRFbmRYID0gbGVmdFN0YXJ0WDtcbiAgICAgIHZhciBsZWZ0RW5kWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1cyArIHBhZGRpbmc7XG5cbiAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjeU1hdGguZmluaXRlTGluZXNJbnRlcnNlY3QoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLCBsZWZ0U3RhcnRYLCBsZWZ0U3RhcnRZLCBsZWZ0RW5kWCwgbGVmdEVuZFksIGZhbHNlKTtcblxuICAgICAgaWYgKGludGVyc2VjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChpbnRlcnNlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGludGVyc2VjdGlvbnMgd2l0aCBhcmMgc2VnbWVudHNcbiAgICB2YXIgYXJjSW50ZXJzZWN0aW9ucztcblxuICAgIC8vIFRvcCBMZWZ0XG4gICAge1xuICAgICAgdmFyIHRvcExlZnRDZW50ZXJYID0gbm9kZVggLSBoYWxmV2lkdGggKyBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgdG9wTGVmdENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIHRvcExlZnRDZW50ZXJYLCB0b3BMZWZ0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdIDw9IHRvcExlZnRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wTGVmdENlbnRlclkpIHtcbiAgICAgICAgc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucyA9IHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMuY29uY2F0KGFyY0ludGVyc2VjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvcCBSaWdodFxuICAgIHtcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclggPSBub2RlWCArIGhhbGZXaWR0aCAtIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciB0b3BSaWdodENlbnRlclkgPSBub2RlWSAtIGhhbGZIZWlnaHQgKyBjb3JuZXJSYWRpdXNcbiAgICAgIGFyY0ludGVyc2VjdGlvbnMgPSBjeU1hdGguaW50ZXJzZWN0TGluZUNpcmNsZShcbiAgICAgICAgICAgICAgeDEsIHkxLCB4MiwgeTIsXG4gICAgICAgICAgICAgIHRvcFJpZ2h0Q2VudGVyWCwgdG9wUmlnaHRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPj0gdG9wUmlnaHRDZW50ZXJYXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMV0gPD0gdG9wUmlnaHRDZW50ZXJZKSB7XG4gICAgICAgIHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMgPSBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zLmNvbmNhdChhcmNJbnRlcnNlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCb3R0b20gUmlnaHRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJYID0gbm9kZVggKyBoYWxmV2lkdGggLSBjb3JuZXJSYWRpdXM7XG4gICAgICB2YXIgYm90dG9tUmlnaHRDZW50ZXJZID0gbm9kZVkgKyBoYWxmSGVpZ2h0IC0gY29ybmVyUmFkaXVzXG4gICAgICBhcmNJbnRlcnNlY3Rpb25zID0gY3lNYXRoLmludGVyc2VjdExpbmVDaXJjbGUoXG4gICAgICAgICAgICAgIHgxLCB5MSwgeDIsIHkyLFxuICAgICAgICAgICAgICBib3R0b21SaWdodENlbnRlclgsIGJvdHRvbVJpZ2h0Q2VudGVyWSwgY29ybmVyUmFkaXVzICsgcGFkZGluZyk7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgaW50ZXJzZWN0aW9uIGlzIG9uIHRoZSBkZXNpcmVkIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAgaWYgKGFyY0ludGVyc2VjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzBdID49IGJvdHRvbVJpZ2h0Q2VudGVyWFxuICAgICAgICAgICAgICAmJiBhcmNJbnRlcnNlY3Rpb25zWzFdID49IGJvdHRvbVJpZ2h0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQm90dG9tIExlZnRcbiAgICB7XG4gICAgICB2YXIgYm90dG9tTGVmdENlbnRlclggPSBub2RlWCAtIGhhbGZXaWR0aCArIGNvcm5lclJhZGl1cztcbiAgICAgIHZhciBib3R0b21MZWZ0Q2VudGVyWSA9IG5vZGVZICsgaGFsZkhlaWdodCAtIGNvcm5lclJhZGl1c1xuICAgICAgYXJjSW50ZXJzZWN0aW9ucyA9IGN5TWF0aC5pbnRlcnNlY3RMaW5lQ2lyY2xlKFxuICAgICAgICAgICAgICB4MSwgeTEsIHgyLCB5MixcbiAgICAgICAgICAgICAgYm90dG9tTGVmdENlbnRlclgsIGJvdHRvbUxlZnRDZW50ZXJZLCBjb3JuZXJSYWRpdXMgKyBwYWRkaW5nKTtcblxuICAgICAgLy8gRW5zdXJlIHRoZSBpbnRlcnNlY3Rpb24gaXMgb24gdGhlIGRlc2lyZWQgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICBpZiAoYXJjSW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICYmIGFyY0ludGVyc2VjdGlvbnNbMF0gPD0gYm90dG9tTGVmdENlbnRlclhcbiAgICAgICAgICAgICAgJiYgYXJjSW50ZXJzZWN0aW9uc1sxXSA+PSBib3R0b21MZWZ0Q2VudGVyWSkge1xuICAgICAgICBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zID0gc3RyYWlnaHRMaW5lSW50ZXJzZWN0aW9ucy5jb25jYXQoYXJjSW50ZXJzZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cmFpZ2h0TGluZUludGVyc2VjdGlvbnMubGVuZ3RoID4gMClcbiAgICAgIHJldHVybiBzdHJhaWdodExpbmVJbnRlcnNlY3Rpb25zO1xuICAgIHJldHVybiBbXTsgLy8gaWYgbm90aGluZ1xuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZUVsbGlwc2UgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgeDEsIHkxLCB4MiwgeTIsIGNlbnRlclgsIGNlbnRlclksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcpIHtcblxuICAgIHZhciB3ID0gd2lkdGggLyAyICsgcGFkZGluZztcbiAgICB2YXIgaCA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xuICAgIHZhciBhbiA9IGNlbnRlclg7XG4gICAgdmFyIGJuID0gY2VudGVyWTtcblxuICAgIHZhciBkID0gW3gyIC0geDEsIHkyIC0geTFdO1xuXG4gICAgdmFyIG0gPSBkWzFdIC8gZFswXTtcbiAgICB2YXIgbiA9IC0xICogbSAqIHgyICsgeTI7XG4gICAgdmFyIGEgPSBoICogaCArIHcgKiB3ICogbSAqIG07XG4gICAgdmFyIGIgPSAtMiAqIGFuICogaCAqIGggKyAyICogbSAqIG4gKiB3ICogdyAtIDIgKiBibiAqIG0gKiB3ICogdztcbiAgICB2YXIgYyA9IGFuICogYW4gKiBoICogaCArIG4gKiBuICogdyAqIHcgLSAyICogYm4gKiB3ICogdyAqIG4gK1xuICAgICAgICAgICAgYm4gKiBibiAqIHcgKiB3IC0gaCAqIGggKiB3ICogdztcblxuICAgIHZhciBkaXNjcmltaW5hbnQgPSBiICogYiAtIDQgKiBhICogYztcblxuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHQxID0gKC1iICsgTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gKDIgKiBhKTtcbiAgICB2YXIgdDIgPSAoLWIgLSBNYXRoLnNxcnQoZGlzY3JpbWluYW50KSkgLyAoMiAqIGEpO1xuXG4gICAgdmFyIHhNaW4gPSBNYXRoLm1pbih0MSwgdDIpO1xuICAgIHZhciB4TWF4ID0gTWF0aC5tYXgodDEsIHQyKTtcblxuICAgIHZhciB5TWluID0gbSAqIHhNaW4gLSBtICogeDIgKyB5MjtcbiAgICB2YXIgeU1heCA9IG0gKiB4TWF4IC0gbSAqIHgyICsgeTI7XG5cbiAgICByZXR1cm4gW3hNaW4sIHlNaW4sIHhNYXgsIHlNYXhdO1xuICB9O1xuXG4gICQkLnNiZ24uaW50ZXJzZWN0TGluZVN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKG5vZGUsIHgsIHkpIHtcbiAgICB2YXIgY2VudGVyWCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueDtcbiAgICB2YXIgY2VudGVyWSA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueTtcbiAgICB2YXIgcGFkZGluZyA9IHBhcnNlSW50KG5vZGUuY3NzKCdib3JkZXItd2lkdGgnKSkgLyAyO1xuXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3M7XG5cbiAgICB2YXIgc3RhdGVDb3VudCA9IDAsIGluZm9Db3VudCA9IDA7XG5cbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZUFuZEluZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZUFuZEluZm9zW2ldO1xuICAgICAgdmFyIHN0YXRlV2lkdGggPSBzdGF0ZS5iYm94Lnc7XG4gICAgICB2YXIgc3RhdGVIZWlnaHQgPSBzdGF0ZS5iYm94Lmg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJYID0gc3RhdGUuYmJveC54ICogbm9kZS53aWR0aCgpIC8gMTAwICsgY2VudGVyWDtcbiAgICAgIHZhciBzdGF0ZUNlbnRlclkgPSBzdGF0ZS5iYm94LnkgKiBub2RlLmhlaWdodCgpIC8gMTAwICsgY2VudGVyWTtcblxuICAgICAgaWYgKHN0YXRlLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIiAmJiBzdGF0ZUNvdW50IDwgMikgey8vZHJhdyBlbGxpcHNlXG4gICAgICAgIHZhciBzdGF0ZUludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5pbnRlcnNlY3RMaW5lRWxsaXBzZSh4LCB5LCBjZW50ZXJYLCBjZW50ZXJZLFxuICAgICAgICAgICAgICAgIHN0YXRlQ2VudGVyWCwgc3RhdGVDZW50ZXJZLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgcGFkZGluZyk7XG5cbiAgICAgICAgaWYgKHN0YXRlSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoc3RhdGVJbnRlcnNlY3RMaW5lcyk7XG5cbiAgICAgICAgc3RhdGVDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIiAmJiBpbmZvQ291bnQgPCAyKSB7Ly9kcmF3IHJlY3RhbmdsZVxuICAgICAgICB2YXIgaW5mb0ludGVyc2VjdExpbmVzID0gJCQuc2Jnbi5yb3VuZFJlY3RhbmdsZUludGVyc2VjdExpbmUoeCwgeSwgY2VudGVyWCwgY2VudGVyWSxcbiAgICAgICAgICAgICAgICBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSwgc3RhdGVXaWR0aCwgc3RhdGVIZWlnaHQsIDUsIHBhZGRpbmcpO1xuXG4gICAgICAgIGlmIChpbmZvSW50ZXJzZWN0TGluZXMubGVuZ3RoID4gMClcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5jb25jYXQoaW5mb0ludGVyc2VjdExpbmVzKTtcblxuICAgICAgICBpbmZvQ291bnQrKztcbiAgICAgIH1cblxuICAgIH1cbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gICQkLnNiZ24uY2hlY2tQb2ludFN0YXRlQW5kSW5mb0JveGVzID0gZnVuY3Rpb24gKHgsIHksIG5vZGUsIHRocmVzaG9sZCkge1xuICAgIHZhciBjZW50ZXJYID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54O1xuICAgIHZhciBjZW50ZXJZID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55O1xuICAgIHZhciBwYWRkaW5nID1wYXJzZUludChub2RlLmNzcygnYm9yZGVyLXdpZHRoJykpIC8gMjtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcblxuICAgIHZhciBzdGF0ZUNvdW50ID0gMCwgaW5mb0NvdW50ID0gMDtcbi8vICAgIHRocmVzaG9sZCA9IHBhcnNlRmxvYXQodGhyZXNob2xkKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVBbmRJbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN0YXRlID0gc3RhdGVBbmRJbmZvc1tpXTtcbiAgICAgIHZhciBzdGF0ZVdpZHRoID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LncpICsgdGhyZXNob2xkO1xuICAgICAgdmFyIHN0YXRlSGVpZ2h0ID0gcGFyc2VGbG9hdChzdGF0ZS5iYm94LmgpICsgdGhyZXNob2xkO1xuICAgICAgdmFyIHN0YXRlQ2VudGVyWCA9IHN0YXRlLmJib3gueCAqIG5vZGUud2lkdGgoKSAvIDEwMCArIGNlbnRlclg7XG4gICAgICB2YXIgc3RhdGVDZW50ZXJZID0gc3RhdGUuYmJveC55ICogbm9kZS5oZWlnaHQoKSAvIDEwMCArIGNlbnRlclk7XG5cbiAgICAgIGlmIChzdGF0ZS5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIgJiYgc3RhdGVDb3VudCA8IDIpIHsvL2RyYXcgZWxsaXBzZVxuICAgICAgICB2YXIgc3RhdGVDaGVja1BvaW50ID0gY3lCYXNlTm9kZVNoYXBlc1tcImVsbGlwc2VcIl0uY2hlY2tQb2ludChcbiAgICAgICAgICAgICAgICB4LCB5LCBwYWRkaW5nLCBzdGF0ZVdpZHRoLCBzdGF0ZUhlaWdodCwgc3RhdGVDZW50ZXJYLCBzdGF0ZUNlbnRlclkpO1xuXG4gICAgICAgIGlmIChzdGF0ZUNoZWNrUG9pbnQgPT0gdHJ1ZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBzdGF0ZUNvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiICYmIGluZm9Db3VudCA8IDIpIHsvL2RyYXcgcmVjdGFuZ2xlXG4gICAgICAgIHZhciBpbmZvQ2hlY2tQb2ludCA9IGN5QmFzZU5vZGVTaGFwZXNbXCJyb3VuZHJlY3RhbmdsZVwiXS5jaGVja1BvaW50KFxuICAgICAgICAgICAgICAgIHgsIHksIHBhZGRpbmcsIHN0YXRlV2lkdGgsIHN0YXRlSGVpZ2h0LCBzdGF0ZUNlbnRlclgsIHN0YXRlQ2VudGVyWSk7XG5cbiAgICAgICAgaWYgKGluZm9DaGVja1BvaW50ID09IHRydWUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgaW5mb0NvdW50Kys7XG4gICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gICQkLnNiZ24uaXNOb2RlU2hhcGVUb3RhbGx5T3ZlcnJpZGVuID0gZnVuY3Rpb24gKHJlbmRlciwgbm9kZSkge1xuICAgIGlmICh0b3RhbGx5T3ZlcnJpZGVuTm9kZVNoYXBlc1tyZW5kZXIuZ2V0Tm9kZVNoYXBlKG5vZGUpXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufTtcbiIsIi8qXG4gKiBDb21tb24gdXRpbGl0aWVzIGZvciBlbGVtZW50cyBpbmNsdWRlcyBib3RoIGdlbmVyYWwgdXRpbGl0aWVzIGFuZCBzYmduIHNwZWNpZmljIHV0aWxpdGllcyBcbiAqL1xuXG52YXIgdHJ1bmNhdGVUZXh0ID0gcmVxdWlyZSgnLi90ZXh0LXV0aWxpdGllcycpLnRydW5jYXRlVGV4dDtcbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSB7XG4gICAgLy90aGUgbGlzdCBvZiB0aGUgZWxlbWVudCBjbGFzc2VzIGhhbmRsZWQgYnkgdGhlIHRvb2xcbiAgICBoYW5kbGVkRWxlbWVudHM6IHtcbiAgICAgICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZSxcbiAgICAgICAgJ3NvdXJjZSBhbmQgc2luayc6IHRydWUsXG4gICAgICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAgICAgJ3Byb2Nlc3MnOiB0cnVlLFxuICAgICAgICAnb21pdHRlZCBwcm9jZXNzJzogdHJ1ZSxcbiAgICAgICAgJ3VuY2VydGFpbiBwcm9jZXNzJzogdHJ1ZSxcbiAgICAgICAgJ2Fzc29jaWF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ2Rpc3NvY2lhdGlvbic6IHRydWUsXG4gICAgICAgICdwaGVub3R5cGUnOiB0cnVlLFxuICAgICAgICAndGFnJzogdHJ1ZSxcbiAgICAgICAgJ2NvbnN1bXB0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3Byb2R1Y3Rpb24nOiB0cnVlLFxuICAgICAgICAnbW9kdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdzdGltdWxhdGlvbic6IHRydWUsXG4gICAgICAgICdjYXRhbHlzaXMnOiB0cnVlLFxuICAgICAgICAnaW5oaWJpdGlvbic6IHRydWUsXG4gICAgICAgICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nOiB0cnVlLFxuICAgICAgICAnbG9naWMgYXJjJzogdHJ1ZSxcbiAgICAgICAgJ2VxdWl2YWxlbmNlIGFyYyc6IHRydWUsXG4gICAgICAgICdhbmQgb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnb3Igb3BlcmF0b3InOiB0cnVlLFxuICAgICAgICAnbm90IG9wZXJhdG9yJzogdHJ1ZSxcbiAgICAgICAgJ2FuZCc6IHRydWUsXG4gICAgICAgICdvcic6IHRydWUsXG4gICAgICAgICdub3QnOiB0cnVlLFxuICAgICAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInOiB0cnVlLFxuICAgICAgICAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInOiB0cnVlLFxuICAgICAgICAnY29tcGxleCBtdWx0aW1lcic6IHRydWUsXG4gICAgICAgICdjb21wYXJ0bWVudCc6IHRydWVcbiAgICB9LFxuICAgIC8vdGhlIGZvbGxvd2luZyB3ZXJlIG1vdmVkIGhlcmUgZnJvbSB3aGF0IHVzZWQgdG8gYmUgdXRpbGl0aWVzL3NiZ24tZmlsdGVyaW5nLmpzXG4gICAgcHJvY2Vzc1R5cGVzIDogWydwcm9jZXNzJywgJ29taXR0ZWQgcHJvY2VzcycsICd1bmNlcnRhaW4gcHJvY2VzcycsXG4gICAgICAgICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncGhlbm90eXBlJ10sXG4gICAgICBcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xuXG4gICAgLy90aGlzIG1ldGhvZCByZXR1cm5zIHRoZSBub2RlcyBub24gb2Ygd2hvc2UgYW5jZXN0b3JzIGlzIG5vdCBpbiBnaXZlbiBub2Rlc1xuICAgIGdldFRvcE1vc3ROb2RlczogZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgICAgIHZhciBub2Rlc01hcCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBub2Rlc01hcFtub2Rlc1tpXS5pZCgpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJvb3RzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGUucGFyZW50KClbMF07XG4gICAgICAgICAgICB3aGlsZShwYXJlbnQgIT0gbnVsbCl7XG4gICAgICAgICAgICAgIGlmKG5vZGVzTWFwW3BhcmVudC5pZCgpXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQoKVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm9vdHM7XG4gICAgfSxcbiAgICAvL1RoaXMgbWV0aG9kIGNoZWNrcyBpZiBhbGwgb2YgdGhlIGdpdmVuIG5vZGVzIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFzc3VtaW5nIHRoYXQgdGhlIHNpemUgXG4gICAgLy9vZiAgbm9kZXMgaXMgbm90IDBcbiAgICBhbGxIYXZlVGhlU2FtZVBhcmVudDogZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVzWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhKFwicGFyZW50XCIpICE9IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG1vdmVOb2RlczogZnVuY3Rpb24ocG9zaXRpb25EaWZmLCBub2Rlcywgbm90Q2FsY1RvcE1vc3ROb2Rlcykge1xuICAgICAgdmFyIHRvcE1vc3ROb2RlcyA9IG5vdENhbGNUb3BNb3N0Tm9kZXMgPyBub2RlcyA6IHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9wTW9zdE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gdG9wTW9zdE5vZGVzW2ldO1xuICAgICAgICB2YXIgb2xkWCA9IG5vZGUucG9zaXRpb24oXCJ4XCIpO1xuICAgICAgICB2YXIgb2xkWSA9IG5vZGUucG9zaXRpb24oXCJ5XCIpO1xuICAgICAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgICAgICB4OiBvbGRYICsgcG9zaXRpb25EaWZmLngsXG4gICAgICAgICAgeTogb2xkWSArIHBvc2l0aW9uRGlmZi55XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMubW92ZU5vZGVzKHBvc2l0aW9uRGlmZiwgY2hpbGRyZW4sIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29udmVydFRvTW9kZWxQb3NpdGlvbjogZnVuY3Rpb24gKHJlbmRlcmVkUG9zaXRpb24pIHtcbiAgICAgIHZhciBwYW4gPSBjeS5wYW4oKTtcbiAgICAgIHZhciB6b29tID0gY3kuem9vbSgpO1xuXG4gICAgICB2YXIgeCA9IChyZW5kZXJlZFBvc2l0aW9uLnggLSBwYW4ueCkgLyB6b29tO1xuICAgICAgdmFyIHkgPSAocmVuZGVyZWRQb3NpdGlvbi55IC0gcGFuLnkpIC8gem9vbTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfTtcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gR2VuZXJhbCBFbGVtZW50IFV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xuICAgIFxuICAgIC8vIFNCR04gc3BlY2lmaWMgdXRpbGl0aWVzXG4gICAgZ2V0UHJvY2Vzc2VzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xuICAgICAgICBzZWxlY3RlZEVsZXMgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KHNlbGVjdGVkRWxlcyk7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVsZXM7XG4gICAgfSxcbiAgICBnZXROZWlnaGJvdXJzT2ZTZWxlY3RlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiOnNlbGVjdGVkXCIpO1xuICAgICAgICB2YXIgZWxlc1RvSGlnaGxpZ2h0ID0gdGhpcy5nZXROZWlnaGJvdXJzT2ZOb2RlcyhzZWxlY3RlZEVsZXMpO1xuICAgICAgICByZXR1cm4gZWxlc1RvSGlnaGxpZ2h0O1xuICAgIH0sXG4gICAgZ2V0TmVpZ2hib3Vyc09mTm9kZXM6IGZ1bmN0aW9uKF9ub2Rlcyl7XG4gICAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICAgICAgICBub2RlcyA9IG5vZGVzLmFkZChub2Rlcy5wYXJlbnRzKFwibm9kZVtjbGFzcz0nY29tcGxleCddXCIpKTtcbiAgICAgICAgbm9kZXMgPSBub2Rlcy5hZGQobm9kZXMuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgIHZhciBuZWlnaGJvcmhvb2RFbGVzID0gbm9kZXMubmVpZ2hib3Job29kKCk7XG4gICAgICAgIHZhciBlbGVzVG9SZXR1cm4gPSBub2Rlcy5hZGQobmVpZ2hib3Job29kRWxlcyk7XG4gICAgICAgIGVsZXNUb1JldHVybiA9IGVsZXNUb1JldHVybi5hZGQoZWxlc1RvUmV0dXJuLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICByZXR1cm4gZWxlc1RvUmV0dXJuO1xuICAgIH0sXG4gICAgZXh0ZW5kTm9kZUxpc3Q6IGZ1bmN0aW9uKG5vZGVzVG9TaG93KXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL2FkZCBjaGlsZHJlblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChub2Rlc1RvU2hvdy5ub2RlcygpLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICAvL2FkZCBwYXJlbnRzXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93LnBhcmVudHMoKSk7XG4gICAgICAgIC8vYWRkIGNvbXBsZXggY2hpbGRyZW5cbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XG5cbiAgICAgICAgLy8gdmFyIHByb2Nlc3NlcyA9IG5vZGVzVG9TaG93Lm5vZGVzKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xuICAgICAgICAvLyB2YXIgbm9uUHJvY2Vzc2VzID0gbm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzIT0ncHJvY2VzcyddXCIpO1xuICAgICAgICAvLyB2YXIgbmVpZ2hib3JQcm9jZXNzZXMgPSBub25Qcm9jZXNzZXMubmVpZ2hib3Job29kKFwibm9kZVtjbGFzcz0ncHJvY2VzcyddXCIpO1xuXG4gICAgICAgIHZhciBwcm9jZXNzZXMgPSBub2Rlc1RvU2hvdy5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5vblByb2Nlc3NlcyA9IG5vZGVzVG9TaG93LmZpbHRlcihmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGUuX3ByaXZhdGUuZGF0YS5jbGFzcywgc2VsZi5wcm9jZXNzVHlwZXMpID09PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBuZWlnaGJvclByb2Nlc3NlcyA9IG5vblByb2Nlc3Nlcy5uZWlnaGJvcmhvb2QoKS5maWx0ZXIoZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoZWxlLl9wcml2YXRlLmRhdGEuY2xhc3MsIHNlbGYucHJvY2Vzc1R5cGVzKSA+PSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChwcm9jZXNzZXMubmVpZ2hib3Job29kKCkpO1xuICAgICAgICBub2Rlc1RvU2hvdyA9IG5vZGVzVG9TaG93LmFkZChuZWlnaGJvclByb2Nlc3Nlcyk7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5laWdoYm9yUHJvY2Vzc2VzLm5laWdoYm9yaG9vZCgpKTtcblxuICAgICAgICAvL2FkZCBwYXJlbnRzXG4gICAgICAgIG5vZGVzVG9TaG93ID0gbm9kZXNUb1Nob3cuYWRkKG5vZGVzVG9TaG93Lm5vZGVzKCkucGFyZW50cygpKTtcbiAgICAgICAgLy9hZGQgY2hpbGRyZW5cbiAgICAgICAgbm9kZXNUb1Nob3cgPSBub2Rlc1RvU2hvdy5hZGQobm9kZXNUb1Nob3cubm9kZXMoXCJub2RlW2NsYXNzPSdjb21wbGV4J11cIikuZGVzY2VuZGFudHMoKSk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGVzVG9TaG93O1xuICAgIH0sXG4gICAgZXh0ZW5kUmVtYWluaW5nTm9kZXMgOiBmdW5jdGlvbihub2Rlc1RvRmlsdGVyLCBhbGxOb2Rlcyl7XG4gICAgICAgIG5vZGVzVG9GaWx0ZXIgPSB0aGlzLmV4dGVuZE5vZGVMaXN0KG5vZGVzVG9GaWx0ZXIpO1xuICAgICAgICB2YXIgbm9kZXNUb1Nob3cgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0ZpbHRlcik7XG4gICAgICAgIG5vZGVzVG9TaG93ID0gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlc1RvU2hvdyk7XG4gICAgICAgIHJldHVybiBub2Rlc1RvU2hvdztcbiAgICB9LFxuICAgIGdldFByb2Nlc3Nlc09mTm9kZXM6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRlbmROb2RlTGlzdChub2Rlcyk7XG4gICAgfSxcbiAgICAvLyBnZW5lcmFsIHV0aWxpdGllc1xuICAgIG5vbmVJc05vdEhpZ2hsaWdodGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbm90SGlnaGxpZ2h0ZWROb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIikubm9kZXMoXCIudW5oaWdobGlnaHRlZFwiKTtcbiAgICAgICAgdmFyIG5vdEhpZ2hsaWdodGVkRWRnZXMgPSBjeS5lZGdlcyhcIjp2aXNpYmxlXCIpLmVkZ2VzKFwiLnVuaGlnaGxpZ2h0ZWRcIik7XG5cbiAgICAgICAgcmV0dXJuIG5vdEhpZ2hsaWdodGVkTm9kZXMubGVuZ3RoICsgbm90SGlnaGxpZ2h0ZWRFZGdlcy5sZW5ndGggPT09IDA7XG4gICAgfSxcbiAgICBcbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIEVsZW1lbnQgRmlsdGVyaW5nIFV0aWxpdGllc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xuICAgIGRlbGV0ZU5vZGVzU21hcnQ6IGZ1bmN0aW9uIChfbm9kZXMpIHtcbiAgICAgIHZhciBub2RlcyA9IF9ub2Rlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuICAgICAgXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcygpO1xuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgdmFyIG5vZGVzVG9LZWVwID0gdGhpcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgICAgdmFyIG5vZGVzTm90VG9LZWVwID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcbiAgICAgIHJldHVybiBub2Rlc05vdFRvS2VlcC5yZW1vdmUoKTtcbiAgICB9LFxuICAgIGRlbGV0ZUVsZXNTaW1wbGU6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICByZXR1cm4gZWxlcy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYWwgdXRpbGl0aWVzXG4gICAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICAgIGVsZXMucmVzdG9yZSgpO1xuICAgICAgICByZXR1cm4gZWxlcztcbiAgICB9LFxuICAgIFxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBTdHlsZXNoZWV0IGhlbHBlcnNcbiAgICBcbiAgICAvLyBTQkdOIHNwZWNpZmljIHV0aWxpdGllc1xuICAgIGdldEN5U2hhcGU6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnY29tcGFydG1lbnQnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3JvdW5kcmVjdGFuZ2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdwaGVub3R5cGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hleGFnb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgcmV0dXJuICdwb2x5Z29uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnIHx8IF9jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCcgfHwgX2NsYXNzID09ICdjb21wbGV4J1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAncHJvY2VzcycgfHwgX2NsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJyB8fCBfY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIF9jbGFzcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2VsbGlwc2UnO1xuICAgIH0sXG4gICAgZ2V0Q3lBcnJvd1NoYXBlOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICBpZiAoX2NsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyaWFuZ2xlLWNyb3NzJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdpbmhpYml0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0ZWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfY2xhc3MgPT0gJ2NhdGFseXNpcycpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2NsYXNzID09ICdzdGltdWxhdGlvbicgfHwgX2NsYXNzID09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICd0cmlhbmdsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9jbGFzcyA9PSAnbW9kdWxhdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGlhbW9uZCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICB9LFxuICAgIGdldEVsZW1lbnRDb250ZW50OiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdmFyIF9jbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJyBtdWx0aW1lcicpKSB7XG4gICAgICAgICAgICBfY2xhc3MgPSBfY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAoX2NsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBfY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICAgIHx8IF9jbGFzcyA9PSAncGhlbm90eXBlJ1xuICAgICAgICAgICAgfHwgX2NsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknIHx8IF9jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgICB8fCBfY2xhc3MgPT0gJ3BlcnR1cmJpbmcgYWdlbnQnIHx8IF9jbGFzcyA9PSAndGFnJykge1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wYXJ0bWVudCcpe1xuICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdsYWJlbCcpID8gZWxlLmRhdGEoJ2xhYmVsJykgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoX2NsYXNzID09ICdjb21wbGV4Jyl7XG4gICAgICAgICAgICBpZihlbGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlLmRhdGEoJ2xhYmVsJykpe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZWxlLmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZWxlLmRhdGEoJ2luZm9MYWJlbCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGVsZS5kYXRhKCdpbmZvTGFiZWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnYW5kJykge1xuICAgICAgICAgICAgY29udGVudCA9ICdBTkQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAnb3InKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ09SJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ25vdCcpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnTk9UJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcycpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnXFxcXFxcXFwnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJz8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IGVsZS53aWR0aCgpIHx8IGVsZS5kYXRhKCdiYm94JykudztcblxuICAgICAgICB2YXIgdGV4dFByb3AgPSB7XG4gICAgICAgICAgICBsYWJlbDogY29udGVudCxcbiAgICAgICAgICAgIHdpZHRoOiAoIF9jbGFzcz09KCdjb21wbGV4JykgfHwgX2NsYXNzPT0oJ2NvbXBhcnRtZW50JykgKT90ZXh0V2lkdGggKiAyOnRleHRXaWR0aFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb250ID0gdGhpcy5nZXRMYWJlbFRleHRTaXplKGVsZSkgKyBcInB4IEFyaWFsXCI7XG4gICAgICAgIHJldHVybiB0cnVuY2F0ZVRleHQodGV4dFByb3AsIGZvbnQpOyAvL2Z1bmMuIGluIHRoZSBjeXRvc2NhcGUucmVuZGVyZXIuY2FudmFzLnNiZ24tcmVuZGVyZXIuanNcbiAgICB9LFxuICAgIGdldExhYmVsVGV4dFNpemU6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICAgICAgLy8gVGhlc2UgdHlwZXMgb2Ygbm9kZXMgY2Fubm90IGhhdmUgbGFiZWwgYnV0IHRoaXMgaXMgc3RhdGVtZW50IGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmRcbiAgICAgIGlmIChfY2xhc3MgPT09ICdhc3NvY2lhdGlvbicgfHwgX2NsYXNzID09PSAnZGlzc29jaWF0aW9uJykge1xuICAgICAgICByZXR1cm4gMjA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdhbmQnIHx8IF9jbGFzcyA9PT0gJ29yJyB8fCBfY2xhc3MgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldER5bmFtaWNMYWJlbFRleHRTaXplKGVsZSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUsIDEuNSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2xhc3MgPT09ICdjb21wbGV4JyB8fCBfY2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgcmV0dXJuIDE2O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXREeW5hbWljTGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZGluYWxpdHlEaXN0YW5jZTogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNyY1BvcyA9IGVsZS5zb3VyY2UoKS5wb3NpdGlvbigpO1xuICAgICAgdmFyIHRndFBvcyA9IGVsZS50YXJnZXQoKS5wb3NpdGlvbigpO1xuXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coKHNyY1Bvcy54IC0gdGd0UG9zLngpLCAyKSArIE1hdGgucG93KChzcmNQb3MueSAtIHRndFBvcy55KSwgMikpO1xuICAgICAgcmV0dXJuIGRpc3RhbmNlICogMC4xNTtcbiAgICB9LFxuICAgIGdldEluZm9MYWJlbDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogSW5mbyBsYWJlbCBvZiBhIGNvbGxhcHNlZCBub2RlIGNhbm5vdCBiZSBjaGFuZ2VkIGlmXG4gICAgICAqIHRoZSBub2RlIGlzIGNvbGxhcHNlZCByZXR1cm4gdGhlIGFscmVhZHkgZXhpc3RpbmcgaW5mbyBsYWJlbCBvZiBpdFxuICAgICAgKi9cbiAgICAgIGlmIChub2RlLl9wcml2YXRlLmRhdGEuY29sbGFwc2VkQ2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmluZm9MYWJlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBub2RlIGlzIHNpbXBsZSB0aGVuIGl0J3MgaW5mb2xhYmVsIGlzIGVxdWFsIHRvIGl0J3MgbGFiZWxcbiAgICAgICAqL1xuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4oKSA9PSBudWxsIHx8IG5vZGUuY2hpbGRyZW4oKS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaW5mb0xhYmVsID0gXCJcIjtcbiAgICAgIC8qXG4gICAgICAgKiBHZXQgdGhlIGluZm8gbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGUgYnkgaXQncyBjaGlsZHJlbiBpbmZvIHJlY3Vyc2l2ZWx5XG4gICAgICAgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgIHZhciBjaGlsZEluZm8gPSB0aGlzLmdldEluZm9MYWJlbChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZEluZm8gPT0gbnVsbCB8fCBjaGlsZEluZm8gPT0gXCJcIikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm9MYWJlbCAhPSBcIlwiKSB7XG4gICAgICAgICAgaW5mb0xhYmVsICs9IFwiOlwiO1xuICAgICAgICB9XG4gICAgICAgIGluZm9MYWJlbCArPSBjaGlsZEluZm87XG4gICAgICB9XG5cbiAgICAgIC8vcmV0dXJuIGluZm8gbGFiZWxcbiAgICAgIHJldHVybiBpbmZvTGFiZWw7XG4gICAgfSxcbiAgICBnZXRRdGlwQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgLyogQ2hlY2sgdGhlIGxhYmVsIG9mIHRoZSBub2RlIGlmIGl0IGlzIG5vdCB2YWxpZFxuICAgICAgKiB0aGVuIGNoZWNrIHRoZSBpbmZvbGFiZWwgaWYgaXQgaXMgYWxzbyBub3QgdmFsaWQgZG8gbm90IHNob3cgcXRpcFxuICAgICAgKi9cbiAgICAgIHZhciBsYWJlbCA9IG5vZGUuZGF0YSgnbGFiZWwnKTtcbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgbGFiZWwgPSB0aGlzLmdldEluZm9MYWJlbChub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbCA9PSBudWxsIHx8IGxhYmVsID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgY29udGVudEh0bWwgPSBcIjxiIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTZweDsnPlwiICsgbGFiZWwgKyBcIjwvYj5cIjtcbiAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5zdGF0ZXNhbmRpbmZvcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzYW5kaW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNiZ25zdGF0ZWFuZGluZm8gPSBzdGF0ZXNhbmRpbmZvc1tpXTtcbiAgICAgICAgaWYgKHNiZ25zdGF0ZWFuZGluZm8uY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc2JnbnN0YXRlYW5kaW5mby5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICB2YXIgdmFyaWFibGUgPSBzYmduc3RhdGVhbmRpbmZvLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gKHZhcmlhYmxlID09IG51bGwgLyp8fCB0eXBlb2Ygc3RhdGVWYXJpYWJsZSA9PT0gdW5kZWZpbmVkICovKSA/IHZhbHVlIDpcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgXCJAXCIgKyB2YXJpYWJsZTtcbiAgICAgICAgICBpZiAoc3RhdGVMYWJlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICBzdGF0ZUxhYmVsID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudEh0bWwgKz0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDsnPlwiICsgc3RhdGVMYWJlbCArIFwiPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbnN0YXRlYW5kaW5mby5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIHZhciBzdGF0ZUxhYmVsID0gc2JnbnN0YXRlYW5kaW5mby5sYWJlbC50ZXh0O1xuICAgICAgICAgIGlmIChzdGF0ZUxhYmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlTGFiZWwgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50SHRtbCArPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxNHB4Oyc+XCIgKyBzdGF0ZUxhYmVsICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnRIdG1sO1xuICAgIH0sXG4gICAgLy8gZ2VuZXJhbCB1dGlsaXRpZXNcbiAgICBnZXREeW5hbWljTGFiZWxUZXh0U2l6ZTogZnVuY3Rpb24gKGVsZSwgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50KSB7XG4gICAgICB2YXIgZHluYW1pY0xhYmVsU2l6ZSA9IG9wdGlvbnMuZHluYW1pY0xhYmVsU2l6ZTtcbiAgICAgIGR5bmFtaWNMYWJlbFNpemUgPSB0eXBlb2YgZHluYW1pY0xhYmVsU2l6ZSA9PT0gJ2Z1bmN0aW9uJyA/IGR5bmFtaWNMYWJlbFNpemUuY2FsbCgpIDogZHluYW1pY0xhYmVsU2l6ZTtcblxuICAgICAgaWYgKGR5bmFtaWNMYWJlbFNpemVDb2VmZmljaWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdzbWFsbCcpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAwLjc1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWNMYWJlbFNpemUgPT0gJ3JlZ3VsYXInKSB7XG4gICAgICAgICAgZHluYW1pY0xhYmVsU2l6ZUNvZWZmaWNpZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljTGFiZWxTaXplID09ICdsYXJnZScpIHtcbiAgICAgICAgICBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQgPSAxLjI1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBoID0gZWxlLmhlaWdodCgpO1xuICAgICAgdmFyIHRleHRIZWlnaHQgPSBwYXJzZUludChoIC8gMi40NSkgKiBkeW5hbWljTGFiZWxTaXplQ29lZmZpY2llbnQ7XG5cbiAgICAgIHJldHVybiB0ZXh0SGVpZ2h0O1xuICAgIH0sXG4gICAgLypcbiAgICAqIEdldCBzb3VyY2UvdGFyZ2V0IGVuZCBwb2ludCBvZiBlZGdlIGluICd4LXZhbHVlJSB5LXZhbHVlJScgZm9ybWF0LiBJdCByZXR1cm5zICdvdXRzaWRlLXRvLW5vZGUnIGlmIHRoZXJlIGlzIG5vIHNvdXJjZS90YXJnZXQgcG9ydC5cbiAgICAqL1xuICAgIGdldEVuZFBvaW50OiBmdW5jdGlvbihlZGdlLCBzb3VyY2VPclRhcmdldCkge1xuICAgICAgdmFyIHBvcnRJZCA9IHNvdXJjZU9yVGFyZ2V0ID09PSAnc291cmNlJyA/IGVkZ2UuZGF0YSgncG9ydHNvdXJjZScpIDogZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jyk7XG5cbiAgICAgIGlmIChwb3J0SWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ291dHNpZGUtdG8tbm9kZSc7IC8vIElmIHRoZXJlIGlzIG5vIHBvcnRzb3VyY2UgcmV0dXJuIHRoZSBkZWZhdWx0IHZhbHVlIHdoaWNoIGlzICdvdXRzaWRlLXRvLW5vZGUnXG4gICAgICB9XG5cbiAgICAgIHZhciBlbmROb2RlID0gc291cmNlT3JUYXJnZXQgPT09ICdzb3VyY2UnID8gZWRnZS5zb3VyY2UoKSA6IGVkZ2UudGFyZ2V0KCk7XG4gICAgICB2YXIgcG9ydHMgPSBlbmROb2RlLmRhdGEoJ3BvcnRzJyk7XG4gICAgICB2YXIgcG9ydDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBvcnRzW2ldLmlkID09PSBwb3J0SWQpIHtcbiAgICAgICAgICBwb3J0ID0gcG9ydHNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gJ291dHNpZGUtdG8tbm9kZSc7IC8vIElmIHBvcnQgaXMgbm90IGZvdW5kIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZSB3aGljaCBpcyAnb3V0c2lkZS10by1ub2RlJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJycgKyBwb3J0LnggKyAnJSAnICsgcG9ydC55ICsgJyUnO1xuICAgIH1cbiAgICBcbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIFN0eWxlc2hlZXQgaGVscGVyc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xuIiwiLypcbiAqIEZpbGUgVXRpbGl0aWVzOiBUbyBiZSB1c2VkIG9uIHJlYWQvd3JpdGUgZmlsZSBvcGVyYXRpb25cbiAqL1xuXG52YXIgc2Jnbm1sVG9Kc29uID0gcmVxdWlyZSgnLi9zYmdubWwtdG8tanNvbi1jb252ZXJ0ZXInKTtcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xudmFyIHVpVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91aS11dGlsaXRpZXMnKTtcbnZhciBncmFwaFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZ3JhcGgtdXRpbGl0aWVzJyk7XG52YXIgdXBkYXRlR3JhcGggPSBncmFwaFV0aWxpdGllcy51cGRhdGVHcmFwaC5iaW5kKGdyYXBoVXRpbGl0aWVzKTtcblxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIHNhdmVBcyA9IGxpYnMuc2F2ZUFzO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIFN0YXJ0XG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjI0NTc2Ny9jcmVhdGluZy1hLWJsb2ItZnJvbS1hLWJhc2U2NC1zdHJpbmctaW4tamF2YXNjcmlwdFxuZnVuY3Rpb24gYjY0dG9CbG9iKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpIHtcbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnJztcbiAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcblxuICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xuICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xuXG4gIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xuICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcblxuICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xuXG4gICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XG4gIH1cblxuICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICByZXR1cm4gYmxvYjtcbn1cblxuZnVuY3Rpb24gbG9hZFhNTERvYyhmdWxsRmlsZVBhdGgpIHtcbiAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xuICAgIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgeGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICB9XG4gIHhodHRwLm9wZW4oXCJHRVRcIiwgZnVsbEZpbGVQYXRoLCBmYWxzZSk7XG4gIHhodHRwLnNlbmQoKTtcbiAgcmV0dXJuIHhodHRwLnJlc3BvbnNlWE1MO1xufVxuXG4vLyBTaG91bGQgdGhpcyBiZSBleHBvc2VkIG9yIHNob3VsZCB0aGlzIGJlIG1vdmVkIHRvIHRoZSBoZWxwZXIgZnVuY3Rpb25zIHNlY3Rpb24/XG5mdW5jdGlvbiB0ZXh0VG9YbWxPYmplY3QodGV4dCkge1xuICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcbiAgICB2YXIgZG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxET00nKTtcbiAgICBkb2MuYXN5bmMgPSAnZmFsc2UnO1xuICAgIGRvYy5sb2FkWE1MKHRleHQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgJ3RleHQveG1sJyk7XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cbi8vIEhlbHBlciBmdW5jdGlvbnMgRW5kXG5cbmZ1bmN0aW9uIGZpbGVVdGlsaXRpZXMoKSB7fVxuZmlsZVV0aWxpdGllcy5sb2FkWE1MRG9jID0gbG9hZFhNTERvYztcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNQbmcgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgcG5nQ29udGVudCA9IGN5LnBuZyh7c2NhbGU6IDMsIGZ1bGw6IHRydWV9KTtcblxuICAvLyB0aGlzIGlzIHRvIHJlbW92ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwbmdDb250ZW50OiBkYXRhOmltZy9wbmc7YmFzZTY0LFxuICB2YXIgYjY0ZGF0YSA9IHBuZ0NvbnRlbnQuc3Vic3RyKHBuZ0NvbnRlbnQuaW5kZXhPZihcIixcIikgKyAxKTtcbiAgc2F2ZUFzKGI2NHRvQmxvYihiNjRkYXRhLCBcImltYWdlL3BuZ1wiKSwgZmlsZW5hbWUgfHwgXCJuZXR3b3JrLnBuZ1wiKTtcbn07XG5cbmZpbGVVdGlsaXRpZXMuc2F2ZUFzSnBnID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIGpwZ0NvbnRlbnQgPSBjeS5qcGcoe3NjYWxlOiAzLCBmdWxsOiB0cnVlfSk7XG5cbiAgLy8gdGhpcyBpcyB0byByZW1vdmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgcG5nQ29udGVudDogZGF0YTppbWcvcG5nO2Jhc2U2NCxcbiAgdmFyIGI2NGRhdGEgPSBqcGdDb250ZW50LnN1YnN0cihqcGdDb250ZW50LmluZGV4T2YoXCIsXCIpICsgMSk7XG4gIHNhdmVBcyhiNjR0b0Jsb2IoYjY0ZGF0YSwgXCJpbWFnZS9qcGdcIiksIGZpbGVuYW1lIHx8IFwibmV0d29yay5qcGdcIik7XG59O1xuXG5maWxlVXRpbGl0aWVzLmxvYWRTYW1wbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgZm9sZGVycGF0aCkge1xuICB1aVV0aWxpdGllcy5zdGFydFNwaW5uZXIoXCJsb2FkLXNwaW5uZXJcIik7XG4gIFxuICAvLyBVc2VycyBtYXkgd2FudCB0byBkbyBjdXN0b21pemVkIHRoaW5ncyB3aGlsZSBhIHNhbXBsZSBpcyBiZWluZyBsb2FkZWRcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRTYW1wbGVcIiwgWyBmaWxlbmFtZSBdICk7IC8vIEFsaWFzZXMgZm9yIHNiZ252aXpMb2FkU2FtcGxlU3RhcnRcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkU2FtcGxlU3RhcnRcIiwgWyBmaWxlbmFtZSBdICk7XG4gIFxuICAvLyBsb2FkIHhtbCBkb2N1bWVudCB1c2UgZGVmYXVsdCBmb2xkZXIgcGF0aCBpZiBpdCBpcyBub3Qgc3BlY2lmaWVkXG4gIHZhciB4bWxPYmplY3QgPSBsb2FkWE1MRG9jKChmb2xkZXJwYXRoIHx8ICdzYW1wbGUtYXBwL3NhbXBsZXMvJykgKyBmaWxlbmFtZSk7XG4gIFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh4bWxPYmplY3QpKTtcbiAgICB1aVV0aWxpdGllcy5lbmRTcGlubmVyKFwibG9hZC1zcGlubmVyXCIpO1xuICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZFNhbXBsZUVuZFwiLCBbIGZpbGVuYW1lIF0gKTsgLy8gVHJpZ2dlciBhbiBldmVudCBzaWduYWxpbmcgdGhhdCBhIHNhbXBsZSBpcyBsb2FkZWRcbiAgfSwgMCk7XG59O1xuXG4vKlxuICBjYWxsYmFjayBpcyBhIGZ1bmN0aW9uIHJlbW90ZWx5IGRlZmluZWQgdG8gYWRkIHNwZWNpZmljIGJlaGF2aW9yIHRoYXQgaXNuJ3QgaW1wbGVtZW50ZWQgaGVyZS5cbiAgaXQgaXMgY29tcGxldGVseSBvcHRpb25hbC5cbiAgc2lnbmF0dXJlOiBjYWxsYmFjayh0ZXh0WG1sKVxuKi9cbmZpbGVVdGlsaXRpZXMubG9hZFNCR05NTEZpbGUgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHVpVXRpbGl0aWVzLnN0YXJ0U3Bpbm5lcihcImxvYWQtZmlsZS1zcGlubmVyXCIpO1xuICBcbiAgLy8gVXNlcnMgbWF5IHdhbnQgdG8gZG8gY3VzdG9taXplZCB0aGluZ3Mgd2hpbGUgYW4gZXh0ZXJuYWwgZmlsZSBpcyBiZWluZyBsb2FkZWRcbiAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgdGhpcyBwdXJwb3NlIGFuZCBzcGVjaWZ5IHRoZSAnZmlsZW5hbWUnIGFzIGFuIGV2ZW50IHBhcmFtZXRlclxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwic2JnbnZpekxvYWRGaWxlXCIsIFsgZmlsZS5uYW1lIF0gKTsgLy8gQWxpYXNlcyBmb3Igc2JnbnZpekxvYWRGaWxlU3RhcnRcbiAgJCggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInNiZ252aXpMb2FkRmlsZVN0YXJ0XCIsIFsgZmlsZS5uYW1lIF0gKTsgXG4gIFxuICB2YXIgdGV4dFR5cGUgPSAvdGV4dC4qLztcblxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVzdWx0O1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJykgY2FsbGJhY2sodGV4dCk7XG4gICAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dCkpKTtcbiAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgICAgICQoIGRvY3VtZW50ICkudHJpZ2dlciggXCJzYmdudml6TG9hZEZpbGVFbmRcIiwgWyBmaWxlLm5hbWUgXSApOyAvLyBUcmlnZ2VyIGFuIGV2ZW50IHNpZ25hbGluZyB0aGF0IGEgZmlsZSBpcyBsb2FkZWRcbiAgICB9LCAwKTtcbiAgfTtcblxuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbn07XG5maWxlVXRpbGl0aWVzLmxvYWRTQkdOTUxUZXh0ID0gZnVuY3Rpb24odGV4dERhdGEpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVHcmFwaChzYmdubWxUb0pzb24uY29udmVydCh0ZXh0VG9YbWxPYmplY3QodGV4dERhdGEpKSk7XG4gICAgICAgIHVpVXRpbGl0aWVzLmVuZFNwaW5uZXIoXCJsb2FkLWZpbGUtc3Bpbm5lclwiKTtcbiAgICB9LCAwKTtcblxufTtcblxuZmlsZVV0aWxpdGllcy5zYXZlQXNTYmdubWwgPSBmdW5jdGlvbihmaWxlbmFtZSwgcmVuZGVySW5mbykge1xuICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoZmlsZW5hbWUsIHJlbmRlckluZm8pO1xuICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzYmdubWxUZXh0XSwge1xuICAgIHR5cGU6IFwidGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04O1wiLFxuICB9KTtcbiAgc2F2ZUFzKGJsb2IsIGZpbGVuYW1lKTtcbn07XG5maWxlVXRpbGl0aWVzLmNvbnZlcnRTYmdubWxUZXh0VG9Kc29uID0gZnVuY3Rpb24oc2Jnbm1sVGV4dCl7XG4gICAgcmV0dXJuIHNiZ25tbFRvSnNvbi5jb252ZXJ0KHRleHRUb1htbE9iamVjdChzYmdubWxUZXh0KSk7XG59O1xuXG5maWxlVXRpbGl0aWVzLmNyZWF0ZUpzb24gPSBmdW5jdGlvbihqc29uKXtcbiAgICB2YXIgc2Jnbm1sVGV4dCA9IGpzb25Ub1NiZ25tbC5jcmVhdGVTYmdubWwoKTtcbiAgICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQodGV4dFRvWG1sT2JqZWN0KHNiZ25tbFRleHQpKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXRpbGl0aWVzO1xuIiwiLypcbiAqIENvbW1vbiB1dGlsaXRpZXMgZm9yIHNiZ252aXogZ3JhcGhzXG4gKi9cblxudmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpO1xudmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG5mdW5jdGlvbiBncmFwaFV0aWxpdGllcygpIHt9XG5cbmdyYXBoVXRpbGl0aWVzLnVwZGF0ZUdyYXBoID0gZnVuY3Rpb24oY3lHcmFwaCkge1xuICBjb25zb2xlLmxvZygnY3kgdXBkYXRlIGNhbGxlZCcpO1xuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhTdGFydFwiICk7XG4gIC8vIFJlc2V0IHVuZG8vcmVkbyBzdGFjayBhbmQgYnV0dG9ucyB3aGVuIGEgbmV3IGdyYXBoIGlzIGxvYWRlZFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkucmVzZXQoKTtcbi8vICAgIHRoaXMucmVzZXRVbmRvUmVkb0J1dHRvbnMoKTtcbiAgfVxuXG4gIGN5LnN0YXJ0QmF0Y2goKTtcbiAgLy8gY2xlYXIgZGF0YVxuICBjeS5yZW1vdmUoJyonKTtcbiAgY3kuYWRkKGN5R3JhcGgpO1xuXG4gIC8vYWRkIHBvc2l0aW9uIGluZm9ybWF0aW9uIHRvIGRhdGEgZm9yIHByZXNldCBsYXlvdXRcbiAgdmFyIHBvc2l0aW9uTWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3lHcmFwaC5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB4UG9zID0gY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmJib3gueDtcbiAgICB2YXIgeVBvcyA9IGN5R3JhcGgubm9kZXNbaV0uZGF0YS5iYm94Lnk7XG4gICAgcG9zaXRpb25NYXBbY3lHcmFwaC5ub2Rlc1tpXS5kYXRhLmlkXSA9IHsneCc6IHhQb3MsICd5JzogeVBvc307XG4gIH1cblxuICB0aGlzLnJlZnJlc2hQYWRkaW5ncygpOyAvLyBSZWNhbGN1bGF0ZXMvcmVmcmVzaGVzIHRoZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjeS5lbmRCYXRjaCgpO1xuICBcbiAgdmFyIGxheW91dCA9IGN5LmxheW91dCh7XG4gICAgbmFtZTogJ3ByZXNldCcsXG4gICAgcG9zaXRpb25zOiBwb3NpdGlvbk1hcCxcbiAgICBmaXQ6IHRydWUsXG4gICAgcGFkZGluZzogNTBcbiAgfSk7XG4gIFxuICAvLyBDaGVjayB0aGlzIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICBsYXlvdXQucnVuKCk7XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHN0eWxlXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIC8vIEluaXRpbGl6ZSB0aGUgYmVuZCBwb2ludHMgb25jZSB0aGUgZWxlbWVudHMgYXJlIGNyZWF0ZWRcbiAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcbiAgICBjeS5lZGdlQmVuZEVkaXRpbmcoJ2dldCcpLmluaXRCZW5kUG9pbnRzKGN5LmVkZ2VzKCkpO1xuICB9XG4gIFxuICAkKCBkb2N1bWVudCApLnRyaWdnZXIoIFwidXBkYXRlR3JhcGhFbmRcIiApO1xufTtcblxuZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlUGFkZGluZ3MgPSBmdW5jdGlvbihwYWRkaW5nUGVyY2VudCkge1xuICAvL0FzIGRlZmF1bHQgdXNlIHRoZSBjb21wb3VuZCBwYWRkaW5nIHZhbHVlXG4gIGlmICghcGFkZGluZ1BlcmNlbnQpIHtcbiAgICB2YXIgY29tcG91bmRQYWRkaW5nID0gb3B0aW9ucy5jb21wb3VuZFBhZGRpbmc7XG4gICAgcGFkZGluZ1BlcmNlbnQgPSB0eXBlb2YgY29tcG91bmRQYWRkaW5nID09PSAnZnVuY3Rpb24nID8gY29tcG91bmRQYWRkaW5nLmNhbGwoKSA6IGNvbXBvdW5kUGFkZGluZztcbiAgfVxuXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIHZhciB0b3RhbCA9IDA7XG4gIHZhciBudW1PZlNpbXBsZXMgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRoZU5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAodGhlTm9kZS5jaGlsZHJlbigpID09IG51bGwgfHwgdGhlTm9kZS5jaGlsZHJlbigpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0b3RhbCArPSBOdW1iZXIodGhlTm9kZS53aWR0aCgpKTtcbiAgICAgIHRvdGFsICs9IE51bWJlcih0aGVOb2RlLmhlaWdodCgpKTtcbiAgICAgIG51bU9mU2ltcGxlcysrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjYWxjX3BhZGRpbmcgPSAocGFkZGluZ1BlcmNlbnQgLyAxMDApICogTWF0aC5mbG9vcih0b3RhbCAvICgyICogbnVtT2ZTaW1wbGVzKSk7XG4gIGlmIChjYWxjX3BhZGRpbmcgPCA1KSB7XG4gICAgY2FsY19wYWRkaW5nID0gNTtcbiAgfVxuXG4gIHJldHVybiBjYWxjX3BhZGRpbmc7XG59O1xuXG5ncmFwaFV0aWxpdGllcy5yZWNhbGN1bGF0ZVBhZGRpbmdzID0gZ3JhcGhVdGlsaXRpZXMucmVmcmVzaFBhZGRpbmdzID0gZnVuY3Rpb24oKSB7XG4gIC8vIHRoaXMuY2FsY3VsYXRlZFBhZGRpbmdzIGlzIG5vdCB3b3JraW5nIGhlcmUgXG4gIC8vIFRPRE86IHJlcGxhY2UgdGhpcyByZWZlcmVuY2Ugd2l0aCB0aGlzLmNhbGN1bGF0ZWRQYWRkaW5ncyBvbmNlIHRoZSByZWFzb24gaXMgZmlndXJlZCBvdXRcbiAgZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzID0gdGhpcy5jYWxjdWxhdGVQYWRkaW5ncygpO1xuICByZXR1cm4gZ3JhcGhVdGlsaXRpZXMuY2FsY3VsYXRlZFBhZGRpbmdzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBncmFwaFV0aWxpdGllczsiLCJ2YXIgdHh0VXRpbCA9IHJlcXVpcmUoJy4vdGV4dC11dGlsaXRpZXMnKTtcbnZhciBsaWJzYmduanMgPSByZXF1aXJlKCdsaWJzYmduLmpzJyk7XG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcbnZhciBwa2dWZXJzaW9uID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjsgLy8gbmVlZCBpbmZvIGFib3V0IHNiZ252aXogdG8gcHV0IGluIHhtbFxudmFyIHBrZ05hbWUgPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS5uYW1lO1xudmFyIHByZXR0eXByaW50ID0gcmVxdWlyZSgncHJldHR5LWRhdGEnKS5wZDtcblxudmFyIGpzb25Ub1NiZ25tbCA9IHtcbiAgICAvKlxuICAgICAgICB0YWtlcyByZW5kZXJJbmZvIGFzIGFuIG9wdGlvbmFsIGFyZ3VtZW50LiBJdCBjb250YWlucyBhbGwgdGhlIGluZm9ybWF0aW9uIG5lZWRlZCB0byBzYXZlXG4gICAgICAgIHRoZSBzdHlsZSBhbmQgY29sb3JzIHRvIHRoZSByZW5kZXIgZXh0ZW5zaW9uLiBTZWUgbmV3dC9hcHAtdXRpbGl0aWVzIGdldEFsbFN0eWxlcygpXG4gICAgICAgIFN0cnVjdHVyZToge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdGhlIG1hcCBiYWNrZ3JvdW5kIGNvbG9yLFxuICAgICAgICAgICAgY29sb3JzOiB7XG4gICAgICAgICAgICAgIHZhbGlkWG1sVmFsdWU6IGNvbG9yX2lkXG4gICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0eWxlczoge1xuICAgICAgICAgICAgICAgIHN0eWxlS2V5MToge1xuICAgICAgICAgICAgICAgICAgICBpZExpc3Q6IGxpc3Qgb2YgdGhlIG5vZGVzIGlkcyB0aGF0IGhhdmUgdGhpcyBzdHlsZVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0eWxlS2V5MjogLi4uXG4gICAgICAgICAgICAgICAgLi4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAqL1xuICAgIGNyZWF0ZVNiZ25tbCA6IGZ1bmN0aW9uKGZpbGVuYW1lLCByZW5kZXJJbmZvKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBtYXBJRCA9IHR4dFV0aWwuZ2V0WE1MVmFsaWRJZChmaWxlbmFtZSk7XG4gICAgICAgIHZhciBoYXNFeHRlbnNpb24gPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhc1JlbmRlckV4dGVuc2lvbiA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHJlbmRlckluZm8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoYXNFeHRlbnNpb24gPSB0cnVlO1xuICAgICAgICAgICAgaGFzUmVuZGVyRXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYWRkIGhlYWRlcnNcbiAgICAgICAgeG1sSGVhZGVyID0gXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0neWVzJz8+XFxuXCI7XG4gICAgICAgIHZhciBzYmduID0gbmV3IGxpYnNiZ25qcy5TYmduKHt4bWxuczogJ2h0dHA6Ly9zYmduLm9yZy9saWJzYmduLzAuMyd9KTtcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBsaWJzYmduanMuTWFwKHtsYW5ndWFnZTogJ3Byb2Nlc3MgZGVzY3JpcHRpb24nLCBpZDogbWFwSUR9KTtcbiAgICAgICAgaWYgKGhhc0V4dGVuc2lvbikgeyAvLyBleHRlbnNpb24gaXMgdGhlcmVcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBuZXcgbGlic2JnbmpzLkV4dGVuc2lvbigpO1xuICAgICAgICAgICAgaWYgKGhhc1JlbmRlckV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgIGV4dGVuc2lvbi5hZGQoc2VsZi5nZXRSZW5kZXJFeHRlbnNpb25TYmdubWwocmVuZGVySW5mbykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwLnNldEV4dGVuc2lvbihleHRlbnNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGFsbCBnbHlwaHNcbiAgICAgICAgdmFyIGdseXBoTGlzdCA9IFtdO1xuICAgICAgICBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpLmVhY2goZnVuY3Rpb24oZWxlLCBpKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFlbGUuaXNDaGlsZCgpKVxuICAgICAgICAgICAgICAgIGdseXBoTGlzdCA9IGdseXBoTGlzdC5jb25jYXQoc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpKTsgLy8gcmV0dXJucyBwb3RlbnRpYWxseSBtb3JlIHRoYW4gMSBnbHlwaFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gYWRkIHRoZW0gdG8gdGhlIG1hcFxuICAgICAgICBmb3IodmFyIGk9MDsgaTxnbHlwaExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hcC5hZGRHbHlwaChnbHlwaExpc3RbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGFsbCBhcmNzXG4gICAgICAgIGN5LmVkZ2VzKFwiOnZpc2libGVcIikuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwLmFkZEFyYyhzZWxmLmdldEFyY1NiZ25tbChlbGUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Jnbi5zZXRNYXAobWFwKTtcbiAgICAgICAgcmV0dXJuIHByZXR0eXByaW50LnhtbCh4bWxIZWFkZXIgKyBzYmduLnRvWE1MKCkpO1xuICAgIH0sXG5cbiAgICAvLyBzZWUgY3JlYXRlU2Jnbm1sIGZvciBpbmZvIG9uIHRoZSBzdHJ1Y3R1cmUgb2YgcmVuZGVySW5mb1xuICAgIGdldFJlbmRlckV4dGVuc2lvblNiZ25tbCA6IGZ1bmN0aW9uKHJlbmRlckluZm8pIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgdmFyIHJlbmRlckluZm9ybWF0aW9uID0gbmV3IHJlbmRlckV4dGVuc2lvbi5SZW5kZXJJbmZvcm1hdGlvbih7IGlkOiAncmVuZGVySW5mb3JtYXRpb24nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcmVuZGVySW5mby5iYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbU5hbWU6IHBrZ05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtVmVyc2lvbjogcGtnVmVyc2lvbiB9KTtcblxuICAgICAgICAvLyBwb3B1bGF0ZSBsaXN0IG9mIGNvbG9yc1xuICAgICAgICB2YXIgbGlzdE9mQ29sb3JEZWZpbml0aW9ucyA9IG5ldyByZW5kZXJFeHRlbnNpb24uTGlzdE9mQ29sb3JEZWZpbml0aW9ucygpO1xuICAgICAgICBmb3IgKHZhciBjb2xvciBpbiByZW5kZXJJbmZvLmNvbG9ycykge1xuICAgICAgICAgICAgdmFyIGNvbG9yRGVmaW5pdGlvbiA9IG5ldyByZW5kZXJFeHRlbnNpb24uQ29sb3JEZWZpbml0aW9uKHtpZDogcmVuZGVySW5mby5jb2xvcnNbY29sb3JdLCB2YWx1ZTogY29sb3J9KTtcbiAgICAgICAgICAgIGxpc3RPZkNvbG9yRGVmaW5pdGlvbnMuYWRkQ29sb3JEZWZpbml0aW9uKGNvbG9yRGVmaW5pdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVySW5mb3JtYXRpb24uc2V0TGlzdE9mQ29sb3JEZWZpbml0aW9ucyhsaXN0T2ZDb2xvckRlZmluaXRpb25zKTtcblxuICAgICAgICAvLyBwb3B1bGF0ZXMgc3R5bGVzXG4gICAgICAgIHZhciBsaXN0T2ZTdHlsZXMgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLkxpc3RPZlN0eWxlcygpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVySW5mby5zdHlsZXMpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHJlbmRlckluZm8uc3R5bGVzW2tleV07XG4gICAgICAgICAgICB2YXIgeG1sU3R5bGUgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlN0eWxlKHtpZDogdHh0VXRpbC5nZXRYTUxWYWxpZElkKGtleSksIGlkTGlzdDogc3R5bGUuaWRMaXN0LmpvaW4oJyAnKX0pO1xuICAgICAgICAgICAgdmFyIGcgPSBuZXcgcmVuZGVyRXh0ZW5zaW9uLlJlbmRlckdyb3VwKHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogc3R5bGUucHJvcGVydGllcy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBzdHlsZS5wcm9wZXJ0aWVzLmZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogc3R5bGUucHJvcGVydGllcy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogc3R5bGUucHJvcGVydGllcy5mb250U3R5bGUsXG4gICAgICAgICAgICAgICAgZmlsbDogc3R5bGUucHJvcGVydGllcy5maWxsLCAvLyBmaWxsIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5wcm9wZXJ0aWVzLnN0cm9rZSwgLy8gc3Ryb2tlIGNvbG9yXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IHN0eWxlLnByb3BlcnRpZXMuc3Ryb2tlV2lkdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeG1sU3R5bGUuc2V0UmVuZGVyR3JvdXAoZyk7XG4gICAgICAgICAgICBsaXN0T2ZTdHlsZXMuYWRkU3R5bGUoeG1sU3R5bGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlckluZm9ybWF0aW9uLnNldExpc3RPZlN0eWxlcyhsaXN0T2ZTdHlsZXMpO1xuXG4gICAgICAgIHJldHVybiByZW5kZXJJbmZvcm1hdGlvbjtcbiAgICB9LFxuXG4gICAgZ2V0R2x5cGhTYmdubWwgOiBmdW5jdGlvbihub2RlKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBub2RlQ2xhc3MgPSBub2RlLl9wcml2YXRlLmRhdGEuY2xhc3M7XG4gICAgICAgIHZhciBnbHlwaExpc3QgPSBbXTtcblxuICAgICAgICB2YXIgZ2x5cGggPSBuZXcgbGlic2JnbmpzLkdseXBoKHtpZDogbm9kZS5fcHJpdmF0ZS5kYXRhLmlkLCBjbGFzc186IG5vZGVDbGFzc30pO1xuXG4gICAgICAgIC8vIGFzc2lnbiBjb21wYXJ0bWVudFJlZlxuICAgICAgICBpZihub2RlLnBhcmVudCgpLmlzUGFyZW50KCkpe1xuICAgICAgICAgICAgaWYobm9kZUNsYXNzID09PSBcImNvbXBhcnRtZW50XCIpe1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIGdseXBoLmNvbXBhcnRtZW50UmVmID0gbm9kZS5fcHJpdmF0ZS5kYXRhLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHBhcmVudC5fcHJpdmF0ZS5kYXRhLmNsYXNzID09IFwiY29tcGFydG1lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGguY29tcGFydG1lbnRSZWYgPSBwYXJlbnQuX3ByaXZhdGUuZGF0YS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1pc2MgaW5mb3JtYXRpb25cbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICAgICAgICBpZih0eXBlb2YgbGFiZWwgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBnbHlwaC5zZXRMYWJlbChuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBsYWJlbH0pKTtcbiAgICAgICAgLy9hZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICAgICAgaWYodHlwZW9mIG5vZGUuX3ByaXZhdGUuZGF0YS5jbG9uZW1hcmtlciAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIGdseXBoLnNldENsb25lKG5ldyBsaWJzYmduanMuQ2xvbmVUeXBlKCkpO1xuICAgICAgICAvL2FkZCBiYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRHbHlwaEJib3gobm9kZSkpO1xuICAgICAgICAvL2FkZCBwb3J0IGluZm9ybWF0aW9uXG4gICAgICAgIHZhciBwb3J0cyA9IG5vZGUuX3ByaXZhdGUuZGF0YS5wb3J0cztcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBwb3J0cy5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgdmFyIHggPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnggKyBwb3J0c1tpXS54ICogbm9kZS53aWR0aCgpIC8gMTAwO1xuICAgICAgICAgICAgdmFyIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyBwb3J0c1tpXS55ICogbm9kZS5oZWlnaHQoKSAvIDEwMDtcblxuICAgICAgICAgICAgZ2x5cGguYWRkUG9ydChuZXcgbGlic2JnbmpzLnBQb3J0KHtpZDogcG9ydHNbaV0uaWQsIHg6IHgsIHk6IHl9KSk7XG4gICAgICAgICAgICAvKnNiZ25tbFRleHQgPSBzYmdubWxUZXh0ICsgXCI8cG9ydCBpZD0nXCIgKyBwb3J0c1tpXS5pZCtcbiAgICAgICAgICAgICAgICBcIicgeT0nXCIgKyB5ICsgXCInIHg9J1wiICsgeCArIFwiJyAvPlxcblwiOyovXG4gICAgICAgIH1cbiAgICAgICAgLy9hZGQgc3RhdGUgYW5kIGluZm8gYm94IGluZm9ybWF0aW9uXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbm9kZS5fcHJpdmF0ZS5kYXRhLnN0YXRlc2FuZGluZm9zLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICB2YXIgYm94R2x5cGggPSBub2RlLl9wcml2YXRlLmRhdGEuc3RhdGVzYW5kaW5mb3NbaV07XG4gICAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3NJZCA9IG5vZGUuX3ByaXZhdGUuZGF0YS5pZCtcIl9cIitpO1xuICAgICAgICAgICAgaWYoYm94R2x5cGguY2xhenogPT09IFwic3RhdGUgdmFyaWFibGVcIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRTdGF0ZUJveEdseXBoKGJveEdseXBoLCBzdGF0ZXNhbmRpbmZvc0lkLCBub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGJveEdseXBoLmNsYXp6ID09PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIil7XG4gICAgICAgICAgICAgICAgZ2x5cGguYWRkR2x5cGhNZW1iZXIodGhpcy5hZGRJbmZvQm94R2x5cGgoYm94R2x5cGgsIHN0YXRlc2FuZGluZm9zSWQsIG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBnbHlwaCBtZW1iZXJzIHRoYXQgYXJlIG5vdCBzdGF0ZSB2YXJpYWJsZXMgb3IgdW5pdCBvZiBpbmZvOiBzdWJ1bml0c1xuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGxleFwiIHx8IG5vZGVDbGFzcyA9PT0gXCJzdWJtYXBcIil7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBnbHlwaE1lbWJlckxpc3QgPSBzZWxmLmdldEdseXBoU2Jnbm1sKGVsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgZ2x5cGhNZW1iZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGdseXBoLmFkZEdseXBoTWVtYmVyKGdseXBoTWVtYmVyTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjdXJyZW50IGdseXBoIGlzIGRvbmVcbiAgICAgICAgZ2x5cGhMaXN0LnB1c2goZ2x5cGgpO1xuXG4gICAgICAgIC8vIGtlZXAgZ29pbmcgd2l0aCBhbGwgdGhlIGluY2x1ZGVkIGdseXBoc1xuICAgICAgICBpZihub2RlQ2xhc3MgPT09IFwiY29tcGFydG1lbnRcIil7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihlbGUsIGkpe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdseXBoTGlzdCA9IGdseXBoTGlzdC5jb25jYXQoc2VsZi5nZXRHbHlwaFNiZ25tbChlbGUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICBnbHlwaExpc3Q7XG4gICAgfSxcblxuICAgIGdldEFyY1NiZ25tbCA6IGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgICB2YXIgc2Jnbm1sVGV4dCA9IFwiXCI7XG5cbiAgICAgICAgLy9UZW1wb3JhcnkgaGFjayB0byByZXNvbHZlIFwidW5kZWZpbmVkXCIgYXJjIHNvdXJjZSBhbmQgdGFyZ2V0c1xuICAgICAgICB2YXIgYXJjVGFyZ2V0ID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnR0YXJnZXQ7XG4gICAgICAgIHZhciBhcmNTb3VyY2UgPSBlZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZTtcblxuICAgICAgICBpZiAoYXJjU291cmNlID09IG51bGwgfHwgYXJjU291cmNlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIGFyY1NvdXJjZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XG5cbiAgICAgICAgaWYgKGFyY1RhcmdldCA9PSBudWxsIHx8IGFyY1RhcmdldC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICBhcmNUYXJnZXQgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xuXG4gICAgICAgIHZhciBhcmNJZCA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5pZDtcbiAgICAgICAgdmFyIGFyYyA9IG5ldyBsaWJzYmduanMuQXJjKHtpZDogYXJjSWQsIHNvdXJjZTogYXJjU291cmNlLCB0YXJnZXQ6IGFyY1RhcmdldCwgY2xhc3NfOiBlZGdlLl9wcml2YXRlLmRhdGEuY2xhc3N9KTtcblxuICAgICAgICBhcmMuc2V0U3RhcnQobmV3IGxpYnNiZ25qcy5TdGFydFR5cGUoe3g6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guc3RhcnRYLCB5OiBlZGdlLl9wcml2YXRlLnJzY3JhdGNoLnN0YXJ0WX0pKTtcblxuICAgICAgICAvLyBFeHBvcnQgYmVuZCBwb2ludHMgaWYgZWRnZUJlbmRFZGl0aW5nRXh0ZW5zaW9uIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN5LmVkZ2VCZW5kRWRpdGluZyAmJiBjeS5lZGdlQmVuZEVkaXRpbmcoJ2luaXRpYWxpemVkJykpIHtcbiAgICAgICAgICB2YXIgc2VncHRzID0gY3kuZWRnZUJlbmRFZGl0aW5nKCdnZXQnKS5nZXRTZWdtZW50UG9pbnRzKGVkZ2UpO1xuICAgICAgICAgIGlmKHNlZ3B0cyl7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBzZWdwdHMgJiYgaSA8IHNlZ3B0cy5sZW5ndGg7IGkgPSBpICsgMil7XG4gICAgICAgICAgICAgIHZhciBiZW5kWCA9IHNlZ3B0c1tpXTtcbiAgICAgICAgICAgICAgdmFyIGJlbmRZID0gc2VncHRzW2kgKyAxXTtcblxuICAgICAgICAgICAgICBhcmMuYWRkTmV4dChuZXcgbGlic2JnbmpzLk5leHRUeXBlKHt4OiBiZW5kWCwgeTogYmVuZFl9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXJjLnNldEVuZChuZXcgbGlic2JnbmpzLkVuZFR5cGUoe3g6IGVkZ2UuX3ByaXZhdGUucnNjcmF0Y2guZW5kWCwgeTogZWRnZS5fcHJpdmF0ZS5yc2NyYXRjaC5lbmRZfSkpO1xuXG4gICAgICAgIHZhciBjYXJkaW5hbGl0eSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5jYXJkaW5hbGl0eTtcbiAgICAgICAgaWYodHlwZW9mIGNhcmRpbmFsaXR5ICE9ICd1bmRlZmluZWQnICYmIGNhcmRpbmFsaXR5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFyYy5hZGRHbHlwaChuZXcgbGlic2JnbmpzLkdseXBoKHtcbiAgICAgICAgICAgICAgICBpZDogYXJjLmlkKydfY2FyZCcsXG4gICAgICAgICAgICAgICAgY2xhc3NfOiAnY2FyZGluYWxpdHknLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBuZXcgbGlic2JnbmpzLkxhYmVsKHt0ZXh0OiBjYXJkaW5hbGl0eX0pLFxuICAgICAgICAgICAgICAgIGJib3g6IG5ldyBsaWJzYmduanMuQmJveCh7eDogMCwgeTogMCwgdzogMCwgaDogMH0pIC8vIGR1bW15IGJib3gsIG5lZWRlZCBmb3IgZm9ybWF0IGNvbXBsaWFuY2VcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmM7XG4gICAgfSxcblxuICAgIGFkZEdseXBoQmJveCA6IGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICB2YXIgd2lkdGggPSBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBub2RlLmhlaWdodCgpO1xuICAgICAgICB2YXIgeCA9IG5vZGUuX3ByaXZhdGUucG9zaXRpb24ueCAtIHdpZHRoLzI7XG4gICAgICAgIHZhciB5ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XG4gICAgICAgIHJldHVybiBuZXcgbGlic2JnbmpzLkJib3goe3g6IHgsIHk6IHksIHc6IHdpZHRoLCBoOiBoZWlnaHR9KTtcbiAgICB9LFxuXG4gICAgYWRkU3RhdGVBbmRJbmZvQmJveCA6IGZ1bmN0aW9uKG5vZGUsIGJveEdseXBoKXtcbiAgICAgICAgYm94QmJveCA9IGJveEdseXBoLmJib3g7XG5cbiAgICAgICAgdmFyIHggPSBib3hCYm94LnggLyAxMDAgKiBub2RlLndpZHRoKCk7XG4gICAgICAgIHZhciB5ID0gYm94QmJveC55IC8gMTAwICogbm9kZS5oZWlnaHQoKTtcblxuICAgICAgICB4ID0gbm9kZS5fcHJpdmF0ZS5wb3NpdGlvbi54ICsgKHggLSBib3hCYm94LncvMik7XG4gICAgICAgIHkgPSBub2RlLl9wcml2YXRlLnBvc2l0aW9uLnkgKyAoeSAtIGJveEJib3guaC8yKTtcblxuICAgICAgICByZXR1cm4gbmV3IGxpYnNiZ25qcy5CYm94KHt4OiB4LCB5OiB5LCB3OiBib3hCYm94LncsIGg6IGJveEJib3guaH0pO1xuICAgIH0sXG5cbiAgICBhZGRTdGF0ZUJveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XG5cbiAgICAgICAgdmFyIGdseXBoID0gbmV3IGxpYnNiZ25qcy5HbHlwaCh7aWQ6IGlkLCBjbGFzc186ICdzdGF0ZSB2YXJpYWJsZSd9KTtcbiAgICAgICAgdmFyIHN0YXRlID0gbmV3IGxpYnNiZ25qcy5TdGF0ZVR5cGUoKTtcbiAgICAgICAgaWYodHlwZW9mIG5vZGUuc3RhdGUudmFsdWUgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG5vZGUuc3RhdGUudmFsdWU7XG4gICAgICAgIGlmKHR5cGVvZiBub2RlLnN0YXRlLnZhcmlhYmxlICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgc3RhdGUudmFyaWFibGUgPSBub2RlLnN0YXRlLnZhcmlhYmxlO1xuICAgICAgICBnbHlwaC5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIGdseXBoLnNldEJib3godGhpcy5hZGRTdGF0ZUFuZEluZm9CYm94KG1haW5HbHlwaCwgbm9kZSkpO1xuXG4gICAgICAgIHJldHVybiBnbHlwaDtcbiAgICB9LFxuXG4gICAgYWRkSW5mb0JveEdseXBoIDogZnVuY3Rpb24obm9kZSwgaWQsIG1haW5HbHlwaCl7XG4gICAgICAgIHZhciBnbHlwaCA9IG5ldyBsaWJzYmduanMuR2x5cGgoe2lkOiBpZCwgY2xhc3NfOiAndW5pdCBvZiBpbmZvcm1hdGlvbid9KTtcbiAgICAgICAgdmFyIGxhYmVsID0gbmV3IGxpYnNiZ25qcy5MYWJlbCgpO1xuICAgICAgICBpZih0eXBlb2Ygbm9kZS5sYWJlbC50ZXh0ICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgbGFiZWwudGV4dCA9IG5vZGUubGFiZWwudGV4dDtcbiAgICAgICAgZ2x5cGguc2V0TGFiZWwobGFiZWwpO1xuICAgICAgICBnbHlwaC5zZXRCYm94KHRoaXMuYWRkU3RhdGVBbmRJbmZvQmJveChtYWluR2x5cGgsIG5vZGUpKTtcblxuICAgICAgICByZXR1cm4gZ2x5cGg7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uVG9TYmdubWw7XG4iLCIvKlxuICogTGlzdGVuIGRvY3VtZW50IGZvciBrZXlib2FyZCBpbnB1dHMgYW5kIGV4cG9ydHMgdGhlIHV0aWxpdGllcyB0aGF0IGl0IG1ha2VzIHVzZSBvZlxuICovXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG5cbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMgPSB7XG4gIGlzTnVtYmVyS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuICggZS5rZXlDb2RlID49IDQ4ICYmIGUua2V5Q29kZSA8PSA1NyApIHx8ICggZS5rZXlDb2RlID49IDk2ICYmIGUua2V5Q29kZSA8PSAxMDUgKTtcbiAgfSxcbiAgaXNEb3RLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAxOTA7XG4gIH0sXG4gIGlzTWludXNTaWduS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMTA5IHx8IGUua2V5Q29kZSA9PT0gMTg5O1xuICB9LFxuICBpc0xlZnRLZXk6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNztcbiAgfSxcbiAgaXNSaWdodEtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5O1xuICB9LFxuICBpc0JhY2tzcGFjZUtleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDg7XG4gIH0sXG4gIGlzVGFiS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gOTtcbiAgfSxcbiAgaXNFbnRlcktleTogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlLmtleUNvZGUgPT09IDEzO1xuICB9LFxuICBpc0ludGVnZXJGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xuICAgIHJldHVybiB0aGlzLmlzQ3RybE9yQ29tbWFuZFByZXNzZWQoZSkgfHwgdGhpcy5pc01pbnVzU2lnbktleShlKSB8fCB0aGlzLmlzTnVtYmVyS2V5KGUpIFxuICAgICAgICAgICAgfHwgdGhpcy5pc0JhY2tzcGFjZUtleShlKSB8fCB0aGlzLmlzVGFiS2V5KGUpIHx8IHRoaXMuaXNMZWZ0S2V5KGUpIHx8IHRoaXMuaXNSaWdodEtleShlKSB8fCB0aGlzLmlzRW50ZXJLZXkoZSk7XG4gIH0sXG4gIGlzRmxvYXRGaWVsZElucHV0OiBmdW5jdGlvbih2YWx1ZSwgZSkge1xuICAgIHJldHVybiB0aGlzLmlzSW50ZWdlckZpZWxkSW5wdXQodmFsdWUsIGUpIHx8IHRoaXMuaXNEb3RLZXkoZSk7XG4gIH0sXG4gIGlzQ3RybE9yQ29tbWFuZFByZXNzZWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZS5jdHJsS2V5IHx8IGUubWV0YUtleTtcbiAgfVxufTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuaW50ZWdlci1pbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciB2YWx1ZSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcbiAgICByZXR1cm4ga2V5Ym9hcmRJbnB1dFV0aWxpdGllcy5pc0ludGVnZXJGaWVsZElucHV0KHZhbHVlLCBlKTtcbiAgfSk7XG4gIFxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuZmxvYXQtaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyk7XG4gICAgcmV0dXJuIGtleWJvYXJkSW5wdXRVdGlsaXRpZXMuaXNGbG9hdEZpZWxkSW5wdXQodmFsdWUsIGUpO1xuICB9KTtcbiAgXG4gICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLmludGVnZXItaW5wdXQsLmZsb2F0LWlucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgdmFyIG1pbiAgID0gJCh0aGlzKS5hdHRyKCdtaW4nKTtcbiAgICB2YXIgbWF4ICAgPSAkKHRoaXMpLmF0dHIoJ21heCcpO1xuICAgIHZhciB2YWx1ZSA9IHBhcnNlRmxvYXQoJCh0aGlzKS52YWwoKSk7XG4gICAgXG4gICAgaWYobWluICE9IG51bGwpIHtcbiAgICAgIG1pbiA9IHBhcnNlRmxvYXQobWluKTtcbiAgICB9XG4gICAgXG4gICAgaWYobWF4ICE9IG51bGwpIHtcbiAgICAgIG1heCA9IHBhcnNlRmxvYXQobWF4KTtcbiAgICB9XG4gICAgXG4gICAgaWYobWluICE9IG51bGwgJiYgdmFsdWUgPCBtaW4pIHtcbiAgICAgIHZhbHVlID0gbWluO1xuICAgIH1cbiAgICBlbHNlIGlmKG1heCAhPSBudWxsICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICB2YWx1ZSA9IG1heDtcbiAgICB9XG4gICAgXG4gICAgaWYoaXNOYU4odmFsdWUpKSB7XG4gICAgICBpZihtaW4gIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IG1pbjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobWF4ICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSBtYXg7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAkKHRoaXMpLnZhbChcIlwiICsgdmFsdWUpO1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkSW5wdXRVdGlsaXRpZXM7XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllcztcblxuIiwiLyogXG4gKiBUaGVzZSBhcmUgdGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGRpcmVjdGx5IHV0aWxpemVkIGJ5IHRoZSB1c2VyIGludGVyYWN0aW9ucy5cbiAqIElkZWFseSwgdGhpcyBmaWxlIGlzIGp1c3QgcmVxdWlyZWQgYnkgaW5kZXguanNcbiAqL1xuXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBqc29uVG9TYmdubWwgPSByZXF1aXJlKCcuL2pzb24tdG8tc2Jnbm1sLWNvbnZlcnRlcicpO1xudmFyIHNiZ25tbFRvSnNvbiA9IHJlcXVpcmUoJy4vc2Jnbm1sLXRvLWpzb24tY29udmVydGVyJyk7XG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG5cbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxuLy8gSGVscGVycyBzdGFydFxuZnVuY3Rpb24gYmVmb3JlUGVyZm9ybUxheW91dCgpIHtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIGVkZ2VzID0gY3kuZWRnZXMoKTtcblxuICBub2Rlcy5yZW1vdmVEYXRhKFwicG9ydHNcIik7XG4gIGVkZ2VzLnJlbW92ZURhdGEoXCJwb3J0c291cmNlXCIpO1xuICBlZGdlcy5yZW1vdmVEYXRhKFwicG9ydHRhcmdldFwiKTtcblxuICBub2Rlcy5kYXRhKFwicG9ydHNcIiwgW10pO1xuICBlZGdlcy5kYXRhKFwicG9ydHNvdXJjZVwiLCBbXSk7XG4gIGVkZ2VzLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIFtdKTtcblxuICAvLyBUT0RPIGRvIHRoaXMgYnkgdXNpbmcgZXh0ZW5zaW9uIEFQSVxuICBjeS4kKCcuZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKS5yZW1vdmVDbGFzcygnZWRnZWJlbmRlZGl0aW5nLWhhc2JlbmRwb2ludHMnKTtcbiAgZWRnZXMuc2NyYXRjaCgnY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzJywgW10pO1xuICBlZGdlcy5zY3JhdGNoKCdjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlcycsIFtdKTtcbn07XG4vLyBIZWxwZXJzIGVuZFxuXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge31cblxuLy8gRXhwYW5kIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXNUb0V4cGFuZCA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2Rlcyhub2Rlcyk7XG4gIGlmIChub2Rlc1RvRXhwYW5kLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kXCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1RvRXhwYW5kLFxuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmV4cGFuZChub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmNvbGxhcHNlTm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIGlmIChleHBhbmRDb2xsYXBzZS5jb2xsYXBzaWJsZU5vZGVzKG5vZGVzKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVwiLCB7XG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBleHBhbmRDb2xsYXBzZS5jb2xsYXBzZShub2Rlcyk7XG4gIH1cbn07XG5cbi8vIENvbGxhcHNlIGFsbCBjb21wbGV4ZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgY29tcGxleGVzID0gY3kubm9kZXMoXCJbY2xhc3M9J2NvbXBsZXgnXVwiKTtcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMoY29tcGxleGVzKS5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY29sbGFwc2VSZWN1cnNpdmVseVwiLCB7XG4gICAgICBub2RlczogY29tcGxleGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuY29sbGFwc2VSZWN1cnNpdmVseShjb21wbGV4ZXMpO1xuICB9XG59O1xuXG4vLyBFeHBhbmQgYWxsIGNvbXBsZXhlcyByZWN1cnNpdmVseS4gUmVxdWlyZXMgZXhwYW5kQ29sbGFwc2UgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxubWFpblV0aWxpdGllcy5leHBhbmRDb21wbGV4ZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBleHBhbmRDb2xsYXBzZS5leHBhbmRhYmxlTm9kZXMoY3kubm9kZXMoKS5maWx0ZXIoXCJbY2xhc3M9J2NvbXBsZXgnXVwiKSk7XG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBDb2xsYXBzZSBhbGwgbm9kZXMgcmVjdXJzaXZlbHkuIFJlcXVpcmVzIGV4cGFuZENvbGxhcHNlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuY29sbGFwc2VBbGwgPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0IGV4cGFuZENvbGxhcHNlIGFwaVxuICB2YXIgZXhwYW5kQ29sbGFwc2UgPSBjeS5leHBhbmRDb2xsYXBzZSgnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygnOnZpc2libGUnKTtcbiAgaWYgKGV4cGFuZENvbGxhcHNlLmNvbGxhcHNpYmxlTm9kZXMobm9kZXMpLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjb2xsYXBzZVJlY3Vyc2l2ZWx5XCIsIHtcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGV4cGFuZENvbGxhcHNlLmNvbGxhcHNlUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBFeHBhbmQgYWxsIG5vZGVzIHJlY3Vyc2l2ZWx5LiBSZXF1aXJlcyBleHBhbmRDb2xsYXBzZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmV4cGFuZEFsbCA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZXhwYW5kQ29sbGFwc2UgYXBpXG4gIHZhciBleHBhbmRDb2xsYXBzZSA9IGN5LmV4cGFuZENvbGxhcHNlKCdnZXQnKTtcbiAgXG4gIHZhciBub2RlcyA9IGV4cGFuZENvbGxhcHNlLmV4cGFuZGFibGVOb2RlcyhjeS5ub2RlcygnOnZpc2libGUnKSk7XG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiZXhwYW5kUmVjdXJzaXZlbHlcIiwge1xuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXhwYW5kQ29sbGFwc2UuZXhwYW5kUmVjdXJzaXZlbHkobm9kZXMpO1xuICB9XG59O1xuXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0IGFuZCBoaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QuIFxuLy8gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuaGlkZU5vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIFxuICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG5cbiAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWRlXCIsIG5vZGVzVG9IaWRlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZGUobm9kZXNUb0hpZGUpO1xuICB9XG59O1xuXG4vLyBFeHRlbmRzIHRoZSBnaXZlbiBub2RlcyBsaXN0IGluIGEgc21hcnQgd2F5IHRvIGxlYXZlIHRoZSBtYXAgaW50YWN0LiBcbi8vIFRoZW4gdW5oaWRlcyB0aGUgcmVzdWx0aW5nIGxpc3QgYW5kIGhpZGVzIG90aGVycy4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuc2hvd05vZGVzU21hcnQgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIFxuICB2YXIgYWxsTm9kZXMgPSBjeS5lbGVtZW50cygpO1xuICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcbiAgXG4gIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiaGlkZVwiLCBub2Rlc1RvSGlkZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5oaWRlKG5vZGVzVG9IaWRlKTtcbiAgfVxufTtcblxuLy8gVW5oaWRlcyBhbGwgZWxlbWVudHMuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnNob3dBbGwgPSBmdW5jdGlvbigpIHtcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIGlmIChjeS5lbGVtZW50cygpLmxlbmd0aCA9PT0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dcIiwgY3kuZWxlbWVudHMoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmlld1V0aWxpdGllcy5zaG93KGN5LmVsZW1lbnRzKCkpO1xuICB9XG59O1xuXG4vLyBSZW1vdmVzIHRoZSBnaXZlbiBlbGVtZW50cyBpbiBhIHNpbXBsZSB3YXkuIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZSA9IGZ1bmN0aW9uKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUVsZXNTaW1wbGVcIiwge1xuICAgICAgZWxlczogZWxlc1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8vIEV4dGVuZHMgdGhlIGdpdmVuIG5vZGVzIGxpc3QgaW4gYSBzbWFydCB3YXkgdG8gbGVhdmUgdGhlIG1hcCBpbnRhY3QgYW5kIHJlbW92ZXMgdGhlIHJlc3VsdGluZyBsaXN0LiBcbi8vIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuZGVsZXRlTm9kZXNTbWFydCA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZihvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZU5vZGVzU21hcnRcIiwge1xuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgICAgZWxlczogbm9kZXNcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZU5vZGVzU21hcnQobm9kZXMpO1xuICB9XG59O1xuXG4vLyBIaWdobGlnaHRzIG5laWdoYm91cnMgb2YgdGhlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWdobGlnaHROZWlnaGJvdXJzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIC8vIElmIHRoaXMgZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkIHdlIGNhbiBhc3N1bWUgdGhhdCB2aWV3IHV0aWxpdGllcyBleHRlbnNpb24gaXMgb24gdXNlXG4gIHZhciB2aWV3VXRpbGl0aWVzID0gY3kudmlld1V0aWxpdGllcygnZ2V0Jyk7XG4gIFxuICB2YXIgbm9kZXMgPSBfbm9kZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcbiAgdmFyIGVsZXNUb0hpZ2hsaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TmVpZ2hib3Vyc09mTm9kZXMobm9kZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbm90SGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoXCIubm90aGlnaGxpZ2h0ZWRcIikuZmlsdGVyKFwiOnZpc2libGVcIik7XG4gIHZhciBoaWdobGlnaHRlZEVsZXMgPSBjeS5lbGVtZW50cygnOnZpc2libGUnKS5kaWZmZXJlbmNlKG5vdEhpZ2hsaWdodGVkRWxlcyk7XG4gIGlmIChlbGVzVG9IaWdobGlnaHQuc2FtZShoaWdobGlnaHRlZEVsZXMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJoaWdobGlnaHRcIiwgZWxlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChlbGVzVG9IaWdobGlnaHQpO1xuICB9XG59O1xuXG4vLyBGaW5kcyB0aGUgZWxlbWVudHMgd2hvc2UgbGFiZWwgaW5jbHVkZXMgdGhlIGdpdmVuIGxhYmVsIGFuZCBoaWdobGlnaHRzIHByb2Nlc3NlcyBvZiB0aG9zZSBlbGVtZW50cy5cbi8vIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgJ3VuZG9hYmxlJyBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnNlYXJjaEJ5TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuICBpZiAobGFiZWwubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHZhciBub2Rlc1RvSGlnaGxpZ2h0ID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKS5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZSA9IGk7XG4gICAgfVxuICAgIGlmIChlbGUuZGF0YShcImxhYmVsXCIpICYmIGVsZS5kYXRhKFwibGFiZWxcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxhYmVsKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBpZiAobm9kZXNUb0hpZ2hsaWdodC5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcblxuICBub2Rlc1RvSGlnaGxpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmROb2RlTGlzdChub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChub2Rlc1RvSGlnaGxpZ2h0KTtcbiAgfVxufTtcblxuLy8gSGlnaGxpZ2h0cyBwcm9jZXNzZXMgb2YgdGhlIGdpdmVuIG5vZGVzLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgdmFyIG5vZGVzID0gX25vZGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG4gIHZhciBlbGVzVG9IaWdobGlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZE5vZGVMaXN0KG5vZGVzKTtcbiAgaWYgKGVsZXNUb0hpZ2hsaWdodC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5vdEhpZ2hsaWdodGVkRWxlcyA9IGN5LmVsZW1lbnRzKFwiLm5vdGhpZ2hsaWdodGVkXCIpLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xuICB2YXIgaGlnaGxpZ2h0ZWRFbGVzID0gY3kuZWxlbWVudHMoJzp2aXNpYmxlJykuZGlmZmVyZW5jZShub3RIaWdobGlnaHRlZEVsZXMpO1xuICBpZiAoZWxlc1RvSGlnaGxpZ2h0LnNhbWUoaGlnaGxpZ2h0ZWRFbGVzKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgd2UgY2FuIGFzc3VtZSB0aGF0IHZpZXcgdXRpbGl0aWVzIGV4dGVuc2lvbiBpcyBvbiB1c2VcbiAgdmFyIHZpZXdVdGlsaXRpZXMgPSBjeS52aWV3VXRpbGl0aWVzKCdnZXQnKTtcbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImhpZ2hsaWdodFwiLCBlbGVzVG9IaWdobGlnaHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGVsZXNUb0hpZ2hsaWdodCk7XG4gIH1cbn07XG5cbi8vIFVuaGlnaGxpZ2h0cyBhbnkgaGlnaGxpZ2h0ZWQgZWxlbWVudC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZWxlbWVudFV0aWxpdGllcy5ub25lSXNOb3RIaWdobGlnaHRlZCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCB3ZSBjYW4gYXNzdW1lIHRoYXQgdmlldyB1dGlsaXRpZXMgZXh0ZW5zaW9uIGlzIG9uIHVzZVxuICB2YXIgdmlld1V0aWxpdGllcyA9IGN5LnZpZXdVdGlsaXRpZXMoJ2dldCcpO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlSGlnaGxpZ2h0c1wiKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2aWV3VXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMoKTtcbiAgfVxufTtcblxuLy8gUGVyZm9ybXMgbGF5b3V0IGJ5IGdpdmVuIGxheW91dE9wdGlvbnMuIENvbnNpZGVycyAndW5kb2FibGUnIG9wdGlvbi4gSG93ZXZlciwgYnkgc2V0dGluZyBub3RVbmRvYWJsZSBwYXJhbWV0ZXJcbi8vIHRvIGEgdHJ1dGh5IHZhbHVlIHlvdSBjYW4gZm9yY2UgYW4gdW5kYWJsZSBsYXlvdXQgb3BlcmF0aW9uIGluZGVwZW5kYW50IG9mICd1bmRvYWJsZScgb3B0aW9uLlxubWFpblV0aWxpdGllcy5wZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0T3B0aW9ucywgbm90VW5kb2FibGUpIHtcbiAgLy8gVGhpbmdzIHRvIGRvIGJlZm9yZSBwZXJmb3JtaW5nIGxheW91dFxuICBiZWZvcmVQZXJmb3JtTGF5b3V0KCk7XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUgfHwgbm90VW5kb2FibGUpIHsgLy8gJ25vdFVuZG9hYmxlJyBmbGFnIGNhbiBiZSB1c2VkIHRvIGhhdmUgY29tcG9zaXRlIGFjdGlvbnMgaW4gdW5kby9yZWRvIHN0YWNrXG4gICAgdmFyIGxheW91dCA9IGN5LmVsZW1lbnRzKCkuZmlsdGVyKCc6dmlzaWJsZScpLmxheW91dChsYXlvdXRPcHRpb25zKTtcbiAgICBcbiAgICAvLyBDaGVjayB0aGlzIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgbGF5b3V0LnJ1bigpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwibGF5b3V0XCIsIHtcbiAgICAgIG9wdGlvbnM6IGxheW91dE9wdGlvbnMsXG4gICAgICBlbGVzOiBjeS5lbGVtZW50cygpLmZpbHRlcignOnZpc2libGUnKVxuICAgIH0pO1xuICB9XG59O1xuXG4vLyBDcmVhdGVzIGFuIHNiZ25tbCBmaWxlIGNvbnRlbnQgZnJvbSB0aGUgZXhpc2luZyBncmFwaCBhbmQgcmV0dXJucyBpdC5cbm1haW5VdGlsaXRpZXMuY3JlYXRlU2Jnbm1sID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBqc29uVG9TYmdubWwuY3JlYXRlU2Jnbm1sKCk7XG59O1xuXG4vLyBDb252ZXJ0cyBnaXZlbiBzYmdubWwgZGF0YSB0byBhIGpzb24gb2JqZWN0IGluIGEgc3BlY2lhbCBmb3JtYXQgXG4vLyAoaHR0cDovL2pzLmN5dG9zY2FwZS5vcmcvI25vdGF0aW9uL2VsZW1lbnRzLWpzb24pIGFuZCByZXR1cm5zIGl0LlxubWFpblV0aWxpdGllcy5jb252ZXJ0U2Jnbm1sVG9Kc29uID0gZnVuY3Rpb24oZGF0YSkge1xuICByZXR1cm4gc2Jnbm1sVG9Kc29uLmNvbnZlcnQoZGF0YSk7XG59O1xuXG4vLyBDcmVhdGUgdGhlIHF0aXAgY29udGVudHMgb2YgdGhlIGdpdmVuIG5vZGUgYW5kIHJldHVybnMgaXQuXG5tYWluVXRpbGl0aWVzLmdldFF0aXBDb250ZW50ID0gZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRRdGlwQ29udGVudChub2RlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIGV4dHJhIHBhZGRpbmcgZm9yIGNvbXBhcnRtZW50XG4gIGV4dHJhQ29tcGFydG1lbnRQYWRkaW5nOiAxMCxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlXG59O1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xufTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xuICB9XG4gIFxuICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICB9XG5cbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7XG4iLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzYmduanMgPSByZXF1aXJlKCdsaWJzYmduLmpzJyk7XG52YXIgcmVuZGVyRXh0ZW5zaW9uID0gbGlic2JnbmpzLnJlbmRlckV4dGVuc2lvbjtcblxudmFyIHNiZ25tbFRvSnNvbiA9IHtcbiAgaW5zZXJ0ZWROb2Rlczoge30sXG4gIGdldEFsbENvbXBhcnRtZW50czogZnVuY3Rpb24gKGdseXBoTGlzdCkge1xuICAgIHZhciBjb21wYXJ0bWVudHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2x5cGhMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZ2x5cGhMaXN0W2ldLmNsYXNzXyA9PSAnY29tcGFydG1lbnQnKSB7XG4gICAgICAgIHZhciBjb21wYXJ0bWVudCA9IGdseXBoTGlzdFtpXTtcbiAgICAgICAgdmFyIGJib3ggPSBjb21wYXJ0bWVudC5iYm94O1xuICAgICAgICBjb21wYXJ0bWVudHMucHVzaCh7XG4gICAgICAgICAgJ3gnOiBwYXJzZUZsb2F0KGJib3gueCksXG4gICAgICAgICAgJ3knOiBwYXJzZUZsb2F0KGJib3gueSksXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3gudyksXG4gICAgICAgICAgJ2gnOiBwYXJzZUZsb2F0KGJib3guaCksXG4gICAgICAgICAgJ2lkJzogY29tcGFydG1lbnQuaWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcGFydG1lbnRzLnNvcnQoZnVuY3Rpb24gKGMxLCBjMikge1xuICAgICAgaWYgKGMxLmggKiBjMS53IDwgYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGMxLmggKiBjMS53ID4gYzIuaCAqIGMyLncpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wYXJ0bWVudHM7XG4gIH0sXG4gIGlzSW5Cb3VuZGluZ0JveDogZnVuY3Rpb24gKGJib3gxLCBiYm94Mikge1xuICAgIGlmIChiYm94MS54ID4gYmJveDIueCAmJlxuICAgICAgICBiYm94MS55ID4gYmJveDIueSAmJlxuICAgICAgICBiYm94MS54ICsgYmJveDEudyA8IGJib3gyLnggKyBiYm94Mi53ICYmXG4gICAgICAgIGJib3gxLnkgKyBiYm94MS5oIDwgYmJveDIueSArIGJib3gyLmgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGJib3hQcm9wOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIGJib3ggPSBlbGUuYmJveDtcblxuICAgIC8vIHNldCBwb3NpdGlvbnMgYXMgY2VudGVyXG4gICAgYmJveC54ID0gcGFyc2VGbG9hdChiYm94LngpICsgcGFyc2VGbG9hdChiYm94LncpIC8gMjtcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gIHN0YXRlQW5kSW5mb0Jib3hQcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHhQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueCk7XG4gICAgdmFyIHlQb3MgPSBwYXJzZUZsb2F0KHBhcmVudEJib3gueSk7XG5cbiAgICB2YXIgYmJveCA9IGVsZS5iYm94O1xuXG4gICAgLy8gc2V0IHBvc2l0aW9ucyBhcyBjZW50ZXJcbiAgICBiYm94LnggPSBwYXJzZUZsb2F0KGJib3gueCkgKyBwYXJzZUZsb2F0KGJib3gudykgLyAyIC0geFBvcztcbiAgICBiYm94LnkgPSBwYXJzZUZsb2F0KGJib3gueSkgKyBwYXJzZUZsb2F0KGJib3guaCkgLyAyIC0geVBvcztcblxuICAgIGJib3gueCA9IGJib3gueCAvIHBhcnNlRmxvYXQocGFyZW50QmJveC53KSAqIDEwMDtcbiAgICBiYm94LnkgPSBiYm94LnkgLyBwYXJzZUZsb2F0KHBhcmVudEJib3guaCkgKiAxMDA7XG5cbiAgICByZXR1cm4gYmJveDtcbiAgfSxcbiAgZmluZENoaWxkTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGNoaWxkVGFnTmFtZSkge1xuICAgIC8vIGZpbmQgY2hpbGQgbm9kZXMgYXQgZGVwdGggbGV2ZWwgb2YgMSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudFxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IGVsZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxICYmIGNoaWxkLnRhZ05hbWUgPT09IGNoaWxkVGFnTmFtZSkge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9LFxuICBmaW5kQ2hpbGROb2RlOiBmdW5jdGlvbiAoZWxlLCBjaGlsZFRhZ05hbWUpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmZpbmRDaGlsZE5vZGVzKGVsZSwgY2hpbGRUYWdOYW1lKTtcbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoID4gMCA/IG5vZGVzWzBdIDogdW5kZWZpbmVkO1xuICB9LFxuICBzdGF0ZUFuZEluZm9Qcm9wOiBmdW5jdGlvbiAoZWxlLCBwYXJlbnRCYm94KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdGF0ZUFuZEluZm9BcnJheSA9IFtdO1xuXG4gICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVyczsgLy8gdGhpcy5maW5kQ2hpbGROb2RlcyhlbGUsICdnbHlwaCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZEdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICB2YXIgaW5mbyA9IHt9O1xuXG4gICAgICBpZiAoZ2x5cGguY2xhc3NfID09PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzXyB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8ubGFiZWwgPSB7XG4gICAgICAgICAgJ3RleHQnOiAoZ2x5cGgubGFiZWwgJiYgZ2x5cGgubGFiZWwudGV4dCkgfHwgdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGluZm8uYmJveCA9IHNlbGYuc3RhdGVBbmRJbmZvQmJveFByb3AoZ2x5cGgsIHBhcmVudEJib3gpO1xuICAgICAgICBzdGF0ZUFuZEluZm9BcnJheS5wdXNoKGluZm8pO1xuICAgICAgfSBlbHNlIGlmIChnbHlwaC5jbGFzc18gPT09ICdzdGF0ZSB2YXJpYWJsZScpIHtcbiAgICAgICAgaW5mby5pZCA9IGdseXBoLmlkIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgaW5mby5jbGF6eiA9IGdseXBoLmNsYXNzXyB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdseXBoLnN0YXRlO1xuICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGUgJiYgc3RhdGUudmFsdWUpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gKHN0YXRlICYmIHN0YXRlLnZhcmlhYmxlKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIGluZm8uc3RhdGUgPSB7XG4gICAgICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAgICAgJ3ZhcmlhYmxlJzogdmFyaWFibGVcbiAgICAgICAgfTtcbiAgICAgICAgaW5mby5iYm94ID0gc2VsZi5zdGF0ZUFuZEluZm9CYm94UHJvcChnbHlwaCwgcGFyZW50QmJveCk7XG4gICAgICAgIHN0YXRlQW5kSW5mb0FycmF5LnB1c2goaW5mbyk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gc3RhdGVBbmRJbmZvQXJyYXk7XG4gIH0sXG4gIGFkZFBhcmVudEluZm9Ub05vZGU6IGZ1bmN0aW9uIChlbGUsIG5vZGVPYmosIHBhcmVudCwgY29tcGFydG1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjb21wYXJ0bWVudFJlZiA9IGVsZS5jb21wYXJ0bWVudFJlZjtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIG5vZGVPYmoucGFyZW50ID0gcGFyZW50O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb21wYXJ0bWVudFJlZikge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSBjb21wYXJ0bWVudFJlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZU9iai5wYXJlbnQgPSAnJztcblxuICAgICAgLy8gYWRkIGNvbXBhcnRtZW50IGFjY29yZGluZyB0byBnZW9tZXRyeVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJ0bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGJib3hFbCA9IGVsZS5iYm94O1xuICAgICAgICB2YXIgYmJveCA9IHtcbiAgICAgICAgICAneCc6IHBhcnNlRmxvYXQoYmJveEVsLngpLFxuICAgICAgICAgICd5JzogcGFyc2VGbG9hdChiYm94RWwueSksXG4gICAgICAgICAgJ3cnOiBwYXJzZUZsb2F0KGJib3hFbC53KSxcbiAgICAgICAgICAnaCc6IHBhcnNlRmxvYXQoYmJveEVsLmgpLFxuICAgICAgICAgICdpZCc6IGVsZS5pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc2VsZi5pc0luQm91bmRpbmdCb3goYmJveCwgY29tcGFydG1lbnRzW2ldKSkge1xuICAgICAgICAgIG5vZGVPYmoucGFyZW50ID0gY29tcGFydG1lbnRzW2ldLmlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBhZGRDeXRvc2NhcGVKc05vZGU6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5vZGVPYmogPSB7fTtcblxuICAgIC8vIGFkZCBpZCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouaWQgPSBlbGUuaWQ7XG4gICAgLy8gYWRkIG5vZGUgYm91bmRpbmcgYm94IGluZm9ybWF0aW9uXG4gICAgbm9kZU9iai5iYm94ID0gc2VsZi5iYm94UHJvcChlbGUpO1xuICAgIC8vIGFkZCBjbGFzcyBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouY2xhc3MgPSBlbGUuY2xhc3NfO1xuICAgIC8vIGFkZCBsYWJlbCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmoubGFiZWwgPSAoZWxlLmxhYmVsICYmIGVsZS5sYWJlbC50ZXh0KSB8fCB1bmRlZmluZWQ7XG4gICAgLy8gYWRkIHN0YXRlIGFuZCBpbmZvIGJveCBpbmZvcm1hdGlvblxuICAgIG5vZGVPYmouc3RhdGVzYW5kaW5mb3MgPSBzZWxmLnN0YXRlQW5kSW5mb1Byb3AoZWxlLCBub2RlT2JqLmJib3gpO1xuICAgIC8vIGFkZGluZyBwYXJlbnQgaW5mb3JtYXRpb25cbiAgICBzZWxmLmFkZFBhcmVudEluZm9Ub05vZGUoZWxlLCBub2RlT2JqLCBwYXJlbnQsIGNvbXBhcnRtZW50cyk7XG5cbiAgICAvLyBhZGQgY2xvbmUgaW5mb3JtYXRpb25cbiAgICBpZiAoZWxlLmNsb25lKSB7XG4gICAgICBub2RlT2JqLmNsb25lbWFya2VyID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZU9iai5jbG9uZW1hcmtlciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBhZGQgcG9ydCBpbmZvcm1hdGlvblxuICAgIHZhciBwb3J0cyA9IFtdO1xuICAgIHZhciBwb3J0RWxlbWVudHMgPSBlbGUucG9ydHM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcnRFbCA9IHBvcnRFbGVtZW50c1tpXTtcbiAgICAgIHZhciBpZCA9IHBvcnRFbC5pZDtcbiAgICAgIHZhciByZWxhdGl2ZVhQb3MgPSBwYXJzZUZsb2F0KHBvcnRFbC54KSAtIG5vZGVPYmouYmJveC54O1xuICAgICAgdmFyIHJlbGF0aXZlWVBvcyA9IHBhcnNlRmxvYXQocG9ydEVsLnkpIC0gbm9kZU9iai5iYm94Lnk7XG5cbiAgICAgIHJlbGF0aXZlWFBvcyA9IHJlbGF0aXZlWFBvcyAvIHBhcnNlRmxvYXQobm9kZU9iai5iYm94LncpICogMTAwO1xuICAgICAgcmVsYXRpdmVZUG9zID0gcmVsYXRpdmVZUG9zIC8gcGFyc2VGbG9hdChub2RlT2JqLmJib3guaCkgKiAxMDA7XG5cbiAgICAgIHBvcnRzLnB1c2goe1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIHg6IHJlbGF0aXZlWFBvcyxcbiAgICAgICAgeTogcmVsYXRpdmVZUG9zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBub2RlT2JqLnBvcnRzID0gcG9ydHM7XG5cbiAgICB2YXIgY3l0b3NjYXBlSnNOb2RlID0ge2RhdGE6IG5vZGVPYmp9O1xuICAgIGpzb25BcnJheS5wdXNoKGN5dG9zY2FwZUpzTm9kZSk7XG4gIH0sXG4gIHRyYXZlcnNlTm9kZXM6IGZ1bmN0aW9uIChlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpIHtcbiAgICB2YXIgZWxJZCA9IGVsZS5pZDtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaGFuZGxlZEVsZW1lbnRzW2VsZS5jbGFzc19dKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zZXJ0ZWROb2Rlc1tlbElkXSA9IHRydWU7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIGFkZCBjb21wbGV4IG5vZGVzIGhlcmVcblxuICAgIHZhciBlbGVDbGFzcyA9IGVsZS5jbGFzc187XG5cbiAgICBpZiAoZWxlQ2xhc3MgPT09ICdjb21wbGV4JyB8fCBlbGVDbGFzcyA9PT0gJ2NvbXBsZXggbXVsdGltZXInIHx8IGVsZUNsYXNzID09PSAnc3VibWFwJykge1xuICAgICAgc2VsZi5hZGRDeXRvc2NhcGVKc05vZGUoZWxlLCBqc29uQXJyYXksIHBhcmVudCwgY29tcGFydG1lbnRzKTtcblxuICAgICAgdmFyIGNoaWxkR2x5cGhzID0gZWxlLmdseXBoTWVtYmVycztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRHbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGdseXBoID0gY2hpbGRHbHlwaHNbaV07XG4gICAgICAgIHZhciBnbHlwaENsYXNzID0gZ2x5cGguY2xhc3NfO1xuICAgICAgICBpZiAoZ2x5cGhDbGFzcyAhPT0gJ3N0YXRlIHZhcmlhYmxlJyAmJiBnbHlwaENsYXNzICE9PSAndW5pdCBvZiBpbmZvcm1hdGlvbicpIHtcbiAgICAgICAgICBzZWxmLnRyYXZlcnNlTm9kZXMoZ2x5cGgsIGpzb25BcnJheSwgZWxJZCwgY29tcGFydG1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzTm9kZShlbGUsIGpzb25BcnJheSwgcGFyZW50LCBjb21wYXJ0bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgZ2V0UG9ydHM6IGZ1bmN0aW9uICh4bWxPYmplY3QpIHtcbiAgICByZXR1cm4gKCB4bWxPYmplY3QuX2NhY2hlZFBvcnRzID0geG1sT2JqZWN0Ll9jYWNoZWRQb3J0cyB8fCB4bWxPYmplY3QucXVlcnlTZWxlY3RvckFsbCgncG9ydCcpKTtcbiAgfSxcbiAgZ2V0R2x5cGhzOiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzO1xuXG4gICAgaWYgKCFnbHlwaHMpIHtcbiAgICAgIGdseXBocyA9IHhtbE9iamVjdC5fY2FjaGVkR2x5cGhzID0geG1sT2JqZWN0Ll9jYWNoZWRHbHlwaHMgfHwgeG1sT2JqZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2dseXBoJyk7XG5cbiAgICAgIHZhciBpZDJnbHlwaCA9IHhtbE9iamVjdC5faWQyZ2x5cGggPSB7fTtcblxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZ2x5cGhzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICB2YXIgZyA9IGdseXBoc1tpXTtcbiAgICAgICAgdmFyIGlkID0gZy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgaWQyZ2x5cGhbIGlkIF0gPSBnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBnbHlwaHM7XG4gIH0sXG4gIGdldEdseXBoQnlJZDogZnVuY3Rpb24gKHhtbE9iamVjdCwgaWQpIHtcbiAgICB0aGlzLmdldEdseXBocyh4bWxPYmplY3QpOyAvLyBtYWtlIHN1cmUgY2FjaGUgaXMgYnVpbHRcblxuICAgIHJldHVybiB4bWxPYmplY3QuX2lkMmdseXBoW2lkXTtcbiAgfSxcbiAgZ2V0QXJjU291cmNlQW5kVGFyZ2V0OiBmdW5jdGlvbiAoYXJjLCB4bWxPYmplY3QpIHtcbiAgICAvLyBzb3VyY2UgYW5kIHRhcmdldCBjYW4gYmUgaW5zaWRlIG9mIGEgcG9ydFxuICAgIHZhciBzb3VyY2UgPSBhcmMuc291cmNlO1xuICAgIHZhciB0YXJnZXQgPSBhcmMudGFyZ2V0O1xuICAgIHZhciBzb3VyY2VOb2RlSWQ7XG4gICAgdmFyIHRhcmdldE5vZGVJZDtcblxuICAgIHZhciBzb3VyY2VFeGlzdHMgPSB0aGlzLmdldEdseXBoQnlJZCh4bWxPYmplY3QsIHNvdXJjZSk7XG4gICAgdmFyIHRhcmdldEV4aXN0cyA9IHRoaXMuZ2V0R2x5cGhCeUlkKHhtbE9iamVjdCwgdGFyZ2V0KTtcblxuICAgIGlmIChzb3VyY2VFeGlzdHMpIHtcbiAgICAgIHNvdXJjZU5vZGVJZCA9IHNvdXJjZTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0RXhpc3RzKSB7XG4gICAgICB0YXJnZXROb2RlSWQgPSB0YXJnZXQ7XG4gICAgfVxuXG5cbiAgICB2YXIgaTtcbiAgICB2YXIgcG9ydEVscyA9IHRoaXMuZ2V0UG9ydHMoeG1sT2JqZWN0KTtcbiAgICB2YXIgcG9ydDtcbiAgICBpZiAoc291cmNlTm9kZUlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwb3J0RWxzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBzb3VyY2UpIHtcbiAgICAgICAgICBzb3VyY2VOb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldE5vZGVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcG9ydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwb3J0ID0gcG9ydEVsc1tpXTtcbiAgICAgICAgaWYgKHBvcnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXROb2RlSWQgPSBwb3J0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsnc291cmNlJzogc291cmNlTm9kZUlkLCAndGFyZ2V0JzogdGFyZ2V0Tm9kZUlkfTtcbiAgfSxcblxuICBnZXRBcmNCZW5kUG9pbnRQb3NpdGlvbnM6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICB2YXIgYmVuZFBvaW50UG9zaXRpb25zID0gW107XG5cbiAgICB2YXIgY2hpbGRyZW4gPSBlbGUubmV4dHM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9zWCA9IGNoaWxkcmVuW2ldLng7XG4gICAgICB2YXIgcG9zWSA9IGNoaWxkcmVuW2ldLnk7XG5cbiAgICAgIGJlbmRQb2ludFBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJlbmRQb2ludFBvc2l0aW9ucztcbiAgfSxcbiAgYWRkQ3l0b3NjYXBlSnNFZGdlOiBmdW5jdGlvbiAoZWxlLCBqc29uQXJyYXksIHhtbE9iamVjdCkge1xuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5oYW5kbGVkRWxlbWVudHNbZWxlLmNsYXNzX10pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldCA9IHNlbGYuZ2V0QXJjU291cmNlQW5kVGFyZ2V0KGVsZSwgeG1sT2JqZWN0KTtcblxuICAgIGlmICghdGhpcy5pbnNlcnRlZE5vZGVzW3NvdXJjZUFuZFRhcmdldC5zb3VyY2VdIHx8ICF0aGlzLmluc2VydGVkTm9kZXNbc291cmNlQW5kVGFyZ2V0LnRhcmdldF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZWRnZU9iaiA9IHt9O1xuICAgIHZhciBiZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWxmLmdldEFyY0JlbmRQb2ludFBvc2l0aW9ucyhlbGUpO1xuXG4gICAgZWRnZU9iai5pZCA9IGVsZS5pZCB8fCB1bmRlZmluZWQ7XG4gICAgZWRnZU9iai5jbGFzcyA9IGVsZS5jbGFzc187XG4gICAgZWRnZU9iai5iZW5kUG9pbnRQb3NpdGlvbnMgPSBiZW5kUG9pbnRQb3NpdGlvbnM7XG5cbiAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gMDtcbiAgICBpZiAoZWxlLmdseXBocy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZS5nbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVsZS5nbHlwaHNbaV0uY2xhc3NfID09PSAnY2FyZGluYWxpdHknKSB7XG4gICAgICAgICAgdmFyIGxhYmVsID0gZWxlLmdseXBoc1tpXS5sYWJlbDtcbiAgICAgICAgICBlZGdlT2JqLmNhcmRpbmFsaXR5ID0gbGFiZWwudGV4dCB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBlZGdlT2JqLnNvdXJjZSA9IHNvdXJjZUFuZFRhcmdldC5zb3VyY2U7XG4gICAgZWRnZU9iai50YXJnZXQgPSBzb3VyY2VBbmRUYXJnZXQudGFyZ2V0O1xuXG4gICAgZWRnZU9iai5wb3J0c291cmNlID0gZWxlLnNvdXJjZTtcbiAgICBlZGdlT2JqLnBvcnR0YXJnZXQgPSBlbGUudGFyZ2V0O1xuXG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZSA9IHtkYXRhOiBlZGdlT2JqfTtcbiAgICBqc29uQXJyYXkucHVzaChjeXRvc2NhcGVKc0VkZ2UpO1xuICB9LFxuICBhcHBseVN0eWxlOiBmdW5jdGlvbiAocmVuZGVySW5mb3JtYXRpb24sIG5vZGVzLCBlZGdlcykge1xuICAgIC8vIGdldCBhbGwgY29sb3IgaWQgcmVmZXJlbmNlcyB0byB0aGVpciB2YWx1ZVxuICAgIHZhciBjb2xvckxpc3QgPSByZW5kZXJJbmZvcm1hdGlvbi5saXN0T2ZDb2xvckRlZmluaXRpb25zLmNvbG9yRGVmaW5pdGlvbnM7XG4gICAgdmFyIGNvbG9ySURUb1ZhbHVlID0ge307XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgY29sb3JMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb2xvcklEVG9WYWx1ZVtjb2xvckxpc3RbaV0uaWRdID0gY29sb3JMaXN0W2ldLnZhbHVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgc3R5bGUgbGlzdCB0byBlbGVtZW50SWQtaW5kZXhlZCBvYmplY3QgcG9pbnRpbmcgdG8gc3R5bGVcbiAgICAvLyBhbHNvIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlcyB0byBjb2xvciB2YWx1ZXNcbiAgICB2YXIgc3R5bGVMaXN0ID0gcmVuZGVySW5mb3JtYXRpb24ubGlzdE9mU3R5bGVzLnN0eWxlcztcbiAgICB2YXIgZWxlbWVudElEVG9TdHlsZSA9IHt9O1xuICAgIGZvciAodmFyIGk9MDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN0eWxlID0gc3R5bGVMaXN0W2ldO1xuICAgICAgdmFyIHJlbmRlckdyb3VwID0gc3R5bGUucmVuZGVyR3JvdXA7XG5cbiAgICAgIC8vIGNvbnZlcnQgY29sb3IgcmVmZXJlbmNlc1xuICAgICAgaWYgKHJlbmRlckdyb3VwLnN0cm9rZSAhPSBudWxsKSB7XG4gICAgICAgIHJlbmRlckdyb3VwLnN0cm9rZSA9IGNvbG9ySURUb1ZhbHVlW3JlbmRlckdyb3VwLnN0cm9rZV07XG4gICAgICB9XG4gICAgICBpZiAocmVuZGVyR3JvdXAuZmlsbCAhPSBudWxsKSB7XG4gICAgICAgIHJlbmRlckdyb3VwLmZpbGwgPSBjb2xvcklEVG9WYWx1ZVtyZW5kZXJHcm91cC5maWxsXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkTGlzdCA9IHN0eWxlLmlkTGlzdC5zcGxpdCgnICcpO1xuICAgICAgZm9yICh2YXIgaj0wOyBqIDwgaWRMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBpZCA9IGlkTGlzdFtqXTtcbiAgICAgICAgZWxlbWVudElEVG9TdHlsZVtpZF0gPSByZW5kZXJHcm91cDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoZXhUb0RlY2ltYWwgKGhleCkge1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VJbnQoJzB4JytoZXgpIC8gMjU1ICogMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0SGV4Q29sb3IgKGhleCkge1xuICAgICAgaWYgKGhleC5sZW5ndGggPT0gNykgeyAvLyBubyBvcGFjaXR5IHByb3ZpZGVkXG4gICAgICAgIHJldHVybiB7b3BhY2l0eTogbnVsbCwgY29sb3I6IGhleH07XG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8gbGVuZ3RoIG9mIDlcbiAgICAgICAgdmFyIGNvbG9yID0gaGV4LnNsaWNlKDAsNyk7XG4gICAgICAgIHZhciBvcGFjaXR5ID0gaGV4VG9EZWNpbWFsKGhleC5zbGljZSgtMikpO1xuICAgICAgICByZXR1cm4ge29wYWNpdHk6IG9wYWNpdHksIGNvbG9yOiBjb2xvcn07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgdGhlIHN0eWxlIHRvIG5vZGVzIGFuZCBvdmVyd3JpdGUgdGhlIGRlZmF1bHQgc3R5bGVcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgY29sb3IgcHJvcGVydGllcywgd2UgbmVlZCB0byBjaGVjayBvcGFjaXR5XG4gICAgICB2YXIgYmdDb2xvciA9IGVsZW1lbnRJRFRvU3R5bGVbbm9kZS5kYXRhWydpZCddXS5maWxsO1xuICAgICAgaWYgKGJnQ29sb3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNvbnZlcnRIZXhDb2xvcihiZ0NvbG9yKTtcbiAgICAgICAgbm9kZS5kYXRhWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSByZXMuY29sb3I7XG4gICAgICAgIG5vZGUuZGF0YVsnYmFja2dyb3VuZC1vcGFjaXR5J10gPSByZXMub3BhY2l0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGJvcmRlckNvbG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZTtcbiAgICAgIGlmIChib3JkZXJDb2xvcikge1xuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGJvcmRlckNvbG9yKTtcbiAgICAgICAgbm9kZS5kYXRhWydib3JkZXItY29sb3InXSA9IHJlcy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIGJvcmRlcldpZHRoID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnN0cm9rZVdpZHRoO1xuICAgICAgaWYgKGJvcmRlcldpZHRoKSB7XG4gICAgICAgIG5vZGUuZGF0YVsnYm9yZGVyLXdpZHRoJ10gPSBib3JkZXJXaWR0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRTaXplID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLmZvbnRTaXplO1xuICAgICAgaWYgKGZvbnRTaXplKSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1zaXplJ10gPSBmb250U2l6ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRGYW1pbHkgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udEZhbWlseTtcbiAgICAgIGlmIChmb250RmFtaWx5KSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC1mYW1pbHknXSA9IGZvbnRGYW1pbHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb250U3R5bGUgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFN0eWxlO1xuICAgICAgaWYgKGZvbnRTdHlsZSkge1xuICAgICAgICBub2RlLmRhdGFbJ2ZvbnQtc3R5bGUnXSA9IGZvbnRTdHlsZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZvbnRXZWlnaHQgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0uZm9udFdlaWdodDtcbiAgICAgIGlmIChmb250V2VpZ2h0KSB7XG4gICAgICAgIG5vZGUuZGF0YVsnZm9udC13ZWlnaHQnXSA9IGZvbnRXZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0QW5jaG9yID0gZWxlbWVudElEVG9TdHlsZVtub2RlLmRhdGFbJ2lkJ11dLnRleHRBbmNob3I7XG4gICAgICBpZiAodGV4dEFuY2hvcikge1xuICAgICAgICBub2RlLmRhdGFbJ3RleHQtaGFsaWduJ10gPSB0ZXh0QW5jaG9yO1xuICAgICAgfVxuXG4gICAgICB2YXIgdnRleHRBbmNob3IgPSBlbGVtZW50SURUb1N0eWxlW25vZGUuZGF0YVsnaWQnXV0udnRleHRBbmNob3I7XG4gICAgICBpZiAodnRleHRBbmNob3IpIHtcbiAgICAgICAgbm9kZS5kYXRhWyd0ZXh0LXZhbGlnbiddID0gdnRleHRBbmNob3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZG8gdGhlIHNhbWUgZm9yIGVkZ2VzXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG5cbiAgICAgIHZhciBsaW5lQ29sb3IgPSBlbGVtZW50SURUb1N0eWxlW2VkZ2UuZGF0YVsnaWQnXV0uc3Ryb2tlO1xuICAgICAgaWYgKGxpbmVDb2xvcikge1xuICAgICAgICB2YXIgcmVzID0gY29udmVydEhleENvbG9yKGxpbmVDb2xvcik7XG4gICAgICAgIGVkZ2UuZGF0YVsnbGluZS1jb2xvciddID0gcmVzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICB2YXIgd2lkdGggPSBlbGVtZW50SURUb1N0eWxlW2VkZ2UuZGF0YVsnaWQnXV0uc3Ryb2tlV2lkdGg7XG4gICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgZWRnZS5kYXRhWyd3aWR0aCddID0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjb252ZXJ0OiBmdW5jdGlvbiAoeG1sT2JqZWN0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjeXRvc2NhcGVKc05vZGVzID0gW107XG4gICAgdmFyIGN5dG9zY2FwZUpzRWRnZXMgPSBbXTtcblxuICAgIHZhciBzYmduID0gbGlic2JnbmpzLlNiZ24uZnJvbVhNTCh4bWxPYmplY3QucXVlcnlTZWxlY3Rvcignc2JnbicpKTtcbiAgICB2YXIgY29tcGFydG1lbnRzID0gc2VsZi5nZXRBbGxDb21wYXJ0bWVudHMoc2Jnbi5tYXAuZ2x5cGhzKTtcblxuICAgIHZhciBnbHlwaHMgPSBzYmduLm1hcC5nbHlwaHM7XG4gICAgdmFyIGFyY3MgPSBzYmduLm1hcC5hcmNzO1xuXG4gICAgdmFyIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGdseXBocy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdseXBoID0gZ2x5cGhzW2ldO1xuICAgICAgc2VsZi50cmF2ZXJzZU5vZGVzKGdseXBoLCBjeXRvc2NhcGVKc05vZGVzLCAnJywgY29tcGFydG1lbnRzKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJjcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGFyYyA9IGFyY3NbaV07XG4gICAgICBzZWxmLmFkZEN5dG9zY2FwZUpzRWRnZShhcmMsIGN5dG9zY2FwZUpzRWRnZXMsIHhtbE9iamVjdCk7XG4gICAgfVxuXG4gICAgaWYgKHNiZ24ubWFwLmV4dGVuc2lvbiAmJiBzYmduLm1hcC5leHRlbnNpb24uaGFzKCdyZW5kZXJJbmZvcm1hdGlvbicpKSB7IC8vIHJlbmRlciBleHRlbnNpb24gd2FzIGZvdW5kXG4gICAgICBzZWxmLmFwcGx5U3R5bGUoc2Jnbi5tYXAuZXh0ZW5zaW9uLmdldCgncmVuZGVySW5mb3JtYXRpb24nKSwgY3l0b3NjYXBlSnNOb2RlcywgY3l0b3NjYXBlSnNFZGdlcyk7XG4gICAgfVxuXG4gICAgdmFyIGN5dG9zY2FwZUpzR3JhcGggPSB7fTtcbiAgICBjeXRvc2NhcGVKc0dyYXBoLm5vZGVzID0gY3l0b3NjYXBlSnNOb2RlcztcbiAgICBjeXRvc2NhcGVKc0dyYXBoLmVkZ2VzID0gY3l0b3NjYXBlSnNFZGdlcztcblxuICAgIHRoaXMuaW5zZXJ0ZWROb2RlcyA9IHt9O1xuXG4gICAgcmV0dXJuIGN5dG9zY2FwZUpzR3JhcGg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2Jnbm1sVG9Kc29uO1xuIiwiLypcbiAqIFRleHQgdXRpbGl0aWVzIGZvciBjb21tb24gdXNhZ2VcbiAqL1xuXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJyk7XG52YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG5cbnZhciB0ZXh0VXRpbGl0aWVzID0ge1xuICAvL1RPRE86IHVzZSBDU1MncyBcInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXNcIiBzdHlsZSBpbnN0ZWFkIG9mIGZ1bmN0aW9uIGJlbG93P1xuICB0cnVuY2F0ZVRleHQ6IGZ1bmN0aW9uICh0ZXh0UHJvcCwgZm9udCkge1xuICAgIHZhciBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnRleHQuZm9udCA9IGZvbnQ7XG4gICAgXG4gICAgdmFyIGZpdExhYmVsc1RvTm9kZXMgPSBvcHRpb25zLmZpdExhYmVsc1RvTm9kZXM7XG4gICAgZml0TGFiZWxzVG9Ob2RlcyA9IHR5cGVvZiBmaXRMYWJlbHNUb05vZGVzID09PSAnZnVuY3Rpb24nID8gZml0TGFiZWxzVG9Ob2Rlcy5jYWxsKCkgOiBmaXRMYWJlbHNUb05vZGVzO1xuICAgIFxuICAgIHZhciB0ZXh0ID0gdGV4dFByb3AubGFiZWwgfHwgXCJcIjtcbiAgICAvL0lmIGZpdCBsYWJlbHMgdG8gbm9kZXMgaXMgZmFsc2UgZG8gbm90IHRydW5jYXRlXG4gICAgaWYgKGZpdExhYmVsc1RvTm9kZXMgPT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICB2YXIgd2lkdGg7XG4gICAgdmFyIGxlbiA9IHRleHQubGVuZ3RoO1xuICAgIHZhciBlbGxpcHNpcyA9IFwiLi5cIjtcbiAgICB2YXIgdGV4dFdpZHRoID0gKHRleHRQcm9wLndpZHRoID4gMzApID8gdGV4dFByb3Aud2lkdGggLSAxMCA6IHRleHRQcm9wLndpZHRoO1xuICAgIHdoaWxlICgod2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoKSA+IHRleHRXaWR0aCkge1xuICAgICAgLS1sZW47XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgbGVuKSArIGVsbGlwc2lzO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfSxcblxuICAvLyBlbnN1cmUgdGhhdCByZXR1cm5lZCBzdHJpbmcgZm9sbG93cyB4c2Q6SUQgc3RhbmRhcmRcbiAgLy8gc2hvdWxkIGZvbGxvdyByJ15bYS16QS1aX11bXFx3Li1dKiQnXG4gIGdldFhNTFZhbGlkSWQ6IGZ1bmN0aW9uKG9yaWdpbmFsSWQpIHtcbiAgICB2YXIgbmV3SWQgPSBcIlwiO1xuICAgIHZhciB4bWxWYWxpZFJlZ2V4ID0gL15bYS16QS1aX11bXFx3Li1dKiQvO1xuICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChvcmlnaW5hbElkKSkgeyAvLyBkb2Vzbid0IGNvbXBseVxuICAgICAgbmV3SWQgPSBvcmlnaW5hbElkO1xuICAgICAgbmV3SWQgPSBuZXdJZC5yZXBsYWNlKC9bXlxcdy4tXS9nLCBcIlwiKTtcbiAgICAgIGlmICghIHhtbFZhbGlkUmVnZXgudGVzdChuZXdJZCkpIHsgLy8gc3RpbGwgZG9lc24ndCBjb21wbHlcbiAgICAgICAgbmV3SWQgPSBcIl9cIiArIG5ld0lkO1xuICAgICAgICBpZiAoISB4bWxWYWxpZFJlZ2V4LnRlc3QobmV3SWQpKSB7IC8vIG5vcm1hbGx5IHdlIHNob3VsZCBuZXZlciBlbnRlciB0aGlzXG4gICAgICAgICAgLy8gaWYgZm9yIHNvbWUgb2JzY3VyZSByZWFzb24gd2Ugc3RpbGwgZG9uJ3QgY29tcGx5LCB0aHJvdyBlcnJvci5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBtYWtlIGlkZW50aWZlciBjb21wbHkgdG8geHNkOklEIHJlcXVpcmVtZW50czogXCIrbmV3SWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3SWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSWQ7XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGV4dFV0aWxpdGllczsiLCIvKlxuICogQ29tbW9ubHkgbmVlZGVkIFVJIFV0aWxpdGllc1xuICovXG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKTtcbnZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIHVpVXRpbGl0aWVzID0ge1xuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgY2xhc3NOYW1lID0gJ2RlZmF1bHQtY2xhc3MnO1xuICAgIH1cbiAgICBcbiAgICBpZiAoJCgnLicgKyBjbGFzc05hbWUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJChvcHRpb25zLm5ldHdvcmtDb250YWluZXJTZWxlY3Rvcikud2lkdGgoKTtcbiAgICAgIHZhciBjb250YWluZXJIZWlnaHQgPSAkKG9wdGlvbnMubmV0d29ya0NvbnRhaW5lclNlbGVjdG9yKS5oZWlnaHQoKTtcbiAgICAgICQob3B0aW9ucy5uZXR3b3JrQ29udGFpbmVyU2VsZWN0b3IgKyAnOnBhcmVudCcpLnByZXBlbmQoJzxpIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OTk5OyBsZWZ0OiAnICsgY29udGFpbmVyV2lkdGggLyAyICsgJ3B4OyB0b3A6ICcgKyBjb250YWluZXJIZWlnaHQgLyAyICsgJ3B4O1wiIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTN4IGZhLWZ3ICcgKyBjbGFzc05hbWUgKyAnXCI+PC9pPicpO1xuICAgIH1cbiAgfSxcbiAgZW5kU3Bpbm5lcjogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWUgPSAnZGVmYXVsdC1jbGFzcyc7XG4gICAgfVxuICAgIFxuICAgIGlmICgkKCcuJyArIGNsYXNzTmFtZSkubGVuZ3RoID4gMCkge1xuICAgICAgJCgnLicgKyBjbGFzc05hbWUpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1aVV0aWxpdGllcztcblxuXG4iLCIvKlxuICogVGhpcyBmaWxlIGV4cG9ydHMgdGhlIGZ1bmN0aW9ucyB0byBiZSB1dGlsaXplZCBpbiB1bmRvcmVkbyBleHRlbnNpb24gYWN0aW9ucyBcbiAqL1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG5cbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHtcbiAgLy8gU2VjdGlvbiBTdGFydFxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcbiAgZGVsZXRlRWxlc1NpbXBsZTogZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlRWxlc1NpbXBsZShwYXJhbS5lbGVzKTtcbiAgfSxcbiAgcmVzdG9yZUVsZXM6IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgdmFyIHBhcmFtID0ge307XG4gICAgcGFyYW0uZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7XG4gICAgcmV0dXJuIHBhcmFtO1xuICB9LFxuICBkZWxldGVOb2Rlc1NtYXJ0OiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVOb2Rlc1NtYXJ0KHBhcmFtLmVsZXMpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5kZWxldGVFbGVzU2ltcGxlKHBhcmFtLmVsZXMpO1xuICB9LFxuICAvLyBTZWN0aW9uIEVuZFxuICAvLyBBZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19

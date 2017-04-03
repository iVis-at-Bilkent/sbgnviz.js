var txtUtil = require('./text-utilities');
var pkgVersion = require('../../package.json').version; // need info about sbgnviz to put in xml
var pkgName = require('../../package.json').name;

var sbgnmlRenderExtension = {};
sbgnmlRenderExtension.xmlns = "http://www.sbml.org/sbml/level3/version1/render/version1";

sbgnmlRenderExtension.ColorDefinition = function(id, value) {
	// both are optional
	this.id = id;
	this.value = value;
};
sbgnmlRenderExtension.ColorDefinition.prototype.toXML = function () {
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
sbgnmlRenderExtension.ColorDefinition.fromXML = function (xml) {
	var colorDefinition = new sbgnmlRenderExtension.ColorDefinition();
	colorDefinition.id = xml.getAttribute('id');
	colorDefinition.value = xml.getAttribute('value');
	return colorDefinition;
};

sbgnmlRenderExtension.ListOfColorDefinitions = function () {
	this.colorList = [];
};
sbgnmlRenderExtension.ListOfColorDefinitions.prototype.addColorDefinition = function (colorDefinition) {
	this.colorList.push(colorDefinition);
};
sbgnmlRenderExtension.ListOfColorDefinitions.prototype.toXML = function () {
	var xmlString = "<listOfColorDefinitions>\n";
	for(var i=0; i<this.colorList.length; i++) {
		var color = this.colorList[i];
		xmlString += color.toXML();
	}
	xmlString += "</listOfColorDefinitions>\n";
	return xmlString;
};
sbgnmlRenderExtension.ListOfColorDefinitions.fromXML = function (xml) {
	var listOfColorDefinitions = new sbgnmlRenderExtension.ListOfColorDefinitions();

	var colorDefinitions = xml.getElementsByTagName('colorDefinition');
	for (var i=0; i<colorDefinitions.length; i++) {
		var colorDefinitionXML = colorDefinitions[i];
		var colorDefinition = sbgnmlRenderExtension.ColorDefinition.fromXML(colorDefinitionXML);
		listOfColorDefinitions.addColorDefinition(colorDefinition);
	}
	return listOfColorDefinitions;
};


sbgnmlRenderExtension.RenderGroup = function (param) {
	// each of those are optional, so test if it is defined is mandatory
	// specific to renderGroup
	this.fontSize = param.fontSize;
	this.fontFamily = param.fontFamily;
	this.fontWeight = param.fontWeight;
	this.fontStyle = param.fontStyle;
	this.textAnchor = param.textAnchor; // probably useless
	this.vtextAnchor = param.vtextAnchor; // probably useless
	// from GraphicalPrimitive2D
	this.fill = param.fill; // fill color
	// from GraphicalPrimitive1D
	this.id = param.id;
	this.stroke = param.stroke; // stroke color
	this.strokeWidth = param.strokeWidth;
};
sbgnmlRenderExtension.RenderGroup.prototype.toXML = function () {
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
sbgnmlRenderExtension.RenderGroup.fromXML = function (xml) {
	var renderGroup = new sbgnmlRenderExtension.RenderGroup({});
	renderGroup.id = xml.getAttribute('id');
	renderGroup.fontSize = xml.getAttribute('fontSize');
	renderGroup.fontFamily = xml.getAttribute('fontFamily');
	renderGroup.fontWeight = xml.getAttribute('fontWeight');
	renderGroup.fontStyle = xml.getAttribute('fontStyle');
	renderGroup.textAnchor = xml.getAttribute('textAnchor');
	renderGroup.vtextAnchor = xml.getAttribute('vtextAnchor');
	renderGroup.stroke = xml.getAttribute('stroke');
	renderGroup.strokeWidth = xml.getAttribute('strokeWidth');
	renderGroup.fill = xml.getAttribute('fill');
	return renderGroup;
};

// localStyle from specs
sbgnmlRenderExtension.Style = function(id, name, idList) {
	// everything is optional	
	this.id = id;
	this.name = name;
	this.idList = idList;
	this.renderGroup = null; // 0 or 1
};
sbgnmlRenderExtension.Style.prototype.setRenderGroup = function (renderGroup) {
	this.renderGroup = renderGroup;
};
sbgnmlRenderExtension.Style.prototype.toXML = function () {
	var xmlString = "<style";
	if (this.id != null) {
		xmlString += " id='"+this.id+"'";
	}
	if (this.name != null) {
		xmlString += " name='"+this.name+"'";
	}
	if (this.idList != null) {
		xmlString += " idList='"+this.idList.join(' ')+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
};
sbgnmlRenderExtension.Style.fromXML = function (xml) {
	var style = new sbgnmlRenderExtension.Style();
	style.id = xml.getAttribute('id');
	style.name = xml.getAttribute('name');
	var idList = xml.getAttribute('idList');
	style.idList = idList != null ? idList.split(' ') : [];

	var renderGroupXML = xml.getElementsByTagName('g')[0];
	if (renderGroupXML != null) {
		style.renderGroup = sbgnmlRenderExtension.RenderGroup.fromXML(renderGroupXML);
	}
	return style;
};

sbgnmlRenderExtension.ListOfStyles = function() {
	this.styleList = [];
};
sbgnmlRenderExtension.ListOfStyles.prototype.addStyle = function(style) {
	this.styleList.push(style);
};
sbgnmlRenderExtension.ListOfStyles.prototype.toXML = function () {
	var xmlString = "<listOfStyles>\n";
	for(var i=0; i<this.styleList.length; i++) {
		var style = this.styleList[i];
		xmlString += style.toXML();
	}
	xmlString += "</listOfStyles>\n";
	return xmlString;
};
sbgnmlRenderExtension.ListOfStyles.fromXML = function (xml) {
	var listOfStyles = new sbgnmlRenderExtension.ListOfStyles();

	var styles = xml.getElementsByTagName('style');
	for (var i=0; i<styles.length; i++) {
		var styleXML = styles[i];
		var style = sbgnmlRenderExtension.Style.fromXML(styleXML);
		listOfStyles.addStyle(style);
	}
	return listOfStyles;
};

sbgnmlRenderExtension.RenderInformation = function (id, name, backgroundColor, providedProgName, providedProgVersion) {
	this.id = id; // required, rest is optional
	this.name = name;
	this.programName = providedProgName || pkgName;
	this.programVersion = providedProgVersion || pkgVersion;
	this.backgroundColor = backgroundColor;
	this.listOfColorDefinitions = null;
	this.listOfStyles = null;
	/*this.listOfColorDefinitions = new renderExtension.ListOfColorDefinitions(renderInfo.colorDef.colorList);
	this.listOfStyles = new renderExtension.ListOfStyles(renderInfo.styleDef);
	*/
};
sbgnmlRenderExtension.RenderInformation.prototype.setListOfColorDefinition = function(listOfColorDefinitions) {
	this.listOfColorDefinitions = listOfColorDefinitions;
};
sbgnmlRenderExtension.RenderInformation.prototype.setListOfStyles = function(listOfStyles) {
	this.listOfStyles = listOfStyles;
};
sbgnmlRenderExtension.RenderInformation.prototype.toXML = function() {
	// tag and its attributes
	var xmlString = "<renderInformation id='"+this.id+"'";
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
	xmlString += " xmlns='"+sbgnmlRenderExtension.xmlns+"'>\n";

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
sbgnmlRenderExtension.RenderInformation.fromXML = function (xml) {
	var renderInformation = new sbgnmlRenderExtension.RenderInformation();
	renderInformation.id = xml.getAttribute('id');
	renderInformation.name = xml.getAttribute('name');
	renderInformation.programName = xml.getAttribute('programName');
	renderInformation.programVersion = xml.getAttribute('programVersion');
	renderInformation.backgroundColor = xml.getAttribute('backgroundColor');

	var listOfColorDefinitionsXML = xml.getElementsByTagName('listOfColorDefinitions')[0];
	var listOfStylesXML = xml.getElementsByTagName('listOfStyles')[0];
	if (listOfColorDefinitionsXML != null) {
		renderInformation.listOfColorDefinitions = sbgnmlRenderExtension.ListOfColorDefinitions.fromXML(listOfColorDefinitionsXML);
	}
	if (listOfStylesXML != null) {
		renderInformation.listOfStyles = sbgnmlRenderExtension.ListOfStyles.fromXML(listOfStylesXML);
	}

	return renderInformation;
};

/* probably useless, seems like nobody use this in the extension
sbgnmlRenderExtension.defaultValues = {
	backgroundColor: null,
	fontSize: null,
	fontFamily: null,
	fontWeight: null,
	fontStyle: null,
	textAnchor: null,
	vtextAnchor: null,
	fill: null,
	stroke: null,
	strokeWidth: null
};


sbgnmlRenderExtension.listOfRenderInformation = {
	defaultValues: {},
	renderInformationList: []
}
*/

module.exports = sbgnmlRenderExtension;
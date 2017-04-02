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
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.value !== 'undefined') {
		xmlString += " value='"+this.value+"'";
	}
	xmlString += " />\n";
	return xmlString;
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
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.fontSize !== 'undefined') {
		xmlString += " fontSize='"+this.fontSize+"'";
	}
	if (typeof this.fontFamily !== 'undefined') {
		xmlString += " fontFamily='"+this.fontFamily+"'";
	}
	if (typeof this.fontWeight !== 'undefined') {
		xmlString += " fontWeight='"+this.fontWeight+"'";
	}
	if (typeof this.fontStyle !== 'undefined') {
		xmlString += " fontStyle='"+this.fontStyle+"'";
	}
	if (typeof this.textAnchor !== 'undefined') {
		xmlString += " textAnchor='"+this.textAnchor+"'";
	}
	if (typeof this.vtextAnchor !== 'undefined') {
		xmlString += " vtextAnchor='"+this.vtextAnchor+"'";
	}
	if (typeof this.stroke !== 'undefined') {
		xmlString += " stroke='"+this.stroke+"'";
	}
	if (typeof this.strokeWidth !== 'undefined') {
		xmlString += " strokeWidth='"+this.strokeWidth+"'";
	}
	if (typeof this.fill !== 'undefined') {
		xmlString += " fill='"+this.fill+"'";
	}
	xmlString += " />\n";
	return xmlString;
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
	if (typeof this.id !== 'undefined') {
		xmlString += " id='"+this.id+"'";
	}
	if (typeof this.name !== 'undefined') {
		xmlString += " name='"+this.name+"'";
	}
	if (typeof this.idList !== 'undefined') {
		xmlString += " idList='"+this.idList.join(' ')+"'";
	}
	xmlString += ">\n";

	if (this.renderGroup) {
		xmlString += this.renderGroup.toXML();
	}

	xmlString += "</style>\n";
	return xmlString;
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

sbgnmlRenderExtension.RenderInformation = function (id, name, backgroundColor) {
	this.id = id; // required, rest is optional
	this.name = name;
	this.programName = pkgName;
	this.programVersion = pkgVersion;
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
	if (typeof this.name !== 'undefined') {
		xmlString += " name='"+this.name+"'";
	}
	if (typeof this.programName !== 'undefined') {
		xmlString += " programName='"+this.programName+"'";
	}
	if (typeof this.programVersion !== 'undefined') {
		xmlString += " programVersion='"+this.programVersion+"'";
	}
	if (typeof this.backgroundColor !== 'undefined') {
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
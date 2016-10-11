var sbgnStyleSheet = cytoscape.stylesheet()
    .selector("node")
    .css({
      'border-width': 1.5,
      'border-color': '#555',
      'background-color': '#f6f6f6',
      'font-size': 11,
//          'shape': 'data(sbgnclass)',
      'background-opacity': 0.5,
      'text-opacity': 1,
      'opacity': 1
    })
    .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
    .css({
      'background-image': 'sampleapp-images/clone_bg.png',
      'background-position-x': '50%',
      'background-position-y': '100%',
      'background-width': '100%',
      'background-height': '25%',
      'background-fit': 'none',
      'background-image-opacity': function (ele) {
        if(!ele.data('sbgnclonemarker')){
          return 0;
        }
        return ele.css('background-opacity');
      }
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='process'][sbgnclass!='association'][sbgnclass!='dissociation'][sbgnclass!='compartment'][sbgnclass!='source and sink']")
    .css({
//          'content': 'data(sbgnlabel)',
      'content': function (ele) {
        return getElementContent(ele);
      },
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': function (ele) {
        return getLabelTextSize(ele);
      }
    })
    .selector("node[sbgnclass]")
    .css({
      'shape': function (ele) {
        return getCyShape(ele);
      }
    })
    .selector("node[sbgnclass='perturbing agent']")
    .css({
      'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
    })
    .selector("node[sbgnclass='association']")
    .css({
      'background-color': '#6B6B6B'
    })
    .selector("node[sbgnclass='tag']")
    .css({
      'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
    })
    .selector("node[sbgnclass='complex']")
    .css({
      'background-color': '#F4F3EE',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': function (ele) {
        return getLabelTextSize(ele);
      },
      'width': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('width');
      },
      'height': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('height');
      },
      'content': function(ele){
        return getElementContent(ele);
      }
    })
    .selector("node[sbgnclass='compartment']")
    .css({
      'border-width': 3.75,
      'background-opacity': 0,
      'background-color': '#FFFFFF',
      'content': function(ele){
        return getElementContent(ele);
      },
      'width': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('width');
      },
      'height': function(ele){
        if(ele.children() == null || ele.children().length == 0){
          return '36';
        }
        return ele.data('height');
      },
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': function (ele) {
        return getLabelTextSize(ele);
      }
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
    .css({
      'width': 'data(sbgnbbox.w)',
      'height': 'data(sbgnbbox.h)'
    })
    .selector("node:selected")
    .css({
      'border-color': '#d67614',
      'target-arrow-color': '#000',
      'text-outline-color': '#000'})
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
      'width': 1.5,
      'target-arrow-color': '#555',
      'source-arrow-color': '#555',
//          'target-arrow-shape': 'data(sbgnclass)'
    })
    .selector("edge[sbgnclass]")
    .css({
      'target-arrow-shape': function (ele) {
        return getCyArrowShape(ele);
      },
      'source-arrow-shape': 'none'
    })
    .selector("edge[sbgnclass='inhibition']")
    .css({
      'target-arrow-fill': 'filled'
    })
    .selector("edge[sbgnclass='consumption']")
    .css({
      'line-style': 'consumption'
    })
    .selector("edge[sbgnclass='production']")
    .css({
      'target-arrow-fill': 'filled',
      'line-style': 'production'
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
    .selector("core")
    .css({
      'selection-box-color': '#d67614',
      'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
    })
    .selector(".ui-cytoscape-edgehandles-source")
    .css({
      'border-color': '#5CC2ED',
      'border-width': 3
    })
    .selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
    .css({
      'background-color': '#5CC2ED'
    })
    .selector("edge.ui-cytoscape-edgehandles-preview")
    .css({
      'line-color': '#5CC2ED'
    })
    .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
    .css({
      'shape': 'rectangle',
      'width': 15,
      'height': 15
    })
    .selector('edge.meta')
    .css({
      'line-color': '#C4C4C4',
      'source-arrow-color': '#C4C4C4',
      'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.meta:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    })
    .selector("node.changeBackgroundOpacity")
    .css({
      'background-opacity': 'data(backgroundOpacity)'
    })
    .selector("node.changeLabelTextSize")
    .css({
      'font-size': function (ele) {
        return getLabelTextSize(ele);
      }
    })
    .selector("node.changeContent")
    .css({
      'content': function (ele) {
        return getElementContent(ele);
      }
    })
    .selector("node.changeBorderColor")
    .css({
      'border-color': 'data(borderColor)'
    })
    .selector("node.changeBorderColor:selected")
    .css({
      'border-color': '#d67614'
    })
    .selector("edge.changeLineColor")
    .css({
      'line-color': 'data(lineColor)',
      'source-arrow-color': 'data(lineColor)',
      'target-arrow-color': 'data(lineColor)'
    })
    .selector("edge.changeLineColor:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    })
    .selector('edge.changeLineColor.meta')
    .css({
      'line-color': '#C4C4C4',
      'source-arrow-color': '#C4C4C4',
      'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.changeLineColor.meta:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    }).selector("node.changeClonedStatus")
    .css({
      'background-image-opacity': function (ele) {
        if(!ele.data('sbgnclonemarker')){
          return 0;
        }
        return ele.css('background-opacity');
      }
    });
// end of sbgnStyleSheet

//(private) helper functions
function getCyShape(ele) {
  var shape = ele.data('sbgnclass');
  if (shape.endsWith(' multimer')) {
    shape = shape.replace(' multimer', '');
  }

  if (shape == 'compartment') {
    return 'roundrectangle';
  }
  if (shape == 'phenotype') {
    return 'hexagon';
  }
  if (shape == 'perturbing agent' || shape == 'tag') {
    return 'polygon';
  }
  if (shape == 'source and sink' || shape == 'nucleic acid feature' || shape == 'dissociation'
          || shape == 'macromolecule' || shape == 'simple chemical' || shape == 'complex'
          || shape == 'unspecified entity' || shape == 'process' || shape == 'omitted process'
          || shape == 'uncertain process' || shape == 'association') {
    return shape;
  }
  return 'ellipse';
};

function getCyArrowShape(ele) {
  var sbgnclass = ele.data('sbgnclass');
  if (sbgnclass == 'necessary stimulation') {
    return 'necessary stimulation';
//    return 'triangle-tee';
  }
  if (sbgnclass == 'inhibition') {
    return 'tee';
  }
  if (sbgnclass == 'catalysis') {
    return 'circle';
  }
  if (sbgnclass == 'stimulation' || sbgnclass == 'production') {
    return 'triangle';
  }
  if (sbgnclass == 'modulation') {
    return 'diamond';
  }
  return 'none';
};

function getElementContent(ele) {
  var sbgnclass = ele.data('sbgnclass');
  
  if (sbgnclass.endsWith(' multimer')) {
    sbgnclass = sbgnclass.replace(' multimer', '');
  }

  var content = "";
  if (sbgnclass == 'macromolecule' || sbgnclass == 'simple chemical'
          || sbgnclass == 'phenotype'
          || sbgnclass == 'unspecified entity' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'perturbing agent' || sbgnclass == 'tag') {
    content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
  }
  else if(sbgnclass == 'compartment'){
    content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
  }
  else if(sbgnclass == 'complex'){
    if(ele.children().length == 0){
      if(ele.data('sbgnlabel')){
        content = ele.data('sbgnlabel');
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
  else if (sbgnclass == 'and') {
    content = 'AND';
  }
  else if (sbgnclass == 'or') {
    content = 'OR';
  }
  else if (sbgnclass == 'not') {
    content = 'NOT';
  }
  else if (sbgnclass == 'omitted process') {
    content = '\\\\';
  }
  else if (sbgnclass == 'uncertain process') {
    content = '?';
  }
  else if (sbgnclass == 'dissociation') {
    content = 'O';
  }

  var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('sbgnbbox').w;

  var textProp = {
    label: content,
    width: ( sbgnclass==('complex') || sbgnclass==('compartment') )?textWidth * 2:textWidth
  };

  var font = getLabelTextSize(ele) + "px Arial";
  return truncateText(textProp, font);
};

function getLabelTextSize(ele) {
  var sbgnclass = ele.data('sbgnclass');
  if (sbgnclass.endsWith('process')) {
    return 18;
  }
  else if(sbgnclass === 'complex' || sbgnclass === 'compartment') {
    return 16;
  }
  return getDynamicLabelTextSize(ele);
};

// calculates the dynamic label size for the given node
function getDynamicLabelTextSize(ele) {
  var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];
  var dynamicLabelSizeCoefficient;

  if (dynamicLabelSize == 'small') {
    dynamicLabelSizeCoefficient = 0.75;
  }
  else if (dynamicLabelSize == 'regular') {
    dynamicLabelSizeCoefficient = 1;
  }
  else if (dynamicLabelSize == 'large') {
    dynamicLabelSizeCoefficient = 1.25;
  }

  var h = ele.height();
  var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

  return textHeight;
};
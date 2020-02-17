
module.exports = function () {
    var cy;
    var parsedDataMap;
    var visibleDataMapByExp;
    var groupedDataMap;
    var colorMap;
    var fname;
    var fdesc;
    function experimentalDataOverlay (param) {
      // Init
      cy = param.sbgnCyInstance.getCy();
      parsedDataMap = {};
      visibleDataMapByExp = {};
      groupedDataMap = {};
      colorMap = {};
      fname = "";
      fdesc = "";
    }

    experimentalDataOverlay.getName = function(){
      return fname;
    }

    experimentalDataOverlay.getDesc = function(){
      return fdesc;
    }

    experimentalDataOverlay.getGroupedDataMap = function(){
      return groupedDataMap
    }

    experimentalDataOverlay.getVisibleData = function(){
      return visibleDataMapByExp;
    }
    experimentalDataOverlay.removeAll = function(){
      var parsed = {};
      var visible = {};
      var grouped = {};
      for(let i in parsedDataMap){
        if(!parsed[i]){
          parsed[i] = {};
        }
        for(let j in parsedDataMap[i]){
          parsed[i][j] = parsedDataMap[i][j];
        }
      }
      for(let i in visibleDataMapByExp){
        visible[i] = visibleDataMapByExp[i];
      }
      for(let i in groupedDataMap){
        if(!grouped[i]){
          grouped[i] = [];
        }
        for(let j in groupedDataMap[i]){
          grouped[i].push(groupedDataMap[i][j]);
        }
      }
      parsedDataMap = {};
      visibleDataMapByExp = {};
      groupedDataMap = {};
      this.showData();
      params = {parsed, visible, grouped};
      return params;

    }

    experimentalDataOverlay.restoreAll = function(parsed, visible, grouped){
      parsedDataMap = parsed;
      visibleDataMapByExp = visible;
      groupedDataMap = grouped;
      this.showData();
      param = {};
      return param;
    }

    experimentalDataOverlay.addExp = function(fileName, expName, isVisible, values, groupArray) {
      visibleDataMapByExp[fileName + '-' + expName] = isVisible;
      groupedDataMap[fileName] = groupArray;
      
      for (let i in values) {
        if(values[i][fileName + '-' + expName] != undefined)
          parsedDataMap[i][fileName + '-' + expName] = values[i][fileName + '-' + expName];
      }
      
      var params = {fileName, expName};
      this.showData();
      return params;
    }

    experimentalDataOverlay.addFile = function(fileName, parsed, visible, grouped) {
      parsedDataMap = parsed;
      visibleDataMapByExp = visible;
      groupedDataMap = grouped;
      this.showData();
      param = {fileName};
      return param;
    }

    experimentalDataOverlay.removeExp = function(fileName, expName) {
      var isVisible = false;
      var values = {};
      var groupArray = [];

      if(visibleDataMapByExp[fileName + '-' + expName] != undefined){
        isVisible = visibleDataMapByExp[fileName + '-' + expName];
        delete visibleDataMapByExp[fileName + '-' + expName];
      }
      
      if(groupedDataMap[fileName] != undefined){
        for(let i in groupedDataMap[fileName]){
          groupArray[i] = groupedDataMap[fileName][i];
        }
        //groupArray = groupedDataMap[fileName];
        var index = groupedDataMap[fileName].indexOf(expName);

        if(index != -1){
          delete groupedDataMap[fileName][index];
        }
      }
      
      for (let i in parsedDataMap) {
        if(parsedDataMap[i][fileName + '-' + expName] != undefined){
          if (!(i in values)) {
            values[i] = {}
          }
          values[i][fileName + '-' + expName] = parsedDataMap[i][fileName + '-' + expName];
          delete parsedDataMap[i][fileName + '-' + expName];
        }
      }
      
      if(groupedDataMap[fileName] != undefined){
        var count = 0;
        for(let i = 0; i<groupedDataMap[fileName].length; i++){
          if(!groupedDataMap[fileName][i])
            count++;
        }
        if(count == groupedDataMap[fileName].length){
          delete groupedDataMap[fileName];
        }
      }
      params = {fileName, expName, isVisible, values, groupArray};
      this.showData();
      return params;
    }

    experimentalDataOverlay.removeFile = function(fileName) {
      if(groupedDataMap[fileName] == undefined){
        return;
      }

      var parsed = {};
      var visible = {};
      var grouped = {};
      for(let i in parsedDataMap){
        if(!parsed[i]){
          parsed[i] = {};
        }
        for(let j in parsedDataMap[i]){
          parsed[i][j] = parsedDataMap[i][j];
        }
      }
      for(let i in visibleDataMapByExp){
        visible[i] = visibleDataMapByExp[i];
      }
      for(let i in groupedDataMap){
        if(!grouped[i]){
          grouped[i] = [];
        }
        for(let j in groupedDataMap[i]){
          grouped[i].push(groupedDataMap[i][j]);
        }
      }

      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j];
        if(visibleDataMapByExp[fileName + '-' + expName] != undefined)
          delete visibleDataMapByExp[fileName + '-' + expName];
        for (let i in parsedDataMap) {
          delete parsedDataMap[i][fileName + '-' + expName];
        }
      }
      delete groupedDataMap[fileName];

      var params = {fileName,parsed,visible,grouped};
      this.showData();
      var k = 0;
      for (let i in groupedDataMap)
      {
        k++;
      }
      if(k == 0){groupedDataMap = ""}
      return params;
    }

    experimentalDataOverlay.hideExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
        return;
      visibleDataMapByExp[fileName + '-' + expName] = false;
      params = {fileName, expName};
      this.showData();
      return params;
    }
  
    experimentalDataOverlay.hideFile = function(fileName) {
      var invisible = {};
      if(groupedDataMap[fileName] == undefined){
        return;
      }
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j];
        if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
          continue;
        if(visibleDataMapByExp[fileName + '-' + expName] == true){
          invisible[fileName + '-' + expName] = false;
          visibleDataMapByExp[fileName + '-' + expName] = false;
        }
      }

      this.showData();
      params = {invisible}
      return params;
    }

    experimentalDataOverlay.hideFileUndo = function(fileName, invisible) {
      for (let j in invisible){
        visibleDataMapByExp[j] = true;
      }
      this.showData();
      return {fileName};
    }

    experimentalDataOverlay.unhideExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
        return;
      visibleDataMapByExp[fileName + '-' + expName] = true;
      params = {fileName, expName};
      this.showData();
      return params;
    }
  
    experimentalDataOverlay.unhideFile = function(fileName) {
      var visible = {};
      if(groupedDataMap[fileName] == undefined){
        return;
      }
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j];
        if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
          continue;
        if(visibleDataMapByExp[fileName + '-' + expName] == false){
          visibleDataMapByExp[fileName + '-' + expName] = true;
          visible[fileName + '-' + expName] = true;
        }
      }
      this.showData();
      params = {fileName, visible}
      return params;
    }

    experimentalDataOverlay.unhideFileUndo = function(fileName, visible) {
      for (let j in visible){
        visibleDataMapByExp[j] = false;
      }
      this.showData();
      return {fileName};
    }

    experimentalDataOverlay.countVisibleDataByExp = function() {
      // Count the genomic data that will be displayed on nodes' body
      let dataBoxCount = 0
      for (let exp in visibleDataMapByExp) {
        if (visibleDataMapByExp[exp]) {
          dataBoxCount++
        }
      }
      return dataBoxCount
    }

    experimentalDataOverlay.generateSVGForNode = function (ele) {
      const dataBoxCount = this.countVisibleDataByExp()
  
      // Experimental data overlay part !
     // const dataURI = 'data:image/svg+xml;utf8,'
      const svgNameSpace = 'http://www.w3.org/2000/svg'
      const nodeLabel = ele.data('label')
  
      // // If there is no genomic data for this node return !
      // if (!(nodeLabel in parsedDataMap)) {
      //   return dataURI
      // }
  
      const eleBBox = ele.boundingBox()
      const reqWidth = eleBBox.w
      const reqHeight = eleBBox.h
      const overlayRecBoxW = reqWidth
      const overlayRecBoxH = reqHeight
      const svg = document.createElementNS(svgNameSpace, 'svg')
      // It seems this should be set according to the node size !
      svg.setAttribute('width', reqWidth)
      svg.setAttribute('height', eleBBox.h)
      // This is important you need to include this to succesfully render in cytoscape.js!
      svg.setAttribute('xmlns', svgNameSpace)
  
      // Overlay Data Rect
      const overLayRectBBox = {
        w: overlayRecBoxW,
        h: overlayRecBoxH,
        x: 0,
        y: 0
      }
  
      const frequencyData = parsedDataMap[nodeLabel]
  
      let maxDataBoxCount = /*(genomicDataBoxCount > 3) ? 3:*/ dataBoxCount
      let counter = 0
  
      for (let i in groupedDataMap) {
        for (let j in groupedDataMap[i]) {
          const fileName = i
          const expName = groupedDataMap[i][j]
          if (!visibleDataMapByExp[fileName + '-' + expName]) {
            continue
          }
  
          if (frequencyData[fileName + '-' + expName] !== undefined) {
            dataRectangleGenerator(
              overLayRectBBox.x +
                (counter * overLayRectBBox.w) / maxDataBoxCount,
              overLayRectBBox.y,
              overLayRectBBox.w / maxDataBoxCount,
              overLayRectBBox.h,
              frequencyData[fileName + '-' + expName],
              svg,
              fileName
            )
          } else {
            dataRectangleGenerator(
              overLayRectBBox.x +
                (counter * overLayRectBBox.w) / maxDataBoxCount,
              overLayRectBBox.y,
              overLayRectBBox.w / maxDataBoxCount,
              overLayRectBBox.h,
              null,
              svg,
              fileName
            )
          }
  
          counter++
        }
      }
  
      function interpolateColor(color1, color2, factor) {
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

      function decideColor(percent, fileName){
        var sorted = [];
        for(let i in colorMap[fileName]){
          sorted.push(i);
        }
        sorted.sort();

        var prev = sorted[0];
        var next = sorted[sorted.length-1];

        if(percent < prev || percent > next){
          return ({r: 210, g: 210, b: 210})
        }
        
        for(let k in sorted){
          var i = sorted[k];
          if(i == percent){
            return ({r: colorMap[fileName][i][0], g: colorMap[fileName][i][1], b: colorMap[fileName][i][2]})
          }
          else if(i > percent){
            next = i;
            break;
          }
          else{
            prev = i;
          }
        }

        var steps = 1 / (next - prev);
        var res = interpolateColor(colorMap[fileName][prev], colorMap[fileName][next], steps * (percent - prev));

        return ({r: res[0], g: res[1], b: res[2]});
      }
      function dataRectangleGenerator(x, y, w, h, percent, parentSVG, fileName) {
        let colorString = ''
        if (percent) {
          var color = decideColor(parseInt(percent), fileName);
          colorString =
              'rgb(' +
              Math.round(color.r) +
              ',' +
              Math.round(color.g) +
              ',' +
              Math.round(color.b) + ')';
          // Rectangle Part
          const overlayRect = document.createElementNS(svgNameSpace, 'rect')
          overlayRect.setAttribute('x', x)
          overlayRect.setAttribute('y', y)
          overlayRect.setAttribute('width', w)
          overlayRect.setAttribute('height', h)
          overlayRect.setAttribute(
            'style',
            'stroke-width:1;stroke:rgb(0,0,0);opacity:1;fill:' + colorString + ';'
          )
  
          parentSVG.appendChild(overlayRect)
        } else {
          colorString = 'rgb(210,210,210)'
  
          // Rectangle Part
          const overlayRect = document.createElementNS(svgNameSpace, 'rect')
          overlayRect.setAttribute('x', x)
          overlayRect.setAttribute('y', y)
          overlayRect.setAttribute('width', w)
          overlayRect.setAttribute('height', h)
          overlayRect.setAttribute(
            'style',
            'stroke-width:1;stroke:rgb(0,0,0);opacity:1;fill:' + colorString + ';'
          )
  
          parentSVG.appendChild(overlayRect)
        }
      }

      // function dataRectangleGenerator(x, y, w, h, percent, parentSVG) {
      //   let colorString = ''
      //   if (percent) {
      //     const isNegativePercent = percent < 0
      //     let _percent = Math.abs(percent)
      //     // Handle special cases here !
      //     _percent = _percent < 0.5 ? 2 : _percent
      //     _percent = _percent === 1 ? 2 : _percent
      //     // Here we are using non linear regression
      //     // Fitting points of (0,0), (25,140), (50,220), (100, 255)
          
      //     const percentColor = 255 - (-7.118 + 53.9765 * Math.log(_percent))
  
      //     if (percent === 0) {
      //       colorString = 'rgb(255,255,255)'
      //     } else if (isNegativePercent) {
      //       colorString =
      //         'rgb(' +
      //         Math.round(percentColor) +
      //         ',' +
      //         Math.round(percentColor) +
      //         ',255)'
      //       percent = percent.substring(1)
      //     } else {
      //       colorString =
      //         'rgb(255,' +
      //         Math.round(percentColor) +
      //         ',' +
      //         Math.round(percentColor) +
      //         ')'
      //     }
      //     // Rectangle Part
      //     const overlayRect = document.createElementNS(svgNameSpace, 'rect')
      //     overlayRect.setAttribute('x', x)
      //     overlayRect.setAttribute('y', y)
      //     overlayRect.setAttribute('width', w)
      //     overlayRect.setAttribute('height', h)
      //     overlayRect.setAttribute(
      //       'style',
      //       'stroke-width:1;stroke:rgb(0,0,0);opacity:1;fill:' + colorString + ';'
      //     )
  
      //     parentSVG.appendChild(overlayRect)
      //   } else {
      //     colorString = 'rgb(210,210,210)'
  
      //     // Rectangle Part
      //     const overlayRect = document.createElementNS(svgNameSpace, 'rect')
      //     overlayRect.setAttribute('x', x)
      //     overlayRect.setAttribute('y', y)
      //     overlayRect.setAttribute('width', w)
      //     overlayRect.setAttribute('height', h)
      //     overlayRect.setAttribute(
      //       'style',
      //       'stroke-width:1;stroke:rgb(0,0,0);opacity:1;fill:' + colorString + ';'
      //     )
  
      //     parentSVG.appendChild(overlayRect)
      //   }
      // }
  
      return svg
    }

    experimentalDataOverlay.showData = function() {
      const self = this
      cy.nodes().forEach(function(node) { 
        const nodeLabel = node.data('label')
        var imageURI = 'data:image/svg+xml;utf8,'
        if(nodeLabel in parsedDataMap){
          imageURI = imageURI + encodeURIComponent(self.generateSVGForNode(node).outerHTML)
          node.data('background-image', imageURI),
          node.data('background-position-x', '100%');
          node.data('background-position-y', '100%');
          node.data('background-width', '100%');
          node.data('background-height', '100%');
          node.data('background-fit', 'contain');
          node.data('background-image-opacity', '1');
        }
        else{
          node.data('background-image',imageURI);
        }
      })

    }
  
    experimentalDataOverlay.hexToRgb = function(hex) {
      if(hex[0] == '#'){
        hex = hex.substring(1);
      }
      else {
        return;
      }
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      return [r,g,b];
    }

    experimentalDataOverlay.isHex = function(hex) {
      return typeof hex == 'string'
          && hex.length == 7
          && !isNaN(Number('0x' + hex.substring(1)))
          && hex[0] == '#'
    }

    experimentalDataOverlay.parseData= function(data, fileName) {
      parsedDataMap = parsedDataMap || {}
      visibleDataMapByExp = visibleDataMapByExp || {}
      groupedDataMap = groupedDataMap || {}
      colorMap = colorMap || {}
      const experiments = [];
      var colors = {};

      if(fileName in groupedDataMap){
        return
      }

      var colorm = colorMap;
      var intregex = "^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$";
      var version = '1.0';
      var clr = false;
      // By lines
      const lines = data.split('\n')
      if(lines.length < 2){
        return "Error";
      }
      console.log(lines)
      var k = 0;
      var upto = 4;
      if(lines.length < 4){
        upto = lines.length;
      }
      for(let i = 0; i<upto; i++){
        if(lines[i].substring(0,7) == 'version'){
          k++;
          const metaLines = lines[i].split('\t');
          if(metaLines[1] && metaLines[1].length > 1){
            version =  metaLines[1];
          }
          else{
            fname = "";
            fdesc = "";
            version = "1.0";
            colorMap = colorm;
            return "Error";
          }
        }
        if(lines[i].substring(0,4) == 'name'){
          k++;
          const metaLines = lines[i].split('\t');
          if(metaLines[1] && metaLines[1].length > 1){
            fname =  metaLines[1];
          }
          else{
            fname = "";
            fdesc = "";
            version = "1.0";
            colorMap = colorm;
            return "Error";
          }
        }
        if(lines[i].substring(0,11) == 'description'){
          k++;
          const metaLines = lines[i].split('\t');
          if(metaLines[1] && metaLines[1].length > 1){
            fdesc =  metaLines[1];
          }
          else{
            fname = "";
            fdesc = "";
            version = "1.0";
            colorMap = colorm;
            return "Error";
          }
        }
        if(lines[i].substring(0,5) == 'color'){
          clr = true;
          k++;
          const metaLines = lines[i].split('\t');
          if(metaLines.length <= 1 && metaLines.length % 2 == 0){
            return "Error";
          }

          for(let t = 1; t < metaLines.length - 1; t=t+2){
            var hex = metaLines[t+1]
            if(t == metaLines.length - 2){
              hex = metaLines[t+1].substring(0,metaLines.length - 2);
            }
            if(metaLines[t] == "min" || metaLines[t] == "max"){
              if(this.isHex(hex)){
                colors[(metaLines[t])] = this.hexToRgb(hex);
              }
            }
            
            else if(parseInt(metaLines[t]) != NaN){
              if(this.isHex(hex)){
                colors[parseInt(metaLines[t])] = this.hexToRgb(hex);
              }
              else{
                fname = "";
                fdesc = "";
                colorMap = colorm;
                version = "1.0";
                return "Error";
              }
            }
            else{
              fname = "";
              fdesc = "";
              colorMap = colorm;
              version = "1.0";
              return "Error";
            }
          }
        }
      }

      //default colors
      if(!clr){
        colors["min"] = this.hexToRgb('#0000ff');
        colors["max"] = this.hexToRgb('#ff0000');
        colors[0] = this.hexToRgb('#ffffff');
      }

      
      

      var parsed = parsedDataMap;
      var visible = visibleDataMapByExp;
      var grouped = groupedDataMap;
      
      // First line is meta data !
      const metaLineColumns = lines[k].split('\t')
  
      // Parse experiment types
      for (let i = 1; i < metaLineColumns.length; i++) {
        if(i == metaLineColumns.length - 1){
          var length = metaLineColumns[i].length
          experiments.push(metaLineColumns[i].substring(0,length - 1))
        }
        else
          experiments.push(metaLineColumns[i])
        
        visibleDataMapByExp[fileName + '-' + experiments[i - 1]] = true
       
        if (groupedDataMap[fileName] === undefined) {
          groupedDataMap[fileName] = []
        }
        groupedDataMap[fileName].push(experiments[i - 1])
      }

      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;

      // parse genomic data
      for (let i = k+1; i < lines.length; i++) {
        // EOF check
        if (lines[i].length === 0) {
          break
        }
        // Split each line by tab and parse genomic data content
        const lineContent = lines[i].split('\t')
        const eleSymbol = lineContent[0]
  
        // If current gene entry is not  in genomic data map create new map
        if (!(eleSymbol in parsedDataMap)) {
          parsedDataMap[eleSymbol] = {}
        }
  
        // Add each entry of genomic data
        for (let j = 1; j < lineContent.length; j++) {
          if(j == lineContent.length - 1){
            lineContent[j] = lineContent[j].substring(0,lineContent[j].length - 1)
          }
          if(lineContent[j].match(intregex)){
            parsedDataMap[eleSymbol][fileName + '-' + experiments[j - 1]] = lineContent[j];
          }
          else{
            parsedDataMap = parsed;
            visibleDataMapByExp = visible;
            groupedDataMap = grouped;
            colorMap = colorm;
            fname = "";
            fdesc = "";
            version = "1.0";
            return "Error";
          }
          if(lineContent[j] > max){
            max = lineContent[j];
          }
          if(lineContent[j] < min){
            min = lineContent[j];
          }
        }
      }

      if(colors['min']){
        var colorvalue = colors['min'];
        delete colors['min'];
        colors[min] = colorvalue;
      }

      if(colors['max']){
        var colorvalue = colors['max'];
        delete colors['max'];
        colors[max] = colorvalue;
      }

      colorMap[fileName] = colors;


      var params = {fileName};
      this.showData();
      return params;
    }

    experimentalDataOverlay.expButtonChange= function(evt) 
    {
      console.log("change button for hide experimet redo");
      console.log(evt.target.value)
      if(evt.target.value === "true" || evt.target.value == true)
      {
        console.log("here==true")
        evt.target.style.backgroundColor = "#777";
        evt.target.value = "false";
      }
      else
      {
        console.log("here")
        evt.target.value = "true";
        evt.target.style.backgroundColor = "";
      }
      console.log("changed taget value is")
      console.log(evt.target.value);
      param = {evt};
      return param;
    }

    experimentalDataOverlay.fileButtonChangeHide= function(subExperiments) 
    {
      console.log("sbgnviz for file color change");
      var params = [];
      for (i = 0; i < subExperiments.length; i++)
      {
        if(subExperiments[i].value == 'true'){
          params.push(subExperiments[i])
          subExperiments[i].value = false;
          subExperiments[i].style.backgroundColor = "#777";
        }
      }
   
      return params;
    }
    
    experimentalDataOverlay.fileButtonChangeUnHide= function(subExperiments) 
    {
      var params = [];
      console.log("sbgnviz for file color change");
      for (i = 0; i < subExperiments.length; i++)
      {
        if(subExperiments[i].value == 'false'){
          params.push(subExperiments[i]);
          subExperiments[i].value = true;
          subExperiments[i].style.backgroundColor = "";
        }
      }
      return params;
    }
    experimentalDataOverlay.buttonUpdate = function(param)
    {
      console.log("buttonupdate");
      var document = param
      for (let i in visibleDataMapByExp)
      {
        var index = i.indexOf('-');
        var fileName = i.substring(0,index);
        var expName = i.substring(index+1);
        var buttonName = "experiment-vis-"+ fileName+ "?" + expName;
        var button = document.getElementById(buttonName);
        if(button != null){
        if(visibleDataMapByExp[i] == true ||visibleDataMapByExp[i] === true ){
          button.value = "true";
          button.style.backgroundColor = "";
        }
        else {
          button.value = "false";
          button.style.backgroundColor = "#777";
        }
      }
    }
      console.log("button update finished");
    }
    return experimentalDataOverlay;
}

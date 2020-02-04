
module.exports = function () {
    var cy;
    var parsedDataMap;
    var visibleDataMapByExp;
    var groupedDataMap;
    function experimentalDataOverlay (param) {
      // Init
      cy = param.sbgnCyInstance.getCy();
      parsedDataMap = {};
      visibleDataMapByExp = {};
      groupedDataMap = {};
    }

    experimentalDataOverlay.getGroupedDataMap = function(){
      return groupedDataMap
    }

    experimentalDataOverlay.clearAllExp = function(){
      parsedDataMap = {};
      visibleDataMapByExp = {};
      groupedDataMap = {};
      this.showData();
    }

    experimentalDataOverlay.removeExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName])
        delete visibleDataMapByExp[fileName + '-' + expName]
      
      if(groupedDataMap[fileName]){
        
        var index = groupedDataMap[fileName].indexOf(expName)

        if(index != -1){
          delete groupedDataMap[fileName][index]
        }
      }
      
      for (let i in parsedDataMap) {
        if(parsedDataMap[i][fileName + '-' + expName])
          delete parsedDataMap[i][fileName + '-' + expName]
      }
      
      if(groupedDataMap[fileName] && groupedDataMap[fileName].length == 0){
        delete groupedDataMap[fileName]
      }
      this.showData()
    }

    experimentalDataOverlay.removeFile = function(fileName) {
      if(groupedDataMap[fileName] == undefined){
        return
      }
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j]
        if(visibleDataMapByExp[fileName + '-' + expName])
          delete visibleDataMapByExp[fileName + '-' + expName]
        for (let i in parsedDataMap) {
          delete parsedDataMap[i][fileName + '-' + expName]
        }
      }
      delete groupedDataMap[fileName]
      this.showData()
    }

    experimentalDataOverlay.hideExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
        return
      visibleDataMapByExp[fileName + '-' + expName] = false
      this.showData()
    }
  
    experimentalDataOverlay.hideFile = function(fileName) {
      if(groupedDataMap[fileName] == undefined){
        return
      }
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j]
        if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
          continue
        visibleDataMapByExp[fileName + '-' + expName] = false
      }
      this.showData()
    }

    experimentalDataOverlay.changeVisExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName] == undefined){
        return
      }
      if (visibleDataMapByExp[fileName + '-' + expName]){
        visibleDataMapByExp[fileName + '-' + expName] = false
      }
      else
        visibleDataMapByExp[fileName + '-' + expName] = true
      this.showData()
    }

    experimentalDataOverlay.unhideExp = function(fileName, expName) {
      if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
        return
      visibleDataMapByExp[fileName + '-' + expName] = true
      this.showData()
    }
  
    experimentalDataOverlay.unhideFile = function(fileName) {
      if(groupedDataMap[fileName] == undefined){
        return
      }
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j]
        if(visibleDataMapByExp[fileName + '-' + expName] == undefined)
          continue
        visibleDataMapByExp[fileName + '-' + expName] = true
      }
      this.showData()
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
              svg
            )
          } else {
            dataRectangleGenerator(
              overLayRectBBox.x +
                (counter * overLayRectBBox.w) / maxDataBoxCount,
              overLayRectBBox.y,
              overLayRectBBox.w / maxDataBoxCount,
              overLayRectBBox.h,
              null,
              svg
            )
          }
  
          counter++
        }
      }
  
      function dataRectangleGenerator(x, y, w, h, percent, parentSVG) {
        let colorString = ''
        if (percent) {
          const isNegativePercent = percent < 0
          let _percent = Math.abs(percent)
          // Handle special cases here !
          _percent = _percent < 0.5 ? 2 : _percent
          _percent = _percent === 1 ? 2 : _percent
          // Here we are using non linear regression
          // Fitting points of (0,0), (25,140), (50,220), (100, 255)
          const percentColor = 255 - (-7.118 + 53.9765 * Math.log(_percent))
  
          if (percent === 0) {
            colorString = 'rgb(255,255,255)'
          } else if (isNegativePercent) {
            colorString =
              'rgb(' +
              Math.round(percentColor) +
              ',' +
              Math.round(percentColor) +
              ',255)'
            percent = percent.substring(1)
          } else {
            colorString =
              'rgb(255,' +
              Math.round(percentColor) +
              ',' +
              Math.round(percentColor) +
              ')'
          }
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
  
    experimentalDataOverlay.parseData= function(data, fileName) {
      parsedDataMap = parsedDataMap || {}
      visibleDataMapByExp = visibleDataMapByExp || {}
      groupedDataMap = groupedDataMap || {}
      const experiments = [];
      if(fileName in groupedDataMap){
        return
      }

      // By lines
      const lines = data.split('\n')
      // First line is meta data !
      const metaLineColumns = lines[0].split('\t')
  
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

      // parse genomic data
      for (let i = 1; i < lines.length; i++) {
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
          parsedDataMap[eleSymbol][fileName + '-' + experiments[j - 1]] = lineContent[j]
        }
      }
    }
  
    return experimentalDataOverlay;
}
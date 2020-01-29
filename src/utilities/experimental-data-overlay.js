
module.exports = function () {
    var cy;
    var parsedDataMap;
    var visibleDataMapByExp;
    var groupedDataMap;
    function experimentalDataOverlay (param) {
      // Init
      console.log("in init");
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
    }

    experimentalDataOverlay.removeExp = function(fileName, expName) {
      delete visibleDataMapByExp[fileName + '-' + expName]
      delete groupedDataMap[fileName][fileName + '-' + expName]
      for (let i in parsedDataMap) {
        if(parsedDataMap[i][fileName + '-' + expName])
          delete parsedDataMap[i][fileName + '-' + expName]
      }
      if(groupedDataMap[fileName].length == 0){
        delete groupedDataMap[fileName]
      }
      this.showData()
    }

    experimentalDataOverlay.removeFile = function(fileName) {
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j]
        visibleDataMapByExp[fileName + '-' + expName]
        for (let i in parsedDataMap) {
          delete parsedDataMap[i][fileName + '-' + expName]
        }
      }
      delete  groupedDataMap[fileName]
      this.showData()
    }

    experimentalDataOverlay.hideExp = function(fileName, expName) {
      visibleDataMapByExp[fileName + '-' + expName] = false
      this.showData()
    }
  
    experimentalDataOverlay.hideFile = function(fileName) {
      for (let j = 0; j < groupedDataMap[fileName].length; j++){
        const expName = groupedDataMap[fileName][j]
        visibleDataMapByExp[fileName + '-' + expName] = false
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
      console.log('Inside NEW22 showGenomicData')
      cy.nodes().forEach(function(node) { 
        const nodeLabel = node.data('label')
        var imageURI = 'data:image/svg+xml;utf8,'
        //console.log(svgg)
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
      console.log("parse genomic data");
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
        experiments.push(metaLineColumns[i])
        // Update initially visible genomic data boxes !
        ///if (i - 1 < DEFAULT_VISIBLE_GENOMIC_DATA_COUNT) {
        visibleDataMapByExp[fileName + '-' + experiments[i - 1]] = true
        // } else {
        //   visibleDataMapByExp[experiments[i - 1]] = false
        // }

        if (groupedDataMap[fileName] === undefined) {
          groupedDataMap[fileName] = []
        }
        groupedDataMap[fileName].push(experiments[i - 1])
      }
      console.log("first for out");
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

/*
 * Common utilities for elements includes both general utilities and sbgn specific utilities
 */
var jQuery = $ = libs.jQuery;

module.exports = function () {
    var cy;
    var genomicdDataMap;
    var visibleGenomicDataMapByType;
    var groupedGenomicDataCount;
    var groupedGenomicDataMap;
  
    function experimentalDataOverlay (param) {
      // Init
      cy = param.sbgnCyInstance.getCy();
      genomicDataMap = {};
      visibleGenomicDataMapByType = {};
      groupedGenomicDataCount = 0;
      groupedGenomicDataMap = {};
    }

    experimentalDataOverlay.countVisibleGenomicDataByType = function() {
      // Count the genomic data that will be displayed on nodes' body
      let genomicDataBoxCount = 0
      for (let type in this.visibleGenomicDataMapByType) {
        if (this.visibleGenomicDataMapByType[type]) {
          genomicDataBoxCount++
        }
      }
      return genomicDataBoxCount
    }

    experimentalDataOverlay.getRequiredWidthForGenomicData = function (genomicDataBoxCount) {
      const term = genomicDataBoxCount > 3 ? genomicDataBoxCount - 3 : 0
      return 150 + term * 35
    }
    
    experimentalDataOverlay.generateSVGForNode = function (ele) {
      const genomicDataBoxCount = this.countVisibleGenomicDataByType()
  
      // Experimental data overlay part !
      const dataURI = 'data:image/svg+xml;utf8,'
      const svgNameSpace = 'http://www.w3.org/2000/svg'
      const nodeLabel = ele.data('name')
  
      // If there is no genomic data for this node return !
      if (!(nodeLabel in this.genomicDataMap)) {
        return dataURI
      }
  
      const eleBBox = ele.boundingBox()
      const reqWidth = this.getRequiredWidthForGenomicData(genomicDataBoxCount)
      const overlayRecBoxW = reqWidth - 10
      const overlayRecBoxH = 25
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
        x: reqWidth / 2 - overlayRecBoxW / 2,
        y: eleBBox.h / 2 + overlayRecBoxH / 2 - 18
      }
  
      const genomicFrequencyData = this.genomicDataMap[nodeLabel]
  
      let maxGenomicDataBoxCount = /*(genomicDataBoxCount > 3) ? 3:*/ genomicDataBoxCount
      let genomicBoxCounter = 0
  
      for (let i in this.groupedGenomicDataMap) {
        for (let j in this.groupedGenomicDataMap[i]) {
          const cancerType = this.groupedGenomicDataMap[i][j]
          if (!this.visibleGenomicDataMapByType[cancerType]) {
            continue
          }
  
          if (genomicFrequencyData[cancerType] !== undefined) {
            genomicDataRectangleGenerator(
              overLayRectBBox.x +
                (genomicBoxCounter * overLayRectBBox.w) / maxGenomicDataBoxCount,
              overLayRectBBox.y,
              overLayRectBBox.w / maxGenomicDataBoxCount,
              overLayRectBBox.h,
              genomicFrequencyData[cancerType],
              svg
            )
          } else {
            genomicDataRectangleGenerator(
              overLayRectBBox.x +
                (genomicBoxCounter * overLayRectBBox.w) / maxGenomicDataBoxCount,
              overLayRectBBox.y,
              overLayRectBBox.w / maxGenomicDataBoxCount,
              overLayRectBBox.h,
              null,
              svg
            )
          }
  
          genomicBoxCounter++
        }
      }
  
      function genomicDataRectangleGenerator(x, y, w, h, percent, parentSVG) {
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

    experimentalDataOverlay.showGenomicData = function() {
      const self = this
  
      const genomicDataBoxCount = this.countVisibleGenomicDataByType()
  
      // if (genomicDataBoxCount < 1) {
      //   // Hide all genomic data and return
      //   this.hideGenomicData()
      //   return
      // }
  
      console.log('Inside showGenomicData')
      console.log(this.cy)
  
      this.cy
        .style()
        .selector('node[type="GENE"]')
        // It used to change the width of nodes only locally
        .style('width', ele => {
          return this.getRequiredWidthForGenomicData(genomicDataBoxCount)
        })
        .style('text-margin-y', function(ele) {
          const nodeLabel = ele.data('name')
          // If there is no genomic data for this node return !
          if (!(nodeLabel in self.genomicDataMap)) {
            return 0
          }
  
          // Else shift label in Y axis
          return -15
        })
        .style('backgorund-fit', 'contain')
        .style('background-image', function(ele) {
          const x = encodeURIComponent(self.generateSVGForNode(ele).outerHTML)
          if (x === 'undefined') {
            return 'none'
          }
          const dataURI = 'data:image/svg+xml;utf8,' + x
          // console.log(dataURI)
          return dataURI
        })
        .update()
    }

    return experimentalDataOverlay;
  }
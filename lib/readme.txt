This file indicates the altered parts in used libraries and explains why they are changed.

 -Library name: jquery.fancybox-1.3.4.js

 Pleas see 'https://github.com/nvidoni/fancybox/issues/2

-Libary name: cytoscape-edgehandles.js
The code between line numbers 415 and 479 are commented out.
(starting from the line "for( var i = 0; i < targets.length; i++ ) {")

The reason of this change was disabling user with creating edges with multiple targets at a time.

Line number 581 is commented out.
(line is containing the following content "drawHandle( hx, hy, hr );")

The reason of this change was preventing that the red handle drawn on every hover on a node.

-Library name: cytoscape-noderesize.js
Changes are done inside moveHandler function defined as "function moveHandler(e)"

The reason of this changes was disabling user from changing the sizes of nodes with some special types arbitrarily.

clearDraws function globally named as clearDrawsOfNodeResize.

The reason of this change was to call "clearDraws" function when it is needed outside of the library.
In this case, it is needed to clear the handle on hide.

-Library name: cytoscape.js
In checkNode function inside findNearestElement
"if(
    pos.x - hw <= x && x <= pos.x + hw // bb check x
      &&
    pos.y - hh <= y && y <= pos.y + hh // bb check y
  ){"

is commented out.

In checkNode function inside findNearestElement, and BRp.findEdgeControlPoints shape.checkPoint and similar function calls are
replaced. An example replaced statement is "cytoscape.sbgn.isNodeShapeTotallyOverriden(self, node)?shape.checkPoint( x, y, node, 0 ):shape.checkPoint(x, y, 0, width, height, pos.x, pos.y)"

In BRp.findEdgeControlPoints portsource and porttarget are considered while swapping src and tgt.

In BRp.getNodeShape function
"if( node.isParent() ){
    if( shape === 'rectangle' || shape === 'roundrectangle' ){
      return shape;
    } else {
      return 'rectangle';
    }
  }" is commented out.

This is done not to restrict the shapes of the parent nodes.

IntersectLine function calls are conditinally replaced(If the shape of that node is totally
overriden).

An example call is here.
"if(cytoscape.sbgn.isNodeShapeTotallyOverriden(this, src))
        srcOutside = srcShape.intersectLine(src, tgtPos.x, tgtPos.y, edge._private.data.porttarget);
//        srcOutside = cytoscape.sbgn.intersetLineSelection(this, src, tgtPos.x, tgtPos.y, edge._private.data.portsource );
      else
        srcOutside = srcShape.intersectLine(
          srcPos.x,
          srcPos.y,
          srcW,
          srcH,
          tgtPos.x,
          tgtPos.y,
          0
        );"

In BRp.registerNodeShapes function 
"var nodeShapes = this.nodeShapes = {}" => "var nodeShapes = this.nodeShapes = window.cyNodeShapes"

Added "cytoscape.sbgn.registerSbgnNodeShapes();" statement to BRp.registerNodeShapes function.

Change in call of draw function of nodeshapes.
An example call is 
"if(cytoscape.sbgnShapes[this.getNodeShape(node)]){
            r.nodeShapes[this.getNodeShape(node)].draw(
                context,
                node);
        }
        else{
            r.nodeShapes[r.getNodeShape(node)].draw(
              context,
              nodeX, nodeY,
              nodeW, nodeH);
        }"

Before the definition of CRp.drawPolygonPath function,
"var CRp = {};" => "var CRp = window.cyRenderer;"

CRp.usePaths function returns false.

"var math = {};" => "var math = window.cyMath;"

"var styfn = {};" => "var styfn = window.cyStyfn;"

Add 'cytoscape.sbgn.registerSbgnArrowShapes();' to the end of 'registerArrowShapes' function

Replace 'var arrowShapes = this.arrowShapes = {};' at the beggining of 'registerArrowShapes' function with 'var arrowShapes = this.arrowShapes = window.cyArrowShapes;'

In 'BRp.findEndpoints' add  'var porttarget = edge._private.data.porttarget;'
                            'var portsource = edge._private.data.portsource;' inside variables.
append
if(!segments){
      var portP1 = cytoscape.sbgn.addPortReplacementIfAny(source, portsource);
      var portP2 = cytoscape.sbgn.addPortReplacementIfAny(target, porttarget);

      if(portP1.x != srcPos.x || portP1.y != srcPos.y){
        p1[0] = portP1.x;
        p1[1] = portP1.y;
      }

      if(portP2.x != tgtPos.x || portP2.y != tgtPos.y){
        p2[0] = portP2.x;
        p2[1] = portP2.y;
      }
    }
to the end of 'else if( lines )'

In 'CRp.drawEdgePath' add after 'if( canvasCxt.setLineDash )' ends

if (type === 'consumption' || type === 'production') {

    if (!pathCacheHit) {
      if (context.beginPath) {
        context.beginPath();
      }
      if (rs.edgeType != 'segments' && pts.length == 3 * 2) {
        cytoscape.sbgn.drawQuadraticLineCardinality(context, edge, pts, type);
      } else {
        cytoscape.sbgn.drawStraightLineCardinality(context, edge, pts, type);
      }
    }

    context = canvasCxt;
    context.stroke();
  }

change dx and dy while calculating vectorNorm as the following

"var dy = ( tgtPos.y - srcPos.y );
var dx = ( tgtPos.x - srcPos.x );"

consider state-infos, multimers, ports on bounding box calculation 
(refer to 'https://github.com/iVis-at-Bilkent/sbgnviz-js/commit/12d400fef6cec4784c33abc10f680b7efe4ca34b' and 
'https://github.com/iVis-at-Bilkent/sbgnviz-js/commit/9f63661e1597df4ecf8f3ea6bbb585ee3c91a301')
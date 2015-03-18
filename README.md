# SBGNViz.js: Cytoscape.js based visualization tool for process description diagrams in SBGN-ML

SBGNViz.js is a web application based on [http://cytoscape.github.io/cytoscape.js/ Cytoscape.js] to visualize the pathway models represented by [http://www.sbgn.org/Image:Refcard-PD.png SBGN Process Description Notation]. SBGNViz.js accepts the pathway models represented in [http://sourceforge.net/apps/mediawiki/libsbgn/index.php?title=Exchange_Format SBGN-ML] format.

SBGNViz.js is built by extending an open-source javascript graph theory library for analysis and visualisation, [http://cytoscape.github.io/cytoscape.js/ Cytoscape.js], to support the [http://www.sbgn.org/Image:Refcard-PD.png SBGN Process Description Notation]. 
<br/>

## Software

<font color="#B3A31D"><b>A sample application using SBGNViz.js can be found [http://www.cs.bilkent.edu.tr/~ivis/SBGNViz.js/ here].</b></font>

SBGNViz.js is distributed under [http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License]. Instructions for obtaining a working copy of the project can be found in [https://code.google.com/p/sbgnviz-js/wiki/Readme README] page. SBGNViz.js works on every platform that have javascript support including mobile devices.
<br/>

## Highlights

Below are some sample screenshots from SBGNViz.js, illustrating some of its capabilities. Please click on a figure to see it in full size. A User's Guide can be found [http://www.cs.bilkent.edu.tr/~ivis/sbgnviz-js/SBGNViz.js-1.0.UG.pdf here], documenting all features of the tool.

<table  border="1" width="800px" align="left">
	<tr>
		<td>
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/mapk-cascade.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/mapk-cascade-s.png"/>
			</a>
                        <p align="center"> <b> Mapk cascade pathway visualized in SBGNViz.js </b> </p>
		</td>

		<td>     	
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/highlight-processes.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/highlight-processes-s.png"/>
			</a>
                        <p align="center"> <b> Highlighting processes of selected node group </b> </p>
		</td>
	</tr>

	<tr>
		<td>
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/hide-selected.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/hide-selected-s.png"/>
			</a>
                        <p align="center"> <b> Hiding selected node group </b> </p>
		</td>

		<td>     	
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-hide-selected.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-hide-selected-s.png"/>
			</a>
                        <p align="center"> <b> Same graph after applying hiding on selected node group </b> </p>
		</td>
	</tr>

	<tr>
		<td>
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/show-selected.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/show-selected-s.png"/>
			</a>
                        <p align="center"> <b> Showing only selected node group </b> </p>
		</td>

		<td>     	
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-show-selected.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-show-selected-s.png"/>
			</a>
                        <p align="center"> <b> Same graph after showing only selected node group </b> </p>
		</td>
	</tr>

	<tr>
		<td>			
                       <a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/highlight-neighbors.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/highlight-neighbors-s.png"/>
			</a>
			<p align="center"><b> Highlighting neighbors of selected node group </b></p>		
		</td>

		<td>			
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/before-load.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/before-load-s.png"/>
			</a>
			<p align="center"><b> Load SBGN-PD diagram from an sbgn-ml file </b></p>	
		</td>

	</tr>

	<tr>
		<td>			
                      <a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/load.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/load-s.png"/>
		      </a>
                      <p align="center"> <b> Loading an sbgnml file from file explorer </b>  </p>
		</td>

		<td>
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-load.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/after-load-s.png"/>
			</a>
                        <p align="center"> <b> SBGN diagram visualization of Glycolysis after loading its sbgnml file </b>  </p>
		</td>
	</tr>

	<tr>
		<td>			
                       <a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/save.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/save-s.png"/>
			</a>
                        <p align="center"> <b> Saving current SBGN process description diagram as an sbgnml file </b>  </p>
		</td>

		<td>
			<a href="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/save-png.png">
				<img src="http://cs.bilkent.edu.tr/~ivis/sbgnviz-js/samples/save-png-s.png"/>
			</a>
                        <p align="center"> <b> Saving current SBGN process description diagram as a png file  </b>  </p>
		</td>
	</tr>

</table>

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

## Team

  * Mecit Sari, Ugur Dogrusoz, Istemi Bahceci, [http://www.cs.bilkent.edu.tr/~ivis i-Vis at Bilkent University]
  * S. Onur Sumer, B. Arman Aksoy, Ozgun Babur, Emek Demir [http://cbio.mskcc.org cbio at MSKCC]

var easyCreationActionFunctions = {
  createTemplateReaction: function (param) {
    var firstTime = param.firstTime;
    var eles;

    if (firstTime) {
      var defaultMacromoleculProperties = addRemoveUtilities.defaultsMap["macromolecule"];
      var templateType = param.templateType;
      var processWidth = addRemoveUtilities.defaultsMap[templateType] ? addRemoveUtilities.defaultsMap[templateType].width : 50;
      var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
      var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
      var processPosition = param.processPosition;
      var macromoleculeList = param.macromoleculeList;
      var complexName = param.complexName;
      var numOfMacromolecules = macromoleculeList.length;
      var tilingPaddingVertical = param.tilingPaddingVertical ? param.tilingPaddingVertical : 15;
      var tilingPaddingHorizontal = param.tilingPaddingHorizontal ? param.tilingPaddingHorizontal : 15;
      var edgeLength = param.edgeLength ? param.edgeLength : 60;

      var xPositionOfFreeMacromolecules;
      if (templateType === 'association') {
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      }
      else {
        xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      }

      //Create the process in template type
      var process = addRemoveUtilities.addNode(processPosition.x, processPosition.y, templateType);
      process.data('justAdded', true);

      //Define the starting y position
      var yPosition = processPosition.y - ((numOfMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      //Create the free macromolecules
      for (var i = 0; i < numOfMacromolecules; i++) {
        var newNode = addRemoveUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
        newNode.data('justAdded', true);
        newNode.data('sbgnlabel', macromoleculeList[i]);

        //create the edge connected to the new macromolecule
        var newEdge;
        if (templateType === 'association') {
          newEdge = addRemoveUtilities.addEdge(newNode.id(), process.id(), 'consumption');
        }
        else {
          newEdge = addRemoveUtilities.addEdge(process.id(), newNode.id(), 'production');
        }

        newEdge.data('justAdded', true);

        //update the y position
        yPosition += macromoleculeHeight + tilingPaddingVertical;
      }

      //Create the complex including macromolecules inside of it
      //Temprorarily add it to the process position we will move it according to the last size of it
      var complex = addRemoveUtilities.addNode(processPosition.x, processPosition.y, 'complex');
      complex.data('justAdded', true);
      complex.data('justAddedLayoutNode', true);

      //If a name is specified for the complex set its label accordingly
      if (complexName) {
        complex.data('sbgnlabel', complexName);
      }

      //create the edge connnected to the complex
      var edgeOfComplex;
      if (templateType === 'association') {
        edgeOfComplex = addRemoveUtilities.addEdge(process.id(), complex.id(), 'production');
      }
      else {
        edgeOfComplex = addRemoveUtilities.addEdge(complex.id(), process.id(), 'consumption');
      }
      edgeOfComplex.data('justAdded', true);

      //Create the macromolecules inside the complex
      for (var i = 0; i < numOfMacromolecules; i++) {
        var newNode = addRemoveUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
        newNode.data('justAdded', true);
        newNode.data('sbgnlabel', macromoleculeList[i]);
        newNode.data('justAddedLayoutNode', true);
      }

      var layoutNodes = cy.nodes('[justAddedLayoutNode]');
      layoutNodes.removeData('justAddedLayoutNode');
      layoutNodes.layout({
        name: 'cose-bilkent',
        randomize: false,
        fit: false,
        animate: false,
        tilingPaddingVertical: tilingPaddingVertical,
        tilingPaddingHorizontal: tilingPaddingHorizontal,
        stop: function () {
          //re-position the nodes inside the complex
          var supposedXPosition;
          var supposedYPosition = processPosition.y;

          if (templateType === 'association') {
            supposedXPosition = processPosition.x + edgeLength + processWidth / 2 + complex.outerWidth() / 2;
          }
          else {
            supposedXPosition = processPosition.x - edgeLength - processWidth / 2 - complex.outerWidth() / 2;
          }

          var positionDiffX = supposedXPosition - complex.position('x');
          var positionDiffY = supposedYPosition - complex.position('y');
          sbgnElementUtilities.moveNodes({x: positionDiffX, y: positionDiffY}, complex);
        }
      });

      //filter the just added elememts to return them and remove just added mark
      eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');
    }
    else {
      eles = param;
      cy.add(eles);
    }

    refreshPaddings();
    cy.elements().unselect();
    eles.select();

    return eles;
  }
};
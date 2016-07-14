var inspectorUtilities = {};
inspectorUtilities.relocateStateAndInfos = function (stateAndInfos) {
  var length = stateAndInfos.length;
  if (length == 0) {
    return;
  }
  else if (length == 1) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;
  }
  else if (length == 2) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 0;
    stateAndInfos[1].bbox.y = 50;
  }
  else if (length == 3) {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = 0;
    stateAndInfos[2].bbox.y = 50;
  }
  else {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = -25;
    stateAndInfos[2].bbox.y = 50;

    stateAndInfos[3].bbox.x = 25;
    stateAndInfos[3].bbox.y = 50;
  }
};

inspectorUtilities.fillInspectorStateAndInfos = function (nodes, stateAndInfos, width) {
  //first empty the state variables and infos data in inspector
  $("#inspector-state-variables").html("");
  $("#inspector-unit-of-informations").html("");
  
  for (var i = 0; i < stateAndInfos.length; i++) {
    var state = stateAndInfos[i];
    if (state.clazz == "state variable") {
      $("#inspector-state-variables").append("<div><input type='text' class='just-added-inspector-input inspector-state-variable-value inspector-input-box' style='width: "
              + width / 5 + "px;' value='" + stringAfterValueCheck(state.state.value) + "'/>"
              + "<span width='" + width / 5 + "'px>@</span>"
              + "<input type='text' class='just-added-inspector-input inspector-state-variable-variable inspector-input-box' style='width: "
              + width / 2.5 + "px;' value='" + stringAfterValueCheck(state.state.variable)
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info inspector-input-box' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-state-variable-value").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          valueOrVariable: $(this).attr('value'),
          type: 'value',
          nodes: nodes,
          stateAndInfos: stateAndInfos,
          width: width
        };
        
        cy.undoRedo().do("changeStateVariable", param);
      });

      $(".inspector-state-variable-variable").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          valueOrVariable: $(this).attr('value'),
          type: 'variable',
          nodes: nodes,
          stateAndInfos: stateAndInfos,
          width: width
        };
        
        cy.undoRedo().do("changeStateVariable", param);
      });
    }
    else if (state.clazz == "unit of information") {
      var total = width / 1.25;
      $("#inspector-unit-of-informations").append("<div><input type='text' class='just-added-inspector-input inspector-unit-of-information-label inspector-input-box' style='width: "
              + total + "px;' value='" + stringAfterValueCheck(state.label.text)
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-unit-of-information-label").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          text: $(this).attr('value'),
          stateAndInfos: stateAndInfos,
          nodes: nodes,
          width: width
        };
        
        cy.undoRedo().do("changeUnitOfInformation", param);
      });
    }

    $(".inspector-delete-state-and-info").unbind('click').click(function (event) {
      var param = {
        obj: $(this).data("state"),
        nodes: nodes,
        stateAndInfos: stateAndInfos,
        width: width
      };
      
      cy.undoRedo().do("removeStateAndInfo", param);
    });

    $(".just-added-inspector-input").data("state", state);
    $(".just-added-inspector-input").removeClass("just-added-inspector-input");
  }
  $("#inspector-state-variables").append("<img id='inspector-add-state-variable' src='sampleapp-images/add.png'/>");
  $("#inspector-unit-of-informations").append("<img id='inspector-add-unit-of-information' src='sampleapp-images/add.png'/>");

  $("#inspector-add-state-variable").click(function () {
    var obj = {};
    obj.clazz = "state variable";

    obj.state = {
      value: "",
      variable: ""
    };
    obj.bbox = {
      w: 69,
      h: 28
    };
    var param = {
      obj: obj,
      nodes: nodes,
      stateAndInfos: stateAndInfos,
      width: width
    };
    
    cy.undoRedo().do("addStateAndInfo", param);
  });

  $("#inspector-add-unit-of-information").click(function () {
    var obj = {};
    obj.clazz = "unit of information";
    obj.label = {
      text: ""
    };
    obj.bbox = {
      w: 53,
      h: 18
    };
    var param = {
      obj: obj,
      nodes: nodes,
      width: width,
      stateAndInfos: stateAndInfos
    };
    
    cy.undoRedo().do("addStateAndInfo", param);
  });
}

inspectorUtilities.handleSBGNInspector = function () {
  var selectedEles = cy.elements(":selected");
  
  if(selectedEles.length == 0){
    $("#sbgn-inspector").html("");
    return;
  }
  
  var width = $("#sbgn-inspector").width() * 0.45;
  
  var allNodes = allAreNode(selectedEles);
  var allEdges = allAreEdge(selectedEles);
  
  if (allNodes || allEdges) {
    var sbgnlabel = getCommonLabel(selectedEles);
    if (sbgnlabel == null) {
      sbgnlabel = "";
    }

    var classInfo = getCommonSBGNClass(selectedEles);
    if (classInfo == 'and' || classInfo == 'or' || classInfo == 'not') {
      classInfo = classInfo.toUpperCase();
    }
    else {
      classInfo = classInfo.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      classInfo = classInfo.replace(' Of ', ' of ');
      classInfo = classInfo.replace(' And ', ' and ');
      classInfo = classInfo.replace(' Or ', ' or ');
      classInfo = classInfo.replace(' Not ', ' not ');
    }

    var title = classInfo=="" ? "Properties":classInfo + " Properties";

    var buttonwidth = width;
    if (buttonwidth > 50) {
      buttonwidth = 50;
    }

    var html = "<div style='text-align: center; color: black; font-weight: bold; margin-bottom: 5px;'>" + title + "</div><table cellpadding='0' cellspacing='0'>";
    var type;
    var fillStateAndInfos;
    var multimerCheck;
    var clonedCheck;
    var commonIsMultimer;
    var commonIsCloned;
    var commonStateAndInfos;
    var commonSBGNCardinality;
    
    if (allNodes) {
      type = "node";
      
      var borderColor = getCommonBorderColor(selectedEles);
      borderColor = borderColor?borderColor:'#FFFFFF';
      
      var backgroundColor = getCommonFillColor(selectedEles);
      backgroundColor = backgroundColor?backgroundColor:'#FFFFFF';
      
      var borderWidth = getCommonBorderWidth(selectedEles);
      
      var backgroundOpacity = getCommonBackgroundOpacity(selectedEles);
      backgroundOpacity = backgroundOpacity?backgroundOpacity:0.5;
      
      var nodeWidth = getCommonNodeWidth(selectedEles);

      var nodeHeight = getCommonNodeHeight(selectedEles);
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Label</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-label' class='inspector-input-box' type='text' style='width: " + width / 1.25 + "px;' value='" + sbgnlabel
              + "'/>" + "</td></tr>";
      
      if( includesNotCollapsedNorParentElement(selectedEles) ) {
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Width</font>" + "</td><td style='padding-left: 5px;'>"
                + "<input id='inspector-node-width' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";

        if (nodeWidth) {
          html += " value='" + nodeWidth + "'";
        }

        html += "/>" + "</td></tr>";

        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Height</font>" + "</td><td style='padding-left: 5px;'>"
                + "<input id='inspector-node-height' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";

        if (nodeHeight) {
          html += " value='" + nodeHeight + "'";
        }

        html += "/>";
        
        if( someMustNotBeSquare(selectedEles) ) {
          var imageName;
          var title;
          if(window.inspectorNodeSizeUseAspectRatio) {
            imageName = "lock.png";
            title = "lock aspect ratio";
          }
          else {
            imageName = "open-lock.png";
            title = "unlock aspect ratio";
          }
          
          html += "<img id='inspector-node-sizes-aspect-ratio' width='12px' height='12px' src='sampleapp-images/";
          html += imageName;
          html += "'";
          
          html += "title='";
          html += title;
          html += "'";
          
          html += "></img>";
        }
        
        html += "</td></tr>";
      }
      
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Border Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-border-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + borderColor
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-fill-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + backgroundColor
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Border Width</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-border-width' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";
      
      if(borderWidth){
        html += " value='" + parseFloat(borderWidth) + "'";
      }
      
      html += "/>" + "</td></tr>";
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Opacity</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-background-opacity' class='inspector-input-box' type='range' step='0.01' min='0' max='1' style='width: " + buttonwidth + "px;' value='" + parseFloat(backgroundOpacity)
              + "'/>" + "</td></tr>"; 
      
      commonStateAndInfos = getCommonStateAndInfos(selectedEles);
      
      if(commonStateAndInfos){
        if (allCanHaveStateVariable(selectedEles)) {
          fillStateAndInfos = true;
          
          html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
          html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>State Variables</font>" + "</td>"
                  + "<td id='inspector-state-variables' style='padding-left: 5px; width: '" + width + "'></td></tr>";
        }

        if (allCanHaveUnitOfInformation(selectedEles)) {
          fillStateAndInfos = true;
          
          html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
          html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Units of Information</font>" + "</td>"
                  + "<td id='inspector-unit-of-informations' style='padding-left: 5px; width: '" + width + "'></td></tr>";
        }
      }
      
      commonIsMultimer = getCommonIsMultimer(selectedEles);
      commonIsCloned = getCommonIsCloned(selectedEles);
//      multimerCheck = ( commonIsMultimer !== null ) && allCanBeMultimer(selectedEles);
//      clonedCheck = ( commonIsCloned !== null ) && allCanBeCloned(selectedEles);
      multimerCheck = allCanBeMultimer(selectedEles);
      clonedCheck = allCanBeCloned(selectedEles);
      
      multimerCheck = multimerCheck?multimerCheck:false;
      clonedCheck = clonedCheck?clonedCheck:false;

      if (multimerCheck || clonedCheck) {
        html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
      }

      if (multimerCheck) {
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Multimer</font>" + "</td>"
                + "<td style='padding-left: 5px; width: '" + width + "'><input type='checkbox' id='inspector-is-multimer'></td></tr>";
      }

      if (clonedCheck) {
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Cloned</font>" + "</td>"
                + "<td style='padding-left: 5px; width: '" + width + "'><input type='checkbox' id='inspector-is-clone-marker'></td></tr>";
      }
    }
    else {
      type = "edge";
      
      var commonLineColor = getCommonLineColor(selectedEles);
      commonLineColor = commonLineColor?commonLineColor:'#FFFFFF';
      
      var commonLineWidth = getCommonLineWidth(selectedEles);
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-line-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + commonLineColor
              + "'/>" + "</td></tr>";

      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Width</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-width' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";
      
      if(commonLineWidth){
        html += " value='" + parseFloat(commonLineWidth) + "'";
      }
      
      html += "/>" + "</td></tr>";
      
      if (allCanHaveSBGNCardinality(selectedEles)) {
        var cardinality = getCommonSBGNCardinality(selectedEles);
        commonSBGNCardinality = cardinality;
        
        if (cardinality <= 0) {
          cardinality = undefined;
        }
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Cardinality</font>" + "</td><td style='padding-left: 5px;'>"
                + "<input id='inspector-cardinality' class='inspector-input-box' type='number' min='0' step='1' style='width: " + buttonwidth + "px;' value='" + cardinality
                + "'/>" + "</td></tr>";
      }

    }
    html += "</table>";
    
    if(selectedEles.length == 1){
      html += "<div style='text-align: center; margin-top: 5px;'><button style='align: center;' id='inspector-set-as-default-button'"
            + ">Set as Default</button></div>";
    }
    
    html += "<hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'>";
//    html += "<button type='button' style='display: block; margin: 0 auto;' class='btn btn-default' id='inspector-apply-button'>Apply Changes</button>";
    $("#sbgn-inspector").html(html);

    if (type == "node") {
      if (fillStateAndInfos) {
        this.fillInspectorStateAndInfos(selectedEles, commonStateAndInfos, width);
      }

      if (multimerCheck && commonIsMultimer) {
        $('#inspector-is-multimer').attr('checked', true);
      }

      if (clonedCheck && commonIsCloned) {
        $('#inspector-is-clone-marker').attr('checked', true);
      }

      $('#inspector-set-as-default-button').on('click', function () {
        var multimer;
        var selected = selectedEles[0];
        var sbgnclass = selected.data('sbgnclass');
        if (sbgnclass.endsWith(' multimer')) {
          sbgnclass = sbgnclass.replace(' multimer', '');
          multimer = true;
        }
        if (addRemoveUtilities.defaultsMap[sbgnclass] == null) {
          addRemoveUtilities.defaultsMap[sbgnclass] = {};
        }
        var defaults = addRemoveUtilities.defaultsMap[sbgnclass];
        defaults.width = selected.width();
        defaults.height = selected.height();
        defaults.sbgnclonemarker = selected._private.data.sbgnclonemarker;
        defaults.multimer = multimer;
        defaults['border-width'] = selected.css('border-width');
        defaults['border-color'] = selected.data('borderColor');
        defaults['background-color'] = selected.css('background-color');
        defaults['font-size'] = selected.css('font-size');
        defaults['background-opacity'] = selected.css('background-opacity');
      });

      $("#inspector-node-width, #inspector-node-height").bind('change').on('change', function () {
        var w = parseFloat($("#inspector-node-width").attr("value"));
        var h = parseFloat($("#inspector-node-height").attr("value"));
        
        if( $(this).attr('id') === 'inspector-node-width' ) {
          h = undefined;
        }
        else {
          w = undefined;
        }
        
        var useAspectRatio = window.inspectorNodeSizeUseAspectRatio;

        var param = {
          nodes: selectedEles,
          width: w,
          height: h,
          useAspectRatio: useAspectRatio,
          performOperation: true
        };
        
        cy.undoRedo().do("resizeNode", param);
      });

      $('#inspector-node-sizes-aspect-ratio').on('click', function() {
        if(window.inspectorNodeSizeUseAspectRatio == null) {
          window.inspectorNodeSizeUseAspectRatio = false;
        }
        
        window.inspectorNodeSizeUseAspectRatio = !window.inspectorNodeSizeUseAspectRatio;
        
        // refresh image
        if (window.inspectorNodeSizeUseAspectRatio) {
          imageName = "lock.png";
          title = "lock aspect ratio";
        }
        else {
          imageName = "open-lock.png";
          title = "unlock aspect ratio";
        }
        
        $(this).attr('src', 'sampleapp-images/' + imageName);
        $(this).attr('title', title);
      });

      $('#inspector-is-multimer').on('click', function () {
        var param = {
          makeMultimer: $('#inspector-is-multimer').attr('checked') == 'checked',
          nodes: selectedEles,
          firstTime: true
        };
        
        cy.undoRedo().do("changeIsMultimerStatus", param);
      });

      $('#inspector-is-clone-marker').on('click', function () {
        var param = {
          makeCloneMarker: $('#inspector-is-clone-marker').attr('checked') == 'checked',
          nodes: selectedEles,
          firstTime: true
        };
        
        cy.undoRedo().do("changeIsCloneMarkerStatus", param);
      });

      $("#inspector-border-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-border-color").attr("value"),
          dataType: "borderColor",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleData", param);
      });

      $("#inspector-label").on('change', function () {
        var param = {
          nodes: selectedEles,
          sbgnlabel: $(this).attr('value'),
          firstTime: true
        };
        
        cy.undoRedo().do("changeNodeLabel", param);
      });

      $("#inspector-background-opacity").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-background-opacity").attr("value"),
          dataType: "backgroundOpacity",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleData", param);
      });

      $("#inspector-fill-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-fill-color").attr("value"),
          dataType: "background-color",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleCss", param);
      });

      $("#inspector-border-width").bind('change').on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-border-width").attr("value"),
          dataType: "border-width",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleCss", param);
      });
    }
    else {
      $('#inspector-set-as-default-button').on('click', function () {
        if (addRemoveUtilities.defaultsMap[selected.data('sbgnclass')] == null) {
          addRemoveUtilities.defaultsMap[selected.data('sbgnclass')] = {};
        }
        var defaults = addRemoveUtilities.defaultsMap[selected.data('sbgnclass')];
        defaults['line-color'] = selected.data('lineColor');
        defaults['width'] = selected.css('width');
      });

      $("#inspector-line-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-line-color").attr("value"),
          dataType: "lineColor",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleData", param);
      });

      $("#inspector-cardinality").bind('change').on('change', function () {
        var data = Math.round($("#inspector-cardinality").attr("value"));

        if (data < 0) {
          if (commonSBGNCardinality == 0) {
            inspectorUtilities.handleSBGNInspector();
            return;
          }
          data = 0;
        }
        var param = {
          eles: selectedEles,
          data: data,
          dataType: "sbgncardinality",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleData", param);
      });

      $("#inspector-width").bind('change').on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-width").attr("value"),
          dataType: "width",
          firstTime: true
        };
        
        cy.undoRedo().do("changeStyleCss", param);
      });
    }
  }
  else {
    $("#sbgn-inspector").html("");
  }
}
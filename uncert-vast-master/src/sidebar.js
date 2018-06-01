// Upload File
$('#OpenFileUpload').click(function() {
  $('#fileupload').trigger('click');
});


$('#classifyButton').click(function() {
  $("#classifyDialog").dialog();
});

//************ uncertainty for 400m buffer *******************************
function bufferUncert() {
  ///**************** Add node in tree *****
  var newNodeData = {
    "name": "400m Buffer",
    "r": 10,
    "clicked": 0,
    "type": "normal",
    "children": []
  };
  // create newNode with d3.hierarchy
  var newNode = d3.hierarchy(newNodeData);
  newNode.depth = selectedTreeNode.depth + 1;
  newNode.height = selectedTreeNode.height - 1;
  newNode.parent = selectedTreeNode;

  // push new node in selected tree node's children
  // if no child array, create an empty array
  if (!selectedTreeNode.children) {
    selectedTreeNode.children = [];
    selectedTreeNode.data.children = [];
  }
  selectedTreeNode.children.push(newNode);
  selectedTreeNode.data.children.push(newNode.data);

  // Update tree
  updateTree(selectedTreeNode);

  //***************** test code end ****************//

  //*************** Update donut chart
  var data = JSON.parse(JSON.stringify(myData));

  //Update donut charts
  variables_uncert.forEach(function(key) {
    data.map((d) => {
      d[key] = +d[key] + +d.uncertainty
    })
  })

  var donutData = [];
  variables_uncert.forEach(function(key) {
    var maxV = findMax(data, key)
    var name = key.split("_")[0]
    // debugger;
    donutData.push({
      data: [{
          cat: "randomness",
          val: +maxV[key] - +maxV.uncertainty
        },
        {
          cat: "fuzzyness",
          val: +maxV.uncertainty
        }
      ],
      type: name,
      detailed: name,
      total: +maxV[key],
      clicked: 0
    })
  })
  // donutData_G = donutData;
  historyDonutData.push(donutData);
  window.UV.views.donuts.update(donutData);
  donutData_G = donutData;

  historyData.push(data);
  myMapData = data;
  historyOperation.push("400m buffer")
  window.UV.views.mtxdata.addOperation(historyOperation, historyData)
  window.UV.views.matrix.update(matrixData, "Pop_uncert");
}

//************ uncertainty for classification *******************************
function classifyButton() {
  //********* Adding node to the tree ********
  var newNodeData = {
    "name": "classification",
    "r": 13,
    "clicked": 0,
    "type": "normal",
    "children": []
  };
  // create newNode with d3.hierarchy
  var newNode = d3.hierarchy(newNodeData);
  newNode.depth = selectedTreeNode.depth + 1;
  newNode.height = selectedTreeNode.height - 1;
  newNode.parent = selectedTreeNode;

  // push new node in selected tree node's children
  // if no child array, create an empty array
  if (!selectedTreeNode.children) {
    selectedTreeNode.children = [];
    selectedTreeNode.data.children = [];
  }
  selectedTreeNode.children.push(newNode);
  selectedTreeNode.data.children.push(newNode.data);

  // Update tree
  updateTree(selectedTreeNode);

  //************ End adding node to the tree *********

  //*** dropdown button for classes filtering ****
  $('#dropdown-class')
    .dropdown({
      placeholder: 'CLASSES',
      values: [{
          name: "NONE",
          value: ""
        },
        {
          name: "Adequately Served",
          value: "Adequately served"
        },
        {
          name: "Moderately Served",
          value: "Moderately served"
        },
        {
          name: "Under Served",
          value: "Underserved"
        }
      ],
      onChange: function(value, text, $selectedItem) {
        // filterByClass(value)
        updateParameter();
      }
    });
  //***** end dropdown class filtering ***
} // end classification uncertainty calculation

//************ uncertainty for brushing and filtering *******************************
function brushingFiltering() {

  //*********** Adding node to the tree ************
  var newNodeData;
  if ($('#dropdown-class').dropdown("get value")) {
    newNodeData = {
      "name": "Filtering",
      "r": 13,
      "clicked": 0,
      "type": "normal",
      "children": []
    };
  } else {
    newNodeData = {
      "name": "Brushing",
      "r": 13,
      "clicked": 0,
      "type": "normal",
      "children": []
    };
  }
  // create newNode with d3.hierarchy
  var newNode = d3.hierarchy(newNodeData);
  newNode.depth = selectedTreeNode.depth + 1;
  newNode.height = selectedTreeNode.height - 1;
  newNode.parent = selectedTreeNode;

  // push new node in selected tree node's children
  // if no child array, create an empty array
  if (!selectedTreeNode.children) {
    selectedTreeNode.children = [];
    selectedTreeNode.data.children = [];
  }
  selectedTreeNode.children.push(newNode);
  selectedTreeNode.data.children.push(newNode.data);

  // Update tree
  updateTree(selectedTreeNode);
  //********** End adding node to the tree **********
}

//************ uncertainty for models *******************************
function modelUncertainty() {
  numModel++;
  //*********** Adding node to the tree ************
  var newNodeData = {
    "name": "Model" + numModel,
    "r": 13,
    "clicked": 0,
    "mean": 2 + numModel,
    "max": 5 + numModel,
    "min": 8 + numModel,
    "type": "model",
    "children": []
  };
  // create newNode with d3.hierarchy
  var newNode = d3.hierarchy(newNodeData);
  newNode.depth = selectedTreeNode.depth + 1;
  newNode.height = selectedTreeNode.height - 1;
  newNode.parent = selectedTreeNode;

  // push new node in selected tree node's children
  // if no child array, create an empty array
  if (!selectedTreeNode.children) {
    selectedTreeNode.children = [];
    selectedTreeNode.data.children = [];
  }
  selectedTreeNode.children.push(newNode);
  selectedTreeNode.data.children.push(newNode.data);

  // Update tree
  updateTree(selectedTreeNode);
  //********** End adding node to the tree **********
}

function viewBuffer() {
  var bufferSize = $("#buffer").dropdown('get value');
  // console.log("bufferSize", bufferSize)

  if (eyebuttonClick && bufferSize == 400 && myData) {
    $(eyebutton).html("<i class=\"eye slash icon\"></i>")

    var data = myData;
    var markers = [];
    for (var i = 0; i < data.length; i++) {
      //var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
      var lat = data[i].lat;
      var lon = data[i].lon;
      // mapCircle(lat, lon, radii);
      var marker = new L.circle([lat, lon], +bufferSize, {
        color: 'blue',
        weight: 1
      })
      // .addTo(map);
      markers.push(marker)
    }
    markerlayer = L.layerGroup(markers);
    map.addLayer(markerlayer);
    eyebuttonClick = 0;
  } else if (bufferSize == 400 && myData) {
    $(eyebutton).html("<i class=\"eye icon\"></i>");
    map.removeLayer(markerlayer);
    eyebuttonClick = 1;
  }
}

function sortDown() {
  if (donutData_G) {
    var donutData = donutData_G;
    donutData.sort((a, b) => b.total - a.total);
    // console.log(donutData)
    window.UV.views.donuts.update(donutData);
  }
}

function sortUp() {
  if (donutData_G) {
    var donutData = donutData_G;
    donutData.sort((a, b) => a.total - b.total);
    // console.log(donutData)
    window.UV.views.donuts.update(donutData);
  }
}

///
////////////////////////// set uncertainty slider value ////////
///
var uncertSlider = document.getElementById('slider-uncert');
var uncertSliderValueElement = document.getElementById('slider-uncert-value');
variableName.push("uncertainty")
minAll.push(0)
maxAll.push(0)

// uncertainty slider
noUiSlider.create(uncertSlider, {
  start: [0.0],
  connect: [false, true],
  // step: 1000,
  range: {
    'min': [-2.0],
    'max': [5.0]
  }
});

function setUncertSlider(data, varType) {

  varType = varType.map((d) => d + "_uncert")
  // debugger;
  data.forEach(function(d) {
    d.uncertainty = 0;
    varType.forEach(function(v) {
      d.uncertainty = d.uncertainty + +d[v]
    })
  })

  var min = findMin(data, "uncertainty")["uncertainty"];
  var max = findMax(data, "uncertainty")["uncertainty"];
  //console.log("min", min, "max", max);
  if (max == min) {
    max = max + 1;
  }
  uncertSlider.noUiSlider.updateOptions({
    start: [0.0],
    range: {
      'min': [-2.0],
      'max': Math.ceil(max)
    }
  });
}

uncertSlider.noUiSlider.on('update', function(values, handle) {
  $("#slider-uncert-value").val(values[handle]);


  if (myMapData && g_var.length) {
    minAll[0] = values[handle];
    updateParameter();
  } else {
    if (markerlayer) {
      map.removeLayer(markerlayer)
    }
  }

});

uncertSliderValueElement.addEventListener('change', function() {
  uncertSlider.noUiSlider.set(this.value);
});

///
//////////////////// set variable slider value ////////
///
var slider = [];
var sliderValueElements = [];

slider.push(document.getElementById('slider-var1'));
sliderValueElements.push([
  document.getElementById('slider-var-left1'),
  document.getElementById('slider-var-right1')
])
variableName.push("NONE")
minAll.push(0);
maxAll.push(0);

// setup slider
noUiSlider.create(slider[0], {
  start: [1000, 5000],
  connect: [false, true, false],
  // step: 1000,
  range: {
    'min': [100],
    'max': [10000]
  }
});


slider[0].noUiSlider.on('update', function(values, handle) {
  sliderValueElements[0][handle].value = values[handle];

  if (myMapData) {
    minAll[1] = values[0];
    maxAll[1] = values[1];
    updateParameter();
  }
});

sliderValueElements[0][0].addEventListener('change', function() {
  slider[0].noUiSlider.set(this.value);
});

var numVarSliders = 1;

// add html in "var-sliders" div node
function addVarSlider() {
  numVarSliders++;
  var index = numVarSliders;
  var divSlider = document.createElement('div');
  divSlider.id = "var-slider" + index;

  var node = document.getElementById("var-sliders");
  node.appendChild(divSlider);
  // use template literal (i.e., ``) for writing html as it is
  divSlider.innerHTML =
    `<div class="ui middle alligned grid">
    <div class="sixteen wide column">
      <div class="ui selection dropdown" id="dropdown-var` + index + `">
        <div class="text">Variables</div>
        <i class="dropdown icon"></i>
        <div class="menu">
          <div class="item" data-value="0">NONE</div>
        </div>
      </div>
    </div>
    <div class="seven wide column">
      <div class="slider" id="slider-var` + index + `"></div>
    </div>
    <div class="nine wide column">
        <!-- <div id="slider-step-value"></div> -->
      <div class="ui small labeled input">
        <div class="ui label">
          Value:
        </div>
        <input style="width:30%" placeholder="value" type="text" id="slider-var-left` + index + `">
        <input class="ui disabled input" style="width:30%" placeholder="value" type="text" id="slider-var-right` + index + `">
      </div>
    </div>
  </div>`;

  $('#dropdown-var' + index)
    .dropdown({
      placeholder: 'NONE',
      values: dropdown_names,
      onChange: function(value, text, $selectedItem) {
        if (text !== undefined) {
          setVarSlider(index, myMapData, text)
        }

      }
    });

  // prepare slider
  slider.push(document.getElementById('slider-var' + index));
  sliderValueElements.push([
    document.getElementById('slider-var-left' + index),
    document.getElementById('slider-var-right' + index)
  ])
  variableName.push("NONE")
  minAll.push(0);
  maxAll.push(0);

  // setup slider
  noUiSlider.create(slider[index - 1], {
    start: [1000, 5000],
    connect: [false, true, false],
    // step: 1000,
    range: {
      'min': [100],
      'max': [10000]
    }
  });


  slider[index - 1].noUiSlider.on('update', function(values, handle) {
    sliderValueElements[index - 1][handle].value = values[handle];
    if (myMapData) {
      minAll[index] = values[0];
      maxAll[index] = values[1];
      updateParameter();
    }
    // stepSliderValueElement.innerHTML = values[handle]
  });
  sliderValueElements[index - 1][0].addEventListener('change', function() {
    slider[index - 1].noUiSlider.set(this.value);
  });
}

function removeVarSlider() {
  var node = document.getElementById("var-slider" + numVarSliders);
  node.remove();
  numVarSliders--;
  var index = numVarSliders;
  // slider[index].noUiSlider.destroy()
  slider.pop();
  sliderValueElements.pop();
  minAll.pop();
  maxAll.pop();
  variableName.pop();

  updateParameter()
}

function setVarSlider(index, data, varType) {

  variableName[index] = varType;
  var min = findMin(data, varType)[varType];
  var max = findMax(data, varType)[varType];
  // console.log("min", min, "max", max);
  if (max == min) {
    max = max + 1;
  }
  slider[index - 1].noUiSlider.updateOptions({
    start: [min - 0.1, max],
    range: {
      'min': Math.floor(min) - 0.1,
      'max': Math.ceil(max)
    }
  });
}

function updateParameter() {
  if (g_var.length) {
    var var_name = g_var.map((d) => d + "_uncert")
  }

  myMapData.forEach(function(element) {
    var visible = true;
    var uncertainty = 0;


    for (var i = 1; i < variableName.length; i++) {
      if (+element[variableName[i]] > +maxAll[i] || +element[variableName[i]] < +minAll[i]) {
        visible = false;
      }
    }

    if (g_var.length) {
      var_name.forEach(function(r) {
        uncertainty = uncertainty + +element[r]
      })
      if (uncertainty < +minAll[0] - 0.01) {
        visible = false;
      }
    }

    if ($('#dropdown-class').dropdown("get value")) {
      if (element[classVar] !== $('#dropdown-class').dropdown("get value")) {
        console.log("here")
        visible = false;
      }
    }

    element.visible = visible;
  });


  if (markerPointsLayer) {
    map.removeLayer(markerPointsLayer)
  }
  if (markerlayer) {
    map.removeLayer(markerlayer)
  }

  // add mappoints
  var heat;
  var markers = [];
  var circles = [];
  myMapData.forEach(function(element, i) {
    if (element.visible) {
      markers.push(mapPoint(element.lat, element.lon, i))
      if (g_var) {
        circles.push(mapCircleIndiv(element, g_var))
      }
    }
  });

  heat = L.heatLayer(circles, {
    radius: 20,
    blur: 15,
    maxZoom: 17
    // myCustomId: i
  });

  // debugger;
  if (circles.length) {
    markerlayer = heat; //L.layerGroup(circles);
    map.addLayer(markerlayer);
  }
  if (markers.length) {
    markerPointsLayer = L.layerGroup(markers);
    map.addLayer(markerPointsLayer);
  }
}

function selectAll() {
  selectIndexes = []
  for (key in markerPointsLayer._layers) {
    var icon = markerPointsLayer._layers[key].options.icon.options
    if (icon.iconUrl == "image/map_pin_red.png") {
      markerPointsLayer._layers[key].setIcon(mapIconUnselect)
    }
    selectIndexes.push(markerPointsLayer._layers[key].options.myCustomId)
  }
}

var restoreData = [];

function deleteAll() {
  if (selectIndexes.length) {
    restoreData.push(JSON.parse(JSON.stringify(myMapData)));
    // restoreData.push(myMapData)

    for (var i = selectIndexes.length - 1; i >= 0; i--) {
      console.log(selectIndexes[i])
      myMapData.splice(selectIndexes[i], 1);
    }
    updateParameter();
    selectIndexes = [];
  }
}

function redoDelete() {
  if (restoreData.length) {
    myMapData = JSON.parse(JSON.stringify(restoreData[restoreData.length - 1]));
    // resetSlider();
    updateParameter();
    restoreData.pop();

  }
}

function resetSlider() {
  variableName.forEach(function(v, i) {
    if (i === 0 && g_var.length) {
      setUncertSlider(myMapData, g_var)
    } else if (i > 0) {
      setVarSlider(i, myMapData, v)
    }
  })
}

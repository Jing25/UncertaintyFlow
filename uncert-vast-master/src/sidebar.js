// Upload File
$('#OpenFileUpload').click(function() {
  $('#fileupload').trigger('click');
});


$('#classifyButton').click(function() {
  $("#classifyDialog").dialog();
});

function viewBuffer() {
  var bufferSize = $("#buffer").dropdown('get value');
  // console.log("bufferSize", bufferSize)

  if (eyebuttonClick && bufferSize == 400 && myData) {
    $(eyebutton).html("<i class=\"eye slash icon\"></i>")

    var data = myData;
    var markers = [];
    for (var i = 0; i < data.length; i++) {
      var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
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

function classifyButton() {

  //////////// Adding node to the tree
  var newNodeData = {
    "name": "classification",
    "r": 13,
    "clicked": 0,
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

  // console.log("here")
  //dropdown classes
  $('#dropdown-class')
    .dropdown({
      placeholder: 'CLASSES',
      values: [{
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
        // console.log("dropdown-class", value)
        filterByClass(value)
      }
    });
}

function bufferUncert() {
  ///
  /// here is for testing code to add node in tree
  ///
  var newNodeData = {
    "name": "400m Buffer",
    "r": 10,
    "clicked": 0,
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

  ///// test code end ///////////

  ///// Update donut chart
  // if (myData && donutData_G) {

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
      total: +maxV[key]
    })
  })
  // donutData_G = donutData;
  historyDonutData.push(donutData);
  donuts.update(donutData);
  donutData_G = donutData;

  historyData.push(data);
  myMapData = data;
  console.log("historyData: ", historyData)
  console.log("myMapData: ", myMapData)
  // }

  // console.log(donutData)
}

function sortDown() {
  if (donutData_G) {
    var donutData = donutData_G;
    donutData.sort((a, b) => b.total - a.total);
    // console.log(donutData)
    donuts.update(donutData);
  }
}

function sortUp() {
  if (donutData_G) {
    var donutData = donutData_G;
    donutData.sort((a, b) => a.total - b.total);
    // console.log(donutData)
    donuts.update(donutData);
  }
}

///
////////////////////////// set uncertainty slider value
///
var uncertSlider = document.getElementById('slider-uncert');
var uncertSliderValueElement = document.getElementById('slider-uncert-value');

function setUncertSlider(data, varType) {

  varType = varType + "_uncert"
  var min = findMin(data, varType)[varType];
  var max = findMax(data, varType)[varType];
  // console.log("min", min, "max", max);
  if (max == min) {
    max = max + 1;
  }
  uncertSlider.noUiSlider.updateOptions({
    start: [0.0],
    range: {
      'min': [0.0],
      'max': Math.ceil(max)
    }
  });
}

// uncertainty slider
noUiSlider.create(uncertSlider, {
  start: [0.0],
  connect: [false, true],
  // step: 1000,
  range: {
    'min': [0.0],
    'max': [5.0]
  }
});

uncertSlider.noUiSlider.on('update', function(values, handle) {
  $("#slider-uncert-value").val(values[handle]);

  // update filtered result
  // if (myData) {
  //   // update visible attr in myData
  //   myData.forEach(function(element) {
  //     if (element.uncertainty <= values[handle]) {
  //       element.visible = false;
  //     } else {
  //       element.visible = true;
  //     }
  //   });
  //
  //   // remove mappoints
  //   var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
  //   while (divMapPoint.firstChild) {
  //     divMapPoint.removeChild(divMapPoint.firstChild);
  //   }
  //
  //   // add mappoints
  //   myData.forEach(function(element) {
  //     if (element.visible) {
  //       mapPoint(element.lat, element.lon)
  //     }
  //   });
  // }
  if (myMapData) {
    // update visible attr in myData
    myMapData.forEach(function(element) {
      var variable = g_var + "_uncert"
      // debugger;
      if (+element[variable] < values[handle] - 0.01) {
        element.visible = false;
      } else {
        element.visible = true;
      }
    });
    // debugger;

    // remove mappoints
    var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
    while (divMapPoint.firstChild) {
      divMapPoint.removeChild(divMapPoint.firstChild);
    }
    map.removeLayer(markerlayer)

    // add mappoints
    var markers = [];
    myMapData.forEach(function(element) {
      if (element.visible) {
        mapPoint(element.lat, element.lon)
        markers.push(mapCircleIndiv(element, g_var))
      }
    });
    // debugger;
    markerlayer = L.layerGroup(markers);
    map.addLayer(markerlayer);
  }

  // stepSliderValueElement.innerHTML = values[handle]
});

uncertSliderValueElement.addEventListener('change', function() {
  uncertSlider.noUiSlider.set(this.value);
});

///
//////////////////// set variable slider value
///
var slider = [];
var slider_var = [];
var sliderValueElements = [];

slider.push(document.getElementById('slider-var1'));
sliderValueElements.push([
  document.getElementById('slider-var-left1'),
  document.getElementById('slider-var-right1')
])
slider_var.push("NONE")

// prepare slider
// var slider[0] = document.getElementById('slider-var' + index);
// var sliderValueElements[0] = [
//   document.getElementById('slider-var-left' + index),
//   document.getElementById('slider-var-right' + index)
// ];

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
  // stepSliderValueElement.innerHTML = values[handle]
  if (myMapData) {
    // update visible attr in myData
    var variable = slider_var[0]
    myMapData.forEach(function(element) {
      // debugger;
      if (+element[variable] > +values[1] || +element[variable] < +values[0]) {
        element.visible = false;
      } else {
        element.visible = true;
      }
    });
    // debugger;

    // remove mappoints
    var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
    while (divMapPoint.firstChild) {
      divMapPoint.removeChild(divMapPoint.firstChild);
    }
    map.removeLayer(markerlayer)

    // add mappoints
    var markers = [];
    myMapData.forEach(function(element) {
      if (element.visible) {
        mapPoint(element.lat, element.lon)
        markers.push(mapCircleIndiv(element, g_var))
      }
    });
    // debugger;
    markerlayer = L.layerGroup(markers);
    map.addLayer(markerlayer);
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
  slider_var.push("NONE")

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
      // update visible attr in myData
      // console.log("here")
      var variable = slider_var[index-1]
      myMapData.forEach(function(element) {
        // debugger;
        if (+element[variable] > values[1] || +element[variable] < values[0] - 0.01) {
          element.visible = false;
        } else {
          element.visible = true;
        }
      });
      // debugger;

      // remove mappoints
      var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
      while (divMapPoint.firstChild) {
        divMapPoint.removeChild(divMapPoint.firstChild);
      }
      map.removeLayer(markerlayer)

      // add mappoints
      var markers = [];
      myMapData.forEach(function(element) {
        if (element.visible) {
          mapPoint(element.lat, element.lon)
          markers.push(mapCircleIndiv(element, g_var))
        }
      });
      // debugger;
      markerlayer = L.layerGroup(markers);
      map.addLayer(markerlayer);
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
}

function setVarSlider(index, data, varType) {

  // console.log("varType", varType)
  slider_var[index-1] = varType;
  var min = findMin(data, varType)[varType];
  var max = findMax(data, varType)[varType];
  console.log("min", min, "max", max);
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



//variable silder
// noUiSlider.create(varSlider, {
//   start: [1000, 5000],
//   connect: [false, true, false],
//   // step: 1000,
//   range: {
//     'min': [100],
//     'max': [10000]
//   }
// });
// varSlider.noUiSlider.on('update', function(values, handle) {
//   varSliderValueElement[handle].value = values[handle];
//   // stepSliderValueElement.innerHTML = values[handle]
// });
// varSliderValueElement[0].addEventListener('change', function() {
//   varSlider.noUiSlider.set(this.value);
// });
// varSliderValueElement[1].addEventListener('change', function() {
//   varSlider.noUiSlider.set(this.value);
// });

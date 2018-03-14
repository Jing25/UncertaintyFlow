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
    start: [min],
    range: {
      'min': Math.floor(min),
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
  if (myData) {
    // update visible attr in myData
    myData.forEach(function(element) {
      if (element.uncertainty <= values[handle]) {
        element.visible = false;
      }
    });

    // remove mappoints
    var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
    while (divMapPoint.firstChild) {
      divMapPoint.removeChild(divMapPoint.firstChild);
    }

    // add mappoints
    myData.forEach(function(element) {
      if (element.visible) {
        mapPoint(element.lat, element.lon)
      }
    });
  }
  // stepSliderValueElement.innerHTML = values[handle]
});

uncertSliderValueElement.addEventListener('change', function() {
  uncertSlider.noUiSlider.set(this.value);
});

///
//////////////////// set variable slider value
///

var varSlider = document.getElementById('slider-var');
var varSliderValueElement = [
  document.getElementById('slider-var-left'),
  document.getElementById('slider-var-right')
];
// var varSliderValueElement = document.getElementById('slider-var-left')

function setVarSlider(data, varType) {

  // console.log("varType", varType)
  var min = findMin(data, varType)[varType];
  var max = findMax(data, varType)[varType];
  console.log("min", min, "max", max);
  if (max == min) {
    max = max + 1;
  }
  varSlider.noUiSlider.updateOptions({
    start: [min, max],
    range: {
      'min': Math.floor(min),
      'max': Math.ceil(max)
    }
  });
}

//variable silder
noUiSlider.create(varSlider, {
  start: [1000, 5000],
  connect: [false, true, false],
  // step: 1000,
  range: {
    'min': [100],
    'max': [10000]
  }
});
varSlider.noUiSlider.on('update', function(values, handle) {
  varSliderValueElement[handle].value = values[handle];
  // stepSliderValueElement.innerHTML = values[handle]
});
varSliderValueElement[0].addEventListener('change', function() {
  varSlider.noUiSlider.set(this.value);
});
// varSliderValueElement[1].addEventListener('change', function() {
//   varSlider.noUiSlider.set(this.value);
// });

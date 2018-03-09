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

function bufferUncert() {
  ///
  /// here is for testing code to add node in tree
  ///
  var newNodeData = {
      "name": "400m Buffer",
      "r": 13,
      "children": []
  };
  // create newNode with d3.hierarchy
  var newNode = d3.hierarchy(newNodeData);
  newNode.depth = selectedTreeNode.depth + 1;
  newNode.height = selectedTreeNode.height - 1;
  newNode.parent = selectedTreeNode;

  // push new node in selected tree node's children
  // if no child array, create an empty array
  if(!selectedTreeNode.children){
    selectedTreeNode.children = [];
    selectedTreeNode.data.children = [];
  }
  selectedTreeNode.children.push(newNode);
  selectedTreeNode.data.children.push(newNode.data);

  // Update tree
  updateTree(selectedTreeNode);

  ///// test code end ///////////

  if (myData && donutData_G) {

    var data = JSON.parse(JSON.stringify(myData));

    //Update donut charts
    variables.forEach(function(key) {
      data.map((d) => {
        d[key] = +d[key] + +d.uncertainty
      })
    })

    var donutData = [];
    variables.forEach(function(key) {
      var maxV = findMax(data, key)
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
        type: key,
        detailed: key,
        total: +maxV[key]
      })
    })
    donutData_G = donutData;
    donuts.update(donutData);


    //Update flowTree
    var newNode = [{"name": "400m Buffer"}]
    var nodes = searchTreeAddNode(treeData, treeNode.data.name, newNode);
    // var root = searchTree(treeData, treeNode);
    // radiusTree.push(20)
    var root = d3.hierarchy(nodes, function(d) { return d.children; });
    root.x0 = treeNode.x0;
    root.y0 = treeNode.y0;
    debugger;
    console.log("root", root)
    // flowTree(objTree, radiusTree)
    updateTree(root)
  }

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

// function bufferTreeAdd() {
//   $("#400Buffer").onclick({
//     if (obj) {
//
//     }
//   })
// }

//Classification slider
// var range = document.getElementById('range');
//
// range.style.height = '400px';
// range.style.margin = '0 auto 30px';
//
// noUiSlider.create(range, {
// 	start: [ 1450, 2050, 2350, 3000 ], // 4 handles, starting at...
// 	margin: 300, // Handles must be at least 300 apart
// 	limit: 600, // ... but no more than 600
// 	connect: true, // Display a colored bar between the handles
// 	direction: 'rtl', // Put '0' at the bottom of the slider
// 	orientation: 'vertical', // Orient the slider vertically
// 	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
// 	step: 50,
// 	tooltips: true,
// 	// format: wNumb({
// 	// 	decimals: 0
// 	// }),
// 	range: {
// 		'min': 1300,
// 		'max': 3250
// 	},
// 	pips: { // Show a scale with the slider
// 		mode: 'steps',
// 		stepped: true,
// 		density: 4
// 	}
// });

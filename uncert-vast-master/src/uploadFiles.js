// initial data
var donuts = new DonutCharts();

//Initialization
function uploadFiles() {
  var x = document.getElementById("fileupload");
  filename = "Data/" + x.files[0].name;
  $("#openFile").hide()
  d3.csv(filename, function(data) {
    //get data
    myData = data;
    myMapData = myData;
    historyData.push(myData);

    // add visibility attribute
    myData.forEach(function(element) {
      element["visible"] = true;
    });
    myMapData.forEach(function(element) {
      element["visible"] = true;
    });

    // DonutCharts
    var donutData = [];
    variables_uncert.forEach(function(key) {
      var maxV = findMax(myData, key)
      var name = key.split("_")[0]
      donutData.push({
        data: [{
            cat: "randomness",
            val: +maxV[key]
          },
          {
            cat: "fuzzyness",
            val: 0
          }
        ],
        type: name,
        detailed: name,
        total: +maxV[key],
        clicked: 0
      })
    })
    donutData_G = donutData;
    historyDonutData.push(donutData);
    donuts.create(donutData);

    //flowTree
    updateTree(root);

    // Map
    for (var i = 0; i < data.length; i++) {
      var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
      var lat = data[i].lat;
      var lon = data[i].lon;
      // mapCircle(lat, lon, radii);
      mapPoint(lat, lon)
      // flowTree(objTree, radiusTree)
    }

    //dropdown variables
    variables.forEach(function(v) {
      dropdown_names.push({
        name: v
      })
    })
    $('#dropdown-var1')
      .dropdown({
        placeholder: 'NONE',
        values: dropdown_names,
        onChange: function(value, text, $selectedItem) {
          if (text !== undefined) {
            setVarSlider(1, myMapData, text)
          }

        }
      });

    addVarButton()

    // end load file
  })
}

// classification dropdown
// $('.ui.dropdown')
//   .dropdown({
//     values: [{
//         name: 'Male',
//         value: 'male'
//       },
//       {
//         name: 'Female',
//         value: 'female',
//         selected: true
//       }
//     ]
//   });

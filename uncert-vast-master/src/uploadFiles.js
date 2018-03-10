// initial data
var donuts = new DonutCharts();

//Initialization
function uploadFiles() {
  var x = document.getElementById("fileupload");
  filename = "Data/" + x.files[0].name;
  $("#openFile").hide()
  d3.csv(filename, function(data) {
    myData = data;
    historyData.push(myData);

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
        total: +maxV[key]
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

    // classification dropdown
    $('.ui.dropdown')
      .dropdown({
        values: [{
            name: 'Male',
            value: 'male'
          },
          {
            name: 'Female',
            value: 'female',
            selected: true
          }
        ]
      });


    // end load file
  })
}

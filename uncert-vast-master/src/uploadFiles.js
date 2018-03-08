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
    console.log(myData)

    // var maxV = findMax(myData, variables[10])
    // console.log(maxV[variables[10]])
    var donutData = [];
    variables.forEach(function(key) {
      var maxV = findMax(myData, key)
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
        type: key,
        detailed: key,
        total: +maxV[key]
      })
    })
    donutData_G = donutData;
    donuts.create(donutData);

    for (var i = 0; i < data.length; i++) {
      var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
      var lat = data[i].lat;
      var lon = data[i].lon;
      // mapCircle(lat, lon, radii);
      mapPoint(lat, lon)
      // flowTree(objTree, radiusTree)
    }
    // variableUncertainty()

  })
}

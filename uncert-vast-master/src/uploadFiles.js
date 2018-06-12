
//Initialization
function uploadFiles() {
  var x = document.getElementById("fileupload");
  filename = "Data/" + x.files[0].name;
  $("#openFile").hide()
  d3.csv(filename, function(data) {
    //get data
    myData = data;
    myMapData = JSON.parse(JSON.stringify(myData));
    historyData.push(JSON.parse(JSON.stringify(myData)));

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

    // Matrix data
    historyOperation.push("Initial");

    //var matrixData = [];
    matrixData = window.UV.views.mtxdata.getMatrixData(historyOperation, historyData);
    //console.log(mtxdata.matrixData)

    donutData_G = donutData;
    historyDonutData.push(donutData);
    window.UV.views.donuts.create(donutData);

    //flowTree
    updateTree(root);

    // Map
    var markers = [];
    for (var i = 0; i < data.length; i++) {
      var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
      var lat = data[i].lat;
      var lon = data[i].lon;
      markers.push(mapPoint(lat, lon))
    }
    markerPointsLayer = L.layerGroup(markers);
    map.addLayer(markerPointsLayer);

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

    // matrix.create(matrixData, "Pop_uncert")
    // $('.menu .item')
    //   .tab({onFirstLoad: function(tp) {
    //     if (tp == "second") {
    //       window.UV.views.matrix.create(matrixData, "Pop_uncert")
    //     }
    //   }});
    window.UV.views.matrix.setView();
    window.UV.views.matrix.setData(matrixData)
    window.UV.views.matrix.create("Pop_uncert");


    $('#dropdown-var-matrix')
      .dropdown({
        placeholder: 'NONE',
        values: dropdown_names,
        onChange: function(value, text, $selectedItem) {
          if (text !== undefined) {
            //setVarSlider(1, myMapData, text)
            var v = text + "_uncert"
          }

        }
      });
    $('#dropdown-var-matrix').dropdown('set selected', "Pop")



    addVarButton()

    // end load file
  })
}

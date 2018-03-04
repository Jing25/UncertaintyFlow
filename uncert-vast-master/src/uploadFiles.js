var myData;

function uploadFiles() {
  var x = document.getElementById("fileupload");
  console.log(x.files[0].name)
  filename = "Data/" + x.files[0].name;
  d3.csv(filename, function(data) {
    myData = data;
    console.log(myData)
    for (var i = 0; i < data.length; i++) {
      var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
      var lat = data[i].lat;
      var lon = data[i].lon;
      // mapCircle(lat, lon, radii);
      mapPoint(lat, lon)
    }

  })
}

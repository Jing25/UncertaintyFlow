var map = L.map('panel-map-main').setView([41.85, -87.65], 12);

mapMain();

function mapMain(){
  d3.csv("Data/Mydata_01.csv", function(data) {
    // debugger;
    drawMap();
    for (var i = 0; i < data.length; i++) {
      marker = new L.circle([data[i].lat,data[i].lon], {
        color: 'blue',
        fillColor: "blue",
        fillOpacity: 1,
        radius: data[i].uncertain01 * 10
      })
        .on("click", myclick)
        .addTo(map);
    }
  })
}


function drawMap() {
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
  	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  	id: 'mapbox.streets'
  }).addTo(map);
}

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//   maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
// 		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
// 		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
// 	id: 'mapbox.streets'
// }).addTo(map);

// var rad = [200, 500, 1000]
// var planes = [
//   ["7C6B07", 41.85, -87.65],
//   ["7C6B38", 41.95, -87.65],
//   ["C820B6", 41.95, -87.35]
//   ];
  //
  // for (var i = 0; i < planes.length; i++) {
  //   marker = new L.circle([planes[i][1],planes[i][2]], {
  //     color: 'blue',
  //     fillColor: "blue",
  //     fillOpacity: 1,
  //     radius: 10
  //   })
  //     .on("click", myclick)
  //     .addTo(map);
  // }


  function myclick(e) {
    // e.target.color = "grey"
    e.target.setStyle({color: 'red'})
  }

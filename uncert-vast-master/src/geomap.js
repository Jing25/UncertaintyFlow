var map = L.map('panel-map-main').setView([41.875, -87.65], 12);
var mapIcon = L.icon({
    iconUrl: 'image/map_pin_2.png',
    iconSize:     [18, 18] // size of the icon
});

drawMap();

// function mapCircle(data) {
//   // data = myData;
//   for (var i = 0; i < data.length; i++) {
//     var radii = +(data[i].pop_uncer) + +(data[i].uncertain01);
//     // console.log(radii)
    // marker = new L.circle([data[i].lat, data[i].lon], {
    //     color: 'blue',
    //     fillColor: "blue",
    //     fillOpacity: 1,
    //     radius: radii * 10
    //   })
    //   .on("click", myclick)
    //   .addTo(map);
//   }

function mapCircle(data) {
  var markers = [];
  for (var i = 0; i < data.length; i++) {
    var lat = data[i].lat;
    var lon = data[i].lon;
    var radii = data[i].radii;
    // mapCircle(lat, lon, radii);
    var marker = new L.circle([lat, lon], {
        color: 'blue',
        // fillColor: "blue",
        // fillOpacity: 1,
        radius: radii * 10
      })
      // .on("click", myclick)
      // .addTo(map);
    markers.push(marker)
  }
  markerlayer = L.layerGroup(markers);
  map.addLayer(markerlayer);
}

function mapPoint(lat, lon) {
  var marker = L.marker([lat, lon], {icon: mapIcon})
    .addTo(map);
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



function myclick(e) {
  // e.target.color = "grey"
  console.log(e.target.options.color)
  if (e.target.options.color == "blue") {
    e.target.setStyle({
      color: 'grey',
      fillColor: 'rgb(177, 174, 169)'
    })
  } else if (e.target.options.color == "grey") {
    e.target.setStyle({
      color: 'blue',
      fillColor: 'blue'
    })
  }
}

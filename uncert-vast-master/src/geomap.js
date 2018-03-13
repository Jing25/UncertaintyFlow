var map = L.map('panel-map-main').setView([41.875, -87.65], 12);
var mapIcon = L.icon({
  iconUrl: 'image/map_pin_red.png',
  iconSize: [18, 18] // size of the icon
});
var mapIconUnselect = L.icon({
  iconUrl: 'image/map_pin_blue.png',
  iconSize: [18, 18] // size of the icon
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

function mapCircle(data, radius) {
  var markers = [];
  var radius = radius + "_uncert"
  for (var i = 0; i < data.length; i++) {
    var lat = data[i].lat;
    var lon = data[i].lon;
    var radii = +data[i][radius];
    // console.log("radius", radii)
    // mapCircle(lat, lon, radii);
    var marker = new L.circle([lat, lon], {
      color: 'blue',
      weight: 1,
      // fillColor: "blue",
      // fillOpacity: 1,
      radius: radii * 50
    })
    // .on("click", myclick)
    // .addTo(map);
    markers.push(marker)
  }
  // console.log("markers", markers)
  markerlayer = L.layerGroup(markers);
  map.addLayer(markerlayer);
}


function mapPoint(lat, lon) {
  var marker = L.marker([lat, lon], {
      icon: mapIcon
    })
    .on("click", myclick)
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
  var icon = e.target.options.icon.options
  if (icon.iconUrl == "image/map_pin_red.png") {
    e.target.setIcon(mapIconUnselect)
    // e.target.setStyle({
    //   color: 'grey',
    //   fillColor: 'rgb(177, 174, 169)'
    // })
  } else if (icon.iconUrl == "image/map_pin_blue.png") {
    e.target.setIcon(mapIcon)
  }


}

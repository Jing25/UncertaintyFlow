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
  var radius = radius.map( (d)=> d + "_uncert")
  for (var i = 0; i < data.length; i++) {
    var lat = data[i].lat;
    var lon = data[i].lon;
    var radii = 0;
    radius.forEach( function(r) {
      radii = radii + +data[i][r]
    })
    markers.push([lat, lon, radii])
  }
    // var radii = +data[i][radius];
    // console.log("radius", radii)
    // mapCircle(lat, lon, radii);
    var heat = L.heatLayer(markers, {
      // color: 'blue',
      // weight: 1,
      // fillColor: "blue",
      // fillOpacity: 1,
      radius: 20,
      blur: 15,
      maxZoom: 17
      // myCustomId: i
    })
    // .on("click", myclick)
    // .addTo(map);
    // marker.setAtrribute("myId", i)
    // markers.push(marker)
  // console.log("markers", markers)
  markerlayer = heat //L.layerGroup(heat);
  //L.control.layers(markerPointsLayer, heat).addTo(map);
  map.addLayer(markerlayer);

  points = markers.map( d => d.slice(0,2))
  // var marker = new L.circle(points, 10, {
  //   color: 'blue',
  //   weight: 1,
  //   myCustomId: index
  // }).addTo(map)
}


function mapPoint(lat, lon, index) {
  // var marker = L.marker([lat, lon], {
  //     icon: mapIcon,
  //     myCustomId: index
  //   })
    var marker = new L.circle([lat, lon], 12, {
      color: 'black',
      fillColor: 'black',
      fillOpacity: 1,
      weight: 1,
      myCustomId: index
    })
    .on("click", myclick)
    // .addTo(map);
    return marker
}

// var marker = new L.circle([lat, lon], +bufferSize, {
//   color: 'blue',
//   weight: 1
// })

function mapCircleIndiv(data, radius) {
  var radius = radius.map( (d)=> d + "_uncert")
  var lat = data.lat;
  var lon = data.lon;
  var radii = 0;
  radius.forEach( function(r) {
    radii = radii + +data[r]
  })
  // debugger;

  // var marker = new L.circle([lat, lon], {
  //   color: 'blue',
  //   weight: 1,
  //   // fillColor: "blue",
  //   // fillOpacity: 1,
  //   radius: radii * 50
  // })
  marker = [data.lat, data.lon, radii]
  //console.log(marker)

  return marker;
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
  // var icon = e.target.options.icon.options
  //  debugger;
  // if (icon.iconUrl == "image/map_pin_red.png") {
  //   e.target.setIcon(mapIconUnselect)
  //   this.options.myCustomId
  // } else if (icon.iconUrl == "image/map_pin_blue.png") {
  //   e.target.setIcon(mapIcon)

  //}


}

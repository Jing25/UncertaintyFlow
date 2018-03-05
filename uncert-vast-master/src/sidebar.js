var eyebuttonClick = 1;
var markerlayer;
// Upload File
$('#OpenFileUpload').click(function() {
  $('#fileupload').trigger('click');
});


$('#classifyButton').click(function() {
  $("#classifyDialog").dialog();
});

function viewBuffer() {
  if (eyebuttonClick) {
    $(eyebutton).html("<i class=\"eye slash icon\"></i>")
    var bufferSize = $("#buffer").dropdown('get value');
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
  }
  else {
    $(eyebutton).html("<i class=\"eye icon\"></i>");
    map.removeLayer(markerlayer);
    eyebuttonClick = 1;
  }


}

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

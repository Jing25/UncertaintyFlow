var myData;
var myMapData;
var donutData_G;
var g_var = [];
var historyData = [];
var historyDonutData = [];
var dropdown_names = [];

var variables = ["TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "Crash", "BNDes",
  "Pop", "PecWhi", "MedAge", "PecV", "Income", "TWork"
]
var variables_uncert = variables.map( (d)=> d + "_uncert" );

var eyebuttonClick = 1;
var markerlayer;
var markerPointsLayer;


var objTree = {
  "name": "Initial"
}
var radiusTree = [7]
var treeNode;
var nodeClick = 1;

//sliders
var variableName = [];
var minAll = [];
var maxAll = [];

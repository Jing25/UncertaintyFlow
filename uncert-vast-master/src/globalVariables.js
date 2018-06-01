window.UV = {}

window.UV.views = {
  matrix: new UncertaintyMatrix(),
  donuts: new DonutCharts(),
  mtxdata: new MatrixData()
}

var myData;
var myMapData;
var donutData_G;
var g_var = [];   // types of variables that is chosen
var historyData = [];
var historyDonutData = [];
var historyOperation = [];
var matrixData;
var dropdown_names = [];

window.UV.data = {

}

var classVar = "UndSer_Lvl"

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
var numModel = 0;

//sliders
var variableName = [];
var minAll = [];
var maxAll = [];

//barCharts
var barChartData = [];
// var meanM = [];
// var maxM = [];
// var minM = [];
// var nameM = [];

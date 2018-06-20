function UncertaintyMatrix() {

  var w = 0;
  var h = 0;
  var dataset = [];
  var buckets = 9;
  var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
  var svg_matrix;
  var maxV = 0;
  var legend;
  var v = "Pop_uncert";
  var optColumns = {}; // column

  // debugger

  var gridSize = 20;
  var space = 2;
  var legendElementWidth = gridSize * 1.5;

  this.setData = function(d) {
    dataset = d;
    // console.log("dataset", dataset);
  }

  this.setView = function() {
    w = $('#matrix-chart').width();
  }


  var brush = d3.brush()
    .on("start brush", brushed)
    .on("end", brushended);

  function brushed() {
    var s = d3.event.selection;
    console.log("s", s);
  }

  function brushended() {
    if (!d3.event.selection) {
      console.log("here");
    }
  }

  function createLegend(colorScale) {

    var legend_g = legend.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), (d) => d)
      .enter();

    legend_g.append("rect")
      .attr("x", (d, i) => legendElementWidth * i)
      // .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", (d, i) => colors[i]);

    legend_g.append("text")
      .attr("class", "mono")
      .text((d) => d.toFixed(1))
      .attr("x", (d, i) => legendElementWidth * (i + 1))
      .attr("text-anchor", "end")
      .attr('font-size', '0.75em')
      .attr("y", gridSize);
  }

  function updateLegend(colorScale) {
    legend.selectAll(".mono").remove();

    var legend_g = legend.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), (d) => d)
      .enter();

    legend_g.append("text")
      .attr("class", "mono")
      .text((d) => d.toFixed(1))
      .attr("x", (d, i) => legendElementWidth * (i + 1))
      .attr("text-anchor", "end")
      .attr('font-size', '0.75em')
      .attr("y", gridSize);

  }



  function setColumn(data, colorScale) {

    // console.log("data; ", data)
    var opts = Object.keys(data[0]);
    var numOpts = opts.length - 1;
    var opt = opts[numOpts];

    // debugger

    var column = svg_matrix.selectAll(".matrix").append("g")
      .attr("class", "c_" + opt)
      .attr("transform", "translate(" + ((numOpts - 1) * gridSize * 1.5 + gridSize / 1.5) + ", 0)");

    var col = column.selectAll("abc");
    optColumns[opt] = column;

    //var tex = column.selectAll(".col" + numOpts)
    var tex = col
      .data([opt])
      .enter().append("g");

    tex.append("text")
      .attr("class", "optsLabel")
      // .style("text-anchor", "start")
      // .attr("y", 0)
      // .attr("x", numOpts * gridSize + 4)
      // .style("text-anchor", "middle")
      .text((d) => d)

    tex.selectAll("text")
      .attr("transform", "rotate(-40)")

    //**** sort buttons ***** //
    var btnData = ["\uf161", "G"]

    var buttons = col
      .data(btnData)
      .enter()
    // .attr("class", "colbtns");

    buttons.append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * (gridSize + 1))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", (d) => "btn" + numOpts)
      .attr("width", gridSize)
      .attr("height", gridSize)
      .attr("transform", "translate(0, 6)")
      .style("stroke", "grey")
      .style("fill", "grey")
    // .style("cursor", "pointer")

    buttons.append("text")
      .attr("x", 0)
      .attr("y", (d, i) => i * gridSize)
      .attr('font-family', 'FontAwesome')
      .attr("class", "buttonicon")
      .attr('font-size', '0.85em')
      .text((d) => d)
      .style("text-anchor", "end")
      .attr("transform", "translate(15, 20)")
      .style("fill", "white")
      .style("cursor", "pointer")

    //***** moving button ****//
    column.append("rect")
      .attr("x", -1)
      .attr("y", (d, i) => (i + 2) * gridSize)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("class", "mvbtns")
      .attr("width", gridSize + 2)
      .attr("height", gridSize / 2.5)
      .attr("transform", "translate(0, 12)")
      .style("fill", "rgb(55, 152, 222)")
      .style("cursor", "move")


    //***** cards *****//
    col
      .data(data)
      .enter()
      .append("rect")
      // .attr("x", (d) => numOpts * gridSize)
      .attr("y", (d, i) => (i + 3) * (gridSize + space))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "cards")
      .attr("id", (d) => d["Id"])
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", (d) => colorScale(d[opt]));

  }

  function updateCardsColor(data, colorScale) {
    // var cards = svg_matrix.selectAll(".matrix")
    var opts = Object.keys(data[0])
    var numOpts = opts.length - 1

    for (var i = 1; i < numOpts; i++) {
      opt = opts[i];
      var cards = svg_matrix.select(".matrix").selectAll(".c_" + opt).selectAll(".cards");
      // debugger
      cards.style("fill", (d) => colorScale(d[opt]))

    }
  }




  // console.log(W)
  this.create = function(opt) {
    // dataset i.e. matrixData
    // v variable name i.e. "TTrip_uncert"

    if (dataset.length === 0) return;
    if (w === 0) return;

    var data = dataset[v]
    var numItems = data.length

    h = (gridSize + space) * (numItems + 10);

    var margin = {
        top: 120,
        right: 10,
        bottom: 100,
        left: 50
      },
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    svg_matrix = d3.select("#matrix-chart").append("svg")
      .attr("width", w)
      .attr("height", h);

    var matrix = svg_matrix.append("g")
      .attr("class", "matrix")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var stations = svg_matrix.selectAll(".matrix").append("g")
      .attr("class", "stationlabel");

    matrix.append("g")
      .attr("class", "brush")
      .attr("transform", "translate(0, " + (gridSize + space) * 2.5 + ")")
      .call(brush);


    stations.selectAll(".stationlabel")
      .data(data)
      .enter().append("text")
      .attr("class", "itemLabel")
      .text(function(d) {
        // var text = "Station " + d;
        return d["Id"];
      })
      .attr("x", 0)
      .attr("y", function(d, i) {
        return (i + 3) * (gridSize + space);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.3 + ")");

    // debugger

    var max = d3.max(data, d => +d[opt])
    maxV = Math.max(maxV, max)
    console.log("maxV", maxV);

    var colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, maxV])
      .range(colors);

    setColumn(data, colorScale)

    legend = svg_matrix.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (width - gridSize * 1.5 * (colors.length - 1)) + ", 10)")
    createLegend(colorScale)

  }

  this.addColumn = function(datas) {

    dataset = datas
    var data = dataset[v]
    var opts = Object.keys(data[0])
    var numOpts = opts.length - 1;

    opt = opts[numOpts]


    var max = d3.max(data, d => +d[opt])
    // debugger
    maxV = Math.max(maxV, max)
    console.log("maxVadd", maxV)
    // debugger

    var colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, maxV])
      .range(colors);

    updateCardsColor(data, colorScale)

    setColumn(data, colorScale)
    updateLegend(colorScale)

  }

  this.highlight = function(toggle) {

    // console.log("data", dataset);
    var data = dataset[v]

    var opts = Object.keys(data[0]);
    var numOpts = opts.length - 1;
    var matrix = svg_matrix.select(".matrix")

    if (toggle == 1) {
      for (var i = 1; i <= numOpts; i++) {

        opt = opts[i]

        optColumns[opt].selectAll(".highlight_rect")
          .data(data)
          .enter()
          .append("rect")
          // .attr("x", -1)
          .attr("y", (d, i) => (i + 3) * (gridSize + space))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "highlight_rect")
          .attr("id", (d) => d["Id"])
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("stroke", function(d) {
            return d[opt] > 5.0 ? "red" : "transparent"
          })
          .style("fill", "transparent");
      }
    } else {
      matrix.selectAll(".highlight_rect").remove();
    }


  }

}

function UncertaintyMatrix() {

  var w = 0;
  var h = 0;
  var dataset = [];
  var buckets = 9;
  var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
  var svg_matrix;
  var maxV = 0;

  // debugger

  var gridSize = 20;
  var space = 2;
  // var gridWidth = gridHeight
  var legendElementWidth = gridSize * 2;

  function setColumn(data, color, numOpts) {
    console.log("data; ", data)

    var cards = svg_matrix.selectAll(".colCards")
                  .data(data.value);
    cards.enter().append("rect")
    .attr("x", (d) => numOpts * gridSize)
    .attr("y", (d, i) => i * (gridSize + space))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("fill", (d) => color(d));
  // .merge(cards)
  //   .transition()
  //   .duration(1000)
  //   .style("fill", (d) => color(d.value));
  }

  this.setData = function(d) {
    dataset = d;
  }

  this.setView = function() {
    w = $('#matrix-chart').width();
  }

  // console.log(W)
  this.create = function(v) {
    // dataset i.e. matrixData
    // v variable name i.e. "TTrip_uncert"

    if (dataset.length === 0) return;
    if (w === 0) return;

    var data = dataset[v]
    var items = data["Id"]
    var numItems = items.length
    var opts = Object.keys(data)
        opts.shift()
    var numOpts = opts.length

    h = (gridSize + space) * (numItems+5);

    var margin = {
        top: 50,
        right: 10,
        bottom: 100,
        left: 50
      },
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    svg_matrix = d3.select("#matrix-chart").append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var itemLabels = svg_matrix.selectAll(".itemLabel")
      .data(items)
      .enter().append("text")
      .attr("class", "itemLabel")
      .text(function(d) {
        var text = "Station " + d;
        return d;
      })
      .attr("x", 0)
      .attr("y", function(d, i) {
        return i * (gridSize + space);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

    var optsLabels = svg_matrix.selectAll(".optsLabel")
      .data(opts)
      .enter().append("g")
      .attr("class", "optsLabel")
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("x", numOpts * gridSize)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)")

    // var colName = opts.shift();

    // console.log(opts)
    opts.forEach(function(optName) {

      var colData = {
        name: optName,
        value: data[optName]
      }

      // console.log(colData)
      var max = d3.max(colData.value, d => +d)
      maxV = Math.max(maxV, max)
      // console.log(maxV)
      // debugger

      var colorScale = d3.scaleQuantile()
        .domain([0, buckets - 1, maxV])
        .range(colors);

      // console.log(colorScale)

      setColumn(colData, colorScale, numOpts)
    })




  }

  this.addColumn = function(dataset, v) {

    var data = dataset[v]
    var opts = Object.keys(data)
    var numOpts = opts.length

    optName = opts[numOpts-1]

    var colData = {
      name: optName,
      value: data[optName]
    }

    // debugger

    optsLabels = svg_matrix.selectAll(".optsLabel")
      .data(opts)
      .enter().append("g")
      .attr("class", "optsLabel")
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("x", numOpts * gridSize)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)")

      var max = d3.max(colData.value, d => +d)
      maxV = Math.max(maxV, max)
      // console.log(maxV)
      // debugger

      var colorScale = d3.scaleQuantile()
        .domain([0, buckets - 1, maxV])
        .range(colors);

      // console.log(colorScale)

      setColumn(colData, colorScale, numOpts)

  }

  this.highlight = function() {

  }
}

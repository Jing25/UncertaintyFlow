function DonutCharts() {

  var charts = d3.select('#charts');

  var chart_m,
    chart_r,
    color = d3.scaleOrdinal(["#fd8d3c", "#6baed6"]);

  var getCatNames = function(dataset) {
    var catNames = new Array();

    for (var i = 0; i < dataset[0].data.length; i++) {
      catNames.push(dataset[0].data[i].cat);
    }

    return catNames;
  }

  // var createLegend = function(catNames) {
  //   var legends = charts.select('.legend')
  //     .selectAll('g')
  //     .data(catNames)
  //     .enter().append('g')
  //     .attr('transform', function(d, i) {
  //       return 'translate(' + (i * 150 + 50) + ', 10)';
  //     });
  //
  //   legends.append('circle')
  //     .attr('class', 'legend-icon')
  //     .attr('r', 6)
  //     .style('fill', function(d, i) {
  //       return color(i);
  //     });
  //
  //   legends.append('text')
  //     .attr('dx', '1em')
  //     .attr('dy', '.3em')
  //     .text(function(d) {
  //       return d;
  //     });
  // }

  var createCenter = function(pie) {

    // var eventObj = {
    //   'mouseover': function(d, i) {
    //     d3.select(this)
    //       .transition()
    //       .attr("r", chart_r * 0.65);
    //   },
    //
    //   'mouseout': function(d, i) {
    //     d3.select(this)
    //       .transition()
    //       .duration(500)
    //       .ease('bounce')
    //       .attr("r", chart_r * 0.6);
    //   },
    //
    //   'click': function(d, i) {
    //     var paths = charts.selectAll('.clicked');
    //     pathAnim(paths, 0);
    //     paths.classed('clicked', false);
    //     resetAllCenterText();
    //   }
    // }

    var donuts = d3.selectAll('.donut');

    // The circle displaying total data.
    donuts.append("svg:circle")
      .attr("r", chart_r * 0.55)
      .style("fill", "#E7E7E7");
    // .on('mouseover', function(d, i) {
    //   // console.log("i: ", i)
    //   d3.select(this)
    //     .transition()
    //     .attr("r", chart_r * 0.55);
    // })
    // .on('mouseout', function(d, i) {
    //   d3.select(this)
    //     .transition()
    //     .duration(500)
    //     .ease(d3.easeBounce)
    //     .attr("r", chart_r * 0.5);
    // })
  }

  function setCenter(donuts) {

    donuts.on('click', function(d, i) {
      // var paths = charts.selectAll('.clicked');
      // pathAnim(paths, 0);
      // paths.classed('clicked', false);
      // resetAllCenterText();
      console.log(d)
      // mapCircle(myData, "uncertain01")
    });

    donuts.selectAll('text').remove()
    donuts.append('text')
      .attr('class', 'center-txt type')
      .attr('y', chart_r * -0.18)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('font-size', '0.8em')
      .text(function(d, i) {
        // console.log("here", d)
        return d.type;
      });
    donuts.append('text')
      .attr('class', 'center-txt value')
      .style('font-size', '0.8em')
      .attr('text-anchor', 'middle');
    donuts.append('text')
      .attr('class', 'center-txt percentage')
      .style('font-size', '0.8em')
      .attr('y', chart_r * 0.18)
      .attr('text-anchor', 'middle')
      .style('fill', '#A2A2A2');
  }

  var setCenterText = function(thisDonut) {
    var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
      return d.data.val;
    });

    thisDonut.select('.value')
      .text(function(d) {
        return (sum) ? sum.toFixed(1) :
          d.total.toFixed(1);
      });
    thisDonut.select('.percentage')
      .text(function(d) {
        return (sum) ? (sum / d.total * 100).toFixed(2) + '%' :
          '';
      });
  }

  var resetAllCenterText = function() {
    charts.selectAll('.value')
      .text(function(d) {
        return d.total.toFixed(1);
      });
    charts.selectAll('.percentage')
      .text('');
  }

  var pathAnim = function(path, dir) {
    switch (dir) {
      case 0:
        path.transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', d3.arc()
            .innerRadius(chart_r * 0.6)
            .outerRadius(function() {
              var d = d3.select(this.parentNode).select('.value').data()[0];
              return chart_r * (d.total * radiusRatio + 0.6)
            })
            .cornerRadius(5)
            .padAngle(0.015)
          )
        break;

      case 1:
        path.transition()
          .attr('d', d3.arc()
            .innerRadius(chart_r * 0.6)
            .outerRadius(chart_r * 1.08)
            .cornerRadius(5)
            .padAngle(0.015)
          )

        break;
    }
  }

  var updateDonut = function() {

    // var eventObj = {
    //
    //   'mouseover': function(d, i, j) {
    //
    //     pathAnim(d3.select(this), 1);
    //
    //
    //     var thisDonut = charts.select('.type' + j);
    //     thisDonut.select('.value').text(function(donut_d) {
    //       return d.data.val.toFixed(1) + donut_d.unit;
    //     });
    //     thisDonut.select('.percentage').text(function(donut_d) {
    //       return (d.data.val / donut_d.total * 100).toFixed(2) + '%';
    //     });
    //   },
    //
    //   'mouseout': function(d, i, j) {
    //     var thisPath = d3.select(this);
    //     if (!thisPath.classed('clicked')) {
    //       pathAnim(thisPath, 0);
    //     }
    //     var thisDonut = charts.select('.type' + j);
    //     setCenterText(thisDonut);
    //   },
    //
    //   'click': function(d, i, j) {
    //     var thisDonut = charts.select('.type' + j);
    //
    //     if (0 === thisDonut.selectAll('.clicked')[0].length) {
    //       thisDonut.select('circle').on('click')();
    //     }
    //
    //     var thisPath = d3.select(this);
    //     var clicked = thisPath.classed('clicked');
    //     pathAnim(thisPath, ~~(!clicked));
    //     thisPath.classed('clicked', !clicked);
    //
    //     setCenterText(thisDonut);
    //   }
    // };

    var pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.val;
      });

    var arc = d3.arc()
      .cornerRadius(5)
      .padAngle(0.015)
      .innerRadius(chart_r * 0.6)
      .outerRadius(function() {
        // console.log("here", d)
        var d = d3.select(this.parentNode).select('.value').data()[0];
        // debugger;
        return (d3.select(this).classed('clicked')) ? chart_r * 1.08 :
          chart_r * (d.total * radiusRatio + 0.6);
      })


    // Start joining data with paths
    var paths = charts.selectAll('.donut')
      .selectAll('path')
      .data(function(d, i) {
        return pie(d.data);
      });

    paths
      .transition()
      .duration(1000)
      .attr('d', arc);

    paths.enter()
      .append('svg:path')
      .attr('d', arc)
      .style('fill', function(d, i) {
        return color(i);
      })
      .style('stroke', '#FFFFFF')
      .on('mouseover', function(d, i) {
        pathAnim(d3.select(this), 1);

        // console.log("here",  JSON.stringify(j))
        // console.log(d3.select(this.parentNode))
        var thisDonut = d3.select(this.parentNode);
        thisDonut.select('.value').text(function(donut_d) {
          return d.data.val.toFixed(1);
        });
        thisDonut.select('.percentage').text(function(donut_d) {
          return (d.data.val / donut_d.total * 100).toFixed(2) + '%';
        });
      })
      .on('mouseout', function(d, i) {
        var thisPath = d3.select(this);
        if (!thisPath.classed('clicked')) {
          pathAnim(thisPath, 0);
        }
        // console.log("i: ", i)
        var thisDonut = d3.select(this.parentNode);
        setCenterText(thisDonut);
      })
      .on('click', function(d, i, j) {
        var thisDonut = d3.select(this.parentNode);

        if (0 === thisDonut.selectAll('.clicked')[0].length) {
          thisDonut.select('circle').on('click')();
        }

        var thisPath = d3.select(this);
        var clicked = thisPath.classed('clicked');
        pathAnim(thisPath, ~~(!clicked));
        thisPath.classed('clicked', !clicked);

        setCenterText(thisDonut);
      });

    paths.exit().remove();

    resetAllCenterText();
  }

  this.create = function(dataset) {
    var $charts = $('#charts');
    // chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
    // chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;
    chart_m = 11;
    chart_r = 69;

    max_r = findMax(dataset, "total");
    radiusRatio = 0.4 / max_r.total;
    // debugger;
    console.log("ratio: ", radiusRatio)
    // console.log("chart_m", chart_m, "chart_r", chart_r)

    // charts.append('svg')
    //   .attr('class', 'legend')
    //   .attr('width', '100%')
    //   .attr('height', 50)
    //   .attr('transform', 'translate(0, -100)');

    var donut = charts.selectAll('.donut')
      .data(dataset)
      .enter().append('svg:svg')
      .attr('width', (chart_r + chart_m) * 2)
      .attr('height', (chart_r + chart_m) * 2)
      .append('svg:g')
      .attr('class', function(d, i) {
        return 'donut type' + i;
      })
      .attr('transform', 'translate(' + (chart_r + chart_m) + ',' + (chart_r + chart_m) + ')');

    // createLegend(getCatNames(dataset));
    createCenter();
    setCenter(donut);
    updateDonut();
  }

  this.update = function(dataset) {
    // Assume no new categ of data enter
    var donut = charts.selectAll(".donut")
      .data(dataset);

    console.log(dataset)
    max_r = findMax(dataset, "total");
    console.log(max_r)
    radiusRatio = 0.4 / max_r.total;

    setCenter(donut);
    updateDonut();

  }
}


/*
 * Returns a json-like object.
 */
function genData() {
  var type = ['Users', 'Avg Upload', 'Avg Files Shared'];
  var unit = ['M', 'GB', ''];
  var cat = ['Google Drive', 'Dropbox', 'iCloud', 'OneDrive', 'Box'];

  var dataset = new Array();

  for (var i = 0; i < type.length; i++) {
    var data = new Array();
    var total = 0;

    for (var j = 0; j < cat.length; j++) {
      var value = Math.random() * 10 * (3 - i);
      total += value;
      data.push({
        "cat": cat[j],
        "val": value
      });
    }

    dataset.push({
      "type": type[i],
      "unit": unit[i],
      "data": data,
      "total": total
    });
  }
  return dataset;
}

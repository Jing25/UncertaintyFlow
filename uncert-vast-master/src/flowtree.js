const DATA = {
  "name": "Initial",
  "children": [{
    "name": "400m Buffer",
    "children": [{
        "name": "Model_01"
      },
      {
        "name": "Brushing",
        "children": [{
            "name": "Model_01"
          },
          // {"name": "Classification"},
          {
            "name": "Classification",
            "children": [{
              "name": "Brushing",
              "children": [{
                "name": "selection",
                "children": [{
                    "name": "Model_01"
                  },
                  {
                    "name": "Model_02"
                  }
                ]
              }]
            }]
          }
        ]
      }
    ]
  }]
}

var obj = {
  "name": "Initial"
}

var radiusTree = [7, 20, 25, 15, 17, 21, 14, 8, 11, 9]

const WIDTH = $('#panel-vis-main').width();
const HEIGHT = $('#panel-vis-main').height();

const svg = d3.select("#panel-vis-main").append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .append('g')
  .attr('transform', 'translate(40,0)');



function flowTree(data, radiusTree) {
  root = d3.hierarchy(DATA);
  tree = d3.tree().size([HEIGHT, WIDTH - 120]);
  // console.log(root.descendants())

  tree(root);


  var link = svg.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
      return "M" + d.y + "," + d.x +
        "C" + (d.y + d.parent.y) / 2 + "," + d.x +
        " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
        " " + d.parent.y + "," + d.parent.x;
    });

  var node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", function(d) {
      return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  node.append("circle")
    .data(radiusTree)
    .attr("r", function(d) {
      return d / 2
    });

  node.append("text")
    .attr("dy", 3)
    .attr("x", function(d) {
      return d.children ? -8 : 8;
    })
    .style("text-anchor", function(d) {
      return d.children ? "end" : "start";
    })
    .text(function(d) {
      return d.data.name;
    });
}

// root = d3.hierarchy(DATA);
// tree = d3.tree().size([HEIGHT, WIDTH - 120]);
// // console.log(root.descendants())
//
// tree(root);
//
//
// var link = svg.selectAll(".link")
//   .data(root.descendants().slice(1))
//   .enter().append("path")
//   .attr("class", "link")
//   .attr("d", function(d) {
//     return "M" + d.y + "," + d.x +
//       "C" + (d.y + d.parent.y) / 2 + "," + d.x +
//       " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
//       " " + d.parent.y + "," + d.parent.x;
//   });
//
// var node = svg.selectAll(".node")
//   .data(root.descendants())
//   .enter().append("g")
//   .attr("class", function(d) {
//     return "node" + (d.children ? " node--internal" : " node--leaf");
//   })
//   .attr("transform", function(d) {
//     return "translate(" + d.y + "," + d.x + ")";
//   });
//
// node.append("circle")
//   .data(radiusTree)
//   .attr("r", function(d) {
//     return d / 2
//   });
//
// node.append("text")
//   .attr("dy", 3)
//   .attr("x", function(d) {
//     return d.children ? -8 : 8;
//   })
//   .style("text-anchor", function(d) {
//     return d.children ? "end" : "start";
//   })
//   .text(function(d) {
//     return d.data.name;
//   });

const DATA = {
  "name": "Eve",
  "children": [
    {
      "name": "Cain"
    },
    {
      "name": "Seth",
      "children": [
        {
          "name": "Enos"
        },
        {
          "name": "Noam"
        }
      ]
    },
    {
      "name": "Abel"
    },
    {
      "name": "Awan",
      "children": [
        {
          "name": "Enoch"
        }
      ]
    },
    {
      "name": "Azura"
    }
  ]
};

const WIDTH = $('#panel-vis-main').width() - 80;
const HEIGHT = $('#panel-vis-main').height() ;

const svg = d3.select("#panel-vis-main").append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
  .append('g')
    .attr('transform', 'translate(40,0)');

const root = d3.hierarchy(DATA);
const tree = d3.tree().size([HEIGHT, WIDTH]);

tree(root);

var link = svg.selectAll(".link")
    .data(root.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
      return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
    });

var node = svg.selectAll(".node")
    .data(root.descendants())
  .enter().append("g")
    .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

node.append("circle")
    .attr("r", 2.5);

node.append("text")
    .attr("dy", 3)
    .attr("x", function(d) { return d.children ? -8 : 8; })
    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) { return d.data.name; });

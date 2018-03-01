// Vue.component('control-button', {
//   template: '<button v-on:click="counter += 1">{{ counter }}</button>',
//
//   data: function() {
//     return {
//       counter: 0
//     }
//   }
// })

var dropdownTemplate = `
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#" v-for="method in methods">{{ method.name }}</a>
  </div>
</div>
`

Vue.component('control-dropdown', {
  template: dropdownTemplate,

  data: function() {
    return {
      methods: [{
          name: "method1"
        },
        {
          name: "method2"
        },
        {
          name: "method3"
        }
      ]
    }
  }
})

new Vue({
  el: '#sidebar-control'
})

const width_sidebar = $('#parameters').width();
const height_sidebar = 500;

var circlePara = [{
  radii: 25,
  name: "Population"
}, {
  radii: 30,
  name: "Percent_White"
}, {
  radii: 25,
  name: "Hospital"
}]



const svgCircle = d3.select("#parameters").append("svg")
  .attr("width", width_sidebar)
  .attr("height", height_sidebar)
  .append('g')
  .attr('transform', 'translate(0,0)');

var circles = svgCircle.selectAll("circle")
  .data(circlePara)
  .enter()
  .append("circle")

var texts = svgCircle.selectAll("text")
  .data(circlePara)
  .enter()
  .append("text")

circles.attr("r", function(d) {
    return d.radii
  })
  .attr("cx", width_sidebar / 2)
  .attr("cy", function(d, i) {
     return (d.radii * 2 * i + 100)
  })
  .style("fill", "rgb(94, 172, 228)")
  .style("stroke", "grey")
texts.attr("x", width_sidebar / 2 - 120)
  .attr("y", function(d, i) {
    return (d.radii * 2 * i + 110)
  })
  .text(function(d) {
    return d.name;
  })

// updateCircle(circlePara)

function updateCircle(d) {

  var dd = [{
    radii: 50,
    name: "C"
  }, {
    radii: 60,
    name: "D"
  }, {
    radii: 50,
    name: "E"
  }]
  // , d=>d.name
  circles = svgCircle.selectAll("circle").data(dd);
  texts = svgCircle.selectAll("text").data(dd);

  circles.exit().remove();
  circles.enter().append("circle");

  texts.exit().remove();
  texts.enter().append("text");

  circles.transition()
    .duration(200)
    .attr("r", function(d) {
      return d.radii
    })
    .attr("cx", width_sidebar / 2)
    .attr("cy", function(d, i) {
      return (d.radii * 2 * i + 100)
    })

  texts.transition()
    .duration(200)
    .attr("x", width_sidebar / 2 - 50)
    .attr("y", function(d, i) {
      return (d.radii * 2 * i + 110)
    })
    .text(function(d) {
      return d.name;
    })

}

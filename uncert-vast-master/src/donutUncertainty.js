const width_sidebar = $('#charts').width();
const height_sidebar = 500;

var donut = donutChart()
    .width(width_sidebar/3)
    .height(width_sidebar/3)
    .cornerRadius(3) // sets how rounded the corners are on each slice
    .padAngle(0.015) // effectively dictates the gap between slices
    .variable('Probability')
    .category('Species');

d3.tsv('Data/species.tsv', function(error, data) {
    if (error) throw error;
    d3.select('#charts')
        .datum(data) // bind data to the div
        .call(donut); // draw chart in div
});

$(document).ready(function() {
  // $(window).resize(function(){
  $("#matrix-chart").height($(".sidebar").height() - 45);
  // })
  $(window).resize(function() {
    $("#matrix-chart").height($(".sidebar").height() - 45);
  })
});

$('.ui.accordion')
  .accordion();

$('.ui.dropdown')
  .dropdown();

$('.menu .item')
  .tab({
    // onFirstLoad: function(tp) {
    //   if (tp == "second") {
    //     window.UV.views.matrix.setView();
    //     window.UV.views.matrix.create("Pop_uncert");
    //   }
    // }
  });

$('.activating.element')
  .popup();

$('#className')
  .popup({
    on: 'focus'
  });

$('#highlight_P').click(function() {
  $('#highlight_P').toggleClass("blue");
  var a = $(this).attr("data-value");
  window.UV.views.matrix.highlight(a);
  $(this).attr("data-value", ~a)
  console.log($(this).attr("data-value"));

})

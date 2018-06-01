$('.ui.accordion')
  .accordion();

$('.ui.dropdown')
  .dropdown();

$('.menu .item')
  .tab({
    onFirstLoad: function(tp) {
      if (tp == "second") {
        window.UV.views.matrix.setView();
        window.UV.views.matrix.create("Pop_uncert");
      }
    }
  });

$('.activating.element')
  .popup();

$('#className')
  .popup({
    on: 'focus'
  });

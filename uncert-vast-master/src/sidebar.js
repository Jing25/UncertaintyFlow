Vue.component('control-button', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',

  data: function () {
    return {
        counter: 0
    }
  }
})

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
          methods: [
              {name: "method1"},
              {name: "method2"},
              {name: "method3"}
          ]
      }
  }
})

new Vue({
  el: '#sidebar-control'
})

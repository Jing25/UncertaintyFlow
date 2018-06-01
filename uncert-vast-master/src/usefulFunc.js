// find the max object in an array
function findMax(data, key) {
  return data.reduce(function(a, b) {
    return (+a[key] > +b[key]) ? a : b;
  })
}

// find the min object in an array
function findMin(data, key) {
  return data.reduce(function(a, b) {
    return (+a[key] > +b[key]) ? b : a;
  })
}


//Search tree
function searchTree(element, matchingTitle) {
  if (element.name == matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
}

function searchTreeAddNode(element, matchingTitle, data) {
  if (element.name == matchingTitle) {
    debugger;
    if (element.children == undefined) {

      element.children = []
    }
    element.children.push({
      "name": "400m Buffer"
    })
    return element
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTreeAddNode(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
}

function removeItemInArray(arr, item) {
  var index = arr.indexOf(item)
  if (index !== -1) arr.splice(index, 1);
}



function filterByClass(value) {
  if (myMapData && value) {
    // update visible attr in myData
    var variable = "UndSer_Lvl"
    myMapData.forEach(function(element) {
      // debugger;
      if (element[variable] == value) {
        element.visible = true;
      } else {
        element.visible = false;
      }
    });
    // debugger;

    // remove mappoints
    var divMapPoint = document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0];
    while (divMapPoint.firstChild) {
      divMapPoint.removeChild(divMapPoint.firstChild);
    }
    map.removeLayer(markerlayer)

    // add mappoints
    var markers = [];
    myMapData.forEach(function(element) {
      if (element.visible) {
        mapPoint(element.lat, element.lon)
        markers.push(mapCircleIndiv(element, g_var))
      }
    });
    // debugger;
    markerlayer = L.layerGroup(markers);
    map.addLayer(markerlayer);
  }
}

var numVarBtns = 1;
var btnActNum = 0;

function addVarButton() {

  numVarBtn = variables.length;

  var node = document.getElementById("var-buttons");

  for (var i = 0; i < numVarBtn; i++) {
    var btndiv = document.createElement('div');
    btndiv.classList.add("column")
    // var btndiv;
    btndiv.innerHTML =
      `
      <button class="ui button var-button" style="width:100%" onclick="varChoosing(` + i + `)" id="button` + i + `"></button>
      <div class="ui center aligned segment" id="text` + i + `"></div>
    `
    node.appendChild(btndiv)
    $('#button' + i).text(variables[i]);
  }
}

function varChoosing(index) {
  var btn = $("#button" + index);
  var tex = $("#text" + index);
  var parameters = getModelParameters();

  if (btn.hasClass("active")) {
    btn.removeClass("active")
    tex.text('')
    btnActNum = btnActNum - 1;
  } else {
    btnActNum = btnActNum + 1;
    btn.addClass("active")
    tex.text("x" + btnActNum)
  }
  if (btnActNum == parameters.length) {
    $('#model').removeClass("disabled")
  } else {
    $('#model').addClass('disabled')
  }
}

function getModelParameters() {
  var parameters = $('#parameters').val().split(',').map((d) => parseFloat(d))
  return parameters;
}

// Matrix data class
function MatrixData() {
  //matrix data manipulate

  //get data
  this.getMatrixData = function(opts, data) {
    var matrixData = {};
    variables_uncert.forEach(function(v) {
      var obj = {};
      obj["Id"] = data[0].map(d => d["Id"]);
      if (opts.length == data.length) {
        opts.forEach(function(opt, i) {
          obj[opt] = data[i].map(d => d[v])
          //optData.push(obj)
        })
        matrixData[v] = obj
        //matrixData.push(obj)
      } else {
        console.log("The length of history data and operation are DIFFERENT!")
      }
    })
    return matrixData
  }

  // add new operation data
  this.addOperation = function(opts, data) {
    // opt: operation name i.e. historyOperation
    // data: 475 x num(v) x num(opts) i.e. historyData

    if (opts.length == data.length) {
      var len = opts.length - 1
      var opt = opts[len]
      var dt = data[len]
      Object.keys(matrixData).forEach(function(v) {
        matrixData[v][opt] = dt.map(dd => dd[v])
      })
    }

  }
}

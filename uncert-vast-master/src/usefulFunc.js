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

//get new tree node
function getNode(data) {
  return data;
}

// function filterOut(data, type) {
//   return
// }


//Search tree
function searchTree(element, matchingTitle){
     if(element.name == matchingTitle){
          return element;
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], matchingTitle);
          }
          return result;
     }
     return null;
}

function searchTreeAddNode(element, matchingTitle, data){
     if(element.name == matchingTitle){
       debugger;
          if (element.children == undefined) {

            element.children = []
          }
          element.children.push({"name": "400m Buffer"})
          return element
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
               result = searchTreeAddNode(element.children[i], matchingTitle);
          }
          return result;
     }
     return null;
}

function filterByClass(value){
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


function selectAllStations() {
  if (myMapData.visible) {

  }
}

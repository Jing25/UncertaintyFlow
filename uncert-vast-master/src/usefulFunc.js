// find the max object in an array
function findMax(data, key) {
  return data.reduce(function(a, b) {
    return (a[key] > b[key]) ? a : b;
  })
}

// find the min object in an array
function findMin(data, key) {
  return data.reduce(function(a, b) {
    return (a[key] > b[key]) ? b : a;
  })
}

//get new tree node
function getNode(data) {
  return data;
}


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

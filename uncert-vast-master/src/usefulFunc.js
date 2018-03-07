// find the max object in an array
function findMax(data, key) {
  return data.reduce(function(a, b) {
    return (a.key > b.key) ? a : b;
  })
}

// find the min object in an array
function findMin(data, key) {
  return data.reduce(function(a, b) {
    return (a.key > b.key) ? b : a;
  })
}

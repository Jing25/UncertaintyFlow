var myData;

function uploadFiles(){
    var x = document.getElementById("fileupload");
    console.log(x.files[0].name)
    filename = "Data/" + name;
    d3.csv(filename, function(data) {
      myData = data;
      mapMain();
    })

}

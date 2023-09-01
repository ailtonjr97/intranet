function getFile(){
    document.getElementById("upfile").click();
}

function sub(obj) {
  var file = obj.value;
  var fileName = file.split("\\");
  document.getElementById("btnAnexo").innerHTML = fileName[fileName.length - 1];
}

export function getFile();
export function sub();
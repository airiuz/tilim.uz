var ph_cyr = "Кирилл алифбосида матнни киритинг...";
var ph_lat = "Lotin alifbosida matnni kiriting...";

var selleft;
var selright;

window.onload = function(){

  var dropbox = document.getElementById("dropbox");
  var swapbtn = document.getElementById('swap-btn');
  
  selleft = document.getElementById('select-left');
  selright = document.getElementById('select-right');
  
  selleft.selectedIndex = 0;
  selright.selectedIndex = 1;
  changePlaceHolder(0);
  
  swapbtn.addEventListener('click', onSwapBtnClick, false);
  dropbox.addEventListener("dragenter", onDragEnter, false);
  dropbox.addEventListener("dragover", onDragOver, false);
  dropbox.addEventListener("drop", onDragDrop, false);  
  dropbox.addEventListener("dragleave", onDragLeave, false);
}

function onSwapBtnClick () {
    
  var temp = selleft.selectedIndex;
  
  selleft.selectedIndex = selright.selectedIndex;
  selright.selectedIndex = temp;
  changePlaceHolder(selleft.selectedIndex);
  doneTyping();
}

function onDragEnter (e) {
  e.stopPropagation();
    e.preventDefault();
    
    document.getElementById("dropbox").src = "/static/img/dropbox-active.svg";  
}

function onDragOver (e) {
  e.stopPropagation();
    e.preventDefault();
}

function onDragDrop (e) {
  e.stopPropagation();
    e.preventDefault();
    
    document.getElementById("dropbox").src = "/static/img/dropbox.svg";
    
    var dt = e.dataTransfer;
    var files = dt.files;   
    
    handleFiles(files);
}

function onDragLeave (e) {
  e.stopPropagation();
    e.preventDefault();
    
    document.getElementById("dropbox").src = "/static/img/dropbox.svg";
}


function onSelectLeftChange (val) {
  var selright = document.getElementById('select-right');
    
    if (val == 0) {selright.selectedIndex = 1;}
    if (val == 1) {selright.selectedIndex = 0;}
    
    changePlaceHolder(val);

    doneTyping();

}

function onSelectRightChange (val) {
  var selleft = document.getElementById('select-left');
    
    if (val == 0) {selleft.selectedIndex = 1;}
    if (val == 1) {selleft.selectedIndex = 0;}
    
    changePlaceHolder(selleft.selectedIndex);

    doneTyping();

}

function changePlaceHolder (val) {
  var textleft = document.getElementById("textarea-left");
  
  if (val == 0) {
    textleft.placeholder = ph_cyr;
  } 
  else {
    textleft.placeholder = ph_lat;
  }     

}

function onUploadClick () {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/*';
  input.addEventListener("change", handleFileSelect, false);
  input.click();
}

function handleFileSelect () {
  handleFiles(this.files);
}

function handleFiles (fileList) {

  var filedesc = document.getElementById('file-name');
  
  if (!fileList.length) return;
  
  filedesc.innerHTML = fileList[0].name + ', ' + (fileList[0].size/1024).toFixed(2) + ' kB';
  
  document.getElementById('dropboxdiv').style.display = "none";
  document.getElementById('uploadbtn').style.display = "none";
  document.getElementById('uploadelemgroup').classList.remove("object-hidden");
}
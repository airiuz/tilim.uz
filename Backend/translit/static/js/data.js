// function FileUpload(file) {
//   const reader = new FileReader();  
//   const xhr = new XMLHttpRequest();
//   this.xhr = xhr;
  
//   const self = this;
//   this.xhr.upload.addEventListener("progress", function(e) {
//         if (e.lengthComputable) {
//           const percentage = Math.round((e.loaded * 100) / e.total);
//           //self.ctrl.update(percentage);
//         }
//       }, false);
  
//   xhr.upload.addEventListener("load", function(e){
//           //self.ctrl.update(100);
//           const canvas = self.ctrl.ctx.canvas;
//           canvas.parentNode.removeChild(canvas);
//       }, false);


//   xhr.open("POST", "http://tt.idtm.uz:8881/process");
//   xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
//   reader.onload = function(evt) {
//     xhr.send(evt.target.result);
//   };
//   reader.readAsBinaryString(file);
// }

var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms, 0.5 second for example
var $input = $('#textarea-left');
var typingState = false;

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
  clearTimeout(typingTimer);
  if (!typingState) {
  	$('#swap-btn').attr("src", "/static/img/process.gif");
  	typingState = true;
  }
});

//user is "finished typing," do something
function doneTyping () {

    var textType = $('#select-left').val();
    var textData = $('#textarea-left').val();

    var request = $.ajax({
        url: "/process/",
        method: "POST",
        data: { type : textType, data: textData },
    });
     
    request.done(function( msg ) {
      $( "#textarea-right" ).val( msg );
      $('#swap-btn').attr("src", "/static/img/arrows.svg");
      typingState = false;
    });
     
    request.fail(function( jqXHR, textStatus ) {
      $('#swap-btn').attr("src", "/static/img/arrows.svg");
      typingState = false;
      alert( "Request failed: " + textStatus );
    });



}



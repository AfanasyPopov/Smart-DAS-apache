
/**Afanfsy's part of code
 * 
 */

//Put event listeners into place
//alert("SmartDAS script is loaded.");
var isCamInitDone = false;
var canvas,context, video;
var front = true;
var mediaConfig ;
var wsUri = "http://185.63.32.215:8080";
var connectionStatus=false;
function camInit(mediaConfig) {  // Camera initialization
    isCamInitDone = true;
	//Grab elements, create settings, etc.
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var video = document.getElementById('video');
	
	var canvas_parent_k=1;
	var doc_1s= "not found";
	//var mediaConfig = {video: {width: {exact: 640}, height: {exact: 480}}};
	var errBack = function(e) {
	  	console.log('An error has occurred!', e)
	  };

		// Put video listeners into place
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	      navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
	          window.stream = stream;
	          video.src = window.URL.createObjectURL(stream);
	          video.play();
	      });
	  }

	  /* Legacy code below! */
	  else if(navigator.getUserMedia) { // Standard
			navigator.getUserMedia(mediaConfig, function(stream) {
				window.stream = stream;
				video.src = stream;
				video.play();
			}, errBack);
		} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia(mediaConfig, function(stream){
				window.stream = stream;
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
			}, errBack);
		} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
			navigator.mozGetUserMedia(mediaConfig, function(stream){
				window.stream = stream;
				video.src = window.URL.createObjectURL(stream);
				video.play();
			}, errBack);
		}
		window.myConsole.value = window.myConsole.value+"camInit: done successfull."+"\n";
}
function makeShot(){  // Make capture from Video element
	  canvasInit();
	  video = document.getElementById('video');
	  canvas = document.getElementById('canvas');
	  context = canvas.getContext('2d');
	  doc_1s="(not found)";
	  
	  var scl=1, sx =0, sy =0, dx=0, dy=0, k=1;
	  var isLandscape =true;
	  if (video.videoWidth>=video.videoHeight){
		  	  isLandscape=true;
		  	  k=video.videoHeight/video.videoWidth;
		  	  dWidth = video.videoWidth;
		  	  dHeight = dWidth*k;
		  } else{
			  isLandscape=false;
		  	  k=video.videoHeight/video.videoWidth;
		  	  dWidth = video.videoWidth;
		  	  dHeight = dWidth*k;
		  }
	  dx = sx;
	  dy = sy;
	  //context.setTransform(1, 0, 0, 1, 0, 0);
	  //context.scale(1,1);
	  context.drawImage(video,sx,sy,video.videoWidth, video.videoHeight,dx,dy,dWidth,dHeight);
	  context.font = "15px arial bold";
	  context.strokeStyle = "white";
	  context.strokeText("Документ: "+doc_1s+";",5,22);
	  context.fillStyle = "blue";  // show parameters
	  context.fillText("Документ: "+doc_1s+";",5,22);

	  //context.fillText("VideoWH: "+video.videoWidth+"x"+video.videoHeight+";",5,22);
	  //context.fillText("CanvasWH: "+canvas.clientWidth+"x"+canvas.clientHeight+";",5,42);
	  //context.fillText("DestWH: "+dWidth+"x"+dHeight+";",5,62);
	  //context.drawImage(video, 0, 0, parseInt($(video).css("width").split('px')[0]),parseInt($(video).css("height").split('px')[0]) );
}
function canvasInit(){  //Canvas initializine : change propertie Height, Width, etc.
	var canvas = document.getElementById('canvas');
	var video = document.getElementById('video');
	var canvas_parent_k=1;
	var video_k=video.videoHeight/video.videoWidth;
	var canvas_parent = document.getElementById(canvas.parentElement.id);
	//< To solve: witch size need to be iscribed
	var height_k = canvas_parent.scrollHeight/canvas_parent.clientHeight;
	var width_k = canvas_parent.scrollWidth/canvas_parent.clientWidth;
	//> To solve: witch size need to be iscribed
	if (width_k<=height_k) {
		console.log ('var 1');
		canvas.style.width =String(Math.round(canvas_parent.scrollWidth*width_k)-2)+'px';
		canvas.width=video.videoWidth;
		canvas.style.height =String(Math.round(canvas_parent.scrollWidth*width_k*video_k)-2)+'px';
		canvas.height=video.videoHeight;
	} else {
		console.log ('var 2');
		canvas.style.width =String(Math.round(canvas_parent.scrollHeight*height_k)-2)+'px';
		canvas.width=video.videoWidth;
		canvas.style.height =String(Math.round(canvas_parent.scrollHeight*height_k*video_k)-2)+'px';
		canvas.height=video.videoHeight;
	}
	//window.myConsole.value=myConsole.value+"WH_k: "+width_k+";"+height_k+";"+"\n";
	//window.myConsole.value=myConsole.value+"parentWH: "+canvas_parent.scrollWidth+"x"+canvas_parent.scrollHeight+";"+"\n";
	window.myConsole.value=myConsole.value+"VideoWH: "+video.videoWidth+"x"+video.videoHeight+";"+"\n";
};
function readBarcode(){

};
function switchCam(){
	var cameras=[];
	var video = document.getElementById('video');
	if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
		  console.log("enumerateDevices() not supported.");
		  return;
	}
	window.myConsole.value  = "Switch start: "+ true +"\n";
	if (window.stream) {
	    video.src = null;
	    window.stream.getTracks().forEach(function(track){
	      track.stop();
	    })
  	};
	// List cameras and microphones.
	navigator.mediaDevices.enumerateDevices().then(function(devices) {
	  	devices
	.forEach(function(device) {
		  	if (device.kind =="videoinput"){
		    console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
		   	cameras.push({"devId":device.deviceId,"devLbl": device.label}); 
		   	window.myConsole.value=window.myConsole.value+ device.kind + ": " + device.label+"\n";
		   }
	  	});
		front = (cameras.length>1? !front: true);
		var constraints = {};
        constraints.video = {
        	mandatory: {
                           minWidth: 1024,
                           minHeight: 768,
                        },
            optional: [
                       { sourceId: (front? cameras[0].devId : cameras[1].devId)}
                      ]
        };
		//mediaConfig = { video: { sourceId: (front? cameras[0] : cameras[1]) } };
		camInit(constraints);
		window.myConsole.value=window.myConsole.value+"Selected device: "+ (front? cameras[0].devLbl : cameras[1].devLbl)+"\n";	
	})
	.catch(function(err) {
	  console.log(err.name + ": " + err.message);
	});
};
//additional functions fron examples
function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
};
function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
};



function setBackgroundColor() {
   // alert(connectionStatus+' webservice connected '+socket.id);
    elements = document.getElementsByClassName('connectionStatus');
    i = elements.length;

    while(i--) {
        if (connectionStatus) {
            elements[i].style.backgroundColor = '#e4ffbf';//'#baffcc'; // Connection succsessfull 
            elements[i].style.borderWidth = "3px !important";//'#baffcc'; // Connection succsessfull 
        } else {
            elements[i].style.backgroundColor = '#ffdeba'; // Connection lost
            elements[i].style.borderWidth = "3px !important";//'#baffcc'; // Connection succsessfull 
        }
    }
}
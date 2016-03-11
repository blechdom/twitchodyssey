/*
var myDropzone = document.getElementById('my-dropzone');
console.log(myDropzone);
*/

var socket = io();

Dropzone.options.myDropzone = {
	success: function(file, response) {
		var obj = JSON.parse(response);
		var name = obj.files[0].name;
		console.log('create thumb : ' + name);
		socket.emit('createThumb', name);
		/*
		exec("ffmpeg -i public/uploaded/files/" + name  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg public/images/" + name  + ".jpg", function(err){
		//child_process.execFile("ffmpeg -i public/uploaded/files/" + name  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg public/images/" + name  + ".jpg", function(err){
			socket.emit('done', {'Image' : 'public/images/' + name + '.jpg'});
		});
		*/
	},
}

/*
var $fileNameInput = $('.fileNameInput'); // Input for fileName

$window.keydown(function (event) {
	// Auto-focus the current input when a key is typed
	if (!(event.ctrlKey || event.metaKey || event.altKey)) {
	  $currentInput.focus();
	}
	// When the client hits ENTER on their keyboard
	if (event.which === 13) {
	  if (username) {
		sendMessage();
		socket.emit('stop typing');
		typing = false;
	  } else {
		setUsername();
	  }
		var fileName = cleanInput($fileNameInput.val().trim());

		// If the username is valid
		$loginPage.fadeOut();
		$chatPage.show();
		$loginPage.off('click');
		$currentInput = $inputMessage.focus();

		// Tell the server your username
		socket.emit('add user', username);

	}
});
*/



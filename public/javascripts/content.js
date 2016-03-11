// Initialize variables
var socket = io();

socket.on('jwplayerVideo', function (data) {
  name = data.substring(0, data.length - 4);
  name += ".mp4";
  changeVideo(data);
  console.log('change video ' + name);
});

socket.on('pause', function (data) {
	contentFeed.pause();
	console.log(data);
});


socket.on('unpause', function (data) {
	contentFeed.play();
	console.log(data);
});

function changeVideo (data) {
	console.log(data);
  contentFeed.load([{file:data}]);
}
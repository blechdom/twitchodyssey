$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  
  var $messages = $('.messages'); // Messages area
  
  var $inputMessage = $('.inputMessage'); // Input message input box
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  
  var connected = false;

  var thumbnails = [];
  var pause = false;
  
/*
	var typing = false;
  var lastTypingTime;
  */
  var $currentInput = $usernameInput.focus();

  var socket = io();
  var selection = "";
  var logsPumped = false;

  function addParticipantsMessage (data) {
    return;
    var $el = $('<li>').addClass('log').text(data);
    addMessageElement($el, options);
	console.log("add users message " + data);	
    socket.emit('sendchat', data);
  }

  function testThumb () {

	console.log("test Thumb");
	socket.emit('thumbClick', 'for realz');
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    console.log(username);
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

	
      // Tell the server your username
      socket.emit('adduser', username);
    }
  }

  
  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
	console.log("send message " + message);
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    //if (message && connected) {
 	if (message && username) {
	//console.log("message and connected");
      $inputMessage.val('');
      //log({
       // username: username,
        //message: message
      //});
      // tell server to execute 'new message' and send along one parameter
      socket.emit('sendchat', message);
	console.log("sending message to server");
    }
  }

  // Log a message
  function log (data, options) {
    var $el = $('<li>').addClass('log').text(data.username + ": " + data.message);
	// console.log(data.username);
	// console.log(data.message);
    addMessageElement($el, options);
  }
  // Adds the visual chat message to the message list

function addMessageElement (el, options) {
    var $el = $(el);

    // $el[0].className += ' chatLine';
    $el[0].className = 'chatLine';
    // console.log($el[0].className);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }
  
  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
	console.log("pressed return");
      if (username) {
	console.log("has username " + username);
        sendMessage();
        //socket.emit('stop typing');
        //typing = false;
      } else {
        setUsername();
      }
    }
  });


  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('updatechat', function (data) {
	log(data);
//, {
 //     		prepend: false
  //  	});
  });



  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('updateusers', function (data) {
    addParticipantsMessage(data);
	$('#users').empty();
	$.each(data, function(key, value) {	
		$('#users').append('<div>' + key + '</div>');
	});

  });

  socket.on('streamStatus', function (data) {
    console.log('stream status ' + data.streamRunning + ' : ' + data.paused);
    if (data.streamRunning) {
      playerInstance.load([{file:"rtmp://danmnet.ucsc.edu/live/twitchodyssey"}]);
    } else {
      playerInstance.load([{file:"/uploaded/files/closing%20seg.mp4"}]);
    }
    if (data.paused) {
      pause = true;
      thumbnails.forEach(lock);
    }
  });

  socket.on('nextPlaying', function (data) {
    console.log('new playing ');
    if (selection) {
      selection.style.borderStyle = "none";
      selection = null;
    }
  });

  socket.on('changeStream', function (data) {
    console.log('change stream ' + data);
    if (data == 'start') {
      playerInstance.load([{file:"rtmp://danmnet.ucsc.edu/live/twitchodyssey"}]);
    } else {
      playerInstance.load([{file:"/uploaded/files/closing%20seg.mp4"}]);
    }
  });

  // c.childNodes[3].className = 'locked';
  // c.childNodes[3].className = 'thumbnail';

  function lock(element, index, array) {
    element.className = 'locked';
  };

  function unlock(element, index, array) {
    element.className = 'thumbnail';
  }

  socket.on('pause', function (data) {
    if (!pause) {
      // playerInstance.pause();
      console.log(data);
      pause = true;
      thumbnails.forEach(lock);
    }
  });


  socket.on('unpause', function (data) {
    if (pause) {
      // playerInstance.play();
      console.log(data);
      pause = false;
      // if (nextVid.length != 0) {
      //   playerInstance.load([{file:nextVid}]);
      //   nextVid = "";
      // }
      thumbnails.forEach(unlock);
    }
  });

  socket.emit('requestLog', '');
  socket.on('pumpLog', function (data) {
    console.log(data);
    if (!logsPumped && typeof(data) == String) {
      chats = data.split('\n');
      logsPumped = true;
      //TODO: append chats by logs
    }
  });
 
	function thumbClick2 () {
    if (!selection && !pause) {
      socket.emit('recieveVote', this.src);
      console.log('voting for ' + this.src);
      this.style.borderColor = "#00e600";
      selection = this;
    }
	}

  function mouseOver () {
    if (!selection && !pause) {
      this.style.borderWidth = "thick";
      this.style.borderColor = "#1a75ff";
      this.style.borderStyle = "solid";
    }
  }

  function mouseOut () {
    if (!selection && !pause) {
      this.style.borderStyle = "none";
    }
  }
	
  // thumbnail logic
  var grab = document.getElementById('grab');
  // console.log(grab);
  for (var a in grab.childNodes) {
    a = grab.childNodes[a];
    // console.log(a);
    for (var b in a.childNodes) {
      b = a.childNodes[b];
      // console.log(b);
      for (var c in b.childNodes) {
        c = b.childNodes[c];
        // console.log(c);
        if (c.childNodes && c.childNodes.length != 0) {
          // console.log('------');
          // console.log(c.childNodes[0]);
          // console.log(c.childNodes[0].nextSibling);
          // console.log('------');
          var target = c.childNodes[0].nextSibling;
          target.onclick = thumbClick2;
          target.onmouseover = mouseOver;
          target.onmouseout = mouseOut;
          target.className = 'thumbnail';
          thumbnails.push(target);
        }
      }
    }
  }

  // function pumpLog() {
    // var text = fs.readFileSync('./public/text/chatLog.txt', 'utf-8');
  // }
  // console.log(thumbnails);

	function myResize (event) {
		height = window.innerHeight;
		width = window.innerWidth;
		if (playerInstance) {
			playerInstance.resize(width, height * .5);
		}
	}
	myResize();
	window.onresize = myResize;
	
  var w = window.innerWidth;
  var h = window.innerHeight;

  var playerInstance = jwplayer("rtmpfeed");
  playerInstance.setup({
    file: "/uploaded/files/closing%20seg.mp4",
    controls: false,
    autostart : true,
    autoplay : true,
    repeat : true,
    width: w, // * .5,
    height: h * .5
  });
  // socket.emit('getStreaming', '?');
  socket.emit('streamStatus', '');
});

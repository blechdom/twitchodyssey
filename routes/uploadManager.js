var options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  },
  maxPostSize: 500000000, // 500 MB
  minFileSize:  1,
  maxFileSize:  5000000000, // 10 GB
  acceptFileTypes:  /\.(gif|jpe?g|png|mov|mp4|qt|avi|ogg|3gp)/i
};

var uploader = require('blueimp-file-upload-expressjs')(options);

module.exports = function(router) {
  router.get('/upload', function(req, res) {
	//console.log('A');
    uploader.get(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });

  router.post('/upload', function(req, res) {
	//console.log(req + " : " + res);
	//console.log(JSON.stringify(res, null, 4));
	/*
	for (var propName in res) {
		var propValue = res[propName];
		console.log(propValue);
	}
	*/
	//console.log(req.files[0]);
	//console.log(req.files);
    uploader.post(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
	/*
	exec("ffmpeg -i public/uploaded/files/" + data  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg public/images/" + data  + ".jpg", function(err){
		socket.emit('done', {'Image' : 'public/images/' + data + '.jpg'});
	});
	*/
  });

  router.delete('/uploaded/files/:name', function(req, res) {
	//console.log('C');
    uploader.delete(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });
  return router;
};

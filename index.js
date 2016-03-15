var express = require('express');
var fs = require('fs');
var app = express();
var multer = require('multer');
var morgan = require('morgan');
var path = require('path');
var exec = require( 'child_process' ).exec;
var port = 4000;

app.use(express.static('client'));
app.use(morgan('dev'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage,
  limits: {fileSize: 1000000, files:1}
});

app.get('/upload/spijefie', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/upload.html'), function (err) {
		if(err) {
			res.status(500).send(err);
		}
	});
});

//handle posts on file uploads
app.post('/pictures/upload', upload.single('image'), function (req, res) {
	res.send();
});

app.get('/home', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/home.html'), function (err) {
		if(err) {
			res.status(500).send(err);
		}
	});
});

//wipe out all files from this location at regular interval
setInterval(function () {
	exec( 'rm -rf ' + './public/uploads/*', function ( err, stdout, stderr ){
	  console.log('Files deleted');
	});
}, 10 * 1000);

app.listen(port, function () {
	console.log('Listening on port', port);
});
//client pulls the selected files and loads them in a banner
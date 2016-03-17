var express = require('express');
var fs = require('fs');
var app = express();
var multer = require('multer');
var morgan = require('morgan');
var path = require('path');
var exec = require( 'child_process' ).exec;
var port = 4000;

app.use(morgan('dev'));
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/public'));

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
  limits: {fileSize: 1000000, files: 5}
});

app.get('/upload/spijefie', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/upload.html'), function (err) {
		if(err) {
			res.status(500).send(err);
		}
	});
});

app.post('/pictures/upload', upload.array('image', 12), function (req, res) {
	res.send();
});

app.get('/home', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/home.html'), function (err) {
		if(err) {
			res.status(500).send(err);
		}
	});
});

app.get('/spicejet', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/spicejet.html'), function (err) {
		if(err) {
			res.status(500).send(err);
		}
	});
});

function getWinners(dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = files[i];
        if ((/\.(png|jpe?g)$/i).test(name)){
        		var winnerName = name.split(/\.(png|jpe?g)$/i)[0].split(/[_|\s|-]/);
            files_.push({
            	url: 'winners/' + name,
            	name: winnerName[0] + ' ' + (winnerName[1] || '')
            });
        }
    }
    return files_;
}

app.get('/winners', function (req, res) {
	res.json(getWinners('public/winners'));
});

//wipe out all files from this location at regular interval
// setInterval(function () {
// 	exec( 'rm -rf ' + './public/uploads/*', function ( err, stdout, stderr ){
// 	  console.log('Files deleted');
// 	});
// }, 5 * 1000);

app.listen(port, function () {
	console.log('Listening on port', port);
});

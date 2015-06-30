var exec = require('child_process').exec;
var uuid = require('node-uuid');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var request = require('request');
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/'}));
app.use('/facebook', express.static('public'));
app.post("/facebook", function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/image', function(req, res){
  console.log(req.body);
  var postData = req.body.url;
  var tempName = uuid.v1();
  download(postData, tempName + '.jpg', function(){
    var file = tempName + '.jpg';
    child = exec('composite -gravity center flag.jpg[390x^] -geometry +115-0 ' + file + '[390x] -dissolve 30 ' + file,
      function (error, stdout, stderr) {
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    });
  });
});

app.listen(process.env.PORT || 8000);

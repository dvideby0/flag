var exec = require('child_process').exec;
var uuid = require('node-uuid');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/'}));
app.use('/', express.static('public'));

app.post('/image', function(req, res){
  console.log(req.body) // form fields
    var file = req.files.filefield.path;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    child = exec('composite -gravity center flag.jpg[390x^] -geometry +90-15 ' + file + '[390x] -dissolve 30 ' + file,
      function (error, stdout, stderr) {
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    });
});

app.post("/facebook", function(req, res, next) {
  req.method = "GET";
  next();
});

app.get('/facebook', express.static('public'));

app.listen(process.env.PORT || 8000);

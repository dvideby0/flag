var exec = require('child_process').exec;
var uuid = require('node-uuid');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var express = require('express');
var multer  = require('multer');
var app = express();
app.use(multer({ dest: './uploads/'}));
app.get('/', function(req, res){
  res.send('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
});

app.post('/', function(req, res){
  console.log(req.body) // form fields
  console.log(req.files.filefield.path) // form files
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

app.listen(process.env.PORT || 8000);

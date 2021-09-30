function randomString(length) {
    var result = '';
    for (var i = length; i > 0; --i) result += '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.length)];
    return result;
}

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('publish'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/run', function(req,res){
  res.send(`<!DOCTYPE HTML>
<html>
<body style="background: #00001a">
  <script src="https://cdn.jsdelivr.net/gh/Unzor/jsvm/dist/jsvm.js"></script>
  <vm-instance ${req.query.mode}="${req.query.url}" style="position: absolute; top: 50%; left: 50% ; transform: translate(-50%, -50%); box-shadow: #00004d
 0px 4px 8px 0px, #00004d 0px 6px 20px 0px;"></vm-instance>
</body>
</html>`);
});

app.post('/vm', function(req, res){
   var mode = req.body.mode
  var h = req.files;
  var fileName_='/storage/'+ randomString(36) + '.' + h.fileUploaded.name.split('.').pop();
require('fs').writeFileSync('public' + fileName_, h.fileUploaded.data, 'utf8', ()=>{})
res.send(`<!DOCTYPE HTML>
<html>
<body style="background: #00001a">
  <script src="https://cdn.jsdelivr.net/gh/Unzor/jsvm/dist/jsvm.js"></script>
  <vm-instance ${mode}="${fileName_}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: #00004d
 0px 4px 8px 0px, #00004d 0px 6px 20px 0px;"></vm-instance>
  <script>
  if (!document.cookie.includes('${h.fileUploaded.name.split('.').shift()}')){
  document.cookie += '${h.fileUploaded.name.split('.').shift()} = "${fileName_}||mode=${mode}";';
  }
  </script>
</body>
</html>`);
});

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

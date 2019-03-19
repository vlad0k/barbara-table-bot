var express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");

var app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('./reserve-table/public'));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});
app.get('/reserve', urlencodedParser, function (req, res) {
  res.send(fs.readFileSync('./reserve/reserve.json'))
});
app.post('/', urlencodedParser, (req,res) => {
  res.sendfile('./public/index.html');
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});

var express = require('express');
var app = express();
var router = require('./router.js').router;
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var server = require('http').createServer();

app.set('port', (process.env.PORT || 8080));

app.use(cookieParser());
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.on('request', app);

router(app);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
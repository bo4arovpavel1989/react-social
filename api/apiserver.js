var express = require('express');
var app = express();
var router = require('./router.js').router;
var cookieParser = require('cookie-parser');
var server = require('http').createServer();

app.set('port', (process.env.PORT || 8080));

app.use(cookieParser());

server.on('request', app);

router(app);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/react');
mongoose.Promise = global.Promise;

var models = {};

models.User = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, required: true},
	passwd: {type: String, required: true},
	session: {type: String, default: '0'}
});

models.Session = new mongoose.Schema({
	login: {type: String, required: true},
	session: {type: String, require: true},
	date: {type: Date, expires: 3600, default: Date.now}
});


models.User = mongoose.model('user', models.User);
models.Session = mongoose.model('session', models.Session);

module.exports = models;
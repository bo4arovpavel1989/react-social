var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/react');
mongoose.Promise = global.Promise;

var models = {};

models.User = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, required: true},
	emailUpperCase: {type: String, required: true},
	passwd: {type: String, required: true},
	session: {type: String, default: '0'}
});

models.Session = new mongoose.Schema({
	login: {type: String, required: true},
	token: {type: String, require: true}
});

models.Personal = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, required: true},
	emailUpperCase: {type: String, required: true},
	name:{type: String},
	birthDate:{type:Date},
	activity:{type:String}
});

models.User = mongoose.model('user', models.User);
models.Personal = mongoose.model('personal', models.Personal);
models.Session = mongoose.model('session', models.Session);

module.exports = models;
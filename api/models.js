var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/react');
mongoose.Promise = global.Promise;

var models = {};

models.User = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, required: true},
	emailUpperCase: {type: String, required: true},
	passwd: {type: String, required: true},
	session: {type: String, default: '0'},
	liked:{type:Array}
});

models.Session = new mongoose.Schema({
	login: {type: String, required: true},
	token: {type: String, require: true}
});

models.Personal = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, required: true},
	emailUpperCase: {type: String, required: true},
	name:{type: String, default:'Аноним'},
	birthDate:{type:Date},
	activity:{type:String},
	avatar:{type:String},
	thumbAvatar: {type:String},
	microAvatar: {type:String}
});

models.Wall = new mongoose.Schema({
	id: {type: String, required: true}, //id of the walls owner
	date: {type:Date, default: Date.now()},
	entry: {type: String},
	author: {type: String}, //id of the post author
	like: {type:Number, default: 0},
	likers:{type:Array,default:[]}
});

models.Message =  new mongoose.Schema({
	from:{type:String, required:true},//from whom message
	to:{type:String, required:true},//to whom message
	message:{type:String, required:true},
	date:{type:Date},
	isSeenBy:{type:Array},
	isRead:{type:Boolean, default:false}
});

models.User = mongoose.model('user', models.User);
models.Personal = mongoose.model('personal', models.Personal);
models.Wall = mongoose.model('wall', models.Wall);
models.Session = mongoose.model('session', models.Session);
models.Message = mongoose.model('message', models.Message);

module.exports = models;
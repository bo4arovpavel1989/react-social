const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/react');
mongoose.Promise = global.Promise;

const models = {};

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
	id: {type: String, required: true}, // _id of User model document
	name:{type: String, default:'Аноним'},
	birthDate:{type:Date},
	activity:{type:String},
	avatar:{type:String},
	thumbAvatar: {type:String},
	microAvatar: {type:String}
});

models.Wall = new mongoose.Schema({
	id: {type: String, required: true}, // Id of the walls owner
	date: {type:Date, default: Date.now()},
	entry: {type: String},
	author: {type: String}, // Id of the post author
	like: {type:Number, default: 0},
	likers:{type:Array,default:[]}
});

models.Message = new mongoose.Schema({
	from:{type:String, required:true},// From whom message
	to:{type:String, required:true},// To whom message
	message:{type:String, required:true},
	date:{type:Date},
	isSeenBy:{type:Array},
	isRead:{type:Boolean, default:false}
});

models.BlackList = new mongoose.Schema({
	id: {type: String, required: true}, // _id of User model document - blacklist owner
	list:{type:Array, default:[]}
});

models.Contact = new mongoose.Schema({
	id:{type:String, required:true},// Contacts owner _id of User model document
	person:{type:String, required:true},// Id of the contact person
	rate:{type:Number, default:0}
});

models.Options = new mongoose.Schema({
	id: {type: String, required: true}, // _id of User model document
	amIVisible: {type: Boolean, default:true},
	isWallOpened: {type: Boolean, default:true}
});

models.User = mongoose.model('user', models.User);
models.Personal = mongoose.model('personal', models.Personal);
models.Wall = mongoose.model('wall', models.Wall);
models.Session = mongoose.model('session', models.Session);
models.Message = mongoose.model('message', models.Message);
models.BlackList = mongoose.model('blacklist', models.BlackList);
models.Contact = mongoose.model('contact', models.Contact);
models.Options = mongoose.model('options', models.Options);

module.exports = models;

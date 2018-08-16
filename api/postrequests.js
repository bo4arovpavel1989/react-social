const async = require('async');
const formidable = require('formidable');
const fs = require('fs-extra');
const _ = require('lodash');

const authService = require('./customfunctions.js').authService;
const saveAvatar = require('./customfunctions.js').saveAvatar;
const db = require('./dbqueries');

module.exports.login = function(req,res){
	let cred = req.body;
	
	authService.login(cred)
		.then(rep=>{
			if(rep.auth) 
				return Promise.all([rep, db.update('Session', {login:cred.login},{token:rep.token},{upsert:true})])
			else
				return Promise.resolve([{auth:false}]) //made array coz i use array in first case if rep.auth === true
		})
		.then(reps=>res.json(reps[0]))
		.catch(err=>{
			res.status(500).json({err:err})
		})
}

module.exports.logoff = function(req, res){
	let cred = req.body;
	
	authService.logoff(cred)
		.then(rep=>{
			res.end();
		})
		.catch(err=>{
			res.end();
		})
}

module.exports.checkValidity = function(req, res){
	let val = req.body.val,
		inp = req.body.inp,
		query = {},
		validity = {};
		
	query[`${inp}UpperCase`] = val.toUpperCase();
	
	db.find('User', query)
		.then(rep=>{
			validity[`${inp}Valid`] = (rep.length === 0);
			res.json(validity);
			
		})
		.catch(err=>res.json({err}))
}

module.exports.register = function(req, res){
	let data = req.body;
	
	data.loginUpperCase = data.login.toUpperCase();
	data.emailUpperCase = data.email.toUpperCase();
	
	async.parallel([
		(cb)=>{
			db.create('User', data)
				.then(rep=>cb())
				.catch(err=>cb(new Error('An error occured creating user')));
		},
		(cb)=>{
			db.create('Personal', data)
				.then(rep=>cb())
				.catch(err=>cb(new Error('An error occured creating user')));
			
		}
		],(err)=>{
			if(!err) res.json({success:true});
			else res.status(500).json({success:false});
	});

		
}

module.exports.checkToken = function(req, res){
	let data = req.body;
	
	authService.checkToken(data)
				.then(rep=>{
					res.json({auth:rep})
				})
				.catch(err=>{
					res.status(500).json({err:'Internal server error!'})
				})
}

module.exports.makePost = function(req, res){
	let post = {};
		post.author = req.body.id;
		post.id = req.body.person;
		post.entry = req.body.post;
		post.date = Date.now();
	db.create('Wall', post)
		.then(rep=>res.json({success:true}))
		.catch(err=>res.status(500).json({err}))
};

module.exports.editPerson = function(req, res){
	let login = req.body.login;
	let data = req.body;
	
	db.update('Personal', {login},{$set:data})
		.then(rep=>res.json({success:true}))
		.catch(err=>res.status(500).end())
}

module.exports.avatarUpload = function(req, res){
	let files = req.files;	
	let fields = req.fields;
	if (!_.isEmpty(files)){
		
		let thumbFileName = __dirname + '/../public/images/personal/' + fields.id + '_thumb.jpg';
		let microThumbFileName = __dirname + '/../public/images/personal/' + fields.id + '_micro_thumb.jpg';
		let fileName = __dirname + '/../public/images/personal/' + fields.id + '.jpg';
		let avatar = '/images/personal/' + fields.id + '.jpg';
		let thumbAvatar = '/images/personal/' + fields.id + '_thumb.jpg';
		let microAvatar = '/images/personal/' + fields.id + '_micro_thumb.jpg';
		
		saveAvatar(files,fileName,thumbFileName,microThumbFileName)
				.then((rep)=>{
					db.update('Personal',{login:fields.login},{$set:{avatar,thumbAvatar,microAvatar}})
						.then(()=>res.json({success:true}))
						.catch(err=>res.json({err:err}))
				})
				.catch(err=>res.status(500).json({err:err}))
		
	} else {
		res.json({empty:true});
	}
	
};

module.exports.sendMessage = function(req, res){
	let {message, person, id} = req.body; //person - to whom, id - from whom;
	let data = {message, person, id, date:Date.now()};
	
	db.create('Message', data)
		.then(rep=>res.json({success:true}))
		.catch(err=>res.status(500).json({err}))
};
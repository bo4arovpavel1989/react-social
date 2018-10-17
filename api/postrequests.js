const async = require('async');
const _ = require('lodash');

const {authService, saveAvatar, checkBan} = require('./customfunctions.js');
const db = require('./dbqueries');

module.exports.login = function(req,res){
	const cred = req.body;

	authService.login(cred)
		.then(rep=>{
			if(rep.auth)
				return Promise.all([
					rep,
					db.update('Session', {login:cred.login},{token:rep.token},{upsert:true})
				])

			return Promise.resolve([{auth:false}]) // Made array coz i use array in first case if rep.auth === true
		})
		.then(reps=>res.json(reps[0]))
		.catch(err=>{
			res.status(500).json({err})
		})
}

module.exports.logoff = function(req, res){
	const cred = req.body;

	authService.logoff(cred)
		.then(rep=>{
			res.end();
		})
		.catch(err=>{
			res.end();
		})
}

module.exports.checkValidity = function(req, res){
	let {val, inp} = req.body,
		query = {},
		validity = {};

	query[`${inp}UpperCase`] = val.toUpperCase();

	db.find('User', query)
		.then(rep=>{
			validity[`${inp}Valid`] = rep.length === 0;
			res.json(validity);
		})
		.catch(err=>res.json({err}))
}

module.exports.register = function(req, res){
	const data = req.body;
	const {login} = data;

	data.loginUpperCase = data.login.toUpperCase();
	data.emailUpperCase = data.email.toUpperCase();

	async.waterfall([
		cb=>{
			db.create('User', data)
				.then(()=>cb())
				.catch(err=>cb(new Error('An error occured creating user')));
		},
		cb=>{
			db.findOne('User', {login}, '_id')
				.then(rep=>cb(null, rep._id))
				.catch(err=>cb(new Error('An error occured finding new user')));
		},
		(id, cb)=>{
			db.create('Personal',{id})
				.then(rep=>cb(null, id))
				.catch(err=>cb(new Error('An error occured creating personal data collection')));

		},
		(id, cb)=>{
			db.create('Options', {id})
				.then(rep=>cb())
				.catch(err=>cb(new Error('An error occured creating options collection')));

		}
		],err=>{
			if(!err) res.json({success: true});
			else res.status(500).json({success: false});
	});


}

module.exports.checkToken = function(req, res){
	const data = req.body;

	authService.checkToken(data)
				.then(rep=>{
					res.json({auth: rep})
				})
				.catch(err=>{
					res.status(500).json({err:'Internal server error!'})
				})
}

module.exports.makePost = function(req, res){
	const post = {};

		post.author = req.body.id;
		post.id = req.body.owner;
		post.entry = req.body.post;
		post.date = Date.now();

	checkBan(post.author, post.id)
		.then(rep=>{
			if(!rep) // If author is not banned
				return db.create('Wall', post)

				return Promise.resolve(false)
		})
		.then(rep=>res.json({success: rep}))
		.catch(err=>res.status(500).json({err}))
};

module.exports.editPerson = function(req, res){
	const {id} = req.body;
	const data = req.body;

	db.update('Personal', {id}, {$set:data})
		.then(rep=>res.json({success:true}))
		.catch(err=>res.status(500).end())
}

module.exports.avatarUpload = function(req, res){
	const files = req.files;
	const fields = req.fields;

	if (!_.isEmpty(files)){

		const thumbFileName = `${__dirname}/../public/images/personal/${fields.id}_thumb.jpg`;
		const microThumbFileName = `${__dirname}/../public/images/personal/${fields.id}_micro_thumb.jpg`;
		const fileName = `${__dirname}/../public/images/personal/${fields.id}.jpg`;
		const avatar = `/images/personal/${fields.id}.jpg`;
		const thumbAvatar = `/images/personal/${fields.id}_thumb.jpg`;
		const microAvatar = `/images/personal/${fields.id}_micro_thumb.jpg`;

		saveAvatar(files,fileName,thumbFileName,microThumbFileName)
				.then(rep=>{
					db.update('Personal',{id:fields.id},{$set:{avatar,thumbAvatar,microAvatar}})
						.then(()=>res.json({success:true}))
						.catch(err=>res.json({err}))
				})
				.catch(err=>res.status(500).json({err}))

	} else {
		res.json({empty:true});
	}

};

module.exports.sendMessage = function(req, res){
	const {message, person, id} = req.body; // Person - to whom, id - from whom;
	const data = {message, to:person, from:id, date:Date.now(), isSeenBy:[
			id,
			person
	]};

	checkBan(id, person)
		.then(rep=>{
			if(!rep) // If user is not banned
				return db.create('Message', data)

				return Promise.resolve(false)
		})
		.then(rep=>res.json({success: rep}))
		.catch(err=>res.status(500).json({err}))

};

module.exports.changeSettings = function(req, res){
	const {login} = req.body;

	console.log(req.body);
	db.update('Options', {login}, {$set: req.body})
		.then(rep=>res.json({success:true}))
		.catch(err=>res.status(500).end())
};

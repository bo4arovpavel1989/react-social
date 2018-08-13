const async = require('async');

const db = require('./dbqueries');

module.exports.getPerson = function(req, res){
	let id = req.params.id;
	
	async.waterfall([
		(cb)=>{
			db.findOne('User',{_id:id})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		(login, cb)=>{
			db.findOne('Personal',{login})
				.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))
			
		}
		],(err, rep)=>{
			if(!err) res.json(rep)
			else res.status(500).json({err})	
	});
	
}

module.exports.getWall = function(req, res){
	let id = req.params.id;
	let skip = Number(req.query.q); //skip value must be numeric
	const howmany = 10; //number if wall twits got per 1 time
	
	async.waterfall([
		(cb)=>{
			db.findOne('User',{_id:id})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		(login, cb)=>{
			db.findBy('Wall', {id}, {date:-1}, skip, howmany)
				.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))
			
		}
		],(err, rep)=>{
			if(!err) res.json(rep)
			else res.status(500).json({err})	
	})
	
};

module.exports.getPostPersonData = function(req, res){
	let id = req.params.id;
	console.log(id)
	async.waterfall([
		(cb)=>{
			db.findOne('User',{_id:id})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		(login, cb)=>{
			db.findOne('Personal',{login}, 'name microAvatar')
				.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))
			
		}
		],(err, rep)=>{
			console.log(rep)
			if(!err) res.json(rep)
			else res.status(500).json({err})	
	});
};
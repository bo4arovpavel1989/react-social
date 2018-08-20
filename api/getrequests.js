const async = require('async');

const db = require('./dbqueries');
const handleLike = require('./customfunctions.js').handleLike;
const markMessagesSeen = require('./customfunctions.js').markMessagesSeen;

const cacheData = {
	postPersonData : {}
}


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
	let liker = req.headers.id; //id of the wall viewer
	let id = req.params.id;//id of the wall owner
	
	let skip = Number(req.query.q); //skip value must be numeric
	const howmany = 10; //number of wall twits got per 1 time
	
	let posts = [];
	let likedPosts = [];
	
	async.parallel([
		(cb)=>{
			db.findBy('Wall', {id}, {date:-1}, skip, howmany, 'author like entry date') //find wall posts by the id of the wall owner
				.then(rep=>{
					posts = rep;
					cb();
				})
				.catch(err=>cb(err, null))
			
		},
		(cb)=>{
			db.find('Wall', {id, likers:{$in:[liker]}}) //find wall posts by the id of the wall owner and likes of wall viewer
				.then(rep=>{
					if(rep)
						rep.map((r,i) => {
							likedPosts.push(r._id);
						});
						
					cb();
				})
				.catch(err=>cb(err, null))
			
		}
		],(err)=>{
			let sendData = {posts, likedPosts}
			
			if(!err) res.json(sendData)
			else res.status(500).json({err})	
	})
	
};

module.exports.getPostPersonData = function(req, res){
	let id = req.params.id;
	
	if(cacheData.postPersonData[id]) {
		process.nextTick(()=>res.json(cacheData.postPersonData[id]))
		
	} else {
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
				if(!err) {
					cacheData.postPersonData[id] = rep;
					res.json(rep)
				}	
				else res.status(500).json({err})	
	});
	
	}
};

module.exports.likePost = function(req, res){
	let liker = req.headers.id;
	let _id = req.params.id;
	
	db.findOne('Wall', {_id, likers:{$in:[liker]}})
		.then(rep=>{
			console.log(rep);
			handleLike(rep, _id, liker);
			if(!rep)
				res.json({newLike:true});
			else
				res.json({newLike:false})
		})
		.catch(err=>res.status(500).json({err}))
};

module.exports.getMessages = function(req, res){
	let me = req.headers.id; //messages to whom and from whom
	let box = req.params.box;
	
	let skip = Number(req.query.q); //skip value must be numeric
	const howmany = 10; //number of messages got per 1 time
	
	let query = (box === 'in' ? {to:me} : {from:me}) //changes query if it
		
	db.findBy('Message', query, {date:-1}, skip, howmany)
			.then(rep=>{
				if(box === 'in')
					markMessagesSeen(rep);
				res.json({messages:rep});
			})
		.catch(err=>res.status(500).json({err}))
};
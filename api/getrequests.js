const async = require('async');

const db = require('./dbqueries');
const {handleLike, markMessagesSeen, checkBan} = require('./customfunctions.js');

module.exports.getPerson = function(req, res){
	const me = req.headers.id; // Id of me
	const person = req.params.id; // Id of the page owner
	const myPage = me === person;

	async.waterfall([
		cb=>{
			db.findOne('User',{_id:person})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		//Check if person made his page invisible or its my page
		(login, cb)=>{
			db.findOne('Options',{login})
				.then(rep=>{
					rep.amIVisible || myPage ?
						cb(null, login)					:
						cb(new Error('invisible'))
				})
				.catch(err=>cb(err, null))

		},
		// Get personal data by login
		(login, cb)=>{
			db.findOne('Personal',{login}, 'name birthDate activity thumbAvatar')
				.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))

		},
		// Check if this person in my contacts list
		(personData, cb)=>{
			db.findOne('Contact', {me, person})
				.then(rep=>{
					if(rep)
						personData.isContact = true;

					cb(null, personData)
				})
				.catch(err=>cb(err, null))

		},
		// Check if person is in my blacklist
		(personData, cb)=>{
			db.findOne('BlackList', {person: me, list: {$in: [person]}})
				.then(rep=>{
					if(rep)
						personData.isBanned = true;

					cb(null, personData)
				})
				.catch(err=>cb(err, null))

		}
		],(err, rep)=>{
			if(!err) res.json(rep)
			else if (err.message === 'invisible') res.json({invisible:true})
			else res.status(500).json({err})
	});

}

module.exports.getWall = function(req, res){
	const liker = req.headers.id; // Id of the wall viewer
	const id = req.params.id;// Id of the wall owner

	const howmany = 10; // Number of wall twits got per 1 time
	const skip = Number(req.query.q) * howmany; // Skip value must be numeric

	let posts = [];
	const likedPosts = [];

	async.parallel([
		cb=>{
			db.findBy('Wall', {id}, {date: -1}, skip, howmany, 'author like entry date') // Find wall posts by the id of the wall owner
				.then(rep=>{
					posts = rep;
					cb();
				})
				.catch(err=>cb(err, null))

		},
		cb=>{
			db.find('Wall', {id, likers:{$in:[liker]}}) // Find wall posts by the id of the wall owner and likes of wall viewer
				.then(rep=>{
					if(rep)
						rep.map((r,i)=>{
							likedPosts.push(r._id);
						});

					cb();
				})
				.catch(err=>cb(err, null))

		}
		],err=>{
			const sendData = {posts, likedPosts}

			if(!err) res.json(sendData)
			else res.status(500).json({err})
	})

};

module.exports.getPostPersonData = function(req, res){
	const me = req.headers.id;
	const id = req.params.id;

	async.waterfall([
		cb=>{
			db.findOne('User',{_id: id})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		(login, cb)=>{
			db.findOne('Personal',{login}, 'name microAvatar')
					.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))

		},
		(data, cb)=>{
			db.findOne('BlackList',{person: me, list: {$in: [id]}})
				.then(rep=>{
					if(rep)
						data.isBanned = true;
						cb(null, data)
				})
				.catch(err=>cb(err, null))

		}
		],(err, rep)=>{
			if(!err) 	res.json(rep)
			else res.status(500).json({err})
	});

};

module.exports.likePost = function(req, res){
	const liker = req.headers.id;
	const _id = req.params.id;

	db.findOne('Wall', {_id, likers:{$in: [liker]}})
		.then(rep=>{
			handleLike(rep, _id, liker);
			if(!rep)
				res.json({newLike: true});
			else
				res.json({newLike: false})
		})
		.catch(err=>res.status(500).json({err}))
};

module.exports.getMessages = function(req, res){
	const me = req.headers.id; // Messages to whom and from whom
	const box = req.params.box;

	const howmany = 10; // Number of messages got per 1 time
	const skip = Number(req.query.page) * howmany; // Skip value must be numeric

	const query = box === 'in' ? {to:me, isSeenBy: {$in: [me]}} : {from:me, isSeenBy: {$in: [me]}} // Changes query if its inbox or outbox

	db.findBy('Message', query, {date:-1}, skip, howmany)
			.then(rep=>{
				if(box === 'in')
					markMessagesSeen(rep);
				res.json({messages:rep});
			})
		.catch(err=>res.status(500).json({err}))
};

module.exports.getContacts = function(req, res){
	const me = req.headers.id;
	const howmany = 10; // Number of contacts got per 1 time
	const skip = Number(req.query.q) * howmany;

	db.findBy('Contact', {me}, {rate: -1}, skip, howmany)
		.then(rep=>res.json({contacts: rep}))
		.catch(err=>res.status(500).json({err}))

};

module.exports.addContacts = function(req, res){
	const me = req.headers.id;
	const person = req.query.p;

	db.findOne('Contact', {me, person})
		.then(rep=>{
			if(!rep)
				db.create('Contact', {me, person})
			else
				db.del('Contact', {me, person})

			res.json({success:true})
		})
		.catch(err=>res.status(500).json({err}))
};

module.exports.banUser = function(req, res){
	const me = req.headers.id;
	const person = req.query.p;

	db.findOne('BlackList', {person: me, list: {$in: [person]}})
		.then(rep=>{
			if(rep)
				db.update('BlackList', {person: me}, {$pull: {list: {$in: [person]}}})
			else
				db.update('BlackList', {person: me}, {$push: {list: person}}, {upsert: true})
		})
		.then(rep=>res.json({success: true}))
		.catch(err=>res.status(500).json({err}))

};

module.exports.checkBan = function(req, res){
	const me = req.headers.id;
	const person = req.params.id

	checkBan(me, person)
		.then(rep=>res.json({iAmBanned: rep}))
		.catch(err=>res.status(500).json({err}));

};

module.exports.getOptions = function(req, res){
	const me = req.headers.id;

	async.waterfall([
		cb=>{
			db.findOne('User',{_id: me})
				.then(rep=>cb(null, rep.login))
				.catch(err=>cb(err, null))
		},
		(login, cb)=>{
			db.findOne('Options',{login}, 'amIVisible -_id')
				.then(rep=>cb(null, rep))
				.catch(err=>cb(err, null))

		}
		],(err, rep)=>{
			if(!err) 	res.json(rep)
			else res.status(500).json({err})
	});
};

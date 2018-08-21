const checkPostRemove = require('./customfunctions.js').checkPostRemove;
const db = require('./dbqueries');

module.exports.removePost = function (req, res){
	let _id = req.params.id; //id of the walls post
	let remover = req.body.id; //id of the post remover;
	
	db.findOne('Wall', {_id})
		.then((rep)=>{
			if(rep)
				if(checkPostRemove(rep, remover))
					db.del('Wall', {_id})
			
			res.json({deleted:true});			
		})
		.catch(err=>{res.status(500).json({err})})
};

module.exports.removeMessage = function(req, res){
	let _id = req.params.id; //id of the walls post
	let remover = req.body.id; //id of the post remover;
	
	db.findOne('Message', { _id, $or: [ {from:remover}, {to:remover} ]  })
		.then((rep) => {
			if(rep)
				db.update('Message', {_id}, {$pull: {isSeenBy: {$in: [remover]}} })
			else
				res.json({success:false})
		})
		.then(rep => res.json({success:true}))
		.catch(err => res.status(500).json({err}))

};
const {checkPostRemove} = require('./customfunctions.js');
const db = require('./dbqueries');

module.exports.removePost = function (req, res){
	const _id = req.params.id; // Id of the walls post
	const remover = req.body.id; // Id of the post remover;

	db.findOne('Wall', {_id})
		.then(rep=>{
			if(rep)
				if(checkPostRemove(rep, remover))
					db.del('Wall', {_id})

			res.json({deleted:true});
		})
		.catch(err=>{
 			res.status(500).json({err})
		})
};

module.exports.removeMessage = function(req, res){
	const _id = req.params.id; // Id of the walls post
	const remover = req.body.id; // Id of the post remover;

	db.findOne('Message', {_id, $or: [
		{from:remover},
		{to:remover}
	]})
		.then(rep=>{
			if(rep)
				db.update('Message', {_id}, {$pull: {isSeenBy: {$in: [remover]}}})
			else
				res.json({success:false})
		})
		.then(()=>res.json({success:true}))
		.catch(err=>res.status(500).json({err}))

};

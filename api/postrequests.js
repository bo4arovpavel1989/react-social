const authService = require('./customfunctions.js').authService;
const db = require('./dbqueries');

module.exports.login = function(req,res){
	let cred = req.body;
	
	authService.login(cred)
		.then(rep=>{
			if(rep.auth) {
				db.update('Session', {login:cred.login},{token:rep.token},{upsert:true})
					.then(()=>{
						res.json({auth:true, res:rep.res,token:rep.token})
					})
					.catch(err=>{
						console.log(err);
						res.json({auth:false}) 
					})
			}	
			else
				res.json({auth:false}) 
		})
		.catch(err=>{
			res.json({auth:false})
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
			if(rep.length === 0) 
				validity[`${inp}Valid`] = true;
			else 
				validity[`${inp}Valid`] = false;
			
			res.json(validity);
			
		})
		.catch(err=>res.json({err}))
}

module.exports.register = function(req, res){
	let data = req.body;
	
	data.loginUpperCase = data.login.toUpperCase();
	data.emailUpperCase = data.email.toUpperCase();
		
	db.create('User', data)
		.then(rep=>res.json({success:true}))
		.catch(err=>res.json({success:false}));	
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

module.exports.getPerson = function(req, res){
	let id = req.params.id;
	
	db.findOne('User',{_id:id})
		.then(rep=>res.json({rep}))
		.catch(err=>res.json({err}))
}
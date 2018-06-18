const authService = require('./customfunctions.js').authService;
const db = require('./dbqueries');

module.exports.login = function(req,res){
	let cred = req.body;
	
	authService.login(cred)
		.then(rep=>{
			if(rep.auth) {
				console.log(rep.token)
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

module.exports.checkValidity = function(req, res){
	let val = req.body.val,
		inp = req.body.inp,
		query = {},
		validity = {};
		
	query[`${inp}UpperCase`] = val.toUpperCase();
	
	db.find('User', query,(err,rep)=>{
		
		if(rep.length === 0 && !err) 
			validity[`${inp}Valid`] = true;
		else 
			validity[`${inp}Valid`] = false;
		
		res.json(validity);
		
	})
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
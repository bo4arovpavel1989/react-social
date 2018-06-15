const authService = require('./customfunctions.js').authService;
const db = require('./dbqueries');

module.exports.login = function(req,res){
	let cred = req.body;
	
	authService.login(cred)
		.then(rep=>{
			if(rep.auth) {
				db.update('Session', {login:cred.login},{session:res.token},{upsert:true})
					.then(()=>{
						res.json({auth:true, res:rep.res,token:res.token})
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
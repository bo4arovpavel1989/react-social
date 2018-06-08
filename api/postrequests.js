const authService = require('./customfunctions.js').authService;
var db = require('./dbqueries');

module.exports.login = function(req,res){
	let cred = req.body;
	console.log(cred);
	authService.login(cred)
				.then(rep=>{
					if(rep.auth) res.json({auth:true, res:rep.res,token:res.token})
					else res.json({auth:false}) 
				})
				.catch(err=>{
					res.json({auth:false})
				})
}

module.exports.checkLogin = function(req, res){
	let login = req.body.login;
	db.find('User', {loginUpperCase:login.toUpperCase()},(err,rep)=>{
		console.log(rep);
		if(rep.length === 0 && !err) res.json({validLogin:true});
		else res.json({validLogin:false});
	})
}
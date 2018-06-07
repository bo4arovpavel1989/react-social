const authService = require('./customfunctions.js').authService;

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

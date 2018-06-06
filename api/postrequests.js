const authService = require('./customfunctions.js').authService;

module.exports.login = function(req,res){
	let cred = req.body;
	console.log(cred);
	authService.login(cred)
				.then(rep=>{
					if(rep) res.json({auth:true, token:'123'})
					else res.json({auth:false}) 
				})
				.catch(err=>{
					res.json({auth:false})
				})
}

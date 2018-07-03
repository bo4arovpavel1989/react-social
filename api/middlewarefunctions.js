const authService = require('./customfunctions').authService;

module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	
	authService.checkToken(req.body)
			.then(rep=>{
				if(rep)
					next();
				else 
					res.json({forbidden:true});
			})
			.catch(err=>res.json({err:true}))
};
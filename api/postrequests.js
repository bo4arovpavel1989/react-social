const authService = require('./customfunctions.js').authService;

module.exports.login = function(req,res){
	console.log(req.session)
	let cred = req.body;
	if(authService(cred))
		req.session.user = cred.login;
	console.log(req.session)
	res.json({'a':1});
}

module.exports.checkToken = function(req,res){
	let cred = req.body;
	if (cred.token === 'token1')
		res.json({checked:true})
	else 
		res.json({checked:false})
}
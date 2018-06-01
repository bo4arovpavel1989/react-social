module.exports.login = function(req,res){
	console.log(req.body);
	let cred = req.body;
	console.log(cred.login)
	res.json({token:'token',login:cred.login})
}

module.exports.checkToken = function(req,res){
	let cred = req.body;
	if (cred.token === 'token1')
		res.json({checked:true})
	else 
		res.json({checked:false})
}
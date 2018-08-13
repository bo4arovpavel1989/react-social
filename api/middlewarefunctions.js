const authService = require('./customfunctions').authService;
const formidable = require('formidable');

module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	console.log(req)
	authService.checkToken(req.headers)
			.then(rep=>{
				if(rep)
					next();
				else 
					res.json({forbidden:true});
			})
			.catch(err=>res.status(500).json({err:err}))
};

module.exports.checkFileAccess = function(req, res, next){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';
		
	form.parse(req, function(err, fields, files) {
		authService.checkToken(req.headers)
			.then(rep=>{
				if(rep) {
					req.fields = fields;
					req.files = files;
					next();
				}
				else 
					res.json({forbidden:true});
			})
			.catch(err=>res.status(500).json({err:err}))
			
	});
};
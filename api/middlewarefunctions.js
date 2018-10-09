const {authService, cacheMiddleware, checkAccessMiddleware} = require('./customfunctions');
const formidable = require('formidable');

module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	checkAccessMiddleware(req)
		.then(rep=>{
			if(rep)
				next();
			else
				res.json({forbidden:true});
		})
		.catch(err=>res.status(500).json({err}))
};

module.exports.checkAccessAndCash = function(req, res, next){
	const cacheDuration = 10;

	checkAccessMiddleware(req)
		.then(rep=>{
			if(rep)
				cacheMiddleware(cacheDuration, req, res, next);
			else
				res.json({forbidden:true});
		})
		.catch(err=>res.status(500).json({err}))
};

module.exports.checkFileAccess = function(req, res, next){
	const form = new formidable.IncomingForm();

	form.type = 'multipart/form-data';

	form.parse(req, (err, fields, files)=>{
		if(err)
			return res.status(500).json({err})

		authService.checkToken(fields)
			.then(rep=>{
				if(rep) {
					req.fields = fields;
					req.files = files;
					next();
				} else
					res.json({forbidden:true});
			})
			.catch(err=>res.status(500).json({err}))

	});
};

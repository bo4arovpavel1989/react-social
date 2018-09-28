const authService = require('./customfunctions').authService;
const formidable = require('formidable');
const cache = require('memory-cache');

let memCache = new cache.Cache();

let cacheMiddleware = (duration, req, res, next) => {
	let key =  '__express__' + req.originalUrl || req.url
	let cacheContent = memCache.get(key);

	if(cacheContent){
		res.json( cacheContent );
	} else {
		res.sendJSON= res.json;

		res.json = (body) => {
			memCache.put(key,body,duration*1000);
			res.sendJSON(body)
		}

		next();
	}
}

module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	let cred;

	if(req.headers.id)
		cred = req.headers;
	else
		cred = req.body;

	authService.checkToken(cred)
			.then(rep=>{
				if(rep)
					next();
				else
					res.json({forbidden:true});
			})
			.catch(err=>res.status(500).json({err:err}))
};

module.exports.checkAccessAndCash = function(req, res, next){
	let cred;

	if(req.headers.id)
		cred = req.headers;
	else
		cred = req.body;

	authService.checkToken(cred)
			.then(rep=>{
				if(rep)
					cacheMiddleware(5, req, res, next);
				else
					res.json({forbidden:true});
			})
			.catch(err=>res.status(500).json({err:err}))
};

module.exports.checkFileAccess = function(req, res, next){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';

	form.parse(req, function(err, fields, files) {
		authService.checkToken(fields)
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

var authService = require('./customfunctions').authService;

module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	next();
};
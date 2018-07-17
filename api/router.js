var postRequestsHandlers=require('./postrequests.js');

var getRequestsHandlers=require('./getrequests.js');

var deleteRequestsHandlers=require('./deleterequests.js');

var noMiddleware = require('./middlewarefunctions.js').noMiddleware;
var checkAccess = require('./middlewarefunctions.js').checkAccess;
var checkFileAccess = require('./middlewarefunctions.js').checkFileAccess;


var getRequests = [
	{
		url: '/login',
		middleware: noMiddleware,
		callback: postRequestsHandlers.login
	}
];

var postRequests = [
	{
		url: '/login',
		middleware: noMiddleware,
		callback: postRequestsHandlers.login
	},
	{
		url:'/logoff',
		middleware: noMiddleware,
		callback: postRequestsHandlers.logoff
	},
	{
		url: '/checkvalidity',
		middleware: noMiddleware,
		callback: postRequestsHandlers.checkValidity
	},
	{
		url: '/checktoken',
		middleware: noMiddleware,
		callback: postRequestsHandlers.checkToken
	},
	{
		url: '/register',
		middleware: noMiddleware,
		callback: postRequestsHandlers.register
	},
	{
		url: '/personal/:id',
		middleware: checkAccess,
		callback: postRequestsHandlers.getPerson
	},
	{
		url: '/getwall/:id',
		middleware: checkAccess,
		callback: postRequestsHandlers.getWall
	},
	{
		url:'/makepost',
		middleware: checkAccess,
		callback: postRequestsHandlers.makePost
		
	},
	{
		url: '/edit',
		middleware: checkAccess,
		callback: postRequestsHandlers.editPerson
	},
	{
		url: '/avatarupload',
		middleware: checkFileAccess,
		callback: postRequestsHandlers.avatarUpload
	}
];

var deleteRequests = [
	{
		url: '/admin/deletecategory',
		middleware: ()=>{},
		callback: ()=>{}
	}
];

var router = function (app) {
	getRequests.forEach(function(request){
		app.get(request.url, request.middleware, request.callback);
	});
	postRequests.forEach(function(request){
		app.post(request.url, request.middleware, request.callback)
	});
	deleteRequests.forEach(function(request){
		app.delete(request.url, request.middleware, request.callback)
	});
};

module.exports.router = router;
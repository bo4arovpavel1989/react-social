var postRequestsHandlers=require('./postrequests.js');

var getRequestsHandlers=require('./getrequests.js');

var deleteRequestsHandlers=require('./deleterequests.js');

var noMiddleware = require('./middlewarefunctions.js').noMiddleware;
var checkAccess = require('./middlewarefunctions.js').checkAccess;
var checkFileAccess = require('./middlewarefunctions.js').checkFileAccess;


var getRequests = [
	{
		url: '/getwall/:id',
		middleware: checkAccess,
		callback: getRequestsHandlers.getWall
	},
	{
		url: '/personal/:id',
		middleware: checkAccess,
		callback: getRequestsHandlers.getPerson
	},
	{
		url: '/post-personal/:id',
		middleware: checkAccess,
		callback: getRequestsHandlers.getPostPersonData
	},
	{
		url: '/like/:id',
		middleware: checkAccess,
		callback: getRequestsHandlers.likePost
	},
	{
		url:'/getmessages/:box',
		middleware: checkAccess,
		callback: getRequestsHandlers.getMessages
	},
	{
		url:'/contacts',
		middleware: checkAccess,
		callback: getRequestsHandlers.getContacts
	},
	{
		url:'/addtocontact',
		middleware: checkAccess,
		callback: getRequestsHandlers.addContacts
	},
	{
		url:'/banuser',
		middleware: checkAccess,
		callback: getRequestsHandlers.banUser
	},
	{
		url:'/checkban/:id',
		middleware: checkAccess,
		callback: getRequestsHandlers.checkBan
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
	},
	{
		url:'/sendmessage',
		middleware: checkAccess,
		callback: postRequestsHandlers.sendMessage
	}
];

var deleteRequests = [
	{
		url: '/removepost/:id',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.removePost
	},
	{
		url: '/removemessage/:id',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.removeMessage
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
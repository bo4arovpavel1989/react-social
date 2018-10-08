const postRequestsHandlers=require('./postrequests.js');

const getRequestsHandlers=require('./getrequests.js');

const deleteRequestsHandlers=require('./deleterequests.js');

const noMiddleware = require('./middlewarefunctions.js').noMiddleware;
const checkAccess = require('./middlewarefunctions.js').checkAccess;
const checkFileAccess = require('./middlewarefunctions.js').checkFileAccess;
const checkAccessAndCash = require('./middlewarefunctions.js').checkAccessAndCash;


const getRequests = [
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
		middleware: checkAccessAndCash,
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
		url:'/getoptions',
		middleware: checkAccess,
		callback: getRequestsHandlers.getOptions
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

const postRequests = [
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
		url: '/changesettings',
		middleware: checkAccess,
		callback: postRequestsHandlers.changeSettings
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

const deleteRequests = [
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

const router = function (app) {
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

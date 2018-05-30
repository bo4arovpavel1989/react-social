var postRequestsHandlers=require('./postrequests.js');

var getRequestsHandlers=require('./getrequests.js');

var deleteRequestsHandlers=require('./deleterequests.js');

var noMiddleware = require('./middlewarefunctions.js').noMiddleware;


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
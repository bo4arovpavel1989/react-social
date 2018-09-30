const db = require('./dbqueries')
const jwt = require('jsonwebtoken');
const secret = require('./credentials');
const async = require('async');
const fs = require('fs-extra');
const easyimg = require('easyimage');
const cache = require('memory-cache');
let memCache = new cache.Cache();

const authService = {
	login:function(cred){
		return new Promise((resolve, reject)=>{

			db.findOne('User',{loginUpperCase:cred.login.toUpperCase(),passwd:cred.passwd})
				.then(res=>{
					if(!res) resolve({auth:false,res:null});
					else  resolve({auth:true, id:res._id, login: res.login, token:setToken(res)});
				})
				.catch(err=>{
					reject(err);
				})

		})

	},
	checkToken:function(data){
		return new Promise((resolve, reject)=>{

			db.findOne('Session', {login:data.login,token:data.token})
				.then(rep=>{
					if(rep) resolve(true);
					else resolve (false);
				})
				.catch(err=>reject(err))

		})
	},
	logoff:function(data){
		return new Promise((resolve, reject)=>{

			db.del('Session',data)
				.then(rep=>resolve(rep))
				.catch(err=>reject(err))

		});
	}
}

module.exports.authService = authService;

function setToken(res){
	return jwt.sign({login:res.login, pass:res.passwd, email:res.email, date:new Date()}, secret.secret);
}


module.exports.cacheMiddleware = function (duration, req, res, next) {
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

module.exports.checkAccessMiddleware = function (req) {
	let cred;

	if(req.headers.id)
		cred = req.headers;
	else
		cred = req.body;

	return new Promise((resolve, reject) => {
		authService.checkToken(cred)
				.then( rep => resolve(rep) )
				.catch( err => reject(err) )
	})
}

module.exports.saveAvatar = function(files,filename,dst,dst2){
	return new Promise((resolve, reject)=>{

		async.series([
			(cb)=>{
				makeResize(files,dst,200,200,(err,rep)=>{
					if(err) cb(new Error(err))
					else cb();
				})
			},
			(cb)=>{
				makeResize(files,dst2,50,50,(err,rep)=>{
					if(err) cb(new Error(err))
					else cb();
				})
			},
			(cb)=>{
				fs.copy(files.file.path,filename,(err,rep)=>{ //made copy coz its saved on different devices
					if(err) cb(new Error(err));
					else cb();
				})
			},
			(cb)=>{
				fs.unlink(files.file.path, (err)=>{
					if(err) cb(new Error(err));
					else cb();
				});
			}
			],(err)=>{
				if(err) reject(err);
				else resolve(true);
		});

	});
}

function makeResize(files,dst,w,h,cb){
	easyimg.resize({src: files.file.path, dst: dst, width:w, h}, function(err, stdout, stderr) {
			if (err)
				fs.unlink(files.file.path, (err)=>cb('Error loading avatar', false));
		}).then(
				(img) => cb(null, true),
				(err) => fs.unlink(files.file.path, err=>cb('Error resizing, source delete', false))
		);
}

module.exports.handleLike = function(rep, _id, liker){
	if(!rep)
		db.update('Wall', {_id}, {$push: {likers: liker}, $inc:{like:1}});
	else
		db.update('Wall', {_id}, {$pull: {likers: {$in: [liker]}}, $inc:{like:-1}});
}

module.exports.checkPostRemove = function(rep, remover){
	console.log ((rep.author === remover) || (rep.id === remover));
	return ((rep.author === remover) || (rep.id === remover)); //check if its wall owner or post author;
}

module.exports.markMessagesSeen = function(rep){
	rep.map(m => {
		if (!m.isRead)
			db.update('Message', {_id: m._id}, {$set:{isRead:true}})
	});
};

module.exports.checkBan = function(me, person){

	return new Promise((resolve, reject) => {
		db.findOne('BlackList', {person, list: {$in: [me]}}) //check if i was banned by person
			.then(rep => resolve(rep !== null) ) //returns true if user is banned
			.catch(err => reject(err))
	});

}

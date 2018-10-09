const db = require('./dbqueries')
const jwt = require('jsonwebtoken');
const secret = require('./credentials');
const async = require('async');
const fs = require('fs-extra');
const easyimg = require('easyimage');
const cache = require('memory-cache');
const memCache = new cache.Cache();

/**
 * Return JSON web token, based on response object
 * @param {object} res The response object.
 * @returns {string} The JSON web token generated on response data
 */
const setToken = res=>jwt.sign({login:res.login, pass:res.passwd, email:res.email, date:new Date()}, secret.secret);

const authService = {
	login(cred){
		return new Promise((resolve, reject)=>{

			db.findOne('User',{loginUpperCase:cred.login.toUpperCase(),passwd:cred.passwd})
				.then(res=>{
					if(!res) resolve({auth:false,res:null});
					else resolve({auth:true, id:res._id, login: res.login, token:setToken(res)});
				})
				.catch(err=>{
					reject(err);
				})

		})

	},
	checkToken(data){
		return new Promise((resolve, reject)=>{

			db.findOne('Session', {login:data.login,token:data.token})
				.then(rep=>{
					if(rep) resolve(true);
					else resolve(false);
				})
				.catch(err=>reject(err))

		})
	},
	logoff(data){
		return new Promise((resolve, reject)=>{

			db.del('Session',data)
				.then(rep=>resolve(rep))
				.catch(err=>reject(err))

		});
	}
}

module.exports.authService = authService;

/**
 * Function that contains logick for cache in middleware function
 * @param {number} duration - duration of data to be cached in seconds
 * @param {object} req - request Object
 * @param {object} res - response object
 * @param {object} next - next middleware object
 * @returns {void}
 */
module.exports.cacheMiddleware = function (duration, req, res, next) {
	const key = `__express__${req.originalUrl}` || req.url;
	const cacheContent = memCache.get(key);
	const second = 1000;

	if(cacheContent){
		res.json(cacheContent);
	} else {
		res.sendJSON= res.json;

		res.json = body=>{
			memCache.put(key,body,duration*second);
			res.sendJSON(body)
		}

		next();
	}
}

/**
 * Function that contains mutual logick for checkAccess middlewares
 * @param {object} req - request object
 * @returns {Promise} Promise object represents if access is granted
 */
module.exports.checkAccessMiddleware = function (req) {
	const cred = req.headers.id ? req.headers : req.body;

	return new Promise((resolve, reject)=>{
		authService.checkToken(cred)
				.then(rep=>resolve(rep))
				.catch(err=>reject(err))
	})
}

/**
 * Resizes image and delete source image
 * @param {object} files The image object
 * @param {string} dst the image destination pathname
 * @param {number} w the image width to resize
 * @param {number} h the image height to resize
 * @param {requestCallback} cb - The callback that handles the response.
 * @returns {void}
 */
const makeResize = (files,dst,w,h,cb)=>{
	easyimg.resize({src: files.file.path, dst, width:w, h}, err=>{
			if (err)
				fs.unlink(files.file.path, ()=>cb('Error loading avatar', false));
	})
		.then(()=>cb(null, true))
		.catch(()=>fs.unlink(files.file.path, ()=>cb('Error resizing, source delete', false)))
}

/**
 * Function that saves avatar from source image in two images different sized
 * and the deletes source file
 * @param {object} files - object of source file image
 * @param {string} filename - filename of the source image
 * @param {string} dst - pathname for 200x200 size image
 * @param {string} dst2 - pathname for 50x50 size image
 * @returns {Promise} - Promise object represents if oeration success
 */
module.exports.saveAvatar = function(files,filename,dst,dst2){
	const mainSize = 200,
		thumbSize = 50;

	return new Promise((resolve, reject)=>{

		async.series([
			cb=>{
				makeResize(files,dst,mainSize,mainSize, err=>{
					if(err) cb(new Error(err))
					else cb();
				})
			},
			cb=>{
				makeResize(files,dst2,thumbSize,thumbSize, err=>{
					if(err) cb(new Error(err))
					else cb();
				})
			},
			cb=>{
				// Made copy coz if its saved on different drives
				fs.copy(files.file.path,filename, err=>{
					if(err) cb(new Error(err));
					else cb();
				})
			},
			cb=>{
				fs.unlink(files.file.path, err=>{
					if(err) cb(new Error(err));
					else cb();
				});
			}
			],err=>{
				if(err) reject(err);
				else resolve(true);
		});

	});
}

/**
 * Function that handles like action. So it increment like by 1 if user
 * hasnt liked it or decrement by 1 if he has liked it before
 * @param {object} rep - wallPost data from db
 * @param {string} _id - id of the wall post
 * @param {string} liker - id of the post liker
 * @returns {void}
 */
module.exports.handleLike = function(rep, _id, liker){
	if(!rep)
		db.update('Wall', {_id}, {$push: {likers: liker}, $inc:{like:1}});
	else
		db.update('Wall', {_id}, {$pull: {likers: {$in: [liker]}}, $inc:{like:-1}});
}

/**
 * Function that checks if its wall owner or post author,
 * so he has rights to delete the post
 * @param {object} rep - postData object from db
 * @param {string} remover - id of the post remover
 * @returns {boolean} Represents if user has rights to delete post
 */
module.exports.checkPostRemove = function(rep, remover){
	console.log(rep.author === remover || rep.id === remover);

	return rep.author === remover || rep.id === remover;
}

/**
 * Function that marks message as seen message
 * @param {array} rep - array of messages
 * @returns {void}
 */
module.exports.markMessagesSeen = function(rep){
	rep.map(m=>{
		if (!m.isRead)
			db.update('Message', {_id: m._id}, {$set:{isRead:true}})
	});
};

/**
 * Function checks if user is banned by a person
 * @param {string} me - user id
 * @param {string} person - id of the person
 * @returns {Promise} returns true if user is banned by the person
 */
module.exports.checkBan = function(me, person){

	return new Promise((resolve, reject)=>{
		db.findOne('BlackList', {person, list: {$in: [me]}})
			.then(rep=>resolve(rep !== null))
			.catch(err=>reject(err))
	});

}

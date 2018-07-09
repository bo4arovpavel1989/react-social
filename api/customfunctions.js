const db = require('./dbqueries')
const jwt = require('jsonwebtoken');
const secret = require('./credentials');
const async = require('async');
const fs = require('fs-extra');

module.exports.authService = {
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

function setToken(res){
	return jwt.sign({login:res.login, pass:res.passwd, email:res.email, date:new Date()}, secret.secret);
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
				fs.rename(files.file.path,filename,(err,rep)=>{
					if(err) cb(new Error(err));
					else cb();
				})
			}
			],(err)=>{
				console.log(err)
				if(err) reject(err);
				else resolve(true);
		});

	});
}

function makeResize(files,dst,w,h,cb){
	easyimg.resize({src: files.file.path, dst: dst, width:w, heighth}, function(err, stdout, stderr) {
			if (err) 
				fs.unlink(files.file.path, (err)=>cb('Error loading avatar', false));
		}).then(
				(img) => cb(null, true),
				(err) => fs.unlink(files.file.path, err=>cb('Error resizing, source delete', false))
		); 	
}


const db = require('./dbqueries')
const jwt = require('jsonwebtoken');
const secret = require('./credentials');

module.exports.authService = {
	login:function(cred){
		return new Promise((resolve, reject)=>{
			
			db.findOne('User',{loginUpperCase:cred.login.toUpperCase()})
				.then(res=>{
					if(!res) resolve({auth:false,res:null});
					else  resolve({auth:cred.passwd === res.passwd,res:res, token:setToken(res)});
				})
				.catch(err=>{
					reject(err);
				})
				
		})
		
	},
	checkToken:function(data){
		return new Promise((resolve, reject)=>{
			
			db.findOne('Session', data)
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
	return jwt.sign({login:res.login, email:res.email, date:new Date()}, secret.secret);
}



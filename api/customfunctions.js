const db = require('./dbqueries')
const jwt = require('jsonwebtoken');
const secret = require('./credentials');

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



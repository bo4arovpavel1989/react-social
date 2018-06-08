var db = require('./dbqueries')
var jwt = require('jsonwebtoken');

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
	checkToken:function(){
		
	},
	logout:function(){
		
	}
}

function setToken(res){
	return jwt.sign({login:res.login, email:res.email}, res.secret);
}



var db = require('./dbqueries')

module.exports.authService = {
	login:function(cred){
		return new Promise((resolve, reject)=>{
			db.findOne('User',{loginUpperCase:cred.login.toUpperCase()}, 'passwd')
				.then(res=>{
					if(!res) resolve(false);
					else resolve(cred.passwd === res.passwd);
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



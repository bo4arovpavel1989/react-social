var models = require('./models')
console.log(models)

var dbQueries = {
	find: function(schema, val, opt){
		return new Promise((resolve, reject)=>{
			models[schema].find(val, opt, (err, rep)=>{
				if(err) reject(err)
				else resolve(rep);	
			});
		});
	},
	findOne: function(schema, val, opt){
		return new Promise((resolve, reject)=>{
			models[schema].findOne(val, opt, (err, rep)=>{
				if(err) reject(err)
				else resolve(rep);	
			})
		});
	},
	update: function(schema, get, set, opt){
		return new Promise((resolve, reject)=>{
			models[schema].update(get, set, opt).exec((err, rep)=>{
				if(err) reject(err)
				else resolve(rep);	
			})
		});
	},
	del:  function(schema, val, opt){
		return new Promise((resolve, reject)=>{
			models[schema].find(val).remove().exec((err, rep)=>{
				if(err) reject(err)
				else resolve(rep);	
			})
		});
	},
	create: function(schema, val, opt){
		return new models[schema](val).save();
	},
};

module.exports = dbQueries;
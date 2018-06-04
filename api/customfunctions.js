module.exports.authService = function(cred){
	console.log(cred)
	if(cred.passwd === '1') {
		console.log(1)
		return true;
	}
	//TODO write ssid to session storage;
}
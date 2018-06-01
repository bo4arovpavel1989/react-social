import {API_URL} from './config';

export const handleResponse = (response) => {
	return response.json().then(json=>{
		return response.ok ? json : Promise.reject(json);
	})
}

export const checkToken = (data) => {
	
	return new Promise((resolve, reject) => {
	
	fetch(`${API_URL}/checktoken`,{
			method:'POST',
			mode:'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:data
		})
		.then(handleResponse)
		.then((result)=>{
			console.log(result)
			resolve(result)
		})
		.catch((error) => {
			console.log(error)
			reject(error);
		});
	
	});
}
import {API_URL} from './config';
import EventEmitter from 'events';

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
			resolve(result)
		})
		.catch((error) => {
			reject(error);
		});
	
	});
}

export const getToken = () => {
	if(localStorage.getItem('token') && localStorage.getItem('login'))
		return {
			token:localStorage.getItem('token'),
			login:localStorage.getItem('login')
		}
		
	return false;	
}

export var eventEmitter = new EventEmitter();


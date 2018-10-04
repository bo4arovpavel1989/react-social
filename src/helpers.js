import {API_URL} from './config';
import EventEmitter from 'events';

export const handleResponse = response=>response.json().then(json=>response.ok ? json : Promise.reject(json))

export const checkToken = data=>new Promise((resolve, reject)=>{

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
		.then(result=>{
			if(!result.err)
				resolve(result)
			else
				reject(result.err)
		})
		.catch(error=>{
			reject(error);
		});

	})

export const setToken = data=>{
	if(!data)
		return;

	localStorage.setItem('token',data.token);
	localStorage.setItem('login',data.login);
	localStorage.setItem('id',data.id);
}

export const getToken = ()=>{
	if(localStorage.getItem('token') && localStorage.getItem('login'))
		return {
			id:localStorage.getItem('id'),
			token:localStorage.getItem('token'),
			login:localStorage.getItem('login')
		}

	return false;
}

export const eventEmitter = new EventEmitter();


export const standardFetch = ()=>({
				method:'GET',
				mode:'cors',
				headers: {
					'Accept': 'application/json,text/plain',
					'Content-Type': 'application/json,text/plain',
					'id':getToken().id,
					'login':getToken().login,
					'token':getToken().token
				}
			})

export const attouchCred = obj=>Object.assign(obj, getToken())
import {API_URL} from './config';
import EventEmitter from 'events';

export const eventEmitter = new EventEmitter();

/**
 * Fetch method helper makes json transformation
 * @param {object} response - response object got from server
 * @returns {Promise} - boolean represents if json operation success
 */
export const handleResponse = response=>response.json().then(json=>response.ok ? json : Promise.reject(json))

/**
 * Function checks access token
 * @param {object} data - object that contains access token (login, id, token)
 * @returns {Promise} - boolean represents if access token is correct and actual
 */
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

/**
 * Function saves access token in localStorage
 * @param {object} data - object that contains access token data (login, token, id)
 * @returns {null} - returns nothing if param wasnt defined
 */
export const setToken = data=>{
	if(!data)
		return;

	localStorage.setItem('token',data.token);
	localStorage.setItem('login',data.login);
	localStorage.setItem('id',data.id);
}

/**
 * Function get access token from localStorage
 * @returns {object} - if access token is stored in localStorage
 * @returns {boolean} - false boolean represents if is no access token
 */
export const getToken = ()=>{
	if(localStorage.getItem('token') && localStorage.getItem('login'))
		return {
			id:localStorage.getItem('id'),
			token:localStorage.getItem('token'),
			login:localStorage.getItem('login')
		}

	return false;
}

/**
 * Function returns options object for default fetch application
 * @returns {object} - default fetch options object
 */
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

/**
 * Function that attouches token to any data object
 * @param {object} obj - data object to attouch access token (login, token, id) to
 * @returns {object} - data object with assigned access token data
 */
export const attouchCred = obj=>Object.assign(obj, getToken())

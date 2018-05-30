export const handleResponse = (response) => {
	console.log(response);
	return response.json().then(json=>{
		return response.ok ? json : Promise.reject(json);
	})
}
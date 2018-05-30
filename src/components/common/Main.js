import React from 'react';
import {API_URL} from '../../config';
import {handleResponse} from '../../helpers';

class Main extends React.Component	{
	constructor(){
		super();
		this.state = {
			isLogged: false,
			loginData: {login:'',password:''},
			loading:false,
			error:null
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(e) {
		
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		this.setState({loading:true})
		
		fetch(`${API_URL}/`,{method:'POST',mode:'cors'})
			.then(handleResponse)
			.then((result)=>{
				console.log(result)
			})
			.catch((error) => {
				console.log(error)
				this.setState({
				error: error.errorMessage, 
				loading:false
			});
});
	}
	
	render(){
		return (
		<form className="form-horizontal" onSubmit={this.handleSubmit}>
			<div className="form-group">
				<label htmlFor="inputLogin" className="col-sm-2 control-label">Логин</label>
				<div className="col-sm-10">
					<div className="input-group">
						<input type="login" onChange={this.handleChange} className="form-control" id="inputLogin" placeholder="Login" />
					</div>
				</div>
			</div>
			<div className="form-group">
				<label htmlFor="inputPassword" className="col-sm-2 control-label">Пароль</label>
				<div className="col-sm-10">
					<input type="password" onChange={this.handleChange} className="form-control" id="inputPassword" placeholder="Password"/>
				</div>
			</div>
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-10">
					<input className="btn btn-primary btn-lg" type="submit" value="Вход"/>
				</div>
			</div>
		</form>
		);
	}
}

export default Main;
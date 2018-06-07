import React from 'react';
import {Link} from 'react-router-dom';
import {API_URL} from '../../config';
import {handleResponse} from '../../helpers';
import './register.css';

class Register extends React.Component {
	
	constructor(){
		super();
		
		this.state = {
			login: '',
			passwd1: '',
			passwd2: '',
			email: '',,
			passwdCorrect:true,
			allFieldsUsed:false
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
	}
		
	handleChange(e) {
		let fieldType = e.target.id.toString(),
			state = {};
			
		state[fieldType] = e.target.value.toString();
		
		this.setState(state,()=>{
			
			if (this.state.login !== '' && this.state.passwd !== '')
				this.setState({allFieldsUsed:true})
			else 
				this.setState({allFieldsUsed:false})	
		});
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		this.setState({loading:true})
		
		let {login,passwd} = this.state;
		
		let data = JSON.stringify({login,passwd});
				
		fetch(`${API_URL}/register`,{
				method:'POST',
				mode:'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:data
			})
			.then(handleResponse)
			.then((data)=>{
				console.log(data)
			})
			.catch((error) => {
				console.log(error)
			});
	}
	
	checkPassword(){
		return (this.state.passwd1 === this.state.passwd2);
	}
	
	render(){
		
		return (
		<div>
			<form className="form-horizontal" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="inputLogin" className="col-sm-2 control-label">Логин</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="login" onChange={this.handleChange} className="form-control" id="login" placeholder="Login" />
						</div>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputPassword" className="col-sm-2 control-label">Пароль</label>
					<div className="col-sm-10">
						<input type="password"  value={this.state.passwd} onChange={this.handleChange} className="form-control" id="passwd1" placeholder="Password"/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputPassword" className="col-sm-2 control-label">Повторите пароль</label>
					<div className="col-sm-10">
						<input type="password"  value={this.state.passwd} onChange={this.handleChange} className="form-control" id="passwd2" placeholder="Password"/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputLogin" className="col-sm-2 control-label">Логин</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="email" onChange={this.handleChange} className="form-control" id="login" placeholder="E-Mail" />
						</div>
					</div>
				</div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-10">
						<input disabled={this.state.allFieldsUsed ? false : true} className="btn btn-primary btn-lg" type="submit" value="Зарегистрироваться"/>
					</div>
				</div>
			</form>
		</div>
		);
	}
}


export default Register;
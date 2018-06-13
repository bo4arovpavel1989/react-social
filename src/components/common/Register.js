import React from 'react';
import {API_URL} from '../../config';
import {handleResponse} from '../../helpers';
import './register.css';

class Register extends React.Component {
	
	constructor(){
		super();
		
		this.state = {
			login: '',
			loginValid:true,
			emailValid:true,
			passwd1: '',
			passwd2: '',
			email: '',
			passwdCorrect:true,
			allFieldsUsed:false
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.checkValidity = this.checkValidity.bind(this);
		this.checkPasswd = this.checkPasswd.bind(this);
	}
		
	handleChange(e) {
		let fieldType = e.target.id.toString(),
			state = {},
			allFieldsUsed;
				
		state[fieldType] = e.target.value.toString();
				
		this.setState(state,()=>{

			allFieldsUsed = this.state.loginValid && 
				this.state.emailValid	&& 
				this.state.login !== '' && 
				this.state.passwd1 !== '' && 
				this.state.email !== '' && 
				this.state.passwdCorrect;
			
			console.log(allFieldsUsed)
			console.log(this.state)
			
			this.setState({allFieldsUsed})
			
		});
	}
	
	checkValidity(inp, cb){
		let val = document.getElementById(inp).value;
		
		if(inp === 'login' || inp === 'email')
			fetch(`${API_URL}/checkvalidity`,{
					method:'POST',
					mode:'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body:JSON.stringify({val,inp})
				})
				.then(handleResponse)
				.then((rep)=>{
						this.setState(rep)
						cb();
				})
				.catch((error) => {
					console.log(error)
					cb();
				});
		else 
			cb();
	}
	
	checkPasswd(){
		let passwd1 = document.getElementById('passwd1').value,
			passwd2 = document.getElementById('passwd2').value;
			
		this.setState({passwdCorrect:(passwd1 === passwd2)})	
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
	
	
	render(){
		
		return (
		<div>
			<form className="form-horizontal" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="inputLogin" className={"col-sm-2 control-label" + (this.state.loginValid ? '' : ' invalid')}>Логин</label>
					<span className={'validMessage ' + (this.state.loginValid ? 'hidden' : '')}>Логин уже занят!</span>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="login" onChange={(this.handleChange)} onKeyUp={()=>this.checkValidity('login')} className={"form-control " + (this.state.loginValid ? '' : 'invalid')} id="login" placeholder="Login" />
						</div>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputPassword" className={"col-sm-2 control-label" + (this.state.passwdCorrect ? '' : ' invalid')}>Пароль</label>
					<span className={'validMessage ' + (this.state.passwdCorrect ? 'hidden' : '')}>Пароли должны совпадать!</span>
					<div className="col-sm-10">
						<input type="password"  value={this.state.passwd} onChange={this.handleChange}  onKeyUp={this.checkPasswd} className={"form-control " + (this.state.passwdCorrect ? '' : 'invalid')} id="passwd1" placeholder="Password"/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputPassword" className="col-sm-2 control-label">Повторите пароль</label>
					<div className="col-sm-10">
						<input type="password"  value={this.state.passwd} onChange={this.handleChange}  onKeyUp={this.checkPasswd} className="form-control" id="passwd2" placeholder="Password"/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="inputLogin" className={"col-sm-2 control-label"+ (this.state.emailValid ? '' : ' invalid')}>E-Mail</label>
					<span className={'validMessage ' + (this.state.emailValid ? 'hidden' : '')}>Пользователь с данным E-Mail уже зарегистрирован!</span>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="email" onChange={this.handleChange}  onKeyUp={()=>this.checkValidity('email')} className={"form-control " + (this.state.emailValid ? '' : 'invalid')} id="email" placeholder="E-Mail" />
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
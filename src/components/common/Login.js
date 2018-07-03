import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {API_URL} from '../../config';
import {handleResponse,eventEmitter} from '../../helpers';
import './login.css'

class Login extends React.Component	{
	constructor(){
		super();
		this.state = {
			isLogged: false,
			loading:false,
			login:'',
			passwd:'',
			error:null,
			authFail: false,
			allFieldsUsed:false
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	loginEmitter(){
		eventEmitter.emit('login');
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
				
		fetch(`${API_URL}/login`,{
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
				this.setState({ 
					loading:false,
					authFail: !data.auth,
					passwd:''
				},()=>{
					if(data.auth) {
						console.log(1)
						this.loginEmitter();
						this.props.history.push(`/personal/${data.id}`);
					}	
				});
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
						<input type="password"  value={this.state.passwd} onChange={this.handleChange} className="form-control" id="passwd" placeholder="Password"/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-10">
						<input disabled={this.state.allFieldsUsed ? false : true} className="btn btn-primary btn-lg" type="submit" value="Вход"/>
					</div>
				</div>
			</form>
			<div className={"alert alert-danger" + (this.state.authFail ? '' : ' hidden')}>
			  <strong>Oh snap!</strong> Wrong login or password!
			</div>
		<div className='register'>
			<Link to={`/register`}>Регистрация</Link>
		</div>
		</div>
		);
	}
}

export default withRouter(Login);
import React from 'react';

class Main extends React.Component	{
	constructor(){
		super();
		this.state = {
			isLogged: false,
			loginData: {login:'',password:''}
		}
	}
	
	handleChange(e) {
		console.log(e.target)
	}
	
	handleSubmit(e){
		e.preventDefault();
		console.log(e.target);
	}
	
	render(){
		return (
		<form className="form-horizontal" onSubmit={this.handleSubmit}>
			<div className="form-group">
				<label htmlFor="inputLogin" className="col-sm-2 control-label">Логин</label>
				<div className="col-sm-10">
					<div className="input-group">
						<div className="input-group-addon">@</div>	
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
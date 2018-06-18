import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {checkToken} from '../../helpers';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			isLogged:false,
			login:''
		}
		
		this.checkAccess = this.checkAccess.bind(this);
	}
	
	checkAccess(){
		
	}
	
	render(){
		if(this.state.loading)
			return(
				<div>
					Загрузка...
				</div>
			)
		if(!this.state.isLogged)
			return (
				<div>
					Пожалуйста, <Link to={`/`}>залогиньтесь</Link>, чтобы продолжить!
				</div>
			)
	}
}

export default withRouter(Personal);
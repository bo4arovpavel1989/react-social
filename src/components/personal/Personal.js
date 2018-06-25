import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {checkToken,handleResponse,standardFetch} from '../../helpers';
import {API_URL} from '../../config';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			isLogged:false,
			login:'',
			error:false,
			data:{}
		}
		
		this.checkAccess = this.checkAccess.bind(this);
		this.getPersonalData = this.getPersonalData.bind(this);
	}
	
	checkAccess(){
		return new Promise((resolve,reject)=>{
			checkToken().then(rep=>this.setState({isLogged:rep.auth},()=>resolve(rep.auth)))
						.catch(err=>this.setstate({error:true},()=>reject()))		
		});			
	}
	
	getPersonalData(person){
		fetch(`${API_URL}/person/${person}`,standardFetch)
			.then(handleResponse)
			.then((rep)=>{
				if(!rep.err && !rep.forbidden)
					this.setState({data:rep,loading:false})
				else if(rep.forbidden)
					this.setState({isLogged:false})
				else
					this.setState({error:true})
			})
			.catch(error=>{
				this.setState({error:true})
			})
	}
	
	componentWillMount(){
		const person = this.props.match.params.id;
		
		this.checkAccess()
			.then(auth=>{
				if(auth)
					this.getPersonalData(person);
			})
	}
	
	
	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			const newPerson = nextProps.match.params.id;
			
			this.getPersonalData(newPerson);
		}
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
			
		if(this.state.error)
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)	
			
		return (
			<div className='container'>
				Привет, я {this.state.data.login}!
			</div>
		)	
	}
}

export default withRouter(Personal);
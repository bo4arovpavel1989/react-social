import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {checkToken,handleResponse,standardFetch} from '../../helpers';
import {API_URL} from '../../config';
import './Personal.css';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
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
		fetch(`${API_URL}/personal/${person}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				if(!rep.err && !rep.forbidden)
					this.setState({data:rep,loading:false})
				else if(rep.forbidden)
					this.setState({isLogged:false,loading:false})
				else
					this.setState({error:true})
			})
			.catch(error=>{
				this.setState({error:true})
			})
	}
	
	componentDidMount(){
		let person = this.props.match.params.id;
		
		if(!person && localStorage.getItem('id')) {
			person = localStorage.getItem('id')
			this.props.history.push(`/personal/${person}`);
		}
		
		this.getPersonalData(person);
	}
	
	
	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			let newPerson = nextProps.match.params.id;
			if(!newPerson && localStorage.getItem('id')) { //if user clicked header when been logged in
				newPerson = localStorage.getItem('id')
				this.props.history.push(`/personal/${newPerson}`);
			}
			
			this.getPersonalData(newPerson);
		}
}
	
	render(){
		let data = this.state.data.rep;			
		console.log(this.state);
		if(this.state.loading)
			return(
				<div>
					Загрузка...
				</div>
			)
			
		if(this.state.error || !data)
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)	
			
		return (
			<div className='container'>
				Привет, я {data.login}!
			</div>
		)	
	}
}

export default withRouter(Personal);
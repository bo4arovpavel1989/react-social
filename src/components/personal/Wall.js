import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import {handleResponse,standardFetch, getToken, eventEmitter} from '../../helpers';
import {API_URL} from '../../config';

class Wall extends React.Component {
	constructor(){
		super();
		
		this.state = {
			person:'',
			data:[],
			loading:false
		}
	}
	
	
	getWall(person){
		this.setState({loading:true});
		
		fetch(`${API_URL}/getwall/${person}?q=0`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				if(!rep.err && !rep.forbidden)
					this.setState({data:rep,loading:false})
				else if(rep.forbidden)
					eventEmitter.emit('logoff')
				else
					this.setState({error:true})
			})
			.catch(error=>{
				console.log(error)
				this.setState({error:true})
			})
	}
	
	componentDidMount(){
		this.setState({person:this.props.person},() => this.getWall(this.state.person));
	}
	
	render(){
		let data = this.state.data;
		console.log(data);
		
		if(this.state.loading)
			return(
				<div className='text-center'>
					Загрузка...
				</div>
			)
		
		if(!data)
			return (
				<div className='text-center'>
					Записей на стене нет...
				</div>
			)
		
		return (	
				<div className='text-center'>	
					Это стена
				</div>
			)
		
	}
	
}

export default  withRouter(Wall);
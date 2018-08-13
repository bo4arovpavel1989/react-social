import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse,standardFetch, eventEmitter} from '../../helpers';
import MakePost from './MakePost';
import Post from './Post';
import {API_URL} from '../../config';

class Wall extends React.Component {
	constructor(){
		super();
		
		this.state = {
			person:'', //owner of the wall
			data:[],
			loading:false
		}
	}
	
	
	getWall(person){
		this.setState({loading:true});
		
		fetch(`${API_URL}/getwall/${person}?q=0`,standardFetch()) //q means quantity of wall posts already loaded 
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
	
	listenToNewPosts(){
		eventEmitter.on('newpost',()=>{
			this.getWall(this.state.person)
		})
	}
	
	componentDidMount(){
		this.setState({person:this.props.id},() => {
			this.getWall(this.state.person);
			this.listenToNewPosts();
		});
		
	}
	
	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			let newPerson = nextProps.match.params.id;
			
			this.getWall(newPerson);
		}
	}
	
	render(){
		let data = this.state.data;
		
		if(this.state.loading)
			return(
				<div className='text-center'>
					Загрузка...
				</div>
			)
		
		if(data.length === 0)
			return (
				<div className='wall text-center'>
					<div className='text-center'>
						<MakePost
							id = {this.state.person} //make post to who
						/>
					</div>
					<div className='text-center'>
						Записей на стене нет...
					</div>
				</div>
			)
		
		return (	
				<div className='wall text-center'>
					<div className='text-center'>
						<MakePost
							id = {this.state.person} //make post to who
						/>
					</div>
					<div className='text-left'>
						{data.map((e, i) => {
							return (<Post key={i} data={e}/>)
						})}
					</div>
				</div>
			)
		
	}
	
}

export default  withRouter(Wall);
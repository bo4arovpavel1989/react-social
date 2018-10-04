import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './SingleMessage.css'
import {handleResponse, standardFetch, getToken, eventEmitter} from '../../helpers';
import {API_URL} from '../../config';

class SingleMessage extends React.Component {
	constructor(){
		super();
		this.state = {
			deleted:false,
			microAvatar:'',
			_id:'', // Id of the message
			id:'', // Id of person, viewed in message
			from:'',
			to:'',
			message:'',
			name:'',
			date:'',
			isRead:true
		}
		
		this.getUserData = this.getUserData.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
	}
	
	componentDidMount(){
		const {data, box} = this.props;
		
		/*
		 * Set id of the person whether its sender or receiver. 
		 * if its inbox i set id of the sender, if its outbox i set od of the receiver
		 */
		
		data.id = box === 'in' ? data.from : data.to 
			
		this.setState(data, ()=>{
			this.getUserData();
		});
	}
	
	getUserData(){	
		const author = this.state.id;
	
		fetch(`${API_URL}/post-personal/${author}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				const {name, microAvatar} = rep;

				this.setState({microAvatar, name});
			})
			.catch(error=>{
				console.log(error)
			})
	}
		
	removeMessage(){
		if(window.confirm('Уверен?')){
				const id = this.state._id;
				
				fetch(`${API_URL}/removemessage/${id}`,{
						method:'DELETE',
						mode:'cors',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body:JSON.stringify(getToken())
					})
					.then(handleResponse)
					.then(rep=>{
						this.setState({deleted:true});
					})
					.catch(error=>{
						console.log(error);
					});
			}
	}
	
	emitClickOnMessage(id){
		eventEmitter.emit('messageClick', id); 
	}
	
	render(){	
		const {deleted, isRead, id, microAvatar, date, message, name} = this.state;
	
		if(!deleted)
			return (
				<div className='singleMessage'>
				
					<div className='messageAuthor'>
						<Link to={`/personal/${id}`}>
							<img src={microAvatar} alt='avatar_image'/>
						</Link>
					</div>
					
					<div className={`messageText ${isRead ? '' : 'new'}`}>
					
						<div className='messageName'>
							<Link to={`/personal/${id}`}>
								{name}:
							</Link>
						</div>
						
						<div className='message' onClick={()=>this.emitClickOnMessage(id)}>
							{message}
						</div>
						
						<div className='messageDate'>
							{date.split('T')[0]}
						</div>
						
					</div>		
					
					<span className='removeMessage' onClick={this.removeMessage}>Удалить</span>
					
				</div>
				)
				
		return null;	
	}	
}

SingleMessage.propTypes = {data:PropTypes.object.isRequired}

export default withRouter(SingleMessage);
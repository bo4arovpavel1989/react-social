import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './SingleMessage.css'
import {handleResponse, standardFetch, getToken} from '../../helpers';
import {API_URL} from '../../config';

class SingleMessage extends React.Component {
	constructor(){
		super();
		this.state = {
			deleted:false,
			microAvatar:'',
			id:'',
			message:'',
			date:'',
			isRead:true
		}
		
		this.getUserData = this.getUserData.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
	}
	
	componentDidMount(){
		let {data} = this.props;
		let me = getToken().id;
			
		this.setState(data, ()=>{
			this.getUserData();
		});
	}
	
	getUserData(){	
		let author = this.state.id;
	
		fetch(`${API_URL}/post-personal/${author}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				let {name, microAvatar} = rep;
				this.setState({microAvatar, name});
			})
			.catch(error=>{
				console.log(error)
			})
	}
		
	removeMessage(){
		if(window.confirm('Уверен?')){
			
			}
	}
	
	render(){	
		let {deleted, isRead, id, microAvatar, date, message} = this.state;
	
		if(!deleted)
			return (
				<div className='singleMessage'>
					<div className='messageAuthor'>
						<Link to={`/personal/${id}`}>
							<img src={microAvatar} alt='avatar_image'/>
						</Link>
					</div>
					<div className={'messageText ' + (isRead ? '' : 'new')}>
						<div className='message'>{message}</div>
						<div className='messageDate'>{date.split('T')[0]}</div>
					</div>
				</div>
				)
				
		return null;	
	}	
}

SingleMessage.propTypes = {
	data:PropTypes.object.isRequired
}

export default withRouter(SingleMessage);
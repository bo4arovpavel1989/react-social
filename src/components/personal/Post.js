import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Post.css'
import {handleResponse, standardFetch, getToken, eventEmitter} from '../../helpers';
import {API_URL} from '../../config';

class Post extends React.Component {
	constructor(){
		super();
		this.state = {
			_id:'',
			author:'',
			name:'',
			microAvatar:'',
			entry:'',
			date:'',
			like:0,
			liked:false,
			myPost:false,
			deleted:false
		}
		
		this.like = this.like.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.removePost = this.removePost.bind(this);
	}
	
	componentDidMount(){
		let {data, myWall} = this.props;
		let me = getToken().id;
		
		data.myPost = (myWall || (me === data.author));
		
		this.setState(data, ()=>{
			this.getUserData();
		});
	}
	
	getUserData(){	
		let author = this.state.author;
	
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
	
	like(){
		let postId = this.state._id;
		
		fetch(`${API_URL}/like/${postId}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				let like = this.state.like;
				
				if(rep.newLike)
					this.setState({like:++like, liked:true})
				else
					this.setState({like:--like, liked:false})
				
				eventEmitter.emit('like', this.state._id)
			})
			.catch(error=>{
				console.log(error)
			})
		
	}
	
	removePost(){
		if(window.confirm('Уверен?')){
			let id = this.state._id;
				
			fetch(`${API_URL}/removepost/${id}`,{
					method:'DELETE',
					mode:'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body:JSON.stringify(getToken())
				})
				.then(handleResponse)
				.then((rep)=>{
					console.log(rep);
					this.setState({deleted:true});
				})
				.catch((error) => {
					console.log(error);
				});
			
			}
	}
	
	render(){
		let {author, entry, date, like, name, microAvatar, liked, myPost, deleted} = this.state;
		
		if(!deleted)
			return (	
					<div className='post'>
						<div className='postHeader'>
							<div className='postAvatar'>
								<Link to={`/personal/${author}`}>
									<img src={microAvatar} alt='avatar_image'/>
								</Link>
							</div>
							<div className='postAuthor'>
								<Link to={`/personal/${author}`}>
									<div className='postAuthorName'>{name}</div>
								</Link>
								<div className='postAuthorDate'>{date.split('T')[0]}</div>
							</div>
						</div>
						<div className='postEntry'>
							<div className='postEntryText'>{entry}</div>
							<div className={'postEntryLike ' + (liked ? 'liked' : '')} onClick={this.like}>&#x2764; {like}</div>
							<span className={'deletePost ' + (myPost ? '' : 'hidden')} onClick={this.removePost}>Удалить</span>
						</div>
					</div>
				)
				
		return null;	
	}	
}

Post.propTypes = {
	myWall:PropTypes.bool.isRequired,
	data:PropTypes.object.isRequired
}

export default withRouter(Post);
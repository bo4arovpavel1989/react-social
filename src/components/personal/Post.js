import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import './Post.css'
import {handleResponse, standardFetch} from '../../helpers';
import {API_URL} from '../../config';

class Post extends React.Component {
	constructor(){
		super();
		this.state = {
			author:'',
			name:'',
			microAvatar:'',
			entry:'',
			date:'',
			like:0,
			liked:false
		}
		
		this.like = this.like.bind(this);
		this.getUserData = this.getUserData.bind(this);
	}
	
	componentWillMount(){
		let {data} = this.props;
		
		
		console.log(this.props)
		this.setState(data, ()=>{
			this.getUserData();
		});
	}
	
	getUserData(){	
		let author = this.state.author;
	
		fetch(`${API_URL}/post-personal/${author}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				this.setState(rep);
			})
			.catch(error=>{
				console.log(error)
			})
	}
	
	like(){
		let postId = this.props.data._id;
		
		fetch(`${API_URL}/like/${postId}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				let like = this.state.like;
				
				if(rep.newLike)
					this.setState({like:++like, liked:true})
				else
					this.setState({like:--like, liked:false})
			})
			.catch(error=>{
				console.log(error)
			})
		
	}
	
	render(){
		let {author, entry, date, like, name, microAvatar, liked} = this.state;
		console.log(liked);
		return (	
				<div className='post'>
					<div className='postHeader'>
						<div className='postAvatar'>
							<Link to={`/personal/${author}`}>
								<img src={microAvatar}/>
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
					</div>
				</div>
			)
	}	
}

export default withRouter(Post);
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
		}
		
		this.getUserData = this.getUserData.bind(this);
	}
	
	componentWillMount(){
		let {data} = this.props;
		
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
	
	
	render(){
		let {author, entry, date, like, name, microAvatar} = this.state;
		
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
						<div className='postEntryLike'>&#x2764; {like}</div>
					</div>
				</div>
			)
	}	
}

export default withRouter(Post);
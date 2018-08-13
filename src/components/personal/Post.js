import React from 'react';
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
		console.log(author)
	
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
					<div>
						<img src={microAvatar}/>
					</div>
					<div>
						<div>{name}</div>
						<div>{entry}</div>
						<div>{date.split('T')[0]}</div>
						<div>{like}</div>
					</div>
				</div>
			)
	}	
}

export default Post;
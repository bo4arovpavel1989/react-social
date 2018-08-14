import React from 'react';
import _ from 'lodash';
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
		
		this.checkLikedPosts = this.checkLikedPosts.bind(this);
	}
	
	
	getWall(person){
		this.setState({loading:true});
		
		if(person)
			fetch(`${API_URL}/getwall/${person}?q=0`,standardFetch()) //q means quantity of wall posts already loaded 
				.then(handleResponse)
				.then((rep)=>{
					if(!rep.err && !rep.forbidden){
						let data = this.checkLikedPosts(rep);
						this.setState({data,loading:false})
					}
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
	
	checkLikedPosts(rep){
		let posts = rep.posts;
		let likedPosts = rep.likedPosts;
		let postsToRender = [];
		
		posts.map((p,i) => {
			if(_.includes(likedPosts, p._id))
				p.liked = true;
			else
				p.liked = false;
			
			postsToRender.push(p);
		});
		
		return postsToRender;
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
			
			this.setState({person:newPerson});
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
					<div className='text-center postEntry'>
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
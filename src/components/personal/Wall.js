import React from 'react';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {handleResponse,standardFetch, eventEmitter, getToken} from '../../helpers';
import MakePost from './MakePost';
import Post from './Post';
import {API_URL} from '../../config';

class Wall extends React.Component {
	constructor(){
		super();
		
		this.state = {
			person:false, //owner of the wall
			data:[],
			isMore:true,
			myWall:false,
			scroll:0, //number of scrolls by order
			loading:false
		}
		
		this.scrollTrigger =  React.createRef();
		this.checkLikedPosts = this.checkLikedPosts.bind(this);
		this.getOlderPosts = this.getOlderPosts.bind(this);
	}
	
	
	getWall(){
		this.setState({loading:true});
		let me = getToken().id;
		let q = this.state.scroll;
		let person = this.state.person;
		
		if(person)
			fetch(`${API_URL}/getwall/${person}?q=${q}`,standardFetch()) //q means quantity of wall posts already loaded 
				.then(handleResponse)
				.then((rep)=>{
					if(!rep.err && !rep.forbidden){
						let newData = this.checkLikedPosts(rep);
						let data, 
							isMore = true;
						
						if(newData.length < 10)
							isMore = false;
												
						this.setState({data:[...this.state.data, ...newData], isMore, loading:false, myWall:(me === person)})
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
		
		posts.forEach((p,i) => {
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
			this.setState({scroll:0}, () => this.getWall(this.state.person) );
		})
	}
	
	componentDidMount(){
		this.setState({person:this.props.id},() => {
			this.getWall();
			this.listenToNewPosts();
		});
		
		window.addEventListener('scroll', this.getOlderPosts, true);
	}
	
	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			let newPerson = nextProps.match.params.id;
			
			this.setState({person:newPerson}, this.getWall);
		}
	}
	
	getOlderPosts(){
		if(this.state.isMore) {
			let scrTrg = this.scrollTrigger;
			
			let scr = window.scrollY + window.innerHeight + 300; // +300 to make load earlier
			let bodyHeight = document.body.offsetHeight;
			
			if(scr >= bodyHeight) {
				let scrollNum = this.state.scroll;
				this.setState({scroll:++scrollNum}, this.getWall)
			}
		}
	}
	
	render(){
		let data = this.state.data;
		let myWall = this.state.myWall;
		
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
				<div className='wall text-center' onScroll={this.getOlderPosts}>
					<div className='text-center'>
						<MakePost
							id = {this.state.person} //make post to who
						/>
					</div>
					<div className='text-left'>
						{data.map((e, i) => {
							return (<Post key={e._id} myWall = {myWall} data={e}/>)
						})}
					</div>
					<div className='scrollToGetOld' ref={this.scrollTrigger}>
					</div>
				</div>
			)
		
	}
	
}

Wall.propTypes = {
	id:PropTypes.string.isRequired
}

export default  withRouter(Wall);
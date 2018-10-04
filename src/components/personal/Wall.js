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
			person:false, // Owner of the wall
			data:[],
			isMore:true,
			myWall:false,
			scroll:0, // Number of scrolls by order
			loading:false,
			iAmBanned:false
		}

		this.scrollTrigger = React.createRef();
		this.checkLikedPosts = this.checkLikedPosts.bind(this);
		this.getOlderPosts = this.getOlderPosts.bind(this);
		this.checkBan = this.checkBan.bind(this);
	}

	componentDidMount(){
		this.setState({person:this.props.id},()=>{
			this.getWall();
			this.checkBan();
			this.listenToNewPosts();
			this.listenToLikes();
		});

		window.addEventListener('scroll', this.getOlderPosts, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.getOlderPosts, true);
	}

	getWall(){
		this.setState({loading:true});
		const me = getToken().id,
			q = this.state.scroll,
			{person} = this.state,
			wallPostsPerTime = 10;

		if(person)
			fetch(`${API_URL}/getwall/${person}?q=${q}`,standardFetch()) // Q means quantity of wall posts already loaded
				.then(handleResponse)
				.then(rep=>{
					if(!rep.err && !rep.forbidden){
						const newData = this.checkLikedPosts(rep),
							isMore = (newPata.length === wallPostsPerTime),
							loading = false,
							myWall = (me === person);

						this.setState(prevState=>({
							data:[
...prevState.data,
...newData
], isMore, loading, myWall
						}))
					} else if(rep.forbidden)
						eventEmitter.emit('logoff')
					else
						this.setState({error:true})
				})
				.catch(error=>{
					console.log(error)
					this.setState({error:true})
				})
	}

	checkBan(){
		const {person} = this.state,
			me = getToken().id;

		if(me !== person)
			fetch(`${API_URL}/checkBan/${person}`, standardFetch())
				.then(handleResponse)
				.then(rep=>{
					const {iAmBanned} = rep;

					this.setState({iAmBanned});
				})
				.catch(error=>{
					console.log(error)
				})
	}

	checkLikedPosts(rep){
		const {posts, likedPosts} = rep;

		posts.forEach((p,i)=>{
			if(_.includes(likedPosts, p._id))
				p.liked = true;
			else
				p.liked = false;
		});

		return posts;
	}

	listenToNewPosts(){
		eventEmitter.on('newpost',()=>{
			this.setState({scroll:0, data:[]}, ()=>this.getWall(this.state.person));
		})
	}

	listenToLikes(){
		eventEmitter.on('like', _id=>{

		const {data} = this.state;

			for (let i = 0; i < data.length; i++) {
				if (data[i]._id === _id) {
					data[i].liked = !data[i].liked;
					data[i].liked ? ++data[i].like : --data[i].like;
					break;
				}
 			}

			this.setState({data});
		});
	}

	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			const newPerson = nextProps.match.params.id;

			this.setState({person:newPerson, data:[], scroll:0}, this.getWall);
		}
	}

	getOlderPosts(){
		const distanceBeforeLoading = 300;//  to make load earlier

		if(this.state.isMore) {
			const scr = window.scrollY + window.innerHeight + distanceBeforeLoading,
				bodyHeight = document.body.offsetHeight;

			if(scr >= bodyHeight) {
				let scrollNum = this.state.scroll;

				this.setState({scroll:++scrollNum}, this.getWall)
			}
		}
	}

	render(){
		const {data, myWall, iAmBanned, loading} = this.state;

		if(data.length === 0)
			return (
				<div className='wall text-center'>
					<div className='text-center'>
						<MakePost
							id = {this.state.person} // Make post to who
						/>
					</div>
					<div className='text-center postEntry'>
						Записей на стене нет...
					</div>
				</div>
			)

		return (
				<div className='wall text-center' onScroll={this.getOlderPosts}>
					{
						iAmBanned ?
							''						:
							<div className='text-center'>
								<MakePost
									id = {this.state.person} // Make post to who
								/>
							</div>
					}
					<div className='text-left'>
						{data.map((e, i)=><Post key={e._id} myWall = {myWall} data={e}/>)}
					</div>
					{
						loading ?
								<div className='text-center'>
									Загрузка...
								</div>						:
								''
					}
					<div className='scrollToGetOld' ref={this.scrollTrigger}>
					</div>
				</div>
			)

	}

}

Wall.propTypes = {id:PropTypes.string.isRequired}

export default withRouter(Wall);

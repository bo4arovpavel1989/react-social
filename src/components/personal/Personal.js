import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse,standardFetch, getToken,eventEmitter} from '../../helpers';
import {API_URL} from '../../config';
import AvatarPlace from './AvatarPlace';
import PersonalData from './PersonalData';
import Sidebar from './Sidebar';
import Wall from './Wall';
import MsgBox from './MsgBox';
import './Personal.css';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			person:'', //id of the page owner
			login:'',
			error:false,
			data:{},
			myPage:true,
			msgBoxOpened:false
		}
		
		this.getPersonalData = this.getPersonalData.bind(this);
		this.openMsgBox = this.openMsgBox.bind(this);
	}
	
	getPersonalData(person){
		this.setState({person}) //set id of the pages's owner
		this.setState({myPage:person === getToken().id}) //check if its my page
		
		fetch(`${API_URL}/personal/${person}`,standardFetch())
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
	
	openMsgBox(){
		let opened = this.state.msgBoxOpened;
		this.setState({msgBoxOpened: !opened});
	}
	
	componentDidMount(){
		let person = this.props.match.params.id;
		
		if(!person && getToken()) {
			person = getToken().id
			this.props.history.push(`/personal/${person}`);
		}
		
		this.getPersonalData(person);
	}
	
	
	componentWillReceiveProps(nextProps){
		if (this.props.location.pathname !== nextProps.location.pathname) {
			let newPerson = nextProps.match.params.id;
			if(!newPerson && getToken()) { //if user clicked header when been logged in
				newPerson = getToken().id;
				this.props.history.push(`/personal/${newPerson}`);
			}
			
			this.getPersonalData(newPerson);
		}
	}
	
	render(){
		let {person, data} = this.state;	
		
		if(this.state.error || !data)
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)
		
		if(this.state.loading)
			return(
				<div>
					Загрузка...
				</div>
			)	
			
		return (
			<div className='container'>
				{this.state.msgBoxOpened ? 
					<MsgBox
						openMsgBox = {this.openMsgBox}
						person = {person}
					/> : ''
				}
				<div className="row">
					<div className="col-md-2">
						<Sidebar/>
					</div>
					<div className="col-md-3">
						<AvatarPlace
							img = {data.thumbAvatar}
							myPage= {this.state.myPage}
							openMsgBox = {this.openMsgBox}
						/>
					</div>
					<div className="col-md-3">
						<PersonalData
							data = {data}
						/>
					</div>
				</div>
				<div className="text-center">	
					<Wall
						id = {this.state.person}
					/>
				</div>
			</div>
		)	
	}
}

export default withRouter(Personal);
import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse,standardFetch, getToken,eventEmitter} from '../../helpers';
import {API_URL} from '../../config';
import AvatarPlace from './AvatarPlace';
import PersonalData from './PersonalData';
import Wall from './Wall';
import MsgBox from './MsgBox';
import './Personal.css';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			person:'', // Id of the page owner
			login:'',
			error:false,
			data:{},
			myPage:true,
			msgBoxOpened:false,
			isContact:false,
			isBanned:false,
			invisible:false,
			isWallOpened:false,
			newMessages:0
		}

		this.getPersonalData = this.getPersonalData.bind(this);
		this.openMsgBox = this.openMsgBox.bind(this);
		this.addToContacts = this.addToContacts.bind(this);
		this.banUser = this.banUser.bind(this);
	}

	getPersonalData(person){
		this.setState({person}) // Set id of the pages's owner
		this.setState({myPage:person === getToken().id}) // Check if its my page

		fetch(`${API_URL}/personal/${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(!rep.err && !rep.forbidden && !rep.invisible) {
					const {isBanned, isContact, isWallOpened, invisible} = rep;

					this.setState({
						data:rep,
						isBanned,
						isContact,
						invisible,
						isWallOpened,
						loading:false
					})
				}
				else if(rep.invisible)
					this.setState({invisible: true, loading:false})
				else if(rep.forbidden)
					eventEmitter.emit('logoff')
				else
					this.setState({error:true, loading:false})
			})
			.catch(error=>{
				console.log(error)
				this.setState({error:true})
			})
	}

	openMsgBox(){
		const opened = this.state.msgBoxOpened;

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

			if(!newPerson && getToken()) { // If user clicked header when been logged in
				newPerson = getToken().id;
				this.props.history.push(`/personal/${newPerson}`);
			}

			this.getPersonalData(newPerson);
		}
	}

	addToContacts(){
		const {person, isContact} = this.state;

		fetch(`${API_URL}/addtocontact?p=${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(!rep.err && !rep.forbidden)
					this.setState({isContact: !isContact, loading:false})
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

	banUser(){
		const {person, isBanned} = this.state;

		fetch(`${API_URL}/banuser?p=${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(!rep.err && !rep.forbidden)
					this.setState({isBanned: !isBanned, loading:false})
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

	render(){
		const {person, data, isContact, isBanned, loading, error, invisible, isWallOpened} = this.state;

		if(error || !data)
			return (
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)

		if(loading)
			return (
				<div>
					Загрузка...
				</div>
			)

		if(invisible)
			return (
				<div>
					Пользователь скрыл свою страницу
				</div>
			)

		return (
			<div className="col-md-10">
				{this.state.msgBoxOpened ?
					<MsgBox
						openMsgBox = {this.openMsgBox}
						person = {person}
						banUser = {this.banUser}
					/> : ''
				}
					<div className="avatarAndPersonal">
					<div className='avatarPlace'>
						<AvatarPlace
							img = {data.thumbAvatar}
							myPage= {this.state.myPage}
							openMsgBox = {this.openMsgBox}
							isContact = {isContact}
							isBanned = {isBanned}
							banUser = {this.banUser}
							addToContacts = {this.addToContacts}
						/>
					</div>
					<div className='personalDataPlace'>
						<PersonalData
							data = {data}
						/>
					</div>
					</div>
				<div className="text-center">
					<Wall
						id = {person}
						isWallOpened = {isWallOpened}
					/>
				</div>
			</div>
		)
	}
}

export default withRouter(Personal);

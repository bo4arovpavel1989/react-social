import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {handleResponse,standardFetch, eventEmitter} from '../../helpers';
import {API_URL} from '../../config';
import MsgBox from './MsgBox';
import './Contacts.css';

class Contacts extends React.Component {
	constructor(){
		super();
		this.state = {
			data:[],
			contacts:[],
			loading:false,
			error:false,
			scroll:0,
			isMore:true,
			msgBoxOpened:false,
			personToWrite:''
		}

		this.getContactsData = this.getContactsData.bind(this);
		this.getMoreContacts = this.getMoreContacts.bind(this);
		this.openMsgBox = this.openMsgBox.bind(this);
	}

	componentDidMount(){
		this.getContacts()
			.then(this.getContactsData);

		window.addEventListener('scroll', this.getMoreContacts, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.getMoreContacts, true);
	}

	getContacts(){
		const contactsPerTime = 10;

		return new Promise((resolve, reject)=>{
			const q = this.state.scroll;

			fetch(`${API_URL}/contacts?q=${q}`,standardFetch())
				.then(handleResponse)
				.then(rep=>{
					if(!rep.err && !rep.forbidden){
						const isMore = rep.contacts.length === contactsPerTime; // Number of contacts per 1 time

						this.setState({data:rep.contacts, isMore, loading:false}, resolve)
					} else if(rep.forbidden)
						eventEmitter.emit('logoff', resolve)
					else
						this.setState({error:true}, reject)
				})
				.catch(error=>{
					console.log(error)
					this.setState({error:true}, reject)
				})
		});
	}

	getContactsData(){
		const {data, contacts} = this.state;

		data.forEach(d=>{

			fetch(`${API_URL}/post-personal/${d.person}`,standardFetch())
				.then(handleResponse)
				.then(rep=>{
					contacts.push({...rep, person:d.person});
					this.setState({contacts});
				})
				.catch(error=>{
					console.log(error)
				})

		})
	}


	getMoreContacts(){
		const distanceBeforeLoading = 300;

		if(this.state.isMore) {
			const scr = window.scrollY + window.innerHeight + distanceBeforeLoading, // distance to make load earlier
				bodyHeight = document.body.offsetHeight;

			if(scr >= bodyHeight) {
				let scrollNum = this.state.scroll;

				this.setState({scroll:++scrollNum}, this.getContacts)
			}
		}
	}

	deleteContact(person){
		const {contacts} = this.state;

		for (let i = 0; i < contacts.length; i++) {
				if(contacts[i].person === person){
					contacts[i].isDeleted = true;
					break;
				}
		}


		fetch(`${API_URL}/addtocontact?p=${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(!rep.err && !rep.forbidden)
					this.getContacts()
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

	openMsgBox(person){
		const opened = this.state.msgBoxOpened;

		this.setState({msgBoxOpened: !opened, personToWrite:person});
	}

	render(){
		const {contacts, personToWrite} = this.state;

		return (
			<div className='contactsList'>
				{this.state.msgBoxOpened ?
					<MsgBox
						openMsgBox = {this.openMsgBox}
						person = {personToWrite}
					/> : ''
				}
			{
				contacts.map(c=>c.isDeleted ?
					''					:

						<div className='contactItem' key={c._id}>
							<div className='contactAvatar'>
								<Link to={`personal/${c.person}`}>
									<img src={c.microAvatar} alt='contact_avatar'/>
								</Link>
							</div>
							<div className='contactName'>
								<Link to={`personal/${c.person}`}>
									{c.name}
								</Link>
							</div>
							<div className='buttons'>
								<button className='btn-success contactbuttons' onClick={()=>this.openMsgBox(c.person)}>Отправить сообщение</button>
								<button className='btn-danger contactbuttons' onClick={()=>this.deleteContact(c.person)}>Удалить из контактов</button>
							</div>
						</div>)
			}
			</div>
		)

	}

}

export default withRouter(Contacts);

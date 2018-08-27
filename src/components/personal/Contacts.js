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
		return new Promise((resolve, reject) => {
			let q = this.state.scroll;
		
			fetch(`${API_URL}/contacts?q=${q}`,standardFetch())
				.then(handleResponse)
				.then((rep)=>{
					if(!rep.err && !rep.forbidden){
						let isMore = (rep.contacts.length === 10) ? true : false; //number of contacts per 1 time
						
						this.setState({data:rep.contacts, isMore, loading:false}, resolve)
					}	
					else if(rep.forbidden)
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
		let { data, contacts } = this.state;
		
		data.forEach((d) => {
			
			fetch(`${API_URL}/post-personal/${d.person}`,standardFetch())
				.then(handleResponse)
				.then((rep)=>{
					contacts.push({...rep, person:d.person});
					this.setState({contacts});
				})
				.catch(error=>{
					console.log(error)
				})
				
		})
	}
	
	
	getMoreContacts(){
		if(this.state.isMore) {
			let scr = window.scrollY + window.innerHeight + 300; // +300 to make load earlier
			let bodyHeight = document.body.offsetHeight;
			
			if(scr >= bodyHeight) {
				let scrollNum = this.state.scroll;
				this.setState({scroll:++scrollNum}, this.getContacts)
			}
		}
	}
	
	deleteContact(person){
		let { contacts } = this.state;
		
		for (let i = 0; i < contacts.length; i++) {
				if(contacts[i].person === person){
					contacts[i].isDeleted = true;
					break;
				}	
		}
		
		
		fetch(`${API_URL}/addtocontact?p=${person}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
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
		let opened = this.state.msgBoxOpened;
		this.setState({msgBoxOpened: !opened, personToWrite:person});
	}
	
	render(){
		let { contacts, personToWrite } = this.state;
				
		return (
			<div className='contactsList'>
				{this.state.msgBoxOpened ? 
					<MsgBox
						openMsgBox = {this.openMsgBox}
						person = {personToWrite}
					/> : ''
				}
			{
				contacts.map((c) => {
					return (c.isDeleted) ? 
					''
					:
					(
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
								<button className='btn-success contactbuttons' onClick={() => this.openMsgBox(c.person)}>Отправить сообщение</button>
								<button className='btn-danger contactbuttons' onClick={() => this.deleteContact(c.person)}>Удалить из контактов</button>
							</div>
						</div>
					)
				})
			}
			</div>
		)
		
	}
		
}

export default withRouter(Contacts);
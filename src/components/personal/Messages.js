import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse, getToken,standardFetch,eventEmitter} from '../../helpers';
import {API_URL} from '../../config';
import MsgBox from './MsgBox';
import SingleMessage from './SingleMessage';
import './Messages.css'

class Messages extends React.Component {
	constructor(){
		super();
		this.state = {
			error:false,
			loading:false,
			msgBoxOpened:false,
			person:'', //to whom message, i.e. - me
			id:'', //from / to whom message, changes whether of chosen message
			messages:[],
			box:'in' //changes if its inbox or outbox
		}
		
		this.openMsgBox = this.openMsgBox.bind(this);
	}
	
	componentDidMount(){
		let me = getToken().id;
		
		this.setState({person:me});
		
		this.getMessages();
		this.listenToClickOnMessage();
	}
	
	getMessages(){	
		let box = this.state.box;
		this.setState({loading:true});
		
		
		fetch(`${API_URL}/getmessages/${box}`,standardFetch()) 
			.then(handleResponse)
			.then((rep)=>{
				this.setState({loading:false, messages:rep.messages});
				
			})
			.catch(error=>{
				console.log(error)
				this.setState({error:true, loading:false})
			})
	}
	
	listenToClickOnMessage(){
		eventEmitter.on('messageClick', (id) => this.openMsgBox(id) );
	}
		
	openMsgBox(id){
		let opened = this.state.msgBoxOpened;
		this.setState({msgBoxOpened: !opened, id});
	}
	
	setBox(box){
		this.setState({box}, ()=>{
			this.getMessages();
		});
	}
	
	render(){
	let {id, messages, box} = this.state;
	
	return (
		<div className="col-md-10">
		
			<div className='inbox-ooutbox'>
				<span className={'inbox ' + (box === 'in' ? 'active' : "")} onClick={()=>this.setBox('in')}>
					Входящие
				</span>
				<span className={'outbox ' + (box === 'out' ? 'active' : "")} onClick={()=>this.setBox('out')}>
					Отправленные
				</span>
			</div>
			
			{this.state.msgBoxOpened ? 
				<MsgBox
					openMsgBox = {this.openMsgBox}
					person = {id}
				/> : ''
			}
			
			<div className='messagesColumn'>
				{
					messages.map((m, i) => {
						return ( <SingleMessage key={m._id} box={box} data = {m}/>)
					})
				}
			</div>
		</div>
		)
	}	
}

export default  withRouter(Messages);
import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse, getToken,standardFetch} from '../../helpers';
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
			id:'', //from whom message, changes whether of chosen message
			messages:[]
		}
	}
	
	componentDidMount(){
		let me = getToken().id;
		
		this.setState({person:me})
		
		this.getMessages()
	}
	
	getMessages(){	
		let me = getToken().id;
		this.setState({loading:true});
		
		fetch(`${API_URL}/getmessages`,standardFetch()) //q means quantity of wall posts already loaded 
			.then(handleResponse)
			.then((rep)=>{
				console.log(rep);
				this.setState({loading:false, messages:rep.messages});
				
			})
			.catch(error=>{
				console.log(error)
				this.setState({error:true, loading:false})
			})
	}
	
	openMsgBox(){
		let opened = this.state.msgBoxOpened;
		this.setState({msgBoxOpened: !opened});
	}
		
	render(){
	let {id, messages} = this.state;
	
	return (
		<div className="col-md-10">
			{this.state.msgBoxOpened ? 
				<MsgBox
					openMsgBox = {this.openMsgBox}
					person = {id}
				/> : ''
			}
			<div className='messagesColumn'>
				{
					messages.map((m, i) => {
						return ( <SingleMessage key={m._id} data = {m}/>)
					})
				}
			</div>
		</div>
		)
	}	
}

export default  withRouter(Messages);
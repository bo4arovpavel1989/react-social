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
			page:0,
			isMore:true,
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
		let {box, page} = this.state;
		this.setState({loading:true});
		
		
		fetch(`${API_URL}/getmessages/${box}?page=${page}`, standardFetch()) 
			.then(handleResponse)
			.then((rep)=>{
				if(rep.messages.length === 10)
					this.setState({loading:false,  isMore:true, messages:rep.messages});
				else 
					this.setState({loading:false, isMore:false, messages:rep.messages});
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
		this.setState({box, page:0}, ()=>{
			this.getMessages();
		});
	}
	
	changePage(dir){
		let {page, isMore} = this.state;
		
		if (dir === 'next' && isMore) 
			this.setState({page: ++page}, () => this.getMessages())
		else if (page > 0)
			this.setState({page: --page}, () => this.getMessages())
	}
	
	render(){
	let {id, messages, box, page, isMore} = this.state;
	
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
			
			<div className='navButtons'>
				<button 
					disabled={page === 0 ? true : false} 
					onClick={() => this.changePage('prev')}
					className={'prevButton ' + (page > 0 ? 'activeButton' : '')}
				>
					&larr;
				</button>
				<button 
					disabled={isMore ? false : true} 
					onClick={() => this.changePage('next')} 
					className={'nextButton ' + (isMore ? 'activeButton' : '')}
				>
					&rarr;
				</button>
			</div>
			
		</div>
		)
	}	
}

export default  withRouter(Messages);
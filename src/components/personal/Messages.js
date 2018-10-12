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
			me:'', // To whom message, i.e. - me
			person:'', // From / to whom message, changes whether of chosen message
			messages:[],
			box:'in' // Changes if its inbox or outbox
		}

		this.banUser = this.banUser.bind(this);
		this.openMsgBox = this.openMsgBox.bind(this);
	}

	componentDidMount(){
		const me = getToken().id;

		this.setState({me});

		this.getMessages();
		this.listenToClickOnMessage();
	}

	getMessages(){
		const {box, page} = this.state,
			messagesPerTime = 10;

		this.setState({loading:true});


		fetch(`${API_URL}/getmessages/${box}?page=${page}`, standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(rep.messages.length === messagesPerTime)
					this.setState({loading:false, isMore:true, messages:rep.messages});
				else
					this.setState({loading:false, isMore:false, messages:rep.messages});
			})
			.catch(error=>{
				console.log(error)
				this.setState({error:true, loading:false})
			})
	}

	listenToClickOnMessage(){
		eventEmitter.on('messageClick', id=>this.openMsgBox(id));
	}

	openMsgBox(person){
		const opened = this.state.msgBoxOpened;

		this.setState({msgBoxOpened: !opened, person});
	}

	setBox(box){
		this.setState({box, page:0}, ()=>{
			this.getMessages();
		});
	}

	changePage(dir){
		let {page, isMore} = this.state;

		if (dir === 'next' && isMore)
			this.setState({page: ++page}, ()=>this.getMessages())
		else if (page > 0)
			this.setState({page: --page}, ()=>this.getMessages())
	}

	banUser(){
		const {person} = this.state;

		fetch(`${API_URL}/banuser?p=${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{

			})
			.catch(error=>{
				console.log(error)
			})
	}

	render(){
	const {messages, box, page, isMore, person} = this.state;

	return (
		<div className="col-md-10">

			<div className='inbox-ooutbox'>
				<span className={`inbox ${box === 'in' ? 'active' : ''}`} onClick={()=>this.setBox('in')}>
					Входящие
				</span>
				<span className={`outbox ${box === 'out' ? 'active' : ''}`} onClick={()=>this.setBox('out')}>
					Отправленные
				</span>
			</div>

			{this.state.msgBoxOpened ?
				<MsgBox
					openMsgBox = {this.openMsgBox}
					person = {person}
					banUser = {this.banUser}
				/> : ''
			}

			<div className='messagesColumn'>
				{
					messages.map((m, i)=><SingleMessage key={m._id} box={box} data = {m}/>)
				}
			</div>

			<div className='navButtons'>
				<button
					disabled={page === 0}
					onClick={()=>this.changePage('prev')}
					className={`prevButton ${page > 0 ? 'activeButton' : ''}`}
				>
					&larr;
				</button>
				<button
					disabled={!isMore}
					onClick={()=>this.changePage('next')}
					className={`nextButton ${isMore ? 'activeButton' : ''}`}
				>
					&rarr;
				</button>
			</div>

		</div>
		)
	}
}

export default withRouter(Messages);

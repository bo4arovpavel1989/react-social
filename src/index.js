import React from 'react';
import ReactDom from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './components/common/Header';
import Login from './components/common/Login';
import Register from './components/common/Register';
import NotAllowed from './components/common/NotAllowed';
import Personal from './components/personal/Personal';
import Contacts from './components/personal/Contacts';
import Messages from './components/personal/Messages';
import Options from './components/personal/Options';
import Sidebar from './components/personal/Sidebar';
import Edit from './components/personal/Edit';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {checkToken, getToken, eventEmitter, standardFetch, handleResponse} from './helpers';
import {API_URL} from './config';


class App extends React.Component {

	constructor(){
		super();
		this.state={
			isLogged:false,
			id:'',
			newMessages:0
		}

		this.listenToLogin = this.listenToLogin.bind(this);
		this.checkLogging = this.checkLogging.bind(this);
		this.logoff = this.logoff.bind(this);
		this.setLogin = this.setLogin.bind(this);
		this.checkNewMessages = this.checkNewMessages.bind(this);
	}

	componentDidMount(){
		this.checkLogging();
		this.listenToLogin();
	}

	componentWillUnmount(){
		this.removeListeners();
	}

	checkNewMessages() {
		if(this.state.isLogged)
			fetch(`${API_URL}/checknewmessages`,standardFetch())
				.then(handleResponse)
				.then(rep=>{
					if(rep !== this.state.newMessages)
						this.setState({newMessages:rep})
				})
				.catch(error=>{
					console.log(error)
					this.setState({error:true})
				});
	}

	checkMessagesInterval(){
		
	}

	listenToLogin(){
		eventEmitter.on('login', this.setLogin)
		eventEmitter.on('logoff',this.setLogoff)
	}

	removeListeners(){
		eventEmitter.removeListener('login', this.setLogin)
		eventEmitter.removeListener('logoff',this.setLogoff)
	}

	setLogin(){
		this.setState({isLogged:true})
	}

	setLogoff(){
		this.setState({isLogged:false})
	}

	checkLogging(){
		if(!getToken())
			return;

		checkToken(JSON.stringify(getToken()))
			.then(rep=>{
				if(!rep.err)
					this.setState({isLogged:rep.auth,id:getToken().id}, this.checkNewMessages)
			})
	}

	logoff(){
		localStorage.clear();

		if(getToken())
			fetch(`${API_URL}/logoff`,{
				method:'POST',
				mode:'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:getToken()
			});

		this.setState({isLogged:false});
	}

	render(){
		const {newMessages} = this.state;

		return (
		<BrowserRouter>
			<div className='container'>
				<Header
					isLogged={this.state.isLogged}
					logoff={this.logoff}
					id={this.state.id}
					checkNewMessages={this.checkNewMessages}
				/>

				<div className="row">
					{this.state.isLogged ?
						<div className="col-md-2">
							<Sidebar
								newMessages={newMessages}
								checkNewMessages={this.checkNewMessages}
							/>
						</div> : ''
					}
					<Switch>
						<Route path='/' render={this.state.isLogged ? Personal : Login} exact/>
						<Route path='/register' component={Register} exact/>
						<Route path='/personal/:id' render={this.state.isLogged ? Personal : NotAllowed} exact/>
						<Route path='/contacts' render={this.state.isLogged ? Contacts : NotAllowed} exact/>
						<Route path='/messages' render={this.state.isLogged ? Messages : NotAllowed} exact/>
						<Route path='/options' render={this.state.isLogged ? Options : NotAllowed} exact/>
						<Route path='/edit/:id' render={this.state.isLogged ? Edit : NotAllowed} exact/>
					</Switch>
				</div>
			</div>
		</BrowserRouter>
		);
	}
}

ReactDom.render(
	<App/>,
	document.getElementById('root')
)

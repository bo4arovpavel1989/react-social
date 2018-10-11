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
import {checkToken, getToken, eventEmitter} from './helpers';
import {API_URL} from './config';


class App extends React.Component {

	constructor(){
		super();
		this.state={
			isLogged:false,
			id:''
		}

		this.listenToLogin = this.listenToLogin.bind(this);
		this.checkLogging = this.checkLogging.bind(this);
		this.logoff = this.logoff.bind(this);
	}

	componentDidMount(){
		this.checkLogging();
		this.listenToLogin();
	}

	listenToLogin(){
		eventEmitter.on('login',()=>{
			this.setState({isLogged:true})
		})

		eventEmitter.on('logoff',()=>{
			this.setState({isLogged:false})
		})
	}

	checkLogging(){
		if(!getToken())
			return;

		checkToken(JSON.stringify(getToken()))
					.then(rep=>{
						if(!rep.err)
							this.setState({isLogged:rep.auth,id:getToken().id});
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
		return (
		<BrowserRouter>
			<div className='container'>
				<Header
					isLogged={this.state.isLogged}
					logoff={this.logoff}
					id={this.state.id}
				/>

				<div className="row">
					{this.state.isLogged ?
						<div className="col-md-2">
							<Sidebar/>
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

import React from 'react';
import ReactDom from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './components/common/Header';
import Login from './components/common/Login';
import Register from './components/common/Register';
import NotAllowed from './components/common/NotAllowed';
import Personal from './components/personal/Personal';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {checkToken,eventEmitter} from './helpers';


class App extends React.Component {
	
	constructor(){
		super();
		this.state={
			isLogged:false
		}
		
		this.listenToLogin = this.listenToLogin.bind(this);
		this.checkLogging = this.checkLogging.bind(this);
	}
	
	componentDidMount(){
		this.checkLogging();
		this.listenToLogin();
	}
	
	listenToLogin(){
		eventEmitter.on('login',()=>{
			console.log(this.state)
			//this.setState({islogged:true})
		})
	}
	
	checkLogging(){
		let token = localStorage.getItem('token');
		let login = localStorage.getItem('login');
		
		if(!token) 
			return;
		
		checkToken(JSON.stringify({token,login}))
					.then(rep=>{
						if(!rep.err)
							this.setState({isLogged:rep.auth});
					})
	}

	render(){
		return (
		<BrowserRouter>
			<div className='container'>
				<Header/>
				
				<Switch>
					<Route path='/' render={this.state.isLogged ? Personal : Login} exact/>
					<Route path='/register' component={Register} exact/>
					<Route path='/personal/:id' render={this.state.isLogged ? Personal : NotAllowed}/>
				</Switch>
			</div>
		</BrowserRouter>		
		);	
	}
}

ReactDom.render(
	<App/>,
	document.getElementById('root')
)
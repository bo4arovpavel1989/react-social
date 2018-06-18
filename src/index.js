import React from 'react';
import ReactDom from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './components/common/Header';
import Login from './components/common/Login';
import Register from './components/common/Register';
import Personal from './components/personal/Personal';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {checkToken} from './helpers';


class App extends React.Component {
	
	constructor(){
		super();
		this.state={
			isLogged:false
		}
	}
	
	componentDidMount(){
		this.checkLogging();
	}
	
	checkLogging(){
		let token = localStorage.getItem('token');
		let login = localStorage.getItem('login');
		
		if(!token) 
			return;
		
		checkToken(JSON.stringify({token,login}))
					.then(rep=>{
						console.log(rep)
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
					<Route path='/' component={Login} exact/>
					<Route path='/register' component={Register} exact/>
					<Route path='/personal/:id' component={Personal} exact/>
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
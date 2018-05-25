import React from 'react';
import ReactDom from 'react-dom';
import Header from './components/common/Header';
import Main from './components/common/Main';
import Register from './components/common/Register';
import Personal from './components/personal/Personal';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


const App = ()=>{
	return (
	<BrowserRouter>
		<div className='container'>
			<Header/>
			
			<Switch>
				<Route path='/' component={Main} exact/>
				<Route path='/register' component={Register} exact/>
				<Route path='/personal/"id' component={Personal} exact/>
			</Switch>
		</div>
	</BrowserRouter>		
	);	
}

ReactDom.render(
	<App/>,
	document.getElementById('root')
)
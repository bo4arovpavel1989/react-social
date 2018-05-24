import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


const App = ()=>{
	return (
	<div>
		HI
	</div>	
	);	
}

ReactDom.render(
	<App/>,
	document.getElementById('root')
)
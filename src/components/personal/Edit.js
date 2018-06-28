import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {checkToken,handleResponse,standardFetch} from '../../helpers';
import {API_URL} from '../../config';
import './Edit.css';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			login:'',
			error:false,
			data:{}
		}
		
	}
	
	componentDidMount(){
		
	}
	
	
	render(){
		return (
		<div></div>
		)
	}	
}

export default withRouter(Personal);
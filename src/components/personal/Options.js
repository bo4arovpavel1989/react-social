import React from 'react';
import {API_URL} from '../../config';
import {handleResponse, standardFetch} from '../../helpers';

class Options extends React.Component {
	constructor(){
		super();
		this.state = {
			error: false,
			loading:false
		}
		
	}
	
	componentDidMount(){
		this.getOptions();
	}
	
	getOptions(){
		this.setState({loading:true});
		
		fetch(`${API_URL}/getoptions`, standardFetch()) 
			.then(handleResponse)
			.then((rep)=>{
				
			})
			.catch(error=>{
				this.setState({error:true, loading:false})
			})
	}

	render(){
	
	return (
		<div>
		
			
		</div>
		)
	}	
}

export default Options;
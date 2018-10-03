import React from 'react';
import {withRouter} from 'react-router-dom';
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
				console.log(rep)
			})
			.catch(error=>{
				this.setState({error:true, loading:false})
			})
	}

	render(){
	
		if(this.state.error )
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)
			
	return (
		<div>
		
			
		</div>
		)
	}	
}

export default withRouter(Options);
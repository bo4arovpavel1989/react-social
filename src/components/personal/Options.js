import React from 'react';
import {withRouter} from 'react-router-dom';
import {API_URL} from '../../config';
import {handleResponse, standardFetch} from '../../helpers';
import SettingsForm from './forms/SettingsForm'

class Options extends React.Component {
	constructor(){
		super();

		this.state = {
			error: false,
			loading:false,
			data:[]
		}
	
	this.handleChange = this.handleChange.bind(this);
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
					this.setState({loading:false, data:rep})
			})
			.catch(error=>{
				this.setState({error:true, loading:false})
			})
	}
	
	handleSubmit(){
		
	}
	
	handleChange(e){
		console.log(this.state)
		
		let data = e.currentTarget.dataset;
		
		this.setState({ data} );
	}
	
	render(){
		let {error, data, loading} = this.state;

		if(error)
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)

		if(data.length === 0 || loading)
			return (
				<div>
					Загрузка...
				</div>
			)

		return (
			<div>
				<h1>Настройки</h1>

					<SettingsForm 
						data={data}
						loading={loading}
						handleSubmit={this.handleSubmit}
						handleChange={this.handleChange}
					/>


			</div>
			)

	}
}

export default withRouter(Options);

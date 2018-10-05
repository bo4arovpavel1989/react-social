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
			amIVisible:true
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
			.then(rep=>{
				console.log(rep)
					const newState = rep;

					newState.loading = false;
					this.setState(newState);
			})
			.catch(error=>{
				this.setState({error:true, loading:false})
			})
	}

	handleSubmit(){

	}

	handleChange(e){
		console.log(this.state)
		const field = e.target.id;
		this.settingsFormHandlers()[field]();
	}

	settingsFormHandlers(){
		return {
			amIVisible:()=>{
				this.setState({amIVisible:!this.state.amIVisible})
			}
		}
	}

	render(){
		const {error, amIVisible, loading} = this.state;

		if(error)
			return(
				<div>
					Произошла ошибка во время обработки запроса. Попробуйте позже!
				</div>
			)

		if(loading)
			return (
				<div>
					Загрузка...
				</div>
			)

		return (
			<div>
				<h1>Настройки</h1>

					<SettingsForm
						amIVisible={amIVisible}
						loading={loading}
						handleSubmit={this.handleSubmit}
						handleChange={this.handleChange}
					/>


			</div>
			)

	}
}

export default withRouter(Options);

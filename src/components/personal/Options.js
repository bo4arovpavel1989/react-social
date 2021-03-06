import React from 'react';
import {withRouter} from 'react-router-dom';
import {API_URL} from '../../config';
import {handleResponse, standardFetch, attouchCred} from '../../helpers';
import SettingsForm from './forms/SettingsForm'

class Options extends React.Component {
	constructor(){
		super();

		this.state = {
			error: false,
			loading:false,
			amIVisible:true,
			isWallOpened:true
		}

	this.handleSubmit = this.handleSubmit.bind(this);
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

	handleSubmit(e){
		e.preventDefault();

		this.setState({loading:true})

		const data = this.state;

		attouchCred(data);

		fetch(`${API_URL}/changesettings`,{
				method:'POST',
				mode:'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify(data)
			})
			.then(handleResponse)
			.then(rep=>{
				if(rep.success)
					this.setState({loading:false});
			})
			.catch(error=>{
				this.setState({loading:false});
			});

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
			},
			isWallOpened:()=>{
				this.setState({isWallOpened:!this.state.isWallOpened})
			}
		}
	}

	render(){
		const {error, amIVisible, isWallOpened, loading} = this.state;

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
						isWallOpened={isWallOpened}
						loading={loading}
						handleSubmit={this.handleSubmit}
						handleChange={this.handleChange}
					/>


			</div>
			)

	}
}

export default withRouter(Options);

import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse,standardFetch,getToken,attouchCred} from '../../helpers';
import {API_URL} from '../../config';
import './Edit.css';
import Avatar from './forms/Avatar';
import Data from './forms/Data';

class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true,
			error:false,
			data:{}
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.getFile = this.getFile.bind(this);
	}

	getPersonalData(person){
		fetch(`${API_URL}/personal/${person}`,standardFetch())
			.then(handleResponse)
			.then(rep=>{
				if(!rep.err && !rep.forbidden)
					this.setState({data:rep,loading:false})
				else if(rep.forbidden)
					this.setState({isLogged:false,loading:false})
				else
					this.setState({error:true})
			})
			.catch(error=>{
				this.setState({error:true})
			})
	}

	componentWillMount(){
		this.getPersonalData(localStorage.getItem('id'))
	}

	handleChange(e){
		const {data} = this.state;

		data[e.target.id] = e.target.value;

		this.setState({data});
	}

	handleSubmit(e){
		e.preventDefault();

		this.setState({loading:true})

		const {data} = this.state;

		attouchCred(data);

		fetch(`${API_URL}/edit`,{
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
					alert('Успешно сохранено!');
				this.setState({loading:false});

			})
			.catch(error=>{
				alert('Ошибка сохранения');
				this.setState({loading:false});
			});

	}

	handleUpload(e){
		e.preventDefault();

		this.setState({loading:true});

		const data = new FormData()

		data.append('file', this.uploadFile.files[0]);
		data.append('login', getToken().login);
		data.append('token', getToken().token);
		data.append('id', getToken().id);

		fetch(`${API_URL}/avatarupload`,{
				method:'POST',
				mode:'cors',
				body:data
			})
			.then(handleResponse)
			.then(rep=>{
				console.log(rep)
				if(rep.success)
					alert('Успешно сохранено!');
				if(rep.empty)
					alert('Изображение не загружено!')
				this.setState({loading:false});

			})
			.catch(error=>{
				alert('Ошибка во время сохранения!');
				this.setState({loading:false});
			});

	}

	getFile(ref){
		this.uploadFile = ref;
	}

	render(){

		return (
			<div>
				<h1>Расскажите о себе</h1>

				<Data
					data = {this.state.data}
					handleSubmit = {this.handleSubmit}
					handleChange = {this.handleChange}
				/>

				<Avatar
					loading = {this.state.loading}
					handleUpload = {this.handleUpload}
					getFile = {this.getFile}
				/>

				<div className="imgPreview">
				</div>

			</div>
		)
	}
}

export default withRouter(Personal);

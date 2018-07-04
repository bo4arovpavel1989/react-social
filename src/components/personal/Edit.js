import React from 'react';
import {withRouter} from 'react-router-dom';
import {handleResponse,standardFetch,attouchCred} from '../../helpers';
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
			data:{},
			file:''
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
	}
	
	getPersonalData(person){
		fetch(`${API_URL}/personal/${person}`,standardFetch())
			.then(handleResponse)
			.then((rep)=>{
				console.log(rep);
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
		let data = this.state.data;
		
		data[e.target.id] = e.target.value;
		
		this.setState({data});
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		this.setState({loading:true})
		
		let data = this.state.data;
		
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
			.then((rep)=>{
				if(rep.success) 
					alert('Успешно сохранено!');
				this.setState({loading:false});
				
			})
			.catch((error) => {
				alert('Ошибка сохранения');
				this.setState({loading:false});
			});
		
	}
	
	handleUpload(e){
		e.preventDefault();
		
		this.setState({loading:true});
		
		let data = new FormData()
		data.append('file', this.state.file);
		data.append('user', 'hubot');
		
		console.log(this.state.file)
	}
	
	handleImageChange(e){
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => this.setState({file})
		
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
					handleImageChange = {this.handleImageChange}
				/>
				
				<div className="imgPreview">
				</div>
				
			</div>
		)
	}	
}

export default withRouter(Personal);
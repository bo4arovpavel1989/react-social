import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {checkToken,handleResponse,standardFetch,attouchCred} from '../../helpers';
import {API_URL} from '../../config';
import './Edit.css';

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
	
	render(){
		let data = this.state.data;
		
		return (
			<div>
				<h1>Расскажите о себе</h1>
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="name" className="col-sm-2 control-label">Имя</label>
						<div className="col-sm-10">
							<div className="input-group">
								<input type="text"  value={data.name} id="name" placeholder="Ваше имя..." onChange={this.handleChange}/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="date" className="col-sm-2 control-label">Дата рождения</label>
						<div className="col-sm-10">
							<div className="input-group">
								<input type="date"  value={data.birthDate ? data.birthDate.split('T')[0] : ''} id="birthDate" onChange={this.handleChange}/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="activity" className="col-sm-2 control-label">Род деятельности</label>
						<div className="col-sm-10">
							<div className="input-group">
								<input type="text"  value={data.activity} id="activity" onChange={this.handleChange}/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<input  disabled={this.state.loading ? true : false} className="btn btn-primary btn-lg" type="submit" value="Сохранить"/>
						</div>
					</div>
				</form>
			</div>
		)
	}	
}

export default withRouter(Personal);
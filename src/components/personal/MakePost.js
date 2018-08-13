import React from 'react';
import {handleResponse,attouchCred,eventEmitter} from '../../helpers';
import {API_URL} from '../../config';
import './MakePost.css';

class MakePost extends React.Component {
	constructor(){
		super();
		this.state = {
			allFieldsUsed:false,
			post:'',
			loading:false
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(e) {
		let post = e.target.value;
		this.setState({post, allFieldsUsed:(post !== '')});
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		this.setState({loading:true});
		
		let data = {};
			data.post = this.state.post;
			data.person = this.props.id;
		
		attouchCred(data);
		
		fetch(`${API_URL}/makepost`,{
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
				this.setState({loading:false});
				eventEmitter.emit('newpost');
			})
			.catch((error) => {
				this.setState({loading:false});
			});
		
	}
	render(){
		return (	
				<form className="makepostform form-inline" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="col-sm-10">
							<div className="input-group">
								<input type="login" onChange={this.handleChange} className="form-control" id="post" placeholder="Ваше сообщение..." />
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<input disabled={this.state.allFieldsUsed ? false : true} className="btn btn-primary btn-lg" type="submit" value="Отправить"/>
						</div>
					</div>
				</form>
			)
	}	
}

export default  MakePost;
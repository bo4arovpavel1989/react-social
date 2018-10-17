import React from 'react';
import PropTypes from 'prop-types';
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
		const post = e.target.value;

		this.setState({post, allFieldsUsed:post !== ''});
	}

	handleSubmit(e){
		e.preventDefault();

		this.setState({loading:true});

		const data = {};

			data.post = this.state.post;
			data.owner = this.props.id; // Owner of the wall

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
			.then(rep=>{
				this.setState({loading:false});
				eventEmitter.emit('newpost');
			})
			.catch(error=>{
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
							<input disabled={!this.state.allFieldsUsed} className="btn btn-primary btn-lg" type="submit" value="Отправить"/>
						</div>
					</div>
				</form>
			)
	}
}

MakePost.propTypes = {
	id: PropTypes.string.isRequired
}

export default MakePost;

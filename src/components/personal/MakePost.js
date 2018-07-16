import React from 'react';
import {handleResponse,standardFetch,getToken,attouchCred} from '../../helpers';
import {API_URL} from '../../config';

class MakePost extends React.Component {
	constructor(){
		super();
		this.state = {
			allFieldsUsed:false,
			post:{},
			loading:false
		}
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(e) {
		let post = e.target.value;
		this.setState({post, allFieldsUsed:(post !== '')});
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		this.setState({loading:true});
		
		let data = this.state.post;
		
		attouchCred(data);
		
	}
	render(){
		return (	
			<div>
				<form className="form-inline" onSubmit={this.handleSubmit}>
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
			</div>
			)
	}	
}

export default  MakePost;
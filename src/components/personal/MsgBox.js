import React from 'react';
import PropTypes from 'prop-types';
import {handleResponse,attouchCred} from '../../helpers';
import {API_URL} from '../../config';
import './MsgBox.css'

class MsgBox extends React.Component {
	constructor(){
		super();
		
		this.state = {
			message:'',
			person:'', //who will receive the message,
			loading:false,
			error:false
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	componentWillMount(){
		let {openMsgBox, person} = this.props;
		
		this.setState({openMsgBox, person});
	}
	
	
	handleChange(e){
		let message = e.target.value.toString();
		
		this.setState({message});
	}
	
	handleSubmit(e){
		e.preventDefault();
		let {message, person} = this.state;
		let data = {message, person};
		
		this.setState({loading:true})
		
		attouchCred(data);
		
		fetch(`${API_URL}/sendmessage`,{
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
				this.state.openMsgBox();				
			})
			.catch((error) => {
				console.log(error)
				this.setState({loading:false, error:true});
			});
	}
	
	
	
	render(){
	
	let {openMsgBox, error, message, loading} = this.state;
	
	return (
		<div className='msgBoxContainer'>
			<div className='blur' onClick={openMsgBox}></div>
			<div className={'msgBox ' + (error ? 'error' : '')}>
				<form className="sendmsgform" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="input-group">
							<textarea onChange={this.handleChange} className="form-control msgtext">
							</textarea>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<input disabled={(message === '') || (loading) ? true : false} className="btn btn-primary btn-lg msgbutton" type="submit" value="Отправить"/>
						</div>
					</div>
				</form>
			</div>
		</div>	
		)
	}	
}

MsgBox.propTypes = {
	openMsgBox: PropTypes.func.isRequired,
	person: PropTypes.string
}

export default  MsgBox;
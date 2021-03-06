import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {handleResponse,attouchCred,standardFetch} from '../../helpers';
import {API_URL} from '../../config';
import './MsgBox.css'

class MsgBox extends React.Component {
	constructor(){
		super();

		this.state = {
			message:'',
			person:'', // Who will receive the message,
			loading:false,
			error:false,
			iAmBanned:false,
			iHaveBanned:false,
			name:''
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount(){
		const {openMsgBox, person} = this.props;
		console.log(this.props);
		this.setState({openMsgBox, person}, ()=>{
			this.getUserData();
			this.checkIAmBanned();
			this.checkIBannedPerson();
		});
	}

	checkIAmBanned(){
		const {person} = this.state;

		fetch(`${API_URL}/checkban/${person}`, standardFetch())
			.then(handleResponse)
			.then(rep=>{
				const {iAmBanned} = rep;

				this.setState({iAmBanned});
			})
			.catch(error=>{
				console.log(error)
			})
	}

	checkIBannedPerson(){
		const {person} = this.state;

		fetch(`${API_URL}/checkmyban/${person}`, standardFetch())
			.then(handleResponse)
			.then(rep=>{
				const {iHaveBanned} = rep;

				this.setState({iHaveBanned});
			})
			.catch(error=>{
				console.log(error)
			})

	}

	handleChange(e){
		const message = e.target.value.toString();

		this.setState({message});
	}

	getUserData(){
		const {person} = this.state;

		fetch(`${API_URL}/post-personal/${person}`, standardFetch())
			.then(handleResponse)
			.then(rep=>{
				const {name, isBanned} = rep;

				this.setState({name, isBanned});
			})
			.catch(error=>{
				console.log(error)
			})
	}

	handleSubmit(e){
		e.preventDefault();
		const {message, person} = this.state,
			data = {message, person};

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
			.then(rep=>{
				this.state.openMsgBox();
			})
			.catch(error=>{
				console.log(error)
				this.setState({loading:false, error:true});
			});
	}


	render(){

	const {openMsgBox, error, message, loading, person, name, iAmBanned, iHaveBanned} = this.state,
		{banUser} = this.props;

	return (
		<div className='msgBoxContainer'>

			<div className='blur' onClick={openMsgBox}></div>

			<div className={`msgBox ${error || iAmBanned ? 'error' : ''}`}>

				<div className='messageName'>
					<Link to={`/personal/${person}`}>
						{name}
					</Link>
					{
						iAmBanned ?
							' ограничил круг лиц, которые могут отправлять ему сообщения'
						:
							':'
					}
				</div>

				<form className="sendmsgform" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="input-group">
							<textarea onChange={this.handleChange} className="form-control msgtext">
							</textarea>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-2">
							{
								iHaveBanned ?
									<button
										className='btn btn-link banButton'
										onClick={e=>banUser(e)
												.then(()=>this.checkIBannedPerson())
										}
									>
										Разблокировать пользователя
									</button>	:
									<button
										className='btn btn-link banButton'
										onClick={e=>banUser(e)
												.then(()=>this.checkIBannedPerson())
										}
										>
											Заблокировать пользователя
										</button>
							}
						</div>
						<div className="col-sm-2">
							<input disabled={Boolean(iAmBanned || message === '' || loading)} className="btn btn-primary btn-lg msgbutton" type="submit" value="Отправить"/>
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
	person: PropTypes.string,
	banUser: PropTypes.func.isRequired
}

export default withRouter(MsgBox);

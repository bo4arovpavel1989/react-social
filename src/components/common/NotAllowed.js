import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class NotAllowed extends React.Component	{
	constructor(){
		super();
	}
		
	render(){
		return (
		<div>
			Пожалуйста, <Link to={`/`}>залогиньтесь</Link>, чтобы продолжить!
		</div>
		);
	}
}

export default withRouter(NotAllowed);
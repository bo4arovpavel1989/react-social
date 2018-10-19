import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css'

const Header = props=>{
	const {isLogged, logoff, id, checkNewMessages} = props;

	return (
		<div>
			<Link className='header' to='/' onClick={checkNewMessages}>
				<h1>React Social</h1>
			</Link>
			{
				isLogged ?
					<div className='pull-right logoff'>
						<Link to={`/edit/${id}`}>
							Редактировать страницу
						</Link>
						<a className='pull-right' onClick={logoff}>
							Выйти
						</a>
					</div> : ''
			}
		</div>
		)
}

Header.propTypes = {
	isLogged: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	logoff: PropTypes.func.isRequired
}

export default withRouter(Header);

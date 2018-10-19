import React from 'react';
import PropTypes from 'prop-types';
import {Link,withRouter} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = props=>{
	const {newMessages,checkNewMessages} = props;

	return (
		<div>
				<Link to='/'>
					<button className='btn-primary sidebutton' onClick={checkNewMessages}>Моя страница</button>
				</Link>
				<Link to='/contacts'>
					<button className='btn-primary sidebutton' onClick={checkNewMessages}>Контакты</button>
				</Link>
				<Link to='/messages'>
					<button className='btn-primary sidebutton' onClick={checkNewMessages}>Сообщеньки
						{
							newMessages > 0 ?
							` (${newMessages})`	:
							''
						}
					</button>
				</Link>
				<Link to='/options'>
					<button className='btn-primary sidebutton' onClick={checkNewMessages}>Настройки</button>
				</Link>
			</div>
		)
	}

Sidebar.propTypes = {
	newMessages:PropTypes.number.isRequired,
	checkNewMessages:PropTypes.func.isRequired
}

export default withRouter(Sidebar);

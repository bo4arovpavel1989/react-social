import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (props) => {
	
	return (	
			<div>
				<Link to='/'>
					<button className='btn-primary sidebutton'>Моя страница</button>
				</Link>
				<Link to='/messages'>
					<button className='btn-primary sidebutton'>Мои сообщеньки</button>
				</Link>
				<Link to='/options'>
					<button className='btn-primary sidebutton'>Мои настройки</button>
				</Link>
			</div>
		)
}

export default  withRouter(Sidebar);
import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (props) => {
	const {} = props;
	
	return (	
			<div>
				<Link to='/'>
					<button className='btn-success sidebutton'>Моя страница</button>
				</Link>
				<Link to='/messages'>
					<button className='btn-success sidebutton'>Мои сообщеньки</button>
				</Link>
				<Link to='/options'>
					<button className='btn-success sidebutton'>Мои настройки</button>
				</Link>
			</div>
		)
}

export default  withRouter(Sidebar);
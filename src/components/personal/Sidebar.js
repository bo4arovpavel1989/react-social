import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = props=>{
	const {newMessages} = props;

	return (
		<div>
				<Link to='/'>
					<button className='btn-primary sidebutton'>Моя страница</button>
				</Link>
				<Link to='/contacts'>
					<button className='btn-primary sidebutton'>Контакты</button>
				</Link>
				<Link to='/messages'>
					<button className='btn-primary sidebutton'>Сообщеньки
						{
							newMessages > 0 ?
							` (${newMessages})`	:
							''
						}
					</button>
				</Link>
				<Link to='/options'>
					<button className='btn-primary sidebutton'>Настройки</button>
				</Link>
			</div>
		)
	}


export default withRouter(Sidebar);

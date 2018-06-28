import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import './Header.css'

const Header = (props) => {
	const {isLogged, logoff, id} = props;
	
	return (
		<div>
			<Link to='/'>
				<h1>React Social</h1>
			</Link>
			{
				isLogged ?
					(<div className='pull-right logoff'>
						<Link to={`/edit/${id}`}>
							Редактировать страницу
						</Link>
						<a className='pull-right' onClick={logoff}>
							Выйти
						</a>
					</div>) : ''
			}
		</div>	
		)
}

export default  withRouter(Header);
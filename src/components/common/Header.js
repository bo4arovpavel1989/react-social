import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import './Header.css'

const Header = (props) => {
	const {isLogged, logoff} = props;
	
	return (
		<div>
			<Link to='/'>
				<h1>React Social</h1>
			</Link>
			{
				isLogged ?
					(<div className='pull-right logoff'>
						<a className='pull-right' onClick={logoff}>
							Выйти
						</a>
					</div>) : ''
			}
		</div>	
		)
}

export default  withRouter(Header);
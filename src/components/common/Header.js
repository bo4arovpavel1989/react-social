import React from 'react';
import {Link} from 'react-router-dom';

const Header = (props) => {
	const {isLogged, logoff} = props;
	
	return (
		<div>
			<Link to='/'>
				<h1>React Social</h1>
			</Link>
			{
				isLogged ?
					(<div className='pull-right'>
						<a className='pull-right logoff' onClick={logoff}>
							Выйти
						</a>
					</div>) : ''
			}
		</div>	
		)
}

export default Header;
import React from 'react';
import {Link,withRouter} from 'react-router-dom';

const Wall = (props) => {
	const {} = props;
	
	return (	
			<div className='text-center'>	
				Это стена
			</div>
		)
}

export default  withRouter(Wall);
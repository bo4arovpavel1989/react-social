import React from 'react';
import './AvatarPlace.css';

const AvatarPlace = (props) => {
	const {img} = props;
	
	return (	
			<div>
				<div className='avatar'>
					<img src={img} alt='avatar' className='avatarImage'/>
				</div>
			</div>
		)
}

export default  AvatarPlace;
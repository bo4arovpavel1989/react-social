import React from 'react';
import './AvatarPlace.css';
import PropTypes from 'prop-types';

const AvatarPlace = (props) => {
	const {img,myPage} = props;
	
	return (	
			<div>
				<div className='avatar text-center'>
					<div>
						<img src={img} alt='avatar' className='avatarImage'/>
					</div>
					{myPage ? '' :
						<div className='text-center'>
							<button className='btn-success messageButton btn-lrg'>Отправить сообщение</button>
						</div>
					}
						
				</div>
			</div>
		)
}

AvatarPlace.propTypes = {
	img: PropTypes.string,
	myPage:PropTypes.bool.isRequired
}

export default  AvatarPlace;
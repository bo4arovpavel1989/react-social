import React from 'react';
import './AvatarPlace.css';
import PropTypes from 'prop-types';

const AvatarPlace = (props) => {
	const {img,myPage,openMsgBox} = props;
	
	return (	
			<div>
				<div className='avatar text-center'>
					<div>
						<img src={img} alt='avatar' className='avatarImage'/>
					</div>
					{myPage ? '' :
						<div className='text-center'>
							<div>
								<button onClick={openMsgBox} className='btn-success messageButton btn-lrg'>Отправить сообщение</button>
							</div>
							<div>
								<button className='btn-success messageButton btn-lrg'>Добавить в контакты</button>
							</div>
						</div>
					}
						
				</div>
			</div>
		)
}

AvatarPlace.propTypes = {
	img: PropTypes.string,
	myPage:PropTypes.bool.isRequired,
	openMsgBox:PropTypes.func.isRequired
}

export default  AvatarPlace;
import React from 'react';
import './AvatarPlace.css';
import PropTypes from 'prop-types';

const AvatarPlace = (props) => {
	const {img,myPage,openMsgBox, isContact, addToContacts, isBanned, banUser} = props;
	
	return (	
			<div>
				<div className='avatar text-center'>
					<div>
						<img src={img} alt='avatar' className='avatarImage'/>
					</div>
					{myPage ? '' :
						<div className='text-center'>
							<div>
								<button onClick={openMsgBox} className='btn-success messageButton btn-lg'>Отправить сообщение</button>
							</div>
							<div>
							{
								isContact ? 
								<button className='btn-danger' onClick={addToContacts}>Удалить</button>
								:
								<button className='btn-success' onClick={addToContacts}>Добавить</button>
							}
							{
								isBanned ? 
								<button className='btn-secondary ban' onClick={banUser}>Разблокировать</button>
								:
								<button className='btn-secondary ban' onClick={banUser}>Заблокировать</button>
							}
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
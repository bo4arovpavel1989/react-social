import React from 'react';

const PersonalData = (props) => {
	const {data} = props;
	
	if (data.birthDate)
		data.birthDate = data.birthDate.split('T')[0];
	
	
	return (	
			<div>
				<div>
					<h3>{data.name}</h3>
				</div>
				<div>
					Дата рождения: {data.birthDate}
				</div>
				<div>
					Деятельность: {data.activity}
				</div>
			</div>
		)
}

export default  PersonalData;
import React from 'react';
import PropTypes from 'prop-types';

const Data = props=>{
	const {data, handleSubmit, handleChange, loading} = props;

	return (
			<form className="form-horizontal" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="name" className="col-sm-2 control-label">Имя</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="text" value={data.name} id="name" placeholder="Ваше имя..." onChange={handleChange}/>
						</div>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="date" className="col-sm-2 control-label">Дата рождения</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input type="date" value={data.birthDate ? data.birthDate.split('T')[0] : ''} id="birthDate" onChange={handleChange}/>
						</div>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="activity" className="col-sm-2 control-label">Род деятельности</label>
						<div className="col-sm-10">
						<div className="input-group">
							<input type="text" value={data.activity} id="activity" onChange={handleChange}/>
						</div>
					</div>
				</div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-10">
						<input disabled={loading} className="btn btn-primary btn-lg" type="submit" value="Сохранить"/>
					</div>
				</div>
			</form>
		)
}

Data.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
}

export default Data;

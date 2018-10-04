import React from 'react';
import PropTypes from 'prop-types';

const SettingsForm = (props) => {
	const {data, handleSubmit, loading, handleChange} = props;

	return (
			<div>
				<form className="form-horizontal" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="visibility" className="col-sm-2">Скрыть страницу</label>
						<div className="col-sm-6">
							<div className="input-group">
								<input id='visibility' type="checkbox" checked={!data.amIVisible} data-field='visibility' onChange={handleChange}/>
							</div>
						</div>
					</div>
					
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<input  disabled={loading ? true : false} className="btn btn-primary btn-lg" type="submit" value="Сохранить"/>
						</div>
					</div>
				</form>		
			</div>
		)
}

SettingsForm.propTypes = {
	data: PropTypes.object,
	handleSubmit: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
}

export default SettingsForm;

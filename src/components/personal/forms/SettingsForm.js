import React from 'react';
import PropTypes from 'prop-types';

const SettingsForm = props=>{
	const {amIVisible, handleSubmit, loading, handleChange} = props;

	return (
			<div>
				<form className="form-horizontal" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="amIVisible" className="col-sm-2">Мою страницу видят все</label>
						<div className="col-sm-6">
							<div className="input-group">
								<input id='amIVisible' type="checkbox" checked={amIVisible} data-field='visibility' onChange={handleChange}/>
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<input disabled={loading} className="btn btn-primary btn-lg" type="submit" value="Сохранить"/>
						</div>
					</div>
				</form>
			</div>
		)
}

SettingsForm.propTypes = {
	amIVisible: PropTypes.bool,
	handleSubmit: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
}

export default SettingsForm;

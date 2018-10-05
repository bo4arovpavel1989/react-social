import React from 'react';
import PropTypes from 'prop-types';

const Avatar = props=>{
	const {loading, handleUpload, getFile} = props;

	return (
			<form className="form-horizontal" onSubmit={handleUpload}>
				<div className="form-group">
					<label htmlFor="name" className="col-sm-2 control-label">Аватар</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input className="fileInput" ref={getFile} type="file" />
						</div>
					</div>
				</div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-10">
						<input disabled={loading} className="btn btn-primary btn-lg" type="submit" value="Загрузить фото"/>
					</div>
				</div>
			</form>
		)
}

Avatar.propTypes = {
	getFile: PropTypes.func.isRequired,
	handleUpload: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
}

export default Avatar;

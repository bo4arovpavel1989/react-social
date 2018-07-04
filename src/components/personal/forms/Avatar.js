import React from 'react';

const Avatar = (props) => {
	const {loading, handleImageChange, handleUpload} = props;
	
	return (	
			<form className="form-horizontal" onSubmit={handleUpload}>
				<div className="form-group">
					<label htmlFor="name" className="col-sm-2 control-label">Аватар</label>
					<div className="col-sm-10">
						<div className="input-group">
							<input className="fileInput"   type="file"  onChange={handleImageChange} />
						</div>
					</div>
				</div>
				<div className="form-group">
					<div className="col-sm-offset-2 col-sm-10">
						<input  disabled={loading ? true : false} className="btn btn-primary btn-lg" type="submit" value="Загрузить фото"/>
					</div>
				</div>
			</form>
		)
}

export default  Avatar;
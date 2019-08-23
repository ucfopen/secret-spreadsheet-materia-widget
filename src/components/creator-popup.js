import React from 'react'

export default class Popup extends React.Component {
	render() {
		return (
			<div className='popup'>
				<div className='popup-inner'>
					<label><strong>Give your Spreadsheet widget a title</strong></label>
					<form className="title-container" onSubmit={this.props.onSubmit}>
						<input autoFocus={true} className="popup-input" required="required" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
						<input className="popup-submit" type="submit" value="Done"/>
					</form>
				</div>
			</div>
		)
	}
}

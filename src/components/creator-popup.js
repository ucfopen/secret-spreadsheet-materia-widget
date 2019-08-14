import React from 'react'
import ReactDOM from 'react-dom'

class Popup extends React.Component {
	render() {
		return (
			<div className='popup'>
				<div className='popup-inner'>
					<form className="title-container" onSubmit={this.props.onSubmit}>
						<input className="popup-input" required="required" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
						<input type="submit" value="Submit"/>
					</form>
				</div>
			</div>
		)
	}
}

export default Popup

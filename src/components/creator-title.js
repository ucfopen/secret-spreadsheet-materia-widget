import React from 'react'
import ReactDOM from 'react-dom'

// TODO: auto set focus to 'title-input' after 'edit title' is pressed

class Title extends React.Component {
	render() {
		return (
			<div>
				{this.props.hasTitle === true ?
				<div className="title-container">
					<span className="title-text">{this.props.title}</span>
					<button className="edit-title-button" onClick={this.props.editTitle}>Edit title</button>
				</div>
			:
				<div>
					<input required="required" className="title-input" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
					<button className="edit-title-button" onClick={this.props.editTitle}>Save title</button>
				</div>}
			</div>
		)
	}
}

export default Title

import React from 'react'
import ReactDOM from 'react-dom'

// TODO: auto set focus to 'title-input' after 'edit title' is pressed

class Title extends React.Component {
	render() {
		return (
			<div className="title-container">
				<span className="title-text">{this.props.title}</span>
				<button className="edit-title-button" onClick={this.props.editTitle}>Edit title</button>
			</div>
		)
	}
}

export default Title

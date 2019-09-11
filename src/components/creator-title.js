import React from 'react'

export default class Title extends React.Component {
	render() {
		return (
			<div className="title-container">
				<span className="title-text">{this.props.title}</span>

				<button className="edit-title-button" onClick={this.props.editTitle}>Edit title</button>

				<button
					className="help-button"
					type="button" value="Help"
					onClick={this.props.showIntro}
				>
					<img src="./assets/img/question-mark.png" />Help
				</button>
			</div>
		)
	}
}

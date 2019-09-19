import React from 'react'

const Title = props => {
	return (
		<div className="title-bar">
			<span className="title-text">{props.title}</span>

			<button className="edit-title-button" onClick={props.editTitle}>Edit title</button>

			<button
				className="help-button"
				type="button" value="Help"
				onClick={props.showIntro}
			>
				<img src="./assets/img/question-mark.png" />Help
			</button>
		</div>
	)
}

export default Title

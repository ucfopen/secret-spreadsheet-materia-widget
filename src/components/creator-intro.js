import React from 'react'

export default class Intro extends React.Component {
	render() {
		return (
			<div className="popup">
				<div className="popup-inner">
					<h2>Secret Spreadsheet - How it works:</h2>

					<div>
						<img src='assets/img/player-instruction-placeholder.jpg'/>
						<p>You'll create a spreadsheet and choose which cells to hide.</p>
						<p>Students will attempt to fill in the hidden cells correctly.</p>
					</div>

					<form className="title-container" onSubmit={this.props.onSubmit}>
						<label htmlFor="intro-popup"><strong>Start by giving your Spreadsheet widget a title</strong></label>

						<input
							id="intro-popup"
							autoFocus={true}
							className="popup-input"
							required="required"
							type="text"
							placeholder="My Spreadsheet Widget"
							value={this.props.title}
							onChange={this.props.onChange}
						/>

						<input className="popup-submit" type="submit" value="Get Started"/>
					</form>
				</div>
			</div>
		)
	}
}

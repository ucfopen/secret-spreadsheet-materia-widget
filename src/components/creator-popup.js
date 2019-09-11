import React from 'react'

export default class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-inner">
					<h2 className={this.props.showIntro ? "" : "popup-hidden"}>Secret Spreadsheet - How it works:</h2>
					<div className={this.props.showIntro ? "" : "popup-hidden"}>
						<img src='assets/img/creator-tutorial.jpg'/>
						<p>You'll create a spreadsheet and choose which cells to hide.</p>
						<p>Students will attempt to fill in the hidden cells correctly.</p>
					</div>
					<label>
						<strong>{this.props.showIntro ? "Start by giving your Spreadsheet widget a title" : "Give your Spreadsheet widget a title"}</strong>
					</label>
					<form className="title-container" onSubmit={this.props.onSubmit}>
						<input autoFocus={true} className="popup-input" required="required" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
						<input className="popup-submit" type="submit" value="Get Started"/>
					</form>
        </div>
      </div>
    )
  }
}

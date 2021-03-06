import React from 'react';

const Popup = props => {
	return (
		<div className="popup">
			<div className="popup-inner">
				<h2 className={props.showIntro ? `` : `popup-hidden`}>Secret Spreadsheet - How it works:</h2>
				<div className={props.showIntro ? `` : `popup-hidden`}>
					<img src="assets/img/helper-pic.svg"/>
					<p>You'll create a spreadsheet and choose which cells to hide.</p>
					<p>Students will attempt to fill in the hidden cells correctly.</p>
				</div>
				<form className="title-container" onSubmit={props.onSubmit}>
					<label htmlFor="name-popup">
						<strong>{props.showIntro ? `Start by giving your Spreadsheet widget a title` : `Give your Spreadsheet widget a title`}</strong>
					</label>
					<input id="name-popup" autoFocus={true} className="popup-input" required="required" type="text" placeholder="My Spreadsheet Widget" value={props.title} onChange={props.onChange}/>
					<input className="popup-submit" type="submit" value="Get Started"/>
				</form>
			</div>
		</div>
	);
};

export default Popup;

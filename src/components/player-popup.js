import React from 'react';

const Popup = props => {
	return(
		<div className="popup">
			<div>
				<h2>Secret Spreadsheet - How it works:</h2>

				<img src="assets/player-instruction-placeholder.jpg" alt="Secret Spreadsheet Instructions" />

				<button type="button" value="Got it!" onClick={props.handlePopupToggle}>
					Got it!
				</button>
			</div>
		</div>
	);
};

export default Popup

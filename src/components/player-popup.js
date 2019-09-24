import React from 'react';

const Popup = props => {
	return(
		<div className="popup help">
			<div>
				<h2>Secret Spreadsheet - How it works:</h2>

				<div>
					<img src="assets/img/player-instruction-placeholder.jpg" alt="Secret Spreadsheet Instructions" />

					<p>Cells of this spreadsheet have been <strong>intentionally hidden.</strong></p>

					<p>Input the hidden data correctly <strong>(capitalization matters!)</strong> to restore the spreadsheet.</p>
				</div>

				<button type="button" value="Got it!" onClick={props.handlePopupToggle}>
					Got it!
				</button>
			</div>
		</div>
	);
};

export default Popup

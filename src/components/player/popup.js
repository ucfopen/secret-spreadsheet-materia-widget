import React from 'react';

// popup containing instructions on how to use the wdget
const Popup = props => {
	return(
		<div className="popup help">
			<div>
				<h2>Secret Spreadsheet - How it works:</h2>

				<div>
					<img src="assets/img/helper-pic.svg" alt="Secret Spreadsheet Instructions" />

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

export default Popup;

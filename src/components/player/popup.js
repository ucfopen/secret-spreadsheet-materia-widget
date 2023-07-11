import React from 'react';

const fullAriaString = "Secret Spreadsheet widget instructions. " +
	"Cells of this spreadsheet have been intentionally hidden. " +
	"Navigate the spreadsheet and input the hidden data until all cells have been filled. " +
	"Capitalization and punctuation must be precise to match correctly. " +
	"Navigate the table using your screen reader's dedicated key bindings, or use the tab key to move between blank cells."

// popup containing instructions on how to use the wdget
const Popup = props => {
	return (
		<div className="popup help">
			<div>
				<h2 aria-label={fullAriaString}
					tabIndex="0">
					Secret Spreadsheet - How it works:
				</h2>

				<div>
					<img src="assets/img/helper-pic.svg" alt="Secret Spreadsheet Instructions" />
					<p>Cells of this spreadsheet have been <strong>intentionally hidden.</strong></p>
					<p>Input the hidden data correctly <strong>(capitalization matters!)</strong> to restore the spreadsheet.</p>
				</div>

				<button type="button"
					value="Got it!" onClick={props.handlePopupToggle}
					tabIndex="0">
					Got it!
				</button>
			</div>
		</div>
	);
};

export default Popup;

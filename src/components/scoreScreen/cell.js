import React from 'react';

const Cell = props => {
	if (props.answerable) {
		const leftAlign = props.leftAlign ? ` leftAlign`:``;
		let correct;

		if (props.correct || props.checked) {
			correct = `right`;
		}
		else {
			correct = `wrong`;
		}

		return(
			<td id={props.id} className={`${correct}${leftAlign}`}>
				<p>{props.checked ? props.displayText:props.answer}</p>
			</td>
		);
	}
	else {
		return(
			<td id={props.id} className={props.leftAlign ? `leftAlign`:``}>{props.displayText}</td>
		);
	}
};

export default Cell;

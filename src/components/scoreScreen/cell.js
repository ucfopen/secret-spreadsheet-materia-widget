import React from 'react';

const Cell = props => {
	if (props.answerable) {
		const leftAlign = props.leftAlign ? ` leftAlign`:``;
		let correct;
		let different = false;

		if (props.correct || props.checked) {
			correct = `right`;
		}
		else {
			correct = `wrong`;
		}

		if (props.correct && !props.checked) {
			different = true;
		}

		return(
			<td id={props.id} className={`${correct}${leftAlign}${different ? ` different`:``}`}>
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

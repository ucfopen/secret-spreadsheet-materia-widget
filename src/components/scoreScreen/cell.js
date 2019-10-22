import React from 'react';

const Cell = props => {
	if (props.answerable) {
		const leftAlign = props.leftAlign ? ` leftAlign`:``;
		const correct = props.correct ? `right`:`wrong`;

		return(
			<td id={props.id} className={`${correct}${leftAlign}`}>
				{props.checked ? <p>{props.displayText}</p>:props.answer}
			</td>
		);
	}
	else {
		return(
			<td id={props.id} className={props.leftAlign ? `leftAlign`:null}>{props.displayText}</td>
		);
	}
};

export default Cell;

import React from 'react';
import Cell from './cell';

class PlayerTable extends React.Component {
	constructor(props) {
		super(props);
		this.saveAnswer = this.saveAnswer.bind(this);
	}

	// when a box is deselected, add/overwrite in answers and pass to parent
	saveAnswer(event) {
		const newAnswers = this.props.parentAnswers;

		// check if the user answered this with a non blank answer for the first time
		const fromBlankToFilled = event.target.value !== `` &&
								(!Object.prototype.hasOwnProperty.call(this.props.parentAnswers, event.target.id) ||
								this.props.parentAnswers[event.target.id] === ``);
		const fromFilledToBlank = this.props.parentAnswers[event.target.id] !== `` && event.target.value === ``;

		let answer = event.target.value;

		if (typeof answer !== `string`) {
			answer = event.target.value.toString();
		}

		newAnswers[event.target.id] = answer;

		this.props.handleNewAnswer(newAnswers, fromBlankToFilled, fromFilledToBlank);
	}

	// converts a decimal number to a base26 letter system, like in excel
	convertNumberToLetters(number) {
		if (typeof number !== `number`) {
			console.error(`Error in convertNumberToLetters: did not recieve a number`);
			return NaN;
		}

		let remainder = [];
		let name = ``;

		if (number <= 0) {
			remainder.push(0);
		}
		else {
			while(number > 0) {
				remainder.push(number % 26);
				number = Math.floor(number / 26);
			}

			if (remainder.length > 1) {
				remainder[remainder.length - 1]--;
			}
		}

		for (let i=remainder.length - 1;i>=0;i--) {
			name += String.fromCharCode(remainder[i] + 65);
		}

		return name;
	}

	render() {
		const headRows = [];
		const mainRows = [];
		let counter = 0;
		let headerCount = 0;
		let firstInput = true;

		// generate the table labels (in header) if needed
		if (this.props.spreadsheet) {
			const cells = [];

			// add in the leftmost label (above the row labels)
			cells.push(
				<th key="col-label-0" id="col-label-0" className="label skinny" />
			);

			for (let i=0;i<this.props.dimensions.columns;i++) {
				const b26Number = this.convertNumberToLetters(i);

				cells.push(
					<th key={`col-label-${i+1}`} id={`col-label-${i+1}`} className="label">
						{b26Number}
					</th>
				);
			}

			headRows.push(<tr key="column-labels" id="column-labels">{cells}</tr>);
		}

		// generate the table
		// going down columns
		for (let i=0;i<this.props.dimensions.rows;i++) {
			const rowID = `row${i}`;
			const cells = [];

			// going across
			for (let j=0;j<this.props.dimensions.columns;j++) {
				const question = this.props.qset[i][j];
				const cellID = `cell${counter}`;

				// add in the row labels if needed
				if (j === 0 && this.props.spreadsheet) {
					// make the first label generated a th if needed
					if (i === 0 && this.props.header) {
						cells.push(
							<th key={`row-label-${i+1}`} id={`row-label-${i+1}`} className="label skinny" >
								{i+1}
							</th>
						);
					}
					else {
						cells.push(
							<td key={`row-label-${i+1}`} id={`row-label-${i+1}`} className="label skinny" >
								{i+1}
							</td>
						);
					}
				}

				// make the first row of user created content a header if needed
				if (this.props.header && headerCount < (this.props.dimensions.columns)) {
					cells.push(
						<th
							key={cellID}
							id={cellID}
							className={`${this.props.leftAlign ? `leftAlign`:`centerAlign`} header`}
						>
							{question.questions[0].text}
						</th>
					);

					headerCount++;
					counter++;
					continue;
				}

				// no random items? use options, otherwise check randPositions
				const showInput = this.props.randCount === 0 ?
					question.options.blank
					: this.props.randPositions.has(counter);

				// total number of blank questions for for the question tally
				if (this.props.randCount === 0 && question.options.blank) {
					this.props.countBlanks(counter);
				}

				// adds in the random questions
				cells.push(
					<Cell
						key={cellID}
						id={cellID}
						saveAnswer={this.saveAnswer}
						inputID={`${counter}-input`}
						displayText={question.questions[0].text}
						showInput={showInput}
						leftAlign={this.props.leftAlign}
						firstInput={firstInput}
						focus={this.props.focus}
						exitQuestion={this.props.exitQuestion}
					/>
				);

				if (showInput && firstInput) {
					firstInput = false;
				}

				counter++;
			}

			if (i === 0 && this.props.header) {
				headRows.push(<tr key={i} id={rowID}>{cells}</tr>);
			}
			else {
				mainRows.push(<tr key={i} id={rowID}>{cells}</tr>);
			}
		}

		return(
			<table>
				<thead>
					{headRows}
				</thead>

				<tbody>
					{mainRows}
				</tbody>
			</table>
		);
	}
}

export default PlayerTable;

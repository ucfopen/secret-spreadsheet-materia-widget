import React from 'react';
import Cell from './player-cell';

class PlayerTable extends React.Component {
	constructor(props) {
		super(props);
		this.saveAnswer = this.saveAnswer.bind(this);
	}

	// when a box is deselected, add/overwrite in answers and pass to parent
	saveAnswer(event) {
		const newAnswers = this.props.parentAnswers;
		// check if the user answered this with a non blank answer for the first time
		const fromBlankToFilled = event.target.value !== '' &&
								  (!this.props.parentAnswers.hasOwnProperty(event.target.id) ||
								  this.props.parentAnswers[event.target.id] === '');
		const fromFilledToBlank = this.props.parentAnswers[event.target.id] !== '' && event.target.value === '';
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers, fromBlankToFilled, fromFilledToBlank);
	}

	render() {
		const headRows = [];
		const mainRows = [];
		let counter = 0;
		let headerCount = 0;

		// generate the table labels (in header) if needed
		if (this.props.spreadsheet) {
			const cells = [];

			// add this later when you add the sides
			if (this.props.header) {
				cells.push(
					<th key="col-label-0" id="col-label-0" className="label skinny" />
				);
			}

			for (let i=0;i<this.props.dimensions.y;i++) {
				const charCode = (i % 26) + 'A'.charCodeAt(0);

				cells.push(
					<th key={`col-label-${i+1}`} id={`col-label-${i+1}`} className="label">
						{String.fromCharCode(charCode)}
					</th>
				);
			}

			headRows.push(<tr key="column-labels" id="column-labels">{cells}</tr>);
		}

		// generate the table
		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			const rowID = `row${i}`;
			const cells = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
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
				if (this.props.header && headerCount < (this.props.dimensions.x )) {
					cells.push(
						<th
							key={cellID}
							id={cellID}
							className={`${this.props.leftAlign ? 'leftAlign':'centerAlign'}${this.props.header ? ' header':''}`}
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
					/>
				);

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
};

export default PlayerTable;

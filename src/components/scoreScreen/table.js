import React from 'react';
import Cell from './cell'

class ScoreTable extends React.Component {
	constructor(props) {
		super(props);
		this.generateHead = this.generateHead.bind(this);
		this.generateBody = this.generateBody.bind(this);
	}

	convertNumberToLetters(number) {
		if (typeof number !== `number`) {
			console.error(`Error in convertNumberToLetters: did not recieve a number`);
			return NaN;
		}

		if (number < 0) {
			return `A`;
		}

		let base = number;
		let finalString = ``;

		do {
			const calcChar = String.fromCharCode(Math.floor(base % 26) + `A`.charCodeAt(0));

			finalString = `${finalString}${calcChar}`;
			base = Math.floor(base / 26);
		} while (base > 0);

		return finalString;
	}

	generateHead(counter=0) {
		const rows = [];

		if (this.props.spreadsheet) {
			const cells = [];

			cells.push(
				<th key="col-label-0" id="col-label-0" />
			);

			for (let i=0;i<this.props.dimensions.columns;i++) {
				const b26Number = this.convertNumberToLetters(i);

				cells.push(
					<th key={`col-label-${i+1}`} id={`col-label-${i+1}`}>
						{b26Number}
					</th>
				);
			}

			rows.push(<tr key="column-labels" id="column-labels">{cells}</tr>)
		}

		if (this.props.header) {
			const cells = [];

			// add in the row labels if needed
			if (this.props.spreadsheet) {
				cells.push(
					<th key="row=label-1" id="row-label-1">1</th>
				);
			}

			for (let i=0;i<this.props.dimensions.columns;i++) {
				const question = this.props.qset[0][i];
				const cellID = `cell${counter}`;

				cells.push(
					<th key={cellID} id={cellID}>
						{question.questions[0].text}
					</th>
				);

				counter++;
			}

			rows.push(<tr key="0" id="row0">{cells}</tr>)
		}
	}

	// start=0 or 1
	// tells if to skip first row b/c of header
	generateBody(start=0, counter=0) {
		const rows = [];
		// going down
		for (let i=start;i<this.props.dimensions.rows;i++) {
			const rowID = `row${i}`;
			const cells = [];

			// going across
			for (let j=0;j<this.props.dimensions.columns;j++) {
				const question = this.props.qset[i][j];
				const cellID = `cell${counter}`;

				// add in row labels if needed
				if (j === 0 && this.props.spreadsheet) {
					cells.push(
						<td key={`row-label-${i+1}`} id={`row-label-${i+1}`}>
							{i+1}
						</td>
					);
				}

				const answerable = this.props.positions.has(`row${i} column${j}`);
				const answer = null;

				if (answerable) {
					for (let k=0;k<this.props.scoreTable.length;k++) {
						const item = this.props.scoreTable[k];

						if (item.data[3] === `row${i} column${j}`) {
							answer = item.data[1];
							break;
						}
					}

					if (answer === null) {
						console.error(`Could not find answer in ScoreTable.`);
					}
				}

				const correct = answer === question.questions[0].text;

				cells.push(
					<Cell
						key={cellID}
						id={cellID}
						displayText={question.questions[0].text}
						answerable={answerable}
						leftAlign={this.props.leftAlign}
						answer={answer}
						correct={correct}
					/>
				);

				counter++;
			}

			rows.push(<tr key={i} id={rowID}>{cells}</tr>)
		}

		return rows;
	}

	render() {
		let counter = 0;

		return (
			<main>
				<h3>Answers</h3>

				<table>
					{
						this.props.spreadsheet || this.props.header ?
						<thead>
							{this.generateHead(counter)}
						</thead>:
						null
					}
					<tbody>
						{this.generateBody(this.header ? 1:0, counter)}
					</tbody>
				</table>
			</main>
		);
	}
}

export default ScoreTable;

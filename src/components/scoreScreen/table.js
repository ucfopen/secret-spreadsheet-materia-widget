import React from 'react';
import Cell from './cell';

class ScoreTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		};
		this.generateHead = this.generateHead.bind(this);
		this.generateBody = this.generateBody.bind(this);
		this.handleChange = this.handleChange.bind(this);
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

	generateHead() {
		const rows = [];
		let counter = 0;

		if (this.props.spreadsheet) {
			const cells = [];

			cells.push(
				<th key="col-label-0" id="col-label-0" className={`label skinny${this.props.leftAlign ? ` leftAlign`:``}`} />
			);

			for (let i=0;i<this.props.dimensions.columns;i++) {
				const b26Number = this.convertNumberToLetters(i);

				cells.push(
					<th key={`col-label-${i+1}`} id={`col-label-${i+1}`} className="label">
						{b26Number}
					</th>
				);
			}

			rows.push(<tr key="column-labels" id="column-labels">{cells}</tr>);
		}

		if (this.props.header) {
			const cells = [];

			// add in the row labels if needed
			if (this.props.spreadsheet) {
				cells.push(
					<th key="row=label-1" id="row-label-1" className={`label skinny${this.props.leftAlign ? ` leftAlign`:``}`}>1</th>
				);
			}

			for (let i=0;i<this.props.dimensions.columns;i++) {
				const question = this.props.qset[0][i];
				const cellID = `cell${counter}`;

				cells.push(
					<th key={cellID} id={cellID} className="header">
						{question.questions[0].text}
					</th>
				);

				counter++;
			}

			rows.push(<tr key="0" id="row0" className={this.props.leftAlign ? `leftAlign`:null}>{cells}</tr>);
		}

		return rows;
	}

	handleChange(event) {
		this.setState({
			checked: event.target.checked
		});
	}

	// start=0 or 1
	// tells if to skip first row b/c of header
	generateBody(start=0) {
		const rows = [];
		let counter = 0;

		if (this.props.header) {
			counter += this.props.dimensions.columns;
		}

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
						<td key={`row-label-${i+1}`} id={`row-label-${i+1}`} className={`label skinny${this.props.leftAlign ? ` leftAlign`:``}`}>
							{i+1}
						</td>
					);
				}

				const answerable = this.props.positions.has(`row${i} column${j}`);
				let answer = null;

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
						checked={this.state.checked}
					/>
				);

				counter++;
			}

			rows.push(<tr key={i} id={rowID}>{cells}</tr>);
		}

		return rows;
	}

	render() {
		return (
			<main>
				<h3>Answers</h3>

				<label>
					Show correct answers
					<input
						type="checkbox"
						checked={this.state.checked}
						onChange={this.handleChange}
					/>
				</label>

				<div className="table-surround">
					<div>
						<table>
							{
								this.props.spreadsheet ?
									<thead>
										{this.generateHead()}
									</thead>:
									this.props.header ?
										<thead>
											{this.generateHead()}
										</thead>:
										null
							}
							<tbody>
								{this.generateBody(this.props.header ? 1:0)}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		);
	}
}

export default ScoreTable;

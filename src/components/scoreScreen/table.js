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
			checked: !this.state.checked
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

				const correct = (typeof answer === `string` ? answer.toUpperCase():answer) === question.questions[0].text.toUpperCase();

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

				<div id="show-answer-toggle">
					<label htmlFor="show-answer-toggle">Show correct answers </label>
					<div className="show-answer-checkbox"
						tabIndex={0}
						onKeyDown={e => {
							if (e.key === `Enter`) {
								this.handleChange();
							}
						}}
						onClick={this.handleChange}
					>
						{!this.state.checked ? (
							<svg viewBox="0 0 28 28" width="22px" height="22px">
								<path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path>
							</svg>
						) : (
							<svg viewBox="0 0 28 28" width="22px" height="22px">
								<path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path>
							</svg>
						)}
					</div>
				</div>

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

import React from 'react';
import ReactDOM from 'react-dom';
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
		const rows = [];
		let counter = 0;
		let headerCount = 0;

		// generate the table
		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			const rowID = `row${i}`;
			const cells = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
				const question = this.props.qset[i][j];
				const cellID = `cell${counter}`;

				if (this.props.header && headerCount < (this.props.dimensions.x )) {
					cells.push(
						<Cell
							key={cellID}
							id={cellID}
							saveAnswer={this.saveAnswer}
							inputID={`${counter}-input`}
							displayText={question.questions[0].text}
							showInput={false}
							leftAlign={this.props.leftAlign}
							header={true}
						/>
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
						header={false}
					/>
				);

				counter++;
			}

			rows.push(<tr key={i} id={rowID}>{cells}</tr>);
		}

		return rows;
	}
};

export default PlayerTable;

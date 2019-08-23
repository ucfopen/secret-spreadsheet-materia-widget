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
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers);
	}

	render() {
		const rows = [];
		let counter = 0;

		// generate the table
		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			const rowID = `row${i}`;
			const cells = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
				const question = this.props.qset[i][j];
				const cellID = `cell${counter}`;

				// no random items? use options, otherwise check randPositions
				const showInput = this.props.randCount === 0 ?
					question.options.blank
					: this.props.randPositions.has(counter);

				// adds in the random questions
				cells.push(
					<Cell
						key={cellID}
						id={cellID}
						saveAnswer={this.saveAnswer}
						inputID={`${counter}-input`}
						displayText={question.questions[0].text}
						showInput={showInput}
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

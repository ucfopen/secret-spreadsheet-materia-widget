import React from 'react';
import ReactDOM from 'react-dom';
import Cell from './player-cell';

class MainTable extends React.Component {
	constructor(props) {
		super(props);
		this.saveAnswer = this.saveAnswer.bind(this);
	}

	// when a box is deselected, add/overwrite in answers and pass to parent
	saveAnswer(event) {
		let newAnswers = this.props.parentAnswers;
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers);
	}

	render() {
		let rows = [];
		let counter = 0;

		// generate the table
		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			const rowID = `row${i}`;
			let cell = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
				const cellID = `cell${counter}`;

				// adds in the random questions
				if (this.props.randCount !== 0) {
					cell.push(
						<Cell
							key={cellID}
							id={cellID}
							saveAnswer={this.saveAnswer}
							inputID={`${counter}-input`}
							displayText={this.props.qset[i][j].questions[0].text}
							showInput={this.props.randPositions.hasOwnProperty(counter)}
						/>
					);
				}
				// adds in the selected answers
				else {
					cell.push(
						<Cell
							key={cellID}
							id={cellID}
							saveAnswer={this.saveAnswer}
							inputID={`${counter}-input`}
							displayText={this.props.qset[i][j].questions[0].text}
							showInput={this.props.qset[i][j].options.blank}
						/>
					);
				}

				counter++;
			}

			rows.push(<tr key={i} id={rowID}>{cell}</tr>);
		}

		return rows;
	}
};

export default MainTable;

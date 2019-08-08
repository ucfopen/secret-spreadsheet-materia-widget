import React from 'react';
import ReactDOM from 'react-dom';

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.answers = {};
		this.randPositions = null;
		this.collectPositions = this.collectPositions.bind(this);
		this.submitAnswer = this.submitAnswer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
	}

	// get random positions from randomize in main table
	collectPositions(positions) {
		this.randPositions = positions;
	}

	// check if question has been answered. If it is, submit the answer, or submit blank
	submitAnswer(id, counter) {
		if (this.answers.hasOwnProperty(`${counter}-input`)) {
			Materia.Score.submitQuestionForScoring(id, this.answers[`${counter}-input`]);
		}
		else {
			Materia.Score.submitQuestionForScoring(id, '');
		}
	}

	// check either the answers that were marked as blank or randomly selected as blank
	handleSubmit(event) {
		let counter = 0;

		event.preventDefault();

		for (let i=0;i<this.props.qset.length;i++) {
			for (let j=0;j<this.props.qset[i].length;j++) {
				const question = this.props.qset[i][j];

				if (this.props.count !== 0) {
					if (this.randPositions.hasOwnProperty(counter)) {
						this.submitAnswer(question.id, counter);
					}
				}
				else {
					if (question.options.blank) {
						this.submitAnswer(question.id, counter);
					}
				}

				counter++;
			}
		}

		Materia.Engine.end();
	}

	// add new answers to bank
	handleNewAnswer(newAnswers) {
		this.answers = newAnswers;
	}

	render() {
		return(
			<div>
				<h1>{this.props.title}</h1>

				<form onSubmit={this.handleSubmit}>
					<table>
						<tbody>
							<MainTable dimensions={this.props.dimensions} qset={this.props.qset} parentAnswers={this.answers} handleNewAnswer={this.handleNewAnswer} collectPositions={this.collectPositions} count={this.props.count} />
						</tbody>
					</table>

					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

class MainTable extends React.Component {
	constructor(props) {
		super(props);
		this.selectedPositions = {};
		this.handleBlur = this.handleBlur.bind(this);
		this.randomize = this.randomize.bind(this);
	}

	// when a box is deselected, add/overwrite in answers and pass to parent
	handleBlur(event) {
		let newAnswers = this.props.parentAnswers;
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers);
	}

	// select random blank answers
	randomize() {
		const totalCells = this.props.dimensions.x * this.props.dimensions.y;
		let selectCount = 0;

		while (selectCount < this.props.count) {
			const position = Math.floor(Math.random() * totalCells);

			if (!this.selectedPositions.hasOwnProperty(position)) {
				this.selectedPositions[position] = true;
				selectCount++;
			}
		}

		this.props.collectPositions(this.selectedPositions);
	}

	render() {
		// randomize which entries are blank if the count if the creator says more than 0 should be random and we haven't already done this
		if (Object.entries(this.selectedPositions).length === 0 && this.selectedPositions.constructor === Object && this.props.count !== 0) {
			this.randomize();
		}

		let rows = [];
		let counter = 0;

		// generates the table
		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			let rowID = `row${i}`;
			let cell = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
				const cellID = `cell${counter}`;

				// adds in the random questions
				if (this.props.count !== 0) {
					cell.push(
						<td key={cellID} id={cellID}>
						{(this.selectedPositions.hasOwnProperty(counter)) ? (<input type="text" onBlur={this.handleBlur} id={`${counter}-input`} />):(this.props.qset[i][j].questions[0].text)}
						</td>
					);
				}
				// adds in the selected answers
				else {
					cell.push(
						<td key={cellID} id={cellID}>
						{(this.props.qset[i][j].options.blank) ? (<input type="text" onBlur={this.handleBlur} id={`${counter}-input`} />):(this.props.qset[i][j].questions[0].text)}
						</td>
					);
				}

				counter++;
			}

			rows.push(<tr key={i} id={rowID}>{cell}</tr>);
		}

		return rows;
	}
};

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<Player title={instance.name} dimensions={qset.dimensions} qset={qset.items[0].items} count={qset.randomization} />,
			document.getElementById('root')
		);
	},
	manualResize: false
});

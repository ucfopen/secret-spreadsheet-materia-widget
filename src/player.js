import React from 'react';
import ReactDOM from 'react-dom';
import MainTable from './player-table'

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.answers = {};
		this.randPositions = {};
		this.submitAnswer = this.submitAnswer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
		this.randomize = this.randomize.bind(this);
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

		this.props.qset.forEach(element => {
			element.forEach(question => {
				// randomly selected questions
				if (this.props.randCount !== 0) {
					if (this.randPositions.hasOwnProperty(counter)) {
						this.submitAnswer(question.id, counter);
					}
				}
				// not random
				else {
					if (question.options.blank) {
						this.submitAnswer(question.id, counter);
					}
				}

				counter++;
			});
		});

		Materia.Engine.end();
	}

	// add new answers to bank
	handleNewAnswer(newAnswers) {
		this.answers = newAnswers;
	}

	// select random blank answers
	randomize() {
		const totalCells = this.props.dimensions.x * this.props.dimensions.y;
		let selectCount = 0;

		while (selectCount < this.props.randCount) {
			const position = Math.floor(Math.random() * totalCells);

			if (!this.randPositions.hasOwnProperty(position)) {
				this.randPositions[position] = true;
				selectCount++;
			}
		}
	}

	render() {
		// randomize which entries are blank if the creator says more than 0 should be random and this is the first render of the table
		if (Object.entries(this.randPositions).length === 0 && this.randPositions.constructor === Object && this.props.randCount !== 0) {
			this.randomize();
		}

		return(
			<div>
				<h1>{this.props.title}</h1>

				<form onSubmit={this.handleSubmit}>
					<table>
						<tbody>
							<MainTable
								dimensions={this.props.dimensions}
								qset={this.props.qset}
								parentAnswers={this.answers}
								handleNewAnswer={this.handleNewAnswer}
								randPositions={this.randPositions}
								randCount={this.props.randCount}
							/>
						</tbody>
					</table>

					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<PlayerApp
				title={instance.name}
				dimensions={qset.dimensions}
				qset={qset.items[0].items}
				randCount={qset.randomization}
			/>,
			document.getElementById('root')
		);
	},
	manualResize: false
});

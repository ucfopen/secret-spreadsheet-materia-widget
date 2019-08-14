import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import MainTable from './player-table';
import Popup from './player-popup'
=======
import PlayerTable from './components/player-table'
>>>>>>> 4060113... Move components to own directory and code improvements

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			popup: true,
			answered: 0
		}
		this.answers = {};
		this.randPositions = new Set(); // set of randomly chosen cells that need to be answered
		this.submitAnswer = this.submitAnswer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
		this.handlePopupToggle = this.handlePopupToggle.bind(this);
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
					if (this.randPositions.has(counter)) {
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

	// decides if it should show popup or not
	handlePopupToggle() {
		if (this.state.popup) {
			this.setState({
				popup: false
			});
		}
		else {
			this.setState({
				popup: true
			});
		}
	}

	// select random blank answers
	randomize() {
		const totalCells = this.props.dimensions.x * this.props.dimensions.y;
		let selectCount = 0;

		while (selectCount < this.props.randCount) {
			const position = Math.floor(Math.random() * totalCells);

			if (!this.randPositions.has(position)) {
				this.randPositions.add(position);
				selectCount++;
			}
		}
	}

	render() {
		// randomize which entries are blank if the creator says more than 0 should be random and this is the first render of the table
		if (this.randPositions.size === 0 && this.props.randCount !== 0) {
			this.randomize();
		}

		return(
			<div>
				<header>
					<h1>{this.props.title}</h1>
					{this.state.popup ? null:<button type="button" value="Help" onClick={this.handlePopupToggle}>Help</button>}
				</header>

				<main>
					{this.state.popup ? <Popup handlePopupToggle={this.handlePopupToggle} />:null}

					<form onSubmit={this.handleSubmit}>
						<table>
							<tbody>
								<PlayerTable
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
				</main>
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

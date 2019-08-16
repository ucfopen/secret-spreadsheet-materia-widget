import React from 'react';
import ReactDOM from 'react-dom';
import PlayerTable from './components/player-table';
import Popup from './components/player-popup';

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			popup: true,
			answered: 0
		}
		this.answers = {};
		this.blankPositions = new Set(); // list of blank cells
		this.submitAnswer = this.submitAnswer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
		this.handlePopupToggle = this.handlePopupToggle.bind(this);
		this.randomize = this.randomize.bind(this);
		this.countBlanks = this.countBlanks.bind(this);
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
					if (this.blankPositions.has(counter)) {
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

	// add new answers to bank and if the user filled in a blank for the first time increment the answered question count
	handleNewAnswer(newAnswers, fromBlankToFilled, fromFilledToBlank) {
		this.answers = newAnswers;

		if (fromBlankToFilled && !fromFilledToBlank && this.state.answered < this.blankPositions.size) {
			this.setState({
				popup: this.state.popup,
				answered: this.state.answered + 1
			});
		}
		else if (!fromBlankToFilled && fromFilledToBlank && this.state.answered > 0) {
			this.setState({
				popup: this.state.popup,
				answered: this.state.answered - 1
			});
		}
		else if (fromBlankToFilled && fromFilledToBlank) {
			console.error('Answer count error in handleNewAnswer');
		}
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
		let totalCells = this.props.dimensions.x * this.props.dimensions.y;
		let selectCount = 0;

		if (this.props.header) {
			totalCells -= this.props.dimensions.x;
		}

		while (selectCount < this.props.randCount) {
			const position = Math.floor(Math.random() * totalCells + (this.props.header ? this.props.dimensions.x:0));

			if (!this.blankPositions.has(position)) {
				this.blankPositions.add(position);
				selectCount++;
			}
		}
	}

	// as the table is being created from user selected blanks, add each blank to the blank position set
	countBlanks(position) {
		this.blankPositions.add(position);
	}

	render() {
		// randomize which entries are blank if the creator says more than 0 should be random and this is the first render of the table
		if (this.blankPositions.size === 0 && this.props.randCount !== 0) {
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

					<p className="instructions">Input the <span><strong>missing data</strong></span> to complete the spreadsheet:</p>

					<form onSubmit={this.handleSubmit}>
						<table>
							<tbody>
								<PlayerTable
									dimensions={this.props.dimensions}
									qset={this.props.qset}
									parentAnswers={this.answers}
									handleNewAnswer={this.handleNewAnswer}
									randPositions={this.blankPositions}
									randCount={this.props.randCount}
									countBlanks={this.countBlanks}
									leftAlign={this.props.leftAlign}
									header={this.props.header}
								/>
							</tbody>
						</table>

						<p>You've filled out {this.state.answered} of {this.blankPositions.size} missing cells</p>

						<input
							type="submit"
							value="Submit"
							className={this.state.answered !== this.blankPositions.size ? 'grayed':'filled'} />
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
				leftAlign={qset.left}
				header={qset.header}
			/>,
			document.getElementById('root')
		);
	},
	manualResize: false
});

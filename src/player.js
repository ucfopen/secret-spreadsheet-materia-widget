import React from 'react';
import ReactDOM from 'react-dom';
import PlayerTable from './components/player/table';
import Popup from './components/player/popup';
import Question from './components/player/question';

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			popup: true,
			question: this.props.question !== ``,
			showQuestion: false,
			first: true,
			answered: 0
		};
		this.answers = {};
		this.blankPositions = new Set(); // list of blank cells
		this.submitAnswer = this.submitAnswer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
		this.handlePopupToggle = this.handlePopupToggle.bind(this);
		this.randomize = this.randomize.bind(this);
		this.countBlanks = this.countBlanks.bind(this);
		this.handleQuestionToggle = this.handleQuestionToggle.bind(this);
	}

	// check if question has been answered. If it is, submit the answer, or submit blank
	submitAnswer(id, counter) {
		if (Object.prototype.hasOwnProperty.call(this.answers, `${counter}-input`)) {
			Materia.Score.submitQuestionForScoring(id, this.answers[`${counter}-input`]);
		}
		else {
			Materia.Score.submitQuestionForScoring(id, ``);
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

	// add new answers to bank. If the user filled in a blank for the first time increment the answered question count and if they removed an answer decrement
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
			console.error(`Answer count error in handleNewAnswer`);
		}
	}

	// decides if it should show popup or not
	// showQuestion only matters if there is a user created question
	// will show both popups on first open then only show selected popup on
	// button press
	handlePopupToggle() {
		if (this.state.popup && this.state.first) {
			this.setState({
				popup: false,
				showQuestion: true,
				first: false
			});
		}
		else if (this.state.popup) {
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

	// decides if it should show the question popup or not
	handleQuestionToggle() {
		if (this.state.showQuestion) {
			this.setState({
				showQuestion: false
			});
		}
		else {
			this.setState({
				showQuestion: true
			});
		}
	}

	// select random blank answers
	randomize() {
		let totalCells = this.props.dimensions.rows * this.props.dimensions.columns;
		let selectCount = 0;

		if (this.props.header) {
			totalCells -= this.props.dimensions.columns;
		}

		while (selectCount < this.props.randCount) {
			// decide to use all cells or ignore top header row
			const position = Math.floor(Math.random() * totalCells + (this.props.header ? this.props.dimensions.columns:0));

			if (!this.blankPositions.has(position)) {
				selectCount++;
			}

			this.blankPositions.add(position);
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
					{this.state.popup ? null:<button type="button" value="Help" onClick={this.handlePopupToggle}><img src="./assets/img/question-mark.svg" />Help</button>}
				</header>

				<main>
					{this.state.popup ? <Popup handlePopupToggle={this.handlePopupToggle} />:null}

					{(this.state.question && this.state.showQuestion) ?
						<Question
							handleQuestionToggle={this.handleQuestionToggle}
							question={this.props.question}
							description={this.props.description}
						/>:
						null}

					<p className="instructions">Input the <span>missing data</span> to complete the spreadsheet:</p>

					<form onSubmit={this.handleSubmit}>
						<div className="table-surround">
							<div>
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
									spreadsheet={this.props.spreadsheet}
									focus={!this.state.popup}
									exitQuestion={!this.state.showQuestion}
								/>
							</div>
						</div>

						<p>You've filled out {this.state.answered} of {this.blankPositions.size} missing cells</p>

						{this.state.question ? <p className="link" onClick={this.handleQuestionToggle}>View Question</p>:null}

						<input
							type="submit"
							value="Submit"
							className={this.state.answered !== this.blankPositions.size ? `grayed`:`filled`}
						/>
					</form>
				</main>
			</div>
		);
	}
}

export default PlayerApp;

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
				spreadsheet={qset.spreadsheet}
				question={qset.question}
				description={qset.description}
			/>,
			document.getElementById(`root`)
		);
	},
	manualResize: false
});

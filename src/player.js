import React from 'react';
import ReactDOM from 'react-dom';

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			answers: {}
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
	}

	handleSubmit(event) {
		let score = 0.0;
		let totalPointsPossible = 0.0;
		event.preventDefault;

		// calculates final score. Only counts questions that user was supposed to answer
		for (let i=0;i<this.props.qset.length;i++) {
			const question = this.props.qset[i];

			if (question.options.blank) {
				totalPointsPossible++;

				if (this.state.answers.hasOwnProperty(`${i}-input`)) {
					if (this.state.answers[`${i}-input`] === question.answer[0].text) {
						score++;
					}
				}
			}
		}

		let finalScore = Math.round((score / totalPointsPossible) * 100);

		if (finalScore > 100) {
			finalScore = 100;
		}

		if (finalScore < 0) {
			finalScore = 0;
		}

		Materia.Score.submitFinalScoreFromClient(0, '', finalScore);
		Materia.Engine.end();
	}

	handleNewAnswer(newAnswers) {
		this.setState({
			answers: newAnswers
		});
	}

	render() {
		return(
			<div>
				<h1>{this.props.title}</h1>

				<form onSubmit={this.handleSubmit}>
					<table>
						<tbody>
							<MainTable dimensions={this.props.dimensions} qset={this.props.qset} parentState={this.state} handleNewAnswer={this.handleNewAnswer} />
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
		this.state = {
			answers: {}
		};
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleBlur(event) {
		let newAnswers = this.props.parentState;
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers);
	}

	render() {
		let rows = [];
		let counter = 0;

		// column
		for (let i=0;i<this.props.dimensions.y;i++) {
			let rowID = `row${i}`;
			let cell = [];

			// row
			for (let j=0;j<this.props.dimensions.x;j++) {
				let cellID = counter;

				// show input if blank question, show text if not
				cell.push(
					<td key={cellID} id={cellID}>
					{(this.props.qset[counter].options.blank) ? (<input type="text" onBlur={this.handleBlur} id={`${cellID}-input`} />):(this.props.qset[counter].question[0].text)}
					</td>
				);

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
			<Player title={instance.name} dimensions={qset.dimensions} qset={qset.questions} />,
			document.getElementById('root')
		);
	},
	manualResize: false
});

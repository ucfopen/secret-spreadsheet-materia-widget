import React from 'react';
import ReactDOM from 'react-dom';

const endPlayer = () => {
	Materia.Engine.end();
}

const checkAnswer = (question, answer) => {
	Materia.Score.submitQuestionForScoring(question.id, answer.id);
}

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
		event.preventDefault;

		for (let i=0;i<this.props.qset.length;i++) {
			const id = this.props.qset[i].id;

			if (this.state.answers.hasOwnProperty(`${i}-input`)) {
				checkAnswer(id, this.state.answers[`${i}-input`]);
			}
			else {
				checkAnswer(id, "");
			}
		}

		endPlayer();
	}

	handleNewAnswer(newAnswers) {
		this.setState({
			answers: newAnswers
		});
	}

	render() {
		console.log(this.state.answers);
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
					{(this.props.qset[counter].question[0].text === "") ? (<input type="text" onBlur={this.handleBlur} id={`${cellID}-input`} />):(this.props.qset[counter].question[0].text)}
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

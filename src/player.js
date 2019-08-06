import React from 'react';
import ReactDOM from 'react-dom';

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.answers = {};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNewAnswer = this.handleNewAnswer.bind(this);
	}

	handleSubmit(event) {
		let counter = 0;

		event.preventDefault();

		for (let i=0;i<this.props.qset.length;i++) {
			for (let j=0;j<this.props.qset[i].length;j++) {
				const question = this.props.qset[i][j];

				if (question.options.blank) {
					if (this.answers.hasOwnProperty(`${counter}-input`)) {
						Materia.Score.submitQuestionForScoring(question.id, this.answers[`${counter}-input`]);
					}
					else {
						Materia.Score.submitQuestionForScoring(question.id, '');
					}
				}

				counter++;
			}
		}

		Materia.Engine.end();
	}

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
							<MainTable dimensions={this.props.dimensions} qset={this.props.qset} parentAnswers={this.answers} handleNewAnswer={this.handleNewAnswer} />
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
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleBlur(event) {
		let newAnswers = this.props.parentAnswers;
		newAnswers[event.target.id] = event.target.value;

		this.props.handleNewAnswer(newAnswers);
	}

	render() {
		let rows = [];
		let counter = 0;

		// going down columns
		for (let i=0;i<this.props.dimensions.x;i++) {
			let rowID = `row${i}`;
			let cell = [];

			// going across
			for (let j=0;j<this.props.dimensions.y;j++) {
				const cellID = counter;

				cell.push(
					<td key={cellID} id={cellID}>
					{(this.props.qset[i][j].options.blank) ? (<input type="text" onBlur={this.handleBlur} id={`${cellID}-input`} />):(this.props.qset[i][j].questions[0].text)}
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
		console.log(qset);
		ReactDOM.render(
			<Player title={instance.name} dimensions={qset.dimensions} qset={qset.items[0].items} />,
			document.getElementById('root')
		);
	},
	manualResize: false
});

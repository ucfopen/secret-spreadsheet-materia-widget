import React from 'react';
import ReactDOM from 'react-dom';

let _title = '';
let _qset = [];

const endPlayer = () => {
	Materia.Engine.end();
}

const checkAnswer = (question, answer) => {
	Materia.Score.submitFinalScoreFromClient(question.id, answer.id, answer.value);
}

class Player extends React.Component {
	constructor(props) {
		super(props);
	}

	handleEnd() {
		endPlayer();
	}

	render() {
		return(
			<div>
				<h1>{this.props.title}</h1>

				<button onClick={this.handleEnd}>Submit</button>
			</div>
		);
	}
}

Materia.Engine.start({
	start: (instance, qset) => {
		_qset = qset.questions;
		_title = instance.name;
		ReactDOM.render(
			<Player title={_title} />,
			document.getElementById('root')
		);
	},
	manualResize: false
});

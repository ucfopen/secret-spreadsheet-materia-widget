import React from 'react';
import ReactDOM from 'react-dom';
import Question from './components/scoreScreen/question'

class ScoreScreenApp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.qset);
		console.log(this.props.scoreTable);
		console.log(this.props.title);
		return(
			<Question
				question={this.props.qset.question}
				description={this.props.qset.description}
			/>
		);
	}
}

const updateDisplay = (qset, scoreTable, title) => {
	ReactDOM.render(
		<ScoreScreenApp
			qset={qset}
			scoreTable={scoreTable}
			title={title}
		/>,
		document.getElementById(`root`)
	);
};

Materia.ScoreCore.start({
	start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
		updateDisplay(qset, scoreTable, instance.name);
	},
	update: (qset, scoreTable) => {
		updateDisplay(qset, scoreTable, instance.name);
	}
});
Materia.ScoreCore.hideResultsTable();

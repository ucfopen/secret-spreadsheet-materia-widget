import React from 'react';
import ReactDOM from 'react-dom';
import Question from './components/scoreScreen/question';
import ScoreTable from './components/scoreScreen/table';

let name = ``;

class ScoreScreenApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			positions: this.makePositionList(this.props.scoreTable)
		};
	}

	makePositionList(scoreTable) {
		const positions = new Set();

		scoreTable.forEach(score => {
			positions.add(score.data[3]);
		});

		return positions;
	}

	render() {
		return(
			<div>
				{
					this.props.qset.question !== `` ?
						<Question
							question={this.props.qset.question}
							description={this.props.qset.description}
						/>:
						null
				}

				<ScoreTable
					spreadsheet={this.props.qset.spreadsheet}
					dimensions={this.props.qset.dimensions}
					header={this.props.qset.header}
					qset={this.props.qset.items[0].items}
					positions={this.state.positions}
					leftAlign={this.props.qset.left}
					scoreTable={this.props.scoreTable}
				/>
			</div>
		);
	}
}

export default ScoreScreenApp;

const updateDisplay = (qset, scoreTable, title=undefined) => {
	if (title !== undefined) {
		name = title;
	}

	ReactDOM.render(
		<ScoreScreenApp
			qset={qset}
			scoreTable={scoreTable}
			title={name}
		/>,
		document.getElementById(`root`)
	);
};

Materia.ScoreCore.start({
	start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
		updateDisplay(qset, scoreTable, instance.name);
	},
	update: (qset, scoreTable) => {
		updateDisplay(qset, scoreTable);
	}
});
Materia.ScoreCore.hideResultsTable();

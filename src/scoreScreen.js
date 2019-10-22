import React from 'react';
import ReactDOM from 'react-dom';
import Question from './components/scoreScreen/question';
import ScoreTable from './components/scoreScreen/table';

class ScoreScreenApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			positions: this.makePositionList(this.props.scoreTable)
		}
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

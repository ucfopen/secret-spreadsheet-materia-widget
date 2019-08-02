import React from 'react';
import ReactDOM from 'react-dom';

let title = ''
let qset = {
	'version': 1,
	'data': {
		'dimensions': {'x': 0, 'y': 0},
		'questions': []
	}
}


class Creator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			canHazTable: this.props.qset ? true : false,
		}
		qset = this.props.qset ? this.props.qset : qset;
		this.handleInitSubmit = this.handleInitSubmit.bind(this);
		this.handleTableSubmit = this.handleTableSubmit.bind(this);
	}

  handleInitSubmit(event) {
		title = event.target[0].value
		qset.data.dimensions.x = parseInt(event.target[1].value)
		qset.data.dimensions.y = parseInt(event.target[2].value)
		this.setState({canHazTable: true});
		event.preventDefault();
		console.log(qset)
	}

	createTable() {
		let table = []
		for (let i = 0; i < qset.data.dimensions.x; i++)
		{
			let children = []
			for (let j = 0; j < qset.data.dimensions.y; j++)
			{
				let temp = this.props.qset && this.props.qset.data.questions[i] && this.props.qset.data.questions[i][j]
				children.push(<td key={`${i} - ${j}`}>
												<input type="checkbox" defaultChecked={temp && temp.options.blank}/>
												<input type="text" placeholder="" defaultValue={temp && temp.questions[0].text}/>
											</td>
										 )
			}
			table.push(<tr key={i}>{children}</tr>)
		}
		return table
	}

	handleTableSubmit(event) {
		qset.data.questions = []
		for (let i = 0; i < qset.data.dimensions.x; i++)
		{
			let temp = []
			for (let j = 0; j < qset.data.dimensions.y * 2; j += 2)
			{
				temp.push({
					'materiaType': 'question',
					'id': null,
					'type': 'QA',
					'options': {
						'blank': event.target[i * qset.data.dimensions.y * 2 + j].checked,
					},
					'questions': [{
						'text': event.target[i * qset.data.dimensions.y * 2 + j + 1].value
					}],
					'answers': [{
						'id': null,
						'text': event.target[i * qset.data.dimensions.y * 2 + j + 1].value,
						'value': 100
					}]
				})
			}
			qset.data.questions.push(temp)
		}
		event.preventDefault();
		console.log(qset)
	}

  render() {
    return (
			<div>

				<form onSubmit={this.handleInitSubmit}>
					<div>
						Title of Widget:
						<input type="text" placeholder="New Spreadsheet Widget" defaultValue={title = (this.props.title ? this.props.title : title)}/>
					</div>
					<div>
						Number of Rows (1-20):
						<input type="number" min="1" max="20" placeholder={0} defaultValue={this.props.qset && this.props.qset.data.dimensions.x}/>
					</div>
					<div>
						Number of Columns (1-20):
						<input type="number" min="1" max="20" placeholder={0} defaultValue={this.props.qset && this.props.qset.data.dimensions.y}/>
					</div>
					<input type="submit" value="Save"/>
				</form>

				{this.state.canHazTable === true ?
					<div>
						<p>Check the boxes to hide from players</p>
						<form onSubmit={this.handleTableSubmit}>
							<table>
								<tbody>
									{this.createTable()}
								</tbody>
							</table>
							<input type="submit" value="Save"/>
						</form>
					</div>
				: ""}

			</div>
    );
  }
}

let materiaCallbacks = {}

materiaCallbacks.initNewWidget = (instance) => {
	console.log('in new')
	console.log(instance)
	ReactDOM.render(
		<Creator title={title}/>,
		document.getElementById('root')
	);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version) => {
	console.log('in edit')
	console.log(title)
	console.log(instance)
	console.log(_qset)
	console.log(version)

	ReactDOM.render(
		<Creator title={title} qset={_qset} version={version} />,
		document.getElementById('root')
	);
}

materiaCallbacks.onSaveClicked = () => {
	console.log('in save')
	console.log(title)
	if(title != '')
		Materia.CreatorCore.save(title, qset)
	else
		Materia.CreatorCore.cancelSave('This widget has no title!')
}

materiaCallbacks.onSaveComplete = (title, widget, qset, version) => {
	console.log("save complete", arguments)
	return null
}

Materia.CreatorCore.start(materiaCallbacks);

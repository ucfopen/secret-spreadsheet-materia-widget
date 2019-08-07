import React from 'react';
import ReactDOM from 'react-dom';

let title = ''
let qset = {
	'dimensions': {'x': null, 'y': null},
	'items': [{'items': []}]
}

class Creator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			iCanHazTable: (this.props.qset && this.props.qset.dimensions.x && this.props.qset.dimensions.y) ? true : false,
			iCanHazDimensions: this.props.title ? true : false,
			popup: title === '',
			hasTitle: (this.props.title != '') ? true : false,
			hasDimensions: (this.props.qset && this.props.qset.dimensions.x && this.props.qset.dimensions.y) ? true : false,
			hasTable: (this.props.qset && this.props.qset.items) ? true : false,
		}
		qset = this.props.qset ? this.props.qset : qset;

		this.handleTitleSubmit = this.handleTitleSubmit.bind(this);
		this.handleDimensionsSubmit = this.handleDimensionsSubmit.bind(this);
		this.handleTableSubmit = this.handleTableSubmit.bind(this);
		this.editTitle = this.editTitle.bind(this);
		this.editDimensions = this.editDimensions.bind(this);
		this.editTable = this.editTable.bind(this);
	}

	editTitle(event) {
		this.setState({hasTitle: false});
		event.preventDefault();
	}

	editDimensions(event) {
		this.setState({hasDimensions: false});
		this.setState({hasTable: false});
		event.preventDefault();
	}

	editTable(event) {
		this.setState({hasTable: false});
		event.preventDefault();
	}

	handleTitleSubmit(event) {
		title = event.target[0].value
		this.setState({popup: false});
		this.setState({iCanHazDimensions: true});
		this.setState({hasTitle: true});
		event.preventDefault();
	}

	handleDimensionsSubmit(event) {
		qset.dimensions.x = parseInt(event.target[0].value)
		qset.dimensions.y = parseInt(event.target[1].value)
		this.setState({iCanHazTable: true});
		this.setState({hasDimensions: true});
		event.preventDefault();
	}

	createTable(edit) {
		let table = []
		if (edit) {
			for (let i = 0; i < qset.dimensions.x; i++) {
				let children = []
				for (let j = 0; j < qset.dimensions.y; j++) {
					let temp = (qset && qset.items[0].items[i] && qset.items[0].items[i][j]) || (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j])
					children.push(<td key={`${i} - ${j}`}>
													<input type="checkbox" defaultChecked={temp && temp.options.blank}/>
													<input type="text" placeholder="" defaultValue={temp && temp.questions[0].text}/>
												</td>
											 )
				}
				table.push(<tr key={i}>{children}</tr>)
			}
		} else {
			for (let i = 0; i < qset.dimensions.x; i++) {
				let children = []
				for (let j = 0; j < qset.dimensions.y; j++) {
					let temp = qset && qset.items[0].items[i] && qset.items[0].items[i][j]
					if (temp && temp.options.blank) {
						children.push(<td className="lit" key={`${i} - ${j}`}>{temp && temp.questions[0].text}</td>)
					} else {
						children.push(<td key={`${i} - ${j}`}>{temp && temp.questions[0].text}</td>)
					}
				}
				table.push(<tr key={i}>{children}</tr>)
			}
		}

		return table
	}

	handleTableSubmit(event) {
		qset.items[0].items = []
		for (let i = 0; i < qset.dimensions.x; i++) {
			let temp = []
			for (let j = 0; j < qset.dimensions.y * 2; j += 2) {
				temp.push({
					'materiaType': 'question',
					'id': null,
					'type': 'QA',
					'options': {
						'blank': event.target[i * qset.dimensions.y * 2 + j].checked,
					},
					'questions': [{
						'text': event.target[i * qset.dimensions.y * 2 + j + 1].value
					}],
					'answers': [{
						'id': null,
						'text': event.target[i * qset.dimensions.y * 2 + j + 1].value,
						'value': 100
					}]
				})
			}
			qset.items[0].items.push(temp)
		}
		this.setState({hasTable: true});
		event.preventDefault();
	}

	render() {
		return (
			<div>
				{this.state.popup === true ?
					<div className='popup'>
						<div className='popup\_inner'>
							<form className="title-container" onSubmit={this.handleTitleSubmit}>
								<input required="required" type="text" placeholder="New Spreadsheet Widget" defaultValue="New Spreadsheet Widget"/>
								<input type="submit" value="Save"/>
							</form>
						</div>
					</div>
				: ""}

				{this.state.popup === false ?
					this.state.hasTitle === true ?
						<div className="title-container">
							<span className="title">{title = (title || this.props.title)}</span>
							<input className="btn" type="submit" value="Edit" onClick={this.editTitle}/>
						</div>
					:
						<form className="title-container" onSubmit={this.handleTitleSubmit}>
							<input required="required" className="title" type="text" placeholder="Title" defaultValue={title = (title || this.props.title)}/>
							<input className="btn" type="submit" value="Save"/>
						</form>
				: ""}

				{this.state.iCanHazDimensions === true ?
					this.state.hasDimensions === true ?
						<div className="dimensions-container">
							<span className="dimensions">{`${qset.dimensions.x}  Row${qset.dimensions.x > 1 ? 's' : ''}  x  ${qset.dimensions.y}  Column${qset.dimensions.y > 1 ? 's' : ''}`}</span>
							<input className="btn" type="submit" value="Edit" onClick={this.editDimensions}/>
						</div>
					:
						<form className="dimensions-container" onSubmit={this.handleDimensionsSubmit}>
							<div className="dimensions">
								<input required="required" type="number" min="1" max="10" placeholder="X" defaultValue={qset.dimensions.x || (this.props.qset && this.props.qset.dimensions.x) && (qset.dimensions.x = this.props.qset.dimensions.x)}/>
								{"  Row(s)  x  "}
								<input required="required" type="number" min="1" max="10" placeholder="Y" defaultValue={qset.dimensions.y || (this.props.qset && this.props.qset.dimensions.y) && (qset.dimensions.y = this.props.qset.dimensions.y)}/>
								{"  Column(s)"}
							</div>
							<input className="btn" type="submit" value="Save"/>
						</form>
				: ""}

				{this.state.iCanHazTable === true ?
					this.state.hasTable === true ?
						<div className="table-container">
							<table>
								<tbody>
									{this.createTable(false)}
								</tbody>
							</table>
							<input type="submit" value="Edit" onClick={this.editTable}/>
						</div>
					:
						<div className="table-container">
							<p>Check the boxes to hide from players</p>
							<form onSubmit={this.handleTableSubmit}>
								<table>
									<tbody>
										{this.createTable(true)}
									</tbody>
								</table>
								<input type="submit" value="Preview"/>
							</form>
						</div>
				: ""}

			</div>
		);
	}
}

class Popup extends React.Component {
	render() {
		return (
			<div className='popup'>
				<div className='popup\_inner'>
					<h1>{this.props.text}</h1>
					<button onClick={this.props.closePopup}>close me</button>
				</div>
			</div>
		);
	}
}

let materiaCallbacks = {}

materiaCallbacks.initNewWidget = (instance) => {
	ReactDOM.render(
		<Creator title={title}/>,
		document.getElementById('root')
	);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version) => {
	ReactDOM.render(
		<Creator title={title} qset={_qset} />,
		document.getElementById('root')
	);
}

materiaCallbacks.onSaveClicked = () => {
	if(title != '')
		Materia.CreatorCore.save(title, qset, 1)
	else
		Materia.CreatorCore.cancelSave('This widget has no title!')
}

materiaCallbacks.onSaveComplete = (title, widget, qset, version) => {
	return null
}

Materia.CreatorCore.start(materiaCallbacks);

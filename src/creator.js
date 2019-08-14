import React from 'react'
import ReactDOM from 'react-dom'

const materiaCallbacks = {}

class CreatorApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasTitle: Boolean(props.title),
			showPopup: props.init,
			hasTable: Boolean(props.qset && props.qset.dimensions && props.qset.items.items),
			qset: props.qset,
			title: props.title,
		}

		// Callback when widget save is clicked
		materiaCallbacks.onSaveClicked = () => {
			if(this.state.title != ''){
				Materia.CreatorCore.save(this.state.title, this.state.qset, 1)
			} else {
				Materia.CreatorCore.cancelSave('This widget has no title!')
			}
		}

		materiaCallbacks.onSaveComplete = () => {
			return null
		}

		this.handleTitleSubmit = this.handleTitleSubmit.bind(this)
		this.handleTableSubmit = this.handleTableSubmit.bind(this)
		this.editTable = this.editTable.bind(this)
		this.handleRandomizationBlur = this.handleRandomizationBlur.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleXChange = this.handleXChange.bind(this)
		this.handleYChange = this.handleYChange.bind(this)
	}

	// A title for the new widget is submitted in the popup
	handleTitleSubmit(event) {
		this.setState({showPopup: false,
									 hasTitle: true
									})
		event.preventDefault()
	}

	// Save the submitted spreadsheet of data into the qset, preview the table
	handleTableSubmit(event) {
		this.state.qset.items[0].items = []
		for (let i = 0; i < this.state.qset.dimensions.x; i++) {
			const cellsDataArray = []
			// Incrementing by 2 to account for both the checkbox and text input
			for (let j = 0; j < this.state.qset.dimensions.y * 2; j += 2) {
				cellsDataArray.push({
					'materiaType': 'question',
					'id': null,
					'type': 'QA',
					'options': {
						'blank': event.target[i * this.state.qset.dimensions.y * 2 + j].checked,
					},
					'questions': [{
						'text': event.target[i * this.state.qset.dimensions.y * 2 + j + 1].value
					}],
					'answers': [{
						'id': null,
						'text': event.target[i * this.state.qset.dimensions.y * 2 + j + 1].value,
						'value': 100
					}]
				})
			}
			this.state.qset.items[0].items.push(cellsDataArray)
		}
		this.setState({hasTable: true})
		event.preventDefault()
	}

	// Go from preview mode back to edit mode for the table
	editTable(event) {
		this.setState({hasTable: false})
		event.preventDefault()
	}

	// Make sure the value for number of randomization is within bounds
	handleRandomizationBlur(event) {
		if (event.target.value <= 0) {
			this.state.qset.randomization = event.target.value = 0
		} else if (event.target.value > (this.state.qset.dimensions.x * this.state.qset.dimensions.y)) {
			this.state.qset.randomization = event.target.value = this.state.qset.dimensions.x * this.state.qset.dimensions.y
		} else {
			this.state.qset.randomization = event.target.value
		}
		event.preventDefault()
	}

	handleTitleChange(event) {
		this.setState({title: event.target.value})
		event.preventDefault()
	}

	// Make sure number of rows is 1-10
	handleXChange(event) {
		let xValue
		if (event.target.value < 1) {
			xValue = 1;
		} else if (event.target.value > 10) {
			xValue = 10
		} else {
			xValue = event.target.value
		}
		this.setState(Object.assign(this.state.qset.dimensions,{x:xValue}));
		event.preventDefault()
	}

	// Make sure number of columns is 1-10
	handleYChange(event) {
		let yValue
		if (event.target.value < 1) {
			yValue = 1;
		} else if (event.target.value > 10) {
			yValue = 10
		} else {
			yValue = event.target.value
		}
		this.setState(Object.assign(this.state.qset.dimensions,{y:yValue}));
		event.preventDefault()
	}

	render() {
		// on initial load this.props.qset is undefined which does not work with player
		// if (this.state.isTableEditable) {
		// 	if (typeof this.props.qset === 'undefined') {
		// 		qset.randomization = 0;
		// 	}
		// 	else {
		// 		qset.randomization = (qset.randomization || (this.props.qset && this.props.qset.randomization));
		// 	}
		// }

		return (
			<div>
				{this.state.showPopup ?
					<Popup
						onSubmit={this.handleTitleSubmit}
						onChange={this.handleTitleChange}
						title={this.state.title}
					/>
				:
					<div>
						<Title
							title={this.state.title}
							onChange={this.handleTitleChange}
						/>
						<Dimensions
							isEditable={this.state.hasTitle}
							qset={this.state.qset}
							onXChange={this.handleXChange}
							onYChange={this.handleYChange}
						/>
						{(this.state.qset.dimensions.x && this.state.qset.dimensions.y) ?
							this.state.hasTable ?
								<PreviewTable
									qset={this.state.qset}
									editTable={this.editTable}
								/>
							:
								<EditableTable
									qset={this.state.qset}
									onBlur={this.handleRandomizationBlur}
									onSubmit={this.handleTableSubmit}
								/>
						: ""}
					</div>
				}
			</div>
		)
	}
}

CreatorApp.defaultProps = {
	title: 'New Spreadsheet Widget',
	qset: {
		'randomization': 0,
		'dimensions': {'x': '', 'y': ''},
		'items': [{'items': []}]
	},
}

class Popup extends React.Component {
	render() {
		return (
			<div className='popup'>
				<div className='popup-inner'>
					<form className="title-container" onSubmit={this.props.onSubmit}>
						<input className="popup-input" required="required" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
						<input type="submit" value="Submit"/>
					</form>
				</div>
			</div>
		)
	}
}

class Title extends React.Component {
	render() {
		return (
			<input required="required" className="title-input" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
		)
	}
}

class Dimensions extends React.Component {
	render() {
		return (
			this.props.isEditable ?
				<div className="dimensions-input">
					<input required="required" type="number" min="1" max="10" placeholder="X" value={this.props.qset.dimensions.x} onChange={this.props.onXChange}/>
					{"  Row(s)  x  "}
					<input required="required" type="number" min="1" max="10" placeholder="Y" value={this.props.qset.dimensions.y} onChange={this.props.onYChange}/>
					{"  Column(s)"}
				</div>
			: ""
		)
	}
}

class PreviewTable extends React.Component {
	renderTable() {
		const table = []
		for (let i = 0; i < this.props.qset.dimensions.x; i++) {
			const row = []
			for (let j = 0; j < this.props.qset.dimensions.y; j++) {
				// Make sure data exist, use shortened variable name for readability
				const cellData = this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j]
				if (cellData && cellData.options.blank) {
					// Assign a specific className to cells meant to be hidden
					row.push(<PreviewCell lit='lit' data={cellData} key={`${i} - ${j}`}/>)
				} else {
					row.push(<PreviewCell lit='' data={cellData} key={`${i} - ${j}`}/>)
				}
			}
			table.push(<tr key={i}>{row}</tr>)
		}
		return table
	}

	render() {
		return (
			<div className="table-container">
				<table>
					<tbody>
						{this.renderTable()}
					</tbody>
				</table>
				<input className="table-button" type="submit" value="Edit" onClick={this.props.editTable}/>
			</div>
		)
	}
}

class EditableTable extends React.Component {
	renderTable() {
		const table = []
		for (let i = 0; i < this.props.qset.dimensions.x; i++) {
			const row = []
			for (let j = 0; j < this.props.qset.dimensions.y; j++) {
				// Make sure data exist, use shortened variable name for readability
				const cellData = (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j]) || (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j])
				row.push(<EditableCell key={`${i} - ${j}`} data={cellData}/>)
			}
			table.push(<tr key={i}>{row}</tr>)
		}
		return table
	}

	render() {
		return (
			<div className="table-container">
				<label>
					Check the boxes to hide from players or randomly hide
					<input type="number" placeholder={0} defaultValue={this.props.qset.randomization} min="1" max={this.props.qset.dimensions.x * this.props.qset.dimensions.y} onBlur={this.props.onBlur}/>
					fields
				</label>
				<form onSubmit={this.props.onSubmit}>
					<table>
						<tbody>
							{this.renderTable()}
						</tbody>
					</table>
					<input className="table-button" type="submit" value="Preview"/>
				</form>
			</div>
		)
	}
}

class EditableCell extends React.Component {
	render() {
		return (
			<td>
				<input type="checkbox" defaultChecked={this.props.data && this.props.data.options.blank}/>
				<input type="text" placeholder="" defaultValue={this.props.data && this.props.data.questions[0].text}/>
			</td>
		)
	}
}

class PreviewCell extends React.Component {
	render() {
		return (
			<td className={this.props.lit}>
				{this.props.data && this.props.data.questions[0].text}
			</td>
		)
	}
}

// Callback when a new widget is being created
materiaCallbacks.initNewWidget = (instance) => {
	ReactDOM.render(
		<CreatorApp title={'New Spreadsheet Widget'} init={true}/>,
		document.getElementById('root')
	)
}

// Callback when editing an existing widget
materiaCallbacks.initExistingWidget = (title, instance, _qset, version) => {
	ReactDOM.render(
		<CreatorApp title={title} qset={_qset} />,
		document.getElementById('root')
	)
}

// Tell materia we're ready and give it a reference to our callbacks
Materia.CreatorCore.start(materiaCallbacks)

import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './components/creator-popup'
import Title from './components/creator-title'
import Options from './components/creator-options'
import Table from './components/creator-table'

const materiaCallbacks = {}
let creatorInstance

export default class CreatorApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showIntro: props.init,
			qset: props.qset,
			title: props.title,
			showPopup: props.init,
		}

		this.state.qset.items[0].items.push([this.cellData('', false)])

		this.showIntro = this.showIntro.bind(this)
		this.editTitle = this.editTitle.bind(this)
		this.handleTitleSubmit = this.handleTitleSubmit.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleTableSubmit = this.handleTableSubmit.bind(this)
		this.handleXChange = this.handleXChange.bind(this)
		this.handleYChange = this.handleYChange.bind(this)
		this.useSpreadsheet = this.useSpreadsheet.bind(this)
    this.useTable = this.useTable.bind(this)
    this.useLeftAlign = this.useLeftAlign.bind(this)
    this.useCenterAlign = this.useCenterAlign.bind(this)
		this.useHeader = this.useHeader.bind(this)
		this.onSaveClicked = this.onSaveClicked.bind(this)
	}

	// Callback when widget save is clicked
	onSaveClicked(){
		if(this.state.title != ''){
			Materia.CreatorCore.save(this.state.title, this.state.qset, 1)
		} else {
			Materia.CreatorCore.cancelSave('This widget has no title!')
		}
	}

	showIntro(event) {
		this.setState({showIntro: true,
									 showPopup: true})
		event.preventDefault()
	}

	editTitle(event) {
		this.setState({showIntro: false,
									 showPopup: true})
		event.preventDefault()
	}

	// A title for the new widget is submitted in the popup
	handleTitleSubmit(event) {
		this.setState({showIntro: false,
									 showPopup: false,
									 isTitleEditable: true
									})
		event.preventDefault()
	}

	// Save title
	handleTitleChange(event) {
		this.setState({title: event.target.value})
		event.preventDefault()
	}

	// Save the submitted spreadsheet of data into the qset
	handleTableSubmit(event) {
		this.state.qset.items[0].items = []
		for (let i = 0; i < this.state.qset.dimensions.x; i++) {
			const cellsArray = []
			// Incrementing by 2 to account for both the checkbox and text input
			for (let j = 0; j < this.state.qset.dimensions.y * 2; j += 2) {
				if (i == 0 && this.state.qset.header) {
					event.target[i * this.state.qset.dimensions.y * 2 + j + 1].checked = false
				}
				const value = event.target[i * this.state.qset.dimensions.y * 2 + j].value
				const check = event.target[i * this.state.qset.dimensions.y * 2 + j + 1].checked
				cellsArray.push(
					this.cellData(value, check)
				)
			}
			this.state.qset.items[0].items.push(cellsArray)
		}
		event.preventDefault()
	}

	cellData(value, check) {
		return {
			'materiaType': 'question',
			'id': null,
			'type': 'QA',
			'options': {
				'blank': check,
			},
			'questions': [{
				'text': value,
			}],
			'answers': [{
				'id': null,
				'text': value,
				'value': 100
			}]
		}
	}

	// Make sure number of rows is 1-10
	handleXChange(event) {
		if (Number.isInteger(event.target.value)) {
			let xValue
			if (event.target.value < 1) {
				xValue = 1;
			} else if (event.target.value > 10) {
				xValue = 10
			} else {
				xValue = event.target.value
			}
			this.setState(Object.assign(this.state.qset.dimensions,{x:xValue}))
			event.preventDefault()
		}
	}

	// Make sure number of columns is 1-10
	handleYChange(event) {
		if (Number.isInteger(event.target.value)) {
			let yValue
			if (event.target.value < 1) {
				yValue = 1;
			} else if (event.target.value > 10) {
				yValue = 10
			} else {
				yValue = event.target.value
			}
			this.setState(Object.assign(this.state.qset.dimensions,{y:yValue}))
			event.preventDefault()
		}
	}

	useSpreadsheet() {
    this.setState(Object.assign(this.state.qset,{spreadsheet:true}))
  }

  useTable() {
    this.setState(Object.assign(this.state.qset,{spreadsheet:false}))
  }

  useLeftAlign() {
    this.setState(Object.assign(this.state.qset,{left:true}))
  }

  useCenterAlign() {
    this.setState(Object.assign(this.state.qset,{left:false}))
  }

  useHeader() {
		this.setState(Object.assign(this.state.qset,{header:!this.state.qset.header}))
		for (let i = 0; i < this.state.qset.dimensions.y; i++) {
			this.setState(Object.assign(this.state.qset.items[0].items[0][i].options, {blank: false}))
		}
	}

	render() {
		return (
			<div>
				{this.state.showPopup ?
					<Popup
						showIntro={this.state.showIntro}
						onSubmit={this.handleTitleSubmit}
						onChange={this.handleTitleChange}
						title={this.state.title}
					/>
				: "" }

				<Title
					showIntro={this.showIntro}
					editTitle={this.editTitle}
					title={this.state.title}
				/>

				<Options
					qset={this.state.qset}
					useSpreadsheet={this.useSpreadsheet}
					useTable={this.useTable}
					useLeftAlign={this.useLeftAlign}
					useCenterAlign={this.useCenterAlign}
					useHeader={this.useHeader}
				/>

				<div className="table-container">
					<div className="table-text">
						<label className="what-to-do">WHAT TO DO</label>
						<div>
							<ul>
								<li><label>Add rows and columns, then input data in the cells below.</label></li>
								<li><label>Check cells to turn them <span className="blue-text">blue</span> - these will be left blank for students to fill out.</label></li>
							</ul>
						</div>
					</div>
					<Table
						cellData={this.cellData}
						qset={this.state.qset}
						onSubmit={this.handleTableSubmit}
					/>
				</div>
			</div>
		)
	}
}

CreatorApp.defaultProps = {
	title: 'New Spreadsheet Widget',
	qset: {
		'left': false,
		'header': false,
		'spreadsheet': true,
		'randomization': 0,
		'dimensions': {'x': 1, 'y': 1},
		'items': [{'items': []}]
	},
}

// Callback when a new widget is being created
materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget('New Spreadsheet Widget', instance, undefined, 1)
	return '1A4'
}

// Callback when editing an existing widget
materiaCallbacks.initExistingWidget = (title, instance, _qset, version) => {
	creatorInstance = ReactDOM.render(
		<CreatorApp title={title} qset={_qset} />,
		document.getElementById('root')
	)
	return '1A4'
}

// Callback when widget save is clicked
materiaCallbacks.onSaveClicked = () => {
	// proxy to the class instance method
	creatorInstance.onSaveClicked()
}

materiaCallbacks.onSaveComplete = () => {
	return '1A4'
}


// Tell materia we're ready and give it2 a reference to our callbacks
Materia.CreatorCore.start(materiaCallbacks)

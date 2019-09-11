import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './components/creator-popup'
import Title from './components/creator-title'
import Dimensions from './components/creator-dimensions'
import PreviewTable from './components/creator-preview-table'
import EditTable from './components/creator-edit-table'
import Options from './components/creator-options'


const materiaCallbacks = {}

class CreatorApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isTitleEditable: Boolean(props.title),
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

		this.editTitle = this.editTitle.bind(this)
		this.handleTitleSubmit = this.handleTitleSubmit.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleTableSubmit = this.handleTableSubmit.bind(this)
		this.handleTableEditability = this.handleTableEditability.bind(this)
		this.handleXChange = this.handleXChange.bind(this)
		this.handleYChange = this.handleYChange.bind(this)
	}

	editTitle(event) {
		this.setState({showPopup: true})
		event.preventDefault()
	}

	// A title for the new widget is submitted in the popup
	handleTitleSubmit(event) {
		this.setState({showPopup: false,
									 isTitleEditable: true
									})
		event.preventDefault()
	}

	// Save title
	handleTitleChange(event) {
		this.setState({title: event.target.value})
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
	handleTableEditability(event) {
		this.setState({hasTable: false})
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
				: "" }
				<div className="title-bar">
					<Title
						isTitleEditable={this.state.isTitleEditable}
						editTitle={this.editTitle}
						title={this.state.title}
						onChange={this.handleTitleChange}
						onBlur={this.handleTitleBlur}
					/>
				</div>

				<Options
					qset={this.state.qset}
				/>

				<div className="table-container">
					{(this.state.qset.dimensions.x && this.state.qset.dimensions.y) ?
						this.state.hasTable ?
							<PreviewTable
								qset={this.state.qset}
								handleTableEditability={this.handleTableEditability}
							/>
						:
							<EditTable
								qset={this.state.qset}
								onSubmit={this.handleTableSubmit}
							/>
					: ""}
				</div>
			</div>
		)
	}
}

CreatorApp.defaultProps = {
	title: 'New Spreadsheet Widget',
	qset: {
		'left': true,
		'header': false,
		'spreadsheet': true,
		'randomization': 0,
		'dimensions': {'x': 2, 'y': 2},
		'items': [{'items': []}]
	},
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

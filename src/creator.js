import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './components/creator-popup'
import Title from './components/creator-title'
import Options from './components/creator-options'
import Table from './components/creator-table'
import Question from './components/creator-question'
import Instruction from './components/creator-instruction'


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
			showKeyControls: false,
			showInstruction: true,
			showQuestion: props.qset.question !== '',
			questionRows: 1,
			minQuestionRows: 1,
			maxQuestionRows: 2,
			descriptionRows: 2,
			minDescriptionRows: 2,
			maxDescriptionRows: 4,
			numHidden: 0,
			hideCellsRandomly: props.qset.randomization == 0,
		}

		this.state.qset.items[0].items.push([this.cellData('', false)])

		this.showIntro = this.showIntro.bind(this)
		this.editTitle = this.editTitle.bind(this)
		this.handleTitleSubmit = this.handleTitleSubmit.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleXChange = this.handleXChange.bind(this)
		this.handleYChange = this.handleYChange.bind(this)
		this.useSpreadsheet = this.useSpreadsheet.bind(this)
		this.useTable = this.useTable.bind(this)
		this.useLeftAlign = this.useLeftAlign.bind(this)
		this.useCenterAlign = this.useCenterAlign.bind(this)
		this.useHeader = this.useHeader.bind(this)
		this.useQuestion = this.useQuestion.bind(this)
		this.handleQuestionChange = this.handleQuestionChange.bind(this)
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
		this.onSaveClicked = this.onSaveClicked.bind(this)
		this.toggleKeyboardInst = this.toggleKeyboardInst.bind(this)
		this.toggleInstruction = this.toggleInstruction.bind(this)
		this.toggleHideCellMethod = this.toggleHideCellMethod.bind(this)
		this.resetCheckbox = this.resetCheckbox.bind(this)
		this.resetRandomization = this.resetRandomization.bind(this)
	}

	// Callback when widget save is clicked
	onSaveClicked() {
		let minimumOneCellHidden = false
		if (this.state.qset.randomization > 0) {
			minimumOneCellHidden = true
		} else {
			for (let i = 0; i < this.state.qset.dimensions.x; i++) {
				for (let j = 0; j < this.state.qset.dimensions.y; j++) {
					if (this.state.qset.items[0].items[i][j].options.blank) {
						minimumOneCellHidden = true
					}
				}
			}
		}

		if (!minimumOneCellHidden) {
			Materia.CreatorCore.cancelSave('At least one cell must be hidden!')
		} else if (this.state.title == '') {
			Materia.CreatorCore.cancelSave('This widget has no title!')
		} else {
			Materia.CreatorCore.save(this.state.title, this.state.qset, 1)
		}
	}

	// Display intro popup instead of normal popup
	showIntro() {
		this.setState({
			showIntro: true,
			showPopup: true
		})
	}

	// Display normal popup instead of intro popup
	editTitle() {
		this.setState({
			showIntro: false,
			showPopup: true
		})
	}

	// A title for the new widget is submitted in the popup
	handleTitleSubmit(event) {
		this.setState({
			showIntro: false,
			showPopup: false,
			isTitleEditable: true
		})
		event.preventDefault()
	}

	// Save title
	handleTitleChange(event) {
		this.setState({ title: event.target.value })
	}

	// Shows keyboard controlls guide
	toggleKeyboardInst() {
		if (this.state.showKeyControls) {
			this.setState({
				showKeyControls: false
			})
		}
		else {
			this.setState({
				showKeyControls: true
			})
		}
	}

	// constructs an object containing cell data
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
		let xValue
		if (event.target.value < 1) {
			xValue = 1
		} else if (event.target.value > 10) {
			xValue = 10
		} else {
			xValue = event.target.value
		}
		this.setState(Object.assign(this.state.qset.dimensions, { x: xValue }))
	}

	// Make sure number of columns is 1-10
	handleYChange(event) {
		let yValue
		if (event.target.value < 1) {
			yValue = 1
		} else if (event.target.value > 10) {
			yValue = 10
		} else {
			yValue = event.target.value
		}
		this.setState(Object.assign(this.state.qset.dimensions, { y: yValue }))
	}

	useSpreadsheet() {
		this.setState(Object.assign(this.state.qset, { spreadsheet: true }))
	}

	useTable() {
		this.setState(Object.assign(this.state.qset, { spreadsheet: false }))
	}

	useLeftAlign() {
		this.setState(Object.assign(this.state.qset, { left: true }))
	}

	useCenterAlign() {
		this.setState(Object.assign(this.state.qset, { left: false }))
	}

	useHeader() {
		this.setState(Object.assign(this.state.qset, { header: !this.state.qset.header }))
		// Stop cells in the first row from being hidden
		for (let i = 0; i < this.state.qset.dimensions.y; i++) {
			this.setState(Object.assign(this.state.qset.items[0].items[0][i].options, { blank: false }))
		}
		// Adjust maximum number of cells allowed to be randomly hidden
		if (this.props.qset.randomization > ((!this.props.qset.header ? this.props.qset.dimensions.x : (this.props.qset.dimensions.x - 1)) * this.props.qset.dimensions.y)) {
			this.setState(Object.assign(this.state.qset, { randomization: (this.props.qset.dimensions.x - 1) * this.props.qset.dimensions.y }))
		}
	}

	// Display textarea for question and description text
	useQuestion() {
		this.setState({showQuestion: !this.state.showQuestion})
		this.setState(Object.assign(this.state.qset, { question: '', description: '' }))
	}

	// Resizable textarea for question text. Automatically adjusts based
	// on lines of text entered (up to a certain point)
	handleQuestionChange(event) {
		const textareaLineHeight = 24
		const { minQuestionRows, maxQuestionRows } = this.state

		const previousRows = event.target.rows
		event.target.rows = minQuestionRows

		// total number of lines of text
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight)

		// no change in textarea size
		if (currentRows === previousRows) {
			event.target.rows = currentRows
		}

		// textarea size restricted to maxQuestionRows defined in constructor
		if (currentRows >= maxQuestionRows) {
			event.target.rows = maxQuestionRows
			event.target.scrollTop = event.target.scrollHeight
		}

		this.setState(Object.assign(this.state.qset, { question: event.target.value }))

		this.setState({
			questionRows: currentRows < maxQuestionRows ? currentRows : maxQuestionRows,
		})
	}

	handleDescriptionChange(event) {
		const textareaLineHeight = 20
		const { minDescriptionRows, maxDescriptionRows } = this.state

		const previousRows = event.target.rows
		event.target.rows = minDescriptionRows

		// total number of lines of text
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight)

		// no change in textarea size
		if (currentRows === previousRows) {
			event.target.rows = currentRows
		}

		// textarea size restricted to maxQuestionRows defined in constructor
		if (currentRows >= maxDescriptionRows) {
			event.target.rows = maxDescriptionRows
			event.target.scrollTop = event.target.scrollHeight
		}

		this.setState(Object.assign(this.state.qset, { description: event.target.value }))

		this.setState({
			descriptionRows: currentRows < maxDescriptionRows ? currentRows : maxDescriptionRows,
		})
	}

	toggleInstruction() {
		this.setState({showInstruction: !this.state.showInstruction})
	}

	// toggles between randomly vs manually hiding cells.
	toggleHideCellMethod() {
		this.setState({hideCellsRandomly: !this.state.hideCellsRandomly})

		// resets each other
		if (!this.state.hideCellsRandomly) {
			this.resetRandomization()
		} else {
			this.resetCheckbox()
		}
	}

	resetCheckbox() {
		for (let i = 0; i < this.state.qset.dimensions.x; i++) {
			for (let j = 0; j < this.state.qset.dimensions.y; j++) {
				this.setState(Object.assign(this.state.qset.items[0].items[i][j].options, { blank: false }))
			}
		}
	}

	resetRandomization() {
		this.setState(Object.assign(this.state.qset, { randomization: 0 }))
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
					: ""}

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
					showInstruction={this.state.showInstruction}
					showQuestion={this.state.showQuestion}
					useQuestion={this.useQuestion}
					toggleInstruction={this.toggleInstruction}
					hideCellsRandomly={this.state.hideCellsRandomly}
					toggleHideCellMethod={this.toggleHideCellMethod}
				/>


				<div className="table-container">
					<Instruction
						showInstruction={this.state.showInstruction}
						toggleInstruction={this.toggleInstruction}
						hideCellsRandomly={this.state.hideCellsRandomly}
						toggleKeyboardInst={this.toggleKeyboardInst}
						showKeyControls={this.state.showKeyControls}
					/>

					<Question
						questionRows={this.state.questionRows}
						descriptionRows={this.state.descriptionRows}
						showQuestion={this.state.showQuestion}
						qset={this.state.qset}
						handleQuestionChange={this.handleQuestionChange}
						handleDescriptionChange={this.handleDescriptionChange}
					/>

					<Table
						cellData={this.cellData}
						qset={this.state.qset}
						hideCellsRandomly={this.state.hideCellsRandomly}
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
		'question': '',
		'description': '',
		'dimensions': { 'x': 1, 'y': 1 },
		'items': [{ 'items': [] }]
	},
}

// Callback when a new widget is being created
materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget('New Spreadsheet Widget', instance, undefined, 1, true)
	// return value for testing
}

// Callback when editing an existing widget
materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	creatorInstance = ReactDOM.render(
		<CreatorApp title={title} qset={_qset} init={newWidget} />,
		document.getElementById('root')
	)
	// return value for testing
	return '1A4'
}

// Callback when widget save is clicked
materiaCallbacks.onSaveClicked = () => {
	// proxy to the class instance method
	creatorInstance.onSaveClicked()
}

// Callback when widget save is completed
materiaCallbacks.onSaveComplete = () => {
	// return value for testing
	return '1A4'
}


// Tell materia we're ready and give it a reference to our callbacks
Materia.CreatorCore.start(materiaCallbacks)

import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './components/creator/popup';
import Title from './components/creator/title';
import Options from './components/creator/options';
import Table from './components/creator/table';
import Question from './components/creator/question';
import Instruction from './components/creator/instruction';


const materiaCallbacks = {};
let creatorInstance;

export default class CreatorApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showIntro: props.init,
			qset: props.qset,
			title: props.title,
			showPopup: props.init,
			showKeyControls: false,
			showInstruction: true,
			showQuestion: props.qset.question !== ``,
			questionRows: 1,
			minQuestionRows: 1,
			maxQuestionRows: 2,
			descriptionRows: 2,
			minDescriptionRows: 2,
			maxDescriptionRows: 4,
			numHidden: 0,
			hideCellsRandomly: props.qset.randomization == 0,
		};

		this.state.qset.items[0].items.push([this.cellData(``, false)]);

		this.showIntro = this.showIntro.bind(this);
		this.editTitle = this.editTitle.bind(this);
		this.handleTitleSubmit = this.handleTitleSubmit.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleXChange = this.handleXChange.bind(this);
		this.handleYChange = this.handleYChange.bind(this);
		this.useSpreadsheet = this.useSpreadsheet.bind(this);
		this.useTable = this.useTable.bind(this);
		this.useLeftAlign = this.useLeftAlign.bind(this);
		this.useCenterAlign = this.useCenterAlign.bind(this);
		this.useHeader = this.useHeader.bind(this);
		this.useQuestion = this.useQuestion.bind(this);
		this.handleQuestionChange = this.handleQuestionChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.onSaveClicked = this.onSaveClicked.bind(this);
		this.toggleKeyboardInst = this.toggleKeyboardInst.bind(this);
		this.toggleInstruction = this.toggleInstruction.bind(this);
		this.toggleHideCellMethod = this.toggleHideCellMethod.bind(this);
		this.resetCheckbox = this.resetCheckbox.bind(this);
		this.resetRandomization = this.resetRandomization.bind(this);
		this.appendRow = this.appendRow.bind(this);
		this.removeRow = this.removeRow.bind(this);
		this.appendColumn = this.appendColumn.bind(this);
		this.removeColumn = this.removeColumn.bind(this);
		this.focusOnCell = this.focusOnCell.bind(this);
		this.focusOnInstruction = this.focusOnInstruction.bind(this);
		// Used when placing focus on cells
		this.refsArray = [];
		this.instructionRef = React.createRef();
	}

	// Callback when widget save is clicked
	onSaveClicked() {
		if (this.state.title == ``) {
			Materia.CreatorCore.cancelSave(`This widget has no title!`);
			return;
		}

		let minimumOneCellHidden = false;

		if (this.state.qset.randomization > 0) {
			minimumOneCellHidden = true;
		}

		for (let i = 0; i < this.state.qset.dimensions.rows; i++) {
			for (let j = 0; j < this.state.qset.dimensions.columns; j++) {
				const options = this.state.qset.items[0].items[i][j].options;

				if (options.position === undefined) {
					options.position = {};
				}

				options.position.row = i;
				options.position.column = j;

				if (options.blank) {
					minimumOneCellHidden = true;
				}
			}
		}

		if (!minimumOneCellHidden) {
			Materia.CreatorCore.cancelSave(`At least one cell must be hidden!`);
		}
		else {
			Materia.CreatorCore.save(this.state.title, this.state.qset, 1);
		}
	}

	// Display intro popup instead of normal popup
	showIntro() {
		this.setState({
			showIntro: true,
			showPopup: true
		});
	}

	// Display normal popup instead of intro popup
	editTitle() {
		this.setState({
			showIntro: false,
			showPopup: true
		});
	}

	// A title for the new widget is submitted in the popup
	handleTitleSubmit(event) {
		this.setState({
			showIntro: false,
			showPopup: false,
			isTitleEditable: true
		});
		event.preventDefault();
	}

	// Save title
	handleTitleChange(event) {
		this.setState({ title: event.target.value });
	}

	// Shows keyboard controlls guide
	toggleKeyboardInst() {
		if (this.state.showKeyControls) {
			this.setState({
				showKeyControls: false
			});
		}
		else {
			this.setState({
				showKeyControls: true
			});
		}
	}

	// constructs an object containing cell data
	cellData(value, check) {
		let input = value;

		if (typeof input !== `string`) {
			input = input.toString();
		}

		return {
			'materiaType': `question`,
			'id': null,
			'type': `QA`,
			'options': {
				'blank': check,
				'position': {
					'row': null,
					'column': null
				}
			},
			'questions': [{
				'text': input,
			}],
			'answers': [{
				'id': null,
				'text': value,
				'value': 100
			}]
		};
	}

	// Make sure number of rows is 1-10
	handleXChange(event) {
		let rowValue;
		if (event.target.value < 1) {
			rowValue = 1;
		}
		else if (event.target.value > 10) {
			rowValue = 10;
		}
		else {
			rowValue = event.target.value;
		}
		this.setState(Object.assign(this.state.qset.dimensions, { rows: rowValue }));
	}

	// Make sure number of columns is 1-10
	handleYChange(event) {
		let columnValue;
		if (event.target.value < 1) {
			columnValue = 1;
		}
		else if (event.target.value > 10) {
			columnValue = 10;
		}
		else {
			columnValue = event.target.value;
		}
		this.setState(Object.assign(this.state.qset.dimensions, { columns: columnValue }));
	}

	useSpreadsheet() {
		this.setState(Object.assign(this.state.qset, { spreadsheet: true }));
	}

	useTable() {
		this.setState(Object.assign(this.state.qset, { spreadsheet: false }));
	}

	useLeftAlign() {
		this.setState(Object.assign(this.state.qset, { left: true }));
	}

	useCenterAlign() {
		this.setState(Object.assign(this.state.qset, { left: false }));
	}

	useHeader() {
		this.setState(Object.assign(this.state.qset, { header: !this.state.qset.header }));
		// Stop cells in the first row from being hidden
		for (let i = 0; i < this.state.qset.dimensions.columns; i++) {
			this.setState(Object.assign(this.state.qset.items[0].items[0][i].options, { blank: false }));
		}
		// Adjust maximum number of cells allowed to be randomly hidden
		if (this.props.qset.randomization > ((!this.props.qset.header ? this.props.qset.dimensions.rows : (this.props.qset.dimensions.rows - 1)) * this.props.qset.dimensions.columns)) {
			this.setState(Object.assign(this.state.qset, { randomization: (this.props.qset.dimensions.rows - 1) * this.props.qset.dimensions.columns }));
		}
	}

	// Display textarea for question and description text
	useQuestion() {
		this.setState({showQuestion: !this.state.showQuestion});
		this.setState(Object.assign(this.state.qset, { question: ``, description: `` }));
	}

	// Resizable textarea for question text. Automatically adjusts based
	// on lines of text entered (up to a certain point)
	handleQuestionChange(event) {
		const textareaLineHeight = 24;
		const { minQuestionRows, maxQuestionRows } = this.state;

		const previousRows = event.target.rows;
		event.target.rows = minQuestionRows;

		// total number of lines of text
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

		// no change in textarea size
		if (currentRows === previousRows) {
			event.target.rows = currentRows;
		}

		// textarea size restricted to maxQuestionRows defined in constructor
		if (currentRows >= maxQuestionRows) {
			event.target.rows = maxQuestionRows;
			event.target.scrollTop = event.target.scrollHeight;
		}

		this.setState(Object.assign(this.state.qset, { question: event.target.value }));

		this.setState({
			questionRows: currentRows < maxQuestionRows ? currentRows : maxQuestionRows,
		});
	}

	handleDescriptionChange(event) {
		const textareaLineHeight = 20;
		const { minDescriptionRows, maxDescriptionRows } = this.state;

		const previousRows = event.target.rows;
		event.target.rows = minDescriptionRows;

		// total number of lines of text
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

		// no change in textarea size
		if (currentRows === previousRows) {
			event.target.rows = currentRows;
		}

		// textarea size restricted to maxQuestionRows defined in constructor
		if (currentRows >= maxDescriptionRows) {
			event.target.rows = maxDescriptionRows;
			event.target.scrollTop = event.target.scrollHeight;
		}

		this.setState(Object.assign(this.state.qset, { description: event.target.value }));

		this.setState({
			descriptionRows: currentRows < maxDescriptionRows ? currentRows : maxDescriptionRows,
		});
	}

	toggleInstruction() {
		this.setState({showInstruction: !this.state.showInstruction});
	}

	// toggles between randomly vs manually hiding cells.
	toggleHideCellMethod() {
		this.setState({hideCellsRandomly: !this.state.hideCellsRandomly});

		// resets each other
		if (!this.state.hideCellsRandomly) {
			this.resetRandomization();
		}
		else {
			this.resetCheckbox();
		}
	}

	resetCheckbox() {
		for (let i = 0; i < this.state.qset.dimensions.rows; i++) {
			for (let j = 0; j < this.state.qset.dimensions.columns; j++) {
				this.setState(Object.assign(this.state.qset.items[0].items[i][j].options, { blank: false }));
			}
		}
	}

	resetRandomization() {
		this.setState(Object.assign(this.state.qset, { randomization: 0 }));
	}

	// Add a row to the table, limited to 10 rows
	appendRow() {
		const xValue = Math.min(10, parseInt(this.state.qset.dimensions.rows) + 1);
		this.setState(Object.assign(this.state.qset.dimensions,{rows:xValue}));
		// Fill the cells in the row with empty cell data
		const cellsArray = [];
		for (let i = 0; i < this.state.qset.dimensions.columns; i++) {
			cellsArray.push(this.cellData(``, false));
		}

		this.state.qset.items[0].items.push(cellsArray);
	}

	// Remove the last row of the table until only 1 row remains
	removeRow(row, col) {
		if (this.state.qset.dimensions.rows > 1) {
			const rowsValue = parseInt(this.state.qset.dimensions.rows) - 1;

			// If focus is currently in the row being removed, focus on a previous row
			if (rowsValue == row) {
				this.focusOnCell(rowsValue - 1, col);
			}

			this.setState(Object.assign(this.state.qset.dimensions,{rows:rowsValue}));

			this.state.qset.items[0].items.pop();

			// Also remove the row from refsArray
			const arr = this.refsArray.slice(0);
			arr.splice(rowsValue, 1);
			this.refsArray = arr;
		}
	}

	// Add a column to the table, limited to 10 rows
	appendColumn() {
		const columnValue = Math.min(10, parseInt(this.state.qset.dimensions.columns) + 1);
		this.setState(Object.assign(this.state.qset.dimensions,{columns:columnValue}));

		// Fill the cells in the column with empty cell data
		for (let i = 0; i < this.state.qset.dimensions.rows; i++) {
			this.state.qset.items[0].items[i].push(this.cellData(``, false));
		}
	}

	// Remove the last column of the table until only 1 column remains
	removeColumn(row, col) {
		if (this.state.qset.dimensions.columns > 1) {
			const columnValue = Math.max(1, parseInt(this.state.qset.dimensions.columns) - 1);

			// If focus is currently in the column being removed, focus on a previous column
			if (columnValue == col) {
				this.focusOnCell(row, columnValue - 1);
			}

			this.setState(Object.assign(this.state.qset.dimensions,{columns:columnValue}));
			for (let i = 0; i < this.state.qset.dimensions.rows; i++) {
				this.state.qset.items[0].items[i].pop();
			}

			// Remove column from refsArray
			for (let i = this.state.qset.dimensions.rows - 1; i >= 0; i--) {
				this.refsArray[i].splice(this.state.qset.dimensions.columns, 1);
			}
		}
	}

	focusOnCell(row, col) {
		if (row >= 0 && row < this.state.qset.dimensions.rows &&
				col >= 0 && col < this.state.qset.dimensions.columns) {
			this.refsArray[row][col].focus();
			// return value for testing
			return 1;
		}
		else {
			return 0;
		}
	}

	focusOnInstruction(e) {
		e.focus();
	}

	render() {
		return (
			<div className="creator-component" tabIndex={0} onKeyDown={(e) => {
				// Keyboard controls for table:
				// Alt + PageUp         = Add Column
				// Alt + PageDown       = Remove Column
				// Shift + PageUp       = Add Row
				// Shift + PageDown     = Remove Row
				if (e.key === `PageUp` && e.altKey) {
					this.appendColumn();
				}
				else if (e.key === `PageDown` && e.altKey) {
					this.removeColumn(0, 0);
				}
				else if (e.key === `PageUp` && e.shiftKey) {
					this.appendRow();
				}
				else if (e.key === `PageDown` && e.shiftKey) {
					this.removeRow(0, 0);
				}
			}}>
				{this.state.showPopup ?
					<Popup
						showIntro={this.state.showIntro}
						onSubmit={this.handleTitleSubmit}
						onChange={this.handleTitleChange}
						title={this.state.title}
					/>
					: ``}

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
					instructionRef={this.instructionRef}
				/>


				<div className="table-container">
					<Instruction
						showInstruction={this.state.showInstruction}
						toggleInstruction={this.toggleInstruction}
						hideCellsRandomly={this.state.hideCellsRandomly}
						toggleKeyboardInst={this.toggleKeyboardInst}
						showKeyControls={this.state.showKeyControls}
						focusOnInstruction={this.focusOnInstruction}
						instructionRef={this.instructionRef}
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
						appendColumn={this.appendColumn}
						removeColumn={this.removeColumn}
						appendRow={this.appendRow}
						removeRow={this.removeRow}
						focusOnCell={this.focusOnCell}
						refsArray={this.refsArray}
					/>
				</div>
			</div>
		);
	}
}

CreatorApp.defaultProps = {
	title: `New Secret Spreadsheet`,
	qset: {
		'left': false,
		'header': false,
		'spreadsheet': true,
		'randomization': 0,
		'question': ``,
		'description': ``,
		'dimensions': { 'rows': 1, 'columns': 1 },
		'items': [{ 'items': [] }]
	},
};

// Callback when a new widget is being created
materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget(`New Secret Spreadsheet`, instance, undefined, 1, true);
	// return value for testing
};

// Callback when editing an existing widget
materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	creatorInstance = ReactDOM.render(
		<CreatorApp title={title} qset={_qset} init={newWidget} />,
		document.getElementById(`root`)
	);
	// return value for testing
	return `1A4`;
};

// Callback when widget save is clicked
materiaCallbacks.onSaveClicked = () => {
	// proxy to the class instance method
	creatorInstance.onSaveClicked();
};

// Callback when widget save is completed
materiaCallbacks.onSaveComplete = () => {
	// return value for testing
	return `1A4`;
};


// Tell materia we're ready and give it a reference to our callbacks
Materia.CreatorCore.start(materiaCallbacks);

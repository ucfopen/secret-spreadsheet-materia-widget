import React from 'react'

export default class Cell extends React.Component {
	constructor(props) {
		super(props)
		this.handleCheckboxToggle = this.handleCheckboxToggle.bind(this)
		this.handleTextboxChange = this.handleTextboxChange.bind(this)
	}

	handleCheckboxToggle(event) {
		this.setState(Object.assign(this.props.data.options, {blank: !this.props.data.options.blank}))
		this.props.resetRandomization()
	}

	handleTextboxChange(event) {
		this.setState(Object.assign(this.props.data.questions[0], {text: event.target.value}))
		this.setState(Object.assign(this.props.data.answers[0], {text: event.target.value}))
	}

	render() {
		return (
			<td className={`${this.props.className} ${this.props.data && this.props.data.options.blank ? "hidden-cell" : ""} tableCell`}>
				<div className="cell" onKeyDown={(e) => {
					// Keyboard controls for table:
					// Alt + PageUp         = Add Column
					// Alt + PageDown       = Remove Column
					// Shift + PageUp       = Add Row
					// Shift + PageDown     = Remove Row
					// Ctrl/Command + Arrow = Move Cell
					if (e.key === 'PageUp' && e.altKey) {
						this.props.appendColumn()
					} else if (e.key === 'PageDown' && e.altKey) {
						this.props.removeColumn(this.props.row, this.props.column)
					} else if (e.key === 'PageUp' && e.shiftKey) {
						this.props.appendRow()
					} else if (e.key === 'PageDown' && e.shiftKey) {
						this.props.removeRow(this.props.row, this.props.column)
					} else if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
						this.props.focusOnCell(this.props.row - 1, this.props.column)
					} else if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
						this.props.focusOnCell(this.props.row + 1, this.props.column)
					} else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
						this.props.focusOnCell(this.props.row, this.props.column - 1)
					} else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
						this.props.focusOnCell(this.props.row, this.props.column + 1)
					}
				}}>
					<input
						ref={el => {this.props.refsArray[this.props.row][this.props.column] = el}}
						className={`row-${this.props.row} col-${this.props.column}`}
						type="text"
						value={this.props.data && this.props.data.questions[0].text}
						onChange={this.handleTextboxChange}
						placeholder={this.props.useSpreadsheet ? `${String.fromCharCode(this.props.row + 65)}${this.props.column + 1}` : ''}
					/>

					<div
						className="checkbox"
						onClick={this.handleCheckboxToggle}
					>
						<input
							type="checkbox"
							onKeyDown={(e) => {if (e.key === 'Enter') {this.handleCheckboxToggle()}}}
							onChange={() => {}}
							checked={this.props.data && this.props.data.options.blank}
						/>
						Hide
					</div>
				</div>
			</td>
		)
	}
}

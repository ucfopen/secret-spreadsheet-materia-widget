import React from 'react'
import Cell from './creator-cell'

export default class Table extends React.Component {
	constructor(props) {
		super(props)
		this.appendRow = this.appendRow.bind(this)
		this.removeRow = this.removeRow.bind(this)
		this.appendColumn = this.appendColumn.bind(this)
		this.removeColumn = this.removeColumn.bind(this)
		this.renderTable = this.renderTable.bind(this)
		this.focusOnCell = this.focusOnCell.bind(this)
		this.submitTable = React.createRef()
		this.refsArray = []
	}

	// Add a row to the table, limited to 10 rows
	appendRow() {
		const xValue = Math.min(10, parseInt(this.props.qset.dimensions.x) + 1)
		this.setState(Object.assign(this.props.qset.dimensions,{x:xValue}));
		const cellsArray = []
		for (let i = 0; i < this.props.qset.dimensions.y; i++) {
			cellsArray.push(this.props.cellData('', false))
		}
		this.props.qset.items[0].items.push(cellsArray)
	}

	// Remove the last row of the table until only 1 row remains
	removeRow(row, col) {
		if (this.props.qset.dimensions.x > 1) {
			const xValue = parseInt(this.props.qset.dimensions.x) - 1
			this.setState(Object.assign(this.props.qset.dimensions,{x:xValue}));
			this.props.qset.items[0].items.pop()
			const arr = this.refsArray.slice(0)
			arr.splice(xValue, 1)
			this.refsArray = arr
			if (xValue == row) {
				this.focusOnCell(xValue - 1, col)
			}
		}
	}

	// Add a column to the table, limited to 10 rows
	appendColumn() {
		const yValue = Math.min(10, parseInt(this.props.qset.dimensions.y) + 1)
		this.setState(Object.assign(this.props.qset.dimensions,{y:yValue}));
		for (let i = 0; i < this.props.qset.dimensions.x; i++) {
			this.props.qset.items[0].items[i].push(this.props.cellData('', false))
		}
	}

	// Remove the last column of the table until only 1 column remains
	removeColumn(row, col) {
		if (this.props.qset.dimensions.y > 1) {
			const yValue = Math.max(1, parseInt(this.props.qset.dimensions.y) - 1)
			this.setState(Object.assign(this.props.qset.dimensions,{y:yValue}));
			const tempRefsArr = []
			for (let i = 0; i < this.props.qset.dimensions.x; i++) {
				this.props.qset.items[0].items[i].pop()
				tempRefsArr[i] = []
				for (let j = 0; j < yValue; j++) {
					tempRefsArr[i].push(this.refsArray[i][j])
				}
			}
			this.refsArray = tempRefsArr
			if (yValue == col) {
				this.focusOnCell(row, yValue - 1)
			}
		}
	}

	focusOnCell(row, col) {
		if (row >= 0 && row < this.props.qset.dimensions.x &&
				col >= 0 && col < this.props.qset.dimensions.y) {
			this.refsArray[row][col].focus()
		}
	}

	// Render a table for the creator, conditionally name the cells for css
	renderTable() {
		const table = []
		for (let i = 0; i < this.props.qset.dimensions.x; i++) {
			const row = []
			if (this.refsArray[i] === undefined) {
				this.refsArray[i] = []
			}
			for (let j = 0; j < this.props.qset.dimensions.y; j++) {
				// Make sure data exist, use shortened variable name for readability
				const cellData = (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j]) || (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j])
				row.push(
					<Cell
						className={`${this.props.qset.left ? '' : 'center-align'} ${i == 0 && this.props.qset.header ? 'header-cell' : ''}`}
						key={`${i} - ${j}`}
						data={cellData}
						row={i}
						column={j}
						appendColumn={this.appendColumn}
						removeColumn={this.removeColumn}
						appendRow={this.appendRow}
						removeRow={this.removeRow}
						focusOnCell={this.focusOnCell}
						refsArray={this.refsArray}
					/>
				)
			}
			table.push(<tr key={i}>{row}</tr>)
		}
		return table
	}

	render() {
		return (
			<div className="table" >
				<form onSubmit={this.props.onSubmit} >
					<div className="table-elements">
						<table onBlur={() => this.submitTable.current.click()}>
							<tbody>
								{this.renderTable()}
							</tbody>
						</table>

						<div className="column-buttons">
							<button onClick={this.appendColumn}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" width="28" height="28" viewBox="0 0 400 400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M213.333 160.000 C 213.333 177.778,222.222 186.667,240.000 186.667 C 254.667 186.667,266.667 192.667,266.667 200.000 C 266.667 207.333,254.667 213.333,240.000 213.333 C 222.222 213.333,213.333 222.222,213.333 240.000 C 213.333 254.667,207.333 266.667,200.000 266.667 C 192.667 266.667,186.667 254.667,186.667 240.000 C 186.667 222.222,177.778 213.333,160.000 213.333 C 145.333 213.333,133.333 207.333,133.333 200.000 C 133.333 192.667,145.333 186.667,160.000 186.667 C 177.778 186.667,186.667 177.778,186.667 160.000 C 186.667 145.333,192.667 133.333,200.000 133.333 C 207.333 133.333,213.333 145.333,213.333 160.000 "/></g></svg></button>
							<button onClick={this.removeColumn}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" width="28" height="28" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M280.000 200.000 C 280.000 207.407,244.444 213.333,200.000 213.333 C 155.556 213.333,120.000 207.407,120.000 200.000 C 120.000 192.593,155.556 186.667,200.000 186.667 C 244.444 186.667,280.000 192.593,280.000 200.000 "/></g></svg></button>
						</div>
					</div>

					<div className="row-buttons">
						<button onClick={this.appendRow}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" width="28" height="28" viewBox="0 0 400 400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M213.333 160.000 C 213.333 177.778,222.222 186.667,240.000 186.667 C 254.667 186.667,266.667 192.667,266.667 200.000 C 266.667 207.333,254.667 213.333,240.000 213.333 C 222.222 213.333,213.333 222.222,213.333 240.000 C 213.333 254.667,207.333 266.667,200.000 266.667 C 192.667 266.667,186.667 254.667,186.667 240.000 C 186.667 222.222,177.778 213.333,160.000 213.333 C 145.333 213.333,133.333 207.333,133.333 200.000 C 133.333 192.667,145.333 186.667,160.000 186.667 C 177.778 186.667,186.667 177.778,186.667 160.000 C 186.667 145.333,192.667 133.333,200.000 133.333 C 207.333 133.333,213.333 145.333,213.333 160.000 "/></g></svg></button>
						<button onClick={this.removeRow}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" width="28" height="28" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M280.000 200.000 C 280.000 207.407,244.444 213.333,200.000 213.333 C 155.556 213.333,120.000 207.407,120.000 200.000 C 120.000 192.593,155.556 186.667,200.000 186.667 C 244.444 186.667,280.000 192.593,280.000 200.000 "/></g></svg></button>
					</div>

					<input ref={this.submitTable} type="submit" hidden/>
				</form>
			</div>
		)
	}
}

import React from 'react'
import Cell from './creator-cell'

export default class Table extends React.Component {
	constructor(props) {
		super(props)
		this.renderTable = this.renderTable.bind(this)
	}

	// Render a table for the creator
	renderTable() {
		const table = []
		for (let i = 0; i < this.props.qset.dimensions.rows; i++) {
			const row = []
			if (this.props.refsArray[i] === undefined) {
				this.props.refsArray[i] = []
			}
			for (let j = 0; j < this.props.qset.dimensions.columns; j++) {
				// Make sure data exist, use shortened variable name for readability
				const cellData = (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j])
				row.push(
					<Cell
						// conditionally name the cells for css
						className={`${this.props.qset.left ? '' : 'center-align'} ${i == 0 && this.props.qset.header ? 'header-cell' : ''}`}
						key={`${i} - ${j}`}
						data={cellData}
						qset={this.props.qset}
						row={i}
						column={j}
						appendColumn={this.props.appendColumn}
						removeColumn={this.props.removeColumn}
						appendRow={this.props.appendRow}
						removeRow={this.props.removeRow}
						focusOnCell={this.props.focusOnCell}
						refsArray={this.props.refsArray}
						hideCellsRandomly={this.props.hideCellsRandomly}
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
				<div className="table-elements">
					<table>
						<tbody>
							{this.renderTable()}
						</tbody>
					</table>
					<button hidden></button>
					<div className="column-buttons">
						<button onClick={this.props.appendColumn}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" viewBox="0 0 400 400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M213.333 160.000 C 213.333 177.778,222.222 186.667,240.000 186.667 C 254.667 186.667,266.667 192.667,266.667 200.000 C 266.667 207.333,254.667 213.333,240.000 213.333 C 222.222 213.333,213.333 222.222,213.333 240.000 C 213.333 254.667,207.333 266.667,200.000 266.667 C 192.667 266.667,186.667 254.667,186.667 240.000 C 186.667 222.222,177.778 213.333,160.000 213.333 C 145.333 213.333,133.333 207.333,133.333 200.000 C 133.333 192.667,145.333 186.667,160.000 186.667 C 177.778 186.667,186.667 177.778,186.667 160.000 C 186.667 145.333,192.667 133.333,200.000 133.333 C 207.333 133.333,213.333 145.333,213.333 160.000 "/></g></svg>
							<div className={`${this.props.qset.dimensions.rows == 1 ? 'button-name-hidden' : ''}`}>Col</div>
						</button>
						<button onClick={this.props.removeColumn}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M280.000 200.000 C 280.000 207.407,244.444 213.333,200.000 213.333 C 155.556 213.333,120.000 207.407,120.000 200.000 C 120.000 192.593,155.556 186.667,200.000 186.667 C 244.444 186.667,280.000 192.593,280.000 200.000 "/></g></svg>
							<div className={`${this.props.qset.dimensions.columns == 1 ? 'button-name-hidden' : ''}`}>Col</div>
						</button>
					</div>
				</div>
				<div className="row-buttons">
					<button onClick={this.props.appendRow}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" viewBox="0 0 400 400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M213.333 160.000 C 213.333 177.778,222.222 186.667,240.000 186.667 C 254.667 186.667,266.667 192.667,266.667 200.000 C 266.667 207.333,254.667 213.333,240.000 213.333 C 222.222 213.333,213.333 222.222,213.333 240.000 C 213.333 254.667,207.333 266.667,200.000 266.667 C 192.667 266.667,186.667 254.667,186.667 240.000 C 186.667 222.222,177.778 213.333,160.000 213.333 C 145.333 213.333,133.333 207.333,133.333 200.000 C 133.333 192.667,145.333 186.667,160.000 186.667 C 177.778 186.667,186.667 177.778,186.667 160.000 C 186.667 145.333,192.667 133.333,200.000 133.333 C 207.333 133.333,213.333 145.333,213.333 160.000 "/></g></svg>
						<div>Row</div>
					</button>
					<button onClick={this.props.removeRow}><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M85.333 85.333 C 19.189 151.478,19.189 248.522,85.333 314.667 C 190.592 419.925,360.000 349.202,360.000 200.000 C 360.000 50.798,190.592 -19.925,85.333 85.333 M280.000 200.000 C 280.000 207.407,244.444 213.333,200.000 213.333 C 155.556 213.333,120.000 207.407,120.000 200.000 C 120.000 192.593,155.556 186.667,200.000 186.667 C 244.444 186.667,280.000 192.593,280.000 200.000 "/></g></svg>
						<div>Row</div>
					</button>
				</div>
				<input type="submit" hidden/>
			</div>
		)
	}
}

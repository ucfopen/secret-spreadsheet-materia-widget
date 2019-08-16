import React from 'react'
import ReactDOM from 'react-dom'
import EditCell from './creator-edit-cell'

class EditTable extends React.Component {
	constructor(props) {
		super(props)
		this.increaseRow = this.increaseRow.bind(this)
		this.increaseColumn = this.increaseColumn.bind(this)
		this.renderTable = this.renderTable.bind(this)
	}

	increaseRow(event) {
		const xValue = Math.min(10, parseInt(this.props.qset.dimensions.x) + 1)
		this.setState(Object.assign(this.props.qset.dimensions,{x:xValue}));
		event.preventDefault()
	}

	increaseColumn(event) {
		const yValue = Math.min(10, parseInt(this.props.qset.dimensions.y) + 1)
		this.setState(Object.assign(this.props.qset.dimensions,{y:yValue}));
		event.preventDefault()
	}

	// Render an editable table for the creator
	renderTable() {
		const table = []
		for (let i = 0; i < this.props.qset.dimensions.x; i++) {
			const row = []
			for (let j = 0; j < this.props.qset.dimensions.y; j++) {
				// Make sure data exist, use shortened variable name for readability
				const cellData = (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j]) || (this.props.qset && this.props.qset.items[0].items[i] && this.props.qset.items[0].items[i][j])
				row.push(<EditCell key={`${i} - ${j}`} data={cellData}/>)
			}
			table.push(<tr key={i}>{row}</tr>)
		}
		return table
	}

	render() {
	return (
			<div className="table">
				<form onSubmit={this.props.onSubmit}>
					<div className="table-elements">
						<table>
							<tbody>
								{this.renderTable()}
							</tbody>
						</table>
						<button className="increase-column-button" onClick={this.increaseColumn}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>Column</button>
					</div>
					<button className="increase-row-button" onClick={this.increaseRow} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
						<span>Row</span></button>
					<div>
						<input className="table-submit-button" type="submit" value="Preview"/>
					</div>
				</form>
			</div>
		)
	}
}

export default EditTable

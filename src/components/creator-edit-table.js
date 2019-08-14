import React from 'react'
import ReactDOM from 'react-dom'
import EditCell from './creator-edit-cell'

class EditTable extends React.Component {
	constructor(props) {
		super(props)
		this.handleRandomizationBlur = this.handleRandomizationBlur.bind(this)
	}

	// Make sure the value for number of randomization is within bounds
	handleRandomizationBlur(event) {
		if (event.target.value <= 0) {
			this.props.qset.randomization = event.target.value = 0
		} else if (event.target.value > (this.props.qset.dimensions.x * this.props.qset.dimensions.y)) {
			this.props.qset.randomization = event.target.value = this.props.qset.dimensions.x * this.props.qset.dimensions.y
		} else {
			this.props.qset.randomization = event.target.value
		}
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
			<div className="table-container">
				<label>
					Check the boxes to hide from players or randomly hide
					<input type="number" placeholder={0} defaultValue={this.props.qset.randomization} min="1" max={this.props.qset.dimensions.x * this.props.qset.dimensions.y} onBlur={this.handleRandomizationBlur}/>
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

export default EditTable

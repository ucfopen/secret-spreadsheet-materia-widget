import React from 'react'
import PreviewCell from './creator-preview-cell'

class PreviewTable extends React.Component {
	// Render a preview of the table for the creator
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
				<input className="table-button" type="submit" value="Edit" onClick={this.props.handleTableEditability}/>
			</div>
		)
	}
}

export default PreviewTable

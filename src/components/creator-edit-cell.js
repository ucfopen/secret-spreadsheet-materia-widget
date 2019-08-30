import React from 'react'

class EditCell extends React.Component {
	render() {
		return (
			<td>
				<input type="checkbox" defaultChecked={this.props.data && this.props.data.options.blank}/>
				<input type="text" placeholder="" defaultValue={this.props.data && this.props.data.questions[0].text}/>
			</td>
		)
	}
}

export default EditCell

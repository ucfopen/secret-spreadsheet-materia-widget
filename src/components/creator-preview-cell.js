import React from 'react'

class PreviewCell extends React.Component {
	render() {
		return (
			<td className={this.props.lit}>
				{this.props.data && this.props.data.questions[0].text}
			</td>
		)
	}
}

export default PreviewCell

import React from 'react'

class Cell extends React.Component {
	constructor(props) {
		super(props)

		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
		this.handleTextboxChange = this.handleTextboxChange.bind(this)
	}

	handleCheckboxChange(event) {
		this.setState(Object.assign(this.props.data.options, {blank: !this.props.data.options.blank}))
	}

	handleTextboxChange(event) {
		this.setState(Object.assign(this.props.data.questions[0], {text: event.target.value}))
	}

	render() {
		return (
			<td className={`${this.props.className} ${this.props.data && this.props.data.options.blank ? "hidden" : ""}`}>
				<div>
					<input type="text" value={this.props.data && this.props.data.questions[0].text} onChange={this.handleTextboxChange} placeholder={`${String.fromCharCode(this.props.row + 65)}${this.props.column + 1}`}/>
					<input type="checkbox" checked={this.props.data && this.props.data.options.blank} onChange={this.handleCheckboxChange}/>
				</div>
			</td>
		)
	}
}

export default Cell

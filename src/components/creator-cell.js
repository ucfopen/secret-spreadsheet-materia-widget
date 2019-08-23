import React from 'react'

export default class Cell extends React.Component {
	constructor(props) {
		super(props)
		this.handleCheckboxToggle = this.handleCheckboxToggle.bind(this)
		this.handleTextboxChange = this.handleTextboxChange.bind(this)
	}

	handleCheckboxToggle(event) {
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
					<div className="checkbox" onClick={this.handleCheckboxToggle}><input type="checkbox" onKeyDown={(e) => {if (e.key === 'Enter') {this.handleCheckboxToggle()}}} checked={this.props.data && this.props.data.options.blank}/>Hide</div>
				</div>
			</td>
		)
	}
}

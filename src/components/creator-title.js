import React from 'react'
import ReactDOM from 'react-dom'

class Title extends React.Component {
	render() {
		return (
			<input required="required" className="title-input" type="text" placeholder="My Spreadsheet Widget" value={this.props.title} onChange={this.props.onChange}/>
		)
	}
}

export default Title

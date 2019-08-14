import React from 'react';
import ReactDOM from 'react-dom';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	render() {
		// test if it should display an input box or if it should show some text
		return(
			<td id={this.props.id}>
				{ this.props.showInput ?
					<input
						type="text"
						id={this.props.inputID}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.props.saveAnswer}
					/>
					: this.props.displayText
				}
			</td>
		);
	}
}

export default Cell

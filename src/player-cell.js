import React from 'react';
import ReactDOM from 'react-dom';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.userInputOrText = this.userInputOrText.bind(this);
	}

	// test if it should display an input box or if it should show some text
	userInputOrText() {
		if (this.props.showInput) {
			return (
				<input
					type="text"
					id={this.props.inputID}
					value={this.state.value}
					onChange={this.handleChange}
					onBlur={this.props.saveAnswer}
				/>
			);
		}
		else {
			return this.props.displayText;
		}
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	render() {
		return(
			<td id={this.props.id}>
				{this.userInputOrText()}
			</td>
		);
	}
}

export default Cell

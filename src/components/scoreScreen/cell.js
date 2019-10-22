import React from 'react';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({
			checked: event.target.checked
		});
	}

	render() {
		if (this.props.answerable) {
			return(
				<td>
					<span>{this.props.answer} </span>

					{this.state.checked ? <span>{this.props.displayText} </span>:null}

					<label>
						{this.state.checked ? `Hide`:`Show`}

						<input
							type="checkbox"
							checked={this.state.checked}
							onChange={this.handleChange}
						/>
					</label>
				</td>
			);
		}
		else {
			return(
				<td>{this.props.displayText}</td>
			);
		}
	}
}

export default Cell;

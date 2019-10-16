import React from 'react';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			colorClass: 'unanswered',
			firstFocus: true
		}
		this.handleChange = this.handleChange.bind(this);
		this.input = React.createRef();
	}

	// controlled component function
	handleChange(event) {
		this.setState({
			value: event.target.value,
			colorClass: this.state.colorClass,
			firstFocus: this.state.firstFocus
		});
	}

	// this can be improved
	componentDidUpdate() {
		if (this.state.value !== '' && this.state.colorClass === 'unanswered') {
			this.setState({
				value: this.state.value,
				colorClass: 'answered',
				firstFocus: this.state.firstFocus
			});
		}
		else if (this.state.value === '' && this.state.colorClass === 'answered') {
			this.setState({
				value: this.state.value,
				colorClass: 'unanswered',
				firstFocus: this.state.firstFocus
			});
		}

		// will only focus on the first render after the popup is closed; and will only work on the first input
		if (this.props.firstInput && this.state.firstFocus && this.input.current !== null && this.props.focus) {
			this.input.current.focus();

			if (this.props.exitQuestion) {
				this.setState({
					value: this.state.value,
					colorClass: this.state.colorClass,
					firstFocus: false
				});
			}
		}
	}

	render() {
		// test if it should display an input box or if it should show the text
		return(
			<td id={this.props.id} className={`${this.props.showInput ? `${this.state.colorClass} `:''}${this.props.leftAlign ? 'leftAlign':'centerAlign'}`} >
				{ this.props.showInput ?
					<input
						type="text"
						id={this.props.inputID}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.props.saveAnswer}
						className={this.state.colorClass}
						ref={this.input}
						placeholder="?"
					/>
					: <span>{this.props.displayText}</span>
				}
			</td>
		);
	}
}

export default Cell

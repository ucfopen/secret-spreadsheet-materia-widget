import React from 'react';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ``,
			colorClass: `unanswered`,
			firstFocus: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.input = React.createRef();
	}

	// controlled component function
	// limit to 36 characters
	handleChange(event) {
		let value = event.target.value;

		if (value.length > 36) {
			value = value.slice(0, 36);
		}

		// trigger the behavior to save the answer if we went from empty to non-empty or vice versa
		if (!this.state.value.length || !value.length) this.props.saveAnswer(event);

		this.setState({
			value: value,
			colorClass: this.state.colorClass,
			firstFocus: this.state.firstFocus
		});
	}

	componentDidUpdate() {
		if (this.state.value !== `` && this.state.colorClass === `unanswered`) {
			this.setState({
				value: this.state.value,
				colorClass: `answered`,
				firstFocus: this.state.firstFocus
			});
		}
		else if (this.state.value === `` && this.state.colorClass === `answered`) {
			this.setState({
				value: this.state.value,
				colorClass: `unanswered`,
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
		// const cellClass = `${this.props.showInput ? `${this.state.colorClass} `:``}${this.props.leftAlign ? `leftAlign`:`centerAlign`}`
		const cellClass = (this.props.showInput ? this.state.colorClass + ' ' : '') +
			(this.props.leftAlign ? 'leftAlign' : 'centerAlign')
		// test if it should display an input box or if it should show the text
		return(
			<td id={this.props.id}
				className={cellClass} >
				{ this.props.showInput ?
					<input
						type="text"
						aria-label={this.state.value != '' ? 'Current cell value: ' + this.state.value : 'This cell is currently blank, please provide a value.'}
						id={this.props.inputID}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.props.saveAnswer}
						className={this.state.colorClass}
						ref={this.input}
						autoComplete='off'
						placeholder="?"
					/>
					: <span>{this.props.displayText}</span>
				}
			</td>
		);
	}
}

export default Cell;

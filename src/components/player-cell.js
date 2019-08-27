import React from 'react';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			colorClass: 'unanswered'
		}
		this.handleChange = this.handleChange.bind(this);
		this.cell = React.createRef();
		this.input = React.createRef();
	}

	handleChange(event) {
		this.setState({
			value: event.target.value,
			colorClass: this.state.colorClass
		});
	}

	componentDidUpdate() {
		const cellComponent = this.cell.current;
		const inputComponent = this.input.current;

		if (this.state.value !== '' && this.state.colorClass === 'unanswered') {
			this.setState({
				value: this.state.value,
				colorClass: 'answered'
			});
		}
		else if (this.state.value === '' && this.state.colorClass === 'answered') {
			this.setState({
				value: this.state.value,
				colorClass: 'unanswered'
			});
		}
	}

	render() {
		// test if it should display an input box or if it should show some text
		return(
			<td id={this.props.id} className={`${this.props.showInput ? `${this.state.colorClass} `:''}${this.props.leftAlign ? 'leftAlign':'centerAlign'}`} ref={this.cell}>
				{ this.props.showInput ?
					<input
						type="text"
						id={this.props.inputID}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.props.saveAnswer}
						className={this.state.colorClass}
						ref={this.input}
					/>
					: this.props.displayText
				}
			</td>
		);
	}
}

export default Cell

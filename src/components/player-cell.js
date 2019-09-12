import React from 'react';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			firstFocus: true
		}
		this.handleChange = this.handleChange.bind(this);
		this.cell = React.createRef();
		this.input = React.createRef();
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	componentDidUpdate() {
		const cellComponent = this.cell.current;
		const inputComponent = this.input.current;

		if (this.props.showInput) {
			if (this.state.value !== '') {
				cellComponent.classList.remove('unanswered');
				cellComponent.classList.add('answered');

				inputComponent.classList.remove('unanswered');
				inputComponent.classList.add('answered');
			}
			else {
				cellComponent.classList.remove('answered');
				cellComponent.classList.add('unanswered');

				inputComponent.classList.remove('answered');
				inputComponent.classList.add('unanswered');
			}
		}

		if (this.props.firstInput && this.props.focus && this.state.firstFocus && inputComponent !== null) {
			inputComponent.focus();

			this.setState({
				firstFocus: false
			});
		}
	}

	render() {
		// test if it should display an input box or if it should show some text
		return(
			<td id={this.props.id} className={`${this.props.showInput ? 'unanswered ':''}${this.props.leftAlign ? 'leftAlign':'centerAlign'}`} ref={this.cell}>
				{ this.props.showInput ?
					<input
						type="text"
						id={this.props.inputID}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.props.saveAnswer}
						className="unanswered"
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

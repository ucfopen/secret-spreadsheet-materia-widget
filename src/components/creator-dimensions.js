import React from 'react'

class Dimensions extends React.Component {
	render() {
		return (
			this.props.isEditable ?
				<div className="dimensions-input">
					<input required="required" type="number" min="1" max="10" placeholder="X" value={this.props.qset.dimensions.x} onChange={this.props.onXChange}/>
					{"  Row(s)  x  "}
					<input required="required" type="number" min="1" max="10" placeholder="Y" value={this.props.qset.dimensions.y} onChange={this.props.onYChange}/>
					{"  Column(s)"}
				</div>
			: ""
		)
	}
}

export default Dimensions

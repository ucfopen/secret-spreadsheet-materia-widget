import React from 'react'

export default class Options extends React.Component {
	constructor(props) {
		super(props)
		this.handleRandomizationChange = this.handleRandomizationChange.bind(this)
	}

	// Make sure the value for number of randomization is within bounds
	handleRandomizationChange(event) {
		event.target.value = parseInt(event.target.value)
		// Lower limit is 0 (no randomization)
		if (event.target.value <= 0) {
			this.setState(Object.assign(this.props.qset,{randomization:0}))
		}
		// Upper limit changes depending on whether header row is enabled
		else if (event.target.value > ((!this.props.qset.header ? this.props.qset.dimensions.rows : (this.props.qset.dimensions.rows - 1) ) * this.props.qset.dimensions.columns)) {
			this.setState(Object.assign(this.props.qset,{randomization:((!this.props.qset.header ? this.props.qset.dimensions.rows : (this.props.qset.dimensions.rows - 1) ) * this.props.qset.dimensions.columns)}))
		}
		else {
			this.setState(Object.assign(this.props.qset,{randomization:event.target.value}))
		}
	}

	handleCheckBox(event) {
		event.target.checked = !event.target.checked
	}

	render() {
		return (
			<div className="options-bar">
				<div className="upper-options-bar">

					<h2 className="options">OPTIONS</h2>

					<div className="style">
						<h3>Style:</h3>
						<div
							id="spreadsheet"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useSpreadsheet()}}}
							onClick={this.props.useSpreadsheet}
							className={`${this.props.qset.spreadsheet ? "active " : ""}hoverable`}>
								{!this.props.qset.spreadsheet ?
									<svg viewBox="0 0 28 28" width="20px" height="20px" color="lightblue"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path> </svg>
								:
									<svg viewBox="0 0 28 28" width="20px" height="20px"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path> </svg>
								}
								<label htmlFor="spreadsheet">Spreadsheet</label>
						</div>
						<div
							id="table"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useTable()}}}
							onClick={this.props.useTable}
							className={`${!this.props.qset.spreadsheet ? "active" : "inactive"} hoverable`}
						>
							{this.props.qset.spreadsheet ?
								<svg viewBox="0 0 28 28" width="20px" height="20px"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path> </svg>
							:
								<svg viewBox="0 0 28 28" width="20px" height="20px"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path> </svg>
							}
							<label htmlFor="table">Table</label>
						</div>
					</div>

					<div className="text">
						<h3>Text:</h3>
						<div
							id="left"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useLeftAlign()}}}
							onClick={this.props.useLeftAlign}
							className={`${this.props.qset.left ? "active" : ""} hoverable`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 344 344" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0,344) scale(0.1,-0.1)" fill="#000000" stroke="none"> <path d="M130 3095 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/> <path d="M130 2410 l0 -140 1105 0 1105 0 0 140 0 140 -1105 0 -1105 0 0 -140z"/> <path d="M130 1720 l0 -140 1590 0 1590 0 0 140 0 140 -1590 0 -1590 0 0 -140z"/> <path d="M130 1030 l0 -140 1105 0 1105 0 0 140 0 140 -1105 0 -1105 0 0 -140z"/> <path d="M130 345 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/> </g> </svg>
						</div>
						<div
							id="center"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useCenterAlign()}}}
							onClick={this.props.useCenterAlign}
							className={`${!this.props.qset.left ? "active" : ""} hoverable`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 344 344" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0,344) scale(0.1,-0.1)" fill="#000000" stroke="none"> <path d="M130 3095 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/> <path d="M610 2410 l0 -140 1110 0 1110 0 0 140 0 140 -1110 0 -1110 0 0 -140z"/> <path d="M130 1720 l0 -140 1590 0 1590 0 0 140 0 140 -1590 0 -1590 0 0 -140z"/> <path d="M610 1030 l0 -140 1110 0 1110 0 0 140 0 140 -1110 0 -1110 0 0 -140z"/> <path d="M130 345 l0 -145 1590 0 1590 0 0 145 0 145 -1590 0 -1590 0 0 -145z"/> </g> </svg>
						</div>
					</div>

					<div className="header">
						<h3>Header:</h3>
						<div
							id="header"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useHeader()}}}
							onClick={this.props.useHeader}
							className={`${this.props.qset.header ? "active" : ""} hoverable`}
						>
							{!this.props.qset.header ?
								<svg viewBox="0 0 28 28" width="20px" height="20px" color="lightblue"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path> </svg>
							:
								<svg viewBox="0 0 28 28" width="20px" height="20px"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path> </svg>
							}
							<label htmlFor="header">First row is a header row</label>
						</div>
					</div>

					<div className="question">
						<h3>Question Text:</h3>
						<div
							id="question"
							tabIndex={0}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.useQuestion()}}}
							onClick={this.props.useQuestion}
							className={`${this.props.showQuestion ? "active" : ""} hoverable`}
						>
							{!this.props.showQuestion ?
								<svg viewBox="0 0 28 28" width="20px" height="20px" color="lightblue"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path> </svg>
							:
								<svg viewBox="0 0 28 28" width="20px" height="20px"> <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path> </svg>
							}
						</div>
					</div>

				</div>

				<div className="lower-options-bar">
					<div className="instructions">
						<h3>Instructions:</h3>
						<div
							id="instructions"
							tabIndex={0}
							className={`${this.props.showInstruction ? "active" : ""} hoverable`}
							onClick={this.props.toggleInstruction}
							onKeyDown={(e) => {if (e.key === 'Enter') {this.props.toggleInstruction()}}}
							ref={this.props.instructionRef}
						>
							<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="34" height="34" viewBox="0 0 344.000000 344.000000">
								<g transform="translate(0.000000,344.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
									<path d="M850 3093 c-218 -22 -529 -110 -567 -160 -9 -11 -13 -55 -13 -129 l0 -111 -64 -5 c-78 -7 -135 -37 -173 -91 l-28 -40 -3 -964 c-2 -933 -2 -964 17 -1001 24 -47 56 -77 103 -97 33 -13 128 -15 732 -15 l695 0 47 -32 c42 -30 52 -33 124 -33 72 0 82 3 124 33 l47 32 695 0 c604 0 699 2 732 15 47 20 79 50 103 97 19 37 19 68 17 1001 l-3 964 -28 40 c-38 54 -95 84 -173 91 l-64 5 0 113 c0 136 -1 137 -117 182 -374 142 -874 147 -1255 13 l-78 -28 -78 28 c-102 36 -282 75 -404 88 -90 10 -308 12 -388 4z m425 -158 c115 -17 247 -49 323 -77 l52 -19 0 -985 c0 -541 -2 -984 -5 -984 -3 0 -44 11 -92 26 -167 48 -302 66 -503 67 -106 1 -225 -4 -279 -12 -84 -12 -288 -58 -334 -76 -16 -7 -17 42 -15 980 l3 988 55 19 c87 30 198 57 295 72 122 19 376 19 500 1z m1465 -13 c52 -11 136 -33 185 -49 l90 -29 3 -988 c2 -939 1 -988 -15 -981 -49 18 -249 65 -333 76 -54 8 -175 13 -280 12 -201 -1 -336 -19 -503 -67 -48 -15 -89 -26 -92 -26 -3 0 -5 443 -5 984 l0 984 38 15 c64 26 222 65 322 81 136 22 460 15 590 -12z m-2470 -1285 c0 -981 -3 -937 54 -951 16 -4 51 4 98 23 367 144 828 146 1203 6 l95 -36 95 36 c384 143 845 138 1223 -14 32 -13 63 -19 78 -15 57 14 54 -30 54 951 l0 903 44 0 c36 0 48 -5 65 -26 21 -27 21 -31 21 -934 0 -879 -1 -909 -19 -931 l-19 -24 -1542 0 -1542 0 -19 24 c-18 22 -19 52 -19 931 0 903 0 907 21 934 17 21 29 26 65 26 l44 0 0 -903z"/>
									<path d="M2341 2603 c-47 -23 -71 -67 -71 -131 0 -45 4 -57 33 -88 91 -99 247 -36 247 99 0 67 -74 137 -145 137 -16 0 -45 -8 -64 -17z"/>
									<path d="M2156 2119 c-19 -15 -26 -30 -26 -54 0 -50 31 -75 92 -75 l48 0 0 -345 0 -345 140 0 140 0 0 399 0 400 -26 20 c-24 19 -40 21 -184 21 -144 0 -160 -2 -184 -21z"/>
								</g>
							</svg>
						</div>
					</div>

					<div className="randomize">
						<div className={`${this.props.hideCellsRandomly ? 'active' : ''}`}>
							<label>
								Manually hide cells with checkboxes
							</label>
						</div>

						<label className="switch" htmlFor="hide-method-toggle" >
							<input
								tabIndex={0}
								type="checkbox"
								checked={!this.props.hideCellsRandomly}
								id="hide-method-toggle"
								onClick={this.props.toggleHideCellMethod}
								onKeyPress={(e) => {if (e.key == 'Enter') {this.props.toggleHideCellMethod()}}}
								onChange={this.handleCheckBox}
							></input>
							<span className="slider"></span>
						</label>

						<div className={`${this.props.hideCellsRandomly ? '' : 'active'}`}>
							<label>
								Randomly hide <input readOnly={this.props.hideCellsRandomly} type="number" placeholder={0} value={this.props.qset.randomization} onChange={this.handleRandomizationChange}/> cells.
							</label>
						</div>
					</div>

					<div className="empty-element"></div>
				</div>
			</div>
		)
	}
}

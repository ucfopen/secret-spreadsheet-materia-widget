import React from 'react'

const Instruction = props => {
	return(
		<div className={`table-text ${props.showInstruction ? "" : "instruction-hidden"}`}>
			<span
				tabIndex={0}
				className="close"
				onClick={props.toggleInstruction}
				onKeyPress={(e) => {if (e.key === 'Enter') {props.toggleInstruction()}}}
				>&times;
			</span>
			<h2>WHAT TO DO</h2>
			<ul className="what-to-do">
				<li>Add rows and columns, then input data in the cells below.</li>
				<li className={`${props.hideCellsRandomly ? '' : 'list-item-hidden'}`}>Check cells to turn them <span className="blue-text">blue</span> - these will be left blank for students to fill out.</li>
				<li className={`${props.hideCellsRandomly ? 'list-item-hidden' : ''}`}>The widget will automatically hide the given number of cells</li>
				<li onClick={props.toggleKeyboardInst} className="keyboard-controls-div"><span tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') { props.toggleKeyboardInst() } }} className="keyboard-controls-spam">Keyboard controls</span>
					{props.showKeyControls ?
						(<ul>
							<li>Alt + PageUp = Add Column</li>
							<li>Alt + PageDown = Remove Column</li>
							<li>Shift + PageUp = Add Row</li>
							<li>Shift + PageDown = Remove Row</li>
							<li>Ctrl/Command + Arrow = Move Cell</li>
						</ul>) :
						''
					}
				</li>
			</ul>
		</div>
	)
}

export default Instruction

import React, { useEffect, useRef } from 'react';

const ariaWarningText = 'After closing this dialog focus will be automatically moved to the first empty cell in the spreadsheet.'

// the popup containing the question and description given by the widget creator
// at a minimum shows the question, description is optional
const Question = props => {
	const questionEl = useRef(null)

	// bit of a hack to make sure the question is given focus when it comes up
	useEffect(() => {
		if (questionEl.current) questionEl.current.focus()
	}, [])

	return (
		<div className="popup question">
			<div>
				<p className="mainQuestion"
					tabIndex="0"
					aria-label={`Question: ${props.question}: ${props.description}`}
					ref={questionEl}>
					{props.question}
				</p>

				{
					props.description !== ``
					?
						<p>{props.description}</p>
					:
						null
				}

				<button type="button"
					value="Next"
					onClick={props.handleQuestionToggle}
					tabIndex="0"
					aria-label={ariaWarningText}>
					Next
				</button>
			</div>
		</div>
	);
};

export default Question;

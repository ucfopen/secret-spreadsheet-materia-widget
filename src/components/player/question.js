import React from 'react';

// the popup containing the question and description given by the widget creator
// at a minimum shows the question, description is optional
const Question = props => {
	return (
		<div className="popup question">
			<div>
				<p className="mainQuestion">{props.question}</p>

				{props.description !== '' ? <p>{props.description}</p>:null}

				<button type="button" value="Next" onClick={props.handleQuestionToggle}>
						Next
				</button>
			</div>
		</div>
	);
};

export default Question;

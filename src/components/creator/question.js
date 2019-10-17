import React from 'react';

const Question = props => {
	return(
		<div className={`${props.showQuestion ? `` : `question-hidden`}`}>
			<div>
				<textarea rows={props.questionRows} className="question-header" type="text" placeholder="Question Header" value={props.qset.question} onChange={props.handleQuestionChange}/>
			</div>
			<div>
				<textarea rows={props.descriptionRows} className="question-text" type="text" placeholder="Question Text" value={props.qset.description} onChange={props.handleDescriptionChange}/>
			</div>
		</div>
	);
};

export default Question;

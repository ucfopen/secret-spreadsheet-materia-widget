import React from 'react'

const Question = props => {
	return(
		<div className={`${props.showQuestion ? '' : 'question-hidden'}`}>
			<div>
				<textarea rows={props.questionRows} className="question-text" type="text" placeholder="Question Text" value={props.qset.question} onChange={props.handleQuestionChange}/>
			</div>
			<div>
				<textarea rows={props.descriptionRows} className="description-text" type="text" placeholder="Description Text" value={props.qset.description} onChange={props.handleDescriptionChange}/>
			</div>
		</div>
	)
}

export default Question

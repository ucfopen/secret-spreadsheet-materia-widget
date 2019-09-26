import React from 'react'

const ResizableTextarea = props => {
  return(
    <div className={`${props.showQuestion ? '' : 'question-hidden'}`}>
      <textarea rows={props.rows} className="question-text" type="text" placeholder="Question Text" value={props.qset.question} onChange={props.handleQuestionChange}/>
    </div>
  )
}

export default ResizableTextarea

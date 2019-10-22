import React from 'react';

const Question = props => {
	return (
		<header>
				<h3>Question</h3>
				<p>{props.question}</p>
				{props.description !== `` ? <p>{props.description}</p>:null}
		</header>
	);
};

export default Question;

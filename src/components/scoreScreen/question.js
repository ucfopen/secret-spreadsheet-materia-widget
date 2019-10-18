import React from 'react';

const Question = props => {
	return (
		<div>
			<div>
				<p>{props.question}</p>
				{props.description !== `` ? <p>{props.description}</p>:null}
			</div>
		</div>
	);
};

export default Question;

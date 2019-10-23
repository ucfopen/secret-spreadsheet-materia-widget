import React from 'react';

const Question = props => {
	return (
		<header>
				<h3>{props.question}</h3>
				{props.description !== `` ? <p>{props.description}</p>:null}
		</header>
	);
};

export default Question;

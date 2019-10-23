import React from 'react';
import Question from './question';
import renderer from 'react-test-renderer';

describe('Question', () => {
	test('Rendered with question description', () => {
		const props = {
			question: 'Test Question',
			description: 'Test description'
		}

		const component = renderer.create(<Question {... props} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Rendered without question description', () => {
		const props = {
			question: 'Test Question',
			description: ''
		}

		const component = renderer.create(<Question {... props} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

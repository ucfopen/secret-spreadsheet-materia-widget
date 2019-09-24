import React from 'react'
import Question from './player-question'
import renderer from 'react-test-renderer';

describe('Question component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Is rendered with question body', () => {
		const props = {
			handleQuestionToggle: jest.fn(),
			entryQuestion: 'Test entry question',
			questionBody: 'Test question body'
		}

		const component = renderer.create(<Question {... props} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Is rendered without question body', () => {
		const props = {
			handleQuestionToggle: jest.fn(),
			entryQuestion: 'Test entry question',
			questionBody: ''
		}

		const component = renderer.create(<Question {... props} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

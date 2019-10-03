import React from 'react';
import Question from './creator-question';
import renderer from 'react-test-renderer';

describe('CreatorQuestion component', function() {

	beforeEach(() => {
		jest.resetModules()
	})

  test('CreatorQuestion renders question and description textareas with showQuestion = true', () => {
		const props = {
			qset: {
				question: 'What is love?',
				description: '',
			},
			showQuestion: true,
			questionRows: 1,
			descriptionRows: 1,
			handleQuestionChange: jest.fn(),
			handleDescriptionChange: jest.fn(),
		}

		const component = renderer.create(<Question {... props}/>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	})

	test('CreatorQuestion renders question and description textareas with showQuestion = false', () => {
		const props = {
			qset: {
				question: 'What is love?',
				description: '',
			},
			showQuestion: false,
			questionRows: 1,
			descriptionRows: 1,
			handleQuestionChange: jest.fn(),
			handleDescriptionChange: jest.fn(),
		}

		const component = renderer.create(<Question {... props}/>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

  })

})

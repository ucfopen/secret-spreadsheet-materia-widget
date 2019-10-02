import React from 'react';
import Question from './creator-question';
import renderer from 'react-test-renderer';

describe('CreatorQuestion component', function() {

	beforeEach(() => {
		jest.resetModules()
	})

  test('CreatorQuestion renders question and description textareas', () => {
		const props = {
			qset: {
				question: 'What is love?',
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

})

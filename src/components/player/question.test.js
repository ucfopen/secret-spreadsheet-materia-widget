jest.mock('react', () => {
	const ActualReact = jest.requireActual('react')
	return {
		...ActualReact,
		useRef: jest.fn()
	}
})

import React from 'react';
import Question from './question';
import { create, act } from 'react-test-renderer';

describe(`Question component`, () => {
	beforeEach(() => {
		jest.resetModules();
		React.useRef.mockClear();
	});

	test(`Is rendered with question body`, () => {
		const mockFocus = jest.fn();
		React.useRef.mockReturnValue({
			current: {
				focus: mockFocus
			}
		});

		const props = {
			handleQuestionToggle: jest.fn(),
			question: `Test entry question`,
			description: `Test question body`
		};

		let component
		act(() => {
			component = create(<Question {... props} />, {
				createNodeMock: () => ({
					focus: mockFocus
				})
			});
		})
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();

		// bonus test - make sure the ref works and auto-focuses
		expect(mockFocus).toHaveBeenCalled();
	});

	test(`Is rendered without question body`, () => {
		const mockFocus = jest.fn();
		React.useRef.mockReturnValue({
			current: {
				focus: mockFocus
			}
		});

		const props = {
			handleQuestionToggle: jest.fn(),
			question: `Test entry question`,
			description: ``
		};

		// not sure if this is even possible, but...
		// update the ref to null to make sure nothing calls 'focus'?
		let component
		act(() => {
			component = create(<Question {... props} />, {
				createNodeMock: () => null
			});
		})
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();

		expect(mockFocus).not.toHaveBeenCalled();
	});
});

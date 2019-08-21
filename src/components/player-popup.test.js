import React from 'react'
import Popup from './player-popup.js'
import renderer from 'react-test-renderer';

describe('Popup component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Popup component is rendered', () => {
		const mockToggle = () => {
			return;
		}

		const props = {
			handlePopupToggle: mockToggle
		}

		const component = renderer.create(<Popup {... props} />);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

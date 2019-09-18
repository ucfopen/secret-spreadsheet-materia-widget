import React from 'react'
import Popup from './player-popup'
import renderer from 'react-test-renderer';

describe('Popup component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Is rendered', () => {
		const props = {
			handlePopupToggle: jest.fn()
		}

		const component = renderer.create(<Popup {... props} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

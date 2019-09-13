import React from 'react'
import Popup from './creator-popup'
import renderer from 'react-test-renderer'

describe('CreatorPopup component', function() {

  beforeEach(() => {
		jest.resetModules()
  })

  test('CreatorPopup renders popup with intro', () => {
		const props = {
      title: 'mock-title',
      showIntro: true,
      onSubmit: jest.fn(),
      onChange: jest.fn(),
    }

		const component = renderer.create(<Popup {... props}/>);
		let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  })

  test('CreatorPopup renders popup', () => {
		const props = {
      title: 'tock-mitle',
      showIntro: false,
      onSubmit: jest.fn(),
      onChange: jest.fn(),
    }

		const component = renderer.create(<Popup {... props}/>);
		let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  })

})

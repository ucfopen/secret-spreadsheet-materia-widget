import React from 'react';
import Title from './creator-title';
import renderer from 'react-test-renderer';

describe('CreatorTitle component', function() {

  beforeEach(() => {
		jest.resetModules()
  })

  test('CreatorTitle renders title', () => {
		const props = {
      title: 'mock-title',
      showIntro: jest.fn(),
      editTitle: jest.fn(),
      onChange: jest.fn(),
      onBlur: jest.fn(),
    }

		const component = renderer.create(<Title {... props}/>);
		let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  })

})

import React from 'react'
import Title from './title'
import renderer from 'react-test-renderer'
import { shallow } from '../../enzyme'

describe('CreatorTitle component', function() {

	beforeEach(() => {
		jest.resetModules()
	})

	test('CreatorTitle renders title', () => {
		const props = {
			title: 'mock-title',
		}

		const component = renderer.create(<Title {... props}/>)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorTitle renders title', () => {
		const props = {
			title: 'jock-bible',
			showIntro: jest.fn(),
		}

		const component = shallow(<Title {... props}/>)
		component.find('.help-button').simulate('Click')
		expect(props.showIntro).toBeCalled()

	})

	test('CreatorTitle renders title', () => {
		const props = {
			title: 'rock-rifle',
			editTitle: jest.fn(),
		}

		const component = shallow(<Title {... props}/>)
		component.find('.edit-title-button').simulate('Click')
		expect(props.editTitle).toBeCalled()

	})

})

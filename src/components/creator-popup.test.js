import React from 'react'
import Popup from './creator-popup'
import renderer from 'react-test-renderer'
import { shallow, mount } from '../enzyme'

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

		const component = renderer.create(<Popup {... props}/>)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorPopup renders popup', () => {
		const props = {
			title: 'tock-mitle',
			showIntro: false,
			onSubmit: jest.fn(),
			onChange: jest.fn(),
		}

		const component = renderer.create(<Popup {... props}/>)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorPopup tests title text onChange', () => {
		const props = {
			title: 'lock-vital',
			showIntro: true,
			onSubmit: jest.fn(),
			onChange: jest.fn(),
		}

		const component = shallow(<Popup {...props}/>)
		component.find({type: 'text'}).simulate('change', {target: {value: 'dock-cycle'}})
		expect(props.onChange).toBeCalled()

	})

	test('CreatorPopup tests title form onSubmit', () => {
		const props = {
			title: 'sock-idol',
			showIntro: true,
			onSubmit: jest.fn(),
			onChange: jest.fn(),
		}

		const component = mount(<Popup {...props}/>)
		component.find({type: 'submit'}).simulate('submit')
		expect(props.onSubmit).toBeCalled()

	})

})

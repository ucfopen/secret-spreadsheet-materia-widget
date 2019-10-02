import React from 'react'
import Options from './creator-options'
import renderer from 'react-test-renderer'
import { mount, shallow } from '../enzyme'

const props ={
	qset: {
		dimensions: {
			x: 1,
			y: 1,
		},
		spreadsheet: true,
		left: true,
		header: true,
		randomization: 1,
	},
	useSpreadsheet: jest.fn(),
	useTable: jest.fn(),
	useLeftAlign: jest.fn(),
	useCenterAlign: jest.fn(),
	useHeader: jest.fn(),
	toggleInstruction: jest.fn(),
	useQuestion: jest.fn(),
	resetCheckbox: jest.fn(),
}

const makeEvent = value => {
	return {
		target: {
			value: value,
		}
	}
}

describe('CreatorOptions component', function() {

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	test('CreatorOptions renders basic options bar', () => {
		const tree = renderer.create(<Options {... props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	})

	test('CreatorOptions calls useSpreadsheet onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#spreadsheet').simulate('keyDown', {key: 'Enter'})
		expect(props.useSpreadsheet).toReturnTimes(1)
	})

	test('CreatorOptions does not call useSpreadsheet with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#spreadsheet').simulate('keyDown', {key: 'a'})
		expect(props.useSpreadsheet).toReturnTimes(0)
	})

	test('CreatorOptions calls useTable onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#table').simulate('keyDown', {key: 'Enter'})
		expect(props.useTable).toReturnTimes(1)
	})

	test('CreatorOptions does not call useTable with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#table').simulate('keyDown', {key: 'a'})
		expect(props.useTable).toReturnTimes(0)
	})

	test('CreatorOptions calls useLeftAlign onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#left').simulate('keyDown', {key: 'Enter'})
		expect(props.useLeftAlign).toReturnTimes(1)
	})

	test('CreatorOptions does not call useLeftAlign with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#left').simulate('keyDown', {key: 'a'})
		expect(props.useLeftAlign).toReturnTimes(0)
	})

	test('CreatorOptions calls useCenterAlign onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#center').simulate('keyDown', {key: 'Enter'})
		expect(props.useCenterAlign).toReturnTimes(1)
	})

	test('CreatorOptions does not call useCenterAlign with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#center').simulate('keyDown', {key: 'a'})
		expect(props.useCenterAlign).toReturnTimes(0)
	})

	test('CreatorOptions calls useHeader onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#header').simulate('keyDown', {key: 'Enter'})
		expect(props.useHeader).toReturnTimes(1)
	})

	test('CreatorOptions does not call useHeader with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#header').simulate('keyDown', {key: 'a'})
		expect(props.useHeader).toReturnTimes(0)
	})

	test('CreatorOptions calls useHeader onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#instructions').simulate('keyDown', {key: 'Enter'})
		expect(props.toggleInstruction).toReturnTimes(1)
	})

	test('CreatorOptions does not call useHeader with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#instructions').simulate('keyDown', {key: 'a'})
		expect(props.toggleInstruction).toReturnTimes(0)
	})

	test('CreatorOptions calls useHeader onKeyDown', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#question').simulate('keyDown', {key: 'Enter'})
		expect(props.useQuestion).toReturnTimes(1)
	})

	test('CreatorOptions does not call useHeader with wrong key', () => {
		const component = shallow(<Options {... props}/>)
		component.find('#question').simulate('keyDown', {key: 'a'})
		expect(props.useQuestion).toReturnTimes(0)
	})

	test('CreatorOptions renders branches of classNames', () => {
		const props ={
			qset: {
				spreadsheet: false,
				left: false,
				header: false,
				randomization: 0,
			},
		}

		const component = shallow(<Options {... props}/>)
		expect(component.find('#spreadsheet').prop('className')).toEqual('hoverable')

	})

	test('CreatorOptions with negative randomization', () => {
		const event = makeEvent(-1)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(0)

	})

	test('CreatorOptions with normal randomization with header', () => {
		const event = makeEvent(1)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(0)

	})

	test('CreatorOptions with large randomization', () => {
		const event = makeEvent(999)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(0)

	})

	test('CreatorOptions with float as randomization with header', () => {
		const event = makeEvent(0.5)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(0)

	})

	test('CreatorOptions with normal randomization without header', () => {
		const event = makeEvent(1)
		props.qset.header = false

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(1)

	})

	test('CreatorOptions with large randomization without header', () => {
		const event = makeEvent(999)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(1)

	})

	test('CreatorOptions with float as randomization without header', () => {
		const event = makeEvent(1.2)

		const component = shallow(<Options {... props} />)
		component.instance().handleRandomizationChange(event);
		expect(props.qset.randomization).toEqual(1)

	})

})

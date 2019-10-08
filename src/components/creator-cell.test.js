import React from 'react'
import Cell from './creator-cell'
import renderer from 'react-test-renderer'
import { shallow, mount } from '../enzyme'

const makeProps = () => {
	return {
		data: {
			options: {
				blank: true,
			},
			questions: [{
				text: '',
			}],
			answers: [{
				text: '',
			}],
		},
		qset: {
			left: false,
			header: false,
			spreadsheet: true,
			randomization: 0,
			question: '',
			dimensions: { 'x': 1, 'y': 1 },
			items: [{ 'items': [] }]
		},
		appendColumn:jest.fn(),
		removeColumn:jest.fn(),
		appendRow:jest.fn(),
		removeRow:jest.fn(),
		focusOnCell:jest.fn(),
		resetRandomization:jest.fn(),
		refsArray: [[]],
		row: 0,
		column: 0,

	}
}

describe('CreatorCell component', function() {

	beforeEach(() => {
		jest.resetModules()
	})

	test('CreatorCell calls appendColumn', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {altKey: true, key: 'PageUp'})
		expect(props.appendColumn).toBeCalled()
	})

	test('CreatorCell does not call appendColumn with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {altKey: true, key: 'a'})
		expect(props.appendColumn).not.toBeCalled()
	})

	test('CreatorCell calls removeColumn', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {altKey: true, key: 'PageDown'})
		expect(props.removeColumn).toBeCalled()
	})

	test('CreatorCell does not call removeColumn with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {altKey: true, key: 'a'})
		expect(props.removeColumn).not.toBeCalled()
	})

	test('CreatorCell calls appendRow', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {shiftKey: true, key: 'PageUp'})
		expect(props.appendRow).toBeCalled()
	})

	test('CreatorCell does not call appendRow with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {shiftKey: true, key: 'a'})
		expect(props.appendRow).not.toBeCalled()
	})

	test('CreatorCell calls removeRow', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {shiftKey: true, key: 'PageDown'})
		expect(props.removeRow).toBeCalled()
	})

	test('CreatorCell does not call removeRow with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {shiftKey: true, key: 'a'})
		expect(props.removeRow).not.toBeCalled()
	})

	test('CreatorCell calls focusOnCell to cell above', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {ctrlKey: true, key: 'ArrowUp'} )
		expect(props.focusOnCell).toReturnTimes(1)
		component.find('.cell').simulate('keyDown', {metaKey: true, key: 'ArrowUp'} )
		expect(props.focusOnCell).toReturnTimes(2)
	})

	test('CreatorCell calls focusOnCell to cell below', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {ctrlKey: true, key: 'ArrowDown'} )
		expect(props.focusOnCell).toReturnTimes(1)
		component.find('.cell').simulate('keyDown', {metaKey: true, key: 'ArrowDown'} )
		expect(props.focusOnCell).toReturnTimes(2)
	})

	test('CreatorCell calls focusOnCell to cell on the left', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {ctrlKey: true, key: 'ArrowLeft'} )
		expect(props.focusOnCell).toReturnTimes(1)
		component.find('.cell').simulate('keyDown', {metaKey: true, key: 'ArrowLeft'} )
		expect(props.focusOnCell).toReturnTimes(2)
	})

	test('CreatorCell calls focusOnCell to cell on the right', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {ctrlKey: true, key: 'ArrowRight'} )
		expect(props.focusOnCell).toReturnTimes(1)
		component.find('.cell').simulate('keyDown', {metaKey: true, key: 'ArrowRight'} )
		expect(props.focusOnCell).toReturnTimes(2)
	})

	test('CreatorCell does not call focusOnCell with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.cell').simulate('keyDown', {shiftKey: true, key: 'ArrowRight'} )
		expect(props.focusOnCell).toReturnTimes(0)

	})

	test('CreatorCell renders basic cell', () => {
		const props = makeProps()
		const tree = renderer.create(<Cell {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('CreatorCell calls checkbox onKeyDown', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find({type: 'checkbox'}).simulate('keyDown', {key: 'Enter'})
		expect(props.data.options.blank).toBeFalsy()
	})

	test('CreatorCell does not call checkbox onKeyDown with wrong key', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find({type: 'checkbox'}).simulate('keyDown', {key: 'a'})
		expect(props.data.options.blank).toBeTruthy()
	})

	test('CreatorCell calls checkbox onClick', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find('.checkbox').simulate('Click')
		expect(props.data.options.blank).toBeFalsy()
	})

	test('CreatorCell calls checkbox onChange which does nothing', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		expect(props.data.options.blank).toBeTruthy()
		component.find({type: 'checkbox'}).simulate('change', {target: {checked: false}})
		expect(props.data.options.blank).toBeTruthy()
	})

	test('CreatorCell tests text field input', () => {
		const props = makeProps()
		const component = shallow(<Cell {... props}/>)
		component.find({type: 'text'}).simulate('change', {target: {value: 'Test'}})
		expect(props.data.questions[0].text).toEqual('Test')
	})



})

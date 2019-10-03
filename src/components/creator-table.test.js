import React from 'react'
import Table from './creator-table'
import renderer from 'react-test-renderer'
import { mount } from '../enzyme'
import document from './creator-table'


const cellData = (value, check) => {
	return {
		'materiaType': 'question',
		'id': null,
		'type': 'QA',
		'options': {
			'blank': check,
		},
		'questions': [{
			'text': value,
		}],
		'answers': [{
			'id': null,
			'text': value,
			'value': 100
		}]
	}
}

const makeQset = (text = '', blank = false, left = true, header = true) => {
	return {
		dimensions: {
			x: 1,
			y: 1,
		},
		items: [{
			items: [[
				cellData(text, blank),
			]]
		}],
		left: left,
		header: header,
	}
}

describe('CreatorTable component', function() {

	beforeEach(() => {
		jest.resetModules()

	})

	test('CreatorTable renders 1x1 table, left aligned, header', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorTable renders 1x1 table, center aligned, no header', () => {
		const qset = makeQset('', false, false, false)

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorTable renders 1x1 table, unable to remove 1st row', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		expect(props.qset.dimensions.x).toEqual(1)
		component.instance().removeRow(1, 1)
		expect(props.qset.dimensions.x).toEqual(1)

	})

	test('CreatorTable renders 1x1 table, unable to remove 1st column', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		expect(props.qset.dimensions.y).toEqual(1)
		component.instance().removeColumn(1, 1)
		expect(props.qset.dimensions.y).toEqual(1)

	})

	test('CreatorTable renders 1x1 table to append a row', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		expect(props.qset.dimensions.x).toEqual(1)
		component.instance().appendRow()
		expect(props.qset.dimensions.x).toEqual(2)

	})

	test('CreatorTable renders 1x1 table to append a column', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		expect(props.qset.dimensions.y).toEqual(1)
		component.instance().appendColumn()
		expect(props.qset.dimensions.y).toEqual(2)

	})

	test('CreatorTable renders 2x1 table to remove a row when focus is on another row', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		component.instance().appendRow()
		expect(props.qset.dimensions.x).toEqual(2)
		component.instance().removeRow(1, 0)
		expect(props.qset.dimensions.x).toEqual(1)

	})

	test('CreatorTable renders 2x1 table to remove a row when focus is on the same row', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		component.instance().appendRow()
		expect(props.qset.dimensions.x).toEqual(2)
		component.instance().removeRow(2, 0)
		expect(props.qset.dimensions.x).toEqual(1)

	})

	test('CreatorTable renders 1x2 table to remove a column when focus is on another row', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		component.instance().appendColumn()
		expect(props.qset.dimensions.y).toEqual(2)
		component.instance().removeColumn(0, 1)
		expect(props.qset.dimensions.y).toEqual(1)

	})

	test('CreatorTable renders 1x2 table to remove a column when focus is on the same column', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		component.instance().appendColumn()
		expect(props.qset.dimensions.y).toEqual(2)
		component.instance().removeColumn(0, 2)
		expect(props.qset.dimensions.y).toEqual(1)

	})

	test('CreatorTable focuses on non-existant cell', () => {
		const qset = makeQset()

		const props = {
			qset,
			cellData: jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		const retVal = component.instance().focusOnCell(-1, 0)
		expect(retVal).toEqual(0)

	})

})

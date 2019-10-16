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
			rows: 1,
			columns: 1,
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
			refsArray: [],
			appendColumn:jest.fn(),
			removeColumn:jest.fn(),
			appendRow:jest.fn(),
			removeRow:jest.fn(),
			focusOnCell:jest.fn(),
		}
		mount(<Table {... props}/>)

		const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorTable renders 1x1 table, center aligned, no header', () => {
		const qset = makeQset('', false, false, false)

		const props = {
			qset,
			cellData: jest.fn(),
			refsArray: [],
			appendColumn:jest.fn(),
			removeColumn:jest.fn(),
			appendRow:jest.fn(),
			removeRow:jest.fn(),
			focusOnCell:jest.fn(),
		}
		const component = mount(<Table {... props}/>)

		const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()

	})

	test('CreatorTable renders 2x2 table, center aligned, no header', () => {
		const qset = makeQset('', false, false, false)

		const props = {
			qset,
			cellData: jest.fn(),
			refsArray: [],
			appendColumn:jest.fn(),
			removeColumn:jest.fn(),
			appendRow:jest.fn(),
			removeRow:jest.fn(),
			focusOnCell:jest.fn(),
		}
		qset.dimensions.rows = 2
		qset.dimensions.rows = 2

		const component = mount(<Table {... props}/>)

		const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()

	})




})

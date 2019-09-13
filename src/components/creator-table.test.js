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

const makeQset = (text, blank, left, header) => {
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
    const qset = makeQset('', false, true, true)

    const props = {
      qset,
      cellData: jest.fn(),
    }
    const component = mount(<Table {... props}/>)

    const tree = renderer.create(<Table {... props}/>).toJSON()
		expect(tree).toMatchSnapshot()
  })

  test('CreatorTable renders 1x1 table to append and remove rows and columns', () => {
    const qset = makeQset('', false, true, true)

    const props = {
      qset,
      cellData: jest.fn(),
    }
    const component = mount(<Table {... props}/>)
    component.instance().removeRow(0, 0)
    expect(props.qset.dimensions.x).toEqual(1)

    component.instance().removeColumn(0, 0)
    expect(props.qset.dimensions.y).toEqual(1)

    component.instance().appendRow()
    expect(props.qset.dimensions.x).toEqual(2)

    component.instance().appendColumn()
    expect(props.qset.dimensions.y).toEqual(2)

    component.instance().removeRow(2, 2)
    expect(props.qset.dimensions.x).toEqual(1)

    component.instance().appendRow()
    component.instance().removeRow(1, 2)
    expect(props.qset.dimensions.x).toEqual(1)
    component.instance().appendRow()

    component.instance().removeColumn(2, 2)
    expect(props.qset.dimensions.y).toEqual(1)

    component.instance().appendColumn()
    component.instance().removeColumn(2, 1)
    expect(props.qset.dimensions.y).toEqual(1)

  })

  test('CreatorTable calls table onBlur', () => {
    const qset = makeQset('', true, false, false)

    const props = {
      qset,
      cellData: jest.fn(),
    }

    const component = mount(<Table {... props}/>)

    component.instance().appendRow()
    component.instance().appendRow()

    component.find('table').simulate('blur')
    expect(props.qset.items[0].items[1][0]).toBeUndefined()

    component.instance().focusOnCell(0, 0)
  })

})

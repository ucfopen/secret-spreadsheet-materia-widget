import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

const mockDomRender = jest.fn();

const genEvent = {
  preventDefault: jest.fn(),
}

const makeProps = (init = true, left = false, header = false, spreadsheet = false) => {
  return {
    title: 'New Spreadsheet Widget',
    qset: {
      'left': left,
      'header': header,
      'spreadsheet': spreadsheet,
      'randomization': 0,
      'dimensions': {'x': 1, 'y': 1},
      'items': [{'items': []}]
    },
    init: init,
  }
}

describe('CreatorApp component', function() {

  beforeEach(() => {
    jest.resetModules()

    global.Materia = {
      CreatorCore: {
        start: jest.fn(),
        save: jest.fn(),
        cancelSave: jest.fn(),
      }
    }

  })

  test('CreatorApp calls CreatorCore start', () => {
    require('./creator')

    expect(global.Materia.CreatorCore.start).toHaveBeenCalledTimes(1)
  })

  test('CreatorApp calls materiaCallbacks functions', () => {
    require('./creator')
    const callbacks = Materia.CreatorCore.start.mock.calls[0][0];

    expect(callbacks).toHaveProperty('initNewWidget', expect.any(Function))
    expect(callbacks).toHaveProperty('initExistingWidget', expect.any(Function))
    expect(callbacks).toHaveProperty('onSaveClicked', expect.any(Function))
    expect(callbacks).toHaveProperty('onSaveComplete', expect.any(Function))
  })

  test('CreatorApp renders materiaCallbacks.initNewWidget', () => {
    require('./creator')
    const instance = {}

    jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
    const retVal = callbacks.initNewWidget(instance)
    expect(retVal).toEqual('1A4')
  })

  test('CreatorApp renders materiaCallbacks.initExistingWidget', () => {
    require('./creator')
    const instance = {}

    jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
    const retVal = callbacks.initExistingWidget('Newt Widget', instance, {}, 1)
    expect(retVal).toEqual('1A4')
  })

  test('CreatorApp renders materiaCallbacks.onSaveComplete', () => {
    require('./creator')

    jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
    const retVal = callbacks.onSaveComplete()
    expect(retVal).toEqual('1A4')
  })

  test('CreatorApp renders base code', () => {
    const CreatorApp = require('./creator').default
    const props = {}

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('CreatorApp renders branch code', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('CreatorApp renders branch code', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  enzyme.configure({ adapter: new Adapter() })
  test('CreatorApp calls onSaveClicked - save', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().onSaveClicked()
    expect(Materia.CreatorCore.save).toBeCalled()
  })

  test('CreatorApp calls onSaveClicked - cancelSave', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    props.title = ''
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().onSaveClicked()
    expect(Materia.CreatorCore.cancelSave).toBeCalled()
  })

  test('CreatorApp calls showIntro', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(false)
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.showIntro).toBeFalsy()
    component.instance().showIntro(event)
    expect(component.instance().state.showIntro).toBeTruthy()
  })

  test('CreatorApp calls editTitle', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.showIntro).toBeTruthy()
    component.instance().editTitle(event)
    expect(component.instance().state.showIntro).toBeFalsy()
  })

  test('CreatorApp calls handleTitleSubmit', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.showIntro).toBeTruthy()
    component.instance().handleTitleSubmit(event)
    expect(component.instance().state.showIntro).toBeFalsy()
  })

  test('CreatorApp calls handleTitleChange', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = { ...genEvent, ...{
      target: {
        value: 'Hi'
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleTitleChange(event)
    expect(component.instance().state.title).toEqual('Hi')
  })

  test('CreatorApp calls handleTableSubmit', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = { ...genEvent, ...{
      target: [
        {value: 'Hi'},
        {checked: true}
      ]
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleTableSubmit(event)
    expect(component.instance().state.qset.items[0].items[0][0].options.blank).toEqual(true)
  })

  test('CreatorApp calls handleTableSubmit with header enabled', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(true, false, true)
    const event = { ...genEvent, ...{
      target: [
        {value: 'Hi'},
        {checked: true}
      ]
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleTableSubmit(event)
    expect(component.instance().state.qset.items[0].items[0][0].options.blank).toEqual(false)
  })

  test('CreatorApp calls handleXChange with negative x value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: -1,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleXChange(event)
    expect(component.instance().state.qset.dimensions.x).toEqual(1)
  })

  test('CreatorApp calls handleXChange with large x value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: 9001,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleXChange(event)
    expect(component.instance().state.qset.dimensions.x).toEqual(10)
  })

  test('CreatorApp calls handleXChange with normal x value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: 5,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleXChange(event)
    expect(component.instance().state.qset.dimensions.x).toEqual(5)
  })

  test('CreatorApp calls handleYChange with negative y value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: -1,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleYChange(event)
    expect(component.instance().state.qset.dimensions.y).toEqual(1)
  })

  test('CreatorApp calls handleYChange with large y value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: 9001,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleYChange(event)
    expect(component.instance().state.qset.dimensions.y).toEqual(10)
  })

  test('CreatorApp calls handleYChange with normal y value', () => {
    const CreatorApp = require('./creator').default
    const props = {}
    const event = { ...genEvent, ...{
      target: {
        value: 5,
      }
    }}

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().handleYChange(event)
    expect(component.instance().state.qset.dimensions.y).toEqual(5)
  })

  test('CreatorApp calls useSpreadsheet', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(true, false, false, false)
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.qset.spreadsheet).toEqual(false)
    component.instance().useSpreadsheet(event)
    expect(component.instance().state.qset.spreadsheet).toEqual(true)
  })

  test('CreatorApp calls useTable', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(true, false, false, true)
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.qset.spreadsheet).toEqual(true)
    component.instance().useTable(event)
    expect(component.instance().state.qset.spreadsheet).toEqual(false)
  })

  test('CreatorApp calls useLeftAlign', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(true, false)
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.qset.left).toEqual(false)
    component.instance().useLeftAlign(event)
    expect(component.instance().state.qset.left).toEqual(true)
  })

  test('CreatorApp calls useCenterAlign', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps(true, true)
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    expect(component.instance().state.qset.left).toEqual(true)
    component.instance().useCenterAlign(event)
    expect(component.instance().state.qset.left).toEqual(false)
  })

  test('CreatorApp calls useHeader toggle', () => {
    const CreatorApp = require('./creator').default
    const props = makeProps()
    const event = genEvent

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().useHeader(event)
    expect(component.instance().state.qset.header).toEqual(true)
    component.instance().useHeader(event)
    expect(component.instance().state.qset.header).toEqual(false)
  })

})

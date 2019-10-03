import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

const mockDomRender = jest.fn();

const genEvent = {
	preventDefault: jest.fn(),
}

const makeProps = (init = true, left = false, header = false, spreadsheet = false, randomization = 0, blank = false) => {
	return {
		title: 'New Spreadsheet Widget',
		qset: {
			'left': left,
			'header': header,
			'spreadsheet': spreadsheet,
			'randomization': randomization,
			'dimensions': {'x': 1, 'y': 1},
			'items': [{
				'items': [[{
					'options': {
						'blank': blank
					}
				}]]
			}]
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

	enzyme.configure({ adapter: new Adapter() })

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

	test('CreatorApp calls materiaCallbacks.initNewWidget', () => {
		require('./creator')
		const instance = {}

		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
		const retVal = callbacks.initNewWidget(instance)
		expect(retVal).toEqual('1A4')
	})

	test('CreatorApp calls materiaCallbacks.initExistingWidget', () => {
		require('./creator')
		const instance = {}

		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
		const retVal = callbacks.initExistingWidget('Newt Widget', instance, {}, 1)
		expect(retVal).toEqual('1A4')
	})

	test('CreatorApp calls materiaCallbacks.onSaveClicked', () => {
		require('./creator').default

		jest.mock('react-dom', () => ({
			render: jest.fn().mockReturnValue({onSaveClicked: jest.fn()})
		}));

		const mockOnSaveClicked = require('react-dom').render().onSaveClicked

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
		callbacks.initExistingWidget('', {}, {}, 1)
		expect(mockOnSaveClicked).not.toHaveBeenCalled()
		callbacks.onSaveClicked()
		expect(mockOnSaveClicked).toHaveBeenCalled()
	})

	test('CreatorApp calls materiaCallbacks.onSaveClicked', () => {
		require('./creator').default

		jest.mock('react-dom', () => ({
			render: jest.fn().mockReturnValue({onSaveClicked: jest.fn()})
		}));

		const mockOnSaveClicked = require('react-dom').render().onSaveClicked

		const callbacks = Materia.CreatorCore.start.mock.calls[0][0];
		callbacks.initExistingWidget('', {}, { randomization:1 }, 1)
		expect(mockOnSaveClicked).not.toHaveBeenCalled()
		callbacks.onSaveClicked()
		expect(mockOnSaveClicked).toHaveBeenCalled()
	})

	test('CreatorApp calls materiaCallbacks.onSaveComplete', () => {
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


	test('CreatorApp calls onSaveClicked - save with randomization hidden', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 1)

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().onSaveClicked()
		expect(Materia.CreatorCore.save).toBeCalled()
	})

	test('CreatorApp calls onSaveClicked - save with checkbox hidden', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 0, true)

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().onSaveClicked()
		expect(Materia.CreatorCore.save).toBeCalled()
	})

	test('CreatorApp calls onSaveClicked - cancelSave because no cell hidden', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().onSaveClicked()
		expect(Materia.CreatorCore.cancelSave).toBeCalled()
	})

	test('CreatorApp calls onSaveClicked - cancelSave because empty title', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 0, true)
		props.title = ''

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

	test('CreatorApp calls toggleKeyboardInst', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()

		const component = shallow(<CreatorApp {... props}/>)
		expect(component.instance().state.showKeyControls).toEqual(false)
		component.instance().toggleKeyboardInst()
		expect(component.instance().state.showKeyControls).toEqual(true)
		component.instance().toggleKeyboardInst()
		expect(component.instance().state.showKeyControls).toEqual(false)

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

	test('CreatorApp toggles on header to lower upper limit on randomization number', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 1)
		const event = genEvent

		const component = shallow(<CreatorApp {... props}/>)
		expect(component.instance().state.qset.randomization).toEqual(1)
		component.instance().useHeader(event)
		expect(component.instance().state.qset.header).toEqual(true)
		expect(component.instance().state.qset.randomization).toEqual(0)
	})

	test('CreatorApp calls useQuestion toggle', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()
		const event = genEvent

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().useQuestion(event)
		expect(component.instance().state.showQuestion).toEqual(false)
		component.instance().useQuestion(event)
		expect(component.instance().state.showQuestion).toEqual(true)
	})

	test('CreatorApp calls handleQuestionChange', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()
		const event = {
			...genEvent,
			target: {
				value: "Has anyone really been far?"
			}
		}

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().handleQuestionChange(event)
		expect(component.instance().state.qset.question).toEqual("Has anyone really been far?")
	})

	test('CreatorApp calls handleQuestionChange ', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()
		const event = {
			...genEvent,
			target: {
				value: "P = NP?",
				rows: 3,
				scrollHeight: 72,
			},
		}

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().handleQuestionChange(event)
		expect(component.instance().state.qset.question).toEqual("P = NP?")
	})

	test('CreatorApp calls handleDescriptionChange', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()
		const event = {
			...genEvent,
			target: {
				value: "It's just common sense.",
			},
		}

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().handleDescriptionChange(event)
		expect(component.instance().state.qset.description).toEqual("It's just common sense.")
	})

	test('CreatorApp calls handleDescriptionChange', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()
		const event = {
			...genEvent,
			target: {
				value: "N = 1!",
				rows: 4,
				scrollHeight: 80,
			},
		}

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().handleDescriptionChange(event)
		expect(component.instance().state.qset.description).toEqual("N = 1!")
	})

	test('CreatorApp calls toggleInstruction', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().toggleInstruction()
		expect(component.instance().state.showInstruction).toEqual(false)
		component.instance().toggleInstruction()
		expect(component.instance().state.showInstruction).toEqual(true)
	})

	test('CreatorApp calls toggleHideCellMethod', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps()

		const component = shallow(<CreatorApp {... props}/>)
		component.instance().toggleHideCellMethod()
		expect(component.instance().state.hideCellsRandomly).toEqual(false)
		component.instance().toggleHideCellMethod()
		expect(component.instance().state.hideCellsRandomly).toEqual(true)
	})

	test('CreatorApp calls resetCheckbox toggle', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 0, true)

		const component = shallow(<CreatorApp {... props}/>)
		expect(component.instance().state.qset.items[0].items[0][0].options.blank).toBeTruthy()
		component.instance().resetCheckbox()
		expect(component.instance().state.qset.items[0].items[0][0].options.blank).toBeFalsy()
	})

	test('CreatorApp calls resetRandomization toggle', () => {
		const CreatorApp = require('./creator').default
		const props = makeProps(true, false, false, false, 1)

		const component = shallow(<CreatorApp {... props}/>)
		expect(component.instance().state.qset.randomization).toEqual(1)
		component.instance().resetRandomization()
		expect(component.instance().state.qset.randomization).toEqual(0)
	})

})

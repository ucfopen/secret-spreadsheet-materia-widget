import React from 'react'
import Instruction from './creator-instruction'
import renderer from 'react-test-renderer'
import { shallow } from '../enzyme'

const makeProps = () => {
  return({
    toggleInstruction: jest.fn(),
    toggleKeyboardInst: jest.fn(),
  })
}

describe('CreatorInstruction component', function() {

	beforeEach(() => {
		jest.resetModules()
  })

  test('CreatorInstruction toggles keyboard control with onClick', () => {
		const props = makeProps()

    const component = renderer.create(<Instruction {... props}/>)
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot()
	})

	test('CreatorInstruction toggles keyboard control with onClick', () => {
		const props = makeProps()

		const component = shallow(<Instruction {... props}/>)

		component.find('.keyboard-controls-div').simulate('Click')
		expect(props.toggleKeyboardInst).toBeCalled()
	})

	test('CreatorInstruction toggles keyboard control with Enter keyPress', () => {
		const props = makeProps()

		const component = shallow(<Instruction {... props}/>)

		component.find('.keyboard-controls-spam').simulate('keypress', {key: 'Enter'})
		expect(props.toggleKeyboardInst).toBeCalled()
	})

	test('CreatorInstruction toggles keyboard control with non-Enter keyPress', () => {
		const props = makeProps()

		const component = shallow(<Instruction {... props}/>)

		component.find('.keyboard-controls-spam').simulate('keypress', {key: 'a'})
		expect(props.toggleKeyboardInst).not.toBeCalled()
	})


	test('CreatorInstruction calls toggleInstruction with Enter key', () => {
		const props = makeProps()

		const component = shallow(<Instruction {... props}/>)
		component.find('.close').simulate('keypress', {key: 'Enter'})
		expect(props.toggleInstruction).toBeCalled()
	})

  test('CreatorInstruction fails to call toggleInstruction with non-Enter keyPress', () => {
		const props = makeProps()

		const component = shallow(<Instruction {... props}/>)
		component.find('.close').simulate('keypress', {key: 'a'})
		expect(props.toggleInstruction).not.toBeCalled()
	})

})

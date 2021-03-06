import React from 'react';
import Instruction from './instruction';
import renderer from 'react-test-renderer';
import { shallow } from '../../enzyme';

const makeProps = (showKeyControls = false) => {
	return({
		toggleInstruction: jest.fn(),
		focusOnInstruction: jest.fn(),
		toggleKeyboardInst: jest.fn(),
		showKeyControls: showKeyControls,
		instructionRef: {
			current: {}
		}
	});
};

describe(`CreatorInstruction component`, function() {
	beforeEach(() => {
		jest.resetModules();
	});

	test(`CreatorInstruction renders basic component with key controls`, () => {
		const props = makeProps(true);

		const component = renderer.create(<Instruction {... props}/>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test(`CreatorInstruction renders basic component without key controls`, () => {
		const props = makeProps();

		const component = renderer.create(<Instruction {... props}/>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test(`CreatorInstruction toggles keyboard control with onClick`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);

		component.find(`.keyboard-controls-div`).simulate(`Click`);
		expect(props.toggleKeyboardInst).toBeCalled();
	});

	test(`CreatorInstruction toggles keyboard control with Enter keyPress`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);

		component.find(`.keyboard-controls-spam`).simulate(`keypress`, {key: `Enter`});
		expect(props.toggleKeyboardInst).toBeCalled();
	});

	test(`CreatorInstruction toggles keyboard control with non-Enter keyPress`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);

		component.find(`.keyboard-controls-spam`).simulate(`keypress`, {key: `a`});
		expect(props.toggleKeyboardInst).not.toBeCalled();
	});

	test(`CreatorInstruction calls toggleInstruction with Click`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);
		component.find(`.close`).simulate(`Click`);
		expect(props.toggleInstruction).toBeCalled();
		expect(props.focusOnInstruction).toBeCalled();
	});

	test(`CreatorInstruction calls toggleInstruction with Enter key`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);
		component.find(`.close`).simulate(`keypress`, {key: `Enter`});
		expect(props.toggleInstruction).toBeCalled();
		expect(props.focusOnInstruction).toBeCalled();
	});

	test(`CreatorInstruction fails to call toggleInstruction with non-Enter keyPress`, () => {
		const props = makeProps();

		const component = shallow(<Instruction {... props}/>);
		component.find(`.close`).simulate(`keypress`, {key: `a`});
		expect(props.toggleInstruction).not.toBeCalled();
	});
});

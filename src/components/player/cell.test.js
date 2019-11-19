import React from 'react';
import Cell from './cell';
import renderer from 'react-test-renderer';
import { shallow } from '../../enzyme';

const genProps = {
	key: 1,
	id: 1,
	saveAnswer: jest.fn(),
	displayText: `Testing Text`,
	firstInput: false,
	focus: false,
	exitQuestion: false
};

const makeProps = (showInput, leftAlign) => {
	const props = {
		showInput: showInput,
		leftAlign: leftAlign
	};
	Object.assign(props, genProps);

	return props;
};

const testComponent = (showInput=false, leftAlign=false) => {
	const props = makeProps(showInput, leftAlign);
	const component = renderer.create(<Cell {... props} />);
	const tree = component.toJSON();

	return tree;
};

describe(`Cell component`, () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test(`Rendered with user input left aligned`, () => {
		const tree = testComponent(true, true);
		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with user input center aligned`, () => {
		const tree = testComponent(true, false);
		expect(tree).toMatchSnapshot();
	});

	test(`Rendered without user input left aligned`, () => {
		const tree = testComponent(false, true);
		expect(tree).toMatchSnapshot();
	});

	test(`Rendered without user input center aligned`, () => {
		const tree = testComponent(false, false);
		expect(tree).toMatchSnapshot();
	});

	test(`handleChange with nonblank answer`, () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: `Test`
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.instance().componentDidUpdate = jest.fn();
		const originalClass = tempComponent.state([`colorClass`]);
		const originalFirstFocus = tempComponent.state([`firstFocus`]);

		tempComponent.instance().handleChange(event);

		expect(tempComponent.state([`value`])).toEqual(`Test`);
		expect(tempComponent.state([`colorClass`])).toEqual(originalClass);
		expect(tempComponent.state([`firstFocus`])).toEqual(originalFirstFocus);
		expect(tempComponent.instance().componentDidUpdate).toHaveBeenCalled();

		// cleanup
		tempComponent.unmount();
	});

	test(`handleChange with blank answer`, () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: ``
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.instance().componentDidUpdate = jest.fn();
		const originalClass = tempComponent.state([`colorClass`]);
		const originalFirstFocus = tempComponent.state([`firstFocus`]);

		tempComponent.instance().handleChange(event);

		expect(tempComponent.state([`value`])).toEqual(``);
		expect(tempComponent.state([`colorClass`])).toEqual(originalClass);
		expect(tempComponent.state([`firstFocus`])).toEqual(originalFirstFocus);
		expect(tempComponent.instance().componentDidUpdate).toHaveBeenCalled();

		// cleanup
		tempComponent.unmount();
	});

	test(`handleChange with value over the character limit`, () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: `1234567890123456789012345678901234567890`
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.instance().componentDidUpdate = jest.fn();

		tempComponent.instance().handleChange(event);

		expect(tempComponent.state([`value`])).toEqual(`123456789012345678901234567890123456`);
		expect(tempComponent.instance().componentDidUpdate).toHaveBeenCalled();

		// cleanup
		tempComponent.unmount();
	});

	test(`componentDidUpdate with nonblank value and unanswered class`, () => {
		const props = makeProps(true, false);

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: `Test`,
			colorClass: `unanswered`
		});
		const originalValue = tempComponent.state([`value`]);

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state([`value`])).toEqual(originalValue);
		expect(tempComponent.state([`colorClass`])).toEqual(`answered`);

		// cleanup
		tempComponent.unmount();
	});

	test(`componentDidUpdate with blank value and answered class`, () => {
		const props = makeProps(true, false);

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: ``,
			colorClass: `answered`
		});
		const originalValue = tempComponent.state([`value`]);

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state([`value`])).toEqual(originalValue);
		expect(tempComponent.state([`colorClass`])).toEqual(`unanswered`);

		// cleanup
		tempComponent.unmount();
	});

	test(`componentDidUpdate with change focus needed no question`, () => {
		const props = makeProps(true, false);
		props.firstInput = true;
		props.focus = true;

		const inputComponent = {
			focus: jest.fn()
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: ``,
			colorClass: `unanswered`,
			firstFocus: true
		});
		const originalValue = tempComponent.state([`value`]);
		const originalClass = tempComponent.state([`colorClass`]);
		tempComponent.instance().input.current = inputComponent;

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state([`value`])).toEqual(originalValue);
		expect(tempComponent.state([`colorClass`])).toEqual(originalClass);
		expect(tempComponent.state([`firstFocus`])).toEqual(true);

		// cleanup
		tempComponent.unmount();
	});

	test(`componentDidUpdate with change focus needed with question`, () => {
		const props = makeProps(true, false);
		props.firstInput = true;
		props.focus = true;
		props.exitQuestion = true;

		const inputComponent = {
			focus: jest.fn()
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: ``,
			colorClass: `unanswered`,
			firstFocus: true
		});
		const originalValue = tempComponent.state([`value`]);
		const originalClass = tempComponent.state([`colorClass`]);
		tempComponent.instance().input.current = inputComponent;

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state([`value`])).toEqual(originalValue);
		expect(tempComponent.state([`colorClass`])).toEqual(originalClass);
		expect(tempComponent.state([`firstFocus`])).toEqual(false);

		// cleanup
		tempComponent.unmount();
	});

	// note the things that are tested here happen in the previous three tests. This is necessary to stop an endless loop because state is being set
	test(`componentDidUpdate with no changes needed`, () => {
		const props = makeProps(true, false);

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: `Test`,
			colorClass: `answered`
		});

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state([`value`])).toEqual(`Test`);
		expect(tempComponent.state([`colorClass`])).toEqual(`answered`);

		// cleanup
		tempComponent.unmount();
	});
});

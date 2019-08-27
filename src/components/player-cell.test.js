import React from 'react';
import Cell from './player-cell'
import renderer from 'react-test-renderer';
import { shallow } from '../enzyme';

const genProps = {
	key: 1,
	id: 1,
	saveAnswer: jest.fn(),
	displayText: 'Testing Text'
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
}

describe('Cell component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Rendered with user input left aligned', () => {
		const tree = testComponent(true, true);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered with user input center aligned', () => {
		const tree = testComponent(true, false);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered without user input left aligned', () => {
		const tree = testComponent(false, true);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered without user input center aligned', () => {
		const tree = testComponent(false, false);
		expect(tree).toMatchSnapshot();
	});

	test('handleChange with nonblank answer', () => {
		// supress console errors (td inside div from tempComponent is expected error)
		const originalError = console.error;
		console.error = jest.fn();

		const props = makeProps(true, false);
		const event = {
			target: {
				value: 'Test'
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.instance().componentDidUpdate = jest.fn();
		const originalClass = tempComponent.state(['colorClass']);

		tempComponent.instance().handleChange(event);

		expect(tempComponent.state(['value'])).toEqual('Test');
		expect(tempComponent.state(['colorClass'])).toEqual(originalClass);
		expect(tempComponent.instance().componentDidUpdate).toHaveBeenCalled();

		// cleanup
		tempComponent.unmount();
		console.error = originalError;
	});

	test('handleChange with blank answer', () => {
		// supress console errors (td inside div from tempComponent is expected error)
		const originalError = console.error;
		console.error = jest.fn();

		const props = makeProps(true, false);
		const event = {
			target: {
				value: ''
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.instance().componentDidUpdate = jest.fn();
		const originalClass = tempComponent.state(['colorClass']);

		tempComponent.instance().handleChange(event);

		expect(tempComponent.state(['value'])).toEqual('');
		expect(tempComponent.state(['colorClass'])).toEqual(originalClass);
		expect(tempComponent.instance().componentDidUpdate).toHaveBeenCalled();

		// cleanup
		tempComponent.unmount();
		console.error = originalError;
	});

	test('componentDidUpdate with nonblank value and unanswered class', () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: 'Test'
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: 'Test',
			colorClass: 'unanswered'
		});
		const originalValue = tempComponent.state(['value']);

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state(['value'])).toEqual(originalValue);
		expect(tempComponent.state(['colorClass'])).toEqual('answered');

		// cleanup
		tempComponent.unmount();
	});

	test('componentDidUpdate with blank value and answered class', () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: ''
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: '',
			colorClass: 'answered'
		});
		const originalValue = tempComponent.state(['value']);

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state(['value'])).toEqual(originalValue);
		expect(tempComponent.state(['colorClass'])).toEqual('unanswered');

		// cleanup
		tempComponent.unmount();
	});

	// note the things that are tested here happen in the previous two tests. This is necessary to stop an endless loop because state is being set
	test('componentDidUpdate with no changes needed', () => {
		const props = makeProps(true, false);
		const event = {
			target: {
				value: 'Test'
			}
		};

		const tempComponent = shallow(<Cell {... props} />);
		tempComponent.setState({
			value: 'Test',
			colorClass: 'answered'
		});

		tempComponent.instance().componentDidUpdate();

		expect(tempComponent.state(['value'])).toEqual('Test');
		expect(tempComponent.state(['colorClass'])).toEqual('answered');

		// cleanup
		tempComponent.unmount();
	});
});

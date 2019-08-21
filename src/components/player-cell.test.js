import React from 'react';
import Cell from './player-cell.js'
import renderer from 'react-test-renderer';

const saveMock = () => {
	return;
};

const genProps = {
	key: 1,
	id: 1,
	saveAnswer: saveMock,
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

const testComponent = props => {
	const component = renderer.create(<Cell {... props} />);
	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
};

const runTest = (showInput=false, leftAlign=false) => {
	const props = makeProps(showInput, leftAlign);
	testComponent(props);
}

describe('Table Cell component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Left aligned cell renders with text', () => {
		runTest(false, true)
	});

	test('Center aligned cell renders with text', () => {
		runTest();
	});

	test('Left aligned cell renders with input', () => {
		runTest(true, true);
	});

	test('Center aligned cell renders with input', () => {
		runTest(true);
	});
});

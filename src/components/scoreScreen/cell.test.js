import React from 'react';
import Cell from './cell';
import renderer from 'react-test-renderer';

const props = () => {
	return {
		key: 1,
		id: 1,
		displayText: `Correct Answer`,
		answer: `Wrong Answer`,
		answerable: true,
		leftAlign: false,
		correct: false,
		checked: false
	};
};

const customProps = (changes={}) => {
	const newProps = props();

	Object.defineProperties(newProps, changes);

	return newProps;
};

describe(`Cell`, () => {
	beforeEach(() => {
		jest.resetModules();
		jest.resetAllMocks();
	});

	test(`Is rendered not answerable centered`, () => {
		const genProps = customProps({
			answerable: {value: false}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered not answerable left aligned`, () => {
		const genProps = customProps({
			answerable: {value: false},
			leftAlign: {value: true}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable centered unchecked with correct response`, () => {
		const genProps = customProps({
			correct: {value: true},
			answer: {value: `Correct Answer`}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable centered unchecked with wrong response`, () => {
		const genProps = props();

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable centered checked with correct response`, () => {
		const genProps = customProps({
			correct: {value: true},
			answer: {value: `Correct Answer`},
			checked: {value: true}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable centered checked with wrong response`, () => {
		const genProps = customProps({
			checked: {value: true}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable left aligned unchecked with correct response`, () => {
		const genProps = customProps({
			leftAlign: {value: true},
			correct: {value: true},
			answer: {value: `Correct Answer`}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable left aligned unchecked with wrong response`, () => {
		const genProps = customProps({
			leftAlign: {value: true},
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable left aligned checked with correct response`, () => {
		const genProps = customProps({
			leftAlign: {value: true},
			correct: {value: true},
			answer: {value: `Correct Answer`},
			checked: {value: true}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Is rendered answerable left aligned checked with wrong response`, () => {
		const genProps = customProps({
			leftAlign: {value: true},
			checked: {value: true}
		});

		const component = renderer.create(<Cell {... genProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

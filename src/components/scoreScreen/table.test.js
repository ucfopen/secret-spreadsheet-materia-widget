import React from 'react';
import ScoreTable from './table';
import renderer from 'react-test-renderer';
import { shallow } from '../../enzyme';

const props = () => {
	return {
		spreadsheet: false,
		dimensions: {
			rows: 2,
			columns: 2
		},
		header: false,
		qset: [
			[
				{
					"materiaType": `question`,
					"id": null,
					"type": `QA`,
					"questions": [
						{
							"text": `Show 1`
						}
					],
					"answers": [
						{
							"id": null,
							"text": `Show 1`,
							"value": 100
						}
					],
					"options": {
						"blank": false,
						"position": {
							"row": 0,
							"column": 0
						}
					}
				},
				{
					"materiaType": `question`,
					"id": null,
					"type": `QA`,
					"questions": [
						{
							"text": `Hide 1`
						}
					],
					"answers": [
						{
							"id": null,
							"text": `Hide 1`,
							"value": 100
						}
					],
					"options": {
						"blank": true,
						"position": {
							"row": 0,
							"column": 1
						}
					}
				}
			],
			[
				{
					"materiaType": `question`,
					"id": null,
					"type": `QA`,
					"questions": [
						{
							"text": `Hide 2`
						}
					],
					"answers": [
						{
							"id": null,
							"text": `Hide 2`,
							"value": 100
						}
					],
					"options": {
						"blank": true,
						"position": {
							"row": 1,
							"column": 0
						}
					}
				},
				{
					"materiaType": `question`,
					"id": null,
					"type": `QA`,
					"questions": [
						{
							"text": `Show 2`
						}
					],
					"answers": [
						{
							"id": null,
							"text": `Show 2`,
							"value": 100
						}
					],
					"options": {
						"blank": false,
						"position": {
							"row": 1,
							"column": 1
						}
					}
				}
			]
		],
		positions: new Set([`row0 column1`, `row1 column0`]),
		leftAlign: false,
		scoreTable: [
			{
				data: [
					`Hide 1`, `Hide 1`, `Hide 1`, `row0 column1`
				],
				data_style: [
					`question`, `response`, `answer`, `position`
				],
				display_score: true,
				feedback: null,
				graphic: `score`,
				score: 100,
				style: `full-value`,
				symbol: `%`,
				tag: `div`,
				type: `SCORE_QUESTION_ANSWERED`
			},
			{
				data: [
					`Hide 2`, `wrong`, `Hide 2`, `row1 column0`
				],
				data_style: [
					`question`, `response`, `answer`, `position`
				],
				display_score: true,
				feedback: null,
				graphic: `score`,
				score: 100,
				style: `full-value`,
				symbol: `%`,
				tag: `div`,
				type: `SCORE_QUESTION_ANSWERED`
			}
		]
	};
};

const customProps = (changes={}) => {
	const newProps = props();

	Object.defineProperties(newProps, changes);

	return newProps;
};

describe(`ScoreTable`, () => {
	test(`Rendered with header, spreadsheet, centered`, () => {
		const newProps = customProps({
			header: {value: true},
			spreadsheet: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with header, spreadsheet, left aligned`, () => {
		const newProps = customProps({
			header: {value: true},
			spreadsheet: {value: true},
			leftAlign: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with header, no spreadsheet, centered`, () => {
		const newProps = customProps({
			header: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with header, no spreadsheet, left aligned`, () => {
		const newProps = customProps({
			header: {value: true},
			leftAlign: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with no header, spreadsheet, centered`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with no header, spreadsheet, left aligned`, () => {
		const newProps = customProps({
			leftAlign: {value: true},
			spreadsheet: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with no header, no spreadsheet, centered`, () => {
		const newProps = props();

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Rendered with no header, no spreadsheet, left aligned`, () => {
		const newProps = customProps({
			leftAlign: {value: true}
		});

		const component = renderer.create(<ScoreTable {... newProps} />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`handleChange works going from not checked to checked`, () => {
		const event = {
			target: {
				checked: true
			}
		};
		const newProps = props();

		const component = shallow(<ScoreTable {... newProps} />);
		component.setState({checked: false});
		component.instance().handleChange(event);

		expect(component.state([`checked`])).toBeTruthy();

		// cleanup
		component.unmount();
	});

	test(`handleChange works going from checked to not checked`, () => {
		const event = {
			target: {
				checked: false
			}
		};
		const newProps = props();

		const component = shallow(<ScoreTable {... newProps} />);
		component.setState({checked: true});
		component.instance().handleChange(event);

		expect(component.state([`checked`])).toBeFalsy();

		// cleanup
		component.unmount();
	});

	test(`convertNumberToLetters number less than 0`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(-1);

		expect(typeof result).toBe(`string`);
		expect(result).toBe(`A`);

		// cleanup
		component.unmount();
	});

	test(`convertNumberToLetters number is 0`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(0);

		expect(typeof result).toBe(`string`);
		expect(result).toBe(`A`);

		// cleanup
		component.unmount();
	});

	test(`convertNumberToLetters number is greater than 0`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(1);

		expect(typeof result).toBe(`string`);
		expect(result).toBe(`B`);

		// cleanup
		component.unmount();
	});

	test(`convertNumberToLetters number is very large`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(1000000000);

		expect(typeof result).toBe(`string`);
		expect(result).toBe(`CGEHTYM`);

		// cleanup
		component.unmount();
	});

	test(`convertNumberToLetters gets an average number`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(40);

		expect(typeof result).toBe(`string`);
		expect(result).toEqual(`AO`);

		//cleanup
		component.unmount();
	});

	test(`convertNumberToLetters doesn't get a number`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});
		const realError = console.error;
		console.error = jest.fn();

		const component = shallow(<ScoreTable {... newProps} />);
		const result = component.instance().convertNumberToLetters(`test`);

		expect(console.error).toHaveBeenCalledTimes(1);
		expect(result).toBe(NaN);

		// cleanup
		component.unmount();
		console.error = realError;
	});

	test(`generateBody with start at 0 and the answer is not in the scoreTable`, () => {
		const newProps = customProps({
			scoreTable: {value: []}
		});
		const realError = console.error;
		console.error = jest.fn();

		const component = shallow(<ScoreTable {... newProps} />);
		component.instance().generateBody();

		// four times because three times is with the original generation
		expect(console.error).toHaveBeenCalledTimes(4);

		// cleanup
		component.unmount();
		console.error = realError;
	});

	test(`Toggle show answer checkbox with click`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);

		expect(component.instance().state.checked).toBeFalsy();
		component.find(`.show-answer-checkbox`).simulate(`Click`);
		expect(component.instance().state.checked).toBeTruthy();

		//cleanup
		component.unmount();
	});

	test(`Toggle show answer checkbox with Enter`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);

		expect(component.instance().state.checked).toBeFalsy();
		component.find(`.show-answer-checkbox`).simulate(`keyDown`, {key: `Enter`});
		expect(component.instance().state.checked).toBeTruthy();

		//cleanup
		component.unmount();
	});

	test(`Can not toggle show answer checkbox with key other than Enter`, () => {
		const newProps = customProps({
			spreadsheet: {value: true}
		});

		const component = shallow(<ScoreTable {... newProps} />);

		expect(component.instance().state.checked).toBeFalsy();
		component.find(`.show-answer-checkbox`).simulate(`keyDown`, {key: `a`});
		expect(component.instance().state.checked).toBeFalsy();

		//cleanup
		component.unmount();
	});
});

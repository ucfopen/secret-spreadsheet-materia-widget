import React from 'react';
import PlayerTable from './player-table';
import renderer from 'react-test-renderer';
import { mount } from '../enzyme';

const genProps = () => {
	return {
		dimensions: {
			x: 2,
			y: 2
		},
		handleNewAnswer: jest.fn(),
		countBlanks: jest.fn(),
		qset: [
			[
				{
					"materiaType": "question",
					"id": null,
					"type": "QA",
					"questions": [
						{
							"text": "Show 1"
						}
					],
					"answers": [
						{
							"id": null,
							"text": "Show 1",
							"value": 100
						}
					],
					"options": {
						"blank": false
					}
				},
				{
					"materiaType": "question",
					"id": null,
					"type": "QA",
					"questions": [
						{
							"text": "Hide 1"
						}
					],
					"answers": [
						{
							"id": null,
							"text": "Hide 1",
							"value": 100
						}
					],
					"options": {
						"blank": true
					}
				}
			],
			[
				{
					"materiaType": "question",
					"id": null,
					"type": "QA",
					"questions": [
						{
							"text": "Hide 2"
						}
					],
					"answers": [
						{
							"id": null,
							"text": "Hide 2",
							"value": 100
						}
					],
					"options": {
						"blank": true
					}
				},
				{
					"materiaType": "question",
					"id": null,
					"type": "QA",
					"questions": [
						{
							"text": "Show 2"
						}
					],
					"answers": [
						{
							"id": null,
							"text": "Show 2",
							"value": 100
						}
					],
					"options": {
						"blank": false
					}
				}
			]
		],
		parentAnswers: {}
	}
}

const noRandProps = () => {
	const props = {
		randPositions: new Set([]),
		randCount: 0
	}
	Object.assign(props, genProps());

	return props;
}

const makeProps = (leftAlign, header, spreadsheet) => {
	const props = {
		leftAlign: leftAlign,
		header: header,
		spreadsheet: spreadsheet
	};
	Object.assign(props, noRandProps());

	return props;
}

const runTest = (leftAlign=false, header=false, spreadsheet=false) => {
	const props = makeProps(leftAlign, header, spreadsheet);
	const component = renderer.create(<PlayerTable {... props} />);

	return component.toJSON();
};

describe('PlayerTable component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Rendered with randomness and no header', () => {
		const props = {
			randPositions: new Set([1, 2]),
			randCount: 2,
			leftAlign: false,
			header: false,
			spreadsheet: false
		};
		Object.assign(props, genProps());

		const component = renderer.create(<PlayerTable {... props} />);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Rendered with randomness and a header', () => {
		const props = {
			randPositions: new Set([2]),
			randCount: 1,
			leftAlign: false,
			header: true,
			spreadsheet: false
		};
		Object.assign(props, genProps());

		const component = renderer.create(<PlayerTable {... props} />);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	// no more randomness past this point
	test('Rendered leftAligned, no header, no labels', () => {
		const tree = runTest(true, false, false);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered leftAligned, with header, no labels', () => {
		const tree = runTest(true, true, false);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered leftAligned, no header, with labels', () => {
		const tree = runTest(true, false, true);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered leftAligned, with header, with labels', () => {
		const tree = runTest(true, true, true);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered centered, with header, no labels', () => {
		const tree = runTest(false, true, false);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered centered, with header, with labels', () => {
		const tree = runTest(false, true, true);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered centered, no header, no labels', () => {
		const tree = runTest(false, false, false);
		expect(tree).toMatchSnapshot();
	});

	test('Rendered centered, no header, with labels', () => {
		const tree = runTest(false, false, true);
		expect(tree).toMatchSnapshot();
	});

	test('onClick function no answer record', () => {
		const props = makeProps(false, false, false);
		const event = {
			target: {
				value: 'Test',
				id: '1'
			}
		}

		const tempComponent = mount(<PlayerTable {... props} />);
		tempComponent.instance().saveAnswer(event);

		const propsWithAnswer = props.parentAnswers;
		propsWithAnswer[event.target.id] = event.target.value;

		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledTimes(1);
		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledWith(propsWithAnswer, true, false);

		// cleanup
		tempComponent.unmount();
	});

	test('onClick function with blank answer record', () => {
		const props = makeProps(false, false, false);
		props.parentAnswers['1'] = '';

		const event = {
			target: {
				value: 'Test',
				id: '1'
			}
		}

		const tempComponent = mount(<PlayerTable {... props} />);
		tempComponent.instance().saveAnswer(event);

		const propsWithAnswer = props.parentAnswers;
		propsWithAnswer[event.target.id] = event.target.value;

		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledTimes(1);
		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledWith(propsWithAnswer, true, false);

		// cleanup
		tempComponent.unmount();
	});

	test('onClick function with filled answer record', () => {
		const props = makeProps(false, false, false);
		props.parentAnswers['1'] = 'Not Test';

		const event = {
			target: {
				value: 'Test',
				id: '1'
			}
		}

		const tempComponent = mount(<PlayerTable {... props} />);
		tempComponent.instance().saveAnswer(event);

		const propsWithAnswer = props.parentAnswers;
		propsWithAnswer[event.target.id] = event.target.value;

		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledTimes(1);
		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledWith(propsWithAnswer, false, false);

		// cleanup
		tempComponent.unmount();
	});

	test('onClick function with filled answer record', () => {
		const props = makeProps(false, false, false);
		props.parentAnswers['1'] = 'Not Test';

		const event = {
			target: {
				value: '',
				id: '1'
			}
		}

		const tempComponent = mount(<PlayerTable {... props} />);
		tempComponent.instance().saveAnswer(event);

		const propsWithAnswer = props.parentAnswers;
		propsWithAnswer[event.target.id] = event.target.value;

		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledTimes(1);
		expect(tempComponent.prop('handleNewAnswer')).toHaveBeenCalledWith(propsWithAnswer, false, true);

		// cleanup
		tempComponent.unmount();
	});
});
import React from 'react';
import PlayerTable from './player-table.js';
import renderer from 'react-test-renderer';

const functionMock = () => {
	return;
}

const genProps = {
	dimensions: {
		x: 2,
		y: 2
	},
	handleNewAnswer: functionMock,
	countBlanks: functionMock,
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
	parentAnswers: {},
}

const noRandProps = {
	randPositions: new Set([]),
	randCount: 0
}
Object.assign(noRandProps, genProps);

const makeProps = (leftAlign, header, spreadsheet) => {
	const props = {
		leftAlign: leftAlign,
		header: header,
		spreadsheet: spreadsheet
	};
	Object.assign(props, noRandProps);

	return props;
}

const testComponent = props => {
	const component = renderer.create(<PlayerTable {... props} />);
	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
}

const runTest = (leftAlign=false, header=false, spreadsheet=false) => {
	const props = makeProps(leftAlign, header, spreadsheet);
	testComponent(props);
};

// randPositions and randCount, left align, header, and spreadsheet need to be tested
// header, left align, and spreadsheet are interconnected
// test header with randomness and without
describe('PlayerTable component', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('PlayerTable is rendered with randomness and no header', () => {
		const props = {
			randPositions: new Set([1, 2]),
			randCount: 2,
			leftAlign: false,
			header: false,
			spreadsheet: false
		};
		Object.assign(props, genProps);

		testComponent(props);
	});

	test('PlayerTable is rendered with randomness and a header', () => {
		const props = {
			randPositions: new Set([2]),
			randCount: 1,
			leftAlign: false,
			header: true,
			spreadsheet: false
		};
		Object.assign(props, genProps);

		testComponent(props);
	});

	// no more randomness past this point
	test('PlayerTable is rendered leftAligned, no header, no spreadsheet', () => {
		runTest(true);
	});

	test('PlayerTable is rendered leftAligned, with header, no spreadsheet', () => {
		runTest(true, true);
	});

	test('PlayerTable is rendered leftAligned, no header, with spreadsheet', () => {
		runTest(true, false, true);
	});

	test('PlayerTable is rendered leftAligned, with header, with spreadsheet', () => {
		runTest(true, true, true);
	});

	test('PlayerTable is rendered centered, no header, no spreadsheet', () => {
		runTest();
	});

	test('PlayerTable is rendered centered, with header, no spreadsheet', () => {
		runTest(false, true);
	});

	test('PlayerTable is rendered centered, no header, with spreadsheet', () => {
		runTest(false, false, true);
	});

	test('PlayerTable is rendered centered, with header, with spreadsheet', () => {
		runTest(false, true, true);
	});
});

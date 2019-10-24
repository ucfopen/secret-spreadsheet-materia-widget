import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from './enzyme';
import ReactDOM from 'react-dom';

const mockDomRender = jest.fn();

const qset = () => {
	return {
		"left": false,
		"header": false,
		"spreadsheet": false,
		"dimensions": {
			"rows": 2,
			"columns": 2
		},
		"randomization": 0,
		"question": `Test Question`,
		"description": `Test question body`,
		"items": [
			{
				"items": [
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
				]
			}
		]
	};
};

const scoreTable = () => {
	return [
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
	];
};

const genProps = () => {
	return {
		qset: qset(),
		scoreTable: scoreTable(),
		title: `Test Title`
	};
};

const makeNewScoreScreen = (changes={}) => {
	const ScoreScreenApp = require(`./scoreScreen`).default;

	const props = genProps();
	Object.defineProperties(props, changes);

	return shallow(<ScoreScreenApp {... props} />);
};

const renderScoreScreen = (changes={}) => {
	const ScoreScreenApp = require(`./scoreScreen`).default;

	const props = genProps();
	Object.defineProperties(props, changes);

	return renderer.create(<ScoreScreenApp {... props} />);
};

describe(`ScoreScreen`, () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
		jest.unmock(`react-dom`);
		global.Materia = {
			ScoreCore: {
				start: jest.fn(),
				update: jest.fn(),
				hideResultsTable: jest.fn()
			}
		};
	});

	test(`Registers callbacks`, () => {
		require(`./scorescreen`);
		jest.mock(`react-dom`, () => {
			jest.fn();
		});

		expect(Materia.ScoreCore.start).toHaveBeenCalledTimes(1);
		const callbacks = Materia.ScoreCore.start.mock.calls[0][0];
		expect(callbacks).toHaveProperty(`start`, expect.any(Function));
	});

	test(`Render called with correct props on start`, () => {
		require(`./scoreScreen`);
		jest.mock(`react-dom`, () => ({
			render: mockDomRender
		}));

		const start = Materia.ScoreCore.start.mock.calls[0][0].start;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: `Test Score`}, qset(), scoreTable(), false, 1);
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();
	});

	test(`Render called with correct props on update`, () => {
		require(`./scoreScreen`);
		jest.mock(`react-dom`, () => ({
			render: mockDomRender
		}));

		// have to start first
		const start = Materia.ScoreCore.start.mock.calls[0][0].start;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: `Test Score`}, qset(), scoreTable(), false, 1);
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();

		const update = Materia.ScoreCore.start.mock.calls[0][0].update;

		expect(mockDomRender).toHaveBeenCalledTimes(1);
		update(qset(), scoreTable());
		expect(mockDomRender).toHaveBeenCalledTimes(2);
		expect(mockDomRender.mock.calls[1][0]).toMatchSnapshot();
	});

	test(`Render with question and description`, () => {
		const scoreScreen = renderScoreScreen();
		const tree = scoreScreen.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Render without description`, () => {
		const newQset = qset();
		newQset.description = ``;

		const scoreScreen = renderScoreScreen({
			qset: {value: newQset}
		});
		const tree = scoreScreen.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`Render without question or description`, () => {
		const newQset = qset();
		newQset.question = ``;
		newQset.description = ``;

		const scoreScreen = renderScoreScreen({
			qset: {value: newQset}
		});
		const tree = scoreScreen.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test(`makePositionList adds the positions successfully`, () => {
		const scoreScreen = makeNewScoreScreen();
		const testSet = scoreScreen.instance().makePositionList(scoreTable());

		expect(testSet.has(`row0 column1`)).toBeTruthy();
		expect(testSet.has(`row1 column0`)).toBeTruthy();

		// cleanup
		scoreScreen.unmount();
	});
});

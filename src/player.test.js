import React from 'react';
import renderer from 'react-test-renderer';

const mockDomRender = jest.fn();
jest.mock('react-dom', () => ({
	render: mockDomRender,
}));

const qset = {
	"left": false,
	"header": false,
	"spreadsheet": false,
	"dimensions": {
		"x": 2,
		"y": 2
	},
	"randomization": 0,
	"items": [
		{
			"items": [
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
			]
		}
	]
}

describe('Player', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
		global.Materia = {
			Engine: {
				start: jest.fn()
			}
		};
	});

	test('Player registers callbacks', () => {
		require('./player');
		expect(Materia.Engine.start).toHaveBeenCalledTimes(1);
		const callbacks = Materia.Engine.start.mock.calls.pop()[0];
		expect(callbacks).toHaveProperty('start', expect.any(Function));
	});

	test('Player renders with no randomization', () => {
		require('./player');
		const start = Materia.Engine.start.mock.calls.pop()[0].start;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: 'Test Widget'}, qset);
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();
	});

	test('Player renders with randomization', () => {
		require('./player');
		const start = Materia.Engine.start.mock.calls.pop()[0].start;

		const newQset = qset;
		newQset.randomization = 2;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: 'Test Widget'}, newQset);
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();
	});
});

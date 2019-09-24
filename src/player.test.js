import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from './enzyme'
import ReactDOM from 'react-dom';

const mockDomRender = jest.fn();

const qset = () => {
	return {
		"left": false,
		"header": false,
		"spreadsheet": false,
		"dimensions": {
			"x": 2,
			"y": 2
		},
		"randomization": 0,
		"entryQuestion": "Test Question",
		"questionBody": "Test question body",
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
	};
};

const genProps = () => {
	const tempQset = qset();
	return {
		title: 'Test Widget',
		dimensions: tempQset.dimensions,
		qset: tempQset.items[0].items,
		randCount: tempQset.randomization,
		leftAlign: tempQset.left,
		header: tempQset.header,
		spreadsheet: tempQset.spreadsheet,
		entryQuestion: tempQset.entryQuestion,
		questionBody: tempQset.questionBody
	};
};

const makeNewPlayer = (changes={}) => {
	const PlayerApp = require('./player').default;

	const props = genProps();
	Object.defineProperties(props, changes);

	return shallow(<PlayerApp {... props} />);
};

describe('Player', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
		jest.unmock('react-dom');
		global.Materia = {
			Engine: {
				start: jest.fn(),
				end: jest.fn()
			},
			Score: {
				submitQuestionForScoring: jest.fn()
			}
		};
	});

	test('Registers callbacks', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: jest.fn()
		}));

		expect(Materia.Engine.start).toHaveBeenCalledTimes(1);
		const callbacks = Materia.Engine.start.mock.calls[0][0];
		expect(callbacks).toHaveProperty('start', expect.any(Function));
	});

	test('Render called with correct props no randomization', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: 'Test Widget'}, qset());
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();
	});

	test('Render called with correct props with randomization', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;
		const newQset = qset();
		newQset.randomization = 2;

		expect(mockDomRender).toHaveBeenCalledTimes(0);
		start({name: 'Test Widget'}, newQset);
		expect(mockDomRender).toHaveBeenCalledTimes(1);
		expect(mockDomRender.mock.calls[0][0]).toMatchSnapshot();
	});

	// can't test rendering with randomization because it is changed every time
	// randomization function test will ensure the randomization is working
	test('Render without randomization', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;
		start({name: 'Test Widget'}, qset());
		const playerComponent = mockDomRender.mock.calls[0][0];

		const component = renderer.create(playerComponent);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Render with question and body', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;
		start({name: 'Test Widget'}, qset());
		const playerComponent = mockDomRender.mock.calls[0][0];

		const component = renderer.create(playerComponent);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Render with question and no body', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;
		const newQset = qset();
		newQset.questionBody = '';
		start({name: 'Test Widget'}, newQset);
		const playerComponent = mockDomRender.mock.calls[0][0];

		const component = renderer.create(playerComponent);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Render with no question', () => {
		require('./player');
		jest.mock('react-dom', () => ({
			render: mockDomRender
		}));

		const start = Materia.Engine.start.mock.calls[0][0].start;
		const newQset = qset();
		newQset.entryQuestion = '';
		newQset.questionBody = '';
		start({name: 'Test Widget'}, newQset);
		const playerComponent = mockDomRender.mock.calls[0][0];

		const component = renderer.create(playerComponent);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('submitAnswer given user entered answer', () => {
		const mockPlayer = makeNewPlayer();
		mockPlayer.instance().answers['0-input'] = 'TestAnswer';

		mockPlayer.instance().submitAnswer(1, 0);

		expect(Materia.Score.submitQuestionForScoring).toHaveBeenCalledTimes(1);
		expect(Materia.Score.submitQuestionForScoring).toHaveBeenCalledWith(1, 'TestAnswer');

		// cleanup
		mockPlayer.unmount();
	});

	test('submitAnswer given no user input', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.instance().submitAnswer(1, 0);

		expect(Materia.Score.submitQuestionForScoring).toHaveBeenCalledTimes(1);
		expect(Materia.Score.submitQuestionForScoring).toHaveBeenCalledWith(1, '');

		// cleanup
		mockPlayer.unmount();
	});

	test('handleSubmit works without randomization', () => {
		const event = {
			preventDefault: jest.fn()
		}
		const mockPlayer = makeNewPlayer();
		mockPlayer.instance().submitAnswer = jest.fn();

		mockPlayer.instance().handleSubmit(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(mockPlayer.instance().submitAnswer).toHaveBeenCalledTimes(2);
		expect(mockPlayer.instance().submitAnswer).toHaveBeenNthCalledWith(1, null, 1);
		expect(mockPlayer.instance().submitAnswer).toHaveBeenNthCalledWith(2, null, 2);
		expect(Materia.Engine.end).toHaveBeenCalled();

		// cleanup
		mockPlayer.unmount();
	});

	test('handleSubmit works with randomization', () => {
		const event = {
			preventDefault: jest.fn()
		}
		const mockPlayer = makeNewPlayer({randCount: {value: 2}});
		mockPlayer.instance().submitAnswer = jest.fn();
		mockPlayer.instance().blankPositions = new Set([1, 2]);

		mockPlayer.instance().handleSubmit(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(mockPlayer.instance().submitAnswer).toHaveBeenCalledTimes(2);
		expect(mockPlayer.instance().submitAnswer).toHaveBeenNthCalledWith(1, null, 1);
		expect(mockPlayer.instance().submitAnswer).toHaveBeenNthCalledWith(2, null, 2);
		expect(Materia.Engine.end).toHaveBeenCalled();
	});

	test('handleNewAnswer adding new answer from blank to filled', () => {
		const mockPlayer = makeNewPlayer();
		const newAnswers = {'TestID': 'TestAnswer'};

		mockPlayer.setState({
			popup: false,
			answered: 0
		});
		mockPlayer.instance().blankPositions.add(1);

		mockPlayer.instance().handleNewAnswer(newAnswers, true, false);

		expect(mockPlayer.instance().answers.hasOwnProperty('TestID')).toBeTruthy();
		expect(mockPlayer.instance().answers.TestID).toBe('TestAnswer');
		expect(mockPlayer.state(['popup'])).toBeFalsy();
		expect(mockPlayer.state(['answered'])).toBe(1);

		// cleanup
		mockPlayer.unmount();
	});

	test('handleNewAnswer removing an answer from filled to blank', () => {
		const mockPlayer = makeNewPlayer();
		const newAnswers = {'TestID': ''};

		mockPlayer.setState({
			popup: false,
			answered: 1
		});

		mockPlayer.instance().handleNewAnswer(newAnswers, false, true);

		expect(mockPlayer.instance().answers.hasOwnProperty('TestID')).toBeTruthy();
		expect(mockPlayer.instance().answers.TestID).toBe('');
		expect(mockPlayer.state(['popup'])).toBeFalsy();
		expect(mockPlayer.state(['answered'])).toBe(0);

		// cleanup
		mockPlayer.unmount();
	});

	test('handleNewAnswer changing an answer', () => {
		const mockPlayer = makeNewPlayer();
		const newAnswers = {'TestID': 'Changed'};

		mockPlayer.setState({
			popup: false,
			answered: 1
		});
		mockPlayer.instance().answers = {'TestID': 'Original'};

		mockPlayer.instance().handleNewAnswer(newAnswers, false, false);

		expect(mockPlayer.instance().answers.hasOwnProperty('TestID')).toBeTruthy();
		expect(mockPlayer.instance().answers.TestID).toBe('Changed');
		expect(mockPlayer.state(['popup'])).toBeFalsy();
		expect(mockPlayer.state(['answered'])).toBe(1);
	});

	test('handleNewAnswer is given both empty to full and full to empty answers', () => {
		const mockPlayer = makeNewPlayer();
		const newAnswers = {};

		// capture errors so that it doesn't go to the console
		const realError = console.error;
		console.error = jest.fn();

		mockPlayer.instance().handleNewAnswer(newAnswers, true, true);

		expect(console.error).toHaveBeenCalled();

		// cleanup
		console.error = realError;
		mockPlayer.unmount();
	});

	test('handlePopupToggle is correctly toggled off', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.setState({
			popup: true,
			answered: 0
		});
		mockPlayer.instance().handlePopupToggle();

		expect(mockPlayer.state(['popup'])).toBeFalsy();

		// cleanup
		mockPlayer.unmount();
	});

	test('handlePopupToggle is toggled on', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.setState({
			popup: false,
			answered: 0
		});
		mockPlayer.instance().handlePopupToggle();

		expect(mockPlayer.state(['popup'])).toBeTruthy();

		// cleanup
		mockPlayer.unmount();
	});

	test('handleQuestionToggle is toggled off', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.setState({
			question: true,
			showQuestion: true
		});
		mockPlayer.instance().handleQuestionToggle();

		expect(mockPlayer.state(['showQuestion'])).toBeFalsy();

		// cleanup
		mockPlayer.unmount();
	});

	test('handleQuestionToggle is toggled on', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.setState({
			question: true,
			showQuestion: false
		});
		mockPlayer.instance().handleQuestionToggle();

		expect(mockPlayer.state(['showQuestion'])).toBeTruthy();

		// cleanup
		mockPlayer.unmount();
	});

	test('randomize works without header', () => {
		const mockPlayer = makeNewPlayer({randCount: {value: 2}});
		mockPlayer.instance().blankPositions = new Set();

		mockPlayer.instance().randomize();

		expect(mockPlayer.instance().blankPositions.size).toBe(2);

		// cleanup
		mockPlayer.unmount();
	});

	test('randomize works with header', () => {
		const mockPlayer = makeNewPlayer({
			randCount: {value: 1},
			header: {value: true}
		});
		mockPlayer.instance().blankPositions = new Set();

		mockPlayer.instance().randomize();

		expect(mockPlayer.instance().blankPositions.size).toBe(1);
		expect(mockPlayer.instance().blankPositions.has(0)).toBeFalsy();
		expect(mockPlayer.instance().blankPositions.has(1)).toBeFalsy();

		// cleanup
		mockPlayer.unmount();
	});

	test('countBlanks called and added', () => {
		const mockPlayer = makeNewPlayer();

		mockPlayer.instance().countBlanks(1);

		expect(mockPlayer.instance().blankPositions.has(1)).toBeTruthy();

		// cleanup
		mockPlayer.unmount();
	});
});

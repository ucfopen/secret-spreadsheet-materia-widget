<?php
/**
 * @group App
 * @group Materia
 * @group Score
 * @group SecretSpreadsheet
 */
class Test_Score_Modules_SecretSpreadsheet extends \Basetest {
	protected function _get_qset() {
		return json_decode('{
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
		}');
	}

	protected function _make_widget($partial = 'false')
	{
		$this->_asAuthor();

		$title = 'SPREADSHEET SCORE MODULES TEST';
		$widget_id = $this->_find_widget_id('Spreadsheet');
		$qset = (object) ['version' => 1, 'data' => $this->_get_qset()];

		return \Materia\Api::widget_instance_save($widget_id, $title, $qset, false);
	}

	public function test_check_answer()
	{
		$this->_test_full_credit();
		$this->_test_partial_credit();
		$this->_test_no_credit();
	}

	protected function _test_full_credit()
	{
		$inst = $this->_make_widget('false');
		$play_session = \Materia\Api::session_play_create($inst->id);
		$qset = \Materia\Api::question_set_get($inst->id, $play_session);

		$log1 = json_decode('{
			"text":"Hide 1",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');
		$log2 = json_decode('{
			"text":"Hide 2",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');

		$output = \Materia\Api::play_logs_save($play_session, array($log1, $log2));
		$scores = \Materia\Api::widget_instance_scores_get($inst->id);
		$this_score = \Materia\Api::widget_instance_play_scores_get($play_session);

		$this->assertInternalType('array', $this_score);
		$this->assertEquals(100, $this_score[0]['overview']['score']);
	}

	protected function _test_partial_credit()
	{
		$inst = $this->_make_widget('false');
		$play_session = \Materia\Api::session_play_create($inst->id);
		$qset = \Materia\Api::question_set_get($inst->id, $play_session);

		$log1 = json_decode('{
			"text":"Hide 1",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');
		$log2 = json_decode('{
			"text":"Wrong Text",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');

		$output = \Materia\Api::play_logs_save($play_session, array($log1, $log2));
		$scores = \Materia\Api::widget_instance_scores_get($inst->id);
		$this_score = \Materia\Api::widget_instance_play_scores_get($play_session);

		$this->assertInternalType('array', $this_score);
		$this->assertEquals(50, $this_score[0]['overview']['score']);
	}

	protected function _test_no_credit()
	{
		$inst = $this->_make_widget('false');
		$play_session = \Materia\Api::session_play_create($inst->id);
		$qset = \Materia\Api::question_set_get($inst->id, $play_session);

		$log1 = json_decode('{
			"text":"Wrong Text 1",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');
		$log2 = json_decode('{
			"text":"Wrong Text 2",
			"type":1004,
			"value":"",
			"item_id":"'.$qset->data['qset']['data']['items'][0]['id'].'",
			"game_time":10
		}');

		$output = \Materia\Api::play_logs_save($play_session, array($log1, $log2));
		$scores = \Materia\Api::widget_instance_scores_get($inst->id);
		$this_score = \Materia\Api::widget_instance_play_scores_get($play_session);

		$this->assertInternalType('array', $this_score);
		$this->assertEquals(50, $this_score[0]['overview']['score']);
	}
}

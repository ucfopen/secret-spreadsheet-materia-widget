<?php
namespace Materia;

class Score_Modules_SecretSpreadsheet extends Score_Module
{
	public function check_answer($log)
	{
		if (isset($this->questions[$log->item_id]))
		{
			$question = $this->questions[$log->item_id];

			if (strcmp(strtoupper($question->answers[0]['text']), strtoupper($log->text)) === 0) {
				return $question->answers[0]['value'];
			}
		}
		return 0;
	}

	protected function details_for_question_answered($log)
	{
		$q     = $this->questions[$log->item_id];
		$score = $this->check_answer($log);

		return [
			'data' => [
				$this->get_ss_question($log, $q),
				$this->get_ss_answer($log, $q),
				$this->get_ss_expected_answers($log, $q),
				$this->get_ss_position($log, $q)
			],
			'data_style'    => ['question', 'response', 'answer', 'position'],
			'score'         => $score,
			'feedback'      => $this->get_feedback($log, $q->answers),
			'type'          => $log->type,
			'style'         => $this->get_detail_style($score),
			'tag'           => 'div',
			'symbol'        => '%',
			'graphic'       => 'score',
			'display_score' => true
		];
	}

	protected function get_ss_position($log, $question)
	{
		return $question->options['position'];
	}
}

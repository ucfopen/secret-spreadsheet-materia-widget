<?php
namespace Materia;

class Score_Modules_Spreadsheet extends Score_Module
{
	public function check_answer($log)
	{
		if (isset($this->questions[$log->item_id]))
		{
			$question = $this->questions[$log->item_id];

			if (strcmp($question->answers[0]['text'], $log->text) === 0) {
				return $question->answers[0]['value'];
			}
		}
		return 0;
	}
}

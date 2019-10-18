<?php
namespace Materia;

class Score_Modules_SpreadsheetWidget extends Score_Module
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
}

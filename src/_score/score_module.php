<?php
namespace Materia;

class Score_Modules_SpreadsheetWidget extends Score_Module
{
    public function check_answer($log)
    {
        trace("item_id: $log->item_id");
        if (isset($this->questions[$log->item_id]))
        {
            trace("\n\nin check_answer in if\n\n");
            $question = $this->questions[$log->item_id];
            $question_text = $question['text'];
            $answer = $question->answers[0];
            $submitted = $this->log->text;
            trace("\n\nquestion: $question_text submitted: $submitted\n\n");

            if (strcmp($answer['text'], $submitted) === 0) {
                return $answer['value'];
            }
        }
        trace("\nbefore return\n");
        return 0;
    }
}

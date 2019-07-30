<?php
namespace Materia;

class Score_Modules_SpreadsheetWidget extends Score_Module
{
    public function check_answer($log)
    {
        if (isset($this->questions[$log->item_id]))
        {
            $question = $this->questions[$log->item_id];
            foreach ($question->answers as $answer)
            {
                if ($log->text == $answer['text'])
                {
                    return $answer['value'];
                    break;
                }
            }
        }

        return 0;
    }
}

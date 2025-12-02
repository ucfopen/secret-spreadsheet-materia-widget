from scoring.module import ScoreModule


class SecretSpreadsheet(ScoreModule):

    def check_answer(self, log):
        question = self.get_question_by_item_id(log.item_id)

        if question:
            if question["answers"][0]["text"].upper() == log.text.upper():
                return question["answers"][0]["value"]

        return 0

    def details_for_question_answered(self, log):
        q = self.get_question_by_item_id(log.item_id)
        score = self.check_answer(log)

        return {
            "data": [
                self.get_ss_question(log, q),
                self.get_ss_answer(log, q),
                self.get_ss_expected_answers(log, q),
                self.get_ss_position(log, q)
            ],
            "data_style": ["question", "response", "answer", "position"],
            "score": score,
            "feedback": self.get_feedback(log, q["answers"]),
            "type": log.log_type,
            "style": self.get_detail_style(score),
            "tag": "div",
            "symbol": "%",
            "graphic": "score",
            "display_score": True
        }

    def get_ss_position(self, log, question):
        column = question["options"]["position"]["column"]
        row = question["options"]["position"]["row"]

        return f"row{row} column{column}"

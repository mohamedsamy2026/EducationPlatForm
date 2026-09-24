import questions from "../date/questions";

export async function getQuestionsByExamId(examId) {
  return questions
    .filter(
      (question) =>
        String(question.examId) === String(examId),
    )
    .sort((a, b) => a.order - b.order);
}
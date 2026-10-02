import { v4 as uuidv4 } from "uuid";

import questions from "../data/questions";

function byOrder(a, b) {
  return a.order - b.order;
}

function renumber(examId) {
  questions
    .filter((question) => String(question.examId) === String(examId))
    .sort(byOrder)
    .forEach((question, index) => {
      question.order = index + 1;
    });
}

export async function getQuestionsByExamId(examId) {
  return questions.filter((question) => String(question.examId) === String(examId)).sort(byOrder);
}

// خدمات لوحة المستر
export async function getAllQuestions() {
  return questions.map((question) => ({ ...question }));
}

export async function getQuestionById(questionId) {
  const question = questions.find((item) => String(item.id) === String(questionId));

  return question ? { ...question } : null;
}

export async function createQuestion(examId, data) {
  const nextOrder =
    Math.max(
      0,
      ...questions
        .filter((question) => String(question.examId) === String(examId))
        .map((question) => question.order),
    ) + 1;

  const question = { id: `question-${uuidv4().slice(0, 8)}`, examId, order: nextOrder, ...data };

  questions.push(question);

  return { ...question };
}

export async function createQuestions(examId, list) {
  const created = [];

  for (const data of list) {
    created.push(await createQuestion(examId, data));
  }

  return created;
}

export async function updateQuestion(questionId, patch) {
  const question = questions.find((item) => String(item.id) === String(questionId));

  if (!question) throw new Error("السؤال غير موجود.");

  Object.assign(question, patch);

  return { ...question };
}

export async function deleteQuestion(questionId) {
  const index = questions.findIndex((item) => String(item.id) === String(questionId));

  if (index === -1) return false;

  const [removed] = questions.splice(index, 1);

  renumber(removed.examId);

  return true;
}

export async function moveQuestion(questionId, direction) {
  const question = questions.find((item) => String(item.id) === String(questionId));

  if (!question) throw new Error("السؤال غير موجود.");

  const siblings = questions
    .filter((item) => String(item.examId) === String(question.examId))
    .sort(byOrder);
  const position = siblings.indexOf(question);
  const target = siblings[direction === "up" ? position - 1 : position + 1];

  if (!target) return false;

  [question.order, target.order] = [target.order, question.order];

  return true;
}

export async function deleteQuestionsByExamId(examId) {
  let count = 0;

  for (let index = questions.length - 1; index >= 0; index -= 1) {
    if (String(questions[index].examId) === String(examId)) {
      questions.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

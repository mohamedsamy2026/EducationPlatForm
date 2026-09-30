import { v4 as uuidv4 } from "uuid";

import results from "../data/results";

function toTime(value) {
  return new Date(value).getTime();
}

export async function getResults() {
  return [...results];
}

export async function getResultsByStudentId(studentId) {
  return results.filter(
    (result) => String(result.studentId) === String(studentId),
  );
}

// لو الطالب سلّم الامتحان أكتر من مرة نرجّع أحدث نتيجة
export async function getResultByExamId(examId, studentId) {
  const matches = results.filter(
    (result) =>
      String(result.examId) === String(examId) &&
      (studentId === undefined ||
        String(result.studentId) === String(studentId)),
  );

  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort(
    (a, b) => toTime(b.submittedAt) - toTime(a.submittedAt),
  )[0];
}

export async function getResultById(resultId) {
  return (
    results.find((result) => String(result.id) === String(resultId)) ?? null
  );
}

/*
 * تسجيل تسليم امتحان.
 * - score / total: الدرجة التلقائية (الأسئلة غير المقالية) بنفس منطق صفحة النتيجة.
 * - essayCount / essayTotal: الأسئلة المقالية اللي المستر هيصححها.
 * - status: needs_review لو فيه مقالي، غير كده graded.
 */
export async function submitExamAttempt({
  studentId,
  examId,
  answers = {},
  score = 0,
  totalAutoScore = 0,
  essayCount = 0,
  essayTotal = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  submittedAt = new Date().toISOString(),
}) {
  const newResult = {
    id: `result-${uuidv4()}`,
    studentId,
    examId,
    score,
    total: totalAutoScore,
    correctAnswers,
    incorrectAnswers,
    essayCount,
    essayTotal,
    essayScores: {},
    answers,
    status: essayCount > 0 ? "needs_review" : "graded",
    submittedAt,
  };

  results.push(newResult);

  return newResult;
}

export async function deleteResultsByStudentId(studentId) {
  let deletedCount = 0;
  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (String(results[index].studentId) === String(studentId)) {
      results.splice(index, 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

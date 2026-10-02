import { v4 as uuidv4 } from "uuid";

import results from "../data/results";

function toTime(value) {
  return new Date(value).getTime();
}

export async function getResults() {
  return results.map((result) => ({ ...result }));
}

export async function getResultsByStudentId(studentId) {
  return results.filter((result) => String(result.studentId) === String(studentId));
}

// الامتحان مسموح مرة واحدة فقط، فعمليًا فيه نتيجة واحدة لكل طالب/امتحان
export async function getResultByExamId(examId, studentId) {
  const matches = results.filter(
    (result) =>
      String(result.examId) === String(examId) &&
      (studentId === undefined || String(result.studentId) === String(studentId)),
  );

  if (matches.length === 0) return null;

  return [...matches].sort((a, b) => toTime(b.submittedAt) - toTime(a.submittedAt))[0];
}

export async function getResultById(resultId) {
  return results.find((result) => String(result.id) === String(resultId)) ?? null;
}

export async function hasSubmittedExam(studentId, examId) {
  return results.some(
    (result) =>
      String(result.studentId) === String(studentId) && String(result.examId) === String(examId),
  );
}

/*
 * تسجيل تسليم امتحان (مرة واحدة فقط لكل طالب).
 * - autoScore / autoTotal: درجة الأسئلة التلقائية (اختيار وصح/غلط).
 * - score / total: الدرجة المعروضة، وبتتحدث بعد تصحيح المقالي لتشمل الاتنين.
 * - essayCount / essayTotal / essayScores: بيانات الأسئلة المقالية ودرجات كل سؤال.
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
  if (await hasSubmittedExam(studentId, examId)) {
    throw new Error("تم تسليم هذا الامتحان من قبل، ولا يمكن إعادته.");
  }

  const newResult = {
    id: `result-${uuidv4()}`,
    studentId,
    examId,
    autoScore: score,
    autoTotal: totalAutoScore,
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

// خدمات لوحة المستر
export async function updateResult(resultId, patch) {
  const result = results.find((item) => String(item.id) === String(resultId));

  if (!result) throw new Error("النتيجة غير موجودة.");

  Object.assign(result, patch);

  return { ...result };
}

export async function deleteResult(resultId) {
  const index = results.findIndex((item) => String(item.id) === String(resultId));

  if (index === -1) return false;

  results.splice(index, 1);

  return true;
}

export async function deleteAllResults() {
  const count = results.length;

  results.splice(0, results.length);

  return count;
}

export async function deleteResultsByExamIds(examIds) {
  const ids = new Set(examIds.map(String));
  let count = 0;

  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (ids.has(String(results[index].examId))) {
      results.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

export async function deleteResultsByStudentId(studentId) {
  let count = 0;

  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (String(results[index].studentId) === String(studentId)) {
      results.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

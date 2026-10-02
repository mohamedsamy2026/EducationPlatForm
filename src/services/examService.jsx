import { v4 as uuidv4 } from "uuid";

import exams from "../data/exams";

function isPublished(exam) {
  return exam.published !== false;
}

// خدمات الطالب: المنشور فقط
export async function getExamsByCourseId(courseId) {
  return exams.filter((exam) => String(exam.courseId) === String(courseId) && isPublished(exam));
}

export async function getExamById(examId) {
  return exams.find((exam) => String(exam.id) === String(examId) && isPublished(exam)) ?? null;
}

// خدمات لوحة المستر: كل الامتحانات سواء منشورة أو لا
export async function getExams() {
  return exams.map((exam) => ({ ...exam }));
}

export async function getAnyExamById(examId) {
  const exam = exams.find((item) => String(item.id) === String(examId));

  return exam ? { ...exam } : null;
}

export async function createExam(data) {
  const newExam = {
    id: `exam-${uuidv4().slice(0, 8)}`,
    published: false,
    totalQuestions: 0,
    ...data,
  };

  exams.push(newExam);

  return { ...newExam };
}

export async function updateExam(examId, patch) {
  const exam = exams.find((item) => String(item.id) === String(examId));

  if (!exam) throw new Error("الامتحان غير موجود.");

  Object.assign(exam, patch);

  return { ...exam };
}

export async function deleteExam(examId) {
  const index = exams.findIndex((item) => String(item.id) === String(examId));

  if (index === -1) return false;

  exams.splice(index, 1);

  return true;
}

export async function deleteExamsByCourseId(courseId) {
  const removedIds = [];

  for (let index = exams.length - 1; index >= 0; index -= 1) {
    if (String(exams[index].courseId) === String(courseId)) {
      removedIds.push(exams[index].id);
      exams.splice(index, 1);
    }
  }

  return removedIds;
}

export async function deleteAllExams() {
  const ids = exams.map((exam) => exam.id);

  exams.splice(0, exams.length);

  return ids;
}

// لما وحدة تتحذف، الامتحانات المرتبطة بيها تتحول لمراجعة عامة
export async function detachExamsFromUnit(unitId, fallbackSectionTitle) {
  let count = 0;

  exams.forEach((exam) => {
    if (String(exam.unitId) === String(unitId)) {
      exam.unitId = null;
      exam.sectionTitle = fallbackSectionTitle;
      count += 1;
    }
  });

  return count;
}

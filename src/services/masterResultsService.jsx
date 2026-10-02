import {
  deleteAllResults,
  deleteResult,
  getResultById,
  getResults,
  updateResult,
} from "./resultService";
import { getStudents } from "./studentService";
import { getAllCourses } from "./courseService";
import { getExams } from "./examService";
import { getQuestionsByExamId } from "./questionService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { formatDateTime } from "../utils/formatters";
import { matchesSearch, paginate } from "../utils/paginate";
import {
  QUESTION_TYPE_LABELS,
  RESULT_STATUS_LABELS,
  UNKNOWN_LABEL as UNKNOWN,
  getLabel,
} from "../constants/statusLabels";

function percentOf(score, total) {
  if (!Number(total)) return 0;

  return Math.round((Number(score) / Number(total)) * 100);
}

function isSameLocalDay(value, now = new Date()) {
  const date = new Date(value);

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

async function loadLookups() {
  const [students, exams, courses] = await Promise.all([
    getStudents(),
    getExams(),
    getAllCourses(),
  ]);

  return {
    studentsById: new Map(students.map((item) => [String(item.id), item])),
    examsById: new Map(exams.map((item) => [String(item.id), item])),
    coursesById: new Map(courses.map((item) => [String(item.id), item])),
  };
}

function buildRow(result, { studentsById, examsById, coursesById }) {
  const student = studentsById.get(String(result.studentId));
  const exam = examsById.get(String(result.examId));
  const course = coursesById.get(String(exam?.courseId));
  const status = result.status ?? "graded";

  return {
    id: result.id,
    studentId: result.studentId,
    studentName: student?.name ?? UNKNOWN,
    gradeId: student?.grade ?? "",
    gradeLabel: getGradeLabel(student?.grade),
    examId: result.examId,
    examTitle: exam?.title ?? result.title ?? UNKNOWN,
    courseId: exam?.courseId ?? "",
    courseTitle: course?.title ?? UNKNOWN,
    score: result.score,
    total: result.total,
    percentage: percentOf(result.score, result.total),
    submittedAt: result.submittedAt,
    status,
    statusLabel: getLabel(RESULT_STATUS_LABELS, status),
  };
}

function applyFilters(rows, { search, studentId, courseId, examId, grade, status }) {
  return rows
    .filter((row) => matchesSearch([row.studentName, row.examTitle], search))
    .filter(
      (row) => !studentId || studentId === "all" || String(row.studentId) === String(studentId),
    )
    .filter((row) => !courseId || courseId === "all" || String(row.courseId) === String(courseId))
    .filter((row) => !examId || examId === "all" || String(row.examId) === String(examId))
    .filter((row) => !grade || grade === "all" || String(row.gradeId) === String(grade))
    .filter((row) => !status || status === "all" || row.status === status)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

// ---------------------------------------------------------------------------
// القائمة والإحصائيات
// ---------------------------------------------------------------------------

export async function getMasterResultsSummary() {
  const results = await getResults();

  return {
    total: results.length,
    needsGrading: results.filter((item) => item.status === "needs_review").length,
    graded: results.filter((item) => (item.status ?? "graded") === "graded").length,
    today: results.filter((item) => isSameLocalDay(item.submittedAt)).length,
  };
}

export async function getMasterResultsPage(filters = {}) {
  const { page = 1, pageSize = 15 } = filters;
  const [results, lookups, grades] = await Promise.all([getResults(), loadLookups(), getGrades()]);

  const allRows = results.map((result) => buildRow(result, lookups));
  const rows = applyFilters(allRows, filters);

  const studentIds = [...new Set(allRows.map((row) => String(row.studentId)))];

  return {
    ...paginate(rows, page, pageSize),
    filterOptions: {
      students: studentIds.map((id) => ({
        id,
        label: lookups.studentsById.get(id)?.name ?? UNKNOWN,
      })),
      courses: [...lookups.coursesById.values()].map((course) => ({
        id: course.id,
        label: course.title,
      })),
      exams: [...lookups.examsById.values()].map((exam) => ({ id: exam.id, label: exam.title })),
      grades: grades.map((item) => ({ id: item.id, label: item.label })),
    },
  };
}

// ---------------------------------------------------------------------------
// تصدير CSV
// ---------------------------------------------------------------------------

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function exportMasterResultsCsv(filters = {}) {
  const [results, lookups] = await Promise.all([getResults(), loadLookups()]);
  const rows = applyFilters(
    results.map((result) => buildRow(result, lookups)),
    filters,
  );

  const header = [
    "الطالب",
    "الصف",
    "الامتحان",
    "الكورس",
    "الدرجة",
    "الإجمالي",
    "النسبة",
    "حالة التصحيح",
    "التاريخ",
  ];
  const lines = rows.map((row) =>
    [
      row.studentName,
      row.gradeLabel,
      row.examTitle,
      row.courseTitle,
      row.score,
      row.total,
      `${row.percentage}%`,
      row.statusLabel,
      formatDateTime(row.submittedAt),
    ]
      .map(csvCell)
      .join(","),
  );

  return {
    filename: `results-${new Date().toISOString().slice(0, 10)}.csv`,
    content: [header.map(csvCell).join(","), ...lines].join("\r\n"),
    count: rows.length,
  };
}

// ---------------------------------------------------------------------------
// تفاصيل النتيجة والتصحيح اليدوي
// ---------------------------------------------------------------------------

function answerLabel(question, answer) {
  if (answer === undefined || answer === null || answer === "") return "";

  if (question.type === "multiple-choice") {
    return question.options?.[Number(answer)] ?? String(answer);
  }

  if (question.type === "true-false") {
    return String(answer) === "true" ? "صح" : "خطأ";
  }

  return String(answer);
}

function correctLabel(question) {
  if (question.type === "multiple-choice") return question.options?.[question.correctAnswer] ?? "";
  if (question.type === "true-false") return question.correctAnswer === true ? "صح" : "خطأ";

  return "";
}

export async function getMasterResultDetails(resultId, { page = 1, pageSize = 5 } = {}) {
  const result = await getResultById(resultId);

  if (!result) throw new Error("النتيجة غير موجودة.");

  const [lookups, questions] = await Promise.all([
    loadLookups(),
    getQuestionsByExamId(result.examId),
  ]);
  const row = buildRow(result, lookups);
  const answers = result.answers ?? {};
  const essayScores = result.essayScores ?? {};
  const hasAnswers = result.answers !== undefined;

  const questionRows = questions.map((question, index) => {
    const isEssay = question.type === "essay";
    const answer = answers[question.id];
    const isAnswered = answer !== undefined && answer !== null && answer !== "";
    const isCorrect = !isEssay && isAnswered && String(answer) === String(question.correctAnswer);

    return {
      id: question.id,
      number: index + 1,
      type: question.type,
      typeLabel: getLabel(QUESTION_TYPE_LABELS, question.type),
      text: question.question,
      isEssay,
      maxScore: Number(question.score) || 0,
      isAnswered,
      studentAnswer: answerLabel(question, answer),
      correctAnswer: correctLabel(question),
      isCorrect,
      earnedScore: isEssay
        ? (essayScores[question.id] ?? null)
        : isCorrect
          ? Number(question.score) || 0
          : 0,
    };
  });

  const essayQuestions = questionRows.filter((item) => item.isEssay);
  const essayEarned = essayQuestions.reduce(
    (total, item) => total + (Number(item.earnedScore) || 0),
    0,
  );

  return {
    header: {
      ...row,
      hasAnswers,
      autoScore: result.autoScore ?? result.score,
      autoTotal: result.autoTotal ?? result.total,
      essayEarned,
      essayTotal: essayQuestions.reduce((total, item) => total + item.maxScore, 0),
      essayCount: essayQuestions.length,
      gradedEssays: essayQuestions.filter((item) => item.earnedScore !== null).length,
    },
    ...paginate(hasAnswers ? questionRows : [], page, pageSize),
  };
}

// scores: { [questionId]: number } للأسئلة المقالية فقط
export async function saveMasterResultGrades(resultId, scores) {
  const result = await getResultById(resultId);

  if (!result) throw new Error("النتيجة غير موجودة.");

  const questions = await getQuestionsByExamId(result.examId);
  const essayQuestions = questions.filter((question) => question.type === "essay");
  const essayScores = { ...(result.essayScores ?? {}) };

  for (const [questionId, rawValue] of Object.entries(scores)) {
    const question = essayQuestions.find((item) => String(item.id) === String(questionId));

    if (!question) throw new Error("سؤال غير مقالي أو غير موجود.");

    if (rawValue === "" || rawValue === null || rawValue === undefined) continue;

    const value = Number(rawValue);

    if (Number.isNaN(value) || value < 0 || value > Number(question.score)) {
      throw new Error(`درجة السؤال لازم تكون بين 0 و ${question.score}.`);
    }

    essayScores[questionId] = value;
  }

  const autoScore = result.autoScore ?? result.score;
  const autoTotal = result.autoTotal ?? result.total;
  const essayTotal = essayQuestions.reduce(
    (total, question) => total + (Number(question.score) || 0),
    0,
  );
  const essayEarned = essayQuestions.reduce(
    (total, question) => total + (Number(essayScores[question.id]) || 0),
    0,
  );
  const allGraded =
    essayQuestions.length > 0 &&
    essayQuestions.every((question) => essayScores[question.id] !== undefined);

  await updateResult(resultId, {
    autoScore,
    autoTotal,
    essayScores,
    essayTotal,
    score: autoScore + essayEarned,
    total: autoTotal + essayTotal,
    status: allGraded ? "graded" : "needs_review",
  });

  return { status: allGraded ? "graded" : "needs_review" };
}

// ---------------------------------------------------------------------------
// الحذف: بيحذف النتائج فقط (الطالب والامتحان والأسئلة بتفضل)
// ---------------------------------------------------------------------------

export async function deleteMasterResult(resultId) {
  if (!(await deleteResult(resultId))) throw new Error("النتيجة غير موجودة.");

  return { ok: true };
}

export async function deleteAllMasterResults() {
  return { deletedResults: await deleteAllResults() };
}

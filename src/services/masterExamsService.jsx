import {
  createExam,
  deleteAllExams,
  deleteExam,
  getAnyExamById,
  getExams,
  updateExam,
} from "./examService";
import {
  createQuestion,
  createQuestions,
  deleteQuestion,
  deleteQuestionsByExamId,
  getAllQuestions,
  getQuestionById,
  getQuestionsByExamId,
  moveQuestion,
  updateQuestion,
} from "./questionService";
import { deleteResultsByExamIds, getResults } from "./resultService";
import { getAllCourses, getAnyCourseById } from "./courseService";
import { getAllUnitsByCourseId } from "./lessonService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { toDateTimeLocal } from "../utils/formatters";
import { matchesSearch, paginate } from "../utils/paginate";
import {
  EXAM_TIME_STATUS_LABELS,
  PUBLISH_STATUS_LABELS,
  QUESTION_TYPE_LABELS,
  getLabel,
} from "../constants/statusLabels";

const GENERAL_REVIEW_TITLE = "مراجعة عامة";
const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABELS);

function requireText(value, message) {
  const text = String(value ?? "").trim();

  if (!text) throw new Error(message);

  return text;
}

// حالة الوقت بتتحسب تلقائيًا من البداية والنهاية (مش بتتختار يدويًا)
export function getExamTimeStatus(exam, now = Date.now()) {
  if (now < new Date(exam.startsAt).getTime()) return "upcoming";
  if (now > new Date(exam.endsAt).getTime()) return "ended";

  return "open";
}

async function syncTotalQuestions(examId) {
  const questions = await getQuestionsByExamId(examId);

  await updateExam(examId, { totalQuestions: questions.length });
}

function sumScores(questions) {
  return questions.reduce((total, question) => total + (Number(question.score) || 0), 0);
}

// ---------------------------------------------------------------------------
// قائمة الامتحانات
// ---------------------------------------------------------------------------

export async function getMasterExamsSummary() {
  const [exams, results] = await Promise.all([getExams(), getResults()]);

  return {
    total: exams.length,
    published: exams.filter((exam) => exam.published !== false).length,
    ended: exams.filter((exam) => getExamTimeStatus(exam) === "ended").length,
    needsGrading: results.filter((result) => result.status === "needs_review").length,
  };
}

export async function getMasterExamsPage({
  search = "",
  courseId = "all",
  grade = "all",
  publishStatus = "all",
  page = 1,
  pageSize = 8,
} = {}) {
  const [exams, courses, questions, results, grades] = await Promise.all([
    getExams(),
    getAllCourses(),
    getAllQuestions(),
    getResults(),
    getGrades(),
  ]);

  const coursesById = new Map(courses.map((course) => [String(course.id), course]));

  const rows = exams
    .map((exam) => {
      const course = coursesById.get(String(exam.courseId));
      const examQuestions = questions.filter(
        (question) => String(question.examId) === String(exam.id),
      );
      const timeStatus = getExamTimeStatus(exam);
      const publishState = exam.published !== false ? "published" : "draft";

      return {
        id: exam.id,
        title: exam.title,
        courseId: exam.courseId,
        courseTitle: course?.title ?? "كورس محذوف",
        gradeId: course?.grade ?? "",
        gradeLabel: course ? getGradeLabel(course.grade) : "غير محدد",
        sectionTitle: exam.sectionTitle || GENERAL_REVIEW_TITLE,
        questionsCount: examQuestions.length,
        totalScore: sumScores(examQuestions),
        durationMinutes: exam.durationMinutes,
        startsAt: exam.startsAt,
        endsAt: exam.endsAt,
        publishStatus: publishState,
        publishLabel: getLabel(PUBLISH_STATUS_LABELS, publishState),
        timeStatus,
        timeLabel: getLabel(EXAM_TIME_STATUS_LABELS, timeStatus),
        needsGradingCount: results.filter(
          (result) => String(result.examId) === String(exam.id) && result.status === "needs_review",
        ).length,
      };
    })
    .filter((row) => courseId === "all" || String(row.courseId) === String(courseId))
    .filter((row) => grade === "all" || String(row.gradeId) === String(grade))
    .filter((row) => publishStatus === "all" || row.publishStatus === publishStatus)
    .filter((row) => matchesSearch([row.title], search));

  return {
    ...paginate(rows, page, pageSize),
    courseOptions: courses.map((course) => ({ id: course.id, label: course.title })),
    gradeOptions: grades.map((item) => ({ id: item.id, label: item.label })),
  };
}

// ---------------------------------------------------------------------------
// نموذج الامتحان
// ---------------------------------------------------------------------------

export async function getMasterExamForm(examId = null, presetCourseId = "") {
  const courses = await getAllCourses();
  const courseOptions = await Promise.all(
    courses.map(async (course) => ({
      id: course.id,
      label: course.title,
      units: (await getAllUnitsByCourseId(course.id)).map((unit) => ({
        id: unit.id,
        label: unit.title,
      })),
    })),
  );

  if (!examId) {
    return {
      courseOptions,
      form: {
        title: "",
        courseId: presetCourseId || courses[0]?.id || "",
        unitId: "",
        durationMinutes: "30",
        startsAt: "",
        endsAt: "",
        published: false,
      },
    };
  }

  const exam = await getAnyExamById(examId);

  if (!exam) throw new Error("الامتحان غير موجود.");

  return {
    courseOptions,
    form: {
      title: exam.title,
      courseId: exam.courseId,
      unitId: exam.unitId ?? "",
      durationMinutes: String(exam.durationMinutes ?? ""),
      startsAt: toDateTimeLocal(exam.startsAt),
      endsAt: toDateTimeLocal(exam.endsAt),
      published: exam.published !== false,
    },
  };
}

export async function saveMasterExam(examId, form) {
  const title = requireText(form.title, "اسم الامتحان مطلوب.");
  const course = await getAnyCourseById(form.courseId);

  if (!course) throw new Error("اختر الكورس الخاص بالامتحان.");

  const duration = Number(form.durationMinutes);

  if (!Number.isInteger(duration) || duration < 1) {
    throw new Error("مدة الامتحان لازم تكون عدد دقائق صحيح.");
  }

  const start = new Date(form.startsAt);
  const end = new Date(form.endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("حدد وقت بداية ونهاية الامتحان.");
  }

  if (end <= start) throw new Error("وقت النهاية لازم يكون بعد وقت البداية.");

  let unitId = null;
  let sectionTitle = GENERAL_REVIEW_TITLE;

  if (form.unitId) {
    const unit = (await getAllUnitsByCourseId(course.id)).find(
      (item) => String(item.id) === String(form.unitId),
    );

    if (!unit) throw new Error("الوحدة المختارة لا تتبع هذا الكورس.");

    unitId = unit.id;
    sectionTitle = unit.title;
  }

  const data = {
    title,
    courseId: course.id,
    unitId,
    sectionTitle,
    durationMinutes: duration,
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    published: Boolean(form.published),
  };

  if (examId) {
    const exam = await updateExam(examId, data);

    return { id: exam.id };
  }

  const exam = await createExam(data);

  return { id: exam.id };
}

export async function setMasterExamPublished(examId, published) {
  await updateExam(examId, { published: Boolean(published) });

  return { id: examId, published: Boolean(published) };
}

// ---------------------------------------------------------------------------
// إدارة الامتحان والأسئلة
// ---------------------------------------------------------------------------

export async function getMasterExamDetails(examId) {
  const [exam, questions, results] = await Promise.all([
    getAnyExamById(examId),
    getQuestionsByExamId(examId),
    getResults(),
  ]);

  if (!exam) throw new Error("الامتحان غير موجود.");

  const course = await getAnyCourseById(exam.courseId);
  const timeStatus = getExamTimeStatus(exam);
  const publishState = exam.published !== false ? "published" : "draft";
  const examResults = results.filter((result) => String(result.examId) === String(examId));

  return {
    id: exam.id,
    title: exam.title,
    courseId: exam.courseId,
    courseTitle: course?.title ?? "كورس محذوف",
    gradeLabel: course ? getGradeLabel(course.grade) : "غير محدد",
    sectionTitle: exam.sectionTitle || GENERAL_REVIEW_TITLE,
    durationMinutes: exam.durationMinutes,
    startsAt: exam.startsAt,
    endsAt: exam.endsAt,
    publishStatus: publishState,
    publishLabel: getLabel(PUBLISH_STATUS_LABELS, publishState),
    timeStatus,
    timeLabel: getLabel(EXAM_TIME_STATUS_LABELS, timeStatus),
    questionsCount: questions.length,
    totalScore: sumScores(questions),
    submissionsCount: examResults.length,
    needsGradingCount: examResults.filter((result) => result.status === "needs_review").length,
  };
}

function describeCorrectAnswer(question) {
  if (question.type === "multiple-choice") {
    return question.options?.[question.correctAnswer] ?? "غير محدد";
  }

  if (question.type === "true-false") {
    return question.correctAnswer === true ? "صح" : "خطأ";
  }

  return "يصحح يدويًا";
}

export async function getMasterExamQuestionsPage(examId, { page = 1, pageSize = 10 } = {}) {
  const questions = await getQuestionsByExamId(examId);

  const rows = questions.map((question, index) => ({
    id: question.id,
    number: index + 1,
    type: question.type,
    typeLabel: getLabel(QUESTION_TYPE_LABELS, question.type),
    text: question.question,
    score: question.score,
    correctAnswerLabel: describeCorrectAnswer(question),
    isFirst: index === 0,
    isLast: index === questions.length - 1,
  }));

  return paginate(rows, page, pageSize);
}

// ---------------------------------------------------------------------------
// إضافة / تعديل سؤال
// ---------------------------------------------------------------------------

export function getEmptyQuestionForm() {
  return {
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "0",
    score: "1",
  };
}

export async function getMasterQuestionForm(questionId) {
  const question = await getQuestionById(questionId);

  if (!question) throw new Error("السؤال غير موجود.");

  const options = [...(question.options ?? [])];

  while (options.length < 4) options.push("");

  return {
    type: question.type,
    question: question.question,
    options,
    correctAnswer:
      question.type === "true-false"
        ? String(question.correctAnswer)
        : String(question.correctAnswer ?? "0"),
    score: String(question.score ?? 1),
  };
}

// يتحقق من سؤال واحد ويرجّعه بالشكل المخزّن في questions.jsx (أو يرمي Error بالسبب)
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== "object") throw new Error("السؤال ليس كائنًا صحيحًا.");

  const type = raw.type;

  if (!QUESTION_TYPES.includes(type)) {
    throw new Error("نوع السؤال لازم يكون multiple-choice أو true-false أو essay.");
  }

  const text = requireText(raw.question, "نص السؤال مطلوب.");
  const score = Number(raw.score ?? 1);

  if (Number.isNaN(score) || score <= 0)
    throw new Error("درجة السؤال لازم تكون رقمًا أكبر من صفر.");

  if (type === "essay") return { type, question: text, score };

  if (type === "true-false") {
    const value = String(raw.correctAnswer).toLowerCase();

    if (value !== "true" && value !== "false")
      throw new Error("الإجابة الصحيحة غير محددة (صح أو خطأ).");

    return { type, question: text, correctAnswer: value === "true", score };
  }

  const rawOptions = Array.isArray(raw.options)
    ? raw.options.map((option) => String(option ?? "").trim())
    : [];
  const correctIndex = Number(raw.correctAnswer);

  if (rawOptions.filter(Boolean).length < 2) throw new Error("لازم يكون فيه خيارين على الأقل.");

  if (!Number.isInteger(correctIndex) || !rawOptions[correctIndex]) {
    throw new Error("الإجابة الصحيحة غير محددة أو تشير لخيار فاضي.");
  }

  const options = [];
  let newCorrect = 0;

  rawOptions.forEach((option, index) => {
    if (!option) return;
    if (index === correctIndex) newCorrect = options.length;
    options.push(option);
  });

  return { type, question: text, options, correctAnswer: newCorrect, score };
}

export async function saveMasterQuestion(examId, questionId, form) {
  const data = normalizeQuestion(form);

  if (questionId) {
    if (!(await getQuestionById(questionId))) throw new Error("السؤال غير موجود.");

    // لو النوع اتغير نشيل الحقول القديمة اللي مالهاش لازمة
    await updateQuestion(questionId, { options: undefined, correctAnswer: undefined, ...data });
  } else {
    await createQuestion(examId, data);
  }

  await syncTotalQuestions(examId);

  return { ok: true };
}

export async function moveMasterQuestion(questionId, direction) {
  return moveQuestion(questionId, direction);
}

export async function deleteMasterQuestion(examId, questionId) {
  await deleteQuestion(questionId);
  await syncTotalQuestions(examId);

  return { ok: true };
}

export async function deleteAllMasterExamQuestions(examId) {
  const deletedQuestions = await deleteQuestionsByExamId(examId);

  await syncTotalQuestions(examId);

  return { deletedQuestions };
}

// ---------------------------------------------------------------------------
// استيراد الأسئلة من JSON (معاينة + فحص + استيراد الصحيح فقط)
// ---------------------------------------------------------------------------

export async function previewMasterQuestionsImport(jsonText) {
  let parsed;

  try {
    parsed = JSON.parse(String(jsonText ?? ""));
  } catch {
    throw new Error("الـ JSON غير صالح. تأكد من الأقواس والفواصل وعلامات التنصيص.");
  }

  const list = Array.isArray(parsed) ? parsed : parsed?.questions;

  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("لازم يكون الـ JSON مصفوفة أسئلة (أو كائن فيه questions).");
  }

  const valid = [];
  const errors = [];

  list.forEach((raw, index) => {
    try {
      valid.push(normalizeQuestion(raw));
    } catch (error) {
      errors.push({
        number: index + 1,
        message: `يوجد خطأ في السؤال رقم ${index + 1}: ${error.message}`,
      });
    }
  });

  return {
    total: list.length,
    valid: valid.map((question) => ({
      ...question,
      typeLabel: getLabel(QUESTION_TYPE_LABELS, question.type),
      correctAnswerLabel: describeCorrectAnswer(question),
    })),
    errors,
  };
}

export async function importMasterQuestions(examId, jsonText) {
  const exam = await getAnyExamById(examId);

  if (!exam) throw new Error("الامتحان غير موجود.");

  const preview = await previewMasterQuestionsImport(jsonText);

  if (preview.valid.length === 0) throw new Error("مفيش أسئلة صحيحة للاستيراد.");

  await createQuestions(
    examId,
    preview.valid.map((question) => {
      const clean = { ...question };

      delete clean.typeLabel;
      delete clean.correctAnswerLabel;

      return clean;
    }),
  );
  await syncTotalQuestions(examId);

  return { imported: preview.valid.length, skipped: preview.errors.length };
}

// ---------------------------------------------------------------------------
// الحذف
// ---------------------------------------------------------------------------

export async function getMasterExamDeleteSummary(examId) {
  const [exam, questions, results] = await Promise.all([
    getAnyExamById(examId),
    getQuestionsByExamId(examId),
    getResults(),
  ]);

  if (!exam) throw new Error("الامتحان غير موجود.");

  return {
    title: exam.title,
    questionsCount: questions.length,
    resultsCount: results.filter((result) => String(result.examId) === String(examId)).length,
  };
}

export async function getMasterExamsDeleteAllSummary() {
  const [exams, questions, results] = await Promise.all([
    getExams(),
    getAllQuestions(),
    getResults(),
  ]);

  return {
    examsCount: exams.length,
    questionsCount: questions.length,
    resultsCount: results.length,
  };
}

// ملاحظة Supabase: الحذف المتسلسل هيبقى CASCADE أو RPC واحدة، والصفحات متتغيرش.
export async function deleteMasterExam(examId) {
  const exam = await getAnyExamById(examId);

  if (!exam) throw new Error("الامتحان غير موجود.");

  await deleteQuestionsByExamId(examId);
  await deleteResultsByExamIds([examId]);
  await deleteExam(examId);

  return { title: exam.title };
}

export async function deleteAllMasterExams() {
  const examIds = await deleteAllExams();

  for (const examId of examIds) {
    await deleteQuestionsByExamId(examId);
  }

  await deleteResultsByExamIds(examIds);

  return { deletedExams: examIds.length };
}

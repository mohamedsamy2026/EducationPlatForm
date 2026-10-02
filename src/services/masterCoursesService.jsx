import {
  createCourse,
  deleteAllCourses,
  deleteCourse,
  getAllCourses,
  getAnyCourseById,
  updateCourse,
} from "./courseService";
import {
  createLesson,
  createUnit,
  deleteLesson,
  deleteUnit,
  deleteUnitsByCourseId,
  getAllUnits,
  getAllUnitsByCourseId,
  getUnitById,
  moveLesson,
  moveUnit,
  updateLesson,
  updateUnit,
} from "./lessonService";
import { deleteExamsByCourseId, detachExamsFromUnit, getExams } from "./examService";
import { deleteQuestionsByExamId, getAllQuestions } from "./questionService";
import { deleteResultsByExamIds, getResults } from "./resultService";
import {
  deleteEnrollmentsByCourseId,
  getEnrollments,
  isEnrollmentActive,
} from "./enrollmentService";
import {
  deleteSubscriptionRequestsByCourseId,
  getSubscriptionRequests,
} from "./subscriptionService";
import {
  deleteLessonAccessByCourseId,
  deleteLessonAccessByLessonIds,
  getAllLessonAccess,
} from "./lessonAccessService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { matchesSearch, paginate } from "../utils/paginate";
import { PUBLISH_STATUS_LABELS, getLabel } from "../constants/statusLabels";

const GENERAL_REVIEW_TITLE = "مراجعة عامة";

function requireText(value, message) {
  const text = String(value ?? "").trim();

  if (!text) throw new Error(message);

  return text;
}

function optionalUrl(value, message) {
  const text = String(value ?? "").trim();

  if (text && !/^https?:\/\//i.test(text)) throw new Error(message);

  return text;
}

function parsePrice(value, message) {
  const number = Number(value);

  if (value === "" || Number.isNaN(number) || number < 0) throw new Error(message);

  return number;
}

async function gradeOptions() {
  const grades = await getGrades();

  return grades.map((grade) => ({ id: grade.id, label: grade.label }));
}

async function syncLessonsCount(courseId) {
  const units = await getAllUnitsByCourseId(courseId);
  const count = units.reduce((total, unit) => total + unit.lessons.length, 0);

  await updateCourse(courseId, { lessonsCount: count });
}

// ---------------------------------------------------------------------------
// قائمة الكورسات
// ---------------------------------------------------------------------------

export async function getMasterCoursesPage({
  search = "",
  grade = "all",
  publishStatus = "all",
  page = 1,
  pageSize = 9,
} = {}) {
  const [courses, units, exams, enrollments, options] = await Promise.all([
    getAllCourses(),
    getAllUnits(),
    getExams(),
    getEnrollments(),
    gradeOptions(),
  ]);

  const rows = courses
    .map((course) => {
      const courseUnits = units.filter((unit) => String(unit.courseId) === String(course.id));
      const isPublished = course.published !== false;
      const students = new Set(
        enrollments
          .filter((item) => String(item.courseId) === String(course.id) && isEnrollmentActive(item))
          .map((item) => String(item.studentId)),
      );

      return {
        id: course.id,
        title: course.title,
        gradeId: course.grade,
        gradeLabel: getGradeLabel(course.grade),
        image: course.image,
        duration: course.duration,
        published: isPublished,
        publishStatus: isPublished ? "published" : "draft",
        publishLabel: getLabel(PUBLISH_STATUS_LABELS, isPublished ? "published" : "draft"),
        unitsCount: courseUnits.length,
        lessonsCount: courseUnits.reduce((total, unit) => total + unit.lessons.length, 0),
        examsCount: exams.filter((exam) => String(exam.courseId) === String(course.id)).length,
        studentsCount: students.size,
      };
    })
    .filter((row) => grade === "all" || String(row.gradeId) === String(grade))
    .filter((row) => publishStatus === "all" || row.publishStatus === publishStatus)
    .filter((row) => matchesSearch([row.title], search));

  return { ...paginate(rows, page, pageSize), gradeOptions: options };
}

// ---------------------------------------------------------------------------
// نموذج الكورس (إضافة / تعديل)
// ---------------------------------------------------------------------------

export async function getMasterCourseForm(courseId = null) {
  const options = await gradeOptions();

  if (!courseId) {
    return {
      gradeOptions: options,
      form: {
        title: "",
        description: "",
        grade: options[0]?.id ?? "",
        duration: "كورس شامل",
        image: "",
        monthlyPrice: "",
        termPrice: "",
        published: false,
      },
    };
  }

  const course = await getAnyCourseById(courseId);

  if (!course) throw new Error("الكورس غير موجود.");

  const priceOf = (planId) =>
    String(course.subscriptionPlans?.find((plan) => plan.id === planId)?.price ?? "");

  return {
    gradeOptions: options,
    form: {
      title: course.title,
      description: course.description ?? "",
      grade: course.grade,
      duration: course.duration ?? "",
      image: course.image ?? "",
      monthlyPrice: priceOf("monthly"),
      termPrice: priceOf("term"),
      published: course.published !== false,
    },
  };
}

export async function saveMasterCourse(courseId, form) {
  const title = requireText(form.title, "اسم الكورس مطلوب.");
  const grade = requireText(form.grade, "الصف الدراسي مطلوب.");

  const data = {
    title,
    grade,
    description: String(form.description ?? "").trim(),
    duration: String(form.duration ?? "").trim() || "كورس شامل",
    image: form.image || "",
    published: Boolean(form.published),
    subscriptionPlans: [
      {
        id: "monthly",
        name: "اشتراك شهري",
        price: parsePrice(form.monthlyPrice, "سعر الاشتراك الشهري غير صحيح."),
        currency: "EGP",
      },
      {
        id: "term",
        name: "اشتراك الترم",
        price: parsePrice(form.termPrice, "سعر اشتراك الترم غير صحيح."),
        currency: "EGP",
      },
    ],
  };

  if (courseId) {
    const course = await updateCourse(courseId, data);

    return { id: course.id };
  }

  const course = await createCourse({ ...data, lessonsCount: 0 });

  return { id: course.id };
}

export async function setMasterCoursePublished(courseId, published) {
  await updateCourse(courseId, { published: Boolean(published) });

  return { id: courseId, published: Boolean(published) };
}

// ---------------------------------------------------------------------------
// إدارة محتوى الكورس (وحدات ودروس)
// ---------------------------------------------------------------------------

export async function getMasterCourseContent(courseId) {
  const [course, units, exams] = await Promise.all([
    getAnyCourseById(courseId),
    getAllUnitsByCourseId(courseId),
    getExams(),
  ]);

  if (!course) throw new Error("الكورس غير موجود.");

  return {
    course: {
      id: course.id,
      title: course.title,
      gradeLabel: getGradeLabel(course.grade),
      published: course.published !== false,
      publishLabel: getLabel(
        PUBLISH_STATUS_LABELS,
        course.published !== false ? "published" : "draft",
      ),
    },
    examsCount: exams.filter((exam) => String(exam.courseId) === String(courseId)).length,
    units: units.map((unit, unitIndex) => ({
      id: unit.id,
      title: unit.title,
      isFirst: unitIndex === 0,
      isLast: unitIndex === units.length - 1,
      lessons: unit.lessons.map((lesson, lessonIndex) => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration ?? "",
        description: lesson.description ?? "",
        videoUrl: lesson.videoUrl ?? "",
        materialUrl: lesson.materialUrl ?? "",
        materialTitle: lesson.materialTitle ?? "",
        isFirst: lessonIndex === 0,
        isLast: lessonIndex === unit.lessons.length - 1,
      })),
    })),
  };
}

export async function saveMasterUnit(courseId, unitId, form) {
  const title = requireText(form.title, "اسم الوحدة مطلوب.");

  if (unitId) {
    await updateUnit(unitId, { title });
  } else {
    await createUnit({ courseId, title });
  }

  return { ok: true };
}

export async function moveMasterUnit(unitId, direction) {
  return moveUnit(unitId, direction);
}

export async function getMasterUnitDeleteSummary(unitId) {
  const [unit, exams] = await Promise.all([getUnitById(unitId), getExams()]);

  if (!unit) throw new Error("الوحدة غير موجودة.");

  return {
    title: unit.title,
    lessonsCount: unit.lessons.length,
    examsCount: exams.filter((exam) => String(exam.unitId) === String(unitId)).length,
  };
}

export async function deleteMasterUnit(unitId) {
  const unit = await getUnitById(unitId);

  if (!unit) throw new Error("الوحدة غير موجودة.");

  await deleteLessonAccessByLessonIds(unit.lessons.map((lesson) => lesson.id));
  await detachExamsFromUnit(unitId, GENERAL_REVIEW_TITLE);
  await deleteUnit(unitId);
  await syncLessonsCount(unit.courseId);

  return { title: unit.title };
}

function buildLessonData(form) {
  return {
    title: requireText(form.title, "اسم الدرس مطلوب."),
    duration: String(form.duration ?? "").trim(),
    description: String(form.description ?? "").trim(),
    videoUrl: optionalUrl(form.videoUrl, "رابط الفيديو لازم يبدأ بـ https://"),
    materialUrl: optionalUrl(form.materialUrl, "رابط الملزمة لازم يبدأ بـ https://"),
    materialTitle: String(form.materialTitle ?? "").trim(),
  };
}

export async function saveMasterLesson(courseId, unitId, lessonId, form) {
  const data = buildLessonData(form);

  if (lessonId) {
    await updateLesson(lessonId, data);
  } else {
    await createLesson(unitId, data);
  }

  await syncLessonsCount(courseId);

  return { ok: true };
}

export async function moveMasterLesson(lessonId, direction) {
  return moveLesson(lessonId, direction);
}

export async function deleteMasterLesson(courseId, lessonId) {
  await deleteLessonAccessByLessonIds([lessonId]);
  await deleteLesson(lessonId);
  await syncLessonsCount(courseId);

  return { ok: true };
}

// ---------------------------------------------------------------------------
// الحذف (مع ملخص بكل اللي هيتمسح)
// ---------------------------------------------------------------------------

async function buildDeleteSummary(courseIds) {
  const ids = new Set(courseIds.map(String));
  const inCourses = (item) => ids.has(String(item.courseId));

  const [units, exams, questions, results, enrollments, requests, access] = await Promise.all([
    getAllUnits(),
    getExams(),
    getAllQuestions(),
    getResults(),
    getEnrollments(),
    getSubscriptionRequests(),
    getAllLessonAccess(),
  ]);

  const courseUnits = units.filter(inCourses);
  const courseExams = exams.filter(inCourses);
  const examIds = new Set(courseExams.map((exam) => String(exam.id)));
  const courseEnrollments = enrollments.filter(inCourses);

  return {
    coursesCount: ids.size,
    unitsCount: courseUnits.length,
    lessonsCount: courseUnits.reduce((total, unit) => total + unit.lessons.length, 0),
    examsCount: courseExams.length,
    questionsCount: questions.filter((item) => examIds.has(String(item.examId))).length,
    resultsCount: results.filter((item) => examIds.has(String(item.examId))).length,
    enrollmentsCount: courseEnrollments.length,
    activeEnrollmentsCount: courseEnrollments.filter((item) => isEnrollmentActive(item)).length,
    requestsCount: requests.filter(inCourses).length,
    lessonAccessCount: access.filter(inCourses).length,
  };
}

export async function getMasterCourseDeleteSummary(courseId) {
  const course = await getAnyCourseById(courseId);

  if (!course) throw new Error("الكورس غير موجود.");

  return { title: course.title, ...(await buildDeleteSummary([courseId])) };
}

export async function getMasterCoursesDeleteAllSummary() {
  const courses = await getAllCourses();

  return buildDeleteSummary(courses.map((course) => course.id));
}

async function deleteCourseRecords(courseId) {
  const examIds = await deleteExamsByCourseId(courseId);

  for (const examId of examIds) {
    await deleteQuestionsByExamId(examId);
  }

  await deleteResultsByExamIds(examIds);
  await deleteUnitsByCourseId(courseId);
  await deleteEnrollmentsByCourseId(courseId);
  await deleteSubscriptionRequestsByCourseId(courseId);
  await deleteLessonAccessByCourseId(courseId);
}

// ملاحظة Supabase: الحذف المتسلسل ده هيبقى CASCADE أو RPC واحدة على السيرفر.
// الصفحات بتنادي الدالتين دول بس، فبنبدّل جواهم من غير ما نغيّر الصفحات.
export async function deleteMasterCourse(courseId) {
  const course = await getAnyCourseById(courseId);

  if (!course) throw new Error("الكورس غير موجود.");

  await deleteCourseRecords(courseId);
  await deleteCourse(courseId);

  return { title: course.title };
}

export async function deleteAllMasterCourses() {
  const courses = await getAllCourses();

  for (const course of courses) {
    await deleteCourseRecords(course.id);
  }

  await deleteAllCourses();

  return { deletedCourses: courses.length };
}

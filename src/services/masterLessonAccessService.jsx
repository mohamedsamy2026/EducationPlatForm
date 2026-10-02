import {
  getAllLessonAccess,
  getLessonAccessById,
  grantLessonAccess,
  hasLessonAccess,
  revokeLessonAccess,
} from "./lessonAccessService";
import { getAllLessons } from "./lessonService";
import { getAllCourses } from "./courseService";
import { getStudents } from "./studentService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { matchesSearch, paginate } from "../utils/paginate";
import { UNKNOWN_LABEL as UNKNOWN } from "../constants/statusLabels";

export async function getMasterLessonAccessSummary() {
  const access = await getAllLessonAccess();

  return {
    total: access.length,
    studentsCount: new Set(access.map((item) => String(item.studentId))).size,
    lessonsCount: new Set(access.map((item) => String(item.lessonId))).size,
  };
}

export async function getMasterLessonAccessPage({
  search = "",
  courseId = "all",
  grade = "all",
  page = 1,
  pageSize = 15,
} = {}) {
  const [access, students, courses, lessons, grades] = await Promise.all([
    getAllLessonAccess(),
    getStudents(),
    getAllCourses(),
    getAllLessons(),
    getGrades(),
  ]);

  const studentsById = new Map(students.map((item) => [String(item.id), item]));
  const coursesById = new Map(courses.map((item) => [String(item.id), item]));
  const lessonsById = new Map(lessons.map((item) => [String(item.id), item]));

  const rows = access
    .map((item) => {
      const student = studentsById.get(String(item.studentId));
      const lesson = lessonsById.get(String(item.lessonId));

      return {
        id: item.id,
        studentId: item.studentId,
        studentName: student?.name ?? UNKNOWN,
        gradeId: student?.grade ?? "",
        gradeLabel: getGradeLabel(student?.grade),
        courseId: item.courseId,
        courseTitle: coursesById.get(String(item.courseId))?.title ?? UNKNOWN,
        lessonTitle: lesson?.title ?? "درس محذوف",
        unitTitle: lesson?.unitTitle ?? "",
        createdAt: item.createdAt,
      };
    })
    .filter((row) => matchesSearch([row.studentName, row.lessonTitle], search))
    .filter((row) => courseId === "all" || String(row.courseId) === String(courseId))
    .filter((row) => grade === "all" || String(row.gradeId) === String(grade))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...paginate(rows, page, pageSize),
    filterOptions: {
      courses: courses.map((course) => ({ id: course.id, label: course.title })),
      grades: grades.map((item) => ({ id: item.id, label: item.label })),
    },
  };
}

// خيارات نموذج منح الصلاحية: الطلاب + الكورسات ودروس كل كورس
export async function getMasterLessonAccessOptions() {
  const [students, courses, lessons] = await Promise.all([
    getStudents(),
    getAllCourses(),
    getAllLessons(),
  ]);

  return {
    students: students.map((student) => ({
      id: student.id,
      label: student.name,
      gradeLabel: getGradeLabel(student.grade),
    })),
    courses: courses.map((course) => ({
      id: course.id,
      label: course.title,
      lessons: lessons
        .filter((lesson) => String(lesson.courseId) === String(course.id))
        .map((lesson) => ({ id: lesson.id, label: lesson.title, unitTitle: lesson.unitTitle })),
    })),
  };
}

// منح درس أو أكتر: بيمنع التكرار ويرجّع كام اتمنح وكام كان موجود أصلًا
export async function grantMasterLessonAccess({ studentId, courseId, lessonIds }) {
  if (!studentId) throw new Error("اختر الطالب.");
  if (!courseId) throw new Error("اختر الكورس.");
  if (!Array.isArray(lessonIds) || lessonIds.length === 0)
    throw new Error("اختر درسًا واحدًا على الأقل.");

  let granted = 0;
  let skipped = 0;

  for (const lessonId of lessonIds) {
    if (await hasLessonAccess(studentId, courseId, lessonId)) {
      skipped += 1;
    } else {
      await grantLessonAccess({ studentId, courseId, lessonId });
      granted += 1;
    }
  }

  return { granted, skipped };
}

export async function revokeMasterLessonAccess(accessId) {
  if (!(await getLessonAccessById(accessId))) throw new Error("الصلاحية غير موجودة.");

  await revokeLessonAccess(accessId);

  return { ok: true };
}

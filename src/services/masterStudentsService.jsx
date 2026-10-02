import {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  deleteAllStudents,
} from "./studentService";
import { getAllCourses } from "./courseService";
import { getExams } from "./examService";
import {
  getEnrollments,
  deleteEnrollmentsByStudentId,
  isEnrollmentActive,
} from "./enrollmentService";
import { getResultsByStudentId, deleteResultsByStudentId } from "./resultService";
import {
  getSubscriptionRequests,
  getSubscriptionRequestsByStudentId,
  deleteSubscriptionRequestsByStudentId,
} from "./subscriptionService";
import {
  getBookPurchaseRequests,
  getBookPurchaseRequestsByStudentId,
  deleteBookPurchaseRequestsByStudentId,
} from "./bookPurchaseService";
import { getLessonAccessByStudentId, deleteLessonAccessByStudentId } from "./lessonAccessService";
import { getBooks } from "./bookService";
import { getGrades } from "./gradeService";
import { deleteBookPurchasesByStudentId } from "./bookPurchasesService";
import { getUnitsByCourseId } from "./lessonService";
import { getGradeLabel } from "../utils/gradeUtils";
import {
  ENROLLMENT_STATUS_LABELS,
  LESSON_ACCESS_STATUS_LABELS,
  PLAN_LABELS,
  REQUEST_STATUS_LABELS,
  RESULT_STATUS_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  UNKNOWN_LABEL as UNKNOWN,
  getLabel,
} from "../constants/statusLabels";

const DEFAULT_PAGE_SIZE = 20;

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("ar-EG");
}

function dateSortDescending(a, b) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

function sortByArabicName(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), "ar");
}

function uniqueById(items) {
  return [...new Map(items.map((item) => [String(item.id), item])).values()];
}

// كل الصفوف الدراسية المتاحة (حتى لو مفيش طالب مسجل فيها)، للاستخدام في الفلاتر ونموذج التعديل
export async function getMasterStudentGradeOptions() {
  const grades = await getGrades();

  return grades.map((grade) => ({ id: grade.id, label: grade.label }));
}

export async function getMasterStudentsSummary() {
  const [students, enrollments, subscriptionRequests, bookRequests] = await Promise.all([
    getStudents(),
    getEnrollments(),
    getSubscriptionRequests(),
    getBookPurchaseRequests(),
  ]);

  const activeStudentIds = new Set(
    enrollments.filter((item) => isEnrollmentActive(item)).map((item) => String(item.studentId)),
  );
  const pendingSubscriptionsCount = subscriptionRequests.filter(
    (item) => item.status === "pending",
  ).length;
  const pendingBookRequestsCount = bookRequests.filter((item) => item.status === "pending").length;

  return {
    totalStudents: students.length,
    subscribedStudents: students.filter((student) => activeStudentIds.has(String(student.id)))
      .length,
    pendingSubscriptionsCount,
    pendingBookRequestsCount,
    pendingRequestsCount: pendingSubscriptionsCount + pendingBookRequestsCount,
  };
}

export async function getMasterStudentsPage({
  search = "",
  grade = "all",
  subscriptionStatus = "all",
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
} = {}) {
  const [students, courses, enrollments, gradeOptions] = await Promise.all([
    getStudents(),
    getAllCourses(),
    getEnrollments(),
    getMasterStudentGradeOptions(),
  ]);
  const now = Date.now();
  const coursesById = new Map(courses.map((course) => [String(course.id), course]));
  const activeEnrollmentIds = new Set(
    enrollments.filter((item) => isEnrollmentActive(item, now)).map((item) => String(item.id)),
  );
  const enrollmentsByStudent = new Map();

  for (const enrollment of enrollments) {
    const id = String(enrollment.studentId);
    if (!enrollmentsByStudent.has(id)) enrollmentsByStudent.set(id, []);
    enrollmentsByStudent.get(id).push(enrollment);
  }

  const searchTerm = normalizeText(search);
  const rows = students
    .map((student) => {
      const studentEnrollments = enrollmentsByStudent.get(String(student.id)) ?? [];
      const activeEnrollments = studentEnrollments.filter((item) =>
        activeEnrollmentIds.has(String(item.id)),
      );
      const courseTitles = uniqueById(
        studentEnrollments.map((item) => coursesById.get(String(item.courseId))).filter(Boolean),
      ).map((course) => course.title);

      return {
        id: student.id,
        name: student.name,
        email: student.email ?? "",
        phone: student.phone ?? "",
        grade: student.grade,
        gradeLabel: getGradeLabel(student.grade),
        governorate: student.governorate ?? UNKNOWN,
        courseTitles,
        activeCourseCount: activeEnrollments.length,
        subscriptionStatus: activeEnrollments.length > 0 ? "active" : "inactive",
        subscriptionLabel: getLabel(
          SUBSCRIPTION_STATUS_LABELS,
          activeEnrollments.length > 0 ? "active" : "inactive",
        ),
      };
    })
    .filter((student) => {
      const matchesSearch =
        !searchTerm ||
        [student.name, student.email, student.phone].some((value) =>
          normalizeText(value).includes(searchTerm),
        );
      const matchesGrade = grade === "all" || String(student.grade) === String(grade);
      const matchesSubscription =
        subscriptionStatus === "all" || student.subscriptionStatus === subscriptionStatus;
      return matchesSearch && matchesGrade && matchesSubscription;
    })
    .sort((a, b) => sortByArabicName(a.name, b.name));

  const safePageSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
  const pageCount = Math.ceil(rows.length / safePageSize);
  const currentPage = pageCount === 0 ? 1 : Math.min(Math.max(1, Number(page) || 1), pageCount);
  const start = (currentPage - 1) * safePageSize;

  return {
    rows: rows.slice(start, start + safePageSize),
    pagination: { page: currentPage, pageSize: safePageSize, pageCount, total: rows.length },
    gradeOptions,
  };
}

export async function getMasterStudentDetails(studentId) {
  const [
    student,
    courses,
    exams,
    enrollments,
    results,
    subscriptionRequests,
    bookRequests,
    lessonAccess,
    books,
  ] = await Promise.all([
    getStudentById(studentId),
    getAllCourses(),
    getExams(),
    getEnrollments(),
    getResultsByStudentId(studentId),
    getSubscriptionRequestsByStudentId(studentId),
    getBookPurchaseRequestsByStudentId(studentId),
    getLessonAccessByStudentId(studentId),
    getBooks(),
  ]);

  if (!student) return null;

  const coursesById = new Map(courses.map((item) => [String(item.id), item]));
  const examsById = new Map(exams.map((item) => [String(item.id), item]));
  const booksById = new Map(books.map((item) => [String(item.id), item]));
  const studentEnrollments = enrollments.filter(
    (item) => String(item.studentId) === String(studentId),
  );
  const unitsByCourse = new Map();

  await Promise.all(
    [...new Set(lessonAccess.map((item) => String(item.courseId)))].map(async (courseId) => {
      unitsByCourse.set(courseId, await getUnitsByCourseId(courseId));
    }),
  );

  const enrollmentDetails = studentEnrollments.map((enrollment) => ({
    id: enrollment.id,
    courseTitle: coursesById.get(String(enrollment.courseId))?.title ?? UNKNOWN,
    planLabel: getLabel(PLAN_LABELS, enrollment.planId),
    status: isEnrollmentActive(enrollment) ? "active" : "inactive",
    statusLabel: getLabel(
      ENROLLMENT_STATUS_LABELS,
      isEnrollmentActive(enrollment) ? "active" : "inactive",
    ),
    startsAt: enrollment.startsAt ?? null,
    endsAt: enrollment.endsAt ?? null,
  }));

  const resultDetails = results
    .sort((a, b) => dateSortDescending(a.submittedAt, b.submittedAt))
    .map((result) => {
      const exam = examsById.get(String(result.examId));
      const total = Number(result.total) || 0;
      return {
        id: result.id,
        examTitle: exam?.title ?? result.title ?? UNKNOWN,
        courseTitle: coursesById.get(String(exam?.courseId))?.title ?? UNKNOWN,
        score: Number(result.score) || 0,
        total,
        percentage: total > 0 ? Math.round((Number(result.score) / total) * 100) : null,
        status: result.status ?? "graded",
        statusLabel: getLabel(RESULT_STATUS_LABELS, result.status ?? "graded"),
        submittedAt: result.submittedAt ?? null,
      };
    });

  const requestDetails = [
    ...subscriptionRequests.map((request) => ({
      id: request.id,
      type: "subscription",
      typeLabel: "اشتراك",
      referenceNumber: request.referenceNumber ?? request.id,
      description: coursesById.get(String(request.courseId))?.title ?? "طلب اشتراك",
      status: request.status,
      statusLabel: getLabel(REQUEST_STATUS_LABELS, request.status),
      createdAt: request.createdAt ?? null,
    })),
    ...bookRequests.map((request) => ({
      id: request.id,
      type: "book",
      typeLabel: "شراء كتاب",
      referenceNumber: request.referenceNumber ?? request.id,
      description: booksById.get(String(request.bookId))?.title ?? "طلب شراء كتاب",
      status: request.status,
      statusLabel: getLabel(REQUEST_STATUS_LABELS, request.status),
      createdAt: request.createdAt ?? null,
    })),
  ].sort((a, b) => dateSortDescending(a.createdAt, b.createdAt));

  const lessonDetails = lessonAccess.map((access) => {
    const units = unitsByCourse.get(String(access.courseId)) ?? [];
    const lesson = units
      .flatMap((unit) => unit.lessons ?? [])
      .find((item) => String(item.id) === String(access.lessonId));
    return {
      id: access.id,
      courseTitle: coursesById.get(String(access.courseId))?.title ?? UNKNOWN,
      lessonTitle: lesson?.title ?? UNKNOWN,
      status: access.status,
      statusLabel: getLabel(LESSON_ACCESS_STATUS_LABELS, access.status),
      createdAt: access.createdAt ?? null,
    };
  });

  return {
    student: { ...student },
    gradeLabel: getGradeLabel(student.grade),
    enrollments: enrollmentDetails,
    results: resultDetails,
    requests: requestDetails,
    lessonAccess: lessonDetails,
  };
}

export async function updateMasterStudent(studentId, updates) {
  const normalized = {
    name: String(updates.name ?? "").trim(),
    email: String(updates.email ?? "").trim(),
    phone: String(updates.phone ?? "").trim(),
    guardianPhone: String(updates.guardianPhone ?? "").trim(),
    grade: String(updates.grade ?? "").trim(),
    governorate: String(updates.governorate ?? "").trim(),
  };
  if (!normalized.name) throw new Error("اسم الطالب مطلوب.");
  if (!normalized.grade) throw new Error("الصف الدراسي مطلوب.");
  return updateStudent(studentId, normalized);
}

// ملاحظة Supabase: حذف الطالب وكل بياناته المرتبطة لازم يبقى عملية واحدة على السيرفر
// (ON DELETE CASCADE أو دالة RPC). عند الربط نستبدل محتوى deleteMasterStudent و
// deleteAllMasterStudents فقط، والصفحات تظل تستدعيهما كما هي.
async function deleteStudentRecords(studentId) {
  const counts = await Promise.all([
    deleteEnrollmentsByStudentId(studentId),
    deleteResultsByStudentId(studentId),
    deleteSubscriptionRequestsByStudentId(studentId),
    deleteBookPurchaseRequestsByStudentId(studentId),
    deleteBookPurchasesByStudentId(studentId),
    deleteLessonAccessByStudentId(studentId),
  ]);
  return counts.reduce((total, count) => total + count, 0);
}

export async function deleteMasterStudent(studentId) {
  const student = await getStudentById(studentId);
  if (!student) throw new Error("الطالب غير موجود.");
  await deleteStudentRecords(studentId);
  await deleteStudent(studentId);
  return { id: student.id, name: student.name };
}

export async function deleteAllMasterStudents() {
  const students = await getStudents();
  let relatedRecordsDeleted = 0;
  for (const student of students) relatedRecordsDeleted += await deleteStudentRecords(student.id);
  const deletedStudents = await deleteAllStudents();
  return { deletedStudents: deletedStudents.length, relatedRecordsDeleted };
}

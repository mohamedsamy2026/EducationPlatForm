import { getStudents, getStudentById, updateStudent, deleteStudent, deleteAllStudents } from "./studentService";
import { getCourses } from "./courseService";
import { getExams } from "./examService";
import { getEnrollments, deleteEnrollmentsByStudentId } from "./enrollmentService";
import { getResultsByStudentId, deleteResultsByStudentId } from "./resultService";
import { getSubscriptionRequests, getSubscriptionRequestsByStudentId, deleteSubscriptionRequestsByStudentId } from "./subscriptionService";
import { getBookPurchaseRequests, getBookPurchaseRequestsByStudentId, deleteBookPurchaseRequestsByStudentId } from "./bookPurchaseService";
import { getLessonAccessByStudentId, deleteLessonAccessByStudentId } from "./lessonAccessService";
import { getBooks } from "./bookService";
import { getUnitsByCourseId } from "./lessonService";
import { getGradeLabel } from "../utils/gradeUtils";

const DEFAULT_PAGE_SIZE = 20;
const UNKNOWN = "غير محدد";

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("ar-EG");
}

function isEnrollmentActive(enrollment, now = Date.now()) {
  if (enrollment.status !== "active") return false;
  if (!enrollment.endsAt) return true;
  const end = new Date(enrollment.endsAt).getTime();
  return Number.isNaN(end) || end >= now;
}

function dateSortDescending(a, b) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

function uniqueById(items) {
  return [...new Map(items.map((item) => [String(item.id), item])).values()];
}

export async function getMasterStudentsSummary() {
  const [students, enrollments, subscriptionRequests, bookRequests] = await Promise.all([
    getStudents(),
    getEnrollments(),
    getSubscriptionRequests(),
    getBookPurchaseRequests(),
  ]);

  const activeStudentIds = new Set(enrollments.filter((item) => isEnrollmentActive(item)).map((item) => String(item.studentId)));
  const pendingSubscriptionsCount = subscriptionRequests.filter((item) => item.status === "pending").length;
  const pendingBookRequestsCount = bookRequests.filter((item) => item.status === "pending").length;

  return {
    totalStudents: students.length,
    subscribedStudents: students.filter((student) => activeStudentIds.has(String(student.id))).length,
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
  const [students, courses, enrollments] = await Promise.all([getStudents(), getCourses(), getEnrollments()]);
  const now = Date.now();
  const coursesById = new Map(courses.map((course) => [String(course.id), course]));
  const activeEnrollmentIds = new Set(enrollments.filter((item) => isEnrollmentActive(item, now)).map((item) => String(item.id)));
  const enrollmentsByStudent = new Map();

  for (const enrollment of enrollments) {
    const id = String(enrollment.studentId);
    if (!enrollmentsByStudent.has(id)) enrollmentsByStudent.set(id, []);
    enrollmentsByStudent.get(id).push(enrollment);
  }

  const searchTerm = normalizeText(search);
  const rows = students.map((student) => {
    const studentEnrollments = enrollmentsByStudent.get(String(student.id)) ?? [];
    const activeEnrollments = studentEnrollments.filter((item) => activeEnrollmentIds.has(String(item.id)));
    const courseTitles = uniqueById(studentEnrollments.map((item) => coursesById.get(String(item.courseId))).filter(Boolean)).map((course) => course.title);

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
      subscriptionLabel: activeEnrollments.length > 0 ? "مشترك" : "غير مشترك",
    };
  }).filter((student) => {
    const matchesSearch = !searchTerm || [student.name, student.email, student.phone].some((value) => normalizeText(value).includes(searchTerm));
    const matchesGrade = grade === "all" || String(student.grade) === String(grade);
    const matchesSubscription = subscriptionStatus === "all" || student.subscriptionStatus === subscriptionStatus;
    return matchesSearch && matchesGrade && matchesSubscription;
  }).sort((a, b) => a.name.localeCompare(b.name, "ar"));

  const safePageSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
  const pageCount = Math.ceil(rows.length / safePageSize);
  const currentPage = pageCount === 0 ? 1 : Math.min(Math.max(1, Number(page) || 1), pageCount);
  const start = (currentPage - 1) * safePageSize;

  return {
    rows: rows.slice(start, start + safePageSize),
    pagination: { page: currentPage, pageSize: safePageSize, pageCount, total: rows.length },
    gradeOptions: uniqueById(students.filter((student) => student.grade).map((student) => ({ id: student.grade, label: getGradeLabel(student.grade) }))).sort((a, b) => a.label.localeCompare(b.label, "ar")),
  };
}

export async function getMasterStudentDetails(studentId) {
  const [student, courses, exams, enrollments, results, subscriptionRequests, bookRequests, lessonAccess, books] = await Promise.all([
    getStudentById(studentId),
    getCourses(),
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
  const studentEnrollments = enrollments.filter((item) => String(item.studentId) === String(studentId));
  const unitsByCourse = new Map();

  await Promise.all([...new Set(lessonAccess.map((item) => String(item.courseId)))].map(async (courseId) => {
    unitsByCourse.set(courseId, await getUnitsByCourseId(courseId));
  }));

  const enrollmentDetails = studentEnrollments.map((enrollment) => ({
    id: enrollment.id,
    courseTitle: coursesById.get(String(enrollment.courseId))?.title ?? UNKNOWN,
    planLabel: enrollment.planId === "term" ? "اشتراك الترم" : enrollment.planId === "monthly" ? "اشتراك شهري" : UNKNOWN,
    status: isEnrollmentActive(enrollment) ? "active" : "inactive",
    statusLabel: isEnrollmentActive(enrollment) ? "نشط" : "منتهي",
    startsAt: enrollment.startsAt ?? null,
    endsAt: enrollment.endsAt ?? null,
  }));

  const resultDetails = results.sort((a, b) => dateSortDescending(a.submittedAt, b.submittedAt)).map((result) => {
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
      statusLabel: result.status === "needs_review" ? "تحتاج تصحيحًا" : "مكتملة التصحيح",
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
      statusLabel: request.status === "pending" ? "قيد المراجعة" : request.status === "approved" ? "مقبول" : "مرفوض",
      createdAt: request.createdAt ?? null,
    })),
    ...bookRequests.map((request) => ({
      id: request.id,
      type: "book",
      typeLabel: "شراء كتاب",
      referenceNumber: request.referenceNumber ?? request.id,
      description: booksById.get(String(request.bookId))?.title ?? "طلب شراء كتاب",
      status: request.status,
      statusLabel: request.status === "pending" ? "قيد المراجعة" : request.status === "approved" ? "مقبول" : "مرفوض",
      createdAt: request.createdAt ?? null,
    })),
  ].sort((a, b) => dateSortDescending(a.createdAt, b.createdAt));

  const lessonDetails = lessonAccess.map((access) => {
    const units = unitsByCourse.get(String(access.courseId)) ?? [];
    const lesson = units.flatMap((unit) => unit.lessons ?? []).find((item) => String(item.id) === String(access.lessonId));
    return {
      id: access.id,
      courseTitle: coursesById.get(String(access.courseId))?.title ?? UNKNOWN,
      lessonTitle: lesson?.title ?? UNKNOWN,
      status: access.status,
      statusLabel: access.status === "active" ? "نشطة" : "غير نشطة",
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

async function deleteStudentRecords(studentId) {
  const counts = await Promise.all([
    deleteEnrollmentsByStudentId(studentId),
    deleteResultsByStudentId(studentId),
    deleteSubscriptionRequestsByStudentId(studentId),
    deleteBookPurchaseRequestsByStudentId(studentId),
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

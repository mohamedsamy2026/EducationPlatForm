import {
  approveSubscriptionRequest,
  deleteAllSubscriptionRequests,
  deleteSubscriptionRequest,
  getSubscriptionRequestById,
  getSubscriptionRequests,
  rejectSubscriptionRequest,
} from "./subscriptionService";
import {
  getEnrollmentById,
  getEnrollmentState,
  getEnrollments,
  updateEnrollment,
} from "./enrollmentService";
import { getStudents } from "./studentService";
import { getAllCourses } from "./courseService";
import { getAllPaymentMethods } from "./paymentMethodService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { matchesSearch, paginate } from "../utils/paginate";
import {
  ENROLLMENT_STATUS_LABELS,
  PLAN_LABELS,
  REQUEST_STATUS_LABELS,
  UNKNOWN_LABEL as UNKNOWN,
  getLabel,
} from "../constants/statusLabels";

const DAY_MS = 24 * 60 * 60 * 1000;

async function loadLookups() {
  const [students, courses, methods] = await Promise.all([
    getStudents(),
    getAllCourses(),
    getAllPaymentMethods(),
  ]);

  return {
    studentsById: new Map(students.map((item) => [String(item.id), item])),
    coursesById: new Map(courses.map((item) => [String(item.id), item])),
    methodsById: new Map(methods.map((item) => [String(item.id), item])),
  };
}

async function loadFilterOptions(coursesById) {
  const grades = await getGrades();

  return {
    grades: grades.map((item) => ({ id: item.id, label: item.label })),
    courses: [...coursesById.values()].map((course) => ({ id: course.id, label: course.title })),
  };
}

function matchesGradeAndCourse(row, grade, courseId) {
  return (
    (!grade || grade === "all" || String(row.gradeId) === String(grade)) &&
    (!courseId || courseId === "all" || String(row.courseId) === String(courseId))
  );
}

// ---------------------------------------------------------------------------
// الإحصائيات
// ---------------------------------------------------------------------------

export async function getMasterSubscriptionsSummary() {
  const [enrollments, requests] = await Promise.all([getEnrollments(), getSubscriptionRequests()]);
  const states = enrollments.map((item) => getEnrollmentState(item));

  return {
    active: states.filter((state) => state === "active").length,
    finished: states.filter((state) => state !== "active").length,
    pendingRequests: requests.filter((request) => request.status === "pending").length,
    activeEnrollments: states.filter((state) => state === "active").length,
    totalRequests: requests.length,
    totalEnrollments: enrollments.length,
  };
}

// ---------------------------------------------------------------------------
// تبويب الاشتراكات
// ---------------------------------------------------------------------------

export async function getMasterEnrollmentsPage({
  search = "",
  grade = "all",
  courseId = "all",
  status = "all",
  page = 1,
  pageSize = 15,
} = {}) {
  const [enrollments, lookups] = await Promise.all([getEnrollments(), loadLookups()]);
  const now = Date.now();

  const rows = enrollments
    .map((enrollment) => {
      const student = lookups.studentsById.get(String(enrollment.studentId));
      const course = lookups.coursesById.get(String(enrollment.courseId));
      const state = getEnrollmentState(enrollment, now);
      const daysLeft = enrollment.endsAt
        ? Math.ceil((new Date(enrollment.endsAt).getTime() - now) / DAY_MS)
        : null;

      return {
        id: enrollment.id,
        studentId: enrollment.studentId,
        studentName: student?.name ?? UNKNOWN,
        gradeId: student?.grade ?? "",
        gradeLabel: getGradeLabel(student?.grade),
        courseId: enrollment.courseId,
        courseTitle: course?.title ?? UNKNOWN,
        planLabel: getLabel(PLAN_LABELS, enrollment.planId),
        startsAt: enrollment.startsAt,
        endsAt: enrollment.endsAt,
        daysLeft: state === "active" ? daysLeft : null,
        status: state,
        statusLabel: getLabel(ENROLLMENT_STATUS_LABELS, state),
      };
    })
    .filter((row) => matchesSearch([row.studentName, row.courseTitle], search))
    .filter((row) => matchesGradeAndCourse(row, grade, courseId))
    .filter((row) => status === "all" || row.status === status)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  return {
    ...paginate(rows, page, pageSize),
    filterOptions: await loadFilterOptions(lookups.coursesById),
  };
}

// تمديد مباشر/استثنائي: بيبدأ من آخر تاريخ نهاية (أو النهارده لو الاشتراك منتهي)
export async function extendMasterEnrollment(enrollmentId, days) {
  const count = Number(days);

  if (!Number.isInteger(count) || count < 1 || count > 365) {
    throw new Error("عدد أيام التمديد لازم يكون من 1 إلى 365.");
  }

  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) throw new Error("الاشتراك غير موجود.");

  if (enrollment.status === "ended") {
    throw new Error("هذا الاشتراك تم إنهاؤه ولا يمكن تمديده. الطالب يحتاج طلب اشتراك جديد.");
  }

  const currentEnd = enrollment.endsAt ? new Date(enrollment.endsAt).getTime() : 0;
  const base = Math.max(currentEnd, Date.now());

  await updateEnrollment(enrollmentId, {
    endsAt: new Date(base + count * DAY_MS).toISOString(),
    status: "active",
  });

  return { ok: true };
}

// الاشتراك بيتنهي ومش بيتحذف
export async function endMasterEnrollment(enrollmentId) {
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) throw new Error("الاشتراك غير موجود.");

  await updateEnrollment(enrollmentId, {
    status: "ended",
    endedAt: new Date().toISOString(),
  });

  return { ok: true };
}

// ---------------------------------------------------------------------------
// تبويب طلبات الاشتراك
// ---------------------------------------------------------------------------

function buildRequestRow(request, { studentsById, coursesById, methodsById }) {
  const student = studentsById.get(String(request.studentId));
  const course = coursesById.get(String(request.courseId));

  return {
    id: request.id,
    referenceNumber: request.referenceNumber,
    studentId: request.studentId,
    studentName: student?.name ?? UNKNOWN,
    studentPhone: student?.phone ?? "",
    gradeId: student?.grade ?? "",
    gradeLabel: getGradeLabel(student?.grade),
    courseId: request.courseId,
    courseTitle: course?.title ?? UNKNOWN,
    planLabel: getLabel(PLAN_LABELS, request.planId),
    amount: request.amount,
    transactionId: request.transactionId,
    paymentMethodName: methodsById.get(String(request.paymentMethodId))?.name ?? UNKNOWN,
    createdAt: request.createdAt,
    reviewedAt: request.reviewedAt ?? null,
    status: request.status,
    statusLabel: getLabel(REQUEST_STATUS_LABELS, request.status),
  };
}

export async function getMasterSubscriptionRequestsPage({
  search = "",
  grade = "all",
  courseId = "all",
  status = "all",
  page = 1,
  pageSize = 15,
} = {}) {
  const [requests, lookups] = await Promise.all([getSubscriptionRequests(), loadLookups()]);

  const rows = requests
    .map((request) => buildRequestRow(request, lookups))
    .filter((row) =>
      matchesSearch([row.studentName, row.referenceNumber, row.transactionId], search),
    )
    .filter((row) => matchesGradeAndCourse(row, grade, courseId))
    .filter((row) => status === "all" || row.status === status)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...paginate(rows, page, pageSize),
    filterOptions: await loadFilterOptions(lookups.coursesById),
  };
}

export async function getMasterSubscriptionRequestDetails(requestId) {
  const [request, lookups] = await Promise.all([
    getSubscriptionRequestById(requestId),
    loadLookups(),
  ]);

  if (!request) throw new Error("الطلب غير موجود.");

  const student = lookups.studentsById.get(String(request.studentId));

  return {
    ...buildRequestRow(request, lookups),
    studentEmail: student?.email ?? "",
  };
}

// القبول بيفعّل الاشتراك تلقائيًا (جوه approveSubscriptionRequest)
export async function approveMasterSubscriptionRequest(requestId) {
  await approveSubscriptionRequest(requestId);

  return { ok: true };
}

export async function rejectMasterSubscriptionRequest(requestId) {
  await rejectSubscriptionRequest(requestId);

  return { ok: true };
}

export async function deleteMasterSubscriptionRequest(requestId) {
  if (!(await deleteSubscriptionRequest(requestId))) throw new Error("الطلب غير موجود.");

  return { ok: true };
}

// بيحذف الطلبات فقط: الاشتراكات الفعلية بتفضل زي ما هي
export async function deleteAllMasterSubscriptionRequests() {
  return { deletedRequests: await deleteAllSubscriptionRequests() };
}

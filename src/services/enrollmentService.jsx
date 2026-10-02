import { v4 as uuidv4 } from "uuid";

import enrollments from "../data/enrollments";

export async function getEnrollments() {
  return [...enrollments];
}

export async function getEnrollmentsByStudentId(studentId) {
  return enrollments.filter((enrollment) => String(enrollment.studentId) === String(studentId));
}

// المصدر الوحيد لتعريف "الاشتراك النشط": الحالة active ولم ينتهِ تاريخه.
// أي مكان يحتاج يعرف هل الاشتراك نشط يستخدم هذه الدالة بدل فحص status بنفسه.
export function isEnrollmentActive(enrollment, now = Date.now()) {
  if (!enrollment || enrollment.status !== "active") return false;
  if (!enrollment.endsAt) return true;

  const end = new Date(enrollment.endsAt).getTime();

  return Number.isNaN(end) || end >= now;
}

export async function isStudentEnrolled(studentId, courseId) {
  return enrollments.some(
    (enrollment) =>
      String(enrollment.studentId) === String(studentId) &&
      String(enrollment.courseId) === String(courseId) &&
      isEnrollmentActive(enrollment),
  );
}

// يُستخدم عند قبول طلب اشتراك من لوحة المستر.
// التجديد يمدّ السجل القائم (status = active) حتى لو انتهى تاريخه، فلا يتكرر السجل.
export async function createEnrollment({
  studentId,
  courseId,
  planId = null,
  startsAt = new Date().toISOString(),
  endsAt = null,
  sourceRequestId = null,
}) {
  const existing = enrollments.find(
    (enrollment) =>
      String(enrollment.studentId) === String(studentId) &&
      String(enrollment.courseId) === String(courseId) &&
      enrollment.status === "active",
  );

  // تجديد اشتراك قائم: نمد تاريخ الانتهاء فقط
  if (existing) {
    const currentEnd = existing.endsAt ? new Date(existing.endsAt).getTime() : 0;
    const newEnd = endsAt ? new Date(endsAt).getTime() : 0;

    if (newEnd > currentEnd) {
      existing.endsAt = endsAt;
    }

    existing.planId = planId ?? existing.planId;

    return existing;
  }

  const newEnrollment = {
    id: `enrollment-${uuidv4()}`,
    studentId,
    courseId,
    planId,
    status: "active",
    startsAt,
    endsAt,
    sourceRequestId,
  };

  enrollments.push(newEnrollment);

  return newEnrollment;
}

export async function deleteEnrollmentsByStudentId(studentId) {
  let deletedCount = 0;
  for (let index = enrollments.length - 1; index >= 0; index -= 1) {
    if (String(enrollments[index].studentId) === String(studentId)) {
      enrollments.splice(index, 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

// حالة الاشتراك الفعلية: active / expired (انتهى تاريخه) / ended (أنهاه المستر)
export function getEnrollmentState(enrollment, now = Date.now()) {
  if (enrollment.status === "ended") return "ended";

  return isEnrollmentActive(enrollment, now) ? "active" : "expired";
}

export async function getEnrollmentById(enrollmentId) {
  const enrollment = enrollments.find((item) => String(item.id) === String(enrollmentId));

  return enrollment ? { ...enrollment } : null;
}

export async function updateEnrollment(enrollmentId, patch) {
  const enrollment = enrollments.find((item) => String(item.id) === String(enrollmentId));

  if (!enrollment) throw new Error("الاشتراك غير موجود.");

  Object.assign(enrollment, patch);

  return { ...enrollment };
}

export async function deleteEnrollmentsByCourseId(courseId) {
  let count = 0;

  for (let index = enrollments.length - 1; index >= 0; index -= 1) {
    if (String(enrollments[index].courseId) === String(courseId)) {
      enrollments.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

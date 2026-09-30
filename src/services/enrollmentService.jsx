import { v4 as uuidv4 } from "uuid";

import enrollments from "../data/enrollments";

export async function getEnrollments() {
  return [...enrollments];
}

export async function getEnrollmentsByStudentId(studentId) {
  return enrollments.filter(
    (enrollment) =>
      String(enrollment.studentId) === String(studentId),
  );
}

export async function isStudentEnrolled(studentId, courseId) {
  return enrollments.some(
    (enrollment) =>
      String(enrollment.studentId) === String(studentId) &&
      String(enrollment.courseId) === String(courseId) &&
      enrollment.status === "active",
  );
}

// يُستخدم عند قبول طلب اشتراك من لوحة المستر
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

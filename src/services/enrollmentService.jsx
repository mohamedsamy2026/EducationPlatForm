import enrollments from "../date/enrollments";

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
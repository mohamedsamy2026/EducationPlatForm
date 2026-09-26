import lessonAccess from "../date/lessonAccess";

export async function getLessonAccessByStudentId(studentId) {
  return lessonAccess.filter(
    (access) =>
      String(access.studentId) === String(studentId) &&
      access.status === "active",
  );
}

export async function getLessonAccessByStudentAndCourseId(
  studentId,
  courseId,
) {
  return lessonAccess.filter(
    (access) =>
      String(access.studentId) === String(studentId) &&
      String(access.courseId) === String(courseId) &&
      access.status === "active",
  );
}

export async function hasLessonAccess(
  studentId,
  courseId,
  lessonId,
) {
  return lessonAccess.some(
    (access) =>
      String(access.studentId) === String(studentId) &&
      String(access.courseId) === String(courseId) &&
      String(access.lessonId) === String(lessonId) &&
      access.status === "active",
  );
}

export async function grantLessonAccess({
  studentId,
  courseId,
  lessonId,
}) {
  const existingAccess = await hasLessonAccess(
    studentId,
    courseId,
    lessonId,
  );

  if (existingAccess) {
    return lessonAccess.find(
      (access) =>
        String(access.studentId) === String(studentId) &&
        String(access.courseId) === String(courseId) &&
        String(access.lessonId) === String(lessonId) &&
        access.status === "active",
    );
  }

  const newAccess = {
    id: `lesson-access-${crypto.randomUUID()}`,
    studentId,
    courseId,
    lessonId,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  lessonAccess.push(newAccess);

  return newAccess;
}
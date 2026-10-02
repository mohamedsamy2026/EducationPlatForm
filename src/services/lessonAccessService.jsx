import lessonAccess from "../data/lessonAccess";
import { v4 as uuidv4 } from "uuid";

export async function getLessonAccessByStudentId(studentId) {
  return lessonAccess.filter(
    (access) => String(access.studentId) === String(studentId) && access.status === "active",
  );
}

export async function getLessonAccessByStudentAndCourseId(studentId, courseId) {
  return lessonAccess.filter(
    (access) =>
      String(access.studentId) === String(studentId) &&
      String(access.courseId) === String(courseId) &&
      access.status === "active",
  );
}

export async function hasLessonAccess(studentId, courseId, lessonId) {
  return lessonAccess.some(
    (access) =>
      String(access.studentId) === String(studentId) &&
      String(access.courseId) === String(courseId) &&
      String(access.lessonId) === String(lessonId) &&
      access.status === "active",
  );
}

export async function grantLessonAccess({ studentId, courseId, lessonId }) {
  const existingAccess = await hasLessonAccess(studentId, courseId, lessonId);

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
    id: `lesson-access-${uuidv4()}`,
    studentId,
    courseId,
    lessonId,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  lessonAccess.push(newAccess);

  return newAccess;
}

export async function deleteLessonAccessByStudentId(studentId) {
  let deletedCount = 0;
  for (let index = lessonAccess.length - 1; index >= 0; index -= 1) {
    if (String(lessonAccess[index].studentId) === String(studentId)) {
      lessonAccess.splice(index, 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

// خدمات لوحة المستر
export async function getAllLessonAccess() {
  return lessonAccess
    .filter((access) => access.status === "active")
    .map((access) => ({ ...access }));
}

export async function getLessonAccessById(accessId) {
  const access = lessonAccess.find((item) => String(item.id) === String(accessId));

  return access ? { ...access } : null;
}

export async function revokeLessonAccess(accessId) {
  const index = lessonAccess.findIndex((item) => String(item.id) === String(accessId));

  if (index === -1) return false;

  lessonAccess.splice(index, 1);

  return true;
}

export async function deleteLessonAccessByCourseId(courseId) {
  let count = 0;

  for (let index = lessonAccess.length - 1; index >= 0; index -= 1) {
    if (String(lessonAccess[index].courseId) === String(courseId)) {
      lessonAccess.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

export async function deleteLessonAccessByLessonIds(lessonIds) {
  const ids = new Set(lessonIds.map(String));
  let count = 0;

  for (let index = lessonAccess.length - 1; index >= 0; index -= 1) {
    if (ids.has(String(lessonAccess[index].lessonId))) {
      lessonAccess.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

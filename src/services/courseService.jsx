import { v4 as uuidv4 } from "uuid";

import courses from "../data/courses";

function isPublished(course) {
  return course.published !== false;
}

// خدمات الطالب: المنشور فقط
export async function getCourses() {
  return courses.filter(isPublished).map((course) => ({ ...course }));
}

export async function getCourseById(courseId) {
  const course = courses.find((item) => String(item.id) === String(courseId) && isPublished(item));

  return course ? { ...course } : null;
}

// خدمات لوحة المستر: كل الكورسات سواء منشورة أو لا
export async function getAllCourses() {
  return courses.map((course) => ({ ...course }));
}

export async function getAnyCourseById(courseId) {
  const course = courses.find((item) => String(item.id) === String(courseId));

  return course ? { ...course } : null;
}

export async function createCourse(data) {
  const newCourse = {
    id: `course-${uuidv4().slice(0, 8)}`,
    published: false,
    ...data,
  };

  courses.push(newCourse);

  return { ...newCourse };
}

export async function updateCourse(courseId, patch) {
  const course = courses.find((item) => String(item.id) === String(courseId));

  if (!course) {
    throw new Error("الكورس غير موجود.");
  }

  Object.assign(course, patch);

  return { ...course };
}

export async function deleteCourse(courseId) {
  const index = courses.findIndex((item) => String(item.id) === String(courseId));

  if (index === -1) return false;

  courses.splice(index, 1);

  return true;
}

export async function deleteAllCourses() {
  const count = courses.length;

  courses.splice(0, courses.length);

  return count;
}

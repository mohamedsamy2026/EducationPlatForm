import courses from "../date/courses";

export async function getCourses() {
  return [...courses];
}

export async function getCourseById(courseId) {
  return (
    courses.find(
      (course) => String(course.id) === String(courseId),
    ) ?? null
  );
}
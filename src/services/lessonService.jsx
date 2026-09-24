import lessons from "../date/lessons";

export async function getUnitsByCourseId(courseId) {
  return lessons
    .filter(
      (unit) =>
        String(unit.courseId) === String(courseId),
    )
    .map((unit) => ({
      ...unit,
      lessons: Array.isArray(unit.lessons)
        ? unit.lessons
        : [],
    }))
    .filter((unit) => unit.lessons.length > 0);
}
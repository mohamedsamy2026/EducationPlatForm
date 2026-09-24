import exams from "../date/exams";

export async function getExamsByCourseId(courseId) {
  return exams.filter(
    (exam) => String(exam.courseId) === String(courseId),
  );
}

export async function getExamById(examId) {
  return (
    exams.find(
      (exam) => String(exam.id) === String(examId),
    ) ?? null
  );
}
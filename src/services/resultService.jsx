import results from "../date/results";

export async function getResultsByStudentId(studentId) {
  return results.filter(
    (result) => String(result.studentId) === String(studentId),
  );
}

export async function getResultByExamId(examId, studentId) {
  return (
    results.find(
      (result) =>
        String(result.examId) === String(examId) &&
        (studentId === undefined ||
          String(result.studentId) === String(studentId)),
    ) ?? null
  );
}
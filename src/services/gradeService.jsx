import grades from "../data/grades";

export async function getGrades() {
  return grades.map((grade) => ({ ...grade }));
}

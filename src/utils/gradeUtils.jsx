import grades from "../data/grades";

export function getGradeLabel(gradeId) {
  return grades.find((grade) => grade.id === gradeId)?.label ?? "غير محدد";
}
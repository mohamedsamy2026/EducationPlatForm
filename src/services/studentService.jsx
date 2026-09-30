import students from "../data/students";

export async function getCurrentStudent() {
  return students[0];
}

export async function getStudents() {
  return [...students];
}

export async function getStudentById(studentId) {
  const student = students.find((item) => String(item.id) === String(studentId));
  return student ? { ...student } : null;
}

export async function updateStudent(studentId, updates = {}) {
  const student = students.find((item) => String(item.id) === String(studentId));
  if (!student) throw new Error("الطالب غير موجود.");

  const editableFields = ["name", "email", "phone", "guardianPhone", "grade", "governorate"];
  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) student[field] = updates[field];
  }
  return { ...student };
}

export async function deleteStudent(studentId) {
  const index = students.findIndex((item) => String(item.id) === String(studentId));
  if (index === -1) return null;
  return { ...students.splice(index, 1)[0] };
}

export async function deleteAllStudents() {
  const removed = students.splice(0, students.length);
  return removed.map((student) => ({ ...student }));
}

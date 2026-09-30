import students from "../data/students";

export async function getCurrentStudent() {
  return students[0];
}

export async function getStudents() {
  return [...students];
}

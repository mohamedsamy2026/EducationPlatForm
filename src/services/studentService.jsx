import students from "../data/students";

export async function getCurrentStudent() {
  return students[0];
}

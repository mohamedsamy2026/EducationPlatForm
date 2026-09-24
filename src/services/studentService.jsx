import students from "../date/students";

export async function getCurrentStudent() {
  return students[0];
}

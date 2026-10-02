import { v4 as uuidv4 } from "uuid";

import lessons from "../data/lessons";

// data/lessons.jsx عبارة عن مصفوفة وحدات، وكل وحدة فيها مصفوفة دروس.

// خدمات الطالب: الوحدات اللي فيها دروس فقط
export async function getUnitsByCourseId(courseId) {
  return lessons
    .filter((unit) => String(unit.courseId) === String(courseId))
    .map((unit) => ({
      ...unit,
      lessons: Array.isArray(unit.lessons) ? unit.lessons : [],
    }))
    .filter((unit) => unit.lessons.length > 0);
}

// خدمات لوحة المستر
function findUnit(unitId) {
  return lessons.find((unit) => String(unit.id) === String(unitId)) ?? null;
}

function cloneUnit(unit) {
  return { ...unit, lessons: (unit.lessons ?? []).map((lesson) => ({ ...lesson })) };
}

export async function getAllUnitsByCourseId(courseId) {
  return lessons.filter((unit) => String(unit.courseId) === String(courseId)).map(cloneUnit);
}

export async function getAllUnits() {
  return lessons.map(cloneUnit);
}

export async function getUnitById(unitId) {
  const unit = findUnit(unitId);

  return unit ? cloneUnit(unit) : null;
}

export async function createUnit({ courseId, title }) {
  const unit = {
    id: `unit-${uuidv4().slice(0, 8)}`,
    courseId,
    title,
    lessons: [],
  };

  lessons.push(unit);

  return cloneUnit(unit);
}

export async function updateUnit(unitId, patch) {
  const unit = findUnit(unitId);

  if (!unit) throw new Error("الوحدة غير موجودة.");

  Object.assign(unit, patch);

  return cloneUnit(unit);
}

export async function deleteUnit(unitId) {
  const index = lessons.findIndex((unit) => String(unit.id) === String(unitId));

  if (index === -1) return null;

  const [removed] = lessons.splice(index, 1);

  return cloneUnit(removed);
}

export async function deleteUnitsByCourseId(courseId) {
  const removed = [];

  for (let index = lessons.length - 1; index >= 0; index -= 1) {
    if (String(lessons[index].courseId) === String(courseId)) {
      removed.push(...lessons.splice(index, 1));
    }
  }

  return removed.map(cloneUnit);
}

// تحريك وحدة لأعلى/أسفل بين وحدات نفس الكورس
export async function moveUnit(unitId, direction) {
  const unit = findUnit(unitId);

  if (!unit) throw new Error("الوحدة غير موجودة.");

  const siblings = lessons.filter((item) => String(item.courseId) === String(unit.courseId));
  const position = siblings.indexOf(unit);
  const target = siblings[direction === "up" ? position - 1 : position + 1];

  if (!target) return false;

  const firstIndex = lessons.indexOf(unit);
  const secondIndex = lessons.indexOf(target);

  [lessons[firstIndex], lessons[secondIndex]] = [lessons[secondIndex], lessons[firstIndex]];

  return true;
}

export async function createLesson(unitId, data) {
  const unit = findUnit(unitId);

  if (!unit) throw new Error("الوحدة غير موجودة.");

  const lesson = { id: `lesson-${uuidv4().slice(0, 8)}`, ...data };

  unit.lessons.push(lesson);

  return { ...lesson };
}

export async function updateLesson(lessonId, patch) {
  for (const unit of lessons) {
    const lesson = unit.lessons.find((item) => String(item.id) === String(lessonId));

    if (lesson) {
      Object.assign(lesson, patch);

      return { ...lesson };
    }
  }

  throw new Error("الدرس غير موجود.");
}

export async function deleteLesson(lessonId) {
  for (const unit of lessons) {
    const index = unit.lessons.findIndex((item) => String(item.id) === String(lessonId));

    if (index !== -1) {
      const [removed] = unit.lessons.splice(index, 1);

      return { ...removed };
    }
  }

  return null;
}

export async function moveLesson(lessonId, direction) {
  for (const unit of lessons) {
    const index = unit.lessons.findIndex((item) => String(item.id) === String(lessonId));

    if (index !== -1) {
      const target = direction === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= unit.lessons.length) return false;

      [unit.lessons[index], unit.lessons[target]] = [unit.lessons[target], unit.lessons[index]];

      return true;
    }
  }

  throw new Error("الدرس غير موجود.");
}

// كل الدروس مع بيانات الكورس والوحدة (للبحث وصلاحيات الدروس)
export async function getAllLessons() {
  return lessons.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      ...lesson,
      courseId: unit.courseId,
      unitId: unit.id,
      unitTitle: unit.title,
    })),
  );
}

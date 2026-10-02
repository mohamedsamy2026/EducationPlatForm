import { v4 as uuidv4 } from "uuid";

import books from "../data/books";

// availability: "available" (الافتراضي) أو "unavailable"
export function isBookAvailable(book) {
  return book.availability !== "unavailable";
}

export async function getBooks() {
  return books.map((book) => ({ ...book }));
}

export async function getBookById(bookId) {
  const book = books.find((item) => String(item.id) === String(bookId));

  return book ? { ...book } : null;
}

export async function getBooksByStudentGrade(grade) {
  return books.filter((book) => String(book.grade) === String(grade));
}

// خدمات لوحة المستر
export async function createBook(data) {
  const book = {
    id: `BOOK-${Math.floor(1000 + Math.random() * 9000)}-${uuidv4().slice(0, 4)}`,
    availability: "available",
    ...data,
  };

  books.push(book);

  return { ...book };
}

export async function updateBook(bookId, patch) {
  const book = books.find((item) => String(item.id) === String(bookId));

  if (!book) throw new Error("الكتاب غير موجود.");

  Object.assign(book, patch);

  return { ...book };
}

export async function deleteBook(bookId) {
  const index = books.findIndex((item) => String(item.id) === String(bookId));

  if (index === -1) return false;

  books.splice(index, 1);

  return true;
}

export async function deleteAllBooks() {
  const ids = books.map((book) => book.id);

  books.splice(0, books.length);

  return ids;
}

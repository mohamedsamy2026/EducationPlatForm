import books from "../date/books";

export async function getBooks() {
  return [...books];
}

export async function getBookById(bookId) {
  return books.find((book) => String(book.id) === String(bookId)) ?? null;
}

export async function getBooksByStudentGrade(grade) {
  return books.filter((book) => String(book.grade) === String(grade));
}

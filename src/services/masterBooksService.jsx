import {
  createBook,
  deleteAllBooks,
  deleteBook,
  getBookById,
  getBooks,
  isBookAvailable,
  updateBook,
} from "./bookService";
import { getBookPurchases, deleteBookPurchasesByBookId } from "./bookPurchasesService";
import { deleteBookPurchaseRequestsByBookId, getBookPurchaseRequests } from "./bookPurchaseService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { matchesSearch, paginate } from "../utils/paginate";
import { BOOK_AVAILABILITY_LABELS, getLabel } from "../constants/statusLabels";

function requireText(value, message) {
  const text = String(value ?? "").trim();

  if (!text) throw new Error(message);

  return text;
}

async function gradeOptions() {
  const grades = await getGrades();

  return grades.map((grade) => ({ id: grade.id, label: grade.label, stage: grade.stage }));
}

function buildRow(book, purchases, requests) {
  const state = isBookAvailable(book) ? "available" : "unavailable";

  return {
    id: book.id,
    title: book.title,
    description: book.description ?? "",
    gradeId: book.grade,
    gradeLabel: getGradeLabel(book.grade),
    category: book.category ?? "",
    price: book.price,
    image: book.image,
    availability: state,
    availabilityLabel: getLabel(BOOK_AVAILABILITY_LABELS, state),
    buyersCount: purchases.filter((item) => String(item.bookId) === String(book.id)).length,
    requestsCount: requests.filter((item) => String(item.bookId) === String(book.id)).length,
  };
}

export async function getMasterBooksSummary() {
  const books = await getBooks();

  return {
    total: books.length,
    available: books.filter((book) => isBookAvailable(book)).length,
    unavailable: books.filter((book) => !isBookAvailable(book)).length,
  };
}

// البحث باسم الكتاب أو رقمه
export async function getMasterBooksPage({
  search = "",
  grade = "all",
  availability = "all",
  page = 1,
  pageSize = 9,
} = {}) {
  const [books, purchases, requests, options] = await Promise.all([
    getBooks(),
    getBookPurchases(),
    getBookPurchaseRequests(),
    gradeOptions(),
  ]);

  const rows = books
    .map((book) => buildRow(book, purchases, requests))
    .filter((row) => matchesSearch([row.title, row.id], search))
    .filter((row) => grade === "all" || String(row.gradeId) === String(grade))
    .filter((row) => availability === "all" || row.availability === availability);

  return { ...paginate(rows, page, pageSize), gradeOptions: options };
}

export async function getMasterBookPreview(bookId) {
  const [book, purchases, requests] = await Promise.all([
    getBookById(bookId),
    getBookPurchases(),
    getBookPurchaseRequests(),
  ]);

  if (!book) throw new Error("الكتاب غير موجود.");

  return buildRow(book, purchases, requests);
}

export async function getMasterBookForm(bookId = null) {
  const options = await gradeOptions();

  if (!bookId) {
    return {
      gradeOptions: options,
      form: {
        title: "",
        description: "",
        grade: options[0]?.id ?? "",
        price: "",
        image: "",
        availability: "available",
      },
    };
  }

  const book = await getBookById(bookId);

  if (!book) throw new Error("الكتاب غير موجود.");

  return {
    gradeOptions: options,
    form: {
      title: book.title,
      description: book.description ?? "",
      grade: book.grade,
      price: String(book.price ?? ""),
      image: book.image ?? "",
      availability: isBookAvailable(book) ? "available" : "unavailable",
    },
  };
}

export async function saveMasterBook(bookId, form) {
  const title = requireText(form.title, "اسم الكتاب مطلوب.");
  const gradeId = requireText(form.grade, "الصف الدراسي مطلوب.");
  const price = Number(form.price);

  if (form.price === "" || Number.isNaN(price) || price < 0)
    throw new Error("سعر الكتاب غير صحيح.");

  const grades = await gradeOptions();
  const stage = grades.find((item) => item.id === gradeId)?.stage ?? "";

  const data = {
    title,
    grade: gradeId,
    category: stage,
    description: String(form.description ?? "").trim(),
    price,
    image: form.image || "",
    availability: form.availability === "unavailable" ? "unavailable" : "available",
  };

  if (bookId) {
    const book = await updateBook(bookId, data);

    return { id: book.id };
  }

  const book = await createBook(data);

  return { id: book.id };
}

// الكتاب غير المتاح: مفيش طلب جديد، لكن اللي اشتراه قبل كده يفضل عنده
export async function setMasterBookAvailability(bookId, availability) {
  await updateBook(bookId, {
    availability: availability === "unavailable" ? "unavailable" : "available",
  });

  return { ok: true };
}

export async function getMasterBookDeleteSummary(bookId) {
  const [book, purchases, requests] = await Promise.all([
    getBookById(bookId),
    getBookPurchases(),
    getBookPurchaseRequests(),
  ]);

  if (!book) throw new Error("الكتاب غير موجود.");

  return {
    title: book.title,
    buyersCount: purchases.filter((item) => String(item.bookId) === String(bookId)).length,
    requestsCount: requests.filter((item) => String(item.bookId) === String(bookId)).length,
  };
}

export async function getMasterBooksDeleteAllSummary() {
  const [books, purchases, requests] = await Promise.all([
    getBooks(),
    getBookPurchases(),
    getBookPurchaseRequests(),
  ]);

  return {
    booksCount: books.length,
    buyersCount: purchases.length,
    requestsCount: requests.length,
  };
}

// ملاحظة Supabase: الحذف المتسلسل هيبقى CASCADE أو RPC واحدة، والصفحات متتغيرش.
export async function deleteMasterBook(bookId) {
  const book = await getBookById(bookId);

  if (!book) throw new Error("الكتاب غير موجود.");

  await deleteBookPurchaseRequestsByBookId(bookId);
  await deleteBookPurchasesByBookId(bookId);
  await deleteBook(bookId);

  return { title: book.title };
}

export async function deleteAllMasterBooks() {
  const ids = await deleteAllBooks();

  for (const id of ids) {
    await deleteBookPurchaseRequestsByBookId(id);
    await deleteBookPurchasesByBookId(id);
  }

  return { deletedBooks: ids.length };
}

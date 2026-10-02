import {
  approveBookPurchaseRequest,
  deleteAllBookPurchaseRequests,
  deleteBookPurchaseRequest,
  getBookPurchaseRequestById,
  getBookPurchaseRequests,
  rejectBookPurchaseRequest,
} from "./bookPurchaseService";
import { hasBookPurchase } from "./bookPurchasesService";
import { getBooks } from "./bookService";
import { getStudents } from "./studentService";
import { getAllPaymentMethods } from "./paymentMethodService";
import { getGrades } from "./gradeService";
import { getGradeLabel } from "../utils/gradeUtils";
import { matchesSearch, paginate } from "../utils/paginate";
import {
  REQUEST_STATUS_LABELS,
  UNKNOWN_LABEL as UNKNOWN,
  getLabel,
} from "../constants/statusLabels";

async function loadLookups() {
  const [students, books, methods] = await Promise.all([
    getStudents(),
    getBooks(),
    getAllPaymentMethods(),
  ]);

  return {
    studentsById: new Map(students.map((item) => [String(item.id), item])),
    booksById: new Map(books.map((item) => [String(item.id), item])),
    methodsById: new Map(methods.map((item) => [String(item.id), item])),
  };
}

function buildRow(request, { studentsById, booksById, methodsById }) {
  const student = studentsById.get(String(request.studentId));
  const book = booksById.get(String(request.bookId));

  return {
    id: request.id,
    referenceNumber: request.referenceNumber,
    studentId: request.studentId,
    studentName: student?.name ?? UNKNOWN,
    studentPhone: student?.phone ?? "",
    gradeId: student?.grade ?? "",
    gradeLabel: getGradeLabel(student?.grade),
    bookId: request.bookId,
    bookTitle: book?.title ?? "كتاب محذوف",
    transactionId: request.transactionId,
    amount: request.amount,
    paymentMethodName: methodsById.get(String(request.paymentMethodId))?.name ?? UNKNOWN,
    createdAt: request.createdAt,
    reviewedAt: request.reviewedAt ?? null,
    status: request.status,
    statusLabel: getLabel(REQUEST_STATUS_LABELS, request.status),
  };
}

export async function getMasterBookRequestsSummary() {
  const requests = await getBookPurchaseRequests();

  return {
    total: requests.length,
    pending: requests.filter((item) => item.status === "pending").length,
    approved: requests.filter((item) => item.status === "approved").length,
  };
}

// البحث: اسم الطالب، رقم الطلب، رقم التحويل فقط
export async function getMasterBookRequestsPage({
  search = "",
  grade = "all",
  bookId = "all",
  status = "all",
  page = 1,
  pageSize = 15,
} = {}) {
  const [requests, lookups, grades] = await Promise.all([
    getBookPurchaseRequests(),
    loadLookups(),
    getGrades(),
  ]);

  const rows = requests
    .map((request) => buildRow(request, lookups))
    .filter((row) =>
      matchesSearch([row.studentName, row.referenceNumber, row.transactionId], search),
    )
    .filter((row) => grade === "all" || String(row.gradeId) === String(grade))
    .filter((row) => bookId === "all" || String(row.bookId) === String(bookId))
    .filter((row) => status === "all" || row.status === status)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...paginate(rows, page, pageSize),
    filterOptions: {
      grades: grades.map((item) => ({ id: item.id, label: item.label })),
      books: [...lookups.booksById.values()].map((book) => ({ id: book.id, label: book.title })),
    },
  };
}

export async function getMasterBookRequestDetails(requestId) {
  const [request, lookups] = await Promise.all([
    getBookPurchaseRequestById(requestId),
    loadLookups(),
  ]);

  if (!request) throw new Error("الطلب غير موجود.");

  const book = lookups.booksById.get(String(request.bookId));

  return {
    ...buildRow(request, lookups),
    bookPrice: book?.price ?? null,
    studentOwnsBook: await hasBookPurchase(request.studentId, request.bookId),
  };
}

// القبول بيسجل الكتاب كمشترى للطالب (سجل ملكية منفصل عن الطلب)
export async function approveMasterBookRequest(requestId) {
  await approveBookPurchaseRequest(requestId);

  return { ok: true };
}

export async function rejectMasterBookRequest(requestId) {
  await rejectBookPurchaseRequest(requestId);

  return { ok: true };
}

// حذف الطلب (حتى المقبول) ما بيلغيش حق الطالب في الكتاب
export async function deleteMasterBookRequest(requestId) {
  if (!(await deleteBookPurchaseRequest(requestId))) throw new Error("الطلب غير موجود.");

  return { ok: true };
}

export async function deleteAllMasterBookRequests() {
  return { deletedRequests: await deleteAllBookPurchaseRequests() };
}

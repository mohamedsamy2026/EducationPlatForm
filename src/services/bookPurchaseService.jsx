import { v4 as uuidv4 } from "uuid";

import bookPurchaseRequests from "../data/bookPurchaseRequests";

import { getBookById, isBookAvailable } from "./bookService";
import { createBookPurchase, hasBookPurchase } from "./bookPurchasesService";

function generateReferenceNumber() {
  return `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export async function getPendingBookPurchaseRequest(studentId, bookId) {
  return (
    bookPurchaseRequests.find(
      (request) =>
        String(request.studentId) === String(studentId) &&
        String(request.bookId) === String(bookId) &&
        request.status === "pending",
    ) ?? null
  );
}

export async function getBookPurchaseRequestsByStudentId(studentId) {
  return [...bookPurchaseRequests]
    .filter((request) => String(request.studentId) === String(studentId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBookPurchaseRequest({
  studentId,
  bookId,
  amount,
  transactionId,
  paymentMethodId,
}) {
  const normalizedTransactionId = String(transactionId ?? "").trim();

  if (!normalizedTransactionId) {
    throw new Error("رقم عملية التحويل مطلوب.");
  }

  const existingRequest = await getPendingBookPurchaseRequest(studentId, bookId);

  if (existingRequest) {
    return existingRequest;
  }

  if (await hasBookPurchase(studentId, bookId)) {
    throw new Error("تم شراء هذا الكتاب من قبل.");
  }

  const book = await getBookById(bookId);

  if (!book || !isBookAvailable(book)) {
    throw new Error("هذا الكتاب غير متاح للشراء حاليًا.");
  }

  const newRequest = {
    id: `book-purchase-request-${uuidv4()}`,
    referenceNumber: generateReferenceNumber(),
    studentId,
    bookId,
    amount,
    transactionId: normalizedTransactionId,
    paymentMethodId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookPurchaseRequests.push(newRequest);

  return newRequest;
}

export async function getBookPurchaseRequests() {
  return [...bookPurchaseRequests];
}

export async function getBookPurchaseRequestById(requestId) {
  return bookPurchaseRequests.find((request) => String(request.id) === String(requestId)) ?? null;
}

export async function approveBookPurchaseRequest(requestId) {
  const request = await getBookPurchaseRequestById(requestId);

  if (!request) {
    throw new Error("الطلب غير موجود.");
  }

  if (request.status !== "pending") {
    throw new Error("تمت مراجعة هذا الطلب من قبل.");
  }

  await createBookPurchase({
    studentId: request.studentId,
    bookId: request.bookId,
    requestId: request.id,
  });

  request.status = "approved";
  request.reviewedAt = new Date().toISOString();

  return request;
}

export async function rejectBookPurchaseRequest(requestId) {
  const request = await getBookPurchaseRequestById(requestId);

  if (!request) {
    throw new Error("الطلب غير موجود.");
  }

  if (request.status !== "pending") {
    throw new Error("تمت مراجعة هذا الطلب من قبل.");
  }

  request.status = "rejected";
  request.reviewedAt = new Date().toISOString();

  return request;
}

export async function deleteBookPurchaseRequestsByStudentId(studentId) {
  let deletedCount = 0;
  for (let index = bookPurchaseRequests.length - 1; index >= 0; index -= 1) {
    if (String(bookPurchaseRequests[index].studentId) === String(studentId)) {
      bookPurchaseRequests.splice(index, 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

export async function deleteBookPurchaseRequest(requestId) {
  const index = bookPurchaseRequests.findIndex(
    (request) => String(request.id) === String(requestId),
  );

  if (index === -1) return false;

  bookPurchaseRequests.splice(index, 1);

  return true;
}

export async function deleteAllBookPurchaseRequests() {
  const count = bookPurchaseRequests.length;

  bookPurchaseRequests.splice(0, bookPurchaseRequests.length);

  return count;
}

export async function deleteBookPurchaseRequestsByBookId(bookId) {
  let count = 0;

  for (let index = bookPurchaseRequests.length - 1; index >= 0; index -= 1) {
    if (String(bookPurchaseRequests[index].bookId) === String(bookId)) {
      bookPurchaseRequests.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

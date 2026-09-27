import { v4 as uuidv4 } from "uuid";

import bookPurchaseRequests from "../date/bookPurchaseRequests";

function generateReferenceNumber() {
  return `MK-${uuidv4().slice(0, 8).toUpperCase()}`;
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

  const existingRequest = await getPendingBookPurchaseRequest(
    studentId,
    bookId,
  );

  if (existingRequest) {
    return existingRequest;
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

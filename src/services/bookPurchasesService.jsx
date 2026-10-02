import { v4 as uuidv4 } from "uuid";

import bookPurchases from "../data/bookPurchases";

// سجل ملكية الكتب: منفصل عن طلبات الشراء، فحذف الطلب ما بيلغيش حق الطالب في الكتاب.

export async function getBookPurchases() {
  return bookPurchases.map((purchase) => ({ ...purchase }));
}

export async function getPurchasedBookIdsByStudentId(studentId) {
  return bookPurchases
    .filter((purchase) => String(purchase.studentId) === String(studentId))
    .map((purchase) => String(purchase.bookId));
}

export async function hasBookPurchase(studentId, bookId) {
  return bookPurchases.some(
    (purchase) =>
      String(purchase.studentId) === String(studentId) &&
      String(purchase.bookId) === String(bookId),
  );
}

export async function createBookPurchase({ studentId, bookId, requestId = null }) {
  const existing = bookPurchases.find(
    (purchase) =>
      String(purchase.studentId) === String(studentId) &&
      String(purchase.bookId) === String(bookId),
  );

  if (existing) return { ...existing };

  const purchase = {
    id: `book-purchase-record-${uuidv4().slice(0, 8)}`,
    studentId,
    bookId,
    requestId,
    purchasedAt: new Date().toISOString(),
  };

  bookPurchases.push(purchase);

  return { ...purchase };
}

export async function deleteBookPurchasesByStudentId(studentId) {
  let count = 0;

  for (let index = bookPurchases.length - 1; index >= 0; index -= 1) {
    if (String(bookPurchases[index].studentId) === String(studentId)) {
      bookPurchases.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

export async function deleteBookPurchasesByBookId(bookId) {
  let count = 0;

  for (let index = bookPurchases.length - 1; index >= 0; index -= 1) {
    if (String(bookPurchases[index].bookId) === String(bookId)) {
      bookPurchases.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

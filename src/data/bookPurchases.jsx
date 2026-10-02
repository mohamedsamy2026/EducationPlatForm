// سجل ملكية الكتب (منفصل عن الطلبات): بيتسجل عند قبول الطلب، وحذف الطلب ما بيلغيه.
const bookPurchases = [
  {
    id: "book-purchase-record-1",
    studentId: "student-2",
    bookId: "book-1",
    requestId: null,
    purchasedAt: "2026-09-12T12:00:00+03:00",
  },
  {
    id: "book-purchase-record-2",
    studentId: "student-4",
    bookId: "book-3",
    requestId: null,
    purchasedAt: "2026-09-15T12:00:00+03:00",
  },
  {
    id: "book-purchase-record-3",
    studentId: "student-6",
    bookId: "book-4",
    requestId: null,
    purchasedAt: "2026-09-20T12:00:00+03:00",
  },
];

export default bookPurchases;

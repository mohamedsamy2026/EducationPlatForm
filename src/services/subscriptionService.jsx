import subscriptionRequests from "../date/subscriptionRequests";

import { v4 as uuidv4 } from "uuid";

function generateReferenceNumber() {
  const uniquePart = uuidv4().slice(0, 8).toUpperCase();

  return `MK-${uniquePart}`;
}

export async function getSubscriptionRequestsByStudentId(studentId) {
  return subscriptionRequests.filter(
    (request) => String(request.studentId) === String(studentId),
  );
}

export async function getPendingSubscriptionRequest({
  studentId,
  courseId,
  accessType = "course",
  planId,
  lessonId,
}) {
  return (
    subscriptionRequests.find((request) => {
      const sameStudent = String(request.studentId) === String(studentId);

      const sameCourse = String(request.courseId) === String(courseId);

      const sameType = request.accessType === accessType;

      if (!sameStudent || !sameCourse || !sameType) {
        return false;
      }

      if (accessType === "lesson") {
        return (
          String(request.lessonId) === String(lessonId) &&
          request.status === "pending"
        );
      }

      return (
        String(request.planId) === String(planId) &&
        request.status === "pending"
      );
    }) ?? null
  );
}

export async function createSubscriptionRequest({
  studentId,
  courseId,
  accessType = "course",
  planId = null,
  lessonId = null,
  amount,
  transactionId,
  paymentMethodId,
}) {
  const normalizedTransactionId = String(transactionId ?? "").trim();

  if (!normalizedTransactionId) {
    throw new Error("رقم عملية التحويل مطلوب.");
  }

  if (accessType === "course" && !planId) {
    throw new Error("نوع اشتراك الكورس مطلوب.");
  }

  if (accessType === "lesson" && !lessonId) {
    throw new Error("الحصة المطلوبة غير محددة.");
  }

  const existingPendingRequest = await getPendingSubscriptionRequest({
    studentId,
    courseId,
    accessType,
    planId,
    lessonId,
  });

  if (existingPendingRequest) {
    return existingPendingRequest;
  }

  const newRequest = {
    id: `subscription-request-${uuidv4()}`,
    referenceNumber: generateReferenceNumber(),

    studentId,
    courseId,

    accessType,

    planId: accessType === "course" ? planId : null,

    lessonId: accessType === "lesson" ? lessonId : null,

    amount,

    transactionId: normalizedTransactionId,

    paymentMethodId,

    status: "pending",

    createdAt: new Date().toISOString(),
  };

  subscriptionRequests.push(newRequest);

  return newRequest;
}

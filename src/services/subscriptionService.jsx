import subscriptionRequests from "../data/subscriptionRequests";

import { v4 as uuidv4 } from "uuid";

import { createEnrollment } from "./enrollmentService";

import { grantLessonAccess } from "./lessonAccessService";

// مدة كل خطة بالأشهر (عدّلها لو مدة الترم مختلفة)
const PLAN_DURATION_MONTHS = {
  monthly: 1,
  term: 4,
};

function addMonths(date, months) {
  const result = new Date(date);

  result.setMonth(result.getMonth() + months);

  return result;
}

function generateReferenceNumber() {
  const uniquePart = uuidv4().slice(0, 8).toUpperCase();

  return `MK-${uniquePart}`;
}

export async function getSubscriptionRequestsByStudentId(studentId) {
  return subscriptionRequests.filter((request) => String(request.studentId) === String(studentId));
}

export async function getPendingSubscriptionRequest({
  studentId,
  courseId,
  planId,
  accessType = "course",
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
        return String(request.lessonId) === String(lessonId) && request.status === "pending";
      }

      return String(request.planId) === String(planId) && request.status === "pending";
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

export async function getSubscriptionRequests() {
  return [...subscriptionRequests];
}

export async function getSubscriptionRequestById(requestId) {
  return subscriptionRequests.find((request) => String(request.id) === String(requestId)) ?? null;
}

export async function approveSubscriptionRequest(requestId) {
  const request = await getSubscriptionRequestById(requestId);

  if (!request) {
    throw new Error("الطلب غير موجود.");
  }

  if (request.status !== "pending") {
    throw new Error("تمت مراجعة هذا الطلب من قبل.");
  }

  if (request.accessType === "lesson") {
    await grantLessonAccess({
      studentId: request.studentId,
      courseId: request.courseId,
      lessonId: request.lessonId,
    });
  } else {
    const startsAt = new Date();

    const endsAt = addMonths(startsAt, PLAN_DURATION_MONTHS[request.planId] ?? 1);

    await createEnrollment({
      studentId: request.studentId,
      courseId: request.courseId,
      planId: request.planId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      sourceRequestId: request.id,
    });
  }

  request.status = "approved";
  request.reviewedAt = new Date().toISOString();

  return request;
}

export async function rejectSubscriptionRequest(requestId) {
  const request = await getSubscriptionRequestById(requestId);

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

export async function deleteSubscriptionRequestsByStudentId(studentId) {
  let deletedCount = 0;
  for (let index = subscriptionRequests.length - 1; index >= 0; index -= 1) {
    if (String(subscriptionRequests[index].studentId) === String(studentId)) {
      subscriptionRequests.splice(index, 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

export async function deleteSubscriptionRequest(requestId) {
  const index = subscriptionRequests.findIndex(
    (request) => String(request.id) === String(requestId),
  );

  if (index === -1) return false;

  subscriptionRequests.splice(index, 1);

  return true;
}

export async function deleteAllSubscriptionRequests() {
  const count = subscriptionRequests.length;

  subscriptionRequests.splice(0, subscriptionRequests.length);

  return count;
}

export async function deleteSubscriptionRequestsByCourseId(courseId) {
  let count = 0;

  for (let index = subscriptionRequests.length - 1; index >= 0; index -= 1) {
    if (String(subscriptionRequests[index].courseId) === String(courseId)) {
      subscriptionRequests.splice(index, 1);
      count += 1;
    }
  }

  return count;
}

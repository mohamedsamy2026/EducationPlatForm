import subscriptionRequests from "../date/subscriptionRequests";

function generateReferenceNumber() {
  const uniquePart = Date.now().toString().slice(-6);

  return `MK-${uniquePart}`;
}

export async function getSubscriptionRequestsByStudentId(studentId) {
  return subscriptionRequests.filter(
    (request) => String(request.studentId) === String(studentId),
  );
}

export async function getPendingSubscriptionRequest(studentId, courseId) {
  return (
    subscriptionRequests.find(
      (request) =>
        String(request.studentId) === String(studentId) &&
        String(request.courseId) === String(courseId) &&
        request.status === "pending",
    ) ?? null
  );
}

export async function createSubscriptionRequest({
  studentId,
  courseId,
  planId,
  amount,
  transactionId,
  paymentMethodId,
}) {
  const normalizedTransactionId = String(transactionId ?? "").trim();

  if (!normalizedTransactionId) {
    throw new Error("رقم عملية التحويل مطلوب.");
  }

  const existingPendingRequest = await getPendingSubscriptionRequest(
    studentId,
    courseId,
  );

  if (existingPendingRequest) {
    return existingPendingRequest;
  }

  const newRequest = {
    id: `subscription-request-${Date.now()}`,
    referenceNumber: generateReferenceNumber(),
    studentId,
    courseId,
    planId,
    amount,
    transactionId: normalizedTransactionId,
    paymentMethodId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  subscriptionRequests.push(newRequest);

  return newRequest;
}

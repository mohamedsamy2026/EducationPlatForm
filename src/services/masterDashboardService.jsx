import { getStudents } from "./studentService";
import { getCourses } from "./courseService";
import { getExams } from "./examService";
import { getResults } from "./resultService";
import { getEnrollments } from "./enrollmentService";
import { getSubscriptionRequests } from "./subscriptionService";
import { getBookPurchaseRequests } from "./bookPurchaseService";

import { getGradeLabel } from "../utils/gradeUtils";

const UNKNOWN = "غير محدد";

function toTime(value) {
  return new Date(value).getTime();
}

function getResultPercentage(result) {
  if (!result || Number(result.total) <= 0) {
    return 0;
  }

  return Math.round((Number(result.score) / Number(result.total)) * 100);
}

// يحوّل المصفوفة لـ Map عشان نتجنب find جوه map
function indexById(items) {
  return new Map(items.map((item) => [String(item.id), item]));
}

export async function getMasterDashboardSummary() {
  const [
    students,
    courses,
    exams,
    results,
    enrollments,
    subscriptionRequests,
    bookPurchaseRequests,
  ] = await Promise.all([
    getStudents(),
    getCourses(),
    getExams(),
    getResults(),
    getEnrollments(),
    getSubscriptionRequests(),
    getBookPurchaseRequests(),
  ]);

  const studentsById = indexById(students);
  const coursesById = indexById(courses);
  const examsById = indexById(exams);

  const studentName = (id) => studentsById.get(String(id))?.name ?? UNKNOWN;
  const courseTitle = (id) => coursesById.get(String(id))?.title ?? UNKNOWN;
  const examTitle = (id) => examsById.get(String(id))?.title ?? UNKNOWN;

  // ---------- Stats ----------
  const activeEnrollmentsCount = enrollments.filter(
    (enrollment) => enrollment.status === "active",
  ).length;

  const pendingSubscriptionsCount = subscriptionRequests.filter(
    (request) => request.status === "pending",
  ).length;

  const pendingBooksCount = bookPurchaseRequests.filter(
    (request) => request.status === "pending",
  ).length;

  // هتشتغل تلقائيًا لما نضيف status خاص بالتصحيح في الداتا لاحقًا.
  const manualReviewCount = results.filter(
    (result) =>
      result.needsManualGrading === true || result.status === "needs_review",
  ).length;


  // ---------- Latest Results ----------
  const latestResults = [...results]
    .sort((a, b) => toTime(b.submittedAt) - toTime(a.submittedAt))
    .slice(0, 3)
    .map((result) => {
      const student = studentsById.get(String(result.studentId));
      const exam = examsById.get(String(result.examId));

      return {
        id: result.id,
        studentName: student?.name ?? UNKNOWN,
        gradeLabel: getGradeLabel(student?.grade),
        examTitle: exam?.title ?? result.title ?? UNKNOWN,
        sectionTitle: exam?.sectionTitle ?? "",
        courseTitle: courseTitle(exam?.courseId),
        score: result.score,
        total: result.total,
        percentage: getResultPercentage(result),
        submittedAt: result.submittedAt,
      };
    });

    

  // ---------- Latest Activities ----------
  const activities = [
    ...results.map((result) => ({
      id: `result-${result.id}`,
      date: result.submittedAt,
      text: `تم تسجيل نتيجة جديدة للطالب ${studentName(result.studentId)}`,
      meta: examTitle(result.examId),
    })),

    ...subscriptionRequests.map((request) => ({
      id: `subscription-${request.id}`,
      date: request.createdAt,
      text: `تم إنشاء طلب اشتراك للطالب ${studentName(request.studentId)}`,
      meta: courseTitle(request.courseId),
    })),

    ...bookPurchaseRequests.map((request) => ({
      id: `book-${request.id}`,
      date: request.createdAt,
      text: `تم إنشاء طلب شراء كتاب للطالب ${studentName(request.studentId)}`,
      meta:
        request.referenceNumber ??
        request.transactionId ??
        "طلب شراء كتاب",
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => toTime(b.date) - toTime(a.date))
    .slice(0, 5);

  return {
    stats: {
      studentsCount: students.length,
      coursesCount: courses.length,
      activeEnrollmentsCount,
    },
    needsAction: {
      pendingSubscriptionsCount,
      pendingBooksCount,
      manualReviewCount,
      totalCount:
        pendingSubscriptionsCount + pendingBooksCount + manualReviewCount,
    },
    latestResults,
    activities,
  };
}

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faBookOpen,
  faBoxesStacked,
  faClipboardCheck,
  faClockRotateLeft,
  faFileCircleCheck,
  faFlagCheckered,
  faGraduationCap,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { faTelegram } from "@fortawesome/free-brands-svg-icons";

import students from "../../data/students";
import courses from "../../data/courses";
import exams from "../../data/exams";
import results from "../../data/results";
import enrollments from "../../data/enrollments";
import subscriptionRequests from "../../data/subscriptionRequests";
import bookPurchaseRequests from "../../data/bookPurchaseRequests";

import { getGradeLabel } from "../../utils/gradeUtils";

import heroImg from "../../assets/Master/master 2.webp";
import masterCutout from "../../assets/Master/master-home.png";

function formatDate(value) {
  if (!value) return "غير محدد";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getResultPercentage(result) {
  if (!result || Number(result.total) <= 0) {
    return 0;
  }

  return Math.round(
    (Number(result.score) / Number(result.total)) * 100,
  );
}

function getCourseTitle(courseId) {
  return (
    courses.find(
      (course) => String(course.id) === String(courseId),
    )?.title ?? "غير محدد"
  );
}

function getExamTitle(examId) {
  return (
    exams.find(
      (exam) => String(exam.id) === String(examId),
    )?.title ?? "غير محدد"
  );
}

function getStudentName(studentId) {
  return (
    students.find(
      (student) => String(student.id) === String(studentId),
    )?.name ?? "غير محدد"
  );
}

export default function MasterHome() {
  // =========================================================
  // Statistics
  // =========================================================

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "active",
  );

  const pendingSubscriptionRequests =
    subscriptionRequests.filter(
      (request) => request.status === "pending",
    );

  const pendingBookRequests = bookPurchaseRequests.filter(
    (request) => request.status === "pending",
  );

  // هتشتغل تلقائيًا لما نضيف status خاص بالتصحيح في الداتا لاحقًا.
  const manualReviewResults = results.filter(
    (result) =>
      result.needsManualGrading === true ||
      result.status === "needs_review",
  );

  const needsReviewCount =
    pendingSubscriptionRequests.length +
    pendingBookRequests.length +
    manualReviewResults.length;

  // =========================================================
  // Latest Results
  // =========================================================

  const latestResults = [...results]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() -
        new Date(a.submittedAt).getTime(),
    )
    .slice(0, 3);

  // =========================================================
  // Latest Activities
  // =========================================================

  const activityItems = [
    ...results.map((result) => ({
      id: `result-${result.id}`,
      date: result.submittedAt,
      text: `تم تسجيل نتيجة جديدة للطالب ${getStudentName(
        result.studentId,
      )}`,
      meta: getExamTitle(result.examId),
    })),

    ...subscriptionRequests.map((request) => ({
      id: `subscription-${request.id}`,
      date: request.createdAt,
      text: `تم إنشاء طلب اشتراك للطالب ${getStudentName(
        request.studentId,
      )}`,
      meta: getCourseTitle(request.courseId),
    })),

    ...bookPurchaseRequests.map((request) => ({
      id: `book-${request.id}`,
      date: request.createdAt,
      text: `تم إنشاء طلب شراء كتاب للطالب ${getStudentName(
        request.studentId,
      )}`,
      meta:
        request.referenceNumber ??
        request.transactionId ??
        "طلب شراء كتاب",
    })),
  ]
    .filter((item) => item.date)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )
    .slice(0, 5);

  const statCards = [
    {
      label: "عدد الطلاب",
      value: students.length,
      icon: faUsers,
      to: "/dashboard-master/students",
    },

    {
      label: "عدد الكورسات",
      value: courses.length,
      icon: faBookOpen,
      to: "/dashboard-master/courses",
    },

    {
      label: "الاشتراكات النشطة",
      value: activeEnrollments.length,
      icon: faGraduationCap,
      to: "/dashboard-master/subscriptions",
    },
  ];

  return (
    <div className="bg-midnight">




      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* =====================================================
            Stats
        ====================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="group rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-gold/25"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white/50">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-black text-white">
                    {card.value}
                  </p>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-midnight">
                  <FontAwesomeIcon icon={card.icon} />
                </span>
              </div>
            </Link>
          ))}

          <a
            href="#needs-action"
            className="group rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-gold/25"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/50">
                  تحتاج مراجعة
                </p>

                <p className="mt-3 text-3xl font-black text-white">
                  {needsReviewCount}
                </p>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-midnight">
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </span>
            </div>
          </a>
        </section>

        {/* =====================================================
            Things Need Action
        ====================================================== */}

        <section id="needs-action" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">
              المتابعة اليومية
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              الأشياء التي تحتاج إجراء
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ActionCard
              title="طلبات الاشتراك الجديدة"
              count={pendingSubscriptionRequests.length}
              description="راجع الطلبات التي ما زالت في انتظار القرار."
              to="/dashboard-master/subscriptions"
              icon={faFileCircleCheck}
              buttonText="مراجعة الطلبات"
            />

            <ActionCard
              title="طلبات شراء الكتب"
              count={pendingBookRequests.length}
              description="راجع طلبات شراء الكتب التي ما زالت قيد المراجعة."
              to="/dashboard-master/book-requests"
              icon={faBoxesStacked}
              buttonText="مراجعة الطلبات"
            />

            <ActionCard
              title="امتحانات تحتاج تصحيحًا"
              count={manualReviewResults.length}
              description="تابع النتائج التي تحتاج تصحيحًا يدويًا عند وجودها."
              to="/dashboard-master/results?filter=needs-review"
              icon={faClipboardCheck}
              buttonText="بدء التصحيح"
            />
          </div>
        </section>

        {/* =====================================================
            Latest Results
        ====================================================== */}

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold text-gold">
                النتائج الأخيرة
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                آخر 3 نتائج
              </h2>
            </div>

            <Link
              to="/dashboard-master/results"
              className="hidden items-center gap-2 text-sm font-extrabold text-white/55 transition hover:text-gold sm:flex"
            >
              عرض النتائج

              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          {latestResults.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
              <div className="hidden grid-cols-[1.1fr_1.4fr_1.1fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs font-extrabold text-white/45 lg:grid">
                <span>الطالب</span>
                <span>الامتحان</span>
                <span>الكورس</span>
                <span>الدرجة</span>
                <span>النسبة</span>
                <span>التاريخ</span>
              </div>

              <div className="divide-y divide-white/10">
                {latestResults.map((result) => {
                  const student = students.find(
                    (item) =>
                      String(item.id) === String(result.studentId),
                  );

                  const exam = exams.find(
                    (item) =>
                      String(item.id) === String(result.examId),
                  );

                  const percentage =
                    getResultPercentage(result);

                  return (
                    <div
                      key={result.id}
                      className="grid grid-cols-1 gap-3 px-5 py-5 lg:grid-cols-[1.1fr_1.4fr_1.1fr_0.8fr_0.8fr_0.7fr] lg:items-center lg:gap-4"
                    >
                      <div>
                        <p className="text-sm font-black text-white">
                          {student?.name ?? "غير محدد"}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {getGradeLabel(student?.grade)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white/85">
                          {exam?.title ??
                            result.title ??
                            "غير محدد"}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {exam?.sectionTitle ?? ""}
                        </p>
                      </div>

                      <div className="text-sm font-bold text-white/70">
                        {getCourseTitle(exam?.courseId)}
                      </div>

                      <div className="text-sm font-black text-white">
                        {result.score} / {result.total}
                      </div>

                      <div>
                        <span className="inline-flex rounded-lg bg-success/10 px-3 py-2 text-xs font-black text-success">
                          {percentage}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 lg:block">
                        <span className="text-xs font-bold text-white/45">
                          {formatDate(result.submittedAt)}
                        </span>

                        <Link
                          to={`/dashboard-master/results/${result.id}`}
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-gold transition hover:text-gold-light"
                        >
                          عرض

                          <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyHomeState text="لا توجد نتائج مسجلة حاليًا" />
          )}
        </section>

        {/* =====================================================
            Quick Shortcuts
        ====================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">
              أدوات سريعة
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              اختصارات سريعة
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickLink
              to="/dashboard-master/courses/new"
              icon={faBookOpen}
              label="إضافة كورس"
            />

            <QuickLink
              to="/dashboard-master/exams/new"
              icon={faClipboardCheck}
              label="إضافة امتحان"
            />

            <QuickLink
              to="/dashboard-master/books/new"
              icon={faBoxesStacked}
              label="إضافة كتاب"
            />

            <QuickLink
              to="/dashboard-master/students"
              icon={faUsers}
              label="الطلاب"
            />
          </div>
        </section>

        {/* =====================================================
            Latest Activities
        ====================================================== */}

        <section className="mt-10 pb-8">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">
              آخر ما تم
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              آخر النشاطات
            </h2>
          </div>

          {activityItems.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-2">
              {activityItems.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-2 rounded-xl px-4 py-4 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <FontAwesomeIcon
                        icon={faFlagCheckered}
                        className="text-xs"
                      />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-white/85">
                        {activity.text}
                      </p>

                      <p className="mt-1 text-xs font-bold text-white/35">
                        {activity.meta}
                      </p>
                    </div>
                  </div>

                  <span className="pr-12 text-xs font-bold text-white/35 sm:pr-0">
                    {formatDate(activity.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyHomeState text="لا توجد نشاطات حديثة حاليًا" />
          )}
        </section>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  count,
  description,
  to,
  icon,
  buttonText,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <FontAwesomeIcon icon={icon} />
        </span>

        <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-lg font-black text-white">
          {count}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black text-white">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-sm font-bold leading-7 text-white/45">
        {description}
      </p>

      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-xs font-extrabold text-gold transition hover:bg-gold hover:text-midnight"
      >
        {buttonText}

        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
    </div>
  );
}

function QuickLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c1a2b] px-5 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:border-gold/25 hover:text-gold"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <FontAwesomeIcon icon={icon} />
        </span>

        {label}
      </span>

      <FontAwesomeIcon
        icon={faArrowLeft}
        className="text-white/30"
      />
    </Link>
  );
}

function EmptyHomeState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c1a2b] px-6 py-10 text-center">
      <p className="text-sm font-bold text-white/45">{text}</p>
    </div>
  );
}
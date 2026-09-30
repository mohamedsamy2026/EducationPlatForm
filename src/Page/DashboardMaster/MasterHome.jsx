import { useEffect, useState } from "react";
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

import { getMasterDashboardSummary } from "../../services/masterDashboardService";

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

export default function MasterHome() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadSummary() {
      try {
        const data = await getMasterDashboardSummary();

        if (!isCancelled) {
          setSummary(data);
        }
      } catch {
        if (!isCancelled) {
          setError("تعذر تحميل بيانات لوحة التحكم.");
        }
      }
    }

    loadSummary();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="bg-midnight px-5 py-10">
        <EmptyHomeState text={error} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-midnight px-5 py-10">
        <EmptyHomeState text="جاري تحميل البيانات..." />
      </div>
    );
  }

  const { stats, needsAction, latestResults, activities } = summary;

  const statCards = [
    {
      label: "عدد الطلاب",
      value: stats.studentsCount,
      icon: faUsers,
      to: "/dashboard-master/students",
    },
    {
      label: "عدد الكورسات",
      value: stats.coursesCount,
      icon: faBookOpen,
      to: "/dashboard-master/courses",
    },
    {
      label: "الاشتراكات النشطة",
      value: stats.activeEnrollmentsCount,
      icon: faGraduationCap,
      to: "/dashboard-master/subscriptions",
    },
  ];

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* Stats */}
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
                <p className="text-sm font-bold text-white/50">تحتاج مراجعة</p>

                <p className="mt-3 text-3xl font-black text-white">
                  {needsAction.totalCount}
                </p>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-midnight">
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </span>
            </div>
          </a>
        </section>

        {/* Things Need Action */}
        <section id="needs-action" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">المتابعة اليومية</p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              الأشياء التي تحتاج إجراء
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ActionCard
              title="طلبات الاشتراك الجديدة"
              count={needsAction.pendingSubscriptionsCount}
              description="راجع الطلبات التي ما زالت في انتظار القرار."
              to="/dashboard-master/subscriptions"
              icon={faFileCircleCheck}
              buttonText="مراجعة الطلبات"
            />

            <ActionCard
              title="طلبات شراء الكتب"
              count={needsAction.pendingBooksCount}
              description="راجع طلبات شراء الكتب التي ما زالت قيد المراجعة."
              to="/dashboard-master/book-requests"
              icon={faBoxesStacked}
              buttonText="مراجعة الطلبات"
            />

            <ActionCard
              title="امتحانات تحتاج تصحيحًا"
              count={needsAction.manualReviewCount}
              description="تابع النتائج التي تحتاج تصحيحًا يدويًا عند وجودها."
              to="/dashboard-master/results?filter=needs-review"
              icon={faClipboardCheck}
              buttonText="بدء التصحيح"
            />
          </div>
        </section>

        {/* Latest Results */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold text-gold">النتائج الأخيرة</p>

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
                {latestResults.map((result) => (
                  <div
                    key={result.id}
                    className="grid grid-cols-1 gap-3 px-5 py-5 lg:grid-cols-[1.1fr_1.4fr_1.1fr_0.8fr_0.8fr_0.7fr] lg:items-center lg:gap-4"
                  >
                    <div>
                      <p className="text-sm font-black text-white">
                        {result.studentName}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {result.gradeLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white/85">
                        {result.examTitle}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {result.sectionTitle}
                      </p>
                    </div>

                    <div className="text-sm font-bold text-white/70">
                      {result.courseTitle}
                    </div>

                    <div className="text-sm font-black text-white">
                      {result.score} / {result.total}
                    </div>

                    <div>
                      <span className="inline-flex rounded-lg bg-success/10 px-3 py-2 text-xs font-black text-success">
                        {result.percentage}%
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
                ))}
              </div>
            </div>
          ) : (
            <EmptyHomeState text="لا توجد نتائج مسجلة حاليًا" />
          )}
        </section>

        {/* Quick Shortcuts */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">أدوات سريعة</p>

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

        {/* Latest Activities */}
        <section className="mt-10 pb-8">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-gold">آخر ما تم</p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              آخر النشاطات
            </h2>
          </div>

          {activities.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-2">
              {activities.map((activity) => (
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
                      <p className="text-sm pb-1 font-bold text-white/85">
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

function ActionCard({ title, count, description, to, icon, buttonText }) {
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

      <h3 className="mt-5 text-lg font-black text-white">{title}</h3>

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

      <FontAwesomeIcon icon={faArrowLeft} className="text-white/30" />
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

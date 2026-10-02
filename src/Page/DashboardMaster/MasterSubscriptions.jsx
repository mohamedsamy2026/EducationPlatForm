import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClockRotateLeft,
  faFileCircleCheck,
  faGraduationCap,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import MasterTabs from "../../Components/DashboardMaster/Shared/MasterTabs";
import {
  dangerButtonClass,
  ghostButtonClass,
  iconDangerButtonClass,
  primaryButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDate, formatDateTime, formatPrice } from "../../utils/formatters";
import {
  approveMasterSubscriptionRequest,
  deleteAllMasterSubscriptionRequests,
  deleteMasterSubscriptionRequest,
  endMasterEnrollment,
  extendMasterEnrollment,
  getMasterEnrollmentsPage,
  getMasterSubscriptionRequestDetails,
  getMasterSubscriptionRequestsPage,
  getMasterSubscriptionsSummary,
  rejectMasterSubscriptionRequest,
} from "../../services/masterSubscriptionsService";

const PAGE_SIZE = 15;

export default function MasterSubscriptions() {
  const [tab, setTab] = useState("enrollments");
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [details, setDetails] = useState(null);
  const [extendTarget, setExtendTarget] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const isEnrollments = tab === "enrollments";

  const summaryState = useAsyncData(() => getMasterSubscriptionsSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () =>
      isEnrollments
        ? getMasterEnrollmentsPage({ search, grade, courseId, status, page, pageSize: PAGE_SIZE })
        : getMasterSubscriptionRequestsPage({
            search,
            grade,
            courseId,
            status,
            page,
            pageSize: PAGE_SIZE,
          }),
    [tab, search, grade, courseId, status, page, refreshKey],
  );

  const summary = summaryState.data;
  const reload = () => setRefreshKey((value) => value + 1);
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setStatus("all");
    setPage(1);
  };

  const run = async (task, successMessage) => {
    setIsBusy(true);
    setActionError("");

    try {
      await task();
      setNotice(successMessage);
      reload();
      return true;
    } catch (taskError) {
      setActionError(taskError.message);
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const openDetails = async (row) => {
    try {
      setDetails(await getMasterSubscriptionRequestDetails(row.id));
    } catch (detailsError) {
      setActionError(detailsError.message);
    }
  };

  const submitExtend = async (event) => {
    event.preventDefault();

    const ok = await run(
      () => extendMasterEnrollment(extendTarget.row.id, extendTarget.days),
      "تم تمديد الاشتراك.",
    );

    if (ok) setExtendTarget(null);
  };

  const confirmAction = async () => {
    const { kind, row } = confirmTarget;
    const tasks = {
      approve: [
        () => approveMasterSubscriptionRequest(row.id),
        "تم قبول الطلب وتفعيل الاشتراك تلقائيًا.",
      ],
      reject: [() => rejectMasterSubscriptionRequest(row.id), "تم رفض الطلب."],
      delete: [
        () => deleteMasterSubscriptionRequest(row.id),
        "تم حذف الطلب. الاشتراك الفعلي (إن وُجد) لم يتأثر.",
      ],
      "delete-all": [
        () => deleteAllMasterSubscriptionRequests(),
        "تم حذف كل الطلبات. الاشتراكات الفعلية لم تتأثر.",
      ],
      end: [() => endMasterEnrollment(row.id), "تم إنهاء الاشتراك."],
    };
    const [task, message] = tasks[kind];

    if (await run(task, message)) {
      setConfirmTarget(null);
      setDetails(null);
    }
  };

  const confirmTexts = {
    approve: ["قبول الطلب", "سيتم تفعيل اشتراك الطالب في الكورس تلقائيًا من اليوم."],
    reject: ["رفض الطلب", "سيتم رفض الطلب. الطالب يقدر يقدّم طلبًا جديدًا بعد كده."],
    delete: [
      "حذف الطلب",
      "سيتم حذف الطلب نهائيًا. لو كان مقبولًا، اشتراك الطالب الفعلي يفضل كما هو.",
    ],
    "delete-all": [
      "حذف كل الطلبات",
      "سيتم حذف كل طلبات الاشتراك نهائيًا. الاشتراكات الفعلية تفضل كما هي.",
    ],
    end: [
      "إنهاء الاشتراك",
      "سيتم إنهاء اشتراك الطالب فورًا ولن يقدر يدخل الكورس. السجل يفضل ظاهر كـ«تم إنهاؤه».",
    ],
  };
  const dangerKinds = ["reject", "delete", "delete-all", "end"];
  const [confirmTitle, confirmMessage] = confirmTarget
    ? confirmTexts[confirmTarget.kind]
    : ["", ""];

  const toOptions = (label, items = []) => [
    { value: "all", label },
    ...items.map((item) => ({ value: item.id, label: item.label })),
  ];

  const statusOptions = isEnrollments
    ? [
        { value: "all", label: "الكل" },
        { value: "active", label: "نشط" },
        { value: "expired", label: "منتهي" },
        { value: "ended", label: "تم إنهاؤه" },
      ]
    : [
        { value: "all", label: "الكل" },
        { value: "pending", label: "قيد المراجعة" },
        { value: "approved", label: "مقبول" },
        { value: "rejected", label: "مرفوض" },
      ];

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="الاشتراكات وطلبات الاشتراك"
          description="راجع الطلبات وفعّل الاشتراكات، ومدّد أو أنهِ الاشتراكات القائمة."
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MasterStatCard
            label="اشتراكات نشطة"
            value={summary?.active ?? "—"}
            icon={faGraduationCap}
          />
          <MasterStatCard
            label="اشتراكات منتهية أو منهاة"
            value={summary?.finished ?? "—"}
            icon={faClockRotateLeft}
          />
          <MasterStatCard
            label="طلبات قيد المراجعة"
            value={summary?.pendingRequests ?? "—"}
            icon={faFileCircleCheck}
          />
        </section>

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <MasterTabs
          activeTab={tab}
          onChange={changeTab}
          tabs={[
            { id: "enrollments", label: "الاشتراكات", count: summary?.totalEnrollments },
            { id: "requests", label: "طلبات الاشتراك", count: summary?.pendingRequests },
          ]}
        />

        <div className="mb-4">
          <MasterSearchFilters
            search={search}
            onSearchChange={changeFilter(setSearch)}
            searchPlaceholder={
              isEnrollments
                ? "ابحث باسم الطالب أو الكورس..."
                : "ابحث باسم الطالب أو رقم الطلب أو رقم التحويل..."
            }
            filters={[
              {
                id: "grade",
                label: "الصف",
                value: grade,
                onChange: changeFilter(setGrade),
                options: toOptions("الكل", data?.filterOptions.grades),
              },
              {
                id: "course",
                label: "الكورس",
                value: courseId,
                onChange: changeFilter(setCourseId),
                options: toOptions("الكل", data?.filterOptions.courses),
              },
              {
                id: "status",
                label: "الحالة",
                value: status,
                onChange: changeFilter(setStatus),
                options: statusOptions,
              },
            ]}
          />
        </div>

        {!isEnrollments && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setConfirmTarget({ kind: "delete-all" })}
              className={dangerButtonClass}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              حذف كل الطلبات
            </button>
          </div>
        )}

        {loading ? (
          <MasterEmptyState title="جاري التحميل..." />
        ) : data?.rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
            <ul className="divide-y divide-white/10">
              {data.rows.map((row) =>
                isEnrollments ? (
                  <li
                    key={row.id}
                    className="grid grid-cols-1 gap-3 px-5 py-4 xl:grid-cols-[1.3fr_1.4fr_1fr_1.3fr_0.9fr_auto] xl:items-center xl:gap-4"
                  >
                    <div>
                      <p className="text-sm font-black text-white">{row.studentName}</p>
                      <p className="mt-1 text-xs font-bold text-white/35">{row.gradeLabel}</p>
                    </div>
                    <p className="text-sm font-bold text-white/80">{row.courseTitle}</p>
                    <p className="text-sm font-bold text-white/60">{row.planLabel}</p>
                    <div className="text-xs font-bold leading-6 text-white/50">
                      <p>من {formatDate(row.startsAt)}</p>
                      <p>
                        إلى {formatDate(row.endsAt)}
                        {row.daysLeft !== null && (
                          <span className="text-gold"> • باقي {row.daysLeft} يوم</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <MasterStatusBadge status={row.status} label={row.statusLabel} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExtendTarget({ row, days: "30" })}
                        disabled={row.status === "ended"}
                        className={softButtonClass}
                      >
                        تمديد
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmTarget({ kind: "end", row })}
                        disabled={row.status === "ended"}
                        className={dangerButtonClass}
                      >
                        إنهاء
                      </button>
                    </div>
                  </li>
                ) : (
                  <li
                    key={row.id}
                    className="grid grid-cols-1 gap-3 px-5 py-4 xl:grid-cols-[1fr_1.2fr_1.3fr_0.8fr_1fr_0.9fr_auto] xl:items-center xl:gap-4"
                  >
                    <div>
                      <p className="text-sm font-black text-gold">{row.referenceNumber}</p>
                      <p className="mt-1 text-xs font-bold text-white/35">
                        {formatDate(row.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{row.studentName}</p>
                      <p className="mt-1 text-xs font-bold text-white/35">{row.gradeLabel}</p>
                    </div>
                    <p className="text-sm font-bold text-white/80">
                      {row.courseTitle} <span className="text-white/40">• {row.planLabel}</span>
                    </p>
                    <p className="text-sm font-black text-white">{formatPrice(row.amount)}</p>
                    <p className="text-xs font-bold text-white/50" dir="ltr">
                      {row.transactionId}
                    </p>
                    <div>
                      <MasterStatusBadge status={row.status} label={row.statusLabel} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDetails(row)}
                        className={ghostButtonClass}
                      >
                        تفاصيل
                      </button>
                      {row.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget({ kind: "approve", row })}
                            className={primaryButtonClass}
                          >
                            قبول
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget({ kind: "reject", row })}
                            className={dangerButtonClass}
                          >
                            رفض
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmTarget({ kind: "delete", row })}
                        className={iconDangerButtonClass}
                        aria-label="حذف الطلب"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
            <MasterPagination
              {...data.pagination}
              itemLabel={isEnrollments ? "اشتراك" : "طلب"}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <MasterEmptyState
            icon={faCircleCheck}
            title={isEnrollments ? "لا توجد اشتراكات" : "لا توجد طلبات"}
            description="لم يتم العثور على نتائج مطابقة."
          />
        )}
      </div>

      {/* تفاصيل الطلب */}
      <MasterModal
        isOpen={Boolean(details)}
        title="تفاصيل طلب الاشتراك"
        onClose={() => setDetails(null)}
      >
        {details && (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {[
              ["رقم الطلب", details.referenceNumber],
              ["الحالة", details.statusLabel],
              ["الطالب", details.studentName],
              ["رقم الطالب", details.studentPhone],
              ["الصف", details.gradeLabel],
              ["البريد", details.studentEmail],
              ["الكورس", details.courseTitle],
              ["الخطة", details.planLabel],
              ["المبلغ", formatPrice(details.amount)],
              ["وسيلة الدفع", details.paymentMethodName],
              ["رقم عملية التحويل", details.transactionId],
              ["تاريخ الطلب", formatDateTime(details.createdAt)],
              [
                "تاريخ المراجعة",
                details.reviewedAt ? formatDateTime(details.reviewedAt) : "لم تتم المراجعة",
              ],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/[0.03] px-4 py-3">
                <dt className="text-xs font-extrabold text-white/40">{label}</dt>
                <dd className="mt-1 font-bold text-white">{value || "غير محدد"}</dd>
              </div>
            ))}
          </dl>
        )}
      </MasterModal>

      {/* التمديد */}
      <MasterModal
        isOpen={Boolean(extendTarget)}
        isBusy={isBusy}
        size="sm"
        title="تمديد الاشتراك"
        description={extendTarget?.row.studentName}
        onClose={() => setExtendTarget(null)}
      >
        {extendTarget && (
          <form onSubmit={submitExtend} className="space-y-4">
            <MasterField
              label="عدد الأيام"
              name="days"
              type="number"
              min="1"
              max="365"
              value={extendTarget.days}
              onChange={(name, value) => setExtendTarget({ ...extendTarget, days: value })}
              hint="بيبدأ التمديد من تاريخ نهاية الاشتراك الحالي (أو من اليوم لو منتهي)."
              required
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setExtendTarget(null)}
                disabled={isBusy}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isBusy} className={primaryButtonClass}>
                {isBusy ? "جارٍ التمديد..." : "تمديد"}
              </button>
            </div>
          </form>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(confirmTarget)}
        isDanger={confirmTarget ? dangerKinds.includes(confirmTarget.kind) : false}
        isLoading={isBusy}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="تأكيد"
        onConfirm={confirmAction}
        onCancel={() => !isBusy && setConfirmTarget(null)}
      />
    </div>
  );
}

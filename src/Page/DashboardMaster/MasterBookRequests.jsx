import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCircleCheck,
  faClockRotateLeft,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  dangerButtonClass,
  ghostButtonClass,
  iconDangerButtonClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDate, formatDateTime, formatPrice } from "../../utils/formatters";
import {
  approveMasterBookRequest,
  deleteAllMasterBookRequests,
  deleteMasterBookRequest,
  getMasterBookRequestDetails,
  getMasterBookRequestsPage,
  getMasterBookRequestsSummary,
  rejectMasterBookRequest,
} from "../../services/masterBookRequestsService";

const PAGE_SIZE = 15;

const CONFIRM_TEXTS = {
  approve: ["قبول الطلب", "سيتم تسجيل الكتاب كمشترى للطالب ويظهر له «تم شراء الكتاب»."],
  reject: ["رفض الطلب", "سيتم رفض الطلب. الطالب يقدر يعيد طلب الشراء من صفحة الكتب."],
  delete: ["حذف الطلب", "سيتم حذف الطلب نهائيًا. لو كان مقبولًا، حق الطالب في الكتاب يفضل كما هو."],
  "delete-all": [
    "حذف كل الطلبات",
    "سيتم حذف كل طلبات شراء الكتب. الطلاب اللي اشتروا كتبًا يفضل حقهم فيها.",
  ],
};

export default function MasterBookRequests() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [bookId, setBookId] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [details, setDetails] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const summaryState = useAsyncData(() => getMasterBookRequestsSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () => getMasterBookRequestsPage({ search, grade, bookId, status, page, pageSize: PAGE_SIZE }),
    [search, grade, bookId, status, page, refreshKey],
  );

  const summary = summaryState.data;
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const toOptions = (label, items = []) => [
    { value: "all", label },
    ...items.map((item) => ({ value: item.id, label: item.label })),
  ];

  const openDetails = async (row) => {
    try {
      setDetails(await getMasterBookRequestDetails(row.id));
    } catch (detailsError) {
      setActionError(detailsError.message);
    }
  };

  const confirmAction = async () => {
    const { kind, row } = confirmTarget;
    const tasks = {
      approve: [() => approveMasterBookRequest(row.id), "تم قبول الطلب وتسجيل الكتاب للطالب."],
      reject: [() => rejectMasterBookRequest(row.id), "تم رفض الطلب."],
      delete: [() => deleteMasterBookRequest(row.id), "تم حذف الطلب."],
      "delete-all": [() => deleteAllMasterBookRequests(), "تم حذف كل الطلبات."],
    };
    const [task, message] = tasks[kind];

    setIsBusy(true);

    try {
      await task();
      setNotice(message);
      setConfirmTarget(null);
      setDetails(null);
      setRefreshKey((value) => value + 1);
    } catch (taskError) {
      setActionError(taskError.message);
      setConfirmTarget(null);
    } finally {
      setIsBusy(false);
    }
  };

  const [confirmTitle, confirmMessage] = confirmTarget
    ? CONFIRM_TEXTS[confirmTarget.kind]
    : ["", ""];

  const actionButtons = (row) => (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => openDetails(row)} className={ghostButtonClass}>
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
  );

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="طلبات شراء الكتب"
          description="راجع طلبات الطلاب واقبلها أو ارفضها. القبول بيسجل الكتاب للطالب."
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MasterStatCard label="كل الطلبات" value={summary?.total ?? "—"} icon={faBoxesStacked} />
          <MasterStatCard
            label="قيد المراجعة"
            value={summary?.pending ?? "—"}
            icon={faClockRotateLeft}
          />
          <MasterStatCard label="مقبولة" value={summary?.approved ?? "—"} icon={faCircleCheck} />
        </section>

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <div className="mb-4">
          <MasterSearchFilters
            search={search}
            onSearchChange={changeFilter(setSearch)}
            searchPlaceholder="ابحث باسم الطالب أو رقم الطلب أو رقم التحويل..."
            filters={[
              {
                id: "grade",
                label: "الصف",
                value: grade,
                onChange: changeFilter(setGrade),
                options: toOptions("الكل", data?.filterOptions.grades),
              },
              {
                id: "book",
                label: "الكتاب",
                value: bookId,
                onChange: changeFilter(setBookId),
                options: toOptions("الكل", data?.filterOptions.books),
              },
              {
                id: "status",
                label: "الحالة",
                value: status,
                onChange: changeFilter(setStatus),
                options: [
                  { value: "all", label: "الكل" },
                  { value: "pending", label: "قيد المراجعة" },
                  { value: "approved", label: "مقبول" },
                  { value: "rejected", label: "مرفوض" },
                ],
              },
            ]}
          />
        </div>

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

        {loading ? (
          <MasterEmptyState title="جاري تحميل الطلبات..." />
        ) : data?.rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
            <ul className="divide-y divide-white/10">
              {data.rows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 xl:grid-cols-[1fr_1.2fr_1.4fr_0.8fr_1fr_0.9fr_auto] xl:items-center xl:gap-4"
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
                  <p className="text-sm font-bold text-white/80">{row.bookTitle}</p>
                  <p className="text-sm font-black text-white">{formatPrice(row.amount)}</p>
                  <p className="text-xs font-bold text-white/50" dir="ltr">
                    {row.transactionId}
                  </p>
                  <div>
                    <MasterStatusBadge status={row.status} label={row.statusLabel} />
                  </div>
                  {actionButtons(row)}
                </li>
              ))}
            </ul>
            <MasterPagination {...data.pagination} itemLabel="طلب" onPageChange={setPage} />
          </div>
        ) : (
          <MasterEmptyState
            icon={faBoxesStacked}
            title="لا توجد طلبات"
            description="لم يتم العثور على طلبات مطابقة."
          />
        )}
      </div>

      <MasterModal
        isOpen={Boolean(details)}
        title="تفاصيل طلب شراء الكتاب"
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
              ["الكتاب", details.bookTitle],
              [
                "سعر الكتاب",
                details.bookPrice !== null ? formatPrice(details.bookPrice) : "غير محدد",
              ],
              ["المبلغ المحوّل", formatPrice(details.amount)],
              ["وسيلة الدفع", details.paymentMethodName],
              ["رقم عملية التحويل", details.transactionId],
              ["تاريخ الطلب", formatDateTime(details.createdAt)],
              ["الطالب يملك الكتاب؟", details.studentOwnsBook ? "نعم" : "لا"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/[0.03] px-4 py-3">
                <dt className="text-xs font-extrabold text-white/40">{label}</dt>
                <dd className="mt-1 font-bold text-white">{value || "غير محدد"}</dd>
              </div>
            ))}
          </dl>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(confirmTarget)}
        isDanger={confirmTarget ? confirmTarget.kind !== "approve" : false}
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

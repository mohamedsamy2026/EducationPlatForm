import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faChartLine,
  faClipboardCheck,
  faDownload,
  faFileCircleCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
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
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import downloadTextFile from "../../utils/downloadTextFile";
import { formatDate } from "../../utils/formatters";
import {
  deleteAllMasterResults,
  deleteMasterResult,
  exportMasterResultsCsv,
  getMasterResultsPage,
  getMasterResultsSummary,
} from "../../services/masterResultsService";

const PAGE_SIZE = 15;

export default function MasterResults() {
  const [searchParams] = useSearchParams();
  const legacyFilter = searchParams.get("filter") === "needs-review" ? "needs_review" : "all";

  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("all");
  const [courseId, setCourseId] = useState("all");
  const [examId, setExamId] = useState(searchParams.get("examId") ?? "all");
  const [grade, setGrade] = useState("all");
  const [status, setStatus] = useState(searchParams.get("status") ?? legacyFilter);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const filters = { search, studentId, courseId, examId, grade, status };

  const summaryState = useAsyncData(() => getMasterResultsSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () => getMasterResultsPage({ ...filters, page, pageSize: PAGE_SIZE }),
    [search, studentId, courseId, examId, grade, status, page, refreshKey],
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

  const handleExport = async () => {
    setActionError("");

    try {
      const file = await exportMasterResultsCsv(filters);

      downloadTextFile(file.filename, file.content);
      setNotice(`تم تصدير ${file.count} نتيجة.`);
    } catch (exportError) {
      setActionError(exportError.message);
    }
  };

  const confirmDelete = async () => {
    setIsBusy(true);

    try {
      if (deleteTarget.result) {
        await deleteMasterResult(deleteTarget.result.id);
        setNotice("تم حذف النتيجة.");
      } else {
        const result = await deleteAllMasterResults();
        setNotice(`تم حذف ${result.deletedResults} نتيجة.`);
      }

      setDeleteTarget(null);
      setPage(1);
      setRefreshKey((value) => value + 1);
    } catch (deleteError) {
      setActionError(deleteError.message);
      setDeleteTarget(null);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="النتائج"
          description="راجع نتائج الطلاب، وصحّح الأسئلة المقالية، وصدّر النتائج."
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MasterStatCard label="كل النتائج" value={summary?.total ?? "—"} icon={faChartLine} />
          <MasterStatCard
            label="تحتاج تصحيحًا"
            value={summary?.needsGrading ?? "—"}
            icon={faClipboardCheck}
          />
          <MasterStatCard
            label="مكتملة التصحيح"
            value={summary?.graded ?? "—"}
            icon={faFileCircleCheck}
          />
          <MasterStatCard
            label="تسليمات اليوم"
            value={summary?.today ?? "—"}
            icon={faCalendarDay}
          />
        </section>

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <div className="mb-4">
          <MasterSearchFilters
            search={search}
            onSearchChange={changeFilter(setSearch)}
            searchPlaceholder="ابحث باسم الطالب أو الامتحان..."
            filters={[
              {
                id: "student",
                label: "الطالب",
                value: studentId,
                onChange: changeFilter(setStudentId),
                options: toOptions("الكل", data?.filterOptions.students),
              },
              {
                id: "course",
                label: "الكورس",
                value: courseId,
                onChange: changeFilter(setCourseId),
                options: toOptions("الكل", data?.filterOptions.courses),
              },
              {
                id: "exam",
                label: "الامتحان",
                value: examId,
                onChange: changeFilter(setExamId),
                options: toOptions("الكل", data?.filterOptions.exams),
              },
              {
                id: "grade",
                label: "الصف",
                value: grade,
                onChange: changeFilter(setGrade),
                options: toOptions("الكل", data?.filterOptions.grades),
              },
              {
                id: "status",
                label: "التصحيح",
                value: status,
                onChange: changeFilter(setStatus),
                options: [
                  { value: "all", label: "الكل" },
                  { value: "needs_review", label: "تحتاج تصحيحًا" },
                  { value: "graded", label: "مكتملة التصحيح" },
                ],
              },
            ]}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button type="button" onClick={handleExport} className={ghostButtonClass}>
            <FontAwesomeIcon icon={faDownload} />
            تصدير CSV
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget({ result: null })}
            className={dangerButtonClass}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            حذف كل النتائج
          </button>
        </div>

        {loading ? (
          <MasterEmptyState title="جاري تحميل النتائج..." />
        ) : data?.rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
            <div className="hidden grid-cols-[1.2fr_1.5fr_1.2fr_0.7fr_0.7fr_1fr_0.8fr_auto] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs font-extrabold text-white/45 xl:grid">
              <span>الطالب</span>
              <span>الامتحان</span>
              <span>الكورس</span>
              <span>الدرجة</span>
              <span>النسبة</span>
              <span>التصحيح</span>
              <span>التاريخ</span>
              <span>إجراءات</span>
            </div>
            <ul className="divide-y divide-white/10">
              {data.rows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 xl:grid-cols-[1.2fr_1.5fr_1.2fr_0.7fr_0.7fr_1fr_0.8fr_auto] xl:items-center xl:gap-4"
                >
                  <div>
                    <p className="text-sm font-black text-white">{row.studentName}</p>
                    <p className="mt-1 text-xs font-bold text-white/35">{row.gradeLabel}</p>
                  </div>
                  <p className="text-sm font-bold text-white/85">{row.examTitle}</p>
                  <p className="text-sm font-bold text-white/60">{row.courseTitle}</p>
                  <p className="text-sm font-black text-white">
                    {row.score} / {row.total}
                  </p>
                  <p className="text-sm font-black text-gold">{row.percentage}%</p>
                  <div>
                    <MasterStatusBadge status={row.status} label={row.statusLabel} />
                  </div>
                  <p className="text-xs font-bold text-white/45">{formatDate(row.submittedAt)}</p>
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard-master/results/${row.id}`} className={softButtonClass}>
                      {row.status === "needs_review" ? "تصحيح" : "عرض"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ result: row })}
                      className={iconDangerButtonClass}
                      aria-label="حذف النتيجة"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <MasterPagination {...data.pagination} itemLabel="نتيجة" onPageChange={setPage} />
          </div>
        ) : (
          <MasterEmptyState
            icon={faChartLine}
            title="لا توجد نتائج"
            description="لم يتم العثور على نتائج مطابقة للفلاتر الحالية."
          />
        )}
      </div>

      <MasterConfirmModal
        isOpen={Boolean(deleteTarget)}
        isDanger
        isLoading={isBusy}
        title={deleteTarget?.result ? "حذف النتيجة" : "حذف كل النتائج"}
        message={
          deleteTarget?.result
            ? `سيتم حذف نتيجة ${deleteTarget.result.studentName} في "${deleteTarget.result.examTitle}". الطالب والامتحان يفضلوا كما هم، لكن الامتحان هيحسب إن الطالب لم يسلّمه.`
            : "سيتم حذف كل نتائج الطلاب نهائيًا. الطلاب والامتحانات والأسئلة تفضل كما هي. لا يمكن التراجع."
        }
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isBusy && setDeleteTarget(null)}
      />
    </div>
  );
}

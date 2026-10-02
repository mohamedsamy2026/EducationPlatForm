import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClipboardCheck,
  faClipboardList,
  faEye,
  faEyeSlash,
  faHourglassEnd,
  faPenToSquare,
  faPlus,
  faSliders,
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
  iconButtonClass,
  iconDangerButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDateTime } from "../../utils/formatters";
import {
  deleteAllMasterExams,
  deleteMasterExam,
  getMasterExamDeleteSummary,
  getMasterExamsDeleteAllSummary,
  getMasterExamsPage,
  getMasterExamsSummary,
  setMasterExamPublished,
} from "../../services/masterExamsService";

const PAGE_SIZE = 8;

export default function MasterExams() {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [grade, setGrade] = useState("all");
  const [publishStatus, setPublishStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const summaryState = useAsyncData(() => getMasterExamsSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () => getMasterExamsPage({ search, courseId, grade, publishStatus, page, pageSize: PAGE_SIZE }),
    [search, courseId, grade, publishStatus, page, refreshKey],
  );

  const summary = summaryState.data;
  const reload = () => setRefreshKey((value) => value + 1);
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const askDelete = async (exam) => {
    setActionError("");

    try {
      const summaryData = exam
        ? await getMasterExamDeleteSummary(exam.id)
        : await getMasterExamsDeleteAllSummary();

      setDeleteTarget({ exam, summary: summaryData });
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      if (deleteTarget.exam) {
        await deleteMasterExam(deleteTarget.exam.id);
        setNotice(`تم حذف الامتحان "${deleteTarget.exam.title}" وأسئلته ونتائجه.`);
      } else {
        const result = await deleteAllMasterExams();
        setNotice(`تم حذف ${result.deletedExams} امتحان وكل أسئلتها ونتائجها.`);
      }

      setDeleteTarget(null);
      setPage(1);
      reload();
    } catch (deleteError) {
      setActionError(deleteError.message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (exam) => {
    try {
      await setMasterExamPublished(exam.id, exam.publishStatus !== "published");
      setNotice(exam.publishStatus === "published" ? "تم إلغاء نشر الامتحان." : "تم نشر الامتحان.");
      reload();
    } catch (publishError) {
      setActionError(publishError.message);
    }
  };

  const deleteMessage = !deleteTarget
    ? ""
    : deleteTarget.exam
      ? `سيتم حذف الامتحان "${deleteTarget.exam.title}" نهائيًا، ومعه ${deleteTarget.summary.questionsCount} سؤال و ${deleteTarget.summary.resultsCount} نتيجة طلاب. لا يمكن التراجع.`
      : `سيتم حذف ${deleteTarget.summary.examsCount} امتحان نهائيًا، ومعهم ${deleteTarget.summary.questionsCount} سؤال و ${deleteTarget.summary.resultsCount} نتيجة. لا يمكن التراجع.`;

  const toOptions = (label, items = []) => [
    { value: "all", label },
    ...items.map((item) => ({ value: item.id, label: item.label })),
  ];

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="الامتحانات والأسئلة"
          description="أنشئ الامتحانات، وأدر أسئلتها، وتابع من يحتاج تصحيحًا."
          actionLabel="إضافة امتحان"
          actionTo="/dashboard-master/exams/new"
          actionIcon={faPlus}
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MasterStatCard
            label="كل الامتحانات"
            value={summary?.total ?? "—"}
            icon={faClipboardList}
          />
          <MasterStatCard label="المنشورة" value={summary?.published ?? "—"} icon={faCircleCheck} />
          <MasterStatCard label="المنتهية" value={summary?.ended ?? "—"} icon={faHourglassEnd} />
          <MasterStatCard
            label="تحتاج تصحيحًا"
            value={summary?.needsGrading ?? "—"}
            icon={faClipboardCheck}
            note="نتائج فيها أسئلة مقالية"
          />
        </section>

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <MasterSearchFilters
              search={search}
              onSearchChange={changeFilter(setSearch)}
              searchPlaceholder="ابحث باسم الامتحان..."
              filters={[
                {
                  id: "course",
                  label: "الكورس",
                  value: courseId,
                  onChange: changeFilter(setCourseId),
                  options: toOptions("الكل", data?.courseOptions),
                },
                {
                  id: "grade",
                  label: "الصف",
                  value: grade,
                  onChange: changeFilter(setGrade),
                  options: toOptions("الكل", data?.gradeOptions),
                },
                {
                  id: "publish",
                  label: "النشر",
                  value: publishStatus,
                  onChange: changeFilter(setPublishStatus),
                  options: [
                    { value: "all", label: "الكل" },
                    { value: "published", label: "منشور" },
                    { value: "draft", label: "غير منشور" },
                  ],
                },
              ]}
            />
          </div>
          <button type="button" onClick={() => askDelete(null)} className={dangerButtonClass}>
            <FontAwesomeIcon icon={faTrashCan} />
            حذف كل الامتحانات
          </button>
        </div>

        {loading ? (
          <MasterEmptyState title="جاري تحميل الامتحانات..." />
        ) : data?.rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
            <ul className="divide-y divide-white/10">
              {data.rows.map((exam) => (
                <li
                  key={exam.id}
                  className="grid grid-cols-1 gap-4 px-5 py-5 xl:grid-cols-[2fr_1.2fr_1fr_auto] xl:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-black text-white">{exam.title}</h2>
                      <MasterStatusBadge status={exam.publishStatus} label={exam.publishLabel} />
                      <MasterStatusBadge status={exam.timeStatus} label={exam.timeLabel} />
                    </div>
                    <p className="mt-2 text-xs font-bold text-white/40">
                      {exam.courseTitle} • {exam.gradeLabel} • {exam.sectionTitle}
                    </p>
                  </div>

                  <div className="text-xs font-bold leading-6 text-white/50">
                    <p>من {formatDateTime(exam.startsAt)}</p>
                    <p>إلى {formatDateTime(exam.endsAt)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/55">
                    <span>{exam.questionsCount} سؤال</span>
                    <span>{exam.totalScore} درجة</span>
                    <span>{exam.durationMinutes} دقيقة</span>
                    {exam.needsGradingCount > 0 && (
                      <Link
                        to={`/dashboard-master/results?examId=${exam.id}&status=needs_review`}
                        className="rounded-lg bg-gold/10 px-2.5 py-1.5 font-extrabold text-gold hover:bg-gold hover:text-midnight"
                      >
                        {exam.needsGradingCount} تحتاج تصحيحًا
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/dashboard-master/exams/${exam.id}`} className={softButtonClass}>
                      <FontAwesomeIcon icon={faSliders} />
                      إدارة
                    </Link>
                    <Link
                      to={`/dashboard-master/exams/${exam.id}/edit`}
                      className={iconButtonClass}
                      aria-label="تعديل الامتحان"
                      title="تعديل"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePublish(exam)}
                      className={iconButtonClass}
                      aria-label="تغيير حالة النشر"
                      title={exam.publishStatus === "published" ? "إلغاء النشر" : "نشر"}
                    >
                      <FontAwesomeIcon
                        icon={exam.publishStatus === "published" ? faEyeSlash : faEye}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => askDelete(exam)}
                      className={iconDangerButtonClass}
                      aria-label="حذف الامتحان"
                      title="حذف"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <MasterPagination {...data.pagination} itemLabel="امتحان" onPageChange={setPage} />
          </div>
        ) : (
          <MasterEmptyState
            icon={faClipboardList}
            title="لا توجد امتحانات"
            description="لم يتم العثور على امتحانات مطابقة، أو لم تضف أي امتحان بعد."
          />
        )}
      </div>

      <MasterConfirmModal
        isOpen={Boolean(deleteTarget)}
        isDanger
        isLoading={isDeleting}
        title={deleteTarget?.exam ? "حذف الامتحان" : "حذف كل الامتحانات"}
        message={deleteMessage}
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
      />
    </div>
  );
}

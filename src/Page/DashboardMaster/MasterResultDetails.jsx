import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  cardClass,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDateTime } from "../../utils/formatters";
import {
  deleteMasterResult,
  getMasterResultDetails,
  saveMasterResultGrades,
} from "../../services/masterResultsService";
import {
  faChartLine,
  faClipboardCheck,
  faListCheck,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 5;

export default function MasterResultDetails() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, loading, error } = useAsyncData(
    () => getMasterResultDetails(resultId, { page, pageSize: PAGE_SIZE }),
    [resultId, page, refreshKey],
  );

  const header = data?.header;
  const hasDrafts = Object.keys(drafts).length > 0;

  const saveGrades = async () => {
    setIsBusy(true);
    setActionError("");

    try {
      const result = await saveMasterResultGrades(resultId, drafts);

      setNotice(
        result.status === "graded"
          ? "تم حفظ الدرجات واكتمل تصحيح الامتحان."
          : "تم حفظ الدرجات. لسه فيه أسئلة مقالية بدون درجة.",
      );
      setDrafts({});
      setRefreshKey((value) => value + 1);
    } catch (saveError) {
      setActionError(saveError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    setIsBusy(true);

    try {
      await deleteMasterResult(resultId);
      navigate("/dashboard-master/results");
    } catch (deleteError) {
      setActionError(deleteError.message);
      setConfirmDelete(false);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <MasterPageHeader
          title={header ? `نتيجة ${header.studentName}` : "تفاصيل النتيجة"}
          description={
            header
              ? `${header.examTitle} • ${header.courseTitle} • ${formatDateTime(header.submittedAt)}`
              : ""
          }
          backTo="/dashboard-master/results"
          backLabel="كل النتائج"
        />

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        {loading || !header ? (
          <MasterEmptyState title={error || "جاري التحميل..."} />
        ) : (
          <>
            <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <MasterStatCard
                label="الدرجة النهائية"
                value={`${header.score} / ${header.total}`}
                icon={faChartLine}
              />
              <MasterStatCard label="النسبة" value={`${header.percentage}%`} icon={faPercent} />
              <MasterStatCard
                label="الأسئلة التلقائية"
                value={`${header.autoScore} / ${header.autoTotal}`}
                icon={faListCheck}
              />
              <MasterStatCard
                label="الأسئلة المقالية"
                value={`${header.essayEarned} / ${header.essayTotal}`}
                icon={faClipboardCheck}
                note={`${header.gradedEssays} من ${header.essayCount} تم تصحيحه`}
              />
            </section>

            <div
              className={`${cardClass} mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-white/60">
                <MasterStatusBadge status={header.status} label={header.statusLabel} />
                <span>{header.gradeLabel}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {header.essayCount > 0 && (
                  <button
                    type="button"
                    onClick={saveGrades}
                    disabled={isBusy || !hasDrafts}
                    className={primaryButtonClass}
                  >
                    {isBusy ? "جارٍ الحفظ..." : "حفظ درجات التصحيح"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={dangerButtonClass}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  حذف النتيجة
                </button>
              </div>
            </div>

            {!header.hasAnswers ? (
              <MasterEmptyState
                title="لا توجد إجابات محفوظة"
                description="هذه نتيجة قديمة تم تسجيلها بدون تفاصيل الإجابات، فالمتاح الدرجة النهائية فقط."
              />
            ) : (
              <div className="space-y-4">
                {data.rows.map((question) => {
                  const draftValue = drafts[question.id];
                  const shownValue = draftValue ?? question.earnedScore ?? "";

                  return (
                    <article key={question.id} className={`${cardClass} p-5`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="text-sm font-black leading-7 text-white">
                          <span className="ml-2 text-gold">{question.number}.</span>
                          {question.text}
                        </p>
                        <span className="rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-xs font-extrabold text-white/55">
                          {question.typeLabel} • {question.maxScore} درجة
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-white/[0.03] p-4">
                        <p className="text-xs font-extrabold text-white/40">إجابة الطالب</p>
                        <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-white/85">
                          {question.isAnswered ? question.studentAnswer : "لم يجب عن هذا السؤال"}
                        </p>
                      </div>

                      {question.isEssay ? (
                        <label className="mt-4 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-extrabold text-white/60">
                            درجة المستر (من {question.maxScore})
                          </span>
                          <input
                            type="number"
                            min="0"
                            max={question.maxScore}
                            step="0.5"
                            value={shownValue}
                            onChange={(event) =>
                              setDrafts({ ...drafts, [question.id]: event.target.value })
                            }
                            className={`${inputClass} !h-11 !w-28`}
                          />
                        </label>
                      ) : (
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold">
                          <span
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${question.isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                          >
                            <FontAwesomeIcon icon={question.isCorrect ? faCheck : faXmark} />
                            {question.isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                          </span>
                          {!question.isCorrect && (
                            <span className="text-white/50">
                              الإجابة الصحيحة: {question.correctAnswer}
                            </span>
                          )}
                          <span className="text-white/50">
                            الدرجة: {question.earnedScore} / {question.maxScore}
                          </span>
                        </div>
                      )}
                    </article>
                  );
                })}

                <div className="rounded-2xl border border-white/10 bg-[#0c1a2b]">
                  <MasterPagination {...data.pagination} itemLabel="سؤال" onPageChange={setPage} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MasterConfirmModal
        isOpen={confirmDelete}
        isDanger
        isLoading={isBusy}
        title="حذف النتيجة"
        message="سيتم حذف هذه النتيجة نهائيًا. الطالب والامتحان يفضلوا كما هم، لكن الامتحان هيحسب إن الطالب لم يسلّمه."
        confirmLabel="تأكيد الحذف"
        onConfirm={handleDelete}
        onCancel={() => !isBusy && setConfirmDelete(false)}
      />
    </div>
  );
}

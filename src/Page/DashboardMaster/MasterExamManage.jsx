import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faFileImport,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  cardClass,
  dangerButtonClass,
  ghostButtonClass,
  iconButtonClass,
  iconDangerButtonClass,
  primaryButtonClass,
  softButtonClass,
  textareaClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDateTime } from "../../utils/formatters";
import {
  deleteAllMasterExamQuestions,
  deleteMasterExam,
  deleteMasterQuestion,
  getEmptyQuestionForm,
  getMasterExamDeleteSummary,
  getMasterExamDetails,
  getMasterExamQuestionsPage,
  getMasterQuestionForm,
  importMasterQuestions,
  moveMasterQuestion,
  previewMasterQuestionsImport,
  saveMasterQuestion,
  setMasterExamPublished,
} from "../../services/masterExamsService";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const IMPORT_EXAMPLE = `[
  {
    "type": "multiple-choice",
    "question": "ما عاصمة مصر؟",
    "options": ["الإسكندرية", "القاهرة", "أسوان", "الأقصر"],
    "correctAnswer": 1,
    "score": 1
  },
  { "type": "true-false", "question": "النيل أطول أنهار العالم.", "correctAnswer": false, "score": 1 },
  { "type": "essay", "question": "اشرح أثر الموقع الجغرافي على الحضارة المصرية.", "score": 2 }
]`;

export default function MasterExamManage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [questionModal, setQuestionModal] = useState(null);
  const [importModal, setImportModal] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const details = useAsyncData(() => getMasterExamDetails(examId), [examId, refreshKey]);
  const questions = useAsyncData(
    () => getMasterExamQuestionsPage(examId, { page, pageSize: PAGE_SIZE }),
    [examId, page, refreshKey],
  );

  const exam = details.data;
  const reload = () => setRefreshKey((value) => value + 1);

  const run = async (task, successMessage) => {
    setIsBusy(true);
    setActionError("");

    try {
      const result = await task();

      if (successMessage) setNotice(successMessage);
      reload();

      return { ok: true, result };
    } catch (taskError) {
      setActionError(taskError.message);

      return { ok: false };
    } finally {
      setIsBusy(false);
    }
  };

  // ---------------- سؤال ----------------

  const openQuestionModal = async (question) => {
    setActionError("");

    try {
      setQuestionModal({
        questionId: question?.id ?? null,
        form: question ? await getMasterQuestionForm(question.id) : getEmptyQuestionForm(),
        error: "",
      });
    } catch (loadError) {
      setActionError(loadError.message);
    }
  };

  const updateQuestionForm = (name, value) =>
    setQuestionModal({
      ...questionModal,
      error: "",
      form: { ...questionModal.form, [name]: value },
    });

  const updateOption = (index, value) => {
    const options = [...questionModal.form.options];

    options[index] = value;
    setQuestionModal({ ...questionModal, error: "", form: { ...questionModal.form, options } });
  };

  const submitQuestion = async (event) => {
    event.preventDefault();
    setIsBusy(true);

    try {
      await saveMasterQuestion(examId, questionModal.questionId, questionModal.form);
      setNotice("تم حفظ السؤال.");
      setQuestionModal(null);
      reload();
    } catch (saveError) {
      setQuestionModal({ ...questionModal, error: saveError.message });
    } finally {
      setIsBusy(false);
    }
  };

  // ---------------- استيراد JSON ----------------

  const readJsonFile = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (file) setImportModal({ text: await file.text(), preview: null, error: "" });
  };

  const previewImport = async () => {
    try {
      setImportModal({
        ...importModal,
        preview: await previewMasterQuestionsImport(importModal.text),
        error: "",
      });
    } catch (previewError) {
      setImportModal({ ...importModal, preview: null, error: previewError.message });
    }
  };

  const confirmImport = async () => {
    setIsBusy(true);

    try {
      const result = await importMasterQuestions(examId, importModal.text);

      setNotice(
        `تم استيراد ${result.imported} سؤال.` +
          (result.skipped ? ` تم تجاهل ${result.skipped} سؤال فيه أخطاء.` : ""),
      );
      setImportModal(null);
      setPage(1);
      reload();
    } catch (importError) {
      setImportModal({ ...importModal, error: importError.message });
    } finally {
      setIsBusy(false);
    }
  };

  // ---------------- حذف ----------------

  const askDeleteExam = async () => {
    try {
      setConfirmTarget({ kind: "exam", summary: await getMasterExamDeleteSummary(examId) });
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDelete = async () => {
    const target = confirmTarget;
    const { ok } = await run(async () => {
      if (target.kind === "question") await deleteMasterQuestion(examId, target.question.id);
      if (target.kind === "all-questions") await deleteAllMasterExamQuestions(examId);
      if (target.kind === "exam") await deleteMasterExam(examId);
    });

    if (!ok) return;

    setConfirmTarget(null);

    if (target.kind === "exam") {
      navigate("/dashboard-master/exams");
      return;
    }

    setPage(1);
    setNotice(target.kind === "question" ? "تم حذف السؤال." : "تم حذف كل أسئلة الامتحان.");
  };

  const confirmMessage = !confirmTarget
    ? ""
    : confirmTarget.kind === "exam"
      ? `سيتم حذف الامتحان "${confirmTarget.summary.title}" نهائيًا، ومعه ${confirmTarget.summary.questionsCount} سؤال و ${confirmTarget.summary.resultsCount} نتيجة طلاب. لا يمكن التراجع.`
      : confirmTarget.kind === "all-questions"
        ? "سيتم حذف كل أسئلة هذا الامتحان. الامتحان ونتائجه تفضل كما هي. لا يمكن التراجع."
        : "سيتم حذف هذا السؤال نهائيًا.";

  const form = questionModal?.form;

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <MasterPageHeader
          title={exam ? exam.title : "إدارة الامتحان"}
          description={
            exam ? `${exam.courseTitle} • ${exam.gradeLabel} • ${exam.sectionTitle}` : ""
          }
          backTo="/dashboard-master/exams"
          backLabel="كل الامتحانات"
        />

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || details.error || questions.error}
        </MasterNotice>

        {!exam ? (
          <MasterEmptyState title={details.error || "جاري التحميل..."} />
        ) : (
          <>
            <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <MasterStatCard label="عدد الأسئلة" value={exam.questionsCount} icon={faPlus} />
              <MasterStatCard label="مجموع الدرجات" value={exam.totalScore} icon={faPenToSquare} />
              <MasterStatCard
                label="الطلاب اللي سلّموا"
                value={exam.submissionsCount}
                icon={faFileImport}
              />
              <MasterStatCard
                label="تحتاج تصحيحًا"
                value={exam.needsGradingCount}
                icon={faPenToSquare}
              />
            </section>

            <div
              className={`${cardClass} mb-6 flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between`}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/50">
                <MasterStatusBadge status={exam.publishStatus} label={exam.publishLabel} />
                <MasterStatusBadge status={exam.timeStatus} label={exam.timeLabel} />
                <span>{exam.durationMinutes} دقيقة</span>
                <span>من {formatDateTime(exam.startsAt)}</span>
                <span>إلى {formatDateTime(exam.endsAt)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exam.needsGradingCount > 0 && (
                  <Link
                    to={`/dashboard-master/results?examId=${exam.id}&status=needs_review`}
                    className={softButtonClass}
                  >
                    تصحيح {exam.needsGradingCount} نتيجة
                  </Link>
                )}
                <Link to={`/dashboard-master/exams/${examId}/edit`} className={ghostButtonClass}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  تعديل بيانات الامتحان
                </Link>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() =>
                    run(
                      () => setMasterExamPublished(examId, exam.publishStatus !== "published"),
                      "تم تحديث حالة النشر.",
                    )
                  }
                  className={ghostButtonClass}
                >
                  {exam.publishStatus === "published" ? "إلغاء النشر" : "نشر الامتحان"}
                </button>
                <button type="button" onClick={askDeleteExam} className={dangerButtonClass}>
                  <FontAwesomeIcon icon={faTrashCan} />
                  حذف الامتحان
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black text-white">أسئلة الامتحان</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setImportModal({ text: "", preview: null, error: "" })}
                  className={ghostButtonClass}
                >
                  <FontAwesomeIcon icon={faFileImport} />
                  استيراد JSON
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmTarget({ kind: "all-questions" })}
                  disabled={exam.questionsCount === 0}
                  className={dangerButtonClass}
                >
                  حذف كل الأسئلة
                </button>
                <button
                  type="button"
                  onClick={() => openQuestionModal(null)}
                  className={primaryButtonClass}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  إضافة سؤال
                </button>
              </div>
            </div>

            {!questions.data ? (
              <MasterEmptyState title="جاري تحميل الأسئلة..." />
            ) : questions.data.rows.length === 0 ? (
              <MasterEmptyState
                title="لا توجد أسئلة"
                description="أضف سؤالًا يدويًا أو استورد مجموعة أسئلة من JSON."
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
                <ul className="divide-y divide-white/10">
                  {questions.data.rows.map((question) => (
                    <li
                      key={question.id}
                      className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[auto_1fr_auto] lg:items-center"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-sm font-black text-gold">
                        {question.number}
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold leading-7 text-white/90">
                          {question.text}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-white/40">
                          <span>{question.typeLabel}</span>
                          <span>الدرجة: {question.score}</span>
                          <span>الإجابة: {question.correctAnswerLabel}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy || question.isFirst}
                          onClick={() => run(() => moveMasterQuestion(question.id, "up"))}
                          className={iconButtonClass}
                          aria-label="تحريك السؤال لأعلى"
                        >
                          <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy || question.isLast}
                          onClick={() => run(() => moveMasterQuestion(question.id, "down"))}
                          className={iconButtonClass}
                          aria-label="تحريك السؤال لأسفل"
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openQuestionModal(question)}
                          className={iconButtonClass}
                          aria-label="تعديل السؤال"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmTarget({ kind: "question", question })}
                          className={iconDangerButtonClass}
                          aria-label="حذف السؤال"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <MasterPagination
                  {...questions.data.pagination}
                  itemLabel="سؤال"
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* نافذة السؤال */}
      <MasterModal
        isOpen={Boolean(questionModal)}
        isBusy={isBusy}
        title={questionModal?.questionId ? "تعديل السؤال" : "إضافة سؤال"}
        onClose={() => setQuestionModal(null)}
      >
        {form && (
          <form onSubmit={submitQuestion} className="space-y-4">
            <MasterNotice type="error">{questionModal.error}</MasterNotice>
            <MasterField
              label="نوع السؤال"
              name="type"
              as="select"
              value={form.type}
              onChange={(name, value) =>
                setQuestionModal({
                  ...questionModal,
                  error: "",
                  form: {
                    ...form,
                    type: value,
                    correctAnswer: value === "true-false" ? "true" : "0",
                  },
                })
              }
              options={[
                { value: "multiple-choice", label: "اختيار من متعدد" },
                { value: "true-false", label: "صح / خطأ" },
                { value: "essay", label: "مقالي (يصحح يدويًا)" },
              ]}
            />
            <MasterField
              label="نص السؤال"
              name="question"
              as="textarea"
              rows={3}
              value={form.question}
              onChange={updateQuestionForm}
              required
            />

            {form.type === "multiple-choice" && (
              <fieldset className="space-y-3">
                <legend className="mb-1 text-xs font-extrabold text-white/60">
                  الخيارات (اختر الإجابة الصحيحة)
                </legend>
                {form.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={String(form.correctAnswer) === String(index)}
                      onChange={() => updateQuestionForm("correctAnswer", String(index))}
                      className="h-4 w-4 accent-[#d4af37]"
                      aria-label={`الخيار ${index + 1} هو الإجابة الصحيحة`}
                    />
                    <input
                      value={option}
                      onChange={(event) => updateOption(index, event.target.value)}
                      placeholder={`الخيار ${index + 1}`}
                      className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#091625] px-4 text-sm font-bold text-white outline-none focus:border-gold/40"
                    />
                  </label>
                ))}
              </fieldset>
            )}

            {form.type === "true-false" && (
              <MasterField
                label="الإجابة الصحيحة"
                name="correctAnswer"
                as="select"
                value={String(form.correctAnswer)}
                onChange={updateQuestionForm}
                options={[
                  { value: "true", label: "صح" },
                  { value: "false", label: "خطأ" },
                ]}
              />
            )}

            <MasterField
              label="درجة السؤال"
              name="score"
              type="number"
              min="0.5"
              value={form.score}
              onChange={updateQuestionForm}
              required
            />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setQuestionModal(null)}
                disabled={isBusy}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isBusy} className={primaryButtonClass}>
                {isBusy ? "جارٍ الحفظ..." : "حفظ السؤال"}
              </button>
            </div>
          </form>
        )}
      </MasterModal>

      {/* نافذة استيراد JSON */}
      <MasterModal
        isOpen={Boolean(importModal)}
        isBusy={isBusy}
        size="lg"
        title="استيراد أسئلة من JSON"
        description="الصق كود JSON أو ارفع ملف .json، وبعدها اعمل معاينة قبل الاستيراد."
        onClose={() => setImportModal(null)}
      >
        {importModal && (
          <div className="space-y-4">
            <MasterNotice type="error">{importModal.error}</MasterNotice>

            <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-gold/20 bg-gold/10 px-4 text-xs font-extrabold text-gold transition hover:bg-gold hover:text-midnight">
              رفع ملف JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={readJsonFile}
                className="sr-only"
              />
            </label>

            <textarea
              dir="ltr"
              rows={9}
              value={importModal.text}
              onChange={(event) =>
                setImportModal({ text: event.target.value, preview: null, error: "" })
              }
              placeholder={IMPORT_EXAMPLE}
              className={`${textareaClass} font-mono text-xs leading-6`}
            />

            {importModal.preview && (
              <div className="space-y-3 rounded-xl border border-white/10 bg-[#091625] p-4">
                <p className="text-sm font-black text-white">
                  تم قراءة {importModal.preview.total} سؤال:{" "}
                  <span className="text-success">{importModal.preview.valid.length} صحيح</span>
                  {importModal.preview.errors.length > 0 && (
                    <span className="text-danger">
                      {" "}
                      • {importModal.preview.errors.length} فيه أخطاء
                    </span>
                  )}
                </p>
                {importModal.preview.errors.length > 0 && (
                  <ul className="space-y-1 text-xs font-bold leading-6 text-danger">
                    {importModal.preview.errors.map((item) => (
                      <li key={item.number}>{item.message}</li>
                    ))}
                  </ul>
                )}
                {importModal.preview.valid.length > 0 && (
                  <ol className="max-h-48 space-y-2 overflow-y-auto text-xs font-bold text-white/70">
                    {importModal.preview.valid.map((question, index) => (
                      <li key={index} className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <span className="text-gold">{question.typeLabel}</span> •{" "}
                        {question.question}
                        <span className="text-white/40">
                          {" "}
                          (الإجابة: {question.correctAnswerLabel} • {question.score} درجة)
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setImportModal(null)}
                disabled={isBusy}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={previewImport}
                disabled={isBusy || !importModal.text.trim()}
                className={softButtonClass}
              >
                معاينة وفحص
              </button>
              <button
                type="button"
                onClick={confirmImport}
                disabled={isBusy || !importModal.preview?.valid.length}
                className={primaryButtonClass}
              >
                {isBusy
                  ? "جارٍ الاستيراد..."
                  : `استيراد ${importModal.preview?.valid.length ?? 0} سؤال`}
              </button>
            </div>
          </div>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(confirmTarget)}
        isDanger
        isLoading={isBusy}
        title={
          confirmTarget?.kind === "exam"
            ? "حذف الامتحان"
            : confirmTarget?.kind === "all-questions"
              ? "حذف كل الأسئلة"
              : "حذف السؤال"
        }
        message={confirmMessage}
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isBusy && setConfirmTarget(null)}
      />
    </div>
  );
}

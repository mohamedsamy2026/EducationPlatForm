import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faFileLines,
  faPenToSquare,
  faPlus,
  faTrashCan,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  cardClass,
  ghostButtonClass,
  iconButtonClass,
  iconDangerButtonClass,
  primaryButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import {
  deleteMasterLesson,
  deleteMasterUnit,
  getMasterCourseContent,
  getMasterUnitDeleteSummary,
  moveMasterLesson,
  moveMasterUnit,
  saveMasterLesson,
  saveMasterUnit,
  setMasterCoursePublished,
} from "../../services/masterCoursesService";

const EMPTY_LESSON = {
  title: "",
  duration: "",
  description: "",
  videoUrl: "",
  materialUrl: "",
  materialTitle: "",
};

export default function MasterCourseContent() {
  const { courseId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [modal, setModal] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const { data, loading, error } = useAsyncData(
    () => getMasterCourseContent(courseId),
    [courseId, refreshKey],
  );

  const reload = () => setRefreshKey((value) => value + 1);

  const run = async (task, successMessage) => {
    setIsBusy(true);
    setActionError("");

    try {
      await task();
      if (successMessage) setNotice(successMessage);
      reload();
      return true;
    } catch (taskError) {
      setActionError(taskError.message);
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const openUnitModal = (unit) =>
    setModal({ kind: "unit", unitId: unit?.id ?? null, form: { title: unit?.title ?? "" } });

  const openLessonModal = (unit, lesson) =>
    setModal({
      kind: "lesson",
      unitId: unit.id,
      lessonId: lesson?.id ?? null,
      form: lesson
        ? {
            title: lesson.title,
            duration: lesson.duration,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            materialUrl: lesson.materialUrl,
            materialTitle: lesson.materialTitle,
          }
        : { ...EMPTY_LESSON },
    });

  const updateModalForm = (name, value) =>
    setModal({ ...modal, form: { ...modal.form, [name]: value } });

  const submitModal = async (event) => {
    event.preventDefault();

    const ok = await run(
      () =>
        modal.kind === "unit"
          ? saveMasterUnit(courseId, modal.unitId, modal.form)
          : saveMasterLesson(courseId, modal.unitId, modal.lessonId, modal.form),
      modal.kind === "unit" ? "تم حفظ الوحدة." : "تم حفظ الدرس.",
    );

    if (ok) setModal(null);
  };

  const askDeleteUnit = async (unit) => {
    try {
      setConfirmTarget({ kind: "unit", unit, summary: await getMasterUnitDeleteSummary(unit.id) });
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDelete = async () => {
    const target = confirmTarget;

    const ok = await run(
      () =>
        target.kind === "unit"
          ? deleteMasterUnit(target.unit.id)
          : deleteMasterLesson(courseId, target.lesson.id),
      target.kind === "unit" ? "تم حذف الوحدة ودروسها." : "تم حذف الدرس.",
    );

    if (ok) setConfirmTarget(null);
  };

  const confirmMessage = !confirmTarget
    ? ""
    : confirmTarget.kind === "unit"
      ? `سيتم حذف الوحدة "${confirmTarget.unit.title}" وفيها ${confirmTarget.summary.lessonsCount} درس نهائيًا، مع صلاحيات الدروس المرتبطة بها.\n` +
        (confirmTarget.summary.examsCount
          ? `الامتحانات المرتبطة بالوحدة (${confirmTarget.summary.examsCount}) هتفضل وتتحول إلى "مراجعة عامة".`
          : "لا توجد امتحانات مرتبطة بهذه الوحدة.")
      : `سيتم حذف الدرس "${confirmTarget.lesson.title}" مع صلاحيات الطلاب المرتبطة به. لا يمكن التراجع.`;

  const course = data?.course;

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <MasterPageHeader
          title={course ? `محتوى: ${course.title}` : "محتوى الكورس"}
          description={
            course
              ? `${course.gradeLabel} • ${data.units.length} وحدة • ${data.examsCount} امتحان`
              : ""
          }
          backTo="/dashboard-master/courses"
          backLabel="كل الكورسات"
        />

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        {loading || !data ? (
          <MasterEmptyState title={error || "جاري التحميل..."} />
        ) : (
          <>
            <div
              className={`${cardClass} mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="flex items-center gap-3">
                <MasterStatusBadge
                  status={course.published ? "published" : "draft"}
                  label={course.publishLabel}
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() =>
                    run(
                      () => setMasterCoursePublished(courseId, !course.published),
                      course.published ? "تم إلغاء النشر." : "تم نشر الكورس.",
                    )
                  }
                  className="text-xs font-extrabold text-gold hover:underline"
                >
                  {course.published ? "إلغاء النشر" : "نشر الكورس"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/dashboard-master/courses/${courseId}/edit`}
                  className={ghostButtonClass}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  بيانات الكورس
                </Link>
                <Link
                  to={`/dashboard-master/exams/new?courseId=${courseId}`}
                  className={ghostButtonClass}
                >
                  إضافة امتحان
                </Link>
                <button
                  type="button"
                  onClick={() => openUnitModal(null)}
                  className={primaryButtonClass}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  إضافة وحدة
                </button>
              </div>
            </div>

            {data.units.length === 0 ? (
              <MasterEmptyState
                title="لا توجد وحدات بعد"
                description="ابدأ بإضافة وحدة، وبعدها أضف دروسها."
              />
            ) : (
              <div className="space-y-5">
                {data.units.map((unit) => (
                  <section key={unit.id} className={cardClass}>
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-gold">وحدة</p>
                        <h2 className="mt-1 text-lg font-black text-white">{unit.title}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => run(() => moveMasterUnit(unit.id, "up"))}
                          disabled={isBusy || unit.isFirst}
                          className={iconButtonClass}
                          aria-label="تحريك الوحدة لأعلى"
                        >
                          <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                        <button
                          type="button"
                          onClick={() => run(() => moveMasterUnit(unit.id, "down"))}
                          disabled={isBusy || unit.isLast}
                          className={iconButtonClass}
                          aria-label="تحريك الوحدة لأسفل"
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openUnitModal(unit)}
                          className={iconButtonClass}
                          aria-label="تعديل الوحدة"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          type="button"
                          onClick={() => askDeleteUnit(unit)}
                          className={iconDangerButtonClass}
                          aria-label="حذف الوحدة"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openLessonModal(unit, null)}
                          className={softButtonClass}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          إضافة درس
                        </button>
                      </div>
                    </header>

                    {unit.lessons.length === 0 ? (
                      <p className="p-5 text-sm font-bold text-white/40">
                        لا توجد دروس في هذه الوحدة.
                      </p>
                    ) : (
                      <ul className="divide-y divide-white/10">
                        {unit.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-black text-white">{lesson.title}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-white/40">
                                {lesson.duration && <span>{lesson.duration}</span>}
                                <span
                                  className={`inline-flex items-center gap-1 ${lesson.videoUrl ? "text-success" : ""}`}
                                >
                                  <FontAwesomeIcon icon={faVideo} />
                                  {lesson.videoUrl ? "فيديو مضاف" : "بدون فيديو"}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 ${lesson.materialUrl ? "text-success" : ""}`}
                                >
                                  <FontAwesomeIcon icon={faFileLines} />
                                  {lesson.materialUrl ? "ملزمة مضافة" : "بدون ملزمة"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => run(() => moveMasterLesson(lesson.id, "up"))}
                                disabled={isBusy || lesson.isFirst}
                                className={iconButtonClass}
                                aria-label="تحريك الدرس لأعلى"
                              >
                                <FontAwesomeIcon icon={faArrowUp} />
                              </button>
                              <button
                                type="button"
                                onClick={() => run(() => moveMasterLesson(lesson.id, "down"))}
                                disabled={isBusy || lesson.isLast}
                                className={iconButtonClass}
                                aria-label="تحريك الدرس لأسفل"
                              >
                                <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openLessonModal(unit, lesson)}
                                className={iconButtonClass}
                                aria-label="تعديل الدرس"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmTarget({ kind: "lesson", lesson })}
                                className={iconDangerButtonClass}
                                aria-label="حذف الدرس"
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <MasterModal
        isOpen={Boolean(modal)}
        isBusy={isBusy}
        title={
          modal?.kind === "unit"
            ? modal.unitId
              ? "تعديل الوحدة"
              : "إضافة وحدة"
            : modal?.lessonId
              ? "تعديل الدرس"
              : "إضافة درس"
        }
        onClose={() => setModal(null)}
      >
        {modal && (
          <form onSubmit={submitModal} className="space-y-4">
            {modal.kind === "unit" ? (
              <MasterField
                label="اسم الوحدة"
                name="title"
                value={modal.form.title}
                onChange={updateModalForm}
                required
              />
            ) : (
              <>
                <MasterField
                  label="اسم الدرس"
                  name="title"
                  value={modal.form.title}
                  onChange={updateModalForm}
                  required
                />
                <MasterField
                  label="مدة الدرس (مثال: 45 دقيقة)"
                  name="duration"
                  value={modal.form.duration}
                  onChange={updateModalForm}
                />
                <MasterField
                  label="وصف الدرس"
                  name="description"
                  as="textarea"
                  rows={3}
                  value={modal.form.description}
                  onChange={updateModalForm}
                />
                <MasterField
                  label="رابط الفيديو (YouTube Unlisted)"
                  name="videoUrl"
                  dir="ltr"
                  value={modal.form.videoUrl}
                  onChange={updateModalForm}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <MasterField
                  label="رابط الملزمة (Google Drive)"
                  name="materialUrl"
                  dir="ltr"
                  value={modal.form.materialUrl}
                  onChange={updateModalForm}
                  placeholder="https://drive.google.com/..."
                />
                <MasterField
                  label="اسم الملزمة"
                  name="materialTitle"
                  value={modal.form.materialTitle}
                  onChange={updateModalForm}
                />
              </>
            )}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setModal(null)}
                disabled={isBusy}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isBusy} className={primaryButtonClass}>
                {isBusy ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </form>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(confirmTarget)}
        isDanger
        isLoading={isBusy}
        title={confirmTarget?.kind === "unit" ? "حذف الوحدة" : "حذف الدرس"}
        message={confirmMessage}
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isBusy && setConfirmTarget(null)}
      />
    </div>
  );
}

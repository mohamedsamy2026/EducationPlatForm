import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPlus, faUserCheck, faVideo } from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import {
  dangerButtonClass,
  ghostButtonClass,
  primaryButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/formatters";
import {
  getMasterLessonAccessOptions,
  getMasterLessonAccessPage,
  getMasterLessonAccessSummary,
  grantMasterLessonAccess,
  revokeMasterLessonAccess,
} from "../../services/masterLessonAccessService";

const PAGE_SIZE = 15;
const EMPTY_GRANT = { studentId: "", courseId: "", lessonIds: [], error: "" };

export default function MasterLessonAccess() {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [grade, setGrade] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [grantModal, setGrantModal] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  const summaryState = useAsyncData(() => getMasterLessonAccessSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () => getMasterLessonAccessPage({ search, courseId, grade, page, pageSize: PAGE_SIZE }),
    [search, courseId, grade, page, refreshKey],
  );
  const optionsState = useAsyncData(() => getMasterLessonAccessOptions(), []);

  const summary = summaryState.data;
  const options = optionsState.data;
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const toOptions = (label, items = []) => [
    { value: "all", label },
    ...items.map((item) => ({ value: item.id, label: item.label })),
  ];

  const selectedCourse = options?.courses.find(
    (course) => String(course.id) === String(grantModal?.courseId),
  );

  const toggleLesson = (lessonId) => {
    const chosen = grantModal.lessonIds.includes(lessonId)
      ? grantModal.lessonIds.filter((id) => id !== lessonId)
      : [...grantModal.lessonIds, lessonId];

    setGrantModal({ ...grantModal, lessonIds: chosen, error: "" });
  };

  const submitGrant = async (event) => {
    event.preventDefault();
    setIsBusy(true);

    try {
      const result = await grantMasterLessonAccess(grantModal);

      setNotice(
        `تم منح ${result.granted} صلاحية.` +
          (result.skipped ? ` (${result.skipped} كانت موجودة قبل كده.)` : ""),
      );
      setGrantModal(null);
      setPage(1);
      setRefreshKey((value) => value + 1);
    } catch (grantError) {
      setGrantModal({ ...grantModal, error: grantError.message });
    } finally {
      setIsBusy(false);
    }
  };

  const confirmRevoke = async () => {
    setIsBusy(true);

    try {
      await revokeMasterLessonAccess(revokeTarget.id);
      setNotice("تم سحب الصلاحية.");
      setRevokeTarget(null);
      setRefreshKey((value) => value + 1);
    } catch (revokeError) {
      setActionError(revokeError.message);
      setRevokeTarget(null);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="صلاحيات الدروس"
          description="امنح طالبًا صلاحية لدرس أو أكثر من غير اشتراك كامل، واسحبها وقت ما تحب."
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MasterStatCard label="صلاحيات نشطة" value={summary?.total ?? "—"} icon={faKey} />
          <MasterStatCard
            label="طلاب لديهم صلاحيات"
            value={summary?.studentsCount ?? "—"}
            icon={faUserCheck}
          />
          <MasterStatCard label="دروس ممنوحة" value={summary?.lessonsCount ?? "—"} icon={faVideo} />
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
              searchPlaceholder="ابحث باسم الطالب أو الدرس..."
              filters={[
                {
                  id: "course",
                  label: "الكورس",
                  value: courseId,
                  onChange: changeFilter(setCourseId),
                  options: toOptions("الكل", data?.filterOptions.courses),
                },
                {
                  id: "grade",
                  label: "الصف",
                  value: grade,
                  onChange: changeFilter(setGrade),
                  options: toOptions("الكل", data?.filterOptions.grades),
                },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={() => setGrantModal({ ...EMPTY_GRANT })}
            className={primaryButtonClass}
          >
            <FontAwesomeIcon icon={faPlus} />
            منح صلاحية
          </button>
        </div>

        {loading ? (
          <MasterEmptyState title="جاري تحميل الصلاحيات..." />
        ) : data?.rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
            <ul className="divide-y divide-white/10">
              {data.rows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 xl:grid-cols-[1.2fr_1.5fr_1.6fr_0.8fr_auto] xl:items-center xl:gap-4"
                >
                  <div>
                    <p className="text-sm font-black text-white">{row.studentName}</p>
                    <p className="mt-1 text-xs font-bold text-white/35">{row.gradeLabel}</p>
                  </div>
                  <p className="text-sm font-bold text-white/70">{row.courseTitle}</p>
                  <div>
                    <p className="text-sm font-bold text-white/90">{row.lessonTitle}</p>
                    {row.unitTitle && (
                      <p className="mt-1 text-xs font-bold text-white/35">{row.unitTitle}</p>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white/45">{formatDate(row.createdAt)}</p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard-master/students/${row.studentId}`}
                      className={ghostButtonClass}
                    >
                      عرض الطالب
                    </Link>
                    <button
                      type="button"
                      onClick={() => setRevokeTarget(row)}
                      className={dangerButtonClass}
                    >
                      سحب
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <MasterPagination {...data.pagination} itemLabel="صلاحية" onPageChange={setPage} />
          </div>
        ) : (
          <MasterEmptyState
            icon={faKey}
            title="لا توجد صلاحيات"
            description="لم يتم العثور على صلاحيات مطابقة. استخدم «منح صلاحية» لإضافة واحدة."
          />
        )}
      </div>

      <MasterModal
        isOpen={Boolean(grantModal)}
        isBusy={isBusy}
        title="منح صلاحية دروس"
        description="لو الطالب عنده صلاحية لدرس، بيتم تخطيه تلقائيًا."
        onClose={() => setGrantModal(null)}
      >
        {grantModal && options && (
          <form onSubmit={submitGrant} className="space-y-4">
            <MasterNotice type="error">{grantModal.error}</MasterNotice>
            <MasterField
              label="الطالب"
              name="studentId"
              as="select"
              value={grantModal.studentId}
              onChange={(name, value) =>
                setGrantModal({ ...grantModal, studentId: value, error: "" })
              }
              options={[
                { value: "", label: "اختر الطالب" },
                ...options.students.map((student) => ({
                  value: student.id,
                  label: `${student.label} - ${student.gradeLabel}`,
                })),
              ]}
              required
            />
            <MasterField
              label="الكورس"
              name="courseId"
              as="select"
              value={grantModal.courseId}
              onChange={(name, value) =>
                setGrantModal({ ...grantModal, courseId: value, lessonIds: [], error: "" })
              }
              options={[
                { value: "", label: "اختر الكورس" },
                ...options.courses.map((course) => ({ value: course.id, label: course.label })),
              ]}
              required
            />

            {selectedCourse && (
              <fieldset className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#091625] p-3">
                <legend className="px-1 text-xs font-extrabold text-white/60">اختر الدروس</legend>
                {selectedCourse.lessons.length === 0 ? (
                  <p className="p-2 text-sm font-bold text-white/40">لا توجد دروس في هذا الكورس.</p>
                ) : (
                  selectedCourse.lessons.map((lesson) => (
                    <label
                      key={lesson.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04]"
                    >
                      <input
                        type="checkbox"
                        checked={grantModal.lessonIds.includes(lesson.id)}
                        onChange={() => toggleLesson(lesson.id)}
                        className="h-4 w-4 accent-[#d4af37]"
                      />
                      <span className="text-sm font-bold text-white/85">{lesson.label}</span>
                      <span className="text-xs font-bold text-white/35">{lesson.unitTitle}</span>
                    </label>
                  ))
                )}
              </fieldset>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setGrantModal(null)}
                disabled={isBusy}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isBusy} className={softButtonClass}>
                {isBusy ? "جارٍ المنح..." : `منح ${grantModal.lessonIds.length || ""} صلاحية`}
              </button>
            </div>
          </form>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(revokeTarget)}
        isDanger
        isLoading={isBusy}
        title="سحب الصلاحية"
        message={
          revokeTarget
            ? `سيتم سحب صلاحية ${revokeTarget.studentName} على درس "${revokeTarget.lessonTitle}". لو كان مشتركًا في الكورس، دخوله للدرس بالاشتراك لا يتأثر.`
            : ""
        }
        confirmLabel="تأكيد السحب"
        onConfirm={confirmRevoke}
        onCancel={() => !isBusy && setRevokeTarget(null)}
      />
    </div>
  );
}

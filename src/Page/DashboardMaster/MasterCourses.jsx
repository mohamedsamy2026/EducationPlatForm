import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faEye,
  faEyeSlash,
  faLayerGroup,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  dangerButtonClass,
  iconButtonClass,
  iconDangerButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import {
  deleteAllMasterCourses,
  deleteMasterCourse,
  getMasterCourseDeleteSummary,
  getMasterCoursesDeleteAllSummary,
  getMasterCoursesPage,
  setMasterCoursePublished,
} from "../../services/masterCoursesService";

const PAGE_SIZE = 9;

function buildDeleteMessage(summary, isAll) {
  const lines = [
    isAll
      ? `سيتم حذف ${summary.coursesCount} كورس نهائيًا، ومعهم:`
      : `سيتم حذف الكورس "${summary.title}" نهائيًا، ومعه:`,
    `• ${summary.unitsCount} وحدة و ${summary.lessonsCount} درس`,
    `• ${summary.examsCount} امتحان و ${summary.questionsCount} سؤال`,
    `• ${summary.resultsCount} نتيجة امتحانات`,
    `• ${summary.enrollmentsCount} اشتراك (منها ${summary.activeEnrollmentsCount} نشط)`,
    `• ${summary.requestsCount} طلب اشتراك و ${summary.lessonAccessCount} صلاحية درس`,
    "الطلاب أنفسهم لن يُحذفوا. لا يمكن التراجع عن هذا الإجراء.",
  ];

  return lines.join("\n");
}

export default function MasterCourses() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [publishStatus, setPublishStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading, error } = useAsyncData(
    () => getMasterCoursesPage({ search, grade, publishStatus, page, pageSize: PAGE_SIZE }),
    [search, grade, publishStatus, page, refreshKey],
  );

  const reload = () => setRefreshKey((value) => value + 1);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const askDelete = async (course) => {
    setActionError("");

    try {
      const summary = course
        ? await getMasterCourseDeleteSummary(course.id)
        : await getMasterCoursesDeleteAllSummary();

      setDeleteTarget({ course, summary });
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setActionError("");

    try {
      if (deleteTarget.course) {
        await deleteMasterCourse(deleteTarget.course.id);
        setNotice(`تم حذف الكورس "${deleteTarget.course.title}" وكل بياناته.`);
      } else {
        const result = await deleteAllMasterCourses();
        setNotice(`تم حذف ${result.deletedCourses} كورس وكل بياناتها.`);
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

  const togglePublish = async (course) => {
    setActionError("");

    try {
      await setMasterCoursePublished(course.id, !course.published);
      setNotice(course.published ? "تم إلغاء نشر الكورس." : "تم نشر الكورس.");
      reload();
    } catch (publishError) {
      setActionError(publishError.message);
    }
  };

  const gradeFilterOptions = [
    { value: "all", label: "كل الصفوف" },
    ...(data?.gradeOptions ?? []).map((item) => ({ value: item.id, label: item.label })),
  ];

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="الكورسات والمحتوى"
          description="أنشئ الكورسات، وأدر وحداتها ودروسها، وتحكم في نشرها للطلاب."
          actionLabel="إضافة كورس"
          actionTo="/dashboard-master/courses/new"
          actionIcon={faPlus}
        />

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <MasterSearchFilters
              search={search}
              onSearchChange={changeFilter(setSearch)}
              searchPlaceholder="ابحث باسم الكورس..."
              filters={[
                {
                  id: "grade",
                  label: "الصف",
                  value: grade,
                  onChange: changeFilter(setGrade),
                  options: gradeFilterOptions,
                },
                {
                  id: "publish",
                  label: "الحالة",
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
            حذف كل الكورسات
          </button>
        </div>

        {loading ? (
          <MasterEmptyState title="جاري تحميل الكورسات..." />
        ) : data?.rows.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.rows.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]"
                >
                  <div className="relative aspect-[16/9] bg-[#071321]">
                    {course.image && (
                      <img src={course.image} alt="" className="h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071321]/85 via-transparent to-transparent" />
                    <div className="absolute right-3 top-3">
                      <MasterStatusBadge
                        status={course.publishStatus}
                        label={course.publishLabel}
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-extrabold text-gold">{course.gradeLabel}</p>
                    <h2 className="mt-2 min-h-14 text-lg font-black leading-7 text-white">
                      {course.title}
                    </h2>

                    <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                      {[
                        ["الوحدات", course.unitsCount],
                        ["الدروس", course.lessonsCount],
                        ["الامتحانات", course.examsCount],
                        ["الطلاب", course.studentsCount],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-white/[0.03] px-1 py-2.5">
                          <dd className="text-base font-black text-white">{value}</dd>
                          <dt className="mt-1 text-[11px] font-bold text-white/40">{label}</dt>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Link
                        to={`/dashboard-master/courses/${course.id}`}
                        className={softButtonClass}
                      >
                        <FontAwesomeIcon icon={faLayerGroup} />
                        إدارة المحتوى
                      </Link>
                      <Link
                        to={`/dashboard-master/courses/${course.id}/edit`}
                        className={iconButtonClass}
                        aria-label="تعديل الكورس"
                        title="تعديل"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => togglePublish(course)}
                        className={iconButtonClass}
                        aria-label={course.published ? "إلغاء النشر" : "نشر الكورس"}
                        title={course.published ? "إلغاء النشر" : "نشر"}
                      >
                        <FontAwesomeIcon icon={course.published ? faEyeSlash : faEye} />
                      </button>
                      <button
                        type="button"
                        onClick={() => askDelete(course)}
                        className={iconDangerButtonClass}
                        aria-label="حذف الكورس"
                        title="حذف"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1a2b]">
              <MasterPagination {...data.pagination} itemLabel="كورس" onPageChange={setPage} />
            </div>
          </>
        ) : (
          <MasterEmptyState
            icon={faBookOpen}
            title="لا توجد كورسات"
            description="لم يتم العثور على كورسات مطابقة. جرّب تغيير البحث أو أضف كورسًا جديدًا."
          />
        )}
      </div>

      <MasterConfirmModal
        isOpen={Boolean(deleteTarget)}
        isDanger
        isLoading={isDeleting}
        title={deleteTarget?.course ? "حذف الكورس" : "حذف كل الكورسات"}
        message={deleteTarget ? buildDeleteMessage(deleteTarget.summary, !deleteTarget.course) : ""}
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
      />
    </div>
  );
}

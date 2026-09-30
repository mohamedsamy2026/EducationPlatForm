import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faTrashCan, faUserGraduate, faUsers } from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import { deleteAllMasterStudents, deleteMasterStudent, getMasterStudentsPage, getMasterStudentsSummary } from "../../services/masterStudentsService";

const PAGE_SIZE = 20;

function StudentAvatar({ name }) {
  const initial = String(name ?? "ط").trim().charAt(0) || "ط";
  return <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/15 bg-gold/10 text-base font-black text-gold">{initial}</span>;
}

export default function MasterStudents() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [subscriptionStatus, setSubscriptionStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSummary() {
      try {
        const nextSummary = await getMasterStudentsSummary();
        if (!cancelled) setSummary(nextSummary);
      } catch {
        if (!cancelled) setError("تعذر تحميل ملخص الطلاب.");
      }
    }
    loadSummary();
    return () => { cancelled = true; };
  }, [refreshKey]);

  useEffect(() => {
    let cancelled = false;
    async function loadStudents() {
      setIsLoading(true);
      setError("");
      try {
        const result = await getMasterStudentsPage({ search, grade, subscriptionStatus, page, pageSize: PAGE_SIZE });
        if (!cancelled) {
          setPageData(result);
          setPage(result.pagination.page);
        }
      } catch {
        if (!cancelled) setError("تعذر تحميل قائمة الطلاب.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadStudents();
    return () => { cancelled = true; };
  }, [search, grade, subscriptionStatus, page, refreshKey]);

  const handleSearchChange = (value) => { setSearch(value); setPage(1); };
  const handleGradeChange = (value) => { setGrade(value); setPage(1); };
  const handleSubscriptionChange = (value) => { setSubscriptionStatus(value); setPage(1); };

  const cancelDelete = useCallback(() => {
    if (!isDeleting) setDeleteTarget(null);
  }, [isDeleting]);

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    setError("");
    try {
      if (deleteTarget.type === "all") {
        const result = await deleteAllMasterStudents();
        setNotice("تم حذف " + result.deletedStudents + " طالبًا وكل البيانات المرتبطة بهم نهائيًا.");
      } else {
        await deleteMasterStudent(deleteTarget.student.id);
        setNotice("تم حذف الطالب وكل البيانات المرتبطة به نهائيًا.");
      }
      setDeleteTarget(null);
      setPage(1);
      setRefreshKey((value) => value + 1);
    } catch (deleteError) {
      setError(deleteError.message || "تعذر حذف بيانات الطالب.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const gradeOptions = [{ value: "all", label: "كل الصفوف" }, ...(pageData?.gradeOptions ?? []).map((item) => ({ value: item.id, label: item.label }))];
  const rows = pageData?.rows ?? [];
  const pagination = pageData?.pagination ?? { page: 1, pageCount: 0, pageSize: PAGE_SIZE, total: 0 };

  return (
    <div dir="rtl" className="min-h-screen bg-midnight px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <MasterPageHeader title="الطلاب" description="إدارة الطلاب وبياناتهم واشتراكاتهم" />
          {summary?.totalStudents > 0 && <button type="button" onClick={() => setDeleteTarget({ type: "all" })} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-danger/20 bg-danger/10 px-4 text-sm font-extrabold text-danger transition hover:bg-danger/15"><FontAwesomeIcon icon={faTrashCan} />حذف كل الطلاب</button>}
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{error}</div>}
        {notice && <div role="status" className="mb-5 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-bold text-success">{notice}<button type="button" onClick={() => setNotice("")} className="mr-3 underline">إغلاق</button></div>}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MasterStatCard label="إجمالي الطلاب" value={summary?.totalStudents ?? "—"} icon={faUsers} />
          <MasterStatCard label="الطلاب المشتركين" value={summary?.subscribedStudents ?? "—"} icon={faGraduationCap} />
          <MasterStatCard label="طلبات جديدة" value={summary?.pendingRequestsCount ?? "—"} icon={faUserGraduate} note={"اشتراكات: " + (summary?.pendingSubscriptionsCount ?? "—") + " · طلبات كتب: " + (summary?.pendingBookRequestsCount ?? "—")} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
          <div className="border-b border-white/10 p-4 sm:p-5">
            <MasterSearchFilters
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder="ابحث باسم الطالب أو البريد أو الهاتف..."
              filters={[
                { id: "grade", label: "الصف", value: grade, onChange: handleGradeChange, options: gradeOptions },
                { id: "subscription", label: "الاشتراك", value: subscriptionStatus, onChange: handleSubscriptionChange, options: [{ value: "all", label: "كل الحالات" }, { value: "active", label: "مشترك" }, { value: "inactive", label: "غير مشترك" }] },
              ]}
            />
          </div>

          {isLoading ? <div className="p-5"><MasterEmptyState title="جاري تحميل الطلاب..." /></div> : rows.length === 0 ? (
            <div className="p-5"><MasterEmptyState title={search || grade !== "all" || subscriptionStatus !== "all" ? "لا توجد نتائج مطابقة" : "لا يوجد طلاب حتى الآن"} description="جرّب تعديل البحث أو الفلاتر." /></div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px] text-right">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-xs font-extrabold text-white/45"><tr><th className="px-5 py-4">الطالب</th><th className="px-4 py-4">الصف</th><th className="px-4 py-4">رقم الهاتف</th><th className="px-4 py-4">الكورسات</th><th className="px-4 py-4">حالة الاشتراك</th><th className="px-5 py-4">إجراءات</th></tr></thead>
                  <tbody className="divide-y divide-white/10">
                    {rows.map((student) => <tr key={student.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4"><Link to={"/dashboard-master/students/" + student.id} className="flex items-center gap-3 group"><StudentAvatar name={student.name}/><span className="min-w-0"><span className="block truncate text-sm font-black text-white transition group-hover:text-gold">{student.name}</span><span className="mt-1 block max-w-56 truncate text-xs text-white/40">{student.email}</span></span></Link></td>
                      <td className="px-4 py-4 text-sm font-bold text-white/65">{student.gradeLabel}</td>
                      <td dir="ltr" className="px-4 py-4 text-right text-sm font-bold text-white/65">{student.phone || "—"}</td>
                      <td className="px-4 py-4 text-sm font-bold text-white/65">{student.courseTitles.length ? <span title={student.courseTitles.join("، ")}>{student.courseTitles.length} كورس{student.courseTitles.length > 1 ? "ات" : ""}</span> : "—"}</td>
                      <td className="px-4 py-4"><MasterStatusBadge status={student.subscriptionStatus} label={student.subscriptionLabel}/></td>
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><Link to={"/dashboard-master/students/" + student.id} className="text-xs font-extrabold text-gold transition hover:text-gold-light">عرض التفاصيل</Link><button type="button" onClick={() => setDeleteTarget({ type: "single", student })} aria-label={"حذف الطالب " + student.name} className="flex h-9 w-9 items-center justify-center rounded-lg text-danger/75 transition hover:bg-danger/10 hover:text-danger"><FontAwesomeIcon icon={faTrashCan}/></button></div></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 p-3 md:hidden">
                {rows.map((student) => <article key={student.id} className="rounded-xl border border-white/10 bg-[#091625] p-4">
                  <div className="flex items-start justify-between gap-3"><Link to={"/dashboard-master/students/" + student.id} className="flex min-w-0 items-center gap-3"><StudentAvatar name={student.name}/><span className="min-w-0"><span className="block truncate text-sm font-black text-white">{student.name}</span><span className="mt-1 block truncate text-xs text-white/40">{student.email}</span></span></Link><button type="button" onClick={() => setDeleteTarget({ type: "single", student })} aria-label={"حذف الطالب " + student.name} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-danger/75 hover:bg-danger/10"><FontAwesomeIcon icon={faTrashCan}/></button></div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><span className="text-white/35">الصف</span><p className="mt-1 font-bold text-white/75">{student.gradeLabel}</p></div><div><span className="text-white/35">الهاتف</span><p dir="ltr" className="mt-1 text-right font-bold text-white/75">{student.phone || "—"}</p></div><div><span className="text-white/35">الكورسات</span><p className="mt-1 font-bold text-white/75">{student.courseTitles.length || "—"}</p></div><div><span className="text-white/35">الاشتراك</span><div className="mt-1"><MasterStatusBadge status={student.subscriptionStatus} label={student.subscriptionLabel}/></div></div></div>
                  <Link to={"/dashboard-master/students/" + student.id} className="mt-4 block border-t border-white/10 pt-3 text-xs font-extrabold text-gold">عرض التفاصيل</Link>
                </article>)}
              </div>
              <MasterPagination {...pagination} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>

      <MasterConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.type === "all" ? "حذف كل الطلاب نهائيًا؟" : "حذف الطالب نهائيًا؟"}
        message={deleteTarget?.type === "all" ? "سيتم حذف " + (summary?.totalStudents ?? 0) + " طالب وكل بياناتهم المرتبطة، بما فيها الاشتراكات والنتائج والطلبات وصلاحيات الدروس. لا يمكن التراجع عن هذا الإجراء." : "سيتم حذف " + (deleteTarget?.student?.name ?? "الطالب") + " وكل بياناته المرتبطة، بما فيها الاشتراكات والنتائج والطلبات وصلاحيات الدروس. لا يمكن التراجع عن هذا الإجراء."}
        confirmLabel="حذف نهائي"
        isDanger
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faClipboardCheck, faKey, faPen, faSave, faShoppingBag, faTrashCan, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import { deleteMasterStudent, getMasterStudentDetails, getMasterStudentsPage, updateMasterStudent } from "../../services/masterStudentsService";

function formatDate(value) {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "غير محدد";
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function Section({ title, icon, count, children }) {
  return <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.12)]"><header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4"><h2 className="flex items-center gap-3 text-base font-black text-white"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold"><FontAwesomeIcon icon={icon}/></span>{title}</h2>{count !== undefined && <span className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs font-black text-white/55">{count}</span>}</header><div className="p-4 sm:p-5">{children}</div></section>;
}

function DetailEmpty({ text }) {
  return <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm font-bold text-white/40">{text}</p>;
}

export default function MasterStudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadDetails() {
      setIsLoading(true);
      setError("");
      try {
        const [details, page] = await Promise.all([
          getMasterStudentDetails(studentId),
          getMasterStudentsPage({ pageSize: 1000 }),
        ]);
        if (!cancelled) {
          setData(details);
          setGradeOptions(page.gradeOptions);
          setDraft(details ? { ...details.student } : null);
        }
      } catch {
        if (!cancelled) setError("تعذر تحميل بيانات الطالب.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadDetails();
    return () => { cancelled = true; };
  }, [studentId]);

  const cancelDelete = useCallback(() => {
    if (!isDeleting) setDeleteOpen(false);
  }, [isDeleting]);

  const updateDraft = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const saveStudent = async (event) => {
    event.preventDefault();
    if (!draft || isSaving) return;
    setIsSaving(true);
    setError("");
    try {
      const savedStudent = await updateMasterStudent(studentId, draft);
      setData((current) => ({ ...current, student: savedStudent, gradeLabel: gradeOptions.find((item) => item.id === savedStudent.grade)?.label ?? current.gradeLabel }));
      setDraft(savedStudent);
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError.message || "تعذر حفظ بيانات الطالب.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError("");
    try {
      await deleteMasterStudent(studentId);
      navigate("/dashboard-master/students", { replace: true });
    } catch (deleteError) {
      setError(deleteError.message || "تعذر حذف بيانات الطالب.");
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div dir="rtl" className="min-h-screen bg-midnight px-4 py-8 sm:px-6 lg:px-10"><div className="mx-auto max-w-[1400px]"><MasterEmptyState title="جاري تحميل بيانات الطالب..." /></div></div>;
  if (error && !data) return <div dir="rtl" className="min-h-screen bg-midnight px-4 py-8 sm:px-6 lg:px-10"><div className="mx-auto max-w-[1400px]"><MasterPageHeader title="بيانات الطالب" backTo="/dashboard-master/students" backLabel="العودة إلى الطلاب"/><MasterEmptyState title="تعذر عرض بيانات الطالب" description={error}/></div></div>;
  if (!data) return <div dir="rtl" className="min-h-screen bg-midnight px-4 py-8 sm:px-6 lg:px-10"><div className="mx-auto max-w-[1400px]"><MasterPageHeader title="الطالب غير موجود" backTo="/dashboard-master/students" backLabel="العودة إلى الطلاب"/><MasterEmptyState title="لم يتم العثور على الطالب" description="قد يكون الطالب حُذف أو أن الرابط غير صحيح."/></div></div>;

  const { student } = data;
  const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-[#091625] px-3 text-sm font-bold text-white outline-none focus:border-gold/40";
  const valueClass = "mt-1 text-sm font-bold text-white/75";

  return (
    <div dir="rtl" className="min-h-screen bg-midnight px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1400px]">
        <MasterPageHeader title="تفاصيل الطالب" description={student.name} backTo="/dashboard-master/students" backLabel="العودة إلى الطلاب"/>
        {error && <div role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{error}</div>}

        <Section title="البيانات الشخصية" icon={faUserGraduate}>
          <form onSubmit={saveStudent}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="اسم الطالب" value={draft?.name ?? ""} editing={isEditing} inputClass={inputClass} onChange={(value) => updateDraft("name", value)} />
              <Field label="البريد الإلكتروني" value={draft?.email ?? ""} editing={isEditing} inputClass={inputClass} type="email" onChange={(value) => updateDraft("email", value)} />
              <Field label="هاتف الطالب" value={draft?.phone ?? ""} editing={isEditing} inputClass={inputClass} onChange={(value) => updateDraft("phone", value)} dir="ltr" />
              <Field label="هاتف ولي الأمر" value={draft?.guardianPhone ?? ""} editing={isEditing} inputClass={inputClass} onChange={(value) => updateDraft("guardianPhone", value)} dir="ltr" />
              <div><label className="text-xs font-bold text-white/40">الصف الدراسي</label>{isEditing ? <select value={draft.grade} onChange={(event) => updateDraft("grade", event.target.value)} className={inputClass + " mt-1"}>{gradeOptions.map((item) => <option key={item.id} value={item.id} className="bg-[#0c1a2b]">{item.label}</option>)}</select> : <p className={valueClass}>{data.gradeLabel}</p>}</div>
              <Field label="المحافظة" value={draft?.governorate ?? ""} editing={isEditing} inputClass={inputClass} onChange={(value) => updateDraft("governorate", value)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {isEditing ? <><button type="submit" disabled={isSaving} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gold px-4 text-sm font-extrabold text-midnight transition hover:bg-gold-light disabled:opacity-50"><FontAwesomeIcon icon={faSave}/>{isSaving ? "جارٍ الحفظ..." : "حفظ التعديلات"}</button><button type="button" onClick={() => { setDraft({ ...student }); setIsEditing(false); }} className="min-h-10 rounded-xl border border-white/10 px-4 text-sm font-extrabold text-white/55 hover:bg-white/[0.04]">إلغاء</button></> : <button type="button" onClick={() => setIsEditing(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 text-sm font-extrabold text-gold transition hover:bg-gold hover:text-midnight"><FontAwesomeIcon icon={faPen}/>تعديل بيانات الطالب</button>}
              <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-4 text-sm font-extrabold text-danger transition hover:bg-danger/15"><FontAwesomeIcon icon={faTrashCan}/>حذف الطالب</button>
            </div>
          </form>
        </Section>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Section title="الكورسات والاشتراكات" icon={faBookOpen} count={data.enrollments.length}>
            {data.enrollments.length ? <div className="space-y-3">{data.enrollments.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-[#091625] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-black text-white">{item.courseTitle}</h3><p className="mt-1 text-xs font-bold text-white/40">{item.planLabel}</p></div><MasterStatusBadge status={item.status} label={item.statusLabel}/></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><span className="text-white/35">يبدأ</span><p className="mt-1 font-bold text-white/65">{formatDate(item.startsAt)}</p></div><div><span className="text-white/35">ينتهي</span><p className="mt-1 font-bold text-white/65">{formatDate(item.endsAt)}</p></div></div></article>)}</div> : <DetailEmpty text="لا توجد اشتراكات مسجلة لهذا الطالب."/>}
          </Section>

          <Section title="النتائج" icon={faClipboardCheck} count={data.results.length}>
            {data.results.length ? <div className="space-y-3">{data.results.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-[#091625] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-black text-white">{item.examTitle}</h3><p className="mt-1 text-xs font-bold text-white/40">{item.courseTitle}</p></div><MasterStatusBadge status={item.status} label={item.statusLabel}/></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><span className="font-black text-white">{item.score} / {item.total}{item.percentage !== null ? " · " + item.percentage + "%" : ""}</span><span className="font-bold text-white/40">{formatDate(item.submittedAt)}</span></div></article>)}</div> : <DetailEmpty text="لا توجد نتائج مسجلة لهذا الطالب."/>}
          </Section>

          <Section title="الطلبات" icon={faShoppingBag} count={data.requests.length}>
            {data.requests.length ? <div className="space-y-3">{data.requests.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-[#091625] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-black text-white">{item.description}</h3><span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] font-bold text-white/45">{item.typeLabel}</span></div><p className="mt-1 text-xs font-bold text-white/40">رقم الطلب: {item.referenceNumber}</p></div><MasterStatusBadge status={item.status} label={item.statusLabel}/></div><p className="mt-3 text-xs font-bold text-white/35">{formatDate(item.createdAt)}</p></article>)}</div> : <DetailEmpty text="لا توجد طلبات لهذا الطالب."/>}
          </Section>

          <Section title="صلاحيات الدروس" icon={faKey} count={data.lessonAccess.length}>
            {data.lessonAccess.length ? <div className="space-y-3">{data.lessonAccess.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#091625] p-4"><div><h3 className="text-sm font-black text-white">{item.lessonTitle}</h3><p className="mt-1 text-xs font-bold text-white/40">{item.courseTitle}</p></div><MasterStatusBadge status={item.status} label={item.statusLabel}/></article>)}</div> : <DetailEmpty text="لا توجد صلاحيات دروس خاصة لهذا الطالب."/>}
          </Section>
        </div>
      </div>
      <MasterConfirmModal isOpen={deleteOpen} title="حذف الطالب نهائيًا؟" message={"سيتم حذف " + student.name + " وكل بياناته المرتبطة، بما فيها الاشتراكات والنتائج والطلبات وصلاحيات الدروس. لا يمكن التراجع عن هذا الإجراء."} confirmLabel="حذف نهائي" isDanger isLoading={isDeleting} onConfirm={confirmDelete} onCancel={cancelDelete}/>
    </div>
  );
}

function Field({ label, value, editing, inputClass, onChange, type = "text", dir }) {
  return <div><label className="text-xs font-bold text-white/40">{label}</label>{editing ? <input type={type} value={value} dir={dir} onChange={(event) => onChange(event.target.value)} className={inputClass + " mt-1"}/> : <p dir={dir} className="mt-1 break-words text-sm font-bold text-white/75">{value || "غير محدد"}</p>}</div>;
}


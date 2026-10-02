import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterImageField from "../../Components/DashboardMaster/Shared/MasterImageField";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import {
  cardClass,
  ghostButtonClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { getMasterCourseForm, saveMasterCourse } from "../../services/masterCoursesService";

export default function MasterCourseForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(courseId);

  const { data, loading, error } = useAsyncData(
    () => getMasterCourseForm(courseId ?? null),
    [courseId],
  );
  const [draft, setDraft] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const form = draft ?? data?.form;

  const update = (name, value) => setDraft({ ...form, [name]: value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      const result = await saveMasterCourse(courseId ?? null, form);

      navigate(isEdit ? "/dashboard-master/courses" : `/dashboard-master/courses/${result.id}`);
    } catch (submitError) {
      setSaveError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-10">
        <MasterPageHeader
          title={isEdit ? "تعديل الكورس" : "إضافة كورس"}
          description="بيانات الكورس وأسعار الاشتراك. الدروس والوحدات بتتضاف من صفحة إدارة المحتوى."
          backTo="/dashboard-master/courses"
          backLabel="كل الكورسات"
        />

        <MasterNotice type="error">{saveError || error}</MasterNotice>

        {loading || !form ? (
          <MasterEmptyState title={error || "جاري التحميل..."} />
        ) : (
          <form onSubmit={handleSubmit} className={`${cardClass} space-y-5 p-5 sm:p-7`}>
            <MasterField
              label="اسم الكورس"
              name="title"
              value={form.title}
              onChange={update}
              required
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MasterField
                label="الصف الدراسي"
                name="grade"
                as="select"
                value={form.grade}
                onChange={update}
                options={data.gradeOptions.map((item) => ({ value: item.id, label: item.label }))}
                required
              />
              <MasterField
                label="مدة الكورس (نص يظهر للطالب)"
                name="duration"
                value={form.duration}
                onChange={update}
              />
            </div>
            <MasterField
              label="وصف الكورس"
              name="description"
              as="textarea"
              rows={4}
              value={form.description}
              onChange={update}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MasterField
                label="سعر الاشتراك الشهري (جنيه)"
                name="monthlyPrice"
                type="number"
                min="0"
                value={form.monthlyPrice}
                onChange={update}
                required
              />
              <MasterField
                label="سعر اشتراك الترم (جنيه)"
                name="termPrice"
                type="number"
                min="0"
                value={form.termPrice}
                onChange={update}
                required
              />
            </div>
            <MasterImageField
              label="صورة الكورس"
              value={form.image}
              onChange={(image) => update("image", image)}
              hint="مؤقتًا بتتحفظ في الذاكرة بس. بعد ربط التخزين الحقيقي هترفع على Cloudinary."
            />
            <MasterField
              label="حالة النشر"
              name="published"
              as="select"
              value={String(form.published)}
              onChange={(name, value) => update(name, value === "true")}
              options={[
                { value: "false", label: "غير منشور (مخفي عن الطلاب)" },
                { value: "true", label: "منشور (ظاهر للطلاب)" },
              ]}
            />

            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/dashboard-master/courses")}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isSaving} className={primaryButtonClass}>
                {isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء الكورس"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

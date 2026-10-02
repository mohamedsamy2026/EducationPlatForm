import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import {
  cardClass,
  ghostButtonClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { getMasterExamForm, saveMasterExam } from "../../services/masterExamsService";

export default function MasterExamForm() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(examId);
  const presetCourseId = searchParams.get("courseId") ?? "";

  const { data, loading, error } = useAsyncData(
    () => getMasterExamForm(examId ?? null, presetCourseId),
    [examId, presetCourseId],
  );
  const [draft, setDraft] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const form = draft ?? data?.form;
  const selectedCourse = data?.courseOptions.find(
    (course) => String(course.id) === String(form?.courseId),
  );

  const update = (name, value) => {
    // لما الكورس يتغير الوحدة المختارة بتتصفّر عشان ما تفضلش وحدة من كورس تاني
    setDraft(
      name === "courseId" ? { ...form, courseId: value, unitId: "" } : { ...form, [name]: value },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      const result = await saveMasterExam(examId ?? null, form);

      navigate(`/dashboard-master/exams/${result.id}`);
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
          title={isEdit ? "تعديل الامتحان" : "إضافة امتحان"}
          description="حالة الامتحان (لم يبدأ / متاح / منتهي) بتتحسب تلقائيًا من وقت البداية والنهاية."
          backTo="/dashboard-master/exams"
          backLabel="كل الامتحانات"
        />

        <MasterNotice type="error">{saveError || error}</MasterNotice>

        {loading || !form ? (
          <MasterEmptyState title={error || "جاري التحميل..."} />
        ) : (
          <form onSubmit={handleSubmit} className={`${cardClass} space-y-5 p-5 sm:p-7`}>
            <MasterField
              label="اسم الامتحان"
              name="title"
              value={form.title}
              onChange={update}
              required
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MasterField
                label="الكورس"
                name="courseId"
                as="select"
                value={form.courseId}
                onChange={update}
                options={data.courseOptions.map((course) => ({
                  value: course.id,
                  label: course.label,
                }))}
                required
              />
              <MasterField
                label="الوحدة (اختياري)"
                name="unitId"
                as="select"
                value={form.unitId}
                onChange={update}
                options={[
                  { value: "", label: "مراجعة عامة (بدون وحدة)" },
                  ...(selectedCourse?.units ?? []).map((unit) => ({
                    value: unit.id,
                    label: unit.label,
                  })),
                ]}
              />
            </div>
            <MasterField
              label="مدة الامتحان (بالدقائق)"
              name="durationMinutes"
              type="number"
              min="1"
              value={form.durationMinutes}
              onChange={update}
              required
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MasterField
                label="يبدأ في"
                name="startsAt"
                type="datetime-local"
                value={form.startsAt}
                onChange={update}
                required
              />
              <MasterField
                label="ينتهي في"
                name="endsAt"
                type="datetime-local"
                value={form.endsAt}
                onChange={update}
                required
              />
            </div>
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
              hint="الامتحان مسموح للطالب مرة واحدة فقط."
            />

            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/dashboard-master/exams")}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isSaving} className={primaryButtonClass}>
                {isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء الامتحان"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

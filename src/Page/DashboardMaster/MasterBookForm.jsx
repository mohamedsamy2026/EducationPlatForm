import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterImageField from "../../Components/DashboardMaster/Shared/MasterImageField";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import {
  cardClass,
  ghostButtonClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { getMasterBookForm, saveMasterBook } from "../../services/masterBooksService";

export default function MasterBookForm() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(bookId);

  const { data, loading, error } = useAsyncData(() => getMasterBookForm(bookId ?? null), [bookId]);
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
      await saveMasterBook(bookId ?? null, form);
      navigate("/dashboard-master/books");
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
          title={isEdit ? "تعديل الكتاب" : "إضافة كتاب"}
          description="الكتاب غير المتاح بيفضل ظاهر للطالب لكن من غير زر شراء."
          backTo="/dashboard-master/books"
          backLabel="كل الكتب"
        />

        <MasterNotice type="error">{saveError || error}</MasterNotice>

        {loading || !form ? (
          <MasterEmptyState title={error || "جاري التحميل..."} />
        ) : (
          <form onSubmit={handleSubmit} className={`${cardClass} space-y-5 p-5 sm:p-7`}>
            <MasterField
              label="اسم الكتاب"
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
                label="السعر (جنيه)"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={update}
                required
              />
            </div>
            <MasterField
              label="وصف الكتاب"
              name="description"
              as="textarea"
              rows={4}
              value={form.description}
              onChange={update}
            />
            <MasterImageField
              label="غلاف الكتاب"
              value={form.image}
              onChange={(image) => update("image", image)}
              hint="مؤقتًا بتتحفظ في الذاكرة بس. بعد ربط التخزين الحقيقي هترفع على Cloudinary."
            />
            <MasterField
              label="التوفر للشراء"
              name="availability"
              as="select"
              value={form.availability}
              onChange={update}
              options={[
                { value: "available", label: "متاح للشراء" },
                { value: "unavailable", label: "غير متاح للشراء" },
              ]}
            />

            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/dashboard-master/books")}
                className={ghostButtonClass}
              >
                إلغاء
              </button>
              <button type="submit" disabled={isSaving} className={primaryButtonClass}>
                {isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الكتاب"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// مصدر واحد لكل النصوص والحالات المعروضة في لوحة المستر.
// أي صفحة أو service تحتاج اسم حالة تاخده من هنا ولا تكتبه بنفسها.

export const UNKNOWN_LABEL = "غير محدد";

export const REQUEST_STATUS_LABELS = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

export const ENROLLMENT_STATUS_LABELS = {
  active: "نشط",
  expired: "منتهي",
  ended: "تم إنهاؤه",
  inactive: "منتهي",
};

export const SUBSCRIPTION_STATUS_LABELS = {
  active: "مشترك",
  inactive: "غير مشترك",
};

export const RESULT_STATUS_LABELS = {
  graded: "مكتملة التصحيح",
  needs_review: "تحتاج تصحيحًا",
};

export const LESSON_ACCESS_STATUS_LABELS = {
  active: "نشطة",
  inactive: "غير نشطة",
};

export const PLAN_LABELS = {
  monthly: "اشتراك شهري",
  term: "اشتراك الترم",
};

export const PUBLISH_STATUS_LABELS = {
  published: "منشور",
  draft: "غير منشور",
};

export const EXAM_TIME_STATUS_LABELS = {
  upcoming: "لم يبدأ",
  open: "متاح الآن",
  ended: "منتهي",
};

export const BOOK_AVAILABILITY_LABELS = {
  available: "متاح للشراء",
  unavailable: "غير متاح للشراء",
};

export const QUESTION_TYPE_LABELS = {
  "multiple-choice": "اختيار من متعدد",
  "true-false": "صح / خطأ",
  essay: "مقالي",
};

export const STORAGE_PROVIDER_LABELS = {
  supabase: "قاعدة البيانات (Supabase)",
  cloudinary: "الصور (Cloudinary)",
  drive: "الملازم (Google Drive)",
};

export function getLabel(labels, key, fallback = UNKNOWN_LABEL) {
  return labels[key] ?? fallback;
}

// أرقام استهلاك المساحة (تجريبية). لما نربط الخلفية بتتجاب من السيرفر بنفس الشكل.
// limitBytes هو حد الخطة المجانية الحالية: راجعه من صفحة أسعار كل خدمة وعدّله هنا لو اتغير.
const MB = 1024 * 1024;
const GB = 1024 * MB;

const storageUsage = [
  { provider: "supabase", usedBytes: 380 * MB, limitBytes: 500 * MB },
  { provider: "cloudinary", usedBytes: 6.4 * GB, limitBytes: 25 * GB },
  { provider: "drive", usedBytes: 9.2 * GB, limitBytes: 15 * GB },
];

export default storageUsage;

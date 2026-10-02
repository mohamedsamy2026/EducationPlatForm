const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

// قراءة صورة كـ data URL (مؤقت في الـ mock: بتضيع مع الـ refresh، وبعدين تتبدل برابط Cloudinary)
export default function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("لم يتم اختيار ملف."));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("الملف المختار ليس صورة."));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error("حجم الصورة أكبر من 3 ميجا."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("تعذر قراءة الصورة."));
    reader.readAsDataURL(file);
  });
}

// تنزيل ملف نصي من المتصفح (يُستخدم لتصدير CSV). BOM عشان Excel يقرأ العربي صح.
export default function downloadTextFile(filename, content, mimeType = "text/csv") {
  const blob = new Blob(["\uFEFF" + content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

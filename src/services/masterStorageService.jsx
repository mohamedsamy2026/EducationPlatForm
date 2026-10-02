import storageUsage from "../data/storageUsage";
import { STORAGE_PROVIDER_LABELS, getLabel } from "../constants/statusLabels";

// بيانات تجريبية بنفس الشكل النهائي. لما نربط الخلفية، الأرقام دي بتيجي من السيرفر
// (دالة سيرفر تتأكد إن اللي بيسأل هو المستر، وتحفظ النتيجة ساعة تقريبًا) والصفحة ما بتتغيرش.
// الصفحة لازم تعرض أي رقم قادم من هنا مع بادج "بيانات تجريبية" طالما isMock = true.
export async function getMasterStorageUsage() {
  return storageUsage.map((item) => {
    const percent = Math.min(100, Math.round((item.usedBytes / item.limitBytes) * 100));

    return {
      provider: item.provider,
      label: getLabel(STORAGE_PROVIDER_LABELS, item.provider),
      usedBytes: item.usedBytes,
      limitBytes: item.limitBytes,
      remainingBytes: Math.max(0, item.limitBytes - item.usedBytes),
      percent,
      level: percent >= 90 ? "danger" : percent >= 80 ? "warning" : "ok",
      updatedAt: null,
      isMock: true,
    };
  });
}

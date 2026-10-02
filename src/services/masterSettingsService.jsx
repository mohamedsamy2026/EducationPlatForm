import { getMasterProfile, updateMasterProfile } from "./masterProfileService";
import { getAllPaymentMethods, updatePaymentMethod } from "./paymentMethodService";
import { deleteAllMessages, getMessages } from "./chatService";
import { getMasterStorageUsage } from "./masterStorageService";

function requireText(value, message) {
  const text = String(value ?? "").trim();

  if (!text) throw new Error(message);

  return text;
}

function requirePhone(value, message) {
  const text = String(value ?? "").replace(/\s+/g, "");

  if (!/^01[0125][0-9]{8}$/.test(text)) throw new Error(message);

  return text;
}

export async function getMasterSettings() {
  const [profile, paymentMethods, storage, messages] = await Promise.all([
    getMasterProfile(),
    getAllPaymentMethods(),
    getMasterStorageUsage(),
    getMessages(),
  ]);

  return { profile, paymentMethods, storage, chatMessagesCount: messages.length };
}

export async function saveMasterProfile(form) {
  const name = requireText(form.name, "اسم المستر مطلوب.");
  const email = requireText(form.email, "البريد الإلكتروني مطلوب.");
  const telegramUrl = requireText(form.telegramUrl, "رابط Telegram مطلوب.");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("البريد الإلكتروني غير صحيح.");
  if (!/^https:\/\/(t\.me|telegram\.me)\//i.test(telegramUrl)) {
    throw new Error("رابط Telegram لازم يبدأ بـ https://t.me/");
  }

  await updateMasterProfile({
    name,
    email,
    phone: requirePhone(form.phone, "رقم الهاتف غير صحيح (مثال: 01012345678)."),
    telegramUrl,
  });

  return { ok: true };
}

// تجريبي: بيتحقق من المدخلات فقط. التغيير الحقيقي بيتم لما نربط تسجيل الدخول.
export async function changeMasterPassword({ currentPassword, newPassword, confirmPassword }) {
  requireText(currentPassword, "اكتب كلمة المرور الحالية.");

  if (String(newPassword ?? "").length < 8)
    throw new Error("كلمة المرور الجديدة لازم تكون 8 أحرف على الأقل.");
  if (newPassword !== confirmPassword)
    throw new Error("كلمة المرور الجديدة وتأكيدها غير متطابقين.");

  return { ok: true };
}

export async function saveMasterPaymentMethod(paymentMethodId, form) {
  const accountNumber = requirePhone(
    form.accountNumber,
    "رقم الحساب غير صحيح (مثال: 01012345678).",
  );
  const supportWhatsApp = requirePhone(form.supportWhatsApp, "رقم واتساب الدعم غير صحيح.");

  await updatePaymentMethod(paymentMethodId, {
    accountNumber,
    supportWhatsApp,
    isActive: Boolean(form.isActive),
  });

  return { ok: true };
}

export async function getMasterChatSummary() {
  const messages = await getMessages();

  return { messagesCount: messages.length };
}

export async function deleteAllMasterChatMessages() {
  return { deletedMessages: await deleteAllMessages() };
}

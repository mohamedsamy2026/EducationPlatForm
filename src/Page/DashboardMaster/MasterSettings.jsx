import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterField from "../../Components/DashboardMaster/Shared/MasterField";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import {
  cardClass,
  dangerButtonClass,
  primaryButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatBytes } from "../../utils/formatters";
import {
  changeMasterPassword,
  deleteAllMasterChatMessages,
  getMasterChatSummary,
  getMasterSettings,
  saveMasterPaymentMethod,
  saveMasterProfile,
} from "../../services/masterSettingsService";

const BAR_COLORS = { ok: "bg-success", warning: "bg-gold", danger: "bg-danger" };

function SectionCard({ title, description, children }) {
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <h2 className="text-lg font-black text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-xs font-bold leading-6 text-white/45">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

// كل قسم له نموذجه وحفظه المستقل
function useSection(initial, save) {
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  const form = draft ?? initial;

  const update = (name, value) => setDraft({ ...form, [name]: value });

  const submit = async (event, successText, afterSave) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await save(form);
      setMessage({ type: "success", text: successText });
      if (afterSave) afterSave();
    } catch (saveError) {
      setMessage({ type: "error", text: saveError.message });
    } finally {
      setIsSaving(false);
    }
  };

  return { form, update, submit, message, isSaving, reset: () => setDraft(null), setDraft };
}

export default function MasterSettings() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error } = useAsyncData(() => getMasterSettings(), [refreshKey]);

  const profile = useSection(data?.profile ?? null, saveMasterProfile);
  const password = useSection(
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    changeMasterPassword,
  );
  const payment = useSection(data?.paymentMethods[0] ?? null, (form) =>
    saveMasterPaymentMethod(form.id, form),
  );

  const [chatConfirm, setChatConfirm] = useState(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const askDeleteChats = async () => {
    try {
      setChatConfirm(await getMasterChatSummary());
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDeleteChats = async () => {
    setIsDeletingChat(true);

    try {
      const result = await deleteAllMasterChatMessages();

      setNotice(`تم حذف ${result.deletedMessages} رسالة.`);
      setChatConfirm(null);
      setRefreshKey((value) => value + 1);
    } catch (deleteError) {
      setActionError(deleteError.message);
      setChatConfirm(null);
    } finally {
      setIsDeletingChat(false);
    }
  };

  const reloadAfterSave = () => setRefreshKey((value) => value + 1);

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-10">
        <MasterPageHeader
          title="الإعدادات"
          description="بيانات حسابك، وبيانات الدفع اللي بتظهر للطلاب، ومتابعة المساحة المستخدمة."
        />

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        {loading || !data ? (
          <MasterEmptyState title={error || "جاري تحميل الإعدادات..."} />
        ) : (
          <div className="space-y-6">
            <SectionCard
              title="بيانات الحساب"
              description="الاسم ورابط Telegram بيظهروا في الشريط العلوي للوحة."
            >
              <form
                onSubmit={(event) =>
                  profile.submit(event, "تم حفظ بيانات الحساب.", reloadAfterSave)
                }
                className="space-y-4"
              >
                <MasterNotice type={profile.message.type || "success"}>
                  {profile.message.text}
                </MasterNotice>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MasterField
                    label="الاسم"
                    name="name"
                    value={profile.form.name}
                    onChange={profile.update}
                    required
                  />
                  <MasterField
                    label="رقم الهاتف"
                    name="phone"
                    dir="ltr"
                    value={profile.form.phone}
                    onChange={profile.update}
                    required
                  />
                  <MasterField
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    dir="ltr"
                    value={profile.form.email}
                    onChange={profile.update}
                    required
                  />
                  <MasterField
                    label="رابط Telegram"
                    name="telegramUrl"
                    dir="ltr"
                    value={profile.form.telegramUrl}
                    onChange={profile.update}
                    placeholder="https://t.me/username"
                    required
                  />
                </div>
                <button type="submit" disabled={profile.isSaving} className={primaryButtonClass}>
                  {profile.isSaving ? "جارٍ الحفظ..." : "حفظ بيانات الحساب"}
                </button>
              </form>
            </SectionCard>

            <SectionCard
              title="تغيير كلمة المرور"
              description="تجريبي حاليًا: بيتم التحقق من المدخلات فقط، والتغيير الفعلي بعد ربط تسجيل الدخول."
            >
              <form
                onSubmit={(event) =>
                  password.submit(event, "تم التحقق من كلمة المرور الجديدة (تجريبي).", () =>
                    password.setDraft({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }),
                  )
                }
                className="space-y-4"
              >
                <MasterNotice type={password.message.type || "success"}>
                  {password.message.text}
                </MasterNotice>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MasterField
                    label="كلمة المرور الحالية"
                    name="currentPassword"
                    type="password"
                    value={password.form.currentPassword}
                    onChange={password.update}
                    required
                  />
                  <MasterField
                    label="كلمة المرور الجديدة"
                    name="newPassword"
                    type="password"
                    value={password.form.newPassword}
                    onChange={password.update}
                    required
                  />
                  <MasterField
                    label="تأكيد كلمة المرور"
                    name="confirmPassword"
                    type="password"
                    value={password.form.confirmPassword}
                    onChange={password.update}
                    required
                  />
                </div>
                <button type="submit" disabled={password.isSaving} className={primaryButtonClass}>
                  تغيير كلمة المرور
                </button>
              </form>
            </SectionCard>

            {payment.form && (
              <SectionCard
                title={`بيانات الدفع (${payment.form.name})`}
                description="الرقم ده بيظهر للطلاب في صفحات الاشتراك وشراء الكتب."
              >
                <form
                  onSubmit={(event) =>
                    payment.submit(event, "تم حفظ بيانات الدفع.", reloadAfterSave)
                  }
                  className="space-y-4"
                >
                  <MasterNotice type={payment.message.type || "success"}>
                    {payment.message.text}
                  </MasterNotice>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <MasterField
                      label="رقم الحساب"
                      name="accountNumber"
                      dir="ltr"
                      value={payment.form.accountNumber}
                      onChange={payment.update}
                      required
                    />
                    <MasterField
                      label="واتساب الدعم"
                      name="supportWhatsApp"
                      dir="ltr"
                      value={payment.form.supportWhatsApp}
                      onChange={payment.update}
                      required
                    />
                  </div>
                  <MasterField
                    label="الحالة"
                    name="isActive"
                    as="select"
                    value={String(payment.form.isActive)}
                    onChange={(name, value) => payment.update(name, value === "true")}
                    options={[
                      { value: "true", label: "مفعّلة (تظهر للطلاب)" },
                      { value: "false", label: "موقوفة" },
                    ]}
                  />
                  <button type="submit" disabled={payment.isSaving} className={primaryButtonClass}>
                    {payment.isSaving ? "جارٍ الحفظ..." : "حفظ بيانات الدفع"}
                  </button>
                </form>
              </SectionCard>
            )}

            <SectionCard
              title="المساحة المستخدمة"
              description="متابعة استهلاك كل خدمة تخزين مقابل حدها المجاني."
            >
              <ul className="space-y-5">
                {data.storage.map((item) => (
                  <li key={item.provider}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-black text-white">{item.label}</p>
                      <div className="flex items-center gap-2">
                        {item.isMock && (
                          <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[11px] font-extrabold text-white/50">
                            بيانات تجريبية
                          </span>
                        )}
                        <span className="text-xs font-bold text-white/55">
                          {formatBytes(item.usedBytes)} من {formatBytes(item.limitBytes)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]"
                      role="progressbar"
                      aria-valuenow={item.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={item.label}
                    >
                      <div
                        className={`h-full rounded-full ${BAR_COLORS[item.level]}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold text-white/40">
                      المتبقي {formatBytes(item.remainingBytes)} ({100 - item.percent}%)
                    </p>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="منطقة الحذف" description="إجراءات نهائية لا يمكن التراجع عنها.">
              <div className="flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-white">حذف كل المحادثات</p>
                  <p className="mt-1 text-xs font-bold text-white/45">
                    {data.chatMessagesCount} رسالة محفوظة حاليًا.
                  </p>
                </div>
                <button type="button" onClick={askDeleteChats} className={dangerButtonClass}>
                  <FontAwesomeIcon icon={faTrashCan} />
                  حذف كل المحادثات
                </button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      <MasterConfirmModal
        isOpen={Boolean(chatConfirm)}
        isDanger
        isLoading={isDeletingChat}
        title="حذف كل المحادثات"
        message={
          chatConfirm
            ? `سيتم حذف ${chatConfirm.messagesCount} رسالة نهائيًا من كل محادثات الطلاب. لا يمكن التراجع.`
            : ""
        }
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDeleteChats}
        onCancel={() => !isDeletingChat && setChatConfirm(null)}
      />
    </div>
  );
}

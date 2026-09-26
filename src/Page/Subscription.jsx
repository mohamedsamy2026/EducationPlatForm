import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRight,
  faBookOpen,
  faCalendarDays,
  faCheck,
  faClipboardCheck,
  faCopy,
  faLock,
  faMobileScreenButton,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import Navbar from "../Components/Navbar";

import { getCurrentStudent } from "../services/studentService";
import { getCourseById } from "../services/courseService";
import { isStudentEnrolled } from "../services/enrollmentService";

import {
  createSubscriptionRequest,
  getPendingSubscriptionRequest,
} from "../services/subscriptionService";

import { getPaymentMethodById } from "../services/paymentMethodService";

export default function Subscription() {
  const { courseId, planId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSubscriptionData() {
      try {
        setIsLoading(true);

        const [currentCourse, student, vodafoneCash] = await Promise.all([
          getCourseById(courseId),
          getCurrentStudent(),
          getPaymentMethodById("vodafone-cash"),
        ]);

        if (cancelled) return;

        if (!currentCourse || !student || !vodafoneCash) {
          setCourse(currentCourse ?? null);
          setCurrentStudent(student ?? null);
          setPaymentMethod(vodafoneCash ?? null);
          setIsLoading(false);
          return;
        }

        const enrolled = await isStudentEnrolled(student.id, courseId);

        if (cancelled) return;

        const plans = Array.isArray(currentCourse.subscriptionPlans)
          ? currentCourse.subscriptionPlans
          : [];

        const plan =
          plans.find((item) => String(item.id) === String(planId)) ?? null;

        const pendingRequest = await getPendingSubscriptionRequest(
          student.id,
          courseId,
        );

        if (cancelled) return;

        setCourse(currentCourse);
        setCurrentStudent(student);
        setPaymentMethod(vodafoneCash);
        setSelectedPlan(plan);
        setIsEnrolled(enrolled);
        setExistingRequest(pendingRequest);
      } catch {
        if (cancelled) return;

        setCourse(null);
        setCurrentStudent(null);
        setPaymentMethod(null);
        setSelectedPlan(null);
        setIsEnrolled(false);
        setExistingRequest(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSubscriptionData();

    return () => {
      cancelled = true;
    };
  }, [courseId, planId]);

  const formattedPrice = useMemo(() => {
    if (selectedPlan?.price === null || selectedPlan?.price === undefined) {
      return "غير محدد";
    }

    return `${new Intl.NumberFormat("ar-EG").format(selectedPlan.price)} جنيه`;
  }, [selectedPlan]);

  const isReady =
    Boolean(course) &&
    Boolean(currentStudent) &&
    Boolean(paymentMethod) &&
    Boolean(selectedPlan);

  const isSubmitted = Boolean(submittedRequest) || Boolean(existingRequest);

  const requestToDisplay = submittedRequest || existingRequest;

  const handleCopyNumber = async () => {
    if (!paymentMethod?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(paymentMethod.accountNumber);

      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 1800);
    } catch {
      setIsCopied(false);
    }
  };

  const handleTransactionChange = (e) => {
    const value = e.target.value;

    setTransactionId(value);

    setErrors((prev) => {
      if (!prev.transactionId) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors.transactionId;

      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentStudent || !course || !selectedPlan) {
      return;
    }

    const normalizedTransactionId = transactionId.trim();

    if (!normalizedTransactionId) {
      setErrors({
        transactionId: "يرجى إدخال رقم عملية التحويل.",
      });

      return;
    }

    if (normalizedTransactionId.length < 3) {
      setErrors({
        transactionId: "يرجى إدخال رقم عملية تحويل صحيح.",
      });

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const request = await createSubscriptionRequest({
        studentId: currentStudent.id,
        courseId: course.id,
        planId: selectedPlan.id,
        amount: selectedPlan.price,
        transactionId: normalizedTransactionId,
        paymentMethodId: paymentMethod.id,
      });

      setSubmittedRequest(request);
    } catch (error) {
      setErrors({
        transactionId: error?.message || "حدث خطأ أثناء إرسال الطلب.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = paymentMethod?.supportWhatsApp ?? "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/20${whatsappNumber.replace(/^0/, "")}`
    : "#";

  if (isLoading) {
    return null;
  }

  if (!course || !currentStudent) {
    return (
      <main dir="rtl" className="min-h-screen bg-midnight text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-center">
          <h1 className="text-3xl font-black">تعذر فتح صفحة الاشتراك</h1>

          <p className="mt-3 text-white/50">
            لم يتم العثور على بيانات الكورس أو الطالب.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-black text-midnight"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة للصفحة الرئيسية
          </Link>
        </div>

      </main>
    );
  }

  if (!selectedPlan) {
    return (
      <main dir="rtl" className="min-h-screen bg-midnight text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-center">
          <h1 className="text-3xl font-black">الاشتراك غير متاح</h1>

          <p className="mt-3 text-white/50">
            نوع الاشتراك المطلوب غير موجود لهذا الكورس.
          </p>

          <Link
            to={`/courses/${course.id}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-black text-midnight"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة إلى تفاصيل الكورس
          </Link>
        </div>

      </main>
    );
  }

  if (isEnrolled) {
    return (
      <main dir="rtl" className="min-h-screen bg-midnight text-white">
        <Navbar />

        <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,23,41,0.92)_0%,rgba(6,14,26,0.96)_100%)] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-xl text-green-400">
              <FontAwesomeIcon icon={faCheck} />
            </div>

            <h1 className="mt-6 text-2xl font-black sm:text-3xl">
              أنت مشترك بالفعل
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/50">
              هذا الكورس متاح لك بالفعل ويمكنك الانتقال مباشرة إلى المحتوى.
            </p>

            <Link
              to={`/courses/${course.id}`}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gold px-7 py-3.5 font-black text-midnight transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light"
            >
              <FontAwesomeIcon icon={faBookOpen} />
              متابعة الكورس
            </Link>
          </div>
        </div>

      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(212,175,55,0.12),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(18,52,78,0.30),transparent_36%)]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors duration-300 hover:text-gold"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة إلى تفاصيل الكورس
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* ================= Course Summary ================= */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
                <FontAwesomeIcon icon={faReceipt} />
                إتمام الاشتراك
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                {course.title}
              </h1>

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.20)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                    <FontAwesomeIcon
                      icon={
                        selectedPlan.id === "monthly"
                          ? faCalendarDays
                          : faBookOpen
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/40">
                      نوع الاشتراك
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      {selectedPlan.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 h-px bg-white/5" />

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-white/40">
                      المبلغ المطلوب
                    </p>

                    <p className="mt-1 text-3xl font-black text-gold">
                      {formattedPrice}
                    </p>
                  </div>

                  <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold">
                    {selectedPlan.name}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= Payment Method ================= */}
            <div className="rounded-3xl border border-gold/20 bg-[linear-gradient(180deg,rgba(12,29,48,0.96)_0%,rgba(7,17,29,0.98)_100%)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                  <FontAwesomeIcon icon={faMobileScreenButton} />
                </div>

                <div>
                  <p className="text-xs text-white/40">طريقة الدفع</p>

                  <h2 className="text-lg font-black text-white">
                    Vodafone Cash
                  </h2>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-gold/20 bg-gold/[0.05] p-5 text-center">
                <p className="text-xs font-semibold text-white/40">
                  حوّل المبلغ إلى الرقم التالي
                </p>

                <p
                  dir="ltr"
                  className="mt-3 text-3xl font-black tracking-wider text-gold sm:text-4xl"
                >
                  {paymentMethod.accountNumber}
                </p>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm font-bold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                >
                  <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />

                  {isCopied ? "تم نسخ الرقم" : "نسخ الرقم"}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-xs font-black text-gold">
                    1
                  </span>

                  <p className="text-sm leading-7 text-white/55">
                    حوّل مبلغ الاشتراك الموضح في الصفحة إلى رقم Vodafone Cash.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-xs font-black text-gold">
                    2
                  </span>

                  <p className="text-sm leading-7 text-white/55">
                    بعد إتمام التحويل، احتفظ برقم عملية التحويل الظاهر لك.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-xs font-black text-gold">
                    3
                  </span>

                  <p className="text-sm leading-7 text-white/55">
                    اكتب رقم العملية في النموذج وأرسل طلب الاشتراك للمراجعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Subscription Form ================= */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {isSubmitted ? (
          <div className="overflow-hidden rounded-[2rem] border border-green-400/20 bg-[linear-gradient(180deg,rgba(10,31,28,0.95)_0%,rgba(6,20,20,0.98)_100%)] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-xl text-green-400">
              <FontAwesomeIcon icon={faCheck} />
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm font-bold text-green-400">
                تم إرسال الطلب بنجاح
              </span>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                طلب الاشتراك في انتظار المراجعة
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/50">
                تم تسجيل طلبك بنجاح. سيقوم الـMaster بمراجعة عملية التحويل
                وتفعيل الاشتراك بعد التأكد منها.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs text-white/40">رقم الطلب</p>

                <p
                  dir="ltr"
                  className="mt-2 text-2xl font-black tracking-wide text-gold"
                >
                  #{requestToDisplay.referenceNumber}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs text-white/40">الحالة</p>

                <p className="mt-2 text-lg font-black text-amber-300">
                  في انتظار المراجعة
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  className="mt-1 text-gold"
                />

                <div>
                  <p className="text-sm font-bold text-white">
                    احتفظ برقم الطلب
                  </p>

                  <p className="mt-1 text-xs leading-6 text-white/45">
                    ستحتاج إليه عند التواصل مع الدعم أو الاستفسار عن حالة الطلب.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="التواصل عبر WhatsApp عند وجود مشكلة"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-lg text-green-400 transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:text-midnight"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>

            <div className="mt-3 text-center text-xs text-white/35">
              في حالة وجود أي مشكلة يمكنك التواصل معنا.
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/70 transition-all duration-300 hover:border-gold/20 hover:text-gold"
              >
                <FontAwesomeIcon icon={faArrowRight} />
                العودة إلى الكورس
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,23,41,0.94)_0%,rgba(6,14,26,0.98)_100%)] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="text-center">
              <span className="text-sm font-bold text-gold">آخر خطوة</span>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                تأكيد عملية الدفع
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/45">
                بعد إتمام التحويل، أدخل رقم عملية التحويل كما ظهر لك لإرسال طلب
                الاشتراك.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              <div>
                <label
                  htmlFor="transactionId"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  رقم عملية التحويل
                </label>

                <div className="group relative">
                  <FontAwesomeIcon
                    icon={faReceipt}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                  />

                  <input
                    id="transactionId"
                    type="text"
                    name="transactionId"
                    value={transactionId}
                    onChange={handleTransactionChange}
                    placeholder="أدخل رقم عملية التحويل"
                    autoComplete="off"
                    inputMode="text"
                    aria-invalid={Boolean(errors.transactionId)}
                    aria-describedby={
                      errors.transactionId ? "transactionId-error" : undefined
                    }
                    className="h-[3.25rem] w-full rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                  />
                </div>

                {errors.transactionId && (
                  <p
                    id="transactionId-error"
                    className="mt-2 text-[11px] font-medium text-red-400"
                  >
                    {errors.transactionId}
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-gold/10 bg-gold/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="mt-1 text-xs text-gold"
                  />

                  <p className="text-xs leading-6 text-white/45">
                    سيتم استخدام رقم العملية لمساعدة الـMaster على مطابقة طلب
                    الاشتراك مع عملية التحويل الفعلية.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex h-[3.35rem] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gold font-black text-midnight shadow-[0_12px_30px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_16px_35px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-gold"
              >
                <FontAwesomeIcon icon={faClipboardCheck} />

                {isSubmitting
                  ? "جارٍ إرسال الطلب..."
                  : "تأكيد إرسال طلب الاشتراك"}
              </button>
            </form>

            <div className="mt-8 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="التواصل عبر WhatsApp عند وجود مشكلة"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-base text-green-400 transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:text-midnight"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>

            <p className="mt-2 text-center text-xs text-white/30">
              في حالة وجود مشكلة فقط يمكنك التواصل معنا عبر WhatsApp.
            </p>
          </div>
        )}
      </section>

    </main>
  );
}

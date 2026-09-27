import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBookOpen,
  faCheck,
  faCircleCheck,
  faCopy,
  faMoneyBillTransfer,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getBookById } from "../services/bookService";
import { getCurrentStudent } from "../services/studentService";
import { getPendingBookPurchaseRequest, createBookPurchaseRequest } from "../services/bookPurchaseService";
import { getActivePaymentMethods } from "../services/paymentMethodService";

function formatPrice(price) {
  if (price === null || price === undefined) {
    return "غير محدد";
  }

  return `${new Intl.NumberFormat("ar-EG").format(price)} جنيه`;
}

export default function BookPurchase() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(undefined);
  const [student, setStudent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [existingRequest, setExistingRequest] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [isReferenceCopied, setIsReferenceCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPurchaseData() {
      try {
        setIsLoading(true);

        const [currentBook, currentStudent, paymentMethods] = await Promise.all([
          getBookById(bookId),
          getCurrentStudent(),
          getActivePaymentMethods(),
        ]);

        if (cancelled) return;

        const vodafoneCash =
          paymentMethods.find((method) => method.id === "vodafone-cash") ??
          paymentMethods[0] ??
          null;

        setBook(currentBook);
        setStudent(currentStudent);
        setPaymentMethod(vodafoneCash);

        if (!currentBook || !currentStudent || !vodafoneCash) {
          setExistingRequest(null);
          return;
        }

        const pendingRequest = await getPendingBookPurchaseRequest(
          currentStudent.id,
          currentBook.id,
        );

        if (cancelled) return;

        setExistingRequest(pendingRequest);
      } catch {
        if (cancelled) return;

        setBook(null);
        setStudent(null);
        setPaymentMethod(null);
        setExistingRequest(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPurchaseData();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const requestToDisplay = submittedRequest || existingRequest;
  const isSubmitted = Boolean(requestToDisplay);

  const handleCopyAccount = async () => {
    if (!paymentMethod?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(paymentMethod.accountNumber);
      setIsAccountCopied(true);
      window.setTimeout(() => setIsAccountCopied(false), 1800);
    } catch {
      setIsAccountCopied(false);
    }
  };

  const handleCopyReference = async () => {
    if (!requestToDisplay?.referenceNumber) return;

    try {
      await navigator.clipboard.writeText(requestToDisplay.referenceNumber);
      setIsReferenceCopied(true);
      window.setTimeout(() => setIsReferenceCopied(false), 1800);
    } catch {
      setIsReferenceCopied(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!student || !book || !paymentMethod) return;

    const normalizedTransactionId = transactionId.trim();

    if (!normalizedTransactionId) {
      setError("من فضلك اكتب رقم عملية التحويل.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const request = await createBookPurchaseRequest({
        studentId: student.id,
        bookId: book.id,
        amount: book.price,
        transactionId: normalizedTransactionId,
        paymentMethodId: paymentMethod.id,
      });

      setSubmittedRequest(request);
      setExistingRequest(request);
      setTransactionId("");
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || book === undefined) {
    return null;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-midnight text-white">
        <Navbar />
        <main dir="rtl" className="flex min-h-[70vh] items-center justify-center px-5 py-32">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c1a2b] p-10 text-center">
            <FontAwesomeIcon icon={faBookOpen} className="mb-5 text-3xl text-gold" />
            <h1 className="mb-3 text-2xl font-extrabold text-warm-white">
              الكتاب غير موجود
            </h1>
            <p className="mb-7 text-sm leading-7 text-white/55">
              لم نتمكن من العثور على الكتاب المطلوب.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-extrabold text-midnight transition-colors duration-300 hover:bg-gold-light"
            >
              العودة للكتب
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-midnight text-white">
        <Navbar />
        <main dir="rtl" className="flex min-h-[70vh] items-center justify-center px-5 py-32">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c1a2b] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.20)]">
            <FontAwesomeIcon icon={faBookOpen} className="mb-5 text-3xl text-gold" />
            <h1 className="mb-3 text-2xl font-extrabold text-warm-white">
              سجّل دخولك أولًا
            </h1>
            <p className="mb-7 text-sm leading-7 text-white/55">
              لازم تسجل دخول عشان نربط طلب شراء الكتاب بحسابك.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-extrabold text-midnight transition-colors duration-300 hover:bg-gold-light"
            >
              تسجيل الدخول
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-midnight text-white">
        <Navbar />

        <main dir="rtl" className="relative overflow-hidden bg-midnight px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute right-1/2 top-12 h-96 w-96 translate-x-1/2 rounded-full bg-gold/5 blur-[150px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="rounded-3xl border border-gold/15 bg-[#0c1a2b] p-7 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-3xl text-gold shadow-[0_0_35px_rgba(212,175,55,0.12)]">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>

              <div className="mt-7 text-center">
                <p className="mb-3 text-xs font-bold tracking-[0.24em] text-gold">
                  تم إرسال الطلب
                </p>
                <h1 className="mb-4 text-3xl font-extrabold text-warm-white sm:text-4xl">
                  طلب شراء الكتاب اتبعت بنجاح
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
                  تم تسجيل طلبك للمراجعة اليدوية. احتفظ بالكود المرجعي لمتابعة الطلب عند الحاجة.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-gold/15 bg-gold/5 p-6 text-center">
                <p className="text-xs font-bold text-white/45">الكود المرجعي</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <p dir="ltr" className="text-2xl font-black tracking-wide text-gold">
                    #{requestToDisplay.referenceNumber}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-3.5 py-2 text-xs font-bold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                  >
                    <FontAwesomeIcon icon={isReferenceCopied ? faCheck : faCopy} />
                    {isReferenceCopied ? "تم النسخ" : "نسخ الرقم"}
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  "احتفظ بالكود المرجعي",
                  "انتظر مراجعة الطلب",
                  "الكود المرجعي ليس كود دخول",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-sm font-black text-gold">
                      {index + 1}
                    </div>
                    <p className="text-sm font-bold leading-7 text-white/75">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-midnight transition-colors duration-300 hover:bg-gold-light"
                >
                  العودة للكتب
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>

                <Link
                  to="/dashboard-student"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white/70 transition-all duration-300 hover:border-gold/25 hover:text-gold"
                >
                  لوحة الطالب
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      <Navbar />

      <main dir="rtl" className="relative overflow-hidden bg-midnight px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-1/2 top-8 h-96 w-96 translate-x-1/2 rounded-full bg-gold/5 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-10 left-0 h-80 w-80 rounded-full bg-[#10243a]/50 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Link
            to="/books"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors duration-200 hover:text-gold"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            <span>العودة للكتب</span>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a2b] shadow-[0_25px_70px_rgba(0,0,0,0.28)]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#071321]">
                <img
                  src={book.image}
                  alt={`صورة ${book.title}`}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071321]/85 via-transparent to-transparent" />
              </div>

              <div className="p-7 sm:p-8">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-gold/80">
                  <FontAwesomeIcon icon={faBookOpen} />
                  <span>{book.category}</span>
                </div>

                <h1 className="mb-4 text-2xl font-extrabold leading-9 text-warm-white sm:text-3xl">
                  {book.title}
                </h1>

                <p className="mb-6 text-sm leading-8 text-white/55 sm:text-base">
                  {book.description}
                </p>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <span className="text-sm font-bold text-white/45">سعر الكتاب</span>
                  <span className="text-2xl font-black text-gold">{formatPrice(book.price)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0c1a2b] p-7 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-9">
              <div className="mb-8">
                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold">خطوات شراء الكتاب</p>
                <h2 className="text-3xl font-extrabold leading-tight text-warm-white">
                  اتبع الخطوات بالترتيب
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-base font-black text-midnight">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-base font-extrabold text-warm-white">حوّل قيمة الكتاب</h3>
                      <p className="mb-4 text-sm leading-7 text-white/55">
                        قم بالتحويل عبر Vodafone Cash إلى الرقم التالي:
                      </p>
                      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gold/15 bg-gold/5 p-4">
                        <p dir="ltr" className="text-xl font-black tracking-wide text-gold">
                          {paymentMethod?.accountNumber}
                        </p>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-bold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                        >
                          <FontAwesomeIcon icon={isAccountCopied ? faCheck : faCopy} />
                          {isAccountCopied ? "تم النسخ" : "نسخ الرقم"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-base font-black text-midnight">
                      2
                    </div>
                    <div>
                      <h3 className="mb-2 text-base font-extrabold text-warm-white">احتفظ برقم عملية التحويل</h3>
                      <p className="text-sm leading-7 text-white/55">
                        بعد إتمام التحويل، احتفظ برقم العملية لاستخدامه في الخطوة التالية.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-base font-black text-midnight">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-base font-extrabold text-warm-white">اكتب رقم العملية</h3>
                      <p className="mb-4 text-sm leading-7 text-white/55">
                        ضع رقم عملية التحويل في الخانة التالية.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="transactionId" className="mb-2 block text-sm font-bold text-white/75">
                            رقم عملية التحويل
                          </label>
                          <input
                            id="transactionId"
                            type="text"
                            inputMode="text"
                            value={transactionId}
                            onChange={(event) => {
                              setTransactionId(event.target.value);
                              if (error) setError("");
                            }}
                            placeholder="اكتب رقم العملية هنا"
                            className="w-full rounded-xl border border-white/10 bg-[#071321] px-4 py-3.5 text-sm font-semibold text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
                          />
                          {error ? (
                            <p className="mt-2 text-xs font-bold text-red-400">{error}</p>
                          ) : null}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gold px-5 py-3.5 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={isSubmitting ? faMoneyBillTransfer : faPaperPlane} />
                          {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب الشراء"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-base font-black text-midnight">
                      4
                    </div>
                    <div>
                      <h3 className="mb-2 text-base font-extrabold text-warm-white">احتفظ بالكود المرجعي</h3>
                      <p className="text-sm leading-7 text-white/55">
                        بعد إرسال الطلب سيظهر لك الكود المرجعي الخاص بطلب الشراء.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-gold/15 bg-gold/5 p-4 text-sm font-semibold leading-7 text-white/65">
                <FontAwesomeIcon icon={faCircleCheck} className="shrink-0 text-gold" />
                <span>سيتم مراجعة التحويل يدويًا قبل اعتماد طلب الشراء.</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

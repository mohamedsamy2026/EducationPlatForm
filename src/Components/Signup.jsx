import { useState } from "react";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faUserTie,
  faGraduationCap,
  faSchool,
  faArrowLeft,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// Images
import SignupHome from "../assets/Background/signup.jpg";
import Master from "../assets/Master/master.webp";

// React Router
import { Link } from "react-router-dom";

const INITIAL_FORM_DATA = {
  fullName: "",
  email: "",
  phone: "",
  parentPhone: "",
  password: "",
  confirmPassword: "",
  stage: "",
  grade: "",
  governorate: "",
};

const EGYPTIAN_MOBILE_REGEX = /^01[0125][0-9]{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s]+$/;

const PREPARATORY_GRADES = [
  "first-preparatory",
  "second-preparatory",
  "third-preparatory",
];

const SECONDARY_GRADES = [
  "first-secondary",
  "second-secondary",
  "third-secondary",
];


function validateSignupForm(formData) {
  const errors = {};

  const normalizedName = formData.fullName.trim();
  const normalizedEmail = formData.email.trim().toLowerCase();
  const normalizedPhone = formData.phone.trim();
  const normalizedParentPhone = formData.parentPhone.trim();

  if (!normalizedName) {
    errors.fullName = "يرجى إدخال الاسم الكامل.";
  } else if (normalizedName.length < 3) {
    errors.fullName = "الاسم الكامل يجب أن يكون 3 أحرف على الأقل.";
  } else if (!NAME_REGEX.test(normalizedName)) {
    errors.fullName = "يرجى إدخال اسم صحيح بدون أرقام أو رموز.";
  }

  if (!normalizedEmail) {
    errors.email = "يرجى إدخال البريد الإلكتروني.";
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح.";
  }

  if (!normalizedPhone) {
    errors.phone = "يرجى إدخال رقم الهاتف.";
  } else if (!EGYPTIAN_MOBILE_REGEX.test(normalizedPhone)) {
    errors.phone = "رقم الهاتف يجب أن يكون رقم موبايل مصري مكونًا من 11 رقمًا.";
  }

  if (!normalizedParentPhone) {
    errors.parentPhone = "يرجى إدخال رقم ولي الأمر.";
  } else if (!EGYPTIAN_MOBILE_REGEX.test(normalizedParentPhone)) {
    errors.parentPhone =
      "رقم ولي الأمر يجب أن يكون رقم موبايل مصري مكونًا من 11 رقمًا.";
  } else if (normalizedPhone && normalizedParentPhone === normalizedPhone) {
    errors.parentPhone = "رقم ولي الأمر يجب أن يكون مختلفًا عن رقمك.";
  }

  if (!formData.password) {
    errors.password = "يرجى إدخال كلمة المرور.";
  } else if (formData.password.length < 5) {
    errors.password = "كلمة المرور يجب أن تكون 5 أحرف على الأقل.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "يرجى تأكيد كلمة المرور.";
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "كلمتا المرور غير متطابقتين.";
  }

  if (!formData.stage) {
    errors.stage = "يرجى اختيار المرحلة الدراسية.";
  }

  if (!formData.grade) {
    errors.grade = "يرجى اختيار الصف الدراسي.";
  }

  if (formData.stage && formData.grade) {
    const isPreparatoryGrade = PREPARATORY_GRADES.includes(formData.grade);

    const isSecondaryGrade = SECONDARY_GRADES.includes(formData.grade);

    if (
      (formData.stage === "preparatory" && !isPreparatoryGrade) ||
      (formData.stage === "secondary" && !isSecondaryGrade)
    ) {
      errors.grade = "الصف الدراسي لا يتوافق مع المرحلة المختارة.";
    }
  }

  if (!formData.governorate) {
    errors.governorate = "يرجى اختيار المحافظة.";
  }

  return errors;
}

export default function Signup() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 const fields = [
    {
      name: "fullName",
      label: "الاسم الكامل",
      placeholder: "أدخل اسمك الكامل",
      type: "text",
      icon: faUser,
      autoComplete: "name",
    },
    {
      name: "email",
      label: "البريد الإلكتروني",
      placeholder: "أدخل البريد الإلكتروني",
      type: "email",
      icon: faEnvelope,
      autoComplete: "email",
    },
    {
      name: "phone",
      label: "رقم الهاتف",
      placeholder: "أدخل رقم هاتفك",
      type: "tel",
      icon: faPhone,
      autoComplete: "tel",
      inputMode: "numeric",
      maxLength: 11,
    },
    {
      name: "parentPhone",
      label: "رقم ولي الأمر",
      placeholder: "أدخل رقم ولي الأمر",
      type: "tel",
      icon: faUserTie,
      autoComplete: "tel",
      inputMode: "numeric",
      maxLength: 11,
    },
  ];

  const passwordFields = [
    {
      name: "password",
      label: "كلمة المرور",
      placeholder: "أنشئ كلمة مرور قوية",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "تأكيد كلمة المرور",
      placeholder: "تأكيد كلمة المرور",
      autoComplete: "new-password",
    },
  ];

  const educationFields = [
    {
      name: "stage",
      label: "المرحلة الدراسية",
      icon: faGraduationCap,
      options: [
        { value: "", label: "اختر المرحلة" },
        { value: "preparatory", label: "المرحلة الإعدادية" },
        { value: "secondary", label: "المرحلة الثانوية" },
      ],
    },
    {
      name: "grade",
      label: "الصف الدراسي",
      icon: faSchool,
      options: [
        { value: "", label: "اختر الصف" },
        { value: "first-preparatory", label: "الصف الأول الإعدادي" },
        { value: "second-preparatory", label: "الصف الثاني الإعدادي" },
        { value: "third-preparatory", label: "الصف الثالث الإعدادي" },
        { value: "first-secondary", label: "الصف الأول الثانوي" },
        { value: "second-secondary", label: "الصف الثاني الثانوي" },
        { value: "third-secondary", label: "الصف الثالث الثانوي" },
      ],
    },
  ];

  const governorateOptions = [
    { value: "", label: "اختر المحافظة" },
    { value: "cairo", label: "القاهرة" },
    { value: "giza", label: "الجيزة" },
    { value: "alexandria", label: "الإسكندرية" },
    { value: "qalyubia", label: "القليوبية" },
    { value: "sharqia", label: "الشرقية" },
    { value: "dakahlia", label: "الدقهلية" },
    { value: "gharbia", label: "الغربية" },
    { value: "monufia", label: "المنوفية" },
    { value: "beheira", label: "البحيرة" },
    { value: "kafr-el-sheikh", label: "كفر الشيخ" },
    { value: "damietta", label: "دمياط" },
    { value: "port-said", label: "بورسعيد" },
    { value: "ismailia", label: "الإسماعيلية" },
    { value: "suez", label: "السويس" },
    { value: "north-sinai", label: "شمال سيناء" },
    { value: "south-sinai", label: "جنوب سيناء" },
    { value: "beni-suef", label: "بني سويف" },
    { value: "faiyum", label: "الفيوم" },
    { value: "minya", label: "المنيا" },
    { value: "asyut", label: "أسيوط" },
    { value: "sohag", label: "سوهاج" },
    { value: "qena", label: "قنا" },
    { value: "luxor", label: "الأقصر" },
    { value: "aswan", label: "أسوان" },
    { value: "red-sea", label: "البحر الأحمر" },
    { value: "new-valley", label: "الوادي الجديد" },
    { value: "matrouh", label: "مطروح" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];

      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignupForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // مكان ربط الـBackend/Auth لاحقًا.
      // حاليًا لا يوجد أي اتصال حقيقي بقاعدة البيانات.

      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
    >
      {/* ================= Background ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={SignupHome}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#040a12]/5" />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,42,71,0.5),transparent_70%)] shadow-[0_35px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-[linear-gradient(180deg,rgba(10,23,41,0.88)_0%,rgba(6,14,26,0.92)_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
          {/* Soft Blue/Gold Ambient Light */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-blue-900/20 blur-[100px]" />

          {/* Subtle Inner Highlight */}
          <div className="pointer-events-none absolute inset-[1px] rounded-[2rem] border border-white/[0.03]" />

          {/* Elegant Corner Details */}
          <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-tr-[2rem] border-r border-t border-gold/20" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-16 rounded-bl-[2rem] border-b border-l border-gold/20" />

          {/* Top Gold Accent */}
          <div className="relative h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="relative px-5 py-7 sm:px-9 sm:py-9">
            {/* ================= Logo ================= */}
            <div className="mb-8 text-center">
              <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-[#061220]/80 shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-2 rounded-full border border-gold/10" />

                <img
                  src={Master}
                  alt="الغازي في التاريخ"
                  className="h-20 w-20 object-contain"
                />
              </div>

              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
                <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              </div>

              <h1 className="text-2xl font-extrabold text-gold sm:text-3xl">
                إنشاء حساب جديد
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/50">
                أنشئ حسابك وابدأ رحلتك في تعلم التاريخ
              </p>
            </div>

            {/* ================= Form ================= */}
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ================= Personal Information ================= */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-xs text-gold">
                    <FontAwesomeIcon icon={faUser} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-warm-white">
                      البيانات الشخصية
                    </h2>

                    <p className="mt-0.5 text-[11px] text-white/35">
                      أدخل بياناتك الأساسية
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-xs font-semibold text-white/70"
                      >
                        {field.label}
                      </label>

                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={field.icon}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                        />

                        <input
                          id={field.name}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          autoComplete={field.autoComplete}
                          inputMode={field.inputMode}
                          maxLength={field.maxLength}
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `${field.name}-error`
                              : undefined
                          }
                          className="h-[3.1rem] w-full rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-right text-sm text-warm-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                        />
                      </div>

                      {errors[field.name] && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-1.5 text-[11px] font-medium text-red-400"
                        >
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* ================= Governorate ================= */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="governorate"
                      className="mb-2 block text-xs font-semibold text-white/70"
                    >
                      المحافظة
                    </label>

                    <div className="group relative">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                      />

                      <select
                        id="governorate"
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.governorate)}
                        aria-describedby={
                          errors.governorate ? "governorate-error" : undefined
                        }
                        className="h-[3.1rem] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                      >
                        {governorateOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-[#061220] text-warm-white"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errors.governorate && (
                      <p
                        id="governorate-error"
                        className="mt-1.5 text-[11px] font-medium text-red-400"
                      >
                        {errors.governorate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= Account Information ================= */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-xs text-gold">
                    <FontAwesomeIcon icon={faLock} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-warm-white">
                      بيانات الدخول
                    </h2>

                    <p className="mt-0.5 text-[11px] text-white/35">
                      أنشئ بيانات الدخول الخاصة بك
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {passwordFields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-xs font-semibold text-white/70"
                      >
                        {field.label}
                      </label>

                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                        />

                        <input
                          id={field.name}
                          type="password"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          autoComplete={field.autoComplete}
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `${field.name}-error`
                              : undefined
                          }
                          className="h-[3.1rem] w-full rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                        />
                      </div>

                      {errors[field.name] && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-1.5 text-[11px] font-medium text-red-400"
                        >
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= Education ================= */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-xs text-gold">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-warm-white">
                      البيانات الدراسية
                    </h2>

                    <p className="mt-0.5 text-[11px] text-white/35">
                      حدد مرحلتك وصفك الدراسي
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {educationFields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-xs font-semibold text-white/70"
                      >
                        {field.label}
                      </label>

                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={field.icon}
                          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                        />

                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `${field.name}-error`
                              : undefined
                          }
                          className="h-[3.1rem] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                        >
                          {field.options.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-[#061220] text-warm-white"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {errors[field.name] && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-1.5 text-[11px] font-medium text-red-400"
                        >
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= Create Account Button ================= */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex h-[3.25rem] w-full cursor-pointer items-center justify-center rounded-xl bg-gold font-extrabold text-midnight shadow-[0_12px_30px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_16px_35px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-gold"
              >
                {isSubmitting ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </form>

            {/* ================= Login ================= */}
            <p className="mt-6 text-center text-sm text-white/45">
              لديك حساب بالفعل؟
              <Link
                to="/login"
                className="mr-1 font-bold text-gold transition-colors hover:text-gold-light"
              >
                تسجيل الدخول
              </Link>
            </p>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 duration-300 hover:-translate-x-3 hover:text-gold"
              >
                العودة للصفحة الرئيسية
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

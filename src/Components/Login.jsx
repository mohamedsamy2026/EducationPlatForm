// Hooks
import { useState } from "react";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import {
  faEnvelope,
  faLock,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// Images
import SignupHome from "../assets/Background/Login.webp";
import Master from "../assets/Master/master.webp";

// React Router
import { Link, useNavigate } from "react-router-dom";

const INITIAL_FORM_DATA = {
  identifier: "",
  password: "",
};

const EGYPTIAN_MOBILE_REGEX = /^01[0125][0-9]{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm(formData) {
  const errors = {};

  const identifier = formData.identifier.trim();
  const password = formData.password;

  if (!identifier) {
    errors.identifier = "يرجى إدخال البريد الإلكتروني أو رقم الهاتف.";
  } else {
    const isEmail = identifier.includes("@");
    const isValidPhone = EGYPTIAN_MOBILE_REGEX.test(identifier);

    if (isEmail) {
      if (!EMAIL_REGEX.test(identifier)) {
        errors.identifier = "يرجى إدخال بريد إلكتروني صحيح.";
      }
    } else if (!isValidPhone) {
      errors.identifier =
        "أدخل بريدًا إلكترونيًا صحيحًا أو رقم موبايل مصري مكونًا من 11 رقمًا.";
    }
  }

  if (!password) {
    errors.password = "يرجى إدخال كلمة المرور.";
  } else if (password.length < 5) {
    errors.password = "كلمة المرور يجب أن تكون 5 أحرف على الأقل.";
  }

  return errors;
}

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const loginData = {
        identifier: formData.identifier.trim(),
        password: formData.password,
      };

      // مكان ربط الـAuthentication / Backend لاحقًا.
      // حاليًا لا يوجد تسجيل دخول حقيقي.

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Login data:", loginData);

      // مؤقتًا فقط للـFrontend.
      navigate("/dashboard-student");
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

        <div className="absolute inset-0 bg-[#040a12]/40" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,42,71,0.5),transparent_70%)] shadow-[0_35px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl">
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

          <div className="relative px-5 py-8 sm:px-9 sm:py-10">
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
                مرحباً بك مجدداً
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/50">
                سجل دخولك لمتابعة دروسك في منصة الغازي للتاريخ
              </p>
            </div>

            {/* ================= Form ================= */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email or Phone Field */}
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  رقم الهاتف
                </label>

                <div className="group relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                  />

                  <input
                    id="identifier"
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
                    autoComplete="username"
                    aria-invalid={Boolean(errors.identifier)}
                    aria-describedby={
                      errors.identifier ? "identifier-error" : undefined
                    }
                    className="h-[3.1rem] w-full rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                  />
                </div>

                {errors.identifier && (
                  <p
                    id="identifier-error"
                    className="mt-1.5 text-[11px] font-medium text-red-400"
                  >
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  كلمة المرور
                </label>

                <div className="group relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold/70 transition-colors duration-300 group-focus-within:text-gold"
                  />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="أدخل كلمة المرور"
                    autoComplete="current-password"
                    minLength={5}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-[3.1rem] w-full rounded-xl border border-white/10 bg-[#040c16]/50 px-4 pr-11 text-sm text-warm-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold/60 focus:bg-gold/[0.03] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                  />
                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 text-[11px] font-medium text-red-400"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 flex h-[3.25rem] w-full cursor-pointer items-center justify-center rounded-xl bg-gold font-extrabold text-midnight shadow-[0_12px_30px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_16px_35px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-gold"
              >
                {isSubmitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>

            {/* ================= Signup Navigation ================= */}
            <p className="mt-6 text-center text-sm text-white/45">
              ليس لديك حساب؟
              <Link
                to="/signup"
                className="mr-1 font-bold text-gold transition-colors hover:text-gold-light"
              >
                إنشاء حساب جديد
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

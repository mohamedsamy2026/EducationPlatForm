// Hooks
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
} from "@fortawesome/free-solid-svg-icons";

// Images
import SignupHome from "../assets/Background/Login.webp";
import Master from "../assets/Master/Master.webp";

// React Router
import { Link } from "react-router-dom";

export default function Signup() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    parentPhone: "",
    password: "",
    confirmPassword: "",
    stage: "",
    grade: "",
  });

  const fields = [
    {
      name: "fullName",
      label: "الاسم الكامل",
      placeholder: "أدخل اسمك الكامل",
      type: "text",
      icon: faUser,
    },
    {
      name: "email",
      label: "البريد الإلكتروني",
      placeholder: "أدخل البريد الإلكتروني",
      type: "email",
      icon: faEnvelope,
    },
    {
      name: "phone",
      label: "رقم الهاتف",
      placeholder: "أدخل رقم هاتفك",
      type: "tel",
      icon: faPhone,
    },
    {
      name: "parentPhone",
      label: "رقم ولي الأمر",
      placeholder: "أدخل رقم ولي الأمر",
      type: "tel",
      icon: faUserTie,
    },
  ];

  const passwordFields = [
    {
      name: "password",
      label: "كلمة المرور",
      placeholder: "أنشئ كلمة مرور قوية",
    },
    {
      name: "confirmPassword",
      label: "تأكيد كلمة المرور",
      placeholder: "تأكيد كلمة المرور",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8"
    >
      {/* ================= Background ================= */}
      <div className="absolute inset-0 z-0">
        <img
          src={SignupHome}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      {/* ================= Signup Card ================= */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border-navy bg-[#07182B]/90 px-5 py-6 shadow-2xl backdrop-blur-sm sm:px-8 sm:py-8">
        {/* ================= Logo ================= */}
        <div className="mb-5 text-center">
          <img
            src={Master}
            alt="الغازي في التاريخ"
            className="mx-auto mb-3 h-30 w-30 object-contain"
          />

          <h1 className="text-2xl font-extrabold text-gold sm:text-3xl">
            إنشاء حساب جديد
          </h1>

          <p className="mt-2 text-sm text-muted-gray">
            أنشئ حسابك وابدأ رحلتك في تعلم التاريخ
          </p>
        </div>

        {/* ================= Form ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================= Normal Fields ================= */}
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-semibold text-warm-white">
                {field.label}
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={field.icon}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold"
                />

                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="h-[3rem] w-full rounded-lg border border-border-navy bg-charcoal/70 px-4 pr-11 text-warm-white outline-none transition-colors placeholder:text-muted-gray focus:border-gold"
                />
              </div>
            </div>
          ))}

          {/* ================= Password Fields ================= */}
          {passwordFields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-semibold text-warm-white">
                {field.label}
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold"
                />

                <input
                  type="password"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="h-[3rem] w-full rounded-lg border border-border-navy bg-charcoal/70 px-4 pr-11 text-warm-white outline-none transition-colors placeholder:text-muted-gray focus:border-gold"
                />
              </div>
            </div>
          ))}

          {/* ================= School Grade ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {educationFields.map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-semibold text-warm-white">
                  {field.label}
                </label>

                <div className="relative">
                  <FontAwesomeIcon
                    icon={field.icon}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gold"
                  />

                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="h-[3rem] w-full rounded-lg border border-border-navy bg-charcoal/70 px-4 pr-11 text-warm-white outline-none transition-colors focus:border-gold"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* ================= Create Account Button ================= */}
          <button
            type="submit"
            className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-gold font-bold text-midnight shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
          >
            إنشاء الحساب
          </button>
        </form>

        {/* ================= Login ================= */}
        <p className="mt-5 text-center text-sm text-muted-gray">
          لديك حساب بالفعل؟
          <Link
            to="/login"
            className="mr-1 font-bold text-gold transition-colors hover:text-gold-light"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>    
    </section>
  );
}

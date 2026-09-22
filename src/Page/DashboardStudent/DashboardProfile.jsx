// COMPONENTS
import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";

// DATA
import students from "../../date/students";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGraduationCap,
  faIdCard,
  faLocationDot,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardProfile() {
  // الطالب الحالي مؤقتًا
  const currentStudent = students[0];

  // حالة عدم وجود بيانات
  if (!currentStudent) {
    return (
      <>
        {/* Header */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

          <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3">
                  <FontAwesomeIcon icon={faUser} />
                  الملف الشخصي
                </span>

                <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  الملف الشخصي
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                  راجع بيانات حسابك المسجلة على المنصة.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <DashboardEmptyState
            icon={faUser}
            title="لا توجد بيانات للملف الشخصي"
            description="تعذر العثور على بيانات الطالب حاليًا."
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

        <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3">
                <FontAwesomeIcon icon={faUser} />
                الملف الشخصي
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                الملف الشخصي
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                راجع بيانات حسابك المسجلة على المنصة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
          {/* Profile Intro */}
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_85%_20%,rgba(212,175,55,0.09),transparent_35%)] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-2xl text-gold">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <div>
                <p className="text-xs font-bold text-gold">بيانات الطالب</p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  {currentStudent.name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  بيانات الحساب المسجلة على المنصة
                </p>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-2">
            <ProfileItem
              icon={faUser}
              label="الاسم"
              value={currentStudent.name}
            />

            <ProfileItem
              icon={faEnvelope}
              label="البريد الإلكتروني"
              value={currentStudent.email}
            />

            <ProfileItem
              icon={faPhone}
              label="رقم الهاتف"
              value={currentStudent.phone}
            />

            <ProfileItem
              icon={faGraduationCap}
              label="المرحلة الدراسية"
              value={currentStudent.grade}
            />

            <ProfileItem
              icon={faLocationDot}
              label="المحافظة"
              value={currentStudent.governorate}
            />

            <ProfileItem
              icon={faIdCard}
              label="معرّف الطالب"
              value={currentStudent.id}
            />
          </div>
        </section>

        {/* Account Note */}
        <div className="mt-6 rounded-2xl border border-gold/10 bg-gold/[0.03] px-5 py-4">
          <p className="text-center text-sm font-bold leading-7 text-white">
            هذه الصفحة مخصصة لعرض بيانات الحساب الحالية فقط. كلمة المرور لا يتم
            عرضها ضمن بيانات الملف الشخصي.
          </p>
        </div>
      </div>
    </>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="bg-[#0c1a2b] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <FontAwesomeIcon icon={icon} />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold text-white/35">{label}</p>

          <p className="mt-2 break-words text-sm font-bold leading-7 text-white/80 sm:text-base">
            {value || "غير متوفر"}
          </p>
        </div>
      </div>
    </div>
  );
}

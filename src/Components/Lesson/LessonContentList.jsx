import { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faChevronDown,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";

export default function LessonContentList({
  units,
  courseId,
  currentLessonId,
}) {
  // 1. تدور على الوحدة اللي جواها الدرس الحالي
  const activeUnit = units.find((unit) =>
    unit.lessons.some(
      (lesson) => String(lesson.id) === String(currentLessonId),
    ),
  );

  // 2. تلي الوحدة المفتوحة هي اللي فيها الدرس، ولو ملقاش يرجع للوحدة الأولى
  const [openUnitId, setOpenUnitId] = useState(
    activeUnit?.id ?? units[0]?.id ?? null,
  );
  if (!units.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-6 lg:p-7">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-10 bg-gold" />

          <span className="text-xs font-bold tracking-[0.15em] text-gold">
            محتوى الكورس
          </span>
          <span className="h-px w-10 bg-gold" />
        </div>

        <h2 className="text-2xl font-black text-white">الوحدات والدروس</h2>

        <p className="mt-2 text-sm leading-7 text-white/70">
          اختر الدرس الذي تريد مشاهدته.
        </p>
      </div>

      <div className="space-y-3">
        {units.map((unit, index) => {
          const isOpen = openUnitId === unit.id;

          return (
            <div
              key={unit.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-gold/30 bg-[#102238]"
                  : "border-white/10 bg-white/[0.02] hover:border-gold/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenUnitId(isOpen ? null : unit.id)}
                className="flex w-full items-center gap-4 px-4 py-4 text-right transition-colors duration-300 hover:bg-white/[0.02] sm:px-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-xs font-black text-gold">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-white sm:text-base">
                    {unit.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    {unit.lessons.length} دروس
                  </p>
                </div>

                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs text-white/35 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-white/5 px-3 pb-3 pt-2 sm:px-4">
                    {unit.lessons.map((lesson, lessonIndex) => {
                      const isCurrent =
                        String(lesson.id) === String(currentLessonId);

                      return (
                        <Link
                          key={lesson.id}
                          to={`/courses/${courseId}/lessons/${lesson.id}`}
                          className={`group flex items-center gap-4 rounded-xl my-2 px-3 py-3 transition-all duration-300 ${
                            isCurrent
                              ? "bg-gold/10 text-white"
                              : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
                              isCurrent
                                ? "bg-gold text-midnight"
                                : "bg-white/[0.04] text-white/35 group-hover:bg-gold/10 group-hover:text-gold"
                            }`}
                          >
                            {lessonIndex + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold transition-colors duration-300 ${
                                isCurrent
                                  ? "text-white"
                                  : "text-white/65 group-hover:text-white"
                              }`}
                            >
                              {lesson.title}
                            </p>

                            {lesson.duration && (
                              <span className="mt-1 block text-xs text-white/30">
                                {lesson.duration}
                              </span>
                            )}
                          </div>

                          <FontAwesomeIcon
                            icon={faCirclePlay}
                            className={`text-sm ${
                              isCurrent
                                ? "text-gold"
                                : "text-white/15 group-hover:text-gold/60"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-gold/10 bg-gold/[0.025] px-4 py-3">
        <FontAwesomeIcon icon={faBookOpen} className="text-sm text-gold" />

        <p className="text-xs font-bold leading-6 text-white/80">
          الدرس المحدد حاليًا مميز داخل قائمة المحتوى.
        </p>
      </div>
    </section>
  );
}

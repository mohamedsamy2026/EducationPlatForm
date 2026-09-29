import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BookCard from "../Components/Books/BookCard";
import { getBooks } from "../services/bookService";
import grades from "../data/grades";

const gradeFilters = [
   { 
    id: "all",
    label: "الكل" 
    },
    ...grades.map((grade) => ({
    id: grade.id,
    label: grade.label,
  })),
];

export default function Books() {
  const [books, setBooks] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      try {
        const allBooks = await getBooks();

        if (cancelled) return;

        setBooks(allBooks);
      } catch {
        if (cancelled) return;

        setBooks([]);
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    if (!books) return [];

    if (selectedGrade === "all") {
      return books;
    }

    return books.filter((book) => book.grade === selectedGrade);
  }, [books, selectedGrade]);

  if (books === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      <Navbar />

      <main
        dir="rtl"
        className="relative overflow-hidden bg-midnight px-4 pb-24 pt-32 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute right-1/2 top-8 h-96 w-96 translate-x-1/2 rounded-full bg-gold/5 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-10 left-0 h-80 w-80 rounded-full bg-[#10243a]/50 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/90 duration-200 hover:text-gold hover:gap-4"
            >
              <FontAwesomeIcon icon={faArrowRight} />
              <span>العودة للرئيسية</span>
            </Link>

            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-l from-gold to-transparent" />
              <span className="text-xs font-bold tracking-[0.25em] text-gold">
                الكتب والمذكرات
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-warm-white sm:text-5xl md:text-6xl">
              كل الكتب التعليمية
            </h1>

            <p className="text-sm leading-8 text-white/60 sm:text-base">
              اختر صفك واستعرض الكتب المتاحة، ثم انتقل مباشرة إلى صفحة الشراء.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {gradeFilters.map((grade) => {
              const isActive = grade.id === selectedGrade;

              return (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-300 ${isActive ? "border-gold bg-gold text-midnight shadow-[0_10px_30px_rgba(212,175,55,0.16)]" : "border-white/10 bg-white/[0.03] text-white/60 hover:border-gold/30 hover:bg-gold/10 hover:text-gold"}`}
                >
                  {grade.label}
                </button>
              );
            })}
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0c1a2b] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.20)]">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mb-5 text-3xl text-gold"
              />
              <h2 className="mb-3 text-xl font-extrabold text-warm-white">
                لا توجد كتب لهذا الصف حاليًا
              </h2>
              <p className="text-sm leading-7 text-white/55">
                جرّب اختيار صف آخر من الفلاتر بالأعلى.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

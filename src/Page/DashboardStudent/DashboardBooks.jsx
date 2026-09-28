import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBookOpen, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

import { getCurrentStudent } from "../../services/studentService";

import { getBooksByStudentGrade } from "../../services/bookService";

import { getBookPurchaseRequestsByStudentId } from "../../services/bookPurchaseService";

import DashboardBookCard from "../../Components/DashboardStudent/DashboardBookCard";
import { getGradeLabel } from "../../utils/gradeUtils";

export default function DashboardBooks() {
  const [student, setStudent] = useState(null);

  const [books, setBooks] = useState([]);

  const [purchaseRequests, setPurchaseRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStudentBooks() {
      try {
        setIsLoading(true);

        const currentStudent = await getCurrentStudent();

        if (cancelled) return;

        if (!currentStudent) {
          setStudent(null);
          setBooks([]);
          setPurchaseRequests([]);
          return;
        }

        const [studentBooks, requests] = await Promise.all([
          getBooksByStudentGrade(currentStudent.grade),
          getBookPurchaseRequestsByStudentId(currentStudent.id),
        ]);

        if (cancelled) return;

        setStudent(currentStudent);
        setBooks(studentBooks);
        setPurchaseRequests(requests);
      } catch {
        if (cancelled) return;

        setStudent(null);
        setBooks([]);
        setPurchaseRequests([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadStudentBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  const purchaseStatusByBookId = new Map();

  purchaseRequests.forEach((request) => {
    const bookId = String(request.bookId);

    if (!purchaseStatusByBookId.has(bookId)) {
      purchaseStatusByBookId.set(bookId, request.status);
    }
  });

  if (isLoading) {
    return null;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-midnight px-5 py-24 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="my-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faBookOpen} />
            </span>

            <div>
              <p className="text-xs font-bold text-gold">الكتب الخاصة بك</p>

              <h1 className="mt-1 text-3xl font-black text-warm-white sm:text-4xl">
                كتبي
              </h1>
            </div>
          </div>

          {student ? (
            <div className="flex items-center gap-3 text-sm text-white/50">
              <span>{getGradeLabel(student.grade)}</span>

              <span className="text-white/20">•</span>

              <span>الكتب الخاصة بصفك</span>
            </div>
          ) : null}
        </div>

        {books.length > 0 ? (
          <>
            <div className="mb-8 rounded-2xl border border-gold/10 bg-[#0c1a2b] p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </span>

                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    الكتب الخاصة بصفك
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/55">
                    تظهر هنا الكتب المطابقة للصف المسجل في حسابك.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <DashboardBookCard
                  key={book.id}
                  book={book}
                  purchaseStatus={
                    purchaseStatusByBookId.get(String(book.id)) ?? null
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#0c1a2b] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="mb-5 text-3xl text-gold"
            />

            <h2 className="mb-3 text-xl font-extrabold text-warm-white">
              لا توجد كتب متاحة لصفك حاليًا
            </h2>

            <p className="text-sm leading-7 text-white/50">
              سيتم عرض الكتب الخاصة بصفك هنا عند إضافتها.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBookOpen, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

import { getCurrentStudent } from "../../services/studentService";

import { getBooksByStudentGrade } from "../../services/bookService";

import { getBookPurchaseRequestsByStudentId } from "../../services/bookPurchaseService";
import { getPurchasedBookIdsByStudentId } from "../../services/bookPurchasesService";

import DashboardBookCard from "../../Components/DashboardStudent/DashboardBookCard";
import { getGradeLabel } from "../../utils/gradeUtils";

export default function DashboardBooks() {
  const [student, setStudent] = useState(null);

  const [books, setBooks] = useState([]);

  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [ownedBookIds, setOwnedBookIds] = useState([]);

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

        const [studentBooks, requests, ownedIds] = await Promise.all([
          getBooksByStudentGrade(currentStudent.grade),
          getBookPurchaseRequestsByStudentId(currentStudent.id),
          getPurchasedBookIdsByStudentId(currentStudent.id),
        ]);

        if (cancelled) return;

        setStudent(currentStudent);
        setBooks(studentBooks);
        setPurchaseRequests(requests);
        setOwnedBookIds(ownedIds);
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
    <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-7">
        <div className="mb-5 ">
          <div className="mb-4 gap-3">
            <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold mb-5">
              <FontAwesomeIcon icon={faBookOpen} />
             الكتب الخاصه بك
            </span>
            <div className="flex gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <FontAwesomeIcon icon={faBookOpen} />
              </span>
              <h1 className="mt-1 text-3xl font-black text-warm-white sm:text-4xl">
                كتبي
              </h1>
            </div>
          </div>

          {student ? (
            <div className="flex items-center gap-3 text-sm text-white/50 mt-5">
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
                    ownedBookIds.includes(String(book.id))
                      ? "approved"
                      : (purchaseStatusByBookId.get(String(book.id)) ?? null)
                  }
                  isUnavailable={book.availability === "unavailable"}
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
    </section>
  );
}

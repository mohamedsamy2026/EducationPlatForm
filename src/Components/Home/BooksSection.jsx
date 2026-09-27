import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { getBooks } from "../../services/bookService";
import BookCard from "./BookCard";

export default function BooksSection() {
  const [books, setBooks] = useState(null);
  const swiperRef = useRef(null);

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

  if (books === null) {
    return null;
  }

  return (
    <section
      id="books"
      dir="rtl"
      className="relative overflow-hidden bg-charcoal px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute right-1/2 top-16 h-80 w-80 translate-x-1/2 rounded-full bg-gold/5 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-16 left-0 h-72 w-72 rounded-full bg-[#10243a]/45 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-l from-gold to-transparent" />
            <span className="text-xs font-bold tracking-[0.25em] text-gold">
              كتب ومذكرات+
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
          </div>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-warm-white sm:text-4xl md:text-5xl">
            كتبنا التعليمية
          </h2>

          <p className="text-sm leading-8 text-white/60 sm:text-base">
            اختر الكتاب المناسب لصفك وابدأ مراجعتك بطريقة منظمة تساعدك على الفهم والمذاكرة.
          </p>
        </div>

        {books.length > 0 ? (
          <div className="relative px-8 sm:px-10 lg:px-10">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Autoplay]}
              loop={books.length > 3}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              slidesPerView={1.08}
              spaceBetween={16}
              breakpoints={{
                640: {
                  slidesPerView: 1.6,
                  spaceBetween: 20,
                },
                900: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="books-swiper"
            >
              {books.map((book) => (
                <SwiperSlide key={book.id} className="h-auto">
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              aria-label="الكتب السابقة"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-[#0c1a2b]/90 text-gold shadow-[0_10px_30px_rgba(0,0,0,0.30)] backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight lg:flex"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            <button
              type="button"
              aria-label="الكتب التالية"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-[#0c1a2b]/90 text-gold shadow-[0_10px_30px_rgba(0,0,0,0.30)] backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight lg:flex"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0c1a2b] p-8 text-center">
            <FontAwesomeIcon icon={faBookOpen} className="mb-4 text-2xl text-gold" />
            <p className="text-sm leading-7 text-white/60">
              لا توجد كتب متاحة حاليًا.
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-3 rounded-xl border border-gold/35 bg-gold/10 px-6 py-3.5 text-sm font-extrabold text-gold transition-all duration-300 hover:gap-4 hover:bg-gold hover:text-midnight"
          >
            <span>عرض كل الكتب</span>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
    </section>
  );
}

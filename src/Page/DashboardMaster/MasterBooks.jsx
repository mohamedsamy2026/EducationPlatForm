import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faBook,
  faCircleCheck,
  faEye,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import MasterConfirmModal from "../../Components/DashboardMaster/Shared/MasterConfirmModal";
import MasterEmptyState from "../../Components/DashboardMaster/Shared/MasterEmptyState";
import MasterModal from "../../Components/DashboardMaster/Shared/MasterModal";
import MasterNotice from "../../Components/DashboardMaster/Shared/MasterNotice";
import MasterPageHeader from "../../Components/DashboardMaster/Shared/MasterPageHeader";
import MasterPagination from "../../Components/DashboardMaster/Shared/MasterPagination";
import MasterSearchFilters from "../../Components/DashboardMaster/Shared/MasterSearchFilters";
import MasterStatCard from "../../Components/DashboardMaster/Shared/MasterStatCard";
import MasterStatusBadge from "../../Components/DashboardMaster/Shared/MasterStatusBadge";
import {
  dangerButtonClass,
  iconButtonClass,
  iconDangerButtonClass,
  softButtonClass,
} from "../../Components/DashboardMaster/Shared/masterStyles";
import useAsyncData from "../../hooks/useAsyncData";
import { formatPrice } from "../../utils/formatters";
import {
  deleteAllMasterBooks,
  deleteMasterBook,
  getMasterBookDeleteSummary,
  getMasterBookPreview,
  getMasterBooksDeleteAllSummary,
  getMasterBooksPage,
  getMasterBooksSummary,
  setMasterBookAvailability,
} from "../../services/masterBooksService";

const PAGE_SIZE = 9;

export default function MasterBooks() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const summaryState = useAsyncData(() => getMasterBooksSummary(), [refreshKey]);
  const { data, loading, error } = useAsyncData(
    () => getMasterBooksPage({ search, grade, availability, page, pageSize: PAGE_SIZE }),
    [search, grade, availability, page, refreshKey],
  );

  const summary = summaryState.data;
  const reload = () => setRefreshKey((value) => value + 1);
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const openPreview = async (book) => {
    try {
      setPreview(await getMasterBookPreview(book.id));
    } catch (previewError) {
      setActionError(previewError.message);
    }
  };

  const toggleAvailability = async (book) => {
    const next = book.availability === "available" ? "unavailable" : "available";

    try {
      await setMasterBookAvailability(book.id, next);
      setNotice(
        next === "available"
          ? "الكتاب بقى متاحًا للشراء."
          : "الكتاب بقى غير متاح للشراء. اللي اشتراه قبل كده يفضل عنده.",
      );
      reload();
    } catch (toggleError) {
      setActionError(toggleError.message);
    }
  };

  const askDelete = async (book) => {
    try {
      setDeleteTarget({
        book,
        summary: book
          ? await getMasterBookDeleteSummary(book.id)
          : await getMasterBooksDeleteAllSummary(),
      });
    } catch (summaryError) {
      setActionError(summaryError.message);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      if (deleteTarget.book) {
        await deleteMasterBook(deleteTarget.book.id);
        setNotice(`تم حذف الكتاب "${deleteTarget.book.title}".`);
      } else {
        const result = await deleteAllMasterBooks();
        setNotice(`تم حذف ${result.deletedBooks} كتاب.`);
      }

      setDeleteTarget(null);
      setPage(1);
      reload();
    } catch (deleteError) {
      setActionError(deleteError.message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteMessage = !deleteTarget
    ? ""
    : deleteTarget.book
      ? `سيتم حذف الكتاب "${deleteTarget.book.title}" نهائيًا، ومعه ${deleteTarget.summary.requestsCount} طلب شراء وسجل ${deleteTarget.summary.buyersCount} مشترٍ (لن يظهر الكتاب عندهم بعد الحذف). لا يمكن التراجع.`
      : `سيتم حذف ${deleteTarget.summary.booksCount} كتاب نهائيًا، ومعهم ${deleteTarget.summary.requestsCount} طلب شراء وسجل ${deleteTarget.summary.buyersCount} عملية شراء. لا يمكن التراجع.`;

  const gradeOptions = [
    { value: "all", label: "كل الصفوف" },
    ...(data?.gradeOptions ?? []).map((item) => ({ value: item.id, label: item.label })),
  ];

  return (
    <div className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <MasterPageHeader
          title="الكتب والمذكرات"
          description="أدر الكتب، وحدّد توفرها للشراء، وتابع عدد المشترين."
          actionLabel="إضافة كتاب"
          actionTo="/dashboard-master/books/new"
          actionIcon={faPlus}
        />

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MasterStatCard label="كل الكتب" value={summary?.total ?? "—"} icon={faBook} />
          <MasterStatCard
            label="متاحة للشراء"
            value={summary?.available ?? "—"}
            icon={faCircleCheck}
          />
          <MasterStatCard label="غير متاحة" value={summary?.unavailable ?? "—"} icon={faBan} />
        </section>

        <MasterNotice onClose={() => setNotice("")}>{notice}</MasterNotice>
        <MasterNotice type="error" onClose={() => setActionError("")}>
          {actionError || error}
        </MasterNotice>

        <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <MasterSearchFilters
              search={search}
              onSearchChange={changeFilter(setSearch)}
              searchPlaceholder="ابحث باسم الكتاب أو رقمه..."
              filters={[
                {
                  id: "grade",
                  label: "الصف",
                  value: grade,
                  onChange: changeFilter(setGrade),
                  options: gradeOptions,
                },
                {
                  id: "availability",
                  label: "التوفر",
                  value: availability,
                  onChange: changeFilter(setAvailability),
                  options: [
                    { value: "all", label: "الكل" },
                    { value: "available", label: "متاح" },
                    { value: "unavailable", label: "غير متاح" },
                  ],
                },
              ]}
            />
          </div>
          <button type="button" onClick={() => askDelete(null)} className={dangerButtonClass}>
            <FontAwesomeIcon icon={faTrashCan} />
            حذف كل الكتب
          </button>
        </div>

        {loading ? (
          <MasterEmptyState title="جاري تحميل الكتب..." />
        ) : data?.rows.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.rows.map((book) => (
                <article
                  key={book.id}
                  className="flex overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]"
                >
                  <div className="w-32 shrink-0 bg-[#071321] sm:w-36">
                    {book.image && (
                      <img src={book.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-extrabold text-gold">{book.gradeLabel}</p>
                      <MasterStatusBadge
                        status={book.availability}
                        label={book.availabilityLabel}
                      />
                    </div>
                    <h2 className="mt-2 line-clamp-2 text-base font-black leading-7 text-white">
                      {book.title}
                    </h2>
                    <p className="mt-1 text-sm font-black text-gold">{formatPrice(book.price)}</p>
                    <p className="mt-2 text-xs font-bold text-white/40">
                      {book.buyersCount} مشترٍ • {book.requestsCount} طلب
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => openPreview(book)}
                        className={softButtonClass}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        معاينة
                      </button>
                      <Link
                        to={`/dashboard-master/books/${book.id}/edit`}
                        className={iconButtonClass}
                        aria-label="تعديل الكتاب"
                        title="تعديل"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleAvailability(book)}
                        className={iconButtonClass}
                        aria-label="تغيير التوفر"
                        title={book.availability === "available" ? "إيقاف الشراء" : "إتاحة الشراء"}
                      >
                        <FontAwesomeIcon
                          icon={book.availability === "available" ? faBan : faCircleCheck}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => askDelete(book)}
                        className={iconDangerButtonClass}
                        aria-label="حذف الكتاب"
                        title="حذف"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1a2b]">
              <MasterPagination {...data.pagination} itemLabel="كتاب" onPageChange={setPage} />
            </div>
          </>
        ) : (
          <MasterEmptyState
            icon={faBook}
            title="لا توجد كتب"
            description="لم يتم العثور على كتب مطابقة، أو لم تضف أي كتاب بعد."
          />
        )}
      </div>

      <MasterModal
        isOpen={Boolean(preview)}
        title="معاينة الكتاب"
        description="كده بيظهر الكتاب للطالب."
        onClose={() => setPreview(null)}
      >
        {preview && (
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-[#071321] sm:w-48">
              {preview.image && (
                <img src={preview.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 space-y-3">
              <MasterStatusBadge status={preview.availability} label={preview.availabilityLabel} />
              <h3 className="text-xl font-black leading-8 text-white">{preview.title}</h3>
              <p className="text-xs font-extrabold text-gold">{preview.gradeLabel}</p>
              <p className="text-sm font-bold leading-7 text-white/60">
                {preview.description || "لا يوجد وصف."}
              </p>
              <p className="text-lg font-black text-gold">{formatPrice(preview.price)}</p>
              <p className="text-xs font-bold text-white/40">
                رقم الكتاب: {preview.id} • {preview.buyersCount} مشترٍ
              </p>
            </div>
          </div>
        )}
      </MasterModal>

      <MasterConfirmModal
        isOpen={Boolean(deleteTarget)}
        isDanger
        isLoading={isDeleting}
        title={deleteTarget?.book ? "حذف الكتاب" : "حذف كل الكتب"}
        message={deleteMessage}
        confirmLabel="تأكيد الحذف"
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
      />
    </div>
  );
}

export function paginate(items, page = 1, pageSize = 20) {
  const total = items.length;
  const pageCount = Math.ceil(total / pageSize);
  const safePage = Math.min(Math.max(1, Number(page) || 1), Math.max(1, pageCount));
  const start = (safePage - 1) * pageSize;

  return {
    rows: items.slice(start, start + pageSize),
    pagination: { page: safePage, pageSize, pageCount, total },
  };
}

export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

// true لو أي حقل من الحقول يحتوي على نص البحث (بحث فاضي = الكل)
export function matchesSearch(fields, term) {
  const needle = normalizeText(term);

  if (!needle) return true;

  return fields.some((field) => normalizeText(field).includes(needle));
}

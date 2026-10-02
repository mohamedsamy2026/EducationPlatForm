import { useEffect, useState } from "react";

// يحمّل بيانات من service بشكل آمن: loading أول مرة فقط، error، وإلغاء عند الخروج.
// deps: القيم اللي لو اتغيرت يتعاد التحميل (فلاتر، صفحة، refreshKey...).
// أثناء إعادة التحميل بنفضل نعرض آخر بيانات وصلت عشان الشاشة ما تومضش.
export default function useAsyncData(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: "", loading: true });

  useEffect(() => {
    let cancelled = false;

    loader()
      .then((data) => {
        if (!cancelled) setState({ data, error: "", loading: false });
      })
      .catch((error) => {
        if (!cancelled) {
          setState((previous) => ({
            data: previous.data,
            error: error?.message || "تعذر تحميل البيانات.",
            loading: false,
          }));
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

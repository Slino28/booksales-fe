import { useCallback, useEffect, useState } from "react";
import { request } from "../../api";

/**
 * Mengambil data GET dari API dan mengurus status loading / error.
 *
 *   const { data, loading, error, reload } = useFetch("/books");
 *
 * - path = null  -> tidak mengambil apa-apa (berguna untuk menunggu kondisi tertentu)
 * - reload()     -> ambil ulang data
 */
export default function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: path !== null, error: "", status: 0 });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (path === null) return undefined;

    let aktif = true;
    setState((s) => ({ ...s, loading: true, error: "" }));

    request(path)
      .then((res) => aktif && setState({ data: res.data, loading: false, error: "", status: 200 }))
      .catch(
        (err) =>
          aktif && setState({ data: null, loading: false, error: err.message, status: err.status })
      );

    // kalau komponen sudah ditinggalkan, jawaban yang telat datang diabaikan
    return () => {
      aktif = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, reload };
}

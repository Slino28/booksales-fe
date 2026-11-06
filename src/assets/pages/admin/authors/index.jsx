import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../../api";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/authors")
      .then((res) => setAuthors(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Daftar Author
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {authors.length} author tersimpan
            </p>
          </div>
          <Link
            to="/admin/authors/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
          >
            + Tambah Author
          </Link>
        </div>

        {loading && (
          <p className="px-4 pb-6 text-gray-500 dark:text-gray-400">
            Memuat data...
          </p>
        )}

        {error && (
          <p className="mx-4 mb-4 p-3 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-700 dark:text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Author
                  </th>
                  <th scope="col" className="px-4 py-3">
                    File foto
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Biografi
                  </th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id} className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex items-center gap-3">
                        {/* lingkaran berisi huruf pertama nama sebagai pengganti foto */}
                        <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-indigo-600 rounded-full">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                        {author.name}
                      </div>
                    </th>
                    <td className="px-4 py-3">{author.photo ?? "-"}</td>
                    <td className="px-4 py-3">{author.bio ?? "-"}</td>
                  </tr>
                ))}
                {authors.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center">
                      Belum ada author.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

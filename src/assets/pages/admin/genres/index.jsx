import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../../api";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ambil data genre dari API saat halaman pertama kali dibuka
  useEffect(() => {
    request("/genres")
      .then((res) => setGenres(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Daftar Genre
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {genres.length} genre tersimpan
            </p>
          </div>
          <Link
            to="/admin/genres/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
          >
            + Tambah Genre
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
                    No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Nama genre
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Deskripsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre, index) => (
                  <tr key={genre.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">{index + 1}</td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {genre.name}
                    </th>
                    <td className="px-4 py-3">{genre.description ?? "-"}</td>
                  </tr>
                ))}
                {genres.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center">
                      Belum ada genre.
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

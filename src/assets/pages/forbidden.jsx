import { Link } from "react-router-dom";
import { homeFor, useAuth } from "../context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <section className="flex items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center">
        <p className="text-7xl font-extrabold text-indigo-600">403</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Kamu tidak punya akses ke halaman ini
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Halaman tersebut hanya untuk peran tertentu
          {user ? ` (kamu masuk sebagai ${user.role}).` : "."}
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link
            to={user ? homeFor(user.role) : "/login"}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {user ? "Kembali ke beranda" : "Masuk"}
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}

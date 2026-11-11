import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roleLabel = { admin: "Administrator", customer: "Pelanggan" };

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const initial = user.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <section className="px-4 py-12 mx-auto max-w-xl">
      <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-indigo-600 rounded-full">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate dark:text-white">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 text-sm divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex justify-between py-3">
            <dt className="text-gray-500 dark:text-gray-400">Peran</dt>
            <dd>
              <span className="px-2.5 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300">
                {roleLabel[user.role] ?? user.role}
              </span>
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-gray-500 dark:text-gray-400">Akses dashboard admin</dt>
            <dd className="font-medium text-gray-900 dark:text-white">
              {isAdmin ? "Ya" : "Tidak"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3 mt-6">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Buka dashboard admin
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-gray-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </section>
  );
}

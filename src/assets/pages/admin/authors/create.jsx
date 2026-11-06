import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../../api";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";

export default function AuthorCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", photo: "", bio: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [needLogin, setNeedLogin] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage("");
    setNeedLogin(false);

    try {
      await request("/authors", { method: "POST", body: form });
      navigate("/admin/authors");
    } catch (err) {
      setErrors(err.errors ?? {});
      setMessage(err.message);
      setNeedLogin(err.status === 401 || err.status === 403);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto">
        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Tambah Author
        </h1>

        {message && (
          <p className="mb-4 p-3 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-700 dark:text-red-400">
            {message}{" "}
            {needLogin && (
              <Link to="/login" className="font-medium underline">
                Masuk sebagai admin
              </Link>
            )}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama author
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Contoh: Tere Liye"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="photo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama file foto
              </label>
              <input
                type="text"
                name="photo"
                id="photo"
                value={form.photo}
                onChange={handleChange}
                className={inputClass}
                placeholder="Contoh: tere_liye.jpg"
              />
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600">{errors.photo[0]}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Biografi
              </label>
              <textarea
                name="bio"
                id="bio"
                rows="5"
                value={form.bio}
                onChange={handleChange}
                className={inputClass}
                placeholder="Tulis biografi singkat author..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio[0]}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <Link
              to="/admin/authors"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium dark:text-gray-300"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

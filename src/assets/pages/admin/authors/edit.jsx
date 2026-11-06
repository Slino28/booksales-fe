import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "../../../../api";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";

export default function AuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", photo: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [needLogin, setNeedLogin] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    request(`/authors/${id}`)
      .then((res) =>
        setForm({
          name: res.data.name ?? "",
          photo: res.data.photo ?? "",
          bio: res.data.bio ?? "",
        })
      )
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
      await request(`/authors/${id}`, { method: "PUT", body: form });
      navigate("/admin/authors");
    } catch (err) {
      setErrors(err.errors ?? {});
      setMessage(err.message);
      setNeedLogin(err.status === 401 || err.status === 403);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-500 dark:text-gray-400">Memuat data...</p>;
  }

  if (loadError) {
    return (
      <div className="max-w-2xl px-4 py-8 mx-auto">
        <p className="mb-4 p-3 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-700 dark:text-red-400">
          {loadError}
        </p>
        <Link to="/admin/authors" className="text-indigo-600 hover:underline">
          &larr; Kembali ke daftar author
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto">
        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Ubah Author
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
              {saving ? "Menyimpan..." : "Perbarui"}
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

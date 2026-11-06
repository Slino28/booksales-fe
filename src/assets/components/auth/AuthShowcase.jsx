import { Link } from "react-router-dom";

// Punggung buku di rak. Judul diambil dari data buku BookSales.
// height = persen dari tinggi rak, width = lebar punggung.
const spines = [
  { title: "Bumi", height: 78, width: "w-11", color: "bg-[#F2B632] text-tinta" },
  { title: "Laskar Pelangi", height: 92, width: "w-14", color: "bg-[#E4572E] text-white" },
  { title: "", height: 68, width: "w-8", color: "bg-[#EFE9DD]" },
  { title: "Harry Potter", height: 84, width: "w-12", color: "bg-[#1F6F54] text-white" },
  { title: "Murder on the Orient Express", height: 100, width: "w-16", color: "bg-kobalt text-white" },
  { title: "", height: 72, width: "w-9", color: "bg-[#B8A1F5]" },
  { title: "Perahu Kertas", height: 88, width: "w-12", color: "bg-[#17A398] text-white" },
  { title: "", height: 64, width: "w-7", color: "bg-[#F2B632]" },
  { title: "", height: 80, width: "w-10", color: "bg-[#E4572E]" },
  { title: "", height: 62, width: "w-8", color: "bg-[#EFE9DD]" },
  { title: "", height: 90, width: "w-11", color: "bg-[#F7C8D0]" },
];

/** Panel kiri halaman daftar/masuk: judul dan rak buku. Hanya tampil di layar lebar. */
export default function AuthShowcase() {
  return (
    <aside className="hidden lg:flex flex-col justify-between overflow-hidden bg-tinta px-14 py-12 text-white">
      <Link to="/" className="font-judul text-2xl font-bold tracking-tight">
        BookSales
      </Link>

      <div>
        <h2 className="max-w-md font-judul text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
          Daftar, lalu temukan buku berikutnya.
        </h2>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
          Satu akun untuk membeli buku dan memantau pesananmu.
        </p>
      </div>

      {/* rak buku: hiasan saja, jadi disembunyikan dari pembaca layar */}
      <div aria-hidden="true">
        <div className="overflow-hidden pt-3">
          <ul className="flex h-72 items-end gap-1.5">
            {spines.map((spine, index) => (
              <li
                key={index}
                style={{
                  height: `${spine.height}%`,
                  animationDelay: `${index * 90}ms`,
                }}
                className={`flex shrink-0 items-start justify-center rounded-t-sm pt-4 shadow-[inset_-3px_0_0_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-2 motion-safe:animate-rise ${spine.width} ${spine.color}`}
              >
                {spine.title && (
                  <span className="font-judul text-sm font-semibold [writing-mode:vertical-rl]">
                    {spine.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-3 rounded-sm bg-white/20" />
      </div>
    </aside>
  );
}

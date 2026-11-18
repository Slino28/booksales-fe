// Pasangan warna sampul. Sampul dipilih dari id buku, jadi buku yang sama
// selalu mendapat warna yang sama.
const palette = [
  "bg-kobalt text-white",
  "bg-jingga text-white",
  "bg-hijau text-white",
  "bg-kuning text-tinta",
  "bg-tinta text-white",
  "bg-[#B8A1F5] text-tinta",
  "bg-[#17A398] text-white",
  "bg-[#F7C8D0] text-tinta",
];

const isUrl = (text) => /^https?:\/\//i.test(text ?? "");

/**
 * Sampul buku. Kalau cover_photo berisi alamat gambar (http...), gambarnya dipakai.
 * Kalau tidak, sampul dibuat dari judul dan nama penulis.
 */
export default function BookCover({ book, className = "" }) {
  const warna = palette[Number(book.id) % palette.length];

  if (isUrl(book.cover_photo)) {
    return (
      <img
        src={book.cover_photo}
        alt={`Sampul ${book.title}`}
        loading="lazy"
        className={`aspect-[3/4] w-full rounded-lg object-cover shadow-md ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Sampul ${book.title}`}
      className={`relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-lg p-[8%] shadow-md ${warna} ${className}`}
    >
      {/* garis punggung buku */}
      <span className="absolute inset-y-0 left-0 w-[7%] bg-black/15" aria-hidden="true" />
      <span className="line-clamp-4 pl-[6%] font-judul text-[clamp(0.8rem,2.2vw,1.25rem)] font-bold leading-tight">
        {book.title}
      </span>
      <span className="line-clamp-1 pl-[6%] text-[0.65rem] font-medium uppercase tracking-wider opacity-80">
        {book.author?.name ?? book.author ?? ""}
      </span>
    </div>
  );
}

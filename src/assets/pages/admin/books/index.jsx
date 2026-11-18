import ResourceList from "../../../components/admin/ResourceList";
import BookCover from "../../../components/ui/BookCover";
import { formatRupiah } from "../../../utils/format";

const columns = [
  {
    label: "Buku",
    render: (b) => (
      <div className="flex items-center gap-3">
        <div className="w-10 flex-none">
          <BookCover book={b} className="rounded shadow-none" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{b.title}</p>
          <p className="text-xs text-slate-500">{b.author?.name ?? "-"}</p>
        </div>
      </div>
    ),
  },
  { label: "Genre", render: (b) => <span className="text-slate-600">{b.genre?.name ?? "-"}</span> },
  { label: "Harga", render: (b) => <span className="font-semibold">{formatRupiah(b.price)}</span> },
  {
    label: "Stok",
    render: (b) => (
      <span className={Number(b.stock) <= 5 ? "font-semibold text-red-600" : "text-slate-700"}>{b.stock}</span>
    ),
  },
];

export default function AdminBooks() {
  return (
    <ResourceList
      title="Buku"
      noun="buku"
      endpoint="/books"
      basePath="/admin/books"
      columns={columns}
      nameOf={(b) => b.title}
      searchText={(b) => `${b.title} ${b.author?.name ?? ""} ${b.genre?.name ?? ""}`}
    />
  );
}

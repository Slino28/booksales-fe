import ResourceList from "../../../components/admin/ResourceList";

const isUrl = (t) => /^https?:\/\//i.test(t ?? "");

const columns = [
  {
    label: "Penulis",
    render: (a) => (
      <div className="flex items-center gap-3">
        {isUrl(a.photo) ? (
          <img src={a.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kobalt/10 text-sm font-bold text-kobalt">
            {a.name?.[0]?.toUpperCase()}
          </span>
        )}
        <span className="font-semibold text-slate-900">{a.name}</span>
      </div>
    ),
  },
  {
    label: "Bio",
    render: (a) => <span className="line-clamp-2 max-w-md text-slate-600">{a.bio || "-"}</span>,
  },
];

export default function AdminAuthors() {
  return (
    <ResourceList
      title="Penulis"
      noun="penulis"
      endpoint="/authors"
      basePath="/admin/authors"
      columns={columns}
      nameOf={(a) => a.name}
      searchText={(a) => `${a.name} ${a.bio ?? ""}`}
    />
  );
}

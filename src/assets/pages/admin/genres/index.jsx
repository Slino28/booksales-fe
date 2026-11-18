import ResourceList from "../../../components/admin/ResourceList";

const columns = [
  { label: "Nama genre", render: (g) => <span className="font-semibold text-slate-900">{g.name}</span> },
  { label: "Deskripsi", render: (g) => <span className="text-slate-600">{g.description || "-"}</span> },
];

export default function AdminGenres() {
  return (
    <ResourceList
      title="Genre"
      noun="genre"
      endpoint="/genres"
      basePath="/admin/genres"
      columns={columns}
      nameOf={(g) => g.name}
      searchText={(g) => `${g.name} ${g.description ?? ""}`}
    />
  );
}

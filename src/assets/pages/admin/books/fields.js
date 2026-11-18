export const bookFields = [
  { name: "title", label: "Judul", required: true },
  { name: "author_id", label: "Penulis", type: "select", required: true, optionsFrom: "/authors" },
  { name: "genre_id", label: "Genre", type: "select", required: true, optionsFrom: "/genres" },
  { name: "price", label: "Harga (Rp)", type: "number", required: true, placeholder: "85000" },
  { name: "stock", label: "Stok", type: "number", required: true, placeholder: "10" },
  {
    name: "cover_photo",
    label: "Alamat sampul",
    placeholder: "https://...",
    hint: "Opsional. Kalau kosong, sampul dibuat otomatis dari judul.",
  },
  { name: "description", label: "Deskripsi", type: "textarea" },
];

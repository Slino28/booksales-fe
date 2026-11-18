const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 85000 atau "85000.00" -> "Rp 85.000" */
export const formatRupiah = (value) => rupiah.format(Number(value) || 0);

/** "2026-11-18T10:00:00.000000Z" -> "18 Nov 2026" */
export const formatTanggal = (value) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

// Nama + warna untuk setiap status pesanan (sama dengan nilai di database).
export const STATUS_PESANAN = {
  menunggu: { label: "Menunggu", style: "bg-amber-100 text-amber-800" },
  dikirim: { label: "Dikirim", style: "bg-blue-100 text-blue-800" },
  selesai: { label: "Selesai", style: "bg-green-100 text-green-800" },
  dibatalkan: { label: "Dibatalkan", style: "bg-slate-200 text-slate-600" },
};

/** "INV-261118-AB12C-2" -> "INV-261118-AB12C" (kode pesanan tanpa nomor urut) */
export const kodePesanan = (orderNumber = "") => orderNumber.replace(/-\d+$/, "");

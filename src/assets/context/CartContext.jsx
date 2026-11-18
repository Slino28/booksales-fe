import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

/**
 * Keranjang belanja. Disimpan di localStorage supaya tidak hilang saat refresh.
 * Harga di sini hanya untuk tampilan: total sebenarnya selalu dihitung ulang server
 * saat checkout.
 */
const CART_KEY = "booksales_cart";

const CartContext = createContext(null);

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Simpan hanya data yang dibutuhkan tampilan keranjang.
const toLine = (book, quantity) => ({
  id: book.id,
  title: book.title,
  price: Number(book.price),
  stock: Number(book.stock),
  cover_photo: book.cover_photo ?? null,
  author: book.author?.name ?? "",
  quantity,
});

const clamp = (qty, stock) => Math.max(1, Math.min(qty, stock));

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* penyimpanan penuh / diblokir: keranjang tetap jalan selama tab terbuka */
    }
  }, [items]);

  // Saat pengguna keluar, keranjangnya dikosongkan agar tidak terbaca akun berikutnya.
  const hadUser = useRef(Boolean(user));
  useEffect(() => {
    if (hadUser.current && !user) setItems([]);
    hadUser.current = Boolean(user);
  }, [user]);

  const value = useMemo(() => {
    const add = (book, quantity = 1) => {
      if (Number(book.stock) < 1) return;

      setItems((list) => {
        const ada = list.find((l) => l.id === book.id);
        if (!ada) return [...list, toLine(book, clamp(quantity, Number(book.stock)))];
        return list.map((l) =>
          l.id === book.id
            ? { ...toLine(book, 0), quantity: clamp(l.quantity + quantity, Number(book.stock)) }
            : l
        );
      });
    };

    const setQuantity = (id, quantity) =>
      setItems((list) =>
        list.map((l) => (l.id === id ? { ...l, quantity: clamp(quantity, l.stock) } : l))
      );

    const remove = (id) => setItems((list) => list.filter((l) => l.id !== id));
    const clear = () => setItems([]);

    return {
      items,
      count: items.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: items.reduce((sum, l) => sum + l.price * l.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}

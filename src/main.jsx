import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { initFlowbite } from "flowbite";
import "./index.css";

// layouts
import PublicLayout from "./assets/layouts/public";
import AdminLayout from "./assets/layouts/admin";

// halaman publik
import Home from "./assets/pages/public/index";
import Books from "./assets/pages/public/books/index";
import ShowBook from "./assets/pages/public/books/show";

// halaman auth
import Login from "./assets/pages/auth/login";
import Register from "./assets/pages/auth/register";

// halaman admin
import Dashboard from "./assets/pages/admin/index";
import AdminBooks from "./assets/pages/admin/books/index";
import BookCreate from "./assets/pages/admin/books/create";
import AdminTransactions from "./assets/pages/admin/transactions/index";
import AdminGenres from "./assets/pages/admin/genres/index";
import GenreCreate from "./assets/pages/admin/genres/create";
import GenreEdit from "./assets/pages/admin/genres/edit";
import AdminAuthors from "./assets/pages/admin/authors/index";
import AuthorCreate from "./assets/pages/admin/authors/create";
import AuthorEdit from "./assets/pages/admin/authors/edit";

/**
 * Flowbite mengaktifkan dropdown / drawer / collapse dengan membaca atribut data-*
 * di HTML. Di React halaman berganti tanpa reload, jadi Flowbite harus
 * diaktifkan ulang setiap kali URL berubah.
 */
function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    initFlowbite();
  }, [pathname]);

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "books", element: <Books /> },
          { path: "books/:id", element: <ShowBook /> },
        ],
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "books", element: <AdminBooks /> },
          { path: "books/create", element: <BookCreate /> },
          { path: "transactions", element: <AdminTransactions /> },
          { path: "genres", element: <AdminGenres /> },
          { path: "genres/create", element: <GenreCreate /> },
          { path: "genres/:id/edit", element: <GenreEdit /> },
          { path: "authors", element: <AdminAuthors /> },
          { path: "authors/create", element: <AuthorCreate /> },
          { path: "authors/:id/edit", element: <AuthorEdit /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

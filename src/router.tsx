import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import DashboardPage from "@/pages/DashboardPage"
import KategoriPage from "@/pages/KategoriPage"
import BankPertanyaanPage from "@/pages/BankPertanyaan"
import RespondenPage from "@/pages/RespondenPage"
import HasilAnalisisPage from "@/pages/HasilAnalisisPage"
import LaporanPage from "./pages/LaporanPage"
import TindakLanjutPage from "./pages/TindakLanjutPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,     // ← Layout (sidebar, header, breadcrumbs)
        children: [
            {
                index: true,     // "/"
                element: <DashboardPage />,
            },
            {
                path: "kategori", // "/kategori"
                element: <KategoriPage />,
            },
            {
                path: "bank",
                element: <BankPertanyaanPage />,
            },
            {
                path: "responden",
                element: <RespondenPage />,
            },
            {
                path: "hasil",
                element: <HasilAnalisisPage />,
            },
            {
                path: "laporan",
                element: <LaporanPage />,
            },
            {
                path: "rtl",
                element: <TindakLanjutPage />,
            },

        ],
    },
])

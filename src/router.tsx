import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import DashboardPage from "@/pages/DashboardPage"
import KategoriPage from "@/pages/KategoriPage"
import PilihanPage from "@/pages/PilihanPage"
import BankPertanyaanPage from "@/pages/BankPertanyaanPage"
import ResponsePage from "@/pages/ResponsePage"
import ResponseDetailPage from "@/pages/ResponseDetailPage"
import HasilAnalisisPage from "@/pages/HasilAnalisisPage"
import LaporanPage from "@/pages/LaporanPage"
import TindakLanjutPage from "@/pages/TindakLanjutPage"
import BankPertanyaanTambahPage from "@/pages/BankPertanyaanTambahPage"
import BankPertanyaanTambahKategoriPage from "@/pages/BankPertanyaanTambahKategori"
import AuthLayout from "./components/layouts/AuthLayout"
import DashboardLayout from "./components/layouts/DashboardLayout"
import LoginPage from "./pages/auth/LoginPage"
import TipePilihanPage from "./pages/TipePilihanPage"

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            // ================= AUTH =================
            {
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <LoginPage />,
                    },
                ],
            },

            // ================= DASHBOARD =================
            {
                element: <DashboardLayout />,
                children: [
                    // {
                    //     index: true,
                    //     element: <DashboardPage />,
                    // },
                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "kategori",
                        element: <KategoriPage />,
                    },
                    {
                        path: "pilihan",
                        element: <PilihanPage />,
                    },
                    {
                        path: "tipe-pilihan",
                        element: <TipePilihanPage />,
                    },
                    {
                        path: "bank",
                        element: <BankPertanyaanPage />,
                    },
                    {
                        path: "bank/tambah-pertanyaan",
                        element: <BankPertanyaanTambahPage />,
                    },
                    {
                        path: "bank/tambah-kategori",
                        element: <BankPertanyaanTambahKategoriPage />,
                    },
                    {
                        path: "responden/response",
                        element: <ResponsePage />,
                    },
                    {
                        path: "responden/detail",
                        element: <ResponseDetailPage />,
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
        ],
    },
])

import { Outlet } from "react-router-dom"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "./components/ui/sidebar"
import { AppSidebar } from "./components/layout/AppSidebar"
import { AppBreadcrumbs } from "./components/AppBreadcrumbs"

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="h-14 border-b flex items-center gap-2 px-4">
                    <SidebarTrigger />
                    <AppBreadcrumbs />
                </header>

                <main className="p-6">
                    <Outlet /> {/* ← semua halaman muncul di sini */}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

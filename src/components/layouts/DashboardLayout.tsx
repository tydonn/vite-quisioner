import { Navigate, Outlet } from "react-router-dom"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/AppSidebar"
import { AppBreadcrumbs } from "@/components/AppBreadcrumbs"
import { LogoutDropdown } from "@/components/login/LogoutDropdown"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardLayout() {
    const { user, loading } = useAuth()

    if (loading) return <div>Loading...</div>

    // agar tidak bisa akses dashboard kalau belum login
    if (!user) return <Navigate to="/" replace />

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="h-14 border-b flex items-center gap-2 px-4">
                    <SidebarTrigger />
                    <AppBreadcrumbs />

                    {/* Spacer */}
                    <div className="flex-1" />

                    <LogoutDropdown />
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

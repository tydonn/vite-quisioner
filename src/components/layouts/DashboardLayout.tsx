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
import SpinnerForSideBar from "@/pages/SpinnerForSideBar"

export default function DashboardLayout() {
    const { user, loading } = useAuth()
    const rolesRaw =
        typeof window !== "undefined" ? localStorage.getItem("auth_roles") : null
    const programCode =
        typeof window !== "undefined"
            ? (localStorage.getItem("auth_program_code") ?? "")
            : ""
    const programName =
        typeof window !== "undefined"
            ? (localStorage.getItem("auth_program_name") ?? "")
            : ""

    const roles: string[] = (() => {
        if (!rolesRaw) return []
        try {
            const parsed = JSON.parse(rolesRaw) as unknown
            if (!Array.isArray(parsed)) return []
            return parsed.map((item) => String(item))
        } catch {
            return []
        }
    })()
    const isAdministrator = roles.some(
        (role) => role.toLowerCase() === "administrator"
    )
    const welcomeSuffix = isAdministrator
        ? "Administrator"
        : programName
            ? ` ${programName}`
            : programCode
                ? ` ${programCode}`
                : ""

    if (loading) return <SpinnerForSideBar />

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

                    <div className="hidden text-right md:block">
                        <p className="text-xs text-muted-foreground">
                            EDOM QUISIONER {welcomeSuffix}
                        </p>
                    </div>
                    <LogoutDropdown userName={user?.name} />
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

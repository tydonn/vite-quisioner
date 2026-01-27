import { Outlet } from "react-router-dom"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/AppSidebar"
import { AppBreadcrumbs } from "@/components/AppBreadcrumbs"
import { LogoutDropdown } from "@/components/login/LogoutDropdown"

export default function DashboardLayout() {
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

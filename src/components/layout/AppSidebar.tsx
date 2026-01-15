import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarHeader,
    SidebarFooter,
    SidebarSeparator,
    SidebarMenuAction,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Database,
    ClipboardList,
    Users,
    BarChart3,
    FileText,
    CheckCircle,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"

import { useState } from "react"
import {
    ChevronRight,
} from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import { Info } from "lucide-react"

import logoIcon from "@/assets/logo-icon.png"

export function AppSidebar() {
    const { pathname } = useLocation()
    const [openMaster, setOpenMaster] = useState(true)
    const { state } = useSidebar()

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            {/* ================= HEADER ================= */}
            <SidebarHeader>
                <div className="flex h-10 items-center gap-2 px-2 text-lg font-semibold">
                    <img
                        src={logoIcon}
                        alt="Quisioner Logo"
                        className="h-6 w-6 object-contain"
                    />

                    <span className="group-data-[collapsible=icon]:hidden">
                        Quisioner
                    </span>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            {/* ================= CONTENT ================= */}
            <SidebarContent>
                {/* ===== MENU UTAMA ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/"}
                                    tooltip="Dashboard"
                                >
                                    <Link to="/">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* ===== MASTER DATA ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem data-open={openMaster}>
                                <SidebarMenuButton
                                    onClick={() => setOpenMaster(!openMaster)}
                                    tooltip="Master Data"
                                >
                                    <Database />
                                    <span>Master Data</span>
                                </SidebarMenuButton>

                                {/* Arrow toggle */}
                                <SidebarMenuAction
                                    onClick={() => setOpenMaster(!openMaster)}
                                    showOnHover
                                >
                                    <ChevronRight
                                        className={`transition-transform ${openMaster ? "rotate-90" : ""
                                            }`}
                                    />
                                </SidebarMenuAction>

                                {/* Submenu */}
                                {openMaster && (
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={pathname === "/kategori"}
                                            >
                                                <Link to="/kategori">
                                                    <span>Kategori Pertanyaan</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>

                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={pathname === "/bank"}
                                            >
                                                <Link to="/bank">
                                                    <span>Bank Pertanyaan</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* ===== DATA ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/responden"}
                                    tooltip="Responden"
                                >
                                    <Link to="/responden">
                                        <Users />
                                        <span>Responden</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/hasil"}
                                    tooltip="Hasil & Analisis"
                                >
                                    <Link to="/hasil">
                                        <BarChart3 />
                                        <span>Hasil & Analisis</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* ===== OUTPUT ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>Output</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/laporan"}
                                    tooltip="Laporan"
                                >
                                    <Link to="/laporan">
                                        <FileText />
                                        <span>Laporan</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/rtl"}
                                    tooltip="Tindak Lanjut"
                                >
                                    <Link to="/rtl">
                                        <CheckCircle />
                                        <span>Tindak Lanjut</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* ================= FOOTER ================= */}
            <SidebarFooter>
                {/* <div className="px-2 text-xs text-muted-foreground">
                    v1.0 • Quisioner Admin
                </div> */}
                <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
                    <Info className="size-4 shrink-0" />

                    {state === "expanded" && (
                        <span>v1.0 • Quisioner Admin</span>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

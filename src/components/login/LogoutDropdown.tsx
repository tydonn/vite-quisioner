import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"

export function LogoutDropdown() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            // 🔐 revoke token di backend
            await api.post("/logout")
        } catch (error) {
            // kalau token sudah expired / invalid, tidak masalah
            console.error("Logout error:", error)
        } finally {
            // 🧹 bersihkan client state
            localStorage.removeItem("token")
            localStorage.removeItem("user")

            // 🔁 balik ke login
            navigate("/", { replace: true })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <UserIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

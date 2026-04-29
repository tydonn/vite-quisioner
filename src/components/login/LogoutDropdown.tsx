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
    UserIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"

type LogoutDropdownProps = {
    userName?: string
}

export function LogoutDropdown({ userName }: LogoutDropdownProps) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await api.post("/logout")
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("auth_roles")
            localStorage.removeItem("auth_program_code")
            localStorage.removeItem("auth_program_name")
            localStorage.removeItem("auth_meta_source")
            navigate("/", { replace: true })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full px-3">
                    <UserIcon className="h-4 w-4" />

                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    {userName ? (
                        <span>
                            {userName}
                        </span>
                    ) : null}
                </DropdownMenuItem>

                {/* <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem> */}

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

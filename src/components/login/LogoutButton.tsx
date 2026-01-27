import { useNavigate } from "react-router-dom"
import { logout } from "@/services/auth"

export function LogoutButton() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}

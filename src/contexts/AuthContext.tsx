import { createContext, useContext, useEffect, useState } from "react"
import api from "@/lib/api"

type User = {
    id: number
    name: string
    email: string
}

type AuthContextType = {
    user: User | null
    loading: boolean
    fetchUser: () => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const res = await api.get("/me")
            setUser(res.data.user)
        } catch (error) {
            setUser(null)
            localStorage.removeItem("token")
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth harus digunakan di dalam AuthProvider")
    }
    return context
}

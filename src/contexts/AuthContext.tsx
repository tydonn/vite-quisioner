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
    fetchUser: () => Promise<boolean>
    setAuthenticatedUser: (user: User | null) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async (): Promise<boolean> => {
        try {
            const res = await api.get("/me")

            // Support common response shapes:
            // { user }, { data: { user } }, or { data: user }
            const resolvedUser =
                res.data?.user ??
                res.data?.data?.user ??
                res.data?.data ??
                null

            if (!resolvedUser) {
                throw new Error("User tidak ditemukan pada response /me")
            }

            setUser(resolvedUser)
            return true
        } catch (error) {
            setUser(null)
            localStorage.removeItem("token")
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const setAuthenticatedUser = (nextUser: User | null) => {
        setUser(nextUser)
        setLoading(false)
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
        <AuthContext.Provider
            value={{ user, loading, fetchUser, setAuthenticatedUser, logout }}
        >
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

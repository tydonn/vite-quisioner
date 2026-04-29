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

    const normalizeRoles = (value: unknown): string[] => {
        if (Array.isArray(value)) {
            return value.map((item) => String(item))
        }
        if (typeof value === "string" && value.trim()) {
            return [value.trim()]
        }
        return []
    }

    const syncAuthMetaFromPayload = (payload: unknown) => {
        const record =
            payload && typeof payload === "object"
                ? (payload as Record<string, unknown>)
                : {}

        const rolesFromRoot = normalizeRoles(record.roles)
        const data = record.data && typeof record.data === "object"
            ? (record.data as Record<string, unknown>)
            : null
        const userRecord = record.user && typeof record.user === "object"
            ? (record.user as Record<string, unknown>)
            : null
        const dataUserRecord = data?.user && typeof data.user === "object"
            ? (data.user as Record<string, unknown>)
            : null

        const rolesFromData = normalizeRoles(data?.roles)
        const rolesFromUser = normalizeRoles(userRecord?.roles)
        const rolesFromDataUser = normalizeRoles(dataUserRecord?.roles)

        const roles =
            rolesFromRoot.length > 0
                ? rolesFromRoot
                : rolesFromData.length > 0
                    ? rolesFromData
                    : rolesFromUser.length > 0
                        ? rolesFromUser
                        : rolesFromDataUser
        localStorage.setItem("auth_roles", JSON.stringify(roles))

        const programCodeCandidate =
            record.program_code ??
            data?.program_code ??
            userRecord?.program_code ??
            dataUserRecord?.program_code ??
            ""
        const programNameCandidate =
            record.program_name ??
            data?.program_name ??
            userRecord?.program_name ??
            dataUserRecord?.program_name ??
            ""

        localStorage.setItem("auth_program_code", String(programCodeCandidate || ""))
        localStorage.setItem("auth_program_name", String(programNameCandidate || ""))
    }

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
            syncAuthMetaFromPayload(res.data)
            return true
        } catch (error) {
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("auth_roles")
            localStorage.removeItem("auth_program_code")
            localStorage.removeItem("auth_program_name")
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("auth_roles")
        localStorage.removeItem("auth_program_code")
        localStorage.removeItem("auth_program_name")
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

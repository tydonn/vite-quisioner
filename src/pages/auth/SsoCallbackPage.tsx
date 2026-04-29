import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import type { AxiosError } from "axios"

import api from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/AuthContext"

type SsoExchangeResponse = {
    success?: boolean
    access_token?: string
    token?: string
    program_code?: string
    program_name?: string
    roles?: string[]
    user?: {
        id: number
        name: string
        email: string
    }
    data?: {
        access_token?: string
        token?: string
        program_code?: string
        program_name?: string
        roles?: string[]
        user?: {
            id: number
            name: string
            email: string
        }
    }
}

export default function SsoCallbackPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { fetchUser, setAuthenticatedUser } = useAuth()
    const [errorMessage, setErrorMessage] = useState("")
    const [isProcessing, setIsProcessing] = useState(true)

    useEffect(() => {
        async function exchangeWithFallback(code: string) {
            try {
                return await api.post<SsoExchangeResponse>("/sso/exchange", { code })
            } catch (error) {
                const status = (error as AxiosError).response?.status
                // Some backends use `sso_code` instead of `code`.
                if (status === 400 || status === 422) {
                    return api.post<SsoExchangeResponse>("/sso/exchange", {
                        sso_code: code,
                    })
                }
                throw error
            }
        }

        async function exchangeCode() {
            const code = (searchParams.get("code") ?? "").trim()

            if (!code) {
                setErrorMessage("Kode SSO tidak ditemukan.")
                setIsProcessing(false)
                return
            }

            try {
                const res = await exchangeWithFallback(code)
                const token =
                    res.data?.access_token ??
                    res.data?.token ??
                    res.data?.data?.access_token ??
                    res.data?.data?.token

                if (!token) {
                    throw new Error("Token hasil SSO tidak ditemukan.")
                }

                localStorage.setItem("token", token)
                const roles = res.data?.roles ?? res.data?.data?.roles ?? []
                const programCode =
                    res.data?.program_code ?? res.data?.data?.program_code ?? ""
                const programName =
                    res.data?.program_name ?? res.data?.data?.program_name ?? ""
                localStorage.setItem("auth_roles", JSON.stringify(roles))
                localStorage.setItem("auth_program_code", String(programCode || ""))
                localStorage.setItem("auth_program_name", String(programName || ""))

                const exchangeUser = res.data?.user ?? res.data?.data?.user ?? null
                if (exchangeUser) {
                    setAuthenticatedUser(exchangeUser)
                }

                navigate("/dashboard", { replace: true })

                // Verify session/profile in background.
                fetchUser().catch((verifyError) => {
                    console.error("Validasi /me setelah SSO gagal", verifyError)
                })
            } catch (error) {
                const axiosError = error as AxiosError<{
                    message?: string
                    error?: string
                }>
                const backendMessage =
                    axiosError.response?.data?.message ??
                    axiosError.response?.data?.error

                console.error("SSO exchange gagal", {
                    error,
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                })
                setErrorMessage(
                    backendMessage || "SSO gagal. Kode tidak valid, kedaluwarsa, atau endpoint tidak cocok."
                )
                setIsProcessing(false)
            }
        }

        exchangeCode()
    }, [fetchUser, navigate, searchParams])

    return (
        <div className="w-full rounded-xl border bg-background p-6 text-center shadow-sm">
            {errorMessage && !isProcessing ? (
                <div className="space-y-3">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                        Kembali ke Login
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="size-4" />
                    <span>Memproses login SSO...</span>
                </div>
            )}
        </div>
    )
}

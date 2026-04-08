import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    HelpCircle,
    Layers,
    BarChart3,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import api from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

type StatItem = {
    title: string
    value: ReactNode
    description?: string
    icon: React.ElementType
    badge?: {
        label: string
        variant?: "default" | "secondary" | "destructive"
    }
}

export function StatCards() {
    const [totalResponden, setTotalResponden] = useState<number | null>(null)
    const [isLoadingTotal, setIsLoadingTotal] = useState(true)
    const [totalPertanyaan, setTotalPertanyaan] = useState<number | null>(null)
    const [isLoadingPertanyaan, setIsLoadingPertanyaan] = useState(true)
    const [totalKategoriAktif, setTotalKategoriAktif] = useState<number | null>(
        null
    )
    const [isLoadingKategori, setIsLoadingKategori] = useState(true)
    const [tingkatKepuasan, setTingkatKepuasan] = useState<number | null>(null)
    const [isLoadingKepuasan, setIsLoadingKepuasan] = useState(true)

    const extractNumber = (payload: unknown): number | null => {
        if (typeof payload === "number" && !Number.isNaN(payload)) return payload
        if (!payload || typeof payload !== "object") return null

        const data = payload as {
            count?: unknown
            total?: unknown
            value?: unknown
            percentage?: unknown
            percent?: unknown
            respondents?: unknown
            data?: unknown
        }

        const candidates = [
            data.count,
            data.total,
            data.value,
            data.percentage,
            data.percent,
            data.respondents,
        ]
        for (const candidate of candidates) {
            const num = Number(candidate)
            if (!Number.isNaN(num)) return num
        }

        if (data.data) {
            return extractNumber(data.data)
        }

        return null
    }

    useEffect(() => {
        async function fetchTotalResponden() {
            setIsLoadingTotal(true)
            try {
                const res = await api.get("/responses/count-respondents")
                setTotalResponden(extractNumber(res.data))
            } catch (error) {
                console.error("Gagal mengambil total responden", error)
                setTotalResponden(null)
            } finally {
                setIsLoadingTotal(false)
            }
        }

        fetchTotalResponden()
    }, [])

    useEffect(() => {
        async function fetchTotalPertanyaan() {
            setIsLoadingPertanyaan(true)
            try {
                const res = await api.get("/questions/count", {
                    params: {
                        active: 1,
                    },
                })
                setTotalPertanyaan(extractNumber(res.data))
            } catch (error) {
                console.error("Gagal mengambil total pertanyaan", error)
                setTotalPertanyaan(null)
            } finally {
                setIsLoadingPertanyaan(false)
            }
        }

        fetchTotalPertanyaan()
    }, [])

    useEffect(() => {
        async function fetchTotalKategoriAktif() {
            setIsLoadingKategori(true)
            try {
                const res = await api.get("/categories/count", {
                    params: {
                        active: 1,
                    },
                })
                setTotalKategoriAktif(extractNumber(res.data))
            } catch (error) {
                console.error("Gagal mengambil total kategori aktif", error)
                setTotalKategoriAktif(null)
            } finally {
                setIsLoadingKategori(false)
            }
        }

        fetchTotalKategoriAktif()
    }, [])

    useEffect(() => {
        async function fetchTingkatKepuasan() {
            setIsLoadingKepuasan(true)
            try {
                const res = await api.get("/response-details/satisfaction-labels")
                const value = extractNumber(res.data)
                setTingkatKepuasan(value)
            } catch (error) {
                console.error("Gagal mengambil tingkat kepuasan", error)
                setTingkatKepuasan(null)
            } finally {
                setIsLoadingKepuasan(false)
            }
        }

        fetchTingkatKepuasan()
    }, [])


    const stats: StatItem[] = [
        {
            title: "Total Responden",
            value: isLoadingTotal ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Spinner className="size-4" />
                    Memuat...
                </span>
            ) : (
                totalResponden ?? "-"
            ),
            description: "Responden terdaftar",
            icon: Users,
            badge: {
                label: "Stabil",
                variant: "default",
            },
        },
        {
            title: "Total Pertanyaan",
            value: isLoadingPertanyaan ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Spinner className="size-4" />
                    Memuat...
                </span>
            ) : (
                totalPertanyaan ?? "-"
            ),
            description: "Bank pertanyaan aktif",
            icon: HelpCircle,
        },
        {
            title: "Kategori Aktif",
            value: isLoadingKategori ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Spinner className="size-4" />
                    Memuat...
                </span>
            ) : (
                totalKategoriAktif ?? "-"
            ),
            description: "Kategori digunakan",
            icon: Layers,
        },
        {
            title: "Tingkat Kepuasan",
            value: isLoadingKepuasan ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Spinner className="size-4" />
                    Memuat...
                </span>
            ) : (
                tingkatKepuasan === null ? "-" : `${tingkatKepuasan}%`
            ),
            description: "Persentase kepuasan",
            icon: BarChart3,
            badge: {
                label: "Baik",
                variant: "secondary",
            },
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon

                return (
                    <Card key={stat.title} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>

                                {stat.badge && (
                                    <Badge variant={stat.badge.variant}>
                                        {stat.badge.label}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

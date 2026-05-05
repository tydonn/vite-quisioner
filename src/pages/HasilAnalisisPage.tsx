import { useEffect, useMemo, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import type { ResponseFilterProdiOption } from "@/features/response/types"

import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"

type ProdiOption = {
    id: string
    nama: string
}

type ResultByDosenItem = {
    tahun_akademik?: string | number
    TahunAkademik?: string | number
    prodi?: {
        ProdiID?: string | number
        Nama?: string
    }
    dosen?: {
        Login?: string | number
        Nama?: string
    }
    averagetypequestion?: {
        Assurance?: number
        Empathy?: number
        Reliability?: number
        Responsiveness?: number
        Tangibles?: number
        AvarageTotal?: number
    }
}

type ResultByDosenResponse = {
    success?: boolean
    data?: ResultByDosenItem[]
    pagination?: {
        current_page?: number
        per_page?: number
        total?: number
        last_page?: number
    }
}

function normalizeProdiOption(item: ResponseFilterProdiOption): ProdiOption | null {
    const rawId = item.ProdiID
    const rawNama = item.Nama
    if (!rawId || !rawNama) return null

    return {
        id: String(rawId),
        nama: String(rawNama),
    }
}

function parseRoles(raw: string | null): string[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item))
        }
        if (typeof parsed === "string" && parsed.trim()) {
            return [parsed.trim()]
        }
        return []
    } catch {
        return raw.trim() ? [raw.trim()] : []
    }
}

function formatNumber(value: number | undefined): string {
    if (value === undefined || value === null || Number.isNaN(value)) return "-"
    return value.toFixed(2)
}

export default function HasilAnalisisPage() {
    const storedRolesRaw =
        typeof window !== "undefined"
            ? localStorage.getItem("auth_roles")
            : null
    const storedProgramCode =
        typeof window !== "undefined"
            ? (localStorage.getItem("auth_program_code") ?? "")
            : ""
    const storedRoles = parseRoles(storedRolesRaw)
    const isAdministrator = storedRoles.some(
        (role) => role.toLowerCase() === "administrator"
    )

    const [allData, setAllData] = useState<ResultByDosenItem[]>([])
    const [loading, setLoading] = useState(true)
    const [prodiInput, setProdiInput] = useState("")
    const [prodiQuery, setProdiQuery] = useState("")
    const [prodiSearch, setProdiSearch] = useState("")
    const [tahunAkademikInput, setTahunAkademikInput] = useState("")
    const [prodiFilter, setProdiFilter] = useState("")
    const [tahunAkademikFilter, setTahunAkademikFilter] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [prodiOptions, setProdiOptions] = useState<ProdiOption[]>([])
    const [isProdiOpen, setIsProdiOpen] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isProdiLoading, setIsProdiLoading] = useState(false)
    const [isPaging, setIsPaging] = useState(false)
    const [hasAppliedFilter, setHasAppliedFilter] = useState(false)

    useEffect(() => {
        if (!hasAppliedFilter) {
            setAllData([])
            setLoading(false)
            return
        }

        async function fetchData() {
            setLoading(true)
            try {
                const res = await api.get<ResultByDosenResponse>(
                    "/response-details/result-by-dosen",
                    {
                        params: {
                            prodi_id:
                                (isAdministrator ? prodiFilter : storedProgramCode) || undefined,
                            tahun_akademik: tahunAkademikFilter || undefined,
                        },
                    }
                )

                const rows = Array.isArray(res.data?.data) ? res.data.data : []
                setAllData(rows)
            } catch (error) {
                console.error("Gagal mengambil data hasil analisis", error)
                setAllData([])
                setLastPage(1)
                setTotal(0)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [hasAppliedFilter, prodiFilter, tahunAkademikFilter, isAdministrator, storedProgramCode])

    useEffect(() => {
        const nextTotal = allData.length
        const nextLastPage = Math.max(1, Math.ceil(nextTotal / perPage))
        setTotal(nextTotal)
        setLastPage(nextLastPage)
        setPage((prev) => Math.min(prev, nextLastPage))
    }, [allData, perPage])

    useEffect(() => {
        if (!loading) {
            setIsFiltering(false)
            setIsPaging(false)
        }
    }, [loading])

    useEffect(() => {
        if (!isAdministrator) {
            setIsProdiOpen(false)
        }
    }, [isAdministrator])

    useEffect(() => {
        if (!isAdministrator) return

        async function fetchProdiOptions() {
            setIsProdiLoading(true)
            try {
                const res = await api.get<{ data?: ResponseFilterProdiOption[] }>(
                    "/responses/filter-options/prodi",
                    {
                        params: {
                            tahun_akademik: tahunAkademikInput || undefined,
                            q: prodiQuery || undefined,
                        },
                    }
                )
                const options = (res.data.data ?? [])
                    .map(normalizeProdiOption)
                    .filter((item): item is ProdiOption => item !== null)
                setProdiOptions(options)
            } catch (error) {
                console.error("Gagal mengambil opsi prodi", error)
            } finally {
                setIsProdiLoading(false)
            }
        }

        fetchProdiOptions()
    }, [tahunAkademikInput, prodiSearch, isAdministrator, prodiQuery])

    const selectedProdi = prodiOptions.find((item) => item.id === prodiInput)
    const selectedProdiLabel = selectedProdi
        ? `${selectedProdi.id} - ${selectedProdi.nama}`
        : "All Prodi"

    const isFilterReady = Boolean(
        isAdministrator ? prodiInput && tahunAkademikInput : tahunAkademikInput
    )
    const hasActiveFilter = Boolean(
        prodiInput ||
        prodiQuery ||
        tahunAkademikInput ||
        prodiFilter ||
        tahunAkademikFilter
    )
    const data = useMemo(() => {
        const start = (page - 1) * perPage
        const end = start + perPage
        return allData.slice(start, end)
    }, [allData, page, perPage])

    if (loading) {
        return <SpinnerPage />
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Hasil & Analisis</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {isAdministrator && (
                    <div className="relative w-56">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 w-full justify-start truncate"
                            onClick={() => setIsProdiOpen((prev) => !prev)}
                            title={selectedProdiLabel}
                        >
                            {selectedProdiLabel}
                        </Button>
                        {isProdiOpen && (
                            <div className="absolute z-20 mt-1 w-full rounded-md border bg-background p-2 shadow-md">
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Cari Prodi..."
                                        value={prodiQuery}
                                        onChange={(e) => setProdiQuery(e.target.value)}
                                        className="h-8"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-8 px-2"
                                        disabled={isProdiLoading}
                                        onClick={() => setProdiSearch(prodiQuery)}
                                    >
                                        {isProdiLoading ? (
                                            <span className="inline-flex items-center gap-2">
                                                <Spinner className="size-4" />
                                                Search
                                            </span>
                                        ) : (
                                            "Search"
                                        )}
                                    </Button>
                                </div>
                                <div className="mt-2 max-h-56 overflow-y-auto">
                                    <button
                                        type="button"
                                        className="w-full rounded px-2 py-1 text-left text-sm hover:bg-muted"
                                        onClick={() => {
                                            setProdiInput("")
                                            setIsProdiOpen(false)
                                        }}
                                    >
                                        All Prodi
                                    </button>
                                    {prodiOptions.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className="w-full rounded px-2 py-1 text-left text-sm hover:bg-muted"
                                            onClick={() => {
                                                setProdiInput(item.id)
                                                setIsProdiOpen(false)
                                            }}
                                        >
                                            {item.id} - {item.nama}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <Input
                    placeholder="Filter Tahun Akademik..."
                    value={tahunAkademikInput}
                    onChange={(e) => setTahunAkademikInput(e.target.value)}
                    className="max-w-40 shadow-sm"
                />

                <div className="ml-auto flex items-center gap-3">
                    <Button
                        disabled={!isFilterReady}
                        onClick={() => {
                            setIsFiltering(true)
                            setHasAppliedFilter(true)
                            setProdiFilter(isAdministrator ? prodiInput : storedProgramCode)
                            setTahunAkademikFilter(tahunAkademikInput)
                            setPage(1)
                        }}
                    >
                        {isFiltering ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Memfilter...
                            </span>
                        ) : (
                            "Filter"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!hasActiveFilter}
                        onClick={() => {
                            setProdiInput("")
                            setProdiQuery("")
                            setProdiSearch("")
                            setTahunAkademikInput("")
                            setProdiFilter("")
                            setTahunAkademikFilter("")
                            setHasAppliedFilter(false)
                            setPage(1)
                            setIsProdiOpen(false)
                        }}
                    >
                        Reset Filter
                    </Button>

                </div>
            </div>

            <div className="border rounded-lg shadow-sm">
                {!hasAppliedFilter ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        Mohon isi filter terlebih dahulu
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tahun Akademik</TableHead>
                                <TableHead>Prodi</TableHead>
                                <TableHead>Dosen</TableHead>
                                <TableHead>Assurance</TableHead>
                                <TableHead>Empathy</TableHead>
                                <TableHead>Reliability</TableHead>
                                <TableHead>Responsiveness</TableHead>
                                <TableHead>Tangibles</TableHead>
                                <TableHead>Rata-Rata Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, idx) => (
                                <TableRow key={`${row.dosen?.Login ?? "dosen"}-${idx}`}>
                                    <TableCell className="py-3">
                                        {row.TahunAkademik
                                            ? String(row.TahunAkademik)
                                            : row.tahun_akademik
                                                ? String(row.tahun_akademik)
                                                : "-"}
                                    </TableCell>
                                    <TableCell className="max-w-40 whitespace-normal py-3">
                                        <div>{row.prodi?.ProdiID ? String(row.prodi.ProdiID) : "-"}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.prodi?.Nama ?? "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-40 whitespace-normal py-3">
                                        <div>{row.dosen?.Login ? String(row.dosen.Login) : "-"}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.dosen?.Nama ?? "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {formatNumber(row.averagetypequestion?.Assurance)}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {formatNumber(row.averagetypequestion?.Empathy)}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {formatNumber(row.averagetypequestion?.Reliability)}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {formatNumber(row.averagetypequestion?.Responsiveness)}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {formatNumber(row.averagetypequestion?.Tangibles)}
                                    </TableCell>
                                    <TableCell className="py-3 font-medium">
                                        {formatNumber(row.averagetypequestion?.AvarageTotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Per halaman</span>
                    <select
                        className="rounded border px-2 py-1"
                        value={perPage}
                        onChange={(e) => {
                            setIsPaging(true)
                            setPerPage(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>Total {total}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setIsPaging(true)
                            setPage((prev) => Math.max(1, prev - 1))
                        }}
                        disabled={page <= 1}
                    >
                        {isPaging ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Sebelumnya
                            </span>
                        ) : (
                            "Sebelumnya"
                        )}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Halaman {page} / {lastPage}
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setIsPaging(true)
                            setPage((prev) => Math.min(lastPage, prev + 1))
                        }}
                        disabled={page >= lastPage}
                    >
                        {isPaging ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Berikutnya
                            </span>
                        ) : (
                            "Berikutnya"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

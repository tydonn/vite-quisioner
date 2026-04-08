import { useEffect, useState } from "react"

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

import type {
    ResponseFilterProdiOption,
    ResponseListResponse,
} from "@/features/response/types"
import type { ResponseView } from "@/features/response/view-types"
import { mapResponseListToView } from "@/features/response/mapper"

import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"

type ProdiOption = {
    id: string
    nama: string
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

export default function ResponsePage() {
    const [data, setData] = useState<ResponseView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
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
    const [isDownloading, setIsDownloading] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isProdiLoading, setIsProdiLoading] = useState(false)
    const [isPaging, setIsPaging] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = await api.get<ResponseListResponse>("/responses", {
                    params: {
                        page,
                        per_page: perPage,
                        prodi_id: prodiFilter || undefined,
                        tahun_akademik: tahunAkademikFilter || undefined,
                        include_total: true,
                    },
                })
                setData(mapResponseListToView(res.data.data))
                const lastPageValue = res.data.pagination.last_page
                const totalValue = res.data.pagination.total
                if (lastPageValue !== null && lastPageValue !== undefined) {
                    setLastPage(lastPageValue)
                }
                if (totalValue !== null && totalValue !== undefined) {
                    setTotal(totalValue)
                }
            } catch (error) {
                console.error("Gagal mengambil data response", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage, prodiFilter, tahunAkademikFilter])

    useEffect(() => {
        if (!loading) {
            setIsFiltering(false)
            setIsPaging(false)
        }
    }, [loading])

    useEffect(() => {
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
    }, [tahunAkademikInput, prodiSearch])

    if (loading) {
        return <SpinnerPage />
    }

    const filtered = data.filter(
        (item) =>
            item.mahasiswaId.toLowerCase().includes(search.toLowerCase()) ||
            item.dosenId.toLowerCase().includes(search.toLowerCase()) ||
            item.dosenNama.toLowerCase().includes(search.toLowerCase()) ||
            item.matakuliahId.toLowerCase().includes(search.toLowerCase()) ||
            item.matakuliahKode.toLowerCase().includes(search.toLowerCase()) ||
            item.prodiNama.toLowerCase().includes(search.toLowerCase()) ||
            item.semester.toLowerCase().includes(search.toLowerCase())
    )

    const selectedProdi = prodiOptions.find((item) => item.id === prodiInput)

    const selectedProdiLabel = selectedProdi
        ? `${selectedProdi.id} - ${selectedProdi.nama}`
        : "All Prodi"

    const isFilterReady = Boolean(
        prodiInput && tahunAkademikInput
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Response</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Cari response..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-40 whitespace-nowrap break-words shadow-sm"
                />
                <div className="relative w-56">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-full justify-start truncate"
                        onClick={() => {
                            setIsProdiOpen((prev) => !prev)
                        }}
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
                                    onClick={() => {
                                        setProdiSearch(prodiQuery)
                                    }}
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
                            setProdiFilter(prodiInput)
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
                        variant="outline"
                        disabled={isDownloading || !isFilterReady}
                        onClick={async () => {
                            const ok = window.confirm(
                                "Download response detail sesuai filter?"
                            )
                            if (!ok) return

                            setIsDownloading(true)
                            try {
                                const prodiId = selectedProdi?.id
                                const res = await api.get("/response-details/download", {
                                    responseType: "blob",
                                    params: {
                                        tahun_akademik: tahunAkademikInput || undefined,
                                        prodi_id: prodiId || undefined,
                                    },
                                })

                                const contentType =
                                    (res.headers?.["content-type"] as string | undefined) ??
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                const blob = new Blob([res.data], { type: contentType })
                                const url = URL.createObjectURL(blob)
                                const link = document.createElement("a")
                                const timestamp = new Date()
                                    .toISOString()
                                    .slice(0, 19)
                                    .replace(/[:T]/g, "-")
                                const safe = (value?: string) =>
                                    (value ?? "")
                                        .toString()
                                        .trim()
                                        .replace(/[^a-zA-Z0-9-_]+/g, "-")
                                        .replace(/-+/g, "-")
                                        .replace(/^-|-$/g, "")
                                const prodiSlug = safe(prodiId)
                                const tahunSlug = safe(tahunAkademikInput)
                                const nameParts = [
                                    "response-detail",
                                    tahunSlug && `tahun-${tahunSlug}`,
                                    prodiSlug && `prodi-${prodiSlug}`,
                                ].filter(Boolean) as string[]
                                const baseName = nameParts.join("_")
                                link.href = url
                                link.download = `${baseName || "response-detail"}_${timestamp}.xlsx`
                                link.click()
                                URL.revokeObjectURL(url)
                            } catch (err) {
                                const error = err as {
                                    response?: { status?: number; data?: unknown }
                                }
                                console.error("Gagal export response detail", err)
                                console.error("Status", error.response?.status)
                                console.error("Response data", error.response?.data)
                            } finally {
                                setIsDownloading(false)
                            }
                        }}
                    >
                        {isDownloading ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Mendownload...
                            </span>
                        ) : (
                            "Download Detail"
                        )}
                    </Button>
                </div>

            </div>

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Respon ID</TableHead>
                            <TableHead>Mahasiswa</TableHead>
                            <TableHead>Dosen</TableHead>
                            <TableHead>Matakuliah</TableHead>
                            <TableHead>Prodi</TableHead>
                            <TableHead>Tahun Akademik</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Dibuat</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium py-3">
                                    {row.id}
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    <div>{row.mahasiswaId}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {row.mahasiswaNama}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    <div>{row.dosenId}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {row.dosenNama}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    <div>{row.matakuliahKode !== "-" ? row.matakuliahKode : row.matakuliahId}</div>
                                    <div className="text-xs text-muted-foreground break-words py-1">
                                        {row.matakuliahNama}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    {row.prodiNama}
                                </TableCell>
                                <TableCell className="py-3">{row.tahunAkademik}</TableCell>
                                <TableCell className="py-3">{row.semester}</TableCell>
                                <TableCell className="py-3">{row.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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

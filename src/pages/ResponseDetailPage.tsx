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

import type { ResponseDetailListResponse } from "@/features/response-detail/types"
import type { ResponseDetailView } from "@/features/response-detail/view-types"
import { mapResponseDetailListToView } from "@/features/response-detail/mapper"

import api from "@/lib/api"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

function getJawabanClassName(value: string) {
    const normalized = value.toLowerCase()
    if (normalized.includes("sangat puas")) {
        return "bg-emerald-100 text-emerald-700"
    }
    if (normalized.includes("tidak puas")) {
        return "bg-rose-100 text-rose-700"
    }
    if (normalized.includes("kurang puas")) {
        return "bg-orange-100 text-orange-700"
    }
    if (normalized.includes("cukup puas")) {
        return "bg-lime-100 text-lime-700"
    }
    if (normalized.includes("puas")) {
        return "bg-green-100 text-green-700"
    }

    return "bg-muted text-foreground"
}

export default function ResponseDetailPage() {
    const [data, setData] = useState<ResponseDetailView[]>([])
    const [loading, setLoading] = useState(true)
    const [tahunAkademikInput, setTahunAkademikInput] = useState("")
    const [prodiInput, setProdiInput] = useState("")
    const [tahunAkademikFilter, setTahunAkademikFilter] = useState("")
    const [prodiFilter, setProdiFilter] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = await api.get<ResponseDetailListResponse>("/response-details", {
                    params: {
                        page,
                        per_page: perPage,
                        tahun_akademik: tahunAkademikFilter || undefined,
                        nama_prodi: prodiFilter || undefined,
                    },
                })
                setData(mapResponseDetailListToView(res.data.data))
                setLastPage(res.data.pagination.last_page)
                setTotal(res.data.pagination.total)
            } catch (error) {
                console.error("Gagal mengambil data response detail", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage, tahunAkademikFilter, prodiFilter])

    if (loading) {
        return <div>Loading...</div>
    }

    const filtered = data

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Response Detail</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Filter Tahun Akademik..."
                    value={tahunAkademikInput}
                    onChange={(e) => setTahunAkademikInput(e.target.value)}
                    className="max-w-sm shadow-sm"
                />
                <Input
                    placeholder="Filter Prodi..."
                    value={prodiInput}
                    onChange={(e) => setProdiInput(e.target.value)}
                    className="max-w-sm shadow-sm"
                />
                <div className="ml-auto flex items-center gap-3">
                    <Button
                        onClick={() => {
                            setTahunAkademikFilter(tahunAkademikInput)
                            setProdiFilter(prodiInput)
                            setPage(1)
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        disabled={isDownloading}
                        onClick={async () => {
                            const ok = window.confirm(
                                "Download data hasil filter ke Excel?"
                            )
                            if (!ok) return

                            setIsDownloading(true)
                            try {
                                const res = await api.get("/response-details/download", {
                                    params: {
                                        tahun_akademik: tahunAkademikFilter || undefined,
                                        nama_prodi: prodiFilter || undefined,
                                    },
                                    responseType: "blob",
                                })

                                const contentType =
                                    (res.headers?.["content-type"] as string | undefined) ??
                                    "application/octet-stream"
                                const extension = contentType.includes("csv") ? "csv" : "xlsx"
                                const blob = new Blob([res.data], { type: contentType })
                                const url = URL.createObjectURL(blob)
                                const link = document.createElement("a")
                                const timestamp = new Date()
                                    .toISOString()
                                    .slice(0, 19)
                                    .replace(/[:T]/g, "-")
                                link.href = url
                                link.download = `response-detail-${timestamp}.${extension}`
                                link.click()
                                URL.revokeObjectURL(url)
                            } finally {
                                setIsDownloading(false)
                            }
                        }}
                    >
                        {isDownloading ? "Mendownload..." : "Download Excel"}
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Respon ID</TableHead>
                            <TableHead>Mahasiswa ID</TableHead>
                            <TableHead>Dosen ID</TableHead>
                            <TableHead>Matakuliah ID</TableHead>
                            <TableHead>Prodi</TableHead>
                            <TableHead>Tahun Akademik</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead className="shrink-0">Jawaban</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium py-3">
                                    {row.responId}
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    <div>{row.mahasiswaId}</div>
                                    <div className="text-xs text-muted-foreground break-words">
                                        {row.mahasiswaNama}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-40 whitespace-normal py-3">
                                    <div>{row.dosenId}</div>
                                    <div className="text-xs text-muted-foreground break-words">
                                        {row.dosenNama}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 max-w-40 whitespace-normal">
                                    <div>{row.matakuliahId}</div>
                                    <div className="text-xs text-muted-foreground break-words">
                                        {row.matakuliahNama}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 max-w-40 whitespace-normal break-words">
                                    {row.prodiNama}
                                </TableCell>
                                <TableCell className="py-3">{row.tahunAkademik}</TableCell>
                                <TableCell className="py-3">{row.semester}</TableCell>
                                <TableCell className="max-w-64 truncate py-3">
                                    {row.pertanyaan}
                                </TableCell>
                                <TableCell className="max-w-40 py-3 whitespace-normal break-words shrink-0">
                                    {row.jawabanTampil === row.jawabanLabel &&
                                        row.jawabanLabel !== "-" ? (
                                        <span
                                            className={`inline-flex max-w-sm items-center text-center whitespace-normal break-words rounded-md px-2 py-1 text-xs font-medium ${getJawabanClassName(
                                                row.jawabanTampil
                                            )}`}
                                        >
                                            {row.jawabanTampil}
                                        </span>
                                    ) : (
                                        <span className="max-w-sm text-xs text-muted-foreground whitespace-normal break-words">
                                            {row.jawabanTampil}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Per Halaman</span>
                    <select
                        className="rounded border px-2 py-1"
                        value={perPage}
                        onChange={(e) => {
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
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page <= 1}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        {page} of {lastPage}
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setPage((prev) => Math.min(lastPage, prev + 1))
                        }
                        disabled={page >= lastPage}
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

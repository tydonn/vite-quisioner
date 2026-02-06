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
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = await api.get<ResponseDetailListResponse>("/response-details", {
                    params: {
                        page,
                        per_page: perPage,
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
    }, [page, perPage])

    if (loading) {
        return <div>Loading...</div>
    }

    const filtered = data.filter((item) => {
        const q = search.toLowerCase()
        return (
            item.responId.toString().includes(q) ||
            item.mahasiswaId.toLowerCase().includes(q) ||
            item.dosenId.toLowerCase().includes(q) ||
            item.matakuliahId.toLowerCase().includes(q) ||
            item.tahunAkademik.toLowerCase().includes(q) ||
            item.semester.toLowerCase().includes(q) ||
            item.pertanyaan.toLowerCase().includes(q) ||
            item.jawabanTampil.toLowerCase().includes(q)
        )
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Response Detail</h1>
            </div>

            <Input
                placeholder="Cari response detail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm shadow-sm"
            />

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Respon ID</TableHead>
                            <TableHead>Mahasiswa ID</TableHead>
                            <TableHead>Dosen ID</TableHead>
                            <TableHead>Matakuliah ID</TableHead>
                            <TableHead>Tahun Akademik</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Jawaban</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium py-3">
                                    {row.responId}
                                </TableCell>
                                <TableCell className="py-3">{row.mahasiswaId}</TableCell>
                                <TableCell className="py-3">{row.dosenId}</TableCell>
                                <TableCell className="py-3">{row.matakuliahId}</TableCell>
                                <TableCell className="py-3">{row.tahunAkademik}</TableCell>
                                <TableCell className="py-3">{row.semester}</TableCell>
                                <TableCell className="max-w-sm truncate py-3">
                                    {row.pertanyaan}
                                </TableCell>
                                <TableCell className="max-w-sm py-3 whitespace-normal break-words">
                                    {row.jawabanTampil === row.jawabanLabel &&
                                        row.jawabanLabel !== "-" ? (
                                        <span
                                            className={`inline-flex max-w-sm items-center whitespace-normal break-words rounded-md px-2 py-1 text-xs font-medium ${getJawabanClassName(
                                                row.jawabanTampil
                                            )}`}
                                        >
                                            {row.jawabanTampil}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-foreground whitespace-normal break-words">
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
                    <span>Per halaman</span>
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
                        Page {page} of {lastPage}
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

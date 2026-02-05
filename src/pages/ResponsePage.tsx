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

import type { ResponseListResponse } from "@/features/response/types"
import type { ResponseView } from "@/features/response/view-types"
import { mapResponseListToView } from "@/features/response/mapper"

import api from "@/lib/api"

export default function ResponsePage() {
    const [data, setData] = useState<ResponseView[]>([])
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
                const res = await api.get<ResponseListResponse>("/responses", {
                    params: {
                        page,
                        per_page: perPage,
                    },
                })
                setData(mapResponseListToView(res.data.data))
                setLastPage(res.data.pagination.last_page)
                setTotal(res.data.pagination.total)
            } catch (error) {
                console.error("Gagal mengambil data response", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage])

    if (loading) {
        return <div>Loading...</div>
    }

    const filtered = data.filter(
        (item) =>
            item.mahasiswaId.toLowerCase().includes(search.toLowerCase()) ||
            item.dosenId.toLowerCase().includes(search.toLowerCase()) ||
            item.matakuliahId.toLowerCase().includes(search.toLowerCase()) ||
            item.tahunAkademik.toLowerCase().includes(search.toLowerCase()) ||
            item.semester.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Response</h1>
            </div>

            <Input
                placeholder="Cari response..."
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
                            <TableHead>Dibuat</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium py-3">
                                    {row.id}
                                </TableCell>
                                <TableCell className="py-3">{row.mahasiswaId}</TableCell>
                                <TableCell className="py-3">{row.dosenId}</TableCell>
                                <TableCell className="py-3">{row.matakuliahId}</TableCell>
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
                        Sebelumnya
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Halaman {page} / {lastPage}
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setPage((prev) => Math.min(lastPage, prev + 1))
                        }
                        disabled={page >= lastPage}
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}

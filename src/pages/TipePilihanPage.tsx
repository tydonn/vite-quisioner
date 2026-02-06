import { useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import type { ChoiceTypeListResponse } from "@/features/choice-type/types"
import type { ChoiceTypeView } from "@/features/choice-type/view-types"
import { mapChoiceTypeListToView } from "@/features/choice-type/mapper"

import api from "@/lib/api"

export default function TipePilihanPage() {
    const [data, setData] = useState<ChoiceTypeView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get<ChoiceTypeListResponse>("/choice-types", {
                    params: {
                        page,
                        per_page: perPage,
                    },
                })
                setData(mapChoiceTypeListToView(res.data.data))
                if (res.data.pagination) {
                    setLastPage(res.data.pagination.last_page)
                    setTotal(res.data.pagination.total)
                }
            } catch (error) {
                console.error("Gagal mengambil data tipe pilihan", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage])

    const filtered = data.filter(
        (item) =>
            item.nama.toLowerCase().includes(search.toLowerCase()) ||
            item.kode.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tipe Pilihan</h1>
                <Button disabled>+ Tambah Tipe</Button>
            </div>

            <Input
                placeholder="Cari tipe pilihan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm shadow-sm"
            />

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium py-3">
                                    {row.kode}
                                </TableCell>
                                <TableCell className="py-3">{row.nama}</TableCell>
                                <TableCell className="max-w-sm truncate py-3">
                                    {row.deskripsi}
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge
                                        variant={
                                            row.status === "Aktif"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {row.status}
                                    </Badge>
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

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { PertanyaanView } from "@/features/question/view-types"
import type { AspectListResponse } from "@/features/question/types"
import { mapAspectListToView } from "@/features/question/mapper"

import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"
import { EditPertanyaanDialog } from "@/features/question/components/EditPertanyaanDialog"
import { AddPertanyaanDialog } from "@/features/question/components/AddPertanyaanDialog"
import { ActivityLogDialog } from "@/features/question/components/ActivityLogDialog"
import { HistoryIcon } from "lucide-react"

export default function BankPertanyaanPage() {
    const [data, setData] = useState<PertanyaanView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [openAdd, setOpenAdd] = useState(false)
    const [selected, setSelected] = useState<PertanyaanView | null>(null)
    const [selectedActivity, setSelectedActivity] = useState<PertanyaanView | null>(null)

    async function refreshData() {
        const res = await api.get<AspectListResponse>("/questions", {
            params: {
                page,
                per_page: perPage,
                include_total: true,
            },
        })
        setData(mapAspectListToView(res.data.data))
        if (res.data.pagination.last_page !== null) {
            setLastPage(res.data.pagination.last_page)
        }
        if (res.data.pagination.total !== null) {
            setTotal(res.data.pagination.total)
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                await refreshData()
            } catch (error) {
                console.error("Gagal mengambil data pertanyaan", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page, perPage])

    const filtered = data.filter(
        (d) =>
            d.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
            d.kategori.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <SpinnerPage />

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Bank Pertanyaan</h1>
                <Button onClick={() => setOpenAdd(true)}>+ Tambah Pertanyaan</Button>
            </div>

            <Input
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm shadow-sm"
            />

            <div className="rounded-md border bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prodi</TableHead>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kode}</TableCell>
                                <TableCell className="max-w-sm truncate">{item.pertanyaan}</TableCell>
                                <TableCell>{item.kategori}</TableCell>
                                <TableCell>{item.tipe}</TableCell>
                                <TableCell>{item.urutan}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === "Aktif" ? "default" : "destructive"}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs whitespace-normal">
                                    {item.prodiNama}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => setSelectedActivity(item)}
                                        title="Lihat aktivitas terakhir"
                                    >
                                        <HistoryIcon className="size-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-col gap-3 border-t p-3 sm:flex-row sm:items-center sm:justify-between">
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
                        <div className="text-sm text-muted-foreground">Halaman {page} / {lastPage}</div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                            disabled={page >= lastPage}
                        >
                            Berikutnya
                        </Button>
                    </div>
                </div>

                <EditPertanyaanDialog
                    open={!!selected}
                    data={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={refreshData}
                />
                <AddPertanyaanDialog
                    open={openAdd}
                    onClose={() => setOpenAdd(false)}
                    onSuccess={refreshData}
                />
                <ActivityLogDialog
                    open={!!selectedActivity}
                    data={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            </div>
        </div>
    )
}

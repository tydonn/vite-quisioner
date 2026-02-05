import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal } from "lucide-react"

import type { ChoiceListResponse } from "@/features/choice/types"
import type { ChoiceView } from "@/features/choice/view-types"
import { mapChoiceListToView } from "@/features/choice/mapper"
import { EditChoiceDialog } from "@/features/choice/components/EditChoiceDialog"
import api from "@/lib/api"

export default function PilihanPage() {
    const [data, setData] = useState<ChoiceView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<ChoiceView | null>(null)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get<ChoiceListResponse>("/choices", {
                    params: {
                        page,
                        per_page: perPage,
                    },
                })
                setData(mapChoiceListToView(res.data.data))
                setLastPage(res.data.pagination.last_page)
                setTotal(res.data.pagination.total)
            } catch (error) {
                console.error("Gagal mengambil data pilihan", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage])

    const filtered = data.filter(
        (d) =>
            d.label.toLowerCase().includes(search.toLowerCase()) ||
            d.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
            d.kode.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Pilihan Jawaban</h1>
                <Button asChild>
                    <Link to="/bank/tambah-pilihan">
                        + Tambah Pilihan
                    </Link>
                </Button>
            </div>

            <Input
                placeholder="Cari pilihan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm shadow-sm"
            />

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Nilai</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">
                                    {row.kode}
                                </TableCell>

                                <TableCell className="max-w-sm truncate">
                                    {row.pertanyaan}
                                </TableCell>

                                <TableCell>{row.label}</TableCell>

                                <TableCell>{row.nilai}</TableCell>

                                <TableCell>{row.urutan}</TableCell>

                                <TableCell>
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

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelected(row)}>
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

            <EditChoiceDialog
                open={!!selected}
                data={selected}
                onClose={() => setSelected(null)}
                onSuccess={async () => {
                    const res = await api.get<ChoiceListResponse>("/choices", {
                        params: {
                            page,
                            per_page: perPage,
                        },
                    })
                    setData(mapChoiceListToView(res.data.data))
                    setLastPage(res.data.pagination.last_page)
                    setTotal(res.data.pagination.total)
                }}
            />
        </div>
    )
}

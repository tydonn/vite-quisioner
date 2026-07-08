import { useEffect, useState } from "react"

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
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDownIcon, MoreHorizontal } from "lucide-react"

import type { CategoryListResponse } from "@/features/category/types"
import type { KategoriView } from "@/features/category/view-types"
import { mapCategoryListToView } from "@/features/category/mapper"
import { EditCategoryDialog } from "@/features/category/components/EditCategoryDialog"
import { AddCategoryDialog } from "@/features/category/components/AddCategoryDialog"

import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"

export default function KategoriPage() {
    const [data, setData] = useState<KategoriView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [openAdd, setOpenAdd] = useState(false)
    const [selected, setSelected] = useState<KategoriView | null>(null)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    async function refreshData() {
        const res = await api.get<CategoryListResponse>("/categories", {
            params: {
                page,
                per_page: perPage,
                include_total: true,
            },
        })
        const mapped = mapCategoryListToView(res.data.data)
        setData(mapped)
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
                console.error("Gagal mengambil data kategori", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage])

    const filtered = data.filter(
        (d) =>
            d.nama.toLowerCase().includes(search.toLowerCase()) ||
            d.kode.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <SpinnerPage />
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Kategori Pertanyaan</h1>
                <Button onClick={() => setOpenAdd(true)}>
                    + Tambah Kategori
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm shadow-sm"
            />

            {/* Table */}
            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama</TableHead>
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

                                <TableCell>
                                    <div>
                                        <div>{row.nama}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.deskripsi}
                                        </div>
                                    </div>
                                </TableCell>

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
                                            {/* <DropdownMenuItem className="text-destructive">
                                                Hapus
                                            </DropdownMenuItem> */}
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-20 justify-between">
                                <span>{perPage}</span>
                                <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-20">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Per halaman</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={String(perPage)}
                                    onValueChange={(value) => {
                                        setPerPage(Number(value))
                                        setPage(1)
                                    }}
                                >
                                    <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

            <EditCategoryDialog
                open={!!selected}
                data={selected}
                onClose={() => setSelected(null)}
                onSuccess={refreshData}
            />
            <AddCategoryDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={refreshData}
            />
        </div>
    )
}

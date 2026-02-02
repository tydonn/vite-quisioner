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

import type { Category } from "@/features/category/types"
import type { KategoriView } from "@/features/category/view-types"
import { mapCategoryListToView } from "@/features/category/mapper"

import api from "@/lib/api"

export default function KategoriPage() {
    const [data, setData] = useState<KategoriView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get<{ data: Category[] }>("/categories")
                const mapped = mapCategoryListToView(res.data.data)
                setData(mapped)
            } catch (error) {
                console.error("Gagal mengambil data kategori", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filtered = data.filter(
        (d) =>
            d.nama.toLowerCase().includes(search.toLowerCase()) ||
            d.kode.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Kategori Pertanyaan</h1>
                <Button asChild>
                    <Link to="/bank/tambah-kategori">
                        + Tambah Kategori
                    </Link>
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
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
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
        </div>
    )
}

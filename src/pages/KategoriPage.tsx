import { useState } from "react"
import type { Kategori } from "@/features/kategori/types"
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
import { MoreHorizontal, Plus } from "lucide-react"

const initialData: Kategori[] = [
    {
        id: 1,
        kode: "TD",
        nama: "Kualitas Dosen",
        deskripsi: "Penilaian terhadap kualitas pengajar",
        bobot: 20,
        tipe: "likert",
        aktif: true,
    },
    {
        id: 2,
        kode: "INF",
        nama: "Sarana & Prasarana",
        deskripsi: "Fasilitas kampus",
        bobot: 15,
        tipe: "likert",
        aktif: false,
    },
]

export default function KategoriPage() {
    const [data] = useState(initialData)
    const [search, setSearch] = useState("")

    const filtered = data.filter(
        (d) =>
            d.nama.toLowerCase().includes(search.toLowerCase()) ||
            d.kode.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Kategori Pertanyaan</h1>

                <Button>
                    <Plus className="mr-2 size-4" />
                    Tambah
                </Button>

            </div>

            <Input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Bobot</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.kode}</TableCell>
                                <TableCell>
                                    <div>
                                        <div>{row.nama}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.deskripsi}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{row.bobot}%</TableCell>
                                <TableCell>{row.tipe}</TableCell>
                                <TableCell>
                                    <Badge variant={row.aktif ? "default" : "secondary"}>
                                        {row.aktif ? "Aktif" : "Nonaktif"}
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
                                            <DropdownMenuItem className="text-destructive">
                                                Hapus
                                            </DropdownMenuItem>
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

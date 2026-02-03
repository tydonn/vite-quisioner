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

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import type { PertanyaanView } from "@/features/question/view-types"
import type { Aspect } from "@/features/question/types"
import { mapAspectListToView } from "@/features/question/mapper"

import api from "@/lib/api" // axios instance

import { EditPertanyaanDialog } from "@/features/question/components/EditPertanyaanDialog"

export default function BankPertanyaanPage() {
    const [data, setData] = useState<PertanyaanView[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    //for edit button
    const [selected, setSelected] = useState<PertanyaanView | null>(null)
    // const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get<{ data: Aspect[] }>("/questions")

                const mapped = mapAspectListToView(res.data.data)
                setData(mapped)
            } catch (error) {
                console.error("Gagal mengambil data pertanyaan", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filtered = data.filter(
        (d) =>
            d.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
            d.kategori.toLowerCase().includes(search.toLowerCase())
    )
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Bank Pertanyaan</h1>
                <Button asChild>
                    <Link to="/bank/tambah-pertanyaan">
                        + Tambah Pertanyaan
                    </Link>
                </Button>
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
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.kode}
                                </TableCell>

                                <TableCell className="max-w-sm truncate">
                                    {item.pertanyaan}
                                </TableCell>

                                <TableCell>{item.kategori}</TableCell>

                                <TableCell>{item.tipe}</TableCell>

                                <TableCell>{item.urutan}</TableCell>

                                <TableCell>
                                    <Badge
                                        variant={item.status === "Aktif" ? "default" : "destructive"}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                                        Edit
                                    </Button>
                                    {/* <Button size="sm" variant="destructive">
                                        Hapus
                                    </Button> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <EditPertanyaanDialog
                    open={!!selected}
                    data={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={async () => {
                        const res = await api.get("/questions")
                        setData(mapAspectListToView(res.data.data))
                    }}
                />
            </div>
        </div>
    )
}

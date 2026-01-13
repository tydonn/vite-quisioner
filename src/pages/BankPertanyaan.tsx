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

const data = [
    {
        id: 1,
        kode: "P001",
        pertanyaan: "Seberapa puas Anda terhadap layanan kami?",
        kategori: "Kepuasan",
        tipe: "Likert",
        wajib: true,
        status: "Aktif",
    },
    {
        id: 2,
        kode: "P002",
        pertanyaan: "Apakah Anda akan merekomendasikan kami?",
        kategori: "Loyalitas",
        tipe: "Single Choice",
        wajib: true,
        status: "Aktif",
    },
    {
        id: 3,
        kode: "P003",
        pertanyaan: "Saran untuk perbaikan?",
        kategori: "Feedback",
        tipe: "Text",
        wajib: false,
        status: "Nonaktif",
    },
]

export default function BankPertanyaanPage() {
    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Bank Pertanyaan</h1>
                <Button>+ Tambah Pertanyaan</Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Wajib</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kode}</TableCell>
                                <TableCell className="max-w-sm truncate">
                                    {item.pertanyaan}
                                </TableCell>
                                <TableCell>{item.kategori}</TableCell>
                                <TableCell>{item.tipe}</TableCell>

                                <TableCell>
                                    {item.wajib ? (
                                        <Badge variant="default">Ya</Badge>
                                    ) : (
                                        <Badge variant="secondary">Tidak</Badge>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant={item.status === "Aktif" ? "default" : "destructive"}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

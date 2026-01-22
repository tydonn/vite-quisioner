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
        nama: "Andi Pratama",
        email: "andi@gmail.com",
        instansi: "Fakultas Teknik",
        kategori: "Mahasiswa",
        status: "Selesai",
        tanggal: "2025-01-10",
    },
    {
        id: 2,
        nama: "Siti Aisyah",
        email: "siti@gmail.com",
        instansi: "Administrasi",
        kategori: "Staff",
        status: "Belum",
        tanggal: "-",
    },
]

export default function RespondenPage() {
    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Responden</h1>
                <Button className="shadow-sm" variant="outline">Export</Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Instansi</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.nama}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.instansi}</TableCell>
                                <TableCell>{item.kategori}</TableCell>

                                <TableCell>
                                    <Badge
                                        variant={item.status === "Selesai" ? "default" : "secondary"}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>

                                <TableCell>{item.tanggal}</TableCell>

                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline">
                                        Lihat Jawaban
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

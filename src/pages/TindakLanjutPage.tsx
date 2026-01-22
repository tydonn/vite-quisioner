import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"

const rtlData: {
    id: number
    category: string
    issue: string
    action: string
    pic: string
    target: string
    status: RTLStatus
}[] = [
        {
            id: 1,
            category: "Fasilitas",
            issue: "Kebersihan toilet kurang",
            action: "Perbaikan dan penambahan petugas kebersihan",
            pic: "Bagian Umum",
            target: "2025-03-01",
            status: "open",
        },
        {
            id: 2,
            category: "Pelayanan Akademik",
            issue: "Respon admin lambat",
            action: "Evaluasi SOP pelayanan",
            pic: "BAAK",
            target: "2025-03-10",
            status: "progress",
        },
    ]
type RTLStatus = "open" | "progress" | "done"

const statusLabel: Record<RTLStatus, string> = {
    open: "Open",
    progress: "Proses",
    done: "Selesai",
}


export default function TindakLanjutPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    Tindak Lanjut (RTL)
                </h1>

                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah RTL
                </Button>
            </div>

            {/* Table */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Daftar Tindak Lanjut</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Permasalahan</TableHead>
                                <TableHead>Tindakan</TableHead>
                                <TableHead>PIC</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[80px]" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rtlData.map((rtl) => (
                                <TableRow key={rtl.id}>
                                    <TableCell className="font-medium">
                                        {rtl.category}
                                    </TableCell>
                                    <TableCell>{rtl.issue}</TableCell>
                                    <TableCell>{rtl.action}</TableCell>
                                    <TableCell>{rtl.pic}</TableCell>
                                    <TableCell>{rtl.target}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                rtl.status === "done"
                                                    ? "default"
                                                    : rtl.status === "progress"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {statusLabel[rtl.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Tandai Selesai
                                                </DropdownMenuItem>
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
                </CardContent>
            </Card>
        </div>
    )
}

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
import { FileText, Download, MoreHorizontal } from "lucide-react"

const reports = [
    {
        id: 1,
        period: "2024 Semester Ganjil",
        totalResponses: 320,
        averageScore: 3.6,
        status: "final",
    },
    {
        id: 2,
        period: "2024 Semester Genap",
        totalResponses: 280,
        averageScore: 3.2,
        status: "draft",
    },
]

export default function LaporanPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Laporan</h1>

                <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Buat Laporan
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Laporan</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Periode</TableHead>
                                <TableHead>Responden</TableHead>
                                <TableHead>Skor Rata-rata</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[80px]" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {reports.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">
                                        {r.period}
                                    </TableCell>
                                    <TableCell>{r.totalResponses}</TableCell>
                                    <TableCell>{r.averageScore}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                r.status === "final"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {r.status === "final" ? "Final" : "Draft"}
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
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Export PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Export Excel
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

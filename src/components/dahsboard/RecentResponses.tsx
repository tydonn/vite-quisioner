import {
    Card,
    CardContent,
    CardDescription,
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

type ResponseItem = {
    id: number
    name: string
    category: string
    date: string
}

const responses: ResponseItem[] = [
    {
        id: 1,
        name: "Andi Pratama",
        category: "Pelayanan",
        date: "2025-01-10 09:30",
    },
    {
        id: 2,
        name: "Budi Santoso",
        category: "Fasilitas",
        date: "2025-01-10 09:10",
    },
    {
        id: 3,
        name: "Siti Aminah",
        category: "Akademik",
        date: "2025-01-09 16:45",
    },
]

export function RecentResponses() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Respon Terbaru</CardTitle>
                <CardDescription>January - December 2025</CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Responden</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="text-right">
                                Waktu
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {responses.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {item.date}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

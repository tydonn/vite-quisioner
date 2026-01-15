import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    PlusCircle,
    FileText,
    Users,
    ClipboardList,
    BarChart3,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function QuickActions() {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
                <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate("/kategori")}
                >
                    <PlusCircle className="h-4 w-4" />
                    Tambah Kategori
                </Button>

                <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate("/bank-pertanyaan")}
                >
                    <ClipboardList className="h-4 w-4" />
                    Tambah Pertanyaan
                </Button>

                <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate("/responden")}
                >
                    <Users className="h-4 w-4" />
                    Data Responden
                </Button>

                <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate("/laporan")}
                >
                    <FileText className="h-4 w-4" />
                    Laporan
                </Button>

                <Button
                    variant="outline"
                    className="justify-start gap-2 sm:col-span-2"
                    onClick={() => navigate("/rtl")}
                >
                    <BarChart3 className="h-4 w-4" />
                    Tindak Lanjut (RTL)
                </Button>
            </CardContent>
        </Card>
    )
}

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertOctagon } from "lucide-react"

type IssueItem = {
    id: number
    category: string
    score: number
    status: "critical" | "warning"
}

const issues: IssueItem[] = [
    {
        id: 1,
        category: "Fasilitas",
        score: 2.1,
        status: "critical",
    },
    {
        id: 2,
        category: "Pelayanan Akademik",
        score: 2.8,
        status: "warning",
    },
    {
        id: 3,
        category: "Sistem Informasi Akademik",
        score: 2.3,
        status: "critical",
    },
    {
        id: 4,
        category: "Pelayanan Administrasi",
        score: 2.9,
        status: "warning",
    },
    {
        id: 5,
        category: "Sarana Penunjang",
        score: 2.4,
        status: "critical",
    },
]


export function IssueAlert() {
    if (issues.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Isu Prioritas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Tidak ada kategori bermasalah 🎉
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Isu Prioritas</CardTitle>
                <CardDescription>
                    Isu prioritas berdasarkan skor terendah
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {issues.map((issue) => (
                    <div
                        key={issue.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                    >
                        <div className="flex items-center gap-3">
                            {issue.status === "critical" ? (
                                <AlertOctagon className="h-5 w-5 text-destructive" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}

                            <div>
                                <p className="font-medium">
                                    {issue.category}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Skor rata-rata: {issue.score}
                                </p>
                            </div>
                        </div>

                        <Badge
                            variant={
                                issue.status === "critical"
                                    ? "destructive"
                                    : "secondary"
                            }
                        >
                            {issue.status === "critical"
                                ? "Kritis"
                                : "Perlu Perhatian"}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    HelpCircle,
    Layers,
    BarChart3,
} from "lucide-react"

type StatItem = {
    title: string
    value: string | number
    description?: string
    icon: React.ElementType
    badge?: {
        label: string
        variant?: "default" | "secondary" | "destructive"
    }
}

const stats: StatItem[] = [
    {
        title: "Total Responden",
        value: 128,
        description: "Responden terdaftar",
        icon: Users,
        badge: {
            label: "Stabil",
            variant: "default",
        }
    },
    {
        title: "Total Pertanyaan",
        value: 45,
        description: "Bank pertanyaan aktif",
        icon: HelpCircle,
    },
    {
        title: "Kategori Aktif",
        value: 6,
        description: "Kategori digunakan",
        icon: Layers,
    },
    {
        title: "Tingkat Kepuasan",
        value: "82%",
        description: "Rata-rata kepuasan",
        icon: BarChart3,
        badge: {
            label: "Baik",
            variant: "secondary",
        },
    },
]

export function StatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon

                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>

                                {stat.badge && (
                                    <Badge variant={stat.badge.variant}>
                                        {stat.badge.label}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

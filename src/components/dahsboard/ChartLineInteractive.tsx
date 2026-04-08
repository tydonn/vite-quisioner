"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import api from "@/lib/api"

type ChartDatum = {
    label: string
    sangatpuas: number
    puas: number
    kurangpuas: number
    tidakpuas: number
}

const chartConfig = {
    sangatpuas: {
        label: "Sangat Puas",
        color: "var(--chart-1)",
    },
    puas: {
        label: "Puas",
        color: "var(--chart-2)",
    },
    kurangpuas: {
        label: "Kurang Puas",
        color: "var(--chart-3)",
    },
    tidakpuas: {
        label: "Tidak Puas",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

type ChartKey = keyof typeof chartConfig

export function ChartLineInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<ChartKey>("sangatpuas")
    const [chartData, setChartData] = React.useState<ChartDatum[]>([])

    React.useEffect(() => {
        const controller = new AbortController()
        let cancelled = false

        async function fetchChartData() {
            try {
                const res = await api.get<{
                    success?: boolean
                    data?: Record<string, number>
                }>("/response-details/label-counts", {
                    signal: controller.signal,
                })

                if (cancelled) return

                const data = res.data?.data ?? {}
                const normalize = (label: string) => label.toLowerCase().trim()

                const sangatpuas = data["Sangat Puas"] ?? data["SANGAT PUAS"] ?? 0
                const puas = data["Puas"] ?? data["PUAS"] ?? 0
                const kurangpuas =
                    data["Kurang Puas"] ?? data["KURANG PUAS"] ?? 0
                const tidakpuas = data["Tidak Puas"] ?? data["TIDAK PUAS"] ?? 0

                const mapped = Object.entries(data).reduce(
                    (acc, [label, value]) => {
                        const key = normalize(label)
                        if (key === "sangat puas") acc.sangatpuas = value
                        if (key === "puas") acc.puas = value
                        if (key === "kurang puas") acc.kurangpuas = value
                        if (key === "tidak puas") acc.tidakpuas = value
                        return acc
                    },
                    {
                        sangatpuas,
                        puas,
                        kurangpuas,
                        tidakpuas,
                    }
                )

                setChartData([
                    {
                        label: "Total",
                        ...mapped,
                    },
                ])
            } catch (error) {
                const err = error as { name?: string; code?: string }
                if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
                    return
                }
                console.error("Gagal mengambil data chart", error)
                setChartData([])
            }
        }

        fetchChartData()

        return () => {
            cancelled = true
            controller.abort()
        }
    }, [])

    const total = React.useMemo(() => {
        return Object.keys(chartConfig).reduce((acc, key) => {
            acc[key as ChartKey] = chartData.reduce(
                (sum, item) => sum + item[key as ChartKey],
                0
            )
            return acc
        }, {} as Record<ChartKey, number>)
    }, [])

    return (
        <Card className="py-4 sm:py-0 shadow-sm">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                    <CardTitle>Tren Kepuasan Responden</CardTitle>
                    <CardDescription>
                        Rekap kuisioner total
                    </CardDescription>
                </div>

                <div className="flex flex-wrap">
                    {(Object.keys(chartConfig) as ChartKey[]).map((key) => (
                        <button
                            key={key}
                            data-active={activeChart === key}
                            className="data-[active=true]:bg-muted/50 flex flex-col gap-1 border-l px-4 py-3 text-left"
                            onClick={() => setActiveChart(key)}
                        >
                            <span className="text-muted-foreground text-xs">
                                {chartConfig[key].label}
                            </span>
                            <span className="text-lg font-bold">
                                {total[key].toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="h-[260px] w-full"
                >
                    <LineChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" />

                        <ChartTooltip
                            content={<ChartTooltipContent />}
                        />

                        <Line
                            dataKey={activeChart}
                            type="monotone"
                            stroke={`var(--color-${activeChart})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

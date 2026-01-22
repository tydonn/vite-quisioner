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

const chartData = [
    { month: "January", sangatpuas: 186, puas: 80, netral: 40, tidakpuas: 20, sangattidakpuas: 10 },
    { month: "February", sangatpuas: 305, puas: 200, netral: 120, tidakpuas: 100, sangattidakpuas: 80 },
    { month: "March", sangatpuas: 237, puas: 120, netral: 90, tidakpuas: 50, sangattidakpuas: 30 },
    { month: "April", sangatpuas: 73, puas: 190, netral: 70, tidakpuas: 40, sangattidakpuas: 20 },
    { month: "May", sangatpuas: 209, puas: 130, netral: 90, tidakpuas: 50, sangattidakpuas: 30 },
    { month: "June", sangatpuas: 214, puas: 140, netral: 100, tidakpuas: 60, sangattidakpuas: 40 },
    { month: "July", sangatpuas: 218, puas: 150, netral: 110, tidakpuas: 70, sangattidakpuas: 50 },
    { month: "August", sangatpuas: 250, puas: 160, netral: 120, tidakpuas: 80, sangattidakpuas: 60 },
    { month: "September", sangatpuas: 300, puas: 170, netral: 130, tidakpuas: 90, sangattidakpuas: 70 },
    { month: "October", sangatpuas: 320, puas: 180, netral: 140, tidakpuas: 100, sangattidakpuas: 80 },
    { month: "November", sangatpuas: 340, puas: 190, netral: 150, tidakpuas: 110, sangattidakpuas: 90 },
    { month: "December", sangatpuas: 360, puas: 200, netral: 160, tidakpuas: 120, sangattidakpuas: 100 },
]

const chartConfig = {
    sangatpuas: {
        label: "Sangat Puas",
        color: "var(--chart-1)",
    },
    puas: {
        label: "Puas",
        color: "var(--chart-2)",
    },
    netral: {
        label: "Netral",
        color: "var(--chart-3)",
    },
    tidakpuas: {
        label: "Tidak Puas",
        color: "var(--chart-4)",
    },
    sangattidakpuas: {
        label: "Sangat Tidak Puas",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

type ChartKey = keyof typeof chartConfig

export function ChartLineInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<ChartKey>("sangatpuas")

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
                        Rekap kuisioner per bulan
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
                        <XAxis dataKey="month" />

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

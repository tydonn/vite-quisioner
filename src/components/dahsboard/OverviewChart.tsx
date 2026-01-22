"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
export const description = "A bar chart"

// const chartData = [
//     { month: "Jan", total: 32 },
//     { month: "Feb", total: 45 },
//     { month: "Mar", total: 60 },
//     { month: "Apr", total: 52 },
//     { month: "Mei", total: 71 },
// ]

const chartData = [
    { month: "January", total: 186 },
    { month: "February", total: 305 },
    { month: "March", total: 237 },
    { month: "April", total: 73 },
    { month: "May", total: 209 },
    { month: "June", total: 214 },
    { month: "July", total: 71 },
    { month: "August", total: 52 },
    { month: "September", total: 60 },
    { month: "October", total: 45 },
    { month: "November", total: 32 },
    { month: "December", total: 90 },
]

const chartConfig = {
    total: {
        label: "Jumlah Respon",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function OverviewChart() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Responden 2025</CardTitle>
                <CardDescription>January - December 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total responden for the year 2025
                </div>
            </CardFooter>
        </Card>
    )
}
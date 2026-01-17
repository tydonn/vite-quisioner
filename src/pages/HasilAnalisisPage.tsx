import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
} from "recharts"
import { type ChartConfig } from "@/components/ui/chart"

const kpi = [
    { title: "Rata-rata Kepuasan", value: "4.2 / 5" },
    { title: "Total Responden", value: "128" },
    { title: "Completion Rate", value: "92%" },
]

// const barData = [
//     { label: "Sangat Puas", value: 52 },
//     { label: "Puas", value: 40 },
//     { label: "Netral", value: 22 },
//     { label: "Tidak Puas", value: 10 },
//     { label: "Sangat Tidak Puas", value: 4 },
// ]

// const pieData = [
//     { name: "Mahasiswa", value: 80 },
//     { name: "Staff", value: 30 },
//     { name: "Dosen", value: 18 },
// ]

//example
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
        color: "#2563eb",
    },
    puas: {
        label: "Puas",
        color: "#60a5fa",
    },
    netral: {
        label: "Netral",
        color: "#fbbf24",
    },
    tidakpuas: {
        label: "Tidak Puas",
        color: "#f87171",
    },
    sangattidakpuas: {
        label: "Sangat Tidak Puas",
        color: "#b91c1c",
    }
} satisfies ChartConfig

export default function HasilAnalisisPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Hasil & Analisis</h1>

            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpi.map((item) => (
                    <Card key={item.title}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {item.value}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Kepuasan</CardTitle>
                        <CardDescription>Perbandingan jumlah Responden berdasarkan tingkat Kepuasan</CardDescription>
                    </CardHeader>
                    <ChartContainer config={chartConfig} >
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="sangatpuas" fill="var(--color-sangatpuas)" radius={4} />
                            <Bar dataKey="puas" fill="var(--color-puas)" radius={4} />
                            <Bar dataKey="netral" fill="var(--color-netral)" radius={4} />
                            <Bar dataKey="tidakpuas" fill="var(--color-tidakpuas)" radius={4} />
                            <Bar dataKey="sangattidakpuas" fill="var(--color-sangattidakpuas)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </Card>


                {/* Pie Chart */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Jenis Responden</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={index} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card> */}

            </div>
        </div>
    )
}

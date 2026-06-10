import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon, FileQuestionIcon, MoreHorizontal } from "lucide-react"

import type { ChoiceListResponse } from "@/features/choice/types"
import type { ChoiceView } from "@/features/choice/view-types"
import { mapChoiceListToView } from "@/features/choice/mapper"
import { EditChoiceDialog } from "@/features/choice/components/EditChoiceDialog"
import { AddChoiceDialog } from "@/features/choice/components/AddChoiceDialog"
import type { Aspect } from "@/features/question/types"
import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"

function getLabelClassName(value: string) {
    const normalized = value.toLowerCase()
    if (normalized.includes("sangat puas")) {
        return "bg-emerald-100 text-emerald-700"
    }
    if (normalized.includes("tidak puas")) {
        return "bg-rose-100 text-rose-700"
    }
    if (normalized.includes("kurang puas")) {
        return "bg-orange-100 text-orange-700"
    }
    if (normalized.includes("cukup puas")) {
        return "bg-lime-100 text-lime-700"
    }
    if (normalized.includes("puas")) {
        return "bg-green-100 text-green-700"
    }

    return "bg-muted text-foreground"
}

export default function PilihanPage() {
    const [data, setData] = useState<ChoiceView[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<ChoiceView | null>(null)
    const [openAdd, setOpenAdd] = useState(false)
    const [questions, setQuestions] = useState<Aspect[]>([])
    const [aspectFilter, setAspectFilter] = useState("")
    const [activeFilter, setActiveFilter] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    async function refreshData() {
        const res = await api.get<ChoiceListResponse>("/choices", {
            params: {
                page,
                per_page: perPage,
                include_total: true,
                aspect_id: aspectFilter || undefined,
                active: activeFilter || undefined,
            },
        })
        setData(mapChoiceListToView(res.data.data))
        if (res.data.pagination.last_page !== null) {
            setLastPage(res.data.pagination.last_page)
        }
        if (res.data.pagination.total !== null) {
            setTotal(res.data.pagination.total)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await refreshData()
            } catch (error) {
                console.error("Gagal mengambil data pilihan", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [page, perPage, aspectFilter, activeFilter])

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await api.get<{ data: Aspect[] }>("/questions", {
                    params: {
                        per_page: 500,
                        active: 1,
                    },
                })
                setQuestions(res.data.data ?? [])
            } catch (error) {
                console.error("Gagal mengambil data pertanyaan", error)
            }
        }

        fetchQuestions()
    }, [])

    if (loading) {
        return <SpinnerPage />
    }

    const selectedQuestion = questions.find(
        (question) => String(question.AspectID) === aspectFilter
    )
    const selectedQuestionLabel = selectedQuestion
        ? `${selectedQuestion.AspectID} - ${selectedQuestion.AspectText}`
        : "Semua Pertanyaan"
    const activeFilterLabel =
        activeFilter === "1" ? "Aktif" : activeFilter === "0" ? "Nonaktif" : "Semua Status"

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Pilihan Jawaban</h1>
                <Button onClick={() => setOpenAdd(true)}>
                    + Tambah Pilihan
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-auto min-h-9 w-80 justify-between">
                            <span className="min-w-0 flex-1 truncate text-left">
                                {selectedQuestionLabel}
                            </span>
                            <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[28rem] max-w-[calc(100vw-2rem)]">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Filter Pertanyaan</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={aspectFilter}
                                onValueChange={(value) => {
                                    setAspectFilter(value)
                                    setPage(1)
                                }}
                            >
                                <div className="max-h-56 overflow-y-auto">
                                    <DropdownMenuRadioItem value="">
                                        <FileQuestionIcon />
                                        Semua Pertanyaan
                                    </DropdownMenuRadioItem>
                                    {questions.map((question) => (
                                        <DropdownMenuRadioItem
                                            key={question.AspectID}
                                            value={String(question.AspectID)}
                                            className="items-start"
                                        >
                                            <FileQuestionIcon />
                                            <span className="whitespace-normal break-words leading-snug">
                                                {question.AspectID} - {question.AspectText}
                                            </span>
                                        </DropdownMenuRadioItem>
                                    ))}
                                </div>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-9 w-44 justify-between">
                            <span className="truncate">{activeFilterLabel}</span>
                            <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-44">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={activeFilter}
                                onValueChange={(value) => {
                                    setActiveFilter(value)
                                    setPage(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="">
                                    Semua Status
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="1">
                                    <CheckCircle2Icon />
                                    Aktif
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="0">
                                    <CircleOffIcon />
                                    Nonaktif
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Aspect ID</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Nilai</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">
                                    {row.kode}
                                </TableCell>

                                <TableCell>{row.aspectId}</TableCell>

                                <TableCell className="max-w-sm truncate">
                                    {row.pertanyaan}
                                </TableCell>

                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getLabelClassName(
                                            row.label
                                        )}`}
                                    >
                                        {row.label}
                                    </span>
                                </TableCell>

                                <TableCell>{row.nilai}</TableCell>

                                <TableCell>{row.urutan}</TableCell>

                                <TableCell>
                                    <Badge
                                        variant={
                                            row.status === "Aktif"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {row.status}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelected(row)}>
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Per halaman</span>
                    <select
                        className="rounded border px-2 py-1"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>Total {total}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page <= 1}
                    >
                        Sebelumnya
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Halaman {page} / {lastPage}
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setPage((prev) => Math.min(lastPage, prev + 1))
                        }
                        disabled={page >= lastPage}
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>

            <EditChoiceDialog
                open={!!selected}
                data={selected}
                onClose={() => setSelected(null)}
                onSuccess={refreshData}
            />
            <AddChoiceDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={refreshData}
            />
        </div>
    )
}

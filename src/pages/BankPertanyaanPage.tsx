import { useEffect, useMemo, useState } from "react"

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
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { PertanyaanView } from "@/features/question/view-types"
import type { AspectListResponse, Respondent, RespondentListResponse } from "@/features/question/types"
import { mapAspectListToView } from "@/features/question/mapper"

import api from "@/lib/api"
import SpinnerPage from "@/pages/SpinnerPage"
import { EditPertanyaanDialog } from "@/features/question/components/EditPertanyaanDialog"
import { AddPertanyaanDialog } from "@/features/question/components/AddPertanyaanDialog"
import { ActivityLogDialog } from "@/features/question/components/ActivityLogDialog"
import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon, FileQuestionIcon, HistoryIcon, SearchIcon, UsersIcon } from "lucide-react"

export default function BankPertanyaanPage() {
    const [data, setData] = useState<PertanyaanView[]>([])
    const [questionOptions, setQuestionOptions] = useState<PertanyaanView[]>([])
    const [respondents, setRespondents] = useState<Respondent[]>([])
    const [loading, setLoading] = useState(true)
    const [questionFilter, setQuestionFilter] = useState("")
    const [questionSearch, setQuestionSearch] = useState("")
    const [respondentFilter, setRespondentFilter] = useState("")
    const [activeFilter, setActiveFilter] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [openAdd, setOpenAdd] = useState(false)
    const [selected, setSelected] = useState<PertanyaanView | null>(null)
    const [selectedActivity, setSelectedActivity] = useState<PertanyaanView | null>(null)

    async function refreshData() {
        const res = await api.get<AspectListResponse>("/questions", {
            params: {
                page,
                per_page: perPage,
                include_total: true,
                respondent_id: respondentFilter || undefined,
                active: activeFilter || undefined,
            },
        })
        setData(mapAspectListToView(res.data.data))
        if (res.data.pagination.last_page !== null) {
            setLastPage(res.data.pagination.last_page)
        }
        if (res.data.pagination.total !== null) {
            setTotal(res.data.pagination.total)
        }
    }

    async function refreshQuestionOptions() {
        const firstPage = await api.get<AspectListResponse>("/questions", {
            params: {
                page: 1,
                per_page: 500,
                include_total: true,
            },
        })

        const firstPageItems = mapAspectListToView(firstPage.data.data)
        const totalPages = firstPage.data.pagination.last_page ?? 1

        if (totalPages <= 1) {
            setQuestionOptions(firstPageItems)
            return
        }

        const remainingPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
                api.get<AspectListResponse>("/questions", {
                    params: {
                        page: index + 2,
                        per_page: 500,
                        include_total: true,
                    },
                })
            )
        )

        setQuestionOptions([
            ...firstPageItems,
            ...remainingPages.flatMap((res) => mapAspectListToView(res.data.data)),
        ])
    }

    async function refreshRespondents() {
        const res = await api.get<RespondentListResponse>("/respondents")
        setRespondents(res.data.data ?? [])
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                await Promise.all([refreshData(), refreshQuestionOptions(), refreshRespondents()])
            } catch (error) {
                console.error("Gagal mengambil data pertanyaan", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page, perPage, respondentFilter, activeFilter])

    const filteredQuestionOptions = useMemo(() => {
        const keyword = questionSearch.trim().toLowerCase()
        if (!keyword) return questionOptions

        return questionOptions.filter((item) => {
            const id = String(item.id).toLowerCase()
            const kode = item.kode.toLowerCase()
            const pertanyaan = item.pertanyaan.toLowerCase()

            return id.includes(keyword) || kode.includes(keyword) || pertanyaan.includes(keyword)
        })
    }, [questionOptions, questionSearch])

    const filtered = questionFilter
        ? questionOptions.filter((item) => {
            const matchQuestion = String(item.id) === questionFilter
            const matchRespondent = respondentFilter
                ? String(item.respondenId) === respondentFilter
                : true
            const matchActive = activeFilter
                ? (activeFilter === "1" ? item.status === "Aktif" : item.status === "Nonaktif")
                : true

            return matchQuestion && matchRespondent && matchActive
        })
        : data

    const selectedQuestion = questionOptions.find((item) => String(item.id) === questionFilter)
    const selectedQuestionLabel = selectedQuestion
        ? `${selectedQuestion.id} - ${selectedQuestion.pertanyaan}`
        : "Semua Pertanyaan"

    const selectedRespondent = respondents.find(
        (respondent) => String(respondent.RespondentID) === respondentFilter
    )
    const respondentFilterLabel = selectedRespondent?.RespondentName ?? "Semua Responden"

    const activeFilterLabel =
        activeFilter === "1" ? "Aktif" : activeFilter === "0" ? "Nonaktif" : "Semua Status"

    if (loading) return <SpinnerPage />

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Bank Pertanyaan</h1>
                <Button onClick={() => setOpenAdd(true)}>+ Tambah Pertanyaan</Button>
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
                            <div className="px-2 pb-2">
                                <div className="relative">
                                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={questionSearch}
                                        onChange={(event) => setQuestionSearch(event.target.value)}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        placeholder="Cari pertanyaan..."
                                        className="h-9 pl-8"
                                    />
                                </div>
                            </div>
                            <DropdownMenuRadioGroup
                                value={questionFilter}
                                onValueChange={(value) => {
                                    setQuestionFilter(value)
                                    setPage(1)
                                }}
                            >
                                <div className="max-h-56 overflow-y-auto">
                                    <DropdownMenuRadioItem value="">
                                        <FileQuestionIcon />
                                        Semua Pertanyaan
                                    </DropdownMenuRadioItem>
                                    {filteredQuestionOptions.map((item) => (
                                        <DropdownMenuRadioItem
                                            key={item.id}
                                            value={String(item.id)}
                                            className="items-start"
                                        >
                                            <FileQuestionIcon />
                                            <span className="whitespace-normal break-words leading-snug">
                                                {item.id} - {item.pertanyaan}
                                            </span>
                                        </DropdownMenuRadioItem>
                                    ))}
                                    {filteredQuestionOptions.length === 0 ? (
                                        <div className="px-2 py-3 text-sm text-muted-foreground">
                                            Pertanyaan tidak ditemukan
                                        </div>
                                    ) : null}
                                </div>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-9 w-52 justify-between">
                            <span className="truncate">{respondentFilterLabel}</span>
                            <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-52">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Filter Responden</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={respondentFilter}
                                onValueChange={(value) => {
                                    setRespondentFilter(value)
                                    setPage(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="">
                                    <UsersIcon />
                                    Semua Responden
                                </DropdownMenuRadioItem>
                                {respondents.map((respondent) => (
                                    <DropdownMenuRadioItem
                                        key={respondent.RespondentID}
                                        value={String(respondent.RespondentID)}
                                    >
                                        <UsersIcon />
                                        {respondent.RespondentName}
                                    </DropdownMenuRadioItem>
                                ))}
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

            <div className="rounded-md border bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Responden</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prodi</TableHead>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kode}</TableCell>
                                <TableCell className="max-w-sm truncate">{item.pertanyaan}</TableCell>
                                <TableCell>{item.kategori}</TableCell>
                                <TableCell>{item.tipe}</TableCell>
                                <TableCell>{item.responden}</TableCell>
                                <TableCell>{item.urutan}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === "Aktif" ? "default" : "destructive"}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs whitespace-normal">
                                    {item.prodiNama}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => setSelectedActivity(item)}
                                        title="Lihat aktivitas terakhir"
                                    >
                                        <HistoryIcon className="size-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-col gap-3 border-t p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Per halaman</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-20 justify-between">
                                    <span>{perPage}</span>
                                    <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-20">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Per halaman</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={String(perPage)}
                                        onValueChange={(value) => {
                                            setPerPage(Number(value))
                                            setPage(1)
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        <div className="text-sm text-muted-foreground">Halaman {page} / {lastPage}</div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                            disabled={page >= lastPage}
                        >
                            Berikutnya
                        </Button>
                    </div>
                </div>

                <EditPertanyaanDialog
                    open={!!selected}
                    data={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={async () => {
                        await Promise.all([refreshData(), refreshQuestionOptions()])
                    }}
                />
                <AddPertanyaanDialog
                    open={openAdd}
                    onClose={() => setOpenAdd(false)}
                    onSuccess={async () => {
                        await Promise.all([refreshData(), refreshQuestionOptions()])
                    }}
                />
                <ActivityLogDialog
                    open={!!selectedActivity}
                    data={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            </div>
        </div>
    )
}

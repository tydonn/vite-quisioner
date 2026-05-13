import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { ResponseFilterProdiOption } from "@/features/response/types"
import api from "@/lib/api"

type ProdiOption = { id: string; nama: string }
type TahunAkademikOption = { tahunId: string }

type PercentageItem = {
    TahunAkademik?: string | number
    prodi?: { ProdiID?: string | number; Nama?: string }
    dosen?: { Login?: string | number; Nama?: string }
    matakuliah?: { MKID?: string | number; Nama?: string }
    precentageofchoicevalue?: Record<string, number>
    percentageofchoicevalue?: Record<string, number>
}

function parseRoles(raw: string | null): string[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) return parsed.map((item) => String(item))
        if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()]
    } catch { }
    return []
}

function normalizeProdiOption(item: ResponseFilterProdiOption): ProdiOption | null {
    if (!item.ProdiID || !item.Nama) return null
    return { id: String(item.ProdiID), nama: String(item.Nama) }
}

function normalizeTahunAkademikOption(item: unknown): TahunAkademikOption | null {
    if (!item || typeof item !== "object") return null
    const raw = (item as Record<string, unknown>).TahunID
    if (!raw) return null
    return { tahunId: String(raw) }
}

export default function HasilAnalisisPersentasePage() {
    const storedRoles = parseRoles(
        typeof window !== "undefined" ? localStorage.getItem("auth_roles") : null
    )
    const storedProgramCode =
        typeof window !== "undefined" ? (localStorage.getItem("auth_program_code") ?? "") : ""
    const isAdministrator = storedRoles.some((role) => role.toLowerCase() === "administrator")

    const [allData, setAllData] = useState<PercentageItem[]>([])
    const [loading, setLoading] = useState(false)
    const [hasAppliedFilter, setHasAppliedFilter] = useState(false)
    const [tahunAkademikInput, setTahunAkademikInput] = useState("")
    const [prodiInput, setProdiInput] = useState("")
    const [tahunAkademikFilter, setTahunAkademikFilter] = useState("")
    const [prodiFilter, setProdiFilter] = useState("")
    const [tahunAkademikOptions, setTahunAkademikOptions] = useState<TahunAkademikOption[]>([])
    const [prodiOptions, setProdiOptions] = useState<ProdiOption[]>([])
    const [prodiQuery, setProdiQuery] = useState("")
    const [isProdiOpen, setIsProdiOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        api.get<{ data?: unknown[] }>("/tahun-akademik/options").then((res) => {
            const items = (res.data.data ?? [])
                .map(normalizeTahunAkademikOption)
                .filter((item): item is TahunAkademikOption => item !== null)
            setTahunAkademikOptions(items)
        }).catch(() => setTahunAkademikOptions([]))
    }, [])

    useEffect(() => {
        if (!isAdministrator) return
        api.get<{ data?: ResponseFilterProdiOption[] }>("/responses/filter-options/prodi", {
            params: { tahun_akademik: tahunAkademikInput || undefined, q: prodiQuery || undefined },
        }).then((res) => {
            const items = (res.data.data ?? [])
                .map(normalizeProdiOption)
                .filter((item): item is ProdiOption => item !== null)
            setProdiOptions(items)
        }).catch(() => setProdiOptions([]))
    }, [isAdministrator, prodiQuery, tahunAkademikInput])

    useEffect(() => {
        if (!hasAppliedFilter) return
        setLoading(true)
        setErrorMessage("")
            ; (async () => {
                const params = {
                    tahun_akademik: tahunAkademikFilter || undefined,
                    TahunAkademik: tahunAkademikFilter || undefined,
                    prodi_id: (isAdministrator ? prodiFilter : storedProgramCode) || undefined,
                }
                const endpoints = [
                    "/response-details/result-precentage",
                    "/response-details/percentage-choice-value",
                    "/response-details/precentage-choice-value",
                ]

                for (const endpoint of endpoints) {
                    try {
                        const res = await api.get<{ data?: PercentageItem[] }>(endpoint, { params })
                        const rows = Array.isArray(res.data?.data)
                            ? res.data.data
                            : Array.isArray(res.data)
                                ? (res.data as unknown as PercentageItem[])
                                : []
                        setAllData(rows)
                        return
                    } catch (error) {
                        console.error(`Gagal mengambil data dari ${endpoint}`, error)
                    }
                }

                setAllData([])
                setErrorMessage("Data tidak ditemukan atau endpoint persentase belum sesuai.")
            })().finally(() => setLoading(false))
    }, [hasAppliedFilter, tahunAkademikFilter, prodiFilter, isAdministrator, storedProgramCode])

    const selectedProdi = prodiOptions.find((item) => item.id === prodiInput)
    const selectedProdiLabel = selectedProdi ? `${selectedProdi.id} - ${selectedProdi.nama}` : "All Prodi"
    const isFilterReady = Boolean(isAdministrator ? (tahunAkademikInput && prodiInput) : tahunAkademikInput)
    const total = allData.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const data = useMemo(() => allData.slice((page - 1) * perPage, page * perPage), [allData, page, perPage])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Persentase Choice Value</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {isAdministrator && (
                    <div className="relative w-56">
                        <Button type="button" variant="outline" className="h-9 w-full justify-start truncate" onClick={() => setIsProdiOpen((prev) => !prev)}>
                            {selectedProdiLabel}
                        </Button>
                        {isProdiOpen && (
                            <div className="absolute z-20 mt-1 w-full rounded-md border bg-background p-2 shadow-md">
                                <Input placeholder="Cari Prodi..." value={prodiQuery} onChange={(e) => setProdiQuery(e.target.value)} className="h-8" />
                                <div className="mt-2 max-h-56 overflow-y-auto">
                                    {prodiOptions.map((item) => (
                                        <button key={item.id} type="button" className="w-full rounded px-2 py-1 text-left text-sm hover:bg-muted" onClick={() => { setProdiInput(item.id); setIsProdiOpen(false) }}>
                                            {item.id} - {item.nama}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-9 w-48 justify-start">
                            {tahunAkademikInput || "Pilih Tahun Akademik"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Tahun Akademik</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={tahunAkademikInput} onValueChange={setTahunAkademikInput}>
                                <div className="max-h-56 overflow-y-auto">
                                    {tahunAkademikOptions.map((item) => (
                                        <DropdownMenuRadioItem key={item.tahunId} value={item.tahunId}>
                                            {item.tahunId}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </div>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="ml-auto flex items-center gap-3">
                    <Button disabled={!isFilterReady} onClick={() => {
                        setHasAppliedFilter(true)
                        setTahunAkademikFilter(tahunAkademikInput)
                        setProdiFilter(isAdministrator ? prodiInput : storedProgramCode)
                        setPage(1)
                    }}>
                        Filter
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg shadow-sm">
                {!hasAppliedFilter ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">Mohon isi filter terlebih dahulu</div>
                ) : loading ? (
                    <div className="py-10 text-center text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><Spinner className="size-4" />Sedang memuat data...</span></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tahun Akademik</TableHead>
                                <TableHead>Prodi</TableHead>
                                <TableHead>Dosen</TableHead>
                                <TableHead>Matakuliah</TableHead>
                                <TableHead>Value 1 (%)</TableHead>
                                <TableHead>Value 2 (%)</TableHead>
                                <TableHead>Value 3 (%)</TableHead>
                                <TableHead>Value 4 (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, idx) => (
                                <TableRow key={`${row.dosen?.Login ?? "dosen"}-${row.matakuliah?.MKID ?? "mk"}-${idx}`}>
                                    <TableCell>{row.TahunAkademik ?? "-"}</TableCell>
                                    <TableCell>
                                        <div>{row.prodi?.ProdiID ? String(row.prodi.ProdiID) : "-"}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.prodi?.Nama ?? "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{row.dosen?.Login ? String(row.dosen.Login) : "-"}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.dosen?.Nama ?? "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{row.matakuliah?.MKID ? String(row.matakuliah.MKID) : "-"}</div>
                                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                                            {row.matakuliah?.Nama ?? "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.precentageofchoicevalue?.["1"] ?? row.percentageofchoicevalue?.["1"] ?? 0}</TableCell>
                                    <TableCell>{row.precentageofchoicevalue?.["2"] ?? row.percentageofchoicevalue?.["2"] ?? 0}</TableCell>
                                    <TableCell>{row.precentageofchoicevalue?.["3"] ?? row.percentageofchoicevalue?.["3"] ?? 0}</TableCell>
                                    <TableCell>{row.precentageofchoicevalue?.["4"] ?? row.percentageofchoicevalue?.["4"] ?? 0}</TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                                        {errorMessage || "Tidak ada data untuk filter ini"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Per halaman</span>
                    <select className="rounded border px-2 py-1" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>Total {total}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Sebelumnya</Button>
                    <div className="text-sm text-muted-foreground">Halaman {page} / {lastPage}</div>
                    <Button size="sm" variant="outline" onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))} disabled={page >= lastPage}>Berikutnya</Button>
                </div>
            </div>
        </div>
    )
}

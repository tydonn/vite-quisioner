import { useEffect, useState } from "react"
import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon, FileQuestionIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import type { Aspect } from "@/features/question/types"

const choiceLabelOptions = [
    { label: "Sangat Puas", value: 4 },
    { label: "Puas", value: 3 },
    { label: "Kurang Puas", value: 2 },
    { label: "Tidak Puas", value: 1 },
]

type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void> | void
}

export function AddChoiceDialog({ open, onClose, onSuccess }: Props) {
    const [questions, setQuestions] = useState<Aspect[]>([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        aspectId: "",
        label: "Sangat Puas",
        value: 4,
        sortOrder: 1,
        isActive: true,
    })

    useEffect(() => {
        if (!open) return

        async function fetchQuestions() {
            try {
                const res = await api.get<{ data: Aspect[] }>("/questions", {
                    params: {
                        per_page: 500,
                        active: 1,
                    },
                })
                const rows = res.data.data ?? []
                setQuestions(rows)
                if (rows.length > 0 && !form.aspectId) {
                    setForm((prev) => ({
                        ...prev,
                        aspectId: String(rows[0].AspectID),
                    }))
                }
            } catch (error) {
                console.error("Gagal mengambil data pertanyaan", error)
            }
        }

        fetchQuestions()
    }, [open, form.aspectId])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.aspectId || !form.label.trim()) return

        setLoading(true)
        try {
            await api.post("/choices", {
                AspectID: Number(form.aspectId),
                ChoiceLabel: form.label.trim(),
                ChoiceValue: Number(form.value),
                SortOrder: Number(form.sortOrder),
                IsActive: form.isActive,
            })

            await onSuccess()
            onClose()
            setForm({
                aspectId: "",
                label: "Sangat Puas",
                value: 4,
                sortOrder: 1,
                isActive: true,
            })
        } catch (error) {
            console.error("Gagal menambah pilihan", error)
        } finally {
            setLoading(false)
        }
    }

    const selectedQuestion = questions.find(
        (question) => String(question.AspectID) === form.aspectId
    )
    const selectedQuestionLabel = selectedQuestion
        ? `${selectedQuestion.AspectID} - ${selectedQuestion.AspectText}`
        : "Pilih pertanyaan"

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tambah Pilihan</DialogTitle>
                    <DialogDescription>
                        Tambahkan pilihan jawaban baru tanpa keluar dari halaman ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Pertanyaan</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-auto min-h-9 w-full items-start justify-between whitespace-normal py-2"
                                >
                                    <span className="min-w-0 flex-1 whitespace-normal break-words text-left leading-snug">
                                        {selectedQuestionLabel}
                                    </span>
                                    <ChevronDownIcon className="mt-0.5 size-4 shrink-0 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[28rem] max-w-[calc(100vw-2rem)]">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Pilih Pertanyaan</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={form.aspectId}
                                        onValueChange={(value) =>
                                            setForm((prev) => ({ ...prev, aspectId: value }))
                                        }
                                    >
                                        <div className="max-h-56 overflow-y-auto">
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
                    </div>

                    <div className="space-y-2">
                        <Label>Label Pilihan</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span>{form.label}</span>
                                    <ChevronDownIcon className="size-4 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Pilih Label</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={form.label}
                                        onValueChange={(value) => {
                                            const selected = choiceLabelOptions.find(
                                                (option) => option.label === value
                                            )
                                            setForm((prev) => ({
                                                ...prev,
                                                label: value,
                                                value: selected?.value ?? prev.value,
                                            }))
                                        }}
                                    >
                                        {choiceLabelOptions.map((option) => (
                                            <DropdownMenuRadioItem
                                                key={option.label}
                                                value={option.label}
                                            >
                                                {option.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Nilai</Label>
                            <Input
                                type="number"
                                value={form.value}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, value: Number(e.target.value) }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Urutan</Label>
                            <Input
                                type="number"
                                min={1}
                                value={form.sortOrder}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span>{form.isActive ? "Aktif" : "Nonaktif"}</span>
                                    <ChevronDownIcon className="size-4 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Pilih Status</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={form.isActive ? "1" : "0"}
                                        onValueChange={(value) =>
                                            setForm((prev) => ({ ...prev, isActive: value === "1" }))
                                        }
                                    >
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading || !form.aspectId || !form.label.trim()}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

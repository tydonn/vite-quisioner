import { useEffect, useState } from "react"
import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon, ListIcon, ShapesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import api from "@/lib/api"
import type { Category } from "@/features/category/types"
import type { Respondent, RespondentListResponse } from "@/features/question/types"

type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void> | void
}

export function AddPertanyaanDialog({ open, onClose, onSuccess }: Props) {
    const [addLoading, setAddLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [respondents, setRespondents] = useState<Respondent[]>([])
    const [newQuestion, setNewQuestion] = useState({
        categoryId: "",
        respondentId: "",
        aspectText: "",
        answerType: "CHOICE" as "CHOICE" | "TEXT" | "LIKERT",
        sortOrder: 1,
        isActive: true,
    })

    useEffect(() => {
        if (!open) return
        async function fetchOptions() {
            try {
                const [categoryRes, respondentRes] = await Promise.all([
                    api.get<{ data: Category[] }>("/categories"),
                    api.get<RespondentListResponse>("/respondents"),
                ])

                const categoryData = categoryRes.data.data ?? []
                const respondentData = respondentRes.data.data ?? []

                setCategories(categoryData)
                setRespondents(respondentData)

                if (categoryData.length > 0) {
                    setNewQuestion((prev) => ({
                        ...prev,
                        categoryId: prev.categoryId || String(categoryData[0].CategoryID),
                    }))
                }
                if (respondentData.length > 0) {
                    setNewQuestion((prev) => ({
                        ...prev,
                        respondentId: prev.respondentId || String(respondentData[0].RespondentID),
                    }))
                }
            } catch (error) {
                console.error("Gagal mengambil opsi pertanyaan", error)
            }
        }
        fetchOptions()
    }, [open])

    async function handleAddQuestion(e: React.FormEvent) {
        e.preventDefault()
        if (!newQuestion.categoryId || !newQuestion.aspectText.trim()) return
        setAddLoading(true)
        try {
            await api.post("/questions", {
                CategoryID: Number(newQuestion.categoryId),
                RespondentID: newQuestion.respondentId ? Number(newQuestion.respondentId) : null,
                AspectText: newQuestion.aspectText.trim(),
                AnswerType: newQuestion.answerType,
                ChoiceTypeID: null,
                SortOrder: Number(newQuestion.sortOrder),
                IsActive: newQuestion.isActive,
            })
            await onSuccess()
            onClose()
            setNewQuestion({
                categoryId: "",
                respondentId: "",
                aspectText: "",
                answerType: "CHOICE",
                sortOrder: 1,
                isActive: true,
            })
        } catch (error) {
            console.error("Gagal menambah pertanyaan", error)
        } finally {
            setAddLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tambah Pertanyaan</DialogTitle>
                    <DialogDescription>
                        Tambahkan pertanyaan baru disini. Pastikan pertanyaan yang Anda tambahkan belum ada di sini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Pertanyaan</Label>
                        <Input
                            value={newQuestion.aspectText}
                            onChange={(e) =>
                                setNewQuestion((prev) => ({ ...prev, aspectText: e.target.value }))
                            }
                            placeholder="Masukkan teks pertanyaan"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Kategori</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="truncate">
                                        {categories.find((c) => String(c.CategoryID) === newQuestion.categoryId)?.CategoryName ?? "Pilih kategori"}
                                    </span>
                                    <ChevronDownIcon className="size-4 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={newQuestion.categoryId}
                                        onValueChange={(value) =>
                                            setNewQuestion((prev) => ({ ...prev, categoryId: value }))
                                        }
                                    >
                                        <div className="max-h-56 overflow-y-auto">
                                            {categories.map((category) => (
                                                <DropdownMenuRadioItem
                                                    key={category.CategoryID}
                                                    value={String(category.CategoryID)}
                                                >
                                                    <ShapesIcon />
                                                    {category.CategoryName}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </div>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Responden</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span className="truncate">
                                            {respondents.find((item) => String(item.RespondentID) === newQuestion.respondentId)?.RespondentName ?? "Pilih responden"}
                                        </span>
                                        <ChevronDownIcon className="size-4 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Pilih Responden</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={newQuestion.respondentId}
                                            onValueChange={(value) =>
                                                setNewQuestion((prev) => ({ ...prev, respondentId: value }))
                                            }
                                        >
                                            <div className="max-h-56 overflow-y-auto">
                                                {respondents.map((respondent) => (
                                                    <DropdownMenuRadioItem
                                                        key={respondent.RespondentID}
                                                        value={String(respondent.RespondentID)}
                                                    >
                                                        <ListIcon />
                                                        {respondent.RespondentName}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </div>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Tipe Jawaban</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span>{newQuestion.answerType}</span>
                                        <ChevronDownIcon className="size-4 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Pilih Tipe Jawaban</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={newQuestion.answerType}
                                            onValueChange={(value) =>
                                                setNewQuestion((prev) => ({
                                                    ...prev,
                                                    answerType: value as "CHOICE" | "TEXT" | "LIKERT",
                                                }))
                                            }
                                        >
                                            <DropdownMenuRadioItem value="CHOICE">
                                                <ListIcon />
                                                CHOICE
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="TEXT">
                                                <ListIcon />
                                                TEXT
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="LIKERT">
                                                <ListIcon />
                                                LIKERT
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Urutan</Label>
                            <Input
                                type="number"
                                min={1}
                                value={newQuestion.sortOrder}
                                onChange={(e) =>
                                    setNewQuestion((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span>{newQuestion.isActive ? "Aktif" : "Nonaktif"}</span>
                                        <ChevronDownIcon className="size-4 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Pilih Status</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={newQuestion.isActive ? "1" : "0"}
                                            onValueChange={(value) =>
                                                setNewQuestion((prev) => ({ ...prev, isActive: value === "1" }))
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
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={addLoading}>
                            {addLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

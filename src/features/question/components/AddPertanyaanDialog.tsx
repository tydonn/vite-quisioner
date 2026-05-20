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

type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void> | void
}

export function AddPertanyaanDialog({ open, onClose, onSuccess }: Props) {
    const [addLoading, setAddLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [newQuestion, setNewQuestion] = useState({
        categoryId: "",
        aspectText: "",
        answerType: "CHOICE" as "CHOICE" | "TEXT" | "LIKERT",
        sortOrder: 1,
        isActive: true,
    })

    useEffect(() => {
        if (!open) return
        async function fetchCategories() {
            try {
                const res = await api.get<{ data: Category[] }>("/categories")
                setCategories(res.data.data ?? [])
                if ((res.data.data ?? []).length > 0 && !newQuestion.categoryId) {
                    setNewQuestion((prev) => ({
                        ...prev,
                        categoryId: String(res.data.data[0].CategoryID),
                    }))
                }
            } catch (error) {
                console.error("Gagal mengambil kategori", error)
            }
        }
        fetchCategories()
    }, [open, newQuestion.categoryId])

    async function handleAddQuestion(e: React.FormEvent) {
        e.preventDefault()
        if (!newQuestion.categoryId || !newQuestion.aspectText.trim()) return
        setAddLoading(true)
        try {
            await api.post("/questions", {
                CategoryID: Number(newQuestion.categoryId),
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


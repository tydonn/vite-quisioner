import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useEffect, useState } from "react"
import type { PertanyaanView } from "@/features/question/view-types"
import type { Category } from "@/features/category/types"
import type { Respondent, RespondentListResponse } from "@/features/question/types"
import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon, ListIcon, ShapesIcon, UsersIcon } from "lucide-react"

type Props = {
    open: boolean
    data: PertanyaanView | null
    onClose: () => void
    onSuccess: () => void
}

export function EditPertanyaanDialog({
    open,
    data,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState<PertanyaanView | null>(data)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [respondents, setRespondents] = useState<Respondent[]>([])

    useEffect(() => {
        if (!open) return

        async function fetchOptions() {
            try {
                const [categoryRes, respondentRes] = await Promise.all([
                    api.get<{ data: Category[] }>("/categories"),
                    api.get<RespondentListResponse>("/respondents"),
                ])
                setCategories(categoryRes.data.data ?? [])
                setRespondents(respondentRes.data.data ?? [])
            } catch (error) {
                console.error("Gagal mengambil opsi pertanyaan", error)
            }
        }

        fetchOptions()
    }, [open])

    // sync saat data berubah
    if (data && form?.id !== data.id) {
        setForm(data)
    }

    if (!form) return null

    function mapTipeToAnswerType(
        tipe: PertanyaanView["tipe"]
    ): "CHOICE" | "TEXT" | "LIKERT" {
        switch (tipe) {
            case "Teks":
                return "TEXT"
            case "Likert":
                return "LIKERT"
            case "Pilihan":
            default:
                return "CHOICE"
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!form) return // ⬅️ ini kuncinya

        setLoading(true)

        try {
            await api.put(`/questions/${form.id}`, {
                AspectText: form.pertanyaan,
                CategoryID: form.kategoriId,
                RespondentID: form.respondenId ? Number(form.respondenId) : null,
                AnswerType: mapTipeToAnswerType(form.tipe),
                SortOrder: Number(form.urutan),
                IsActive: form.status === "Aktif" ? 1 : 0,
            })

            onSuccess()
            onClose()
        } catch (err) {
            console.error("Gagal update pertanyaan", err)
        } finally {
            setLoading(false)
        }
    }


    const selectedCategoryLabel =
        categories.find((category) => category.CategoryID === form.kategoriId)?.CategoryName
        ?? form.kategori
        ?? "Pilih kategori"
    const selectedRespondentLabel =
        respondents.find((respondent) => String(respondent.RespondentID) === String(form.respondenId))?.RespondentName
        ?? form.responden
        ?? "Pilih responden"

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Pertanyaan</DialogTitle>
                    <DialogDescription>
                        Buat perubahan pada pertanyaan di sini. Klik simpan ketika Anda selesai.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <Label>Pertanyaan</Label>
                            <Textarea
                                value={form.pertanyaan}
                                onChange={(e) =>
                                    setForm({ ...form, pertanyaan: e.target.value })
                                }
                                className="min-h-24 break-words whitespace-pre-wrap"
                            />
                        </Field>

                        <Field>
                            <Label>Kategori</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span className="truncate">{selectedCategoryLabel}</span>
                                        <ChevronDownIcon className="size-4 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={String(form.kategoriId)}
                                            onValueChange={(value) =>
                                                setForm({
                                                    ...form,
                                                    kategoriId: Number(value),
                                                })
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
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <Label>Responden</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="truncate">{selectedRespondentLabel}</span>
                                            <ChevronDownIcon className="size-4 opacity-70" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="min-w-56">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Pilih Responden</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup
                                                value={form.respondenId ?? ""}
                                                onValueChange={(value) =>
                                                    setForm({
                                                        ...form,
                                                        respondenId: value || null,
                                                    })
                                                }
                                            >
                                                <div className="max-h-56 overflow-y-auto">
                                                    {respondents.map((respondent) => (
                                                        <DropdownMenuRadioItem
                                                            key={respondent.RespondentID}
                                                            value={String(respondent.RespondentID)}
                                                        >
                                                            <UsersIcon />
                                                            {respondent.RespondentName}
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </div>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Field>

                            <Field>
                                <Label>Tipe Jawaban</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            <span>{mapTipeToAnswerType(form.tipe)}</span>
                                            <ChevronDownIcon className="size-4 opacity-70" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="min-w-56">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Pilih Tipe Jawaban</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup
                                                value={mapTipeToAnswerType(form.tipe)}
                                                onValueChange={(value) =>
                                                    setForm({
                                                        ...form,
                                                        tipe:
                                                            value === "TEXT"
                                                                ? "Teks"
                                                                : value === "LIKERT"
                                                                    ? "Likert"
                                                                    : "Pilihan",
                                                    })
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
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <Label>Urutan</Label>
                                <Input
                                    type="number"
                                    value={form.urutan}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            urutan: Number(e.target.value),
                                        })
                                    }
                                />
                            </Field>

                            <Field>
                                <Label>Status</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            <span>{form.status}</span>
                                            <ChevronDownIcon className="size-4 opacity-70" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="min-w-56">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Pilih Status</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup
                                                value={form.status}
                                                onValueChange={(value) =>
                                                    setForm({
                                                        ...form,
                                                        status: value as "Aktif" | "Nonaktif",
                                                    })
                                                }
                                            >
                                                <DropdownMenuRadioItem value="Aktif">
                                                    <CheckCircle2Icon />
                                                    Aktif
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Nonaktif">
                                                    <CircleOffIcon />
                                                    Nonaktif
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}

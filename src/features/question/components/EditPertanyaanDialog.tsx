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
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuLabel,
//     DropdownMenuRadioGroup,
//     DropdownMenuRadioItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import type { PertanyaanView } from "@/features/question/view-types"
import type { Category } from "@/features/category/types"

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

    useEffect(() => {
        if (!open) return

        async function fetchCategories() {
            try {
                const res = await api.get<{ data: Category[] }>("/categories")
                setCategories(res.data.data)
            } catch (error) {
                console.error("Gagal mengambil data kategori", error)
            }
        }

        fetchCategories()
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
                AnswerType: mapTipeToAnswerType(form.tipe),
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


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Pertanyaan</DialogTitle>
                    <DialogDescription>
                        Buat perubahan pada pertanyaan di sini. Klik simpan ketika Anda selesai.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Label>Pertanyaan</Label>
                        <Input
                            value={form.pertanyaan}
                            onChange={(e) =>
                                setForm({ ...form, pertanyaan: e.target.value })
                            }
                        />
                    </Field>

                    <Field>
                        <Label>Kategori</Label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={form.kategoriId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    kategoriId: Number(e.target.value),
                                })
                            }
                        >
                            {!categories.some(
                                (category) => category.CategoryID === form.kategoriId
                            ) && (
                                    <option value={form.kategoriId}>
                                        {form.kategori}
                                    </option>
                                )}
                            {categories.map((category) => (
                                <option
                                    key={category.CategoryID}
                                    value={category.CategoryID}
                                >
                                    {category.CategoryName}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field>
                        <Label>Tipe Jawaban</Label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={form.tipe}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    tipe: e.target.value as PertanyaanView["tipe"],
                                })
                            }
                        >
                            <option value="Pilihan">Pilihan</option>
                            <option value="Teks">Teks</option>
                            <option value="Likert">Likert</option>
                        </select>
                    </Field>

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
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={form.status}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    status: e.target.value as "Aktif" | "Nonaktif",
                                })
                            }
                        >
                            <option value="Aktif">Aktif</option>
                            <option value="Nonaktif">Nonaktif</option>
                        </select>
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild >
                                <Button variant="outline">Pilih Status</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-32">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Pilih Status</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup value={form.status} onValueChange={(value) => setForm({ ...form, status: value as "Aktif" | "Nonaktif" })}>
                                        <DropdownMenuRadioItem value="Aktif">Aktif</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Nonaktif">Nonaktif</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </Field>

                </FieldGroup>

                <form onSubmit={handleSubmit}>
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

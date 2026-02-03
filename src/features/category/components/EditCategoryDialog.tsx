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

import api from "@/lib/api"
import { useEffect, useState } from "react"
import type { KategoriView } from "@/features/category/view-types"

type Props = {
    open: boolean
    data: KategoriView | null
    onClose: () => void
    onSuccess: () => void
}

export function EditCategoryDialog({
    open,
    data,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState<KategoriView | null>(data)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (data) {
            setForm(data)
        }
    }, [data?.id])

    if (!form) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!form) return

        setLoading(true)

        const payload = {
            CategoryID: form.id,
            CategoryName: form.nama,
            Description: form.deskripsi,
            SortOrder: form.urutan,
            IsActive: form.status === "Aktif" ? 1 : 0,
        }

        try {
            await api.put(`/categories/${form.id}`, payload)

            onSuccess()
            onClose()
        } catch (err) {
            console.error("Gagal update kategori", err)
            console.error("Payload update kategori", payload)
            const error = err as {
                response?: { status?: number; data?: unknown }
            }
            console.error("Response status", error.response?.status)
            console.error("Response data", error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Kategori</DialogTitle>
                    <DialogDescription>
                        Buat perubahan pada kategori di sini. Klik simpan ketika Anda selesai.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Label>Nama</Label>
                        <Input
                            value={form.nama}
                            onChange={(e) =>
                                setForm({ ...form, nama: e.target.value })
                            }
                        />
                    </Field>

                    <Field>
                        <Label>Deskripsi</Label>
                        <Input
                            value={form.deskripsi}
                            onChange={(e) =>
                                setForm({ ...form, deskripsi: e.target.value })
                            }
                        />
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

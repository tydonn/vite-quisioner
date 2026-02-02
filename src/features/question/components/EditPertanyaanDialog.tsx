import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import api from "@/lib/api"
import { useState } from "react"
import type { PertanyaanView } from "@/features/question/view-types"

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

    // sync saat data berubah
    if (data && form?.id !== data.id) {
        setForm(data)
    }

    if (!form) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!form) return // ⬅️ ini kuncinya

        setLoading(true)

        try {
            await api.put(`/questions/${form.id}`, {
                AspectText: form.pertanyaan,
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
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Pertanyaan</DialogTitle>
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

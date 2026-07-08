import { useState } from "react"
import { CheckCircle2Icon, ChevronDownIcon, CircleOffIcon } from "lucide-react"

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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import api from "@/lib/api"

type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void> | void
}

export function AddCategoryDialog({ open, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: "",
        deskripsi: "",
        urutan: 1,
        status: "Aktif" as "Aktif" | "Nonaktif",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.nama.trim()) return

        setLoading(true)

        try {
            await api.post("/categories", {
                CategoryName: form.nama.trim(),
                Description: form.deskripsi.trim(),
                SortOrder: Number(form.urutan),
                IsActive: form.status === "Aktif" ? 1 : 0,
            })

            await onSuccess()
            onClose()
            setForm({
                nama: "",
                deskripsi: "",
                urutan: 1,
                status: "Aktif",
            })
        } catch (error) {
            console.error("Gagal menambah kategori", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tambah Kategori</DialogTitle>
                    <DialogDescription>
                        Tambahkan kategori pertanyaan baru. Klik simpan ketika data sudah sesuai.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <Label>Nama</Label>
                            <Input
                                value={form.nama}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, nama: e.target.value }))
                                }
                                placeholder="Masukkan nama kategori"
                                required
                            />
                        </Field>

                        <Field>
                            <Label>Deskripsi</Label>
                            <Input
                                value={form.deskripsi}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, deskripsi: e.target.value }))
                                }
                                placeholder="Masukkan deskripsi kategori"
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <Label>Urutan</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={form.urutan}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            urutan: Number(e.target.value),
                                        }))
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
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        status: value as "Aktif" | "Nonaktif",
                                                    }))
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
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

import {
    FileTextIcon,
    LayersIcon,
    ListIcon,
    InfoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"

export default function QuestionForm() {
    return (
        <div className="space-y-6">

            {/* Pertanyaan */}
            <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <InputGroup>
                    <InputGroupInput placeholder="Masukkan teks pertanyaan" />
                    <InputGroupAddon>
                        <FileTextIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Kategori */}
            <div className="space-y-2">
                <Label>Kategori</Label>
                <InputGroup>
                    <InputGroupInput placeholder="Contoh: Kepuasan, Fasilitas" />
                    <InputGroupAddon>
                        <LayersIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Tipe Jawaban */}
            <div className="space-y-2">
                <Label>Tipe Jawaban</Label>
                <InputGroup>
                    <InputGroupInput placeholder="Text / Radio / Checkbox" />
                    <InputGroupAddon>
                        <ListIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
                <Label>Keterangan (opsional)</Label>
                <InputGroup>
                    <InputGroupInput placeholder="Contoh: wajib diisi" />
                    <InputGroupAddon align="inline-end">
                        <InfoIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Action */}
            <div className="flex justify-end gap-2">
                <Button variant="outline">Batal</Button>
                <Button>Simpan Pertanyaan</Button>
            </div>
        </div>
    )
}

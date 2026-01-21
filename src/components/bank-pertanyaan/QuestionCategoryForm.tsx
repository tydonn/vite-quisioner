import {
    HashIcon,
    LayersIcon,
    PercentIcon,
    ListIcon,
    PowerIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function QuestionCategoryForm() {
    return (
        <div className="space-y-6">

            {/* Kode */}
            <div className="space-y-2">
                <Label>Kode Kategori</Label>
                <InputGroup>
                    <InputGroupInput placeholder="contoh: kepuasan" />
                    <InputGroupAddon>
                        <HashIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Nama */}
            <div className="space-y-2">
                <Label>Nama Kategori</Label>
                <InputGroup>
                    <InputGroupInput placeholder="Contoh: Kepuasan Mahasiswa" />
                    <InputGroupAddon>
                        <LayersIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Bobot Persen */}
            <div className="space-y-2">
                <Label>Bobot (%)</Label>
                <InputGroup>
                    <InputGroupInput
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0 - 100"
                    />
                    <InputGroupAddon>
                        <PercentIcon className="h-4 w-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Tipe Jawaban */}
            <div className="space-y-2">
                <Label>Tipe Jawaban</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe jawaban" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="likert">Likert (Sangat Puas - Tidak Puas)</SelectItem>
                        <SelectItem value="rating">Rating (1 - 5)</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="boolean">Ya / Tidak</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="active">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Nonaktif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Action */}
            <div className="flex justify-end gap-2">
                <Button variant="outline">Batal</Button>
                <Button>Simpan Kategori</Button>
            </div>
        </div>
    )
}

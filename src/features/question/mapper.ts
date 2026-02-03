import type { Aspect } from "./types"
import type { PertanyaanView, TipeJawaban, StatusAktif } from "./view-types"

function formatKode(id: number): string {
    return `P${id.toString().padStart(3, "0")}`
}

function mapAnswerType(type: string): TipeJawaban {
    switch (type) {
        case "CHOICE":
            return "Pilihan"
        case "TEXT":
            return "Teks"
        case "LIKERT":
            return "Likert"
        default:
            return "Pilihan"
    }
}

function mapStatus(isActive: number): StatusAktif {
    return isActive === 1 ? "Aktif" : "Nonaktif"
}

export function mapAspectToPertanyaanView(
    aspect: Aspect
): PertanyaanView {
    return {
        id: aspect.AspectID,
        kode: formatKode(aspect.AspectID),
        pertanyaan: aspect.AspectText,
        kategoriId: aspect.CategoryID,
        kategori: aspect.category?.CategoryName ?? "-",
        tipe: mapAnswerType(aspect.AnswerType),
        urutan: aspect.SortOrder,
        status: mapStatus(aspect.IsActive),
    }
}

export function mapAspectListToView(
    data: Aspect[]
): PertanyaanView[] {
    return data.map(mapAspectToPertanyaanView)
}

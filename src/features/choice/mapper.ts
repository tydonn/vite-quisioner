import type { Choice } from "./types"
import type { ChoiceView, StatusAktif } from "./view-types"

function formatKode(id: number): string {
    return `C${id.toString().padStart(3, "0")}`
}

function mapStatus(isActive: number): StatusAktif {
    return isActive === 1 ? "Aktif" : "Nonaktif"
}

export function mapChoiceToView(choice: Choice): ChoiceView {
    return {
        id: choice.ChoiceID,
        kode: formatKode(choice.ChoiceID),
        label: choice.ChoiceLabel,
        nilai: choice.ChoiceValue,
        urutan: choice.SortOrder,
        status: mapStatus(choice.IsActive),
        pertanyaan: choice.question?.AspectText ?? "-",
    }
}

export function mapChoiceListToView(data: Choice[]): ChoiceView[] {
    return data.map(mapChoiceToView)
}

import type { ChoiceType } from "./types"
import type { ChoiceTypeView, StatusAktif } from "./view-types"

function mapStatus(isActive: number): StatusAktif {
    return isActive === 1 ? "Aktif" : "Nonaktif"
}

export function mapChoiceTypeToView(choice: ChoiceType): ChoiceTypeView {
    return {
        id: choice.ChoiceTypeID,
        kode: choice.TypeCode,
        nama: choice.TypeName,
        deskripsi: choice.Description ?? "-",
        status: mapStatus(choice.IsActive),
    }
}

export function mapChoiceTypeListToView(data: ChoiceType[]): ChoiceTypeView[] {
    return data.map(mapChoiceTypeToView)
}

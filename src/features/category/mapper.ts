import type { Category } from "./types"
import type { KategoriView, StatusAktif } from "./view-types"

function formatKode(id: number): string {
    return `K${id.toString().padStart(2, "0")}`
}

function mapStatus(isActive: number): StatusAktif {
    return isActive === 1 ? "Aktif" : "Nonaktif"
}

export function mapCategoryToView(category: Category): KategoriView {
    return {
        id: category.CategoryID,
        kode: formatKode(category.CategoryID),
        nama: category.CategoryName,
        deskripsi: category.Description,
        urutan: category.SortOrder,
        status: mapStatus(category.IsActive),
    }
}

export function mapCategoryListToView(data: Category[]): KategoriView[] {
    return data.map(mapCategoryToView)
}

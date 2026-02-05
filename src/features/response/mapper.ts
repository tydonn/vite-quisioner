import type { Response } from "./types"
import type { ResponseView } from "./view-types"

export function mapResponseToView(item: Response): ResponseView {
    return {
        id: item.ResponID,
        mahasiswaId: item.MahasiswaID,
        dosenId: item.DosenID,
        matakuliahId: item.MatakuliahID,
        tahunAkademik: item.TahunAkademik,
        semester: item.Semester,
        createdAt: item.CreatedAt,
    }
}

export function mapResponseListToView(data: Response[]): ResponseView[] {
    return data.map(mapResponseToView)
}
